---
name: predict
description: Log, resolve, and score wagers — predictions (Brier vs truth) and bets (payout vs a line) in one append-only journal. Brier leaderboard plus a separate payout ledger.
argument-hint: "<claim> @ <prob> by <date> [--stake N --side yes|no --line <spec>] | list [open|resolved|all] | resolve <id> yes|no|void | score"
allowed-tools: Read, Write, Edit, Bash
---

# /predict — wager journal

A tiny "joguinho" for tracking probabilistic wagers made by the user, the assistant, or anyone else. The dataset is a single append-only JSONL file. Belief scoring uses Brier (lower = better); bets additionally pay out against a line.

## Concepts — wager = prediction ∪ bet

A **wager** = (claim, belief `p`, side, stake, reference, settlement). One object, two readings:
- Reference is the **truth** (the outcome) ⇒ it's a **prediction**, scored by Brier. Opponent: reality.
- Reference is a **line** `b` (a quoted price) ⇒ it's a **bet**, settled by payout. Opponent: a counterparty.
- `probability` is **always** your belief and **always** drives Brier — every row, prediction or bet. The `line` field merely ADDS a payout settlement on top; the residue is purely additive. A bet is a prediction that also carries `{stake, side, line}`.
- The `line` field is the single discriminator. A pure prediction is just the `stake=0` / `line=verdade` instance.

This is the textbook market-scoring-rule view (Hanson/LMSR, Kelly) — not a novel result; the unification is bookkeeping, not theory.

## Data file

- **Path:** `~/.claude/skills/predict/predictions.jsonl`
- **Format:** one JSON object per line. UTF-8. No trailing comma.
- **Lifecycle:** create the file empty on first write if missing (`mkdir -p` then `touch`).

### Record shape

```json
{
  "id": "p-YYYY-MM-DD-NNN",
  "question_id": "p-YYYY-MM-DD-NNN",
  "kind": "live" | "retro",
  "created_at": "ISO-8601 UTC",
  "predictor": "user" | "assistant" | "<free-form name>",
  "claim": "string",
  "topic": "string (dense kebab-case tag; optional for live, required for retro)",
  "probability": 0.0,
  "stake": 0,
  "side": "yes" | "no",
  "line": { "type": "verdade" },
  "resolves_at": "YYYY-MM-DD or null if unknown",
  "resolution_criteria": "string (may be empty)",
  "status": "open" | "resolved" | "void",
  "resolved_at": null,
  "outcome": null,
  "brier": null,
  "log_score": null,
  "payout": null,
  "extraction_date": null,
  "source_session": null,
  "notes": ""
}
```

- `kind` defaults to `"live"` (a wager made now). Retro entries (`"retro"`) are predictions extracted in retrospect from past conversation sessions; they are written only by the retro-extraction process described below, never by user typing.
- `extraction_date` and `source_session` are populated for `retro` kind only.
- `topic` is a dense kebab-case tag like `singularity-symmetry-tower` or `prediction-tracker-skill-shape`. Optional for live, required for retro.
- `probability` is a float in `[0,1]` (the predictor's stated probability that the claim resolves `yes`). `p == 1` means probability 1.0 (not 1%); a bare integer `1` is 1.0. Clamping to `[1e-9, 1-1e-9]` happens at score time only. **`probability` always drives Brier, on every row.**
- `stake` is a float `>= 0`, default `0`. Points wagered. `0` ⇒ pure prediction, invisible to payout. Negative stake is clamped to `0` defensively (never refuse to log).
- `side` is `"yes"` or `"no"`, default `"yes"`. Which outcome you back for payout. **Irrelevant to Brier**, which always scores `probability` vs outcome.
- `line` is an object, default `{ "type": "verdade" }`. The reference / odds source. Variants:
  - `{ "type": "verdade" }` — pure prediction; payout always null (the reference is the truth).
  - `{ "type": "casa", "p": 0.5 }` — bet vs a fixed baseline line (`p` = baseline prob of YES; default `0.5`). Note: `casa` at `p=0.5` is even money — **belief-blind** (your `probability` never enters the payout); it is the one line where two equal opposite-side bets net to zero.
  - `{ "type": "mercado", "p": <float> }` — bet vs an external market price (prob of YES). `p` is **required**; a `mercado` line without `p` is malformed (see settlement).
  - `{ "type": "oponente", "question_id": "<qid>", "counterparty_id": "<row-id>", "q_snapshot": <float> }` — bet vs another predictor's price, **snapshotted at log time**. `q_snapshot` is that predictor's prob of YES captured when this bet was logged; settlement reads it directly (no live lookup), so the counterparty cannot shade their line afterward. This is a **fixed-odds** bet against that snapshot, NOT a shared pot — payouts across predictors do not sum to zero.
  - There is **no** `payout_model` field — `line.type` IS the model selector. Keep it that way.
- `payout` is a float or null. Computed ONLY at resolve; null while open, null on void, null when `line.type == "verdade"` or `stake == 0`.
- `id` is per-row and unique: `p-<date>-NNN` where `NNN` is a zero-padded daily counter. To compute the next `NNN`, scan **all** lines whose `id` starts with `p-<today>-`, take `max(NNN)+1`. Do not rely on "the last line."
- `question_id` groups multiple predictors' rows about the same underlying question. On a solo `add`, default `question_id = id`. When the assistant attaches a wager to a user's question via `--on <question_id>`, both rows share that `question_id` but each has its own `id`.
- Predictor names beyond `user`/`assistant` are free-form strings; only `user` and `assistant` participate in the head-to-head game.

**Back-compat / migration.** All pre-existing rows lack `stake`, `side`, `line`, `payout`. Readers MUST treat absent values as `stake = 0`, `side = "yes"`, `line = { "type": "verdade" }`, `payout = null`. So every existing row is a pure prediction and all Brier numbers are unchanged. A row with no `line` field and a row with `line: {type:"verdade"}` read identically. **No backfill** — do not rewrite old rows.

## Append-only contract

This skill **appends to `predictions.jsonl` only. It never modifies or deletes existing lines.** Resolution is implemented by appending a new line with the same `id` and `status: "resolved"` plus computed scores. Readers reduce by `id`, taking the **latest physical line in file order** (file order is the source of truth — never `resolved_at`, never `created_at`).

Defensive notes (apply to every subcommand): always `mkdir -p` the skill dir before writing; stream the file line-by-line on read; never `Edit` existing lines (only `Bash` append via `>> predictions.jsonl`, or `Write` of an empty file on first creation); skip malformed JSON lines with a warning rather than crashing. `line` being a nested object is transparent to a line-by-line JSONL reader — each physical line is still one whole JSON object, and reduce-by-id keys only on the top-level `id`. Never pretty-print a record across multiple physical lines.

## Subcommands

### 1. `add` (default) — log a wager

**Trigger:** the args do not start with `list`, `resolve`, or `score`.

**Two input modes:**

**A. Canonical form:** `/predict [<predictor-prefix>] <claim> @ <prob> by <date> [--stake <points>] [--side yes|no] [--line <spec>] [--on <question_id>] [#<topic>]`

**B. Loose / natural-language form:** any free-text input. The assistant extracts `claim`, `probability`, and `resolves_at` heuristically, then proceeds to the confirmation discipline below. Examples that should parse:
- `/predict acho 70% que o Brasil ganha a copa em 2026`
- `/predict probably ships before Q3 — call it 60%`
- `/predict GPT-5 lands this year, 55%`

If the loose parser cannot extract one of (claim, probability, date) deterministically, ask one consolidated question naming what's missing. Probability MAY be missing (use 0.5 as a flag to ask) but date MUST be requested if absent — a wager without a resolution horizon is not a wager.

**Predictor prefix (strict to avoid claim-word collisions):** the predictor is `user` by default. Override **only** when the args begin with one of:
- `as <name>` — predictor is `<name>` (free-form).
- `assistant:` (with colon) — predictor is `assistant`.
- `user:` (with colon) — predictor is `user` (explicit).

A bare leading word like `user` or `assistant` without colon is part of the claim, not a predictor prefix.

**Parsing (canonical form):**
- `claim` = text between the predictor prefix (if any) and `@`.
- `prob` = float after `@`. Accept `0.7`, `70%`, or `70` (treated as percent only if `> 1`; `1` stays `1.0`).
- `date` = ISO date after `by`. Resolve relative dates (`next Friday`, `in 2 weeks`) against the current UTC date at the time of `add`. If the parser cannot produce `YYYY-MM-DD` deterministically, ask.
- `--stake <points>` (optional, float `>= 0`, default `0`; negative clamps to `0`).
- `--side yes|no` (optional, default `yes`).
- `--line <spec>` (optional, default `verdade`). `spec` is one of:
  - `verdade` — pure prediction (the default).
  - `casa` — fixed baseline, `p` defaults to `0.5`; or `casa=<p>` to set the baseline prob of YES.
  - `mercado=<p>` — external market price (prob of YES). Bare `mercado` (no `=<p>`) is unparseable.
  - `oponente` — bet vs the counterparty on the question given by `--on <question_id>`; or `oponente=<question_id>` to name the counterparty question explicitly. **At append** (step 4 below, after confirmation), **snapshot** the counterparty's price: find the latest physical line under that `question_id` whose `predictor` differs from this row's predictor, and store its `probability` as `q_snapshot` and its `id` as `counterparty_id` (provenance only — records which row was priced; settlement reads `q_snapshot`, never `counterparty_id`). The value echoed at parse is a **preview**, re-read at append. If no such counterparty row exists, the bet cannot be priced → fall back to `verdade` with a warning (the confirmation step surfaces this before logging).
  - An unparseable line spec (including bare `mercado`, or `oponente` with no `--on` and no `=<qid>`) falls back to `verdade` with a warning.
- `--on <question_id>` (optional): attach this wager to an existing question. The new row gets its own fresh `id` but inherits the given `question_id`. (Also supplies the counterparty for `--line oponente`.)
- `#<topic>` (optional): dense kebab-case tag, e.g. `#fractal-symmetry-tower`.

If any of `claim`, `prob`, `date` is missing or unparseable, **ask one consolidated question** listing what's missing. Do not log until all three are present. `stake` / `side` / `line` never block logging — they always have defaults.

**Resolution criteria:** after parsing, ask once: *"What counts as a yes? (Optional — press enter to skip.)"* Store the answer (or `""`) in `resolution_criteria`.

**Confirmation discipline (load-bearing):** the assistant **never auto-logs**. It emits the parsed record and **STOPS**. The append happens only after the user replies `y` or `yes` in a **subsequent turn**. Do not bundle parse + confirm + append in one turn. This applies even when the predictor is `assistant`, and even when `stake`/`side`/`line` are present.

**Append (only after explicit y/yes in a later turn):**
1. `mkdir -p ~/.claude/skills/predict` and ensure the file exists.
2. Scan today's `id`s to compute next `NNN` (see Record shape).
3. Set `question_id` (either the `--on` value, or the new `id` for solo).
4. Build the JSON object (including `stake`, `side`, `line`, `payout: null`), serialize as a single line, append with a trailing newline.
5. Echo the assigned `id` (and `question_id` if different). If `stake > 0`, also echo the bet terms: stake, side, and the line.

**Example (pure prediction):**

```
/predict Brazil wins the 2026 World Cup @ 0.35 by 2026-07-19
→ Logged as p-2026-05-28-001.
```

**Example (turning a prediction into a bet via an `oponente` line):**

Suppose the user already has an open prediction `p-2026-06-07-002` (`probability 0.9`, "Victor conversa com o Smithe (até 2027-06-07)", `question_id p-2026-06-07-002`). The assistant disagrees and wants to back NO against the user's posted price, staking 10 points:

```
/predict assistant: Victor conversa com o Smithe (até 2027-06-07) @ 0.4 by 2027-06-07 --stake 10 --side no --line oponente --on p-2026-06-07-002
→ Parsed (NOT yet logged):
    predictor:  assistant
    claim:      Victor conversa com o Smithe (até 2027-06-07)
    probability:0.4        (drives Brier — assistant's own belief)
    stake:      10
    side:       no
    line:       oponente  (counterparty p-2026-06-07-002, q_snapshot 0.9 — user's price; preview, locked at append)
    resolves_at:2027-06-07
    question_id:p-2026-06-07-002
  Confirm? (y/n)
```

On `y` it appends as e.g. `p-2026-06-07-003` sharing `question_id p-2026-06-07-002`, with `line: {type:"oponente", question_id:"p-2026-06-07-002", counterparty_id:"p-2026-06-07-002", q_snapshot:0.9}`. At resolve: the assistant's Brier is scored on `0.4` vs the outcome (as always), AND a fixed-odds payout is computed against the snapshotted price `0.9` — backing NO is priced at `1 - 0.9 = 0.1`, a longshot, so if Smithe never talks the assistant wins big (`10*(1/0.1 - 1) = 90`). This is a payout vs the snapshot, not a shared pot — it does not net against the user's row.

### 2. `list` — show wagers

**Form:** `/predict list [open|resolved|all]` (default `open`).

**Behavior:**
1. Read the whole file.
2. Reduce by `id`, taking the last physical line per `id`.
3. Filter by `status` per the arg.
4. Print a table: `id  question_id  predictor  prob  stake  side  line  resolves_at  status  payout  claim` (truncate claim to 60 chars).
   - Apply back-compat defaults to absent fields before printing.
   - Show `stake`/`side`/`line`/`payout` only when meaningful (non-zero stake / non-`verdade` line); render `-` otherwise so pure predictions read clean.
   - Render `line` compactly: `-` for verdade, `casa:0.5`, `mercado:0.62`, `opp:<qid>` for oponente.

### 3. `resolve` — resolve a wager (Brier + payout)

**Form:** `/predict resolve <id> <yes|no|void>`

**Behavior:**
1. Read the file. Reduce by `id` taking the last physical line.
2. If `id` not found, error.
3. If the latest row for `id` already has `status: "resolved"` or `status: "void"`, **ask for confirmation**: *"This wager was already resolved as `<prior>`. Append a new resolution as `<new>`? (y/n)"*. On `n`, abort.
4. **Brier / log_score (unchanged — always on `probability`):** compute only when outcome is `yes` or `no`:
   - Let `o = 1 if outcome == "yes" else 0`, `p = probability` (clamped to `[1e-9, 1-1e-9]`).
   - `brier = (p - o) ** 2`
   - `log_score = -log(p) if o == 1 else -log(1 - p)`
   - For `void`, set both scores to `null`; void rows are excluded from `/predict score`.
5. **Payout (additive — the new settlement step):** apply back-compat defaults first.
   - If `outcome == "void"` OR `stake <= 0` OR `line.type == "verdade"`: `payout = null`. (Done — for `verdade` with a non-zero stake, the stake is simply ignored: the reference is the truth, there is no counterparty to pay.)
   - Else compute `b` = the line's probability that the **backed side** wins:
     - **casa:** `q = line.p` (prob of YES), defaulting to `0.5` if absent.
     - **mercado:** `q = line.p` (prob of YES). If `line.p` is absent, the line is malformed: set `payout = null` and warn once (*"mercado line has no price; payout skipped, Brier still recorded"*). Do NOT invent a market default.
     - **oponente:** `q = line.q_snapshot` — the counterparty's price captured at log time (prob of YES). **No live lookup at resolve**, so the counterparty cannot shade the line after the bet was placed. If `q_snapshot` is absent (legacy/malformed line), set `payout = null` and warn once (*"oponente line has no snapshot; payout skipped, Brier still recorded"*). Brier is still computed normally.
     - For the priced lines, `b = q if side == "yes" else 1 - q`. Clamp `b` to `[1e-9, 1-1e-9]` (reuse the existing clamp) **after** the side flip and **before** `1/b`.
   - Settle:
     - Backed side **wins** (`side == "yes" and outcome == "yes"` OR `side == "no" and outcome == "no"`): `payout = stake * (1 / b - 1)` (NET winnings).
     - Backed side **loses**: `payout = -stake`.

   Pseudocode:
   ```python
   def settle(stake, side, line, outcome):
       if outcome == "void" or stake <= 0 or line["type"] == "verdade":
           return None
       if line["type"] == "casa":
           q = line.get("p", 0.5)                  # prob of YES per the line
       elif line["type"] == "mercado":
           if "p" not in line:
               warn("mercado line has no price; payout skipped, Brier still recorded")
               return None
           q = line["p"]
       elif line["type"] == "oponente":
           if "q_snapshot" not in line:
               warn("oponente line has no snapshot; payout skipped, Brier still recorded")
               return None
           q = line["q_snapshot"]                  # counterparty price, snapshotted at log time
       else:
           return None
       b = q if side == "yes" else 1 - q           # line prob the BACKED side wins
       b = min(max(b, 1e-9), 1 - 1e-9)             # clamp after side flip, before 1/b
       won = (side == "yes" and outcome == "yes") or (side == "no" and outcome == "no")
       return stake * (1 / b - 1) if won else -stake
   ```
   This is incentive-compatible because `b` is **exogenous** — it is NEVER derived from this row's own `probability`. A fair bet (`b = q_true`) has expected value exactly 0; a `casa` line at `p=0.5` gives even money (net `+stake` on a win); only extreme exogenous lines yield jackpots. A correct longshot is bounded by the clamp: `b=0.01, stake=1` → win `payout = 99`. For `oponente`, the price is snapshotted at log time, so the counterparty cannot move their line before resolution to shade your odds. Payout is **fixed-odds vs that snapshot** (settled like a sportsbook), not a conserved pot — two predictors' payouts on the same question do not sum to zero.
6. Build a new JSON line. Copy non-status fields (`predictor`, `claim`, `probability`, `stake`, `side`, `line`, `resolves_at`, `resolution_criteria`, `created_at`, `question_id`) from the **creation row** (first physical row with that `id`), not from any prior resolution row. Add:
   - `status: "resolved"` (or `"void"`)
   - `resolved_at: <now ISO-8601 UTC>`
   - `outcome: "yes"|"no"|"void"`
   - `brier`, `log_score`
   - `payout`
7. Append the new line. Echo the score, and the payout when non-null. (Re-resolution appends a fresh line; reduce-by-last-line means only the final payout counts in the ledger.)

**Resolution-criteria warning:** if the creation row's `resolution_criteria` is empty **and** the new outcome is `yes` or `no`, warn once: *"Heads-up: no resolution criteria was recorded at creation."* **Skip the warning when outcome is `void`** — void resolutions are noisy enough.

**Example:**

```
/predict resolve p-2026-05-28-001 no
→ Appended resolution for p-2026-05-28-001. outcome: no, brier: 0.1225
```

```
/predict resolve p-2026-06-07-003 no
→ Appended resolution for p-2026-06-07-003. outcome: no, brier: 0.16
  Payout (assistant, side no vs oponente line 0.10): +90.00
```

### 4. `score` — Brier leaderboard + payout ledger

**Form:** `/predict score`

**Behavior (Brier — byte-for-byte unchanged):**
1. Read the file. Reduce by `id` taking the last physical line. Keep only rows with `status == "resolved"` and `outcome ∈ {"yes","no"}`.
2. If `log_score` is null on a resolved row, recompute from `probability` and `outcome` at read time (do not write back — append-only).
3. Group by `predictor`. For each group, compute mean Brier and count.
4. Print one line per predictor, sorted by Brier ascending (lower is better).
5. **Head-to-head:** group rows by `question_id`. For every `question_id` that has at least one `user` row and at least one `assistant` row (take each predictor's **latest resolved** row for that `question_id`), include it in the head-to-head set. If the set is non-empty, print user Brier, assistant Brier on that subset, and the gap.
6. `log_score` is computed but **not surfaced** in default output.

If only one of `user` / `assistant` has resolved predictions, omit the head-to-head block.

**Behavior (Payout ledger — SEPARATE, never fused into Brier):**
7. Over the same resolved, non-void reduced rows, sum `payout` per predictor (treat `null`/absent as `0`).
8. Show this block **only if** at least one row has non-zero `stake`. Print cumulative payout per predictor, sorted by payout descending. Never merge payout into the Brier ranking — they are two independent ledgers (belief accuracy vs money).

**Example:**

```
/predict score
→ Belief accuracy (Brier — lower is better; can't be gamed):
    assistant   0.182   (n=11)
    user        0.214   (n=14)
  Head-to-head on 6 shared questions: user 0.241, assistant 0.193 (gap 0.048).

  Points (payout vs the lines you took — higher is better; includes luck + line selection):
    assistant   +90.00
    user        -10.00
```

## Retro extraction (kind: "retro")

A second class of entry: predictions extracted **in retrospect** by scanning past conversation sessions. These are not typed by the user — they are written by a scanner process that reads session JSONL files and identifies falsifiable claims with stated or inferable confidence.

**Provenance contract:** every `retro` row MUST populate:
- `kind: "retro"`
- `extraction_date`: ISO-8601 UTC of the scan
- `source_session`: path or identifier of the session JSONL the claim was extracted from
- `topic`: dense kebab-case tag
- `confidence` is recorded in `probability` if expressible numerically; otherwise the scanner maps "high/medium/low" hedge language to `0.85 / 0.6 / 0.3` and records the original phrase in `notes`.
- `predictor`: who said it (`user` or `assistant`).
- `outcome`: `"yes"` / `"no"` / `null` if not resolved in the source session.
- `status`: `"resolved"` if outcome is known; else `"open"`.
- `resolves_at`: best-effort date if the claim has one; else `null`.

Retro rows are always pure predictions: the scanner leaves `stake`, `side`, `line`, `payout` at their defaults (a retro is a belief vs truth, never a bet). They participate in `/predict score`'s Brier exactly like live rows, and never in the payout ledger. No scanner change is required for the wager upgrade.

**Who writes retro rows:** the scanner agents, never `/predict add`. The skill does not expose a typing path to create retro rows.

## Out of scope (do not implement)

- No `due` subcommand. (Eyeball dates in `/predict list open`.)
- No calibration plot or probability buckets.
- No streaks, badges, ELO.
- No multi-outcome (>2) questions.
- No continuous / point-estimate scoring.
- No tag filtering, search, or export.
- No `--predictor` filtering on `list` or `score` in v1.
- No `notes` arg on `resolve` in v1 (the `notes` field exists in the schema for future use; no MVP subcommand writes it).
- No validation gates on `probability ∈ [0,1]`, `stake >= 0`, or `resolves_at` — write defensively (clamp where needed) but never refuse to log.
- No multi-leg parlays / combined bets — one claim per row, one line per row.
- No conserved/zero-sum pot for `oponente` — it is a **fixed-odds bet against a price snapshot**, settled like a sportsbook; payouts across predictors do not sum to zero. True matched-pot escrow is deliberately out of scope for a points toy.
- No over/under or continuous thresholds — phrase as a binary claim (`X > T`). No conditional-bet field — resolve `void` if the condition fails.
- No bankroll, balance enforcement, or Kelly sizing — `stake` is free-form points; payout can go negative without limit.
- No live odds feeds — `mercado` / `casa` prices are whatever the user types at `add` time; never auto-fetched.
- No `payout_model` field — `line.type` is the only model selector.
- No cross-project visibility — the file lives in one place.
