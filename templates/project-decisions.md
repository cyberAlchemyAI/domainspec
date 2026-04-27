# Project Decisions

## Purpose

Capture project-level decisions that must be resolved before feature-level planning and pipeline execution.

## Decision Register

| ID | Decision | Options Considered | Selected Option | Status | Scope | Rationale | Source | Date |
|---|---|---|---|---|---|---|---|---|
| PD-001 | {decision title} | {option A; option B} | {selected option} | selected / blocked / deferred | project | {reasoning} | interview / chat / workshop | YYYY-MM-DD |

## Required Startpoint Decisions

| Key | Decision Prompt | Example Resolution | Status |
|---|---|---|---|
| scope-boundary | What is in scope and explicitly out of scope for the first rollout? | In: player onboarding, settlements. Out: loyalty rewards. | selected / blocked / deferred |
| initial-delivery-slice | What is the smallest valuable delivery slice? | Coach onboarding plus settlement preview only. | selected / blocked / deferred |
| source-of-truth-policy | In brownfield, which source is authoritative when docs and code diverge? | Code is as-is authority; docs are updated to match before refactors. | selected / blocked / deferred |
| migration-strictness | How strict should migration from current state to DomainSpec be in this cycle? | Strict for finance rules, tolerant for naming cleanup. | selected / blocked / deferred |
| verification-baseline-command | What command set defines minimum verification before feature progression? | npm test && npm run lint && npm run typecheck | selected / blocked / deferred |

## Blockers

| ID | Blocking Decision | Why Blocked | Owner | Next Action | Target Date |
|---|---|---|---|---|---|
| B-001 | {decision title} | {missing information or unresolved trade-off} | {owner} | {specific follow-up} | YYYY-MM-DD |

## Notes

- Use `status: blocked` for decisions that prevent startpoint or pipeline progression.
- Convert blocked decisions to selected as soon as evidence is available.
- Keep rationale concise and evidence-linked when possible.

## Change Log

| Date | Change | Author |
|---|---|---|
| YYYY-MM-DD | Initial project decisions created | {name} |
