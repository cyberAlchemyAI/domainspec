---
node_type: refinement-seed
title: Refine Seed — C2 Engine-to-Evidence
status: proposed
created: 2026-06-21
owner: refine
---

# Refine Seed Proposal — C2 Engine-to-Evidence

- Run id: `2026-06-21-c2-engine-to-evidence`
- Operator intent (verbatim): "refine everything so we can do this engine working" — scope confirmed: whole C2 program (engine completion + E1a/E2/E3 experiments → publishable evidence).

## Target

The full C2 "test derivation" program:

1. **Engine completion** — `tools/test-derivation-engine` (design: `development/deterministic-test-derivation-engine/`; state: its Craft ledger).
2. **Reframed experiments** — E1a/E2/E3 in `development/refinement-runs/2026-06-12-test-derivation-c2-cluster/`.

Refine the path from current state to a generally-working engine across the poker-team corpus AND publishable C2 evidence. Non-executed plan only.

## Current state (load-bearing)

- L0 falsification gate PASSES for `financial-settlement`: round-trip missing=0, byte-stable, 33/33 tests, tsc 0.
- L1 partial: `emit_tests` + linter done; 2nd feature `auth-access-control` parses (108 obligations, 0 violations) but its round-trip FAILs (30 missing / 25 extra) on oracle-convention drift.
- Engine committed (`ff1eba0`); parent gitlink bumped (`af15e4d`).

## Open items to close (from the Craft ledger)

- `BLK-TDE-AUTH-CONVENTION-001` — generalize semantic-id bridging across oracle dialects WITHOUT hardcoding.
- `GATE-TDE-CORPUS-GENERALIZATION-001` — round-trip ≥N features, not just one.
- `GAP-TDE-EMITTESTS-BODIES-001` — real emitted test bodies (not `expect.fail` stubs) so E3 mutation can run.
- `DEC-TDE-SEMANTIC-RIGOR-001` — per-row vs concept-bucket gate identity (open).

## The central tension (what the refine must resolve honestly)

Generalizing the bridging until round-trips pass risks **teaching to the test** — converting the C2 falsification into a self-fulfilling proof. The refine must draw the line between _general deterministic derivation_ and _gate-tuned-to-match-oracle_, and decide whether to generalize the engine, canonicalize the oracle, or both.

## Write scope

Target-local run folder only: `development/refinement-runs/2026-06-21-c2-engine-to-evidence/`. No engine code mutation, no experiment execution.

## Done criteria

1. A defensible resolution of the bridging-vs-falsification tension, with a rule for what counts as an honest round-trip PASS.
2. General bridging design (auth + corpus) or an explicit oracle-canonicalization decision — chosen via tournament.
3. A concrete approach for `emit_tests` runnable bodies that unblocks E3 mutation.
4. A resolution for `DEC-TDE-SEMANTIC-RIGOR-001`.
5. Reframed, runnable E1a/E2/E3 protocols grounded in the now-existing engine + the measurement tooling ledger.
6. Updated residue ledger; recommended next routes (task-session per unit).

## Validation surface

Tensioned 4-subagent panel (Engine Generalization Architect ↔ Falsification Skeptic; emit_tests/E3 Architect; Experiments Cartographer), Refine-owned convergence + synthesis.

## Preset / research

- Preset: `full`
- Research: `research-if-gap-appears` (internal; trigger only on a named methodology gap, e.g. deterministic assertion-body generation for mutation testing).

## Planned stage configuration

Canonical ten-stage loop; Design/Interrogation/Distill critique delegated to the 4 subagents; Refine owns synthesis and the non-executed plan.
