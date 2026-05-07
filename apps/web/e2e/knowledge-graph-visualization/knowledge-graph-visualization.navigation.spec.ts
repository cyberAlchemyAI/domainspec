import { expect, test } from "@playwright/test";
import { installKnowledgeGraphApiMocks } from "./mock-api";

/**
 * @source docs/features/knowledge-graph-visualization/UI-SPEC.md#route-table
 * @story KG-UI-NAV-001
 */
test.describe("Knowledge Graph Visualization - Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await installKnowledgeGraphApiMocks(page);
  });

  test("loads /knowledge-graph with three-pane layout", async ({ page }) => {
    await page.goto("/knowledge-graph");

    await expect(
      page.getByRole("heading", { name: "Knowledge Graph Visualization" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Aspect Rail" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Whiteboard Canvas" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Card Inspector" }),
    ).toBeVisible();
    await expect(page.getByText("activeAspect=SPEC")).toBeVisible();
  });

  /**
   * @source docs/features/knowledge-graph-visualization/UI-SPEC.md#interaction-contract
   * @story KG-UI-NAV-002
   */
  test("browser back restores previous board level after concept drilldown", async ({
    page,
  }) => {
    await page.goto("/knowledge-graph");

    await page
      .getByRole("button", {
        name: "Focus feature card Knowledge Graph Visualization",
      })
      .click();

    await expect(page).toHaveURL(/viewLevel=feature/);

    await page
      .getByRole("button", {
        name: "Focus concept card DocumentationWorkspace",
      })
      .click();

    await expect(page).toHaveURL(/viewLevel=concept/);

    await page.goBack();

    await expect(page).toHaveURL(/viewLevel=feature/);
    await expect(page.locator(".whiteboard-canvas__summary")).toContainText(
      "selectedFeatureId=feature.knowledge-graph-visualization",
    );
  });
});
