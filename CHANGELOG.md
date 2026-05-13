# Changelog

All notable changes to the DomainSpec framework are documented in this file.

## Editing Policy

**Scope:** Track framework-level documentation and template evolution only. Project-specific feature docs belong in `../docs/CHANGELOG.md`.

**Rules:**

1. **Reverse chronological order** — newest version is always the first `## [x.y.z]` heading after this policy section. Never append at the bottom.
2. **Sequential versions** — increment from the latest version. Never skip numbers or insert between existing entries.
3. **One entry per version** — each `## [x.y.z]` block uses `### Added`, `### Changed`, `### Removed`, `### Fixed` at most once each. Never duplicate a section header.
4. **Verbosity matches complexity** — simple changes get one-liners; complex changes (new subsystem, taxonomy expansion) may use sub-bullets. Default to concise; expand only when enumeration adds clarity.
5. **Bold the key artifact** — start each bullet with `**artifact-or-concept**` followed by a dash and description.
6. **No implementation details** — describe _what_ changed and _why it matters_, not internal wiring.

**Versioning:**

- **Major** — taxonomy or relationship semantics change that can alter interpretation of existing specs.
- **Minor** — new templates, new framework capabilities, or additive guidance.
- **Patch** — clarifications, wording improvements, and non-semantic fixes.

---

## [2.0.12] - 2026-05-13

### Added

- **`domainspec-feature-architecture` skill** - new standalone command for creating or evolving a feature-level `architecture.md` companion document directly from DomainSpec feature contracts.
- **`architecture.md` feature template** - new default feature-architecture template for consumer-readable architecture summaries, flow diagrams, artifact tables, and guardrails.

### Changed

- **`domainspec-spec-feature` default artifacts** - spec writing now treats `architecture.md` as a default companion artifact and expects `SPEC.md` to link to it when present.
- **Spec-writer guidance** - spec-writer agent prompts and command routing docs now surface feature architecture authoring as a first-class part of the spec-authoring workflow.

## [2.0.11] - 2026-05-12

### Added

- **`domainspec-interview-kits` skill** - pluggable one-question-at-a-time interview system with a mode registry, `grill-with-docs` mode for spec pressure-testing, `robot-talks-grill-synthesis` mode for multi-perspective tension discovery, `readiness-gate` mode, and `audit-gap` mode. Modes are defined as individual files under `MODES/` and registered in `MODE-REGISTRY.md`.
- **`domainspec-interviewer-kits` Claude agent** - standalone Claude agent for the interview-kits system; can be invoked directly as an agent command.
- **Interviewer agent updated** - `domainspec-interviewer` agent now detects interview-kits intent (step 5) and delegates to `domainspec-interview-kits` before falling through to interactive discovery mode.
- **Orchestrator routing extended** - `domainspec-orchestrate` now routes spec grilling, decision pressure, gap closing, and Robot-Talks synthesis to `domainspec-interview-kits`; greenfield/brownfield scope discovery continues to route to `domainspec-interview-scope`.

## [2.0.10] - 2026-05-07

### Added

- **Generic terminal guard tool** - added `tools/terminal_guard.sh` with `nudge`, `run`, and `profile` modes to preflight risky command shapes, monitor command output, and suggest execution strategy improvements.

### Changed

- **Script search hardening** - added explicit `timeout 20s` guards for `rg` invocations in `tools/update_project_experiments_index.sh` and `implementation/domainspec/tools/check_markdown_links.sh` with safe fallback behavior.
- **Terminal resilience policy** - orchestrator and copilot instructions now reference preflight nudge + guarded run flows for risky commands beyond `rg`.

## [2.0.9] - 2026-05-07

### Added

- **Delegation stale-stage reconciler** - added `tools/reconcile_delegation_tuning.sh` to append terminal `failed` rows for stale `started` telemetry entries after watchdog expiry.

### Changed

- **Orchestrator terminal recovery invariants** - `domainspec-orchestrator` policy now requires pre-stage stale-row reconciliation, terminal break classification, and stage completion guarantees so `started` rows are never left without terminal outcomes.
- **Delegation telemetry operations guide** - updated `docs/signals/DELEGATION-TUNING.md` with auto-reconciliation workflow and stale-stage closure behavior.

## [2.0.8] - 2026-05-06

### Added

- **Delegation tuning ledger** - added `docs/signals/delegation-tuning.jsonl` as an append-only telemetry stream for delegated stage outcomes, retries, and stuck signals.
- **Delegation telemetry schema guide** - added `docs/signals/DELEGATION-TUNING.md` to define required JSONL fields and operational handling.

### Changed

- **Delegation policy rollout** - all DomainSpec delegator skills (pipeline, UI pipeline, start, bridges, implement, readiness flows) now require per-stage profile selection (`quick`, `standard`, `deep`) with cost-aware defaults.
- **Stuck recovery consistency** - delegated stages across delegator skills now apply one bounded retry with reduced thinking after suspected-stuck `high|xhigh` attempts before final BLOCK.
- **Telemetry failure handling** - delegation-capable commands now return explicit FLAG remediation when telemetry append fails, without hiding primary stage outcomes.

## [2.0.7] - 2026-05-06

### Changed

- **`domainspec-orchestrate` delegation tuning policy** - orchestration now applies stage-level model/thinking profiles (`quick`, `standard`, `deep`) to reduce latency while preserving risk-appropriate reasoning.
- **Stuck-retry de-escalation** - when a high-thinking delegated stage is suspected-stuck, orchestrator now retries once with reduced thinking and narrowed scope before final BLOCK.
- **Routing output diagnostics** - route decisions now include delegation profile and thinking budget fields for execution transparency.

## [2.0.6] - 2026-05-06

### Changed

- **`domainspec-orchestrate` subagent liveness verification** - orchestrator now applies a per-stage liveness gate, classifies suspected stuck delegates, retries once with bounded execution, and returns `blocked-at-<stage>(subagent-stuck)` when retry also fails.
- **Routing output contract visibility** - orchestrator route responses now include subagent verification state, stage health, and retry evidence so stuck stages are explicit.

## [2.0.5] - 2026-05-06

### Changed

- **`domainspec-orchestrate` delegation policy** - orchestration now requires delegated subagent execution for every routed specialist stage, including single-stage routes.
- **Spec-to-task synchronization gate** - any route that runs `domainspec-spec-feature` now requires a delegated task refresh/create stage before continuation.
- **`domainspec-pipeline` post-spec hard gate** - pipeline execution now enforces delegated work-pack and task refresh immediately after spec mutation.
- **Command guidance artifacts** - help and copilot package docs now describe orchestrator-enforced post-spec task synchronization behavior.

## [2.0.4] - 2026-05-05

### Changed

- **`domainspec-context-builder` strict relevance gate** — context selection now requires selector-level evidence and obligation binding for every included file; non-obligation context is excluded by default (`--strict` on).
- **Interested-data subset policy** — relationship context is now narrowed to the exact edge labels present in `SPEC.md` feature graph rather than loading full relationship catalogs.
- **Context index schema** — output index now requires `selected[].selectors`, `selected[].obligationRefs`, and `interestedData` subsets to make pack relevance auditable and deterministic.
- **Mode budgets hardened** — lean/standard/deep now enforce explicit file and excerpt-line limits with a capped noise ratio (`<= 0.15`).

## [2.0.3] - 2026-05-05

### Added

- **`domainspec-context-builder` skill** — new task-context preparation command that assembles minimal deterministic context packs from task links, docs indexes, architecture references, composability patterns, and symbol-level code snippets.
- **`domainspec-context-builder` agent** — specialized retrieval agent focused on link-first/index-first context selection with explicit inclusion/exclusion rationale and mode-based context budgets (`lean`, `standard`, `deep`).

### Changed

- **Orchestrator and help routing** — natural-language requests for implementation-context preparation now route to `domainspec-context-builder`, with guidance surfaced in command help and orchestrator policies.
- **Architecture retrieval topology** — architecture references now support context-builder workflows through the consolidated `architecture/` index + pattern-library layout while preserving root compatibility entrypoints.

## [2.0.2] - 2026-04-27

### Added

- **`domainspec-orchestrator` agent** — single user-facing DomainSpec entrypoint router that classifies natural-language intent and dispatches to specialist commands.
- **`domainspec-orchestrate` skill** — unified DomainSpec orchestration entry command with DomainSpec-only routing guardrails and advanced direct-command compatibility.

### Changed

- **Routing guidance** — copilot instruction routing now defaults natural-language DomainSpec requests to `domainspec-orchestrate` while preserving explicit `domainspec-*` behavior and existing GSD behavior.
- **Help and package docs** — `domainspec-help`, framework README, copilot README, and INSTALL guidance now recommend orchestrator-first usage and label direct stage commands as advanced/internal.
- **Installer messaging** — install script now prints orchestrator-first quick-start hints without changing install semantics.

## [2.0.1] - 2026-04-27

### Added

- **`domainspec-start` skill** — unified DomainSpec entrypoint for discovery, brownfield scope gating, project decision capture, and optional init delegation.
- **`project-decisions.md` template** — new project-level decision register for blocker-level choices required before feature pipelines.

### Changed

- **Interviewer wiring** — `domainspec-interviewer` now routes start-intent requests through `domainspec-start` and includes `PROJECT-DECISIONS.md` in discovery outputs.
- **Brownfield scope gates** — `domainspec-interview-scope`, `domainspec-init`, and `domainspec-pipeline` now enforce baseline artifact and blocker-decision checks for brownfield execution.
- **Command guidance** — `domainspec-help` now prioritizes `domainspec-start` when project baseline artifacts are missing.
- **README and copilot docs** — quick-start, workflow, command tables, and template references now include unified startpoint and project decisions baseline.

## [2.0.0] - 2026-04-25

### Added

- **Saga meta-concept** — promoted to a first-class backend meta-type for cross-feature transactional coordination with compensation.
- **Cross-feature relationship edges** — added `produces-for`, `triggers-cross`, and `enforces-cross` to model write-back, event-driven activation, and rule governance across feature boundaries.

### Changed

- **Derivation framing** — deterministic derivation is now explicitly scoped as per-feature for base ontology and extended with composition semantics for system-level cross-feature obligations.
- **Cross-feature composition guidance** — taxonomy, relationship guidance, and research paper framing now treat composition as incorporated evidence-backed capability rather than future-only conjecture.

## [1.8.2] - 2026-04-18

### Added

- **governance-baseline template** — new `templates/governance-baseline.md` for cross-feature day-0 governance defaults in project docs bootstrap.

### Changed

- **domainspec-init skill** — now bootstraps `docs/shared/governance-baseline.md` as part of initial project setup while keeping domain-specific governance blueprints as companion artifacts.
- **domainspec-pipeline skill** — pre-flight now validates governance baseline presence before feature execution, with compatibility fallback for existing `cash-game-management-governance.md` projects.
- **README and copilot docs** — quick start, workflow, and template references now include governance baseline as a first-class setup step.

## [1.8.1] - 2025-07-27

### Added

- **agent-runner template** — portable pattern for self-hosted GitHub Actions runner with Copilot CLI on VPS (sandboxed container, systemd service, setup script).
- **agent-cost signal type** — tracks premium requests, duration, and success rate for automated agent runs.
- **TH9 threshold** — flags agent spec for hardening when same agent has 2+ spec-compliance violations.
- **TH10 threshold** — alerts when agent-cost premiumRequests exceeds 50 in rolling 7-day window.
- **validate-tuning-report.ts** — CLI tool to validate TUNING-REPORT.md structure before PR creation.
- **Agent Runner add-on** — added to infra-architecture skill as optional add-on for single-vps+ presets.

### Changed

- **domainspec-tuning.yml** — replaced stubbed agent-reflect job with live self-hosted runner implementation using Copilot CLI, validation gate, and PR creation.
- **TUNING-LOOP.md** — replaced "Future: Cloud Agent Reflection" section with implemented architecture, security model, and cost tracking documentation.
- **analyze-signals.ts** — added TH9 (spec-compliance), TH10 (agent-cost) checks and agent-cost aggregation to output.
- **INFRA-SETUP.md** — added Agent Runner prerequisites section.

## [1.8.0] - 2026-04-16

### Added

- **PIPELINE-REPORT.md template** — template for economy of action metrics and reflection reports, used as format reference for tuning output.
- **SIGNAL-SCHEMA.md** — defines 8 signal types (step-verdict, alignment-gap, spec-gap, governance-gap, rework, overhead, decision, proposal, pattern) with JSON envelopes and 8 threshold conditions (TH1–TH8) for triggering async reflection.
- **`domainspec-reflect` skill** — evolved from synchronous pipeline step to asynchronous signal analyzer. Reads accumulated JSONL signals, detects cross-run patterns, and produces TUNING-REPORT.md with evidence-backed tuning proposals.
- **Pipeline Step 10 (Emit Signals)** — lightweight signal emission replaces synchronous reflection. Pipeline appends structured observations to `docs/signals/pipeline-signals.jsonl` without blocking.
- **`analyze-signals.ts` tool** — CLI tool that reads JSONL signals, computes aggregate metrics (overhead ratio, rework rate, first-pass rate), and checks thresholds. Exit code 1 = thresholds triggered. Supports `--json`, `--since`, `--min` flags.
- **`domainspec-tuning.yml` GitHub Action** — CI workflow triggered when signals are committed. Runs signal analysis, creates GitHub Issues when thresholds are met. Stubbed agent-reflection job for future cloud-based LLM analysis.

### Changed

- **Pipeline flow** — now: `plan → spec → stories → tests → implement → ui-pipeline → observability → instrument → otel-verify → infra-deploy → registry-sync → verify → emit-signals`.
- **ADLC-ALIGNMENT.md** — G2 (tuning loop) partially addressed with signal infrastructure. G4 (automated governance) partially addressed with threshold-based CI. G7/G8 updated to reflect async architecture. M-006 now tracked via overhead signals.

## [1.7.2] - 2026-04-16

### Added

- **Cross-feature stub prohibition (implement)** — `domainspec-implement` now explicitly forbids creating stub/placeholder files in another feature's directory. Cross-feature event-driven obligations must be documented in the consuming feature's SPEC.md under `## Deferred Obligations` instead of silently creating empty functions.
- **Stub and dead code scan (alignment)** — `domainspec-audit-alignment` now scans for stub markers (empty bodies, TODO comments, `_event` parameters), deprecated files importing non-existent modules, and verifies all `events.md` "Consumed by" handlers actually exist and are wired. Stubs → BLOCK, dead code → HIGH.
- **Cross-feature obligation check (verify)** — `domainspec-verify-feature` now scans for stub files in use-case/domain directories, checks `## Deferred Obligations` in SPEC.md, cross-references dependent features' event consumers, and flags dead code. Any stub → BLOCK.

## [1.7.1] - 2026-04-16

### Added

- **Infrastructure Binding audit (alignment)** — `domainspec-audit-alignment` now checks that every domain port has a real DB-backed adapter in production-path code. Detects stub/in-memory repos in route files and entry points. Verifies migration files, migrate runner, CI migration step, lifecycle hook wiring, and Dockerfile migration inclusion.
- **Production Readiness gate (verify)** — `domainspec-verify-feature` now includes a Production Readiness gate that BLOCKs when stub repos are bound in production code, migration infrastructure is missing, or lifecycle hooks are not wired into startup.
- **Post-implementation binding check (implement)** — `domainspec-implement` now runs an infrastructure binding scan after code generation: verifies real adapters, migration completeness, and lifecycle hook wiring before marking implementation as done.
- **Step 5b — Infrastructure Binding Gate (pipeline)** — `domainspec-pipeline` adds a mandatory gate between implementation and UI/observability steps. Scans for stub repos in production paths, validates migration file existence and CI/Dockerfile inclusion, and verifies seed/bootstrap hooks are wired into app startup.

## [1.7.0] - 2026-04-16

### Added

- **`domainspec-infra-architect` agent** — defines and maintains infrastructure architecture constitution. Detects existing infra, recommends graduated presets (Dev → Single VPS → Split VPS → HA), asks maximum 3 questions, scaffolds IaC + CI/CD + monitoring stack.
- **`domainspec-infra-architecture` skill** — interactive skill that produces `docs/INFRA-ARCHITECTURE.md` (infrastructure constitution), `docs/slos.md` (per-feature SLO targets), and scaffolds the `infra/` directory with Pulumi IaC, Docker Compose, Caddy, Prometheus, and GitHub Actions workflows. Automation-first: 3 manual inputs (VPS token, domain, DNS token), everything else generated. Default stack: DigitalOcean + Cloudflare + Pulumi (TypeScript) + Caddy (auto-TLS).
- **`domainspec-infra-deploy` skill** — infrastructure sync tool (like `domainspec-sync-registry` for infra). Regenerates `prometheus.yml` and alert rules from observability specs and SLO targets. Supports `--preview`, `--alerts-only`, and `--prometheus-only` flags.
- **`templates/infra-architecture.md`** — infrastructure constitution template with preset table, stack choices, networking, CI/CD pipeline, scaling roadmap with graduation triggers and migration checklists.
- **`templates/slos.md`** — SLO template linking per-feature availability, latency, and error rate targets to O-rule metrics. Includes alert expressions and error budget calculations.

### Changed

- **`domainspec-pipeline` skill** — added Step 7d (infrastructure deploy sync) between OTel verification and registry sync. New flag: `--skip-infra`. Pipeline is now 12 stages: plan → spec → stories → tests → implement → ui-pipeline → observability-spec → instrument-otel → otel-verify → infra-deploy → registry-sync → verify.
- **README.md** — added Stage 9 (Infrastructure & Deployment), updated pipeline diagram, project layout, skill/agent tables, and templates reference.

---

## [1.6.0] - 2026-04-16

### Added

- **`domainspec-otel-instrumenter` agent** — reads a feature's observability.md and instruments backend code with OTel API calls. Uses shared instruments from `infrastructure/telemetry/instruments.ts`, creates feature-specific instruments when needed, wraps use-cases with metric recording while preserving functional style.
- **`domainspec-instrument-otel` skill** — inner loop of the observability verification cycle. Parses YAML instrument blocks from observability.md, maps to code locations, instruments use-cases/entities. Supports `--dry-run` and `--change-requests` from verification reports.
- **`domainspec-otel-verifier` agent** — audits OTel instrumentation coverage against specs. Scans code for instrument registrations, classifies coverage (✅/⚠️/❌/🔄), generates change requests. Optional live metric verification via MCP Prometheus.
- **`domainspec-otel-verify` skill** — outer loop of the observability verification cycle. Produces OBSERVABILITY-REPORT.md per feature. Supports `--live` (MCP Prometheus queries), `--all` (multi-feature), and `--fix` (auto-invoke instrumenter for gaps, max 3 iterations).
- **`templates/OBSERVABILITY-REPORT.md`** — report template for instrumentation coverage audits. Coverage by rule, instrument detail table, live verification section, and prioritized change request table.
- **OTel infrastructure scaffold** — `backend/src/infrastructure/telemetry/` with shared instruments (O1–O16), Fastify HTTP metrics plugin (O8), Prometheus exporter setup, and meter factory. 20+ pre-built instruments covering all derivation rules.
- **MCP config** — `.vscode/mcp.json` with Playwright server.

### Changed

- **`domainspec-pipeline` skill** — Step 7 split into three sub-steps: 7a (derive spec, existing), 7b (instrument code, new), 7c (verify coverage, new). New flags: `--skip-instrumentation`, `--skip-otel-verify`. Pipeline is now: plan → spec → stories → tests → implement → UI → observability-spec → instrument-otel → otel-verify → registry-sync → verify (11 stages).

---

## [1.5.1] - 2026-04-15

### Changed

- **`domainspec-pipeline` skill** — observability derivation added as Step 7 (between UI and registry sync). New flag `--skip-observability`. Pipeline is now: plan → spec → stories → tests → implement → UI → observability → registry-sync → verify.
- **OBSERVABILITY.md** — all 16 derivation rules (O1–O16) migrated from Prometheus-style naming to OpenTelemetry semantic conventions. Meter scope = project name, `feature` as attribute, dot-separated names, typed instruments (Counter, Histogram, Gauge, UpDownCounter).
- **templates/observability.md** — rewritten to OTel instrument declarations.
- **ARCHITECTURE.md** — metrics convention description updated to OTel.

---

## [1.5.0] - 2026-04-15

### Added

- **OBSERVABILITY.md** — observability-as-code framework with 16 metric derivation rules (O1–O16) across 3 layers (Domain Fidelity, Operational Health, Business Effectiveness) plus a Financial Integrity layer mandatory for `pillar: finance` features. Includes metric naming convention, traceability annotations (`@source`, `@rule`, `@constraint`), and alert severity mapping (P0–P3).
- **templates/observability.md** — per-feature observability spec template with all 16 rules pre-structured.
- **Stage 8 — Derive Observability Metrics** — added to the pipeline in README.md and ARCHITECTURE.md.

## [1.4.0] - 2026-04-15

### Added

- **`domainspec-pipeline` skill** — end-to-end feature lifecycle orchestrator. Single command runs: plan → spec → stories → tests → implement → UI → registry sync → verify. Flags: `--spec-only`, `--test-only`, `--backend-only`, `--skip-ui`, `--dry-run`.
- **UI Meta-Concept Taxonomy** — 11 new UI types (Page, Layout, Component, View Model, Hook, Form, Action, Guard, Binding, Adapter, State Indicator) extending TAXONOMY.md from 13 to 24 building blocks. Each maps to a backend counterpart.
- **UI Relationship Edges** — 8 intra-UI edges (`renders`, `wraps`, `composes`, `consumes`, `submits`, `shapes`, `protects`, `displays`) + 6 cross-layer edges (`fetches`, `mutates`, `reflects`, `derives`, `contracts`, `mirrors`). RELATIONSHIPS.md grows from 12 to 26 typed edges.
- **`ui-spec.md` template** — typed concept inventory, data flow, form contracts, state-to-UI mapping, and UI Concept Registry section.

### Changed

- **TAXONOMY.md** — overview, quick reference, common confusion, and architecture mapping all split into Backend and UI sections.
- **RELATIONSHIPS.md** — overview split into Backend, Intra-UI, and Cross-Layer tables; navigation section adds UI and full-stack trace subsections.

## [1.3.0] - 2026-04-15

### Added

- **UI architecture lifecycle** — new `ui-architecture.md` template, `domainspec-ui-architect` agent, and skills for UI-ARCHITECTURE, UI-SPEC generation (`domainspec-ui-phase-bridge`), frontend implementation (`domainspec-ui-implement`), and visual audit (`domainspec-ui-audit-bridge`).
- **`domainspec-ui-pipeline` skill** — end-to-end UI lifecycle: architecture check → UI-SPEC → E2E tests → implement → audit. Flags: `--spec-only`, `--skip-audit`, `--dry-run`.
- **Playwright E2E test generation** — TEST-PIPELINE.md extended with rules 15–20 (Navigation, Journey, Form Validation, State Reflection, Responsive, Accessibility). `domainspec-generate-tests` supports `--ui` and `--all` flags.
- **MCP Playwright integration** — `install.sh` auto-detects web app, installs Playwright, and generates `.vscode/mcp.json`. Skippable via `DOMAINSPEC_SKIP_PLAYWRIGHT=1`.

### Changed

- **Planner agent** — new UI detection gate (step 4) auto-includes UI architecture, UI-SPEC, implementation, audit, and E2E tasks based on feature state.
- **Agent updates** — spec-writer (capability-driven structure, story coverage enforcement), planner (context heuristic, subagent delegation), researcher (DomainSpec-aware navigation, structured output), implementer (audit gates before edits).
- **Heuristic weights** — tuned from `0.45/0.35/0.20` to `0.45/0.30/0.25` (signal/cost/ambiguity) to reflect cheaper search via index artifacts.

## [1.2.0] - 2026-04-14

### Added

- **Context search heuristic** — agents evaluate 4 discovery strategies (`links-tags-first`, `broad-search-first`, `focused-researcher-first`, `capability-graph-first`) with weighted scoring. Pre-filter shortcut when SPEC frontmatter `includes`/`dependencies` resolve the file graph. Validated by 9 test scenarios at 100% accuracy.
- **`domainspec-story-sync` agent** — maintains STORIES files aligned with capability and aspect changes.
- **Researcher structured output** — callers receive `featureArtifacts`, `relevantContracts`, `namingConstraints`, `linkGraph`, `matchedTags`, `openQuestions`, `recommendation`.

## [1.1.1] - 2026-04-09

### Added

- **`domainspec-layering-auditor` agent** — detects domain-logic drift into application/use-case layers.
- **`domainspec-audit-layering` skill** — produces deterministic remediation plans tied to DomainSpec concepts.

### Changed

- **Planning/implementation workflows** — now expected to include a layering audit gate for features with existing code.

## [1.1.0] - 2026-04-08

### Added

- **DomainSpec-GSD delegation contract** — planner/implementer support explicit mode selection (`native` or `gsd-phase`). Verification skills recognize GSD evidence artifacts under `.planning/phases/**`.

### Changed

- **Delegation authority model** — DomainSpec artifacts are source of truth for semantics; GSD provides orchestration only.

## [1.0.2] - 2026-03-29

### Changed

- **Copilot skills** — all `domainspec-*` skills now read CHANGELOG.md before running workflows.

## [1.0.1] - 2026-03-29

### Changed

- **Copilot agents** — all DomainSpec agents now treat CHANGELOG.md as a mandatory initial read.

## [1.0.0] - 2026-03-29

### Added

- **Framework foundation** — TAXONOMY.md (13 meta-concept types), RELATIONSHIPS.md (typed concept edges), TEST-PIPELINE.md (doc-to-test transformation rules).
- **Templates** — SPEC.md, domain.md, operations.md, states.md, interfaces.md, events.md, queries.md, workflows.md, mappings.md, shared-value-object.md.
- **Starter scaffolding** — registry.md and glossary.md seeds under `starter/`.
- **Reference examples** — full payment-processing feature slice and shared money value object.
- **Copilot integration pack** — installable commands, skills, and agents under `copilot/`.

### Changed

- **README.md** — codifies the framework operating model: domain docs → formal states → tests → implementation. Separates framework assets (`domainspec/`) from project docs (`docs/`).
