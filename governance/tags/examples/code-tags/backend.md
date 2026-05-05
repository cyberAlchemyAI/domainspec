# Backend Edge Examples (15)

Each section demonstrates one canonical backend edge.

## performs

```yaml
domainspec:
  concept:
    id: auth.User
    type: Entity
    concern: biz
  edges:
    - edge: performs
      to: payment.ProcessPayment
```

## produces

```yaml
domainspec:
  concept:
    id: payment.ProcessPayment
    type: Operation
    concern: biz
  edges:
    - edge: produces
      to: payment.PaymentInitiated
```

## produces-for

```yaml
domainspec:
  concept:
    id: settlement.GenerateSettlement
    type: Operation
    concern: biz
  edges:
    - edge: produces-for
      to: player.Player
```

## triggers-cross

```yaml
domainspec:
  concept:
    id: onboarding.OnboardingCompleted
    type: Event
    concern: biz
  edges:
    - edge: triggers-cross
      to: player.CreatePlayer
```

## enforces-cross

```yaml
domainspec:
  concept:
    id: compliance.KYCVerificationRule
    type: Rule
    concern: biz
  edges:
    - edge: enforces-cross
      to: account.OpenAccount
```

## enforces

```yaml
domainspec:
  concept:
    id: payment.MaxAmountRule
    type: Rule
    concern: biz
    spec_ref:
      path: docs/features/payments/SPEC.md
      line: 7
      section: Concept Registry
  edges:
    - edge: enforces
      to: payment.ProcessPayment
```

## calculates

```yaml
domainspec:
  concept:
    id: payment.FeeCalculation
    type: Calculation
    concern: biz
  edges:
    - edge: calculates
      to: payment.ProcessPayment
```

## transitions

```yaml
domainspec:
  concept:
    id: payment.PaymentCompleted
    type: Event
    concern: biz
  edges:
    - edge: transitions
      to: payment.PaymentStatus
```

## exposes

```yaml
domainspec:
  concept:
    id: payment.PaymentAPI
    type: Interface
    concern: sys
  edges:
    - edge: exposes
      to: payment.ProcessPayment
```

## orchestrates

```yaml
domainspec:
  concept:
    id: order.OrderFulfillment
    type: Workflow
    concern: biz
  edges:
    - edge: orchestrates
      to: order.ChargePayment
```

## applies

```yaml
domainspec:
  concept:
    id: payment.RetryPolicy
    type: Policy
    concern: biz
  edges:
    - edge: applies
      to: payment.RetryPayment
```

## maps

```yaml
domainspec:
  concept:
    id: payment.RequestToTransaction
    type: Mapping
    concern: sys
  edges:
    - edge: maps
      to: payment.PaymentTransaction
```

## contains

```yaml
domainspec:
  concept:
    id: payment.PaymentTransaction
    type: Entity
    concern: biz
  edges:
    - edge: contains
      to: shared.Money
```

## queries

```yaml
domainspec:
  concept:
    id: payment.GetPaymentStatus
    type: Query
    concern: biz
  edges:
    - edge: queries
      to: payment.PaymentTransaction
```

## emits

```yaml
domainspec:
  concept:
    id: payment.PaymentTransaction
    type: Entity
    concern: biz
  edges:
    - edge: emits
      to: payment.PaymentCompleted
```
