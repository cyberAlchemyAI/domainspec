# Project Decisions

## Purpose

Capture feature-scoped discovery decisions required before spec-phase mutation for Agent Execution Orchestrator.

## Decision Register

| ID     | Decision                                                     | Options Considered                                                                                          | Selected Option                                                                                                               | Status   | Scope                                 | Rationale                                                                                                        | Source                    | Date       |
| ------ | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------- | ---------- |
| PD-001 | Scope boundary for interview slice                           | Docs + implementation in one stage; docs-only baseline first                                                | Docs-only interview baseline in this stage                                                                                    | selected | feature: agent-execution-orchestrator | Request explicitly requires interview artifacts without implementation/tag-code/alignment/layering execution     | interview request         | 2026-05-08 |
| PD-002 | Brownfield source of truth policy                            | Docs as authority; code as authority; mixed policy                                                          | Existing repo policies and current behavior contracts are observed authority for discovery; Sandcastle is reference semantics | selected | feature: agent-execution-orchestrator | Brownfield evidence exists in current skills/docs while external reference informs target behavior               | interview synthesis       | 2026-05-08 |
| PD-003 | Feature-path artifact location under planner gate constraint | Write directly to `docs/features/agent-execution-orchestrator/`; fallback under `docs/` with explicit scope | Fallback under `docs/interviews/agent-execution-orchestrator/` for this stage                                                 | selected | feature: agent-execution-orchestrator | Planner preflight gate artifact is missing for feature-path mutation, so deterministic fallback path is required | observed + process policy | 2026-05-08 |
| PD-004 | Spec-phase unblock command                                   | Run `domainspec-spec-feature` immediately; run planner preflight first                                      | Run planner preflight first using `domainspec-plan-phase-bridge agent-execution-orchestrator --mode native`                   | selected | feature: agent-execution-orchestrator | Planner gate must be PASS before mutating feature-path artifacts                                                 | observed policy           | 2026-05-08 |
| PD-005 | Initial execution reference model                            | Invent net-new orchestration semantics; use Sandcastle reference semantics                                  | Use Sandcastle semantics as reference for sandbox, worktree, branch strategy, hooks, and run lifecycle contracts              | selected | feature: agent-execution-orchestrator | User intent explicitly selects Sandcastle as orchestration reference                                             | interview request         | 2026-05-08 |

## Required Startpoint Decisions

| Key                           | Decision Prompt                                                                | Example Resolution                                                                                                                                                     | Status   |
| ----------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| scope-boundary                | What is in scope and explicitly out of scope for the first rollout?            | In: run lifecycle model, sandbox/worktree strategy contracts, retry/cancel/observability contracts. Out: business-feature implementations driven by orchestrated runs. | selected |
| initial-delivery-slice        | What is the smallest valuable delivery slice?                                  | Deterministic orchestration baseline with one provider adapter contract and explicit terminal outcomes.                                                                | selected |
| source-of-truth-policy        | In brownfield, which source is authoritative when docs and code diverge?       | Current repo policy docs and skills are authoritative for discovery baseline; unresolved divergence is captured as blockers.                                           | selected |
| migration-strictness          | How strict should migration from current state to DomainSpec be in this cycle? | Strict for lifecycle contracts and governance gates; tolerant for naming refinements before spec lock.                                                                 | selected |
| verification-baseline-command | What command set defines minimum verification before feature progression?      | `./tools/check_github_drift.sh` and `./tools/check_markdown_links.sh` before spec mutation handoff.                                                                    | selected |

## Blockers

| ID    | Blocking Decision                                                    | Why Blocked                                                                                                                            | Owner         | Next Action                                                                                                                      | Target Date |
| ----- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| B-001 | Planner gate PASS for feature-path mutation                          | `docs/features/agent-execution-orchestrator/WORK-PACK.md` is missing, so feature-path mutation is not permitted by plan-first contract | feature owner | Run `domainspec-plan-phase-bridge agent-execution-orchestrator --mode native` to seed/refresh planner gate artifact and set PASS | 2026-05-08  |
| B-002 | Default branch strategy lock (`head` vs `merge-to-head` vs `branch`) | No validated default for this repository execution profile yet                                                                         | feature owner | Execute branch strategy experiment candidate EX-3 and lock decision from evidence                                                | 2026-05-09  |
| B-003 | MVP provider adapter baseline                                        | Provider-agnostic requirement is clear but required first provider set is not locked                                                   | feature owner | Decide mandatory MVP provider adapter set during spec phase entry                                                                | 2026-05-09  |

## Notes

- This file records discovery-stage decisions only.
- Feature-path mutation remains blocked until planner preflight gate is PASS.
- Current interview artifacts are intentionally written under `docs/interviews/agent-execution-orchestrator/` as deterministic fallback.

## Change Log

| Date       | Change                                                                   | Author  |
| ---------- | ------------------------------------------------------------------------ | ------- |
| 2026-05-08 | Created feature-scoped interview decision baseline and blocker register. | Copilot |
