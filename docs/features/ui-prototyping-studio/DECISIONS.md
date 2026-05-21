# Decisions: UI Prototyping Studio

## Locked MVP Decisions D-001 D-009

| Decision ID | Status | Selected Option                                                                                                                                              | Rationale                                                                                            | Downstream Implication                                                                                      |
| ----------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| D-001       | locked | Use `shadcn/ui` + `Radix` + `Tailwind` for studio surfaces only.                                                                                             | Fast reusable primitives with bounded adoption scope.                                                | Studio UI and component registry map to shadcn-first primitives; unrelated surfaces remain unchanged.       |
| D-002       | locked | MVP runtime output remains HTML-first; React-island output is deferred.                                                                                      | Keeps generation deterministic and contract-first.                                                   | Variant artifacts and revision patches are HTML-first and auditable.                                        |
| D-003       | locked | Canonical comment schema is `{ target, severity, intent, note }` with severity enum `blocker/high/medium/low`.                                               | Stable schema enables deterministic synthesis and traceability.                                      | Annotation capture and synthesis validate one payload contract.                                             |
| D-004       | locked | Auto-task generation is draft-only until explicit human confirmation.                                                                                        | Preserves useful automation without bypassing governance.                                            | Draft mutation batches require explicit approval before apply.                                              |
| D-005       | locked | Governance is manual: baseline selection gate (`variantCount > 1`) and explicit apply approval; auto-apply forbidden.                                        | Protects deterministic decision points and auditability.                                             | Loop blocks apply progression until both gates are satisfied.                                               |
| D-006       | locked | `variantCount` is bounded to `1..3`, default `3`; `variantCount = 1` is committed baseline mode. Session resets to default `3` unless explicitly overridden. | Preserves bounded exploration and deterministic single-path semantics.                               | Session and manifest persist variant provenance and committed/selected mode.                                |
| D-007       | locked | Newspaper integration is adapter compatibility only; not a runtime dependency.                                                                               | Reuse contract shape without coupling runtime modules.                                               | Internal adapter maps payloads while runtime dependency graph remains DomainSpec-local.                     |
| D-008       | locked | Model prototype iteration as Evolution Engine lineage: population, fitness evidence, selection, mutation, lineage, and environment.                          | Makes the product's evolutionary engine explicit and traceable.                                      | Spec/aspect docs must preserve genome, fitness signal, evolution cycle, and lineage concepts.               |
| D-009       | locked | Self-improvement and generation-rule promotion are proof-gated and deferred in MVP runtime.                                                                  | Prevents the system from changing its own generation rules without evidence and governance approval. | Generation-rule promotion requires proof pass, non-auto actor, and future implementation-layering evidence. |

## Open Decisions

These decisions are open for post-MVP planning and are not blockers for current MVP scope.

| Decision ID | Status | Question                                                                    | Options Under Consideration                                                        | Trigger to Resolve                                                     |
| ----------- | ------ | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| O-001       | open   | Should pre-generation brief normalization be mandatory in the default flow? | Keep optional lane; make mandatory; conditional by feature archetype               | First cycle where prompt ambiguity repeatedly causes rework            |
| O-002       | open   | Should live-data prototype mode be introduced after MVP?                    | No live mode; opt-in live mode; live mode with strict sandbox                      | First roadmap increment that requires data-backed prototype validation |
| O-003       | open   | Should multi-cycle autonomous execution be permitted beyond manual gates?   | Keep manual only; supervised autonomy; bounded autonomous batches                  | Governance review after MVP readiness gate                             |
| O-004       | open   | What fitness scoring model should later phases use?                         | Qualitative only; weighted vector; multi-objective Pareto ranking                  | First roadmap increment that consumes fitness signals for generation   |
| O-005       | open   | Which generation-rule types may be promoted post-MVP?                       | Prompt templates only; critique rubrics; mutation strategies; all with proof gates | First approved self-improvement pilot                                  |

## Decision Review Triggers

- Introduce any output format beyond HTML-first artifacts.
- Expand `variantCount` beyond `1..3`.
- Relax or remove manual approval gates.
- Add direct runtime imports from newspaper modules.
- Add autonomous apply behavior.
- Promote generation rules, prompt templates, critique rubrics, or mutation strategies.
- Change fitness scoring from qualitative records to weighted automated ranking.
