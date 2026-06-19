---
tags: [plan, subagents, dispatch-artifact, residue, open-questions]
node_type: plan
is_session: false
layer: architecture
nature: plan
status: draft
version: 0.1.0
last_updated: 2026-06-18
---

# Plan — Residue-restructure of the dispatch-pipeline documents

> Goal: better organize how each pipeline document is authored. Add an **Open Questions
> (residue ledger)** section to every document *except research*; give **findings** an
> Objetivo (= the existing Goal) followed by a **TL;DR**; reduce **research** to pure
> per-agent appends. No new template files under `/.claude`.
>
> Source: in-chat dispatch `2026-06-18-residue-restructure-edit-map` (3 read-only recon
> agents — findings/research cluster, discovery cluster, views cluster).

---

## LOCKED DECISIONS (2026-06-18)

- **NO templates.** Delete `templates/domainspec-research.md` and
  `templates/domainspec-findings.md`. Structure moves **inline into the writer agents** —
  the same shape the `domainspec-discovery-writer` agent already uses (no template).
- **Only the `.claude` tree** is edited. `.agents` / `.codex` / `.github` mirrors are left to
  drift (accepted); the tri-divergent `SKILL.md` cleanup is out of scope.
- **Research = Reading A:** pure per-agent appends, no Context+Goal preamble (amend R23).
- The stale guidance docs `domainspec-research-writing.md` + `domainspec-findings-writing.md`
  (`.claude/skills/custom/`) describe an old schema and are NOT what produces the files →
  propose **delete** (pending user veto).

---

## 0. Headline results from the recon

| Cluster | Verdict | Effort |
|---|---|---|
| **Views** (system / engineer / ontology) | **NO-OP** — all three already carry a top-level `## Open questions` produced in Step 7, identical OQ row shape. The user's hunch was right. | ~0 (optional publish-gate tweak only) |
| **Discovery** | Real fix — OQ is top-level in the writer agent but a *buried optional subsection* in `discovery-writing.md`. Promote to consistent top-level + recommendation rule. 5 files. | Small |
| **Findings** | Add Objetivo→TL;DR + Open Questions; sharpen TL;DR vs the existing cited Findings section. Touches template + writer agent + `.codex` TOML mirror + constitution R16. | Medium |
| **Research** | Reduce to pure appends. **Binary decision** below (Reading A vs B). | Small–Medium |

**Cross-cutting liveness note:** the live authoring path is **template (`/templates`) → writer
agent (`.claude/agents/`, registered) → constitution R16/R23**. The three divergent
`domainspec-subagents-strategy/SKILL.md` copies (`.claude` v0.6.1 router · `.agents` v0.3.0 ·
`.github` v0.2.0) are a *separate* mirror-drift liability, not a blocker for this change.

---

## 1. Decisions — resolved

- D1 Research scope → **Reading A** (pure appends, amend R23).
- D2 Templates → **delete both**; structure inline in the writer agents.
- D3 Mirrors → **only `.claude`**; rest drift; SKILL.md tri-divergence out of scope.
- D4 Stale guidance skills → **propose delete** (pending veto).
- D5 Amendment path → additive for findings TL;DR/OQ; R23 narrowing (research) is normative.
- D6 Views publish gates → optional, deferred.

---

## 2. The shared Open-Questions shape (use everywhere it's added)

```
- **OQ-N** — <question>. Recommendation: <rec>. Owner: <named owner>.
- **OQ-N (BLOCKER)** — <blocker question>. Recommendation: <rec>. Owner: <named owner>.
```

Rules (inherited from the views' Step 7 + `discovery-writing.md`): recommendation + **named
owner** mandatory; blockers flagged inline; **non-contiguous numbering OK — never renumber**.
Semantics differ by layer (state it, don't copy blindly):
- **findings OQ** = *investigation* residue (coverage gaps / unresolved sub-questions).
- **discovery OQ** = *design* residue (unresolved design decisions) → seeds engineer-view
  **OPEN / CRITICAL** rows.
- **views OQ** = already present (blocker OQs for unrowed stances, etc.).
- **research** = **no OQ** (writer forbidden to synthesize; residue lives inside each child's
  verbatim block).

---

## 3. Work breakdown by file

### 3.1 Findings (no template — structure inline in the agent)
1. **Delete** `templates/domainspec-findings.md`.
2. `.claude/agents/domainspec-findings-writer.agent.md` — rewrite to carry the structure
   **inline** (mirroring how `discovery-writer` already embeds its structure):
   - Remove the template reference (l.24 + execution step 1 "Read the template…").
   - Embed the section spec and **final order:** Goal (= Objetivo) → **TL;DR** →
     Dispatch record → Findings → Analysis → **Open Questions**.
   - TL;DR = 3–5 executive bullets, **no citations**; Findings = **cited, itemized** F-items
     (the load-bearing contrast). Open Questions = investigation residue (shape in §2).
   - Update the hardcoded order line (l.44) + self-check (l.45: TL;DR uncited, OQ present).
3. Constitution **R16** (l.234–242): rewrite the ordered list to admit TL;DR + Open Questions
   (R16's list starts at TL;DR; R23 owns the Goal preamble — no Goal/Objetivo double-owner).

### 3.2 Research (no template — Reading A, structure inline in the agent)
1. **Delete** `templates/domainspec-research.md`.
2. `.claude/agents/domainspec-research-writer.agent.md` — rewrite to carry the minimal
   structure **inline**:
   - Remove the template reference (l.24 + step 1).
   - Drop Context + Goal entirely (role l.13, inputs l.20–21, write steps l.34–35).
   - Keep the load-bearing rule: frontmatter + one verbatim `## Agent N` per child + the
     **stable-anchor** convention (findings cites `research §Agent N` per R17 — this must
     survive somewhere; it now lives here).
3. Constitution **R23** (l.269–273) → narrow to **findings-only** preamble.
4. Research gets **no** Open Questions (guaranteed by "no synthesis").

### 3.x Stale guidance skills (propose delete — pending veto)
- `.claude/skills/custom/domainspec-research-writing.md` and
  `.claude/skills/custom/domainspec-findings-writing.md` describe an old, divergent schema
  and are not what produces the files. Delete both, OR (if kept) they must be rewritten to
  match the inline agent spec — otherwise they re-seed the drift.

### 3.3 Discovery (all required)
1. `.claude/skills/custom/discovery-writing.md` —
   - Delete the buried OQ bullet (l.71) under "3–N. Detailed Specifications".
   - Insert a new ordered top-level `### N+1. Open Questions (required, top-level)` —
     one entry per unresolved **design decision**, each with a recommendation; note it
     seeds engineer-view OPEN/CRITICAL rows.
   - Update "Quality Checks" (replace l.80) with two checks: top-level placement + numbered;
     recommendation per unresolved decision.
2. `.agents/skills/custom/discovery-writing.md` — same 3 edits; **re-sync first** (this
   mirror is stale: missing the line-12 redirect + the "Downstream — structural views"
   section, which the new OQ cross-reference points to).
3. `.claude/agents/domainspec-discovery-writer.agent.md` (l.58) — tighten OQ wording to
   "unresolved design decisions + recommendation; seed engineer-view OPEN/CRITICAL".
4. `.codex/agents/domainspec-discovery-writer.agent.toml` (l.53) — lockstep with #3.
5. `.claude/skills/custom/knowledge-discovery-writing.md` — already compliant (OQ top-level
   l.39 + check l.50); optional one-line residue-handoff note.

### 3.4 Views — NO-OP
- system-view (`system-view-template.md:256`, `SKILL.md:51`), engineer-view
  (`engineer-view-template.md:161`, `SKILL.md:53`), ontology-view
  (`ontology-view-template.md:323`, `SKILL.md:50`) all already carry it.
- Keep engineer-view's **dual** design (OPEN/CRITICAL inventory + a stakeholder-facing OQ
  projection) — intentional, do not collapse.
- Optional (**D5**): add OQ-presence to the three Step-8 publish gates.

---

## 4. Risks / ripples (carry into execution)

1. **Hardcoded order lines** in the findings-writer agent (`.claude` l.44 + `.codex` l.39)
   enforce the old order — if R16 changes but these don't, the agent silently strips/misplaces
   the new sections. Highest-risk omission.
2. **Goal / Objetivo / Objective collision** — template uses `## Goal`; the findings-writing
   skill uses `### Objective` for a different meaning. Don't create a duplicate.
3. **TL;DR vs Findings overlap** — must sharpen Findings → "cited F-items" or reviewers see
   two summaries and the writer merges them.
4. **Mirror drift** — `.agents/discovery-writing.md` is already stale; `.codex` TOML agents
   exist and drift; the three SKILL.md copies describe three lifecycles. Per D3.
5. **R17 unaffected** — it scopes citations to Findings + Analysis only, correctly leaving
   TL;DR/OQ uncited. No change needed.
6. **Grandfathered instances** under `vault/discovery/**`, `docs/**`, `.planning/**` are not
   edited; note in the amendment log so Reading A doesn't flag old research files as malformed.

---

## 5. Connections

| Document | Type | Description |
|---|---|---|
| `telemetry/agents/subagents-dispatch.yaml` | `derives-from` | Dispatch `2026-06-18-residue-restructure-edit-map` (3 recon agents) produced this plan. |
| `vault/constitution/domainspec-subagents-strategy-constitution.md` | `cites` | R16/R23 are the load-bearing rules this plan amends. |
