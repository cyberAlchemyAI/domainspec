---
module: deterministic-test-derivation-engine
version: current
status: draft
updatedAt: 2026-06-12
docType: implementation-plan
---

# Implementation Plan: Deterministic Test-Derivation Engine + C2 Experiments

Non-executed plan. Companion to [WORK-PACK.md](WORK-PACK.md) and [IMPLEMENTATION-LAYERING.md](IMPLEMENTATION-LAYERING.md). Sourced from [../RESULT.md](../RESULT.md).

## Wave Schedule

| Wave | Layer | Slices                                                 | Parallelizable?          | Exit gate                                                                    |
| ---- | ----- | ------------------------------------------------------ | ------------------------ | ---------------------------------------------------------------------------- |
| W0   | L0    | SWU-ENG-000..002 (skeleton, parser, IR)                | sequential               | parser builds `G` for financial-settlement                                   |
| W1   | L0    | SWU-ENG-003..005 (δ rules, obligation_key, round-trip) | sequential               | **toy falsification gate** — round-trip ⊇ committed obligations, byte-stable |
| W2   | L1    | SWU-ENG-006..007 (2nd feature, linter, emit_tests)     | 006→007                  | both features round-trip; emitted vitest green                               |
| W3   | L2    | SWU-MEAS-001..004, SWU-E1A-001                         | MEAS parallel; E1A after | E1a results + pre-registration committed                                     |
| W4   | L3    | SWU-E3-001..002, SWU-E2-001                            | E3 ∥ E2 (disjoint scope) | mutation + coverage results                                                  |
| W5   | L3    | SWU-AGG-001                                            | —                        | Wohlin aggregation + paper §5 update                                         |

**Hard ordering (residue R-TD-3):** W0→W1 is the prerequisite for everything. If the W1 toy gate fails (engine cannot reproduce human obligations), STOP and revisit the engine architecture before any experiment spend.

## Implementation-Detail Spec — δ engine (algorithmic core, SWU-ENG-001..005)

### Stage A — Parser: docs → `G` (SWU-ENG-001)

- **Inputs:** `financial-settlement/{states,operations,interfaces,events}.md` (canonical Markdown tables).
- **Output:** typed concept graph `G` (see IR below).
- **Ordered rules:**
  1. Tokenize each `.md` into heading + table blocks via a strict grammar (no fuzzy matching).
  2. Map each known table by column-signature (alias column-order drift, e.g. financial-settlement vs auth-access-control transition columns).
  3. Emit one typed node per row with a `source_anchor` = `{file}#{heading}:{row-index}`.
  4. For cells tagged `Formal`, parse with a small formal sub-grammar into a canonical expression AST.
- **Edge cases:** non-canonical table (extra/missing column) → reject with file:line; prose-only cell where `Formal` expected → emit node with `needs_formal=true` (do NOT guess).
- **Failure modes:** ambiguous column signature → block; duplicate source_anchor → block (indicates malformed doc).
- **Validation evidence:** parser unit tests; IR snapshot for financial-settlement reviewed against the doc by hand once.

### Stage B — IR: typed `G` (SWU-ENG-002)

```
Node = { id, type, source_anchor, fields: Record<string,Value>, needs_formal?: bool }
  type ∈ {Entity,State,Transition,Invariant,Operation,Rule,Calculation,Postcondition,Endpoint,Response,Event,Consumer,Field}
Edge = { from, to, type }   // e.g. Transition--(on)-->Event, Operation--(enforces)-->Invariant
G = { nodes: Node[], edges: Edge[] }   // nodes sorted by source_anchor for determinism
```

### Stage C — δ rules: `G` → obligations (SWU-ENG-003)

Pure total function `δ(G, Δ) -> Obligation[]`. **Cardinality made exact** (resolves the attackers' open-cardinality blocker):

- **Invalid-transition rule:** `T_invalid = { (s,e) : s ∈ non-terminal-states(G), e ∈ events(G) } \ valid-transitions(G)`, iterated in lexicographic `(s,e)` order. Deterministic count = `|non-terminal states| × |events| − |valid transitions|`.
- **Invariant rule:** classify the `Formal` expression → `EXISTENCE→2` obligations (holds/violated), `PRESENCE(conjuncts)→#conjuncts`, `RANGE→4` (below/at-min/at-max/above), `COUNT_CAP→2`. No "at least N".
- **Calculation rule:** one obligation per declared calculation + one per documented edge value in the `Formal` column.
- **Postcondition / event-obligation rules:** one obligation per postcondition row / per (event × consumer) edge.
- **Edge cases:** `needs_formal` node → emit a single `needs_formal` placeholder obligation (counted separately, excludes from determinism claim surface).
- **Failure modes:** rule references a node type absent from `G` → block (schema gap), never silently skip.
- **Validation evidence:** rule-level unit tests; δ output identical across 2 invocations.

### Stage D — obligation_key + emit_spec (SWU-ENG-004..005)

- `canonical_params` = sorted, normalized rule parameters (state names, event names, field paths, expression hash).
- `obligation_key = sha1(source_anchor | rule_type | canonical_params)`.
- `emit_spec` renders TEST-SPEC.md rows ordered by `obligation_key` (byte-stable).
- **Round-trip gate (W1 exit):** parse committed `financial-settlement/TEST-SPEC.md` into obligation_keys via the same extractor; assert engine set ⊇ committed set; classify engine extras (expected where human wrote "at least N"); zero missing = PASS.

## Implementation-Detail Spec — experiments (Track 2)

- **E1a (SWU-E1A-001):** descriptive, no Jaccard=1.0 bar. Metrics: obligation recall vs a hand-built gold `G` per feature; graph invariance under benign doc edits (whitespace/row-reorder must not change obligation_keys); transparent failure rate on malformed sections. Input closure pinned by `system_prompt_hash`; network tools forbidden.
- **E3 (SWU-E3-001..002):** Stryker scoped to `validation/poker-team/backend/src/domain/**` (pure, no DB). Derived suite = engine `emit_tests` output (removes implementer confound). Report mutation score derived / manual-control / combined over non-equivalent mutants. Drop `survivors_critical=0` and `≥70%` as gates until a pilot calibrates; keep as descriptive.
- **E2 (SWU-E2-001):** ≥3 non-author testers write blind plans (existing TEST-SPECs quarantined); mutation score (from E3 harness) is the load-bearing criterion; |D| and traceability demoted to descriptive with a published rubric + inter-rater κ. **Blocked on tester availability (B-001).**

## Validation Strategy (per slice)

| Slice    | Validation command / check                                                         |
| -------- | ---------------------------------------------------------------------------------- |
| S-ENG-1  | round-trip script: engine TEST-SPEC ⊇ committed; 2-run byte-diff empty             |
| S-ENG-2  | `vitest run` emitted suite green; linter CI gate passes; needs_formal count logged |
| S-MEAS-1 | hash-determinism test; JSONL schema validator; prereg `git log` predates run       |
| S-E1A-1  | results/E1a-results.md present; recall + invariance numbers                        |
| S-E3-1   | `stryker run` report; per-feature scores; κ on survivor rubric                     |
| S-E2-1   | results/E2-results.md; ≥3 testers; quarantine attested                             |
| S-AGG-1  | results/\*-results.md committed; paper §5 status diff                              |

## Cross-Repo / Submodule Discipline

- Engine package: `implementation/domainspec/internal_tools/test_derivation_engine/` (proposed home).
- Experiment data: `implementation/domainspec/docs/research/data/EX-*.jsonl` (append-only).
- Test/mutation changes: `validation/poker-team/` (separate submodule).
- Commit order: submodule-first (poker-team, then domainspec), parent-last; run `make bump-check` before pushing parent; `make sync` to keep submodules on `main`. Pre-registration commit must be pushed before the first experiment run.

## Open Decisions (route via decision-gate at execution time)

- D-1: engine implementation language — **RESOLVED: TypeScript** (operator decision 2026-06-12) — matches the poker-team backend + Stryker/vitest target so `emit_tests` output is native runnable test code, no bridge needed for E3.
- D-2: engine home path (internal_tools vs a new top-level tool) — affects GitNexus indexing.
- D-3: whether to keep a legacy E1 (LLM-agent determinism, descriptive) as a contrast to E1a, or drop it entirely.
