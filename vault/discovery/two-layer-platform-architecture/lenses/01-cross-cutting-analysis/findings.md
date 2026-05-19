---
tags: [vault, lens-findings, two-layer-platform-architecture]
node_type: findings
is_session: false
layer: architecture
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
dispatch_status: backfilled-no-prompt-recoverable
---

# Findings — Cross-Cutting Platform Analysis

## Objective

Evaluate whether five proposed infrastructure tools (retrieval, vault CLI, telemetry, convergence runner, Lean pipeline) are genuinely five independent tools or one platform with five subsystems on a shared kernel.

## Findings

## 1. Position

**Adopt the platform reframe — one platform, thin shared kernel, five subsystems with strict seams.** The five proposals are not five independent tools that happen to share primitives; they all consume the same input substrate (the graded vault: markdown + frontmatter with `status`, `node_type`, `veracidade`, `convicção`, edges), and four of the five write to a SQLite-shaped store, embed text, or emit structured events that others want to read. Treating them as independent guarantees five divergent walkers, five frontmatter schemas, and five drift-detection stories within a quarter. However, fusing them into one monolithic tool buries genuinely separable lifecycles (telemetry runs nightly; `convergence_runner` is invoked per-experiment; Lean sync is per-formalization). The right shape is `vault_common/` kernel + five thin subsystems with strict seams. All of it lives under `/domainspec/internal_tools/`.

## 2. Shared-primitives spec (`vault_common/`)

| Primitive | Responsibility | API surface |
|---|---|---|
| **Walker** | Recursive scan of vault roots, exclusion rules, `is_session` filter, content-hash | `walk_vault(roots) -> Iterator[VaultDoc]`, `parse_doc(path) -> VaultDoc \| None` |
| **Frontmatter model** | Typed view of `status`, `node_type`, `veracidade`, `convicção`, `layer`, `nature`, `is_session`, edges, lean_ref | Pydantic `Frontmatter` + `VaultDoc(path, text, content_hash, fm, frontmatter_json)` — single Literal-enforced taxonomy |
| **Edge extractor** | Parse outbound links and typed edges from frontmatter and `## Connections` blocks | `extract_edges(doc: VaultDoc) -> list[Edge(src, dst, verb, source_loc)]` — single canonical verb taxonomy shared across subsystems |
| **SQLite kernel** | Open/close, extension load, migration runner, blob-pack helpers | `open_db(path, *, migrations=[...]) -> Connection`. Each subsystem owns its tables; one DB file per subsystem (`telemetry.db`, `convergence.db`, `vault_index.db`) |
| **Embedding interface** | Provider-agnostic embed of text → `list[float]` with declared dim | `Embedder` protocol: `dim: int`, `embed(text) -> list[float]`, `embed_batch(...)`. Two implementations possible (local Gemma + Gemini API); subsystems depend on protocol |
| **Event sink** | Append-only JSONL log of structured events | `EventSink.emit(kind, **fields)`, `read_events(path, *, kind=None)`. Used by all subsystems — telemetry ingests events from the others |
| **Config / paths** | Vault roots, exclude dirs, DB locations | Single `vault_common.config` |

Anything *not* in this list is subsystem-private.

## 3. Subsystem boundaries

| Subsystem | Exclusive responsibility | Reads from kernel | Writes (private) | Seam to others |
|---|---|---|---|---|
| `graph_retrieval` | Two-layer RAG: graph layer over typed edges + per-intent compose-functions; also owns the kuzu graph | walker, fm-model, edge-extractor, embedder | `vault_graph.kuzu`, `vault_index.db` (vector tables) | Returns ranked subgraphs via API |
| `vault_ctl` | Invariant enforcement: frontmatter validity, edge resolvability, backlink symmetry; promotion/demotion candidate flagging; snapshot CLI | walker, fm-model, edge-extractor | nothing persistent; emits **events** | Emits `validation.failed`, `promotion.candidate`, `snapshot.taken` events |
| `vault_telemetry` | Read-only metrics aggregator: vault health, form-invariance signals, convergence telemetry, drift; static HTML reports | walker (snapshot), fm-model, **event-sink (reader)** | `telemetry.db` (metrics tables only) | Never writes back to vault; never mutates other subsystems' DBs |
| `convergence_runner` | Multi-agent dispatch, normalization, metrics, boundary classifier | walker (corpus snapshot), embedder (for normalization), event-sink (writer) | `convergence.db` (runs, agent_outputs, scored_pairs) | Emits `convergence.run.completed` events |
| `pipeline (Lean)` | Vault↔Lean correspondence schema; formalization queue; status sync check | walker, fm-model (specifically `lean_ref`) | `pipeline/queue.db` + Lean repo files | Emits `formalization.status.changed` events |

**The defining rule:** subsystems communicate via events and the read-only walker, never by reaching into each other's SQLite files.

## 4. Re-architecture recommendations

- **`vault_ctl` is mis-scoped (too big).** It bundles three orthogonal jobs: (a) invariant validation, (b) promotion/demotion *policy*, (c) the session-close runner. Split: keep `vault_ctl` for validation + CLI; move promotion/demotion candidate logic to `vault_telemetry` (it's a derived signal over status × veracidade × convicção × age); move session-close into the existing `close-session` skill — it does not belong in an internal tool.
- **`graph_retrieval` is its own subsystem, not a layer added to anything else.** Since we're building fresh in /domainspec (not extending maestro-trama's `vault_routing`), `graph_retrieval` owns both vector and graph layers. The per-intent compose-functions are core IP.
- **`vault_telemetry` absorbs promotion-flagging and convergence-aggregation.** Both are metric-shaped; both want the snapshot-diff machinery telemetry already needs. `convergence_runner` emits raw events; `vault_telemetry` owns all aggregation and reporting. Otherwise you get two HTML report stacks.
- **`pipeline (Lean)` stays as-is** — its data model is genuinely foreign (Lean files, proof status). Use `vault_common.frontmatter` for `lean_ref` parsing; otherwise self-contained.

**Net:** 5 proposals → 4 subsystems on a shared kernel: `graph_retrieval`, `vault_ctl`, `vault_telemetry`, `convergence_runner`, `pipeline`. (Five if you count Lean pipeline separately; four if you count it as platform-adjacent.)

## 5. Greenfield, not migration

The user's directive is explicit: build in /domainspec, not /maestro-trama. The existing `vault_routing/` and `semantic_index/` in maestro-trama serve maestro-trama's specific vault and continue to do so. The new platform under `/domainspec/internal_tools/` is the canonical infrastructure for /domainspec's vault (and any other /domainspec-aligned vaults — house_project, financas_pessoais — that opt in).

Cost: ~3 engineer-days to land `vault_common/` from scratch (walker, frontmatter Pydantic model, edge extractor, SQLite kernel, embedder protocol, event sink). No code is moved from maestro-trama. The conventions can be informed by what works there but the implementation is fresh, owned by /domainspec, evolves independently.

## 6. The architectural fork

**Who owns the frontmatter schema?**

If `vault_common` owns it, every subsystem is forced to validate against one Pydantic model, and adding a field (e.g., `lean_ref`, a new `node_type`, `addresses-residue:`) becomes a single PR with five downstream consumers known at compile time. If each subsystem owns its own view, the schema becomes a folklore contract — five tools each parsing `convicção` slightly differently, telemetry silently dropping documents `vault_ctl` accepts, `pipeline` rejecting documents `graph_retrieval` happily indexes. Every other decision (shared walker, shared store, event-bus seam) is downstream of this one.

**Decide frontmatter ownership first; the rest follows.** Recommended: `vault_common` owns it, written as a Pydantic v2 model that *is* the executable form of `ontology-conventions.md`. The constitution becomes code.

## Caveats

- Original lens dispatched 2026-05-16 by a general-purpose Sonnet subagent (6 tool calls); dispatch prompt is unrecoverable, hence `dispatch_status: backfilled-no-prompt-recoverable`.
- Source inventory referenced the five infrastructure proposal outputs that lived in conversation context only; not on disk.
- Verification level was `[local-files-read]` — no web-fetched corroboration.

## Connections

- `synthesized-by` → `../../research/research.md`
- `cited-by` → `../../discovery.md`
