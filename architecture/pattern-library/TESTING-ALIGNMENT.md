# Testing Alignment

Use this document to map architecture layers to mandatory test obligations.

## Layer-to-Test Mapping

- Domain tests: rules, calculations, state transitions, invariants.
- Application tests: use-case behavior with mocked ports.
- Workflow tests: happy path + compensation ordering.
- Infrastructure tests: contract/integration tests against ports.
- Interface tests: request/response contract tests.

## Why This Exists

This alignment keeps implementation behavior traceable from architecture to verification.

## Canonical Pipeline Reference

For full derivation and generation workflow, use `../../TEST-PIPELINE.md`.
