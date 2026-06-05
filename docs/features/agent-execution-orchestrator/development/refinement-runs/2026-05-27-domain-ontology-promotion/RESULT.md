---
tags: [arcanum, refine, domainspec, ontology-validation]
node_type: discovery
is_session: false
layer: ontology, application
nature: explanatory, procedural, technical
status: draft
veracidade: medium
convicção: high
version: 0.1.0
last_updated: 2026-05-27
---

# Refine Result: DomainSpec Ontology Real-World Validation

## Status

Flag.

The design synthesis is usable as a seed, but the canonical Refine command-backed stages could not run because `tools/arcanum` is absent in this workspace.

## Final Synthesis

DomainSpec should validate ontology knowledge by requiring every promotable claim to declare observable consequences and real-world witnesses before it can guide agents. The core move is to stop asking “is this ontology text convincing?” and start asking “what would we observe in source artifacts, runtime evidence, user decisions, audits, production behavior, or external dated data if this claim were reliable?”

The lifecycle should use a `ValidationEnvelope` as the DomainSpec/AEO-specific evidence object. It should bind one ontology claim to a witness plan, selected data, expected observation, observed result, contradiction condition, confidence split, bridge validation, and review decision.

Promotion to constitution requires a governed artifact/form/model plus a runtime witness or coverage declaration. Promotion to axiom requires more than repetition: the claim must be invariant-bearing, dependency-reviewed, explicitly contradicable, and costly enough to revise that it deserves axiom status.

Primary output: `docs/features/agent-execution-orchestrator/discovery/ontology-real-world-validation-lifecycle.md`.

## Recommended Next Routes

- Run `invoke design` once `tools/arcanum` is available, using the discovery as input.
- Create the first validation fixture around `vault/constitution/governs-runtime-witness-constitution.md`.
- After one fixture passes, write a DomainSpec-local validation envelope template under `docs/features/agent-execution-orchestrator/development/ontology-validation/`.

