---
tags: [vault, agents, ontology]
node_type: discovery
is_session: true
layer: [ontology, architecture]
nature: explanatory
status: active
created: 2026-06-12
timestamp: 2026-06-12T23:47:32-03:00
expires: 2026-08-11
conversation_id: 2026-06-12-2347-discovery-views-stub-reminder
decisions_made: true
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 6
importance_rationale: "Closed one false gap, confirmed a real consumer-facing propagation gap, and produced an accepted-in-principle design (the Downstream-views stub) that would change how every future discovery is born."
---

# Discovery→Views: packing audit + the Downstream-views reminder stub

## Summary

Pulled on the parked **drift-detection comparator** open question from the discovery→views wiring work, which turned into an audit of whether that wiring is fully "packed." Found two gaps: **Gap 1 (real)** — `.agents/skills/custom/discovery-writing.md` is missing the "Downstream — the structural views" section that `.claude/` carries, and because `.agents/` is a *parallel hand-maintained source* that `tools/bootstrap_domainspec_codex.sh` distributes to consumer repos, the stale half propagates to every Codex consumer; **Gap 2 (false)** — the `domainspec-discovery-writer` agent is views-blind, which is **correct**, since it runs at a discovery's birth, exactly when the contract says views must not yet be built. To answer "remind the user to use the rest of the pipeline," proposed and accepted-in-principle a standing **"Downstream views — derive on demand"** stub planted in every discovery at birth (by both the skill and the agent): a small table listing the three sibling views as "not derived" with their derive triggers and a "derived against `version`" column that doubles as the baseline seed for the future drift comparator. Nothing was applied to disk — output is decisions plus a design awaiting go-ahead to draft the diff.

## Files touched

- (none — no files created or modified on disk this session)

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/sessions/2026-06-12-0029-discovery-views-wiring.md` | `revisits` | Pulled on this session's parked drift-detection open question and re-examined the discovery→views wiring without refuting it. |
| `.claude/skills/custom/discovery-writing.md` | `consumes` | Read as the primary subject of the packing audit and the proposed host for the Downstream-views stub. |
| `.claude/agents/domainspec-discovery-writer.agent.md` | `consumes` | Read to confirm Gap 2 — the discovery agent's correct views-blindness at write time. |

<!-- Source is is_session: true → forward-only by source (vault/ontology-conventions.md §8): no inverse
rows written on targets. The two .claude/** targets are additionally forward-only by design (target-keyed
carve-out, edge-catalog.md §6). All three edges verified legal against the catalog matrix. -->

