import { test as setup } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Auth setup: inject a mock organizer session into localStorage so every
 * test skips the /auth page. The mock auth system (AuthContext.tsx) reads
 * from the "tick3t.mock-auth.user" localStorage key.
 */
const AUTH_FILE = path.join(__dirname, "auth-state.json");

setup("authenticate as organizer", async ({ page }) => {
  await page.goto("/");

  // Inject the mock organizer session into localStorage
  await page.evaluate(() => {
    const mockUser = {
      id: "test-organizer-001",
      email: "test-organizer@example.com",
      name: "Test Organizer",
      role: "organizer",
      avatar: null,
      isOrganizer: true,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("tick3t.mock-auth.user", JSON.stringify(mockUser));
  });

  // Save the storage state (localStorage) for subsequent tests
  await page.context().storageState({ path: AUTH_FILE });
});
