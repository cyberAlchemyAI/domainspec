---
tags: [agents, vault, ontology, architecture]
node_type: discovery
is_session: true
layer: [architecture, ontology]
nature: [explanatory, procedural]
status: active
created: 2026-06-15
timestamp: 2026-06-15T14:38:35-03:00
conversation_id: 2026-06-15-1438-anti-bias-init-only-pivot
decisions_made: true
contradictions_found: true
specs_updated: [vault/discovery/anti-bias-vector-composition/validator-check.md, vault/discovery/anti-bias-vector-composition/principle.md]
promoted_candidates: []
expected_importance: 8
importance_rationale: "Structural shift — anti-bias moves from a forgeable post-dispatch checker to a mandatory pre-dispatch gate of two independent agents, affecting every future tensioned dispatch."
expires: 2026-08-14
---

# Anti-bias enforcement pivot — post-dispatch checker out, init-time check-tension gate in

## Summary

After comparing OpenRouter's "Fusion" multi-model approach (no changes) and propagating the constitution's v0.5.3 document-version bump (wire `schema_version` stays 0.5.2 per §10.1), the session built and adversarially reviewed a "Tier 2" **post-dispatch** anti-bias checker — a dogfooded review showed it forgeable (one shared token counts agreement as dissent) and unsatisfiable by a flat parallel round. The owner then pivoted to enforcing anti-bias **only at initialization**: the whole post-dispatch apparatus (checker script, the `Dissent:`-line contract, validator-check Items 9–12) was removed and a new **`check-tension`** skill built — a gate of two independent agents (checker «aponta» + reviewer «revisa») that verify the four pre-dispatch tension tests before the human confirm, where only "both PASS" proceeds, else the sheet returns to the strategist. The gate was dogfooded (both agents independently converged on REVISE for an untensioned sheet), and the `agents-input-output` discovery was **partially** superseded (only its `Dissent:`-line slice; its broader I/O contract stands).

## Contradictions

- modifies `vault/discovery/anti-bias-vector-composition/validator-check.md` — v0.3.0: removed Items 9–12 (post-dispatch realization + `Dissent:` contract); Tests 1–4 now enforced by the `check-tension` gate.
- modifies `vault/discovery/anti-bias-vector-composition/principle.md` — trimmed the post-dispatch clause; enforcement is now initialization-only.
- supersedes (partial) `internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/discovery.md` — v1.1.0: only the `Dissent:`-line slice retired; envelope / claim-IDs / P9 checklist remain live.

## Files touched

- vault/discovery/anti-bias-vector-composition/validator-check.md
- vault/discovery/anti-bias-vector-composition/principle.md
- internal_tools/subagents-dispatch-hooks/skills/check-tension/SKILL.md
- .claude/skills/check-tension/SKILL.md
- internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/SKILL.md
- .claude/skills/domainspec-subagents-strategy/SKILL.md
- internal_tools/subagents-dispatch-hooks/skills/research/SKILL.md
- .claude/skills/research/SKILL.md
- internal_tools/subagents-dispatch-hooks/skills/review/SKILL.md
- .claude/skills/review/SKILL.md
- internal_tools/subagents-dispatch-hooks/install.cjs
- internal_tools/subagents-dispatch-hooks/README.md
- internal_tools/subagents-dispatch-hooks/docs/LEDGER-MODEL.md
- internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/discovery.md
- telemetry/agents/subagents-dispatch.yaml

## Connections

> Forward-only by source (`is_session: true`) per `vault/ontology-conventions.md` §8 — no inverse row is written on any target.

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/anti-bias-vector-composition/validator-check.md` | `modifies` | v0.3.0 — removed post-dispatch realization (Items 9–12 + Dissent contract); Tests 1–4 now enforced by the check-tension gate. |
| `vault/discovery/anti-bias-vector-composition/principle.md` | `modifies` | Trimmed the post-dispatch clause to initialization-only enforcement. |
| `internal_tools/subagents-dispatch-hooks/skills/check-tension/SKILL.md` | `creates` | New two-agent init-time tensioning gate skill. |
| `.claude/skills/check-tension/SKILL.md` | `creates` | Deployed copy of the check-tension gate skill. |
| `internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/SKILL.md` | `modifies` | Wired the check-tension gate into Propose/P5; v0.5.3 ref; removed the close-gate. |
| `.claude/skills/domainspec-subagents-strategy/SKILL.md` | `modifies` | Same router changes in the deployed copy. |
| `internal_tools/subagents-dispatch-hooks/skills/research/SKILL.md` | `modifies` | Removed the Dissent-line mandate and false-consensus post-run bullet. |
| `.claude/skills/research/SKILL.md` | `modifies` | Same research-skill change in the deployed copy. |
| `internal_tools/subagents-dispatch-hooks/skills/review/SKILL.md` | `modifies` | Removed the Dissent-line mandate. |
| `.claude/skills/review/SKILL.md` | `modifies` | Same review-skill change in the deployed copy. |
| `internal_tools/subagents-dispatch-hooks/install.cjs` | `modifies` | Added check-tension to CHAIN_SKILLS; reverted the checker from SKILL_FILES. |
| `internal_tools/subagents-dispatch-hooks/README.md` | `modifies` | Propagated the v0.5.3 document-version reference. |
| `internal_tools/subagents-dispatch-hooks/docs/LEDGER-MODEL.md` | `modifies` | Propagated the v0.5.3 document-version references. |
| `internal_tools/subagents-dispatch-hooks/docs/discovery/agents-input-output/discovery.md` | `modifies` | v1.1.0 partial supersede — retired the Dissent-line slice only. |
| `telemetry/agents/subagents-dispatch.yaml` | `modifies` | Appended dispatch + close rows for the two dispatches run this session. |
