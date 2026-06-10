---
observed_capability: invoke
invoke_mode: plan
artifact: work-pack
target_artifact: DomainSpec Oracle Provider
output_mode: single-file
complexity: medium
date: 2026-06-10
---

# WORK-PACK — DomainSpec Oracle Provider

Execution-ready SWUs for L0 (build now) + L1/L2 (gated). L3 deferred.

## Shared SWU manifest

| SWU   | Parent task                             | Layer | Write scope                                          |
| ----- | --------------------------------------- | ----- | ---------------------------------------------------- |
| SWU-1 | T1.1 contract probe                     | L0    | `development/domainspec-oracle/probe/`               |
| SWU-2 | T1.2 concept-graph parser               | L0    | `development/domainspec-oracle/src/concept-graph.ts` |
| SWU-3 | T1.3 alignment-gap (D1)                 | L0    | `development/domainspec-oracle/src/alignment-gap.ts` |
| SWU-4 | T1.4 residue detectors (D2)             | L0    | `development/domainspec-oracle/src/residue.ts`       |
| SWU-5 | T1.5 score-result emit                  | L0    | `development/domainspec-oracle/src/score.ts`         |
| SWU-6 | T2.1 containerize domainspec            | L1    | `development/domainspec-oracle/docker/`              |
| SWU-7 | T2.2 FrozenOracle + reverse gate        | L1    | `development/domainspec-oracle/src/frozen-oracle.ts` |
| SWU-8 | T2.3 test/observability scoring (D3/D4) | L1    | `src/...`                                            |
| SWU-9 | T3.1 traceability + verdict (D5/D6)     | L2    | `src/...`                                            |

## SWU detail (L0 — build now)

### SWU-1 — Contract probe

- **Acceptance:** a `BenchmarkContractProbe` records spec path, concept-graph fields, domain-code
  path, score semantics for one chosen domainspec feature.
- **Verification:** probe file exists and names a real `implementation/domainspec/docs/features/<f>/`.

### SWU-2 — Concept-graph parser

- **Acceptance:** parses one feature's spec docs into `{concepts[], edges[]}`; missing docs recorded
  as coverage gaps, never a crash.
- **Verification:** `node ... parse <feature>` concept count == hand-tally on that feature.
- **Failure behavior:** unparseable doc → gap entry, exit 0.

### SWU-3 — Alignment-gap (D1, the spec→code drift detector)

- **Acceptance:** outputs `{drift_count, spec_ahead[], code_ahead[]}` from concept rows vs TS export
  symbols; pure static (no test run).
- **Verification:** seed an unimplemented concept → appears in `spec_ahead`; an extra export →
  `code_ahead`. **This is the day-one drift oracle.**
- **Failure behavior:** missing code module → whole feature is `spec_ahead`, flagged.

### SWU-4 — Residue detectors (D2)

- **Acceptance:** `spec-gap` (TODO/FIXME count), `governance-gap` (git diff scope ⊄ feature dir →
  1), `rework` (files touched >1× in window) — all computed, no LLM.
- **Verification:** seeded fixtures (a TODO; an out-of-scope edit; a twice-touched file) each resolve.

### SWU-5 — Score-result emit

- **Acceptance:** `ScoreResult` combines D1+D2 from raw evidence only; normalizes to `OracleEvidence`.
- **Verification:** re-run on identical inputs → **byte-identical** score (determinism gate). A
  non-deterministic output is a hard block.
- **Failure behavior:** any LLM call in the L0 path → block (must stay deterministic).

## SWU detail (L1/L2 — gated)

### SWU-6 — Containerize domainspec (prerequisite blocker)

- **Acceptance:** pinned image runs `pnpm i && build && backend test` deterministically twice.
- **Verification:** two container runs of one feature's tests give identical pass/fail.

### SWU-7 — FrozenOracle + reverse-test gate

- **Acceptance:** derived tests generated once by a version-pinned generator; a test enters the
  oracle only if it **fails on a known-broken impl**; `|T|`,`|O|` recorded.
- **Verification:** an always-pass vacuous test is rejected; oracle hash is stable across runs.
- **Failure behavior:** generator version unpinned → block (oracle must be frozen).

### SWU-8 — D3/D4 scoring · ### SWU-9 — D5/D6 traceability + verdict

- **Acceptance:** `passed/|T|`, `emitted/|O|`, traceability links, PASS/FLAG/BLOCK with P0 blocker
  gating. **Verification:** reproduces hand-counts and the §8.4 drift-verdict pattern on one feature.

## Done criteria

L0 SWUs pass verification → a deterministic spec→code drift + residue oracle exists on one real
feature. L1/L2 gated on the container + frozen oracle. The package contains **no optimization loop**.

## Next route

`task-session` SWU-1…SWU-5 (L0). Loop → experiment-harness (separate). Promote `src/*` to a real
`src/domainspec-provider.ts` once L0/L1 prove the Evidence-Bridge contract.
