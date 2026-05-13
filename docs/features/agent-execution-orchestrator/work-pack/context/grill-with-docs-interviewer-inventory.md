# Grill-With-Docs Interviewer Inventory (Mode Instance)

## Purpose

Feature-local instance of the reusable interviewer mode system.

This file does not contain a fixed leaked question bank. It defines how questions are formed and answered in-session, one at a time, with immediate spec updates.

## Source Skills

- [.github/skills/domainspec-interview-kits/SKILL.md](../../../../../../../.github/skills/domainspec-interview-kits/SKILL.md)
- [.github/skills/domainspec-interview-kits/MODE-REGISTRY.md](../../../../../../../.github/skills/domainspec-interview-kits/MODE-REGISTRY.md)
- [.github/skills/domainspec-interview-kits/MODES/grill-with-docs.md](../../../../../../../.github/skills/domainspec-interview-kits/MODES/grill-with-docs.md)
- [.github/skills/domainspec-interview-kits/MODES/robot-talks-grill-synthesis.md](../../../../../../../.github/skills/domainspec-interview-kits/MODES/robot-talks-grill-synthesis.md)
- [robot-talks-complete-guide.md](../../../../../../../robot-talks-complete-guide.md)

## Active Session Configuration

- mode: `grill-with-docs`
- robot-talks synthesis: `on`
- cadence: one-question-at-a-time
- patch behavior: immediate spec/doc patch after each answer

## Feature Evidence Inputs

- [SPEC.md](../../SPEC.md)
- [domain.md](../../domain.md)
- [operations.md](../../operations.md)
- [workflows.md](../../workflows.md)
- [rules.md](../../rules.md)
- [interfaces.md](../../interfaces.md)
- [observability.md](../../observability.md)
- [TEST-SPEC.md](../../TEST-SPEC.md)
- [WORK-PACK.md](../../WORK-PACK.md)

## Question Formation Contract

Each emitted question must include:

1. question
2. why-now
3. evidence-links
4. recommended-answer
5. unresolved-risk
6. patch-target

## Robot-Talks Synergy Contract

Before emitting each question, run a lightweight tension pass:

1. contract-rigor perspective
2. operational-risk perspective
3. implementation-friction perspective

Then emit the single highest-value question from the top unresolved tension.

## Decision Snapshot Template

```markdown
### Decision Snapshot: <id>

- Question: <text>
- Selected answer: <option>
- Rejected alternatives: <list>
- Evidence links: <list>
- Patch targets: <list>
- Residual risk: <text>
- Owner: <role>
- Timestamp: <iso-utc>
```

## Exit Criteria

- PASS: no unresolved blocker ambiguity remains.
- FLAG: only non-blocker ambiguity remains.
- BLOCK: any blocker ambiguity remains unresolved.

## Scope

- Apply to C1/C2 feature-contract maintenance and future capability waves.
- Start from the highest-impact unresolved contradiction in current feature docs.
