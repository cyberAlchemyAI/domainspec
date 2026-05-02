---
name: scratchpad
description: Create or update a session scratchpad for multi-turn work
---

# Session Scratchpad

Create or update a file at `claude/current_conversations/YYYY-MM-DD-HHMM-UNIQUEID-<topic>.md`.

- **UNIQUEID**: 5 alphanumeric chars (e.g. `q5vt2`)
- Write the session goal at the top

## When to write

- Topic spans more than one exchange
- Topic produces a concrete output (decision, document, insight, open question, blocker)

## Format

Append bullet points only — no prose. Each entry uses one prefix:

- `[DECISION]` — what was decided and why
- `[INSIGHT]` — something that reframes prior understanding
- `[QUESTION]` — open question needing follow-up
- `[BLOCKER]` — something discovered that blocks progress
