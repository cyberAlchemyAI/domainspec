# Mappings: DomainSpec-GSD Integration

## FeatureToPhaseMapping

**From:** DomainSpec feature metadata
**To:** GSD phase identifiers and plan paths
**Direction:** Outbound

### Field Mapping

| Source Field | Target Field   | Transform       | Notes                                      |
| ------------ | -------------- | --------------- | ------------------------------------------ |
| featureId    | phaseSlug      | kebab-normalize | Stable phase slug                          |
| sourceDocs[] | contextRefs[]  | path-normalize  | Used as canonical refs in planning context |
| conceptIds[] | requirements[] | direct map      | Used for task traceability                 |

## DelegatedEvidenceToVerificationInput

**From:** GSD execution and verification artifacts
**To:** DomainSpec verifier input model
**Direction:** Inbound

### Field Mapping

| Source Artifact | Target Field      | Transform              | Notes                                   |
| --------------- | ----------------- | ---------------------- | --------------------------------------- |
| \*-PLAN.md      | plannedTasks      | extract tasks          | Includes wave/dependency metadata       |
| \*-SUMMARY.md   | executionEvidence | extract completed work | Includes files and outcomes             |
| VERIFICATION.md | delegatedChecks   | normalize checks       | Mapped to DomainSpec acceptance clauses |
| test output     | automatedEvidence | direct                 | Command outcomes and failures           |

### Validation

| Field             | Validation                             | On Failure |
| ----------------- | -------------------------------------- | ---------- |
| plannedTasks      | each task has concept mapping          | FLAG       |
| executionEvidence | references existing outputs            | FLAG       |
| delegatedChecks   | maps to DomainSpec acceptance criteria | BLOCK      |
