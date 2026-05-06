import { expect, test } from "@playwright/test";
import { installKnowledgeGraphApiMocks } from "./mock-api";

/**
 * @source docs/features/knowledge-graph-visualization/UI-SPEC.md#opendefinitionaction
 * @story KG-UI-FORM-001
 */
test.describe("Knowledge Graph Visualization - Form and Interaction", () => {
  test.beforeEach(async ({ page }) => {
    await installKnowledgeGraphApiMocks(page);
  });

  test("open definition requires selected concept", async ({ page }) => {
    await page.goto("/knowledge-graph");

    await page
      .getByRole("button", {
        name: "Open definition for focused concept",
      })
      .click();

    await expect(
      page.getByText("Select a concept before opening definition."),
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

    await page
      .getByRole("button", {
        name: "Focus feature card Knowledge Graph Visualization",
      })
      .click();
    await page
      .getByRole("button", {
        name: "Focus concept card UnresolvedPointer",
      })
      .click();
    await page
      .getByRole("button", {
        name: "Open definition for focused concept",
      })
      .click();

    await expect(
      page.getByText(/Definition (link is not available|anchor is outdated)/i),
    ).toBeVisible();
  });
});
