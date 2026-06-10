---
tags: [experiment, readme]
node_type: readme
is_session: false
layer: ontology
nature: reference
status: active
veracidade: high
convicção: high
version: 0.1.0
last_updated: 2026-06-09
---

# experiments/

Pre-registered, falsifiable experiments. Each experiment is a folder
`E<N>-<slug>/`; the discipline is that a proposal which isn't properly
pre-registered is **residue**, not a passing experiment. Full rules live in
[`PROTOCOL.md`](PROTOCOL.md) — this README is just the map.

## Layout

| Path | What it is |
|------|------------|
| [`PROTOCOL.md`](PROTOCOL.md) | The governing rules: lifecycle, must-fix-before-freeze, validation, pre-commit enforcement. |
| [`_TEMPLATE/`](_TEMPLATE/) | Copy this to start a new experiment. Ships with placeholders, so it intentionally fails validation until filled. |
| `tools/validate_proposal.py` | Stdlib-only validator for `PROPOSAL.md` frontmatter (`--frozen` also git-diffs against `frozen_at`). |
| `tools/hooks/pre-commit` | Pre-commit hook that runs the validator on staged proposals. Install per clone (see PROTOCOL.md). |
| `E<N>-<slug>/` | One experiment: `PROPOSAL.md` + `RUN-NN.md` + `VERDICT.md` + `outputs/`. |

## Quick start

```sh
cp -r experiments/_TEMPLATE experiments/E1-my-experiment
# fill in PROPOSAL.md (delete the placeholder guidance text)
python3 experiments/tools/validate_proposal.py experiments/E1-*/PROPOSAL.md
# when green and reviewed: set lifecycle: frozen + frozen_at: <commit>, commit
python3 experiments/tools/validate_proposal.py --frozen experiments/E1-*/PROPOSAL.md
```

## Register

Track active experiments here as they're created:

| Experiment | Hypothesis (one line) | lifecycle | verdict |
|------------|-----------------------|-----------|---------|
| _(none yet)_ | | | |
