---
tags: [vault, lens-findings, close-session-redesign, meta-lens]
node_type: findings
is_session: false
layer: ontology
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-17
dispatch_status: historical
retrofits: true
lens_order: second
synthesized-by: ../../research/research.md
backfilled: true
---

# Findings — Meta-Lens A: Cross-Cutting

> **Lens order: second.** This is a meta-lens — a cross-lens consolidation dispatched during the original evaluate wave (2026-05-16/17). Its substantive content has been re-aggregated under the new convention's `research.md` (see `../../research/research.md`); this file is preserved verbatim as historical record of the second-order lens.


## Convergences (≥3 lenses agree)

1. **Signpost, not document — hard enforced cap is load-bearing.** All 4 lenses. 01: 120-line frontmatter cap. 02: write fails at line 11 of Reckon. 03: caps must be paired with grammar. 04: avg body length flat as a success metric.
2. **Closed-vocabulary tokens / fixed grammars replace prose in Layer 1 judgment fields.** All 4 lenses. 01: verdict ∈ {supported, refuted, inconclusive}; paths not sentences. 02: Gates A–G as enumeration; verbatim refusals. 03: "field grammar is the only real defense." 04: Pydantic round-trip.
3. **Promotion / retirement are flag-only.** Lenses 01, 02, 04. Close-session never writes to `premise/`, `constitution/`, or axiom files in a way that promotes.
4. **The Record→Reckon freeze is structural, not advisory.** Lenses 01 (sentinel + write order), 02 (write-time refusal at cap), 03 (post-write linter). Disagree on mechanism; agree in-prompt discipline alone fails.
5. **Sessions are immutable / append-only.** Lenses 02, 03, 04. Mutability is a corruption vector.
6. **Discovery is the prose-pressure valve.** Lenses 02, 03, 04. The compression pipeline only works if there is somewhere to push prose to.
7. **Triage must be semantic, not activity-based.** Lenses 01 (E1: zero file changes but real verdict), 02 (Gate A as judgment), 03 (the yes/no premise-status question).
8. **Cross-references are paths, never restated content.** Lenses 01, 02, 04.

## Compatible but uncombined moves

1. Lens 03's strict JSON + schema validator answers Lens 04's open `schema_version` validation.
2. Lens 01's sentinel solves Lens 02's at-line-11 detection problem (Reckon is appended to an already-flushed file).
3. Lens 03's per-field char cap solves Lens 01's open question 8 (candidate dedup by canonical form).
4. Lens 04's `parent_session:` solves Lens 02's open question 3 (multi-route via separate cooling-period session).
5. Lens 02's `reckon_gates_fired:` audit field surfaces Lens 03's "verdict template ossification" via histogram.
6. Lens 04's Emergence Ratio operationalizes Lens 03's un-falsifiable "compression / emergence" complaint.
7. Lens 01's `files_touched_semantic` count addresses Lens 03's "read-as-touch" inflation.
8. Lens 02's verbatim refusals + Lens 03's separate override skill close the human-override-cascade loop together.

## Shared mental model

A **write-once, append-only valve in a directional compression pipeline** (session → premise → constitution → axiom). The session note is the lowest-pressure node: cheap to produce, expensive to inflate, structurally incapable of substituting for downstream artifacts. The agent's prose instinct is treated as an erosive force; every design choice is a check valve against backflow. The session's value is what it *points at* and what it *refuses to contain*, not what it says.

## Corroboration & contradiction with the objective

**Corroborations.** Every lens treats compression/emergence as the telos and signpost as the form. Auditable-both-directions is honored by Lens 01's write order, Lens 02's `evidence_pointer:` back-refs, Lens 04's typed bidirectional/unidirectional edge rule, Lens 03's outbound-link requirement. Promotion-as-flag-only is universal.

**Quiet contradictions.** Lens 03 argues the objective terms ("compression," "emergence," "signpost") are operationally vacuous and that no skill design rescues them — only an external metric and periodic re-derivation can. Lens 04 partly answers with the Emergence Ratio but concedes the walker is out of scope. Lens 01's `record_budget: auto` scales with counted activity, which Lens 03 names as exactly the gameable surface. The lenses also tacitly endorse "most sessions should not visibly move the pipeline" — true but not endorsed by the stated objective.

## Connections

- `derives-from` → `../../discovery.md`
- `derives-from` → `../../research/research.md`
- `derives-from` → `../01-record-layer-mechanics/findings.md`
- `derives-from` → `../02-reckon-layer-discipline/findings.md`
- `derives-from` → `../03-adversarial/findings.md`
- `derives-from` → `../04-cross-skill-continuity/findings.md`
