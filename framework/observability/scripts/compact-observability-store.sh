#!/usr/bin/env bash
set -euo pipefail

usage() {
	cat <<'USAGE'
Usage:
  compact-observability-store.sh [--observability-dir <path>]

Compacts the repository observability store around one source of truth:
signals/sigil-invocations.jsonl. The script dedupes that ledger by
dedupe_key/run_id, rebuilds lookup indexes, and removes superseded hook
envelope copies when a final envelope exists.
USAGE
}

observability_dir=""
while [[ "$#" -gt 0 ]]; do
	case "$1" in
		--observability-dir) observability_dir="$2"; shift 2 ;;
		--help|-h) usage; exit 0 ;;
		*) printf 'ERROR: unknown argument: %s\n' "$1" >&2; usage >&2; exit 2 ;;
	esac
done

if ! command -v jq >/dev/null 2>&1; then
	printf 'ERROR: jq not found\n' >&2
	exit 1
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(git -C "$script_dir" rev-parse --show-toplevel 2>/dev/null || cd "$script_dir/../.." && pwd)"
if [[ -z "$observability_dir" ]]; then
	observability_dir="$repo_root/.arcanum/observability"
fi

ledger="$observability_dir/signals/sigil-invocations.jsonl"
rebuilder="$script_dir/rebuild-observability-indexes.sh"
[[ -f "$ledger" ]] || { printf 'COMPACTED=0\nREASON=no central ledger\n'; exit 0; }

before="$(wc -l < "$ledger" | tr -d ' ')"
tmp="$(mktemp)"
jq -sc '
	def key:
		(.dedupe_key // .run_id // ([.timestamp, (.capability.kind // "sigil"), (.capability.id // .sigil), (.mode // "execute"), ((.target_artifact // "") | tostring)] | join("|")));
	reduce .[] as $event ({seen: {}, rows: []};
		($event | key) as $key
		| if (.seen[$key] // false) then .
		  else .seen[$key] = true | .rows += [$event]
		  end
	) | .rows[]' "$ledger" > "$tmp"
mv "$tmp" "$ledger"
after="$(wc -l < "$ledger" | tr -d ' ')"

if [[ -x "$rebuilder" ]]; then
	"$rebuilder" --observability-dir "$observability_dir" >/dev/null
fi

removed_run_copies=0
promoted_recovered=0
if [[ -d "$observability_dir/runs/arcanum-hooks" ]]; then
	while IFS= read -r final_envelope; do
		run_dir="$(dirname "$final_envelope")"
		for duplicate in "$run_dir/pending-envelope.json" "$run_dir/recovered-envelope.json"; do
			if [[ -f "$duplicate" ]]; then
				rm -f "$duplicate"
				removed_run_copies=$((removed_run_copies + 1))
			fi
		done
	done < <(find "$observability_dir/runs/arcanum-hooks" -type f -name 'envelope.json' | sort)
	while IFS= read -r recovered_envelope; do
		run_dir="$(dirname "$recovered_envelope")"
		final_envelope="$run_dir/envelope.json"
		if [[ ! -f "$final_envelope" ]]; then
			mv "$recovered_envelope" "$final_envelope"
			rm -f "$run_dir/pending-envelope.json"
			promoted_recovered=$((promoted_recovered + 1))
			removed_run_copies=$((removed_run_copies + 1))
		fi
	done < <(find "$observability_dir/runs/arcanum-hooks" -type f -name 'recovered-envelope.json' | sort)
fi

printf 'COMPACTED=1\n'
printf 'LEDGER_BEFORE=%s\n' "$before"
printf 'LEDGER_AFTER=%s\n' "$after"
printf 'DEDUPED=%s\n' "$((before - after))"
printf 'REMOVED_RUN_COPIES=%s\n' "$removed_run_copies"
printf 'PROMOTED_RECOVERED=%s\n' "$promoted_recovered"
printf 'INDEX_MODEL=central-ledger-reference\n'
