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

# Findings — Lawvere / Yanofsky (Corroborated)

## Objective

Re-dispatch of 03-godel-lawvere-limits with primary-source quotes for the Lawvere/Yanofsky half of the quintet.

## Findings

### Lawvere and Yanofsky (corroborated)

Companion to `03-godel-lawvere-limits.md` (model-recall) and `03b-godel-tarski-lob-corroborated.md` (sibling fetch on the logic side). Sources fetched: Lawvere 1969 TAC reprint PDF; Yanofsky 2003 arXiv PDF; nLab "Lawvere's fixed point theorem"; nLab "diagonal argument"; Wikipedia "Lawvere's fixed-point theorem". See ledger.

## 1. Lawvere's theorem — verbatim from the 1969 TAC reprint

Lawvere first defines the relevant surjectivity notions. A morphism $g: X \to Z$ is **point-surjective** iff "for every $z: 1 \to Z$ there exists $x: 1 \to X$ with $x.g = z$" (TAC p.4–5). He observes this "does not imply that $g$ is necessarily 'onto the whole of $Z$', since there may be few morphisms with domain 1." When $Z = Y^A$, an even weaker condition suffices:

> "$X \xrightarrow{g} Y^A$ will be called **weakly point-surjective** iff for every $f: A \to Y$ there is $x$ such that for every $a: 1 \to A$, $\langle a, x\rangle \bar g = a.f$." (TAC p.5)

The main theorem reads verbatim:

> **1.1. Theorem.** "In any cartesian closed category, if there exists an object $A$ and a weakly point-surjective morphism $A \xrightarrow{g} Y^A$ then $Y$ has the fixed point property." (TAC p.5)

Where $Y$ has the fixed point property iff "for every endomorphism $t: Y \to Y$ there is $y: 1 \to Y$ with $y.t = y$" (TAC p.5).

The contrapositive (the form everyone uses):

> **1.2. Corollary.** "If there exists $t: Y \to Y$ such that $yt \ne y$ for all $y: 1 \to Y$ then for no $A$ does there exist a point-surjective morphism $A \to Y^A$ (or even a weakly point-surjective morphism)." (TAC p.5)

Two precision points the recall version glossed:
- **CCC vs cartesian.** Lawvere proves the theorem for cartesian closed categories, but then notes (TAC p.5–6, §2) that "our theorem could have been stated and proved in any category with only finite products (no exponentiation) by simply phrasing the notion of (weak) point-surjectivity as a property of a morphism $A \times X \to Y$." His Remark 2.1 reduces the general case to CCC via Yoneda embedding into a presheaf category.
- **Weakly point-surjective, not point-surjective**, is the actual hypothesis. The weaker condition is what makes Cantor work with $Y = 2$.

URL: http://tac.mta.ca/tac/reprints/articles/15/tr15.pdf

## 2. Yanofsky's universal scheme — verbatim from arXiv math/0305282

Yanofsky restates Lawvere's theorem in $\mathbf{Set}$, avoiding categorical language, and proves two theorems whose contrapositives generate every classical paradox.

> **Theorem 1 (Cantor's Theorem).** "If $Y$ is a set and there exists a function $\alpha: Y \to Y$ without a fixed point (for all $y \in Y$, $\alpha(y) \ne y$), then for all sets $T$ and for all functions $f: T \times T \to Y$ there exists a function $g: T \to Y$ that is not representable by $f$, i.e. such that for all $t \in T$, $g(-) \ne f(-, t)$." (Yanofsky p.5)

The construction is the same diagonal: $g(t) := \alpha(f(t,t))$. If $g(-) = f(-, t_0)$ then $f(t_0, t_0) = \alpha(f(t_0, t_0))$, contradicting fixed-point-freeness.

The contrapositive is the **Diagonal Theorem**:

> **Theorem 3 (Diagonal Theorem).** "If $Y$ is a set and there exists a set $T$ and a function $f: T \times T \to Y$ such that all functions $g: T \to Y$ are representable by $f$ (there exists a $t \in T$ such that $g(-) = f(-, t)$), then all functions $\alpha: Y \to Y$ have a fixed point." (Yanofsky p.14)

The **universal scheme**: pick a "set of truth values" $Y$, a "domain of discourse" $T$, an "evaluation/representation" $f: T \times T \to Y$, and an "operation" $\alpha: Y \to Y$. Specializing:

- **Cantor** ($\mathbb{N} \not\sim \mathcal{P}(\mathbb{N})$): $Y = 2$, $\alpha =$ negation, $f$ the membership relation. (Yanofsky §3, p.10–11)
- **Russell**: $Y = 2$, $T$ = set-theoretical universe, $f$ = $\in$. The diagonal $g(x) = \neg(x \in x)$ is not represented by any set. (Yanofsky §3)
- **Gödel's First Incompleteness**: $Y$ = sentences/truth-values, $T$ = formulas with one free variable, $f$ = substitution, $\alpha$ = "is not provable". Diagonal Lemma (Theorem 4) gives a $C$ with $\vdash C \leftrightarrow \neg\mathrm{Prov}(\ulcorner C \urcorner)$. (Yanofsky §5, p.16–17)
- **Tarski**: same setup, $\alpha = \neg$, $f$ = "T(x) holds of x"; the diagonal sentence forces $\mathrm{True}$ to have a fixed point of negation, contradiction. (Yanofsky §5)
- **Halting problem / Rice**: $Y$ = partial-function behaviour, $T$ = computable functions, $f$ = universal evaluator $\Phi$, $\alpha$ = "differs". The diagonal computable function is not represented; or by Theorem 3 (Recursion), every total computable $h: \mathbb{N} \to \mathbb{N}$ has an $n_0$ with $\phi_{n_0} = \phi_{h(n_0)}$. (Yanofsky §6, p.20–22)

The unifying move: every "this sentence asserts its own X" construction is the composite $T \xrightarrow{\Delta} T \times T \xrightarrow{f} Y \xrightarrow{\alpha} Y$, and the question is whether it is representable by $f$.

URL: https://arxiv.org/pdf/math/0305282

## 3. nLab corroboration

The nLab "Lawvere's fixed point theorem" page states the theorem as: "In a cartesian closed category, if there is a point-surjective map $\phi: A \to B^A$, then every morphism $f: B \to B$ has a fixed point $s: 1 \to B$ (so that $fs = s$)." (URL: https://ncatlab.org/nlab/show/Lawvere%27s+fixed+point+theorem.) It uses **point-surjective** rather than weakly point-surjective — a slight strengthening of hypothesis vs Lawvere's original. The nLab "diagonal argument" page frames the unification as: "Diagonal arguments are typically arguments that place limitations on the extent that a set T can 'talk about' attributes of elements of T," with mechanism either $T \to Y^T$ or $T \times T \to Y$ — exactly Yanofsky's two forms. (URL: https://ncatlab.org/nlab/show/diagonal+argument.)

## 4. Application to the graded knowledge graph

The graded knowledge graph $\mathcal{G}$ has nodes (premise / constitution / axiom) and a condensation operator $C$. Identify:

- $A := \mathcal{G}$ (the graph viewed as object — concretely, the set of nodes / files).
- $Y := $ the truth-value object for constitutions. The naive choice is $Y = 2 = \{\text{valid}, \text{invalid}\}$.
- The **naming map** $\phi: \mathcal{G} \to Y^{\mathcal{G}}$ sends each constitution-node $c$ to the predicate "$c$ judges node $x$ as valid/invalid" — equivalently a $f: \mathcal{G} \times \mathcal{G} \to Y$ in Yanofsky's form.
- The endomorphism $\sigma: Y \to Y$ of interest is **negation** (every constitution can be negated: "$x$ is invalid").

Negation on $\{0,1\}$ has no fixed point. By Lawvere 1.2 / Yanofsky Theorem 1, no $\phi$ can be (weakly) point-surjective: there is a predicate over graph-states that no single constitution names. Concretely the diagonal predicate is $g(x) = \neg f(x, x)$, i.e. "$x$ judges itself invalid" — there is no constitution-node $c$ such that $c$'s judgment of every node $x$ matches "$x$ judges itself invalid." This is the formal obstruction to a flat universal `valid.md`.

The condition that bites is **(naive $Y$ = binary) + (closure under negation of constitutions) + (point-surjectivity of naming)**. Drop any one and Lawvere is silent. The graded-stage truth-object ($Y$ = {premise, constitution, axiom, ...}) is precisely the move "enlarge $Y$ so that the relevant $\sigma$ has fixed points" — at which point Lawvere becomes *constructive* (it asserts fixed points exist) rather than destructive (it forbids point-surjective naming).

## 5. The reflection-tower reformulation as the productive use

Lawvere 1.2 forces a choice: restrict naming, enlarge $Y$, or stratify. The honest move is **stratify**: let $\mathcal{G}_0$ be the base graph; let $\mathcal{G}_{n+1}$ contain a new constitution for each diagonal-witness predicate over $\mathcal{G}_n$ that was not nameable in $\mathcal{G}_n$. Each step adds exactly the unrepresentable $g$ from Yanofsky's Theorem 1 to the next level. The structure-theorem statement migrates:

- **Failed form.** "$\mathcal{G}$ is the unique fixed point of the condensation operator with a point-surjective naming map." — Refuted by Lawvere 1.2 whenever $Y$ admits a fixed-point-free $\sigma$.
- **Honest form.** "Within level $\mathcal{G}_n$ with truth-object $Y_n$ chosen so that all $\sigma$ arising from $\mathcal{G}_n$-constitutions have fixed points in $Y_n$, $\mathcal{G}_n$ is the within-level attractor; uniqueness across the tower $\mathcal{G}_0 \subset \mathcal{G}_1 \subset \dots$ is uniqueness of the *tower*, witnessed by ordinal analysis (Gentzen-style)."

Residue in the parent discovery's sense is exactly Yanofsky's $g$: a predicate constructed from the diagonal that is provably not represented by any current constitution. "Promote residue to a new constitution" is the reflection step. The transfinite limit is the canonical object — finite levels are necessarily incomplete (this is Lawvere, not a defect).

## 6. Honest negatives

- **Did not fetch**: Pavlovic 1996 ("On the structure of paradoxes") and Bauer 2014 ("An injection from $\mathbb{N}^\mathbb{N}$ to $\mathbb{N}$") — out of scope-time, not retrieved.
- **Lawvere TAC fetched via curl** (port-443 fetch via tool returned ECONNREFUSED twice; HTTP via curl succeeded). Quotes are from the curl-downloaded PDF; consistent with the page content the secondary sources reproduce.
- **Yanofsky** fetched as arXiv PDF (the abstract-only HTML page gave only the abstract; the PDF gave the theorem statements quoted above).
- **nLab "Lawvere's fixed point theorem"** quote uses *point-surjective* not *weakly point-surjective* — minor strengthening vs Lawvere 1969 original; flagged.
- **Wikipedia** content matches the nLab version; both omit the explicit definition of weakly point-surjective. The original definition above is from the Lawvere PDF directly.
- **Yanofsky page references** (p.5, p.14, etc.) are from the extracted text of arXiv:math/0305282v1; pagination may differ in the journal version (BSL 9.3, 362–386).

## 7. Verification ledger

| URL | Status | Notes |
|---|---|---|
| http://www.tac.mta.ca/tac/reprints/articles/15/tr15.pdf | WebFetch ECONNREFUSED; curl 200 OK | Primary source for §1; quotes extracted via pdftotext |
| https://arxiv.org/abs/math/0305282 | WebFetch 200 | Abstract page only; no theorem text |
| https://arxiv.org/pdf/math/0305282 | WebFetch 200 (binary unparsed); pdftotext on saved copy 200 | Primary source for §2 |
| https://ncatlab.org/nlab/show/Lawvere%27s+fixed+point+theorem | WebFetch 200 | Used in §3 |
| https://ncatlab.org/nlab/show/diagonal+argument | WebFetch 200 | Used in §3 |
| https://en.wikipedia.org/wiki/Lawvere's_fixed-point_theorem | WebFetch 200 | Used as cross-check; matches nLab |
| https://en.wikipedia.org/wiki/Diagonal_lemma | WebFetch 200 | No Lawvere connection on page; not load-bearing |
| https://www.uibk.ac.at/mathematik/algebra/staff/fritz-tobias/ct2021_course_projects/lawvere.pdf | 404 | Not retrieved |
| https://www-users.york.ac.uk/~varg1/Diagonal.pdf | WebFetch 200 (binary unparsed) | Not used; primary obtained from arXiv |
| https://groupoid.moe/pdf/diagonal_argument.pdf | WebFetch 200 (binary unparsed) | Not used |
| https://www.sciencedirect.com/topics/computer-science/lawvere-fixed-point-theorem | 403 | Not retrieved |
| http://tac.mta.ca/tac/reprints/articles/15/tr15abs.html | ECONNREFUSED | Not retrieved |
| Pavlovic 1996 | Not attempted | Honest negative |
| Bauer 2014 | Not attempted | Honest negative |

## Caveats

- Did not fetch Pavlovic 1996 ("On the structure of paradoxes") or Bauer 2014 — out of scope-time.
- nLab "Lawvere's fixed point theorem" page uses *point-surjective* rather than Lawvere's original *weakly point-surjective* — minor strengthening of hypothesis; flagged.
- Yanofsky page references are from extracted text of arXiv:math/0305282v1; pagination may differ from journal version (BSL 9.3).
- The "applied to the graded knowledge graph" §4–5 sections are theorem-as-applied, not formal proof that the GKG's category satisfies CCC hypotheses.

## Connections

- `derives-from` → `../../research/research.md`
- `corroborates` → `../03-godel-lawvere-limits/findings.md`
- `cited-by` → `../../discovery.md`
