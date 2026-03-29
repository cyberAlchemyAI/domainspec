# Mappings: User Account Management

## RegisterRequestToUser

**From:** REST API Request (POST /users)
**To:** User Entity (initial creation)
**Direction:** Inbound

### Field Mapping

| Source Field | Target Field | Transform | Notes |
|-------------|-------------|-----------|-------|
| email | email.value | normalize (lowercase, trim) | Validated by R1, R2 |
| password | hashedPassword.hash | bcrypt(cost=12) | Raw password never stored |
| tier | tier | direct | Defaults to `STANDARD` if omitted |
| — | id | generated | UUID v4 |
| — | role | default | Always `STANDARD` on self-registration |
| — | status | default | Always `Unverified` |
| — | verificationToken | generated | Cryptographically random string |
| — | verificationTokenExpiresAt | calculated | `now + 24h` (via C1) |
| — | createdAt | generated | Current timestamp |
| — | updatedAt | generated | Current timestamp |

### Validation

| Field | Validation | On Failure |
|-------|-----------|------------|
| email | RFC5321 format | 400 VALIDATION_ERROR |
| password | Length ≥ 8, contains digit | 400 WEAK_PASSWORD |
| tier | Must be valid AccountTier enum if provided | 400 VALIDATION_ERROR |

---

## UserToPublicView

**From:** User Entity
**To:** REST API Response (GET /users/{id})
**Direction:** Outbound

### Field Mapping

| Source Field | Target Field | Transform | Notes |
|-------------|-------------|-----------|-------|
| id | id | direct | |
| email.value | email | direct | Already normalized |
| role | role | lowercase | `STANDARD` → `"standard"` |
| tier | tier | lowercase | `PREMIUM` → `"premium"` |
| status | status | lowercase | `Active` → `"active"` |
| createdAt | created_at | ISO 8601 | `2026-03-29T14:30:00Z` |

### Fields Never Exposed

| Field | Reason |
|-------|--------|
| hashedPassword | Credential — never serialized in any response |
| verificationToken | Security token — not for client consumption |
| verificationTokenExpiresAt | Internal deadline — not exposure-relevant |
| updatedAt | Internal audit field — omitted from public view |

---

## SessionToTokenResponse

**From:** Session Entity
**To:** REST API Response (POST /sessions)
**Direction:** Outbound

### Field Mapping

| Source Field | Target Field | Transform | Notes |
|-------------|-------------|-----------|-------|
| id | session_id | direct | |
| token | token | direct | Opaque bearer token handed to client |
| expiresAt | expires_at | ISO 8601 | `2026-04-05T14:30:00Z` |

### Fields Never Exposed

| Field | Reason |
|-------|--------|
| userId | Implicit from auth context — not returned to reduce leakage |
| status | Internal lifecycle field |
| createdAt | Internal audit field |
