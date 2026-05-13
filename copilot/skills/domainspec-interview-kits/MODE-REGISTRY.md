# DomainSpec Interview Mode Registry

This registry controls which interview mode the interviewer can pick and how each mode forms questions.

## Registry Table

| Mode ID                     | Intent                                                             | Applicability Signals                                         | Question Formation Strategy                                                            | Robot-Talks Compatibility | Default Patch Targets                      | Exit Criteria                       |
| --------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------ | ----------------------------------- |
| grill-with-docs             | Pressure-test a plan/spec with one-question interrogation          | Ambiguity in contracts, terminology drift, ordering decisions | Generate discriminating decision questions from contract mismatches and edge scenarios | native                    | feature spec + work-pack context           | all blocker decisions explicit      |
| readiness-gate              | Close readiness uncertainty before verify/release                  | Pending verify gates, unresolved readiness profile choices    | Generate gate-closure questions tied to pass/fail rules                                | optional                  | WORK-PACK + VERIFY artifacts               | readiness verdict computable        |
| audit-gap                   | Expose drift between intended and documented/implemented behavior  | Alignment/layering inconsistencies, stale assumptions         | Generate contradiction questions from cross-artifact comparisons                       | optional                  | SPEC/rules/workflows + audit notes         | no unclassified high-severity gaps  |
| robot-talks-grill-synthesis | Improve question quality using multi-perspective tension discovery | Cross-layer concerns, conflicting narratives, hard trade-offs | Run perspective tensions first, then ask one highest-value grill question              | required                  | mode-specific targets + decision snapshots | no unresolved high-tension blockers |

## Auto-Selection Heuristic

1. If explicit contradictions across docs are observed -> `audit-gap`.
2. If main goal is spec hardening before execution -> `grill-with-docs`.
3. If verify/release gate is primary -> `readiness-gate`.
4. If domain is cross-layer with competing narratives -> `robot-talks-grill-synthesis`.

## Mode Addition Rules

- Add a mode file under `MODES/`.
- Add one row in this registry.
- Mode file must define question card fields and stop rules.
- Existing modes remain backward compatible.
