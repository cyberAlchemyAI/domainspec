---
tags: [agents, dispatch, system-view, skill-upgrade, merge, legibility, draft]
node_type: research
is_session: false
layer: meta
nature: explanatory
status: draft
version: 0.2.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
---

# Merged system-view skill — draft v0.2.0

> **v0.2.0 — assessment integrated.** Two assessor subagents (coherence/fidelity + apply-to-real-doc) returned 2 blockers + 3 guards + several refinements. All applied: closed both verdict-leak paths (gloss "what works today"; Given="exists today" bucket); added cardinality/closed-enum to the reconstructibility test + tiebreak + count-vs-set corollary; per-subsection guard on the process walkthrough; anti-duplication guard on the gloss; upstream escape hatch for framing-level stances; confidence-on-stance guard; corrected the "only two mandatory" claim to four; added CR disposition. Verdict: net positive — catches 7 real leaks in maestro-trama, 1 major structural upgrade; promotable once these were in.

> **What this is, plainly.** A draft that merges three inputs into one upgraded `system-view` skill: (1) the canonical `system-view` SKILL's rigor — stance-naming, single-owner cross-reference, framings tables; (2) the legibility/pedagogy techniques maestro-trama's authored `system-view.md` independently proved at scale — incremental diagram build, density, executive readability; (3) the prior upgrade findings (`progressive-communication-discipline`, `executive-layer`) plus the red-team corrections from `2026-06-12` review. This is a PROPOSAL for assessment, not the promoted skill — the canonical SKILL.md is untouched until this is judged.

## Provenance of each merged-in piece

| Capability | Source | Status in this draft |
|---|---|---|
| Shape-only; names stances, decides none; uses terms, redefines none | canonical skill | unchanged law |
| Bijective `stance:<slug> → engineer-view#<id>` + stance-to-verdict table | canonical skill | unchanged law |
| Per-shape-layer "alternative framings we considered" table | canonical skill (independently in maestro-trama) | unchanged law |
| Given-vs-optimized layering | canonical skill | unchanged law, now also carries existence-partition (see §Status) |
| Information-increasing / interruptibility | prior `findings.md` (Concept 1) | adopted, scoped to explanatory views |
| Abstract⇄concrete pairing | prior `findings.md` (Concept 2) + your ask | adopted, **corrected** to abstract-USE (red-team F6) |
| Word economy / semantic density | prior `findings.md` (Concept 3) + your ask | adopted, **softened** to per-layer-where-exists (red-team F5) |
| Progressive (incremental) diagram build | maestro-trama + prior diagrams draft | adopted, **conditional** on ≥3 layers (red-team F3) |
| Executive layer (≤8 anchored bullets) | legibility review CR-1/CR-3 | adopted |
| Process-order walkthrough | maestro-trama §10 | adopted, **constrained** to non-duplicating info (red-team F4) |
| Existence/Status of subsystems | maestro-trama cast table | **transformed** — no Status verdict column (red-team F5/ruling) |
| Reader "start here" pointer | maestro-trama §9 | adopted, optional |
| `veracidade`/`convicção` confidence | maestro-trama frontmatter | adopted, **constrained** to shape/stance claims (red-team F8) |
| Connections edge-table | maestro-trama Connections | adopted as carrier for `derives-from` + sibling pointers |

---

## The load-bearing correction: the reconstructibility test (replaces the hedge-word test)

Your two asks — **more density** and **shape-only** — collide. The resolution channel is the abstract⇄concrete pairing, but the discriminator is NOT a hedge word ("e.g./today/concretely"). A hedge is cosmetic; `e.g. total_ads` is still a schema declaration with an apology in front of it.

**The test is reconstructibility:**

> A concrete instance is *illustrative* (allowed here) **iff a reader cannot reconstruct from it any of: a schema field, an ordered state-transition set, a relationship cardinality (1:1 / 1:N), a closed enumeration of a type's members, or an authoritative build/done status.** Numbers that quantify *stakes* pass (7,173 creatives; 94% of spend; 28% zero-revenue). Tokens that quantify *structure* fail (a field name; "9 states in order"; "exactly one … many …"; an enumerated member list; "Built/Modeled/Exists"). The discriminator is what the reader can rebuild, not the phrasing.
>
> **Tiebreak (a token that does both):** when a token quantifies a stake AND names structure, *structure wins — it fails.* "Spend splits across three channels: search, social, display" fails (it enumerates a closed 3-member set), even though "three" reads like a stake. A legal illustration quantifies the stake *without* enumerating the type's members ("spend concentrates in a handful of channels"). **Corollary — a count is a stake; the ordered/enumerated set is the contract:** "~nine visible stages from first-seen to archived" passes (a count + endpoints); the ordered nine-token list fails.

Worked rulings against maestro-trama's own `system-view.md` (the first three are the named leaks; the rest were surfaced by the apply-to-real-doc assessor):

- `brief_id` / `produto` / `total_ads` (§10.1, §6/§7 diagrams) → **CONTRACT, must go.** A named field is the atom of a schema. Convert to abstract-use + illustration naming no field: *"each creative carries a lineage key that ties the market signal back to the bet that placed it"* — the binding field name points to `engineer-view`.
- The nine-state lifecycle string (`planned → … → archived`, maestro-trama's §10.3) → **CONTRACT, must go** — and it self-contradicts (maestro-trama's §16 says the state machine is engineer-view's). Convert to *"creatives move through a lifecycle from first-seen to scored (~nine visible stages)"* + `stance:lifecycle-stateful-vs-derived → engineer-view#<id>`. The *fact + count* is shape; *the nine ordered states* is contract.
- The cast-table **Status column** (Modeled/Built/Exists, §8) → **TRANSFORM** (see §Existence below), not keep, not strip-wholesale.
- The six-network enumeration "Meta, Google, TikTok, Criteo, Bing, Pinterest" (§8, §10.6) → **CONTRACT (closed enum), must go.** maestro-trama applies "name the class, don't enumerate instances" to `recommendation_method` but not here. Convert to *"one network today, ~six at target"* — count + stake, no member list.
- The Card field-list "Brief, DNA Intent, DNA Realized, route, producer, network identifiers, telemetry" (§10.3) → **CONTRACT (field enumeration), must go** — same atom as `total_ads`, adjacent to the 9-state string the named pass missed.
- The §7.3 phenotype **authority/store** pair ("authority belongs to the SemanticLayer; whether it should *live* there is open") → **leaked authority verdict + unowned stance.** The authority assignment is verdict-shaped and the open store question is a stance with no bridge — both must route to engineer-view rows (`stance:phenotype-authority-vs-store → engineer-view#<id>`, status carries the OPEN half).

---

## `<progressive-communication-discipline>` (NEW skill section)

**Scope declaration (binding):** these four rules apply to `nature: explanatory` views — a system-view explains a shape already mined, it does not build a suspense argument. A view that is intentionally argumentative declares the exception inline and is exempt from Rule 1 only. (Resolves the prior-findings Shannon dissent by scope.)

**Rule 1 — Information-increasing (interruptibility).** Write so the value-per-token curve never decreases: each section widens the mental model already formed; a reader who stops at any layer holds a *coherent* picture (incomplete in detail, never incoherent). *Test:* truncate at 25/50/75% — a blind reader states the thesis; if compatible with the full-version thesis, it passes; "can't conclude anything" = dead weight on the curve. (This is exactly maestro-trama's "smallest picture first → add one layer at a time; the early diagrams are stepping stones, not simplifications-for-children.")

**Rule 2 — Abstract⇄concrete pairing.** A load-bearing abstract claim with no nearby concrete instance is an unredeemed promissory note. Each carries (abstract **use** of the ontology-view's term — defined nowhere here) + (≥1 concrete illustration passing the reconstructibility test). **Corrected from "abstract definition":** authoring a definition is ontology-view's lane and fails the zero-terms-redefined gate; this view *uses* the term and *grounds* it. **Triggered, not universal:** required only where the concept is plausibly misreadable or carries a non-obvious stake — self-evident concepts ("spend") need no example. *Test:* label sentences [A]/[C]; for triggered concepts, every [A] has an adjacent [C].

**Rule 3 — Semantic density (word economy).** Every word carries new information or is a strictly necessary connector; target is maximum semantic density, not minimum length. **Density bar (softened):** each shape layer states ≥1 concrete checkable stake *where one exists* — a number, a named illustrative instance, or a named constraint ID. A genuinely qualitative layer may declare *"the stake here is structural, not quantitative"* rather than fabricate a number. *Test:* a 30% précis preserving all claims; if the précis reads clearer, the original has fat. Proxy: hedge-words < 1/100 words.

**Rule 4 — Progressive diagrams (conditional).** When present, the diagram sequence is the narrative spine: **one additive diagram per layer = the previous diagram + only what this layer makes necessary** (never a from-scratch redraw), with constraint IDs annotated **on the arrows they constrain** (the diagram is an argument, not decoration); then a full-picture assembly diagram. **Conditionality (red-team F3):** the incremental diagram build is *required* when the view has ≥3 shape layers or the discovery flags structural complexity; *optional* below that. The additive-not-redraw and inline-constraint-ID rules bind only when diagrams are present. The skip predicate (`single + N=1`) and the "one-paragraph-suffices" skip remain intact — diagrams never tax the cheap path.

---

## `<executive-layer-discipline>` (from legibility review CR-1/CR-3)

A structured **executive gloss** sits inside `## Objective`: ≤8 bullets, common language, form *problem → choice → why*, each bullet **anchored** (a pointer to the layer/stance it summarizes — an unanchored bullet fails the gate), **zero bullets stating a verdict** (a verdict is engineer-view's), and any term/status translation marked **"informal translation, not a definition."** Optionally opens with a **"start here" reader-pointer** (maestro-trama §9: "if you read one section, read this one"). Goal: a practitioner who never read the internal vocabulary can answer *what does this do / what's the biggest open decision / **what is given-and-fixed vs. not-yet-in-the-picture*** from the gloss alone.

> **Blocker fix (assessor F1):** the third question was originally "what works today." That is implementation status — the verdict §Existence below moves to engineer-view — so the gloss's own success criterion would have forced the leak it forbids. The gloss surfaces the *given-vs-not-yet partition* (shape) and lets the reader follow the stance pointer for any build verdict; it never asserts "X is built."

> **Anti-duplication guard (assessor B2):** the gloss must **replace or strictly extend** an existing Objective, never duplicate it. Where an Objective already delivers thesis + how-to-read (as maestro-trama's four-paragraph Objective does), the gloss may add *only* the executive-specific axes (biggest-open-decision, given-vs-not-yet) and must not restate the thesis prose — restatement is fat the Rule 3 précis test flags.

---

## Existence, not Status (the cast-table transform)

maestro-trama's cast table answers a real stakeholder-altitude question — *"which of these 8 subsystems exist today?"* — but does it with a Status column (Modeled/Built/Exists). **"Built/Exists" is a verdict about implementation state — exactly what engineer-view's decision inventory owns** (it is adjacent to RESOLVED/OPEN). Kept as-is, it is a leaked verdict and fails the gate.

**The transform (red-team ruling), corrected per assessor F2:** the existence information is expressed **only through stances**, never through a Status cell *and never through partition-bucket membership*. The given-vs-optimized layering stays on its **canonical axis — relationship to control** (fixed-and-obeyed vs. optimized-toward vs. accumulating), which is *orthogonal to build status*:

- **Given** = fixed-and-obeyed (we don't get to change it) — e.g. an external regulation that is *given* yet may not "exist as a built subsystem."
- **Optimized-toward** = a knob we tune — e.g. a cache that *exists today* yet is still being tuned.

> **Why not "Given = exists today" (assessor F2 blocker):** defining the Given bucket by existence just renames the verdict — sorting a subsystem into "Given/exists" *is* asserting it is built. "Given" (a control stance) and "exists" (an implementation verdict) are orthogonal axes; collapsing them re-leaks the verdict through the bucket label.

So: **existence-of-a-subsystem, wherever it carries a real choice, is a named stance** — `stance:subsystem-x-build-vs-defer → engineer-view#<id>` — and nothing else. The system-view keeps the cast as a scannable list of *names + one-verb-phrases* (no Status column, not dissolved into prose); a reader learns "which exist today" by following the build stance to its owning row, where the build verdict actually lives.

---

## Process-order walkthrough (constrained)

maestro-trama's §10 re-traverses the assembled diagram in process order with prose under each arrow. Promoting that verbatim institutionalizes a duplicate against the skill's nothing-decided-twice ethos. **Constraint:** the walkthrough is admitted **only when it adds information the assembly diagram cannot carry** — sequence, timing, who-acts-when, or a contract the diagram omits. It is reframed as *process-order annotations on the assembly diagram*, forbidden from re-narrating relationships the diagram already shows.

> **Per-subsection guard (assessor B1 — the one place blind application degrades the doc):** apply the cut **per walkthrough step, never to the section wholesale.** maestro-trama's §10 *looks* like pure re-narration at paragraph level, but only §10.4 ("exactly as built up in §§5–6") is genuinely redundant; §10.1 (the Brief's must-declare semantics), §10.7 (the Signal-Exit three-things-leave-together contract), and §10.8 (loop-close) carry sequence/contract the diagram cannot. **Rule: cut a step only if it re-labels arrows AND introduces no sequence/timing/contract the diagram omits** — which preserves roughly half of a typical walkthrough. Wholesale-cutting the walkthrough guts the doc's strongest teaching move (the build-order → process-order re-traversal) and orphans the genuinely-new Signal-Exit contract.

---

## Frontmatter & connections deltas

- **Confidence:** adopt `veracidade` / `convicção`, **constrained to shape claims and stances only — never to a verdict** (a verdict carrying confidence is a backdoor decision; that lives in engineer-view). **Stance guard (assessor F7):** confidence on a stance rates *that the tension is load-bearing and correctly framed* — never which side prevails. A `convicção` reading as side-preference ("X is probably right") is a leaked verdict.
- **Connections edge-table:** adopt maestro-trama's Connections table as the carrier for the existing mandated `derives-from → discovery.md` edge plus the sibling-view pointers (`complements → engineer-view`, `uses-terms-of → ontology-view`). Consistent with the skill's edge-not-frontmatter rule.

---

## Merged per-layer template (what an author actually writes)

```markdown
## N. <Layer name> — <one-line stake>

<2–4 sentences of shape at stakeholder altitude. Ontology-view's terms, USED not defined.
Abstract use + concrete illustration for any plausibly-misread concept (Rule 2),
passing the reconstructibility test. ≥1 concrete stake where one exists (Rule 3).>

```mermaid
<previous diagram + ONLY this layer's additions; constraint IDs on the new arrows (Rule 4)>
```

The **<stance-slug>** stance — <X versus Y, a real tension, not a settled answer> — is named
here and decided nowhere in this view (`stance:<slug> → engineer-view#<id>`).

### Alternative framings we considered
| Framing | Why we set it aside |
|---|---|
| <alternative> | <reason> |
```

Document-level order: Objective (with executive gloss + optional start-here) → Context (dense, numbers) → incremental layers (each: shape + abstract-concrete + additive diagram + named stance + framings table) → full-picture assembly diagram → given-vs-optimized (carries the existence partition) → process-order annotations (only if non-duplicating) → stance-to-verdict table → what this view does not cover → Maturity/known-limitations → Connections edge-table.

---

## Stance bijection — with an upstream escape hatch (assessor B/D guard 3)

The canonical bijection is "every lean → exactly one engineer-view row." The apply-to-real-doc assessor proved this **breaks for framing-level leans**: maestro-trama's `stance:objective-discovery-rate-vs-prediction` (§3.1) and `stance:two-loops-vs-single-or-pipeline` (§9) are *altitude/framing* choices owned upstream in the **discovery/axioms**, not by any engineering-mechanics row. Forcing them at engineer-view makes the author fabricate a fake row or drop the stance.

**Escape hatch:** a stance points to the layer that *owns* its verdict. The default and overwhelmingly common target is `engineer-view#<id>`; but a framing-level lean whose owner is upstream points there instead — `stance:<slug> → discovery#<id>` or `→ axiom/<id>`. The bijection ("exactly one owning row") holds; only the *target document* widens. The stance-to-verdict table gains a target-doc column so coverage stays mechanically checkable. (Of maestro-trama's 11 leans: 8 map cleanly to engineer-view rows, 2 are upstream-framing orphans this hatch saves, 2 resolve only as OPEN/provisional rows.)

## What this merge deliberately does NOT change

- The four laws (shape-only; names-not-decides; uses-not-redefines; bijective stance→owning-row) are untouched — every new technique is subordinate to them.
- The skip predicate and "one-paragraph-suffices" skip survive. **Unconditionally in force (assessor F5 — the original "only two" claim was false): four —** the executive gloss, the stance-to-verdict table, the reconstructibility test (wherever any concrete instance appears), and Rule 1 interruptibility (for explanatory views, absent a declared argumentative exception). All other techniques are conditional (abstract⇄concrete is triggered; density bar is per-layer-where-exists; progressive diagrams need ≥3 layers; the walkthrough needs non-duplicating content).
- Provenance note: provisional-handle discipline (`[PROVISIONAL — row not yet authored]` + blocker OQ) is an **existing** skill law; maestro-trama adopts it as a no-op, not a new invention.

## CR disposition (assessor F4 — so dropped-by-decision ≠ dropped-by-oversight)

- **CR-1, CR-3** (system-view executive gloss + gate) → **incorporated** (`<executive-layer-discipline>` + output-contract gate lines).
- **CR-6** (`## Maturity / known-limitations` in plain prose with practical consequence) → **incorporated** via doc-order; the *consequence* requirement (replace the bare "single-instance-validated" jargon with its practical meaning) is hereby restated as binding.
- **CR-9** (move the enum spelling-note out of Step 6 into an engineering-notes aside) → **carried** into the promotion changeset.
- **CR-2** (template entry-door), **CR-5** (discovery-writing motivator), **CR-10** (engineer-view negative fixture) → **deferred as out-of-scope** — they belong to the template / discovery-writing / engineer-view artifacts, not this skill.
