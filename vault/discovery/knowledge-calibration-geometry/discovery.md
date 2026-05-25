---
tags: [domainspec, knowledge, calibration, alignment, drift, fidelity, gamification]
node_type: discovery
is_session: false
layer: domain, application
nature: explanatory, reference
status: draft
veracidade: medium
convicção: high
version: 0.1.0
last_updated: 2026-05-24
---

# Knowledge Calibration Geometry

> DomainSpec can be reframed as a knowledge-calibration system: not only a place where a domain is documented, but a surface that measures structural consistency inside and between the three highest-value knowledge categories we actually care about — **knowledge in people's heads, formalized knowledge, and executable system behavior**.

---

## Objective

Write down the first product-level framing for DomainSpec as a system that measures knowledge fidelity, drift, and alignment across people, documentation, and code. The end state is not a theorem and not yet a spec; it is a durable discovery that names the primary categories, the two game loops, the core distance types, and the open questions that must be answered before this can harden into a metric system or feature surface.

---

## Context

The earlier DomainSpec framing already treats translation as the load-bearing operation: intent becomes formalization, formalization becomes implementation, implementation becomes runtime behavior, and every step can accumulate residue or drift. What changed in this discussion is the decision to treat **people** as first-class knowledge carriers inside the same picture rather than as external operators standing outside it.

That produces a stronger product frame. Instead of asking only whether documentation drifts from code, or whether the system stays aligned with its formal model, we can ask whether multiple knowledge-carrying categories remain structurally coherent:

- what a person knows about a domain,
- what the organization has formalized about that domain,
- what the executable system actually does.

This reframes DomainSpec as a knowledge-calibration surface rather than a static documentation framework. The product no longer just stores definitions. It actively measures where understanding is internally coherent, where translations between categories are faithful, and where residue accumulates.

The conversation also converged on a game-shaped operational loop. If we want to observe the knowledge in `head`, we cannot inspect it directly; we need interaction. The proposed mechanism is bidirectional question-play:

- `system -> person` questions to probe what the person can reconstruct, distinguish, justify, and transfer;
- `person -> system` questions to probe what the formalized/documented/systemized domain can answer, justify, and recover.

This turns gamification from decoration into instrumentation. The game is not a UX layer on top of the model; it is the mechanism by which the model becomes observable.

---

## Claim

DomainSpec should model at least three primary knowledge categories — `head`, `spec`, and `system` — and measure both **intra-category consistency** and **inter-category consistency** between them. The product's core value is the geometry of those distances: person-to-system-reference, person-to-person, and organization-level alignment/drift.

---

## High-Level Summary of Recommendations

1. **Adopt three primary categories now** — `C_head`, `C_spec`, `C_system` are sufficient for the first product framing. More categories may emerge later, but starting with them keeps the model legible.
2. **Separate intra-category from inter-category consistency** — many product confusions disappear once "is this category coherent in itself?" is separated from "does this category preserve another one faithfully?"
3. **Treat the game loops as instrumentation, not garnish** — bidirectional questioning is the first practical way to observe `C_head` and to expose drift between `C_head`, `C_spec`, and `C_system`.
4. **Do not treat "truth" as metaphysical** — the reference surface should be framed as the best currently-auditable system of record, not absolute truth. Divergence from it may be error, but may also be uncaptured operational knowledge.
5. **Keep "FF" as the long-horizon formal ambition, not the day-1 UI label** — the product can immediately work with operational terms like fidelity, drift, residue, and alignment while the stricter categorical definition is still being built.
6. **Model organizational knowledge as distinct from individual knowledge** — "high knowledge / low alignment" and "low knowledge / high alignment" are meaningfully different states and should not collapse into one score.

---

## Decisions Taken

### D-1. The first three knowledge categories are `head`, `spec`, and `system`

**Decision.** Treat the following as the first product-level categories:

- **`C_head`** — knowledge internalized by a person or group.
- **`C_spec`** — knowledge formalized in docs, ontology, structured artifacts, and explicit rules.
- **`C_system`** — executable behavior, schemas, code, runtime constraints, and observable system outputs.

**Rationale.** These are the three places where the same domain meaning most often diverges in practice. They are also the minimum set that lets DomainSpec talk about personal knowledge, documentation drift, and implementation drift in one frame without premature ontology bloat.

**Status.** Adopted as the initial product frame.

### D-2. Intra-category consistency and inter-category consistency are different measurements

**Decision.** The model explicitly distinguishes:

- **intra-category consistency** — coherence inside a category itself;
- **inter-category consistency** — fidelity of translation between categories.

**Rationale.** A category can be internally coherent and still badly translated into another one. Likewise, a category can be internally fractured, in which case every translation from it is contaminated at the source. The product must not collapse these into a single score.

Examples:

- A spec can be internally consistent but drift from operational reality.
- Code can be internally consistent and still implement the wrong spec.
- A team can disagree internally while each member remains locally consistent.

**Status.** Adopted as a structural split.

### D-3. The first operational observation mechanism is bidirectional question-play

**Decision.** The product's first observation loop is game-shaped and bidirectional:

- **`system -> person`** to probe what the person knows;
- **`person -> system`** to probe what the formalized/systemized domain can answer.

**Rationale.** `C_head` is not directly inspectable. Question-play is the first practical way to surface distinctions, reconstructions, exceptions, analogies, and justifications. The reverse loop is equally important because it measures the answerability and recoverability of `C_spec` and `C_system`.

**Status.** Adopted as the first MVP mechanism, not yet as a full feature spec.

### D-4. The product measures geometry, not just correctness

**Decision.** The core frame is distance/topology rather than quiz accuracy.

Load-bearing distance types:

- **person -> system reference**
- **person A -> person B**
- **group -> internal alignment**
- **group -> system reference**
- **spec -> system**

**Rationale.** A single "did you get it right?" score is too weak. Two people can both diverge from the system reference in different directions; a team can be highly aligned around a poor model; an expert can diverge from the reference because the reference is stale. Geometry preserves this information.

**Status.** Adopted as the product reading.

### D-5. "System true" must be framed as a reference surface, not absolute truth

**Decision.** Replace metaphysical truth-language with operational language such as:

- canonical reference,
- best auditable model,
- current system of record,
- reference surface.

**Rationale.** If a person diverges from the reference, that divergence may be error or may be evidence that the reference has drifted from lived reality. The product must preserve that ambiguity rather than encode the reference as always-right by definition.

**Status.** Adopted as a language discipline.

### D-6. Individual knowledge and organizational alignment are separate product objects

**Decision.** The product should support both:

- **individual fidelity** — how a person relates to the reference surface;
- **collective alignment** — how a group relates internally and externally.

**Rationale.** Organizations fail in both directions:

- high expertise / low alignment,
- low expertise / high alignment.

If the product collapses both into a single score, it loses the main organizational insight.

**Status.** Adopted as a first-order product distinction.

---

## Working Model

### The three primary categories

| Category | What it holds | Typical observation surface |
|----------|---------------|-----------------------------|
| `C_head` | tacit, internalized, situational knowledge in people or teams | answers, explanations, distinctions, analogies, justifications |
| `C_spec` | formalized domain knowledge | docs, ontology entries, rules, structured artifacts |
| `C_system` | executable domain behavior | code, schema, runtime responses, system outputs, telemetry |

### Two classes of measurement

| Measurement | Question |
|-------------|----------|
| **Intra-category** | Is this category coherent in itself? |
| **Inter-category** | Does this category preserve another one faithfully? |

### First useful product distances

| Distance | Product meaning |
|----------|-----------------|
| `d(head_i, reference)` | how far a person is from the current auditable model |
| `d(head_i, head_j)` | how far two people are from each other |
| `d(spec, system)` | documentation drift |
| `d(group, reference)` | organizational drift from the current model |
| `alignment(group)` | internal coherence of organizational understanding |

### Why the game matters

The game is how the product gets evidence:

- `system -> person` reveals `C_head`
- `person -> system` reveals answerability of `C_spec` and `C_system`
- comparing both loops reveals residue and drift

---

## Alternatives Considered

### A-1. Treat DomainSpec as documentation only

**Position.** Keep DomainSpec as a system for formalized knowledge and drift between docs and code only.

**Why rejected.** This leaves the most valuable carrier of domain knowledge — people — outside the model. It also prevents the product from measuring the gap between tacit knowledge and formalized knowledge, which is precisely where many organizational failures originate.

### A-2. Treat the product as a generic quiz engine

**Position.** Ask questions, compute scores, and optimize for accuracy / completion / speed.

**Why rejected.** That collapses structural divergence into trivia-style correctness. The product's value is not that it quizzes people; it surfaces different classes of alignment and residue between categories.

### A-3. Use one scalar knowledge score

**Position.** Produce one overall "knowledge score" per person or team.

**Why rejected.** A single score erases distinctions between coherence, fidelity, coverage, and alignment. It would make "everyone agrees on the wrong thing" look too similar to "everyone independently knows the right thing."

### A-4. Start with many categories instead of three

**Position.** Immediately model subcategories such as `runtime`, `telemetry`, `ontology`, `tests`, `policy`, `group-head`, `individual-head`.

**Why rejected.** Probably directionally correct but prematurely complex. The first discovery should identify the smallest useful geometry. Refinements can split the initial three later.

### A-5. Encode FF as the first user-facing metric

**Position.** Present the product immediately in fully categorical language: fully faithful person, faithful doc, functorial translation, etc.

**Why rejected.** Conceptually attractive but too early as product language. The product can act on fidelity, drift, residue, and alignment before the stronger mathematical definition is stabilized.

---

## Open Questions

- **OQ-1 — What is the first operational definition of intra-category consistency for `C_head`?** Consistency inside a person cannot be reduced to "answered similarly twice." We need a stronger but still practical definition.
- **OQ-2 — What exactly is the boundary between `C_spec` and `C_system`?** Does structured telemetry belong inside `C_system`, or should it become a fourth category later?
- **OQ-3 — What qualifies as the reference surface for a domain?** Is it documentation-first, code-first, reviewed synthesis, or a weighted combination?
- **OQ-4 — How should the product treat disagreement with the reference surface?** When is divergence a user error, and when is it evidence that the reference has drifted?
- **OQ-5 — What is the first score vocabulary for users?** Candidates include fidelity, drift, residue, calibration, coherence, answerability, alignment. The product should not expose seven shaky labels if three would do.
- **OQ-6 — How do we aggregate from person-level distances to company-level knowledge?** We need a principled path from pairwise distances to org-level alignment without hiding minority expert clusters.
- **OQ-7 — What is the right first MVP distance?** Candidate starting points: `person -> reference`, `person -> person`, or `spec -> system`. All are useful; one likely has to come first.
- **OQ-8 — How much of the metric should reward learning velocity versus current state?** The conversation strongly suggests improvement-over-time matters, but the tradeoff with present-state fidelity is unresolved.
- **OQ-9 — Which question types are structural enough to count as evidence?** Distinction, reconstruction, exception handling, analogy, justification, and prediction likely contribute differently and should not be weighted casually.
- **OQ-10 — What is the first ethically-safe way to show interpersonal distance?** "You are far from the truth" and "you are far from your peers" are socially explosive if surfaced bluntly.
- **OQ-11 — How does this connect to the long-horizon categorical program without overclaiming?** The discovery wants the FF framing, but the product needs an operational discipline that works before theorem-grade definitions exist.
- **OQ-12 — What is the first falsification criterion for the whole frame?** A real discovery should name what evidence would show this framing is misguided or too expensive relative to simpler quiz/documentation tools.

---

## Next Moves

- **Write a product-facing spec seed** that turns `C_head`, `C_spec`, and `C_system` into operational objects with candidate scores and observation methods.
- **Design the first bidirectional game loop** with a minimal question taxonomy and explicit evidence rules.
- **Name the first reference-surface discipline** so "system truth" never sneaks back in as an unexamined assumption.
- **Prototype org-level views** that distinguish expertise from alignment instead of collapsing them.
- **Open a follow-up discovery on score semantics** if the terminology set (`fidelity`, `drift`, `residue`, `alignment`) proves unstable under real examples.
- **Open a follow-up discovery on metric validity** before any user-facing scoring is treated as load-bearing.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `../../../README.md` | `cites` | Root DomainSpec framing: documentation as the meaning-side of the system. This discovery extends that frame by making people first-class knowledge carriers rather than external operators. |
| `../../../DRIFT-CONVERGENCE.md` | `cites` | Drift is already a core system concern in DomainSpec; this discovery broadens the drift frame from doc/code to person/spec/system geometry. |
| `../../../TUNING-LOOP.md` | `cites` | Existing calibration language on the system side. This discovery suggests a broader cross-category calibration surface rather than a system-only tuning loop. |
| `../../../docs/README.md` | `cites` | Documentation as canonical meaning surface. This discovery keeps that role but treats it as one category among several, not as the whole domain of knowledge. |
| `../domainspec-axioms/discovery.md` | `cites` | Connects especially to the existing navigation/calibration posture in the vault-side ontology work; this discovery re-reads that posture through a product metric lens. |

---

## Source Dispatch

This discovery is synthesized directly from a product-framing conversation rather than from a multi-lens dispatch. No `lenses/` folder is populated yet. If this framing survives first contact with spec work, the next honest step is to dispatch dedicated lenses on:

- metric validity,
- reference-surface governance,
- question-taxonomy design,
- org-level aggregation,
- and the categorical-definition bridge to the sibling theorem program.
