---
tags: [telemetry, agents, skills, subagents-strategy, research-plan, internal-tools]
node_type: implementation-plan
is_session: false
layer: architecture
nature: procedural
status: draft
version: 0.1.0
last_updated: 2026-05-12
---

# Research Strategy — agents & skills telemetry schema

## Objective

Produce `internal_tools/agents-telemetry/SCHEMA.md` (new) and a revised `README.md` that define exactly what we capture per host (Claude Code, Copilot cloud agent, Copilot CLI), per agent family, per skill — and what we deliberately exclude. **Design only — no code, no hooks, no schema implementation in this pass.**

## Why a fan-out instead of a single pass

Three failure modes drive this design and they need to be checked in *parallel by uncontaminated agents*, not sequentially by one:

1. **Hoarding** — capturing every available field "because we can," ending up with a schema no one queries.
2. **Wishful thinking** — designing for fields that aren't actually observable on a given host (especially Copilot in-IDE chat).
3. **One-size-fits-all** — flattening ~44 Claude agents (with 36 mirrored as Copilot custom agents) + 134 skill files (113 project + 21 user) into a single event shape that loses everything family-specific (a `verifier` emits PASS/FLAG/BLOCK; an `implementer` emits files-changed; a `skill` emits args-and-context).

Running supply (B), demand (C), and typology (A) as three blind branches and intersecting them at synthesis is the discipline that makes the schema honest.

## Scope additions vs README v0.1

The original README scoped Claude Code subagents + Copilot custom agents. This research adds:

- **Skills** (project: 113 SKILL.md files in `.claude/skills/`, user-global: 21 SKILL.md files in `~/.claude/skills/`) — same hook surface (`Skill` tool fires `PreToolUse`), different event subtype, different question set. Claude-only by construction (Copilot has no equivalent primitive).
- Note: the 36 files in `.github/agents/` are mirrors of a subset of the 44 Claude agents (same set, mirrored with VS Code tool grants — see README v0.1 line 20), not distinct agents. A's typology must capture the mirror relationship, including any agents that exist on only one side.
- **In-IDE Copilot Chat verification** — flagged as a deferred empirical test, not folded into this fan-out.

## Pipeline

```yaml
goal: >
  Produce internal_tools/agents-telemetry/SCHEMA.md + revised README that
  define what we capture, per host, per agent family, per skill, and what
  we exclude. No code yet.
total_delegated_agents: 5
phases: 4
parallel_groups: 2          # Phase 1 (A, B, C) and Phase 3 (D, E)
scratch_dir: /tmp/agents-telemetry-research/
```

## Pre-dispatch setup

Before Phase 1 dispatches, the main agent writes `/tmp/agents-telemetry-research/00-context.md` summarizing telemetry purpose, current pain points, and the consumer audiences (us as catalog maintainers; future contributors; automated tuning loops). This file is C's input — without it, C brainstorms in a vacuum.

## Agents

### A — agent-and-skill-catalog-typology

```yaml
phase: 1-research
parallel_with: [B, C]
strategy: >
  Read every file under .claude/agents/, .github/agents/,
  .claude/skills/, and ~/.claude/skills/. For each entry extract:
  name, one-line description, declared tools (when present), and
  declared role family. Group skills and agents into separate
  typologies — they are different primitives and should not share
  a family taxonomy.
objective: >
  Two typologies (agents and skills) with counts per family per host.
  Lets the schema decide which fields are universal vs family-specific.
  Without this, the schema is one-size-fits-all and loses every
  family-specific signal worth capturing.
reason_for_existence: >
  ~210 markdown files across four locations (~44 Claude agents, 36
  Copilot mirrors, 113 project skills, 21 user-global skills).
  Cataloguing in main context burns 200+ file reads we never look at
  again. Read-mostly with structured output — textbook subagent fit.
inputs:
  - .claude/agents/*.agent.md
  - .github/agents/*.agent.md
  - .claude/skills/**/SKILL.md   (and any *.md skill files)
  - ~/.claude/skills/**/SKILL.md
output: /tmp/agents-telemetry-research/A-typology.md
output_shape:
  - agent_families_table              # orchestrator | planner | implementer | discovery-writer | research-writer | findings-writer | spec-writer | test-designer | verifier | auditor | executor | sync-bridge | context-builder | subagents-strategy | extractor | interviewer | …
  - skill_families_table              # workflow | reference | governance | bridge | research | tooling | meta-skill (e.g. dispatching-parallel-agents) | …
  - per_family_signal_hypotheses      # for each family, what signals would be most useful to capture
  - host_x_primitive_matrix           # which primitives exist where (agents in both Claude+Copilot; skills only in Claude)
  - mirror_pairs_table                # Claude agent <-> Copilot mirror, including agents that exist on only one side
```

### B — dispatch-and-invocation-payload-audit

```yaml
phase: 1-research
parallel_with: [A, C]
strategy: >
  Document, per host, exactly what fields are observable at dispatch
  time and what is NOT. For Claude Code: PreToolUse on Task and Skill
  tools — full input JSON shape, parent session id, timestamps. For
  Copilot cloud agent + CLI: lifecycle events from the hooks doc,
  payload per event, where hook scripts run, blocking semantics.
  Explicitly verify whether implicit skill auto-loads (the
  <system-reminder> injection at session start) fire any hook event
  or are invisible to the hook surface — this is a load-bearing
  question for skill telemetry. For Copilot in-IDE chat: mark as
  "unverified — requires empirical test (deferred empirical follow-up,
  separate cycle, not part of this strategy)."
objective: >
  Per-host, per-tool field inventory: what's available for free, what's
  derivable, what's unknowable without changing agent/skill definitions.
  The "supply side" of the schema design.
reason_for_existence: >
  Two hook docs surfaces (Claude Code + Copilot) need careful cross-
  reading. Synthesis must not overpromise on Copilot. The agent doing
  this read MUST be uncontaminated by what we WANT to capture (that's C's
  job), so the supply inventory is honest.
inputs:
  - https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-hooks
  - Claude Code hooks docs (PreToolUse, PostToolUse, Task tool payload, Skill tool payload)
  - .claude/settings.json                # existing PreToolUse pattern as reference
  - .claude/README.md                    # existing hook documentation pattern
  - ../../../docs/architecture.md        # current design hypothesis — what the design assumes is observable; B verifies or refutes
output: /tmp/agents-telemetry-research/B-payload-supply.md
output_shape:
  - per_host_event_table                 # which lifecycle events exist on each host
  - per_host_per_tool_field_table        # available fields per tool per host
  - implicit_skill_load_finding          # answer: do auto-injected skills fire hooks? yes/no/unverified, with evidence
  - deferred_questions_table             # what cannot be answered from docs alone (drives deferred empirical follow-up, separate cycle)
```

### C — consumer-question-catalog

```yaml
phase: 1-research
parallel_with: [A, B]
strategy: >
  Brainstorm and catalog the analytical questions we would want to
  answer from this telemetry, BLIND to A and B. Group by audience
  (us as authors maintaining the catalog; future contributors
  onboarding; automated tuning loops like /domainspec-reflect).
  For each question, list minimum fields needed and time horizon
  (per-event, per-day, per-month). Include a "can never be answered
  — out of scope" column to make exclusions explicit. Cover BOTH
  agent-side and skill-side questions; do not let agents dominate
  just because they were in scope first.

  Do not read any host hook documentation, agent definitions, or skill files. C is the demand side; supply context must not leak in. If a question requires knowing what's observable, file it under `answerable_now?` as 'unknown — supply-side check needed' rather than self-resolving.
objective: >
  A question catalog that drives the schema from the demand side.
  Forces every captured field to map to at least one question, killing
  hoarding at the source.
reason_for_existence: >
  If "what's available" drives the schema, we hoard. If "what we
  want" drives it without supply context, we overreach. Running A/B/C
  in parallel and intersecting at synthesis is the discipline. C MUST
  be uncontaminated by A and B.
inputs:
  - internal_tools/agents-telemetry/README.md     # current intent
  - /tmp/agents-telemetry-research/00-context.md  # main-agent-written framing (telemetry purpose, pain points, audiences)
output: /tmp/agents-telemetry-research/C-questions.md
output_shape:
  - questions_table                       # question | audience | required_fields | horizon | answerable_now? | priority
  - agent_side_questions_subtable
  - skill_side_questions_subtable
  - explicit_out_of_scope_list
```

### Phase 2 — synthesis (NOT delegated)

```yaml
voice: main-agent
reason_for_no_delegation: >
  Schema design is a judgment call: intersect supply (B) with demand (C),
  filter through families (A), pick MVP fields, mark v2 fields, mark
  "captured but not yet used." Delegating produces schema-by-committee.
  Synthesis owns this.
output:
  - internal_tools/agents-telemetry/SCHEMA.md      # new — two event subtypes (dispatch.agent, invocation.skill) sharing one envelope
  - internal_tools/agents-telemetry/README.md      # revised — Mechanism B section rewritten with hook-based plan + IDE-chat caveat; skill scope added; status draft → exploratory
```

### D — gap-critic

```yaml
phase: 3-review
parallel_with: [E]
strategy: >
  Read SCHEMA.md against C's question catalog. For each question, can
  it be answered by the schema as written? Flag every question that
  cannot. Severity: P0 (core question unanswerable) | P1 (degraded
  answer, workaround acceptable) | P2 (workaround easy).

  Also flag any captured field that satisfies a C question but B reports as unobservable on at least one in-scope host. Severity P0 if all hosts unobservable; P1 if some hosts can observe it (schema needs a per-source caveat).
objective: >
  Gap punch-list — questions × schema fields, marking unanswerable
  questions and proposed schema additions.
reason_for_existence: >
  Self-review of own schema misses gaps the author rationalized away.
  Gap-critic has no investment in the current shape.
inputs:
  - internal_tools/agents-telemetry/SCHEMA.md      # synthesis output
  - /tmp/agents-telemetry-research/C-questions.md  # ground truth for "what we want"
  - /tmp/agents-telemetry-research/B-payload-supply.md  # ground truth for per-host observability
output: /tmp/agents-telemetry-research/D-gap-review.md
output_shape: [gap_punch_list, cross_host_observability_gaps]
```

### E — hoarding-critic

```yaml
phase: 3-review
parallel_with: [D]
strategy: >
  Read SCHEMA.md against C's question catalog. For each captured field,
  which question(s) need it? Flag every field that no question needs.
  Default verdict: cut. Override only if there's a documented
  capture-now-query-later reason recorded in SCHEMA.md.
objective: >
  Hoarding punch-list — fields with no consumer question, recommended
  for cut.
reason_for_existence: >
  D and E pull in opposite directions. D adds, E removes. A single
  reviewer would naturally lean one way; the pair forces explicit trade-
  offs that the author has to adjudicate.
inputs:
  - internal_tools/agents-telemetry/SCHEMA.md
  - /tmp/agents-telemetry-research/C-questions.md
output: /tmp/agents-telemetry-research/E-hoarding-review.md
output_shape: [hoarding_punch_list]
```

### Phase 4 — revision (NOT delegated)

```yaml
voice: main-agent
reason_for_no_delegation: >
  Adjudicating D-vs-E (add field vs cut field) is exactly the call that
  needs full context. Delegating creates ambiguity in who owns final
  decisions. Revision stays here. Bump SCHEMA.md v0.1.0 → v0.2.0 on
  any non-cosmetic change.
output:
  - internal_tools/agents-telemetry/SCHEMA.md      # revised in place
  - internal_tools/agents-telemetry/README.md      # final cross-references to SCHEMA.md
```

## Deliberate divergences from the labeling-platform pattern

1. **Replaced "adversarial critic / zero-context reader" with "gap critic / hoarding critic."** The original review pair is calibrated for prose (defend claims, comprehensibility). Schemas have a sharper failure mode: over-capture or under-capture relative to a question set. D and E are calibrated to that failure mode — pulling in opposite directions so the trade-off is explicit, not averaged out.

2. **Added agent C (consumer-question-catalog) as a deliberately blind parallel branch.** The original Phase 1 is "go find truth in docs/code." For schema design, the harder failure mode is "build a schema for what's available rather than what's wanted." C exists to be blind to A and B so synthesis must intersect supply and demand rather than just survey supply.

3. **Skills added as a first-class scope (only on Claude side).** Without this, the design optimizes for ~80 agent files and silently ignores 126 skill files — the larger curation problem.

## Out of scope (explicit)

- **In-IDE Copilot Chat hook coverage.** Deferred empirical follow-up (separate cycle, not part of this strategy) — drop a no-op `.github/hooks/preToolUse.json`, run an IDE chat session, observe. Cannot be answered from docs.
- **Storage backend / retention policy.** Premature for design; revisit after we know what we capture.
- **MCP-injected self-report fallback for Copilot** (the original README v0.1 Mechanism B). Held in reserve — only revisit if the deferred empirical follow-up (separate cycle, not part of this strategy) shows IDE chat doesn't fire hooks AND IDE chat is a meaningful share of dispatches.
- **Code (hook scripts, JSONL writer, query helpers).** Strategy → SCHEMA.md → then implementation in a separate cycle.

## Open questions to resolve before dispatch

1. **Should B's "do implicit skill loads fire hooks?" verification be folded into B (answer from docs only) or split into a Phase-1.5 empirical test?** Recommendation: keep in B as "answer from docs + flag as unverified if docs are silent." If unverified, the deferred empirical follow-up (separate cycle, not part of this strategy) covers it.
2. **5 agents vs 3?** Plausible to fold A and B into one and run a 3-agent Phase 1. Counter: A is read-many-files-extract-tables, B is read-few-docs-deeply — different shapes, combining lets one dominate. Default: keep 5.
3. **Storage/cost as a 4th research agent?** Currently out of scope. Add only if you want the schema to encode retention/cardinality limits from the start.

## Lifecycle

- Dispatch governed by `/domainspec-subagents-strategy` (7-step lifecycle).
- This document is the strategy artifact for that dispatch.
- Phase 1 outputs land under `/tmp/agents-telemetry-research/` (gitignored — scratch only).
- Phase 2 and Phase 4 outputs are committed (`SCHEMA.md`, revised `README.md`).
- After Phase 4 success, this strategy doc transitions `status: draft → consolidated` with a note linking the SCHEMA.md it produced.

## Related

- [../../../README.md](../../../README.md) — telemetry intent doc this strategy will refine.
- [../../../docs/architecture.md](../../../docs/architecture.md) — current design hypothesis this fan-out stress-tests.
- [../README.md](../README.md) — feature-level navigation.
- [../../../../../.claude/agents/](../../../../../.claude/agents/) — Mechanism A target set (Claude side, agents).
- [../../../../../.github/agents/](../../../../../.github/agents/) — Mechanism A target set (Copilot side, agents).
- [../../../../../.claude/skills/](../../../../../.claude/skills/) — newly-in-scope target set (Claude side, skills).
- [../../../../../.claude/skills/custom/frontmatter.md](../../../../../.claude/skills/custom/frontmatter.md) — frontmatter schema this doc follows.
