# Refine Seed Proposal: Governance Attenuation Scriptability

Run ID: `20260615T043712Z-governance-attenuation-scriptability`  
Target: `implementation/domainspec/GOVERNANCE-ATTENUATION.md`  
Preset: `standard`  
Research mode: `no-research`

## Operator Intent

Apply the governance attenuation analysis and identify which governance duties can be done by scripts instead of by more agent instructions.

## Refinement Objective

Turn the attenuation document into a scriptability map: what is already script-backed, what can become deterministic tooling with modest work, what still needs observer telemetry, and what should remain human or policy-owned.

## Source Context

`GOVERNANCE-ATTENUATION.md` argues that additional governance layers reduce enforcement fidelity because signal emission is late, observer and executor roles are conflated, and instruction sources saturate the LLM instruction channel. Its preferred intervention is not more prose; it is structural enforcement:

- split observer from executor,
- compute artifact-level signals deterministically,
- use telemetry for behavior-level signals,
- collapse redundant governance rules,
- make L6 continuous through CI/pre-commit gates,
- formalize L4 through constitution and axiom files.

The companion `GOVERNANCE-ATTENUATION-EXECUTION-BOARD.md` already decomposes this into waves, including deterministic signal detection, telemetry bundle construction, CI gates, dual-phase observers, and governance pruning.

## Existing Script Surface

These scripts already move parts of the attenuation model out of instructions:

| Script                                                                                | Existing responsibility                                                                                                           | Refinement finding                                                                                                                         |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `implementation/domainspec/tools/detect-signals.ts`                                   | Emits deterministic `alignment-gap`, `spec-gap`, and scope-drift `governance-gap` signals from git diff and feature/spec context. | Good base for artifact-level detectors, but path defaults assume an installed `domainspec/` layout and feature path conventions.           |
| `implementation/domainspec/tools/run-fast-observer.ts`                                | Runs deterministic detection and signal validation as a fast blocking observer.                                                   | Script-backed L6 gate exists; needs CI/pre-commit wiring and source-layout-safe paths.                                                     |
| `implementation/domainspec/tools/build-telemetry-bundle.ts`                           | Builds compact session telemetry with changed files, diff summary, patch snippet, ordered command events, and test events.        | Directly supports the behavior-level telemetry proxy in the attenuation doc.                                                               |
| `implementation/domainspec/tools/run-async-observer.ts`                               | Reads telemetry bundle and emits behavior-level `rework`, `pattern`, and scope-drift signals.                                     | Already implements the async observer shape, but it is lightweight and should be linked to bundle production.                              |
| `implementation/domainspec/tools/validate-signals.ts`                                 | Validates signal envelope, enums, category mapping, source, duplicate hints, and completeness invariants.                         | Strong candidate for a required gate before signal data can drive reflection/pruning.                                                      |
| `implementation/domainspec/tools/analyze-signals.ts`                                  | Aggregates signals and checks TH1-TH10 thresholds including recurring governance gaps.                                            | Existing reflection trigger; needs source-layout-safe input defaults.                                                                      |
| `implementation/domainspec/tools/prune-governance.ts`                                 | Produces a zero-evidence governance prune report from constitution rules and signal data.                                         | Already encodes the Via Negativa protocol; needs path resolution and stronger rule matching.                                               |
| `implementation/domainspec/tools/generate-meta-health.ts`                             | Computes meta-health metrics such as orphan rate, L6 friction, volatility, governance ratio, and overhead.                        | Fits attenuation tracking, but depends on registry/signals path availability.                                                              |
| `implementation/domainspec/tools/validate-governance-chain.ts`                        | Checks AXIOMS and CONSTITUTION rule-to-gate mappings.                                                                             | Encodes L4/L5 policy chain validation, but currently looks for `domainspec/AXIOMS.md` and `domainspec/CONSTITUTION.md` from the repo root. |
| `implementation/domainspec/governance/tags/tools/*`                                   | Extracts, validates, checks composability, and compares code-tag drift.                                                           | Strongest current G11-style script surface for spec-code binding.                                                                          |
| `implementation/domainspec/tools/check_markdown_links.sh` and `validate-doc-links.ts` | Validate links in governance/docs artifacts.                                                                                      | Good fit for docs completeness gates.                                                                                                      |

## Live Probe Results

Commands were run from `/home/vrondelli/projects/domainspec-core` on 2026-06-15.

| Probe                                                                                                                                           | Result                                                                   | Meaning                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dlx tsx implementation/domainspec/tools/validate-governance-chain.ts --json`                                                              | `block`: missing `domainspec/AXIOMS.md`, `domainspec/CONSTITUTION.md`    | Script exists but is source-layout blind in this umbrella checkout.                                                             |
| `pnpm dlx tsx implementation/domainspec/tools/analyze-signals.ts --json --min 1`                                                                | `pass`: reported no `docs/signals/pipeline-signals.jsonl` at parent root | Analyzer runs, but default input assumes a different root than `implementation/domainspec/docs/signals/pipeline-signals.jsonl`. |
| `pnpm dlx tsx implementation/domainspec/tools/validate-signals.ts --input implementation/domainspec/docs/signals/pipeline-signals.jsonl --json` | `block`: existing lines fail the current signal envelope                 | Validator works; existing signal ledger appears legacy or schema-divergent and needs migration/strict-window policy.            |
| Parallel `npx tsx ...` probes                                                                                                                   | `block`: npm `_npx` cache race                                           | Runner guidance should prefer sequential `pnpm dlx tsx` or local package scripts for validation probes.                         |

## Scriptability Classification

### Use Existing Scripts Now

- Signal envelope validation: `validate-signals.ts`.
- Signal threshold analysis: `analyze-signals.ts`, after path defaults are corrected.
- Artifact-level deterministic detection: `detect-signals.ts`.
- Fast blocking observer: `run-fast-observer.ts`.
- Telemetry bundle construction: `build-telemetry-bundle.ts`.
- Async behavior observer: `run-async-observer.ts`.
- Code-tag extraction/validation/composability/drift: `governance/tags/tools/*`.
- Link validation: `check_markdown_links.sh` and `validate-doc-links.ts`.

### Script Next

- Source-vs-installed path resolver shared by governance tools.
- Governance attenuation audit command that runs the current detector/observer/validator/prune/meta-health scripts in one deterministic report.
- Signal ledger migration or compatibility checker for legacy lines.
- Rule usage evidence mapper that links `shouldHaveBeenCaughtBy` values to concrete constitution rule IDs more robustly than keyword matching.
- CI/pre-commit wrapper that makes L6 continuous instead of manually triggered.

### Keep As Policy Or Human Gate

- Deciding whether a zero-evidence rule protects catastrophic risk.
- Approving deletion or collapse of governance instructions.
- Changing canonical constitution/axiom semantics.
- Interpreting ambiguous behavior-only signals where telemetry lacks prompt/scope context.

## Write Scope

This refine run writes only under:

`implementation/domainspec/development/refinement-runs/20260615T043712Z-governance-attenuation-scriptability/`

It does not mutate governance implementation files, scripts, CI, or source docs during the strategy proposal phase.

## Done Criteria For This Refine Run

- A dispatch route exists and validates before runtime-backed stages execute.
- The final synthesis identifies script-backed, script-next, and policy-only governance duties.
- The plan recommends executable next work without changing canonical governance docs during refine.
- Any source-layout or signal-schema blockers are recorded as residue, not silently worked around.

## Planned Stage Configuration

The canonical ten-stage refine loop will run with `no-research`, local repository evidence only, and no subagents. Runtime-backed stages remain pending until the operator confirms the strategy.
