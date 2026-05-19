---
tags: [vault, ontology, edges, catalog, domainspec-vault-edges]
node_type: discovery
is_session: false
layer: ontology
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-05-17
---

# Discovery — DomainSpec Vault Edge Catalog

> Consolidates the dispatch outputs (`research.md`, `findings.md`, the `derives-from` overload investigation, and the dispatch strategy itself) into a single discovery document: which edges the vault keeps, what `derives-from` means in practice, the path-prefix carve-out that lets vault nodes point into `.claude/skills/**` and `.claude/agents/**` without bidirectional obligations, and what is intentionally deferred. The discovery is the load-bearing record; downstream migration is an implementation-plan, not part of this file.

---

## Objective

Adopt a 21-edge minimum-viable catalog as the canonical vault edge vocabulary, document its bidirectionality rule with two carve-outs (skill/agent targets are forward-only by target; session sources are forward-only by source), and explicitly record the unified `derives-from` decision — kept as a single conflated edge for now, with the dispatch-triad case logged as tracked debt rather than a bug.

---

## 1. Business Context

### Why now

`ontology-conventions.md` v2.0.0 already ships Appendix C with 21 edges, but the rationale for *that specific set* — what was folded, what was rejected, what was deferred — lives across four research artifacts (research.md, findings.md, the `derives-from` overload investigation, and the dispatch strategy) with no single discovery to anchor them. Future amendments to the catalog need a discovery to derive from per the chain (constitution defers to discovery, D-9 of `epistemic-chain.md`). Without this file, every edge question reopens the dispatch.

### What's broken

- `vault/ontology-conventions.md` Appendix C (lines 553–611) lists the canonical 21 edges but cites no discovery — it stands on a dispatch's research/findings, not a discovery, which inverts the chain.
- `vault/constitution/domainspec-subagents-strategy-constitution.md:380` declares `derives-from` toward its premise file where the chain-mandated edge is `codified-as`/`codifies` (see `derives-from-overload-investigation.md` Q2, semantic 4 — "codification leak"). The catalog rule is being routed around by authors who find `derives-from` grammatically more natural.
- `vault/discovery/domainspec-vault-edges/research/domainspec-subagents-strategy.md:130-131` still uses the deprecated `produces` edge for the dispatch → output relationship — non-conformant under the current catalog but semantically clearer than the canonical `derives` inverse.
- `vault/premise/robot-talks-premises.md:202` mislabels a constitution under `operationalized-by` when it should be `codified-as` (flagged by E1 in `findings.md`; still in-file at dispatch time).
- The `derives-from` edge collapses three distinct semantics (intellectual lineage, runtime/conceptual dependency, production/provenance) plus silently absorbs a fourth (codification when grammar favors it). The dispatch-triad case (`subagents-findings` declaring two semantically different `derives-from` edges to the same `domainspec-subagents-strategy` — one lineage, one provenance) is the canary the overload investigation surfaces.

### What stays the same

- The 21-edge catalog itself — this discovery adopts what `ontology-conventions.md` Appendix C already lists. No edges are added, removed, or renamed in this discovery.
- `derives-from` stays unified. No split into `derives-from` / `produces` / `depends-on`. The conflation is recorded as tracked debt (D-5).
- The bidirectionality rule in §8 stays the discipline; the two carve-outs (skills/agents forward-only-by-target; sessions forward-only-by-source) stay in force.
- The domain-axis edge family (`subclass-of` as a tree, plus growth-operation edges like `cross-cuts`, `historically-derived-from`, `split-into`, `merged-into` mentioned in `scope-and-domain-axes.md`) is **out of scope** for this discovery. Per `findings.md` recommendation, those belong in a separate domain-axis-edges catalog.
- Backlog files (`node_type: backlog`) and skill/agent files (`.claude/skills/**`, `.claude/agents/**`) remain non-vault-graph nodes. No edges *originating from* them; outgoing edges *into* skill/agent files are forward-only.

---

## 2. Core Concepts

### The 21-edge catalog

Three categories, all enumerated in `ontology-conventions.md` Appendix C:

- **Universal (4)** — `derives-from`, `cites`, `contradicts`, `supersedes`. Any source `node_type` to any target.
- **Document-specific (9)** — `codified-as`, `operationalized-by`, `implements`, `validates`, `refines`, `governed-by`, `subclass-of`, `part-of`, `alternative-to`. Each has fixed source/target `node_type` constraints.
- **Session-specific (8)** — `continues-from`, `creates`, `modifies`, `revisits`, `refutes`, `opens-question`, `closes-question`, `consumes`. Source must have `is_session: true`.

The catalog is the *minimum viable* set the dispatch could justify with both vault precedent (E1: 18 of 21 in active use) and external taxonomy precedent (E2: RDF/OWL, Schema.org, Wikidata, BFO/DOLCE). The 35-edge sprawl that existed in vault Markdown before consolidation was reduced to 21 by deduplicating inverses, folding overlapping forms (`instantiates`/`exemplifies` → `instance-of`, then both deferred), and excluding domain-axis growth edges.

### Bidirectionality with two carve-outs

The default is symmetric authoring: the source writes the forward edge in its `## Connections` block; the target writes the inverse in its own. Both endpoints must declare. Inverses are name-fixed by the catalog — authors do not coin them. `contradicts` is the only symmetric edge.

Two formal carve-outs from `ontology-conventions.md` §8:

1. **Forward-only by target** (skills/agents path-prefix carve-out) — when the target is a file under `.claude/skills/**` or `.claude/agents/**`, the vault source writes the forward edge but the target writes nothing. Skill and agent files are operational artifacts (runtime prompts and behaviors), not vault graph nodes — they carry no `node_type`, no `## Connections`, no `veracidade`. The auditor MUST NOT flag these as asymmetric. This carve-out is keyed on the **target path**.
2. **Forward-only by source** (session carve-out) — when the source has `is_session: true`, the session writes the forward edge but the target writes nothing. Sessions are processes; forcing every session edge to land an inverse on a long-lived target pollutes the target with transient churn and inverts ownership. This carve-out is keyed on **source `is_session`**.

The two carve-outs compose: a session edge into a skill file is forward-only on both grounds; an audit script must skip bidirectionality checks if either condition is met.

### `derives-from` is unified — and the conflation is recorded

`derives-from` collapses, per the overload investigation:

- **Semantic 1 — Intellectual lineage** (the canonical use; the "chain backbone": discovery from research, premise from discovery, etc.). ~80% of the 84 vault uses.
- **Semantic 2 — Dependency** (former `depends-on`, 3 vault uses). Folded with stated rationale "rarely needed in practice."
- **Semantic 3 — Production/provenance** (former `produces`, 6 vault uses). Folded "per bidirectionality rule, canonical direction is `derives-from`." This is the rationale the overload investigation calls out as conflating two separate questions: *which direction to write* and *whether two semantics should share a name*.
- **Semantic 4 — Codification (silent leak)** — authors using `derives-from` where `codified-as`/`codifies` is the chain-mandated edge, because `derives-from` reads more naturally on the constitution side. Not named in the deprecation table but visible at `domainspec-subagents-strategy-constitution.md:380`.

The decision (D-5) is to keep the unified edge for now. The canary is the dispatch triad: `subagents-findings` declares two semantically distinct `derives-from` edges to the same `domainspec-subagents-strategy` — one lineage (rests on the strategy's claims), one provenance (was produced by the strategy's dispatch). The vault's own dispatch-findings file already routed around this by using `references` instead of `derives-from` for the provenance link — i.e., the catalog rule has been visibly broken once in the very dispatch that produced the catalog. This is logged as tracked debt, not a bug.

### What's *not* a vault graph node

- `.claude/skills/**` and `.claude/agents/**` — operational artifacts; OQ-1 from prior sessions is closed (per project memory). Do not add `## Connections` blocks to these files. Do not propose inverse edges back from them.
- `node_type: backlog` files — carry frontmatter only; no `## Connections`, no inbound edges in practice (user waiver recorded in project memory). The catalog technically permits backlog as a source/target, but current discipline is to not wire backlog files into the graph.

---

## 3. Detailed Specifications

### 3.1 Edges that stay (the 21)

Source of truth: `ontology-conventions.md` Appendix C (lines 553–611). This discovery adopts that table verbatim. The table is reproduced here only as a navigation aid; substantive changes happen at the constitution, not here.

| Category | Edges |
|----------|-------|
| Universal | `derives-from` / `derives`, `cites` / `cited-by`, `contradicts` (symmetric), `supersedes` / `superseded-by` |
| Document-specific | `codified-as` / `codifies`, `operationalized-by` / `operationalizes`, `implements` / `implemented-by`, `validates` / `validated-by`, `refines` / `refined-by`, `governed-by` / `governs`, `subclass-of` / `superclass-of`, `part-of` / `has-part`, `alternative-to` / `has-alternative` |
| Session-specific | `continues-from` / `continued-by`, `creates` / `created-by`, `modifies` / `modified-by`, `revisits` / `revisited-by`, `refutes` / `refuted-by`, `opens-question` / `question-opened-by`, `closes-question` / `question-closed-by`, `consumes` / `consumed-by` |

### 3.2 Edges that are deprecated / folded

Per `ontology-conventions.md` Appendix C deprecation table:

| Old | Folds into | Notes |
|-----|-----------|-------|
| `resolves` | `closes-question` (session) or `supersedes` (document) | Was structural-vs-session-ambiguous; split-by-context. |
| `references`, `contextualizes` | `cites` | Generic-mention collapse; prose carries nuance. |
| `depends-on` | `derives-from` | Runtime distinction was rarely needed in practice. |
| `produces` / `produced-by` | `derives-from` / `derives` | Bidirectionality dedup; see D-5 tracked debt. |
| `provenance-for` | `creates` (sessions) | Session-creation edge subsumes it. |
| `questions` | `opens-question` (sessions) | Session-specific framing explicit. |
| `updates`, `deprecates` | (none — use `version:` / `status:`) | State, not relationship. |
| `exemplifies`, `instance-of`, `instantiates` | (deferred) | No active vault use case justifying admission. |
| `grounds`, `grounded-by` | (none — name-fixed inverses in catalog) | SQL-layer inverses replaced by explicit Markdown. |

### 3.3 Decisions taken

**D-1 — Adopt the 21-edge catalog as canonical.**
- Decision: the 21 edges listed in `ontology-conventions.md` Appendix C are the vault's authoritative edge vocabulary. No new edges may be coined inline; new edges require a discovery proposal.
- Rationale: 18 of 21 already in vault use per E1; remaining 3 (`part-of`, plus the two now-deferred `instance-of`/`subclass-of` boundary cases) have either taxonomy precedent (E2) or chain-mandated status (E3).
- Status: active (already encoded in `ontology-conventions.md` v2.0.0).

**D-2 — Bidirectionality between vault nodes; two carve-outs.**
- Decision: every edge between vault nodes is declared on both endpoints with name-fixed inverses. Two exceptions: (a) edges into `.claude/skills/**` and `.claude/agents/**` are forward-only by target; (b) edges originating from `is_session: true` documents are forward-only by source.
- Rationale: skill/agent files are operational, not epistemic — adding `## Connections` blocks to them would conflate governance artifacts with knowledge artifacts. Session edges represent transient process state — forcing inverses pollutes long-lived targets with churn (per project memory; OQ-1 closed).
- Status: active (encoded in `ontology-conventions.md` §8 and the carve-out blocks in `.claude/skills/custom/edges.md`).

**D-3 — Path-prefix carve-out, not frontmatter-driven.**
- Decision: the skill/agent carve-out is keyed on **target path prefix** (`.claude/skills/**`, `.claude/agents/**`), not on a frontmatter field on the source or target.
- Rationale: the targets carry no frontmatter; the discipline can only be expressed in the source's link or the auditor's path check. The user has rejected adding a Scope column to `## Connections` (per project memory). Path-prefix is the chosen mechanism.
- Status: active.

**D-4 — Backlog files carry frontmatter only.**
- Decision: `node_type: backlog` files do not write `## Connections` blocks and are not the target of inbound edges. The catalog technically permits backlog as a node, but current discipline waives graph participation.
- Rationale: user waiver recorded in project memory; backlog edits are too frequent to maintain bidirectional partners cleanly.
- Status: active (discipline, not catalog-enforced).

**D-5 — Keep `derives-from` unified; record the conflation as tracked debt.**
- Decision: do not split `derives-from` into separate lineage / dependency / provenance edges. Accept that the same name covers four semantics (the three explicitly folded plus the codification leak).
- Rationale: 80%+ of uses are canonical lineage; split cost (84 reclassifications across the vault) exceeds current observable harm; the vault's measurement layer for edge precision does not yet exist. See `derives-from-overload-investigation.md` Q6.
- Trigger conditions for revisit: (a) dispatch-triad pattern becomes dominant rather than special-case; (b) a query agent built against the vault produces wrong answers traceable to the conflation; (c) an orthogonality measurement layer ships and shows `derives-from` carrying multiple modes of mutual information with `node_type`.
- Status: active with tracked debt — recording this here is the discipline; recording does not require fixing.

**D-6 — Author the forward edge with the stronger semantic claim.**
- Decision: when both endpoints could plausibly host the "forward" edge, the author on the side with the stronger semantic claim writes the forward (e.g., child writes `derives-from` parent, not parent writes `derives` child). The other endpoint writes the catalog-fixed inverse.
- Rationale: resolves the ambiguity surfaced in `findings.md` OQ-E3-4. Aligns with how the chain-backbone reads naturally — children acknowledge parents.
- Status: active (consistent with current authoring practice).

**D-7 — Domain-axis edges live in a separate catalog.**
- Decision: edges that connect `domain` values (vocabulary terms / growth operations: `cross-cuts`, `historically-derived-from`, `split-into`, `merged-into`) are out of scope for this discovery and belong in a future `domain-axis-edges` discovery. `subclass-of` is the one boundary case included in the 21-catalog because it also connects `conceptual`/`premise` documents.
- Rationale: primary catalog connects `node_type` instances (documents); domain-axis catalog would connect domain vocabulary terms. Different layers; conflating them inflates the primary catalog without benefit.
- Status: active scope decision; the domain-axis discovery is OQ-2 below.

### 3.4 Alternatives considered

**A-1 — Split `derives-from` into `derives-from` / `produces` / `depends-on` (rejected by D-5).**
- Considered in `findings.md` (edge #9 `produces` as separate edge) and revisited at length in `derives-from-overload-investigation.md`.
- Rejected because: (a) 84-vs-6-vs-3 frequency means cost falls almost entirely on one rare pattern (the dispatch triad); (b) migration cost of reclassifying 84 existing declarations is non-trivial; (c) the orthogonality measurement layer that would justify the split does not yet exist.
- Alternative remains live as a tripwire under D-5's trigger conditions.

**A-2 — Admit `instance-of` and `part-of` as first-class edges (partially adopted).**
- `findings.md` proposed both as vault-novel-but-taxonomy-precedented (E2: RDF `rdf:type`, BFO/DOLCE parthood, Wikidata P31/P361).
- `part-of` was adopted (Appendix C document-specific row). `instance-of` was deferred (Appendix C deprecation table: "deferred until first vault use").
- Rationale for split treatment: `part-of` has 1 vault use and a clear semantic; `instance-of` has 0 vault uses and overlaps semantically with `subclass-of` for the conceptual hierarchy already in use.

**A-3 — Inverse-via-SQL-computation rather than bidirectional Markdown authoring (rejected).**
- Considered: the SQL/visualization layer could materialize inverse edges from the forward declaration alone.
- Rejected because: bidirectional Markdown makes both endpoints discoverable by reading either file; the audit script can flag asymmetries; SQL-layer inference requires every reader to run a query to see the full graph. Markdown bidirectionality is the cheaper discoverability mechanism for a corpus this size.

**A-4 — Scope column on `## Connections` (rejected by user).**
- Considered: add a `Scope` column to `## Connections` to disambiguate which carve-out (if any) applies to each edge.
- Rejected per project memory (the user has explicitly rejected this proposal); the path-prefix carve-out (D-3) is the chosen mechanism.

**A-5 — Treat skill/agent files as vault graph nodes with full bidirectional edges (rejected).**
- Considered: extend frontmatter to skill/agent files so they participate in the graph.
- Rejected because: conflates operational and epistemic artifacts; skill files have no `node_type`/`veracidade`/`convicção` and don't sit on the epistemic chain. OQ-1 closed per project memory; do not reopen.

**A-6 — Forward-only by source for `cites` (rejected — only sessions get this carve-out).**
- Considered (during cross-boundary-rule discussions): make `cites` forward-only by source the way session edges are, since `cites` is high-volume.
- Rejected: `cites` between vault documents carries epistemic weight (removing the cite weakens the argument); bidirectional declaration is needed so the cited document advertises that it is load-bearing for the citing one. Volume is the wrong axis for the carve-out; transience-of-source is.

---

## 4. Open Questions

**OQ-1 — Edge for "consumes without lineage" between non-session documents.**
- Recommendation: leave the gap. Today the catalog only permits `consumes` from sessions. A future case (a discovery used three other discoveries as inputs without deriving from them) would have to use `cites` (which over-claims load-bearing-ness) or `derives-from` (which over-claims lineage). If the gap bites, propose a new edge through a follow-on discovery; do not coin one inline.

**OQ-2 — Domain-axis edges catalog.**
- Recommendation: open a separate discovery (`domain-axis-edges`) covering `cross-cuts`, `historically-derived-from`, `split-into`, `merged-into`, and any growth-operation edges per `scope-and-domain-axes.md` D-11. Out of scope here per D-7.

**OQ-3 — Migration pass for existing non-conformant edges.**
- Recommendation: open an implementation-plan (downstream of this discovery) to sweep the known non-conformant uses: `produces` at `domainspec-subagents-strategy.md:130-131`, `derives-from` at `domainspec-subagents-strategy-constitution.md:380` where `codified-as` is correct, mislabel at `robot-talks-premises.md:202`. Not blocking on this discovery shipping; governance debt, not bug.

**OQ-4 — `equivalent-to` / `disjoint-with` admission.**
- From `findings.md` OQ-E3-2 and OQ-E3-3. RDF/OWL has these; vault has no current use. Recommendation: defer. Reopen if the domain-axis Merge growth operation (`scope-and-domain-axes.md` D-11) needs to express "two domain values became one" with a dedicated edge.

**OQ-5 — Author-side error rate for the unified `derives-from`.**
- Recommendation: instrument the audit script (when one exists) to count `derives-from` declarations between strategy/research/findings triads and between premise/constitution pairs. If the count drifts away from chain-mandated edges (e.g., `codified-as` underused, `derives-from` overused in places where `codified-as` is mandated), that is the measurement that would trigger D-5's revisit condition (c).

**OQ-6 — Backlog graph participation.**
- Recommendation: keep the current waiver (D-4). If backlog items grow load-bearing enough that someone wants to query "which backlog items were derived from which discovery", revisit by amending this discovery.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/domainspec-vault-edges/research/findings.md` | `derives-from` | The proposed 20-edge minimum-viable catalog and its omitted-edges/open-questions blocks are the load-bearing input that this discovery consolidates and ratifies (with one upward adjustment to 21 to match Appendix C as shipped). |
| `vault/discovery/domainspec-vault-edges/research/research.md` | `derives-from` | The E1 vault edge inventory (counts: `derives-from` 84, `operationalized-by` 39, `subclass-of` 25, `codified-as` 20, `produces` 6, `depends-on` 3), E2 taxonomy survey, and E3 compatibility matrix are the empirical base for D-1, D-5, and D-7. |
| `vault/discovery/domainspec-vault-edges/research/derives-from-overload-investigation.md` | `derives-from` | The four-semantics analysis (lineage / dependency / production / silent-codification-leak), the dispatch-triad canary, and the Q6 net assessment are the basis for D-5 and its trigger conditions. |
| `vault/discovery/domainspec-vault-edges/research/domainspec-subagents-strategy.md` | `derives-from` | The dispatch-strategy contract (mode, capability tiers, P-SS-11 verification, recursion budget) and its declared deviation (Task tool unavailable, strategist-as-stand-in for E1/E2/E3) document the provenance of the research artifacts this discovery rests on. |
| `vault/ontology-conventions.md` | `cites` | Appendix C lines 553–611 hold the canonical 21-edge table this discovery adopts; §8 holds the bidirectionality rule and the two carve-outs codified in D-2/D-3. |
| `vault/discovery/domainspec-vault-foundations/epistemic-chain.md` | `cites` | D-1 through D-9 declare chain-mandated edges (`derives-from`, `codified-as`, `operationalized-by`, `validates`, `supersedes`) that constrain which edges in the 21-catalog are elective vs structural. |
| `vault/discovery/domainspec-vault-foundations/scope-and-domain-axes.md` | `cites` | D-10/D-11 (tree-constrained `subclass-of`, domain-axis growth operations) are the rationale for D-7's deferral of domain-axis edges to a separate catalog. |

---

## Provenance

This discovery was promoted from the `domainspec-vault-edges` dispatch via the `/domainspec-subagents-strategy` skill step 7 lifecycle gate (R6b — explicit user confirmation, lifecycle step 7). Source dispatch artifact set:

- Strategy: `vault/discovery/domainspec-vault-edges/research/domainspec-subagents-strategy.md`
- Research: `vault/discovery/domainspec-vault-edges/research/research.md`
- Findings: `vault/discovery/domainspec-vault-edges/research/findings.md`
- Adjunct investigation: `vault/discovery/domainspec-vault-edges/research/derives-from-overload-investigation.md`
