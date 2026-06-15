# S02 Invoke Define

Status: `pass`  
Capability: `invoke`  
Mode: `define`

## Definition

Governance attenuation is currently a partially solved tooling problem:

- prose analysis correctly identifies instruction dilution and observer-executor conflation,
- scripts already exist for detectors, observers, validation, pruning, and meta-health,
- several scripts assume they are run from an installed `domainspec/` bundle rather than this source checkout,
- the current signal ledger is legacy-shaped and fails strict validation.

## Defined Goal

Create a source-layout-safe governance attenuation audit surface:

1. Add a shared DomainSpec path resolver for source checkout and installed bundle layouts.
2. Use it in the governance attenuation scripts whose defaults currently miss source files.
3. Add a consolidated `governance:attenuation:audit` script that runs the core chain checks and reports pass/block status.
4. Harden analyzers against legacy signal records so audit reports block with evidence instead of crashing.
5. Validate from the parent checkout and from the DomainSpec package script.

## Non-Goals

- Do not migrate or rewrite the existing signal ledger in this unit.
- Do not wire CI/pre-commit gates yet.
- Do not delete or collapse governance rules yet.
- Do not change canonical policy semantics.

## Receipt

```json
{
  "dispatch_id": "20260615T043712Z-governance-attenuation-scriptability",
  "step_id": "s02-invoke-define",
  "capability_ref": "invoke",
  "status": "pass",
  "artifacts": ["stages/S02-INVOKE-DEFINE.md"],
  "validation": ["goal has explicit scope, non-goals, and validation surface"],
  "observer_status": "not_applicable",
  "blockers": [],
  "residue": [],
  "handoff_note": "Proceed to critique unsafe substitutions."
}
```
