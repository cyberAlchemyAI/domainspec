# Delegation Tuning Ledger

This ledger records one JSONL row per delegated stage execution.

Path:

- docs/signals/delegation-tuning.jsonl

Required fields:

- stageRunId
- timestamp
- skill
- stage
- delegatedCommand
- delegationProfile (`quick`, `standard`, `deep`)
- thinkingBudget (`low`, `medium`, `high`, `xhigh`)
- outcome (`started`, `completed`, `blocked`, `failed`)
- suspectedStuck (boolean)
- retryCount (integer)
- durationMs (number, use 0 if unavailable)
- notes

Operational notes:

- Append-only; do not rewrite historical rows.
- For every delegated stage, append one `started` row before invocation and one terminal row (`completed|blocked|failed`) after completion, both with the same `stageRunId`.
- Watchdog windows by delegation profile:
  - `quick`: 8 minutes
  - `standard`: 15 minutes
  - `deep`: 25 minutes
- Mark `suspectedStuck=true` when watchdog budget is exceeded or repeated non-progress loops are detected.
- If telemetry append fails during execution, command output should FLAG the failure and include remediation.
- Use this ledger for trend analysis of profile mix, stuck rates, and retry rates.

Stuck audit query:

```bash
jq -s '
	map(select(.outcome=="started")) as $started |
	map(select(.outcome=="completed" or .outcome=="blocked" or .outcome=="failed")) as $terminal |
	($terminal | map(.stageRunId)) as $done |
	$started | map(select(.stageRunId as $id | ($done | index($id) | not)))
' docs/signals/delegation-tuning.jsonl
```
