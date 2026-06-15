---
tags: [agents, dispatch, subagents, harvest, meta]
node_type: findings
is_session: false
layer: architecture
nature: [procedural, technical]
status: active
created: 2026-06-15
dispatch_id: 2026-06-15-field-usage-harvest
exit_reason: resolved
---

# findings.md — What to take from real field usage into the generic playbook

**Dispatch** `2026-06-15-field-usage-harvest` (research, meta). **final_approver:** parent.
Three miners read the field repo (`domainspec-lean-formalization`, ~61 real daily dispatches):
E1 appreciative, E2 friction, E3 ruleset-diff (verbatim in `research.md`). Two independent
reviewers attacked the candidate list: **Lakatos** (generality — is it math-overfit?) and
**Russell** (precedent — does the generic playbook already have it?). Russell read the actual
generic rules and **killed 5 of 14 candidates as already-covered** — the parent integrated his
precedent kills and Lakatos's generality fixes into the pruned harvest below. Claim ≤ proof.

> **One-line answer:** The field's genuine gift to the generic playbook is **two real features**
> (a liveness/relaunch invariant; wiring the parent's own bias to a logged prior) plus a handful
> of **naming/documentation clarifications** — *not* a big overhaul. The honest surprise: the
> generic playbook is **already lean exactly where the harvest assumed it was heavy** (it already
> doesn't mandate per-agent files; "verify-on-disk" is already law; the tension gate already
> passes trivially when there's nothing to tension; the `resolved` terminal already exists).

---

## A. Genuinely new + general + not already covered — SHIP

### A1. Liveness / completion invariant + `relaunch_of:` linkage  *(top pick)*
- **Field example:** `2026-06-15-residue-substantive-build` closed `error` — "Both build agents lost to a Claude Code process exit before writing any file… Re-launched #2 only"; the recovery is a *whole separate hand-authored* `…-substantive-build-retry` row (E2#4). Same shape on the Zulip build.
- **General?** Yes — any background fan-out can lose a child silently. *Non-math witness:* a background web-scraper agent dies mid market-scan; the invariant catches the missing artifact (Lakatos: general — process plumbing).
- **Already covered?** No (Russell confirmed): no liveness invariant exists; `parent_dispatch_id` is meta-lineage, `close_of` links close→dispatch — neither is relaunch→original.
- **Proposed change:** `register-dispatch` schema + router close-step: a parent-side "did each child emit its artifact?" check, and a typed `relaunch_of:` field so a retry is a *linked continuation*, not a fresh ledger row.

### A2. Wire the parent's own bias to a logged prior  *(top pick — strongest idea in the harvest, per both reviewers)*
- **Field example:** `2026-06-12-knowledge-accumulation-bet` — `anti_bias_global: "bettor's GO-bias (wager logged at p=0.99) vs the dispatch's pessimism — the dispatch exists to ATTACK the bet, not confirm it."` (E1#3).
- **General?** Yes — every team has a default-favored answer. *Non-math witness:* "I'm confident this contract is enforceable; this dispatch exists to find why it ISN'T" (Lakatos). **Fix (Lakatos, MAJOR):** name your prior and aim the dispatch *at* it, but **do not mandate a numeric `p`** — quantify only if your domain calibrates; a fake-precise 0.99 is theater. The repo's `/predict` Brier journal is *why* the numeral feels native here — that's the overfit signal.
- **Already covered?** No (Russell): `anti_bias_global` exists but is never tied to a prediction; `/predict` exists in the harness but is **not wired** into the dispatch constitution.
- **Proposed change:** constitution §5 + an optional `/predict` link: `anti_bias_global` may cite a logged prior (ordinal or, where calibrated, a wager id), with the framing "the owner believes X; the dispatch exists to attack X."

### A3. Inter-dispatch "dissent-as-next-charter" convention  *(narrow but real)*
- **Field example:** `nonterminal-generator-tower-design` close: "One unwitnessed crack recycled to explorer" → spawns `faithful-nonfull-ffresidue-probe` (E1#5).
- **General?** Yes — the one objection nobody resolved becomes the next investigation's charter (Lakatos: domain-blind).
- **Already covered?** *Partially* (Russell): `feedback` edges + `feedback_prompts` cover the **intra**-dispatch case; `meta`/`parent_dispatch_id` cover *planned* chaining. The genuine gap is the **inter-dispatch auto-seed** — an unresolved dissent at close becoming a named follow-up charter.
- **Proposed change:** a lightweight close-row convention: an `open_crack:` note that the next dispatch can adopt as its `goal` (no new machinery — rides the existing close row).

## B. Cheap clarity wins (documentation/naming, not new capability)

| # | Pattern | Field example | Status (Russell) | Change |
|---|---|---|---|---|
| B1 | **Name** a minimal default shape (1 explorer + 2 tensioned skeptics, parent-synthesized) | robot-talks audit resized a live dispatch 7→3 (E2#3) | pieces exist (`n=1` first-class, parent default approver) but no *named* minimal template | `research` SKILL: add the named minimal tier; full roster opt-in |
| B2 | **Name** "parent-enacted synthesis" as a sanctioned shape | writer+auditor "folded into parent for spend" routinely (E2#1) | substantially covered ("strategist may write findings.md"); only the *name* is missing | constitution §roles: bless it explicitly so it reads as sanctioned, not degraded |
| B3 | Mirror the `anti_bias` **axes** into the findings doc | field co-locates roster+anti_bias with findings (E3-D2) | roster-by-role already reported in findings; only the axes-mirror is new | `research` findings template: prepend the tension-design header |
| B4 | Robot-talks per-agent **4-part report** contract (Key Findings / Gaps / Local Tensions / Questions-for-Synthesis) | field robot-talks practice (E3-D6) | "decompose by concerns not files" is **already law** (review skill); only the 4-part report is new | `robot-talks` SKILL: add the report contract as the synthesizer's input shape |

## C. CONTESTED — owner decides (each reverses a deliberate generic choice)

- **C1 — Relax the two-agent tension gate for small sheets** (E3-D4/D5). The field self-checks tension inline; this very harvest's gate took **3 rounds / 6 infra agents** with **2 false-rejects from the checker misapplying its own rubric**. *But* Russell: the gate already scales by *presence* (trivial pass when no subject group), and relaxing a single-group `n≥2` sheet to parent-self-check **regresses** exactly where clone-bias hides. **Open question:** is the two-agent cost worth its false-reject rate, or is a one-agent self-check enough below a size threshold?
- **C2 — Restore a post-hoc false-consensus check** (E1#7 / E3-D3). General (Lakatos: auditing *path-independence*, not outcome-truth, generalizes). *But* the generic **deliberately retired** this 2026-06-15 (init-only). Russell: review's init-time zero-findings red flag already covers the concern. **Open question:** was the retirement because it was redundant, or despite the field's continued use?
- **C3 — Frozen-tool role stubs** (E3-D1). Lakatos: read-only-explorer / hostile-skeptic *posture* is general; **frozen tools are per-domain**. Russell: the constitution **deliberately cut** `tools`/`read_scope` (§7) — freezing them resurrects a removed field. **Verdict lean:** ship *posture* presets only, never a tool list.

## D. Dropped — already covered by the generic playbook (Russell, verified)

| Candidate | Why dropped |
|---|---|
| Per-agent provenance files opt-in (E2#2) | P9 two-file rule **already** = no per-agent files; the generic is already lean here |
| Verify-on-disk gate (E2#5) | **P8 trust-but-verify** is verify-on-disk verbatim, already distinct from skeptic gates |
| `adjudicated/resolved` exit terminal (E2#6) | `resolved` **already** the adjudicated terminal in the `exit_reason` vocabulary |
| Named orthogonal skeptic-gate catalogue (E1#1) | `research` skill already defines the gates as epistemic functions |
| Opposite-default-verdict steelman (E1#4) | already in tension design; *and* Lakatos: default-*reject* is itself a math-proof habit (you can't default-reject a market thesis) |
| Pre-registered collapse-test (E1#2) | Lakatos: math-overfit — leans on a binary checkable outcome most domains lack |
| Stable persona-pool / "fresh names for re-review" (E1#6) | E1 self-flagged likely cargo-cult; no capability gap |
| Loop_cap / multi-loop apparatus | E2: `loops_used>1` twice in 61 — **near-dead machinery**; flag for possible *removal*, not addition |

## E. Verdict matrix

| Candidate | general? (Lakatos) | already in generic? (Russell) | verdict |
|---|---|---|---|
| A1 liveness + `relaunch_of` | yes | no | **SHIP** |
| A2 bias→logged prior (ordinal, not mandatory `p`) | yes | no | **SHIP** |
| A3 inter-dispatch dissent-as-charter | yes | partial | **SHIP (narrow)** |
| B1–B4 naming/doc wins | yes | mostly covered | **CHEAP — do opportunistically** |
| C1 relax tension gate | yes | already scales by presence; relax = regress | **OWNER** |
| C2 post-hoc false-consensus | yes | retired 2026-06-15 | **OWNER** |
| C3 frozen-tool stubs | posture yes / tools no | §7 cut tools deliberately | **OWNER (posture-only)** |
| D (8 items) | mixed | yes / overfit | **DROP** |

## F. The meta-finding (the real lesson)

The single most useful output of this harvest is what the **independent precedent check** did to it: it cut the 14-item list to **~2 real features + 4 naming tweaks + 3 owner-decisions**, because the generic playbook is *already lean* where the harvest's intuition said it was bloated. The "ceremony is over-built" instinct is **half-true**: the two-agent tension gate's cost is real (we paid it live — 3 rounds, 2 false-rejects), but most of the rest the generic already handles minimally. So the field's lesson isn't "rip out ceremony" — it's **two concrete features the field earned in real use (recover from dead agents; aim a dispatch at your own bias), and a reminder to verify every "we should add X" against what's already there before building it.** This very dispatch is the example: an independent precedent pass turned a plausible 14-item overhaul into a truthful 2-feature one.
