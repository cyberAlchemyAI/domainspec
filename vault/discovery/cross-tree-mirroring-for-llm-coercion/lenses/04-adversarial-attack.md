---
tags: [vault, lens, adversarial, wave-2, attacks, concessions]
node_type: lens
is_session: false
layer: ontology
nature: adversarial-review
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
---

# Lens 04 — Adversarial Attack on Three-Sibling Proposal

## Mission

Hostile review of the three-sibling proposal (`/research`, `/domain_knowledge`, `/implementation`) with promotion (residue→L₁) and compilation (L₁→L₂) operations. Match Lens 04 quality of the prior `folder-structure-fractal/` discovery — try to kill the proposal. Surface attacks the author missed.

## Verdict

Five landing attacks; two partial concessions required; zero misses. Proposal survives **narrowed**: commit to enforcement machinery, name the multi-app reshaping, narrow cross-repo scope, cost maestro-trama concretely. As initially stated, it was "a domainspec-specific patch masquerading as a DomainSpec discovery."

## A1. Structural edge case — multi-app features

**Attack:** Can a feature be genuinely owned by two apps? The proposal says `apps/X/features/Y/` computes to a unique `domain_knowledge/apps/X/features/Y/` path. That assumes every feature lives in exactly one app. maestro-trama's `extraction/` already violates this: `ad-creative-dna` (proposal) + `labeling-platform` (app) = one feature, two homes. Under the proposal, which is canonical? Both paths force the LLM to pick arbitrarily and create a compile error in the other.

**Lands:** The proposal offers no route for shared features. It forces a binary tree where the domain sometimes requires a DAG.

**Concession:** Multi-app features are reshuffled into proposals-only specs with `IMPLEMENTED-BY.md` manifest listing instantiating apps. Specs are primary, code is instance. Adds a rule — not nothing.

## A2. Promotion policy collapse — partial identity and simultaneous claiming

**Attack:** "Identity-earned + manual greenlight" is opaque. maestro-trama shipped 203 files under `/extraction/` in commit `ba48ca2`. Did those files earn `(app, feature)` identity, or did the author *claim* identity and the code followed? The proposal has no distinction between "residue that figured out its home" vs "residue that guessed and was lucky." Greenlighting 200-file PRs is a human bottleneck. Does promotion batch? Can a feature *partially* earn identity (knows the app, not the feature, or vice versa)?

**Lands partially:** Identifies the mechanism (manual gate) but not the scale or granularity.

**Concession:** Upgrade path for partial identity: `domain_knowledge/apps/X/features/_unknown/{artifact}.md` as staging zone. Promotion = frontmatter edit to a real feature path. Atomic problem becomes gradient.

## A3. Compilation policy — T0' formalization gap

**Attack:** "Conditions = T0' obligations operationalized as JSON diagnostics per `categorical-extraction-schema.md`." But maestro-trama has no Lean tooling and no extraction machinery. Are we asking every DomainSpec repo to install a theorem prover? Prior `folder-structure-fractal` D-2 explicitly blocked cross-repo rollout pending a "schema-canonicalization protocol." This proposal makes a Lean call the *entry condition* — infrastructure-ahead-of-content.

**Lands:** Compilation gating is premature; maestro-trama has neither the infra nor the maturity for a T0' check.

**Concession:** Split into two phases: (1) folder shape + coercion mechanism (no T0' requirement); (2) optional T0' audits for repos with both spec and code. Demote T0' from "condition" to "deferred validation." L₁ → L₂ compilation is optional; structural symmetry holds regardless.

## A4. Coercion warrant is rhetorical, not measured

**Attack:** Claim is "structural symmetry forces the LLM to compute paths mechanically." But maestro-trama's current broken state is the *evidence of failure*, not evidence a structural fix would work. The 50 broken cross-links could be LLM errors, human errors, merge conflicts, or incomplete migrations. The proposal shows no A/B test, no baseline error rate, no counterfactual. "We'll know it when we see it" is not a falsification condition — same rhetorical defect lens 04 of the prior discovery already demoted.

Does "coercion" have *enforcement*? If an LLM edits `apps/X/features/Y/code.py` against a spec it disagrees with, what happens? The spec exists; the path is computable; the LLM ignores both. Coercion requires pre-commit hooks or CI gates, not just path mirroring.

**Lands:** The warrant is promissory but unvalidated. Either (a) commit to measuring LLM compliance against baseline, or (b) add enforcement machinery (pre-commit hooks, CI gates) that actually blocks divergence.

**Concession:** Degrade "coercion" to "navigational signal" — like the `layer:` field in `folder-structure-fractal`. Structural symmetry *helps*; it does not *force*. If the goal is forcing, add enforcement. If it's nudging, measure the nudge. Don't claim both without evidence.

## A5. Migration cost on maestro-trama is understated

**Attack:** Proposal creates three top-level siblings. maestro-trama currently has:
- `domain_knowledge/` (flat, 21 files) — becomes L₁
- `apps/` (4 apps, 100+ features, code-only) — maps to `/implementation/apps/`
- `docs/proposals/` (3 proposals, 10 specs) — specs belong in `/domain_knowledge/apps/*/features/`
- `vault/` (~30 files) — not migrated per prior D-2
- `business-philosopher/` (4 files, essays, no proposal affiliation) — **where?**

The `/research` residue pen is unexamined cost. maestro-trama has no residue layer today. Shipping `research/` means inventing a residue discipline from scratch. Estimate: 40+ files moved, ~100 link rewrites, ~8h decision-making on `business-philosopher/`. 3–5× the `folder-structure-fractal` estimate for `/domainspec`.

**Lands partially:** Undercounts scope on real repos lacking a vault. Assumes migration cost is "same as `/domainspec`" when shape is more complex.

**Concession:** Concrete cost estimate on maestro-trama. Either (a) concede 2–3× worse than vault case, or (b) narrow to vault-only repos pending separate discovery.

## A6. Cross-repo applicability is fatally unclear

**Attack:** Proposal is positioned as DomainSpec-wide. But prior `folder-structure-fractal` D-2 found the five repos are not isomorphic:

- `/domainspec` has a vault; fits.
- `/maestro-trama` has no vault, has `docs/proposals/`, has `business-philosopher/`, has 203-file `extraction/` collision. Three-sibling shape does not cover this.
- `/house_project` has a third "product-schema" layer the three siblings do not name.
- `/financas_pessoais` has no vault.
- `/football-stats-oracle` uses `raw/` not `lenses/`.

If it applies to one repo and breaks on four, it is not a DomainSpec discovery — it is a domainspec-specific patch.

**Lands:** Conflates "works for one repo" with "works for DomainSpec."

**Concession:** Explicitly narrow to `/domainspec` and maestro-trama-shaped repos. Multi-layer and vault-less repos = separate discoveries.

## A7. Optional signals for promotion are underdefined

**Attack:** Proposal says promotion conditions are "identity-earned + manual greenlight. Optional signals: stability, citation pull, confidence threshold." That is three different gradations with no decision rule. Does *one* signal suffice? All three? If residue knows its `(app, feature)` but is unstable, is it promoted or frozen?

**Lands:** Optional signals without a decision rule are not signals; they are vague guidance.

**Concession:** Make signals binary: identity-earned + manually flagged = promote. Define a decision table or kill the signals. Do not leave open.

## Summary

| Attack | Lands? | Severity | Concession Needed |
|--------|--------|----------|-------------------|
| A1: Multi-app features | **Lands** | Medium | Reshape into DAG (proposals first, IMPLEMENTED-BY manifest) |
| A2: Partial identity + simultaneous claiming | **Partial** | Medium | Add `features/_unknown/` staging zone |
| A3: T0' formalization gate premature | **Lands** | High | Defer T0' to phase 2; split design into shape + optional audits |
| A4: Coercion warrant is rhetorical | **Lands** | High | Either measure LLM compliance or add enforcement machinery; pick one |
| A5: Migration cost understated | **Partial** | Medium | Concrete cost estimate; concede 2–3× worse than vault case |
| A6: Cross-repo applicability conflated with global | **Lands** | Medium | Narrow to domainspec-shaped; dispatch separate discoveries for others |
| A7: Optional signals for promotion underdefined | **Lands** | Medium | Binary decision rule or explicit decision table |

**Conclusion:** The proposal has load-bearing ideas (folder mirroring, coercion via paths) but is *overextended* on warrant (rhetorical coercion claims), *underspecified* on mechanism (partial promotion, multi-app features, optional signals), and *misscoped* on applicability (claims global, applies to one repo). It survives narrowed: commit to enforcement machinery, name the multi-app reshaping, narrow cross-repo scope, and cost maestro-trama concretely.
