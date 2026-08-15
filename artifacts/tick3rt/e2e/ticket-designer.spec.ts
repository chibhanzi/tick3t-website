import { test, expect } from "@playwright/test";

/**
 * End-to-end tests for the Tick3rt ticket designer flow.
 *
 * These tests cover the full organiser journey:
 *   1. Navigating to Create Event
 *   2. Filling in Event Details (step 1)
 *   3. Selecting a template in Ticket Design (step 2)
 *   4. Customising colours and the live preview
 *   5. Switching to Custom Builder and selecting a layout
 *   6. Using the Layer Editor to add a text layer
 *   7. Advancing through steps 3–6 and publishing
 *
 * Auth is pre-injected as a mock organizer via auth.setup.ts (localStorage).
 *
 * Step-content anchors (used instead of progress-bar text which may be
 * CSS-hidden on certain viewports):
 *   Step 1 → input#title  ("Amazing Conference 2024" placeholder)
 *   Step 2 → "LIVE PREVIEW" heading + "Template Gallery" tab
 *   Step 3 → "🎫 Ticket Generation Method" CardTitle
 *   Step 4 → "🎫 Ticket Features & Security" CardTitle
 *   Step 5 → "Pricing & Payment Options" CardTitle
 *   Step 6 → "Review Your Event" CardTitle
 */

test.describe("Ticket Designer — end-to-end flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/create-event");
    // Wait for step 1: the event title input is always unambiguously visible.
    await expect(page.locator("#title")).toBeVisible({ timeout: 10_000 });
  });

  // ─── Step 1: Event Details ───────────────────────────────────────────────
  test("step 1 — event details form renders and advances", async ({ page }) => {
    // Event title input is visible
    await expect(page.locator("#title")).toBeVisible();

    // Fill in event info
    await page.locator("#title").fill("E2E Test Concert");
    await page.getByPlaceholder(/Convention Center|location/i).fill("Test Venue, NYC");

    // Click Next button
    await page.getByRole("button", { name: /next/i }).last().click();

    // Step 2 content: "LIVE PREVIEW" panel is unique to TicketDesignStep
    await expect(page.getByText("LIVE PREVIEW")).toBeVisible({ timeout: 8_000 });
    // Template Gallery tab is the default view
    await expect(page.getByText("Template Gallery")).toBeVisible();
  });

  // ─── Step 2: Template selection ──────────────────────────────────────────
  test("step 2 — template gallery is visible and a template can be selected", async ({ page }) => {
    // Advance to step 2
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("LIVE PREVIEW")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("Template Gallery")).toBeVisible();

    // Click the first "Use this template" button in the gallery
    const useBtn = page.getByRole("button", { name: /use this template/i }).first();
    await expect(useBtn).toBeVisible({ timeout: 5_000 });
    await useBtn.click();

    // Live preview should now show the template badge (not the empty-state prompt)
    await expect(page.getByText("Choose a template")).not.toBeVisible({ timeout: 5_000 });
    await expect(page.getByText("LIVE PREVIEW")).toBeVisible();
  });

  // ─── Step 2: Colour & Style customisation ────────────────────────────────
  test("step 2 — colour & style section is accessible and primary color can be changed", async ({ page }) => {
    // Advance to step 2
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("LIVE PREVIEW")).toBeVisible({ timeout: 10_000 });

    // Open the "Colour & Style" accordion
    await page.getByRole("button").filter({ hasText: /Colour & Style/i }).click();

    // Hex text inputs with placeholder "#000000" appear
    const hexInputs = page.locator('input[placeholder="#000000"]');
    await expect(hexInputs.first()).toBeVisible({ timeout: 5_000 });

    // Change the first hex input (Primary color)
    await hexInputs.first().fill("#FF5733");
    await expect(hexInputs.first()).toHaveValue("#FF5733");

    // Font size slider label visible
    await expect(page.getByText(/Font size/i)).toBeVisible();
  });

  // ─── Step 2: Custom Builder ───────────────────────────────────────────────
  test("step 2 — custom builder tab shows layout options", async ({ page }) => {
    // Advance to step 2
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("LIVE PREVIEW")).toBeVisible({ timeout: 10_000 });

    // The "Ticket Design" accordion section is open by default — both tabs should be visible
    await expect(page.getByText("Template Gallery")).toBeVisible();
    await expect(page.getByText("Custom Builder")).toBeVisible();

    // Switch to Custom Builder tab
    await page.getByText("Custom Builder").click();

    // Custom layout description text appears
    await expect(page.getByText(/Pick a base layout/i)).toBeVisible({ timeout: 5_000 });

    // At least one layout card is rendered
    const layoutCards = page.locator("[class*='cursor-pointer'][class*='rounded-xl']");
    await expect(layoutCards.first()).toBeVisible({ timeout: 5_000 });

    // Select the first layout
    await layoutCards.first().click();

    // Selected state: the clicked layout card gains border-primary + ring-2
    // Scope to cursor-pointer+rounded-xl cards (the layout cards) to avoid matching
    // unrelated elements that happen to have ring-* or focus-visible:ring-2 classes.
    await expect(
      page.locator("[class*='cursor-pointer'][class*='rounded-xl'][class*='border-primary']").first()
    ).toBeVisible({ timeout: 3_000 });
  });

  // ─── Step 2: Layer Editor ─────────────────────────────────────────────────
  test("step 2 — layer editor can add a text layer", async ({ page }) => {
    // Advance to step 2
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("LIVE PREVIEW")).toBeVisible({ timeout: 10_000 });

    // Expand Layer Editor accordion
    const layerBtn = page.getByRole("button").filter({ hasText: /Layer Editor/i });
    await expect(layerBtn).toBeVisible({ timeout: 5_000 });
    await layerBtn.click();

    // Layer toolbar shows "+ Text", "+ Shape", "+ Pattern" buttons
    const addTextBtn = page.getByRole("button", { name: /^\+\s*Text$/i });
    await expect(addTextBtn).toBeVisible({ timeout: 5_000 });

    // Count layer rows in the layer list before adding
    // Each layer is a div with classes: rounded-lg border px-3 py-2 cursor-pointer text-xs
    const layerRows = page.locator("[class*='rounded-lg'][class*='border'][class*='cursor-pointer'][class*='text-xs']");
    const before = await layerRows.count();

    // Click "+ Text" to add a text layer
    await addTextBtn.click();

    // At least one more layer row than before
    await expect(async () => {
      const after = await layerRows.count();
      expect(after).toBeGreaterThan(before);
    }).toPass({ timeout: 5_000 });
  });

  // ─── Full wizard: step 1 → 6 → publish ───────────────────────────────────
  test("full wizard — navigate all steps and publish event", async ({ page }) => {
    // Step 1: fill minimal fields
    await page.locator("#title").fill("E2E Summer Festival");
    await page.getByPlaceholder(/Convention Center|location/i).fill("Central Park, NYC");

    // → Step 2
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("LIVE PREVIEW")).toBeVisible({ timeout: 10_000 });

    // Select the first template
    const useBtn = page.getByRole("button", { name: /use this template/i }).first();
    if (await useBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await useBtn.click();
    }

    // → Step 3
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("🎫 Ticket Generation Method")).toBeVisible({ timeout: 8_000 });

    // → Step 4
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("🎫 Ticket Features & Security")).toBeVisible({ timeout: 8_000 });

    // → Step 5
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("Pricing & Payment Options")).toBeVisible({ timeout: 8_000 });

    // → Step 6
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("Review Your Event")).toBeVisible({ timeout: 8_000 });

    // Event title appears in review
    await expect(page.getByText("E2E Summer Festival")).toBeVisible();

    // Click Publish (in the nav bar; the review step also has its own Publish button)
    // Use the nav-bar Publish button which is the Last button shown by the wizard
    await page.getByRole("button", { name: /publish/i }).last().click();

    // Success state
    await expect(page.getByText("Event Created Successfully!")).toBeVisible({ timeout: 10_000 });
  });

  // ─── Step 2: Live preview reflects event title from step 1 ───────────────
  test("step 2 — live preview shows event data from step 1", async ({ page }) => {
    // Fill event title in step 1
    await page.locator("#title").fill("Preview Title Check");

    // → Step 2
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("LIVE PREVIEW")).toBeVisible({ timeout: 10_000 });

    // Select a template so the live preview renders the event title
    const useBtn = page.getByRole("button", { name: /use this template/i }).first();
    await expect(useBtn).toBeVisible({ timeout: 5_000 });
    await useBtn.click();

    // The live preview panel should now render the event title
    await expect(page.getByText("Preview Title Check")).toBeVisible({ timeout: 5_000 });
  });
});
