# Run Manifest — Intent Bugs & The Human-Review Wedge

- Run id: `2026-06-08-intent-bugs-human-review-wedge`
- Status: **flag** (strong dialectic + clear convergence; load-bearing residue — reframe required + human-owns-spec design constraint + measurement gap)
- Preset: standard · Research: bounded-research (external, confirmed) · Subagents: 3 (required, approved, dialectic)
- Owner: refine

## Canonical ten-stage loop — evidence

| #   | Stage                              | Owner                  | Verdict | Artifact                                                          |
| --- | ---------------------------------- | ---------------------- | ------- | ----------------------------------------------------------------- |
| 1   | Context Builder baseline           | refine                 | pass    | prior runs + free-tools list                                      |
| 2   | Invoke Define                      | refine                 | pass    | REFINE-SEED-PROPOSAL.md                                           |
| 3   | Interrogation refine-review        | Skeptic                | pass    | stages/skeptic-antithesis.md                                      |
| 4   | Research decision                  | refine                 | pass    | bounded external pass (confirmed)                                 |
| 5   | Distill                            | Free-Tool Cartographer | pass    | stages/cartographer-free-tool-map.md                              |
| 6   | Invoke Redefine/Design             | Intent-Bug Proponent   | pass    | stages/proponent-thesis.md                                        |
| 7   | Interrogation refine-design-review | refine convergence     | flag    | "reduce review" indefensible → reframe                            |
| 8   | Distill Repair                     | refine                 | flag    | circularity + automation-bias residue; human-owns-spec constraint |
| 9   | Invoke Plan                        | refine                 | pass    | RESULT.md (narrative addition)                                    |
| 10  | Final Interrogation + Synthesis    | refine                 | flag    | RESULT.md                                                         |

## Files

- REFINE-SEED-PROPOSAL.md, REFINE-DISPATCH.json, RUNTIME-HANDOFF.md, RESULT.md, evidence-index.json
- stages/{cartographer-free-tool-map,proponent-thesis,skeptic-antithesis}.md

## Residue ledger

- **R-IB-1 (load-bearing):** the claim "free tools reduce human review" is indefensible and dangerous — reframe to "relocate + make cheaper/unskippable/legible." Human intent review is irreducible.
- **R-IB-2 (design constraint, mandatory):** humans must own the spec/definition ground truth and gates must ADD friction at intent-critical points; otherwise LLM circularity (oracle ~48–54%) + automation bias make escaped intent bugs worse.
- **R-IB-3 (measurement gap):** no controlled evidence these specific tools reduce escaped intent bugs; claim unfalsified for Arcanum.
