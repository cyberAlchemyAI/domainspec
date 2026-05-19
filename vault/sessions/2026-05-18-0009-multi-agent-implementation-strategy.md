---
tags: [agents, vault, architecture, subagents, implementation, strategy, multi-agent]
node_type: discovery
is_session: true
layer: architecture, ontology
nature: explanatory
status: active
created: 2026-05-18
timestamp: 2026-05-18T00:09:43-03:00
expires: 2026-07-17
conversation_id: multi-agent-implementation-strategy-2026-05-18
decisions_made: true
contradictions_found: true
specs_updated: [.claude/skills/custom/frontmatter.md]
promoted_candidates: [vault/discovery/multi-agent-implementation-strategy/README.md]
expected_importance: 7
importance_rationale: "Decides scope of a foundational meta-skill (subagent-strategy) and rejects a tempting expansion (top-level implementation-strategy), preventing a likely future mis-build."
---

# Multi-Agent Implementation Strategy — Investigation + Skill Application

## Summary

Investigated whether implementation execution should be governed by a structured multi-agent strategy analogous to `domainspec-subagents-strategy`. Four parallel investigators (repo audit, external prior art, first-principles, adversarial) converged: naive N-parallel-writers harms; the empirical/first-principles win is in role-split (Aider Architect/Editor) and executable-feedback loops (Reflexion, AgentCoder), not writer multiplication. Decided NOT to build a top-level implementation-strategy skill; will instead build only two narrow concessions (review fan-out, scaffold fan-out) and file the Contract→Fill→Weave triad as deferred design. The 4-lens dispatch was wrapped retroactively into `domainspec-subagents-strategy` (spec, telemetry, research, findings, discovery README all persisted), and a schema-conflict bug in the frontmatter cheatsheet was fixed (veracidade/convicção are optional for discovery, not required).

## Contradictions

- validates `vault/discovery/multi-agent-implementation-strategy/README.md` — 4-lens convergence (audit + prior art + first-principles + adversarial) all reject naive N-parallel-writers; aligns with Aider/Reflexion/AgentCoder evidence.
- questions any prior framing that treated `domainspec-subagents-strategy` as discovery-only — session retroactively wrapped an implementation-execution investigation under it, broadening its applicability beyond what the skill description claims.
- validates `.claude/skills/custom/frontmatter.md` (post-fix) — confirms veracidade/convicção being optional for `discovery` is the correct resolution; the conflict was real and blocked classification mid-session.

## Files touched

- vault/snapshots/dispatches/2026-05-17-multi-agent-implementation-strategy-01-spec.yaml
- internal_tools/vault_telemetry/events/subagent-strategy.jsonl
- vault/discovery/multi-agent-implementation-strategy/research/domainspec-subagents-research.md
- vault/discovery/multi-agent-implementation-strategy/research/domainspec-subagents-findings.md
- vault/discovery/multi-agent-implementation-strategy/README.md
- .claude/skills/custom/frontmatter.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/multi-agent-implementation-strategy/README.md` | `creates` | This session produced the discovery README as a new file. |
| `vault/discovery/multi-agent-implementation-strategy/research/domainspec-subagents-research.md` | `creates` | This session produced the research artifact as a new file. |
| `vault/discovery/multi-agent-implementation-strategy/research/domainspec-subagents-findings.md` | `creates` | This session produced the findings artifact as a new file. |
