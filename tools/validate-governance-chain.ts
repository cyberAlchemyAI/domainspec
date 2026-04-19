#!/usr/bin/env tsx

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const jsonOutput = args.includes("--json");

const axiomsPath = resolve(process.cwd(), "domainspec/AXIOMS.md");
const constitutionPath = resolve(process.cwd(), "domainspec/CONSTITUTION.md");

if (!existsSync(axiomsPath) || !existsSync(constitutionPath)) {
  const missing = [
    !existsSync(axiomsPath) ? "domainspec/AXIOMS.md" : null,
    !existsSync(constitutionPath) ? "domainspec/CONSTITUTION.md" : null,
  ].filter(Boolean);
  fail([`Missing required governance files: ${missing.join(", ")}`], 2);
}

const axiomsRaw = readFileSync(axiomsPath, "utf-8");
const constitutionRaw = readFileSync(constitutionPath, "utf-8");

const axiomIds = [...axiomsRaw.matchAll(/^##\s+Axiom\s+(A\d+)/gm)].map((m) => m[1] || "");
const rules = parseConstitutionRules(constitutionRaw);

const errors: string[] = [];
const usage = new Map<string, number>(axiomIds.map((id) => [id, 0]));

if (axiomIds.length === 0) {
  errors.push("No axiom IDs found in AXIOMS.md");
}
if (rules.length === 0) {
  errors.push("No constitution rule rows found in CONSTITUTION.md");
}

for (const rule of rules) {
  if (rule.axioms.length === 0) {
    errors.push(`${rule.id}: missing axiom mapping`);
  }
  if (!rule.gate || rule.gate === "-") {
    errors.push(`${rule.id}: missing L6 gate mapping`);
  }

  for (const axiom of rule.axioms) {
    if (!usage.has(axiom)) {
      errors.push(`${rule.id}: references undefined axiom ${axiom}`);
    } else {
      usage.set(axiom, (usage.get(axiom) || 0) + 1);
    }
  }
}

for (const [axiom, count] of usage.entries()) {
  if (count === 0) {
    errors.push(`Axiom ${axiom} is orphaned: referenced by zero constitution rules`);
  }
}

if (jsonOutput) {
  console.log(
    JSON.stringify(
      {
        ok: errors.length === 0,
        axioms: axiomIds,
        ruleCount: rules.length,
        errors,
      },
      null,
      2,
    ),
  );
} else {
  if (errors.length === 0) {
    console.log("Governance chain validation passed.");
  } else {
    console.log("Governance chain validation errors:");
    for (const error of errors) {
      console.log(`- ${error}`);
    }
  }
}

process.exit(errors.length > 0 ? 1 : 0);

function parseConstitutionRules(raw: string): Array<{ id: string; axioms: string[]; gate: string }> {
  const lines = raw.split("\n");
  const rows: Array<{ id: string; axioms: string[]; gate: string }> = [];

  for (const line of lines) {
    if (!line.startsWith("| C")) continue;
    const cells = line
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell.length > 0);
    if (cells.length < 4) continue;

    const id = cells[0] || "";
    const axiomCell = cells[2] || "";
    const gate = cells[3] || "";

    const axioms = axiomCell
      .split(",")
      .map((v) => v.trim())
      .filter((v) => /^A\d+$/.test(v));

    rows.push({ id, axioms, gate });
  }

  return rows;
}

function fail(errors: string[], code: number): never {
  if (jsonOutput) {
    console.log(JSON.stringify({ ok: false, errors }, null, 2));
  } else {
    for (const error of errors) console.log(`- ${error}`);
  }
  process.exit(code);
}
