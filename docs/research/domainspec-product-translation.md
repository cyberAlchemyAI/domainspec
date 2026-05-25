# DomainSpec Product Translation

Status: Draft for iteration
Date: 2026-05-25
Scope: Translate DomainSpec framework and vault ideas into product-facing requirements

## Why this document exists

DomainSpec already contains three rich but partially separate layers:

1. the framework itself: templates, agents, skills, pipeline stages, derivation rules
2. the theory/vault layer: axioms, discoveries, governance, epistemic structure
3. the product layer: Harness plans, app workspace ideas, CLI/control-plane framing

The repo already says a lot about the product, but the ideas are distributed across `TOBANOV.md`, `plan/harness/`, `implementation/app-frontend/...`, and the broader theory track. This document is a translation bridge: what should survive from the framework and theory into the actual product, and what should stay backstage.

## The core product idea

The product is not "a prettier vault" and not "a chat wrapper around prompts."

The product idea is:

**DomainSpec becomes an installable closed-loop execution system that keeps business intent, implementation, runtime behavior, and human decisions aligned through shared specs, deterministic derivation, governance signals, and role-aware operational surfaces.**

In concrete terms, the repo points to a product with three coordinated surfaces:

1. **CLI / local runtime**
   - `domainspec init`
   - `domainspec doctor`
   - `domainspec drift`
   - `domainspec sync`
   - `domainspec pipeline`
   - harness portability so this can run beyond Claude Code

2. **Harness workspace**
   - chat-first but not chat-only
   - graph, tasks, metrics, decisions, sessions, role-aware views
   - one execution cockpit for product, engineering, QA, governance

3. **Optional control plane**
   - aggregates signals across repos
   - tuning proposals, drift visibility, auto-PR loops
   - likely source of moat if the product becomes real

This is consistent across the repo:

- `TOBANOV.md` frames the product as packaging discipline plus thin control plane plus harness portability.
- `plan/harness/HARNESS-PRODUCT-OVERVIEW.md` frames Harness as the human execution surface.
- `plan/SATURN-L-SYSTEM.md` frames Saturn as the control loop behind that surface.
- `implementation/app-frontend/docs/features/discovery/app-release-discovery.md` frames the first public release as a guided, chat-first workspace where graph, tasks, and live execution become visible.

## The short version of the idea

If I compress the product thesis into one sentence, it is this:

**Turn specs into the operating system of delivery.**

That means:

- specs are not passive documentation
- tests and observability derive from the same source
- runtime signals feed prioritization and governance
- humans and agents share the same operational map
- the system helps decide what to do next, not just generate artifacts

## What should translate from theory into product

Not everything in the vault should become user-visible, but several ideas are clearly product-load-bearing.

### 1. Shared semantics as the source of truth

Product translation:

- typed specs
- stable concept vocabulary
- explicit relationships
- traceability from decision to artifact

User-visible form:

- graph navigation
- object lineage
- task rationale
- drift explanations

This is the product-facing form of the taxonomy/relationships work.

### 2. Deterministic derivation

Product translation:

- same inputs should produce stable classes of outputs
- tests, metrics, and contracts derive from specs, not ad hoc agent taste

User-visible form:

- "why was this test generated?"
- "why is this metric required?"
- "what spec clause caused this gate?"

This is one of the strongest differentiators. Without it, the product collapses into generic agent orchestration.

### 3. Governance as operational behavior, not policy theater

Product translation:

- drift detection
- readiness gates
- escalation and blocking
- objective-linked prioritization

User-visible form:

- PASS / FLAG / BLOCK surfaces
- visible rationale on queue items
- governance-linked metrics
- audit trail for decisions

This is the product form of the governance attenuation and Saturn loop thinking.

### 4. Harness as enforcement layer

Product translation:

- the runtime must enforce non-negotiable behavior, not merely suggest it
- hooks, permissions, structured routing, and observability are product requirements

User-visible form:

- reliable execution
- reproducible runs
- visible session state
- bounded, inspectable automation

This is why harness portability matters so much. If enforcement stays trapped in one host, the product remains fragile.

### 5. Role-aware interpretation of one reality

Product translation:

- one shared system state
- multiple role lenses
- no contradictory copies of truth

User-visible form:

- stakeholder, PO, QA, and dev views over the same graph, queue, and metrics

This is already explicit in `HAR-02`.

## What should not translate directly into the product surface

The repo is also clear about what should stay backstage.

### 1. The full vault/theory machinery

The product should not expose the whole epistemic chain, the theory language, or the meta-governance vocabulary as its primary UX. Those are internal engines and authoring disciplines.

What survives is the effect:

- explainability
- traceability
- disciplined derivation
- decision quality

### 2. Repo-native complexity as the default user contract

Today the framework assumes comfort with submodules, markdown skill packs, internal folders, and agent charters. That cannot be the install surface of the product.

What survives is:

- packaged commands
- guided workflows
- explicit outputs
- migration and drift checks

### 3. Manual-by-default tuning loops

The product cannot stop at "here is a markdown proposal for a human to maybe apply later."

What survives is:

- low-risk auto-application
- PR generation
- bounded approval workflows

## Product thesis, more concretely

The product is best understood as:

**a governed execution environment for spec-driven delivery**

That is stronger than:

- documentation tool
- prompt library
- graph explorer
- dashboard
- agent shell

It includes pieces of all of those, but the real category is closer to:

- local CLI for execution
- shared workspace for human steering
- closed telemetry/governance loop
- optional hosted control plane for cross-repo learning

## The product architecture that the repo implies

### Layer A: local execution substrate

- CLI commands
- local project state
- templates and derivation rules
- agent/harness adapters
- drift and doctor checks

### Layer B: execution cockpit

- Harness workspace
- graph
- task board
- metrics
- session memory
- role-based lenses

### Layer C: control loop

- Saturn-style observe/evaluate/decide/act/verify
- governance and readiness enforcement
- objective reprioritization

### Layer D: network effect / moat

- control plane
- multi-repo signals
- tuning intelligence
- auto-PRs and organizational visibility

This four-part decomposition seems to be the most stable product reading across the current repo.

## The most important product insight in the repo

The strongest idea is not "LLMs can generate code from docs."

The strongest idea is:

**the same formal source should drive specification, verification, observability, prioritization, and operational correction.**

That is what makes DomainSpec potentially a product instead of just a collection of prompts.

## Immediate research-engineering implications

If we want to translate the current body of thought into product work, the next research-engineering questions should probably be:

1. What is the minimum portable harness contract required for the product?
2. What artifact schemas must exist for `doctor`, `drift`, and `pipeline` to be product-grade?
3. Which vault concepts remain internal implementation concepts, and which must be surfaced as user-facing primitives?
4. What are the smallest end-to-end loops that prove the product works without exposing theory?
5. Which part is the first paid wedge: CLI alone, Harness workspace, or control plane?

## Proposed next artifacts

1. `docs/research/harness-contract-for-product.md`
   - portable enforcement contract for acceptable runtimes

2. `docs/research/product-surface-vs-theory-boundary.md`
   - what stays backstage, what becomes UX

3. `docs/research/control-plane-wedge.md`
   - when the hosted layer becomes necessary and why it may be the moat

4. `docs/research/mvp-loop-definition.md`
   - smallest product loop that proves installability and value

## Working conclusion

The product idea is already in the repo, and it is more coherent than it first appears.

It is not "let's sell the vault."
It is not "let's wrap Claude Code in a UI."
It is not "let's ship a graph viewer."

It is:

**an installable, role-aware, closed-loop execution system where specs become the control surface for how teams build, verify, observe, and correct software with agents.**
