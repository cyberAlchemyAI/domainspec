# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: knowledge-graph-visualization/knowledge-graph-visualization.states.spec.ts >> Knowledge Graph Visualization - State Reflection >> shows concept-focused state after selecting concept
- Location: e2e/knowledge-graph-visualization/knowledge-graph-visualization.states.spec.ts:13:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.graph-node-fallback button').first()

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
  1  | import { expect, test } from "@playwright/test";
  2  |
  3  | /**
  4  |  * @source docs/features/knowledge-graph-visualization/UI-SPEC.md#state-to-ui-mapping
  5  |  * @story KG-UI-STATE-001..004
  6  |  */
  7  | test.describe("Knowledge Graph Visualization - State Reflection", () => {
  8  |   test("shows projection-ready state after initial load", async ({ page }) => {
  9  |     await page.goto("/knowledge-graph");
  10 |     await expect(page.getByText("Projection Ready")).toBeVisible();
  11 |   });
  12 |
  13 |   test("shows concept-focused state after selecting concept", async ({ page }) => {
  14 |     await page.goto("/knowledge-graph");
  15 |
> 16 |     await page.locator(".graph-node-fallback button").first().click();
     |                                                               ^ Error: locator.click: Test timeout of 30000ms exceeded.
  17 |
  18 |     await expect(page.getByText("Concept Focused")).toBeVisible();
  19 |   });
  20 |
  21 |   test("shows definition-opened state after open definition action", async ({ page }) => {
  22 |     await page.goto("/knowledge-graph");
  23 |
  24 |     await page.locator(".graph-node-fallback button").first().click();
  25 |     await page.getByRole("button", { name: "Open definition" }).click();
  26 |
  27 |     await expect(page.locator(".focus-indicator .state-badge")).toHaveText(
  28 |       "Definition Opened",
  29 |     );
  30 |   });
  31 | });
  32 |
```
