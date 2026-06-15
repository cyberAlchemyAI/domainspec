# Run Manifest

Run ID: `20260615T043712Z-governance-attenuation-scriptability`  
Target: `implementation/domainspec/GOVERNANCE-ATTENUATION.md`  
Status: `flag`  
Preset: `standard`  
Research: `no-research`  
Executed goal: `SWU-GAS-001`

## Required Artifacts

| Artifact                     | Owner                  | Status      |
| ---------------------------- | ---------------------- | ----------- |
| `RUN-MANIFEST.md`            | refine                 | present     |
| `evidence-index.json`        | refine                 | present     |
| `REFINE-SEED-PROPOSAL.md`    | refine                 | present     |
| `REFINE-DISPATCH.json`       | refine / dispatch-spec | validated   |
| `RUNTIME-HANDOFF.md`         | refine                 | executed    |
| `RESULT.md`                  | refine                 | flag        |
| `IMPLEMENTATION-LAYERING.md` | invoke                 | present     |
| `WORK-PACK.md`               | invoke                 | executed-l0 |
| `TASK-SESSION-REPORT.md`     | task-session           | pass        |
| `stages/`                    | stage owners           | present     |

## Stage Evidence

| Step | Stage                                     | Owner                  | Status | Artifact                                      |
| ---- | ----------------------------------------- | ---------------------- | ------ | --------------------------------------------- |
| 1    | Context Builder evidence baseline         | context-builder        | pass   | `stages/S01-CONTEXT-BUILDER.md`               |
| 2    | Invoke Define                             | invoke                 | pass   | `stages/S02-INVOKE-DEFINE.md`                 |
| 3    | Interrogation refine-review               | interrogation          | pass   | `stages/S03-INTERROGATION-REFINE-REVIEW.md`   |
| 4    | Research decision                         | refine                 | pass   | `stages/S04-RESEARCH-DECISION.md`             |
| 5    | Distill scriptability buckets             | distill                | pass   | `stages/S05-DISTILL-SCRIPTABILITY.md`         |
| 6    | Invoke Redefine / Design                  | invoke                 | pass   | `stages/S06-INVOKE-DESIGN.md`                 |
| 7    | Interrogation refine-design-review        | interrogation          | pass   | `stages/S07-INTERROGATION-DESIGN-REVIEW.md`   |
| 8    | Distill Repair with low-cost script probe | distill                | pass   | `stages/S08-DISTILL-REPAIR-PROBE.md`          |
| 9    | Invoke Plan                               | invoke                 | pass   | `stages/S09-INVOKE-PLAN.md`                   |
| 10   | Final Interrogation and Synthesis         | interrogation + refine | flag   | `stages/S10-FINAL-INTERROGATION-SYNTHESIS.md` |

## Execution Evidence

- `SWU-GAS-001` executed; see `TASK-SESSION-REPORT.md`.
- `governance:attenuation:audit` now writes `stages/governance-attenuation-audit.md`.
- Audit exits nonzero because the existing signal ledger fails strict envelope validation; this is the intended block surfaced by the new script surface.

## Current Evidence Notes

- Existing scripts now resolve DomainSpec paths from this source checkout instead of assuming only an installed `domainspec/` layout.
- The fast observer has a clean no-signal path.
- Analyzers and pruning tolerate legacy signal records without crashing.
- Remaining residue is `SWU-GAS-002`: migrate or compatibility-wrap `docs/signals/pipeline-signals.jsonl`.

## Next Route

Execute `SWU-GAS-002` before wiring the audit into CI/pre-commit.
