# DomainSpec Copilot Agent Pack

This package provides reusable agents and commands for DomainSpec-driven development. It ships a unified user-facing orchestrator entrypoint, specialist lifecycle commands (still callable directly), advanced tuning commands, and internal bridge commands used by planner and implementer delegation flows.

## What Is Included

### Public Commands

| Command                             | Purpose                                                                                                                                                  |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domainspec-orchestrate`            | Unified user-facing entrypoint: interpret natural-language DomainSpec intent and route to the correct specialist command                                 |
| `domainspec-start`                  | Unified entrypoint: discovery, brownfield scope gates, project decisions baseline, and optional init                                                     |
| `domainspec-help`                   | Show command reference and recommend the next step                                                                                                       |
| `domainspec-init`                   | Bootstrap docs structure and governance baseline                                                                                                         |
| `domainspec-interview-scope`        | Run greenfield or brownfield discovery interviews before specification starts                                                                            |
| `domainspec-brownfield-translation` | Translate an implemented project into as-is DomainSpec feature specs plus governance and ontology gap artifacts                                          |
| `domainspec-decision-gate`          | Resolve blocker-level multi-option decisions and persist a decisions artifact before downstream mutation                                                 |
| `domainspec-pipeline`               | Run the full lifecycle with planner/work-pack gates for medium/high tasks before mutation (plan -> spec -> stories -> tests -> implementation -> verify) |
| `domainspec-spec-feature`           | Author or evolve feature specs and aspect documents                                                                                                      |
| `domainspec-sync-user-stories`      | Sync `STORIES.md` from capability and aspect docs                                                                                                        |
| `domainspec-sync-registry`          | Sync `docs/registry.md` and `docs/glossary.md` from specs                                                                                                |
| `domainspec-generate-tests`         | Derive backend and/or UI test obligations from docs                                                                                                      |
| `domainspec-implement`              | Implement backend code from approved contracts                                                                                                           |
| `domainspec-tag-code`               | Apply DomainSpec code tags after implementation and run extract/validate/drift checks                                                                    |
| `domainspec-ui-pipeline`            | Run the UI lifecycle from UI spec to implementation and audit                                                                                            |
| `domainspec-ui-architecture`        | Define or evolve project-wide UI architecture                                                                                                            |
| `domainspec-ui-implement`           | Implement frontend pages from `UI-SPEC.md`                                                                                                               |
| `domainspec-instrument-otel`        | Instrument backend with OTel metrics derived from docs                                                                                                   |
| `domainspec-otel-verify`            | Verify OTel coverage and produce observability report                                                                                                    |
| `domainspec-infra-architecture`     | Define infrastructure constitution and scaffold IaC                                                                                                      |
| `domainspec-infra-deploy`           | Sync deployment, monitoring, and alerts from docs                                                                                                        |
| `domainspec-audit-alignment`        | Audit docs-versus-code implementation alignment                                                                                                          |
| `domainspec-audit-layering`         | Audit layering drift and misplaced domain logic                                                                                                          |
| `domainspec-verify-feature`         | Produce PASS/FLAG/BLOCK readiness verdict                                                                                                                |
| `domainspec-readiness-gate`         | Unified profile-driven readiness gate (`pilot`, `release-candidate`, `production`)                                                                       |
| `domainspec-pilot-readiness`        | Prepare a feature for pilot rollout                                                                                                                      |

Recommended default: start from `domainspec-orchestrate`. All other `domainspec-*` specialist commands remain fully supported as advanced/internal direct invocations.

### Advanced Commands

| Command                      | Purpose                                                          |
| ---------------------------- | ---------------------------------------------------------------- |
| `domainspec-reflect`         | Summarize implementation outcomes and generate tuning directives |
| `domainspec-signal-observer` | Capture and aggregate async signal quality for review windows    |

### Agents

| Agent                          | Role                                                                              |
| ------------------------------ | --------------------------------------------------------------------------------- |
| `domainspec-orchestrator`      | Single user-facing intent router for DomainSpec workflows                         |
| `domainspec-planner`           | Builds dependency-ordered plans and orchestrates lifecycle delegation             |
| `domainspec-interviewer`       | Interviews operators and audits brownfield context to produce discovery baselines |
| `domainspec-spec-writer`       | Authors capability-driven specs and enforces story coverage                       |
| `mars-researcher`              | Navigates DomainSpec artifacts with structured research output                    |
| `domainspec-test-designer`     | Derives executable test obligations from formal docs                              |
| `domainspec-implementer`       | Implements from approved specs with audit and verification gates                  |
| `domainspec-code-tagger`       | Applies and validates source code tags after implementation changes               |
| `domainspec-registry-sync`     | Synchronizes registry and glossary from concept inventories                       |
| `domainspec-story-sync`        | Keeps stories aligned with evolving capabilities                                  |
| `domainspec-alignment-auditor` | Audits implementation fidelity against DomainSpec contracts                       |
| `domainspec-layering-auditor`  | Detects misplaced domain logic across layers                                      |
| `domainspec-verifier`          | Produces PASS/FLAG/BLOCK readiness verdicts                                       |
| `domainspec-ui-architect`      | Designs frontend architecture via interactive constraints                         |
| `domainspec-infra-architect`   | Defines infrastructure architecture and deployment contracts                      |
| `domainspec-otel-instrumenter` | Instruments backend code with OTel metrics                                        |
| `domainspec-otel-verifier`     | Verifies OTel coverage and emits remediation requests                             |

### Appendix: Internal Bridge Commands

These commands are shipped for orchestration internals and bridge DomainSpec flows into GSD phase workflows. They are agent-facing by default.

| Command                           | Installed Path                                            | Purpose                                                    |
| --------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------- |
| `domainspec-ui-phase-bridge`      | `.github/skills/domainspec-ui-phase-bridge/SKILL.md`      | Bridge UI phase orchestration to GSD execution when needed |
| `domainspec-ui-audit-bridge`      | `.github/skills/domainspec-ui-audit-bridge/SKILL.md`      | Bridge UI evidence into GSD UI audit pipeline              |
| `domainspec-plan-phase-bridge`    | `.github/skills/domainspec-plan-phase-bridge/SKILL.md`    | Bridge planner orchestration to GSD plan-phase flow        |
| `domainspec-execute-phase-bridge` | `.github/skills/domainspec-execute-phase-bridge/SKILL.md` | Bridge implementer execution to GSD execute-phase flow     |

### Context Search Heuristic

The planner and spec-writer agents use a weighted heuristic to choose the most efficient context discovery path before acting:

```
score = (1 - signal) × 0.45 + cost × 0.30 + ambiguity × 0.25
```

Strategies evaluated: `links-tags-first`, `broad-search-first`, `focused-researcher-first`, and `capability-graph-first`. A pre-filter shortcut skips scoring when SPEC frontmatter `includes` and `dependencies` fully resolve the file graph.

## Workflow

Run the unified orchestrator first:

```
@domainspec-orchestrator domainspec-orchestrate "<what you want to do>"
```

Common examples:

- `@domainspec-orchestrator domainspec-orchestrate "start DomainSpec in auto mode"`
- `@domainspec-orchestrator domainspec-orchestrate "run pipeline for payment-processing"`
- `@domainspec-orchestrator domainspec-orchestrate "generate tests for settlement-recovery"`

Then run the full pipeline:

```
@domainspec-planner domainspec-pipeline <feature>
```

Advanced direct stage commands (unchanged):

1. `domainspec-start [greenfield|brownfield|auto] [scope]`
2. `domainspec-init`
3. `domainspec-spec-feature <feature>`
4. `domainspec-sync-user-stories <feature>`
5. `domainspec-generate-tests <feature>`
6. `domainspec-implement <feature>`
7. `domainspec-tag-code <feature>`
8. `domainspec-ui-pipeline <feature>`
9. `domainspec-verify-feature <feature>`
10. `domainspec-readiness-gate <feature> --profile pilot|release-candidate|production`

## Installation

Use [INSTALL.md](INSTALL.md) for copy and verification steps. For maintainers, run `bash domainspec/tools/check_docs_sync.sh` after doc or pack changes to detect drift between docs and shipped assets.
