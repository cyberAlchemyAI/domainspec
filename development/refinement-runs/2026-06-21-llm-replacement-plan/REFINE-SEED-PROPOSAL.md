---
node_type: refine-seed
run_id: 2026-06-21-llm-replacement-plan
title: Refine Seed — Plan the deterministic backend-domain TEST-SPEC replacement
created: 2026-06-21
owner: refine
preset: standard
research_mode: no-research
---

# Refine Seed — Plan a full backend-domain TEST-SPEC replacement

## Target

The **LLM-replacement task** inside `development/deterministic-test-derivation-engine/`: make the deterministic engine the TEST-SPEC generator for the **derivable backend-domain surface**, replacing the LLM `domainspec-generate-tests` / `domainspec-test-designer` for that slice. (Scope confirmed by operator 2026-06-21: backend-domain TEST-SPEC only; UI/E2E Playwright + scaffolding + story→test map stay with the LLM — the engine cannot derive those, per the oracle/harness boundary.)

## Source context (all local, no external research)

- Current generator: `.claude/skills/domainspec-generate-tests/SKILL.md` (LLM) + `.claude/agents/domainspec-test-designer.agent.md`; rules doc `TEST-PIPELINE.md` (root); writes `docs/features/{feature}/TEST-SPEC.md` [+ `--scaffold`].
- Engine today: `tools/test-derivation-engine/` — `derive` CLI calls `emitSpec` (`src/emit/spec.ts`, marked "skeleton") → prints a 4-col table to **stdout** (does not write the file). `emit-tests` writes runnable vitest.
- Prior refine findings (carry in as memory): C1–C4 (claim>proof), G1 (harness tier), G2 (provenance/drift), G3 (emit_dir containment), G4 (fail-closed) — `refinement-runs/2026-06-21-test-engine-architecture-review/RESULT.md`.
- Existing LLM-authored TEST-SPECs to diff against: goldenquill-promotion-governance, knowledge-graph-visualization, agent-execution-orchestrator.

## Done criteria (what this run must produce)

1. A **contract-diff**: the LLM TEST-SPEC.md format vs the engine `emitSpec` output, row-class by row-class, classifying each as **engine-owned** (backend-domain derivable) vs **LLM-owned** (UI/E2E, scaffold, story-map).
2. A **non-executed implementation plan** (work-pack) for the engine-owned slice, layered L0→Ln, covering at minimum: `derive`→file write (`--out`), format contract decision (byte-compatible vs engine-native), provenance header (G2), `check`/drift mode (G2), `emit_dir` containment (G3), fail-closed write path (G4), harness-tier split in the output (G1), and the pipeline wiring point (where the engine plugs into `domainspec-generate-tests`).
3. A **coexistence contract**: how engine(backend) + LLM(UI/E2E) compose behind the pipeline, and how `needs_formal`/`needs-harness` gaps are surfaced where the LLM used to silently fabricate.
4. A **migration/validation strategy**: re-derive one real feature's TEST-SPEC via the engine, diff vs its LLM-era version; the diff = the spec gaps the LLM was hiding (acceptance evidence).

## Write scope

Only this run folder. The plan is non-executed; no engine code or skill changes in this run.

## Validation surface

tsc/test status of the engine is the implementation baseline; the plan names per-slice validation (vitest + byte-stability + roundtrip) but does not run it.

## Preset / research

standard · no-research (every input is in-repo).
