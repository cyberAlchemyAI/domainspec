---
stage: s4-research-decision
owner: refine-research-decision
status: pass
mode: research-if-gap-appears
decision: no-research-now
refine_target: mutation-execution-mechanics
project: ui-prototyping-studio
inputs:
  - stages/02-define.md
  - stages/03-refine-review.md
---

# Research-Decision: Mutation Execution Mechanics

**Mode:** research-if-gap-appears. **Default:** local-first.
**Decision: NO external research now.** Two bounded external passes are _named_ below as
candidates worth running later, but neither blocks the next stage and neither is launched here
(launching requires separate confirmation).

---

## 1. Decision

**No-research.** Proceed to the next refine stage on local evidence. The s3 FLAG and its fix
list F1–F9 (plus the three contract additions) are entirely resolvable against the existing
module — every load-bearing claim in s2 and s3 was already re-grounded against real code
(`apply-approved-batch.ts`, `domain/models.ts`, `synthesize-mutation-batch.ts`). Nothing the
FLAG asks for needs an outside source to _close_; it needs the author to fold in mechanics that
are already legible in-repo.

## 2. Rationale (why local-first holds here)

- **The FLAG is a completeness flag, not an unknown-prior-art flag.** Every F-item points at a
  mechanic that is observable in the code: 4 non-atomic store writes + a detect-not-rollback
  post-check (atomicity), `createdAt = new Date()` (wall-clock non-determinism), checksum binds
  inputs only, synthesis is LLM-free substring inference. These are settled by _reading_, not by
  _searching the literature_.
- **The s1 context pack carries zero external-research signals** (grep-negative for prior-art /
  literature / industry-reference). The chain has been deliberately internal-code-first, and the
  decision-relevant axes (A/B/C separation) are differentiated by _this repo's_ topology
  (pure core + CLI seam, append-only manifest, od-id anchors), not by general HTML-edit theory.
- **An external pass now would be premature.** The decision stage's pivotal questions are
  buildability questions ("can A's patch synthesizer avoid an LLM?", "is C's validator suite
  strong enough?"). Those are best answered first by a local design spike against the real
  schema; only if that spike stalls does prior art become load-bearing. Researching before the
  spike risks importing patterns that don't fit the pure-core/CLI-seam constraint.

## 3. Named gaps worth a _future_ bounded pass (NOT run now)

If, after folding in F1–F9, the decision stage cannot resolve the two pivotal buildability
questions from local reasoning, ONE of the following bounded passes may be confirmed and run.
Listed in priority order; each is scoped to a single tight question so it stays bounded.

- **GAP-R1 — Deterministic-validation of AI-generated edits (highest value).**
  Question: are there established patterns for _deterministically admitting or rejecting an
  LLM-produced artifact against a typed contract_ (Approach C's validator suite, esp. the
  `intent-not-reinterpreted` and `scope-bounded` checks — the s3-named crux)? Prior art likely
  exists under structured-output validation, constrained decoding + post-hoc validators,
  property-based acceptance of generated code, and diff-scoped change verification. This is the
  single axis where C lives or dies and where outside patterns would most de-risk the decision.

- **GAP-R2 — HTML diff/patch representation for honest, anchored diffs (secondary).**
  Question: what diff/patch _unit_ and algorithm give an honest, human-viewable,
  anchor-stable (`data-od-id`) before/after — i.e. DOM-tree vs structural vs per-element diff,
  and typed HTML patch op vocabularies (the schema A needs for `changeParams`, and the
  diff-unit that makes `DiffSummary'` honest). Relevant to F4/F7 (diff fidelity) and to A's
  patch-op union. Lower priority because a local spike can pick a reasonable unit; prior art
  mainly tightens the choice rather than unblocking it.

**Not gaps:** the generate-then-preview sequencing (s3 §4), atomicity/rollback, idempotency,
and provenance fields are all internal design decisions — no external pass needed.

## 4. Handoff

- **Next stage proceeds on local evidence.** Fold F1–F9 + the three contract additions into the
  Define; resolve the pivotal questions via a local design spike against the real schema first.
- **Conditional trigger for a confirmed pass:** if the spike cannot establish (a) that C's
  validator can be made deterministic and strong enough, or (b) that A's patch synthesizer is
  buildable without re-introducing an LLM, then propose GAP-R1 (then GAP-R2) for a separate,
  explicitly confirmed external pass — do not auto-run.
- **No external research was performed in this stage.**
