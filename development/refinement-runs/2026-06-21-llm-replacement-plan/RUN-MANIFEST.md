---
node_type: run-manifest
run_id: 2026-06-21-llm-replacement-plan
sigil: refine
status: complete
verdict: flag
created: 2026-06-21
owner: refine
target: implementation/domainspec/development/deterministic-test-derivation-engine/ (LLM-replacement task)
---

# Run Manifest — Backend-domain TEST-SPEC replacement plan

/ **Objective:** non-executed plan to make the engine the deterministic backend-domain TEST-SPEC generator. **Preset:** standard · **Research:** no-research · **Subagents:** recommended (2 tensioned reviewers, executed).

## Canonical loop — stage status

| #   | Stage                           | Owner                             | Mode                 | Status                | Artifact                                                                                          |
| --- | ------------------------------- | --------------------------------- | -------------------- | --------------------- | ------------------------------------------------------------------------------------------------- |
| 1   | Context baseline                | refine (inline)                   | —                    | pass                  | engine src + LLM skill/agent + TEST-PIPELINE.md + AEO TEST-SPEC + prior RESULT (read)             |
| 2   | Invoke Define (seed)            | refine                            | define               | pass                  | [REFINE-SEED-PROPOSAL.md](REFINE-SEED-PROPOSAL.md)                                                |
| 3   | Interrogation refine-review     | refine                            | —                    | folded                | scope contradiction surfaced + resolved via operator route-choice                                 |
| 4   | Research decision               | refine                            | no-research          | pass                  | all evidence in-repo                                                                              |
| 5   | Distill                         | refine                            | —                    | folded                | real-vs-noise in reviewer receipts                                                                |
| 6   | Invoke Design                   | refine                            | design               | pass                  | [stage-06 contract-diff](stages/stage-06-design-contract-diff.md)                                 |
| 7   | Interrogation design-review     | interrogation (subagent)          | refine-design-review | flag                  | [stage-07 design-lens](stages/stage-07-interrogation-design-lens.md)                              |
| 8   | Distill repair                  | refine                            | —                    | folded into synthesis | deltas 1–6 in RESULT                                                                              |
| 9   | Invoke Plan                     | refine                            | plan                 | pass                  | [stage-09 plan](stages/stage-09-plan-workpack.md)                                                 |
| 10  | Final interrogation + synthesis | interrogation (subagent) + refine | refine-final         | flag                  | [stage-10 claim-skeptic](stages/stage-10-interrogation-claim-skeptic.md) → [RESULT.md](RESULT.md) |

## Subagent receipts

2 reviewers, pairwise-tensioned on the format/identity axis (design-lens: Option A / skeptic: A is a determinism-blocker). Predicted disagreement materialized → P5 satisfied. Parent (final_approver) adjudicated to **Option C** (sha1 core + committed human-ID projection, gated by drift check). Both return-findings; no file writes by subagents.

## Verdict

**FLAG** — execution-ready after 6 deltas (2 blockers: add drift `check`; reframe+pre-L0 the format decision). Full ledger in [RESULT.md](RESULT.md).

## Residue

R-1/R-2/R-3 in RESULT. Outputs **uncommitted** pending operator approval.
