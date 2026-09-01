import {
  expect,
  test,
  type Browser,
  type BrowserContext,
  type Page,
} from "@playwright/test";

const appUrl = "http://localhost:80";
const authKey = "tick3t.mock-auth.user";

const uniqueEmail = (label: string) =>
  `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;

async function authenticatedContext(
  browser: Browser,
  role: "user" | "organizer" = "user",
  email = uniqueEmail(role),
) {
  const context = await browser.newContext({ baseURL: appUrl });
  const response = await context.request.post("/api/auth/sign-up", {
    data: {
      email,
      password: "password123",
      displayName: role === "organizer" ? "Limits Organizer" : "Limits Attendee",
      role,
    },
  });
  expect(response.status()).toBe(201);
  const profile = await response.json();
  const page = await context.newPage();
  await page.goto("/");
  await page.evaluate(
    ({ key, user }) => localStorage.setItem(key, JSON.stringify(user)),
    { key: authKey, user: profile },
  );
  await page.reload();
  return { context, page, email };
}

async function signedInContext(browser: Browser, email: string) {
  const context = await browser.newContext({ baseURL: appUrl });
  const response = await context.request.post("/api/auth/sign-in", {
    data: { email, password: "password123" },
  });
  expect(response.ok()).toBe(true);
  const profile = await response.json();
  const page = await context.newPage();
  await page.goto("/");
  await page.evaluate(
    ({ key, user }) => localStorage.setItem(key, JSON.stringify(user)),
    { key: authKey, user: profile },
  );
  await page.reload();
  return { context, page };
}

async function closeAll(...contexts: BrowserContext[]) {
  await Promise.all(contexts.map((context) => context.close()));
}

test.describe("Server-enforced ticket purchase limits", () => {
  test("caps purchases and restores the same total in another browser", async ({
    browser,
  }) => {
    const firstDevice = await authenticatedContext(browser);
    await firstDevice.page.goto("/event/1");

    await expect(
      firstDevice.page.getByText("4 tickets per account · 4 remaining for you"),
    ).toBeVisible();
    const increase = firstDevice.page.getByRole("button", {
      name: "Increase ticket quantity",
    });
    await increase.click();
    await increase.click();
    await increase.click();
    await expect(firstDevice.page.getByTestId("ticket-quantity")).toHaveText("4");

    await firstDevice.page.getByRole("button", { name: "Get Tickets" }).click();
    await expect(
      firstDevice.page.getByText(/4-ticket account limit · 0 remaining for you/),
    ).toBeVisible();
    await firstDevice.page.getByRole("button", { name: "Skip for now" }).click();
    await expect(
      firstDevice.page.getByRole("button", {
        name: "Account ticket limit reached",
      }),
    ).toBeDisabled();

    const bypassAttempt = await firstDevice.context.request.post(
      "/api/events/1/purchase",
      { data: { quantity: 1 } },
    );
    expect(bypassAttempt.status()).toBe(409);
    const fractionalAttempt = await firstDevice.context.request.post(
      "/api/events/1/purchase",
      { data: { quantity: 1.5 } },
    );
    expect(fractionalAttempt.status()).toBe(400);

    const secondDevice = await signedInContext(browser, firstDevice.email);
    await secondDevice.page.goto("/event/1");
    await expect(
      secondDevice.page.getByText(/4-ticket account limit · 0 remaining for you/),
    ).toBeVisible();
    await expect(
      secondDevice.page.getByRole("button", {
        name: "Account ticket limit reached",
      }),
    ).toBeDisabled();

    const otherAccount = await authenticatedContext(browser);
    await otherAccount.page.goto("/event/1");
    await expect(
      otherAccount.page.getByText("4 tickets per account · 4 remaining for you"),
    ).toBeVisible();

    await closeAll(
      firstDevice.context,
      secondDevice.context,
      otherAccount.context,
    );
  });

  test("serializes concurrent purchases against remaining inventory", async ({
    browser,
  }) => {
    const organizer = await authenticatedContext(browser, "organizer");
    const fractionalEvent = await organizer.context.request.post("/api/events", {
      data: {
        title: "Invalid fractional inventory",
        date: "September 2, 2026",
        time: "7:00 PM",
        location: "Test Hall",
        fullAddress: "2 Test Way",
        description: "Validation verification",
        image:
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=600&fit=crop",
        category: "Test",
        total: 3.5,
        price: 10,
        currency: "USD",
        purchaseLimitPerAccount: 2.5,
        tags: [],
        amenities: [],
      },
    });
    expect(fractionalEvent.status()).toBe(400);

    const created = await organizer.context.request.post("/api/events", {
      data: {
        title: `Concurrent limit ${Date.now()}`,
        date: "September 2, 2026",
        time: "7:00 PM",
        location: "Test Hall",
        fullAddress: "2 Test Way",
        description: "Concurrent inventory verification",
        image:
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=600&fit=crop",
        category: "Test",
        total: 3,
        price: 10,
        currency: "USD",
        purchaseLimitPerAccount: 3,
        tags: [],
        amenities: [],
      },
    });
    expect(created.status()).toBe(201);
    const event = await created.json();

    const buyerOne = await authenticatedContext(browser);
    const buyerTwo = await authenticatedContext(browser);
    const responses = await Promise.all([
      buyerOne.context.request.post(`/api/events/${event.id}/purchase`, {
        data: { quantity: 2 },
      }),
      buyerTwo.context.request.post(`/api/events/${event.id}/purchase`, {
        data: { quantity: 2 },
      }),
    ]);

    expect(responses.map((response) => response.status()).sort()).toEqual([
      200, 409,
    ]);
    const finalEvent = await organizer.context.request.get(
      `/api/events/${event.id}`,
    );
    expect(finalEvent.ok()).toBe(true);
    await expect(finalEvent.json()).resolves.toMatchObject({
      available: 1,
      attendees: 2,
      total: 3,
    });

    await closeAll(
      organizer.context,
      buyerOne.context,
      buyerTwo.context,
    );
  });

  test("events without an account limit retain the ten-ticket range", async ({
    browser,
  }) => {
    const attendee = await authenticatedContext(browser);
    await attendee.page.goto("/event/3");

    await expect(attendee.page.getByText(/tickets per account/)).toHaveCount(0);
    const increase = attendee.page.getByRole("button", {
      name: "Increase ticket quantity",
    });
    for (let index = 1; index < 10; index += 1) {
      await increase.click();
    }

    await expect(attendee.page.getByTestId("ticket-quantity")).toHaveText("10");
    await expect(increase).toBeDisabled();
    await expect(
      attendee.page.getByRole("button", { name: "Get Tickets" }),
    ).toBeEnabled();
    await attendee.context.close();
  });
});