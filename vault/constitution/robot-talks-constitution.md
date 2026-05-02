---
tags: [agents, investigation, orchestration, complexity-reduction, multi-agent, constitution]
node_type: constitution
is_session: false
layer: architecture, ontology
nature: procedural, technical
status: active
version: 0.6.0
last_updated: 2026-04-10
---

# Robot-Talks Constitution

> **Charter:** Rules governing multi-agent parallel investigation for complexity reduction.
>
> **Working hypotheses:** See [robot-talks-premises.md](../premise/robot-talks-premises.md) (8 premises).  
> **Theoretical grounding:** See [robot-talks-discovery.md](../../../specs/ontology/possible_constitutions/robot-talks/robot-talks-discovery.md) for the full argument.
>
> **Proof-of-concept:** Frontend-backend alignment investigation (2026-04-10) — 4 agents, 4 cross-layer tensions identified.

---

## Premises

> **Reference:** These premises are also maintained in the vault at [robot-talks-premises.md](../premise/robot-talks-premises.md). The vault versions include test-for-falsification and evidence sections. This section provides the constitutional context.

### PM-1: Cross-Layer Tensions Require Multi-Perspective Investigation

When a system spans multiple abstraction layers, assumptions held at one layer often contradict reality in another. A single investigator must trade depth for breadth — going deep on one layer means missing cross-layer contradictions. Assigning bounded concerns to parallel agents, then synthesizing for contradictions, resolves this trade-off.

### PM-2: Scope Design Determines Signal Quality

Parallel agents do not automatically reduce entropy. They reduce it **only if** the scope decomposition was correct. If you cut the problem along the wrong boundaries, you get blind spots. The value of robot-talks comes from scope design, not from parallelization itself.

Given investigation space $S$ and a decomposition $D = \{S_1, S_2, \ldots, S_k\}$, signal quality $Q$ depends on two properties:

$$Q(D) \propto \text{coverage}(D) \cdot \text{independence}(D)$$

Where:
- **Coverage:** $\frac{|\bigcup S_i|}{|S|}$ — blind spots reduce signal proportionally to the importance of what they miss.
- **Independence:** $1 - \frac{\sum_{i \neq j} |S_i \cap S_j|}{|\bigcup S_i|}$ — concern overlap creates ambiguity that synthesis cannot resolve.

$Q$ is maximized when concerns are complete and non-overlapping. Parallelization affects latency, not $Q$.

### PM-3: Synthesis Is Tension Discovery, Not Aggregation

Combining agent reports is not synthesis. Synthesis is the identification of **tensions** — where findings from different layers contradict documented contracts or mutual assumptions. A robot-talk with 10 findings and 1 systemic tension is more valuable than one with 100 findings and no tensions.

If synthesis cannot point to which agent finding contradicts which other finding or which documented contract — there is no tension. Tensions are found, not created.

### PM-4: Localization Precedes Reduction

You cannot reduce the complexity of a system you do not understand. Robot-talks are an **auditing tool**. They cannot be invoked to "fix this thing" — only to understand "what are all the ways this thing is misaligned?" Once tensions are mapped, implementation (a separate step) can address them.

### PM-5: Robot-Talks Implement Pulsed Orchestration

The three phases map to the [pulsed orchestration thesis](../../business-philosopher/assuntos/orquestracao-multi-agente/tese-orquestracao-por-pulso.md):
- **Descida:** Scope definition — investigator decomposes question into bounded agent roles. Fidelity dominates: a distorted scope contaminates all agent work.
- **Execução:** Parallel exploration — agents investigate independently, most information is ephemeral. Efficiency dominates: agents should be concise within bounds.
- **Subida:** Synthesis + Human Gate — findings condensed, tensions identified, human validates. Entropy and fidelity dominate: synthesis must be minimal, precise, and faithful.

### PM-6: Bounded Scope Is a Precondition

If you cannot state what an agent is *not* investigating, you do not have a robot-talk. You have unfocused exploration. Every agent must have an explicitly stated scope and an explicitly stated exclusion.

### PM-7: Concerns Must Not Overlap; Evidence May

No two agents investigate the same *question* or *concern*. But two agents may read the same artifact (e.g., an API contract) from different perspectives. Concern overlap creates ambiguity in synthesis. Evidence overlap is often necessary for tension discovery.

### PM-8: Fidelity Increases as Information Rises

Every synthesis statement must be traceable to agent findings. Every agent finding must be traceable to code, documentation, or observable behavior. No assertions without evidence. The chain — evidence → finding → tension → recommendation — must preserve a back-reference at each step. 100% traceability is required. Breaking this chain turns the process into opinion aggregation.

---

## Rules

### R1: Invocation Criteria

**Decision Checklist (all must be YES):**

- [ ] Problem spans **2+ distinct abstraction layers** (not a single-file bug or local refactor)
- [ ] A **single investigator would trade depth for breadth** (going deep on one layer would miss cross-layer contradictions)
- [ ] You need to **identify contradictions before acting** (audit phase, not implementation)
- [ ] **Cost of misunderstanding exceeds cost of ~90 min investigation** (rough threshold: if error could require 3+ hour refactor, do the audit)

If any box is empty, choose a different approach:
- Single-file bug with a stack trace → `systematic-debugging`
- "How does feature X work?" → `gitnexus-query`
- Refactoring a module → `gitnexus-impact-analysis`
- Implementing a well-specified feature → implement directly

**Proof-of-concept example (POC):** Frontend-backend alignment investigation (2026-04-10). 4 agents spanning API contracts, backend mutations, frontend error handling, communication patterns. Result: 4 critical tensions identified (error inconsistency, idempotency mismatch, race condition, missing job tracking). Cost: ~90 min. Payoff: Prevented shipping broken feature.

### R2: Scope Must Be Written Before Agents Begin

Scope definition has two stages with distinct ownership:

**Stage A — User defines the problem.** The user must provide:
1. **Central Question** — what tension or gap are we investigating?
2. **Layer Definitions** — what distinct subsystems are involved?
3. **Assumptions to Challenge** — what do we *think* is true but might be wrong?

The orchestrator must NOT proceed until the user has stated all three. Ask if missing. The orchestrator lacks the domain context to invent these.

**Stage B — Orchestrator proposes strategy.** Based on the user's input:
4. **Agent Boundaries** — for each agent: what they investigate, what is explicitly out of scope
5. **Success Criteria** — when is the investigation complete?
6. **Strategy Check** — state one alternative decomposition considered and why it was rejected. Present both the chosen strategy and the alternative to the user. Agents do NOT spawn until the user evaluates and approves the approach. This ensures scope design (the highest-leverage decision per PM-2) is never an unchallenged default.

If scope cannot be written in clear prose, the robot-talk cannot proceed.

**Scope Decomposition Heuristic:**

Decompose along **concerns**, not files. Example: if investigating frontend-backend misalignment:
- ❌ WRONG: "Agent 1 reads frontend/*, Agent 2 reads backend/*" (file-based, likely overlapping questions)
- ✅ RIGHT: "Agent 1: API contract assumptions. Agent 2: Backend mutation implementation. Agent 3: Frontend error handling strategy. Agent 4: Concurrency semantics." (concern-based, non-overlapping questions, may read same files)

**Concern overlap test:** If both agents could produce contradictory answers to *the same question*, scopes overlap. Redefine. If they answer *different questions* using *the same evidence* (e.g., both read the API spec but ask different things), that's fine — tension discovery often requires evidence overlap.

**Coverage check:** Before spawning, list the major assumptions in the system. Assign each assumption to exactly one agent to investigate. Any assumption not assigned = blind spot.

### R3: Agent Reports Must Be Standardized

Every agent report contains:
1. **Key Findings** (3–5 bullets, each with evidence: file path, line number, documentation reference)
2. **Gaps or Inconsistencies** (what is missing, undocumented, or contradictory within this scope)
3. **Local Tensions** (conflicts within this agent's scope — documentation vs. code, etc.)
4. **Questions for Synthesis** (what should synthesis focus on from this report?)

A finding without evidence is speculation, not finding.

### R4: Synthesis Must Identify Tensions

Synthesis identifies **conflicts**, not summaries:
- Agent A says X, Agent B says not-X
- Agent says X, documentation guarantees not-X
- Frontend assumes Y, backend implements not-Y

Each tension must include:
- **Held by [Layer A]:** the assumption or expectation
- **Reality in [Layer B]:** what the code/system actually does
- **Impact:** what breaks, severity
- **Evidence:** specific agent findings that conflict

A synthesis without explicit tensions is a summary, not a synthesis.

### R5: The Human Gate Is Mandatory

Before any recommendation is acted upon, a human must:
1. Read the synthesis
2. Validate that tensions are real (not misinterpretations)
3. Authorize the next action

No agent synthesizes into implementation without this validation.

**Tension Validation Guide:**

For each identified tension, ask:

| Question | Real Tension | Misinterpretation |
|----------|--------------|-------------------|
| Is this contradiction intentional (legacy compatibility, migration in progress, documented exception)? | NO — it's unintentional | YES — it's a design choice, accepted trade-off |
| Does the contradiction cause observable problems (bugs, user friction, missed requirements)? | YES — failure modes exist | NO — difference exists but no harm |
| Is this a documented expectation that the system violates? | YES — contract broken | NO — contract doesn't address this |
| Would fixing this contradiction require significant effort? | If cost is reasonable → real tension; if prohibitive, human decides priority | Context-dependent; human judgment required |

**Decision matrix after validation:**
- ✅ **Real + actionable** → Author implementation plan (separate session)
- ⚠️ **Real + deferred** → Create backlog item with justification
- ❌ **Misinterpretation** → Close with explanation; add to documentation if others might be confused by the same thing
- 🤔 **Uncertain** → Request agent follow-up on specific question (iterative synthesis, see R7)

### R6: Synthesis Can Be Iterative (Single Pass Is Default)

**Default pattern:** Single synthesis pass (10-20 min). Agents report, synthesis identifies tensions, human gates.

**Iterative pattern (rare, only if triggered by R5 validation):** 

If human gate asks "I need more clarity on Tension X" or synthesis surfaces a contradiction that only becomes visible after first-pass synthesis, optionally:
1. Author a **targeted follow-up question** (narrow scope, single concern)
2. Re-assign to original agent(s) with the question as constraint
3. Perform second synthesis pass with updated findings
4. Return to human gate

**When to iterate:**
- ✅ Tension identification hinges on clarifying one specific assumption
- ✅ Agent finding was incomplete; one follow-up resolves it
- ❌ DON'T iterate to "get more findings" — that's scope creep
- ❌ DON'T iterate just because synthesis raised many questions — that's poor scope design (fix for next robot-talk)

**Cost:** Each iteration adds ~20 min. Cap at 1 iteration per robot-talk unless human explicitly approves additional rounds.

### R7: Session Must Be Preserved

The session document (`node_type: agent-dialogue`) preserves all agent reports, the synthesis, Human Gate notes, and links to resulting implementation. Purpose: provenance. When someone asks "why did we refactor X?", the answer traces back to this dialogue.

**Session structure:**

```markdown
---
session_id: XXXXX
date: YYYY-MM-DD
topic: [Topic]
status: complete | partial_synthesis
---

# [Topic]

## Investigation Scope
[From R2]

## Agent Reports
[Each agent report verbatim, with findings and evidence]

## Synthesis
[All identified tensions with evidence]

## Human Gate Notes
[Validation, decisions, authorization]

## Follow-up Actions
[Links to resulting implementation PRs, backlog items, documentation updates]
```

**Location:** `claude/current_conversations/YYYY-MM-DD-HHMM-UNIQUEID-<topic>.md`

---

## Execution Patterns

### Scope Template

```markdown
## Investigation Scope

**Central Question:** [What tension or gap are we investigating?]
**Why Now:** [What triggered this investigation?]

**Agent Roles:**

| Agent | Concern | Central Question | Out of Scope |
|-------|---------|-----------------|--------------|
| Agent 1 | [layer/concern] | [what should this agent answer?] | [what NOT to investigate] |
| Agent 2 | [different concern] | [what should this agent answer?] | [what NOT to investigate] |
| Agent 3 | [different concern] | [what should this agent answer?] | [what NOT to investigate] |

**Assumptions to Challenge:**
- [Layer A assumes X — is it true?]
- [Layer B guarantees Y — does it actually?]

**Success Criteria:** [Investigation complete when...]
```

### Tension Template

```markdown
## Tension: [Descriptive Name]

**Held by [Layer A]:** [assumption or expectation]
**Reality in [Layer B]:** [what the code/system actually does]
**Impact:** [severity] — [what breaks, who is affected]
**Evidence:**
- Agent 1: [specific finding]
- Agent 2: [specific finding that contradicts]
```

### Timeline Guidance

| Phase | Typical Duration |
|-------|-----------------|
| Scope definition | 10 min |
| Parallel exploration | 15–20 min per agent |
| Synthesis | 15–20 min |
| Human Gate | 15–30 min |

Heartbeat timeout: if no agent completes within 30 min, force synthesis with partial findings tagged as `partial_synthesis`.

Recommended agent count: 3–5. Fewer than 3 means single-agent is cheaper. More than 5 means synthesis becomes unwieldy.

---

## Governance

### Adoption Path

This constitution is in **active** (POC validated, 2026-04-10). Status history:
- **Draft** (v0.5.0 and earlier) — exploratory phase
- **Active** (v0.6.0+, 2026-04-10) — POC completed (frontend-backend alignment), skill created, integration into CLAUDE.md complete
- Next phase (if needed): Ratify to **consolidated** after 3+ additional robot-talks under operational conditions

### Amendment Process

- **Clarifications:** Patch version (apply immediately)
- **New patterns or checks:** Minor version (discussion, soft consensus)
- **Redefining invocation or removing rules:** Major version (explicit approval)

### Non-Negotiable Principles

Robot-talks MUST always:
- Preserve agent independence (no shared state during exploration)
- Require explicit synthesis (not implicit conclusions)
- Identify tensions (not just aggregate findings)
- Maintain traceability (from recommendations back to evidence)
- Include human validation before action

---

## Connections

| Node | Relationship | Purpose |
|------|--------------|---------|
| [robot-talks-premises.md](../premise/robot-talks-premises.md) | `operationalized-by` | 8 working hypotheses (P-RT-1 through P-RT-8) with test-for-falsification and evidence |
| [robot-talks (skill)](../../../.claude/skills/robot-talks/SKILL.md) | `operationalized-by` | Slash-command skill: `/robot-talks` |
| [robot-talks-discovery.md](../../../specs/ontology/possible_constitutions/robot-talks/robot-talks-discovery.md) | `grounded-by` | Theoretical argument for why this pattern works |
| [CLAUDE.md Route 10](../../../CLAUDE.md) | `integrated-into` | Robot-talks routing in agent context router |
| [tese-orquestracao-por-pulso.md](../../business-philosopher/assuntos/orquestracao-multi-agente/tese-orquestracao-por-pulso.md) | `instantiates` | Robot-talks are pulsed orchestration applied to investigation |
| [frontend-backend-alignment (POC sessions)](../../../claude/current_conversations/) | `validated-by` | 4 agents, 4 tensions identified, demonstrates scope decomposition and synthesis |
| [development-practices-constitution.md](./development-practices-constitution.md) | `informs` | Governance patterns |
---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 0.6.0 | 2026-04-10 | **Promoted to ACTIVE** after POC validation. Enhanced R1 with invocation checklist + POC example. Enhanced R2 with scope decomposition heuristic (concern-based, coverage check). Enhanced R5 with tension validation table. Added R6 (iterative synthesis guidance). Enhanced R7 (session preservation structure). Created companion skill (robot-talks.md). Integrated into CLAUDE.md Route 10. Updated connections. |
| 0.5.0 | 2026-04-10 | Removed Axioms section (premature — we don't know them yet). Merged valuable content into Premises (PM-1 through PM-8). Stripped math that decorated without adding insight; kept coverage × independence (PM-2). |
| 0.4.0 | 2026-04-10 | Added mathematical formulations to all axioms and all premises. Cross-referenced session-cost-observability for cost instrumentation. |
| 0.3.0 | 2026-04-10 | Split: extracted theoretical content to robot-talks-discovery.md. Tightened AX-2 (scope design, not parallelization). Fixed PM-3 (concern overlap vs evidence overlap). Removed premature R6 (ownership/timeline). Reduced from ~500 lines to ~200. |
| 0.2.0 | 2026-04-10 | Complete constitutional rewrite with axioms, premises, rules, patterns, validation checklists. |
| 0.1.0 | 2026-04-10 | Initial discovery document. |
