# Tags Folder

This folder centralizes tagging artifacts for the DomainSpec framework.

## Contents

- `CODE-TAG-SCHEMA.md` and `CODE-TAG-SCHEMA.json`: source annotation contract.
- `CODE-TAG-REMEDIATION.md`: failure-code remediation catalog.
- `CODE-TAG-WAIVERS.md` and `code-tag-waivers.yaml`: waiver policy and registry.
- `CODE-TAG-DRIFT-REPORT.md`: generated drift comparison report.
- `examples/code-tags/`: canonical edge examples.
- `tools/`: extraction, validation, and drift CLI tooling.

## Commands

From framework root:

- `pnpm run code-tags:extract`
- `pnpm run code-tags:validate`
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
