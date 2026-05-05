# Tags Folder

This folder centralizes tagging artifacts for the DomainSpec framework.

## Contents

- `CODE-TAG-SCHEMA.md` and `CODE-TAG-SCHEMA.json`: source annotation contract.
- `CODE-TAG-COMPOSABILITY-PATTERNS.md`: edge-to-code composition obligations and reference snippets.
- `CODE-TAG-REMEDIATION.md`: failure-code remediation catalog.
- `CODE-TAG-WAIVERS.md` and `code-tag-waivers.yaml`: waiver policy and registry.
- `CODE-TAG-DRIFT-REPORT.md`: generated drift comparison report.
- `examples/code-tags/`: canonical edge examples.
- `examples/composability/`: composability reference snippets by edge pattern.
- `tools/`: extraction, validation, and drift CLI tooling.

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

When provided, validator checks `spec_ref.path` and `spec_ref.line` against the canonical concept catalog source.

## Composability Rules

Edge semantics can be checked against implementation composition obligations:

- `Rule --enforces--> Operation` -> operation must call rule
- `Calculation --calculates--> Operation` -> operation must call calculation
- `Policy --applies--> Operation` -> operation must call policy
- `Interface --exposes--> Operation/Query` -> interface must call target use-case
- `Binding --mutates/fetches--> Operation/Query` -> binding must call target
- `Workflow --orchestrates--> Operation` -> workflow must call declared operations

See `CODE-TAG-COMPOSABILITY-PATTERNS.md` for full matrix and reference snippets.
