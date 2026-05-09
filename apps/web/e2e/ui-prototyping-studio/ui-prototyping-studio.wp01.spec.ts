import { expect, test } from "@playwright/test";

import { installUiPrototypingStudioApiMocks } from "./mock-api";

test.describe("ui-prototyping-studio WP-01", () => {
  test.beforeEach(async ({ page }) => {
    await installUiPrototypingStudioApiMocks(page);
  });

  test("UPS-UI-001 ui-prototyping-studio route exposes authenticated workbench shell", async ({
    page,
  }) => {
    await page.goto("/ui-prototyping-studio");

    await expect(
      page.getByRole("heading", { name: "UI Prototyping Studio" }),
    ).toBeVisible();
    await expect(
      page.getByText("domainspec.ui-prototyping.read"),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Session Controls" }),
    ).toBeVisible();
  });

  test("UPS-UI-002 ui-prototyping-studio renders required workbench panels", async ({
    page,
  }) => {
    await page.goto("/ui-prototyping-studio");

    await expect(
      page.getByRole("heading", { name: "Session Controls" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Variant Canvas" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Annotation Panel" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Mutation Approval Panel" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Revision Timeline" }),
    ).toBeVisible();
  });

  test("UPS-UI-003 ui-prototyping-studio form contracts enforce variantCount bounds selector", async ({
    page,
  }) => {
    await page.goto("/ui-prototyping-studio");

    const options = page.locator("[data-testid='ups-variant-count'] option");
    await expect(options).toHaveText(["1", "2", "3"]);
  });

  test("UPS-UI-004 ui-prototyping-studio multi-variant flow locks annotation until explicit baseline selection", async ({
    page,
  }) => {
    await page.goto("/ui-prototyping-studio");

    await page.locator("[data-testid='ups-variant-count']").selectOption("3");
    await page.getByRole("button", { name: "Start Session" }).click();

    await page
      .locator("[data-testid='ups-prompt']")
      .fill("Prototype onboarding dashboard");
    await page.getByRole("button", { name: "Submit Prompt" }).click();
    await page.getByRole("button", { name: "Generate Variants" }).click();

    await expect(
      page.locator("[data-testid='ups-selection-gate']"),
    ).toContainText("selectionGate=pending");
    await expect(
      page.locator("[data-testid='ups-annotation-gate']"),
    ).toContainText("locked");

    await page.getByRole("button", { name: "Select Baseline B" }).click();

    await expect(
      page.locator("[data-testid='ups-selection-gate']"),
    ).toContainText("selectionGate=satisfied");
    await expect(
      page.locator("[data-testid='ups-annotation-gate']"),
    ).toContainText("unlocked");
  });

  test("UPS-UI-005 ui-prototyping-studio single-variant flow shows committed baseline path", async ({
    page,
  }) => {
    await page.goto("/ui-prototyping-studio");

    await page.locator("[data-testid='ups-variant-count']").selectOption("1");
    await page.getByRole("button", { name: "Start Session" }).click();

    await page
      .locator("[data-testid='ups-prompt']")
      .fill("Single variant profile card");
    await page.getByRole("button", { name: "Submit Prompt" }).click();
    await page.getByRole("button", { name: "Generate Variants" }).click();

    await expect(
      page.locator("[data-testid='ups-single-variant-branch']"),
    ).toContainText("committed baseline");
    await expect(
      page.locator("[data-testid='ups-annotation-gate']"),
    ).toContainText("unlocked");
    await expect(
      page.locator("[data-testid='ups-baseline-badge']"),
    ).toContainText("baseline=committed:A");
  });
});
