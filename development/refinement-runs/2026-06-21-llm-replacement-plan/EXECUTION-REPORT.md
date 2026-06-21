---
node_type: execution-report
run_id: 2026-06-21-llm-replacement-plan
title: Execution Report — backend-domain TEST-SPEC replacement work-pack
status: complete
created: 2026-06-21
owner: task-session (goal: execute all workpack)
---

# Execution Report — work-pack execution (Option C)

Engine: `tools/test-derivation-engine/`. Validation: `npm run typecheck` (0 errors) + `npm run test` (**89 passed**, was 76 → +13 new) + end-to-end CLI runs + byte-stability + drift/containment negative controls.

## Per-SWU status

| Layer / SWU                                                       | Status                               | Evidence                                                                                                                                                                                                                                                                              |
| ----------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------- |
| **Pre-L0** identity decision (Option C)                           | ✅ done                              | [D1](decisions/D1-obligation-identity-option-c.md)                                                                                                                                                                                                                                    |
| **L0** `derive --out` (writes `TEST-SPEC.engine.md` side-by-side) | ✅ done                              | `cli.ts runDerive`; ran on financial-settlement (67 obligations)                                                                                                                                                                                                                      |
| **L0** id-map allocate (sha1 core + human-ID projection)          | ✅ done                              | `identity/human-id.ts` + `id-maps/*.idmap.json`; 9 unit tests                                                                                                                                                                                                                         |
| **L0** provenance header + fenced engine region                   | ✅ done                              | `provenance/index.ts`; header outside region, body inside                                                                                                                                                                                                                             |
| **L0** fail-closed on parser violations (G4)                      | ✅ done                              | `runDerive` returns 4 on violations, no write                                                                                                                                                                                                                                         |
| **L0** emit_dir containment, `derive` + `emit-tests` (G3)         | ✅ done                              | `paths/containment.ts` (4 unit tests); retrofit on the live `emit-tests` path                                                                                                                                                                                                         |
| **L0** drift `check` mode (G2 part 2)                             | ✅ done                              | `runCheck`; proven STALE on in-region perturbation (exit 7), FRESH otherwise                                                                                                                                                                                                          |
| **L1** Source Completeness Gate                                   | ✅ done                              | rendered (financial-settlement: rules.md absent flagged)                                                                                                                                                                                                                              |
| **L1** Coverage Summary + spec-formalization metric               | ✅ done                              | financial-settlement: 67 obl, metric 96.0% (pure 24 / (24+1))                                                                                                                                                                                                                         |
| **L2** harness/formal tier split (G1)                             | ✅ done                              | `tierOf`; 3 tiers (pure 24 / needs-harness 42 / needs-formal 1)                                                                                                                                                                                                                       |
| **L2** Suite Partition + honest gap ledger                        | ✅ done                              | rendered inside region                                                                                                                                                                                                                                                                |
| **L4** self-derive fixpoint (closes C4)                           | ✅ done                              | engine derived its OWN feature → committed `docs/features/test-derivation-engine/TEST-SPEC.engine.md` (31 obligations); "has derived", not just "can"                                                                                                                                 |
| **L4** migration diff                                             | ✅ satisfied by existing `roundtrip` | per skeptic Delta 4: roundtrip already classifies genuineMissing/irreducibleMissing — relabelled "human-adjudicated diff", no redundant command built (proportionality)                                                                                                               |
| **L4** coexistence merge boundary (Delta 3)                       | ✅ done                              | `check` scans OUTSIDE the fence for `                                                                                                                                                                                                                                                 | <PREFIX>-<CLASS>-NNN | ` rows → fail-closed if the LLM redefines a backend engine ID; proven 0-overlap FRESH on all 3 features |
| **L4** wire `domainspec-generate-tests` (live LLM skill)          | ✅ done                              | all 4 mirrors (.claude/.agents/.github/copilot) rewired ENGINE-FIRST: engine `derive --out` produces the fenced backend block; LLM authors only UI/E2E + scaffolding outside it; adds `check` verification; explicit SCOPE note (backend-only)                                        |
| **L3** domain.md + rules.md grammar                               | ✅ done                              | `parseDomain` (DomainField + Enum) + `parseRules` (reuses transition/invariant δ + new policy-decision); 3 new rule_types + tier/class maps. AEO: 263 obligations (71 domain-field, 7 domain-enum, 6 policy-decision, …); financial-settlement 67→79. 6 new L3 tests on both corpora. |

## What "backend-domain replacement" delivers today (honest scope)

Operation-class + invariant/calculation/postcondition obligations, deterministically, with stable human IDs, provenance, drift detection, and an honest tier/gap ledger. **Not yet**: domain-model/rules-class obligations (L3) or the live pipeline swap (gated). UI/E2E + scaffolding remain LLM-owned by design.

## New/changed files

- new: `src/identity/human-id.ts` (+test), `src/provenance/index.ts`, `src/paths/containment.ts` (+test)
- changed: `src/emit/spec.ts` (L1/L2 sections + tier + document composer), `src/cli.ts` (derive --out, check, containment, fail-closed, flags)
- generated/committed: `id-maps/financial-settlement.idmap.json`, `id-maps/test-derivation-engine.idmap.json`, `docs/features/test-derivation-engine/TEST-SPEC.engine.md` (fixpoint), `validation/poker-team/docs/features/financial-settlement/TEST-SPEC.engine.md` (demo)

## Residue / next

- All L0–L4 SWUs executed (L3 + live-wiring completed under the `execute all workpack` goal). Engine: typecheck 0, 95 tests.
- **Operational follow-ups (not blockers):** value-asserting oracles for more domain-field/policy-decision rows (currently honest needs-harness skips); 2-rater survivor classification for E3; a real pipeline run of the rewired skill on a feature with UI-SPEC to exercise engine(backend)+LLM(UI/E2E) coexistence end-to-end.
