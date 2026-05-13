# Mode: robot-talks-grill-synthesis

## Intent

Use Robot-Talks tension discovery to produce higher-quality grill questions for complex cross-layer domains.

## Perspective Set

- contract-rigor: checks semantic and contract consistency.
- operational-risk: checks failure, recovery, and governance consequences.
- implementation-friction: checks feasibility and drift risk at execution boundaries.

## Question Formation Pipeline

1. Each perspective produces one evidence-backed finding.
2. Surface explicit tensions between findings.
3. Rank tensions by impact x reversibility x uncertainty.
4. Convert top tension into one grill question card.

## Required Question Card Fields

- question
- tension-source
- evidence-links
- recommended-answer
- unresolved-risk
- patch-target

## Constraints

- Tensions are surfaced, not averaged into consensus.
- Citations are mandatory for load-bearing claims.
- Ask exactly one resulting question at a time.

## Stop Rules

- Stop on pass: no high-severity unresolved tensions.
- Stop on block: unresolved high-severity tension with no acceptable option.
- Stop on flag: only medium/low tensions remain.
