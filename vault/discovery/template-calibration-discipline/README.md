---
tags: [vault, ontology, templates, discipline]
node_type: discovery
is_session: false
layer: ontology, architecture
nature: explanatory, reference
status: exploratory
version: 0.1.0
last_updated: 2026-05-18
---

# Template Calibration Discipline

> Templates calibrated to the highest-complexity feature systematically produce cargo-cult boilerplate on simpler ones. The right shape for any DomainSpec template is: **required minimum for cross-document traceability + demonstrated optional via HTML-commented examples**. The cure for under-rigor on third-author additions is upstream process (review, verification), not template-enforced structure.

---

## Claim

A DomainSpec template should enforce only the minimum structure required for cross-document traceability and demonstrate everything else via HTML-commented examples; template floors must be calibrated to the lowest meaningful complexity, never the highest.

## Status

`exploratory`. The principle emerged from one dispatch (`2026-05-18-rules-test-spec-templates-01`) covering two template instances (`rules.md`, `TEST-SPEC.md`) fit-tested against three features (two-layer-retrieval, AEO, payment-processing). It is a converged synthesis between two adversarial L2 evaluators with sharp prior disagreement, but it has not been stress-tested across more template additions. Promoting it would require either (a) another template instance produced under this principle without retrofitting, or (b) an explicit retro that catches a violation in a template authored under it.

## Summary

The triggering investigation produced canonical `rules.md` and `TEST-SPEC.md` templates. Four L1 proposers partitioned the design space along two axes (schema-first vs prose-first × tooling vs authorial-ergonomics). Two L2 adversarial evaluators voted opposite winners but agreed on the same narrow floor and the same surgical relaxations. Synthesis resolved the dichotomy not by averaging the verdicts but by re-locating the disagreement: **rigor and ergonomics are not in tension when "required" is reserved for cross-document traceability and "demonstrated" is reserved for everything else**.

What changed about the prior understanding: the team had been implicitly calibrating template floors to the most complex consumer (the AEO 149-test apparatus), then experiencing the consequences as cargo-cult artifacts on simpler features — `**Type:** Invariant` lines that restate headings, Unit/Integration/Scenario/Property partitions chosen by coin-flip on 4-test specs, Rule-Test Traceability Index tables that duplicate a `Validates` column. The dispatch made this concrete by surfacing failure modes from both calibration directions (too-high → boilerplate; too-low → unverifiable formal blocks degrading to prose) and forcing a single resolution that survives both.

The two structural requirements that earned their place across all four L1 drafts and both L2 verdicts: a `**Checked by:**` link per rule in `rules.md`, and a Test Matrix row per test with a `Validates` citation in `TEST-SPEC.md`. Everything else — type taxonomies, formal blocks, state-machine tables, capability backlinks — appears in worked examples wrapped in HTML comments, so deletion leaves no orphan anchors.

What remains open: whether the principle generalizes to non-spec templates (`architecture.md`, `glossary.md`, `domain.md`), what the lower bound on "required minimum" actually is once a parser exists, and whether AEO itself should be retrofitted under the new templates or grandfathered as a migration concern.

## Lenses

> No lenses yet. This discovery is published from the synthesis of a single domainspec-subagents-strategy dispatch (per the source findings and research linked under Connections); per the discovery-structure-constitution §4, additional lenses are added only when they would strengthen confidence in the central claim or sharpen its boundary. Lens candidates are enumerated under **Next Moves** below. The `lenses/` folder is intentionally empty pending those dispatches.

## Decisions taken

### D-1 — Required = cross-document traceability only

- **Decision:** A DomainSpec template's required structure is the minimum set of fields and links that downstream tooling (or a careful reader) needs to verify cross-document traceability. Concretely for the rules/spec pair: heading slug as stable ID, `**Checked by:**` link per rule, Test Matrix row per test with `Validates` citation. Nothing else is required.
- **Rationale:** Required structure that is not load-bearing for traceability is paid for by every author of every feature, regardless of feature size. The cost is empty sections and pro-forma boilerplate that the reader must skim past. The benefit (uniformity) does not exceed the cost on small features and is invisible on large ones (which evolve toward those structures naturally — see F3 in source findings).
- **Status:** Adopted in the canonical `rules.md` and `TEST-SPEC.md` produced by dispatch `2026-05-18-rules-test-spec-templates-01`.

### D-2 — Optional = demonstrated, never scaffolded

- **Decision:** Patterns that are useful but not universally applicable (formal blocks, type taxonomies, state-machine tables, capability backlinks, traceability indexes) appear in the template as HTML-commented worked examples — never as scaffolded blocks the author must either fill or delete.
- **Rationale:** A scaffolded block creates conformance debt on every author who must justify deletion; an HTML-commented example creates zero debt because deletion is the default and produces no orphan anchors. Authors who need the pattern lift it out of the comment; authors who don't, leave it commented or remove it without trace.
- **Status:** Adopted in the canonical templates.

### D-3 — Heading slug is the stable ID; no parallel ID registry

- **Decision:** Stable IDs for rules and tests are the heading slugs themselves. There is no `<!-- rule_id: R-1 -->` or equivalent metadata field carrying a parallel ID.
- **Rationale:** A second ID field creates a drift vector with no information gain — the linter to enforce equality between heading slug and metadata ID is enforcement-for-enforcement's sake. The risk it addresses (silent renumbering breaking traceability) is better handled by social discipline ("don't renumber published IDs") than by template structure.
- **Status:** Adopted; rejection of A2's metadata block was the most consequential synthesis call (F2 in source findings).

### D-4 — Under-rigor by third authors is a process problem, not a template problem

- **Decision:** The failure mode "third author skips the formal block on a new rule" is addressed by upstream review process (e.g., `requesting-code-review`, `verification-before-completion`), not by promoting the formal block to a required template field.
- **Rationale:** Promoting optional structure to required structure to prevent skipping recreates the cargo-cult problem on every author who would have written the rule correctly without the formal block. The template floor must serve the smallest legitimate feature; the rigor floor must be defended at review time on the features that need it.
- **Status:** Adopted in principle; the actual review-process artifacts that operationalize this are out of scope for this discovery.

## Alternatives considered

### A-1 — Calibrate the template floor to the highest-complexity consumer

- **Position:** Make every structure that the most complex consumer needs (type taxonomies, capability backlinks, formal blocks, traceability indexes) a required field in the template; let smaller features fill them in with N/A or short prose.
- **Why rejected:** Produces cargo-cult artifacts on simple features — empty Capability Backlinks sections, arbitrary Unit/Integration/Scenario/Property partition choices, `**Type:** Invariant` lines that restate headings, Rule-Test Traceability Index tables that duplicate the `Validates` column at small N. The cost is paid by every author on every feature; the benefit accrues only on the rare large feature, which would have evolved toward those structures without the scaffolding.

### A-2 — Drop template structure entirely; let authors decide everything

- **Position:** Templates should be prose-only or nearly so; treat structure as a per-feature judgment call.
- **Why rejected:** Without a `**Checked by:**` link per rule and a Test Matrix row per test, rule-to-test traceability is unverifiable at any scale. The two-layer-retrieval F4 piecewise formal block already exhibits the degradation: stated as prose, it loses its strict ordering quantifier and existential pairing, and the supersedes-pathology Lean queue has no machine-readable rule to lift. Some floor is non-negotiable.

### A-3 — Parallel ID registry via HTML-commented metadata block

- **Position:** Carry rule IDs and test IDs in a per-item metadata block (e.g., `<!-- rule_id: R-1, validates: [T-1, T-2] -->`) so downstream Python harnesses can parse them without slug normalization.
- **Why rejected:** The heading slug already IS the stable ID. A parallel registry creates a drift vector — the linter must now police equality between two fields that should always agree, which is work generated by the schema rather than work the schema reduces. The harness can normalize slugs at parse time at lower total cost than maintaining the parallel registry.

## Open Questions

- **OQ-1 — Does the principle generalize beyond spec-pair templates?** This dispatch covered `rules.md` and `TEST-SPEC.md` only. Whether the same calibration rule applies to `architecture.md`, `glossary.md`, `domain.md`, or other DomainSpec template types is untested. The mechanism (cross-document traceability is the required floor; everything else demonstrated) should generalize, but each template type has different traceability needs.
- **OQ-2 — Should AEO's existing `rules.md` and `TEST-SPEC.md` be retrofitted with vault-standard frontmatter?** Flagged by L2-E1 as a migration concern and by L2-E2 as a vault-graph concern; not blocking template adoption. Needs an explicit migration decision.
- **OQ-3 — What is the lower bound on "required minimum"?** The principle says "calibrate to the smallest legitimate feature," but the actual floor is "the file is parseable for cross-document traceability." Until a parser exists, the floor is enforced by human review, which means it can drift below what the principle requires without anyone noticing.
- **OQ-4 — When does this principle harden into a constitution?** Currently exploratory. Plausible promotion triggers: (a) a second template authored under it without retrofitting; (b) a documented case of a template author lifting an HTML-commented pattern as designed; (c) a documented case of the principle failing (which would block promotion and amend the discovery instead).

## Next Moves

- **Lens candidates** — if more evidence accumulates, productive lens dispatches would be: (a) a fit-test of the principle against a non-spec template type (e.g., `architecture.md`); (b) a literature lens on documentation-template design in adjacent communities (RFC templates, ADR templates, IETF I-D templates) to corroborate or sharpen the principle; (c) a falsification-attempt lens — find a template where calibrating to the smallest feature genuinely loses information.
- **Premise candidate** — once a second template is authored under this principle without retrofit, extract: *"DomainSpec template floors are calibrated to the smallest legitimate consumer; optional structure is demonstrated via HTML-commented examples."* Path: `vault/premise/template-calibration-premise.md`. `veracidade: medium`, `convicção: high`.
- **Constitution candidate** — if the premise survives a second instance and a non-spec template type (OQ-1 resolved positively), promote to `vault/constitution/template-shape-constitution.md` governing all DomainSpec templates under `domainspec/templates/`.
- **Migration item** — open a separate backlog entry to resolve OQ-2 (AEO retrofit).
- **Process linkage** — the D-4 claim (under-rigor is a process problem) implies a coupling to `requesting-code-review` and `verification-before-completion` workflows. If those skills evolve, revisit whether the template-vs-process boundary still holds where this discovery places it.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `docs/research/templates-rules-test-spec/domainspec-subagents-findings.md` | `derives-from` | The synthesis findings file from dispatch `2026-05-18-rules-test-spec-templates-01`; every Decision and Alternative on this page traces to a Finding or Tension recorded there. |
| `docs/research/templates-rules-test-spec/domainspec-subagents-research.md` | `cites` | The verbatim per-agent research grounding the findings; cited transitively for the per-agent claims summarized above (L1-A1..A4 proposals, L2-E1/E2 verdicts, L3-S1 synthesis). |
| `domainspec/templates/rules.md` | `derives` | Canonical `rules.md` template produced by the dispatch and shaped by D-1, D-2, D-3 above. |
| `domainspec/templates/TEST-SPEC.md` | `derives` | Canonical `TEST-SPEC.md` template produced by the dispatch and shaped by D-1, D-2, D-3 above. |
| `vault/constitution/discovery-structure-constitution.md` | `governed-by` | This discovery follows the folder/README/lenses shape mandated by that constitution. The empty `lenses/` folder is intentional per §4 (lenses added only when they strengthen confidence or sharpen the boundary). |
| `vault/ontology-conventions.md` | `governed-by` | Frontmatter classification (node_type, layer, nature, status) follows this constitution. `veracidade` and `convicção` are omitted per its Applicability rule for `node_type: discovery`. |

---

## Source dispatch

- **Dispatch slug:** `2026-05-18-rules-test-spec-templates-01`
- **Findings file:** `docs/research/templates-rules-test-spec/domainspec-subagents-findings.md`
- **Research file:** `docs/research/templates-rules-test-spec/domainspec-subagents-research.md`
- **Dispatch spec:** `vault/snapshots/dispatches/2026-05-18-rules-test-spec-templates-01-spec.yaml`
- **Provenance chain:** dispatch spec → 4 L1 proposers (sonnet) → 2 L2 evaluators (opus) → L3 parent synthesis (opus) → user approval → templates written to `domainspec/templates/` → findings file → this discovery.
