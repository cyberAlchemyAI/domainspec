# Delegation Tuning Ledger

This ledger records one JSONL row per delegated stage execution.

Path:

- docs/signals/delegation-tuning.jsonl

Required fields:

- timestamp
- skill
- stage
- delegatedCommand
- delegationProfile (`quick`, `standard`, `deep`)
- thinkingBudget (`low`, `medium`, `high`, `xhigh`)
- outcome (`completed`, `blocked`, `failed`)
- suspectedStuck (boolean)
- retryCount (integer)
- durationMs (number, use 0 if unavailable)
- notes

Operational notes:

- Append-only; do not rewrite historical rows.
- If telemetry append fails during execution, command output should FLAG the failure and include remediation.
- Use this ledger for trend analysis of profile mix, stuck rates, and retry rates.
