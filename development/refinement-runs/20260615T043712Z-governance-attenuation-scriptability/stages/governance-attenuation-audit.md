# Governance Attenuation Audit

Generated at: 2026-06-15T04:51:24.098Z
Signals: docs/signals/pipeline-signals.jsonl

## Summary

| Check                  | Status | Exit | Interpretation                                                                                |
| ---------------------- | ------ | ---: | --------------------------------------------------------------------------------------------- |
| governance-chain       | pass   |    0 | Validates that constitution rules, axioms, and gates remain connected.                        |
| signal-ledger-envelope | block  |    1 | Validates signal envelope and session completeness before signals drive governance decisions. |
| signal-thresholds      | pass   |    0 | Aggregates signal thresholds; threshold-trigger exits are flags, not command failures.        |

## Details

### governance-chain

Status: `pass`

Command:

```bash
pnpm dlx tsx /home/vrondelli/projects/domainspec-core/implementation/domainspec/tools/validate-governance-chain.ts --json
```

Stdout:

```text
{
  "ok": true,
  "axioms": [
    "A1",
    "A2",
    "A3",
    "A4",
    "A5",
    "A6"
  ],
  "ruleCount": 11,
  "errors": []
}
```

### signal-ledger-envelope

Status: `block`

Command:

```bash
pnpm dlx tsx /home/vrondelli/projects/domainspec-core/implementation/domainspec/tools/validate-signals.ts --input /home/vrondelli/projects/domainspec-core/implementation/domainspec/docs/signals/pipeline-signals.jsonl --json
```

Stdout:

```text
{
  "ok": false,
  "errors": [
    "Line 1: id must be UUID v4",
    "Line 1: timestamp must be valid ISO date",
    "Line 1: missing session",
    "Line 1: must provide feature or features",
    "Line 1: invalid pipelineMode undefined",
    "Line 1: invalid severity undefined",
    "Line 1: invalid category undefined",
    "Line 1: invalid category for spec-gap, expected quality, got undefined",
    "Line 2: id must be UUID v4",
    "Line 2: timestamp must be valid ISO date",
    "Line 2: missing session",
    "Line 2: must provide feature or features",
    "Line 2: invalid pipelineMode undefined",
    "Line 2: invalid severity undefined",
    "Line 2: invalid category undefined",
    "Line 2: invalid category for decision, expected pattern, got undefined",
    "Line 3: id must be UUID v4",
    "Line 3: timestamp must be valid ISO date",
    "Line 3: missing session",
    "Line 3: must provide feature or features",
    "Line 3: invalid pipelineMode undefined",
    "Line 3: invalid severity undefined",
    "Line 3: invalid category undefined",
    "Line 3: invalid category for pattern, expected pattern, got undefined",
    "Line 4: id must be UUID v4",
    "Line 4: timestamp must be valid ISO date",
    "Line 4: missing session",
    "Line 4: invalid pipelineMode undefined",
    "Line 4: invalid severity high",
    "Line 4: invalid category undefined",
    "Line 4: invalid source internal_tools/vault_common/features/spec/SPEC.md#oq-a",
    "Line 4: unknown signal type undefined",
    "Line 5: id must be UUID v4",
    "Line 5: timestamp must be valid ISO date",
    "Line 5: missing session",
    "Line 5: invalid pipelineMode undefined",
    "Line 5: invalid severity medium",
    "Line 5: invalid category undefined",
    "Line 5: invalid source internal_tools/vault_common/features/spec/SPEC.md#oq-e",
    "Line 5: unknown signal type undefined",
    "Line 6: id must be UUID v4",
    "Line 6: timestamp must be valid ISO date",
    "Line 6: missing session",
    "Line 6: invalid pipelineMode undefined",
    "Line 6: invalid severity medium",
    "Line 6: invalid category undefined",
    "Line 6: invalid source internal_tools/vault_common/features/spec/SPEC.md#oq-d",
    "Line 6: unknown signal type undefined",
    "Line 7: id must be UUID v4",
    "Line 7: timestamp must be valid ISO date",
    "Line 7: missing session",
    "Line 7: invalid pipelineMode undefined",
    "Line 7: invalid severity medium",
    "Line 7: invalid category undefined",
    "Line 7: invalid source internal_tools/vault_common/features/spec/SPEC.md#oq-c",
    "Line 7: unknown signal type undefined",
    "Line 8: id must be UUID v4",
    "Line 8: timestamp must be valid ISO date",
    "Line 8: missing session",
    "Line 8: invalid pipelineMode undefined",
    "Line 8: invalid severity medium",
    "Line 8: invalid category undefined",
    "Line 8: invalid source internal_tools/vault_common/features/spec/SPEC.md#oq-g",
    "Line 8: unknown signal type undefined",
    "Line 9: id must be UUID v4",
    "Line 9: timestamp must be valid ISO date",
    "Line 9: missing session",
    "Line 9: invalid pipelineMode undefined",
    "Line 9: invalid severity low",
    "Line 9: invalid category undefined",
    "Line 9: invalid source docs/features/goldenquill-promotion-governance/SPEC.md",
    "Line 9: unknown signal type undefined"
  ],
  "warnings": [],
  "warningCount": 0,
  "input": "/home/vrondelli/projects/domainspec-core/implementation/domainspec/docs/signals/pipeline-signals.jsonl",
  "strictSince": null
}
```

### signal-thresholds

Status: `pass`

Command:

```bash
pnpm dlx tsx /home/vrondelli/projects/domainspec-core/implementation/domainspec/tools/analyze-signals.ts --signals /home/vrondelli/projects/domainspec-core/implementation/domainspec/docs/signals/pipeline-signals.jsonl --json --min 1
```

Stdout:

```text
{
  "signalCount": 9,
  "dateRange": {
    "from": "",
    "to": ""
  },
  "byType": {
    "spec-gap": 1,
    "decision": 1,
    "pattern": 1,
    "undefined": 6
  },
  "bySeverity": {
    "undefined": 3,
    "high": 1,
    "medium": 4,
    "low": 1
  },
  "byFeature": {
    "undefined": 3,
    "vault_common": 5,
    "goldenquill-promotion-governance": 1
  },
  "thresholds": [],
  "thresholdsTriggered": 0,
  "aggregates": {
    "avgOverheadRatio": null,
    "reworkRate": 0,
    "firstPassRate": 0,
    "totalRuns": 0,
    "agentCost": {
      "totalPremiumRequests": 0,
      "totalDurationSeconds": 0,
      "agentRuns": 0,
      "successRate": null,
      "last7dPremiumRequests": 0
    }
  }
}
```
