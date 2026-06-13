---
name: ontology-view
description: "Author a fourth sibling ontology-view for a project that already has discovery / system-view / engineer-view (or any source corpus), formalizing the domain as typed nodes + typed edges. The differentiator: forbidden relationships become unconstructible — category-errors typed so no catalog edge admits the endpoint pair, and reflexive/self-loop relations caught by named predicate guards — instead of merely asserted in prose. (Body invariants — constitution resolution by version+path, run-time live-edge counting with mismatch surfacing, confidence on belief-bearing nodes only, residue ledger, anti-bias lifecycle, telemetry via domainspec-emit-signals — are detailed below.)"
argument-hint: "<project-or-corpus-path> [--siblings discovery,system-view,engineer-view] [--mode draft|validate|review|publish] [--output <path>] [--composition single|task-fan-out|zig-zag] [--max-iterations <n>] [--constitution <path-to-ontology-conventions.md>] [--dry-run]"
allowed-tools: Read, Write, Glob, Grep, Bash, AskUserQuestion, Task
---

# ontology-view — typed nodes + typed edges beneath the view triad

Frontmatter prohibitions: no `agent:`; `Task`, never `Agent`, in allowed-tools; no `tier`/`domain`/`version`; no `surface_kind`/`runtime`/`canonical_source`/`generated_by`/`mutation_policy`; `AskUserQuestion` is the user-gate token. Rationale: `references/DECISIONS.md`.

## Division of law

- Dispatch when/whether, human gate, universal lifecycle — the router `domainspec-subagents-strategy`; record mechanics — `register-dispatch`; fields — constitution §5.
- Confidence semantics (§6), node taxonomy (§2), edge-catalog legality — `vault/ontology-conventions.md`.
- Frontmatter shape + objective-first (≤3-sentence) gate — by reference from `frontmatter.md` + `discovery-writing.md`. Local delta: `governance_status: project-local-overlay`; the artifact rides `node_type: discovery` for edge legality.

This skill defines only the ontological judgment: node/edge typing, forbidden-edge discipline, lifecycle gates.

## When to use / skip

Use when a project carries the view triad (or any source corpus) AND a decision inventory for verdicts to point at; when prose siblings don't exist, the **discovery** is the canonical seed corpus. Skip when an inventory lookup suffices or no decision inventory exists. A new project supplies its own **kind axis** (the project-declared classification field on every node — e.g. `system-record` vs `business-concept`; not a canonical enum), a **scope decision or explicit declination** (scope: optional project-declared axis, never a typing primitive), and its **own constitution**; zero `EXAMPLE-REPLACE-ME` rows and zero GoldenQuill tokens (`gq_kind`, `TILTH-*`, `CIC`, `CLC`, `council`, `matrix-card`, `16-COINED`, `ontology-type`/`runtime-instance`) survive.

## Inputs

| Artifact | Resolution | Record |
|---|---|---|
| Sibling views / **discovery** | Core Concepts seed nodes; Detailed Specifications seed edges incl. forbidden/reflexive candidates. A missing relationship = discovery gap, not an invented edge | seed citations |
| `ontology-conventions.md` | highest VERSION+PATH within the project-under-analysis's own repo (nearest ancestor `.git`) — never nearest-path, never cross-repo; honor `--constitution` | path + version + commit/dirty-state; flag stale mirrors |
| `edge-catalog.md` | copy beside the resolved constitution, else version+path likewise. Legality matrix ONLY — never the count source | resolved path |
| Project label axes | translate to generic concepts; never promote local labels to canonical vocabulary | translation |
| D-row inventory | from the engineer-view | verdict targets |

## Lifecycle

`--mode` **default: draft** (Steps 1–5+7); `validate` = Step 3; `review` = Step 6; `publish` = Step 8 only.

**1 — Resolve + count.** Resolve scope, corpus, constitution (table). Bash-COUNT the live forward-edge subsections each run, never a hardcoded literal: re-derive subsection names from the resolved version (version-specific, not the predicate); exclude deprecated/previously-named tables; record the predicate concretely for reproducibility. ZERO rows = mis-match: stop, re-derive. SURFACE live/header/prose disagreement, never reconcile. The worked example never counted — not a model.

**2 — Compose.** ENACT `domainspec-subagents-strategy` (a Skill, not a Task target); Task-dispatch only the registered agents it composes. explorer → skeptic → writer → auditor; the writer IS the synthesizer; writer never before skeptic under linear; zig-zag interleaves roles as epistemic functions. Explorer vectors distinct (taxonomy / edge legality / precedent / forbidden+reflexive guards), pairwise tension upfront.

**3 — Validate + gate.** Check goal load-bearing, success_metric typed, role order, tension upfront, kebab-safe slug, cap respected; zig-zag without iteration block FAILS. Accept → `AskUserQuestion` confirm/revise/abandon (abandon persists nothing). Reject-with-fixes → Step 2 once — the single retry; SECOND reject halts: `exit_reason=validator_rejected_twice`. Persist the spec to `<dispatch-folder>/<view_slug>/agents/` before dispatch (`<dispatch-folder>` = the dispatch's `working_folder` declared on the sheet — constitution §5).

**4 — Type nodes.** Per concept: `node_type` (canonical enum) + kind axis + branch (business/system/bridge/mixed) + optional scope + schema + on-disk instances + precedent — schema and precedent VERIFIED on disk. Confidence (`veracidade`/`convicção`) only on belief-bearing roles (axiom/premise/audit). Surface both-endpoint-capable nodes as Step-5 reflexive input.

**5 — Type edges.** Per relationship: from→to, direction, cardinality, rule, forward/inverse, precedent. Catalog edges verbatim — tighten cardinality OK, widen forbidden; flag coined (discipline below). Coined without amendment route → PROPOSED-UNFILED in the project's own governance posture (`project-local-overlay`), promotion HALTED, blocker OQ — never an undefined external amendment path. Edge only in a NEWER constitution version = reuse-pending-version-bump, not coined.

**6 — Round review.** Independent skeptic/auditor pressure-tests taxonomy, edge legality, citations (unverifiable = STRUCK), both guard classes; N≥3 zero-dissent = failure. LIVE = enforcement body reachable AND evaluating the predicate — no stub, unconditional pass, or not-implemented marker — verified on disk, substrate-neutral (Python: 0 `NotImplementedError` in its own `run()`/`evaluate()`; likewise schema-const, SQL/Cedar CHECK, TS types, CI lint); unverifiable LIVE → PLANNED. Loop-back by dissent class (taxonomy→4; edge/guard→5; cross-cutting→both), each one iteration. Converge or cap → typed `exit_reason`.

**7 — Residue + OQs.** Every load-bearing claim → ≥1 ledger row (closed=adjudicated | open=preserved residue) with surviving text + per-agent-file citation; open residue never demoted. OQs carry recommendation + owner; blocker OQs flagged. Non-contiguous numbering OK — never renumber.

**8 — Publish + signals (user-gated).** Publication gating only — never re-runs Step 6. Validate links, roles, confidence gates, bidirectionality, overlay correctness, guard threshold, cross-reference map, output contract. Enforcement-tier table (relationship | by-type? | structural layer | runtime guard | block?): `by-type=N AND no LIVE structural layer AND runtime≠LIVE` ⇒ BLOCKER; LIVE structural but PLANNED runtime ⇒ MAJOR OQ; reflexive rows gated on predicate-guard status — a calibrated default a project may override. Emit a CURATED schema graph (subset) + cross-reference map: every verdict points to the engineer-view; nothing decided twice. MANDATORY epilogue: `domainspec-emit-signals` appends a SIGNAL-SCHEMA envelope to `<project-repo-root>/docs/signals/pipeline-signals.jsonl` (nearest ancestor with `docs/signals/`, else `.git`; create if absent; cite the `domainspec/.claude/` copy). Payload = the return-block fields plus OQs, struck citations, guard class (`endpoint-type`|`reflexive`), validation result.

**Derive-only.** The discovery is the SOLE mutation trigger; never hand-edit. Re-running draft RECONCILES against the discovery delta — reconcile-not-regenerate (the guard discipline is skill-introduced, nowhere upstream). Mechanics: diff the discovery's Core Concepts/decisions against current node/edge tables; edit ONLY rows the delta touches; open residue rows stay untouched; bump the recorded discovery version on the `derives-from` line. The link is an EDGE: `derives-from → discovery.md` in `## Connections` (inverse `derives`) records the discovery version last reconciled; newer version = STALE, fixed only by re-running.

**Sections** (order follows this map, not the steps; Schema graph before Forbidden edges by design): 1→Governance posture (constitution record + counted total + disagreeing header/prose) · 2–3→dispatch-folder artifacts · 4→Node types · 5→Edge types + Forbidden edges & guards · 6→none · 7→Open questions + Residue ledger · 8→Schema graph + Cross-reference map + overlay status.

## Forbidden-edge discipline (the differentiator)

SKILL-INTRODUCED, not constitutional doctrine. A forbidden edge: endpoint types admit NO catalog edge for the (source→target) pair. **By-type unconstructibility FIRST, named fail-closed guard SECOND — EXCEPT the reflexive/self-loop class** (identical, legal endpoints), where by-type cannot apply and the **predicate guard is PRIMARY**. By-type is authoring/review-time — necessary, never sufficient: wherever the relationship has any surface (a field, a stored row), the named guard is more than reinforcement. Anchor the by-type argument in the constitution's own Appendix C prose, re-deriving the exact line from the version-resolved file each run.

Four archetypes (example-derived detection prompts, not doctrine):
1. **Orthogonal-axis coupling** — distinct kinds, no admitting edge (by-type).
2. **Derived/cache node as decision target** — `decides=false` node never a decision edge's target type (by-type).
3. **Tier escalation without a gate** — needs a named runtime guard.
4. **Reflexive/self-loop** — node edging to itself, or a role cycling back; ALWAYS needs a predicate guard.

## Dispatch

| Param | Type | Default |
|---|---|---|
| `goal` | one load-bearing sentence | required |
| `view_slug` | kebab-safe | derived from project |
| `success_metric` | typed = a falsifiable check naming its evidence (e.g. "every forbidden pair carries a by-type argument anchored in Appendix C"), never a goal restatement | required |
| `composition` | single \| task-fan-out \| zig-zag | zig-zag |
| `max_iterations` | int | per research-constitution cap |
| `iteration_block` | per-round roles + reaction rule + convergence predicate | required iff zig-zag |

Skip predicate: `single + N=1 + explorer` skips the multi-agent machinery (the default for ordinary single-author runs; zig-zag opt-in) — but the **skeptic/citation-strike function still runs**, executed by the author itself as a separate verification pass before Step 7: every precedent verified on disk.

`exit_reason` — research's 7-value enum, verbatim: `success | max_loops_reached | validator_rejected_twice | reviewer_rejected_twice | dissent_irreconcilable | user_abort | unrecoverable_error`. Cap-exit spells `max_loops_reached`; the base constitution diverges (`loop_cap_reached`) — we emit against research's enum.

Composition routes through `domainspec-subagents-strategy` as a PEER wave-recipe — never through `research/SKILL.md` (Drift-5; see DECISIONS.md).

## Output contract

Default output: `<project>/ontology-view.md` beside the sibling views; else `.arcanum/ontology-view/<slug>.md`; else a chat report. Deliverable rows look like:

```markdown
<!-- node row columns = Step 4 fields in order: name | node_type | kind | branch | schema | flags/instances (omit empty optionals; confidence only on belief-bearing) | precedent -->
| CacheEntry | node_type: discovery | kind: system-record | branch: system | schema: {key, source_id, ttl} | decides=false; instances: src/cache/*.py | precedent: ontology-conventions.md §2 (verified) |
| derives-from | CacheEntry → SourceRecord | directed, N:1 | "a cache row always names its source" | inverse: derives | catalog @v2.4.0, reused verbatim |
| R-07 | open | "TTL semantics undefined for pinned entries" | agents/explorer-2.md §3 |
```

Return:

```markdown
## Ontology View Result
- Mode · Project · Resolved constitution: <path> @ <version> (<commit/dirty>)
- Live-table edge total: <counted> (header <H>, prose <P> — mismatch surfaced, NOT reconciled)
- Nodes typed · Edges typed · Coined flagged · Version-skew (reuse-pending-version-bump)
- Forbidden-guard status: endpoint-type <LIVE/PLANNED> | reflexive <LIVE/PLANNED>
- Residue rows: <closed>/<open> · Blockers: <n> (<list>)
- Overlay status: project-local-overlay | promotable
- exit_reason: <enum value> · Next action: <action>
```

## Anti-patterns

- Citing `edges-enforcement-refactoring` as the forbidden-edge precedent — it is catalog-drift evidence only.
- Pinning the LIVE rule to a Python `NotImplementedError` signature for a non-Python guard.
- Introducing a separate "summarizer" role — the writer IS the synthesizer.
- Emitting Arcanum `sigil-invocations.jsonl`, citing a `mars-research-emit-signals` sibling, or rendering observability as an `<observability>` sigil tag.
- Promoting a project's local labels into canonical vocabulary.
