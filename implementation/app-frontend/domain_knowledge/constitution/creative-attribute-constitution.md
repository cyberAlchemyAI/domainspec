---
tags: [creatives, attributes, trama]
node_type: constitution
is_session: false
layer: domain
nature: reference
status: draft
version: 0.1.3
last_updated: 2026-04-22
---

# Creative Attribute Constitution (TRAMA)

> The ratified schema every creative must carry when it is registered in CapoMastro. Sets the shape of the "creative" object across CapoMastro, Maestro, and the Creatives Manager system. Originates from the TRAMA explore-phase project.

---

## Objective

This constitution defines **what a creative is, structurally** — the eight attribute categories every creative must declare at registration. It answers: *"What is the minimum metadata that makes a creative a first-class object the system can queue, classify, and retire?"*

It is prescriptive. Any flow that injects a creative into CapoMastro must emit these attributes. Attributes missing or malformed are a schema violation.

---

## Index

1. [The Eight Attribute Categories](#the-eight-attribute-categories)
2. [01. Produto](#01-produto)
3. [02. Campanha](#02-campanha)
4. [03. Audiência](#03-audiência)
5. [04. Ângulo / Mecânica](#04-ângulo--mecânica)
6. [05. Template / Blueprint](#05-template--blueprint)
7. [06. Content Blocks](#06-content-blocks)
8. [07. Visual Briefs](#07-visual-briefs)
9. [08. Input References](#08-input-references)
10. [Naming Conventions](#naming-conventions)
11. [Open Points](#open-points)
12. [Connections](#connections)

---

## The Eight Attribute Categories

Every creative registered in CapoMastro must declare:

1. **Produto** — what product (if any) the creative promotes
2. **Campanha** — retargeting or aquisição
3. **Audiência** — the intent bucket
4. **Ângulo / Mecânica** — the communication angle or promotional mechanism
5. **Template** — the reusable layout pattern
6. **Content Blocks** — the structural elements the template uses
7. **Visual Briefs** — the descriptive instructions for imagery
8. **Input References** — reference assets fed to production

The first three describe **intent** (what the creative is for). The next two describe **form** (the pattern it instantiates). The last three describe **content** (what materials compose it).

---

## 01. Produto

| Value | Meaning |
|---|---|
| *Specific produto SKU* | The creative promotes a single product |
| `sem produto associado` | The creative does not target a specific product (promo-only creatives, brand pieces) |

Every creative must declare exactly one value here. Multi-product creatives are not currently supported — they should be modeled as multiple creatives or as a new attribute category if they become common.

---

## 02. Campanha

| Value | Meaning |
|---|---|
| `retargeting` | Targets known clients |
| `aquisição` | Targets potentially new clients |

Exactly one value. Captures which side of the funnel the creative is serving.

---

## 03. Audiência

| Value | Meaning |
|---|---|
| `masc` | Male audience |
| `fem` | Female audience |
| `promo` | Promotional, generic |
| `promo2` | Promotional, secondary variant |

Exactly one value. Corresponds to the context-based segmentation currently used in Meta.

> **Known tension:** this is likely to change in H2/2025 as the team moves toward "dores do cliente" segmentation. When that happens, this field's value catalog must be updated and existing creatives re-labeled.

---

## 04. Ângulo / Mecânica

The field has two modes, depending on campaign type:

### For masc / fem (product creatives): Ângulo
- Atributos do produto
- Dores do cliente
- Desejo
- (Extensible — new angles are added as the team discovers them)

### For promo / promo2 (promotional creatives): Mecânica
- Compre-ganhe
- Leve-pague
- Desconto unitário
- Desconto kit

The field name is **Ângulo** in both cases for schema consistency. "Mecânica" is kept as a conversational alias for the promo variant.

---

## 05. Template / Blueprint

A reference to a reusable layout pattern. The template defines which `Content Blocks` the creative uses and in what quantity.

Templates are maintained in a separate template registry. A creative declares a template ID; the ID resolves to a specific set of required content blocks.

**Claude Code** currently supplies the `Content Blocks` set when a template is chosen.

---

## 06. Content Blocks

Structural elements the creative contains. Known types:

- `headline`
- `subheadline`
- `image(s)` — one or more
- `bullets`
- `disclaimer`
- `cta`

The template determines which of these a creative uses. A creative's content-block set is therefore **derived** from the template, not independently declared.

> **Note on `disclaimer`:** used both in `promo` creatives (most cases with an explicit offer; excluded from variants like "Promo do Dia") and in product creatives (e.g., "2 anos de garantia contra desbotamento", "entrega 24h").

> **`offer` vs `cta`:** the earlier draft used `offer`. The ratified name is `cta` because it generalizes across creatives with and without an explicit offer.

---

## 07. Visual Briefs

A descriptive instruction for the image(s) that appear in the creative. A creative may have **multiple** visual briefs (one per required image).

Each visual brief must declare whether the image comes from the **internal bank** (with a specific source) or must be **generated from scratch**.

Internal bank sources:
- `lookbook`
- `segunda luz`
- `influs`

The internal **styling library** is available as input to briefs that require outfit composition.

---

## 08. Input References

Reference assets provided as input when producing the creative.

**Current state:** exactly one reference per template. This is an operational constraint of the explore phase, not a final design choice.

---

## Naming Conventions

- Attribute field names in code must match the section names in this document (lowercase-kebab for codes, Title Case for UI labels).
- Enum values are snake_case in code (`sem_produto_associado`), Title Case in UI (`Sem Produto Associado`).
- New values require a ratification step: add to this document, bump version, update the registry.

---

## Open Points

- **Multi-product creatives.** The current schema rejects them. If they become a common pattern, `01. Produto` needs to accept arrays — which cascades into attribution logic.
- **Multi-audience creatives.** Same pattern as above. Currently disallowed.
- **Segmentation refactor.** Pending move from `masc`/`fem` to "dores do cliente" will retire or restructure `03. Audiência`.
- **Template-to-content-blocks resolution.** Currently mediated by Claude Code. This should be a deterministic registry lookup, not an LLM inference, for reproducibility.
- **Input Reference cardinality.** One per template is an operational cap, not a conceptual one. Allowing multiple references (e.g., a style reference plus a pose reference) would unlock better production.
- **Parent-creative lineage (pending schema change).** Driven by [[premise/creative-premises#P-CRT-14]]. Auto-generated creatives must declare the parent creative(s) they were derived from, the reference set used, and the generating agent run. This cascades into a new attribute (candidate shape: `parent_creative_ids: []`, nullable for hand-produced creatives; required non-empty for auto-generated ones) and a sibling relation for agent-run metadata. Must be ratified before TRAMA produces its first creative.

- **Hook — Structural vs Observable DNA split.** The [`Hook`](../domain-dictionary.md#hook) concept has two facets with different architectural homes, resolved against the Observable DNA layer introduced by the [creative-tagging discovery §2.1](../../docs/features/creative-tagging/discovery/discovery.md):

  - **Structural (authored).** Hook-variant sibling relationships are authored by producers and parsed deterministically from `ad_name` (`_hookN`). Queued here as [[backlog/creative-attribute-pending#b-crt-attr-9--surface-hook-sibling-key]] — remains in this constitution's scope.
  - **Observable (inferred from pixels).** Hook *type* (lettering / filmed / POV / demo) and hook-window OCR / duration are inferred from the artifact. Per the creative-tagging discovery, inferred attributes belong to the **Observable DNA** layer with its own governance, extractor-versioning, and confidence semantics; they do not belong in the Structural DNA schema this constitution defines. The original v0.1.2 proposals for `hook_type` and hook sub-attributes are scope-moved and retained as audit breadcrumbs at [[backlog/creative-attribute-pending#b-crt-attr-10--hook_type-extraction--scope-moved-to-observable-dna]] and [[backlog/creative-attribute-pending#b-crt-attr-11--hook-sub-attributes--scope-moved-to-observable-dna]].

  **Open gap (not owned here).** The creative-tagging v1 catalog has no hook-windowed attributes — all 12 v1 attributes are whole-creative. Hook-level Observable DNA is an open question for the creative-tagging discovery owner, not this constitution.

  **Residual item for this constitution.** If Observable DNA extracts `hook_type`, the Criativo's Structural schema may still need a normalized accessor or pointer to the Observable DNA record. That decision is deferred until Observable DNA v1 ships.

---

## Connections

| Document | Type | Description |
|---|---|---|
| [[axiom/creative-axioms]] | `derives-from` | AX-CRT-1 justifies formalizing creatives as first-class objects |
| [[premise/creative-premises]] | `derives-from` | P-CRT-11 and P-CRT-12 justify a single system with a formal schema |
| [[conceptual/creative-flows]] | `contextualizes` | This schema is the CapoMastro registration payload |
| [[constitution/winning-creative-constitution]] | `contextualizes` | Winning-creative analysis benefits from attribute-level segmentation |
| [[constitution/creative-removal-constitution]] | `contextualizes` | Removal evaluation happens at the creative-object granularity defined here |
| [[backlog/creative-attribute-pending]] | `depends-on` | Pending schema changes (parent-lineage, multi-product, audience overhaul) queued against this constitution |
| [[discovery/segmentation-dores-do-cliente]] | `questions` | Outcome reshapes the `Audiência` value catalog |
| [[discovery/creative-embedding-applications]] | `contextualizes` | Any embedding-driven rule may cascade into schema changes here |
| [creative-tagging discovery](../../docs/features/creative-tagging/discovery/discovery.md) | `delegates-to` | Observable DNA layer owns inferred-from-pixel attributes; this constitution stays the Structural DNA schema |
| [[domain-dictionary]] | `contextualizes` | Field names reference the dictionary |
