# Code Tag Remediation Catalog

This catalog maps validation failures to deterministic remediation actions.

## Severity Policy

- `CRITICAL`: blocks merge in strict mode.
- `HIGH`: blocks merge in strict mode.
- `MEDIUM`: warning by default; can be elevated by policy.

## Failure Codes

| Code          | Severity | Meaning                                   | Typical Cause                                               | Remediation                                                                     |
| ------------- | -------- | ----------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------- |
| CT-001        | CRITICAL | Missing concept.id                        | Incomplete concept block                                    | Add `domainspec.concept.id` with canonical concept ID from feature docs.        |
| CT-002        | CRITICAL | Missing concept.type                      | Incomplete concept block                                    | Add `domainspec.concept.type` using taxonomy label.                             |
| CT-003        | CRITICAL | Unknown edge label                        | Non-canonical edge name                                     | Replace with edge from `RELATIONSHIPS.md`.                                      |
| CT-004        | CRITICAL | Invalid source type for edge              | Edge declared on wrong concept type                         | Move tag to correct concept type or change edge to compatible one.              |
| CT-005        | HIGH     | Unknown target concept                    | Target not in feature concept catalog                       | Add concept to feature SPEC or fix typo in `to` value.                          |
| CT-006        | CRITICAL | Invalid target type for edge              | Target concept type does not match edge contract            | Change `to` concept or edge label to valid pair.                                |
| CT-007        | HIGH     | Duplicate triple in artifact              | Same `from-edge-to` declared more than once                 | Keep a single canonical triple declaration.                                     |
| CT-008        | HIGH     | Conflicting concept IDs on same symbol    | Symbol was tagged with different concept IDs                | Keep one concept ID per symbol and remove conflicting block.                    |
| CT-009        | MEDIUM   | Missing edge evidence (when required)     | `--require-evidence` enabled without evidence text          | Add `evidence` for each edge requiring trace note.                              |
| CT-010        | CRITICAL | Unknown concept.type                      | Type not found in taxonomy                                  | Replace with canonical taxonomy type from `TAXONOMY.md`.                        |
| CT-012        | MEDIUM   | Invalid concept.concern                   | Concern value not in `biz` or `sys`                         | Set `concern` to `biz` or `sys`, or remove field.                               |
| CT-013        | HIGH     | Unknown source concept                    | Source concept ID not declared in feature specs             | Add or correct concept in `SPEC.md` concept table.                              |
| CT-014        | CRITICAL | Edge entry missing edge key               | Malformed edge row                                          | Add `edge` value in edge item.                                                  |
| CT-015        | CRITICAL | Edge entry missing target                 | Malformed edge row                                          | Add `to` concept ID for edge item.                                              |
| CT-016        | CRITICAL | Invalid or missing spec_ref.path          | `concept.spec_ref` declared without valid SPEC path         | Set `spec_ref.path` to the concept source SPEC path (ends with `/SPEC.md`).     |
| CT-017        | HIGH     | spec_ref.path mismatch                    | Explicit spec path differs from canonical concept source    | Align `spec_ref.path` with the concept row source in `docs/features/*/SPEC.md`. |
| CT-018        | MEDIUM   | spec_ref.line mismatch                    | Explicit line does not match canonical concept row          | Update `spec_ref.line` to the concept table row line or remove line field.      |
| CT-019        | MEDIUM   | Invalid spec_ref.line                     | Non-integer or non-positive line value                      | Set `spec_ref.line` to a positive integer.                                      |
| CT-COMP-000   | CRITICAL | Composability input missing               | Composability checker input file path not found             | Generate extraction output first (`pnpm run code-tags:extract`) and retry.      |
| CT-COMP-001   | HIGH     | Rule-operation composition missing        | `Rule --enforces--> Operation` without operation call       | Call the rule symbol from inside the target operation before mutation.          |
| CT-COMP-002   | HIGH     | Calculation-operation composition missing | `Calculation --calculates--> Operation` without call        | Call the calculation symbol and consume result in operation logic.              |
| CT-COMP-003   | MEDIUM   | Policy-operation composition missing      | `Policy --applies--> Operation` without policy call         | Call policy symbol to select operation strategy/branch behavior.                |
| CT-COMP-004   | HIGH     | Interface-operation composition missing   | `Interface --exposes--> Operation` without interface call   | Call the target operation from the interface/controller boundary.               |
| CT-COMP-005   | HIGH     | Interface-query composition missing       | `Interface --exposes--> Query` without interface call       | Call the target query from the interface/controller boundary.                   |
| CT-COMP-006   | HIGH     | Binding-operation composition missing     | `Binding --mutates--> Operation` without binding call       | Call target operation from binding hook/action (`useMutation` path).            |
| CT-COMP-007   | HIGH     | Binding-query composition missing         | `Binding --fetches--> Query` without binding call           | Call target query from binding hook (`useQuery` path).                          |
| CT-COMP-008   | HIGH     | Workflow-operation composition missing    | `Workflow --orchestrates--> Operation` without call         | Call declared operations from workflow/saga sequence.                           |
| CT-COMP-009   | HIGH     | Cross-feature rule composition missing    | `Rule --enforces-cross--> Operation` without operation call | Call the cross-feature enforcing rule in target operation path.                 |
| CT-COMP-010   | MEDIUM   | Composability target not tagged           | Target concept has no compatible tagged symbol              | Add code tags for the target concept type so composition can be checked.        |
| CT-COMP-011   | MEDIUM   | Composability source symbol unknown       | Source tag symbol missing or unresolved by extractor        | Tag a concrete function/class symbol (avoid anonymous or unresolved targets).   |
| CT-COMP-012   | MEDIUM   | Composability target symbol unknown       | Target concept exists but no resolvable symbol              | Tag a concrete symbol for the target concept so checker can evaluate calls.     |
| CT-PARSE-001  | CRITICAL | `to` before `- edge`                      | Invalid YAML structure in edges list                        | Start edge item with `- edge:` then set `to:` below it.                         |
| CT-PARSE-002  | CRITICAL | `evidence` before `- edge`                | Invalid YAML structure in edges list                        | Start edge item with `- edge:` then set `evidence:` below it.                   |
| CT-PARSE-003  | CRITICAL | Missing domainspec root                   | Comment/docstring lacks `domainspec:` root                  | Add top-level `domainspec:` key in annotation block.                            |
| CT-PARSE-004  | MEDIUM   | Invalid spec_ref.line parse               | YAML has non-numeric `spec_ref.line`                        | Use integer literal for `spec_ref.line`.                                        |
| CT-WAIVER-001 | CRITICAL | Invalid waiver entry                      | Missing required waiver fields                              | Add `id`, `code`, `owner`, `reason`, and `expiresAt`.                           |
| CT-WAIVER-002 | CRITICAL | Invalid waiver expiry format              | `expiresAt` not parseable timestamp                         | Use ISO-8601 timestamp (for example `2026-06-01T00:00:00Z`).                    |
| CT-WAIVER-003 | HIGH     | Expired waiver                            | Waiver date is in the past                                  | Renew waiver with explicit new expiry or fix issue and remove waiver.           |

## Before and After Example

### Before

```yaml
domainspec:
  concept:
    type: Rule
  edges:
    - to: payment.ProcessPayment
```

### After

```yaml
domainspec:
  concept:
    id: payment.MaxAmountRule
    type: Rule
    concern: biz
  edges:
    - edge: enforces
      to: payment.ProcessPayment
      evidence: "Rule gates operation execution"
```
