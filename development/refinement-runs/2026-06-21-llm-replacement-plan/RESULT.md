---
node_type: refinement-result
title: Refine Result — Backend-domain TEST-SPEC replacement plan
status: flag
created: 2026-06-21
owner: refine
run_id: 2026-06-21-llm-replacement-plan
---

# Refine Result — Plan for a backend-domain TEST-SPEC replacement

- **Status: FLAG** — the plan is sound and markedly more honest than the architecture it follows (scope-qualified throughout, no re-introduced C1–C4). It is **execution-ready after 6 deltas**, one of which is a load-bearing operator decision both reviewers fought over.
- Scope (operator-confirmed): replace the **backend-domain** TEST-SPEC slice only; UI/E2E Playwright + scaffolding stay with the LLM.
- Stage receipts: [design-lens](stages/stage-07-interrogation-design-lens.md) · [claim-skeptic](stages/stage-10-interrogation-claim-skeptic.md) · drafts: [contract-diff](stages/stage-06-design-contract-diff.md) · [plan](stages/stage-09-plan-workpack.md).

## The one decision that gates execution: format / obligation identity — ✅ DECIDED: Option C (2026-06-21)

> **Resolved.** Operator chose **Option C** — see [decisions/D1](decisions/D1-obligation-identity-option-c.md) for the projection-map format, allocation rule, and drift-check failure taxonomy. The pre-L0 gate is closed; L0 now owns the id-map + `check` path.

Both reviewers converged that this must be decided **before L0** (not at L4), and they split hard on it — the genuine tension:

- **Design-lens → Option A** (byte-compatible, stable human IDs `FEATURE-BE-OP-046` + committed ID-allocation map): adoptability is defined by what downstream consumers (story→test maps, code review, committed test filenames) don't have to change — all keyed on human IDs.
- **Claim-skeptic → Option A is a real-blocker**: insert-safe non-renumbering IDs are inherently stateful; that revokes the engine's load-bearing "byte-stable from docs alone, no persisted state" invariant (`keys/index.ts` = `sha1(anchor|type|params)`). A must not be a neutral menu item.

**Adjudication (parent / final_approver) — Option C, which neither proposed:**
Keep **sha1 content-addressing as the engine's internal source of truth** (δ→obligations stays a pure function of docs — invariant preserved), and emit human IDs as a **committed projection map** (`sha1_key → human_id`) layered _outside_ δ. New obligations get the next free human ID deterministically by sorted-sha1 order at emit; the **drift `check` mode** (see Delta 1) regenerates the map and fails closed on a dangling ID (sha1 gone) or an unmapped sha1.

This gives the design-lens its adoptable human IDs and satisfies the skeptic's invariant: the core stays pure-from-docs; the projection is input state (like bindings sidecars), explicitly bounded, and _guarded by the drift check_ rather than free-floating. **Recommendation: C.** It is only safe because the drift check exists — which is itself the highest-value missing piece below, so the two decisions reinforce.

## Required deltas before execution (severity-ordered)

| #     | Delta                                                                                                                                                                                                                                                                                                                                               | From                                                  | Severity |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | -------- |
| **1** | **Add the drift `check` SWU** (G2 part 2): re-derive, diff vs committed, fail on drift — distinct from `roundtrip`. The plan only had the provenance header (G2 part 1). This is the linchpin for both trust and Option C.                                                                                                                          | design-lens [adopt-critical] + R-ARCH-3               | blocker  |
| **2** | **Reframe the format decision** in SWU-11: record Option A as a _determinism-property change_, present Option C (recommended), move the decision **before L0**.                                                                                                                                                                                     | skeptic [real-blocker] + design-lens [adopt-critical] | blocker  |
| **3** | **Make the coexistence merge a contract**: engine block = fenced region replaced wholesale on re-derive; a fail-closed merge check rejects LLM rows overlapping the engine's derivable surface + the drift check flags dangling LLM→engine ID refs. (Closes the "engine wins / no LLM fabrication" honor-system gap.)                               | both                                                  | major    |
| **4** | **Relabel SWU-13 "migration proof" → "human-adjudicated migration diff"**: diffing the untrusted LLM artifact is circular; a divergence may be engine under-derivation. (Validation section already says this; headline contradicted it.)                                                                                                           | skeptic [real-flag]                                   | major    |
| **5** | **Fix the contract-diff (stage-06 §1) over-count**: mark Domain-Model + Traceability-Index rows as **L3-gated, not yet owned** (grammar parses no domain.md/rules.md). Same claim≤proof discipline as C1.                                                                                                                                           | skeptic [real-flag]                                   | major    |
| **6** | **Make SWU-4 `emit-tests` containment retrofit non-optional** (it's the _live_ G3 path into public arcanum, cli.ts:179) + note `needs-harness` tier is built in L2/SWU-8, so L1's gap section can't split harness from formal before then + self-derive (SWU-14) must use the path-arg branch (`featureDirFor` hardwires poker-team, cli.ts:26-29). | both                                                  | minor    |

## What held up (kept honest both ways)

- **Scope discipline:** every "replaces" is backend-domain-qualified — C1/C2/R-ARCH-2 remediation holds.
- **SWU-14 genuinely closes C4** (converts "can derive" → "has derived").
- **SWU-3 fail-closed + SWU-4 containment** correctly target G4/G3 and match exit-code conventions.
- **Layer ordering L0→L4 is right**; L3 (domain.md/rules.md grammar) correctly marked MVP-optional — L0–L2 already deliver operation-class replacement.

## Revised layer shape (after deltas)

- **Pre-L0 gate:** format/identity decision (recommend C).
- **L0:** `derive --out` (side-by-side `.engine.md`) + provenance header + **drift `check` mode** + fail-closed + emit_dir containment (both `derive` and `emit-tests`).
- **L1:** mechanical sections (coverage summary, completeness gate).
- **L2:** harness/formal tier split (G1) → enables Suite Partition + honest gap section.
- **L3 (MVP-optional):** domain.md + rules.md grammar → Domain-Model + Rules obligations + traceability index.
- **L4:** coexistence merge _contract_ + fail-closed boundary check + human-adjudicated migration diff + fixpoint (self-derive).

## Residue

- **R-1:** Option C needs a one-paragraph spec of the projection-map format + the drift-check's dangling/unmapped failure modes before L0 — it's the new load-bearing artifact.
- **R-2:** L3 is where the real coverage breadth lives; without it "backend-domain replacement" = operation-class only. Name that limit wherever the replacement is described.
- **R-3:** the migration diff is evidence, never proof — the only true acceptance is human row adjudication + the engine's own roundtrip classification.

## Recommended next route

`invoke plan` is effectively done (this is the plan). Next: **settle the Pre-L0 format/identity decision (recommend C)**, then `task-session` L0 SWU-1…drift-check as the first executable slice. Do not start L0 before the identity decision — per both reviewers it determines every layer's output format.
