---
description: The canonical folder layout for a `vault/discovery/<topic>/` folder under the lens → research → discovery convention. Covers greenfield (causal order) and backfill (post-hoc) shapes, with the frontmatter and edge rules that make each shape honest.
---

# Lens-Research-Discovery Layout

## Purpose

A discovery folder is the load-bearing unit of vault investigation. The convention specifies:
- which artifacts a discovery folder contains
- how each artifact's frontmatter is shaped
- which edges wire them together
- how to handle **backfill** honestly when artifacts predate the convention

Not every commitment needs a discovery. A small, reversible, uncontested change lands as a premise edit, a backlog item, an amendment, or a session note. **A discovery is reserved for commitments that earn the full lens → research → discovery chain.**

---

## The chain

```
objective → lenses → research → discovery → {plan, spec, axiom, premise, amendment, backlog, test, child discovery, skill, schema change}
```

- **Lenses** — deliberately framed per-perspective investigations. One lens = one angle (prior-art, adversarial, gap, cost, etc.).
- **Research** — the cross-lens synthesis: where lens findings get reconciled, contradictions surfaced, claims graded. Plus a ≤500-word executive summary for downstream readers.
- **Discovery** — the commitments. What is being changed, what stays, the decisions taken (each with citations), open questions with recommendations.

---

## Greenfield layout (causal order, lenses → research → discovery)

```
vault/discovery/<topic>/
  README.md                          # navigation, optional
  discovery.md                       # commitments
  lenses/
    01-<slug>/
      dispatch.md                    # re-runnable snapshot: prompt verbatim, model, tools, context paths
      findings.md                    # curated lens conclusions
      raw-response.md                # optional: verbatim agent return
    02-<slug>/
      dispatch.md
      findings.md
    ...
  research/
    research.md                      # cross-lens analysis (load-bearing)
    research-synthesis.md            # ≤500-word executive summary (hard cap)
```

Optional sibling folders that are NOT part of the chain:
- `proposal/` — downstream artifacts the discovery generates (e.g., `proposal/SKILL.md`). Not lens/research/discovery; linked from `discovery.md` via `operationalized-by` (for skill targets) or appropriate target-keyed forward-only edge.

---

## Backfill layout (research written post-hoc)

When lenses or the discovery already exist, the research layer is **retrofitted onto** them rather than feeding into them. The layout is identical to greenfield except:

- `dispatch.md` is **omitted** when the literal prompt is unrecoverable. A folder with only `findings.md` is a valid historical artifact.
- `research.md` carries `backfilled: true` and `analysis-method: <method>` in frontmatter, plus a prominent backfill note at the top of the body.
- An additional `retrofits` edge is declared from `research.md` to each `findings.md` it consolidates. The canonical `synthesized-by`/`synthesizes` pair is also declared (forward-in-time on the findings side); `retrofits` is the honesty marker that the research was written after the lenses, not the original synthesis.

---

## Frontmatter rules

See `.claude/skills/custom/frontmatter.md` for the schema. Convention-specific points:

### `findings.md`

```yaml
node_type: findings
status: consolidated                              # frozen on write; supersede by new lens
dispatch_status: live | historical | backfilled-no-prompt-recoverable
lens_order: first | second                        # optional; default first
```

Body sections: **Objective** (one sentence) → **Findings** (free-form body) → **Caveats** (what this lens did NOT establish; "None" if empty — do not omit) → **Connections**.

### `research.md`

```yaml
node_type: research
status: consolidated
backfilled: true | false
analysis-method: live-during-dispatch | post-hoc-independent-read | meta-lens-consolidation
```

Body sections: **Objective** → **Lens Inventory** (table: #, lens, framing, headline finding, confidence) → **Cross-Lens Analysis** (themes; load-bearing) → **Unique Contributions** → **Open Questions Forwarded to Discovery** → **Provenance** → **Connections**.

When `backfilled: true`, prepend a **Backfill note** blockquote at the top of the body stating when it was written, what order things actually happened in, and whether the analysis consulted the existing discovery (`post-hoc-independent-read`) or reformatted existing meta-lenses (`meta-lens-consolidation`).

### `research-synthesis.md`

```yaml
node_type: research-synthesis
status: consolidated
```

**Hard cap: ≤500 words below the budget line.** Body sections: **Objective** (1 sentence) → **Context** (2–3 sentences) → **What Was Found** (3–5 bullets, each cites `research.md#section`) → **Decisions Taken** (3–5 bullets, each cites `../discovery.md#d-N`) → **Implications** (2–4 bullets) → **Open Questions** (2–4 bullets, recommendations included) → **Read More** → **Connections**.

The synthesis adds **no new analysis**; it cites `research.md` for every claim.

### `dispatch.md` (greenfield only; optional)

```yaml
node_type: agent-dispatch
status: consolidated                              # frozen on write
```

Body sections: **Dispatch identity** (lens slot, parent discovery, sibling lenses) → **Framing** (the deliberate angle this lens takes) → **Dispatch payload** (model, tools allowed, context paths read, **prompt verbatim**) → **Outputs** (findings file, raw-response file if present, cost) → **Notes**.

The prompt is **verbatim**. Paraphrase destroys reproducibility.

### `discovery.md`

Existing schema (`node_type: discovery`). When the discovery was written before the research layer existed, bump version (e.g., 0.1.0 → 0.2.0), update `last_updated`, and add a post-hoc-alignment paragraph at the top of the body. The discovery's content is not edited; only its provenance chain is structurally aligned.

---

## Edge wiring

See `.claude/skills/custom/edges.md` and `vault/ontology-conventions.md` Appendix C. The convention adds three edge pairs.

### Between findings and research

- `findings.md` → `synthesized-by` → `research.md` (forward-in-time)
- `research.md` → `synthesizes` → `findings.md` (inverse, declared on research side)

Both are declared in greenfield AND backfill cases. The forward-in-time direction holds either way — research did synthesize the findings, even post-hoc.

### Backfill marker

- `research.md` → `retrofits` → `findings.md` (forward-only by source; no inverse on findings)

Declared **only** when `backfilled: true`. Honest provenance direction: the research came after the findings.

### Between corroborating lenses

- `findings.md` (re-run) → `corroborates` → `findings.md` (original) — both within same discovery folder
- `findings.md` (original) → `corroborated-by` → `findings.md` (re-run) (inverse)

Use when a lens is re-run with sharper verification (e.g., `[model-recall]` lens corroborated by `[web-fetched]` re-dispatch). Distinct from `supersedes` (which would retire the original).

### Discovery's edges

- `discovery.md` → `derives-from` → `research/research.md` (canonical)
- `discovery.md` → `derives-from` → each `lenses/<slug>/findings.md` (also valid — discovery may cite lenses directly, especially when the cross-lens analysis itself is one of the load-bearing inputs)

---

## Quality gates

Before declaring a discovery folder complete:

- [ ] `discovery.md` Objective ≤3 sentences, no implementation steps disguised as design decisions
- [ ] Every "What's broken" item in the discovery has a specific file location
- [ ] "What stays the same" is non-empty (unbounded scope = future rework)
- [ ] Every lens has a `findings.md` with non-empty Caveats (or explicit "None")
- [ ] `research.md` has at least one Cross-Lens Analysis theme citing ≥2 lenses
- [ ] `research-synthesis.md` body is ≤500 words measured below the budget line
- [ ] Bidirectional edges declared between every findings ↔ research pair
- [ ] If `backfilled: true`, the backfill note is in the body AND `retrofits` edges are declared
- [ ] Open questions in `discovery.md` include recommendations, not just questions

---

## Common shapes that are NOT a discovery

If the commitment is one of these, do not force the lens-research-discovery layout:

- **Premise update** — direct edit to a `vault/premise/*.md` file with a version bump
- **Backlog item** — `node_type: backlog` entry in `vault/backlog/`
- **Constitution amendment** — change recorded in `vault/amendments/`
- **Session note** — a one-line decision recorded inside a session record
- **Definition** — new term in `vault/conceptual/` or a feature glossary

The count of folders in `vault/discovery/` should be a signal of how many **load-bearing** decisions the project has taken. Trivial commitments living there inflate the count and erode the signal.

---

## Navigation

- Frontmatter schema: `.claude/skills/custom/frontmatter.md`
- Edge picker: `.claude/skills/custom/edges.md`
- Canonical edge catalog: `vault/ontology-conventions.md` Appendix C
- Discovery body structure: `.claude/skills/custom/discovery-writing.md`
- Research synthesis body structure (this skill, §"Frontmatter rules")