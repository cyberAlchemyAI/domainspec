# CONSTITUTION.md

> Governance constitution for DomainSpec.
> This document consolidates enforceable rules and binds each rule to its epistemic basis and enforcement gate.

---

## Rule Catalog

| Rule ID | Rule Statement | L4 Axiom | L6 Gate |
|---|---|---|---|
| C1 | DomainSpec artifacts are semantic source of truth. Changes to governance behavior must be implemented in domainspec first and then mirrored to integration harnesses. | A1 | Governance source/sync validation in CI (`validate-governance-chain`) |
| C2 | Domain policy, rules, and transitions cannot be authored in infrastructure adapters. | A2 | Layering audit gate on pull requests |
| C3 | Signal emissions must conform to a single canonical schema and session completeness invariants. | A3 | Signal validator gate (`validate-signals`) |
| C4 | Observer and executor responsibilities must be split using dual-phase observation (blocking fast observer plus async deep observer). | A4 | Fast observer gate + async observer workflow |
| C5 | Critical and high governance violations block merge immediately. | A5 | Governance workflow required status checks |
| C6 | Domain behavior implemented in code must bind to documented concepts via explicit anchors (`@biz`/`@sys`). | A1 | Orphan/undefined anchor validation (`validate-orphans`) |
| C7 | For existing implementation surfaces, alignment and layering audits are mandatory and parallelized. | A2 | Combined alignment+layering audit step in governance workflow |
| C8 | Artifact-level governance signals are computed deterministically from code, docs, and diffs. | A3 | Deterministic detector stage (`detect-signals`) |
| C9 | Behavior-level governance signals derive from full-trace telemetry bundles. | A4 | Telemetry bundle builder + async observer analysis |
| C10 | Governance rules are pruned by evidence every 10/20 runs following Via Negativa. | A5, A6 | Governance prune report generation and review gate |
| C11 | Governance health is tracked using metrics (M-001..M-006) and reflected in the outer loop. | A6 | Reflect report governance section + meta-health generation |

## Derivation Chain (L4 -> L3 -> L6)

1. A1 -> C1, C6 -> source/sync check + orphan validation.
2. A2 -> C2, C7 -> layering and alignment blocking audits.
3. A3 -> C3, C8 -> signal schema validation + deterministic detection.
4. A4 -> C4, C9 -> dual observer model + telemetry contract.
5. A5 -> C5, C10 -> shift-left blocking + async pruning cadence.
6. A6 -> C10, C11 -> governance pruning + metrics-driven reinforcement loop.

## Enforcement Notes

1. This constitution is authoritative for governance behavior.
2. Any new governance rule must include Axiom and Gate mapping.
3. Rules without measurable evidence over repeated cycles should be candidates for removal.
