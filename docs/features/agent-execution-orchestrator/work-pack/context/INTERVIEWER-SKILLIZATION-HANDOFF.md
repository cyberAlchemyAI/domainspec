# Interviewer Skillization Handoff

## Intent

Transfer this session into a portable implementation brief for next-session execution of:

- Add a reusable interviewer skill to domainspec-interviewer.
- Support multiple interview types as pluggable skills.
- Use grill-me style as the baseline template.
- Integrate Robot-Talks synergy for multi-perspective question formation.
- Continue current session with live Q/A and spec updates.

## Current State Snapshot

### What is already true

- Target feature exists and is active: [implementation/domainspec/docs/features/agent-execution-orchestrator/SPEC.md](implementation/domainspec/docs/features/agent-execution-orchestrator/SPEC.md)
- Core aspect docs are present: domain, operations, workflows, rules, interfaces, observability, stories, test-spec, work-pack.
- Existing grill file path: [implementation/domainspec/docs/features/agent-execution-orchestrator/work-pack/context/grill-with-docs-interviewer-inventory.md](implementation/domainspec/docs/features/agent-execution-orchestrator/work-pack/context/grill-with-docs-interviewer-inventory.md)
- Robot-Talks references available:
  - [robot-talks-complete-guide.md](robot-talks-complete-guide.md)
  - [implementation/domainspec/vault/discovery/robot-talks-definitions/robot-talks.md](implementation/domainspec/vault/discovery/robot-talks-definitions/robot-talks.md)

### Important observation

- The active grill file currently contains the original generic inventory/preflight content (not the expanded gap-targeted question deck). This should be treated as the baseline to evolve, not as final.

## Process We Executed (Reusable)

1. Loaded mandatory framework constraints first:
   - CHANGELOG
   - ARCHITECTURE index
   - TAXONOMY
   - RELATIONSHIPS
2. Read feature authority set:
   - SPEC + all aspect docs + TEST-SPEC + WORK-PACK
3. Located contradictions and implicit contracts by cross-reading:
   - stage vocabulary mismatch
   - prompt build contract parity gaps
   - evidence timing/format ambiguity
   - cancellation scope ambiguity
   - profile strictness not fully normalized
4. Converted findings into one-question-at-a-time interview prompts:
   - each question includes context, recommendation, and unresolved risk
5. Prepared to run interview live:
   - ask one question
   - wait for answer
   - patch spec immediately
   - record decision snapshot

## Skillization Target (Next Session Build)

## A. New interviewer meta-skill

Create a reusable meta-skill for domainspec-interviewer to orchestrate interview modes:

- Suggested name: domainspec-interview-kits
- Responsibility:
  - detect task/domain
  - select interview mode
  - load mode template
  - run one-question loop
  - enforce evidence-linked question context
  - persist decisions to target docs

## B. Interview mode registry (pluggable)

Create a registry artifact that allows adding interview types without changing the orchestrator logic.

Suggested structure:

- mode id
- mode intent
- applicability signals
- question-formation strategy
- output targets
- stop criteria

Seed modes:

1. grill-with-docs
2. readiness-gate interview
3. audit-gap interview
4. robot-talks tension interview

## C. Question Formation Contract

For every generated question, require:

- Question
- Why now
- Source context links
- Recommended default
- What breaks if unresolved
- Target patch location

## D. Robot-Talks integration

Use Robot-Talks as a question-generation amplifier, not direct implementation.

Pattern:

1. Spawn perspectives for question formation only:
   - contract-rigor perspective
   - operational-risk perspective
   - implementation-friction perspective
2. Surface tensions between perspectives.
3. Convert tensions into discriminating questions.
4. Feed selected question into the single-turn grill loop.

This preserves Robot-Talks doctrine:

- tension discovery, not aggregation
- declared perspective
- evidence-traceable claims

## Proposed File Additions for Skillization

- interviewer mode registry:
  - implementation/domainspec/vault/discovery/interviewer-modes/README.md
  - implementation/domainspec/vault/discovery/interviewer-modes/mode-registry.md
- skill spec:
  - implementation/domainspec/copilot/skills/domainspec-interview-kits/SKILL.md
- templates:
  - implementation/domainspec/templates/interviews/grill-with-docs-question.md
  - implementation/domainspec/templates/interviews/robot-talks-question-synthesis.md
- feature-local instance:
  - extend [implementation/domainspec/docs/features/agent-execution-orchestrator/work-pack/context/grill-with-docs-interviewer-inventory.md](implementation/domainspec/docs/features/agent-execution-orchestrator/work-pack/context/grill-with-docs-interviewer-inventory.md)

## Acceptance Criteria for the New Skill

- Interview mode can be selected by task intent and domain.
- New interview mode can be added by editing registry only.
- Each question is emitted with context + recommendation + risk.
- One-question-at-a-time interaction is enforced.
- Answer immediately maps to deterministic spec patch targets.
- Robot-Talks mode generates tensions that become interview questions.

## Execution Plan (Next Session)

1. Scaffold mode registry and templates.
2. Implement domainspec-interview-kits skill doc.
3. Migrate current grill inventory into mode-compatible format.
4. Add robot-talks question synthesis mode.
5. Run one end-to-end dry run on agent-execution-orchestrator.
6. Validate links and update work-pack references.

## Copy-Paste Bootstrap Prompt for Next Session

Implement a reusable interviewer skill for domainspec-interviewer called domainspec-interview-kits.
It must support pluggable interview types via a registry, start with grill-with-docs as baseline, and add a robot-talks question-synthesis mode that generates tension-driven questions from multiple perspectives.
Use one-question-at-a-time interaction and require every question to include context, recommendation, unresolved risk, and explicit patch target.
Apply the skill to agent-execution-orchestrator and update the grill inventory artifact in-place.

## Live Session Continuation Rule

In this current session, continue with one question at a time and patch spec docs immediately after each answer.
