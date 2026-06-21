# Test Spec (engine-derived): test-derivation-engine

<!-- ENGINE-PROVENANCE
format_version: 1
feature: test-derivation-engine
engine_commit: b7b5d4a
inputs:
  interfaces.md: sha256:3f6ae1d4bf4f2bbc54eb70c03e55e94c9c1ac0ab0556f196120f67349ee8825c
  operations.md: sha256:d1bdc7cafcf858792dc8a02e50c7d2d48fab4ce002acee407354fc3e88b95ea1
note: the ENGINE-REGION below is deterministic δ output, replaced wholesale on
      re-derive. Do not hand-edit it. Run `check` to detect drift.
-->

<!-- ENGINE-REGION-START — deterministic δ output; overwritten on re-derive, do not hand-edit -->

## Source Completeness Gate

| Doc           | Status  |
| ------------- | ------- |
| states.md     | absent  |
| operations.md | present |
| interfaces.md | present |
| events.md     | absent  |
| workflows.md  | absent  |
| queries.md    | absent  |
| mappings.md   | absent  |
| domain.md     | absent  |
| rules.md      | absent  |

## Coverage Summary

Total obligations: 31
Spec-formalization metric (pure / (pure + needs_formal)): 48.4%

| Tier           | Count |
| -------------- | ----- |
| derivable-pure | 15    |
| needs-formal   | 16    |

| Rule class      | Count |
| --------------- | ----- |
| calculation     | 2     |
| needs-formal    | 16    |
| postcondition   | 10    |
| rule-validation | 3     |

## Suite Partition

- Unit (derivable-pure): 15
- Integration (derivable-needs-harness): 0
- Unresolved (needs-formal): 16

## Obligations

| ID           | Key      | Rule            | Tier           | Source                                  | Obligation                                                              |
| ------------ | -------- | --------------- | -------------- | --------------------------------------- | ----------------------------------------------------------------------- |
| TDE-NF-001   | 070d73a6 | needs-formal    | needs-formal   | operations.md#Lint:rule:0               | Rule R1: needs_formal (prose Formal)                                    |
| TDE-NF-002   | 0a5ce432 | needs-formal    | needs-formal   | operations.md#Derive:calculation:0      | Calculation C1: needs_formal                                            |
| TDE-NF-003   | 0e4b825b | needs-formal    | needs-formal   | operations.md#RoundTrip:rule:0          | Rule R1: needs_formal (prose Formal)                                    |
| TDE-RULE-001 | 1a1bf180 | rule-validation | derivable-pure | operations.md#Parse:rule:0              | Rule R1: absent (existence)                                             |
| TDE-NF-004   | 221d5871 | needs-formal    | needs-formal   | operations.md#EmitSpec:rule:0           | Rule R1: needs_formal (prose Formal)                                    |
| TDE-NF-005   | 2279630d | needs-formal    | needs-formal   | operations.md#Parse:rule:3              | Rule R4: needs_formal (prose Formal)                                    |
| TDE-CALC-001 | 26fffb5a | calculation     | derivable-pure | operations.md#AssignKey:calculation:0   | Calculation C1: `sha1(source_anchor + "                                 |
| TDE-RULE-002 | 27ca735a | rule-validation | derivable-pure | operations.md#Parse:rule:0              | Rule R1: present (existence)                                            |
| TDE-POST-001 | 29732717 | postcondition   | derivable-pure | operations.md#AssignKey:postcondition:0 | Postcondition P1: Two runs over the same docs emit identical key sets.  |
| TDE-NF-006   | 3bad4515 | needs-formal    | needs-formal   | operations.md#RoundTrip:rule:1          | Rule R2: needs_formal (prose Formal)                                    |
| TDE-POST-002 | 41517665 | postcondition   | derivable-pure | operations.md#Derive:postcondition:0    | Postcondition P1: Same (G, Δ) yields identical obligations.             |
| TDE-NF-007   | 4e0c894d | needs-formal    | needs-formal   | operations.md#RoundTrip:rule:2          | Rule R3: needs_formal (prose Formal)                                    |
| TDE-POST-003 | 51937aa8 | postcondition   | derivable-pure | operations.md#Parse:postcondition:1     | Postcondition P2: Nodes are sorted by source_anchor.                    |
| TDE-RULE-003 | 5f815ba5 | rule-validation | derivable-pure | operations.md#Parse:rule:1              | Rule R2: conjunct 0 missing                                             |
| TDE-POST-004 | 61cab8de | postcondition   | derivable-pure | operations.md#Derive:postcondition:1    | Postcondition P2: Every obligation carries an obligation_key.           |
| TDE-POST-005 | 741f40c7 | postcondition   | derivable-pure | operations.md#Lint:postcondition:0      | Postcondition P1: Lint exits non-zero on any violation.                 |
| TDE-NF-008   | 7a70380b | needs-formal    | needs-formal   | operations.md#Derive:rule:2             | Rule R3: needs_formal (prose Formal)                                    |
| TDE-NF-009   | 7bc94a27 | needs-formal    | needs-formal   | operations.md#Parse:rule:2              | Rule R3: needs_formal (prose Formal)                                    |
| TDE-NF-010   | 845a6672 | needs-formal    | needs-formal   | operations.md#Derive:rule:0             | Rule R1: needs_formal (prose Formal)                                    |
| TDE-NF-011   | 8f0d0907 | needs-formal    | needs-formal   | operations.md#AssignKey:rule:0          | Rule R1: needs_formal (prose Formal)                                    |
| TDE-NF-012   | 953667d2 | needs-formal    | needs-formal   | operations.md#Derive:rule:4             | Rule R5: needs_formal (prose Formal)                                    |
| TDE-NF-013   | a0628000 | needs-formal    | needs-formal   | operations.md#Derive:rule:3             | Rule R4: needs_formal (prose Formal)                                    |
| TDE-POST-006 | a1e66d2d | postcondition   | derivable-pure | operations.md#Parse:postcondition:0     | Postcondition P1: Returns a typed ConceptGraph.                         |
| TDE-NF-014   | a92ed04c | needs-formal    | needs-formal   | operations.md#Lint:rule:1               | Rule R2: needs_formal (prose Formal)                                    |
| TDE-NF-015   | cd1da13a | needs-formal    | needs-formal   | operations.md#Derive:rule:1             | Rule R2: needs_formal (prose Formal)                                    |
| TDE-POST-007 | da717fb3 | postcondition   | derivable-pure | operations.md#Parse:postcondition:2     | Postcondition P3: A rejected table produces a violation with file:line. |
| TDE-POST-008 | de9e844d | postcondition   | derivable-pure | operations.md#EmitSpec:postcondition:1  | Postcondition P2: emit_tests maps one runnable case per obligation_key. |
| TDE-POST-009 | dfef2776 | postcondition   | derivable-pure | operations.md#EmitSpec:postcondition:0  | Postcondition P1: emit_spec output is byte-identical across runs.       |
| TDE-POST-010 | f8db3a63 | postcondition   | derivable-pure | operations.md#RoundTrip:postcondition:0 | Postcondition P1: PASS only when nothing committed is missing.          |
| TDE-NF-016   | f90a9339 | needs-formal    | needs-formal   | operations.md#AssignKey:rule:1          | Rule R2: needs_formal (prose Formal)                                    |
| TDE-CALC-002 | fd191ad9 | calculation     | derivable-pure | operations.md#Derive:calculation:1      | Calculation C2: classify(formal).count                                  |

## Unresolved Formal Gaps

needs_formal (un-formalized — no closed checkable expression): 16

- `TDE-NF-001` operations.md#Lint:rule:0 — Rule R1: needs_formal (prose Formal)
- `TDE-NF-002` operations.md#Derive:calculation:0 — Calculation C1: needs_formal
- `TDE-NF-003` operations.md#RoundTrip:rule:0 — Rule R1: needs_formal (prose Formal)
- `TDE-NF-004` operations.md#EmitSpec:rule:0 — Rule R1: needs_formal (prose Formal)
- `TDE-NF-005` operations.md#Parse:rule:3 — Rule R4: needs_formal (prose Formal)
- `TDE-NF-006` operations.md#RoundTrip:rule:1 — Rule R2: needs_formal (prose Formal)
- `TDE-NF-007` operations.md#RoundTrip:rule:2 — Rule R3: needs_formal (prose Formal)
- `TDE-NF-008` operations.md#Derive:rule:2 — Rule R3: needs_formal (prose Formal)
- `TDE-NF-009` operations.md#Parse:rule:2 — Rule R3: needs_formal (prose Formal)
- `TDE-NF-010` operations.md#Derive:rule:0 — Rule R1: needs_formal (prose Formal)
- `TDE-NF-011` operations.md#AssignKey:rule:0 — Rule R1: needs_formal (prose Formal)
- `TDE-NF-012` operations.md#Derive:rule:4 — Rule R5: needs_formal (prose Formal)
- `TDE-NF-013` operations.md#Derive:rule:3 — Rule R4: needs_formal (prose Formal)
- `TDE-NF-014` operations.md#Lint:rule:1 — Rule R2: needs_formal (prose Formal)
- `TDE-NF-015` operations.md#Derive:rule:1 — Rule R2: needs_formal (prose Formal)
- `TDE-NF-016` operations.md#AssignKey:rule:1 — Rule R2: needs_formal (prose Formal)

needs-harness (derivable, requires a runtime/effect to test): 0

<!-- ENGINE-REGION-END -->
