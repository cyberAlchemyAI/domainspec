import { expect, test } from "@playwright/test";
import { installKnowledgeGraphApiMocks } from "./mock-api";

/**
 * @source docs/features/knowledge-graph-visualization/STORIES.md#us-1-mirror-cards-for-required-docs
 * @story KG-UI-JRN-001
 */
test.describe("Knowledge Graph Visualization - Journeys", () => {
  test.beforeEach(async ({ page }) => {
    await installKnowledgeGraphApiMocks(page);
  });

  test("US-1 renders required mirror cards", async ({ page }) => {
    await page.goto("/knowledge-graph");

    const aspectTitles = page.locator(".aspect-card__title");
    await expect(aspectTitles).toContainText(["SPEC", "DOMAIN", "OPERATIONS"]);
  });

  /**
   * @source docs/features/knowledge-graph-visualization/STORIES.md#us-2-graph-mirrors-canonical-relationships
   * @story KG-UI-JRN-002
   */
  test("US-2 renders canonical edges and known card IDs", async ({ page }) => {
    await page.goto("/knowledge-graph");

    await expect(
      page.getByText("feature:feature.knowledge-graph-visualization"),
    ).toBeVisible();
    await expect(page.getByText(/depends-on/i)).toBeVisible();
  });

  /**
   * @source docs/features/knowledge-graph-visualization/STORIES.md#us-3-click-concept-to-open-definition
   * @story KG-UI-JRN-003
   */
  test("US-3 drill flow propagates selected feature/group and opens definition", async ({
    page,
  }) => {
    await page.goto("/knowledge-graph");

    await page
      .getByRole("button", {
        name: "Focus feature card Knowledge Graph Visualization",
      })
      .click();

    await expect(page).toHaveURL(/viewLevel=feature/);
    await expect(page).toHaveURL(
      /selectedFeatureId=feature.knowledge-graph-visualization/,
    );

    await page
      .getByRole("button", { name: "Focus concept-group card SPEC.md" })
      .click();

    await expect(page).toHaveURL(/selectedGroupKey=SPEC.md/);

    await page
      .getByRole("button", {
        name: "Focus concept card DocumentationWorkspace",
      })
      .click();

    await expect(page).toHaveURL(/viewLevel=concept/);

    await page
      .getByRole("button", {
        name: "Open definition for focused concept",
      })
      .click();

    await expect(page.locator(".focus-indicator .state-badge")).toHaveText(
      "Definition Opened",
    );
    await expect(page).toHaveURL(/#documentationworkspace$/i);
  });

  /**
   * @source docs/features/knowledge-graph-visualization/STORIES.md#us-4-related-details-card-for-selected-concept
   * @story KG-UI-JRN-004
   */
  test("US-4 selecting concept updates detail panel", async ({ page }) => {
    await page.goto("/knowledge-graph");

    await page
      .getByRole("button", {
        name: "Focus feature card Knowledge Graph Visualization",
      })
      .click();
    await page
      .getByRole("button", {
        name: "Focus concept card DocumentationWorkspace",
      })
      .click();

    await expect(
      page.getByRole("heading", { name: "Card Inspector" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "DocumentationWorkspace" }),
    ).toBeVisible();
    await expect(page.getByText("Inbound relations")).toBeVisible();
    await expect(page.getByText("Outbound relations")).toBeVisible();
    await expect(page.getByText("State:")).toBeVisible();
  });
});
