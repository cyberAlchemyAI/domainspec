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
- 🛠 USE skill: `.claude/skills/custom/semantic-index.md` to locate domain concepts by meaning (`list_domains`, `semantic_query`).

### 2. Exploring or Understand the Vault
- Check: `docs/vault/agent-navigation.md`

### 2. Debugging / Investigating an Error
- 📖 READ: `.claude/skills/custom/debugging.md`
- 🛠 USE: GitNexus tools (`query` and `context`) to map the execution flow before assuming the cause.
- 🛠 USE skill: `.claude/skills/custom/semantic-index.md` when searching for a concept/rule by meaning rather than symbol name.

### 3. Writing a Discovery, Specification, or Plan
- ⚠️ ORDER: **Discovery first** (high-level — design space, decisions, alternatives, open questions) → then **Spec** → then **Plan**. The discovery is the load-bearing document; skipping it means the spec invents instead of codifies. If asked to write a spec for a feature that has no discovery, stop and write the discovery first.
- 📖 READ: `.claude/skills/custom/discovery-writing.md` — for the discovery.
- 🛠 USE skill: `/domainspec-spec-feature` — for the spec (only after a discovery exists).
- 📖 READ: `.claude/skills/custom/code.md` — for the plan; catches layer-law violations and invented domain terms before implementation.
- 🛠 USE skill: `.claude/skills/custom/domain-dictionary.md` if defining new business concepts or maintaining vocabulary.

### 4. Refactoring or Writing Code
- ⚠️ If this is a NEW feature, confirm Step 3 (Specs/Planning) is done first.
- 📖 READ: `.claude/skills/custom/code.md` — it dispatches to the right sub-skill based on what you're doing.

### 5. Testing or Validating Changes
- 📖 READ: `.claude/skills/custom/testing.md`

### 6. Closing the Session
- 🛠 USE skill: `/close-session`

### 7. Creating a new Markdown (.md) file
- ⚠️ MANDATORY: Prepend the standardized YAML frontmatter to EVERY new `.md` file.
- 🛠 USE skill: `.claude/skills/custom/frontmatter.md` for the exact schema and allowed values.
- ℹ️ A `PreToolUse` hook auto-injects this cheatsheet on every `.md` Write/Edit — see `.claude/README.md`.

### 8. Creating or Updating a Backlog file
- 📖 READ: `.claude/skills/custom/backlog-pattern.md`
- Backlogs live in `docs/vault/backlog/` and use `node_type: backlog`.

### 9. Creating or Updating a README inside `/specs/`
- 📖 READ: `.claude/skills/custom/readme-pattern.md`
- READMEs are navigation-only — no backlog items or actionable ideas.

### 10. Running a Robot-Talks Investigation
- 🛠 USE skill: `/robot-talks`

### 11. Task is ambiguous or doesn't fit the above
- **Ask the user for clarification** before loading any documentation or taking action.
- State which route(s) you considered and why none fit clearly.

### 12. Understanding Infrastructure (Local or Prod)
- 📖 READ: `.claude/skills/custom/infrastructure-guide.md`
- Use when: debugging environment-specific issues, understanding service topology, evaluating infra changes, or asking how local maps to prod.

### 13. Investigating a Broad or Multi-Option Question
- 🛠 USE skill: `/domainspec-subagents-strategy` — when the question requires synthesis from 3+ sources, comparing 2+ alternatives, or has parallelizable independent sub-questions. Recommend (don't auto-invoke); user confirms the fan-out before dispatch. v0.2.0+: the skill is parameterized — user may supply `goal`, `layers`, `n`, `models`, `validator`, `telemetry`, `dispatch_kind`, `loop_cap`, `bootstrap_override` or let the skill apply heuristic defaults (`single-lookup` / `flat-fanout` / `triangulation` / `adversarial-audit` / `parent-synthesis` / `meta-dispatch`).
- ⚠️ If `domainspec-subagents-research.md` + `domainspec-subagents-findings.md` already exist for the topic, the fan-out is done — prompt the user for discovery promotion (skill step 7):
  - knowledge scope → `vault/discovery/<topic>-definitions/<slug>.md`
  - application scope → `docs/features/<feature>/discovery/<slug>.md` (ask which feature folder)

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **domainspec** (3157 symbols, 5367 relationships, 164 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## When Debugging

1. `gitnexus_query({query: "<error or symptom>"})` — find execution flows related to the issue
2. `gitnexus_context({name: "<suspect function>"})` — see all callers, callees, and process participation
3. `READ gitnexus://repo/domainspec/process/{processName}` — trace the full execution flow step by step
4. For regressions: `gitnexus_detect_changes({scope: "compare", base_ref: "main"})` — see what your branch changed

## When Refactoring

- **Renaming**: MUST use `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` first. Review the preview — graph edits are safe, text_search edits need manual review. Then run with `dry_run: false`.
- **Extracting/Splitting**: MUST run `gitnexus_context({name: "target"})` to see all incoming/outgoing refs, then `gitnexus_impact({target: "target", direction: "upstream"})` to find all external callers before moving code.
- After any refactor: run `gitnexus_detect_changes({scope: "all"})` to verify only expected files changed.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Tools Quick Reference

| Tool | When to use | Command |
|------|-------------|---------|
| `query` | Find code by concept | `gitnexus_query({query: "auth validation"})` |
| `context` | 360-degree view of one symbol | `gitnexus_context({name: "validateUser"})` |
| `impact` | Blast radius before editing | `gitnexus_impact({target: "X", direction: "upstream"})` |
| `detect_changes` | Pre-commit scope check | `gitnexus_detect_changes({scope: "staged"})` |
| `rename` | Safe multi-file rename | `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` |
| `cypher` | Custom graph queries | `gitnexus_cypher({query: "MATCH ..."})` |

## Impact Risk Levels

| Depth | Meaning | Action |
|-------|---------|--------|
| d=1 | WILL BREAK — direct callers/importers | MUST update these |
| d=2 | LIKELY AFFECTED — indirect deps | Should test |
| d=3 | MAY NEED TESTING — transitive | Test if critical path |

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/domainspec/context` | Codebase overview, check index freshness |
| `gitnexus://repo/domainspec/clusters` | All functional areas |
| `gitnexus://repo/domainspec/processes` | All execution flows |
| `gitnexus://repo/domainspec/process/{name}` | Step-by-step execution trace |

## Self-Check Before Finishing

Before completing any code modification task, verify:
1. `gitnexus_impact` was run for all modified symbols
2. No HIGH/CRITICAL risk warnings were ignored
3. `gitnexus_detect_changes()` confirms changes match expected scope
4. All d=1 (WILL BREAK) dependents were updated

## Keeping the Index Fresh

After committing code changes, the GitNexus index becomes stale. Re-run analyze to update it:

```bash
npx gitnexus analyze
```

If the index previously included embeddings, preserve them by adding `--embeddings`:

```bash
npx gitnexus analyze --embeddings
```

To check whether embeddings exist, inspect `.gitnexus/meta.json` — the `stats.embeddings` field shows the count (0 means no embeddings). **Running analyze without `--embeddings` will delete any previously generated embeddings.**

> Claude Code users: A PostToolUse hook handles this automatically after `git commit` and `git merge`.

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
