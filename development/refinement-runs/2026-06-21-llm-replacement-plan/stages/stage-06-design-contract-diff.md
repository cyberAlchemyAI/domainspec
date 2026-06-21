---
stage: invoke-design
mode: design
owner: refine
created: 2026-06-21
verdict: draft-for-review
---

# Design — Contract-diff + coexistence contract (backend-domain TEST-SPEC replacement)

## 1. The actual output gap (evidence-backed)

Compared the **engine `emitSpec`** output against a real **LLM-authored TEST-SPEC** (`docs/features/agent-execution-orchestrator/TEST-SPEC.md`, 149 obligations). The gap is structural, not formatting.

| LLM TEST-SPEC.md section                                                                                                   | Deterministically derivable?                                                                        | Owner                                  |
| -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **Backend catalogue — Operation obligations** (rule-validation, calculation, state-transition, postcondition, error-state) | **yes** — this is exactly δ                                                                         | **engine**                             |
| **Backend catalogue — Domain Model obligations** (schema required-fields, value-object constraints, enum vocabularies)     | **yes** (from domain.md, if parsed)                                                                 | **engine**                             |
| **Source Completeness Gate** (which source docs present/absent)                                                            | **yes** — engine already knows which docs it parsed                                                 | **engine** (mechanical)                |
| **Coverage Summary** (counts by area)                                                                                      | **yes** — counts over obligations                                                                   | **engine** (mechanical)                |
| **Unresolved Formal Gaps**                                                                                                 | **yes** — this _is_ `needs_formal`/`needs-harness`                                                  | **engine** (the metric)                |
| **Concept & Rule Traceability Index** (TraceID → testIDs → conceptIDs → ruleIDs → source)                                  | **partially** — obligation→source is in the data; concept/rule grouping needs a stable grouping key | **engine (reduced) / borderline**      |
| **Docs-First Suite Partition** (Unit vs Integration by test-ID glob)                                                       | **yes if** tier is modeled — Unit=derivable-pure, Integration=needs-harness                         | **engine** (after G1 tier split)       |
| **Capability / Story obligations** (US-001 acceptance prose)                                                               | **no** — narrative acceptance, not a closed expression                                              | **LLM**                                |
| **Workflow / Interface / Observability obligations** (orchestration, telemetry pairing, metric formulas)                   | **mostly needs-harness** — runtime/effect oracle                                                    | **LLM** (or engine `it.skip` skeleton) |
| **Stable namespaced human IDs** (`AEO-BE-OP-046`, never renumbered)                                                        | **conflict** — engine uses content-addressed `sha1` keys                                            | **DECISION (see §3)**                  |
| **UI/E2E (Playwright) + scaffolding + story→test map**                                                                     | **no** — Reason-A oracle + Reason-B harness                                                         | **LLM (out of scope, confirmed)**      |

**Conclusion:** the engine owns the _Operation + Domain-model + gap-accounting_ core (the load-bearing, formula-checkable rows) plus the mechanical structural sections (completeness gate, coverage summary, suite partition). The LLM keeps capability/story narrative, UI/E2E, and scaffolding. The two genuinely contested items are **(a) stable human IDs vs sha1 keys** and **(b) how much of the traceability index the engine reproduces**.

## 2. Coexistence contract (post-swap pipeline)

```
docs → domainspec-generate-tests
         ├── backend-domain slice  → ENGINE (deterministic): Operation/Domain obligations,
         │                            completeness gate, coverage summary, gap ledger
         └── UI/E2E + scaffolding   → LLM (domainspec-test-designer, unchanged)
       → merged TEST-SPEC.md  (engine block is byte-stable + provenance-stamped;
                               LLM block clearly delimited)
```

- The engine block carries a provenance header (engine_commit, input-doc hashes, format_version) — G2.
- Where the engine hits `needs_formal`/`needs-harness`, it emits a **counted, visible gap row** — never a fabricated test (the property the LLM lacks).
- The LLM is invoked only for the LLM-owned sections; it must **not** re-author the engine block (no silent fabrication over the derivable surface).

## 3. The load-bearing decision (route-menu, for the reviewers + operator)

**Format contract: how does the engine block relate to the existing LLM TEST-SPEC.md?**

- **Option A — byte-compatible drop-in.** Engine emits the same section structure + stable namespaced human IDs (`<FEATURE>-BE-OP-NNN`). Pro: line-diffable against the LLM era; migration is a clean diff; humans keep familiar IDs. Con: stable insert-safe numbering is _not_ content-addressed — needs a persisted ID-allocation map, which fights the engine's "byte-stable by construction from docs alone" property.
- **Option B — engine-native format + a mapping note.** Engine emits its sha1-keyed table + the derivable structural sections; a thin adapter maps to the human sections. Pro: preserves the determinism property purely; no ID-allocation state. Con: the migration diff is noisier; humans lose `AEO-BE-OP-046`-style IDs.

This is the design tension handed to the reviewers (design-lens favors A as a true drop-in; claim-skeptic will attack A's ID-allocation state as breaking the determinism claim).

## 4. Scope guard (claim ≤ proof)

- This design does **not** claim UI/E2E derivation.
- "Replaces the LLM" = backend-domain slice only; the LLM remains live for the rest.
- The "self-derivable fixpoint" remains aspirational until the engine actually emits its own feature's TEST-SPEC — tracked as a plan task, not asserted.
