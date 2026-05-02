---
name: implement-filter
description: "Use when implementing a new eligibility filter for remessa processing. Guides creation of the filter class, registry wiring, DB definition, and fund attachment."
---

# Implement a New Eligibility Filter

Step-by-step guide for adding a new `EligibilityFilter` to the system. Filters are stateless business rules that gate remessa approval.

## Prerequisites

Before starting, you need to know:
- **What business rule** the filter enforces
- **What object** it evaluates (`remessa`, `contrato`, or `parcela`)
- **What business concept** it judges (`remessa`, `contrato`, `parcela`, `cnpj_fundo`, `cedente`, `sacado`, `cnpj_ente`)
- **What parameters** funds can configure (e.g., `max_pct`, `max_age_days`)

If any of these are unclear, ask the user before proceeding.

## Checklist

You MUST complete these steps in order:

1. **Understand the rule** — confirm the business logic, inputs, and pass/fail criteria with the user
2. **Write the filter class** — in the appropriate domain's `filters_criteria.py`
3. **Register the filter** — add to `FILTER_REGISTRY` in `shared_services/filter_registry.py`
4. **Create the FilterDefinition** — DB row via migration or Django admin
5. **Write tests** — pure domain tests for the filter logic
6. **Attach to a fund** — create `FundFilterConfig` row (if the user wants it active)

## Step 1: Write the Filter Class

**Location:** `domains/<domain>/domain/filters_criteria.py`

Existing filters live in `domains/aquisicao/domain/filters_criteria.py`. If the filter belongs to a different domain (e.g., liquidacao), create or use that domain's `filters_criteria.py`.

**Template:**

```python
from infrastructure.remessa.filter_registry import EligibilityFilter, FilterOutcome

class YourFilter(EligibilityFilter):
    """One-line description of the business rule.

    Rule: <express the rule as a formula or condition>

    parameters:
        param_name (type): Description. Default: value.

    @biz: EligibilityFilter | type: rule
    """

    object_type = 'remessa'      # 'remessa' | 'contrato' | 'parcela'
    entity_type = 'cnpj_fundo'   # see EntityType choices

    DEFAULT_PARAM = <default_value>

    def run(self, obj, parameters: dict) -> FilterOutcome:
        param = parameters.get('param_name', self.DEFAULT_PARAM)

        # Business logic here — NO database queries, NO side effects.
        # All data must arrive via `obj` or `parameters`.

        if <failure_condition>:
            return FilterOutcome(
                status='fail',
                detail='filter_key: human-readable explanation of why it failed.',
                metadata={<structured data for audit>},
            )

        return FilterOutcome(
            status='pass',
            detail='filter_key: human-readable explanation of why it passed.',
            metadata={<structured data for audit>},
        )
```

**Hard constraints on the filter class:**

- **Stateless** — no instance state; all inputs via `run()`
- **Side-effect free** — no DB writes, no API calls, no file IO
- **Thread-safe** — instantiated once, called from any worker thread
- **Pure domain** — import only from `infrastructure.remessa.filter_registry` (the ABC + FilterOutcome)
- `object_type` and `entity_type` are **class attributes**, not DB columns
- `detail` string must be prefixed with the `filter_key:` for traceability
- `metadata` dict carries structured audit data (numbers, counts, thresholds)

**Valid values:**

| Attribute     | Allowed values |
|---------------|---------------|
| `object_type` | `remessa`, `contrato`, `parcela` |
| `entity_type` | `remessa`, `contrato`, `parcela`, `cnpj_fundo`, `cedente`, `sacado`, `cnpj_ente` |

These are defined in `infrastructure/choices.py` as `ObjectType` and `EntityType` enums.

## Step 2: Register the Filter

**File:** `shared_services/filter_registry.py`

```python
from domains.<domain>.domain.filters_criteria import YourFilter

FILTER_REGISTRY: dict[str, type[EligibilityFilter]] = {
    # ... existing filters ...
    'your_filter_key': YourFilter,
}
```

The `filter_key` string must match the `FilterDefinition.filter_key` in the database exactly.

**Startup validation** (`validate_filter_registry`) will fail fast if:
- `object_type` or `entity_type` is missing from the class
- `object_type` is not in `ObjectType.choices`
- `entity_type` is not in `EntityType.choices`
- `object_type` has no resolver in `OBJECT_RESOLVERS`

## Step 3: Create the FilterDefinition (DB)

Via Django admin or a data migration. Required fields:

| Field               | Description |
|---------------------|-------------|
| `filter_key`        | Must match the key in `FILTER_REGISTRY` |
| `category`          | `'batch_only'` or `'concentration'` |
| `display_name`      | Human-readable name for the UI |
| `description`       | What this filter checks |
| `parameters_schema` | JSON Schema describing configurable parameters |
| `is_implemented`    | Set to `True` |

`FilterDefinition` model is in `infrastructure/database/models.py`.

## Step 4: Write Tests

**Location:** `domains/<domain>/tests/test_filters_criteria.py`

Filters are pure domain logic — test them with **unit tests only**, no DB needed.

```python
from domains.<domain>.domain.filters_criteria import YourFilter
from infrastructure.remessa.filter_registry import FilterOutcome

class TestYourFilter:
    def test_passes_when_within_threshold(self):
        obj = <build a minimal object or use a dataclass stub>
        result = YourFilter().run(obj, {'param': value})
        assert result.status == 'pass'

    def test_fails_when_exceeds_threshold(self):
        obj = <build object that triggers failure>
        result = YourFilter().run(obj, {'param': value})
        assert result.status == 'fail'
        assert 'your_filter_key' in result.detail

    def test_uses_default_when_param_missing(self):
        obj = <build object>
        result = YourFilter().run(obj, {})
        assert result.status == 'pass'  # or whatever the default produces
```

## Step 5: Attach to a Fund (FundFilterConfig)

Create a `FundFilterConfig` row linking the filter to a fund:

| Field          | Description |
|----------------|-------------|
| `cnpj_fundo`   | The fund's CNPJ |
| `filter_def`   | FK to the `FilterDefinition` |
| `filter_mode`  | `'automatic'` or `'manual'` |
| `parameters`   | JSON with fund-specific config values |
| `is_active`    | `True` to enable |