#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  recover-arcanum-observations.sh [--observability-dir <path>]

Find pending Arcanum hook envelopes that were not ledgered and emit recovered
telemetry through observe-invocation.sh. Dedupe is handled by the observer's
run_id-based hook ledger.
USAGE
}

observability_dir=""
while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --observability-dir) observability_dir="$2"; shift 2 ;;
    --help|-h) usage; exit 0 ;;
    *) echo "ERROR: unknown argument: $1" >&2; usage >&2; exit 2 ;;
  esac
done

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(git -C "$script_dir" rev-parse --show-toplevel 2>/dev/null || cd "$script_dir/../.." && pwd)"
if [[ -z "$observability_dir" ]]; then
  observability_dir="$repo_root/.arcanum/observability"
fi
observer="$script_dir/observe-invocation.sh"

if [[ ! -x "$observer" ]]; then
  echo "ERROR: observer unavailable: $observer" >&2
  exit 1
fi
if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: jq not found" >&2
  exit 1
fi

hooks_root="$observability_dir/runs/arcanum-hooks"
[[ -d "$hooks_root" ]] || exit 0

recovered=0
skipped=0
while IFS= read -r envelope; do
  run_dir="$(dirname "$envelope")"
  run_id="$(jq -r '.run_id // empty' "$envelope")"
  [[ -n "$run_id" ]] || { skipped=$((skipped + 1)); continue; }

  if [[ -f "$observability_dir/signals/sigil-invocations.jsonl" ]] && grep -Fq "\"observer_version\"" "$observability_dir/signals/sigil-invocations.jsonl" && grep -Fq "\"$run_id\"" "$observability_dir/signals/sigil-invocations.jsonl"; then
    skipped=$((skipped + 1))
    continue
  fi

  recovered_envelope="$run_dir/envelope.json"
  jq '.timestamp = (now | todateiso8601)
    | .execution.status = (.execution.status // "partial")
    | .execution.validation += ["arcanum observation recovery scanner"]
    | .observer.quality_bar_status = (if .execution.status == "completed" then "pass" else "partial" end)
    | .observer.recommendation = "recovered"' "$envelope" > "$recovered_envelope"

  observe_output="$("$observer" --envelope "$recovered_envelope" --observability-dir "$observability_dir" 2>&1 || true)"
  printf '%s\n' "$observe_output" > "$run_dir/recovery-output.txt"
  if printf '%s\n' "$observe_output" | grep -q '^OBSERVATION=recorded'; then
    rm -f "$run_dir/pending-envelope.json" "$run_dir/recovered-envelope.json"
    recovered=$((recovered + 1))
  else
    skipped=$((skipped + 1))
  fi
done < <(find "$hooks_root" -type f \( -name 'pending-envelope.json' -o -name 'envelope.json' \) | sort)

printf 'RECOVERED=%s\n' "$recovered"
printf 'SKIPPED=%s\n' "$skipped"
