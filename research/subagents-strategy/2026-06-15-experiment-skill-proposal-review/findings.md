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

# findings.md — verified change-requests on the experiment-skill proposal

Dispatch `2026-06-15-experiment-skill-proposal-review`. Attacks in `attacks.md`; every finding
below was refuted by an independent verifier against the literal artifacts (6 UPHELD, 1
DOWNGRADED, 0 dropped). The target under review is **the proposal**, not the skill — the
deliverable is a per-claim KEEP/FIX verdict on the proposal's recommendations.

## Per-claim verdicts

| # | proposal claim | evidence (verified) | severity | verdict | proposed fix |
|---|---|---|---|---|---|
| 1 | Add a structured criterion-**gates schema** to `experiment/SKILL.md` | `SKILL.md:14` "This skill defines no field"; appender rejects unknown keys exit 2 (register-dispatch); validity axes already at `:63-72` | CRITICAL | **FIX** | Don't add a schema *field* to the skill. Keep the criterion a `working_folder` **artifact** (as `:47-61` already does); if structure is wanted, it's artifact-authoring guidance the skill *points to*, not a fillable schema. A real field → constitution §5 + appender via §10.2 five-surface promotion. |
| 2 | Add **freeze-verification** via KT's `frozen_at` + git-diff | `PROTOCOL.md` requires a committed/staged git file; nothing commits `working_folder` to git; §7:586-595 already books a registry pointer+hash as **OPEN/deferred** | CRITICAL | **FIX (reframe)** | Category error as written. Reframe as "activate the already-OPEN §7 pointer + content-hash hardening," gated on its deferred trigger ("until use proves the gap bites"). Don't import KT's git mechanism onto an uncommitted artifact. |
| 3 | **Mechanical verdict** function, keeping SURVIVED/FALSIFIED/INVALID | `SKILL.md:107-108` defers only a *vocabulary mapping* onto pass/flag/block, not a mechanical function; verdict matrix already at `:74-81` | MINOR | **KEEP (narrow)** | Legitimate and does not breach Arcanum F1 — but lighter than claimed (the matrix is already mechanical-ish). Add only: gates must terminate in `{FALSIFIED, INVALID}`, never a pass/flag tier, so the no-mapping boundary is structural. Inherits #1's filing constraint (artifact, not field). |
| 4 | Promote **"both outcomes informative"** to a design-time gate | Maps onto the skeptic's existing **non-discrimination** axis at `SKILL.md:67-69` | MAJOR (filing) | **KEEP (relocate emphasis)** | Strongest-surviving kernel, but it already exists as the skeptic's axis. Don't add a parallel "gate"; strengthen the **designer's** criterion-authoring guidance so non-discrimination is caught at design time, not only by the skeptic after the fact. Not a new requirement field. |
| 5 | **Non-goals requirement** + **candidate-register** tier | `SKILL.md:8-10` routes when/whether-to-dispatch to the **router**; Non-goals is an unowned sheet-design rule in the skill | MAJOR | **FIX (relocate)** | Candidate-register → router (P1/P11 trigger). Non-goals → register-dispatch "not enforced by appender" list or §5; or downgrade "REQUIREMENT" to skill-level authoring guidance. Skill only *points*. |
| C | Converse: don't copy `veracidade`/`convicção` + lifecycle-vs-maturity; our INVALID + anti-bias role separation is ahead of KT | Not directly attacked; A1 corroborates INVALID as the anti-vacuity catch (`:72`) | — | **KEEP** | Sound and unchallenged. INVALID + skeptic≠runner≠designer (`:131`) is a genuine edge over KT, which folds validity into review-gated must-fix prose. |

## Verdict on the proposal

**FIX.** The proposal's *direction* is largely sound, but it (a) substantially **over-claimed
novelty** — the single biggest finding (F2, verified literally in §7:586-595) is that the
constitution **already adjudicated** the criterion as a governance-grade `working_folder`
artifact and **already booked** the registry pointer+hash as a deferred OPEN item; and (b)
**mis-filed** most of its concrete edits into the type-skill, which "defines no field"
(`:14`). The honest, correctly-filed residue is small.

## Change-request list (by severity)

1. **CRITICAL** — Drop "add a gates *schema* to the skill" (claim #1). Either cite the existing
   `working_folder`-artifact pattern (`:47-61`) and add only artifact-authoring guidance, or
   route a real field through constitution §5 + the §10.2 five-surface atomic promotion.
2. **CRITICAL** — Reframe claim #2 from "borrow KT's `frozen_at` git-diff" to "activate the
   already-OPEN §7 registry pointer + content-hash hardening," gated on its deferred trigger.
   Stop comparing the persisted-file layer (KT) with the ephemeral-dispatch layer.
3. **MAJOR** — Move claim #5's candidate-register to the router (P1/P11); move/own Non-goals at
   register-dispatch or §5, not as unenforced skill prose.
4. **MAJOR** — Reframe claim #4 as strengthening the **designer's** non-discrimination guidance
   (`:67-69`), not a new gate. This is the proposal's strongest kernel.
5. **MINOR** — Claim #3 is acceptable but redundant with the existing verdict matrix (`:74-81`);
   keep only the "gates terminate in FALSIFIED/INVALID, never pass/flag" tightening.
6. **KEEP** — The converse claims stand: don't import `veracidade`/`convicção`; our INVALID
   verdict + anti-bias role separation is a real edge.

## Bottom line for the strategist

The most valuable output of the original comparison is **not** "port KT machinery into the
skill." It is: (1) the constitution **already** holds the governance-grade-artifact decision
and the deferred pointer+hash hardening — cite §7 instead of reinventing it; (2) the only
genuinely new, correctly-filed improvements are small and mostly belong **elsewhere**
(router / register-dispatch / §5) or are **designer-artifact guidance** (non-discrimination at
design time). The proposal should be rewritten around those, and around closing the OPEN §7
item if `experiment` use proves the gap bites.
