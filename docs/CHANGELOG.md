# Changelog

All notable changes to this project DomainSpec documentation are documented in this file.

Scope:
- Track project-level domain documentation under docs/.
- Do not track framework evolution here. Use ../domainspec/CHANGELOG.md for framework changes.

Versioning guidance:
- Major: breaking conceptual contract changes (renamed/removed concept IDs, state semantics changes).
- Minor: additive concepts, new aspect files, new events/queries/interfaces, expanded coverage.
- Patch: clarifications, typo fixes, link fixes, and non-semantic documentation updates.

## [1.0.0] - 2026-03-29

### Added
- Payment Processing feature baseline in features/payment-processing/SPEC.md with detailed concept catalog across domain, behavior, events, interfaces, and mappings.
- Aspect documentation for the feature:
  - Domain model: features/payment-processing/domain.md.
  - Operations and rules: features/payment-processing/operations.md.
  - Lifecycle and transitions: features/payment-processing/states.md.
  - External and internal contracts: features/payment-processing/interfaces.md.
  - Domain events: features/payment-processing/events.md.
  - Read-model and retrieval contracts: features/payment-processing/queries.md.
  - Boundary data transformations: features/payment-processing/mappings.md.

### Detailed Concept Coverage
- Entities and value objects:
  - payment.PaymentTransaction, shared.Money.
- Types and lifecycle modeling:
  - payment.PaymentMethod, payment.PaymentStatus.
- Operations:
  - payment.ProcessPayment, payment.RefundPayment, payment.RetryPayment.
- Rules, policy, and calculation:
  - payment.MaxAmountRule, payment.MethodAvailabilityRule, payment.RetryPolicy, payment.FeeCalculation.
- Events:
  - payment.PaymentInitiated, payment.PaymentCompleted, payment.PaymentFailed, payment.RefundCompleted.
- Queries:
  - payment.GetPaymentStatus, payment.GetPaymentHistory.
- Interfaces:
  - payment.PaymentAPI, payment.PaymentModule.
- Mappings:
  - payment.RequestToTransaction, payment.TransactionToResponse.

### Index And Language Alignment
- Global concept indexing established in registry.md, including typed sections for entities, value objects, operations, rules, policies, events, interfaces, mappings, and state machines.
- Ubiquitous language aligned in glossary.md for key payment terms:
  - Payment Transaction, Money, Payment Method, Payment Status, Processing Fee, Gateway Reference, Retry Policy, Terminal State.
