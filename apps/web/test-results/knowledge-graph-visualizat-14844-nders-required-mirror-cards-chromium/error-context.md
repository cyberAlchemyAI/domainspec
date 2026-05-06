# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: knowledge-graph-visualization/knowledge-graph-visualization.journey.spec.ts >> Knowledge Graph Visualization - Journeys >> US-1 renders required mirror cards
- Location: e2e/knowledge-graph-visualization/knowledge-graph-visualization.journey.spec.ts:8:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.mirror-card__top-row strong')
Timeout: 5000ms
- Expected  - 5
+ Received  + 1

- Array [
-   "SPEC",
-   "DOMAIN",
-   "OPERATIONS",
- ]
+ Array []

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.mirror-card__top-row strong')
    8 × locator resolved to 0 elements

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
  4  |  * @source docs/features/knowledge-graph-visualization/STORIES.md#us-1-mirror-cards-for-required-docs
  5  |  * @story KG-UI-JRN-001
  6  |  */
  7  | test.describe("Knowledge Graph Visualization - Journeys", () => {
  8  |   test("US-1 renders required mirror cards", async ({ page }) => {
  9  |     await page.goto("/knowledge-graph");
  10 |
  11 |     const mirrorCardTitles = page.locator(".mirror-card__top-row strong");
> 12 |     await expect(mirrorCardTitles).toContainText(["SPEC", "DOMAIN", "OPERATIONS"]);
     |                                    ^ Error: expect(locator).toContainText(expected) failed
  13 |   });
  14 |
  15 |   /**
  16 |    * @source docs/features/knowledge-graph-visualization/STORIES.md#us-4-related-details-card-for-selected-concept
  17 |    * @story KG-UI-JRN-004
  18 |    */
  19 |   test("US-4 selecting concept updates detail panel", async ({ page }) => {
  20 |     await page.goto("/knowledge-graph");
  21 |
  22 |     const nodeButton = page
  23 |       .getByRole("button", { name: /Focus concept/i })
  24 |       .first();
  25 |     await nodeButton.click();
  26 |
  27 |     await expect(page.getByRole("heading", { name: "Concept Detail" })).toBeVisible();
  28 |     await expect(page.getByText("State:")).toBeVisible();
  29 |   });
  30 | });
  31 |
```
