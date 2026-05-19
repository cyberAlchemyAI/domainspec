---
tags: [skill-design, close-session, provenance, signpost, compression-pipeline]
node_type: discovery
is_session: false
layer: ontology
nature: explanatory
status: exploratory
veracidade: medium
convicção: high
version: 0.2.0
last_updated: 2026-05-17
---

# Close-Session Redesign

> **Post-hoc note (v0.2.0, 2026-05-17).** This discovery was originally written from the 4 propose-wave lenses + 3 evaluate-wave meta-lenses directly, without an intermediate research-layer document. v0.2.0 migrates the folder into the new lens → research → discovery convention. The 4 regular lenses moved to `lenses/<slug>/findings.md` (compressed to ≤500-word findings shape with `dispatch_status: historical`, `retrofits: true`, `synthesized-by` → research). The 3 meta-lenses were **structurally consolidated** into `research/research.md` rather than re-derived from scratch — the meta-lenses ARE the cross-lens analysis, so `analysis-method: meta-lens-consolidation` is recorded honestly on the research file, and the meta-lens documents themselves were preserved at `lenses/META-<slug>/findings.md` with `lens_order: second` so the original work isn't lost. `research/research-synthesis.md` is the new ≤500-word short-form summary. The discovery's substantive content is unchanged; only the upstream provenance chain has been retrofitted.

## Objective

Redesign the `close-session` skill as a **5-field, append-only, body-≤15-lines signpost protocol** with a structurally enforced two-layer split (Record → Reckon). The skill ships the discipline required by the vault's compression pipeline — one durable, low-cost provenance signpost per session, auditable both directions — and explicitly defers the supporting tooling (validators, walkers, kernel/adapter sharing across repos) with named placeholders rather than building it speculatively.

---

## 1. Business Context

### Why now

The pre-redesign `close-session` baseline (in `football-stats-oracle/.claude/skills/close-session/SKILL.md`) carries a 25-line body cap and a folder-only `artifacts` rule, but its frontmatter has no cap and no closed-vocabulary discipline. Without further constraints, agents will drift the session note into a parallel uncompressed knowledge channel — narrative accumulating where only pointers belong — which directly violates the vault's load-bearing premise: *the vault represents knowledge in its most compressed form (axioms, fundamentals) and lets new knowledge emerge from that compression*. A session stream that swells into a journal silently destroys that compression. The redesign exists to make swelling structurally harder than routing-out.

### What's broken

- **Frontmatter has no cap.** Baseline `close-session/SKILL.md` enforces a body cap but lets the YAML block grow without bound — the most likely contamination vector (see Lens 01 §Evidence).
- **No closed-vocabulary discipline for judgment fields.** `premises_tested`, `experiments_run`, and similar fields admit free-text values, which Lens 03 §1 ("Narrative smuggled into Layer 1 via field semantics") identifies as judgment laundering: a Layer-2 thesis disguised as a Layer-1 record entry.
- **Record→Reckon ordering is advisory, not structural.** Baseline relies on in-prompt instruction ordering; Lens 01 §4 shows this is unenforceable for a model that can re-read its own output.
- **Promotion and retirement semantics are implicit.** Baseline forbids promotion in prose; nothing specifies the *flag-only* mechanism (`promotion_candidate: true`, `retired: true` on the premise file) that Lenses 01, 02, and 04 converge on (Meta-A convergence #3).
- **No defer-close exit.** Tangled multi-domain sessions either produce a confidently-wrong signpost or get force-fit into the schema (Meta-B gap #3).
- **No cold-start mode.** Day-1 vaults have no premises to refute and no axioms to promote toward; Gates B/F and the corroboration check are degenerate (Meta-B gap #6).
- **Terms "compression," "emergence," "signpost" are operationally un-falsifiable.** Lens 03 §7 names the rhetorical-but-vacuous problem; only Lens 04's Emergence Ratio gives a measurable proxy, and the walker for it does not exist.

### What stays the same

- The **filename pattern** `YYYY-MM-DD-HHMM-<slug>.md` and the **session-notes folder** (`domain_knowledge/sessions/` in `football-stats-oracle`; sister repos use their own equivalent — porting is deferred).
- The **folder-only `artifacts` rule** (no individual files).
- The **append-only / one-file-per-session invariant**: sessions are immutable; corrections happen in a new session.
- The **scratchpad-consumption contract** (`.claude/current_conversations/*.md` deleted after the note is written).
- **No edits to `constitution/` or `axiom/` files** from this skill — ever.
- The skill remains **scoped to `football-stats-oracle` for first deployment**; porting to sister `close-session` skills in `domainspec` and `house_project` is deferred until at least one quarter of proven use.
- **No edges on `.claude/skills/**` or backlog files** (project constraint; not relaxed here).

---

## 2. Core Concepts

### Two-layer split — Record (mechanical) → Reckon (pointers)

Record (Layer 1) captures the on-disk delta in **closed vocabulary** — paths, enum tokens, counts — and is **flushed to disk before any Reckon token is generated**. Reckon (Layer 2) emits **one pointer-line per non-empty Layer-1 entry**, hard-capped at 15 lines. Layer 1 fails by *incompleteness*; Layer 2 fails by *prematurity / narration*. The split converts a discipline problem ("don't let prose contaminate the record") into a structural property of the on-disk file.

**Why chosen over alternatives.** Lens 01 proposed a literal sentinel comment (`<!-- record-layer-frozen -->`) to mark the freeze; Lens 03 argued only a strict JSON+schema validator would hold. The proposal adopts neither — write order to disk plus the closed-vocabulary field grammar is enough discipline for solo-dev scale, and named-placeholder deferral for validator/sentinel keeps the skill shippable today. See OQ-1 on whether the sentinel should be revisited.

### Five-field frontmatter (exactly: `created`, `files_touched`, `premise_tests`, `candidate_premises`, `artifacts`)

A fixed kernel of five required fields, no more and no less. Each field carries a typed shape (paths, `path: verdict` pairs with verdict ∈ {`supported`, `refuted`, `inconclusive`}, ≤120-char claim strings capped at 3, folder paths). A **forbidden-fields list** (`confidence`, `importance`, `summary`, `notes`, `decisions_made`, `evidence_stage`, `schema_version`, `layer`, `repo`, `parent_session`, `reckon_gates_fired`, `routed_to`) names every field considered and dropped, so additions must justify themselves against the discovery record.

**Why chosen over alternatives.** Lens 01 spec'd ~20 fields including `files_touched_semantic`, `experiments_run`, `premise_tests_count`, mirror counts, and a budget-bookkeeping block. Lens 04 added `schema_version`, `layer`, `repo`, `parent_session`. Meta-C identified all of these as designing for a fleet (cross-repo synthesizer, ER walker, future curator) that does not exist. The five-field MVP is the irreducible kernel — every additional field must name a specific reader that needs it today (Meta-C rule 5).

### Length-as-parameter, bounded — `record_lines: auto | <int>`

A formula-defaulted line cap on the frontmatter block: `min(80, 8 + 3 * (len(files_touched) + len(premise_tests) + len(candidate_premises) + len(artifacts)))`. Integer override is allowed in both directions; up-override requires the agent to name the specific cross-references admitted, never to "make the session feel important." **The parameter sizes lines, not importance** — important sessions write to `discovery/`, not to longer signposts.

**Why chosen over alternatives.** Lens 01 proposed a richer formula with per-artifact coefficients (4/8/6/2/3) and a 120-line cap. Meta-C argued the body cap does the real work and the budget is redundant. The proposal compromises: keep the parameter (user-requested per discovery constraint #2) but rename from `record_budget` to `record_lines` so it cannot be mistaken for an "importance" dial; shrink coefficients to a single multiplier (3) so the formula is doable in the agent's head.

### Flag-only promotion and retirement (the two allowed external edits)

Close-session **never** writes to `constitution/` or `axiom/` and never moves a premise file. It may add **two single-line frontmatter flags** to a premise file: `promotion_candidate: true` (with a ≤140-char `promotion_rationale:`) and `retired: true` (with `retired_on:`, `retired_by:`, ≤140-char `retired_because:`). All four lenses converge on flag-only (Meta-A convergence #3); the proposal narrows it further to *exactly these two flags, nothing else*.

### Verbatim refusals as lookup, not judgment

A fixed refusal table maps the six predictable human asks ("make the note longer," "summarize what we learned," "promote that premise," etc.) to literal refusal strings. The agent matches the ask against the table and emits the string. **Re-asks get the same refusal verbatim — no escalation, no compliance.** Judgment fails under pressure; lookup does not.

### Defer-close exit (`CLOSE_DEFERRED: <reason>`)

When the session cannot be cleanly summarized into the five fields (genuinely tangled multi-domain work, half-finished investigation), the skill emits `CLOSE_DEFERRED: <one-line reason>`, preserves the scratchpad, and writes no note. **Better no signpost than a wrong one.** This closes Meta-B gap #3.

### Cold-start clause

If `domain_knowledge/premise/` has fewer than 3 files, refutation and promotion flagging are skipped; `candidate_premises` plus creation of new `premise/<slug>.md` files become the primary epistemic output. The clause expires automatically when premise count reaches 3. Closes Meta-B gap #6.

### Known leaks — named at the top of `SKILL.md`

The skill explicitly enumerates discipline it cannot enforce by itself (drift detection, promotion review, operational meaning of "emergence," Q&A-vs-decision boundary, multi-scratchpad handling, schema versioning, kernel/adapter sharing, audit-vault tooling). This is Meta-B's "honest defers" rendered as a prompt-visible block.

---

## 3. Detailed Specifications

### 3.1 Frontmatter schema (Record / Layer 1)

```yaml
---
created: 2026-05-16
files_touched:                    # paths only, no annotations
  - domain_knowledge/premise/illiquidity-clv.md
  - experiments/2026-05-15-illiquidity-clv/RESULTS.md
premise_tests:                    # list of "<path>: <verdict>" or []
  - domain_knowledge/premise/illiquidity-clv.md: supported
candidate_premises:               # strings ≤120 chars, max 3, or []
  - "CLV decays faster in illiquid markets than the Kelly model predicts"
artifacts:                        # folder paths only, never individual files, or []
  - domain_knowledge/discovery/2026-05-16-illiquidity/
record_lines: auto
---
```

**Closed vocabularies:**

- `verdict` ∈ `{supported, refuted, inconclusive}` — exactly these three tokens.
- `files_touched` entries are paths; no `(rewrote section X)` parentheticals.
- `candidate_premises` entries are claim strings, ≤120 chars each, at most 3.
- `artifacts` entries are folders ending in `/`. Never individual files.
- `record_lines` ∈ `auto | <positive integer>`.

**Slug collision policy:** if the target path exists, append `-2`, `-3`, … No silent overwrite.

### 3.2 Body shape (Reckon / Layer 2)

- Body ≤15 lines, no headings, no Summary, no rationale paragraphs.
- One line per `premise_tests` entry: the evidence pointer (a path).
- One line per `candidate_premises` entry: a ≤140-char *why-now* fragment.
- One line per `artifacts` entry: a ≤80-char tag (`discovery: <topic>`, `experiment: <topic>`, etc.).
- Empty Layer-1 field → no line in body for that field.
- **All Layer-1 fields empty → empty body. An empty body is correct.**
- **At line 16:** stop, route content out (to `discovery/`, `premise/`, or `experiment/`), redo Layer 2. Frontmatter is preserved across the redo.

### 3.3 Triage gate (Step 0)

Before any write:

1. **Scratchpad check.** Zero → use current conversation. One → consume it (delete after write). Two or more → emit `MULTIPLE_SCRATCHPADS: resolve manually` and stop.
2. **Semantic question (required).** *Did this session produce a status change for any premise, axiom, constitution entry, or candidate thereof?* Yes / no.
3. **Activity check.** Compute `files_touched` from `git status --porcelain` scoped to vault paths.
4. **Triage gate.** Write a note iff (semantic question = yes) OR (at least one of `files_touched`, `premise_tests`, `candidate_premises` non-empty). Otherwise: *"Q&A-only session. No session note created."*, delete scratchpad, stop.
5. **Defer-close exit.** If the session resists the five-field shape, emit `CLOSE_DEFERRED: <reason>`, preserve scratchpad, write no note.

### 3.4 Refusal table (verbatim)

| Ask | Refusal |
|---|---|
| "Make the session note longer, this was important." | *"Important sessions write to `discovery/`. The session note links to them. Body stays at 15 lines."* |
| "Summarize what we learned in the note so I don't have to click in." | *"The session note is a signpost, not a summary. Summaries live in routed files. I will add the link."* |
| "Add the reasoning chain to the body." | *"Multi-step reasoning routes to `discovery/`. The body records the pointer, not the chain."* |
| "Promote that premise to a constitution." | *"Promotion is not a close-session action. I will set `promotion_candidate: true` on the premise file with a one-line rationale. Promotion happens out of band."* |
| "We disproved premise X, delete it." | *"Retirement is flagging, not deletion. I will add `retired: true` + `retired_by:` + `retired_because:` to the premise file. The file stays."* |
| "Add a `confidence:` / `importance:` field." | *"That field is forbidden. Reasons in `vault/discovery/close-session-redesign/`. Refuse and continue."* |

### 3.5 Audit recipes (in-file footer)

Each note ships with two `grep` recipes that *are* the operational meaning of "auditable both directions":

```
# audit-forward: list files referencing this session
#   grep -rl "$(basename "$THIS_FILE" .md)" domain_knowledge/
# audit-backward: list sessions that touched a given premise
#   grep -l "<premise-path>" domain_knowledge/sessions/
```

If these ever return wrong or empty results for a real query, the schema has rotted. Closes Meta-B gap #1.

### 3.6 What is explicitly dropped (vs. the four propose-wave lenses)

| Dropped move | Source | Reason |
|---|---|---|
| 7-gate routing tree (A–G) | Lens 02 | Meta-C: gate tree assumes vault richer than day-1; only Gates A/C/G will fire in first quarter. Replaced by per-field pointer-line shape. |
| Literal sentinel comment `<!-- record-layer-frozen -->` | Lens 01 §4 | Write-order-to-disk + the closed-vocabulary field grammar suffice for solo-dev. Revisit if Layer-1/Layer-2 contamination is observed. |
| Retirement-replacement cooling period (separate session required) | Lens 02 §4 | Meta-C: intolerable in practice; common flow is "disproved X, obvious replacement Y, capture both while fresh." |
| `schema_version:`, `layer:`, `repo:`, `parent_session:`, `reckon_gates_fired:` | Lens 04 | Meta-C / Meta-B: design for a fleet (cross-repo synthesizer, ER walker, future curator) that does not exist. Forbidden-fields list locks the decision. |
| Kernel/adapter shim across repos + `sync-close-session-kernel` skill | Lens 04 | Defer until one sister repo invokes the redesign. |
| JSON schema + post-write linter + amendments log + `audit-vault` skill | Lens 03 | Solo dev will not maintain. Named in "Known leaks" instead. |
| Per-field 80-char hard cap (machine-enforced) | Lens 03 §1 | Kept as in-prompt convention (`why_now ≤140`, `tag ≤80`), but no linter. |
| Emergence Ratio walker | Lens 04 | Operational definition kept (footnote pointer in `SKILL.md`); computation deferred. |
| `experiments_run[]`, `premise_tests_count`, `files_touched_semantic`, mirror count fields | Lens 01 §1 | Not needed by any present reader; the five-field MVP covers what `grep`/`yq` can extract today. |

### 3.7 Cleanup

When the redesign ships:

- `git mv` the current `football-stats-oracle/.claude/skills/close-session/SKILL.md` to `SKILL.v0-baseline.md` for historical reference.
- Replace with the proposed `SKILL.md` at [`proposal/SKILL.md`](proposal/SKILL.md).
- Add a one-line pointer in the new `SKILL.md` to this discovery for the forbidden-fields rationale.

No other vault files are touched by the cleanup — this discovery's claims govern a single skill in a single repo at first deployment. Sister-repo ports are out of scope until at least one quarter of proven use.

---

## 4. Open Questions

Each open question carries a recommendation (per `discovery-writing.md` quality gate).

**OQ-1 — Should the Record-layer freeze be reinforced with a literal sentinel?**
*Recommendation:* No, for now. Write-order-to-disk plus the closed-vocabulary field grammar is enough for solo-dev scale. Revisit if a real session demonstrates Layer-2 contamination of Layer-1 fields. The sentinel design from Lens 01 §4 stays parked in this discovery's record.

**OQ-2 — Does `record_lines` survive at all, or did the body cap make it redundant?**
*Recommendation:* Keep, but as an `auto`-defaulted shape parameter, not as an importance dial. Re-evaluate after 30 sessions: if no real session has ever needed to override, drop the field. (Meta-C raised this; the proposal kept the field to honor the user's discovery constraint #2.)

**OQ-3 — Refusal escalation on human re-ask.**
*Recommendation:* Repeat the refusal verbatim. Never escalate, never comply. Codified in `SKILL.md` already; flagged here so it can be challenged before promotion.

**OQ-4 — Cold-start exit condition.**
*Recommendation:* Bootstrap clause turns off when `domain_knowledge/premise/` has ≥3 files. Arbitrary but check-able by `ls | wc -l`. Re-evaluate after the first ten real sessions.

**OQ-5 — Tiebreaker when one session genuinely fires two routes (e.g., refutation + replacement candidate).**
*Recommendation:* Honor both — `premise_tests` records the refutation, `candidate_premises` records the replacement string. The cooling-period rule from Lens 02 was dropped (see §3.6); the proposal trusts the user to write the replacement `premise/<slug>.md` in a follow-up session by their own discipline, not by skill enforcement.

**OQ-6 — Port findings back to sister `close-session` skills in `domainspec` and `house_project`.**
*Recommendation:* Defer until one quarter of proven use in `football-stats-oracle`. The kernel/adapter pattern proposed in Lens 04 is parked, not adopted.

**OQ-7 — Operational definition of "emergence."**
*Recommendation:* Adopt Lens 04's Emergence Ratio (axioms reachable by clean provenance walk / total axioms) as a footnote pointer in `SKILL.md`; computation tooling deferred. This makes "emergence" *named* but not yet *measured*. Honest about the gap.

**OQ-8 — Promotion-candidate review cadence.**
*Recommendation:* Manual quarterly triage by the user. The skill writes the flag; nothing reviews it automatically. Named in "Known leaks" block at the top of `SKILL.md`.

**OQ-9 — Drift detection cadence.**
*Recommendation:* Every ~30 sessions, re-read the most recent 5 by eye. If the body-length distribution has shifted upward or `candidate_premises` paths point at discoveries that do not exist, drift has happened. Named in "Known leaks."

**OQ-10 — Disagreement between Lens 02 and Lens 03 on enforcement layer for the cap.**
Lens 02 wants the skill prompt to refuse-and-redo at line 16; Lens 03 argues only a post-write linter actually holds. *Recommendation:* Ship the in-prompt refusal as the immediate defense; treat the linter as part of the deferred `audit-vault` tooling named in "Known leaks." Concede Lens 03's point that an LLM-only enforcement layer rots — but accept the rot risk against the cost of building a linter today.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/close-session-redesign/README.md` | `part-of` | This discovery sits inside the close-session-redesign discovery bundle; the README is the bundle's hub. |
| `vault/discovery/close-session-redesign/research/research.md` | `derives-from` | Cross-lens consolidation under the new convention; structurally re-presents the three meta-lenses as a single research view. |
| `vault/discovery/close-session-redesign/research/research-synthesis.md` | `cites` | ≤500-word short-form summary of the research synthesis. |
| `vault/discovery/close-session-redesign/lenses/01-record-layer-mechanics/findings.md` | `derives-from` | Record-layer schema, freeze rule, and edge cases are drawn from this propose-wave lens. |
| `vault/discovery/close-session-redesign/lenses/02-reckon-layer-discipline/findings.md` | `derives-from` | Verbatim refusals, flag-only promotion/retirement, and the 10/15-line cap rationale derive from this propose-wave lens. |
| `vault/discovery/close-session-redesign/lenses/03-adversarial/findings.md` | `derives-from` | Forbidden-fields list, judgment-laundering analysis, and the un-falsifiable-terms diagnosis derive from this propose-wave lens. |
| `vault/discovery/close-session-redesign/lenses/04-cross-skill-continuity/findings.md` | `derives-from` | Emergence Ratio definition, audit recipes, and the dropped kernel/adapter rationale derive from this propose-wave lens. |
| `vault/discovery/close-session-redesign/lenses/META-cross-cutting/findings.md` | `derives-from` | Second-order meta-lens; the convergence catalog grounds which moves were adopted as load-bearing across all four lenses. |
| `vault/discovery/close-session-redesign/lenses/META-gap-analysis/findings.md` | `derives-from` | Second-order meta-lens; the "Known leaks" block, defer-close exit, cold-start clause, and audit recipes all answer specific gaps named here. |
| `vault/discovery/close-session-redesign/lenses/META-adversarial-review/findings.md` | `derives-from` | Second-order meta-lens; the five-field MVP skeleton, the drop list, and the over-engineering critique come from this meta-lens. |
| `vault/discovery/close-session-redesign/proposal/SKILL.md` | `operationalized-by` | The proposed replacement `SKILL.md` is the runnable skill that operationalizes this discovery's claims. |

---

## Source dispatch

This discovery was promoted from a propose-wave + evaluate-wave subagents investigation under the `close-session-redesign` topic. Provenance:

- **Propose wave (N=4):** Lens 01 (record-layer mechanics), Lens 02 (reckon-layer discipline), Lens 03 (adversarial), Lens 04 (cross-skill continuity) — all at `vault/discovery/close-session-redesign/lenses/<slug>/findings.md` after v0.2.0 migration.
- **Evaluate wave (M=3):** Meta-A (cross-cutting convergences), Meta-B (gap analysis), Meta-C (adversarial review) — preserved at `vault/discovery/close-session-redesign/lenses/META-<slug>/findings.md` (`lens_order: second`); their cross-lens consolidation is presented under the new convention at `vault/discovery/close-session-redesign/research/research.md`.
- **Proposal artifact:** `vault/discovery/close-session-redesign/proposal/SKILL.md`.
- **Promotion gate:** confirmed by user in lifecycle step 7, 2026-05-17 (knowledge / vault scope).
