---
description: Condensed event system rules — how to emit, structure, and govern events
---

# Event System Skill

## The Only Way to Create an Event

```python
from infrastructure.database.event_log_service import log_event_safe
log_event_safe(stream_id=..., event_type=..., origin=..., ...)
```

Never use direct ORM writes. `log_event_safe` handles idempotency, description, TTL, and exceptions.

## Where You Can Call It

| Layer | Allowed? |
|---|---|
| `use_cases/` | Yes — primary location for business events |
| `tasks/` | Yes — tech events (TASK_*) |
| `interfaces/` / views | Yes — downloads, logins, direct UI actions |
| `domain/` | **No** — pure, no IO |
| `repositories/` | **No** — translates data, doesn't record behavior |

## New Event Type Checklist

1. Add value to `EventLog.EventType` enum (`models.py`), naming: `<domain>_<past_verb>`
2. Add entry to `CATALOG` in `event_catalog.py` (label, tier, domain, business_weight, description_template, payload_schema)
3. Create migration for AlterField
4. Add entry to `docs/vault/dictionary-events.md`
5. Verify `pytest infrastructure/tests/` passes

## Stream Hierarchy

Each lifecycle gets its own `stream_id`. Link via `parent_event` FK.

- `stream_id` generated **once** at use case/view entry — never inside tasks
- Tasks receive `stream_id` as string arg, re-hydrate `parent_event` via UUID
- New entity with own lifecycle = new stream_id

## Quick Rules

- **Tiers**: `business` (permanent) vs `tech` (15 days). Derived from catalog, never caller-set.
- **Origin HUMAN** → `actor` required. **Origin SYSTEM** → `actor=None`.
- **Payload**: follow catalog's `payload_schema`. No sensitive data. Monetary values as strings.
- **Idempotency**: use `event_key` in retryable flows (Celery tasks).
- **Exceptions**: always pass `exc=` parameter, never construct error fields manually.
- **EventLogEntities**: use for per-entity granular events (N rows per operation). Use `bulk_create`.
- **entity_id**: use deterministic hashes from `entity_identity.py` for granular entities.

## Escalation — When to Load the Constitution

- If deciding between `EventLog` vs `EventLogEntities` for a new event → read §Rule 12 in `docs/vault/constitution/event-system-constitution.md`
- If registering a new `entity_type` → read §Rule 6 (Entity Type Registry) for the current registry table
- If removing or deprecating an event type → read §Governance and Evolution
- If changing a `payload_schema` (renaming/removing fields) → read §Rule 7 for breaking-change consequences
- If you need to add a new event type not covered by the checklist above → read §Rule 2 for the full obligations
- If you need to amend or question an event system rule → read the full constitution + its `derives-from` premises
