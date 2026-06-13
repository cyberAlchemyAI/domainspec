---
tags: [ontology-view, skill-authoring, decision-record]
node_type: conceptual
is_session: false
layer: ontology
nature: reference, explanatory
status: active
version: 0.1.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
---

# ontology-view — decision record

Rationale moved out of `../SKILL.md` during the 2026-06-12 rewrite (5,610 → ~1.6k words). The SKILL keeps every rule; this file keeps the *why*. Nothing here is normative on its own — if a statement below conflicts with the SKILL, the SKILL wins.

## D1 — Frontmatter authoring decisions (2026-06-12)

Originally a load-bearing HTML comment in the SKILL frontmatter.

**Family-shape anchor.** This is a HAND-AUTHORED domainspec-* skill; its frontmatter anchors to the domainspec-* MAJORITY family shape (`name` + `description` + `argument-hint` + `allowed-tools`). The anchor is the majority shape, NOT a universal invariant — `domainspec-subagents-strategy` itself carries only `name` + `description`, so do not cite the dispatch engine's own frontmatter as an agent+argument-hint exemplar.

**`agent:` intentionally omitted.** The parent session enacts the strategist/orchestration role directly (mirroring `research/SKILL.md`), per domainspec-subagents-strategy R24 where "strategist" is a ROLE the parent enacts, not a registered loadable agent. An earlier draft bound `domainspec-orchestrator` (a real agent at `.claude/agents/domainspec-orchestrator.agent.md`), but that agent's published contract is ROUTE-ONLY ("route each request to exactly one specialist workflow; do not replace specialist commands") — binding it as this skill's authoring worker inverts its contract. Do NOT bind `domainspec-strategist` either: no such agent file exists, and a frontmatter `agent:` token with no backing file risks a load failure or a silently dropped binding.

**`Task`, not `Agent`, in allowed-tools.** CONVENTION-CONFORMANCE: 0 hand-authored domainspec siblings declare `Agent` in allowed-tools (re-count at authoring time — the exact denominator drifts across tree scopes; the stable invariant is "0 declare Agent"). It is NOT a harness gate: `Agent` is the runtime name, ~21 core skills declare it and load fine, and no validator code rejecting it exists. The choice diverges from 100% of hand-authored siblings (convention) — never assert "Agent fails harness validation".

**`AskUserQuestion`, not `AskQuestions`.** The family is EVENLY SPLIT (~9/9 WITHIN domainspec-* allowed-tools — the relevant family) between the two tokens; this is NOT a majority within that scope. (The BROADER skills corpus skews ~41/10 toward `AskUserQuestion`; the 9/9 even-split claim holds only at domainspec-* scope.) `AskUserQuestion` was chosen because it is the token used by the user-gating siblings (decision-gate / readiness-gate / start) — a defensible split-neutral choice anchored to the gating siblings, not a count win.

**Omitted on purpose:** `tier` / `domain` / `version` — Arcanum-generated-sigil fields; 0 hand-authored domainspec skills carry them.

**Explicitly forbidden:** `surface_kind` / `runtime` / `canonical_source` / `generated_by` / `mutation_policy` — bootstrap-only overlay fields that assert a regeneration contract that does not exist for a hand-authored skill — and the `Agent` token they ship with. Do NOT mirror the ontology-vault frontmatter. The same logic forbids `generated_by`-style frontmatter on the *artifact*: the derive-only link is an edge in `## Connections`, because those fields would assert the regenerate contract the view rejects (it is reconcile-not-regenerate).

**Body family.** domainspec-* (`<objective>/<context>/<process>/<output-contract>`); the rewrite renders these as plain headings. The skill borrowed the Arcanum ontology-vault SKILL only for structure-of-ideas (its `<logic-type>` mapped to `<context>`), never its bootstrap frontmatter, Arcana sigil tags, or `sigil-invocations` telemetry. The old `<quality-bar>` was an empirically-present-but-UNSANCTIONED hybrid (no normative SKILL.md body-convention doc exists on disk); it was kept with no claim of sanction and is now folded into the lifecycle/output rules.

## D2 — The worked-example saga: 25/22/21 vs 24/21/21, and the nearest-path trap (2026-06-12)

The skill is **single-instance-validated**: GoldenQuill is the only project on disk carrying the discovery / system-view / engineer-view triad; the first non-GoldenQuill run is the reusability proof. Be honest about what that one instance does NOT show:

- **Nearest-path trap.** The GoldenQuill worked example mis-resolved the constitution by nearest-path, pinning the stale **v2.1.1** mirror (an embedded freeze) and citing it throughout — a partial COUNTER-example to the version+path resolution rule. The two disagreeing copies live in DIFFERENT repos: the skill package's beside-file is v2.4.0, while the `-core` project's reachable copies top out at v2.1.1. "Highest version wins" must therefore be scoped to the project-under-analysis's own repo tree (nearest ancestor `.git`) — never silently crossing into the skill's repo and resolving a constitution the project's live catalog does not key to.
- **The count never happened.** The worked example never performed any live-table count — its artifact records only the literal **21** ("catalog (21 edges, closed)"). **24/21/21** is what an author WOULD derive from the wrongly-resolved v2.1.1 file under its `universal / document-specific / session-specific` subsections — derived, not stated. **25/22/21** (live-table / Appendix-C header / prose) is a property of v2.4.0 under its `epistemic / provenance / reference` subsections that the worked example never computed. The header is NOT the live-table truth; the three-way mismatch is surfaced, never reconciled.
- **Subsection names are version instances.** Applying v2.4.0's `epistemic/provenance/reference` names to v2.1.1 returns 0 rows — the origin of the SKILL's "zero count = re-derive" guard.
- **Appendix C anchor.** In canonical v2.4.0 the in-constitution unconstructible-by-type prose is line 559: "A session cannot originate an epistemic edge — doing so would make the session an epistemic actor, which it is not." Do not trust the line number blind; re-derive on the version-resolved file.
- **Net:** both the resolution discipline and the live count are **transfer-asserted, not witnessed on disk** — hence the SKILL's one-liner "the worked example never counted — not a model". Do not expect the worked-example artifact to yield 25/22/21 or 24/21/21.

Related precedent hygiene: `edges-enforcement-refactoring/discovery.md` is citable only as "the catalog is mechanically-enforceable + co-evolving + internally-inconsistent" (an authoring-surface drift proposal) — NOT as the forbidden-edge precedent. The forbidden-edge discipline is skill-introduced; the constitution's only edge-legality levers are per-edge source/target `node_type` constraints plus "do not invent edges" (zero "forbidden edge" / "unconstructible" / "category error" / "fail-closed" vocabulary).

**Worked-example reflexive guards** (illustrations of archetype 4; verify on disk before citing): `drifts-from` predicate `behavior_id(from) != behavior_id(to) AND role(from)=running AND role(to)=designed`; `contradicts` self-loops forbidden; `distilled-to` "an insight cannot distill back into its own outcome".

**Blocker-OQ exemplars** (illustrative list behind the SKILL's "blocker OQs flagged"): unfiled edge amendments, mislabeled LIVE guards, unresolved constitution-version skew, the live-table-vs-header-vs-prose count mismatch, a reflexive guard with no predicate body on disk.

## D3 — Orthography of `max_loops_reached` (2026-06-12)

The cap-exit value is `max_loops_reached` in the research constitution but `loop_cap_reached` in the base subagents-strategy constitution (v0.3.0+). This skill reuses research's 7-value `exit_reason` enum VERBATIM, so it follows the research spelling — telemetry stays consistent with the enum it is emitted under and read against (research's). The trade-off, stated honestly: this is NOT base-compatible — a reader keying off the base taxonomy would see `max_loops_reached` as a mismatch. The emitter/reader contract is research's enum, not the base one. Coining a narrower enum was rejected for the same reason.

## D4 — PEER-NOT-NESTED / Drift-5 (2026-06-12)

The skill re-implements the explorer/skeptic/writer/auditor lifecycle LOCALLY and routes composition through `domainspec-subagents-strategy` as a PEER wave-recipe — it does NOT dispatch through `research/SKILL.md`. Routing through research would create the two-orchestrator (**Drift-5**) ungoverned-channel failure: research is a self-contained KT-port keyed to `discoveries/`, not a generic dispatcher. The local re-implementation is a deliberate portability choice, not duplication to eliminate. The same Drift-5 logic forbids emitting Arcanum `sigil-invocations.jsonl` (a non-federated separate telemetry stream) and citing a `mars-research-emit-signals` sibling in the `.github`/copilot trees instead of the `domainspec/.claude/` emit-signals copy.

Mechanically, the invocation path is TWO distinct mechanisms: (1) the parent session ENACTS the strategy SKILL (Skill/slash invocation — there is no `domainspec-subagents-strategy` agent on disk to Task-dispatch); (2) the strategist then dispatches the registered writer/explorer/role agents with the **Task** tool (Task targets registered agents, never a skill name).

## D5 — Modes-as-modes (open owner's call)

The draft/validate/review/publish gate split is modeled as `--mode` values for compactness. Whether validate/review/publish should instead be three companion SKILL packages mirroring research-validate/review/promote remains an open owner's call. No end-to-end zig-zag ontology-view exists yet — the loop-back/converge/exit machinery is exercised in peer domainspec-theorem dispatches, transfer-validated only.

## Connections

- `derives-from → ../SKILL.md` (decision rationale for the 2026-06-12 rewrite)
