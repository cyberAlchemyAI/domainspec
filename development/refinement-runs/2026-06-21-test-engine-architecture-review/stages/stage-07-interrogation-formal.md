---
stage: interrogation
lens: formal-model
mode: refine-design-review
verdict: flag
owner: interrogation
created: 2026-06-21
---

# Stage receipt — Formal-model reviewer

Target: `LIFECYCLE-ARCHITECTURE.md` §1 (formal model) cross-checked vs `src/rules/`, `src/formal/`, `src/roundtrip/`, the SMT/FOL tower decidability map.

## Findings

- **F1 (BLOCKER): the harness/effect (Reason-B) obligation tier is absent.** §1 presents `emit : Obligation[] → TestSpec | RunnableTests` as if every obligation becomes a runnable test. In the code, only the AST-evaluable subset bodies assertions; contract/event/transition/workflow/query/mapping obligations emit `it.skip` skeletons (E3: 11 active / 56–57 skip). The formal model needs a **3-tier** codomain: `derivable-pure` (runnable assertion) / `derivable-needs-harness` (skip until a runtime/effect harness exists, Reason-B) / `needs_formal` (Reason-A, outside the decidable fence). Lumping harness gaps with formal gaps corrupts the metric.
- **F2 (major): the metric is named, not defined.** "dual of soundness + honesty" is a slogan. Give a number: `formalization(feature) = derivable_pure / (derivable_pure + needs_formal)`, reported separately from the harness tier. The mutation-survivor lens is a _second, different_ axis (under-formalization) — keep them distinct.
- **F3 (minor): INV-1 (injectivity) is overstated.** The raw `obligation_key` is injective, but the roundtrip semantic-identity layer is deliberately many-to-one (error→`error:<op>`, postcondition→`post:<owner>`). Restate as "injective on raw keys; many-to-one at the semantic fold, bounded by category cardinality" and make that bound a checked invariant.
- **F4 (minor): INV-3 falsifiability is presence-based.** The op-bucket drift-absolution lets one extra obligation absolve many genuine misses — should be cardinality-bounded.
- **F5 (minor): the "formalization-levels lattice" (un→closed→under→fully) is not a lattice.** `un-formalized` vs `under-formalized` are on different axes (derivability vs completeness); `fully-formalized` is undefined; no code consumes it. Demote to "two orthogonal gap meters."
- **F6 (minor): Δ has no authoritative doc.** SPEC/GLOSSARY cite `TEST-PIPELINE.md`; it doesn't exist. State Δ = `src/rules/` (the code is the authority).

Verdict: **flag** — the formal model is directionally right but overclaims the emit codomain and leaves the headline metric undefined.
