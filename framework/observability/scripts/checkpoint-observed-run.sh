#!/usr/bin/env bash
set -euo pipefail

usage() {
	cat <<'USAGE'
Usage:
  checkpoint-observed-run.sh <run-dir> --phase <name> --summary <text> [options]

Options:
  --tool <summary>       repeatable
  --file <path>          repeatable
  --decision <summary>   repeatable
  --validation <summary> repeatable
  --blocker <summary>    repeatable
  --next <summary>
USAGE
}

if ! command -v jq >/dev/null 2>&1; then
	printf 'ERROR: jq not found\n' >&2
	exit 1
fi

if [[ "$#" -lt 1 ]]; then
	usage >&2
	exit 2
fi

run_dir="$1"
shift
phase=""
summary=""
next_step=""
tools=()
files=()
decisions=()
validations=()
blockers=()

while [[ "$#" -gt 0 ]]; do
	case "$1" in
		--phase) phase="$2"; shift 2 ;;
		--summary) summary="$2"; shift 2 ;;
		--tool) tools+=("$2"); shift 2 ;;
		--file) files+=("$2"); shift 2 ;;
		--decision) decisions+=("$2"); shift 2 ;;
		--validation) validations+=("$2"); shift 2 ;;
		--blocker) blockers+=("$2"); shift 2 ;;
		--next) next_step="$2"; shift 2 ;;
		--help|-h) usage; exit 0 ;;
		*) printf 'ERROR: unknown argument: %s\n' "$1" >&2; usage >&2; exit 2 ;;
	esac
done

if [[ -z "$phase" || -z "$summary" || ! -f "$run_dir/envelope.json" ]]; then
	usage >&2
	exit 2
fi

timestamp="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
safe_timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
checkpoint="$run_dir/checkpoints/$safe_timestamp.json"
tools_json="$(printf '%s\n' "${tools[@]}" | jq -Rsc 'split("\n")[:-1]')"
files_json="$(printf '%s\n' "${files[@]}" | jq -Rsc 'split("\n")[:-1]')"
decisions_json="$(printf '%s\n' "${decisions[@]}" | jq -Rsc 'split("\n")[:-1]')"
validations_json="$(printf '%s\n' "${validations[@]}" | jq -Rsc 'split("\n")[:-1]')"
blockers_json="$(printf '%s\n' "${blockers[@]}" | jq -Rsc 'split("\n")[:-1]')"

jq -n \
	--arg timestamp "$timestamp" \
	--arg phase "$phase" \
	--arg summary "$summary" \
	--arg next_step "$next_step" \
	--argjson tools "$tools_json" \
	--argjson files "$files_json" \
	--argjson decisions "$decisions_json" \
	--argjson validations "$validations_json" \
	--argjson blockers "$blockers_json" \
	'{
		timestamp: $timestamp,
		phase: $phase,
		summary: $summary,
		tools: $tools,
		files_touched: $files,
		decisions: $decisions,
		validation: $validations,
		blockers: $blockers,
		next_intended_step: $next_step
	}' > "$checkpoint"

jq --arg timestamp "$timestamp" '.status = "checkpointed" | .last_checkpoint_at = $timestamp' \
	"$run_dir/envelope.json" > "$run_dir/envelope.json.tmp" && mv "$run_dir/envelope.json.tmp" "$run_dir/envelope.json"

jq -cn --arg timestamp "$timestamp" --arg event "checkpointed" --arg checkpoint "$checkpoint" \
	'{timestamp: $timestamp, event: $event, checkpoint: $checkpoint}' >> "$run_dir/events.jsonl"

printf 'CHECKPOINT=%s\n' "$checkpoint"
