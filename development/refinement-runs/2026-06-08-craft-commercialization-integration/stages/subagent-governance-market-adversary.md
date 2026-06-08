# Stage Receipt — Governance-Market Adversary (Interrogation / attack)

- Role: Governance-Market Adversary · agentId a1e2384f467516428 · verdict: **pass** (local reasoning; named gaps flagged)

## Differentiation (vs Linear/Jira/Notion/Graphite/Sweep/Devin/GitHub Projects)

Only **two** genuinely novel features:

- **Enforced blocker-refinement gate** (can't resolve a raw blocker until typed + lane + closure-criteria + owner) — novel as an _opinionated default_, but process-shaped; replicable as a Jira/Linear automation rule "in a sprint."
- **Residue-as-first-class** (translation loss as a typed, mandatory, recomposition-fed object) — the most novel concept, no incumbent reifies it; but currently _manual/candidate_, and a pain buyers lack vocabulary for = education cost, not moat.
  Everything else (recursive contexts, lanes, decisions-with-evidence, recomposition proof, routing) is table-stakes hierarchy/labeling/ADR/required-checks reskinned.

## Buyer + value metric

- Mismatch: the people who feel the residue/recomposition pain (senior engineers, agent operators) are **not** the budget holders. Budget holders buy governance under an audit/regulatory forcing function — and Craft has **no compliance mapping, no audit-export, no SOC2/EU-AI-Act framing**.
- No natural per-seat metric (governance benefits the org, not the seat). The only value-aligned metric — **governed agent runs** — can't be metered because Craft doesn't execute or observe runs (runtime deferred).

## Monetization vs portability (sharpest contradiction)

The asset is a **YAML+Markdown file in the repo** — great for adoption (no lock-in), terrible for monetization (schema + rules trivially forkable; no data gravity, no network effect, no proprietary execution). A portable open-format spec is the opposite of a moat. Every monetizable surface (hosted rollup, enforcement runtime, audit attestation, metering) is exactly what Craft has **deferred**.

## Named external gaps (research-if-gap triggers)

1. **AI-governance regulatory timeline** (EU AI Act / NIST AI RMF enforced audit of AI-written code) — the swing factor for "market vs feature."
2. Incumbent roadmaps (Linear/Jira/GitHub/Devin/Cursor shipping "AI work governance").
3. Demonstrated WTP for dev-process governance specifically.
4. Value-metric precedent ("per-governed-run").
5. Behavioral lock-in evidence from real teams.

## Verdict: **conditionally-paid, leaning FREE-INFRA in the default case**

As it exists today (portable file, manual residue, deferred automation, no runtime/enforcement/compliance/metering), Craft is **free dev infrastructure / open protocol**, not a paid moat — the moat layer is a TODO. Defensible paid product **only if all 5 hold**: (1) hosted control plane above the file, (2) enforcement at an execution chokepoint (merge/deploy/agent-run), (3) compliance forcing function + audit attestation, (4) meter governed runs not seats, (5) convert process discipline into behavioral lock-in. Gated chiefly by the unconfirmed compliance forcing function (gap 1).
