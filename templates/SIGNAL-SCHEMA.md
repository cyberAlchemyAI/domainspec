# Pipeline Signals — Schema Reference

> Structured observations emitted during pipeline runs. Accumulated in `docs/signals/pipeline-signals.jsonl`.
> Each line is a self-contained JSON object. The file is append-only during sessions, committed at session end.

---

## Signal Envelope

Every signal shares this envelope:

```jsonc
{
  "id": "uuid-v4",                          // unique signal ID
  "timestamp": "2026-04-16T14:30:00Z",      // ISO 8601
  "session": "session-identifier",           // conversation/session ID (opaque)
  "feature": "player-management",            // feature-id from SPEC frontmatter
  "features": ["player-management"],         // array when signal spans multiple features
  "domainspecVersion": "1.8.0",              // framework version from CHANGELOG
  "pipelineMode": "new | evolution | audit", // how the pipeline was invoked
  "type": "signal-type",                     // see Signal Types below
  "severity": "LOW | MEDIUM | HIGH | CRITICAL",
  "category": "economy | governance | pattern | quality",
  "data": { }                                // type-specific payload
}
```

---

## Signal Types

### `step-verdict`

Emitted once per pipeline step executed.

```jsonc
{
  "type": "step-verdict",
  "category": "economy",
  "severity": "LOW",
  "data": {
    "step": "5",
    "stepName": "Implement Backend",
    "verdict": "PASS | FLAG | BLOCK",
    "retriesNeeded": 0,
    "filesCreated": 3,
    "filesModified": 2,
    "testsAdded": 6,
    "notes": "All tests passed first try"
  }
}
```

### `alignment-gap`

Code drifted from spec or spec is incomplete for code.

```jsonc
{
  "type": "alignment-gap",
  "category": "quality",
  "severity": "MEDIUM",
  "data": {
    "gapType": "code-without-spec | spec-without-code | contract-mismatch",
    "conceptId": "C-AUTH-003",
    "specFile": "docs/features/auth-access-control/operations.md",
    "codeFile": "backend/src/domain/auth-access-control/role-definitions.ts",
    "description": "Role 'auditor' exists in code but not in operations.md"
  }
}
```

### `spec-gap`

Specification was insufficient for implementation — required human clarification or assumption.

```jsonc
{
  "type": "spec-gap",
  "category": "quality",
  "severity": "MEDIUM",
  "data": {
    "aspectFile": "docs/features/player-management/operations.md",
    "missingDetail": "No validation rules for coach assignment limits",
    "resolution": "assumed | asked-human | deferred",
    "humanAnswer": "Max 10 players per coach",
    "impactedStep": "5"
  }
}
```

### `governance-gap`

A blind spot — something the framework should have caught but didn't.

```jsonc
{
  "type": "governance-gap",
  "category": "governance",
  "severity": "HIGH",
  "data": {
    "description": "Stub repository in production route file not detected by alignment audit",
    "shouldHaveBeenCaughtBy": "domainspec-audit-alignment",
    "skillFile": ".github/skills/domainspec-audit-alignment/SKILL.md",
    "suggestedFix": "Add infrastructure binding scan to alignment audit step 5",
    "occurrences": 1
  }
}
```

### `rework`

A step that required retries or human correction.

```jsonc
{
  "type": "rework",
  "category": "economy",
  "severity": "LOW",
  "data": {
    "step": "5",
    "stepName": "Implement Backend",
    "iterations": 3,
    "rootCause": "Generated code imported non-existent module",
    "resolution": "Fixed import path after reading existing project structure",
    "timeWasted": "significant | minor"
  }
}
```

### `overhead`

Economy of Action snapshot for the full pipeline run.

```jsonc
{
  "type": "overhead",
  "category": "economy",
  "severity": "LOW",
  "data": {
    "stepsExecuted": 8,
    "stepsSkipped": 4,
    "agentDelegations": 6,
    "humanQuestions": 2,
    "filesCreated": 12,
    "filesModified": 5,
    "testsAdded": 15,
    "testsTotal": 421,
    "testsPassed": 421,
    "retries": 1,
    "contextFilesRead": 18,
    "discoveryStrategy": "links-tags-first",
    "overheadRatio": 0.25,
    "overheadAssessment": "acceptable"
  }
}
```

### `decision`

A significant decision made during the pipeline that might recur or be worth reviewing.

```jsonc
{
  "type": "decision",
  "category": "pattern",
  "severity": "LOW",
  "data": {
    "step": "1",
    "description": "Chose to model coach-player as a separate aggregate rather than embedding in Player",
    "alternatives": ["Embed in Player entity", "Separate CoachAssignment aggregate"],
    "rationale": "Coach can be reassigned independently of player lifecycle",
    "confidence": "high | medium | low"
  }
}
```

### `proposal`

A concrete skill/agent improvement proposal generated during the run.

```jsonc
{
  "type": "proposal",
  "category": "governance",
  "severity": "MEDIUM",
  "data": {
    "targetFile": ".github/skills/domainspec-implement/SKILL.md",
    "changeDescription": "Add cross-feature import validation before generating code",
    "rationale": "This run generated imports to modules in another feature's directory",
    "priority": "P1",
    "evidenceFrom": "step-5-rework"
  }
}
```

### `pattern`

A reusable insight discovered during the run.

```jsonc
{
  "type": "pattern",
  "category": "pattern",
  "severity": "LOW",
  "data": {
    "summary": "Features with events.md need consumer verification in dependent features",
    "context": "Cross-feature event-driven architectures",
    "applicability": "Any feature publishing domain events"
  }
}
```

---

## Threshold Definitions

These thresholds trigger async reflection when the GitHub Action reads accumulated signals:

| ID  | Condition                                              | Action                                       |
| --- | ------------------------------------------------------ | -------------------------------------------- |
| TH1 | Same `governance-gap` description in 3+ signals        | Auto-propose skill update PR                 |
| TH2 | `overhead.overheadRatio` > 0.5 for 3 consecutive runs  | Flag governance overhead review               |
| TH3 | Same `spec-gap.missingDetail` pattern in 2+ features   | Propose template improvement                  |
| TH4 | `rework` on same `stepName` in 5+ signals              | Flag skill for hardening                      |
| TH5 | 3+ `proposal` signals with same `targetFile`           | Bundle proposals into single tuning PR        |
| TH6 | `alignment-gap` count > 10 across last 5 runs          | Trigger full cross-feature alignment audit    |
| TH7 | New `governance-gap` with severity CRITICAL             | Immediate issue creation (no threshold wait)  |
| TH8 | `decision` with `confidence: low` in 3+ runs           | Flag domain ambiguity for human clarification |

---

## File Location

```
docs/signals/pipeline-signals.jsonl    # append-only signal log
docs/signals/TUNING-REPORT.md          # output of async reflection (written by CI agent)
```

The signals file is committed to the repository. It is append-only during sessions.
Periodic compaction (archiving old signals) is handled by the tuning workflow.
