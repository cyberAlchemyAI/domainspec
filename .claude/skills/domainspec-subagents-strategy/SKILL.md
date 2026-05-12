---
name: domainspec-subagents-strategy
description: Coordinate fan-out (2+ parallel subagents) or recursive subagent dispatch using the 7-step lifecycle from domainspec-subagents-strategy-constitution.md. Use when about to dispatch 2+ subagents in parallel or to allow recursive dispatch. Single-agent dispatches run inline (no skill needed).
---

# Subagents-Strategy Skill

Operationalizes [vault/constitution/domainspec-subagents-strategy-constitution.md](../../../vault/constitution/domainspec-subagents-strategy-constitution.md). When this skill is active, **you (the parent Claude session) enact the strategist role**. Read the constitution for the full rules; this skill executes them.

## When to invoke

Invoke when about to dispatch **2+ subagents in parallel (fan-out)** or **allow recursive dispatch**. Single-agent dispatch runs inline.

The dispatch decision itself is governed by R1 (four triggers: synthesis / context-protection / isolation / parallelism). If none hold, do not dispatch at all.

## The 7-step lifecycle (R3)

### Step 1 — Propose in chat (you, as strategist)

Output a chat proposal containing:

- **Mode** (R19): one of `single` | `task-fan-out` | `robot-talks` | `sequential` | `mixed`.
- **Per-agent table** (R14, R18): for each child agent — id, model, one-liVne difficulty justification, token budget (or "unbounded"), declared output shape.
- **Sequencing**: linear chain, parallel set, or DAG description.
- **Recursion budget** (R13): defaults are depth 2 / breadth 5 / total cap 10. Override only with justification.
- **Suggested working folder** (R15): propose `docs/features/<feature>/research/<topic>/` where `<feature>` is the active feature in the conversation and `<topic>` is the dispatch slug. The artifacts live alongside the feature's specs. **If no feature is active, halt the proposal and ask the user which feature this dispatch belongs to.** Never default to `.planning/` (deprecated) or `vault/` (reserved for codified discipline). If the work doesn't fit any existing feature, the user must name a new feature or decline the dispatch.
- **Context** and **Goal** for this dispatch (R23): 2–4 sentences on where the need arose; 1–2 sentences on what the dispatch is trying to achieve.

**No file is written.** R4: never persist the proposal as a file.

### Step 2 — User confirms

Wait for explicit user response (R6a). Three valid responses:

- **Confirm** → proceed to Step 3.
- **Revise** → re-draft Step 1.
- **Abandon** → stop. Nothing persists.

The user also confirms (or revises) the **working folder choice** here.

### Step 3 — Single-message fan-out

Dispatch all children in **one** assistant message (R8) using the Agent tool. Each child's briefing MUST carry the R10 fields:

- **Goal** — what to produce.
- **Why it matters** — context for judgment calls.
- **Already ruled out** — what the agent should not re-explore.
- **Expected output shape** — structure / length / format.
- **Length cap** — token or word limit.

For **recursion** (children that may themselves dispatch): track running agent count across the dispatch tree. Refuse the next dispatch when total cap (R13: default 10) would be exceeded; escalate to user with: *"Budget hit at N agents — continue with raised budget, stop, or revise scope?"*

Children DO NOT write files (R5). They return findings to you.

### Step 4 — Collect and return (you, as strategist)

After all children return: gather their verbatim outputs. Bundle these together with the original Context + Goal and the user-confirmed working-folder path. **Do not write any file yourself** (R5).

### Step 5 — Dispatch `domainspec-research-writer`

Invoke the agent with a briefing that contains:

- The collected child returns (verbatim, one block per child).
- The original Context + Goal (from Step 1, user-confirmed in Step 2).
- The user-confirmed working folder path.

The agent persists `<working_folder>/research/domainspec-research.md` per the template at `templates/domainspec-research.md`.

### Step 6 — Dispatch `domainspec-findings-writer`

Invoke the agent with a briefing that contains:

- The path to the freshly-written `domainspec-research.md`.
- The original Context + Goal.

The agent reads research.md and persists `<working_folder>/research/domainspec-findings.md` per the template at `templates/domainspec-findings.md`. The output MUST satisfy R16 (three sections in order), R17 (every Findings/Analysis claim cites research.md), R18 (Dispatch record schema fully populated), R21+R22 (four-component grade with `(judgment)` markers on coverage / independence / fidelity).

### Step 7 — User-gate discovery promotion (R6b)

Present the findings file to the user and ask:

> *"Findings written to `<path>/domainspec-findings.md`. Promote this to a discovery node? A discovery captures explored design space — options considered, trade-offs, decisions taken — so future work can build on it without re-doing the exploration."*

If the user confirms, classify the discovery's scope and propose the target path family:

- **Knowledge scope** → `vault/discovery/<topic>-definitions/<slug>.md`. Choose this when the discovery's load-bearing claims govern the vault's own discipline — ontology axes, schema, edges, agent/skill protocols, premises, constitutions, or any rule future vault nodes will derive from. Signals: prompt mentions `vault/`, `node_type`, `layer`, ontology vocabulary, agent protocols, the lifecycle steps; output frames as a rule/convention/discipline.
- **Application scope** → `docs/features/<feature>/discovery/<slug>.md`. Choose this when the discovery's claims live or die with one feature. Signals: prompt mentions `docs/features/<feature>/`, a feature's `SPEC.md` / `STORIES.md` / `DECISIONS.md`, a user story, a UAT criterion, a specific business rule; output's "challenge response" is "update the feature spec," not "amend the constitution."

The strategist proposes scope + 1–3 candidate paths; the user confirms (or revises) before dispatch. There is no `regime` frontmatter field — existing labels (`layer`, `scope`, `tags`) carry the conceptual discrimination; the path encodes the operational choice.

After the user confirms the target path, dispatch `domainspec-discovery-writer` with: path to findings.md + the confirmed target path + scope label (`knowledge` | `application`) for the briefing record.

If the user declines: dispatch ends. The two artifact files remain at `<working_folder>/research/`.

## Verification before close (R11)

Before treating the dispatch as complete:

- Read each child's actual return (not just summaries).
- Confirm both artifact files exist at `<working_folder>/research/`.
- Confirm the findings file's Findings and Analysis sections have research.md citations.
- Confirm the Dispatch record is fully populated, including the four-component grade with `(judgment)` markers.
- Confirm the user was asked the discovery-promotion gate.

## References

- **Rules**: [vault/constitution/domainspec-subagents-strategy-constitution.md](../../../vault/constitution/domainspec-subagents-strategy-constitution.md) — 24 rules.
- **Rationale & falsification**: [vault/premise/domainspec-subagents-strategy-premises.md](../../../vault/premise/domainspec-subagents-strategy-premises.md).
- **Templates**: [templates/domainspec-research.md](../../../templates/domainspec-research.md), [templates/domainspec-findings.md](../../../templates/domainspec-findings.md).
- **Writer agents** (defined under `.claude/agents/`): `domainspec-research-writer`, `domainspec-findings-writer`, `domainspec-discovery-writer`.
