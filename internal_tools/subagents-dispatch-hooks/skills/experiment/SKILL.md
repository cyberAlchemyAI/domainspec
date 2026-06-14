---
name: experiment
description: Subagent dispatch that runs a probe against a success/failure criterion fixed BEFORE running, and adjudicates survived-vs-falsified — routed here from domainspec-subagents-strategy as the LIVE type skill for `dispatch_type: experiment`. Defines experiment-type judgment only — pre-registered criterion freeze, the validity gates, and the SURVIVED/FALSIFIED/INVALID verdict matrix. Use research when the question is whether a NEW claim survives by coverage; use review to attack an EXISTING artifact; use experiment when a probe runs against a criterion fixed BEFORE running.
---

# experiment — pre-registered-probe type skill

The LIVE type skill for `dispatch_type: experiment`. **When/whether to dispatch** and all
universal law — triggers, the human gate, lifecycle, `final_approver`, `exit_reason`, the
invariants — live in the **router** (`.claude/skills/domainspec-subagents-strategy/SKILL.md`);
nothing here overrides it. **Record/sheet mechanics** — the two appends, the appender,
validation — live in **register-dispatch**. **Field definitions** live in the **constitution**
(`subagents-strategy-constitution-proposal.md`) §5. This skill defines no field; it says what a
good **experiment** dispatch contains.

**What experiment is:** a dispatch that runs a probe against a success/failure criterion fixed
*before* running, and adjudicates **survived-vs-falsified**. **Narrow recipe:** the probe is
reasoning/investigation over artifacts (read code, hand-build a witness, derive a
counter-example) — NOT code execution (the execution runner is RESERVED, below).

## The grader is the differentiator (peer, not re-skin)

Experiment is a peer of its siblings because its **grader** differs, not because its roles are
renamed:

| Type | Grader |
|---|---|
| research | coverage / claim ≤ proof |
| review | severity × flaw-verification over an existing artifact |
| **experiment** | **falsification against a pre-registered criterion + internal validity + reproducibility** |

The load-bearing property is **pre-registration**: the criterion is frozen *before* the result
exists (research is judged *after*, by coverage). Justify experiment by its **grader**, never its
roles — renamed roles over the same grader is a re-skin, not a type (the vacuity trap).

## Roles — experiment semantics over the existing enums (NO new enum values)

| Conceptual role | `groups[].role` | `agents[].role` | function / guards against |
|---|---|---|---|
| designer | investigate | writer | authors the pre-registered criterion (an artifact) — guards against post-hoc criteria |
| runner | investigate | explorer | runs the probe = reasoning/investigation, NOT code execution — produces the raw result |
| adjudicator | evaluate | auditor | verdict against the criterion — guards against moving the goalposts |
| skeptic | evaluate | skeptic | attacks internal validity — guards against a test that doesn't test the hypothesis |

## Criterion freeze — topology + immutability, never a column

Pre-registration is enforced by **topology + the human-gate freeze + immutability**, never a
schema field:

- The `designer` group has a `sequential` edge into the `runner` group, so the criterion lands
  in `working_folder` as a durable artifact **before the runner runs** — this gives the order.
- The criterion artifact is **read-only to the runner and downstream**: once the runner has
  consumed it, any edit is a *new* criterion (re-enters the P2 gate as a fresh sheet), never an
  in-place mutation. That immutability — not the edge alone — is what makes "pre-registered"
  verifiable against an artifact: the criterion file exists and predates the result.
- The criterion lives as the designer's output artifact in `working_folder` — **never a ledger
  column**. The appender rejects `success_metric` as an unknown key; a criterion column would
  repeat the vacuity error v0.5.2 killed.
- experiment is a LIVE type, so `working_folder` is **REQUIRED** (appender).

## Validity gates — the skeptic's axes (experiment's analog of review's attack lenses)

The skeptic attacks internal validity along three axes:

- **confounds** — the result is explained by something other than the hypothesis.
- **non-discrimination** — the test would pass/fail regardless of the hypothesis (it does not
  test the hypothesis).
- **reproducibility absent** — the verdict is not deterministically re-derivable.

A criterion that survives only because nothing could have falsified it is INVALID, not SURVIVED.

## Verdict matrix

| verdict | meaning |
|---|---|
| **SURVIVED** | adjudicated against the pre-registered criterion — the probe did not falsify the hypothesis |
| **FALSIFIED** | adjudicated against the pre-registered criterion — the probe falsified it |
| **INVALID** | the skeptic knocked down internal validity — the test does not test the hypothesis |

Contrast: research = GO/…/KILL; review = UPHELD/REFUTED/DOWNGRADED. **A clean FALSIFIED is a
successful run** — the criterion did its job; closing `resolved` requires only that the
`final_approver` accepted the adjudication (research/review pattern). An **INVALID** verdict also
closes `resolved` — it is a successful detection that the probe did not test the hypothesis, not
a failed run; a re-designed criterion is a *new* dispatch, not a non-close.

## Canonical shape (v0.5.2 chassis)

```
designer ──sequential──▶ runner ──sequential──▶ adjudicator ◀──zig-zag──▶ skeptic
```

`sequential` edges carry NO `loop_cap` (designer→runner→adjudicator). The skeptic checks
validity in `zig-zag` (or parallel) with the adjudicator; **zig-zag/feedback carry `loop_cap`**.
A `feedback` back-edge is conditional (P6, generic trigger in the siblings) — here, when the
skeptic's validity attack means the criterion may need re-design.

## Reserved boundary (state it; do not block on it)

- The **code-execution runner is RESERVED** — gated on the `code` type landing with an execution
  substrate. An experiment needing to execute code must wait for `code` LIVE; the execution
  runner is a future extension, not part of this recipe.
- **Reproducibility (narrow recipe) = deterministic RE-ADJUDICATION** — another agent, same
  frozen criterion + result, reaches the same verdict — NOT re-execution. Re-execution
  reproducibility arrives with the code-runner.
- The verdict vocabulary does **not** map onto execution-status (`pass/flag/block`) — that
  cross-project unification is deferred (Arcanum F1).

## Inherited rule (cited, not invented)

`final_approver` may never sit in a working group (constitution P12 / §5). The adjudicator is in
a working group (`evaluate`), so it **cannot double as `final_approver`** — use `parent` or a
dedicated `meta-evaluate` approver.

## Outputs (P9 pattern, experiment flavor)

Same two-file contract as the siblings, in `working_folder`: **`experiment.md`** (the probe +
raw result, returns persisted verbatim) and **`findings.md`** (the adjudication — every
load-bearing verdict citing the **criterion + result** it rests on). An experiment with n = 1
produces `findings.md` only. The requirement is the FILES, not who writes them. Append/close
mechanics are **register-dispatch**'s — do not restate them here.

## Names

Draw `agent_name` from `telemetry/agents/agent-pool.yaml` (ordered `role_fit`). Falsification
fits the philosophy-of-science figures: **Popper, Lakatos, Hume, Feyerabend, Kuhn**
(`role_fit: [skeptic, writer]`) for the skeptic/designer; primary-`role_fit` explorers for the
runner; an `auditor` fit (**Vlachopulos, Loregian, Brandenburg**) for the adjudicator. Never
reuse a name within one dispatch; never invent one — and the skeptic that attacks validity is
never the runner or designer whose work it attacks (P12's spirit at agent scale).
