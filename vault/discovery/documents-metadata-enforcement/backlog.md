---
tags: [ontology, linter, enforcement, backlog]
node_type: backlog
is_session: false
layer: ontology
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-03
---

# Documents-Metadata-Enforcement — Backlog

Tracks pending implementation work for the metadata/edge linter described in `documents-metadata-enforcement.md`. The discovery itself is decided in shape; what remains is building the enforcement runtime and resolving the smaller open questions that block its first version.

OQ-1 (skill-file edge endpoints) is **closed**: skill and agent files are not legal vault edge endpoints, and will not be given a `node_type`. Cross-surface references to them stay as prose. This backlog therefore does not track OQ-1 — only OQ-2, OQ-3, OQ-4, and the linter itself.

## Backlog Categories

In priority order:

1. **New Features** — the linter runtime and its catalog manifest.
2. **Architectural Resilience & Robustness** — rollout strategy and the smoke-test of closing this discovery's own asymmetric edges.
3. **Completed / Done** — items resolved before being scheduled.

---

# New Features

---

## [2026-05-03] [HIGH] — Build the metadata/edge linter — ❌ NOT DONE

**Context:**
`documents-metadata-enforcement.md` documents that the 21-edge catalog and the frontmatter schema in `vault/ontology-conventions.md` are unenforced — every conformance claim today is "discipline, not a rule." The linter is the runtime that turns the catalog and schema into machine-checked invariants. Without it, drift accumulates silently. Scheduled later, not now: OQ-2 and OQ-3 are decisions inside this work, and OQ-4 closes once the linter exists.

**What needs to be done:**
- Implement a checker that walks `vault/**/*.md`, parses frontmatter, and validates against the schema in `.claude/skills/custom/frontmatter.md` (presence, allowed values, conditional-field rules).
- Implement an edge checker that parses `## Connections` blocks and validates each row against the catalog in `.claude/skills/custom/edge-catalog.md` (legal source/target `node_type`, legal forward/inverse pairing, no deprecated edges).
- Enforce that every endpoint resolves to a vault file. Endpoints under `.claude/skills/**` or `.claude/agents/**` are rejected by construction (OQ-1 closed).
- Verify bidirectional declaration: every forward edge must have its inverse declared on the target.
- Emit a structured report (file, line, rule violated, suggested fix).

**Affected files:**
- New runtime, location TBD (likely `vault/.tools/lint/` or `scripts/vault-lint/`).
- `.claude/skills/custom/edge-catalog.md` — read as the edge legality source.
- `.claude/skills/custom/frontmatter.md` and `vault/ontology-conventions.md` — read as the schema sources.

---

## [2026-05-03] [MEDIUM] — Decide catalog manifest format (OQ-2) — ❌ NOT DONE

**Context:**
The linter needs the 21-edge catalog as data, not as a Markdown table to re-parse on every run. Three options on the table in `documents-metadata-enforcement.md` §7 OQ-2: (a) parse the table at lint time, (b) hand-maintain a parallel YAML/JSON manifest, (c) generate the manifest from the table in a build step. The discovery recommends (c). Lock the choice when the linter implementation begins so the data path is decided before code is written.

**What needs to be done:**
- Confirm option (c) — generate manifest from Appendix C-equivalent table in `edge-catalog.md` — or override with a recorded reason.
- Specify the manifest schema (suggested: `{forward, inverse, source_node_types, target_node_types, cardinality}`).
- Decide where the generated manifest lives (committed artifact vs. build-time only) and whether table well-formedness is itself a Tier-1 lint check.

**Affected files:**
- `.claude/skills/custom/edge-catalog.md` — source of truth.
- New manifest path (TBD).
- Linter implementation (TBD).

---

# Architectural Resilience & Robustness

---

## [2026-05-03] [MEDIUM] — Decide linter rollout strategy + deadline (OQ-3) — ❌ NOT DONE

**Context:**
Day-one CI gating blocks every PR until every existing document is conformant. `documents-metadata-enforcement.md` §7 OQ-3 frames it as (a) big-bang cleanup PR vs. (b) advisory-then-enforcing with a deadline. The discovery recommends (b) **with a deadline**, because (b) without a deadline becomes another discipline — exactly the failure mode the linter exists to fix.

**What needs to be done:**
- Pick (a) or (b).
- If (b): set a concrete flip-to-enforcing date (calendar date, not "when ready").
- Decide the advisory-mode reporting surface (CI comment, generated report file, both).
- Define the exit criterion that lets the deadline slip — or refuse to allow slippage.

**Affected files:**
- CI configuration (TBD).
- `documents-metadata-enforcement.md` — record the chosen rollout once decided.

---

## [2026-05-03] [LOW] — Close inverse-edge asymmetry on this discovery (OQ-4) — ❌ NOT DONE

**Context:**
`documents-metadata-enforcement.md` §7 OQ-4 acknowledges that the discovery itself ships with intentionally missing inverse edges on `vault/ontology-conventions.md` and on the originating session — exactly the F1 failure mode it documents. The recursion is acknowledged. Per the discovery, closing this asymmetry is the first smoke test of the linter once it exists. Useless to fix by hand before the linter; useful as the linter's first acceptance test after.

**What needs to be done:**
- After the linter is operational, run it against this discovery.
- Add the missing inverse `derived-into` / `cited-by` rows on `vault/ontology-conventions.md` so the discovery's asymmetric edges become symmetric.
- Confirm the linter, on a re-run, reports zero violations against this discovery — that confirms the rule is enforced, not just stated.

**Affected files:**
- `vault/ontology-conventions.md` — add inverse edges in its `## Connections` block.
- `vault/discovery/documents-metadata-enforcement/documents-metadata-enforcement.md` — strike OQ-4 from §7 once closed.

---

# Completed / Done

---

## [2026-05-03] [HIGH] — OQ-1: Skill/agent files as edge endpoints — ✅ DONE

**Context:**
OQ-1 in `documents-metadata-enforcement.md` asked whether files under `.claude/skills/**` and `.claude/agents/**` should be admitted as legal vault edge endpoints. The user has affirmed reading (a) — they are not, and they will not be given a `node_type`. Cross-surface references to them stay as prose in document bodies. The session `2026-05-03-0240-edge-catalog-skill-and-routing.md` recorded five edges that the curator refused for this exact reason; those refusals are correct under the closed decision, and that session's HTML-comment trace is now the audit trail rather than an open question.

**What needs to be done:**
- (None — decided.) Future re-litigation of OQ-1 should be redirected here.

<!--
  No `## Connections` block: backlog files carry frontmatter only — no edges
  in either direction — per user directive (2026-05-03). Lineage to the
  parent discovery is carried by filesystem placement; lineage to the
  authoring session(s) is carried in prose elsewhere. The catalog formally
  permits `session → any` edges to land here, but that allowance is waived
  for backlog targets at least for now.
-->
