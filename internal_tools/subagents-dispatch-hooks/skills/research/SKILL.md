---
name: research
description: >
  Subagent dispatch for synthesis, adversarial check, multi-perspective audit, or
  precedent sweep — routed here from domainspec-subagents-strategy as the LIVE type
  skill for `dispatch_type: research`. Defines research-type judgment only: the five
  roles, the skeptic gates, the canonical pipeline, tension design, and the findings
  verdict matrix. Trivial single lookups stay inline and never reach this skill.
---

# research — the research-type dispatch

A **research dispatch** answers a question by fanning it across agents — to combine many
sources, attack a new claim, or sweep for prior art — when one sequential reader would
trade depth for breadth or flood the parent with raw output. You arrive here after the
router `domainspec-subagents-strategy` has checked the trigger, held the human gate, and
routed by `dispatch_type: research`. This skill owns **research-type judgment only**:
the roles, the gates, the pipeline, the tension axes, the verdict matrix. Every universal
rule (lifecycle, human gate, final-approver invariant) defers to the router; every ledger
field defers to `register-dispatch`. It produces two files in the dispatch's
`working_folder`: `research.md` (verbatim **explorer** returns, appended by the strategist)
and `findings.md` (cited synthesis, written by the writer).

## Pipeline

The spine is **sequential** and fixed:

```
explorers ──▶ synthesizer ──▶ reviewers ──▶ writer ──▶ auditor
```

Each stage hands forward; four edges are **conditional**, declared per dispatch:

| edge | type | when | effect |
|---|---|---|---|
| explorers, reviewers | `robot_talks` | the group must confront *each other*, not just report in parallel | intra-group discussion — owned by `robot-talks` |
| synthesizer ⇄ reviewers | `zig-zag` | the synthesis must survive attack before it is written | synthesizer drafts → reviewers attack → synthesizer revises, up to the loop cap |
| synthesizer → explorers | `feedback` | the synthesizer finds material missing | re-opens the explorers for more; never declared by default |
| auditor → writer | `revision` | always — **default one** | auditor returns `findings.md` to the writer for rework; may request more than one |

`robot_talks`, `zig-zag`, and the synthesizer→explorers `feedback` edge are optional. The
auditor→writer revision is structural: plan for one revision, allow more.

## Roles

Each role guards one failure mode and occupies one pipeline stage; no agent does two jobs.

| `role` | stage | does | guards against | receives |
|---|---|---|---|---|
| `explorer` | 1 (n 2–4) | generates under **one tensioned angle** | monoculture | its angle prompt |
| `synthesizer` | 2 (n 1) | reconciles explorer returns into a candidate picture; exchanges with reviewers; may pull more from explorers | "many returns, no coherent claim" | the collected explorer returns |
| `skeptic` | 3 (reviewers) | attacks **one named gate** | folklore / vacuity | one gate + the synthesized picture |
| `writer` | 4 (n 1) | persists **`findings.md` only** | "great research, no record" | the writing skill `domainspec-findings-writing` (→ `findings.md`) |
| `auditor` | 5 (n 1) | evaluates **`findings.md` only**; approves or sends back for revision | "passed because nothing was checked" | `findings.md` + the dispatch `goal` |

`research.md` is **not** a writer task. It is the verbatim transcript of the **explorer**
returns, appended **mechanically by the strategist** (the parent that owns the dispatch)
per `domainspec-research-writing` — the same hand that appends the ledger rows. The writer
authors only the synthesis (`findings.md`). See **Outputs**.

`model` is guidance, not law — chosen per agent by task difficulty, validated by the human
at the confirm gate (the field is owned by `register-dispatch`). There is no `evaluator`
role: criteria-scoring is a `skeptic` with a stated gate.

The auditor is the dedicated `final_approver`: a single `auditor` agent, no other work,
never in a working group, falling back to `parent` if its group never runs (the universal
final-approver invariant — authority: `domainspec-subagents-strategy`).

## Skeptic gates

A skeptic attacks exactly one gate:

- **precedent** — is this already owned? Find the actual owner. A found owner is a *positive*
  result, not a kill: it labels the candidate `build-from-owned` (owner exists, repo does
  not yet deploy it — cite and build) or `already-deployed`; an empty search certifies
  `precedent-clean` → `novel-attempt`. **Precedent never emits a KILL.**
- **non-vacuity** — build the smallest concrete witness by hand, or force a closed negative.
  No witness → KILL.
- **definitional-soundness** — does it collapse to something already named, re-skinned?
  Tautological → KILL.

Terminal KILLs come only from **non-vacuity** and **definitional-soundness**. A reviewer
group is tensioned by construction when its gates differ.

## Tension design

Every n ≥ 2 group must be pairwise tensioned. Classify each angle on the four axes:

- **methodology** — empirical / formal / adversarial / historical / computational
- **source-corpus** — the body of evidence read
- **attack-vector** — the skeptic gate
- **temporal-prior** — modern-only / historical-lineage / mixed

Design so that, for every explorer pair, "a_i runs [X], a_j runs [Y] on the [axis] axis; a
bias in a_i would be exposed by a_j" holds, with ≥ 2 distinct axes across the group. The
PASS/REJECT enforcement over these axes runs before the human confirm and is owned by
`check-tension` — design the angles to pass it; do not restate its tests here.

## How to run

Spawn all agents of a group in **one message** so they run in parallel. A group is READY
when every group with a `sequential`/`zig-zag` edge into it has produced what it must
respond to; `feedback` and `revision` edges never gate readiness. Launch all READY groups
concurrently. If an agent errors, degrade to a partial group result and inform every
downstream group and the auditor.

**Early stop.** If no candidate survives its collapse-test (every candidate killed by
non-vacuity or definitional-soundness), the writer records the typed negative in
`findings.md` and the auditor approves it: a confirmed-kill close is a *successful*
`resolved`, not an error. Being OWNED is not a kill and does not early-stop.

## Outputs

Both files land in `working_folder` (a repo-relative docs path, never under `vault/`; the
field is owned by `register-dispatch`):

- **`research.md`** — verbatim **explorer** returns, appended by the **strategist** per
  `domainspec-research-writing` (one `## Agent N` section per explorer, no editing). It is
  not authored by the writer; synthesizer and reviewer output is not transcribed into it.
  Omitted when there are no explorers (n = 1).
- **`findings.md`** — cited synthesis, written by the **writer** per
  `domainspec-findings-writing`: every load-bearing claim cites the explorer return it
  rests on. Always produced. For n = 1, `findings.md` is the only output.

`findings.md` carries the **verdict matrix** — one row per candidate. The `owner` column is
always filled (a citation, or `precedent-clean`); being owned never puts KILL in `verdict`:

| candidate | owner (precedent) | witnessed? (non-vacuity) | sound? (definitional) | verdict |
|---|---|---|---|---|

A **KILL** (only no-witness or tautological) is banked as a typed negative: what it would
have contributed + the exact fact that zeroed it. The auditor accepts `findings.md` only
when the verdict matrix and the citation discipline hold; acceptance closes the dispatch
`resolved` with a one-line answer to the `goal`.

## Names

Draw each `agent_name` from the project's agent-name pool, matching primary role-fit and a
field fit to the corpus. **Never reuse a name within one dispatch** — distinct skeptics, and
a skeptic distinct from the auditor that judges its work, is the load-bearing case. Never
invent a name outside the pool; where no pool exists, name freely under the same no-reuse
rule.

## Closing and recording

Report `exit_reason` and `agents_spawned`, then append the close row. The two-append
discipline, the row schema, and the appender are owned by `register-dispatch`.
