---
tags: [vault, lens-findings, should-close-session-design, adversarial]
node_type: findings
is_session: false
layer: ontology
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
lens_order: first
dispatch_status: backfilled-no-prompt-recoverable
synthesized-by: ../../research/research.md
synthesizes: []
retrofits: ../../discovery.md
---

# Findings — Adversarial Analysis

## Objective

Steelman the case for not building the recommender; enumerate failure modes (reflexivity, false-signpost cascade, topic-drift, context-pressure, bootstrap, "user is the LLM," unmeasurable metric); declare a kill-switch up front.

## Findings

# Lens 04 — Adversarial Analysis

## Claim

The load-bearing failure mode is **reflexivity**: `should-close-session` is read by the same agent that just produced the work it is judging, and whatever the recommender says, the agent will retroactively rationalize. A "close now" signal manufactures close-worthy framing; a "keep going" signal manufactures continuation. The skill therefore does not *measure* closeability — it *creates* it, and then the resulting session note in `domain_knowledge/sessions/` falsely records the recommender's bias as a fact of the work. Stack this on a solo-dev project with ~0 prior sessions for calibration and a `close-session` redesign that already refuses to write a note when the triage gate fails, and the steelman for "don't build this at all" is strong. The redesigned `close-session` is *already* the closeability check — its Step 0 triage gate (`Q&A-only session. No session note created.` / `CLOSE_DEFERRED:`) is exactly the judgment a separate recommender would render. Adding a recommender duplicates that judgment, but earlier and with less information.

## Steelman: don't build this

Conditions under which `should-close-session` is a mistake:

1. **`close-session` already has a deferral path.** Step 0.5 emits `CLOSE_DEFERRED: <reason>` when a session can't be cleanly summarized; Step 0.4 emits `Q&A-only session. No session note created.` Both are *post-hoc closeability tests*. A *pre-hoc* recommender duplicates the logic with strictly less information (it hasn't done the triage yet) and risks contradicting the authoritative gate.
2. **Single-user, single-agent loop.** The user closes when they're done. The agent already proposes closing implicitly ("want me to wrap this up?"). Formalizing that into a skill adds protocol surface without adding a new judge.
3. **No baseline to calibrate against.** Solo dev, brand-new vault structure, redesigned `close-session` not yet stable. Building a recommender on top of an in-flux substrate guarantees recommender drift will be confused with substrate drift.
4. **The cheaper alternative is 20 lines of `Stop`-hook bash.** A hook that, on agent stop, runs `git status --porcelain | wc -l` and `ls .claude/current_conversations/*.md 2>/dev/null | wc -l` and prints `consider /close-session (N files touched, M scratchpads)` is mechanical, has no model bias, never fires reflexively (the model doesn't read it mid-turn), and costs nothing to delete. If the hook is not enough, *that* is the moment to consider a skill — not before.
5. **The audit-trail damage from a wrong signal is asymmetric.** A missed close costs ~nothing (you close next turn). A premature close writes a frozen, append-only session note that lies. The expected value of a recommender is therefore *negative* unless it's near-perfect — and it won't be.
6. **There is no named consumer.** The redesigned `close-session` explicitly defers tooling "until a named consumer needs them." `should-close-session` has no named consumer beyond the agent itself, which doesn't need a separate skill to ask whether to close.

**Build it only if** (a) the `Stop`-hook bash has been tried and demonstrably failed, (b) you can name three sessions in the last month that *should* have been closed and weren't, and (c) you have a kill-switch metric defined up-front (see Success Metric).

## Failure modes

### 1. The "is this even a skill?" question

**Mechanism.** Recommender systems justify themselves by their existence. Once the skill is in the registry, every session creates pressure to invoke it. The invocation cost (tokens, latency, attention) is paid every time; the benefit is realized only when the user would otherwise have failed to close — a rare event in a solo workflow where closing is already part of the user's reflex.

**Example.** User runs `/close-session` at the end of every working block already. A recommender fires "consider closing" 8 times during that block. 7 fires are noise. The 1 useful fire was 30 seconds before the user was going to close anyway.

**Fix.** Adopt a **`Stop`-hook-first** policy: implement the simplest possible signal (a bash hook printing a one-line hint on agent stop) and run it for 30 days. Only escalate to a skill if the hook demonstrably misses cases that matter. The lens design must include a written **abort criterion**: "if after 30 days the hook caught ≥80% of closeable moments, do not build the skill."

### 2. Agent-driven reflexive bias

**Mechanism.** The agent reading `should-close-session`'s output is *also* the agent that produced the work and will *also* be the agent writing the session note if close fires. Its objective is "be helpful." A "close now" signal becomes evidence that the work is complete; the agent then frames whatever it just did as a coherent unit, even if it was a fragment. A "keep going" signal becomes evidence that the work is mid-stride; the agent then invents a next step. The recommender's output is *self-confirming*.

**Example.** User asks for a one-line bug fix. Agent fixes it. `should-close-session` fires "close now (single coherent change)." Agent writes a session note framing the fix as a "premise test" with a fabricated `verdict: supported` because the recommender's framing primed it. The bug fix had nothing to do with any premise.

**Fix — structural.** The recommender must emit **only mechanical observables**, never normative judgments. Allowed output: `files_touched=4, scratchpad=1, conversation_age=45min, last_git_commit=12min_ago`. Forbidden output: `close now`, `keep going`, `looks done`, `seems incomplete`. The interpretation must remain with the user (or with `close-session`'s own Step 0 triage). This is the only defense; if the skill outputs a verdict, reflexivity wins.

**Honest "cannot fix":** even with mechanical-only output, the agent will *interpret* the observables. There is no fully reflexivity-free design as long as the same agent reads the signal and writes the note. The mechanical-output rule reduces but does not eliminate it.

### 3. False-signpost cascade

**Mechanism.** A premature close produces a session note with thin frontmatter (e.g., empty `premise_tests`, one `candidate_premises` string the agent invented to justify the close). The note is append-only (`close-session` forbids editing prior sessions). The audit recipes (`grep -rl ...`) treat all notes as ground truth. Even one bad note contaminates `audit-backward` queries forever.

**Quantification.** With `K` real closes per month and `F` premature closes per month, the contamination ratio is `F / (K + F)`. For a solo dev doing ~20 sessions/month, even `F=2` (10% false-positive rate) means 1-in-10 audit hits is junk. Five months in, that's 10 junk notes vs ~100 real ones — enough to make any pattern claim from `grep` results non-trustworthy. The `close-session` redesign's "Drift detection" leak already warns there's no audit tooling; a noisy recommender accelerates rot faster than the eyeball-every-30-sessions defense can catch.

**Fix — structural.** Recommender must never fire when `files_touched=0` AND `scratchpad=0` AND no candidate premise is detectable. This duplicates `close-session`'s Step 0.4 gate — which is the point. If the recommender ever fires in conditions where `close-session` would refuse to write a note, the recommender is by definition wrong, and a `--dry-run` mode of `close-session` would be the more honest tool.

**Honest "cannot fix" alternative:** delete the recommender and use `close-session --dry-run` (proposal: extend `close-session` with a flag that runs Step 0 and reports the gate decision without writing). One skill, one source of truth.

### 4. Topic-drift trap

**Mechanism.** Real sessions cover multiple topics — debugging leaks into a refactor leaks into a docs fix. A topic-shift trigger fires on every cross-topic edit (noise). A non-topic-shift trigger misses the case where a session should have been split (silence). There is no middle ground because "topic" is unobservable from outside the conversation.

**Example, noisy:** agent fixes a typo in a premise file mid-debug. Recommender sees a `domain_knowledge/premise/` touch on top of `src/` touches and fires "topic shift, close." User ignores, agent loses focus. **Example, silent:** user works for 3 hours across betting-model code, scratchpad notes on a new axiom idea, and refactoring of `domain_knowledge/`. Recommender stays quiet because each file is "vault-adjacent." One session note tries to signpost three sessions' worth of work and gets routed to `discovery/` by `close-session`'s 15-line cap — which works, but the recommender added nothing.

**Fix — honest "cannot fix."** Topic-shift detection from file paths is fundamentally lossy. Do not attempt it. If the design needs to address multi-topic sessions, do it in `close-session` (which can refuse via `CLOSE_DEFERRED` when the agent itself notices tangled work), not in a pre-hoc recommender.

### 5. Context-pressure trap

**Mechanism.** A "context is N% full" trigger fires precisely when the user is deep in long-context work that *needs* the full context. The trigger is loudest when its advice is most costly to follow.

**Example.** User is mid-investigation across 8 vault files, scratchpad has 600 lines of working notes, context is 85% full. Recommender fires "close to preserve audit." User closes. `close-session` writes a thin note because the investigation isn't done. The next session reopens cold, re-reads 8 files, re-derives the in-flight reasoning — a net loss.

**Fix — structural.** Context-pressure must never be a *trigger*; at most it can be an *observable* surfaced when the user has *already* asked "should I close?" The skill is read-only on context state, never advisory about it. (And honestly, the harness already shows context fill; reproducing it in a skill is a feature in search of a problem.)

### 6. Bootstrap trap

**Mechanism.** First N sessions, the recommender has zero calibration. It either fires too often (the user learns to ignore it) or too rarely (the user forgets it exists). Either failure persists past the bootstrap because the user has already classified the tool.

**Quantification.** "Trained to ignore" is sticky: in user-research literature on notification fatigue, a tool dismissed >5 times in its first 10 uses is dismissed indefinitely. For this project, that means 10 sessions of bad calibration permanently sinks the skill.

**Fix — structural.** Ship in **observe-only mode** for the first 20 sessions: the skill logs what it *would* have recommended to `vault/discovery/should-close-session-design/observations.jsonl`, but emits nothing to the agent. After 20 sessions, review the log by hand. Decide then whether the skill should ever speak. This converts the bootstrap problem into a calibration dataset.

### 7. "The user is the LLM" reality

**Mechanism.** The recommender's output is consumed by an agent that already has full conversational context — including the implicit signal "should I suggest closing?" The agent is *already* making that judgment every turn. A separate skill that emits a recommendation duplicates the judgment, but worse: it makes the judgment from less context (only the mechanical observables, not the conversation), and the agent then has to reconcile its implicit view with the skill's explicit one. Reconciliation cost > recommendation value.

**Example.** Agent thinks the work is mid-stride. Skill says "close now." Agent now has to decide: trust myself, trust the skill, or hedge? The hedge is the worst outcome (asks the user a meta-question instead of doing work), and it's the most likely outcome under "be helpful" pressure.

**Fix — structural.** The skill must *not* be invoked automatically. The user (or the agent on direct user request) invokes it. This collapses the use case to: "user asks 'should I close?' → agent runs the skill → reports observables → user decides." Which is approximately equivalent to: "user looks at `git status` and `ls .claude/current_conversations/`." If the skill doesn't earn its place against that baseline, it doesn't earn its place.

**Honest "cannot fix":** if the design requires automatic invocation (e.g., on every agent stop), there is no defense against (7). Auto-invocation is the failure.

### 8. The metric you can't name is the feature you shouldn't build

**Mechanism.** Without a pre-declared success metric, the skill cannot be evaluated and therefore cannot be deleted. It will persist by default, accumulating maintenance cost, and every failed recommendation will be rationalized as "edge case."

**Example.** Six months in, asked "is `should-close-session` working?", the answer is "it fires sometimes and the user sometimes closes." That is not a measurement. That is a vibe.

**Fix — structural.** See next section. The metric must be defined *before* the skill ships and the skill must include a written kill-switch tied to the metric.

## Success metric

A single primary metric and a single kill-switch threshold, both declared up front.

**Primary metric: useful-fire rate.**

```
useful_fire_rate = (recommendations followed by a close that produced a non-empty, non-deferred session note within 5 minutes) / (total recommendations emitted)
```

Measured over a rolling 30-session window after the 20-session observe-only bootstrap.

**Kill-switch thresholds:**

- `useful_fire_rate < 0.50` after 30 active sessions → delete the skill. It is firing more wrong than right; the agent is being taught to distrust it.
- `total recommendations / total sessions > 1.5` → delete the skill. It is firing more than once per session on average; it has become noise.
- `total recommendations / total sessions < 0.10` → delete the skill. It is firing in less than 1 of 10 sessions; the user gets no value and the `Stop`-hook would have done the same job for free.

**Secondary observable (not a kill criterion, but logged):** premature-close rate, defined as the fraction of session notes written within 5 minutes of a recommender fire that contain zero `files_touched`, zero `premise_tests`, and a single fabricated-looking `candidate_premises`. If this exceeds 10%, the recommender is corrupting the audit trail and must be killed regardless of useful-fire rate.

**Telemetry path:** append one JSONL line per fire and per close to `vault/discovery/should-close-session-design/telemetry.jsonl`. No fancy dashboarding; a `jq` one-liner against the file is the audit tool. If telemetry isn't written, the skill is in violation of its own design and must be removed.

## Open Questions

1. Is the right move actually to extend `close-session` with a `--dry-run` (or `--triage-only`) flag rather than building a separate skill? `close-session`'s Step 0 already implements every check a recommender would do; a `--dry-run` reuses the authoritative logic and eliminates the two-judges problem entirely.
2. Would a `Stop` hook running `git status --porcelain | wc -l` + scratchpad count + minutes-since-last-commit, printed as a one-liner to the agent, cover ≥80% of the useful-fire cases? If yes, the skill should not exist.
3. If the skill ships, who reviews the observe-only-mode log after 20 sessions? The same agent that produced the log is biased about it. A solo dev has no second reviewer. Is the review even possible, or is the bootstrap protocol fictional?
4. Does the redesigned `close-session`'s `CLOSE_DEFERRED` exit already absorb the "don't close prematurely" failure mode well enough that a recommender adds nothing? The deferral is post-hoc but cheap (one line, no note written) — pre-hoc recommending may be strictly redundant.
5. What is the minimum recommender output that does not trigger reflexive bias (Failure 2)? Is it possible at all, or is "mechanical observables only" a fig leaf that the agent will still interpret normatively?
6. If `useful_fire_rate` is unmeasurable in practice (because "followed by a close that produced a non-empty note" requires the agent to log the linkage honestly, and the agent is biased), then the success metric is also fictional. Is there an external observer (the user, manually) willing to label fires for 30 sessions? If not, the metric collapses and so does the design.

## Connections

- `derives-from` → `../../research/research.md`
- `cited-by` → `../../discovery.md`
