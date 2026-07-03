# subagents-strategy — standalone package

A self-contained bundle of the **`domainspec-subagents-strategy` router** and the full
chain it routes to, flattened into one folder with internal cross-references rewritten to
be package-local.

Provenance: copied from `domainspec-core` on **2026-07-02**. This is a **copy**, not a
live link — the originals under `.claude/skills/…` are unchanged and remain authoritative.
Re-sync manually if the sources change.

> **"Standalone package," not "one skill."** This bundles **7 distinct skills** (each keeps
> its own `name:` frontmatter and routing role) plus the agent pool and the robot-talks
> constitution. They were _not_ merged into a single `SKILL.md` — merging would destroy the
> router → type-skill → form chain that is the whole point.

## Contents (Operational + robot-talks scope)

| File                                                                           | Origin                                                                             | Role                                                            |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `domainspec-subagents-strategy.md`                                             | `.claude/skills/domainspec-subagents-strategy/SKILL.md`                            | **router** — trigger, human gate, universal invariants, routing |
| `research.md`                                                                  | `.claude/skills/research/SKILL.md`                                                 | type skill — `dispatch_type: research`                          |
| `review.md`                                                                    | `.claude/skills/review/SKILL.md`                                                   | type skill — `dispatch_type: review`                            |
| `experiment.md`                                                                | `.claude/skills/experiment/SKILL.md`                                               | type skill — `dispatch_type: experiment`                        |
| `register-dispatch.md`                                                         | `.claude/skills/register-dispatch/SKILL.md`                                        | form — record/sheet fill, appender, close row                   |
| `append-dispatch.cjs`                                                          | `.claude/skills/register-dispatch/append-dispatch.cjs`                             | the deterministic appender (runtime code, copied verbatim)      |
| `check-tension.md`                                                             | `.claude/skills/check-tension/SKILL.md`                                            | init-time anti-bias gate                                        |
| `anti-bias-vector-composition.md`                                              | `.claude/skills/anti-bias-vector-composition/SKILL.md`                             | design theory behind the gate                                   |
| `reference/examples.md`, `literature.md`, `principle.md`, `validator-check.md` | `.claude/skills/anti-bias-vector-composition/reference/`                           | the gate's rubric + supporting material                         |
| `robot-talks.md`                                                               | `.claude/skills/robot-talks/SKILL.md`                                              | P14 robot-talks skill                                           |
| `robot-talks-README.md`                                                        | `.claude/skills/robot-talks/README.md`                                             | robot-talks overview                                            |
| `robot-talks-constitution.md`                                                  | `internal_tools/subagents-dispatch-hooks/constitution/robot-talks-constitution.md` | robot-talks rationale/templates                                 |
| `agent-pool.yaml`                                                              | `telemetry/agents/agent-pool.yaml`                                                 | the agent-name roster (`agent_name` values)                     |

## What was transformed

- **Flattened.** The deep `.claude/skills/<name>/SKILL.md` nesting was collapsed to one file
  per skill at the package root, named `<skill>.md`. The only subfolder kept is `reference/`
  (the four anti-bias support files), because the rubric is referenced as
  `reference/validator-check.md`.
- **Cross-references rewritten** to package-local paths — e.g.
  `.claude/skills/research/SKILL.md` → `research.md`,
  `telemetry/agents/agent-pool.yaml` → `agent-pool.yaml`,
  `vault/constitution/robot-talks-constitution.md` → `robot-talks-constitution.md`.
  All 12 bundled cross-references were verified to resolve to files that exist in this folder.
- **One substitution to flag:** `research.md` originally cited
  `vault/discovery/anti-bias-vector-composition/validator-check.md` (the vault "knowledge
  home"). It now points at the bundled `reference/validator-check.md` — the operational rubric
  the `check-tension` gate actually reads. **These two files differ in content** (both express
  the same constitution-P5 four-test rule). If exact vault-discovery fidelity matters, consult
  the source repo.

## Excluded on purpose

- **The heavy authority constitutions** — `subagents-strategy-constitution-proposal.md` (822 lines)
  and `research-constitution.md`. The router explicitly says _do not open the constitution to
  run a dispatch_; the operational form is inline. References to them remain as **external
  pointers** (see below).
- **The runtime ledger** — `telemetry/agents/subagents-dispatch.yaml` (~1 MB of live dispatch
  history). This is **output data, not a dependency.** The appender **creates a fresh ledger**
  at `<repo-root>/telemetry/agents/subagents-dispatch.yaml` on first run.

## External references that will NOT resolve standalone

These paths are intentionally left pointing at the source repo (their targets were not bundled):

- `internal_tools/subagents-dispatch-hooks/constitution/subagents-strategy-constitution-proposal.md` — authority-of-last-resort (4 mentions)
- `vault/constitution/research-constitution.md` — research math-profile, "pending realignment; do not import" (1 mention)
- `implementation/domainspec/vault/discovery/anti-bias-vector-composition/` — anti-bias knowledge home (1 mention)
- `telemetry/agents/subagents-dispatch.yaml` — the runtime ledger the appender writes to (3 mentions in `register-dispatch.md`)
- `robot-talks-constitution.md` retains **11 `../` provenance links** into the private vault
  (its Relationships table) — provenance metadata, not operational instructions.

## Running the appender

`append-dispatch.cjs` resolves the repo root from `$CLAUDE_PROJECT_DIR` (then a `project_dir`
key in the record, then cwd) and writes the ledger there. `register-dispatch.md` step 3 invokes
it at `$CLAUDE_PROJECT_DIR/packages/subagents-strategy-standalone/append-dispatch.cjs` — **update
that path if you relocate this package.** Note the source repo also has an _append-only hook_
that blocks direct Bash reads/writes of the ledger; that hook is repo infrastructure and is
**not** part of this package.
