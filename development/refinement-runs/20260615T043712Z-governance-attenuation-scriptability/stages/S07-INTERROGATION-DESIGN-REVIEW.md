# S07 Interrogation Design Review

Status: `pass`  
Capability: `interrogation`  
Mode: `refine-design-review`

## Review Question

Does the proposed design create a real script-backed improvement while preserving governance boundaries?

## Verdict

Pass, with one required repair: analyzer and pruning scripts must tolerate legacy signal records and report the schema gap instead of crashing.

## Findings

| Finding                                                                     | Severity | Resolution                                       |
| --------------------------------------------------------------------------- | -------- | ------------------------------------------------ |
| Path resolver is appropriate and low-risk.                                  | low      | Proceed.                                         |
| Audit wrapper is report-only and does not hide failed gates.                | low      | Proceed.                                         |
| `analyze-signals.ts` can crash on legacy records with missing `data`.       | medium   | Harden parser to default missing `data` to `{}`. |
| `prune-governance.ts` can crash on legacy records with missing `data`.      | medium   | Harden reader and rule matching.                 |
| `run-fast-observer.ts` validates output even when detection writes no file. | medium   | Treat no-signal as clean no-op.                  |

## Receipt

```json
{
  "dispatch_id": "20260615T043712Z-governance-attenuation-scriptability",
  "step_id": "s07-interrogation-design-review",
  "capability_ref": "interrogation",
  "status": "pass",
  "artifacts": ["stages/S07-INTERROGATION-DESIGN-REVIEW.md"],
  "validation": ["repair findings were incorporated into execution scope"],
  "observer_status": "not_applicable",
  "blockers": [],
  "residue": [],
  "handoff_note": "Proceed to repair/probe."
}
```
