#!/usr/bin/env bash
set -euo pipefail

usage() {
	cat <<'USAGE'
Usage:
  start-observed-run.sh --observability-dir <path> --capability <id> --kind sigil|spell [options]

Options:
  --session-id <id>
  --run-id <id>
  --parent-run-id <id>
  --tier <tier>
  --mode <mode>
  --summary <text>
  --intent <text>
USAGE
}

if ! command -v jq >/dev/null 2>&1; then
	printf 'ERROR: jq not found\n' >&2
	exit 1
fi

observability_dir=""
capability=""
kind=""
session_id=""
run_id=""
parent_run_id=""
tier=""
mode="execute"
summary=""
intent=""

while [[ "$#" -gt 0 ]]; do
	case "$1" in
		--observability-dir) observability_dir="$2"; shift 2 ;;
		--capability) capability="$2"; shift 2 ;;
		--kind) kind="$2"; shift 2 ;;
		--session-id) session_id="$2"; shift 2 ;;
		--run-id) run_id="$2"; shift 2 ;;
		--parent-run-id) parent_run_id="$2"; shift 2 ;;
		--tier) tier="$2"; shift 2 ;;
		--mode) mode="$2"; shift 2 ;;
		--summary) summary="$2"; shift 2 ;;
		--intent) intent="$2"; shift 2 ;;
		--help|-h) usage; exit 0 ;;
		*) printf 'ERROR: unknown argument: %s\n' "$1" >&2; usage >&2; exit 2 ;;
	esac
done

if [[ -z "$observability_dir" || -z "$capability" || -z "$kind" ]]; then
	usage >&2
	exit 2
fi

safe_timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
timestamp="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
if [[ -z "$session_id" ]]; then
	session_id="session-$safe_timestamp"
fi
if [[ -z "$run_id" ]]; then
	run_id="run-$safe_timestamp-$capability"
fi
if [[ -z "$tier" ]]; then
	tier="unknown"
fi

run_dir="$observability_dir/runs/$session_id/$run_id"
mkdir -p "$run_dir/checkpoints"

jq -n \
	--arg session_id "$session_id" \
	--arg run_id "$run_id" \
	--arg parent_run_id "$parent_run_id" \
	--arg capability "$capability" \
	--arg kind "$kind" \
	--arg tier "$tier" \
	--arg mode "$mode" \
	--arg opened_at "$timestamp" \
	--arg summary "$summary" \
	--arg intent "$intent" \
	'{
		version: "0.1.0",
		session_id: $session_id,
		run_id: $run_id,
		parent_run_id: (if $parent_run_id == "" then null else $parent_run_id end),
		capability: {
			id: $capability,
			kind: $kind,
			tier: $tier,
			mode: $mode
		},
		status: "opened",
		opened_at: $opened_at,
		closed_at: null,
		request: {
			summary: $summary,
			intent: $intent,
			raw: null
		},
		execution: {
			outputs: [],
			files_changed: [],
			validation: [],
			notes: ""
		},
		observer: {
			quality_bar_status: "not_checked",
			anti_pattern_hits: [],
			workflow_gaps: [],
			output_contract_drift: false,
			reflection_trigger: "none",
			recommendation: "none"
		}
	}' > "$run_dir/envelope.json"

jq -cn --arg timestamp "$timestamp" --arg event "opened" --arg run_id "$run_id" \
	'{timestamp: $timestamp, event: $event, run_id: $run_id}' >> "$run_dir/events.jsonl"

printf 'RUN_DIR=%s\n' "$run_dir"
printf 'RUN_ID=%s\n' "$run_id"
printf 'SESSION_ID=%s\n' "$session_id"
