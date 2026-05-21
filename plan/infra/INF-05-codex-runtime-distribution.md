---
tags: [domainspec, codex, runtime, distribution, installer, whisky-doses]
node_type: implementation-plan
is_session: false
layer: architecture, application
nature: procedural, technical
status: active
version: 0.2.0
last_updated: 2026-05-20
---

# INF-05 - Codex Runtime Distribution

## Objective

Create a canonical DomainSpec installer for Codex runtime consumers, including agents, skills, GSD support files, `.codex/commands` bridge files, and an embedded thin framework reference bundle.

## Problem

DomainSpec currently has a Copilot installer and checked-in Codex-shaped assets, but no single canonical Codex installer equivalent to Arcanum's runtime bridge pattern. The Whisky Doses install proved that the Codex runtime surface is small, but a full framework copy is unnecessarily heavy. A consumer install should not duplicate the whole DomainSpec tree by default.

The Whisky Doses local runtime surface needs:

- `.codex/agents/` from DomainSpec.
- `.Codex/skills/` from DomainSpec's `.agents/skills/` distribution.
- `.Codex/get-shit-done/` from DomainSpec's GSD runtime assets.
- project-local `.codex/commands/*.md` bridges by hand.
- a small copied `domainspec/` reference bundle that resolves framework docs/templates read by skills.

That `domainspec/` reference path should default to a copied thin bundle containing only project-applied runtime assets, such as:

- top-level framework constraints and vocabulary (`CHANGELOG.md`, `TAXONOMY.md`, `RELATIONSHIPS.md`, `CONSTITUTION.md`),
- architecture and layering references (`ARCHITECTURE.md`, `ARCHITECTURE-PATTERN-LIBRARY.md`, `architecture/pattern-library/`),
- delivery rules (`TEST-PIPELINE.md`, `OBSERVABILITY.md`),
- `templates/`,
- only `tools/` scripts referenced by installed runtime skills.

Do not copy by default:

- `copilot/` package and installer docs,
- `plan/` framework roadmap and internal task-session docs,
- framework example feature docs,
- internal-only commands such as `domainspec-task-session`.

It should not be a full physical copy unless the caller explicitly requests `--vendor-framework`.

## Scope

- In scope:
  - `domainspec/tools/bootstrap_domainspec_codex.sh`.
  - Codex runtime install path.
  - Command bridge generation for project-facing `domainspec-*` commands.
  - Optional project-local alias commands such as `whisky-domainspec`.
  - Verification checks for agents, skills, commands, GSD runtime paths, and the embedded `domainspec/` bundle.
  - Optional `--vendor-framework` mode for consumers that intentionally need an offline full copy.
- Out of scope:
  - Rewriting DomainSpec skill semantics.
  - Changing Copilot installer behavior.
  - Network-based installation.

## Proposed Install Contract

```bash
implementation/domainspec/tools/bootstrap_domainspec_codex.sh \
  --target projects/whisky-doses \
  --project-command whisky-domainspec \
  --force
```

Installer outputs:

- `.codex/agents/*.toml`
- `.codex/commands/domainspec-*.md`
- `.Codex/skills/*/SKILL.md`
- `.Codex/get-shit-done/`
- `domainspec/` as a copied thin bundle by default.
- optional `.agents/skills/` compatibility copy

## Implementation Tasks

1. [x] Promote `.agents/skills/` as the canonical Codex skill source.
2. [x] Define the default framework reference mode as a copied thin bundle generated from project-applied runtime assets.
3. [x] Add bridge generation for project-facing `domainspec-*` commands.
4. [x] Normalize consumer path references inside installed Codex assets.
5. [x] Add `--project-command <name>` for consumer-specific aliases.
6. [x] Add `--dry-run`, `--force`, and post-install verification.
7. [ ] Document install and recovery steps in `copilot/INSTALL.md` or a new `codex/INSTALL.md`.
8. [ ] Add optional `--vendor-framework` only if a future consumer explicitly needs the full framework tree.

## Done Criteria

- [x] A fresh empty consumer repo can install DomainSpec Codex runtime without physically copying the full framework by default.
- [x] `domainspec-orchestrate`, `domainspec-start`, `domainspec-init`, `domainspec-pipeline`, and `domainspec-help` are discoverable from `.codex/commands/`.
- [x] All generated command bridges point to existing skill files.
- [x] All installed agent references to `.Codex/skills/` and `.Codex/get-shit-done/` resolve.
- [x] All installed references to `domainspec/CHANGELOG.md`, `domainspec/templates/`, and other framework docs resolve through the embedded thin bundle.
- [x] Verification fails clearly when the consumer project is missing required runtime assets.

## Verification Evidence

- Temp install target: `/tmp/domainspec-codex-install-test`
- Whisky install target: `projects/whisky-doses`
- Thin bundle size after install: approximately `432K`
- Generated project-facing command bridges: `38`
- Excluded internal surfaces:
  - `copilot/`
  - `plan/`
  - `docs/features/` framework examples
  - `domainspec-task-session`
  - `domainspec-definitions-governance`
