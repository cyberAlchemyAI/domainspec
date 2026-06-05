---
tags: [folder-structure, partition, ownership-axis, schema-instance, arcanum, sessions, migration, two-layer]
node_type: discovery
is_session: false
layer: architecture, ontology
nature: explanatory
status: draft
version: 0.1.0
last_updated: 2026-06-02
created_by: victorboscaro@gmail.com
---

# System-Modeling Partition Architecture — Ownership as the Primary Top-Level Axis

> How a project repo is partitioned to model **any** system "our way": one global schema, subject-partitions for knowledge, sessions as a distinct modality, `arcanum` as the executable projection — organized at the top by **ownership** (shared-framework vs per-project) so the shared half can factor out into an installable app.

---

## Objective

This discovery synthesizes a design conversation into a candidate partition model for a project that is being modeled with DomainSpec. It proposes that the **primary axis of the top-level directory layout is ownership** (shared-framework vs per-project), names a `system_design_knowledge` partition as the first-class home for build-method knowledge that is currently scattered, recognizes `sessions` and `arcanum` as distinct modalities, and sketches a migration model that separates vertical promotion from horizontal routing.

It is **exploratory design, not proof, and nothing here is enforced.** It inherits the enforcement-blocked posture of [`schema-of-schemas`](../schema-of-schemas/discovery.md) (0/10 symmetries runtime-enforced; gate-first is the standing precondition). Much of what follows is **recognition of existing convention**, not invention — flagged inline so the genuine proposals stand out.

---

## Context (prior art first)

Three upstream discoveries and the live ontology already settle most of the substrate. Naming them is the point — the contribution here is the *organizing axis*, not the pieces.

- **[`folder-structure-fractal`](../folder-structure-fractal/discovery.md)** — the **maximal recursive fractal** (`README/schema/instance/lenses/` at every depth) was **rejected** under adversarial evaluation (cost > benefit); only the **top-level `schema/` vs `instance/` split survived (D-1)**, and `layer:` was kept as a **navigational cross-check, not a classifier (A-4)**. This discovery honors both: no per-depth recursion, folders project one axis.
- **[`cross-tree-mirroring-for-llm-coercion`](../cross-tree-mirroring-for-llm-coercion/discovery.md)** — proposed the L₁↔L₂ three-sibling mirror, then **demoted "structure forces correctness" → "navigational signal."** Inherited unchanged.
- **[`schema-of-schemas`](../schema-of-schemas/discovery.md)** — **one** global schema, two-level schema/instance fibration, **typed residue** (`open_questions`), **two gates** (schema-validity + residue-typing), and the honest **0/10 enforced / gate-first** posture.
- **Live ontology** ([`ontology-conventions.md`](../../ontology-conventions.md)) already provides: `sessions/` folder + `is_session: true` + **forward-only-by-source** carve-out ("session is *not* a node_type"); the `research` node_type and its `discovery → implementation-plan → spec` lifecycle; and the `operationalized-by`/`operationalizes` edge into `.claude/skills/**` (**forward-only-by-target** carve-out). So sessions-as-own-modality and arcanum-as-executable are *existing* facts, restated, not new claims.

**The load-bearing motivation** is the non-programmer goal: *a person should be able to model a system without knowing programming.* If so, the knowledge of **how a system is built** cannot be assumed from the user — it must be **represented explicitly** in the repo. That is what forces a `system_design_knowledge` partition distinct from `domain_knowledge`.

---

## The partition model

**One global `schema/`** (the types: `node_type`s, edge catalog, frontmatter contract). Everything else is `instance/`, partitioned by **subject**:

| Partition | About | Who authors it |
|---|---|---|
| `domain_knowledge/` | the problem world | the **user** (domain expert) |
| `system_design_knowledge/` | how to build the system | the **framework** (reusable method) |
| `implementation/` | the system built | generated |
| `research/` | unresolved exploration (birthplace) | either |

Plus two things that are **not** subject-partitions:
- **`sessions/`** — a *modality*, not a subject. `is_session: true`, dedicated folder, forward-only edges, **never promoted**. (Existing convention — recognized.)
- **`arcanum/`** — the **executable projection** of `system_design_knowledge`: skills + agents + workflows. Lives in the carved-out `.claude/**` zone; linked from declarative method nodes by `operationalized-by` (forward-only). Declarative (a method constitution) ↔ executable (the skill that runs it).

**Folders project exactly one axis per level** (subject at the knowledge level); everything multi-axis — `status`, `veracidade`, `convicção`, edges — stays in frontmatter. This is the explicit consequence of `folder-structure-fractal` A-4: the path is a redundant partial encoding, not the whole schema.

---

## Alternatives — the top-level primary axis

| | Top-level axis | Verdict |
|---|---|---|
| **A1** | **Modality** (knowledge / event / machine) | Homogeneous, but does not predict any future physical boundary. |
| **A2** | **Subject-flat** (domain / system_design / research / impl / sessions / arcanum as siblings) | The earlier sketch. **Heterogeneous top level** — mixes subject + modality + machine. The flaw that motivated this discovery. |
| **A3** | **Ownership** (shared-framework vs per-project) | **Adopted (tentative).** Predicts the future boundary: the shared half factors out into an installable app. |

A3 resolves A2's heterogeneity *by subtraction*: if `arcanum` + `system_design_knowledge` are **shared** and become an external app, they physically leave the repo. The per-project top level is then no longer a mixed bag — the machine and the method are a referenced dependency, not siblings.

```
# Today (one repo)              # Future (shared half factors out)
<project>/                      framework/   (installed app/dependency)
├── arcanum/           ───┐       ├── arcanum/
├── system_design_kn/  ───┼──→    ├── system_design_knowledge/
├── schema/ (base)     ───┘       └── schema/ (base)
├── domain_knowledge/
├── implementation/             <project>/   (per-project + framework ref)
├── research/                   ├── domain_knowledge/
└── sessions/                   ├── implementation/  research/  sessions/
                                └── framework → (dependency)
```

This generalizes the maestro-trama → house_project pattern (house *adopts* maestro's folder-structure constitution verbatim) into an installable framework, rather than a copy-paste.

---

## Trade-offs

- **A node has both a subject and an ownership; only one can be the path.** Choosing ownership at the top pushes subject to level-2. Acceptable: ownership is the axis that becomes a *physical* boundary, so it earns the top slot.
- **The boundary leaks.** A `domain_knowledge` concept ("eligible fund") is *realized-by* an `implementation` node ("`EligibleFund` filter") — two nodes + a `realized-by` edge, **not** one node in two folders. This is `component-cartography` M6 ("shared schema does not buy clean instances") accepted, not fought.
- **Shared/per-project is itself a bet.** It assumes the method is stable enough to externalize. If `system_design_knowledge` is still churning, premature externalization freezes a moving target (gate-first applies: stabilize before factoring out).

---

## Migration model — two different movements

The conversation surfaced that "a research node goes to `domain_knowledge` *or* `implementation`" fuses two distinct operations. Keeping them separate prevents lineage loss.

- **Vertical — promotion.** The existing lifecycle (`research → discovery → implementation-plan → spec`) plus `status` maturation (`draft → … → evergreen`). Anchored; **never silently reversed** (demote/promote protocol). Already in the ontology.
- **Horizontal — routing.** *Which subject-partition* a finding belongs to. A research node does not "move"; it **feeds a discovery** whose Decision routes the knowledge onward, and lineage is preserved by the `derives-from` back-anchor. The routing *rule itself* ("about the problem-world → `domain_knowledge`; about how-to-build → `system_design_knowledge`; buildable → `implementation`") is itself `system_design_knowledge`.
- **Migration is a typed operation, not `mv`.** Move + repoint inbound edges + leave the `derives-from` anchor. A candidate `arcanum` skill; gate-first says do it **manually first**, automate (a commit hook) only after the shape stabilizes.

No new edge is coined here for horizontal routing (see OQ-3) — `derives-from` already carries the anchor, and inventing an edge inline violates the catalog discipline.

---

## Open Questions

- **OQ-1** — Is **ownership** the right primary top-level axis, or **modality**? Decision recorded below at low conviction.
- **OQ-2** — Does the shared half become a literal external app / installed dependency, and on **what boundary** is the cut made? (User intent: yes — "vão tipo um app, fora do repo." The exact seam — does the base `schema/` go with the framework or stay per-project? — is unresolved.)
- **OQ-3** — Does horizontal routing need a dedicated `resolves-to`/anchor edge, or does `derives-from` suffice? If needed, it must go through the schema-amendment gate — **not** coined inline.
- **OQ-4** — Is `system_design_knowledge` **one** partition, or does it split into the **reusable method** (ships with the framework) vs **this system's design** (project-specific output of applying the method)? The three-way distinction (method / this-design / domain) is unresolved.
- **OQ-5** — Do the epistemic disciplines (claim ≤ proof, cite-don't-rediscover) belong in a *generated* project's `system_design_knowledge`, or are they meta to the framework repo only?
- **OQ-6 (enforcement)** — None of this is enforced. Inherits `schema-of-schemas`' gate-first precondition: the `node_type` validator must be wired into CI before any partition or migration rule binds.

---

## Decision

Tentative, low conviction (this is a `draft` synthesis of one conversation, not a reviewed verdict):

- **D-1** — Top-level **primary axis = ownership**. Shared half = `arcanum` + `system_design_knowledge` (+ base `schema`), on a trajectory toward an external installable app. Per-project half = `domain_knowledge` + `implementation` + `research` + `sessions`.
- **D-2** — **One** global schema; subject is a level-2 partition; **no per-depth recursion** (honors `folder-structure-fractal` D-1 and A-4).
- **D-3** — Sessions keep their **existing** modality (`is_session`, forward-only, dedicated folder, never promoted) — recognized, not redesigned.
- **D-4** — `arcanum` is the executable projection of `system_design_knowledge`, carved-out under `.claude/**` + workflows, linked by `operationalized-by` (forward-only).
- **D-5** — **Not enforced; exploratory.** Gate-first before any of this binds.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/folder-structure-fractal/discovery.md` | `derives-from` | Extends D-1's narrowed top-level schema/instance split to a repo-level **ownership** axis, and honors A-4 (folder-as-classifier rejected — folders project one axis, not the whole schema). Does NOT re-propose the rejected maximal recursion. |
| `vault/discovery/cross-tree-mirroring-for-llm-coercion/discovery.md` | `derives-from` | Extends the L₁↔L₂ mirror with an ownership-primary top-level axis and a promotion-vs-routing migration model; inherits the "navigational signal, not correctness guarantee" demotion. |
| `vault/discovery/schema-of-schemas/discovery.md` | `derives-from` | Reuses the one-schema / two-gate / typed-residue (`open_questions`) / gate-first posture; this discovery adds the ownership organizing axis and the `system_design_knowledge` partition on top. |
| `vault/ontology-conventions.md` | `cites` | The `node_type` set, the edge catalog, the `is_session` + sessions forward-only-by-source carve-out, and the `operationalized-by` skill carve-out are reused unchanged as the substrate for sessions-as-modality and arcanum-as-executable. |
