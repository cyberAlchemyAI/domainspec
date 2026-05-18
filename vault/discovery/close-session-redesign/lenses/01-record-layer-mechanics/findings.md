# Lens 01 — Record Layer Mechanics

## Claim

Layer 1 earns its keep only if it is **mechanical, deterministic, and exhaustive within a bounded budget**. Every field must either be auto-derivable from on-disk state (git, scratchpad, `experiments/` mtime) or be a closed-vocabulary tag the agent fills without prose. The `record_budget: auto` formula must scale with *counted artifacts that produced cross-references*, not with narrative ambition — each unit of overflow buys exactly one more cross-reference line, never a sentence of commentary. The freeze rule is enforced by **write order on disk**: the frontmatter block is appended and the file flushed before any Layer 2 character is generated, making "Reckon contaminated Record" a structurally impossible failure rather than a discipline problem.

## Design

### 1. Frontmatter schema (Layer 1 only)

All fields below are part of Layer 1. None contain free prose. The Layer 2 block lives **below** the frontmatter and a hard separator, addressed in Lens N (not here).

```yaml
---
# --- identity (auto) ---
created: 2026-05-16                  # date, agent-stamped
timestamp: 2026-05-16T14:32:11-03:00 # ISO-8601 with tz, agent-stamped
session_id: 2026-05-16-1432-<slug>   # matches filename stem; slug is agent-supplied (≤4 words, kebab)
scratchpad: .claude/current_conversations/<file> | null  # path consumed, or null

# --- disk delta (auto from `git status` + `git diff --name-only HEAD`) ---
files_touched:                       # tracked changes only; untracked excluded unless added
  - path: domain_knowledge/premise/illiquidity-clv.md
    change: M | A | D | R            # modify | add | delete | rename
    lines_added: 12                  # from `git diff --numstat`
    lines_removed: 3
    semantic: true | false           # see §5 edge cases
files_touched_count: 7               # = len(files_touched)
files_touched_semantic: 4            # = count where semantic=true

# --- experiments (auto from experiments/ mtime + git) ---
experiments_run:                     # one entry per run-folder mtime'd this session
  - path: experiments/2026-05-15-illiquidity-clv/
    status: complete | partial | aborted
experiments_run_count: 1

# --- premise tests (agent-supplied; closed vocabulary) ---
premise_tests:
  - premise: domain_knowledge/premise/illiquidity-clv.md
    verdict: supported | refuted | inconclusive
    evidence: experiments/2026-05-15-illiquidity-clv/   # path, not prose
premise_tests_count: 1

# --- candidates (strings, hard-capped) ---
candidate_premises:                  # max 5 entries, each ≤120 chars, no period required
  - "CLV decays faster in illiquid markets than the Kelly model predicts"
premises_created: []                 # paths only; non-empty only if user explicitly named
artifacts:                           # FOLDERS only, never individual raw/*.md
  - domain_knowledge/discovery/2026-05-16-illiquidity/

# --- budget bookkeeping (auto) ---
record_budget: auto                  # literal token, or integer override
record_budget_resolved: 56           # computed integer; see §2
record_lines_used: 41                # actual lines in this frontmatter
---
```

**Field-by-field justification:**

| field | why it earns its place |
|---|---|
| `session_id` | Foldable into filename, but duplicated in-body so a `grep -r session_id:` over `domain_knowledge/` resolves backward provenance without filename parsing. |
| `scratchpad` | Records the consumed input so a later audit can verify the scratchpad-delete-after-write contract held. Null is meaningful: signals a session with no scratch state. |
| `files_touched[*].change` | Renames and deletes are invisible to a path-only list. The pipeline needs them: a deleted premise is *retirement evidence*. |
| `lines_added/removed` | Cheapest possible "did anything substantial happen" signal, derived from `--numstat`. Layer 2 may consult it; Layer 1 just records it. |
| `semantic` boolean | Lets the budget formula ignore whitespace/rename noise without dropping the path from the record. See §5. |
| `*_count` mirror fields | Redundant with array length but allows `grep -c` / `yq` queries without parsing arrays. Cheap; <1 line each. |
| `experiments_run[*].status` | Distinguishes "ran the rig" from "got a result." Pipeline cares: only `complete` runs can produce verdicts. |
| `premise_tests[*]` | Closed vocabulary (`supported|refuted|inconclusive`) keeps Layer 1 mechanical. The *meaning* of the verdict belongs in Layer 2. |
| `candidate_premises` | Strings, not paths, because they are pre-file. Cap at 5 — anything more is narration, not compression. |
| `artifacts` | Folder-only rule (inherited from baseline) prevents the session note from re-shadowing a discovery bundle. |
| `record_budget_resolved` / `record_lines_used` | Self-auditing: a reviewer can see whether the budget bound. If `used == resolved` and there are still uncounted artifacts, the schema itself failed and we need to revisit the formula. |

### 2. `record_budget: auto` formula

```
resolved = min(
  120,
  12
  + 4 * files_touched_semantic
  + 8 * experiments_run_count
  + 6 * premise_tests_count
  + 2 * len(candidate_premises)
  + 3 * len(artifacts)
)
```

**Why these coefficients:**

- **12 (base).** Identity + bookkeeping fields cost ~10 lines minimum regardless of session content. Pad of 2 for the YAML delimiters and one stub entry.
- **4 per semantic file.** Each `files_touched` entry is 4 YAML lines (`path`, `change`, `lines_added`, `lines_removed`, `semantic`). Non-semantic files (whitespace/renames) are recorded but ignored by the budget — see §5. The coefficient is the *cost*, not an importance weight. The formula is "how many lines does the schema need to admit this much disk activity," not "how important is this session."
- **8 per experiment.** Each run is 2 YAML lines on its own, but an experiment typically pulls in 1 premise test (6 more) and 1–2 candidate premises (4 more). The 8 accounts for the run *and* its likely tail of cross-references, so a 1-experiment session doesn't immediately overflow.
- **6 per premise test.** Each test is 3 YAML lines plus typically one cross-reference into `artifacts` or an updated premise file path. 6 keeps the math honest without slack.
- **2 per candidate.** Each candidate is a single string line; 2 covers the line plus the proportional fraction of the array key overhead.
- **3 per artifact folder.** Each is 1 line, but linking an artifact usually means a matching `files_touched` entry inside it that the formula already counted — 3 is deliberate slight under-count to discourage padding the artifacts list.
- **Cap at 120.** Above 120 frontmatter lines, the session is no longer a signpost; it's a document. The cap forces the agent to either compress (consolidate by parent folder) or split the session into multiple notes. 120 lines ≈ one terminal page; signposts should fit on one screen.

**Override semantics.** An integer `record_budget: 40` *overrides* the formula, both up and down. Down is a discipline tool (forcing the agent to drop low-signal entries). Up is for known-large sessions that genuinely have many cross-references (e.g., a big discovery wave consolidation). The resolved integer is always written to `record_budget_resolved` so audits can detect overrides.

**What "lines used" counts.** Every non-blank line inside the `---` fences. Array elements count individually. The agent verifies `record_lines_used ≤ record_budget_resolved` as the last step before flushing.

### 3. Auto-derivation strategy

**Fully auto (no agent judgment):**

| field | source command / heuristic |
|---|---|
| `created`, `timestamp` | system clock |
| `session_id` | `${date}-${time}-${slug}`; slug comes from agent but is the only judgment input |
| `scratchpad` | `ls .claude/current_conversations/*.md | head -1` (current session's file) |
| `files_touched[*].path, change` | `git status --porcelain` + `git diff --name-status HEAD` |
| `files_touched[*].lines_added/removed` | `git diff --numstat HEAD` per path |
| `files_touched_count`, `files_touched_semantic` | derived after `semantic` is assigned |
| `experiments_run[*].path` | `find experiments -maxdepth 1 -type d -newer .claude/current_conversations/<scratchpad>` (or session start marker if no scratchpad); intersected with paths appearing in `git status` |
| `experiments_run[*].status` | presence of `RESULTS.md` / `result.json` → `complete`; only `RUNLOG` → `partial`; neither → `aborted` |
| `record_budget_resolved`, `record_lines_used` | computed |

**Requires agent judgment (but closed-vocabulary, not prose):**

| field | judgment required |
|---|---|
| `slug` in `session_id` | 1–4 kebab words; agent picks |
| `files_touched[*].semantic` | boolean: is this a substantive edit or whitespace/rename/import-reorder? Heuristic: if `lines_added + lines_removed ≤ 4` AND `change != A`, default `false` unless agent overrides. |
| `premise_tests[*].verdict` | one of three tokens; the *test* either reached a verdict or it didn't |
| `premise_tests[*].premise` and `evidence` | paths; agent picks but doesn't compose prose |
| `candidate_premises[*]` | strings, capped at 5 × 120 chars |
| `premises_created` | paths; auto-list any new file under `domain_knowledge/premise/` from `git status`, but agent must confirm user explicitly named it (otherwise drop) |
| `artifacts` | agent picks folders; `git status` proposes candidates by collapsing files under `discovery/<slug>/` to the folder |

**Agent never composes:** sentences, rationales, "why" statements, summaries. Those are Layer 2.

### 4. The freeze rule

**Operational enforcement: write order.** Layer 1 is written to disk as a complete, valid YAML frontmatter block followed by a single closing `---` and a sentinel comment, **before any Layer 2 token is generated**. The skill executes:

```
1. Compute all auto-derivable fields.
2. Solicit closed-vocabulary judgment fields from agent (slug, semantic flags, verdicts, candidates).
3. Validate: record_lines_used ≤ record_budget_resolved. If not, drop in this order:
     a. non-semantic files (move to a collapsed `files_touched_omitted_count: N`)
     b. excess candidate_premises beyond 5
     c. fail loudly — never silently trim semantic content.
4. Write the file with frontmatter + closing `---` + the sentinel:

   <!-- record-layer-frozen -->

5. Flush. (`echo`/Write returns.)
6. Only now: begin Layer 2 generation, appending below the sentinel.
```

The sentinel `<!-- record-layer-frozen -->` is the structural lock. The Layer 2 prompt sees the sentinel and is forbidden from editing anything above it. A linter check (future tooling, but trivial: `grep -B 9999 'record-layer-frozen' | yq`) can verify Layer 1 parses standalone — if it doesn't, Layer 2 contamination is detected.

**Why write order, not just an internal checklist:** an internal "first do Record, then Reckon" prompt instruction is unenforceable — the model can re-edit. A flushed file on disk with a sentinel cannot be retroactively un-flushed without a second tool call that is visibly auditable in the transcript. The freeze is *structural*.

**Inside-Layer-1 ordering** (within step 2): the agent fills judgment fields *in the order they appear in the schema*, top to bottom. This prevents "save the slug for last after I see what the session was about" — the slug is identity, it gets named first, before any reckoning bleeds into it.

### 5. Edge cases

**E1: Zero file changes, real verdict.** A session that re-reads existing experiment results and reaches a premise verdict.

- `files_touched: []`, `files_touched_count: 0`, `files_touched_semantic: 0`.
- `experiments_run: []` (no new run).
- `premise_tests` is non-empty; `premise_tests_count ≥ 1`.
- Budget: `12 + 6*1 = 18`. Tight but sufficient — the schema needs ~14 lines for identity + the one test entry.
- The note still triggers (verdict reached) — the Step 0 triage from baseline already covers this; Layer 1 mechanics just need to not collapse when `files_touched` is empty.

**E2: Many touched files, no semantic change.** Mass rename, formatter run, import reorder.

- `files_touched` includes every path, each with `semantic: false` (auto-assigned by the ≤4-line heuristic; agent may override individual paths up).
- `files_touched_count: 47`, `files_touched_semantic: 0`.
- Budget: `12 + 4*0 + 0 + 0 = 12` — the formula refuses to grow.
- To prevent the *recorded* `files_touched` array itself from busting the cap of 120 lines, apply a collapse rule: if `files_touched_count - files_touched_semantic > 10`, collapse non-semantic entries into:
  ```yaml
  files_touched_nonsemantic_summary:
    count: 47
    glob: "**/*.py"     # longest common path/glob, agent-picked from closed templates
    change_breakdown: {M: 47, A: 0, D: 0, R: 0}
  ```
  Semantic entries remain fully listed.
- This is the only place Layer 1 "summarizes" — and it summarizes counts, not meaning.

**E3: Scratchpad-only session.** Heavy conversation, no disk writes, scratchpad exists.

- If Step 0 triage from baseline says "skip," Layer 1 doesn't run. The scratchpad is deleted by the skip path.
- If a candidate premise emerged from the conversation alone, the session passes triage on the `candidate_premises` axis. Then: `files_touched: []`, `experiments_run: []`, `premise_tests: []`, `candidate_premises: ["…"]`. Budget: `12 + 2 = 14`. Smallest legitimate note.

**E4: Session split across multiple git commits already made mid-session.** Auto-derivation must use a session-start ref, not `HEAD~1`.

- The scratchpad creation time (`stat -f %B <scratchpad>` on macOS) is the session-start marker.
- `files_touched` derives from `git diff --name-status $(git log --before=<start_time> -1 --format=%H)..HEAD` plus `git status` for uncommitted.
- If no scratchpad, fall back to "since last session note": `git log -1 --format=%H -- domain_knowledge/sessions/`. Imperfect but deterministic.

**E5: Budget overflow with all-semantic content.** Genuinely big session, formula caps at 120 but `record_lines_used` would be 145.

- Hard fail with a structured error: `RECORD_BUDGET_EXCEEDED: split this session`. The skill refuses to write a corrupt note.
- The agent must either (a) bump `record_budget` to an explicit integer, accepting the audit flag, or (b) split into two session notes with distinct slugs and timestamps a minute apart. Option (b) is preferred; the pipeline tolerates two signposts better than one bloated one.

## Evidence / Reasoning

**Baseline behavior anchored to:** the existing `close-session/SKILL.md` already has a hard 25-line *body* cap and folder-only `artifacts` rule. Both reflect the same instinct: signposts, not documents. This lens extends that instinct *into the frontmatter*, which currently has no cap and is the most likely contamination vector — a long `candidate_premises` list or a sprawling `files_touched` can swell a note past usefulness while technically respecting the body cap.

**Two-layer constraint:** the failure mode of Layer 1 is *incompleteness* — a missing `files_touched` entry breaks backward provenance. Therefore Layer 1 should default to *recording too much*, bounded only by the budget formula. The collapse rule (§5 E2) is the safety valve: when "too much" becomes noise, the formula collapses noise into counts but never silently drops semantic content. Contrast with Layer 2, whose failure mode is *prematurity*, and which is therefore tightly capped at ~10 lines with no parameter.

**Why auto-derivation over agent narration:** every field that can come from `git`/mtime/filesystem must come from there. Agent-supplied prose in Layer 1 is the contamination this redesign exists to prevent. The closed-vocabulary judgment fields (`semantic`, `verdict`, slug) are unavoidable — the filesystem doesn't know what "substantive" means — but they're tokens or paths, never sentences.

**Why the sentinel + write-order freeze:** an in-prompt rule ("first do A, then B") cannot survive a model that re-reads its own output. A flushed file boundary is enforceable post-hoc: a linter or reviewer can verify Layer 1 is internally valid YAML without seeing Layer 2 at all. This converts a discipline problem into a structural one, which matches the redesign objective of "auditable in both directions."

**Why the budget coefficients are small integers:** the formula must be doable in the agent's head and reproducible by a reviewer with the same inputs. Floats, percentages, or piecewise functions would invite tuning fights. The coefficients are deliberately memorable: 12 base, 4/8/6/2/3 per artifact class.

**Why `files_touched_semantic` is a separate count:** the existing baseline says "not a typo/whitespace/rename-only edit" in triage but doesn't carry that distinction into the record. Carrying it explicitly means the budget formula and downstream queries can both honor the distinction without re-deriving it from `lines_added/removed` each time.

## Open Questions

1. **Semantic flag default.** The heuristic "≤4 line diff AND `change != A` → `semantic: false`" is a guess. Should it be tighter (≤2 lines) or looser? A wave evaluator with access to recent session diffs could calibrate.
2. **Scratchpad as session-start marker.** macOS `stat -f %B` gives birth time; Linux requires `stat -c %W` and not all filesystems support it. Cross-platform fallback needed — perhaps a `SESSION_STARTED_AT` written into the scratchpad itself on creation.
3. **Per-run cost of `experiments_run[*].status` detection.** The `RESULTS.md` / `RUNLOG` heuristic assumes a convention that may not be enforced in `experiments/`. Lens on `experiments/` folder conventions (out of scope here) should confirm or supply the canonical marker file.
4. **Interaction with `git mv` for promotion.** The baseline forbids promotion in this skill. But a future `promote-premise` skill will `git mv`, and the *next* session's `files_touched` will see the rename. Should `change: R` against a `domain_knowledge/premise/` path auto-suggest a Layer 2 "promotion confirmed" tag? That's a Layer 2 question, but the field needs to be in Layer 1 for it to be available.
5. **`record_budget_resolved` after override.** If the agent overrides to a number lower than the formula would produce, do we still log the would-have-been value? Probably yes, as `record_budget_formula: 56` alongside `record_budget_resolved: 40`, to make manual compression visible in audit.
6. **What "session" means when two are interleaved.** Two scratchpads coexisting in `.claude/current_conversations/` — does the skill close both, refuse, or pick the older? Out of scope for Layer 1 mechanics per se, but the `scratchpad` field assumes a single-pad answer.
7. **Cap of 120 lines: empirically right?** Picked from "one terminal screen." A retro over the last N session notes (none exist in this redesign yet, but the existing `domain_knowledge/sessions/` if non-empty) would either validate or shift this number.
8. **Should `candidate_premises` carry a stable hash** so the same candidate appearing across multiple sessions can be deduped without string-matching? Adds 1 line per entry; benefit only realized once a triage skill exists.
