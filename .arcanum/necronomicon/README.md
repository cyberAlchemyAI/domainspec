---
tags: [arcanum, codex-command]
node_type: readme
is_session: false
layer: application
nature: reference, explanatory
status: active
version: 0.1.0
last_updated: 2026-05-27
---

# Necronomicon Repository Harness

This folder stores repository-local Necronomicon harness state: selected capabilities, session memory, route ledgers, decisions, handoffs, and capability update reports.

It is not a copied Arcanum definition store. Runtime command definitions live directly under .codex/commands/, and canonical Arcanum source remains upstream or embedded in generated command snapshots.

Expected contents:

- capabilities.json records selected local commands and fallback policy.
- sessions/ stores Necronomicon memory and route history.
- capability-updates/ stores explicit add, remove, or refresh reports.

Do not place copied formulae, transmutations, arcana, spells, registries, framework folders, or runtime command trees here.
