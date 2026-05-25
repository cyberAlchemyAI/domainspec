---
lens: runtime-enforcement-contract
date: 2026-05-25
dispatched_by: self
addresses: Shows that the current repo already defines the harness primarily as the runtime contract that makes behavior deterministic through hooks and permissions, not as a mere prompt container.
sources:
  - /Users/victorboscaro/domainspec/.claude/README.md
  - /Users/victorboscaro/domainspec/internal_tools/agents-telemetry/README.md
verification: [local-files-read]
---

The strongest local precedent is the Claude harness documentation itself. `.claude/README.md` defines the harness as the runtime that loads agents, applies tool permissions, and enforces deterministic behaviors via hooks. It explicitly contrasts `CLAUDE.md` routing, which is best-effort, with hooks, which the harness enforces regardless of agent intent. That distinction matters conceptually: the harness is where a DomainSpec rule stops being a recommendation to the agent and becomes a guaranteed execution condition.

The concrete example is the markdown frontmatter injection hook. The agent may forget Route 7, but the harness still injects the frontmatter schema before markdown writes and edits. The repo even names this pattern: "harness enforces, agent doesn't have to remember." This is already a conceptual definition in miniature. A harness is the layer that remembers on behalf of the agent.

The telemetry feature reinforces the same point from another angle. `internal_tools/agents-telemetry/README.md` instruments the harness itself, not the prompts, because the harness exposes reliable dispatch surfaces (`PreToolUse` and `PostToolUse` on `Task` and `Skill`). The project treats harness hooks as the trustworthy place to observe agent and skill behavior precisely because they sit below model cooperation.

Together these files support a narrow but strong claim: in DomainSpec, the harness is first the runtime contract that makes selected behaviors deterministic and observable. This is already stronger than "Claude Code is where our prompts run." It says the harness is the enforcement membrane between spec discipline and agent fallibility.
