---
name: review
description: Red-team dispatch over EXISTING artifacts (skills, constitutions, code, docs) — attack what exists and hunt flaws to improve it. Routed here from domainspec-subagents-strategy as the LIVE type skill for `dispatch_type: review`. Defines review-type judgment only — attack lenses, severity taxonomy, verification discipline, and the change-request findings shape. Use research (not review) when the question is whether a NEW claim/candidate survives; use review when the target already exists and the deliverable is verified change requests.
---

# review — red-team type skill

The LIVE type skill for `dispatch_type: review`, populated 2026-06-12 by owner decision
(recorded in the constitution's §5 dispatch_type note). Universal law — triggers, the human
gate, lifecycle, exit_reason, invariants — lives in the **router**
(`.claude/skills/domainspec-subagents-strategy/SKILL.md`). The record/sheet form lives in
**register-dispatch**. Field definitions live in the **constitution** §5
(`subagents-strategy-constitution-proposal.md`, repo root). This skill says only what a good
**review** dispatch contains.

**What review is:** a red team. The targets exist; the dispatch attacks them to surface
flaws worth fixing. The deliverable is **verified change requests**, not verdicts on new
candidates (that is `research`) and not the fixes themselves (applying change requests is a
follow-up act outside the dispatch — or a `max_loops` re-run after fixes, the owner's call).
A review **closes `resolved`** once the `final_approver` accepts the change-request list —
FIX verdicts are deliverables, not non-resolution (single close definition in the Outputs
section).

## Roles — red-team semantics over the four-role vocabulary

Review reuses the constitution's four agent roles (§5 Level 4) with red-team semantics:

| role | red-team function | guards against | model guidance |
|---|---|---|---|
| `explorer` | **attacker** — attacks the full target corpus from ONE declared attack lens | blind spots — one lens sees what another cannot | heavier for subtle lenses |
| `skeptic` | **verifier** — refutes findings against the literal artifact; runs the actual check | false positives — plausible-but-wrong findings surviving | heavy |
| `writer` | **synthesizer** — dedupes, severity-ranks, writes the cited change requests; conventionally a single writer (the §6 skeleton's `n: 1`) | "great attack, no record" | heavy |
| `auditor` | **coverage auditor** (meta-evaluate, placed by its incoming edge, downstream of the verifiers) — did every target get attacked from every declared lens; were refuted findings dropped | "passed because nothing was attacked" | light |

Group-role mapping is the constitution's: attacker↔`investigate`, verifier↔`evaluate`,
synthesizer↔`synthesize`, coverage auditor↔`meta-evaluate`.

## Attack lenses — the tension axes for review (P5 applied)

Each attacker takes ONE lens; a group of n ≥ 2 attackers must spread ≥ 2 distinct lenses,
pairwise tensioned (the router's P5 check at the confirm gate). Established lenses:

- **fidelity / governance** — does the artifact contradict or silently extend its governing law?
- **mechanics / correctness** — does it actually run? doc-vs-code mismatches, broken validation.
- **ownership / reference integrity** — dangling pointers, double-owned concepts, claims about another doc the target does not satisfy.
- **operability** — can a fresh operator execute it end-to-end without inventing steps?
- **abuse / gaming** — can the rules be satisfied in letter while defeated in spirit?

Attackers attack the **whole corpus** each (full reading), differing by lens — not by
partitioning the targets. `robot_talks: true` on the attacker group is recommended: after
the parallel attacks, each attacker confronts the others' findings along the lens tension
before the group returns.

## Severity and verdicts (house taxonomy)

- **CRITICAL** — breaks the system, corrupts a record, or flatly contradicts governing law.
- **MAJOR** — functional gap, drift risk, doc-vs-code mismatch, load-bearing omission.
- **MINOR** — wording, stale data, fuzzy pointer.

Per-artifact verdict: **KEEP** or **FIX** (FIX iff ≥ 1 CRITICAL or MAJOR survives
verification). A FIX verdict is a deliverable, not a non-resolution — the dispatch still
closes `resolved` when the `final_approver` accepts the change-request list (see the close
definition in Outputs).

**Finding discipline:** every finding carries the file, quoted evidence, severity, and a
one-line proposed fix. A finding the verifier refutes is **dropped**, not softened (P10 —
claim ≤ proof; demote, never inflate). Every attacker return ends with a `Dissent:` line.

**Zero-findings red flag:** an attacker returning zero findings must state what it attacked
and why the artifact survived each attempt. ALL attackers returning zero findings is a red
flag — treat it as a failure to attack, not as cleanliness. **Who fires it:** the
**coverage auditor** fires this flag; the `final_approver` only *checks the auditor fired
it* (P12 — a dedicated approver does no other work). Residue: the coverage auditor is
OPTIONAL (canonical-shape section). When **no coverage-auditor group is declared and
`final_approver` is `parent`, `parent` fires the flag** — `parent` is the strategist
session, not a dedicated-approver agent bound by "no other work".

## Canonical shape on the v0.5.2 chassis

```
attackers ──sequential──▶ synthesizer ◀──zig-zag──▶ verifiers
    ▲                         │
    └┄┄┄┄┄┄┄┄feedback┄┄┄┄┄┄┄┄┄┘   (conditional — P6)
```

Attackers (`investigate`, n 2–4, `robot_talks` recommended) → synthesizer (1 `writer`) ↔
verifiers (`skeptic`s) in zig-zag; the feedback back-edge only when there is a
reviewer/auditor group AND material may be missing (P6). Zig-zag convergence is the
constitution's rule: a verifier turn raising no objection terminates the exchange.
An optional `meta-evaluate` coverage auditor is placed by its incoming edge, downstream of the verifiers (and is the natural dedicated
`final_approver` per P12).

The attacker group runs `robot_talks`, so the synthesizer downstream of it MUST receive
each attacker's initial AND final positions (constitution P14, collapse detection).

## How to run

Spawn each group's agents with the Agent tool — ALL agents of a group in ONE message (they
run in parallel); each agent's `initial_prompt` is its launch prompt. Groups are scheduled
**by dependency** (constitution P4, amended 2026-06-12): a group is READY when every group
with a `sequential`/`zig-zag` edge into it has produced what it must respond to (zig-zag
counts only in its `from`→`to` direction — the `from` endpoint opens the exchange); launch
all READY groups concurrently; `feedback` edges never count as dependencies; a sheet with
no connections declares its groups independent; declared order is narration tiebreak only.
Attackers run **read-only over the targets**: they never modify the artifacts under
attack — findings are the only output.

## Outputs (P9 pattern, review flavor)

Everything lands in `working_folder` — a docs path (§5 `working_folder`). For a review
fan-out (n ≥ 2): **`attacks.md`** (the collected attacker + verifier returns, verbatim) and
**`findings.md`** (the cited change requests — every surviving finding cites the attack
return it came from and quotes the artifact). A review n = 1 produces `findings.md` only.
The requirement is the FILES, not who writes them — the strategist may write them itself or
delegate.

`findings.md` shape: per-artifact section → table of surviving findings
(| # | file | evidence | severity | proposed fix |) → per-artifact verdict (KEEP/FIX) →
a closing change-request list ordered by severity. **Close (canonical definition for this
skill):** per §5, `resolved` = the `final_approver` accepted; for review, acceptance
includes checking that every surviving finding is cited and every refuted finding was
dropped. A review closes `resolved` once the `final_approver` accepts the change-request
list — **FIX verdicts are deliverables, not non-resolution**: a review that ships FIX
verdicts and is accepted is resolved.

## Names

Draw `agent_name` from `telemetry/agents/agent-pool.yaml` (ordered `role_fit`). Prefer the
primary `role_fit` and a `field` fit to the target corpus. Never reuse a name within one
dispatch — and an attacker's verifier is never the attacker itself (P12's spirit at the
agent scale).
