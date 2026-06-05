/---
tags: [vault, ontology, discovery, documentation-architecture, altitude, diataxis, graduation-gate]
node_type: discovery
is_session: false
layer: ontology, architecture
nature: explanatory, reference
status: exploratory
version: 0.1.0
last_updated: 2026-06-01
---

# Two-View Discovery

> A spec-bound discovery should be authored as **two altitude-separated views** — a *system-view* (Diátaxis explanation: concept and decision rationale, no schemas) and an *engineer-view* (reference + ADR shape: schemas with every genuine fork preserved as Context → Options → Recommendation → What's-open, plus a Decision inventory). It is the **pair, not either view alone, that licenses a spec** — and only when the engineer-view's Decision inventory shows **zero *critical* open decisions**. The single-document discovery that interleaves both altitudes is the failure mode this discovery names.

---

## Claim

A discovery whose trajectory is a DomainSpec spec should be split by **documentation genre, not by density**, into two peer files at two altitudes: a **system-view** carrying the conceptual picture and the rationale for every load-bearing decision (no schemas, enums, or code), and an **engineer-view** carrying the reference payload (schemas/contracts/enums) in which every genuine fork is preserved as `Context → Options → Recommendation → What's-open` and consolidated into a **Decision inventory** plus a **What-we-don't-know** list. The combination is what makes the spec authorable; the operational test is a **graduation gate** — *a spec may be authored only when the engineer-view has zero open decisions flagged critical.*

## Status

`exploratory`. The claim is grounded by **two independent instances**: the repository's existing `process-overview/{system-view, engineer-view}` pair (a two-view discovery that already exists and works) and the **extraction-infrastructure split proposal** (a worked decomposition of a 1386-line single-doc monolith into the two views). It distills a settled external corpus (Diátaxis, C4, arc42, MADR/ADR) and grounds a proposed amendment to [[discovery-structure-constitution]], which today governs discovery *shape* and *placement* but is silent on document *altitude* and on the discovery → spec *graduation gate*. What would move it from exploratory to consolidated: (a) a second monolith decomposed under this rule **without retrofitting**, or (b) ratification of the graduation gate + the criticality flag (Open Questions Q1–Q2), or (c) a counter-instance where a single-altitude discovery produces a spec with **no** loss the two-view split would have caught.

**Shape governance.** This discovery follows the `vault/discovery/` body shape of [[discovery-structure-constitution]] §3 (Claim / Status / Summary / …) and the confidence-omission rule of `ontology-conventions.md` (a `discovery` omits `veracidade`/`convicção`; per-option confidence lives inline) — **not** the `knowledge-discovery-writing.md` skill shape, whose mandated `## Objective` / `## Canonical Foundation` order governs the `knowledge/<domain>/discovery/` path this artifact does not occupy. Like its house-style neighbor [[template-calibration-discipline]], it is a substance-bearing methodological README rather than the signpost-into-lenses form §3's ≤60-line cap assumes; that cap is read as binding on the lens-bearing form.

## Summary

The triggering investigation began as a request to trim an oversized index on a single extraction-infrastructure discovery and reframed into the real defect: a 1386-line discovery **conflates two altitudes** — the conceptual "why / which decision" and the technical "what is the schema / contract." A reviewer of the conceptual picture has to step over enum tables; an author compiling the spec has to mine contracts out of prose. The defect is structural, not cosmetic: the two altitudes are different **documentation genres** (Diátaxis *explanation* vs *reference*), and the documentation-architecture tradition keeps them apart by audience and by purpose.

The cure already had a precedent in-repo. The `process-overview` discovery was authored as a `system-view` (explanation; "we add one layer at a time," `Alternative framings we considered` tables, a single protagonist section, no schemas) and an `engineer-view` (reference + ADR; per-subsystem `Context → Options → Recommendation → What's-open`, a consolidated Decision inventory, and a terminal What-we-don't-know list whose closing rule is "if a section isn't in this table, its decisions are committed"). The two views are bound as one node by a directed `refines` / `refined-by` edge (the engineer-view refines the system-view — it makes the same concepts more specific without replacing them) and a single-decision-owner rule: a dual-homed decision states its verdict only in the engineer-view; the system-view names the stance and points across. The extraction-split proposal demonstrated that an arbitrary monolith decomposes cleanly onto this grammar via a section-by-section allocation, preserving the AX-DS-3 verbatim payload (envelope JSON, closed enums, state machines, invariant checklists) in the engineer-view while relocating epistemics and stance to the system-view.

What changed about the prior understanding: [[discovery-structure-constitution]] treats a discovery as a single artifact (one README + lenses, or one feature `discovery.md`) and governs *where it lives* and *how it is triangulated* — but it does not recognize that a **spec-bound** discovery has two reader models with different focal lengths, and it does not define the moment a discovery is **decision-complete enough to compile into a spec**. This discovery supplies both: a genre-based altitude split, and a graduation gate keyed to the engineer-view's Decision inventory. The gate is the load-bearing *new* claim and the reason this matters to DomainSpec — it is the missing handoff contract between the discovery layer and `AX-DS-1` (spec is source; code is its compiled image).

What remains open: the **mechanism** of the gate (the `critical / non-critical` flag on Decision-inventory rows), **where the gate is normatively recorded**, whether the two-view rule binds **all** discoveries or only spec-bound ones, and the disposition of a monolith once split. These are the Open Questions, each with a recommendation.

## Lenses

> No separate lens files yet — per [[discovery-structure-constitution]] §4, lenses are added only when a new angle would strengthen confidence or sharpen the boundary. This discovery is published from the synthesis of a prior multi-agent dispatch; its research bundle — the extraction-split proposal and the two session records (all `derives-from`) — is linked under **Connections** and stands in for the `./research/` folder a fresh dispatch would populate. Lens candidates are enumerated in **Next Moves**; the `lenses/` folder is intentionally empty pending those dispatches.

---

## Canonical Foundation

The corpus the method distills, grouped by tradition. Each tradition states its load-bearing claim and its primary source. No tradition is invented for the occasion; each is a widely-used documentation discipline or an in-repo precedent.

**Verification (per [[discovery-structure-constitution]] §5 taxonomy):** the four external traditions (Diátaxis, C4, arc42, MADR) are `model-recall` — named from training knowledge, **not** web-fetched in this session — and are second-class evidence until a corroboration lens retrieves them (see Next Moves). The in-repo precedent and the in-framework axiom anchor are `local-files-read` (the `process-overview` pair and the axioms skill were read in full).

### Diátaxis — the genre split (the authority for the cut)

**Load-bearing claim:** documentation divides into four modes by the cross-product of *acquisition vs application* and *practical vs theoretical knowledge*; **explanation** (theoretical understanding — "why it is shaped this way") and **reference** (information-oriented description — "what the contract is") are distinct modes that **must not be interleaved**, because mixing the acquisition-mode and application-mode degrades both. The cut between system-view and engineer-view *is* the explanation/reference cut. Source: Daniele Procida, *Diátaxis* documentation framework (diataxis.fr), 2017–present.

### C4 model — altitude as a first-class axis

**Load-bearing claim:** a system is described at separable **levels of abstraction** (Context → Container → Component → Code), and a reader is served by choosing one altitude per diagram rather than collapsing levels into a single picture. The system-view sits at C4 Level 1 (context/why); the engineer-view at Levels 2–3 (component/contract). Source: Simon Brown, *The C4 model for visualising software architecture* (c4model.com).

### arc42 — section genres carry different content types

**Load-bearing claim:** an architecture document is partitioned into sections of distinct genre — context and goals (§1–§4: explanatory) vs building blocks, runtime, and crosscutting concepts (§5–§8: reference) vs decisions (§9). The system-view inherits the explanatory sections; the engineer-view inherits the reference + decision sections. Source: Starke & Hruschka, *arc42* architecture template (arc42.org).

### MADR / ADR — the decision is preserved *with* its options

**Load-bearing claim:** an architectural decision is recorded together with the **options considered and their trade-offs**, not collapsed into the imperative that won — so a later reader sees the choice *as a choice*. This is the engineer-view's `Context → Options → Recommendation → What's-open` grammar and its Decision inventory. Source: Markdown Any Decision Records (adr.github.io/madr); Nygard, "Documenting Architecture Decisions," 2011.

### In-repo precedent — `process-overview/{system-view, engineer-view}`

**Load-bearing claim:** a two-view discovery is not hypothetical — it exists, is `status: draft` and actively used, and demonstrates every grammar element (progressive-build explanation with `Alternative framings` tables and one protagonist section in the system-view; per-subsystem ADR walkthroughs + Decision inventory + What-we-don't-know in the engineer-view; a pair-binding edge; single decision owner). *Caveat:* the precedent currently binds the pair with a non-canonical `complements` edge — this discovery normalizes it to the canonical `refines` / `refined-by` (see G-2). Source: `knowledge/domain_knowledge/discovery/process-overview/system-view.md` and `…/engineer-view.md` (maestro-trama), read in full 2026-06-01.

### In-framework anchor — `AX-DS-4` and `AX-DS-1`

**Load-bearing claim:** DomainSpec already requires that *decision space is preserved with the decision* (AX-DS-4) and that *the spec is the source the code compiles from* (AX-DS-1). The two-view method is the discovery-layer realization of AX-DS-4, and the graduation gate is the contract that lets AX-DS-1 hold — a spec authored over unsettled critical decisions would either invent a decision (AX-DS-4 violation) or compile orphan behavior (AX-DS-3). Source: `.claude/skills/domainspec-implementation-axioms/SKILL.md`.

---

## Concept Map

Each concept the method asserts, the tradition that backs it, the section of [[discovery-structure-constitution]] that currently covers it, and the coverage status.

| ID | Concept | Source(s) | Current target rule | Status |
|----|---------|-----------|---------------------|--------|
| C1 | A discovery has a fixed section grammar | discovery-writing.md; constitution §3 | §3 (README sections) | **Covered** (single-altitude only) |
| C2 | A discovery is triangulated across independent angles | constitution §4 | §4 (lenses) | **Covered** |
| C3 | A discovery's home is set by trajectory, not readership | constitution §9 | §9–§14 | **Covered** |
| C4 | Document **altitude / genre** is a first-class split (explanation vs reference) | Diátaxis; C4; arc42 | (none) | **Missed** |
| C5 | The system-view / engineer-view **section grammars** (no-schema explanation; ADR-shaped reference) | Diátaxis; arc42; process-overview precedent | (none) | **Missed** |
| C6 | A genuine fork is preserved **inside** the discovery as Options + recommendation, never an imperative | MADR; AX-DS-4 | AX-DS-4 (axiom only; no discovery-shape rule) | **Partial** |
| C7 | A discovery → **spec** graduation gate keyed to decision-completeness | AX-DS-1; this discovery | §6 (promotes to premise/constitution/conceptual, not spec); §11 (State-3→State-2 placement graduation, not decision-readiness) | **Missed** |
| C8 | A discovery is read-only after save; refinement supersedes | constitution §2, §7 | §2, §7 | **Covered** (tension with the two-file pair — see A-3) |

The three **Missed / Partial** rows (C4, C5, C6, C7) are the promotion payload below.

---

## Decisions taken

### D-1 — Split by documentation genre, not by density

- **Decision:** When a discovery interleaves conceptual rationale and technical reference, split it into a **system-view** (Diátaxis explanation) and an **engineer-view** (Diátaxis reference + ADR), bound as one node by a directed `refines` / `refined-by` edge (engineer-view → system-view). The authority for the cut is the genre boundary (explanation vs reference), **not** a line-count or "this doc is too long" heuristic.
- **Rationale:** A density heuristic produces an arbitrary cut that leaves both halves mixed-genre. The genre boundary is principled and reproducible: a section is system-view iff it answers "why / which decision," engineer-view iff it answers "what is the contract." Diátaxis, C4, and arc42 independently draw the same line.
- **Status:** Demonstrated by the `process-overview` pair; specified for the extraction monolith by the split proposal.

### D-2 — The system-view carries no schema, enum, or code

- **Decision:** The system-view is built one conceptual layer at a time, every load-bearing decision named with an `Alternative framings we considered` table, exactly **one** protagonist / load-bearing-claim section, and a closing `What this view does not cover` handoff to the engineer-view. It contains no schema, no enum, no code block.
- **Rationale:** The explanation genre is degraded by reference material — a reader building the conceptual picture should never have to step over a JSON envelope. Excluding schemas is what keeps the view legible to a stakeholder or reviewer judging the shape before the mechanics.
- **Status:** Demonstrated (process-overview system-view).

### D-3 — The engineer-view preserves every fork as an ADR, and reproduces settled payload verbatim

- **Decision:** Each engineer-view subsystem section is `Context → Options → Recommendation → What's-open`; a genuine fork is **never** collapsed to an imperative, and its code/schema survives as the Recommendation's reference artifact. Settled contracts (envelope JSON, closed enums, state machines, invariant checklists) are reproduced **verbatim** (AX-DS-3: lossy paraphrase is silent partial drop) **and** each registers a `Settled` row in the Decision inventory. The view ends with two terminal consolidators: a **Decision inventory** (`Decision | State{Settled/Recommended/Open/Deferred} | Where`) and a **What-we-don't-know** list (`Item | What's open | What we'd need to close it`), whose closing rule is "*a section not in this table has committed decisions.*"
- **Rationale:** This realizes AX-DS-4 at the discovery layer and makes the discovery's decision-state **queryable** — the precondition for the graduation gate (D-4). The verbatim rule protects the spec-author handoff payload.
- **Status:** Demonstrated (process-overview engineer-view §12–§13).

### D-4 — The pair licenses the spec; the gate is decision-completeness, not document-completeness

- **Decision:** A spec may be authored from a discovery only when the engineer-view's Decision inventory shows **zero open decisions flagged *critical*** (Open or Deferred rows that are critical block; non-critical opens do not). The system-view alone never licenses a spec (it has no contracts); the engineer-view alone is insufficient without the system-view's rationale to keep the spec's behavior traceable (AX-DS-3). **The combination, gated on decision-completeness, is the handoff.**
- **Rationale:** Under AX-DS-1 the spec is the compiled image of *settled* behavior. A critical decision still open in the engineer-view means the spec would have to either invent the decision at the keyboard (AX-DS-4 violation) or encode a branch with no authoring artifact (AX-DS-3 violation). The gate makes the discovery → spec edge a checkable contract rather than a judgment call. *Document*-completeness (every section written) is the wrong test — a fully-written discovery can still hold an unsettled error model; *decision*-completeness is the right one.
- **Status:** **Recommended, not ratified.** The criticality flag that makes it operable is Open Question Q1.

### D-5 — Single decision owner across the pair

- **Decision:** A decision that is conceptually relevant to both views states its **recommendation only in the engineer-view**; the system-view names the stance and links across. No verdict is stated twice.
- **Rationale:** Dual-stated verdicts drift. One owner keeps the Decision inventory the single source of decision-state truth, which the gate (D-4) depends on.
- **Status:** Demonstrated (process-overview: fail-open/closed, persist-at-creation).

---

## Alternatives considered

### A-1 — Keep one document; manage length with an index / collapsible sections

- **Position:** A single discovery with a good table of contents and folded sections.
- **Why set aside:** Treats the defect as length when it is genre-mixing. The reader still meets both altitudes in one linear pass; the spec-author still mines contracts out of rationale. An index hides the symptom and leaves the cause.

### A-2 — Three or more views (e.g., concept / contract / operations / test)

- **Position:** Finer altitude slicing.
- **Why set aside:** The explanation/reference cut is the one the traditions agree on; further slices fragment the Decision inventory across files and weaken the single-owner rule (D-5). Operations and test material are *sections within* the engineer-view, not separate altitudes. Revisit only if a third genuinely distinct genre (e.g., a *tutorial* / how-to) is ever needed — which a discovery, by definition, is not.

### A-3 — One discovery = one file (uphold constitution §7 "no revision in place / one artifact")

- **Position:** Splitting into two files violates the "one artifact per investigation" discipline.
- **Why set aside (reconciled):** The pair is **one** discovery in two altitude-views, not two discoveries — bound as a single node by the canonical `refines` / `refined-by` edge, single-owner, and a shared Decision inventory. §7's "one artifact per investigation" forbids splitting a *finding* across discoveries; it does not forbid presenting *one* finding at two altitudes. This reconciliation depends on the pair being bound as a single node by a real edge (G-2): without it, "one discovery in two views" has no graph mechanism and the §7 reconciliation weakens. This discovery proposes the constitution make the binding explicit (G-2) so the two-view pair is not mistaken for a §7 violation.

### A-4 — Split by reader role (stakeholder doc vs engineer doc), not by genre

- **Position:** Cut on audience.
- **Why set aside:** Readership-based cuts were already rejected for *placement* by constitution §9 ("trajectory, not who reads it today"), and the same failure applies here: a reader is not a genre. An engineer often needs the system-view's rationale; a stakeholder sometimes needs one contract. Cutting on genre lets either reader cross the `refines` / `refined-by` edge when they need the other altitude; cutting on role traps content behind the wrong door.

---

## Proposed amendment to discovery-structure-constitution

The promotion payload — the concrete changes that close the Missed/Partial rows in the Concept Map. Each gap names a new rule with a `Check:`.

### G-1 — Altitude rule (closes C4)

- **New rule:** "A discovery whose trajectory is a spec (a feature `discovery/` per §9 state 2 or 3) **should** be authored as a system-view + engineer-view pair when it carries both conceptual rationale and technical reference. The cut is by documentation genre (Diátaxis explanation vs reference), not by length."
- **Check:** no single spec-bound discovery file contains both a schema/enum block **and** a multi-paragraph decision-rationale narrative; if it does, it is a split candidate.

### G-2 — Two-view section grammar (closes C5, reconciles A-3)

- **New rule:** define the system-view grammar (no schemas; `Alternative framings` per decision; one protagonist section; `What this view does not cover` handoff) and the engineer-view grammar (`Context → Options → Recommendation → What's-open` per fork; verbatim settled payload; terminal Decision inventory + What-we-don't-know). State that the pair is **one** discovery in two views (not a §7 violation), bound by the canonical `refines` / `refined-by` edge (engineer-view → system-view) and single decision owner (D-5). **Edge-normalization note:** the `process-overview` precedent currently uses a non-canonical `complements` edge (absent from `ontology-conventions.md`'s catalog); this rule standardizes on `refines` / `refined-by`. If a symmetric peer edge is judged semantically truer than directed `refines`, coining `complements` is itself a schema-evolution-gate change a discovery authorizes (per `ontology-conventions.md`) — but it must be coined explicitly, not assumed.
- **Check:** the system-view has zero fenced schema/enum blocks; the engineer-view ends with both terminal consolidators; exactly one canonical `refines` / `refined-by` edge joins the pair.

### G-3 — Decision-as-fork rule inside discoveries (closes C6)

- **New rule:** "Within a discovery, a genuine fork is recorded as options + a recommendation (or an explicit 'we don't know yet' + what's needed), never as a bare imperative. Every decision-bearing section — fork, settled, or deferred — registers a Decision-inventory row." (Lifts AX-DS-4 from axiom to discovery-shape rule.)
- **Check:** no discovery section states a non-obvious design choice without either an `Alternative framings` / `Options` table or a Decision-inventory row.

### G-4 — Discovery → spec graduation gate (closes C7)

- **New rule:** "A spec is authored from a discovery only when the engineer-view's Decision inventory shows zero **critical** Open/Deferred rows. The gate is decision-completeness, not document-completeness." Records the gate as the contract on the discovery → spec edge, complementing §6 (premise/constitution/conceptual promotion) and §11 (State-3→State-2 placement graduation).
- **Check:** before a spec is opened for a feature, its engineer-view Decision inventory has no row with `State ∈ {Open, Deferred}` **and** `critical = yes`.

---

## Open Questions

### Q1 — The criticality flag mechanism (blocks G-4 from being operable)

How is a Decision-inventory row marked critical? **Recommendation:** add a `critical | non-critical` column to the engineer-view Decision inventory. **Critical** = a decision the spec's behavior contract cannot be authored around — the AX-DS-4–enumerated kinds (error model, persistence/database engine, core schema shape, layer placement, data-access library) and anything a downstream operation/state/interface directly depends on. **Non-critical** = a tunable, an optional-field set, a cosmetic name, a deferred-out-of-scope item the spec can omit. The gate (G-4) reads only the critical rows. This is the one decision that must be settled *before* an engineer-view is authored, because it is structural to the inventory.

### Q2 — Where the gate is normatively recorded

`discovery-structure-constitution` (as G-4), a standalone constitution, or the domain dictionary? **Recommendation:** record it **in `discovery-structure-constitution` as G-4** — the gate is a rule about discovery structure and placement-to-spec, which is exactly that constitution's scope; a standalone doc would orphan it from the §6/§11 promotion machinery it extends.

### Q3 — Does the two-view rule bind all discoveries or only spec-bound ones?

**Recommendation:** **only spec-bound discoveries** (state-2 / state-3 feature discoveries with a `discovery → spec` trajectory). Vault knowledge discoveries (state-1, the README+lenses form) and small single-altitude findings stay single-file; forcing a two-view split on a three-paragraph finding would recreate the template-calibration cargo-cult failure (over-calibration to the hardest case). The rule is a `should` triggered by genre-mixing, not a `must` on every discovery — see [[template-calibration-discipline]].

### Q4 — Filenames and monolith disposition

**Recommendation:** mirror the precedent — `system-view.md` / `engineer-view.md` in the feature's `discovery/` folder. On split, **retire the monolith to a stub** that points to the two views (preserves inbound links/anchors); delete only after cited-by artifacts (SPEC, ARCHITECTURE) are re-pointed. Both are low-stakes and confirmable at execution time.

---

## Next Moves

- **Promote G-1…G-4** into [[discovery-structure-constitution]] (a deliberate, separate act per §6) once Q1–Q2 are ratified. This discovery is the provenance trail.
- **Resolve Q1 (criticality flag)** with the operator before any engineer-view is authored under the rule — it is structural to the Decision inventory.
- **Execute the extraction-infrastructure split** under the ratified rule as the rule's second non-retrofitted instance (the proposal is ready); the outcome is the evidence that moves this discovery from `exploratory` to `consolidated`.
- **Lens candidates** (dispatch only if confidence needs strengthening): a deeper Diátaxis/divio corroboration lens (web-fetched, to upgrade the Canonical Foundation from model-recall); a counter-instance lens hunting for a spec that a single-altitude discovery served with no loss (a falsification candidate for D-1).

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [[discovery-structure-constitution]] | `refines` | The target artifact. This discovery proposes G-1…G-4 amending it to cover document altitude (C4–C5), the decision-as-fork rule (C6), and the discovery → spec graduation gate (C7). |
| `knowledge/domain_knowledge/discovery/process-overview/system-view.md` (maestro-trama) | `derives-from` | The in-repo precedent system-view; the empirical instance the grammar is read off. |
| `knowledge/domain_knowledge/discovery/process-overview/engineer-view.md` (maestro-trama) | `derives-from` | The in-repo precedent engineer-view; source of the Decision-inventory + What-we-don't-know grammar and the closing rule the gate (D-4) keys on. |
| `claude/current_conversations/2026-06-01-1940-extraction-doc-split-proposal.md` (maestro-trama) | `derives-from` | The worked decomposition of a 1386-line monolith onto the two-view grammar; the multi-agent dispatch this discovery is published from. |
| `vault/sessions/2026-06-01-2140-extraction-doc-split.md` (maestro-trama) | `derives-from` | Session record that surfaced the altitude-conflation defect and the graduation-gate question. |
| [[template-calibration-discipline]] | `cites` | Q3's "should, not must" calibration borrows this discovery's cure for over-calibration to the hardest case. |
| `.claude/skills/domainspec-implementation-axioms/SKILL.md` | `derives-from` | AX-DS-1 grounds the graduation gate; AX-DS-4 grounds the decision-as-fork rule (D-3, G-3); AX-DS-3 grounds the verbatim-payload rule (D-3). |
| [[discovery-structure-constitution]] §6, §11 | `cites` | The gate (G-4) extends the promotion machinery: §6 promotes to premise/constitution/conceptual; §11 governs State-3→State-2 placement graduation; G-4 adds the discovery → spec edge neither covers. |
