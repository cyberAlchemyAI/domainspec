# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: knowledge-graph-visualization/knowledge-graph-visualization.accessibility.spec.ts >> Knowledge Graph Visualization - Accessibility >> keyboard navigation reaches card focus, graph fallback, and detail action with visible focus
- Location: e2e/knowledge-graph-visualization/knowledge-graph-visualization.accessibility.spec.ts:9:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('button[aria-label*="from card"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('button[aria-label*="from card"]').first()

```

# Page snapshot

```yaml
- main [ref=e3]:
    - heading "Unable to load knowledge graph" [level=1] [ref=e4]
    - paragraph [ref=e5]: Unable to load knowledge graph projection.
    - button "Retry" [ref=e6] [cursor=pointer]
```

# Test source

```ts
  1  | import type { Locator, Page } from "@playwright/test";
  2  | import { expect, test } from "@playwright/test";
  3  |
  4  | /**
  5  |  * @source docs/features/knowledge-graph-visualization/UI-SPEC.md#accessibility-requirements
  6  |  * @story KG-UI-A11Y-001..002
  7  |  */
  8  | test.describe("Knowledge Graph Visualization - Accessibility", () => {
  9  |   test("keyboard navigation reaches card focus, graph fallback, and detail action with visible focus", async ({
  10 |     page,
  11 |   }) => {
  12 |     await page.goto("/knowledge-graph");
  13 |
  14 |     const cardFocusButton = page
  15 |       .locator('button[aria-label*="from card"]')
  16 |       .first();
  17 |     const graphFallbackButton = page.locator(".graph-node-fallback button").first();
  18 |     const openDefinitionButton = page.getByRole("button", { name: "Open definition" });
  19 |
> 20 |     await expect(cardFocusButton).toBeVisible();
     |                                   ^ Error: expect(locator).toBeVisible() failed
  21 |     await expect(graphFallbackButton).toBeVisible();
  22 |     await expect(openDefinitionButton).toBeVisible();
  23 |
  24 |     await tabToElement(page, cardFocusButton);
  25 |     await assertVisibleFocus(cardFocusButton);
  26 |
  27 |     await tabToElement(page, graphFallbackButton);
  28 |     await assertVisibleFocus(graphFallbackButton);
  29 |     await page.keyboard.press("Enter");
  30 |     await expect(page.getByText("Concept Focused")).toBeVisible();
  31 |
  32 |     await tabToElement(page, openDefinitionButton);
  33 |     await assertVisibleFocus(openDefinitionButton);
  34 |   });
  35 |
  36 |   test("required ARIA semantics are present for graph and live-updating detail regions", async ({
  37 |     page,
  38 |   }) => {
  39 |     await page.goto("/knowledge-graph");
  40 |
  41 |     await expect(
  42 |       page.getByRole("img", { name: "Concept relationship graph" }),
  43 |     ).toBeVisible();
  44 |     await expect(
  45 |       page.locator('button[aria-label="Open definition for focused concept"]'),
  46 |     ).toBeVisible();
  47 |
  48 |     await expect(page.locator(".focus-indicator[aria-live='polite']")).toBeVisible();
  49 |     await expect(page.locator(".detail-status[aria-live='polite']")).toBeVisible();
  50 |     await expect(
  51 |       page.locator(".detail-placeholder[aria-live='polite'], .detail-card[aria-live='polite']"),
  52 |     ).toBeVisible();
  53 |   });
  54 | });
  55 |
  56 | async function tabToElement(page: Page, target: Locator, maxSteps = 64): Promise<void> {
  57 |   for (let step = 0; step < maxSteps; step += 1) {
  58 |     if (await target.evaluate((node) => node === document.activeElement)) {
  59 |       return;
  60 |     }
  61 |     await page.keyboard.press("Tab");
  62 |   }
  63 |
  64 |   throw new Error("Target element was not reachable via keyboard tab navigation.");
  65 | }
  66 |
  67 | async function assertVisibleFocus(target: Locator): Promise<void> {
  68 |   await expect(target).toBeFocused();
  69 |
  70 |   await expect
  71 |     .poll(async () => {
  72 |       return target.evaluate((node) => {
  73 |         const styles = getComputedStyle(node);
  74 |         return `${styles.outlineStyle}|${styles.outlineWidth}`;
  75 |       });
  76 |     })
  77 |     .not.toBe("none|0px");
  78 | }
```
