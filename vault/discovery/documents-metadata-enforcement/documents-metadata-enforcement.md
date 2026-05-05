---
tags: [vault, ontology, enforcement, tooling, metadata, edges]
node_type: discovery
is_session: false
layer: ontology
nature: explanatory
status: draft
veracidade: medium
convicção: medium
version: 0.1.0
last_updated: 2026-05-02
---

# Discovery — Documents Metadata Enforcement: Closing the Rule-vs-Discipline Gap

> The vault declares that every edge **between vault nodes** is bidirectional (with a formal carve-out for forward-only edges into `.claude/skills/**` and `.claude/agents/**`), that frontmatter fields are mandatory, that only catalog edges are admissible, and that deprecated edges must not appear. None of these "rules" is enforced by tooling today. Authoring discipline is the only thing keeping the graph internally consistent. This discovery names the gap, surveys the failure modes the gap admits, surveys the enforcement options that would close it, and leaves the choice of mechanism as an open decision.

---

## Objective

Decide how to convert the vault's currently-discipline-only metadata rules (vault-to-vault edge bidirectionality with the formal skills/agents carve-out, edge-name validity, frontmatter completeness, node_type endpoint constraints, deprecated-edge avoidance, target-path existence) into mechanically enforced rules. The end state is a single named enforcement surface — pre-commit hook, CI lint, build-time graph load, or scheduled audit — that fails loudly when a vault document violates the catalog. This discovery does not commit to a specific mechanism; it scopes the gap and the candidate surfaces so an implementation-plan can pick one.

---

## Index

1. [Business Context](#1-business-context)
2. [Core Concepts](#2-core-concepts)
3. [Failure Modes the Discipline Gap Admits](#3-failure-modes-the-discipline-gap-admits)
4. [Enforcement Surface Alternatives](#4-enforcement-surface-alternatives)
5. [Recommendation](#5-recommendation)
6. [Cleanup](#6-cleanup)
7. [Open Questions](#7-open-questions)
8. [Connections](#8-connections)

---

## 1. Business Context

### Why now

`vault/ontology-conventions.md` Section 8 ("Directionality Principle") states: *"Every relationship in the vault appears in two `## Connections` blocks: the source document declares the forward edge, and the target document declares the inverse. Both sides are written explicitly in Markdown — there is no SQL-layer inference."* The accompanying skill `.claude/skills/custom/edges.md` reinforces this with: *"no SQL-layer inference of the missing side"* and *"Asymmetric declarations are bugs."* These statements are written as rules, but the project ships with **no linter, no CI check, no pre-commit hook, no build-time validation** that verifies any of them. The user's epistemic-honesty memory (`feedback_epistemic_honesty.md`) is explicit that vault rules which cannot be mechanically verified must be demoted from "rule" to "discipline" — yet the vault's own conventions document still presents them as rules. The gap is currently silent. As the vault grows past the recent split into multiple discovery folders, the cost of any single silent inconsistency compounds: every read of an asymmetric edge teaches the next agent that asymmetry is acceptable.

### What's broken

Each item below is a rule the vault asserts but does not enforce. Locations cite where the rule is currently written down.

- **Bidirectionality unenforced (vault-to-vault).** `vault/ontology-conventions.md` Section 8 declares the rule (with a formal carve-out for forward-only edges into `.claude/skills/**` and `.claude/agents/**`); `.claude/skills/custom/edges.md` repeats it with the same carve-out; nothing validates that for every forward edge `A —derives-from→ B` written in `A.md`'s `## Connections` between vault nodes, the inverse `B —derives→ A` exists in `B.md`'s `## Connections`.
- **Edge name validity unenforced.** `vault/ontology-conventions.md:534` (Appendix C) defines the closed catalog of 21 forward edges plus their inverses; nothing prevents an author from writing an unrecognized edge name (typo, ad-hoc invention, deprecated edge).
- **Deprecated-edge usage unenforced.** `vault/ontology-conventions.md:577` lists deprecated edges (`references`, `produces`, `provenance-for`, `resolves`, `questions`, `depends-on`, `grounds`, etc.); `.claude/skills/custom/edges.md:120` reproduces the list. Authors can still write these and nothing flags them. Concrete current example: `vault/discovery/domainspec-vault-foundations/epistemic-chain.md:428-429` uses `provenance-for`, which is on the deprecated list.
- **Target-path existence unenforced.** A `## Connections` row pointing at `path/to/missing.md` produces a dangling edge. Nothing checks that the path resolves to a file in the working tree.
- **Node-type endpoint constraints unenforced.** Appendix C of `vault/ontology-conventions.md` constrains source/target `node_type` per edge (e.g., `codified-as` requires source ∈ {premise, axiom, discovery}, target = constitution). Nothing reads the two endpoints' frontmatter and verifies the constraint.
- **Frontmatter required-field completeness unenforced.** `.claude/skills/custom/frontmatter.md` declares the schema (tags, node_type, is_session, session_ref, layer, nature, status, version, last_updated, plus conditional veracidade/convicção). Nothing rejects a file that omits a required field or uses an invalid value (`status: in-progress` instead of `status: draft`).
- **Conditional-field rules unenforced.** `veracidade` and `convicção` are required on `axiom | premise | discovery | audit | essay` and forbidden elsewhere (per `.claude/skills/custom/frontmatter-semantics.md:115,129`). A `node_type: spec` document carrying `veracidade: high` is silently invalid today.
- **Symmetric-edge consistency unenforced.** `contradicts` is symmetric — both sides use the same edge name (`vault/ontology-conventions.md:297`). Nothing verifies that when `A` declares `contradicts B`, `B` also declares `contradicts A` (and not, e.g., `refutes A`).
- **No audit script exists despite being promised.** `vault/ontology-conventions.md:295` says the cost of duplication "is mitigated by a periodic audit script that flags asymmetric edges — those are bugs, not freedom." No such script is in the repo.

### What stays the same

This discovery is scoped narrowly. The following are **out of scope** and must not be conflated with the enforcement question:

- **The catalog itself.** Appendix C's 21 forward edges and the bidirectionality rule are inputs to enforcement, not subjects of revision here. Proposals to add or remove edges go through their own discovery (per `.claude/skills/custom/edges.md:16`).
- **Authoring ergonomics.** Whether `## Connections` should be auto-generated, whether edges should be inlined in prose, whether targets should be linked vs. plain-text paths — none of these are settled by enforcement and none are addressed here.
- **The graph runtime / SQL layer.** `knowledge-graph` runtime work and the question of whether the graph is materialized in a database are explicitly orthogonal. Enforcement is about the **source `.md` files** being internally consistent; what a downstream system does with them is a separate question.
- **Inverse-side updates on the vault documents this discovery cites.** This discovery declares only its own forward edges. Writing the inverse edges on `vault/ontology-conventions.md` and the originating session is deferred to a separate sweep. The forward edge into `.claude/skills/custom/edges.md` is by-design forward-only under the resolved skills/agents carve-out — no inverse is required there.
- **Migration of existing non-conformant documents.** `vault/ontology-conventions.md:299` already names a "migration note" for documents authored before the rule shipped. The migration is downstream of the enforcement decision and not in scope here.

---

## 2. Core Concepts

### Rule vs. Discipline

Borrowed from the user's epistemic-honesty memory. A **rule** is a constraint a machine refuses to violate. A **discipline** is a constraint a human or agent tries to honor. Today every metadata constraint listed under "What's broken" is the second kind; the vault's documents call them the first kind. The discovery's central act is to name this gap and propose closing it on one specific surface.

The cost of leaving a rule as a discipline grows superlinearly with corpus size: each new document is a new opportunity for asymmetry, and each undetected asymmetry teaches future authors that asymmetry is tolerated. By the time the corpus is large enough that the cost is obvious, retroactive cleanup is the dominant cost of enforcement. Adding the surface earlier is cheaper than adding it later.

### Enforcement surface

A single named place where the rules run. The candidates differ in **when** they run (write-time, commit-time, push-time, build-time, periodic), **who** sees the failure (author at the editor, committer at git, CI bot in PR, scheduled report), and **what** they cost to maintain. Section 4 surveys five candidates; the implementation-plan that follows this discovery picks one (or a layered combination) based on the operational context the user inhabits.

### Validation tiers

The eight failure modes in §3 are not equally easy to check. They split into three tiers:

- **Tier 1 — purely local, frontmatter-only.** Required fields present, value within enum, conditional-field rules. Each file checks itself. Cheapest.
- **Tier 2 — local edge syntax + catalog membership.** Each `## Connections` row uses a known edge name, not a deprecated one. Each file checks itself against the catalog. Cheap.
- **Tier 3 — graph-global.** Inverse exists on the target, target file exists, endpoint `node_type`s satisfy Appendix C constraints, `contradicts` is symmetric. Requires loading every vault file before any check can pass. Most expensive but only this tier closes the bidirectionality gap.

A cheap surface (Tier 1+2 only, e.g., a per-file pre-commit hook) does not close the bidirectionality gap. Closing the bidirectionality gap requires Tier 3 and therefore a graph-load step. This is the dominant design constraint.

---

## 3. Failure Modes the Discipline Gap Admits

Each row names a failure, gives the worst-case observable consequence, and assigns the validation tier required to detect it. "Currently observed" cites a concrete instance in the repo if one was found.

| # | Failure mode | Observable consequence | Tier | Currently observed |
|---|---|---|---|---|
| F1 | Missing inverse (vault-to-vault) — `A` declares `derives-from B` but vault doc `B` has no `derives` row pointing back at `A` | The graph is a half-edge: queries from `B` cannot find `A`. Local-readability promise of bidirectionality (per `vault/ontology-conventions.md` Section 8) is silently violated. **Carve-out:** if `B` is under `.claude/skills/**` or `.claude/agents/**`, this is by-design forward-only and NOT a failure mode. | 3 | Likely widespread between vault nodes; no audit run yet |
| F2 | Asymmetric pair — `A` declares `derives-from B`, `B` declares something other than `derives` (e.g., `cites A`) | Same as F1, plus the relationship is misclassified depending on which side a reader opens. | 3 | Not enumerated |
| F3 | Broken target path — `## Connections` row points at `path/to/missing.md` | Dangling edge; reader follows the link to a 404. | 3 (file existence) | Not enumerated |
| F4 | Invalid edge name — author writes `references`, `relates-to`, `mentions`, etc., not in the 21-edge catalog | Edge silently outside the closed catalog. Future tooling that consumes the catalog ignores or misclassifies the row. | 2 | Not enumerated |
| F5 | Deprecated edge in use — `provenance-for`, `produces`, `references`, `contextualizes`, `resolves`, `depends-on`, `grounds`, `questions`, etc. | Same as F4, plus a documented "do not use" rule is violated. | 2 | **Yes** — `vault/discovery/domainspec-vault-foundations/epistemic-chain.md:428-429` uses `provenance-for` (deprecated per `vault/ontology-conventions.md:591`) |
| F6 | Node-type endpoint mismatch — e.g., a `domainspec-subagents-strategy.md` discovery declares `codified-as` pointing at another discovery instead of a constitution | Edge violates Appendix C cardinality / node-type constraint; reader following the chain lands on the wrong epistemic layer. | 3 (requires reading both endpoints' frontmatter) | Not enumerated |
| F7 | Missing required frontmatter — `node_type`, `status`, `version`, `last_updated`, etc. omitted | Document cannot be classified; agents that branch on `node_type` see undefined behavior. | 1 | Not enumerated |
| F8 | Forbidden conditional field — `veracidade` or `convicção` set on `node_type: constitution | spec | implementation-plan | conceptual | test | backlog | readme` | Confidence semantics applied to a document type where they are explicitly meaningless (per `frontmatter-semantics.md:115`); inflates apparent epistemic surface. | 1 | Not enumerated |
| F9 | Asymmetric `contradicts` — `A` declares `contradicts B`, `B` declares `refutes A` (or nothing) | Symmetric edge treated as directional; one side under-counts contradictions. | 3 | Not enumerated |
| F10 | Frontmatter not on line 1 — blank line, BOM, comment before `---` | YAML parser silently fails to extract frontmatter; document treated as unclassified. | 1 | Not enumerated |

The tier distribution matters: F7, F8, F10 are Tier 1 and would be caught by even the cheapest per-file linter. F4 and F5 are Tier 2 and need only the catalog as a static reference. F1, F2, F3, F6, F9 — including the headline bidirectionality gap — require Tier 3 graph loading. Any enforcement choice that does not include Tier 3 leaves the original concern untouched.

---

## 4. Enforcement Surface Alternatives

Five candidates, each with the trigger event, the failure surface, and the maintenance shape. The recommendation in §5 favors a layered combination over a single pick.

### A-1 — Pre-commit hook (`.git/hooks/pre-commit` or `pre-commit` framework)

**Trigger:** `git commit`. **Failure surface:** committer's terminal, immediately. **Cost:** must be installed per-clone (hook scripts are not version-controlled by default; `pre-commit` framework solves this with a manifest). **Coverage:** can run Tier 1 and Tier 2 cheaply on the *changed files only*. Running Tier 3 in a pre-commit is borderline — graph load over the whole vault on every commit becomes friction once the vault has hundreds of files.

**Trade-offs.** Fastest feedback loop (author sees the failure before pushing). Friction with `--no-verify` is a real escape hatch. Tier 3 graph load may exceed the "commits should feel fast" budget. Best as a Tier-1+2 surface backstopped by something else for Tier 3.

### A-2 — CI lint job (GitHub Actions / equivalent)

**Trigger:** push or PR open/update. **Failure surface:** PR check, blocks merge. **Cost:** one workflow file; can pin tooling, can cache the graph load between runs. **Coverage:** Tier 1, 2, and 3 — runs the full vault load once per PR, no per-commit friction. **Latency:** seconds to minutes between push and feedback.

**Trade-offs.** Cannot bypass without admin override. Catches everything but only after push, so the inner-loop feedback is slower than A-1. Failure on `main` (someone bypasses) breaks the build for everyone. Best as the **authoritative** surface.

### A-3 — Standalone `vault-lint` CLI (no automatic trigger)

**Trigger:** human runs `vault-lint` manually, or other tools call it. **Failure surface:** stdout. **Cost:** the CLI plus discipline to invoke it. **Coverage:** any tier the implementation supports.

**Trade-offs.** Re-creates the original discipline problem one layer up — now the discipline is "remember to run the linter" instead of "remember to declare both sides." However, it is the **enabling** building block: A-1 and A-2 both ultimately call something. Worth building first as a library/CLI, then wiring it into A-1 and A-2.

### A-4 — Build-time graph load that fails on inconsistency

**Trigger:** whatever loads the vault into the knowledge-graph runtime. **Failure surface:** build failure on the consumer side. **Cost:** depends on whether such a runtime exists; the repo has a `knowledge-graph` scaffold but it is not the canonical loader for vault metadata today.

**Trade-offs.** Closest to "the rule is the implementation" — if the graph cannot load, you cannot ship. But the failure is detected very late (consumer-side, not author-side), which is the opposite of the locality principle that motivates bidirectionality in the first place. Useful as a *additional* safety net, not as the primary surface.

### A-5 — Periodic audit script (scheduled, e.g., nightly cron / weekly job)

**Trigger:** time. **Failure surface:** report (issue, email, dashboard). **Cost:** one script + a scheduler. **Coverage:** Tier 1, 2, 3 — same as A-2 essentially.

**Trade-offs.** Latest feedback of any option. Useful for **detecting drift in already-merged files** that pre-existed enforcement. The audit-script idea is exactly what `vault/ontology-conventions.md:295` already promises ("a periodic audit script that flags asymmetric edges"); §1 notes that promise is unfulfilled. Lowest-friction adoption path, weakest at preventing new breakage.

### Summary table

| Surface | Trigger | Tier 1 | Tier 2 | Tier 3 | Author latency | Bypassable | Maintenance |
|---|---|---|---|---|---|---|---|
| A-1 pre-commit | `git commit` | yes | yes | borderline | seconds | `--no-verify` | per-clone install |
| A-2 CI lint | push/PR | yes | yes | yes | minutes | admin override | one workflow file |
| A-3 `vault-lint` CLI | manual | yes | yes | yes | on demand | trivially (don't run it) | one binary |
| A-4 build-time graph load | downstream consumer | partial | partial | yes | hours+ | only by skipping the build | depends on consumer |
| A-5 periodic audit | cron | yes | yes | yes | up to interval | none (it always runs) | one script + scheduler |

---

## 5. Recommendation

A layered combination, in this order of priority:

1. **Build A-3 first** as a `vault-lint` CLI that takes a path and emits structured findings. It is the artifact every other surface depends on. Without it, A-1 / A-2 / A-5 each re-implement the same checks. Implementation-plan should scope: (a) Tier 1 frontmatter validator, (b) Tier 2 edge-name validator against a hard-coded catalog manifest derived from `vault/ontology-conventions.md` Appendix C, (c) Tier 3 graph loader that produces the asymmetric-edge / dangling-target / endpoint-mismatch reports.
2. **Wire A-2 (CI lint) as the authoritative enforcement surface.** A failing job blocks the PR. This is the only surface that combines full coverage with no bypass without explicit admin action.
3. **Add A-1 (pre-commit) for Tier 1+2 only**, so authors see frontmatter and edge-name errors immediately. Keep the Tier 3 graph load out of the pre-commit hook to preserve commit speed; let CI catch Tier 3.
4. **Defer A-5** until the vault has so much pre-existing drift that a scheduled report adds value beyond what A-2 already gives. Today the vault is small enough that one CI-driven cleanup pass closes the gap.
5. **Defer A-4** entirely until / unless a downstream graph runtime becomes the canonical consumer of the vault. It is currently speculative tooling; basing the rule on it would create a circular dependency between "the vault must be consistent" and "the consumer must exist."

This recommendation is `convicção: medium` — the layering is defensible, but the choice of *which CI to run, what language the CLI is written in, where the catalog manifest lives* are all open implementation questions out of scope for a discovery. An implementation-plan must lock those.

---

## 6. Cleanup

Items in the existing vault that the enforcement surface would flag the moment it ran. Listing them here means the implementation-plan can either (a) fix them in the same PR that introduces the linter or (b) start the linter in advisory-only mode until they are fixed.

- `vault/discovery/domainspec-vault-foundations/epistemic-chain.md:428-429` — uses deprecated `provenance-for` edge twice. Per `vault/ontology-conventions.md:591`, replace with `created-by` (the discovery's side of the session→discovery `creates / created-by` pair).
- `vault/discovery/domainspec-subagents-strategy-definitions/domainspec-subagents-strategy.md:394-403` — uses several non-catalog edges: `proposes` (not in Appendix C), `mode-of` (not in Appendix C), `aligns-with` (not in Appendix C), `instantiates` (in the deprecated `(defer)` set per `.claude/skills/custom/edges.md:130`). Each row needs to be re-mapped to a catalog edge or admitted through a catalog discovery.
- All `## Connections` blocks across the vault — none has been audited for the inverse-side declaration. The first run of A-3 will produce the canonical list.

---

## 7. Open Questions

### OQ-1 — Are skill files (`.claude/skills/custom/*.md`) and agent files (`.claude/agents/*.md`) legal edge endpoints? — ✅ RESOLVED (2026-05-03)

**Resolution (final, supersedes earlier reading):** Forward-only edges from vault documents into `.claude/skills/**` and `.claude/agents/**` are **legal-by-design**. Vault docs MAY declare `cites`, `operationalized-by`, `proposes-edit`, etc. into these files. The target file does NOT carry a `## Connections` block; no inverse is written or expected; the audit script must NOT flag these as asymmetric. The skill/agent files are operational artifacts, not vault graph nodes — they have no `node_type`, no `veracidade`, no `convicção`, and they do not participate in the epistemic chain.

**Where the rule lives:**
- `.claude/skills/custom/edges.md` — "Exception — forward-only edges into skill and agent files" section.
- `.claude/skills/custom/edge-catalog.md` — authoring rules (rule 1) carries the exception.
- `vault/ontology-conventions.md` Section 8 — "Carve-out: edges into skill and agent files" subsection.
- `.claude/agents/domainspec-vault-metadata-curator.agent.md` — implements the carve-out (skips bidirectionality check for these targets; treats them as PASS).

The user's decision is recorded in the agent-memory entry `feedback_no_edges_on_non_vault_files.md` (file-naming retained for historical reference; the substantive rule is the carve-out above) and in [./backlog.md](./backlog.md) Completed/Done. Cross-repo / `.planning/**` / `.github/**` targets remain a separate question — see OQ-C in `vault/discovery/curator-pipeline-integration/discovery.md`.

The original framing is preserved below for traceability.

The 21-edge catalog in Appendix C constrains source/target by `node_type`. Skill files outside `vault/` carry no `node_type` frontmatter under the current schema. Yet `.claude/skills/custom/edges.md` is the most natural cite-target for a discovery about edge enforcement, because it is the operational artifact the rule lives in. Two readings:

- **(a) No.** Edges are vault-internal; cross-references to skills are prose, not edges. This means this discovery cannot edge-cite `edges.md` even though `edges.md` is the rule it is documenting a gap in. The discovery must redirect citations to `vault/ontology-conventions.md` (which it does, per §8 below).
- **(b) Yes, with a node_type.** Admit skill files as a new `node_type: skill` and let them participate in the graph. This is a meaningful schema change and out of scope here.

**Recommendation (now decision):** reading (a).

### OQ-2 — Should the catalog manifest live as a parseable file, or stay prose in `ontology-conventions.md`?

A linter needs the 21-edge catalog as data (for membership checks and inverse-name lookup). Today the catalog is a Markdown table inside Appendix C. The implementation-plan must decide whether to (a) parse the table at lint time, (b) duplicate it as a YAML/JSON manifest checked into the repo, or (c) generate the manifest from the table in a build step.

**Recommendation:** (c) — generate from the table. Keeps Appendix C as the authoritative human-readable form; gives the linter a structured input; the build step itself is a Tier-1 check that the table is well-formed. Lock in the implementation-plan.

### OQ-3 — How should the linter handle pre-existing non-conformant documents during rollout?

If the linter is wired to fail CI on day one, every PR is blocked until every existing document is fixed. Two options:

- **(a) Big-bang cleanup.** One PR fixes every existing edge, frontmatter omission, and deprecated reference; CI gating turns on after merge. High one-shot cost; clean state afterward.
- **(b) Advisory-then-enforcing.** Linter runs in CI but does not fail the build initially; it produces a report. Once the report shrinks to zero, flip to enforcing. Lower up-front cost; risk of perpetual "almost zero" state.

**Recommendation:** (b), with a deadline. Without a deadline (b) becomes another discipline.

### OQ-4 — Inverse declarations on this discovery's vault targets are pending

Per the dispatch instructions, the inverse edges on `vault/ontology-conventions.md` and the originating session were intentionally not written. Until those vault-internal inverses land, this discovery itself is asymmetric on the vault-to-vault leg — exactly the failure mode (F1) it documents. The recursion is acknowledged. The implementation-plan should treat closing this discovery's own vault-side asymmetry as a smoke test of the linter once it exists.

The `.claude/skills/custom/edges.md` inverse is **no longer pending** — it is by-design omitted under the OQ-1 resolution (skills/agents carve-out). Only vault-internal inverses remain in this OQ.

---

## 8. Connections

| Document | Type | Description |
|----------|------|-------------|
| [../../ontology-conventions.md](../../ontology-conventions.md) | `derives-from` | Section 8 (Directionality Principle, including the formal skills/agents carve-out) and Appendix C (21-edge catalog) are the rules whose unenforced status this discovery names. The "rule" framing in §1 derives directly from this document's prose. |
| [../../ontology-conventions.md](../../ontology-conventions.md) | `cites` | §3-F5 cites the deprecated-edge list; §3-F8 cites the conditional-field rule indirectly through the schema; §1 quotes §8 verbatim. |
| [../curator-pipeline-integration/discovery.md](../curator-pipeline-integration/discovery.md) | `cited-by` | The curator-pipeline-integration discovery cites this document as the source of OQ-1 (skill/agent file endpoints — RESOLVED) and links its now-resolved OQ-B back here. |
| [../../../.claude/skills/custom/edges.md](../../../.claude/skills/custom/edges.md) | `cites` | The skill that operationalizes the bidirectionality rule and its formal skills/agents carve-out — the canonical operational statement of the rule whose enforcement gap this discovery names. **Forward-only by design** under the OQ-1 resolution; no inverse on the skill file. |
| `vault/sessions/2026-05-03-0255-oq1-closed-linter-backlog.md` | `question-closed-by` | The 0255 session resolved OQ-1 (skill/agent files as edge endpoints) recorded in §7; resolution annotated in place with the original framing preserved for traceability. |
| [../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md](../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md) | `contradicts` | The 2026-05-03 cross-boundary-rule + edges-hygiene session inverts the prior OQ-1 resolution. Previous closure ruled "skill files are NOT legal edge endpoints"; new ruling is "forward-only edges to skill/agent files are legal-by-design." Symmetric `contradicts` per the catalog. The new resolution supersedes the prior one and is now reflected in §7 OQ-1 RESOLVED. |
| [../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md](../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md) | `modified-by` | Same session edited the document body and §7 OQ-1 prose to record the new RESOLVED state. |

> **Note on `cites` vs `derives-from` to the same target.** The catalog (Appendix C) does not forbid two different forward edges between the same pair of nodes. `derives-from` carries lineage (this discovery's existence is grounded in the document); `cites` marks specific load-bearing claims. They are orthogonal and both apply.

> **Edges deliberately omitted.**
> - **No edge to the originating session.** The session-side forward edge is `creates`; the discovery-side inverse is `created-by`. Per the dispatch instruction to write only forward edges from this document and defer inverses, the `created-by` row is omitted. The session that created this discovery should declare `creates` pointing here when the inverse-side sweep runs.
> - **No edges to other discoveries.** This discovery is structurally adjacent to `vault/discovery/domainspec-vault-edges/` (which produced the catalog) and `vault/discovery/domainspec-vault-foundations/` (which holds the structural rules), but neither contains a current document that this discovery `derives-from` in the strict catalog sense — the rules are codified in `ontology-conventions.md`, which is where the lineage edge correctly lands.
>
> Note: the edge to `.claude/skills/custom/edges.md` is now declared in the table above as a forward-only `cites` (legal-by-design under the OQ-1 RESOLUTION).
