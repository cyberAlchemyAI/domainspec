---
stage: interrogation
lens: claim-skeptic (claim ≤ proof)
mode: refine-final
verdict: flag
owner: interrogation
created: 2026-06-21
---

# Stage receipt — Claim-skeptic reviewer

Reviewed: stage-06, stage-09, prior RESULT; grounded in engine `src/`. Verdict **FLAG** (1 real-blocker + 4 real-flags; plan is markedly more honest than the C1–C4 artifact).

## Findings

- **[real-blocker] Option A breaks the engine's load-bearing determinism invariant.** `keys/index.ts` = `sha1(anchor|type|params)`, zero persisted state; byte-stability is "from docs alone" (rules/index.ts, emit/spec.ts). Insert-safe non-renumbering IDs are inherently stateful. SWU-11 routes A as a neutral menu item — that lets a future operator silently revoke the determinism guarantee. A is **not a peer of B**; it is a determinism-property change and must be recorded as such in the decision.
- **[real-flag] design §1 table over-counts.** Domain-Model marked "yes/owner: engine" but grammar (grammar/index.ts:732-743) parses no `domain.md`/`rules.md`. The plan baseline self-corrects (L3-gated), so flag not blocker — but the design table must carry the same "not built; L3" qualifier or it re-creates the C1 present-tense overclaim at row level.
- **[real-flag] SWU-13 "migration proof" is not a proof.** Diffing against the untrusted LLM artifact is circular — a divergence could be engine under-derivation, not "LLM hiding a gap." Relabel to "human-adjudicated migration diff" (which the validation section already says — the headline contradicts it). Note roundtrip already classifies genuineMissing/irreducibleMissing (cli.ts:75-84).
- **[real-flag] "engine wins / no LLM fabrication" is honor-system.** Nothing in cli.ts/bindings/SKILL.md enforces a block boundary; the LLM generator is a free-form Write agent. Needs a fail-closed merge check or it's a slogan (same class as G2/G3).
- **[real-flag] `needs-harness` tier doesn't exist in types yet** (ir/types.ts has only `needs-formal`). design §1/§2 speak as if it's existing output; L1's "Unresolved Formal Gaps" cannot split harness from formal until SWU-8 (L2) lands.

## Noise-resist (kept honest both ways)

- **SWU-14 genuinely closes C4** (converts "can derive" → "has derived"); minor: `featureDirFor` hardwires poker-team (cli.ts:26-29), so self-derive must use the path-arg branch.
- **"Replaces" is scope-qualified throughout** — C1/C2/R-ARCH-2 remediation holds; no unqualified "replaces" found.
- **SWU-3/SWU-4 fail-closed + containment** correctly target G4/G3 and match exit-code conventions (cli.ts:228, 179).
