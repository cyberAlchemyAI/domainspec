---
tags: [newspaper, vault, internal-tools, mcp, dashboard, editor-in-chief, cross-project]
node_type: discovery
is_session: false
layer: architecture, application
nature: explanatory
status: draft
version: 0.2.0
last_updated: 2026-05-25
created_by: victorboscaro@gmail.com
---

# Vault Newspaper — Daily Knowledge Digest for DomainSpec

## Objective

Build a daily knowledge digest subsystem for the DomainSpec vault that synthesizes recent sessions and discoveries into a typed publication, integrated as a peer of `vault_telemetry` under `internal_tools/`. The publication is consumable two ways: as a static JSON/HTML artifact for humans and as a read-only MCP resource for agents. The end state is `vault-newspaper run` produces a `daily_payload.json` + HTML page + emits events to the shared kernel sink, with the payload also addressable as `newspaper://YYYY-MM-DD` via a first-party MCP server.

## Method

This discovery is research-backed by a three-lens fan-out dispatched from this folder's `research/research.md`:

- `lenses/mcp-server-patterns/findings.md` — grounds the MCP commitments in sibling-repo evidence (`vault-routing`, `semantic-index`, `creative-harnessing`) and the canonical `mcp>=1.27.0` SDK.
- `lenses/vault-frontmatter-coverage/findings.md` — direct count over 50 sessions + 127 discovery files; verifies which frontmatter signals the Editor can rely on.
- `lenses/adversarial-review/findings.md` — hostile review of the v0.1.0 draft against project rules and evidence.

v0.1.0 was written from direct reads + one Explore subagent (maestro-trama dashboard mapping); v0.2.0 patches the six must-fix items the adversarial lens surfaced and aligns the load-bearing claims to the L3/L4 evidence. The history is preserved in git; the present text is the ratified-ready draft.

---

## 1. Business Context

### Why now

Three things converge in May 2026:

1. **Vault crossed a readable-by-hand threshold.** 50 sessions + 127 discovery-folder files (per the L4 direct count); recent load-bearing decisions like the central-thesis [PRODUCT-COMPONENTS-IDEA.md](../../../PRODUCT-COMPONENTS-IDEA.md) and [vault/discovery/knowledge-calibration-geometry/discovery.md](../knowledge-calibration-geometry/discovery.md) are accumulating faster than anyone outside the originating conversation will read them. "What happened while I wasn't looking" is no longer hypothetical.
2. **Knowledge reconciliation is the central thesis.** Per [PRODUCT-COMPONENTS-IDEA.md](../../../PRODUCT-COMPONENTS-IDEA.md) §"Knowledge as the Load-Bearing Concept" and [DRIFT-CONVERGENCE.md](../../../DRIFT-CONVERGENCE.md), drift between `C_head`, `C_spec`, and `C_system` is what DomainSpec measures. A daily synthesis is one of the most direct human-readable surfaces for that drift.
3. **A near-complete port already exists, half-wired.** `implementation/app-frontend/visualizations/newspaper/` contains a mechanical copy of `house_project`'s 5-agent Gödel Machine. Paths, vault location, and the Editor's system prompt all point at house_project's reality. Either we finish the wiring with intent, or the dead code accumulates as drift against the codebase itself.

### What's broken

Each item below has a concrete location. A problem without a location is unverified.

| Location | Problem |
|---|---|
| [implementation/app-frontend/visualizations/newspaper/evolution/editor_agent_scaffold.py:23](../../../implementation/app-frontend/visualizations/newspaper/evolution/editor_agent_scaffold.py#L23) | `VAULT_DIR` resolves to `docs/vault/conversations`, which does not exist. DomainSpec's vault lives at `vault/sessions/` and `vault/discovery/`. The Editor cannot run as-is. |
| [implementation/app-frontend/visualizations/newspaper/evolution/editor_agent_scaffold.py:152-191](../../../implementation/app-frontend/visualizations/newspaper/evolution/editor_agent_scaffold.py#L152-L191) | Editor system prompt is hardcoded to ZefraHub (FIDC, CCB, Remessa). Pointed at DomainSpec's vault it would invent ZefraHub framing for knowledge-reconciliation content. |
| [implementation/app-frontend/visualizations/newspaper/agents/system-state.md:163-168](../../../implementation/app-frontend/visualizations/newspaper/agents/system-state.md#L163-L168) | All five agent manifesto paths still say `specs/newspaper/...`. In DomainSpec they live under `implementation/app-frontend/visualizations/newspaper/`. Every agent reading its own constitution is pointed at non-existent files. |
| [.claude/skills/custom/newspaper-orchestration.md:12](../../../.claude/skills/custom/newspaper-orchestration.md#L12) | The `/newspaper` skill tells the orchestrator to silently read `specs/newspaper/newspaper-context-router.md`. That filename does not exist; the actual context router is at `orchestrator/context-router.md`. |
| `internal_tools/` (whole) | No subsystem produces a **synthesis** layer over vault content. `vault_telemetry` produces structural residue metrics; `vault_ctl` validates invariants. Neither answers "what did the last day mean." |
| `internal_tools/` (whole) | No first-party MCP surface exists for any DomainSpec internal tool. Per [PRODUCT-COMPONENTS-IDEA.md](../../../PRODUCT-COMPONENTS-IDEA.md) §"MCP status", first-party MCP is referenced but unimplemented. The newspaper is a natural read-only first MCP wedge. Sibling repos already ship three production MCP servers (`vault-routing`, `semantic-index`, `creative-harnessing`); DomainSpec ships zero (per L3 lens). |
| No edge between `house_project`, `maestro-trama`, and `domainspec` | All three projects now have a "newspaper" or "dashboard" surface. Without an explicit convergence decision, three implementations drift forever. |

### What stays the same

Explicit out-of-scope boundary. An unnamed boundary is unbounded scope.

- **`internal_tools/vault_common/` kernel API** — newspaper is a strict consumer. Walker, frontmatter Pydantic models, edge extractor, events sink: contracts unchanged.
- **`vault/` content** — newspaper is read-only against the vault. It never writes back, never mutates frontmatter, never edits sessions.
- **Existing `internal_tools/` subsystems** — `vault_ctl`, `vault_telemetry`, `convergence_runner`, `graph_retrieval`, `categorical_tooling_guard`, `tower_explorer`, `agents-telemetry` are not refactored. Inter-subsystem communication remains event-based per the existing platform constitution.
- **`implementation/app-frontend/visualizations/newspaper/` (the orphan port)** — frozen as historical reference, **modulo a single one-time redirect `README.md` write** at the top of that directory pointing readers at the new home. No other writes; no changes to the gen_*.html lineage, mockups, agent manifestos, evolution server, or telemetry DB. The Editor scaffolding (`editor_agent_scaffold.py`) is *superseded* (not deleted) by the new module.
- **`maestro-trama` and `house_project`** — no refactor of sibling projects. Cross-project schema convergence is acknowledged as a deferred decision (see §7 Open Questions).
- **The 5-agent Gödel Machine pattern itself** — preserved as a design vocabulary. Whether DomainSpec adopts the full ecosystem or only the Editor-in-Chief role is itself an open question (§7).
- **All non-vault content sources** — git activity, CI signals, code metrics, runtime telemetry. Out of scope for v0.1; vault-only.

---

## 2. Core Concepts

### 2.1 Newspaper is a subsystem of `internal_tools/`, not a "feature" or "app"

It is a peer to `vault_telemetry`. It reads via the kernel walker, writes to its own SQLite store, communicates through events, ships its own CLI. This matters because alternative framings (a script under `scripts/`, a feature under `docs/features/`, a frontend route under `apps/web/`) all leak vault-coupling assumptions into the wrong place.

**Why this over "another feature under `docs/features/`":** the per-feature SPEC layout exists for product surfaces with user-story behavior. The newspaper is closer to a recurring batch job with rendering — its discipline is event emission and idempotent re-runs, not user stories. (Counter-argument from L6: the newspaper *does* have a human reader and therefore arguably has user stories. See OQ-10.)

### 2.2 Daily Payload Contract

The Editor produces one typed JSON document per day. The contract is **inspired by, not adopting**, maestro-trama's `dashboard-contracts-constitution.md`. Maestro-trama defines R-1..R-18 across four cost tiers (C1–C4) with a five-field provenance tuple `(extractor_version, prompt_version, model_version, exemplar_set_version, catalog_version)`. The newspaper does not adopt the tier ladder (no operator-facing UI cost surface in v0.1) and uses a different provenance tuple shape — explicitly because the newspaper synthesizes prose, not dashboard panels, and the upstream `corpus_hash` is the load-bearing input.

DomainSpec's tuple, justified:

| Field | Justification |
|---|---|
| `corpus_hash` | Identifies the vault snapshot the Editor read. Equivalent to maestro-trama's `exemplar_set_version`. |
| `vault_event_cursor` | The most recent vault event id consumed; bounds the synthesis window. |
| `editor_prompt_hash` | Equivalent to maestro-trama's `prompt_version` but content-addressed. |
| `model_id` | The provider-agnostic model identifier passed at run time. |
| `model_version` | Equivalent to maestro-trama's `model_version`. |
| `generated_at` | UTC timestamp of synthesis. No maestro-trama equivalent; needed to distinguish runs that share all four hashes (e.g., re-runs against the same snapshot). |

The newspaper does **not** carry `extractor_version` or `catalog_version` because v0.1 has no extractor pipeline and no enumerated catalog. If either appears in v0.2+ the tuple grows.

**Honesty about what the tuple buys:** the payload is **auditable**, not reproducible. LLMs are non-deterministic; capturing `model_id` + `model_version` records *what was used*, not *that the output can be re-derived*. Auditability — being able to ask "what produced this article and against what input?" — is the load-bearing property.

Three contract dimensions are still useful as discipline (these are concept borrowings, not constitution adoption):

- **Schema** — declared via the Pydantic model already present in the orphan scaffold (`Article`, `ArticleMeta`, `PayloadMetadata`).
- **Instance** — the provenance tuple above.
- **Honesty** — every article cites `source_files` from the vault that load-bear the claim. If the Editor cannot cite, it does not claim. A speculation-tagged article type is permitted.

### 2.3 Editor-in-Chief as **one** agent role, not the full 5-agent Gödel Machine

The 5-agent ecosystem (Editor, Darwin-Gödel, UI Evolution, Platform Architect, Data/Backend) makes sense once there is a corpus of evolved publications and an Operator providing atomic votes. DomainSpec has neither.

**Why not the full port:** evolution requires a measurable selection signal. House_project's signal is atomic +1/-1 votes accumulated over weeks. DomainSpec has no votes and no Operator-attention budget to generate them today. Building selection machinery before the signal exists is building a measurement apparatus around a zero. (The weaker form of this argument — "neutral drift is also evolutionary" — is acknowledged from L6; the response is that neutral drift on prose synthesis without selection produces noise, not progress.)

**What "agent role" means here:** the Editor is operationalized as a Python module + a system prompt that lives at `internal_tools/vault_newspaper/prompts/editor_system.md`. The role vocabulary is preserved so the deferred 5-agent ecosystem has a clean coupling point in v0.2+. Whether to additionally expose the Editor as an invocable `.claude/agents/editor-in-chief.md` is deferred to v0.2 — agents are directly invocable, and the Editor *will* be exposable that way if the role pattern proves out.

### 2.4 MCP as the first-party agent surface

The newspaper's daily payload is the first MCP resource DomainSpec ships. Per the L3 lens, sibling repos already ship three production MCP servers — DomainSpec's is overdue, not novel. The newspaper is a *good first MCP* because it is read-only, schema-typed, and stdio-shaped.

The L3 lens identified that v0.1.0 of this discovery conflated MCP **resources** with **tools**. The split matters:

**Resources** (`@mcp.resource()` — passive, application-driven):

| URI | Returns |
|---|---|
| `newspaper://YYYY-MM-DD` | the daily payload for a specific date |
| `newspaper://latest` | the most recent published payload |

**Tools** (`@mcp.tool()` — active, model-driven):

| Tool | Purpose |
|---|---|
| `newspaper_articles_by_tag(tag, date?, limit)` | filtered articles for a tag (across one date or all) |
| `newspaper_search(query, limit)` | full-text search across published payloads |

Library: `mcp>=1.27.0`, `FastMCP` high-level API. Registration: `.mcp.json` at repo root, following the pattern from `house_project/.mcp.json`. Auth: none — stdio-only, no network surface.

### 2.5 Vault frontmatter is the Editor input — for sessions, not discoveries

The L4 lens audited frontmatter coverage:

- **Sessions** (n=50): 98% coverage on `expected_importance`, `importance_rationale`, `decisions_made`, `contradictions_found`, `specs_updated`; 94% on `promoted_candidates`.
- **Discoveries** (n=127): **0% coverage on all seven of those fields.**

The Editor's primary feature vector is therefore session-rich and discovery-sparse. v0.1 commits to:

- **Tier A signals (Editor depends on these):** `expected_importance` (within the 4–10 band — note the inflated floor), `importance_rationale` (citable prose), `contradictions_found` (genuine 59/41 split).
- **Tier B (use defensively):** `specs_updated` (67% non-empty when present).
- **Tier C (do not use as primary):** `decisions_made` (97% true, near-constant) and `promoted_candidates` (73% empty).
- **Discoveries:** Editor uses only `node_type`, `status`, `last_updated`, and the body text. A backfill of importance signals onto discoveries is **not** in v0.1 scope.

This is a substantive narrowing from v0.1.0's "rich signals" framing. Honest.

### 2.6 Cross-project convergence is real and unresolved

All three sibling projects now carry a newspaper-shaped surface:

| Project | State |
|---|---|
| **house_project** | Running 5-agent Gödel Machine; the canonical implementation. |
| **maestro-trama** | `dashboard-contracts-constitution.md` ratified; static dashboards in production for labeling-platform; same `/newspaper` skill present. |
| **domainspec** | This discovery; orphan port; about to build a focused v0.1. |

The newspaper's daily payload schema, the Editor role, and the dashboard-contracts discipline are likely the same artifact across three projects. **This discovery acknowledges the convergence and explicitly defers it** (see §7 OQ-4). The adversarial lens argued the opposite — that convergence cost grows monotonically. The decision is recorded as "defer with awareness," not "defer because it's free."

---

## 3. Folder layout and naming

### Recommended location

```
internal_tools/vault_newspaper/
├── __init__.py
├── cli.py                  # vault-newspaper {run, inspect, serve, mcp}
├── editor.py               # Editor-in-Chief: vault → daily payload
├── payload.py              # Pydantic schema (the three contract dimensions)
├── publisher.py            # daily payload → HTML
├── mcp_server.py           # FastMCP stdio server (resources + tools)
├── prompts/
│   └── editor_system.md    # LLM-agnostic system prompt anchored to DomainSpec thesis
├── templates/
│   └── publication.html.j2 # Jinja template seeded from one chosen gen_*.html
├── publications/           # generated HTML output, addressable by date
├── store/
│   └── .newspaper.db       # per-subsystem SQLite (mirrors vault_telemetry pattern)
└── tests/
```

### Naming — open

Per the L6 lens, `vault_*` is the family for kernel/governance subsystems (`vault_common`, `vault_ctl`, `vault_telemetry`, `vault_governance`); the newspaper is a renderer, not an invariant enforcer. The OQ on this remains open — see §7 OQ-1.

---

## 4. Service / execution flow

### Today (broken)

```
implementation/app-frontend/visualizations/newspaper/evolution/editor_agent_scaffold.py
  └─ reads ../../../docs/vault/conversations (✗ does not exist)
  └─ prompts LLM with ZefraHub framing (✗ wrong thesis)
  └─ writes daily_payload.json next to the script
  └─ no events, no DB, no MCP, no HTML wired
```

### Proposed (v0.1)

```
vault-newspaper run [--date YYYY-MM-DD] [--model <model_id>]
  ├─ walker over vault/sessions/ + vault/discovery/ (kernel)
  ├─ filter by date
  ├─ extract frontmatter signals (Tier A from §2.5; Tier B defensively)
  ├─ Editor.synthesize() → DailyPayload (typed, with provenance tuple)
  ├─ Publisher.render() → publications/YYYY-MM-DD.html
  ├─ store row → store/.newspaper.db
  └─ exit 0

vault-newspaper serve [--port N]
  └─ static HTTP server over publications/

vault-newspaper mcp [--stdio]
  └─ FastMCP server exposing resources + tools (read-only)

vault-newspaper inspect <date>
  └─ pretty-prints the payload + provenance tuple
```

### Events — in scope, with explicit signatures

The v0.1.0 draft was ambiguous on whether event emission was in or out of scope. v0.2 commits: **events are in scope for v0.1**, emitted to the existing `vault_common.events` sink. Integration with `agents-telemetry` (consumption of those events) remains out of scope per §1.

Three event types:

| Event | Payload |
|---|---|
| `newspaper.run.started` | `{date, corpus_hash, model_id}` |
| `newspaper.editor.token_usage` | `{date, prompt_tokens, completion_tokens, model_id}` |
| `newspaper.run.completed` | `{date, payload_path, article_count, generated_at, error?}` |

Schema review against `agents-telemetry` canon is **not** v0.1 work — these events are written to the kernel sink; whether agents-telemetry consumes them is its own decision.

### Idempotency

Re-running with the same `(date, corpus_hash, editor_prompt_hash, model_id)` is a no-op — the existing payload is returned. The provenance tuple is the cache key. Re-running with a changed prompt hash creates a new payload row; the prior is kept (audit trail), and the most recent for that date is "current."

---

## 5. Editor prompt rewrite

The single highest-leverage code change in v0.1 is the Editor system prompt. It must:

- Anchor to DomainSpec's central thesis ([PRODUCT-COMPONENTS-IDEA.md](../../../PRODUCT-COMPONENTS-IDEA.md) §"Central Thesis", §"Knowledge as the Load-Bearing Concept").
- Cite [DRIFT-CONVERGENCE.md](../../../DRIFT-CONVERGENCE.md) for the operational definition of drift.
- Use the Tier A vault frontmatter signals (§2.5) as the input feature vector — not raw text alone.
- Be LLM-agnostic. Per the project's `feedback_llm_agnostic_design` rule, no provider/model name appears in the prompt. `model_id` is passed at run time; the prompt does not name a model.
- Stay shorter than the house_project version. The original carries ZefraHub-specific guardrails that do not apply here.

The prompt is itself a vault artifact: `internal_tools/vault_newspaper/prompts/editor_system.md` with `node_type: spec` and `cites` edges to the central-thesis documents.

---

## 6. Failure modes

Surfaced by the adversarial lens. Each requires a v0.1 behavior commitment.

| Failure | v0.1 behavior |
|---|---|
| **LLM unavailable / rate-limited / 429** | `vault-newspaper run` exits non-zero, emits `newspaper.run.completed` with `error` populated, writes no payload row. Re-run is safe. |
| **Empty-vault day** (zero changes since last run) | Run produces a payload with `articles: []` and a single metadata note. This is intentional — a "nothing happened" signal is itself information. |
| **Snapshot atomicity** | `corpus_hash` is computed from a single walker pass; concurrent vault writes during the walk are tolerated because the walker emits a stable read sequence (kernel guarantee). If the kernel cannot guarantee this in practice, escalate as a v0.1 blocker. |
| **LLM cost / token budget** | The `newspaper.editor.token_usage` event surfaces per-run cost. v0.1 sets no automatic budget cap; a budget gate is a v0.2 follow-up if the daily cost trajectory warrants it. |
| **PII / secrets in vault content** | v0.1 ships **no redaction layer**. The MCP server is stdio-only and runs locally, so exposure is bounded to the local Operator. If the newspaper is ever exposed over a network transport (not v0.1), redaction becomes a blocking concern. |
| **Prompt-rewrite migration** | When the prompt is rewritten, old payloads are *not* invalidated. They are retained with their original `editor_prompt_hash`. The most-recent-payload-per-date rule may now point to a payload from a different prompt version; readers see the tuple and can reason about it. |

---

## 7. Open Questions (each with a recommendation)

### OQ-1. Folder name: `vault_newspaper` / `newspaper` / `vault_digest`?

**Recommendation:** **Reconsidered after L6.** The `vault_*` family is for invariant-enforcers (vault_common, vault_ctl, vault_telemetry, vault_governance). The newspaper is opinionated synthesis, not an invariant enforcer. Strong candidate alternatives: `newspaper/` (bare) or `vault_digest/`. Tentative new recommendation: `vault_digest/` — preserves the "vault subsystem" framing but does not falsely suggest invariant enforcement. **This needs your ratification.**

### OQ-2. Adopt the full 5-agent Gödel Machine, or only the Editor-in-Chief?

**Recommendation:** Editor-in-Chief only for v0.1. The L6 counter ("you'll never know if the 5-agent pattern was load-bearing") is real but does not flip the decision: a thin v0.1 produces evidence about *whether* synthesis-from-vault is useful at all. The full ecosystem can be added in v0.2 once the synthesis is shown to be load-bearing.

### OQ-3. MCP first, HTML first, or in parallel?

**Recommendation:** **Reconsidered after L6.** L6 argued "ship MCP only; humans can read JSON for v0.1." That is the tighter recommendation. Revised: MCP + JSON in v0.1; HTML in v0.1.5 or v0.2. The seeded `gen_*.html` template is captured as a `templates/` candidate but not wired to the CLI in v0.1. **This is a tightening; needs your ratification.**

### OQ-4. Cross-project schema convergence with `house_project` and `maestro-trama`?

**Recommendation:** Defer, with eyes open. The L6 counter (convergence cost grows monotonically) is valid. The trade-off is real: convergence-now means coordinating across three projects before any of them has shipped a stable shape; convergence-later means refactoring three implementations. v0.1 stays with "defer," with a backlog entry noting the cost projection. **Reasonable to flip if you weigh coordination cost lower than refactor cost.**

### OQ-5. What counts as "a day" — calendar UTC, calendar local, or since-last-run?

**Recommendation:** **Fixed after L6 found an idempotency bug in v0.1.0.** v0.1.0 said `since-last-run`, which breaks the `(date, corpus_hash, prompt_hash)` idempotency story — same `date` could produce different `corpus_hash` and therefore different bodies. New recommendation: **calendar UTC day**. The `--date` CLI flag is required (no implicit "today"). Re-running for the same date with the same content is a no-op; re-running for the same date after new vault writes produces a new payload row with a new `corpus_hash` and the prior row is preserved.

### OQ-6. Static daily snapshot vs continuous feed?

**Recommendation:** Static daily snapshot. Continuous feed is a different product surface — Harness Cockpit ([plan/harness/HARNESS-PRODUCT-OVERVIEW.md](../../../plan/harness/HARNESS-PRODUCT-OVERVIEW.md)) is the right home. The newspaper is meant to be *finished* — readable in 5 minutes, then closed.

### OQ-7. Where does the Editor's LLM choice live?

**Recommendation:** **Tightened after L6.** v0.1.0 said "CLI flag + env var fallback." L6 argued the env var hides identity from the provenance trail. New recommendation: **CLI flag only** (`--model <model_id>`). No env var fallback. The default is captured in run-time logs and the provenance tuple, never inferred silently.

### OQ-8. What gets deleted vs. frozen in `implementation/app-frontend/visualizations/newspaper/`?

**Recommendation:** v0.1.0 said "freeze, delete nothing." L6 argued `editor_agent_scaffold.py` will rot and confuse readers. Compromise: freeze everything *except* a one-time redirect README write at the directory top (already reconciled with §1). The Editor scaffold stays but the redirect README explicitly names it as superseded. `gen_*.html` and mockups remain as design archive. **Hardening past this — actually deleting the scaffold — is a v0.2 cleanup task once `internal_tools/vault_newspaper/editor.py` has run successfully against real vault content.**

### OQ-9. Should the `/newspaper` skill be repointed, rewritten, or replaced?

**Recommendation:** **Reconsidered after L6.** L6 argued "if 5-agent is deferred, delete the skill until v0.2 instead of writing a placeholder." That is correct. Revised: **delete `.claude/skills/custom/newspaper-orchestration.md`** as part of v0.1. The skill returns in v0.2 when there is a 5-agent ecosystem to orchestrate. v0.1's interaction model is just `vault-newspaper <command>` from the shell.

### OQ-10. Does this need a feature SPEC under `docs/features/`?

**Recommendation:** v0.1.0 said no. L6 argued the newspaper has user stories the moment it has a human reader. Compromise: **a short user-stories.md inside `internal_tools/vault_newspaper/` itself** (not a full SPEC under `docs/features/`) — three stories: (a) Operator opens publication at 7am and reads it in 5 minutes; (b) Agent queries MCP for articles by tag; (c) Operator re-runs after correcting a vault frontmatter error and confirms idempotency. This is lighter than a feature SPEC and heavier than "no contract." **Needs your ratification.**

---

## 8. What this discovery does NOT decide

Recording explicitly so we don't quietly drift later:

- **Visual design** beyond "the templates/ slot starts seeded from one existing gen_*.html."
- **Scheduling / cron.** v0.1 is on-demand.
- **Email distribution / digest delivery.** Out of scope.
- **Multi-user editorial workflow.** Single Operator + single Editor for v0.1.
- **MCP transport beyond stdio.** No HTTP, no auth, no remote.
- **`agents-telemetry` consumption** of newspaper events.
- **Network exposure / PII redaction.** Inherits from "stdio only" — if that ever changes, this becomes a blocking concern.

---

## 9. Promotion path

1. **An implementation plan** at `plan/internal-tools/INT-XX-vault-newspaper-v0.1.md` (or wherever the `internal_tools/` plans live).
2. **A subsystem README** at `internal_tools/vault_newspaper/README.md` (with `node_type: readme`).
3. **A one-time redirect README** at `implementation/app-frontend/visualizations/newspaper/README.md` (rewriting the existing file, not creating new files in the frozen tree).
4. **Delete `.claude/skills/custom/newspaper-orchestration.md`** per OQ-9.
5. **Updates to `internal_tools/README.md`** to reference the new subsystem.
6. **An optional follow-up discovery** at `vault/discovery/cross-project-newspaper-convergence/` once v0.1 has shipped one real publication.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `vault/discovery/vault-newspaper/research/research.md` | `derives-from` | This discovery v0.2 is grounded in the three-lens fan-out synthesis. |
| `PRODUCT-COMPONENTS-IDEA.md` | `cites` | The central knowledge-reconciliation thesis and the MCP-bridge product idea. |
| `DRIFT-CONVERGENCE.md` | `cites` | The operational definition of drift the Editor prompt anchors to. |
| `vault/discovery/two-layer-platform-architecture/discovery.md` | `cites` | The `internal_tools/` subsystem pattern (kernel + per-subsystem stores + events) the newspaper joins. |
| `vault/discovery/knowledge-calibration-geometry/discovery.md` | `cites` | C_head / C_spec / C_system framing the Editor will surface in daily articles. |
| `internal_tools/README.md` | `cites` | The platform constitution this subsystem joins. |
| `implementation/app-frontend/visualizations/newspaper/README.md` | `supersedes` | The orphan port's Editor role is superseded by `internal_tools/<chosen-folder>/editor.py`. Visual / evolution artifacts there are frozen as reference. |
