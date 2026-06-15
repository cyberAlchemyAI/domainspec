# S01 Context Builder Evidence Baseline

Status: `pass`  
Capability: `context-builder`  
Mode: `standard`

## Obligations

| ID  | Obligation                                                                                                  | Coverage |
| --- | ----------------------------------------------------------------------------------------------------------- | -------- |
| O1  | Apply `GOVERNANCE-ATTENUATION.md` to classify governance duties that can move from instructions to scripts. | covered  |
| O2  | Use local repository evidence only unless a named external gap appears.                                     | covered  |
| O3  | Preserve source checkout versus installed `domainspec/` layout boundaries.                                  | covered  |
| O4  | Produce a concrete executable goal after refinement.                                                        | covered  |
| O5  | Execute the produced goal and validate it against current state.                                            | covered  |

## Selected Evidence

| Path                                        | Selectors                                                                             | Why Included                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `GOVERNANCE-ATTENUATION.md`                 | Structural Interventions; Priority Actions; Relationship to Existing Roadmap          | Primary source for moving governance out of instruction load.                 |
| `GOVERNANCE-ATTENUATION-EXECUTION-BOARD.md` | Wave 1; Wave 4; Wave 5                                                                | Existing plan already names detector, telemetry, observer, and pruning waves. |
| `tools/detect-signals.ts`                   | top-level CLI; `detectMissingConceptAnchors`; `detectTodoSignals`; `detectScopeDrift` | Existing deterministic artifact-level detector.                               |
| `tools/run-fast-observer.ts`                | wrapper command flow                                                                  | Existing fast observer gate, initially hardcoded to installed layout.         |
| `tools/build-telemetry-bundle.ts`           | payload shape                                                                         | Existing session telemetry bundle builder.                                    |
| `tools/run-async-observer.ts`               | behavior-signal rules                                                                 | Existing async observer.                                                      |
| `tools/validate-signals.ts`                 | envelope and completeness invariants                                                  | Existing signal contract validator.                                           |
| `tools/analyze-signals.ts`                  | TH1-TH10 threshold checks                                                             | Existing reflection trigger analyzer.                                         |
| `tools/prune-governance.ts`                 | rule usage and zero-evidence candidates                                               | Existing Via Negativa governance pruning script.                              |
| `tools/generate-meta-health.ts`             | M-001..M-006 report                                                                   | Existing attenuation/meta-health metric surface.                              |
| `tools/validate-governance-chain.ts`        | axiom/constitution/gate validation                                                    | Existing policy-chain validator.                                              |
| `governance/tags/tools/*`                   | extract, validate, composability, drift                                               | Existing G11-style code-to-spec tooling.                                      |

## Evidence Finding

The repository already has a strong script surface. The missing first unit is not a new detector; it is making these scripts source-layout aware and giving operators one consolidated attenuation audit entrypoint.

## Receipt

```json
{
  "dispatch_id": "20260615T043712Z-governance-attenuation-scriptability",
  "step_id": "s01-context-builder",
  "capability_ref": "context-builder",
  "status": "pass",
  "artifacts": ["stages/S01-CONTEXT-BUILDER.md"],
  "validation": ["selected evidence covers all five obligations"],
  "observer_status": "not_applicable",
  "blockers": [],
  "residue": [
    "legacy signal ledger shape remains invalid under current validator"
  ],
  "handoff_note": "Proceed to define scriptability goal."
}
```
