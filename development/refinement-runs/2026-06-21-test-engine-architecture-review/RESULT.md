---
node_type: refinement-result
title: Refine Result — Test-Engine Lifecycle Architecture Gap Review
status: flag
created: 2026-06-21
owner: refine
run_id: 2026-06-21-test-engine-architecture-review
---

# Refine Result — Test-Engine Lifecycle Architecture Gap Review

- **Status: FLAG** — the architecture is structurally sound but has **real gaps**, including three **claim-over-proof** statements in the doc itself (the skeptic caught them) and four genuine **engine** gaps. One model is over-build and should be demoted, not built out.
- 4 tensioned reviewers (formal / architectural+lifecycle / domainspec+LLM-replacement / consistency-skeptic), all receipts in `stages/`.

## Answer to "any gaps?": yes — here they are, real-vs-noise classified

### A. Claim > proof in the architecture doc (fix the doc — highest priority, the skeptic's catch)

| #      | Claim (LIFECYCLE-ARCHITECTURE.md)                                      | Reality                                                                                                                                                          | Fix                                                                                                                                                 |
| ------ | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **C1** | "replacing the LLM-backed `domainspec-generate-tests`" (present tense) | The LLM skill is **still live**; the swap is **planned**, not done.                                                                                              | Make it future tense; §5 already says "planned" — align the intro.                                                                                  |
| **C2** | "replaces the LLM"                                                     | **PARTIAL**: the LLM agent also produces the **UI/E2E Playwright** suite + scaffolding + story→test map; the engine is **backend-domain only**.                  | Re-scope to "replaces the **backend-domain** test-derivation slice"; state the pipeline becomes **engine(backend) + LLM(UI/E2E)**, not engine-only. |
| **C3** | "corpus **6/7** features PASS@declared-scope"                          | No corpus-roundtrip **artifact** exists; the L0 report has only financial-settlement PASS + auth FAIL. (The 6/7 was a transient subagent sweep, never recorded.) | Either **record the corpus sweep** as an artifact, or downgrade to "financial-settlement PASS; auth honest-FAIL; corpus sweep unrecorded."          |
| **C4** | "self-derivable **fixpoint**"                                          | The engine has **never derived its own** TEST-SPEC (no `TEST-SPEC.md` in its feature folder). "can derive" ≠ "has derived."                                      | Mark aspirational, **or** actually run `derive` on `docs/features/test-derivation-engine/` to make it real.                                         |

### B. Real engine gaps (architectural / formal — feed the next plan)

| #      | Gap                                                                                                                                                                                                                                                                                                           | Severity                  | Fix                                                                                                                                  |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **G1** | **Harness/effect (Reason-B) obligation tier is absent from the formal model.** `emit → RunnableTests` is overclaimed — contract/event/transition/workflow/query/mapping classes emit `it.skip` skeletons, not running assertions. The metric lumps these "needs-harness" gaps with "needs-formal" prose gaps. | major                     | Add a **3-tier obligation model**: `derivable-pure` / `derivable-needs-harness` / `needs_formal`; split the gap counts by tier.      |
| **G2** | **No output provenance + no drift detection.** TEST-SPEC/emitted tests carry no `engine_commit`/input-hash/format-version; nothing detects "docs changed → committed TEST-SPEC stale."                                                                                                                        | blocker (for trust)       | Stamp a provenance header; add a `check`/freshness CLI mode (re-derive, diff vs committed, fail on drift) distinct from `roundtrip`. |
| **G3** | **`emit_dir` not containment-checked** — a binding's relative `emit_dir` is joined onto repo root with no guard; could write into **public arcanum** (open/private boundary breach).                                                                                                                          | major (security/boundary) | Validate `emit_dir` resolves inside the intended feature submodule; reject otherwise.                                                |
| **G4** | **`emit-tests`/`derive` don't fail-closed on parser violations** — they exit 0 on a partially-parsed graph (only `lint`/`roundtrip` gate). Violates "reject, never guess" on the write path.                                                                                                                  | major                     | Fail-closed on violations in the write/derive path, or state best-effort explicitly.                                                 |

### C. Minor (fix in doc/code)

- **INV-1 restated:** injective on raw `obligation_key`; intentionally **many-to-one at the semantic-fold** layer (error→`error:<op>`, postcondition→`post:<owner>`), bounded by category cardinality — make that bound a checked invariant, not a comment.
- **INV-3:** op-bucket drift-absolution is presence-based (one extra absolves many genuine misses) — make it **cardinality-bounded**.
- **Metric defined concretely:** `formalization = derivable_pure / (derivable_pure + needs_formal)` per feature, separate from the harness tier — the current "dual of soundness+honesty" is a slogan, not a defined number.
- **Δ has no authoritative doc:** SPEC/GLOSSARY cite a `TEST-PIPELINE.md` that does not exist; Δ is the code (reverse-engineered). State Δ = `src/rules/` as the authority.
- **Authoring feedback loop** is aspirational — name the consumer (`invoke refine` on the feature spec) and gate the claim on the `report` CLI landing.
- **Contract-diff sub-task** for the LLM swap: file shape, `--scaffold`, exit codes, story→test map — classify engine-owned vs LLM-owned rows so migration diffs only the backend slice.

### D. Noise (skeptic — do NOT inflate)

- The **"formalization-levels lattice"** (un→closed→under→fully) is **over-build rhetoric** — no code consumes it, `fully-formalized` is undefined, and the two lenses are _different axes_ (can't form one chain). **Demote to "two orthogonal gap meters," delete the lattice framing** — fix by _removing_, not building.
- `gaps`/`report` CLI is honestly labeled "planned" — not a gap.
- Telemetry/run-receipts, speculative versioning, SMT advisory — defer; not load-bearing here.
- Model 1 (formal) and Model 2 (architectural) duplicate the pipeline ASCII — minor merge.

## Refined-architecture deltas (non-executed)

1. **Doc honesty pass** (C1–C4): future-tense + backend-scoped "replace"; record-or-downgrade the corpus claim; mark/realize the fixpoint; demote the lattice (D). _Smallest, highest-trust._
2. **Formal model**: add the 3-tier obligation taxonomy (G1) + the concrete metric definition + the INV-1/INV-3 restatements + Δ=code note.
3. **Engine work items** (feed a plan): provenance header + drift `check` mode (G2), `emit_dir` containment (G3), fail-closed write path (G4).
4. **LLM-replacement task**: re-scope to backend slice + add the contract-diff + migration-classification sub-tasks.

## Residue ledger

- **R-ARCH-1 (load-bearing):** the doc currently overclaims on 3 headline value props (replace/corpus/fixpoint). Until the honesty pass lands, the architecture reads stronger than the evidence.
- **R-ARCH-2:** the "replace the LLM" framing must permanently carry the backend-only scope — the engine is not a full test generator (no UI/E2E).
- **R-ARCH-3:** G2 (provenance+drift) is the gap that most undermines the determinism value prop in practice — determinism is useless if you can't tell a committed TEST-SPEC is stale.

## Recommended next route

`invoke plan` (or direct `task-session`) for: (1) the doc honesty pass + lattice demotion (now), (2) the engine work items G2–G4 (provenance/drift/containment/fail-closed), (3) re-scope the LLM-replacement task to backend + contract-diff. The doc honesty pass is the smallest, highest-trust first slice.
