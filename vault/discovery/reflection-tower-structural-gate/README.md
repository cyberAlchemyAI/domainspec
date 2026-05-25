---
tags: [vault, discovery, reflection-tower, tooling, governance, audit, residue]
node_type: discovery
is_session: false
layer: architecture
nature: explanatory, reference
status: exploratory
veracidade: high
convicção: high
version: 0.2.0
last_updated: 2026-05-24
---

# Reflection Tower as Structural Gate

## Objective
Define Gate 0 for DomainSpec as a vault-structure check that runs before the existing L1->L2 compilation guard. The end state is a documented and implementable split where `tower_explorer` owns cross-layer promotion integrity and `categorical_tooling_guard` owns per-spec compilation-fidelity diagnostics.

## 1. Business Context

### Why now
`domainspec` already documents a Lean-backed reflection-tower story, a v3 `lean-code-validator`, and a guard-based readiness path, but the runnable infrastructure only covers the flat per-spec audit surface. That leaves the framework with a documented upstream gate and no executable implementation, which is the wrong order for a product repo that wants CI, skills, and governance to converge.

### What's broken
- `internal_tools/pyproject.toml` exposes `vault-ctl`, `vault-telemetry`, and `convergence-runner`, but no Gate 0 or Gate 1 CLI entrypoints for the reflection-tower and categorical-audit surfaces.
- `internal_tools/README.md` describes the vault platform but does not include the structural-gate tools that the theorem-side repo already shaped.
- `internal_tools/lean-code-validator/README.md` and `PLAN.md` repeatedly name `scripts/audit_richness.py` as the parser/emitter authority, but `domainspec/scripts/audit_richness.py` does not exist.
- `docs/features/tower-explorer/spec.md`, `domain.md`, `interfaces.md`, `operations.md`, and `plan.md` describe a feature, but until code exists under `internal_tools/tower_explorer/` they are architecture prose without an executable subsystem.
- `vault/discovery/reflection-tower-structural-gate/README.md` captured the idea, but not in the required discovery structure the repo expects for a load-bearing design handoff.

### What stays the same
- `vault_common` remains the kernel owner of frontmatter, walking, and generic edge semantics.
- `lean-code-validator/` remains the Lean-side structural checker; this work does not move theorem code into `domainspec`.
- Existing readiness and verification skills stay in place; this work adds Gate 0 / Gate 1 tooling and a dedicated skill surface rather than replacing the current pipeline.
- T-2, T-3, and T-4 remain planned follow-on milestones; the first implementation slice only needs to make T-1 and the guard/parser seam real.

## 2. Core Concepts

### Gate 0
`Gate 0` is the vault-structure layer. It checks whether cross-layer edges preserve provenance and can therefore be trusted as inputs to downstream compilation or governance work. This is separate from spec richness and should run first.

### Gate 1
`Gate 1` is the per-spec compilation-fidelity layer. It wraps `audit_richness.py` output into a stable `pass | flag | block` contract that CI, skills, and later editor integrations can consume without understanding the full raw audit payload.

### Parser seam
`scripts/audit_richness.py` is the public contract between markdown specs and the Lean validator. We preserve that path rather than relocating it into a new module, because `domainspec`’s existing docs, plans, and examples already treat that script path as authoritative.

### Productization boundary
`domainspec-theorem` remains the research/reference repo. `domainspec` owns the runnable infrastructure, CLI entrypoints, and agent/skill surface that make the ideas usable in the framework.

## 3. Structural Gate Boundary

The existing `categorical_tooling_guard` answers one question: should a single spec be treated as structurally compilable? It does not know anything about promotion provenance, tower rungs, or vault-wide cross-layer links. `tower_explorer` fills that gap by owning the vault inventory and the first structural diagnostic family.

For the first shipped slice, the tower tool only needs to parse the vault graph, detect cross-layer edges, resolve their targets, and report missing `origin_rung` annotations as non-blocking findings. That gives the framework a real Gate 0 entrypoint without forcing an immediate migration across the existing vault corpus.

## 4. Parser and Guard Contract

The parser seam and the guard belong together operationally:
- `audit_richness.py` parses one feature spec corpus, computes structural checks, and optionally emits Lean-facing output.
- `categorical_tooling_guard` consumes the raw audit report and normalizes it into a stable diagnostic bundle.
- Skills and CI should call the guard, not re-encode its policy ad hoc.

This split was chosen over embedding policy inside the parser because the raw audit report is useful independently for research, Lean emission, and future UI/editor surfaces. The guard is the policy adapter, not the source of truth.

## 5. Implementation Slice

The first production slice in `domainspec` is:
- add `scripts/audit_richness.py`
- add `internal_tools/categorical_tooling_guard/`
- add `internal_tools/tower_explorer/`
- register `categorical-tooling-guard` and `tower-explorer` in `internal_tools/pyproject.toml`
- add one skill that explains and runs the sequential Gate 0 -> Gate 1 flow

This is deliberately narrower than the full tower feature spec. T-2, T-3, and T-4 stay documented in the spec and plan, but they are not silently half-implemented in this slice.

## 6. Open Questions

### Should T-1 block immediately for legacy edges?
Recommendation: no. Treat missing `origin_rung` as `flag` for the current corpus and reserve blocking for forward enforcement once the write path is instrumented.

### Should Tower Explorer reuse `vault_common.extract_edges` completely?
Recommendation: not yet. The first version may keep a local Connections-table read path because T-1 needs the edge description payload to detect `origin_rung` inline, and the shared edge extractor does not currently preserve that description.

### Do we need a dedicated agent/skill surface now?
Recommendation: yes, but thin. Add a skill that teaches agents to run Gate 0 before Gate 1 rather than embedding this knowledge only in prose docs.
