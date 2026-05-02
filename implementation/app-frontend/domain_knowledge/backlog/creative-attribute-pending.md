---
tags: [creatives, attributes, trama]
node_type: backlog
is_session: false
layer: domain
nature: reference
status: draft
version: 0.1.2
last_updated: 2026-04-22
---

# Backlog — Creative Attribute Schema Pending Work

## Objective

Pending work items against the ratified [[constitution/creative-attribute-constitution]]. Each item names a schema change that is either already decided (but unimplemented), or blocked on a discovery / constitution amendment. Answers: *"Which attribute-schema changes are queued, what triggers each one, and which downstream systems will have to move with it?"*

Items here are **prioritized and schedulable**, not epistemic uncertainty — for open questions that still require investigation, see the corresponding `discovery/` nodes.

---

## Evaluation criteria

Every proposed schema change must declare (from item B-CRT-ATTR-9 onward):

- **Orthogonality** — does the new field carry information that existing fields do not?
- **Mapping method** — how is the field's value produced for a given creative?
- **Unit cost** — trivial / low / medium / high per creative, and who pays it (automated / human).
- **Signal value** — what analyses does the field unlock, and at what granularity (within-sibling vs. cross-creative)?

A highly orthogonal field with prohibitive mapping cost produces a **ghost field**: declared in schema, empty in 90% of rows, misleading as a feature. Items B-CRT-ATTR-1 through B-CRT-ATTR-8 pre-date this criterion and do not declare mapping cost explicitly; a future pass should normalize them.

---

## Status key

| Status | Meaning |
|---|---|
| `ready` | Decision is made; blocked only on implementation capacity |
| `blocked` | Depends on another open item (discovery, premise, data) |
| `future` | Deferred until an observable trigger fires |

---

## Items

### B-CRT-ATTR-1 — Add `parent_creative_ids` field
`priority: high` · `status: blocked` · `blocks: TRAMA first production run`

Ratified in principle by [[premise/creative-premises#p-crt-14--every-automatically-generated-creative-must-carry-complete-lineage]]. Not yet in the constitution's enforced schema — see [[constitution/creative-attribute-constitution#open-points]] (last item).

**Shape.** `parent_creative_ids: []` on the Criativo object; nullable for hand-produced creatives; required non-empty for auto-generated ones. Sibling record in a new `generation_runs` table describes the agent-run metadata (prompts, references, template resolution).

**Trigger.** TRAMA producing its first creative. Must land before.

**Downstream.** CapoMastro registration API, attribute-constitution ratification, `Is TRAMA` provenance moves from campaign-name proxy to creative-level field.

---

### B-CRT-ATTR-2 — Multi-product creatives
`priority: medium` · `status: future`

Current schema rejects them. [[constitution/creative-attribute-constitution#01-produto]] accepts exactly one value per creative.

**Shape.** `Produto` becomes an array. Attribution logic must split revenue across SKUs (today: one-order → one-SKU path).

**Trigger.** A multi-product creative pattern becomes common enough that modeling it as "N creatives" is clearly wrong (e.g., a lookbook creative that sells four products jointly).

**Downstream.** Attribution pipeline (`insider_revenue_attribution`), winning-creative Estoque criterion (per-SKU uplift calculation), CapoMastro UI.

---

### B-CRT-ATTR-3 — Multi-audience creatives
`priority: low` · `status: future`

Same pattern as B-CRT-ATTR-2; [[constitution/creative-attribute-constitution#03-audi%C3%AAncia]] accepts exactly one value.

**Trigger.** Cross-audience creatives become common (unlikely under current FEM/MASC structure; possible under pain-point segmentation — see [[discovery/segmentation-dores-do-cliente]]).

**Downstream.** Reporting segmentation, Meta campaign-structure assumptions.

---

### B-CRT-ATTR-4 — `Audiência` value catalog overhaul
`priority: medium` · `status: blocked` · `blocks: on [[discovery/segmentation-dores-do-cliente]]`

If the segmentation discovery resolves toward pain-point segmentation, the current `{masc, fem, promo, promo2}` catalog retires. All existing creatives require re-labeling or a dual schema during transition.

**Trigger.** Decision on [[discovery/segmentation-dores-do-cliente]].

**Downstream.** CapoMastro existing rows, Meta campaign naming convention, every dashboard that filters by audience.

---

### B-CRT-ATTR-5 — Deterministic template→content-blocks resolution
`priority: medium` · `status: ready`

Today Claude Code mediates the template → content-blocks lookup. Should be a deterministic registry lookup for reproducibility. See [[constitution/creative-attribute-constitution#open-points]] item 4.

**Shape.** A template registry table with explicit `template_id → required_content_blocks[]` mapping.

**Trigger.** Capacity to migrate; no external blocker.

**Downstream.** Template registry service, CapoMastro registration flow.

---

### B-CRT-ATTR-6 — Input Reference cardinality ≥ 1
`priority: low` · `status: ready`

Today: exactly one reference per template. [[constitution/creative-attribute-constitution#08-input-references]] notes this is an operational cap, not a conceptual one.

**Shape.** Allow multiple references with typed roles (e.g., `style_reference`, `pose_reference`).

**Trigger.** Production quality demonstrably bounded by the single-reference constraint.

**Downstream.** Producer/agent prompts, TRAMA generation pipeline if applicable.

---

### B-CRT-ATTR-7 — Formalize absence of Produto
`priority: low` · `status: ready`

Today: `sem produto associado` is a literal value. Could be modeled as `Produto: null` with a separate `is_brand_creative: bool` flag for cleanness. See [[domain-dictionary#open-points]].

**Shape.** `Produto: nullable<product_id>`, `is_brand_creative: bool`.

**Trigger.** Next attribute-schema minor version bump; bundle with another change to amortize migration cost.

**Downstream.** Dashboards that currently filter on the literal string.

---

### B-CRT-ATTR-8 — `Estoque` / `stock` normalization
`priority: low` · `status: ready`

Classifier output uses English (`criteria = 'stock'`); docs and dictionary use Portuguese (`Estoque`). One direction has to become canonical. Tracked in [[domain-dictionary#open-points]] and [[constitution/winning-creative-constitution]].

**Trigger.** Next classifier refactor or next constitution version bump.

**Downstream.** Classifier output, dashboards, any SQL that filters on criterion name.

---

### B-CRT-ATTR-9 — Surface hook sibling key
`priority: medium` · `status: ready`

Today hook-variant siblings (creatives sharing body + CTA, differing only in opening segment) are encoded implicitly as `_hookN` suffixes on `ad_name`. Convention-enforced, not schema-enforced. See [[domain-dictionary#hook-variant]] and [[constitution/creative-attribute-constitution#open-points]].

**Shape.** Two fields on the Criativo object:
- `hook_variant_sibling_id: nullable<string>` — shared identifier across siblings. Null for creatives with no known siblings.
- `hook_variant_index: nullable<int>` — the `N` in `_hookN` (or the ratified equivalent).

**Orthogonality.** High — carries structural lineage information not present in any existing attribute; does not overlap with `parent_creative_ids` (parent-lineage is for auto-generation; hook-sibling is for human-produced test variants of the same base).

**Mapping method.** Parse `ad_name` with regex `(.+?)_hook(\d+)$`; `sibling_id = base`; `index = N`. Backfill across the historical table in one migration pass. Prospectively, require producers to set the pair at registration.

**Unit cost.** Trivial (~1ms per creative, fully automatable). Zero human labor.

**Signal value.** High **within-sibling** — unlocks "of the N hooks tested for this roteiro, which ROAS / win-rate pattern emerged" analyses directly on the performance dataset. Zero **cross-creative** value — this field alone does not say what *kind* of hook was tested (see B-CRT-ATTR-10).

**Trigger.** Capacity to run the backfill migration; no external blocker. Naturally pairs with next constitution version bump.

**Downstream.** CapoMastro registration schema, `ad_name` parser, winning-creative analysis (hook-variant win-rate as new segmentation axis).

---

### B-CRT-ATTR-10 — `hook_type` extraction — scope moved to Observable DNA
`priority: deferred-here` · `status: scope-moved` · `owner: [creative-tagging discovery](../../docs/features/creative-tagging/discovery/discovery.md)`

Originally scoped in v0.1.1 as a `hook_type` enum on the Criativo object under Structural DNA, with VLM-based extraction and an in-place cost/signal analysis. That framing is retired.

**Why retired.** Per [creative-tagging discovery §2.1](../../docs/features/creative-tagging/discovery/discovery.md), attributes inferred from pixels belong to **Observable DNA** — a new fourth layer of the Creative DNA contract, with its own governance, extractor-versioning, and confidence semantics. Mixing authored-intent (Structural) with inferred-actuality (Observable) hides the trust boundary between author and extractor — the exact failure mode that layer separation is designed to prevent.

**Open gap flagged for the new owner.** The creative-tagging v1 catalog (12 attributes) is whole-creative; none of its attributes is segmented by the hook window (first 1–3s). Hook-segmented extraction is an open gap for creative-tagging v2+.

**What could remain in this backlog.** If Observable DNA extracts `hook_type`, the Criativo's Structural schema may still need a normalized accessor or pointer to the Observable DNA record. That schema-linkage decision is in this backlog's scope; reopen as a separate, smaller item once Observable DNA v1 ships.

**Preserved rationale (audit trail).** The v0.1.1 analysis (VLM ~$0.001–0.01/creative, cross-creative signal value, catalog-design risk of `outro` ballooning, embedding-cluster validation path) is consistent with and largely covered by the creative-tagging discovery's Tier 2 stack and quality-measurement sections.

---

### B-CRT-ATTR-11 — Hook sub-attributes — scope moved to Observable DNA
`priority: deferred-here` · `status: scope-moved` · `owner: [creative-tagging discovery](../../docs/features/creative-tagging/discovery/discovery.md)`

Originally a deferral list for `hook_text`, `hook_duration_ms`, `hook_description`, `re_hook_present` under Structural DNA with cost-based rationale. Re-scoped: all four are inferred-from-artifact and belong to Observable DNA if anywhere.

**Deferral rationale under the new framing** (the original cost argument is retired — T1 OCR and scene detection are cheap under creative-tagging's Tier 1 stack):

| Field | Reason to defer (Observable DNA framing) |
|---|---|
| `hook_text` | Redundant with `onScreenTextCharCount` (T1) in the creative-tagging v1 catalog. Literal text can be derived on-demand from `Asset` when a specific analysis needs it; not worth a stored attribute. |
| `hook_duration_ms` | Redundant with `shotCount` (T0/T1) as a pacing proxy. "Where hook ends" is a segmentation decision the v1 pipeline does not make, and no evidence yet that a dedicated hook-boundary detector pays for itself. |
| `hook_description` | Free-text, human-authored, subjective. Does not fit Observable DNA's inferred-and-confidence-scored shape. Would regress into a comment field; reject. |
| `re_hook_present` | `Re-hook` is an editing verb in CapoMastro comments, not a characteristic of the rendered artifact. Wrong layer for Observable DNA; if ever formalized, belongs in a production-history layer, not here. |

**Trigger.** None from this backlog. Revisit only if the creative-tagging discovery owner proposes hook-window attributes in v2+.

---

## Connections

| Document | Type | Description |
|---|---|---|
| [[constitution/creative-attribute-constitution]] | `derives-from` | All items are pending changes against the ratified schema |
| [[premise/creative-premises]] | `derives-from` | B-CRT-ATTR-1 is the implementation track for P-CRT-14 |
| [[discovery/segmentation-dores-do-cliente]] | `depends-on` | B-CRT-ATTR-4 is gated by the segmentation discovery's outcome |
| [creative-tagging discovery](../../docs/features/creative-tagging/discovery/discovery.md) | `delegates-to` | B-CRT-ATTR-10 and B-CRT-ATTR-11 are scope-moved — inferred-from-pixel hook attributes belong to Observable DNA |
| [[domain-dictionary]] | `contextualizes` | Concepts referenced throughout |
