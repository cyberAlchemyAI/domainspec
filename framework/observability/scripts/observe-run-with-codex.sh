#!/usr/bin/env bash
set -euo pipefail

usage() {
	cat <<'USAGE'
Usage:
  observe-run-with-codex.sh <run-dir>

Runs a bounded Codex CLI observer over an observed run bundle and writes
observer-output.json. If Codex is unavailable, skips without failing the run.
USAGE
}

if [[ "$#" -ne 1 ]]; then
	usage >&2
	exit 2
fi

run_dir="$1"
if [[ ! -f "$run_dir/envelope.json" ]]; then
	printf 'OBSERVATION=skipped\n'
	printf 'REASON=run envelope not found\n'
	exit 0
fi

find_codex() {
	if [[ -n "${CODEX_BIN:-}" && -x "${CODEX_BIN:-}" ]]; then
		printf '%s\n' "$CODEX_BIN"
		return 0
	fi
	if command -v codex >/dev/null 2>&1; then
		command -v codex
		return 0
	fi
	local candidate
	for candidate in \
		"$HOME/.vscode-server/extensions/openai.chatgpt-"*/bin/linux-x86_64/codex \
		"$HOME/.vscode/extensions/openai.chatgpt-"*/bin/linux-x86_64/codex \
		"$HOME/.local/bin/codex" \
		"$HOME/bin/codex"; do
		if [[ -x "$candidate" ]]; then
			printf '%s\n' "$candidate"
			return 0
		fi
	done
	return 1
}

codex_bin="$(find_codex || true)"
if [[ -z "$codex_bin" ]]; then
	printf 'OBSERVATION=skipped\n'
	printf 'REASON=codex CLI not found\n'
	exit 0
fi

repo_root="${EXPERIMENT_REPO_ROOT:-$(git -C "$PWD" rev-parse --show-toplevel 2>/dev/null || pwd)}"
output="$run_dir/observer-output.json"
prompt="Read this observed Arcanum run bundle: $run_dir. Return exactly one JSON object matching the Signal Observer envelope observer result. Do not edit files. Do not include secrets. If close data is missing, use partial or interrupted based on checkpoints."

if ! "$codex_bin" exec \
	-C "$repo_root" \
	--sandbox read-only \
	--output-last-message "$output" \
	"$prompt" >/dev/null 2>&1; then
	printf 'OBSERVATION=failed\n'
	printf 'REASON=codex observer failed\n'
	printf 'OUTPUT=%s\n' "$output"
	exit 0
fi

if command -v jq >/dev/null 2>&1 && ! jq -e . "$output" >/dev/null 2>&1; then
	printf 'OBSERVATION=failed\n'
	printf 'REASON=observer output invalid JSON\n'
	printf 'OUTPUT=%s\n' "$output"
	exit 0
fi

printf 'OBSERVATION=recorded\n'
printf 'OUTPUT=%s\n' "$output"
