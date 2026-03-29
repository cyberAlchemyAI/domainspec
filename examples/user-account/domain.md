# Domain: User Account Management

## Entities

### User

A registered identity in the system. A user is created in an unverified state and must confirm their email before they can log in. Users carry a role that determines access scope and a tier that determines feature access and session duration.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UserId | yes | Unique identifier (UUID) |
| email | Email | yes | Primary contact and login identifier |
| hashedPassword | HashedPassword | yes | Bcrypt-hashed credential |
| role | UserRole | yes | Access level (default: STANDARD) |
| tier | AccountTier | yes | Feature tier (default: STANDARD) |
| status | UserStatus | yes | Current lifecycle state |
| verificationToken | string | no | Email verification token (null after verified) |
| verificationTokenExpiresAt | DateTime | no | Token validity deadline |
| createdAt | DateTime | yes | When account was created |
| updatedAt | DateTime | yes | Last state change timestamp |

**Lifecycle:** See [UserLifecycle](states.md#userlifecycle)
**Operations:** [CreateUser](operations.md#createuser), [VerifyEmail](operations.md#verifyemail), [UpdatePassword](operations.md#updatepassword), [SuspendUser](operations.md#suspenduser)

---

### Session

A single authenticated session for a user. Created on successful login, closed by logout or automatic expiry. Sessions are not reusable — a new session is always created on each login.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | SessionId | yes | Unique identifier (UUID) |
| userId | UserId | yes | The user this session belongs to |
| token | string | yes | Opaque bearer token (cryptographically random) |
| status | SessionStatus | yes | Current session state |
| createdAt | DateTime | yes | When session was created |
| expiresAt | DateTime | yes | When session will auto-expire |

**Lifecycle:** See [SessionLifecycle](states.md#sessionlifecycle)
**Operations:** [InitiateLogin](operations.md#initiatelogin), [LogoutSession](operations.md#logoutsession)

---

## Value Objects

### Email

A validated email address. Used as the unique login identifier for users.

| Field | Type | Constraint |
|-------|------|-----------|
| value | string | RFC 5321 format; max 254 characters; lowercase-normalized |

**Equality:** Two Email instances are equal if their normalized `value` strings match.

---

### HashedPassword

A write-only credential. The raw password is never stored — only the bcrypt hash. Reading the value is intentionally not supported; the only allowed operation is verification.

| Field | Type | Constraint |
|-------|------|-----------|
| hash | string | bcrypt hash, cost factor ≥ 12 |

**Equality:** Not applicable — two hashes for the same password produce different values. Comparison uses `bcrypt.verify(raw, hash)`.

---

## Enums

### UserRole

| Value | Description |
|-------|-------------|
| STANDARD | Regular user — can manage own account and perform standard operations |
| ADMIN | Administrator — can manage all users, suspend accounts, and view all data |

### AccountTier

| Value | Description |
|-------|-------------|
| STANDARD | Default tier — sessions expire after 7 days |
| PREMIUM | Paid tier — sessions expire after 30 days; extended feature access |

### UserStatus

| Value | Description |
|-------|-------------|
| Unverified | Account created but email not yet confirmed |
| Active | Email verified; fully operational account |
| Suspended | Account frozen by admin; cannot log in |
| Deleted | Soft-deleted; data retained for audit purposes |

### SessionStatus

| Value | Description |
|-------|-------------|
| Active | Session is valid and usable for authenticated requests |
| Expired | Session auto-closed after `expiresAt` passed |
| LoggedOut | Session explicitly closed by user or admin |
