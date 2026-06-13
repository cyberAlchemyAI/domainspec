---
name: engineer-view
description: "Author the lower half of a system-view / engineer-view pair: the mechanics-and-verdicts view that OWNS every verdict. The differentiator is the decision inventory — every load-bearing stance named in the companion system-view resolves to exactly ONE owning row with a verdict, a status (RESOLVED / OPEN / CRITICAL), and a CITED authority verified on disk; plus the schemas/contracts and runtime mechanics. It re-narrates NO shape (points up to system-view) and redefines NO term (points to ontology-view)."
argument-hint: "<project-or-corpus-path> [--system-view <path>] [--ontology-view <path>] [--discovery <path>] [--mode draft|validate|review|publish] [--output <path>] [--composition single|task-fan-out|zig-zag] [--max-iterations <n>] [--dry-run]"
allowed-tools: Read, Write, Glob, Grep, Bash, AskUserQuestion, Task
---

# engineer-view — verdicts, schemas, and mechanics beneath the system-view

Frontmatter prohibitions: no `agent:`; `Task`, never `Agent`, in allowed-tools; no `tier`/`domain`/`version`; no `surface_kind`/`runtime`/`canonical_source`/`generated_by`/`mutation_policy`; `AskUserQuestion` is the user-gate token. Rationale: `references/DECISIONS.md`.

## Division of law

- Dispatch when/whether, human gate, universal lifecycle — the router `domainspec-subagents-strategy`; record mechanics — `register-dispatch`; fields — constitution §5.
- SHAPE (stakeholder story, given-vs-optimized layering) — system-view: point up, never re-narrate. TERM MEANING — ontology-view: cite, never redefine. This skill owns only the VERDICTS (decision inventory), the schemas/contracts, and the runtime mechanics.
- Frontmatter shape + objective-first (≤3-sentence) gate — by reference from `frontmatter.md` + `discovery-writing.md`. Local delta: `governance_status: project-local-overlay` (out of promotion until the owning amendment is filed); the artifact rides `node_type: discovery`.
- Confidence on belief-bearing nodes — `ontology-conventions.md`'s `veracidade`/`convicção` Applicability convention (named headings, not `§N` — cite the resolved heading at run time).

## When to use / skip

Use when a project has a **system-view** sibling (or a corpus rich enough to mine load-bearing stances) AND needs the single home where every named stance is decided. When no system-view exists, the **discovery** is the canonical seed corpus: its design decisions (Core Concepts + Detailed Specifications) seed RESOLVED rows; its Open Questions (each carrying a recommendation) seed OPEN/CRITICAL rows — an OQ with no enforcing gate becomes an OPEN/CRITICAL row citing "no running gate in repo", never RESOLVED. Skip when nothing names stances to resolve, or an inventory lookup suffices.

A new project supplies its own system-view (or explicit stance list), authority sources, and ontology-view (or term source). **Single-instance-validated**: the GoldenQuill/Tilth engineer-view is the only on-disk instance and shows neither the overlay field nor the signal envelope — both transfer-asserted, not witnessed (DECISIONS.md D2). The first non-GoldenQuill run is the reusability proof: zero `EXAMPLE-REPLACE-ME` rows and zero GoldenQuill tokens (`CIC`, `CLC`, `TILTH-*`, `council`/council-seat, `gq_kind`, the worked example's D1–D10 row literals — `F-CIC-CLC-COUPLING-VIOLATION`, `Scout`/`Scribe`/`Logician`, the `eligibility_filter.py` cite) survive.

## Inputs

| Artifact | Role | Record |
|---|---|---|
| **system-view** | stance source: every stance it *names but does not decide* ("named here; verdict lives in engineer-view") is a required inventory row | `stance:<slug>` list |
| **ontology-view** | term-meaning floor this view cites | citations |
| **discovery** (if present) | seed corpus when no system-view exists (see above) | seed citations |
| Authority sources | ADRs, architecture-version files, `CLAUDE.md`/`README.md`, blueprint/spec files, running gates (a failure-code, a validator body, a CI check) | authority-source map |
| Prior decision inventory | existing verdicts are reconciled, never re-minted | reconciliation |

## Lifecycle

`--mode` **default: draft** (Steps 1–5+7); `validate` = Step 3 only; `review` = Step 6 only; `publish` = Step 8 only. The parent session enacts the strategist; registered agents do the role work; the user gates Step 3 (confirm) and Step 8 (publish).

**1 — Resolve + harvest.** Locate the project, its system-view + ontology-view (or corpus), and its authority sources. HARVEST every stance system-view names-but-does-not-decide; record each as `stance:<slug>` so Step 6 can check coverage mechanically. Decide nothing yet — this step yields the stance list and the authority-source map.

**2 — Compose.** ENACT `domainspec-subagents-strategy` (a Skill the parent enacts, not a Task target); Task-dispatch ONLY the registered agents it composes. Roles: explorer → skeptic → writer → auditor; the writer IS the synthesizer (no "summarizer"); writer never before skeptic under linear; zig-zag interleaves roles as epistemic functions. Explorer vectors distinct (stance-harvest completeness / verdict-and-authority adjudication / schema-and-contract extraction / runtime-mechanics tracing), pairwise tension declared upfront. Composition is a PEER wave-recipe — never routed through `research/SKILL.md` (Drift-5; DECISIONS.md D4).

**3 — Validate + gate.** Check goal load-bearing, success_metric typed, role order, tension upfront, kebab-safe `view_slug`, cap respected; a zig-zag layer with NO iteration block FAILS. Accept → `AskUserQuestion` confirm/revise/abandon (abandon persists nothing) → dispatch. Reject-with-fixes → Step 2 once — the single retry; SECOND reject halts with `exit_reason=validator_rejected_twice`. Persist the composed spec to `<dispatch-folder>/<view_slug>/agents/` before dispatch (`<dispatch-folder>` = the dispatch's `working_folder` per constitution §5). The skip predicate applies here (see Dispatch).

**4 — Build the decision inventory.** One row per harvested stance, per the invariants below. Collect per-agent outputs into the dispatch `agents/` folder; SURFACE unverifiable authorities as Step-6 strike candidates.

**5 — Schemas/contracts + runtime mechanics.** Declare each load-bearing SCHEMA/CONTRACT (record fields, enums, verdict-bearing states, failure-code families) with a source-file cite; trace the RUNTIME MECHANICS — how the pieces join, which gate enforces which verdict, where enforcement is absent. Every contract and mechanic points back to the decision row it realizes (and that row points up to its stance). A sentence describing *shape* belongs in system-view; one *defining a term* belongs in ontology-view — point, don't restate.

**6 — Round review.** An independent skeptic/auditor pressure-tests: (a) STANCE COVERAGE — bijective, exactly one row each; (b) AUTHORITY VERIFICATION (Bash/Read) — every cited authority reachable on disk AND actually supporting the verdict; unverifiable → strike rule below; (c) STATUS HONESTY — CRITICAL on exactly the thesis-blocking rows; a "RESOLVED" row with no running gate examined for over-claim. N≥3 with zero dissent = failure. Loop-back BY DISSENT CLASS (inventory/verdict → Step 4; schema/mechanics → Step 5; cross-cutting → both), each loop-back one iteration against the cap. Converge or cap → typed `exit_reason`. Round-level correctness only — NOT publication gating.

**7 — Residue + OQs.** Every load-bearing verdict → ≥1 ledger row (closed=adjudicated | open=preserved residue) with surviving text + per-agent-file citation; open residue never demoted. The OPEN/CRITICAL rows ARE the questions a stakeholder must weigh — surface them as OQs with recommendation + owner. Blocker OQs (orphaned stance, duplicate verdict, RESOLVED on a struck authority, CRITICAL with an unowned blocker) are flagged, never waved through. Non-contiguous numbering OK — never renumber.

**8 — Publish + signals (user-gated).** Publication gating ONLY — never re-runs Step 6. Validate: link integrity, inventory shape (verdict + status + authority on every row), stance-coverage map, `governance_status` overlay correctness, cross-reference map, output contract. Emit the cross-reference map: every verdict owned here, shape pointed up, terms pointed down — nothing decided twice. MANDATORY epilogue: `domainspec-emit-signals` appends a SIGNAL-SCHEMA envelope to `<project-repo-root>/docs/signals/pipeline-signals.jsonl` (nearest ancestor with `docs/signals/`, else `.git`; create if absent — never a bare relative path). Payload: status counts, rows missing authority, stances resolved vs orphaned, duplicate verdicts, struck authorities + downgraded rows, residue rows, OQs, blockers, `exit_reason`, validation result. Never Arcanum `sigil-invocations.jsonl`; never an `<observability>` sigil tag.

**Derive-only.** The discovery is the SOLE mutation trigger; the artifact is never hand-edited. Re-running `--mode draft` over the existing file RECONCILES against the discovery delta — reconcile-not-regenerate: the verdicts, statuses, and authority citations exist nowhere upstream and are preserved except where the delta forces a change (DECISIONS.md D6). The link is an EDGE: `derives-from → discovery.md` in `## Connections` (inverse `derives`) records the discovery version last reconciled; a newer discovery version = STALE, fixed only by re-running.

**Sections** (order follows this map, not the steps): 1→What this view owns + harvested stance list · 2–3→dispatch-folder artifacts · 4→Decision inventory · 5→Schemas and contracts + Runtime mechanics · 6→none · 7→Open questions + Residue ledger · 8→Cross-reference map + overlay status.

## Decision inventory (the differentiator)

Columns: **# | Decision-or-stance | Verdict | Status | Authority**.

Status legend (verbatim discipline):
- **RESOLVED** — decided AND enforced (a gate/authority enforces the verdict on disk).
- **OPEN** — named, not decided (includes *designed-but-not-built* rows).
- **CRITICAL** — OPEN *and* blocks the core thesis: the subset a stakeholder must resolve before the project's central value claim holds.

Invariants:
- **engineer-view OWNS every verdict.** Each verdict lives in exactly one row, keyed `decision:#<id>`, back-referencing `system-view#stance:<slug>`; no verdict is stated anywhere else — the other views point here.
- **Bijective coverage:** every stance system-view names-but-does-not-decide → exactly ONE row (zero = orphaned-stance blocker; two = duplicate-verdict violation).
- **Authority required on EVERY row**, verified on disk. RESOLVED rows cite the file/ADR/architecture-version/running gate that decides AND enforces them; OPEN/CRITICAL rows cite their evidence and may carry an explicit "no running gate in repo". A verdict with no citable authority is OPEN-by-default, never RESOLVED; a row with no authority cell is invalid.
- **CRITICAL marking:** identify the central value claim and flag every OPEN row whose unresolved state would invalidate it. Under-marking AND over-marking are both review failures.
- **Authority-strike rule:** a RESOLVED row whose cited authority cannot be verified on disk is DOWNGRADED — authority struck, row drops to OPEN with a struck-authority note (the analogue of ontology-view's LIVE→PLANNED downgrade).

## Dispatch

| Param | Type | Default |
|---|---|---|
| `goal` | one load-bearing sentence | required |
| `view_slug` | kebab-safe | derived from project |
| `success_metric` | typed — a falsifiable check naming its evidence, never a goal restatement | required |
| `composition` | single \| task-fan-out \| zig-zag | zig-zag |
| `max_iterations` | int | per research-constitution cap |
| `iteration_block` | per-round roles + reaction rule + convergence predicate tied to Step 6's exit | required iff zig-zag |

Skip predicate: `single + N=1 + explorer` skips the multi-agent machinery — the DEFAULT for ordinary single-author runs (zig-zag opt-in; no end-to-end zig-zag engineer-view exists yet — DECISIONS.md D5). Skip drops the dispatch, NOT the skeptic FUNCTION: the author itself runs the skeptic/authority-strike pass as a separate verification step before Step 7 — every authority verified on disk, unverifiable ones struck and their rows downgraded.

`exit_reason` — research's 7-value enum, verbatim: `success | max_loops_reached | validator_rejected_twice | reviewer_rejected_twice | dissent_irreconcilable | user_abort | unrecoverable_error`. Cap-exit spells `max_loops_reached`; the base constitution diverges (`loop_cap_reached`) — we emit against research's enum (DECISIONS.md D3).

## Output contract

Default output: `<project>/engineer-view.md` beside the sibling views; else `.arcanum/engineer-view/<slug>.md`; else a chat report. Per-agent files live under `<dispatch-folder>/<view_slug>/agents/`. Deliverable rows look like:

```markdown
<!-- decision row columns = # | decision-or-stance (back-ref system-view#stance:<slug>) | verdict | status | authority -->
| D3 | Cache-invalidation policy — system-view#stance:cache-invalidation | TTL-only; no manual purge endpoint | RESOLVED | src/cache/policy.py::enforce_ttl (verified on disk) |
| D7 | Tenant-isolation boundary — system-view#stance:tenant-isolation | row-level scoping required before launch | CRITICAL | no running gate in repo — blocks core thesis; see OQ-2 |
| R-04 | open | "purge semantics for pinned entries undecided" | agents/skeptic-1.md §2 |
```

Return:

```markdown
## Engineer View Result
- Mode: draft | validate | review | publish · Project: <path>
- System-view resolved: <path> (stances harvested: <count>)
- Decision rows: <total> — RESOLVED <r> / OPEN <o> / CRITICAL <c>
- Stance coverage: <resolved>/<named> (orphaned: <n>, duplicate verdicts: <n>)
- Rows missing authority: <n> · Struck authorities: <n> (rows downgraded: <n>)
- Schemas / contracts authored: <n> · Residue rows: <closed>/<open>
- Blockers: <n> (<list>) · Overlay status: project-local-overlay | promotable
- exit_reason: <enum value> · Next action: <action>
```

## Anti-patterns

- Re-narrating shape here instead of pointing up to system-view; redefining a term instead of pointing to ontology-view; restating a verdict in either sibling.
- Treating a discovery recommendation as a verdict — recommendations seed OPEN/CRITICAL rows, never RESOLVED.
- Introducing a separate "summarizer" role — the writer IS the synthesizer.
- Copying the worked example's D1–D10 row literals into a new project's artifact.
- Running the heavy zig-zag path where the skip predicate applies — or dropping the skeptic/authority-strike function on the skip path.
