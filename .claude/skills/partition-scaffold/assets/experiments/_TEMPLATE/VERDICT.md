---
id: verdict-ENN-slug
node_type: audit
is_session: false
layer: ontology
nature: technical
status: draft
veracidade: high            # the verdict is a measured fact about the run
convicção: high
version: 0.1.0
last_updated: 2026-01-01
tags: [experiment, verdict]
proposal: ./PROPOSAL.md
proposal_frozen_at: <commit SHA copied from PROPOSAL.md frozen_at>
run: ./outputs/             # or RUN-01.md
verdict: PASS               # PASS | FLAG | BLOCK
---

# ENN — Verdict

Adjudication of `PROPOSAL.md` (frozen at `<commit>`) against its §6 gates
and §7 rule. **No gate or falsifier may be reinterpreted here** — if the
proposal was wrong, that is a finding, not a reason to edit the gate.
Verify the proposal is untouched since freeze:

```sh
python3 experiments/tools/validate_proposal.py --frozen experiments/ENN-*/PROPOSAL.md
```

## Gate results

| Gate | Metric | Condition | Observed | Pass? | On fail |
|------|--------|-----------|----------|-------|---------|
| G1 | classification_coverage | ≥ 0.90 | 0.__ | ✅ / ❌ | FLAG |
| G2 | type_a_share | ≤ 0.50 | 0.__ | ✅ / ❌ | BLOCK |
| G3 | delta_proposals_minus_type_a_clusters | == 0 | _ | ✅ / ❌ | BLOCK |

## Falsifier results

| ID | Condition | Fired? | Verdict |
|----|-----------|--------|---------|
| F1 | Nothing surfaced | no | — |

## Verdict

**<PASS | FLAG | BLOCK>** — by the §7 rule applied to the rows above.

After resolving, update the proposal: `lifecycle: resolved`, and set its
`veracidade` (high if PASS-confirmed, `refuted` if BLOCK-refuted) and
`status` toward `consolidated`.

## Notes

- Procedure deviations, if any (and whether they invalidate the verdict).
- What residue this run hands to the next experiment.
