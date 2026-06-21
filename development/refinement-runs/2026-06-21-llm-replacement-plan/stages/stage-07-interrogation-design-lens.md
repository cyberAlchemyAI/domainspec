---
stage: interrogation
lens: design-lens (adoptability)
mode: refine-design-review
verdict: flag
owner: interrogation
created: 2026-06-21
---

# Stage receipt — Design-lens (adoptability) reviewer

Reviewed: stage-06 contract-diff, stage-09 plan, prior RESULT. Verdict **FLAG**.

## Findings

- **[adopt-critical] Pull the format/ID decision forward.** Building L0–L2 emitting sha1-prefix keys then deciding human-ID format at L4 means every layer's byte-stable exit evidence is against a format you intend to discard. The ID contract is a prerequisite of L0 output.
- **[adopt-critical] The drift `check` mode is missing — the highest-value omission.** SWU-2 stamps provenance (G2 part 1) but there is NO SWU for G2 part 2 (re-derive, diff vs committed, fail on drift). Per R-ARCH-3 this is _the_ property that makes the engine worth adopting over the LLM. A header nobody checks is decoration.
- **[adopt-critical] Coexistence merge needs a contract, not convention.** §2 describes only initial merge. On re-derive, nothing guarantees the LLM block's references to engine IDs aren't orphaned. Make the engine block a fenced region replaced wholesale; the drift check flags dangling LLM→engine refs.
- **[improvement] Reclassify the traceability index** as engine-owned-after-L3 (its grouping key = concept/rule IDs from domain.md/rules.md), not perpetually "borderline."
- **[nit] SWU-4 retrofit of `emit-tests` containment is non-optional** — `emit-tests` (cli.ts:181) is the _live_ write path with the G3 arcanum breach; fixing only `derive` leaves the exploitable path open.

## Format recommendation

**Option A (byte-compatible + ID-allocation map).** Adoptability is defined by what downstream consumers (story→test maps, code-review, committed test filenames, traceability) don't have to change — all keyed on stable human IDs. The skeptic's "fights determinism" objection is answerable: treat the ID map as _committed input state_ (like bindings sidecars, cli.ts:157) → output stays a pure function of (docs + committed map), still reproducible.
