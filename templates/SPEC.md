# {Feature Name}

## Overview

<!-- 1-3 paragraphs: what this feature does from a business perspective, why it exists -->

## Concepts

<!-- List all domain concepts in this feature with their meta-types.
     This table is the SOURCE OF TRUTH for the global registry. -->

| Concept | ID | Type | Description |
|---------|----|------|-------------|
| | {feature}.{Name} | Entity | |
| | {feature}.{Name} | Value Object | |
| | {feature}.{Name} | Operation | |
| | {feature}.{Name} | State Machine | |

## Aspects

<!-- Link only to aspect files that exist for this feature. Delete unused lines. -->

- [Domain](domain.md) — Entities, value objects, enums
- [Operations](operations.md) — Business operations, rules, calculations
- [States](states.md) — State machines and transitions
- [Interfaces](interfaces.md) — API contracts (external + internal)
- [Events](events.md) — Domain events
- [Queries](queries.md) — Read models
- [Workflows](workflows.md) — Multi-step processes
- [Mappings](mappings.md) — Data transformations

## Cross-Feature Dependencies

<!-- Features this one depends on -->

| Depends On | Relationship | Why |
|-----------|-------------|-----|
| | | |

## Produces For

<!-- Features that consume from this one -->

| Consumer | Via | What |
|----------|-----|------|
| | | |
