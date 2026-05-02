---
tags: [app-release, harness, domainspec, discovery, orchestration, knowledge-graph]
node_type: discovery
is_session: false
layer: application, architecture, governance
nature: exploratory
status: draft
veracidade: medium
conviccao: high
version: 0.1.0
last_updated: 2026-04-28
---

# Discovery: Harness Release Demo

> This discovery frames the first public-facing Harness release as a guided, chat-first DomainSpec workspace where a user can describe a domain, build an application specification, inspect the underlying knowledge graph, and leave with a visible execution track plus a fractal-style systems visualization.

## Current Scope Decisions

The following decisions are now assumed for v1 unless we explicitly revise them:

- single-screen experience to avoid unnecessary token consumption and flow fragmentation
- local-only runtime with a local window for user interaction
- greenfield-first journey for projects created from zero
- phased delivery, even if the long-term target includes all major capabilities
- audio-reactive track concept where the user can receive or upload a track and the fractal dances with playback
- no required semantic coupling yet between graph and fractal
- one persistent graph per project; many sessions contribute to the same graph, rather than each session owning its own isolated graph
- sessions are explicit chat episodes with a start and an end; ending a session generates a summary document and the user can later browse and resume past sessions in their own context
- Phase 1 surfaces the **domain graph** (knowledge-from-user). The **code graph** (knowledge-from-generated-code) is deferred to a later phase
- the workspace embeds a compact 2D graph view inline; an expand action navigates the user into the full graph experience under `/visualizations` rather than re-implementing it inside the workspace shell
- the project's knowledge folder under `domain_knowledge/` is the source of truth for the domain graph: each markdown file is a node, and edges come from frontmatter and the `## Connections` table on each document. The agent's job during a session is to write and edit those files. Persistence is git. For the running UI, a derived in-memory index is built by parsing the filesystem at startup and kept in sync via a file watcher, so live graph rendering and metrics never require a duplicate store of truth.
- the agent backend is a structured interviewer driven by an explicit question script (about the domain, the user's intent, actors, workflows, constraints, ambiguities) but executed by a real LLM (Claude via the Anthropic SDK). The LLM is responsible for paraphrasing, asking follow-ups, deciding when to advance the script, and proposing concrete edits to files in `domain_knowledge/`. The chat surface visibly narrates what the agent is doing — "writing `axiom/foo.md`", "linking it to `bar.md`" — so the graph updates feel causally connected to the conversation rather than appearing out of band.
- sessions are stored as markdown files under `domain_knowledge/sessions/`. Their content structure (objective, summary, decisions, files touched, next-session prompt, etc.) is defined by an external skill — analogous to `.claude/skills/close-session/SKILL.md` — rather than hardcoded in the app, so the session contract can evolve without code changes. The "end session" button runs that skill; the "resume" button loads the session document and lets the agent read it as context, then continues the conversation from there.
- the workspace is a vertically scrolling page rather than a fixed single-viewport layout. The chat sits at the top as the first thing the user sees; the live 2D graph and the graph metrics follow below as the user scrolls. The expand action on the embedded graph still navigates to `/visualizations`.
- the workspace supports multiple sessions open as tabs at the same time. Each tab is its own session (newly started or resumed from a past session document). Switching tabs switches the active conversation, the live graph view, and the metrics shown.
- ending a session is a deliberate, confirmed action. It can be triggered two ways: the explicit **End Session ("Encerrar sessão")** button in the tab, or closing the tab / browser window. Both paths open a confirmation popup; on confirm, the configured session-close skill (the app-runtime analogue of `.claude/skills/close-session/SKILL.md`) runs and writes the session document under `domain_knowledge/sessions/`.
- the embedded 2D graph on the workspace page is interactive (click nodes, hover, pan/zoom) and is the *same visualization engine* used in `/visualizations/ontology-visualization`, mounted in a smaller container — not a separate simplified renderer. The expand action just navigates to the full-screen mount of the same engine.
- when the code graph is added in a later phase, it uses the same visualization engine as the domain graph. Phase 1 ships only the domain graph on the main screen.
- resuming a past session passes only the summary section of the session document to the LLM as starting context. The full transcript stays on disk for human reference but is not replayed into the model's context window by default.
- Phase 1 uses **Claude via the Claude Agent SDK** authenticated through the user's existing Claude Code OAuth login. No `ANTHROPIC_API_KEY` is required; the agent inherits Pro/Max subscription credits. The chat dispatch lives behind a small interface (`ChatProvider` or similar) so the underlying client is replaceable, but Phase 1 ships only the `claude-oauth` implementation.
- multi-provider support (Gemini, ChatGPT, Claude-via-API-key) is deferred to a later phase. When it arrives, additional `ChatProvider` implementations slot in alongside `claude-oauth`, the user supplies a per-provider API key in settings, and the tool-use abstraction shifts to a unified layer (e.g. Vercel AI SDK). Phase 1 does not ship a model-picker dropdown.

## Objective

Define the release shape for a demo that proves three things in one flow:

1. A human can transfer domain knowledge into the system naturally.
2. The system can transform that knowledge into structured DomainSpec artifacts, agent tasks, and implementation guidance.
3. The resulting system state is not opaque: the user can inspect graph relationships, governance decisions, metrics, and progress through visual interfaces.

This is not just a chat demo. It is a demonstration of legible domain intelligence.

## Product Thesis

Harness should feel like the orchestration surface for building an application with agents, not like a thin wrapper over prompts.

The product promise is:

- the user arrives with a business problem, partial domain knowledge, or an existing system
- the system interviews them and maps the domain
- the system turns that domain into structured objects, workflows, tradeoffs, and responsibilities
- the system exposes how that knowledge connects inside a graph
- the system shows what work is now possible, what should happen next, and why
- the system tracks initiatives, experiments, and governance signals over time

If the user leaves with only generated text, the demo failed. They should leave with a working mental model and a visible operating model.

## Release Narrative

The first release should tell a coherent story:

1. **Land on a visually strong page inspired by `visualizations/newspaper`.**
2. **Enter a chat-first workspace** where the orchestrator agent receives the user goal.
3. **Run an interviewer loop** to clarify domain scope, actors, pain, value, constraints, and current system state.
4. **Project structured outputs** into a knowledge graph, task board, governance queue, and prototype surface.
5. **Let the user inspect the system** through graph navigation, workflow lineage, role-based tasks, and metrics.
6. **End with a tangible build state**:
   - app blueprint
   - domain map
   - active tasks
   - knowledge graph
   - fractal/system visualization
   - track of initiatives/experiments/visions

## Experience Principles

### 1. Chat is the control surface, not the whole product

The primary interface between human and system is an orchestrator agent. But the answer to every prompt should not stay trapped in chat bubbles. Every meaningful output should materialize elsewhere in the interface:

- graph nodes
- workflow chains
- decisions
- metrics
- tasks
- prototype panels

### 2. Domain knowledge must become intuitive

Harness must help a human understand domain structure quickly. It should make relationships and properties legible rather than requiring users to read raw specs.

Example interaction:

- the user clicks an object in the graph
- the interface reveals:
  - its properties
  - related entities
  - connected workflows
  - transformations it undergoes across process stages
  - decisions and rules that govern it

This is the key bridge from specification to comprehension.

### 3. Governance should be actionable

The system should not show governance as abstract policy. It should surface governance as prioritized work:

- what domain decisions are missing
- what tradeoffs are unresolved
- what metrics suggest a change in direction
- what role is responsible next
- what experiments or initiatives are in flight

### 4. Different roles must see the same system through different lenses

POs, stakeholders, QA, and developers should not receive disconnected tools. They should share one system with role-specific emphasis:

- stakeholders see value, risks, initiatives, and direction
- POs see scope, priorities, tradeoffs, and backlog shaping
- QA sees rules, edge cases, confidence gaps, and validation status
- developers see workflows, concepts, contracts, and implementation tasks

### 5. The interface should teach the model

Harness needs an explicit tutorial or guided mode explaining:

- how knowledge is mapped
- what each graph node means
- how workflows relate to domain objects
- why governance tasks appear
- how metrics influence prioritization

The user should learn the system while using it.

## Core Capabilities For Release

### A. Interviewer system

The interviewer helps users:

- discover a greenfield domain
- structure a project from zero into initial domain artifacts
- identify business pain, value, constraints, and goals
- extract actors, workflows, rules, and ambiguities
- generate initial domain objects and project hypotheses

This capability should be treated as first-class, not as onboarding garnish.

### B. Orchestrator interface

The orchestrator translates user intent into executable internal work. It should decide which agent/skill bundle is needed for a request such as:

- interviewer
- MARS research
- spec writer
- test generation
- graph update
- governance review
- frontend prototyping

The orchestrator is the human-facing API for the multi-agent system.

### C. Knowledge graph exploration

The graph should support:

- click-to-expand relationships
- workflow lineage tracing
- object transformation views
- filtering by role, initiative, context, or artifact type
- visibility into why a node exists and what generated it

The graph is not decorative. It is the explanation engine.

In this workspace, the most concrete starting point for that capability is `visualizations/ontology-visualization`, which already parses markdown-derived graph structure and renders an interactive explorer.

### D. Prioritized governance/task system

Harness should maintain a task list prioritized by the active context goals. These tasks are not generic todos; they are domain and governance actions such as:

- define missing entity boundaries
- resolve competing workflow models
- choose between domain tradeoffs
- assign ownership for unresolved decisions
- instrument missing metrics
- validate assumptions against experiments

### E. Frontend prototyping surface

The system should offer a space where the user chooses how the product they are designing should be presented. This is where the existing Godel Machine / newspaper-style visual evolution work becomes relevant:

- agent-proposed UI directions
- human selection and critique
- telemetry captured from preferences
- iterative refinement of presentation
- revision across all relevant HTML templates rather than preserving one fixed baseline

### F. Metrics and organizational context

The system should show metrics that are meaningful to the current user and organizational role. The same telemetry is not equally useful to every viewer.

Candidate metric families:

- governance health
- decision latency
- unresolved tradeoffs
- initiative throughput
- experiment progress
- agent cost
- intervention rate
- workflow completion confidence

### G. Initiative and experiment tracking

The release should make it possible to track:

- initiatives
- experiments
- visions
- decisions
- current execution tracks

This is the time dimension of the system. Without it, the graph is static.

### H. Audio-reactive track and fractal surface

The release should include an experiential output mode where the user can:

- receive a track
- upload an audio file
- play the track inside the local app
- watch the fractal react to the audio in real time

For v1, this should be treated as a presentation/output layer rather than a semantic graph view.

## Proposed Information Architecture

The release UI can be framed as five synchronized surfaces around the chat, constrained into one main workspace:

1. **Chat / Orchestrator Panel**
   - accepts user intent
   - displays agent reasoning summaries and task dispatch results

2. **Graph / Domain Panel**
   - renders concepts, relationships, workflow chains, and transformations

3. **Work / Governance Panel**
   - prioritized tasks, decisions, owners, tradeoffs, status, and next actions

4. **Prototype / Visualization Panel**
   - frontend mockups, fractal visualization, and experience variants

5. **Metrics / Track Panel**
   - telemetry, governance signals, experiments, initiative progress, and history

The important design constraint is that these surfaces should feel like projections of the same underlying model, not five unrelated widgets.

### One-Screen Constraint

Because the user should not spend unnecessary tokens navigating through many separate flows, the first release should behave as one orchestrated workspace rather than a route-heavy product.

Implications:

- one main window
- persistent orchestrator presence
- graph, tasks, prototype, metrics, and track playback visible through docked or layered panels
- progressive reveal instead of deep navigation
- condensed state summaries instead of long chat-only history

## Visual Direction

The landing experience should borrow the editorial authority and visual intentionality of `visualizations/newspaper`, but the product interior should shift from newspaper reading to operational co-creation.

That suggests:

- strong, atmospheric landing presentation
- rich typography and editorial framing
- transition into a live systems workspace
- graph and fractal visuals that feel intentional, not generic dashboard chrome

The fractal should not act as a disconnected art piece, but in v1 it does not yet need to be a formal alternate projection of the graph. It can operate as an audio-reactive experiential layer tied to track playback and the emotional feel of the workspace.

## Domain Model Additions Needed

The release notes point to concepts that should become explicit first-class artifacts in the DomainSpec universe:

- axioms
- constitution
- tags
- initiatives
- experiments
- visions
- governance metrics
- agent definitions
- skill definitions
- mutation requests / agent-definition mutations

These concepts likely need:

- schema definitions
- graph node types
- relationship vocabulary
- validation rules
- generation/update scripts

## Agent and Skill Model

Harness depends on a visible library of reusable skills and agents, including ones that are not tied to a single project.

Release expectation:

- project-scoped skills remain attachable to a specific app/domain context
- global skills remain discoverable in a knowledge repository
- the orchestrator can choose from both pools

This implies a registry problem, not just a prompt-routing problem.

Recommendation for v1:

- do not block the release on a fully generalized reusable-skill marketplace
- do define the minimum internal library/discovery model the orchestrator can use
- defer broader repository concerns until the main user journey works end to end

## Infrastructure Thesis

Each user input should be able to invoke one or more agents. For this release the runtime target is local only. The outputs can include:

- task proposals
- decisions
- metrics
- code changes
- specification artifacts
- research outputs

For the release, the infrastructure should be framed around reliable request dispatch rather than maximal autonomy. The demo must feel deterministic enough to trust.

## Telemetry and Governance Loop

Agent telemetry is necessary not only for cost visibility but for governance itself. The release should validate how existing telemetry can power an automated loop for:

- capturing agent actions and costs
- emitting governance signals
- evaluating system health
- suggesting configuration or workflow changes
- running CI checks that detect drift or governance degradation

This appears adjacent to the Saturn / L-system governance direction and should be treated as a dedicated workstream, not a logging afterthought.

### Existing telemetry foundation already present

The repo already contains telemetry foundations we can build on:

- a reusable schema template at `domainspec/templates/SIGNAL-SCHEMA.md`
- telemetry planning and contracts in `domainspec/plan/infra/INF-02-telemetry-schema.md` and `domainspec/plan/infra/INF-02-agent-telemetry-saturn.md`
- a telemetry bundle utility at `domainspec/tools/build-telemetry-bundle.ts`
- operational telemetry in the newspaper system via `visualizations/newspaper/evolution/telemetry_db.json`

The open issue is therefore less about whether telemetry exists at all and more about which fields and governance metrics should become canonical for Harness v1.

## Proposed Release Slices

The release can be decomposed into implementation slices that later map into `domainspec/ADLC-ALIGNMENT.md` and the existing Harness plan set under `domainspec/plan/harness/`.

### Slice 1: Experience shell

- landing page inspired by newspaper
- chat-first application frame
- one-screen orchestration workspace
- condensed state views to reduce token waste

### Slice 2: Interview and domain mapping

- interviewer orchestration flow
- greenfield discovery mode
- structured extraction into domain artifacts

### Slice 3: Knowledge graph and workflow lineage

- graph schema extensions
- click-to-inspect object flows
- transformation lineage through workflows

### Slice 4: Governance work queue

- prioritized tasks by active context goal
- role-based views
- explicit tradeoff and decision handling

### Slice 5: Frontend prototyping and fractal visualization

- UI prototyping surface
- evolutionary or agent-assisted presentation flows
- revision across all relevant HTML templates
- audio-reactive fractal output tied to track playback

### Slice 6: Telemetry, metrics, and CI loop

- agent telemetry ingestion
- governance metric computation
- automatic checks and suggestion loop

### Slice 7: Agent/skill registry and execution fabric

- minimum visible skill repository
- project-scoped vs global capability model
- local runtime dispatch

### Slice 8: DomainSpec concept expansion

- axioms / constitution / tags
- agent-definition mutation support
- validators and scripts

## Release Success Criteria

The demo should be considered successful if a new user can:

1. Describe a domain or existing system in natural language.
2. Watch the system derive a coherent domain map and app blueprint.
3. Inspect graph relationships and workflow transformations visually.
4. Understand what decisions or tasks matter next and why.
5. Explore a prototype direction for the app.
6. See initiatives, experiments, and metrics that explain system direction.
7. Play or upload a track and watch the fractal react inside the same workspace.

## Risks

### 1. Chat-only collapse

The biggest risk is shipping a system that claims graph/governance intelligence but mostly answers in chat.

### 2. Visualization without semantics

The graph, track, and fractal could become impressive but shallow if they are not tied tightly to actual domain objects, workflows, and telemetry.

### 3. Overloaded first release

The concept spans interview, graph, orchestration, telemetry, prototyping, and governance. Without strict slicing, the release can become a concept deck rather than a shippable demo.

### 4. Discovery and plan drift

This workspace already contains a substantial local DomainSpec planning surface under `domainspec/`, including `domainspec/ADLC-ALIGNMENT.md` and the `domainspec/plan/harness/` track. The main risk is not a missing canonical submodule, but letting this discovery drift away from those existing plan artifacts or from the real visualization assets already in the repo.

## Open Questions

These questions still need resolution before we convert discovery into a locked implementation plan:

1. Which parts must be truly live in Phase 1:
   - graph persistence — **yes**, the domain graph persists across sessions at the project level (filesystem under `domain_knowledge/` + watcher-driven in-memory index)
   - agent runtime dispatch — **yes**, structured interviewer script executed by Claude via the Anthropic SDK, with visible tool-use narration
   - code generation — deferred (the code graph is a later phase)
   - telemetry ingestion — open
   - fractal rendering — deferred from Phase 1
   - CI governance loop — deferred from Phase 1
2. How should the one-screen layout divide attention between chat, graph, sessions list, and metrics without overwhelming the user?
3. What does the structured interview script look like for greenfield discovery — what is the minimum question set, and how does the agent decide when to advance, branch, or wrap up? (Authored as a skill, easy to evolve.)
4. What is the contract for the new session-management skill (analogous to `close-session`) that governs what a session document looks like under `domain_knowledge/sessions/`?
5. Which existing Victor / Godel Machine assets should be the concrete starting point if we plan to revise all relevant HTML templates?
6. What is the minimum visible library model for reusable skills outside a single project, and should it be in scope for Phase 1 or deferred?
7. What canonical governance metric set should Harness show first, given the telemetry foundations that already exist?

## Recommended Next Step

Convert this discovery into a release implementation brief with:

- one chosen phased demo scope
- one primary user journey
- explicit one-screen layout strategy
- a real milestone breakdown
- per-slice ownership
- explicit dependencies on the existing `domainspec/plan/*` tracks and visualization assets

At that point, we can produce or reconcile the task decomposition against `domainspec/ADLC-ALIGNMENT.md` and the current Harness plan files.