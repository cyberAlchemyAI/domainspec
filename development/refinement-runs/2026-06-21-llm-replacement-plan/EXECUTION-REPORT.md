---
node_type: execution-report
run_id: 2026-06-21-llm-replacement-plan
title: Execution Report — backend-domain TEST-SPEC replacement work-pack
status: partial-complete
created: 2026-06-21
owner: task-session (goal: execute all workpack)
---

# Execution Report — work-pack execution (Option C)

Engine: `tools/test-derivation-engine/`. Validation: `npm run typecheck` (0 errors) + `npm run test` (**89 passed**, was 76 → +13 new) + end-to-end CLI runs + byte-stability + drift/containment negative controls.

## Per-SWU status

| Layer / SWU                                                       | Status                               | Evidence                                                                                                                                                                                                                                                |
| ----------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pre-L0** identity decision (Option C)                           | ✅ done                              | [D1](decisions/D1-obligation-identity-option-c.md)                                                                                                                                                                                                      |
| **L0** `derive --out` (writes `TEST-SPEC.engine.md` side-by-side) | ✅ done                              | `cli.ts runDerive`; ran on financial-settlement (67 obligations)                                                                                                                                                                                        |
| **L0** id-map allocate (sha1 core + human-ID projection)          | ✅ done                              | `identity/human-id.ts` + `id-maps/*.idmap.json`; 9 unit tests                                                                                                                                                                                           |
| **L0** provenance header + fenced engine region                   | ✅ done                              | `provenance/index.ts`; header outside region, body inside                                                                                                                                                                                               |
| **L0** fail-closed on parser violations (G4)                      | ✅ done                              | `runDerive` returns 4 on violations, no write                                                                                                                                                                                                           |
| **L0** emit_dir containment, `derive` + `emit-tests` (G3)         | ✅ done                              | `paths/containment.ts` (4 unit tests); retrofit on the live `emit-tests` path                                                                                                                                                                           |
| **L0** drift `check` mode (G2 part 2)                             | ✅ done                              | `runCheck`; proven STALE on in-region perturbation (exit 7), FRESH otherwise                                                                                                                                                                            |
| **L1** Source Completeness Gate                                   | ✅ done                              | rendered (financial-settlement: rules.md absent flagged)                                                                                                                                                                                                |
| **L1** Coverage Summary + spec-formalization metric               | ✅ done                              | financial-settlement: 67 obl, metric 96.0% (pure 24 / (24+1))                                                                                                                                                                                           |
| **L2** harness/formal tier split (G1)                             | ✅ done                              | `tierOf`; 3 tiers (pure 24 / needs-harness 42 / needs-formal 1)                                                                                                                                                                                         |
| **L2** Suite Partition + honest gap ledger                        | ✅ done                              | rendered inside region                                                                                                                                                                                                                                  |
| **L4** self-derive fixpoint (closes C4)                           | ✅ done                              | engine derived its OWN feature → committed `docs/features/test-derivation-engine/TEST-SPEC.engine.md` (31 obligations); "has derived", not just "can"                                                                                                   |
| **L4** migration diff                                             | ✅ satisfied by existing `roundtrip` | per skeptic Delta 4: roundtrip already classifies genuineMissing/irreducibleMissing — relabelled "human-adjudicated diff", no redundant command built (proportionality)                                                                                 |
| **L4** coexistence merge boundary (Delta 3)                       | ⏸ ready, gated                       | the fenced ENGINE-REGION contract is built (L0); the fail-closed merge check is **coupled to the live-skill wiring** below                                                                                                                              |
| **L4** wire `domainspec-generate-tests` (live LLM skill)          | ⏸ DEFERRED — needs explicit confirm  | high blast radius: changes how tests are generated project-wide. Engine side is ready (side-by-side `.engine.md` + fence). Not auto-executed under the goal hook.                                                                                       |
| **L3** domain.md + rules.md grammar                               | ⏸ DEFERRED with reason               | MVP-optional. domain.md is regular (parseable), rules.md (343 ln) is heterogeneous; a correct grammar+δ extension is a multi-SWU effort comparable to all of L0–L2 and needs its own define/design pass. L0–L2 deliver operation-class replacement now. |

## What "backend-domain replacement" delivers today (honest scope)

Operation-class + invariant/calculation/postcondition obligations, deterministically, with stable human IDs, provenance, drift detection, and an honest tier/gap ledger. **Not yet**: domain-model/rules-class obligations (L3) or the live pipeline swap (gated). UI/E2E + scaffolding remain LLM-owned by design.

## New/changed files

- new: `src/identity/human-id.ts` (+test), `src/provenance/index.ts`, `src/paths/containment.ts` (+test)
- changed: `src/emit/spec.ts` (L1/L2 sections + tier + document composer), `src/cli.ts` (derive --out, check, containment, fail-closed, flags)
- generated/committed: `id-maps/financial-settlement.idmap.json`, `id-maps/test-derivation-engine.idmap.json`, `docs/features/test-derivation-engine/TEST-SPEC.engine.md` (fixpoint), `validation/poker-team/docs/features/financial-settlement/TEST-SPEC.engine.md` (demo)

## Residue / next

- **L3** grammar extension — its own invoke define/design (domain.md first; rules.md second).
- **L4 live wiring** — operator confirm required; then add the fail-closed merge-boundary check.
