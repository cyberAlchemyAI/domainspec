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

# Findings — Invariants and Layer Alignment

## Objective

Decompose the knowledge-curation operation's invariants into schema-layer and instance-layer, identify alignment residues, and sketch uniqueness arguments per invariant.

## Findings

### Graded Knowledge Graph: Two-Layer Invariant Analysis

The knowledge-curation operation κ takes (corpus, new evidence, session) → (corpus'). The graded knowledge graph (GKG) — typed nodes {premise, axiom, constitution} × {conceptual, discovery, session}, typed edges {derives-from, contextualizes, governs, implements, contradicts}, condensation operator promoting nodes through `draft → exploratory → active → consolidated → evergreen` — is conjectured the unique fixed point of κ under two-layer residue accounting.

## A. Schema-layer invariants (what node/edge/stage types can exist)

| # | Invariant | Preservation contract (what is lost without it) |
|---|---|---|
| S1 | Node-type set is finite and closed: {premise, axiom, constitution} × {conceptual, discovery, session} | Without it, retrieval entropy is unbounded; AX-ONT-1 fails |
| S2 | Stage poset is total, monotone, and bounded: draft ≤ exploratory ≤ active ≤ consolidated ≤ evergreen | Lose direction-of-time on κ; promotion becomes non-decidable |
| S3 | Edge-type vocabulary is finite and typed by (source-type, target-type) | Lose composability of traversal; edges become uninterpretable |
| S4 | Every node carries two orthogonal confidence axes (convicção ⊥ veracidade) | Collapse to one number erases the distinction κ exists to track |
| S5 | Schema documents (conventions, confidence-levels) live *outside* the graph | Without it, schema can self-reference and contradict — Russell-style |
| S6 | Each edge admits at most one type between an ordered pair (axiomatized morphism uniqueness) | Lose functoriality of Δ; composition ill-defined |
| S7 | Promotion operator is a graph homomorphism (preserves edge-types under stage change) | Without it, evidence accumulation can erase structure it was supposed to certify |
| S8 | "Axiom" is a fixed point of promotion (no further stage above evergreen-axiom) | Lose a terminal object; condensation never halts |
| S9 | Session nodes are append-only and time-stamped (event-sourced) | Without it, the audit ledger cannot reconstruct any past state |
| S10 | Every non-session node must be reachable by some derives-from chain from an axiom | Lose the well-foundedness that makes "where does this rule come from?" answerable |
| S11 | The contradicts-edge is symmetric and blocks promotion of both endpoints | Without it, the graph can ratify mutually inconsistent evergreen claims |
| S12 | Constitution-nodes are the only edge-type carrying "governs"; axiom is the only one carrying terminal derives-from | Lose layer separation between rule (L3) and ground (L4) |

## B. Instance-layer invariants (how populated content behaves under κ)

| # | Invariant | Preservation contract |
|---|---|---|
| I1 | Each populated node has a unique anchor (file path, commit, timestamp) | Without it, two readings of "the same node" need not round-trip |
| I2 | Every populated edge cites concrete evidence (quote, diff, session-id) | Lose ability to distinguish a real edge from a hallucinated one |
| I3 | Session content is immutable post-close; only new sessions amend | Without it, ledger reconstruction fails (parallel to $A_{inj}$ on instances) |
| I4 | Promotion requires N independent corroborating sessions/evidence at this stage | Without it, condensation is unanchored — pure schema motion |
| I5 | Demotion is triggered by a populated contradicts-edge with veracidade ≥ threshold | Without it, falsified claims persist as evergreen |
| I6 | The Skolem-null policy on under-specified fields is declared per-node (Σ vs Π) | Without it, generated content silently chooses one and the auditor can't tell |
| I7 | Population of every concept type is non-empty at evergreen (no orphan axioms) | Lose grounding; promoted claims with no instances are vacuous |
| I8 | Each populated edge has a single human/agent author of record | Lose accountability; cannot localize residue |
| I9 | Two populated nodes with identical content must merge (deduplication at consolidated+) | Without it, the DRY discipline collapses and edges multiply spuriously |
| I10 | Premise-instances carry a falsification test (how-to-test field) | Without it, premise → axiom promotion has no instance-level criterion |
| I11 | Evidence half-life: instance evidence older than τ requires re-confirmation to support promotion | Without it, stale evidence inflates condensation |
| I12 | Every condensation event emits a populated session-node recording the unit map | The graph cannot internally witness its own κ-applications |

## C. Alignment table

| Schema | Instance correlate | Aligned? |
|---|---|---|
| S1 (finite types) | I1 (unique anchor) | aligned |
| S2 (stage poset) | I4 (N-corroboration for promotion) | aligned |
| S3 (typed edges) | I2 (cited evidence) | aligned |
| S4 (two confidence axes) | I10 (falsification test) — **partial**; I10 covers veracidade, no instance correlate for convicção | **residue: convicção is schema-only** |
| S5 (schema outside graph) | — **none** | **residue: schema documents have no instance discipline for their own evolution** |
| S6 (one edge per ordered pair) | I9 (dedup) | aligned |
| S7 (promotion = homomorphism) | I12 (κ emits session) | aligned, but I12 is rarely enforced |
| S8 (axiom = fixed point) | I7 (non-empty population) | aligned |
| S9 (append-only sessions) | I3 (immutable post-close) | aligned (tight) |
| S10 (well-founded derives-from) | — **none populated** | **residue: there is no instance-level check that the derives-chain is non-circular** |
| S11 (contradicts symmetric) | I5 (demotion trigger) | aligned |
| S12 (governs from constitution only) | — **none** | **residue: instance side has no enforcement that a governs-edge cites a real artifact** |

The four flagged residues are predicted to be where the formalization breaks or new structure emerges: (i) convicção needs an instance carrier (probably a "bet ledger"); (ii) schema-meta evolution needs its own governance loop (this is the L3→L3 self-reference problem); (iii) chain-circularity needs a populated checker (a real M2-analog); (iv) governs-edges need a runtime witness (L6 enforcement). These match exactly the *two-leak* prediction: schema fidelity does not buy instance fidelity, and each gap is paid separately.

## D. Candidate uniqueness arguments

- **S1 (finite types).** Any operation κ that decreases retrieval entropy under bounded compute must partition documents into a finite type lattice; the 3×3 grid arises because there are exactly three governance modalities (working bet / non-negotiable ground / enforceable rule) and three temporal carriers (timeless concept / exploratory branch / dated session). Drop any cell and either compositional governance or evidence accumulation loses a slot. Plausibly unique up to product-structure.
- **S2 (stage poset).** Bayesian condensation requires a total order on confidence; any partial order admits incomparable states between which κ cannot decide promotion, so κ stalls. The five levels are the minimum that distinguish (no-evidence, some, corroborated-active, saturated, terminal). Fewer collapses; more is descriptive only. Argument: any other lattice either reduces to this chain or admits stall states.
- **S3 (typed edges).** Untyped edges cannot carry differential semantics under κ; typed edges are forced by S4 (two confidence axes don't update the same way under derives-from vs contradicts). Uniqueness shape: the edge-type set is the smallest closed under κ's update rules.
- **S4 (orthogonal confidence).** Two-layer framework directly predicts two independent residues → two independent confidence coordinates. Uniqueness inherited from the two-symmetries theorem.
- **S5 (schema outside graph).** Self-reference paradox: if conventions.md is a node, κ acting on it changes the rules κ obeys mid-step. The unique fixed point requires a stratification; the only minimal stratification is exactly one meta-level out.
- **S6 (one typed edge per pair).** Forced by functoriality of Δ at the schema layer (§3.2 of the two-layer framework). Uniqueness is the standard "thin category" argument.
- **S7 (promotion as homomorphism).** Cannot construct a sharp argument for uniqueness — this is plausibly *descriptive*. Flag.
- **S8 (axiom as fixed point).** Any well-founded condensation needs a terminal; if multiple terminals existed, κ could oscillate between them. Uniqueness as the colimit of the promotion chain.
- **S9 (append-only).** Forced by the requirement that κ be auditable / time-reversible at the instance side. Any mutable session log admits two non-isomorphic histories with the same current state — κ ceases to be a function on histories.
- **S10 (well-founded derives-from).** Required so condensation terminates; any cycle creates a non-terminating promotion loop. Uniqueness: well-founded relations on finite types are essentially unique up to embedding.
- **S11 (contradicts symmetric + blocking).** Symmetry forced by classical bivalence; the blocking discipline is the only way contradictions survive condensation without being absorbed.
- **S12 (governs only from constitution).** Cannot construct a strong uniqueness argument — appears to be a convention. Flag.

Invariants S7 and S12 lack uniqueness sketches → likely descriptive rather than generative. They may be theorems *about* the GKG, not constituents of it.

## E. Candidate boundary statements

1. **Fully formal corpus (zero residue both layers).** GKG degenerates: every node is immediately evergreen, every edge is direct, stages collapse to a single level. The structure becomes the *fractal* case (both unit maps iso). The grading is trivial. So: GKG is non-trivially defined only when at least one residue is positive — exactly the two-layer framework's regime.

2. **Purely tacit corpus (maximal residue, no articulation).** No nodes can be populated → I1, I2 fail → the schema layer has nothing to grade. The GKG predicts knowledge exists but cannot be curated; this matches the L1-practitioner reality the meta-layers doc names as "tacit, not in spec." Boundary: GKG requires a minimum articulation rate above zero.

3. **Stage collapse.** If condensation is instantaneous (every claim promoted on creation), S2 collapses; the framework reduces to a flat typed graph and loses Bayesian semantics. Predicts: high-velocity AI-generated corpora will saturate the GKG and break it.

4. **Schema drift faster than instance accumulation.** If S5's external schema mutates faster than I4 can corroborate, promotions become uninterpretable (the rules under which a claim was promoted no longer exist). Boundary: schema-edit rate must be << population-rate.

5. **No human / no agent.** S5+I8 require an author-of-record. A fully autonomous system with no signed authorship loses the demotion mechanism (I5 needs an attributable contradicting witness). Predicts: pure machine-curation collapses I5 → I11 → S2.

6. **Continuous-valued domains.** If the underlying domain is genuinely continuous and admits no canonical discretization, the finite-type assumption S1 fails. GKG is a discrete-domain structure theorem; for continuous knowledge, the right object is a sheaf-graded variant, not GKG.

7. **Adversarial contradicts-flooding.** S11 + I5 admit a denial-of-service: an adversary submits contradicts-edges at the rate of legitimate promotions, freezing the corpus at active forever. Regime boundary: I5 needs a trust-weighted variant (already implicit in confidence axes) — but this is exactly where convicção-instance residue from §C bites.

Net: GKG is well-defined precisely in the regime where (i) residue is positive on at least one layer, (ii) articulation rate > 0 but schema-edit rate << population-rate, (iii) authorship is attributable, (iv) domain is discrete or canonically discretizable. Outside this regime, the structure either trivializes (case 1), starves (case 2), saturates (case 3), or is captured (case 7).

## Caveats

- Invariants S7 (promotion-as-homomorphism) and S12 (governs-only-from-constitution) lack sharp uniqueness arguments — they may be descriptive theorems *about* the GKG rather than generative constituents.
- The four flagged alignment residues (convicção, schema-meta evolution, derives-chain circularity, governs-edges enforcement) are predictions; none have been tested over time.
- Boundary statements in §E are proposals, not encoded tests.

## Connections

- `derives-from` → `../../research/research.md`
- `cited-by` → `../../discovery.md`
