---
description: Workflow and best practices for writing tests
tags: [agent, testing, workflow]
node_type: conceptual
layer: architecture
nature: procedural
status: active
version: 1.0.0
last_updated: 2026-03-24
---

# Testing Workflow

If you have been called to write or fix tests, your role is to ensure the system behaves deterministically without violating architectural boundaries. This is the general testing guide (for testing uncommitted changes specifically, see `/test-uncommited-changes`).

**Navigation & Strategy Tips:**
- **Code Intelligence First**: Use GitNexus (`gitnexus_context` and `gitnexus_query`) to understand the blast radius (`gitnexus_impact`) and execution flows heavily before writing any mocks. Don't guess dependencies.
- **Isolate by Layer**: 
    - **Domain Layer**: Must be tested using pure Unit Tests. Do NOT mock IO, because domain code should not have IO.
    - **Use Cases**: These orchestrate. They MUST be tested via Integration Tests that drive the flow from Controller to Repository paths. Mocks should only be used at the boundaries (e.g., third-party APIs or infrastructure at the edge).
- **Golden Sets**: If working with rule catalogs or deterministic data pipelines (like extractors, parsers), ensure you use or verify **golden-set fixtures**.

**⚠️ Golden Rules for Testing:**
- **Single Level of Abstraction**: Test one behavior at a time. If the function is a "God Function", warn the user or propose splitting it.
- **Mocking Boundaries**: Never mock the system under test. Only mock the concrete implementations of Repositories or External Services passed into Use Cases. 
- **Deterministic Assertions**: Use explicit assertions on state changes or exact return types, matching the strict deterministic data pipelines of the project.
