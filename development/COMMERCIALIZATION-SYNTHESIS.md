---
tags:
  [
    commercialization,
    open-core,
    arcanum,
    craft,
    cyberalchemy,
    golden-quill,
    attestation,
    synthesis,
  ]
node_type: discovery
is_session: false
layer: market, application
nature: explanatory, reference
status: exploratory
version: 0.2.0
last_updated: 2026-06-08
---

# Commercialization Synthesis (Consolidated)

Consolidates four refinement runs into one coherent commercialization position and a single open-decision agenda. This artifact **references** the run RESULTs; it does not copy or redefine them. It is a discovery-level synthesis meant to be hardened by `decision-gate` and further `refine` passes.

## Source runs (provenance)

1. **Open-core boundary** — `refinement-runs/2026-06-08-arcanum-open-core-monetization/RESULT.md` (flag)
2. **Craft integration** — `refinement-runs/2026-06-08-craft-commercialization-integration/RESULT.md` (flag)
3. **Enforcement runtime + compliance** — `refinement-runs/2026-06-08-craft-enforcement-runtime-research/RESULT.md` (flag)
4. **Intent-bug human-review wedge** — `refinement-runs/2026-06-08-intent-bugs-human-review-wedge/RESULT.md` (flag)

## 1. The unified thesis

**Open-core, the right way around: give away the wedge, sell the trust.** Across all four runs the same shape recurs — the freely-cloneable mechanism is the adoption wedge; the defensible, board-level-WTP asset is _governed, legible, immutable, auditor-acceptable attestation_ over how AI-driven work was produced and reviewed. The owner's original instinct (sell audits/validators, give away the rest) is **inverted**: validators are the commodity wedge; the engine + governance + attestation + vertical are the moat.

## 2. Free wedge (drives adoption — do NOT sell)

- Spec→test derivation, taxonomy/relationships, code-tag **extraction**, validators/audits, Arcanum sigils, Necronomicon — _(run 1)_.
- The **Craft ledger** (schema, type/lane system, blocker-refinement discipline) — structurally open-core, "right way around" _(run 2)_.
- The **intent tools** (interrogation, decision-gate, definitions-governance, alignment audit) — _(run 4)_.
- **Wedge value, stated honestly (run 4):** the free tools do **not reduce** human intent review — they **relocate** it upstream (code-diff → spec/definition) and **make it cheaper, unskippable, and legible**. "AI makes intent review _more_ necessary; we make the review you can't skip 10× cheaper, impossible to skip silently, and fully auditable."

## 3. Paid moat (board-level WTP)

- **CyberAlchemy** governance engagement (promotion DAG + KPI taxonomy) — lead, proofed by Golden Quill _(run 1)_.
- **Craft's deferred automation as the paid meter** — role-delegation, scoring, generated index, hosted reflection; bill on governed-context/refined-blocker/recomposition throughput, not seats _(run 2, the R2 answer)_.
- **Golden Quill / Tilth** sovereign vertical — the one place "sell the attested artifact" works _(runs 1–3)_.
- **The single sharpest paid wedge (run 3):** cross-tool, vendor-neutral, **cryptographically immutable, auditor-acceptable attestation** spanning heterogeneous agents/IDEs/SCMs — what single-vendor GitHub logs can't satisfy, and what SOC 2 / ITGC auditors now demand. Lean = the formal-proof half.
- **Convergence (run 4 ↔ run 3):** "make intent review legible" and "sell auditor-grade attestation" are the same sentence at two altitudes — the free tools generate the audit exhaust the paid tier signs over.

## 4. Enforcement architecture (run 3)

**Buy the gate, rent the isolation, keep the ledger** — two picks, not one:

- **Isolation:** sandcastle (mattpocock, MIT, mature) or E2B/Daytona/Fly microVMs. Do not build a sandbox.
- **Gate (chokepoint):** in-house **Jenkins → sandcastle** (native approve/block/meter/audit), or Paperclip (MIT control plane). Tandem = design reference (BUSL core); Symphony = layer above, not the runtime.
- **Craft's role:** the ledger drives the gate (trigger job → `input`-step approve/block → execute → receipts back to the immutable ledger). This is the muscle that turns Craft from advisory into a real chokepoint and lets it **meter governed runs** (the paid metric).

### 4a. Compliance context — why the attestation wedge exists (refresh: session 2026-06-08)

The forcing function is three **existing** audit/control regimes (none names AI, but their auditors now demand a trustworthy AI-code-change trail):

- **SOC 2** (AICPA attestation) — _not a law_, a market requirement; enterprises won't buy SaaS without the report. Auditors now sample AI-generated changes.
- **ITGC** (IT General Controls) — the **change-management** control is the AI-code one: an agent commit must be reviewed/approved/traceable or the control _fails_.
- **SOX AS 2201** (PCAOB audit standard for ICFR; public companies; amended provisions effective FY ≥ Dec 2026) — if AI writes code touching financial systems, its change-controls fall under SOX scrutiny.
- **How they stack:** SOX → tested via AS 2201 → tests **ITGCs** (change mgmt) ← SOC 2 relies on the same controls → all converge on _"who/what changed this, was it reviewed, is the record immutable & tamper-evident?"_
- **Why it's the wedge:** these create budget-backed demand; real shops run _many_ tools, so a single-vendor log (GitHub's) doesn't cover the estate → **vendor-neutral, immutable, cross-tool attestation** is the gap (sharpens R-RT-2).

## 5. Consolidated residue ledger (open requirements)

| ID            | Requirement                                                                                                                                                  | Status                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| **R1**        | Spec→test "engine" is LLM-driven, not a deterministic compiler → re-anchor paid line on the governance-data asset, or make it formal (Lean lever)            | open                                               |
| **R2**        | Productize CyberAlchemy governance with a self-serve value metric                                                                                            | Craft = partial lever; metric/enforcement deferred |
| **R-CRAFT-1** | Every monetizable Craft surface (control plane, enforcement, attestation, metering) is deferred/unbuilt                                                      | open                                               |
| **R-RT-1**    | Isolation always delegated to microVM providers; pick gate and isolation separately                                                                          | resolved-as-design                                 |
| **R-RT-2**    | AI-dev-governance forcing function is EMERGING (SOC2/ITGC, FY≥Dec 2026), not statutory; incumbents commoditizing generic governance                          | open/external                                      |
| **R-IB-1**    | Never market "reduces human review" — market "relocate + legibilize"                                                                                         | **mandatory framing**                              |
| **R-IB-2**    | Humans must own the spec/definition ground truth; gates must ADD friction at intent-critical points (else circularity + automation bias worsen escaped bugs) | **mandatory design constraint**                    |
| **R-IB-3**    | No evidence these specific tools cut escaped intent bugs — instrument it                                                                                     | open/measurement                                   |

## 6. Open-decision agenda (for refinement / decision-gate)

1. **Commit the free/paid boundary** — validators/audits FREE; engine+governance+attestation+vertical PAID. (decision-gate)
2. **Enforcement build-vs-buy** — Jenkins+sandcastle in-house vs Paperclip control plane; + isolation provider. (decision-gate)
3. **Lock the wedge framing + design constraint** — "relocate + legibilize, not reduce" (R-IB-1) and "human owns spec ground truth / gates add friction" (R-IB-2) as a product requirement. (decision-gate)
4. **R2 productization** — fund Craft's deferred automation as the paid meter. (refine → task-session)
5. **Close the measurement gap** — instrument escaped-intent-bug + review-time on the spec→test pipeline (R-IB-3); also generates Craft promotion evidence + the R1 governance-data asset. (task-session)
6. **Attestation moat design** — the vendor-neutral cryptographic attestation wedge against SOC 2/ITGC requirements; bind to Golden Quill + Lean. (refine)

## 7. Go-to-market: fractional-CTO entry (refresh: session 2026-06-08)

The portfolio is entered as **services, not products** — most of the moat (Craft automation, enforcement runtime, attestation product, Arcanum licensing) is deferred/unbuilt, so selling it would be vaporware.

- **Positioning / niche:** "**I make AI-accelerated engineering trustworthy.**" Install a governed AI-dev process — relocate intent review to the spec, make it cheaper, unskippable, and auditable. Scarce, timely, ownable; not the generic "I'll run your eng team."
- **Lead offer:** AI-dev governance install — a fixed **2–4 week "AI-dev readiness" sprint** → converts to a fractional retainer.
- **Secondary offers:** fractional "lead the build" using the spec→test method; **AI / SOC 2 audit-readiness** for AI-written code (ties to §4a).
- **Private leverage, not line items:** DomainSpec/Arcanum let you deliver faster than competitors — kept private.
- **Golden Quill constraint:** **excluded from the generic pitch/portfolio.** Used only with a specific client who already knows it (see §8).
- **Credibility without a flagship logo:** a public reproducible **demo** (governed loop catching an intent bug) + a **teardown essay** + the first 1–2 engagements as written case studies.

## 8. First concrete engagement: governed agentic SDLC (refresh: session 2026-06-08)

**Warm first client** — acquiring a Golden Quill, and wants a **governed agentic system embedded in his development lifecycle.** This is the first portfolio engagement, and it exercises every layer the four runs designed.

- **What it is:** a _governed_ agentic SDLC — agents do the work wrapped in discipline that keeps intent human-owned and review legible/unskippable. (Raw agents at scale = intent bugs at scale.)
- **Deliverable architecture (assemble, don't invent):** orchestration (Symphony-pattern) + **isolation** (sandcastle/E2B) + **gate/chokepoint** (Jenkins `input` or control plane) + **spec→test** (DomainSpec) + **governance ledger** (Craft) + **intent-review discipline** (run 4).
- **Scope discipline (critical — don't boil the ocean):** Phase 0 (map his SDLC, pick **one** workflow, define "done correctly") → Phase 1 MVP (spec → agent implements in sandbox → derived tests → alignment audit → **human gate** → merge → ledger entry) → Phase 2 (widen + meter governed runs + attestation trail).
- **Non-negotiable design constraint (R-IB-2, sell as a feature):** the **human owns the spec/intent ground truth**; gates **add friction** at intent-critical points. If agents author _and_ approve their own intent, circularity + automation bias make his bugs worse.
- **Why governance is in-scope, not an upsell:** if he's public (SOX) or sells enterprise (SOC 2), an agentic SDLC _without_ a change-control/attestation trail (§4a) **breaks his audit**.
- **Portfolio payoff:** this paid engagement is the first case study and the repeatable lead offer — no Golden Quill reference needed.

## 9. One-paragraph position

Arcanum/DomainSpec is an open-core trust platform for AI-driven software. The free tools win adoption by making the irreducible, growing burden of _intent review_ cheaper, unskippable, and legible — not by pretending to remove the human. That legible trail of intent decisions and governed runs, gated through a real enforcement chokepoint and sealed as vendor-neutral immutable attestation, is the paid moat — the thing single-vendor incumbents structurally can't ship for heterogeneous, regulated shops, and the thing SOC 2/ITGC auditors are starting to require. CyberAlchemy and Golden Quill are the proof; Craft is the surface; the enforcement runtime is the muscle; Lean is the proof half.
