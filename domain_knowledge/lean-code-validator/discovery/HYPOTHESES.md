# Hypotheses — lean-code-validator (v3)

## Objective

This document captures the falsifiable claims v3 implicitly bets on, each with its invalidation signal, likely confounders, and a concrete counter-position. If a hypothesis fails its invalidation check, we revise the design rather than ship a tool whose value rests on a false premise. This is the pressure-test layer between research and implementation.

## How to read

Each hypothesis has:
- **Claim**: the bet, stated as a falsifiable proposition.
- **Why we believe it**: the prior evidence pointing this way.
- **Invalidation signal**: what observation would flip it.
- **Confounders**: things that could make the signal misleading.
- **Counter-position**: the strongest "actually, no" we can articulate.
- **Stakes**: what changes in v3 if the hypothesis fails.

---

## H1 — Five predicates are sufficient

**Claim**: P1–P5 (closure, σ-typing, signature completeness, ambiguity, generation-order DAG) jointly capture "codegen-readiness" well enough that a spec grading `pass` on all five can be mechanically code-generated without authorial guesswork.

**Why we believe it**: each predicate is derived from a concrete codegen failure mode. Closure: missing class. σ-typing: ill-typed reference. Signature completeness: orphan operation/event/rule. Ambiguity: convergence forces a choice. Acyclic: no topological order. Together they cover every "the generator would have to invent something" case I can think of.

**Invalidation signal**: a real spec that grades `pass` on all five predicates but whose generated skeleton requires the generator to make a non-trivial choice not visible in the spec.

**Confounders**:
- "Non-trivial choice" is fuzzy — implementer-style choices (variable names, method ordering) don't count.
- A generator with embedded heuristics may resolve ambiguity invisibly, masking the failure.

**Counter-position**: there is at least one predicate we're missing — e.g., **multiplicity** ("how many `produces` edges does this Operation have? exactly one, or many?"). Without multiplicity, a generator that emits `Event[]` vs `Event` has to guess. We dismissed this as out-of-scope (parser drops cardinality), but the spec author thinks codegen-readiness without multiplicity is a half-promise.

**Stakes if it fails**: add P6 (multiplicity) and require parser extension to extract field cardinality. Pushes v3 timeline by ~1 step.

---

## H2 — Per-meta-type obligations approximate authorial intent

**Claim**: the obligations table in research.md §2 P3 (e.g., "every `Operation` has a performing `Entity` and a produced `Event`") matches what spec authors actually mean ≥80% of the time across the 6 in-repo specs.

**Why we believe it**: derived directly from σ-triples; every obligation is just "an edge that σ permits, and that codegen needs the source-or-target side to have at least once."

**Invalidation signal**: across the 6 specs, more than ~20% of `WARN`s emitted by P3 get dismissed by the spec author as "intentional, not a real gap."

**Confounders**:
- Specs may be quietly incomplete in ways the author wants to fix anyway (so dismissals undercount).
- Spec authors may rationalize gaps post-hoc rather than admit incompleteness.
- The 6 in-repo specs are not representative — they're examples, not production specs.

**Counter-position**: the obligations are too aggressive. Real specs routinely have, e.g., `Operation`s with no producing `Event` (a "void" operation), and the canonical σ-table just doesn't say this is required — it merely says "if there's a `produces` edge, source must be Operation and target Event." Reading "must have ≥1" into σ is our invention.

**Stakes if it fails**: soften specific obligations to `WARN` (already the default for some); demote some to "informational, not graded." Most rules survive; specific ones soften. Affects v4 calibration table, not v3 architecture.

---

## H3 — `paperBaseline` covers all in-repo specs

**Claim**: all 6 in-repo specs (zagr-marketplace, order-management, inventory-management, payment-processing, user-account, ccb-matching-experiment) declare or implicitly use only the `paperBaseline` profile (24 metas, 26 edges).

**Why we believe it**: none of the 6 specs use `Saga` or any R_CF edge in observed parsing. The agent that surveyed them (findings.md §6.6) found only backend (R_B) edges in use.

**Invalidation signal**: the parser, run with v3's expanded σ, surfaces an R_CF edge or a `Saga` meta-type in any of the 6 specs.

**Confounders**:
- Parser may have been silently dropping cross-feature references because v2's σ didn't recognize them.
- Cross-feature qualified names (`feature.EntityName`) appear in spec text — they may resolve to R_CF edges once the parser is taught to look.

**Counter-position**: zagr-marketplace has cross-feature edges (`produces-for → dlocal-integration.DLocalUserAccount`, observed in events.md:24) that v2 missed because R_CF wasn't in the σ-table. This is in fact `compositionExtension`, not `paperBaseline`, and we'd misgrade it if we default everyone to `paperBaseline`.

**Stakes if it fails**: zagr-marketplace's regenerated example declares `profile: composition-extension`. v3 then has at least one example exercising R_CF. This is good — it's the test case we said we lacked.

---

## H4 — R_U edges with empty σ stay quiet

**Claim**: in practice, no in-repo spec uses any of the 8 R_U edges (`renders`, `wraps`, `composes`, `consumes`, `submits`, `shapes`, `protects`, `displays`), so v3's "empty σ → `WARN`" behavior never fires on real specs. Note: `renders` and `submits` appear in example traces but have no ratified σ-triple and are also treated as unevidenced.

**Why we believe it**: none of the 6 in-repo specs are UI-flavored. R_U vocabulary lives in UI-SPEC.md style files, which are absent from the in-repo set.

**Invalidation signal**: v3 grades any in-repo spec and emits a `WARN` referencing one of the 8 R_U edges.

**Confounders**:
- Parser σ-fallback may misclassify a backend edge as `consumes` or `composes` based on incidental verb matching.
- A future UI spec lands in `examples/` and immediately drowns in R_U warnings.

**Counter-position**: `composes` and `wraps` are common enough English verbs that σ-fallback matches them spuriously. Even backend specs will emit R_U warnings as parser noise.

**Stakes if it fails**: tighten the parser's σ-fallback to ignore R_U edge names entirely until σ-triples exist; or escalate to `domainspec-core` to fill in R_U Tables in paper §4.2. Not a v3 blocker; visibility issue.

---

## H5 — Spec-as-Lean translation is mechanical once vocabulary is fixed

**Claim**: once `Sigma.lean` and `Profiles.lean` are written (Step 1 of build sequence), implementing `Report.lean` is mechanical translation from research.md §2 — no design decisions remain.

**Why we believe it**: the predicate definitions are crisp, all inputs are finite-data, and Lean's `Decidable` infrastructure handles the rest.

**Invalidation signal**: while writing `Report.lean`, we hit ≥1 design decision not foreseen in research.md or PROJECT-DECISIONS.md.

**Confounders**:
- "Mechanical" is subjective — small choices (record vs. structure, where to put helper functions) don't count.
- Cycle-detection (P5) is the most complex predicate; may surface unforeseen edge cases.

**Counter-position**: P3's "loop over each concept and check obligations against meta-type" hides genuine choices: how to represent the obligations table (data vs. function), how to format `Finding` messages, what level of recommendation specificity to aim for. These will surface as decisions during implementation.

**Stakes if it fails**: pause Step 3 of build sequence, draft a mini-RFC, get sign-off. Adds maybe 1 day per surprise; not a structural failure.

---

## H6 — Determinism survives `native_decide`

**Claim**: `native_decide` on the grader's predicates produces identical output across runs, machines, and Lean compiler versions for the in-repo specs (≤30 concepts, ≤50 edges each).

**Why we believe it**: `native_decide` is by construction deterministic on decidable propositions over closed-form data. The risk is performance, not correctness.

**Invalidation signal**: a spec that grades `pass` on machine A and `warn` on machine B for the same Lean version.

**Confounders**:
- Lean version drift could change the underlying `Decidable` instances.
- If we use `decide` instead of `native_decide` for some predicates, the timing characteristics differ — but not the result.

**Counter-position**: the grader's output includes string fields (Finding messages). String formatting could vary by locale or encoding in pathological setups — not a *grade* divergence, but a *report text* divergence that breaks reproducibility.

**Stakes if it fails**: pin Lean version, lock string formatting, add a determinism test in CI (run grader twice, diff the JSON). Cheap to add upfront if it becomes a real risk.

---

## H7 — Self-application is feasible

**Claim**: v3's own SPEC.md (the validator described as a DomainSpec L1 spec) can be parsed by `audit_richness.py` and graded `pass` by v3 itself. Meta-bootstrap proof.

**Why we believe it**: the validator's domain is well-bounded (Vocabulary + Spec representation + Grading bounded contexts) and the concept inventory in INITIAL-DEFINITIONS.md fits comfortably within `paperBaseline`.

**Invalidation signal**: parsing v3's own SPEC.md fails; or it parses but grades `fail` on a predicate the author considers a real bug in v3, not a parser/grader artifact.

**Confounders**:
- Self-grading can produce circular logic — a missing concept in SPEC.md that the grader doesn't notice because the grader is built around what SPEC.md declares.
- The validator's "domain" is a tool's internals, which may bend the meta-types in unusual ways (e.g., is `Meta` an `Enum` or a `ValueObject`?).

**Counter-position**: the meta-types were designed for business domains, not toolchains. Forcing the validator into Entity/Operation/Event vocabulary distorts the model and produces a SPEC.md that's clean by the framework's lights but disconnected from how the tool actually works. Self-application is theatre, not validation.

**Stakes if it fails**: drop the self-application story from PROJECT-OVERVIEW Goal #5. Use external specs as the only validation. The validator still ships; it just doesn't have the recursive proof point.

---

## Cross-cutting risk

A common confounder across H1–H4: **the 6 in-repo specs are examples, not production specs**. If they are simpler, cleaner, or more uniform than real production specs, every "tested across all 6" claim has limited reach. The first real production spec graded by v3 is the actual evidence collection point — until then, v3 is calibrated against a possibly-friendly distribution.
