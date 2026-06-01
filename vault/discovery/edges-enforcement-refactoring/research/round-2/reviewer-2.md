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

# Reviewer 2 (Round 2) — Operational Viability

> Independent skeptical review of `explorer.md` (Round 2). Lane: operational viability and edge cases — parser behavior, syntax coverage, IO contract concreteness, edge-class handling realism, derived-marker plausibility, tracked-debt load-bearingness. I did not read `reviewer-1.md` for this round; verdict is formed alone.

---

## Verdict

**accept-with-revisions** — Round 2 honestly closed R1-R2's *epistemically* load-bearing items (D-7 picked option (a), AC-3 named the a11y regression, AC-9 sized the partial supersession, §4.2 enumerated the syntax forbidlist). The new §4 operational spec is real progress over Round 1's hand-waving. But three Round-2-specific operational holes are blocking for v0.1 ship: (i) the `<!-- BEGIN/END derived -->` marker convention is **invented** (zero pre-existing use in vault) and the explorer never says so; (ii) the "first-occurrence enclosing sentence" rule (D-7) is silently undefined for ~33 links that have no enclosing sentence (standalone list items + header link + link-only table cells); (iii) the `contradicts` dedup story (§4.3) doesn't actually specify *how* the tool detects "the same edge" when authored from both ends — the spec uses the word "deduplicated" as if it were the rule. Round 3 must close these or admit them as open questions, not "tracked debt."

---

## Round 1 findings — addressed?

| R1-R2 Finding | Round 2 location | Adequacy |
|---|---|---|
| **F1 [block]** Description-field semantics is load-bearing, not TD-3. Pick (a), (b), or (c) explicitly. | D-7 (§5), TD-6, TD-7 | **Addressed.** D-7 picks option (a) and names the ~40% loss explicitly. TD-6 keeps (c) as a bounded escape hatch. Honest pick. **But:** D-7's "enclosing sentence" definition has new operational holes — see New Finding 2. |
| **F2 [major]** Title attribute = a11y/tooltip carrier; overload has user-visible cost. | AC-3 (§3), OQ-12 | **Addressed.** AC-3 explicitly states the repurposing forfeits tooltip-as-a11y; OQ-12 keeps the mitigation question open. Honest. |
| **F3 [major]** Reference-style and image links are not addressed. | §4.2 | **Addressed.** §4.2 enumerates 7 forbidden link forms (image, reference, shortcut, autolink, code-fenced, frontmatter, in-Connections) plus 5 in-scope cases (blockquote, body tables, anchors, path normalization). Strongest single piece of Round 2. |
| **F4 [major]** Inverse-write conflict footprint. | §4.4, §4.5, D-9 | **Partially addressed.** D-9 picks on-build for v1 (the conservative choice). §4.4 names marker discipline + atomicity. **But:** the actual merge-conflict scenario R1-R2 raised (two parallel branches both regenerate the same sink's `## Connections` block) is named via "on-build matches the existing operational rhythm" — that is a deferral, not a solution. See New Finding 3. |
| **F5 [major]** Same-pair same-type dedup rule unspecified. | §4.3 ("Multi-edge same-pair, same-type"), TD-7 | **Addressed at the rule level.** First-occurrence picked. **But:** "first occurrence in document order" is well-defined only for inline prose links; for body-table links it's ambiguous which row counts. Minor; flag below. |
| **F6 [major]** OQ-1 (forward-only) is load-bearing. | D-8 (§5), AC-7 | **Addressed.** D-8 picks forward-only authoring; inverse-name titles linter-rejected. Closes the dual-authoring drift. |
| **F7 [major]** OQ-6 (`inverse-edge-fix` relationship) is sequencing, not sibling. | D-10, AC-9, OQ-11, §Connections re-typed | **Addressed.** `cites` → `supersedes` (partial). Tier 2 dissolution stated. OQ-11 carries the Tier 1 sequencing forward. **But:** "partial" is not operationalized for Tier 1 in-flight work — see New Finding 4. |
| **F8 [minor]** Dangling-target behavior under-specified. | §4.1 ("Failure modes"), TD-5 | **Addressed.** Warning + `[dangling]` suffix in Type column. Clean. |
| **F9 [minor]** OQ-5 migration trap (links inside `## Connections` destroyed on regen). | OQ-5, §4.2 | **Addressed.** §4.2 names ignored-by-extractor; OQ-5 flags migration prerequisite. Adequate — migration is out of scope per D-6. |
| **F10 [minor]** `proposes-edit` used by explorer's own Connections, not in catalog. | §Connections re-typed to `refines` | **Addressed.** Explorer's own row is now `refines`. Honest. **But:** `proposes-edit` is still in use by **4 other vault docs** including `ontology-conventions.md` itself — see New Finding 5; the proposal claims to "preserve catalog unchanged" while the catalog has a quasi-canonical edge name that doesn't appear in Appendix C. |

**Score: 10/10 addressed at the surface level.** Two are partial (F4 deferred, F7 partial). One opens a new issue (F10 propagates a constitutional residue the proposal cannot fix).

---

## New findings (Round-2-specific)

### NF-1 [block] `<!-- BEGIN derived --> / <!-- END derived -->` marker convention is invented; explorer never says so

- **Location.** Explorer §4.1 ("…between `<!-- BEGIN derived -->` and `<!-- END derived -->` markers (placed inside the `## Connections` section)"), §4.4 ("Marker discipline").
- **Claim under attack.** The spec treats these HTML-comment markers as if they were an established convention. They are not.
- **Evidence — actual counts.** I ran `rg '<!-- BEGIN' vault` → **zero hits outside the edges-enforcement folder**. The markers exist nowhere in the 189 existing `## Connections` blocks. Similarly `<!-- END' vault` → zero outside this discovery. The convention is being **invented by this proposal** and the explorer presents it as if it were already-known machinery.
- **Why this matters.** Three things follow: (a) every existing `## Connections` block must be modified to insert the markers before the first `vault-ctl edges derive` run can be safely idempotent on it — that work is unscoped and §4.4 hand-waves it ("If the markers are absent on a file that becomes a target … the tool inserts them"). The "inserts them" sentence is doing all the work and is unspecified about where. (b) Some markdown renderers (notably GitHub's table-of-contents extractor, Obsidian's outline view) treat HTML comments as content boundaries differently; the choice that `<!-- BEGIN -->` survives all renderers is asserted, not verified. (c) The "Nothing outside those markers is touched" guarantee in §4.1 is load-bearing for D-2 ("never hand-edited") but is unverifiable without a marker-insertion convention that is **itself** specified.
- **Recommendation.** Round 3 must either (a) cite a markdown-convention prior art for `BEGIN derived`/`END derived` markers (Sphinx? mkdocs? Jekyll?) — I am not aware of one; (b) downgrade §4.1 from "between markers" to a candidate option and treat marker insertion as part of the migration debt; or (c) commit to inserting the markers as part of Tier 1 sink bootstrapping (sequencing with `inverse-edge-fix` Tier 1 — see OQ-11).

### NF-2 [block] "Enclosing sentence" is undefined for ~33 links that aren't in a sentence

- **Location.** D-7 ("description = enclosing sentence"), §4.3 ("first occurrence in document order").
- **Claim under attack.** Option (a) is "enclosing sentence" — but a meaningful fraction of vault links **have no enclosing sentence**.
- **Evidence — actual counts.**
  - `rg '^[\s-]*- \[[^\]]+\]\([^)]+\)\s*$' vault | wc -l` → **32 standalone list-item links** (the link is the entire list item; no surrounding prose). Samples: `vault/ontology-architecture-draft.md` table-of-contents bullets, `scope-and-domain-axes-evidence.md` reference-list bullets.
  - `rg '^#+ .*\[[^\]]+\]\(' vault | wc -l` → **1 header containing a link** (`subagents-strategy-refinement/research/discovery.md` step heading).
  - `rg '^\|.*\[[^\]]+\]\([^)]+\)' vault | wc -l` → **448 links inside table cells** (most are Connections rows; but 76 files have at least one body table with links — see counts above). The "enclosing sentence" of a table-cell link is undefined.
- **Why this matters.** If an author types a body-prose link in a list item or a comparison-table cell with a `"cites"` title, the derivation tool has no enclosing sentence to extract. D-7 commits to (a) but does not say what (a) returns in these cases. The implicit options are: empty description (silent information loss beyond the named 40%), error (breaks D-4 escape valve — many existing standalone bullet links would be valid edges that can't be derived), or "fall back to link text" (an unstated rule).
- **Recommendation.** Round 3 must extend D-7 with a tie-breaker: when no enclosing sentence exists, the description is (a) empty + warning, (b) the link text, or (c) the parent block's first sentence (list-item parent paragraph, table caption). Pick. Or admit standalone-bullet edges are out of scope for v1.

### NF-3 [major] `contradicts` symmetric dedup: spec uses the word as if it were the rule

- **Location.** §4.3 ("Symmetric edges: `contradicts` — … declared on either side is sufficient; the projection materializes the symmetric position on the other side; duplicate declarations (both sides author `"contradicts"` toward each other) are deduplicated post-derivation to a single canonical pair").
- **Claim under attack.** "Deduplicated" is asserted but the mechanism is not specified.
- **Concrete scenario.** Doc `A.md` has body link `[B](B.md "contradicts")` in §3; doc `B.md` has body link `[A](A.md "contradicts")` in §5. The pipeline parses both files. From `A`'s side, it emits edge `(A, contradicts, B, "enclosing sentence from A §3")`. From `B`'s side, edge `(B, contradicts, A, "enclosing sentence from B §5")`. Two edges, different descriptions. How does the tool know they're the same `contradicts` relationship and not two distinct typed claims?
- **What §4.3 does not say.** (i) Whether the projection step happens *before* or *after* parsing both files. (ii) Which description wins on dedup — `A`'s or `B`'s. (iii) What "canonical pair" means — alphabetical source order? (OQ-2 raises this as a separate open question but doesn't tie it to dedup correctness.) (iv) What happens to the other description: discarded, concatenated, kept as `description-source` and `description-target`?
- **Why this matters.** `contradicts` is named in the catalog as "the most valuable edge type" (`ontology-conventions.md` line 324). Silent description loss on dedup is exactly the failure mode D-7 already committed 40% to; for `contradicts` specifically, the cost is higher because both endpoints typically contain the *reason* the contradiction matters.
- **Recommendation.** Round 3 either (a) names the dedup algorithm step-by-step, or (b) admits that `contradicts` requires special handling beyond what §4.3 currently spells out, or (c) requires `contradicts` to be authored on only one side (D-8 forward-only extends to declared-once for the symmetric case).

### NF-4 [major] AC-9 "partial supersession": "partial" is operationally undefined for in-flight Tier 1

- **Location.** AC-9 (§3), D-10 (§5), OQ-11 (§7).
- **Claim under attack.** D-10 says "partially supersedes … Tier 1 sink bootstrapping is still required if the migration starts before the derivation tool exists." OQ-11 keeps this open.
- **Evidence — concrete read of `inverse-edge-fix.md`.** That discovery is `status: active` (line 7). Its Tier 1 is "bootstrap a `## Connections` block on `ontology-conventions.md`, `confidence-levels.md`, `ontology-architecture-draft.md`." Per `inverse-edge-fix.md` §3.1, the Tier 1 acceptance criterion is "each file ends with a `## Connections` heading followed by the canonical table header row, even if the body is empty pending Tier 2." If Tier 1 *runs* before this proposal's pipeline exists, those bootstrapped tables are **hand-authored** Connections sections that the derivation tool will then either (a) overwrite (data loss if Tier 2 has shipped any rows) or (b) wrap in `<!-- BEGIN/END derived -->` markers retroactively (which is the unscoped insertion problem of NF-1).
- **What "partial" doesn't answer.** Whether Tier 1 should run, pause, or be redirected to bootstrap the *marker-wrapped* form instead of the bare header. The proposal says Tier 2 dissolves; it doesn't say what Tier 1 should be doing *now*, or who blocks whom.
- **Recommendation.** Round 3 must either (a) issue a direction to `inverse-edge-fix` Tier 1: continue / pause / redirect; (b) ship a concrete sequencing constraint ("Tier 1 must include the `<!-- BEGIN derived -->` marker as part of its bootstrap row format"); or (c) admit the relationship is `blocks` not `partial supersedes` and update D-10 / AC-9 accordingly.

### NF-5 [major] `proposes-edit` survives as a quasi-canonical edge name in 4 vault docs including the constitution

- **Location.** §Connections (explorer re-typed its own row from `proposes-edit` to `refines`).
- **Claim under attack.** D-3 says "the Appendix C edge catalog … is preserved unchanged" but `proposes-edit` is in active use as if it were a catalog edge, and the constitution itself uses it in §8 prose examples.
- **Evidence — actual counts.**
  - `rg 'proposes-edit' vault | grep -v 'edges-enforcement' | wc -l` → **12 uses across 6 files**.
  - Files using it: `vault/ontology-conventions.md` (the constitution itself, in §8 prose), `vault/discovery/inverse-edge-fix/inverse-edge-fix.md` (3 rows in `## Connections`), `vault/discovery/curator-pipeline-integration/discovery.md`, `vault/discovery/documents-metadata-enforcement/documents-metadata-enforcement.md`, `vault/discovery/_backlog.md`, `vault/discovery/domainspec-strategy-definitions/research/agents-strategy-prior-version.md`.
  - I also found one use of `blocked-by` — another edge name not in Appendix C — in `inverse-edge-fix.md` line 109 (the `[../domainspec-vault-edges/]` row).
- **Why this matters.** The pipeline as specified in §4.1 will warn on these as "title not in catalog" and treat the links as prose. That means **dissolving real, semantically meaningful edge rows** at first regeneration. This is exactly the silent-edge-deletion class R1-F5 / R1-R2-F9 named at the constitutional level; the proposal acknowledges it for individual files (TD-9: "the Round-1 author has not measured how many existing prose links would retroactively qualify as edges if titled") but does not acknowledge that for the **inverse problem** — existing tabular edges using off-catalog names — the deletion is mechanical at first run.
- **Recommendation.** Round 3 must add: either (a) a pre-derivation reconciliation pass that surfaces all off-catalog edge names with their row count (12 for `proposes-edit`, 1 for `blocked-by`, etc.); (b) an OQ on whether the catalog should be amended *first* to absorb `proposes-edit` (since the constitution itself uses it as example, this may be a legitimate gap); or (c) explicit ack that AC-8 cutover ordering also gates on off-catalog edge reconciliation, not just typed-body-link migration.

### NF-6 [minor] §4.2 forbidlist is correct but the "ignore code-fenced" rule has a parser implementation question

- **Location.** §4.2 ("Links inside fenced code blocks … Hard skip").
- **Evidence.** Most of the vault's title-attribute uses today are *inside code-fenced examples* in the explorer files themselves (the `[link](url "type")` examples in §2). My count: 9 of 11 title-bearing inline links in `round-2/explorer.md` are inside code fences. So the parser must correctly distinguish fenced from non-fenced; the proposal says "Hard skip" without naming the CommonMark fenced-code-block detection rule the AST is required to honor.
- **Recommendation.** Minor. State that the AST parser is the authority on fence boundaries (mdast/remark distinguishes `code` nodes from `text` automatically); no manual regex parsing.

---

## Edge case catalog updated

| Case | Round 2 handling | Adequacy | Recommendation |
|---|---|---|---|
| Standalone list-item link `- [text](url "type")` | D-7 says "enclosing sentence"; undefined for this case | **Not handled** | NF-2: pick fallback rule |
| Link in a markdown header `### Step in [path](…)` | Same — no enclosing sentence | **Not handled** | NF-2 |
| Link in a body-table cell (non-Connections) | §4.2 says "treated as body prose; titles count"; D-7 says enclosing sentence | **Ambiguous** | NF-2: cell content as description, or row caption? |
| Two-sided `contradicts` author both ends | §4.3 says "deduplicated"; mechanism unspecified | **Underspecified** | NF-3 |
| Off-catalog edge name in existing tabular rows (`proposes-edit`, `blocked-by`) | §4.1 says "title not in catalog → warning, edge not materialized"; existing tabular rows aren't titles, they're table cells | **Not handled** | NF-5: reconciliation pass needed |
| Tier 1 bootstrap files in-flight | D-10 "partial"; OQ-11 open | **Underspecified** | NF-4 |
| Vault files with no `## Connections` block today (3 sinks) | §4.4 "tool inserts markers"; location unspecified | **Underspecified** | NF-1 |
| Marker insertion on existing 189 Connections blocks | §4.4 "If markers absent … tool inserts" | **Asserted, not specified** | NF-1: ship marker-insertion as part of migration |
| Anchor-bearing link `[text](path#anchor "type")` | §4.2: "target field is path; anchor preserved in description" | **Adequate** | OK |
| Image link with title `![alt](path "type")` | §4.2: hard skip | **Adequate** | OK |
| Reference-style link | §4.2: forbidden as edge form | **Adequate** | OK (zero vault uses today) |
| Code-fenced link | §4.2: hard skip | **Adequate** | NF-6: minor parser note |
| Autolinks `<https://…>` | §4.2: out-of-scope (no title syntax) | **Adequate** | OK (48 vault uses, all prose) |
| Frontmatter YAML link | §4.2: out of scope | **Adequate** | OK |
| Dangling target | §4.1: warning + `[dangling]` marker | **Adequate** | OK (R1-R2-F8 closed) |
| Title case-sensitivity / whitespace | Not addressed in Round 2 | **Carried from R1** | Minor; recommend linter canonicalizes |
| Same source → same target with `cites` AND `validates` | §4.3: two rows | **Adequate** | OK |
| Same source → same target with `cites` × 3 | §4.3: one row, first-occurrence description | **Adequate at rule level** | TD-7 tracks alternatives |

---

## Operational spec scoring

| Subsection | Score | Reason |
|---|---|---|
| **§4.1 IO contract** | **needs prototype** | Inputs/outputs named; idempotency property stated; failure-mode taxonomy reasonable; **but** the `<!-- BEGIN/END derived -->` mechanism is invented (NF-1) and the `vault/.edges/derive-report.jsonl` path is "a proposal, not a commitment" (own words). Cannot ship v0.1 without prototyping the marker-insertion sub-tool. |
| **§4.2 syntax constraints** | **implementable now** | Strongest section. 7 forbidden forms + 5 in-scope cases enumerated. R2 measurements (zero reference-style, zero images in vault) make the forbid-list low-cost. Anchor + path normalization rules are crisp. |
| **§4.3 edge-class handling** | **underspecified** for `contradicts` (NF-3); **implementable** for `retrofits` (no inverse), `subclass-of` (post-derive tree check), the two carve-outs (predicate-keyed), `acyclicity` (delegated to existing tool). Mixed grade. |
| **§4.4 inverse-write discipline** | **hand-waved** on marker insertion (NF-1) and on atomicity ("transactional rename-temp-then-atomic-move … or equivalent" — equivalence relation is unspecified across multiple files). Carve-out predicate sourcing via `vault_common.frontmatter.carveouts` is the cleanest part. |
| **§4.5 D-9 on-build decision** | **implementable now** (as a decision); the decision itself is conservative and correct. **But** the rationale ("on-build matches the existing operational rhythm") doesn't actually solve the merge-conflict footprint R1-R2-F4 raised — it defers to "if the staleness window proves painful, an on-write pre-commit hook can be added later." That deferral is fine for a v1 *decision*; it does not address the *evidence* that branch-vs-branch parallel edits will still produce conflicts on `## Connections` blocks regenerated by CI. |

---

## Regression check

Things Round 2 made **worse** than Round 1 (none I'd block on, but worth surfacing):

1. **Catalog count residue (OQ-10 / TD-3) is now *frozen* into the proposal.** Round 1 was inconsistent (used "21"); Round 2 acknowledges the 21/22/25 disagreement and explicitly says "Not this proposal's job to fix" (OQ-10). That is honest but it *binds* the proposal to a constitutional inconsistency it doesn't own. Per CLAUDE.md subset rule, the claim "the catalog is preserved unchanged" (D-3) is now unevaluable until OQ-10 closes — and the proposal still makes the claim. Round 1's silence was at least neutral; Round 2 names it but doesn't demote the claim.
2. **TD-9 (measurement of how many prose links would qualify as edges if titled) is added but not measured.** Round 1 didn't have this debt at all. Round 2 adds it and defers it. This is a new tracked debt that *only this proposal can resolve* (other discoveries have no stake in it) and not committing to even a sampling pass leaves the migration sizing fully open.
3. **`<!-- BEGIN/END derived -->` markers are introduced as if standard.** Round 1's §2 was conceptual ("regenerate"); Round 2 commits to specific syntax (§4.1, §4.4) without verifying the convention exists. See NF-1.

---

## Strongest concern for Round 3

**NF-1 (invented marker convention) and NF-2 (enclosing-sentence undefined for ~33 link sites) compose into a single blocking issue: the proposal cannot run its first `vault-ctl edges derive` pass safely on the current corpus.** Both must close (or be promoted to explicit scope deferrals with sequencing constraints) before the proposal can claim v0.1-ready. NF-1 because the marker insertion is the precondition for idempotency; NF-2 because ~33 existing link sites have no defined description-extraction behavior. Either one alone is fixable in a single Round-3 paragraph; together they say the §4 spec is concrete enough to attack but not concrete enough to implement.

The deeper Round-3 question they expose: **§4 is a specification of what the tool does, written without anyone yet having tried to write the tool.** Specifications written without prototype contact accumulate exactly these "obvious in retrospect" gaps. Round 3 should either (a) ship a 50-line prototype that runs on 5 vault files and surfaces what §4 forgot, or (b) demote §4 from "operational spec" to "operational sketch" and accept that implementation will produce the real spec.

---

## What Round 2 got right

- **D-7 honesty.** Picking option (a) and naming "~40% information loss" as the cost of single-source-of-truth is exactly the move R1-R2-F1 demanded. The reasoning against (b) (CommonMark portability) and the bounded escape hatch to (c) (TD-6: "one-amendment cost") is well-structured.
- **§4.2 syntax forbidlist.** The strongest single addition over Round 1. Measured baseline (zero reference-style, zero images) makes the forbidlist low-cost today; codifying it before drift starts is correct discipline.
- **§3 reframing from "drafted text" to "amendment candidates"** (AC-1 through AC-9). The discovery-structure constitution §6 violation R1 flagged is genuinely closed — §3 reads as candidates with named surfaces and named consequences, not as constitutional prose-in-waiting.
- **AC-9 honest typing of the `inverse-edge-fix` relationship.** "Partial supersession" with Tier 2 dissolved + Tier 1 sequencing flagged (OQ-11) + Tier 3 marked independent is exactly the structure the relationship requires; my NF-4 is about *operationalizing* "partial," not about the typing.
- **D-8 forward-only authoring.** Closes OQ-1 in the direction both Round-1 reviewers converged on; the reasoning chain (Appendix C Authoring Rule 1 already pins it + (b) reintroduces D-1's drift) is clean.
- **D-9 on-build for v1, explicitly reversible.** The conservative choice; named as constitution-independent so the reversal cost is bounded. Good design.
- **AC-3 a11y acknowledgment.** Names the regression rather than hiding it. OQ-12 keeps the mitigation path open without committing to it. R1-R2-F2 closed cleanly.
- **§Connections re-typed from `proposes-edit` to `refines`.** The explorer's own table is now catalog-conformant. (NF-5 then surfaces that this fix doesn't propagate to the 4 other vault docs using `proposes-edit`, but the explorer's own house is in order.)
- **Frontmatter `node_type: research`.** Closes R1-F7. Honest.

---

## Connections

> Per the proposal's own logic this would be derived. It isn't (TD-2). Hand-authored in legacy form.

| Document | Type | Description |
|----------|------|-------------|
| [explorer.md](explorer.md) | `refines` | This review accepts Round 2's direction (D-7 honest pick, §4 operational spec, §3 candidate reframing) and identifies six Round-2-specific operational holes (NF-1 through NF-6) that Round 3 must close — three blocking (invented marker convention, enclosing-sentence undefined, contradicts-dedup unspecified) and three less severe. Inverse `refined-by` to be added at promotion. |
| [../round-1/reviewer-2.md](../round-1/reviewer-2.md) | `continues-from` | This review extends the Round-1 R2 operational-viability lane into Round 2; 10 of 10 R1-R2 findings checked for adequacy of Round 2's response. Inverse `continued-by` to be added at promotion. |
| [../round-1/robot-talks.md](../round-1/robot-talks.md) | `cites` | Round-1 synthesis whose 13-item revision agenda Round 2 addressed; this review checks the operational items (1, 7, 8, 9, 10, 11) for whether the addressing held up under attack. Inverse `cited-by` to be added at promotion. |
| [../../../../ontology-conventions.md](../../../../ontology-conventions.md) | `cites` | Appendix C edge catalog (with the 21/22/25 count residue this proposal carries forward via OQ-10), §8 Directionality Principle, and the two carve-outs are the operational baseline against which Round 2's §4 spec is scored. NF-5 evidence (12 uses of `proposes-edit` in 6 files including this constitution) comes from this file's §8 prose examples. Inverse `cited-by` to be added at promotion. |
| [../../../../discovery/inverse-edge-fix/inverse-edge-fix.md](../../../../discovery/inverse-edge-fix/inverse-edge-fix.md) | `cites` | NF-4 evidence — this file is `status: active`, its Tier 1 acceptance criterion ("`## Connections` heading + canonical table header") is what NF-4 argues should be redirected to insert `<!-- BEGIN/END derived -->` markers if Round 2's pipeline is to run idempotently. Inverse `cited-by` to be added at promotion. |
