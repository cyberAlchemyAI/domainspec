# Agent Context Router

You must always be Radical Candid. We are looking to build something great here, so you need to help me think straight and push me to be better.

## MANDATORY FIRST STEP — No exceptions

Before ANY tool call or action, you must say out loud:

1. Which route from the table below applies to this task
2. Which files you will read based on that route

Do not call any tool until you have done this.

Do not load all documentation into context at once — read **only** the files listed for the identified route.

## Standing Rule — Session Scratchpad

For multi-turn work or sessions that produce concrete outputs, use `/scratchpad` to create a session file.

## Standing Rule — Exploring Codebase

When exploring the code, for any task, don't ever use Grep before check GitNexus and our internal MCP tool to understand the code structure and semantics. Don't use grep first, just after you have used GitNexus, `list_domains` and/or `semantic_query`.

## Standing Rule — Exploring Vault

Ao buscar docs do vault por significado (princípio, axioma, convenção, premissa), chame `vault-routing context_menu({query, k})` antes de abrir arquivos no chute.

---

## Route by Objective

### 1. Exploring or Understanding the Codebase

- 🛠 USE: `gitnexus_query({query: "concept"})` to find execution flows instead of grepping.
- 🛠 USE skill: `.Codex/skills/custom/semantic-index.md` to locate domain concepts by meaning (`list_domains`, `semantic_query`).

### 2. Exploring or Understand the Vault

- Check: `docs/vault/agent-navigation.md`

### 2. Debugging / Investigating an Error

- 📖 READ: `.Codex/skills/custom/debugging.md`
- 🛠 USE: GitNexus tools (`query` and `context`) to map the execution flow before assuming the cause.
- 🛠 USE skill: `.Codex/skills/custom/semantic-index.md` when searching for a concept/rule by meaning rather than symbol name.

### 3. Writing a Discovery, Specification, or Plan

- ⚠️ ORDER: **Discovery first** (high-level — design space, decisions, alternatives, open questions) → then **Spec** → then **Plan**. The discovery is the load-bearing document; skipping it means the spec invents instead of codifies. If asked to write a spec for a feature that has no discovery, stop and write the discovery first.
- 📖 READ: `.Codex/skills/custom/discovery-writing.md` — for the discovery.
- 🛠 USE skill: `/domainspec-spec-feature` — for the spec (only after a discovery exists).
- 📖 READ: `.Codex/skills/custom/code.md` — for the plan; catches layer-law violations and invented domain terms before implementation.
- 🛠 USE skill: `.Codex/skills/custom/domain-dictionary.md` if defining new business concepts or maintaining vocabulary.

### 4. Refactoring or Writing Code

- ⚠️ If this is a NEW feature, confirm Step 3 (Specs/Planning) is done first.
- 📖 READ: `.Codex/skills/custom/code.md` — it dispatches to the right sub-skill based on what you're doing.

### 5. Testing or Validating Changes

- 📖 READ: `.Codex/skills/custom/testing.md`

### 6. Closing the Session

- 🛠 USE skill: `/close-session`

### 7. Creating a new Markdown (.md) file

- ⚠️ MANDATORY: Prepend the standardized YAML frontmatter to EVERY new `.md` file.
- 🛠 USE skill: `.Codex/skills/custom/frontmatter.md` for the exact schema and allowed values.
- ℹ️ A `PreToolUse` hook auto-injects this cheatsheet on every `.md` Write/Edit — see `.Codex/README.md`.

### 8. Creating or Updating a Backlog file

- 📖 READ: `.Codex/skills/custom/backlog-pattern.md`
- Backlogs live in `docs/vault/backlog/` and use `node_type: backlog`.

### 9. Creating or Updating a README inside `/specs/`

- 📖 READ: `.Codex/skills/custom/readme-pattern.md`
- READMEs are navigation-only — no backlog items or actionable ideas.

### 10. Running a Robot-Talks Investigation

- 🛠 USE skill: `/robot-talks`

### 11. Task is ambiguous or doesn't fit the above

- **Ask the user for clarification** before loading any documentation or taking action.
- State which route(s) you considered and why none fit clearly.

### 12. Understanding Infrastructure (Local or Prod)

- 📖 READ: `.Codex/skills/custom/infrastructure-guide.md`
- Use when: debugging environment-specific issues, understanding service topology, evaluating infra changes, or asking how local maps to prod.

### 13. Investigating a Broad or Multi-Option Question

- 🛠 USE skill: `/domainspec-subagents-strategy` — when the question requires synthesis from 3+ sources, comparing 2+ alternatives, or has parallelizable independent sub-questions. Recommend (don't auto-invoke); user confirms the fan-out before dispatch.
- ⚠️ If `domainspec-subagents-research.md` + `domainspec-subagents-findings.md` already exist for the topic, the fan-out is done — prompt the user for discovery promotion (skill step 7):
  - knowledge scope → `vault/discovery/<topic>-definitions/<slug>.md`
  - application scope → `docs/features/<feature>/discovery/<slug>.md` (ask which feature folder)
