# Work Pack: Governance Attenuation Scriptability

Status: `executed-l0`

## Objective

Move the first slice of governance attenuation from prose instructions into a runnable script-backed audit surface.

## SWU Manifest

| SWU           | Status   | Goal                                                        | Verification                                                                             |
| ------------- | -------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `SWU-GAS-001` | done     | Add source-layout resolver and consolidated audit command.  | Parent/source checkout probes in `TASK-SESSION-REPORT.md`.                               |
| `SWU-GAS-002` | deferred | Migrate or compatibility-wrap legacy signal ledger records. | `validate-signals.ts` passes on `docs/signals/pipeline-signals.jsonl`.                   |
| `SWU-GAS-003` | deferred | Wire audit into CI/pre-commit as an L6 gate.                | CI/pre-commit command invokes audit and policy defines block/flag semantics.             |
| `SWU-GAS-004` | deferred | Strengthen prune rule mapping from keywords to rule IDs.    | Prune report maps `shouldHaveBeenCaughtBy` to constitution IDs without keyword guessing. |

## Executed Task: `TASK-GAS-001`

Goal: Execute `SWU-GAS-001`.

Write scope:

- `package.json`
- `tools/lib/domainspec-paths.ts`
- `tools/governance-attenuation-audit.ts`
- `tools/validate-governance-chain.ts`
- `tools/analyze-signals.ts`
- `tools/generate-meta-health.ts`
- `tools/prune-governance.ts`
- `tools/detect-signals.ts`
- `tools/run-async-observer.ts`
- `tools/run-fast-observer.ts`
- `tools/build-telemetry-bundle.ts`
- this refinement run folder

Done criteria:

- Governance chain validator runs from parent checkout.
- Signal analyzer runs from parent checkout without crashing on legacy records.
- Fast observer has a clean no-signal path.
- Audit command writes a report.
- Audit command exposes current signal ledger invalidity as a block.

## Follow-Up

The next executable task should be `SWU-GAS-002`, not CI wiring. The signal ledger must be migrated or compatibility-wrapped before audit can become a blocking L6 gate.
