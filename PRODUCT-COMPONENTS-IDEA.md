---
tags: [product, ideas, domainspec, roadmap, harness, agents, rag, governance]
node_type: product-ideas
is_session: false
layer: application, architecture, governance
nature: planning, synthesis
status: draft
created: 2026-05-25
last_updated: 2026-05-25
created_by: victorboscaro@gmail.com
---

# PRODUCT IDEAS

## Introduction

Software is not just logic; it is a formalized representation of reality. Building it means codifying things that exist in the real world: rules, contracts, state changes, and flows. When these elements are unknown or poorly designed, systems silently drift. What follows is a product proposal that aims to solve for that.

Bad specification is one of the most consistent cost centers in software development. It generates rework, misaligned teams, and systems built for the wrong problem. This cost has always existed. What changed is that it is now the dominant one: agents can generate well-tested, documented code from a clear description. Writing code got cheaper. Knowing precisely what to write did not.

Two things need to be true for a system to serve its domain well over time. The team needs a shared, maintained model of what it is building — one that survives people leaving, requirements changing, and the codebase growing. And the team needs a way to discover what is actually true about the domain, because most of what a team knows at the start is hypothesis. The truth emerges through operation, evidence, and iteration. DomainSpec is built for both.

Knowledge about a domain lives in three places. In people — the practitioners who understand how things actually work, often without being able to fully articulate it. In documentation — the specs, rules, and decisions the organization has written down. And in code — what the system actually executes, regardless of what anyone intended. These three rarely agree perfectly. DomainSpec measures where they diverge and helps close the gap.

The hardest part is building good documentation — not because writing is hard, but because writing after the fact is unreliable. When teams document after building, they describe what they built, not what the domain actually requires. DomainSpec starts earlier: it structures the process of capturing what people know through interviews and domain investigation, turning that into formal decisions before a line of code is written. Every spec has an origin. Every rule traces back to something observed or decided. This is what makes the formalization trustworthy enough to build from.

---

_This document is a root-level inventory of product directions already latent in DomainSpec. It is not a commitment to build all of them. It is a map of surfaces, wedges, and source artifacts that can be promoted into specs, experiments, work-packs, or commercial packaging._

## Central Thesis

DomainSpec is a **knowledge reconciliation system**, not a spec-first framework. The core loop is:

```text
Establish Shared Knowledge (Research + Interview)
         ↓
Formalize as Domain Model (taxonomy, edges, concepts)
         ↓
Derived Artifacts (specs, tests, code, observability)
         ↓
Runtime Behavior & Feedback
         ↓
Update Knowledge ← Everything loops back here
```

Specs and code are outputs, not the system. The load-bearing concept is **unified knowledge** — the single source of truth shared between humans, systems, and agents. Drift isn't "spec diverged from code." Drift is "our mental models diverged from what the system actually does." When knowledge aligns, specs and code derive deterministically.

Core sources:

- [vault/](vault/) - the knowledge substrate: domain models, discoveries, decisions, receipts.
- [internal_tools/](internal_tools/) - knowledge platform: retrieval, calibration, convergence, telemetry.
- [plan/DOMAINSPEC-UNIFIED-PRODUCT-VISION.md](plan/DOMAINSPEC-UNIFIED-PRODUCT-VISION.md) - product vision across knowledge, specs, code, observability, governance, harness.
- [DRIFT-CONVERGENCE.md](DRIFT-CONVERGENCE.md) - operational definition of knowledge divergence and correction loops.

## Cross-Component Invariants

Taxonomy and edges are not features of any single product line — they are the substrate every component reads from and writes to. This section declares the invariants that any new component must honor. Gaps in the "complies today" column are design debts, not accidents.

### Structural invariants

| Invariant                                                                                                  | Rationale                                                                                                                                                          | Complies today                                                                          | Gaps                                                                                                                                               |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Every artifact is a typed vault node** — `node_type`, `layer`, `nature`, `status`, `created_by` required | Untyped files cannot participate in retrieval, gates, or drift computation; the schema is the join key across all components                                       | Vault Platform SDK, RAG Engine, Formal Readiness Gates, Knowledge Calibration Workbench | DomainSpec CLI (command outputs not yet node-typed), Governed UI Lab (UI variants not modeled as nodes), Agent Fleet Telemetry                     |
| **Every relationship is a typed, directed edge** — no implicit `[[reference]]` or bare file link           | Untyped references are semantically opaque; typed edges (`derives_from`, `implements`, `validates`, `contradicts`, `promotes_to`) are queryable and gate-checkable | Vault Platform SDK, Knowledge Graph IDE, Faithful RAG Engine (graph retrieval layer)    | SpecOps Console (reads gate verdicts but does not yet emit edges), Harness Cockpit (UI renders graph but does not produce it), Copilot/Skills Pack |
| **Provenance is mandatory** — every artifact links to the session, decision, or discovery that created it  | Without origin trace, drift is unattributable; "why was this created" must be answerable from the artifact itself, not from memory                                 | Session Memory / Decision Receipts, Vault Platform SDK (frontmatter + events)           | Governed UI Lab (variants lack discovery links), Agentic Runtime (execution artifacts not provenance-stamped), DomainSpec CLI                      |
| **Layer is declared, not inferred** — every artifact carries an explicit `layer` value                     | Cross-layer gates (Gate 0 → Gate 1 → validator) require knowing which layer an artifact lives in; inference creates ambiguity at promotion boundaries              | Vault Platform SDK, Code Traceability Monitor (governance tags)                         | Agent Execution Orchestrator (task outputs not layer-tagged), Harness Cockpit                                                                      |

### Behavioral invariants

| Invariant                                                                                                                       | Rationale                                                                                                                                                                                  | Complies today                                                                                                         | Gaps                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Every component participates in the drift loop** — it either emits a drift signal or acts on one; no component is drift-blind | DomainSpec's core claim is that all drift is detectable; a component that neither produces nor consumes a drift signal is outside the knowledge loop and cannot be corrected automatically | Vault Telemetry, Code Traceability Monitor, Formal Readiness Gates, Knowledge Calibration Workbench                    | Governed UI Lab, Copilot/Skills Pack, DomainSpec CLI (doctor command reads drift, but the CLI itself doesn't emit it)                        |
| **Every signal is action-bearing** — owner + action + evidence required; inert dashboards and global scores are prohibited      | Signals without actions create alert fatigue and false confidence; the product rule at the bottom of this document exists precisely for this reason                                        | Knowledge Calibration Workbench (calibration queue), Formal Readiness Gates (PASS/FLAG/BLOCK verdict with explanation) | Agent Fleet Telemetry (risk: becomes a metrics wall), Harness Cockpit (metrics panels must route to task queue, not terminate as graphs)     |
| **No locally-scoped taxonomy divergence** — a component cannot define local terminology that contradicts the shared vocabulary  | The taxonomy is the shared language between humans and agents; local overrides fragment it silently, making routing and retrieval unreliable                                               | SpecOps Console (validates terminology), Formal Readiness Gates (L1 richness check)                                    | Skills Pack (skill names and parameters are not yet governed against the taxonomy), Agentic Runtime (prompt vocabulary not yet gate-checked) |

### Process invariants

| Invariant                                                                                                                                          | Rationale                                                                                                                                                             | Complies today                                                         | Gaps                                                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Promotion between layers requires a gate** — knowledge → spec, spec → code, code → observability each have an explicit gate; no silent promotion | Silent promotions are the mechanism by which incoherent knowledge becomes scaled defects; gates are not optional checkpoints, they are the promotion mechanism itself | Formal Readiness Gates (Gate 0/1), Tower Explorer, Lean Code Validator | DomainSpec CLI (`pipeline` command promotes artifacts but gate integration is not yet product-grade), Governed UI Lab (variant → baseline promotion needs gate) |
| **Every session contributes back to knowledge** — close-session provenance must produce a vault node, not just a file                              | Sessions are the primary site of new knowledge formation; without capture, insights decay in conversation history and cannot be retrieved, cited, or gate-checked     | Session Memory / Decision Receipts (close-session protocol)            | Agentic Runtime (agent runs produce no session node), Agent Fleet Telemetry (run telemetry not linked to vault provenance)                                      |

---

## Product Lines

| Product line                        | Product idea                                                                                                                   | Best current source                                                                                                                                                                                                                                                                                                                                                                                                  | Current maturity                              |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| **Vault Platform SDK**              | **Knowledge substrate: Kernel, CLI, telemetry, retrieval, convergence runner, snapshots, events, edge/frontmatter validators** | **[internal_tools/README.md](internal_tools/README.md), [vault/discovery/two-layer-platform-architecture/discovery.md](vault/discovery/two-layer-platform-architecture/discovery.md)**                                                                                                                                                                                                                               | **internal platform**                         |
| **Faithful RAG Engine**             | **Multi-substrate retrieval over docs, code, Lean, sessions, runtime with `ContextBundle`, `RetrievalTrace`, `DefectResidue`** | **[vault/discovery/two-layer-retrieval/discovery.md](vault/discovery/two-layer-retrieval/discovery.md), [internal_tools/graph_retrieval/features/two-layer-retrieval/spec/SPEC.md](internal_tools/graph_retrieval/features/two-layer-retrieval/spec/SPEC.md)**                                                                                                                                                       | **discovery + prototype**                     |
| **Knowledge Calibration Workbench** | **Calibrate divergence between `C_head`, `C_spec`, `C_system` through elicitation, behavioral evidence, action queues**        | **[vault/discovery/knowledge-calibration-geometry/discovery.md](vault/discovery/knowledge-calibration-geometry/discovery.md)**                                                                                                                                                                                                                                                                                       | **early discovery, spec-seed ready**          |
| Knowledge Graph IDE                 | Interactive graph navigation across domain model, specs, relationships, code, runtime, and decisions                           | [docs/features/knowledge-graph-visualization/SPEC.md](docs/features/knowledge-graph-visualization/SPEC.md), [plan/harness/HAR-01-domain-graph-chain-explorer.md](plan/harness/HAR-01-domain-graph-chain-explorer.md)                                                                                                                                                                                                 | feature spec + backend/frontend route         |
| Formal Readiness Gates              | Gate 0/1/Lean-backed validation of knowledge richness, cross-layer provenance, promotion integrity                             | [vault/discovery/reflection-tower-structural-gate/README.md](vault/discovery/reflection-tower-structural-gate/README.md), [internal_tools/tower_explorer/README.md](internal_tools/tower_explorer/README.md), [internal_tools/categorical_tooling_guard/README.md](internal_tools/categorical_tooling_guard/README.md), [internal_tools/lean-code-validator/README.md](internal_tools/lean-code-validator/README.md) | runnable internal tools                       |
| SpecOps Console                     | Operator surface over vault, knowledge validation, drift, Tower, code tags, readiness, governance signals                      | [internal_tools/README.md](internal_tools/README.md), [plan/governance/GOVERNANCE-PRODUCT-OVERVIEW.md](plan/governance/GOVERNANCE-PRODUCT-OVERVIEW.md)                                                                                                                                                                                                                                                               | internal tools exist; product surface missing |
| Harness Cockpit                     | Human execution cockpit: domain graph, role workspaces, task board, metrics, decision queue                                    | [plan/harness/HARNESS-PRODUCT-OVERVIEW.md](plan/harness/HARNESS-PRODUCT-OVERVIEW.md)                                                                                                                                                                                                                                                                                                                                 | planned product layer                         |
| DomainSpec CLI                      | `domainspec init`, `doctor`, `drift`, `sync`, `pipeline`, `verify` as lightweight surface                                      | [README.md](README.md), [TOBANOV.md](TOBANOV.md), [plan/infra/INF-05-codex-runtime-distribution.md](plan/infra/INF-05-codex-runtime-distribution.md)                                                                                                                                                                                                                                                                 | product translation / packaging gap           |
| Agentic Runtime                     | Prompt-to-pipeline orchestrator, execution lifecycle, adapters, telemetry, governed retries/resume/cancel                      | [plan/agentic/AGENTIC-PRODUCT-OVERVIEW.md](plan/agentic/AGENTIC-PRODUCT-OVERVIEW.md), [docs/features/agent-execution-orchestrator/SPEC.md](docs/features/agent-execution-orchestrator/SPEC.md)                                                                                                                                                                                                                       | spec + partial backend                        |
| Copilot / Skills Pack               | Reusable agent and skill distribution for consumer repos                                                                       | [copilot/README.md](copilot/README.md), [copilot/INSTALL.md](copilot/INSTALL.md)                                                                                                                                                                                                                                                                                                                                     | real distribution surface                     |
| Code Traceability Monitor           | Code tags, drift reports, composability reports, continuous knowledge-to-code trace validation                                 | [governance/tags/README.md](governance/tags/README.md)                                                                                                                                                                                                                                                                                                                                                               | governance tool surface                       |
| Capability OS / Arcanum Superset    | Model Arcanum sigils/capabilities as governed DomainSpec concepts with compatibility adapters                                  | [docs/features/domainspec-arcanum-superset/ARCHITECTURE.md](docs/features/domainspec-arcanum-superset/ARCHITECTURE.md)                                                                                                                                                                                                                                                                                               | architecture/work-pack                        |
| Governed UI Lab                     | UI prototyping studio: variants, baselines, mutation batches, lineage, proof-gated promotion                                   | [ui-prototyping-studio:PRODUCT-VIEW.md](ui-prototyping-studio:PRODUCT-VIEW.md), [ui-prototyping-studio:SPEC.md](ui-prototyping-studio:SPEC.md)                                                                                                                                                                                                                                                                       | feature spec + backend/frontend route         |
| Agent Fleet Telemetry               | Local and org-level telemetry for agent runs, skills, costs, stuck states, mutation proposals                                  | [internal_tools/agents-telemetry/README.md](internal_tools/agents-telemetry/README.md), [plan/infra/INF-02-agent-telemetry-saturn.md](plan/infra/INF-02-agent-telemetry-saturn.md)                                                                                                                                                                                                                                   | internal design/prototype                     |
| Session Memory / Decision Receipts  | Close-session, should-close-session, signpost capture, provenance, audit trails                                                | [vault/discovery/close-session-redesign/discovery.md](vault/discovery/close-session-redesign/discovery.md), [vault/discovery/should-close-session-design/discovery.md](vault/discovery/should-close-session-design/discovery.md)                                                                                                                                                                                     | discovery/proposal                            |

## Near-Term Wedges

### 1. CLI + Doctor/Drift

Smallest external wedge: install DomainSpec, inspect a repo, produce an actionable drift/readiness report.

Candidate commands:

- `domainspec init`
- `domainspec doctor`
- `domainspec drift`
- `domainspec sync`
- `domainspec pipeline`
- `domainspec verify`

Sources:

- [README.md](README.md)
- [copilot/README.md](copilot/README.md)
- [internal_tools/README.md](internal_tools/README.md)
- [plan/infra/INF-05-codex-runtime-distribution.md](plan/infra/INF-05-codex-runtime-distribution.md)

Why it is attractive:

- small install surface;
- clear before/after value;
- can reuse internal validators;
- avoids needing the full Harness UI first.

Main gap:

- command contracts and packaging need to become product-grade rather than repo-internal.

### 2. Harness Graph + Task Board

Best visual wedge: open a domain object, see its relationships, transformation chain, governance signals, and next actions.

Sources:

- [plan/harness/HARNESS-PRODUCT-OVERVIEW.md](plan/harness/HARNESS-PRODUCT-OVERVIEW.md)
- [plan/harness/HAR-01-domain-graph-chain-explorer.md](plan/harness/HAR-01-domain-graph-chain-explorer.md)
- [plan/harness/HAR-02-role-workspace-views.md](plan/harness/HAR-02-role-workspace-views.md)
- [plan/harness/HAR-03-owner-task-board.md](plan/harness/HAR-03-owner-task-board.md)
- [docs/features/knowledge-graph-visualization/SPEC.md](docs/features/knowledge-graph-visualization/SPEC.md)

Why it is attractive:

- demonstrates the graph and governance loop clearly;
- creates a human workflow instead of another report;
- pairs naturally with Knowledge Calibration and SpecOps.

Main gap:

- MVP must choose HAR-01/HAR-02/HAR-03 and defer the rest, especially metrics dashboards, until action loops exist.

### 3. Faithful RAG / Semantic Context OS

Strong technical wedge: retrieval that preserves typed semantics and admits defects instead of returning plausible context.

Sources:

- [vault/discovery/two-layer-retrieval/discovery.md](vault/discovery/two-layer-retrieval/discovery.md)
- [vault/sessions/2026-05-25-0913-semantic-rag-discovery-review.md](vault/sessions/2026-05-25-0913-semantic-rag-discovery-review.md)
- [internal_tools/graph_retrieval/retriever.py](internal_tools/graph_retrieval/retriever.py)
- [internal_tools/graph_retrieval/networkx_corpus.py](internal_tools/graph_retrieval/networkx_corpus.py)
- [internal_tools/vault_common/embedder.py](internal_tools/vault_common/embedder.py)

Why it is attractive:

- concrete differentiation from vector-only RAG;
- can serve agents before it needs a polished UI;
- connects docs, code, theorem/proof, sessions, and runtime.

Main gap:

- needs golden traces, hard negatives, object boundaries, and a Codex-facing `ContextBundle` / `RetrievalTrace`.

### 4. Agent Execution Orchestrator

Operational wedge: deterministic lifecycle for agent tasks with routing, sandbox/worktree policy, retry/cancel/resume, and telemetry.

Sources:

- [docs/features/agent-execution-orchestrator/SPEC.md](docs/features/agent-execution-orchestrator/SPEC.md)
- [docs/interviews/agent-execution-orchestrator/PROJECT-OVERVIEW.md](docs/interviews/agent-execution-orchestrator/PROJECT-OVERVIEW.md)
- [backend/src/modules/agent-execution-orchestrator/index.ts](backend/src/modules/agent-execution-orchestrator/index.ts)
- [plan/agentic/AGENTIC-PRODUCT-OVERVIEW.md](plan/agentic/AGENTIC-PRODUCT-OVERVIEW.md)

Why it is attractive:

- makes agent work inspectable and auditable;
- gives telemetry something real to measure;
- can sit under CLI, Harness, or Copilot Pack.

Main gap:

- adapter/runtime contracts need hardening across Claude, Copilot, Codex, local CLI, and CI.

### 5. Governed UI Lab

Most tangible user-facing wedge: product/design teams generate and compare UI variants under lineage, comments, mutation batches, and gated promotion.

Sources:

- [ui-prototyping-studio:PRODUCT-VIEW.md](ui-prototyping-studio:PRODUCT-VIEW.md)
- [ui-prototyping-studio:SPEC.md](ui-prototyping-studio:SPEC.md)
- [ui-prototyping-studio:ARCHITECTURE.md](ui-prototyping-studio:ARCHITECTURE.md)
- [backend/src/modules/ui-prototyping-studio/index.ts](backend/src/modules/ui-prototyping-studio/index.ts)
- [apps/web/src/App.tsx](apps/web/src/App.tsx)

Why it is attractive:

- easier for users to feel quickly;
- already has a product view and implementation surface;
- can reuse DomainSpec governance as a differentiator.

Main gap:

- avoid auto-apply too early; keep baseline, review, and rollback as first-class constraints.

### 6. Knowledge Calibration Workbench

Emergent wedge: calibrate the difference between what people know, what specs say, and what systems do.

Sources:

- [vault/discovery/knowledge-calibration-geometry/discovery.md](vault/discovery/knowledge-calibration-geometry/discovery.md)
- [vault/sessions/2026-05-25-0318-knowledge-calibration-geometry.md](vault/sessions/2026-05-25-0318-knowledge-calibration-geometry.md)

Why it is attractive:

- expands DomainSpec from doc/code drift into people/spec/system drift;
- could become onboarding, team alignment, compliance, or operational knowledge product;
- provides the "why are we building this" layer above specs.

Main gap:

- must stay action-bearing and avoid empty dashboards or ranking people. First output should be a calibration queue, not a global score.

## Agent, Skill, Runtime, and Arcanum Surface

### Existing surfaces

| Surface                                                                                                                | What it is                                                                                  | Product possibility                                  |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| [.claude/README.md](.claude/README.md)                                                                                 | Current Claude Code harness with hooks, agents, skills, and enforcement behavior            | portable harness contract and local operator runtime |
| [copilot/README.md](copilot/README.md)                                                                                 | Public agent + skill pack for consumer repos                                                | installable DomainSpec Copilot Pack                  |
| [.agents/skills/](.agents/skills/)                                                                                     | Codex/runtime skill corpus, including DomainSpec, GSD, GitNexus, robot-talks, custom skills | cross-runtime skill registry                         |
| [.codex/agents/](.codex/agents/)                                                                                       | Codex-shaped agent definitions                                                              | runtime adapter inventory                            |
| [.github/agents/](.github/agents/) and [.github/skills/](.github/skills/)                                              | GitHub Copilot / GSD-installed agent and skill surface                                      | GitHub-native distribution                           |
| [docs/features/domainspec-arcanum-superset/ARCHITECTURE.md](docs/features/domainspec-arcanum-superset/ARCHITECTURE.md) | DomainSpec as superset substrate for Arcanum capabilities                                   | capability OS with compatibility adapters            |
| [vault/discovery/agent-skill-categorization/README.md](vault/discovery/agent-skill-categorization/README.md)           | Role/tool-surface taxonomy discovery for agents/skills                                      | governed agent marketplace and routing analytics     |
| [vault/discovery/robot-talks-definitions/README.md](vault/discovery/robot-talks-definitions/README.md)                 | Multi-agent investigation mode                                                              | decision room / adversarial review product           |
| [.agents/skills/robot-talks/SKILL.md](.agents/skills/robot-talks/SKILL.md)                                             | Operational robot-talks skill                                                               | repeatable investigation workflow                    |

### Product ideas

- **Capability OS:** model agents, skills, sigils, spells, lifecycle owners, validation experiments, and observed runs as governed capability records.
- **Cross-project Skill Repository:** internal marketplace with compatibility, versioning, tags, review status, and import policy.
- **Prompt-to-Pipeline UI:** user sees selected route, agents, skills, risks, evidence, and fallback paths before execution.
- **Agent Mutation Pipeline:** telemetry proposes safe PRs to prompts, skills, thresholds, and templates.
- **Runtime Adapter Bridge:** one compatibility layer across Claude Code, GitHub Copilot, Codex, OpenAI API, local CLI, and future hosts.

Key sources:

- [plan/agentic/AGT-01-orchestrator-interface.md](plan/agentic/AGT-01-orchestrator-interface.md)
- [plan/agentic/AGT-04-agent-skill-composition-matrix.md](plan/agentic/AGT-04-agent-skill-composition-matrix.md)
- [plan/agentic/AGT-05-cross-project-skills-repository.md](plan/agentic/AGT-05-cross-project-skills-repository.md)
- [plan/agentic/AGT-06-agent-skill-mutation-pipeline.md](plan/agentic/AGT-06-agent-skill-mutation-pipeline.md)
- [plan/infra/INF-01-runtime-dispatch-gateway.md](plan/infra/INF-01-runtime-dispatch-gateway.md)
- [plan/infra/INF-05-codex-runtime-distribution.md](plan/infra/INF-05-codex-runtime-distribution.md)

## RAG, MCP, and Semantic Context

### What exists

| Area                          | Evidence                                                                                                                           | Product reading                                                   |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Two-layer retrieval discovery | [vault/discovery/two-layer-retrieval/discovery.md](vault/discovery/two-layer-retrieval/discovery.md)                               | semantic context OS across docs, code, theorem, sessions, runtime |
| Graph retrieval prototype     | [internal_tools/graph_retrieval/](internal_tools/graph_retrieval/)                                                                 | typed-edge + embedding retrieval prototype                        |
| NetworkX corpus               | [internal_tools/graph_retrieval/networkx_corpus.py](internal_tools/graph_retrieval/networkx_corpus.py)                             | current graph-backed corpus adapter                               |
| Retriever                     | [internal_tools/graph_retrieval/retriever.py](internal_tools/graph_retrieval/retriever.py)                                         | classify -> candidates -> projection -> score -> top-k            |
| Embedder protocol             | [internal_tools/vault_common/embedder.py](internal_tools/vault_common/embedder.py)                                                 | provider-agnostic embedding interface                             |
| Sentence transformer adapter  | [internal_tools/vault_common/embedders/sentence_transformer.py](internal_tools/vault_common/embedders/sentence_transformer.py)     | local embedding implementation                                    |
| Semantic RAG session          | [vault/sessions/2026-05-25-0913-semantic-rag-discovery-review.md](vault/sessions/2026-05-25-0913-semantic-rag-discovery-review.md) | recent review tightening falsifiable target                       |

### MCP status

I did not find a first-party MCP server implemented in this repo. What exists is an integration posture:

- [.claude/scripts/remind-mcp-before-grep.sh](.claude/scripts/remind-mcp-before-grep.sh) reminds agents to use GitNexus / semantic-index MCP-like tools before broad code grep.
- [internal_tools/agents-telemetry/README.md](internal_tools/agents-telemetry/README.md) mentions future MCP self-report for Copilot custom agents.
- [copilot/INSTALL.md](copilot/INSTALL.md) references Playwright MCP integration for UI/E2E flows.

Product idea:

- **DomainSpec MCP Bridge:** expose vault search, graph retrieval, code traceability, readiness gates, and agent telemetry through MCP resources/tools. Start read-only, then add gated mutations.

## Internal Tools and Gates

| Tool                      | Path                                                                                                     | Product idea                                                          |
| ------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Vault kernel              | [internal_tools/vault_common/](internal_tools/vault_common/)                                             | shared SDK for frontmatter, edges, walker, SQLite, events, embeddings |
| Vault CLI                 | [internal_tools/vault_ctl/cli.py](internal_tools/vault_ctl/cli.py)                                       | `domainspec doctor` / `vault validate` product core                   |
| Vault telemetry           | [internal_tools/vault_telemetry/cli.py](internal_tools/vault_telemetry/cli.py)                           | residue metrics, bets, dispatch reports, tuning signals               |
| Convergence runner        | [internal_tools/convergence_runner/cli.py](internal_tools/convergence_runner/cli.py)                     | repeatable multi-agent experiment runner                              |
| Agents telemetry          | [internal_tools/agents-telemetry/README.md](internal_tools/agents-telemetry/README.md)                   | agent fleet observability                                             |
| Categorical tooling guard | [internal_tools/categorical_tooling_guard/README.md](internal_tools/categorical_tooling_guard/README.md) | PASS/FLAG/BLOCK gate over L1 richness                                 |
| Tower Explorer            | [internal_tools/tower_explorer/README.md](internal_tools/tower_explorer/README.md)                       | Gate 0 origin/provenance structural checker                           |
| Lean code validator       | [internal_tools/lean-code-validator/README.md](internal_tools/lean-code-validator/README.md)             | formal/spec validation surface                                        |
| Audit richness parser     | [scripts/audit_richness.py](scripts/audit_richness.py)                                                   | parser authority for markdown spec richness                           |
| Governance code tags      | [governance/tags/README.md](governance/tags/README.md)                                                   | spec-to-code traceability and drift reports                           |

Product synthesis:

- **Formal Readiness Gate:** sequential Gate 0 -> Gate 1 -> Lean/validator -> code-tag drift -> readiness verdict.
- **SpecOps Console:** one view over all gates with explanation, suggested action, and CI integration.

## Product Evidence Already In Code

| Surface                              | Evidence                                                                                                               |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Knowledge Graph backend              | [backend/src/modules/knowledge-graph/index.ts](backend/src/modules/knowledge-graph/index.ts)                           |
| UI Prototyping Studio backend        | [backend/src/modules/ui-prototyping-studio/index.ts](backend/src/modules/ui-prototyping-studio/index.ts)               |
| Agent Execution Orchestrator backend | [backend/src/modules/agent-execution-orchestrator/index.ts](backend/src/modules/agent-execution-orchestrator/index.ts) |
| Web app routes                       | [apps/web/src/App.tsx](apps/web/src/App.tsx)                                                                           |
| Knowledge graph feature spec         | [docs/features/knowledge-graph-visualization/SPEC.md](docs/features/knowledge-graph-visualization/SPEC.md)             |
| UI prototyping feature spec          | [ui-prototyping-studio:SPEC.md](ui-prototyping-studio:SPEC.md)                                                         |
| Agent execution feature spec         | [docs/features/agent-execution-orchestrator/SPEC.md](docs/features/agent-execution-orchestrator/SPEC.md)               |

## Discovery and Research Index

### Core product discoveries

- [vault/discovery/knowledge-calibration-geometry/discovery.md](vault/discovery/knowledge-calibration-geometry/discovery.md) - knowledge calibration across people, spec, and system.
- [vault/discovery/two-layer-retrieval/discovery.md](vault/discovery/two-layer-retrieval/discovery.md) - faithful multi-substrate RAG / semantic context OS.
- [vault/discovery/harness-as-enforcement-layer/README.md](vault/discovery/harness-as-enforcement-layer/README.md) - harness as enforcement, runtime, and portability boundary.
- [vault/discovery/two-layer-platform-architecture/discovery.md](vault/discovery/two-layer-platform-architecture/discovery.md) - internal vault platform architecture.
- [vault/discovery/reflection-tower-structural-gate/README.md](vault/discovery/reflection-tower-structural-gate/README.md) - structural Gate 0 / Gate 1 split.
- [vault/discovery/agent-skill-categorization/README.md](vault/discovery/agent-skill-categorization/README.md) - agent/skill taxonomy and governance.
- [vault/discovery/multi-agent-implementation-strategy/README.md](vault/discovery/multi-agent-implementation-strategy/README.md) - safe multi-agent implementation patterns.
- [vault/discovery/data-contract-as-formal-artifact/README.md](vault/discovery/data-contract-as-formal-artifact/README.md) - data contracts as generated/linted formal views.
- [vault/discovery/graph-as-residue-attractor/discovery.md](vault/discovery/graph-as-residue-attractor/discovery.md) - typed graph identity and residue framing.
- [vault/discovery/cross-tree-mirroring-for-llm-coercion/discovery.md](vault/discovery/cross-tree-mirroring-for-llm-coercion/discovery.md) - repo layout to force agent lookup discipline.
- [vault/discovery/close-session-redesign/discovery.md](vault/discovery/close-session-redesign/discovery.md) - close-session protocol and provenance capture.
- [vault/discovery/should-close-session-design/discovery.md](vault/discovery/should-close-session-design/discovery.md) - session closure recommender.

### Product specs and work-packs

- [docs/features/agent-execution-orchestrator/SPEC.md](docs/features/agent-execution-orchestrator/SPEC.md)
- [docs/features/agent-execution-orchestrator/WORK-PACK.md](docs/features/agent-execution-orchestrator/WORK-PACK.md)
- [docs/features/domainspec-arcanum-superset/ARCHITECTURE.md](docs/features/domainspec-arcanum-superset/ARCHITECTURE.md)
- [docs/features/domainspec-arcanum-superset/WORK-PACK.md](docs/features/domainspec-arcanum-superset/WORK-PACK.md)
- [docs/features/domainspec-gsd-integration/SPEC.md](docs/features/domainspec-gsd-integration/SPEC.md)
- [docs/features/gitops-assessment/DISCOVERY.md](docs/features/gitops-assessment/DISCOVERY.md)
- [docs/features/gitops-assessment/SPEC.md](docs/features/gitops-assessment/SPEC.md)
- [docs/features/knowledge-graph-visualization/SPEC.md](docs/features/knowledge-graph-visualization/SPEC.md)
- [docs/features/knowledge-graph-visualization/WORK-PACK.md](docs/features/knowledge-graph-visualization/WORK-PACK.md)
- [docs/features/tower-explorer/spec.md](docs/features/tower-explorer/spec.md)
- [ui-prototyping-studio:PRODUCT-VIEW.md](ui-prototyping-studio:PRODUCT-VIEW.md)
- [ui-prototyping-studio:SPEC.md](ui-prototyping-studio:SPEC.md)
- [ui-prototyping-studio:WORK-PACK.md](ui-prototyping-studio:WORK-PACK.md)

### Research / experiments

- [docs/research/EXPERIMENTS.md](docs/research/EXPERIMENTS.md) - experiment agenda.
- [docs/research/inventory/INVENTORY-INDEX.md](docs/research/inventory/INVENTORY-INDEX.md) - cross-industry research inventory.
- [docs/research/plan-first-execution-contract.md](docs/research/plan-first-execution-contract.md) - plan-first execution contract.
- [docs/research/research-ideas.md](docs/research/research-ideas.md) - research backlog.

### Key sessions

- [vault/sessions/2026-05-25-0913-semantic-rag-discovery-review.md](vault/sessions/2026-05-25-0913-semantic-rag-discovery-review.md) - semantic RAG review.
- [vault/sessions/2026-05-25-0318-knowledge-calibration-geometry.md](vault/sessions/2026-05-25-0318-knowledge-calibration-geometry.md) - knowledge calibration geometry.
- [vault/sessions/2026-05-25-0128-domainspec-internal-tools-gate-port.md](vault/sessions/2026-05-25-0128-domainspec-internal-tools-gate-port.md) - Gate 0/Gate 1 port.
- [vault/sessions/2026-05-18-1907-data-contract-as-formal-artifact.md](vault/sessions/2026-05-18-1907-data-contract-as-formal-artifact.md) - data contracts as formal artifacts.
- [vault/sessions/2026-05-18-0009-multi-agent-implementation-strategy.md](vault/sessions/2026-05-18-0009-multi-agent-implementation-strategy.md) - multi-agent implementation strategy.
- [vault/sessions/2026-05-19-1443-cyberalchemy-agent-framework-prs.md](vault/sessions/2026-05-19-1443-cyberalchemy-agent-framework-prs.md) - Arcanum and mars PR work.

## Cross-Cutting Gaps

| Gap                   | Why it matters                                                                              | Candidate next move                                                       |
| --------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Packaging             | Repo still speaks in submodules, skills, and markdown; users need commands and guided flows | define CLI command contracts and installer boundaries                     |
| Runtime portability   | Claude, Copilot, Codex, GitHub, and future API modes are adjacent but not unified           | write runtime adapter contract and inventory current surfaces             |
| MCP productization    | MCP is referenced, but first-party DomainSpec MCP server is not present                     | design read-only MCP bridge for vault, retrieval, gates, and telemetry    |
| RAG evaluation        | Two-layer RAG is compelling but needs hard negatives and golden traces                      | build semantic retrieval eval harness                                     |
| Harness MVP scope     | Harness is broad; MVP must not become "whole platform UI"                                   | start with graph explorer + role view + calibration/action queue          |
| Metrics actionability | Dashboards can become empty                                                                 | require every signal to route to owner/action/evidence                    |
| Commercial wedge      | CLI, Harness, RAG, UI Lab, and agent telemetry all compete                                  | score wedges by demo speed, pain intensity, implementation cost, and moat |
| Proof evidence        | "Spec-derived quality" needs short repeatable demos                                         | maintain canonical examples like payment-processing and user-account      |

## Suggested Priority Stack

1. **DomainSpec CLI + Doctor/Drift** - fastest route to external proof.
2. **SpecOps Console / Formal Gates** - turns internal tools into a coherent operator product.
3. **Faithful RAG Engine** - technical moat for agent context.
4. **Harness Graph + Calibration Queue** - human-facing cockpit, but only after action loops are clear.
5. **Agent Execution Orchestrator + Fleet Telemetry** - runtime maturity layer.
6. **Governed UI Lab** - strong demo/product wedge when design workflows matter.
7. **Arcanum Superset / Capability OS** - strategic unification, high leverage but migration-heavy.

## Product Rule

Do not promote an idea because it is conceptually elegant. Promote it when it has:

- a user-facing workflow;
- a concrete artifact or signal;
- an action-bearing output;
- a narrow first experiment;
- a source-of-truth link;
- a way to detect failure or drift.
