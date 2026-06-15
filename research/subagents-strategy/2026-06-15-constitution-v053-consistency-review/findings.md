---
tags: [agents, dispatch, review, findings, consistency]
node_type: research
is_session: false
layer: meta
nature: technical
status: complete
version: 1.0.0
last_updated: 2026-06-15
---

# findings.md — internal-consistency review of subagents-strategy-constitution-proposal.md

**Dispatch:** `2026-06-15-constitution-v053-consistency-review` (review type)
**Target:** `subagents-strategy-constitution-proposal.md` @ v0.5.3-proposal
**Shape:** 3 attackers (robot_talks) → synthesizer → 2 verifiers (zig-zag) → parent adjudication
**Question:** Is the document internally consistent?
**Verdict: FIX — NOT internally consistent.** One CRITICAL contradiction + two MAJOR, plus five MINOR. Every defect is a localized prose/enum reconciliation; none requires re-deciding the design.

## Surviving findings (after verification)

| # | severity | section(s) | the inconsistency (evidence) | proposed fix |
|---|---|---|---|---|
| **CR-1** | **CRITICAL** | §4 P5 (129) vs §9 D2 (629) + §5 field (228–229) | P5 line 129: appender "enforces the presence conditionals (group `anti_bias` at n ≥ 2; `anti_bias_global` when ≥ 2 groups have n ≥ 2 — **both** exit 2)". §9 D2 line 629: "**solely** the `anti_bias_global` … presence conditional moves … to appender-enforced (exit 2)". §5 field (228–229) names only `anti_bias_global`. P5 is the outlier — a reader cannot tell whether the appender enforces group-level `anti_bias` presence. Both verifiers CONFIRM; no scoping clause reconciles "both" vs "solely". | Pick one. Recommend aligning §9 D2 + §5 to P5 (group `anti_bias` IS appender-enforced) — or strike the group-level clause from P5 line 129 if global-only is intended. |
| **CR-2** | **MAJOR** | §5 experiment recipe (175) vs §5 role map (429) | Line 429 states `auditor ↔ meta-evaluate` as a flat 1:1 map (used to key the `agents_spawned` tree); line 175's experiment recipe places agent-role `auditor` in an `evaluate` group ("adjudicator (`evaluate`/`auditor`…)"). Bucketing an experiment adjudicator is ambiguous (group=`evaluate`, agent-role→`meta-evaluate`). *(The stronger "no new values is false / unconstructible role" framing was REFUTED in verification — the never-in-working-group rule binds the group-role `meta-evaluate`, which the recipe does not assign.)* | Mark the §5 line 429 map as a **default** that a `dispatch_type` may override, or give experiment an explicit `agents_spawned` bucketing rule. |
| **CR-6** | **MAJOR** | §7 (549) vs §8 (613) | Line 549 attributes the mandatory `token_budget` to decision "**(D6)**"; the §8 fix-list (613) attributes the same token_budget reframe to "**M4**". No "D6" decision exists anywhere (§8 = T1–T5 + M-numbers; §9 = D1–D2). A reader following "(D6)" hits nothing. Both verifiers CONFIRM. | Repoint "(D6)" → "(M4)". |
| CR-4 | MINOR | §7 (568) vs §7 experiment block (588–592) | Line 568 (v0.5.2 NEW-debt) reads "the registry is still the **sole persistence surface for dispatch metadata**" unqualified; the later experiment block (588) "narrows" it to "**row-schema** dispatch metadata" with the criterion off-registry. *(Downgraded from MAJOR: line 588 "the premise is therefore narrowed" is explicit supersession, so it is not a live contradiction — but line 568 was never reconciled to the narrowing.)* | Restate line 568 to "sole persistence surface for *row-schema* metadata" so the two §7 clauses agree. |
| CR-5 | MINOR | §6 skeleton (440) vs §5 (173) / §10 (667) | One not-yet-LIVE status named three ways: "reserved names" (§5 173), "**FORECAST**" (skeleton comment 440, §7 571), "RESERVED" (§10 667). "FORECAST" is a non-vocabulary token at the copy-paste skeleton site. Both verifiers confirm no clause defines FORECAST ≡ RESERVED. | Use one token (recommend `RESERVED`); fix skeleton line 440 first. |
| CR-8 | MINOR | §5 (174) vs §10 (662–666) | Line 174: `review` "Recorded without a version bump because the row schema is unchanged" — cites the *row schema* (wire `schema_version` axis) to excuse a *document* `version` decision that §10 (662) now says a LIVE-status change must bump. The §10 amnesty covers the past act, not the mis-stated rationale. | Clarify 174: row schema unchanged → no `schema_version` bump, but a LIVE-status change DOES require a doc `version` bump (§10). |
| CR-9 | MINOR | §8 (604) vs §10 (660) | "**C1**" labels two different incidents: §8 = the v0.5.1 literal self-contradiction; §10 = the 2026-06-14 experiment-promotion failure (stale field / red tests). No disambiguation. Both verifiers CONFIRM. | Rename the §10 occurrence (e.g. "the v0.5.3 C1 failure"). |
| CR-12 | MINOR | §6 skeleton (458, 489) vs §4/§5 closed vocab (125, 291) | Skeleton axis tokens are spaced — "source corpus", "attack vector" — while the closed axis vocabulary is hyphenated: `source-corpus`, `attack-vector`. A literal axis-test token check (P5 test 1) would not match. Both verifiers CONFIRM. | Hyphenate the skeleton axis tokens. |

## Refuted / dropped in verification (claim ≤ proof)

| dropped | why |
|---|---|
| CR-3 (was MAJOR: §10 atomic-promotion self-violated) | Both verifiers REFUTE — §10 (660, 676–677) "retires that practice" + "final amendment landed under the retired in-place practice" scopes §10 prospectively; the red-tests/no-bump history is the diagnosed past defect, not a live breach. |
| CR-7 (was MINOR: §8 heading "v0.5.2" in a v0.5.3 doc) | Both REFUTE — §8 is the legitimately-scoped v0.5.2 historical record; §10 carries v0.5.3. |
| CR-10 (was MINOR: §8 "14 MAJOR" count) | Both REFUTE — §8 "Assessment fixes applied alongside:" is a partial list; no exhaustiveness is claimed, so no count contradiction arises. |
| CR-11 (was MINOR: skeleton feedback edge not conditional) | Both REFUTE — §3 diagram "(conditional)" + §5 (324–328) explicitly mark the feedback edge conditional; the skeleton is an illustrative full example. |
| TARSKI#3 (was MAJOR: §5 working_folder "stale") | Self-retracted in robot_talks — §10's "stale" is past-tense remediation narrative; §5 already lists `experiment`. (Collapse-check: evidence-based, not social — Tarski *raised* confidence on CR-1 in the same round.) |

## Bottom line

The document is **not internally consistent**, but it is close and the gaps are mechanical, not conceptual. The single load-bearing defect is **CR-1**: §4 P5 and §9 D2 / §5 give the *appender's enforcement contract* two different scopes — directly consequential because the appender is code that must enforce exactly one of them. The two MAJORs (**CR-2** experiment role-map ambiguity, **CR-6** dangling "(D6)") and five MINORs are accreted-amendment drift — precisely the failure mode §10 was written to stop, which the doc has not yet fully swept from its own back-sections. Fix CR-1 first (it is a real fork in the law); the rest are find-and-replace reconciliations.

A notable structural observation surfaced by the panel: §10's own amendment-hygiene rule postdates and would have caught much of this drift — the doc diagnoses its disease in §10 but the cure has not been applied retroactively (legitimately, per the §10 prospective amnesty — which is why CR-3 was dropped).
