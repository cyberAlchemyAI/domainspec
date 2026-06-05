---
tags: [schema-of-schemas, meta-repo, schema-instance, typed-residue, symmetry-mesh, open-questions, gate-first, skolem-nulls, emergence]
node_type: discovery
is_session: false
layer: ontology
nature: explanatory, reference
status: exploratory
veracidade: medium
convicção: high
version: 0.2.0
last_updated: 2026-06-01
created_by: victorboscaro@gmail.com
---

# Schema of Schemas

## Objective

Make the meta-repo's knowledge graph an explicitly typed, two-level (schema/instance) artifact by adding two additive kernel changes — an `open_questions` base frontmatter field and a `problem-definition` node_type — and wiring the existing `vault_ctl` validators into a CI gate that refuses unschematized writes. The end state is a gated typed-node registry where every node is validated against its `node_type`, every residue is a first-class typed field, and a mesh of (separately-status-tracked) symmetries constrains the graph as recorded design. This is a pre-implementation design record, not a claim that any of it is built or enforced today.

---

## 1. Business Context

### Why now

The meta-repo (a system that fabricates software **and** generates/manages knowledge) needs one shareable representation for its knowledge work before it stands up any instances. The triggering condition is measured drift in the only home with a real kernel: in `/Users/victorboscaro/domainspec` the location-decision audit counted **34 distinct live `node_type` strings against the ~16 the kernel admits**, including literal garbage (`{type}`, `<one of the values below>`, pipe-delimited lists). The kernel (`internal_tools/vault_common/frontmatter.py`) validates **on demand only** — there is no `.pre-commit-config.yaml`, no active git hook, no `.github/workflows/` wiring it into a gate. Until the gate is paid, every new node — including this meta-repo's birth records — appends to the exhibit of the failure we are trying to avoid.

### What's broken

- **No write-time gate.** `internal_tools/vault_ctl/cli.py:validate` exists but is wired into nothing; `find_cycles` (`cycles.py:30`) and `edges-check` (`cli.py:64`) likewise run on demand only. Verified absent: `.pre-commit-config.yaml`, `.github/workflows/` in `/Users/victorboscaro/domainspec`.
- **Drift tolerated at the field level.** `NodeFrontmatter` sets `extra="allow"` (`frontmatter.py:58`), so off-schema fields parse silently. This soft-tolerance — not missing rejection logic — is the drift root cause (`validate_node` already hard-rejects unknown `node_type`, `frontmatter.py:257`).
- **No node for the pipeline head.** The knowledge-generation pipeline starts at a problem statement, but `problem-definition` is not in the kernel `NodeType` Literal (`frontmatter.py:21-38`); the closest is `discovery` framing. The first node the pipeline must emit would be admitted today only because nothing rejects it.
- **Residue is implicit.** Residue lives only as the `opens-question`/`closes-question` *edges* in the 22-edge catalog; no node carries its own artifact-level residue as a typed field. Cross-repo, residue is first-class in 3 of 4 audited repos (`component-cartography/synthesis.md:44`) — the kernel under-represents it.
- **Endpoint and bidirectionality constraints are audit-only.** The per-`node_type` edge-endpoint rules are prose in `ontology-conventions.md` Appendix C; only the *vocabulary* frozenset and *acyclicity* are code-validated. The endpoint and asymmetry checks are not enforced (`representation-design/agents/01-schema-graph-designer.md:107,109`).

### What stays the same

- The **base + per-type subclass pattern** (`NodeFrontmatter` + 16 dispatched subclasses) is reused verbatim; this design tightens it, it does not replace it.
- The **22-edge catalog**, its fixed forward/inverse pairs, the `## Connections` wire-format, acyclicity, and the three bidirectionality carve-outs (skills/agents forward-only-by-target, sessions forward-only-by-source) are reused unchanged.
- The **13 cross-cutting kernel node_types** — `axiom`, `premise`, `constitution`, `audit`, `conceptual`, `backlog`, `readme`, the dispatch triad, `discussion` — are imported as-is; only 4 pipeline types are proposed as new.
- The `layer`/`representation_layer` field stays a topical-scope filter; it constrains **no** edges and is not the "camada".
- The existing `vault_ctl validate / edges-check / cycles` validators are reused as the gate's machinery — the load-bearing addition is the *wiring*, not new validators.
- **Folder-shape carve-out:** this discovery ships as a single `discovery.md` (no `README.md` + `lenses/`), diverging from `discovery-structure-constitution` §1/§3 — justified under §8 (substance over shape) and the observed vault norm (only 12 of 38 sibling discovery folders carry `lenses/`; `vault_ctl validate` checks node frontmatter, not folder shape). Named explicitly per `discovery-writing.md:89`.
- **Out of scope:** the dedicated meta-repo (a migration target earned later), the faceted node-model decision (Fork A), the envelope-schema-on-edge (Fork C), the remaining pipeline types past the first slice, and any runtime/telemetry residue ledger.

---

## 2. Core Concepts

**Two levels — the schema/instance fibration.** A *schema graph* defines the allowed node-kinds and edges; an *instance graph* is the populated documents. This is the schema/instance pair formalized in `domainspec-theorem/lean-formalization/SchemaInstance.lean`: a schema is a small category `S`, an instance is a functor `S ⥤ Type`, and a schema morphism `Δ : S ⟶ T` migrates instances by pullback `Δ^* := (· ⋙ Δ)` (`SchemaInstance.lean:71,76,83`). domainspec already separates both levels — `ontology-conventions.md` + `frontmatter.py` are the schema graph; `vault/` is the instance graph. The fibration is the formal warrant for keeping the two levels distinct, and for **M6**: a tight base `S` does not make any particular instance functor internally consistent — consistency is a property of `I`, not of `S`.

**Layers = `node_type`s (NOT the `layer` field).** "Camada" means a *kind of node* — a `node_type` — each holding many nodes. The domainspec `layer`/`representation_layer` field is topical scope and constrains no edges; `node_type` pairs do. Chosen over conflating the two because the topologist confirmed `layer` does no edge work (`component-cartography/synthesis.md:27`).

**Intra- vs extra-layer edges, shared mechanism.** An *intra-layer* edge joins two nodes of the same kind (`research --cites--> research`); an *extra-layer* edge joins different kinds (`research --derives-from--> discovery`). The edge *mechanism* (the `## Connections` block + acyclicity + bidirectionality) is shared by all node_types; the allowed edge *types and endpoints* are constrained per `node_type` pair. Intra vs extra is **derived** (`src.node_type == dst.node_type`), not stored — keeping the representation non-redundant.

**Shared invariants + typed residue (`open_questions` as a Skolem null).** Every node shares the base frontmatter; the proposed `open_questions` field is the *artifact-level typed residue* — what this artifact does not resolve. Read it as a **Skolem null**: a labeled existential ("something exists here, value unknown"), not a comment. A *beneficial* null is positioned to crystallize into a new layer's vocabulary (emergence); a *harmful* one merely propagates ignorance. Chosen as a field (not only an edge) because residue is a cross-repo invariant that belongs on the node itself.

**Two gates, by design — schema-validity and residue-typing (NOT instance-uniformity).** Because residue is never fully absorbed (see §4) and emergence *is* residue, the second gate must not demand uniform instances — that would kill emergence. Gate A refuses garbage; Gate B refuses *untyped* residue, not residue.

---

## 3. Data Model Changes

Two additive kernel changes; both are defaulted/registered so existing nodes validate unchanged.

- **Add `open_questions` to `NodeFrontmatter`** (`frontmatter.py:53`) as `open_questions: list[str] = Field(default_factory=list)`. Additive-safe: defaulted, and `extra="allow"` already tolerates it. It is the schema-side of residue; the *content* of residue (is it real, is it resolved) is instance discipline, gated separately.
- **Register `problem-definition`** by adding it to the `NodeType` Literal (`frontmatter.py:21`), adding a `ProblemDefinitionFrontmatter` subclass, and registering it in `_FRONTMATTER_BY_TYPE` (`frontmatter.py:178`). Additive to the kernel, but a *schema-evolution event*: it must be authorized through the discovery channel (the blessed amendment path), because `validate_node` hard-rejects any unknown type until it is registered.

The pipeline node_types as a sequence — `problem-definition → research → discovery → spec → implementation-plan → implementation`, plus later `new-knowledge` and `experiment`:

| camada (node_type) | status vs kernel |
|---|---|
| `problem-definition` | **PROPOSED** — not in kernel `NodeType` Literal |
| `research` | EXISTS (`frontmatter.py:133`) |
| `discovery` | EXISTS (`frontmatter.py:97`) |
| `spec` | EXISTS (`frontmatter.py:107`) |
| `implementation-plan` | EXISTS (`frontmatter.py:103`) |
| `implementation` | PROPOSED (later — becomes code + `test`, may not be a vault node) |
| `new-knowledge` | PROPOSED (later — post-discovery typed residue) |
| `experiment` | PROPOSED (later — generalizes `test`) |

Net: reuse 13 cross-cutting kernel types as-is; add 4 pipeline types over time. Each new type requires a schema-validator anchor (or, for formal claims, a sorry-free Lean anchor) before any claim that it is "in the system."

---

## 4. The Mesh of Symmetries (recorded as design, per-symmetry status)

The representation respects **several** symmetries, not one — each with its own scope and **honest status**. Verified against the repos (audit `symmetry-mesh`). **None is runtime-enforced today.** The skill that would enforce the rate-1.0 ones — `bootstrap-tower` — **does not exist** (verified absent in both `domainspec` and `questions-game` skill trees). The demotion protocol is a **draft** at `questions-game/research/_drafts/new-project-skill-templates/DEMOTION-PROTOCOL.md`. **5 of 8 core symmetries have a sorry-free Lean basis; 0 of 10 are runtime-enforced.** Do not read any row as "enforced / rate 1.0".

| # | symmetry | formal basis | proof status | runtime-enforced? |
|---|---|---|---|---|
| 1 | tower self-similarity (I1–I6) | `AsymmetricTower.lean` | PROVED (definitional, sorry-free) | NO — `bootstrap-tower` NOT BUILT |
| 2 | sibling-of-meta (questions-game ≅ domainspec in form) | — | informal (not in Lean) | NO |
| 3 | layer-pair schema↔instance | `FractalOP.lean`, `F11.lean` | F11 PROVED; both-sides "Fractal" **conditional on the open M2 conjecture** (schema-level right-adjoint existence unknown, `FractalOP.lean`) | NO |
| 4 | knowledge-sibling | — | informal (not in Lean) | NO |
| 5 | promotion ⊣ demotion (Galois, **not** iso) | promotion only (`AsymmetricTower.lean`) | adjoint NOT formalized; protocol is a DRAFT; `promotions/` empty | NO |
| 6 | reflection-tower K-side persistence | `ReflectionTower.lean` (persistence_lemma) | PROVED sorry-free; **Q-side OPEN** | NO |
| 7 | edge-locality I6 (`no_new_morphisms_between_L`) | `ReflectionTower.lean` | PROVED (bundle field) | PARTIAL — Lean field only; no CI gate |
| 8 | inter-repo (shared bootstrap form) | — | informal (not in Lean) | NO |
| +9 | facet orthogonality (knowledge-taxonomy, 6 axes) | — | TESTED 35+ domains (not proved) | NO |
| +10 | cross-frame invariance (Lawvere diagonal) | — | TESTED (4 frames) | NO |

Supporting Lean (sorry-free): signal/noise partition (`SignalNoiseDecomposition.lean`), residue entropy (`Residue.lean`), V/D weak axis-independence (`InterAxisIndependence.lean`, sorry-free — its two `sorry` tokens are prose, not proof terms). The **broken** symmetries (rate < 1.0, especially #5 promotion ⊣ demotion, where residue = the information lost in demotion) are exactly where emergence (D-axis residue) is allowed to live.

---

## 5. Residue, Emergence, and the Two Gates

Residue is **never** fully absorbed — this is the proved negative `C_ω_absorption_refuted`: even the ω-colimit leaves residue. So uniform/consistent instances are not merely hard, they are *refuted*, and we do not want them: residue **is** emergence, and emergence is the goal. (Proof-status caveat: what is proved is the **non-absorption**, not the **infinitude** of the tower — the positive multi-rung composition is open. Residue is finite *per step*, non-terminating as a *sequence* — which is what keeps it typeable.)

"Emergence is a type of error" anchors precisely: the theorem's **D-axis** (tower-obstruction) has the property that *the obstruction at layer n becomes the vocabulary at layer n+1*. That promotion of residue into new knowledge **is** emergence. V (schema↔instance) and H (temporal/entropy) are the other error types — the ones that get *fixed*.

The design therefore needs **two gates**, and the second is **not** instance-uniformity (that would kill emergence):

- **Gate A — schema-validity.** The node is well-formed against its type (refuse garbage). Mechanism exists (`vault_ctl validate`), currently ungated.
- **Gate B — residue-typing.** Every residue/divergence is *classified*: emergence → route up as a new layer / `open_questions` / experiment; ambiguity-or-corruption → fix. The gate refuses **untyped** residue, not residue. (The knowledge-taxonomy IRR divergence was fixable ambiguity, i.e. error-residue — telling it apart from emergence *is* the discipline.)

---

## 6. Service / Execution Flow — Gate Wiring

The load-bearing change is the wiring, sequenced so a brownfield host is not bricked.

| step | change | additive / breaking | how it is gated |
|---|---|---|---|
| M1 | add `open_questions` base field | additive-safe | `vault_ctl validate` accepts the defaulted field; no new gate code |
| M2 | register `problem-definition` node_type | additive to kernel; schema-evolution event (authorized via a discovery) | `validate_node` accepts it, still hard-rejects off-catalog types |
| M3 | wire the gate | **breaking by design** | add `.pre-commit-config.yaml` + a CI job running `vault_ctl validate` + `edges-check --strict` + `cycles`, non-zero exit = refuse |

Sequencing: land M3 in **report-only** mode first (the host has ~23 live node_types (2026-06-01 recount; ~34 at the location audit) vs ~16; flipping straight to refuse would brick it), then flip to **refuse** once drift is burned down. In a greenfield host, land refuse-mode immediately. Ship the gate as a reviewed PR, separate from this doc. **Acceptance test:** CI red on an unknown `node_type` or a missing inverse edge; green on a clean node. That pass/fail asymmetry is the demonstration that the representation is *gated*, not conventional.

---

## 7. Open Questions

- **OQ-1 (Fork A — node model).** Discriminated `node_type` (domainspec) vs faceted multi-axis (knowledge-taxonomy)? **Recommendation:** adopt the latent synthesis — `node_type` = the discriminant (fixes allowed edges, the proven-working mechanism) **+** facets = orthogonal enumerated base fields (the portable, IRR-fixing layer). Resolve before standing up instances, because the node-model choice fixes the frontmatter.
- **OQ-2 (Fork B — capabilities in graph or out).** Are skills/agents typed nodes, or external artifacts the graph points at (domainspec carves them out; arcanum wants them in, 0% built)? **Recommendation:** keep the domainspec carve-out (forward-only edges) for the first slice; revisit only if a built second consumer appears — do not pre-pay for arcanum's unbuilt SIGIL layer.
- **OQ-3 (Fork C — edge as label vs contract).** Is an inter-layer edge a type label, or a *contract* (arcanum's envelope-schema: output of layer N = input of layer N+1)? **Recommendation:** ship a plain labeled edge in the MVP; record the envelope-schema as the better inter-layer-functor model but defer it until the first multi-hop pipeline exists to validate it against.
- **OQ-4 (M2 conjecture).** Does a schema-level right adjoint exist? It gates symmetry-3's both-sides "Fractal" (`FractalOP.lean`). **Recommendation:** leave open and mark symmetry-3 conditional; do not assert both-sides Fractal in any external text until M2 is proved.
- **OQ-5 (Skolem-null symmetry).** *Which* symmetries must a given layer respect so its Skolem nulls (`open_questions`) are beneficial (crystallize) rather than harmful (propagate)? **Recommendation:** adopt the working hypothesis-with-tension — chase/weak-acyclicity makes nulls resolve *locally* (terminating) while the tower stays *globally* open (emergence); per layer, decide which symmetries to enforce vs. let break, treating a deliberately broken symmetry (esp. #5 promotion ⊣ demotion) as the sanctioned site of emergence. Dispatch a lens on this before promoting `open_questions` past additive.
- **OQ-6 (Q-side persistence).** Symmetry 6's Q-side is open (`ReflectionTower.lean` proves only K-side). **Recommendation:** leave open; do not claim two-sided persistence.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `../../../README.md` | `cites` | Root DomainSpec framing (documentation as the meaning-side of the system); this discovery generalizes it into the meta-repo's two-level schema/instance representation. |
| `../../ontology-conventions.md` | `cites` | The live schema graph (node_types, the 22-edge catalog, endpoint constraints, directionality) this representation reuses and extends rather than replaces. |
| `../../../DRIFT-CONVERGENCE.md` | `cites` | Drift is already a core concern; this discovery names the missing CI gate as the day-zero move against it. |
| `../knowledge-calibration-geometry/discovery.md` | `cites` | Sibling product-framing discovery; shares the residue/drift posture and the people/spec/system triangle. |
| `/Users/victorboscaro/domainspec-theorem/research/audits/component-cartography/synthesis.md` | `derives-from` | The archetypes, the three forks, the shared-base/per-node_type verdict, and the two-gate (M6) finding are sourced here. |
| `/Users/victorboscaro/domainspec-theorem/research/audits/symmetry-mesh/synthesis.md` | `derives-from` | The per-symmetry verified status table (5/8 sorry-free, 0/10 enforced, bootstrap-tower not built, M2 ceiling) is sourced here. |
| `/Users/victorboscaro/domainspec-theorem/research/audits/representation-design/agents/01-schema-graph-designer.md` | `derives-from` | The schema-graph representation, edge-rules format, base-invariant table, and Fork A recommendation are sourced here. |
| `/Users/victorboscaro/domainspec-theorem/research/audits/representation-design/agents/02-instance-creation-plan.md` | `derives-from` | The first-slice instance manifest and the gate-wired modification plan (M1/M2/gate) are sourced here. |
| `/Users/victorboscaro/domainspec-theorem/research/audits/representation-design/agents/03-location-decision.md` | `derives-from` | The hybrid/staged location verdict and the gate-as-blocking-precondition are sourced here. |
| `/Users/victorboscaro/domainspec-theorem/lean-formalization/SchemaInstance.lean` | `cites` | Schema/instance fibration — the formal warrant for the two-level graph and for M6. |
| `/Users/victorboscaro/domainspec-theorem/docs/distilled/two-layer-framework/domainspec-two-layer-framework.md` | `cites` | Canonical prose treatment of the schema/instance residue, Skolem nulls (Σ_Δ), and the M2/M6 status this discovery leans on — cited rather than rediscovered. |
| `vault/discovery/system-modeling-partition-architecture/discovery.md` | `derives` | The partition-architecture discovery reuses this discovery's one-schema / two-gate / typed-residue / gate-first posture, adding the ownership organizing axis and the `system_design_knowledge` partition on top. |
