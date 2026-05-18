# Meta-Lens C — Adversarial Review

## Weakest proposal

**Lens 04's "kernel + per-repo adapter shim + sync skill + Emergence Ratio walker."** The solo dev has exactly one repo where close-session matters right now. The kernel/adapter pattern, `repo:` field, monthly sync skill, migrations dir, and ER walker all design for a fleet that does not exist. First real session: agent dutifully writes `schema_version: 1`, `layer: instance`, `repo: football-stats-oracle`; nothing reads any of them; no curator exists to maintain the bidirectional discovery edge; ER is `0/0` for at least 6 months. The proposal optimizes for a future that hasn't been committed to, at the cost of every present session.

## Most over-engineered

**Lens 03's "strict JSON schema + post-write linter + amendments log + audit-vault skill + per-field char caps + falsifiable inclusion rules."** Diagnosis is the most accurate of the four. Fixes are sized for a team with a platform engineer. Solo dev will not write the linter, will not write the audit skill, will not switch frontmatter from human-readable YAML to JSON, will not maintain a separate `promote-session-to-essay` skill. The first override request will be handled by editing the file by hand, breaking every invariant.

## Most likely to be ignored

Two rules, both from Lens 02:

1. **Reckon hard-refuses at line 11 with narrative-marker diagnostics.** Workaround within a month: agent compresses two pointer-lines into one semicolon-joined line, or pushes surplus into Layer 1 field values. The cap holds numerically while the discipline rots. The UX cliff (failed write, redo) accelerates the workaround.

2. **Cooling period: retirement and replacement cannot live in the same session.** Correct in spirit, intolerable in practice. Most common real flow: "I just disproved X; the obvious replacement is Y; let me capture both while fresh." Forcing a second session adds a tax precisely when working memory is loaded. Within a month, the cooling period exists only as a paragraph.

## Fixed-point: walking through a real session

Wednesday evening session: refutes `premise/finishing-skill-persistence.md` (r=0.11), notices `shot-location entropy` looks like the better candidate. Layer 1 records `candidate_premises: ["shot-location entropy..."]`. Layer 2 walks the gate tree: Gate B fires (refutation). Strict-order: B wins, stop.

**Where the prescriptions fight:**

- Lens 02 says Gate B alone fires. But Layer 1 already encoded the candidate. Layer 1 says "1 candidate premise"; Layer 2 says "Gate B only, route to retirement"; the candidate is orphaned. Auditable-both-directions just failed.
- Cooling period forbids the replacement premise this session. Layer 1's candidate string isn't a premise file — but a future reader cannot tell the difference.
- Agent inflates the `why_now` field to capture the genuine insight. Lens 02 specs ≤140 chars; no enforcement. Thesis lives in the field value.
- If Layer 1 inflated `experiments_run` to include navigation commands, Gate E fires spuriously, generating a real `experiment/<slug>/README.md`. The gate tree believed Layer 1's count.

After session 1, dev edits Layer 2 by hand, breaking the sentinel invariant. Freeze rule's structural guarantee: gone.

## Minimum viable skill (~5 rules)

The irreducible kernel for solo-dev, sole-reader scale:

1. **One file per session, fixed filename** `YYYY-MM-DD-HHMM-<slug>.md` under `domain_knowledge/sessions/`. Filename is the schema commitment.

2. **Frontmatter contains exactly five fields, all required:** `created`, `files_touched` (paths, no annotations), `premise_tests` (list of `<path>: supported|refuted|inconclusive` or empty), `candidate_premises` (strings ≤120 chars, max 3, or empty), `artifacts` (folder paths or empty). No version, layer, repo, parent_session, gates_fired, evidence_stage.

3. **Body ≤15 lines, written after frontmatter, fixed shape:** one line per `premise_tests` naming the evidence pointer; one line per `candidate_premises` saying why-now; one line per `artifacts` saying what it is. No "Summary," no headings. Empty body is correct if there is nothing to say in this shape.

4. **One refusal, one flag, no promotions, no auto-edits.** Skill never writes to `premise/`, `constitution/`, or any vault folder. Retirement-as-flag and promotion-as-flag both collapse to "the session note mentions it; human decides."

5. **Triage: if all of `files_touched`, `premise_tests`, `candidate_premises` are empty → no note. Delete the scratchpad, exit.** Only judgment call, binary.

Every additional rule from the four lenses must justify itself by naming a specific reader that needs it *today*.
