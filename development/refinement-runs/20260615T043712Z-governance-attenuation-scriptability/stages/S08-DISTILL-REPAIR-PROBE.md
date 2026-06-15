# S08 Distill Repair Probe

Status: `pass`  
Capability: `distill`  
Mode: `validate`

## Probe Results

| Probe                                                                      | Result            | Interpretation                                                               |
| -------------------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------- |
| `validate-governance-chain.ts --json` from parent checkout                 | pass              | Path resolver finds `AXIOMS.md` and `CONSTITUTION.md`.                       |
| `analyze-signals.ts --json --min 1` from parent checkout                   | pass              | Analyzer now handles legacy records without crashing.                        |
| `detect-signals.ts --feature cross-feature --dry-run` from parent checkout | pass              | Detector runs with source-layout-aware defaults.                             |
| `build-telemetry-bundle.ts` with run-folder output                         | pass              | Telemetry output resolves to run evidence path.                              |
| `run-fast-observer.ts` with run-folder output                              | pass              | No detected signals becomes clean no-op.                                     |
| `run-async-observer.ts` over generated bundle                              | pass              | No behavior signal becomes clean no-op.                                      |
| `prune-governance.ts` with run-folder output                               | pass              | Prune report handles legacy records.                                         |
| `generate-meta-health.ts` with run-folder output                           | pass              | Meta-health report writes to run evidence.                                   |
| `governance:attenuation:audit` with run-folder output                      | block with report | Command works; signal ledger validation correctly blocks on legacy envelope. |

## Repair Conclusion

The implementation is valid for the produced L0 goal. Remaining blocker is not runner failure; it is the current signal ledger's schema incompatibility, which is correctly surfaced by the new audit report.

## Receipt

```json
{
  "dispatch_id": "20260615T043712Z-governance-attenuation-scriptability",
  "step_id": "s08-distill-repair-probe",
  "capability_ref": "distill",
  "status": "pass",
  "artifacts": [
    "stages/S08-DISTILL-REPAIR-PROBE.md",
    "stages/governance-attenuation-audit.md",
    "stages/governance-prune-report.md",
    "stages/meta-health-report.md",
    "stages/gas-test-telemetry.json"
  ],
  "validation": [
    "all runner probes either pass or block with intended audit evidence"
  ],
  "observer_status": "not_applicable",
  "blockers": [],
  "residue": ["signal-ledger-envelope remains block"],
  "handoff_note": "Proceed to non-executed plan and task-session record."
}
```
