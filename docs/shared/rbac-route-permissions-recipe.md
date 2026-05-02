# RBAC Route Permissions Recipe

## Purpose

Reusable recipe for defining route-level RBAC contracts in DomainSpec features.

Use this recipe when a feature needs JWT authentication plus granular authorization per route action.

## Source Pattern

External reference model used by this repository:

- `/home/vrondelli/projects/user-management/user_management_documentation.md`

Permission structure from that model:

`microservice.scope.action`

Examples:

- `player-management.write.createPlayer`
- `player-management.read.getAllPlayers`
- `player-management.read.getPlayersOverview`

Wildcards can be supported by implementation, for example:

- `*.*.*`
- `player-management.*.*`
- `player-management.read.*`

## How To Apply In A Feature Spec

1. In `interfaces.md`, define auth per external route:

- JWT required
- permission string required for that route

2. In `operations.md`, include authorization as explicit operation rule when write actions are involved.

3. In `queries.md`, include authorization actor constraints for read actions.

4. In `TASKS.md`, include implementation tasks for:

- permission middleware wiring
- route-to-permission mapping
- negative tests for missing/invalid permissions

## Naming Convention

- `microservice`: feature service name in kebab-case
- `scope`: `read`, `write`, `admin`, or another bounded scope
- `action`: route/action specific verb in camelCase

Recommended for player-management:

- `player-management.write.createPlayer`
- `player-management.read.getAllPlayers`
- `player-management.read.getPlayersOverview`
- `player-management.read.getPlayerProgression`

## Test Obligations

Each protected route should have tests for:

1. 401 when JWT is missing/invalid.
2. 403 when JWT exists but permission is missing.
3. 2xx when JWT and permission are valid.

## Implementation Playbook (Project-Agnostic)

Use these steps to implement this recipe in any service regardless of framework.

### 1. Define Permission Registry

- Publish constants for permissions in one module.
- Keep keys in canonical format `microservice.scope.action`.
- Include optional wildcard policies only if explicitly needed.

Example registry:

```txt
player-management.write.createPlayer
player-management.read.getAllPlayers
player-management.read.getPlayersOverview
player-management.read.getPlayerProgression
```

### 2. Build Authentication Middleware

- Extract bearer token from request headers.
- Verify signature and token claims (`sub`, `jti`, `iat`, `exp`).
- Reject with deterministic errors:
  - 401 `AUTH_REQUIRED` for missing token
  - 401 `INVALID_TOKEN` for parse/signature failures
  - 401 `TOKEN_EXPIRED` when `now >= exp`
  - 401 `TOKEN_REVOKED` when token is revoked
- Attach normalized auth context to request:
  - `principalId`
  - `permissions[]`
  - `tokenId`

### 3. Build Authorization Middleware

- Resolve required permission from route metadata.
- Compare required permission against effective permissions in auth context.
- Apply precedence policy:
  - deny override > exact allow > scoped wildcard > global wildcard > deny by default
- Reject missing permission with 403 `FORBIDDEN` and `details.required`.

### 4. Route Binding Standard

- Every protected endpoint declares its required permission near route definition.
- Public routes must declare `auth: public` explicitly.
- Keep a route-permission matrix in docs for audits.

### 5. Error Contract Standard

- Every auth-related failure returns:

```json
{
  "code": "FORBIDDEN",
  "message": "Missing required permission",
  "details": {
    "required": "player-management.read.getAllPlayers"
  }
}
```

### 6. Verification Checklist

- Authentication tests:
  - missing token -> 401 AUTH_REQUIRED
  - invalid token -> 401 INVALID_TOKEN
  - expired token -> 401 TOKEN_EXPIRED
- Authorization tests:
  - missing permission -> 403 FORBIDDEN
  - valid permission -> route handler executes
- Contract tests:
  - error payload shape always `{ code, message, details }`
  - route-permission matrix has no unprotected protected route

### 7. Adoption Pattern Across Features

- Keep auth as shared platform slice.
- In each feature `interfaces.md`, reference required route permissions.
- In feature `operations.md` and `queries.md`, include auth and permission constraints for exposed actions.
- Generate feature-specific TEST-SPEC obligations from those contracts.

## Notes

- Prefer explicit route permissions over broad wildcard grants.
- Keep permission naming stable once published to clients and admin tooling.
