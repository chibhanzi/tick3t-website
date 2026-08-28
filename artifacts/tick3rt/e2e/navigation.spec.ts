import { test, expect } from "@playwright/test";

type MockUser = {
  id: string;
  email: string;
  name: string;
  role: "user" | "organizer";
  isOrganizer: boolean;
  isAdmin: boolean;
  profilePicture: string;
  isVerified: boolean;
};

const authKey = "tick3t.mock-auth.user";

const userForRole = (role: MockUser["role"]): MockUser => ({
  id: `navigation-${role}`,
  email: `${role}@example.com`,
  name: role === "organizer" ? "Navigation Organizer" : "Navigation Attendee",
  role,
  isOrganizer: role === "organizer",
  isAdmin: false,
  profilePicture: "",
  isVerified: true,
});

const setMockUser = async (page: Parameters<typeof test>[0]["page"], role: MockUser["role"]) => {
  await page.addInitScript(
    ({ key, user }) => {
      window.localStorage.setItem(key, JSON.stringify(user));
    },
    { key: authKey, user: userForRole(role) },
  );
};

const openMobileDrawer = async (page: Parameters<typeof test>[0]["page"]) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Toggle menu" }).click();
  return page.getByRole("dialog");
};

test.describe("Role-specific navigation", () => {
  test("organisers see organiser navigation, not attendee browse links", async ({ page }) => {
    await setMockUser(page, "organizer");
    await page.goto("/organizer-dashboard");

    const desktopNav = page.locator("header nav").first();

    await expect(desktopNav.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(desktopNav.getByRole("link", { name: "Create Event" })).toBeVisible();
    await expect(desktopNav.getByRole("link", { name: "Events" })).toHaveCount(0);
    await expect(desktopNav.getByRole("button", { name: /Marketplace/ })).toHaveCount(0);
  });

  test("attendees retain discovery and account navigation", async ({ page }) => {
    await setMockUser(page, "user");
    await page.goto("/events");

    const desktopNav = page.locator("header nav").first();

    await expect(desktopNav.getByRole("link", { name: "Events" })).toBeVisible();
    await expect(desktopNav.getByRole("button", { name: /Marketplace/ })).toBeVisible();
    await expect(desktopNav.getByRole("link", { name: "Profile" })).toBeVisible();
    await expect(page.getByTitle("Notifications")).toBeVisible();
  });

  test("organisers see only organiser navigation in the mobile drawer", async ({ page }) => {
    await setMockUser(page, "organizer");
    await page.goto("/organizer-dashboard");

    const mobileDrawer = await openMobileDrawer(page);

    await expect(mobileDrawer.getByRole("link", { name: "Dashboard", exact: true })).toBeVisible();
    await expect(mobileDrawer.getByRole("link", { name: "Create Event", exact: true })).toBeVisible();
    await expect(mobileDrawer.getByRole("link", { name: "Profile", exact: true })).toBeVisible();
    await expect(mobileDrawer.getByRole("link", { name: "Vault", exact: true })).toBeVisible();
    await expect(mobileDrawer.getByRole("button", { name: "Sign out", exact: true })).toBeVisible();
    await expect(mobileDrawer.getByRole("link", { name: "Events", exact: true })).toHaveCount(0);
    await expect(mobileDrawer.getByText("Marketplace", { exact: true })).toHaveCount(0);
    await expect(mobileDrawer.getByRole("link", { name: /Ticket Resale/ })).toHaveCount(0);
    await expect(mobileDrawer.getByRole("link", { name: /Usernames/ })).toHaveCount(0);
  });

  test("attendees retain discovery and account navigation in the mobile drawer", async ({ page }) => {
    await setMockUser(page, "user");
    await page.goto("/events");

    const mobileDrawer = await openMobileDrawer(page);

    await expect(mobileDrawer.getByRole("link", { name: "Events", exact: true })).toBeVisible();
    await expect(mobileDrawer.getByText("Marketplace", { exact: true })).toBeVisible();
    await expect(mobileDrawer.getByRole("link", { name: /Ticket Resale/ })).toBeVisible();
    await expect(mobileDrawer.getByRole("link", { name: /Usernames/ })).toBeVisible();
    await expect(mobileDrawer.getByRole("link", { name: "Profile", exact: true })).toBeVisible();
    await expect(mobileDrawer.getByRole("link", { name: "Vault", exact: true })).toBeVisible();
    await expect(mobileDrawer.getByRole("button", { name: "Sign out", exact: true })).toBeVisible();
  });
});
