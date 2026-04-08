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
3. Run /domainspec-help to verify command discovery

## Notes

- This v1 pack targets Copilot custom agents/skills only.
- The package is source-controlled in domainspec/copilot and can be copied to other repositories.
