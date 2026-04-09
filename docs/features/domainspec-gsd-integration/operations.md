# Operations: DomainSpec-GSD Integration

## PlanPhaseBridge

**Type:** Operation (orchestration)
**Actor:** DomainSpec planner
**Triggers:** Delegated planning request in `gsd-phase` mode

### Input

| Field        | Type     | Required | Description                       |
| ------------ | -------- | -------- | --------------------------------- |
| featureId    | string   | yes      | Target feature                    |
| sourceDocs   | string[] | yes      | DomainSpec semantic artifacts     |
| planningMode | string   | no       | Native or delegated planning hint |

### Rules

| ID  | Rule                                          | Formal                           |
| --- | --------------------------------------------- | -------------------------------- |
| R1  | Feature docs must exist                       | `len(sourceDocs) > 0`            |
| R2  | Delegated planning must map tasks to concepts | `forall task, exists conceptRef` |

### Postconditions

- Delegated phase planning output exists.
- DomainSpec plan summary includes concept traceability mapping.

## ExecutePhaseBridge

**Type:** Operation (orchestration)
**Actor:** DomainSpec implementer
**Triggers:** Delegated implementation request in `gsd-phase` mode

### Rules

| ID  | Rule                                                     | Formal                                      |
| --- | -------------------------------------------------------- | ------------------------------------------- |
| R1  | Delegated tasks must preserve DomainSpec constraints     | `taskSemantics subsetOf domainConstraints`  |
| R2  | Automated verification command is required per code task | `forall codeTask, verify.automated != null` |

### Postconditions

- Implementation evidence is produced in GSD execution artifacts.
- Evidence is mappable to DomainSpec clauses.

## VerifyPhaseBridge

**Type:** Operation (verification)
**Actor:** DomainSpec verifier
**Triggers:** Delegated verification in `gsd-phase` mode

### Rules

| ID  | Rule                                                | Formal                                   |
| --- | --------------------------------------------------- | ---------------------------------------- |
| R1  | PASS/FLAG/BLOCK uses DomainSpec acceptance criteria | `verdictCriteria = domainSpecAcceptance` |
| R2  | GSD evidence must be normalized before verdict      | `rawEvidence -> normalizedEvidence`      |

### Postconditions

- Delegated evidence is normalized into DomainSpec verification input.
- Final verdict remains DomainSpec-owned.
