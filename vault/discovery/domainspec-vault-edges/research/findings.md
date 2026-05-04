---
tags: [vault, domainspec-vault-edges, findings]
node_type: subagents-findings
is_session: false
layer: ontology
scope: ontology
domain: knowledge-graph
nature: reference
status: draft
veracidade: medium
convicção: high
version: 0.1.0
last_updated: 2026-05-02
---

# Findings — Proposed Minimum Viable Vault Edge Catalog

> Synthesized output of the domainspec-vault-edges dispatch. Reads E1 (vault survey), E2 (taxonomy survey), E3 (compatibility matrix) from `research.md` and proposes a minimum viable edge catalog for the main thread to consume when authoring `domainspec-vault-edges.md` (the parent discovery, not written here).

---

## Executive Summary

We propose a **20-edge minimum viable catalog** spanning 7 categories (structural, provenance, codification, lifecycle, governance, conflict, reference). 18 of the 20 edges already appear in active vault usage per E1; the remaining 2 (`instance-of`, `part-of`) are vault-rare but have strong taxonomy precedent in RDF/OWL, BFO/DOLCE, and Wikidata, justifying inclusion. The catalog deliberately consolidates the current 35-edge vault sprawl by deduplicating inverses (`grounds`/`grounded-by`/`superseded-by`/`produced-by` are visualization-deduped per the `ontology-conventions.md` bidirectionality rule), folding overlapping forms (`instantiates`/`instances`/`exemplifies` -> `instance-of`), and excluding domain-axis-specific edges (`split-into`, `cross-cuts`, `historically-derived-from`) which belong in a separate growth-operations catalog. Confidence is **medium-high** for the structural/provenance/codification core (these edges are mandated by `epistemic-chain.md` D-1 through D-9 or have at least 7 vault uses); **medium** for the lifecycle/governance set (semantically clear, less battle-tested); **lower** for the conflict/reference edges where the vault and taxonomies diverge most.

---

## The Proposed Minimum Viable Edge Catalog

| # | Edge | Source `node_type` | Target `node_type` | Cardinality | Direction | Example use | Evidence |
|---|------|--------------------|--------------------|-------------|-----------|-------------|----------|
| 1 | `derives-from` | discovery, premise, axiom, constitution, implementation-plan, spec, audit, research, findings | research, discovery, premise, axiom, conceptual, domainspec-subagents-strategy | N:M | unidirectional (`grounds` deduped inverse) | `epistemic-chain.md derives-from scope-and-domain-axes.md` | E1 (84), E2 (Wikidata "based on"), E3 (chain-mandated D-1) |
| 2 | `subclass-of` | conceptual, premise (domain-axis values) | conceptual, premise | N:1 (tree-constrained) | unidirectional | `biochemistry subclass-of biology` | E1 (25), E2 (RDF `rdfs:subClassOf`, Wikidata P279), E3 |
| 3 | `instance-of` | discovery, conceptual | conceptual | N:1 | unidirectional | `robots-discussing.md instance-of discussion` | E2 (RDF `rdf:type`, Wikidata P31, BFO/DOLCE), E3 — *vault-novel; taxonomy-precedented* |
| 4 | `part-of` | conceptual, spec | conceptual, spec | N:1 | unidirectional | `event-store part-of event-system` | E1 (1, rare), E2 (BFO/DOLCE/Wikidata P361), E3 — *vault-rare; taxonomy-precedented* |
| 5 | `codified-as` | premise, axiom, discovery | constitution | 1:N | unidirectional | `domainspec-subagents-strategy-premises.md codified-as domainspec-subagents-strategy-constitution.md` | E1 (20), E3 (chain-mandated D-4) |
| 6 | `operationalized-by` | constitution, discovery | (skill / code) | 1:N | unidirectional | `event-system-constitution.md operationalized-by event-system.skill` | E1 (39), E3 (chain-mandated D-4) |
| 7 | `implements` | spec | constitution, implementation-plan | N:1 | unidirectional | `event-store.spec implements event-system-constitution.md` | E1 (4), E2 (no direct), E3 (Appendix C) |
| 8 | `validates` | audit, test, research | premise, axiom, spec | N:1 | unidirectional | `event-system-audit.md validates P-SYS-9` | E1 (11), E3 (chain-mandated D-5) |
| 9 | `produces` | domainspec-subagents-strategy | research, findings | 1:N | unidirectional (`produced-by` deduped inverse) | `domainspec-subagents-strategy.md produces research.md` | E1 (6), E3 (chain-mandated for dispatch artifact set per P-SS-9) |
| 10 | `cites` | research, findings, audit, conceptual | any | N:M | unidirectional | `research.md cites ontology-conventions.md` | E1 (1), E2 (Wikidata P2860 most-used) |
| 11 | `provenance-for` | (session) | discovery, premise | 1:N | unidirectional | `2026-05-02-1820-...md provenance-for epistemic-chain.md` | E1 (3), E3 (vault-specific) |
| 12 | `supersedes` | discovery, implementation-plan, constitution | (same node_type) | 1:1 | unidirectional (`superseded-by` deduped inverse) | `v2-discovery.md supersedes v1-discovery.md` | E1 (4), E2 (Schema.org attic), E3 (chain-mandated D-8) |
| 13 | `updates` | discovery, premise, constitution, spec | (same node_type) | 1:1 | unidirectional | `event-system-constitution.md v2.2 updates v2.1` | E1 (2), E3 (Appendix C) |
| 14 | `deprecates` | discovery, constitution | (any) | 1:N | unidirectional | `new-discovery deprecates old-tag-convention` | E1 (2), E2 (Schema.org attic), E3 (Appendix C) |
| 15 | `refines` | discovery, spec | discovery, spec, constitution | N:1 | unidirectional | `epistemic-chain.md refines ontology-conventions.md` | E1 (7), E3 (Appendix C) |
| 16 | `governed-by` | discovery, implementation-plan, spec | discovery, constitution | N:1 | unidirectional | `robot-talks.md governed-by scope-and-domain-axes.md (D-14)` | E1 (2), E3 (vault-specific) |
| 17 | `contradicts` | any | any | N:M | bidirectional (visualization-deduped) | `audit.md contradicts P-SYS-9` | E1 (17), E2 (RDF `disjointWith` weaker analog), E3 (chain-mandated) |
| 18 | `alternative-to` | discovery (Alternatives section) | (rejected design) | 1:N | unidirectional | `A-9 alternative-to D-10` | E1 (2), E3 (Appendix C) |
| 19 | `references` | any | any | N:M | unidirectional | `domainspec-subagents-strategy.md references ontology-conventions.md` | E1 (9), E2 (Wikidata source/reference), E3 |
| 20 | `contextualizes` | conceptual, discovery | any | N:M | unidirectional | `fidc-and-credit-rights.md contextualizes credit-rights-spec.md` | E1 (15), E3 (Appendix C) |

**Optional 21st** — `questions` (E1: 4 uses; Appendix C; useful for exploratory edges from audit/discovery/conceptual). Borderline — could be folded into `references` with descriptive prose. Left here as a +1 candidate the main thread may admit or reject.

---

## Edges Intentionally Omitted

| Omitted edge | Reason for omission |
|--------------|---------------------|
| `grounds`, `superseded-by`, `produced-by`, `grounded-by` | Inverses of `derives-from`, `supersedes`, `produces`. Per `ontology-conventions.md` Section 8 bidirectionality rule, the SQL/visualization layer computes inverses; authoring both directions in Markdown is redundant. Authors write the forward direction. |
| `instantiates`, `exemplifies`, `instances` (plural) | All overlap with `instance-of`. `instance-of` is canonical (matches Wikidata P31). The other three are folded in. |
| `split-into`, `merged-into`, `cross-cuts`, `historically-derived-from` | Domain-axis growth-operation and DAG edges per `scope-and-domain-axes.md` D-10/D-11. Belong in a separate `domain-axis-edges` catalog, not the primary inter-document edge set. |
| `extends`, `generalizes` | Used in `domainspec-subagents-strategy-premises.md` Connections; semantically subsumed by `subclass-of` (between premises) and `refines` (between rules). Reduce vocabulary. |
| `scoped-by`, `shape-contract-for` | One-off edges in `domainspec-subagents-strategy-premises.md`. Domain-specific (templates, premise-dispatch scoping); fold into `references` with descriptive prose. |
| `applies-to` | Named in the prompt's known-edges list; 0 vault uses. No adoption case. |
| `resolves` | E1: 3 uses; semantically subsumed by `supersedes` (discovery resolves an OQ by superseding the question's home document) or `validates` (test resolves a question by providing evidence). Candidate for deprecation. |
| `depends-on` | E1: 3 uses; semantics overlap with `derives-from` (intellectual) or `references` (structural). Candidate for deprecation pending a clear runtime-dependency use case. |
| `equivalent-to`, `disjoint-with`, `same-as` | RDF/OWL has these; the vault has no current use case. Surface as open questions (OQ-E3-2, OQ-E3-3) for the main thread. |

---

## Open Questions for the Main Thread

The main thread must resolve these before authoring `domainspec-vault-edges.md`:

- **OQ-E3-1 — Merging `instance-of` and `instantiates`.** Recommend `instance-of` as canonical (passive, matches Wikidata terminology) and treat `instantiates` as the deduped inverse. Confirmation needed.
- **OQ-E3-2 — Should `disjoint-with` exist separately from `contradicts`?** RDF/OWL distinguishes axiomatic disjointness (no shared instances ever) from claim-level conflict; the vault currently collapses both into `contradicts`. If domain-axis values can be axiomatically disjoint, the distinction is useful. Pending decision.
- **OQ-E3-3 — Should `equivalent-to` be admitted?** Would support the Merge growth operation per `scope-and-domain-axes.md` D-11 ("two domain values become one"). No current vault use; admission would be net-new. Pending decision.
- **OQ-E3-4 — Markdown authoring vs SQL inverse computation.** `ontology-conventions.md` declares bidirectionality but does not specify the authoring rule. Recommend: authors write the forward direction (the one with the stronger semantic claim — e.g., `derives-from` not `grounds`); SQL layer computes the inverse.
- **OQ-E3-5 — Bridge edges for multi-scope documents.** `scope: world, artifact` is currently expressed as multi-value in frontmatter. Should there be an explicit `bridges` edge between bridge documents and their two-scope parents? Pending.
- **OQ-E3-6 — Standardization sweep.** The `operationalized-by` mislabel at `premise/robot-talks-premises.md:202` (should be `codified-as`) and the `operationalizes` (active) vs `operationalized-by` (passive) inconsistency at `event-system-constitution.md:315` should be resolved as part of `domainspec-vault-edges.md` adoption. Recommend a one-pass migration committed alongside the discovery.
- **OQ-E3-7 — Are domain-axis edges (`subclass-of`, `cross-cuts`, `historically-derived-from`) part of the same edge catalog or a separate one?** This findings file proposes a split (primary catalog vs domain-axis catalog), but the main thread may decide to unify. The split has a clean rationale: primary edges connect `node_type` instances (documents); domain-axis edges connect `domain` values (vocabulary terms). They are different layers.
- **OQ-E3-8 — Edge directionality declaration in frontmatter.** Currently directionality is implicit (the edge name implies it). Should there be a frontmatter-level declaration (e.g., a separate edges-table at the schema level)? Out of scope for this dispatch but worth flagging.

---

## Recommended Next Steps for `domainspec-vault-edges.md` (the discovery)

The main thread, when authoring `domainspec-vault-edges.md`, should consider including:

- **A formal definition of each of the 20 edges** with the columns from the table above (source/target/cardinality/direction/example/chain-mandate flag), promoted to first-class status (replacing or augmenting `ontology-conventions.md` Appendix C).
- **An explicit rule about the deduped-inverse pattern**: authors write the forward edge (canonical name like `derives-from`); the SQL layer materializes the inverse (`grounds`); visualization deduplicates. Document this as the authoring contract.
- **A migration plan for the 35-to-20 consolidation**: enumerate which old edges fold into which new edges (`instantiates`/`instances`/`exemplifies` -> `instance-of`; `extends`/`generalizes` -> `subclass-of` or `refines`; etc.). Since `domainspec-vault-edges.md` is a discovery, the migration belongs in a downstream `implementation-plan` per the chain.
- **Resolution of OQ-E3-1 through OQ-E3-8** as Decisions Taken (in `Decisions Taken` section) or as new Open Questions (in `Open Questions` section). At minimum OQ-E3-1 (merge `instance-of`/`instantiates`) should be resolved before the discovery ships, since it affects the canonical name of edge #3.
- **A section on the chain-mandated edges** linking each to its origin in `epistemic-chain.md` D-1 through D-9. This makes the chain edges first-class and tags the rest as elective.
- **A separate catalog (or appendix) for domain-axis edges**: `subclass-of` (tree-constrained), `cross-cuts`, `historically-derived-from`, `split-into`, `merged-into`, plus any new ones the growth rules per D-11 require. Keep these separate from the primary inter-document catalog.
- **An explicit note that the inconsistencies E1 surfaced (`:202` mislabel, `:26` broken path, `operationalizes`/`operationalized-by` voice mismatch) are governance debt, not blocking** — they can be swept in the migration implementation-plan rather than gating the discovery itself.
- **A version bump for `ontology-conventions.md`** Appendix C — once `domainspec-vault-edges.md` ships, the constitution's Appendix C is superseded by the discovery (per the chain D-9: discovery wins when it disagrees with constitution about a value's status). The constitution should declare this supersession explicitly when amended.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [research.md](research.md) | `derives-from` | This findings file synthesizes the raw E1/E2/E3 evidence collected in the research file. Every load-bearing claim here resolves to an E1/E2/E3 section in `research.md`. |
| [domainspec-subagents-strategy.md](domainspec-subagents-strategy.md) | `cites` | The dispatch strategy that produced this findings file. Per the linking rule for the strategy/research/findings triad in `ontology-conventions.md`, `findings derives-from domainspec-subagents-strategy` is also implicit (mediated through `research`). |
