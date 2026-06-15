---
module: deterministic-test-derivation-engine
node_type: work-pack
version: current
status: draft
updatedAt: 2026-06-12T00:00:00Z
docType: work-pack
---

# WORK-PACK: Deterministic Test-Derivation Engine (Track 1)

Engine-scoped executable plan. The full two-track view (engine + C2 experiments) lives in the refine run: [../2026-06-12-test-derivation-c2-cluster/plan/WORK-PACK.md](../2026-06-12-test-derivation-c2-cluster/plan/WORK-PACK.md). This file is the canonical work-pack for the **engine product**.

## Control Fields

| Field               | Value                                                                                                                                                | Notes                                                       |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| workPackGateStatus  | pass                                                                                                                                                 | Planning-complete; per-SWU gates flip at task-session time. |
| complexity          | high                                                                                                                                                 | Grammar + pure δ rule encoding.                             |
| outputMode          | single-file                                                                                                                                          | Split into task files at execution time if delegated.       |
| executionPackRef    | n/a                                                                                                                                                  | Generate at task-session.                                   |
| layeringArtifactRef | [../2026-06-12-test-derivation-c2-cluster/plan/IMPLEMENTATION-LAYERING.md](../2026-06-12-test-derivation-c2-cluster/plan/IMPLEMENTATION-LAYERING.md) | L0–L3.                                                      |
| activeLayerWindow   | L0                                                                                                                                                   | MVP engine, financial-settlement.                           |
| lastUpdatedAt       | 2026-06-12T00:00:00Z                                                                                                                                 |                                                             |
| readinessProfile    | pilot                                                                                                                                                |                                                             |

## Objective Summary

- Objective: ship an MVP fully-deterministic TypeScript engine that compiles `financial-settlement` formal docs into byte-stable test obligations and round-trips the committed TEST-SPEC.
- Primary inputs: [SPEC.md](SPEC.md), [ARCHITECTURE.md](ARCHITECTURE.md), [GLOSSARY.md](GLOSSARY.md), poker-team feature docs.
- Success condition: L0 round-trip gate passes (engine obligation-key set ⊇ committed; byte-identical across 2 runs).

## Delivery Slices

| Slice ID | Outcome                                     | Layer | Wave  | Dependencies | Validation                                                                  |
| -------- | ------------------------------------------- | ----- | ----- | ------------ | --------------------------------------------------------------------------- |
| S-ENG-1  | MVP engine round-trips financial-settlement | L0    | W0–W1 | none         | round-trip ⊇ committed; 2-run byte-diff empty                               |
| S-ENG-2  | 2nd feature + emit_tests + linter           | L1    | W2    | S-ENG-1      | auth-access-control round-trips; emitted vitest green; needs_formal counted |

## Task Status Board

| Task ID  | Goal                           | Layer | Complexity | Waves | Source                             | Gate Status | Status                                                                                                                                                                            |
| -------- | ------------------------------ | ----- | ---------- | ----- | ---------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TASK-ENG | Build MVP deterministic engine | L0–L1 | high       | W0–W2 | [ARCHITECTURE.md](ARCHITECTURE.md) | ready       | **L0 ✅ PASS** (financial-settlement round-trip missing=0, byte-stable; 33/33 tests). L1 mostly done; auth-access-control round-trip FAILs on oracle-convention drift (follow-up) |

## SWU Execution Handoff

| SWU ID      | Parent Task | Source Anchors                                                                                                                                       | Dependencies | Write Scope                                                           | Done Criteria                                                             | Acceptance Evidence                                      | Validation Surface                  | Execution Owner | Handoff Status                                                                                                         |
| ----------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| SWU-ENG-000 | TASK-ENG    | [ARCHITECTURE.md](ARCHITECTURE.md) View 2/3; D-002 (TS)                                                                                              | none         | `tools/test-derivation-engine/` skeleton + README + tsconfig + vitest | package builds; CI stub green                                             | `tsc --noEmit` + build                                   | `pnpm run typecheck` + `vitest run` | subagent        | **completed** ✅ (typecheck exit 0; 7/7 tests pass incl. obligation_key determinism)                                   |
| SWU-ENG-001 | TASK-ENG    | [ARCHITECTURE.md](ARCHITECTURE.md) View 3 `grammar/`; SPEC Concept Model; poker-team `financial-settlement/{states,operations,interfaces,events}.md` | SWU-ENG-000  | `grammar/`, `ir/`                                                     | strict parser builds typed `G`; rejects non-canonical with file:line      | parser unit tests over 4 docs                            | `vitest run grammar`                | subagent        | **completed** ✅                                                                                                       |
| SWU-ENG-002 | TASK-ENG    | [ARCHITECTURE.md](ARCHITECTURE.md) View 3 `ir/`; GLOSSARY (G, Node, Edge)                                                                            | SWU-ENG-001  | `ir/` types + deterministic serializer                                | G types complete; sorted by source_anchor                                 | typecheck + IR snapshot                                  | `vitest run ir`                     | subagent        | **completed** ✅                                                                                                       |
| SWU-ENG-003 | TASK-ENG    | [ARCHITECTURE.md](ARCHITECTURE.md) View 5; `domainspec/TEST-PIPELINE.md`; GLOSSARY (exact cardinality)                                               | SWU-ENG-002  | `rules/` pure functions                                               | ~6 rule fns; no open cardinalities; invalid-transition lex-ordered        | rule unit tests; R-002 property test                     | `vitest run rules`                  | subagent        | **completed** ✅ (incl. workflow/query/mapping rules for 7-doc coverage)                                               |
| SWU-ENG-004 | TASK-ENG    | [ARCHITECTURE.md](ARCHITECTURE.md) View 3 `keys/`; GLOSSARY (obligation_key)                                                                         | SWU-ENG-003  | `keys/`                                                               | `sha1(source_anchor\|rule_type\|canonical_params)`; byte-identical 2 runs | hash-stability test                                      | `vitest run keys`                   | subagent        | **completed** ✅                                                                                                       |
| SWU-ENG-005 | TASK-ENG    | [ARCHITECTURE.md](ARCHITECTURE.md) View 4 round-trip; committed `financial-settlement/TEST-SPEC.md`                                                  | SWU-ENG-004  | `emit/emit_spec`, `roundtrip/`                                        | engine TEST-SPEC ⊇ committed; extras classified                           | **L0 round-trip gate**                                   | `tsx src/cli.ts roundtrip`          | subagent        | **completed** ✅ PASS (missing=0, 7-doc)                                                                               |
| SWU-ENG-006 | TASK-ENG    | [ARCHITECTURE.md](ARCHITECTURE.md) RK-001; poker-team `auth-access-control/*`                                                                        | SWU-ENG-005  | linter + needs_formal + 2nd-feature support                           | auth-access-control round-trips; prose flagged (counted), not guessed     | linter CI + round-trip                                   | `tsx src/cli.ts lint`               | subagent        | **partial** — linter ✅, 2nd feature parses (108 obs) but auth round-trip FAILs on oracle-convention drift (follow-up) |
| SWU-ENG-007 | TASK-ENG    | [ARCHITECTURE.md](ARCHITECTURE.md) §emit; GLOSSARY (emit_tests)                                                                                      | SWU-ENG-006  | `emit/emit_tests`                                                     | runnable vitest mapped 1:1 to obligation_keys                             | emitted file transpiles (TS compiler API, 0 diagnostics) | `vitest run`                        | subagent        | **completed** ✅                                                                                                       |

## Blockers

| Blocker ID | Scope       | Description                                                                                                                                                                                                                                                                                                                                                                                       | Owner        | Next Action                                                        | Target Date |
| ---------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------ | ----------- |
| B-ENG-1    | SWU-ENG-007 | Cross-submodule write of emitted tests into poker-team — keep as a separate, explicit commit (RK-004).                                                                                                                                                                                                                                                                                            | engine owner | default to emit_spec only; gate test-emission behind explicit flag | W2          |
| B-ENG-2    | cross-repo  | Engine + commits in implementation/domainspec; docs/code in validation/poker-team. Submodule-first, parent-last, `make bump-check`.                                                                                                                                                                                                                                                               | operator     | confirm layout before W0                                           | before W0   |
| B-ENG-3    | 2nd feature | auth-access-control round-trip FAILs (missing 30 / extra 25): its TEST-SPEC uses a different oracle dialect (`AUTH-RULE-001` ids, entity-name drift `Session` vs `SessionLifecycle`, row-id-keyed transitions, dedicated Error-state category, consumer-bucketed events). δ logic sound; this is identity-convention drift, not a rule gap. See [L0-ROUNDTRIP-REPORT.md](L0-ROUNDTRIP-REPORT.md). | engine owner | generalize semantic-id bridging / canonicalize the auth oracle     | L1          |

## Gate Checks

1. workPackGateStatus pass before mutation-capable execution.
2. High complexity → generate executionPackRef + baseline wave W0 at task-session.
3. Layer mappings consistent with the layering artifact (engine L0–L1; experiments deferred to L2–L3 in the refine plan).
4. R-002 (δ purity property test) and the L0 round-trip gate are mandatory exit evidence for S-ENG-1.
5. Every SWU carries dependencies, source anchors, write scope, done criteria, acceptance evidence, validation surface, execution owner.
6. Parallel SWUs disjoint: all engine SWUs write only under `internal_tools/test_derivation_engine/` except SWU-ENG-007's optional test emission (separate scope/commit).

## Change Log

| Date       | Change                                             | Author        |
| ---------- | -------------------------------------------------- | ------------- |
| 2026-06-12 | Engine work-pack from define+design (invoke chain) | invoke (plan) |
