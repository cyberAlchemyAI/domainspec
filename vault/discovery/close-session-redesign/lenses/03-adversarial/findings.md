---
tags: [vault, lens-findings, close-session-redesign]
node_type: findings
is_session: false
layer: ontology
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-17
dispatch_status: historical
retrofits: true
synthesized-by: ../../research/research.md
backfilled: true
---

# Findings — Adversarial Analysis

## Objective

Stress-test the two-layer Record→Reckon design for the failure modes a prose-shaped LLM agent will reach for, and identify which defenses actually bind vs which only look strict.

## Headline claim

The load-bearing failure mode is **judgment laundering through structured-record fields**: every Layer 1 field requires a micro-judgment to populate, and the agent's prose instinct routes narrative into Layer 1 field *values*, then points at the bloated Layer 1 as evidence for confident Layer 2 verdicts. Line caps constrain length, not semantic inflation. After ~30 sessions the vault accumulates a parallel uncompressed knowledge channel that looks structured and therefore evades audit.

## Failure modes catalogued

1. **Narrative smuggled into Layer 1.** Free-text in `premises_tested` value slots; line cap doesn't trip. Fix: per-field char cap (≤80), fixed `<path> | <verdict>` grammar.
2. **`record_budget: auto` inflation.** Read-as-touch, premise-name-drop, experiment-of-an-`ls`, branch padding. Fix: narrow signal source (distinct files written + premises whose status flipped); falsifiable inclusion rules per field; periodic audit pass.
3. **10-line Reckon evasion.** One 800-char line; semicolons-not-newlines; thesis embedded in filenames; cross-reference avalanche. Fix: char-AND-line cap; forbid free-text in `routed_to`; fixed grammar on `verdict`.
4. **Human-override cascade.** First override is legitimate; precedent normalizes; cap silently becomes a floor. Fix: no mid-session override; separate `promote-session-to-essay` skill writing to a different folder.
5. **Early-exit breaks both ways.** Activity-based trigger discards real Q&A verdicts and rubber-stamps tool-heavy non-decisions. Fix: gate on activity AND a semantic question — "did this session produce a status change?"
6. **Inter-skill seam leaks.** Folder-structure reorgs inflate `files_touched`; brainstorming sessions trip both false-positive early-exit and budget bloat. Fix: per-skill manifest declaring whether writes are session-attributable; `close-brainstorm` as its own skill.
7. **Un-falsifiable objective terms.** "Compression," "emergence," "signpost" carry no operational metric. Fix: crude proxies (compression = premises retired per axiom promoted); ban "emergence" from notes; require every signpost to point at a pre-existing artifact.
8. **100-session drift patterns.** Field-name drift, optional-field accretion, session-as-premise substitution, verdict template ossification, backfill rot. Fix: strict JSON schema + validator + amendments log + append-only enforcement + `audit-vault` skill.

## Caveats

- All proposed fixes presume infra (JSON validator, linter, audit-vault skill, separate override skill) the solo dev will not build.
- "Judgment laundering" is a prediction; no session corpus exists yet to confirm it.

## Open Questions

- Right enforcement layer: skill prompt, post-write linter, schema validator — which is load-bearing?
- Can `record_budget` be replaced by a fixed cap (say 5) on the theory that no honest session needs more?
- Cadence and form of the `audit-vault` skill.
- Should the objective itself be rewritten to remove "emergence"?

## Connections

- `derives-from` → `../../discovery.md`
- `derives-from` → `../../research/research.md`
