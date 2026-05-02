---
tags: [testing, bug-fix, visualization, workspace]
node_type: implementation-plan
is_session: true
layer: tooling
nature: descriptive
status: active
created: 2026-04-29
timestamp: 2026-04-29T08:21:50-03:00
expires: 2026-06-28
conversation_id: ~
decisions_made: false
contradictions_found: false
specs_updated: []
promoted_candidates: []
expected_importance: 5
importance_rationale: "Extends test coverage and fixes a UI state bug in a visualization workspace, relevant but narrowly scoped to tooling infrastructure."
---

# App Release — Test Coverage and Inspector UI Fix

## Summary

This session continued the implementation of the app-release visualization workspace. The core server, workspace-store, UI, and 4 initial tests were already wired from a prior session. We extended test coverage with 5 new unit tests covering US-2 input validation, US-4 InspectGraphNode, US-6 prototype selection exclusivity and rejection, ListGovernanceQueue role/status filters, and the projectionReason required-field rule. A UI bug was also fixed where `state.activeNodeId` persisted across workspace creates, causing stale 404 calls to the inspector; it now resets on creation and is validated against the live graph on each state load.

## Files touched

- visualizations/app-release/server.test.mjs
- visualizations/app-release/index.html
