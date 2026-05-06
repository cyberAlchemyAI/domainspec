# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: knowledge-graph-visualization/knowledge-graph-visualization.responsive.spec.ts >> Knowledge Graph Visualization - Responsive >> renders primary regions on mobile
- Location: e2e/knowledge-graph-visualization/knowledge-graph-visualization.responsive.spec.ts:15:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Mirror Cards' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Mirror Cards' })

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
  4  |  * @source docs/UI-ARCHITECTURE.md#breakpoint-contract
  5  |  * @story KG-UI-RSP-001
  6  |  */
  7  | test.describe("Knowledge Graph Visualization - Responsive", () => {
  8  |   const breakpoints = [
  9  |     { name: "mobile", width: 390, height: 844 },
  10 |     { name: "tablet", width: 768, height: 1024 },
  11 |     { name: "desktop", width: 1280, height: 800 },
  12 |   ];
  13 |
  14 |   for (const viewport of breakpoints) {
  15 |     test(`renders primary regions on ${viewport.name}`, async ({ page }) => {
  16 |       await page.setViewportSize({ width: viewport.width, height: viewport.height });
  17 |       await page.goto("/knowledge-graph");
  18 |
> 19 |       await expect(page.getByRole("heading", { name: "Mirror Cards" })).toBeVisible();
     |                                                                         ^ Error: expect(locator).toBeVisible() failed
  20 |       await expect(
  21 |         page.getByRole("heading", { name: "Relationship Graph" }),
  22 |       ).toBeVisible();
  23 |       await expect(page.getByRole("heading", { name: "Concept Detail" })).toBeVisible();
  24 |     });
  25 |   }
  26 | });
  27 |
```
