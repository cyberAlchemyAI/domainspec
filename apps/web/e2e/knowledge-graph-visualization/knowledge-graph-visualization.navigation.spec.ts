import { expect, test } from "@playwright/test";

/**
 * @source docs/features/knowledge-graph-visualization/UI-SPEC.md#route-table
 * @story KG-UI-NAV-001
 */
test.describe("Knowledge Graph Visualization - Navigation", () => {
  test("loads /knowledge-graph with three-pane layout", async ({ page }) => {
    await page.goto("/knowledge-graph");

    await expect(
      page.getByRole("heading", { name: "Knowledge Graph Visualization" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Mirror Cards" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Relationship Graph" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Concept Detail" }),
    ).toBeVisible();
  });
});
