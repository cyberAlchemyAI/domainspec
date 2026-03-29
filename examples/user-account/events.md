# Events: User Account Management

## UserCreated

**Produced by:** [CreateUser](operations.md#createuser)
**Triggers transition:** [new] → Unverified (see [UserLifecycle](states.md#userlifecycle))

### Payload

| Field | Type | Description |
|-------|------|-------------|
| userId | UserId | Newly created account identifier |
| email | string | Normalized email address |
| role | UserRole | Assigned role |
| tier | AccountTier | Assigned tier |
| timestamp | DateTime | When account was created |

### Consumed by

| Consumer | Action |
|----------|--------|
| Notifications | Trigger welcome email to the new user |
| Audit Log | Record account creation event |

---

## EmailVerificationSent

**Produced by:** [CreateUser](operations.md#createuser)
**Triggers transition:** none — supplementary notification after account creation

### Payload

| Field | Type | Description |
|-------|------|-------------|
| userId | UserId | Account that needs verification |
| email | string | Destination email address |
| tokenExpiresAt | DateTime | Deadline for the verification link |
| timestamp | DateTime | When the email was dispatched |

### Consumed by

| Consumer | Action |
|----------|--------|
| Notifications | Compose and deliver verification email with token link |

---

## UserVerified

**Produced by:** [VerifyEmail](operations.md#verifyemail)
**Triggers transition:** [Unverified → Active](states.md#userlifecycle)

### Payload

| Field | Type | Description |
|-------|------|-------------|
| userId | UserId | Account that was verified |
| email | string | Email address confirmed |
| timestamp | DateTime | When verification completed |

### Consumed by

| Consumer | Action |
|----------|--------|
| Notifications | Send account-activated confirmation email |
| Audit Log | Record email verification completion |

---

## PasswordChanged

**Produced by:** [UpdatePassword](operations.md#updatepassword)
**Triggers transition:** none — password change does not affect lifecycle state

### Payload

| Field | Type | Description |
|-------|------|-------------|
| userId | UserId | Account whose password was changed |
| timestamp | DateTime | When the change occurred |

### Consumed by

| Consumer | Action |
|----------|--------|
| Notifications | Send password-change security alert email |
| Audit Log | Record credential change for security audit |

---

## SessionStarted

**Produced by:** [InitiateLogin](operations.md#initiatelogin)
**Triggers transition:** [new] → Active (see [SessionLifecycle](states.md#sessionlifecycle))

### Payload

| Field | Type | Description |
|-------|------|-------------|
| sessionId | SessionId | Newly opened session |
| userId | UserId | User who logged in |
| expiresAt | DateTime | When the session will expire |
| timestamp | DateTime | When login occurred |

### Consumed by

| Consumer | Action |
|----------|--------|
| Audit Log | Record login event with session details |

---

## SessionExpired

**Produced by:** System (expiry timer / background job)
**Triggers transition:** [Active → Expired](states.md#sessionlifecycle)

### Payload

| Field | Type | Description |
|-------|------|-------------|
| sessionId | SessionId | Session that expired |
| userId | UserId | Owner of the expired session |
| expiredAt | DateTime | Exact expiry timestamp |

### Consumed by

| Consumer | Action |
|----------|--------|
| Audit Log | Record session expiry |
