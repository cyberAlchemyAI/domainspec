---
tags:
  - architecture
  - event-system
  - governance
layer: architecture
nature: procedural, technical
status: consolidated
veracidade: high
convicção: high
audience: agent, engineer, tech-lead, new-member
version: 2.3.0
last_updated: 2026-05-19
node_type: constitution
is_session: false

---

## Purpose

The Event System is the platform's **immutable substrate for observability and auditing**.
Every significant system behavior — human action or automation — must leave a verifiable trace in it.

This constitution defines the **obligations, prohibitions, and contracts** that any
component (domain, use case, task, view, service) must respect to participate in the event system.

AI agents and human engineers have the same obligations. This document is the source of truth for both.

---

## Index

1. [Rule 1 — Append-Only and Immutable](#rule-1--the-event-log-is-append-only-and-immutable)
2. [Rule 2 — Registered Event Types Only](#rule-2--only-event-types-registered-in-the-catalog-are-permitted)
3. [Rule 3 — Tier Derived from Catalog](#rule-3--the-tier-is-derived-from-the-catalog)
4. [Rule 4 — Stream Hierarchy](#rule-4--stream-hierarchy-each-lifecycle-has-its-own-stream_id)
5. [Rule 5 — Human vs System Events](#rule-5--human-events-require-actor-system-events-do-not)
6. [Rule 6 — Entity Type Registry](#rule-6--the-entity_type-must-be-a-value-from-the-entity-registry)
7. [Rule 7 — Payload Schema](#rule-7--the-payload-must-follow-the-catalogs-payload_schema)
8. [Rule 8 — Idempotency](#rule-8--idempotency-via-event_key-for-retryable-flows)
9. [Rule 9 — Exception Capture](#rule-9--exceptions-must-be-captured-with-exc)
10. [Rule 10 — Allowed Call Sites](#rule-10--where-log_event_safe-may-be-called)
11. [Rule 11 — Fail-Open](#rule-11--fail-open-log_event_safe-is-the-standard-for-production)
12. [Rule 12 — EventLogEntities](#rule-12--eventlogentities-for-granular-entity-events)
13. [Rule 13 — Deterministic Hashes](#rule-13--entity_id-must-use-deterministic-hashes-for-granular-entities)
14. [Rule 14 — Dictionary Entry Required](#rule-14--every-new-event-type-requires-a-dictionary-eventsmd-entry)
15. [Anti-Patterns](#anti-patterns)
16. [AI Agent Notes](#ai-agent-notes)
17. [Quick Code Review Checklist](#quick-code-review-checklist)
18. [Governance and Evolution](#governance-and-evolution)

---

## Rule 1 — The Event Log Is Append-Only and Immutable

Recorded events are **historical facts**. They must never be edited, updated, or deleted by application code.

**Obligations:**
- No module outside `event_log_service.py` may call
  `EventLog.objects.create()`, `bulk_create()`, `update()`,
  `get_or_create()`, or any ORM write method directly.
- No application code may call `EventLog.objects.filter(...).delete()`.
  The only exception is the `prune_event_logs` command, which removes only
  technical events expired via `expires_at`.
- The Django admin for `EventLog` is **read-only**. Do not enable
  add/change/delete permissions for any reason.

**The only legitimate way to create an event:**
```python
from infrastructure.database.event_log_service import log_event_safe
log_event_safe(stream_id=..., event_type=..., origin=..., ...)
```

> **Why?** `log_event_safe()` centralizes idempotency, automatic description generation,
> TTL policy application, and exception capture. Writing directly to the ORM bypasses all these guarantees.

---

## Rule 2 — Only Event Types Registered in the Catalog Are Permitted

The catalog (`infrastructure/messaging/event_catalog.py`) is the central ontology contract of the system. An event type only exists if it is registered there.

**Obligations:**
- Every `event_type` passed to `log_event_safe()` **must exist**:
  1. In the `EventLog.EventType` enum in `infrastructure/database/models.py`
  2. In the `CATALOG` dictionary in `infrastructure/messaging/event_catalog.py`
- `log_event_safe()` validates this at runtime and raises `KeyError` if the type does not exist.
- The test `test_every_event_type_has_catalog_entry` validates this in CI.
  **A PR that breaks this test must not be approved.**

**To add a new event type — mandatory checklist:**

```
[ ] 1. Add the value to the EventLog.EventType enum in models.py
       Naming convention: <domain>_<past_verb>
       Ex: remessa_user_approved, estoque_file_downloaded

[ ] 2. Add an entry to CATALOG in infrastructure/messaging/event_catalog.py
       Required fields: label, tier, domain, business_weight,
       description_template, payload_schema
       Include a comment explaining: when emitted, who emits it,
       business_weight justified, mandatory payload fields.

[ ] 3. Create a migration for the AlterField of event_type in
       migrations/infrastructure_database/

[ ] 4. Add an entry to docs/vault/dictionary-events.md
       Required fields: prose description, emitted_from (relative path + function),
       triggered_by, aliases_conversation (if any), typed edges.
       event_catalog.py is the source of truth for structural metadata (tier,
       object_type, action, payload_schema) — do not duplicate it in the dict entry.

[ ] 5. Verify that python -m pytest infrastructure/tests/ passes
```

---

## Rule 3 — The Tier Is Derived from the Catalog

The `tier` of an event determines its retention policy:

| Tier | `EventLog.Tier` | Retention | When to use |
|---|---|---|---|
| **business** | `BUSINESS` | Permanent (never deleted) | Human action, financial decision, business entity state |
| **tech** | `TECH` | 15 days (configurable) | Celery infrastructure, operational exception, technical validation |

**Obligations:**
- `tier` and `event_category` **are not passed by callers**.
- `log_event_safe()` resolves both automatically from `event_type` in the catalog.
- Never promote a `tech` event to `business` without updating the catalog.

---

## Rule 4 — Stream Hierarchy: Each Lifecycle Has Its Own `stream_id`

The `stream_id` **is not a global session UUID**. It is the identifier of a
*lifecycle* — a sequence of events with a well-defined start, middle, and end.
Distinct lifecycles receive distinct stream_ids. The link between them is made by
the `parent_event` FK.

### The canonical hierarchy

```
Upload CSV           stream=A  (root: UPLOAD_STARTED)
  └── RemessaBatch   stream=B  (root: REMESSA_IMPORTED, parent_event=UPLOAD_COMPLETED[A])
        └── FilterRun  stream=C  (root: FILTER_RUN_STARTED, parent_event=BATCH_STATUS_CHANGED[B])
```

Each level can be queried independently:
- `EventLog.objects.filter(stream_id=A)` → full timeline of the upload
- `EventLog.objects.filter(stream_id=B)` → full timeline of the batch
- `EventLog.objects.filter(stream_id=C)` → full timeline of the filter run

The causal chain can be traversed via `parent_event` FK to reach any node back to the root.

### Mandatory rules

**Who generates the stream_id:**
- The `stream_id` is generated **once**, at the entry point of the use case / view,
  before any work begins.
- Each new root lifecycle entity generates its own (upload, batch, filter run).
- Celery Tasks **do not generate** `stream_id` — they **receive** it as a string argument:
  ```python
  task.delay(stream_id=str(stream_id), parent_event_id=str(event.id))
  ```

**What receives a stream_id:**
- The generated `stream_id` is saved in the `stream_id` field of the lifecycle's main entity:
  ```python
  upload_file.stream_id = stream_id        # UploadFile ← exists
  remessa_batch.stream_id = stream_id_B   # RemessaBatch ← [PLANNED: Phase 2]
  filter_run.stream_id = stream_id_C      # FilterRun ← [PLANNED: Phase 3]
  ```

**How parent_event passes between layers:**
- `log_event_safe()` returns the created `EventLog` (or `None` if it failed).
- That return value is the `parent_event` for the next event in the chain.
- Tasks re-hydrate via `EventLog.objects.filter(id=parent_event_id).first()`.
- Never pass ORM objects as Celery task arguments — only UUID strings.

**Entities that require a `stream_id` field:**

| Entity | Field | Status |
|---|---|---|
| `UploadFile` | `stream_id = UUIDField()` | ✅ Implemented |
| `RemessaBatch` | `stream_id = UUIDField(null=True)` | ⚠️ [PLANNED: Phase 2] |
| `FilterRun` | `stream_id = UUIDField(null=True)` | ⚠️ [PLANNED: Phase 3] |

> **[PLANNED]** items are not yet in the codebase. Treat them as obligations for the indicated phase, not as currently enforced rules.

### When to create a new stream vs. inherit the existing one

Use the same `stream_id` when events belong to the **same closed-unit lifecycle**
(e.g., TASK_ENQUEUED and TASK_STARTED within an upload).
Create a **new** `stream_id` when the resulting entity has its own independent
lifecycle (e.g., each RemessaBatch generated by an upload).

> **Heuristic rule**: if the entity has its own persisted state and its own `stream_id`
> field in the table, it starts a new stream.

---

## Rule 5 — Human Events Require `actor`. System Events Do Not.

| `origin` | `actor` | Usage |
|---|---|---|
| `Origin.HUMAN` | **Required** (User instance) | Action initiated by a logged-in operator |
| `Origin.SYSTEM` | `None` | Automation: Celery Beat, scheduler, migration |

**Obligations:**
- Never register `origin=HUMAN` with `actor=None`. The event would lose its audit identity — impossible to know who acted.
- Never register `origin=SYSTEM` with an `actor`. The field will be empty and the event correctly classified as automated.
- The `actor` is always `request.user` for view/interface events.
  Never use a technical/bot user as `actor` to mask human action.

---

## Rule 6 — The `entity_type` Must Be a Value from the Entity Registry

The `entity_type` identifies which domain entity the event describes.
It must be one of the strings registered in the table below.

**Registered entity types:**

| `entity_type` | Entity | Domain |
|---|---|---|
| `upload_file` | `UploadFile` | aquisicao |
| `remessa_batch` | `RemessaBatch` | aquisicao |
| `remessa_entry` | `RemessaEntry` | aquisicao |
| `filter_run` | FilterRun (UUID) | aquisicao |
| `filter_result` | FilterResult | aquisicao |
| `contracts_batch` | `BulkImportBatch` | aquisicao |
| `contract` | `ContratoCCB` | aquisicao |
| `document` | `DocumentVersion` | aquisicao |
| `folder` | `DocumentsFolderResult` | aquisicao |
| `estoque_fundo_agregado` | `EstoqueFundoAgregado` | estoque |
| `fundo` | `Fundos` | shared |
| `user` | `auth.User` | system |
| `celery_task` | n/a (task ID string) | infrastructure |
| `scheduled_job` | n/a (job name string) | infrastructure |

When introducing a new business entity, register it in this table **before** emitting events with it.

---

## Rule 7 — The `payload` Must Follow the Catalog's `payload_schema`

The `payload` field is the event's structured JSON. It is the "primary evidence" of what happened — what an analyst or agent will consult to understand the context of an action.

**Obligations:**
- The `payload` must include **all fields declared** in the catalog's `payload_schema`
  for that `event_type`.
- The schema **is not validated at runtime** — it is documentation and contract.
  The responsibility to follow the schema lies with the caller.
- Never log sensitive data in the `payload` — it is visible in the admin, in logs,
  and in audit exports. CPF, password, token: **never in the payload**.
- Monetary values must be logged as **strings** (e.g., `"1234567.89"`),
  never as floats, to avoid precision loss in JSON serialization.

**What breaks when `payload_schema` is violated:**
- Analytics queries that depend on specific field names return `null` or fail silently.
- Agents reading historical events for context receive incomplete or malformed data.
- Audit reports become unreliable for the affected event types.
- There is no runtime safeguard — violations are only discovered when the data is consumed.

---

## Rule 8 — Idempotency Via `event_key` for Retryable Flows

Celery tasks can be retried. A `log_event_safe()` inside a retryable task
can be executed more than once.

**Obligations:**
- Always pass `event_key` in `log_event_safe()` called from inside a Celery task
  or any code that may be executed more than once for the same logical event:
  ```python
  log_event_safe(..., event_key=f'upload_{upload_file.id}_started')
  ```
- The `event_key` must be unique per logical event, not per execution.
  Use combinations of `entity_id + event_type` or `stream_id + event_type`.
- In synchronous (non-retryable) use cases, `event_key` is optional.

---

## Rule 9 — Exceptions Must Be Captured with `exc=`

When logging a failure or exception event, **always** pass the exception instance
to `log_event_safe()` via the `exc=` parameter.

```python
except Exception as exc:
    log_event_safe(
        ...,
        event_type=EventLog.EventType.UPLOAD_FAILED,
        exc=exc,  # ← populates error_type, error_message, stack_trace
    )
```

**Obligations:**
- Never construct `error_type`, `error_message`, or `stack_trace` manually.
  Pass `exc=` and let the service handle it.
- After the failure `log_event_safe()`, re-raise (`raise`) the exception if the flow
  must be interrupted. Do not swallow exceptions just to "log only".

---

## Rule 10 — Where `log_event_safe()` May Be Called

| Layer | Allowed? | Notes |
|---|---|---|
| `use_cases/` | **Yes** ✅ | Primary location. Emitter of business events |
| `tasks/` | **Yes** ✅ | Emitter of tech events (TASK_*) |
| `interfaces/` / views | **Yes** ✅ | For downloads, logins, and direct UI actions |
| `domain/` | **No** ❌ | The inner `/domain` sublayer (calculations, rules, ports) is pure — no IO side effects. Views belong in `interfaces/`, not here. This does not restrict the outer `domains/<name>/` module from having views. |
| `repositories/` | **No** ❌ | Repository translates data, does not record behavior |
| `admin.py` | **No** ❌ | Admin is read-only for events |

---

## Rule 11 — Fail-Open: `log_event_safe()` Is the Standard for Production

Every action should generate an event, but event persistence must never break the business flow.

**`log_event_safe()` is the default in all production code.**

```python
from infrastructure.database.event_log_service import log_event_safe

# Returns EventLog or None. Never raises an exception.
event = log_event_safe(
    stream_id=batch.stream_id,
    event_type=EventLog.EventType.REMESSA_USER_APPROVED,
    ...
)
# Code continues even if event is None.
```

**Use `log_event()` (strict, without safe) only when:**
- You are in a test and want logging failures to be visible
- The absent event would make the operation semantically invalid
  (e.g., an event that is a required `parent_event` for the next step
  and you prefer to fail loudly over creating an orphan event)

**What `log_event_safe()` does on failure:**
- Captures the exception
- Logs at `ERROR` via `logging.getLogger('infrastructure.database.event_log_service')`
- Returns `None`
- **Never re-raises**

**Monitoring:** raise an alert if the ERROR log rate for `event_log_service` increases — it indicates silent persistence failures.

---

## Rule 12 — `EventLogEntities` for Granular Entity Events

`EventLog` and `EventLogEntities` are co-equal event tables. There is **no FK**
between them: they are independent. Hierarchy (document → contract → batch) is
expressed in domain data via deterministic hashes, not in the event tables.

The split is **two-dimensional**, not just macro vs granular:

| | `EventLog` | `EventLogEntities` |
|---|---|---|
| **Granularity** | 1 row per operation (batch, upload) | N rows per operation, 1 per entity |
| **Human actions** | State-changing (approve, reject, override) — require actor | Read/consult (view document) — high-volume, non-state-changing |
| **System events** | Batch lifecycle (scan started, import completed) | Per-entity pipeline (OCR result, fields, cross-check) |

**The deciding question:** does this event **create a state change** (business
decision, financial outcome, lifecycle transition)? If yes → `EventLog`. If it is
a granular observation of a specific entity — whether by the system or a human
reading a page — → `EventLogEntities`.

**When to write an `EventLogEntities` row:**
- Any pipeline step that produces a per-entity outcome (OCR, field validation, cross-check)
- Human read/consult events that are high-volume and non-state-changing (document viewed)
- `DOCUMENT_BULK_IMPORT_APPROVED` — one row per document (`contract_hash`)
- `FILTER_RESULT_RECORDED` — one row per failing installment (`installment_hash`)
- Never write `EventLogEntities` for tech events (`TASK_*`, `EXCEPTION_*`)

```python
EventLogEntities.objects.bulk_create([
    EventLogEntities(
        stream_id=batch.stream_id,
        event_type=EventLog.EventType.DOCUMENT_BULK_IMPORT_APPROVED,
        entity_domain='documents_validation',
        object_type='contract',
        entity_id=contract_hash,  # always use the hash, not the PK
        metadata={'status': 'approved'},
    )
    for contract_hash in affected_hashes
])
```

**Prohibitions:**
- Do not put lists of IDs inside `payload` as a substitute for `EventLogEntities`
- Do not use `EventLogEntities` for tech events (`TASK_*`, `EXCEPTION_*`)
- Use `bulk_create` when recording many entities from the same event (e.g., approval of N contracts). Use `log_entity_event_safe` when recording one entity event at a time inside a sequential pipeline loop where each event has unique metadata computed at different stages.

---

## Rule 13 — `entity_id` Must Use Deterministic Hashes for Granular Entities

The `entity_id` format depends on the entity type:

| `entity_type` | `entity_id` format | Reason |
|---|---|---|
| `remessa_entry` | Hash from `entity_identity.py` | Stable across uploads and tables |
| `remessa_batch` | Hash from `entity_identity.py` | Consistent across processing stages |
| `filter_result` | Hash from `entity_identity.py` | Linked to the installment identity |
| `filter_run` | UUID generated at use case entry | Each run is a unique lifecycle |
| `upload_file` | Django PK (`UploadFile.id`) | Single-table entity with stable PK |
| `user` | Django PK (`auth.User.id`) | Stable system identifier |
| `fundo` | Django PK (`Fundos.id`) | Stable system identifier |
| `celery_task` | Celery task ID string | External system identifier |
| `scheduled_job` | Job name string | External system identifier |

**Why hashes for granular entities?** Auto-increment PKs are not stable across table changes, staging environments, or re-imports. Deterministic hashes allow cross-table and cross-upload traceability without relying on the database internal ID.

**The hash contract lives in** `infrastructure/entity_identity.py`. Use its functions — never compute hashes manually.

---

## Rule 14 — Every New Event Type Requires a `dictionary-events.md` Entry

`event_catalog.py` registers structural metadata. `dictionary-events.md` is the
semantic layer: it documents *why* the event exists, *what triggers it*, and *how
it connects* to other business and system concepts via typed edges.

**Obligations:**
- A new event type **must not be merged** unless a corresponding entry exists in
  `docs/vault/dictionary-events.md`.
- The dict entry **must not duplicate** catalog fields (`tier`, `object_type`,
  `action`, `label`, `template`, `payload_schema`) — `event_catalog.py` is the
  authoritative source for those.
- The dict entry **must include:**

  | Field | Content |
  |---|---|
  | `emitted_from` | Relative path + function/class that calls `log_event_safe()` |
  | `triggered_by` | Use case, service, or actor that causes the event |
  | `aliases_conversation` | Portuguese / colloquial names (if any) |
  | `edges` | Typed vault edges (`produced-by`, `transitions`, `compensates`, …) |

- Entries for `tier: tech` events belong in `dictionary-events.md` under a **Tech
  Events** section (not in `dictionary-sys.md`).

> **Future automation:** once an extraction script for `dictionary-events.md` is
> implemented, step 4 of the Rule 2 checklist will be auto-validated in CI (same
> pattern as the catalog gate in Rule 2). Until then, it is enforced in code review.

---

## Anti-Patterns

The following patterns are **explicitly banned** and must be blocked in code review:

```python
# ❌ 1. Direct ORM write — bypasses all service guarantees
EventLog.objects.create(event_type='upload_started', ...)

# ❌ 2. Unregistered event type — creates uninterpretable events
log_event_safe(event_type='my_custom_event', ...)

# ❌ 3. Controlling taxonomy outside the catalog
log_event_safe(event_type=EventLog.EventType.REMESSA_USER_APPROVED, payload={'tier': 'tech'})

# ❌ 4. stream_id generated inside the task — violates stream hierarchy
@app.task
def process_csv(upload_id):
    stream_id = uuid.uuid4()  # ❌ never here — task receives stream_id as argument

# ❌ 5. Upload's stream_id inherited by the batch — violates stream hierarchy
log_event_safe(
    stream_id=upload_file.stream_id,  # ❌ use batch.stream_id instead
    event_type=EventLog.EventType.REMESSA_IMPORTED,
    ...
)

# ❌ 6. ORM object passed as Celery task argument
process_csv.delay(parent_event=upload_started_event)  # ❌ not serializable
# ✅ correct:
process_csv.delay(parent_event_id=str(upload_started_event.id))

# ❌ 7. Sensitive data in payload
log_event_safe(..., payload={'cpf': '123.456.789-00', 'token': 'abc123'})

# ❌ 8. Actor forced on system event
log_event_safe(..., origin=EventLog.Origin.SYSTEM, actor=bot_user)

# ❌ 9. Monetary values as float in payload
log_event_safe(..., payload={'valor': 1234567.89})  # use str: '1234567.89'
```

---

## AI Agent Notes

- Agents **may not** add a new event type autonomously. A new event type requires human review before merge (Rule 2 checklist).
- Agents **may propose** a new event type by drafting the checklist (Rule 2) with the proposed enum value, catalog entry, and payload_schema. The proposal must be reviewed and approved by a human before execution.
- Agents must use `log_event_safe()` in all generated code — never `log_event()` in production paths.
- When an agent is unsure whether an action's origin is `HUMAN` or `SYSTEM`, it must ask — never guess.

---

## Quick Code Review Checklist

When reviewing a PR that emits events, verify:

- [ ] `log_event_safe()` is the only write point — no direct ORM
- [ ] `event_type` exists in the enum and the catalog
- [ ] Taxonomy (`tier`/`event_category`) comes from the catalog, not from caller parameters
- [ ] `stream_id` generated in the use case/view — never in a task, repository, or domain
- [ ] Root entity has its `stream_id` saved in the table field
- [ ] Batches/FilterRuns have their OWN stream_id, not inherited from the parent
- [ ] `parent_event` passed to tasks as `parent_event_id: str`, re-hydrated inside the task
- [ ] `actor` present if `origin=HUMAN`, absent if `origin=SYSTEM`
- [ ] `entity_type` is a registered value from Rule 6
- [ ] `payload` contains all fields from the catalog's `payload_schema`
- [ ] No sensitive data in `payload`
- [ ] `event_key` present if the code may be executed more than once
- [ ] `exc=` used for any failure/exception event
- [ ] `log_event_safe()` used in all production flows
- [ ] For events with multiple entities: `EventLogEntities.bulk_create()` used (entity-level events never use `payload` lists)
- [ ] `entity_id` uses deterministic hash (via `entity_identity.py`) for granular entities, not auto-increment PK
- [ ] New event type has a corresponding entry in `docs/vault/dictionary-events.md` (Rule 14)

---

## Governance and Evolution

- **New event types**: follow the Rule 2 checklist. A type added to the enum without a catalog entry automatically breaks the CI suite.
- **Removing event types**: **never remove** an `EventType` while historical data with that value exists in the database. Mark as `DEPRECATED` in the catalog and enum. Remove only after data migration.
- **Changing `payload_schema`**: additive changes (new optional fields) are safe. Removing or renaming fields breaks historical events — document the reason before making the change.
- **Changing `tier`**: requires retention impact analysis. If a `tech` event becomes `business`, old records have already been deleted — this is data loss. Discuss before executing.
- **Amendments to this constitution** follow the process in `development-practices-constitution.md`: PR with plan reference, tests, and documented impact.

---

## Document Taxonomy

| Field | Value |
|---|---|
| **type** | `constitution` |
| **domain** | `infrastructure` |
| **objective** | Define the mandatory rules, prohibitions, and contracts governing all usage of the Event System |
| **level** | `architectural` |
| **audience** | `engineer` `tech-lead` `ai-agent` `new-member` |
| **lifecycle_stage** | `active` |

### Tags

`constitution` `event-system` `audit` `append-only` `immutability` `stream-hierarchy` `event-catalog` `governance` `observability`

### Related Documents

| Document | Relationship |
|---|---|
| `development-practices-constitution.md` | Parent — general development principles and amendment process |
| `project_constitutions/constitution_folders_structure.md` | Sibling — folder structure rules |

### Related Code

| File | What it documents |
|---|---|
| `infrastructure/messaging/event_catalog.py` | The ontology catalog referenced in Rule 2 |
| `infrastructure/database/event_log_service.py` | The single writer referenced in Rule 1 |
| `infrastructure/database/models.py` | `EventLog` model, `EventType` enum |
| `infrastructure/entity_identity.py` | Hash computation for entity_id (Rule 13) |

### Version History

| Version | Date | Change |
|---|---|---|
| 2.2.0 | 2026-04-07 | Added Rule 14: every new event type requires a `dictionary-events.md` entry before merging. Added step 4 to Rule 2 checklist. Note: future automation will validate this gate in CI. |
| 2.1.0 | 2026-03-27 | Updated Rule 12: two-dimensional split (granularity + state-change vs observation). Human read events belong in EventLogEntities. See `document-pipeline-events-discovery.md`. |
| 2.0.0 | 2026-03-09 | Translated to English. Made self-contained. Standardized `log_event_safe` as default (Rule 11). Added `entity_id` hash rule as Rule 13. Added Agent Notes. Updated governance reference. Added payload violation consequences (Rule 7). |
| 1.2.0 | 2026-03-03 | Added Rule 12 (EventLogEntities); entity identity note; entity registry updated |
| 1.1.0 | 2026-03-03 | Added stream hierarchy rules (Rule 4), fail-open rule (Rule 11), quick review checklist |
| 1.0.0 | 2026-03-03 | Initial creation |

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [[development-practices-constitution]] | `derives-from` | Amendment process and agent autonomy rules live there |
| [[folder-structure-constitution]] | `cites` | Defines where event_log_service.py, event_catalog.py, and domains live |
| [[system-axioms]] | `derives-from` | AX-SYS-4 (Immutability) and AX-SYS-5 (Observability) are the bedrock constraints |
| [[system-premises]] | `derives-from` | P-SYS-9 (Streams), P-SYS-10 (Fail-Open), and P-SYS-11 (Hashes) shape the rules |
| [[system-premises]] | `derives-from` | P-SYS-6 (Implied Knowledge is Lost Knowledge) motivates the strict catalog contract |
| [[event-system-foundations]] | `derives-from` | Ontology, Digital Twins, and Event Sourcing are the three traditions that shaped the design |
| [event-system (skill)](../../../.claude/skills/custom/event-system.md) | `operationalizes` | Condensed skill for agent execution |
| `vault/foundational-knowledges.md` | `cited-by` | The foundational-knowledges L5 software-architecture layer cites this constitution as the load-bearing async coordination pattern (event-driven architecture). |
