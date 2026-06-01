---
lens: skill-and-constitution-read
date: 2026-05-26
dispatched_by: writer agent (round 1)
addresses: Lifecycle, sub-skill composition, agent role typing for /research
sources:
  - /Users/victorboscaro/domainspec-theorem/.claude/skills/research/SKILL.md
  - /Users/victorboscaro/domainspec-theorem/.claude/skills/research-validate/SKILL.md
  - /Users/victorboscaro/domainspec-theorem/.claude/skills/research-review/SKILL.md
  - /Users/victorboscaro/domainspec-theorem/.claude/skills/research-promote/SKILL.md
  - /Users/victorboscaro/domainspec-theorem/.claude/agents/research-explorer.md
  - /Users/victorboscaro/domainspec-theorem/.claude/agents/research-skeptic.md
  - /Users/victorboscaro/domainspec-theorem/.claude/agents/research-writer.md
  - /Users/victorboscaro/domainspec-theorem/.claude/agents/research-auditor.md
  - /Users/victorboscaro/domainspec-theorem/.claude/agents/research-validator.md
  - /Users/victorboscaro/domainspec/vault/constitution/research-constitution.md
  - /Users/victorboscaro/domainspec/vault/discovery/subagents-strategy-refinement/principle.md
  - /Users/victorboscaro/domainspec/vault/discovery/subagents-strategy-refinement/role-taxonomy.md
  - /Users/victorboscaro/domainspec/vault/discovery/subagents-strategy-refinement/relation-to-base.md
  - /Users/victorboscaro/domainspec/vault/discovery/subagents-strategy-refinement/decisions-log.md
  - /Users/victorboscaro/domainspec/vault/discovery/subagents-strategy-refinement/research-promote/discovery.md
verification: [local-files-read]
---

# Lens 01 — Reading the Skill and Constitution

Direct read of all five SKILL.md files, all five agent definitions, the research-constitution, and the four sibling discovery files. What follows is the observation set the discovery body summarizes, plus drifts and ambiguities the discovery body softens.

## What the main `SKILL.md` actually says

`/research/SKILL.md` is 64 lines. The lifecycle is a numbered 10-step list (`## Lifecycle (10 steps)`): Collect params, Compose spec, Validate, User gate, Persist spec, Dispatch per composition, Collect per-agent files, Review, Loop or exit, Promote — one sentence each, no duplication of sub-skill or constitution machinery. The forced-parameter table (`goal | success_metric.type | corpus | max_loops | composition`) is the only enumeration of the R18–R20 forced parameters inside the skill itself. Composition DSL is shown verbatim (`L1:explorer(N=3, sonnet) → L2:skeptic(N=2, opus) → L3:writer(parent) → L4:auditor(haiku)`), with per-layer `mode` and seven typed exit reasons listed inline. Agent naming: pool at `theorem/agents-strategy/agent-pool.yaml`, skeptic + auditor in the same dispatch cannot share a name.

## What the three sub-skills do (verbatim observation)

`research-validate` (35 lines): 9-item checklist — load-bearing goal, typed `success_metric.type` + threshold, role ordering, pairwise tension axes (item 4, load-bearing), `difficulty_justification` (R14), `max_loops ≤ 5`, composition parses, per-layer mode well-formed, `corpus` in allowed set. Skip rule: trivial single-explorer. Dispatches `research-validator`.

`research-review` (35 lines): 8-item checklist — every agent has a file, all R12 frontmatter fields present, body ≤200 words, dissent capture (load-bearing for N≥3 zero-dissent layers), `files_created`/`files_modified` exist on disk, writer references ⊆ upstream, closure_mark consistency, writer claims appear in upstream. Same skip rule. Dispatches `research-auditor`.

`research-promote` (40 lines): the only sub-skill that mutates the public corpus. 6 steps — Classify, Compute path, Compose (frontmatter per `research-{corpus}/SCHEMA.md` + body + Referências + Dispatch trail footnote), User gate, Write, optional Memory write. Five anti-patterns enumerated. Sibling [`../research-promote/discovery.md`](../../research-promote/discovery.md) covers depth.

## What the agent definitions do (verbatim)

All five agent files share the shape: `## Do` / `## Do NOT` lists then a mandatory YAML+body output block. Each output schema matches R12 with role-specific extensions (skeptic adds `attack_vector`; auditor and validator add `checklist_items_failed`). The 200-word body cap is implicit in each agent's "≤200 words of notes" instruction. `research-validator` is the only agent whose output omits the per-agent file path under `research/<corpus>/<topic-slug>/agents/` — `agent_id` is hardcoded `validator` and the decision lives in the spec's validator-block per `role-taxonomy.md` §"Why 4+1".

## Drifts observed between SKILL.md and constitution

1. **`/research/SKILL.md` step numbering.** Skill lists 10 steps; constitution refers to "R3 Step 1 / R3 Step 2 / R3 Step 3" (inherited from base). The two numbering schemes coexist — the skill's "Lifecycle (10 steps)" is the operational ordering; the base's "R3 Step N" is the lifecycle-skeleton abstraction. No reader-facing conflict, but worth flagging for the next constitution rev.

2. **`max_loops` vs `loop_cap`.** Skill's forced parameter table uses `max_loops` (research-local name from R20). Base engine uses `loop_cap`. Constitution R20 names both. OQ-loop-bookkeeping in [`research-constitution.md` §13](../../../../constitution/research-constitution.md) flags the unresolved reconciliation. Reader who lands on `/research/SKILL.md` cold may not realize the two names refer to different counters (`max_loops` = whole-dispatch, `loop_cap` = per-layer).

3. **R26 in `research-constitution`.** Carries "Status: Now inherited from base R30" (base [`domainspec-subagents-strategy-constitution.md`](../../../../constitution/domainspec-subagents-strategy-constitution.md) `version: 0.3.0` line 8, R30 line 497) inline but then re-asserts research-local additions (writer-alone, auditor-last). A cold reader cannot quickly tell which parts are inherited. R10 and R21 do this cleanly with a single inheritance-marker paragraph; R24 / R25 / R26 are messier. Filed as OQ-1 in the discovery.

4. **`closure_mark` value-set disagreement.** Promote SKILL.md enumerates frontmatter fields as `profile, node_type, layer, status, version, last_updated, closure_mark, veracidade, convicção`. The corpus `research-bridges/SCHEMA.md` requires a different field set (`name`, `description`, `type`, `external_program`, `status`, `last_updated`, `closure_mark`, `closure_ref`). Sibling sub-discovery's OQ-2 flags this; not re-raised in the parent discovery.

5. **Auditor model default.** Constitution R8 says `haiku`. Decisions-log session note (2026-05-26) flags this may be too cheap for large dispatches. Discovery surfaces this as OQ-2.

## Ambiguities in agent contracts

- **`research-validator` agent name.** Validator agent's `agent_id: validator` is hardcoded; `agent_name` per briefing. But the pool naming rule (skeptic ≠ auditor) does not name the validator. Implicit assumption: validator can share a name with any work-role. Worth explicit declaration in next constitution rev.

- **`research-auditor` writing files to disk.** Auditor's `Do` list says "you may need to read them" re: verified file existence. Implies the auditor may need read access to paths outside `research/<corpus>/<topic-slug>/`. Briefing scope is unspecified.

- **`research-writer`'s `files_modified` field.** Schema requires `files_modified: []`; under `max_loops > 1` re-dispatch it should be populated, but the agent file does not state this. Worth a brief note in the writer definition.

## Underspecified items

- **`success_metric.threshold` parametrization.** R19 names type-specific fields in prose; not in a machine-readable schema. Validator recognizes them by case.
- **`track-readme` node_type.** Listed in SKILL.md classify step; omitted from path table. Sibling sub-discovery OQ-1.
- **Layer indexing in `agents[].layer_id`.** String; no uniqueness/sequencing constraint. Convention `L1`, `L2`, … not enforced.

## Takeaway

The skill + sub-skills + agent defs are internally consistent and load-bearing-rule-conformant. The drifts above are navigability issues (a cold reader has to bounce between SKILL.md and constitution to resolve them) more than correctness issues. The discovery body surfaces the most consequential ones as Open Questions; the rest are minor and worth a future-rev edit but not a v0.2.0 blocker.
