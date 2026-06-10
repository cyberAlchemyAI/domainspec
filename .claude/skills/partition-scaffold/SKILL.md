---
name: partition-scaffold
description: Scaffold a new DomainSpec project's folder tree — the subject-grouped partition architecture (knowledge/, implementation, research, sessions, experiments, internal_tools mirror) with README stubs and the experiments machinery. Use when starting a new project or adding the partition layout to an existing one.
argument-hint: "[target-dir] [--name <project>] [--objective \"<sentence>\"] [--dry-run] [--force]"
allowed-tools: Read, Write, Bash, Glob, AskUserQuestion
---

<objective>
Create the canonical DomainSpec project partition tree in a target directory: the
top-level `knowledge/` subject grouping (`system_design_knowledge`, `domain_knowledge`,
`vault`), the per-project modalities (`implementation`, `research`, `sessions`,
`experiments`), the shared framework slots (`arcanum`, `domainspec`, `schema`), and the
`internal_tools/` nested sub-project mirror — each folder seeded with a README stub
carrying valid frontmatter, and `experiments/` seeded with its PROTOCOL + template +
validator. Idempotent: never clobbers existing files unless `--force`.
</objective>

<authority>
The tree shape is NOT defined in this skill — it is defined in
`vault/discovery/system-modeling-partition-architecture/discovery.md` (Revision
2026-06-09, decisions R-1..R-4) and recorded as data in this skill's
`partition-manifest.json`. If the manifest and the discovery disagree, the discovery
wins and the manifest is a bug. Do not invent or reorder partitions at the keyboard —
changing the tree is a discovery edit first (AX-DS-2 / AX-DS-4), this skill second.

Two prior decisions were deliberately overturned to reach this shape, and the skill
inherits both: ownership is NO LONGER the top axis (subject is — R-1), and `internal_tools/`
gets a recursive mirror (R-2, a scoped exception to the no-recursion rule). Nothing the
skill creates is enforced — placement is discipline, the node_type/layer validators are
unwired (gate-first, the discovery's OQ-6).
</authority>

<the-tree>
```
<project>/
├── arcanum/                  shared — skills/agents/workflows         [not mirrored]
├── domainspec/               shared — framework submodule             [not mirrored]
├── schema/                   project-local schema layer + code-ontology/ (L1 types+edges) [mirrored]
├── knowledge/                                                         [mirrored]
│   ├── system_design_knowledge/  how to build the system (shared)     [not mirrored]
│   ├── domain_knowledge/         the problem world
│   └── vault/                    knowledge about the ontology itself
├── implementation/           the system built                         [mirrored]
├── research/                 unresolved exploration                   [mirrored]
├── sessions/                 modality, never promoted                 [mirrored]
├── experiments/              pre-registered falsifiable (machinery)   [mirrored]
└── internal_tools/           nested sub-project = mirror of [mirrored] nodes
    └── schema/ knowledge/{domain_knowledge,vault}/ implementation/ research/ sessions/ experiments/
```
The four `[not mirrored]` nodes (`arcanum`, `domainspec`, `system_design_knowledge`,
`internal_tools`) are exactly the shared framework layer a sub-project inherits from its
parent rather than cloning.
</the-tree>

<knowledge-population>
The three `knowledge/` partitions are not empty stubs — they are populated from the framework:

- **`knowledge/vault/`** (ontology / how-to-organize-the-repo) — the canonical ontology docs are
  **SYMLINKED** (read-only, single source, zero drift) from the `domainspec/` submodule:
  `ontology-conventions`, `confidence-levels`, `foundational-knowledges`,
  `ontology-architecture-draft`, `agent-navigation`, `human-navigation`, and the ontology
  constitutions (`ontology`, `vault-folder-structure`, `discovery-structure`,
  `schema-amendment-discipline`, `frontmatter-ownership`, `edge-acyclicity`,
  `cross-repo-canonicalization-protocol`, `governs-runtime-witness`, `domain-tagging`). The
  project authors its OWN `axiom/ premise/ conceptual/ discovery/` (empty stub folders).
- **`knowledge/system_design_knowledge/`** (how-we-develop) — the project-specializable dev
  constitutions are **SEEDED as editable copies** from the framework
  (`development-practices`, `folder-structure`, `frontend`, `commit-message`); `event-system`
  and `robot-talks` are stubs. (Copy, not symlink, because these are *meant* to diverge
  per-project — the opposite of the ontology docs.)
- **`knowledge/domain_knowledge/`** — mirrors vault's node-type folders (`axiom/ premise/
  conceptual/ discovery/ sessions/`), empty, for the project's own domain.

Symlinks/seeds resolve through the project's `domainspec/` mount, which the scaffold creates as
a symlink to the framework repo (`link_to_framework`) and leaves untouched if it already exists.
Symlinks + seeds are TOP-LEVEL only; the `internal_tools` mirror inherits the ontology from its
parent (R-6). `convicção-bet-ledger` is omitted by default — opt in if the project adopts bets.
</knowledge-population>

<process>
1. Resolve the target directory (default: cwd) and read `partition-manifest.json`.
2. **Ask the user for the project objective (R-7, MANDATORY).** Every new project must carry
   a root README stating what it is for. Ask for a one sentence objective (it can be refined
   later — a single sentence is fine to start). Do not skip this; `scaffold.py` refuses a real
   run without `--objective`.
3. ALWAYS run `python3 scaffold.py <target> --dry-run [--name <project>]` first and show
   the user the planned dirs/files. Do not write on the first pass. (Dry-run does not need
   the objective.)
4. On confirmation, run `python3 scaffold.py <target> --objective "<the sentence>" [--name <project>]`
   to create the tree. It writes the root README (with the objective), README stubs
   (frontmatter + role) for every folder, and copies the `assets/experiments/` machinery into
   each `experiments/` folder (top-level and the internal_tools mirror).
5. If `domainspec/` should be a real submodule, tell the user to add it
   (`git submodule add <url> domainspec`) and symlink `.claude` into it — the scaffold
   only creates the empty slot + README, it does not vendor the framework. The base ontology
   schema lives in that submodule; the top-level `schema/` is only for THIS project's local
   vocabulary/edge extensions over it (R-6).
6. `implementation/` interior is NOT scaffolded beyond the slot + README: its three-layer
   structure is governed by `folder-structure-constitution.md` (R-5). Point the user there
   when they start building.
6a. The scaffold drops the canonical **code ontology** into top-level `schema/code-ontology/`
   (25 meta-types, 29 typed edges, 4 families, machine-checkable). After scaffolding, run
   `python3 schema/code-ontology/validate_ontology.py` to self-check it, and
   `… validate_ontology.py <L1.json>` to type-check an extracted concept graph against the
   edge signatures (Property P1). This is the L1 vocabulary the `domainspec-l1-extractor`
   builds feature concept-graphs from.
7. To enable experiment pre-registration enforcement, install the pre-commit hook:
   `ln -sf ../../experiments/tools/hooks/pre-commit .git/hooks/pre-commit` (per the
   experiments `PROTOCOL.md`).
8. Report: dirs created, files created, files skipped (already existed). Remind the user
   that placement is unenforced (gate-first) and that the tree's authority is the
   discovery, not this skill.
</process>

<relationship-to-other-skills>
- `domainspec-init` / `domainspec-start` set up the DomainSpec *docs* baseline (SPEC/registry/glossary) and run discovery. This skill is orthogonal: it lays the *partition folder tree* the knowledge/ and modalities live in. Run this to establish the repo shape; run `domainspec-start` to populate the domain.
- `experiments/` machinery is ported from the knowledge-taxonomy repo; its rules live in the scaffolded `experiments/PROTOCOL.md`.
</relationship-to-other-skills>

<constraints>
- Idempotent: re-running must not clobber authored content. Existing READMEs/assets are skipped unless `--force`.
- Stdlib only: `scaffold.py` and `validate_proposal.py` have no third-party deps.
- New `.md` files carry the standard frontmatter (the scaffold emits `node_type: readme` stubs); see the project frontmatter cheatsheet.
- Do not enforce. This skill builds structure; it never adds a validator, hook, or gate beyond the experiments pre-commit hook the user opts into.
</constraints>
