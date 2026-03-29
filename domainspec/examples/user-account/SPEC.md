# User Account Management

## Overview

User Account Management controls the full lifecycle of a user identity in the system — from self-registration through email verification, credential management, and eventual deactivation. It enforces the rules that gate access: only verified, active accounts can initiate sessions; suspended accounts cannot log in.

The feature owns two state machines: one for the user account lifecycle and one for individual sessions. It exposes an authentication-facing REST API and an internal module contract consumed by all features that need to resolve identity or check permissions.

## Concepts

| Concept | ID | Type | Description |
|---------|----|------|-------------|
| [User](domain.md#user) | user.User | Entity | A registered identity with credentials, role, and lifecycle |
| [Session](domain.md#session) | user.Session | Entity | An active login session tied to a user |
| [Email](domain.md#email) | user.Email | Value Object | Validated email address |
| [HashedPassword](domain.md#hashedpassword) | user.HashedPassword | Value Object | Bcrypt-hashed credential — write-only |
| [UserRole](domain.md#userrole) | user.UserRole | Enum | Access level: STANDARD or ADMIN |
| [AccountTier](domain.md#accounttier) | user.AccountTier | Enum | Feature tier: STANDARD or PREMIUM |
| [UserLifecycle](states.md#userlifecycle) | user.UserLifecycle | State Machine | Account states: Unverified → Active → Suspended → Deleted |
| [SessionLifecycle](states.md#sessionlifecycle) | user.SessionLifecycle | State Machine | Session states: Active → Expired / LoggedOut |
| [CreateUser](operations.md#createuser) | user.CreateUser | Operation | Registers a new user account |
| [VerifyEmail](operations.md#verifyemail) | user.VerifyEmail | Operation | Confirms email from verification token |
| [UpdatePassword](operations.md#updatepassword) | user.UpdatePassword | Operation | Changes a user's password |
| [SuspendUser](operations.md#suspenduser) | user.SuspendUser | Operation | Suspends an active account (admin only) |
| [InitiateLogin](operations.md#initiatelogin) | user.InitiateLogin | Operation | Validates credentials and opens a session |
| [LogoutSession](operations.md#logoutsession) | user.LogoutSession | Operation | Explicitly closes an active session |
| [SessionExpiryCalculation](operations.md#sessionexpirycalculation) | user.SessionExpiryCalculation | Calculation | Computes session expiry from tier |
| [UniqueEmailRule](operations.md) | user.UniqueEmailRule | Rule | Email must not already exist in system |
| [PasswordStrengthRule](operations.md) | user.PasswordStrengthRule | Rule | Password must meet minimum requirements |
| [GetUser](queries.md#getuser) | user.GetUser | Query | Retrieve user profile by ID |
| [GetUserPermissions](queries.md#getuserpermissions) | user.GetUserPermissions | Query | Return roles and allowed actions for a user |
| [GetActiveSessions](queries.md#getactivesessions) | user.GetActiveSessions | Query | List active sessions for a user |
| [SearchUsers](queries.md#searchusers) | user.SearchUsers | Query | Admin search across accounts with filters |
| [UserCreated](events.md#usercreated) | user.UserCreated | Event | Fired when a new user account is created |
| [EmailVerificationSent](events.md#emailverificationsent) | user.EmailVerificationSent | Event | Fired when verification email is dispatched |
| [UserVerified](events.md#userverified) | user.UserVerified | Event | Fired when email verification is confirmed |
| [PasswordChanged](events.md#passwordchanged) | user.PasswordChanged | Event | Fired when a user updates their password |
| [SessionStarted](events.md#sessionstarted) | user.SessionStarted | Event | Fired when a login session is opened |
| [SessionExpired](events.md#sessionexpired) | user.SessionExpired | Event | Fired when a session times out automatically |
| [AuthAPI](interfaces.md#authapi-rest) | user.AuthAPI | Interface | External REST API for auth and account operations |
| [UserModule](interfaces.md#usermodule-internal) | user.UserModule | Interface | Internal module contract for identity resolution |
| [RegisterRequestToUser](mappings.md#registerrequesttouser) | user.RegisterRequestToUser | Mapping | API registration request → User entity |
| [UserToPublicView](mappings.md#usertopublicview) | user.UserToPublicView | Mapping | User entity → safe public profile response |
| [SessionToTokenResponse](mappings.md#sessiontotokenresponse) | user.SessionToTokenResponse | Mapping | Session entity → token response DTO |

## Aspects

- [Domain](domain.md) — Entities, value objects, enums
- [Operations](operations.md) — Business operations, rules, calculations
- [States](states.md) — State machines and transitions
- [Interfaces](interfaces.md) — API contracts (external + internal)
- [Events](events.md) — Domain events
- [Queries](queries.md) — Read models
- [Mappings](mappings.md) — Data transformations

## Cross-Feature Dependencies

| Depends On | Relationship | Why |
|-----------|-------------|-----|
| — | — | Foundation feature; no upstream dependencies |

## Produces For

| Consumer | Via | What |
|----------|-----|------|
| Notifications | Event: user.UserCreated | Trigger welcome email |
| Notifications | Event: user.EmailVerificationSent | Send verification token email |
| Notifications | Event: user.PasswordChanged | Send password-change confirmation email |
| Payment Processing | Module: user.UserModule | Resolve user identity and region for payment rules |
| Audit Log | Event: user.SessionStarted | Record login activity |
| Audit Log | Event: user.UserVerified | Record verification completion |
