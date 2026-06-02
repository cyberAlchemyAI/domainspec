---
tags: [domainspec, dictionary, glossary, ubiquitous-language, vault, code-binding, residue, adlc, meta-track]
node_type: discovery
is_session: false
layer: ontology, architecture
nature: explanatory, reference
status: draft
version: 0.1.0
last_updated: 2026-06-01
---

# Business Dictionary as the Typed Vault↔Code Link

> Decision-record discovery — opened 2026-06-01. Records the DECISION that the business dictionary (dicionário de negócios) is the canonical typed link between the vault (knowledge graph) and the code. This is a **proposal**, not a proof and not an executed schema change. The downstream schema edits it implies (a new `grounds` edge type, a glossary migration, an ADLC rewrite) are recorded here as proposed Decisions and Open Questions — they are NOT performed in this node, because in this repo schema evolution flows only through discoveries.

---

## Objective

**Prior art, stated first (cite-don't-rediscover):** the concept this node records is **not novel**. A shared, authoritative glossary binding business vocabulary to the model is Eric Evans, *Domain-Driven Design* (2003) — the **Ubiquitous Language** plus its **Glossary**: one vocabulary used identically in conversation, documentation, and code, so a term means exactly one thing across the boundary. This repo already carries that idea as scaffolding — `docs/glossary.md` (which already cites ubiquitous language), `ADLC-ALIGNMENT.md` gap **G11 "Code-to-Spec binding"** with the Meta-Track domain-code-mapping `@biz`/`@sys` plan (T8–T10), and the `.claude/skills/custom/domain-dictionary.md` skill (full citations in the Prior Art section below). This node therefore records the **decision** that the business dictionary is the canonical link between the vault knowledge graph and the code, and proposes typing that link via a forward-only `grounds` edge (conceptual term-node → code symbol path) so binding mismatches become *typed residue*. The framework's only added contribution is the **typing**; the dictionary itself is adopted. The end state of *this* node is a recorded set of Decisions plus Open Questions — no schema file is edited, no glossary is migrated, no edge type is codified. Realizing those proposals is downstream work, gated by its own discoveries/specs.

---

## Prior Art (full citations)

The glossary / ubiquitous-language / term→code-binding idea is **adopted prior art, not claimed as new** (closed-borrowing is green-light):

- Eric Evans, *Domain-Driven Design* (2003) — **Ubiquitous Language** + **Glossary**: the team-wide vocabulary identical across talk, docs, and code.
- `docs/glossary.md` — already opens with "Ubiquitous language — domain terms used consistently across documentation and code," with `See Also` links from each term into feature docs. The DDD lineage is already cited there.
- `ADLC-ALIGNMENT.md` gap **G11 "Code-to-Spec binding"** (L1↔L2 Bridge) — already names the problem: "DomainSpec generates code from docs but doesn't verify code stays bound to docs." Its target state is the Meta-Track **domain-code-mapping** mechanism: `@biz`/`@sys` annotations referencing concept IDs, with orphan detection. Tasks **T8** (`@biz`/`@sys` annotation convention), **T9** (`domainspec-validate` orphan/unanchored detection), and **T10** (unified `registry.json` generator) are the already-planned executable form of this binding.
- `.claude/skills/custom/domain-dictionary.md` — the existing skill governing dictionary entries in `docs/vault/dictionary-business.md` / `dictionary-sys.md` / `dictionary-events.md`, including the `@biz`/`@sys`-tag-feeding role.

The **only** contribution this node proposes is **typing the term→code edges** — making the binding a first-class typed graph edge whose mismatches become *measurable residue* rather than silent drift. The dictionary concept is borrowed; the typed edge over it is the framework's added layer.

---

## 1. Business Context

**Why now.** `ADLC-ALIGNMENT.md` G11 records the standing condition: DomainSpec can generate code from docs but has no verified, machine-checkable binding keeping code attached to the docs that justify it. Today that binding lives in `docs/glossary.md` as prose `See Also` links and in the (planned) `@biz`/`@sys` annotations of the Meta-Track — both untyped from the vault's perspective. The vault already treats every other relationship as a typed, bidirectional edge (see `.claude/skills/custom/edges.md`), but the single most load-bearing relationship — *which business term is realized by which code symbol* — has no edge type. This node decides to close that conceptual gap at the design level, by naming the dictionary as the link and proposing its typing.

**What's broken** (locations are of the *current untyped state*, not bugs to patch in this node):

- `docs/glossary.md` — term→implementation binding is prose-only (`See Also` Markdown links to `features/.../domain.md#anchor`). It is not a graph edge, so collapse (two terms → one symbol) and orphan (symbol → no term) cases are invisible to the vault auditor.
- `ADLC-ALIGNMENT.md:90` (G11) — the binding is specified as a *target state* (`@biz`/`@sys` + orphan detection) but is untyped relative to the vault edge catalog; the registry (T10) is a planned CI artifact, not a vault-resident typed relation.
- `vault/ontology-conventions.md` Appendix C / `.claude/skills/custom/edges.md` — the edge catalog has no edge whose target is a code-symbol path. Term→code is unrepresentable as a typed edge today. (This is the gap the *proposed* `grounds` edge would fill — see D2; it is NOT added here.)

**What stays the same.** This node edits no schema and migrates no content. Out of scope, explicitly: `vault/ontology-conventions.md` (no `grounds` edge added), `docs/glossary.md` (not migrated into the vault), `ADLC-ALIGNMENT.md` (not rewritten; G11 stays as-is), the dictionary files under `docs/vault/dictionary-*.md` (no entries added), the `domain-dictionary.md` skill (unchanged), and the Meta-Track T8–T10 plan (unchanged). No conceptual `business-dictionary` node is created. The existing 22-edge catalog, frontmatter schema, and `@biz`/`@sys` plan all remain exactly as they are until their own discoveries codify any change.

---

## 2. Core Concepts

### Typed residue over the term→code binding

The contribution is to view the dictionary not as a lookup table but as a layer of **typed edges** from conceptual term-nodes to code symbols, so that the two ways the binding can fail become two *named, measurable* residue classes rather than silent drift:

- **Collapse residue (schema/FF flavour).** An edge `termo → código` where **two distinct domain terms resolve to one code symbol**. Borrowing the fully-faithful intuition: the map from terms to symbols is not injective on meaning — two meanings are fused at the code level. This is a *schema-side* residue: the vocabulary distinguishes what the code conflates.
- **Orphan residue (instance/EssSurj flavour).** A **code symbol with no domain term** pointing at it. Borrowing the essential-surjectivity intuition: the term→symbol map is not surjective onto the code — there are symbols in the image of "implemented" that nothing in the vocabulary hits. This is an *instance-side* residue: the code asserts a concept the dictionary never named. (Note: this is exactly the Meta-Track **orphan anchor** / **unanchored concept** pair from G11 and T9, re-described as typed edge residue.)

What "typed" buys: once the binding is an edge with a fixed type, both residue classes are *countable* by the same machinery the vault already uses for edge auditing — collapse = multiple `grounds` edges into one symbol; orphan = a code symbol with zero inbound `grounds` edges. **This measurability is the design intent, not an achieved result** (see Subset-rule note below).

> **Subset-rule note (claim ≤ proof).** Nothing here is proven and no residue is measured. The FF/EssSurj language is borrowed *framing* to name two failure shapes — it is an analogy guiding the edge design, not a categorical theorem about this repo. This node claims only that the dictionary *should be* the typed link and that, *if* the typed edge is built, these residues *would become* measurable. The measurement, the edge codification, and any orphan-rate metric are all explicitly **not-yet-realized**.

### Decisions (proposed)

- **D1 — The business dictionary is the canonical vault↔code link.** The dicionário de negócios (`docs/vault/dictionary-business.md`, and conceptually `docs/glossary.md`) is named as *the* surface across which the vault knowledge graph and the code are bound. Other surfaces (feature `domain.md`, `@biz` tags) participate, but the dictionary is the single authoritative locus of the term side of the binding. **Status: decided at design level; nothing edited.**
- **D2 — Introduce a forward-only `grounds` edge type.** Propose a new typed edge `grounds` (forward-only by source): conceptual term-node → code symbol path (e.g. `dictionary-business.md#PaymentTransaction` → `src/.../PaymentTransaction.ts#class`). Forward-only because code files are not vault graph nodes (same rationale as the existing skills/agents carve-out in `edges.md`: the target carries no `## Connections` block, no `node_type`, no inverse). **Name-collision flag (precedent-checked against the catalog):** the token `grounds`/`grounded-by` already appears in `vault/ontology-conventions.md` Appendix C as a **deprecated** edge ("old SQL-layer inverses"). The name `grounds` is therefore used here only as a working placeholder; reusing a tombstoned name silently is disallowed, so the codification discovery (D2's gate) must either justify revival with the new forward-only term→code semantics or pick a non-colliding name (candidates: `realized-by`, `binds-to`). See OQ-5. **Status: PROPOSED ONLY — pending its own codification through a dedicated discovery + an amendment to `vault/ontology-conventions.md` Appendix C. NOT added to the catalog here.**
- **D3 — The dictionary is adopted, not novel.** This is DDD Ubiquitous Language + Glossary (Evans 2003) operationalized over the existing Meta-Track `@biz`/`@sys` plan. The framework's residue is *only* the typing of the edge (D2), not the dictionary idea (D1's concept) itself. Any external-facing text must cite Evans and the Meta-Track in its first paragraph and must not present the glossary/dictionary as new. **Status: standing constraint on all downstream artifacts.**

---

## 3. Open Questions

Each carries a recommendation, per the discovery quality gate.

- **OQ-1 — How are `grounds` edges populated?** From the Meta-Track `@biz` annotations (T8) parsed by the T9 scanner, or manually authored in the dictionary, or both? *Recommendation:* make `@biz` the **source of truth** for the code side and *derive* `grounds` edges mechanically (the term side is authored in the dictionary; the symbol side is harvested from `@biz`), so the edge is generated, not hand-maintained — mirroring T10's "registry is a derived CI artifact, never committed" rule. Decide in the D2 codification discovery.
- **OQ-2 — Does `docs/glossary.md` migrate into the vault?** It currently lives outside `docs/vault/` and overlaps with `docs/vault/dictionary-business.md`. *Recommendation:* treat `dictionary-business.md` as the vault-resident canonical surface and `docs/glossary.md` as a candidate for migration/derivation, but do NOT migrate in this node — open a separate migration discovery (this also intersects the schema-drift finding already logged in `formal-definitions-layer/discovery.md`).
- **OQ-3 — Relationship to the ADLC T10 registry generator.** Is the typed `grounds` edge a *new* vault relation, or just the vault-side projection of the `registry.json` T10 already plans to emit? *Recommendation:* prefer the projection reading — `grounds` is the vault's typed view of the same term/anchor/coverage data T10 produces, not a parallel store — to avoid two sources of truth. Confirm against the T10 schema when D2 is codified.
- **OQ-4 — Is `grounds` distinct from existing `implements` / `operationalized-by`?** The catalog already has `implements` (plan→discovery) and `operationalized-by` (constitution/discovery→skill). *Recommendation:* yes, keep distinct — `grounds` targets a *code symbol path*, not a vault node, which no existing edge does; this distinctness is itself part of the D2 justification.
- **OQ-5 — What is the edge actually named, given the `grounds` deprecation?** Appendix C lists `grounds`/`grounded-by` as a **deprecated** (old SQL-layer) edge name. Reusing it silently is disallowed. *Recommendation:* in the D2 codification discovery, either (a) formally revive `grounds` with documented new forward-only term→code semantics and a note superseding the deprecation, or (b) adopt a non-colliding name — `realized-by` (term ← realized-by ← code) or `binds-to` (term → binds-to → code symbol). Pick (b) unless there is a strong reason to disturb the tombstone. Until then, `grounds` in this node is a placeholder only.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `../../../ADLC-ALIGNMENT.md` | `derives-from` | G11 "Code-to-Spec binding" and the Meta-Track T8–T10 plan are the existing scaffolding this decision builds on and re-types. |
| `../../../docs/glossary.md` | `cites` | The existing ubiquitous-language glossary is the prose form of the binding this node proposes to type; load-bearing prior art. |
| `../../../.claude/skills/custom/domain-dictionary.md` | `cites` | The dictionary-entry skill that governs the term side of the binding; forward-only edge into a skill file (no inverse, per edges.md carve-out). |
| `../../../vault/ontology-conventions.md` | `cites` | Appendix C edge catalog is where the proposed `grounds` edge (D2) would have to be codified; cited as the boundary this node deliberately does not cross. |
| `../formal-definitions-layer/discovery.md` | `cites` | OQ-2 (glossary migration) overlaps that discovery's documented `docs/glossary.md` schema-drift / source-of-truth finding; cited as the prior surface where the same concern lives. |
| `../certification-on-the-wrong-object/discovery.md` | `derives` | Downstream diagnosis: names the prevention-vs-measurement asymmetry whose closure the typed term→code edge (D2) and its orphan/collapse count would serve. |
