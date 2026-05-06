# Poker Team Auth Access Control (Demo Mirror)

## Concepts

| Concept                                                     | ID                                         | Type         | Description                                                    |
| ----------------------------------------------------------- | ------------------------------------------ | ------------ | -------------------------------------------------------------- |
| [Principal](domain.md#principal)                            | auth-access-control.Principal              | Entity       | Identity record with role and direct permission grants.        |
| [Session](domain.md#session)                                | auth-access-control.Session                | Entity       | Active authenticated context keyed by authoritative sid claim. |
| [AccessToken](domain.md#accesstoken)                        | auth-access-control.AccessToken            | Entity       | Bearer token with issuance, expiry, and revocation lifecycle.  |
| [PermissionGrant](domain.md#permissiongrant)                | auth-access-control.PermissionGrant        | Entity       | Canonical permission assignment with allow or deny effect.     |
| [RoleDefinition](domain.md#roledefinition)                  | auth-access-control.RoleDefinition         | Value Object | Predefined role bundles and canonical permission keys.         |
| [Login](operations.md#login)                                | auth-access-control.Login                  | Operation    | Starts authenticated session and triggers token issuance flow. |
| [IssueAccessToken](operations.md#issueaccesstoken)          | auth-access-control.IssueAccessToken       | Operation    | Mints access token from active session context.                |
| [AuthenticateRequest](operations.md#authenticaterequest)    | auth-access-control.AuthenticateRequest    | Operation    | Validates bearer token and resolves auth context.              |
| [AuthorizeRequest](operations.md#authorizerequest)          | auth-access-control.AuthorizeRequest       | Operation    | Enforces route permission with deny-by-default policy.         |
| [Logout](operations.md#logout)                              | auth-access-control.Logout                 | Operation    | Terminates session and revokes token lineage.                  |
| [JWTClaimsToAuthContext](operations.md#authenticaterequest) | auth-access-control.JWTClaimsToAuthContext | Mapping      | Maps validated JWT claims into runtime auth context.           |

## Feature Concept Graph

| From                                    | Edge         | To                                         | Evidence                          | Notes                                                                   |
| --------------------------------------- | ------------ | ------------------------------------------ | --------------------------------- | ----------------------------------------------------------------------- |
| auth-access-control.Login               | orchestrates | auth-access-control.IssueAccessToken       | operations.md#login               | Login flow delegates token issuance after credential validation.        |
| auth-access-control.Login               | mutates      | auth-access-control.Session                | operations.md#login               | Login creates or updates an active session state.                       |
| auth-access-control.IssueAccessToken    | produces     | auth-access-control.AccessToken            | operations.md#issueaccesstoken    | Token issuance operation emits access token entity.                     |
| auth-access-control.AuthenticateRequest | queries      | auth-access-control.AccessToken            | operations.md#authenticaterequest | Authenticate reads token status and expiry to accept or reject request. |
| auth-access-control.AuthenticateRequest | maps         | auth-access-control.JWTClaimsToAuthContext | operations.md#authenticaterequest | Claims are transformed into normalized auth context.                    |
| auth-access-control.AuthorizeRequest    | queries      | auth-access-control.PermissionGrant        | operations.md#authorizerequest    | Authorization resolves permission grants for requested action.          |
| auth-access-control.Logout              | mutates      | auth-access-control.Session                | operations.md#logout              | Logout terminates active session lifecycle.                             |
| auth-access-control.Logout              | mutates      | auth-access-control.AccessToken            | operations.md#logout              | Logout revokes active token lineage.                                    |
