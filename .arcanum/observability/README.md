---
tags: [arcanum, codex-command]
node_type: readme
is_session: false
layer: application
nature: reference, explanatory
status: active
version: 0.1.0
last_updated: 2026-05-27
---

# Arcanum Observability

This repository-local package stores Arcanum command, sigil, and spell telemetry plus reflection state.

- signals/sigil-invocations.jsonl is the central append-only invocation ledger.
- by-sigil/ and by-capability/ hold rebuildable ledger-reference indexes.
- hooks/ stores hook operation evidence.
- runs/ stores pending and completed observer envelopes.
- reflections/ can hold reflection reports.
