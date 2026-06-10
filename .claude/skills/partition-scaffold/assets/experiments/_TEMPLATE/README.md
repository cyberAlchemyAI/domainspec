---
tags: [experiment, template, readme]
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

# Experiment template

Copy this folder to `experiments/E<N>-<slug>/` to start a new experiment.
The full rules live in [`../PROTOCOL.md`](../PROTOCOL.md); this README is
just the map of what each file is and when you touch it.

## The four documents

| File | What it is | When you write it | Mutable later? |
|------|------------|-------------------|----------------|
| [`PROPOSAL.md`](PROPOSAL.md) | The pre-registration: why the experiment matters, the single falsifiable hypothesis, the corpus, the numeric gates and falsifiers, and the freeze list. Also a vault node (`node_type: experiment`). | **Before** the run, while `lifecycle: proposed`. | Free until `frozen`; then the immutable block is locked (enforced by `--frozen`). |
| [`RUN-01.md`](RUN-01.md) | An append-only log of one execution against the frozen proposal. Raw outputs go in `outputs/`; this is the human-readable record. | During/after each run. A re-run is `RUN-02.md`, never an edit. | Append-only. |
| [`VERDICT.md`](VERDICT.md) | The adjudication: each gate's observed value, whether it passed, and the resulting PASS / FLAG / BLOCK by the §7 rule. | After the run. | Final. A wrong gate is a *finding*, not a reason to edit it. |
| `outputs/` (you create it) | Machine outputs the run produced (CSVs, JSON, plots) — what the dashboard and findings consume. | During the run. | n/a |

## The two registers inside `PROPOSAL.md`

A good proposal carries two voices, and they must not bleed into each
other:

- **Narrative (for humans).** The `## Why this matters` section: the
  stake, why now, why both outcomes teach us something. The validator
  never reads this — it exists so a reader understands *why* the gates are
  what they are.
- **Contract (machine-checkable).** The frontmatter `hypothesis`,
  `gates`, `falsifiers`, `freezes`, and §6/§7. These are what
  `validate_proposal.py` enforces and what freeze locks.

If a commitment can be wrong, it belongs in the contract. If it's
motivation, it belongs in the narrative.

## Lifecycle at a glance

```
proposed ──(must-fix green)──▶ frozen ──(run)──▶ running ──▶ resolved
   PROPOSAL editable          frozen_at set     RUN-NN.md    VERDICT.md
```

`lifecycle` tracks the experiment stage; the vault `status`
(`draft`→`consolidated`) tracks maturity — they are different axes, which
is why both fields exist.

## Quick start

```sh
cp -r experiments/_TEMPLATE experiments/E1-my-experiment
# fill in PROPOSAL.md (delete the placeholder guidance text)
python3 experiments/tools/validate_proposal.py experiments/E1-*/PROPOSAL.md
# when green and reviewed: set lifecycle: frozen + frozen_at: <commit>, commit
python3 experiments/tools/validate_proposal.py --frozen experiments/E1-*/PROPOSAL.md
```

The template ships with placeholders, so it intentionally **fails**
validation until you fill it in — that's expected.
