---
tags: [vault, frontmatter, signals, vault-newspaper, editor-input]
node_type: findings
is_session: false
layer: ontology, application
nature: reference, technical
status: active
dispatch_status: backfilled-no-prompt-recoverable
lens_order: first
version: 0.1.0
last_updated: 2026-05-25
created_by: victorboscaro@gmail.com
---

# Findings — Vault Frontmatter Coverage Audit

## Objective

Verify the discovery's §2.5 claim that vault frontmatter signals (`expected_importance`, `decisions_made`, `contradictions_found`, `specs_updated`, `promoted_candidates`, `importance_rationale`) are reliable enough to be the Editor's primary input feature vector.

## Method

`find` + `grep` count over `/Users/victorboscaro/domainspec/vault/sessions/` (n=50) and `vault/discovery/**/*.md` (n=127). Spot-check of 6 sessions (3 high-importance, 3 low-importance) to verify scoring tracks actual scope.

## Findings

### F1. Sessions are well-covered (✓ direct count, n=50)

| Field | Present | Non-default |
|---|---|---|
| `expected_importance` | 49 (98%) | 49 (100%) |
| `importance_rationale` | 49 (98%) | 49 (100%) |
| `decisions_made` | 49 (98%) | 48 true (97%) |
| `contradictions_found` | 49 (98%) | 29 true (59%) |
| `specs_updated` | 49 (98%) | 33 non-empty (67%) |
| `promoted_candidates` | 47 (94%) | 13 non-empty (27%) |

### F2. 🚨 Discoveries carry ZERO of the seven fields (✓ direct count, n=127)

Every one of `expected_importance`, `importance_rationale`, `decisions_made`, `contradictions_found`, `specs_updated`, `promoted_candidates` is **absent from all 127 discovery files** under `vault/discovery/`. The discovery's §2.5 claim "DomainSpec's session frontmatter carries…" is true for sessions; **the implicit assumption that the same fields are available on discoveries is false.**

### F3. `expected_importance` distribution shows mild inflation (✓ direct count)

- 0–3: 0 sessions
- 4–6: 10 sessions (20%)
- 7–8: 28 sessions (57%) ← mode
- 9–10: 11 sessions (22%)

No session scores below 4. The 7–10 band carries genuine separation; the score is reliable *within* that band. Editor should not treat 4–10 as a uniform scale.

### F4. `decisions_made` is near-constant true (✓ direct count)

48/49 = 97% true. Editor cannot use this as a ranking signal — it is functionally always-on. Useful only as a "did anything happen" gate.

### F5. `contradictions_found` carries real variance (✓ direct count)

29 true / 20 false = 59/41 split. Genuine semantic content. **Best discrete signal in the set.**

### F6. `promoted_candidates` is mostly empty (✓ direct count)

27% non-empty. Field is intended but under-populated. Tier C — Editor cannot depend on it.

### F7. High-importance samples track real scope (○ spot-check, n=3)

- `R-Residue Closure + Lean Anchor Drafts` (importance: 10) — closed R1–R4 residue points, produced 11 vault artifacts + 4 code modules + 3 Lean drafts. Legitimately foundational.
- `Strange Loop Complete — Graded Knowledge Graph as Residue Attractor` (10) — produced three major discoveries. Legitimately load-bearing.
- `Semantic RAG Discovery Review` (9) — converted speculative discovery into operational spec with falsifiable gates. Legitimately material.

Scoring is not inflated *at the high end*. The floor (no scores ≤3) is where inflation lives.

### F8. Low-importance samples genuinely have low scope (○ spot-check, n=3)

- `mars-researcher Rename and Planner Wiring` (4) — config-only, no vault graph impact. Correct.
- `Agents & Skills Telemetry Design` (4) — research plan; no implementation. Correct.
- `No Edges on Backlog Files` (5) — narrow operational rule. Correct.

### F9. Alternative signals exist on discoveries (○ partial)

`veracidade` and `convicção` appear on 25/127 discoveries (≈19%). Too sparse to use as primary signals, but indicates an alternate epistemic dimension exists. Not Editor-ready without backfill.

## Reliability tiers

- **Tier A (Editor can depend on):** `expected_importance`, `importance_rationale`, `contradictions_found` — sessions only.
- **Tier B (use defensively):** `specs_updated` — sessions only.
- **Tier C (avoid as primary signal):** `decisions_made` (no variance), `promoted_candidates` (sparse).
- **Discoveries:** none of the seven fields available. Editor must use `node_type`, `status`, `last_updated` only — or a backfill pass is required.

## Implications for the discovery

1. Restate §2.5 honestly: the input feature vector is sessions-rich, discoveries-sparse.
2. Either (a) commit to a backfill pass on the 26 existing discoveries, or (b) accept that v0.1 newspaper synthesizes primarily over sessions, with discoveries appearing only as cited sources.
3. Adjust Editor prompt to weight by `expected_importance` only within the 4–10 range; do not treat the scale as uniform.
4. Drop `decisions_made` and `promoted_candidates` from the "rich signals" claim.
5. Consider promoting `contradictions_found` to a top-level editorial cue ("drift surfaced" sections).

## Confidence

- F1, F2, F3, F4, F5, F6, F9: ✓ direct count.
- F7, F8: ○ spot-check of 6 files total.

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/vault-newspaper/research/research.md` | `synthesized-by` | This findings file is consolidated by the research synthesis. |
