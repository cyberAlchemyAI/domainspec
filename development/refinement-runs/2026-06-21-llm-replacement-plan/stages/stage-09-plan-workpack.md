---
stage: invoke-plan
mode: plan
owner: refine
created: 2026-06-21
verdict: draft-for-review
status: non-executed
---

# Plan (non-executed) — Backend-domain TEST-SPEC replacement

Layered L0→L4. Each layer's exit evidence is byte-stable engine output + (where stated) a real-feature re-derivation diff. **No code is changed in this refine run** — this is the work-pack.

## Honest baseline (what exists / what's missing)

- **Exists:** `derive` (parse→δ→emitSpec, stdout-only, 4-col table); `emit-tests` (hybrid, _does_ write a file via bindings `emit_dir`+`test_file`, line 179); roundtrip + negative-control gate; bindings sidecars.
- **Parse coverage gap (new finding):** grammar reads `states/operations/interfaces/events/workflows/queries/mappings`. It does **not** parse `domain.md` or `rules.md` — exactly where the LLM sources Domain-Model (15) + Rules (30) obligations in the AEO corpus. So "backend-domain replacement" today really means **operation-class obligations**; domain/rules classes need grammar extension (L3).
- **Format gap:** `emitSpec` is a skeleton 4-col table; the LLM TEST-SPEC has completeness-gate / suite-partition / traceability / coverage-summary sections + stable human IDs.

## L0 — Make `derive` write a file, fail-closed, provenance-stamped (closes G2 + G4)

- **SWU-1 `derive --out`**: write `docs/features/{feature}/TEST-SPEC.engine.md` (NOT overwrite the LLM file yet — side-by-side). Reuse the `emit-tests` write+mkdir pattern (cli.ts:179–181).
- **SWU-2 provenance header**: emit `engine_commit`, per-input-doc sha + `format_version` as a fenced front block. (G2 part 1)
- **SWU-3 fail-closed**: if `violations.length > 0`, exit non-zero and do NOT write (matches lint's exit 4). (G4)
- **SWU-4 emit_dir containment**: assert the resolved out-path stays within the feature submodule; reject paths escaping into `arcanum`/parent. (G3 — also retrofit `emit-tests`.)
- **Exit evidence:** `derive --out financial-settlement` writes a byte-stable file twice-identical; a doctored binding/out-path is rejected; a non-canonical doc returns non-zero with no file written.

## L1 — Derivable structural sections (mechanical parity, no new δ)

- **SWU-5 Coverage Summary**: counts by `rule_type`.
- **SWU-6 Source Completeness Gate**: which canonical docs were present/parsed.
- **SWU-7 Unresolved Formal Gaps**: render `needs_formal` + `needs-harness` lists (depends on L2 tier split for the harness half).
- **Exit evidence:** the three sections appear, byte-stable, matching hand-counted obligations.

## L2 — Harness/needs-formal tier split in the output (closes G1)

- **SWU-8**: tag every obligation `derivable-pure | derivable-needs-harness | needs-formal`; render Suite Partition (Unit = pure, Integration = needs-harness) and split the gap counts.
- **Exit evidence:** financial-settlement obligations partition with no obligation uncategorized; metric reports `formalization = pure/(pure+needs_formal)` separately from the harness count.

## L3 — Parse coverage: domain.md + rules.md (widen the owned surface)

- **SWU-9 `domain.md` grammar**: parse entity/value-object/enum tables → Domain-Model obligations (schema-required-field, enum-vocabulary, value-object-constraint).
- **SWU-10 `rules.md` grammar**: parse policy/state-machine tables → rule/transition/invariant obligations.
- **Exit evidence:** re-derive AEO; the engine now emits the Domain-Model + a substantive share of the Rules obligations; remainder honestly classified.
- **Note:** this is the biggest lift and is _optional for MVP_ — L0–L2 already deliver operation-class replacement.

## L4 — Pipeline wiring + format decision + migration proof

- **SWU-11 format decision** — **DECIDED 2026-06-21: Option C** (sha1 core + committed human-ID projection map, gated by drift `check`). See [D1](../decisions/D1-obligation-identity-option-c.md). The id-map read/allocate path + `check` mode move into **L0** (no longer L4); migration diff stays L4 but is now per-stable-id.
- **SWU-12 wire `domainspec-generate-tests`**: engine produces the backend-domain block; LLM produces UI/E2E + scaffolding; merge with delimiters; engine block wins on the derivable surface (no LLM fabrication there).
- **SWU-13 migration proof**: re-derive one real feature (e.g. agent-execution-orchestrator operation class) via the engine; diff vs the committed LLM TEST-SPEC; the diff = the spec gaps the LLM was hiding. This is the acceptance evidence for "replacement works."
- **SWU-14 (fixpoint, closes C4)**: run the engine on its own feature → commit its `TEST-SPEC.engine.md`; turns the aspirational fixpoint claim into a real artifact.

## Validation strategy (per layer)

vitest unit tests on each new emitter/grammar fn + byte-stability assertion (derive twice, compare) + roundtrip stays green + the L4 migration diff reviewed by a human. No layer promotes on preference — each needs its exit evidence.

## Explicit non-goals (claim ≤ proof)

- No UI/E2E/Playwright derivation. No scaffolding generation. No "full LLM replacement."
- No overwrite of committed LLM TEST-SPEC.md until L4 + operator sign-off (side-by-side `.engine.md` until then).
