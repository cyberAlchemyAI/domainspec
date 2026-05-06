import { expect, test } from "@playwright/test";
import { installKnowledgeGraphApiMocks } from "./mock-api";

/**
 * @source docs/UI-ARCHITECTURE.md#breakpoint-contract
 * @story KG-UI-RSP-001
 */
test.describe("Knowledge Graph Visualization - Responsive", () => {
  test.beforeEach(async ({ page }) => {
    await installKnowledgeGraphApiMocks(page);
  });

  const breakpoints = [
    { name: "mobile", width: 390, height: 844 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1280, height: 800 },
  ];

  for (const viewport of breakpoints) {
    test(`renders primary regions on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto("/knowledge-graph");

      await expect(
        page.getByRole("heading", { name: "Aspect Rail" }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Whiteboard Canvas" }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Card Inspector" }),
      ).toBeVisible();
    });
  }
});
