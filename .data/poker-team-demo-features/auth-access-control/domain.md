---
id: auth-access-control
feature: auth-access-control
title: Auth Access Control Domain
summary: Structural concepts for principals, tokens, and permission grants.
status: implemented
pillar: platform
domain: auth-access-control-domain
audience:
  - developers
priority: p1
lang: en
owners:
  - platform-core
updatedAt: 2026-04-16
dependencies:
  - SPEC.md
includes: []
---

# Domain: Authentication and Access Control

> **Capabilities using this aspect:** [Login](capabilities/login.md) · [Authenticate Request](capabilities/authenticate-request.md) · [Authorize Request](capabilities/authorize-request.md) · [Logout](capabilities/logout.md) · [Introspect Token](capabilities/introspect-token.md) · [Browse Permission Catalog](capabilities/browse-permission-catalog.md)

## Entities

### Principal

| Field             | Type     | Required | Description                           |
| ----------------- | -------- | -------- | ------------------------------------- |
| id                | string   | yes      | Stable principal identifier           |
| subjectType       | string   | yes      | `user`, `service`, or `automation`    |
| status            | string   | yes      | `ACTIVE` or `DISABLED`                |
| roleKeys          | string[] | yes      | Assigned role identifiers             |
| directPermissions | string[] | no       | Explicit permissions granted directly |

**Operations:** [IssueAccessToken](operations.md#issueaccesstoken), [AuthorizeRequest](operations.md#authorizerequest)

### Session

| Field                | Type     | Required | Description                                    |
| -------------------- | -------- | -------- | ---------------------------------------------- |
| id                   | string   | yes      | Stable session identifier                      |
| principalId          | string   | yes      | Authenticated principal linked to this session |
| status               | string   | yes      | `ACTIVE`, `TERMINATED`, or `EXPIRED`           |
| effectivePermissions | string[] | yes      | Resolved permissions for this session          |
| createdAt            | datetime | yes      | Session creation timestamp                     |
| expiresAt            | datetime | yes      | Session expiration timestamp                   |

**Operations:** [IssueAccessToken](operations.md#issueaccesstoken), [AuthenticateRequest](operations.md#authenticaterequest)

### AccessToken

| Field     | Type     | Required | Description                                                    |
| --------- | -------- | -------- | -------------------------------------------------------------- |
| tokenId   | string   | yes      | Unique token identifier (`jti`)                                |
| sessionId | string   | yes      | Session identifier represented by token (`sid`)                |
| issuedAt  | datetime | yes      | Issuance instant                                               |
| expiresAt | datetime | yes      | Expiration instant                                             |
| revokedAt | datetime | no       | Revocation instant when invalidated                            |
| scope     | string[] | no       | Optional derived scope cache (source of truth remains session) |

**Lifecycle:** [TokenLifecycle](states.md#tokenlifecycle)

### PermissionGrant

| Field         | Type     | Required | Description                       |
| ------------- | -------- | -------- | --------------------------------- |
| grantId       | string   | yes      | Unique grant id                   |
| granteeType   | string   | yes      | `role` or `principal`             |
| granteeKey    | string   | yes      | Role key or principal id          |
| permissionKey | string   | yes      | Permission in canonical namespace |
| effect        | string   | yes      | `ALLOW` or `DENY`                 |
| createdAt     | datetime | yes      | Grant creation instant            |

## Role Definitions

Predefined role → permission mappings for system bootstrap. Each role aggregates a set of permission grants. The admin role grants full access; other roles follow least-privilege.

### RoleDefinition

| Field       | Type     | Required | Description                            |
| ----------- | -------- | -------- | -------------------------------------- |
| roleKey     | string   | yes      | Unique role identifier (kebab-case)    |
| displayName | string   | yes      | Human-readable role label              |
| permissions | string[] | yes      | Canonical permission keys for the role |

**Predefined roles:**

| roleKey   | displayName | Permissions                                                                                                                                                                                                                                                                                                                                |
| --------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `admin`   | Admin       | `player-management.*.*`, `auth-access-control.admin.*`, `player-makeup.*.*`, `financial-settlement.*.*`, `player-onboarding.*.*`, `player-stats.*.*`                                                                                                                                                                                       |
| `manager` | Manager     | `player-management.read.*`, `player-management.write.createPlayer`, `player-management.write.createCoach`, `player-management.write.assignCoach`, `player-management.write.unassignCoach`, `player-makeup.write.manageMakeup`, `player-makeup.read.viewMakeup`, `financial-settlement.*.*`, `player-onboarding.review.evaluateApplication` |
| `coach`   | Coach       | `player-management.read.getCoachPlayers`, `player-management.read.getPlayersOverview`, `player-makeup.read.viewMakeup`, `player-stats.read.*`                                                                                                                                                                                              |
| `player`  | Player      | `player-makeup.read.viewMakeup`, `player-stats.read.*`                                                                                                                                                                                                                                                                                     |

**Invariants:**

- Role keys are unique across the system.
- Permission keys in each role must be canonical (match `I1`).
- Visibility scoping (admin→all, coach→assigned, player→self) is enforced by [ResolvePlayerVisibility](../player-management/queries.md#resolveplayervisibility), not by permission grants alone.

## Value Objects

### PermissionKey

| Field        | Type   | Constraint |
| ------------ | ------ | ---------- |
| microservice | string | kebab-case |
| scope        | string | kebab-case |
| action       | string | camelCase  |

**Equality:** Equal when all three fields are equal.

### AuthContext

| Field       | Type     | Constraint        |
| ----------- | -------- | ----------------- |
| principalId | string   | non-empty         |
| sessionId   | string   | non-empty         |
| permissions | string[] | deduplicated list |
| tokenId     | string   | non-empty         |
| issuedAt    | datetime | valid timestamp   |
| expiresAt   | datetime | valid timestamp   |

**Equality:** Equal when principalId, sessionId, tokenId, and sorted permissions are equal.

## Enums

### AuthErrorCode

| Value              | Description                                              |
| ------------------ | -------------------------------------------------------- |
| AUTH_REQUIRED      | Missing bearer token or equivalent credential            |
| INVALID_TOKEN      | Token cannot be verified or parsed                       |
| TOKEN_EXPIRED      | Token expiration has passed                              |
| TOKEN_REVOKED      | Token was explicitly revoked                             |
| FORBIDDEN          | Authenticated but missing required permission            |
| PRINCIPAL_DISABLED | Principal cannot authenticate because status is disabled |

## Invariants

| ID  | Invariant                               | Formal                                                          |
| --- | --------------------------------------- | --------------------------------------------------------------- |
| I1  | Permission keys are canonical           | `permissionKey matches ^[a-z0-9-]+\.[a-z0-9-]+\.[a-zA-Z0-9*]+$` |
| I2  | Access token expiry is after issue time | `expiresAt > issuedAt`                                          |
| I3  | Revoked token cannot be active          | `revokedAt != null => tokenState != ACTIVE`                     |
| I4  | Effective permissions are unique        | `len(effectivePermissions) = len(unique(effectivePermissions))` |
| I5  | JWT identity claim is session id        | `token.sid != null and token.sub is optional/non-authoritative` |
