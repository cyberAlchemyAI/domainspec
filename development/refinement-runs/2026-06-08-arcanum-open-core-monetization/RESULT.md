# Refine Result — Arcanum Open-Core & Monetization Boundary

- Run id: `2026-06-08-arcanum-open-core-monetization`
- Status: **flag** (refined plan produced; the structural cut is sound, but the _commercial direction_ the owner proposed is inverted, and one load-bearing residue remains: engine defensibility R1)
- Preset: standard · Research: bounded-research (confirmed) · Subagents: 3 (required, approved)
- Synthesized from the three stage receipts, not from the proposal.

## The verdict in one line

**Your cut is right; your direction is backwards.** You _can_ cleanly ship domainspec to Arcanum without validators — but you should give the validators/audits away as the wedge and sell the thing you planned to give away (CyberAlchemy + Golden Quill).

## What was refined

"Add domainspec to arcanum without audits/validators, sell the audits/validators, find other products, attack the idea." The loop produced: a structural feasibility verdict, an evidence-backed attack on selling audits/validators, a ranked moat inventory, and a corrected free/paid boundary as a non-executed plan.

## Three convergent findings

1. **The cut is structurally clean and half pre-built (Boundary Cartographer).** domainspec and arcanum are separate submodules with zero code coupling. Validators attach by a registry side-effect import; don't import them → empty registry → spec→test pipeline runs untouched. The repo _already_ split governance mechanism from rules. So "domainspec free without validators" is feasible today.

2. **Selling audits/validators is NON-VIABLE as the primary line (Market Adversary).** 6 of 8 comparables (SonarQube, Semgrep, OPA, dbt, Snyk, Great Expectations) keep validators FREE and sell scale / governance / proprietary data / observability on top. The 2 that sell rule content (Chef, Semgrep Pro) sell _certification + currency_, not the checker. An open spec actively _invites_ substitute validators, collapsing your pricing power. "Sell audits" structurally devolves to a capped-margin services firm (you can't self-attest). Paywalling the validator throws away the adoption wedge every comparable relies on.

3. **Audits+validators rank dead last; the moat is what you'd give away (Moat Appraiser).** Composite scores: CyberAlchemy 4.3, Golden Quill 4.3, Lean validator 4.3, spec→test engine 3.0 (wedge), **audits+validators 1.7 (commodity)**. Your BSL-1.1 license already names "Cyber Alchemy AI" — you have _already implicitly commercialized the asset you planned to give away_.

## The attack on your idea (you asked me to attack it — here it is, hardened)

- **You'd sell the commodity and give away the moat.** Validators are ~500 LOC of linting + an LLM agent prompt — days-to-weeks to clone. The spec→test engine, promotion DAG, and ontology axes are the hard part.
- **The open spec is a knife pointed at your only revenue.** Publish the format → anyone writes free validators against it.
- **Weak value metric.** A pass/fail check anchors to commodity per-seat linter pricing; there's no usage metric that scales with customer value.
- **Open-core inversion.** Durable open-core gives away the engine and sells scale/governance/compliance. You proposed the reverse.
- **It caps you at a tooling-vendor sale** and signals "linter" to buyers, anchoring seat economics over the platform/consulting economics the repo can actually command.

## What survives the attack (the rescue, not a reversal)

Two validator-shaped things are genuinely sellable — but **not as "validators"**:

- **Lean machine-checked validator** → sell as _formal attestation/proof_ in regulated/safety-critical contexts (AdaCore/TrustInSoft pattern: services + qualification). Otherwise keep it as public **trust collateral**, not a SKU.
- **Audits bound to proprietary governance content** (constitution library, promotion-DAG rules) → the moat is the _encoded judgment + signature_, delivered through Golden Quill's regulated-grant vertical, not a generic checker.

## Recommended free/paid boundary (corrected open-core)

**FREE core → into Arcanum (adoption wedge):** spec authoring + spec→test pipeline; kernel governance mechanism (empty registry); code-tag _extraction_; reference backend modules; **the basic audits + validators** (yes — give them away); Arcanum sigils; Necronomicon.

**PAID (the high-margin tier you were about to give away):**

1. **Lead — CyberAlchemy paid engagement** (Assessment→Design→Pilot→Handoff), proofed by Golden Quill; hold the promotion-DAG + KPI taxonomy as the lock-in substrate.
2. **Golden Quill / Tilth** as the sovereign vertical product (regulated, attested output — the one place "sell the validated artifact" genuinely works).
3. **Hosted observability→reflection loop** (second expansion; depends on wedge adoption).
4. **Lean formal attestation** for regulated buyers (services-led).

## Two hard requirements before committing the paid lines

- **R1 (load-bearing residue):** the spec→test "engine" is currently a prompt-driven LLM-agent skill, **not** a deterministic compiler. If it stays a prompt wrapper it is as commoditized as the validators. Either make it formally deterministic (the Lean substrate is the lever) or re-anchor the paid engine line on the proprietary governance-data asset.
- **R2:** productize CyberAlchemy governance with a self-serve value metric, or it bleeds into the consulting trap (Styra DAS was sunset doing exactly this on a free engine).

## Stage evidence

- Context Builder baseline: pass · Invoke Define: pass · Interrogation refine-review: pass · Research decision: pass (bounded, confirmed) · Distill: pass · Invoke Redefine/Design: pass · Interrogation refine-design-review: flag (R1) · Distill Repair: flag (residue recorded) · Invoke Plan: pass · Final Interrogation + Synthesis: flag

## Recommended next routes (not executed here)

- **decision-gate** — commit the free/paid boundary (especially: validators free vs. paid) as a recorded decision.
- **task-session** — spike "Lean validator → formal attestation product" to test R1's deterministic-engine lever.
- **refine** — a focused pass on CyberAlchemy productization (R2) to escape the consulting trap.
