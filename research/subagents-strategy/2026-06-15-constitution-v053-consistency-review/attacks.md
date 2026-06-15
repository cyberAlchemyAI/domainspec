---
tags: [agents, dispatch, review, attacks]
node_type: research
is_session: false
layer: meta
nature: technical
status: complete
version: 1.0.0
last_updated: 2026-06-15
---

# attacks.md — collected attacker + verifier returns (verbatim)

Dispatch `2026-06-15-constitution-v053-consistency-review` · review type · target:
`subagents-strategy-constitution-proposal.md` (v0.5.3-proposal). Attackers ran
`robot_talks` (round 1 parallel, round 2 confrontation). Initial AND final positions
recorded per P14.

## Attacker group — round 1 (initial positions, parallel)

### Tarski, Alfred — fidelity/governance
- TARSKI#1 (CRITICAL): §4 P5 (line 129) says the appender enforces BOTH group `anti_bias` (n≥2) AND `anti_bias_global`; §9 D2 (line 629) says SOLELY `anti_bias_global` is appender-enforced. Contradiction over which presence conditionals the appender enforces.
- TARSKI#2 (MAJOR): §7 v0.5.2 NEW-debt (line 568) calls registry "sole persistence surface for dispatch metadata" (unqualified, open) while §7 experiment block (591–592) narrows it to "row-schema metadata" with an off-registry exception — same premise stated open and discharged.
- TARSKI#3 (MAJOR): §10 (658–660) asserts experiment promotion left "§5's `working_folder` field stale"; §5 (line 231) already lists `experiment`.
- TARSKI#4 (MINOR): §8 still titled "v0.5.2 amendments" (line 595) while doc is v0.5.3-proposal (line 8).
- TARSKI#5 (MINOR): §5 (line 174) "Recorded without a version bump because the row schema is unchanged" conflates wire `schema_version` with document `version` that §10 (665–666) says must bump on LIVE-status change.
- Dissent (r1): contra YANOFSKY#? — the §4-vs-§9 enforcement-split conflict is a principle-vs-amendment contradiction, not a skeleton mechanics mismatch.

### Yanofsky, Noson — mechanics/correctness
- YANOFSKY#1 (MAJOR): `auditor ↔ meta-evaluate` map (§5 agents_spawned, line 429) vs experiment recipe (line 175) placing adjudicator as `evaluate`/`auditor` — auditor agent-role in an evaluate group contradicts the 1:1 map.
- YANOFSKY#2 (MAJOR): skeleton comment (line 440) "code|plan|suggestion FORECAST" vs "RESERVED"/"reserved names" everywhere else — a status token never defined in §5.
- YANOFSKY#3 (MINOR): §8 (line 599) "14 MAJOR confirmed" not reconstructable from the itemized fixes.
- YANOFSKY#4 (MINOR): skeleton feedback edge (line 506) instantiated unconditionally with loop_cap:1 vs §5 default 2; not marked conditional (contrast P3/P6 + dashed diagram).
- YANOFSKY#5 (MINOR): skeleton axis tokens "source corpus"/"attack vector" (spaces, lines 458/489) vs closed vocab "source-corpus"/"attack-vector" (hyphens, lines 125/291); a literal axis-test token check would miss.
- Dissent (r1): contra CHURCH#1 — the experiment SKILL.md pointer need not resolve on disk for an INTERNAL review.

### Church, Alonzo — reference-integrity
- CHURCH#1 (MAJOR): "(D6)" label for `token_budget` (§7 line 549) is dangling — no D6 decision exists; the reframe is labeled M4 in §8 (line 613).
- CHURCH#2 (MINOR): "C1" used for two referents — §8 (v0.5.1 assessment finding, line 604) vs §10 (experiment-promotion failure, line 660).
- CHURCH#3 (MINOR): the reserved status named four ways — "reserved names" (§2/§5), "FORECAST" (§6/§7), "RESERVED" (§7/§10).
- Pointers verified RESOLVING correctly: P12=single-gate; P9 citation rule; P2 frozen-sheet; anti_bias_global=free-text; schema_version-vs-document-version separation coherent; P-SS-8/9 + R25–R28 labels consistent; external-file claims internally coherent.
- Dissent (r1): contra YANOFSKY#? — the skeleton FORECAST comment is a terminology variant, not a substantive schema contradiction.

## Attacker group — round 2 (final positions, confrontation)

### Tarski, Alfred — final
- TARSKI#1 — CONFIRM, confidence raised. §5 field (228–229) names only `anti_bias_global` as appender-enforced, so two of three loci (§9 D2 + §5) agree against §4 P5 — P5 is the outlier defect.
- TARSKI#2 — CONFIRM.
- TARSKI#3 — **RETRACT.** §10 narrates a PAST cautionary failure to justify retiring the in-place practice; §5 now lists `experiment`. Retrospective remediation narrative, not a live contradiction.
- TARSKI#4 — CONFIRM (MINOR).
- TARSKI#5 — CONFIRM, scope-clarified: does NOT overlap CHURCH#3/YANOFSKY#2 (status-token issue); this is version-mechanics conflation.
- NEW **TARSKI#6 (MAJOR)**: §10's atomic-promotion rule (667–671) is retroactively self-violating — `review`/`experiment` were promoted with no doc-version bump and the skeleton still says "FORECAST"; combined with CHURCH#1 + YANOFSKY#2, the v0.5.3 hygiene clause was not applied to its own predecessor amendments.
- Dissent (r2): contra TARSKI#3 — §5's working_folder field is NOT stale; experiment is already a required condition.

### Yanofsky, Noson — final
- YANOFSKY#1 — CONFIRM (MAJOR), sharpened: a hard enum-pair violation a strategist copying the recipe would instantiate wrong.
- YANOFSKY#2 — CONFIRM (MAJOR); not subsumed by CHURCH#3 — it is the actionable fix-site (the copy-paste skeleton emits a non-vocabulary word). CHURCH#3 corroborates.
- YANOFSKY#3/#4/#5 — CONFIRM (MINOR).
- NEW **YANOFSKY#6 (MAJOR)**: the experiment "Role-set maps onto the existing enums (no new values)" (line 175) is **false under existing constraints** — an adjudicator typed `auditor` must be `meta-evaluate` per the 1:1 map (line 429), but `final_approver` (446–447) says a `meta-evaluate` approver is "never a member of any working group"; an adjudicator IS a working role. The role-set needs a new pairing or carve-out. Structural root beneath YANOFSKY#1.
- Dissent (r2): contra CHURCH#3 — the skeleton FORECAST token is a non-vocabulary status word at the copy-paste site, not merely a terminology variant.

### Church, Alonzo — final
- CHURCH#1 — CONFIRM (MAJOR). Verified: line 549 "(D6)", line 613 "M4", no D6 exists.
- CHURCH#2 — CONFIRM (MINOR), corroborated by §10 line 660 "the C1 failure".
- CHURCH#3 — CONFIRM (MINOR), corroborated by YANOFSKY#2; recommend merge (CHURCH#3 superset, YANOFSKY#2 the line-440 instance).
- Coherence verdict (schema_version vs document version is coherent) SURVIVES; TARSKI#5 endorsed as non-overlapping (it attacks §5 behavior, not the §10 definition). Both stand.
- NEW **CHURCH#6 (MAJOR boundary)**: §10 clause 2 requires promotion verified by green tests, yet §10 line 659 records the experiment promotion "left the test battery red" — converts TARSKI#1 into a live breach of the §10 atomic-promotion invariant (appender code vs constitution out of sync).
- Dissent (r2): contra TARSKI#5 — schema_version separation is internally coherent as a definition, not a conflation, at the §10 layer.

## Verifier group — zig-zag turn 1 (refutation of the CR draft)

### Russell, Bertrand — literal-text gate
- CR-1 CONFIRM · CR-2 CONFIRM · CR-3 REFUTE · CR-4 CONFIRM · CR-5 ADJUST(MINOR) · CR-6 CONFIRM · CR-7 REFUTE · CR-8 CONFIRM(MINOR) · CR-9 CONFIRM · CR-10 REFUTE · CR-11 REFUTE · CR-12 CONFIRM(MINOR).
- Dissent: contra GÖDEL#CR-10 — CR-10's "14 MAJOR not reconstructable" is unprovable by literal text (no conflicting count is printed at L599); if Gödel confirms via cross-section reconstruction, I reject it at the literal gate.

### Gödel, Kurt — reconciliation-elsewhere gate
- CR-1 CONFIRM · CR-2 REFUTE · CR-3 REFUTE · CR-4 REFUTE · CR-5 CONFIRM · CR-6 CONFIRM · CR-7 REFUTE · CR-8 ADJUST(trivial) · CR-9 CONFIRM · CR-10 REFUTE · CR-11 REFUTE · CR-12 CONFIRM.
- CR-2 refute: L175 explicitly assigns adjudicator group-role `evaluate` + agent-role `auditor`, overriding the default `auditor↔meta-evaluate` bucket map (429); the never-in-working-group rule binds `meta-evaluate`, not the `evaluate`/`auditor` adjudicator.
- CR-3 refute: §10 amnesty (676–677) "final amendment landed under the retired in-place practice" + "retires that practice" (660) scopes §10 prospectively.
- CR-4 refute: "The premise is therefore narrowed" (588) is explicit supersession separating row-schema metadata from the off-registry criterion artifact.
- CR-7 refute: §8 is the legitimately-scoped v0.5.2 historical record; §10 carries v0.5.3.
- CR-10 refute: §8 "Assessment fixes applied alongside:" introduces a partial list, never claims exhaustive itemization.
- CR-11 refute: §3 diagram "(conditional)" + §5 lines 324–328 explicitly mark the feedback edge conditional; the skeleton is an illustrative full example.
- Dissent: contra RUSSELL#CR-4 — Russell's literal gate reads 568 vs 591–592 as a flat contradiction; it is discharged by the explicit "premise is therefore narrowed" supersession (588).

## Parent adjudication of the split (zig-zag turn 2, final_approver)

- **CR-2 — SURVIVES, narrowed to MAJOR.** Gödel's refutation of the *structural* claim (YANOFSKY#6 "unconstructible / no new values is false") is ACCEPTED: the never-in-working-group rule binds the group-role `meta-evaluate`, and the experiment recipe assigns the adjudicator group-role `evaluate`, so no unconstructible role results. BUT the *surface* defect (YANOFSKY#1) stands: §5 line 429 states the `auditor ↔ meta-evaluate` map as a flat 1:1 with no "default/overridable" caveat, yet the experiment recipe places agent-role `auditor` in an `evaluate` group — leaving `agents_spawned` role-category bucketing of an experiment adjudicator genuinely ambiguous (its group is `evaluate`, its agent-role maps to `meta-evaluate`). Keep CR-2 as MAJOR, reframed to "the 1:1 map needs a default/override caveat, or experiment's adjudicator needs an explicit bucketing rule."
- **CR-4 — SURVIVES, downgraded to MINOR.** Gödel's supersession refutation is ACCEPTED — line 588 "the premise is therefore narrowed" does explicitly discharge the *live-contradiction* reading. Residual: line 568 (the v0.5.2 NEW-debt clause) still reads "sole persistence surface for dispatch metadata" unqualified and was not reconciled to the later narrowing — the exact accreting-drift §10 warns against. Downgrade MAJOR→MINOR.
- **CR-3, CR-7, CR-10, CR-11 — DROPPED** (both verifiers refute; claim ≤ proof).
- **CR-1, CR-6, CR-9, CR-12 — SURVIVE** (both verifiers confirm). **CR-5, CR-8 — SURVIVE as MINOR.**
