import { expect, test, type Page } from "@playwright/test";

import { installUiPrototypingStudioApiMocks } from "./mock-api";

test.describe("ui-prototyping-studio WP-02/WP-03", () => {
  test.beforeEach(async ({ page }) => {
    await installUiPrototypingStudioApiMocks(page);
  });

  test("UPS-UI-006 ui-prototyping-studio manual approval is required before apply controls become active", async ({
    page,
  }) => {
    await page.goto("/ui-prototyping-studio");
    await prepareDraftFlow(page);

    await expect(
      page.locator("[data-testid='ups-apply-batch']"),
    ).toBeDisabled();
    await expect(page.locator("[data-testid='ups-apply-gate']")).toContainText(
      "applyGate=pending",
    );

    await page.locator("[data-testid='ups-approve-batch']").click();

    await expect(page.locator("[data-testid='ups-apply-batch']")).toBeEnabled();
    await expect(page.locator("[data-testid='ups-apply-gate']")).toContainText(
      "applyGate=satisfied",
    );
  });

  test("UPS-UI-007 ui-prototyping-studio state indicator reflects domain state transitions", async ({
    page,
  }) => {
    await page.goto("/ui-prototyping-studio?variantCount=1");

    await expect(page.locator(".ups-state-badge")).toContainText(
      "SessionInitialized",
    );

    await page
      .locator("[data-testid='ups-prompt']")
      .fill("State transition flow");
    await page.getByRole("button", { name: "Submit Prompt" }).click();
    await expect(page.locator(".ups-state-badge")).toContainText(
      "PromptCaptured",
    );

    await page.getByRole("button", { name: "Generate Variants" }).click();
    await expect(page.locator(".ups-state-badge")).toContainText(
      "BaselineReady",
    );

    await page
      .locator("[data-testid='ups-comment-target-selector']")
      .fill("#state");
    await page
      .locator("[data-testid='ups-comment-target-label']")
      .fill("State target");
    await page
      .locator("[data-testid='ups-comment-intent']")
      .fill("Update state");
    await page
      .locator("[data-testid='ups-comment-note']")
      .fill("Keep deterministic state evidence.");
    await page.locator("[data-testid='ups-capture-comment']").click();
    await expect(page.locator(".ups-state-badge")).toContainText(
      "CommentsCaptured",
    );

    await page.locator("[data-testid='ups-synthesize-batch']").click();
    await expect(page.locator(".ups-state-badge")).toContainText(
      "MutationDrafted",
    );

    await page.locator("[data-testid='ups-approve-batch']").click();
    await expect(page.locator(".ups-state-badge")).toContainText(
      "MutationApproved",
    );

    await page.locator("[data-testid='ups-apply-batch']").click();
    await expect(page.locator(".ups-state-badge")).toContainText(
      "RevisionRecorded",
    );
    await expect(
      page.locator("[data-testid='ups-revision-list'] li"),
    ).toHaveCount(1);
  });

  test("UPS-UI-008 ui-prototyping-studio security constraints keep escaped text rendering and enforce server-side gate checks", async ({
    page,
  }) => {
    await page.goto("/ui-prototyping-studio");
    await prepareDraftFlow(page);

    const rawPayload = "<script>alert('x')</script>";
    await page
      .locator("[data-testid='ups-comment-target-selector']")
      .fill("#unsafe");
    await page
      .locator("[data-testid='ups-comment-target-label']")
      .fill("Unsafe selector");
    await page
      .locator("[data-testid='ups-comment-intent']")
      .fill("Sanitize render");
    await page.locator("[data-testid='ups-comment-note']").fill(rawPayload);
    await page.locator("[data-testid='ups-capture-comment']").click();

    await expect(
      page.locator("[data-testid='ups-comment-stream']"),
    ).toContainText(rawPayload);

    const sessionText = await page
      .locator("[data-testid='ups-session-id']")
      .innerText();
    const sessionId = sessionText.replace("sessionId=", "").trim();

    const gateResponse = await page.evaluate(
      async ({ sessionId }) => {
        const draftResponse = await fetch(
          `/api/ui-prototyping-studio/sessions/${sessionId}/mutation-batches/draft`,
          {
            headers: {
              "x-scopes": "domainspec.ui-prototyping.read",
            },
          },
        );
        const draft = await draftResponse.json();

        const applyResponse = await fetch(
          `/api/ui-prototyping-studio/sessions/${sessionId}/mutation-batches/${draft.batchId}/apply`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-scopes":
                "domainspec.ui-prototyping.read domainspec.ui-prototyping.write",
            },
            body: JSON.stringify({
              applyRequestedBy: "system:auto",
            }),
          },
        );

        return {
          status: applyResponse.status,
          payload: await applyResponse.json(),
        };
      },
      { sessionId },
    );

    expect(gateResponse.status).toBe(409);
    expect(gateResponse.payload.code).toBe("AUTO_APPLY_FORBIDDEN");
  });
});

async function prepareDraftFlow(page: Page) {
  await page.locator("[data-testid='ups-variant-count']").selectOption("3");
  await page.getByRole("button", { name: "Start Session" }).click();

  await page
    .locator("[data-testid='ups-prompt']")
    .fill("Deterministic batch review");
  await page.getByRole("button", { name: "Submit Prompt" }).click();
  await page.getByRole("button", { name: "Generate Variants" }).click();
  await page.getByRole("button", { name: "Select Baseline B" }).click();

  await page
    .locator("[data-testid='ups-comment-target-selector']")
    .fill("#root");
  await page
    .locator("[data-testid='ups-comment-target-label']")
    .fill("Root panel");
  await page
    .locator("[data-testid='ups-comment-intent']")
    .fill("Improve clarity");
  await page
    .locator("[data-testid='ups-comment-note']")
    .fill("Increase spacing for legibility.");
  await page.locator("[data-testid='ups-capture-comment']").click();
  await page.locator("[data-testid='ups-synthesize-batch']").click();
}
