---
tags: [vault, lens-findings, should-close-session-design, meta-lens, adversarial-review]
node_type: findings
is_session: false
layer: ontology
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
lens_order: second
dispatch_status: backfilled-no-prompt-recoverable
synthesized-by: ../../research/research.md
synthesizes:
  - ../01-signal-design/findings.md
  - ../02-form-factor/findings.md
  - ../03-non-nag-discipline/findings.md
  - ../04-adversarial/findings.md
retrofits: ../../discovery.md
---

# Findings — Adversarial Review (Meta-Lens C)

## Objective

Stress-test the four propose-wave lenses: identify the weakest proposal, the most over-engineered, the rules most likely to be ignored, walk a real session as a fixed-point check, and collapse the survivors into a minimum viable version.

## Findings

# Meta-Lens C — Adversarial Review

## Weakest proposal

**Lens 03 (Non-Nag Discipline).** Its central choice — `trust_score ∈ [0,1]` with explicit decay rates, per-signal-combination snoozes, a state-machine lifecycle (`fired → accepted/dismissed/ignored`), a 3-turn classification window, weekly self-reporting caps — fails on first contact because **none of the inputs the trust score needs are reliably observable.**

- "Explicit dismissal" requires distinguishing `"not yet"` from `"not yet, but let me first..."` from silence-followed-by-unrelated-work. Keyword detector will misclassify the majority of solo-dev replies as "ignored"; trust score will free-fall.
- State-machine assumes a multi-turn classification window during which the recommender "emits nothing." Stop-hook fires every turn regardless — enforcement requires writing a state file the hook reads, which solo-dev won't maintain when it breaks.
- Trust-score arithmetic (+0.05, −0.10, −0.02, −0.20) is fake precision. No empirical basis in a single-user system with N≈20 sessions/month; score will random-walk inside dormancy band.

Lens 03 *sounds* most rigorous and is in fact most brittle, because it puts a calibrated control loop on top of unmeasurable inputs. First piece silently deleted.

## Most over-engineered

**Lens 03, then Lens 01's scoring tiers a close second.** Lens 01 catalogs 13 signals, ranks them, defines three numeric inputs with three-valued domains, computes a weighted sum, dispatches to four decision tiers. For a recommender whose entire job is "emit one line, sometimes, in a project owned by one person," this is a 4-state Mealy machine pretending to be a heuristic.

- `phase_boundary ∈ {0, 0.5, 1}` requires "axis shift" detection over tool-mix sliding windows plus "premise vocabulary" scanning of the transcript. A Stop hook does not have cheap access to the transcript JSONL.
- The "Soft / Clear / Hard recommendation" ladder is escalation, which Lens 03 forbids. The two contradict each other.

Neither will survive contact with a solo dev who forgets the state file exists for three weeks.

## Most likely to be ignored

Two rules from Lens 03 will be worked around within a month:

1. **"Per-session cap: 1 prompt. Hard."** The first time the recommender stays silent through a genuinely close-worthy second phase (user worked through dinner, started a new topic without restarting), the user either bumps the cap or deletes the check. The cap is principled and wrong roughly 10% of the time, and the wrong cases are the *visible* ones.

2. **"Conversational quiet moment: never prompt mid-flow."** A Stop hook fires when the assistant finishes a turn. There is no way for the hook to know whether the user is "mid-flow"; the next message hasn't happened. This rule cannot be implemented in the chosen form factor.

Honorable mention: Lens 01's **S11 dry-run against close-session.** Right idea, but reimplementing the sibling's triage inside the hook means it drifts whenever the sibling updates its gate. Within two months the dry-run lies; maintainer deletes the check rather than re-sync.

## Fixed-point: walking through a real session

Saturday afternoon, this repo:

> User: "let's look at why the xG model is underweighting away games." Agent reads 4 src files, runs model, identifies a normalization bug, patches `src/xg/normalize.py` (1 file, 8 lines), runs test, passes. User: "nice. now let's see what the betting model does with the fixed xG." Agent reads 3 more files, runs backtest, EV improves 1.4pp, jots a scratchpad candidate-premise, drafts a discovery doc. User: "ok cool, ship it."

What each lens prescribes:

- **Lens 01:** After the fix turn — silent (correct). After discovery doc — Tier 3 "Clear recommendation," fires.
- **Lens 02:** Stop hook fires *after* the agent's response to "ok cool, ship it" — nudge lands one turn too late, producing an awkward duplicate of what the user already implied.
- **Lens 03:** Multi-signal gate clears; checkpoint utterance passes; per-session cap clear; fires. But Lens 03 wanted the prompt *before* "ship it," and Lens 02's trigger makes that impossible.
- **Lens 04:** Recommender fired correctly here, but reflexive risk is live: the agent, having received the nudge, frames the discovery doc as "the natural close point."

**Fixed-point conflict:** Lens 02's Stop-hook timing fundamentally cannot deliver Lens 03's "prompt at a quiet moment before the user closes." The hook always fires *after* the assistant turn responding to a closing-shaped utterance — nudge is always one turn late. Lens 01's tier ladder makes the recommender louder exactly where Lens 03 forbids louder. **What actually happens:** recommender fires the duplicate "by the way, close?" after the user already said "ship it"; user mildly resents it; ignores once; a week later either disables the hook or leaves it firing and learns to ignore. Within a month it's Lens 04's predicted dead-tool-in-the-namespace.

The only lens that survives the fixed-point intact is **Lens 04**: every other lens's prescription fires too late, fires reflexively, or depends on state the trigger can't read.

## Minimum viable version (≤5 rules)

Strip everything that doesn't survive solo-dev contact:

1. **Form: Stop hook in `football-stats-oracle/.claude/settings.json`, ~30 lines of shell.** No SKILL.md response contract, no state JSON, no trust score. (Lens 02 form factor, minus sentinel-cleanup coupling.)

2. **Single hard gate — `git status --porcelain` non-empty within vault-relevant paths** (`src/`, `domain_knowledge/`, `experiments/`, `.claude/current_conversations/`). One cheap `git` call. No transcript parsing, no vocabulary scanning, no tool-mix sliding window.

3. **One fire per session, ever.** Sentinel file in `.claude/current_conversations/` (dies with scratchpads, zero coupling to `close-session`). No daily cap, no weekly cap, no trust score, no escalation, no second prompt. `[ -f sentinel ] && exit 0`.

4. **Output is mechanical observables only — no verdict.** Following Lens 04's anti-reflexivity rule. `additionalContext` reads: `should-close-session: git shows N files changed (<paths>); scratchpad exists. close-session would write a note.` No "consider closing," no "looks done." The agent decides whether to surface; the user decides whether to act.

5. **Ship in observe-only mode for 20 sessions.** Lens 04's bootstrap. Write `would-have-fired` lines to `vault/discovery/should-close-session-design/observations.jsonl`. After 20 sessions, user checks correlation manually. If bad, delete the hook. **Kill-switch is a single env var, not a metric formula.**

What is dropped, and why:
- **Tiered output (Lens 01):** solo dev does not need soft/clear; one line is one line.
- **Trust score, snoozes, decay (Lens 03):** unmeasurable; will random-walk.
- **Premise-vocabulary / axis-shift detection (Lens 01):** requires transcript parsing; too expensive per turn; reimplements sibling's gate.
- **PreCompact secondary trigger (Lens 02):** compaction is rare on this project; one trigger is enough.
- **Sentinel cleanup coupling with `close-session` (Lens 02):** park sentinel in `.claude/current_conversations/` so it dies when scratchpads die.
- **Escape-hatch "informational line for very long sessions" (Lens 03):** second utterance is the camel's nose; refuse it.
- **`useful_fire_rate` dashboards (Lens 04):** right idea, wrong scale. Observe-only log + eyeball review *is* the metric.

The kernel is roughly Lens 04's steelman-against-building-it with one concession: a 30-line hook plus a 20-session observation period, no skill registered. **If after 20 sessions the user reviews the observations and concludes the hook caught nothing they wouldn't have caught themselves, delete the hook and do not build the skill.** Honest design target at solo-dev scale.

## Connections

- `derives-from` → `../01-signal-design/findings.md`
- `derives-from` → `../02-form-factor/findings.md`
- `derives-from` → `../03-non-nag-discipline/findings.md`
- `derives-from` → `../04-adversarial/findings.md`
- `cited-by` → `../../research/research.md`
- `cited-by` → `../../discovery.md`
