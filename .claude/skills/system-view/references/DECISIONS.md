---
tags: [system-view, skill-authoring, decision-record]
node_type: conceptual
is_session: false
layer: ontology
nature: reference, explanatory
status: active
version: 0.1.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
---

# system-view — decision record

Rationale moved out of `../SKILL.md` during the 2026-06-12 rewrite (4,988 → ~1.5k words). The SKILL keeps every rule; this file keeps the *why*. Nothing here is normative on its own — if a statement below conflicts with the SKILL, the SKILL wins.

## D1 — Frontmatter authoring decisions (2026-06-12)

Originally a load-bearing HTML comment in the SKILL frontmatter.

**Family-shape anchor.** This is a HAND-AUTHORED domainspec-* skill; its frontmatter anchors to the domainspec-* MAJORITY family shape (`name` + `description` + `argument-hint` + `allowed-tools`). The anchor is the majority shape, NOT a universal invariant — `domainspec-subagents-strategy` itself carries only `name` + `description`, so do not cite the dispatch engine's own frontmatter as an agent+argument-hint exemplar.

**`agent:` intentionally omitted.** The parent session enacts the strategist/orchestration role directly (mirroring `research/SKILL.md` and the sibling ontology-view), per domainspec-subagents-strategy R24 where "strategist" is a ROLE the parent enacts, not a registered loadable agent. There is NO `domainspec-subagents-strategy` agent file on disk to bind. Do NOT bind `domainspec-strategist` either: no such agent file exists, and a frontmatter `agent:` token with no backing file risks a load failure or a silently dropped binding.

**`Task`, not `Agent`, in allowed-tools.** CONVENTION-CONFORMANCE: 0 hand-authored domainspec siblings declare `Agent` in allowed-tools (re-count at authoring time — the exact denominator drifts across tree scopes; the stable invariant is "0 declare Agent"). It is NOT a harness gate: `Agent` is the runtime name, core skills declare it and load fine, and no validator code rejecting it exists. The choice diverges from 100% of hand-authored siblings (convention) — never assert "Agent fails harness validation".

**`AskUserQuestion`, not `AskQuestions`.** The token used by the user-gating siblings (decision-gate / readiness-gate / start) and by the sibling ontology-view — a defensible split-neutral choice anchored to the gating siblings, not a count win.

**Omitted on purpose:** `tier` / `domain` / `version` — Arcanum-generated-sigil fields; 0 hand-authored domainspec skills carry them.

**Explicitly forbidden:** `surface_kind` / `runtime` / `canonical_source` / `generated_by` / `mutation_policy` — bootstrap-only overlay fields that assert a regeneration contract that does not exist for a hand-authored skill — and the `Agent` token they ship with. Do NOT mirror the ontology-vault frontmatter. The same logic forbids `generated_by`-style frontmatter on the *artifact*: the derive-only link is an edge in `## Connections`, because those fields would assert the regenerate contract the view rejects (it is reconcile-not-regenerate).

**Body family.** domainspec-* (`<objective>/<context>/<process>/<output-contract>`); the rewrite renders these as plain headings. The old `<quality-bar>` was an empirically-present-but-UNSANCTIONED hybrid element (no normative SKILL.md body-convention doc exists on disk); it was kept with no claim of sanction and is now folded into the lifecycle/output rules. Observability is rendered as process prose, never an `<observability>` sigil tag (0 hand-authored domainspec SKILL.md carry that tag).

## D2 — Single-instance validation, honestly stated (2026-06-12)

The skill is **single-instance-validated**: the GoldenQuill / Tilth system-view (`C:\Users\victo\domainspec-core\projects\goldenquill\victor\system-view.md`) is the only on-disk instance of a system-view artifact; the first non-GoldenQuill run is the reusability proof. Be honest about what that one instance does NOT show: it is a two-view pair (system-view + engineer-view) — the ontology-view sibling was authored later — so the three-way single-owner invariant (term in ontology-view, verdict in engineer-view, shape here) is **transfer-asserted across the witnessed pair, not witnessed end-to-end across the full triad**.

Likewise, no end-to-end zig-zag system-view exists yet — the loop-back/converge/exit machinery is exercised in peer domainspec dispatches, transfer-validated only. This is why the skip predicate (`single + N=1 + explorer`) is the DEFAULT for ordinary runs and zig-zag is opt-in.

The reusability-proof checklist behind the SKILL's "When to use / skip" supply rules — the first non-GoldenQuill run must mechanically satisfy all: own target description supplied; every stance resolves to exactly one engineer-view row (or provisional + blocker OQ); zero terms redefined; zero verdicts stated; zero `EXAMPLE-REPLACE-ME` rows; zero GoldenQuill strip-list tokens. The worked reference instance is something to generalize FROM, never to copy locals from.

**GoldenQuill strip-list (the tokens the SKILL's "zero GoldenQuill tokens survive" rule points here for).** Any of these surviving into a non-GoldenQuill artifact is a reusability-proof failure: `CIC`, `CLC`, `TILTH-*`, `council` and the council-seat names (Scout / Scribe / Editor / Judge / Red Team / Logician), `gq_kind`, `matrix-card`, the six client identities, the eight capital logics, the Five Operating Laws, KFR / Match DB.

## D3 — Orthography of `max_loops_reached` (2026-06-12)

The cap-exit value is `max_loops_reached` in the research constitution but `loop_cap_reached` in the base subagents-strategy constitution. This skill reuses research's 7-value `exit_reason` enum VERBATIM, so it follows the research spelling — telemetry stays consistent with the enum it is emitted under and read against (research's). The trade-off, stated honestly: this is NOT base-compatible — a reader keying off the base taxonomy would see `max_loops_reached` as a mismatch. The emitter/reader contract is research's enum, not the base one. Coining a narrower enum was rejected for the same reason.

## D4 — PEER-NOT-NESTED / Drift-5, and the telemetry anchor (2026-06-12)

The skill re-implements the explorer/skeptic/writer/auditor lifecycle LOCALLY and routes composition through `domainspec-subagents-strategy` as a PEER wave-recipe — it does NOT dispatch through `research/SKILL.md`. Routing through research would create the two-orchestrator (**Drift-5**) ungoverned-channel failure: research is a self-contained KT-port keyed to `discoveries/`, not a generic dispatcher. The same Drift-5 logic forbids emitting Arcanum `sigil-invocations.jsonl` (a non-federated separate telemetry stream) and citing a `mars-research-emit-signals` sibling in the `.github`/copilot trees instead of the `domainspec/.claude/` emit-signals copy.

Mechanically, the invocation path is TWO distinct mechanisms: (1) the parent session ENACTS the strategy SKILL (Skill/slash invocation — there is no `domainspec-subagents-strategy` agent on disk to Task-dispatch); (2) the strategist then dispatches the registered writer/explorer/role agents with the **Task** tool (Task targets registered agents, never a skill name).

**Why the signals anchor is algorithmic, not a bare relative path:** several `docs/signals/pipeline-signals.jsonl` files exist across the tree and none at repo root — hence "nearest ancestor of the project-under-analysis with `docs/signals/`, else nearest `.git`, create if absent" in Step 8.

## D5 — Modes-as-modes (open owner's call)

The draft/validate/review/publish gate split is modeled as `--mode` values for compactness. Whether validate/review/publish should instead be three companion SKILL packages remains an open owner's call (same posture as the sibling ontology-view).

## D6 — Framings tables: per shape layer, not per arbitrary major section (2026-06-12)

A review on 2026-06-12 flagged an ambiguity in the original SKILL: Step 4 said each *layer* carries its own "alternative framings we considered" table, while the lane model and the Step-8 gate said "per major section". Resolution: the **per-shape-layer** reading is binding. Every shape-bearing section — the surface and each layer of the layered shape, including the given-vs-optimized layering — carries its own table; non-shape sections (shape diagram, closing map, stance-to-verdict table, OQs, Connections) carry none. Rationale: the framing choice is layer-scoped authoring judgment — a table on a non-shape section would have nothing to frame — and this is the placement the shipped `templates/system-view-template.md` instantiates (tables on the surface, each layer section, and given-vs-optimized; nowhere else).

**Template reconciled 2026-06-12.** The template WAS changed this date to track the SKILL: given-vs-optimized is now control-axis-only (no settled-upstream/given framings; "given" is never "exists today"), settled-upstream choices moved to the closing "what this view does not cover" map with a settling-decision cite, a **Maturity / known-limitations** section was added, the prose-verdict guard ("why set aside" names the defect, not the winner; gloss "why" says why the tension is live) and the regrounded load-bearing-stance definition were inlined, and the full GoldenQuill strip-list was de-inlined to point at D2.

## D7 — Discovery as seed corpus; reconcile-not-regenerate (2026-06-12)

**Why the discovery seeds the view:** in the common bootstrap case the sibling views do not exist yet; the discovery is the one upstream input the triad does not circularly depend on, which is what breaks the system-view ↔ engineer-view bootstrap cycle. Its Business Context and Core Concepts seed the surface and the layered shape; its design decisions surface the candidate stances. Treating a missing fact as a discovery gap (not something to invent in the view) keeps the derive-only provenance honest.

**Why reconcile-not-regenerate:** the view carries judgment the discovery does not — which choices are load-bearing stances is an authoring call, present nowhere upstream — so the artifact is never rebuilt from scratch; evolve mode preserves the authored stances, layered shape, and framings except where the discovery delta forces a change. Drift is version-based: the `## Connections` row records the discovery `version` last reconciled against; a higher current version makes the view STALE, flagged by an audit-alignment-style drift check and fixed only by re-running evolve mode, never hand-patched.

## Connections

- `derives-from → ../SKILL.md` (decision rationale for the 2026-06-12 rewrite)
