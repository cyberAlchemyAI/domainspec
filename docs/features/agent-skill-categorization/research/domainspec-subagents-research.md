---
tags: [subagents, dispatch-artifact, subagents-research, agent-skill-categorization]
node_type: subagents-research
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-18
dispatch_slug: agent-skill-categorization
implements: [R5, R15, R23 of domainspec-subagents-strategy-constitution.md]
---

# Subagents-Research — `agent-skill-categorization`

> Raw per-agent findings, **verbatim**. No synthesis, no tensions, no cross-cutting analysis (those belong in `domainspec-subagents-findings.md`). One section per child agent, in dispatch order.
>
> **Constitution:** [domainspec-subagents-strategy-constitution.md](../../../vault/constitution/domainspec-subagents-strategy-constitution.md) — R5 (children don't write this file; the strategist assembles it from collected returns), R15 (file location), R17 (downstream `domainspec-subagents-findings.md` claims cite the per-child sections below), R23 (Context + Goal preamble required).
>
> **Stable section anchors:** Use `## Agent N — <brief>` headers exactly as below. The findings file's citations rely on the slug `agent-n--brief` resolving to the right section.

---

## Context

A maintainer has ~80+ agents/skills under `.claude/` with implicit prefix grouping (`domainspec-*`, `gsd-*`, `gitnexus-*`) and asked whether explicit categorization is worth introducing. No prior discovery exists. Lens 4 explicitly forces the question of which decision the taxonomy must serve.

## Goal

Determine the optimal categorization scheme (or null hypothesis) for the agent/skill corpus, with as-is gap, migration cost, and an honest counter-position.

---

## Agent 1 — External literature survey across agentic frameworks

External Literature Survey: Agent/Skill Categorization Across Frameworks

1. Comparison Table

| Framework | Axes Used | Structure | Problem the Categorization Solves |
|---|---|---|---|
| AutoGen v0.4 (Microsoft) | Role (assistant / user-proxy / group-chat-manager), Execution mode (code-executing vs. LLM-only), Human involvement | Hierarchical class inheritance: ConversableAgent → AssistantAgent, UserProxyAgent, GroupChatManager | Distinguishes who drives conversation turns and who executes code; prevents role confusion in multi-turn loops |
| CrewAI | Role (free-text label), Goal, Backstory (persona), Tool-surface, Process mode (sequential / hierarchical) | Flat at declaration; hierarchy emerges at runtime via Manager/Worker assignment | Formalizes task ownership in a "crew" metaphor; makes delegation decisions legible to the LLM via the backstory/goal pair |
| LangGraph / LangChain | Node type (supervisor / worker / subgraph), Control flow (conditional edges, state schema), Execution lifecycle (compile-time graph vs. runtime dispatch) | Hierarchical graph: top-level supervisor → mid-level supervisors → worker leaves; subgraph composition for deep nesting | Manages stateful multi-step flows; categorization by position in the graph rather than by role label |
| OpenAI Agents SDK | Role (manager-pattern vs. decentralized peer), Tool-surface, Handoff target list, Guardrail scope | Flat by default (all agents are the same Agent class); hierarchy emergent from handoff topology | Keeps the primitive surface minimal; routing decisions encoded in the handoff graph, not in type-level distinctions |
| Anthropic Claude Code (skills + agents) | Function type (skill = instructions bundle / agent = subagent with tool grants), Invocation mode (slash-command vs. automatic discovery), Tool-surface, Scope (built-in vs. custom) | Flat filesystem directories; implicit grouping via name prefix — no enforced taxonomy | Encapsulates context + permissions per task; progressive disclosure avoids bloating context window |
| Anthropic Agent Skills (API/platform) | Domain/capability, Lifecycle stage (pre-built vs user-authored), Surface scope (per-workspace) | Flat by type; soft grouping by capability domain, not enforced by schema | Lets agents acquire domain expertise on demand without rewriting core instructions |
| Microsoft Semantic Kernel | Function type (semantic / native / OpenAPI-imported / MCP-sourced), Plugin grouping, Semantic description (for auto-orchestration) | Two levels: Plugin → Function; function types distinguished by implementation, not role | Enables the LLM orchestrator to discover and compose capabilities via semantic descriptions |
| Academic MoE / Routing (Symbolic-MoE arXiv:2503.05641) | Skill domain (fine-grained subject area), Expert capability profile (per-benchmark strength), Aggregator role | Flat expert pool + separate aggregator; router is a function not a hierarchy | Routes queries to the right specialist at inference time without retraining |

2. Recurring Axes (≥3 frameworks)

1. Role — who orchestrates vs who executes (AutoGen, CrewAI, LangGraph, OpenAI SDK, academic MoE)
2. Tool-surface — which tools/functions an agent/skill can invoke (CrewAI, OpenAI SDK, Claude Code, Semantic Kernel)
3. Capability / domain — what subject area or functional domain (CrewAI, Claude API skills, Semantic Kernel, academic MoE)
4. Lifecycle / invocation scope — when and how an agent is activated (LangGraph, Claude Code, Anthropic Agent Skills, Semantic Kernel)
5. Hierarchy level — supervisor vs worker vs leaf (AutoGen, LangGraph, CrewAI with manager mode, MoE aggregator/expert split)

3. Notable Divergence

The sharpest divergence is between graph-position-as-taxonomy (LangGraph) and capability-description-as-taxonomy (Semantic Kernel, academic MoE). LangGraph doesn't ask "what kind of agent is this?" at the type level; it asks "where does this node sit in the graph and what edges leave it?" — the category is positional, not declarative. Semantic Kernel goes the opposite direction: every function carries a semantic description so the LLM can discover its purpose at runtime without a pre-arranged graph. Academic MoE goes further still, treating taxonomy as an empirical question — agent categories are derived from benchmark performance profiles. CrewAI occupies the middle, using free-text role/goal/backstory that is semantically rich but unenforced. OpenAI Agents SDK is deliberately minimal: it refuses to impose a type taxonomy at all. Claude Code currently mirrors this minimalism — prefix grouping (gitnexus-*, domainspec-*) is the only categorization mechanism, and it is implicit rather than schema-enforced.

Sources:
- https://microsoft.github.io/autogen/stable//user-guide/agentchat-user-guide/tutorial/agents.html
- https://docs.crewai.com/en/concepts/agents
- https://langchain-ai.github.io/langgraph/tutorials/multi_agent/hierarchical_agent_teams/
- https://openai.github.io/openai-agents-python/
- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- https://code.claude.com/docs/en/skills
- https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- https://learn.microsoft.com/en-us/semantic-kernel/concepts/plugins/
- https://arxiv.org/abs/2503.05641

---

## Agent 2 — Weights-only taxonomy of candidate axes

Candidate Axes for Agent/Skill Categorization

Axis 1 — Cognitive Role
Pros: Communicates kind of thinking; easy to staff a pipeline; aligns with how humans split tasks.
Cons: Many agents blend roles mid-run; role names fuzzy across teams.
Failure mode: A "synthesizer" that writes a doc AND commits a file — forces a lie.
Hybrid-forcing: close-session verifies, summarizes, and writes memory — three buckets.

Axis 2 — Lifecycle Stage
Pros: Maps to workflow order; pipeline sequencing becomes mechanical.
Cons: Agents don't respect stages — hooks fire at every stage; validators run mid-discover and post-ship.
Failure mode: frontmatter.md fires on every Write regardless of stage — assigning a stage is arbitrary.
Hybrid-forcing: Cross-cutting concerns (governance, observability) belong to no stage and all stages.

Axis 3 — Tool-Surface / Blast-Radius
Pros: Answers "what can this break?"; maps to permissions/sandboxing; load-bearing for CI gates.
Cons: Same agent can operate at different blast-radii depending on invocation (dry-run vs live).
Failure mode: gitnexus_rename dry-run is read-only, live is edit-shared — axis must lie or overstate.
Hybrid-forcing: Any agent with --dry-run or confirmation gate lives in two buckets simultaneously.

Axis 4 — Domain
Pros: Aligns with ownership; easy to find "all vault agents"; natural documentation grouping.
Cons: Cross-domain agents break cleanly; boundaries shift as project evolves.
Failure mode: semantic-index operates on vault AND code AND infra — one-domain tag hides the others.
Hybrid-forcing: Observability agents touch every domain.

Axis 5 — Invocation Pattern
Pros: Captures structural role in call graph; useful for wiring/dispatch decisions.
Cons: A specialist can be promoted to orchestrator in a meta-dispatch — pattern is context-dependent.
Failure mode: domainspec-subagents-strategy is normally orchestrator, but under meta-dispatch is specialist.
Hybrid-forcing: A bridge agent is also a validator if it enforces a contract at the seam.

Most Load-Bearing Axis: Tool-Surface / Blast-Radius

Axis 3 is the most load-bearing in the abstract. Every other axis describes what an agent thinks or does; blast-radius describes what it can break — the only question with non-negotiable operational consequences. A miscategorized cognitive role costs a confused reader; a miscategorized blast-radius costs corrupted production state.

The axis makes the following decisions easy: whether an agent requires human confirmation, whether it can be dispatched autonomously, whether it needs a dry-run path, how it should be CI-scoped. It leaves open sequencing (lifecycle handles that), ownership (domain handles that), and reasoning type (cognitive role handles that) — so it composes well with other axes.

The dry-run/live ambiguity is resolved by making blast-radius a runtime tag and reserving the static category for maximum possible blast-radius.

---

## Agent 3 — Repo as-is inventory of agents and skills

Section 1: Totals

46 agents (.claude/agents/*.agent.md). ~137 skill files, ~113 SKILL.md entry-points.
- domainspec-* skills: 46
- gsd-* skills: 47
- gitnexus/ skills: 6 (+6 duplicates under gitnexus copy/)
- custom/ prose docs: 22
- Standalone utility skills: 8
No .claude/commands/ directory exists.

Section 2: Three Count Tables

Table A — Count by Prefix
| Prefix | Agents | Skills | Total |
|---|---|---|---|
| domainspec- | 26 | 46 | 72 |
| gsd- | 18 | 47 | 65 |
| gitnexus- | 0 | 6 | 6 |
| mars- | 1 | 0 | 1 |
| none | 1 | 8 | 8 |

Table B — Count by Lifecycle Verb
| Verb Group | Count |
|---|---|
| Audit / Verify / Validate | ~18 |
| Execute / Implement / Run | ~14 |
| Research / Explore / Map | ~12 |
| Plan / Build / Create | ~12 |
| Generate / Derive / Produce | ~10 |
| Orchestrate / Route / Bridge | ~9 |
| Write / Persist / Sync | ~9 |
| Interview / Discover / Scope | ~6 |
| Debug / Investigate / Forensics | ~6 |
| Configure / Initialize / Setup | ~6 |
| Observe / Emit / Reflect / Profile | ~5 |

Table C — Tool Surface (best-effort)
| Surface Class | Agents | Skills |
|---|---|---|
| Read-only / Analysis | ~6 | ~8 |
| Edit-capable | ~38 | ~90 |
| Orchestrate-only | ~3 | ~10 |

Note: Most agents declare the full tool set, making read-only vs edit-capable a behavioral distinction rather than mechanically enforced.

Section 3: Hybrid List

1. domainspec-pipeline — "End-to-end feature pipeline; orchestrates planning, spec writing, story generation, test derivation, backend implementation, optional UI lifecycle, observability derivation, infrastructure sync, and verification."
2. domainspec-start — "Detect greenfield or brownfield scope, run discovery, enforce gates, initialize docs baseline, persist project decisions."
3. domainspec-interviewer-kits — "Pluggable modes (grill, readiness, audit-gap, Robot-Talks synthesis) and patch docs/specs as decisions are made."
4. domainspec-vault-metadata-curator — "Three modes: bootstrap, audit (read-only), repair."
5. domainspec-planner — appears as agent: target for 14+ different skills.
6. domainspec-brownfield-translation — "Codebase audit + domain discovery interview + multi-wave execution."
7. gsd-autonomous — "Run all remaining phases autonomously — discuss→plan→execute per phase."
8. domainspec-readiness-gate — "Profile-based verification (pilot, release-candidate, production)."

Section 4: As-Is Implicit Taxonomy

The corpus clusters visibly on three orthogonal dimensions, not one. The primary dimension is prefix-as-system-identity: domainspec- items belong to the framework meta-layer, gsd- items belong to the project-execution runtime, gitnexus- items belong to the code-intelligence toolbox. The second dimension, within each prefix group, is lifecycle stage: interview/discover, plan, implement/execute, audit/verify, observe/reflect — though stage vocabulary differs between domainspec- (interview → spec → implement → verify) and gsd- (research → plan → execute → validate → ship). The third dimension is abstraction level: thin shells (single agent: delegation), multi-step orchestrators (pipeline, autonomous, start), and atomic specialists (l1-extractor, delta-extractor, research-writer). The implicit taxonomy is therefore a matrix — system × stage × abstraction — with no single governing axis, and with bridge skills (execute-phase-bridge, plan-phase-bridge, ui-phase-bridge) serving as seams where the domainspec- and gsd- systems stitch together.

---

## Agent 4 — Decision-framing across candidate uses for a taxonomy

Per-Decision Analysis

| Decision | User | Today's failure | Best-fit axis |
|---|---|---|---|
| (a) Routing | Orchestrator agent | Orchestrator picks domainspec-spec-feature when discovery-writing is needed; similar-name overlap causes wrong tool surface | role |
| (b) Discoverability | Maintainer/contributor scanning catalog | 80+ flat files with no grouping; contributor looking for "thing that analyzes vault coherence" skims every file or duplicates | domain |
| (c) Governance | Audit pipeline / security review | New agent with Bash(git push --force) added without review; no tier flags destructive-tool agents | tool-surface |
| (d) Telemetry | Telemetry pipeline | Signals tagged only by filename; aggregating "how often discovery agents invoked" needs regex that breaks on rename | invocation-pattern |
| (e) Onboarding | New contributor | Reads 80+ flat files; cannot infer "core infra" vs "workflow helpers" vs "experiments"; doesn't know what to ignore | lifecycle |
| (f) Deprecation | Maintainer auditing overlap | domainspec-subagents-strategy and domainspec-subagents-research coexist with no indication which supersedes | role |

If Forced to Pick ONE

Optimize for (a) Routing, using the role axis.

The routing failure is the only one that fires at runtime and silently produces wrong output — every other failure is a human-time cost paid during maintenance, review, or onboarding. A misrouted agent doesn't error; it completes confidently with the wrong epistemic posture, and that output gets promoted downstream before anyone notices.

Role is the right axis because it creates a hard decision boundary an orchestrator can act on without reading the agent's full file. "This is a discovery agent; this is a spec agent; this is a governance agent" is a three-token fact that eliminates an entire class of routing error. Tool-surface would also serve routing, but two agents can share the exact same tool surface and still be categorically different in what they should be invoked for.

Reversibility is high: role labels are frontmatter fields, not folder reorganizations. If the role taxonomy is wrong, you change a string. If you reorganize 80 folders and the taxonomy was wrong, you've broken import paths, vault edges, and any hardcoded references.

Finally, role unblocks governance (tool-surface audits layer on top of role) and onboarding (new contributors understand role labels faster than lifecycle labels). Pick role for routing, get partial wins on (c) and (e) for free.

---

## Agent 5 — Adversarial steelman against categorization

Steelman: Do Not Categorize

1. Taxonomy Rot

Categories rot silently. The corpus grows, new agents emerge at the boundaries of existing buckets, and maintainers face a choice between cramming a poor fit or splitting the category. Both are lossy. Cramming produces misleading signal. Splitting doubles surface area without improving recall.

Concrete examples: domainspec-subagents-strategy is partly orchestration, partly research, partly planning. A "strategy" bucket would own it, but so would "research" and "orchestration." When the agent evolves the category assignment becomes a lie. Nobody updates it. The rot is now invisible.

2. False-Dichotomy Hybrids Carry No Routing Information

Consider domainspec-subagents-strategy concretely. Is it dispatch or research? It fans out children (dispatch), synthesizes outputs (research), proposes models (planning). Tag it "dispatch,research,planning" and the tag carries zero discriminating power — it matches every query.

The hybrid problem is not edge case. In a corpus designed around composability, most agents ARE hybrids. Taxonomy assumes clean boundaries. Composable systems structurally violate that assumption.

3. Prefix-as-Tag is Already a Flat Taxonomy — and It Works

domainspec-*, gsd-*, gitnexus-* are not informal conventions. They are a flat, collision-free taxonomy implemented at the namespace level. They answer the first routing question — "which system domain does this belong to?" — without a single line of frontmatter.

Adding a category layer on top of the prefix namespace creates two competing taxonomies with no defined authority ordering. When they diverge — and they will — the maintainer has to reconcile, not just update.

4. The Platform is Flat — Hierarchy Fights the Runtime

Claude Code dispatches skills via description matching at the LLM layer. The user describes a need; the model matches on description text, not on a category tree. There is no hierarchy in the runtime. Adding category: orchestration in frontmatter does not improve routing — the model does not traverse a tree, it reads descriptions.

5. Per-Agent Meta-Overhead

Every new agent now carries a mandatory categorization decision requiring: reading category definitions, deciding which bucket fits, writing the frontmatter field, potentially re-litigating the axes. At 80+ agents, one-time migration ≈ 80 decisions. At ~5 new agents/month: 60 more decisions/year plus 1-2 axis refactors. Real labor competing with feature work.

When Categorization Does Win

- Corpus > 150–200 agents with no prefix differentiation.
- Multiple personas with conflicting entry points (developer, PM, compliance officer) needing faceted navigation.
- Multi-tenant skill catalogs where access control maps to categories.
- Tooling that indexes categories — if CI, vault graph, or external registry consumes the category field for routing or enforcement, the field pays rent.

Until those conditions hold, better names and better descriptions dominate.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [vault/snapshots/dispatches/2026-05-18-agent-skill-categorization-spec.yaml](../../../../vault/snapshots/dispatches/2026-05-18-agent-skill-categorization-spec.yaml) | `derived-from` | Dispatch spec that authorized this fan-out; amended for R15 (working folder outside vault). |
