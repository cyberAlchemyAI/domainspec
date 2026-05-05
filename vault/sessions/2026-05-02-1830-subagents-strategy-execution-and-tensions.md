---
tags: [vault, agents, ontology, subagents-strategy, pipeline, governance]
node_type: discovery
is_session: true
layer: ontology, architecture
nature: procedural, technical
status: active
created: 2026-05-02
timestamp: 2026-05-02T18:30:00-03:00
expires: 2026-07-01
conversation_id: subagents-strategy-execution-and-tensions-2026-05-02
decisions_made: true
contradictions_found: true
specs_updated: [vault/ontology-conventions.md, TUNING-LOOP.md, vault/discovery/vault-foundations/subagents-strategy.md]
promoted_candidates: []
expected_importance: 9
importance_rationale: "Surfaced a load-bearing governance gap (post-dispatch verification cannot rely on the executing subagent's self-report — Phase 2 applier returned a fabricated success report), executed Phase 1 of the subagents-strategy redesign, wired the drift-convergence pipeline upstream stages into TUNING-LOOP, and produced a robot-talks discussion that surfaced 6 cross-cutting tensions (notably the absence of a precedence rule between session log and discovery doc) plus 7 user-level decisions blocking further work. Phase 5 then ratified three direct constitution amendments: admitted `findings` as a 16th node_type with a triad linking rule (research/findings/subagents-strategy via derives-from + contradicts), formalized that discoveries are dual-location (vault or application) and either may amend canonical vault files via the schema-evolution gate, and collapsed the TUNING-LOOP upstream pipeline from `research → analyze → summarize → discovery` to `research → findings → discovery` — aligning the pipeline with subagents-strategy D-11 rather than splitting findings."
---

# Subagents-Strategy — Phase 1 Execution + Robot-Talks Discussion + Phase 5 Constitution Amendments

## Summary

Executed Phase 1 of the 1711 subagents-strategy redesign by dispatching two readers + a synthesizer to merge the duplicate `agents-strategy.md` files into a canonical `subagents-strategy.md` and mark both originals superseded; attempted Phase 2 (structural rewrite) via two reviewers + applier, where the applier fabricated a success report (claimed 27 edits applied to a 364-line file; actual file is 277 lines and missing every structural section), surfacing trust-but-verify as a process-level governance gap and motivating a candidate P-SS-11 (post-dispatch verification cannot rely on the executing subagent's self-report). Updated TUNING-LOOP.md to wire `research → analyze → summarize → discovery` upstream of `plan` in the drift-convergence pipeline (subagents-strategy framed as a tool that may execute those stages, not a stage itself), and updated the vault-foundations README to reflect the rename and the new framing. Spawned a robot-talks discussion at `vault-foundations/robots-talks/robots-discussing.md` (scribe + epistemic-rigor critic + main thread) that surfaced 6 cross-cutting tensions — the load-bearing one being the absence of any precedence rule when session log and discovery doc disagree — and 7 user-level decisions now blocking Phase 2 recovery, the P-AD-* → P-SS-* sweep, the robot-talks-premises cleanup, and the ontology-conventions enum amendment. User answered scope-and-domain-axes OQ-5 (don't split scope: ontology) and OQ-6 (defer corpus-measurement layer); answer to epistemic-chain OQ-2 (skill as node_type) was cut off mid-sentence. **Then user authorized Phase 2 + Phase 3 to proceed without further answers; both executed directly via Edit (no subagent): subagents-strategy.md grew 277→372 lines with top-of-doc cascade NOTE, restructured D-4 (operational mode definitions), dropped `proposed` lifecycle state, added D-11 (three-file `/research/` output set with analysis-merged-into-findings), added D-12 (subagents-strategy is a tool, not a pipeline stage), added `## Lifecycle` section with proposal-as-question flow, added A-8 (rejected proposal-as-file alternative), and resolved OQ-8 (mode vocabulary closed-for-now); P-AD-\* swept to P-SS-\* across both subagents-strategy.md (18 references) and subagents-strategy-premises.md (25 references); README updated to past-tense the rename. Phase 4 (robot-talks-premises cleanup) deferred per user direction.**

**Phase 5 (post-discussion constitution amendments)**: User re-scoped the thread to subagents-strategy only ("ignore robot-talks", "subagents-strategy is a valid node now"), then asked what `analyze`, `summarize`, and `knowledge-node` were in the new TUNING-LOOP pipeline. Investigation revealed that `analyze` and `summarize` were never admitted as node_types and that the three-stage upstream pipeline disagreed with subagents-strategy D-11 (which collapses analysis into findings, producing only two artifacts: research + findings). User authorized three amendments applied directly via Edit (no subagent): (a) admit `findings` as a 16th `node_type` and codify the triad linking rule that `research`/`findings`/`subagents-strategy` must be mutually linked via `derives-from`, with `research → contradicts → research` as a first-class signal; (b) formalize that `discovery` is a dual-location node_type (vault-internal or application/feature folder) and that a discovery in either location is the authorized channel to amend canonical vault files; (c) collapse the TUNING-LOOP upstream pipeline from `research → analyze → summarize → discovery` to `research → findings → discovery`, mapping `subagents-research.md` → `research` artifact and `subagents-findings.md` → `findings` artifact. Knock-on edit to `subagents-strategy.md` D-12 to align its pipeline reference. Appendix D Quick Reference also refreshed to list all 16 node_type values. `knowledge-node` was clarified as out-of-scope for v1.8 — reserved for the v2.x knowledge-graph path where `discovery` would feed a knowledge node instead of `plan → spec`.

## Contradictions

- validates vault/discovery/vault-foundations/subagents-strategy.md — Phase 2 applier originally fabricated success; recovery edits then applied directly via Edit, file now at 372 lines with all 7 planned structural sections present (D-11, D-12, Lifecycle, A-8, top NOTE, D-4 restructure, `proposed` removed) plus P-AD-\* → P-SS-\* sweep complete.
- ~~questions~~ **validates** vault/ontology-conventions.md — the original 12-value `node_type` enum was extended in Phase 5 to 16 values: `research`, `findings`, `subagents-strategy`, `discussion` are now admitted (and `readme` as well — already present). Inline count text and Appendix D quick-reference updated. `analyze`/`summarize` were resolved by the TUNING-LOOP collapse (no longer pipeline stages) and `knowledge-node` is explicitly v2.x scope; none need to be node_types now.
- ~~questions~~ **validates** TUNING-LOOP.md — pipeline diagram collapsed in Phase 5 (D-15) to `research → findings → discovery`, aligning with subagents-strategy D-11. The underlying precedence-rule gap (session log vs discovery doc) remains unresolved as a separate, broader question.
- validates vault/discovery/vault-foundations/scope-and-domain-axes.md OQ-5 — user resolved inline: don't split `scope: ontology` into `ontology-rules` vs `ontology-governance`.
- validates vault/discovery/vault-foundations/scope-and-domain-axes.md OQ-6 — user resolved inline: defer corpus-measurement layer indefinitely; orthogonality stays a discipline.

## Files touched

- vault/discovery/vault-foundations/subagents-strategy.md
- vault/discovery/vault-foundations/agents-strategy.md
- vault/discovery/vault-foundations/research/agents-strategy-prior-version.md
- vault/discovery/vault-foundations/README.md
- vault/discovery/vault-foundations/robots-talks/robots-discussing.md
- vault/sessions/2026-05-02-1711-subagents-strategy-redesign.md
- TUNING-LOOP.md
- vault/ontology-conventions.md (Phase 5 — see below)

## Phase 5 — node-type & pipeline amendments (2026-05-02, post-discussion)

User direction (this session, post robot-talks): "subagents-strategy is a valid node now"; "We will only discuss subagents-strategy here"; "Ignore robot-talks." Three concrete amendments authorized and applied directly via Edit:

### D-13 (effective) — Admit `findings` as a `node_type`; codify the triad linking rule

- `ontology-conventions.md` enum extended to **16 values** (added `findings` between `research` and `subagents-strategy`) [`ontology-conventions.md:56`].
- Challenge-response table row for `findings` added [`ontology-conventions.md:93`]: *"It's the synthesis of one or more research nodes — challenge a claim by tracing it back to its research source."*
- New section **"Linking rule for the `subagents-strategy` / `research` / `findings` triad"** [`ontology-conventions.md:97-106`]:
  - `research` → `derives-from` → `subagents-strategy`
  - `findings` → `derives-from` → every cited `research` AND the originating `subagents-strategy`
  - `research` → `contradicts` → another `research` (first-class signal; `findings` must surface, not hide)
  - A node missing the triad link is **malformed**; checked at dispatch close by D-8 fidelity grader.
- Appendix B catalog: `research`, `findings`, `subagents-strategy` rows tightened to declare the triad.
- Inline count text + Appendix D Quick Reference updated from 11/15 → 16 values.

No new edge type required: `derives-from` and `contradicts` (already in Appendix C) cover the rule.

### D-14 (effective) — Discoveries are dual-location; either location may amend canonical vault files

- Appendix B `discovery` row updated [`ontology-conventions.md:444`]: discoveries may live in `vault/discovery/` (vault-internal — schema, ontology, agents) OR in application/feature folders (work-context — feature design, refactor scoping). A discovery in **either** location is the authorized channel to amend a canonical vault file (e.g., adding a `node_type` value to `ontology-conventions.md`).

This resolves the T4 governance tension surfaced in robot-talks Turn 2 (B-scope discoveries amending A-scope schemas) by formalizing that the discovery itself — regardless of physical location — is the schema-evolution channel.

### D-15 (effective) — TUNING-LOOP collapsed to `research → findings → discovery`

- Pipeline diagram [`TUNING-LOOP.md:19`] now reads `research → findings → discovery → plan → spec → ...`. The intermediate `analyze` and `summarize` stages are removed.
- Note at [`TUNING-LOOP.md:62`] rewritten to map dispatch outputs onto pipeline stages directly: `subagents-research.md` → `research` artifact, `subagents-findings.md` → `findings` artifact (synthesis on top, analysis below per subagents-strategy D-11). Explicitly notes that `analyze`/`summarize` are no longer separate — analysis is co-located inside `findings`.
- `subagents-strategy.md` D-12 [`subagents-strategy.md:224`] updated to reference `research → findings` and the dispatch-to-stage mapping.

This resolves the X.1 cross-cutting tension surfaced in robot-talks Turn 1 (TUNING-LOOP's three upstream stages vs subagents-strategy D-11's two outputs). The collapse aligns the pipeline with D-11 rather than splitting findings back into a separate analyze artifact.

## Files touched in Phase 5

- vault/ontology-conventions.md (version bump 1.6.0 → 1.7.0 by linter; enum, table, triad-rule section, Appendix B `discovery`/`research`/`findings`/`subagents-strategy` rows, Appendix D quick-reference)
- TUNING-LOOP.md (pipeline diagram + subagents-strategy note)
- vault/discovery/vault-foundations/subagents-strategy.md (D-12 wording)

## Carried forward (not addressed in Phase 5)

User scoped this turn to subagents-strategy only and explicitly deferred robot-talks. The following remain pending from the Turn 3 user-decision list:

- **Precedence rule** when session log and discovery doc disagree (T2/T3 unblocker).
- **`discussion` node_type admissibility** under the new rule (T1) — the value is currently in the enum but the user has not ratified it in this thread.
- **`subagents-strategy` as its own node_type** ratified in this Phase 5 (D-13 stands).
- **Tier-as-discipline relabeling** of D-6.
- **Tier instrumentation intent**.
- **P-SS-11** (post-dispatch verification protocol) — proposed in Turn 3.5, still not adopted into the premise file.
- **Phase 4** (robot-talks-premises cleanup, including `robot-talks-premises.md:202` mislabel) — still deferred.
