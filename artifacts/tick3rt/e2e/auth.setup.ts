import { test as setup } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTH_FILE = path.join(__dirname, "auth-state.json");
const API_BASE_URL = "http://localhost:80";
const organizerCredentials = {
  email: "test-organizer@example.com",
  password: "password123",
};

setup("authenticate as organizer", async ({ page }) => {
  let response = await page.request.post(`${API_BASE_URL}/api/auth/sign-in`, {
    data: organizerCredentials,
  });
  if (response.status() === 401) {
    response = await page.request.post(`${API_BASE_URL}/api/auth/sign-up`, {
      data: {
        ...organizerCredentials,
        displayName: "Test Organizer",
        role: "organizer",
      },
    });
  }
  if (!response.ok()) {
    throw new Error(`Could not create organiser test session: ${response.status()}`);
  }
  const organizer = await response.json();

  await page.goto("/");
  await page.evaluate(
    ({ user }) => {
      localStorage.setItem("tick3t.mock-auth.user", JSON.stringify(user));
    },
    { user: organizer },
  );

  await page.context().storageState({ path: AUTH_FILE });
});
