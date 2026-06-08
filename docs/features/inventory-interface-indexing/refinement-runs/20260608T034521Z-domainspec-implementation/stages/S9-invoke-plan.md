---
stage: S9-invoke-plan
capability: invoke
mode: plan
status: pass
updatedAt: 2026-06-08
---

# S9 Invoke Plan

## Plan Objective

Create a DomainSpec-local Inventory interface/indexing feature pack and then
execute the Inventory MVP against a confirmed DomainSpec implementation target.

## Delivery Slices

| Slice | Outcome | Depends On | Validation |
| --- | --- | --- | --- |
| DS-INV-S0 | Feature pack baseline exists. | refine result | files present and linked |
| DS-INV-S1 | DomainSpec-local Inventory interface contract maps to Arcanum Inventory contract. | S0 | grep/review for auto, target inference, confirmation, status, explain |
| DS-INV-S2 | Target proposal and chat-view templates adapt to DomainSpec source authority. | S1 | template presence and review |
| DS-INV-S3 | JSON index templates adapt to DomainSpec source selectors and feature packs. | S1 | `jq empty` examples |
| DS-INV-S4 | Validator covers link/index discipline plus DomainSpec authority rules. | S2-S3 | validator pass/fail fixtures |
| DS-INV-S5 | First confirmed DomainSpec pilot slice exists. | S4 and pilot target confirmation | cards/index/retrieval/coverage pass |
| DS-INV-S6 | Readiness and next-route handoff synced. | S5 | readiness review |

## Task Board

| Task | Goal | Status |
| --- | --- | --- |
| TASK-DS-INV-001 | Create feature pack baseline: `SPEC.md`, `ARCHITECTURE.md`, `IMPLEMENTATION-PLAN.md`, `WORK-PACK.md`. | ready |
| TASK-DS-INV-002 | Normalize/check DomainSpec-local Inventory runtime/capability surface. | ready-after-001 |
| TASK-DS-INV-003 | Adapt `$inventory` interface contract to DomainSpec target rules. | ready-after-001 |
| TASK-DS-INV-004 | Add DomainSpec target proposal and chat-view templates. | blocked-by-003 |
| TASK-DS-INV-005 | Add DomainSpec-aware index/link templates. | blocked-by-003 |
| TASK-DS-INV-006 | Extend validator for DomainSpec authority and link/index discipline. | blocked-by-005 |
| TASK-DS-INV-007 | Confirm and create first DomainSpec pilot slice. | blocked-by-006-and-target-confirmation |
| TASK-DS-INV-008 | Sync readiness, docs, and Task Session handoff. | blocked-by-007 |

## Recommended First Pilot Target

```text
implementation/domainspec/docs/features/domainspec-arcanum-superset/
```

Use it only after templates and validators exist. It is the recommended pilot
corpus, not an immediate mutation target.

## Validation Strategy

| Check | Method |
| --- | --- |
| Dispatch route | `python3 formulae/dispatch-spec/scripts/validate-dispatch.py REFINE-DISPATCH.json` |
| JSON examples | `jq empty` |
| Source selectors | validator checks paths and selector shape |
| Link discipline | validator checks controlled edge vocabulary and non-authority notices |
| DomainSpec authority | validator/manual review checks generated records do not claim canonical definitions or relationships |
| Runtime surface | `tools/arcanum --resolve` plus native skill availability record |

## Non-Goals

- no broad DomainSpec inventory sweep,
- no mutation inside Arcanum Inventory during DomainSpec planning,
- no automatic promotion into DomainSpec definitions, taxonomy, or relationships,
- no browser UI before chat/status/lookup behavior works.

## Next Route

Use `task-session` for `TASK-DS-INV-001`.

