---
tags: [vault, discovery, skill-design, should-close-session, hook, anti-nag, reflexivity]
node_type: discovery
is_session: false
layer: ontology
nature: explanatory
status: exploratory
version: 0.2.0
last_updated: 2026-05-18
---

# Should-Close-Session — Recommender Design

> **v0.2.0 update (2026-05-18):** This discovery was originally drafted on 2026-05-17 directly from the 4 propose-wave lenses + 3 evaluate-wave meta-lenses, without an intermediate research-layer document. On 2026-05-18 the lens slate was migrated to the new `lenses/<slug>/findings.md` shape, the three meta-lenses moved to `lenses/META-*/findings.md` with `lens_order: second`, and post-hoc `research/research.md` + `research/research-synthesis.md` were added with `analysis-method: meta-lens-consolidation`. The discovery's commitments were not edited; the version bump records the structural alignment. If the post-hoc research surfaces tensions with current commitments, those are filed as open questions for a future v0.3.0.

> The recommender does not measure closeability — it can create it. Build the smallest mechanical hook that survives that fact, and ship it as a 20-session experiment, not a long-lived skill.

## Objective

Decide the form, signals, and discipline of a recommender that watches a working session and surfaces when to invoke `close-session`. End state: a single ~30-line Stop hook (in the consumer repo's `.claude/`), one hard gate, mechanical-observables-only output, single-fire-per-session sentinel, observe-only for the first 20 sessions; SKILL.md companion is optional.

## 1. Business Context

### Why now

The sibling redesign of `close-session` is solo-dev-scaled and append-only: closing a session writes a frozen audit-trail note, and an un-invoked close means the work goes unmarked. Without a recommender, the user must remember to invoke `close-session` at the right moment, and reliance on memory is the load-bearing failure this discovery exists to address. The experiment runs in `football-stats-oracle`, not in `domainspec`; the vault folder holds only the rationale and proposal artifacts.

### What's broken

- **Recommender reflexivity** — the agent that reads any recommender output is the same agent that produced the work and (on close) writes the note; a "close now" verdict becomes self-confirming (Lens 04 Failure 2; `lenses/04-adversarial.md`).
- **`close-session`'s triage gate is post-hoc** — `vault/discovery/close-session-redesign/proposal/SKILL.md` Step 0 emits `Q&A-only session. No session note created.` and `CLOSE_DEFERRED:` only after the user invokes it. A pre-hoc recommender either duplicates the gate with less information or contradicts it.
- **Trained-to-ignore failure dominates** — a tool dismissed >5 times in its first 10 uses is silenced permanently (Lens 04 §Bootstrap trap). For a solo dev at ~20 sessions/month, 10 bad fires permanently sinks the skill.
- **Stop-hook timing cannot deliver pre-emptive nudges** — Meta-C's fixed-point walkthrough shows the hook always fires *after* the assistant turn that responded to a closing-shaped user utterance; the nudge is structurally one turn late (`meta-lenses/C-adversarial-review.md` §Fixed-point).
- **No definition of "session" the hook can observe** — Stop hooks receive `transcript_path` but no stable `session_id`; `/clear`, `/compact`, fresh `claude` invocations, and resumed transcripts all look different from outside (Meta-B Gap 1; `meta-lenses/B-gap-analysis.md`).

### What stays the same

- **`close-session` itself** — unmodified. Step 0 triage, the `CLOSE_DEFERRED` / `MULTIPLE_SCRATCHPADS` / `Q&A-only` exits, the scratchpad-deletion step. The recommender does not stage commits, does not pre-write frontmatter, does not auto-invoke close-session.
- **Global hooks (`~/.claude/hooks/gitnexus/`)** — out of scope. The new hook lives in project-level settings (`football-stats-oracle/.claude/settings.json`), which currently has no `hooks` block.
- **No port to `domainspec/.claude/` or `house_project/.claude/`** — deferred until the 20-session experiment in football-stats-oracle concludes.
- **No telemetry pipeline, dashboard, or `useful_fire_rate` evaluator** — append-only JSONL plus eyeball review is the entire measurement layer.

## 2. Core Concepts

### Mechanical observable

A filesystem- or git-derivable fact the hook can compute under a 2-second timeout: `git status --porcelain` non-empty, scratchpad line counts, sentinel presence. **Not** a verdict ("close now," "looks done"). Lens 04 Failure 2's anti-reflexivity defense: if the hook emits a verdict, the agent rationalizes it; mechanical observables force the interpretation to stay outside the hook.

### `note_likely` hard veto

The single load-bearing gate, derived from `close-session`'s own Step 0 triage. If closing right now would produce no note (`git status` clean AND no scratchpad content AND no candidate-premise/decision evidence), the recommender stays silent regardless of any other signal. All four lenses converge on this — see Meta-A convergence #1.

### Single-fire-per-session sentinel

A zero-byte sentinel file in `.claude/current_conversations/` that suppresses re-fire for the remainder of a session. Dies naturally when scratchpads die — zero coupling to `close-session`'s exit paths. Implements the "say it once, never again this session" rule (Lens 03; reinforced by Lens 01 and Meta-A convergence #3).

### Observe-only bootstrap

For the first ~20 sessions, the hook writes `would-have-fired` records to a local JSONL log but emits nothing to the agent. Converts the bootstrap problem (Lens 04 §Bootstrap trap) into a calibration dataset. Flipped off via a single env var (`OBSERVE_ONLY=0`); the kill-switch is also an env var, not a metric formula (Meta-C MVP rule 5).

### Companion SKILL.md (optional)

A ~40-line agent-facing prompt-text file that defines how the agent surfaces the hook's observation: verbatim, once, no verdict, no auto-invocation (`proposal/SKILL.md`). Optional because the hook works without it — the SKILL.md exists only to harden the agent's response contract against reflexive rationalization (Meta-B Gap 2).

## 3. Decisions Taken

### D-1 — Form factor: Stop hook, project-level, no daemon

**Decision.** Implement as a Stop hook in `football-stats-oracle/.claude/settings.json`, emitting `hookSpecificOutput.additionalContext` via the same protocol as the existing GitNexus PreToolUse/PostToolUse hooks at `~/.claude/hooks/gitnexus/gitnexus-hook.cjs`. No skill self-invocation, no cron, no slash-command as the trigger.

**Rationale.** Stop fires once per assistant turn — natural debounce; project-level isolation prevents cross-repo pollution; established harness pattern reduces uncertainty. UserPromptSubmit fires before the signal has accrued (wrong moment); Skill self-invocation burns tokens on every quiet turn and depends on the agent remembering — exactly the failure this addresses. (Lens 02 form-factor survey.)

**Status.** Adopted. Slash command may ship as a backup *explicit* check but is not the primary trigger.

### D-2 — Single hard gate: `git status --porcelain` non-empty AND sentinel absent

**Decision.** The recommender fires iff (a) `git status --porcelain` against vault-relevant paths (`src/`, `domain_knowledge/`, `experiments/`, `.claude/current_conversations/`) is non-empty, AND (b) the per-session sentinel is absent. No scoring tiers, no weighted sum, no `phase_boundary ∈ {0, 0.5, 1}` ladder.

**Rationale.** Lens 01's 13-signal catalog and 4-tier scoring rule collapse under Meta-C's review: most signals require transcript JSONL parsing the hook can't afford under a 500ms budget, and the tier ladder is escalation (which Lens 03 forbids and Meta-A convergence #3 rejects). The `git status` check is the cheapest gate that mirrors `close-session`'s own triage.

**Status.** Adopted. `note_likely` veto is enforced by this gate; closing on a clean tree by construction wouldn't generate a note.

### D-3 — Output is mechanical observables only

**Decision.** The `additionalContext` payload contains file counts, scratchpad size, and "close-session would write a note" — never "close now," "looks done," "ready to close." The companion SKILL.md instructs the agent to surface the line verbatim, once, at end of turn, and forbids verdict-by-stealth.

**Rationale.** Lens 04 Failure 2's only structural defense against reflexivity. Lens 01's tiered verdicts and Lens 02's "consider closing" payload both violated this; D-3 chooses the discipline over the convenience. Honest limitation: even mechanical observables get interpreted by the reader — the rule reduces but does not eliminate reflexivity.

**Status.** Adopted. Companion SKILL.md (`proposal/SKILL.md`) operationalizes the agent-side contract.

### D-4 — Single-fire sentinel co-located with scratchpads, no `close-session` coupling

**Decision.** Sentinel lives in `.claude/current_conversations/` and dies when scratchpads die. `close-session` is not modified to delete it.

**Rationale.** Zero-coupling: every cleanup mechanism `close-session` performs on scratchpads applies to the sentinel for free. Lens 02 originally proposed extending `close-session` by one line; rejected because any change to `close-session`'s contract would silently break the sentinel.

**Status.** Adopted.

### D-5 — Observe-only bootstrap with env-var kill-switch

**Decision.** Ship with `OBSERVE_ONLY=1`. Hook computes the decision but writes a JSONL line to `.claude/state/should-close-observations.jsonl` instead of emitting `additionalContext`. After 20 sessions of real use, hand-review the log; three outcomes:
- (a) good correlation → flip `OBSERVE_ONLY=0`.
- (b) poor correlation → delete the hook.
- (c) the hook never fires → delete the hook, conclude the recommender solves a non-problem for this user.

**Rationale.** Lens 04 §Bootstrap trap: notification-fatigue research shows a tool dismissed 5+ times in its first 10 uses is dismissed indefinitely. Observe-only converts the bootstrap into a calibration dataset and makes deletion the default cheap path. Meta-C drops the elaborate `useful_fire_rate` rolling-window evaluator in favor of eyeball review at this scale.

**Status.** Adopted. The honest framing: this is a 20-session experiment, not a long-lived skill.

### D-6 — Vault target is knowledge-scope; implementation lives in consumer repo

**Decision.** The rationale, lens artifacts, proposal SKILL.md, and this discovery live in `vault/discovery/should-close-session-design/` in `domainspec`. The actual hook script, `settings.json` fragment, and companion SKILL.md (when adopted) live in `football-stats-oracle/.claude/`.

**Rationale.** Cross-repo split follows R15 (vault-as-discipline vs feature-as-application). The recommender's claims govern the vault's session-discipline doctrine (knowledge scope); its mechanical implementation is feature-scoped to the football-stats-oracle experiment.

**Status.** Adopted.

## 4. Alternatives Considered

### A-1 — Lens 01's 13-signal weighted-tier scoring

**Proposal.** Compute three primary inputs (`note_likely`, `phase_boundary`, `scratchpad_cost`) with `{0, 0.5, 1}` domains, dispatch to four tiers (Silent / Soft hint / Clear recommendation / Hard recommendation).

**Why rejected.** Meta-C: "most over-engineered." `phase_boundary` requires axis-shift detection via tool-mix sliding windows plus premise-vocabulary scanning — neither is cheaply available to a Stop hook under a 500ms budget. The Soft/Clear/Hard ladder is escalation, contradicting Lens 03's "say it once" rule and Meta-A convergence #3. Mechanically clever; operationally infeasible.

### A-2 — Lens 03's trust-score state machine

**Proposal.** Persistent `trust_score ∈ [0,1]` with explicit decay rates (`+0.05` accept, `−0.10` dismiss, `−0.02` ignore, `−0.20` "you were wrong"), per-signal-combination snoozes for 24h across sessions, dormancy bands, 7-day disable, self-uninstall.

**Why rejected.** Meta-C: "weakest proposal." Trust-score arithmetic is fake precision over unmeasurable inputs — explicit-dismissal classification depends on keyword detection that misfires on solo-dev replies. The state machine requires a writer the system doesn't have (Meta-B Gap 2): the only thing that reads the prompt is the agent, and the agent has no machinery to write `last_prompt_outcome` back. Sounds rigorous, brittle on contact.

### A-3 — Extend `close-session` with `--dry-run` / `--triage-only` flag

**Proposal.** Skip the recommender entirely; add a flag to `close-session` that runs Step 0 triage and reports the gate decision without writing a note. One skill, one source of truth, zero reflexivity (Lens 04 OQ#1, Failure 3 honest "cannot fix" alternative).

**Why partially adopted.** Architecturally cleaner — eliminates the two-judges problem and the drift risk between the recommender's mirror of `note_likely` and `close-session`'s actual gate. But requires the user to *invoke* it, which is the exact failure mode the recommender addresses (reliance on memory). Kept as the long-term fallback: if the 20-session experiment kills the hook, the `--triage-only` path is the next move, not a different recommender.

### A-4 — UserPromptSubmit hook instead of Stop hook

**Proposal.** Fire when the user submits a prompt, injecting `additionalContext` before the model acts.

**Why rejected.** Wrong moment in the loop — the signals (turn count, accumulated scratchpad, working-tree state) ratchet *after* the assistant acts, not before. The user-submit point sees stale state. (Lens 02 form-factor survey.)

### A-5 — PreCompact secondary trigger

**Proposal.** In addition to Stop, fire on context compaction events as a secondary "you've been at this a while" signal.

**Why rejected.** Compaction is rare on football-stats-oracle; one trigger is enough (Meta-C MVP). Adds a second emission path and a second sentinel-clearing concern for negligible coverage gain. Reconsider if compaction becomes routine.

### A-6 — Cron / `loop` skill / wall-clock interval recommender

**Proposal.** Fire every N minutes via a daemon or cron task.

**Why rejected.** Wrong axis — fires whether or not a session is running, can't see scratchpads tied to *this* session, generates cross-session noise. Time is not the unit; turns are. (Lens 02.)

## 5. Open Questions

### OQ-1 — Stop-hook `additionalContext` is empirically unverified

**Question.** Does the current Claude Code build accept `additionalContext` injection at Stop, or only `decision`/`stopReason`?

**Recommendation.** Run a 5-minute spike before deploying: a no-op Stop hook that emits a known string, then inspect the next turn's context. If `additionalContext` is rejected at Stop, fall back to writing the reason to `.claude/current_conversations/.should-close-reason` and have the SKILL.md teach the agent to read it on session start. Skill stays useful as a passive log even with the primary surface broken.

### OQ-2 — Session-identity definition

**Question.** A Stop hook does not know what a "session" is. `/clear`, `/compact`, fresh `claude` invocations, resumed transcripts, and a user walking away for 4 hours all look different from outside. What is the canonical `session_id` derivation rule?

**Recommendation.** v0 uses oldest scratchpad mtime in `.claude/current_conversations/` as the session-identity proxy and sentinel key. Document the limitation explicitly in the companion SKILL.md. Revisit if/when Claude Code exposes a stable session id to hooks.

### OQ-3 — Observation-log location: per-repo vs cross-repo

**Question.** Should the JSONL log live in `football-stats-oracle/.claude/state/` (local, fragile if user works across repos) or `domainspec/vault/discovery/should-close-session-design/observations.jsonl` (canonical home, requires cross-repo write contract from a project-local hook)?

**Recommendation.** v0 writes local (`football-stats-oracle/.claude/state/should-close-observations.jsonl`). Move to cross-repo only if the 20-session experiment graduates and the log earns long-term value.

### OQ-4 — `note_likely` drift from `close-session`'s actual gate

**Question.** The hook reimplements `close-session`'s triage as a cheap proxy. If `close-session`'s Step 0 changes, the proxy lies — and a user who acts on a fire only to get `Q&A-only, no note` is the trust-destroying outcome.

**Recommendation.** v0 takes the "trust the user" path: the proxy is documented as best-effort, and the SKILL.md companion includes a clause that the hook fire is observation not promise. Promote to a shared `triage.sh` if A-3 (the `--triage-only` extension to `close-session`) ever ships — then both call the same script.

### OQ-5 — Companion SKILL.md: required or optional?

**Question.** Does the agent-side response contract need to be a registered skill, or is the inline `additionalContext` payload enough?

**Recommendation.** Optional for v0. The hook works without it; the SKILL.md exists only to harden the agent against reflexive rationalization (D-3). Ship the hook alone; add the SKILL.md if observation-log review shows the agent is verdict-laundering the mechanical observations.

### OQ-6 — Port to `domainspec/` or `house_project/`?

**Question.** Should the hook be installed in other repos where the user runs vault sessions?

**Recommendation.** Defer until the football-stats-oracle 20-session experiment concludes. Each repo has a different scratchpad layout and a different "session-worthy" definition; per-repo calibration is more honest than a global hook.

### OQ-7 — Adversarial review's "is this even a skill?" remains unresolved

**Question.** Lens 04's steelman concludes the skill should likely not be built. The MVP is a deliberate concession; the 20-session experiment is the test. What is the bar for "the recommender earned its place"?

**Recommendation.** Pre-declared in D-5: if hand-review of 20 observations shows the hook would catch nothing the user wouldn't catch themselves, delete the hook. The default is deletion, not retention. No `useful_fire_rate` formula — eyeball review at solo-dev scale is the metric.

## 6. Load-Bearing Tensions

Two tensions surfaced repeatedly across lenses and resist clean resolution:

1. **Non-nag discipline vs adversarial reflexivity.** Lens 03 ("Non-Nag Discipline") and Lens 04 ("Adversarial") agree silence is the default but disagree on the mechanism. Lens 03 builds calibrated machinery (trust score, snooze ledger, classification window) to *earn* the right to speak; Lens 04 argues the same machinery is itself the reflexive failure — any output the recommender chooses gets rationalized by the agent regardless of how well-gated it was. Meta-C resolves in Lens 04's favor (Lens 03 is "weakest") but the resolution costs the discovery its calibration loop. The discovery ships with crude single-fire suppression instead of graduated trust, and accepts that this will sometimes silence a genuinely close-worthy second phase within one session. The non-nag discipline is real and load-bearing; the adversarial lens stress-tests it and finds the calibrated form unworkable at this scale.

2. **"Signals when" (the design target's verb) vs "observes" (every surviving lens).** The README's framing presumes positive prescription. Every surviving lens argues the output should be observation, not prescription — because the agent reading any prescription will rationalize it. The discovery resolves toward observation (D-3 mechanical-observables-only), which is a structural disagreement with the original framing. Honest framing: the recommender does not measure closeability, it can create it; the only design that doesn't make that worse is one that emits mechanical facts and leaves interpretation to the user.

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/should-close-session-design/README.md` | `derives-from` | Synthesis aggregates the four propose-wave lenses and three evaluate-wave meta-lenses indexed by this README. |
| `vault/discovery/should-close-session-design/research/research.md` | `derives-from` | Post-hoc research-layer consolidation (analysis-method: meta-lens-consolidation) added on 2026-05-18 to retrofit the lens → research → discovery chain. |
| `vault/discovery/should-close-session-design/lenses/01-signal-design/findings.md` | `synthesizes` | Propose-wave: 13-signal catalog and tiered scoring; `note_likely` veto adopted as D-2's hard gate. |
| `vault/discovery/should-close-session-design/lenses/02-form-factor/findings.md` | `synthesizes` | Propose-wave: Stop-hook form factor with PreCompact secondary; chosen verbatim as D-1 minus the secondary trigger. |
| `vault/discovery/should-close-session-design/lenses/03-non-nag-discipline/findings.md` | `synthesizes` | Propose-wave: trust-score state machine and per-session caps; refuted by Meta-C, surviving principle (silence default, no escalation) adopted in D-4. |
| `vault/discovery/should-close-session-design/lenses/04-adversarial/findings.md` | `synthesizes` | Propose-wave: steelman against building, reflexivity diagnosis, observe-only bootstrap; load-bearing for D-3 and D-5. |
| `vault/discovery/should-close-session-design/lenses/META-A-cross-cutting/findings.md` | `synthesizes` | Evaluate-wave: 7 convergences and shared mental model; observation-vs-prescription tension surfaces in §6 tension 2. |
| `vault/discovery/should-close-session-design/lenses/META-B-gap-analysis/findings.md` | `synthesizes` | Evaluate-wave: 7 gaps and load-bearing honest defers; informs OQ-2, OQ-3, OQ-4. |
| `vault/discovery/should-close-session-design/lenses/META-C-adversarial-review/findings.md` | `synthesizes` | Evaluate-wave: fixed-point walkthrough and 5-rule MVP; load-bearing for D-2 collapse of Lens 01's tier ladder. |
| `vault/discovery/should-close-session-design/proposal/SKILL.md` | `generates` | The agent-side response contract operationalizing D-3's mechanical-observables-only rule. |
| `vault/discovery/close-session-redesign/README.md` | `cites` | `close-session`'s Step 0 triage gate is the load-bearing source of the `note_likely` hard veto; the recommender's contract depends on it. |
| `.claude/skills/custom/discovery-writing.md` | `cites` | Structure follows the discovery-writing template (Objective, Business Context, Core Concepts, Decisions, Alternatives, Open Questions). |

## Source Dispatch

This discovery synthesizes the propose/evaluate fan-out recorded under `vault/discovery/should-close-session-design/`:

- Propose-wave lenses (`lens_order: first`): `lenses/01-signal-design/findings.md`, `lenses/02-form-factor/findings.md`, `lenses/03-non-nag-discipline/findings.md`, `lenses/04-adversarial/findings.md`.
- Evaluate-wave meta-lenses (`lens_order: second`): `lenses/META-A-cross-cutting/findings.md`, `lenses/META-B-gap-analysis/findings.md`, `lenses/META-C-adversarial-review/findings.md`.
- Research-layer consolidation: `research/research.md` (analysis-method: meta-lens-consolidation) and `research/research-synthesis.md` (≤500 words).
- Proposal artifact: `proposal/SKILL.md`.

Promoted to a discovery node per lifecycle step 7 user-gate confirmation (2026-05-17). Knowledge-scope target chosen because the recommender's claims govern the vault's session-discipline doctrine, not just one feature. Lens slate migrated to the new `lenses/<slug>/findings.md` shape on 2026-05-18 (v0.2.0 bump).
