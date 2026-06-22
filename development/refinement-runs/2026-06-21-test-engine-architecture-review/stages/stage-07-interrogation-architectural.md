---
stage: interrogation
lens: architectural-lifecycle
mode: refine-design-review
verdict: flag
owner: interrogation
created: 2026-06-21
---

# Stage receipt — Architectural / lifecycle reviewer

Target: `LIFECYCLE-ARCHITECTURE.md` §2 (architecture) + §4 (lifecycle) cross-checked vs `src/cli.ts`, `src/bindings/`, `src/emit/`, the engine `.craft` ledger.

## Findings

- **A1 (BLOCKER): no output provenance + no drift detection.** Emitted `TEST-SPEC.md` / `__derived__` tests carry no `engine_commit`, input-doc hash, or format-version header; nothing detects "docs changed → committed TEST-SPEC is stale." Determinism is worthless to a consumer who can't tell whether a committed artifact still matches its source. Add a provenance header + a `check`/freshness CLI mode (re-derive, diff vs committed, non-zero exit on drift) — distinct from `roundtrip` (which compares vs the human catalogue, not vs staleness).
- **A2 (major / boundary): `emit_dir` is not containment-checked.** A binding's relative `emit_dir` is joined onto repo root with no guard; a crafted/edited binding could write into **public `arcanum`**, breaching the open/private boundary the repo enforces. Validate the resolved path stays inside the intended feature submodule; reject otherwise.
- **A3 (major): the write path doesn't fail-closed on parser violations.** `emit-tests`/`derive` exit 0 on a partially-parsed graph; only `lint`/`roundtrip` gate. This violates "reject, never guess" on the side that actually writes files. Fail-closed on violations in the derive/emit path, or document best-effort explicitly.
- **A4 (minor): §1/§2 duplicate the pipeline ASCII** — merge to one diagram.
- **A5 (minor): authoring feedback loop (§3) is aspirational** — name the consumer (`invoke refine` on the feature spec) and gate the claim on the `report` CLI landing.

Verdict: **flag** — pipeline decomposition is sound; the trust-critical gaps are provenance/drift (A1) and the boundary/fail-closed pair (A2/A3).
