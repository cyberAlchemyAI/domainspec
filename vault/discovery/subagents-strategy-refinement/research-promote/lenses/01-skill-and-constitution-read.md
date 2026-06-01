---
lens: skill-and-constitution-read
date: 2026-05-26
dispatched_by: writer agent (round 1)
addresses: Mechanism, anti-patterns, and constitutional grounding of /research-promote — what the SKILL.md actually says, where the constitution backs it, and where the spec is underspecified.
sources:
  - /Users/victorboscaro/domainspec-theorem/.claude/skills/research-promote/SKILL.md
  - /Users/victorboscaro/domainspec-theorem/.claude/skills/research/SKILL.md
  - /Users/victorboscaro/domainspec-theorem/.claude/skills/research-validate/SKILL.md
  - /Users/victorboscaro/domainspec-theorem/.claude/skills/research-review/SKILL.md
  - /Users/victorboscaro/domainspec/vault/constitution/research-constitution.md
  - /Users/victorboscaro/domainspec-theorem/research-bridges/SCHEMA.md
  - /Users/victorboscaro/domainspec/vault/discovery/subagents-strategy-refinement/principle.md
  - /Users/victorboscaro/domainspec/vault/discovery/subagents-strategy-refinement/role-taxonomy.md
  - /Users/victorboscaro/domainspec/vault/discovery/subagents-strategy-refinement/relation-to-base.md
  - /Users/victorboscaro/domainspec/vault/discovery/subagents-strategy-refinement/decisions-log.md
  - /Users/victorboscaro/domainspec/vault/constitution/discovery-structure-constitution.md
  - /Users/victorboscaro/domainspec/vault/discovery/should-close-session-design/discovery.md
verification: [local-files-read]
---

# Lens 01 — Skill and Constitution Read

## What this lens did

Single pass over the `/research-promote` skill file, its two sibling sub-skills (`/research-validate`, `/research-review`), the parent `/research` skill, the research-constitution sections R15–R17 (three-layer polish) and R5–R6 / R26 (user-gate and validator), the umbrella discovery for `subagents-strategy-refinement`, and the corpus SCHEMA at `research-bridges/SCHEMA.md`. No external web fetches, no model-recall reasoning beyond what the files contain. The lens establishes the evidence base for the sibling `discovery.md`.

## What the SKILL.md actually says

The promote skill is 39 lines total. Its load-bearing structure:

1. **Input** (line 11): path to a completed `research/<corpus>/<topic-slug>/` that has already passed `/research-review`.
2. **Output** (line 14): a single file under `research-{corpus}/<...>/<slug>.md` with frontmatter, a `## Referências` section, and a `## Dispatch trail` footnote.
3. **Six steps** (lines 17–27): Classify, Compute path, Compose, User gate, Write, optional Memory write. The user gate (step 4) is the load-bearing step — it sits between composition and the only filesystem write.
4. **Five anti-patterns** (lines 29–36): non-SCHEMA frontmatter, `closed-borrowing` missing `external_program`/canonical reference, `closed-contribution` missing named external problem, `closed-proof` missing Lean file pointer, conjecture missing non-vacuity witness.
5. **References** (lines 37–39): the corpus SCHEMA at `research-{corpus}/SCHEMA.md` and constitution R15–R17.

The path-computation table (lines 19–23) enumerates four node_types: `audit`, `bridge`, `conjecture`, `track-entry`. The classify step (line 18) lists *five* node_types: `audit / bridge / conjecture / track-readme / track-entry`. **`track-readme` has no path in the table.** This is the most concrete spec gap surfaced by the read; flagged as OQ-1 in the sibling discovery.

## How the constitution backs the skill

R15–R17 of [`research-constitution.md`](../../../../constitution/research-constitution.md) define the three-layer polish: Layer 1 (per-agent files under `research/<corpus>/<topic-slug>/agents/`, gitignored), Layer 2 (LEDGER under `research/<corpus>/<topic-slug>/LEDGER.md`, gitignored), Layer 3 (`research-*/<...>.md`, committed). The promote skill is the operationalization of the Layer 2 → Layer 3 transition. Specifically:

- **R17's load-bearing claim** — "citations resolve to Layer 2 (LEDGER) and through it to Layer 1 (per-agent files)" — is enforced mechanically by the `## Dispatch trail` footnote that step 3 of the skill composes. Without that footnote a Layer 3 artifact severs from its provenance.
- **R5–R6 user-gate discipline** (inherited from the base `domainspec-subagents-strategy-constitution`) is enforced by step 4. The base engine has two human checkpoints — pre-dispatch confirm and pre-promotion confirm; promote owns the second.
- **R26 validator boundary** — the validator does not check corpus SCHEMA because no corpus artifact exists at validation time. The closure-mark anti-patterns at promote are the corpus-side counterpart to the validator's spec-side checks.

## Where the parent `/research` SKILL.md positions promote

Step 10 of the 10-step lifecycle (`/research/SKILL.md:28`): `Promote → invoke skill research-promote (user-gated)`. It is the last step, after step 9's loop-or-exit. The lifecycle is strictly sequential — promote cannot fire before review accepts, and there is no DAG branching at this layer (composition is linear per refinement 2 in [`principle.md`](../../principle.md)).

## Sibling sub-skills carve a clean three-way split

| Skill | Reads | Writes | Mutates corpus? |
|---|---|---|---|
| `research-validate` | spec YAML (in-chat or path) | nothing (chat-only verdict) | no |
| `research-review` | `research/<corpus>/<topic-slug>/agents/*.md`, `LEDGER.md`, `dispatch.yaml` | nothing (chat-only verdict) | no |
| `research-promote` | `research/<corpus>/<topic-slug>/dispatch.yaml` + LEDGER + writer artifact | one file under `research-{corpus}/` | yes — exclusively |

The pattern: validate and review are pure functions over their inputs; promote is the only side-effectful sub-skill. This is what concentrates the user-gate discipline at one place — the only step that needs human confirmation is the one that changes repo state.

## Drift between SKILL.md and the constitution / SCHEMA

Three drifts observed:

1. **Frontmatter field list (SKILL.md line 24)** enumerates `profile, node_type, layer, status, version, last_updated, closure_mark, veracidade, convicção`. The corpus SCHEMA at [`research-bridges/SCHEMA.md`](../../../../../domainspec-theorem/research-bridges/SCHEMA.md) §"Frontmatter obrigatório" requires `name`, `description`, `type`, `external_program`, `status`, `last_updated` plus `closure_mark` and `closure_ref` when closed. The lists overlap on `status` and `last_updated` and otherwise diverge. SKILL.md is enumerating a generic ontology shape; SCHEMA.md is enumerating corpus-specific requirements. Either SKILL.md is wrong or it is parameter-list-shaped over multiple corpora and not committed to a single SCHEMA — either way, the source of truth for any given promotion is the corpus SCHEMA, not SKILL.md.

2. **`track-readme` vs `track-entry`** as noted above — the node_type appears in classify but not in path computation.

3. **`closure_mark` enumeration coverage** — the five anti-patterns cover `closed-borrowing`, `closed-contribution`, `closed-proof`, plus "conjecture without non-vacuity witness" (which is closure-mark-agnostic). The other corpus closure marks (`closed-paper`, `closed-analogy`, `closed-negative`, `promoted`, `open`, `needs-review` per `research-bridges/SCHEMA.md`) have no anti-pattern guard at promote. Whether that is intentional (these closure marks have lower integrity stakes) or oversight (each value has its own bar that could be mechanically checked) is unspecified.

## What is underspecified

Beyond the three drifts, the lens flags three underspecified elements:

- **Memory-write threshold** (step 6). "Skip if redundant" is the only guidance; no operational criterion for "surprising decision worth recalling."
- **Slug derivation.** The path table uses `<slug>` as a parameter but no field in the spec or `research/<corpus>/<topic-slug>/` is named as the source. Likely derived from the dispatch's `goal` or LEDGER finding title, but unstated.
- **Revise-path branch at step 4.** The user gate offers "revise path" but the skill does not say whether revision reruns the deterministic-path computation with different inputs (e.g. different node_type) or accepts an arbitrary user-provided path. The discovery's mermaid diagram assumes the former.

## Verification mode

`local-files-read` only. All claims in the sibling discovery are traceable to lines or sections of the files enumerated in `sources` above. No web fetches were performed; no claim about external literature or external user behavior is made.
