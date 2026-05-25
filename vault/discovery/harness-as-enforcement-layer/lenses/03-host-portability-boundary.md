---
lens: host-portability-boundary
date: 2026-05-25
dispatched_by: self
addresses: Separates the harness concept from any one host by showing both the current Claude dependence and the repo's repeated insistence that the harness layer must become portable; also uses the headless gap as a boundary test.
sources:
  - /Users/victorboscaro/domainspec/TOBANOV.md
  - /Users/victorboscaro/domainspec/vault/discovery/curator-pipeline-integration/discovery.md
verification: [local-files-read]
---

TOBANOV is explicit that today's host is Claude Code, but just as explicit that DomainSpec should not stay host-bound. It describes the current state as "all agents and skills run inside Claude Code" and later argues that the product needs a harness layer implemented as a plugin surface with modes such as `--harness=claude-code`, `--harness=anthropic-api`, `--harness=openai`, and `--harness=local-llama`. That only makes sense if "harness" means something more abstract than the current provider.

This gives us a useful separation. The host is the concrete environment that executes the system today. The harness is the conceptual and technical layer that adapts DomainSpec's agents, hooks, permissions, and routing contracts to that host. Claude Code is therefore an instance of the current harness realization, not the definition of harness itself.

The curator-pipeline discovery supplies a boundary test. Option C failed not because the curator idea was wrong, but because a headless Claude Code harness did not exist. That is revealing: the repo already treats the absence of a suitable harness as an infrastructure blocker independent of prompt quality. In other words, certain pipeline designs are impossible until the right execution-and-enforcement substrate exists.

This boundary test sharpens the concept. A harness is the layer whose presence or absence decides whether a DomainSpec workflow is runnable in a given operational regime. If a provider can execute prompts but cannot expose the required hooks, permissions, routing, or unattended execution mode, it is not yet a sufficient harness for that workload.
