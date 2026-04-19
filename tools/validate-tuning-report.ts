#!/usr/bin/env tsx
/**
 * validate-tuning-report.ts — Validates TUNING-REPORT.md structure
 *
 * Usage: npx tsx domainspec/tools/validate-tuning-report.ts [path]
 * Default path: docs/signals/TUNING-REPORT.md
 *
 * Exit codes:
 *   0 — valid
 *   1 — validation errors found
 *   2 — file not found
 */

import { readFileSync, existsSync } from "fs";

const reportPath = process.argv[2] || "docs/signals/TUNING-REPORT.md";

if (!existsSync(reportPath)) {
  console.error(`File not found: ${reportPath}`);
  process.exit(2);
}

const content = readFileSync(reportPath, "utf-8");
const lines = content.split("\n");

// --- Required sections ---
const requiredSections = [
  "Signal Summary",
  "Thresholds Triggered",
  "Aggregate Metrics",
  "Tuning Proposals",
];

const errors: string[] = [];
const warnings: string[] = [];

for (const section of requiredSections) {
  const pattern = new RegExp(`^##\\s+${section}`, "m");
  if (!pattern.test(content)) {
    errors.push(`Missing required section: ## ${section}`);
  }
}

// --- Signal Summary validation ---
const summarySection = extractSection(content, "Signal Summary");
if (summarySection) {
  if (!/signal/i.test(summarySection) || !/\d+/.test(summarySection)) {
    warnings.push("Signal Summary should include signal counts");
  }
  if (!/date/i.test(summarySection)) {
    warnings.push("Signal Summary should include date range");
  }
}

// --- Tuning Proposals validation ---
const proposalsSection = extractSection(content, "Tuning Proposals");
if (proposalsSection) {
  const proposalFields = ["Evidence", "Target", "Change", "Rationale", "Priority"];
  const hasProposals = /###/.test(proposalsSection);
  if (hasProposals) {
    for (const field of proposalFields) {
      if (!new RegExp(field, "i").test(proposalsSection)) {
        warnings.push(`Tuning Proposals should include "${field}" for each proposal`);
      }
    }
  }
}

// --- No forbidden paths ---
const pathPattern = /(?:backend\/src|apps\/web\/src|infra\/docker-compose)/g;
const forbiddenPaths = content.match(pathPattern);
if (forbiddenPaths) {
  // Only warn — the report may reference these paths in analysis, but shouldn't modify them
  warnings.push(
    `Report references production paths (review for safety): ${[...new Set(forbiddenPaths)].join(", ")}`
  );
}

// --- Output ---
if (errors.length > 0) {
  console.error("❌ Validation FAILED\n");
  for (const e of errors) console.error(`  ERROR: ${e}`);
  for (const w of warnings) console.warn(`  WARN:  ${w}`);
  process.exit(1);
} else {
  console.log("✅ Validation PASSED\n");
  if (warnings.length > 0) {
    for (const w of warnings) console.warn(`  WARN:  ${w}`);
  }
  console.log(`  Sections found: ${requiredSections.length}/${requiredSections.length}`);
  console.log(`  Warnings: ${warnings.length}`);
  process.exit(0);
}

// --- Helpers ---

function extractSection(content: string, heading: string): string | null {
  const pattern = new RegExp(`^## ${heading}\\s*\\n([\\s\\S]*?)(?=^## |$)`, "m");
  const match = content.match(pattern);
  return match ? match[1] : null;
}
