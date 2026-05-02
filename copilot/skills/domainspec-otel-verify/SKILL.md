---
name: domainspec-otel-verify
description: Verify OTel instrumentation coverage against observability specs. Outer loop of the observability verification cycle. Produces OBSERVABILITY-REPORT.md with change requests for the inner loop.
argument-hint: "<feature-name> [--live] [--all] [--fix]"
agent: domainspec-otel-verifier
allowed-tools: Read, Write, Bash, Glob, Grep, Task
---

<objective>
Audit the gap between declared observability obligations and actual OTel instrumentation, then produce a report with actionable change requests.
When `--fix` is passed, automatically invoke the inner loop (domainspec-instrument-otel) to close gaps.
When `--all` is passed, verify all features that have observability.md files.
When `--live` is passed, also query the running OTel Collector / Prometheus endpoint via MCP for live metric validation.
</objective>

<flags>
- `--live`: Enable live metric verification through MCP Prometheus connection. Requires `.vscode/mcp.json` with prometheus server configured and a running OTel Collector.
- `--all`: Verify all features with observability.md files. Produces one OBSERVABILITY-REPORT.md per feature plus a summary.
- `--fix`: After verification, automatically run `domainspec-instrument-otel --change-requests` for each feature with FLAG or BLOCK verdict. Then re-verify. Max 3 iterations.
</flags>

<context>
Inputs:
- domainspec/CHANGELOG.md
- domainspec/OBSERVABILITY.md (derivation rules and OTel conventions)
- domainspec/templates/OBSERVABILITY-REPORT.md (report template)
- docs/features/{feature}/observability.md (metric contract per feature)
- backend/src/infrastructure/telemetry/*.ts (instrument registry)
- backend/src/use-cases/**/*.ts (implementation code)
- backend/src/domain/**/*.ts (domain code)
- backend/src/infrastructure/http/routes/*.ts (route handlers)

Outputs:

- docs/features/{feature}/OBSERVABILITY-REPORT.md (one per feature)
- Summary table when --all is used
  </context>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
## Single Feature Verification

1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Read docs/features/{feature}/observability.md and extract declared instrument inventory.
3. Scan backend source code for OTel instrument usage:
   a. Identify all files importing from `infrastructure/telemetry/`
   b. Map each import to instrument names
   c. Find all `.add()` and `.record()` calls with their attributes
   d. Cross-reference with the declared instrument inventory
4. Classify each declared instrument: ✅ Instrumented | ⚠️ Partial | ❌ Missing | 🔄 Drifted
5. Identify undeclared instruments in code: 🆕 Extra
6. Calculate coverage percentage and determine verdict (PASS / FLAG / BLOCK).
7. Generate change request table with priority, action, target file, and detail.
8. Write docs/features/{feature}/OBSERVABILITY-REPORT.md.

## Live Verification (--live)

9. Verify MCP Prometheus connection is available.
10. For each declared instrument, query Prometheus for the metric:
    - `{instrument_name}` with expected label matchers
    - Check existence and recency of data points
11. For O8 SLOs: query `histogram_quantile(0.99, http_server_request_duration_seconds_bucket{feature="{feature}"})` and compare against declared p99 threshold.
12. For O10 event lag: query `event_consumer_lag` and compare against SLO.
13. Append Live Verification section to report.

## Auto-Fix Loop (--fix)

14. If verdict is FLAG or BLOCK:
    a. Invoke `domainspec-instrument-otel {feature} --change-requests docs/features/{feature}/OBSERVABILITY-REPORT.md`
    b. Wait for completion
    c. Re-run verification (steps 2–8)
    d. If still BLOCK, repeat (max 3 total iterations)
    e. Final verdict after last iteration
15. Report iteration count and final verdict.

## All Features (--all)

16. Scan docs/features/\*/observability.md to find all features with observability specs.
17. Run single-feature verification for each.
18. Produce summary table:

| Feature   | Declared | Instrumented | Coverage | Verdict         |
| --------- | -------- | ------------ | -------- | --------------- |
| {feature} | {n}      | {n}          | {%}      | PASS/FLAG/BLOCK |

19. If --fix is also set, run auto-fix loop for each FLAG/BLOCK feature.
    </process>

<verdict-criteria>
| Condition | Verdict |
|-----------|---------|
| 100% coverage, all types/attributes correct | PASS |
| ≥80% coverage, no P0 instruments missing | FLAG |
| <80% coverage OR any P0 instrument missing | BLOCK |

P0 instruments (always BLOCK if missing):

- O1: state.transition (for features with state machines)
- O3: invariant.violation (for features with invariants)
- O6: calculation.drift (for features with financial calculations)
- O8: http.server.request.duration (handled by middleware — should always be PASS)
- O15: reconciliation.mismatch (for finance pillar features)
  </verdict-criteria>

<error-handling>
- No observability.md for feature → BLOCK with message to run pipeline Step 7a
- No backend code for feature → BLOCK with message to implement feature first
- MCP connection fails (--live) → FLAG live verification section, proceed with static audit
- Feature directory naming mismatch → search by operation names in SPEC.md
</error-handling>
