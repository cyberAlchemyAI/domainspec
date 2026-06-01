---
tags: [domainspec, definitions, governance, schema, edges, audit, vault]
node_type: discovery
is_session: false
layer: ontology, governance
nature: explanatory, exploratory
status: draft
veracidade: low
convicção: medium
version: 0.1.0
last_updated: 2026-05-27
---

# Formal Definitions Layer (provisional name)

> Stub discovery — opened 2026-05-27 to anchor the research substrate produced on 2026-05-26 (`research/repo-inventory.md`) and to host upcoming research files. Naming is provisional: OQ-1 below decides whether this remains "Layer" (new elicitation surface) or is renamed `definitions-governance` (governance amendment over existing surfaces).

---

## Objective

Decide whether DomainSpec needs to add governance, schema unification, and identity rules over the ~90 fragmented definition surfaces it already carries — and, if so, what the minimal form of that governance is. The end state is either (a) an amendment to `AUTHORITY-MAP.md` + canonical-source rules + edge-namespace discipline, or (b) an explicit waiver that the current fragmentation is acceptable.

This discovery is intentionally pre-spec. Its next legitimate output is a research synthesis followed by a governance-amendment plan, not a new artifact type. No new template, no new `node_type`, and no new elicitation surface should be proposed unless upcoming research demonstrates that `docs/INITIAL-DEFINITIONS.md` + the `domainspec-spec-feature` discovery gate fail to cover a real authoring need.

---

## 1. Business Context

**Why now.** H-8 of [knowledge-calibration-geometry/discovery.md](../knowledge-calibration-geometry/discovery.md) assumes a stable reference surface against which calibration happens. The repo-inventory pass on 2026-05-26 documented that DomainSpec already carries fragmented definition surfaces — 3 edge namespaces (vault / domain / code), scattered rules across `templates/rules.md` and `templates/operations.md`, aspirational M-001..M-013 metrics without data sources, degenerate L1/L2/Δ extractors, and ~13 vault constitutions orphaned from `AUTHORITY-MAP.md`. Until these surfaces are reconciled, calibration has no stable reference, and downstream work on `knowledge-calibration-geometry` operates on shifting ground.

**What's broken.** Concretely, from [research/repo-inventory.md](research/repo-inventory.md) §2–§3:

- Schema drift between `templates/glossary.md` (5-col) and `docs/glossary.md` (4-col); sync rule not codified.
- Source-of-truth ambiguity between `docs/registry.md` and feature `SPEC.md` concept tables; no enforcement that the registry is derived.
- Rule definitions duplicated across `templates/rules.md` and inline blocks in `templates/operations.md`; no canonicalization rule.
- `vault/constitution/*` (≈13 files) orphaned from `AUTHORITY-MAP.md`; only the root `/CONSTITUTION.md` is listed.
- M-001..M-013 governance metrics in `implementation/GOVERNANCE-SIGNALS.md` have no data source, no collection cadence, no escalation rule.
- 3 edge namespaces (`vault`, `domain`, `code`) share unprefixed names; `produces` means different things in each.

**What stays the same.** The existing pre-spec elicitation flow (`domainspec-start` → `docs/INITIAL-DEFINITIONS.md`, then the discovery gate inside `domainspec-spec-feature` → `vault/discovery/<topic>/<slug>.md`) is **out of scope** for this discovery. That flow already covers what an earlier framing called "Enquadramento B." The aspect templates (`templates/*.md`), the feature SPEC structure, and the discovery-before-spec gate remain unchanged. Code-tag schema (`governance/tags/CODE-TAG-SCHEMA.md`) is also out of scope unless governance reconciliation forces a change.

---

## 2. Core Concepts

Held open. To be informed by the upcoming research fan-out.

Pre-committing core concepts here would silently decide OQ-1 (see §3) by either anchoring "Layer" semantics (new artifact type) or anchoring "governance amendment" semantics (no new artifact). Preserving the design space is required by AX-DS-4.

When the research lands, this section must answer:

- Which concept-type (concept, rule, metric, workflow, role, interface) lives where canonically.
- What the identity rule is for a concept that appears across multiple features.
- How the 3 edge namespaces are reconciled (prefix? merge? leave separate with hard rules?).
- Which existing artifacts are amended vs. archived.

---

## 3. Open Questions

- **OQ-1 — Layer or governance amendment?** Does this discovery produce a new artifact type / template (justifying the "Layer" name) or only amend existing governance surfaces (requiring a rename to `definitions-governance`)? Folder name is provisional pending this decision.
- **OQ-2 — Reconciliation between `INITIAL-DEFINITIONS.md` and feature discoveries.** When a concept is introduced inside a feature discovery, does it propagate back into the project-level `INITIAL-DEFINITIONS.md`? No sync rule today.
- **OQ-3 — Authority for vault constitutions.** Should each `vault/constitution/*` file be registered in `AUTHORITY-MAP.md`, or is `AUTHORITY-MAP.md` scoped only to root-level documents?

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `research/repo-inventory.md` | `derives-from` | Empirical substrate; this discovery stands on the ~90-artifact inventory and the six drift findings produced there. |
| `../knowledge-calibration-geometry/discovery.md` | `cites` | H-8 (formalization creates the reference surface) anchors why this work matters; calibration geometry depends on a stable definition surface. |
| `../domainspec-vault-foundations/scope-and-domain-axes.md` | `cites` | Unresolved universal-vs-domain debate (OQ-6 there) overlaps with OQ-1 here; resolution may converge. |
