---
tags: [vault, ontology, edges, invariants]
node_type: constitution
is_session: false
layer: ontology
nature: reference
status: exploratory
version: 0.1.1
last_updated: 2026-06-16
derives-from:
  - vault/ontology-conventions.md
  - vault/discovery/graph-as-residue-attractor/lenses/01-invariants-and-layer-alignment/findings.md
---

# Edge Constitution

> The single enforceable home for the **shape rules of the vault's typed-edge graph**: which edges may exist (grammar), which endpoint pairs each may connect (constructibility / category-errors), how both endpoints must declare them (directionality), and which edge types must stay acyclic. It is the *governance* layer over the edge graph — it does not own the edge-type *data*, which lives in `ontology-conventions.md` Appendix C (the catalog of record).

---

## Objective

`ontology-conventions.md` Appendix C defines **what edge types exist** — their forward/inverse names, their admitted `node_type` endpoints, and their cardinality. That appendix is the *data*. This constitution is the *law*: it states which structural invariants over that data are enforceable, assigns each a validator, and declares what is a content error versus a tooling concern.

It consolidates and **supersedes** `edge-acyclicity-constitution.md`, folding acyclicity into a single edge-shape constitution alongside two invariants that previously had no constitutional home:

1. **Grammar** — only catalog edges exist; inverses are fixed, not invented (§2).
2. **Constructibility** — an edge instance is well-formed only if its `(source.node_type, target.node_type)` pair is admitted for that edge type; forbidden pairs are *category-errors*, not merely discouraged (§3).
3. **Directionality** — vault↔vault edges declare on both endpoints; the carve-outs are explicit (§4).
4. **Acyclicity** — justification-bearing edge types must be acyclic on the populated graph (§5).

This constitution governs *edge-graph shape*, **not** edge *semantics* beyond the direction-of-justification claim (§8 Boundary). It does not police whether a `derives-from` is *justified* — only that the resulting digraph is well-formed and acyclic. Substantive justification is the reviewer's call.

---

## 1. Scope & Selection Predicates

**Applies to** every typed edge declared in a `## Connections` block of any vault node, and to every tool that reads, writes, or validates the edge graph.

**Does not apply to**: the *content* of a node, the `node_type` / `status` / confidence labels of a node (those are governed by `ontology-conventions.md`), or non-graph cross-references in prose.

**Load this constitution when**: authoring or reviewing a `## Connections` block; adding, renaming, or retiring an edge type; building or running an edge validator (`vault-ctl`); or designing the typed-edge layer of an `ontology-view`.

**Do not load it when**: the task only touches a node's body or its non-edge frontmatter; it carries no authority there.

---

## 2. Grammar — the catalog is closed

| Rule | Statement |
|---|---|
| **G1 — closed vocabulary** | An edge's `Type` MUST be one of the forward or inverse names catalogued in `ontology-conventions.md` Appendix C; that enumeration is the complete set, whatever its final size. No edge may be coined inline. *(The forward-edge count is currently inconsistent across sources — Appendix C's header says 22, conventions §8 says 21, a direct row count gives 25; this must be reconciled upstream in conventions. This constitution defers to Appendix C's enumerated rows, never to a stated integer.)* |
| **G2 — fixed inverse pairs** | The forward/inverse name pair is fixed by the catalog. Authors do not invent inverses ad-hoc (e.g. `derives-from` ↔ `derives`, never `derives-from` ↔ `is-derived`). |
| **G3 — `contradicts` is symmetric** | `contradicts` is the only symmetric edge — both endpoints use the same name. A node may not contradict itself (see §5). |
| **G4 — propose, don't coin** | A relationship that does not fit any catalog edge is proposed through a `discovery` document that amends Appendix C via the schema-evolution gate — never introduced as a one-off edge. |
| **G5 — deprecated edges are non-conformant** | Edges in Appendix C's "deprecated" table (`references`, `depends-on`, `provenance-for`, …) MUST migrate to their canonical replacement. |

The catalog itself (the per-edge name, endpoints, and cardinality) is **not reproduced here** — it lives in Appendix C, by the DRY discipline of `ontology-constitution.md` (foundational data lives natively in exactly one place). This constitution governs the *shape* of that data; Appendix C *is* the data — with one declared exception: the §5 acyclicity status is a field Appendix C does not carry, so this constitution *originates* it rather than mirroring it (see §5, §8).

---

## 3. Constructibility — forbidden endpoint pairs are category-errors

The load-bearing invariant. An edge instance `A —t→ B` is **well-formed only if** `(A.node_type, B.node_type)` is admitted by the `Source node_type` / `Target node_type` columns of edge type `t` in Appendix C. A pair outside that set is not a weak edge — it is *unconstructible*: the relationship it asserts is a category mistake.

Three category laws make the admitted-pair sets non-arbitrary:

| Rule | Statement |
|---|---|
| **C1 — session/formalized split** | A **session** node (`is_session: true`) may originate only **provenance** edges (`creates`, `modifies`, `revisits`, `refutes`, `surfaces-conflict`, `opens/closes-question`, `consumes`, `continues-from`) and **reference** edges (`cites`). It MUST NOT originate an **epistemic** edge (`derives-from`, `validates`, `codified-as`, …). A session's intellectual contribution is expressed through the artifacts it `creates`, which then carry the epistemic edge. |
| **C2 — formalized origination** | A **formalized** node (axiom, premise, constitution, discovery, plan, spec, audit, conceptual, test, research, findings) may originate only **epistemic** or **reference** edges. It MUST NOT originate a **provenance** edge — formalized nodes do not "do" things; sessions do. |
| **C3 — `subclass-of` is a tree** | `subclass-of` is tree-constrained: a node has at most one direct superclass. Multiple inheritance is forbidden (it is a different relation, modeled with `part-of` or `cites`). |

Examples of **unconstructible** edges (validator must reject):

- `session —derives-from→ discovery` — violates **C1** (session originating an epistemic edge); use `creates` + let the artifact derive.
- `spec —creates→ session` — violates **C2** (formalized node originating a provenance edge).
- `premise —subclass-of→ {two parents}` — violates **C3**.
- `constitution —operationalized-by→ premise` — wrong target type: per its Appendix C row, `operationalized-by` admits only a `skill` target, so any non-skill target is unconstructible.

Constructibility is what the `ontology-view` typed-edge layer makes *unconstructible by typing* rather than merely asserted. This constitution is the prose authority that layer points at.

---

## 4. Directionality & bidirectionality

| Rule | Statement |
|---|---|
| **D1 — declare both sides (vault↔vault)** | Every edge between two vault nodes appears in two `## Connections` blocks: the source declares the forward name, the target declares the inverse. There is no inference layer. Asymmetric vault↔vault edges are **bugs**, surfaced by the asymmetry audit. |
| **D2 — skill/agent carve-out (forward-only by target)** | Forward edges into `.claude/skills/**` and `.claude/agents/**` are legal-by-design and forward-only. Those targets are not graph nodes (no `node_type`, no `## Connections`). No inverse is required; the audit MUST NOT flag them. |
| **D3 — session carve-out (forward-only by source)** | Edges whose **source** is a session (`is_session: true`) are forward-only: no inverse row is written on the target. The asymmetry audit skips them. |

(D1–D3 restate `ontology-conventions.md` §8; this constitution is where they become enforceable invariants with an owning validator. Conventions remains the explanatory home for the *rationale*.)

---

## 5. Acyclicity — justification edges must terminate

Some edge types carry a *direction-of-justification* and must be acyclic on the populated edge set: a cycle is a non-terminating promotion loop and breaks the uniqueness of axiom-as-terminal.

| Edge type | Acyclic? | Rationale |
|---|---|---|
| `derives-from` | **yes (S10)** | Justification chains must terminate at an axiom. A cycle is a non-terminating promotion loop. |
| `supersedes` | **yes** | "X replaces Y replaces X" is incoherent. |
| `governs` (`governed-by`) | **yes** | A governance loop collapses authority — no node can be the source. |
| `part-of` | **yes** | Mereological containment is a strict partial order. |
| `subclass-of` | **yes** | Tree (§3 C3) ⇒ strictly acyclic. |
| `codified-as`, `operationalized-by`, `implements`, `validates`, `refines`, `synthesized-by`, `creates`, `modifies`, `continues-from` | **yes** | All carry a direction (abstract→concrete, evidence→claim, action→effect, before→after). A cycle indicates a mislabelled edge. |
| `contradicts` | **no** | Schema-mandated symmetric. Self-loop still forbidden (a node cannot contradict itself). |
| `cites` | **no** | Bibliographic citation is naturally cyclic; no semantic violation. |
| `corroborates`, `alternative-to`, `revisits`, `refutes`, `surfaces-conflict`, `opens-question`, `closes-question`, `consumes`, `retrofits` | **no** | Not justification-bearing; cycles carry no structural violation. |

**Self-loops** (`A —t→ A`): forbidden for every acyclic type (degenerate 1-cycle) and for `contradicts` (unsatisfiable). Allowed-but-pointless for `cites` (flag as warning).

> **Provenance note.** The acyclicity status of edge types added to the catalog *after* `edge-acyclicity-constitution.md` v0.1.0 (`implements`, `refines`, `subclass-of`, `synthesized-by`, `corroborates`, `alternative-to`, `revisits`, `continues-from`, `consumes`, `retrofits`) is **proposed here and pending review** — it should be confirmed before this constitution promotes past `exploratory`.
>
> **Stipulation note.** `creates`, `modifies`, and `continues-from` are session-originated (Source = session, Target = `any`/session at N:M per Appendix C), so a session→session cycle is *constructible*; their acyclic status is a **stipulation** (such a cycle is a mislabelled edge), not entailed by catalog typing. The cycle detector still enforces it; a flagged session-cycle is a labelling error to fix, not a counterexample.
>
> **Gate note.** For the acyclicity statuses minted inline here (those not present in the superseded `edge-acyclicity-constitution.md`), the §9 reviewer-confirmation step *is* the schema-evolution gate G4 requires — they do not ship enforced until that review passes.

---

## 6. Rules → validators

The real `vault-ctl` surface today is `validate`, `edges-check`, `snapshot`, `status`, and the `cycles` subcommand (`internal_tools/vault_ctl/cli.py`). Only acyclicity and dangling-target detection are built; the grammar, constructibility, and full-asymmetry validators are **planned, not yet implemented** — constructibility is asserted, not computed (§9). The table names the intended owner per rule and its build state honestly.

| Rule ID | Rule | Validation Mode | Validator | Build state |
|---|---|---|---|---|
| `G1`,`G2`,`G3`,`G5` | Edge type ∈ catalog; inverse pairs fixed; `contradicts` symmetric; no deprecated edges | deterministic | grammar/vocabulary lint — **not yet built** (no command enumerates non-catalog / deprecated / symmetry violations) | planned |
| `C1`,`C2`,`C3` | Endpoint-pair admitted; session/formalized split; `subclass-of` is a tree | deterministic | constructibility typecheck against Appendix C endpoint columns — **not yet built** | planned |
| `D1` | Vault↔vault edges declared on both endpoints | deterministic | `vault-ctl edges-check` detects dangling targets; full inverse-asymmetry audit (skipping D2/D3 carve-outs) **not yet built** | partial |
| `S*` | Acyclicity on the acyclic edge subgraph; no self-loops | deterministic | `vault-ctl cycles check --strict` (DFS per acyclic type) | built |

All validators **report, do not auto-fix** (§7). `--strict` exits non-zero on any violation. URL / external (non-`.md`) targets are excluded from the cycle graph — they cannot participate in an in-vault cycle.

---

## 7. Fix responsibility

The tooling **reports; the author fixes.** A constructibility or cycle violation is a *content error*: auto-removal would silently change provenance, which is exactly the discipline these edges exist to preserve. Standard remedies:

- **Wrong type** — re-type the edge (it was `derives-from` but should be `cites`).
- **Wrong direction** — reverse it (the endpoints were inverted).
- **Wrong endpoint** (constructibility) — the relationship is a category-error; either the `node_type` of an endpoint is wrong, or the edge should not exist.
- **Cycle** — introduce an intermediate node breaking the loop and demote one side.

---

## 8. Composition

**Supersedes**: `edge-acyclicity-constitution.md` — its §1–§4 are folded into §5–§7 here. The `superseded-by` inverse is already declared on that file (satisfying D1 now); on ratification it additionally takes `status: deprecated`.

**Catalog of record**: `ontology-conventions.md` Appendix C. This constitution governs the *shape* of that catalog and does not duplicate its endpoint/cardinality data — with one declared exception: the §5 acyclicity status, the single invariant whose data Appendix C does not carry, is originated here and gated by §9. If the two disagree about an edge's existence or endpoints, **Appendix C wins on data**, this constitution wins on *which invariants are enforced*.

**Downstream**: the `ontology-view` typed-edge layer is the *constructive* expression of §3 — it makes forbidden pairs untypeable. This constitution is the asserted authority it cites.

**Boundary**: governs edge-graph *shape* only. It does not judge whether a given edge is substantively *justified* — that is the reviewer's call. It says nothing about node bodies or non-edge frontmatter.

**Conflicts**: none known. Narrower than `ontology-conventions.md` (which covers all 7 labels); strictly about edges.

---

## 9. Promotion boundary

Required before this constitution leaves `exploratory` for `consolidated`:

- The acyclicity statuses flagged "pending review" in §5 confirmed by a reviewer.
- The constructibility typecheck (C1–C3) **built and green** on the live vault, and `vault-ctl cycles check` green — constructibility is currently asserted, not computed.
- `edge-acyclicity-constitution.md` formally `status: deprecated` (its `superseded-by` inverse is already written, D1).
- No open `contradicts` edge against this document.

---

## 10. Maintenance

**On adding a new edge type to Appendix C**: this constitution MUST be updated *before the validator ships* — declare the new type's acyclicity status (§5) and confirm its endpoint pairs are covered by C1/C2, or add a new category law.

**Split trigger**: if the constructibility matrix (§3) grows its own per-edge endpoint tables and rationale, split it into a dedicated `edge-constructibility-constitution.md` and leave acyclicity + grammar here.

**Retirement trigger**: retire only if the edge graph stops being declared in Markdown (e.g. moves to a computed SQL layer with its own constraints) — at which point the invariants migrate to that layer's schema.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/ontology-conventions.md` | `derives-from` | Appendix C is the catalog of record this constitution governs; §2 grammar, §3 constructibility, and §4 directionality all draw their data and rationale from it. |
| `vault/constitution/edge-acyclicity-constitution.md` | `supersedes` | Folds the acyclicity constitution into this consolidated edge constitution (§5–§7). On ratification the predecessor is deprecated. |
| `vault/discovery/graph-as-residue-attractor/lenses/01-invariants-and-layer-alignment/findings.md` | `derives-from` | Carries forward the invariants lens that originated the acyclicity requirement (R3, §C/§D row S10). |
