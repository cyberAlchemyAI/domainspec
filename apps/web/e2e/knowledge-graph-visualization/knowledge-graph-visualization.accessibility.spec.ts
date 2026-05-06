import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { installKnowledgeGraphApiMocks } from "./mock-api";

/**
 * @source docs/features/knowledge-graph-visualization/UI-SPEC.md#accessibility-requirements
 * @story KG-UI-A11Y-001..002
 */
test.describe("Knowledge Graph Visualization - Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await installKnowledgeGraphApiMocks(page);
  });

  test("keyboard navigation reaches card focus, graph fallback, and detail action with visible focus", async ({
    page,
  }) => {
    await page.goto("/knowledge-graph");

    const aspectButton = page
      .getByRole("button", { name: "Activate SPEC aspect" })
      .first();
    const boardButton = page
      .getByRole("button", {
        name: "Focus feature card Knowledge Graph Visualization",
      })
      .first();
    const openDefinitionButton = page.getByRole("button", {
      name: "Open definition for focused concept",
    });

    await expect(aspectButton).toBeVisible();
    await expect(boardButton).toBeVisible();
    await expect(openDefinitionButton).toBeVisible();

    await tabToElement(page, aspectButton);
    await assertVisibleFocus(aspectButton);
    await page.keyboard.press("Enter");

    await tabToElement(page, boardButton);
    await assertVisibleFocus(boardButton);
    await page.keyboard.press("Enter");
    await expect(page.getByText("selectedFeatureId=")).toBeVisible();

    await tabToElement(page, openDefinitionButton);
    await assertVisibleFocus(openDefinitionButton);
  });

  test("required ARIA semantics are present for graph and live-updating detail regions", async ({
    page,
  }) => {
    await page.goto("/knowledge-graph");

    await expect(
      page.getByRole("img", { name: "Deterministic whiteboard canvas" }),
    ).toBeVisible();
    await expect(
      page.locator('button[aria-label="Open definition for focused concept"]'),
    ).toBeVisible();
    await expect(page.locator('button[aria-current="true"]')).toBeVisible();

    await expect(
      page.locator(".focus-indicator[aria-live='polite']"),
    ).toBeVisible();
    await expect(
      page.locator(".inspector-status[aria-live='polite']"),
    ).toBeVisible();
    await expect(
      page.locator(
        ".inspector-placeholder[aria-live='polite'], .inspector-card[aria-live='polite']",
      ),
    ).toBeVisible();
  });
});

async function tabToElement(
  page: Page,
  target: Locator,
  maxSteps = 64,
): Promise<void> {
  for (let step = 0; step < maxSteps; step += 1) {
    if (await target.evaluate((node) => node === document.activeElement)) {
      return;
    }
    await page.keyboard.press("Tab");
  }

  throw new Error(
    "Target element was not reachable via keyboard tab navigation.",
  );
}

async function assertVisibleFocus(target: Locator): Promise<void> {
  await expect(target).toBeFocused();

  await expect
    .poll(async () => {
      return target.evaluate((node) => {
        const styles = getComputedStyle(node);
        return `${styles.outlineStyle}|${styles.outlineWidth}`;
      });
    })
    .not.toBe("none|0px");
}
