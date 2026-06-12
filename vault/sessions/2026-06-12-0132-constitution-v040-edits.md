---
tags: [agents, vault, ontology]
node_type: audit
is_session: true
layer: ontology
nature: procedural, reference
status: active
created: 2026-06-12
timestamp: 2026-06-12T01:32:00-03:00
expires: 2026-08-11
conversation_id: constitution-v040-dispatch-type-edits
decisions_made: true
contradictions_found: true
specs_updated: []
promoted_candidates: []
expected_importance: 8
importance_rationale: "Suspended a live constitution rule (R13), renamed the strategy field to dispatch_type, added the suggestion FORECAST slot, removed the P-SS-8 spawn budget under owner waiver, and added a waiver-composition meta-clause — structural changes to the subagent-governance layer."
---

# Subagents-Strategy Constitution v0.4.0 — dispatch_type edits, budget removal, review fixes

## Summary

The session interrogated the v0.4.0 draft parameter-by-parameter (goal/success_metric/final_approver_criteria/context, dispatch_kind vs strategy, anti_bias_global, connections, recursion_budget) and applied the owner's decisions via an editor → two-tensioned-reviewers → fixer dispatch. Changes: `strategy` field renamed `dispatch_type`; `suggestion` added as a fifth FORECAST dispatch_type (decision-support discriminator); R2 amended with a single-agent helper-invocation exemption; `recursion_budget` regulation removed under a new §12 P-SS-8 owner waiver (R13 suspended in full; post-hoc reporting retained in R18; `parent_dispatch_id` kept as lineage). Reviewers found 9 defects, all fixed — including a pre-existing three-way zig-zag edge-type inconsistency (resolved owner-fixed: distinct named type), a P-SS-8 falsifier clause, and a §12 waiver-composition meta-clause prohibiting silent inheritance of any waiver. The draft remains `status: draft`, pending owner merge into the live v0.3.0.

## Contradictions

- questions `vault/constitution/domainspec-subagents-strategy-constitution.md` — the draft suspends live R13 in full and exempts single-agent helper invocations from live R2's artifact-set obligation; not yet a supersession (merge pending), but the live rule text for R2 and R13 is directly questioned.
- questions `vault/premise/domainspec-subagents-strategy-premises.md` — removing the P-SS-8-grounded spawn-budget regulation outruns P-SS-8 under an owner waiver (premise unedited); P-SS-8's own falsification test is now bound to the waiver as its failure condition.

## Files touched

- vault/constitution/domainspec-subagents-strategy-constitution.v0.4.0-draft.md
- vault/constitution/domainspec-subagents-strategy-constitution.md
- vault/premise/domainspec-subagents-strategy-premises.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/constitution/domainspec-subagents-strategy-constitution.v0.4.0-draft.md` | `modifies` | Session heavily edited this draft: renamed `strategy` to `dispatch_type`, added `suggestion` FORECAST type, added §12 P-SS-8 owner waiver, suspended R13, amended R2. |
| `vault/constitution/domainspec-subagents-strategy-constitution.md` | `contradicts` | Live v0.3.0 R2 and R13 are directly questioned by the draft changes (R13 suspended in full; R2 exemption added); not yet superseded — merge pending. |
| `vault/premise/domainspec-subagents-strategy-premises.md` | `revisits` | P-SS-8's spawn-budget regulation was outrun under an owner waiver; the premise was not edited but its scope is reconsidered by the §12 waiver-composition meta-clause. |
