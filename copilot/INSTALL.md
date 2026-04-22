# Install DomainSpec Copilot Pack

## Scripted Install (Recommended)

Run:

```bash
bash domainspec/copilot/install.sh
```

The installer applies a tools profile to installed `domainspec-*` and `gsd-*` agents, installs DomainSpec pack assets, and can optionally install GSD runtime plus Playwright.

### Non-Interactive Examples

Full profile:

```bash
bash domainspec/copilot/install.sh --tools-profile full --yes
```

Standard coding profile:

```bash
bash domainspec/copilot/install.sh --tools-profile standard --yes
```

Custom tools profile:

```bash
bash domainspec/copilot/install.sh --tools-profile custom --custom-tools "[read, edit, search, agent]" --yes
```

Skip GSD runtime installation:

```bash
DOMAINSPEC_SKIP_GSD=1 bash domainspec/copilot/install.sh --tools-profile full --yes
```

Skip Playwright setup:

```bash
DOMAINSPEC_SKIP_PLAYWRIGHT=1 bash domainspec/copilot/install.sh --tools-profile full --yes
```

## Manual Copy (Fallback)

1. Copy `domainspec/copilot/agents/*.agent.md` into `.github/agents/`.
2. Copy each `domainspec/copilot/skills/*` directory into `.github/skills/`.
3. If GSD is required, also copy `domainspec/.github/agents/gsd-*.agent.md`, `domainspec/.github/skills/gsd-*`, `domainspec/.github/get-shit-done/`, and `domainspec/.github/gsd-file-manifest.json` into `.github/`.
4. Restart the chat session so command discovery refreshes.

## Installed Assets and Boundaries

### Shipped Copilot Pack Assets (`domainspec/copilot/*`)

- `domainspec-*` agents into `.github/agents/`
- `domainspec-*` skills into `.github/skills/`
- Bridge skills shipped in this pack:
  - `.github/skills/domainspec-ui-phase-bridge/SKILL.md`
  - `.github/skills/domainspec-ui-audit-bridge/SKILL.md`
  - `.github/skills/domainspec-plan-phase-bridge/SKILL.md`
  - `.github/skills/domainspec-execute-phase-bridge/SKILL.md`

### Internal GSD Runtime Assets (`domainspec/.github/*`)

- `gsd-*` agents into `.github/agents/`
- `gsd-*` skills into `.github/skills/`
- Runtime files under `.github/get-shit-done/`
- Integrity manifest at `.github/gsd-file-manifest.json`

## Post-Install Checks

Run these checks from repository root:

```bash
test -n "$(ls .github/agents/domainspec-*.agent.md 2>/dev/null)"
test -d .github/skills/domainspec-pipeline
test -d .github/skills/domainspec-plan-phase-bridge
test -d .github/skills/domainspec-execute-phase-bridge
test -d .github/skills/domainspec-ui-phase-bridge
test -d .github/skills/domainspec-ui-audit-bridge
```

If GSD was not skipped:

```bash
test -n "$(ls .github/agents/gsd-*.agent.md 2>/dev/null)"
test -d .github/get-shit-done
test -f .github/gsd-file-manifest.json
```

Validation commands:

1. Run `domainspec-help` to verify command discovery.
2. Run `bash domainspec/tools/check_docs_sync.sh` to verify docs-versus-assets sync.

## Playwright MCP Integration (UI E2E Testing)

When enabled, installer behavior is:

1. Install `@playwright/test` in detected app directory (`apps/web`, `web`, or `frontend`)
2. Install Chromium (`npx playwright install chromium`)
3. Create `playwright.config.ts` if absent
4. Ensure `e2e/` directory exists
5. Create `.vscode/mcp.json` with Playwright MCP config if absent

Manual setup fallback:

```bash
cd apps/web
npm install --save-dev @playwright/test
npx playwright install chromium
```
