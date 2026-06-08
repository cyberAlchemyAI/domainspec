# Stage Receipt — Free-Tool Cartographer (Distill / pipeline map)

- agentId a475db0aa9aa4833d · verdict: **pass** · local repo reading.

## Pipeline: intent → definition → spec → derived tests → code → review

Left tools **relocate** review upstream of code; right tools **refocus** post-code review onto structured spec↔code fidelity; Craft wraps the loop and makes residue first-class.

| Tool                                  | Intent-bug class                                | Intervention point               | Eliminate / Refocus / Relocate              | Evidence handed to reviewer                                                                           |
| ------------------------------------- | ----------------------------------------------- | -------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| interrogation                         | ambiguous requirement; unstated assumption      | intent capture (pre-spec)        | **Relocate**                                | decision trail: chosen option, rejected alternatives, rationale; per-Q "why it matters"               |
| decision-gate                         | silent scope drift; ambiguous req               | intent capture → before mutation | **Relocate + shrink** (BLOCK before code)   | decision record: options + trade-offs + verdict                                                       |
| definitions-governance                | undefined term; divergent-meaning mismatch      | definition                       | **Refocus**                                 | drift summary: undefined-term count, conflicts, remediation                                           |
| feature-glossary                      | feature-local undefined term                    | definition                       | **Refocus/shrink**                          | per-concept agreed meaning, source-anchored                                                           |
| spec-feature + taxonomy/relationships | ambiguous req; missing edge; spec-code mismatch | spec (formal model)              | **Relocate** (diff → spec review)           | concept registry, typed edges, invariants, gate result                                                |
| generate-tests + TEST-PIPELINE        | missing edge case; spec-code mismatch           | derived tests                    | **Refocus**                                 | obligation catalogue w/ `@source` traceability (~113/feature)                                         |
| implement (--strict)                  | spec-code mismatch; cross-feature drift         | code                             | **Refocus + gate** (stop on first mismatch) | task list mapped to concepts; deferred-obligation entries                                             |
| **audit-alignment**                   | spec-code mismatch; missing edge; scope drift   | code → review                    | **Refocus** (the core diff-replacement)     | `ALIGNMENT-REPORT.md`: per-contract compliant/partial/missing/**extra** + mandatory P0 coverage BLOCK |
| audit-layering                        | intent in wrong layer; scope drift              | code → review                    | **Refocus**                                 | layering report + migration plan tied to concept IDs                                                  |
| tag-code + drift                      | spec-code mismatch; scope drift; orphans        | code ↔ review (continuous)       | **Refocus**                                 | 4-class triple diff (Docs-only/Code-only/Direction/Type mismatch)                                     |
| Craft ledger                          | unstated assumption; recursive scope drift      | wraps whole loop                 | **Relocate + residue first-class**          | blockers w/ closure criteria, decisions w/ evidence, recomposition proof                              |

## Top review-surface reducers

1. **audit-alignment** — direct diff-replacement: reviewer reads per-contract verdict + mechanical P0 coverage BLOCK; "extra" catches scope drift, "missing" catches dropped intent (what naive tests miss).
2. **generate-tests + TEST-PIPELINE** — makes intent fidelity enumerable/deterministic before code ("every transition row = 1 test"); feeds the coverage gate.
3. **decision-gate + interrogation** — relocate review to the cheapest place (before code exists), via small decision records.

## Net pattern

**No free tool ELIMINATES human intent review** — the docs make human gating the point. They **relocate** it upstream and **refocus** post-code review from raw diff onto structured fidelity reports with mechanical BLOCK verdicts; Craft makes leftover residue first-class.
