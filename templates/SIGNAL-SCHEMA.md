# Pipeline Signals - Schema Reference

> Structured observations emitted during pipeline runs. Accumulated in docs/signals/pipeline-signals.jsonl.
> Each line is a self-contained JSON object. The file is append-only during sessions.

---

## Signal Envelope

Every signal shares this envelope:

```jsonc
{
  "id": "uuid-v4",                          // unique signal ID (canonical)
  "timestamp": "2026-04-16T14:30:00Z",      // ISO 8601
  "session": "session-identifier",           // conversation/session ID (opaque)
  "feature": "player-management",            // feature-id from SPEC frontmatter
  "features": ["player-management"],         // optional array when signal spans multiple features
  "domainspecVersion": "1.8.3",              // framework version from CHANGELOG
  "pipelineMode": "new | evolution | audit", // invocation mode
  "source": "session-epilogue | fast-observer | async-observer | ci-detector",
  "type": "signal-type",
  "severity": "LOW | MEDIUM | HIGH | CRITICAL",
  "category": "economy | governance | pattern | quality | operations",
  "data": { }
}
```

### Canonical Constraints

1. id must be UUID v4.
2. source must be one of the listed values.
3. category must match allowed values and type mapping.
4. session-level completeness invariants must hold (see below).

---

## Signal Types

### step-verdict

Emitted once per executed step.

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

### alignment-gap

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

### spec-gap

Specification was insufficient for implementation.

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

### governance-gap

Framework blind spot.

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

### rework

A step required retries or human correction.

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

### overhead

Economy of Action snapshot for a full session/run.

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

### decision

A significant design or execution decision.

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

### proposal

A concrete improvement proposal.

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

### pattern

Reusable insight.

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

### spec-compliance

An agent deviated from its own documented specification.

```jsonc
{
  "type": "spec-compliance",
  "category": "governance",
  "severity": "HIGH",
  "data": {
    "agentName": "domainspec-planner",
    "specFile": "domainspec/copilot/agents/domainspec-planner.md",
    "violationType": "step-skipped | step-reordered | output-malformed | contract-violated",
    "skippedStep": "5",
    "description": "Planner skipped interactive architecture-decision round and produced task breakdown directly from intake answers",
    "detectedBy": "human | self-check | audit",
    "impact": "Plan contained assumptions that should have been validated via user questions"
  }
}
```

### agent-cost

Resource consumption of automated agent runs.

```jsonc
{
  "type": "agent-cost",
  "category": "operations",
  "severity": "LOW",
  "data": {
    "agentName": "domainspec-reflect",
    "model": "codex",
    "premiumRequests": 3,
    "durationSeconds": 120,
    "taskType": "reflection | implementation | audit",
    "inputTokens": 8500,
    "outputTokens": 2100,
    "success": true,
    "triggerWorkflow": "domainspec-tuning.yml"
  }
}
```

---

## Session Completeness Invariants

1. C1: Any session emitting step-verdict must emit exactly one overhead signal.
2. C2: If any step-verdict has retriesNeeded > 0, the same session must emit at least one rework signal.
3. C3: Duplicate protection: same (session, type, feature, description) should not be emitted twice.
4. C4: A signal must provide feature or features. Empty scope is invalid.
5. C5: Type-category mapping must be valid:
   1. step-verdict, rework, overhead -> economy
   2. alignment-gap, spec-gap -> quality
   3. governance-gap, proposal, spec-compliance -> governance
   4. decision, pattern -> pattern
   5. agent-cost -> operations

---

## Threshold Definitions

These thresholds trigger async reflection when accumulated signals are analyzed:

| ID | Condition | Action |
|---|---|---|
| TH1 | Same governance-gap description in 3+ signals | Auto-propose skill update PR |
| TH2 | overhead.overheadRatio > 0.5 for 3 consecutive runs | Flag governance overhead review |
| TH3 | Same spec-gap.missingDetail pattern in 2+ features | Propose template improvement |
| TH4 | rework on same stepName in 5+ signals | Flag skill for hardening |
| TH5 | 3+ proposal signals with same targetFile | Bundle proposals into single tuning PR |
| TH6 | alignment-gap count > 10 across last 5 runs | Trigger full cross-feature alignment audit |
| TH7 | New governance-gap with severity CRITICAL | Immediate issue creation (no threshold wait) |
| TH8 | decision with confidence low in 3+ runs | Flag domain ambiguity for clarification |
| TH9 | spec-compliance violation by same agent in 2+ signals | Flag agent spec for hardening and emit proposal |
| TH10 | agent-cost premiumRequests > 50 in rolling 7 days | Alert cost threshold and review efficiency |

---

## File Location

docs/signals/pipeline-signals.jsonl

The signals file is append-only during sessions. Deep analysis and proposal generation happen asynchronously via reflect and tuning workflows.
