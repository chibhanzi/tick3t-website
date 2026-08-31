import { test, expect } from "@playwright/test";

/**
 * End-to-end tests for the Tick3t ticket designer flow.
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
 *   Step 3 → "Ticket Generation Method" CardTitle
 *   Step 4 → "Ticket Features & Security" CardTitle
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
    await expect(page.getByText("Ticket Generation Method")).toBeVisible({ timeout: 8_000 });
    await expect(page.getByTestId("tick3t-logo-mark")).toBeVisible();
    await expect(page.getByRole("img", { name: "Vouch" })).toBeVisible();
    const playStoreLink = page.getByRole("link", { name: "Get Vouch on Google Play" });
    await expect(playStoreLink).toHaveAttribute(
      "href",
      "https://play.google.com/store/apps/details?id=com.kaliholding.vouch",
    );
    await expect(playStoreLink).toHaveAttribute("target", "_blank");

    // → Step 4
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("Ticket Features & Security")).toBeVisible({ timeout: 8_000 });

    // → Step 5
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("Pricing & Payment Options")).toBeVisible({ timeout: 8_000 });
    for (const method of ["paynow", "ecocash", "onemoney", "credit-card", "bank-transfer", "ton"]) {
      await expect(page.getByTestId(`payment-method-mark-${method}`)).toBeVisible();
    }

    // → Step 6
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("Review Your Event")).toBeVisible({ timeout: 8_000 });
    await expect(page.getByTestId("tick3t-logo-mark")).toBeVisible();

    // Event title appears in review
    await expect(page.getByText("E2E Summer Festival")).toBeVisible();

    // Click Publish (in the nav bar; the review step also has its own Publish button)
    // Use the nav-bar Publish button which is the Last button shown by the wizard
    await page.getByRole("button", { name: /publish/i }).last().click();

    // Success state
    await expect(page.getByText("Event Created Successfully!")).toBeVisible({ timeout: 10_000 });
  });

  test("organiser ticket limit survives refresh and appears in event review", async ({ page }) => {
    await page.locator("#title").fill("Limited Release Event");

    // Steps 2 and 3
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("LIVE PREVIEW")).toBeVisible({ timeout: 10_000 });
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("Ticket Generation Method")).toBeVisible({ timeout: 8_000 });

    // Step 4: configure an account-level purchase limit.
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("Ticket Features & Security")).toBeVisible({ timeout: 8_000 });
    await page.getByRole("switch", { name: "Limit tickets per account" }).click();
    await page.getByLabel("Maximum tickets per account").fill("3");
    await expect(page.getByText("Max 3 tickets per account")).toBeVisible();

    await page.reload();
    await expect(page.getByText("Ticket Features & Security")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("switch", { name: "Limit tickets per account" })).toBeChecked();
    await expect(page.getByLabel("Maximum tickets per account")).toHaveValue("3");

    // Steps 5 and 6
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("Pricing & Payment Options")).toBeVisible({ timeout: 8_000 });
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("Review Your Event")).toBeVisible({ timeout: 8_000 });
    await expect(page.getByTestId("review-account-ticket-limit")).toHaveText("3 tickets");

    await page.getByRole("button", { name: "Publish Event" }).last().click();
    await expect(page.getByText("Event Created Successfully!")).toBeVisible({ timeout: 10_000 });

    const eventLink = page.getByRole("link", { name: "View published event" });
    const eventHref = await eventLink.getAttribute("href");
    expect(eventHref).toMatch(/^\/event\/created-/);

    const publishedEvent = await page.evaluate(() => {
      const events = JSON.parse(localStorage.getItem("tick3t.published-events") ?? "[]");
      return events[0];
    });
    expect(publishedEvent.title).toBe("Limited Release Event");
    expect(publishedEvent.purchaseLimitPerAccount).toBe(3);

    await page.evaluate(() => {
      localStorage.setItem("tick3t.mock-auth.user", JSON.stringify({
        id: "published-limit-attendee",
        email: "published-limit-attendee@example.com",
        name: "Published Limit Attendee",
        role: "user",
        isOrganizer: false,
        isAdmin: false,
        profilePicture: "",
        isVerified: true,
      }));
      localStorage.removeItem("tick3t.ticket-purchases");
    });
    await page.goto(eventHref!);

    await expect(page.getByRole("heading", { name: "Limited Release Event" })).toBeVisible();
    await expect(page.getByText("3 tickets per account · 3 remaining for you")).toBeVisible();
    const increase = page.getByRole("button", { name: "Increase ticket quantity" });
    await increase.click();
    await increase.click();
    await expect(page.getByTestId("ticket-quantity")).toHaveText("3");
    await expect(increase).toBeDisabled();

    await page.getByRole("button", { name: "Get Tickets" }).click();
    await page.getByRole("button", { name: "Skip for now" }).click();
    await expect(page.getByText("You have reached this event's 3-ticket account limit.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Account ticket limit reached" })).toBeDisabled();

    await page.reload();
    await expect(page.getByText("You have reached this event's 3-ticket account limit.")).toBeVisible();
  });

  // ─── Draft persistence: data survives a page refresh ─────────────────────
  test("draft — event data and step are restored after a page refresh", async ({ page }) => {
    // Fill in event details on step 1
    await page.locator("#title").fill("Refresh Survival Test");
    await page.getByPlaceholder(/Convention Center|location/i).fill("Persistence Hall");

    // Advance to step 2 so the saved step is > 1
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("LIVE PREVIEW")).toBeVisible({ timeout: 10_000 });

    // Refresh the page
    await page.reload();

    // The wizard should restore to step 2 (LIVE PREVIEW visible)
    await expect(page.getByText("LIVE PREVIEW")).toBeVisible({ timeout: 10_000 });

    // Go back to step 1 to verify the event title is preserved
    await page.getByRole("button", { name: /prev/i }).last().click();
    await expect(page.locator("#title")).toHaveValue("Refresh Survival Test", { timeout: 5_000 });
    await expect(page.getByPlaceholder(/Convention Center|location/i)).toHaveValue("Persistence Hall");

    // Clean up: click "Start over" so draft doesn't bleed into other tests
    await page.getByRole("button", { name: /start over/i }).click();
    await expect(page.locator("#title")).toHaveValue("", { timeout: 5_000 });
  });

  // ─── Draft: "Start over" clears the draft ─────────────────────────────────
  test("draft — start over resets all fields and returns to step 1", async ({ page }) => {
    // Fill step 1 and advance to step 2
    await page.locator("#title").fill("To Be Cleared");
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("LIVE PREVIEW")).toBeVisible({ timeout: 10_000 });

    // Hit "Start over"
    await page.getByRole("button", { name: /start over/i }).click();

    // Should be back on step 1 with a blank title
    await expect(page.locator("#title")).toBeVisible({ timeout: 5_000 });
    await expect(page.locator("#title")).toHaveValue("");

    // Refresh to confirm localStorage was cleared (draft should NOT restore)
    await page.reload();
    await expect(page.locator("#title")).toBeVisible({ timeout: 10_000 });
    await expect(page.locator("#title")).toHaveValue("");
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

  test("step 2 — preview layers are tightly bounded, editable, and restored from the draft", async ({ page }) => {
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("LIVE PREVIEW")).toBeVisible({ timeout: 10_000 });

    const layerBtn = page.getByRole("button").filter({ hasText: /Layer Editor/i });
    await layerBtn.click();
    await page.getByRole("button", { name: /^\+\s*Text$/i }).click();

    const layer = page.locator('[data-testid^="ticket-preview-layer-"]').last();
    await expect(layer).toBeVisible();
    const layerBox = await layer.boundingBox();
    const ticket = page.getByTestId("ticket-preview-object");
    const ticketBox = await ticket.boundingBox();
    expect(layerBox).not.toBeNull();
    expect(ticketBox).not.toBeNull();
    expect(layerBox!.width).toBeLessThan(ticketBox!.width * 0.4);

    await layerBtn.click();
    await expect(page.getByTestId("selected-layer-properties")).not.toBeVisible();
    await layer.click();
    await expect(page.getByTestId("selected-layer-properties")).toBeVisible();

    await page.getByLabel("Layer colour hex").fill("#ff0000");
    await expect(layer).toHaveCSS("color", "rgb(255, 0, 0)");
    await page.getByLabel("Layer font size").fill("24");
    await expect(layer).toHaveCSS("font-size", "24px");
    await page.getByLabel("Rotation °").fill("12");
    await expect(layer).toHaveCSS("transform", /matrix/);

    const editableLayerBox = await layer.boundingBox();
    expect(editableLayerBox).not.toBeNull();
    await page.mouse.move(editableLayerBox!.x + editableLayerBox!.width / 2, editableLayerBox!.y + editableLayerBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(editableLayerBox!.x + editableLayerBox!.width / 2 + 45, editableLayerBox!.y + editableLayerBox!.height / 2 + 15);
    await page.mouse.up();

    const xInput = page.getByText("X %").locator("..").getByRole("spinbutton");
    await expect(xInput).not.toHaveValue("10");
    const movedLayerX = await xInput.inputValue();

    const initialTicketLeft = await ticket.evaluate((element) => element.style.left);
    await page.mouse.move(ticketBox!.x + ticketBox!.width - 8, ticketBox!.y + ticketBox!.height - 8);
    await page.mouse.down();
    await page.mouse.move(ticketBox!.x + ticketBox!.width - 28, ticketBox!.y + ticketBox!.height - 18);
    await page.mouse.up();
    await expect.poll(() => ticket.evaluate((element) => element.style.left)).toBe(initialTicketLeft);

    await expect.poll(async () =>
      page.evaluate((expectedX) => JSON.parse(localStorage.getItem("tick3t_create_event_draft") || "{}")
        .ticketDesign?.layers?.some((item: any) => String(item.position?.x) === String(Number(expectedX))), movedLayerX)
    ).toBe(true);

    await page.reload();
    await expect(page.getByText("LIVE PREVIEW")).toBeVisible({ timeout: 10_000 });
    await page.getByRole("button").filter({ hasText: /Layer Editor/i }).click();
    const restoredLayer = page.locator('[data-testid^="ticket-preview-layer-"]').last();
    await expect(restoredLayer).toBeVisible();
    await restoredLayer.click();
    await expect(page.getByText("X %").locator("..").getByRole("spinbutton")).toHaveValue(movedLayerX);
    await expect(page.getByLabel("Layer colour hex")).toHaveValue("#ff0000");
    await expect(page.getByLabel("Layer font size")).toHaveValue("24");
    await expect(page.getByLabel("Rotation °")).toHaveValue("12");
  });

  test("step 2 — template event details can be dragged and restored", async ({ page }) => {
    await page.locator("#title").fill("Draggable Event Title");
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("LIVE PREVIEW")).toBeVisible({ timeout: 10_000 });

    await page.getByRole("button", { name: /use this template/i }).first().click();
    const ticket = page.getByTestId("ticket-preview-object");
    const ticketBox = await ticket.boundingBox();
    expect(ticketBox).not.toBeNull();
    const initialTicketLeft = await ticket.evaluate((element) => element.style.left);
    await page.mouse.move(ticketBox!.x + ticketBox!.width * 0.62, ticketBox!.y + ticketBox!.height * 0.8);
    await page.mouse.down();
    await page.mouse.move(ticketBox!.x + ticketBox!.width * 0.62 - 15, ticketBox!.y + ticketBox!.height * 0.8 - 5);
    await page.mouse.up();
    await expect.poll(() => ticket.evaluate((element) => element.style.left)).toBe(initialTicketLeft);

    const title = page.getByTestId("ticket-preview-content-title");
    await expect(title).toBeVisible();
    const titleBox = await title.boundingBox();
    expect(titleBox).not.toBeNull();
    const initialLeft = await title.evaluate((element) => element.style.left);

    await page.mouse.move(titleBox!.x + titleBox!.width / 2, titleBox!.y + titleBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(titleBox!.x + titleBox!.width / 2 + 30, titleBox!.y + titleBox!.height / 2 + 10);
    await page.mouse.up();

    const movedLeft = await title.evaluate((element) => element.style.left);
    expect(movedLeft).not.toBe(initialLeft);
    await expect.poll(() =>
      page.evaluate(() => Math.abs(JSON.parse(localStorage.getItem("tick3t_create_event_draft") || "{}")
        .ticketDesign?.contentPositions?.title?.x ?? 0))
    ).toBeGreaterThan(0);

    await page.reload();
    await expect(page.getByText("LIVE PREVIEW")).toBeVisible({ timeout: 10_000 });
    await expect.poll(() =>
      page.getByTestId("ticket-preview-content-title").evaluate((element) => element.style.left)
    ).toBe(movedLeft);
  });

  test("step 2 — template labels and translucent artwork can be edited, scaled, moved, and restored", async ({ page }) => {
    await page.locator("#title").fill("Field Day");
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("LIVE PREVIEW")).toBeVisible({ timeout: 10_000 });

    // Holographic is the final gallery template and contains both a category
    // label and a native translucent glass panel.
    await page.getByRole("button", { name: /use this template/i }).last().click();
    const templateObjectsButton = page.getByRole("button").filter({ hasText: /Template Objects/i });
    await templateObjectsButton.click();

    await page.getByRole("button", { name: "Category tag" }).click();
    await page.getByLabel("Template category text").fill("Outdoor Field Day");
    const category = page.getByTestId("ticket-preview-template-category");
    await expect(category).toHaveText("Outdoor Field Day");

    await page.getByLabel("Object scale").fill("1.5");
    await expect(category).toHaveCSS("transform", /matrix\(1\.5/);
    await page.getByLabel("Template object colour hex").fill("#112233");
    await expect(category).toHaveCSS("color", "rgb(17, 34, 51)");

    await templateObjectsButton.click();
    await category.click();
    await expect(page.getByTestId("selected-template-object-properties")).toBeVisible();

    await page.getByRole("button", { name: "Translucent layer" }).click();
    const overlay = page.getByTestId("ticket-preview-template-overlay");
    await expect(overlay).toBeVisible();
    await page.getByLabel("Width scale").fill("1.2");
    await page.getByLabel("Height scale").fill("0.8");
    await page.getByLabel("Template object colour hex").fill("#334455");
    await page.getByLabel("Template overlay corner radius").fill("20");
    await expect(overlay).toHaveCSS("background-color", "rgb(51, 68, 85)");
    await expect(overlay).toHaveCSS("border-radius", "20px");
    await expect(overlay).toHaveCSS("transform", /matrix\(1\.2, 0, 0, 0\.8/);

    const opacity = page.getByLabel("Template object opacity");
    const opacityBox = await opacity.boundingBox();
    expect(opacityBox).not.toBeNull();
    await page.mouse.click(opacityBox!.x + opacityBox!.width * 0.75, opacityBox!.y + opacityBox!.height / 2);
    await expect.poll(() => overlay.evaluate((element) => Number(getComputedStyle(element).opacity))).toBeLessThan(1);

    const overlayBox = await overlay.boundingBox();
    expect(overlayBox).not.toBeNull();
    await page.mouse.move(overlayBox!.x + overlayBox!.width * 0.9, overlayBox!.y + overlayBox!.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(overlayBox!.x + overlayBox!.width * 0.9 + 18, overlayBox!.y + overlayBox!.height * 0.5 + 8);
    await page.mouse.up();
    await expect(page.getByLabel("Object X %")).not.toHaveValue("0");

    await expect.poll(() =>
      page.evaluate(() => JSON.parse(localStorage.getItem("tick3t_create_event_draft") || "{}")
        .ticketDesign?.templateObjectsByTemplate?.holographic?.category?.content)
    ).toBe("Outdoor Field Day");

    await page.reload();
    await expect(page.getByText("LIVE PREVIEW")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId("ticket-preview-template-category")).toHaveText("Outdoor Field Day");
    await expect(page.getByTestId("ticket-preview-template-overlay")).toHaveCSS("border-radius", "20px");

    // Per-template edits must not leak into another design, and should return
    // when the organiser switches back.
    await page.getByRole("button", { name: "Change" }).click();
    await page.getByRole("button", { name: /use this template/i }).first().click();
    await expect(page.getByTestId("ticket-preview-template-category")).toHaveText("Concert & Music");
    await page.getByRole("button", { name: "Change" }).click();
    await page.getByRole("button", { name: /use this template/i }).last().click();
    await expect(page.getByTestId("ticket-preview-template-category")).toHaveText("Outdoor Field Day");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button").filter({ hasText: /Template Objects/i }).click();
    await page.getByRole("button", { name: "Translucent layer" }).click();
    await expect(page.getByTestId("selected-template-object-properties")).toBeVisible();
    await expect(page.getByTestId("ticket-preview-template-overlay")).toBeVisible();
  });

  test("step 2 — decorative accents are editable on desktop and mobile without leaking between templates", async ({ page }) => {
    await page.getByRole("button", { name: /next/i }).last().click();
    await expect(page.getByText("LIVE PREVIEW")).toBeVisible({ timeout: 10_000 });

    await page.getByRole("button", { name: /use this template/i }).first().click();
    const objectsButton = page.getByRole("button").filter({ hasText: /Template Objects/i });
    await objectsButton.click();
    await page.getByRole("button", { name: "Glow orb" }).click();

    const glowOrb = page.getByTestId("ticket-preview-template-glow-orb");
    await expect(glowOrb).toBeVisible();
    await expect(glowOrb).toHaveCSS("opacity", "0.3");
    await page.getByLabel("Object X %").fill("12");
    await page.getByLabel("Object scale").fill("1.4");
    await page.getByLabel("Rotation °").fill("18");
    await page.getByLabel("Template object colour hex").fill("#123456");
    await expect(glowOrb).toHaveCSS("background-color", "rgb(18, 52, 86)");
    await expect(glowOrb).toHaveCSS("transform", /matrix/);

    await objectsButton.click();
    await glowOrb.click();
    await expect(page.getByTestId("selected-template-object-properties")).toBeVisible();
    await expect(page.getByLabel("Object X %")).toHaveValue("12");

    await page.getByRole("button", { name: "Change" }).click();
    await page.getByPlaceholder("Search templates…").fill("Cybercore");
    await page.getByRole("button", { name: /use this template/i }).click();
    await expect(page.getByTestId("ticket-preview-template-glow-orb")).toHaveCount(0);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button").filter({ hasText: /Template Objects/i }).click();
    await page.getByRole("button", { name: "Scan bar" }).click();
    const scanBar = page.getByTestId("ticket-preview-template-scan-bar");
    await expect(scanBar).toBeVisible();
    await page.getByLabel("Object Y %").fill("10");
    await page.getByLabel("Object scale").fill("1.2");
    await page.getByLabel("Rotation °").fill("-8");
    await page.getByLabel("Template object colour hex").fill("#ff00aa");
    await expect(scanBar).toHaveCSS("background-color", "rgb(255, 0, 170)");
    await expect(page.getByTestId("selected-template-object-properties")).toBeVisible();

    await expect.poll(() =>
      page.evaluate(() => JSON.parse(localStorage.getItem("tick3t_create_event_draft") || "{}")
        .ticketDesign?.templateObjectsByTemplate?.cybercore?.["scan-bar"]?.rotation)
    ).toBe(-8);
  });
});
