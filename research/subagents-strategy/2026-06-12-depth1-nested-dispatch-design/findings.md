---
tags: [agents, dispatch, subagents, nesting, governance, findings]
node_type: findings
is_session: false
layer: architecture
nature: analytical
status: complete
last_updated: 2026-06-12
---

# Findings — depth-1 nested dispatch design

**Dispatch:** `2026-06-12-depth1-nested-dispatch-design` (meta, research, schema
v0.5.2). **Goal:** decide whether and how to admit depth-1 nested dispatches (≤ 1
nested dispatch per working agent, ≤ 2 per parent, no further nesting) — gate,
registration, and budget questions answered. Collected returns: `research.md` (this
folder); citations [A] [B-Cn] [R-n] [Q-step-n] resolve there. Return [A] is a
**partial group result** (P4) — its precedent support is weighted accordingly.

## Verdict matrix (final, post zig-zag)

| # | Component | Owned? (precedent) | Witnessed? (constructible today) | Sound? | Final verdict |
|---|-----------|--------------------|----------------------------------|--------|---------------|
| 1 | Delegated entry gate (spawning agent approves; human reviews at close) | PARTIAL — [A] analogues cover spawn-authority delegation, not approval delegation (weakened by [A] partial) | No mechanism [Q-step-3, Q-step-8] | **No** — retroactive review is a notification, not a gate [R-1]; agent-approves-own-sheet is P12 self-approval renamed [R-3] | **KILL as drafted → REPLACE** with quarantine-until-affirmative + different-actor approver |
| 2 | Explicit grant in `initial_prompt` | OWNED — capability non-re-export [A] | Carrier exists today (free text) [Q-step-1] | **No as bare flag** — blank check; one click is not two consents [R-2, R-4] | **CONTENTFUL-OR-VOID** — grant must enumerate the possible nested sheets at top-level confirm |
| 3 | 2-per-parent cap | OWNED — cgroup/rlimit numeric encoding [A] | **No** — appender's self-check discards non-row keys [Q-step-5] | Sound as *count* limiter only; never a cost brake [B-C9]; orthogonal to consent [R-5] | **GO — MUST BE BUILT** |
| 4 | Registration via `parent_dispatch_id` | OWNED — traceability-first rule [A] | Negative witness: today's appender accepts it on non-meta rows unconditionally — code permits what P13 forbids [Q-step-4] | Sound — the load-bearing witness for depth enforcement [B-C5] | **GO-WITH-AMENDMENT** (widen P13) **+ MUST BE BUILD** (meta-coupling / parent-existence check) |
| 5 | Appender-enforced depth limit | OWNED — structural unconstructibility is [A]'s strongest pattern | **No** — the appender reads no depth today; data on disk, unread [Q-step-5] | Sound — makes depth-2 unconstructible, not merely forbidden [B-C6] | **MUST BE BUILT** ("GO is too generous — it does not exist; it is buildable" [Q-step-5]) |
| 6 | Budget carve from spawning agent's `token_budget` | NOT owned for the claim it carries [A] | Not witnessed as a bound — declared target, no runtime enforcement [B-C9] | **Unsound as a safety mechanism** — declarative re-skin | **KILL** (kept only as declarative accounting) |

## The quarantine resolution (Russell vs Quine)

The two skeptics' dissents are about different objects and both survive: **quarantine
is a sound gate AND it is unbuilt.** Russell's test is reversibility — a gate must sit
before a still-reversible act [R-1]; quarantine relocates the gate to *consumption*
(nested output exists on disk but may not enter the parent's reasoning until a
recorded human affirmative), which is revocable by definition, so it passes his own
fix (ii). Quine's walk shows no enforcement surface exists for it today [Q-step-8] —
an argument that quarantine **must be built**, not that it is not a gate. The bottom
line therefore states both.

## Recommended design — minimal amendment set surviving both skeptics

1. **Quarantine-until-affirmative** (closes [R-1]) — chosen over a synchronous
   mid-flight human gate: both are sound, but quarantine defers the *irreversible* act
   (consumption) to after the affirmative without halting the parent mid-reasoning.
2. **Contentful-or-void grant** (closes [R-2], [R-4]) — the top-level confirm must
   enumerate the possible nested sheets (goals/angles), or the right to nest is void
   and the agent falls back to P11 [B-C13].
3. **Different-actor approver rule** (closes [R-3]) — amend P12: *no actor may approve
   a dispatch sheet it authored, at any depth.* Nested approver = parent strategist or
   human, never the nested author.
4. **The must-build appender list** (closes all [Q] witnesses) — until these ship, the
   design is adopted-on-paper, gated off in mechanism:
   `parent_dispatch_id` indexing + parent-existence check; meta-coupling or explicit
   P13 widening; 2-per-parent cap read from disk; depth check read from disk;
   quarantine consumption-block.

Constitutional touch-set: P2 + P12 (gate + approver), P13 (lineage), P11 (state the
escalation explicitly [B-C3]), §7 (re-confront P-SS-8, which nesting materially
aggravates [B-C10] — the count cap is a count brake, not a cost brake [B-C9]).

## Residue ledger

- **P-SS-8 aggravation (HIGH):** shipping the permissive steps without the must-build
  list reproduces the 1.67B-token unbounded fan-out wearing a legitimate parent label
  [Q]. Nested dispatch stays OFF until built.
- **Rollup tooling (MEDIUM):** nested `agents_spawned` roll-up is hand-done [Q-step-7].
- **Nested loop ceilings (MEDIUM):** named, not enforced [B-C14].
- **Mid-flight sheet authoring (LOW):** no live path for a working agent to author a
  sheet [Q-step-2].
- **Depth-2+ (OUT OF SCOPE):** excluded; re-opens every attack.

## Answer to the dispatch goal

**Admit depth-1 nested dispatch only as a paper-adopted design gated off in
mechanism — its sole sound gate is quarantine-until-human-affirmative-consumption
(not retroactive review), its grant must be contentful-or-void, its approver must
differ from its author at every depth, and it stays disabled until the appender is
built to index `parent_dispatch_id`, couple it to P13, and enforce the 2-cap, depth,
and quarantine checks; absent those builds it is the P-SS-8 unbounded fan-out wearing
a parent label.**

## Close record

`exit_reason: resolved` — the `final_approver` (parent; human gate behind it) accepted
after the P9 citation check (every load-bearing claim above cites a collected return
in `research.md`). `agents_spawned: {total: 6, tree: {investigate: 2, synthesize: 2,
evaluate: 2, helpers: 0}, loops_used: 1}` — one zig-zag revision loop used (ceiling 2);
the conditional feedback edge never fired (no feedback prompts). Known degradation:
[A] returned partial (P4 partial group result), reported to downstream groups and the
approver.
