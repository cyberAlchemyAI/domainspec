---
tags: [internal-tools, tower-explorer, categorical-tooling-guard, audit-richness]
node_type: spec
is_session: true
layer: architecture, application
nature: technical, reference
status: active
created: 2026-05-25
timestamp: 2026-05-25T01:28:32-03:00
expires: 2026-07-24
conversation_id: domainspec-internal-tools-gate-port-2026-05-25
decisions_made: true
contradictions_found: false
specs_updated: [docs/features/tower-explorer/spec.md, docs/features/tower-explorer/plan.md, vault/discovery/reflection-tower-structural-gate/README.md]
promoted_candidates: []
expected_importance: 8
importance_rationale: "This session made the documented Gate 0 and Gate 1 tooling real inside domainspec and aligned the framework docs, package entrypoints, and skill surface around that execution path."
---

# DomainSpec Internal Tools Gate Port

## Summary

Ported the theorem-side parser seam, categorical tooling guard, and first tower explorer slice into `domainspec/internal_tools` so the framework now has runnable Gate 1 and Gate 0 surfaces instead of only prose plans. The session also reconciled the reflection-tower discovery and `tower-explorer` feature docs with the repo's actual frontmatter and packaging rules, then added a thin skill to teach the sequential Gate 0 -> Gate 1 flow. Verified the new tool slice with targeted tests and CLI smoke checks, and intentionally kept T-1 forward-only as a `flag` for the legacy corpus rather than blocking immediately.

## Files touched

- internal_tools/README.md
- internal_tools/pyproject.toml
- scripts/audit_richness.py
- internal_tools/categorical_tooling_guard/README.md
- internal_tools/categorical_tooling_guard/cli.py
- internal_tools/categorical_tooling_guard/guard.py
- internal_tools/categorical_tooling_guard/tests/test_guard.py
- internal_tools/tower_explorer/README.md
- internal_tools/tower_explorer/cli.py
- internal_tools/tower_explorer/explorer.py
- internal_tools/tower_explorer/tests/test_explorer.py
- copilot/skills/domainspec-structure-gate/SKILL.md
- vault/discovery/reflection-tower-structural-gate/README.md
- docs/features/tower-explorer/spec.md
- docs/features/tower-explorer/domain.md
- docs/features/tower-explorer/interfaces.md
- docs/features/tower-explorer/operations.md
- docs/features/tower-explorer/plan.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `internal_tools/README.md` | `modifies` | Updated the internal tools navigation to include the new Gate 0 and Gate 1 subsystems. |
| `internal_tools/pyproject.toml` | `modifies` | Registered the new `categorical-tooling-guard` and `tower-explorer` package entrypoints and package discovery includes. |
| `scripts/audit_richness.py` | `creates` | Added the parser/emitter seam that the lean-code-validator docs already treated as authoritative. |
| `internal_tools/categorical_tooling_guard/README.md` | `creates` | Added the Gate 1 subsystem documentation in the product repo. |
| `internal_tools/categorical_tooling_guard/cli.py` | `creates` | Added the Gate 1 CLI wrapper over the raw richness audit. |
| `internal_tools/categorical_tooling_guard/guard.py` | `creates` | Added the Gate 1 policy adapter that normalizes audit output into `pass | flag | block`. |
| `internal_tools/categorical_tooling_guard/tests/test_guard.py` | `creates` | Added the focused test slice for the Gate 1 verdict logic. |
| `internal_tools/tower_explorer/README.md` | `creates` | Added the Gate 0 subsystem documentation in the product repo. |
| `internal_tools/tower_explorer/cli.py` | `creates` | Added the Gate 0 CLI entrypoint for vault structural checks. |
| `internal_tools/tower_explorer/explorer.py` | `creates` | Added the first `tower_explorer` implementation slice for vault inventory and origin-rung diagnostics. |
| `internal_tools/tower_explorer/tests/test_explorer.py` | `creates` | Added the focused test slice for the Gate 0 T-1 behavior. |
| `copilot/skills/domainspec-structure-gate/SKILL.md` | `creates` | Added a thin skill that teaches the sequential Gate 0 then Gate 1 workflow. |
| `vault/discovery/reflection-tower-structural-gate/README.md` | `modifies` | Rewrote the discovery into the repo's required closeout/discovery structure and narrowed the first implementation slice. |
| `docs/features/tower-explorer/spec.md` | `modifies` | Kept the feature spec as the design authority while aligning it with the now-runnable Gate 0 implementation path. |
| `docs/features/tower-explorer/domain.md` | `modifies` | Corrected the aspect frontmatter and wording to match canonical node types and the current T-1 semantics. |
| `docs/features/tower-explorer/interfaces.md` | `modifies` | Corrected the aspect frontmatter and preserved the CLI/interface contract for the feature. |
| `docs/features/tower-explorer/operations.md` | `modifies` | Corrected the aspect frontmatter and preserved the operation contract for later T-2/T-3/T-4 work. |
| `docs/features/tower-explorer/plan.md` | `modifies` | Corrected the plan node type and kept the milestone roadmap honest relative to the implemented slice. |
