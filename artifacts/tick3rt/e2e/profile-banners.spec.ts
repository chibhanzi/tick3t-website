import { expect, test, type Page } from "@playwright/test";

const authKey = "tick3t.mock-auth.user";
const smallPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);
const smallPngDataUrl = `data:image/png;base64,${smallPng.toString("base64")}`;
const password = "BannerTest123!";

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

const createAttendee = async (page: Page, label: string) => {
  const emailLabel = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const email = `${emailLabel}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
  const response = await page.request.post("/api/auth/sign-up", {
    data: {
      email,
      password,
      displayName: label,
      role: "user",
    },
  });
  expect(response.status()).toBe(201);
  const user = await response.json() as MockUser;
  await setMockUser(page, user);
  return { email, user };
};

const signInAttendee = async (page: Page, email: string) => {
  const response = await page.request.post("/api/auth/sign-in", {
    data: { email, password },
  });
  expect(response.ok()).toBe(true);
  const user = await response.json() as MockUser;
  await setMockUser(page, user);
  return user;
};

test("organiser can add, persist, replace, and remove a dashboard banner", async ({ page }) => {
  const email = `banner-organizer-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
  const signUpResponse = await page.request.post("/api/auth/sign-up", {
    data: {
      email,
      password,
      displayName: "Banner Organizer",
      role: "organizer",
    },
  });
  expect(signUpResponse.status()).toBe(201);
  const organizer = await signUpResponse.json() as MockUser;
  await page.goto("/");
  await setMockUser(page, organizer);
  await page.goto("/organizer-dashboard");
  const storageKey = `tick3t.profile-banner.${organizer.id}`;

  await expect(page.getByRole("button", { name: "Add banner" })).toBeVisible({
    timeout: 20_000,
  });
  const input = page.locator(`#organizer-profile-banner-${organizer.id}`);
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
  await page.goto("/");
  const attendeeAAccount = await createAttendee(page, "Banner Attendee A");
  const attendeeA = attendeeAAccount.user;
  const attendeeAStorageKey = `tick3t.profile-banner.${attendeeA.id}`;

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

  const attendeeBAccount = await createAttendee(page, "Banner Attendee B");
  const attendeeB = attendeeBAccount.user;
  await page.reload();
  await expect(page.getByText(attendeeB.name)).toBeVisible();
  await expect(page.getByAltText("Profile banner")).toHaveCount(0);

  await signInAttendee(page, attendeeAAccount.email);
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