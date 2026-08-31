import { expect, test, type Page } from "@playwright/test";

const authKey = "tick3t.mock-auth.user";
const purchasesKey = "tick3t.ticket-purchases";

const mockAttendee = (id: string) => ({
  id,
  email: `${id}@example.com`,
  name: `Attendee ${id}`,
  role: "user",
  isOrganizer: false,
  isAdmin: false,
  profilePicture: "",
  isVerified: true,
});

async function switchAccount(page: Page, accountId: string) {
  await page.evaluate(
    ({ key, user }) => localStorage.setItem(key, JSON.stringify(user)),
    { key: authKey, user: mockAttendee(accountId) },
  );
  await page.reload();
}

test.describe("Per-account ticket purchase limits", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(
      ({ key, purchases, user }) => {
        localStorage.setItem(key, JSON.stringify(user));
        localStorage.removeItem(purchases);
      },
      { key: authKey, purchases: purchasesKey, user: mockAttendee("limit-a") },
    );
  });

  test("caps purchases, survives refresh, and remains isolated by account", async ({ page }) => {
    await page.goto("/event/1");

    await expect(page.getByText("4 tickets per account · 4 remaining for you")).toBeVisible();
    const increase = page.getByRole("button", { name: "Increase ticket quantity" });
    await increase.click();
    await increase.click();
    await increase.click();
    await expect(page.getByTestId("ticket-quantity")).toHaveText("4");
    await expect(increase).toBeDisabled();

    await page.getByRole("button", { name: "Get Tickets" }).click();
    await expect(page.getByText("You have reached this event's 4-ticket account limit.")).toBeVisible();
    await page.getByRole("button", { name: "Skip for now" }).click();
    await expect(page.getByRole("button", { name: "Account ticket limit reached" })).toBeDisabled();
    await expect.poll(() =>
      page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}")["limit-a"]?.["1"], purchasesKey)
    ).toBe(4);

    await page.reload();
    await expect(page.getByText("You have reached this event's 4-ticket account limit.")).toBeVisible();

    await switchAccount(page, "limit-b");
    await expect(page.getByText("4 tickets per account · 4 remaining for you")).toBeVisible();
    await expect(page.getByRole("button", { name: "Get Tickets" })).toBeEnabled();

    await switchAccount(page, "limit-a");
    await expect(page.getByText("You have reached this event's 4-ticket account limit.")).toBeVisible();
  });

  test("legacy events without a limit retain the ten-ticket quantity range", async ({ page }) => {
    await page.goto("/event/3");

    await expect(page.getByText(/tickets per account/)).toHaveCount(0);
    const increase = page.getByRole("button", { name: "Increase ticket quantity" });
    for (let index = 1; index < 10; index += 1) {
      await increase.click();
    }

    await expect(page.getByTestId("ticket-quantity")).toHaveText("10");
    await expect(increase).toBeDisabled();
    await expect(page.getByRole("button", { name: "Get Tickets" })).toBeEnabled();
  });
});