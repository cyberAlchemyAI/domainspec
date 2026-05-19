---
tags: [vault, discovery, skill-design, close-session, provenance]
node_type: readme
is_session: false
layer: ontology
nature: skill-design
status: proposed
version: 0.1.1
last_updated: 2026-05-16
veracidade: medium
convicção: high
---

# Close-Session Redesign

## What is this?

Discovery folder for the redesign of the `close-session` skill in `football-stats-oracle`. Holds four propose-wave lenses, three evaluate-wave meta-lenses, and a proposed `SKILL.md` ready to replace the current baseline.

## Business Context

Sits inside the broader skill-design line of work. The skill in question lives in another repo (`football-stats-oracle/.claude/skills/close-session/`); this folder owns only the design rationale and the proposal artifact. The redesign's central design constraint comes from the vault's purpose: **the vault exists to represent knowledge in the most compressed form possible (axioms, fundamentals) and to let new knowledge emerge from that compression; close-session produces durable, low-cost provenance signposts — one per session — recording one step of distillation, auditable both directions, never a parallel knowledge channel.**

## Why it matters

The propose wave produced rich designs (7-gate routing trees, kernel/adapter shims across repos, JSON schema validators, Emergence Ratio walkers, character-grammar enforcement) — correct in spirit but assuming infrastructure the solo dev will not build. The discovery's job is to land a 5-field, append-only, body-≤15-lines signpost protocol that ships the discipline and defers the tooling with named placeholders. Without this redesign, the skill drifts into narration and the vault loses its compression discipline.

## 📁 Navigation

- [discovery.md](discovery.md) — The discovery commitments; the load-bearing artifact (v0.2.0).
- [research/research.md](research/research.md) — Cross-lens consolidation under the new convention (meta-lens-consolidation method).
- [research/research-synthesis.md](research/research-synthesis.md) — ≤500-word short-form summary.
- [lenses/01-record-layer-mechanics/findings.md](lenses/01-record-layer-mechanics/findings.md) — Schema, `record_budget` formula, freeze via sentinel, edge cases.
- [lenses/02-reckon-layer-discipline/findings.md](lenses/02-reckon-layer-discipline/findings.md) — 7-gate routing tree, verbatim refusals, promotion/retirement flagging, 10-line cap enforcement.
- [lenses/03-adversarial/findings.md](lenses/03-adversarial/findings.md) — Judgment laundering, budget gaming, override cascade, 100-session drift, un-falsifiable objective terms.
- [lenses/04-cross-skill-continuity/findings.md](lenses/04-cross-skill-continuity/findings.md) — Downstream readers, schema versioning, bidirectional vs unidirectional edges, kernel/adapter across repos, Emergence Ratio.
- [lenses/META-cross-cutting/findings.md](lenses/META-cross-cutting/findings.md) — Second-order meta-lens (preserved verbatim): eight convergences, compatible-but-uncombined moves, shared mental model.
- [lenses/META-gap-analysis/findings.md](lenses/META-gap-analysis/findings.md) — Second-order meta-lens: seven gaps the objective demands but no lens fills; first-use walkthrough; honest defers.
- [lenses/META-adversarial-review/findings.md](lenses/META-adversarial-review/findings.md) — Second-order meta-lens: weakest proposal, most over-engineered, most likely to be ignored, 5-rule MVP.
- [proposal/SKILL.md](proposal/SKILL.md) — The proposed ~150-line replacement SKILL.md, ready for evaluation. **This is a downstream artifact (skill spec), not part of the lens/research/discovery chain.**

## Claim

`close-session` is best designed as a **5-field, append-only, body-≤15-lines signpost protocol** for `football-stats-oracle`'s solo-dev scale. Layer 1 (Record) captures the on-disk delta in closed vocabulary, frozen before Layer 2; Layer 2 (Reckon) emits one pointer-line per non-empty Layer-1 field — no gate tree, no override mechanism, no auto-edits to other vault files. The redesign **ships the discipline and defers the tooling with named placeholders.**

## Status

Proposed. Triangulated by 4 propose-wave lenses and 3 evaluate-wave meta-lenses. Synthesis adopts the high-corroboration moves (cap-as-load-bearing, closed-vocab tokens, flag-only promotion, semantic triage, path-as-pointer) and drops the over-engineering (gate tree, kernel/adapter, JSON validator, ER walker, retirement-replacement cooling period).

## Summary

Three design constraints were negotiated with the user before the propose wave:
1. **Two layers** — Record (mechanical) → Reckon (judgmental), run sequentially, never mixed. Layer 1 fails by incompleteness; Layer 2 fails by prematurity / narration.
2. **Length-as-parameter is allowed but bounded** — `record_budget: auto | <int>` caps Layer 1 only; Layer 2 is hard-capped (~10 lines). "Importance" is explicitly rejected as a dial.
3. **Compression discipline applies to the meta-layer** — a session note that won't compress is evidence the real artifact (discovery, premise, experiment README) hasn't been written yet.

The propose wave (N=4): Record mechanics, Reckon discipline, adversarial analysis, cross-skill continuity. The evaluate wave (M=3): cross-cutting convergences, gap analysis, adversarial review of the proposals. **Meta-A** named eight convergences ≥3 lenses agree on. **Meta-B** surfaced seven holes the objective demands but no lens fills. **Meta-C** identified Lens 04 as weakest (designs for a fleet that does not exist), Lens 03 as most over-engineered, and showed a fixed-point walk where Lens 01 + Lens 02 verbatim produce mutually-contradicting notes; resolved with a 5-rule MVP.

Synthesis: **adopt Meta-C's MVP as the skeleton; layer high-corroboration moves from Meta-A; honor Meta-B's "honest defers" by naming them at the top of SKILL.md.** Dropped: 7-gate routing tree, sentinel comment, cooling-period rule, schema versioning and migration tooling, kernel/adapter shim, JSON validator and audit-vault skill. Kept from the user's original request: `record_budget: auto | <int>` for Layer 1, renamed so it cannot become an "importance" dial.

## Open Questions

- Should `record_budget` survive at all, or did the propose wave's "body cap does the real work" argument make it redundant? (Proposal keeps it but renames to `record_lines:`.)
- Operational definition of "emergence" — adopt Lens 04's Emergence Ratio as a footnote pointer, or leave for a separate discovery? (Proposal: footnote pointer, computation deferred.)
- Refusal escalation: when the human re-asks after a verbatim refusal, repeat / escalate / comply? (Proposal: repeat verbatim, no escalation, no compliance.)
- Cold-start exit condition: how many sessions before the bootstrap clause turns off? (Proposal: when `domain_knowledge/premise/` has ≥3 files.)
- Port findings back to sister `close-session` skills in `domainspec`, `house_project`? (Defer until at least one invokes the redesign.)

## Next Moves

1. **User evaluates** [proposal/SKILL.md](proposal/SKILL.md). If accepted, `git mv` baseline to `.v0-baseline` and replace with the proposal.
2. **First real session** under the new skill: invoke it on the next substantive work session in `football-stats-oracle`.
3. **30-session check** (calendar-based): re-read the first five session notes for drift. Compare body length, candidate-premise count, whether `artifacts:` paths point to discoveries that exist.
4. **Defer until needed:** `schema_version:` field, kernel/adapter extraction, migration tooling, ER walker, audit-vault skill.
5. **Port to sister skills** only after one quarter of proven use in football-stats-oracle.
