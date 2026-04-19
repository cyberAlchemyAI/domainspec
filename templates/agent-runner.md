# Agent Runner Template

> Template for adding a self-hosted GitHub Actions runner with Copilot CLI to a DomainSpec project.

## Prerequisites

- Preset: `single-vps` or higher
- DomainSpec tuning loop enabled (`docs/signals/pipeline-signals.jsonl` exists)
- `domainspec-reflect` skill present
- GitHub Copilot Pro+ plan (for Copilot CLI programmatic mode)

## Files to Create

### 1. `infra/agent-runner/Dockerfile`

Sandboxed container for agent execution. Must include:

- Node.js (LTS) — for signal analysis tools
- GitHub CLI (`gh`) — for PR creation and API access
- `jq` — for JSON processing
- `git` — for repository operations
- Non-root user (`agent`)
- Git config for agent commits

Must NOT include:

- Production secrets or environment variables
- Database clients or connection strings
- Application runtime dependencies not needed for code analysis

### 2. `infra/agent-runner-setup.sh`

Idempotent setup script. Must handle:

- **Preflight:** Validate `GH_PAT_AGENT` env var, Docker, gh CLI
- **Auth:** Authenticate gh CLI with PAT
- **Copilot CLI:** Install or verify Copilot CLI
- **Container image:** Build `agent-runner:latest` from Dockerfile
- **Runner registration:** Download, configure, register self-hosted runner
- **Systemd service:** Create and enable `actions-runner.service`
- **Workspace:** Create `/opt/agent-workspace` with trust config

### 3. Workflow Integration

Add `agent-reflect` job to the tuning workflow (`.github/workflows/domainspec-tuning.yml`):

```yaml
agent-reflect:
  name: Agent Reflection
  needs: [analyze, create-tuning-issue]
  if: needs.analyze.outputs.thresholds_triggered == 'true'
  runs-on: [self-hosted, agent]
  timeout-minutes: 15
  steps:
    - uses: actions/checkout@v4
    - name: Prepare context
      # Build prompt from analysis JSON
    - name: Run Copilot CLI
      # Invoke with deny-tools for safety
    - name: Validate report
      # Check required sections, no forbidden paths
    - name: Create PR
      # Branch: domainspec/auto-tuning-{sha}
    - name: Create issue on failure
      # Fallback for human review
```

## Secrets

| Secret         | Scope             | Purpose                        |
| -------------- | ----------------- | ------------------------------ |
| `GH_PAT_AGENT` | repo + workflow   | Runner registration + Copilot CLI auth |

Store as GitHub Actions secret AND on VPS at `/home/deploy/.config/gh/hosts.yml`.

## Security Constraints

1. **Container isolation:** Agent runs inside `agent-runner:latest` — no host access
2. **Tool deny-list:** Copilot CLI runs with `--deny-tool='Bash,Terminal,Network,Browser'`
3. **Path allow-list:** Only `docs/signals/` and `domainspec/templates/` may be modified
4. **Validation gate:** Report must pass structural validation before PR creation
5. **Human review:** PRs require manual approval — no auto-merge
6. **Concurrency:** `cancel-in-progress: true` — one reflection at a time

## Signal Integration

The agent runner emits `agent-cost` signals after each run:

```jsonc
{
  "type": "agent-cost",
  "data": {
    "agentName": "domainspec-reflect",
    "model": "codex",
    "premiumRequests": 3,
    "durationSeconds": 120,
    "taskType": "reflection",
    "success": true,
    "triggerWorkflow": "domainspec-tuning.yml"
  }
}
```

Threshold TH10 alerts when `premiumRequests > 50` in a rolling 7-day window.
