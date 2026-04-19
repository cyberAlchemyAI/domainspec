# Governance Attenuation Execution Board

Last updated: 2026-04-18  
Scope: DomainSpec source first, then root project harness mirror  
Primary reference: [GOVERNANCE-ATTENUATION.md](GOVERNANCE-ATTENUATION.md)

## Locked Planning Decisions

1. Authority scope: DomainSpec source first, root harness second.
2. Observer model: Dual-phase observer.
3. Enforcement level: Immediate blocking.
4. Telemetry depth: Full trace.
5. Rollout strategy: Big bang.
6. Planning mode: Hybrid by wave.
7. Observer trigger: Dual-phase.
8. Telemetry capture point: Tool-wrapper layer.

## Execution Modes By Wave

1. Wave 0: Native (docs-only).
2. Wave 1: gsd-phase (cross-cutting tooling + telemetry).
3. Wave 2: gsd-phase (spec-code binding + registry).
4. Wave 3: gsd-phase (blocking governance gates + remediation).
5. Wave 4: Hybrid (blocking fast observer + async deep observer).
6. Wave 5: Native async (continuous tuning and pruning).

## Roadmap At A Glance

| Wave | Goal | Mode | Target Duration | Gate Type |
|---|---|---|---|---|
| 0 | Governance contract hardening | native | 2-3 days | docs completeness |
| 1 | Deterministic signal engine + telemetry | gsd-phase | 4-5 days | tooling correctness |
| 2 | Canonical spec-code binding | gsd-phase | 4-6 days | binding and orphan controls |
| 3 | Immediate blocking governance + layering remediation | gsd-phase | 1-2 weeks | CI blocking gates |
| 4 | Dual-phase observer rollout | hybrid | 4-6 days | signal quality and coverage |
| 5 | Governance pruning and tuning loop | native async | ongoing | continuous improvement |

## Ticket Index

| Ticket | Wave | Owner | Estimate | Depends On | Trace IDs |
|---|---|---|---|---|---|
| W0-T1 | 0 | docs | 0.5d | - | G13, G14, G16, GOV-A06 |
| W0-T2 | 0 | docs + framework | 0.5d | W0-T1 | GOV-A05, GOV-A07 |
| W0-T3 | 0 | framework | 0.5d | W0-T2 | GOV-A07 |
| W0-T4 | 0 | docs + tools | 0.5d | W0-T2 | link-validation, GOV-A06 |
| W1-T1 | 1 | tools | 1d | W0 gate | GOV-A03, GOV-A04 |
| W1-T2 | 1 | tools | 1d | W1-T1 | GOV-A03 |
| W1-T3 | 1 | platform + tools | 1d | W1-T1 | GOV-A01, telemetry-full-trace |
| W1-T4 | 1 | tools | 1d | W1-T2, W1-T3 | GOV-A03, GOV-A04 |
| W1-T5 | 1 | backend + tools | 0.5d | W1-T4 | TH1-TH10 readiness |
| W2-T1 | 2 | backend | 1d | W1 gate | G11, GOV-A07 |
| W2-T2 | 2 | tools | 1d | W2-T1 | G12, GOV-A07 |
| W2-T3 | 2 | tools + platform | 1d | W2-T2 | GOV-A03, GOV-A04, LD-05 |
| W2-T4 | 2 | docs + tools | 0.5d | W2-T2 | link-validation |
| W3-T1 | 3 | platform | 0.5d | W2 gate | GOV-A02, G4 |
| W3-T2 | 3 | platform + architecture | 0.5d | W3-T1 | GOV-A02, LD-01..LD-05 |
| W3-T3 | 3 | platform + tools | 0.5d | W3-T1 | GOV-A05, GOV-A04 |
| W3-T4 | 3 | backend-core | 4-8d | W3-T2, W3-T3 | LD-01..LD-05 |
| W3-T5 | 3 | docs | 0.5d | W3-T4 | remediation-track |
| W4-T1 | 4 | tools + platform | 1d | W3 gate | GOV-A01, GOV-A03 |
| W4-T2 | 4 | framework | 1.5d | W4-T1 | GOV-A01 |
| W4-T3 | 4 | framework + platform | 1d | W4-T2 | pipeline-step-11 |
| W4-T4 | 4 | tools + architecture | 0.5d | W4-T3 | TH1-TH10 tuning |
| W5-T1 | 5 | framework | 0.5d | W4 gate | Via-Negativa, GOV-A06 |
| W5-T2 | 5 | framework | 0.5d | W5-T1 | G2, G8, M-001..M-006 |
| W5-T3 | 5 | platform (optional) | 0.5d | W5-T2 | G15 |

## Wave 0 Tickets

### W0-T1 - Formalize Governance Constitution And Axioms

Owner: docs  
Estimate: 0.5 day  
Dependencies: none  
Trace IDs: G13, G14, G16, GOV-A06

Deliverables:
1. CONSTITUTION section added to governance artifacts with explicit rules.
2. AXIOMS section added with evidence-based justifications.
3. Rule-to-axiom-to-gate mapping table.

Acceptance criteria:
1. Every governance rule has an explicit axiom.
2. Every axiom references at least one enforcement gate.
3. No orphan rule or orphan axiom remains.

Command checklist:
```bash
npm run docs:index
```

### W0-T2 - Normalize Signal Contract Across Sources

Owner: docs + framework  
Estimate: 0.5 day  
Dependencies: W0-T1  
Trace IDs: GOV-A05, GOV-A07

Deliverables:
1. Signal envelope and enums aligned in schema and skill docs.
2. Category, severity, and id format are canonical.
3. Emission policy for decision and completeness is explicitly defined.

Acceptance criteria:
1. No conflicting signal type/category definitions across schema and skills.
2. Policy text is consistent in all emit-signal instruction surfaces.

Command checklist:
```bash
npx tsx domainspec/tools/analyze-signals.ts --json
```

### W0-T3 - Canonical Source + Sync Guard

Owner: framework  
Estimate: 0.5 day  
Dependencies: W0-T2  
Trace IDs: GOV-A07

Deliverables:
1. Canonical source declaration for domainspec and root mirror.
2. Sync guard policy for duplicate skill/instruction files.
3. No ambiguous source-of-truth path remains.

Acceptance criteria:
1. DomainSpec-first authority is explicit and testable.
2. Mirror policy states when and how root copies are updated.

Command checklist:
```bash
git diff --name-only | grep -E "^domainspec/|^\.github/" | sort -u
```

### W0-T4 - Markdown Link Validation Baseline

Owner: docs + tools  
Estimate: 0.5 day  
Dependencies: W0-T2  
Trace IDs: link-validation, GOV-A06

Deliverables:
1. Link validation checklist covering concept, type, and field references.
2. Validation path for governance docs and feature docs.

Acceptance criteria:
1. All referenced concept links resolve.
2. Broken links fail validation path.

Command checklist:
```bash
npm run docs:index
```

Wave 0 gate:
1. W0-T1..W0-T4 complete.
2. Signal contract and governance contract are stable.

## Wave 1 Tickets

### W1-T1 - Build Signal Schema + Completeness Validator

Owner: tools  
Estimate: 1 day  
Dependencies: Wave 0 gate  
Trace IDs: GOV-A03, GOV-A04

Deliverables:
1. Validator for signal envelope and enum constraints.
2. Completeness invariants.
3. Failing exit code on contract violations.

Acceptance criteria:
1. retriesNeeded > 0 implies at least one rework signal for session.
2. step-verdict presence implies overhead signal for session.
3. Invalid category/id/severity is rejected.

Command checklist:
```bash
npx tsx domainspec/tools/analyze-signals.ts --json
```

### W1-T2 - Deterministic Artifact-Level Detectors

Owner: tools  
Estimate: 1 day  
Dependencies: W1-T1  
Trace IDs: GOV-A03

Deliverables:
1. alignment-gap detector from spec/code diff.
2. spec-gap detector from TODO/FIXME/assumption markers.
3. governance-gap detector from scope drift in changed paths.
4. rework detector from repeated file mutations per session.

Acceptance criteria:
1. Detectors emit valid signals through W1-T1 validator.
2. Detectors run without LLM dependency.

Command checklist:
```bash
npx tsx domainspec/tools/analyze-signals.ts --since 2026-04-01 --json
```

### W1-T3 - Full-Trace Telemetry Capture At Tool Wrapper

Owner: platform + tools  
Estimate: 1 day  
Dependencies: W1-T1  
Trace IDs: GOV-A01, telemetry-full-trace

Deliverables:
1. Ordered tool/command event capture.
2. Incremental diff snapshot capture per step.
3. Test command output capture with timestamps.

Acceptance criteria:
1. Telemetry bundle exists for each non-trivial session.
2. Bundle is queryable by session id.

Command checklist:
```bash
# verify at least one recent session has trace payload
wc -l docs/signals/pipeline-signals.jsonl
```

### W1-T4 - Telemetry Bundle Builder

Owner: tools  
Estimate: 1 day  
Dependencies: W1-T2, W1-T3  
Trace IDs: GOV-A03, GOV-A04

Deliverables:
1. Compact session bundle format for observer input.
2. Bundle includes ordered events, diff snapshots, and test output chronology.

Acceptance criteria:
1. Observer-ready bundle generated for each session.
2. Bundle size remains bounded and deterministic.

Command checklist:
```bash
npx tsx domainspec/tools/analyze-signals.ts --json
```

### W1-T5 - Detector And Telemetry Test Pack

Owner: backend + tools  
Estimate: 0.5 day  
Dependencies: W1-T4  
Trace IDs: TH1-TH10 readiness

Deliverables:
1. Regression tests for validators and detectors.
2. Golden fixture tests for telemetry bundles.

Acceptance criteria:
1. Test suite catches schema and completeness regressions.
2. Deterministic detector outputs are stable for fixtures.

Command checklist:
```bash
npm run test:backend
npm run typecheck --workspace backend
```

Wave 1 gate:
1. W1-T1..W1-T5 complete.
2. Deterministic detector + telemetry pipeline is stable.

## Wave 2 Tickets

### W2-T1 - Adopt @biz/@sys Annotation Convention

Owner: backend  
Estimate: 1 day  
Dependencies: Wave 1 gate  
Trace IDs: G11, GOV-A07

Deliverables:
1. Annotation spec for domain exports and key symbols.
2. Initial annotation pass on implemented slices.

Acceptance criteria:
1. Public domain behavior has explicit anchors.
2. Annotation format is machine-parseable.

Command checklist:
```bash
grep -R "@biz\|@sys" backend/src/domain | wc -l
```

### W2-T2 - Registry Generator For Concept Graph

Owner: tools  
Estimate: 1 day  
Dependencies: W2-T1  
Trace IDs: G12, GOV-A07

Deliverables:
1. Registry generated from SPEC concepts + code anchors.
2. Concepts, edges, and coverage metadata emitted.

Acceptance criteria:
1. Registry generation is deterministic.
2. Registry is computed artifact, not canonical authored content.

Command checklist:
```bash
npm run docs:index
```

### W2-T3 - Orphan And Undefined Anchor Blocker

Owner: tools + platform  
Estimate: 1 day  
Dependencies: W2-T2  
Trace IDs: GOV-A03, GOV-A04, LD-05

Deliverables:
1. Orphan detector for concept-without-code.
2. Undefined anchor detector for code-without-concept.
3. Blocking mode for critical/high violations.

Acceptance criteria:
1. CI fails on undefined concept anchors.
2. CI fails on orphan concepts marked required.

Command checklist:
```bash
npx tsx domainspec/tools/analyze-signals.ts --json
```

### W2-T4 - Frontmatter And Link Graph Validator

Owner: docs + tools  
Estimate: 0.5 day  
Dependencies: W2-T2  
Trace IDs: link-validation

Deliverables:
1. dependencies/includes validation across feature docs.
2. Concept anchor link validation.

Acceptance criteria:
1. Broken includes/dependencies fail validation.
2. Missing concept anchors are reported with exact file references.

Command checklist:
```bash
npm run docs:index
```

Wave 2 gate:
1. W2-T1..W2-T4 complete.
2. Binding and orphan controls are enforced.

## Wave 3 Tickets

### W3-T1 - Immediate Blocking Governance Workflow

Owner: platform  
Estimate: 0.5 day  
Dependencies: Wave 2 gate  
Trace IDs: GOV-A02, G4

Deliverables:
1. governance-gates workflow with blocking status checks.
2. Trigger matrix for docs, backend, and governance files.

Acceptance criteria:
1. PRs with critical/high governance violations are blocked.
2. Check outputs are actionable and reference failing artifacts.

Command checklist:
```bash
npm run test:backend
npm run typecheck --workspace backend
```

### W3-T2 - Mandatory Parallel Alignment + Layering Audits

Owner: platform + architecture  
Estimate: 0.5 day  
Dependencies: W3-T1  
Trace IDs: GOV-A02, LD-01..LD-05

Deliverables:
1. CI executes alignment and layering audits in parallel.
2. Consolidated remediation obligations artifact.

Acceptance criteria:
1. Any BLOCK from either audit blocks merge.
2. Findings are merged in dependency order.

Command checklist:
```bash
npm run test:backend
```

### W3-T3 - Signal Contract Validator In CI

Owner: platform + tools  
Estimate: 0.5 day  
Dependencies: W3-T1  
Trace IDs: GOV-A05, GOV-A04

Deliverables:
1. CI validation of signal schema and completeness rules.
2. Rejection of malformed or incomplete session signals.

Acceptance criteria:
1. Invalid category/id/severity cannot be merged.
2. Session completeness invariants are enforced.

Command checklist:
```bash
npx tsx domainspec/tools/analyze-signals.ts --json
```

### W3-T4 - Layering Remediation Big-Bang Pass

Owner: backend-core  
Estimate: 4-8 days  
Dependencies: W3-T2, W3-T3  
Trace IDs: LD-01, LD-02, LD-03, LD-04, LD-05

Deliverables:
1. Policy logic extracted from infrastructure into domain services.
2. Explicit lifecycle transition enforcement where required.
3. Event emission at operation boundaries.
4. Repository port boundaries hardened.
5. Orphan concepts remediated.

Acceptance criteria:
1. Use-cases orchestrate, domain decides, infra adapts.
2. No high/critical layering drift remains in covered slices.
3. Required operations in SPEC have code anchors.

Command checklist:
```bash
npm run test:backend
npm run typecheck --workspace backend
```

### W3-T5 - Consolidated Remediation Report

Owner: docs  
Estimate: 0.5 day  
Dependencies: W3-T4  
Trace IDs: remediation-track

Deliverables:
1. Single remediation document merging alignment and layering outcomes.
2. Before/after metrics including orphan rate and gap count.

Acceptance criteria:
1. Every LD finding has explicit status.
2. Deferred items include rationale and next trigger.

Command checklist:
```bash
npm run docs:index
```

Wave 3 gate:
1. W3-T1..W3-T5 complete.
2. Blocking governance gates are active and stable.

## Wave 4 Tickets

### W4-T1 - Fast Blocking Observer Stage

Owner: tools + platform  
Estimate: 1 day  
Dependencies: Wave 3 gate  
Trace IDs: GOV-A01, GOV-A03

Deliverables:
1. Fast observer runs deterministic checks pre-close.
2. Critical violations block completion.

Acceptance criteria:
1. Fast observer catches contract-breaking issues before close.
2. Observer output is valid against signal contract.

Command checklist:
```bash
npx tsx domainspec/tools/analyze-signals.ts --json
```

### W4-T2 - Async Deep Observer Agent

Owner: framework  
Estimate: 1.5 days  
Dependencies: W4-T1  
Trace IDs: GOV-A01

Deliverables:
1. Read-only deep observer over telemetry bundles.
2. Behavior-level signal extraction.

Acceptance criteria:
1. Detects fail-fix-retest loops, scope drift, and implicit decisions.
2. Emits valid non-duplicate signals.

Command checklist:
```bash
wc -l docs/signals/pipeline-signals.jsonl
```

### W4-T3 - Pipeline Integration Step 11

Owner: framework + platform  
Estimate: 1 day  
Dependencies: W4-T2  
Trace IDs: pipeline-step-11

Deliverables:
1. Pipeline step for async observer dispatch.
2. Session id linkage between fast and deep observer outputs.

Acceptance criteria:
1. Fast + async observer outputs are correlated by session id.
2. No duplicate emission between stages.

Command checklist:
```bash
npx tsx domainspec/tools/analyze-signals.ts --json
```

### W4-T4 - Threshold Recalibration

Owner: tools + architecture  
Estimate: 0.5 day  
Dependencies: W4-T3  
Trace IDs: TH1-TH10 tuning

Deliverables:
1. Threshold calibration pass using new observer signal mix.
2. False-positive and false-negative review.

Acceptance criteria:
1. Threshold set reflects actual signal distribution.
2. Critical governance gaps remain high sensitivity.

Command checklist:
```bash
npx tsx domainspec/tools/analyze-signals.ts --since 2026-04-01 --json
```

Wave 4 gate:
1. W4-T1..W4-T4 complete.
2. Dual-phase observer is operational in production workflow.

## Wave 5 Tickets

### W5-T1 - Governance Pruning Protocol

Owner: framework  
Estimate: 0.5 day  
Dependencies: Wave 4 gate  
Trace IDs: Via-Negativa, GOV-A06

Deliverables:
1. 10-run and 20-run review protocol.
2. Rule candidacy scoring for removal.

Acceptance criteria:
1. Low-yield governance rules are surfaced with evidence.
2. Catastrophic-risk rules are protected from automatic removal.

Command checklist:
```bash
npx tsx domainspec/tools/analyze-signals.ts --json
```

### W5-T2 - Reflect Skill Governance Health Extension

Owner: framework  
Estimate: 0.5 day  
Dependencies: W5-T1  
Trace IDs: G2, G8, M-001..M-006

Deliverables:
1. Governance health block in reflection output.
2. Metrics for orphan rate, governance ratio, overhead ratio, and closure rate.

Acceptance criteria:
1. Reflection report includes governance attenuation trends.
2. Proposed tuning actions map to measured gaps.

Command checklist:
```bash
npx tsx domainspec/tools/analyze-signals.ts --json
```

### W5-T3 - Optional Meta-Health Dashboard

Owner: platform (optional)  
Estimate: 0.5 day  
Dependencies: W5-T2  
Trace IDs: G15

Deliverables:
1. Dashboard or markdown report for M-001..M-006 trendlines.

Acceptance criteria:
1. Leadership-ready summary exists with trend direction.
2. Links to raw signal evidence are included.

Command checklist:
```bash
npx tsx domainspec/tools/analyze-signals.ts --json
```

Wave 5 gate:
1. W5-T1 and W5-T2 complete.
2. W5-T3 optional but recommended.

## Global Verification Pack

Run at each wave gate:

```bash
npm run docs:index
npm run test:backend
npm run typecheck --workspace backend
npx tsx domainspec/tools/analyze-signals.ts --json
```

## Blocking Rules

1. Critical and high governance violations block merge immediately.
2. Signal schema and completeness violations block merge.
3. Orphan and undefined anchor violations block merge.
4. Failed alignment or layering BLOCK verdict blocks merge.

## Rollback Protocol

1. Wave rollback unit: one wave commit set.
2. On instability, revert only current wave and keep previous wave gates intact.
3. For Wave 3 and Wave 4 incidents, switch CI policy to emergency advisory mode only for 24h, then re-enable blocking after patch.

## Start Order

1. Execute Wave 0 fully.
2. Open Wave 1 and Wave 2 as linked gsd-phase plans.
3. Start Wave 3 only when Wave 2 gate is fully green.
4. Roll out Wave 4 after one full week of stable Wave 3 gating.
5. Begin Wave 5 pruning after at least 10 fully-instrumented sessions.
