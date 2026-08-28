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
});