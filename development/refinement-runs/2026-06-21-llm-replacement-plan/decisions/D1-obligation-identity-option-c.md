---
node_type: decision
id: D1
title: Obligation identity — Option C (sha1 core + committed human-ID projection)
status: decided
decided_by: operator
date: 2026-06-21
run_id: 2026-06-21-llm-replacement-plan
closes: R-1 (pre-L0 gate)
---

# D1 — Obligation identity & output format: **Option C** (decided)

**Decision (operator, 2026-06-21):** the engine keeps `sha1(source_anchor|rule_type|canonical_params)` content-addressing as the **internal source of truth**, and emits stable human IDs (`FS-OP-001`) as a **committed projection map** layered outside δ. This buys adoptable human IDs (design-lens) without revoking the "byte-stable from docs alone, no state in δ" invariant (skeptic). Both reviewer concerns satisfied.

## Why this preserves determinism (the skeptic's bar)

- The obligation **set + content** stays a pure function of `docs` (the sha1 core is untouched).
- The **human ID** is a pure function of `(docs + committed id-map)` — same status as the existing `bindings/<feature>.json` sidecars, which are already committed input (`cli.ts:157`). Determinism becomes "reproducible given committed inputs," not "stateless," and that boundary is explicit + guarded (below), not free-floating.

## Projection-map format (committed input, parallels `bindings/`)

Location: `tools/test-derivation-engine/id-maps/<feature>.idmap.json` (committed, like `bindings/<feature>.json`).

```json
{
  "feature": "financial-settlement",
  "prefix": "FS",
  "format_version": 1,
  "entries": [
    {
      "key": "0a3f9c…(full sha1)",
      "id": "FS-OP-001",
      "rule_type": "postcondition",
      "anchor": "operations.md#C1"
    }
  ],
  "next": { "OP": 2, "DOM": 1, "RULE": 1, "IF": 1, "EVT": 1, "WF": 1 },
  "tombstones": [
    { "id": "FS-OP-007", "retired_key": "9b1e…", "since": "2026-06-21" }
  ]
}
```

- **Full sha1** as the join key (no prefix collisions).
- `id` = `<PREFIX>-<CLASS>-<NNN>`, `CLASS` from `rule_type`. **Never renumbered.**
- `next` = per-class monotone counters for deterministic allocation.
- `tombstones` = retired IDs (obligation removed/changed); the id is **never reused**, preserving the "never renumber" guarantee.

## Allocation rule (deterministic)

At `derive`: produce obligations → sort by sha1. For each:

1. sha1 in `entries` → reuse its `id`.
2. sha1 absent → allocate `<PREFIX>-<CLASS>-<next[CLASS]>`, increment `next[CLASS]`, append to `entries`.

Allocation walks **sorted-sha1 order**, so it is itself a pure function of `(docs + existing map)`. The map is rewritten sorted by `id` (stable diffs). The map only grows; removals become tombstones.

## Drift `check` mode — failure taxonomy (closes Delta 1 / G2 part 2)

`check` is **read-only verification** (CI/pre-commit), distinct from `roundtrip` (vs human catalogue) and from `derive` (which may allocate). It re-derives and FAILS-CLOSED on:

| #   | Condition                                                                                  | `check` (verify)                      | `derive` (allocate)        |
| --- | ------------------------------------------------------------------------------------------ | ------------------------------------- | -------------------------- |
| 1   | **Unmapped sha1** — new obligation, no id                                                  | **FAIL** "map stale: run derive"      | OK — allocate              |
| 2   | **Dangling id** — map id whose sha1 no longer derives                                      | **FAIL** "obligation changed/removed" | move to tombstone + report |
| 3   | **Stale committed TEST-SPEC** — committed `.engine.md` ≠ freshly derived                   | **FAIL** (core G2 drift)              | rewrites file              |
| 4   | **Dangling LLM→engine ref** (Delta 3) — LLM block references a tombstoned/absent engine id | **FAIL** flag for human               | flag                       |

Exit code: non-zero on any FAIL (matches `lint`'s exit-4 convention, `cli.ts:228`).

## Consequence for the plan

- L0 SWU set now **owns the id-map read/allocate path + the `check` mode** as first-class (not L4).
- Migration diff (L4) is per-id, human-adjudicated — stable ids make the diff meaningful.
