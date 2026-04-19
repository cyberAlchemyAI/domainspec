---
description: "Mandatory signal emission epilogue for all DomainSpec agent sessions. Ensures observations are captured even when agents run outside the pipeline orchestrator."
applyTo: ".github/agents/domainspec-*.agent.md,.github/skills/domainspec-*/SKILL.md,domainspec/.github/agents/domainspec-*.agent.md,domainspec/.github/skills/domainspec-*/SKILL.md"
---

## Signal Emission — Mandatory Epilogue

Before completing any session, evaluate whether pipeline signals should be emitted.

**Rule:** If the session produced any alignment gaps, spec gaps, governance gaps, rework, significant decisions, improvement proposals, or reusable patterns — emit signals to `docs/signals/pipeline-signals.jsonl` following the `domainspec-emit-signals` skill protocol.

Dual observer contract:
- Session epilogue emits source=`session-epilogue` signals.
- Fast observer gate emits source=`fast-observer` signals before close.
- Async observer emits source=`async-observer` signals after close from telemetry bundles.

**Quick check — emit if any of these occurred:**
- A code-spec mismatch was found, created, or worked around
- A spec was insufficient and required assumptions or human clarification
- A framework rule should have caught something but didn't
- A step required retries or correction
- A design decision was made with confidence below "high"
- An improvement idea for a skill or agent was identified

**Skip if:** The session was purely read-only, trivial, or produced no actionable observations.

**How:** Read `.github/skills/domainspec-emit-signals/SKILL.md` and follow its process to construct and append signals. Reference `domainspec/templates/SIGNAL-SCHEMA.md` for signal envelope and type schemas.
