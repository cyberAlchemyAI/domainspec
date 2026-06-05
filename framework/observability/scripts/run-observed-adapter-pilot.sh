#!/usr/bin/env bash
set -euo pipefail

usage() {
	cat <<'USAGE'
Usage:
  run-observed-adapter-pilot.sh --observability-dir <path>

Runs deterministic observed-invocation pilot closeouts for one local skill,
one local sigil, and one local spell adapter. This is a hook/adapter pilot:
the script assembles envelopes and calls observe-invocation.sh as the adapter
closeout path.
USAGE
}

observability_dir=""

while [[ "$#" -gt 0 ]]; do
	case "$1" in
		--observability-dir) observability_dir="$2"; shift 2 ;;
		--help|-h) usage; exit 0 ;;
		*)
			printf 'ERROR: unknown argument: %s\n' "$1" >&2
			usage >&2
			exit 2
			;;
	esac
done

if [[ -z "$observability_dir" ]]; then
	usage >&2
	exit 2
fi
if ! command -v jq >/dev/null 2>&1; then
	printf 'PILOT=failed\n'
	printf 'REASON=jq not found\n'
	exit 1
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
observer="$script_dir/observe-invocation.sh"
if [[ ! -x "$observer" ]]; then
	printf 'PILOT=failed\n'
	printf 'REASON=observer not executable\n'
	exit 1
fi

mkdir -p "$observability_dir" "$(dirname "$observability_dir")"
if [[ ! -f "$observability_dir/config.json" ]]; then
	cat > "$observability_dir/config.json" <<'JSON'
{
  "version": "0.2.0",
  "storage_model": "central-ledger-reference-indexes",
  "source_of_truth": "signals/sigil-invocations.jsonl",
  "per_sigil_index_path": "by-sigil/<sigil-name>.jsonl",
  "per_capability_index_path": "by-capability/<kind>/<capability-id>.jsonl",
  "thresholds": {
    "meaningful_executions": 99,
    "generated_outputs": 99,
    "related_workflow_gaps": 99,
    "severe_workflow_gaps": 99
  }
}
JSON
fi
if [[ ! -f "$observability_dir/reflection-state.json" ]]; then
	cat > "$observability_dir/reflection-state.json" <<'JSON'
{
  "version": "0.1.0",
  "last_reflection_at": null,
  "counters": {
    "meaningful_executions": 0,
    "generated_outputs": 0,
    "related_workflow_gaps": 0,
    "severe_workflow_gaps": 0,
    "quality_bar_failures": 0,
    "output_contract_drift_events": 0
  },
  "by_sigil": {},
  "by_capability": {}
}
JSON
fi

pilot_dir="$(mktemp -d)"
timestamp="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

write_envelope() {
	local path="$1"
	local id="$2"
	local kind="$3"
	local adapter="$4"

	jq -n \
		--arg timestamp "$timestamp" \
		--arg run_id "pilot-$kind-$id" \
		--arg session_id "observed-adapter-pilot" \
		--arg id "$id" \
		--arg kind "$kind" \
		--arg adapter "$adapter" \
		'{
			timestamp: $timestamp,
			run_id: $run_id,
			session_id: $session_id,
			sigil: $id,
			tier: "runtime",
			mode: "pilot",
			capability: {
				id: $id,
				kind: $kind,
				tier: "runtime",
				mode: "pilot"
			},
			request: {
				raw: null,
				summary: ("Observed adapter pilot for " + $id),
				intent: "Prove adapter closeout emits telemetry."
			},
			execution: {
				status: "completed",
				outputs: [$adapter],
				files_changed: [],
				validation: ["adapter closeout pilot"],
				notes: "deterministic pilot closeout"
			},
			observer: {
				quality_bar_status: "pass",
				anti_pattern_hits: [],
				workflow_gaps: [],
				output_contract_drift: false,
				reflection_trigger: "none",
				recommendation: "none"
			},
			target_artifact: $adapter
		}' > "$path"
}

write_envelope "$pilot_dir/skill.json" "arcanum-orchestrate" "skill" ".codex/commands/arcanum-orchestrate.md"
write_envelope "$pilot_dir/sigil.json" "signal-observer" "sigil" ".codex/commands/arcanum-sigil-signal-observer.md"
write_envelope "$pilot_dir/spell.json" "invoke" "spell" ".codex/commands/arcanum-spell-invoke.md"

"$observer" --envelope "$pilot_dir/skill.json" --observability-dir "$observability_dir" --observer-version adapter-pilot >/tmp/observed-adapter-pilot-skill.out
"$observer" --envelope "$pilot_dir/sigil.json" --observability-dir "$observability_dir" --observer-version adapter-pilot >/tmp/observed-adapter-pilot-sigil.out
"$observer" --envelope "$pilot_dir/spell.json" --observability-dir "$observability_dir" --observer-version adapter-pilot >/tmp/observed-adapter-pilot-spell.out

jq -e 'select(.capability.kind == "skill" and .capability.id == "arcanum-orchestrate")' "$observability_dir/signals/sigil-invocations.jsonl" >/dev/null
jq -e 'select(.capability.kind == "sigil" and .capability.id == "signal-observer")' "$observability_dir/signals/sigil-invocations.jsonl" >/dev/null
jq -e 'select(.capability.kind == "spell" and .capability.id == "invoke")' "$observability_dir/signals/sigil-invocations.jsonl" >/dev/null
test -s "$observability_dir/by-capability/skill/arcanum-orchestrate.jsonl"
test -s "$observability_dir/by-capability/sigil/signal-observer.jsonl"
test -s "$observability_dir/by-capability/spell/invoke.jsonl"

printf 'PILOT=pass\n'
printf 'OBSERVABILITY_DIR=%s\n' "$observability_dir"
printf 'SKILL=arcanum-orchestrate\n'
printf 'SIGIL=signal-observer\n'
printf 'SPELL=invoke\n'
