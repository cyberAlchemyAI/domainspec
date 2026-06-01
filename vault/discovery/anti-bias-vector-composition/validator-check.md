---
tags: [vault, discovery, multi-agent, validator, theorem-research, spec-lifecycle]
node_type: discovery
is_session: false
layer: ontology, application
nature: operational
status: active
version: 0.1.0
last_updated: 2026-05-26
---

# Anti-Bias Vector Composition — Validator Check

> Operational rules for the validator agent in the `theorem-research` skill's spec lifecycle. Runs against the `dispatch.yaml` of a dispatch *before* the dispatch is allowed to start, and again post-dispatch against the returned artifacts. This check is **additional** to the existing `domainspec-subagents-strategy` check ("angles non-overlapping AND covering" — see §Relationship to the existing validator below).

---

## When the check runs

Two points in the spec lifecycle:

1. **Pre-dispatch (strict).** After the dispatch spec is authored and before any subagent is invoked. Failure here blocks the dispatch — the spec must be revised.
2. **Post-dispatch (advisory).** After all subagents return, before synthesis. Failure here raises a red flag for the synthesizer and the auditor; it does not block synthesis but it must be recorded in the dispatch's audit trail.

---

## Pre-dispatch checklist

The validator runs the following over the `dispatch.yaml`. The spec is rejected if any **R** rule fires; a **G** rule must pass for the spec to be accepted.

### Step 1. Identify subject layers

**Item 1.** Parse the spec's `layers` block. Identify all layers where `role ∈ {explorer, skeptic, evaluator}` and `agents.length ≥ 2`. These are the *subject layers* for this check. Layers with `role ∈ {synthesizer, writer, auditor}` are out of scope (single-agent by construction or single-check). Layers with `agents.length == 1` are out of scope (no pair to tension).

**Item 2.** For each subject layer, parse the per-agent `angle` string. The `angle` is the field that names the agent's line of approach. (If a subject layer has agents without a stated `angle`, fail at this step — the principle cannot be checked on an unstated angle.)

### Step 2. Classify each angle along the tension axes

**Item 3.** For each angle, classify it along the four tension axes:

- **Methodology axis** — e.g., empirical / formal / adversarial / historical / computational.
- **Source-corpus axis** — e.g., arXiv-categorical / physics-journals / dissent-or-critical-literature / textbook-canon / backward-citation-tree.
- **Attack-vector axis** (skeptics only) — e.g., precedent-attack / vacuity-attack / definitional-attack / scope-attack / counter-example-attack.
- **Temporal-prior axis** — e.g., modern-only / historical-lineage / mixed-with-decade-bins.

The classification is recorded in the spec as `angle.axes: {methodology: ..., source_corpus: ..., attack_vector: ..., temporal_prior: ...}`. If the spec author has not pre-classified, the validator emits a classification draft and pauses for user confirmation.

### Step 3. Red-flag rules

**Item 4. R1 — Same-noun-phrase rule.** If all N angles in a subject layer share the same core noun phrase (e.g., all start with "search literature on X" with only adjectives varying; all begin "review the claim about Y"), reject. The angles are not differentiated along any load-bearing axis. Specific check: tokenize the angle strings, drop stopwords, and verify the set of remaining content words has at least N distinct primary verbs *or* N distinct primary nouns across the N angles.

**Item 5. R2 — Same-methodology-axis rule.** If all N angles in a subject layer have the same value on the methodology axis (e.g., all `empirical`, all `formal`), reject. A layer that is uniformly empirical cannot cancel empirical-method bias; a layer that is uniformly formal cannot cancel formal-method bias.

**Item 6. R3 — Same-source-corpus rule (explorer layer specifically).** For explorer layers, if all N angles draw from the same source corpus (e.g., all "search arXiv"), reject. The corpus *is* the bias source for explorer agents; corpus monoculture defeats the layer's purpose.

**Item 7. R4 — Same-attack-vector rule (skeptic layer specifically).** For skeptic layers, if all N angles use the same attack vector value, reject. Three "find problems with the argument" agents form a single attack vector; one precedent-attack + one vacuity-attack + one definitional-attack form three.

### Step 4. Green-light rule

**Item 8. G1 — Pairwise nameable tension.** For each unordered pair `(a_i, a_j)` of agents in a subject layer, the validator must be able to write a one-sentence statement of the form "a_i and a_j are tensioned along the [axis] axis: a_i runs [value_i], a_j runs [value_j], and a bias internal to a_i along this axis would be exposed by a_j." If the validator cannot produce this sentence for any pair, the spec is rejected on that pair. The validator emits the set of accepted tension sentences as part of the spec's audit trail.

**Item 9. G2 — Coverage of subject axes.** Across the N angles in a subject layer, at least two distinct tension axes must appear (e.g., methodology *and* source-corpus, or attack-vector *and* temporal-prior). A layer tensioned along only one axis is admissible but the validator emits an advisory note: "single-axis tensioning detected; bias along orthogonal axes is not canceled by this layer".

---

## Post-dispatch checklist

**Item 10. Dissent-surfacing check.** After the subject layer returns, inspect the per-agent outputs for *dissent records* — explicit notes of the form "agent_j's reading would disagree with mine on point X" or "I expected to find Y; agent_k found ¬Y". If a subject layer of size N ≥ 3 returns *zero* dissent records and the N findings all reach the same conclusion, fire the **false-consensus red flag**.

The false-consensus red flag does not mean the finding is wrong — sometimes the truth is unanimous. It means the dispatch did not *exercise* the tensioning that was specified pre-dispatch, and the apparent consensus is therefore not load-bearing evidence of correctness. Treat it as a failure to apply the principle, not as success.

**Item 11. Tension-realization log.** For each pair `(a_i, a_j)` that the pre-dispatch G1 check accepted, verify the dispatch produced *at least one concrete disagreement or differentiation* between a_i's and a_j's outputs along the declared tension axis. If a pair was claimed to be tensioned and the returned outputs show no axis-aligned differentiation, record this in the audit trail. Repeated occurrences across multiple dispatches suggest the tension axes are misclassified in the spec template and the validator's axis taxonomy needs revision.

**Item 12. Auditor-layer escalation.** If post-dispatch checks fire either the false-consensus red flag (Item 10) *or* multiple pair-level tension-realization failures (Item 11), the auditor layer is invoked with elevated scope: not just "did the synthesis follow the rules", but "should this dispatch be re-run with a revised spec". The user gates the re-run decision.

---

## Relationship to the existing validator

The `domainspec-subagents-strategy` validator already checks two conditions on the angle set of a subject layer:

- **Non-overlapping.** No two agents investigate the same *concern* (P-RT-6 / P-RT-7 in robot-talks; the same rule applies here).
- **Covering.** Together, the N angles span the macro vector — there is no part of the shared goal that no agent addresses.

These conditions are partition conditions on the angle set: they ask *which subsets of the goal space each angle covers*. They do not ask *which direction each angle points within its subset*.

Tensioned-pairwise is a strictly stronger condition. A layer can pass non-overlapping-and-covering and fail tensioned-pairwise — for example, four explorer agents partitioning the goal into four disjoint sub-questions, each using the same arXiv-keyword search methodology. The partition is clean, the coverage is complete, and the bias term is uncancelled.

The validator therefore runs *both* checks in sequence: partition first (existing), then tension (this discovery). A spec must pass both to be dispatched.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [principle.md](./principle.md) | `derives-from` | The principle this validator operationalizes. Every rule R1–R4 enforces an aspect of the principle; G1–G2 are its positive form. |
| [literature.md](./literature.md) | `cites` | The false-consensus red flag (Item 10) is the Janis-groupthink failure mode; the dissent-surfacing check (Item 10) is the Kahneman-Klein adversarial-collaboration discipline. |
| [examples.md](./examples.md) | `instances` | Worked good/bad layer shapes that exercise these rules. |
| [../domainspec-strategy-definitions/](../domainspec-strategy-definitions/) | `extends` | The existing validator check for partition (non-overlapping AND covering). This check is the second stage in the same validator pipeline. |
