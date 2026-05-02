---
description: The official strict communication and logging protocol for all Godel Machine agents
---

# README: The Agent Communication Protocol

This document enforces the **Strict Append-Only Logging Protocol** that all agents within the Gödel Machine ecosystem *must* follow when documenting their state, issuing directives, or handing off tasks.

## 1. The Core Repository
All cross-agent communication happens linearly and chronologically inside:
`specs/newspaper/agents/info-exchange.md`

## 2. Inviolable Rules of Engagement
When an agent (or the Orchestrator) writes to `info-exchange.md`, they must strictly adhere to the following laws to ensure parser predictability and chronological integrity:

- **Rule 1: Never Append Inline (The Formatting Law).** You must never stick a new directive underneath an old timestamp. Every new communication, status update, or directive *must* be structured as a completely independent, standalone header block at the absolute bottom of the file.
- **Rule 2: The Header Anchor.** Every entry must begin with a Level 2 Header (`## SYNC: {Topic or Directive Name}`).
- **Rule 3: ISO-8601 Timestamps.** Every entry must have a strictly formatted timestamp enclosed in brackets and bolded immediately following the header. (e.g., `**[2026-03-25T01:37:52-03:00]**`).
- **Rule 4: Metadata Headers.** You must explicitly state the specific Agent Personas involved using `From:`, `To:`, `Status:`, and `Action Required:`.
- **Rule 5: No Destruction.** You may *never* delete another agent's log entry. The document is strictly append-only.

## 3. The Mandatory Template
Any agent appending to `info-exchange.md` must copy, paste, and fill out this exact schema at the bottom of the file:

```markdown
---

## SYNC: {Brief, descriptive title of your action or directive}

**[YYYY-MM-DDTHH:MM:SS-03:00]**  *(Replace with actual current timestamp)*
**From:** {Your Agent Persona Name}
**To:** {Target Agent Persona Name(s) or ALL AGENTS}
**Status:** {e.g., Urgent, Proposal, Task Completed, System Directive}
**Action Required:** {What the receiving agent must do upon waking up}

**Message:**
{Your detailed context, explanation, and architectural commands go here. Use Markdown lists or code blocks if necessary.}
```

## 4. Why This Exists
The D0 System Observation dashboard (`index.html` Matrix) and future parsing engines rely on predictable headers. Sloppy formatting, missing timestamps, or grouped inline messages cause the parsing boundaries to fail, breaking ecosystem synchronization. Strict adherence is required.

## 5. Periodic Flush Protocol (The Condensation Law)

`info-exchange.md` is a **live communication channel**, NOT a permanent archive. It must be kept lean so agents can load it without burning context tokens on dead history.

### 5.1 Flush Trigger
The Orchestrator **MUST** flush `info-exchange.md` when **any** of these conditions are met:
- The file exceeds **~50 entries** or **~30KB**.
- A new session begins and the Orchestrator determines the existing entries contain no pending `Action Required` items.
- The System Operator explicitly requests a flush.

### 5.2 Flush Procedure
Before deleting any content, the Orchestrator **MUST** execute this condensation sequence:

1. **Scan for open actions.** Any entry with `Action Required:` that has NOT been acknowledged by the target agent must be preserved (moved to the top of the new epoch) or explicitly resolved.
2. **Condense decisions into `system-state.md`.** Any new data contracts, trait assignments, voting taxonomy changes, constitutional rules, or open/closed loops must be absorbed into the authoritative state dashboard.
3. **Log architectural decisions into `evolution-wall.md`.** Any entry that represents a system-level decision (not routine agent chatter) must be summarized as a one-paragraph entry in the Evolution Wall.
4. **Reset `info-exchange.md`.** Replace the body with a clean epoch header and a single Orchestrator bootstrap entry documenting what was flushed and where it went.

### 5.3 Epoch Numbering
Each flush increments the epoch counter in the `info-exchange.md` title (e.g., "Epoch 2", "Epoch 3"). The flush event itself is logged in `evolution-wall.md`.

### 5.4 Who Can Flush
**Only the Orchestrator** has flush authority. Individual agents may NOT delete or truncate `info-exchange.md`. Agents may request a flush by appending a `SYNC` entry with `Action Required: Orchestrator flush`.

## 6. The Three-File Observability Architecture

| File | Purpose | Mutability | Who writes |
|------|---------|------------|------------|
| `system-state.md` | **What IS** — authoritative live dashboard | Updated by Orchestrator on state changes | Orchestrator only |
| `evolution-wall.md` | **What WAS DECIDED** — chronological decision log | Append-only (newest first) | Orchestrator + agents (for their domain decisions) |
| `info-exchange.md` | **What IS HAPPENING NOW** — live agent comms | Append-only between flushes; periodically flushed by Orchestrator | All agents |

**Every agent must read `system-state.md` before beginning any task.** The info-exchange is supplementary context, not the source of truth.
