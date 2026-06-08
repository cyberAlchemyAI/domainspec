---
name: research
description: "Dispatch subagents for disciplined research over documents and literature. Forces typed parameters and anti-bias composition; outputs schema-conformant per-agent files plus a synthesized discovery. Use when synthesis (≥2 sources), adversarial check, or multi-perspective audit is needed; otherwise inline lookup is cheaper. KT port: dispatches live under discoveries/."
---

# /research

Multi-agent research dispatch. KT port of the domainspec-theorem research
subsystem, made self-contained: corpus defaults to `discoveries/`, the agent
pool is dropped (names are `<role>-<index>`), and the constitution rules the
lifecycle enforces are inlined below. The fan-out engine is the existing
`domainspec-subagents-strategy` skill.

## When to invoke
- Synthesis (≥2 sources need integration)
- Adversarial check (precedent kill / vacuity audit)
- Multi-perspective: survey / recommendation / audit

Otherwise: skip — do the lookup inline.

## Dispatch folder layout

Every dispatch lives in ONE topic-slug folder under a chosen corpus root
(default `discoveries/`). No separate `runs/` directory.

```
<corpus>/<topic-slug>/
  agents/
    01-<role>-<index>.md      # per-agent decision records (provenance)
    02-<role>-<index>.md
    ...
  research/
    findings.md               # writer artifact (the deliverable)
  dispatch.yaml               # the spec
  discovery.md                # public synthesis artifact (user-gated)
  LEDGER.md                   # dispatch trail
```

- `<corpus>` defaults to `discoveries` (any folder is allowed; it is just the dispatch root).
- `<topic-slug>` is kebab-case, names the inquiry (e.g. `domain-hierarchy-standards`).

## Lifecycle (10 steps)

1. **Collect params** — `AskUserQuestion` only for what's missing (defaults below). `corpus` and `<topic-slug>` are locked here.
2. **Compose spec** — render YAML inline in chat. No file write.
3. **Validate** → invoke skill `research-validate` over the spec.
4. **User gate** — confirm / revise / abandon. Abandon ⇒ nothing persists.
5. **Persist spec** → `<corpus>/<topic-slug>/dispatch.yaml`.
6. **Dispatch per composition** — layer by layer. Each agent: `Agent(subagent_type: research-<role>)`. (Optionally use the `domainspec-subagents-strategy` skill to shape nested waves.)
7. **Collect per-agent files** — each agent wrote `<corpus>/<topic-slug>/agents/<NN>-<role>-<index>.md`.
8. **Review** → invoke skill `research-review` over `<corpus>/<topic-slug>/`.
9. **Loop or exit** — on reject + loops remain, back to step 6. Else exit with typed `exit_reason`.
10. **Promote** → invoke skill `research-promote` (user-gated; authorizes `discovery.md`).

## Forced parameters

| Param | Default | Asked? |
|---|---|---|
| `goal` | none | **YES** — one load-bearing sentence |
| `success_metric.type` | inferred (audit→coverage, survey→exploratory, recommendation→convergence) | confirm |
| `success_metric.threshold` | typed, parametrized | confirm |
| `corpus` | `discoveries` | confirm |
| `topic_slug` | inferred from goal | confirm |
| `max_loops` | 1 | confirm |
| `composition` | `triangulation` heuristic | confirm |

`success_metric.type` ∈ {coverage, closure, refutation, convergence, artifact, exploratory}.

## Composition DSL

```
L1:explorer(N=3, sonnet) → L2:skeptic(N=2, opus) → L3:writer(parent) → L4:auditor(haiku)
```

Per-layer `mode` ∈ {single, task-fan-out, nested-waves, zig-zag, robot-talks}.

## Inlined constitution (the rules the lifecycle enforces)

- **R-params** — `goal` is one load-bearing sentence; `success_metric` is typed with a parametrized threshold; every agent has a non-empty `difficulty_justification`.
- **R-order** — role ordering is invariant: explorer → skeptic → writer → auditor. No writer before skeptic.
- **R-antibias** — for any explorer/skeptic layer with N≥2, every pair of agents must differ on a nameable tension axis (methodology / corpus / attack vector / era priors / source-type). No nameable axis ⇒ false-consensus risk ⇒ reject.
- **R-schema** — every per-agent file carries the frontmatter contract (see the agent definitions): `agent_id, agent_name, layer_id, dispatch_id, role, model, decision, rationale, files_created, files_modified, references_consulted, dissent, closure_mark`. Body ≤ 200 words.
- **R-subset** — the writer introduces no claim and no reference absent from upstream per-agent files; `references_consulted` ⊆ union of upstream.
- **R-residue** — the writer artifact carries a `## Residue ledger`; every body claim maps to a row; surviving residue is preserved, never silently demoted.
- **R-dissent** — disagreement within a layer must be captured in `dissent:`; an N≥3 layer with zero dissent is a false-consensus flag.

## Exit reasons

`success | max_loops_reached | validator_rejected_twice | reviewer_rejected_twice | dissent_irreconcilable | user_abort | unrecoverable_error`

Report exit + 1–2 lines of context.

## Agent naming
Names are `<role>-<index>` (e.g. `explorer-1`, `skeptic-2`). Skeptic and auditor in the same dispatch must not share an index-name.

## Skip rule
Skip the whole dance if `composition` is `single + N=1 + explorer` (trivial lookup) — just do it inline.

## See
- Engine (fan-out shaping): skill `domainspec-subagents-strategy`
- Frontmatter for the discovery artifact: `domainspec/vault/ontology-conventions.md`
- Sub-skills: `research-validate`, `research-review`, `research-promote`
