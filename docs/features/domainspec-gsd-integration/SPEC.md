# DomainSpec-GSD Integration

## Overview

This feature defines how DomainSpec and GSD operate together in one delivery workflow.

DomainSpec remains the semantic authority: concepts, rules, states, interfaces, mappings, and acceptance criteria are defined in DomainSpec artifacts. GSD is used as orchestration authority: phase planning, execution flow, checkpointing, and phase verification evidence.

The objective is to combine DomainSpec correctness with GSD execution rigor, without creating dual sources of truth.

## Concepts

| Concept                                                               | ID                                                    | Type      | Description                                                                   |
| --------------------------------------------------------------------- | ----------------------------------------------------- | --------- | ----------------------------------------------------------------------------- |
| [DelegationMode](domain.md#delegationmode)                            | domainspec-gsd-integration.DelegationMode             | Enum      | Execution mode selector for native or delegated orchestration                 |
| [PlanPhaseBridge](operations.md#planphasebridge)                      | domainspec-gsd-integration.PlanPhaseBridge            | Operation | Converts DomainSpec feature context into GSD phase planning inputs            |
| [ExecutePhaseBridge](operations.md#executephasebridge)                | domainspec-gsd-integration.ExecutePhaseBridge         | Operation | Runs delegated GSD execution and maps outputs back to DomainSpec traceability |
| [VerifyPhaseBridge](operations.md#verifyphasebridge)                  | domainspec-gsd-integration.VerifyPhaseBridge          | Operation | Normalizes GSD verification evidence for DomainSpec PASS/FLAG/BLOCK decisions |
| [FeatureToPhaseMapping](mappings.md#featuretophasemapping)            | domainspec-gsd-integration.FeatureToPhaseMapping      | Mapping   | Mapping strategy from feature docs to phase identifiers and plan files        |
| [DelegatedExecutionWorkflow](workflows.md#delegatedexecutionworkflow) | domainspec-gsd-integration.DelegatedExecutionWorkflow | Workflow  | End-to-end delegated path across planning, execution, and verification        |
| [AuthorityPolicy](workflows.md#authoritypolicy)                       | domainspec-gsd-integration.AuthorityPolicy            | Policy    | Resolves conflicts between orchestration outputs and semantic docs            |

## Aspects

- [Domain](domain.md) — Core integration definitions and invariants
- [Operations](operations.md) — Bridge operation contracts
- [Mappings](mappings.md) — Feature/phase and evidence mapping rules
- [Workflows](workflows.md) — Delegated orchestration lifecycle and policy
- [Tasks](tasks.en.md) — Ordered rollout tasks
- [Decisions](decisions.en.md) — Confirmed and open design decisions

## Cross-Feature Dependencies

| Depends On         | Relationship | Why                                                        |
| ------------------ | ------------ | ---------------------------------------------------------- |
| payment-processing | validates    | Uses a real feature slice to validate integration behavior |

## Produces For

| Consumer               | Via       | What                                          |
| ---------------------- | --------- | --------------------------------------------- |
| domainspec-planner     | Operation | Delegated planning orchestration contract     |
| domainspec-implementer | Operation | Delegated execution contract                  |
| domainspec-verifier    | Operation | Delegated verification evidence normalization |
