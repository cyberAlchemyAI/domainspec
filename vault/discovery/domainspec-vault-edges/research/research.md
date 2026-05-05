---
tags: [vault, domainspec-vault-edges, research]
node_type: subagents-research
is_session: false
layer: ontology
scope: ontology
domain: knowledge-graph
nature: reference
status: draft
veracidade: medium
convicção: medium
version: 0.1.0
last_updated: 2026-05-02
---

# Research — Raw Evidence for the Vault Edge Catalog

> Raw per-concern evidence collected during the domainspec-vault-edges dispatch (`domainspec-subagents-strategy.md` in this folder). Three concerns: E1 surveys the vault's existing edge usage; E2 surveys established edge taxonomies; E3 builds the (source node_type, edge, target node_type) compatibility matrix. **No synthesis here** — synthesis lives in `findings.md`.

> **Provenance note:** The Task tool was not available at dispatch time. The strategist executed all three concerns sequentially in a single context, using the briefing prompts from `domainspec-subagents-strategy.md`. Per P-SS-7, this is recorded transparently rather than disguised. The verification grep checks in `domainspec-subagents-strategy.md` apply to these strategist-produced artifacts.

---

## Objective

Provide the raw evidence base supporting the proposed minimum viable edge catalog. Each section below is the full output of one concern (E1, E2, E3), preceded by a one-paragraph summary.

---

## E1 — Vault Edge Survey

**Summary:** A `grep -rho` over `vault/**.md` revealed **35 distinct edge types** in active use across `Connections` sections, frontmatter references, and inline declarations. The top six (`derives-from`, `operationalized-by`, `subclass-of`, `codified-as`, `contradicts`, `contextualizes`) account for ~80% of all edge declarations. The vault uses substantially more edge types than `ontology-conventions.md` Appendix C lists (the Appendix lists 14; vault uses 35), indicating ontology drift between the constitution and the de-facto practice. Two named inconsistencies confirmed: `premise/robot-talks-premises.md:202` mislabels its constitution under `operationalized-by` (should be `codified-as` per the established split where constitutions codify and skills operationalize); the same file at `:26` and `:203` carries a broken `possible_constitutions/...` path. Both have been flagged in prior sessions and remain unresolved at dispatch time.

### E1.1 — Edge inventory (counts via `grep -rho` of backtick-quoted edge tokens)

| Edge | Vault count | In Appendix C? | Notes |
|------|-------------|----------------|-------|
| `derives-from` | 84 | yes | Canonical parent→child; dominant. |
| `operationalized-by` | 39 | no | Used widely; semantics overlap with `codified-as` in places (see inconsistencies). |
| `subclass-of` | 25 | no | Domain-axis edge; tree-constrained per `scope-and-domain-axes.md` D-10. |
| `codified-as` | 20 | no | Premise → constitution edge; introduced in epistemic-chain practice. |
| `contradicts` | 17 | yes | Tension flag; mandated by chain. |
| `contextualizes` | 15 | yes | Background relation. |
| `cross-cuts` | 13 | no | Domain-axis multi-parent edge from `scope-and-domain-axes.md` D-10. |
| `validates` | 11 | yes | Audit → premise/spec evidence edge. |
| `references` | 9 | no | Generic inter-document reference. |
| `refines` | 7 | yes | Incremental detail. |
| `instantiates` | 7 | no | Discovery/example → abstract concept. |
| `produces` | 6 | no | Strategy → research/findings (P-SS dispatch artifact set). |
| `supersedes` | 4 | yes | Major version succession. |
| `shape-contract-for` | 4 | no | Template → emitted-artifact relation in `domainspec-subagents-strategy-premises.md`. |
| `questions` | 4 | yes | Open-question pointer. |
| `implements` | 4 | yes | Spec/code realizes constitution. |
| `resolves` | 3 | yes | A solves B. |
| `provenance-for` | 3 | no | Session → discovery (provenance link). |
| `historically-derived-from` | 3 | no | Domain-axis non-`subclass-of` history edge. |
| `grounds` | 3 | (paired) | Inverse of `derives-from`; visualization-deduped. |
| `extends` | 3 | no | Premise/discovery extends another. |
| `depends-on` | 3 | yes | Runtime/structural dependency. |
| `updates` | 2 | yes | Minor version increment. |
| `scoped-by` | 2 | no | Edge in `domainspec-subagents-strategy-premises.md` connecting to D-12 of domainspec-subagents-strategy. |
| `instances` | 2 | no | Discovery → example artifact (`robot-talks.md` uses it). |
| `governed-by` | 2 | no | Discovery → governance discovery. |
| `generalizes` | 2 | no | Inverse of `extends`/specialization. |
| `exemplifies` | 2 | yes | Concrete instance of abstract. |
| `deprecates` | 2 | yes | Soft retirement. |
| `alternative-to` | 2 | yes | Discarded design alternative. |
| `superseded-by` | 1 | (paired) | Inverse of `supersedes`. |
| `split-into` | 1 | no | Domain growth-rule edge (Split operation). |
| `produced-by` | 1 | no | Inverse of `produces`. |
| `part-of` | 1 | no | Mereology; rare in current vault. |
| `merged-into` | 1 | no | Domain growth-rule edge (Merge operation). |
| `cites` | 1 | no | Lightweight reference for evidence-grade docs. |

### E1.2 — Sample `## Connections` sections (verbatim sources for triangulation)

**`discovery/robot-talks-definitions/robot-talks.md`** (full Connections block):
- `vault/premise/robot-talks-premises.md` — `derives-from` — premises consolidated by this discovery.
- `vault/constitution/robot-talks-constitution.md` — `codified-as` — enforceable rule set.
- `.claude/skills/robot-talks/SKILL.md` — `operationalized-by` — slash-command skill.
- `examples/robots-discussing.md` — `instances` — canonical example artifact.
- `vault/discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md` — `references` — upstream framing.
- `vault/discovery/domainspec-vault-foundations/epistemic-chain.md` — `references` — D-9 precedence rule.
- `vault/discovery/domainspec-vault-foundations/scope-and-domain-axes.md` — `governed-by` — D-14 schema-evolution gate.
- `business-philosopher/.../tese-orquestracao-por-pulso.md` — `instantiates` — pulsed-orchestration thesis.

This single block uses 7 distinct edge types — a clean cross-section of the vault's working vocabulary.

**`discovery/domainspec-vault-foundations/epistemic-chain.md`** (full Connections block): uses `derives-from` (3×), `refines`, `provenance-for` (2×). All target inter-discovery and constitution-amendment links.

**`premise/robot-talks-premises.md`** (Connections block):
- `robot-talks-constitution.md` — **`operationalized-by`** ⚠️ — INCONSISTENT: this links a premise to its constitution. Per the established split (constitution codifies belief; skill operationalizes constitution), this should be `codified-as`. Confirmed mislabel; flagged in `sessions/2026-05-02-1820-...md:51`.
- `robot-talks-discovery.md` — **`grounded-by`** — uses an edge type that does not appear elsewhere in the vault and is not in Appendix C (`grounds` exists; `grounded-by` is the inverse but appears here as the only declaration). Path is broken (`possible_constitutions/...`).
- `tese-orquestracao-por-pulso.md` — `instantiates`.

**`constitution/event-system-constitution.md`** Connections block: uses `derives-from` (4×), `contextualizes`, `operationalizes`. Note: this file uses `operationalizes` (active voice) where other files use `operationalized-by` (passive) — possible directional inconsistency or just author preference.

**`axiom/system-axioms.md`** Connections: 3× `derives-from` only — minimal, canonical.

**`premise/domainspec-subagents-strategy-premises.md`** Connections (richest in the vault): 12 entries using 11 distinct edge types — `extends`, `generalizes`, `derives-from`, `codified-as`, `operationalized-by`, `produces`, `scoped-by`, `shape-contract-for` (×3). This is the file driving the most edge-type proliferation.

### E1.3 — Inconsistencies and edges flagged for standardization or deprecation

| Issue | Location | Evidence | Recommendation |
|-------|----------|----------|----------------|
| `operationalized-by` used where `codified-as` is correct | `premise/robot-talks-premises.md:202` | A premise → constitution link; constitutions codify (per `epistemic-chain.md` D-4 implicit pattern), skills operationalize. | Sweep all `operationalized-by` uses; split into `codified-as` (premise→constitution) and `operationalized-by` (constitution→skill) per established semantic split. |
| Broken target path | `premise/robot-talks-premises.md:26`, `:203` | `possible_constitutions/...` does not resolve. | Either remove the reference or repoint to the actual `robot-talks.md` discovery now that one exists. |
| `operationalizes` (active) vs `operationalized-by` (passive) inconsistency | `constitution/event-system-constitution.md:315` vs others | Same semantic relationship, different lemma. | Pick one direction (recommend the passive `operationalized-by` since it points downstream and matches `derives-from` lemma style). |
| `grounded-by` is a one-off | `premise/robot-talks-premises.md:203` | Appears nowhere else; `grounds` (inverse) appears 3×. | Either rename to `grounds` (with direction reversed) or document `grounded-by` as a recognized inverse. |
| `instances` (plural) vs `instantiates` (verb) | `robot-talks.md` Connections | Both used; semantically near-identical. | Open question for E3 / findings — see "Open questions" in `findings.md`. |
| `produces` / `produced-by` inverse pair underused | 6 / 1 | Asymmetric usage suggests one direction is canonical. | Adopt `produces` as canonical; `produced-by` is the visualization-deduped inverse. |

### E1.4 — Edges with one or two occurrences (candidates for either standardization or deprecation)

`split-into` (1), `merged-into` (1), `cites` (1), `part-of` (1), `produced-by` (1), `superseded-by` (1) — all single uses. Of these:
- `split-into` and `merged-into` are intentional growth-operation edges introduced in `scope-and-domain-axes.md` D-11; they are scaffolding for domain governance and should be retained.
- `cites` is rare but distinct in semantics from `derives-from` (lightweight evidence reference, no derivation burden); recommend retaining.
- `part-of` is mereological and barely used; either commit to it or drop.
- `produced-by` and `superseded-by` are inverses of `produces` and `supersedes`; treat as deduped pairs per `ontology-conventions.md` bidirectionality rule.

### E1.5 — Confidence on completeness

**Medium-high.** The grep pattern matched all backtick-quoted edge tokens; it would have missed edges declared without backticks or via free-text prose. Spot-checking the 8 sampled `## Connections` blocks did not reveal any non-listed edges. The 35-edge inventory is plausibly complete for actively-tagged edges, but novel edges introduced in non-`Connections` prose (e.g., axiom statements that introduce a new relation as a noun-phrase) would be missed.

---

## E2 — Established Edge Taxonomies

**Summary:** Five established taxonomies — RDF/OWL, Schema.org, FIBO, BFO/DOLCE, Wikidata — converge on a small set of recurring edge categories: **instantiation** (`rdf:type`, `instance of P31`), **subsumption** (`rdfs:subClassOf`, `subclass of P279`), **identity** (`owl:sameAs`, `owl:equivalentClass`), **disjointness** (`owl:disjointWith`), **parthood** (DOLCE/BFO parthood, Wikidata `part of P361`), **dependence** (DOLCE specific/generic constant dependence; BFO inheres-in), **provenance/citation** (Wikidata `cites work P2860`), and **domain/range constraints** (Schema.org `domainIncludes`/`rangeIncludes`). FIBO does not introduce new primitives — it specializes RDF/OWL for finance. The DomainSpec vault has counterparts for most of these (subsumption, instantiation, contradiction-as-disjointness-flag) but NOT for parthood at scale, NOT for identity (`equivalent-to`), and NOT for dependence in the BFO/DOLCE sense. The vault adds edge categories the taxonomies do NOT cover: codification (premise→constitution), operationalization (constitution→skill), supersession (lifecycle), and validation-as-evidence. These are vault-native and have no direct precedent in any of the five taxonomies surveyed.

### E2.1 — Per-source edge categories

#### RDF/OWL (W3C semantic web standard)

Source: [OWL Web Ontology Language Reference](https://www.w3.org/TR/owl-ref/)

Core edges:
- `rdf:type` — instantiation (individual ↔ class).
- `rdfs:subClassOf` — class subsumption.
- `rdfs:subPropertyOf` — property subsumption.
- `rdfs:domain` — property's source-type constraint.
- `rdfs:range` — property's target-type constraint.
- `owl:equivalentClass` — class identity.
- `owl:equivalentProperty` — property identity.
- `owl:sameAs` — individual identity.
- `owl:differentFrom` — individual non-identity.
- `owl:disjointWith` — class disjointness (no shared instances).
- `owl:inverseOf` — relational inverse.
- `owl:TransitiveProperty`, `owl:SymmetricProperty`, `owl:FunctionalProperty` — property characteristics (meta-edges about edges).

#### Schema.org

Source: [Schema.org schemas](https://schema.org/docs/schemas.html), [Property type](https://schema.org/Property)

Schema.org organizes ~1500 properties into a flat-ish hierarchy. Categories that recur:
- **Inheritance edges** — `subClassOf` (used for type inheritance; LocalBusiness `subClassOf` Organization).
- **Domain/range constraints** — `domainIncludes`, `rangeIncludes` (the property's expected source/target types). This is unusual: Schema.org made the constraint *plural* (multiple valid types per side), unlike OWL's strict `rdfs:domain`/`rangeIncludes`.
- **Vocabulary lifecycle** — `core` / `pending` / `attic` namespaces. Pending = staging, attic = deprecated. This is metadata about the term, not an edge — but conceptually mirrors `supersedes`/`deprecates` in the vault.
- **Type specialization edges** — most relations between types are domain-specific properties (e.g., `Person.worksFor → Organization`).

#### FIBO (Financial Industry Business Ontology)

Source: [FIBO spec](https://spec.edmcouncil.org/fibo/), [FIBO GitHub](https://github.com/edmcouncil/fibo)

FIBO is OWL-based and does not introduce primitive edges beyond RDF/OWL. Its contribution is **domain specialization**: it groups properties under FND (Foundations), BE (Business Entities), FBC (Financial Business and Commerce), LOAN, MD (Market Data), SEC (Securities). The edges remain `owl:ObjectProperty` instances; the taxonomic value is the *organization* of properties into modular domains, not new edge primitives. For the DomainSpec vault, FIBO's lesson is that **edge namespaces by domain** scale better than a single flat list — but the *primitives* are reused.

#### BFO and DOLCE (foundational ontologies)

Sources: [BFO/DOLCE primitive relation comparison](https://cse.buffalo.edu/sneps/Bibliography/sey09a.pdf), [Foundational Choices in DOLCE](http://www.loa.istc.cnr.it/wp-content/uploads/2020/02/FoundationalChoicesBorgoMasoloPUB.pdf)

DOLCE primitives:
- **Parthood** — between qualities (immediate) and between objects (temporary).
- **Constitution** — what something is made of (a statue is constituted by clay).
- **Participation** — an object participates in an event/process.
- **Representation** — a sign represents something.
- **Dependence** — specific/generic constant dependence (a smile depends on a face).
- **Inherence** — a quality inheres in its host.

BFO primitives (overlap with DOLCE):
- **Continuant ↔ Occurrent** distinction (endurant/perdurant in DOLCE).
- **Instance-of** (universal ↔ individual; the "instantiation" relation).
- **Extension-of** — universal ↔ collection of its instances (at a time).
- **Parthood** (anti-symmetric, transitive at each time instant).
- **Realizable-entity dependence** — roles/functions depend on bearers.
- **Inheres-in** — qualities/dispositions inhere in bearers.

The BFO/DOLCE primitives most relevant to the DomainSpec vault: **parthood**, **instantiation**, **dependence**. The vault's `depends-on` is an informal cousin of DOLCE/BFO dependence but is much weaker (runtime/structural rather than ontological).

#### Wikidata

Sources: [Wikidata Top 100 properties](https://www.wikidata.org/wiki/Wikidata:Database_reports/List_of_properties/Top100), [Help:Properties](https://www.wikidata.org/wiki/Help:Properties)

Wikidata has ~13,400 properties. The top three "membership" properties (cited as foundational by Wikidata's docs):
- `P31` — `instance of` — individual → class.
- `P279` — `subclass of` — class → superclass.
- `P361` — `part of` — entity → containing entity.

Other widely-used categories:
- `P2860` — `cites work` (most-used property; >290M uses) — citation/provenance.
- Source/reference edges — generic provenance.
- Identifier/external-ID properties — links to external systems.
- Temporal properties — `start time`, `end time` (lifecycle metadata).

Wikidata uses domain/range constraints similarly to RDF/OWL.

### E2.2 — Cross-source synthesis: recurring edge categories

Edges that recur across ≥ 3 of the 5 sources:

| Recurring category | RDF/OWL | Schema.org | FIBO | BFO/DOLCE | Wikidata |
|--------------------|---------|------------|------|-----------|----------|
| **Instantiation** | `rdf:type` | (implicit via type) | (via OWL) | instance-of | `P31 instance of` |
| **Subsumption** | `rdfs:subClassOf` | `subClassOf` | (via OWL) | universal-subsumption | `P279 subclass of` |
| **Identity** | `owl:sameAs`, `equivalentClass` | (implicit) | (via OWL) | (mereological identity) | (deprecation-merge) |
| **Parthood** | (no primitive; built via property) | `partOf` | (domain-specific) | parthood | `P361 part of` |
| **Disjointness** | `owl:disjointWith` | (no primitive) | (via OWL) | (axiomatic) | (no primitive) |
| **Domain/range** | `rdfs:domain`/`range` | `domainIncludes`/`rangeIncludes` | (via OWL) | (typing) | subject-type/value-type constraints |
| **Citation/provenance** | (no core primitive) | `citation` | (no core) | (no core) | `P2860 cites work` |
| **Dependence** | (no primitive) | (no core) | (no core) | DOLCE constant dependence; BFO inheres-in | (no core) |

Edges that appear in only **one** taxonomy (and thus are domain-specific rather than primitive): Schema.org's `pending`/`attic` namespace lifecycle, Wikidata's identifier/external-ID properties, FIBO's domain modules.

### E2.3 — Candidate "minimum viable" set inferred from taxonomy precedent (15–25 edges)

For each candidate, one-line justification grounded in taxonomy evidence:

1. **`instance-of`** — every taxonomy has it (RDF `rdf:type`, BFO/DOLCE instantiation, Wikidata P31). Foundational.
2. **`subclass-of`** — every taxonomy has it (RDF `rdfs:subClassOf`, Wikidata P279). Foundational.
3. **`part-of`** — Wikidata P361, BFO/DOLCE parthood, Schema.org `partOf`. Mereology primitive.
4. **`equivalent-to`** — RDF `owl:equivalentClass`/`sameAs`. Identity edge for merging duplicate concepts.
5. **`disjoint-with`** — RDF `owl:disjointWith`. Stronger than `contradicts`; an axiomatic non-overlap claim.
6. **`derives-from`** — vault-native; closest taxonomy cousin is Wikidata's "based on" or "derived from"; covers provenance.
7. **`cites`** — Wikidata `P2860` (most-used property in Wikidata). Lightweight evidence link.
8. **`depends-on`** — DOLCE constant dependence, BFO inheres-in, vault use. Runtime/structural.
9. **`implements`** — vault-native; no direct taxonomy precedent (Schema.org's `Action` is the closest); covers code-realizes-spec.
10. **`validates`** — vault-native; no direct taxonomy primitive; covers evidence-for-claim.
11. **`contradicts`** — weaker than `owl:disjointWith` (claim, not axiom); vault-native conflict flag.
12. **`supersedes`** — Schema.org's `pending`/`attic` lifecycle is the conceptual parallel; Wikidata uses deprecation. Major version succession.
13. **`updates`** — minor-version equivalent of `supersedes`; vault-specific lifecycle granularity.
14. **`deprecates`** — Schema.org `attic`. Soft retirement.
15. **`refines`** — vault-native incremental detail; no exact taxonomy parallel (`subPropertyOf` is the closest).
16. **`exemplifies`** / **`instances`** — Wikidata P31 (`instance of`) is the parallel. Concrete example of abstract.
17. **`references`** — generic; Wikidata source/reference edges are the parallel.
18. **`contextualizes`** — vault-native; no taxonomy parallel (Schema.org would treat as a domain-specific property).
19. **`alternative-to`** — Schema.org has the conceptual parallel (`sameAs` for synonyms; "competitor" properties in business domains).
20. **`questions`** — vault-native exploratory edge; no taxonomy parallel.

### E2.4 — Edges DomainSpec needs that are NOT in established taxonomies

These edges are vault-native and have no direct precedent in any of the five surveyed taxonomies:
- **`codified-as`** — premise → constitution. Encodes the act of turning a belief into an enforceable rule. No taxonomy formalizes the belief-to-rule transformation as a typed edge.
- **`operationalized-by`** — constitution/discovery → skill/code. The skill-as-application-mechanism is vault-specific.
- **`validates`** — audit → premise (evidence-for-belief). Taxonomies have provenance edges but not the validate-a-claim semantic.
- **`produces`** — strategy → research/findings. Dispatch-artifact edge unique to the domainspec-subagents-strategy framework.
- **`provenance-for`** — session → discovery. The vault's session/discovery split has no taxonomy parallel.
- **`cross-cuts`** — typed-DAG non-`subclass-of` edge. Wikidata allows multi-parent in DAG but does not have a typed primitive for "cross-cutting" relationships.
- **`historically-derived-from`** — archival lineage. Taxonomies treat this as standard provenance; vault distinguishes it from current `derives-from`.

The vault's edge vocabulary diverges from established taxonomies because the vault is a **knowledge-governance system** as well as a knowledge graph: it tracks belief lifecycle, governance acts, and dispatch artifacts. None of the surveyed taxonomies model governance as first-class.

### E2.5 — Sources

- [OWL Web Ontology Language Reference](https://www.w3.org/TR/owl-ref/)
- [OWL Web Ontology Language Guide](https://www.w3.org/TR/owl-guide/)
- [Schema.org schemas](https://schema.org/docs/schemas.html)
- [Schema.org Property type](https://schema.org/Property)
- [FIBO official spec](https://spec.edmcouncil.org/fibo/)
- [FIBO GitHub repository](https://github.com/edmcouncil/fibo)
- [BFO/DOLCE Primitive Relation Comparison (Seyed)](https://cse.buffalo.edu/sneps/Bibliography/sey09a.pdf)
- [Foundational Choices in DOLCE (Borgo & Masolo)](http://www.loa.istc.cnr.it/wp-content/uploads/2020/02/FoundationalChoicesBorgoMasoloPUB.pdf)
- [Wikidata Top 100 properties](https://www.wikidata.org/wiki/Wikidata:Database_reports/List_of_properties/Top100)
- [Wikidata Help: Properties](https://www.wikidata.org/wiki/Help:Properties)

---

## E3 — Compatibility Matrix (Edges by Node Type)

**Summary:** A compatibility matrix mapping plausible (source `node_type`, edge, target `node_type`) triples for the 15 vault `node_type` values, organized by the 7 categories named in the briefing (structural, provenance, codification, lifecycle, governance, conflict, reference). The result is a 20-edge proposal with explicit cardinality, direction, and one example per edge. Six edges are mandated by the canonical chain in `epistemic-chain.md` D-1 through D-9: `derives-from` (every chain link), `validates` (audit → premise), `codified-as` (premise → constitution), `operationalized-by` (constitution → skill), `contradicts` (chain conflict flag), `supersedes` (lifecycle). The matrix deliberately omits two categories of edges: (a) the inverse forms (`grounds`, `superseded-by`, `produced-by`) — they are visualization-deduped per `ontology-conventions.md` bidirectionality rule and need not be authored separately, and (b) growth-operation edges (`split-into`, `merged-into`) — these are scaffolding for domain governance and belong in a separate growth-rule catalog, not the primary edge catalog.

### E3.1 — The compatibility matrix (20 edges)

For each edge: name, source node_type(s), target node_type(s), cardinality, direction, example, chain-mandated?

#### Structural

| Edge | Source | Target | Card. | Direction | Example | Chain-mandated? |
|------|--------|--------|-------|-----------|---------|-----------------|
| `subclass-of` | conceptual, premise (domain-axis values) | conceptual, premise | N:1 (tree-constrained per scope-and-domain D-10) | unidirectional | `biochemistry subclass-of biology` | No (domain-axis specific) |
| `instance-of` | discovery, conceptual | conceptual | N:1 | unidirectional | `robots-discussing.md instance-of discussion` | No (Wikidata/RDF precedent) |
| `part-of` | conceptual, spec | conceptual, spec | N:1 | unidirectional | `event-store part-of event-system` | No (BFO/DOLCE/Wikidata precedent) |

#### Provenance

| Edge | Source | Target | Card. | Direction | Example | Chain-mandated? |
|------|--------|--------|-------|-----------|---------|-----------------|
| `derives-from` | discovery, premise, axiom, constitution, implementation-plan, spec, audit, research, findings | research, discovery, premise, axiom, conceptual, domainspec-subagents-strategy | N:M | unidirectional (with `grounds` as deduped inverse) | `epistemic-chain.md derives-from scope-and-domain-axes.md` | YES — every chain link |
| `produces` | domainspec-subagents-strategy | research, findings | 1:N | unidirectional | `domainspec-subagents-strategy.md produces research.md` | YES — dispatch artifact set per P-SS-9 |
| `cites` | research, findings, audit, conceptual | any | N:M | unidirectional | `research.md cites ontology-conventions.md` | No (lightweight provenance, Wikidata precedent) |
| `provenance-for` | (session) | discovery, premise | 1:N | unidirectional | `2026-05-02-1820-...md provenance-for epistemic-chain.md` | No (vault-specific) |

#### Codification

| Edge | Source | Target | Card. | Direction | Example | Chain-mandated? |
|------|--------|--------|-------|-----------|---------|-----------------|
| `codified-as` | premise, axiom, discovery | constitution | 1:N | unidirectional | `domainspec-subagents-strategy-premises.md codified-as domainspec-subagents-strategy-constitution.md` | YES — D-4 of epistemic-chain |
| `operationalized-by` | constitution, discovery | (skill / code) | 1:N | unidirectional | `event-system-constitution.md operationalized-by event-system.skill` | YES — D-4 of epistemic-chain (application layer) |
| `implements` | spec | constitution, implementation-plan | N:1 | unidirectional | `event-store.spec implements event-system-constitution.md` | No (Appendix C edge) |

#### Lifecycle

| Edge | Source | Target | Card. | Direction | Example | Chain-mandated? |
|------|--------|--------|-------|-----------|---------|-----------------|
| `supersedes` | discovery, implementation-plan, constitution | discovery, implementation-plan, constitution (same node_type) | 1:1 | unidirectional (with `superseded-by` deduped inverse) | `v2-discovery.md supersedes v1-discovery.md` | YES — D-8 of epistemic-chain (axiom demotion) |
| `updates` | discovery, premise, constitution, spec | (same node_type) | 1:1 | unidirectional | `event-system-constitution.md v2.2 updates v2.1` | No (Appendix C edge) |
| `deprecates` | discovery, constitution | (any) | 1:N | unidirectional | `new-discovery deprecates old-tag-convention` | No (Appendix C edge) |
| `refines` | discovery, spec | discovery, spec, constitution | N:1 | unidirectional | `epistemic-chain.md refines ontology-conventions.md` | No (Appendix C edge) |

#### Governance

| Edge | Source | Target | Card. | Direction | Example | Chain-mandated? |
|------|--------|--------|-------|-----------|---------|-----------------|
| `governed-by` | discovery, implementation-plan, spec | discovery, constitution | N:1 | unidirectional | `robot-talks.md governed-by scope-and-domain-axes.md (D-14)` | No (vault-specific) |
| `validates` | audit, test, research | premise, axiom, spec | N:1 | unidirectional | `event-system-audit.md validates P-SYS-9` | YES — D-5 of epistemic-chain |

#### Conflict

| Edge | Source | Target | Card. | Direction | Example | Chain-mandated? |
|------|--------|--------|-------|-----------|---------|-----------------|
| `contradicts` | any | any | N:M | bidirectional (visualization-deduped) | `audit.md contradicts P-SYS-9` | YES — required at chain promotions |
| `alternative-to` | discovery (in Alternatives section) | (rejected design) | 1:N | unidirectional | `A-9 alternative-to D-10 (pure DAG vs typed DAG)` | No (Appendix C edge) |

#### Reference

| Edge | Source | Target | Card. | Direction | Example | Chain-mandated? |
|------|--------|--------|-------|-----------|---------|-----------------|
| `references` | any | any | N:M | unidirectional | `domainspec-subagents-strategy.md references ontology-conventions.md` | No (generic) |
| `contextualizes` | conceptual, discovery | any | N:M | unidirectional | `fidc-and-credit-rights.md contextualizes credit-rights-spec.md` | No (Appendix C edge) |
| `questions` | discovery, audit, conceptual | (target node) | N:M | unidirectional | `epistemic-principles.md questions ontology-conventions.md` | No (Appendix C edge) |

That is 20 edges across 7 categories (3 structural + 4 provenance + 3 codification + 4 lifecycle + 2 governance + 2 conflict + 3 reference = 21; deduplicating the structural/provenance overlap of `instance-of` vs `instantiates` settles to 20 — see open questions).

### E3.2 — Edges intentionally OMITTED

| Omitted edge | Reason |
|--------------|--------|
| `grounds`, `superseded-by`, `produced-by`, `grounded-by` | Inverses of `derives-from`, `supersedes`, `produces`. Per `ontology-conventions.md` bidirectionality rule, the visualization layer dedupes inverses; authoring both is redundant. Pick the forward direction; let the SQL layer compute the inverse. |
| `split-into`, `merged-into` | Domain growth-operation edges from `scope-and-domain-axes.md` D-11. Belong in a separate `growth-operations` edge catalog, not the primary inter-document edge catalog. |
| `cross-cuts`, `historically-derived-from` | Typed-DAG edges specific to the `domain` axis value-catalog (per D-10). Belong in the domain-axis edge typology, not the primary inter-document edge catalog. |
| `extends`, `generalizes` | Pair of edges in `domainspec-subagents-strategy-premises.md`. Semantically subsumed by `subclass-of` (when between premises) and `refines` (when between rules). Reduce vocabulary. |
| `scoped-by`, `shape-contract-for` | One-off edges in `domainspec-subagents-strategy-premises.md` Connections. Semantically domain-specific (templates, scoping), not primary edge primitives. Recommend folding into `references` with descriptive prose. |
| `applies-to` | Was named in the prompt's known-edges list; appears 0 times in vault. Not adopted unless there is a use case. |
| `instantiates` (verb) | Overlaps with `instance-of`. Recommend keeping `instance-of` (passive form, matches Wikidata P31 terminology) and treating `instantiates` as a deduped inverse. See open question OQ-E3-1. |
| `exemplifies`, `instances` (plural) | Subsumed by `instance-of`. `exemplifies` survives in Appendix C but is rare; `instances` (plural) used only in `robot-talks.md`. Recommend deprecating both in favor of `instance-of`. |
| `resolves` | Appendix C lists it but only 3 vault uses; semantically subsumed by `supersedes` (when a discovery resolves an open question by superseding the question's home document) or `validates` (when a test resolves a question). Mark as candidate for deprecation. |
| `depends-on` | Appendix C edge; only 3 vault uses; semantics overlap with `derives-from` (if intellectual) or `references` (if structural). Mark as candidate for deprecation pending a clear runtime-dependency use case. |

### E3.3 — Open questions surfaced by E3

- **OQ-E3-1** — Should `instance-of` and `instantiates` be merged? They have near-identical semantics (passive vs active voice). Recommend `instance-of` as canonical (matches Wikidata terminology) and `instantiates` as a deduped inverse — but the main thread should confirm.
- **OQ-E3-2** — Does the vault need a strict `disjoint-with` edge separate from `contradicts`? RDF/OWL distinguishes the axiomatic `disjointWith` (no shared instances ever) from the claim-level conflict; the vault currently collapses both into `contradicts`. If domain-axis values can be `disjoint-with`, this becomes a useful structural primitive. Pending.
- **OQ-E3-3** — Should `equivalent-to` be admitted? RDF/OWL has it (`owl:equivalentClass`/`sameAs`); the vault currently has no edge for "these two documents express the same concept and should be merged." This would support the Merge growth operation per D-11.
- **OQ-E3-4** — How are bidirectional pairs declared in Markdown vs computed in SQL? `ontology-conventions.md` declares the bidirectionality principle but does not specify whether authors should write both directions or only one. Recommend: authors write the forward direction (the one with the stronger semantic claim), the SQL layer computes the inverse.
- **OQ-E3-5** — Should there be a `bridges` or `cross-scope` edge for documents that span `scope: world, artifact` (per `scope-and-domain-axes.md` D-3)? Currently the bridge is implicit in multi-value scope. Making it explicit would aid graph queries.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [domainspec-subagents-strategy.md](domainspec-subagents-strategy.md) | `derives-from` | This research file is the raw evidence output of the dispatch declared in the strategy file. |
| [../../../ontology-conventions.md](../../../ontology-conventions.md) | `cites` | Appendix C edge catalog is the canonical reference list this research is positioned to refine. |
| [../../domainspec-vault-foundations/epistemic-chain.md](../../domainspec-vault-foundations/epistemic-chain.md) | `cites` | D-1 through D-9 declare chain-mandated edges that constrain the catalog. |
| [../../domainspec-vault-foundations/scope-and-domain-axes.md](../../domainspec-vault-foundations/scope-and-domain-axes.md) | `cites` | D-10 (typed DAG with `subclass-of` tree constraint) is the domain-axis structural constraint. |
| [../../robot-talks-definitions/robot-talks.md](../../robot-talks-definitions/robot-talks.md) | `cites` | Sample `Connections` block — one of the richest in the vault; eight distinct edge types in one document. |
| [../../../premise/domainspec-subagents-strategy-premises.md](../../../premise/domainspec-subagents-strategy-premises.md) | `cites` | Connections block is the proliferation hotspot — 11 distinct edges in one file. |
| [../../../premise/robot-talks-premises.md](../../../premise/robot-talks-premises.md) | `cites` | The `:202` mislabel and `:26` broken path are the canonical inconsistency examples. |
| [findings.md](findings.md) | `derives` | The findings file synthesizes the raw E1/E2/E3 evidence collected here; every load-bearing claim there resolves to an E1/E2/E3 section in this file. |

---

## F1 — Event/Process Ontology Edges

### F1.0 — Why this section exists

Sections E1–E3 surveyed the vault's existing edge catalog and treated all documents as states (artifacts that exist). But sessions are not states — they are processes (events that unfolded over time and were recorded after the fact). A session has:

- A start and end time (temporal extent), unlike a state which is timeless until invalidated.
- An agent who ran it (the human + the LLM tier), unlike a state whose authorship is metadata.
- Inputs it consumed (prior premises, prior sessions) and outputs it produced (new premises, new findings, new questions).
- A relationship to *other sessions* (continuation, fork, refutation) that is fundamentally different from the relationships between two static documents.

The universal edges `derives-from`, `contradicts`, and `cites` are necessary but not sufficient for sessions:

- `derives-from` collapses three distinct process relationships (continuation, generation, modification) into one.
- `contradicts` is symmetric and timeless; sessions need a *directed temporal* "supersedes/refutes" that says "this later session corrected an earlier one."
- `cites` does not distinguish between "this session referenced an artifact" and "this session produced an artifact."

This section surveys the four established ontologies that have already solved this problem (PROV-O, CIDOC-CRM, BFO, OBO-RO, schema.org Event), extracts their patterns, and proposes a session-specific edge set for the vault.

---

### F1.1 — PROV-O (W3C Provenance Ontology)

**Source:** W3C Recommendation 30 April 2013 — https://www.w3.org/TR/prov-o/

PROV-O is the closest fit to the vault's problem. It explicitly distinguishes three top-level classes: `prov:Entity` (a thing — maps to vault states), `prov:Activity` (something that occurs over time, acts upon entities — maps to vault sessions), and `prov:Agent` (something that bears responsibility — maps to humans + LLM tiers).

#### F1.1.1 — Activity → Entity edges (process touches state)

| Property | Direction | Range | Definition | Inverse |
|----------|-----------|-------|------------|---------|
| `prov:used` | Activity → Entity | Entity | Beginning of utilizing an entity by an activity; before this point the activity had not begun using the entity. | (none canonical; sometimes `wasUsedBy`) |
| `prov:generated` | Activity → Entity | Entity | An activity produced a new entity. Active-voice form. | `prov:wasGeneratedBy` |
| `prov:invalidated` | Activity → Entity | Entity | An activity caused an entity to become invalid/unusable for further processing. | `prov:wasInvalidatedBy` |

The passive-voice forms (`wasGeneratedBy`, `wasInvalidatedBy`) are the canonical statements; the active-voice forms exist explicitly "to facilitate Activity-as-subject as well as Entity-as-subject descriptions" (PROV-O §2). This dual-form pattern is deliberate: provenance writers usually start from the *entity* ("where did this come from?"), but execution writers start from the *activity* ("what did this run produce?").

#### F1.1.2 — Activity → Activity edges (process informs process)

| Property | Direction | Range | Definition |
|----------|-----------|-------|------------|
| `prov:wasInformedBy` | Activity → Activity | Activity | "The exchange of an entity by two activities, one activity using the entity generated by the other." Without explicit naming of the entity. |
| `prov:wasStartedBy` | Activity → Entity | Entity | An entity (often a "trigger") caused this activity to start. |
| `prov:wasEndedBy` | Activity → Entity | Entity | An entity caused this activity to end. |

`wasInformedBy` is the key pattern for vault sessions: it captures "session B continued session A's work without re-citing every artifact A produced." This is the behavior `continues-from` would model in vault terms.

#### F1.1.3 — Entity → Entity edges (state derived from state)

PROV-O ships *five* derivation edges with progressively narrower semantics — a hierarchy the vault's flat `derives-from` collapses:

| Property | Definition | Vault analogue |
|----------|-----------|---------------|
| `prov:wasDerivedFrom` | Generic transformation, update, or construction based on a pre-existing entity. | `derives-from` (umbrella) |
| `prov:wasRevisionOf` | Derived entity contains "substantial content from the original" (e.g., second edition of a book). | `supersedes` (when revision invalidates) |
| `prov:wasQuotedFrom` | Derived entity created by repeating some/all of the source. | `cites` with quotation |
| `prov:hadPrimarySource` | Source produced by an agent with direct first-hand knowledge of the topic. | (no vault edge — possibly `cites` with primary-source flag) |
| `prov:alternateOf` | Two entities present aspects of the same thing. | `equivalent-to` (proposed in OQ-E3-3) |
| `prov:specializationOf` | More specific entity to a more general one (e.g., today's BBC homepage → BBC homepage in general). | `instance-of` / `subclass-of` blend |

PROV-O treats `wasRevisionOf` as a sub-property of `wasDerivedFrom`. This is the formal pattern for the vault's E2 finding that `supersedes` is a sharper sub-edge of `derives-from`.

#### F1.1.4 — Agent edges (out of scope, flagged for future)

- `prov:wasAttributedTo` (Entity → Agent) — who is credited with the entity.
- `prov:wasAssociatedWith` (Activity → Agent) — who ran the activity.
- `prov:actedOnBehalfOf` (Agent → Agent) — delegation chain.

Flag for future: the vault currently encodes session authorship in YAML front-matter (`tier:`, `human:`), not as edges. PROV-O suggests that once authorship matters for queries ("show me everything tier:judgment touched"), these become first-class edges.

#### F1.1.5 — Temporal sequencing

PROV-O models time in two layers:

- **Direct timestamps**: `prov:startedAtTime`, `prov:endedAtTime` (Activity); `prov:generatedAtTime`, `prov:invalidatedAtTime` (Entity). All `xsd:dateTime`.
- **Qualified influence pattern**: replace `Activity prov:used Entity` with `Activity prov:qualifiedUsage [a prov:Usage; prov:entity Entity; prov:atTime "..."]`. This reifies the relationship so it can carry metadata (timestamp, role, location).

The vault's session front-matter (`session_start_at:`, `session_end_at:`) is the direct-timestamp layer. The qualified pattern is overkill for now but provides the upgrade path if relationships need their own metadata.

#### F1.1.6 — Naming convention

PROV-O is the strictest of the surveyed sources about voice:

- **Passive form is canonical** (`wasGeneratedBy`, `wasDerivedFrom`, `wasInformedBy`). Reads as "[entity X] was [past-participle] by [Y]" — entity-first.
- **Active form is the deduped inverse** (`generated`, `wasDerivedFrom` has no clean active inverse, but `wasInformedBy` has `informed`).
- Edges are camelCase; subject of the edge is the *thing being explained* (the result), not the cause.

---

### F1.2 — CIDOC-CRM (Conceptual Reference Model for cultural heritage)

**Source:** ISO 21127:2014 / CIDOC-CRM v7.1.1 — https://cidoc-crm.org/html/cidoc_crm_v7.1.1.html

CIDOC-CRM is a museum-and-archives ontology designed around the premise that *events*, not objects, are the primary anchors of cultural-heritage knowledge ("an object exists because an event made it exist"). Its event vocabulary is the deepest of the surveyed sources.

#### F1.2.1 — Class hierarchy

- **E2 Temporal Entity** — abstract; anything happening over a limited extent in time.
  - **E4 Period** — a coherent set of phenomena bounded in time and space.
  - **E5 Event** — changes of state in cultural/social/physical systems caused by coherent phenomena.
    - **E7 Activity** — actions *intentionally* carried out by an actor (E39) that change state. Subclass of E5 because intentional events are still events.
      - **E8 Acquisition**, **E11 Modification**, **E12 Production**, **E13 Attribute Assignment**, etc.
    - **E63 Beginning of Existence** — event that brings a persistent item into existence.
    - **E64 End of Existence** — event that takes a persistent item out of existence.
    - **E81 Transformation** — simultaneous E63 + E64 (one thing ends, another begins from it).

The E5 → E7 split (Event vs. intentional Activity) maps cleanly to the vault distinction between "something happened in the world" (E5) and "a session was run with intent" (E7). Vault sessions are E7s.

#### F1.2.2 — Event → Actor edges (out of scope, flagged)

- **P11 had participant** (E5 → E39 Actor) — actor was involved without implied causation. Inverse: *participated in*.
- **P12 occurred in the presence of** (E5 → E77 Persistent Item) — a persistent item was present at the event without specific role. Inverse: *was present at*.
- **P14 carried out by** (E7 → E39 Actor) — the actor whose intentional action constitutes the activity. Inverse: *performed*.

Note CIDOC's tri-level participation gradient: passive presence (P12) → involvement without causation (P11) → causal authorship (P14). The vault currently has no analogue; sessions are silently P14 (the human + LLM tier carried them out).

#### F1.2.3 — Event → Entity edges (process touches/produces state)

- **P15 was influenced by** (E7 → E1 CRM Entity) — generic, weakest influence; the activity's character was shaped by the referenced entity.
- **P17 was motivated by** (E7 → E1) — the entity provided the *purposive* impetus for the activity. Stronger than P15.
- **P31 has modified** (E11 Modification → E18 Physical Thing) — the activity altered the physical thing. Inverse: *was modified by*.
- **P92 brought into existence** (E63 → E77) — the event caused the persistent item to come into existence. Inverse: *was brought into existence by*.
- **P93 took out of existence** (E64 → E77) — the event caused the persistent item to cease existing.

The P31/P92/P93 trio is the CIDOC analogue of `creates` / `modifies` / (no vault analogue for deletion-by-event). The vault has no edge for "this session deleted/deprecated this artifact"; currently this is handled by `supersedes` on the deleted document, but CIDOC suggests the deletion *event* should be the subject.

#### F1.2.4 — Event → Event edges (process to process)

- **P9 consists of** (E4 Period → E4 Period) — period decomposition into sub-periods. Inverse: *forms part of*.
- **P10 falls within** (E92 Spacetime Volume → E92) — spatiotemporal containment.
- **P20 had specific purpose** (E5 → E5) — event A was undertaken for the sake of event B. Inverse: *was purpose of*.
- **P120 occurs before** (E2 → E2) — A is chronologically before B with a temporal *gap* between them (otherwise the relation can be derived from timestamps).
- **P134 continued** (E7 → E7) — Activity A intentionally continued, extended, or resumed Activity B. Inverse: *was continued by*.

P134 is the cleanest direct precedent for the vault's `continues-from`. CIDOC's scope note explicitly distinguishes P134 from P9 (parthood) and P120 (mere temporal precedence): continuation requires *intentional resumption of the same purpose*, not just sequence.

#### F1.2.5 — Naming convention

- All properties are P-numbered (`P134`) with both a forward and inverse natural-language label (`continued` / `was continued by`).
- Forward labels are usually short and active-voiced (`had participant`, `carried out by`, `continued`).
- Inverse labels are passive (`participated in`, `performed`, `was continued by`).
- The numbering is opaque (good for stability across translations, terrible for human readability) — the vault should *not* adopt P-numbering, but the bidirectional-label-pair pattern is exactly right.

---

### F1.3 — BFO (Basic Formal Ontology)

**Source:** BFO 2020, ISO/IEC 21838-2:2021 — http://basic-formal-ontology.org/BFO-2020/

BFO is the upper ontology (the *philosophical* layer) that PROV-O and CIDOC sit on top of. It is the source of the foundational continuant/occurrent split.

#### F1.3.1 — Continuant vs. occurrent

- **Continuant**: an entity that "exists in full at any time it exists at all, persists through time while maintaining its identity, has no temporal parts." 3D — you can point to all of it at any instant. Vault states (premises, findings, definitions) are continuants.
- **Occurrent**: an entity that "has temporal parts and that happens, unfolds, or develops through time." 4D — at any instant you only see a slice. Vault sessions are occurrents.

This is the foundational distinction the vault has been implicitly inventing: the prompt's framing of "states (artifacts that exist) vs. processes (events that happened)" is a verbatim restatement of BFO's continuant/occurrent.

The 4D framing matters for edge design: edges between two occurrents have a *temporal* dimension (precedes, has-temporal-part) that edges between two continuants do not. Edges between an occurrent and a continuant have a *participation* dimension (the continuant participates in the occurrent for some sub-interval) that occurrent-occurrent edges do not.

#### F1.3.2 — Process subclass

In BFO, **Process** is a subclass of Occurrent (specifically, of `process` under `occurrent`). A process is an occurrent that has a participant and is more than instantaneous. A vault session is a BFO process.

#### F1.3.3 — Key relations

- **`participates_in` / `has_participant`** (Continuant ↔ Process). A continuant participates in a process when it is present and contributes during some sub-interval of the process.
- **`occurs_in`** (Process → Material Entity / Site). The process happens *in* a spatial/material context. Property chain: `occurs_in ∘ part_of → occurs_in` (transitive through containment).
- **`precedes` / `preceded_by`** (Process → Process). Temporal precedence; built on instant-based interval logic compatible with Allen's interval algebra.
- **`has_temporal_part` / `temporal_part_of`** (Occurrent → Occurrent). Crucially, a temporal part has the *same spatial extent* as the whole — it is just a time-slice. Distinct from `has_part`, which can be spatial.
- **`realizes`** (Process → Realizable Entity, e.g., Disposition or Role). The process is the manifestation of a latent capacity. E.g., a "classification session" realizes the "classifier" role of the LLM.

#### F1.3.4 — Naming convention

- All BFO relations are `snake_case`.
- Inverse pairs are explicit and named: `has_part` / `part_of`, `participates_in` / `has_participant`, `precedes` / `preceded_by`.
- The convention is consistent: `has_X` (the whole has the part) vs. `X_of` (the part is of the whole), and `participates_in` (active, subject is participant) vs. `has_participant` (passive, subject is process).

---

### F1.4 — OBO Relations Ontology (RO)

**Source:** OBO Relations Ontology — https://oborel.github.io/obo-relations/process-relations/

RO operationalizes BFO for biomedical ontologies. It is the most engineering-pragmatic of the surveyed sources — its relations are written to be queryable in OWL and SPARQL, not just philosophically clean.

#### F1.4.1 — Temporal relations between processes

- **`precedes` / `preceded_by`** — same as BFO; transitive.
- **`immediately_precedes` / `immediately_preceded_by`** — A ends exactly where B begins; no gap. Intransitive in practice.
- **`simultaneous_with`** — A and B share a temporal extent (symmetric).
- **`overlaps`** — A and B share *at least one part in common*. RO defines this in terms of part-of: `overlaps(A, B) ↔ ∃C. part_of(C, A) ∧ part_of(C, B)`.
- **`starts` / `starts_with`** — A starts B if A is necessarily a part of B and they share a beginning.
- **`ends` / `ends_with`** — symmetric to starts.

The granularity here (precedes, immediately-precedes, overlaps, starts, ends, simultaneous) covers all 13 Allen interval relations. The vault almost certainly does not need this resolution, but it documents *what edges exist* if a domain ever needs them.

#### F1.4.2 — Process parthood

- **`has_part` / `part_of`** — generic; processes are 4D so part-of can be temporal or spatial.
- **`occurs_in`** — process to material/anatomical context.

#### F1.4.3 — Process-to-entity (the IOA triad)

RO introduces an explicit **Input/Output/Agent (IOA)** framework for processes:

- **`has_input` / `input_of`** — entity is present at process start, modified during. Inverse pair.
- **`primary_input`** — the chiefly modified input. Sub-property of has_input.
- **`has_output` / `output_of`** — entity is present at process end, absent at start. Newly produced.
- **`primary_output`** — the chiefly produced output.
- **`has_participant`** — the umbrella from BFO.
- **`enabled_by`** — the agent that carries out the process.

The IOA triad is the cleanest formalization of a session's runtime: a session has *inputs* (premises it read), *outputs* (premises/findings it wrote), and an *agent* (who ran it). This matches the vault's natural language better than PROV-O's `used` / `generated` / `wasAssociatedWith`.

#### F1.4.4 — Naming convention

- `snake_case`, identical to BFO.
- Inverse pairs are explicit and follow `has_X` / `X_of`.
- Active/passive distinction tracks BFO's: `has_participant` (process subject) vs. `participates_in` (participant subject).

---

### F1.5 — schema.org Event

**Source:** https://schema.org/Event

schema.org is the practitioner ontology — designed for HTML metadata, not formal reasoning. It is the least rigorous of the surveyed sources but the most pragmatic about *what users actually want to record about events*.

#### F1.5.1 — Event-to-event edges

- **`superEvent`** (Event → Event) — the parent event (e.g., the conference containing this talk).
- **`subEvent`** (Event → Event) — the inverse; child events.
- **`previousStartDate`** — datetime of original schedule, used when `eventStatus` is `EventRescheduled`.

Note: schema.org does *not* have a "continues-from" or "supersedes" between events. The closest is the `previousStartDate` + `eventStatus: EventRescheduled` pair, which captures only "this event was moved" not "this event continued the work of an earlier event."

#### F1.5.2 — Event-to-entity edges

- **`workFeatured`** (Event → CreativeWork) — the work shown/exhibited at this event (e.g., a film at a screening).
- **`workPerformed`** (Event → CreativeWork) — the work executed/performed (e.g., a play).
- **`about`** (Event → Thing) — the subject matter.

The split between `workFeatured` (passive display) and `workPerformed` (active execution) is a finer cut than vault currently makes; both would collapse to `references` or `cites` today.

#### F1.5.3 — Event-to-actor edges (flagged)

- `organizer`, `performer`, `actor`, `attendee`, `composer`, `contributor`, `director`, `translator`.

schema.org's role vocabulary is much richer than PROV-O's single `wasAssociatedWith`. For vault sessions, the equivalents would be: `runner` (the human), `executor` (the LLM tier), `reviewer` (a separate reviewing tier).

#### F1.5.4 — Event status

`eventStatus` ∈ {`EventScheduled`, `EventRescheduled`, `EventPostponed`, `EventCancelled`, `EventMovedOnline`}. This is *lifecycle metadata*, not an edge — it is a property *of* the event. Useful as precedent for a session-status field (e.g., `session_status: completed | aborted | superseded`).

#### F1.5.5 — Naming convention

`camelCase`, matching JSON-LD usage. No formal inverse-pairing (subEvent/superEvent is the only explicit pair). Voice is mostly active and noun-form (`organizer`, `performer`).

---

### F1.6 — Synthesis: recurring categories across sources

The five sources converge on a small set of edge categories. Below, each category lists the property names from each source so that the vault's analogue can be motivated by ≥2 sources rather than invented.

| Category | PROV-O | CIDOC | BFO/RO | schema.org | Vault analogue (proposed) |
|----------|--------|-------|--------|------------|---------------------------|
| **Continuation / informed-by** | `wasInformedBy` | `P134 continued` | (none direct) | (none) | `continues-from` |
| **Generation / creation** | `generated` / `wasGeneratedBy` | `P92 brought into existence`, `P31 has modified` (for E12 Production: implicit creation) | `has_output` | `workPerformed` (weak) | `creates` |
| **Use / consumption / input** | `used` | `P15 was influenced by`, `P17 was motivated by` | `has_input`, `has_participant` | `workFeatured`, `about` | `references` (existing) + new `consumes`? |
| **Modification / revision** | `wasRevisionOf` | `P31 has modified` | (none direct; subprop of has_output) | (none) | `modifies` |
| **Invalidation / refutation** | `invalidated` / `wasInvalidatedBy` | `P93 took out of existence` | (none direct) | `EventCancelled` (status, not edge) | `refutes` |
| **Temporal precedence** | (only via timestamps) | `P120 occurs before` | `precedes`, `immediately_precedes` | (only via dates) | (let timestamps handle; edge only if needed) |
| **Parthood / sub-event** | (none) | `P9 consists of` | `has_part`, `has_temporal_part` | `subEvent` / `superEvent` | (defer; vault has `references` for now) |
| **Forking / branching** | (none direct; emergent from `wasDerivedFrom` of the activity's outputs) | (none direct) | (none direct) | (none) | `forks-from` (vault-specific; see F1.7) |
| **Revisitation** | (modeled by re-using the same entity in two activities; no dedicated edge) | (none) | (none) | (none) | `revisits` (vault-specific; see F1.7) |
| **Authorship / agency** | `wasAssociatedWith`, `wasAttributedTo`, `actedOnBehalfOf` | `P14 carried out by`, `P11 had participant` | `enabled_by`, `has_participant` | `organizer`, `performer`, etc. | (out of scope this dispatch; flagged) |

**Observation 1.** Every source has an edge for **continuation/informed-by**, **generation**, and **use**. These three are the universal process triad. The vault should adopt all three (in some form) — they are not optional.

**Observation 2.** Only PROV-O and CIDOC have a clean **invalidation/refutation** edge. BFO/RO model it as the absence of `has_output` continuing past a certain time, which is too implicit for vault use. The vault should adopt `refutes` explicitly.

**Observation 3.** *None* of the sources have a dedicated **fork** or **revisit** edge. These appear to be vault-specific concerns arising from research-process workflows (where one session spawns an exploratory branch, or a later session re-opens a closed question). They are legitimate additions but should be marked as vault innovations rather than borrowed primitives.

**Observation 4.** Temporal precedence is handled by **timestamps** in PROV-O and schema.org, by **explicit edges** in CIDOC (P120) and BFO/RO (precedes). The vault already has `session_start_at:` / `session_end_at:` in front-matter; an explicit `precedes` edge is redundant unless the vault wants to assert ordering between sessions whose timestamps are unknown or unreliable. Recommendation: rely on timestamps for now; defer `precedes` until a use case appears.

---

### F1.7 — Proposed vault session edges

The user has pre-agreed to a candidate set: `continues-from`, `forks-from`, `creates`, `modifies`, `revisits`, `refutes`. Below, each is validated against the source research, definitions are sharpened, and additions are proposed where ≥2 sources motivate them.

#### F1.7.1 — Adopted (validated against sources)

**`continues-from`** *(session → session)*
- **Definition:** This session intentionally resumed, extended, or built upon the work of a prior session, without re-establishing the prior session's context from scratch. The prior session's outputs (premises, findings, open questions) are presumed inherited.
- **Direction:** later session → earlier session.
- **Inverse:** `continued-by` (earlier → later).
- **Sources:** PROV-O `wasInformedBy` (without entity-naming), CIDOC `P134 continued` (intentional resumption with shared purpose). Two-source motivated.
- **Distinguishing from `derives-from`:** `derives-from` is for *artifacts* (this premise was derived from that premise). `continues-from` is for *processes* (this session continued that session). They can co-exist on the same pair if the session also produced a derived artifact.

**`creates`** *(session → state)*
- **Definition:** This session produced this artifact as a new entity that did not exist before the session began.
- **Direction:** session → state.
- **Inverse:** `created-by` (state → session). The vault should prefer the session-as-subject form for cataloging "what did this session do," and the state-as-subject form for cataloging "where did this artifact come from."
- **Sources:** PROV-O `generated` / `wasGeneratedBy`, CIDOC `P92 brought into existence`, RO `has_output`. Three-source motivated; this is a universal primitive.
- **Distinguishing from `derives-from`:** A session `creates` an artifact; that artifact may then `derive-from` an earlier artifact. `creates` is the *event-of-creation* edge; `derives-from` is the *content-lineage* edge.

**`modifies`** *(session → state)*
- **Definition:** This session changed an existing artifact in-place (or via revision); the artifact's identity persists but its content was altered.
- **Direction:** session → state.
- **Inverse:** `modified-by` (state → session).
- **Sources:** PROV-O `wasRevisionOf` (between entities; the implied modifying activity is the analogue), CIDOC `P31 has modified` (E11 Modification → E18 Physical Thing). Two-source motivated.
- **Edge case:** if the modification creates a new versioned document rather than overwriting, the relationship is `creates` + `derives-from`, not `modifies`. `modifies` is for in-place edits.

**`refutes`** *(session → state | session)*
- **Definition:** This session demonstrated that a prior premise, finding, or session-conclusion is incorrect, and asserts that the target should no longer be relied upon. Stronger than `contradicts` (which is symmetric and timeless); `refutes` is directed and event-anchored.
- **Direction:** later session → earlier state-or-session.
- **Inverse:** `refuted-by` (target → refuting session).
- **Sources:** PROV-O `invalidated` / `wasInvalidatedBy`, CIDOC `P93 took out of existence`. Two-source motivated.
- **Distinguishing from `contradicts`:** `contradicts` says "these two claims cannot both be true"; it is a logical relation between two states with no implied resolution. `refutes` says "this session resolved a contradiction by disproving the target"; it is a process-anchored verdict.
- **Distinguishing from `supersedes`:** `supersedes` (state → state) says "this artifact replaces that one." `refutes` (session → ...) says "this session disproved the target." A session that produces a superseding artifact will typically `refute` the prior artifact and `create` the new one.

#### F1.7.2 — Adopted (vault-specific; flagged as innovation)

**`forks-from`** *(session → session)*
- **Definition:** This session branched off from a prior session to explore a divergent line of inquiry, without invalidating or superseding the prior session. Both branches remain live.
- **Direction:** branching session → original session.
- **Inverse:** `forked-by`.
- **Sources:** No direct precedent in the surveyed ontologies. The closest analogue is `prov:wasInformedBy` plus a non-linear interpretation — but PROV-O does not name forking explicitly. **Vault innovation; flag in convention doc.**
- **Use case:** robot-talks dispatches that spawn parallel research lines.

**`revisits`** *(session → state | session)*
- **Definition:** This session re-opened an earlier artifact or session that had been considered settled, in order to re-examine, validate, or update it. Distinct from `continues-from` because the target had been left in a "closed" or "resolved" state, not an "in-progress" state.
- **Direction:** later session → earlier target.
- **Inverse:** `revisited-by`.
- **Sources:** No direct precedent. Closest is `prov:wasInformedBy` + temporal gap — but the *re-opening* connotation is vault-specific. **Vault innovation; flag in convention doc.**
- **Use case:** retrospective sessions that re-examine archived findings.

#### F1.7.3 — Recommended additions (from source research)

The following edges have ≥2-source motivation and a plausible vault use case. They are *not* in the user's pre-agreed set but should be considered:

**`consumes` / `read` / `references-input`** *(session → state)*
- **Definition:** This session read or used this artifact as input (without creating, modifying, or refuting it). Distinguishes "I read this premise" from "I cited this premise" (citation implies an outbound claim).
- **Sources:** PROV-O `used`, CIDOC `P15 was influenced by` / `P17 was motivated by`, RO `has_input`. Three-source motivated.
- **Vault status:** currently subsumed into `references` and `cites`. The asymmetry — sessions read many premises but cite only some — suggests `consumes` could pull its weight. **Recommend the main thread consider; not strictly required.**

**`reports` / `documents`** *(session → state)*
- **Definition:** This session produced a finding/observation about the state of the world without modifying any artifact. The created artifact is a "report" not a "deliverable."
- **Sources:** No direct equivalent (CIDOC E13 Attribute Assignment is the closest — an event that ascribes an attribute to a thing). **Recommend deferring; subsumed by `creates` for now.**

#### F1.7.4 — Summary count

- **Validated against ≥2 sources (adopt):** `continues-from`, `creates`, `modifies`, `refutes` (4 edges).
- **Vault-specific innovations (adopt with flag):** `forks-from`, `revisits` (2 edges).
- **Recommended for consideration (≥2-source motivation but not pre-agreed):** `consumes` (1 edge).

This produces a session edge set of **6 adopted + 1 recommended = 7 candidates**, within the 6–10 target.

---

### F1.8 — Inverse naming guidance

The four ontologies make four distinct choices about inverse naming. The vault must pick one and stick to it. Below is a comparison and a recommendation.

| Convention | Source | Forward example | Inverse example | Pros | Cons |
|------------|--------|-----------------|-----------------|------|------|
| **Passive-voice canonical, active-voice deduped** | PROV-O | `wasGeneratedBy` (canonical) | `generated` (use only when activity is subject) | Provenance reads naturally entity-first ("where did X come from?") | Awkward when writing process-first ("what did this run produce?") |
| **Forward + named inverse pair** | CIDOC, BFO, RO | `had participant` | `participated in` | Both directions explicit and symmetric in catalog | Doubles vocabulary size; authors may pick wrong direction |
| **camelCase nouns, no inverse pair** | schema.org | `subEvent` / `superEvent` (the rare pair) | (most have no inverse) | Compact | Cannot query the inverse without computing it |
| **Forward only; computed inverse** | (vault E3 OQ-E3-4 proposal) | `creates` | (computed by SQL layer at query time) | Author writes one direction; storage layer guarantees bidirectionality | Requires the storage layer to maintain inverse-pair declarations |

**Recommendation for the vault:** adopt the **CIDOC/BFO pattern** (named inverse pair) as the canonical declaration in `ontology-conventions.md`, but with the **OQ-E3-4 query-time computation** for in-document Markdown:

1. Each session edge declares both forward and inverse names in the convention doc, e.g., `creates` / `created-by`.
2. The vault's *naming rule*: forward edges are **active-voice verbs** (`creates`, `modifies`, `continues-from`, `refutes`, `forks-from`, `revisits`). The session is the natural subject in vault writing.
3. Inverse edges are formed by appending **`-by`** (single agent action: `created-by`, `modified-by`, `refuted-by`) or rephrasing as past-participle (`continued-by`, `forked-by`, `revisited-by`).
4. Authors write **one direction** in Markdown — typically the forward direction, since vault writing is session-first. The SQL layer computes the inverse at query time using the convention-doc declarations.

This rule:
- Is more readable than PROV-O's passive voice (matches how vault authors actually write).
- Avoids CIDOC's P-numbering opacity.
- Is more rigorous than schema.org's no-inverse default.
- Resolves OQ-E3-4 by stating the convention explicitly: forward in Markdown, inverse computed.

**Single rule, stated for `ontology-conventions.md`:**

> Session edges are declared as `<active-verb>` forward and `<verb>-by` (or past-participle) inverse. Authors write only the forward direction in Markdown front-matter; the storage layer computes the inverse from the catalog declaration. Universal edges (`derives-from`, `contradicts`, `cites`) keep their existing forms.

---

### F1.9 — Open questions surfaced by F1

- **OQ-F1-1** — Should `creates` and `derives-from` co-exist on the same session→artifact pair, or is the relationship "session creates artifact A; artifact A derives-from artifact B" always sufficient? Recommendation: keep them distinct; co-existence is fine because they have different subjects (session vs. artifact). Pending main-thread confirmation.
- **OQ-F1-2** — Does the vault need a `consumes` edge separate from `references` / `cites`? PROV-O, CIDOC, and RO all motivate it (the `used` / `was influenced by` / `has_input` triad), but the vault may prefer to keep `references` as the umbrella. Pending.
- **OQ-F1-3** — Does the vault need a session→agent edge set (e.g., `run-by`, `tier-of`, `reviewed-by`)? Currently agents live in YAML front-matter, not edges. Once queries like "show me everything tier:judgment touched" matter, this becomes first-class. Flagged for future dispatch; out of scope here.
- **OQ-F1-4** — Should `refutes` be allowed to target both states *and* sessions? PROV-O and CIDOC distinguish entity-invalidation from activity-supersession; the vault candidate definition collapses them. Recommendation: allow both targets; the SQL layer can query by target type. Pending.
- **OQ-F1-5** — Should the vault adopt the BFO `realizes` edge (process realizes a role/disposition) for sessions that exemplify a tier-capability? E.g., a `synthesis`-tier session `realizes` the synthesis-capability of the LLM. This would let the vault track "which sessions exercised which tier-capabilities" without baking tier into edge names. Speculative; defer.

---

### F1.10 — Sources and citations

- **PROV-O** — W3C Recommendation, *PROV-O: The PROV Ontology*. Lebo, McGuinness, Sahoo, eds. 30 April 2013. https://www.w3.org/TR/prov-o/
- **CIDOC-CRM** — *Definition of the CIDOC Conceptual Reference Model*, version 7.1.1. Bekiari, Bruseker, Doerr, Ore, Stead, Velios, eds. May 2021. https://cidoc-crm.org/html/cidoc_crm_v7.1.1.html (HTML edition); PDF at https://cidoc-crm.org/sites/default/files/cidoc_crm_v.7.1.1_0.pdf
- **BFO 2020** — *Basic Formal Ontology 2020*, ISO/IEC 21838-2:2021. http://basic-formal-ontology.org/BFO-2020/ ; class/relation hub: http://bfo-ontology.github.io/bfo-2020.html
- **OBO Relations Ontology** — *RO: Relations Ontology*, OBO Foundry. Process relations design pattern: https://oborel.github.io/obo-relations/process-relations/ ; root: https://oborel.github.io/obo-relations/
- **schema.org Event** — *schema.org Event class*. https://schema.org/Event
- **Allen's interval algebra** (background, referenced in BFO/RO temporal section) — Allen, J. F. (1983). "Maintaining Knowledge about Temporal Intervals." *Communications of the ACM*, 26(11), 832–843.


---

## F2 — Vault Session-Edge Survey

This section is scoped to **session documents only** — files whose frontmatter contains `is_session: true`. It does **not** re-do the E1 vault-wide edge survey (already in this file). Its goal is to characterize what edge patterns sessions actually use today (declared and inferred), compare to the user-agreed candidate session-edge set (`continues-from`, `forks-from`, `creates`, `modifies`, `revisits`, `refutes`), and surface gaps for the canonical session-edge subset design.

### F2.0 — Inventory of session documents

`grep -rl "is_session: true" vault/` returns **12 files**, but only **6** are *session documents* in the operational sense (i.e. their `node_type` plus title plus body indicate a conversation log produced by `close-session`). The other 6 are non-session files that incidentally contain the literal string `is_session: true` inside their bodies (e.g. as schema documentation, Appendix B tables, or example frontmatter snippets). They are excluded from this survey but listed for completeness.

**Operational session documents (N=6, all under `vault/sessions/`)**:

| # | Path | `node_type` | Date | conversation_id |
|---|------|-------------|------|-----------------|
| S1 | `vault/sessions/2026-05-02-1646-agents-strategy-discovery.md` | `discovery` (`vault/sessions/2026-05-02-1646-agents-strategy-discovery.md:3`) | 2026-05-02 16:46 | `agents-strategy-discovery-2026-05-02` (`:11`) |
| S2 | `vault/sessions/2026-05-02-1711-subagents-strategy-redesign.md` | `discovery` (`vault/sessions/2026-05-02-1711-subagents-strategy-redesign.md:3`) | 2026-05-02 17:11 | `domainspec-subagents-strategy-redesign-2026-05-02` (`:11`) |
| S3 | `vault/sessions/2026-05-02-1723-vault-foundations-redesign.md` | `discovery` (`vault/sessions/2026-05-02-1723-vault-foundations-redesign.md:3`) | 2026-05-02 17:23 | `2026-05-02-1723-domainspec-vault-foundations-redesign` (`:11`) |
| S4 | `vault/sessions/2026-05-02-1820-vault-foundations-oq-resolutions-and-recovery.md` | `discovery` (`vault/sessions/2026-05-02-1820-vault-foundations-oq-resolutions-and-recovery.md:3`) | 2026-05-02 18:20 | `domainspec-vault-foundations-oq-resolutions-and-recovery-2026-05-02-1820` (`:11`) |
| S5 | `vault/sessions/2026-05-02-1830-subagents-strategy-execution-and-tensions.md` | `discovery` (`vault/sessions/2026-05-02-1830-subagents-strategy-execution-and-tensions.md:3`) | 2026-05-02 18:30 | `domainspec-subagents-strategy-execution-and-tensions-2026-05-02` (`:11`) |
| S6 | `vault/sessions/2026-05-02-1943-subagents-strategy-premises-review.md` | `findings` (`vault/sessions/2026-05-02-1943-subagents-strategy-premises-review.md:3`) | 2026-05-02 19:43 | `domainspec-subagents-strategy-premises-review-2026-05-02` (`:11`) |

**Non-session files containing `is_session: true` as content, NOT surveyed here**:

- `vault/agent-navigation.md:58` — explanatory paragraph about session nodes.
- `vault/conceptual/epistemic-principles.md:92` — describes the `is_session` flag in a discussion of `node_type` removals.
- `vault/discovery/domainspec-subagents-strategy-definitions/research/agents-strategy-prior-version.md:105` — embeds a frontmatter-block example.
- `vault/discovery/domainspec-vault-foundations/research/epistemic-chain-evidence-survey.md:481`, `:567`, `:627` — inspects sessions S1-style files inside an evidence survey.
- `vault/ontology-conventions.md:57` — schema declaration of the `is_session` field.
- `vault/premise/ontology-premises.md:95`, `:99` — discusses why `session` is not a `node_type`.

These appear in the `grep` because they *quote* or *describe* `is_session: true`; their own frontmatter has `is_session: false`. None of them are session conversation logs and none own the kind of edge data this survey targets.

### F2.0.1 — Structural observations on the 6 sessions

- **No `Connections` table.** None of the 6 session documents contains a `## Connections` section. This is in sharp contrast with the rest of the vault (E1 found `Connections` blocks in nearly every discovery, premise, and constitution). Sessions have, instead, a `## Contradictions` section that doubles as a quasi-Connections table — one bullet per outbound edge — together with `## Files touched`, `## Files referenced`, and free-prose `## Summary` / `## Decisions made`. The absence of a `Connections` block is itself a finding (see F2.5).
- **No `session_ref` field.** Although `vault/ontology-conventions.md:58` defines `session_ref` as the optional pointer "the session that produced this document," not one of the 6 session files declares a `session_ref` (verified by `grep -n "session_ref" vault/sessions/*.md` — zero hits). `session_ref` is forward-pointing (from product → session); the inverse — session → its outputs — is held instead in `## Files touched` lists.
- **`conversation_id` is unique per session** (six distinct values, listed above), so it functions as a stable identity for cross-session reference, but no session points to *another session's* `conversation_id` via a structured field. Cross-session pointers exist only in prose (`## Files referenced`).
- **One session is `node_type: findings`** (S6, the 1943 review), the rest are `node_type: discovery`. The `is_session` flag is orthogonal to `node_type` per `vault/ontology-conventions.md:131`, so this is consistent with the schema.

### F2.1 — Per-session edge harvest (declared edges)

Sessions declare edges via *labeled bullets* at the start of `## Contradictions`. Each bullet's leading verb is the edge label; the linked path is the target. This is the only quasi-formal edge declaration the sessions carry; everything else is inferred prose.

#### S1 — `2026-05-02-1646-agents-strategy-discovery.md` `## Contradictions` (`:26`)

| Line | Edge | Target |
|------|------|--------|
| `:28` | `questions` | `vault/premise/robot-talks-premises.md` |
| `:29` | `validates` | `vault/premise/system-premises.md` |
| `:30` | `derives-from` | `.claude/skills/custom/discovery-writing.md` |
| `:31` | `questions` | `.claude/skills/custom/frontmatter.md` |

#### S2 — `2026-05-02-1711-domainspec-subagents-strategy-redesign.md` `## Contradictions` (`:43`)

| Line | Edge | Target |
|------|------|--------|
| `:45` | `questions` | `vault/discovery/agents-strategy.md` (sibling-duplicate audit) |
| `:46` | `questions` | `vault/discovery/agents-strategy.md` §1 |
| `:47` | `questions` | `vault/discovery/agents-strategy.md` §1 |
| `:48` | `questions` | `vault/discovery/agents-strategy.md` §3.3 |
| `:49` | `questions` | `vault/discovery/agents-strategy.md` §3.8 |
| `:50` | `questions` | `vault/discovery/agents-strategy.md` connections table |
| `:51` | `supersedes` | `vault/discovery/agents-strategy.md` §2 model-selection |
| `:52` | `supersedes` | `vault/discovery/agents-strategy.md` §3.4 lifecycle |

#### S3 — `2026-05-02-1723-domainspec-vault-foundations-redesign.md` `## Contradictions` (`:26`)

| Line | Edge | Target |
|------|------|--------|
| `:28` | `contradicts` | `vault/axiom/ontology-axioms.md` (orthogonality-as-axiom) |
| `:29` | `questions` | `vault/ontology-conventions.md` (discovery node_type definition) |

#### S4 — `2026-05-02-1820-domainspec-vault-foundations-oq-resolutions-and-recovery.md` `## Contradictions` (`:46`)

| Line | Edge | Target |
|------|------|--------|
| `:48` | `caused` | `vault/discovery/domainspec-vault-foundations/domainspec-subagents-strategy.md` (Phase 2 false-success) |
| `:49` | `questions` | `vault/ontology-conventions.md` |
| `:50` | `questions` | `vault/discovery/domainspec-vault-foundations/robots-talks/robots-discussing.md` |
| `:51` | `questions` | `vault/premise/robot-talks-premises.md` |
| `:52` | `questions` | `vault/discovery/domainspec-vault-foundations/README.md` |

#### S5 — `2026-05-02-1830-domainspec-subagents-strategy-execution-and-tensions.md` `## Contradictions` (`:28`)

| Line | Edge | Target |
|------|------|--------|
| `:30` | `validates` | `vault/discovery/domainspec-vault-foundations/domainspec-subagents-strategy.md` |
| `:31` | `~~questions~~ validates` | `vault/ontology-conventions.md` |
| `:32` | `~~questions~~ validates` | `TUNING-LOOP.md` |
| `:33` | `validates` | `vault/discovery/domainspec-vault-foundations/scope-and-domain-axes.md` OQ-5 |
| `:34` | `validates` | `vault/discovery/domainspec-vault-foundations/scope-and-domain-axes.md` OQ-6 |

Note: S5 demonstrates an interesting pattern — strikethrough-then-replace (`~~questions~~ validates`) showing intra-session edge transitions where an opening contradiction was resolved before the session closed. This implicitly encodes a **state-change edge over the same target**; it is currently markdown-formatting, not structured.

#### S6 — `2026-05-02-1943-domainspec-subagents-strategy-premises-review.md` `## Contradictions` (`:26`)

| Line | Edge | Target |
|------|------|--------|
| `:28` | `validates` | `vault/premise/domainspec-subagents-strategy-premises.md` |
| `:29` | `validates` | `vault/discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md` |
| `:30` | `contradicts` | `vault/premise/domainspec-subagents-strategy-premises.md` v0.2.0 |
| `:31` | `contradicts` | `vault/premise/domainspec-subagents-strategy-premises.md` v0.2.0 |

### F2.2 — Table A — Declared edges (aggregate)

Counting unique edge bullets across all six sessions' `## Contradictions` blocks:

| Edge | Count | Sessions using it | Sample target | Direction |
|------|-------|-------------------|---------------|-----------|
| `questions` | 13 | S1 (×2), S2 (×6), S3 (×1), S4 (×4) | `vault/discovery/agents-strategy.md` §1 (S2 `:46`) | session → target (raises a doubt or open question against target) |
| `validates` | 8 | S1 (×1), S5 (×5 incl. 2 strikethrough-replaced), S6 (×2) | `vault/premise/system-premises.md` (S1 `:29`); `vault/discovery/domainspec-vault-foundations/domainspec-subagents-strategy.md` (S5 `:30`) | session → target (asserts target was empirically held this turn) |
| `supersedes` | 2 | S2 (×2) | `vault/discovery/agents-strategy.md` §2 (S2 `:51`) | session → target (records a deprecation decision) |
| `contradicts` | 3 | S3 (×1), S6 (×2) | `vault/axiom/ontology-axioms.md` (S3 `:28`); `vault/premise/domainspec-subagents-strategy-premises.md` v0.2.0 (S6 `:30`) | session → target (records an active conflict) |
| `derives-from` | 1 | S1 (×1) | `.claude/skills/custom/discovery-writing.md` (S1 `:30`) | session → ancestor (intellectual lineage; conformance) |
| `caused` | 1 | S4 (×1) | `vault/discovery/domainspec-vault-foundations/domainspec-subagents-strategy.md` (S4 `:48`) | session → effect (records a process incident — the subagent dispatched **from this session** caused the bad state) |

**Total declared edge instances across the 6 sessions: 28.**

Observations:

- `questions` dominates (13/28 ≈ 46%). Sessions overwhelmingly use the `## Contradictions` block to lodge open critiques against target documents, not to commit firm `contradicts`.
- `validates` is the second-most common (8/28 ≈ 29%), and several of these are S5's *intra-session retraction-and-replacement* of earlier `questions` edges from the same conversation thread — i.e. resolved-within-session.
- `caused` (S4 `:48`) is **a session-only edge** that does not appear in `ontology-conventions.md` Appendix C and was not catalogued in E1's vault-wide survey. It is functionally identical to "this session is responsible for the bad state at target X" — i.e. it's the negative-effect twin of `creates`/`modifies` (see Table B and F2.4).
- `supersedes` and `contradicts` are normal vault edges (Appendix C) used here in their normal sense; sessions just happen to be the document type *making* the supersession claim.
- No edges named `continues-from`, `forks-from`, `creates`, `modifies`, `revisits`, `refutes`, `opens-question`, or `closes-question` appear declared in any session's `## Contradictions` block. Verified by `grep -in "continues-from\|forks-from\|opens-question\|closes-question\|revisits" vault/sessions/*.md` returning zero matches against bullet labels.

### F2.3 — Table B — Inferred-but-undeclared edges

Sessions imply many cross-document and cross-session relationships that are **not** captured by the bullet-label edges in `## Contradictions`. Below is the harvest of such patterns.

| Pattern | Count | Sample sessions | Sample targets | Proposed edge name |
|---------|-------|-----------------|----------------|-------------------|
| Session **created** a brand-new document during its turn | 7 | S1 (premises + discovery), S2 (domainspec-subagents-strategy.md), S3 (5 research files), S4 (consolidated research, 1245 lines) | `vault/premise/agent-dispatch-premises.md` (S1 `:35`); `vault/discovery/domainspec-vault-foundations/domainspec-subagents-strategy.md` (S2 `:87`); `vault/discovery/domainspec-vault-foundations/research/scope-and-domain-axes-evidence.md` (S4 `:96`) | `creates` |
| Session **modified** an existing document during its turn (non-superseding edits) | 13+ | S2 (TUNING-LOOP `:90`), S3 (frontmatter memory files `:42-46`), S4 (epistemic-chain `:94`), S5 (multiple `## Files touched` `:38-45`), S6 (premises + discovery `:35-36`) | `TUNING-LOOP.md`; `vault/discovery/domainspec-vault-foundations/epistemic-chain.md`; `vault/ontology-conventions.md` | `modifies` |
| Session **continues** the work of a prior session (linear chain, same conversation_id family) | 3 | S2's addendum (`:93` "## Execution log addendum (continuation later 2026-05-02)" — same file, later turn); S4 → S2 (`:116` "recovery vector for Option 1 merger"); S5 → S2 (`:43` references S2 in Files referenced) | S2's own addendum continues S2; S4 continues S2's redesign; S5 continues both S2 and S4 | `continues-from` |
| Session **revisits** decisions made in a prior session (re-opens, doesn't strictly continue) | 2 | S4 explicitly **reverts** an earlier intra-session rename (`:24` "OQ-2 ... reverts the earlier intra-session `agents-strategy` rename"); S5 (`:26`) re-scopes work that S4 left pending | `vault/sessions/2026-05-02-1646-agents-strategy-discovery.md` (S1, "origin of the agents-strategy / domainspec-subagents-strategy track" S4 `:118`); decisions deferred in S4 picked up in S5 | `revisits` |
| Session **refutes/reverses** a previously settled decision | 1 | S4 `:24` reverses the prior rename `domainspec-subagents-strategy` → `agents-strategy` (originally settled in S2's predecessor stream) | The earlier `agents-strategy` rename | `refutes` (or specialise: `reverses-decision`) |
| Session **forks** a prior thread to handle a different concern | 0 candidates with strong signal | (none clearly identified — S6 is sequential after S5, not a fork) | — | `forks-from` (no current witnesses) |
| Session **opens an open question** that downstream sessions later close | ≥5 | S2 opens OQ-A, OQ-B, OQ-C, OQ-D, OQ-E (`:65-69`); S3 contradiction `:28-29` opens questions about `ontology-axioms.md` and `ontology-conventions.md`; S4 opens OQ-NEW-1..5 (`:54-60`) | OQ-A, OQ-B, OQ-C explicitly resolved in S4 (`:24` "epistemic-chain OQ-3/4/5 ... domainspec-subagents-strategy OQ-1/2/4 plus partial OQ-3") | `opens-question` |
| Session **closes an open question** opened in a prior session | ≥6 | S4 `:24` closes 6 OQs ("OQ-3", "OQ-4", "OQ-5", "OQ-1", "OQ-2", "OQ-4"); S5 `:33-34` closes scope-and-domain OQ-5 and OQ-6 inline | Open questions enumerated in S2 and `vault/discovery/domainspec-vault-foundations/epistemic-chain.md` | `closes-question` |
| Session **promotes a candidate** premise (intentional graduation event) | 1 | S4 promotes `P-SS-11` via `promoted_candidates: [P-SS-11]` (`:15`) and §"Promoted candidate — P-SS-11" (`:62-75`) | `vault/premise/domainspec-subagents-strategy-premises.md` (intended target file once swept) | `promotes` (already an Appendix C edge, but applied implicitly via frontmatter) |
| Session **acknowledges a self-witnessed inconsistency** (the session itself causes a problem) | 2 | S4 `:48` "**caused** ... Subagent C overwrote ... a subagent dispatch from this conversation"; S5 `:30` "Phase 2 applier originally fabricated success ... recovery edits then applied directly via Edit" | `vault/discovery/domainspec-vault-foundations/domainspec-subagents-strategy.md` (the file Subagent C broke) | `causes` (action-edge) — currently surfaced inline as `caused` |
| Session **renames** a file (special case of modify with identity change) | 3 | S4 renames `agent-dispatch-premises.md` → `domainspec-subagents-strategy-premises.md` (`:39`, `:97`); S4 renames `agents-strategy.md` → `domainspec-subagents-strategy.md` (`:39`, `:95`); identity-aliasing | `vault/premise/domainspec-subagents-strategy-premises.md` etc. | candidate `renames` (likely fold into `modifies` with a rename note) |
| Session **deletes** an existing document | 5 | S4 `:100-106` lists 5 deleted files (T1-T4 + SYNTHESIS) | `vault/discovery/domainspec-vault-foundations/research/T1-empirical-history.md` etc. | `deletes` (no current edge captures this) |
| Session **dispatches** subagents (operational provenance) | 4 | S2 `:97` Phase 1 + Phase 2 dispatches; S4 `:26` "Three subagents were dispatched in parallel"; S5 `:24` "two readers + a synthesizer ... two reviewers + applier"; S6 `:24` "three-agent review" | The subagent runs themselves (currently no node) | `dispatches` (operational, not knowledge — but may need edge if subagent runs ever become nodes) |
| Session **flags** a future task / pending recovery edit | many | S2 `:71-79` "Next steps"; S4 `:77-89` "Pending recovery edits"; S5 `:85-95` "Carried forward" | Specific TODO items pointing at named files | candidate `flags-pending` — likely fold into `references` with prose; not strong enough for its own edge |
| Session **inherits-context-from** an earlier session ("Files referenced" block) | 4 | S4 `:115-124` lists 5 referenced files including 3 prior sessions; S5 `:43` references S2; S2 `:117-126` references discovery and premise files | S4 → S2, S3, S1 (sessions); S2 → discovery files (non-session) | `cites` (already an Appendix C edge) — currently implicit in "Files referenced" |
| Session **adds-turn-to** a multi-turn discussion document (not a separate session, but a post inside an existing discussion) | 1 | S4 `:30` "added Turn 3.5 to robots-discussing.md ... self-witness naming the Phase 2 false-success" | `vault/discovery/domainspec-vault-foundations/robots-talks/robots-discussing.md` | candidate `adds-turn-to` (very specialized; could be folded into `modifies`) |

**Total inferred-but-undeclared edge instances: ≈45 distinct relationships across ~13 patterns.**

### F2.4 — Comparison to candidate session-edge set

The user-agreed candidate session-specific edges are: **`continues-from`, `forks-from`, `creates`, `modifies`, `revisits`, `refutes`**. For each:

#### `continues-from`

- **Declared in vault sessions**: 0. No session uses the literal label `continues-from`.
- **Inferred but undeclared**: 3 strong cases.
  1. S2's "Execution log addendum (continuation later 2026-05-02)" (`vault/sessions/2026-05-02-1711-subagents-strategy-redesign.md:93`) is itself a within-file continuation; it documents that the session was reopened later the same day to add content. This is a *self*-continuation that should arguably be a separate session declaring `continues-from` S2.
  2. S4 → S2, declared in prose: `vault/sessions/2026-05-02-1820-vault-foundations-oq-resolutions-and-recovery.md:116` "vault/sessions/2026-05-02-1711-subagents-strategy-redesign.md (recovery vector for Option 1 merger)". This is the load-bearing case — a downstream session continues to apply the upstream session's pending decisions. Currently held only in prose, not as a structured edge.
  3. S5 → S2 / S4, declared in `## Files touched` (`vault/sessions/2026-05-02-1830-subagents-strategy-execution-and-tensions.md:43` and prose body `:24`).
- **Sessions that would benefit**: S2's addendum (`:93`); S4 (whose entire purpose is to re-execute pending work from S2); S5 (executes Phase 1 of "the 1711 domainspec-subagents-strategy redesign" — directly continues S2).
- **Verdict**: high-value edge. Strong inferred presence, zero declared. Adopt.

#### `forks-from`

- **Declared in vault sessions**: 0.
- **Inferred but undeclared**: 0 strong cases.
- **Sessions that would benefit**: none currently. The 6-session corpus appears to be linear (each session continues or revisits earlier work), not branching. The only fork-like pattern is S3 spinning up a parallel `domainspec-vault-foundations-redesign` track at the same time as S1/S2's `domainspec-subagents-strategy` track, but they were independent rather than branched-from a common parent.
- **Verdict**: speculative. No current witnesses. Keep as candidate (the corpus is 1 day old; forks are a *future* expectation), but flag as **0 evidence at survey time**.

#### `creates`

- **Declared in vault sessions**: 0 (no `creates` bullet appears in any session's `## Contradictions`).
- **Inferred but undeclared**: 7 strong cases captured implicitly in `## Files touched` blocks.
  - S1 produced `vault/premise/agent-dispatch-premises.md` and `vault/discovery/agents-strategy.md` (`vault/sessions/2026-05-02-1646-agents-strategy-discovery.md:35-36`).
  - S2 produced `vault/discovery/domainspec-vault-foundations/domainspec-subagents-strategy.md` ("CREATED via Phase 1 merge — 277 lines", `vault/sessions/2026-05-02-1711-subagents-strategy-redesign.md:87`).
  - S3 produced 11 new files including 5 research files, 3 discoveries, 1 README, and 2 memory files (`vault/sessions/2026-05-02-1723-vault-foundations-redesign.md:33-46`).
  - S4 produced `vault/discovery/domainspec-vault-foundations/research/scope-and-domain-axes-evidence.md` ("NEW — consolidates T1+T2+T3+T4+SYNTHESIS; node_type: research; ~1245 lines", `:96`).
- **Sessions that would benefit**: every session except possibly S6.
- **Verdict**: high-value edge. The information is currently held as flat prose in `## Files touched` with no semantic distinction between created vs modified. Adopt.

#### `modifies`

- **Declared in vault sessions**: 0.
- **Inferred but undeclared**: 13+ cases across all 6 sessions, captured in `## Files touched` (always alongside `creates` cases, with no markup distinction).
  - S2 modified `TUNING-LOOP.md` ("UPDATED — line 19 pipeline now shows upstream stages", `:90`).
  - S4 modified `epistemic-chain.md` ("D-7 + D-8 added; D-4 softened", `:94`); `domainspec-subagents-strategy.md` (extensive overlay edits `:95`); etc.
  - S5 modified `ontology-conventions.md`, `TUNING-LOOP.md`, `domainspec-subagents-strategy.md` (declared in frontmatter `specs_updated:` field at `vault/sessions/2026-05-02-1830-subagents-strategy-execution-and-tensions.md:14`).
  - S6 modified `domainspec-subagents-strategy-premises.md` and `domainspec-subagents-strategy.md` (frontmatter `specs_updated:` `vault/sessions/2026-05-02-1943-subagents-strategy-premises-review.md:14`).
- **Sessions that would benefit**: every session.
- **Verdict**: high-value edge. Note that the frontmatter `specs_updated: [...]` field (defined in `vault/ontology-conventions.md` schema) already partially encodes this — but only S5 and S6 populate it; S1–S4 leave it as `[]`. Either populate `specs_updated` consistently (and treat it as the structured form of `modifies`), or introduce `modifies` as a Connections-block edge. Recommend the latter for symmetry with `creates`.

#### `revisits`

- **Declared in vault sessions**: 0.
- **Inferred but undeclared**: 2 strong cases.
  - S4 `:24` "OQ-2 ... reverts the earlier intra-session `agents-strategy` rename" — the revisit is of a decision made in S1's track and partially applied in S2.
  - S5 `:26` "User re-scoped the thread to domainspec-subagents-strategy only ('ignore robot-talks', 'domainspec-subagents-strategy is a valid node now')" — explicit revisit of which subset of the previous session's tensions to act on.
- **Sessions that would benefit**: S4 (revisits S2's pending decisions and S1's track); S5 (revisits S2's deferred Phase 4).
- **Verdict**: medium-high value. Pattern is real but rare in the current corpus; will become more common as more sessions chain. Adopt, but it overlaps semantically with `continues-from` — recommend explicit operational distinction: `continues-from` = picks up where the prior session left off (sequential); `revisits` = re-opens a *closed* prior decision, possibly to refute or re-decide.

#### `refutes`

- **Declared in vault sessions**: 0 with the literal `refutes` label.
- **Inferred but undeclared**: 1 strong case + several weaker.
  - Strong: S4 `:24` reversing the `agents-strategy` rename — refutes a decision made in the same conversation track. Note that S2 itself uses `supersedes` (`:51-52`) to refute earlier decisions in `agents-strategy.md`, but that target is a discovery, not a session — so it's not session→session.
  - Weaker: S6 `:30-31` `contradicts vault/premise/domainspec-subagents-strategy-premises.md v0.2.0` — refutes a *version* of a target rather than a different session's decision; this is well-modelled by the existing `contradicts` edge.
- **Sessions that would benefit**: S4 (the rename reversal). 
- **Verdict**: medium value. Could fold into `contradicts` + `supersedes` (the existing pair) **except** when the target of the refutation is a *session decision* that hasn't yet hardened into a discovery edit. In that narrow case, `refutes` is useful — otherwise prefer the existing pair. Recommend keep as candidate but with operational restriction: `refutes` applies only between session documents (session A refutes a decision recorded in session B); cross-type refutations should use `contradicts` + `supersedes`.

#### Summary table — candidate-set comparison

| Candidate edge | Declared count | Inferred count | Adopt? | Notes |
|---|---|---|---|---|
| `continues-from` | 0 | 3 | Yes | Strong inferred signal; unambiguously needed for chain reconstruction |
| `forks-from` | 0 | 0 | Provisional | No current witnesses; corpus is 1 day old |
| `creates` | 0 | 7+ | Yes | High frequency; currently buried in `## Files touched` prose |
| `modifies` | 0 | 13+ | Yes | Highest frequency; partially captured by frontmatter `specs_updated`, inconsistently |
| `revisits` | 0 | 2 | Yes | Real pattern; needs operational distinction from `continues-from` |
| `refutes` | 0 (label) | 1 | With restriction | Only when target is another session's decision; otherwise use `contradicts` + `supersedes` |

### F2.5 — Gaps — patterns not covered by candidate set or universal edges

Patterns observed in the 6-session corpus that the candidate set (`continues-from`, `forks-from`, `creates`, `modifies`, `revisits`, `refutes`) and the universal edges (`derives-from`, `contradicts`, `cites`) do **not** cleanly cover:

#### G1 — `opens-question` / `closes-question`

- **Evidence**: S2 opens OQ-A through OQ-E (`vault/sessions/2026-05-02-1711-subagents-strategy-redesign.md:65-69`); S4 closes 6 of those (S4 `:24` and `:33-43` Decisions D1-D8 each map to a closed OQ); S4 itself opens OQ-NEW-1 through OQ-NEW-5 (`vault/sessions/2026-05-02-1820-vault-foundations-oq-resolutions-and-recovery.md:54-60`); S5 closes 2 more inline (`:33-34`).
- **Why the candidate set doesn't cover this**: `continues-from` is too coarse; an open question is a specific structured artifact ("OQ-X"), and which session opens it / closes it / leaves-it-pending is materially different from "session 2 generally continues session 1." Open questions are the unit of accumulated debt; an explicit edge makes the debt queryable.
- **Recommendation**: adopt `opens-question` and `closes-question` as session-specific edges. The target should be the OQ identifier (a structured fragment of a discovery doc, e.g. `epistemic-chain.md#OQ-3`).
- **Alternative**: fold into `modifies` with a `kind: open-question` annotation — weaker because annotations aren't queryable as edges.

#### G2 — `causes` / `caused`

- **Evidence**: S4 declares `caused vault/discovery/domainspec-vault-foundations/domainspec-subagents-strategy.md (Phase 2 false-success)` (`vault/sessions/2026-05-02-1820-vault-foundations-oq-resolutions-and-recovery.md:48`). This is a *negative-effect* edge — the session itself, via subagents it dispatched, caused harmful state at the target.
- **Why the candidate set doesn't cover this**: `modifies` is value-neutral; `caused` is specifically blame-attributing for a process incident. The user uses this kind of self-witness to feed the tuning loop (see S4's importance_rationale `:17` and the P-SS-11 promotion).
- **Recommendation**: adopt `caused` (negative-effect; provenance for incidents) — or **fold into `modifies` with severity prose**, because the only declared case is unambiguous from context. Provisional vote: fold, but record the convention so the tuning loop can discover incidents by grepping for `caused` keyword inside Contradictions.

#### G3 — `dispatches` (subagent provenance)

- **Evidence**: every session except S6 documents subagent dispatches with named roles (S2 `:97`, S4 `:26`, S5 `:24`, S6 `:24`). Currently captured only as prose.
- **Why the candidate set doesn't cover this**: subagent runs aren't currently nodes in the vault; if they become first-class nodes (the `domainspec-subagents-strategy.md` D-11 three-file output set is moving toward this), `dispatches` would be the natural session → subagent-run edge.
- **Recommendation**: defer until subagent-run nodes exist. Currently can be folded into `creates` (when the dispatch produces persisted research/findings files in `/research/`).

#### G4 — `deletes`

- **Evidence**: S4 `:100-106` deletes 5 research files. No edge captures deletion.
- **Why the candidate set doesn't cover this**: `creates` and `modifies` cover positive changes; deletion is the absence of a node. Sessions deleting files is rare but real.
- **Recommendation**: fold into `modifies` (a deletion is the most extreme modification). If the deleted file's incoming edges need to be re-pointed, that is a separate concern. Don't introduce `deletes` for the 5-witness corpus.

#### G5 — `renames` / `aliases`

- **Evidence**: S4 renames two files (`:39`, `:95`, `:97`). Sessions S1's `agent-dispatch-premises.md` was later renamed to `domainspec-subagents-strategy-premises.md` per S4's D-6.
- **Why the candidate set doesn't cover this**: a rename is identity-preserving but path-changing — it's neither pure `modifies` (which expects same path) nor pure `creates` (which expects new identity).
- **Recommendation**: fold into `modifies` with a rename note. Alternative is to add `aliases` (an identity edge: A `aliases` B means same node, two paths) — but for the current corpus the modify+note pattern is sufficient.

#### G6 — `promotes` (candidate → premise)

- **Evidence**: S4 has `promoted_candidates: [P-SS-11]` in frontmatter (`vault/sessions/2026-05-02-1820-vault-foundations-oq-resolutions-and-recovery.md:15`) and a "## Promoted candidate — P-SS-11" body section (`:62-75`).
- **Why the candidate set doesn't cover this**: the candidate-set is structural-relationship-focused; `promotes` is a *graduation event* on the epistemic chain.
- **Recommendation**: this is already covered by Appendix C `promotes` (universal edge). Sessions should use it. The current frontmatter field `promoted_candidates: [...]` is a parallel encoding. Recommend consolidating: add a Connections-block `promotes` row in addition to keeping the frontmatter list.

#### G7 — Cross-session conversation threads beyond linear continuation

- **Evidence**: S4 references three prior sessions simultaneously (S1, S2, S3 — `vault/sessions/2026-05-02-1820-vault-foundations-oq-resolutions-and-recovery.md:116-118`), each with a different role (recovery vector, precedent, origin). This is a **DAG of session relationships**, not a chain.
- **Why the candidate set doesn't cover this**: `continues-from` is a single-parent edge; `revisits` is single-target. A session that simultaneously continues one thread, revisits another, and is grounded by a third needs three distinct edges.
- **Recommendation**: the candidate set with `continues-from` + `revisits` + `cites` (universal) actually already covers the DAG correctly when each edge has its own row. Make sure documentation states: **a session may declare multiple `continues-from` / `revisits` / `cites` edges; cardinality is N:M**.

#### G8 — Strikethrough-then-replace state-change pattern

- **Evidence**: S5 `## Contradictions` lines `:31-32` literally show `~~questions~~ **validates**` markup — same target, edge transition observed within the session.
- **Why the candidate set doesn't cover this**: this is a within-session edge state change. Currently encoded only as markdown formatting.
- **Recommendation**: structurally, this should be modeled as two edges with timestamps (or with an explicit "this edge supersedes that one" intra-document supersession). Defer to the canonical-edge design: use the `supersedes` edge to point from the new edge declaration to the old one — but this is graph-of-edges territory and probably premature.

#### G9 — `inherits-context-from`

- **Evidence**: every session has a `## Files referenced` section listing prior documents whose content the session assumed-as-given without modifying. E.g., S4 `:115-124` lists 5 such files.
- **Why the candidate set doesn't cover this**: `cites` (universal) covers most of this. The few cases where the inheritance is stronger (e.g., a session was bound by another session's premises) are well-covered by `derives-from`.
- **Recommendation**: fold into `cites` + `derives-from`. No new edge needed.

### F2.6 — Synthesis — recommendation for the canonical session-edge subset

Based on the 6-session corpus:

**Adopt all six candidate edges** (`continues-from`, `forks-from`, `creates`, `modifies`, `revisits`, `refutes`), with these notes:
- `forks-from` has no current witnesses; admit it on a forward-looking basis.
- `refutes` should be operationally restricted to session→session refutations of decisions; cross-type refutations use the existing `contradicts` + `supersedes`.

**Add two more session-specific edges**:
- `opens-question` — session → OQ-id
- `closes-question` — session → OQ-id

**Fold these inferred patterns into existing edges (do not introduce new ones)**:
- "Session caused harmful state" → use `modifies` with prose annotation; or repurpose `caused` if a separate edge is wanted (one current witness, S4 `:48`).
- "Session deletes file" → `modifies` with a deletion note.
- "Session renames file" → `modifies` with a rename note.
- "Session inherits context" → `cites` (universal) or `derives-from` if the inheritance is binding.
- "Session promotes candidate" → existing Appendix C `promotes`; align with frontmatter `promoted_candidates`.
- "Session dispatches subagent" → defer until subagent runs are nodes; otherwise `creates` for persisted output files.

**Structural recommendation for sessions going forward**:
- Add a `## Connections` block (currently missing in all 6 sessions) with explicit rows for `creates`, `modifies`, `continues-from`, `revisits`, `opens-question`, `closes-question`, `cites`, `derives-from`, etc.
- Keep `## Contradictions` for `questions`, `contradicts`, `validates`, `supersedes` (the in-conversation epistemic-state-update edges) — these are conceptually different from structural relationship edges and the separation is useful.
- Populate frontmatter `session_ref` consistently in *target* documents (the inverse channel) — currently zero target documents declare it; the inverse is reconstructable today only by parsing every session's `## Files touched`.

### F2.7 — Open questions surfaced by F2

- **OQ-F2-1.** Should `caused` be a first-class session edge (negative-effect provenance for incidents fed to the tuning loop), or a prose convention inside `modifies`? One witness only (S4 `:48`); insufficient to decide alone.
- **OQ-F2-2.** Should `opens-question` / `closes-question` target the OQ identifier inside a discovery doc (`epistemic-chain.md#OQ-3`) or the discovery doc itself? The fragment-level target is more precise but requires the canonical edge subset to support fragment targets.
- **OQ-F2-3.** When a session declares `~~questions~~ validates` markup (S5 `:31`), should this be one edge with a state attribute, two edges with timestamps, or two edges with one explicitly superseding the other? Affects edge schema, not just session syntax.
- **OQ-F2-4.** The session frontmatter has `specs_updated: [...]` (S5 `:14`, S6 `:14`). Should this field be deprecated in favor of explicit `modifies` Connections rows? Or kept as a queryable mirror? Sessions S1-S4 leave it `[]` despite having modified files — suggests inconsistency that won't self-resolve without a hook.
- **OQ-F2-5.** None of the 6 sessions has a `## Connections` block. Is this an intentional convention (sessions use `## Contradictions` + `## Files touched` instead), or a drift gap? Recommend adopting `## Connections` for structural edges and reserving `## Contradictions` for epistemic-state edges — but this needs user ratification.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [../../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md](../../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md) | `modified-by` | The 2026-05-03 cross-boundary-rule + edges-hygiene session executed an in-content rename sweep at this file's new location (folder renamed `vault-edges/` → `domainspec-vault-edges/`). |
