import { expect, test } from "@playwright/test";

/**
 * @source docs/features/knowledge-graph-visualization/STORIES.md#us-1-mirror-cards-for-required-docs
 * @story KG-UI-JRN-001
 */
test.describe("Knowledge Graph Visualization - Journeys", () => {
  test("US-1 renders required mirror cards", async ({ page }) => {
    await page.goto("/knowledge-graph");

    const mirrorCardTitles = page.locator(".mirror-card__top-row strong");
    await expect(mirrorCardTitles).toContainText([
      "SPEC",
      "DOMAIN",
      "OPERATIONS",
    ]);
  });

  /**
   * @source docs/features/knowledge-graph-visualization/STORIES.md#us-4-related-details-card-for-selected-concept
   * @story KG-UI-JRN-004
   */
  test("US-4 selecting concept updates detail panel", async ({ page }) => {
    await page.goto("/knowledge-graph");

    const nodeButton = page
      .getByRole("button", { name: /Focus concept/i })
      .first();
    await nodeButton.click();

    await expect(
      page.getByRole("heading", { name: "Concept Detail" }),
    ).toBeVisible();
    await expect(page.getByText("State:")).toBeVisible();
  });
});
