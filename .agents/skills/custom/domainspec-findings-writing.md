---
description: How to write a subagents-findings document — synthesis across all subagents-research files from one dispatch.
---

# Subagents Findings Writing

## Purpose

A `subagents-findings` document is the **synthesis of one full dispatch**: it reconciles the `subagents-research` files produced by every child agent and turns them into claims the rest of the vault can build on.

One dispatch → one findings file. If you are pulling from research across multiple dispatches, you are writing a discovery, not findings.

If you are simply rewriting a single child's output in nicer prose, you are writing nothing — go back and synthesize.

---

## Frontmatter

Check `.claude/skills/custom/frontmatter.md`. For this node_type:

- `node_type: subagents-findings`
- `is_session: false`
- Omit `veracidade` and `convicção` — findings track which claims are supported and which are contested; per-claim confidence lives inline in the body. Promotion to `discovery` (or escalation as `contradicts`) is what turns a finding into a versioned claim.

---

## Edges

Check `.claude/skills/custom/edges.md`. The expected edge pattern:

- `derives-from` → every `subagents-research` file this synthesis stands on. **Every** child research file must be listed; if you ignored a child, say why in "Children excluded".
- `derives-from` → the `domainspec-subagents-strategy.md` that authorized the dispatch.
- `contradicts` → any vault document the synthesis logically conflicts with (must be resolved before any downstream promotion).

Each research file declares the inverse `derives` toward this findings file in its own `## Connections` block.

---

## Mandatory Document Structure

Sections must appear in this order. Do not skip or reorder.

### Objective (≤3 sentences, required first)

What this dispatch was investigating and the form of the synthesis (e.g., "ranked options", "agreement matrix", "single recommendation"). No conclusions here.

**Quality gate:** if the form of the synthesis is unclear, the dispatch had no decision criteria — flag it and stop.

---

### 1. Dispatch Context

Three required subsections:

**Strategy reference** — link to the `domainspec-subagents-strategy.md` and date of dispatch.

**Children included** — bullet list, one line per child research file with a link and a one-sentence description of what that child investigated.

**Children excluded** — any child whose research was disregarded, with the reason. An empty subsection is allowed only if every child contributed.

---

### 2. Agreements

Claims that **multiple children's research independently supports**. Each agreement:

- A one-sentence claim.
- Citations to **at least two** child research files (`[research-A.md§Findings]`, `[research-B.md§Findings]`).
- Strength qualifier: `strong` (every child agrees), `majority` (most agree), `partial` (some agree, others silent).

A "claim" supported by only one child is not an agreement — put it in §3 or drop it.

---

### 3. Disagreements

Where children's research diverges. For each:

- The point of disagreement, in one sentence.
- The opposing positions, each with a citation to the child that took it.
- A recommendation: which side to follow, or whether to escalate as `contradicts` against an existing vault document, or whether the disagreement is unresolvable from this dispatch and needs another one.

A disagreement without a recommendation is a liability — the next reader will not know what to do.

---

### 4. Open Questions

What this dispatch could not resolve. Each item:

- The question.
- Why this dispatch couldn't answer it (missing inputs, out-of-scope children, etc.).
- A proposed next step (another dispatch, a manual investigation, a discovery).

---

### 5. Recommended Next Action

One paragraph. Either:

- "Promote agreements §X.Y as a discovery — knowledge scope: `vault/discovery/<topic>-definitions/<slug>.md`; application scope: `docs/features/<feature>/discovery/<slug>.md` (per R15 of domainspec-subagents-strategy-constitution)", or
- "Re-dispatch with strategy adjusted as follows: …", or
- "Hold — open questions block any decision until …"

If you cannot recommend an action, the synthesis is incomplete.

---

## Quality Checks Before Finishing

- [ ] Objective written before any other section
- [ ] Every child research file is either in "Children included" or "Children excluded" — nothing dropped silently
- [ ] Every Agreement cites ≥2 child research files
- [ ] Every Disagreement has a recommendation
- [ ] Every Open Question has a proposed next step
- [ ] Recommended Next Action is concrete, not "discuss further"
- [ ] No claim appears in this file that isn't traceable to either a child research file or an explicit synthesis the author owns

---

## Navigation

- Frontmatter cheatsheet: `.claude/skills/custom/frontmatter.md`
- Edge catalog: `.claude/skills/custom/edges.md`
- How to write the upstream child files: `.claude/skills/custom/domainspec-subagents-research-writing.md`
- Node-type semantics: `.claude/skills/custom/frontmatter-semantics.md`
