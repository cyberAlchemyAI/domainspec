# Lens 01 — Signal Design

## Claim

The right close-session recommender for this user is **dominated by two signals**: (1) whether the working tree has accumulated *semantic* edits (files touched in a way that would generate a signpost note under the redesigned `close-session`), and (2) whether the conversation has crossed a **topic boundary** — meaning the active goal that justified the current scratchpad is done, abandoned, or has shifted. Everything else (turn counts, elapsed time, context-window pressure) is a **tiebreaker or soft prior**, not a primary trigger. The recommender should be silent by default, fire at most once per "phase" of a session, and escalate from a single soft hint to a clear recommendation only when both primary signals agree. Crucially, the agent's introspective sense of "natural stopping point" must be excluded — it is unfalsifiable and trivially gameable, and the whole point of this skill is to compensate for the agent's poor calibration on session length.

## Signal catalog

| # | Signal | What it observes | How measured | False-positive risk | False-negative risk |
|---|--------|------------------|--------------|---------------------|---------------------|
| S1 | **Semantic git delta** | Working tree has edits that aren't pure navigation/read artifacts | `git status` + `git diff --stat` — count of files with non-trivial line changes (>3 lines or new file), excluding scratchpad/log paths | Low — edits are concrete | Medium — pure-thinking sessions (premise discovery, no code) generate no diff |
| S2 | **Premise/axiom mention shift** | Conversation introduces a *new* premise/candidate-premise, or flips status of an existing one | Scan recent turns for vault-vocabulary keywords (premise, axiom, constitution, candidate, falsified, promoted) AND for proper nouns/concepts not present in earlier turns | Medium — keyword matches without commitment | Medium — user may discuss premises elliptically |
| S3 | **Stated-goal completion** | User opened with a goal ("let's figure out X", "fix Y"); that goal is resolved or explicitly dropped | Look for opening-turn imperative + later turn matching "done / works / moving on / never mind / actually let's…" | Medium — users rarely declare completion explicitly | High — solo dev work rarely has clean goal statements |
| S4 | **Axis shift** | Conversation switches modality (coding → debugging → reflecting → planning) | Heuristic over tool-call mix in sliding window: ratio of Edit/Write vs Read/Grep vs pure-text turns | Medium — natural oscillation within one task | Low — real shifts are visible in tool mix |
| S5 | **Scratchpad size / signpost staleness** | Current scratchpad has grown past a threshold or hasn't been updated in N turns despite activity | Line count of scratchpad file; turns since last write | Low for the size half; medium for staleness (some work doesn't need scratchpad) | Low |
| S6 | **Context-window pressure** | Conversation is approaching a token/turn budget where quality degrades | Token estimate or turn count proxy | Low (it's a real cost) but not a *closing* signal — it's a "compact or close" signal | High — many short sessions never approach this |
| S7 | **Turn count** | Raw count of user+assistant turns | Counter | Very high — turn count is uncorrelated with closeability for this workflow | Very high |
| S8 | **Elapsed wall time** | Real-world minutes since session start | Timestamp diff | Very high — user steps away, returns; meaningless | Very high |
| S9 | **Tool-call count** | Total tool invocations | Counter | High — Read-heavy investigations inflate this without semantic progress | High |
| S10 | **Distinct files touched** | Unique paths in Edit/Write set | Set cardinality | Medium — broad refactor touches many files in one coherent task | Low |
| S11 | **Vault note generation likelihood** | Mirror the redesigned `close-session` trigger: would a signpost note actually be written if we closed now? | Evaluate `files_touched ∪ premise_tests ∪ candidate_premises` non-empty | Low — by construction this is the thing we care about | Low |
| S12 | **User idle / explicit cue** | User says "ok", "thanks", "good for now", "let's stop", or goes silent mid-conversation | Pattern match on final user turn + turn-gap timing | Low for explicit cues; N/A for idle (recommender doesn't see future turns) | Medium — users rarely sign off cleanly |
| S13 | **Agent self-assessment** | Agent's own feeling that session is "wrapping up" | LLM introspection | **Catastrophic** — gameable, drifts toward whatever serves the current response | High |

## Ranking and rationale

For this user (solo dev, domain-knowledge work, vault discipline, mixed coding + epistemic sessions), reliability ranks:

1. **S11 (vault note generation likelihood)** — load-bearing. It's the *definition* of "this session was worth marking closed" in the sibling skill. If a close right now produces no note, closing is mostly cleanup; we shouldn't push for it.
2. **S1 (semantic git delta)** — strongest objective signal. Solo-dev sessions either change the repo or they don't. Combined with S11, this is most of the truth.
3. **S4 (axis shift)** — the workflow legitimately mixes coding and epistemic work, and shifts between them are the natural "phase boundary" where closing prevents scratchpad contamination across modalities.
4. **S2 (premise/axiom mention shift)** — high specificity to *this* user's vault discipline. When new premises enter the conversation, the prior scratchpad is now stale by definition.
5. **S5 (scratchpad size/staleness)** — useful tiebreaker. A large scratchpad that hasn't tracked recent work is a concrete cost.

Below the cut (used only as priors or for the "compact or close" sub-decision, not as triggers):

- **S6** triggers a *different* skill (compact), not close-session. Include only to avoid recommending close when compact is the right move.
- **S3** would be excellent if users actually stated goals cleanly; in practice for solo dev, they don't.
- **S12** explicit cues should short-circuit to "clear recommendation" but they're rare.
- **S7, S8, S9, S10** are too noisy as primary signals for this workflow. Long Read-heavy investigations are real work; short sessions can be epistemically dense. Use S7 only as an anti-nag cooldown counter, never as a trigger.
- **S13 is disqualified.** See below.

## Scoring rule

Compute three primary inputs each time the recommender wakes (after every assistant turn that follows a user turn — not on tool-only turns):

- `note_likely` ∈ {0, 1}: would `close-session` generate a note? (S11)
  - 1 iff semantic git delta is non-empty OR conversation introduced ≥1 candidate premise / premise test reference.
- `phase_boundary` ∈ {0, 0.5, 1}: (S4 + S2)
  - 1 if both axis shift detected AND new premise vocabulary in last 3 turns
  - 0.5 if exactly one
  - 0 if neither
- `scratchpad_cost` ∈ {0, 0.5, 1}: (S5)
  - 1 if scratchpad > 400 lines OR untouched for ≥ 8 turns of active work
  - 0.5 if scratchpad > 200 lines
  - 0 otherwise

Decision tiers:

| Tier | Condition | Output |
|------|-----------|--------|
| **Silent** | `note_likely == 0` OR `(phase_boundary + scratchpad_cost) < 1.0` | nothing |
| **Soft hint** | `note_likely == 1` AND `(phase_boundary + scratchpad_cost) ∈ [1.0, 1.5)` | one line: *"close-session would generate a note now; consider closing when convenient."* |
| **Clear recommendation** | `note_likely == 1` AND `(phase_boundary + scratchpad_cost) ≥ 1.5` | one paragraph: name the phase boundary, name the cost, suggest closing before continuing |
| **Hard recommendation** | Explicit user cue (S12) AND `note_likely == 1` | *"You signaled stop and there are unmarked changes — run close-session now."* |

`note_likely == 0` is a **hard veto**. If closing wouldn't produce a note, we never speak. This single rule eliminates most nagging.

## Silence default

Base rate: **at most one fire per phase, at most two fires per session, hard zero fires if `note_likely == 0`.**

Reasoning:
- A session of 60 turns mixing coding + a premise discussion has at most 2 real phase boundaries. More than 2 fires means we're tracking noise.
- A soft hint that the user ignores must **not** re-fire on the next turn. Implement a cooldown: after firing, suppress for `max(8 turns, 1 phase boundary)`, whichever comes second.
- A clear recommendation that the user ignores escalates to silence, not louder. The user has answered "no" by continuing — respect it. Re-fire only if a *new* phase boundary occurs after the ignore.
- If the user runs `close-session` and starts a new session, counters reset.

Anti-nag mechanics:
1. **Veto on no-note-possible.** Most important rule.
2. **Cooldown after any fire.** 8 turns minimum.
3. **Decay on ignore.** A second fire within a session must clear a higher bar (require `phase_boundary == 1`, not 0.5).
4. **No fire on tool-only turns.** Wait until the user has spoken.
5. **No fire in the middle of a tool sequence.** If the assistant's last turn ended with a pending tool call expectation, defer.

## Disqualified signals

- **S13 — Agent self-assessment of "natural stopping point."** Disqualified absolutely. The agent's introspection here is (a) trained to be agreeable, so it will rationalize whatever the surrounding context suggests; (b) unfalsifiable post-hoc; (c) precisely the failure mode this skill exists to compensate for. If the agent could reliably detect stopping points, no skill would be needed.
- **Sentiment / "user seems satisfied."** Same failure mode as S13 one layer removed.
- **"Length of last assistant response."** Long responses don't mean done; they often mean confused.
- **"User said thanks."** Politeness is not a stop signal in solo dev workflows; this user says thanks mid-stream.
- **Time-of-day / calendar heuristics.** Privacy-adjacent and unreliable; user works irregular hours.
- **Any signal requiring the agent to predict the user's next intent.** Prediction of intent is the user's job; observation of state is ours.

## Open Questions

1. How exactly does the recommender detect "axis shift" cheaply? A keyword + tool-mix heuristic works for v1, but may need a small classifier later.
2. Where does the scratchpad live, and can the recommender read its line count without a dedicated tool? (Assumes filesystem access; confirm against the sibling skill's scratchpad location.)
3. Should the soft hint be visible to the user, or only to the agent (as a private nudge to consider proposing close)? Lens scope is signal design, but the surface affects the nag budget.
4. Is there value in a **negative** signal — actively suppressing close recommendations during known long-form tasks (e.g., a multi-file refactor explicitly scoped in the opening turn)?
5. How do we evaluate the recommender after deployment without a labeled dataset of "good close moments"? Candidate: post-hoc, compare actual `close-session` invocations against recommender fire history and measure precision/recall on the user's own behavior.
6. Should `note_likely` peek at the redesigned `close-session` logic directly (call it in dry-run mode) rather than reimplementing the check? That would keep the two skills in lockstep but couples them.
