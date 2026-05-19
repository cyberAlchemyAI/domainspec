---
tags: [vault, lens, theorem, two-layer, residue, kan-extension, t0-prime, llm-coercion]
node_type: lens
is_session: false
layer: ontology
nature: research-synthesis
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
---

# Lens 02 — Theorem Anchors (domainspec-theorem)

## Mission

Extract from `/Users/victorboscaro/domainspec-theorem/` the formal grounds that anchor (or refuse) the three-sibling proposal: when Δ is fractal vs has residue, residue as complement of fractal compilation, structural conditions making Δ checkable, LLM-forcing prose, two-layer load-bearing-ness, compilation admissibility (T0'), and whether promotion is a separate operation from compilation.

## §1. Two-Layer Independence: Fractality is Not One-Dimensional

**Source:** `docs/domainspec-two-layer-framework.md` §2.3, lines 119–126

Schema-level injectivity and faithfulness do **not** force instance-level fidelity. The four-object counterexample proves M6 Strong false.

> Schema-side injectivity and faithfulness do **not** force $\eta^{\mathrm{ins}}_I$ to be iso for every $I$. A four-object counterexample (see §3.6) is enough: $\mathcal{L}_1$ discrete on two objects, $\mathcal{L}_2$ adds one morphism between them, $\Delta$ the inclusion, $I$ the constant copresheaf. $\Sigma_\Delta$ populates the comma category with a Skolem-null witness the schema cannot constrain, and the unit fails to be iso. **The two layers are permanently independent. The two budgets do not reduce** — and the audit must price both.

**Load-bearing:** `/research` cannot be simply "pre-L₁"; residue has genuine categorical structure independent at two levels.

## §2. Δ as Left Kan Extension: Cocontinuity Without Axiom

**Source:** `lean-formalization/DomainSpec.lean` lines 59–68

The compiler is defined as a **left Kan extension** at schema level. Cocontinuity is a **theorem** (follows from universal property of Kan extension). Makes Δ mechanically tractable.

```lean
variable (Δ : (t : T) → (L1.obj t) ⥤ (L2.obj t))
variable (α : (t : T) → Δ_base t ⟶ I t ⋙ Δ t)
variable [∀ t, (Δ t).IsLeftKanExtension (α t)]
```

**Load-bearing:** Kan extension is the **checkable path between code artifacts and governing spec** — computable, not searchable.

## §3. T0'_C1, T0'_C2, T0'_C3: Compilation Admissibility Conditions

**Source:** `lean-formalization/DomainSpec.lean` lines 123–200; `docs/paper.md` §4 lines 102–124

Three formal obligations gate when Δ is **allowed to fire**:
- **C1 (determinism):** functoriality alone; one-line proof.
- **C2 (image validity):** reflexivity of EdgeLaw — every domain morphism's source and target types satisfy the edge law. L₁-level; requires τ (typing functor).
- **C3 (entropy bound):** per-step uncertainty capped by local graph degree via discrete Gibbs inequality.

> C1: determinism from functoriality (no sorry). `T0'_C1` only depends on `Δ` and `L1`... `theorem T0'_C1 (t : T) (g g' : L1.obj t) (h : g = g') : (Δ t).obj g = (Δ t).obj g' := congrArg (Δ t).obj h`

**Load-bearing:** These are the **pin-stamping conditions** — must hold on L₁ *before* compilation is legitimate. Not assumptions on Δ, but **admissibility gates**.

## §4. Residue as the Complement of Fractal Compilation

**Source:** `docs/reflection-tower.md` §"The fractal case: when the tower collapses immediately" lines 205–236

A **fractal** is a translation that loses nothing (unit iso on both layers). Everything else has **positive residue**. The tower is infinite because no translation can be self-auditing.

> A [fractal](../GLOSSARY.md#fractal-functor) is, intuitively, a translation that loses nothing — the translation from whole to part recovers the whole exactly, with no residue on either layer... Fractality is the degenerate case, not the common case. Real systems — compilers, simulations, categorizations, audit pipelines, knowledge-curation workflows — are not fractal. They have positive residue at the first level and at every subsequent level. **The tower is genuinely tall.** ... Non-fractal = the tower keeps going.

**Load-bearing:** `/research` is **the residue holding pen** — where artifacts *sit* while earning structural identity to graduate into L₁. Residue doesn't stay there forever; it **promotes** when sufficient structure accretes.

## §5. Faithful Promotion vs. Static Residue

**Source:** `docs/reflection-tower.md` §"What the structure theorem buys" lines 239–278

The **structure theorem** has two clauses: (i) per-level independence (same fractal/instance-split at every level), and (ii) **faithful promotion** — each level injects into the next without collapsing prior distinctions. The persistence lemma would amortize this.

> Clause (ii) holds by construction (see the framework doc). Clause (i) hinges on a single lemma — the **persistence lemma** — which says the four-object configuration that drives the level-0 independence result survives being lifted to higher levels... If the persistence lemma lands, the payoff is amortization: one Lean proof at the base case plus one persistence proof would discharge clause (i) at every level forever.

**Load-bearing:** **Promotion is a separate operation from compilation.** Residue becoming structure is not the same as structured-object being compiled. Framework treats residue as **dynamic** — it graduates — not static.

## §6. Categorical Extraction Schema: Operationalizing Fractal Checking

**Source:** `docs/categorical-extraction-schema.md` §"Maps to the theorem repo" lines 176–191

Extraction pipeline produces **three JSON files** (`L1.json`, `L2.json`, `delta.json`) that operationalize fractal diagnosis. The `diagnostics` block directly maps to theorem predicates:

- `objects_unmapped` → injectivity failure
- `objects_orphan_l2` → representability failure (M2)
- `morphisms_unwitnessed` → faithfulness failure
- **Compilation is legitimate only if these blocks are empty.**

> The `diagnostics` block is exactly the shape Tier 2 expects: `objects_unmapped` ≠ ∅ → counterexample to **injectivity-on-objects**; `objects_orphan_l2` ≠ ∅ → counterexample to **representability** (M2); `objects_multi_mapped` ≠ ∅ → counterexample to **injectivity**; `morphisms_unwitnessed` ≠ ∅ → counterexample to **faithfulness**.

**Load-bearing:** This is the **computable interface** between spec and code. An LLM agent can check these diagnostics against compiled output *deterministically*.

## §7. LLM-Forcing via Structural Mirroring

**Source:** `docs/paper.md` §1 "Introduction" + §2.4 "Why this matters for AI code generation" lines 22–137

The two-layer regime forces **two distinct failure modes to separate**. An LLM cannot mix them because the framework makes them checkable at different levels.

> An LLM-driven code generator ingests a domain description and emits code... From the outside, its failures all look the same: the output is "wrong." **The two-layer framework says they are not the same, and that two distinct failure modes coexist with different causes and different fixes.** ... The two-layer regime forces this apart: **these are different audits, and one cannot replace the other.** The framework also names a subtler regularity. Whenever the spec under-determines a field — a foreign key it did not pin, an enum case it did not enumerate, a join cardinality it left implicit — the generator is forced into a $\Sigma_\Delta$-versus-$\Pi_\Delta$ choice.

**Load-bearing:** This is the **coercion mechanism** — structural mirroring between `/domain_knowledge` and `/implementation` forces the LLM into a computable path where it cannot silently satisfy one layer while losing the other.

## §8. Two-Layer is Load-Bearing; Residue is Not a Third Layer

**Source:** `docs/reflection-tower.md` §"What this looks like formally" lines 281–300 + `docs/domainspec-two-layer-framework.md` §2.1 lines 69–91

The framework admits only **two structural layers** (L₁ schema, L₂ instance). The L₁ side gets enlarged at each reflection-tower level via **free extension** `L₁ⁿ⁺¹ := L₁ⁿ ⊕ Carrier(μₙ)`, but this is **vertical** (tower levels), not horizontal (new layer). The L₂ side is **implicit**, not constructed. Residue sits **beside** L₁/L₂, not as a third peer.

> The L₁ side gets enlarged: `L₁¹ := L₁⁰ ⊕ Carrier(μ₀)`, where `Carrier(μ₀)` packages level-0's residue as new primitive vocabulary... The L₂ side is *not* given an analogous free-extension construction in the framework doc. Only the L₁ side is spelled out explicitly... the L₂ side at each level is implicit and not formally built.

**Load-bearing:** `/research` is a **sibling-not-peer** to L₁/L₂. It's the holding pen for residue before it earns entry into L₁'s free-extended structure. The theorem forbids a third horizontal layer; only vertical growth (reflection tower) is permitted.

## Hand-off

All eight findings support the thesis that **structural mirroring of folder trees (`apps/X/features/Y` grammar mirrored in both L₁ and L₂) gives an LLM agent a computable path** because: (1) fractal hierarchy is two-dimensional (schema × instance), forcing two independent audits; (2) Δ is a Kan extension (computable, not searchable); (3) three admissibility conditions (C1, C2, C3) gate when compilation is legitimate; (4) residue is structural (categorical object) not metaphorical — sits in `/research` sibling; (5) promotion (residue → L₁) is a separate operation from compilation (L₁ → L₂); (6) categorical extraction schema operationalizes all this as JSON diagnostics; (7) two-layer is enforced by theorem.
