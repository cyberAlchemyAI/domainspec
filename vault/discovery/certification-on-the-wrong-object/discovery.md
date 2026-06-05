---
tags: [vault, discovery, residue, codegen, audit, two-layer, measurement]
node_type: discovery
is_session: false
layer: architecture, application
nature: explanatory
status: draft
version: 0.1.0
last_updated: 2026-06-02
created_by: victorboscaro@gmail.com
---

# Certification on the Wrong Object

> **What this node is.** A diagnosis, not a result. It records a structural property of the *current* DomainSpec pipeline and argues its consequences. It does **not** propose a solution, decide a build order, or claim any residue has been measured. Everything operational below is marked OPEN.

This discovery names a gap that the [`business-dictionary-vault-code-link`](../business-dictionary-vault-code-link/discovery.md) and [`business-dictionary-typed-link-seta-code`](../../../../domainspec-theorem/vault/discovery/business-dictionary-typed-link-seta-code/research.md) nodes circle without integrating, and that [`graph-as-residue-attractor`](../graph-as-residue-attractor/discovery.md) and [`two-layer-platform-architecture`](../two-layer-platform-architecture/discovery.md) assume away. Those nodes own the typed-edge proposal, the categorical observation, the predicted residues, and the telemetry plan respectively. This node owns the **operational diagnosis** they share a border with and none state: *the pipeline certifies the spec, not the artifact.*

---

## Objective

Establish, as a durable finding, that the DomainSpec pipeline today **determines residue-risk on the spec before code exists** (executable, running) but **does not measure residue on the generated code after it exists** (absent), and to trace what that asymmetry costs us in review, generation, trust, and tower iteration — so the next decision about where to invest is made against the real gap, not against the framework's headline.

## Method

Three parallel read-only sweeps over both repositories (`domainspec` and `domainspec-theorem`), grounded against [`docs/distilled/two-layer-framework/domainspec-two-layer-framework.md`](../../../docs/distilled/two-layer-framework/domainspec-two-layer-framework.md):

1. **Lean grammar** — what `residue` *is* as a formal object (`ResidueStructure.noise`, the signal/noise partition, the sigma-fibre typed residue, the quotient kernel).
2. **Tooling** — what software actually determines/classifies residue in the day-to-day pipeline.
3. **Sessions** — what the 2026-06-01 `business-dictionary` session pair concluded and left open.

Sweep 1 confirmed the grammar is real and sorry-free but presupposes the signal/noise split as a *given input*. Sweep 2 confirmed every executable residue-touching tool runs **pre-codegen**. Sweep 3 confirmed the `specs→code` residue is registered as an **open premise**, not a result.

---

## 1. Business Context

### Why now

"Typed residue accounting" is the stated central contribution of the framework. On 2026-06-01 a session pair decided the business dictionary should be the typed `spec ↔ code` link but explicitly recorded that *"no Lean theorem supports 'the dictionary makes the seta residue-measurable'"* — the consequence is conjectural, the proof empty ([`business-dictionary-typed-link-seta-code/research.md`](../../../../domainspec-theorem/vault/discovery/business-dictionary-typed-link-seta-code/research.md)). That node names the *surface* ("residue unmeasurable on the seta — not zero, undefined"). It does not name *why the gap exists operationally*, nor what it costs. This node does.

### What's broken

The certification in the pipeline is placed on the wrong object. Inventory of what actually runs:

| Tool / artifact | What it determines | When | Status |
|---|---|---|---|
| `scripts/audit_richness.py` (6 checks: injectivity, faithfulness, fullness, M6 clusters, cardinality, perturbation) | residue **risk** on the spec | pre-codegen | real, executable |
| `internal_tools/categorical_tooling_guard` | gate `PASS\|FLAG\|BLOCK` over the above | pre-codegen | real |
| `internal_tools/lean-code-validator` (P1–P5; P1/P5 real, P3/P4 stubs) | schema closure + acyclicity of the codegen subgraph | pre-codegen | real, partial |
| `experiments/2026-05-22-dual-residue-loss` | η^sch_rate / η^ins_rate as metrics | falsification experiment (JSON toy) | proposal, not pipeline |
| `internal_tools/vault_telemetry/residue.py` | governance residues R1–R4 of the *vault* | post-hoc, vault layer | real, **different layer** |
| **post-hoc code ↔ spec residue audit** | what the spec did not authorize that appeared / what it required that is missing | post-codegen | **does not exist** |

Passing the spec-side gate certifies *"a faithful compiler **could** produce low-residue code"*. It does not certify *"this code **has** low residue"*. The confidence is born in a property of the spec and silently transferred to the artifact — a category error.

### What stays the same

- The spec-side gates are genuinely valuable and **stay**. A rich, closed, M6-free spec lowers the *probability* of residue. This node demotes them to "prior, not measurement" — it does not discard them.
- The Lean residue grammar (`UniversalResidueFunctor.lean#ResidueStructure`, `FiberedResidueFunctorTyped.lean`) **stays**. The gap is not in the grammar; it is in the absence of an instantiation over real artifacts.
- The business dictionary as adopted prior art (DDD Ubiquitous Language + Glossary, Evans 2003) **stays**. Per the cite-don't-rediscover rule, the only novel layer is the typing of the term→code edge — and that is exactly the layer left open.

---

## 2. The asymmetry

We determine residue-**risk** (spec, pre-code, executable) and call it residue **accounting**. We do not measure residue (code, post-code) at all. The two-layer framework's instance residue η^ins is the unit map that says *which populated cells were lost or hallucinated* — but nothing computes that unit map over real generated code, for two coupled reasons:

1. **There is no deterministic Δ in the pipeline.** The `specs→code` transformation is performed by a human/agent coding manually (the pattern-library is a *context-selection recipe*, not a code generator). With no mechanical compiler, there is no `Σ_Δ` to run an artifact against.
2. **The formal model is deterministic where reality is not.** `DynamicTowerCoalgebra.lean#RungSeq.step` carries `F = Id` (one spec → one rung). Real `specs→code` is one-to-many: a spec admits several implementations. The missing `BranchingRungSeq` (`step : rung n → List (rung (n+1))`) is exactly the `F ≠ Id` non-determinism of manual/LLM coding. **The formal hole and the operational hole are the same hole.**

---

## 3. The four consequences

**(a) Review approves on the wrong object.** A reviewer who passes `categorical_tooling_guard` certifies the spec was rich enough that a faithful compiler *could* have produced low-residue code. The artifact can still Skolemize freely — invent a foreign key, default an enum, collapse two concepts — and nothing catches it post-hoc. The two-layer doc §2.4 is explicit: concept-erasure and data-hallucination are *"different audits, and one cannot replace the other."* Today we run one, on the layer where the artifact does not live. *(argued)*

**(b) The Σ-vs-Π choice is invisible at the instant it is created.** At every slot the spec under-determines, the generator silently picks `Σ_Δ` (invent a fresh witness) over `Π_Δ` (enumerate completions) and never announces which. The two-layer doc's sharpest operational sentence — *"did you Skolemize, or did you join?"* — is unanswerable in the current pipeline. The invented witness then becomes load-bearing fact for downstream code. *(argued)*

**(c) Trust calibrates on the proxies the framework proves insufficient.** With no residue measurement, trust anchors on build-green / tests-green / migration-ran. The two-layer doc proves these are exactly insufficient: build-green passes dropped concepts, migration-ran passes hallucinated rows. Trust is therefore not merely under-informed but systematically mis-calibrated *upward*. *(argued)*

**(d) The tower recursion has no error term.** The mission is a system that builds systems — iterating the framework on its own output (Regime 4: *"expect new residue at level n+1; do not claim closure"*). Unmeasured per-rung residue does not stay constant; level n+1 is built on level n's invented witnesses. Evidence consistent with this: `schemas` is enforced but ungated and *"already drifted"* (per project memory). Drift is unmeasured residue accumulating. *(predicted; one corroborating datum, not measured)*

---

## 4. The certification-placement error

The deepest reading, and the one this node exists to make uncomfortable: the framework's headline is "typed residue accounting," and today the accounting runs on the *spec* (risk), not on the *residue that actually occurs* in the artifact. When anyone says "DomainSpec produces faithful code," the pointable proof is spec-side; the claim is artifact-side. **The claim exceeds the proof by exactly the prevention→measurement gap.** This is the subset-rule violation the framework polices in others, here structural and at its own center — which is why it is worth a node rather than a footnote.

This is not solvable by "build a measurement tool" alone. The asymmetry is a placement error: certification happens *before* the artifact exists. Closing it means moving (or adding) a determination step to *after* code exists — and deciding whether that step is a heuristic count, a typed witness, or both.

---

## 5. Option space — NOT decided here

Two paths to close the gap. This node records both and the trap between them; it does **not** choose.

- **Measure-first (heuristic).** Build the post-hoc code↔spec audit: count *orphans* (code symbol with zero inbound typed edges → instance residue) and *collapses* (multiple terms → one symbol → schema residue), via the typed edge the `business-dictionary` discovery proposes. Cheap; the counting machinery already exists one layer up (`vault_telemetry/residue.py` does exactly this for R1–R4). Resolves (a)(b)(d) — it makes the silent authorial choice *visible as a number* — now.
- **Anchor-first (formal).** Build the open débito: `BranchingRungSeq` + a concrete typed `SchemaMorphism` (`SchemaInstance.lean#SchemaMorphism`) realizing the seta + a residue theorem over that edge. Makes the count *be* a typed residue witness rather than a heuristic. Slower; closes the §4 claim>proof.
- **The trap.** A heuristic count shipped *without* the theorem risks becoming a **new mis-calibrated proxy one level up**: "orphan-count green" read as "no residue," when it only means "no *detected* residue of one countable kind." That is consequence (c) recurring with more apparent authority. Hence: if measure-first, a coverage-honesty label is non-optional — the count must announce what it does *not* cover.

---

## 6. Open Questions

### OQ-1. Build order: measure-first or anchor-first?
**Context:** §5. The choice depends on which consequence is judged most threatening — (a)/(b)/(d) (invisible authorial choice, drift) favour the cheap heuristic now; (c)/§4 (mis-calibrated trust, claim>proof) favour the theorem first.
**Recommendation:** Defer. This is the decision the diagnosis was built to inform; it is the user's to make.
**Status:** OPEN.

### OQ-2. If measure-first: mandatory coverage-honesty label.
**Recommendation:** Any heuristic residue count must ship with an explicit statement of its blind spots (which residue classes it does not detect), so it cannot become the proxy of consequence (c).
**Status:** open, conditional on OQ-1.

### OQ-3. The typed-edge name.
**Context:** The orphan/collapse count needs the typed `term→symbol` edge (`grounds`/`@biz`/`@sys`).
**Recommendation:** Out of scope here — owned by [`business-dictionary-vault-code-link`](../business-dictionary-vault-code-link/discovery.md) OQ-5. Do not name it in this node.
**Status:** deferred to parent.

---

## 7. What this discovery does NOT decide / does NOT claim

- Does **not** claim residue has been measured on any artifact.
- Does **not** claim orphan-count *is* residue — that identity is the open theorem (§5, OQ-1).
- Does **not** claim the tower drift is measured — (d) is predicted with one corroborating datum.
- Does **not** decide the build order (OQ-1) or the typed-edge name (OQ-3).
- Does **not** revert the 2026-06-01 verdict that the `specs→code` residue theorem is an open premise. It re-states it as still open.

---

## 8. Promotion path

- If OQ-1 resolves measure-first → a follow-on discovery scoping the post-hoc audit (inputs: spec registry + code symbol table; output: orphan/collapse counts + coverage label).
- If OQ-1 resolves anchor-first → routes to `domainspec-theorem` for the `BranchingRungSeq` + `SchemaMorphism` + residue-theorem work (Lean skills).
- Either way, this node graduates `draft → exploratory` once discussed in a session, and a `research/` layer may be retrofitted (precedent: `two-layer-retrieval`).

---

## Connections

| Document | Type | Description |
|---|---|---|
| [`business-dictionary-vault-code-link/discovery.md`](../business-dictionary-vault-code-link/discovery.md) | `derives-from` | Owns the typed term→code edge and the orphan/collapse residue-counting proposal this node diagnoses the need for. |
| [`business-dictionary-typed-link-seta-code/research.md`](../../../../domainspec-theorem/vault/discovery/business-dictionary-typed-link-seta-code/research.md) | `derives-from` | Owns the categorical observation ("residue unmeasurable on the seta") and the open formal débito (BranchingRungSeq, SchemaMorphism, residue theorem). Cross-repo (domainspec-theorem). |
| [`graph-as-residue-attractor/discovery.md`](../graph-as-residue-attractor/discovery.md) | `derives-from` | Owns the four predicted residues and the "prediction not tested over time" flag that consequence (d) sharpens. |
| [`two-layer-platform-architecture/discovery.md`](../two-layer-platform-architecture/discovery.md) | `derives-from` | Owns the residue-counter telemetry plan; this node supplies the diagnosis that plan presupposes. |
| [`docs/distilled/two-layer-framework/domainspec-two-layer-framework.md`](../../../docs/distilled/two-layer-framework/domainspec-two-layer-framework.md) | `cites` | The η^sch / η^ins framework and the §2.4 "different audits" statement the consequences rest on. |
