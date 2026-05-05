---
tags: [vault, edges, hygiene, ontology, backlog]
node_type: backlog
is_session: false
layer: ontology
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-03
---

# Vault Discovery — Edge & Graph Hygiene Backlog

Parking lot for edge-hygiene and vault-graph items that surfaced during the `edges-hygiene` subagents dispatch on 2026-05-03 but are out of scope for the focused `inverse-edge-fix` discovery (which handles only Category 4 — vault-internal missing inverses).

The dispatch enumerated 134 declared edges across `vault/**` and partitioned them into five orthogonal buckets (A vault-internal, B harness-by-design, C cross-repo, D dangling, E off-catalog). The inverse-edge-fix discovery absorbs bucket A; everything else lives here until promoted into its own discovery, sweep, or catalog amendment. Source materials: `.planning/research/edges-hygiene/research/domainspec-subagents-findings.md` and `.planning/research/edges-hygiene/research/domainspec-subagents-research.md`.

## Backlog Categories

In priority order:

1. **New Features** — proposed schema/format additions (Scope column) that unblock mechanical asymmetry checking.
2. **Architectural Resilience & Robustness** — catalog amendments, README canonicalization, and missing-Connections-block bootstrap that prevent the inventory from regrowing debt.
3. **Bug Fixes & Correctness** — concrete cleanup of cross-repo paths, repo-escaping relative paths, and dangling targets.
4. **Technical Debt & Refactoring** — judgment-heavy inverse-add cases the curator cannot mechanically resolve.
5. **Open Questions** — policy decisions deferred to the user (cross-repo edges).

---

# New Features

---

## [2026-05-03] [HIGH] — Add `Scope` column to `## Connections` table format — ❌ NOT DONE

**Context:**
F8 of the edges-hygiene findings proposes a fourth column on the canonical `## Connections` table — `| Document | Type | Scope | Description |` with `Scope ∈ {vault, harness, cross-repo}` — so the auditor can mechanically apply the asymmetry check ("every edge must be bidirectional", `vault/ontology-conventions.md:290-292`) only to rows where `Scope = vault`. Without this column, the auditor false-positives on every legal `operationalized-by` edge into a `.claude/skills/*` file (T1 in findings), since skills are not vault graph nodes and carry no `## Connections` block. The column is the lowest-impact wire-format change that closes OQ-B mechanically without mutating the `node_type` controlled vocabulary.

**What needs to be done:**
- Open a discovery (or amend `vault/discovery/domainspec-vault-edges/`) that proposes the column addition as a catalog amendment.
- Specify the three legal `Scope` values and the auditor rule "raise asymmetry bug iff `Scope = vault`".
- Decide migration policy for existing `## Connections` blocks (default fill-in vs forced re-author).
- Update `.claude/skills/custom/edges.md` and any catalog/template references once the discovery lands.

**Affected files:**
- `vault/discovery/domainspec-vault-edges/` — new or amended discovery proposing the column.
- `vault/ontology-conventions.md` — auditor scope rule needs to reference the new column.
- `.claude/skills/custom/edges.md` — table template update once accepted.
- All `## Connections` blocks across `vault/**` — eventual migration target.

---

# Architectural Resilience & Robustness

---

## [2026-05-03] [HIGH] — Catalog amendment: collapse or rename deprecated edge types — ❌ NOT DONE

**Context:**
F4 of the edges-hygiene findings shows at least 24 distinct edge-type names in active use that are deprecated or never in the 21-edge catalog. The inverse-edge-fix discovery cannot proceed cleanly on Category 4 rows whose forward edge uses a deprecated name, because the chosen inverse depends on which catalog name (if any) the deprecated edge collapses to. C3's sequencing recommendation explicitly puts catalog reconciliation before the inverse sweep so that fixes are not redone.

**What needs to be done:**
- For each deprecated/off-catalog edge name, decide: (a) collapse into an existing catalog edge, (b) rename to a new catalog edge, or (c) admit as a new catalog entry with a new inverse pair. Candidate mappings to evaluate:
  - `references` -> `cites`
  - `contextualizes` -> `cites`
  - `provenance-for` -> `creates`
  - `produces` / `produced-by` -> `derives-from` / `derives`
  - `depends-on` -> `derives-from`
  - `questions` -> `opens-question`
  - `grounded-by` / `grounded-in` -> ?
  - `informs` / `inform` -> ?
  - `mode-of` / `mode-of-source` -> ?
  - `extends` / `generalizes` -> which wins?
  - `discovery-of` -> ?
  - `binds-when` -> ?
  - `shape-contract-for` -> ?
  - `governed-by` / `governs` -> ?
- Land the decision as an amendment to the `domainspec-vault-edges` discovery.
- Update `.claude/skills/custom/edges.md` (or the equivalent catalog file) with the resolved set.
- Run a follow-up sweep to rewrite forward edges in `vault/**` to the new names so the inverse-edge-fix discovery has a stable target catalog.

**Affected files:**
- `vault/discovery/domainspec-vault-edges/` — amendment lives here.
- `.claude/skills/custom/edges.md` — catalog source of truth.
- `vault/**/*.md` — every file with a `## Connections` row using a deprecated name.

**Residual judgment-required deprecated edges (NOT auto-fixed by FX1/FX2 — sourced from `.planning/research/disallowed-edges-audit/research/domainspec-subagents-findings.md`):**

- `produces` — semantic direction may flip (`produces` → `derives` requires reversing edge direction); needs author check:
  - `vault/discovery/domainspec-vault-edges/research/domainspec-subagents-strategy.md:130`
  - `vault/discovery/domainspec-vault-edges/research/domainspec-subagents-strategy.md:131`
  - `vault/premise/domainspec-subagents-strategy-premises.md:277`
- `provenance-for` — deprecated → `creates` requires source to be a session (`is_session: true`); source here is a discovery, not a session:
  - `vault/discovery/domainspec-vault-foundations/epistemic-chain.md:427`
  - `vault/discovery/domainspec-vault-foundations/epistemic-chain.md:428`
- `questions` — deprecated → `opens-question` only valid from sessions; source here is research/discovery:
  - `vault/discovery/domainspec-vault-foundations/research/epistemic-chain-evidence-survey.md:661`
  - `vault/discovery/domainspec-vault-foundations/scope-and-domain-axes.md:404`
- `instantiates` — in deferred-edges category per catalog:
  - `vault/constitution/robot-talks-constitution.md:317`
  - `vault/discovery/domainspec-subagents-strategy-definitions/research/agents-strategy-prior-version.md:230`
  - `vault/discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md:402`
  - `vault/discovery/robot-talks-definitions/robot-talks.md:312`
- `grounded-by` / `grounded-in` — deprecated with no canonical replacement; targets are non-vault. Likely drop-or-rewrite-as-prose:
  - `vault/constitution/robot-talks-constitution.md:315`
  - `vault/premise/robot-talks-premises.md:203`
  - `vault/constitution/frontend-constitution.md:227`

---

## [2026-05-03] [MED] — Decide policy for off-catalog user-coined edges (Category E) — ❌ NOT DONE

**Context:**
The edges-hygiene inventory surfaced edges like `proposes-edit` (used vault -> `.claude/skills/custom/frontmatter.md`) and similar user-coined names that are neither in the 21-edge catalog nor obviously a deprecated alias of an existing catalog edge. They sit on a separate axis from F4's deprecated-collapse list because they were minted ad hoc by authors. They need either catalog admission with their own discovery, or rewrite to existing catalog edges.

**What needs to be done:**
- Enumerate the full Category E population (start from C1's inventory).
- For each, decide: admit (open mini-discovery proposing the edge + inverse + legal source/target node_types) or rewrite (replace the row with an existing catalog edge).
- Rewrite the `## Connections` rows accordingly.

**Affected files:**
- `vault/discovery/domainspec-vault-edges/` — admission decisions land as amendments here.
- Source files of each Category E row (e.g. the file that uses `proposes-edit`).

**Residual load-bearing off-catalog edges (NOT auto-fixed by FX1/FX2 — need either admission via discovery or rewrite per case; sourced from `.planning/research/disallowed-edges-audit/research/domainspec-subagents-findings.md`):**

- `proposes` — encodes "this discovery commits to producing X." Either map to `codified-as`/`operationalized-by` for forthcoming-constitution/skill cases, or admit via discovery:
  - `vault/discovery/domainspec-subagents-strategy-definitions/research/agents-strategy-prior-version.md:221`
  - `vault/discovery/domainspec-subagents-strategy-definitions/research/agents-strategy-prior-version.md:227`
  - `vault/discovery/domainspec-subagents-strategy-definitions/research/agents-strategy-prior-version.md:228`
  - `vault/discovery/domainspec-subagents-strategy-definitions/research/agents-strategy-prior-version.md:229`
  - `vault/discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md:393`
  - `vault/discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md:398`
  - `vault/discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md:399`
  - `vault/discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md:400`
  - `vault/discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md:401`
- `mode-of` — load-bearing inside subagents/robot-talks ontology; needs catalog admission:
  - `vault/discovery/domainspec-subagents-strategy-definitions/research/agents-strategy-prior-version.md:222`
  - `vault/discovery/domainspec-subagents-strategy-definitions/research/agents-strategy-prior-version.md:223`
  - `vault/discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md:394`
  - `vault/discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md:395`
- `shape-contract-for` — defines contract semantics; load-bearing:
  - `vault/premise/domainspec-subagents-strategy-premises.md:279`
  - `vault/premise/domainspec-subagents-strategy-premises.md:280`
- `aligns-with` — could collapse into `cites`:
  - `vault/axiom/frontend-axioms.md:57`
  - `vault/constitution/domain-tagging-constitution.md:496`
  - `vault/discovery/domainspec-subagents-strategy-definitions/research/agents-strategy-prior-version.md:225`
  - `vault/discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md:397`
- Other off-catalog one-offs:
  - `extends` — `vault/constitution/domain-tagging-constitution.md:497`; `vault/premise/domainspec-subagents-strategy-premises.md:272`
  - `generalizes` — `vault/premise/domainspec-subagents-strategy-premises.md:273`
  - `informs` — `vault/discovery/domainspec-vault-foundations/research/epistemic-chain-evidence-survey.md:658`
  - `inform` / `drive` / `operationalize` (frontend ontology has its own non-canonical vocabulary) — `vault/axiom/frontend-axioms.md:55`; `vault/axiom/frontend-axioms.md:94`; `vault/axiom/frontend-axioms.md:95`; `vault/constitution/frontend-constitution.md:228`
  - `scoped-by` — `vault/premise/domainspec-subagents-strategy-premises.md:278`
  - `ratified-by` — `vault/constitution/frontend-constitution.md:230`
  - `integrated-into` — `vault/constitution/robot-talks-constitution.md:316`
  - `instances` — `vault/discovery/robot-talks-definitions/robot-talks.md:308`
  - `proposes-edit` — `vault/discovery/domainspec-subagents-strategy-definitions/research/agents-strategy-prior-version.md:226`

---

## [2026-05-03] [MED] — Standardize README format from prose bullets to canonical Connections table — ❌ NOT DONE

**Context:**
F10 of the findings flags three README files that use bullet-list prose (`- **[link]** -- description`) rather than the canonical `| Document | Type | Description |` table. The implicit edges in these prose bullets are not parseable by the auditor and not addressable by an inverse sweep, so the inventory under-counts and the inverse-edge-fix discovery cannot reach them.

**What needs to be done:**
- Convert the three README files' prose bullet links into canonical `## Connections` table rows with explicit `Type` (and `Scope`, once that column lands).
- Verify each chosen edge type is in the catalog.
- Add the corresponding inverse rows on the target files.

**Affected files:**
- `vault/discovery/domainspec-subagents-strategy-definitions/README.md`
- `vault/discovery/robot-talks-definitions/README.md`
- `vault/discovery/documents-metadata-enforcement/README.md`

---

## [2026-05-03] [MED] — Bootstrap `## Connections` blocks on new sessions and discoveries — ❌ NOT DONE

**Context:**
F11 of the findings shows seven newer session files (the `2026-05-02-1830...` through `2026-05-03-0140...` series) plus three new discoveries (`curator-pipeline-integration/discovery.md` + `README.md` and `documents-metadata-enforcement/documents-metadata-enforcement.md`) have no `## Connections` block at all. The session `vault/sessions/2026-05-03-0216-close-session-edges-bootstrap.md` has only a header — the curator refused to wire it. Until these blocks exist, every inbound edge to them is a missing inverse by definition, and the inverse-edge-fix discovery cannot make them whole.

**What needs to be done:**
- Add (or fill) a `## Connections` block on each of the listed files.
- For each, declare the relevant forward and inverse edges to/from related discoveries, premises, and constitutions using catalog-blessed edge types.
- Once done, treat the missing-block check as a curator pre-write rule (cross-link this item with the curator-pipeline-integration discovery).

**Affected files:**
- `vault/sessions/2026-05-02-1830-*.md` and the six following sessions through `2026-05-03-0140-*.md`.
- `vault/sessions/2026-05-03-0216-close-session-edges-bootstrap.md` (empty block).
- `vault/discovery/curator-pipeline-integration/discovery.md`
- `vault/discovery/curator-pipeline-integration/README.md`
- `vault/discovery/documents-metadata-enforcement/documents-metadata-enforcement.md`

---

# Bug Fixes & Correctness

---

## [2026-05-03] [HIGH] — Drop absolute `file:///Users/...` paths from vault edges — ❌ NOT DONE

**Context:**
F6 of the findings identifies absolute `file:///Users/victorboscaro/house_project/...` URIs that hard-code the author's machine layout into vault edges. They are a portability bug independent of OQ-C — they break the moment anyone clones the repo elsewhere. Three live in `vault/conceptual/epistemic-principles.md:127-129`, and prose absolute paths appear in `vault/discovery/domainspec-vault-edges/research/domainspec-subagents-strategy.md:79-80`. Quoted-literal mentions in `vault/discovery/curator-pipeline-integration/discovery.md:251,267` are intentional examples (showing the bad form) and stay.

**What needs to be done:**
- Replace each `file:///Users/victorboscaro/house_project/...` URI with either a repo-relative path (if the file lives in this repo) or rewrite the row as a cross-repo edge pending the OQ-C decision.
- Rewrite the prose absolute paths in `domainspec-vault-edges/research/domainspec-subagents-strategy.md:79-80` to repo-relative form.
- Leave the quoted-literal examples in `curator-pipeline-integration/discovery.md:251,267` untouched.

**Affected files:**
- `vault/conceptual/epistemic-principles.md` — three rows at lines 127-129.
- `vault/discovery/domainspec-vault-edges/research/domainspec-subagents-strategy.md` — prose at lines 79-80.

---

## [2026-05-03] [MED] — Rewrite or drop repo-escaping relative paths (Category 2) — ❌ NOT DONE

**Context:**
C3 Category 2 of the edges-hygiene fix plan enumerates 12 rows whose relative paths escape the repo (e.g. `../../../`-style traversals) — they reach files that are not in this repository, so they are functionally cross-repo edges hiding behind relative syntax. Mix of "rewrite to in-vault target" (when the path was simply wrong) and "drop the row" (when the target genuinely does not belong in vault).

**What needs to be done:**
- For each of the 12 rows, decide: rewrite to a real in-vault target, or drop the row entirely.
- Apply the chosen action and verify no repo-escaping relative paths remain in `## Connections` blocks.

**Affected files:**
- `vault/premise/robot-talks-premises.md` — lines 128, 203, 204.
- `vault/constitution/robot-talks-constitution.md` — lines 17, 57, 315, 316, 317, 318.
- `vault/discovery/robot-talks-definitions/robot-talks.md` — line 312.

---

## [2026-05-03] [MED] — Resolve the 27 dangling-target rows — ❌ NOT DONE

**Context:**
F3 of the findings reports 27 dangling-non-existent edges that cluster into three repair workflows: (a) rename-driven — the target moved (e.g. `agent-dispatch-premises.md` -> `domainspec-subagents-strategy-premises.md`); (b) forthcoming-now-realized — files originally promised that now actually exist (e.g. the constitution); (c) permanent drops — `implementation-plan TBD` literal placeholder, plus `[[robot-talks-frontend]]`, `[[event-system-foundations]]`, and `[[fidc-and-credit-rights]]` which resolve to no file at all (F5).

**What needs to be done:**
- Walk the 27 rows from C1's inventory.
- For each: rewrite to the new path (rename), confirm the new file and add catalog-conformant edges (forthcoming-realized), or delete the row (permanent drop / unresolvable wikilink).
- Re-run the inventory afterward to confirm zero dangling targets.

**Affected files:**
- Source files of each of the 27 rows (full list in `.planning/research/edges-hygiene/research/domainspec-subagents-research.md` Agent 1 section).

**Residual truly-missing dangling targets (NOT auto-fixed by FX2 — no rename mapping; target was never created or is cross-repo; sourced from `.planning/research/disallowed-edges-audit/research/domainspec-subagents-findings.md`):**

- Cross-repo `file:///Users/victorboscaro/house_project/...` URIs (overlap with the absolute-path item above):
  - `vault/conceptual/epistemic-principles.md:127`
  - `vault/conceptual/epistemic-principles.md:128`
  - `vault/conceptual/epistemic-principles.md:129`
- Absolute `/Users/victorboscaro/specs/...` and bare `business-philosopher/...` paths:
  - `vault/constitution/robot-talks-constitution.md:315`
  - `vault/constitution/robot-talks-constitution.md:316`
  - `vault/constitution/robot-talks-constitution.md:317`
  - `vault/premise/robot-talks-premises.md:203`
  - `vault/premise/robot-talks-premises.md:204`
- `vault/constitution/specs/...` paths under wrong subtrees:
  - `vault/constitution/domain-tagging-constitution.md:491`
  - `vault/constitution/domain-tagging-constitution.md:492`
  - `vault/constitution/domain-tagging-constitution.md:493`
  - `vault/constitution/domain-tagging-constitution.md:494`
  - `vault/constitution/domain-tagging-constitution.md:495`
  - `vault/constitution/domain-tagging-constitution.md:496`
  - `vault/constitution/domain-tagging-constitution.md:497`
- Truly-never-created file references:
  - `vault/constitution/event-system-constitution.md:592` (`event-system-foundations.md`)
  - `vault/constitution/folder-structure-constitution.md:226` (`fidc-and-credit-rights.md`)
  - `vault/constitution/frontend-constitution.md:230` (`robot-talks-frontend.md`)
- Malformed link (label and link path disagree):
  - `vault/discovery/robot-talks-definitions/robot-talks.md:312`

---

# Technical Debt & Refactoring

---

## [2026-05-03] [MED] — Resolve high-risk inverse-add cases requiring author judgment — ❌ NOT DONE

**Context:**
C3 Category 4 of the edges-hygiene fix plan flags rows where the inverse cannot be added mechanically because the forward edge encodes a semantic conflict, an inverse-name disagreement, or a format inconsistency. These are explicitly out of scope for the focused `inverse-edge-fix` discovery, which sweeps the mechanical residue. Specific cases:

- Bidirectional `derives-from` between the same pair of files (semantic conflict — both cannot derive from each other).
- Constitution and premise both using the same edge name where one should be the inverse (symmetric error).
- `extends` / `generalizes` collapse pending — the inverse depends on which catalog name wins (depends on the catalog amendment item above).
- Pair-name disagreement (forward says `derives-from`, target's inverse says `codified-as` or similar).
- Wikilink-vs-Markdown format inconsistency in `vault/premise/system-premises.md:113-117` where formats mix in adjacent rows.

**What needs to be done:**
- Triage each case with the author who wrote the original edge.
- Decide per-case: which direction is canonical, which name pair to use, and whether to normalize to wikilink or Markdown.
- Apply the fix and add the inverse on the target side.

**Affected files:**
- `vault/premise/system-premises.md` — lines 113-117 (format inconsistency).
- Other files identified per row in `.planning/research/edges-hygiene/research/domainspec-subagents-research.md` Agent 3 Category 4.

**Residual high-risk inverse-add cases (NOT auto-fixed by FX1/FX2 — sourced from `.planning/research/disallowed-edges-audit/research/domainspec-subagents-findings.md`):**

- `vault/discovery/domainspec-subagents-strategy-definitions/research/agents-strategy-prior-version.md` — **NO FRONTMATTER AT ALL.** Single file in the entire vault lacking frontmatter. Author must add `node_type` and required fields per `.claude/skills/custom/frontmatter.md`. Until frontmatter exists, no inverse-edge sweep can resolve edges originating from this file.

---

# Open Questions

---

## [2026-05-03] [MED] — OQ-C: decide policy for cross-repo edges — ❌ NOT DONE

**Context:**
OQ-C remains open. The edges-hygiene dispatch confirmed (T3 in findings) that cross-repo edges are a structurally distinct axis from cross-boundary (OQ-B / harness-by-design) edges — they go to files in other repos (`file:///Users/.../house_project/...`) or to in-repo-but-not-vault locations (`TUNING-LOOP.md`, `.planning/`, `.github/agents/`). Until the policy is decided, these rows cannot be normalized — they will keep collapsing into either bucket B or bucket D depending on who reads them.

**What needs to be done:**
- Decide whether cross-repo edges are: (a) normalized-and-kept (with a documented form for cross-repo references), (b) dropped from `## Connections` and demoted to prose, or (c) admitted as a new edge type / `Scope = cross-repo` value with its own auditor rule.
- Land the decision as a discovery or amendment to `domainspec-vault-edges`.
- Apply the resulting fix sweep to the cross-repo rows.

**Affected files:**
- `vault/discovery/domainspec-vault-edges/` — policy decision lives here.
- All rows currently in cross-repo or in-repo-but-not-vault buckets (full list in the edges-hygiene research file).

**Cross-reference (from `.planning/research/disallowed-edges-audit/research/domainspec-subagents-findings.md`):** 4 `.planning/**` rows from sessions `2026-05-03-0327` and `2026-05-03-0334` are forward-only-pending-OQ-C. Already implicitly covered by the bucket above; flagged here so the OQ-C decision sweeps them in the same pass.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md](../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md) | `created-by` | The 2026-05-03 cross-boundary-rule + edges-hygiene session created this backlog as the parking lot for the deferred edges-hygiene workstreams. |
