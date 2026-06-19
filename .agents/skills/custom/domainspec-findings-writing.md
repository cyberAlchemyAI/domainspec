---
description: How to write a subagents-findings document — synthesis across all subagents-research files from one dispatch.
---

# Subagents Findings Writing

## Purpose

A `subagents-findings` document is the **synthesis of one full dispatch**: it reconciles the `subagents-research` files produced by every child agent and turns them into claims the rest of the vault can build on.

One dispatch → one findings file. If you are pulling from research across multiple dispatches, you are writing a discovery, not findings.

If you are simply rewriting a single child's output in nicer prose, you are writing nothing — go back and synthesize.

There is **no template** to fill. Read the research and write the synthesis in whatever form serves it best.

---

## Frontmatter

Check `.claude/skills/custom/frontmatter.md`. For this node_type:

- `node_type: subagents-findings`
- `is_session: false`
- Omit `veracidade` and `convicção` — findings track which claims are supported and which are contested; per-claim confidence lives inline in the body. Promotion to `discovery` (or escalation as `contradicts`) is what turns a finding into a versioned claim.

---

## Edges

Check `.claude/skills/custom/edges.md`. The expected edge pattern:

- `derives-from` → every `subagents-research` file this synthesis stands on. **Every** child research file must be accounted for; if you ignored a child, say why.
- `derives-from` → the `domainspec-subagents-strategy.md` that authorized the dispatch.
- `contradicts` → any vault document the synthesis logically conflicts with (must be resolved before any downstream promotion).

Each research file declares the inverse `derives` toward this findings file in its own `## Connections` block.

---

## Document Structure

The only fixed structure is the opening, in this order:

1. **Goal** — what the dispatch set out to achieve. One to two sentences.
2. **TL;DR** — the synthesis answer in a few sentences: what the research adds up to. No build-up — the conclusion first.
3. **Context** — where the need for the dispatch arose and what made a single inline investigation insufficient.

**Everything after the preamble is the writer's call.** Choose the sections that best convey *this* synthesis and drop what the material doesn't need. Useful candidates — not a required set:

- **Agreements** — claims that multiple children's research independently supports (cite ≥2 children; qualify as `strong` / `majority` / `partial`).
- **Disagreements** — where children diverge: the opposing positions with citations, and a recommendation (which side, escalate as `contradicts`, or re-dispatch).
- **Open questions** — what this dispatch could not resolve, why, and a proposed next step.
- **Recommended next action** — promote as a discovery (knowledge scope: `vault/discovery/<topic>-definitions/<slug>.md`; application scope: `docs/features/<feature>/discovery/<slug>.md`), re-dispatch with adjusted strategy, or hold.

You may propose a structure you think fits the dispatch better.

---

## Quality Checks Before Finishing

- [ ] Goal, TL;DR, and Context open the document, in that order
- [ ] Every child research file is accounted for — nothing dropped silently
- [ ] Claims are grounded in the research, not introduced from nowhere
- [ ] Where children disagree, the synthesis says what to do about it
- [ ] The document synthesizes — it does not just paraphrase one child

---

## Navigation

- Frontmatter cheatsheet: `.claude/skills/custom/frontmatter.md`
- Edge catalog: `.claude/skills/custom/edges.md`
- How to write the upstream child files: `.claude/skills/custom/domainspec-subagents-research-writing.md`
- Node-type semantics: `.claude/skills/custom/frontmatter-semantics.md`
