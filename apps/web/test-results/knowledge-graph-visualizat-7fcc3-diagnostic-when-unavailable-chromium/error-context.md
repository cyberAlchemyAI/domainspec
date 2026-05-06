# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: knowledge-graph-visualization/knowledge-graph-visualization.forms.spec.ts >> Knowledge Graph Visualization - Form and Interaction >> open definition surfaces backend diagnostic when unavailable
- Location: e2e/knowledge-graph-visualization/knowledge-graph-visualization.forms.spec.ts:22:3

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
  4  |  * @source docs/features/knowledge-graph-visualization/UI-SPEC.md#opendefinitionaction
  5  |  * @story KG-UI-FORM-001
  6  |  */
  7  | test.describe("Knowledge Graph Visualization - Form and Interaction", () => {
  8  |   test("open definition requires selected concept", async ({ page }) => {
  9  |     await page.goto("/knowledge-graph");
  10 |
  11 |     await page.getByRole("button", { name: "Open definition" }).click();
  12 |
  13 |     await expect(
  14 |       page.getByText("Select a concept before opening definition"),
  15 |     ).toBeVisible();
  16 |   });
  17 |
  18 |   /**
  19 |    * @source docs/features/knowledge-graph-visualization/UI-SPEC.md#error-code---ui-message-mapping
  20 |    * @story KG-UI-FORM-002
  21 |    */
  22 |   test("open definition surfaces backend diagnostic when unavailable", async ({ page }) => {
  23 |     await page.goto("/knowledge-graph");
  24 |
  25 |     const firstFallbackNode = page
  26 |       .locator(".graph-node-fallback button")
  27 |       .first();
> 28 |     await firstFallbackNode.click();
     |                             ^ Error: locator.click: Test timeout of 30000ms exceeded.
  29 |     await page.getByRole("button", { name: "Open definition" }).click();
  30 |
  31 |     await expect(
  32 |       page.getByText(/Definition (link is not available|anchor is outdated|opened:)/i),
  33 |     ).toBeVisible();
  34 |   });
  35 | });
  36 |
```
