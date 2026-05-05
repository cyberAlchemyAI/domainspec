# Code Tag Waiver Policy

Waivers are temporary exceptions for code-tag validation findings.

## Waiver Principles

- Waivers are exceptional, temporary, and auditable.
- Every waiver must have an explicit owner and explicit expiration.
- Expired waivers are treated as active violations.
- Waivers do not change canonical schema or relationship semantics.

## Required Fields

Each waiver entry must include:

- `id`
- `code`
- `owner`
- `reason`
- `expiresAt`

Optional fields:

- `file`
- `conceptId`
- `approvedBy`

## Matching Behavior

A waiver applies only when all provided selectors match:

- `code` must match the validation issue code.
- If `file` is present, issue file must match.
- If `conceptId` is present, issue concept ID must match.

## Lifecycle

1. Create waiver with explicit reason and expiry.
2. Commit waiver in `governance/tags/code-tag-waivers.yaml`.
3. Validator enforces expiry automatically.
4. Remove waiver once issue is fixed.

## Example

```yaml
waivers:
  - id: CW-001
    code: CT-005
    file: backend/src/payment/process-payment.ts
    conceptId: payment.ProcessPayment
    owner: platform-team
    reason: "Target concept pending in feature docs update"
    expiresAt: "2026-06-01T00:00:00Z"
    approvedBy: governance-owner
```
