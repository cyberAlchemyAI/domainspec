# Interfaces: User Account Management

## External: Auth API (REST)

### POST /users

**Exposes:** [CreateUser](operations.md#createuser)
**Auth:** None (public endpoint)

**Request:**

| Field | Type | Required | Maps To |
|-------|------|----------|---------|
| email | string | yes | CreateUser.email |
| password | string | yes | CreateUser.password |
| tier | string | no | CreateUser.tier |

**Responses:**

| Status | Condition | Body |
|--------|-----------|------|
| 201 | Account created | `{ id, email, status: "unverified" }` |
| 400 | R1, R3, R4 violated | `{ error: "validation_error", details: [...] }` |
| 409 | R2 violated | `{ error: "conflict", code: "EMAIL_ALREADY_EXISTS" }` |

---

### POST /users/verify-email

**Exposes:** [VerifyEmail](operations.md#verifyemail)
**Auth:** None (token in body is the credential)

**Request:**

| Field | Type | Required | Maps To |
|-------|------|----------|---------|
| token | string | yes | VerifyEmail.token |

**Responses:**

| Status | Condition | Body |
|--------|-----------|------|
| 200 | Email verified | `{ userId, status: "active" }` |
| 400 | R6 violated — token expired | `{ error: "validation_error", code: "TOKEN_EXPIRED" }` |
| 404 | R5 violated — token unknown | `{ error: "not_found", code: "INVALID_TOKEN" }` |
| 409 | R7 violated — already active | `{ error: "conflict", code: "ALREADY_VERIFIED" }` |

---

### POST /users/{id}/password

**Exposes:** [UpdatePassword](operations.md#updatepassword)
**Auth:** Bearer token (authenticated user — own account only)

**Request:**

| Field | Type | Required | Maps To |
|-------|------|----------|---------|
| current_password | string | yes | UpdatePassword.currentPassword |
| new_password | string | yes | UpdatePassword.newPassword |

**Responses:**

| Status | Condition | Body |
|--------|-----------|------|
| 200 | Password updated | `{ userId, updated_at }` |
| 400 | R11, R12 violated | `{ error: "validation_error", code: "WEAK_PASSWORD" }` |
| 400 | R10 violated | `{ error: "validation_error", code: "PASSWORD_SAME_AS_CURRENT" }` |
| 401 | R9 violated | `{ error: "unauthorized", code: "INVALID_CREDENTIALS" }` |
| 403 | R8 violated | `{ error: "forbidden", code: "ACCOUNT_NOT_ACTIVE" }` |

---

### POST /users/{id}/suspend

**Exposes:** [SuspendUser](operations.md#suspenduser)
**Auth:** Bearer token (admin only)

**Request:**

| Field | Type | Required | Maps To |
|-------|------|----------|---------|
| reason | string | yes | SuspendUser.reason |

**Responses:**

| Status | Condition | Body |
|--------|-----------|------|
| 200 | User suspended | `{ userId, status: "suspended" }` |
| 403 | R13 violated | `{ error: "forbidden", code: "INSUFFICIENT_PERMISSIONS" }` |
| 409 | R14 violated | `{ error: "conflict", code: "INVALID_USER_STATE" }` |

---

### POST /sessions

**Exposes:** [InitiateLogin](operations.md#initiatelogin)
**Auth:** None (credentials provided in body)

**Request:**

| Field | Type | Required | Maps To |
|-------|------|----------|---------|
| email | string | yes | InitiateLogin.email |
| password | string | yes | InitiateLogin.password |

**Responses:**

| Status | Condition | Body |
|--------|-----------|------|
| 201 | Login successful | `{ session_id, token, expires_at }` |
| 401 | R16, R17 violated | `{ error: "unauthorized", code: "INVALID_CREDENTIALS" }` |
| 403 | R18 violated (unverified) | `{ error: "forbidden", code: "EMAIL_NOT_VERIFIED" }` |
| 403 | R18 violated (suspended) | `{ error: "forbidden", code: "ACCOUNT_SUSPENDED" }` |

---

### DELETE /sessions/{id}

**Exposes:** [LogoutSession](operations.md#logoutsession)
**Auth:** Bearer token (session owner or admin)

**Responses:**

| Status | Condition | Body |
|--------|-----------|------|
| 200 | Session closed | `{ session_id, status: "logged_out" }` |
| 403 | R20 violated | `{ error: "forbidden", code: "INSUFFICIENT_PERMISSIONS" }` |
| 409 | R19 violated | `{ error: "conflict", code: "SESSION_NOT_ACTIVE" }` |

---

### GET /users/{id}

**Exposes:** [GetUser](queries.md#getuser)
**Auth:** Bearer token (own profile or admin)

**Responses:**

| Status | Condition | Body |
|--------|-----------|------|
| 200 | Found | `{ id, email, role, tier, status, created_at }` |
| 403 | Not owner and not admin | `{ error: "forbidden" }` |
| 404 | User not found | `{ error: "not_found" }` |

---

### GET /users

**Exposes:** [SearchUsers](queries.md#searchusers)
**Auth:** Bearer token (admin only)

**Query Parameters:**

| Field | Type | Default | Maps To |
|-------|------|---------|---------|
| email | string | — | SearchUsers.emailContains |
| role | string | — | SearchUsers.role |
| tier | string | — | SearchUsers.tier |
| status | string | — | SearchUsers.status |
| page | integer | 1 | SearchUsers.page |
| per_page | integer | 20 | SearchUsers.perPage |

**Responses:**

| Status | Condition | Body |
|--------|-----------|------|
| 200 | Success | `{ data: [...], total, page, per_page }` |
| 403 | Not admin | `{ error: "forbidden", code: "INSUFFICIENT_PERMISSIONS" }` |

---

## Internal: UserModule Interface

**Consumers:** Payment Processing, Order Management, and any feature requiring identity resolution

| Method | Maps To | Description |
|--------|---------|-------------|
| `getUser(userId)` | [GetUser](queries.md#getuser) | Resolve user profile by ID |
| `getUserPermissions(userId)` | [GetUserPermissions](queries.md#getuserpermissions) | Return role and allowed actions |
| `assertUserActive(userId)` | — | Throws if user is not in Active state |
