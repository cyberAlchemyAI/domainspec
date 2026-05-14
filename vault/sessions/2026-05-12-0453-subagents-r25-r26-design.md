---
tags: [vault, agents, ontology]
node_type: discussion
is_session: true
layer: ontology
nature: explanatory
status: active
created: 2026-05-12
timestamp: 2026-05-12T04:53:43-03:00
expires: 2026-07-11
conversation_id: 2026-05-12-0453-subagents-r25-r26-design
decisions_made: true
contradictions_found: true
specs_updated: []
promoted_candidates: []
expected_importance: 7
importance_rationale: "Designs two new constitution rules (R25/R26) that govern every future subagents-strategy dispatch; load-bearing for correctness of all future fan-out findings, but unapplied — pending robot-talks gate."
---

# Subagents-Strategy — R25 Proposed Resolutions + R26 Resolution Audit Design (Pre-Ratification)

## Summary

Reviewed the whatsapp-capture `v0-capture-pipeline-design` fan-out and found that the `domainspec-subagents-strategy` skill raises tensions but does not propose or audit resolutions — leaving HIGH-severity tensions to be re-derived downstream by the discovery-writer. Designed two new constitution rules (R25 Proposed Resolutions + R26 Resolution Audit), extending `domainspec-findings.md` from 3 to 5 sections with same-agent proposal authoring, a separate independent auditor agent, and conditional triggers on HIGH-severity tensions. Produced a concrete 6-file implementation plan (constitution, template, findings-writer agent, new resolutions-auditor agent, SKILL.md, custom findings-writing skill) but did NOT apply — agreed to robot-talks the design first, framed by the main question: *"Is the R25/R26 implementation plan, as drafted, safe to amend the constitution with, or does it need revision first?"*

## Contradictions

- **questions** `vault/constitution/domainspec-subagents-strategy-constitution.md` — current R16/R17/R22 do not require prescriptive resolutions or independent audit; proposed R25 + R26 + R22 amendment as the fix, but no file changed yet.

## Files touched

- vault/sessions/2026-05-12-0142-personal-assistant-whatsapp-fanout.md
- apps/personal-assistant/features/whatsapp-capture/research/v0-capture-pipeline-design/domainspec-findings.md
- apps/personal-assistant/features/whatsapp-capture/research/v0-capture-pipeline-design/domainspec-research.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/sessions/2026-05-12-0142-personal-assistant-whatsapp-fanout.md` | `consumes` | Read to recall the whatsapp-capture fan-out context that motivated the R25/R26 design. |
| `apps/personal-assistant/features/whatsapp-capture/research/v0-capture-pipeline-design/domainspec-findings.md` | `consumes` | Read its 6 HIGH-severity tensions section to identify the "tensions stay tensions" gap. |
| `apps/personal-assistant/features/whatsapp-capture/research/v0-capture-pipeline-design/domainspec-research.md` | `consumes` | Read to validate citation pattern that R17 currently enforces. |
