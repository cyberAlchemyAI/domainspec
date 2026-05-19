---
tags: [vault, lens-findings, graph-as-residue-attractor]
node_type: findings
is_session: false
layer: ontology
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
---

# Findings — Gödel / Tarski / Löb (Corroborated)

## Objective

Corroborate the Gödel/Tarski/Löb half of lens 03 with primary/secondary sources actually retrieved, and re-derive what each forbids the graded knowledge graph from doing.

## Findings

### Gödel / Tarski / Löb — corroborated

This lens re-states the four classical limitative results with sources actually fetched, then applies each to the graded knowledge graph (premise → constitution → axiom with a condensation operator over a schema/instance presheaf). Lawvere and Yanofsky are deliberately omitted; a sibling lens covers them.

## 1. Gödel's First Incompleteness (G1)

**Statement (Rosser-strengthened form, verbatim from SEP):**

> "Let F be consistent formalized system which contains Q. Then there is a sentence R_F of the language of F such that neither R_F nor ¬R_F is provable in F."

**Conditions (per SEP):** (i) consistency of F (Rosser's 1936 improvement removes the need for ω-consistency that Gödel originally used); (ii) F contains Robinson Arithmetic Q; (iii) the proof relation is effectively decidable (axioms r.e.). Without (ii), true arithmetic is a trivial counterexample; without (iii), Th(ℕ) is again a counterexample.

**Source fetched:** https://plato.stanford.edu/entries/goedel-incompleteness/ (fetched-and-read).

**Applied to the graph.** Treat the graph as a formal system whose axioms are the union of all `axiom/*.md` files plus the constitutions promoted to axiom status, with proof = a condensation-derivation chain. If the graph (a) is consistent, (b) effectively presents its rule set (you can enumerate constitutions/axioms by a tool pass), and (c) encodes its own promotion rules (the schema talks about the instance, including itself), then there is a graph-sentence of the form

> *G_𝒢 ≡ "the constitution with hash h is never promoted in this graph"*

that the graph's own derivation rules can neither establish nor refute. G1 forbids any claim of *internal decidability of well-formedness*: there exist concrete predicates over node-states that are true in the standard model of the graph but unsettleable by the graph's own promotion calculus.

## 2. Gödel's Second Incompleteness (G2)

**Statement (verbatim from SEP):**

> "For any consistent system F within which a certain amount of elementary arithmetic can be carried out, the consistency of F cannot be proved in F itself."

**Stricter conditions (SEP):** F must contain at least Primitive Recursive Arithmetic (PRA), or Q with sufficient induction; and the provability predicate Prov_F(x) must satisfy the Hilbert–Bernays–Löb derivability conditions D1–D3 (see §4 below).

**Intensionality / Rosser caveat (verbatim from SEP):**

> "Unlike in the first theorem, not just any, merely extensionally adequate provability predicate works for the formalization of the consistency claim."

Rosser-style or otherwise pathological predicates Prov*(x) can evade G2: "one can prove the 'consistency' of F in F, if consistency is expressed in terms of Rosser's provability predicate." Feferman 1960 sidesteps the case-by-case D1–D3 verification by requiring axioms to be presented by a Σ⁰₁ formula and using standard first-order semantics.

**Source fetched:** https://plato.stanford.edu/entries/goedel-incompleteness/ (fetched-and-read).

**Applied to the graph.** Let Con_𝒢 be the natural internal statement "no chain of promotions in this graph ever derives ⊥" (where ⊥ is a designated contradiction node, e.g. a premise and its negation both at axiom stage). G2 forbids the graph from proving Con_𝒢 *using only its own promotion rules*, **provided** the encoding of "is promoted" is intensionally faithful (closed under modus ponens on derivations, internal necessitation, etc.). The intensional caveat matters operationally: a clever choice of `Prov_𝒢` that, e.g., re-orders the enumeration of derivations à la Rosser could artificially "prove" its own consistency without contradicting G2 — but only because that predicate no longer means what we want it to mean. **The honest claim "this vault is well-formed under its own constitutions" is not an internal theorem.**

## 3. Tarski's undefinability of truth (1936)

**Statement (verbatim from Wikipedia, which reproduces the standard form):**

> "Let (L, 𝒩) be any interpreted formal language that includes negation and has a Gödel numbering g(φ) satisfying the diagonal lemma, i.e. for every L-formula B(x) (with one free variable x) there is a sentence A such that A ⟺ B(g(A)) holds in 𝒩."
>
> "Then there is no L-formula True(n) with the following property: for every L-sentence A, the formula True(g(A)) ⟺ A is true in 𝒩."

**SEP corroboration (verbatim):**

> "As Tarski himself emphasised, Convention T rapidly leads to the liar paradox if the language L has enough resources to talk about its own semantics."
>
> "Tarski's own conclusion was that a truth definition for a language L has to be given in a metalanguage which is essentially stronger than L."

**Sources fetched:**
- https://en.wikipedia.org/wiki/Tarski%27s_undefinability_theorem (fetched-and-read; secondary; carries the formal statement that SEP omits)
- https://plato.stanford.edu/entries/tarski-truth/ (fetched-and-read; does NOT contain the verbatim 1936 theorem — it focuses on Tarski's *positive* truth-definition program. The undefinability result is referenced only via Convention-T + liar remarks.)

**Applied to the graph.** There is **no constitution node** `truth(x).md` in the graph whose semantics, expressed in the graph's own schema language, satisfies

> for every graph-sentence φ, the graph promotes `truth(⌜φ⌝)` iff φ holds in the graph's standard model.

If you try to build such a universal validity predicate as a constitution, the diagonal lemma applied to ¬truth(x) produces a liar-constitution λ ≡ "this constitution is not true", and the graph contradicts itself. Operationally: any universal `valid.md` or `well_formed.md` that quantifies over *all* node types including its own is forbidden. Validity predicates must be **stratified** — one constitution per layer, never closed under self-application.

## 4. Löb's theorem (1955)

**Statement (verbatim from Wikipedia):**

> "for any formula P, if it is provable in PA that 'if P is provable in PA then P is true', then P is provable in PA."

Formally: if PA ⊢ Prov(⌜P⌝) → P, then PA ⊢ P. In provability-logic form (nLab, verbatim): **□(□P → P) → □P**.

**Hilbert–Bernays(–Löb) derivability conditions (verbatim from SEP):**

> (D1) F ⊢ A ⇒ F ⊢ Prov_F(⌜A⌝)        — necessitation
> (D2) F ⊢ Prov_F(⌜A⌝) → Prov_F(⌜Prov_F(⌜A⌝)⌝)    — internal necessitation
> (D3) F ⊢ Prov_F(⌜A⌝) ∧ Prov_F(⌜A → B⌝) → Prov_F(⌜B⌝)  — closure under modus ponens

**G2 as the case P = ⊥ (verbatim from Wikipedia):**

> "Gödel's second incompleteness theorem follows from Löb's theorem by substituting the false statement ⊥ for P."

Setting P = ⊥ in □(□P → P) → □P gives □(□⊥ → ⊥) → □⊥, i.e. □¬Con → □⊥; contrapositively, if F is consistent (¬□⊥) then F ⊬ ¬□⊥, which is Con_F.

**Original citation:** Löb, M. (1955), "Solution of a Problem of Leon Henkin", *Journal of Symbolic Logic* 20(2): 115–118.

**Sources fetched:**
- https://ncatlab.org/nlab/show/L%C3%B6b%27s+theorem (fetched-and-read; gives the modal form but not the historical conditions)
- https://en.wikipedia.org/wiki/L%C3%B6b%27s_theorem (fetched-and-read; gives the derivability conditions in the necessitation/distribution form and the 1955 citation)
- D1–D3 wording re-confirmed at https://plato.stanford.edu/entries/goedel-incompleteness/ (already fetched in §1).

**Applied to the graph.** A "reflection constitution" of the form

> reflect_φ.md ≡ "if the graph promotes φ to axiom, then φ"

is provable inside the graph only when φ is already provable. Therefore: **reflection axioms add no new theorems unless they cross from outside.** Concretely the system cannot bootstrap its own trust by adding a single `meta-soundness.md` constitution — Löb says that file is either redundant (φ already promotable) or false-when-promoted (the antecedent's promotion is empty). Trust must be paid for either by (a) genuinely new axioms (climbing the reflection tower), or (b) an external authority that asserts soundness from a strictly stronger meta-graph. This is the formal content of "reflection is not free" in the structure-theorem boundary clauses.

---

## Verification ledger

| URL | Status | Notes |
|---|---|---|
| https://plato.stanford.edu/entries/goedel-incompleteness/ | fetched-and-read | Source for G1 (Rosser form), G2, D1–D3, intensional/Rosser caveat, Feferman 1960. |
| https://plato.stanford.edu/entries/tarski-truth/ | fetched-and-read | Does **not** contain the verbatim 1936 undefinability statement; only Convention-T + liar remarks. Flagged as a negative. |
| https://en.wikipedia.org/wiki/Tarski%27s_undefinability_theorem | fetched-and-read | Used for the verbatim formal statement of undefinability (secondary source). |
| https://ncatlab.org/nlab/show/L%C3%B6b%27s+theorem | fetched-and-read | Gives the modal-logic form □(□P→P)→□P and the G2-as-P=⊥ reduction; lacks the 1955 derivability conditions. |
| https://en.wikipedia.org/wiki/L%C3%B6b%27s_theorem | fetched-and-read | Source for the natural-language Löb statement, HBL conditions in necessitation/distribution form, and the Löb 1955 *JSL* citation. |
| Gödel 1931, *Über formal unentscheidbare Sätze…* (primary) | not-attempted | Not on a stable open URL I trust; the SEP entry is the standard secondary used in lieu. |
| Tarski 1936, *Der Wahrheitsbegriff in den formalisierten Sprachen* (primary) | not-attempted | Same reason; Wikipedia + SEP cover the formal content. |
| Löb 1955, *JSL* 20(2):115–118 (primary) | not-attempted | Paywalled at JSTOR/Cambridge; citation captured from Wikipedia. |
| Feferman 1960, *Arithmetization of metamathematics in a general setting*, *Fund. Math.* 49 | not-attempted | Cited via SEP only; not fetched. |

## Honest negatives

1. **No primary papers fetched.** Gödel 1931, Tarski 1936, Löb 1955, and Feferman 1960 are all cited through secondary sources (SEP, Wikipedia, nLab). Every formal statement above is reproduced from a fetched secondary source, not from the original.
2. **The SEP Tarski entry does not contain the undefinability theorem.** I relied on Wikipedia's formulation. This is the weakest source-chain in the lens; if a single claim should be independently re-checked against a textbook (Boolos–Burgess–Jeffrey ch. 17, or Smith *Gödel Without Tears* ch. 21), it is the Tarski statement.
3. **nLab's Löb page is thin.** It carries the modal form but not the derivability conditions or the historical citation; Wikipedia filled both gaps.
4. **Intensionality details for G2 are summarised, not proved.** The Rosser-predicate evasion and Feferman's Σ⁰₁ resolution are quoted from SEP without independent corroboration. This is the second-weakest link.

## What this changes vs. lens 03

Lens 03 stated the four results from training-time recall and (by its own admission) cited but did not fetch sources. This lens reproduces the same theorems with fetched URLs, finds **no material correction** to lens 03's formal statements, and confirms the four "applied to the graph" boundary clauses:

- G1 → some `G_𝒢` of the form "constitution h is never promoted" is internally undecidable.
- G2 → "this vault is well-formed under its own constitutions" is not an internal theorem (modulo intensional faithfulness of `Prov_𝒢`).
- Tarski → no universal `truth(x)` constitution; validity must be stratified.
- Löb → a single `meta-soundness.md` adds nothing; reflection is paid for in axioms, not schemas.

Lens 03 may now be treated as load-bearing for the Gödel/Tarski/Löb half. The Lawvere/Yanofsky half awaits the sibling re-dispatch.

## Caveats

- No primary papers fetched (Gödel 1931, Tarski 1936, Löb 1955, Feferman 1960); every formal statement is reproduced from a fetched secondary source (SEP, Wikipedia, nLab).
- The SEP Tarski entry does not contain the undefinability theorem; Wikipedia's formulation was relied on — weakest source-chain in the lens.
- nLab's Löb page is thin; Wikipedia filled in the historical derivability conditions.
- Intensionality details for G2 (Rosser evasion, Feferman Σ⁰₁ resolution) are summarised, not independently corroborated.

## Connections

- `derives-from` → `../../research/research.md`
- `corroborates` → `../03-godel-lawvere-limits/findings.md`
- `cited-by` → `../../discovery.md`
