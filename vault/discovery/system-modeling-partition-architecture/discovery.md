---
tags: [folder-structure, partition, ownership-axis, schema-instance, arcanum, sessions, migration, two-layer]
node_type: discovery
is_session: false
layer: architecture, ontology
nature: explanatory
status: draft
version: 0.2.0
last_updated: 2026-06-09
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

## Revision 2026-06-09 — Partition tree finalized for scaffolding

When this design was operationalized into the `partition-scaffold` skill
(`.claude/skills/partition-scaffold/`), the user settled the top-level shape. The decisions
below **supersede the body's ownership-primary stance (D-1) and the migration discussion**;
they are stated on their own merits, not derived from `folder-structure-fractal` (whose
constraints the user has explicitly set aside for this tree). An earlier draft of this
section justified R-1 by appeal to the knowledge-taxonomy repo "already organizing
flat-by-subject" — that warrant was **false** (KT is flat-by-artifact-type:
`discoveries/ decisions/ findings/ …`, with no `knowledge/` parent) and has been removed.
R-1 stands on the premature-boundary argument below instead.

- **R-1 — Subject is the top axis; ownership lives in frontmatter.** The top level groups
  knowledge by subject under `knowledge/{system_design_knowledge, domain_knowledge, vault}`.
  Ownership (shared vs per-project) is a frontmatter property, not the path's primary axis.
  *Justification (honest version):* the factor-out seam D-1 wanted to encode in the path is
  an **unproven bet** — the discovery itself concedes "premature externalization freezes a
  moving target." Until the method stabilizes enough to externalize, keeping ownership cheap
  to change (frontmatter) rather than expensive (path) is the disciplined choice; lift it to
  the path *after* the seam is proven, not before. The shared half is still partly visible
  as top-level siblings (`arcanum/`, `domainspec/`), so the boundary is deferred, not erased.
- **R-2 — `internal_tools/` is a nested sub-project with a mirrored tree.** It receives a
  full mirror of the per-project tree **minus the shared layer it inherits from the parent**
  — excluded: `arcanum`, `domainspec`, `system_design_knowledge`, `internal_tools` itself —
  so the mirror is `schema/`, `knowledge/{domain_knowledge, vault}`, `implementation/`,
  `research/`, `sessions/`, `experiments/`. **Escape hatch for the unbounded-recursion
  concern:** if `internal_tools/` grows too large to live as a nested sub-project, it is
  promoted to its **own repository** (a referenced dependency), not deepened further. That
  promotion boundary — "too big → new repo" — is the bound on the recursion; the criterion
  itself (when is it "too big") is deferred. Recursion remains a scoped exception for a real
  buildable sub-system; thin nodes (premises, axioms) are still never inflated to folders.
- **R-3 — New partitions/modalities:** `domainspec/` (the framework exposed via a symlink shim,
  submodule conversion deferred — shared, edit-ban applies); `vault/` (knowledge *about* the ontology); `schema/`
  (see R-6); `experiments/` (pre-registered falsifiable `node_type: experiment` — a modality
  like `sessions/`). `experiment` is now a **ratified** vocabulary value, not a local
  extension (amendment `vault/amendments/2026-06-09-add-experiment-node-type.md`).
- **R-4 — Research is the birthplace; promotion routes onward.** There are **no separate
  top-level `decisions/`, `findings/`, or `discoveries/` partitions.** A finding starts in
  `research/`; once it matures it routes to a `knowledge/` partition
  (`system_design_knowledge`, `domain_knowledge`, or `vault`) **or** to `implementation/`,
  with lineage preserved by the `derives-from` back-anchor (horizontal routing, not `mv` —
  per the Migration model section above). Decisions/findings/discoveries are *node_types and
  states within* `research/` and `knowledge/`, not folders of their own.
- **R-5 — `implementation/` interior is governed by `folder-structure-constitution.md`
  (v3.0.0).** "How implementation is done" is not an open question for this discovery: the
  consolidated three-layer architecture (`/infrastructure → /domains → /shared_services`,
  screaming architecture, layer purity, acyclic imports) already rules the inside of
  `implementation/`. The scaffold creates the `implementation/` slot and points to that
  constitution; it does not re-decide the interior.
- **R-6 — `schema/` is the project-local schema-extension layer over the base in
  `domainspec/`.** The base ontology contract (the `node_type` set, edge catalog, frontmatter
  spec, and the `vault_common` validators) ships **inside the `domainspec/` submodule** and is
  read-only in a consumer project. Top-level `schema/` is where *this* project records local
  vocabulary/edge extensions layered on that base. (This is what `experiment` would be in a
  consumer project; here, in the framework repo itself, it was ratified directly into the
  base.) This also resolves the "two schema graphs" worry: `schema/` everywhere is the local
  layer; the base is always in `domainspec/`.
- **R-7 — Every new project must carry a root `README.md` stating its objective.** The
  scaffold prompts the user for a one-sentence objective and writes it into the root README;
  the first version may be a single sentence, expanded later. A project without a stated
  objective is not scaffolded.
- **R-8 — The tree is embodied as data.** Recorded in
  `.claude/skills/partition-scaffold/partition-manifest.json` (per-folder roles in its
  `readme` fields). If the manifest and this discovery drift, **this discovery is the
  authority and the manifest is the bug.**
- **R-9 — The canonical code ontology (L1) is scaffolded into `schema/code-ontology/`.** A
  new project receives the closed L1 vocabulary — **25 meta-types, 29 typed edges in 4
  families** (R_B backend / R_CF cross-feature / R_U intra-UI / R_X cross-layer), with
  machine-checkable signatures and a stdlib validator (`validate_ontology.py` + tests). It is
  reconciled from the DomainSpec paper §4 (24 meta-types / 26 edges) and the framework repo's
  `TAXONOMY.md` + `RELATIONSHIPS.md` (25 / 29); the repo superset is canonical, and the repo's
  conflated "backend" edge group is split into a true-backend family plus the **new R_CF
  cross-feature family** so the partition is honest (the paper could not express
  backend@A → backend@B edges). `code-ontology.json` is the source of truth; the markdown is a
  view. It lives in **top-level `schema/` only** — `internal_tools` inherits it, not clones it
  (R-6). *Residual (resolved this session):* the framework repo's own `domainspec-l1-extractor`
  agent (both `.claude` and `.codex` mirrors) and `audit_richness.py` were reconciled from the
  paper's stale "24/26" counts (and the two phantom meta-types) to the canonical 25/29 — the
  `.codex` mirror was the last to be fixed. The scaffold bundle remains self-contained and does
  not depend on them.
- **R-10 — The `knowledge/` partitions are populated from the framework, not empty stubs.**
  Reached via an assess→validate subagent pass (two assessors mapping `domainspec/vault` and
  `house_project`'s dev-knowledge; two validators reconciling ownership + proving every
  symlink/seed source exists and every relative-symlink depth resolves). The split:
  - **`vault/` SYMLINKS the canonical ontology docs** (read-only, single source, zero drift)
    from the `domainspec/` mount — the 6 loose ontology files + 9 ontology constitutions
    (ontology, vault-folder-structure, discovery-structure, schema-amendment-discipline,
    frontmatter-ownership, edge-acyclicity, cross-repo-canonicalization, governs-runtime-witness,
    domain-tagging). The project authors its own `axiom/ premise/ conceptual/ discovery/` (stubs).
  - **`system_design_knowledge/` SEEDS editable copies** of the project-specializable dev
    constitutions (development-practices, folder-structure, frontend, commit-message);
    `event-system`/`robot-talks` are stubs. **Copy, not symlink** — these are *meant* to diverge
    per project (the inverse of the ontology docs). This split matches the
    cross-repo-canonicalization constitution's own copy-vs-symlink rule.
  - **`domain_knowledge/`** mirrors vault's node-type folders (`axiom/ premise/ conceptual/
    discovery/ sessions/`), empty.
  This is the operational form of your "symlink the ontology documents" decision: it RESOLVES
  the R-6 tension (vault/ no longer duplicates the base — it *links* to it). The scaffold
  creates `domainspec/` as a symlink to the framework (`link_to_framework`, idempotent — an
  existing mount is left alone) so the relative symlinks resolve. Symlinks/seeds are top-level
  only; the `internal_tools` mirror inherits the ontology from its parent. `convicção-bet-ledger`
  is omitted by default (opt in with `bets/`). **Deviation from `house_project`:** it co-locates
  ontology constitutions under `docs/vault/constitution/framework/`; our model routes them to the
  dedicated `vault/` instead — cleaner ontology/dev separation.

**Enforcement status unchanged.** Still `status: draft`, still gate-first (OQ-6). The
scaffold *creates* the tree; it does not *enforce* placement — the `layer:` validator remains
unwired, so the rules above are discipline, not guarantees. (The `node_type` validator *is*
wired and now accepts `experiment` per R-3.) OQ-2 (where the framework/project seam is cut)
is **deferred** under R-1, not resolved: the seam stays in frontmatter until the method is
stable enough to externalize.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/folder-structure-fractal/discovery.md` | `derives-from` | Lineage only. This discovery retains the "folders project one axis, the rest is frontmatter" idea (A-4) but, per Revision 2026-06-09, **sets aside folder-structure-fractal's binding constraints** (ownership-primary framing and the recursion ban) on the user's explicit call. Not load-bearing for the current tree. |
| `vault/discovery/cross-tree-mirroring-for-llm-coercion/discovery.md` | `derives-from` | Extends the L₁↔L₂ mirror with a **subject-primary** top-level axis and a promotion-vs-routing migration model; inherits the "navigational signal, not correctness guarantee" demotion. |
| `vault/discovery/schema-of-schemas/discovery.md` | `derives-from` | Reuses the one-schema / two-gate / typed-residue (`open_questions`) / gate-first posture; this discovery adds the **subject** organizing axis, the `system_design_knowledge` partition, and (R-6) the project-local `schema/` layer over the submodule base. |
| `vault/ontology-conventions.md` | `cites` | The `node_type` set, the edge catalog, the `is_session` + sessions forward-only-by-source carve-out, and the `operationalized-by` skill carve-out are reused unchanged as the substrate for sessions-as-modality and arcanum-as-executable. |
