# Refine Result

Run ID: `20260615T043712Z-governance-attenuation-scriptability`  
Target: `implementation/domainspec/GOVERNANCE-ATTENUATION.md`  
Status: `flag`  
Preset: `standard`  
Research: `no-research`  
Dispatch validation: `pass`  
Executed goal: `SWU-GAS-001`

## Final Synthesis

The attenuation document was applied and converted into a scriptability map. The first produced execution goal was completed: DomainSpec governance tools now have a shared path resolver and a consolidated governance attenuation audit command.

## What Can Use Scripts Now

- Governance chain validation.
- Signal envelope validation.
- Signal threshold analysis.
- Deterministic artifact-level signal detection.
- Fast observer.
- Telemetry bundle generation.
- Async behavior observer.
- Governance pruning report.
- Meta-health report.
- Code-tag extraction, validation, composability, and drift.
- Markdown/frontmatter link validation.

## What Was Executed

`SWU-GAS-001`: source-layout-safe path resolution and consolidated audit.

Implemented:

- `tools/lib/domainspec-paths.ts`
- `tools/governance-attenuation-audit.ts`
- `package.json` script `governance:attenuation:audit`
- source-layout-safe defaults in governance signal/observer/health/pruning scripts
- legacy-record hardening in `analyze-signals.ts` and `prune-governance.ts`
- no-signal success path in `run-fast-observer.ts`

## Validation Result

The produced task passed. The final refine status is `flag` because the new audit command correctly blocks on the existing legacy signal ledger:

`implementation/domainspec/docs/signals/pipeline-signals.jsonl`

That ledger currently fails the strict signal envelope required before signals can safely drive pruning, reflection, or CI gates.

## Recommended Next Routes

1. `SWU-GAS-002`: migrate or compatibility-wrap legacy signal records.
2. `SWU-GAS-003`: wire `governance:attenuation:audit` into CI/pre-commit after ledger validation is clean.
3. `SWU-GAS-004`: replace pruning keyword matching with explicit constitution rule IDs.
