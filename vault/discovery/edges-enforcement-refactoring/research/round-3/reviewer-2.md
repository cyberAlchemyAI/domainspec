---
tags: [vault, ontology, edges, authoring, review, operational]
node_type: research
is_session: false
layer: ontology
nature: explanatory
status: draft
version: 0.1.0
last_updated: 2026-05-30
---

# Reviewer 2 (Round 3) — Operational Viability

> Final-round independent skeptical review of `explorer.md` (Round 3). Lane: operational viability — does the demoted §4 actually read as sketch, do the fallback chains return defined values on real vault files, does the §4.3 dedup work, can a writer compose `discovery.md` from this without inventing operational claims. I did not read `reviewer-1.md` for this round. Verdict formed alone.

---

## Verdict

**accept-with-revisions (minor) — writer-ready WITH one structural caveat.** Round 3 honestly closed 8 of 9 R2-R2 findings and the closure mechanism is real (NF-1 → TD-11 + OQ-14 with 3 surfaced exits; NF-2 → D-7 5-element fallback chain; NF-3 → §4.3 mechanism specified end-to-end including a closed OQ-2). The §4 "operational sketch" demotion is honest, not cosmetic — the body actually concedes prototype-dependency in three places and the headline matches the body. **But:** one R2-R2 finding (NF-5, off-catalog edge propagation) is materially miscounted in the explorer in a way that propagates into §9 B-1 sub-item 2 and AC-N; the "12 uses" framing conflates three categories (legitimate carve-out forward-only edges into `.claude/skills/**`, prose-only example mentions in the constitution, and three actual vault→vault rows in `inverse-edge-fix.md`) that have radically different operational consequences. The writer needs to know which subset is load-bearing for the derivation pipeline, and the explorer as written does not say. This is fixable in one paragraph at §9 B-1 sub-item 2 or in AC-N's "Posture" section.

The §4.3 dedup mechanism is well-defined for the canonical case but has one adversarial gap (same-pair same-type appearing in multiple physical link sites across two large docs) that the writer can document without re-spec'ing.

The escalation rule in B-2 ("§4 elements internally contradictory → escalates to blocking") was something I tested directly. I found one near-contradiction (D-7 element 4 vs OQ-15 — see below) but it's a known-unknown the explorer flagged itself, not an unflagged internal contradiction. **B-2 does not escalate.**

---

## R2 findings closure check

For each R2-R2 finding, was it closed in R3?

| R2-R2 finding | R3 closure location | Adequacy |
|---|---|---|
| **NF-1 [block]** invented marker convention | §4.1 ("Regenerated region — unresolved"), TD-11, OQ-14 | **Closed via honest demotion.** Three exits surfaced; explorer explicitly does not pick; honesty admission at §4 opening matches. Operationally this means the writer must record TD-11 and OQ-14 as live, not as resolved. **Adequate.** |
| **NF-2 [block]** enclosing-sentence undefined for ~33 sites | D-7 5-element fallback chain | **Closed at the rule level**; element 4 (table-cell) is itself surfaced as OQ-15 (sketch-level inside a sketch). See "Fallback chain walkthrough" below. **Adequate with caveat.** |
| **NF-3 [major]** `contradicts` dedup mechanism unspecified | §4.3 steps 1–5 + AC-10 + D-11 | **Closed.** Parsing → canonical pair (alphabetical) → dedup (alphabetically-first description wins, loser logged) → projection → validation. OQ-2 closed explicitly. Composite fix as Round-2 robot-talks SY-2 demanded. **Adequate at the rule level — see adversarial test below for one stress case.** |
| **NF-4 [major]** AC-9 "partial" undefined for in-flight Tier 1 | AC-9-bis + OQ-16 | **Closed by punting honestly.** Explorer admits it punts ("conjecture, not commitment; awaits §9 catalog-reconciliation outcome") and surfaces OQ-16 inviting attack. The punt is operationally well-formed because Tier 1 sequencing is a sibling-node concern, not this proposal's concern. **Adequate.** |
| **NF-5 [major]** `proposes-edit` propagation (12 uses, 6 files) | AC-N + §9 B-1 sub-item 2 + OQ-13 | **Partially closed — see "New R3 findings" #1.** AC-N picks "absorb" conditional on §9. But the explorer's count framing ("12 uses including the constitution's own §8 prose") obscures that 8/12 uses target `.claude/skills/**` which the constitution itself §297/§303 carve-outs as *legal-by-design forward-only* — those are NOT off-catalog edges, they ARE in-corpus uses of a legitimate (carve-out) pattern. Only 3/12 (in `inverse-edge-fix.md` Connections rows) are actual vault→vault inter-graph edges using an off-catalog name. The 12-vs-3 distinction changes what AC-N has to absorb and what §9 B-1 has to reconcile. |
| **NF-6 [minor]** AST authority for fence detection | §4.2 final sentence ("AST parser is the authority on fence boundaries. Manual regex-based fence detection is forbidden.") | **Closed.** Explicit. **Adequate.** |
| **Regression-1** D-3 inflated wording | D-3 re-written with "Demoted this round" + "conditional on §9 catalog-reconciliation closure" inline | **Closed.** D-3 itself carries the conditional. A reader of D-3 alone does not get the inflated form. **Adequate.** |
| **Regression-2** TD-9 (sampling of body links) | Still unmeasured | **Not addressed.** TD-9 still says "Unchanged" in §6. Not promoted to a sampling commitment. Minor — out of scope for this round's structural demotion focus, but worth flagging that a v0.2 round should size the migration. |
| **Regression-3** Marker syntax frozen-as-standard | TD-11 + OQ-14 | **Closed via TD-11/OQ-14 above.** |

**Score: 7/9 fully closed, 1 partial (NF-5), 1 unchanged (Regression-2).**

The NF-5 partial-closure is the only one that affects writer-readiness; Regression-2 is a known carry-forward.

---

## New R3 findings

### NR3-1 [major] §9 B-1 sub-item 2 conflates three semantically distinct categories of "off-catalog edge"

- **Location.** Explorer §9 B-1 sub-item 2 ("`proposes-edit` lives in 12 uses across 6 files including `ontology-conventions.md` §8 prose lines 297, 303"); AC-N "Posture" first sentence repeats the 12-uses framing.
- **Claim under attack.** The framing treats the 12 occurrences as a homogeneous bucket of off-catalog drift requiring a single absorb-or-reject decision. They are not.
- **Evidence — actual line-level enumeration.**
  - `rg -n 'proposes-edit' vault/ontology-conventions.md` → **2 hits, both prose examples in the §8 carve-out paragraphs** (line 297: "MAY declare forward edges (\`cites\`, \`operationalized-by\`, \`proposes-edit\`, etc.) targeting \`.claude/skills/**\`"; line 303: same list). These are not edges. They are illustrative mentions inside a carve-out rule that names `proposes-edit` as a valid example of the kind of forward-only edge the carve-out admits.
  - `rg -n 'proposes-edit' vault/discovery/domainspec-strategy-definitions/research/agents-strategy-prior-version.md` → **1 hit at line 226** — actual `## Connections` row, target is `.claude/skills/custom/frontmatter.md`. This is a **legal-by-design carve-out edge** per the constitution lines 297/303. Not off-catalog drift; in-corpus pattern.
  - `rg -n 'proposes-edit' vault/discovery/curator-pipeline-integration/discovery.md` → **2 hits, both in prose explaining the carve-out** (lines 243, 263). Not edges.
  - `rg -n 'proposes-edit' vault/discovery/documents-metadata-enforcement/documents-metadata-enforcement.md` → **1 hit at line 190**, prose-mention inside the resolution paragraph. Not an edge.
  - `rg -n 'proposes-edit' vault/discovery/_backlog.md` → **3 hits at lines 114, 123, 159**, all prose-discussion of the edge name itself (the backlog tracks "Category E" edges including this name). Not edges.
  - `rg -n 'proposes-edit' vault/discovery/inverse-edge-fix/inverse-edge-fix.md` → **3 hits at lines 203, 204, 205** — three actual `## Connections` rows, targets are vault files (`ontology-conventions.md`, `confidence-levels.md`, `ontology-architecture-draft.md`).
- **Total: 12 hits. Breakdown: 8 are prose mentions (carve-out examples, resolution prose, backlog discussion); 1 is a legal-by-design forward-only edge into `.claude/skills/**`; 3 are actual vault→vault Connections rows in `inverse-edge-fix.md` using `proposes-edit` to mean "this discovery proposes to add a `## Connections` block to this file."**
- **Why this matters operationally.**
  - The 8 prose mentions are invisible to any title-based derivation pipeline (they have no `[text](path "proposes-edit")` form — they're inline-code-fenced `` `proposes-edit` `` tokens in body prose). The §4.1 pipeline as specified would not see them at all. They are noise in the count.
  - The 1 carve-out-target edge is constitutionally legal under §297/§303 and is *not* off-catalog in the operational sense — it's a use of a name the constitution itself authorizes by example.
  - The 3 actual vault→vault edges in `inverse-edge-fix.md` are the only load-bearing operational concern. They are also tabular `## Connections` rows, not body-prose `title`-attribute links. The §4.1 pipeline as specified parses body-prose `title` attributes; it would NOT see these 3 rows either, because they're inside `## Connections` sections which §4.2 forbidlist explicitly skips.
- **Consequence for the writer.** §9 B-1 sub-item 2 as written commits the sibling catalog-reconciliation node to "decide route a or b on 12 uses." The sibling node will discover that 8 are not edges, 1 is a legal-by-design carve-out, and 3 are inside `## Connections` blocks the derivation pipeline skips by §4.2. The actual decision is: do we want `proposes-edit` as a Connections-table-only edge name for the "this discovery proposes to add" semantic that `inverse-edge-fix` Tier 1 currently expresses? That is a much smaller, more answerable question than "absorb-or-reject 12 uses."
- **Recommendation.** Writer either (a) replaces "12 uses across 6 files" with the 8/1/3 breakdown and re-scopes the sibling node's job to "decide on the 3 `inverse-edge-fix.md` Connections rows + the 1 carve-out-target edge"; OR (b) accepts the inflated count and adds a footnote that the prose-mentions are inert under the §4 pipeline. Either is fine; the silence is what the writer must not preserve.
- **Severity.** Major — not blocking, because the sibling catalog-reconciliation node will discover the breakdown on its own, but it pollutes B-1's "test of done" and could trigger unnecessary constitution edits if the sibling node takes the explorer's framing at face value.

### NR3-2 [minor] §4.3 dedup mechanism does not handle multi-physical-site same-pair-same-type within a single source file

- **Location.** §4.3 "Multi-edge same-pair, same-type dedup (`cites` ×3 → 1 row): Unchanged from Round 2 §4.3 (first-occurrence rule, TD-7 alternatives). Note: this is the *non-symmetric* dedup; `contradicts` dedup is the canonical-pair rule above."
- **Claim under attack.** The §4.3 mechanism for `contradicts` resolves the cross-document case (A.md links to B.md, B.md links to A.md) cleanly. But it inherits the Round-2 "first-occurrence" rule for same-pair-same-type, which is well-defined only when there's one source file. For `contradicts` specifically, the cross-document symmetric case can compose with the multi-site case: `A.md` could have two `[B](B.md "contradicts")` links in §3 and §7 (different reasons), AND `B.md` could have one `[A](A.md "contradicts")` link in §5. The pipeline emits 3 edges. Canonical pair groups them. Then which description wins?
- **Operational walkthrough.** Step 3 of §4.3 says "the description from the alphabetically-first source." If A is alphabetically first, that resolves to "A's description." But A has two descriptions (from §3 and §7). The first-occurrence rule from Round 2's same-pair-same-type dedup (different document, same canonical pair) would presumably pick A's §3 enclosing sentence — but the §4.3 spec doesn't explicitly compose the two dedup rules.
- **Why this matters.** `contradicts` is the catalog's "most valuable edge type." Symmetric edges that are load-bearing enough to mention in two different sections of the same document and then get re-mentioned on the other side are precisely where the rationale is dense. The composition of (canonical-pair-source-wins) × (same-source-first-occurrence) is a defined function once written out, but the spec asserts the rule rather than tracing the composition.
- **Recommendation.** The writer either explicitly states "for `contradicts`, after canonical-pair-source selection, the same-source first-occurrence rule applies as for any other same-pair-same-type dedup" — a one-sentence addition — OR adds an OQ for the composition. Not blocking; trivial to compose.
- **Severity.** Minor. §4.3 is operationally implementable on the cross-document symmetric case; the multi-site composition is a one-sentence gap.

### NR3-3 [minor] B-2 escalation rule's test is itself partially internal

- **Location.** §9 B-2 escalation rule: "Escalates to blocking if Round-3 reviewers find §4 elements that are *internally* contradictory (not merely sketch-level)."
- **Test executed.** I walked §4.1 through §4.5 looking for internal contradictions (decisions that disagree with each other within §4 itself):
  - D-7 element 4 (table-cell first cell content) vs OQ-15 ("Is D-7 fallback element 4 operationally tractable?"). OQ-15 surfaces uncertainty *about* element 4 but does not contradict it — it admits the rule may not fit all 76 files with body tables. This is *known sketch-level uncertainty*, not an internal contradiction.
  - D-2 ("never hand-edited") vs §4.4 ("If markers absent … tool inserts them" — now in TD-11). D-2 says the section is regenerated, never hand-edited; TD-11 admits the marker convention isn't decided. These are in tension on the question of "what happens on first run against a file with no markers" but the explorer flags TD-11 as the unresolved item rather than asserting both. Not internally contradictory; honestly deferred.
  - §4.3 step 4 (projection materializes one row on each endpoint) vs §4.4 (inverse-write discipline) — consistent; §4.3 specifies the per-pair logic, §4.4 specifies the per-file write discipline.
- **Verdict.** No unflagged internal contradictions found. The near-contradictions (D-7 ↔ OQ-15; D-2 ↔ TD-11) are explorer-flagged with paired escape valves. **B-2 does not escalate.**
- **Concern.** The escalation rule itself is loosely worded: "internally contradictory (not merely sketch-level)" requires a Round-3 reviewer to discriminate. The discrimination is judgment-based; a different Round-3 reviewer could reasonably classify D-2-vs-TD-11 as a soft contradiction. The writer should either tighten the escalation rule (e.g., "two §4 statements that cannot both be true given a single resolution path") or accept the judgment-call structure.
- **Severity.** Minor.

---

## §4 demotion honesty test

Paragraph-by-paragraph read of §4 to test whether the "Operational sketch" demotion is honest (signals prototype-dependency, admits uncertainty) or cosmetic (still reads as spec with a sketch hat).

**§4 opening "Honesty admission" paragraph:** "This is concrete enough to attack but not concrete enough to implement without prototype contact on 5 vault files. No `vault-ctl edges derive` exists (TD-2). At least three Round-2 reviewer findings (NF-1 invented marker convention; NF-2 enclosing-sentence undefined for ~33 link sites; NF-3 `contradicts` dedup mechanism unspecified) are precisely the class of gap that prototype contact would surface." **Verdict: honest.** Quotes my own NF-1/2/3 verbatim; admits no prototype contact; admits "at least" without claiming completeness. Score: **5/5 sketch.**

**§4.1 IO contract.** Reads partly as spec (Inputs/Outputs/Failure-modes enumerated with concrete syntax) and partly as sketch (the "Regenerated region — unresolved" paragraph with three surfaced exits + "Round-3 reviewers may attack the punt"). The exits-and-attack-invitation is genuine sketch language. The Inputs/Outputs sections are spec-shaped but the unresolved region puts the load-bearing item (marker convention) explicitly into sketch territory. **Mixed but defensible — the spec-shaped subsections are the ones that genuinely are implementable now; the sketch-marked subsection is the genuinely unresolved one. The demotion is honest at the per-element level.** Score: **4/5 sketch.**

**§4.2 syntax constraints.** Reads as spec. Brief paragraph, points to Round-2 content, adds the NF-6 AST-authority closure. This subsection is genuinely implementable now (per my R2-R2 §4.2 scoring) and the spec-shape is honest — there's nothing sketch-level here. **Spec-shaped where spec is warranted.** Score: **n/a — honest spec is honest.**

**§4.3 edge-class handling.** Reads as spec for the per-class rules (retrofits / subclass-of / carve-outs / acyclicity — all delegated to existing machinery) and as spec for the `contradicts` mechanism (5 numbered steps, deterministic). The "Trade-off" paragraph at the end ("alphabetically-first description wins is deterministic but information-lossy. Authors are warned via derive-report. The alternative … doubles the row width … rejected for v1") is real engineering-pick reasoning, not sketch hedging. **This is the part where the sketch demotion is least visible — and that's appropriate, because §4.3 is the one place this round actually closed an operational gap.** Score: **n/a — honest spec on the fixed item.**

**§4.4 inverse-write discipline.** Reads as sketch — the load-bearing decision (marker insertion) is explicitly punted with three options (a/b/c) per NF-1 closure. **Honest.** Score: **5/5 sketch.**

**§4.5 D-9 on-build.** Reads as spec for the decision + new sentence cite of constitution §8 for reversibility (closes N-6). Decision is implementable; the merge-conflict footprint deferral (Round-2 DV2-5) is a documented v1 limit, not a sketch hedge. **Honest spec.** Score: **n/a.**

**Overall demotion honesty.** The "Operational sketch" headline matches the body. The sections that are *actually* sketch (§4.1 regenerated-region, §4.4 marker insertion) read as sketch with explicit exits. The sections that are *actually* spec (§4.2 syntax, §4.3 mechanism, §4.5 decision) read as spec and are properly implementable. The demotion does not blanket-soften everything — it concentrates sketch-marking on the genuinely unresolved items. **The demotion is honest, not cosmetic.**

---

## Fallback chain walkthrough

Testing D-7's 5-element fallback chain against real vault examples.

### Level 1 — Enclosing sentence in body prose
- **Real example.** `vault/discovery/subagents-strategy-refinement/research/discovery.md` line 30: "Before the v0.3.0 backport of R29/R30/R31 (base constitution at [`domainspec-subagents-strategy-constitution.md`](../../../constitution/domainspec-subagents-strategy-constitution.md): `version: 0.3.0` line 8; R29 line 480, R30 line 497, R31 line 507)…"
- **Behavior.** Link sits inside a complete sentence. Enclosing sentence is well-defined. Description = the full sentence (likely >120 chars, hits the 40% truncation case from D-7 carry-forward).
- **Verdict.** **Well-defined.** Adequate.

### Level 2 — Standalone list item (32 measured cases)
- **Real example.** `vault/ontology-architecture-draft.md` lines 31-34 (TOC):
  ```
  - [The Agents & Their Roles](#1-the-agents--their-roles)
  - [The Gates of Trust](#2-the-gates-of-trust)
  ```
- **Behavior under rule 2 ("link text becomes description").** Description = "The Agents & Their Roles". Clean, short, semantically accurate.
- **Verdict.** **Well-defined and operationally good.** For TOC-style standalone bullets, the link text *is* the description.
- **Edge case I tested:** multi-link list items. `rg -n '^\s*- .*\[[^\]]+\]\([^)]+\).*\[[^\]]+\]\(' vault` returns 4+ hits like `subagents-strategy-refinement/research/discovery.md:30` which is actually a sentence-shaped bullet with two links. Rule 1 handles it (enclosing sentence exists; the rule is "enclosing sentence", which inside a list-item bullet is the bullet's prose). Rule 2 only kicks in when the link IS the entire list item. **The rules compose cleanly because rule 2's match condition is strict.**

### Level 3 — Inside a markdown header (1 measured case)
- **Real example.** `vault/discovery/subagents-strategy-refinement/research/discovery.md` line 101: `### Step-by-step (numbering matches [`research/SKILL.md`](/Users/victorboscaro/domainspec-theorem/.claude/skills/research/SKILL.md) §Lifecycle)`
- **Behavior under rule 3 ("header text becomes description").** Description = "Step-by-step (numbering matches `research/SKILL.md` §Lifecycle)" or similar parse-out. The header text *is* informative.
- **Verdict.** **Well-defined for the 1 measured case.** Target is `.claude/skills/**` (carve-out forward-only — wouldn't be a vault edge anyway under the constitution), so this exact case wouldn't fire the derivation pipeline in practice. The rule is still well-defined if it ever does.

### Level 4 — Inside a body table cell (448 link sites, 76 files)
- **Real example.** `vault/foundational-knowledges.md` line 98: `| Category theory | Functor `Δ : L₁ → L₂` between domain and code categories | [.claude/agents/domainspec-l1-extractor.agent.md](../.claude/agents/domainspec-l1-extractor.agent.md), `domainspec-l2-extractor`, `domainspec-delta-extractor` |`
- **Behavior under rule 4 ("row's first cell content; if link is itself in first cell, table caption or preceding paragraph").** Link is in the *third* column. First cell content = "Category theory". Description = "Category theory". **Loses the "Contribution" middle-column context** which is arguably the load-bearing rationale.
- **Verdict.** **Well-defined but information-lossy in a way that's worse than Level 1's 120-char truncation.** Whole table rows have semantic structure that the "first cell only" rule discards. The explorer's own OQ-15 surfaces this: "in practice, body tables in vault files have varied first-column semantics (some are labels, some are categories, some are paths)." The rule terminates; it just doesn't terminate well.
- **Counter-example for "link in first cell."** `vault/foundational-knowledges.md` line 99: `| Graph theory | … | [TAXONOMY.md](../TAXONOMY.md), [RELATIONSHIPS.md](../RELATIONSHIPS.md), [.claude/skills/custom/edge-catalog.md](../.claude/skills/custom/edge-catalog.md) |` — three links in one cell. First-cell = "Graph theory". All three links get the same description. **The rule doesn't distinguish co-cell-resident links from each other.**
- **Stress case I tested.** `vault/foundational-knowledges.md` is one big set of tables with link-bearing rows; the derivation pipeline running rule 4 against this file would emit ~30 edges all with cell-1 descriptions. Many of these target `.claude/**` so they're carve-out (not vault graph), but for the vault→vault subset, the descriptions would be category labels ("Category theory", "Graph theory", "Ontology engineering") with no rationale.
- **Verdict.** **Defined but the OQ-15 admission of "may not fit all 76 files" is operationally accurate. Writer should preserve OQ-15 as live.**

### Level 5 — None of the above (empty + warning)
- **Likelihood of hitting this in practice.** Rule 1 (enclosing sentence) is generous; rule 2 (standalone bullet) is specific; rule 3 (header) is specific; rule 4 (table cell) is broad. The set of links that hit none of (1–4) is small — links inside blockquotes that aren't sentences, links inside HTML blocks, links inside frontmatter (but §4.2 already forbids frontmatter).
- **Verdict.** **Adequate as a terminator.** Returns a defined value (empty + warning); honest about the residue.

**Overall chain verdict.** The chain *does* return a defined value for every link site I could find in the vault. Rule 4 has the worst quality (loses cross-column rationale on table rows) and OQ-15 honestly admits this. Rule 5 is the residue terminator. **The chain is operationally well-formed at the "returns a value" level; the value quality varies by element, with rule 4 being weakest.** The writer should preserve OQ-15 in the final discovery as live, not as resolved.

---

## §4.3 dedup adversarial test

Three cases that stress the §4.3 dedup mechanism.

### Case 1 — Cycles in `contradicts`-like dedup
- **Setup.** A.md contains `[B](B.md "contradicts")` and `[C](C.md "contradicts")`. B.md contains `[A](A.md "contradicts")` and `[C](C.md "contradicts")`. C.md contains `[A](A.md "contradicts")` and `[B](B.md "contradicts")`. 6 emitted edges, 3 canonical pairs (A-B, A-C, B-C). All three pairs would have dedup independently.
- **Does §4.3 handle?** Yes — `contradicts` is symmetric and N:M per the catalog (Appendix C row). Step 5's "acyclicity / triangle / self-loop invariants run after projection" — but `contradicts` is symmetric, so the acyclicity invariant doesn't bite (it's a *directed* edge property). Triangle (3-cycle) detection is mentioned but `contradicts` triangles are valid (three documents that pairwise contradict). The §4.3 spec correctly delegates to existing `vault-ctl cycles check` which presumably treats `contradicts` separately.
- **Verdict.** **Handled correctly by deferral to existing tooling.** No new failure mode introduced.
- **Gap.** §4.3 step 5 says "acyclicity / triangle / self-loop invariants" without saying which apply to `contradicts`. Writer should clarify that `contradicts` is exempt from acyclicity and triangle checks. Minor.

### Case 2 — Same-pair, same-type, multiple physical link sites in both source documents
- **Setup.** A.md has two `[B](B.md "contradicts")` in §3 and §7 (two different reasons). B.md has one `[A](A.md "contradicts")` in §5. Total: 3 emitted edges, all in canonical pair (A, B) assuming A < B alphabetically.
- **Does §4.3 handle?** Step 3 says "the description from the alphabetically-first source." That's A. A has two descriptions. The §4.3 spec then says "this is the *non-symmetric* dedup [for same-source]; `contradicts` dedup is the canonical-pair rule above" — meaning the two A-side descriptions need to be deduped *first* by the non-symmetric rule (first-occurrence = §3's sentence), then the canonical-pair rule picks A's §3 description over B's §5 description. **The composition is well-defined if you trace it; the spec asserts it without tracing.**
- **Verdict.** **Defined-but-not-stated.** Per NR3-2 above. Writer should add a one-sentence composition rule.

### Case 3 — Dangling target inside a `contradicts` symmetric pair
- **Setup.** A.md contains `[B](B.md "contradicts")`. B.md does not exist (typo, deleted file, future file).
- **Does §4.3 handle?** §4.1 failure modes say "Dangling target → warning, edge materialized with `[dangling]` suffix in the Type column." For `contradicts`, this means: emit `(A, B, contradicts)` with `[dangling]` flag; canonical-pair step still runs (A < B alphabetically since B.md doesn't exist as a file but A < "B.md" as a string); projection step *would* materialize an inverse on B.md but B.md doesn't exist. **What happens to the projection?**
- **Does §4.3 say?** §4.1 says dangling is "not an error" (just a warning). §4.3 step 4 says "materialize one row on each endpoint's `## Connections` section" — but B.md has no endpoint. Implicit: skip the inverse projection for dangling targets, materialize only the source-side row with the `[dangling]` flag.
- **Verdict.** **Underspecified, but reasonable inference is available.** Writer should make the inference explicit: "for dangling-target symmetric edges, the canonical-pair step is short-circuited; only the source-side row materializes with the dangling flag."
- **Severity.** Minor — fixable in one sentence in the final discovery.

**Overall dedup verdict.** §4.3 handles the canonical 2-document symmetric case (CV-2/SY-2 from Round-2 robot-talks) cleanly. Three stress cases each produce a "defined but the composition is implicit" or "underspecified at the failure-mode boundary" result. None are blocking; all are fixable in 1-2 sentences in the final discovery.

---

## D-7 stays "decided" + TD-12 marks fallback chain as sketch-level — coherent or contradictory?

The question raised in the dispatch: is D-7 (decided) + TD-12 (sketch-level fallback chain) a legitimate split or a contradiction?

**Analysis.** D-7 commits to "option (a) — enclosing sentence, with fallback rules (extended this round)." TD-12 says "the 5-element chain in D-7 is deterministic on paper but sketch-level pending prototype." These are not contradictory **if** "decision" refers to the *strategy* (option a + fallback chain shape) and "sketch-level" refers to the *quality of each rule when run against real corpus*. That's a defensible split: we've decided we will use a fallback chain in this shape; we admit each rule may need tuning when we actually run it.

**Test by analogy.** D-9 is "decided" (on-build for v1) and the §4.5 deferral of merge-conflict footprint is "documented v1 limit." Same split structure: decision firm, edge-case quality acknowledged. The community accepted that for D-9. The same logic applies to D-7 + TD-12.

**Verdict.** **Coherent split, not a contradiction.** The writer can carry both into the final discovery.

**Caveat.** The wording of TD-12 ("Cases like 'link is the entire bullet' vs 'link is one of several inline links in the bullet' are not separately resolved") is sloppy — the chain *does* resolve both (the "entire bullet" case hits rule 2; the "one of several inline links" case is inside an enclosing sentence and hits rule 1). The TD-12 wording invents a problem the chain doesn't actually have. Writer should tighten TD-12 to focus on rule 4 (table cell) where the actual quality concern lives.

---

## B-2 escalation test

The escalation rule: "If Round-3 reviewers find specific §4 sketch elements that are *internally* contradictory (not merely sketch-level), B-2 escalates to blocking."

**Executed in NR3-3 above.** Walked §4.1–§4.5 looking for internal contradictions. Two near-misses (D-7 ↔ OQ-15; D-2 ↔ TD-11), both explorer-flagged with paired escape valves. **No unflagged internal contradictions found. B-2 does not escalate.**

**Meta-concern about the escalation rule itself.** "Internally contradictory (not merely sketch-level)" is judgment-bound. A more rigorous reviewer might classify TD-11 (marker convention undecided) + D-2 (never hand-edited) as a soft contradiction, since D-2's "never hand-edited" property cannot be verified without the marker convention being specified. I do not classify it as a contradiction because TD-11 explicitly punts and §4 opening admits prototype-dependency — the contradiction is *flagged*, which is exactly what sketch-level commitment is supposed to do. But the rule's discrimination criterion is loose.

**Writer guidance.** Either tighten the B-2 rule ("two §4 statements that cannot both be true given a single resolution path within §4's surfaced exits") or accept the judgment-call structure and add a one-line gloss like "Sketch-level + explicitly-deferred = not a contradiction; spec-asserted + mechanically-unreachable = contradiction."

---

## AC-N conditional on §9 — what does the tool do TODAY on a corpus with live `proposes-edit` uses?

The dispatch question: from operational standpoint, what does the tool do when running on a corpus with 12 live `proposes-edit` uses while §9 is still open?

**Answer informed by NR3-1.** Of the "12 uses":
- **8 are prose mentions** (inline-code-fenced `` `proposes-edit` `` tokens in body prose, NOT markdown links with a title). The §4.1 pipeline parses inline links with title attributes (per §2 syntax). Prose mentions never enter the pipeline. **Tool ignores them entirely.** Zero edges affected.
- **1 is a forward-only edge into `.claude/skills/**`** (target = `.claude/skills/custom/frontmatter.md`). Per the constitution §8 carve-out, this is a legal forward-only edge. Per §4.1 + the carve-out predicates loaded from `vault_common.frontmatter.carveouts`, the pipeline would either (i) recognize the carve-out and emit the edge as forward-only with no inverse, OR (ii) — if the edge is currently authored as a `## Connections` table row (which it is per `agents-strategy-prior-version.md` line 226) rather than as a body-prose title-attribute link — be skipped entirely by §4.2's "in-`## Connections`-forbidden" rule. **Tool either skips (current authoring form) or accepts as carve-out (if re-authored as body link).** No deletion.
- **3 are `## Connections` table rows in `inverse-edge-fix.md`** targeting vault files. Per §4.2's "in-`## Connections`-forbidden" rule, these are inside the `## Connections` section. **The pipeline does not parse them as edges.** They are also not body-prose typed links. **Tool ignores them on parsing.** But: when the pipeline regenerates the `## Connections` section, it replaces the entire section content (modulo TD-11 marker convention). **These 3 rows would be deleted by regeneration if `inverse-edge-fix.md` becomes a target of the pipeline AND the marker convention is "full section regeneration" (TD-11 exit b).** Under TD-11 exit a or c, they would survive outside the markers.

**Net answer.** With §9 open and the marker convention not picked (TD-11), running the tool today either silently deletes 3 rows in `inverse-edge-fix.md` (if exit b is picked) or preserves them as hand-authored content (if exit a or c). The other 9 "uses" are not edges and are unaffected. **The "12 uses → silent deletion" framing in Round-2 robot-talks SY-1 was over-stated; the actual operational exposure is 3 rows, conditional on TD-11 exit.**

**Writer guidance.** The final discovery should state the operational exposure honestly: "Running the tool today against the corpus, with TD-11 unresolved, exposes 3 hand-authored `## Connections` rows in `inverse-edge-fix.md` to deletion under TD-11 exit (b). The other 9 corpus occurrences of `proposes-edit` (8 prose mentions; 1 forward-only carve-out edge) are not edges under §4 and are unaffected."

---

## §8 Reframings operational translation

Do R-1 (pointer/rationale split) and R-4 (three pipelines) translate to operational consequences that the §4 sketch reflects?

### R-1 (pointer/rationale split)
- **Reframing claim.** SoT is right for pointer (type+source+target); decomposition-when-warranted is right for rationale (description).
- **Operational translation in §4.** §4.3 step 3 "alphabetically-first description wins" is a SoT-for-rationale decision. The rejected alternative (concatenate both descriptions as `description-source`/`description-target`) is precisely the decomposition R-1 names as legitimate. **§4.3 picks SoT for v1 with the decomposition as documented fallback (TD-10).** The reframing is reflected: R-1 says decomposition is not defeat; TD-10 names the decomposition path as the documented fallback if the discard rate proves high. **Translated.**
- **Gap.** R-1 says "the *reason* to prefer (a) is 'lower amendment cost for v1,' not 'SoT is intrinsically better.'" The §4.3 trade-off paragraph still leans on SoT framing ("doubles the row width and complicates the rendered table"). The R-1 reframing would have it lean on "v1 amendment cost." Minor wording gap; the operational logic is correct.

### R-4 (three pipelines)
- **Reframing claim.** Materialization + validation + bootstrap are three pipelines with three independent timing choices.
- **Operational translation in §4.** §4.5 D-9 commits to "on-build for v1" as one decision covering all three. R-4 explicitly names this as over-committing. **§4 does NOT decompose D-9 into three timing decisions.**
- **Gap.** R-4 says "D-9 may be over-committing because it picks one timing for three things." But the explorer does not act on this reframing in §4.5 or §5 D-9. The reframing is named in §8 but not operationalized into §4 or §5. **This is a partial decoupling — the reframing identifies an attack vector that §4 has not addressed.**
- **Severity.** Minor — the writer can either (a) decompose D-9 into D-9a (materialization timing), D-9b (validation timing), D-9c (bootstrap timing) and keep all three on-build for v1, OR (b) leave D-9 as-is and add a note that R-4's three-pipeline decomposition is a Round-4 candidate. Either is fine; the silence (D-9 unchanged + R-4 surfaced without operational follow-through) is what the writer should resolve.

### R-2 (drift = rate, not distance) and R-3 (catalog as co-evolving artifact)
- **R-2 operational translation.** §1 "Why now" still leans on distance framing but R-2 explicitly admits the limit ("Inverting authority moves the symptom; it does not on its own change the rate"). The honesty is in §8, not in §1. **Adequate at the reframing level; §1 prose still inherits the distance frame.** Writer could re-tune §1 to lead with rate-and-mechanization framing; minor.
- **R-3 operational translation.** §9 B-1 IS the operationalization. D-3 demotion IS the operationalization. AC-N + AC-8 dependency-extension ARE the operationalization. **R-3 is fully translated.**

**Overall.** R-1 and R-3 are translated into §4/§5/§9. R-2 is admitted but §1 framing not retuned. R-4 is named but D-9 not decomposed. The writer has visible work on R-2 wording and R-4 follow-through, but neither is blocking.

---

## Writer readiness from operational side

**Yes — with three documented hand-offs.**

The writer can compose the canonical `discovery.md` from this without inventing new operational claims, provided they carry forward the following items the explorer surfaced but did not fully resolve:

1. **NR3-1 — `proposes-edit` count breakdown.** The writer must either replace "12 uses across 6 files" with the 8/1/3 breakdown OR add a footnote distinguishing prose-mentions from carve-out-edges from vault→vault rows. This affects §9 B-1 sub-item 2 and AC-N's scope.

2. **NR3-2 — composition of canonical-pair + first-occurrence dedup rules for `contradicts`.** One sentence in §4.3 stating that for `contradicts`, the same-source first-occurrence rule applies after canonical-pair-source selection.

3. **R-4 unfinished translation.** Either decompose D-9 into three timing decisions or note that the three-pipeline decomposition is a Round-4 follow-up. The writer should not silently elide R-4's attack vector.

**What operational facts are still missing from §4 (and the writer must NOT invent):**
- Whether TD-11 marker convention exit (a/b/c) is picked. Writer carries the three exits forward as live.
- Whether the §4.3 dedup discard-rate is empirically tolerable. Writer carries TD-10 forward as live.
- Whether D-7 fallback element 4 (table cell) is operationally tractable for all 76 files. Writer carries OQ-15 forward as live.
- Whether B-2 prototype-contact actually happens. Writer carries B-2 forward as recommendation, not commitment.
- Sequencing of `inverse-edge-fix` Tier 1 (continue / pause / redirect). Writer carries AC-9-bis + OQ-16 forward as live.

**What operational facts ARE settled enough for the writer:**
- §4.1 IO contract shape (inputs/outputs/failure modes) — implementable.
- §4.2 syntax forbidlist + AST authority — implementable.
- §4.3 contradicts mechanism (mod the NR3-2 one-sentence gap) — implementable.
- §4.5 D-9 on-build for v1 + constitution cite — implementable.
- D-1 through D-11 decisions — committed.
- AC-1 through AC-N candidates — surfaced, not drafted (per discovery-structure constitution §6).
- §9 B-1 blocker structure (3 sub-items, test of done) — operationalizable as sibling-node spec.

---

## Strongest residual concern

**The §9 B-1 sub-item 2 framing is the only thing that could leak into downstream work as a miscalibrated demand.** A sibling catalog-reconciliation node taking the explorer's "12 uses across 6 files" framing at face value would budget for absorbing 12 catalog entries; the actual decision is about 1 carve-out edge (already legal per the constitution) + 3 vault→vault Connections rows in a single file + a possible catalog amendment for the "this discovery proposes to add" semantic. The breakdown changes the sibling node's scope by an order of magnitude.

This is one paragraph for the writer to fix — but if the writer carries the inflated framing forward verbatim, downstream cost is real.

---

## What Round 3 got right

- **§4 demotion is honest at the per-element level.** Spec-shaped subsections (§4.2, §4.3 mechanism, §4.5 decision) stay spec where spec is warranted; sketch-marked subsections (§4.1 regenerated-region, §4.4 marker insertion) carry explicit exits + attack invitations. Not blanket-softening.
- **NF-3 closure is the strongest single piece of this round.** §4.3 `contradicts` mechanism is specified end-to-end (5 numbered steps + canonical-pair rule + dedup tie-breaker + warning + validation), AC-10 lifts the posture change explicitly, D-11 commits the decision, OQ-2 closes — composite fix as Round-2 robot-talks SY-2 demanded. The trade-off paragraph is real engineering reasoning, not hedging.
- **D-3 demotion in its own sentence (R2-R2 Regression-1 + R2-R1 N-5 closure).** Per CLAUDE.md subset rule. The conditional now lives inside D-3, not in a sibling OQ.
- **§9 B-1 "Operational specification of the blocker" sub-paragraph.** Three concrete file-level checks (count consistency, `proposes-edit` decision, source-type column) — not a vague "the catalog is reconciled." Operationally testable. (Modulo the NR3-1 framing fix.)
- **§8 Reframings as metacognitive contribution.** R-3 catalog-as-co-evolving-artifact is the load-bearing reframing and it shaped §9. R-1 pointer/rationale split landed in TD-10. R-2 and R-4 are surfaced honestly even where the §4 body doesn't fully act on them.
- **AC-9-bis + OQ-16 honestly punting Tier 1 sequencing to §9 closure.** "Conjecture, not commitment" is the right honesty level when the dependency is upstream.
- **§Connections table is now catalog-conformant (modulo the documented `governed-by` row caveat).** R2-R1 N-1/2/3 closed; the `governed-by` from a `research` source is held with an explicit "raised as sub-item of §9 B-1 sub-item 3" note rather than silently violating the catalog.
- **B-2 escalation rule is an invitation to Round-3 reviewers** — and the invitation is honored (I executed it). The rule is judgment-bound but the explorer surfaced that openly via OQ-15 / TD-12 / OQ-16.

---

## Connections

> Per the proposal's own logic this would be derived. It isn't (TD-2). Hand-authored in legacy form, restricted to `cites` per the catalog's source-type column for a `research` node.

| Document | Type | Description |
|----------|------|-------------|
| [explorer.md](explorer.md) | `cites` | Round-3 explorer being reviewed. Verdict: accept-with-revisions (minor). 7/9 R2 findings fully closed; 1 partial (NF-5 count-framing → NR3-1); 1 unchanged (Regression-2 TD-9). §4 demotion honest at the per-element level. Three writer-ready hand-offs: NR3-1 (count breakdown), NR3-2 (dedup composition sentence), R-4 follow-through (decompose D-9 or note Round-4). Inverse `cited-by` to be added at promotion. |
| [../round-2/reviewer-2.md](../round-2/reviewer-2.md) | `cites` | Round-2 R2 review whose 6 NF + 3 Regression findings were the closure-check basis for this round. NF-1/2/3 closed via TD-11+OQ-14, D-7 fallback chain, §4.3 mechanism + AC-10. NF-4/5 closed partial; NF-6 closed. Regression-1 closed; Regression-2 unchanged. Inverse `cited-by` to be added at promotion. |
| [../round-2/robot-talks.md](../round-2/robot-talks.md) | `cites` | Round-2 synthesis whose two structural demotions (§4 → sketch, OQ-10 → blocker) were the Round-3 preconditions. Both executed. 10-item revision agenda addressed; B-2 escalation rule tested (does not escalate). DM-3 graduation drove §8 R-3 which drove §9 B-1. Inverse `cited-by` to be added at promotion. |
| [../../../../ontology-conventions.md](../../../../ontology-conventions.md) | `cites` | Appendix C edge catalog (with 21/22/25 count residue + carve-out for `.claude/skills/**` at §8 lines 297/303) is the operational baseline. Evidence for NR3-1's 8/1/3 breakdown comes from `rg`-measured counts of `proposes-edit` occurrences across the corpus, distinguishing inline-prose mentions, carve-out forward-only edges, and tabular vault→vault Connections rows. Inverse `cited-by` to be added at promotion. |
| [../../../../discovery/inverse-edge-fix/inverse-edge-fix.md](../../../../discovery/inverse-edge-fix/inverse-edge-fix.md) | `cites` | NR3-1 evidence — 3 of the 12 `proposes-edit` occurrences are `## Connections` table rows in this file (lines 203-205). These are the only load-bearing operational exposure for the derivation pipeline under TD-11 exit (b); the other 9 occurrences are prose or carve-out. AC-9-bis + OQ-16 also reference this file's Tier 1 sequencing question. Inverse `cited-by` to be added at promotion. |
