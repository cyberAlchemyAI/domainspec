# Project Overview — lean-code-validator (v3)

## Objective

This document defines the scope, goals, actors, value, constraints, and current implementation state of the `lean-code-validator` tool. It exists so any later DomainSpec stage (planner, spec-writer, implementer, auditor) can answer "what is this tool, who is it for, and how complete is it?" without re-reading research notes.

## Project state

- **Mode**: brownfield
- **State**: partial implementation
- **Evidence inventory**:
  - v2 implementation at [internal_tools/lean-code-validator/](..) — `Sigma.lean`, `Richness.lean`, one example (`ZagrMarketplace.lean`)
  - Markdown parser at [scripts/audit_richness.py](../../../scripts/audit_richness.py) — produces typed-graph JSON + Lean emission
  - Six L1 specs at [examples/](../../../examples/) — zagr-marketplace plus 5 simpler specs
  - Prior research at [research/research.md](../research/research.md) and [research/findings.md](../research/findings.md)
  - Canonical vocabulary at `domainspec-core/research/projects/domainspec/definitions/DEFINITIONS.md` (DS-D1, DS-D2, DS-D8) and `domainspec-core/.../papers/domainspec-paper.md` (Tables 3 & 4)

## Scope

**In scope (v3)**:
- A Lean-based **grader** (not a gate) that consumes a parsed L1 spec and emits a structured codegen-readiness report.
- Five decidable predicates over a `Spec`: schema closure, σ-typing, per-meta-type signature completeness, codegen ambiguity, generation-order DAG.
- Profile-aware vocabulary aligned to `domainspec-core` (`paperBaseline` 24/26, `compositionExtension` 25/29).
- Multi-spec validation against the six in-repo example specs.

**Out of scope (v3)**:
- Field-body codegen readiness (typed properties, validation logic) — parser drops field content.
- Enum-value rendering, invariant predicate text — same parser limitation.
- Categorical claims (Functor.Full, Quiver, presheaf semantics, M6-graph theorem). v3 stays strictly below the Claim B Wall.
- Validation-readiness, test-readiness, deployment-readiness — different gates.
- UI for the grader — output is a structured Lean value + CLI text.

**Explicit non-goals**:
- Replacing `domainspec-alignment-auditor`, `domainspec-layering-auditor`, or `domainspec-verifier`. v3 fills a different slot (spec structural readiness, not implementation-vs-doc fidelity).
- Inventing new σ-triples for the 6 unevidenced R_U edges. v3 surfaces them as warnings; ratification stays with `domainspec-core` paper authors.

## Goals

1. **Determinism**: same spec ⇒ same grade, every run. No randomness, no LLM judgment.
2. **Mechanization**: every predicate is a decidable Lean function over finite data. Grade is `#eval`-able.
3. **Actionability**: every `WARN` and `FAIL` carries a concrete witness (which concept, which missing edge) and a one-line recommendation.
4. **Profile honesty**: only enforce vocabulary that `domainspec-core` has formally defined. Empty σ for the 6 unevidenced R_U edges; canonical-only R_CF (3, not 5) until DEFINITIONS.md ratifies E9 extras.
5. **Self-application**: the tool's own spec is itself a DomainSpec L1 spec, gradeable by the tool. (Meta-application — partial bootstrap proof.)

## Actors

| Actor | Role | What they do with the tool |
|---|---|---|
| **Spec author** | Writes L1 markdown specs | Runs grader, reads report, fixes high-confidence issues, dismisses noise |
| **Tool maintainer** | Owns the validator codebase | Adds new predicates, calibrates obligation tables based on dismissal patterns |
| **CI / readiness-gate integration** | (future) Automated pipeline | Consumes report as one input among several when computing feature-readiness verdict |
| **DomainSpec methodology owner** | Owns `domainspec-core` definitions | Ratifies vocabulary extensions (R_U triples, R_CF expansions) that v3 currently flags as `WARN` |

## Value proposition

Today, a spec author has no machine-checkable answer to "is my spec good enough to code?" They rely on review intuition. v3 provides:

- A **deterministic, reproducible** answer per spec.
- **Specific witnesses** instead of vague "incomplete" feedback.
- **A calibration loop**: persistent dismissals across many specs feed back into rule softening, so v4's rules are evidence-based rather than guessed.

Without v3, the codegen step has no upstream gate beyond manual review — and manual review doesn't scale across 6+ specs and growing.

## Constraints

- **No Mathlib**. v3 stays self-contained Lean 4 to keep the dependency surface narrow and the type-check fast (parity with v2).
- **No new framework agents**. v3 is a tool consumed by existing agents (notably `domainspec-readiness-gate`), not a new agent itself.
- **Authority direction is fixed**: `domainspec-core` defines vocabulary → v3 implements/checks. Where parser σ disagrees with canonical σ, canonical wins.
- **Parser changes are minimal**: four one-line additions to `audit_richness.py`'s emitter (provenance, unresolved refs, structural counts, profile). No parsing rewrites.
- **Backward compatibility**: v2's `examples/ZagrMarketplace.lean` is frozen at `examples/_v2/`; v3 regenerates fresh. No dual-format support.

## Current implementation state

| Component | Status | Notes |
|---|---|---|
| Parser (`audit_richness.py`) | Partial | Extracts 12 R_B edges; missing 13 R_U + R_X + R_CF + Saga + Calculation. Provenance and structural counts extracted but dropped at output. |
| v2 `Sigma.lean` | Working | 12 metas + 8 edge triples. **Behind canonical**: needs to grow to 25 metas + 26/29 edges. |
| v2 `Richness.lean` | Working | EdgeRow compile-time invariant for σ-typing; `m6Witnesses` enumeration. Foundation for v3. |
| v2 `examples/ZagrMarketplace.lean` | Working | Generated; will move to `_v2/` and be regenerated. |
| v3 `Profiles.lean` | Not started | New file. Defines `Profile`, `metaTypesInProfile`, `edgeTypesInProfile`. |
| v3 `Report.lean` | Not started | New file. Grader implementation. |
| Other 5 example specs | Have L1 markdown | No Lean instance files yet. |
| Discovery artifacts | **In progress (this doc)** | — |

## Known risks

1. **P3 obligation table is our derivation, not a doc citation**. Mitigated by graded-not-gated posture: too-strict rules become `WARN`s the author dismisses; dismissal patterns calibrate v4.
2. **Parser σ is incomplete vs canonical**. Will be addressed by Step 2 of v3 build sequence (parser additions).
3. **R_U signature gap in the canonical paper** (6 of 8 R_U edges have no σ-triple). v3 ships them with empty σ — any use becomes a `WARN`. Real fix is upstream in `domainspec-core` paper §4.2.
4. **Profile declaration mechanism is missing in `domainspec-core`**. v3 proposes `profile: paper-baseline` as frontmatter; needs upstream alignment.

## Open questions (to resolve in PROJECT-DECISIONS or HYPOTHESES)

1. Is the grader's primary deployment surface CLI, Lean `#eval`, JSON output, or all three?
2. Should the grader integrate with `domainspec-readiness-gate` as a check, or stay standalone?
3. Is the per-finding suppression mechanism (frontmatter dismissal keys) in scope for v3, or deferred to v4?
4. Who owns calibration — does the tool maintainer triage dismissals, or is this an automated metric?
5. What's the SLA for `#eval` performance on the largest in-repo spec? (P5's cycle-check could become the slow predicate.)
