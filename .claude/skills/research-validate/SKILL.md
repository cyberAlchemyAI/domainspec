---
name: research-validate
description: Validate a research dispatch spec before any agent is dispatched. Checks goal load-bearing, success_metric typed, role ordering, per-layer mode well-formedness, and anti-bias pairwise tension. Returns accept | reject-with-fixes | escalate. Invoked by /research at step 3 or standalone over an existing spec.
---

# /research-validate

Pre-dispatch spec validator.

## Input
A dispatch spec YAML — inline (from `/research` lifecycle) or path to `<corpus>/<topic-slug>/dispatch.yaml` (standalone).

## Output
`accept` / `reject-with-fixes` (named items) / `escalate` (after one retry).

## Checklist

1. `goal` is a single load-bearing sentence.
2. `success_metric.type` ∈ {coverage, closure, refutation, convergence, artifact, exploratory}; `threshold` parametrized.
3. Role ordering: explorer → skeptic → writer → auditor. No writer before skeptic.
4. **Anti-bias pairwise tension** — for any layer with role ∈ {explorer, skeptic} and N≥2: name a tension axis (methodology / corpus / attack vector / era priors / source-type) for each pair. If no axis nameable → reject with "false-consensus risk: pair (i,j) shares <axis>".
5. Every agent has non-empty `difficulty_justification`.
6. `max_loops` present, ≤ 5.
7. `composition` DSL parses OR full YAML well-typed.
8. Per-layer `mode` is valid; mode-specific blocks present (e.g. `zig-zag` requires `iteration` block).
9. `corpus` is an existing folder (default `discoveries`); `topic_slug` is kebab-case and folder-safe.

## Dispatch
`Agent(subagent_type: research-validator)` with spec + this checklist in briefing.

## Skip rule
Skip entirely if `composition` is `single + N=1 + explorer` (trivial lookup).
