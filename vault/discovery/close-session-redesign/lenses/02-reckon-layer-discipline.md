# Lens 02 — Reckon Layer Discipline

## Claim

Layer 2 (Reckon) is not a summary layer — it is a **routing layer**. Its single job is to decide *where the session's epistemic content belongs in the compression pipeline*, and to emit the minimal signals (frontmatter fields, one-line rationales, refusal phrases) that let that routing happen without corrupting the vault. The 10-line cap is not an aesthetic preference; it is the structural guarantee that Reckon cannot become a parallel knowledge channel. Corruption of the vault almost always takes the form of *the session note swelling into a discovery* — narrative accumulating where only a pointer should sit. The discipline must therefore make the cheap path (route + link) easier than the expensive path (narrate in place), refuse the common human asks that pull toward narration, and treat promotion/retirement as *flagging* operations only, never as autonomous edits to the compressed layer. Reckon writes pointers, not prose.

## Design

### 1. The routing decision

Reckon executes a **strict-order decision tree**. The first gate that fires wins; the session note then records *only* the routing decision and a one-line rationale. The agent must walk the tree top-to-bottom — no skipping, no "well it's kind of both."

```
Reckon routing tree (evaluate top-down, stop at first match)
───────────────────────────────────────────────────────────────
Gate A — Nothing epistemic happened
  Trigger: session was pure tooling, config, debugging of infra,
           or work that produced no claim about the domain.
  Route:   stay in session note. Reckon body: "no epistemic
           output" (literal phrase). routed_to: [].

Gate B — Refutation of an existing premise/axiom
  Trigger: session produced evidence that contradicts a file in
           premise/, constitution/, or an axiom.
  Route:   write retires: [<path>] in frontmatter. Body of
           Reckon: one line naming the contradicting evidence
           and its location in the Record layer. Do NOT edit
           the retired file. Do NOT write a new premise yet.

Gate C — ≥1 testable claim with no existing premise file
  Trigger: session surfaced a claim of the form "X causes Y" /
           "X correlates with Y under Z" / "X is measurable via
           M" that is not already captured.
  Route:   write premise/<slug>.md (minimal: claim, falsifier,
           one evidence pointer). Session note records
           candidate_premises: [<slug>] and a one-line "why now".

Gate D — Multi-step argument OR multi-source synthesis
  Trigger: the session's value is in the *chain* (A→B→C) or in
           the *reconciliation* of ≥2 sources/datasets/models.
  Route:   discovery/<slug>/README.md. Session note carries
           routed_to: [discovery/<slug>] and nothing else from
           the argument itself.

Gate E — Reproducible procedure with measurable output
  Trigger: session defined a procedure that, run again, would
           produce comparable output (a backtest, a query, a
           scrape, a calibration).
  Route:   experiment/<slug>/README.md. Session links.

Gate F — A rule the future-agent must obey
  Trigger: session produced a constraint on how future work is
           done (naming, methodology, what counts as evidence).
  Route:   constitution/<slug>.md. Session links. This gate is
           rare; if Reckon fires it more than once per ~20
           sessions, the agent is over-constitutionalizing.

Gate G — None of the above but something was learned
  Route:   stay in session note. One line in Reckon. This is
           the correct outcome for most sessions.
```

**Hard rule:** Gates B–F all produce a *new or modified file outside the session note*. The session note then contains only frontmatter pointers and a one-line rationale per route. The Reckon body never restates the routed content.

### 2. Refusal patterns

The skill ships with literal refusal strings. When the human (or the agent's own drift) asks for a behavior in the left column, the agent emits the right column verbatim and stops.

| Anti-pattern (what the human asks)                                              | Refusal (verbatim)                                                                                                                            |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| "This was an important session, make the close-session note longer."            | "Important sessions write to `discovery/`. The session note links to them. Reckon stays at ten lines."                                        |
| "Summarize what we learned in the session note so I don't have to click in."    | "The session note is a signpost, not a summary. If a summary is needed, it lives in the routed file. I will add the link."                    |
| "Add the reasoning chain to the Reckon section."                                | "Multi-step reasoning routes to `discovery/`. Reckon records the route, not the chain."                                                       |
| "Just promote that premise to a constitution, it's obviously true."             | "Promotion is not a close-session action. I will set `promotion_candidate: true` with a one-line rationale. Promotion happens out of band."   |
| "We disproved premise X today, delete it."                                      | "Retirement is flagging, not deletion. I will set `retires: [premise/X.md]` and record the contradicting evidence pointer. The file stays."   |
| "Write a new constitution rule from this session."                              | "Constitution writes are rare and reviewed. I will record `candidate_constitution:` with the proposed rule in one line. No file is created."  |

Refusals are not advice — the skill instructs the agent to emit the string and proceed to the next gate without negotiation. A refusal *is* a successful Reckon outcome.

### 3. Promotion handling

Promotion = a premise has accumulated enough corroboration to be considered for the constitution or axiom layer. Reckon **never** performs a promotion. It signals one.

A session sets `promotion_candidate: true` on a *premise file* (not the session note) iff **all** of:

1. The premise file already exists (was not created this session).
2. The session added a new, independent evidence pointer (different source, dataset, method, or season than any prior pointer in the file).
3. The premise has ≥3 distinct evidence pointers *including* the one added this session.
4. No `retires:` field has ever targeted this premise.

The signaling format, written into the premise file's frontmatter:

```yaml
promotion_candidate: true
promotion_rationale: "3rd independent corroboration (2024 La Liga xG vs shot quality); no counter-evidence in 18mo."
promotion_flagged_by: session/2026-05-16-shot-quality-replication.md
promotion_flagged_on: 2026-05-16
```

The `promotion_rationale` is **one line, ≤140 chars**. If the agent cannot compress the rationale to one line, the premise is not a candidate — it is a discovery in disguise.

Candidate vs not, in one sentence: **a candidate is a premise whose evidence pattern is now boring** (replicates cleanly across independent settings). Premises that are *exciting* — surprising new corroborations, contested interpretations — are not candidates; they route to `discovery/`.

### 4. Retirement handling

Retirement = a premise is contradicted by evidence the session produced or surfaced. Same shape as promotion: flag, do not act.

Threshold for setting `retires:`:

1. The contradicting evidence is recorded in the **Record** layer of this session (so it is reproducible from the signpost).
2. The contradiction is *direct* — it falsifies the premise as stated, not a neighboring claim. If the agent has to reword the premise to make it falsified, route to `discovery/` instead and explain the mismatch there.
3. A single clean contradiction is sufficient to flag. Retirement does not require accumulation the way promotion does — premises are meant to be falsifiable, and one good falsification is the point.

The retired premise file gets a tombstone block appended (not replacing existing content):

```yaml
---
# existing frontmatter preserved above
retired: true
retired_on: 2026-05-16
retired_by: session/2026-05-16-shot-quality-replication.md
retired_because: "2025-26 EPL sample shows no xG-shot-quality coupling at p<0.05; see Record §evidence."
superseded_by: null   # filled later if/when a replacement premise is written
---
```

The session note carries `retires: [premise/<slug>.md]` in its frontmatter and **one line** in Reckon body naming the evidence pointer. The session does not write the replacement premise in the same close-session run — that is a separate session's work, by design. This forces a cooling period between falsification and replacement, which is the cheapest defense against motivated reasoning.

### 5. The 10-line Reckon cap — why it holds, and what happens at line 11

**Structural justification.** Reckon outputs at most: (a) which gate fired, (b) the route target, (c) a one-line rationale per route, (d) any refusal strings emitted. Every one of these is a single line. A session can plausibly fire at most 2–3 gates (e.g., one retirement + one candidate premise + one discovery route). 10 lines is ~3× the realistic maximum, leaving headroom for refusals without leaving headroom for narrative. If Reckon needs more than 10 lines, the agent is writing prose where it should be writing pointers — i.e., it is *building the parallel uncompressed channel the vault is designed to prevent*.

**Enforcement (operational).** The skill enforces the cap in three escalating mechanisms:

1. **Pre-write check (warn).** Before writing the session note, the skill counts non-blank lines in the Reckon block. At 8–10 lines: warn the agent inline ("Reckon is at 9 lines; you are within budget but verify each line is a pointer, not prose.").
2. **At line 11 (refuse).** The write fails. The skill returns the error string: `"Reckon exceeded 10 lines. Re-run Reckon: route content out, leave pointers in."` The agent must redo Layer 2 — Layer 1 (Record) is preserved untouched.
3. **At line 11 with prose markers (hard refuse + diagnostic).** If the over-budget content contains markers of narration (sentences starting with "We then…", "This shows that…", "The reasoning is…", bullet lists >3 items, any heading inside Reckon), the skill refuses *and* names the anti-pattern: `"Reckon contains narrative markers (line N: 'We then...'). Narrative routes to discovery/. Re-run Reckon as pointers only."`

The cap is not a soft target; it is the load-bearing constraint of the layer. Without it, Reckon eats the vault.

### 6. Frontmatter schema for Reckon-layer fields

All Reckon-layer fields live in the **session note** frontmatter, except `promotion_candidate` / `retired` which live in the **target file's** frontmatter (because they are properties of that file, not of the session).

#### Session note frontmatter (Reckon block)

```yaml
---
# Record-layer fields (set by Layer 1) above this line
# ─── Reckon ───
routed_to:
  - discovery/shot-quality-replication        # one path per route
  - premise/xg-shot-quality-coupling.md
candidate_premises:                            # premises created this session
  - slug: xg-shot-quality-coupling
    why_now: "first time we have independent EPL+LaLiga samples in same model"
promotion_candidate: []                        # session-flagged promotions
  # entries reference premise paths the session flagged; details live in target
retires:                                       # premises this session contradicted
  - path: premise/finishing-skill-persistence.md
    evidence_pointer: "Record §evidence-3"
candidate_constitution: null                   # rare; one-line proposed rule or null
reckon_gates_fired: [C, D]                     # audit trail of which gates matched
---
```

Field-by-field:

- **`routed_to:`** — list of paths (relative to vault root). Empty list is valid and common (Gate A or G). Each path must exist on disk after the session write, or the skill refuses.
- **`candidate_premises:`** — list of objects with `slug` and `why_now` (≤140 chars). Only populated when Gate C fired. The premise file at `premise/<slug>.md` must exist after the write.
- **`promotion_candidate:`** — list of premise paths the session flagged for promotion. Empty in most sessions. The *rationale* lives in the premise file, not here, to avoid duplication.
- **`retires:`** — list of `{path, evidence_pointer}`. The `evidence_pointer` is a reference *into the Record layer of this same session note* (e.g., `"Record §evidence-3"`), so the falsification is reproducible from the signpost alone.
- **`candidate_constitution:`** — single string (one-line proposed rule) or `null`. Never a list — if a session is proposing multiple constitution rules, the agent is over-reaching and must re-run Reckon.
- **`reckon_gates_fired:`** — audit field. List of gate letters (A–G). Lets vault-wide queries find, e.g., all sessions that fired Gate B (retirements) in a quarter.

#### Target premise file (promotion flag)

```yaml
---
slug: xg-shot-quality-coupling
claim: "Team-level xG explains shot-quality variance after controlling for volume."
falsifier: "A season where shot-quality variance is independent of xG at p<0.05."
evidence:
  - {source: "fbref 2023-24 EPL", pointer: "session/2024-08-12-...md"}
  - {source: "fbref 2024-25 LaLiga", pointer: "session/2025-02-03-...md"}
  - {source: "statsbomb 2025-26 EPL", pointer: "session/2026-05-16-...md"}
promotion_candidate: true
promotion_rationale: "3rd independent corroboration; spans 2 leagues, 2 providers, 3 seasons."
promotion_flagged_by: session/2026-05-16-shot-quality-replication.md
promotion_flagged_on: 2026-05-16
---
```

#### Target premise file (retirement tombstone)

```yaml
---
slug: finishing-skill-persistence
claim: "Player-level finishing skill (G-xG) persists season-to-season at r>0.4."
falsifier: "A multi-season sample showing r<0.2."
evidence: [ ... preserved ... ]
retired: true
retired_on: 2026-05-16
retired_by: session/2026-05-16-shot-quality-replication.md
retired_because: "2020-2025 EPL sample (n=312 players, ≥1000 min) yields r=0.11."
superseded_by: null
---
```

## Evidence / Reasoning

**Why routing is the core output, not summary.** The shared objective frames the vault as a compression pipeline. Summary is *expansion in place* — it adds prose to the session layer, which is the layer farthest from the compressed core. Every line of summary in a session note is a line that the future agent must read, but that contributes nothing to the axiom layer. Routing, by contrast, pushes content toward the layer where it can be further compressed. A discipline that defaults to routing converts session activity into pipeline pressure; a discipline that defaults to summarizing converts session activity into sediment.

**Why the gates are strict-ordered and not a checklist.** A checklist invites the agent to fire multiple gates and write multiple routed files per session. In practice, sessions usually have one dominant epistemic shape. The strict order biases toward the *most compressive* available route (retirement > new premise > discovery > experiment > constitution > nothing), which matches the pipeline's direction of travel: prefer falsification, then crisp claims, then narrative, then procedure, then rule.

**Why refusals are verbatim strings.** The baseline relies on the agent's judgment to resist human pressure. Judgment is exactly what fails under pressure. Verbatim refusals turn a judgment call into a lookup: the agent matches the ask against the table and emits the string. This is the same logic as the two-layer split itself — mechanize what can be mechanized, reserve judgment for the irreducible cases (here: which gate fired).

**Why promotion and retirement are flag-only.** Auto-promotion would let a single session move a claim into the constitution layer, which is exactly the corruption mode the vault must prevent. Flag-only signaling preserves the auditable, slow-moving character of the compressed layers while still capturing the session's epistemic contribution. The asymmetry between promotion (needs ≥3 corroborations) and retirement (1 clean falsification) reflects Popperian logic: corroboration accumulates, falsification decides.

**Why the 10-line cap is hard, not soft.** A soft cap is a suggestion the agent will discount under any pressure to "explain more." A hard cap that *fails the write* converts the temptation to narrate into an immediate cost (redo the layer). The narrative-marker diagnostic at line 11 is the second-order defense: it catches the case where the agent stays under 10 lines but uses prose density to smuggle a discovery into the session note. Together, the cap and the marker check make the cheap path (route out, link in) strictly cheaper than the expensive path (narrate in place).

**Why Reckon fields live partly in the session note and partly in the target file.** Properties of the session (which gates fired, what was routed, why-now rationales) belong with the session. Properties of the premise (is it a promotion candidate, is it retired) belong with the premise — because future queries against the vault will ask "which premises are promotion candidates?" not "which sessions flagged promotions?" Splitting the schema this way makes vault-wide queries natural and prevents the session note from becoming a denormalized cache of premise state.

**Why the cooling period between retirement and replacement.** Writing the replacement premise in the same session as the retirement collapses falsification and reconstruction into a single creative act, which is where motivated reasoning lives. Forcing the replacement into a separate session means the falsification has to stand on its own for at least one session boundary before a new claim is built on its grave. This is cheap to enforce (just a skill rule) and structurally improves the falsification record.

## Open Questions

1. **Gate F (constitution) frequency calibration.** The lens claims "more than once per ~20 sessions is over-constitutionalizing" but does not specify how the skill measures or enforces this. Should the skill read recent session notes and refuse Gate F if the rate is exceeded, or is this purely advisory? A cross-session enforcement mechanism is outside this lens's scope.
2. **Interaction with the `record_budget` parameter.** If Layer 1 is allowed to be large (`record_budget: 500`), does that change the meaning of `evidence_pointer: "Record §evidence-3"` references? Long Records may need internal anchors/headings — but adding structure to Record is a different lens's problem.
3. **Multi-route sessions and ordering.** When two gates fire (e.g., B + C: a retirement *and* a new premise to replace it), the cooling-period rule forbids both in one session. But what if the new premise is genuinely independent of the retirement — same session, unrelated work? The strict-order tree does not distinguish "B then C as replacement" from "B and C in parallel." Resolving this likely needs a session-scope concept this lens does not define.
4. **Who reviews promotion candidates?** The lens specifies the flag but is silent on the out-of-band review process. Is it the user, a separate skill, a scheduled job? This is intentionally out of scope (Reckon must not promote), but the vault needs *some* mechanism downstream, and its shape may feed back into what `promotion_rationale` needs to contain.
5. **Slug collisions.** Gate C creates `premise/<slug>.md`. If the slug already exists but the claim differs, what happens? The skill needs a collision policy (refuse? suffix? force the agent to disambiguate?), which sits at the boundary between Reckon and the filesystem-mechanical Record layer.
6. **Refusal escalation.** If the human re-asks after a refusal ("no really, make the note longer"), the lens specifies the refusal string but not what happens on the second ask. Does the skill repeat the string, escalate, or eventually comply? The discipline probably wants "repeat verbatim, never comply," but this is a policy question the user should ratify.
