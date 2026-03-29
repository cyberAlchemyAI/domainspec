# Project Domain Documentation

> Powered by [domainspec](../domainspec/README.md) — domain-first documentation framework.

## Structure

```
docs/
├── README.md          # This file
├── registry.md        # Global concept index
├── glossary.md        # Ubiquitous language
├── shared/            # Cross-feature value objects and enums
│   └── money.md
└── features/          # Feature vertical slices
    └── payment-processing/
        ├── SPEC.md
        ├── domain.md
        ├── operations.md
        ├── states.md
        ├── interfaces.md
        ├── events.md
        ├── queries.md
        └── mappings.md
```

## Features

| Feature                                                   | Status     | Concepts | Description                      |
| --------------------------------------------------------- | ---------- | -------- | -------------------------------- |
| [Payment Processing](features/payment-processing/SPEC.md) | Documented | 20       | Payment lifecycle, fees, refunds |

## Quick Links

- [Concept Registry](registry.md) — All concepts indexed by type
- [Glossary](glossary.md) — Domain term definitions
- [Changelog](CHANGELOG.md) — Versioned documentation changes for project DomainSpec
- **Framework Reference:** [domainspec/](../domainspec/README.md)
  - [Taxonomy](../domainspec/TAXONOMY.md) — 13 meta-concept types explained
  - [Relationships](../domainspec/RELATIONSHIPS.md) — 12 typed edge types
  - [Test Pipeline](../domainspec/TEST-PIPELINE.md) — Doc → test generation rules
  - [Templates](../domainspec/templates/) — Copy these to start a new feature
