---
tags: [governance, code-tags, drift, composability]
node_type: readme
is_session: false
layer: architecture
nature: reference
status: active
version: 0.2.0
last_updated: 2026-05-16
---

# Tags Folder

## What is this?

Centralized home for the DomainSpec source-tagging contract: schema, composability patterns, remediation catalog, waiver registry, drift reports, examples, and CLI tooling that together let code be annotated with — and validated against — DomainSpec concepts and edges.

## Business Context

DomainSpec links specs (concepts, rules, operations, bindings) to implementation via structured code tags. Without a governed surface for the schema, waivers, and drift detection, tags rot silently and lose their value as a trace mechanism. This folder is where the contract lives, where examples are curated, where waivers are explicitly declared, and where drift reports are emitted by the validator.

## Why it matters

Code tags are the bridge between DomainSpec documents and live code. If the bridge isn't governed — schema versioned, edges enforceable, waivers visible, drift caught early — alignment audits become guesswork. Centralizing all tagging artifacts here keeps that bridge inspectable and lets the validator/CI gate merges on consistent rules.

## 📁 Navigation

- **[CODE-TAG-SCHEMA.md](CODE-TAG-SCHEMA.md)** / **[CODE-TAG-SCHEMA.json](CODE-TAG-SCHEMA.json)**: Source annotation contract (markdown + machine-readable schema).
- **[CODE-TAG-COMPOSABILITY-PATTERNS.md](CODE-TAG-COMPOSABILITY-PATTERNS.md)**: Edge-to-code composition obligations and reference snippets.
- **[CODE-TAG-REMEDIATION.md](CODE-TAG-REMEDIATION.md)**: Failure-code remediation catalog.
- **[CODE-TAG-WAIVERS.md](CODE-TAG-WAIVERS.md)** / **[code-tag-waivers.yaml](code-tag-waivers.yaml)**: Waiver policy and registry.
- **[CODE-TAG-DRIFT-REPORT.md](CODE-TAG-DRIFT-REPORT.md)**: Latest aggregate drift comparison report.
- **[CODE-TAG-DRIFT-REPORT-ui-prototyping-studio.md](CODE-TAG-DRIFT-REPORT-ui-prototyping-studio.md)** / **[CODE-TAG-DRIFT-REPORT-ui-prototyping-studio-feature.md](CODE-TAG-DRIFT-REPORT-ui-prototyping-studio-feature.md)**: Feature-scoped drift reports for the UI Prototyping Studio.
- **[CODE-TAG-DRIFT-REPORT.agent-execution-orchestrator.md](CODE-TAG-DRIFT-REPORT.agent-execution-orchestrator.md)**: Drift report for the agent-execution-orchestrator surface.
- **[CODE-TAG-DRIFT-REPORT.kg.md](CODE-TAG-DRIFT-REPORT.kg.md)**: Drift report for the knowledge-graph surface.
- **[code-tags-ui-prototyping-studio.json](code-tags-ui-prototyping-studio.json)** / **[code-tags-ui-prototyping-studio-feature.json](code-tags-ui-prototyping-studio-feature.json)**: Extracted tag datasets for UI Prototyping Studio.
- **[code-tags.agent-execution-orchestrator.json](code-tags.agent-execution-orchestrator.json)**: Extracted tag dataset for the agent-execution-orchestrator.
- **[code-tags.kg.json](code-tags.kg.json)**: Extracted tag dataset for the knowledge-graph surface.
- **`examples/`**: Canonical edge examples (`code-tags/`) and composability reference snippets (`composability/`).
- **`reports/`**: Generated report artifacts.
- **`tools/`**: Extraction, validation, composability, and drift CLI tooling.

## Commands

From framework root:

- `pnpm run code-tags:extract`
- `pnpm run code-tags:validate`
- `pnpm run code-tags:composability`
- `pnpm run code-tags:drift`
- `pnpm run code-tags:test`
- `pnpm run check:code-tags`

## Optional SPEC Trace Link

Code tags may include an explicit concept source reference:

```yaml
domainspec:
	concept:
		id: payment.MaxAmountRule
		type: Rule
		spec_ref:
			path: docs/features/payments/SPEC.md
			line: 7
			section: Concept Registry
```

When provided, the validator checks `spec_ref.path` and `spec_ref.line` against the canonical concept catalog source.

## Composability Rules

Edge semantics can be checked against implementation composition obligations:

- `Rule --enforces--> Operation` → operation must call rule
- `Calculation --calculates--> Operation` → operation must call calculation
- `Policy --applies--> Operation` → operation must call policy
- `Interface --exposes--> Operation/Query` → interface must call target use-case
- `Binding --mutates/fetches--> Operation/Query` → binding must call target
- `Workflow --orchestrates--> Operation` → workflow must call declared operations

See `CODE-TAG-COMPOSABILITY-PATTERNS.md` for the full matrix and reference snippets.
