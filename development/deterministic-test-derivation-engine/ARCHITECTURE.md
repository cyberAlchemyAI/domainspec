---
module: deterministic-test-derivation-engine
node_type: architecture
version: current
status: draft
updatedAt: 2026-06-12
docType: architecture
---

# Architecture Plan: Deterministic Test-Derivation Engine

## Architecture Intent

Make test derivation a pure pipeline — `parse → G → δ → obligation_key → emit` — with **no LLM in the derivation path**, so that determinism holds by construction and obligation sets are byte-identical across runs and machines. The architecture must isolate the only non-trivial parts (the grammar and the δ rule encoding) behind clean boundaries so they can be tested in isolation and so residual prose (`needs_formal`) is surfaced rather than guessed.

## Source Contracts

| Contract ID | Source                                                                                                                                                                 | Required | Notes                                           |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------- |
| SC-001      | [../2026-06-12-test-derivation-c2-cluster/stages/architect-deterministic-engine.md](../2026-06-12-test-derivation-c2-cluster/stages/architect-deterministic-engine.md) | yes      | engine design                                   |
| SC-002      | [SPEC.md](SPEC.md) + [GLOSSARY.md](GLOSSARY.md)                                                                                                                        | yes      | define baseline                                 |
| SC-003      | `domainspec/TEST-PIPELINE.md`                                                                                                                                          | yes      | δ rule source                                   |
| SC-004      | poker-team `financial-settlement/{states,operations,interfaces,events}.md`                                                                                             | yes      | input corpus + round-trip oracle (TEST-SPEC.md) |

## View 1: Context View

External actors: **DomainSpec spec authors** (write canonical feature docs), the **DomainSpec pipeline** (calls the engine where it currently calls the LLM skill), and the **C2 experiments** (consume engine output as evidence). The engine owns only the docs→obligations compilation; it does not author docs, run mutation testing, or adjudicate experiments. Boundary: input = a feature's 4 aspect docs; output = `TEST-SPEC.md` + optional runnable tests.

## View 2: High-Level Structure View

Four sequential stages behind a single `derive(featureDir) → {spec, tests, report}` entrypoint:

1. **Parser** (`docs → G`) — strict grammar + column-signature mapping.
2. **IR** (`G`) — typed concept graph, the stable interchange.
3. **Deriver** (`δ(G, Δ)`) — pure rule functions producing obligations.
4. **Emitter** (`obligation_key` → `emit_spec` / `emit_tests`).
   A cross-cutting **Linter** validates canonical form (CI gate) and shares the grammar with the Parser.

## View 3: Low-Level Components View

- `grammar/` — table tokenizer + `Formal`-cell sub-grammar → FormalExpr AST. No fuzzy matching.
- `ir/` — Node/Edge/G types; deterministic serialization (sort by `source_anchor`).
- `rules/` — one pure function per TEST-PIPELINE rule type (invalid-transition, invariant, calculation, postcondition, event-obligation); each returns obligations with exact cardinality.
- `keys/` — `canonical_params` normalizer + `sha1` `obligation_key`.
- `emit/` — `emit_spec` (Markdown) and `emit_tests` (vitest) renderers, ordered by key.
- `roundtrip/` — parses an existing TEST-SPEC.md into keys for the L0 gate.
  Collaboration rule: stages communicate only via `G` and `Obligation[]`; no stage reads files except the Parser/round-trip.

## View 4: Workflow Process View

Happy path: `parse` → (valid `G`) → `derive` → `key` → `emit`.

- **Non-canonical doc** → Parser rejects with `file:line` (block), Linter fails CI.
- **Prose `Formal` cell** → node flagged `needs_formal`; Deriver emits one counted placeholder obligation; no guessing.
- **Rule references absent node type** → block (schema gap), never silent skip.
- **Round-trip gate (L0):** engine key-set ⊇ committed key-set ⇒ PASS; missing keys ⇒ FAIL (stop, revisit architecture).

## View 5: Decision Flow View

- **Cardinality classification:** Deriver inspects each `Formal` AST and selects exact obligation count by class (EXISTENCE→2 / PRESENCE→#conjuncts / RANGE→4 / COUNT_CAP→2). Deterministic branch on AST shape.
- **Emit selection:** `emit_spec` always; `emit_tests` when the run requests runnable output (L1+).
- **Accept vs reject vs needs_formal:** canonical table → accept; malformed structure → reject; parseable structure with prose cell → needs_formal.

## View 6: Dependency Interface View

- Internal: stages depend only on `ir` types (no cyclic deps; Parser → IR ← Deriver ← Emitter).
- External: reads poker-team feature docs (cross-submodule, read-only) and `TEST-PIPELINE.md`; writes `TEST-SPEC.md`/tests into the feature dir (cross-submodule write — see constraints).
- Interface: a single CLI/library entrypoint `derive(featureDir, opts)`; no network access (forbidden — preserves determinism).

## Constraints

| Constraint                                                     | Source                               | Impact                                                                                                                  |
| -------------------------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| No LLM / no network in derivation path                         | operator decision (full determinism) | rules out any model call; all logic is code                                                                             |
| TypeScript implementation                                      | operator decision D-1                | native `emit_tests`; lives in `tools/test-derivation-engine/` (resolved 2026-06-12; `internal_tools/` is a Python tree) |
| Cross-submodule: docs/code in poker-team, engine in domainspec | repo layout                          | read docs from one submodule, may write tests into another; submodule-first commit discipline                           |
| Docs are ~85% canonical, not 100%                              | architect finding                    | needs linter + `needs_formal` hatch + column-order aliasing                                                             |

## Dependency And Interface Rules

| Rule ID | Rule                                               | Applies To     | Enforcement                           |
| ------- | -------------------------------------------------- | -------------- | ------------------------------------- |
| R-001   | Only Parser and round-trip may read the filesystem | all stages     | code review + module boundary         |
| R-002   | δ must be pure and total over a valid `G`          | `rules/`       | property test: `derive(G)==derive(G)` |
| R-003   | No network calls anywhere                          | whole engine   | lint rule / dependency-cruiser        |
| R-004   | Non-canonical input is rejected, never guessed     | Parser, Linter | unit tests on malformed fixtures      |

## Decision Log

| Decision ID | Decision                                                   | Options Considered                                                         | Reason                                                                                                                                              |
| ----------- | ---------------------------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-001       | Strict grammar over canonical Markdown tables (Approach A) | A: grammar over tables; B: docs-as-YAML; C: custom DSL                     | docs already ~85% there; lowest authoring burden; keeps readable PR-reviewable corpus                                                               |
| D-002       | TypeScript, homed at `tools/test-derivation-engine/`       | TS vs Python; `tools/` vs `internal_tools/` (Python) vs pnpm workspace pkg | native vitest emission for E3 mutation target; `tools/` matches existing TS-tooling convention (resolved via task-session decision-gate 2026-06-12) |
| D-003       | Content-addressed `obligation_key`                         | sequential IDs vs content hash                                             | byte-stability across runs solves E1 Jaccard structurally                                                                                           |
| D-004       | `needs_formal` escape hatch + linter                       | reject-all-prose vs guess vs flag                                          | deterministic about what it can't formalize; no silent interpretation                                                                               |

## Risks

| Risk ID | Risk                                                        | Mitigation                                                                                                  | Owner        |
| ------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------ |
| RK-001  | Prose `Formal` cells too common → engine covers too little  | measure `needs_formal` rate at L0; if high, canonicalize docs first                                         | engine owner |
| RK-002  | Round-trip gate fails (δ can't reproduce human obligations) | this IS the falsification gate — stop and revisit, cheap by design                                          | operator     |
| RK-003  | Stryker lacks vitest-4 runner support                       | spike in E3 SWU before committing mutation track                                                            | engine owner |
| RK-004  | Cross-submodule write of tests violates discipline          | engine writes spec only by default; test emission into poker-team is an explicit, separately-committed step | operator     |

## Downstream Planning Notes

- Implementation-plan inputs: stage decomposition above → SWU-ENG-000..007 in [WORK-PACK.md](WORK-PACK.md).
- Work-pack implications: L0 = parser+IR+δ+key+emit_spec+round-trip; L1 = 2nd feature + linter + emit_tests.
- Validation implications: R-002 property test + L0 round-trip gate are the load-bearing checks.

## Design Transport Notes

Carry the four-stage boundary and R-001..R-004 into the work-pack as task boundaries and gate checks. The round-trip gate is the single most important downstream artifact.

## Gate Result

- Status: **pass**
- Reason: six views present, source contracts cited, dependency/interface rules + decision log populated; one decision (engine home path D-002 detail) left for execution-time.
