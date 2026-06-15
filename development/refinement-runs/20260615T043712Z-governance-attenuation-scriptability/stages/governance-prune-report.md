# Governance Prune Report

Generated at: 2026-06-15T04:47:30.022Z
Window: last 10 session(s)
Sampled sessions: 1
Sampled signals: 9

## Rule Evidence Counts

| Rule | Evidence Count | Statement                                                                                                                                                             |
| ---- | -------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1   |              0 | DomainSpec artifacts are semantic source of truth. Changes to governance behavior must be implemented in domainspec first and then mirrored to integration harnesses. |
| C2   |              0 | Domain policy, rules, and transitions cannot be authored in infrastructure adapters.                                                                                  |
| C3   |              0 | Signal emissions must conform to a single canonical schema and session completeness invariants.                                                                       |
| C4   |              0 | Observer and executor responsibilities must be split using dual-phase observation (blocking fast observer plus async deep observer).                                  |
| C5   |              0 | Critical and high governance violations block merge immediately.                                                                                                      |
| C6   |              0 | Domain behavior implemented in code must bind to documented concepts via explicit anchors (`@biz`/`@sys`).                                                            |
| C7   |              0 | For existing implementation surfaces, alignment and layering audits are mandatory and parallelized.                                                                   |
| C8   |              0 | Artifact-level governance signals are computed deterministically from code, docs, and diffs.                                                                          |
| C9   |              0 | Behavior-level governance signals derive from full-trace telemetry bundles.                                                                                           |
| C10  |              0 | Governance rules are pruned by evidence every 10/20 runs following Via Negativa.                                                                                      |
| C11  |              0 | Governance health is tracked using metrics (M-001..M-006) and reflected in the outer loop.                                                                            |

## Candidate Rules For Review

| Rule | Why Candidate                                                                    |
| ---- | -------------------------------------------------------------------------------- |
| C1   | Zero evidence over last 10 sessions. Review before 20-session removal threshold. |
| C2   | Zero evidence over last 10 sessions. Review before 20-session removal threshold. |
| C3   | Zero evidence over last 10 sessions. Review before 20-session removal threshold. |
| C4   | Zero evidence over last 10 sessions. Review before 20-session removal threshold. |
| C5   | Zero evidence over last 10 sessions. Review before 20-session removal threshold. |
| C6   | Zero evidence over last 10 sessions. Review before 20-session removal threshold. |
| C7   | Zero evidence over last 10 sessions. Review before 20-session removal threshold. |
| C8   | Zero evidence over last 10 sessions. Review before 20-session removal threshold. |
| C9   | Zero evidence over last 10 sessions. Review before 20-session removal threshold. |
| C10  | Zero evidence over last 10 sessions. Review before 20-session removal threshold. |
| C11  | Zero evidence over last 10 sessions. Review before 20-session removal threshold. |

## Policy

1. After 10 sessions with zero evidence, mark rule as review candidate.
2. After 20 sessions with zero evidence, remove unless catastrophic-risk guard applies.
3. Any removal requires explicit architecture approval.
