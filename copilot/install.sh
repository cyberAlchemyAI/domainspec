#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PACK_DIR="$ROOT/domainspec/copilot"
AGENTS_SRC="$PACK_DIR/agents"
SKILLS_SRC="$PACK_DIR/skills"
AGENTS_DST="$ROOT/.github/agents"
SKILLS_DST="$ROOT/.github/skills"

FULL_TOOLS='[vscode/extensions, vscode/askQuestions, vscode/getProjectSetupInfo, vscode/installExtension, vscode/memory, vscode/newWorkspace, vscode/resolveMemoryFileUri, vscode/runCommand, vscode/vscodeAPI, execute/getTerminalOutput, execute/killTerminal, execute/sendToTerminal, execute/createAndRunTask, execute/runNotebookCell, execute/testFailure, execute/runInTerminal, read/terminalSelection, read/terminalLastCommand, read/getNotebookSummary, read/problems, read/readFile, read/viewImage, agent/runSubagent, browser/openBrowserPage, browser/readPage, browser/screenshotPage, browser/navigatePage, browser/clickElement, browser/dragElement, browser/hoverElement, browser/typeInPage, browser/runPlaywrightCode, browser/handleDialog, edit/createDirectory, edit/createFile, edit/createJupyterNotebook, edit/editFiles, edit/editNotebook, edit/rename, search/changes, search/codebase, search/fileSearch, search/listDirectory, search/textSearch, search/usages, web/fetch, web/githubRepo, todo]'
STANDARD_TOOLS='[read, edit, search, execute, web, ask-questions, agent, todo]'
MINIMAL_TOOLS='[read, search]'

TOOLS_PROFILE="${DOMAINSPEC_TOOLS_PROFILE:-}"
CUSTOM_TOOLS="${DOMAINSPEC_CUSTOM_TOOLS:-}"
NON_INTERACTIVE=0

usage() {
  cat <<'EOF'
Usage: bash domainspec/copilot/install.sh [options]

Options:
  --tools-profile <full|standard|minimal|custom>
      Select built-in tool profile for installed agents.
  --custom-tools "[tool/a, tool/b, ...]"
      Explicit tools list to use when --tools-profile custom is selected.
  --yes
      Non-interactive mode. Falls back to full profile when not specified.
  --help
      Show this help message.

Env vars:
  DOMAINSPEC_TOOLS_PROFILE
  DOMAINSPEC_CUSTOM_TOOLS
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --tools-profile)
      TOOLS_PROFILE="${2:-}"
      shift 2
      ;;
    --custom-tools)
      CUSTOM_TOOLS="${2:-}"
      shift 2
      ;;
    --yes)
      NON_INTERACTIVE=1
      shift
      ;;
    --help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$TOOLS_PROFILE" && $NON_INTERACTIVE -eq 0 ]]; then
  echo "Select tools profile for DomainSpec agents:"
  echo "  1) full     - all repository tool permissions"
  echo "  2) standard - common coding tools only"
  echo "  3) minimal  - read/search only"
  echo "  4) custom   - provide explicit tools list"
  read -r -p "Choice [1-4] (default 1): " choice

  case "${choice:-1}" in
    1) TOOLS_PROFILE="full" ;;
    2) TOOLS_PROFILE="standard" ;;
    3) TOOLS_PROFILE="minimal" ;;
    4)
      TOOLS_PROFILE="custom"
      read -r -p "Custom tools list (YAML inline list, e.g. [read, edit, search]): " CUSTOM_TOOLS
      ;;
    *)
      echo "Invalid choice: ${choice}" >&2
      exit 1
      ;;
  esac
fi

TOOLS_PROFILE="${TOOLS_PROFILE:-full}"

case "$TOOLS_PROFILE" in
  full)
    TOOLS_VALUE="$FULL_TOOLS"
    ;;
  standard)
    TOOLS_VALUE="$STANDARD_TOOLS"
    ;;
  minimal)
    TOOLS_VALUE="$MINIMAL_TOOLS"
    ;;
  custom)
    if [[ -z "$CUSTOM_TOOLS" ]]; then
      echo "--custom-tools is required when --tools-profile custom is used." >&2
      exit 1
    fi
    TOOLS_VALUE="$CUSTOM_TOOLS"
    ;;
  *)
    echo "Invalid --tools-profile: $TOOLS_PROFILE" >&2
    exit 1
    ;;
esac

mkdir -p "$AGENTS_DST"
mkdir -p "$SKILLS_DST"

cp -f "$AGENTS_SRC"/*.agent.md "$AGENTS_DST"/

node - "$AGENTS_DST" "$TOOLS_VALUE" <<'NODE'
const fs = require('fs');
const path = require('path');

const agentsDir = process.argv[2];
const toolsValue = process.argv[3];
const files = fs.readdirSync(agentsDir).filter((name) => name.startsWith('domainspec-') && name.endsWith('.agent.md'));

for (const fileName of files) {
  const filePath = path.join(agentsDir, fileName);
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split('\n');

  let fmStart = -1;
  let fmEnd = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      if (fmStart === -1) fmStart = i;
      else {
        fmEnd = i;
        break;
      }
    }
  }

  if (fmStart === -1 || fmEnd === -1) continue;

  let toolsIdx = -1;
  for (let i = fmStart + 1; i < fmEnd; i++) {
    if (lines[i].startsWith('tools:')) {
      toolsIdx = i;
      break;
    }
  }
  if (toolsIdx === -1) continue;

  let endIdx = toolsIdx + 1;
  while (endIdx < fmEnd) {
    if (/^[A-Za-z][A-Za-z0-9_-]*:/.test(lines[endIdx])) break;
    endIdx++;
  }

  lines.splice(toolsIdx, endIdx - toolsIdx, `tools: ${toolsValue}`);
  fs.writeFileSync(filePath, lines.join('\n'));
}
NODE

for skill_dir in "$SKILLS_SRC"/*; do
  skill_name="$(basename "$skill_dir")"
  mkdir -p "$SKILLS_DST/$skill_name"
  cp -f "$skill_dir"/SKILL.md "$SKILLS_DST/$skill_name"/
done

echo "Installed DomainSpec Copilot pack into .github/agents and .github/skills"
echo "Applied tools profile '$TOOLS_PROFILE' to domainspec-* agents"
