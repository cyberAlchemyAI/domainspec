---
tags: [engineer-view, skill-authoring, decision-record]
node_type: conceptual
is_session: false
layer: ontology
nature: reference, explanatory
status: active
version: 0.1.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
---

# engineer-view — decision record

Rationale moved out of `../SKILL.md` during the 2026-06-12 rewrite (4,890 → ~1.5k words). The SKILL keeps every rule; this file keeps the *why*. Nothing here is normative on its own — if a statement below conflicts with the SKILL, the SKILL wins.

## D1 — Frontmatter authoring decisions (2026-06-12)

Originally a load-bearing HTML comment in the SKILL frontmatter.

**Family-shape anchor.** This is a HAND-AUTHORED domainspec-* skill, authored as a faithful sibling of `ontology-view`; its frontmatter anchors to the domainspec-* MAJORITY family shape (`name` + `description` + `argument-hint` + `allowed-tools`). The anchor is the majority shape, NOT a universal invariant — `domainspec-subagents-strategy` itself carries only `name` + `description`, so do not cite the dispatch engine's own frontmatter as an agent+argument-hint exemplar.

**`agent:` intentionally omitted.** The parent session ENACTS the strategist/orchestration role directly (mirroring `research/SKILL.md` and the ontology-view sibling), per domainspec-subagents-strategy where "strategist" is a ROLE the parent enacts ("When this skill is active, you (the parent Claude session) enact the strategist role"), NOT a registered loadable agent. Do NOT bind a `domainspec-strategist` token: no such agent file exists, and a frontmatter `agent:` token with no backing file risks a load failure or a silently dropped binding.

**`Task`, not `Agent`, in allowed-tools.** CONVENTION-CONFORMANCE matching the ontology-view sibling: the hand-authored domainspec siblings declare `Task`, not `Agent` (re-count at authoring time — the exact denominator drifts across tree scopes; the stable invariant is "the hand-authored siblings declare Task, not Agent"). It is NOT a harness gate: `Agent` is the runtime name, core skills declare it and load fine, and no validator code rejecting `Agent` exists. The choice is a deliberate convention divergence — it is NEVER "Agent fails harness validation".

**`AskUserQuestion`, not `AskQuestions`.** The chosen user-gate token, matching the ontology-view sibling and the user-gating siblings (decision-gate / readiness-gate / start) — a defensible split-neutral choice anchored to the gating siblings, not a count win.

**Omitted on purpose:** `tier` / `domain` / `version` — Arcanum-generated-sigil fields; the hand-authored domainspec skills do not carry them.

**Explicitly forbidden:** `surface_kind` / `runtime` / `canonical_source` / `generated_by` / `mutation_policy` — bootstrap-only overlay fields that assert a regeneration contract that does NOT exist for a hand-authored skill — and the `Agent` token they ship with. Do NOT mirror a generated-runtime frontmatter overlay. The same logic forbids `generated_by`-style frontmatter on the *artifact*: the derive-only link is an edge in `## Connections` (see D6).

**Body family.** domainspec-* (`<objective>/<context>/<process>/<output-contract>`); the rewrite renders these as plain headings. Observability is rendered as PROSE, never an `<observability>` sigil tag (the hand-authored siblings do not carry that tag). The old `<quality-bar>` was an empirically-present-but-UNSANCTIONED hybrid (no normative SKILL.md body-convention doc exists on disk); it was kept with no claim of sanction, matching the ontology-view sibling, and is now folded into the lifecycle/inventory rules.

## D2 — Single-instance validation: the GoldenQuill/Tilth worked example (2026-06-12)

The skill is **single-instance-validated**: the GoldenQuill / Tilth engineer-view at `C:\Users\victo\domainspec-core\projects\goldenquill\victor\engineer-view.md` (verified on disk at authoring time) is the ONLY validated on-disk instance of an engineer-view artifact; the first non-GoldenQuill run is the reusability proof.

Be honest about what that one instance does NOT show: it carries no `governance_status` overlay field and emits no `domainspec-emit-signals` envelope — both are skill-introduced disciplines this view adds — so the overlay-status and telemetry disciplines are **transfer-asserted, not witnessed on disk**. Do not present the worked example as a model of either.

The SKILL's reusability gate (zero `EXAMPLE-REPLACE-ME` rows, zero GoldenQuill tokens) was originally framed as a mechanical "reusability-proof checklist"; its remaining items are restatements of the inventory invariants (one row per stance, authority on every row, CRITICAL on thesis-blocking rows), which the SKILL states once each. The worked example's decision-inventory columns (`# | Decision-or-stance | Verdict | Status | Authority`) are the source of the SKILL's column order.

## D3 — Orthography of `max_loops_reached` (2026-06-12)

The cap-exit value is `max_loops_reached` in research's enum but `loop_cap_reached` in the base subagents-strategy constitution. This skill REUSES research's 7-value `exit_reason` enum VERBATIM, so it follows the research spelling — telemetry stays consistent with the enum it is emitted under and read against (research's). Trade-off, stated honestly: this is NOT base-compatible — a reader keying off the base taxonomy (`loop_cap_reached`) would see `max_loops_reached` as a mismatch. The emitter/reader contract is research's enum, not the base one. Coining a narrower enum was rejected for the same reason.

## D4 — PEER-NOT-NESTED and the two-mechanism invocation path (2026-06-12)

The skill re-implements the explorer/skeptic/writer/auditor lifecycle LOCALLY and routes composition through `domainspec-subagents-strategy` as a PEER wave-recipe — it does NOT dispatch through `research/SKILL.md`. Routing through research would create the two-orchestrator ungoverned-channel failure (Drift-5): research is a self-contained domain port keyed to `discoveries/`, not a generic dispatcher. The local re-implementation is a deliberate portability choice, not duplication to eliminate. The same logic forbids emitting Arcanum `sigil-invocations.jsonl` (a non-federated separate telemetry stream) instead of `domainspec-emit-signals` → `pipeline-signals.jsonl`.

Mechanically, the invocation path is TWO distinct mechanisms — never conflate them: (1) the parent session ENACTS the strategy SKILL (Skill/slash invocation; there is no `domainspec-subagents-strategy` agent file on disk to Task-dispatch); (2) the strategist then dispatches the registered writer/explorer/role agents with the **Task** tool (Task targets registered agents, never a skill name). Do not leave the wiring to the agent to invent.

## D5 — Modes-as-modes and the zig-zag default-skip (open owner's call)

The draft/validate/review/publish gate split is modeled as `--mode` values for compactness, mirroring the ontology-view sibling. Whether validate/review/publish should instead be three companion SKILL packages mirroring research-validate/review/promote remains an open owner's call.

No end-to-end zig-zag engineer-view exists yet — the lifecycle (loop-back / converge / exit machinery) is transfer-validated only, exercised in peer domainspec dispatches. This is why the skip predicate (`single + N=1 + explorer`) is the DEFAULT for ordinary single-author runs and zig-zag is opt-in. The zig-zag iteration-block schema has no canonical home on disk; this skill governs it locally.

## D6 — Derive-only / reconcile-not-regenerate (2026-06-12)

The view is a derive-only canonical artifact whose source `discovery` is the SOLE sanctioned mutation trigger, and it is **reconcile-not-regenerate** because the view carries judgment the discovery does not: the verdicts, RESOLVED/OPEN/CRITICAL statuses, and on-disk authority citations exist nowhere in the discovery — the Open Questions do, the answers do not. Rebuilding from scratch would destroy authored judgment; evolve mode preserves it except where the discovery delta forces a change.

The link is an EDGE, not a frontmatter field: `derives-from → discovery.md` in `## Connections` (inverse `derives`), riding the existing `node_type: discovery` edge catalog. `generated_by` / `mutation_policy` / `canonical_source` frontmatter would assert the regenerate contract this view rejects (see D1). Drift is version-based: the `## Connections` row records the discovery `version` last reconciled against; a newer discovery version makes the view STALE — flagged by an audit-alignment-style drift check and fixed only by re-running evolve mode, never hand-patched.

## Connections

- `derives-from → ../SKILL.md` (decision rationale for the 2026-06-12 rewrite)
