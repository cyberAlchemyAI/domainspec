---
node_type: runtime-handoff
run_id: 2026-06-21-llm-replacement-plan
status: complete
created: 2026-06-21
owner: refine
---

# Runtime Handoff — Backend-domain TEST-SPEC replacement plan

- **Runtime surface:** native (parent-coordinated subagents). No external adapter.
- **Authorization:** operator confirmed the run + subagent execution ("confirm").
- **Strategy executed:** 2 pairwise-tensioned return-findings reviewers → parent synthesis. Both receipts collected. Tension resolved by parent (final_approver) to Option C.
- **Result:** [RESULT.md](RESULT.md) — verdict FLAG; execution-ready after 6 deltas.

## Next-route handoff (NOT executed — operator-gated)

1. **Pre-L0 decision (gating):** settle obligation identity/format — recommend **Option C** (sha1 core + committed human-ID projection map, gated by drift check). Owner: operator.
2. **task-session L0:** `derive --out` + provenance header + **drift `check` mode** (delta 1) + fail-closed + emit_dir containment (both `derive` and `emit-tests`). First executable slice.
3. **L1→L4** per the revised layer shape in RESULT, L3 (domain.md/rules.md grammar) MVP-optional.

## Commit gate

Run outputs (this folder) are **uncommitted** pending operator approval. Subsequent engine edits commit inside `implementation/domainspec` and push before any parent gitlink bump (submodule discipline; `make bump-check`).
