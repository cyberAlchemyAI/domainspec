---
tags: [vault, discovery, ontology, architecture, platform, infrastructure]
node_type: discovery
is_session: false
layer: ontology, architecture
nature: explanatory, reference
status: exploratory
version: 0.2.0
last_updated: 2026-05-18
---

# Two-Layer Platform Architecture

> **v0.2.0 update (2026-05-18):** This discovery was originally drafted on 2026-05-17 directly from the 3 lenses, without an intermediate research-layer document. On 2026-05-18 a post-hoc `research/research.md` and `research/research-synthesis.md` were added under the new vault convention, and the three lens files were moved from `lenses/NN-<slug>.md` into per-lens folders `lenses/NN-<slug>/findings.md` with `dispatch_status: backfilled-no-prompt-recoverable` (the original dispatch prompts are unrecoverable). The discovery's commitments were not edited; the version bump records the structural alignment. If the post-hoc research surfaces tensions with current commitments, those are filed as open questions in `research.md` for a future v0.3.0.

## Objective

Codify the platform-level architecture decision behind the operational infrastructure that supports the graded vault: a thin shared kernel under `vault_common/` plus four-or-five subsystems that communicate via events and a read-only walker. Scope the decision to the universal vault platform (not any one feature), and pin the load-bearing fork — frontmatter ownership — as the next gate. End state: a single discovery node future constitutions, plans, and subsystem READMEs can derive from.

---

## 1. Business Context

### Why now

Five infrastructure proposals (graph retrieval, vault CLI, telemetry, convergence runner, Lean pipeline) landed independently and converged on the same five primitives: walker, frontmatter parser, SQLite kernel, embedding interface, structured event sink. Building them as five separate tools would re-implement those primitives five times and produce five incompatible event sinks — a textbook instance of the framework's own residue-accounting prediction at infrastructure scale. The 30-day measurement clock for the four residues predicted by the parent `graph-as-residue-attractor` discovery has already started; snapshot zero cannot be retroactively taken.

### What's broken

- **Primitive duplication risk** — five proposals each carry their own walker + frontmatter parser, with no shared kernel (lens 01 §2, table of shared primitives).
- **Frontmatter-ownership is undecided** — without a single Pydantic model owning the executable form of `vault/ontology-conventions.md`, every subsystem would parse `convicção`, `node_type`, `verification` slightly differently (lens 01 §6).
- **`vault_ctl` is mis-scoped** — bundles three orthogonal jobs (invariant validation, promotion/demotion policy, session-close); needs splitting (lens 01 §4).
- **No stable test corpus** — every subsystem would test against HEAD, making regressions invisible and dissolving the EVōC convergence claim's falsifiability (lens 03 Gap 5).
- **Frontmatter migration is undisciplined** — the `verification:` field was added mid-conversation and pre-existing lenses are now non-conformant; no `schema_version:`, no migration directory, no policy (lens 03 Gap 6).
- **Session/discovery immutability (I3) is wishful** — the constitution claims session and discovery READMEs are immutable but nothing enforces it (lens 03 Gap 9).
- **Snapshot zero not yet taken** — the before/after diff that the residue prediction depends on requires a fixed before that does not yet exist on disk under `vault/snapshots/` (lens 02 §6).

### What stays the same

- **maestro-trama's `vault_routing/` and `semantic_index/`** continue serving maestro-trama; the new platform is greenfield under `/domainspec/internal_tools/` and does not migrate or extend them (lens 01 §5).
- **`ontology-conventions.md`** remains the canonical schema text; the platform encodes it but does not replace it.
- **The 16 `node_type` values, 5 `layer` values, 4 `nature` values, 5 `status` values, and 21-edge catalog** of the current conventions are inputs, not subjects of this discovery.
- **Application-layer features** (house_project, financas_pessoais, football-stats-oracle) opt in; this discovery does not mandate their adoption.
- **The framework-level claims** of `graph-as-residue-attractor` (the four predicted residues, the EVōC convergence metric, the Yoneda identity criterion) are not re-litigated here.

---

## 2. Core Concepts

### Shared kernel (`vault_common/`)

A single Python package under `/domainspec/internal_tools/vault_common/` owns the primitives every subsystem needs: walker (`walk_vault`, `parse_doc`), Pydantic `Frontmatter` model, edge extractor over `## Connections` blocks, SQLite kernel (open/migrate/blob), embedder protocol, and append-only JSONL event sink. **Anything not on the kernel's API surface is subsystem-private.** This is the *thin* part — kernel changes are reviewed against five downstream consumers known at compile time.

### Subsystems on strict seams

Five candidate subsystems sit on the kernel:

| Subsystem | Exclusive responsibility | Private store |
|---|---|---|
| `vault_ctl` | Frontmatter validation, edge-resolvability, snapshot CLI | none (emits events) |
| `vault_telemetry` | Read-only metrics, residue counters, drift reports | `telemetry.db` |
| `convergence_runner` | Multi-agent dispatch, normalization, persistence of traces | `convergence.db` |
| `graph_retrieval` | Two-layer RAG: typed-edge graph + per-intent compose functions | `vault_graph.kuzu`, `vault_index.db` |
| `pipeline (Lean)` | Vault↔Lean correspondence, formalization queue | `pipeline/queue.db` + Lean files |

**The defining rule:** subsystems communicate via events and the read-only walker — they never reach into each other's SQLite stores. (Lens 01 §3.)

### The platform reframe

The five proposals are *not* five independent tools that happen to share primitives. They consume the same input substrate (graded vault) and four of the five write to a SQLite-shaped store, embed text, or emit events others want to read. They are **one platform with subsystems on a shared kernel.** Fusing them into a monolith buries genuinely separable lifecycles (telemetry runs nightly; `convergence_runner` is per-experiment; Lean sync is per-formalization); building independently guarantees five divergent walkers. Kernel + thin subsystems with strict seams is the right shape. (Lens 01 §1.)

### Empirical floor (three subsystems, not five)

To answer the parent discovery's two empirical questions — (i) do the four predicted residues generate new constitutions in 30 days; (ii) can we re-dispatch the Gödel lens with hard-fetch and capture it structurally — the minimum platform is **`vault_ctl` MVP + `vault_telemetry` residue-counter-only + `convergence_runner` dispatch-and-log-only**. `graph_retrieval` and `pipeline (Lean)` are deferred. (Lens 02 §3.)

### Snapshot zero

A content-addressed manifest of `/domainspec/vault/`'s state, written to `vault/snapshots/2026-05-16-v0.json`, tagged `vault-corpus-v0`. **This is the single highest-leverage artifact in the platform plan.** Every other artifact can be back-filled; a snapshot taken in week 3 cannot become a snapshot taken in week 1. It must be hand-written if `vault_ctl`'s snapshot CLI is not yet available. (Lens 02 §6; lens 03 Gap 5.)

---

## 3. Decisions Taken

### D-1. Adopt the platform reframe

- **Decision:** Build one platform under `/domainspec/internal_tools/` with a `vault_common/` kernel and four-or-five thin subsystems on strict seams. Reject both the five-independent-tools shape and the monolithic-tool shape.
- **Rationale:** Lens 01 §1. Five independent tools re-implement the kernel five times and produce five incompatible event sinks (provable: all five proposers independently named the same five primitives). A monolith buries separable lifecycles. Kernel + subsystems is the structure that preserves form-invariance across subsystems while letting each own its content domain — the platform respects the framework's own two-layer thesis applied to itself.
- **Status:** Adopted. Source: lens 01 (cross-cutting analysis), corroborated by the dependency DAG in lens 02 §1.

### D-2. `vault_ctl` is foundational; snapshot zero on day 1

- **Decision:** `vault_ctl` MVP (validator + edge linter + `snapshot` CLI) is the first subsystem built. Snapshot zero is taken on day 1 — hand-written if necessary, before any code.
- **Rationale:** Lens 02 §2 and §6. `vault_ctl` sits on the hard side of every dependency edge: kuzu ingest fails on malformed frontmatter, telemetry is noise without typed edges, convergence boundary classifier reads the same fields. The 30-day residue window does not pause for tooling. Snapshot zero is the single highest-leverage artifact; every other artifact can be back-filled, this one cannot.
- **Status:** Adopted. The hand-written-if-necessary clause is the operational guarantee — there is no acceptable trajectory where snapshot zero is delayed for tooling readiness.

### D-3. Greenfield in /domainspec, not migration from maestro-trama

- **Decision:** Build `vault_common/` and the subsystems fresh under `/domainspec/internal_tools/`. Do not extend or migrate maestro-trama's `vault_routing/` or `semantic_index/`. Those continue serving maestro-trama.
- **Rationale:** Lens 01 §5. The user's directive is explicit; cost to land `vault_common/` fresh is ~3 engineer-days. Conventions from maestro-trama can inform design but the implementation is owned by /domainspec and evolves independently. Mixing ownership across repos couples evolution timelines that should be free to diverge.
- **Status:** Adopted.

### D-4. Subsystems communicate via events and the read-only walker — never by reaching into each other's stores

- **Decision:** The cross-subsystem seam is the append-only JSONL event sink (`EventSink.emit` / `read_events`) plus the read-only walker. No subsystem reads another's SQLite database directly. Each subsystem owns its tables in its own DB file (`telemetry.db`, `convergence.db`, `vault_index.db`).
- **Rationale:** Lens 01 §3. This rule is what makes "thin subsystems" enforceable rather than aspirational. If `vault_telemetry` could read `convergence.db` directly, the boundary is folklore and the convergence-runner's schema becomes a public API by accident.
- **Status:** Adopted.

### D-5. Re-scope `vault_ctl`; absorb promotion/demotion into `vault_telemetry`; route session-close to the existing skill

- **Decision:** `vault_ctl` keeps frontmatter validation, edge linting, snapshot CLI. Promotion/demotion candidate flagging moves to `vault_telemetry` (it is a derived signal over `status × veracidade × convicção × age`). Session-close stays in the existing `close-session` skill and does not become an internal tool.
- **Rationale:** Lens 01 §4. The three jobs are orthogonal and have different lifecycles; bundling them forces co-deployment of unrelated changes.
- **Status:** Adopted.

### D-6. Empirical floor = `vault_ctl` + `vault_telemetry` residue-counter-only + `convergence_runner` dispatch-and-log-only

- **Decision:** The minimum platform required to run the parent discovery's two empirical questions is these three subsystems at their MVP scopes. `graph_retrieval` and `pipeline (Lean)` are deferred past week 4.
- **Rationale:** Lens 02 §3. The empirical questions are diff-shaped (residue counter) and trace-shaped (convergence dispatch log) — neither requires graph retrieval or Lean. Deferring them concentrates the budget on the load-bearing artifacts. Lens 02 §5 Risk 5 names the failure mode explicitly: `graph_retrieval` is more interesting than counter-reports and will steal the budget if not schedule-deferred.
- **Status:** Adopted.

### D-7. Stable test corpus is non-negotiable

- **Decision:** Tag `vault-corpus-v0` at the current vault state. Pin all subsystems to read from that tag by default; switch the tag forward only deliberately.
- **Rationale:** Lens 03 Gap 5. Cost to close: under one hour. Cost of not closing: the EVōC convergence metric's falsifiability silently dissolves because every regression is attributable to "vault evolution." Highest-leverage single action in the gap catalog.
- **Status:** Adopted.

---

## 4. Alternatives Considered

### A-1. Five independent tools sharing nothing

- **Shape:** Each proposal builds its own walker, frontmatter parser, SQLite kernel, embedder, and event sink.
- **Why considered:** Maximum subsystem autonomy; no kernel coordination tax.
- **Why rejected:** Five divergent walkers, five frontmatter schemas, five incompatible event sinks within a quarter. The framework's own residue prediction (schema-layer concerns recurring at infrastructure scale) becomes a self-inflicted wound. (Lens 01 §1.)

### A-2. One monolithic vault tool

- **Shape:** Fuse all five proposals into a single CLI with subcommands.
- **Why considered:** Eliminates the kernel/subsystem boundary entirely; no API surface to design.
- **Why rejected:** Buries genuinely separable lifecycles. Telemetry runs nightly, `convergence_runner` is per-experiment, Lean sync is per-formalization. Co-deploying these forces release cadence to match the slowest mover. (Lens 01 §1.)

### A-3. Migrate / extend maestro-trama's `vault_routing/` and `semantic_index/`

- **Shape:** Build on top of the existing tooling in the sibling repo.
- **Why considered:** Code reuse; would save the ~3 engineer-days of kernel work.
- **Why rejected:** User directive is explicit (greenfield in /domainspec). Conventions can be informed but implementation must be owned by /domainspec to evolve independently. The 3 engineer-day cost is dwarfed by the cost of cross-repo coupling. (Lens 01 §5.)

### A-4. Each subsystem owns its frontmatter view

- **Shape:** No central Pydantic model; each subsystem parses the frontmatter it needs.
- **Why considered:** Minimal kernel API; subsystems are free to ignore fields they don't care about.
- **Why rejected:** Schema becomes folklore. Five tools each interpret `convicção` slightly differently; telemetry silently drops documents `vault_ctl` accepts; `pipeline` rejects documents `graph_retrieval` happily indexes. The fork in §6 of lens 01 names this as the load-bearing decision — recommended resolution: `vault_common` owns the model. **Final decision deferred to the frontmatter-ownership constitution (see OQ-1).**

### A-5. Build `convergence_runner`'s boundary classifier in the empirical floor

- **Shape:** Ship the convergence boundary classifier (bottleneck distance? edge-overlap? Jaccard?) as part of the MVP.
- **Why considered:** Without it, "two agents have converged" is not operationally measurable.
- **Why rejected:** The operational proxy is undefined; building it under shipping pressure means a similarity metric is chosen for convenience and the threshold hand-tuned. Lens 02 §5 Risk 2 makes this explicit: refuse to merge the classifier until the operational proxy is named in a discovery file. The empirical floor ships dispatch + structured log only.

### A-6. Defer snapshot zero until `vault_ctl` snapshot CLI is ready

- **Shape:** Wait for tooling; take snapshot zero when it can be done correctly.
- **Why considered:** A hand-written snapshot is messier and might need to be regenerated.
- **Why rejected:** The 30-day residue window starts now. A messy snapshot taken on day 1 is strictly better than a clean snapshot taken on day 14; the former preserves the before-state, the latter destroys the experiment. (Lens 02 §6; lens 02 §5 Risk 3.)

### A-7. Master ontology file as the cross-repo coherence mechanism

- **Shape:** One canonical `ontology-conventions.md` lives somewhere central; siblings copy or fork it.
- **Why considered:** Solves Gap 2 (cross-repo drift) head-on.
- **Why rejected:** Creates a new artifact whose own evolution would need governing (S5 recursion). Reference-from-siblings (or `git subtree`) is lighter. (Lens 03 §4 "Honest negatives.")

---

## 5. Open Questions

### OQ-1. Frontmatter ownership — `vault_common` or per-subsystem?

- **Question:** Does `vault_common` own a single Pydantic `Frontmatter` model that every subsystem validates against, or does each subsystem own its private view of the frontmatter?
- **Recommendation:** `vault_common` owns it. The Pydantic model is the executable form of `vault/ontology-conventions.md`; the constitution becomes code. Every other architectural decision (shared walker, event-bus seam, per-subsystem store) is downstream of this one.
- **Next move:** Write `vault/constitution/frontmatter-ownership-constitution.md` ratifying the recommendation, then implement `vault_common.frontmatter`. (Lens 01 §6.)

### OQ-2. Schema versioning for frontmatter evolution

- **Question:** What is the right schema-version field to add to every node? `schema_version:` in the frontmatter, with per-version backfill scripts in `vault/migrations/`?
- **Recommendation:** Yes — `schema_version: <int>` in every non-session node; migrations directory with one script per version bump; each migration is one-shot and idempotent. ~2 hours per migration.
- **Next move:** Resolve OQ-1 first (the Pydantic model is what `schema_version` annotates), then write the first migration to backfill `verification:` on the existing lenses that pre-date the field. (Lens 03 Gap 6.)

### OQ-3. Immutability enforcement — hook, CI, or both?

- **Question:** Is immutability enforcement on sessions and discovery READMEs (I3) a pre-commit hook, a CI check, or both? At what mtime granularity?
- **Recommendation:** Pre-commit hook for fast feedback; CI re-check for defense in depth. Granularity: any modification to a file under `vault/sessions/` or `vault/discovery/*/README.md` whose mtime predates HEAD is rejected.
- **Next move:** Land the hook first (~1 hour); CI parity can wait until two subsystems compose. (Lens 03 Gap 9.)

### OQ-4. Relation to maestro-trama's `vault_routing/` and `semantic_index/`

- **Question:** Beyond "they continue serving maestro-trama" — is there any shared schema contract, or is the platform-to-platform boundary fully opaque?
- **Recommendation:** Fully opaque for now. If a use case emerges that requires shared data (e.g., a cross-repo telemetry roll-up), revisit; do not pre-design for a coupling that may never be needed.
- **Next move:** None until a concrete use case appears.

### OQ-5. Do the four predicted residues need first-class frontmatter, or can telemetry derive them?

- **Question:** Telemetry's residue counter needs to identify which residue a new constitution addresses. Should this be an explicit `addresses-residue:` tag in frontmatter, or derived from edge-traversal over existing fields?
- **Recommendation:** Start with an explicit `addresses-residue:` enum on new constitutions; derivation can replace it later if the edge-traversal proxy proves accurate. Explicit tags are cheap to add and unambiguous; derivation has no ground truth to validate against until enough constitutions exist.
- **Next move:** Add to the frontmatter-ownership constitution scope (OQ-1); a new enumerated field is exactly what that constitution should ratify.

### OQ-6. Convergence boundary classifier — operational proxy?

- **Question:** "Two agents have converged iff their hom-presheaves agree per node" is a theorem statement. What is the operational proxy — bottleneck distance on persistence diagrams, edge-overlap on resulting graphs, Jaccard on cited node IDs?
- **Recommendation:** Refuse to merge a classifier until the proxy is named in a discovery file with a falsification criterion. Until then, `convergence_runner` ships dispatch + structured log only. (Lens 02 §5 Risk 2.)
- **Next move:** Open a sibling discovery `convergence-boundary-classifier-definitions/` when the parent-discovery work surfaces a candidate proxy.

---

## 6. Six-Week Schedule (provisional)

A schedule is reproduced here from lens 02 §4 as a non-binding placeholder. It is **not** an implementation plan — that belongs in a separate `implementation-plan` node when the frontmatter-ownership constitution lands.

| Weeks | Work |
|---|---|
| 1–2 | `vault_common/` kernel (greenfield) + `vault_ctl` MVP. **Day 1: snapshot zero.** |
| 3–4 | `vault_telemetry` residue-counter MVP + `convergence_runner` dispatch-only. First weekly residue report end of week 3. Re-dispatch Gödel lens with hard-fetch end of week 4. |
| 5–6 | `graph_retrieval` MVP (single intent: backward `derives-from` traversal) — useful for the analyst reading week-4 telemetry, not as precondition. |
| Defer | Convergence boundary classifier (gated on OQ-6); `pipeline (Lean)` (content-gated on at least one axiom clearing the convergence bar); session-close runner; multi-intent retrieval; telemetry dashboard. |

---

## 7. Risk Register (carried from lens 02 §5)

| # | Risk | Trigger | Mitigation |
|---|------|---------|-----------|
| 1 | Form-invariance metric ill-defined; blocks telemetry. | Spec doc stalls week 1. | Descope telemetry MVP to residue-counter only; treat form-invariance as discovery-level open question. |
| 2 | Convergence boundary classifier built before theory ready. | Pressure to ship → similarity metric chosen for convenience. | Refuse to merge classifier until OQ-6 names an operational proxy. |
| 3 | 30-day measurement window starts late or missed. | End of week 1, no snapshot in `vault/snapshots/`. | Hand-write snapshot zero on day 1. Tool retrofits later. |
| 4 | Re-dispatched Gödel lens returns same content (model recall as web-fetched). | Re-dispatch cites no URLs absent from original. | `convergence_runner` MUST persist tool-call traces; telemetry counts `verification=web-fetched` only when trace contains ≥1 WebFetch call. |
| 5 | `graph_retrieval` consumes the budget meant for telemetry. | End of week 3, half-built graph layer and no telemetry report. | Schedule places `graph_retrieval` explicitly after the first telemetry report. |

---

## 8. Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/two-layer-platform-architecture/README.md` | `derives-from` | The discovery's framing, claim, and summary originate from the folder README. |
| `vault/discovery/two-layer-platform-architecture/lenses/01-cross-cutting-analysis/findings.md` | `derives-from` | Lens 01 supplies the platform reframe (D-1), the kernel API table, the subsystem boundaries (D-4), the `vault_ctl` re-scope (D-5), the greenfield decision (D-3), and the frontmatter-ownership fork (OQ-1). |
| `vault/discovery/two-layer-platform-architecture/lenses/02-critical-path/findings.md` | `derives-from` | Lens 02 supplies the dependency DAG, the foundational `vault_ctl` decision (D-2), the empirical floor (D-6), snapshot zero as day-1 artifact, the six-week schedule, and the risk register. |
| `vault/discovery/two-layer-platform-architecture/lenses/03-gap-analysis/findings.md` | `derives-from` | Lens 03 supplies the stable-test-corpus decision (D-7), the frontmatter-migration question (OQ-2), the immutability-enforcement question (OQ-3), and the honest defers (Vladimir, backups, publication pipeline). |
| `vault/discovery/two-layer-platform-architecture/research/research.md` | `derives-from` | Post-hoc cross-lens synthesis added under v0.2.0 convention alignment (2026-05-18). |
| `vault/discovery/two-layer-retrieval/README.md` | `cites` | Sibling discovery owning the retrieval-architecture decisions for `graph_retrieval`. This discovery scopes `graph_retrieval` as one subsystem on the shared kernel; it does not re-litigate retrieval-layer design (intent taxonomy, faithfulness criterion, supersedes pathology) — those live in the retrieval discovery. The two are folded together for execution sequencing per the retrieval README's last "Next Move." |
| `vault/ontology-conventions.md` | `cites` | The kernel's Pydantic `Frontmatter` model is intended to be the executable form of this constitution. OQ-1's recommendation depends on it; D-4 inherits its 21-edge catalog and bidirectionality rule. |

> **Note on the sibling edge.** Per v0.2.0 alignment (2026-05-18), the sibling-discovery reference uses `cites` (catalog-approved) rather than the catalog-absent `relates-to` originally drafted; the retrieval discovery is cited as the authority for `graph_retrieval`'s internal design.

---

## Source dispatch

This discovery was promoted from the lens-set at `vault/discovery/two-layer-platform-architecture/lenses/` (lenses 01, 02, 03) and the folder README, via lifecycle step 7 of the `/domainspec-subagents-strategy` skill on 2026-05-17. Provenance for every decision and alternative traces back to one of those four files; nothing in this discovery is invented beyond what the source material supports. Open questions reflect gaps the source material itself names — none are fabricated.
