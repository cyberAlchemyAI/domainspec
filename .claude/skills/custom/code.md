---
description: Fundamentals and routing for any code change — new features and refactoring follow the same rules
---

# Code — Fundamentals

These apply to every code change, no exceptions.

**Impact before action** — map blast radius with `gitnexus-refactoring` before touching anything. Use `semantic_index` to understand code semantics before assuming. (AX-SYS-1, AX-SYS-3 · system)

**Layer law** — imports flow one way: `use_cases → domain → infrastructure`. Lower layers never import higher ones. (AX-SYS-2 · system)

**Domain purity** — no IO, ORM imports, or framework calls inside `domain/`. Pure functions only. (AX-SYS-2 · system)

**SLA** — one function, one abstraction level. Orchestration never mixes with manipulation (parsing, IO, SQL). (AX-SYS-2 · system)

**Repository isolation** — all persistence delegated to `infrastructure/repositories/`. No direct DB access from use cases or domain. (AX-SYS-2 · system)

**Vocabulary discipline** — before naming anything, query `semantic_query("term")` via the semantic-index MCP. Do not invent domain terms. (AX-ONT-4 · ontology)

**Test coverage** — if tests exist for the target, they must stay green. If none exist, write them first. (AX-SYS-2 · system)

**Verify blast radius** — after changes, run `gitnexus_detect_changes({scope: "staged"})`. Scope must match intent only. (AX-SYS-1 · system)

## Also read — based on what you're doing

| Situation | Skill |
|---|---|
| Creating or annotating functions | [domain-tagging-code.md](.claude/skills/custom/domain-tagging-code.md) |
| Deciding where a file or module belongs | [folder-structure.md](.claude/skills/custom/folder-structure.md) |
| Working with events | [event-system.md](.claude/skills/custom/event-system.md) |
| Building or modifying frontend | [frontend.md](.claude/skills/custom/frontend.md) |
| Writing or updating tests | [testing.md](.claude/skills/custom/testing.md) |

---