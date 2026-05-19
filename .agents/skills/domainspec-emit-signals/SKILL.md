---
name: domainspec-emit-signals
description: Emit structured pipeline signals at the end of any DomainSpec agent session. Cross-cutting — applies to all agents, not just the pipeline orchestrator.
argument-hint: "(no arguments — runs automatically as session epilogue)"
---

<objective>
Ensure every DomainSpec agent session produces structured signals that feed the async reflection loop, regardless of whether the session was orchestrated by the pipeline skill or invoked directly.
</objective>

<context>
Inputs:
- domainspec/templates/SIGNAL-SCHEMA.md — signal envelope and type definitions
- docs/signals/pipeline-signals.jsonl — append-only signal log

This skill is referenced by every DomainSpec agent as a mandatory epilogue step.
When the full pipeline orchestrates the session, the pipeline skill invokes this skill at Step 10.
When an agent runs standalone (e.g., `domainspec-implement` invoked directly), the agent's own final execution step invokes this skill.

Related observers:

- Fast observer (blocking): deterministic detector stage before close.
- Async observer (non-blocking): telemetry-based deep observer after close.
  </context>

<when-to-emit>
Emit signals when ANY of the following occurred during the session:

| Condition                                         | Signal Type       | Severity Baseline |
| ------------------------------------------------- | ----------------- | ----------------- |
| Code-spec mismatch found or created               | `alignment-gap`   | MEDIUM            |
| Spec was insufficient for implementation          | `spec-gap`        | MEDIUM            |
| Framework should have caught something but didn't | `governance-gap`  | HIGH              |
| A step required retries or human correction       | `rework`          | LOW               |
| A significant design decision was made            | `decision`        | LOW               |
| A skill/agent improvement idea was identified     | `proposal`        | MEDIUM            |
| A reusable insight was discovered                 | `pattern`         | LOW               |
| Agent deviated from its own documented spec       | `spec-compliance` | HIGH              |

Do NOT emit signals for:

- Routine successful operations with no observations
- Trivial single-step lookups or read-only questions
- Signals that duplicate one already emitted in this session
  </when-to-emit>

<process>
1. **Collect observations.** Before session completion, review all work performed and identify emittable observations using the table above.
2. **Skip if empty.** If no observations match the emission criteria, do not create empty or boilerplate signals. State "No signals to emit" in the session summary and stop.
3. **Read schema.** Read `domainspec/templates/SIGNAL-SCHEMA.md` to get the current envelope and type-specific `data` shapes.
4. **Determine version.** Read the first `## [x.y.z]` heading from `domainspec/CHANGELOG.md` to get `domainspecVersion`.
5. **Build signals.** For each observation, construct a signal JSON object following the envelope schema:
  - `id`: Use UUID v4.
   - `timestamp`: Current ISO 8601 UTC.
   - `session`: Use a short descriptive session ID (e.g., `impl-player-makeup-2026-04-17`).
   - `feature`: The feature-id from SPEC frontmatter (or `"cross-feature"` if spanning multiple).
   - `domainspecVersion`: From step 4.
   - `pipelineMode`: `"new"`, `"evolution"`, or `"audit"` based on session context.
  - `source`: `"session-epilogue"` for this skill.
   - `type`, `severity`, `category`, `data`: Per SIGNAL-SCHEMA.md type definitions.
6. **Append to file.** Append each signal as one JSON line to `docs/signals/pipeline-signals.jsonl`. Create the file if it doesn't exist. Never overwrite existing content.
7. **Enforce session completeness invariants:**
  - If session emits any `step-verdict`, ensure exactly one `overhead` signal exists for the session.
  - If any `step-verdict.data.retriesNeeded > 0`, ensure at least one `rework` signal exists for the session.
8. **Report.** Include signal count by type in the session summary.
</process>

<signal-quality-rules>
- **One observation = one signal.** Do not bundle unrelated observations.
- **Be specific.** `data.description` must reference concrete file paths, concept IDs, or error messages — not vague summaries.
- **Trace to source.** Include `specFile` and `codeFile` when the gap involves a spec-code relationship.
- **No duplicates.** Before appending, check the last 20 lines of `pipeline-signals.jsonl` for signals with the same `type`, `feature`, and `data.description`. Skip if already emitted.
- **Canonical envelope.** `id` must be UUID v4 and `source` must be `session-epilogue`.
- **Severity calibration:**
  - LOW: Informational, no action needed unless pattern accumulates.
  - MEDIUM: Actionable but non-blocking — should be fixed in next iteration.
  - HIGH: Significant drift or governance failure — should be addressed before next feature work.
  - CRITICAL: Immediate action required — create issue or block pipeline.
</signal-quality-rules>

<authority-rule>
This skill appends to the signal log only. It never modifies existing signals, deletes entries, or edits any other file. The signal log is append-only and committed at session end. Deep analysis happens asynchronously via `domainspec-reflect`.
</authority-rule>
