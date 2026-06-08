---
tags: [monetization, open-core, arcanum, cyberalchemy, golden-quill, handoff]
node_type: implementation-plan
is_session: false
layer: market, application
nature: procedural, reference
status: active
version: 0.1.0
last_updated: 2026-06-08
---

# Handoff — Arcanum Open-Core & Monetization Boundary

- Observed capability: `invoke`
- Invoke mode: `handoff`
- Source run: `implementation/domainspec/development/refinement-runs/2026-06-08-arcanum-open-core-monetization/`
- Source artifacts: `RESULT.md` (verdict **flag**), `RUN-MANIFEST.md`, `evidence-index.json`, `stages/subagent-{boundary-cartographer,market-adversary,moat-appraiser}.md`
- Handoff type: lifecycle decision + execution continuation (refine → decision-gate → task-session/refine)
- Context coverage: obligation-linked to the three subagent receipts and the final synthesis; not a whole-session transcript.

## Decision carried (1): the open-core free/paid boundary

**FREE core → into Arcanum (adoption wedge):**

- Spec authoring + spec→test pipeline; kernel governance mechanism (empty registry); code-tag **extraction**; reference backend modules; init/scope/glossary scaffolding.
- **Audits + validators ship FREE** — they are the wedge, not the product. (Structurally clean to cut per Boundary Cartographer; the kernel already separates mechanism from rules.)

**PAID (the moat — what the original plan would have given away):**

1. **CyberAlchemy** paid engagement (Assessment→Design→Pilot→Handoff); hold the promotion-DAG + KPI taxonomy as the lock-in substrate.
2. **Golden Quill / Tilth** sovereign grant vertical — the one place "sell the validated/attested output" genuinely works.
3. **Hosted observability→reflection loop** (second expansion; depends on wedge adoption).
4. **Lean formal attestation** for regulated buyers (services-led).

## Decision carried (2): adversarial verdict

Selling audits+validators as the **primary** line is **NON-VIABLE**. 6 of 8 market comparables (SonarQube, Semgrep, OPA, dbt, Snyk, Great Expectations) keep validators FREE and monetize scale/governance/data/observability on top. An open spec invites substitute validators; "sell audits" collapses to a capped-margin services firm (you cannot self-attest). Audits+validators rank dead-last commodity (composite 1.7). **Keep them free.**

## Load-bearing requirements carried (3)

- **R1 (blocking the paid-engine line):** the spec→test "engine" is currently a prompt-driven LLM-agent skill, **not** a deterministic compiler. Until it is proven formally deterministic (the Lean substrate is the lever) or the paid line is re-anchored on the proprietary governance-data asset, it is a wedge, not a moat.
- **R2:** productize CyberAlchemy governance with a self-serve value metric, or it bleeds into the consulting trap (Styra DAS was sunset doing exactly this on a free engine).

## Next routes (4)

| Route                           | Owner capability | Purpose                                                                                         | Blocking input                                                 |
| ------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Commit the boundary**         | `decision-gate`  | Persist the free/paid split (esp. validators FREE vs. paid) as a recorded, governed decision    | RESULT.md boundary section                                     |
| **Lean → attestation spike**    | `task-session`   | Test R1's deterministic-engine lever: can the Lean validator back a formal-attestation product? | `internal_tools/lean-code-validator/` (P1/P5 live; P3/P4 stub) |
| **CyberAlchemy productization** | `refine`         | Resolve R2: turn the consulting offer into a self-serve product surface with a value metric     | `projects/ontologize/PRODUCT.md`, promotion-DAG content        |

## Provenance

- Target artifact: Arcanum open-core monetization boundary (product/commercial), owner = portfolio strategy cycle.
- Invoke-specific gaps: none (authoring complete).
- Target-artifact gaps: R1 unresolved (engine determinism), R2 unresolved (governance productization) — both routed above.
- Recommended first route: `decision-gate` (cheapest, unblocks the rest).
