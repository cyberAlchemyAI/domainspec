---
id: run-ENN-01
node_type: audit
is_session: false
layer: ontology
nature: technical
status: draft
veracidade: high
convicção: high
version: 0.1.0
last_updated: 2026-01-01
tags: [experiment, run]
proposal: ./PROPOSAL.md
proposal_frozen_at: <commit SHA from PROPOSAL.md frozen_at>
run_index: 1
date: 2026-01-01
---

# ENN — Run 01

A record of one execution against the frozen proposal. Append-only: a
re-run is a new `RUN-02.md`, never an edit of this file. Raw outputs go in
`outputs/`; this file is the human-readable log.

## Setup

- Proposal frozen at: `<commit>`
- Corpus actually used: `<corpus-id>` (count: __) — must equal the frozen
  `corpus:`; note any deviation.
- Environment / scripts: `<script.py>`, `outputs/`.

## Observed metrics

| Metric | Value | Source |
|--------|-------|--------|
| classification_coverage | 0.__ | outputs/summary.json |
| type_a_share | 0.__ | outputs/summary.json |
| delta_proposals_minus_type_a_clusters | _ | outputs/... |

## Observations

- What surfaced (residue, frontier, witnesses).
- Anything unexpected the gates do not capture (becomes a finding, not a
  silent gate edit).

Adjudication is in `VERDICT.md`, not here.
