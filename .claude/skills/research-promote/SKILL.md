---
name: research-promote
description: User-gated authorization to publish the dispatch's discovery.md as a vault discovery artifact. corpus + slug are locked at dispatch time, so there is no path computation — promotion flips discovery.md from draft to published and binds vault-conformant frontmatter. Invoked by /research at step 10 or standalone over an existing <corpus>/<topic-slug>/ folder.
---

# /research-promote

Publication gate for `<corpus>/<topic-slug>/discovery.md`. User-gated. The only step that authorizes the dispatch's public-facing artifact.

## Input
Path to a `<corpus>/<topic-slug>/` folder that has passed `/research-review`. Folder state:

- `agents/<NN>-<role>-<index>.md` — per-agent decision records (exist).
- `dispatch.yaml` — the spec (exists).
- `research/findings.md` — writer artifact (typically exists).
- `LEDGER.md` — dispatch trail (typically exists).
- `discovery.md` — either absent OR present with `status: draft`.

## Output
`<corpus>/<topic-slug>/discovery.md` exists with vault-conformant frontmatter (`node_type: discovery`), `status` flipped to one of `exploratory | active` (per the writer's `closure_mark`), body composed from the writer artifact, and a `## Dispatch trail` footnote linking to `LEDGER.md` / `agents/`.

## Semantics

The corpus folder IS the dispatch home from the start; `corpus` and `<topic-slug>` were locked at dispatch step 1. Promotion is a **status flip + frontmatter binding**, not a copy.

- **discovery.md absent.** Compose it from `research/findings.md` + `LEDGER.md`, with vault frontmatter, then write at folder root with `status: exploratory` (or stronger per closure_mark).
- **discovery.md present as draft.** Read it; verify frontmatter; flip `status: draft` → `exploratory`; ensure `## Dispatch trail` footnote is present.

## Steps

1. **Read state** — `dispatch.yaml` for `corpus`, `node_type`, `closure_mark`; `research/findings.md` for body; `LEDGER.md` for the dispatch trail.
2. **Compose / verify frontmatter** — per `domainspec/vault/ontology-conventions.md` (node_type, layer, nature, status, version, last_updated, veracidade, convicção, tags, plus `closure_mark`).
3. **Compose / verify body** — writer artifact + `## Referências` (only references upstream agents brought) + `## Dispatch trail` footnote (links to `LEDGER.md` and `agents/`).
4. **Anti-pattern check** — block on the items below.
5. **User gate** — show path + final frontmatter + first 30 lines of body. Confirm / revise / abandon.
6. **Write or flip** — write `discovery.md` if absent; otherwise update status + frontmatter in place. Only after confirm.
7. **Memory write** (optional) — propose 0–1 MEMORY.md entry if a surprising decision is worth recalling. Skip if redundant.

## Anti-patterns blocked

- Frontmatter not vault-conformant
- `closed-borrowing` without naming the external tool/standard + canonical reference + project file where it's load-bearing
- `closed-contribution` without naming a specific external problem
- A claim in `discovery.md` absent from upstream per-agent files
- Surviving residue silently demoted to `closed-*`

## See
- Vault conventions: `domainspec/vault/ontology-conventions.md`
