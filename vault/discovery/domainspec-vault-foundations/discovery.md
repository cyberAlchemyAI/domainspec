---
tags: [vault, ontology, foundations, classification, epistemic-chain, scope, domain, consolidation]
node_type: discovery
is_session: false
layer: ontology
nature: explanatory, reference
status: draft
version: 0.1.0
last_updated: 2026-05-17
---

# Discovery — Foundations of the Vault (Consolidating Node)

> Two prior discoveries in this folder — [epistemic-chain.md](epistemic-chain.md) and [scope-and-domain-axes.md](scope-and-domain-axes.md) — together fix the structural foundations of the vault: how knowledge matures (the epistemic chain) and how it is classified along orthogonal axes (scope × domain). This document is the consolidating discovery node for that pair. It does not restate the underlying decisions; it names them, locates them, records what they jointly commit the vault to, and surfaces the questions that live across (not within) either source. It is the load-bearing index for anyone reading the foundations cluster.

---

## Objective

Consolidate the two foundational discoveries — `epistemic-chain.md` (lifecycle / `node_type` semantics) and `scope-and-domain-axes.md` (classification axes) — into a single discovery node that records the joint commitments the vault now stands on. The end state: a reader can enter the foundations cluster through this node, understand which discoveries are doing the actual work, see what is jointly settled vs. still open across them, and trace provenance back to the underlying research files.

---

## Index

1. [Context — Why Consolidate](#context--why-consolidate)
2. [Joint Commitments](#joint-commitments)
3. [Decisions (by reference)](#decisions-by-reference)
4. [Alternatives Considered (by reference)](#alternatives-considered-by-reference)
5. [Cross-Discovery Open Questions](#cross-discovery-open-questions)
6. [Source Dispatch and Provenance](#source-dispatch-and-provenance)
7. [Connections](#connections)

---

## Context — Why Consolidate

The two prior discoveries were written in parallel and address different questions:

- `epistemic-chain.md` defines the **lifecycle**: what each `node_type` value means, how documents mature from `research` through `discovery` to `premise` and `axiom`, and how `constitution`/`skill` apply premises to behavior. It is the chain backbone.
- `scope-and-domain-axes.md` defines the **classification axes**: splitting the overloaded `layer` field into `scope` (closed, epistemic-stack position) and `domain` (open, growable subject matter), with a typed-DAG structure and five growth operations.

Both are first-order vault discipline — claims about the vault's own structure that every downstream node depends on. They overlap in three places (the demotion of orthogonality from axiom to premise; the role of discoveries as the only authorized path for schema evolution; the productive-correlation rule). Until now, no single node tied them together — a reader had to discover the linkage by reading both end-to-end.

This consolidating node exists for three reasons:

1. **Navigation.** Make it explicit which discoveries hold the load and which questions are answered by which one.
2. **Joint commitments.** Record the small set of commitments that only exist because both discoveries hold simultaneously (see next section). Those joint commitments have no natural home inside either source.
3. **Provenance for downstream work.** Future discoveries (vault tooling, agent protocols, instrumentation) need a single `derives-from` edge target that means "I depend on the vault's foundational commitments as currently stated." This node is that target.

This discovery does **not** re-decide anything. If a reader spots a contradiction between this node and either source, the source wins; this node is a consolidating summary, not a superseding revision.

---

## Joint Commitments

The following commitments hold only because both source discoveries hold together. Each is stated here once; the full reasoning lives in the cited source.

### JC-1 — `scope` is the field that declares which graph a discovery affects

`scope-and-domain-axes.md` D-13 names three scope values (`ontology` / `world` / `artifact`) and rules that a discovery's `scope` declares whether it modifies the knowledge-graph schema, the application-graph schema, both, or neither. `epistemic-chain.md` D-14 (via reference to scope-and-domain D-14) makes discoveries the only authorized path for schema evolution. Together they commit the vault to: **every schema change to either graph is gated by a discovery, and the `scope` field on that discovery is the routing label that tells downstream consumers which schema is affected.**

### JC-2 — Orthogonality is a premise applied via design discipline, not a measured rule

`scope-and-domain-axes.md` D-1 demotes orthogonality from `axiom` to `premise` (`veracidade: low`, `convicção: high`). `epistemic-chain.md` D-4 makes the application chain explicit: premises shape behavior only through constitutions or skills, not through frontmatter alone. The joint commitment: **orthogonality is honest design discipline applied at admission, not a verifiable corpus property.** Any future "orthogonality validator" must declare itself as instrumentation that could raise `veracidade`, not as enforcement of a measured rule.

### JC-3 — Schema evolution rides the full epistemic chain

Combining `scope-and-domain-axes.md` D-14 (discoveries are the only authorized path for schema evolution) with `epistemic-chain.md` D-1 (research → discovery → premise → axiom + implementation-plan → spec → audit) yields: **every schema change must produce, at minimum, (a) a discovery, (b) any premises that change with the schema, and (c) the implementation-plan or constitution amendment that operationalizes it.** A frontmatter edit to `ontology-conventions.md` without that chain in the history is governance debt by both discoveries' rules simultaneously.

### JC-4 — Promotion/demotion of a claim is a typed move governed by a discovery

`epistemic-chain.md` D-10 establishes that `premise` and `axiom` are evidence-states of one claim and promotion is a file move (`vault/premise/<slug>.md` ↔ `vault/axiom/<slug>.md`). `epistemic-chain.md` D-8 requires demotion to be authorized by a discovery; D-3 requires promotion to be a deliberate governance act on `veracidade`. `scope-and-domain-axes.md` D-1 is the canonical worked example (orthogonality, axiom → premise). The joint commitment: **the file-move discipline is the on-disk shape of the discovery-authorized governance act; the two are not separable steps but two views of the same operation.**

### JC-5 — The application-graph distinction is real and load-bearing

`scope-and-domain-axes.md` D-13 names the application graph as a first-class object the vault is source-of-truth for. `epistemic-chain.md`'s bifurcation at discovery (belief branch + implementation branch) is what makes this work: implementation-plan → spec → audit is exactly the chain that produces and validates the application graph's structure. The joint commitment: **the vault is the schema registry for two graphs (knowledge graph and application graph); the implementation branch of the chain is what keeps the application graph honest, and audits are the only sanctioned mechanism for evidence to flow back to premises in either graph.**

---

## Decisions (by reference)

This node takes no new decisions. The settled decisions are recorded in the source discoveries:

| Source | Decision range | Subject |
|--------|---------------|---------|
| [`epistemic-chain.md`](epistemic-chain.md) | D-1 through D-10 | Lifecycle, node_type definitions, premise/axiom promotion mechanics, application layer, validation loop |
| [`scope-and-domain-axes.md`](scope-and-domain-axes.md) | D-1 through D-14 | Orthogonality demotion, scope/domain split, value vocabularies, typed-DAG structure, five growth operations, governance roles, schema evolution gate |

Both source discoveries' decision sections are authoritative. If you need to act on a decision, cite the source, not this node.

---

## Alternatives Considered (by reference)

Likewise, the rejected alternatives are recorded in the sources:

| Source | Alternatives | Subject |
|--------|-------------|---------|
| [`epistemic-chain.md`](epistemic-chain.md) | A-1 through A-6 | Conflated research/discovery, merged premise/axiom, flat type set, structural alternatives to the chain |
| [`scope-and-domain-axes.md`](scope-and-domain-axes.md) | A-1 through A-10 | Layer-only schemas, narrow discipline fields, pure DAG, FCA lattice, pre-enumerated taxonomy, Shannon-style orthogonality |

No alternative recorded in those sections is reopened here. If a future discovery wants to revisit one, it must cite the source A-N and supply the new evidence that justifies relitigation.

---

## Cross-Discovery Open Questions

These open questions exist *across* the two source discoveries — they cannot be answered by either alone. Open questions internal to a single source remain in that source (epistemic-chain.md OQ-1 through OQ-6; scope-and-domain-axes.md OQ-5, OQ-6) and are not duplicated here.

### CDOQ-1 — How does a `scope`-change to an existing document interact with the file-move discipline?

`epistemic-chain.md` D-10 treats promotion/demotion as a file move between `premise/` and `axiom/`. `scope-and-domain-axes.md` D-13 makes `scope` a frontmatter field on every document. What happens when a document's `scope` legitimately changes (e.g., an artifact-scoped concept is recognized as also having an ontology-scope role)? Is that a file move? A frontmatter edit? A multi-value scope update? Neither source rules.

**Why it matters:** Without a rule, `scope` changes will be made silently as frontmatter edits, bypassing the discovery gate that D-14 mandates for schema evolution. That is exactly the failure mode JC-3 names.

**Provisional rule (proposed, not settled):** a `scope` change to an existing document is treated as a schema-touching edit and requires a discovery if it changes the routing of downstream consumers; if it only adds a second scope value (multi-value bridge marker per scope-and-domain D-4), the originating session record is sufficient provenance.

**Status:** Open.

---

### CDOQ-2 — Are `research`-classified files admissible under both axes' rules?

`epistemic-chain.md` D-2 admits `research` as a first-class `node_type` and D-6 reclassifies T1–T4 + SYNTHESIS accordingly. `scope-and-domain-axes.md` predates that and was written under the old vocabulary. The cross-question: do research files carry `scope` and `domain` like every other document, or are they (like sessions) a partially exempted register? The current consolidated evidence file (`research/scope-and-domain-axes-evidence.md`) carries `node_type: research`, `layer: ontology`, and no `scope`/`domain` — i.e., the answer in practice is "research files use the legacy `layer` field." That is inconsistent with the joint position.

**Why it matters:** If research files are exempted, the universal-domain claim weakens (research on, say, biology should be `scope: world, domain: biology`). If they are not exempted, every existing research file needs a migration.

**Status:** Open.

---

### CDOQ-3 — What is the `node_type` of a consolidating discovery like this one?

This document is `node_type: discovery`, but it takes no new decisions — it consolidates two prior discoveries. `epistemic-chain.md` describes discoveries as crystallization points that lock in decisions; a consolidating node is closer to a *synthesis* or *index* role. Should there be a distinct `node_type` (e.g., `consolidation`) for this case, or is `discovery` correct (because the *act of consolidating* is itself a decision about how to navigate the foundations cluster)?

**Why it matters:** If the answer is "discoveries can consolidate without deciding," then graph queries for "all discoveries" return some nodes that are decision records and some that are summaries — a precision loss similar to the one D-2 of `epistemic-chain.md` solved by splitting `research` out from `discovery`.

**Provisional rule (proposed, not settled):** consolidating discoveries are admissible as `node_type: discovery` provided they declare in their objective that they consolidate prior discoveries and add no new decisions. The joint-commitments section is the legitimate "new content" that distinguishes them from a `readme`.

**Status:** Open.

---

## Source Dispatch and Provenance

This consolidating node was promoted from a `domainspec-subagents-strategy` dispatch covering both foundational threads. The findings file for that dispatch lives outside the vault (in the strategist's working area); the on-vault provenance is the two source discoveries and their research files, listed in the Connections table below.

Per `epistemic-chain.md` D-9 (discovery is canonical; sessions are provenance only), the text of this node is the canonical statement of joint commitments. Future edits to refine a joint commitment happen here, not in a session log.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [epistemic-chain.md](epistemic-chain.md) | `derives-from` | Companion discovery: defines the lifecycle and `node_type` semantics this node consolidates. |
| [scope-and-domain-axes.md](scope-and-domain-axes.md) | `derives-from` | Companion discovery: defines the scope/domain axes and growth governance this node consolidates. |
| [research/epistemic-chain-evidence-survey.md](research/epistemic-chain-evidence-survey.md) | `derives-from` | Evidence base for the epistemic-chain discovery; transitive provenance for the joint commitments. |
| [research/scope-and-domain-axes-evidence.md](research/scope-and-domain-axes-evidence.md) | `derives-from` | Consolidated evidence base (T1–T4 + SYNTHESIS) for the scope/domain discovery; transitive provenance for the joint commitments. |
| [README.md](README.md) | `cites` | Folder navigation document; describes the two pillars this node consolidates. |
| [../../ontology-conventions.md](../../ontology-conventions.md) | `cites` | The constitution the joint commitments expect to be amended (scope/domain fields, research node_type, scope-routing rule per JC-1). |
| [../../confidence-levels.md](../../confidence-levels.md) | `cites` | Defines `veracidade`/`convicção` — load-bearing for JC-2 (orthogonality as `low`/`high` premise). |
