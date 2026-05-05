# GOV-06 - Code Relationship Tags and Graph Ingestion Governance

## Objective

Define an executable, governance-safe tagging model so DomainSpec relationships can be attached to source symbols and deterministically ingested into the concept graph.

## Problem

Domain relationships are documented in markdown but are not consistently represented in code. Without a canonical tagging contract, graph extraction is incomplete, drift checks are weak, and governance gates cannot verify source-level relationship intent.

## Locked Decisions (Gap Fill Answers)

- Plan track: governance
- First enforced scope: all 29 relationship edges (backend, intra-UI, cross-layer)
- Canonical source annotation style: docstring YAML block
- Direction policy: canonical direction only in source annotations (no inverse authoring tags)
- Existing-task status policy: partial resolution only unless all required outcomes are implemented and verified
- Business or system marker policy: YAML-only (`concern: biz|sys`), no dependency on legacy `@biz/@sys`
- Parser wave scope: TypeScript/TSX, JavaScript/JSX, Python
- CI integration route: dedicated validator command plus workflow step (not embedded into `check_docs_sync.sh` initially)
- Enforcement rollout: strict blocking from first release
- Waiver expiry policy: no default duration; every waiver must declare explicit expiration

## Scope

- In scope:
  - Docstring YAML schema for concept and relationship tags.
  - Validation rules for concept identity, edge label legality, and type-direction compatibility.
  - Deterministic extraction pipeline from source annotations to graph triples.
  - CI enforcement hooks for tag validation failures.
  - Resolution assessment against GOV-01, GOV-02, GOV-03.
- Out of scope:
  - Automatic source rewriting or auto-repair for invalid tags.
  - Runtime behavior changes in business logic unrelated to governance validation.
  - Non-docstring annotation modes as canonical source of truth.

## Dependencies

- [GOV-01-axioms-constitution-tags-execution.md](GOV-01-axioms-constitution-tags-execution.md)
- [GOV-02-governance-validation-scripts.md](GOV-02-governance-validation-scripts.md)
- [GOV-03-blocking-gates-policy.md](GOV-03-blocking-gates-policy.md)
- [../../../RELATIONSHIPS.md](../../../RELATIONSHIPS.md)
- [../../../TAXONOMY.md](../../../TAXONOMY.md)

## Canonical Tag Contract

Docstrings must declare one concept and zero or more outgoing edges using canonical direction.

Example shape:

```yaml
domainspec:
  concept:
    id: payment.ProcessPayment
    type: Operation
  edges:
    - edge: produces
      to: payment.PaymentInitiated
```

```yaml
domainspec:
  concept:
    id: payment.MaxAmountRule
    type: Rule
  edges:
    - edge: enforces
      to: payment.ProcessPayment
```

JavaScript example:

```javascript
/**
 * domainspec:
 *   concept:
 *     id: payment.MaxAmountRule
 *     type: Rule
 *   edges:
 *     - edge: enforces
 *       to: payment.ProcessPayment
 */
export function maxAmountRule(context) {
  return context.amount <= context.limit;
}
```

Python example:

```python
def max_amount_rule(context):
    """
    domainspec:
      concept:
        id: payment.MaxAmountRule
        type: Rule
      edges:
        - edge: enforces
          to: payment.ProcessPayment
    """
    return context.amount <= context.limit
```

Additional examples (other types and edges):

```yaml
domainspec:
  concept:
    id: payment.ProcessPayment
    type: Operation
  edges:
    - edge: produces
      to: payment.PaymentInitiated
```

```yaml
domainspec:
  concept:
    id: payment.GetPaymentStatus
    type: Query
  edges:
    - edge: queries
      to: payment.PaymentTransaction
```

```yaml
domainspec:
  concept:
    id: payment.PaymentAPI
    type: Interface
  edges:
    - edge: exposes
      to: payment.ProcessPayment
    - edge: exposes
      to: payment.GetPaymentStatus
```

```yaml
domainspec:
  concept:
    id: payment.OrderFulfillment
    type: Workflow
  edges:
    - edge: orchestrates
      to: payment.ChargePayment
    - edge: orchestrates
      to: payment.ReserveInventory
```

```yaml
domainspec:
  concept:
    id: ui.payment.useCreatePayment
    type: Binding
  edges:
    - edge: mutates
      to: payment.ProcessPayment
```

```yaml
domainspec:
  concept:
    id: ui.payment.PaymentStatusBadge
    type: State Indicator
  edges:
    - edge: reflects
      to: payment.PaymentStatus
```

JavaScript code example (intra-UI edge):

```javascript
/**
 * domainspec:
 *   concept:
 *     id: ui.payment.PaymentSummaryCard
 *     type: Component
 *   edges:
 *     - edge: displays
 *       to: ui.payment.PaymentSummaryViewModel
 */
export function PaymentSummaryCard({ summary }) {
  return {
    title: "Payment Summary",
    total: summary.total,
    status: summary.status,
  };
}
```

Python code example (intra-UI edge):

```python
class PaymentSummaryCard:
    """
    domainspec:
      concept:
        id: ui.payment.PaymentSummaryCard
        type: Component
      edges:
        - edge: displays
          to: ui.payment.PaymentSummaryViewModel
    """

    def render(self, summary):
        return {
            "title": "Payment Summary",
            "total": summary["total"],
            "status": summary["status"],
        }
```

JavaScript code example (cross-layer edge):

```javascript
/**
 * domainspec:
 *   concept:
 *     id: ui.payment.useCreatePayment
 *     type: Binding
 *   edges:
 *     - edge: mutates
 *       to: payment.ProcessPayment
 */
export async function useCreatePayment(apiClient, payload) {
  return apiClient.post("/payments", payload);
}
```

Python code example (cross-layer edge):

```python
def use_create_payment(api_client, payload):
    """
    domainspec:
      concept:
        id: ui.payment.useCreatePayment
        type: Binding
      edges:
        - edge: mutates
          to: payment.ProcessPayment
    """
    return api_client.post("/payments", json=payload)
```

Required fields:

- concept.id
- concept.type

Optional fields:

- concept.concern (`biz` or `sys`)
- edges[].edge
- edges[].to
- edges[].evidence (free-form string for local trace notes)

Concern guidance:

- Use `biz` for domain behavior that directly carries business rules, policy, or contractual intent.
- Use `sys` for technical orchestration and infrastructure plumbing that supports but does not define business semantics.

## Validation Rules

1. Concept ID must be unique per symbol and match DomainSpec naming conventions.
2. Concept type must be valid in taxonomy.
3. Edge label must be one of the 29 canonical relationship labels.
4. Source concept type and target concept type must match allowed From -> To definition for that edge.
5. Canonical direction is mandatory. Inverse aliases are rejected.
6. Duplicate triples in the same artifact are rejected.
7. Unknown target concepts are rejected unless explicitly marked as deferred and linked to a tracked task.

## Enforcement Policy (Tag-Specific)

- Critical:
  - Unknown edge label.
  - Invalid type-direction pair.
  - Canonical direction violation.
  - Missing concept.id or concept.type.
- High:
  - Unknown target concept without tracked deferred reference.
  - Duplicate conflicting declarations for the same source symbol.
- Medium:
  - Missing optional evidence field where team policy requires it.

CI behavior:

- Critical and High block merge.
- Medium warns by default unless elevated by repository policy.

## Implementation Tasks

1. [Wave W1] Publish docstring YAML schema for concept and edge tags.
2. [Wave W2] Implement parser adapters for supported source formats and extract canonical triples.
3. [Wave W3] Implement validator for label, type-direction, identity, and duplication checks.
4. [Wave W4] Add CI command and local preflight command for tag validation.
5. [Wave W5] Add remediation catalog per failure code with fix guidance.
6. [Wave W6] Add reference examples for all 29 edges, including backend, UI, and cross-layer.
7. [Wave W7] Wire drift comparison output against feature concept graphs.
8. [Wave W8] Add waiver flow for temporary exceptions with owner and expiration.

## Research Baseline for Execution

Current implementation already provides reusable governance patterns that this initiative should follow:

- `tools/validate-relationships.ts` already parses canonical edges from `RELATIONSHIPS.md` and reports strict or warn violations with line-level evidence.
- `tools/generate-registry.ts` already validates concept graph edges and scans source anchors, but current source anchor parsing is regex-based and limited to TypeScript/TSX with legacy `@biz/@sys` markers.
- `tools/check_docs_sync.sh` already runs governance validators via `pnpm dlx tsx tools/...` patterns and can be used as a local reference, while CI integration for this effort should start as a dedicated command and workflow step.
- Root workflow `.github/workflows/drift-check.yml` currently runs drift checks and is the nearest existing CI surface where a dedicated tag-validation step can be added.

This baseline reduces risk by reusing existing validator architecture and output patterns rather than introducing an unrelated framework.

## Wave Plan (One Wave per Task)

Placement rule:

- Keep normative implementation governance assets at framework root (outside `docs/`) for now.
- Keep only feature-facing examples inside `docs/examples/`.

### Wave W1 - Schema Publication

Objective:
Define the canonical YAML contract for source annotations so extraction and validation are deterministic.

How this should be done (research-backed):

- Reuse current validator style from `tools/validate-relationships.ts`: parse input, emit explicit violations, exit non-zero on strict mode.
- Author a schema spec document with required fields (`concept.id`, `concept.type`) plus optional fields (`concept.concern`, `edges[]`, `edges[].evidence`).
- Keep canonical direction enforcement in schema semantics by requiring outgoing edges only.

Proposed artifacts:

- `governance/tags/CODE-TAG-SCHEMA.md` (human-readable contract)
- `governance/tags/CODE-TAG-SCHEMA.json` (machine-checkable schema)

Wave exit gate:

- Schema docs and JSON schema agree on required and optional fields.
- At least one positive and one negative YAML example are included with expected validation outcomes.

### Wave W2 - Multi-Language Parser Adapters

Objective:
Extract canonical triples from TS/TSX, JS/JSX, and Python docstrings into one normalized output model.

How this should be done (research-backed):

- Start from current anchor scan behavior in `tools/generate-registry.ts` and replace regex-only markers with parser adapters that read docstring YAML blocks.
- Implement adapter strategy per language:
  - TypeScript/TSX and JavaScript/JSX: parse block comments and nearest symbol.
  - Python: parse triple-quoted docstrings and owning function or class symbol.
- Normalize all outputs to one record shape: `{ file, line, symbol, conceptId, conceptType, concern, edge, to, evidence }`.

Proposed artifacts:

- `governance/tags/tools/extract-code-tags.ts`
- `governance/tags/tools/lib/code-tag-adapters/{ts,js,py}.ts`
- `governance/tags/tools/fixtures/code-tags/*` (language fixture corpus)

Wave exit gate:

- Parser extracts deterministic records from fixture files for all three language groups.
- Re-running extraction on unchanged input yields byte-identical output.

### Wave W3 - Canonical Validator Engine

Objective:
Validate extracted tags against taxonomy and relationship direction rules before any registry ingestion.

How this should be done (research-backed):

- Reuse canonical edge loading pattern from `tools/validate-relationships.ts`.
- Extend validation coverage beyond label existence to include:
  - source and target concept type compatibility,
  - required field presence,
  - duplicate triple detection,
  - unknown concept endpoints.
- Emit violation codes and line-level evidence to support remediation and CI annotations.

Proposed artifacts:

- `governance/tags/tools/validate-code-tags.ts`
- `governance/tags/tools/lib/code-tag-rules.ts`
- `governance/tags/tools/lib/code-tag-types.ts`

Wave exit gate:

- Validation suite covers happy path plus every declared critical or high failure class.
- Strict mode returns non-zero on the first failing fixture batch.

### Wave W4 - CI and Preflight Wiring

Objective:
Expose one local command and one dedicated CI workflow integration path for strict enforcement.

How this should be done (research-backed):

- Follow existing command style: `pnpm dlx tsx tools/<validator>.ts`.
- Add a dedicated npm script entry (workspace or submodule level) for discoverability.
- Add a dedicated workflow step in `.github/workflows/drift-check.yml` or a sibling workflow that runs tag extraction plus validation in strict mode.
- Keep this integration separate from `tools/check_docs_sync.sh` for the initial rollout, matching your decision.

Proposed artifacts:

- Script entry in `implementation/domainspec/package.json`
- Workflow update in `.github/workflows/drift-check.yml` (or new workflow file)

Wave exit gate:

- Local command fails fast on invalid tags.
- CI workflow blocks merge on critical or high validation failures.

### Wave W5 - Remediation Catalog

Objective:
Define exact fix guidance for each failure code so developers can resolve errors without manual governance interpretation.

How this should be done (research-backed):

- Mirror current violation reporting style from existing validators and map each code to:
  - meaning,
  - likely cause,
  - fix steps,
  - example before or after snippet.
- Ensure every validator output includes a remediation reference key.

Proposed artifacts:

- `governance/tags/CODE-TAG-REMEDIATION.md`
- Optional `governance/tags/tools/lib/code-tag-remediation.ts` lookup map for machine output

Wave exit gate:

- Every emitted failure code is documented with deterministic remediation.
- Validator output includes remediation key references for all failures.

### Wave W6 - 29-Edge Example Pack

Objective:
Provide authoritative examples covering every canonical edge across backend, intra-UI, and cross-layer groups.

How this should be done (research-backed):

- Use `RELATIONSHIPS.md` as the canonical edge source and generate an example checklist to ensure no edge is missed.
- For each edge, include at least one YAML block and one code-hosted example (JS/TS or Python) when practical.
- Keep examples canonical-direction only and consistent with taxonomy type names.

Proposed artifacts:

- `governance/tags/examples/code-tags/README.md`
- `governance/tags/examples/code-tags/backend.md`
- `governance/tags/examples/code-tags/ui.md`
- `governance/tags/examples/code-tags/cross-layer.md`

Wave exit gate:

- 29 out of 29 edges mapped to at least one valid example.
- Example pack passes validator and parser tests.

### Wave W7 - Drift Comparison Integration

Objective:
Compare extracted code-tag triples against feature concept graph declarations and report drift with actionable evidence.

How this should be done (research-backed):

- Reuse concept and edge datasets already produced by `tools/generate-registry.ts`.
- Compute three classes of drift:
  - in docs but missing in code tags,
  - in code tags but missing in docs,
  - direction or type mismatch.
- Output summary plus line-level details to support governance reviews.

Proposed artifacts:

- `governance/tags/tools/compare-code-tag-drift.ts`
- `governance/tags/CODE-TAG-DRIFT-REPORT.md` (generated report format)

Wave exit gate:

- Drift command runs in CI and local preflight.
- Report includes counts, severity classes, and direct evidence paths.

### Wave W8 - Waiver Flow

Objective:
Introduce controlled exceptions for temporary non-compliance with explicit ownership and explicit expiry.

How this should be done (research-backed):

- Align waiver governance with existing GOV-03 escalation posture.
- Require waiver records to include:
  - violation code,
  - scope (file or concept IDs),
  - owner,
  - rationale,
  - explicit expiration timestamp,
  - approval reference.
- Validator must reject waivers missing expiration or owner.

Proposed artifacts:

- `governance/tags/CODE-TAG-WAIVERS.md` (policy)
- `governance/tags/code-tag-waivers.yaml` (active waiver registry)
- waiver reader module in validator path

Wave exit gate:

- Waivers are honored only when active and complete.
- Expired waivers fail CI automatically.

## Wave Implementation Status

Status snapshot: 2026-05-05

| Wave | Status      | Implemented Artifacts                                                                                                                                                                            |
| ---- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| W1   | implemented | `governance/tags/CODE-TAG-SCHEMA.md`, `governance/tags/CODE-TAG-SCHEMA.json`                                                                                                                     |
| W2   | implemented | `governance/tags/tools/extract-code-tags.ts`, `governance/tags/tools/lib/code-tag-adapters/*`, `governance/tags/tools/lib/code-tag-yaml.ts`, `governance/tags/tools/fixtures/code-tags/*`        |
| W3   | implemented | `governance/tags/tools/validate-code-tags.ts`, `governance/tags/tools/lib/code-tag-rules.ts`, `governance/tags/tools/lib/code-tag-types.ts`                                                      |
| W4   | implemented | `package.json` scripts (`code-tags:*`, `check:code-tags`), `.github/workflows/drift-check.yml` step                                                                                              |
| W5   | implemented | `governance/tags/CODE-TAG-REMEDIATION.md`                                                                                                                                                        |
| W6   | implemented | `governance/tags/examples/code-tags/README.md`, `governance/tags/examples/code-tags/backend.md`, `governance/tags/examples/code-tags/ui.md`, `governance/tags/examples/code-tags/cross-layer.md` |
| W7   | implemented | `governance/tags/tools/compare-code-tag-drift.ts`, `governance/tags/CODE-TAG-DRIFT-REPORT.md`                                                                                                    |
| W8   | implemented | `governance/tags/CODE-TAG-WAIVERS.md`, `governance/tags/code-tag-waivers.yaml`, waiver handling in `governance/tags/tools/validate-code-tags.ts`                                                 |

Current strict-mode note:

- `pnpm run check:code-tags` currently fails on drift (`docsOnly > 0`) until real code tags are added to implementation symbols. This is expected under strict rollout.

## Deliverables

- Tag schema specification.
- Extraction and validation specification.
- CI integration mapping.
- Remediation catalog.
- 29-edge example pack.
- Drift comparison report format.
- Waiver policy extension for tag exceptions.

## Resolution Assessment Against Existing Tasks

This section answers whether existing governance tasks are resolved by this addition.

### GOV-01 Impact

| GOV-01 implementation task                                   | Status after this addition | Why                                                                                                                      |
| ------------------------------------------------------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Define canonical axiom-rule-gate chain map                   | partially resolved         | Tag chain is specified for source-level relationship enforcement but not fully integrated into all governance gates yet. |
| Define tag schema for concept, rule, and enforcement binding | partially resolved         | Schema is defined in this plan, but not yet applied and validated in implementation artifacts.                           |
| Add mapping validation checks in CI                          | not resolved               | CI integration is planned, not implemented.                                                                              |
| Add implementation examples for each chain type              | partially resolved         | Example contract is defined and full 29-edge example pack is planned.                                                    |
| Add governance exception and waiver process                  | partially resolved         | Waiver flow requirements are defined but not operationalized yet.                                                        |

### GOV-02 Impact

| GOV-02 implementation task                        | Status after this addition | Why                                                                                       |
| ------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------- |
| Inventory existing validators and map obligations | partially resolved         | New tag validator obligation is defined with explicit checks.                             |
| Define local preflight and CI validation order    | partially resolved         | Tag validator placement is defined conceptually, sequencing not yet finalized in scripts. |
| Define severity levels and block-warn behavior    | partially resolved         | Tag-specific severity and merge behavior are defined.                                     |
| Add remediation hints per failure type            | partially resolved         | Remediation catalog is required by this plan but not yet implemented.                     |
| Add periodic validation health report             | not resolved               | No reporting artifact implemented yet.                                                    |

### GOV-03 Impact

| GOV-03 implementation task                                    | Status after this addition | Why                                                                |
| ------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------ |
| Define severity classes and block policies                    | partially resolved         | Tag validation severities and merge blocking policy are specified. |
| Define emergency advisory fallback policy with strict timeout | not resolved               | No timeout-based advisory fallback procedure is defined yet.       |
| Define escalation owner chain and SLA                         | not resolved               | Ownership and SLA path are not defined in this addition.           |
| Define rollback and recovery protocol                         | not resolved               | No incident recovery protocol added yet.                           |
| Add policy checks to CI workflow configuration                | not resolved               | CI workflow changes are planned, not implemented.                  |

## Done Criteria

- [ ] Tag schema is published and applied in at least one backend, one UI, and one cross-layer feature.
- [ ] Extraction plus validation runs in local preflight and CI with deterministic outcomes.
- [ ] Drift report shows traceable mapping from docstring tags to concept graph triples.
