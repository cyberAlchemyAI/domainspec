---
tags: [formalization, schema, drift, governance, residue, cross-repo]
node_type: discovery
is_session: false
layer: ontology
nature: explanatory, reference
status: exploratory
veracidade: medium
convicção: high
version: 0.1.0
last_updated: 2026-05-28
---

# Adaptive Formalization Curve — as a schema-creation metric

> Working hypothesis: **the uncertainty-investment curve is the right heuristic for deciding when an instance graduates to needing a schema.** For now, conceptual and mental-model only — not yet operationalized.

## The curve, in one paragraph

Two lines cross over time: **uncertainty** falls as a domain is learned; **investment** rises as it is formalized. The crossing — the **inflection point** — is the moment when the cost of *not* formalizing exceeds the cost of formalizing. Before the inflection, premature formalization kills exploration. After it, accumulated informality becomes drift.

Canonical exposition (richer, with the seven instantiations across the framework, origin story, and domain-independence argument): `/Users/victorboscaro/house_project/docs/business-philosopher/assuntos/adaptive-formalization/README.md` — with image `incerteza_vs_investimento.png` in the same folder.

## Application: when to create a schema

Recast as a governance rule for the DomainSpec / theorem ecosystem:

> Every instance that has crossed its inflection point needs a schema. Before the inflection, absence of schema is the *correct* state — not tolerated, correct. **Drift** = instance has passed inflection and remains unschemafied, OR a schema has multiple divergent instances that have all passed inflection without reconciliation.

This recasts schema discipline as a **timing question**, not a binary "all stable things must be typed". It also preserves the framework's residue-as-structural reading: leakage before inflection isn't a defect.

## Honest scope (where this currently fails operationally)

- **The inflection point is not calculable a priori.** The maintenance-cost rule ("invest when the pain has happened once") makes it retroactive. Open question whether prospective criteria exist (`vault/discovery/adaptive-formalization-curve/README.md` in `house_project` lists the minimum-viable-L1 attempt).
- **Operational test reduces to judgment.** "Has this instance passed inflection?" ≈ "is this stable + referenced enough to demand a schema?" — same answer set, sharper vocabulary, no new measurement.
- **The added value is therefore rhetorical and structural, not quantitative.** It anchors schema-creation decisions in a principle that has been operating across Victor's repos for ~6 years, instead of inventing per-project rules.

## Touchpoints across repos

- **`domainspec` (this repo):** the confidence lifecycle (`draft → exploratory → active → consolidated → evergreen`), `veracidade`/`convicção`, P-ONT-7 (density-over-granularity), the maintenance-cost rule, explicit-absence (`Unanchorable: true`), L4 volatility decay, shadow-mode enforcement — all are instantiations of this curve. The curve formalizes what the framework was already doing.
- **`domainspec-theorem`:** the `repo-cleaning/` workspace (in design, 2026-05-28) adopts the curve as its `00-principles.md` rule for distinguishing "this instance should have a schema and doesn't" (drift) from "this instance is pre-inflection, schema-absence is correct" (exploration).
- **`house_project`:** canonical home. This discovery does not duplicate that exposition — it points to it.

## Open questions

1. **Is the inflection prospectively detectable?** The minimum-viable-L1 criterion is an attempt. Untested across projects.
2. **Does the curve shape vary by layer?** L1 likely crosses inflection early; L4 likely crosses late. If so, the framework should specify variation explicitly.
3. **Can a single artifact sit on different sides of the inflection across different layers simultaneously?** Almost certainly yes — making this explicit would help self-diagnosis.
4. **Is "schema" itself an instance subject to the same curve?** I.e., is meta-schema-creation also governed by inflection timing? Probable recursion not yet examined.

## Why this is filed as `discovery`, not `axiom` or `premise`

The curve has high `convicção` (operating principle for ~6 years) but currently medium `veracidade` as a *schema-creation metric* specifically — the rephrasing for this application is recent (2026-05-28) and untested at scale across the theorem repo cleanup. Promotion to `active` / `premise` / `axiom` should wait for at least one cleanup pass that demonstrably uses the inflection test to decide a real case.
