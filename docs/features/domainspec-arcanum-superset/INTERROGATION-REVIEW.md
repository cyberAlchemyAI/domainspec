---
feature: domainspec-arcanum-superset
version: current
status: draft
updatedAt: 2026-05-26
docType: interrogation-review
owners:
  - domainspec-core
---

# DomainSpec Arcanum Superset Interrogation Review

## Scope

This review interrogates whether the existing `domainspec-arcanum-superset` architecture, implementation layering, and work-pack make sense as a starting point for integrating Arcanum and DomainSpec.

Reviewed artifacts:

- `ARCHITECTURE.md`
- `IMPLEMENTATION-LAYERING.md`
- `WORK-PACK.md`
- `implementation/domainspec/README.md`
- `implementation/domainspec/TAXONOMY.md`
- `implementation/domainspec/RELATIONSHIPS.md`
- `arcanum/README.md`
- `arcanum/registry/SIGILS.md`
- `arcanum/registry/SPELLS.md`
- `arcanum/spells/invoke/README.md`

## Verdict

Status: `flag`

The concept makes sense as a staged integration direction. The strongest part is the authority boundary: DomainSpec governs semantic traceability and delivery gates while Arcanum keeps lifecycle ownership for sigils, spells, invoke, spellcraft, task-session, observability, and validation evidence.

The package should not be treated as implementation-ready. It currently has architecture and planning artifacts, but no approved `SPEC.md`, no local glossary, no Arcanum-to-DomainSpec crosswalk, and no concrete proof that proposed capability concepts and relationships fit the existing DomainSpec taxonomy and relationship catalog.

## Interrogation Findings

| ID | Severity | Finding | Why It Matters | Required Repair |
| --- | --- | --- | --- | --- |
| IR-001 | block-for-implementation | The package starts from architecture and plan, not from an approved feature `SPEC.md`. | DomainSpec's pipeline requires typed feature semantics before downstream work can claim readiness. | Execute `TASK-DSAS-001` before runtime, registry, or source mutation work. |
| IR-002 | flag | The phrase "DomainSpec becomes a superset of Arcanum" is directionally useful but too strong before L0 proof. | It can imply repository merger or lifecycle absorption even though the architecture tries to preserve Arcanum authority. | Treat the phrase as a hypothesis; prefer "DomainSpec models Arcanum as a governed capability domain" until L0 exits. |
| IR-003 | flag | Proposed concepts such as `Capability`, `Sigil`, `Spell`, `LifecycleOwner`, `RuntimeAdapter`, `ValidationExperiment`, and `ObservedRun` are not yet mapped to DomainSpec's existing meta-types. | DomainSpec taxonomy expects concepts to map to meta-types; new vocabulary must be local or explicitly promoted. | In `SPEC.md`, assign each term to an existing meta-type or record it as a candidate taxonomy gap. |
| IR-004 | flag | Proposed relationships such as `invokes`, `validates`, `observes`, `reflects-on`, `routes-to`, and `adapts-runtime` are not in the current relationship catalog. | New edge names can fragment the graph unless examples, inverses, and enforcement rules exist. | Reuse existing relationships where possible and record remaining edge proposals with examples and validation checks. |
| IR-005 | flag | The registry bridge lacks a concrete authority model for generated views versus canonical Arcanum registries. | Registry duplication is the main drift risk in a dual-framework migration. | Decide in W0 whether Arcanum registries remain canonical inputs, generated outputs, or both with explicit precedence. |
| IR-006 | pass | The work-pack correctly blocks mutation-capable work until `SPEC.md` and a crosswalk exist. | This protects both systems from premature consolidation. | Keep this gate intact. |

## Decision Snapshot

| Decision | Verdict | Rationale |
| --- | --- | --- |
| Use DomainSpec as the semantic governance substrate | selected-with-flag | Coherent with DomainSpec's source-of-truth and traceability model, but needs a feature spec before implementation. |
| Model Arcanum as a capability domain instead of merging folders | selected | Best preserves existing Arcanum lifecycle ownership and observability evidence. |
| Start with non-mutating L0 inventory and crosswalk | selected | Correct smallest working unit. |
| Move to runtime bridge work now | rejected | Runtime work is blocked until semantic fit and registry authority are proven. |

## Repair Route

1. Draft `SPEC.md` for the capability-domain superset.
2. Add a local glossary or glossary section that marks all Arcanum vocabulary as local candidate vocabulary unless promoted.
3. Draft the ontology crosswalk with one row per sigil, spell, tier, lifecycle owner, runtime adapter, and observability/run artifact.
4. Add an explicit registry authority rule before any generated registry view exists.
5. Re-run interrogation after the crosswalk exists; the key question is whether the mapping preserves Arcanum lifecycle authority without distorting DomainSpec taxonomy.

## Structured Interview Result

- Target scope: `implementation/domainspec/docs/features/domainspec-arcanum-superset`
- Mode: `artifact-readiness-review`
- Questions asked: 0
- Decisions recorded: 4
- Artifacts updated: `implementation/domainspec/docs/features/domainspec-arcanum-superset/INTERROGATION-REVIEW.md`
- Remaining ambiguities: exact meta-type mapping, relationship reuse versus new edge proposals, canonical registry precedence, first runtime parity target.
- Verdict: `flag`
- Next step: execute `TASK-DSAS-001` and create the feature `SPEC.md`.

## Observability Closeout

- OBSERVATION: Interrogation ran as a non-interactive artifact readiness review because the user asked whether the current artifacts make sense.
- LEDGER: No deterministic wrapper telemetry was available in this Codex run; this review preserves the primary result in the feature folder.
- REFLECTION_TRIGGER: No immediate reflection trigger; repeat flags after `SPEC.md` creation should route to invoke/design repair.
- RECOMMENDATION: Continue with W0 only; do not begin runtime bridge or mutation-capable tasks.
- DEDUPE_KEY: `interrogation-domainspec-arcanum-superset-20260526`
