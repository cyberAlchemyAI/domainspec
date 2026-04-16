---
name: domainspec-instrument-otel
description: Instrument backend code with OTel metrics from feature observability specs. Inner loop of the observability verification cycle.
argument-hint: "<feature-name> [--dry-run] [--change-requests <OBSERVABILITY-REPORT.md>]"
agent: domainspec-otel-instrumenter
allowed-tools: Read, Write, Bash, Glob, Grep, Task
---

<objective>
Read a feature's observability.md metric contract and instrument the backend code with matching OTel API calls.
When invoked with `--change-requests`, process remediation items from an OBSERVABILITY-REPORT.md instead of the full spec.
</objective>

<flags>
- `--dry-run`: Output the instrumentation plan (which files to modify, which instruments to add) without making changes.
- `--change-requests <path>`: Process only the Change Requests section from an OBSERVABILITY-REPORT.md. Skips full spec parsing and applies targeted fixes.
</flags>

<context>
Inputs:
- domainspec/CHANGELOG.md
- domainspec/OBSERVABILITY.md (derivation rules and OTel conventions)
- docs/features/{feature}/observability.md (metric contract)
- docs/features/{feature}/operations.md, states.md, events.md, interfaces.md (aspect mapping)
- backend/src/infrastructure/telemetry/instruments.ts (shared instruments)
- backend/src/infrastructure/telemetry/metrics-plugin.ts (HTTP middleware)
- backend/src/use-cases/{feature-dir}/*.ts (implementation targets)
- backend/src/domain/{feature-dir}/*.ts (entity and policy files)
- docs/features/{feature}/OBSERVABILITY-REPORT.md (when --change-requests)

Outputs:

- Modified use-case and infrastructure files with OTel metric recording
- Optional feature-specific instrument file at backend/src/infrastructure/telemetry/{feature}.ts
- Compilation verification via `tsc --noEmit`
  </context>

<process>
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Read docs/features/{feature}/observability.md (or OBSERVABILITY-REPORT.md change requests if --change-requests).
3. Parse YAML instrument blocks and build instrument inventory:
   ```
   { name, instrument_type, unit, attributes, source_rule, source_doc, alert_threshold }
   ```
4. Load shared instruments from infrastructure/telemetry/instruments.ts.
5. Classify each declared instrument:
   - **Shared**: matches a shared instrument name → reuse, import only
   - **Feature-specific**: needs a custom counter/histogram → create in telemetry/{feature}.ts
   - **HTTP middleware**: O8 instruments → already handled by metricsPlugin, skip
6. Map instruments to code locations:
   - Read the feature's operations.md to identify operation names → find corresponding use-case files
   - Read states.md to identify state machines → find entity/transition code
   - Read events.md to identify event emission points
   - Use naming convention: use-case dir typically matches feature kebab-case
7. For each instrument-to-code mapping:
   a. Read the target file
   b. Identify the insertion point (use-case function body, catch block, state transition call)
   c. Add import for the instrument (shared or feature-specific)
   d. Add metric recording call with correct attributes
   e. Preserve functional style — wrap, don't refactor
8. If --dry-run, output the plan and stop.
9. Run `tsc --noEmit` to verify compilation. If errors arise from instrumentation, fix them.
10. Report summary:
    - Instruments added: count by rule (O1, O4, O5, etc.)
    - Files modified: list with change description
    - Skipped: instruments that were already present or handled by middleware
    - Errors: any compilation issues and resolution
</process>

<instrument-patterns>
### O4: Operation invocation + duration (wrap pattern)

```typescript
import {
  operationInvocation,
  operationDuration,
} from "../../infrastructure/telemetry/instruments";

export const myOperation =
  (deps: Deps) =>
  async (input: Input): Promise<Output> => {
    const start = performance.now();
    try {
      // ... original logic ...
      operationInvocation.add(1, {
        feature: "my-feature",
        operation: "MyOperation",
        result: "success",
      });
      return result;
    } catch (err) {
      operationInvocation.add(1, {
        feature: "my-feature",
        operation: "MyOperation",
        result: "error",
      });
      throw err;
    } finally {
      operationDuration.record((performance.now() - start) / 1000, {
        feature: "my-feature",
        operation: "MyOperation",
      });
    }
  };
```

### O5: Rule violation (catch at use-case boundary)

```typescript
import { ruleViolation } from "../../infrastructure/telemetry/instruments";

// In the catch block or validation result check:
ruleViolation.add(1, {
  feature: "my-feature",
  operation: "MyOperation",
  rule_id: "R1",
});
```

### O1: State transition (after successful transition)

```typescript
import { stateTransition } from "../../infrastructure/telemetry/instruments";

stateTransition.add(1, {
  feature: "my-feature",
  entity: "MyEntity",
  from: previousState,
  to: newState,
  event: "EventName",
});
```

### O10: Event emission (after event is dispatched)

```typescript
import { eventEmit } from "../../infrastructure/telemetry/instruments";

eventEmit.add(1, { feature: "my-feature", event_type: "MyEvent" });
```

### O13: Business KPI (feature-specific counter)

```typescript
// In backend/src/infrastructure/telemetry/my-feature.ts
import { createCounter } from "./instruments";

export const businessMyKpi = createCounter("business.my_kpi", {
  unit: "{unit}",
  description: "What this KPI measures (O13)",
});
```

</instrument-patterns>

<change-request-mode>
When invoked with `--change-requests`:
1. Read the OBSERVABILITY-REPORT.md file
2. Parse the `## Change Requests` table
3. For each row with Priority P0 or P1, execute immediately
4. For P2, execute unless the action is "Remove" (flag for human review)
5. For "Add" actions: follow the standard instrument-to-code mapping
6. For "Fix" actions: locate the existing instrument and correct attributes/type
7. For "Remove" actions: only remove if the instrument is clearly accidental (not in any observability.md)
8. Re-run `tsc --noEmit` after all changes
</change-request-mode>

<error-handling>
- Missing observability.md → BLOCK with message to run pipeline Step 7a first
- No use-case files found for feature → FLAG with suggestion to check feature directory naming
- Compilation errors after instrumentation → attempt fix (max 2 retries), then FLAG with error details
- Instrument already present in code → skip with "already instrumented" note
</error-handling>
