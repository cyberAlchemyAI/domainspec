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
});
