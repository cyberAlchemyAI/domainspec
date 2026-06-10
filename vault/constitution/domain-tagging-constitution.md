---
tags:
  - ontology
  - ubiquitous-language
  - domain-tagging
  - governance
layer: ontology
nature: procedural, reference
status: draft
version: 0.3.0
last_updated: 2026-04-07
node_type: constitution
is_session: false

---

# Domain Tagging & Dictionary Constitution

> This document defines the mandatory rules for annotating code with `@biz` and
> `@sys` tags, maintaining the dictionary entries that support them, and
> structuring the dictionaries so they can be parsed by the extraction pipeline.
> It is the enforceable counterpart to `domain-tagging-discovery.md` (the *why*)
> and `discovery-extraction-pipeline.md` (the *how*). This document defines the
> *must*.

---

## Objective

This constitution governs the **bridge between domain vocabulary and code**.
It answers two questions:
1. *"When I touch a domain-relevant symbol, what am I obligated to do so that
   the domain graph stays accurate and navigable?"*
2. *"When I add or edit a dictionary term, what structure must I follow so the
   extraction pipeline can parse it?"*

It defines obligations for tagging code, structuring dictionary entries,
writing taxonomy metadata, and keeping the generated registry consistent.

---

## Index

1. [Rule 1 — Every Domain Symbol Must Carry a Tag](#rule-1--every-domain-symbol-must-carry-a-tag)
2. [Rule 2 — Tags Live Inside Docstrings](#rule-2--tags-live-inside-docstrings)
3. [Rule 3 — The Tag Schema Is Two Fields](#rule-3--the-tag-schema-is-two-fields)
4. [Rule 4 — Tags Come First; Dictionary Entries Follow](#rule-4--tags-come-first-dictionary-entries-follow)
5. [Rule 5 — The Type Must Be a Valid Taxonomy Type](#rule-5--the-type-must-be-a-valid-taxonomy-type)
6. [Rule 6 — Edge Vocabulary](#rule-6--edge-vocabulary)
7. [Rule 7 — Edges Are One-Directional](#rule-7--edges-are-one-directional)
8. [Rule 8 — Dictionary Entry Schema](#rule-8--dictionary-entry-schema)
9. [Rule 9 — Dictionary Structure](#rule-9--dictionary-structure)
10. [Rule 10 — Missing Terms Are Coverage Gaps, Not Blockers](#rule-10--missing-terms-are-coverage-gaps-not-blockers)
11. [Rule 11 — Tag on Edit](#rule-11--tag-on-edit)
12. [Rule 12 — Automated Enforcement](#rule-12--automated-enforcement)
13. [Anti-Patterns](#anti-patterns)
14. [AI Agent Notes](#ai-agent-notes)
15. [Quick Code Review Checklist](#quick-code-review-checklist)
16. [Governance and Evolution](#governance-and-evolution)

---

## Rule 1 — Every Domain Symbol Must Carry a Tag

A "domain symbol" is any class, function, or method that passes either heuristic below. Dictionary membership is not required — the heuristics are the gate.

**Heuristics:**
- **`@biz`:** Would someone mention this symbol, or the concept/idea/functionality related to it, in a business conversation? (e.g., "the cross-check failed", "check the kit_type count") → `@biz`
- **`@sys`:** Would an architect put this in a system diagram or ADR? (e.g., a named extraction strategy, an integration point, a non-obvious algorithmic decision) → `@sys`
- **Neither?** → no tag.

**What does NOT get tagged:**

- Infrastructure utilities not in the system dictionary (logging wrappers, HTTP clients)
- Framework plumbing (Django admin, URL routing, middleware)
- Configuration and constants (unless they represent a business enum)
- Test files

| Tagged | Not tagged |
|--------|-----------|
| `EligibilityFilter` (business rule) | `BaseRepository` (framework plumbing) |
| `FilterResult` (business enum) | `celery_app.task` (task decorator) |
| `evaluate_kit_completion` (domain logic) | `serialize_response()` (serialization) |
| `cross_check_fields` (domain rule) | Django admin classes |
| `log_event_safe` (system dictionary term) | `requests.get()` (HTTP client) |


---

## Rule 2 — Tags Live Inside Docstrings

The `@biz` tag is placed as the **last line** inside the Python docstring,
after the natural language description. It is not a comment above the symbol.

```python
def evaluate_kit_completion(
    folder_docs: list[dict],
    active_kits: list["KitType"],
) -> KitMatchResult:
    """Evaluate a folder's documents against active KitTypes (OR logic).

    A kit is confirmed when all required docs are classified and
    template-matched in the folder.

    @biz: KitType | type: rule
    """
```

**Why docstrings, not comments:**

- A docstring is syntactically bound to its symbol — it cannot drift.
- The developer already writes (or should write) a docstring. Adding `@biz`
  is one line of near-zero friction.
- Docstrings are accessible via `help()`, IDE tooltips, and documentation
  generators. The tag inherits all of this for free.

**If the symbol has no docstring:** add one. The `@biz` tag requires a
docstring to exist. This is intentional — it creates positive pressure to
document business code.

---

## Rule 3 — The Tag Schema Is Two Fields

The format is:

```
@biz: <Term> | type: <type>
@sys: <Term> | type: <type>
```

| Field    | Required | What it is |
|----------|----------|------------|
| `prefix` | always   | `@biz` for business concepts, `@sys` for system concepts |
| `Term`   | always   | The dictionary concept this symbol belongs to |
| `type`   | always   | The taxonomic classification from the domainspec taxonomy |

Two fields after the prefix. Nothing else. No file paths, no table names, no
event names. If metadata is derivable from the code itself (e.g.,
`__tablename__`), it does not go in the tag.

The pipe-delimited format is extensible — if a third field becomes necessary,
it can be appended without breaking existing tags.

---

## Rule 4 — Tags Come First; Dictionary Entries Follow

A symbol can be tagged before a dictionary entry exists. The tag is the primary record — it establishes that a concept exists at a code location. The dictionary entry is the documentation that may follow.

**When a dictionary entry exists**, the `Term` in the tag must match exactly:
- `@biz` tags → the canonical business vocabulary (dictionary artifact not yet implemented; canonical vocabulary currently lives in `docs/registry.md` + `docs/glossary.md` + per-feature `docs/features/*/SPEC.md`)
- `@sys` tags → the canonical system vocabulary (dictionary artifact not yet implemented; canonical vocabulary currently lives in `docs/registry.md` + `docs/glossary.md` + per-feature `docs/features/*/SPEC.md`)

**When no entry exists**, tag the code. The missing entry becomes a coverage gap surfaced by the pipeline's coverage report (see Rule 12). This is by design — it enables incremental rollout without blocking tagging on documentation.

**The dictionary is the authority on meaning. The tag is the authority on location.** These are complementary — neither is a prerequisite for the other.

**The dictionary is a superset of taggable concepts.** Not every dictionary term
will have tags in the code. Some concepts are purely conceptual (e.g.,
`Direitos Creditórios` as the abstract asset) or exist only at the field level
(e.g., `cnpj_fundo`, `cpf_cnpj_sacado`). These terms are marked `Unanchorable: true` in the
dictionary (see Rule 8) and are not expected to have code tags. This is by
design — the extraction pipeline's coverage report distinguishes "unanchorable
by design" from "should be tagged but isn't yet".

---

## Rule 5 — The Type Must Be a Valid Taxonomy Type

The `type` field must be one of the 13 domainspec taxonomy types:

### Structural — What things exist

| Type | Definition |
|------|-----------|
| `entity` | Object with unique identity that persists over time |
| `value-object` | Immutable concept defined entirely by its content, no identity |
| `enum` | Fixed, finite set of named values |

### Behavioral — What happens

| Type | Definition |
|------|-----------|
| `operation` | Business action that changes state |
| `query` | Read that returns data without side effects |
| `calculation` | Pure function that derives a value from inputs |
| `rule` | Business constraint that must hold for an operation to proceed |
| `policy` | Decision logic that selects between behaviors at runtime |
| `workflow` | Multi-step process coordinating multiple operations |

### Connective — How things communicate

| Type | Definition |
|------|-----------|
| `interface` | API boundary exposing operations and queries |
| `event` | Notification that something happened |
| `mapping` | Field-by-field data transformation between two shapes |

### Lifecycle — How things evolve

| Type | Definition |
|------|-----------|
| `state-machine` | Formal specification of how an entity moves through states |

**A single dictionary term can have multiple types across different symbols.**
For example, `FilterResult` is an `enum` (the `FilterResult` TextChoices) and
a `value-object` (the `FilterOutcome` dataclass). The type belongs to the
*symbol*, not the *term*.

---

## Rule 6 — Edge Vocabulary

Edges declared in dictionary entries must use verbs from the approved
vocabulary. There are 12 forward edges and 12 inverse forms.

### Forward edges (A → B)

| Edge           | Connects                    | Answers                               |
| -------------- | --------------------------- | ------------------------------------- |
| `performs`     | Entity → Operation          | What can this actor do?               |
| `produces`     | Operation → Event           | What happens after this runs?         |
| `enforces`     | Rule → Operation            | What must hold for this to proceed?   |
| `calculates`   | Calculation → Operation     | What values does this derive?         |
| `transitions`  | Event → State Machine       | What state changes does this trigger? |
| `exposes`      | Interface → Operation/Query | What does this API surface?           |
| `orchestrates` | Workflow → Operation[]      | What steps does this coordinate?      |
| `applies`      | Policy → Operation          | What strategies govern this?          |
| `maps`         | Mapping → Entity/Interface  | What transformations exist here?      |
| `contains`     | Entity → Value Object       | What value types does this embed?     |
| `queries`      | Query → Entity              | What data does this read?             |
| `emits`        | Entity → Event              | What events does this announce?       |

### Additional edges

These edges were introduced by practice. They are valid.

| Edge         | Meaning                                                                       |
| ------------ | ----------------------------------------------------------------------------- |
| `governs`    | A state or status controls the behavior of another entity                     |
| `matches`    | A term identifies or matches against another                                  |
| `implements` | A concrete entity is the realization of an abstract concept                   |
| `derives`    | A template or definition from which another term is generated or instantiated |

---

## Rule 7 — Edges Are One-Directional

Declare edges in one direction only — from the source term to the target. Do not declare inverse forms.

**Example:**
- **EligibilityFilter** declares: `enforces` → Remessa
- **Remessa** does not declare `enforced-by` ← EligibilityFilter

---

## Rule 8 — Dictionary Entry Schema

Every dictionary entry must follow a structured format so the extraction
pipeline can parse it. The fields below use Markdown bullet points as
inline metadata (a "mini-frontmatter" within each term).

### Required fields

Every term **must** have these. The dictionary linter blocks commits if any
are missing.

| Field | Format | Example |
|-------|--------|---------|
| **Description** | Prose paragraph(s) immediately after the H3 heading | _"A stateless, side-effect-free business rule that..."_ |
| **Code equivalent:** | Primary code symbol name, or `—` if none | `- **Code equivalent:** \`EligibilityFilter\`` |

> **Removed field:** `Taxonomy type:` was removed from dictionary entries (v0.3.0 decision). Taxonomy type lives only on code tags (`@biz: Term | type: rule`), not on dictionary terms. A concept like KitType has anchors of type entity, rule, query — the concept itself has no single type. The extractor ignores `Taxonomy type:` bullets if encountered.

### Optional fields

These are recommended but the linter does not block on their absence.

| Field | Format | Example |
|-------|--------|---------|
| **Aliases in codebase:** | Comma-separated identifiers | `eligibility_criteria, filter_criteria` |
| **Aliases in conversation:** | Comma-separated natural language names | `filtro de elegibilidade, filter gate` |
| **Edges:** | Typed relationships using the edge vocabulary (see Rule 6) | `enforces → Remessa, produces → FilterResult` |
| **Distinct from:** | Terms this concept is explicitly not | `Distinct from: FilterResult` |
| **Unanchorable:** | `true` if this term has no taggable code symbol | `- **Unanchorable:** \`true\`` |
| **See also:** | Cross-references to related terms or documents | `See also: CrossCheck` |

### Unanchorable terms

Some dictionary terms represent abstract concepts, value-objects at the field
level, or financial concepts with no direct code representation. These will
never have `@biz`/`@sys` tags because there is no taggable symbol to attach
them to.

Mark these terms with `Unanchorable: true`. This tells the extraction pipeline
to classify them as "unanchored by design" rather than "missing tags" in the
coverage report.

Examples of unanchorable terms:
- **Direitos Creditórios** — abstract financial concept
- **FIDC** — fund-level concept broader than any single model
- **Sacado**, **Cedente** — column values, not classes or functions
- **cnpj_fundo**, **cpf_cnpj_sacado** — field-level value-objects

If a term has `Unanchorable: true`, it should have `Code equivalent: —` or
omit the field entirely.

### Example entry

```markdown
### EligibilityFilter

A stateless, side-effect-free business rule that determines whether a remessa
or its installments may pass a specific eligibility check for a given fund.
Each filter is a subclass of the abstract EligibilityFilter base class.

- **Code equivalent:** `EligibilityFilter`
- **Aliases in codebase:** `eligibility_criteria`, `filter_criteria`
- **Aliases in conversation:** `filtro de elegibilidade`, `filter gate`
- **Edges:** `enforces` → Remessa, `produces` → FilterResult
- **Distinct from:** FilterResult — the outcome of applying a filter, not the filter itself
```

---

## Rule 9 — Dictionary Structure

The dictionaries use Markdown heading levels as structural markers. The
extraction pipeline depends on this structure to parse terms correctly.

- **H1** (`#`) — document title (one per file)
- **H2** (`##`) — category section (groups related terms by domain or concern)
- **H3** (`###`) — term name (one per dictionary entry)

**Terms are always H3 headings.** No other heading level is valid for terms.
Using H4 or other levels for terms will cause the extractor to miss them.

**H2 categories** organize terms by domain (e.g., "Core / Shared",
"Aquisição", "Documents & OCR"). The extractor records the H2 section as the
term's `category` field.

---

## Rule 10 — Missing Terms Are Coverage Gaps, Not Blockers

If a developer encounters a function that resists tagging under existing dictionary terms, this is a signal that the dictionary is missing a concept. The tag can still be written — the missing entry becomes a coverage gap surfaced by the pipeline.

**The process:**

1. Do not force the tag under a wrong term.
2. Identify what concept the function actually represents.
3. Tag the function with the new term name.
4. The pipeline will report this tag as an unresolved term. Create the dictionary entry when capacity allows.

**Many apparent multi-term problems are actually missing vocabulary.** When a function seems to belong to two terms, the right answer is often to recognize it as its own concept. Example: `cross_check_fields` seemed to sit between `ContratoCCB` and `Parcela`, but it was actually its own concept — `CrossCheck` was added to the dictionary and the tagging became clean.

---

## Rule 11 — Tag on Edit

Tags are added **when a developer touches a business-relevant or system-relevant file**, not through a big-bang backfill. The most-edited files get tagged first naturally.

**Obligation:** when you modify a function that has no tag, apply the two heuristics. If it passes either test (`@biz` or `@sys`), add the tag. This is part of the edit, not a separate task.

**Exception:** if the function resists tagging (multi-term, unclear concept),
flag it. Do not add a wrong tag just to satisfy this rule.

---

## Rule 12 — Automated Enforcement

The extraction pipeline (`internal_tools/semantic_index/`) automatically enforces several
rules from this constitution. These checks run in the pre-commit hook
(offline, no network) and in CI (authoritative).

| Rule | What the pipeline checks | When |
|------|-------------------------|------|
| Rule 4 | Tags referencing a term that exists in the dictionary must match it exactly. Tags with no dictionary entry are reported as coverage gaps — they do not block the commit. | Pre-commit hook + CI |
| Rule 5 | Every tag type is one of the 13 valid taxonomy types. Invalid types produce an error. | Pre-commit hook + CI |
| Rule 8 | Dictionary terms have required fields (description, code equivalent). Missing fields block the commit. | Pre-commit hook (linter) |
| Rule 9 | Dictionary terms are H3 headings. Structural violations block the commit. | Pre-commit hook (linter) |

The pre-commit hook is a convenience — fast and local. CI re-runs the full
pipeline on push and is the authoritative gate. If the hook was skipped via
`--no-verify`, CI catches the violation and the build fails.

**What is NOT enforced automatically (human review only):**
- Rule 1 — whether a business symbol is missing a tag (requires human judgment)
- Rule 7 — whether edges are declared on both sides (linter may add this later)
- Rule 10 — whether a missing term has been added to the dictionary (surfaced as a coverage gap, not enforced)
- Rule 11 — whether the developer tagged on edit
- Rule 6 — whether edge verbs are from the approved vocabulary (linter v2)

---

## Anti-Patterns

The following patterns are **explicitly banned** and must be caught in review:

```python
# ❌ 1. Tag as a comment, not in the docstring
# @biz: KitType | type: entity     ← drifts when code is reordered
class KitType(Base):
    ...

# ❌ 2. Tagging code that passes neither heuristic (not a business concept, not an architect-level system concern)
def format_date_string(dt):
    """@biz: DateFormatter | type: operation"""   ← pure utility, fails both tests

# ❌ 3. Wrong term to avoid dealing with multi-term problem
def cross_check_fields(...):
    """@biz: DocumentTemplate | type: rule"""   ← function is about CrossCheck, not DocumentTemplate

# ❌ 4. Wrong prefix — log_event_safe is a @sys term, not @biz
def log_event_safe(...):
    """@biz: EventLog | type: operation"""   ← should be @sys, not @biz

# ❌ 5. Inventing types outside the taxonomy
def calculate_fee(...):
    """@biz: Fee | type: helper"""   ← 'helper' is not a taxonomy type

# ❌ 6. Tag without a docstring description
def approve_remessa(...):
    """@biz: Remessa | type: operation"""   ← no description of what the function does
```

---

## AI Agent Notes

- Agents **must** check for `@biz` tags when navigating business code. The tag
  is the fastest path to understanding what a symbol means in the domain.
- Agents **may** add `@biz` tags autonomously when editing business-relevant
  code, following all rules in this constitution.
- Agents **may** tag a symbol even if no dictionary entry exists — the missing entry becomes a coverage gap, not a blocker. If an entry exists, the term must match exactly.
- Agents **must not** tag pure infrastructure code (utilities, logging wiring, framework plumbing that fail both heuristics). System-level code that passes the architect diagram/ADR test should use `@sys`.
- When a tag resists clean assignment, agents **must** flag it to the user
  rather than forcing a wrong term.

---

## Quick Code Review Checklist

When reviewing a PR that touches business-relevant code:

- [ ] Every business symbol has a `@biz` tag in its docstring
- [ ] Every named system concern (passes architect diagram/ADR test) has a `@sys` tag
- [ ] If the `Term` exists in a dictionary, it matches exactly; if not, the coverage gap is acknowledged
- [ ] The `type` is a valid taxonomy type from the 13-type catalog
- [ ] The docstring has a natural language description above the `@biz`/`@sys` line
- [ ] No pure infrastructure tagged (utilities, logging, framework plumbing that fail both heuristics)
- [ ] If a new term was created in the dictionary, it has: definition, code
      equivalent, aliases, "distinct from", and edges
- [ ] Edges on new dictionary entries are declared in one direction only (source → target)
- [ ] No tags forced under wrong terms to avoid multi-term problems

---

## Governance and Evolution

- **Amendment process:** follows the process in `development-practices-constitution.md`.
  PR with documented impact. Semantic versioning: MAJOR for removing/redefining
  rules, MINOR for adding rules, PATCH for clarifications.
- **Taxonomy changes:** adding a new type to the 13-type catalog requires a
  discovery document justifying why the existing types are insufficient.
  Removing a type requires migration of all existing tags.
- **Edge catalog changes:** same process as taxonomy. New edges must be
  justified by a relationship pattern that existing edges cannot express.
  Inverse forms for approved edges do not require a separate discovery.
- **Dictionary format changes:** changes to the mandatory fields of a
  dictionary entry (e.g., adding a new required field) require updating all
  existing entries in the same PR.

---

### Version History

| Version | Date | Change |
|---------|------|--------|
| 0.3.0 | 2026-04-07 | Restructured rule order: Edge Vocabulary moved to Rule 6 (after taxonomy types). Merged old Rule 10 (Infrastructure) into Rule 1. Renumbered all rules. Fixed anti-pattern example 4 (wrong prefix, not untaggable). |
| 0.2.0 | 2026-04-07 | Added `@sys` support, dictionary entry schema (Rule 6), dictionary structure (Rule 11), edge vocabulary with inverses (Rule 12), automated enforcement (Rule 13). Renamed to "Domain Tagging & Dictionary Constitution". |
| 0.1.0 | 2026-04-06 | Initial draft. Extracted enforceable rules from `domain-tagging-discovery.md`. |

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `specs/ontology/docs/domain-tagging/domain-tagging-discovery.md` | `derives-from` | The discovery that designed the tagging system — this constitution enforces it |
| `specs/ontology/docs/data-foundations/discovery-extraction-pipeline.md` | `governs` | The pipeline implements automated enforcement of Rules 4, 5, 8, 9 |
| business dictionary (not yet implemented; canonical vocabulary currently in `docs/registry.md` + `docs/glossary.md` + per-feature `docs/features/*/SPEC.md`) | `governs` | Must follow Rule 8 (entry schema), Rule 7 (redundant edges), Rule 9 (H2/H3 structure), Rule 6 (edge vocabulary) |
| system dictionary (not yet implemented; canonical vocabulary currently in `docs/registry.md` + `docs/glossary.md` + per-feature `docs/features/*/SPEC.md`) | `governs` | Same obligations as the business dictionary |
| `vault/constitution/development-practices-constitution.md` | `derives-from` | Amendment process and agent autonomy rules |
| `vault/ontology-conventions.md` | `aligns-with` | Frontmatter schema and classification system |
| `specs/ontology/discovery-vault-code-bridge.md` | `extends` | This constitution governs the code→domain side (Side B) of the vault-code bridge |
| [[domainspec-axioms]] | `cited-by` | AX-DS-2 (one vocabulary across spec and code) cites this constitution as the declared `@biz` anchor contract; current enforcement gap is tracked as P-DS-13 in `domainspec-premises.md`. |
