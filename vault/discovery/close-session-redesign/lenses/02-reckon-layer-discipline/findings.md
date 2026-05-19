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

# Findings — Reckon Layer Discipline

## Objective

Specify Layer 2 (Reckon) as a routing layer — not a summary layer — whose only job is to decide where a session's epistemic content belongs in the compression pipeline and to emit minimal signals (frontmatter pointers, one-line rationales, verbatim refusals).

## Headline claim

Reckon writes pointers, not prose. The 10-line cap is the structural guarantee that Layer 2 cannot become a parallel knowledge channel; without it, Reckon eats the vault.

## Key design moves

- **Strict-order routing tree (Gates A–G).** Top-down, first match wins. A = nothing epistemic, B = refutation of an existing premise/axiom, C = new testable claim, D = multi-step argument or multi-source synthesis, E = reproducible procedure, F = future-agent-binding rule, G = catch-all. Bias toward most-compressive route: retirement > new premise > discovery > experiment > constitution > nothing.
- **Verbatim refusal table.** Six predictable human asks → six literal refusal strings. Re-asks return the same string. *"Important sessions write to discovery/. The session note links to them. Reckon stays at ten lines."* Judgment fails under pressure; lookup does not.
- **Promotion = flag, never act.** Writes `promotion_candidate: true` + ≤140-char `promotion_rationale` on the *premise file* iff: file pre-existed, new independent evidence pointer added, ≥3 distinct pointers total, no prior `retires:` targeted it.
- **Retirement = flag + tombstone.** Single clean falsification suffices (Popperian asymmetry vs promotion). Premise file gains `retired: true` + `retired_on` + `retired_by` + `retired_because`. File is never deleted.
- **Cooling period.** Replacement premise cannot be written in the same session as the retirement — forces the falsification to stand alone for one session boundary; cheapest defense against motivated reasoning.
- **10-line cap, three escalations.** Pre-write warning at 8–10 lines; hard refuse at line 11; refuse + diagnostic if narrative markers appear ("We then…", lists >3 items, headings).

## Schema split

Properties of the *session* (`routed_to`, `candidate_premises[*].why_now`, `reckon_gates_fired`) live in the session note. Properties of the *premise* (`promotion_candidate`, `retired`) live on the premise file. Vault-wide queries ask "which premises are promotion candidates?" not "which sessions flagged what."

## Caveats

- Gate F frequency limit ("more than once per 20 sessions = over-constitutionalizing") has no enforcement mechanism.
- Slug collision policy unspecified.
- Refusal escalation policy not formalized.
- Multi-route sessions (B + C as replacement vs B + C as parallel work) cannot be disambiguated by the tree alone.

## Open Questions

- Who reviews promotion candidates out-of-band?
- Cross-session enforcement of Gate F rate?
- Tiebreaker when one session fires two routes?
- Should the cap be enforced by prompt, post-write linter, or both?

## Connections

- `derives-from` → `../../discovery.md`
- `derives-from` → `../../research/research.md`
