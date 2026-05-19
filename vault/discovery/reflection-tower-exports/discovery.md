---
tags: [vault, discovery, ontology, reflection-tower, governance, audit, traceability]
node_type: discovery
is_session: false
layer: ontology, architecture
nature: explanatory, reference
status: draft
veracidade: medium
convicção: medium
version: 0.1.0
last_updated: 2026-05-19
---

# Reflection-Tower Exports: Discovery

> The sibling Lean formalization of the reflection tower (`domainspec-theorem/lean-formalization/ReflectionTowerAnchored.lean`) contains several pieces of categorical machinery that have **no current DomainSpec counterpart** even though DomainSpec is the source artifact. This discovery names four governance / audit tools the Lean construction makes available, scopes what each would look like as a vault discipline, and records what is open vs. settled.

---

## Objective

Codify the design space for **exporting unaccounted Lean tower machinery back into DomainSpec governance**. The companion stocktake in [`conceptual/reflection-tower-in-domainspec.md`](../../conceptual/reflection-tower-in-domainspec.md) establishes where the tower already lives in this vault. This discovery looks at what is in the Lean files but **not** in the vault — and asks which of those pieces should be promoted from "categorical fact" to "vault discipline".

End state: four scoped tool proposals (T-1 through T-4), each with sufficient detail to ground a future implementation-plan node. Decisions taken here are **draft**; promotion to `exploratory` requires at least one of the tools surviving an adversarial review or being piloted on a real residue.

---

## 1. Business Context

### Why now

The reflection tower's Lean K-only construction landed sorry-free on 2026-05-18 (pass 2, `ReflectionTowerAnchored.lean`). With the substantive bundle in place, the categorical content has stabilized enough that the gap between what the math proves and what DomainSpec enforces is now legible. Two facts about the gap are worth surfacing:

1. **DomainSpec currently enforces socially what the tower enforces categorically.** No-retroactive-rewrite, faithfulness of promotion, anchor-witness presence — these are review-policy claims in the vault and definitional facts in the Lean. The gap is not "the tower has more theorems"; it is "the tower could be mechanized into checks the vault currently only inspects by hand."
2. **The Lean has machinery DomainSpec has no counterpart for.** Pieces like `P_reflectsIso` (reflects-iso as distinct from faithfulness), the definitional edge-locality of the `Hom` inductive, and the embedding `embedL1` that surfaces the M6-refuting witness at every level — none of these have a vault-side analog. The unaccounted machinery is the menu of candidate tools.

### What's broken (in the current design space)

- **No mechanical morphism-origin check.** The vault's "no retroactive lower-layer rewrite" rule (recorded in [`discovery/cross-tree-mirroring-for-llm-coercion/discovery.md`](../cross-tree-mirroring-for-llm-coercion/discovery.md) as DRIFT-CONVERGENCE) is enforced by review of `derives-from` edges, not by a check on any node-or-edge property. Violations are caught when noticed, not at write time.
- **Faithfulness is the only promotion guarantee currently named.** The vault treats promotion-preserves-information as the bar. The Lean's `P_reflectsIso` is strictly stronger — it forbids collapsing distinct-up-to-iso objects under promotion — and the vault has no name for the failure mode this would catch.
- **The K-side / Q-side asymmetry is silent in DomainSpec.** Inbound verification (residue → knowledge) and outbound generation (spec → artifact) currently run under one promotion discipline. The Lean construction is K-only by deliberate choice, and the asymmetry it forces is informative: the two directions should have different audit stances. DomainSpec does not currently mark them as different.
- **Obstruction witnesses are reasoned about, not displayed.** When the framework predicts a residue (e.g., R1–R4 in [`bets/B-001-graph-as-residue-attractor-load-bearing.md`](../../bets/B-001-graph-as-residue-attractor-load-bearing.md)), the witness is named in prose. The Lean's `embedL1` produces a minimal refuting subgraph at every tower level as a categorical object — a concrete two-element configuration with no morphism between them. The vault has no surface that renders such a witness.

### What stays the same

- **The tower itself is not under revision.** This discovery is downstream of the tower; it does not propose changes to the tower's definition. The tower's definition lives in the Lean repo and in [`conceptual/reflection-tower-in-domainspec.md`](../../conceptual/reflection-tower-in-domainspec.md).
- **No new node types or edge types.** The proposals here are tools / checks / displays operating on the existing schema. Schema evolution belongs in `ontology-conventions.md`, not in this discovery.
- **No new folders.** Per [`constitution/vault-folder-structure-constitution.md`](../../constitution/vault-folder-structure-constitution.md), tower structure is not encoded in directory names. This discovery does not propose enumerated folders.
- **No Lean-side work is requested here.** The Lean construction is treated as input. Open Lean work (Q-side dual, per-level `Δ_n`, presheaf-completion equivalence) is acknowledged in §5 but not driven from this discovery.

---

## 2. Core Concepts

### C-1. Unaccounted Lean machinery is a candidate menu for vault tools

The agent-memory entry `project_reflection_tower_provenance.md` records eight categorical-↔-vault correspondences (`HasTwoObjectsNoMorphism`, `P` faithful, `no_new_morphisms_between_L`, `anchor`, `persistence_lemma`, `disjointUnion`, `viaAnchored`, `Tower`). A walk through the Lean files surfaces ~13 declarations that **do not appear** in that list. Not all of them are worth exporting — many are construction scaffolding — but four cluster into governance / audit tools with clear vault analogs. Those four are T-1 through T-4 below.

### C-2. Mechanization > review for invariants the tower makes definitional

When the Lean construction makes an invariant **definitional** (as in `Hom(inl X, inl Y) = X ⟶_L Y` — the type of cross-layer morphisms is fixed by the type former, not enforced by a side condition), the vault can encode the same invariant as a mechanical check rather than a review policy. The check fails on writes that would violate the invariant, rather than catching violations after the fact. This is the operational shape every export tool takes.

### C-3. K-side and Q-side are not the same audit problem

The K-only construction in `ReflectionTowerAnchored.lean` reflects a deliberate categorical choice: anchors point from the new level back to the old (`anchor : new_obj → old_obj`). The Q-side dual would anchor in the other direction and carry different side conditions. DomainSpec runs both directions operationally — typed traceability is K-shaped, governance amendment is Q-shaped — but does not mark the distinction. A vault that does mark it can give them different audit stances.

### C-4. The framework already has a witness type; it does not have a witness display

`embedL1` extracts a minimal refuting subgraph at every tower level (two disconnected objects in `L1 = Discrete (ULift (Fin 2))`). This is a concrete object, not a metaphor. The vault names obstructions in prose; it does not surface them as objects the reader can inspect. The tool gap is **render**, not **detect**.

---

## 3. Decisions Taken

The four tools below are proposed at `status: draft`. Each is scoped enough to ground an implementation-plan node but not to commit the vault to a particular implementation. Promotion to `exploratory` requires either a pilot or an adversarial review.

### T-1. Morphism-origin certificate on cross-layer edges

**Statement.** Every edge in the vault whose source and target sit on different "layers" (in the citation-chain sense: discovery → premise → constitution → axiom) carries an origin certificate naming **which layer it originated in**. Edges that retroactively introduce a relation between two lower-layer nodes — i.e., that look like they would have been visible at the lower layer but weren't — are flagged at write time.

**Lean source.** `WithAnchor.Hom` inductive in [`ReflectionTowerAnchored.lean`](../../../../../domainspec-theorem/lean-formalization/ReflectionTowerAnchored.lean). The `Hom(inl X, inl Y) = X ⟶_L Y` clause makes edge-locality definitional: there is no way to introduce a morphism between two `L`-objects through the extension.

**Why this matters.** The DRIFT-CONVERGENCE premise is currently policy. T-1 makes it a check.

**Scope.** Frontmatter field on the edge entry, populated by the same authoring step that writes the edge. Validation lives in the schema check, not in a separate audit.

### T-2. Reflects-iso check on promotion edges

**Statement.** When a node is promoted (a `derives-from` edge is added whose target sits at a higher layer than its source), the check verifies that distinct-up-to-iso lower-level nodes do not collapse to the same higher-level node. Failure is a governance violation, not a quality complaint.

**Lean source.** `P_reflectsIso` field of `FreeExtension` and the derived `instP_ReflectsIso` instance.

**Why this matters.** The vault currently names "promotion preserves information" (faithfulness) as the bar. Reflects-iso is stricter and catches a different failure: two genuinely distinct lower-layer commitments being merged on the way up. The R1–R4 residue closures would benefit from this check — each closure should not silently dissolve a distinction the prior level was carrying.

**Scope.** Triggered on promotion edges only. Requires an equivalence-class oracle on the lower layer; for now, this is a review prompt rather than an automated equality check.

### T-3. K/Q audit-asymmetry marker on traceability edges

**Statement.** Every traceability edge carries a `direction: K | Q` marker. K-edges (residue → knowledge, anchor-shaped) and Q-edges (spec → artifact, quotient-shaped) are audited under different rules. K-edges require a witness on the lower-layer side (the thing being anchored). Q-edges require a side condition forbidding K→Q paths in the same chain.

**Lean source.** The K-only `AnchoredCarrier` and the explicit absence of `inl → inr` edges in `WithAnchor.Hom`.

**Why this matters.** Without this distinction, the vault treats inbound verification and outbound generation as the same promotion problem. They are not. The Lean asymmetry is informative; DomainSpec should mirror it.

**Scope.** New frontmatter field on traceability edges only. Default is `K`; `Q` requires explicit assignment. Mixed K/Q chains are flagged.

### T-4. Obstruction-witness display

**Statement.** When a residue is predicted or a constitutional gap is named, the vault surfaces a **minimal refuting subgraph** as a concrete object: the smallest set of nodes-and-edges (or absent edges) that exhibits the obstruction. The display is a vault artifact, not a prose description.

**Lean source.** `embedL1` and `refutes_m6_strong`. The Lean already constructs the witness at every tower level; the vault tool surfaces the same object on the vault side.

**Why this matters.** The R1–R4 predictions in [`bets/B-001-graph-as-residue-attractor-load-bearing.md`](../../bets/B-001-graph-as-residue-attractor-load-bearing.md) named four residues. Each was closed by writing a constitution. There is currently no artifact between the prediction and the closure that shows the obstruction **as an object**. T-4 fills that gap.

**Scope.** A new minor node type or a structured section in residue nodes — to be decided when the first witness is rendered. Implementation deferred to a follow-up plan.

---

## 4. Alternatives Considered

### A-1. Split the four tools across multiple discoveries

Considered and rejected. The four tools all derive from the same observation (unaccounted Lean machinery → DomainSpec governance tools). Splitting would fragment the dependency on the Lean source and force four discoveries to track the Lean repo's evolution independently. One discovery, four scoped sections.

### A-2. Wait for the Q-side Lean construction before proposing T-3

Considered and rejected. T-3 is informed by the K-only asymmetry — by what the Lean **chose not to do**. The Q-side construction will sharpen T-3 but it is not a blocker. If the Q-side lands and contradicts the T-3 marker scheme, this discovery is amended.

### A-3. Encode all four tools as a single composite check

Considered and rejected. The four tools fire at different write events: T-1 on cross-layer edges, T-2 on promotion edges, T-3 on traceability edges, T-4 on residue nodes. Bundling them into one check would obscure when each fires and conflate distinct failure modes. Keep them separate.

### A-4. Promote one of T-1–T-4 to a constitution immediately

Considered and rejected. None of the four has been piloted. The R1–R4 closures earned constitution status by closing predicted gaps; T-1–T-4 are predictions of gaps the vault has not yet noticed. The shape of a constitution is "we've been doing this; let's write it down"; the shape of T-1–T-4 is "we haven't been doing this; let's see if we should." Different epistemic status, different node type.

---

## 5. Open Questions

### OQ-1. Which of T-1–T-4 should be piloted first?

T-1 (morphism-origin certificate) is the lowest-cost: it adds a frontmatter field and a schema check. T-4 (obstruction-witness display) is the highest-leverage: it gives the framework a way to **show** what it currently can only **say**. Default proposal: T-1 first (cheap mechanical win), T-4 second (load-bearing for the residue-bet structure). T-2 and T-3 wait on T-1's lessons.

### OQ-2. Does T-2's reflects-iso check require a Lean-backed equivalence oracle, or is review enough?

The Lean has the check as a definitional fact; the vault would need either (a) a per-edge review prompt or (b) a structural equivalence oracle on the lower layer. Option (a) is implementable now but reduces T-2 to a review-policy upgrade. Option (b) is more faithful but requires machinery the vault does not have.

### OQ-3. Is T-3's K/Q marker subsumed by existing edge types?

The vault's edge catalog ([`ontology-conventions.md`](../../ontology-conventions.md) Appendix C) may already carry the K/Q distinction implicitly under different names (e.g., `derives-from` vs. `governs`). Audit needed before T-3 is implemented to avoid duplicating an existing axis.

### OQ-4. Should T-4's witness display be a new node type, a section in residue nodes, or an external artifact?

Three plausible homes: (a) a `witness` minor node type, (b) a required section in residue / gap nodes, (c) an external Mermaid / Quiver render referenced from the residue node. Each has different governance implications. Decision deferred until the first witness is rendered and the friction surfaces.

### OQ-5. Does the Q-side Lean construction, when built, force a fifth tool?

The Q-side dual is open Lean work (recorded in `project_reflection_tower.md`). If it introduces machinery without a current K-side analog (e.g., a coequalizer-shaped governance check), a T-5 may be warranted. Out of scope until the Q-side lands.

---

## 6. Connections

- `cites` → [`conceptual/reflection-tower-in-domainspec.md`](../../conceptual/reflection-tower-in-domainspec.md): companion stocktake; this discovery presupposes its inventory.
- `cites` → [`discovery/graph-as-residue-attractor/discovery.md`](../graph-as-residue-attractor/discovery.md): tower framing (D-1, OQ-1); R1–R4 residue structure that T-4 surfaces.
- `cites` → [`discovery/cross-tree-mirroring-for-llm-coercion/discovery.md`](../cross-tree-mirroring-for-llm-coercion/discovery.md): two-layer + vertical growth; DRIFT-CONVERGENCE premise that T-1 mechanizes.
- `derives-from` → `domainspec-theorem/lean-formalization/ReflectionTowerAnchored.lean`: source of T-1 (edge-locality), T-2 (reflects-iso), T-3 (K/Q asymmetry), T-4 (`embedL1`).
- `governed-by` → [`constitution/vault-folder-structure-constitution.md`](../../constitution/vault-folder-structure-constitution.md): no folder-encoded levels (constrains T-4's homing decision in OQ-4).
- `governed-by` → [`constitution/edge-acyclicity-constitution.md`](../../constitution/edge-acyclicity-constitution.md): well-foundedness of citation chains (presupposed by T-1).
