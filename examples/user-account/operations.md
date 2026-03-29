# Operations: User Account Management

## CreateUser

**Type:** Operation (mutation)
**Actor:** Anonymous (self-registration)
**Triggers:** User submits registration form

### Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | yes | Desired account email |
| password | string | yes | Plaintext password (hashed before storage) |
| tier | AccountTier | no | Requested tier (default: STANDARD) |

### Rules

| ID | Rule | Formal |
|----|------|--------|
| R1 | Email must be valid format | `email matches RFC5321 pattern` |
| R2 | Email must be unique | `¬∃ u : u.email == normalize(email) ∧ u.status != Deleted` |
| R3 | Password minimum length | `password.length >= 8` |
| R4 | Password must contain at least one digit | `∃ c ∈ password : c ∈ [0-9]` |

### Calculations

| ID | Calculation | Formula | Depends On |
|----|------------|---------|------------|
| C1 | Verification token expiry | `now + 24h` | — |

### State Transition

`User: [new] → Unverified`

### Postconditions

- User exists with `status=Unverified`, `role=STANDARD`, `tier` as provided
- `verificationToken` stored (not returned in response)
- `verificationTokenExpiresAt` set to `C1`
- `user.UserCreated` event emitted
- `user.EmailVerificationSent` event emitted

### Error States

| Condition | Result | Error Code |
|-----------|--------|------------|
| R1 violated | ValidationError, no user created | VALIDATION_ERROR |
| R2 violated | ConflictError, no user created | EMAIL_ALREADY_EXISTS |
| R3 or R4 violated | ValidationError, no user created | WEAK_PASSWORD |

---

## VerifyEmail

**Type:** Operation (mutation)
**Actor:** Anonymous (follows link in verification email)
**Triggers:** User clicks email verification link with token

### Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| token | string | yes | Verification token from email |

### Rules

| ID | Rule | Formal |
|----|------|--------|
| R5 | Token must match a known user | `∃ u : u.verificationToken == token` |
| R6 | Token must not be expired | `u.verificationTokenExpiresAt > now` |
| R7 | User must be in Unverified state | `u.status == Unverified` |

### State Transition

`User: Unverified → Active`

### Postconditions

- `user.status = Active`
- `user.verificationToken = null`
- `user.verificationTokenExpiresAt = null`
- `user.UserVerified` event emitted

### Error States

| Condition | Result | Error Code |
|-----------|--------|------------|
| R5 violated | NotFoundError | INVALID_TOKEN |
| R6 violated | ValidationError | TOKEN_EXPIRED |
| R7 violated | ConflictError | ALREADY_VERIFIED |

---

## UpdatePassword

**Type:** Operation (mutation)
**Actor:** Authenticated User (self only)
**Triggers:** User submits password change form

### Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | UserId | yes | Implicit from auth token |
| currentPassword | string | yes | User's current plaintext password |
| newPassword | string | yes | Desired new plaintext password |

### Rules

| ID | Rule | Formal |
|----|------|--------|
| R8 | User must be Active | `user.status == Active` |
| R9 | Current password must match stored hash | `bcrypt.verify(currentPassword, user.hashedPassword.hash)` |
| R10 | New password must differ from current | `¬bcrypt.verify(newPassword, user.hashedPassword.hash)` |
| R11 | New password minimum length | `newPassword.length >= 8` |
| R12 | New password must contain at least one digit | `∃ c ∈ newPassword : c ∈ [0-9]` |

### State Transition

None — password change does not alter lifecycle state.

### Postconditions

- `user.hashedPassword` updated with new bcrypt hash
- `user.updatedAt` refreshed
- `user.PasswordChanged` event emitted

### Error States

| Condition | Result | Error Code |
|-----------|--------|------------|
| R8 violated | ForbiddenError | ACCOUNT_NOT_ACTIVE |
| R9 violated | UnauthorizedError | INVALID_CREDENTIALS |
| R10 violated | ValidationError | PASSWORD_SAME_AS_CURRENT |
| R11 or R12 violated | ValidationError | WEAK_PASSWORD |

---

## SuspendUser

**Type:** Operation (mutation)
**Actor:** Admin
**Triggers:** Admin action on user management dashboard

### Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | UserId | yes | Target user to suspend |
| reason | string | yes | Administrative reason for suspension |

### Rules

| ID | Rule | Formal |
|----|------|--------|
| R13 | Actor must be Admin | `actor.role == ADMIN` |
| R14 | Target user must be Active | `user.status == Active` |
| R15 | Admin cannot self-suspend | `actor.id != userId` |

### State Transition

`User: Active → Suspended`

### Postconditions

- `user.status = Suspended`
- All active sessions for the user are transitioned to `LoggedOut`
- `user.UserSuspended` event emitted

### Error States

| Condition | Result | Error Code |
|-----------|--------|------------|
| R13 violated | ForbiddenError | INSUFFICIENT_PERMISSIONS |
| R14 violated | ConflictError | INVALID_USER_STATE |
| R15 violated | ValidationError | CANNOT_SELF_SUSPEND |

---

## InitiateLogin

**Type:** Operation (mutation)
**Actor:** Anonymous
**Triggers:** User submits login form

### Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | yes | User's email address |
| password | string | yes | User's plaintext password |

### Rules

| ID | Rule | Formal |
|----|------|--------|
| R16 | Email must exist | `∃ u : u.email == normalize(email)` |
| R17 | Password must match hash | `bcrypt.verify(password, u.hashedPassword.hash)` |
| R18 | User must be Active | `u.status == Active` |

### Calculations

| ID | Calculation | Formula | Depends On |
|----|------------|---------|------------|
| C2 | Session expiry | `now + sessionDuration(user.tier)` | [SessionExpiryCalculation](#sessionexpiricalculation) |

### State Transition

`Session: [new] → Active`

### Postconditions

- New Session created with `status=Active`, `expiresAt=C2`
- Opaque `token` generated (cryptographically random, min 32 bytes)
- `user.SessionStarted` event emitted

### Error States

| Condition | Result | Error Code |
|-----------|--------|------------|
| R16 or R17 violated | UnauthorizedError (intentionally ambiguous) | INVALID_CREDENTIALS |
| R18 violated (Unverified) | ForbiddenError | EMAIL_NOT_VERIFIED |
| R18 violated (Suspended) | ForbiddenError | ACCOUNT_SUSPENDED |

---

## LogoutSession

**Type:** Operation (mutation)
**Actor:** Authenticated User (own sessions) or Admin
**Triggers:** User clicks logout; admin revokes session

### Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sessionId | SessionId | yes | Session to close |

### Rules

| ID | Rule | Formal |
|----|------|--------|
| R19 | Session must be Active | `session.status == Active` |
| R20 | Actor must own session or be Admin | `session.userId == actor.id ∨ actor.role == ADMIN` |

### State Transition

`Session: Active → LoggedOut`

### Postconditions

- `session.status = LoggedOut`
- `user.SessionLoggedOut` event emitted

### Error States

| Condition | Result | Error Code |
|-----------|--------|------------|
| R19 violated | ConflictError | SESSION_NOT_ACTIVE |
| R20 violated | ForbiddenError | INSUFFICIENT_PERMISSIONS |

---

## SessionExpiryCalculation

**Type:** Calculation
**Used by:** [InitiateLogin](#initiatelogin) (C2)

### Duration Table

| AccountTier | Session Duration |
|-------------|----------------|
| STANDARD | 7 days |
| PREMIUM | 30 days |

### Formula

```
expiresAt = now + sessionDuration(user.tier)
```

### Properties

| Property | Formal | Description |
|---------|--------|-------------|
| Always future | `expiresAt > now` | Expiry is always in the future at creation |
| Deterministic | `expiresAt(tier) == expiresAt(tier)` | Same tier always yields same offset |
| Tier-dependent | `PREMIUM.duration > STANDARD.duration` | Premium sessions outlast standard |
