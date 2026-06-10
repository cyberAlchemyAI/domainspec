---
# ── PROPOSAL frontmatter ─────────────────────────────────────────────────
# This file is BOTH a vault node and an experiment pre-registration.
# Validated by experiments/tools/validate_proposal.py.
# This file is the PRE-REGISTRATION. Once `lifecycle: frozen`, the
# immutable block (hypothesis, predicts, corpus, gates, falsifiers,
# freezes) cannot change — the validator's --frozen mode git-diffs the
# live file against `frozen_at` and fails on any drift. Results never live
# here: they go in RUN-NN.md / outputs/, and adjudication in VERDICT.md.
#
# NOTE: this template ships with placeholders, so it intentionally does
# NOT pass validation. Fill it in for a real experiment.

# ── vault node fields (see domainspec/vault/ontology-conventions.md) ──
id: experiment-ENN-slug            # experiment-E<N>-<kebab-slug>
node_type: experiment              # project-local node_type (see PROTOCOL.md governance note)
is_session: false
layer: ontology                    # what the experiment concerns
nature: procedural, technical
status: draft                      # vault maturity: draft→exploratory→active→consolidated
veracidade: low                    # truth of the hypothesis — unknown until resolved
convicção: high                    # the bet: worth running / expected to hold
version: 0.1.0
last_updated: 2026-01-01
tags: [experiment]
superseded_by: null                # set to the replacing proposal id if amended

# ── experiment lifecycle (orthogonal to vault `status`) ──
lifecycle: proposed                # proposed → frozen → running → resolved
date: 2026-01-01                   # YYYY-MM-DD, proposal authored
schema_version: v1-candidate       # schema the experiment assumes
corpus: <corpus-id>                # exact corpus slice under test
frozen_at: null                    # git commit SHA, set when lifecycle: frozen
sister_artifacts:                  # docs this proposal depends on / hands to
  - <path/to/dependency.md>
moves:                             # premise/axiom/OQ this experiment moves
  - <id-of-premise-or-open-question>

# ── falsifiable content (immutable once frozen) ──
# The single falsifiable claim. One claim. No "and also".
hypothesis: >
  State the one prediction this experiment can be wrong about, in plain
  language. If you cannot name the observation that would make it FALSE,
  it is not a hypothesis yet.

predicts:
  - First thing that should hold if the hypothesis is true.
  - Second thing.

# Numeric PASS gates. Every gate is `metric op threshold`, and carries the
# verdict it forces when it FAILS. The VERDICT is a mechanical function of
# these (see §7). No gate may be added or edited after freeze.
# NOTE: the gates below are ILLUSTRATIVE EXAMPLES — replace them with the
# metrics your hypothesis actually rides on.
gates:
  - id: G1
    metric: classification_coverage
    op: ">="
    threshold: 0.90
    verdict_on_fail: FLAG
  - id: G2                         # example upper-bound BLOCK ceiling
    metric: type_a_share
    op: "<="
    threshold: 0.50
    verdict_on_fail: BLOCK
  - id: G3                         # example exact-count gate
    metric: delta_proposals_minus_type_a_clusters
    op: "=="
    threshold: 0
    verdict_on_fail: BLOCK

# Falsifiers: observable NON-numeric conditions that force a verdict.
falsifiers:
  - id: F1
    condition: Nothing surfaced — zero schema-frontier emissions AND zero residue.
    verdict: BLOCK

# Decisions fixed BEFORE seeing any data (engine-blind). Each must also
# appear as a [FREEZE] step in §4.
freezes:
  - Pin schema_version at the SHA in frozen_at before the first run.
  - Lock the corpus list; no artifact added or removed mid-run.
---

# ENN — <Title>

One-sentence plain-language statement of the question this experiment
answers and the narrow answer under test.

## Why this matters

*High-level and narrative — this section is for humans, not the validator.
Write it before the gates, so a reader knows why the gates exist.*

2–4 short paragraphs covering:

- **The stake.** What belief, decision, or design choice rides on this?
  What would the project do differently if it passes versus fails?
- **Why now.** What makes this the right experiment at this point — what it
  unblocks, which prior result (E-?) it builds on, what it hands to the
  next experiment.
- **Why we'd care either way.** A PASS and a BLOCK should *both* teach us
  something. If only one outcome is interesting, the experiment is weak —
  say what each outcome would mean.

Keep falsifiable, machine-checkable commitments out of here; they live in
§1 and §6. This is the motivation, not the contract.

## 1. Hypothesis

> Restate the single falsifiable claim (same content as the frontmatter
> `hypothesis:`). Bold the one sentence that is the actual prediction.

If schema discipline does not guarantee instance correctness, the design
**must** include both — these are not optional:

- **Schema-side checks:** are the concepts/relationships classified
  consistently under the project's taxonomy?
- **Instance-side checks:** do real projections/registries/generated
  artifacts preserve the distinctions the docs claim?

"Success" is operationalized **only** by the §6 gates. No other success
claim is made here.

## 2. Non-goals

- What this experiment explicitly does NOT test or claim.
- Scope boundaries that keep the hypothesis a single claim.

## 3. Corpus

The exact slice under test: `<corpus-id>` (name + count).

- Which artifacts, and why these specific ones.
- Controls, if any.
- Why this slice is sufficient (or deliberately insufficient) for the claim.

## 4. Procedure

Numbered protocol. Every freeze point is marked **[FREEZE]** inline and
must match an entry in the `freezes:` field:

1. **[FREEZE]** Pin `schema_version` at `frozen_at`.
2. **[FREEZE]** Lock the corpus list.
3. ...

## 5. Pre-registration

Decided **before** looking at the data (engine-blind). This is what makes
the proposal honest.

- **Must-fix before run:** see experiments/PROTOCOL.md; list the
  experiment-specific items here.
- **Pre-registered names / categories:** concept names, cluster labels, or
  buckets fixed in advance to prevent post-hoc naming.
- **Deterministic emission rules:** if the engine emits anything, state the
  exact count/shape rule and express it as a §6 gate (e.g. G3 above
  encodes "one delta-proposal per cluster" as a strict `== 0` difference;
  deviation is a BLOCK, not a judgment call).

## 6. Gates & falsifiers

Numeric PASS gates — the `gates:` field is the source of truth; this table
is the human-readable mirror (the validator does not diff them, keep them
in sync). *The rows below mirror the example gates — replace with yours.*

| Gate | Metric | Condition | On fail |
|------|--------|-----------|---------|
| G1 | classification_coverage | ≥ 0.90 | FLAG |
| G2 | type_a_share | ≤ 0.50 | BLOCK |
| G3 | delta_proposals_minus_type_a_clusters | == 0 | BLOCK |

Falsifiers (mirror of `falsifiers:`):

| ID | Condition | Verdict |
|----|-----------|---------|
| F1 | Nothing surfaced (no frontier, no residue) | BLOCK |

## 7. Verdict rule

Mechanical function from §6 → {PASS, FLAG, BLOCK}, computed in VERDICT.md
after the run against the frozen gates only:

- **BLOCK** if any gate with `verdict_on_fail: BLOCK` fails, OR any
  falsifier with `verdict: BLOCK` fires.
- **FLAG** if not BLOCK, but any `verdict_on_fail: FLAG` gate fails or any
  `verdict: FLAG` falsifier fires.
- **PASS** iff every gate passes and no falsifier fires.

## 8. Artifacts

- `RUN-NN.md` / `outputs/` — run records and raw outputs.
- `VERDICT.md` — adjudication against §6/§7.
- Sister discoveries / mappings / findings (also in `sister_artifacts:`).

## 9. Implications

What confirming or refuting this changes at the framework frontier — which
premise, axiom, or open question it moves (also in `moves:`). What the next
experiment inherits from this one's residue.

## Connections

- moves :: [[premise-or-open-question-id]]
- derives_from :: [[sister-artifact-id]]
