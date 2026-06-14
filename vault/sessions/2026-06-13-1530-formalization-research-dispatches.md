---
tags: [agents, dispatch, research, formalization, governance]
node_type: discovery
is_session: true
layer: architecture, ontology
nature: technical, procedural
status: active
created: 2026-06-13
timestamp: 2026-06-13T15:30:00-03:00
expires: 2026-08-12
conversation_id: dispatch-formal-guarantees-and-certifier-judge-separation
decisions_made: true
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 7
importance_rationale: "Two full research dispatches resolved a formalization question (no buildable novel dispatch oracle; the two-layer certifier/judge split is sound-but-owned, its cross-domain unification a typed-negative) and corrected two governance defects — anti-bias malformation and canonical ledger placement — load-bearing for dispatch hygiene but scoped to internal tooling."
---

# Dispatch formal-guarantees + certifier/judge separation — two research dispatches, two governance fixes

## Summary

Ran two full research-skill dispatches (explorer→writer→skeptic→auditor), both registered append-only in the canonical ledger `telemetry/agents/subagents-dispatch.yaml` and closed `resolved`. (a) `2026-06-13-dispatch-formal-guarantees-v2`: which dispatch-system guarantee is buildable as an executable pre-dispatch oracle — verdict, all three candidates (cost-oracle, lifecycle-typestate, CRDT-confluence) are owned engineering (resource-constrained workflow-nets / typestate+FK / Shapiro G-Set), none a novelty, and the cost-oracle is near-vacuous on current data (all connections sequential, max_loops=1). (b) `2026-06-13-certifier-judge-separation`: is "prove the inner certifier, leave the outer judge unproved inside the certified feasible set" a sound principle with genuine residue — verdict, the SPLIT is sound but owned (Simplex / RTA / safe-RL, ≥5 threads), while the 3-way cross-domain UNIFICATION (security CERTIFIED-vs-ASSUMED = I/O envelope-vs-body = safe-RL feasible-set as one typed object) does NOT hold, killed three independent ways (Rittel: frame owned by Graded Hoare Logic + Cousot abstract non-interference; Taleb: a shared `classify(content)` floor, not one object; Quine: "gap" equivocates across oracle/category/containment — a pun). Decision banked in `certifier-judge-separation/discovery.md`: adopt the two-layer architecture as engineering, record the unification as a typed-negative. The split's repo instances SI1/SI2 are the sibling lean-repo `AgentPermissionKernel*` files; the unification's reversal-crack points at `layered_not_flattenable`.

## Governance corrections

- **Anti-bias malformation → fix:** a malformed v1 of the formal-guarantees dispatch was closed `exit_reason=error` after a 2-skeptic validator-check found its `anti_bias_global` welded "owned" onto the explorer pair; re-run with a pure methodology×source-corpus axis (owned is the precedent-kill gate's output, not a tension axis).
- **Canonical placement:** confirmed via the hooks that the single sanctioned save location is the append-only ledger `telemetry/agents/subagents-dispatch.yaml`; removed two redundant standalone `dispatch.yaml` roster files after a 2-reviewer placement-confirmation gate.

## Files touched

- internal_tools/subagents-dispatch-hooks/formalization/dispatch-formal-guarantees/ (research/findings.md, research/research.md, agents/01,02,03,04,05,07-*.md)
- internal_tools/subagents-dispatch-hooks/formalization/certifier-judge-separation/ (research/findings.md, research/research.md, agents/01–07-*.md, discovery.md)
- telemetry/agents/subagents-dispatch.yaml

## Connections

<!-- left for the domainspec-vault-metadata-curator (Step 4); forward-only session edges.
     intents: each formalization/** artifact = creates; telemetry/agents/subagents-dispatch.yaml = modifies. -->
