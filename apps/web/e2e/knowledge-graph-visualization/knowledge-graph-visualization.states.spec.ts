import { expect, test } from "@playwright/test";
import { installKnowledgeGraphApiMocks } from "./mock-api";

/**
 * @source docs/features/knowledge-graph-visualization/UI-SPEC.md#state-to-ui-mapping
 * @story KG-UI-STATE-001..004
 */
test.describe("Knowledge Graph Visualization - State Reflection", () => {
  test.beforeEach(async ({ page }) => {
    await installKnowledgeGraphApiMocks(page);
  });

  test("shows idle state and placeholder when projection is unavailable", async ({
    page,
  }) => {
    await page.route("**/api/knowledge-graph/mirror-cards*", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          code: "MIRROR_PROJECTION_PERSISTENCE_FAILED",
          message: "Projection unavailable",
        }),
      });
    });
    await page.route("**/api/knowledge-graph/graph*", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          code: "MIRROR_PROJECTION_PERSISTENCE_FAILED",
          message: "Projection unavailable",
        }),
      });
    });

    await page.goto("/knowledge-graph");

    await expect(page.locator(".focus-indicator .state-badge")).toHaveText(
      "Idle",
    );
    await expect(
      page.getByText("Select an aspect or whiteboard card to inspect details."),
    ).toBeVisible();
  });

  test("shows projection-ready state after initial load", async ({ page }) => {
    await page.goto("/knowledge-graph");
    await expect(page.getByText("Projection Ready")).toBeVisible();
  });

  test("shows concept-focused state after selecting concept", async ({
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
        name: "Focus concept card DocumentationWorkspace",
      })
      .click();

    await expect(page.getByText("Concept Focused")).toBeVisible();
  });

  test("shows definition-opened state after open definition action", async ({
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
        name: "Focus concept card DocumentationWorkspace",
      })
      .click();
    await page
      .getByRole("button", {
        name: "Open definition for focused concept",
      })
      .click();

    await expect(page.locator(".focus-indicator .state-badge")).toHaveText(
      "Definition Opened",
    );
  });
});
