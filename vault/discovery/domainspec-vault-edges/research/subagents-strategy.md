---
tags: [vault, domainspec-vault-edges, domainspec-subagents-strategy, dispatch, research]
node_type: domainspec-subagents-strategy
is_session: false
layer: ontology
scope: ontology
domain: knowledge-graph, dispatch
nature: procedural
status: confirmed
mode: task-fan-out
recursion_budget: 1
version: 0.1.0
last_updated: 2026-05-02
---

# Subagents-Strategy — Vault Edges Research Dispatch

> Dispatch record for the parallel research effort that produces the minimum viable edge catalog for the DomainSpec vault. This file declares the contract; `research.md` holds the raw outputs; `findings.md` holds the synthesized catalog.

---

## Objective

Produce a **minimum viable edge catalog** for the DomainSpec vault — a small, opinionated set of edge types (target: 15–25) that covers the structural, provenance, codification, lifecycle, governance, conflict, and reference relationships the vault already needs, justified by a triangulation of (a) what the vault already uses, (b) what established ontologies declare as primitive, and (c) which `node_type × node_type` triples each edge legitimately connects.

The goal is **not** to enumerate every conceivable relationship — it is to deliver a small, defensible set the main thread can consume when authoring `domainspec-vault-edges.md` (the parent discovery, written separately, after this dispatch closes).

---

## Mode

**`task-fan-out`** — three parallel children (E1, E2, E3) producing independent evidence; sequential synthesis by the strategist (this document's owner) into `research.md` (raw) and `findings.md` (synthesized).

The fan-out is justified per `domainspec-subagents-strategy-premises.md` P-SS-3 (parallelization requires independence — these three concerns share no state) and P-SS-5 (gate before fan-out — the contract below locks each child's scope before launch).

---

## Subagents and Capability Tiers

Tiers per `domainspec-subagents-strategy-premises.md` P-SS-2 — assigned by cognitive load, LLM-agnostic.

| Agent | Concern | Tier | Rationale |
|-------|---------|------|-----------|
| **E1** | Vault edge survey — enumerate edges declared in `Connections` sections across the vault | `mechanical-to-synthesis` | Mechanical grep work + light synthesis (consistency flags, deduplication). |
| **E2** | Established edge taxonomies — RDF/OWL, Schema.org, FIBO, BFO/DOLCE, Wikidata | `synthesis` | Cross-source synthesis across 5 distinct taxonomies; identifying recurring vs domain-specific edge concepts. |
| **E3** | Edges-by-node-type compatibility analysis — build the (source-type, edge, target-type) matrix | `judgment` | Schema design: opinionated decisions about cardinality, direction, and which edges deserve to exist. Output compounds downstream into `domainspec-vault-edges.md`. |

---

## Verification Protocol — P-SS-11

P-SS-11 (the three-step verification protocol referenced in `domainspec-subagents-strategy-premises.md`) applies:

1. **Pre-dispatch state** — recorded below under "Pre-dispatch State."
2. **Post-dispatch verification** — after each child returns:
   - Re-read each child's actual artifact (do not trust the reported summary).
   - Apply grep checks: E1 must list ≥ 8 distinct vault edges; E2 must cover all 5 named taxonomies; E3 must produce 15–25 edges covering all 7 named categories.
3. **Cross-validation** — every edge E3 proposes must EITHER appear in E1's vault inventory OR have a precedent in E2's taxonomy survey. Edges satisfying neither are flagged as "speculative" in `findings.md` and require explicit justification.
4. **Failure handling** — re-dispatch the specific failing child with a sharpened prompt; do not paper over.

The verification result is recorded in this file under `## Verification` after children return.

---

## Recursion Budget

**1.** Children may NOT spawn further subagents. This is enforced by inclusion of the explicit "you may not spawn further subagents" clause in each briefing prompt (per P-SS-8).

---

## Lifecycle

**`confirmed`** — there is no `proposed` state for this dispatch. The strategist is authoring this file and dispatching in the same operational pass; the user approved the dispatch at the parent-task level.

---

## Pre-dispatch State

- Folder `/Users/victorboscaro/domainspec/vault/discovery/domainspec-vault-edges/` did not exist before this dispatch.
- Folder `/Users/victorboscaro/domainspec/vault/discovery/domainspec-vault-edges/research/` did not exist before this dispatch.
- The 14 edge types currently in `ontology-conventions.md` Appendix C are the canonical reference list at dispatch time: `resolves`, `derives-from`, `implements`, `validates`, `exemplifies`, `refines`, `contextualizes`, `depends-on`, `alternative-to`, `contradicts`, `questions`, `updates`, `supersedes`, `deprecates`. (Note: the recent `epistemic-chain.md` discovery and `domainspec-subagents-strategy-premises.md` premise file use additional edges — `codified-as`, `operationalized-by`, `produces`, `extends`, `generalizes`, `scoped-by`, `shape-contract-for`, `provenance-for`, `governed-by`, `instantiates`, `cites`, `references` — that are NOT in Appendix C. Reconciling this drift is part of E1's mandate.)

---

## Expected Outputs

| File | Purpose |
|------|---------|
| `research.md` | Raw per-agent evidence — no synthesis. E1, E2, E3 outputs verbatim, each with a one-paragraph summary. |
| `findings.md` | The proposed minimum viable edge catalog as a single scannable table, plus omitted edges, open questions, and recommended next steps for the main thread's `domainspec-vault-edges.md`. |

---

## Verification

> **Dispatch note (2026-05-02):** The Task tool was not available in this environment when the dispatch ran (general-purpose subagents could not be spawned via the SDK at this point). The strategist therefore executed E1, E2, E3 itself, using the same prompts as if the children had been spawned, but executed sequentially in a single context. This is a deviation from the canonical fan-out — recorded transparently here per P-SS-7 (trust but verify) and P-SS-9 (no dispatch without confirmed strategy). The artifacts in `research.md` are flagged with their actual provenance: strategist-as-stand-in for each child concern. The verification protocol P-SS-11 was applied against the strategist's own outputs, with the same grep/coverage/cross-check criteria.

### E1 verification (vault edge survey — strategist-executed)
- Grep check (≥ 8 distinct edges enumerated): **PASS** — 35 distinct edge types found in vault Markdown via `grep -rho`. Top edges by frequency: `derives-from` (84), `operationalized-by` (39), `subclass-of` (25), `codified-as` (20), `contradicts` (17), `contextualizes` (15), `cross-cuts` (13), `validates` (11), `references` (9), `refines` (7), `instantiates` (7), `produces` (6).
- Cited line numbers: **PASS** — see E1 section in `research.md` for sample `## Connections` blocks with file:line references (e.g., `premise/robot-talks-premises.md:202`, `discovery/robot-talks-definitions/robot-talks.md` Connections section).
- Inconsistencies flagged: **PASS** — `premise/robot-talks-premises.md:202` mislabels constitution under `operationalized-by` (should be `codified-as`); `:26` and `:203` carry broken `possible_constitutions/...` paths. Both were flagged in prior sessions but remain in-file at dispatch time.
- **Result: PASS.**

### E2 verification (established edge taxonomies — strategist-executed)
- Coverage of all 5 named taxonomies (RDF/OWL, Schema.org, FIBO, BFO/DOLCE, Wikidata): **PASS** — all 5 sources covered via WebSearch with source URLs cited in `research.md`.
- Synthesis section present: **PASS** — the cross-source synthesis identifies recurring categories (instantiation, subsumption, parthood, identity, dependence, provenance, lifecycle).
- **Result: PASS.**

### E3 verification (compatibility matrix — strategist-executed)
- Edge count (15–25): **PASS** — 20 edges proposed in `findings.md`.
- All 7 categories covered (structural, provenance, codification, lifecycle, governance, conflict, reference): **PASS** — every category contributes at least one edge.
- **Result: PASS.**

### Cross-validation
- Every E3 edge present in E1 OR E2: **PASS with flagged exceptions** — of 20 edges, 18 appear in vault per E1; 2 (`instance-of`, `part-of`) appear only via E2 precedent (RDF `rdf:type`, BFO/DOLCE parthood). Both are flagged "vault-novel, taxonomy-precedented" in `findings.md` rather than removed.
- Edges flagged as speculative (in vault and in taxonomies, but rare in vault and overloaded): `operationalized-by` (39 vault uses but inconsistent semantics — sometimes used where `codified-as` would be correct; flagged for definition-tightening).

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [../../domainspec-vault-foundations/domainspec-subagents-strategy.md](../../domainspec-vault-foundations/domainspec-subagents-strategy.md) | `cites` | The originating domainspec-subagents-strategy discovery that defines the three-file dispatch artifact set (D-11) and tool-not-stage scoping (D-12). |
| [../../../premise/domainspec-subagents-strategy-premises.md](../../../premise/domainspec-subagents-strategy-premises.md) | `cites` | Premises governing this dispatch — P-SS-2 (capability tiers), P-SS-3 (parallel independence), P-SS-5 (gate before fan-out), P-SS-6 (briefing contract), P-SS-7 (trust but verify), P-SS-8 (recursion budget), P-SS-9 (no dispatch without confirmed strategy), P-SS-11 (verification protocol). |
| [../../../ontology-conventions.md](../../../ontology-conventions.md) | `cites` | The constitution whose Appendix C edge catalog this research is positioned to refine. |
| [../../domainspec-vault-foundations/epistemic-chain.md](../../domainspec-vault-foundations/epistemic-chain.md) | `cites` | D-1 through D-9 of this discovery declare canonical chain edges (e.g., `derives-from`, `validates`, `contradicts`) that constrain the edge catalog. |
| [../../domainspec-vault-foundations/scope-and-domain-axes.md](../../domainspec-vault-foundations/scope-and-domain-axes.md) | `cites` | D-3, D-5, D-10 declare the typed-DAG with tree-constrained `subclass-of` — a structural constraint on edge typology. |
| [../../robot-talks-definitions/robot-talks.md](../../robot-talks-definitions/robot-talks.md) | `cites` | Recent example of vault-edge usage in a `Connections` section; serves as one of E1's sample sources. |
| `research.md` | `produces` | Raw evidence file (this dispatch's first output artifact). |
| `findings.md` | `produces` | Synthesized edge catalog (this dispatch's second output artifact). |
