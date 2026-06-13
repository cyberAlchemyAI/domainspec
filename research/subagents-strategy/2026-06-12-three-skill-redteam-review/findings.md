---
node_type: research
status: active
created: 2026-06-13
tags: [subagents-strategy, review, red-team, findings]
---

# Findings — three-skill red-team review (FINAL)

Dispatch `2026-06-12-three-skill-redteam-review` (`dispatch_type: review`). Red team over the
three-layer dispatch skill chain. Three attackers (Gödel = governance fidelity, Quine =
reference integrity, Abramsky = mechanics) with robot-talks → synthesizer (Noether) ↔ two
verifiers (Russell = refuter, Chalmers = gap-hunter) over a zig-zag, converged in 2 rounds.
Collected attacker/verifier returns: [`attacks.md`](./attacks.md). Authority: constitution
`subagents-strategy-constitution-proposal.md` (v0.5.2). `final_approver: parent` accepted.

Targets: `router` (`.claude/skills/domainspec-subagents-strategy/SKILL.md`),
`research` (`.claude/skills/research/SKILL.md`),
`review` (`.claude/skills/review/SKILL.md`),
`register-dispatch` (`SKILL.md` + `append-dispatch.cjs`).

**Outcome: no CRITICAL.** The round-1 CRITICAL was killed in review (two compatible layers,
not a contradiction). Four MAJORs survive — all on the two LIVE type skills' lifecycle and
coverage wording, none a broken mechanism. The router and appender are KEEP / KEEP-with-MINOR.

Severity: CRITICAL = breaks the system / corrupts a record / flatly contradicts law ·
MAJOR = functional gap / drift / doc-vs-code mismatch / load-bearing omission ·
MINOR = wording / stale / fuzzy.

---

## Surviving MAJOR change requests (4)

| # | file:line | evidence | fix |
|---|---|---|---|
| RS2⊕V3 | research/SKILL.md L70-72 | "Early stop … skip the remaining groups, close" names no `exit_reason` and no approver. When the auditor is the dedicated `final_approver` (a skipped `meta-evaluate` group), P12 forces approval to **fall back to `parent`**. | Rewrite: a confirmed kill closes `resolved` only after `parent` accepts the banked typed negative (P12 fallback, auditor group skipped); name the exit and the fallback. |
| V1 | review/SKILL.md L66 | "the coverage auditor (**or the `final_approver`**) fires this [zero-findings] flag" — P12 requires a dedicated approver to do "no other work"; firing the flag is substantive work. | Only the coverage auditor fires the flag; the `final_approver` checks the auditor fired it. Drop the "or the final_approver" branch. |
| V2 | review/SKILL.md L19, L57 | KEEP/FIX verdicts and the "`max_loops` re-run" are never mapped to any `exit_reason`; the skill never states how a review closes. | State a review closes `resolved` once the `final_approver` accepts the change-request list — FIX verdicts are deliverables, not non-resolution. |
| V5 | review/SKILL.md L48, L76 | Canonical shape has a `robot_talks` attacker group → synthesizer — exactly P14's collapse-detection trigger — but never restates P14 ("synthesizer downstream of a robot-talks group MUST receive each agent's initial AND final positions"). | Restate P14 for the attacker→synthesizer hop; both positions land in `working_folder`. |

---

## Per-artifact verdicts

- **router** — **KEEP.** Only MINORs: R1 (L28 P7 restatement omits the n=1 "returns its single output" carve-out, §5 P7); G7 (L18 drops "and registration" from the tiebreak, §3); Q4 (L54 anti-bias pointer lacks the "pending realignment / removed schema" caveat the constitution carries).
- **research** — **FIX.** One MAJOR (RS2⊕V3). MINORs: RS1 (L99 green-light per-pair evidence sentence narrowed to "explorer pair" vs §5 test4 "every pair"; mitigated — §5 test3 spread + L50 "tensioned by construction" still cover skeptic groups); G1/G2 (L35/L68 stale "runs last"/"after the reviewers" sequential phrasing vs amended P4); V7/Q11 (L34 "synthesizer alone in its group" asserts an n=1 cardinality the constitution shows only by example).
- **review** — **FIX.** Three MAJOR (V1, V2, V5) + two demoted-to-MINOR. V4 (L92 "read-only over the targets") → **MINOR** (verifier-ruled: research Standing Rule 4 is a *write*-confinement rule, the constitution has no read-only provision, so L92 is a reasonable write-confinement specialization, not law-minting — anchor it to SR4 as a shared invariant). V6 (L30/L61 one-way drop ratchet) → **MINOR** (verifier-ruled: the auditor's existing role-coverage mandate + zero-findings flag catch the egregious case; a per-finding wrong-drop check is a refinement — give the auditor explicit authority to flag a finding dropped on a refutation that doesn't hold).
- **register-dispatch (SKILL + appender)** — **KEEP-with-MINOR.** F1 (L113 run-command literal passes `$CLAUDE_PROJECT_DIR/…` while step 2 writes to `<repo-root>/…`; the round-1 "unset var → exit 2" claim was struck as false — appender L265 falls back `env || project_dir || cwd`; residual is a self-cured wording snag); A1/A2/A3 (appender does not validate `agents_spawned.tree` keys/values nor reconcile `total`; `feedback_prompts` omittable; `layers>1`-on-endpoint accepted — all three constitutionally gate-owned per the deliberate enforcement split, all mechanically checkable = hardening opportunities); Q9 (L31-34 miscites §7's removed table for legacy ledger-only keys); Q10/G11 (L209-211 loops_used/orphan-close labels).
- **constitution** — **KEEP.** Self-consistent on audited surfaces. C1: `invoked_by` is a tooling extension pending a one-line §5 amendment (already tracked in §9).

## Reserved-type gate (resolved, not a contradiction)

Round-1 raised a CRITICAL that the router ("refuse and tell the user" a reserved type) and the
appender ("records anyway", exit 0) contradict. **Struck:** they govern different acts — the
router refuses to *route/dispatch*; the appender is a forensic recorder that captures a
violation if one happened anyway (`register-dispatch` SKILL L50: "registering one signals an
upstream constitution violation"). Both verifiers settled here. Residual MINOR: there is **no
executable backstop** preventing a reserved type from being *dispatched* — only the router's
prose "refuse" — the same deliberate gate-owned/not-appender-enforced split as P12 and the P5
four-test. (`research` and `review` are the LIVE types as of 2026-06-12; `code`/`plan`/`suggestion`
reserved.)

## Confirmed non-findings (do not re-litigate)
Feedback-edge endpoint clause intact in every doc that restates it · full pointer sweep
resolves on disk (0 dangling; sibling-repo pointer correctly self-disclosed unverifiable) ·
`agent-pool.yaml` 245 names + ordered `role_fit` verified TRUE · no surviving "groups run
sequentially in declared order" anywhere (all run-sections carry the amended P4 dependency text).

## Change-request list (by severity)

**MAJOR (4):** RS2⊕V3 (research early-stop → name `resolved` + P12 parent-fallback) · V1 (review:
only the auditor fires the zero-findings flag) · V2 (review: define the `resolved` close) ·
V5 (review: restate P14 collapse-detection at the robot_talks attacker→synthesizer hop).

**MINOR:** V4 (review read-only → anchor to research SR4) · V6 (review: auditor authority to
flag wrongly-dropped findings) · RS1 (research green-light sentence to "every pair") ·
G1/G2 (research stale "runs last") · V7/Q11 (research/review "alone in its group" n=1) ·
R1 (router P7 n=1 carve-out) · G7/RS5 (router/research "and registration" tiebreak) ·
Q4 (router anti-bias stale-schema caveat) · F1 (register-dispatch command-literal path) ·
A1/A2/A3 (appender hardening: tree/total, feedback_prompts cross-row, layers-on-endpoint) ·
Q9 (register-dispatch §7-table miscitation) · Q10/G11 (loops_used / orphan-close labels) ·
reserved-type executable backstop · C1 (`invoked_by` §5 amendment).

## Convergence ledger
Killed/struck (verifier-ruled): X1 reserved-type CRITICAL (two compatible layers); RS4
(resolved+P9 = faithful composition); F1 "exit 2" claim (false vs appender L265).
Demoted MAJOR→MINOR: X2, A1, A2, A3, R1 (round 1, Russell); V4, V6 (round 2, Russell — parent-accepted).
Newly raised + verified MAJOR: RS2⊕V3, V1, V2, V5 (round 1-2, Chalmers).
Round-2 convergence: Chalmers OBJECTIONS=no; Russell OBJECTIONS=yes (two severity demotions only),
adjudicated by `parent` (final_approver) — exit `resolved`.
