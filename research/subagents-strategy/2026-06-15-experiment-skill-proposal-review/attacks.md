---
tags: [subagents-strategy, review, experiment-skill]
node_type: research
is_session: false
layer: ontology
nature: technical
status: draft
veracidade: high
convicção: medium
version: 0.1.0
last_updated: 2026-06-15
---

# attacks.md — review of the experiment-skill improvement proposal

Dispatch `2026-06-15-experiment-skill-proposal-review`. Three attackers (governance,
mechanics/implementability, ownership) attacked the strategist's 5-point + converse proposal
to improve `.claude/skills/experiment/SKILL.md` (derived by comparing it to the
knowledge-taxonomy experiment protocol). Verbatim returns below; cited change-requests in
`findings.md`.

> **Degradation note (P14):** `robot_talks` was declared on the attacker group, but the
> harness exposed no `SendMessage`, so no live inter-agent confront round ran. The
> cross-confrontation was performed at synthesis by the parent strategist, and an independent
> verifier (skeptic) refuted the findings. Only **initial** positions exist — disclosed in the
> close row.

## A1 — fidelity / governance (verbatim)

All three attacks HELD under the governance lens — the proposal survives **as an
artifact-scoped, version-bumped SKILL amendment**, NOT as a ledger change.

- (i) Mechanical verdict over gates does **not** smuggle back the deferred PASS/FLAG/BLOCK
  machinery: SKILL.md:107-108 defers a *cross-project vocabulary unification* (mapping our
  tokens onto execution-status), whereas claim #3 keeps SURVIVED/FALSIFIED/INVALID and the
  skill already has a mechanical verdict matrix (:74-81). HELD. MINOR residual: require gate
  `verdict_on_fail ∈ {FALSIFIED, INVALID}` only (never a pass/flag tier) so the no-mapping
  boundary is structural, not just asserted.
- (ii) A structured gates schema living as a `working_folder` **artifact** is categorically
  different from the killed `success_metric` **column** (§7:519): it is the designer's frozen
  output with a mandated downstream consumer (adjudicator + skeptic's non-discrimination gate),
  so a vacuous gate is *caught and ruled INVALID* (:72) — the opposite of `success_metric`,
  which nothing could catch. The constitution §7:586-595 AFFIRMS the criterion as
  "governance-grade … persisted off-registry, in working_folder", "Recorded without a
  row-schema change: no new column". HELD. MAJOR conditional: the attack converts to a real
  violation the instant the gates acquire a **row pointer** — a future registry pointer must be
  a *hash to the frozen file*, never the gate contents inlined as columns.
- (iii) Respects "never a ledger column" (:58) — adds no field/enum/conditional. HELD. MAJOR
  governance-process caveat: it still changes a load-bearing SKILL principle (criterion-freeze,
  :47-61), so it must be a **versioned SKILL amendment** per §10.1/§10.2, not an in-place prose
  tweak.

## A2 — mechanics / implementability (verbatim)

**Category error CONFIRMED. Claim #2 is NOT buildable as written, is redundant, and the system
already adjudicated this gap.**

- (i) CRITICAL — KT's `frozen_at` + git-diff + pre-commit hook all require a committed/staged
  file under git. The criterion artifact is persisted **off-registry in working_folder**
  (constitution §7:586-595); there is no committed blob to diff. Claim #2 is buildable only
  after an unstated larger decision (dispatch criteria must become committed git artifacts) —
  which is exactly the **OPEN, deferred** pointer+content-hash hardening option the constitution
  already booked (§7:592-595). Fix: reframe claim #2 as "adopt the already-OPEN §7 registry
  pointer + content-hash option", gated on the deferred trigger ("until use proves the gap
  bites").
- (ii) MAJOR — the KT-vs-skill comparison conflates a standalone-persisted-experiment layer
  (KT `E<N>/PROPOSAL.md`, a vault node) with an ephemeral multi-agent dispatch criterion (an
  in-flight working_folder output). Importing a file-level git-freeze onto a dispatch-level
  transient is apple-vs-orange. Fix: state the layer the criterion lives at before importing a
  mechanism designed for another layer.
- (iii) MAJOR — deterministic re-adjudication (SKILL.md:104-106) does **not** require git-freeze;
  topology + immutability + P2 re-gating-on-edit (:49-57) already deliver it. An edited criterion
  is *definitionally a new dispatch*, not a corrupted one. Claim #2 adds a verification
  convenience, not a capability. Fix: downgrade claim #2 to an explicitly optional, already-booked
  hardening.
- Concession: the *instinct* of claim #2 (machine-check immutability / restore ledger
  self-sufficiency for re-adjudication) is valid and already recognized as OPEN in §7:592-595 —
  the **direction** is endorsed; the **mechanism import** (KT git-frozen_at) and the **"needed
  now"** claim fail.

## A3 — ownership / reference-integrity (verbatim)

Both claims in this lens are **mis-filed**; the type-skill "defines no field" (:14).

- CRITICAL — Claim #1's gates schema is a FIELD definition wearing a recipe costume; belongs to
  constitution §5, not the skill. The skill enforces this on itself (:47-60, "never a schema
  field").
- CRITICAL — DANGLING CLAIM: a gates schema authored in the skill is enforced by no owner — the
  appender rejects unknown keys (exit 2), §5 doesn't define it. Fix: pick one home — (a) §5 field
  + appender validation via full §10.2 five-surface atomic promotion, or (b) keep it a
  working_folder artifact and have the skill say so (as it already does at :47-61).
- MAJOR — DOUBLE-OWNED: the gates duplicate the skeptic's validity axes already owned at
  :63-72. Don't add a parallel schema; at most tighten the prose.
- MAJOR — Claim #5's candidate-register triage tier is the **router's** Principle-1/P11 concern
  (:8-10 routes when/whether-to-dispatch upward), not the type-skill's. Relocate to
  `domainspec-subagents-strategy`.
- MAJOR — Claim #5's "Non-goals REQUIREMENT" is a sheet-design rule with no owner in the skill;
  relocate to register-dispatch's "not enforced by the appender" list or §5, or downgrade
  "REQUIREMENT" to authoring guidance.
- MINOR — any real field/enum version of claim #1 landing only in the skill re-opens §10.2
  atomic-promotion debt (five surfaces in one change set).
- What held: the existing criterion handling (:47-61) is correctly filed; the validity gates
  (:63-72) legitimately belong to the type-skill as its grader-differentiator. The three-document
  chain (router → type-skill → form) is clean today; both proposed edits would be its first
  breaches.
