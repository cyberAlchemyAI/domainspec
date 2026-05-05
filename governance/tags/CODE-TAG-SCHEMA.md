# Code Tag Schema

This document defines the canonical source annotation contract for DomainSpec code tags.

## Purpose

Code tags connect implementation symbols to DomainSpec concepts and relationship edges in a machine-readable way.

## Canonical Shape

```yaml
domainspec:
  concept:
    id: payment.MaxAmountRule
    type: Rule
    concern: biz
  edges:
    - edge: enforces
      to: payment.ProcessPayment
      evidence: "Rule evaluated before operation execution"
```

## Field Contract

### Required

- `domainspec.concept.id`
- `domainspec.concept.type`

### Optional

- `domainspec.concept.concern` (`biz` or `sys`)
- `domainspec.edges` (array)
- `domainspec.edges[].edge`
- `domainspec.edges[].to`
- `domainspec.edges[].evidence`

## Semantics

- Edge direction is canonical and outbound from the tagged concept.
- Inverse aliases are not allowed.
- `concept.type` must match taxonomy labels from `TAXONOMY.md`.
- `edges[].edge` must be canonical labels from `RELATIONSHIPS.md`.

## Positive Example

```yaml
domainspec:
  concept:
    id: ui.payment.useCreatePayment
    type: Binding
    concern: sys
  edges:
    - edge: mutates
      to: payment.ProcessPayment
```

Expected: valid.

## Negative Example (Missing Required)

```yaml
domainspec:
  concept:
    type: Rule
  edges:
    - edge: enforces
      to: payment.ProcessPayment
```

Expected: invalid (`domainspec.concept.id` missing).

## Negative Example (Invalid Concern)

```yaml
domainspec:
  concept:
    id: payment.MaxAmountRule
    type: Rule
    concern: business
```

Expected: invalid (`concern` must be `biz` or `sys`).

## Negative Example (Invalid Edge Direction Intent)

```yaml
domainspec:
  concept:
    id: payment.ProcessPayment
    type: Operation
  edges:
    - edge: enforces
      to: payment.MaxAmountRule
```

Expected: invalid (`enforces` must be `Rule -> Operation`).
