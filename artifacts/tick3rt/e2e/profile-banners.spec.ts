import { expect, test, type Page } from "@playwright/test";

const authKey = "tick3t.mock-auth.user";
const smallPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);
const smallPngDataUrl = `data:image/png;base64,${smallPng.toString("base64")}`;

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

test("legacy banner migrates and stays in sync across browser sessions", async ({ browser }) => {
  const email = `banner-sync-${Date.now()}@example.com`;
  const password = "BannerSync123!";
  const contextA = await browser.newContext({ baseURL: "http://localhost:24122" });
  const pageA = await contextA.newPage();
  await pageA.goto("/");

  const signUpResponse = await pageA.request.post("/api/auth/sign-up", {
    data: {
      email,
      password,
      displayName: "Synced Banner Attendee",
      role: "user",
    },
  });
  expect(signUpResponse.ok()).toBe(true);
  const user = await signUpResponse.json() as MockUser;
  await setMockUser(pageA, user);
  await pageA.evaluate(
    ({ key, value }) => localStorage.setItem(key, value),
    {
      key: `tick3t.profile-banner.${user.id}`,
      value: smallPngDataUrl,
    },
  );

  await pageA.goto("/dashboard");
  const bannerA = pageA.getByAltText("Profile banner");
  await expect(bannerA).toHaveAttribute(
    "src",
    /\/api\/storage\/objects\/profile-banners\//,
    { timeout: 20_000 },
  );
  const migratedSrc = await bannerA.getAttribute("src");
  expect(migratedSrc).toBeTruthy();

  const contextB = await browser.newContext({ baseURL: "http://localhost:24122" });
  const pageB = await contextB.newPage();
  await pageB.goto("/");
  const signInResponse = await pageB.request.post("/api/auth/sign-in", {
    data: { email, password },
  });
  expect(signInResponse.ok()).toBe(true);
  await setMockUser(pageB, await signInResponse.json() as MockUser);
  await pageB.goto("/dashboard");

  const bannerB = pageB.getByAltText("Profile banner");
  await expect(bannerB).toHaveAttribute("src", migratedSrc!);
  await pageB.getByRole("button", { name: "Edit", exact: true }).click();
  await pageB.locator(`#attendee-profile-banner-${user.id}`).setInputFiles({
    name: "replacement-banner.png",
    mimeType: "image/png",
    buffer: smallPng,
  });
  await expect.poll(async () => {
    const src = await bannerB.getAttribute("src");
    return src !== migratedSrc &&
      src?.includes("/api/storage/objects/profile-banners/");
  }, { timeout: 20_000 }).toBe(true);
  const replacementSrc = await bannerB.getAttribute("src");

  await pageA.reload();
  await expect(bannerA).toHaveAttribute("src", replacementSrc!);

  await pageB.getByRole("button", { name: "Remove profile banner" }).click();
  await expect(pageB.getByRole("button", { name: "Add banner" })).toBeEnabled();
  await pageA.reload();
  await expect(bannerA).toHaveCount(0);

  await contextB.close();
  await contextA.close();
});