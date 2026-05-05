---
tags: [subagents, dispatch-artifact, subagents-findings, disallowed-edges-audit]
node_type: subagents-findings
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-03
dispatch_slug: disallowed-edges-audit
implements: [R15, R16, R17, R18, R21, R22, R23 of domainspec-subagents-strategy-constitution.md]
---

# Subagents-Findings — `disallowed-edges-audit`

> Preamble (Context + Goal, R23) followed by three fixed sections in this order: **Dispatch record** (metadata) → **Findings** (summary + implications) → **Analysis** (tensions + cross-cutting). Section order is mandatory per R16. Every load-bearing claim in Findings and Analysis cites a passage in `domainspec-subagents-research.md` per R17.
>
> **Constitution:** [../../../../vault/constitution/domainspec-subagents-strategy-constitution.md](../../../../vault/constitution/domainspec-subagents-strategy-constitution.md).

---

## Context

The user just landed the cross-boundary rule (skills/agents are not vault graph nodes; forward-only edges to them are legal-by-design). Now they want to know which existing edges in `vault/**` are still violating the catalog (off-catalog name, deprecated, illegal per node_type) — so they can be parked in `_backlog.md` with concrete file:line evidence rather than the loose mention currently there.

## Goal

Produce two parallel inventories (name-validity + node-type-legality) that together identify every disallowed edge in `vault/**` with file:line evidence, then run the standard research-writer + findings-writer pipeline. Step 7 will gate whether to promote to a vault discovery or just augment `_backlog.md`.

---

## Dispatch record

> Implements R18 (schema) and R21 / R22 (grading).

**Dispatch id:** `disallowed-edges-audit-2026-05-03`

**Mode:** `task-fan-out` *(R19)*

**Per-agent table:**

| Agent id | Model | Difficulty justification | Token budget | Declared output shape |
|----------|-------|--------------------------|--------------|-----------------------|
| `DA1-name-validity` | `general-purpose` (default sonnet) | Mechanical pattern-match against a fixed catalog of edge names; no judgment cascade, just enumerate off-catalog / deprecated rows. | 30,000 | Violation table + per-class counts + top-10 most-violated names + key findings list |
| `DA2-nodetype-legality` | `general-purpose` (default sonnet) | Per-edge frontmatter lookup on both endpoints, then matrix check against legality table; mostly mechanical but requires reasoning about cross-boundary carve-out vs dangling target. | 35,000 | Verdict-classified edge inventory (6 verdicts) + illegal-edges table + dangling-target patterns + frontmatter-gap list |

**Sequencing:** parallel set — both children dispatched in a single message (R8); no handoff between them.

**Recursion budget actually used:** depth = 0 (children did not spawn grandchildren), breadth = 2, total agents = 2 *(defaults per R13: depth 2, breadth 5, total 10; well under)*

**Actual spend:**

| Agent id | Tokens in | Tokens out | Total |
|----------|-----------|------------|-------|
| `DA1-name-validity` | (not separately tracked) | (not separately tracked) | 78,375 |
| `DA2-nodetype-legality` | (not separately tracked) | (not separately tracked) | 72,927 |
| **Sum** |  |  | **151,302** |

Declared aggregate budget: 65,000. Actual aggregate: 151,302. Overrun ratio: 2.32×.

**User confirmation:** 2026-05-03, explicit opt-in — "Invoke subagents to assess which documents have edges that are not allowed."

**Working folder:** `.planning/research/disallowed-edges-audit/` (outside `vault/`, R15 satisfied).

**Four-component grade** *(R21; judgments marked per R22):*

| Component        | Score (0–1) | Note |
|------------------|-------------|------|
| Coverage         | `0.95` (judgment) | DA1 enumerated 71 violations across 24 vault files; DA2 parsed 206 edges with 6-verdict classification covering every vault `## Connections` row. The two inventories together address both Goal axes (name-validity + node-type-legality). |
| Independence     | `0.95` (judgment) | High — orthogonal concerns, no shared scratch, each child explicitly deferred the other axis to its sibling. Compatible classifications emerged without coordination. |
| Fidelity         | `0.92` (judgment) | Both children produced file:line citations and acknowledged scope limits (DA1 deferred legality to DA2; DA2 deferred name validity to DA1). Minor fidelity drag: DA2 elided some edge counts to "cluster" descriptions in the dangling-target section rather than full enumeration. |
| Cost discipline  | `0.43`            | declared budget vs actual: `65,000 / 151,302` (overrun ratio 2.32×, mechanical = 1/2.32) |

> **R22 reminder:** the aggregate of the four components is NOT a measurement. Three are judgments dressed in numbers for coordination ease; only cost is mechanical.

---

## Findings

> Scannable summary plus implications. Every load-bearing claim cites a passage in `domainspec-subagents-research.md` (R17).

### F1 — Two disjoint violation populations, comparable in size

- **Claim:** Name-validity violations (71) and node-type-legality violations (8 illegal + 54 unverifiable-dangling) are largely disjoint populations: most edges with deprecated/off-catalog names still terminate at extant vault files with frontmatter, and most illegal node_type combos use catalog-clean names. Only a small intersection (~the robot-talks-premises:202–204 cluster, where `operationalized-by` and `grounded-in` co-occur) is hit by both audits.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 1](./domainspec-subagents-research.md#agent-1--edge-name-validity-audit-off-catalog--deprecated--invented-inverse), [`domainspec-subagents-research.md` §Agent 2](./domainspec-subagents-research.md#agent-2--node-type-legality-audit-sourcetarget-combos-vs-legality-matrix)
- **Implication:** `_backlog.md` needs two separate sections (or two columns in one table); a single "disallowed edges" list would conflate two cleanup mechanics — name-rewrites vs target-or-direction-fixes.

### F2 — Deprecated-name dominance is concentrated in two edge families

- **Claim:** 17 of 36 deprecated rows are `references` / `contextualizes` (all canonically rewriteable to `cites`), and another 9 are `produces` / `provenance-for` / `instantiates`; together these two families account for 26 of 36 deprecated rows (~72%).
- **Evidence:** [`domainspec-subagents-research.md` §Agent 1, key finding 2](./domainspec-subagents-research.md#agent-1--edge-name-validity-audit-off-catalog--deprecated--invented-inverse)
- **Implication:** A single mechanical rewrite pass (regex-grade, no judgment) clears most of the deprecated-name backlog; only 10 deprecated rows would require per-row review.

### F3 — `proposes`, `mode-of`, and `shape-contract-for` are load-bearing off-catalog edges

- **Claim:** `proposes` (7 occurrences across `domainspec-subagents-strategy.md` and `agents-strategy-prior-version.md`), `mode-of` (4 occurrences), and `shape-contract-for` (2 occurrences) point at relationships the catalog does not currently express; they cannot be mechanically rewritten without information loss.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 1, key findings 3 and 4](./domainspec-subagents-research.md#agent-1--edge-name-validity-audit-off-catalog--deprecated--invented-inverse)
- **Implication:** A discovery is required to either admit these edges to the catalog or to argue they should remain prose; this is not `_backlog.md` material — it's a vault-foundations-class question.

### F4 — Illegal node_type combos cluster in a single session pair plus two `operationalized-by` mis-aims

- **Claim:** 4 of 8 illegal edges sit in one pair of session files (`2026-05-03-0140-…-divergence.md` ↔ `2026-05-03-0327-…-promotion.md`) using `validates` / `closes-question` between sessions when both endpoints should be a discovery/premise; another 2 are `operationalized-by` aimed at vault documents instead of at a skill.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 2, illegal-edges table and key findings](./domainspec-subagents-research.md#agent-2--node-type-legality-audit-sourcetarget-combos-vs-legality-matrix)
- **Implication:** Half the illegal-edges work is two-file scope; the `operationalized-by` cases are diagnostic of the cross-boundary rule landing late — those edges existed before "skill is the only legal target" was codified.

### F5 — 54 dangling targets are dominated by the in-flight `subagents-*` → `domainspec-*` rename

- **Claim:** The largest class of unverifiable edges (54 rows) is dominated by edges declared against renamed-but-not-yet-created `domainspec-*` files (e.g., `vault/constitution/domainspec-subagents-strategy-constitution.md`, `templates/domainspec-subagents-research.md` — and the `templates/` directory itself does not exist; templates were moved to `/templates/`).
- **Evidence:** [`domainspec-subagents-research.md` §Agent 2, dangling-target patterns](./domainspec-subagents-research.md#agent-2--node-type-legality-audit-sourcetarget-combos-vs-legality-matrix)
- **Implication:** Most dangling edges will resolve themselves as the rename completes; `_backlog.md` should distinguish "wait for rename" from "fix now" — the latter is the smaller cross-repo and wrong-subtree subset.

### F6 — Three header schemas in use across `## Connections` tables

- **Claim:** Three column-header schemas coexist: canonical `| Document | Type | Description |`, `| Document | Relationship | Description |` (frontend-axioms / -premises / -constitution), and `| Node | Relationship | Purpose |` (domainspec-subagents-strategy-premises, robot-talks-premises, robot-talks-constitution).
- **Evidence:** [`domainspec-subagents-research.md` §Agent 1, key finding 1](./domainspec-subagents-research.md#agent-1--edge-name-validity-audit-off-catalog--deprecated--invented-inverse)
- **Implication:** Header normalization is a precondition for any future automated edge-parsing tool; `_backlog.md` should record this as a separate hygiene item from the name/legality cleanups.

### F7 — Only one vault file lacks frontmatter

- **Claim:** `vault/discovery/domainspec-subagents-strategy-definitions/research/agents-strategy-prior-version.md` has no frontmatter at all; every other vault `.md` has both frontmatter and `node_type`.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 2, files-missing-frontmatter table](./domainspec-subagents-research.md#agent-2--node-type-legality-audit-sourcetarget-combos-vs-legality-matrix)
- **Implication:** Frontmatter coverage is essentially complete; the legality matrix is verifiable for the entire vault graph except this one prior-version file (which is correctly archival anyway).

### F8 — No invented-inverse pairs detected

- **Claim:** DA1 found zero invented-inverse edges (e.g., no rows where someone wrote both `derives-from` and a fabricated `derived-by` to express bidirectionality).
- **Evidence:** [`domainspec-subagents-research.md` §Agent 1, key finding 6](./domainspec-subagents-research.md#agent-1--edge-name-validity-audit-off-catalog--deprecated--invented-inverse)
- **Implication:** The catalog's directional-only stance has held in practice; this concern can be dropped from the active-watchlist.

---

## Analysis

> Tensions, contradictions, cross-cutting reasoning that explain the findings. Every claim cites passages in `domainspec-subagents-research.md` (R17).

### T1 — The `operationalized-by` mis-aim is a cross-boundary-rule-landed-late artifact

- **Held by older robot-talks files:** `operationalized-by` can terminate at a constitution or premise (the symmetric "this is operationalized by that vault doc" reading).
- **Reality post-cross-boundary-rule:** `operationalized-by` must terminate at a skill — and skills are outside the vault graph, reachable only via the carve-out.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 2, illegal-edges table rows for robot-talks-constitution.md:313 and robot-talks-premises.md:202](./domainspec-subagents-research.md#agent-2--node-type-legality-audit-sourcetarget-combos-vs-legality-matrix)
- **Impact:** Low severity, 2 rows, but diagnostic — these edges predate the rule that made them illegal. Fix mechanically (re-target to the skill or downgrade to prose). Confirms the cross-boundary rule needed to be retroactive against existing `## Connections`.

### T2 — Session-to-session legality violations reveal a missing edge in the catalog (or a missing discipline)

- **Held by sessions 0140 and 0327:** Sessions can `validate` / `close-question` against each other when one session resolved a question raised in the other.
- **Reality per legality matrix:** `validates` source must be in `{audit, research, subagents-research, test}`; `closes-question` source must be a `discovery`. Neither permits `session → session`.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 2, illegal-edges table rows for sessions 0140 ↔ 0327](./domainspec-subagents-research.md#agent-2--node-type-legality-audit-sourcetarget-combos-vs-legality-matrix)
- **Impact:** 4 of 8 illegal rows. Two resolutions: (a) admit a session-internal `resolves` / `resolved-by` pair to the catalog via discovery, or (b) require the resolving session to first promote its conclusion to a discovery/premise and have the older session edge to that. (b) preserves the catalog as-is and matches the existing Step-7-promotion discipline.

### T3 — Off-catalog `proposes` / `mode-of` / `shape-contract-for` indicates the catalog is incomplete for the subagents/robot-talks ontology

- **Held by domainspec-subagents-strategy and robot-talks authors:** The relationships "this document proposes a forthcoming artifact," "X is a mode of Y," and "Z is the shape contract for W" are real and load-bearing in their respective ontologies.
- **Reality per the catalog:** None of these edges exist; using them is off-catalog regardless of whether the targets resolve.
- **Evidence:** [`domainspec-subagents-research.md` §Agent 1, key findings 3 and 4](./domainspec-subagents-research.md#agent-1--edge-name-validity-audit-off-catalog--deprecated--invented-inverse)
- **Impact:** ~13 rows. This is the only finding that genuinely cannot be backlogged as cleanup — it requires a vault-conventions-class discovery to decide admit-vs-rewrite. If the user wants to keep `_backlog.md` as the resting place, this subset must be flagged as "discovery-required" rather than "mechanical rewrite."

### T4 — Two failure modes of edges-to-renamed-files have different remedies

- **Held by DA2's "dangling target" verdict:** Treats all 54 dangling edges uniformly as "unverifiable target."
- **Reality across sub-patterns:** The rows split into (a) edges to in-flight renames (`subagents-*` → `domainspec-*`) that will self-heal, (b) edges to wrong-subtree paths inside vault (e.g., `vault/discovery/research/…` instead of `vault/discovery/domainspec-vault-foundations/research/…`), and (c) edges to absolute paths in sibling repos (`/Users/victorboscaro/house_project/…`, `/Users/victorboscaro/specs/…`).
- **Evidence:** [`domainspec-subagents-research.md` §Agent 2, dangling-target patterns](./domainspec-subagents-research.md#agent-2--node-type-legality-audit-sourcetarget-combos-vs-legality-matrix)
- **Impact:** (a) is "wait, not fix" (~majority); (b) is mechanical fix-the-path; (c) is cross-repo and likely should be dropped or rewritten as prose since vault edges should not cross repo boundaries. Backlog rows for (a) should be tagged "wait for rename" so they aren't churned prematurely.

### Cross-cutting observations

- **The two children's verdicts are compositional, not redundant.** DA1's 71 name-violations and DA2's 206 edges with 6 verdicts intersect minimally but together produce a complete picture: an edge is "good" only if it appears as catalog-clean in DA1 AND legal in DA2. Future audits should run both axes; running only one would miss either the 71 name issues or the 8 illegal-combo issues — citing both [`domainspec-subagents-research.md` §Agent 1, per-violation-class counts](./domainspec-subagents-research.md#agent-1--edge-name-validity-audit-off-catalog--deprecated--invented-inverse) and [`domainspec-subagents-research.md` §Agent 2, per-verdict counts](./domainspec-subagents-research.md#agent-2--node-type-legality-audit-sourcetarget-combos-vs-legality-matrix).
- **The cross-boundary rule already pays off in DA2's accounting.** 21 edges classified as `legal-by-design (carve-out)` — these would have been flagged as illegal absent the rule, indicating the carve-out is non-trivial in scope per [`domainspec-subagents-research.md` §Agent 2, per-verdict counts](./domainspec-subagents-research.md#agent-2--node-type-legality-audit-sourcetarget-combos-vs-legality-matrix).
- **Cleanup work splits into four mechanical buckets and one discovery-required bucket.** Mechanical: (i) rewrite deprecated names in two families per F2; (ii) re-target the 2 `operationalized-by` rows per T1; (iii) fix the wrong-subtree dangling targets per T4(b); (iv) drop or prose-ify the cross-repo dangling targets per T4(c). Discovery-required: T2 (session-internal resolves) and T3 (`proposes` / `mode-of` / `shape-contract-for`). The user's stated `_backlog.md` plan absorbs (i)–(iv) cleanly; T2 and T3 are Step-7 discovery-promotion candidates. All buckets traced to citations above.
- **Cost discipline failed (0.43) but coverage held (0.95).** The 2.32× overrun came from per-edge frontmatter lookups in DA2 (206 edges × two frontmatter reads each) and the comprehensive enumeration in DA1; both children chose completeness over staying inside the declared budget. Future similar audits should either widen the declared budget upfront (the strategist underestimated, not the children overspending discretionarily) or accept narrower sampling. R22 is doing its job here: cost is the only one of the four numbers that is actually a measurement, and it's the one the dispatch failed against.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [./domainspec-subagents-research.md](./domainspec-subagents-research.md) | `cites` | Per-child verbatim returns this findings file synthesizes. |
| [../../../../vault/constitution/domainspec-subagents-strategy-constitution.md](../../../../vault/constitution/domainspec-subagents-strategy-constitution.md) | `implements` | R15 (location), R16 (section order), R17 (citation requirement), R18 (Dispatch record schema), R21+R22 (four-component grade with judgment markers), R23 (Context + Goal preamble). |
