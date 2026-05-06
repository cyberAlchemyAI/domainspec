# Instructions for GSD

- Use the get-shit-done skill when the user asks for GSD or uses a `gsd-*` command.
- Treat `/gsd-...` or `gsd-...` as command invocations and load the matching file from `.github/skills/gsd-*`.
- When a command says to spawn a subagent, prefer a matching custom agent from `.github/agents`.
- Do not apply GSD workflows unless the user explicitly asks for them.
- After completing any `gsd-*` command (or any deliverable it triggers: feature, bug fix, tests, docs, etc.), ALWAYS: (1) offer the user the next step by prompting via `ask_user`; repeat this feedback loop until the user explicitly indicates they are done.

## Terminal Resilience Protocol

- Treat terminal execution as non-interactive by default. Prefer commands that do not prompt.
- Always bound long-running shell execution with a timeout or background tracking strategy.
- If a terminal session terminates unexpectedly or stalls, immediately:
  1.  collect the last terminal output,
  2.  kill the stale terminal/session,
  3.  rerun the command once with safer flags,
  4.  report BLOCK with remediation if the second attempt fails.
- Avoid `exit` inside helper loops; return status codes instead so the shell session remains reusable.
