---
tags: [knowledge-map, epistemology, ontology, governance, architecture, agents, telemetry]
node_type: conceptual
is_session: false
layer: ontology
nature: reference
status: draft
version: 0.2.0
last_updated: 2026-05-19
---

# Foundational Knowledges

> Hierarchical map of the intellectual surfaces this repo draws on, from the most abstract (epistemology) down to the most concrete (the specific business domains DomainSpec has been pointed at). Each layer lists the load-bearing thinkers / disciplines and the in-repo artifacts that encode them. Read this when you want to know *why* a rule exists before deciding to bend it.

---

## Objective

Make the lineage of DomainSpec legible. The framework is not invented from scratch — it stitches together ideas from epistemology, systems thinking, behavioral science, formal methods, ontology engineering, software architecture, and governance. This document is the index of that lineage: which layer of abstraction each idea operates at, and where in the repo it lives.

Use this document to:

- Locate the canonical source for a thinking move ("which layer governs *this* choice?").
- Avoid re-inventing a discipline that already has a name and a literature.
- Spot when a rule is unverifiable (discipline) vs measurable (axiom) — see [vault/conceptual/epistemic-principles.md](conceptual/epistemic-principles.md).

---

## Reading order

Layers run **top → bottom = abstract → concrete**. Higher layers constrain lower layers; lower layers feed signals back up via telemetry (L7 → L0).

```
L0  Epistemology              ─┐
L1  Systems & control          │  Foundations  (why)
L2  Behavioral / decision sci  │
L3  Mathematics / formal       ─┘
L4  Knowledge representation  ─┐
L5  Software architecture      │  Methods      (how)
L6  Engineering practice       │
L7  Multi-agent orchestration ─┘
L8  Governance & institutions  ─  Application  (what)
```

---

## L0 — Epistemology (philosophy of knowledge)

*How do we know what we claim to know? When is a claim falsifiable vs decorative?*

| Source | Contribution | Where it lives in the repo |
|--------|--------------|----------------------------|
| Karl Popper | Falsifiability, conjecture-and-refutation | `hypothesis` / `experiment` meta-types; [docs/research/domainspec-paper.md](../docs/research/domainspec-paper.md) |
| Douglas Hofstadter | Strange loops, self-reference | The framework specifying itself; telemetry watching agents that author specs |
| Daniel Kahneman | System 1 / System 2, bias under uncertainty | "Think first, code second"; readiness gates |
| Sönke Ahrens | Zettelkasten, atomic notes | [vault/](.) structure; atomic discoveries; `## Connections` blocks |
| Terence Tao | Mathematical rigor as a discipline | Standing rule on epistemic honesty (memory) |

**Canonical anchors:** [internal_tools/agents-telemetry/canon.json](../internal_tools/agents-telemetry/canon.json), [AXIOMS.md](../AXIOMS.md), [vault/axiom/](axiom/), [vault/conceptual/epistemic-principles.md](conceptual/epistemic-principles.md)

---

## L1 — Systems & control theory

*How do feedback loops, leverage points, and constraints behave over time?*

| Source | Contribution | Where it lives |
|--------|--------------|----------------|
| Donella Meadows | Leverage points, stock-and-flow, system dynamics | [DRIFT-CONVERGENCE.md](../DRIFT-CONVERGENCE.md), [TUNING-LOOP.md](../TUNING-LOOP.md), [GOVERNANCE-ATTENUATION.md](../GOVERNANCE-ATTENUATION.md) |
| Eliyahu Goldratt | Theory of Constraints; bottleneck-driven flow | 10-stage pipeline with explicit gates; signal-driven attenuation |
| Cybernetics (Wiener, Ashby — implicit) | Requisite variety; control loops | Governance signals + tuning loop architecture |

**Canonical anchors:** [GOVERNANCE-ATTENUATION-EXECUTION-BOARD.md](../GOVERNANCE-ATTENUATION-EXECUTION-BOARD.md), [implementation/GOVERNANCE-SIGNALS.md](../implementation/GOVERNANCE-SIGNALS.md), [tools/detect-signals.ts](../tools/detect-signals.ts)

---

## L2 — Behavioral & decision science

*How do agents (human or LLM) actually decide under ambiguity?*

| Source | Contribution | Where it lives |
|--------|--------------|----------------|
| Kahneman & Tversky | Heuristics and biases | Readiness gates; "no-regret defaults" |
| Richard Thaler & Cass Sunstein | Choice architecture, nudges | Agent prompts as choice architecture for LLMs |
| Nassim Taleb | Antifragility, fat tails, optionality | Drift detection over hard prediction; reversible-by-default actions |

**Canonical anchors:** [vault/constitution/domainspec-subagents-strategy-constitution.md](constitution/domainspec-subagents-strategy-constitution.md), [PHASED-PLAN.md](../PHASED-PLAN.md)

---

## L3 — Mathematics & formal methods

*What can be proven, computed, or mechanically checked?*

| Discipline | Contribution | Where it lives |
|------------|--------------|----------------|
| Category theory | Functor `Δ : L₁ → L₂` between domain and code categories | [.claude/agents/domainspec-l1-extractor.agent.md](../.claude/agents/domainspec-l1-extractor.agent.md), `domainspec-l2-extractor`, `domainspec-delta-extractor` |
| Graph theory | Typed graph (25 node-types × 29 edge-types) | [TAXONOMY.md](../TAXONOMY.md), [RELATIONSHIPS.md](../RELATIONSHIPS.md), [.claude/skills/custom/edge-catalog.md](../.claude/skills/custom/edge-catalog.md) |
| Type theory / schema validation | Frontmatter + JSON schemas | [.claude/skills/custom/frontmatter.md](../.claude/skills/custom/frontmatter.md); `tools/check_*` |

**Canonical anchors:** [vault/discovery/domainspec-types-and-edges-validation/](discovery/domainspec-types-and-edges-validation/), [vault/ontology-architecture-draft.md](ontology-architecture-draft.md)

---

## L4 — Knowledge representation & ontology

*How is meaning encoded so both humans and machines can use it?*

| Discipline | Contribution | Where it lives |
|------------|--------------|----------------|
| Ontology engineering (OWL/RDF lineage, implicit) | Typed nodes, typed edges, inverse edges | [vault/discovery/inverse-edge-fix/](discovery/inverse-edge-fix/), [vault/discovery/domainspec-vault-edges/](discovery/domainspec-vault-edges/) |
| PKM / Zettelkasten (Ahrens) | Atomic notes with explicit links | [vault/](.) layout; `## Connections` blocks |
| Semantic search / embeddings | Concept lookup by meaning, not name | [.claude/skills/custom/semantic-index.md](../.claude/skills/custom/semantic-index.md); `vault-routing context_menu` |
| Single-source-of-truth discipline | Glossary + registry stay authoritative | [docs/glossary.md](../docs/glossary.md), [docs/registry.md](../docs/registry.md), [tools/generate-registry.ts](../tools/generate-registry.ts) |

---

## L5 — System & software architecture

*How do we structure code so it can be reasoned about and changed?*

| Source | Contribution | Where it lives |
|--------|--------------|----------------|
| Christopher Alexander | Pattern languages | [ARCHITECTURE-PATTERN-LIBRARY.md](../ARCHITECTURE-PATTERN-LIBRARY.md), [architecture/pattern-library/](../architecture/pattern-library/) |
| Eric Evans (DDD, implicit) | Ubiquitous language; domain-first design | The whole DomainSpec premise; vertical slices in [docs/features/](../docs/features/) |
| Hexagonal / Clean architecture | Layer laws, dependency direction | [.claude/skills/custom/code.md](../.claude/skills/custom/code.md); `domainspec-layering-auditor` |
| Event-driven architecture | Async coordination via events | [vault/constitution/event-system-constitution.md](constitution/event-system-constitution.md) |
| Folder-structure-as-architecture | Physical layout encodes intent | [vault/constitution/folder-structure-constitution.md](constitution/folder-structure-constitution.md) |

---

## L6 — Engineering practice

*Day-to-day craft: tests, commits, debugging, observability, infra.*

| Discipline | Contribution | Where it lives |
|------------|--------------|----------------|
| TDD | Tests precede implementation | [TEST-PIPELINE.md](../TEST-PIPELINE.md), [.claude/skills/custom/testing.md](../.claude/skills/custom/testing.md), `domainspec-test-designer` |
| Observability / SRE | OpenTelemetry; SLOs | [OBSERVABILITY.md](../OBSERVABILITY.md), `domainspec-otel-instrumenter`, `domainspec-otel-verifier`, [infra/prometheus.yml](../infra/prometheus.yml), [infra/alerts/](../infra/alerts/) |
| IaC / GitOps | Declarative infra, git as source of truth | [INFRA-SETUP.md](../INFRA-SETUP.md), [docs/features/gitops-assessment/](../docs/features/gitops-assessment/) |
| Frontend craft | UI as a first-class derivable artifact | [docs/UI-ARCHITECTURE.md](../docs/UI-ARCHITECTURE.md), [vault/axiom/frontend-axioms.md](axiom/frontend-axioms.md), `gsd-ui-*` agents |
| Commit & review discipline | Atomic commits; structured review | [vault/constitution/commit-message-constitution.md](constitution/commit-message-constitution.md); `commit-message`, `review`, `security-review` skills |

---

## L7 — Multi-agent orchestration (LLM-specific)

*A layer that didn't exist five years ago — how do you compose unreliable agents into a reliable pipeline?*

| Idea | Contribution | Where it lives |
|------|--------------|----------------|
| Subagent dispatch strategy | When to fan out, how to synthesize | [vault/constitution/domainspec-subagents-strategy-constitution.md](constitution/domainspec-subagents-strategy-constitution.md); `domainspec-subagents-strategy` skill |
| Agent-runner contracts | Standardized input/output envelope | [internal_tools/agents-telemetry/docs/agent-runner.md](../internal_tools/agents-telemetry/docs/agent-runner.md) |
| Robot-Talks (adversarial parallel) | Multi-perspective investigation | [vault/constitution/robot-talks-constitution.md](constitution/robot-talks-constitution.md); `/robot-talks` |
| Plan-first execution contract | Plan before code; commit to scope | [docs/research/plan-first-execution-contract.md](../docs/research/plan-first-execution-contract.md) |
| Telemetry as ground truth | Measure what agents *actually* do | [internal_tools/agents-telemetry/](../internal_tools/agents-telemetry/) |

---

## L8 — Governance & institutions

*Who is allowed to change what, and how does authority degrade over time?*

| Source | Contribution | Where it lives |
|--------|--------------|----------------|
| Daron Acemoglu | Institutions matter; extractive vs inclusive structures | [AUTHORITY-MAP.md](../AUTHORITY-MAP.md), [GOVERNANCE-ATTENUATION.md](../GOVERNANCE-ATTENUATION.md) |
| Casey West (ADLC) | Agentic Delivery Lifecycle | [ADLC-ALIGNMENT.md](../ADLC-ALIGNMENT.md) |
| Policy-as-code | Hooks + tags enforce rules at runtime | [governance/tags/](../governance/tags/), hooks in [.claude/settings.json](../.claude/settings.json) |

---

## How the layers relate

- **Foundations (L0–L3) constrain Methods (L4–L7).** A method that violates an epistemic axiom is wrong before it is run.
- **Methods enable Application (L8).** Governance composes from architectural and orchestration primitives.
- **Application produces signals that feed back to Foundations (L7 → L0).** Telemetry on agent dispatches surfaces which axioms held, which premises drifted, and which discoveries need re-opening.

This is the load-bearing loop. Cutting any one layer collapses the others into ungrounded opinion.

---

## Open questions

- **OQ-1.** Is L7 (multi-agent orchestration) a genuinely new layer, or a special case of L1 (control theory) applied to LLMs? Treating it as new for now; revisit when the constitution stabilizes.
- **OQ-3.** The implicit attributions (Wiener/Ashby for cybernetics, Evans for DDD, OWL/RDF for ontology) are unverified — they reflect the design space, not direct citations. Promote to explicit only if a load-bearing claim depends on them.

## Resolved questions

- **OQ-2 (Resolved 2026-05-19).** Does L9 (business/domain) belong in the vault at all, or only in `docs/features/`? **Resolved:** L9 belongs only in `docs/features/`, not in the vault foundational map. The vault holds discipline-level lineage; specific business domains DomainSpec has been pointed at (payments/FIDC, inventory, personal finance, etc.) are feature-folder concerns, not foundational knowledge. L9 section removed in v0.2.0.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| `.claude/skills/custom/semantic-index.md` | `cites` | L4 — semantic lookup is the operational arm of ontology-as-search. |
| `.claude/skills/custom/frontmatter.md` | `cites` | L3 — frontmatter schema is the type-theory boundary for vault nodes. |
| `.claude/skills/custom/edge-catalog.md` | `cites` | L3/L4 — typed edges between vault nodes. |
| `.claude/agents/domainspec-l1-extractor.agent.md` | `cites` | L3 — extracts the domain category for the functor Δ. |
| `.claude/agents/domainspec-l2-extractor.agent.md` | `cites` | L3 — extracts the code category for the functor Δ. |
| `.claude/agents/domainspec-delta-extractor.agent.md` | `cites` | L3 — reconstructs the compilation functor Δ : L₁ → L₂. |
| `vault/conceptual/epistemic-principles.md` | `cites` | L0 epistemology — the catalog of thinking heuristics (Occam, Lindy, orthogonality) cited as the operational expression of falsifiability discipline. |
| `vault/axiom/domainspec-axioms.md` | `cites` | L0/L8 — AX-DS-1…AX-DS-4 are the methodology axioms the foundational map rests on for the spec→code direction and decision-space preservation. |
| `vault/axiom/ontology-axioms.md` | `cites` | L4 knowledge representation — AX-ONT-1/2/4/5 are the load-bearing claims for orthogonal classification and explicit-question accounting. |
| `vault/axiom/system-axioms.md` | `cites` | L1 systems & control — AX-SYS-1…AX-SYS-5 (determinism, immutability, observability) anchor the architecture-layer commitments. |
| `vault/axiom/frontend-axioms.md` | `cites` | L6 engineering practice — frontend axioms (determinism, unidirectional data flow, fetch/render separation) anchor the UI craft layer. |
| `vault/constitution/domainspec-subagents-strategy-constitution.md` | `cites` | L7 multi-agent orchestration — the dispatch-strategy constitution is the load-bearing rule set for fan-out, synthesis, and lifecycle of subagents. |
| `vault/constitution/event-system-constitution.md` | `cites` | L5 software architecture — event-driven coordination rules are cited as the load-bearing async pattern. |
| `vault/constitution/folder-structure-constitution.md` | `cites` | L5 software architecture — folder-structure-as-architecture is cited as the load-bearing layout encoding intent. |
| `vault/constitution/robot-talks-constitution.md` | `cites` | L7 multi-agent orchestration — adversarial parallel investigation is cited as the load-bearing rule set for multi-perspective scope decomposition. |
| `vault/constitution/commit-message-constitution.md` | `cites` | L6 engineering practice — atomic commit discipline is cited as the load-bearing rule for review-grade history. |
| `vault/ontology-conventions.md` | `cites` | L3/L4 — Section 8 bidirectionality rule and Appendix C edge catalog are cited as the operational expression of typed-graph knowledge representation. |
| `vault/ontology-architecture-draft.md` | `cites` | L4 knowledge representation — Bayesian agent + gates-of-trust architecture cited as the future instrumentation layer for the foundational lineage. |
| `vault/premise/systems-control-premise.md` | `cites` | L1 systems & control — load-bearing premise that software delivery is a control system; drift is measured, not predicted. |
| `vault/premise/choice-architecture-premise.md` | `cites` | L2 behavioral / decision science — load-bearing premise that prompt structure is causal to LLM-agent outcomes. |
| `vault/axiom/category-theory-compilation-axiom.md` | `cites` | L3 mathematics / formal methods — load-bearing axiom that domain and code form categories, with compilation as a functor Δ. |
| `vault/premise/multi-agent-composition-premise.md` | `cites` | L7 multi-agent orchestration — load-bearing premise that reliable pipelines require governed dispatch + typed outputs + telemetry. |
