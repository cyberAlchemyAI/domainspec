---
description: Condensed rules for where discovery and research documents live — three trajectory states, promotion mechanics, no nesting
---

# Discovery Placement Skill

## Three Placement States (by trajectory)

| State | Definition | Home |
|---|---|---|
| **(1) Domain knowledge** | About a concept, schema, or pattern. May or may not ever become software. | `domain_knowledge/<area>/` for business concepts; `system_design_knowledge/discovery/<area>/` ONLY for cross-app architectural patterns reused by 2+ unrelated apps |
| **(2) Existing-app discovery** | An `apps/<x>/` already exists; this feeds a feature inside it. | `apps/<app>/features/<feature>/{discovery,research}/` |
| **(3) Pre-app discovery** | Will become an app; the `apps/<x>/` is not yet created. | `docs/proposals/<topic>/docs/{discovery,research}/` |

## How to Choose

Ask: *what is this artifact's destination?* — not *who reads it today?*

- Does `apps/<x>/` exist for this work today? → **(2)**
- Will it eventually be an app, but isn't yet? → **(3)**
- Is it knowledge that may never need software? → **(1)**

`discovery` and `research` are **epistemic types** distinguished by `node_type:` frontmatter, not by location. Both can coexist in any state.

## Hard Rules (do these or stop)

- State (3) artifacts in `docs/proposals/` MUST carry `graduation_status`, `graduation_target`, `graduation_trigger` frontmatter. No exceptions.
- Every `apps/<x>/ARCHITECTURE.md` MUST carry `## 1.0 Origin` (greenfield OR cite originating proposal).
- Subfolder names are always plural: `discovery/`, `research/`. Never singular.
- `discovery/` and `research/` NEVER nest into each other. Topic subfolders OK.
- `system_design_knowledge/discovery/` is reserved for patterns demonstrably reused by 2+ unrelated apps. NOT for feature-specific work even if it spans sub-features of one app.

## Migration (1:1 vs 1:N)

- **1:1** — proposal originates one app: discovery migrates as a block into `apps/<new-app>/features/<f>/discovery/`. Set `graduation_status: graduated`, fill `graduated_to`.
- **1:N** — proposal originates multiple apps: **decompose**. App-bound pieces → relevant `apps/<x>/features/<f>/`; business concepts → `domain_knowledge/<area>/`; cross-app patterns → `system_design_knowledge/discovery/<area>/`; future-app pieces stay in `docs/proposals/` until each graduates separately.

Each decomposed migration is a separate commit with its own graduation annotation.

## Escalation — When to Load the Constitution

- Placement ambiguous ("is this state 1 or 2?") → read §9 of `vault/constitution/discovery-structure-constitution.md`
- Migrating a state (3) artifact → load §11 (promotion mechanics) and §12 (1:1 vs 1:N)
- Proposing a new top-level home not in §14 → load §14 (Reserved Homes) and escalate as decision-gate
- Question of internal shape of a `vault/discovery/<slug>/` artifact (lenses, README sections, caps) → load §1–§8

## Agent Directives

- Before creating any `.md` with `node_type: discovery` or `node_type: research`, classify state (1/2/3) and confirm home matches §14.
- Before writing into `docs/proposals/`, verify `graduation_*` frontmatter is present.
- Never invent a new placement home; if no home fits, stop and escalate.
- Renames are spec changes first, code changes second (AX-DS-2).
