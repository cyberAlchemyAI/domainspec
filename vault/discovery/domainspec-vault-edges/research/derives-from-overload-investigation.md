---
tags: [vault, domainspec-vault-edges, edges, investigation, derives-from]
node_type: research
is_session: false
layer: ontology
nature: explanatory
status: draft
veracidade: medium
convicção: medium
version: 0.1.0
last_updated: 2026-05-02
---

# Investigation — Is `derives-from` Overloaded?

> Honest assessment of what the unified `derives-from` edge buys and costs, given the user's tentative decision to keep it as-is. Not an argument for splitting it. The job is to make the trade-offs visible so that the keep-decision is made with eyes open, and so that — if the costs ever bite — the failure is recognized as predicted rather than as a surprise.

---

## Objective

Quantify and exemplify the conflation that the current `derives-from` edge embeds, so the vault has a written record of the gains and losses. Reference the canonical sources (`vault/ontology-conventions.md` Appendix C, `.claude/skills/custom/edges.md`, `vault/discovery/domainspec-vault-edges/research/findings.md` and `research.md`), enumerate the collapsed semantics, present concrete examples from existing vault files where the distinction either matters or honestly doesn't, identify the queries that the conflation breaks, the queries it simplifies, and finish with a net assessment that does not dress a heuristic in math.

---

## Scope and method

I read three sources before writing this:

1. `.claude/skills/custom/edges.md` — the cheatsheet. `derives-from` is described as "the chain backbone — research from strategy, discovery from research, premise from discovery, etc." and the deprecated-edges table folds both `depends-on` and `produces`/`produced-by` into it.
2. `vault/ontology-conventions.md` Appendix C (lines 540–592). `derives-from` is the first universal edge, source `any` → target `any`, cardinality N:M, defined as "A draws intellectual or evidential basis from B." The deprecation table at lines 580–592 lists the same two folds (`depends-on` → `derives-from`; `produces`/`produced-by` → `derives-from`/`derives`).
3. `vault/discovery/domainspec-vault-edges/research/findings.md` and `research.md` — the dispatch that produced the catalog. Notably, `findings.md` proposed `produces` as a separate edge (#9) for `domainspec-subagents-strategy` → research/findings dispatch artifacts, and the research file (E1.1, line 50, line 60) recorded the actual vault counts: `produces` 6, `depends-on` 3, against `derives-from` 84. The decision to fold `produces` into `derives-from` was made *after* the dispatch closed — i.e. between `findings.md` and the consolidation pass that wrote the current Appendix C and `edges.md`.

I then grep'd the vault for actual uses of all four edges (`derives-from`, `derives`, `depends-on`, `produces`, `produced-by`) to ground the investigation in real files rather than hypotheticals.

---

## Q1 — What semantic relationships are collapsed into `derives-from`?

The cheatsheet and Appendix C explicitly fold three relationships into `derives-from`. The vault's actual usage and the research history reveal a fourth that the catalog talks around but does not name. Plus a fifth that is adjacent and worth flagging because the vault's own definition of `consumes` exists *because* the conflation has a known limit.

### Collapsed semantic 1 — Intellectual lineage (the "chain backbone")

This is the canonical use. A document's argument or evidence rests on another document. If you delete the parent, the child loses its load-bearing basis. Examples are everywhere: `vault/premise/system-premises.md` line 117 declares `derives-from` → `system-axioms.md` because the premises rest on the axioms; `vault/constitution/event-system-constitution.md` lines 587–592 declare four `derives-from` edges to upstream axioms, premises, and conceptual foundations. The chain `discovery → research → premise → axiom`, all wired by `derives-from`, is the default reading of the edge.

### Collapsed semantic 2 — Dependency (`depends-on`)

The deprecated `depends-on` edge folded in here was meant for "runtime/structural dependency" (research.md line 60). The constitution's deprecation rationale — "Distinction between intellectual derivation and runtime dependency was rarely needed in practice" — is honest about why: only 3 vault uses ever, and the file with the strongest active example (`scope-and-domain-axes.md` line 403) uses it for a *conceptual* dependency, not a runtime one (it depends on the 2×2 `veracidade × convicção` matrix in `confidence-levels.md`). The vault, in practice, never grew a real "runtime depends on this code" use case.

### Collapsed semantic 3 — Production (`produces` / `produced-by`)

The deprecated `produces` edge was used for **a producing process emits an artifact** — most concretely, a `domainspec-subagents-strategy` dispatch *produces* its `subagents-research` and `subagents-findings` files. `findings.md` (line 41, edge #9) explicitly proposed `produces` as a separate first-class edge with source `domainspec-subagents-strategy` and target `research, findings`, justified by the dispatch artifact set that `domainspec-subagents-strategy-premises.md` P-SS-9 mandates. The current catalog rejected that proposal and folded the relationship into `derives-from`/`derives`.

The fold is not direction-preserving. `produces` was forward strategy → output ("strategy produces research"). The fold inverts the canonical direction: per `ontology-conventions.md` §A in the constitution's `node_type` linking rule (lines 99–107), the canonical declaration is `subagents-research derives-from domainspec-subagents-strategy`. So the same physical relationship now reads "the research file *was derived from* the strategy file" rather than "the strategy *produced* the research file." Both are true; they emphasize different things.

### Collapsed semantic 4 — Refinement-of-a-method-spec (the implicit fourth)

This one is not named in the deprecation table but appears in real vault uses. `vault/constitution/domainspec-subagents-strategy-constitution.md` line 380 says the constitution `derives-from` `domainspec-subagents-strategy-premises.md` because "Source premises (P-SS-1..10) for every rule here. Each rule cites the source premise inline." This is not really intellectual lineage — the premises do not *argue for* the constitution; the constitution *codifies* them. Yet `codified-as` exists in the catalog (it is the chain-mandated edge for premise → constitution per `epistemic-chain.md` D-4). The author chose `derives-from` anyway, because the inverse direction (constitution declaring it derives from premises) reads more naturally to humans than `codifies` (premises codify constitution, awkward).

So `derives-from` is also absorbing some traffic that `codified-as` was supposed to carry — silently, by author preference, not by catalog rule. This is a leak the catalog doesn't acknowledge.

### Collapsed semantic 5 — Adjacent: `consumes` (intentionally NOT collapsed)

The catalog kept `consumes` separate (session-specific edge, ontology-conventions.md line 574): "A read or used B as input without deriving new claims from it. Distinct from `derives-from` (which carries intellectual lineage)." This is interesting because it shows the catalog *does* know how to distinguish "uses" from "derives from" — it just only bothered to do it for sessions. Document → document inputs that don't derive lineage have no edge; they get folded into `cites` or vanish.

Net: the visible fold is three semantics (lineage + dependency + production); a fourth (codification-by-author-preference) leaks in silently; and a fifth (input consumption) exists only for sessions.

---

## Q2 — Concrete examples where each collapsed distinction would matter

For each collapsed semantic, I looked for a real file in the current vault where the lost distinction would change the answer to some realistic question. I tried to find genuine cases. Where I couldn't, I say so.

### Example for semantic 1 (lineage) — distinction is preserved, no example needed

The canonical use is preserved, since `derives-from` *is* the lineage edge. There is nothing to lose for this semantic.

### Example for semantic 2 (dependency) — I could not find a case where the distinction matters in the current vault

The strongest existing `depends-on` use is `vault/discovery/domainspec-vault-foundations/scope-and-domain-axes.md` line 403:

> `confidence-levels.md` — `depends-on` — Uses the existing 2×2 `veracidade × convicção` matrix; specifically, classifies orthogonality as a "strategic bet" (low veracidade, high convicção) using that matrix.

If you ask "what does scope-and-domain-axes intellectually rest on?" the answer should include `confidence-levels.md` either way. If you ask "what would break at runtime if `confidence-levels.md` were deleted?" the question doesn't apply — the vault is not a runtime system, it's a knowledge graph; nothing executes. The constitution's rationale here ("rarely needed in practice") is honest: the runtime/structural sense of `depends-on` had no real referent in the vault. **For this semantic, the conflation costs nothing observable today.** It would start to cost something the day the vault's documents are paired with executable artifacts (skills, code, agents) and you want to ask "if I delete this constitution, which skills break?" — but the vault has separate edges for that (`operationalized-by` for constitution → skill).

### Example for semantic 3 (production) — strongest example of real loss

This is where the conflation actually bites. Look at the dispatch triad described in `ontology-conventions.md` lines 99–107:

- A `domainspec-subagents-strategy` document records the dispatch.
- A `subagents-research` document is produced by that dispatch and declares `derives-from` → strategy.
- A `subagents-findings` document synthesizes research and declares `derives-from` → every research it cites AND `derives-from` → the strategy.

That last document — `subagents-findings` — has, by mandate, *two semantically different* `derives-from` edges to the strategy:

1. `findings derives-from research` — intellectual lineage. The findings make claims that rest on the research's evidence; if the research is wrong, the findings are wrong.
2. `findings derives-from strategy` — production / provenance. The findings did not draw any intellectual basis from the strategy file (which is a *contract*, not evidence); the findings exist because the strategy dispatched the work that produced them.

Both edges are written with the same name. A graph reader cannot tell, without opening the documents, which is "this claim rests on this evidence" and which is "this output was emitted by this process." The current `vault/discovery/domainspec-vault-edges/research/findings.md` Connections block (lines 107–110) makes this concrete: it has one `derives-from` row pointing at `research.md` (genuine lineage — every load-bearing claim resolves to a research section) and one `references` row pointing at the strategy file (the author *avoided* using `derives-from` for the strategy link because it would have been semantically misleading). So the vault's own author of the dispatch findings already routed around the conflation by picking a different edge — `references` instead of `derives-from`. The catalog rule was followed in the constitution's text but not in the actual file the constitution is meant to govern.

Symmetrically, `domainspec-subagents-strategy.md` (vault/discovery/domainspec-vault-edges/research/domainspec-subagents-strategy.md lines 131–132) uses `produces` to point at its outputs:

> `research.md` | `produces` | Raw evidence file (this dispatch's first output artifact).
> `findings.md` | `produces` | Synthesized edge catalog (this dispatch's second output artifact).

This file is non-conformant under the new catalog (it uses a deprecated edge), but the author chose `produces` rather than the inverse `derives` because "produces" is the natural verb for "this dispatch made these files." Migrating to `derives` would replace a semantically clear forward production edge with a semantically generic backward derivation edge.

**This is the strongest single example of conflation harm.** Two relationships between the same pair of files (`subagents-findings` ↔ `domainspec-subagents-strategy`) — one lineage, one provenance — collapse to one edge name.

### Example for semantic 4 (codification leak) — `domainspec-subagents-strategy-constitution.md`

`vault/constitution/domainspec-subagents-strategy-constitution.md` line 380:

> `domainspec-subagents-strategy-premises.md` | `derives-from` | Source premises (P-SS-1..10) for every rule here. Each rule cites the source premise inline.

The chain-mandated edge for premise → constitution is `codified-as` (`ontology-conventions.md` Appendix C line 551, `epistemic-chain.md` D-4). The constitution declares the inverse, and the inverse of `codified-as` is `codifies` — which would read here as "constitution codifies premises." The author wrote `derives-from` instead, presumably because `derives-from` reads naturally on the constitution side ("constitution derives from premises") whereas `codifies` doesn't (constitutions are not grammatically the agent of codification in the same way).

This is a leak from `codified-as` into `derives-from`, hidden inside the existing rule's own implementation. A graph query for "all constitutions and the premises they codify" using `codified-as`/`codifies` would miss this constitution unless the bidirectional partner was written on the premise file with the correct edge name.

### Example for semantic 5 (consumes, not collapsed) — works today, will be tested when documents start consuming each other

This semantic has no broken example because the catalog kept `consumes` separate. But the catalog only allows it from sessions. A future case ("this discovery used three other discoveries as inputs without deriving lineage from them") has no edge — it would have to use `cites` (which has its own load-bearing connotation: "removing the citation weakens the argument") or `derives-from` (which would over-claim). Not a current bug, but a known gap.

---

## Q3 — Queries that become impossible or ambiguous

I'll frame each query as a question someone might actually ask of the vault, and then check whether the current edge resolves it cleanly.

### Q3a — "Show me the lineage of premise X" vs "Show me what produced premise X"

Under a split (`derives-from` for lineage, `produces` for output emission, `depends-on` for runtime), these resolve to different graphs. Lineage walks the chain backbone upward; production points to the session or dispatch that physically emitted the file.

Under the current edge: **the queries collapse**. They both return everything the premise has a `derives-from` edge to — which mixes the upstream axioms (lineage) with whatever else the catalog leaks into `derives-from` (today nothing for premises, but tomorrow possibly a `domainspec-subagents-strategy` if a premise gets produced by a dispatch).

The vault has a *partial* workaround: the `creates` / `created-by` edge is reserved for sessions producing documents. So "what session produced premise X" is queryable cleanly. But "what dispatch produced this `subagents-findings` document" must be answered by reading the prose of the `derives-from` row, since the catalog mapped `produces` into `derives-from`.

### Q3b — "Which documents would I need to update if I revise premise P?"

Under a split: walk `derives` (inverse of `derives-from`) — those are the children whose claims rest on P. That gives you the files that need re-examination if P changes.

Under the current edge: the same walk, but it also returns any document that declared `derives-from` → P for *production* reasons. For premises this is rare, but for `domainspec-subagents-strategy` documents it's common: a strategy that gets revised should not be assumed to invalidate every research file it produced (the research already happened; the evidence stands). Yet a `derives` walk from the strategy will return all those research files as if they needed re-validation.

This is an ambiguity, not an impossibility — the query returns a superset of the right answer. The user must read prose to filter.

### Q3c — "Which constitutions codify which premises?"

Under a split: walk `codified-as` from premises, `codifies` from constitutions. Closed-form answer.

Under the current edge: walking `codified-as`/`codifies` returns the *catalog-conformant* subset. Files like `domainspec-subagents-strategy-constitution.md` that declared the relationship as `derives-from` instead are missed. A correct answer requires walking `derives-from` from constitution → premise *and* filtering by node_type pair (constitution source, premise target) *and* assuming no other semantic of `derives-from` applies — three implicit joins where there should be one explicit edge query.

### Q3d — "What is the provenance chain of this finding?"

Under a split: `findings produced-by strategy`, `strategy created-by session`, `session continues-from earlier-session`. A clean provenance walk.

Under the current edge: `findings derives-from strategy` mixes provenance (strategy made it) with lineage (findings rest on strategy). The walk works — but the meaning of each hop is type-ambiguous, and you cannot mechanically distinguish "this is part of a provenance chain" from "this is part of an argument chain."

### Q3e — A query that becomes *more reliable* under collapse

"Show me everything this document is intellectually downstream of" — under a split, the user has to remember to walk three edges (`derives-from` ∪ `depends-on` ∪ `produced-by`) and risks missing one. Under collapse, one edge walk catches them all. This is the steel-man for the current design and matters in Q4.

---

## Q4 — Queries that are made simpler by one edge instead of three

### Q4a — "Show me everything this document derives from, in any sense"

Single edge walk. Under a split, the user must remember to union three edges. The collapsed form is more forgiving for casual readers and for agents that haven't been trained on the catalog's full vocabulary.

### Q4b — Authoring overhead

Three edges to learn vs one. New authors don't have to ask "is this lineage or production?" — they pick `derives-from`. This avoids a class of authoring mistakes (wrong edge name) at the cost of a class of querying mistakes (over-broad results). For a vault that prioritizes write-side ergonomics over read-side precision, this is a real win. The vault's audit script (per `ontology-conventions.md` §8 migration note) flags asymmetric edges; it does not flag semantic mismatches inside `derives-from`. So the simpler authoring model also matches the simpler validation tooling.

### Q4c — Catalog footprint

The 21-edge catalog is already at the limit of what an author can hold in head. Three more edges (lineage / dependency / production) would push it to 24, with three more inverses (24 → 27 names total, depending on whether `produces` keeps `produced-by`). The cheatsheet stays scannable in 30 seconds at 21; at 27 it is borderline. The vault has explicit memory ([feedback_llm_agnostic_design](MEMORY.md)) to avoid mechanical/synthesis/judgment-style speculative taxonomies; the same skepticism applies to admitting edge variants without empirical proof they are needed.

### Q4d — Migration cost

The vault has 84 `derives-from` declarations today (research.md E1.1 line 39). Splitting would require re-classifying every one of them by reading the prose. Most of them are genuine lineage and would not move — but the audit alone is non-trivial work, and any error rate above a few percent erodes the catalog's reliability faster than the conflation does.

---

## Q5 — Vault precedent for collapsing edges

The deprecation table in `ontology-conventions.md` (lines 580–592) is itself a collapse history. The folds and stated rationales:

| Old edge | Folded into | Stated rationale |
|----------|-------------|------------------|
| `references`, `contextualizes` | `cites` | "Generic-mention edges collapse into `cites` with prose for nuance." |
| `depends-on` | `derives-from` | "Distinction between intellectual derivation and runtime dependency was rarely needed in practice." |
| `produces` / `produced-by` | `derives-from` / `derives` | "Per the bidirectionality rule, the canonical direction is `derives-from`." |
| `provenance-for` | `creates` (sessions only) | (no explicit rationale; session-specific equivalent kept) |
| `resolves` | `closes-question` (sessions) or `supersedes` (documents) | "Was ambiguous about whether the relationship was structural or session-driven." |
| `questions` | `opens-question` (sessions) | "Session-specific framing now explicit." |
| `exemplifies`, `instance-of`, `instantiates` | (deferred) | (no current vault use case) |
| `updates`, `deprecates` | (use frontmatter) | "Minor version bumps are tracked in frontmatter, not as edges." Deprecation = state. |
| `grounds`, `grounded-by` | (none — write the forward) | (bidirectional Markdown supersedes SQL inverse computation) |

Pattern: **collapses are the dominant move in vault edge governance.** The catalog has consistently chosen "fewer edges with prose nuance" over "more edges with mechanical precision." The rationale alternates between three honest claims:

1. **No empirical demand** ("rarely needed in practice", "no current vault use case"). This is the cleanest justification — there is no harm if the distinction never gets exercised.
2. **Bidirectionality dedup** ("canonical direction is X"). This is structural — the vault decided to write the forward edge and let inverses follow by name pair, so paired primitives like `produces`/`produced-by` collapse into one canonical name.
3. **Ambiguity in the old edge** (`resolves` was structural-vs-session-ambiguous). This is the inverse motive: split, not collapse, when an edge is itself overloaded.

Note (3): the vault HAS split when ambiguity was bad enough. `resolves` was split into two distinct edges based on whether the source is a session (→ `closes-question`) or a document (→ `supersedes`). So the precedent for splitting an overloaded edge exists, and the trigger is "the same edge name carried two different semantics in two different contexts." That is approximately the situation `derives-from` is now in for the strategy/research/findings triad.

The asymmetry to flag: for `derives-from`, justification (2) was given in the deprecation table for `produces` ("per the bidirectionality rule, canonical direction is `derives-from`"). But bidirectionality dedup is about *picking which direction to write*, not about *whether two semantically different edges should share a name*. The deprecation table conflates those two questions. The legitimate dedup move would have been "write `produces` on the strategy side and `produced-by` on the output side, both visible because both written explicitly." The catalog instead used dedup as a justification for full semantic collapse. That is the move that warrants the most scrutiny.

---

## Q6 — Net assessment

**Neutral with caveats — leaning toward "right call for now, wrong call later."**

I cannot dress this in math. The vault has no measurement layer for edge query cost, edge author error rate, or edge-induced retrieval ambiguity. Per the user's [epistemic honesty memory](MEMORY.md), the orthogonality discipline itself is "currently a strategic bet, not a verified property — enforced by review, not computation" (`ontology-conventions.md` line 22). The same is true here. I do not have a number for "how many queries get the wrong answer because `derives-from` is collapsed" — only the reasoned cases above.

**Why "right call for now":**

- The 84-vs-3-vs-6 count split (`derives-from` vs `depends-on` vs `produces`) means the cost of collapse falls almost entirely on a single rare case (the dispatch triad). 80%+ of `derives-from` uses are the canonical lineage backbone where there is nothing to disambiguate.
- The catalog has explicit precedent for collapse-with-prose; it works for `cites` (which absorbed `references` and `contextualizes`), and the rationale is the same.
- The migration cost of a split would be real (84 reclassifications) and the orthogonality measurement layer that would tell us whether the split was worth it does not yet exist (`ontology-conventions.md` Appendix A is a "guiding principle, not a measurement").
- The vault prioritizes write-side ergonomics. A simpler catalog reduces author errors more than it loses query precision, given the current corpus size.

**Why "wrong call later":**

- The dispatch-triad case (`subagents-findings` declares two semantically distinct `derives-from` edges to the same `domainspec-subagents-strategy`) is the canary. It will get worse as the vault adopts more dispatch-style workflows. Today there is one such triad; the linking rule in `ontology-conventions.md` lines 99–107 is general, so every future dispatch instantiates the conflation again.
- The leak into `codified-as` (domainspec-subagents-strategy-constitution.md line 380 using `derives-from` instead of `codifies`) suggests authors prefer `derives-from` as a default whenever it grammatically fits, regardless of the catalog rule. Each such leak makes the eventual split more expensive and less reliable.
- The vault's own splitting precedent (`resolves` → `closes-question` / `supersedes`) was triggered by exactly this pattern: one edge name carrying two semantics in two contexts. The current `derives-from` is in the early stage of that pattern.

**Caveats on the "neutral" verdict:**

- The user's stated decision is to keep the current edge. This investigation respects that. Nothing here argues for a rewrite. The conditions under which the decision would warrant revisiting are: (a) the dispatch triad becomes the dominant authoring pattern, not a special case, or (b) a query agent built against the vault produces wrong answers traceable to the conflation, or (c) the orthogonality measurement layer ships and shows `derives-from` carrying multiple modes of mutual information with `node_type`.
- Until any of (a)/(b)/(c) hold, the conflation is a tracked debt, not a bug. Recording it (this file) is the discipline; recording it does not require fixing it.

**Honest summary in plain words:** keeping `derives-from` collapsed is the cheap, defensible call given today's vault. It works because the canonical lineage use dominates the corpus. It will break in proportion to how often the dispatch-triad pattern is exercised, and it has already broken once visibly (the dispatch's own findings file uses `references` instead of `derives-from` for one of its links because the catalog rule would have been semantically wrong). That single broken example is the strongest evidence in this investigation. The user should keep the edge but should not be surprised when this case multiplies.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [findings.md](findings.md) | `derives-from` | This investigation rests on the dispatch findings — both the proposed `produces` edge (#9) that the catalog later rejected and the open question OQ-E3-6 about `derives-from` overlap. |
| [research.md](research.md) | `derives-from` | The E1 vault edge inventory (counts: `derives-from` 84, `produces` 6, `depends-on` 3) is the empirical base for the cost analysis above. |
| [../../../ontology-conventions.md](../../../ontology-conventions.md) | `cites` | Appendix C edge definitions and the deprecation table at lines 580–592 are load-bearing for the semantic-collapse argument. |
| [../../../../.claude/skills/custom/edges.md](../../../../.claude/skills/custom/edges.md) | `cites` | The cheatsheet's deprecated-edges table is the user-facing surface where the conflation is visible. |
