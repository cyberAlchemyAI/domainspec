# Stage Receipt — Intent-Bug Proponent (Design / thesis, bounded research)

- agentId ae3a4b9b0d4778514 · verdict: **pass** · external pass.

## Empirical backing (fact vs inference flagged)

| Claim                                                                                                    | Source                         | Strength                                   |
| -------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------------------------------------ |
| AI code ~30% defective base rate (43 CWE); ~40% in earlier study                                         | arxiv 2310.02059; ACM TOSEM    | Strong                                     |
| AI-introduced findings 10x growth (>10k/mo, Jun 2025)                                                    | CSA research note              | Moderate                                   |
| Devs using AI write less secure code + **false sense of security**                                       | Perry et al. (via summary)     | Moderate–Strong                            |
| "Incorrect Output" is a primary LLM failure class; ~60% garbage above 150-word prompts/12-line solutions | arxiv 2406.08731               | Strong for existence, weak for exact ratio |
| TDD/spec-first cuts defect density **40–90%** (IBM, MS), no significant productivity loss                | IEEE 1251029; arxiv 1711.05082 | Strong (closest analog to spec→test)       |
| Functional/semantic contracts catch **semantic** errors                                                  | arxiv 2510.12702; OOPSLA'25    | Moderate (figures unverified)              |
| Requirements ambiguity = up to 85% rework cost; 100x to fix late                                         | ScienceDirect; Jama            | Moderate                                   |

## Mechanism (per cluster)

- **Intent capture (interrogation/decision-gate/definitions):** operationalizes the ambiguity-cost evidence — pin intent before code so the reviewer never reverse-engineers "what did we mean?" from a diff.
- **Spec→test + alignment audit:** the intent-as-oracle engine. Tests derived from the **spec** (intent), not the implementation → code that does the wrong thing fails a test that encodes the right thing **before** a human reads the diff. Direct analog to TDD 40–90%.
- **Code-tag traceability:** routes attention to contested-concept lines and **orphans** (unrequested behavior = classic intent bug); traced+covered lines are pre-vouched.
- **Craft ledger:** recomposition proof + residue-as-first-class catches the _compositional_ intent bug that grows with complexity; the gap is never silently discarded.

## Commercialization argument

1. Attacks an acute, growing, measurable pain (10x AI defects + miscalibrated reviewers) — low adoption friction.
2. Value felt at first use, by one engineer, for free → bottoms-up wedge.
3. **The decisions ARE the moat:** every forced decision-record, pinned definition, alignment verdict, and recomposition proof is already a persisted structured governance artifact → the free wedge **generates the audit trail as a byproduct**; the paid tier attests/signs/aggregates over it.

## Single strongest point

**Spec→test derivation converts "compiles but wrong" into a machine-checkable contradiction before review** — strongest empirical backing (TDD 40–90%) applied to the documented AI failure mode (incorrect output).
**Honest weak seams:** checklist-review evidence is mixed; formal-verification figures unverified — case rests on spec→test + base-rate + ambiguity-cost, not those.
