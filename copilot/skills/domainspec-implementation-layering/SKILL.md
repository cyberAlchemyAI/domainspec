---
name: domainspec-implementation-layering
description: Create or evolve a POC-first implementation layering model that progresses feature capabilities from minimum working unit proof to governed scale layers.
argument-hint: "<feature-name> [--update]"
agent: domainspec-spec-writer
allowed-tools: Read, Write, Glob, Grep
---

<objective>
Produce a capability-aware implementation layering model for one feature where Layer 0 is a minimum working unit POC and each subsequent layer explicitly improves the previous layer.
</objective>

<context>
Source references:
- domainspec/CHANGELOG.md
- domainspec/templates/implementation-layering.md
- docs/features/{feature-name}/SPEC.md
- docs/features/{feature-name}/capabilities/*.md
- docs/features/{feature-name}/*.md
Target location:
- docs/features/{feature-name}/implementation-layering.md
</context>

<process>
0. Planner gate hard rollout (feature mutations):
   - If this command mutates `docs/features/{feature}/` or feature implementation assets, require planner preflight gate.
   - Lazy backfill: if medium/high scope and `WORK-PACK.md` is missing, create it from `domainspec/templates/work-pack.md` before mutation.
   - If planner gate is not PASS, return BLOCK and request planner preflight refresh.
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Read domainspec/templates/implementation-layering.md.
3. Read `docs/features/{feature}/SPEC.md`, capability docs, and aspect docs referenced by the feature.
4. Define Layer 0 as a minimum working unit POC that proves the feature/capability concept with the least viable end-to-end slice.
5. For every layer, define the decision it unlocks using this sentence form: "After this, we know whether ...".
6. Apply the layer-boundary heuristic:
   - `Layer value = decision unlocked + user-visible outcome + risk reduced`
   - `Layer cost = implementation time + verification time + coordination burden`
   - Stop a layer when the next unit of work adds less value-per-cost to the current decision than starting the next decision layer.
7. Define subsequent layers so each layer:
   - builds explicitly on the previous layer,
   - expands capability scope or governance hardness,
   - carries forward prior-layer guarantees.
8. For each layer, document the minimum working unit, deferred scope, scope deltas, deliverables, exit criteria, verification evidence references, and promotion decision.
9. Validate cross-links and ensure every layer references authoritative spec/aspect contracts.
10. Summarize what can be implemented now (POC layer), what is deferred to later layers, and which decision each layer unlocks.
</process>
