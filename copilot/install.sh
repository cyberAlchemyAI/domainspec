#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PACK_DIR="$ROOT/domainspec/copilot"
AGENTS_SRC="$PACK_DIR/agents"
SKILLS_SRC="$PACK_DIR/skills"
AGENTS_DST="$ROOT/.github/agents"
SKILLS_DST="$ROOT/.github/skills"

# GSD (Get Shit Done) framework sources — lives in domainspec/.github/
GSD_ROOT="$ROOT/domainspec/.github"
GSD_AGENTS_SRC="$GSD_ROOT/agents"
GSD_SKILLS_SRC="$GSD_ROOT/skills"
GSD_RUNTIME_SRC="$GSD_ROOT/get-shit-done"
GSD_MANIFEST_SRC="$GSD_ROOT/gsd-file-manifest.json"
GSD_RUNTIME_DST="$ROOT/.github/get-shit-done"

FULL_TOOLS='[vscode/extensions, vscode/getProjectSetupInfo, vscode/installExtension, vscode/memory, vscode/newWorkspace, vscode/resolveMemoryFileUri, vscode/runCommand, vscode/vscodeAPI, vscode/askQuestions, execute/getTerminalOutput, execute/killTerminal, execute/sendToTerminal, execute/createAndRunTask, execute/runNotebookCell, execute/testFailure, execute/runInTerminal, read/terminalSelection, read/terminalLastCommand, read/getNotebookSummary, read/problems, read/readFile, read/viewImage, agent/runSubagent, browser/openBrowserPage, browser/readPage, browser/screenshotPage, browser/navigatePage, browser/clickElement, browser/dragElement, browser/hoverElement, browser/typeInPage, browser/runPlaywrightCode, browser/handleDialog, edit/createDirectory, edit/createFile, edit/createJupyterNotebook, edit/editFiles, edit/editNotebook, search/changes, search/codebase, search/fileSearch, search/listDirectory, search/textSearch, web/fetch, web/githubRepo, todo]'
STANDARD_TOOLS='[read, edit, search, execute, web, ask-questions, agent, todo]'
MINIMAL_TOOLS='[read, search]'

TOOLS_PROFILE="${DOMAINSPEC_TOOLS_PROFILE:-}"
CUSTOM_TOOLS="${DOMAINSPEC_CUSTOM_TOOLS:-}"
GSD_TOOLS_PROFILE="${DOMAINSPEC_GSD_TOOLS_PROFILE:-standard}"
GSD_CUSTOM_TOOLS="${DOMAINSPEC_GSD_CUSTOM_TOOLS:-}"
NON_INTERACTIVE=0

usage() {
  cat <<'EOF'
Usage: bash domainspec/copilot/install.sh [options]

Options:
  --tools-profile <full|standard|minimal|custom>
    Select built-in tool profile for DomainSpec agents (domainspec-* and mars).
  --custom-tools "[tool/a, tool/b, ...]"
      Explicit tools list to use when --tools-profile custom is selected.
  --gsd-tools-profile <full|standard|minimal|custom>
    Select built-in tool profile for installed gsd-* agents. Default: standard.
  --gsd-custom-tools "[tool/a, tool/b, ...]"
    Explicit tools list to use when --gsd-tools-profile custom is selected.
  --yes
      Non-interactive mode. Falls back to full profile when not specified.
  --help
      Show this help message.

Env vars:
  DOMAINSPEC_TOOLS_PROFILE
  DOMAINSPEC_CUSTOM_TOOLS
  DOMAINSPEC_GSD_TOOLS_PROFILE
  DOMAINSPEC_GSD_CUSTOM_TOOLS
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
    --gsd-tools-profile)
      GSD_TOOLS_PROFILE="${2:-}"
      shift 2
      ;;
    --gsd-custom-tools)
      GSD_CUSTOM_TOOLS="${2:-}"
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
GSD_TOOLS_PROFILE="${GSD_TOOLS_PROFILE:-standard}"

resolve_tools_value() {
  local profile="$1"
  local custom_value="$2"
  local custom_flag="$3"

  case "$profile" in
    full)
      printf '%s' "$FULL_TOOLS"
      ;;
    standard)
      printf '%s' "$STANDARD_TOOLS"
      ;;
    minimal)
      printf '%s' "$MINIMAL_TOOLS"
      ;;
    custom)
      if [[ -z "$custom_value" ]]; then
        echo "$custom_flag is required when profile=custom." >&2
        exit 1
      fi
      printf '%s' "$custom_value"
      ;;
    *)
      echo "Invalid profile: $profile" >&2
      exit 1
      ;;
  esac
}

TOOLS_VALUE="$(resolve_tools_value "$TOOLS_PROFILE" "$CUSTOM_TOOLS" "--custom-tools")"
GSD_TOOLS_VALUE="$(resolve_tools_value "$GSD_TOOLS_PROFILE" "$GSD_CUSTOM_TOOLS" "--gsd-custom-tools")"

mkdir -p "$AGENTS_DST"
mkdir -p "$SKILLS_DST"

cp -f "$AGENTS_SRC"/*.agent.md "$AGENTS_DST"/

node - "$AGENTS_DST" "$TOOLS_VALUE" <<'NODE'
const fs = require('fs');
const path = require('path');

const agentsDir = process.argv[2];
const toolsValue = process.argv[3];
const files = fs
  .readdirSync(agentsDir)
  .filter((name) => (name.startsWith('domainspec-') || name === 'mars-researcher.agent.md') && name.endsWith('.agent.md'));

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
echo "Applied tools profile '$TOOLS_PROFILE' to domainspec-* and mars-researcher agents"

# --- GSD framework install ---

SKIP_GSD="${DOMAINSPEC_SKIP_GSD:-}"
if [[ "$SKIP_GSD" == "1" ]]; then
  echo "Skipping GSD install (DOMAINSPEC_SKIP_GSD=1)"
else
  INSTALL_GSD=0
  if [[ $NON_INTERACTIVE -eq 1 ]]; then
    INSTALL_GSD=1
  else
    read -r -p "Install GSD (Get Shit Done) phase orchestration agents and skills? [Y/n]: " gsd_choice
    case "${gsd_choice:-y}" in
      [nN]*) ;;
      *) INSTALL_GSD=1 ;;
    esac
  fi

  if [[ $INSTALL_GSD -eq 1 ]]; then
    # Copy GSD agents
    if [[ -d "$GSD_AGENTS_SRC" ]]; then
      for agent_file in "$GSD_AGENTS_SRC"/gsd-*.agent.md; do
        [[ -f "$agent_file" ]] && cp -f "$agent_file" "$AGENTS_DST"/
      done
      GSD_AGENT_COUNT=$(ls -1 "$AGENTS_DST"/gsd-*.agent.md 2>/dev/null | wc -l)
      echo "Installed $GSD_AGENT_COUNT GSD agents"

      # Apply tools profile to GSD agents
      node - "$AGENTS_DST" "$GSD_TOOLS_VALUE" <<'GSDNODE'
const fs = require('fs');
const path = require('path');

const agentsDir = process.argv[2];
const toolsValue = process.argv[3];
const files = fs.readdirSync(agentsDir).filter((name) => name.startsWith('gsd-') && name.endsWith('.agent.md'));

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
GSDNODE
  echo "Applied tools profile '$GSD_TOOLS_PROFILE' to gsd-* agents"
    fi

    # Copy GSD skills
    if [[ -d "$GSD_SKILLS_SRC" ]]; then
      for skill_dir in "$GSD_SKILLS_SRC"/gsd-*; do
        [[ -d "$skill_dir" ]] || continue
        skill_name="$(basename "$skill_dir")"
        mkdir -p "$SKILLS_DST/$skill_name"
        [[ -f "$skill_dir/SKILL.md" ]] && cp -f "$skill_dir"/SKILL.md "$SKILLS_DST/$skill_name"/
      done
      GSD_SKILL_COUNT=$(ls -1d "$SKILLS_DST"/gsd-*/ 2>/dev/null | wc -l)
      echo "Installed $GSD_SKILL_COUNT GSD skills"
    fi

    # Copy GSD runtime (get-shit-done/ directory)
    if [[ -d "$GSD_RUNTIME_SRC" ]]; then
      mkdir -p "$GSD_RUNTIME_DST"
      cp -rf "$GSD_RUNTIME_SRC"/* "$GSD_RUNTIME_DST"/
      echo "Installed GSD runtime into .github/get-shit-done/"
    fi

    # Copy GSD file manifest
    if [[ -f "$GSD_MANIFEST_SRC" ]]; then
      cp -f "$GSD_MANIFEST_SRC" "$ROOT/.github/"
      echo "Installed GSD file manifest"
    fi

    echo "GSD framework installed successfully"
  else
    echo "Skipped GSD install"
  fi
fi

# --- Playwright E2E setup (optional) ---

SKIP_PLAYWRIGHT="${DOMAINSPEC_SKIP_PLAYWRIGHT:-}"
if [[ "$SKIP_PLAYWRIGHT" == "1" ]]; then
  echo "Skipping Playwright setup (DOMAINSPEC_SKIP_PLAYWRIGHT=1)"
else
  INSTALL_PLAYWRIGHT=0
  if [[ $NON_INTERACTIVE -eq 1 ]]; then
    INSTALL_PLAYWRIGHT=1
  else
    read -r -p "Install Playwright for UI E2E test generation? [y/N]: " pw_choice
    case "${pw_choice:-n}" in
      [yY]*) INSTALL_PLAYWRIGHT=1 ;;
    esac
  fi

  if [[ $INSTALL_PLAYWRIGHT -eq 1 ]]; then
    # Detect web app directory
    WEB_APP=""
    for candidate in apps/web web frontend; do
      if [[ -f "$ROOT/$candidate/package.json" ]]; then
        WEB_APP="$ROOT/$candidate"
        break
      fi
    done

    if [[ -n "$WEB_APP" ]]; then
      echo "Detected web app at: $WEB_APP"
      echo "Installing Playwright..."
      cd "$WEB_APP"
      npm install --save-dev @playwright/test 2>/dev/null || echo "Warning: npm install failed — install @playwright/test manually"
      npx playwright install chromium 2>/dev/null || echo "Warning: browser install failed — run 'npx playwright install chromium' manually"

      # Create e2e directory if missing
      mkdir -p "$WEB_APP/e2e"

      # Create playwright.config.ts if missing
      if [[ ! -f "$WEB_APP/playwright.config.ts" ]]; then
        cat > "$WEB_APP/playwright.config.ts" << 'PWCONFIG'
import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:4321",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
  },
})
PWCONFIG
        echo "Created playwright.config.ts"
      fi
      cd "$ROOT"
    else
      echo "No web app directory detected — skipping Playwright setup"
      echo "Install manually: npm install --save-dev @playwright/test && npx playwright install chromium"
    fi

    # Suggest MCP Playwright configuration for VS Code
    VSCODE_DIR="$ROOT/.vscode"
    MCP_FILE="$VSCODE_DIR/mcp.json"

    if [[ ! -f "$MCP_FILE" ]]; then
      mkdir -p "$VSCODE_DIR"
      cat > "$MCP_FILE" << 'MCPJSON'
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"],
      "env": {
        "DISPLAY": ":0"
      }
    }
  }
}
MCPJSON
      echo "Created .vscode/mcp.json with Playwright MCP server"
    else
      echo ".vscode/mcp.json already exists — add Playwright MCP server manually if needed:"
      echo '  "playwright": { "command": "npx", "args": ["@playwright/mcp@latest"] }'
    fi
  fi
fi
