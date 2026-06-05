#!/usr/bin/env bash
set -euo pipefail

usage() {
	cat <<'USAGE'
Usage:
  reflect-hook-health.sh <observability-dir>
USAGE
}

if [[ "$#" -ne 1 ]]; then
	usage >&2
	exit 2
fi

observability_dir="$1"
hooks_dir="$observability_dir/hooks"
operations="$hooks_dir/hook-operations.jsonl"
failures="$hooks_dir/failures.jsonl"
reflections="$hooks_dir/reflections"
mkdir -p "$reflections"

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
report="$reflections/$timestamp.md"

operation_count=0
failure_count=0
skip_count=0
duplicate_count=0
if [[ -f "$operations" ]]; then
	operation_count="$(wc -l < "$operations" | tr -d ' ')"
	skip_count="$(jq -r 'select(.status == "skipped") | .status' "$operations" 2>/dev/null | wc -l | tr -d ' ')"
	duplicate_count="$(jq -r 'select(.reason | test("duplicate"; "i")) | .reason' "$operations" 2>/dev/null | wc -l | tr -d ' ')"
fi
if [[ -f "$failures" ]]; then
	failure_count="$(wc -l < "$failures" | tr -d ' ')"
fi

recommendation="none"
if [[ "$failure_count" -ge 3 || "$duplicate_count" -ge 5 || "$skip_count" -ge 5 ]]; then
	recommendation="targeted-update"
fi

{
	printf '# Hook Health Reflection %s\n\n' "$timestamp"
	printf -- '- Operations: %s\n' "$operation_count"
	printf -- '- Failures: %s\n' "$failure_count"
	printf -- '- Skips: %s\n' "$skip_count"
	printf -- '- Duplicate suppressions: %s\n' "$duplicate_count"
	printf -- '- Recommendation: %s\n\n' "$recommendation"
	printf '## Loop Guard\n\n'
	printf -- '- Hook reflection does not emit capability telemetry.\n'
	printf -- '- Hook reflection reads only hook operation ledgers.\n'
	printf -- '- Hook reflection may be recorded as a hook operation with observe=false.\n'
} > "$report"

printf 'HOOK_REFLECTION=%s\n' "$report"
printf 'RECOMMENDATION=%s\n' "$recommendation"
