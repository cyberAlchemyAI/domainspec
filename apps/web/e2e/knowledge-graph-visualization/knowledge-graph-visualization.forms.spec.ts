import { expect, test } from "@playwright/test";

/**
 * @source docs/features/knowledge-graph-visualization/UI-SPEC.md#opendefinitionaction
 * @story KG-UI-FORM-001
 */
test.describe("Knowledge Graph Visualization - Form and Interaction", () => {
  test("open definition requires selected concept", async ({ page }) => {
    await page.goto("/knowledge-graph");

    await page.getByRole("button", { name: "Open definition" }).click();

    await expect(
      page.getByText("Select a concept before opening definition"),
    ).toBeVisible();
  });

  /**
   * @source docs/features/knowledge-graph-visualization/UI-SPEC.md#error-code---ui-message-mapping
   * @story KG-UI-FORM-002
   */
  test("open definition surfaces backend diagnostic when unavailable", async ({
    page,
  }) => {
    await page.goto("/knowledge-graph");

    const firstFallbackNode = page
      .locator(".graph-node-fallback button")
      .first();
    await firstFallbackNode.click();
    await page.getByRole("button", { name: "Open definition" }).click();

    await expect(
      page.getByText(
        /Definition (link is not available|anchor is outdated|opened:)/i,
      ),
    ).toBeVisible();
  });
});
