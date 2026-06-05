#!/usr/bin/env bash
set -euo pipefail

usage() {
	cat <<'USAGE'
Usage:
  finish-observed-run.sh <run-dir> --status completed|partial|blocked|failed|interrupted [options]

Options:
  --output <path-or-summary>       repeatable
  --file <path>                    repeatable
  --validation <summary>           repeatable
  --notes <text>
  --final-output-file <path>
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
status=""
notes=""
final_output_file=""
outputs=()
files=()
validations=()

while [[ "$#" -gt 0 ]]; do
	case "$1" in
		--status) status="$2"; shift 2 ;;
		--output) outputs+=("$2"); shift 2 ;;
		--file) files+=("$2"); shift 2 ;;
		--validation) validations+=("$2"); shift 2 ;;
		--notes) notes="$2"; shift 2 ;;
		--final-output-file) final_output_file="$2"; shift 2 ;;
		--help|-h) usage; exit 0 ;;
		*) printf 'ERROR: unknown argument: %s\n' "$1" >&2; usage >&2; exit 2 ;;
	esac
done

case "$status" in
	completed|partial|blocked|failed|interrupted) ;;
	*) usage >&2; exit 2 ;;
esac

if [[ ! -f "$run_dir/envelope.json" ]]; then
	printf 'ERROR: run envelope not found: %s\n' "$run_dir/envelope.json" >&2
	exit 1
fi

timestamp="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
outputs_json="$(printf '%s\n' "${outputs[@]}" | jq -Rsc 'split("\n")[:-1]')"
files_json="$(printf '%s\n' "${files[@]}" | jq -Rsc 'split("\n")[:-1]')"
validations_json="$(printf '%s\n' "${validations[@]}" | jq -Rsc 'split("\n")[:-1]')"

if [[ -n "$final_output_file" && -f "$final_output_file" ]]; then
	cp "$final_output_file" "$run_dir/final-output.md"
	outputs_json="$(jq -cn --argjson existing "$outputs_json" '$existing + ["final-output.md"]')"
fi

jq \
	--arg closed_at "$timestamp" \
	--arg status "$status" \
	--arg notes "$notes" \
	--argjson outputs "$outputs_json" \
	--argjson files "$files_json" \
	--argjson validations "$validations_json" \
	'
	.status = (if $status == "completed" then "closed" else $status end)
	| .closed_at = $closed_at
	| .execution.outputs = (.execution.outputs + $outputs | unique)
	| .execution.files_changed = (.execution.files_changed + $files | unique)
	| .execution.validation = (.execution.validation + $validations | unique)
	| .execution.notes = $notes
	' "$run_dir/envelope.json" > "$run_dir/envelope.json.tmp" && mv "$run_dir/envelope.json.tmp" "$run_dir/envelope.json"

jq -cn --arg timestamp "$timestamp" --arg event "closed" --arg status "$status" \
	'{timestamp: $timestamp, event: $event, status: $status}' >> "$run_dir/events.jsonl"

printf 'RUN_STATUS=%s\n' "$status"
printf 'RUN_DIR=%s\n' "$run_dir"
