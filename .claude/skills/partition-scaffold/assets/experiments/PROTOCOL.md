---
tags: [experiment, protocol]
node_type: constitution
is_session: false
layer: ontology
nature: procedural
status: active
veracidade: high
convicção: high
version: 0.2.0
last_updated: 2026-06-09
applies_to: experiments/E*/PROPOSAL.md
---

# Experiment protocol

How a proposal becomes a runnable, pre-registered experiment. The goal is
the discipline the project applies to artifacts: a proposal that isn't
properly pre-registered is **residue**, not a passing experiment.

## File layout

Each experiment is a folder `E<N>-<slug>/`:

| File | Role | Mutable after freeze? |
|------|------|-----------------------|
| `PROPOSAL.md` | Pre-registration: hypothesis, gates, falsifiers, freezes | **No** (enforced by `--frozen`) |
| `RUN-NN.md` + `outputs/` | What happened during a run | Append-only (new run = new file) |
| `VERDICT.md` | Adjudication against the frozen gates | n/a |

Start from [`_TEMPLATE/`](_TEMPLATE/). The template ships with placeholders,
so it intentionally fails validation until filled.

## A proposal is a vault node

`PROPOSAL.md` is a vault node under
[`domainspec/vault/ontology-conventions.md`](../domainspec/vault/ontology-conventions.md):

- `node_type: experiment` — a pre-registered, falsifiable experiment. This
  is a **project-local `node_type`**: the controlled vocabulary in the
  `domainspec` submodule ([`ontology-conventions.md`](../domainspec/vault/ontology-conventions.md))
  does not list `experiment` yet, and we do **not** edit the submodule
  (per the submodule-edit ban — the vendored framework is read-only
  in-project). Treat it as a project extension and ratify it upstream when
  the submodule is next revised. (Epistemically it behaves like a
  `premise`: a falsifiable claim that evidence updates.)
- `veracidade` tracks the **truth** of the hypothesis: `low` while
  untested, `high`/`refuted` after the verdict.
- `convicção` tracks the **bet**: how committed we are to the prediction.
- `status` is vault **maturity** (`draft`→`consolidated`) — independent of
  the experiment `lifecycle` below, which is why both fields exist.
- `superseded_by` records amendment: a frozen proposal is never edited in
  place; a changed hypothesis is a new proposal that supersedes the old.

## Lifecycle

`lifecycle` (not `status`) tracks the experiment stage:

```
proposed ──(must-fix green)──▶ frozen ──(start run)──▶ running ──▶ resolved
```

- **proposed** — drafting. Anything can change.
- **frozen** — set `lifecycle: frozen` and `frozen_at: <git SHA>`. From
  this commit on, the immutable block (hypothesis, predicts, corpus,
  gates, falsifiers, freezes) cannot change. This is the pre-registration
  boundary, and it is **enforced**: `--frozen` mode git-diffs the live
  file against the `frozen_at` blob and fails on drift.
- **running** — a run is in progress against the frozen proposal.
- **resolved** — `VERDICT.md` exists and cites `proposal_frozen_at`.

## Must-fix before freeze

A proposal cannot move to `frozen` until all of these hold. Items marked
**[auto]** are checked by `validate_proposal.py`; the rest are review-gated
(the tool reads frontmatter only, not the prose body):

1. `hypothesis` is a **single** falsifiable claim — you can name the
   observation that would make it false. *(review)*
2. **[auto]** Every gate has `metric`, `op`, `threshold`, `verdict_on_fail`.
   No prose-only gates; `gates:` must be a list, not a scalar.
3. **[auto]** Every falsifier has `condition` and `verdict` (BLOCK or FLAG);
   ids are unique.
4. The §7 verdict rule is the standard mechanical function of §6. *(review)*
5. **[auto]** Corpus is named (`corpus:` set); the list is locked.
6. Every `freezes:` entry appears as a **[FREEZE]** step in §4. *(review)*
7. Pre-registered names/categories are written in §5 before the run.
   *(review)*
8. **[auto]** `validate_proposal.py` passes for the declared `lifecycle`.

## Validate

From the project root (the directory that contains `experiments/` —
top-level, or `internal_tools/` for the sub-project):

```sh
# check every real proposal (none yet → reports "nothing to validate")
python3 experiments/tools/validate_proposal.py

# check one proposal
python3 experiments/tools/validate_proposal.py experiments/E1-*/PROPOSAL.md

# also enforce the freeze (git-diff vs frozen_at) for frozen proposals
python3 experiments/tools/validate_proposal.py --frozen experiments/E1-*/PROPOSAL.md
```

Stdlib only — no venv. Exit 0 = all checked proposals are structurally
sound for their declared `lifecycle` (and, with `--frozen`, unmodified
since freeze).

### Pre-commit enforcement

A pre-commit hook runs the validator (`--frozen`) on every staged
`PROPOSAL.md` and blocks the commit on a structural error or frozen drift.
The hook **source** is versioned at `experiments/tools/hooks/pre-commit`;
the `.git/hooks/` symlink is not, so install it once per clone:

```sh
ln -sf ../../experiments/tools/hooks/pre-commit .git/hooks/pre-commit
```

Intentional exceptions (e.g. a deliberate supersede) bypass with
`git commit --no-verify`.

## Candidate register vs. proposal

The lightweight table in
[`../domainspec/templates/experiment-candidates.md`](../domainspec/templates/experiment-candidates.md)
is the **backlog**: one row per idea, cheap triage. A candidate is
*promoted* into a full `PROPOSAL.md` only when it's worth pre-registering.
Don't write a PROPOSAL for an idea that hasn't earned a verdict yet; don't
leave a runnable experiment as a table row.

## Migrating legacy specs

If experiments predate this layout (a single `README.md` spec,
`status: draft`/`drafting`), migrate opportunistically — active ones
first: extract the §6 gates into the `gates:` field with `verdict_on_fail`,
split results into `VERDICT.md`, set `lifecycle` and `frozen_at`. Until
migrated they remain valid `README.md` specs; the validator only checks
`PROPOSAL.md` files, so it will not flag them.
