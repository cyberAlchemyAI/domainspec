---
name: close-session
description: Close a session and write a provenance signpost under domain_knowledge/sessions/. Two layers — Record (mechanical, frozen) then Reckon (pointers only) — with a hard-capped body and no auto-edits to other vault files.
---

# Close Session

The vault represents knowledge in its most compressed form (axioms, fundamentals) and lets new knowledge emerge from that compression. This skill writes **one provenance signpost per session** so promotion / retirement of premises is auditable both directions, without the session stream becoming a parallel uncompressed knowledge channel.

**The session note is a signpost, not a document.** If a session's content wants to be longer than the cap, the real artifact is a `discovery/`, a `premise/`, or an `experiment/` README — not a longer note.

---

## Known leaks (read before invoking)

Discipline this skill cannot enforce by itself; named so they don't drift silently:

- **Drift detection** — no audit tooling exists. Every ~30 sessions, re-read the most recent 5 by eye. Assume drift if you haven't.
- **Promotion review** — `promotion_candidate: true` flags accumulate on premise files. Nothing reviews them automatically. Triage by hand quarterly or they pile up.
- **"Compression" / "emergence"** are operationalized as the Emergence Ratio (axioms reachable by clean provenance walk / total axioms) in `vault/discovery/close-session-redesign/`. No walker exists yet.
- **Q&A vs decision** is fuzzy by nature. Step 0 includes one required semantic question; that is the only backstop.
- **Multiple scratchpads** trigger refusal, not guessing.
- **Schema versioning, kernel/adapter across repos, JSON validator, audit-vault skill** are all deferred until a named consumer needs them.

---

## Step 0 — Triage

Answer in order:

1. **Scratchpad check.** `ls .claude/current_conversations/*.md`.
   - Zero → use this conversation as input.
   - One → use it as primary input; delete after the note is written.
   - Two or more → emit `MULTIPLE_SCRATCHPADS: resolve manually` and stop.

2. **Semantic question (required).** Ask yourself: *did this session produce a status change for any premise, axiom, constitution entry, or candidate thereof?* Answer yes / no.

3. **Activity check.** Compute `files_touched` (`git status --porcelain` + uncommitted changes scoped to vault paths). Compute candidate-premise list from the conversation (strings, ≤120 chars each, max 3).

4. **Triage gate.** Write a note iff **either** the semantic question is yes **or** at least one of `files_touched`, `premise_tests`, `candidate_premises` is non-empty. Otherwise:
   - Say *"Q&A-only session. No session note created."*
   - Delete the scratchpad.
   - Stop.

5. **Defer-close exit.** If the session cannot be cleanly summarized into the five fields below (e.g., genuinely tangled multi-domain work, half-finished investigation), emit `CLOSE_DEFERRED: <one-line reason>`, preserve the scratchpad, write no note. Better no signpost than a wrong one.

---

## Step 1 — Record (Layer 1)

Closed vocabulary only. No prose in field values. Write the frontmatter, then flush before Step 2.

**File path:** `domain_knowledge/sessions/YYYY-MM-DD-HHMM-<slug>.md` (slug: 1–4 kebab words).

**Slug collision policy:** if the path exists, append `-2`, `-3`, … No silent overwrite.

**Required fields (exactly these five; no more, no less):**

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
record_lines: auto                # see "Length parameter" below
---
```

**Closed vocabularies:**

- `verdict` ∈ `{supported, refuted, inconclusive}` — exactly these three tokens.
- `files_touched` entries are paths, nothing else. No `(rewrote section X)` parentheticals.
- `candidate_premises` entries are claim strings ≤120 chars. No multi-clause sentences.
- `artifacts` entries are folders ending in `/`. Never individual files (no `raw/foo.md`).

**Forbidden top-level fields** (refuse even if user asks): `confidence`, `importance`, `summary`, `notes`, `decisions_made`, `evidence_stage`, `schema_version`, `layer`, `repo`, `parent_session`, `reckon_gates_fired`, `routed_to`. Each was considered and dropped. If a future reader needs one, justify in [vault/discovery/close-session-redesign/](../../../../domainspec/vault/discovery/close-session-redesign/) first.

**Length parameter — `record_lines`.**

- Default `auto`. Computed as `min(80, 8 + 3 * (len(files_touched) + len(premise_tests) + len(candidate_premises) + len(artifacts)))`.
- Integer override allowed (e.g. `record_lines: 50`). Down is fine; up requires the agent to name the specific cross-references the budget admits — never to "make the session feel important."
- **The parameter sizes how many lines of *frontmatter* are allowed. It is not an importance dial.** "More important" sessions write to `discovery/`, not to a longer signpost.

Flush the frontmatter to disk before generating Step 2. Do not re-edit fields above this point during Step 2.

---

## Step 2 — Reckon (Layer 2)

Body, ≤15 lines, **one pointer-line per non-empty Layer-1 entry**. No gate trees, no summary, no headings, no rationale paragraphs.

**Shape:**

- One line per `premise_tests` entry: the evidence pointer (a path, e.g. `experiments/2026-05-15-illiquidity-clv/RESULTS.md`).
- One line per `candidate_premises` entry: a ≤140-char *why-now* fragment. Not a thesis, not a multi-clause sentence.
- One line per `artifacts` entry: a ≤80-char tag (`discovery: <topic>`, `experiment: <topic>`, etc.).

If a layer-1 field is empty, no line for it. If all are empty, the body is empty. **An empty body is correct.**

**Hard cap: 15 lines.** If you cannot fit, the content does not belong in the session note. Route it:
- Multi-step argument or multi-source synthesis → write `domain_knowledge/discovery/<slug>/README.md` and put the path in `artifacts`.
- A testable claim → write `domain_knowledge/premise/<slug>.md` (minimal: claim + falsifier + one evidence pointer) and put the slug in `candidate_premises`.
- Reproducible procedure → write `experiments/<slug>/README.md` and put the path in `artifacts`.

**At line 16: stop, re-route content out, redo Step 2.** Frontmatter is preserved.

---

## Refusals (verbatim — emit the string and stop)

| Ask | Refusal |
|---|---|
| "Make the session note longer, this was important." | *"Important sessions write to `discovery/`. The session note links to them. Body stays at 15 lines."* |
| "Summarize what we learned in the note so I don't have to click in." | *"The session note is a signpost, not a summary. Summaries live in routed files. I will add the link."* |
| "Add the reasoning chain to the body." | *"Multi-step reasoning routes to `discovery/`. The body records the pointer, not the chain."* |
| "Promote that premise to a constitution." | *"Promotion is not a close-session action. I will set `promotion_candidate: true` on the premise file with a one-line rationale. Promotion happens out of band."* |
| "We disproved premise X, delete it." | *"Retirement is flagging, not deletion. I will add `retired: true` + `retired_by:` + `retired_because:` to the premise file. The file stays."* |
| "Add a `confidence:` / `importance:` field." | *"That field is forbidden. Reasons in `vault/discovery/close-session-redesign/`. Refuse and continue."* |

Re-asks get the same refusal verbatim. No escalation, no compliance.

---

## What close-session does NOT do

- **Never auto-promotes.** If a premise looks ready, add `promotion_candidate: true` + a ≤140-char `promotion_rationale:` to *the premise file* (the one external edit allowed, see below). Do not move the file. Do not write a constitution.
- **Never auto-retires (deletes).** Add `retired: true`, `retired_on:`, `retired_by:` (session path), `retired_because:` (≤140 chars) to the premise file. File stays in place.
- **Never edits other session notes.** Sessions are append-only. Corrections happen in a new session that references the old one in its body.
- **Never writes to `constitution/` or `axiom/`.** Those are separate, slower, deliberate acts.

**The two allowed external edits** are the `promotion_candidate` and `retired` flags on premise files. Both are single-line frontmatter additions. No prose, no edits to the claim itself.

---

## Cold-start clause

If `domain_knowledge/premise/` has fewer than 3 files:
- Refutation flagging is skipped (no premises to refute).
- Promotion flagging is skipped (no corroboration history to count against).
- `candidate_premises` and the creation of new `premise/<slug>.md` files are the primary epistemic output.
- Treat the first ~5 sessions as bootstrapping; expect almost all of them to land at `candidate_premises` + empty `premise_tests`.

This clause expires automatically when premise count reaches 3.

---

## Audit recipes (footer; copy into every note)

```
# audit-forward: list files referencing this session
#   grep -rl "$(basename "$THIS_FILE" .md)" domain_knowledge/
# audit-backward: list sessions that touched a given premise
#   grep -l "<premise-path>" domain_knowledge/sessions/
```

These two `grep`s are what "auditable both directions" actually means. If they ever return wrong or empty results for a real query, the schema has rotted.
