# Queries: User Account Management

## GetUser

**Type:** Query (read-only)
**Actor:** Authenticated User (own profile) or Admin (any profile)

### Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | UserId | yes | User to retrieve |

### Output

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| id | UserId | User.id | Account identifier |
| email | string | User.email.value | Contact address (normalized) |
| role | UserRole | User.role | Access level |
| tier | AccountTier | User.tier | Feature tier |
| status | UserStatus | User.status | Current lifecycle state |
| createdAt | DateTime | User.createdAt | Registration timestamp |

### Reads From

| Entity | Relationship | Fields Used |
|--------|-------------|-------------|
| User | queries | id, email, role, tier, status, createdAt |

### Authorization

- Authenticated User: can retrieve own profile only (`userId == currentUser.id`)
- Admin: can retrieve any profile

---

## GetUserPermissions

**Type:** Query (read-only)
**Actor:** Authenticated User (own permissions) or internal system services

### Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | UserId | yes | User whose permissions to resolve |

### Output

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| userId | UserId | User.id | Account identifier |
| role | UserRole | User.role | Assigned role |
| tier | AccountTier | User.tier | Feature tier |
| allowedActions | string[] | derived | List of permitted action identifiers |
| status | UserStatus | User.status | Current account state (must be Active to act) |

### Permission Resolution

| Role | Allowed Actions |
|------|----------------|
| STANDARD | `user:read:self`, `user:update:self`, `payment:create`, `payment:read:self` |
| ADMIN | All STANDARD actions plus `user:read:any`, `user:suspend`, `user:delete`, `payment:read:any` |

### Reads From

| Entity | Relationship | Fields Used |
|--------|-------------|-------------|
| User | queries | id, role, tier, status |

### Authorization

- Authenticated User: own permissions only
- Internal services: unrestricted via `UserModule` (no HTTP exposure for arbitrary users)

---

## GetActiveSessions

**Type:** Query (read-only)
**Actor:** Authenticated User (own sessions) or Admin (any user)

### Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | UserId | yes | User whose sessions to list |

### Filters

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| page | integer | 1 | Page number |
| perPage | integer | 20 | Results per page (max: 50) |

### Output

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| data | SessionSummary[] | — | List of active sessions |
| total | integer | — | Total active sessions for user |

**SessionSummary shape:**

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| id | SessionId | Session.id | Session identifier |
| createdAt | DateTime | Session.createdAt | When session was opened |
| expiresAt | DateTime | Session.expiresAt | When session will auto-expire |

### Reads From

| Entity | Relationship | Fields Used |
|--------|-------------|-------------|
| Session | queries | id, userId, status, createdAt, expiresAt |

### Authorization

- Authenticated User: own sessions only (`session.userId == currentUser.id`)
- Admin: any user's sessions

---

## SearchUsers

**Type:** Query (read-only)
**Actor:** Admin only

### Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| — | — | — | No required input; all filters are optional |

### Filters

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| emailContains | string | — | Case-insensitive partial email match |
| role | UserRole | — | Filter by role |
| tier | AccountTier | — | Filter by tier |
| status | UserStatus | — | Filter by lifecycle state |
| createdAfter | DateTime | — | Registered after this date |
| createdBefore | DateTime | — | Registered before this date |
| page | integer | 1 | Page number |
| perPage | integer | 20 | Results per page (max: 100) |

### Output

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| data | UserSummary[] | — | Matched users |
| total | integer | — | Total matching accounts |
| page | integer | — | Current page |
| perPage | integer | — | Results per page |

**UserSummary shape:** same as `GetUser` output.

### Reads From

| Entity | Relationship | Fields Used |
|--------|-------------|-------------|
| User | queries | id, email, role, tier, status, createdAt |

### Authorization

- Admin only. Non-admin callers receive `403 INSUFFICIENT_PERMISSIONS`.
