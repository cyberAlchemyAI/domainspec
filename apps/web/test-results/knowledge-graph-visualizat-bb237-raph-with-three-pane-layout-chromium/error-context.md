# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: knowledge-graph-visualization/knowledge-graph-visualization.navigation.spec.ts >> Knowledge Graph Visualization - Navigation >> loads /knowledge-graph with three-pane layout
- Location: e2e/knowledge-graph-visualization/knowledge-graph-visualization.navigation.spec.ts:8:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Knowledge Graph Visualization' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Knowledge Graph Visualization' })

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
  4  |  * @source docs/features/knowledge-graph-visualization/UI-SPEC.md#route-table
  5  |  * @story KG-UI-NAV-001
  6  |  */
  7  | test.describe("Knowledge Graph Visualization - Navigation", () => {
  8  |   test("loads /knowledge-graph with three-pane layout", async ({ page }) => {
  9  |     await page.goto("/knowledge-graph");
  10 |
  11 |     await expect(
  12 |       page.getByRole("heading", { name: "Knowledge Graph Visualization" }),
> 13 |     ).toBeVisible();
     |       ^ Error: expect(locator).toBeVisible() failed
  14 |     await expect(page.getByRole("heading", { name: "Mirror Cards" })).toBeVisible();
  15 |     await expect(page.getByRole("heading", { name: "Relationship Graph" })).toBeVisible();
  16 |     await expect(page.getByRole("heading", { name: "Concept Detail" })).toBeVisible();
  17 |   });
  18 | });
  19 |
```
