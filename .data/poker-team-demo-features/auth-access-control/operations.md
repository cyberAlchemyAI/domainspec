---
id: auth-access-control
feature: auth-access-control
title: Auth Access Control Operations
summary: Authentication and authorization mutation behaviors and formal rules.
status: implemented
pillar: platform
domain: auth-access-control-operations
audience:
  - developers
priority: p1
lang: en
owners:
  - platform-core
updatedAt: 2026-04-30
dependencies:
  - SPEC.md
  - domain.md
  - states.md
  - events.md
  - interfaces.md
  - mappings.md
  - queries.md
includes: []
---

# Operations: Authentication and Access Control

> **Capabilities using this aspect:** [Login](capabilities/login.md) · [Authenticate Request](capabilities/authenticate-request.md) · [Authorize Request](capabilities/authorize-request.md) · [Logout](capabilities/logout.md) · [System Bootstrap](capabilities/system-bootstrap.md)

## SeedSystemBootstrap

**Type:** Operation (mutation)
**Actor:** Application lifecycle (auto-triggered on startup)
**Triggers:** Application boot when no admin principal exists

### Input

| Field         | Type   | Required | Description                                           |
| ------------- | ------ | -------- | ----------------------------------------------------- |
| adminUsername | string | no       | Override from `ADMIN_USERNAME` env (default: `admin`) |

### Rules

| ID  | Rule                                    | Formal                                             |
| --- | --------------------------------------- | -------------------------------------------------- |
| R1  | Admin principal must not already exist  | `principal(adminUsername) = null`                  |
| R2  | Generated password must meet complexity | `len(password) >= 24 and entropy >= 128 bits`      |
| R3  | Credential hash must use bcrypt         | `credentialHash = bcrypt(password, costFactor=12)` |
| R4  | All predefined roles must have grants   | `for each role in RoleDefinitions: grants exist`   |

### Calculations

| ID  | Calculation             | Formula                                                                                                                                                  |
| --- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1  | Generate admin password | `password = crypto.randomBytes(32).toString('base64url')`                                                                                                |
| C2  | Create admin principal  | `principal = { identifier: adminUsername, subjectType: 'user', status: 'ACTIVE', roleKeys: ['admin'], credentialHash: bcrypt(password) }`                |
| C3  | Seed role grants        | `for each RoleDefinition: for each permission: create PermissionGrant(granteeType='role', granteeKey=roleKey, permissionKey=permission, effect='ALLOW')` |

### State Transition

`Principal: [new] -> ACTIVE` (admin only, if not exists)

### Postconditions

| ID  | Class                 | Guarantee                                                                                                 | Formal Assertion                                                                                                   | Traceability                                                                                                                     |
| --- | --------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| P1  | Persistence Guarantee | Admin principal exists in database with hashed credentials.                                               | `exists(Principal where identifier = adminUsername and status = ACTIVE and credentialHash != null)`                | [Principal](domain.md#principal), [SeedSystemBootstrap](#seedsystembootstrap)                                                    |
| P2  | Persistence Guarantee | All role -> permission grant mappings exist in `auth_permission_grants`.                                  | `for each role in RoleDefinitions: exists PermissionGrant(granteeType='role', granteeKey=roleKey, effect='ALLOW')` | [RoleDefinition](domain.md#roledefinition), [PermissionGrant](domain.md#permissiongrant)                                         |
| P3  | Audit Guarantee       | Generated admin password is logged to stdout exactly once (never persisted in plaintext).                 | `logOnce(generatedAdminPassword) and not exists(plaintextAdminPassword in persistentStore)`                        | [SeedSystemBootstrap](#seedsystembootstrap), [BootstrapSeed Lifecycle Hook](interfaces.md#internal-bootstrapseed-lifecycle-hook) |
| P4  | Temporal Guarantee    | Subsequent application boots skip principal creation (R1) but still ensure role grants are complete (R4). | `on subsequentBoots: principalCreation = skipped and roleGrantSync = enforced`                                     | [SeedSystemBootstrap](#seedsystembootstrap), [BootstrapSeed Lifecycle Hook](interfaces.md#internal-bootstrapseed-lifecycle-hook) |

### Error States

| Condition                  | Result                                              |
| -------------------------- | --------------------------------------------------- |
| R1 violated (admin exists) | Skip principal creation, proceed to role grant sync |
| Database unreachable       | Application fails to start with explicit error      |
| Hash computation failure   | Application fails to start with explicit error      |

---

## Login

**Type:** Operation (mutation)
**Actor:** End user or service principal
**Triggers:** `POST /auth/login`

### Input

| Field      | Type   | Required | Description                                       |
| ---------- | ------ | -------- | ------------------------------------------------- |
| identifier | string | yes      | Login identifier (email, username, or service id) |
| secret     | string | yes      | Password credential                               |
| context    | object | no       | Optional metadata (ip, userAgent, tenant)         |

`context` is evaluated with deterministic defaults:

| Field                 | Type    | Default   | Description                                 |
| --------------------- | ------- | --------- | ------------------------------------------- |
| ipReputation          | string  | `UNKNOWN` | `TRUSTED`, `UNKNOWN`, `BLOCKED`             |
| failedAttemptsLast15m | integer | `0`       | Recent failed login attempts for identifier |
| hasUserAgent          | boolean | `true`    | Whether user agent metadata was provided    |

### Rules

| ID  | Rule                                 | Formal                                        |
| --- | ------------------------------------ | --------------------------------------------- |
| R1  | Principal must exist and be active   | `principal(identifier).status = ACTIVE`       |
| R2  | Credential verification must succeed | `verifyCredential(identifier, secret) = true` |
| R3  | Login policy checks must pass        | `riskPolicy(context) = ALLOW`                 |

Deterministic policy for `riskPolicy(context)`:

- DENY when `ipReputation = BLOCKED`.
- DENY when `failedAttemptsLast15m >= 5`.
- DENY when `hasUserAgent = false`.
- ALLOW otherwise.

### Calculations

| ID  | Calculation           | Formula                                                                                                                |
| --- | --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| C1  | Session expiration    | `session.expiresAt = now + 8h`                                                                                         |
| C2  | Effective permissions | `session.effectivePermissions = resolvePermissions(principal.roleKeys, principal.directPermissions, permissionGrants)` |

### State Transition

`Session: [new] -> ACTIVE`

### Postconditions

| ID  | Class                 | Guarantee                                   | Formal Assertion                                            | Traceability                                                                                                                                                       |
| --- | --------------------- | ------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| P1  | Persistence Guarantee | Session is created and persisted.           | `exists(Session.id = createdSessionId and status = ACTIVE)` | [Session](domain.md#session), [SessionLifecycle](states.md#sessionlifecycle)                                                                                       |
| P2  | Integration Guarantee | Access token is issued for the new session. | `emit(TokenIssued where sessionId = createdSessionId)`      | [IssueAccessToken](#issueaccesstoken), [TokenIssued](events.md#tokenissued), [produces semantics](../../../domainspec/RELATIONSHIPS.md#produces--operation--event) |

### Error States

| Condition                         | Result                |
| --------------------------------- | --------------------- |
| R1 violated                       | `PRINCIPAL_DISABLED`  |
| R2 violated                       | `INVALID_CREDENTIALS` |
| R3 violated                       | `FORBIDDEN`           |
| Session/token persistence failure | Internal error        |

## IssueAccessToken

**Type:** Operation (mutation)
**Actor:** Authentication service
**Triggers:** Successful [Login](#login)

### Input

| Field      | Type    | Required | Description                    |
| ---------- | ------- | -------- | ------------------------------ |
| sessionId  | string  | yes      | Authenticated session id       |
| ttlSeconds | integer | yes      | Access token validity duration |

### Rules

| ID  | Rule                                        | Formal                           |
| --- | ------------------------------------------- | -------------------------------- |
| R1  | Session must exist and be active            | `session.status = ACTIVE`        |
| R2  | ttlSeconds must be within configured bounds | `minTtl <= ttlSeconds <= maxTtl` |

### Calculations

| ID  | Calculation        | Formula                                       |
| --- | ------------------ | --------------------------------------------- |
| C1  | Token expiration   | `expiresAt = issuedAt + ttlSeconds`           |
| C2  | Minimal JWT claims | `claims = { sid: session.id, jti, iat, exp }` |

### State Transition

`AccessToken: [new] -> ACTIVE`

### Postconditions

| ID  | Class                 | Guarantee                                                      | Formal Assertion                                                                       | Traceability                                                                                                |
| --- | --------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| P1  | Integration Guarantee | Signed access token is generated.                              | `token.signatureValid = true`                                                          | [POST /auth/token](interfaces.md#post-authtoken), [TokenIssued](events.md#tokenissued)                      |
| P2  | Persistence Guarantee | Token metadata is persisted for introspection and revocation.  | `exists(AccessToken.id = tokenId and sessionId = input.sessionId and status = ACTIVE)` | [AccessToken](domain.md#accesstoken), [TokenLifecycle](states.md#tokenlifecycle)                            |
| P3  | Integration Guarantee | Session id is the authoritative identity claim in JWT (`sid`). | `claims.sid = sessionId`                                                               | [JWTClaimsToAuthContext](mappings.md#jwtclaimstoauthcontext), [IntrospectToken](queries.md#introspecttoken) |

### Error States

| Condition                   | Result           |
| --------------------------- | ---------------- |
| R1 violated                 | `AUTH_REQUIRED`  |
| R2 violated                 | Validation error |
| Signing/persistence failure | Internal error   |

## AuthenticateRequest

**Type:** Operation (mutation)
**Actor:** API gateway or service middleware
**Triggers:** Any protected API request

### Input

| Field               | Type   | Required | Description                                              |
| ------------------- | ------ | -------- | -------------------------------------------------------- |
| authorizationHeader | string | yes      | Raw auth header                                          |
| requiredPermission  | string | no       | Optional required permission for immediate authorization |

### Rules

| ID  | Rule                                               | Formal                                     |
| --- | -------------------------------------------------- | ------------------------------------------ |
| R1  | Bearer token must be present                       | `authorizationHeader startsWith 'Bearer '` |
| R2  | Token signature and claims must verify             | `verifySignature(token) = true`            |
| R3  | Token must not be expired                          | `now < token.expiresAt`                    |
| R4  | Token must not be revoked                          | `token.revokedAt = null`                   |
| R5  | Token must include session id claim                | `token.sid != null`                        |
| R6  | Session identified by sid must exist and be active | `session(token.sid).status = ACTIVE`       |

### Calculations

| ID  | Calculation           | Formula                                                             |
| --- | --------------------- | ------------------------------------------------------------------- |
| C1  | Auth context creation | `authContext = mapClaims(token.claims) + resolveSession(token.sid)` |

### State Transition

`AccessToken: ACTIVE -> ACTIVE`

### Postconditions

| ID  | Class                 | Guarantee                                                         | Formal Assertion                                                                  | Traceability                                                                                        |
| --- | --------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| P1  | Integration Guarantee | Request is enriched with normalized auth context.                 | `authContext.principalId != null and authContext.sessionId = token.sid`           | [AuthContext](domain.md#authcontext), [JWTClaimsToAuthContext](mappings.md#jwtclaimstoauthcontext)  |
| P2  | Integration Guarantee | Downstream components can evaluate permissions deterministically. | `AuthorizeRequest(authContext, requiredPermission) yields deterministic decision` | [AuthorizeRequest](#authorizerequest), [RoutePermissionBinding](mappings.md#routepermissionbinding) |

### Error States

| Condition   | Result          |
| ----------- | --------------- |
| R1 violated | `AUTH_REQUIRED` |
| R2 violated | `INVALID_TOKEN` |
| R3 violated | `TOKEN_EXPIRED` |
| R4 violated | `TOKEN_REVOKED` |
| R5 violated | `INVALID_TOKEN` |
| R6 violated | `AUTH_REQUIRED` |

## AuthorizeRequest

**Type:** Operation (mutation)
**Actor:** API gateway or service middleware
**Triggers:** Protected route guard after authentication

### Input

| Field              | Type        | Required | Description                                |
| ------------------ | ----------- | -------- | ------------------------------------------ |
| authContext        | AuthContext | yes      | Authenticated principal context            |
| requiredPermission | string      | yes      | Canonical permission key required by route |

### Rules

| ID  | Rule                                        | Formal                                                          |
| --- | ------------------------------------------- | --------------------------------------------------------------- |
| R1  | Required permission must be canonical       | `requiredPermission matches permissionKeyPattern`               |
| R2  | Decision must be allow by precedence policy | `decision(authContext.permissions, requiredPermission) = ALLOW` |
| R3  | Deny rules override allow rules             | `exists denyMatch => decision = DENY`                           |

### Calculations

| ID  | Calculation            | Formula                                           |
| --- | ---------------------- | ------------------------------------------------- |
| C1  | Permission match score | `score = exact > scopedWildcard > globalWildcard` |

### State Transition

`AccessToken: ACTIVE -> ACTIVE`

### Postconditions

| ID  | Class                 | Guarantee                                                                     | Formal Assertion                               | Traceability                                                                                                                                                                          |
| --- | --------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1  | Integration Guarantee | Request proceeds when decision is `ALLOW`.                                    | `decision = ALLOW -> proceed = true`           | [AuthorizeRequest](#authorizerequest), [AuthorizationGuard Interface](interfaces.md#internal-authorizationguard-interface)                                                            |
| P2  | Integration Guarantee | Rejection returns deterministic `FORBIDDEN` contract when decision is `DENY`. | `decision = DENY -> response.code = FORBIDDEN` | [AccessDenied](events.md#accessdenied), [ErrorToHttpResponse](mappings.md#errortohttpresponse), [produces semantics](../../../domainspec/RELATIONSHIPS.md#produces--operation--event) |

### Error States

| Condition         | Result           |
| ----------------- | ---------------- |
| R1 violated       | Validation error |
| R2 or R3 violated | `FORBIDDEN`      |

## Logout

**Type:** Operation (mutation)
**Actor:** Authenticated principal
**Triggers:** `POST /auth/logout`

### Input

| Field                  | Type    | Required | Description                                |
| ---------------------- | ------- | -------- | ------------------------------------------ |
| sessionId              | string  | yes      | Session id to terminate                    |
| tokenId                | string  | no       | Current token id for targeted revocation   |
| revokeAllSessionTokens | boolean | no       | Revoke all active tokens linked to session |

### Rules

| ID  | Rule                                             | Formal                                                                                                            |
| --- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| R1  | Session must exist and be active                 | `session(sessionId).status = ACTIVE`                                                                              |
| R2  | Caller must own session or hold admin permission | `caller.principalId = session.principalId or hasPermission(caller, 'auth-access-control.admin.logoutAnySession')` |
| R3  | Revocation evidence must be persisted            | `persistRevocation(sessionId, revokedTokens) = success`                                                           |

### Calculations

| ID  | Calculation    | Formula                                                         |
| --- | -------------- | --------------------------------------------------------------- |
| C1  | Revocation set | `revokedTokens = tokenId ? {tokenId} : activeTokens(sessionId)` |

### State Transition

`Session: ACTIVE -> TERMINATED` and `AccessToken: ACTIVE -> REVOKED`

### Postconditions

| ID  | Class           | Guarantee                                                                         | Formal Assertion                                                                            | Traceability                                                                                                        |
| --- | --------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| P1  | State Guarantee | Session is marked terminated.                                                     | `session.status = TERMINATED`                                                               | [SessionLifecycle](states.md#sessionlifecycle), [LogoutCompleted](events.md#logoutcompleted)                        |
| P2  | State Guarantee | Selected active tokens linked to session are revoked.                             | `for each token in revokedTokens: token.status = REVOKED and token.revokedAt != null`       | [TokenLifecycle](states.md#tokenlifecycle), [TokenRevoked](events.md#tokenrevoked)                                  |
| P3  | Audit Guarantee | Revocation evidence is stored in persistent database for introspection and audit. | `exists(revocationEvidence where sessionId = input.sessionId and tokenIds = revokedTokens)` | [LogoutRequestToTermination](mappings.md#logoutrequesttotermination), [IntrospectToken](queries.md#introspecttoken) |

### Error States

| Condition                      | Result          |
| ------------------------------ | --------------- |
| R1 violated                    | `AUTH_REQUIRED` |
| R2 violated                    | `FORBIDDEN`     |
| Revoke/terminate write failure | Internal error  |
