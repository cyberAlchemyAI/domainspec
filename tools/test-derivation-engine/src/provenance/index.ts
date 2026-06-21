// Provenance + fenced engine region (closes G2 part 1 + the coexistence-merge
// contract, Delta 3). The emitted TEST-SPEC carries a provenance comment (input-doc
// hashes + engine_commit + format_version) OUTSIDE a fenced ENGINE-REGION. Everything
// deterministic-from-docs (completeness gate, coverage summary, obligations, gaps)
// lives INSIDE the region; the volatile engine_commit lives outside it. The drift
// `check` compares only the region, so an engine-version bump never causes false
// drift, while any doc change does. The fence also defines the wholesale-replace
// boundary for engine+LLM coexistence.

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const FORMAT_VERSION = 1;

export const REGION_START =
  "<!-- ENGINE-REGION-START — deterministic δ output; overwritten on re-derive, do not hand-edit -->";
export const REGION_END = "<!-- ENGINE-REGION-END -->";

/** Canonical input docs hashed for provenance (superset of what the grammar parses). */
export const CANONICAL_DOCS = [
  "states.md",
  "operations.md",
  "interfaces.md",
  "events.md",
  "workflows.md",
  "queries.md",
  "mappings.md",
  "domain.md",
  "rules.md",
] as const;

export interface ProvenanceInput {
  readonly file: string;
  readonly sha256: string;
}

export interface Provenance {
  readonly inputs: readonly ProvenanceInput[];
  readonly engineCommit: string;
}

function sha256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

export function computeProvenance(
  featureDir: string,
  engineCommit: string,
): Provenance {
  const inputs: ProvenanceInput[] = [];
  for (const f of CANONICAL_DOCS) {
    const p = join(featureDir, f);
    if (existsSync(p))
      inputs.push({ file: f, sha256: sha256(readFileSync(p, "utf8")) });
  }
  inputs.sort((a, b) => (a.file < b.file ? -1 : 1));
  return { inputs, engineCommit };
}

export function renderProvenanceHeader(
  feature: string,
  prov: Provenance,
): string {
  return [
    "<!-- ENGINE-PROVENANCE",
    `format_version: ${FORMAT_VERSION}`,
    `feature: ${feature}`,
    `engine_commit: ${prov.engineCommit}`,
    "inputs:",
    ...prov.inputs.map((i) => `  ${i.file}: sha256:${i.sha256}`),
    "note: the ENGINE-REGION below is deterministic δ output, replaced wholesale on",
    "      re-derive. Do not hand-edit it. Run `check` to detect drift.",
    "-->",
  ].join("\n");
}

/** Extract the trimmed bytes between the region fences, or null if absent/malformed. */
export function extractEngineRegion(fileText: string): string | null {
  const s = fileText.indexOf(REGION_START);
  const e = fileText.indexOf(REGION_END);
  if (s === -1 || e === -1 || e < s) return null;
  return fileText.slice(s + REGION_START.length, e).trim();
}

export function wrapEngineRegion(body: string): string {
  return `${REGION_START}\n\n${body}\n\n${REGION_END}`;
}
