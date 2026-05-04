---
tags: [vault, ontology, research, taxonomy-history, upper-ontologies, structure, governance, synthesis]
node_type: research
is_session: false
session_ref: null
layer: ontology
nature: explanatory, reference
status: draft
veracidade: medium
convicção: high
version: 0.2.0
last_updated: 2026-05-02
---

# Evidence Survey — Scope and Domain Axes

> Consolidated research output for the `scope-and-domain-axes.md` discovery. This document is the merged successor of four parallel research tracks (T1 empirical history, T2 upper ontologies, T3 tree-vs-DAG-vs-lattice, T4 growth governance) and their original SYNTHESIS. The synthesis (resolution of OQ-1 through OQ-4) is preserved verbatim as the main body; the four research tracks are preserved as named appendix sections so the per-track structure and citations survive intact.

---

## Consolidation Note

**Shape chosen: Option A (single file).** The four research tracks are tightly interlocked — T3's structural argument depends on T1's empirical history *and* T2's upper-ontology survey; T4's governance recommendations depend on T1's antipattern catalog. The synthesis's "Apparent Disagreements and Their Resolutions" section explicitly harmonizes T1 (DAG recommendation) against T3 (primary-tree recommendation) — that resolution would itself become a cross-file reference under any two-file split. Keeping everything in one document preserves the evidence chain; appendix sectioning preserves per-track readability.

`node_type` is set to `research` per D-6 of `epistemic-chain.md`, replacing the legacy `discovery` label that the four T-files originally carried.

---

## Index

1. [Synthesis — Convergent Findings](#1-synthesis--convergent-findings)
2. [Synthesis — Apparent Disagreements and Their Resolutions](#2-synthesis--apparent-disagreements-and-their-resolutions)
3. [Synthesis — The Five-Operation Growth Rule Set](#3-synthesis--the-five-operation-growth-rule-set)
4. [Synthesis — Structural Commitment for `domain`](#4-synthesis--structural-commitment-for-domain)
5. [Synthesis — Day-One Operational State](#5-synthesis--day-one-operational-state)
6. [Synthesis — Resolutions to OQ-1 through OQ-4](#6-synthesis--resolutions-to-oq-1-through-oq-4)
7. [Synthesis — Open Items: OQ-5 and OQ-6](#7-synthesis--open-items-oq-5-and-oq-6)
8. [Synthesis — Application-Graph Framing](#8-synthesis--application-graph-framing)
9. [Appendix A — Empirical History of Hierarchical Taxonomies (T1)](#appendix-a--empirical-history-of-hierarchical-taxonomies-t1)
10. [Appendix B — Upper Ontologies and the Top of the Tree (T2)](#appendix-b--upper-ontologies-and-the-top-of-the-tree-t2)
11. [Appendix C — Tree vs DAG vs Lattice: Structural Commitment for `domain` (T3)](#appendix-c--tree-vs-dag-vs-lattice-structural-commitment-for-domain-t3)
12. [Appendix D — Governance of Taxonomy Growth: Split / Merge / Promote / Retire Rules (T4)](#appendix-d--governance-of-taxonomy-growth-split--merge--promote--retire-rules-t4)
13. [Connections](#connections)

---

## 1. Synthesis — Convergent Findings

The four research agents reached the following conclusions independently, without cross-reading each other's work. Where all four (or three of the four) converged, the finding is treated as high-confidence even where individual agents set `convicção: low`.

### C-1 — Every real taxonomy eventually hit the multi-parent problem

T1 documented it empirically: Linnaean biology was a tree until phylogenetics broke it; MeSH was explicitly designed as polyhierarchical from its modern form onward; DDC's forced single-parent geometry produced the "CS in Generalities" misfit that persists today. T3 argued it structurally: trees fail under cross-disciplinary concepts (biochemistry has two parents), the failure is predictable from corpus composition, not from bad design, and there is no corpus of any breadth that stays single-parented cleanly. Both agents converged on the same operational fix: multi-parenthood is necessary, but the *kind of parent* must be typed. Trees fail because they try to do everything with one anonymous edge. The fix is typed edges, not fewer edges.

### C-2 — Top-level early commitment is always regretted

T1 showed this with DDC (10-class budget, 1876, permanent consequences) and LCC's K class (built bottom-up over 35 years, internally inconsistent). T4 showed it with ACM CCS's 1998-to-2012 restructure, which forced retroactive re-tagging of decades of literature. T2's recommendation (R-2) is explicit: none of the surveyed upper ontologies provide a clean discipline tree; the ones that tried to fix upper levels (Cyc, SUMO's mid-level extensions) are now stale or commercial-only. The operational conclusion, stated identically by T1 and T4, is: **seed flat, add upper levels only when observed need justifies them**, with the specific warrant for a new upper level being "at least 3 siblings share it as natural parent AND a concrete query benefits from the grouping."

### C-3 — Retirement must preserve provenance; deletion is the antipattern

T1 named it via the post-cladistic Linnaean lesson: retiring a rank without preserving its history destroyed the ability to read century-old literature. T4 derived it from OBO Foundry principle 19 ("pre-announce term obsoletions; preserve the IRI; prepend `obsolete` to the label") and from MSC's versioned-namespace approach (old codes remain queryable within their version namespace). T4's retire rule is a direct translation of these lessons into our event-sourcing model: a retired `domain` value is never deleted, remains queryable historically, and its retirement is recorded as an `ontology_events` row. The vault already has the infrastructure for this; the discipline is the missing piece.

### C-4 — Governance discipline is more determinative than structure

T3 noted that structure choice is less important than discipline: the DAG-vs-tree question matters less than whether cycles are caught mechanically, whether edges are typed from the start, and whether agent authors are constrained from creating new `domain` values without governance. T4 documented the same lesson from Wikidata's scale: errors scale faster than curation (millions of P279 cycle instances, growing year over year). T1's Wikipedia antipattern list is the same argument empirically: the category system's failure was not structural, it was governance failure — no cycle enforcement, no promote gate, no retire discipline. The vault's solution is the five growth operations with documented evidence thresholds and mandatory `ontology_events` logging for every structural change.

### C-5 — The `scope` axis has prior art in Cyc's microtheory device

T2 identified this independently. Cyc's microtheories encode the insight that truth is context-dependent: a claim is accountable to the context (microtheory) in which it is asserted, and cross-context inference requires explicit bridges. Our `scope` axis does exactly this: `scope: ontology` claims are accountable to the rules of the knowledge graph; `scope: world` claims are accountable to external reality; `scope: artifact` claims are accountable to the codebase. Each `scope` value is, operationally, a microtheory. Multi-value `scope` documents (e.g., `scope: world, artifact`) are the inter-microtheory bridges Cyc required explicit inference rules for. This is a conceptual citation, not a structural commitment.

### C-6 — No upper ontology is a discipline catalog; all are entity catalogs

T2 stated this as a core caution: BFO, DOLCE, SUMO, and schema.org classify *what kinds of things exist*, not *what fields study them*. Our `domain` axis is the second kind. The only partial exception is WordNet's `field-of-study` subtree, which gives usage-derived discipline groupings. T1 corroborated this from the other direction: empirical taxonomies (MeSH, DDC, Linnaean) are domain-specific and did not draw on upper ontologies when designing their level structure. The operational conclusion: upper ontologies are **references** at most, not parent trees. When `domain` eventually needs an upper-level organizer, DOLCE's physical/non-physical/abstract three-way split is the most defensible reference (T2, R-3) because it maps intuitively onto natural / social-cognitive / formal sciences without importing realist metaphysical commitments.

---

## 2. Synthesis — Apparent Disagreements and Their Resolutions

### D-A — T1 recommended DAG; T3 recommended primary tree with typed cross-cutting edges

**T1's position:** "Recommendation: DAG, with strict acyclicity enforcement and a small set of curated top-level nodes." Evidence: MeSH is explicitly polyhierarchical; every taxonomy surveyed eventually hit the multi-parent problem; Wikidata properties are a DAG by construction.

**T3's position:** "Concrete recommendation: `domain` should be a primary tree with a controlled cross-cutting tag/edge layer." Evidence: corpus size (~12 documents) does not justify DAG governance overhead; agent authors will over-connect given multi-parent freedom; tree → DAG migration is reversible, DAG → tree migration is not.

**Resolution — typed DAG with tree-constrained `subclass-of`:** This is not a real disagreement. T1 was answering "what will the structure eventually need to be" and T3 was answering "what is the cheapest thing to start with that can grow safely." Both are right for their question. The synthesis is a **typed DAG** in which:

- The `subclass-of` edge type is **constrained to a tree**: each `domain` value has at most one `subclass-of` parent. This is the "primary parent" T3 calls for. This gives authors a single canonical breadcrumb and cheap tree queries.
- Other typed edges (`cross-cuts`, `supersedes-domain`) form an unconstrained DAG. The `cross-cuts` edge is the mechanism for expressing multi-disciplinary relations (biochemistry `cross-cuts` chemistry) without forcing a second `subclass-of` parent.
- **Cycle prevention is mechanical.** Any new edge of any type triggers a cycle check at admission time. This is non-negotiable — Wikipedia's lesson (T1) and Wikidata's P279 cycle lesson (T3) are both clear.

This typed DAG honors T3's authoring discipline (one primary parent per value = tree navigation) while honoring T1's empirical lesson (cross-cutting is real and must be expressible). The `subclass-of` tree is the *mental model and navigation interface*; the cross-cutting edges are the *semantic truth layer*.

**Confidence:** High. Both agents would endorse this formulation if asked to respond to each other's evidence.

### D-B — T1's split threshold ≥8 vs T4's split threshold ≥15

**T1's position:** Split when a domain tags ≥ 8 documents and two clusters of ≥ 3 each are detectable.

**T4's position:** Default N = 15 documents. "Below ~15 the corpus is too small to detect heterogeneity reliably."

**Resolution — start with T1's threshold (≥8), raise to T4's (≥15) at a corpus-size milestone:** T1's threshold was derived from MeSH's literature-usage signal and is calibrated to early-stage detection of structural problems. T4's threshold was calibrated explicitly to the vault's small-project setting with a stated rationale (small corpus = unreliable heterogeneity detection). The difference is 7 documents, which is material when the entire corpus is ~12. The right answer is **threshold-as-a-growing-function-of-corpus-size**: begin at T1's ≥8 (appropriate when total corpus is under ~50 documents), raise to T4's ≥15 once total corpus exceeds ~100 documents. The milestone for the threshold raise is recorded here so it is not forgotten; it does not require a governance event to take effect — the human operator applies judgment at the threshold level appropriate for the corpus size at the time of a split proposal.

**Operational note:** The split evidence requirement (two clusters of ≥ 3 documents each with internally similar, externally distinct retrieval behavior) is drawn from T1 and applies at both threshold levels. The cluster criterion is more important than the raw count.

---

## 3. Synthesis — The Five-Operation Growth Rule Set

The discovery document (D-9) named four growth operations. The framing provided after the discovery was written makes clear that **five** operations are needed: T1 and T4 each named a "promote" operation, but they solve different problems.

- **T1's promote** = a domain value accumulates ≥ 3 child values and becomes a parent node (*promote-level*).
- **T4's promote** = a `tag` value earns promotion to a first-class `domain` value (*promote-tag*).

Both are needed. Together with split, merge, and retire, the full set is five.

---

### Operation 1 — Split

**What:** One `domain` value is divided into two or more new values.

**Trigger:** A domain accumulates documents that pattern-cluster into recognizable sub-groups whose retrieval queries diverge.

**Evidence required:**
- Corpus count ≥ 8 (early corpus) or ≥ 15 (corpus > 100 documents total)
- At least two clusters of ≥ 3 documents each, internally similar and externally distinct
- At least one open question, audit finding, or retrieval failure has flagged the ambiguity

**Migration:** Every existing document under the old value is reclassified to one of the new values (multi-value allowed). The old value is then **retired** (not deleted). Migration must be complete before the operation is recorded as done. The old value slug is never reused.

**Anti-trigger:** Raw document count alone is not a split trigger. A value with 40 documents that returns coherent queries should not be split — depth (not breadth) is the splitting criterion (T1, MeSH's `Diseases` lesson).

**Borrowed from:** T1 (MeSH annual literature-usage signal, DDC's CS-retrofit cautionary tale), T4 (ACM CCS corpus-evidence trigger).

**Governance:** A `node_type: discovery` proposal must exist ≥ 48 hours before ratification. Proposal must list the document partition with rationale. Migration plan required.

---

### Operation 2 — Merge

**What:** Two `domain` values are collapsed into one canonical value.

**Trigger:** Two values have high retrieval overlap, indicating they encode the same topic under different names.

**Evidence required:**
- ≥ 60% Jaccard overlap on document sets (T4's threshold) sustained over multiple reviews, **or**
- Human audit identifies them as encoding the same topic under different names, **or**
- No `discovery` or `spec` document treats them as distinct (T1 formulation)

**Migration:** Every document under the deprecated value is re-tagged with the canonical value. The deprecated value enters the `retired` state with a `merged-into → <canonical>` edge in `ontology_events`. The deprecated slug is never reused.

**Anti-trigger:** Partial thematic overlap is not a merge trigger. Two values that both appear in many documents but still answer distinct retrieval queries should be split or left independent, not merged.

**Borrowed from:** T1 (MeSH's yearly descriptor review, Wikipedia's orthogonality failure), T4 (Wikidata duplicate-property merge, OBO Foundry orthogonality-by-deference).

**Governance:** Same 48-hour proposal window. Overlap measurement or audit finding required as evidence artifact.

---

### Operation 3 — Promote-Tag

**What:** A `tag` value is elevated to a first-class `domain` value in the controlled vocabulary.

**Trigger:** A tag has demonstrated stable, high-volume, distinct usage that no current `domain` value captures.

**Evidence required (all three must hold — T4):**
1. **Volume** — tag applied to ≥ 5 documents
2. **Stability** — tag in use for ≥ 30 days without being dropped or renamed
3. **Necessity** — removing the tag would lose information that no current `domain` value captures (the orthogonality test at the value level)

**Migration:** Every document carrying the tag has its `domain` field updated to the new value. The tag is retired from the `tags` namespace. A discovery proposal must name the proposed `domain` value slug, display name, and `subclass-of` parent (if applicable) or declare it a root value.

**Why this exists:** Tags are the relief valve — free-form, unreviewed, ephemeral. `domain` is the controlled vocabulary — reviewed, stable, governed. Promote-Tag is the only authorized path from the former to the latter. It prevents tag-namespace pollution from bleeding into `domain` (the Wikipedia WP:OVERCAT antipattern, T4) while ensuring that genuinely useful organizational concepts are not trapped in the unindexed tag layer.

**Borrowed from:** T4 (schema.org `pending` → core pattern is the central model; Wikidata property proposal flow — volume + stability + duplicate-check).

**Governance:** 48-hour proposal window. The human is decider; the Bayesian agent (once landed) checks corpus-level orthogonality against existing `domain` values before ratification.

---

### Operation 4 — Promote-Level

**What:** An existing `domain` value gains a new `subclass-of` parent that did not previously exist (the value becomes a child in a new upper-level grouping).

**Trigger:** A cluster of ≥ 3 sibling `domain` values shares a natural common parent, and at least one concrete query benefits from querying them at the parent level.

**Evidence required:**
- ≥ 3 existing `domain` values that share the proposed parent
- Proposed parent name is human-articulable and unambiguous
- At least one concrete retrieval use case named

**What this is not:** Promote-Level does not introduce new leaf values. It introduces new *internal nodes* in the `subclass-of` tree. It is the operation that, when triggered, will eventually introduce `formal-sciences`, `natural-sciences`, or `applied-domains` as upper-level groupings — but only after the evidence accumulates, never pre-emptively.

**Anti-trigger:** Do not create upper-level groupings in anticipation of future growth. The DDC and LCC lessons (T1, T3) are consistent: top-level commitments made before evidence accumulates become permanent debt. An orphaned value with no parent is *preferable* to a value with a wrong or premature parent.

**Borrowed from:** T1 (MeSH promote-SCR-to-Descriptor as the model for elevating importance; Woese's domain-level addition as the empirical case for evidence-triggered level introduction), T4 (JEL's rare but real top-level letter additions; MSC's new three-level codes under existing two-level parents).

**Governance:** ≥ 48-hour proposal window. Must name the affected child values and the query use case.

---

### Operation 5 — Retire

**What:** A `domain` value is removed from the active controlled vocabulary.

**Trigger:** A value has tagged 0 documents in the last complete review cycle, or all its documents have been migrated to other values (via a split or merge operation).

**Evidence required:**
- Zero active documents (or all migrated)
- No plausible future document would carry it (this is a judgment call; default to not retiring if uncertain)

**What happens:**
- Value status set to `retired` in the domain value catalog
- Display name prefixed with `obsolete:` (OBO Foundry pattern, T4)
- Retirement record written to `ontology_events`: reason, date, successor value(s), migration record
- Slug preserved forever — never reused for a different meaning (OBO Foundry IRI-stability principle, T4)
- Historically-dated queries continue to return the original classification

**Pre-announcement:** Retirement must be announced ≥ 7 days before it takes effect (T4, scaled from OBO Foundry's principle).

**Anti-pattern:** Do not retire a domain because its documents were retired. The value's *concept* may still be needed. Retire only when no plausible future document would carry it.

**Borrowed from:** T1 (Linnaean provenance lesson — never destroy historical record), T4 (OBO Foundry IRI-stability and pre-announcement, MSC versioned namespaces, Wikidata deprecated-rank mechanism).

**Governance:** 7-day pre-announcement. Human decision. Full migration record required.

---

### Five-Operation Summary Table

| Operation | Trigger | Key evidence threshold | Slug fate | Min governance window |
|---|---|---|---|---|
| **Split** | Retrieval divergence within a value | ≥ 8 docs (early) or ≥ 15 (mature corpus), 2 clusters of ≥ 3 | Old slug retired, never reused | 48 h |
| **Merge** | Retrieval overlap between two values | ≥ 60% Jaccard overlap OR audit finding | Deprecated slug retired, never reused | 48 h |
| **Promote-Tag** | Stable tag earns controlled-vocab status | ≥ 5 docs, ≥ 30 days, orthogonality test passes | Tag removed; new `domain` slug created | 48 h |
| **Promote-Level** | ≥ 3 siblings need a common parent | ≥ 3 children, named parent, concrete query | New parent slug created | 48 h |
| **Retire** | Value is unused and no future use is foreseeable | 0 active docs, no plausible future use | Slug preserved, prefixed `obsolete:` | 7 days |

Every operation requires a `node_type: discovery` proposal artifact and produces a row in `ontology_events`. These are non-optional — the event-sourcing constraint is the audit surface.

---

## 4. Synthesis — Structural Commitment for `domain`

### Decision

`domain` is a **typed DAG** with the `subclass-of` edge type constrained to a tree (each value has at most one `subclass-of` parent). Other declared edge types form an unconstrained DAG with mechanical cycle prevention.

### Edge types for `domain`-to-`domain` relations

| Edge type | Semantics | Structural constraint |
|---|---|---|
| `subclass-of` | "This domain is a specialization of its parent." | **Tree-constrained.** At most one per value. Determines the navigation breadcrumb. |
| `cross-cuts` | "This domain is genuinely cross-disciplinary with the target domain." | Unconstrained DAG. Cycle check required at admission. |
| `supersedes-domain` | "This domain replaces the target (retired) domain." | Created only by Split or Merge operations. Never cycles. |

All three edge types must be declared in the domain value catalog, not inferred. Undeclared edges do not exist. This is the lesson from Gene Ontology's `is_a` overloading (T3): an untyped parent edge will be overloaded immediately.

### Multi-value `domain` on documents

Multi-value `domain` on a document means "this document touches multiple domains." It is **not** a structural claim about the domains themselves. The structural relation between domain values is expressed via domain-to-domain edges in the value catalog, not by inspecting multi-value document memberships (T3, caution 8).

### Cycle prevention

Cycle detection is a mechanical gate at every edge admission, regardless of edge type. A new edge that would create a cycle — even a 2-cycle between two `cross-cuts` edges — is rejected. This is non-negotiable (T1 Wikipedia lesson, T3 Wikidata P279 lesson).

### Why not full DAG from day one

T3's argument on reversibility stands: tree → DAG migration (add typed cross-cutting edges) is a small, additive change. DAG → tree migration is a hard structural change that no production taxonomy at scale has accomplished. The `subclass-of` tree constraint costs almost nothing while the corpus is small, and can be relaxed if evidence demands it. Starting with an unconstrained DAG is starting at the end of a migration path we cannot reverse. We start strict.

### Why not a lattice

FCA lattices are powerful as diagnostic tools (T3, §3): run FCA over the document × domain-tag matrix to detect when the imposed tree disagrees with the data-implied structure. Use the disagreement as a signal for split/merge operations. But FCA is not the primary representation for the reasons T3 enumerated: it is expensive for agent authors to work with, brittle to noise, and loses the human-authoring property that is one of the vault's primary use cases.

---

## 5. Synthesis — Day-One Operational State

### Seed values (~12 flat values, no upper-level groupings)

The following values are the day-one `domain` vocabulary. They are drawn from documents the vault already holds (T1's principle: seed from existing corpus, never pre-enumerate). All values start at the same level — no parent-child structure exists yet. Upper-level groupings will be introduced by Promote-Level operations as evidence accumulates.

**Ontology-scope domains:**
- `ontology-classification`
- `ontology-governance`
- `confidence-system`

**World-scope domains:**
- `fidc`
- `credit-rights`
- `regulations-cvm`

**Artifact-scope domains:**
- `event-system`
- `folder-structure`
- `frontend-architecture`
- `agent-system`
- `commit-discipline`
- `vault-instrumentation`

Cross-cutting concerns (e.g., `agent-system` appearing in both ontology-governance and artifact contexts) are handled by multi-value `domain` on affected documents, plus a `cross-cuts` edge in the domain value catalog.

### Growth rules are active immediately

All five growth operations are active from day one. The initial seed is small enough that the split threshold (≥ 8 documents) will not be triggered for most values immediately, but the rules exist and are consulted. Any new `domain` value entering the vocabulary after day one must arrive via Promote-Tag, Split, or Promote-Level — never by informal addition. This discipline must hold from the first document, not from "when the corpus gets large."

### No upper-level groupings at day one

No `formal-sciences`, `natural-sciences`, `applied-domains`, or similar parent nodes are created yet. This is an explicit negative commitment. The DDC lesson (T1) and the Promote-Level criteria in §3 are the authority here. When the corpus accumulates ≥ 3 siblings that share a natural parent and a concrete query benefits from the grouping, Promote-Level is invoked.

### Retirement preserves provenance via `ontology_events`

From day one, any structural change to the `domain` vocabulary — addition, retirement, merge, split, level promotion — is recorded as an event in `ontology_events`. The event schema must capture: operation type, affected value slugs, date, operator (human or agent), evidence artifact reference, and migration record. This is the event-sourcing constraint applied to the ontology layer itself.

---

## 6. Synthesis — Resolutions to OQ-1 through OQ-4

### OQ-1 — Tree vs DAG vs lattice for `domain`

**Resolved.** `domain` is a typed DAG with the `subclass-of` edge type constrained to a tree. See §4 for the full structural commitment.

**Evidence:** T1 (empirical case for multi-parenthood), T3 (structural case for reversibility and authoring discipline), synthesis resolution D-A above.

---

### OQ-2 — Initial value seed for `domain`

**Resolved.** ~12 flat values, no upper-level groupings. See §5 for the complete list.

**Evidence:** T1 (DDC anti-pattern: top-level early lock-in is permanent debt; seed from existing corpus), T4 (schema.org pending-namespace pattern: start small and promote on evidence). The 12-value number matches T1's own day-one seed recommendation and the scope of existing vault documents.

---

### OQ-3 — Growth rules (split / merge / promote / retire)

**Resolved.** Five operations: Split, Merge, Promote-Tag, Promote-Level, Retire. See §3 for the full rule set with evidence backing and governance requirements.

**Evidence:** T1 (empirical history), T4 (governance survey of Wikidata, OBO Foundry, ACM CCS, JEL, MSC, schema.org). The fifth operation (Promote-Level) was not named in the original discovery but is required by the distinction T1 and T4 each independently captured.

---

### OQ-4 — Top-of-tree alignment with upper ontologies

**Resolved.** No upper ontology is adopted as a structural commitment. Cyc's microtheory device is cited as prior art for the `scope` axis. DOLCE's physical/non-physical/abstract three-way split is named as a *reference* (not a commitment) for when `domain` upper levels are eventually introduced.

**Evidence:** T2 (survey of BFO, DOLCE, SUMO, Cyc, schema.org, WordNet). Specific T2 findings:
- T2-R1: No upper ontology aligns with `scope: ontology / world / artifact`. The `scope` axis is epistemic-stack positioning, not metaphysics.
- T2-R3: DOLCE physical/non-physical/abstract survives the orthogonality discipline at the meta-level and maps intuitively onto natural / social-cognitive / formal sciences.
- T2 caution: BFO and DOLCE cannot be merged; importing either would lock in philosophical commitments out of scope for this knowledge graph.
- T3-§4 (ontology-alignment / mismatch problem): SNOMED × UMLS × NCI alignment produced 20,000+ unsatisfiable classes. Avoid premature alignment.

**Operational consequence:** When `domain` upper levels are drafted, they should be evaluated against T2-R5's three criteria: orthogonality at the meta-level, annotator usability (90%+ unambiguous placement), and WordNet sanity-check (does the proposed parent agree with how English-speakers cluster fields of study?).

---

## 7. Synthesis — Open Items: OQ-5 and OQ-6

### OQ-5 — Forward consideration: `scope: ontology` split

**Status: open watch-item.** Not resolved by this research wave; intentionally deferred.

`scope: ontology` currently holds rules, governance, and measurement documents. If these accumulate heterogeneous content that the existing structure cannot resolve, the value may need to be split (e.g., `ontology-rules` vs `ontology-governance` vs `ontology-instrumentation`). No evidence in T1–T4 forces this split now. The watch criterion: if `scope: ontology` documents begin to fail retrieval precision — i.e., a query for "rules" consistently returns governance documents alongside rule documents — the split is warranted. Until that signal appears, the value remains unified.

**No action required until the signal appears.**

---

### OQ-6 — Instrumentation for measured orthogonality

**Status: open, deferred to implementation planning.**

The orthogonality principle is currently a design discipline (D-1 from the parent discovery: demoted from axiom to premise). Promoting it to a measured property requires the Bayesian agent / corpus-measurement layer. T2 did not provide a timeline. T3 mentioned FCA as a diagnostic tool that can serve a similar purpose at smaller scale. T4's Bayesian-agent role is named as "reviewer" in the governance process once landed.

**What this synthesis adds:** Until the measurement layer lands, the five growth operations each contain human-reviewable evidence criteria that operationalize orthogonality without measuring it. The Promote-Tag operation's "necessity" gate is the most direct proxy: an operator must articulate that removing the tag would lose information no current `domain` value captures. This is a manual orthogonality check. It is weaker than a Bayesian measurement but it is not nothing.

**The implementation plan for the Bayesian agent is a separate document; this synthesis does not prescribe it.**

---

## 8. Synthesis — Application-Graph Framing

The vault is the source-of-truth for **two distinct graphs**:

1. **Knowledge graph** — the graph of epistemic nodes (`discovery`, `premise`, `axiom`, `spec`, etc.) and their typed edges. Schema governed by `scope: ontology` documents.
2. **Application graph** — the product's structural graph: routes, components, domain objects, event types, service boundaries. Schema governed by `scope: artifact` documents.

These are different graphs with different schemas. But they share governance infrastructure: the vault, the `ontology_events` log, and the `node_type: discovery` mechanism.

**The critical principle:** Schema changes to either graph — knowledge graph or application graph — must pass through a `node_type: discovery` document. This is the only authorized path for schema evolution. An agent that introduces a new domain value, edge type, node type, or application-graph schema element without a discovery document is bypassing the governance mechanism. The five growth operations in §3 apply to the `domain` value vocabulary of the knowledge graph; an analogous discipline applies to the application graph's schema evolution.

**Growth rules apply to both schemas.** When the application graph's `domain` values (e.g., `auth`, `payments`, `billing`) need to split, merge, or be retired, the same five operations and the same governance requirements apply. The evidence thresholds may differ (application-graph domain values are shaped by codebase structure, not retrieval query behavior) but the *shape* of the process — proposal artifact, evidence requirement, `ontology_events` record, migration plan — is identical.

**Scope as the partition key between the two schemas:** `scope: ontology` discoveries modify the knowledge graph schema. `scope: artifact` discoveries modify the application graph schema. `scope: world` discoveries update content (documents about the world) but do not modify either schema. Multi-scope discoveries (`scope: ontology, artifact`) bridge both schemas and require review against both sets of constraints.

This framing was not explicit in T1–T4 (the research wave predated it) but is consistent with all four agents' findings. It does not invalidate any finding; it contextualizes where the findings apply.

---

## Appendix A — Empirical History of Hierarchical Taxonomies (T1)

> Original research output for the discovery wave on `domain` axis structure (OQ-1) and growth rules (OQ-3). Traces how four real taxonomies — Linnaean biology, MeSH, library classification (DDC + LCC), and Wikipedia categories — discovered and revised their level structure. The purpose is not to enumerate categories; it is to extract lessons about how level structure evolves so the vault's `domain` axis can be designed with empirical grounding rather than first-principles guessing.

### A.1 Objective

For each of four hierarchical taxonomies, answer the same four questions:

1. What triggered a *level* change (not a node change)?
2. What was the governance process for level changes?
3. What was lost when levels were redesigned?
4. What antipatterns emerged?

Then derive recommendations for the vault's `domain` axis: tree vs DAG vs lattice, an initial value seed, and growth rules (split / merge / promote / retire).

### A.2 Findings — Linnaean Biology

#### Original schema and growth

Linnaeus's 1735 *Systema Naturae* used five ranks: **kingdom, class, order, genus, species**. Phylum and family were added by later naturalists during the 19th century to accommodate a more nuanced classification. The modern eight-rank system (domain, kingdom, phylum, class, order, family, genus, species) was completed in 1990 with Woese's addition of `domain` *above* what had been the top rank.

#### Q1 — What triggered a level change?

**The 1990 domain-level addition.** Carl Woese and George Fox's 1977 paper used 16S ribosomal RNA sequence comparison — a molecular chronometer applicable across all cellular life — to show that "archaebacteria" (Archaea) were as phylogenetically distant from Bacteria as either was from Eukarya. The five/six-kingdom system could not host this distinction: if Archaea, Bacteria, and Eukarya were each a "kingdom," then the kingdoms `Plantae`, `Animalia`, `Fungi`, `Protista` were sub-divisions of Eukarya and not peer to it. The taxonomy needed a *new top level* to express the asymmetry. The trigger was therefore **a measurement (rRNA sequence distance) that revealed structure the existing rank system had no slot for**.

**Earlier intermediate-rank additions** (phylum, family, suborder, superfamily, etc.) were triggered by simpler pressures: too many siblings at a given rank, or a meaningful grouping that had no name. These were silent extensions; no formal governance event accompanied them.

#### Q2 — Governance process

There is no single Linnaean governing body. The community accepted the domain rank gradually over roughly 1977–mid-1990s. NASA pre-announced Woese's 1977 result at a press conference, which alienated peers; Salvador Luria and Ernst Mayr publicly objected; Woese was branded "Microbiology's Scarred Revolutionary" in *Science* (1997). Acceptance came through accumulating molecular data, not through a vote. The de facto governance is **textbook adoption + journal usage + database adoption**, not a constitution.

For the current Codes (ICZN for animals, ICN for plants), governance applies to *nomenclature* (names) far more than to *rank structure*. The rank ladder itself is a convention adjusted only when the community is forced.

#### Q3 — What was lost?

When cladistics (Hennig's *Phylogenetic Systematics*, 1950, English 1966) won the methodological argument, the rank ladder lost most of its meaning. **Ranks became arbitrary labels for clades** — there is no operational criterion for what "should" be a family vs an order. Hennig himself proposed in 1969 that the absolute ranks be dropped; this was the origin of PhyloCode (rank-free phylogenetic nomenclature). Most working biologists kept the Linnaean ranks anyway, for backward compatibility with literature, education, and databases — but the ranks now carry less information than they did in 1900. **The information lost was the implicit promise that "two families have comparable taxonomic weight."** That comparability evaporated under cladistic scrutiny.

#### Q4 — Antipatterns

- **Pre-announcement before acceptance.** Woese's 1977 NASA press event delayed scientific acceptance by years.
- **Force-fitting new evidence into old slots.** Calling Archaea a "sixth kingdom" was tried and abandoned; the asymmetry of the data forced a new level above kingdom.
- **Retaining a rank ladder after its operational definition has dissolved.** The post-cladistic Linnaean ladder is kept by inertia; it is widely acknowledged to be semantically empty above genus, but the community has not accepted PhyloCode either. The result is two parallel systems with no clean mapping.

### A.3 Findings — MeSH (Medical Subject Headings)

#### Structural facts (verified)

MeSH is a polyhierarchical thesaurus produced by the U.S. National Library of Medicine. Descriptors are organized into **16 top-level categories** (A: Anatomy, B: Organisms, C: Diseases, D: Chemicals & Drugs, etc.), with up to **13 levels of depth** within each category. A single descriptor can have **multiple tree numbers** — i.e., it occupies multiple positions in the hierarchy. MeSH is therefore a **DAG, not a tree**, by explicit design.

#### Q1 — What triggered a level change?

Two distinct processes:

1. **Annual Maintenance Process (AMP).** Each year (release in late November), descriptors are added, modified, deleted, or moved within the tree. The trigger is **literature usage**: when a concept appears prominently in indexed publications without a precise descriptor, NLM staff propose a new term or refine an existing one. The 2025 release reports document explicit additions of Descriptors and Supplementary Concept Records (SCRs).
2. **Daily Supplementary Concept Records (SCR).** SCRs are a separate, faster-moving thesaurus for chemicals, protocols, diseases, and organisms. NLM Index Section chemists create roughly 5,000 SCRs per year. Each year, NLM "promotes" the most important SCRs to full Descriptors during the AMP — this is an explicit **promote** operation in MeSH governance.

#### Q2 — Governance process

- Internal NLM staff curate proposals (their own + user submissions to a help desk via "New MeSH term" suggestions).
- Annual cycle: proposals collected, reviewed internally, applied at the November release.
- All Medline records are **retroactively re-indexed** when the tree changes substantively, preserving query continuity.
- SCRs provide an out-of-cycle escape valve so urgent additions don't have to wait a year.

#### Q3 — What was lost?

The annual cycle deliberately re-numbers tree positions. Old tree numbers can be reassigned, which means **direct links to a tree position are not stable** — you must link to descriptor identifiers (UI), not tree numbers. This is a known feature, not a bug, but it cost MeSH cleanly-citable hierarchy paths.

#### Q4 — Antipatterns

- **Bloat.** MeSH currently has roughly 30,000 descriptors plus hundreds of thousands of SCRs. The annual review can no longer audit the full corpus; reviews are scoped to active subject areas. The system relies on the SCR/Descriptor split to keep the curated layer manageable.
- **Multiple tree positions for the same descriptor** (the polyhierarchy itself) creates query ambiguity: a search by tree path can return results that a search by descriptor ID does not, and vice versa.
- **Drift between literature and tree.** Some legacy descriptors persist for backward compatibility long after their concepts merged or split in practice.

### A.4 Findings — DDC and LCC (Library Classification)

#### Q1 — What triggered a level change?

**DDC: the computer science retrofit.** Computer science did not exist when Dewey designed the 000s in 1876. The 000s class was originally "Generalities" (encyclopedias, library science, journalism). When computing emerged, DDC had to fit it somewhere; it was placed at **004–006 (Data processing and Computer Science)** within the 000s. The first formal revision dedicating 004–006 to computer science was published in 1985 (Edition 19 revision, prepared by Julianne Beall et al., OCLC). The trigger was **a discipline that grew too large for the slot it was originally given**, plus the awkward fact that DDC's geometry (10 top classes × 10 × 10) does not easily expand at the top level — there is no 11th top class available, so retrofitting in place was the only option.

**LCC: schedule expansion.** Begun in 1901 (Charles Martel, J.C.M. Hanson). The K (Law) class wasn't started until 1969 and not completed until 2004 (subclass KB). New disciplines (aeronautics in subclass TL during the 1920s) were absorbed into existing top-level letters rather than getting new ones. LCC's 21-letter top level provides more headroom than DDC's 10-class fixed budget.

#### Q2 — Governance process

- **DDC** is owned by OCLC; revisions are published as new editions (Edition 23 is the current major print edition; the system is now primarily online). Since 2019, proposed Dewey revisions are posted publicly for comment — a recent shift toward open governance.
- **LCC** is owned by the Library of Congress; the Subject Cataloging Division (formed by 1941 reorganization) maintains schedules. Conversion to machine-readable form began in 1993, completed in 1996. Print schedules ceased in 2013; everything is now PDF/online.
- Both systems are governed by a **small expert body with periodic public input** — closer to MeSH's model than to Wikipedia's.

#### Q3 — What was lost?

- **DDC's cultural baggage.** The 200s (religion) is roughly 90% Christian-Protestant; for over a century, work by Black authors was forced into 325 (colonization) or 326 (slavery) regardless of subject; LGBTQ+ topics were classified in the 100s (psychology) under "mental derangements" until reclassification efforts post-1970s. Once a top-level allocation is made, *fixing* the bias is structurally hard because every existing book carries the old call number.
- **DDC's 000s coherence.** Putting computer science into "Generalities" means a single top class now hosts encyclopedias *and* CS — they're conceptually unrelated, but DDC's geometry forced the marriage.
- **LCC's K class coherence.** Building the largest legal classification system bottom-up over 35 years (1969–2004) means the early KB and the late additions reflect different drafting eras and have inconsistent depth.

#### Q4 — Antipatterns

- **Locking the top level early.** DDC's ten-class top-level budget was a 19th-century commitment with permanent consequences. Any new top-level discipline (computer science, environmental studies, gender studies) had to be retrofitted into a slot that didn't anticipate it.
- **Encoding the designer's worldview as schema.** DDC's bias is the textbook example: schema choices outlive the values that produced them by a century or more.
- **Incremental expansion without periodic top-level review.** LCC's K class shows that 35 years of bottom-up work can produce internal inconsistency that's expensive to correct.

### A.5 Findings — Wikipedia Categories

#### Structural facts

Wikipedia's category system is explicitly *not* a strict tree. Articles can belong to multiple categories; categories can have multiple parents. The MediaWiki software does **not** prevent cycles. Wikipedia guidelines tell editors to *avoid* cycles, but the system enforces nothing.

#### Q1 — What triggered a level change?

There is **no formal level**. The category graph is emergent: any editor can create a category, attach articles to it, and link it under any parent category. There are "main topic classifications" at the conceptual top, but these are themselves editable and have no constitutional authority. Restructuring happens when an editor notices a problem (a cycle, an orphan, an overcategorization) and proposes a fix — usually on a category talk page or via Categories for Discussion (CfD).

#### Q2 — Governance process

- **Bottom-up by default.** Anyone can create a category.
- **Categories for Discussion (CfD)** is the deletion/rename/merge venue, modeled on Articles for Deletion. Decisions are made by community consensus with no central body.
- **Bots and tools** detect orphan categories, cycles, and overpopulation, but cleanup is manual.

#### Q3 — What was lost?

The system never *had* a designed coherence to lose. What it doesn't have is:
- A guaranteed hierarchy (cycles exist; some are accepted as "self-referencing meta-categories").
- A guaranteed depth limit.
- A guaranteed orthogonality of dimensions (a category can mix topic, time period, geography, and format).

#### Q4 — Antipatterns (Wikipedia's main contribution to the literature)

- **Cycles.** Documented case: "academia" being typed as "education" while "education" was an "academic discipline" within "academia." One editor "fixed a cycle involving dozens of categories" by deciding building engineering is not a subcategory of construction. Cycles are not visually obvious — a reader navigating downward feels progress; only graph analysis reveals the loop.
- **Infinite or near-infinite depth.** No depth limit means subcategorizing-for-its-own-sake; the policy `Wikipedia:Overcategorization` exists specifically to push back.
- **Categories used as tags.** Editors add categories the way they add hashtags, conflating "topic of article" with "facet of article." The guideline "do not add categories to pages as if they are tags" exists because this happened at scale.
- **Eponymous category loops.** A category named after a topic and the article about that topic naturally form a 2-cycle; Wikipedia's workaround is to keep the article-namespace article in the parent category and not in the eponymous subcategory.
- **Multiple co-existing classification schemes.** Because the system is permissive, several incompatible schemes (by topic, by nationality, by year, by genre) overlap on the same articles, producing unpredictable category memberships.

### A.6 T1 Recommendations for our taxonomy

#### Tree vs DAG vs lattice for `domain`

**Recommendation: DAG, with strict acyclicity enforcement and a small set of curated top-level nodes.**

Evidence:
- **Trees fail under cross-disciplinary topics.** Biochemistry has two parents (biology, chemistry); FIDC has two parents (finance, regulation); ontology-instrumentation has two parents (artifact-ontology, agent-system). Every system surveyed eventually hit this and either (a) added multi-parenthood (MeSH explicitly: a descriptor has multiple tree numbers; Linnaean post-cladistics: a clade can be reached by multiple paths), or (b) duplicated nodes across the tree at known cost (DDC).
- **Lattices (FCA-style) are too expensive for the current corpus size.** Formal Concept Analysis derives concepts from object-attribute incidence; it requires either a complete attribute matrix or strong assumptions, and the maintenance burden is high. None of the four surveyed systems uses a true lattice. We have neither the corpus nor the tooling to justify it.
- **DAG with cycle prevention is the empirical sweet spot.** MeSH (formally polyhierarchic) and Wikidata properties (DAG by construction) are the working examples. They both demonstrate that DAG is sustainable at scale *if and only if* cycles are mechanically prevented — Wikipedia is the cautionary tale of a DAG without cycle enforcement.

**Concrete commitment:** `domain` values form a DAG. The vault tooling must enforce acyclicity at admission time (a cycle check on any new parent edge). Multi-parenthood is allowed but requires the operator to declare both parents explicitly — no "auto-inferred" parents.

(Note: this T1 raw recommendation was reconciled with T3's primary-tree recommendation in the synthesis above (resolution D-A) as a typed DAG with `subclass-of` constrained to a tree.)

#### Initial `domain` value seed (T1 day-one set)

Drawn from documents the vault already holds, with the deliberate discipline of *seeding small and letting the corpus grow the rest*. This evidence comes from DDC's lesson (designing a top-level lattice up front bakes in a worldview that outlives its accuracy by a century).

**Day-one seed (12 values), grouped by scope context:**

- **Ontology-scope:** `ontology-classification`, `ontology-governance`, `confidence-system`
- **World-scope:** `fidc`, `credit-rights`, `regulations-cvm`
- **Artifact-scope:** `event-system`, `folder-structure`, `frontend-architecture`, `agent-system`, `commit-discipline`, `vault-instrumentation`

Cross-cutting concerns (e.g., `agent-system` appearing in both ontology and artifact contexts) are handled by **multi-value `domain`**, not by structural duplication. This matches Wikidata-property practice and avoids the DDC trap.

**No upper-level grouping at day one.** Do not pre-create `formal-sciences` / `natural-sciences` / `applied-domains` parents. The DDC and LCC evidence is consistent: top-level commitments made before evidence accumulates become permanent debt. Add upper-level groupings only when (a) at least 3 sibling domains exist that need a common parent, and (b) a specific query would benefit from the grouping.

#### T1 first-cuts at growth rules (split / merge / promote / retire)

These are the four operations the next research wave (T4) refined. T1's evidence-backed first cuts:

##### Split (one domain becomes two)

**Trigger:** A domain accumulates documents that pattern-cluster into recognizable sub-groups, AND queries against the domain consistently need to disambiguate. MeSH's annual review uses a literature-usage signal; we can use a corpus-frequency + document-overlap signal.

**Criterion:** A domain qualifies for split when (a) it tags ≥ 8 documents, (b) at least two clusters of ≥ 3 documents each are internally similar and externally distinct (manual judgment for now; cosine similarity later), AND (c) at least one open question or audit has flagged the ambiguity.

**Anti-trigger:** Do not split because a domain is "big." MeSH's `Diseases` category has thousands of descriptors and has not been split at the top level — depth, not breadth, is the splitting criterion.

##### Merge (two domains become one)

**Trigger:** Two domains have high tag-overlap (most documents carrying one also carry the other) and operators cannot articulate a query that distinguishes them.

**Criterion:** Domains qualify for merge when ≥ 60% of documents tagged with one are also tagged with the other, AND no `discovery` or `spec` document treats them as distinct.

**Evidence:** This is the orthogonality-violation case at the value level. Wikipedia accumulates these because it has no merge governance; MeSH actively merges and renames descriptors yearly.

##### Promote (a value moves up a level / becomes a parent)

**Trigger:** A domain accumulates ≥ 3 child values that share it as their natural parent. (MeSH's "promote SCR to Descriptor" is the model — chemicals that prove central enough to the literature get promoted to first-class status annually.)

**Criterion:** Promotion requires (a) ≥ 3 children, (b) shared semantic basis explicitly named, (c) operator articulates a query that benefits from the grouping.

##### Retire (a value is deprecated)

**Trigger:** A domain has tagged 0 documents in the last N revisions, OR all its documents have been re-tagged to other domains.

**Criterion:** Mark `deprecated` first (do not delete); after one full review cycle without recovery, remove from the active vocabulary but keep in `ontology_events` as a historical record (the Linnaean lesson: never destroy provenance).

**Anti-pattern:** Do not retire a domain because its documents were retired. The domain's *concept* may still be needed; retire only when no plausible future document would carry it.

### A.7 T1 Cautions and Antipatterns Observed

The four taxonomies, taken together, surface the following antipatterns. Each is named so we can detect it in our own design.

| Antipattern | Source | Manifestation in our system would be |
|---|---|---|
| **Top-level early lock-in** | DDC (10-class budget, 1876) | Pre-committing to upper `domain` groupings before evidence accumulates. Mitigation: seed flat, group only on observed need. |
| **Schema-encoded worldview** | DDC's 200s religion bias, LGBTQ+ in 100s | Choosing `domain` parents that reflect ZefraHub's current concerns and freezing them. Mitigation: top-level review every N months. |
| **Cycle accretion** | Wikipedia categories | A `domain` graph that allows arbitrary parent links accumulates loops invisibly. Mitigation: mechanical cycle check at every new edge. |
| **Categories-as-tags** | Wikipedia | Operators tagging documents with `domain` values the way they would tag with `tags`, eroding the structure. Mitigation: keep `tags` as the free-text dumping ground; `domain` enforced at admission. |
| **Bloat without merge governance** | MeSH descriptor count; Wikipedia | Domain count grows monotonically because adding is easy and removing is awkward. Mitigation: explicit merge / retire operations, with their criteria documented. |
| **Promote without acceptance** | Woese's 1977 NASA press event | Declaring a new top-level `domain` before the corpus has absorbed the lower-level evidence. Mitigation: promote only after children exist and the parent name is operator-articulable. |
| **Retain ladder after definition dissolves** | Post-cladistic Linnaean ranks | Keeping a level structure that no longer carries information. Mitigation: each level must answer a query that no other level answers; if not, flatten. |
| **Force-fit new evidence into old slots** | DDC's CS in 000s; pre-1990 "sixth kingdom" attempts for Archaea | Stuffing a new domain into an inappropriate parent because that's where there's room. Mitigation: orphan-with-no-parent is preferable to wrong-parent; structure follows evidence, not vice versa. |
| **Eponymous-category loop** | Wikipedia | A `domain` value that names the same thing as a parent (e.g., `agent-system` both as a domain and as a parent of `agent-system-instrumentation`). Mitigation: parent-domains and leaf-domains use distinct naming conventions where confusion would otherwise arise. |
| **Pre-announce before adoption** | Woese's 1977 NASA event | Publishing a top-level taxonomy change without operator consensus. Mitigation: structural changes go through `ontology_events` with explicit migration period. |

### A.8 T1 Sources

- [Three-domain system — Wikipedia](https://en.wikipedia.org/wiki/Three-domain_system)
- [Carl Woese — Wikipedia](https://en.wikipedia.org/wiki/Carl_Woese)
- [The discovery of archaea — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC10965645/)
- [Linnaean taxonomy — Wikipedia](https://en.wikipedia.org/wiki/Linnaean_taxonomy)
- [Taxonomic rank — Wikipedia](https://en.wikipedia.org/wiki/Taxonomic_rank)
- [Phylogenetic nomenclature — Wikipedia](https://en.wikipedia.org/wiki/Phylogenetic_nomenclature)
- [MeSH Tree Structures — NLM](https://www.nlm.nih.gov/mesh/intro_trees.html)
- [Annual MeSH Processing for 2025 — NLM Technical Bulletin](https://www.nlm.nih.gov/pubs/techbull/nd24/nd24_annual_mesh_processing.html)
- [User Suggestions for Medical Subject Headings — NLM](https://www.nlm.nih.gov/mesh/meshsugg.html)
- [Medical Subject Headings — Wikipedia](https://en.wikipedia.org/wiki/Medical_Subject_Headings)
- [Library of Congress Classification — Wikipedia](https://en.wikipedia.org/wiki/Library_of_Congress_Classification)
- [DDC 004-006 Computer Science Revision (1985) — Internet Archive](https://archive.org/details/ddcdeweydecimalc0000dewe_g5t3)
- [Move Over, Melvil! Bias in DDC — School Library Journal](https://www.slj.com/story/move-over-melvil-momentum-grows-to-eliminate-bias-and-racism-in-the-145-year-old-dewey-decimal-system)
- [Wikipedia:Categorization — Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:Categorization)
- [Wikipedia:Overcategorization — Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:Overcategorization)

---

## Appendix B — Upper Ontologies and the Top of the Tree (T2)

> Original research output addressing **OQ-4** of `scope-and-domain-axes.md`: do any of the established upper ontologies (BFO, DOLCE, SUMO, Cyc, schema.org, WordNet) provide a defensible reference for our `scope` axis or for the upper levels of `domain`? This appendix surveys each, evaluates which distinctions have survived 20+ years of use vs. which remain contested, and recommends which (if any) we should adopt as a *reference* — not a *commitment* — when the `domain` taxonomy grows.

### B.1 Framing — what an "upper ontology" is and is not

An upper (or *foundational*, *top-level*) ontology proposes the **highest-level categories** under which all more specific concepts sit. The motivation is interoperability: if two domain ontologies (say a clinical-trials ontology and a financial-instruments ontology) both extend the same upper ontology, their categories should — in principle — compose without contradiction.

Two things are critical to recognize before evaluating any of them:

1. **Upper ontologies are philosophical commitments dressed as engineering.** The choice of "continuant vs. occurrent" or "endurant vs. perdurant" reflects positions in metaphysics that have been debated for centuries. There is no neutral upper ontology.
2. **Our `scope` axis is not the same kind of thing.** `scope: ontology / world / artifact` is **not** a metaphysical taxonomy of being. It is an *epistemic-stack* axis: where in the meta-system this document sits (about-the-graph, about-reality, about-our-product). Most upper ontologies do not even have a category for "documents about the knowledge graph itself" — they would treat the vault itself as just another artifact in the world.

This research therefore evaluates upper ontologies on **two distinct questions**:

- **Q-A:** Does the ontology align with the three-way `scope` split? (Almost certainly: no.)
- **Q-B:** Does the ontology offer defensible top-level categories for `domain` — i.e., when world-scope `domain` values like `mathematics`, `biology`, `finance` cluster, what's a sensible parent category?

### B.2 BFO — Basic Formal Ontology

**Author / governance.** Barry Smith (Buffalo) and Werner Ceusters, with a tight community around the Institute for Formal Ontology and Medical Information Science (IFOMIS). Released since the early 2000s. BFO 2.0 was the long-stable version; **BFO 2020** is the current ISO standard (ISO/IEC 21838-2:2021). Used as the upper ontology of the **OBO Foundry** family (Gene Ontology, Cell Ontology, ChEBI, etc.) — by far the highest-stakes production deployment of any upper ontology.

**Top-level categories (BFO 2020).** The root is `entity`. The first split is the **continuant / occurrent** divide:

- **Continuant** — entities that endure through time, having all their parts at every moment they exist (a cell, a person, a country).
  - Independent continuant — material entity, immaterial entity (e.g., spatial regions).
  - Specifically dependent continuant — qualities, realizable entities (roles, dispositions, functions).
  - Generically dependent continuant — information artifacts (a particular journal article PDF as a pattern).
- **Occurrent** — entities that unfold in time, having temporal parts (a heartbeat, a meeting, the Cretaceous period).
  - Process, process boundary, temporal region, spatiotemporal region.

**Defensibility.** Strong — BFO has been **in production use for ~20 years across hundreds of biomedical ontologies**. The continuant/occurrent split is its most enduring contribution and is the most defensible category-pair in any upper ontology because the *use case* (annotating biomedical reality) maps cleanly onto it: a tumor is a continuant; tumor growth is an occurrent. The split has survived peer critique for decades.

**Critiques.** Three major lines:
- **Realist commitment.** BFO commits explicitly to *realism* — categories are claims about how the world *is*, not about how we model it. DOLCE rejects this. Critics from a conceptualist or constructivist position find this alienating.
- **No category for fictional / non-existent / counterfactual entities.** A novel's protagonist or an unbuilt building has no clean home.
- **"Roles" and "dispositions" as specifically-dependent continuants.** Operationally fiddly — annotators frequently disagree on whether something is a role vs. a quality vs. a function.

**Alignment with `scope`.** No clean alignment. BFO's split is *temporal mode of existence*, not *epistemic position*. Our `ontology` scope (the rules of the graph) would be, in BFO terms, a generically dependent continuant (an information artifact). Our `world` and `artifact` scopes both contain documents *about* continuants and occurrents — the BFO axis is orthogonal to ours.

**Alignment with upper levels of `domain`.** BFO is **not a discipline taxonomy** — it does not say "biology is a sub-domain of natural sciences." It says "biological entities are continuants/occurrents of certain kinds." So BFO does not directly help structure the `mathematics` / `biology` / `finance` upper levels. What it *can* help with is annotating the *kind of entity a domain document is about* — but that's a different label, not a parent in the `domain` tree.

### B.3 DOLCE — Descriptive Ontology for Linguistic and Cognitive Engineering

**Author / governance.** Nicola Guarino, Claudio Masolo, Aldo Gangemi, Stefano Borgo, et al. at LOA (Laboratory for Applied Ontology, Trento, Italy). Born of the EU **WonderWeb** project, ~2002. Stable since ~2003; **DOLCE-Lite** and **DOLCE-Ultralite** are the OWL-friendly cuts most often used.

**Top-level categories.** The root is `Particular` (vs. universals, which are not in DOLCE itself). The first split is **endurant / perdurant** (which sounds like BFO's continuant/occurrent but is philosophically distinct — see critiques):

- **Endurant** — wholly present at every moment of existence (a chair, a person).
  - Physical endurant (amount of matter, physical object, feature).
  - Non-physical endurant (mental object, social object, information object).
  - Arbitrary sums.
- **Perdurant** — has temporal parts (an event, a process, a state).
  - Event (achievement, accomplishment), Stative (state, process).
- **Quality** — particularized properties (the redness of *this* apple, not redness-in-general). Note: DOLCE quality is *trope-like*, a key distinguisher.
- **Abstract** — region-like entities with no spatial or temporal location (a numeric value, a region of color space).

**Defensibility.** Mature. DOLCE has been used in many academic and EU-funded projects (cultural heritage, linguistics, NLP, legal ontology), but it does not have BFO's biomedical-OBO-Foundry breadth of *production* deployment. Its philosophical distinctions (especially **descriptive** vs. realist; the explicit treatment of qualities as tropes) are well-defended in the literature.

**Critiques.**
- **DOLCE / BFO incompatibility.** Despite surface similarity, DOLCE's *descriptive* stance ("we model how cognitive agents conceive of the world") is incompatible with BFO's *realist* stance. The two cannot be merged. There has been a long-running, sometimes acrimonious, debate (Smith vs. Guarino-and-Gangemi) about which approach is more useful.
- **The "social object" and "information object" categories drift.** Different DOLCE-derived ontologies disagree on what counts as a social object.
- **Qualities-as-tropes is conceptually elegant but operationally heavy** — most engineers default to representing qualities as classes-of-values instead.

**Alignment with `scope`.** Slightly more flexible than BFO, because DOLCE *does* have a category for `Information Object` (a non-physical endurant). Our `ontology` scope would map there. But again, this is a *what kind of thing the document is about* axis, not an *epistemic-stack-position* axis. No clean alignment.

**Alignment with upper levels of `domain`.** DOLCE is closer than BFO to having something useful here, because its upper-level distinction between *physical*, *non-physical (mental, social, information)*, and *abstract* roughly mirrors a familiar three-way split: natural sciences, social/cognitive sciences, formal sciences. **But this is a coincidence of structure, not a discipline taxonomy.** DOLCE classifies *things*, not *fields of study*.

### B.4 SUMO — Suggested Upper Merged Ontology

**Author / governance.** Originally Adam Pease and Ian Niles for the **IEEE Standard Upper Ontology** working group, ~2000. Ongoing development at Articulate Software. Available in SUO-KIF and OWL. Roughly 25,000 terms, 80,000 axioms in the full SUMO+MILO+domain-extensions stack.

**Top-level categories.** SUMO is more granular and more *engineering-flavored* than BFO or DOLCE. The root is `Entity`. The first split is **Physical / Abstract**:

- **Physical**
  - **Object** (collection, self-connected object: organism, artifact, region, substance).
  - **Process** (intentional process, internal change, motion, biological process, etc.).
- **Abstract**
  - **Quantity** (number, physical quantity).
  - **Attribute** (internal attribute, relational attribute).
  - **SetOrClass**.
  - **Proposition**.
  - **Relation**.
  - **Graph**, **GraphElement** (mathematical graph theory).

**Defensibility.** Mixed. SUMO has the breadth (it includes mid-level ontologies — MILO — and domain ontologies for finance, government, geography, etc.), but it has not achieved the *production-system penetration* that BFO has via OBO Foundry. It is heavily used in academic NLP and reasoning-system work, less so in industry. The **Physical / Abstract** top split is defensible and survives critique; the deeper SUMO category tree is more opinionated and less universally adopted.

**Critiques.**
- **Ontological commitment is sometimes ad hoc.** SUMO mixes Aristotelian categories (substance, attribute, relation) with computational-engineering categories (Graph, SetOrClass) at the same level. Purists object.
- **The Process category is a catch-all** that mixes physical processes (motion) with intentional/agentive ones (giving, communication) — DOLCE and BFO are tidier here.
- **Maintenance burden.** With 80,000 axioms, the consistency-checking story is non-trivial.

**Alignment with `scope`.** No. Same reason as BFO/DOLCE: it is a metaphysical taxonomy, not an epistemic-stack axis.

**Alignment with upper levels of `domain`.** SUMO is the closest of the three philosophical upper ontologies to having an opinion about *disciplines*, because it ships with **mid-level domain ontologies** (Finance, Government, Geography, Communications, Military, etc.). But these are upper-mid, not "the top of the discipline tree" — SUMO does not say "Mathematics is the parent of Algebra, which is the parent of Group Theory."

### B.5 Cyc / OpenCyc and Microtheories

**Author / governance.** Doug Lenat at Cycorp, started 1984 — **the longest-running AI knowledge-engineering project in history**. ResearchCyc and OpenCyc were the academic-access subsets. **OpenCyc was discontinued in 2017**; ResearchCyc remained available; the full Cyc KB is commercial. (Cycorp was acquired in 2024; details of ongoing public release are unclear at the time of writing — verify current status if this matters operationally.)

**Top-level categories.** Cyc has tens of thousands of upper-level concepts; the very top is `Thing`, then `Individual`, `Collection`, `Relation`, etc. — broadly Aristotelian. The category-tree details are less interesting than the device that makes Cyc *unusual*: **microtheories**.

**Microtheories — the defensible idea.** Cyc recognizes that **truth is context-dependent**. The fact "Sherlock Holmes lives at 221B Baker Street" is true in the `SherlockHolmesMt` microtheory and false in the `RealWorldMt` microtheory. The fact "the Earth is the center of the universe" is true in the `PtolemaicAstronomyMt` and false in `ModernAstronomyMt`. Each microtheory carries its own consistent set of assertions; cross-microtheory inference must explicitly bridge.

This is **extraordinarily relevant to our `scope` axis** — because the entire reason we need `scope: ontology / world / artifact` is that the *same proposition* is being asserted in three different "contexts of accountability":

- A claim in `scope: ontology` is accountable to the rules of the knowledge graph.
- A claim in `scope: world` is accountable to external reality.
- A claim in `scope: artifact` is accountable to our codebase.

Cyc's microtheory device is the closest analogue in the upper-ontology literature to what our `scope` axis is doing. **Whether or not we adopt any Cyc category, we should acknowledge microtheories as the prior art for the move we are making.**

**Defensibility.**
- **Microtheories: highly defensible.** The basic idea — that an assertion's truth depends on a context — is widely adopted under different names (modal logic worlds, Kripke frames, named graphs in RDF, contextual inference in description logics). It has 40 years of production use inside Cyc itself.
- **The Cyc category tree itself: contentious.** Critics (Hayes, Smith, Russell, others) have argued for decades that Cyc is opaque, hard to evaluate, and that its assertions are inconsistent across microtheories in ways that are hard to audit.
- **OpenCyc's discontinuation in 2017** suggests the community-facing slice did not achieve self-sustaining adoption. The commercial KB is alive but not externally visible.

**Critiques.**
- **Closed.** The full KB has been commercial-only for most of its life; reproducibility of any claim about Cyc's categories is poor.
- **"Common-sense" knowledge engineered by hand.** Modern LLMs absorb common-sense via scale rather than hand-coded axioms; Cyc's economic moat has weakened.
- **Microtheories themselves are well-studied formally** (Guha's PhD thesis, McCarthy's contexts) but the broader Cyc machinery is less so.

**Alignment with `scope`.** **The microtheory device aligns conceptually with our `scope` axis.** Each value of `scope` is, in effect, a microtheory: a context within which assertions cohere with their own accountability. We should cite this as prior art.

**Alignment with upper levels of `domain`.** Cyc has a discipline-like upper-level breakdown (life-sciences, social-sciences, physical-sciences, formal-sciences, applied-domains), but because most of the public documentation has aged and OpenCyc is gone, we cannot point to a stable, citable, current discipline tree from Cyc.

### B.6 schema.org — the Thing hierarchy

**Author / governance.** Founded 2011 by Google, Microsoft, Yahoo, and Yandex — a corporate consortium for marking up web content for search engines. Now maintained at schema.org with a steering committee. Pragmatic, web-scale, **decided by what search engines actually need**, not by metaphysics.

**Top-level categories.** Root is `Thing`. Top-level direct subclasses (eight, stable for years):

- `Action`
- `CreativeWork`
- `Event`
- `Intangible`
- `MedicalEntity` (later subsumed under `Thing` for biomedical)
- `Organization`
- `Person`
- `Place`
- `Product`

Note that this is **far from philosophically pristine** — `Person` and `Organization` are direct top-level siblings of `Thing`, when philosophically a `Person` should be a kind of `Agent` should be a kind of physical-object-with-mind. But `Person` and `Organization` are operationally what marketers tag, so they get top billing.

**Defensibility.** Extremely high in *practice* — schema.org is the **most-deployed structured-data vocabulary on the web**, used on tens of millions of sites. **Pragmatically defensible: the categories survived because search engines and webmasters use them.** The top eight have been stable for over a decade.

But: schema.org's *philosophical* defensibility is intentionally low. It does not aspire to be coherent metaphysics; it aspires to be useful for marking up "things people search for." `Action` is at the top because Google's Knowledge Graph needs to express verbs.

**Critiques.**
- **No clear top-level distinction.** No continuant/occurrent split, no physical/abstract split — just "what marketers tag."
- **Inconsistent inheritance.** `Event` is a top-level peer of `Thing`-children, but events arguably should be subtypes of `Action`. Many such cases.
- **No formal semantics.** Some types use `additionalType` to RDF/OWL classes, but the core schema.org vocabulary is a tree of class names with rdfs:subClassOf and minimal axioms.

**Alignment with `scope`.** None — schema.org makes no scope-like distinction.

**Alignment with upper levels of `domain`.** schema.org's `CreativeWork` subtree is the closest analogue to "documents we have about a topic," and within it, **subject-area is encoded in `about:` properties pointing to other Things** — not as a discipline taxonomy. Helpful as a *reference for tagging individual documents about a thing*, but not as a *parent tree for disciplines*.

### B.7 WordNet — top-level synsets

**Author / governance.** George Miller, Princeton, since 1985. Lexical-semantic database, not a philosophical ontology. **Most used language-resource in computational linguistics ever.**

**Top-level "unique beginners"** (synsets with no hypernym, ~25 in the noun hierarchy):

- entity (root)
  - physical entity, abstract entity (the most-cited high split).
  - Within physical entity: object (organism, artifact, geological-formation, natural-object), substance, matter, process, thing, location.
  - Within abstract entity: psychological-feature, attribute, group, relation, communication, measure, otherness.

WordNet's noun taxonomy was constructed bottom-up from English vocabulary; the upper-level structure was **read off**, not designed.

**Defensibility.** Very high *as a record of how English speakers carve up the world*. Not defensible as metaphysics — its categories are linguistic, not ontological. (Famously, WordNet has separate synsets for things that are formally identical, because the words are different in English.)

**Critiques.**
- **Linguistic, not ontological.** WordNet says what English-speakers categorize, not what is. (Compare to FrameNet, which is more semantic.)
- **Multilingual extensions (EuroWordNet, Open Multilingual WordNet) reveal the English bias of the original top categories.**
- **Inconsistent hypernymy chains.** Sometimes 12 levels deep, sometimes 4.

**Alignment with `scope`.** None — WordNet doesn't have meta-levels.

**Alignment with upper levels of `domain`.** **More useful than the philosophical upper ontologies for `domain`**, because WordNet's `abstract entity > communication > written-communication > document > ...` and `abstract entity > cognition > knowledge-domain > field-of-study` subtrees actually contain *the names of disciplines* (mathematics, biology, history) as synsets with hypernym chains. The chains are not super-clean, but they are real and based on usage.

### B.8 Cross-Cutting Comparison

| Ontology | Top split | Defensible distinctions | Production scale | Aligns with our `scope`? | Useful for `domain` upper levels? |
|---|---|---|---|---|---|
| BFO 2020 | continuant / occurrent | continuant/occurrent (very) | OBO Foundry, biomedical (huge) | No | No (classifies things, not fields) |
| DOLCE | endurant / perdurant + quality + abstract | descriptive stance, qualities-as-tropes | EU/academic projects (medium) | No | Indirect (physical/non-physical/abstract roughly mirror nat/soc/formal sciences) |
| SUMO | physical / abstract | physical/abstract; mid-level domain ontologies | NLP/reasoning (medium) | No | Partial (ships finance/geo/etc. mid-level) |
| Cyc | many | **microtheories (extremely)** | Cycorp commercial; OpenCyc dead | **Conceptual prior art via microtheories** | Stale (OpenCyc gone) |
| schema.org | flat top-of-Thing | pragmatic stability of top 8 types | **Web-scale (largest)** | No | No (no discipline tree; uses `about:` properties) |
| WordNet | physical / abstract entity | lexical clustering | Computational linguistics (huge) | No | **Yes, partial** — `field-of-study` synsets give a usage-derived discipline tree |

### B.9 T2 Recommendations for our taxonomy

#### R-1 — No upper ontology aligns with `scope: ontology / world / artifact`. Do not anchor `scope` to any of them.

The `scope` axis is **epistemic-stack positioning**, not metaphysics. None of BFO, DOLCE, SUMO, or schema.org have a category for "documents about the rules of the knowledge graph itself." Forcing alignment would distort our axis or theirs.

**However:** Cyc's **microtheory device** is the closest thing in the upper-ontology literature to what `scope` is doing. We should cite microtheories as **prior art** for the move (each `scope` value is, in effect, a context of accountability; cross-`scope` documents are the bridges Cyc would call inter-microtheory rules). This is a *conceptual citation*, not a structural commitment.

#### R-2 — For upper levels of `domain`, no upper ontology gives a clean "tree of disciplines." Use them differentially.

Concretely, when `domain` grows to need an upper level, we should expect a small set of *kind-of-knowledge* categories (formal sciences, natural sciences, social sciences, applied/engineering, humanities, business-and-regulatory) — but **none of the upper ontologies surveyed offer this directly**.

The best partial sources are:

- **WordNet's `field-of-study` subtree** — gives usage-derived discipline groupings; closest to a discipline tree.
- **DOLCE's physical/non-physical/abstract split** — coincidentally maps onto natural / social / formal sciences and is a defensible *meta-level* organizer.
- **SUMO's mid-level domain ontologies** — useful as *examples* of how a domain ontology hangs off an upper one (Finance, Government, Geography), not as a parent structure.
- **Cyc's microtheory taxonomy of subject-matter contexts** — formerly useful, now stale due to OpenCyc discontinuation.

#### R-3 — Specific recommendation: use **DOLCE physical/non-physical/abstract** as a *reference* for the upper levels of `domain` if and when one is needed.

Reasoning:

1. It survives the orthogonality discipline at the meta-level (the three categories are non-overlapping in their canonical extension).
2. It is descriptivist rather than realist — it does not commit us to claims about how the world *is*, only about how we *talk about it*. This matches the vault's role as a knowledge graph rather than a scientific instrument.
3. The mapping onto natural / social-and-cognitive / formal sciences is intuitive and survives sanity-checking against the disciplines we expect to see (`mathematics` → abstract → formal; `biology` → physical → natural; `marketing` → non-physical / social → social; `finance` → mostly social; `regulatory-frameworks` → social).
4. We are **not committing to DOLCE**. We are using it as a *named reference point* the way an architect might cite a pattern language without buying the whole framework.

If DOLCE proves insufficient, the **fallback reference** is BFO's continuant/occurrent at the *what-the-document-is-about* level — but this is an entity-axis, not a discipline-axis, and would not directly structure `domain` upper levels.

#### R-4 — Do **not** adopt any upper ontology as an ontological commitment.

Adopting BFO, DOLCE, or SUMO as our actual ontology (in the OWL sense) would lock us into philosophical positions that are out of scope for a universal-domain knowledge graph. We should retain freedom to model on our own terms while *citing* upper ontologies as references where useful.

#### R-5 — When `domain` upper levels are eventually drafted (post-T1/T3), evaluate the proposal against:

- **Orthogonality at the meta-level** — do the upper-level categories themselves carry independent information?
- **Usage stability** — can a reasonable annotator place 90%+ of expected disciplines unambiguously?
- **Survives the WordNet sanity-check** — does the proposed parent of `mathematics`, `biology`, etc. agree, broadly, with how English-speakers cluster fields of study? If yes, we have ecological validity. If no, we should ask why.

### B.10 T2 Cautions

- **Realism vs. descriptivism is a real fork.** BFO and DOLCE differ on whether categories are claims about *the world* or about *our way of describing the world*. Our vault is a *knowledge graph* (representations) rather than a *scientific instrument measuring reality*, so descriptivism (DOLCE-flavored) is the better fit. Adopting BFO would import a realist commitment we have no need for.
- **BFO and DOLCE cannot be merged.** Anyone proposing "let's use BFO and DOLCE both" should be redirected to the literature documenting why this has failed repeatedly.
- **schema.org's pragmatism is a feature in its context, a hazard in ours.** schema.org gets to be inconsistent because Google decides what counts as success. We do not have an external ground-truth oracle; our consistency must be internal. Borrowing schema.org's *categories* without its *governance model* loses the property that made them defensible.
- **OpenCyc is gone (2017).** Anyone reading legacy AI papers may assume OpenCyc is still publicly browsable. It is not. Cite ResearchCyc only if you can verify its current access; otherwise, treat Cyc's microtheory **idea** as the citable contribution, not the KB.
- **Upper ontologies do not classify disciplines.** This is the single most-likely-to-be-misunderstood point: BFO classifies *what kinds of things exist*, not *what fields study them*. Our `domain` axis is the second kind. The upper ontologies are at most a *reference for the meta-organization of the first level above disciplines* — they are not themselves a discipline catalog.
- **Beware "philosopher-bait" categories.** If a category exists in an upper ontology only because a philosopher needed it for a journal article (e.g., DOLCE's `arbitrary sums` or BFO's distinction between dispositions and roles in production cases where annotators can't agree), it likely will not survive in our setting either.
- **Confidence calibration.** The original T2 was `veracidade: medium` (the ontologies surveyed are real and well-known; specific version numbers and current-status claims for Cyc 2024+ should be verified) and `convicção: low` (we are not committing to any of these — we are surveying for reference).

---

## Appendix C — Tree vs DAG vs Lattice: Structural Commitment for `domain` (T3)

> Original research output for OQ-1 of the scope-and-domain-axes discovery. Surveys real-world taxonomy structures (OBO Foundry, Wikidata, Formal Concept Analysis, ontology-alignment failures, pragmatic hybrids) and recommends a structural commitment for the vault's `domain` axis.

### C.1 Objective

Answer the question: *what structure should the vault's `domain` axis commit to, given that it must hold any discipline plus any business domain, and is meant to be both human- and agent-authored?*

This is research, not prescription. The recommendation in §C.7 is opinionated but explicitly marked `veracidade: medium / convicção: low` in the original T3 — it is a strategic bet pending empirical validation as the corpus grows.

### C.2 Tree (single-parent hierarchy)

**Canonical examples:** Linnaean taxonomy (pre-phylogenetics), Dewey Decimal Classification, Library of Congress Classification, traditional file systems, ACM CCS in its original form.

**When it works.** Trees work when the domain has a *natural* dominant axis of differentiation (kingdom → phylum → class for organisms, by their pre-Darwinian morphological view) and when the corpus is small enough that mis-classifications can be corrected by hand. Trees are the cheapest structure to author, the cheapest to query (every node has a unique path), and the cheapest to render (any UI tree component works). They are also the easiest to *teach*: a single parent is a single mental model.

**Failure modes.**
- **Cross-cutting concepts force arbitrary choice.** Biochemistry has two natural parents (biology, chemistry). Mathematical biology has three (mathematics, biology, plus modeling-as-method). Trees force an analyst to *pick one* and demote the others to "see also" links. The choice is forced by structure, not content.
- **Phylogenetic shock.** Linnaean ranks (kingdom, phylum, class, order, family, genus, species) were a tree until cladistics demonstrated that the rank levels themselves are arbitrary — a "family" in birds is not commensurable with a "family" in beetles. Modern systematics has effectively abandoned strict ranks in favor of clades, which form a *DAG when reticulate evolution (hybridization, horizontal gene transfer) is admitted*.
- **Library-classification rigidity.** DDC's 000–099 "Computer science, information & general works" famously squeezes the entire field into 100 numbers because the tree was fixed in 1876 and the cost of restructuring outweighs the benefit. Resists growth.

**Costs.**
- Authoring: **lowest.** One parent decision per node.
- Query: **lowest.** Single path → trivial recursive descent.
- Maintenance: **medium.** Cheap day-to-day; expensive when a structural revision is forced (e.g., DDC's repeated mis-fit with computing).
- Governance: **lightest.** A single arbiter can adjudicate parent choices.

### C.3 DAG (directed acyclic graph, multiple parents allowed, no cycles)

**Canonical examples:** Wikidata (P279 "subclass of", P31 "instance of"), Gene Ontology, Disease Ontology, Cell Ontology, Schema.org's full type graph (with multiple `rdfs:subClassOf` permitted), modern phylogenetic trees with reticulation.

**When it works.** DAGs work when (a) cross-cutting is the rule rather than the exception, (b) the corpus is large enough that forcing a single parent would be repeatedly absurd (biochemistry, neuroscience, computational biology), and (c) there is a community willing to invest in *ongoing* structural curation. DAGs are the de facto structure for serious knowledge graphs at scale.

**OBO Foundry's experience.** OBO biomedical ontologies are explicit DAGs. The Gene Ontology is the canonical case: it began with `is_a` as the dominant edge type, and quickly discovered that `is_a` was being **overloaded** to express several distinct semantic relations — true subsumption (apoptosis is_a programmed cell death), part-of (mitochondrion as part of cell), regulation (positively_regulates), develops_from. The fix was the **Relations Ontology (RO)**, which formalized a vocabulary of typed edges so that `is_a` could mean only true subsumption and other relations get their own edge type. The lesson: **multiple inheritance solves the "two parents" problem but creates the "what kind of parent?" problem**, and the answer is to *type the edges*, not restrict the structure.

A debated but mostly settled view in the OBO community (see Mungall, "Single-inheritance principle considered dangerous", 2019) is that strict single-inheritance is harmful: it forces ontologists to omit true relations and creates artificial trees that misrepresent the biology. Disease Ontology, for example, displays multiple-inheritance to users in OLS and the Alliance pages — single-inheritance views are seen as *renderings*, not the truth.

**Wikidata's experience.** Wikidata operates as a polyhierarchical DAG over P279 and P31. At Wikipedia scale (12,000+ properties, tens of millions of entities), known pathologies are documented and persistent:

- **Cycles.** P279 should be acyclic; in practice cycles do appear and are treated as bugs to be cleaned. They are caught by automated checks but never fully eliminated.
- **Instance vs subclass confusion.** The P31 / P279 distinction is the single most-violated rule. An item ends up *both an instance of and (transitively) a subclass of* the same class — the "instance and subclass of subclass of same class" anti-pattern. Recent analyses count over 2 million occurrences of one such anti-pattern and over 3 million of another, with growth over a five-year window — meaning the structure scales but **errors scale faster than curation**.
- **Class-order disorder.** Classes of classes (metaclasses) and ordinary classes are routinely confused.
- **Multi-axial pressure.** Recent research (e.g., the "multi-axial mindset" paper, 2025) argues that Wikidata's ontology is most coherent when read as a *polyhierarchy across multiple axes*, not as a single is-a hierarchy — i.e., the structure has implicitly become a labelled-edge DAG anyway.

**Failure modes (DAGs in general).**
- **Edge-type overloading** — the GO `is_a` problem. Solved by typed relations, at the cost of additional governance.
- **Cycle drift** — at scale, validators must run continuously.
- **Instance-vs-class drift** — meta-level confusion is endemic.
- **Query complexity** — "all subclasses of X" requires transitive closure over a graph with branching, not a tree walk. Explainability suffers: which parent path got me here?
- **Diamond problem** — when a node inherits via two paths, conflicting attribute values (or conflicting edge types) must be reconciled.

**Costs.**
- Authoring: **medium-high.** Each new node may have multiple parents; each parent choice must be justified.
- Query: **medium.** Transitive closure is straightforward but more expensive than tree walks; needs indexing at scale.
- Maintenance: **high.** Cycle detection, instance-vs-class checks, edge-type discipline must run continuously.
- Governance: **heavy.** Wikidata maintains a WikiProject Ontology specifically to triage P279/P31 misuse; OBO Foundry maintains the Relations Ontology and Foundry-wide review.

### C.4 Lattice (Formal Concept Analysis, Wille 1982 onward)

**Canonical examples:** FCA concept lattices extracted from object-attribute incidence matrices; theoretical foundation under-the-hood for some recommender and clustering systems; descriptive analysis of unstructured tag systems.

**When it works.** FCA's distinctive property is that the lattice **emerges from the data** rather than being imposed by an authoring committee. Given a binary matrix (objects × attributes), the formal concepts (closed pairs of object-set / attribute-set) and their order form a complete lattice algorithmically. Strengths:
- Mathematically grounded — the structure is the unique minimal closure of the data.
- No arbitrary level choice — there are no "kingdom / phylum / class" decisions, the levels are derived.
- Good for exploratory analysis: "given my tags, what are the natural concept clusters?"
- Useful as a *diagnostic*: run FCA on an existing taxonomy and see where the imposed hierarchy disagrees with the data-implied lattice.

**When it is wrong.**
- **Computational cost.** Concept lattices are worst-case exponential in the number of attributes. For corpora at vault-scale (tens to thousands of documents, dozens to hundreds of tags) it is tractable; for full-knowledge-graph scale it is not.
- **Hard for humans to author directly.** FCA's outputs are often non-intuitive — concepts that are mathematically "real" may not have natural-language names. Authoring *as a lattice* is something almost no production system does.
- **Brittle to noise.** A single mis-tagged object can shift the lattice; the structure is high-variance under sparse data.
- **Doesn't fit the human authoring loop.** Humans want to *say* "biochemistry is a child of biology and chemistry"; FCA wants to *derive* that from the tag matrix. The two workflows do not compose well.

**Costs.**
- Authoring: **low at the surface (just tag), but the lattice is a derived artifact, not directly editable.**
- Query: **medium-high.** Lattice operations are well-defined but require library support.
- Maintenance: **high computational, low manual.** The lattice is recomputed; humans don't curate it.
- Governance: **inverted.** Governance is over the *attributes* (what tags exist, what they mean), not over the structure.

**Verdict on FCA.** Powerful as a *diagnostic* and *exploratory* tool; rarely the right primary structure for an authored knowledge graph. It is a complement to a DAG/tree, not a replacement.

### C.5 The ontology-alignment / mismatch problem

When two taxonomies have to be merged — two companies' KGs, or overlapping biomedical ontologies — what fails?

- **GALEN.** A 1990s-era medical ontology in description logic. Its idiosyncratic naming conventions and object properties were widely cited as a reason it never reached the adoption of SNOMED CT despite arguably superior formal grounding. Lesson: *idiosyncratic local choices kill alignment even when the local ontology is internally clean*.
- **SNOMED CT × UMLS × NCI.** Aligning SNOMED CT and the NCI thesaurus via UMLS-based mappings produced **over 20,000 unsatisfiable classes** (logically inconsistent, no model satisfies them simultaneously). The fix required mapping debuggers (Alcomo, LogMap) plus manual curation. Even with high-quality source ontologies, naive merge-by-mapping produces logical chaos at scale.
- **SNOMED CT vs Basic Formal Ontology.** The category "clinical finding" sits differently in SNOMED's pragmatic hierarchy and BFO's upper-ontology categorization (continuant vs occurrent). Convergence requires either rewriting one of the two or accepting permanent friction.

**The general lesson.** Alignment is *expensive* and *partial*. Two DAGs with overlapping subject matter rarely merge cleanly — the merge produces inconsistencies that take dedicated tooling and human curation to resolve. **Implication for our vault: avoid premature alignment with external ontologies; treat them as *referenceable* but not *authoritative* over our structure.**

### C.6 Pragmatic hybrids: primary tree + cross-cutting tags/edges

This is what production systems actually use.

**Schema.org.** Has a primary type tree (Thing → CreativeWork → Article, etc.) but admits multiple inheritance where genuinely needed (a `Movie` is both `CreativeWork` and `Product` in some contexts). Primary structure is a tree; non-tree relations are explicit exceptions.

**Linux kernel Kconfig.** Configuration options form a primary menu tree but `select` and `depends on` directives create cross-cutting edges that bypass the tree. The tree is for navigation; the edge-graph is for actual semantic dependency.

**MeSH.** A primary tree (the "MeSH tree numbers") plus *cross-references* and *qualifiers* that act as orthogonal axes. A term like "Diabetes Mellitus" lives in the disease tree but qualifiers like "diet therapy" or "epidemiology" are applied orthogonally.

**Most file systems with tags** (macOS Finder, modern note systems including Obsidian, Logseq, Tana). Folders are a tree; tags are a flat or shallow second axis; backlinks are arbitrary edges.

**When the hybrid wins.**
- The primary tree gives humans a stable mental map and cheap navigation.
- The tag/edge layer absorbs the cross-cutting cases that would otherwise force the tree into a DAG.
- Authoring stays close to tree-cost (one primary parent decision) plus optional tag.
- Query supports both modes: "all children of X" (tree walk) and "all things tagged Y" (index lookup).

**When the hybrid devolves.**
- If tags are unconstrained, the tag-layer becomes chaotic (the "folksonomy disease" — every author invents their own tags, and the system loses retrieval power). Defense: a *controlled* tag vocabulary with growth rules, not free text.
- If the primary tree's parent choices are not principled, the hybrid degrades into a DAG-with-extra-steps where the "primary parent" is just the alphabetically-first one.
- If tags accumulate without retire/merge discipline, mutual information between tags and tree position grows and the orthogonality discipline collapses.

**Costs.**
- Authoring: **low.** One parent + zero-to-few tags.
- Query: **low for tree walks, low for tag lookups.** Both are cheap given the right indexes.
- Maintenance: **medium.** Two structures to keep healthy — but each is simpler than a full DAG.
- Governance: **moderate.** Tree restructuring is rare and ceremonial; tag-vocabulary governance runs continuously.

### C.7 T3 Recommendations for our taxonomy

#### Concrete recommendation

**`domain` should be a primary tree with a controlled cross-cutting tag/edge layer — i.e., a pragmatic hybrid, not a pure DAG and definitely not a derived lattice.**

More precisely:

1. **Each `domain` value has one primary parent.** This makes authoring cheap, queries cheap, and gives every domain a single canonical breadcrumb.
2. **Cross-cutting domains are expressed by (a) multi-value `domain` on documents and (b) explicit edges of type `cross-cuts` between domain values when one domain genuinely overlaps another.** Biochemistry has primary parent biology and a `cross-cuts` edge to chemistry. The multi-value mechanism on documents already exists — bridge documents use `scope: world, artifact`; the same idiom extends to `domain`.
3. **Edge types are typed from day one** — don't repeat the GO `is_a` mistake. The vault already uses typed edges (`derives-from`, `refines`, `contradicts`, etc.); the same discipline must apply to domain-to-domain edges. At minimum: `parent-of`, `cross-cuts`, `supersedes-domain`.
4. **Treat any external ontology (BFO, Schema.org, OBO) as *referenceable but not authoritative*.** Do not import their hierarchy. Map to them as needed at query time. The SNOMED-UMLS-NCI alignment disasters are the warning.
5. **Reserve FCA as a diagnostic, not a structure.** When the corpus is large enough, run FCA over the (document × domain-tag) matrix to discover whether the imposed tree disagrees with the data-implied lattice. Use the disagreement as a signal for split/merge operations on `domain` values. This is governance instrumentation, not the primary representation.

(Note: the synthesis above (resolution D-A) reconciles this primary-tree recommendation with T1's DAG recommendation as a typed DAG with `subclass-of` constrained to a tree.)

#### Why

- **Corpus size.** The vault is currently ~12 documents in scope. Even at one or two orders of magnitude growth, we are far below the scale where DAG governance pays for itself. Wikidata's anti-pattern counts (millions) and the GO's RO investment are responses to *scale we will not have for years*.
- **Authoring volume.** The vault is meant to be both human- and agent-authored. Agent authors make systematic errors — if the structure permits multiple parents, agents will pick *all plausible parents* every time, exploding edge counts and producing the same instance-vs-subclass confusion Wikidata has at scale, but without Wikidata's curator population. A single-parent rule is a *cheap discipline that constrains agent error*.
- **Human mental model.** Tree breadcrumbs are universally readable. Multi-parent breadcrumbs require explanation every time. For a vault meant to be navigable by humans of different disciplines, the tree is the *interface*, even if a richer structure exists underneath.
- **Reversibility.** A tree can become a DAG by adding edges. A DAG that has accumulated millions of edges cannot easily become a tree. **Start strict, relax later.**

#### What being wrong costs

- **If we are too strict (tree, no cross-cutting allowed):** authors are forced to mis-classify cross-disciplinary documents. Symptom: the same document gets re-filed repeatedly, or appears in unrelated branches with poor retrieval. Cost is *retrieval friction*, paid by readers. Migration to a hybrid (add tag layer) is a small structural change.
- **If we are too loose (full DAG from day one):** authoring quality drops, instance-vs-class confusion creeps in, edge counts explode under agent authors, governance overhead exceeds our curator capacity. Cost is *structural decay*, paid by everyone. Migration to a tree is a hard structural change — Wikidata cannot do it; OBO Foundry would not consider it. **The tree → DAG migration is reversible-ish; the DAG → tree migration is not.**
- **If we adopt a lattice (FCA primary):** authoring becomes opaque, humans cannot directly say "biochemistry is under biology", and the system loses its dialogic character. Cost is *loss of human authorship*, which is a primary use case.

#### Asymmetry of structural-switch costs in real systems

- Linnaean → cladistic: 50+ years of partial migration, never complete; ranks still used pragmatically because the tree is easier to teach.
- ACM CCS major restructure (2012): forced retroactive re-tagging of decades of papers; partial in practice.
- DDC's struggle with computer science: still unresolved 50 years on.
- GO's introduction of typed relations (RO): retrofitted onto a corpus that already had `is_a`-overloaded edges; cleanup ongoing.

The lesson: **structural commitments are sticky. Choose a structure you can grow into, not one you must grow out of.** A primary tree with a typed cross-cutting layer can grow into a richer structure if needed. A DAG cannot easily simplify.

### C.8 T3 Cautions and Antipatterns

1. **DAG cycles.** P279 cycles in Wikidata are a documented bug type. If we permit any multi-parent edges, cycle detection must be a CI gate from the first edge.
2. **`is_a` overloading.** Do not create a generic "parent" edge. Type every edge: `parent-of`, `cross-cuts`, `part-of` if needed. The GO learned this the hard way.
3. **Instance-vs-class confusion.** Wikidata's most common anti-pattern. In our case: do not let `domain` values be both "topics" and "instances of topics" simultaneously. A `domain` value is always a *kind*, never a particular.
4. **Tag-only systems devolving into chaos.** Pure tag systems without controlled vocabularies (folksonomies) decay. The vault's `tags` field is already disciplined; the `domain` axis must be more so — controlled vocabulary with explicit growth rules (per OQ-3 / T4).
5. **Premature alignment with external ontologies.** Importing BFO or Schema.org's hierarchy into our `domain` tree creates the SNOMED-UMLS alignment trap. Reference them; do not absorb them.
6. **Lattice computational explosion.** If we ever do FCA, do it offline as diagnostic; do not put a concept-lattice computation in any hot path.
7. **Letting agents create new `domain` values without governance.** The growth rules from OQ-3 are non-optional. Agents will otherwise produce a long tail of synonyms (`finance`, `financial`, `finances`, `fin-domain`) that destroys the orthogonality of the axis.
8. **Treating multi-value `domain` as a parent-set.** Multi-value on a *document* means "this document touches multiple domains" — it is not a structural claim about the domains themselves. The structural relation between domain values is in the (forthcoming) domain-edge graph.

---

## Appendix D — Governance of Taxonomy Growth: Split / Merge / Promote / Retire Rules (T4)

> Original research output answering OQ-3 from `scope-and-domain-axes.md`. Surveys six real-world governance processes for evolving taxonomies (Wikidata, OBO Foundry, ACM CCS, JEL, MSC, schema.org) and distills the four growth rules — split, merge, promote, retire — for the vault's `domain` axis. The synthesis above expanded these to five operations (Promote-Tag and Promote-Level distinguished).

### D.1 Objective

This appendix studies the *governance process* (not the resulting structure) of six taxonomies that grew over time. From their procedures it derives the operations that govern how the vault's `domain` value vocabulary evolves. The central output is in §D.8 (Recommendations).

### D.2 Wikidata Property Proposals

- **Who proposes:** Anyone with an account. There is no membership gate.
- **Evidence required:** Use case, expected datatype, link to existing items that would carry the property, check that no equivalent property or active proposal already exists, and (often) a mapping to a Wikipedia infobox parameter.
- **Who decides:** Distributed property creators / administrators. Closure follows community consensus on the proposal page; a single property creator who has not personally been involved in the discussion may close once consensus is clear (the documented threshold is roughly 90% support or 90% opposition, with a minimum 48-hour discussion window).
- **How long:** Days to weeks for typical proposals. Contentious proposals can sit for months.
- **Rejection rate:** Not formally published. Community archives suggest a meaningful fraction (likely double-digit percent) are withdrawn, redirected to existing properties, or closed unsuccessful — uncertain, treat as qualitative.
- **Migration of existing corpus:** Properties are tied to identifiers (P-numbers); when a property is deprecated, statements using it can be marked with `deprecated rank` rather than deleted. Merging items uses a redirect mechanism — the obsolete item stays as a redirect, and bots rewrite references over a delay (≈24h for one well-known bot). This is event-sourcing-friendly: the old identifier remains queryable, just downgraded.
- **Split rule:** Triggered when a property is being used to encode two distinct relations (e.g., a generic "located in" being used both for administrative and geographic containment). Discussion-driven, not metric-driven.
- **Merge rule:** Triggered by duplicate-detection — two properties found to express the same relation. One is kept; the other is deprecated, statements migrated, and the deprecated property eventually deletable once unused.
- **Promote rule:** Wikidata has no "draft → first-class" distinction at the property level — properties either exist or don't. The lower tier is the *proposal* itself.
- **Retire rule:** Deprecation precedes deletion. A property deprecated by consensus and no longer used in any entity becomes eligible for speedy deletion. Statements can also be tagged "deprecated rank" individually, preserving history.

### D.3 OBO Foundry

- **Who proposes:** Ontology developers (typically a research group). Submission is to the OBO Foundry custodians.
- **Evidence required:** Compliance with the OBO principles — Open licensing, common formal language (typically OWL), unique PURL identifier space, documented versioning policy, named "Locus of Authority" person, commitment to collaboration, orthogonality (do not redefine terms that already exist in another OBO ontology). Increasingly, automated dashboard checks enforce many of these.
- **Who decides:** OBO Foundry custodians (an editorial board), informed by community review and the automated dashboard.
- **How long:** Months to years from candidate-listing to full membership.
- **Rejection rate:** Not formally rejected; ontologies that fail to meet principles remain "candidate" indefinitely. The custodians work *with* candidates rather than rejecting them outright.
- **Migration of existing corpus:** The orthogonality principle requires that when a term exists in another OBO ontology, downstream ontologies *reference* it rather than redefine it — so a "split" from one ontology to another is handled by import-and-reference, not duplication.
- **Split rule:** Most often happens at the *ontology* level (a sub-domain grows to deserve its own ontology) rather than the term level. Within an ontology, terms split when a single class is found to conflate two distinct kinds.
- **Merge rule:** Strictly governed by the orthogonality principle — if two ontologies define the same term, one defers and references the other; this is the merge-by-deference pattern.
- **Promote rule:** Candidate → full member when the principles checks pass and the custodians sign off.
- **Retire rule:** "Stability of Term Meaning" (principle 19) is explicit: term obsoletions must be **pre-announced**; the string `obsolete` is prepended to the label; the IRI is preserved (never reused for a different term); usages elsewhere in the ontology are removed or replaced; replacement guidance is provided. This is *exactly* the event-sourcing discipline — preserve the identifier, mark the state change, preserve history.

### D.4 ACM CCS (the 2012 restructure)

- **Who proposes:** The ACM appointed an Editor-in-Chief (Zvi Kedem) and assembled ~120 computing specialists (a third ACM Fellows). Process initiated top-down by ACM, not bottom-up by individual classifiers.
- **Evidence required:** First drafts seeded from (a) ACM Digital Library user search logs, (b) machine analysis of DL texts and author-supplied keyword frequencies, and (c) manual examination of competing computer science taxonomies. Evidence-of-use was a primary input.
- **Who decides:** Editorial committee under the EIC, with ACM staff and a vendor (Silverchair).
- **How long:** Approximately one year of active work, with two formal review stages and many iterations. Periodic incremental updates were *planned* afterwards; the next major revision pace has been slower than originally targeted.
- **Rejection rate:** Not applicable in the same sense — this was a wholesale restructure, not term-by-term proposal flow.
- **Migration of existing corpus:** Major structural change: shifted from a strict tree (1998) to a **poly-hierarchical** (DAG-like) ontology in 2012, allowing multiple parents and multiple classifications per item with relevance weights. New top-level categories (Human-centered computing, Networks, Security & privacy) were introduced. Existing publications were not auto-reclassified at scale; new submissions were classified under 2012 CCS while old ones retained 1998 codes (causing a long-tail dual-system problem).
- **Split rule:** Triggered when (a) corpus evidence shows a single category covers heterogeneous content, (b) usage logs show users searching for sub-distinctions the taxonomy doesn't make.
- **Merge rule:** Triggered when two categories show high co-occurrence in author keywords.
- **Promote rule:** Periodic revision cycle, not continuous.
- **Retire rule:** 1998 categories with no incoming traffic and no clear 2012 successor were dropped or absorbed into broader categories. This is the antipattern case for our purposes — old documents lost their classification.

### D.5 JEL Classification

- **Who proposes:** Discussion happens within the AEA's Executive Committee and among leading economists. There is no public proposal portal — this is a closed-committee process.
- **Evidence required:** Argued case for a new sub-discipline; bibliometric evidence of new sub-fields emerging in the literature.
- **Who decides:** AEA Executive Committee.
- **How long:** Major revisions are decadal in cadence; the 1990 JEL revision (led by John Pencavel) was the most recent comprehensive overhaul. Minor adjustments are continuous (the AEA documents code-by-code change dates).
- **Rejection rate:** Not public.
- **Migration of existing corpus:** EconLit indexers re-tag entries against the current scheme; legacy classifications remain searchable.
- **Split rule:** A subfield reaches sufficient publication volume that lumping it under a parent code degrades retrieval.
- **Merge rule:** A subfield's volume collapses or merges into an adjacent area.
- **Promote rule:** Topic is added as a new code under an existing parent; promotion to a new top-level letter (the JEL alphabet) is rare and committee-driven.
- **Retire rule:** Codes are not deleted; they are deprecated, with redirect notes to their successor codes documented in the change log.

### D.6 MSC (Mathematics Subject Classification)

- **Who proposes:** The mathematical community at large. Mathematical Reviews (MR) and zbMATH issue an open call for input ahead of each decadal revision.
- **Evidence required:** Suggestion submitted via the open consultation; backing arguments about why the existing scheme fails.
- **Who decides:** Joint editorial staffs of MR and zbMATH. For MSC2020 they received >350 comments from >100 contributors.
- **How long:** Decadal revision cycle. The MSC2020 process opened consultation in July 2016 and published in 2020 — roughly four years from open call to release.
- **Rejection rate:** Not published. Most community suggestions visibly inform changes; outright rejections are not separately reported.
- **Migration of existing corpus:** Each decadal scheme is versioned (`MSC2010`, `MSC2020`); existing publications retain the version they were classified under and a mapping is maintained between adjacent versions where possible.
- **Split rule:** Subfield maturity argued in community input.
- **Merge rule:** Subfields whose distinct existence no longer reflects research practice are collapsed.
- **Promote rule:** A new third-level code under an existing two-level parent is the typical promotion; new top-level codes are rare.
- **Retire rule:** Versioning preserves history — old codes live on inside their version namespace.

### D.7 schema.org Pending Namespace

- **Who proposes:** Anyone, via the Schema.org GitHub or Community Group. Proposals can come from individuals, W3C Community Groups, or industry consortia.
- **Evidence required:** Use cases that map to structured content already widely published on the Web; a proposal must be **additive** (the pending mechanism cannot redefine existing types or change supertypes).
- **Who decides:** The schema.org Steering Group, with the project webmaster shipping changes after a 10-business-day no-objection window post-release-candidate.
- **How long:** Ranges from days to "weeks, months, or longer." No fixed promotion timeline. The variation itself is the policy: terms stay in `pending` as long as they need to gather implementor signal.
- **Rejection rate:** Pending terms can also be **dropped** if they fail to gain traction. Not all pending terms graduate.
- **Migration of existing corpus:** Pending → core promotion is non-disruptive (additive only). Sites already using a pending term continue to work after promotion. Dropped pending terms are explicitly marked as such; consumers were warned by the `pending` label that this could happen.
- **Split rule:** Not a primary operation — schema.org grows by adding terms more often than splitting.
- **Merge rule:** Duplicate proposals are consolidated during pending review.
- **Promote rule:** **This is the model.** Term lives in `pending` namespace, accumulates implementor evidence, gathers community consensus, then graduates to core after Steering Group approval. The two-tier namespace (pending vs. core) is the explicit promotion mechanism.
- **Retire rule:** Terms can be marked deprecated; archived/abandoned pending terms are tracked separately. Schema.org has an open issue acknowledging that the lifecycle for graduated/abandoned pending terms needs more formal UI/process — a real gap, but the *direction* is the right one.

### D.8 T4 Recommendations for our taxonomy

The vault's `domain` axis is small (initial seed ≈ 12 values), governed by one human plus the future Bayesian agent, and event-sourced. The recommendations below borrow process structure from the systems above, scaled down to fit. (These were further refined in the synthesis above into the five-operation set.)

#### Two-tier namespace (the schema.org pattern)

Adopt a two-tier namespace for `domain` values — borrowed directly from schema.org's `pending` mechanism and reinforced by Wikidata's "proposal → property" flow:

- **`tag`** — informal, free-form topical labels in the existing `tags` field. Anyone (any agent, any session) can introduce a new tag at any time. No review.
- **`domain`** — controlled vocabulary. Adding a new value requires a promotion event.

This is the structural mechanism for the **Promote rule**.

#### Split rule (T4 formulation)

> A `domain` value SHOULD be split when **either** (a) the corpus accumulates ≥ N documents under that value AND a manual sample shows two or more clearly separable sub-topics whose retrieval queries diverge, **or** (b) the Bayesian agent (once instrumented) reports residual entropy within the value above a threshold — i.e., the value internally carries information that no other label captures.

- Evidence required: a list of ≥ 5 documents under the value, partitioned into the proposed sub-values, with the partition rationale stated.
- Default for N: **15 documents**. Rationale: below ~15 the corpus is too small to detect heterogeneity reliably; this matches the small-project setting and is well below ACM CCS's industrial-scale thresholds. (Resolution D-B above harmonizes this with T1's ≥8 threshold.)
- Migration: every existing document under the old value is reclassified to one (or more, multi-value) of the new sub-values. The old value is then `retired` (not deleted — see Retire rule).
- Borrowed from: ACM CCS (corpus-evidence triggered split), MSC (community-input triggered split).

#### Merge rule (T4 formulation)

> Two `domain` values SHOULD be merged when their joint retrieval queries return overlapping document sets above a threshold (≥ 70% Jaccard overlap on a sustained basis), OR when human review during a periodic ontology audit identifies them as encoding the same topic under different names.

- Evidence required: the overlap measurement (or the audit finding), plus a proposed canonical name for the merged value.
- Migration: every document under the deprecated value is re-tagged with the canonical value. The deprecated value enters the `retired` state with a `merged-into → <canonical>` edge.
- Borrowed from: Wikidata (duplicate-property merge), OBO Foundry orthogonality (merge-by-deference).

#### Promote rule (T4 formulation)

> A `tag` value SHOULD be promoted to a `domain` value when **all three** conditions hold:
>
> 1. **Volume** — the tag has been applied to ≥ 5 documents.
> 2. **Stability** — the tag has been in use for ≥ 30 days without being dropped or renamed.
> 3. **Necessity** — removing the tag would lose information that no current `domain` value captures (the orthogonality test, applied at the value level rather than the label level).

- Evidence required: a short proposal artifact (a node in the vault, `node_type: discovery`, `nature: procedural`) listing the tag, the documents using it, the proposed `domain` value name, and the orthogonality rationale.
- Decider: human + Bayesian agent. The human writes the proposal; the agent (once landed) checks corpus-level orthogonality against existing `domain` values; the human approves the promotion.
- Migration: every document carrying the tag has its `domain` field updated; the tag is retired from the tag namespace.
- Borrowed from: schema.org `pending` → core (the central pattern), Wikidata property proposal flow (volume + stability + duplicate-check).

#### Retire rule (T4 formulation)

> A `domain` value is never deleted. Retirement marks the value as `status: retired` in the `domain` value catalog, recording (a) the reason (`split`, `merged`, `obsolete`, `superseded`), (b) the date, (c) the successor value(s) if any, and (d) the migration record.

- Documents under a retired value are migrated to the successor value(s) at retirement time. The retirement event is recorded in `ontology_events` (event-sourcing constraint preserved).
- A retired `domain` value remains queryable historically — searches scoped to a past date return the original classification. This matches MSC's versioned-namespace approach.
- The label `obsolete` is prepended to the value's display name (the OBO Foundry pattern), making accidental re-use visible.
- Pre-announcement: a retirement should be announced ≥ 7 days before it takes effect, allowing the human (or external readers) to object. This is OBO Foundry's "pre-announce term obsoletions" principle, time-scaled down.
- The identifier of the value (its slug) is **never reused** for a new meaning. This is the OBO Foundry IRI-stability principle.

#### Governance process — who proposes, decides, migrates

Acknowledging that the project is one human plus agents, the *structure* is borrowed from larger systems even though the participant count is small:

| Role | Filled by | Borrowed from |
|------|-----------|---------------|
| **Proposer** | Any agent or the human; surfaces a proposal as a `node_type: discovery` document under `vault/discovery/ontology-proposals/`. | Wikidata (anyone proposes). |
| **Reviewer** | Bayesian agent (once landed) checks orthogonality and corpus impact; before that, the human reviews manually. | OBO Foundry custodians + automated dashboard. |
| **Decider** | The human, recorded as a structural event in `ontology_events`. | All systems above — the human is our Executive Committee + Steering Group. |
| **Migrator** | An ontology-migration agent (or a manual pass) updates all affected documents and writes the migration record. | OBO Foundry's "all usages must be replaced" rule. |

**Minimum proposal contents** (mandatory frontmatter for any growth proposal):

- Operation: `split` / `merge` / `promote` / `retire`
- Affected value(s): old slug(s)
- Proposed new value(s): new slug(s) and display names
- Evidence: list of documents, overlap measurements, or other artifact-grounded justification
- Migration plan: what changes in each affected document
- Rollback: how to undo if the operation proves wrong (preserved by event-sourcing — replay events up to but excluding the operation)

**Minimum durations** (borrowed from Wikidata/schema.org):

- Promote: discovery proposal must exist for ≥ 48 hours before the human can ratify it (sleep-on-it discipline).
- Retire: ≥ 7 days pre-announcement window.
- Split / Merge: same as Promote (≥ 48 hours).

These durations are short because the project is small; the *shape* of "proposal → review window → decision → migration" is what matters.

### D.9 T4 Cautions and Antipatterns

#### Too lax — the Wikipedia overcategorization failure mode

Wikipedia's category system is the canonical example of growth-rules-too-lax. Categories proliferate freely, intersection categories ("Left-handed Belgian violinists") get created, and the result is that any given article carries dozens of categories with no consistent semantics. The retrieval cost: a user following a category link has no idea whether it will be useful without inspecting the linked document. The Wikipedia community now explicitly documents this as `WP:OVERCAT` antipattern.

**For us:** This is the failure mode if the **Promote rule** is set too liberally. The volume + stability + necessity gate exists specifically to keep the `domain` namespace small even as `tags` grow freely. Tags are the relief valve — they absorb arbitrary topical labeling without polluting the controlled vocabulary.

#### Too strict — DDC computer-science retrofit

Dewey Decimal Classification was designed in 1876, before computer science existed. When CS emerged it was retrofitted into call number 004–006, sandwiched between general works (000s) and library science. The category structure inherited the prejudices of its era: "data processing" got a sub-tree, but "software engineering" had to be wedged in awkwardly. Even after multiple revisions, computer science classifications under DDC are widely regarded as poor — the *governance* preserved structure too aggressively, refusing to admit that the original top-level partition was inadequate for the emerging domain.

**For us:** This is the failure mode if the **Split rule** is set too conservatively. If we refuse to introduce a new top-level branch when the corpus genuinely needs one, we will end up wedging unrelated topics into ill-fitting parents. The Split rule's evidence threshold (≥ 15 docs + clear partition) should not be confused with a moratorium — when evidence is in, the split happens.

#### The migration trap — ACM CCS 1998 → 2012 dual-system

The ACM CCS 2012 restructure was the right move, but it left a long tail of pre-2012 publications classified under 1998 codes. Searches that span both eras must reason about the mapping. The lesson: **migration must be part of the operation, not deferred**. Our Retire rule's mandatory migration plan is the response — the operation is incomplete until existing documents are reclassified.

#### The orthogonality-of-values trap

Orthogonality between *labels* (the existing constitutional principle) is a different property from orthogonality between *values within a label*. Two `domain` values can be conceptually overlapping (`payments` vs. `billing`) without violating the label-level orthogonality between `domain` and `node_type`. The Merge rule's overlap-measurement criterion exists specifically to catch this — value-level overlap is a Merge trigger, distinct from label-level orthogonality.

#### Closed-committee opacity (the JEL trap)

JEL revisions happen inside the AEA Executive Committee with little public visibility. This is fine for them (the AEA *is* economics' authority) but would be a failure mode for us — a single human approving changes silently would lose the proposer/reviewer/decider separation. The mitigation: every growth operation **must** leave a trail in `ontology_events` and a discovery-document proposal, even when the human is wearing all three hats. The trail is the audit surface.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [../scope-and-domain-axes.md](../scope-and-domain-axes.md) | `derives-from` | This consolidated evidence survey resolves OQ-1 through OQ-4 of the parent discovery and defers OQ-5 and OQ-6. Combines the four T-track research outputs (T1 empirical history, T2 upper ontologies, T3 tree-vs-DAG-vs-lattice, T4 governance) and their original SYNTHESIS into a single document. |
| [../../../ontology-conventions.md](../../../ontology-conventions.md) | `refines` | The structural commitment (§4), growth rule set (§3), and scope definitions from §8 are the direct inputs to the constitution amendments. |
