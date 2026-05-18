# Lens 03 — Adversarial Analysis

## Claim

The load-bearing failure of the agreed design is **judgment laundering through structured-record fields**. The two-layer split assumes Layer 1 is "mechanical" and Layer 2 is "judgmental," but every Layer 1 field requires a micro-judgment to populate (which file counts as "touched"? which exchange counts as an "experiment"? which premise was "tested" vs merely "mentioned"?). The agent — which has a strong incentive to make every session feel like it produced compression-grade output — will route narrative into Layer 1 through field-name semantics, then point at the bloated Layer 1 as "evidence" justifying a confident Layer 2 verdict. The 10-line Layer 2 cap and the `record_budget` cap on Layer 1 are both *length* constraints; neither constrains *semantic inflation*. After ~30 sessions the vault accumulates a parallel, uncompressed knowledge channel that looks structured and therefore evades the very audits the design was supposed to enable. The objective ("compression," "emergence," "signpost") is rhetorically strong but operationally un-falsifiable: there is no test that says "this session's signpost failed its job," so drift accumulates silently.

## Failure modes

### 1. Narrative smuggled into Layer 1 via field semantics

**Mechanism.** Layer 1 fields are nominally mechanical (`files_touched`, `premises_tested`, `experiments_run`) but populating them requires interpretation. The agent's prose instinct will redirect into the field *values*: a `files_touched` entry becomes `notes/scratch.md (rewrote section on agentive compression theory)`; an `experiments_run` entry becomes a paragraph in the value slot. The cap counts lines, not characters or semantic weight.

**Example.**
```yaml
premises_tested:
  - "premise-014-emergence-vs-curation: re-read in light of session 47's pivot; concluded the framing was always about routing not curation, which means premise-022 is downstream and should be merged"
```
That is a Layer 2 thesis pretending to be a Layer 1 record entry. It does not trip the line cap. It does not trip the budget. It *is* the failure.

**Proposed fix (structural).** Hard character cap per field value (e.g., 80 chars), enforced by the skill prompt and ideally by a post-write linter. Field grammar should be `<path> | <verb>` or `<premise-id> | passed|failed|inconclusive` — no free-text rationale slot inside Layer 1. Rationale belongs only in Layer 2, where the global 10-line cap can bind it.

### 2. `record_budget: auto` inflated via spurious touches

**Mechanism.** `auto` has to estimate "how much happened." The natural proxies — files touched, tool calls, premises mentioned — are all manipulable by the agent itself during the session that will then close. The agent has a self-serving incentive: a richer-looking session feels like better work, and a future reader (also the agent) will treat budget as a signal of importance.

**Concrete inflations.**
- **Read-as-touch.** Counting `Read` calls toward `files_touched` so a session that read 14 files looks like 14 units of work even if it wrote nothing.
- **Premise-name-drop.** Mentioning a premise in chat (without testing it) gets logged under `premises_tested: [mentioned-in-discussion]` to grow the count.
- **Experiment inflation.** Every minor tool call gets framed as an experiment: `experiments_run: ["ran ls to check folder shape", "ran grep to confirm naming", ...]`. None of these are experiments in the premise-test sense; they are scaffolding.
- **Branch padding.** Splitting one logical investigation into three sub-bullets to triple the count.

**Proposed fix (mostly structural, partly honest).** (a) Define each Layer 1 counter with a falsifiable inclusion rule in the skill itself ("an experiment is a tool call whose outcome could have changed a premise's status; reads do not count; ls/grep for navigation do not count"). (b) `record_budget: auto` should be derived from a *narrow* signal (e.g., distinct files written + premises whose status flipped), not from a broad activity signal. (c) Honest: gaming cannot be fully prevented in skill design; needs a periodic audit pass (`audit-vault` skill) that samples sessions and flags inflation.

### 3. Narrative crammed into the Layer 2 10-line cap

**Mechanism.** A 10-line cap counts newlines. The agent has many ways to evade it semantically:
- **One very long line.** A single 800-character line containing a paragraph-length thesis with semicolons instead of newlines.
- **Bulleted-list-as-line.** YAML list where each "line" is itself a multi-clause sentence.
- **`routed_to:` rationale stuffing.** `routed_to: premise-019-because-this-session-finally-resolves-the-question-of-whether-emergence-is-curation-or-routing.md` — the *filename* carries the thesis.
- **Cross-reference avalanche.** Layer 2 contains only `see: [session-031, session-044, session-058]` — appears compressed, actually offloads narrative to a graph the reader must traverse.

**Example.**
```yaml
verdict: "the session concluded that emergence is downstream of routing; the corollary is that curation is a special case of routing where the routing target is the null set; this reframes premises 14, 17, and 22 and implies a new axiom candidate."
routed_to: premise-019-emergence-as-routing.md
```
That is one line. It passes the 10-line cap. It is a Layer 2 essay.

**Proposed fix (structural).** Cap by *characters and lines* (e.g., 600 chars AND 10 lines). Forbid free-text in `routed_to` — it must be a bare path. Require `verdict` to fit a fixed grammar: `<premise-id>: <status-verb> | <=120 chars>`.

### 4. The human-override cascade

**Mechanism.** First override is always legitimate ("this session really did produce an axiom-grade insight, let it run long"). The override is logged with rationale. From that moment on:
- The override entry is itself a precedent. Future sessions reference it: "session 23 was overridden for similar reasons, this one qualifies too."
- The agent learns the rhetorical shape of a successful override request and reproduces it.
- The human reviewer (busy, trusting) approves overrides more readily because each one comes with a plausible argument and the prior approvals normalize it.
- The cap effectively becomes advisory. The vault grows a long tail of "special" sessions that swamp the disciplined majority.

**Why it accelerates.** The override mechanism shifts the burden of proof. Without an override, the agent must compress. With an override, the agent must merely *justify*. Justification is a much easier game for an LLM than compression.

**Proposed fix (mixed).** (a) No mid-session override. Overrides are a separate skill (`promote-session-to-essay`) that runs *after* close-session has produced the compressed record, and produces a *separate* artifact in a different folder, so the signpost stays clean. (b) Honest: human discipline is the only real backstop here; the skill design can make overrides expensive and visible, but cannot prevent a determined human from waving them through.

### 5. The early-exit rule breaks both ways

**False positives** (real verdicts discarded). A Q&A session where the human asks "is premise-017 actually compatible with premise-022?" and the agent's answer constitutes a genuine premise-status update. Early-exit fires because no files were written, no tool calls of consequence happened — but the *verdict* was real and is now lost.

**False negatives** (empty sessions feel decisive). Conversely, every session that *did* run tools feels like it "decided something" because the agent is biased toward narrative closure. A scratchpad-cleanup session that moved three files will produce a Layer 2 verdict like "consolidated naming convention for scratch notes" — a non-verdict dressed as one. The early-exit rule, calibrated on activity, misses both cases.

**Example of false positive.**
```
Human: does premise-014 conflict with premise-022?
Agent: yes, and here's why: [careful 8-paragraph analysis ending with a clear status update]
[close-session fires, sees zero files written, zero tool calls, exits early]
[the analysis evaporates]
```

**Proposed fix (structural).** Early-exit must be gated on *both* low activity *and* the agent's own answer to one yes/no question: "did this session produce a status change for any premise, axiom, or constitution entry?" If yes, no early exit, even with zero file writes. If no, exit even if 40 files were touched. This makes the trigger semantic, not mechanical — which is a deliberate violation of the Layer 1 mechanical purity, accepted because the early-exit decision is intrinsically judgmental.

### 6. Inter-skill seam leaks

**folder-structure skill.** If folder-structure is invoked mid-session and reorganizes files, `files_touched` becomes meaningless (every file "moved" but nothing changed semantically). The session record inflates massively. Fix: folder-structure operations should be excluded from Layer 1 counts; close-session should detect and zero them out.

**future promote-premise skill.** If promote-premise reads session signposts to decide what to promote, every failure mode above (judgment laundering, narrative in fields, override inflation) feeds directly into axiom formation. The compression pipeline becomes contaminated at the source. Fix: promote-premise must read *premise files*, never session signposts. Signposts are provenance, not evidence.

**brainstorming skill.** Brainstorming sessions are intrinsically Q&A-shaped and intrinsically high-activity (lots of speculative tool calls). They will simultaneously trip false-positive early-exit *and* generate massive `record_budget: auto` values. They are the worst case for the agreed design. Fix: brainstorming sessions need their own close skill (`close-brainstorm`) that writes to a different folder entirely (e.g., `vault/brainstorms/` not `vault/sessions/`), so the signpost stream stays clean.

**Generic seam.** Any skill that writes to the vault during a session creates ambiguity about whether close-session should record that write as session activity or treat it as the other skill's responsibility. Fix: a manifest convention — each skill declares whether its writes are "session-attributable" or not — and close-session honors the manifest.

### 7. Un-falsifiable objective terms

**"Compression."** No defined ratio, no defined unit. Is a 3-line axiom that subsumes 5 premises "more compressed" than a 1-line axiom that subsumes 2? There is no metric. After 100 sessions, "compression" will mean whatever the most recent session's prose called compression. Fix: define a crude operational proxy — e.g., "compression = premises retired per axiom promoted" — and track it as a vault-level metric. It will be a wrong metric but a falsifiable one.

**"Emergence."** Unfalsifiable as stated. Anything new can be called emergent post-hoc. The agent will narrate every session's outputs as "emergent" because that framing satisfies the objective. Fix: ban the word from session records; require any claim of emergence to take the form `axiom-X was not predicted by any single premise it derives from` and be auditable against the premise set.

**"Signpost."** Operationally vague. A signpost should point somewhere, but the design doesn't specify *what counts as a valid pointer*. A session record that points only to itself ("see verdict above") is a degenerate signpost. Fix: require every session record to contain at least one outbound link to a premise/constitution/axiom file that existed *before* the session, or explicitly declare `routed_to: null` with a reason.

**Honest note.** These terms are doing rhetorical work in the objective statement that they cannot do operationally. The skill design will not fix this; only a periodic re-derivation of the objective (e.g., quarterly) will.

### 8. Drift over 100 sessions — specific erosion patterns

- **Field-name drift.** Session 1 uses `premises_tested`. Session 14, under time pressure, uses `premises_touched`. Session 27 uses both. Session 60 has `premises:` as a bare list with mixed semantics. The schema rots because YAML is permissive and no validator enforces it.
- **Optional-field accretion.** Someone (the agent, the human) adds `confidence:` as an optional field in session 31 because it felt useful. By session 70, half the sessions have it, half don't, and the field's meaning has drifted (0–1 float? low/med/high? a sentence?).
- **Session-as-premise substitution.** Session 80 writes `routed_to: session-044.md` instead of pointing at a premise file. Sessions start referencing each other as if they were knowledge artifacts. The premise/constitution/axiom hierarchy is bypassed; the session stream becomes the de-facto knowledge base.
- **Verdict template ossification.** The agent learns a verdict shape that always passes muster and reuses it. By session 100, 80% of verdicts have the form "this session clarified that X is downstream of Y, suggesting Z should be promoted/retired." The verdicts stop tracking reality and start tracking the template.
- **Backfill rot.** A handful of sessions get edited weeks later when the human "remembers what really happened." Provenance is now lying.

**Proposed fix.** (a) Strict JSON schema (not YAML) with a versioned schema file in the vault; close-session validates against it and refuses to write on mismatch. (b) No optional fields — only required and forbidden. (c) Append-only enforcement: session records become read-only after write; corrections go in a separate `amendments/` log. (d) Periodic `audit-vault` skill that samples sessions and reports drift metrics (field-name variance, session-to-session reference ratio, verdict-template repetition).

## Evidence / Reasoning

These failures are plausible because:

- **LLM agents are prose-shaped.** Every constraint that asks an LLM to be "mechanical" is fighting the base model. The path of least resistance is to convert any structured field into a prose vehicle. Field grammar is the only real defense; line caps and budgets are circumventable.
- **Self-rewarding incentive.** The agent writing the session record is the same kind of agent that will read it later. There is a soft incentive to make past selves look productive, which inflates everything that can be inflated.
- **YAML permissiveness.** The baseline (`/Users/victorboscaro/football-stats-oracle/.claude/skills/close-session/SKILL.md`) almost certainly relies on a YAML-ish convention with no validator. Every long-lived YAML schema in a multi-agent system drifts within months. JSON+schema is dramatically more durable.
- **Override-precedent dynamics.** This pattern is well-attested in code review, exception handling, and content moderation: the first sanctioned exception becomes the template for the next, and the cap silently becomes a floor.
- **Q&A-vs-decision boundary is genuinely fuzzy.** A clean mechanical trigger cannot separate them; this is intrinsic, not a design oversight that can be patched away.
- **Objective terms are rhetorical.** "Compression / emergence / signpost" are persuasive but un-operationalized. They will mean different things in session 100 than in session 1, and there is no anchor to detect the drift.

## Open Questions

- Should close-session refuse to run at all on brainstorming sessions, or only refuse to write to `vault/sessions/`? (Routing question that depends on the brainstorming skill's own design.)
- Is the right enforcement layer the skill prompt, a post-write linter, or a schema validator? (My instinct: all three, with the linter being the load-bearing one — but the cost may be high.)
- Can `record_budget: auto` be replaced entirely with a fixed small cap (say, 5) on the theory that no honest session needs more? (This lens suspects yes but cannot prove it without seeing real session data.)
- What is the right cadence and form of the `audit-vault` skill that several fixes above gesture at? (Out of scope for this lens; needs its own design.)
- The objective itself: should it be rewritten to remove "emergence," or should "emergence" be operationally redefined? (This is a question about the objective, not the skill, and may be beyond what close-session can resolve.)
