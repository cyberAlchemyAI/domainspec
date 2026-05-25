---
name: Dual-Residue Loss — Falsifying Experiment
description: Four-condition ablation comparing single-scalar vs dual-residue training on structured extraction. Falsifies or validates the dual-residue bridge prediction (§5 of research-bridges/tracks/agent-training/dual-residue-loss.md).
type: experiment-proposal
status: proposed
version: 0.1.0
created: 2026-05-22
owner: Victor Boscaro
---

# Dual-Residue Loss — Falsifying Experiment

## 1. Why this experiment

The dual-residue loss bridge predicts a falsifiable behaviour: under any
single-scalar training objective, at least one of two structurally
independent residue budgets retains measurable slack. The bridge's
categorical content is already formalised
(`lean-formalization/M6Counter.lean:145`,
`lean-formalization/Bicyclic.lean:446`,
`lean-formalization/DualResidueLossStructure.lean`,
`lean-formalization/LossDynamicsPlumbing.lean`). What is missing is the
empirical bridge from "the two residues are categorically independent"
to "training agents to honour both produces measurable improvement
over training against any single scalar." This experiment closes that
gap.

**Falsification target.** If a dual-loss agent does *not*
simultaneously reduce both residue rates below the best single-loss
condition, the bridge's training-dynamics prediction is falsified.
The categorical theorem stands — but the engineering claim that
dual-loss training is operationally distinguishable from
single-loss-with-mixed-preferences does not.

## 2. Task

**Structured extraction.** Given a natural-language prompt and a JSON
schema, produce a JSON object that conforms to the schema and faithfully
captures the substantive content of the prompt.

Why this task:
- The schema is **explicit and machine-checkable** — schema-side
  residue can be measured by a deterministic parser, not a judge.
- The substantive content is **comparable to ground truth** —
  instance-side residue is measurable by field-by-field comparison
  to a reference extraction, not a judge.
- It is the regime where the bridge predicts cleanest separation
  (per the bridge's §"Counter-categorical extension" addendum:
  "operacionalização limpa: structured generation").

Dataset: 5,000 (prompt, schema, ground-truth-extraction) triples
spanning 20 schema templates (10 simple, 10 nested). Train/dev/test
80/10/10. Generation procedure documented in `dataset-recipe.md`
(to be written wave-1).

## 3. Four conditions (ablation)

Same base model, same SFT initialisation, same compute budget, same
preference dataset where applicable. Differ only in the auxiliary
training signal added on top of standard SFT.

| Condition | Loss                                       | What it tests                       |
|-----------|--------------------------------------------|-------------------------------------|
| **A**     | SFT + DPO against aggregated preferences   | Baseline — current state of art     |
| **B**     | SFT + `L_ins` only                         | Schema-side floats free             |
| **C**     | SFT + `L_sch` only                         | Instance-side floats free           |
| **D**     | SFT + `α · L_sch + β · L_ins` (α, β tuned) | **The bridge's positive prediction** |

Coefficients α, β in D selected by dev-set grid search; honest range:
α, β ∈ {0.1, 0.3, 1.0, 3.0}. Report best dev-set configuration; freeze
it before evaluating on test.

## 4. Operationalisation of losses

### `L_sch` — schema-masked teacher KL

Given declared schema `S` and model output distribution `π_θ(· | x)`:

1. Build a typed mask `M_S` over the output vocabulary / span structure.
   For JSON output: tokens that cannot appear at the current parser
   position are masked out. The mask is derived from a JSON-schema-aware
   incremental parser (we will use `jsonschema-rs` bindings or
   equivalent).

2. Define `π̂_θ(t | x) := π_θ(t | x) · 𝟙[t ∈ M_S(prefix)]`, renormalised.

3. `L_sch(x) := KL(π_θ(· | x) ‖ π̂_θ(· | x))`.

This penalises probability mass that the model places on tokens
forbidden by the schema. Differentiable via the standard KL gradient.

### `L_ins` — schema-conditioned checker

Given declared schema `S`, model output `o`, and reference extraction `o*`:

1. Validate that `o` parses as an `S`-conformant JSON object. If not,
   `L_ins(x, o) := 1` (full penalty — but this case is already
   captured by `L_sch`, so it should be rare under joint training).

2. For each field `f` in `S`, define a field-level distance
   `d_f(o.f, o*.f)`:
   - Categorical fields: 0/1 mismatch.
   - Numeric fields: normalised absolute difference, capped at 1.
   - String fields: edit-distance normalised by `max(len)`.
   - Object fields: recursive aggregation.

3. `L_ins(x, o) := mean_f d_f(o.f, o*.f)`.

Differentiable surrogate for training: replace exact-match by
soft-match against the reference distribution (teacher-forcing on the
reference extraction with cross-entropy at each field token).

## 5. Metrics — measured independently on test set

For each condition, after training:

- **`η^sch_rate`** — fraction of test outputs that fail JSON-schema
  validation (deterministic parser).
- **`η^ins_rate`** — fraction of test outputs that parse but contain at
  least one field whose value differs from the reference by more than
  a per-field tolerance (`d_f > 0.1` for numeric, `d_f > 0.2` for
  string, exact match required for categorical).

Both metrics measured by deterministic tooling; no judge model
involved in evaluation (avoiding the single-scalar collapse the
experiment is critiquing).

Secondary metrics (for full reporting, not falsification):

- Joint failure rate: fraction of outputs failing on both axes.
- Per-schema-template breakdown of both metrics.
- Token-level KL between `π_θ` (trained) and `π_θ` (SFT-only) — to
  confirm the auxiliary loss is actually influencing the policy.

## 6. Falsification criteria — precommitted

The experiment is precommitted to the following calls:

### Bridge VALIDATED if

Condition D achieves **simultaneous strict improvement** over the best
single-loss condition on both `η^sch_rate` and `η^ins_rate`:

```
η^sch_rate(D) < min(η^sch_rate(A), η^sch_rate(B), η^sch_rate(C))
AND
η^ins_rate(D) < min(η^ins_rate(A), η^ins_rate(B), η^ins_rate(C))
```

with the strict improvement statistically significant
(bootstrap CI, n = 500, p < 0.05) on a held-out test set.

### Bridge FALSIFIED if

Either:

- **D does not strictly improve both metrics**, OR
- **A already saturates both metrics at zero** (i.e., single-scalar
  preference training was sufficient — the bridge's premise that
  single-scalar leaves slack was wrong for this regime).

### Bridge AMBIGUOUS if

D improves one metric significantly but not the other; or D improves
both but not significantly. In this case: report neutrally, do not
upgrade the bridge's status, and run a follow-up with a harder task
where saturation is less likely.

## 7. Pre-registration discipline

Before training begins:

1. Freeze the four condition specifications (this document).
2. Freeze the dataset split (commit hash recorded).
3. Freeze the metric definitions and tolerances (above).
4. Publish this proposal to `domainspec/experiments/` with a commit
   hash that predates the first training run.
5. Pre-register the falsification criteria publicly (project README +
   `research-bridges/tracks/agent-training/`).

Results are reported regardless of outcome. A null result is a
valid contribution — it would reset the bridge's status to
`paper-bridge-conditional` pending follow-up.

## 8. Estimated cost

- Dataset construction: 1 engineer-week (synthetic + light human review).
- Base model: open-weights ≤ 8B (e.g. Llama 3.1 8B Instruct) — fits a
  single A100 / H100 for the full experiment.
- Per-condition training: 4 conditions × 8 GPU-hours ≈ 32 GPU-hours.
- Grid search for D: + ~64 GPU-hours.
- Evaluation: deterministic; CPU only.

**Total: ~$500-1500 on rented GPUs, depending on configuration.**
Falsification cost is low enough that running this is cheaper than
arguing about whether to run it.

## 9. Stretch — counter-categorical extension

If the base experiment validates the bridge, run a second wave testing
the addendum proposal (research-bridges §"Counter-categorical
extension"):

- **Condition E** — D plus an additional loss term: the agent emits, alongside
  its extraction, a typed prediction `(η̂^sch, η̂^ins)` of its own residue.
  Third loss is the calibration error of this prediction against the
  measured residue. Tests whether typed self-prediction provides
  gradient signal that ordinary process supervision (Lightman et al.
  2023) does not.

Stretch is gated on base experiment validation; not part of the
pre-committed protocol.

## 10. Reporting

Outcomes will be written up in a single `RESULTS.md` in this folder,
with:

- Pre-registration commit hash (this document, frozen).
- Configuration, training logs, evaluation outputs (committed as
  artifacts).
- The pre-committed falsification call (validated / falsified /
  ambiguous), with the test-set numbers that support it.
- Update to `research-bridges/tracks/agent-training/dual-residue-loss.md`
  reflecting the empirical status change.

No spin. The bridge is either useful for training or it isn't; the
experiment tells us which.

## Cross-references

- `domainspec-theorem/research-bridges/tracks/agent-training/dual-residue-loss.md` —
  the bridge document
- `domainspec-theorem/lean-formalization/DualResidueLossStructure.lean` —
  categorical packaging
- `domainspec-theorem/lean-formalization/LossDynamicsPlumbing.lean` —
  gradient-slack theorem (with open `sorry`s — closing them is parallel
  to running this experiment, not a prerequisite)
- `domainspec-theorem/PRIZES.md` Tier-1 row "Framework ↔ treino de
  agentes" — this experiment is the first concrete attack on that prize
