# Install DomainSpec Copilot Pack

## Target folders

- .github/agents/
- .github/skills/

## Option 1: Manual copy

1. Copy all files from domainspec/copilot/agents to .github/agents
2. Copy each directory from domainspec/copilot/skills to .github/skills
3. Restart chat session so command discovery refreshes

## Option 2: Scripted copy

Run:

```bash
bash domainspec/copilot/install.sh
```

The installer now asks which tool-permission profile should be applied to `domainspec-*` agents.

### Non-interactive examples

Use full repository permissions:

```bash
bash domainspec/copilot/install.sh --tools-profile full --yes
```

Use standard coding permissions:

```bash
bash domainspec/copilot/install.sh --tools-profile standard --yes
```

Use a custom tools list:

```bash
bash domainspec/copilot/install.sh --tools-profile custom --custom-tools "[read, edit, search, agent]" --yes
```

## Post-install checks

1. Confirm agent files exist under .github/agents with names domainspec-\*.agent.md
2. Confirm skill directories exist under .github/skills/domainspec-\*
3. Confirm GSD agents exist under .github/agents with names gsd-\*.agent.md
4. Confirm GSD skills exist under .github/skills/gsd-\*
5. Run /domainspec-help to verify command discovery

## GSD Phase Orchestration

The installer includes the GSD (Get Shit Done) framework — phase-based planning and execution agents used by DomainSpec bridge skills (`domainspec-plan-phase-bridge`, `domainspec-execute-phase-bridge`, `domainspec-ui-phase-bridge`).

GSD is installed by default. To skip:

```bash
DOMAINSPEC_SKIP_GSD=1 bash domainspec/copilot/install.sh --tools-profile full --yes
```

### What gets installed

- GSD agents (gsd-\*.agent.md) — planning, execution, research, verification, UI design
- GSD skills (gsd-\*/SKILL.md) — phase orchestration, milestone management, session tracking
- GSD runtime (.github/get-shit-done/) — CLI tools, references, templates
- GSD file manifest (.github/gsd-file-manifest.json) — integrity checksums

## Notes

- This v1 pack targets Copilot custom agents/skills only.
- The package is source-controlled in domainspec/copilot and can be copied to other repositories.

## Playwright MCP Integration (UI E2E Testing)

The installer can optionally set up Playwright for UI E2E test generation derived from DomainSpec UI-SPEC.md documents.

### What gets installed

1. **`@playwright/test`** — dev dependency in detected web app directory
2. **Chromium browser** — via `npx playwright install chromium`
3. **`playwright.config.ts`** — base config with desktop + mobile projects
4. **`e2e/` directory** — test file target for generated Playwright specs
5. **`.vscode/mcp.json`** — MCP server config for Playwright browser tools

### Interactive install

The installer prompts for Playwright setup by default. Say `y` to enable.

### Non-interactive install

```bash
bash domainspec/copilot/install.sh --tools-profile full --yes
```

This installs Playwright automatically. To skip:

```bash
DOMAINSPEC_SKIP_PLAYWRIGHT=1 bash domainspec/copilot/install.sh --tools-profile full --yes
```

### Manual Playwright setup

If the web app wasn't detected or you want to install manually:

```bash
cd apps/web  # or your web app directory
npm install --save-dev @playwright/test
npx playwright install chromium
```

Then add the MCP server to `.vscode/mcp.json`:

```json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

### How it works with DomainSpec

1. **`domainspec-generate-tests --ui`** reads `UI-SPEC.md` and `STORIES.md` to derive E2E test obligations
2. **`domainspec-generate-tests --scaffold --ui`** creates Playwright test stubs under `e2e/{feature}/`
3. **Playwright MCP** enables agents to run browser interactions, capture screenshots, and validate UI rendering
4. **`domainspec-ui-audit-bridge`** uses Playwright for visual regression and 6-pillar auditing
