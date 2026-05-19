---
tags: [vault, lens-findings, close-session-redesign]
node_type: findings
is_session: false
layer: ontology
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-17
dispatch_status: historical
retrofits: true
synthesized-by: ../../research/research.md
backfilled: true
---

# Findings — Record Layer Mechanics

## Objective

Specify Layer 1 (Record) of close-session as a mechanical, deterministic, exhaustive-within-budget signpost block that cannot be contaminated by Layer 2 prose.

## Headline claim

Layer 1 earns its keep only if every field is **auto-derivable from on-disk state or filled with a closed-vocabulary token**, and only if Record→Reckon ordering is enforced by **write order on disk**, not by in-prompt instruction. A flushed file with a sentinel comment converts "Reckon contaminated Record" from a discipline problem into a structurally impossible failure mode.

## Key design moves

- **Frontmatter schema (~20 fields).** Identity (`session_id`, `scratchpad`), disk delta (`files_touched[*].path/change/lines_added/lines_removed/semantic` plus `*_count` mirror fields), experiments (`experiments_run[*].path/status`), premise tests with verdict ∈ `{supported, refuted, inconclusive}`, `candidate_premises` (≤5 × ≤120 chars), `artifacts` (folders only), bookkeeping (`record_budget`, `record_budget_resolved`, `record_lines_used`).
- **`record_budget: auto` formula.** `min(120, 12 + 4·files_touched_semantic + 8·experiments_run_count + 6·premise_tests_count + 2·len(candidate_premises) + 3·len(artifacts))`. Coefficients are *costs in lines*, never importance weights. Integer override allowed both directions; the override is logged.
- **Freeze rule via write order + sentinel.** Compute auto fields → solicit closed-vocab judgment → validate budget → write frontmatter + closing `---` + `<!-- record-layer-frozen -->` → flush. Only then begin Layer 2. The sentinel is the structural lock.
- **Auto-derivation everywhere possible.** `git status --porcelain`, `git diff --name-status`, `git diff --numstat`, `experiments/` mtime, scratchpad birth time. Agent supplies only slug, `semantic` boolean, verdict tokens, candidate strings.
- **Collapse rule for noisy mass-touch sessions.** If `files_touched_count - files_touched_semantic > 10`, collapse non-semantic entries into one summary block with `count`, `glob`, `change_breakdown` — the only place Layer 1 summarizes (counts only, never meaning).

## Edge cases covered

- Zero file changes + real verdict → Layer 1 still emits the test entry.
- Mass rename / formatter run → budget refuses to grow.
- Scratchpad-only session with candidate premise → minimal 14-line note.
- Multi-commit mid-session → use scratchpad birth time, not `HEAD~1`.
- Genuine budget overflow → hard fail `RECORD_BUDGET_EXCEEDED: split this session`.

## Caveats

- 120-line cap = "one terminal screen"; unvalidated empirically.
- `semantic: false` heuristic (≤4-line diff AND `change != A`) is a guess needing calibration.
- Scratchpad birth-time is macOS-specific; cross-platform fallback unspecified.

## Open Questions

- Should `semantic` default tighter (≤2 lines) or looser?
- Cross-platform session-start marker.
- `candidate_premises` hashed for dedup?
- Hand-off with future `promote-premise` skill renames.

## Connections

- `derives-from` → `../../discovery.md`
- `derives-from` → `../../research/research.md`
