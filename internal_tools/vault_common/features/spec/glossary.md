---
tags: [vault, infrastructure, kernel, vault_common, glossary]
node_type: spec
is_session: false
layer: architecture
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-05-18
---

# Glossary: vault_common

Quick-reference glossary for the kernel's vocabulary. Authoritative behavior lives in [SPEC.md](SPEC.md) and the linked source documents; this file is the readable distillation.

## Feature Language

| Term | Meaning in this feature | Related Concepts |
| ---- | ----------------------- | ---------------- |
| **Kernel** | The thin shared library at the bottom of the `/domainspec/internal_tools/` dependency DAG. Owns walker + frontmatter + edges + sqlite + embedder Protocol + event sink. Nothing in kernel depends on a subsystem. | every concept below |
| **Subsystem** | A package under `internal_tools/<name>/` that consumes the kernel and owns one private DB file. Five candidates: `vault_ctl`, `vault_telemetry`, `convergence_runner`, `graph_retrieval`, `pipeline`. | [SPEC §Cross-Feature Dependencies](SPEC.md#cross-feature-dependencies) |
| **Seam** | A cross-subsystem communication channel. The only legal seam between subsystems is the **EventSink** (writer/reader on append-only JSONL) plus the read-only **Walker**. Direct DB-to-DB reads are forbidden. | [EventSink](#eventsink), [discovery D-4](../../../../vault/discovery/two-layer-platform-architecture/discovery.md#d-4-subsystems-communicate-via-events-and-the-read-only-walker--never-by-reaching-into-each-others-stores) |
| **Carve-out** | An exception to the bidirectionality audit rule. Two exist: edges into `.claude/skills/**` and `.claude/agents/**` are forward-only-by-target; edges with `is_session: true` source are forward-only-by-source. | [R-Edge-Skill-Carveout](SPEC.md#extractedges), [R-Edge-Session-Carveout](SPEC.md#extractedges) |
| **Snapshot zero** | The content-addressed manifest of `/domainspec/vault/`'s state at `vault/snapshots/2026-05-16-v0.json`. The single highest-leverage artifact in the platform plan — every other artifact can be back-filled, this one cannot. | [discovery D-2](../../../../vault/discovery/two-layer-platform-architecture/discovery.md#d-2-vault_ctl-is-foundational-snapshot-zero-on-day-1) |
| **Schema version** | The integer in every node's frontmatter that names which kernel schema the node validates against. Bumps require a migration script under `vault/migrations/`. | [SchemaVersion](#schemaversion), [constitution Rule 4](../../../../vault/constitution/frontmatter-ownership-constitution.md) |
| **Form-invariance** | The platform's structural promise that the same primitives (walker, FM, edges, ...) operate uniformly across subsystems. The kernel exists to make this mechanical rather than aspirational. | [discovery §1 Position](../../../../vault/discovery/two-layer-platform-architecture/lenses/01-cross-cutting-analysis/findings.md) |

## Terms

| Term | Concept ID | Type | Definition | Source |
| ---- | ---------- | ---- | ---------- | ------ |
| **WalkVault** | `vault_common.WalkVault` | Capability | Read-only streaming iteration of every non-excluded markdown file under the configured vault roots, yielding parsed `VaultDoc` records. | [SPEC §WalkVault](SPEC.md#walkvault) |
| **ParseFrontmatter** | `vault_common.ParseFrontmatter` | Capability | Type-checked validation of a node's YAML frontmatter against the per-`node_type` Pydantic subclass — the single executable form of the conventions doc. | [SPEC §ParseFrontmatter](SPEC.md#parsefrontmatter) |
| **ExtractEdges** | `vault_common.ExtractEdges` | Capability | Surface every typed edge a document declares (frontmatter fields + `## Connections` table), tagged with the carve-out reason when applicable. | [SPEC §ExtractEdges](SPEC.md#extractedges) |
| **OpenDatabase** | `vault_common.OpenDatabase` | Capability | Open a SQLite connection owned by a single subsystem, run optional migrations, enforce `foreign_keys=ON`. | [SPEC §OpenDatabase](SPEC.md#opendatabase) |
| **EmbedText** | `vault_common.EmbedText` | Capability | Provider-agnostic vector embedding of arbitrary text, declared only as a `typing.Protocol`; the kernel ships no provider. | [SPEC §EmbedText](SPEC.md#embedtext) |
| **EmitEvents** | `vault_common.EmitEvents` | Capability | Append a structured `{ts, kind, **fields}` line to a JSONL file owned by the emitter. The only sanctioned cross-subsystem seam. | [SPEC §EmitEvents](SPEC.md#emitevents) |
| **MigrateSchema** | `vault_common.MigrateSchema` | Capability | The naming and idempotency contract for `vault/migrations/v<N>-to-v<N+1>.py` scripts that backfill the corpus when `schema_version` bumps. | [SPEC §MigrateSchema](SPEC.md#migrateschema) |
| **VaultDoc** | `vault_common.VaultDoc` | Entity | The carrier produced by the walker: `path`, `text`, `content_hash` (sha256-hex), `frontmatter` (dict-or-None), `body`, plus derived `is_session` and `node_type` accessors. | [SPEC §WalkVault](SPEC.md#walkvault) |
| **NodeFrontmatter** | `vault_common.NodeFrontmatter` | Entity (Pydantic v2) | The universal-fields base for every vault node: `schema_version`, `node_type`, `layer`, `nature`, `status`, `version`, `last_updated`, `tags`, `is_session`. Per-`node_type` subclasses add type-specific required fields. | [SPEC §ParseFrontmatter](SPEC.md#parsefrontmatter), [constitution Rule 2](../../../../vault/constitution/frontmatter-ownership-constitution.md) |
| **Edge** | `vault_common.Edge` | Value Object | An immutable `(src, dst, edge_type, source_loc, forward_only_reason)` record. `frozen=True`; equality by all fields. | [SPEC §ExtractEdges](SPEC.md#extractedges) |
| <a id="schemaversion"></a>**SchemaVersion** | `vault_common.SchemaVersion` | Int field | A monotonically increasing integer in every node's frontmatter. Default `1`; bumps require a migration script. The kernel rejects nodes whose `schema_version` is unknown to the running kernel. | [constitution §Migration discipline](../../../../vault/constitution/frontmatter-ownership-constitution.md) |
| **NodeType** | `vault_common.NodeType` | Enum (Literal) | The 16 epistemic roles enumerated in [conventions Appendix D](../../../../vault/ontology-conventions.md#appendix-d-quick-reference--the-7-labels): `axiom`, `premise`, `constitution`, `discovery`, `implementation-plan`, `spec`, `audit`, `conceptual`, `test`, `backlog`, `readme`, `research`, `domainspec-subagents-strategy`, `subagents-research`, `subagents-findings`, `discussion`. (Current code: 6 values — see [OQ-A](SPEC.md#oq-a-nodetype-enum-is-currently-6-values-in-code-16-in-the-conventions).) | [conventions Appendix B](../../../../vault/ontology-conventions.md#appendix-b-label-value-catalog) |
| **Layer** | `vault_common.Layer` | Enum | The five system-scope values — `ontology`, `architecture`, `market`, `domain`, `application` — with multi-value allowed. | [conventions §Layer](../../../../vault/ontology-conventions.md#layer--system-scope) |
| **Nature** | `vault_common.Nature` | Enum | The four document-format values — `explanatory`, `procedural`, `reference`, `technical` — with multi-value allowed. | [conventions §Nature](../../../../vault/ontology-conventions.md#nature--document-format) |
| **Status** | `vault_common.Status` | Enum | The maturity lifecycle: `draft`, `exploratory`, `active`, `consolidated`, `evergreen`. | [conventions §Status](../../../../vault/ontology-conventions.md#status--maturity-level) |
| **Veracidade** | `vault_common.Veracidade` | Enum | External-evidence confidence (`high`, `medium`, `low`). REQUIRED on `axiom`, `premise`; OPTIONAL on `discovery`, `audit`; FORBIDDEN on every other type. | [conventions §veracidade and convicção](../../../../vault/ontology-conventions.md#veracidade-and-convicção--the-two-dimensions-of-confidence) |
| **Convicção** | `vault_common.Convicção` | Enum | Team commitment (`high`, `medium`, `low`). Same applicability as Veracidade. | [conventions §veracidade and convicção](../../../../vault/ontology-conventions.md#veracidade-and-convicção--the-two-dimensions-of-confidence) |
| **Embedder** | `vault_common.Embedder` | Interface (Protocol) | `dim: int`, `embed(text) -> list[float]`, `embed_batch(texts) -> list[list[float]]`. The Protocol names no provider, no model, no API. | [SPEC §EmbedText](SPEC.md#embedtext) |
| **EventSink** | `vault_common.EventSink` | Service | A path-owning writer and reader for an append-only JSONL stream. The cross-subsystem seam. UTC timestamp injected by the kernel; payload fields are a writer/reader contract per `kind`, not validated. | [SPEC §EmitEvents](SPEC.md#emitevents) |
| **Config** | `vault_common.Config` | Value Object | Immutable carrier of `vault_roots: tuple[Path, ...]`, `exclude_dirs: tuple[str, ...]`, `db_root: Path`. `DEFAULT_CONFIG` points at `/domainspec/vault/`. | [SPEC §WalkVault](SPEC.md#walkvault) |
| **EDGE_TYPES** | `vault_common.EDGE_TYPES` | Frozenset[str] | The closed set of canonical edge verbs from [conventions Appendix C](../../../../vault/ontology-conventions.md#appendix-c-edge-type-catalog) — 21 forward edges plus their inverses, with `contradicts` symmetric. An edge whose verb is not in this set is rejected at extraction time. | [SPEC §ExtractEdges](SPEC.md#extractedges) |
| **Migrations contract** | `vault_common.MigrateSchema` | Contract | The naming + idempotency rules for `vault/migrations/v<N>-to-v<N+1>.py` scripts: one script per `schema_version` increment, one-shot, idempotent. Scripts live in `vault/migrations/`, not inside the kernel package. | [constitution §Migration discipline](../../../../vault/constitution/frontmatter-ownership-constitution.md), [SPEC §MigrateSchema](SPEC.md#migrateschema) |

## Cross-Feature Terms

| Term | Concept ID | Type | Definition | Source |
| ---- | ---------- | ---- | ---------- | ------ |
| **`governs` edge** | `ontology.governs` | Edge | Forward inverse of `governed-by`. Declares that a constitution mechanically governs another node. Surfaced by the kernel's `extract_edges`; the runtime witness (a sibling `governance.py` module — see [OQ-C](SPEC.md#oq-c-codebase-already-contains-kernel-modules-the-discovery-never-sanctioned-governance-cycles-amendments-bets)) is currently in the kernel pending discovery ratification. | [conventions Appendix C](../../../../vault/ontology-conventions.md#appendix-c-edge-type-catalog) |
| **`derives-from` edge** | `ontology.derives-from` | Edge | The chain backbone — research derives from strategy, discovery derives from research, premise derives from discovery, constitution codifies premise. Acyclic by [`edge-acyclicity-constitution.md`](../../../../vault/constitution/edge-acyclicity-constitution.md). | [conventions Appendix C](../../../../vault/ontology-conventions.md#appendix-c-edge-type-catalog) |
| **Frontmatter-ownership constitution** | `vault.frontmatter-ownership` | Constitution | Ratifies that `vault_common` owns the single Pydantic model for vault frontmatter. Codified at v1.0.0. | [`frontmatter-ownership-constitution.md`](../../../../vault/constitution/frontmatter-ownership-constitution.md) |
| **Ontology conventions** | `vault.ontology-conventions` | Constitution | The canonical schema text: 16 node_types, 5 layers, 4 natures, 5 statuses, veracidade/convicção applicability, 21-edge catalog with carve-outs. The kernel Pydantic model is its executable form. | [`ontology-conventions.md`](../../../../vault/ontology-conventions.md) |
| **Two-layer platform architecture discovery** | `vault.two-layer-platform-architecture` | Discovery | The load-bearing artifact behind this kernel — D-1 (kernel + thin subsystems), D-3 (greenfield), D-4 (events + walker as the only cross-subsystem seam), and the kernel API table in lens 01 §2. | [`two-layer-platform-architecture/discovery.md`](../../../../vault/discovery/two-layer-platform-architecture/discovery.md) |
| **Subsystem (`vault_ctl`, `vault_telemetry`, ...)** | `internal_tools.<name>` | Feature | A package that consumes the kernel and owns one private DB file. Communicates with peers only via events + walker. | [SPEC §Produces For](SPEC.md#produces-for) |

## Maintenance Rules

- Use Feature Language for kernel-internal terms a reader needs before formal concept rows make sense (Kernel, Subsystem, Seam, Carve-out, Snapshot zero, Schema version, Form-invariance).
- Derive formal concept rows from [SPEC.md Concept Registry](SPEC.md#concept-registry); any new entry there requires a row here.
- Keep each definition to a single domain-level sentence that *teaches* the term rather than restating the SPEC table.
- Every link must resolve to its authoritative source anchor — kernel SPEC, conventions, or constitution.
- When a kernel `R-*` rule changes or a concept name changes, update this glossary in the same PR as the SPEC change.
- Do not introduce new canonical behavior here; update the SPEC or the upstream constitution/conventions first.
- If a Cross-Feature Term comes from a sibling subsystem's spec once those land, link to that spec rather than restating the term.
