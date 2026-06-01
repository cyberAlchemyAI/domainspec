---
tags: [vault, ontology, knowledge-calibration-geometry, agents]
node_type: research
is_session: true
layer: ontology, application
nature: explanatory, procedural
status: active
created: 2026-05-27
timestamp: 2026-05-27T11:40:00-03:00
expires: 2026-07-26
conversation_id: knowledge-calibration-geometry-v0.5.0-patch-loop-2026-05-27
decisions_made: false
contradictions_found: true
specs_updated: []
promoted_candidates: []
expected_importance: 7
importance_rationale: "Produced two gating proposal artifacts for v0.5.0 of a load-bearing discovery and surfaced a previously-hidden two-construct-split reframing for C_head, but ratified no decisions and bumped no versions."
---

# Knowledge-Calibration-Geometry v0.5.0 Patch Loop + M5 Fork Research

## Summary

Diagnosed that the 4-lens audit of `knowledge-calibration-geometry/discovery.md` (v0.4.0) on 2026-05-26 was structurally flawed because no lens read the sibling `/domainspec-theorem` Lean formalization or the `two-layer-retrieval` discovery — producing 17 patches where ~6 collapse into upstream imports. A writer-reviewer subagent loop (Opus writer + Sonnet reviewer, 3 cycles) produced `proposals/v0.5.0-patch.md` with M1 (Provenance table), M2 (6-component distance stack from C-9), M3 (DefectResidue + CalibrationFinding from C-12/C-16 with Block A imported / Block B novel split), and M4 (H-section split into 8 Working Hypotheses + 3 Governance Gates); M5 (`C_head` construct type) was deferred under AX-DS-4. An M5 research subagent produced `proposals/m5-c_head-construct-fork-analysis.md` surfacing the three forks (latent trait / knowledge-state vector / behavioral disposition) plus an unexpected reframing from lens 2 P5 that the choice may not be "pick one" but "commit to a two-construct split." Working-tree hygiene was restored via commit `f802ac8` isolating prior questions-game Connections additions; discovery.md remains at v0.4.0 pending user review and the decision-gate session for M5.

## Contradictions

- questions `vault/discovery/knowledge-calibration-geometry/findings.md` framing of formal vocabulary as "math-as-decoration" — the `/domainspec-theorem` Lean formalization is sorry-free, so the constructs are provably grounded; the prior audit's lens set never read that repo, conflating missing-import discipline with conceptual ornament.
- questions `vault/discovery/knowledge-calibration-geometry/findings.md` count of 17 distinct patches — reading `vault/discovery/two-layer-retrieval/discovery.md` shows roughly 6 of those collapse to upstream imports already established there, deflating the patch count.

## Files touched

- vault/discovery/knowledge-calibration-geometry/proposals/v0.5.0-patch.md
- vault/discovery/knowledge-calibration-geometry/proposals/m5-c_head-construct-fork-analysis.md
- vault/discovery/knowledge-calibration-geometry/discovery.md

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/knowledge-calibration-geometry/proposals/v0.5.0-patch.md` | `creates` | New file produced this session via the Opus-writer + Sonnet-reviewer 3-cycle loop carrying M1-M4. |
| `vault/discovery/knowledge-calibration-geometry/proposals/m5-c_head-construct-fork-analysis.md` | `creates` | New file produced this session by the M5 research subagent surfacing the three construct-type forks and the two-construct-split reframing. |
| `vault/discovery/knowledge-calibration-geometry/discovery.md` | `consumes` | Read as v0.4.0 input for the patch design; the hygiene commit `f802ac8` isolated a pre-existing dirty diff from a prior session — this session did not modify the file's content. |
| `vault/discovery/knowledge-calibration-geometry/findings.md` | `contradicts` | Session disputes two framings from the prior 4-lens audit: the "math-as-decoration" charge (constructs are sorry-free in `/domainspec-theorem`) and the count of 17 distinct patches (~6 collapse to upstream imports from `two-layer-retrieval`). Per `ontology-conventions.md` §8, forward-only — no inverse row on findings.md. |
