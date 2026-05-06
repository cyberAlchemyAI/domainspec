import { expect, test } from "@playwright/test";

/**
 * @source docs/features/knowledge-graph-visualization/UI-SPEC.md#state-to-ui-mapping
 * @story KG-UI-STATE-001..004
 */
test.describe("Knowledge Graph Visualization - State Reflection", () => {
  test("shows projection-ready state after initial load", async ({ page }) => {
    await page.goto("/knowledge-graph");
    await expect(page.getByText("Projection Ready")).toBeVisible();
  });

  test("shows concept-focused state after selecting concept", async ({
    page,
  }) => {
    await page.goto("/knowledge-graph");

    await page.locator(".graph-node-fallback button").first().click();

    await expect(page.getByText("Concept Focused")).toBeVisible();
  });

  test("shows definition-opened state after open definition action", async ({
    page,
  }) => {
    await page.goto("/knowledge-graph");

    await page.locator(".graph-node-fallback button").first().click();
    await page.getByRole("button", { name: "Open definition" }).click();

    await expect(page.locator(".focus-indicator .state-badge")).toHaveText(
      "Definition Opened",
    );
  });
});
