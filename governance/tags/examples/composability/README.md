---
tags: [governance, composability, snippets, edges]
node_type: readme
is_session: false
layer: architecture
nature: reference
status: active
version: 0.2.0
last_updated: 2026-05-16
---

# Composability Snippets

## What is this?

Reference TypeScript snippets that show the code-level composition obligation implied by each canonical DomainSpec edge. One file per edge pattern; each file is a template that satisfies the composability validator.

## Business Context

DomainSpec edges are not just metadata — most carry a runtime composition obligation (a Rule that `enforces` an Operation must actually be called from that Operation). The composability validator checks code against these obligations, and these snippets are the canonical "what does compliant code look like" reference for each pattern.

## Why it matters

When adding or updating a tagged symbol, the fastest correct path is to copy the matching snippet and adapt it. This keeps composition uniform across the codebase and prevents the validator from rejecting cosmetically-tagged code that doesn't actually wire the call through.

## 📁 Navigation

- **[rule-enforces-operation.ts](rule-enforces-operation.ts)**: Rule enforced from within an Operation call site.
- **[calculation-calculates-operation.ts](calculation-calculates-operation.ts)**: Calculation invoked by an Operation.
- **[policy-applies-operation.ts](policy-applies-operation.ts)**: Policy applied at an Operation boundary.
- **[enforces-cross-operation.ts](enforces-cross-operation.ts)**: Enforcement that crosses Operation boundaries.
- **[interface-exposes-operation.ts](interface-exposes-operation.ts)**: Interface exposing an Operation.
- **[interface-exposes-query.ts](interface-exposes-query.ts)**: Interface exposing a Query.
- **[workflow-orchestrates-operations.ts](workflow-orchestrates-operations.ts)**: Workflow orchestrating multiple Operations.
- **[binding-mutates-operation.ts](binding-mutates-operation.ts)**: UI/data binding that mutates via an Operation.
- **[binding-fetches-query.ts](binding-fetches-query.ts)**: UI/data binding that fetches via a Query.

Use these as implementation templates when adding or updating tagged symbols.
