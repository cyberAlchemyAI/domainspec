---
tags: [vault, lens-findings, close-session-redesign, meta-lens]
node_type: findings
is_session: false
layer: ontology
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-17
dispatch_status: historical
retrofits: true
lens_order: second
synthesized-by: ../../research/research.md
backfilled: true
---

# Findings — Meta-Lens B: Gap Analysis

> **Lens order: second.** Meta-lens from the original evaluate wave; consolidated upstream in `../../research/research.md`. Preserved verbatim here as the historical record.


## Gaps the objective demands but no lens fills

1. **"Auditable both directions" never operationalized.** No lens specifies the actual grep/yq recipes that constitute a forward or backward audit. Without named commands, "auditable" is a claim the design cannot be held to.
2. **No definition of session boundary.** All lenses presuppose a session is a well-defined unit. When does it start? Does `/clear` end it? Is a 3-hour gap one or two? The skill must answer.
3. **No "this session is not closeable" path.** Lens 03 flags the false-positive case; nobody specifies a `defer-close` route. Without it, the skill produces confidently-wrong signposts on tangled sessions.
4. **Provenance for the close-session run itself.** The sentinel proves write-order, not write-quality. Who audits the auditor?
5. **"One step of distillation" has no per-session check.** Lens 04's ER is vault-level. Reckon's tree says where to put content, not whether distillation happened.
6. **No cold-start story.** Day 1 of football-stats-oracle's vault has no premises to refute, no axioms to walk back from. ER is `0/0`. Gates B, F, the promotion-corroboration check are all degenerate. The skill needs a bootstrap mode.
7. **The Layer 1 / Layer 2 boundary check.** Each lens enforces it in isolation; nobody composes a single post-write check that says "the split held."

## First-use walkthrough — what's missing

Realistic invocation: 90-min session, edited an xG calibration script, ran one backtest, speculated about home/away asymmetry. Types `/close-session`.

Gaps the walkthrough surfaces:
- Per-file `semantic` decision requires the agent to read every diff. At 40 files this explodes the close-session run itself.
- The strict-order routing tree (Lens 02) has no tiebreaker when the same artifact fires two gates (backtest = experiment? or evidence for a candidate premise?).
- Output path is ambiguous between `domain_knowledge/sessions/` (baseline) and `vault/sessions/` (Lens 04's domainspec convention).
- No specified post-write user action. Signposts nobody reads are sediment.
- No day-1 cold-start mode.

## Skill-as-prompt-text — unspecified requirements

The skill is a SKILL.md the LLM reads. None of the lenses draft prompt text. The prompt must contain:

- **Literal sentinel string** and the "do not edit above" instruction.
- **Verbatim refusal table** as a lookup, not paraphrased.
- **Routing tree as a walked-aloud decision** (`Gate A: <fired|skipped because…>`) so `reckon_gates_fired:` is honest.
- **Per-field character caps** (≤80 chars) embedded as prompt rule.
- **"I cannot close this session" output** — a legitimate exit (`CLOSE_DEFERRED: <reason>`).
- **Forbidden top-level keys** enumerated (no `confidence:`, no `importance:`, no `summary:`).
- **Cold-start clause** for empty vaults.
- **Audit recipe** embedded as a footer in every note.

## Scale-fit for football-stats-oracle

Solo-dev, 2 skills, no curator, no edge catalog. Specific overshoots:

- `schema_version:` + `vault/migrations/v*-to-v*.py`: defer until N≥50 sessions.
- Bidirectional discovery↔session link maintained by a curator agent that does not exist: drop or downgrade to manual.
- 7-gate routing tree assumes vault rich enough to have constitution candidates. First quarter, only Gates A/C/G will fire.
- Per-field 80-char cap enforced by a non-existent post-write linter.
- ER walker: out of scope ≥6 months.
- JSON validator, append-only enforcement, `audit-vault` skill: all presume infra that doesn't exist.

Right shape: **ship the discipline, defer the tooling with named placeholders.**

## Honest defers that are actually load-bearing

These cannot be silently deferred — the SKILL.md must name them at the top:

1. Drift goes undetected without a periodic audit pass; if >30 sessions without re-reading the most recent 5 by eye, assume drift.
2. Retirement-replacement cooling period has no enforcement; skill must at minimum check via `git log` of recent sessions.
3. Q&A-vs-decision boundary is intrinsically fuzzy; the yes/no "did this session produce a status change?" question must be required, not optional.
4. "Compression" and "emergence" are undefined without ER tooling; the skill must at least name where the operational definition lives.
5. Nobody reviews promotion candidates in football-stats-oracle; the `promotion_candidate: true` flag is write-only by default.
6. Multiple scratchpads must trigger explicit refusal, not guess.
7. Slug collision policy must be specified, even trivially.

## Connections

- `derives-from` → `../../discovery.md`
- `derives-from` → `../../research/research.md`
- `derives-from` → `../01-record-layer-mechanics/findings.md`
- `derives-from` → `../02-reckon-layer-discipline/findings.md`
- `derives-from` → `../03-adversarial/findings.md`
- `derives-from` → `../04-cross-skill-continuity/findings.md`
