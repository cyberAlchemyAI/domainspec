---
description: Checklist for adding @biz/@sys tags to code
---

# Domain Tagging Code Skill

> Authority: `docs/vault/constitution/domain-tagging-constitution.md`

## When to Tag

- ✅ When you modify a **business-relevant** function, class, or method
- ✅ When you modify a **system-level** symbol that represents a named architectural concern
- ✅ When the symbol passes the `@biz` or `@sys` heuristic below
- ❌ NOT infrastructure code (logging, HTTP clients, framework plumbing)
- ❌ NOT test files or configuration
- ❌ NOT private/underscore-prefixed symbols (`_build_x`, `_step_x`, `_validate_x`…) — tag the public entry point that owns them instead
- ❌ NOT Celery task wrappers (`process_x_upload`, `run_x_task`…) — transport shells; tag the use case class the task delegates to
- ❌ NOT concrete repository classes (`AquisicaoRepository`, `LiquidacaoRepository`…) — ORM plumbing; tag the abstract port (`IAquisicaoRepository`) instead
- ❌ NOT repository helper methods (`bulk_copy_staging`, `remessa_exists`, `get_paginated_x`…) — data-access implementation details
- ❌ NOT exception/error classes (`BulkImportValidationError`…) — error-handling mechanisms; tag the rule or operation that raises them
- ❌ NOT SQL query builder functions (`get_x_sql`, `get_x_metrics_sql`…) — a function returning a SQL string fails both heuristics
- ❌ NOT DataFrame/schema validators (`validate_x_schema`, `validate_x_df`…) — technical pipeline enforcement, not a business rule

**Quick heuristic for `@biz`:** Would someone mention this symbol, or the concept/idea/functionality related to it, in a business conversation? If yes → `@biz`.
**Quick heuristic for `@sys`:** Would an architect put this in a system diagram or ADR? If yes → `@sys`.
**Neither?** → no tag.

**Delegation test:** If this function's entire job is to call another function that IS tagged, don't tag this one — the concept is already captured.

---

## Dictionary Entry — Tag First, Entry Later

A symbol can be tagged before a dictionary entry exists. The tag is the primary record; the dictionary entry is the documentation that follows.

**If the term doesn't exist yet:** tag the code now. The missing entry becomes a coverage gap that the system will surface later.

**If the term exists:** make sure the tag's term matches exactly what's in the dictionary (`@biz` → `dictionary-business.md`, `@sys` → `dictionary-sys.md`).

---

## Tag Format (Required)

Place in the **docstring as the last line**, after the natural language description:

```python
def evaluate_kit_completion(folder_docs: list[dict], active_kits: list["KitType"]) -> KitMatchResult:
    """Evaluate a folder's documents against active KitTypes (OR logic).
    
    A kit is confirmed when all required docs are classified and template-matched.
    
    @biz: KitType | type: rule
    """
```

**Schema:** `@biz: <Term> | type: <type>` or `@sys: <Term> | type: <type>`

| Field  | Required | What it is |
|--------|----------|-----------|
| Prefix | Yes      | `@biz` or `@sys` |
| Term   | Yes      | The concept name — must match dictionary exactly if an entry exists |
| Type   | Yes      | One of 13 taxonomy types (see below) |

---

## Valid Taxonomy Types

### Structural (what exists)
- `entity` — object with unique identity
- `value-object` — immutable, defined by content
- `enum` — fixed finite set

### Behavioral (what happens)
- `operation` — action that changes state
- `query` — read without side effects
- `calculation` — pure function deriving a value
- `rule` — business constraint
- `policy` — decision logic selecting behaviors
- `workflow` — multi-step process

### Connective (how things communicate)
- `interface` — API boundary
- `event` — notification that something happened
- `mapping` — data transformation

### Lifecycle (how things evolve)
- `state-machine` — formal state transitions

---

## Edge Vocabulary

When a dictionary entry has edges, declare them in one direction only (source → target). There are 16 approved edges.

### Base Edges (12)

| Edge | Meaning | Example |
|------|---------|---------|
| `contains` | Entity is composed of | KitType **contains** DocumentTemplate |
| `enforces` | Rule guards operation | EligibilityFilter **enforces** ApproveRemessa |
| `produces` | Operation generates event | UploadRemessa **produces** RemessaApproved |
| `queries` | Query reads from entity | CountRemessas **queries** Remessa |
| `emits` | Entity announces change | Remessa **emits** RemessaStatusChanged |
| `orchestrates` | Workflow coordinates operations | UploadPipeline **orchestrates** Validate |
| `transitions` | Event triggers state change | RemessaApproved **transitions** RemessaStatus |
| `applies` | Policy controls operation | FundStrategy **applies** ApproveRemessa |
| `maps` | Mapping transforms data | KitMatching **maps** DocumentTemplate |
| `performs` | Entity executes operation | Operator **performs** ApproveRemessa |
| `calculates` | Calculation feeds operation | EligibilityScore **calculates** ApproveRemessa |
| `exposes` | Interface makes available | UploadAPI **exposes** UploadRemessa |

### Project-Specific Edges (4)

| Edge | Meaning | Example |
|------|---------|---------|
| `governs` | State/status controls behavior | RemessaStatus **governs** ApproveRemessa |
| `matches` | Identifies or matches against | DocumentHash **matches** DocumentTemplate |
| `implements` | Concrete realizes abstract | RemessaModel **implements** Remessa |
| `derives` | Template generates | ParcelTemplate **derives** Parcela |

### Auto-Inferred Edges

The scanner infers edges automatically when two anchors on the same term have compatible types:

| Type A | Type B | Inferred Edge |
|--------|--------|---------------|
| `entity` | `value-object` | entity **contains** value-object |
| `entity` | `entity` | parent entity **contains** child entity — only when child's lifecycle is subordinate (e.g. installments inside a contract). Skip for cross-domain references. |
| `enum` | `operation` | enum **governs** operation |
| `rule` | `operation` | rule **enforces** operation |
| `query` | `entity` | query **queries** entity |
| `calculation` | `operation` | calculation **calculates** operation |
| `event` | `state-machine` | event **transitions** state-machine |
| `workflow` | `operation` | workflow **orchestrates** operation |
| `interface` | `operation` | interface **exposes** operation |
| `mapping` | `entity` | mapping **maps** entity |

> If you need to add a new edge verb, escalate to `docs/vault/constitution/domain-tagging-constitution.md` §Rule 6.

---

## Code Review Checklist

When tagging code:

- [ ] Symbol passes the `@biz` or `@sys` heuristic (not pure infrastructure)
- [ ] Type is one of the 13 valid taxonomy types
- [ ] Docstring has description above the `@biz`/`@sys` line
- [ ] Tag is the last line of the docstring
- [ ] No tags forced under wrong terms to avoid multi-term problems
- [ ] Edges declared — ask the question for this symbol's type:
  - `interface` → which operation/use case does this view delegate to? → `exposes → <op>` (if that symbol exists in spec)
  - `operation` → what entity does it write or change? → `produces → <entity>` or `transitions → <entity>`
  - `query` → what entity does it read? → `queries → <entity>`
  - `rule` / `policy` → which operation does it guard or control? → `enforces → <op>` / `applies → <op>`
  - `workflow` → which operations does it coordinate? → `orchestrates → <op>`
  - `calculation` → what does it feed into or derive? → `calculates → <target>`
  - `enum` → which operations does this status gate? → `governs → <operation>`
  - `entity` → does it contain child entities or value-objects whose lifecycle depends on it? → `contains → <child>`
  - `value-object` / registry `entity` (standalone lookup table) → no outgoing edges needed; these are leaf nodes

---

## Anti-Patterns (DO NOT DO)

```python
# ❌ Tag as comment, not docstring
# @biz: KitType | type: entity
class KitType(Base): ...

# ❌ Wrong term to avoid multi-term problem
def cross_check_fields():
    """@biz: DocumentTemplate | type: rule"""  # Actually about CrossCheck

# ❌ Tagging infrastructure with @biz (fails business conversation test AND architect test)
def log_event_safe():
    """@biz: EventLog | type: operation"""

# ❌ Invalid taxonomy type
def calculate_fee():
    """@biz: Fee | type: helper"""

# ❌ Tag without description
def approve_remessa():
    """@biz: Remessa | type: operation"""

# ❌ Tagging a private helper instead of the public function that owns it
def _build_aquisicao_staging_installment(row):
    """Build a staging installment row.
    @biz: Remessa | type: operation   # ← wrong; this is an internal step
    """

# ❌ Tagging the Celery task wrapper instead of the use case it delegates to
@app.task
def process_aquisicao_upload(remessa_id: int):
    """Upload the remessa.
    @biz: Remessa | type: operation   # ← wrong; this is the invocation shell
    """
    ProcessUploadAquisicaoUseCase().execute(remessa_id)
# ✅ Correct: tag lives on the use case class, not the task

# ❌ Tagging a concrete repository class
class AquisicaoRepository:
    """ORM-backed repository for aquisição data.
    @biz: Remessa | type: entity   # ← wrong; tag the abstract port instead
    """

# ❌ Tagging an exception class
class BulkImportValidationError(Exception):
    """Raised when bulk import validation fails.
    @biz: BulkImportBatch | type: rule   # ← wrong; tag the rule that raises it
    """

# ❌ Tagging a SQL builder function
def get_aquisicao_metrics_sql() -> str:
    """Return the SQL query for aquisição metrics.
    @biz: Remessa | type: query   # ← wrong; returns a SQL string, not a concept
    """
```