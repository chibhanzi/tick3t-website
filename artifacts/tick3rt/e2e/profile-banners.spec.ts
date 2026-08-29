import { expect, test, type Page } from "@playwright/test";

const authKey = "tick3t.mock-auth.user";
const smallPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);

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

const setMockUser = async (page: Page, user: MockUser) => {
  await page.evaluate(
    ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
    { key: authKey, value: user },
  );
};

test("organiser can add, persist, replace, and remove a dashboard banner", async ({ page }) => {
  const storageKey = "tick3t.profile-banner.test-organizer-001";
  await page.goto("/organizer-dashboard");
  await page.evaluate((key) => localStorage.removeItem(key), storageKey);
  await page.reload();

  await expect(page.getByRole("button", { name: "Add banner" })).toBeVisible();
  const input = page.locator("#organizer-profile-banner-test-organizer-001");
  await input.setInputFiles({ name: "organiser-banner.png", mimeType: "image/png", buffer: smallPng });

  await expect(page.getByAltText("Profile banner")).toBeVisible();
  await expect(page.getByRole("button", { name: "Change banner" })).toBeVisible();
  await expect.poll(() => page.evaluate((key) => Boolean(localStorage.getItem(key)), storageKey)).toBe(true);

  await page.reload();
  await expect(page.getByAltText("Profile banner")).toBeVisible();

  await input.setInputFiles({ name: "replacement-banner.png", mimeType: "image/png", buffer: smallPng });
  await expect(page.getByAltText("Profile banner")).toBeVisible();

  await page.getByRole("button", { name: "Remove profile banner" }).click();
  await expect(page.getByAltText("Profile banner")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Add banner" })).toBeVisible();
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), storageKey)).toBeNull();
});

test("attendee banner validates uploads, survives refresh, and stays account-specific", async ({ page }) => {
  const attendeeA: MockUser = {
    id: "profile-banner-attendee-a",
    email: "banner-a@example.com",
    name: "Banner Attendee A",
    role: "user",
    isOrganizer: false,
    isAdmin: false,
    profilePicture: "",
    isVerified: true,
  };
  const attendeeB: MockUser = {
    ...attendeeA,
    id: "profile-banner-attendee-b",
    email: "banner-b@example.com",
    name: "Banner Attendee B",
  };
  const attendeeAStorageKey = `tick3t.profile-banner.${attendeeA.id}`;
  const attendeeBStorageKey = `tick3t.profile-banner.${attendeeB.id}`;

  await page.goto("/");
  await page.evaluate(
    ({ keyA, keyB }) => {
      localStorage.removeItem(keyA);
      localStorage.removeItem(keyB);
    },
    { keyA: attendeeAStorageKey, keyB: attendeeBStorageKey },
  );
  await setMockUser(page, attendeeA);
  await page.goto("/dashboard");

  await expect(page.getByRole("button", { name: "Add banner" })).toHaveCount(0);
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  await expect(page.getByRole("button", { name: "Add banner" })).toBeVisible();

  const input = page.locator(`#attendee-profile-banner-${attendeeA.id}`);
  await input.setInputFiles({
    name: "not-an-image.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("not an image"),
  });
  await expect(page.getByRole("alert")).toContainText("Choose an image file");

  await input.setInputFiles({
    name: "too-large.png",
    mimeType: "image/png",
    buffer: Buffer.alloc(2 * 1024 * 1024 + 1),
  });
  await expect(page.getByRole("alert")).toContainText("too large");
  await expect(page.getByAltText("Profile banner")).toHaveCount(0);

  await input.setInputFiles({ name: "attendee-banner.png", mimeType: "image/png", buffer: smallPng });
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByAltText("Profile banner")).toBeVisible();
  await page.getByRole("button", { name: "Save", exact: true }).click();

  await page.reload();
  await expect(page.getByAltText("Profile banner")).toBeVisible();

  await setMockUser(page, attendeeB);
  await page.reload();
  await expect(page.getByText(attendeeB.name)).toBeVisible();
  await expect(page.getByAltText("Profile banner")).toHaveCount(0);

  await setMockUser(page, attendeeA);
  await page.reload();
  await expect(page.getByText(attendeeA.name)).toBeVisible();
  await expect(page.getByAltText("Profile banner")).toBeVisible();

  await page.getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByRole("button", { name: "Remove profile banner" }).click();
  await expect(page.getByAltText("Profile banner")).toHaveCount(0);
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), attendeeAStorageKey)).toBeNull();
});