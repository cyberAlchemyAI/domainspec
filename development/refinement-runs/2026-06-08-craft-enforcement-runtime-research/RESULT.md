# Refine Result — Craft Enforcement-Runtime & Compliance Research

- Run id: `2026-06-08-craft-enforcement-runtime-research`
- Status: **flag** (clear recommendation produced; two load-bearing residues — isolation is always delegated; the paid moat is gated on an EMERGING forcing function)
- Preset: standard · Research: bounded-research (external, confirmed) · Subagents: 3 (required, approved)
- Synthesized from the three research receipts.

## Verdict in one line

**Buy the gate, rent the isolation, keep the ledger.** The strongest enforcement chokepoint is **in-house Jenkins → sandcastle** (MIT, full control, integrate-not-invent); but the paid story does **not** rest on generic "AI-dev governance" — incumbents are commoditizing that — it rests on the one wedge incumbents can't serve: **vendor-neutral, cryptographically immutable, auditor-acceptable attestation across heterogeneous tools.**

## Enforcement-runtime recommendation (resolves R-CRAFT-1)

Separate the two concerns the research showed nobody bundles:

1. **Isolation layer (run AI code safely):** **sandcastle** (`mattpocock/sandcastle`) — mature (5.8k★, MIT), real Docker/Podman + Firecracker-microVM (via Vercel) execution, well-typed `run()` with a branch-before-merge seam. (E2B/Daytona/Fly are equivalent microVM fallbacks.) **Do not build a sandbox.**
2. **Gate layer (approve/block/meter/audit — the chokepoint):** **in-house Jenkins driving sandcastle.** Jenkins natively supplies exactly what sandcastle lacks — the pause-and-approve `input` step (the literal chokepoint before merge-to-head), RBAC + recorded approver identity, native run counting, and an approval audit trail. Effort is integration, not invention; cost is Jenkins ops weight.
3. **Craft's role:** the ledger **drives** the gate — Craft triggers the Jenkins job, the `input` step enforces approve/block, sandcastle executes inside the stage, and token/iteration/commit data flows back into the immutable ledger.

**Why not the others as the runtime:**

- **Tandem** (frumu-ai) — best _architectural_ analogue (runtime owns tools/approvals/audit) but no kernel isolation, attestation unshipped, and its governance engine is **BUSL-1.1** (the exact gate logic is license-restricted). Use as a design reference, not a dependency.
- **Paperclip** (paperclipai) — best _shipped_ enforcement primitives under clean **MIT** (approval gates, durable audit, hard-stop budget metering) but native isolation is an unmerged proposal. The strongest _buy_ alternative if you don't want to run Jenkins — adopt it as the control plane fronting a microVM sandbox.
- **Symphony** (openai) — an orchestration **spec**, "trusted environments only," gate only at PR boundary. A layer _above_ Craft, not the runtime.
- **Z7Lab/codex-sandbox** — too immature (1 week, 6 commits, Codex-only). Reference pattern only.

**Cross-cutting fact:** none of the six is a hardened sandbox out of the box — isolation is _always_ delegated to Firecracker-class providers. So the decision is two picks, not one: **gate layer** (Jenkins+sandcastle in-house, or Paperclip/Tandem control plane) × **isolation provider** (sandcastle/Vercel, E2B, Daytona, Fly).

## Compliance verdict (resolves R-CRAFT-2)

**EMERGING, leaning NO for a _standalone_ paid "AI-dev governance" product.**

- No regulation names AI-generated-code audit. EU AI Act Art. 12 logging is enforced but only for high-risk AI **systems** — using AI to write ordinary code is minimal/limited risk.
- The Gartner $1B governance budget is for governing **models in production (MLOps)**, not the dev workflow — adjacent, not on-target.
- **Incumbents already ship it as a feature:** GitHub AI Controls (agent audit logs, provenance, SIEM streaming), Jira audit trails, Microsoft's _free_ Agent Governance Toolkit. Generic governance is being commoditized.
- The **one real, hardening forcing function** is **SOC 2 / ITGC / SOX AS 2201** (FY ≥ Dec 2026) audit interpretation: auditors now require sampleable AI-code-change records + **immutable tamper-evident append-only logs**.

**The defensible paid wedge:** cross-tool, vendor-neutral, **cryptographically immutable, auditor-acceptable attestation** spanning multiple agents/IDEs/SCMs — which single-vendor GitHub-only logs can't satisfy for heterogeneous shops, and which is exactly what Craft's immutable ledger + a real enforcement chokepoint can emit. Bind it to the regulated vertical (Golden Quill) and to Lean attestation.

## How this updates the commercialization plan

- **R-CRAFT-1 closed:** the enforcement runtime is a _buy/integrate_, not a build — Jenkins+sandcastle (or Paperclip control plane) + a microVM provider. This is the muscle that turns Craft's advisory ledger into a real chokepoint and lets it **meter governed runs** (the R2 paid metric).
- **R-CRAFT-2 reframed:** don't sell "governance"; sell **auditor-grade vendor-neutral attestation** for mixed-tool, regulated shops — the only spot with board-level WTP that incumbents structurally can't own.
- **Sequence unchanged but sharpened:** (1) free Craft ledger + dogfood on spec→test; (2) add the Jenkins+sandcastle enforcement chokepoint and meter governed runs (the paid tier); (3) emit signed, immutable, cross-tool attestation as the moat, bound to Golden Quill.

## Stage evidence

Context Builder: pass · Invoke Define: pass · Interrogation refine-review: pass · Research decision: pass (bounded, confirmed) · Distill: pass · Invoke Redefine/Design: pass · Interrogation refine-design-review: flag · Distill Repair: flag · Invoke Plan: pass · Final Interrogation + Synthesis: flag

## Recommended next routes (not executed)

- **decision-gate** — commit the gate layer (Jenkins+sandcastle in-house vs Paperclip/Tandem control plane) and the isolation provider.
- **task-session** — spike: Jenkins `input`-step gate + sandcastle run, Craft ledger drives approve/block, emit a signed immutable attestation record.
- **refine** — design the vendor-neutral cryptographic attestation wedge (the paid moat) against the SOC 2/ITGC evidence requirements.
