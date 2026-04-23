# Pipeline Decisions: Commodity Crisis Signal MVP

Date frozen: 2026-04-23
Profile: pipeline
Owner: Founding operator

## Decision Table

| Decision | Considered Options | Selected Option | Rationale | Source | Timestamp |
| --- | --- | --- | --- | --- | --- |
| Pipeline scope | docs-only refresh; full pipeline execution | Full pipeline execution with stage-level PASS/FLAG/BLOCK outcomes | Preserves deterministic lifecycle coverage even when some stages are conditionally skipped or blocked | chat fallback | 2026-04-23 |
| Authoritative docs root | docs/features first; domainspec/docs first | domainspec/docs/features first, then sync to docs/features | Aligns with source-first governance for DomainSpec-oriented work | user memory + governance policy | 2026-04-23 |
| Orchestration mode | native; gsd-phase | gsd-phase semantics for planning, with DomainSpec semantic authority | Work is cross-cutting across docs, tests, observability, registry, and verification | planner heuristic | 2026-04-23 |
| Backend implementation stage | create stubs; defer stage with explicit blocker | Do not create stubs; mark implementation as blocked until runtime scaffold exists | Framework prohibits placeholder/stub behavior in production paths and repository has no backend runtime surface | domainspec/CHANGELOG.md 1.7.2 + repo scan | 2026-04-23 |
| UI stage | force UI pipeline; skip UI | Skip UI pipeline for this run | Interfaces are transport-agnostic and do not define HTTP endpoints yet | interfaces.md + pipeline gate | 2026-04-23 |
| Observability stage | skip all; spec-only; full instrumentation loop | Generate observability spec; flag instrumentation/verification as blocked by missing backend code | Preserves observability design traceability without fabricating code bindings | pipeline step 7 rules + repo scan | 2026-04-23 |
| Infra sync stage | force infra generation; skip until constitution exists | Skip infra deploy sync in this run | docs/INFRA-ARCHITECTURE.md is absent, so infra stage is conditional N/A | pipeline step 7d gate | 2026-04-23 |
| Verification command set | npm run docs:index; repository substitutions | Use npx tsx domainspec/tools/validate-doc-links.ts and bash domainspec/tools/check_docs_sync.sh | Repository has no package.json, and these are the available deterministic doc checks | repo command validation | 2026-04-23 |
| Readiness verdict rule | pass on docs-only completion; enforce blocker closure | Keep BLOCK while BR-001 and BR-002 remain open | Pilot readiness requires executable Wave 1 evidence and story-to-test runtime validation | TEST-SPEC.md blockers + PILOT-ROADMAP.md | 2026-04-23 |

## Resolution Status

All pipeline-level decisions required for this run are resolved.
