# Domain: DomainSpec-GSD Integration

## Enums

### DelegationMode

| Value | Description |
|-------|-------------|
| native | DomainSpec performs planning/execution without GSD delegation |
| gsd-phase | DomainSpec delegates orchestration to GSD phase workflows |

## Value Objects

### BridgeContext

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| featureId | string | yes | DomainSpec feature identifier |
| mode | DelegationMode | yes | Selected orchestration mode |
| sourceDocs | string[] | yes | DomainSpec files used as semantic authority |
| gsdPhaseRef | string | no | Linked GSD phase identifier when delegated |

### DelegatedEvidenceSet

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| planFiles | string[] | no | GSD PLAN artifacts |
| summaryFiles | string[] | no | GSD SUMMARY artifacts |
| verificationFiles | string[] | no | GSD VERIFICATION artifacts |
| testEvidence | string[] | no | Test/build evidence paths |

## Invariants

| ID | Invariant | Formal |
|----|-----------|--------|
| I1 | DomainSpec semantics are authoritative | `mode = gsd-phase -> semanticAuthority = DomainSpecDocs` |
| I2 | Delegated mode must preserve traceability | `mode = gsd-phase -> eachTask mapsTo >= 1 conceptId` |
| I3 | Verification requires normalized evidence | `delegatedEvidence exists -> verdict input includes normalizedEvidence` |
