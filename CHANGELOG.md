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
6. **No implementation details** — describe *what* changed and *why it matters*, not internal wiring.

**Versioning:**

- **Major** — taxonomy or relationship semantics change that can alter interpretation of existing specs.
- **Minor** — new templates, new framework capabilities, or additive guidance.
- **Patch** — clarifications, wording improvements, and non-semantic fixes.

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
