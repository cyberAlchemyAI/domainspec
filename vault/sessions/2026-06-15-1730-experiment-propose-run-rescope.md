---
tags: [agents, vault, ontology]
node_type: audit
is_session: true
layer: ontology
nature: procedural, explanatory
status: active
created: 2026-06-15
timestamp: 2026-06-15T17:30:00-03:00
expires: 2026-08-14
conversation_id: 1d939349-f329-4c1a-b0aa-e6b28238fea3
decisions_made: true
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 7
importance_rationale: "Durably re-scopes the experiment dispatch_type to PROPOSE-only, bumps the constitution to v0.6.1 with a new §12, and closes multiple reconciliation gaps — load-bearing for every future experiment dispatch."
---

# Experiment dispatch_type re-scoped to PROPOSE-only (v0.6.1)

## Summary

Compared the local `experiment` subagent-dispatch skill against the knowledge-taxonomy GitHub repo's experiment PROTOCOL, then ran a tensioned review dispatch (3 attackers ⟂ verifier, anti-bias gate) that found the original improvement proposal was largely anticipated by constitution §7 and mostly mis-filed. By owner decision the `experiment` dispatch_type was re-scoped to the pre-registration (PROPOSE) phase only — designer + skeptic produce a frozen, validity-checked `criterion.md`; running the probe and adjudicating SURVIVED/FALSIFIED becomes a SEPARATE downstream run. A second review dispatch verified the changeset and surfaced reconciliation gaps (stale P-SS-9 clause, unannotated experiment-promotion discovery doc, §5 line, router table, missing §7 re-confrontation) — all fixed; the constitution document version was bumped 0.6.0→0.6.1 (wire schema_version unchanged) with a new §12 amendment. The run-phase design is the open next step.

## Files touched

- .claude/skills/experiment/SKILL.md
- internal_tools/subagents-dispatch-hooks/skills/experiment/SKILL.md
- internal_tools/subagents-dispatch-hooks/constitution/subagents-strategy-constitution-proposal.md
- .claude/skills/domainspec-subagents-strategy/SKILL.md
- internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/SKILL.md
- internal_tools/subagents-dispatch-hooks/docs/discovery/experiment-promotion/discovery.md
- telemetry/agents/subagents-dispatch.yaml
- research/subagents-strategy/2026-06-15-experiment-skill-proposal-review/attacks.md
- research/subagents-strategy/2026-06-15-experiment-skill-proposal-review/findings.md
- research/subagents-strategy/2026-06-15-experiment-propose-run-rescope-review/attacks.md

## Connections

> Forward-only by source (`is_session: true`) per `vault/ontology-conventions.md` §8 — no inverse row is written on any target. Curator agent unavailable in this environment — block authored directly per `.claude/skills/custom/edge-catalog.md`.

| Document | Type | Description |
|----------|------|-------------|
| `internal_tools/subagents-dispatch-hooks/constitution/subagents-strategy-constitution-proposal.md` | `modifies` | §5/P-SS-9/§7 scope notes + §7 propose/run re-confrontation; document version 0.6.0→0.6.1; new §12 amendment. |
| `.claude/skills/experiment/SKILL.md` | `modifies` | Re-scoped to PROPOSE-only (designer+skeptic → frozen criterion.md; run separated downstream). |
| `internal_tools/subagents-dispatch-hooks/skills/experiment/SKILL.md` | `modifies` | Same as its deployed twin (kept byte-identical). |
| `.claude/skills/domainspec-subagents-strategy/SKILL.md` | `modifies` | Router `dispatch_type` table annotated propose-only; governing-doc version reference → v0.6.1. |
| `internal_tools/subagents-dispatch-hooks/skills/domainspec-subagents-strategy/SKILL.md` | `modifies` | Same as its deployed twin. |
| `internal_tools/subagents-dispatch-hooks/docs/discovery/experiment-promotion/discovery.md` | `revisits` | Reconsidered the experiment-promotion design under the propose/run split; added a dated scope-update note (not refuted). |
| `telemetry/agents/subagents-dispatch.yaml` | `modifies` | Appended 2 dispatch rows + 2 close rows for the two review dispatches run this session. |
| `research/subagents-strategy/2026-06-15-experiment-skill-proposal-review/findings.md` | `creates` | Verified KEEP/FIX change-requests on the original KT-comparison proposal. |
| `research/subagents-strategy/2026-06-15-experiment-skill-proposal-review/attacks.md` | `creates` | Verbatim attacker + verifier returns (proposal review). |
| `research/subagents-strategy/2026-06-15-experiment-propose-run-rescope-review/findings.md` | `creates` | Verified change-requests on the re-scope changeset; reconciliation fixes. |
| `research/subagents-strategy/2026-06-15-experiment-propose-run-rescope-review/attacks.md` | `creates` | Verbatim attacker + verifier returns (changeset review). |
- research/subagents-strategy/2026-06-15-experiment-propose-run-rescope-review/findings.md
