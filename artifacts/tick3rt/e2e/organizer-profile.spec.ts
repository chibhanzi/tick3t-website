import { test, expect, type Browser } from "@playwright/test";

const password = "Task42pass!";
const authKey = "tick3t.mock-auth.user";

const signInAsOrganizer = async (
  browser: Browser,
  email: string,
) => {
  const context = await browser.newContext();
  const response = await context.request.post(
    "http://localhost:24122/api/auth/sign-in",
    { data: { email, password } },
  );
  expect(response.ok()).toBe(true);
  const user = await response.json();
  const page = await context.newPage();
  await page.goto("/");
  await page.evaluate(
    ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
    { key: authKey, value: user },
  );
  await page.goto("/organizer-dashboard");
  return { context, page };
};

test("organiser profile survives a fresh browser session", async ({ browser }) => {
  const email = `profile-${Date.now()}@example.com`;
  const contextA = await browser.newContext();
  const signupResponse = await contextA.request.post(
    "http://localhost:24122/api/auth/sign-up",
    {
      data: {
        email,
        password,
        displayName: "Persistent Profile Organiser",
        role: "organizer",
      },
    },
  );
  expect(signupResponse.status()).toBe(201);
  const user = await signupResponse.json();
  const pageA = await contextA.newPage();

  await pageA.goto("/");
  await pageA.evaluate(
    ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
    { key: authKey, value: user },
  );
  await pageA.goto("/organizer-dashboard");

  await pageA.getByRole("tab", { name: "Settings" }).click();
  await pageA.locator("#bio").fill("Saved across authenticated browsers");
  await pageA.locator("#instagram").fill("browser_insta");
  await pageA.locator("#twitter").fill("browser_x");
  await pageA.getByRole("button", { name: "Save Changes" }).click();
  await expect(pageA.getByRole("button", { name: "Saved!" })).toBeVisible();
  await contextA.close();

  const { context: contextB, page: pageB } = await signInAsOrganizer(
    browser,
    email,
  );
  await expect(pageB.getByText("Saved across authenticated browsers")).toBeVisible();
  await expect(pageB.getByRole("link", { name: "@browser_insta" })).toBeVisible();
  await expect(pageB.getByRole("link", { name: "@browser_x" })).toBeVisible();
  await contextB.close();
});