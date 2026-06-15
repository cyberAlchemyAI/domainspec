# S05 Distill Scriptability

Status: `pass`  
Capability: `distill`  
Mode: `standard`

## Scriptability Buckets

### Script Now

- Governance chain validation.
- Signal envelope validation.
- Signal threshold analysis.
- Deterministic artifact-level signal detection.
- Fast observer wrapper.
- Telemetry bundle generation.
- Async behavior observer.
- Governance prune report generation.
- Meta-health report generation.
- Code-tag extraction, validation, composability, and drift.
- Markdown/frontmatter link validation.

### Script Next

- Source-vs-installed path resolver.
- Consolidated governance attenuation audit wrapper.
- Legacy signal ledger migration or compatibility tool.
- Stronger `shouldHaveBeenCaughtBy` to constitution-rule mapping.
- CI/pre-commit wiring.

### Observer Only

- Fail/fix/retest chronology when no durable telemetry exists.
- Unrequested test hardening classification when prompt scope is missing.
- Ambiguous behavior-level scope drift.

### Policy Only

- Removing zero-evidence rules.
- Catastrophic-risk exception decisions.
- Constitution/axiom semantic changes.
- Approval to turn report-only audit into blocking CI.

## Selected Smallest Coherent Unit

`SWU-GAS-001`: Add source-layout-safe path resolution and a consolidated governance attenuation audit command.

This unit is small enough to execute now and large enough to recompose into the wider attenuation program. It unlocks later units by making the existing script surface runnable from the current checkout.

## Receipt

```json
{
  "dispatch_id": "20260615T043712Z-governance-attenuation-scriptability",
  "step_id": "s05-distill-scriptability",
  "capability_ref": "distill",
  "status": "pass",
  "artifacts": ["stages/S05-DISTILL-SCRIPTABILITY.md"],
  "validation": ["selected SWU-GAS-001 as smallest coherent unit"],
  "observer_status": "not_applicable",
  "blockers": [],
  "residue": ["ledger migration and CI wiring remain later units"],
  "handoff_note": "Proceed to design SWU-GAS-001."
}
```
