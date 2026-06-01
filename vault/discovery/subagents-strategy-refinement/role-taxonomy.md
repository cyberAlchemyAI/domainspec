---
tags: [vault, discovery, subagents, roles, taxonomy, research-skill]
node_type: discovery
is_session: false
layer: ontology
nature: explanatory
status: active
version: 0.1.0
last_updated: 2026-05-26
---

# Role Taxonomy — 4+1

> The four work-roles and the one meta-role that the `research` skill dispatches over. Sibling to [`principle.md`](./principle.md), [`relation-to-base.md`](./relation-to-base.md), [`decisions-log.md`](./decisions-log.md).

---

## The four work-roles

The work-roles are **epistemic functions** carried by dispatched agents over their assigned artifacts. They are not workflow stages — an explorer can come after a writer, a skeptic can run in parallel with another skeptic. Each role guards a distinct failure mode; no agent is asked to guard two at once.

### `explorer`

**Operates on.** The corpus and the dispatch's macro vector (`goal`). The explorer generates candidate findings, precedents, witnesses, or interpretations from a stated `angle` deliberately distinct from sibling explorers' angles.

**Runs.** Typically first in a dispatch, but not always — re-dispatched explorers after a skeptic kill are common. Coverage-bound, breadth-first.

**Does NOT.** Judge whether its own candidates survive scrutiny — that is the skeptic's job. Author the public finding — that is the writer's job. Check schema conformance — that is the auditor's job.

### `skeptic`

**Operates on.** Candidate findings produced by explorers (or written prose produced by writers). Attacks them along a declared gate: precedent already exists, witness cannot be constructed, definition collapses to triviality.

**Runs.** After at least one generative agent (explorer or writer) has produced something to attack. May run in parallel with other skeptics carrying different gates (e.g. precedent-kill + non-vacuity + definitional-soundness composed in a `robot-talks` layer).

**Does NOT.** Produce vague unease — skeptic deliverables are graded on specificity of objection. Author replacements for what it killed — that recycles into a fresh explorer dispatch.

### `writer`

**Operates on.** Surviving candidate findings (post-skeptic) plus the corpus's closure-mark schema. Produces the public finding artifact in `research-*/<...>.md`.

**Runs.** After generation and adversarial check have stabilized. Single-agent by construction within its layer — no parallel writers (write races).

**Does NOT.** Generate fresh findings beyond what the explorer/skeptic pipeline supplied — fabrication. Self-audit its own output — independence violation; see "Why not fewer roles" below.

### `auditor`

**Operates on.** Per-agent files (R12), the LEDGER, the public finding's closure mark. Verifies schema conformance, role coverage, dissent capture, and evidence linkage.

**Runs.** After all generative and writer layers complete. Default model `haiku` because the task is rule-checking against a fixed schema, not deep synthesis.

**Does NOT.** Re-litigate findings on substance — that would be a second skeptic pass under a different name. Modify the artifacts it audits — author-fidelity (R14) forbids parent or auditor rewrites; flags only.

---

## The one meta-role

### `validator`

**Operates on.** The dispatch spec itself, BEFORE any child agent is dispatched. Returns one of `accept | reject-with-fixes | abstain | accept-with-bootstrap-override`.

**Runs.** R3 Step 0.5 — between in-chat spec composition and user confirmation. Distinct timing from any work-role.

**Does NOT.** Read artifacts (none exist yet at Step 0.5). Propose changes (the validator MUST NOT also propose — separation of design and approval). Run more than once retry per spec (R26 one-retry rule).

The validator is a meta-role because its input is a *design*, not a *deliverable*. The auditor reads what was produced; the validator reads what is about to be produced. The two checks have no overlap in input, timing, or epistemic function.

---

## Why not fewer roles

Three collapses were considered and rejected:

### Collapse `validator` → `auditor` (one rule-checker role)

Rejected because the briefings have nothing in common. The validator reads a spec YAML and checks role ordering, tension axes, parametrization. The auditor reads per-agent files and checks schema conformance, closure-mark evidence, dissent capture. Different inputs, different checklists, different timing. Forcing a single role to carry both would either bloat the briefing (every check at every dispatch) or silently drop checks at the wrong phase.

### Collapse `skeptic` → `auditor` (one critic role)

Rejected because the skeptic acts DURING the flow with named attack vectors (precedent kill, non-vacuity witness, definitional soundness — R27–R29). It is generative-adjacent: a kill becomes a re-dispatch trigger. The auditor acts AFTER the flow over a fixed schema; its job is to certify that the dispatch ran as designed, not to extend the substance of the inquiry. Same role would force one model choice across two very different cost profiles (`opus` for skeptic, `haiku` for auditor).

### Collapse `writer` → `auditor` (the writer audits itself)

Rejected because of independence. An agent cannot ship and gate-keep its own output without circular logic. The whole point of the auditor seat is to certify the writer's artifact against rules the writer also tried to satisfy — if those are the same agent, the certification is empty. This is the same reason peer review separates author and reviewer.

---

## Why not more roles

Three additions were considered and rejected:

### "Moderator" or "orchestrator" as a child role

Rejected because the parent skill IS the moderator. Adding it as a child role doubles control flow: the parent already enacts the strategist role (per `domainspec-subagents-strategy` R24), composes the spec, gates the user confirm, dispatches children in one message (R8), collects returns. Introducing a child "moderator" would either duplicate parent responsibilities (waste) or fragment them (race conditions on who actually owns the dispatch).

### "Translator" between corpora

Rejected because translation between corpora is a writer-with-a-different-target, not a distinct epistemic function. A finding ported from `research-physics/` to `research-emergence/` is authored by a writer reading the source corpus's closure vocabulary and outputting the target corpus's closure vocabulary. That is the existing writer role with a parameter; promoting it to a sibling role would imply translation has its own failure mode (it doesn't, beyond the writer's existing fidelity bar) and its own gate (it doesn't, beyond the auditor's existing closure-mark check).

### "Validator AFTER review" (post-dispatch design re-check)

Rejected because review IS the post-dispatch audit. Adding another layer is loop-cap drift — every additional layer is a temptation to re-litigate decisions the user already gated. The discipline of the R20 `max_loops` budget depends on each loop carrying a single audit, not a chain. If a post-review concern surfaces, the appropriate response is a fresh dispatch, not an additional in-dispatch role.

---

## Why "4+1" (not "5")

The 4-work + 1-meta count is presentational discipline, not a numerology preference. The work-roles share a property — they are graded on what they *produced* during the dispatch and they author the per-agent files (R12). The validator does neither: it produces an `accept/reject` decision against a checklist, and that decision lives in the spec's validator-block, not in `<corpus>/<topic-slug>/agents/`. Separating them syntactically (the "4+1") reflects this distinction in the constitution and in the per-agent file schema.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [principle.md](./principle.md) | `umbrella` | The eight refinements; role taxonomy is one of them. |
| [relation-to-base.md](./relation-to-base.md) | `sibling` | Where the role taxonomy sits relative to `domainspec-subagents-strategy` (which is role-agnostic). |
| [decisions-log.md](./decisions-log.md) | `sibling` | Chronological log of the design decisions, including role naming and 4+1 split. |
| [../../constitution/research-constitution.md](../../constitution/research-constitution.md) | `codified-in` | R4–R8 (the four work-roles) and R26's validator gate (the meta-role). |
| [../anti-bias-vector-composition/principle.md](../anti-bias-vector-composition/principle.md) | `consumed-by` | The tension check is enforced by the validator (meta-role) over angles assigned to work-roles. |
