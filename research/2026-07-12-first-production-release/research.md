## Agent 1 — formal authority and release-obligation cartography

# DomainSpec-v2 Formal Authority Cartography

## Executive verdict

There is no authoritative definition of a DomainSpec-v2 “production release.”

The strictest currently defensible release-form candidate is:

> A private, repository-local, versioned developer toolchain comprising the governed DomainSpec-v2 language surfaces, feature-pack format, deterministic TypeScript CLI, and validation/derivation utilities, initially scoped to the backend profile.

This is an inference, not a ratified release contract. The evidence does not support calling DomainSpec-v2 a hosted service, public npm package, generally supported SDK, or completed intent-to-production system:

- The authority model explicitly says deployment, organization policy, implementation conformance, and the release act belong to an external owner, not DomainSpec-v2 authority ([`authority/AUTHORITY-MODEL.md:19-31`](projects/domainspec-v2/authority/AUTHORITY-MODEL.md), [`:40-47`](projects/domainspec-v2/authority/AUTHORITY-MODEL.md), [`:54-64`](projects/domainspec-v2/authority/AUTHORITY-MODEL.md)).
- The implementation packages are version `0.0.0`, `private: true`, and expose scripts but no package `bin` or distribution contract ([`impl/package.json:1-30`](projects/domainspec-v2/impl/package.json), [`impl/test-derivation-engine/package.json:1-20`](projects/domainspec-v2/impl/test-derivation-engine/package.json)).
- The executable surface is a local CLI with `roundtrip`, `self-check`, `derive`, `check`, `emit-tests`, and `lint`, not a server or deployed application ([`src/cli.ts:430-459`](projects/domainspec-v2/impl/test-derivation-engine/src/cli.ts)).
- Repository search found no release, support, compatibility, security, installation, operations, or deployment contract and no project-local CI workflow.

Therefore, the first roadmap gate is not implementation work. It is an external-owner decision that fixes:

1. release identity and version;
2. private repository release versus extracted/private package versus public open-core derivative;
3. backend-only versus backend-plus-UI scope;
4. supported actors, environments, inputs, outputs, and compatibility window;
5. whether “DomainSpec-v2 production” means the full discipline or only its build-time validation toolchain.

Without that gate, “first production release” is semantically underdetermined.

## Candidate actors and operating boundary

| Actor                         | Authority-supported role                                                       | Current boundary                                                       |
| ----------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| Human DomainSpec-v2 owner     | Ratifies classifications, promotion, implementation conformance, and release   | Final semantic/release authority                                       |
| Spec author, human or agent   | Authors typed feature packs and Formal cells                                   | Produces candidate/primary spec material; holds no promotion authority |
| Deterministic engine          | Parses, validates, derives obligations, emits artifacts, detects bounded drift | Local Node/TypeScript CLI; must not guess or substitute for the owner  |
| Implementation/platform owner | Decides whether implementation conforms and whether a release is made          | External to DomainSpec-v2 authority                                    |
| Saturn                        | Acts on drift and closes the outer correction loop                             | Private specification; not executable here                             |
| Downstream builder/operator   | Likely consumer of feature-pack validation and derived-test output             | Not yet named in a support or distribution contract                    |

The three-actor authoring model—agent, deterministic engine, human owner—is described in the project discovery at [`discovery/domainspec-v2-discovery.md:134-142`](projects/domainspec-v2/discovery/domainspec-v2-discovery.md). The current authoring/derivation flow is documented at [`:150-186`](projects/domainspec-v2/discovery/domainspec-v2-discovery.md), but discovery is an orientation artifact, not release authority.

No support boundary exists. The narrow defensible provisional boundary is “maintainers and authorized internal DomainSpec authors operating inside this private repository.” Broader user support must be separately declared and witnessed.

## Obligation and traceability matrix

| ID  | Release obligation                                                                                                                         | Authority/evidence                                                                                                                                                                                                   | Current state                                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| O1  | External owner ratifies the release contract and implementation-conformance claim                                                          | Authority Model core rule and source movement, [`AUTHORITY-MODEL.md:40-47`](projects/domainspec-v2/authority/AUTHORITY-MODEL.md), [`:133-147`](projects/domainspec-v2/authority/AUTHORITY-MODEL.md)                  | **Missing decision; blocks any unqualified production claim**                                                 |
| O2  | Release scope keeps semantic authority in root `authority/`, `definitions/`, and feature packs; implementation remains consumer/projection | Constitution C1, [`domainspec-v2-CONSTITUTION.md:44-53`](projects/domainspec-v2/authority/constitutions/domainspec-v2-CONSTITUTION.md)                                                                               | Active rule; several consumers/read models are stale                                                          |
| O3  | Claims do not exceed evidence; local `pass/flag/block` does not imply readiness                                                            | Constitution C2 and C(meta-2), [`:55-59`](projects/domainspec-v2/authority/constitutions/domainspec-v2-CONSTITUTION.md), [`:146-152`](projects/domainspec-v2/authority/constitutions/domainspec-v2-CONSTITUTION.md)  | Active; production wording must remain bounded                                                                |
| O4  | Migration is self-contained before v1 freezes: all `REFORMULATE` rows close and build proof is green                                       | [`IMPORT-MANIFEST.md:71-73`](projects/domainspec-v2/IMPORT-MANIFEST.md)                                                                                                                                              | **Open**: R2, R4, R5, R6a/R6b and R7 reconciliation remain in the ledger                                      |
| O5  | Critical governance gates have runnable/computable enforcement                                                                             | Axiom A3, [`authority/AXIOMS.md:90-106`](projects/domainspec-v2/authority/AXIOMS.md)                                                                                                                                 | Local commands exist; clean-checkout/release-gate execution still needs proof                                 |
| O6  | Expected values derive from the spec, never implementation output                                                                          | Constitution C5, [`domainspec-v2-CONSTITUTION.md:74-79`](projects/domainspec-v2/authority/constitutions/domainspec-v2-CONSTITUTION.md)                                                                               | Implemented by intent; requires current black-box proof                                                       |
| O7  | Links/imports, canonical tables/Formal cells, and relationship endpoints fail closed                                                       | Constitution C9–C11, [`:104-134`](projects/domainspec-v2/authority/constitutions/domainspec-v2-CONSTITUTION.md)                                                                                                      | Commands exist; release must preserve all three gates                                                         |
| O8  | Forbidden dependencies are unconstructible and cannot cross the adapter line                                                               | Axiom A2 and Constitution C6, [`AXIOMS.md:73-88`](projects/domainspec-v2/authority/AXIOMS.md), [`domainspec-v2-CONSTITUTION.md:81-87`](projects/domainspec-v2/authority/constitutions/domainspec-v2-CONSTITUTION.md) | Active law; dynamic enforcement is still incomplete                                                           |
| O9  | Convergence is demonstrated as a trend across relevant semantic, contract, runtime, governance, and coordination surfaces                  | D1/D17 and Constitution C7, [`DEFINITIONS.md:20-54`](projects/domainspec-v2/definitions/DEFINITIONS.md), [`:657-707`](projects/domainspec-v2/definitions/DEFINITIONS.md)                                             | **Active blocker**: drift stream/guardedness engine absent                                                    |
| O10 | Root relationship authority and its projections agree exactly                                                                              | DS-D2/DS-D8, [`DEFINITIONS.md:1067-1159`](projects/domainspec-v2/definitions/DEFINITIONS.md)                                                                                                                         | **Drift defect**: machine authority says 30; canonical/read-model prose still says 31 in places               |
| O11 | Supported node vocabulary is explicit and promotion status is honest                                                                       | Machine DS-D1 registry, [`meta-types.yml:1-23`](projects/domainspec-v2/definitions/meta-types/meta-types.yml)                                                                                                        | 13 backend members remain `candidate`; 11 UI candidates are formation-deferred                                |
| O12 | No hand-authored implementation projection can redefine root authority                                                                     | `DEC-DSV2-SPEC-HOMING`, ledger [`projects/domainspec-v2/.craft/ledger.yml:578-605`](projects/domainspec-v2/.craft/ledger.yml)                                                                                        | Partially executed; TAXONOMY/DRIFT/constitution migration remains                                             |
| O13 | Private rules/moat never cross into public Arcanum                                                                                         | Constitution C8, [`domainspec-v2-CONSTITUTION.md:97-102`](projects/domainspec-v2/authority/constitutions/domainspec-v2-CONSTITUTION.md); README boundary [`README.md:76-82`](projects/domainspec-v2/README.md)       | Active; no scrubbed public distribution artifact exists                                                       |
| O14 | Release records load-bearing terms and detects definition drift                                                                            | Constitution C(meta-4), [`domainspec-v2-CONSTITUTION.md:163-170`](projects/domainspec-v2/authority/constitutions/domainspec-v2-CONSTITUTION.md)                                                                      | Audit claims pass, but the 30/31 contradiction falsifies complete synchronization                             |
| O15 | Release gate runs automatically or has a named, reproducible release procedure                                                             | Craft state [`ledger.yml:111-121`](projects/domainspec-v2/.craft/ledger.yml)                                                                                                                                         | CI/pre-commit wiring is deferred; no release procedure exists                                                 |
| O16 | L2 attestation is not claimed unless the seal exists                                                                                       | Ratification record [`2026-06-29-ratify-governance-kinds.md:38-46`](projects/domainspec-v2/authority/decisions/2026-06-29-ratify-governance-kinds.md)                                                                | Seal pending. This blocks “cryptographically attested,” not necessarily an initial internal toolchain release |
| O17 | Full end-to-end claims require an actual typed-spec→implementation→runtime-drift witness                                                   | Discovery status table and conclusion [`domainspec-v2-discovery.md:212-228`](projects/domainspec-v2/discovery/domainspec-v2-discovery.md)                                                                            | Not demonstrated                                                                                              |

## Contradictions and missing decisions

### 1. “Production” has no authority owner or contract

The local definitions explicitly say they do not define launch readiness or implementation contract ([`definitions/DEFINITIONS.md:5-18`](projects/domainspec-v2/definitions/DEFINITIONS.md)). The authority model delegates release to an external owner. No external-owner release artifact exists.

Strict treatment: block the unqualified release claim; do not block bounded roadmap research.

### 2. Full DomainSpec-v2 versus build-time toolchain

The project mandate includes validation, layering, and drift/convergence, but the drift engine is an active blocker ([`.craft/ledger.yml:645-655`](projects/domainspec-v2/.craft/ledger.yml)). Therefore:

- A release named “DomainSpec-v2 production 1.0” requires closing the drift implementation and runtime evidence obligations.
- A narrower “DomainSpec-v2 build-time validation toolchain” release may defer the outer drift/Saturn loop if the exclusion is explicit.

Calling the narrow toolchain the full production system would violate claim ≤ evidence.

### 3. Canonical language drift: 30 versus 31 relationships

The current machine authority declares exactly 30 active signatures ([`relationships.yml:1-18`](projects/domainspec-v2/definitions/relationships/relationships.yml)). Yet:

- `domainspec-v2-D19` says 31 ([`DEFINITIONS.md:1027-1032`](projects/domainspec-v2/definitions/DEFINITIONS.md));
- the drift audit says 31 ([`DEFINITION-DRIFT-AUDIT.md:55-67`](projects/domainspec-v2/definitions/DEFINITION-DRIFT-AUDIT.md));
- several Craft rows report 31, while newer rows report 30.

This is release-blocking semantic drift because both human canonical definitions and the machine authority are load-bearing.

### 4. Public Arcanum and private DomainSpec-v2 disagree

Public Arcanum canonizes a 25-type profile including Saga and a 29-edge profile ([`arcanum/definitions/DEFINITIONS.md:455-548`](arcanum/definitions/DEFINITIONS.md)). DomainSpec-v2’s current local machine view has 13 backend candidates, 11 formation-deferred UI candidates, no Saga, and 30 relationships.

Arcanum is not DomainSpec-v2 authority, but public release or shared `DS-D*` naming would create user-visible ambiguity. A public derivative requires one of:

- versioned namespaces;
- explicit profile identifiers and compatibility mapping;
- an owner-approved Arcanum promotion;
- a clear statement that Arcanum’s wedge is a separate historical/public profile.

### 5. Free wedge versus private moat

A 2026-06-12 research handoff calls the deterministic engine publishable “free wedge” ([`research/test-engine/HANDOFF.md:34-62`](projects/domainspec-v2/research/test-engine/HANDOFF.md)). The later active constitution withholds `src/rules` ([`domainspec-v2-CONSTITUTION.md:97-102`](projects/domainspec-v2/authority/constitutions/domainspec-v2-CONSTITUTION.md)).

The active constitution wins. Public behavior/results may still be exposed, but the repository has not defined a scrubbed API/package boundary that does so without source disclosure.

### 6. Backend and UI support remain undecided

All 13 backend DS-D1 members remain confirmation-gated candidates; 11 UI labels are explicitly formation-deferred ([`meta-types.yml:9-23`](projects/domainspec-v2/definitions/meta-types/meta-types.yml)). The strict route must either:

- release a backend-only profile with an explicit candidate/compatibility contract; or
- complete and promote the UI formation work before claiming full-profile support.

### 7. Support and compatibility are absent

Missing owner decisions include:

- supported Node/runtime versions and operating systems;
- installation and upgrade path;
- semantic versioning and compatibility promises;
- feature-pack schema/profile versioning;
- failure/diagnostic contract;
- support channel and security reporting;
- licensing and public/private distribution rights;
- deprecation and migration policy.

These are not automatically “hardening.” They are required if the release expects anyone outside the current maintainers to depend on it.

## Production domains implicated

Required for any first release:

1. release authority and scoped product contract;
2. semantic authority reconciliation;
3. migration/freeze completion;
4. reproducible installation and versioning;
5. runnable fail-closed validation;
6. clean-checkout verification and release evidence;
7. private-moat and artifact-containment enforcement;
8. operator/user documentation and support boundary;
9. compatibility and migration policy;
10. one or more declared real-domain witnesses.

Conditional on a public release:

- licensing;
- public/private scrub;
- public package/API design;
- Arcanum profile/namespace reconciliation;
- provenance and source-distribution review.

Conditional on a hosted service:

- authentication, tenancy, availability, deployment, SLOs, incident response, backups, recovery, and data retention.

No current authority supports choosing the hosted-service branch, so service hardening should not enter the critical path unless the release-form decision selects it.

Deferrable unless explicitly promised:

- L2 cryptographic attestation;
- full category-law proof;
- full UI vocabulary;
- typed-spec→generated-code automation;
- Saturn’s complete outer loop;
- broad multi-platform packaging;
- public Arcanum publication.

## Claims that still require runtime proof

Before release, current prose or ledger assertions should be re-proven from a clean environment:

- `npm ci` succeeds from the declared supported environment.
- `npm run validate`, `engine:test`, `tags:test`, and `typecheck` pass from a clean checkout.
- Every CLI command has positive, negative, malformed-input, and containment behavior witnessed.
- Same supported input produces byte-stable outputs across repeated runs.
- `derive --out` and `emit-tests` cannot escape the allowed repository boundary or write into public Arcanum.
- A real downstream implementation consumes emitted obligations/tests successfully.
- Failure diagnostics are stable enough to be an operator contract.
- Code-tag conformance is exercised on actual v2 source, not only fixtures.
- Drift/convergence claims use a time series across the relevant five surfaces.
- Installation, upgrade, rollback, and compatibility behavior work across the declared support matrix.
- Any public artifact has been boundary-scrubbed and contains no private rules or paths.
- The claimed “cheaper, less drift-prone implementation agents” outcome is demonstrated; it is currently an unexecuted hypothesis.

## Strict release-route conclusion

The strict route is not “close every open research item.” It is:

1. Ratify a backend-first, private CLI/toolchain release contract—or explicitly choose another form.
2. Reconcile the canonical 30/31 and 13/14 count drift.
3. Finish the v1→v2 self-containment/freeze obligations for every artifact in the selected release profile.
4. Require clean-checkout, fail-closed, negative-control, containment, and real-consumer evidence.
5. Either close the drift-engine blocker or remove full-convergence/full-DomainSpec claims from the first release.
6. Declare versioning, compatibility, installation, support, and private-moat boundaries.
7. Produce the external-owner release decision and immutable evidence bundle.

The L2 seal, full UI profile, public distribution, category-law formalization, and hosted-service controls should remain outside the first-release critical path unless the release contract makes one of them load-bearing.

<oai-mem-citation>
<citation_entries>
MEMORY.md:139-150|note=[used scoped ledger guidance and reverified all state live]
MEMORY.md:497-503|note=[used authority surface pointers and detected that remembered 31 count is stale]
</citation_entries>
<rollout_ids>
019f4568-399c-7501-b5be-ec51452a3bea
019f22fc-f240-7a10-9237-3ee03e5fae95
</rollout_ids>
</oai-mem-citation>

## Agent 2 — empirical runtime and executable-evidence cartography

# Empirical runtime cartography — DomainSpec v2

## Release-form verdict

**Verdict: FAIL for production release in the present state.**

The strongest release form supported by runtime evidence is a **private, repository-local Node.js/TypeScript validation and test-derivation toolchain**, operated from `projects/domainspec-v2/impl/` with the full umbrella checkout and development dependencies present.

Runtime evidence does **not** support describing DomainSpec v2 as:

- a hosted service;
- a deployable application;
- a public or private installable npm product;
- a stable external library;
- a complete validator for the full DomainSpec v2 language.

A defensible first production scope could be narrowed to an **internal backend-spec validation/derivation CLI v0.x**, but only after closing the release-gate, distribution, silent-coverage, state-integrity, and reproducibility failures below. A service or externally consumable package would be a materially larger release.

The repository itself confirms the transitional state: v2 is an “implementation home” still migrating from v1 (`projects/domainspec-v2/README.md:3-20`); the import manifest remains “migration in progress” with multiple `reformulation-pending` and pending batches (`projects/domainspec-v2/IMPORT-MANIFEST.md:1-6,22-55`); and the Craft root remains `stage: build`, `gate: flag` (`projects/domainspec-v2/.craft/ledger.yml:81-95`).

## Demonstrated capability matrix

| Surface                                 | Status                           | Demonstrated evidence                                                                                                                                                                              |
| --------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Locked dependency resolution            | **PASS — narrow**                | `npm ci --dry-run --ignore-scripts --offline` resolved the current lockfile successfully. This was not a clean install execution.                                                                  |
| Aggregate governance validation         | **PASS — narrow**                | `npm run validate`: docs links passed; relationships passed on 2 specs/5 edges/30 signatures; content passed on 7 concepts/5 edges/13 schemas; 69 tool tests passed; sample engine lint was clean. |
| Governance/tool unit and negative tests | **PASS**                         | 69/69 passed, including malformed instances, unknown rules, contradiction checks, bad relationship directions, generated-inverse rejection, and the current non-collapse baseline.                 |
| Engine tests                            | **PASS**                         | 97/97 Vitest tests passed across parser, formal evaluator, identity, containment, emission, roundtrip, and negative controls.                                                                      |
| Code-tag tests                          | **PASS**                         | 10/10 passed, including positive and deliberate negative composability and drift cases.                                                                                                            |
| Type safety                             | **PASS**                         | Root implementation and engine `tsc --noEmit` both returned 0.                                                                                                                                     |
| Generated-instance validation           | **PASS**                         | 13 instances validated against 13 schemas.                                                                                                                                                         |
| Meta-type non-collapse gate             | **PASS**                         | 13 meta-types, 78 pairs, no collapse candidates; all declared acceptance criteria passed.                                                                                                          |
| Retired-orchestration audit             | **PASS — snapshot-specific**     | 202 matching files and 1,731 whole-word matches were allowlisted; zero active violations.                                                                                                          |
| Engine roundtrip                        | **PASS — declared narrow scope** | Financial-settlement: 79 raw obligations; 46 derived semantic versus 33 committed; zero genuine missing, but 12 declared irreducible misses and 25 derived extras.                                 |
| Roundtrip negative control              | **PASS**                         | Deliberate injected and removed obligations both made the gate fail as intended.                                                                                                                   |
| Drift check                             | **PASS — one feature**           | Financial-settlement id-map had zero unmapped/dangling IDs, fresh engine region, and zero LLM/engine overlap rows.                                                                                 |
| Real-corpus canonical lint              | **FAIL**                         | Financial-settlement fixture had 1 `needs_formal`; agent-execution-orchestrator had 47.                                                                                                            |
| Packaging boundary                      | **FAIL**                         | `npm pack --dry-run` produced a 238-entry source-heavy tarball, but no compiled `dist`, executable `bin`, package exports, or root `definitions/` authority consumed by validators.                |
| Production dependency audit             | **PASS — very narrow**           | Offline `npm audit --omit=dev` reported zero known production vulnerabilities; the runnable toolchain itself lives in dev dependencies and was therefore outside this result.                      |
| Clean release snapshot                  | **FAIL**                         | Target scope had 110 dirty entries: 86 modified, 4 deleted, 20 untracked. Tests therefore validate an unreproducible working snapshot, not commit `996ac595…`.                                     |

## Commands and observed outcomes

```text
npm --prefix projects/domainspec-v2/impl run validate
PASS: docs, rels, content, 69 tool tests, sample lint

npm --prefix projects/domainspec-v2/impl run engine:test
PASS: 8 files, 97 tests

npm --prefix projects/domainspec-v2/impl run tags:test
PASS: 10 tests

npm --prefix projects/domainspec-v2/impl run typecheck
PASS

npm -w @domainspec/test-derivation-engine run typecheck
PASS

npm --prefix projects/domainspec-v2/impl run instances:validate
PASS: 13 instances

tsx tools/validate-meta-types-noncollapse.ts
PASS: 13 types, 78 pairs, zero candidates

npm --prefix projects/domainspec-v2/impl run audit:retired-orchestration
PASS: zero active violations

tsx test-derivation-engine/src/cli.ts roundtrip financial-settlement
PASS at declared scope; 12 irreducible missing, 25 extras

tsx test-derivation-engine/src/cli.ts self-check financial-settlement
PASS: gate detects both mutations

tsx test-derivation-engine/src/cli.ts check financial-settlement
PASS: FRESH

tsx test-derivation-engine/src/cli.ts lint \
  test-derivation-engine/__fixtures__/financial-settlement
FAIL: 1 unparseable Formal cell

tsx test-derivation-engine/src/cli.ts lint \
  test-derivation-engine/__fixtures__/agent-execution-orchestrator
FAIL: 47 unparseable Formal cells

npm ci --dry-run --ignore-scripts --offline
PASS: lock resolution only

npm pack --dry-run --json
FAIL as a release artifact: package can be enumerated, but is not consumable

npm audit --omit=dev --offline --json
PASS narrowly: zero production findings

git diff --check -- projects/domainspec-v2
PASS

git status --porcelain -- projects/domainspec-v2
FAIL release reproducibility: 110 dirty entries
```

## Material runtime findings

### 1. The green aggregate is not a production gate

`validate` does not run engine tests, tag tests, either typecheck, instance validation, non-collapse validation, the retired-reference audit, roundtrip, self-check, or drift check. It only lints `spec/features/sample` (`projects/domainspec-v2/impl/package.json:14-30`).

The project’s own work-pack records G4—wiring validation and fail-closed behavior into CI/pre-commit—as unfinished (`projects/domainspec-v2/development/make-it-green/WORK-PACK.md:20-26,61-66`). The only root GitHub workflow still runs code-tag validation in **v1**, `implementation/domainspec`, not v2 (`.github/workflows/drift-check.yml:21-30`).

**Consequence:** a change can merge without exercising most of the green evidence observed here.

### 2. The aggregate’s clean lint is a weak witness

The aggregate lints only `spec/features/sample`; the project work-pack itself records that this fixture was vacuous and that lint was not generalized across features (`projects/domainspec-v2/development/make-it-green/WORK-PACK.md:78-84`).

Direct linting of representative corpora failed:

- financial-settlement: 1 unparseable formal expression;
- agent-execution-orchestrator: 47 unparseable formal expressions.

**Consequence:** current tests prove the engine’s mechanics more strongly than they prove that real DomainSpec corpora fit its accepted grammar.

### 3. Language coverage fails open

The content validator:

- returns success when it finds no targets;
- silently skips files without a Concept Registry;
- silently skips registries without expected columns;
- silently skips concepts whose meta-type has no schema (`projects/domainspec-v2/impl/tools/validate-content.ts:74-78,99-119`).

The ledger says backend meta-types are schema-backed while UI formation remains deferred (`projects/domainspec-v2/.craft/ledger.yml:157-173`).

**Consequence:** a “strict” run can report PASS while unformalized or malformed surfaces were not checked. For a backend-only first release, out-of-scope types must be explicitly rejected or counted as exclusions; silently ignoring them cannot be the production contract.

### 4. Missing source documents are accepted as normal absence

The engine skips absent aspect documents and derives over whatever remains (`projects/domainspec-v2/impl/test-derivation-engine/src/grammar/index.ts:934-940`).

That is composable behavior, but no executable feature-profile contract declares which documents are mandatory for a claimed release scope.

**Consequence:** partial feature packs can produce partial obligation sets without failing. Production needs an explicit profile—e.g. “backend-core”—with required documents and a completeness verdict.

### 5. Generated tests can exit successfully with no effective coverage

Without bindings, generation emits one `it.todo` per obligation. With bindings, unsupported obligations become `it.skip` coverage gaps (`projects/domainspec-v2/impl/test-derivation-engine/src/emit/tests.ts:13-21,71-90,114-121`).

The CLI returns 0 whether it emits all todos or reports any number of coverage gaps (`projects/domainspec-v2/impl/test-derivation-engine/src/cli.ts:353-393`).

**Consequence:** “test generation succeeded” does not imply any generated test executes. A release gate needs an explicit allowed-gap threshold by release profile, while preserving honest gaps rather than faking assertions.

### 6. There is no consumable release artifact

Both packages are `0.0.0`, `private`, and expose TypeScript source rather than a stable binary or compiled entrypoint (`projects/domainspec-v2/impl/package.json:1-12`; `projects/domainspec-v2/impl/test-derivation-engine/package.json:1-19`).

The dry-run tarball:

- contains no compiled `dist`;
- contains no `bin` executable or stable exports;
- includes tests, fixtures, internal ledgers, and large research-derived corpora;
- excludes root `definitions/`, although validators default to `../definitions/relationships/relationships.yml` (`projects/domainspec-v2/impl/tools/validate-relationships.ts:24-36`);
- relies on `tsx`, TypeScript, and Vitest stored as dev dependencies;
- embeds repository-relative assumptions in the engine CLI (`projects/domainspec-v2/impl/test-derivation-engine/src/cli.ts:337-350`).

**Consequence:** the package only functions inside the source checkout. A private npm tarball, standalone CLI bundle, or governed repo distribution must be chosen and tested explicitly.

### 7. Stateful write paths lack transaction and concurrency safety

`derive --out` writes a committed id-map and then the generated spec as independent direct writes (`projects/domainspec-v2/impl/test-derivation-engine/src/cli.ts:209-243`). `writeIdMap` is a direct `writeFileSync` (`projects/domainspec-v2/impl/test-derivation-engine/src/identity/human-id.ts:181-187`). Hybrid `emit-tests` directly overwrites its target (`projects/domainspec-v2/impl/test-derivation-engine/src/cli.ts:369-393`).

Positive evidence exists:

- stable IDs and tombstones preserve identity (`identity/human-id.ts:102-179`);
- write containment rejects lexical traversal and public-Arcanum destinations (`paths/containment.ts:1-20`);
- drift check detects stale generated state.

Absent evidence:

- atomic temp-write-and-rename;
- locking or concurrent-writer rejection;
- rollback after a partial two-file write;
- collision protection for two feature directories with the same basename;
- symlink-aware containment.

**Consequence:** interruption or concurrent generation can leave the id-map, generated spec, and emitted tests inconsistent.

### 8. Documentation and implementation have drifted

The engine README still labels the parser and rules as typed stubs (`projects/domainspec-v2/impl/test-derivation-engine/README.md:23-25`), while current source parses nine document types and 97 tests pass. Its development instructions use pnpm (`README.md:27-34`) while the parent implementation is npm-workspace/`package-lock.json` based.

The tags README names reports and framework-root pnpm commands that are not the current v2 package scripts (`projects/domainspec-v2/impl/governance/tags/README.md:26-52`).

**Consequence:** operators cannot reliably infer the supported path from documentation.

## Failure and degradation paths

| Path                                      | Current behavior                                                           | Status                                               |
| ----------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------- |
| Unknown/unformalized meta-type            | Silently skipped                                                           | **FAIL**                                             |
| Missing Concept Registry                  | Silently skipped                                                           | **FAIL**                                             |
| Missing aspect document                   | Accepted; partial graph derived                                            | **FAIL unless release profile declares it optional** |
| Unparseable Formal expression             | `needs_formal`; lint fails when the relevant corpus is actually linted     | **PASS mechanism / FAIL corpus**                     |
| No binding sidecar                        | Emits all `it.todo`, exits 0                                               | **FAIL as release evidence**                         |
| Partial binding coverage                  | Emits `it.skip` gaps, exits 0                                              | **FAIL without threshold**                           |
| Stale ID/spec region                      | Read-only check fails closed                                               | **PASS**                                             |
| Deliberate roundtrip mutation             | Negative control detects it                                                | **PASS**                                             |
| Bad relationship endpoint/direction       | Validator rejects it                                                       | **PASS**                                             |
| Write outside lexical root/public Arcanum | Containment guard rejects it                                               | **PASS — narrow**                                    |
| Symlink escape or concurrent write        | No demonstrated protection                                                 | **UNKNOWN / ABSENT**                                 |
| Interrupted id-map/spec write             | No atomic pair or recovery protocol                                        | **ABSENT**                                           |
| Malformed binding JSON                    | Cast/read without runtime schema; likely uncaught error or unsafe defaults | **FAIL**                                             |
| Installed package execution               | Authority and compiled/runtime boundary missing                            | **FAIL**                                             |
| CI enforcement                            | No v2 workflow                                                             | **ABSENT**                                           |
| Runtime/tool observability                | Human console output; isolated JSON modes only                             | **ABSENT as operational telemetry**                  |

## Production-domain coverage

| Production domain                               | Status                        | Empirical judgment                                                                                                                                                  |
| ----------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core deterministic derivation                   | **PASS — bounded**            | Strong unit, roundtrip, drift, and negative-control evidence on narrow corpora.                                                                                     |
| Full language validation                        | **FAIL**                      | UI formation deferred; unknown types and some malformed surfaces skip silently.                                                                                     |
| Representative-corpus compatibility             | **FAIL**                      | Direct lint produces 1 and 47 formal-language gaps.                                                                                                                 |
| Installation reproducibility                    | **NOT RUN**                   | Lock resolution dry-run passed; no clean isolated install was executed.                                                                                             |
| Build artifact                                  | **ABSENT**                    | Engine has a build script, but no aggregate build/release artifact or committed dist; build was not run because it writes output.                                   |
| Distribution/package usability                  | **FAIL**                      | Tarball lacks authority, runtime boundary, stable CLI/library exports, and package curation.                                                                        |
| CI and merge protection                         | **ABSENT**                    | G4 deferred; root workflow targets v1.                                                                                                                              |
| Release/version management                      | **ABSENT**                    | No release workflow, supported version policy, changelog for product, release notes, or rollback channel.                                                           |
| Configuration contract                          | **FAIL**                      | Binding sidecars lack runtime schema validation; repository paths are implicit configuration.                                                                       |
| Persistent state integrity                      | **FAIL**                      | Deterministic maps exist, but writes are non-atomic and unlocked.                                                                                                   |
| Diagnostics                                     | **PASS — local**              | Commands generally emit actionable counts, files, verdicts, and distinct exit codes.                                                                                |
| Operational observability                       | **ABSENT**                    | No structured invocation telemetry, health metrics, or operator monitoring for the tool itself.                                                                     |
| Recovery/rollback                               | **ABSENT**                    | Git/regeneration can plausibly recover state, but no tested recovery procedure exists.                                                                              |
| Security boundary                               | **UNKNOWN / partial PASS**    | Private/no-network derivation and containment reduce exposure; no threat model, symlink analysis, artifact signing, SBOM, or full dependency audit is demonstrated. |
| Compatibility matrix                            | **ABSENT**                    | No declared Node/OS/package-manager matrix or CI matrix.                                                                                                            |
| Performance/capacity                            | **UNKNOWN**                   | No benchmarks, large-corpus tests, memory limits, or latency budgets.                                                                                               |
| Service deployment, availability, auth, backups | **ABSENT but non-applicable** | No service runtime exists. Do not require service hardening unless the release form changes.                                                                        |
| Operator/user support                           | **ABSENT**                    | No install/upgrade/troubleshooting/support contract for a production consumer.                                                                                      |
| Release-candidate reproducibility               | **FAIL**                      | Current evidence comes from a 110-entry dirty target snapshot.                                                                                                      |

## Runtime-derived minimum production boundary

The strictest justified route that avoids irrelevant service hardening is:

1. Declare first release as a **private, repo-local backend-core CLI/toolchain**, unless a broader distribution decision is made.
2. Freeze an explicit backend release profile: supported meta-types, required document set, commands, allowed coverage gaps, supported Node/package-manager versions, and trust assumptions.
3. Make all excluded or unsupported surfaces visible and fail closed; no silent meta-type, registry, or document omission.
4. Build one aggregate release gate covering validation, engine/tag tests, both typechecks, instances, non-collapse, roundtrip/self-check/drift, representative-corpus lint, and deliberate red controls.
5. Run that gate in v2 CI on a clean commit.
6. Choose and prove a real distribution boundary. For an npm/standalone release, include authority, compiled code, a stable CLI, runtime dependencies, curated files, clean-install smoke test, and consumer fixture.
7. Make generated-state writes atomic and collision-safe; add a bounded recovery test.
8. Close or explicitly exclude incomplete migration surfaces. The active drift-engine blocker (`projects/domainspec-v2/.craft/ledger.yml:645-655`) blocks any release claiming drift-governance execution, while L2 cryptographic attestation (`:657-665`) should not block a backend CLI unless the release contract explicitly promises attested governance.
9. Cut the release from a clean, versioned snapshot and preserve command receipts.

This route is strict on the actual product contract and avoids hosted-service hardening, multi-region availability, user authentication, databases, and infrastructure recovery unless DomainSpec v2 is intentionally redefined as a service.

<oai-mem-citation>
<citation_entries>
MEMORY.md:139-145|note=[located the scoped DomainSpec v2 ledger and prior validated command surface before live verification]
</citation_entries>
<rollout_ids>
019f4568-399c-7501-b5be-ec51452a3bea
</rollout_ids>
</oai-mem-citation>

## Agent 3 — dependency, blocker, and critical-path cartography

# Constraint Cartography — DomainSpec v2 First Production Release

## Executive constraint

The binding constraint is not another validator defect. It is the absence of a release contract.

DomainSpec v2 can already support a bounded private **deterministic spec-validation and test-derivation toolkit**: parse authored feature packs, validate the 13 active backend meta-types and 30 relationship signatures, derive obligations, and emit test specifications. It cannot honestly release the broader intent→generated-code→runtime-drift→Saturn convergence loop: code-patterns remain prose, no consumer generates code, code tagging is not exercised on v2 product code, drift trend is not implemented, and Saturn is not a runtime here. [discovery:150-186](projects/domainspec-v2/discovery/domainspec-v2-discovery.md), [discovery:188-228](projects/domainspec-v2/discovery/domainspec-v2-discovery.md)

The first human gate must therefore choose the release form and claims:

1. **Private internal CLI/library toolkit** — shortest defensible path.
2. **Externally distributed private CLI/library** — additionally requires a safe package boundary and install/support contract.
3. **Hosted service** — a new service/runtime/deployment program; no such product substrate exists.
4. **Closed intent→code→drift system** — not a release-hardening route; it requires currently unexecuted product capabilities.

The local authority model itself requires an external owner decision before “release” or production satisfaction can be claimed. [AUTHORITY-MODEL:40-47](projects/domainspec-v2/authority/AUTHORITY-MODEL.md), [AUTHORITY-MODEL:135-147](projects/domainspec-v2/authority/AUTHORITY-MODEL.md)

## Dependency graph

```text
P0 release-form + claim contract
 ├─ choose consumer/operator, environment, distribution, support and exclusions
 └─ external implementation/platform owner accepts release authority
        ↓
P1 establish a releasable baseline
 ├─ finish or deliberately cut the live Saga/R3C/UI streams
 ├─ reconcile 13 backend types / 30 signatures everywhere
 ├─ commit a bounded release candidate from the heavily dirty checkout
 └─ synchronize Craft, manifest, work-packs and receipts
        ↓
P2 make the supported runtime self-contained
 ├─ replace sibling-repository feature resolution
 ├─ select supported feature-root/CLI/API contracts
 ├─ package compiled runtime, declarations and CLI entrypoint
 ├─ exclude private moat and non-product fixtures from any distributed artifact
 └─ clean-checkout / tarball install smoke
        ↓
P3 close the supported v1→v2 migration boundary
 ├─ decide UI: support it, or narrow the first release to backend-only
 ├─ close/reclassify R2/R4/R5/R6/R7 and Batch-2/3 manifest rows
 └─ prove v2 no longer requires v1 or unrelated sibling corpora for supported behavior
        ↓
P4 production gate
 ├─ CI runs build + tests + typecheck + real-pack lint/validation
 ├─ negative controls fail the same gate
 ├─ ≥2 independent real corpora for a general-purpose claim
 └─ package/install/upgrade/reproducibility checks
        ↓
P5 controlled pilot
 ├─ operator follows documented workflow from a clean environment
 ├─ one supported feature goes author→validate→derive→emit
 ├─ failures, diagnostics and recovery are observed
 └─ release claims are corrected to the witnessed boundary
        ↓
P6 release
 ├─ version, changelog, immutable artifact/digest and tag
 ├─ owner approval, rollback and compatibility statement
 └─ post-release frontier registry
```

Hosted-service or closed-loop selections branch after P0 into new architecture work; they cannot reuse P2 as a mere packaging task.

## Blockers and enablers

| Item                                                                                                                                                  | Classification                                         | What it blocks or enables                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Release form, supported actors and claim boundary absent                                                                                              | **Blocker**                                            | Blocks every applicability decision: packaging, deployment, reliability, privacy, support and whether drift/UI/code-tags are release-critical.                                                                                                                                                                                                                                                                          |
| Packages are `0.0.0`, `private: true`; engine `main` points to `src/index.ts`; no `bin`, export map, release script or production dependency contract | **Blocker for distributed artifact**                   | Blocks installable CLI/library and semantic release. [impl package:1-31](projects/domainspec-v2/impl/package.json), [engine package:1-20](projects/domainspec-v2/impl/test-derivation-engine/package.json)                                                                                                                                                                                                              |
| CLI resolves named features into sibling `validation/poker-team`                                                                                      | **Blocker for standalone release**                     | A packaged/isolated install cannot operate by name without this monorepo layout. [cli:68-80](projects/domainspec-v2/impl/test-derivation-engine/src/cli.ts)                                                                                                                                                                                                                                                             |
| Engine tests also consume sibling `validation/poker-team` corpora                                                                                     | **Blocker for standalone build proof**                 | Current 97/97 is green in this checkout, not evidence that the artifact is self-contained.                                                                                                                                                                                                                                                                                                                              |
| `npm pack --dry-run` includes `src/rules` and large fixture corpora while `dist/` is ignored                                                          | **Blocker for public or moat-preserving distribution** | Current tarball exposes the declared private algorithm and omits the compiled build. The moat boundary is explicit. [README:16-20](projects/domainspec-v2/README.md), [IMPORT-MANIFEST:1-20](projects/domainspec-v2/IMPORT-MANIFEST.md)                                                                                                                                                                                 |
| Root CI checks v1 `implementation/domainspec`, not `projects/domainspec-v2`                                                                           | **Blocker**                                            | No protected branch gate proves the v2 release candidate. [.github workflow:1-30](.github/workflows/drift-check.yml)                                                                                                                                                                                                                                                                                                    |
| Aggregate `engine:lint` hardcodes the empty/sample pack                                                                                               | **Blocker**                                            | A green aggregate can miss a bad real feature pack. [impl package:14-30](projects/domainspec-v2/impl/package.json)                                                                                                                                                                                                                                                                                                      |
| Migration manifest remains active with Batch-1/2 reformulation and Batch-3 pending                                                                    | **Blocker to “self-contained v2”**                     | The manifest’s own freeze gate requires all reformulations plus build proof. [IMPORT-MANIFEST:22-55](projects/domainspec-v2/IMPORT-MANIFEST.md), [IMPORT-MANIFEST:71-73](projects/domainspec-v2/IMPORT-MANIFEST.md)                                                                                                                                                                                                     |
| UI authority has zero replicated survivors; repair remains active and cannot promote                                                                  | **Conditional blocker**                                | Blocks a release claiming supported UI meta-type formation; does not block an explicitly backend-only release. [UIF work-pack:20-34](projects/domainspec-v2/development/ui-meta-type-formalization/WORK-PACK.md), [UIF work-pack:60-68](projects/domainspec-v2/development/ui-meta-type-formalization/WORK-PACK.md), [UIF work-pack:98-109](projects/domainspec-v2/development/ui-meta-type-formalization/WORK-PACK.md) |
| Drift engine absent                                                                                                                                   | **Conditional blocker**                                | Blocks drift/convergence claims, not a structural validation/derivation release. [CRAFT:7-11](projects/domainspec-v2/CRAFT.md), [discovery:214-223](projects/domainspec-v2/discovery/domainspec-v2-discovery.md)                                                                                                                                                                                                        |
| L2 cryptographic attestation absent                                                                                                                   | **Conditional blocker**                                | Blocks a cryptographically sealed authority release; does not block an explicitly unsigned, human-approved first release.                                                                                                                                                                                                                                                                                               |
| Semantic classification is mostly author-attestation strength                                                                                         | **Claim blocker**                                      | Blocks “semantic correctness” positioning; permits “checks declared shape and deterministically derives from declared intent” with a human classification gate. [discovery:241-259](projects/domainspec-v2/discovery/domainspec-v2-discovery.md)                                                                                                                                                                        |
| Live core checks are green                                                                                                                            | **Enabler**                                            | On 2026-07-12: aggregate validation passed at 13 schemas/30 signatures/2 specs; tools 69/69, engine 97/97, code-tags 10/10, typecheck and build passed; direct lint of financial-settlement passed.                                                                                                                                                                                                                     |
| One real feature pack plus deliberate red exists                                                                                                      | **Enabler**                                            | Proves the node/edge validator is non-vacuous on one owned corpus. [APE work-pack:45-53](projects/domainspec-v2/development/architecture-pattern-enforcement/WORK-PACK.md), [APE work-pack:73-82](projects/domainspec-v2/development/architecture-pattern-enforcement/WORK-PACK.md)                                                                                                                                     |
| R3C-001 now consumes root DS-D8                                                                                                                       | **Enabler with residue**                               | Removes a static-authority fork, but 26 active signatures still lack demonstrated call semantics and R3C-002/003 remain open. [R3C receipt:13-27](projects/domainspec-v2/development/r3-closeout-plan/task-sessions/2026-07-12-swu-r3c-001/TASK-SESSION-RESULT.md), [R3C receipt:47-82](projects/domainspec-v2/development/r3-closeout-plan/task-sessions/2026-07-12-swu-r3c-001/TASK-SESSION-RESULT.md)                |

## Current frontier and critical path

The checkout is ahead of `HEAD` and is not a release candidate: at observation time, `projects/domainspec-v2` had 110 status entries and 361 untracked files, including completed Saga migration, active UI repair and R3C work. `git diff --check` passed, but “green working tree behavior” is not an immutable baseline.

The critical path for the shortest defensible release is:

1. Decide **private backend-only deterministic toolkit** versus a larger form.
2. Freeze the current 13-type/30-signature post-Saga state and reconcile all read models.
3. Close the self-containment defects: sibling paths, compiled/package entrypoints, clean-install smoke, real feature-root selection.
4. Resolve manifest debt by execution or explicit owner-approved exclusion; do not relabel pending imports as complete.
5. Stabilize any externally visible relationship IDs before compatibility begins; R3H’s stable `signature_key` is pre-release-critical if signatures are part of the supported contract. [R3H work-pack:39-47](projects/domainspec-v2/development/r3-l2-relationship-hardening/WORK-PACK.md), [R3H work-pack:62-78](projects/domainspec-v2/development/r3-l2-relationship-hardening/WORK-PACK.md)
6. Wire v2 CI over build, 97 engine tests, tool tests, typecheck, real-pack lint, negative controls, package smoke and two real corpora.
7. Run one clean-environment operator pilot, then version/tag/digest and obtain the external owner release decision.

## Parallelizable work

- Documentation and operator contract: replace the engine README’s stale “L0 skeleton / typed stubs” status with supported commands, inputs, outputs, limitations and recovery. [engine README:23-33](projects/domainspec-v2/impl/test-derivation-engine/README.md)
- Release engineering: versioning, changelog, artifact allowlist, provenance/digest and clean-install harness.
- Second real corpus selection and negative fixtures.
- R3H stable identity/Entity semantics, provided no concurrent DS-D8 mutation overlaps it.
- UI evidence repair may continue independently, but it cannot enter the first release without its separate authority decision.
- Code-tag R3C-002/003 can proceed in parallel if code tags are retained in scope; otherwise mark the subsystem experimental and exclude it from the supported gate.

## Deferrals under the bounded first-release contract

These cannot violate a **backend-only deterministic validation/derivation toolkit** contract because the release must explicitly exclude their behaviors:

- **UI-11 formation:** deferred because zero candidate survived replication; UI inputs are unsupported, not silently accepted.
- **Lane Z/A, code generation and agent-cost experiment:** deferred because the release emits obligations/tests, not application code.
- **Saturn, drift trend and agent⊨spec runtime conformance:** deferred because the release makes no runtime-convergence or correctness claim.
- **Code-tag composability/drift:** defer only if removed from the supported command set; otherwise R3C-002/003 and a real tagged corpus become blockers.
- **L2 attestation:** deferred only for an explicitly unsigned release carrying human owner approval.
- **APE mint, pattern-card inheritance and second-repo propagation:** post-release platform hardening; they do not affect the local artifact if no cross-repository inheritance claim is made.
- **DCB, Alloy/TLA and full category laws:** research/formal-proof frontiers; release must not claim concurrency correctness or formal proof.
- **Compound-domain calibration:** completed evidence work, not runtime functionality.
- **Second corpus:** not deferrable for a general-purpose claim; deferrable only if release is explicitly a single-domain pilot.

## Stale or conflicting plans

- README says v1 “is frozen,” while the active manifest says v2 is not self-contained until all reformulations close. Treat the manifest freeze gate as controlling. [README:76-80](projects/domainspec-v2/README.md), [IMPORT-MANIFEST:71-73](projects/domainspec-v2/IMPORT-MANIFEST.md)
- Several plans still say 14 types/31 signatures; live authority and validation are 13/30 after Saga collapse.
- Craft calls `GAP-DSV2-COMPOSABILITY-ENFORCE` resolved by R0 in one place and active in another. Static authority consumption was resolved; dynamic call-semantics coverage remains open. [CRAFT:7-11](projects/domainspec-v2/CRAFT.md), [CRAFT:25-33](projects/domainspec-v2/CRAFT.md)
- R3H still plans synchronization to deleted `impl/spec/RELATIONSHIPS.md`, conflicting with the no-hand-authored-projection decision.
- The engine README reports stubs although the live engine builds and passes 97 tests.
- Craft does not yet present the active UI repair and completed calibration generations as first-class current-state contexts; roadmap synthesis must not infer frontier solely from Craft.

The strict route is therefore: **decide and freeze a narrow production contract, make that artifact independently installable and continuously gated, prove it on more than the inherited monorepo layout, and refuse every broader claim until its frontier produces evidence.**

## Agent 4 — technical production-control applicability frontier

# Technical production-frontier return — Landauer lens

## Adjudication

No production release can currently be declared because the release contract itself is unresolved. The strictest evidence-supported candidate is a **private, repository-local, backend-only Node/TypeScript CLI/toolchain for authorized internal authors and maintainers**. Hosted service, npm product, stable SDK, public derivative, UI, and full Saturn-style convergence system are separate conditional branches.

This is not semantics: the authority delegates release identity and conformance to an external owner rather than defining them (`projects/domainspec-v2/authority/AUTHORITY-MODEL.md:19-31,40-47,54-64,133-147`). Therefore the first gate is:

> **P0 — `research-needed`:** decide release identity/version, delivery form, actors, supported environment, support boundary, backend/UI boundary, and bounded-toolchain versus full-discipline claim.

Until P0 closes, controls below are conditional requirements, not a compliance claim. NIST explicitly describes SSDF as outcome-based and risk-aligned, so adopting every implementation example is neither required nor justified ([NIST SP 800-218](https://csrc.nist.gov/pubs/sp/800/218/final)).

Current positive evidence is narrow but material: the cartographer runs report 97/97 engine tests, 69 tool tests, two successful typechecks, instance/non-collapse checks, and narrow round-trip/self-check/drift proofs. It is not yet release evidence because the aggregate validator omits several suites and negative controls, real-corpus lint still returns 48 `needs_formal` results, CI targets v1, and the inspected working state was dirty.

## Complete control map

| Frontier                                 | Authority/source                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Applicability and current evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Omission consequence                                                                                                                                                                 | Minimum sufficient first-release proof and classification                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Architecture and dependency boundary** | [OpenSSF OSPS Baseline](https://baseline.openssf.org/versions/2026-02-19.html) DO-06, DO-07, SA-01, SA-02; [npm lock/install behavior](https://docs.npmjs.com/cli/install/)                                                                                                                                                                                                                                                                                           | Required for every viable form. DomainSpec is currently a structured-intent discipline, not one settled deployable (`cyberAlchemy/agentic-system-deep-dive.md:148-173`); its own map distinguishes built from designed controls (`projects/framework-unification/CONCEPT-MAP.md:172-180`).                                                                                                                                                                                                                                                                                                                                                                          | Consumers cannot know what is released, which files are runtime dependencies, or whether a passing checkout corresponds to the supported product.                                    | Freeze one architecture manifest: actors, entrypoints, trust/data boundaries, runtime files, external commands, Node/npm/OS support, dependency ownership, and explicitly excluded surfaces. Verify every declared dependency from a clean checkout. **`required-first-release`**.                                                                                                                                                                                                                                                                                                                              |
| **Correctness and testing**              | [NIST SSDF](https://csrc.nist.gov/pubs/sp/800/218/final), especially PW.8/PW.9; [OpenSSF OSPS](https://baseline.openssf.org/versions/2026-02-19.html) QA-06                                                                                                                                                                                                                                                                                                           | Directly applicable because the product’s value is validation and test derivation. Current validation can pass with zero targets and skip missing registries/columns/unknown meta-types (`implementation/domainspec/projects/domainspec-v2/implementation/tools/validate-content.ts:74-78,99-119`); missing aspect documents are accepted (`implementation/domainspec/projects/domainspec-v2/implementation/engine/src/grammar/index.ts:934-940`); generated tests may contain only `todo`/`skip` and exit successfully (`implementation/domainspec/projects/domainspec-v2/implementation/engine/src/emit/tests.ts:13-21,71-90,114-121`; `.../src/cli.ts:353-393`). | False-green validation is worse than an ordinary defect: it converts absent proof into a production-readiness claim.                                                                 | One v2 release command must run typechecks, engine/tools/tag tests, instance/non-collapse, retired-reference, round-trip/self-check/drift, representative real corpora, and deliberate red controls. It must fail on zero targets, missing required registries/aspects, unsupported schema kinds, unresolved `needs_formal`, and test output without executable assertions unless an explicit policy allows it. **`required-first-release`**.                                                                                                                                                                   |
| **Security design and privacy boundary** | [NIST SSDF](https://csrc.nist.gov/projects/ssdf); [NIST Privacy Framework](https://www.nist.gov/privacy-framework) and its [inventory/risk categories](https://www.nist.gov/privacy-framework/resource-repository/browse/guidelines-and-tools)                                                                                                                                                                                                                        | The CLI reads and rewrites potentially private domain artifacts and currently risks packaging private implementation/moat material. The architecture explicitly requires private/public separation (`ops/development/2026-06-21-paper-saturn-explainer/SATURN-LAYER-MAP.md:131-147`). No evidence establishes collection of personal data or network telemetry.                                                                                                                                                                                                                                                                                                     | Private material can cross a distribution boundary; malformed input or symlink/path behavior can alter unintended files; an invented privacy claim could conceal unknown processing. | Produce a bounded threat/data-flow assessment covering inputs, outputs, subprocesses, filesystem permissions, path/symlink escape, untrusted corpus content, package contents, telemetry, and public/private boundary. Record either the personal-data inventory and controls or evidence that the baseline CLI performs no collection/transmission. No regulatory certification is implied. **`required-first-release`** for assessment and scrub; hosted/privacy-program controls are **`non-applicable`** unless P0 adds data processing.                                                                    |
| **Software supply chain**                | [SLSA v1.2](https://slsa.dev/spec/v1.2/levels); [OpenSSF OSPS](https://baseline.openssf.org/versions/2026-02-19.html) BR controls; [GitHub dependency graph](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-graph-data); [GitHub action pinning](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository) | Applicable because Node dependencies, CI actions, and release assets are executable inputs. Cartographer packaging found private `0.0.0` packages, no stable executable/export surface, source-heavy output, omitted root definitions, development-dependency reliance, and sibling-path coupling.                                                                                                                                                                                                                                                                                                                                                                  | The release may differ from tested source, acquire vulnerable/malicious dependencies, leak private files, or be impossible to reconstruct.                                           | Commit a synchronized lockfile; use frozen clean install; inventory direct/transitive dependencies and licenses; review unresolved critical/high vulnerabilities with applicability evidence; pin CI actions to immutable SHAs; define exact included/excluded release files; release from one reviewed commit/tag with digest. A generated SBOM is **`required-first-release` only for a distributed package/binary**, otherwise **`deferred-hardening`**. SLSA Build L2/L3 and broad signed-attestation claims are **`deferred-hardening`**; unique source/digest provenance is **`required-first-release`**. |
| **Configuration and secrets**            | [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html); [GitHub Actions security](https://docs.github.com/en/actions/concepts/security)                                                                                                                                                                                                                                                                       | Baseline CLI should require no long-lived runtime secret; publishing or hosted forms do. Configuration still affects roots, registries, output paths, and validation policy.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | A leaked token compromises source/release channels; ambiguous defaults cause nondeterministic or unsafe writes.                                                                      | Secret scan over source, history considered for release scope, fixture corpus, logs, and packed artifact; CI/release credentials short-lived and least-privilege; configuration reference with safe defaults, validation, precedence, and redacted diagnostics; test invalid/missing configuration. **`required-first-release`**. A dedicated secret-management service is **`non-applicable`** to a no-secret local CLI.                                                                                                                                                                                       |
| **Data, state, and migration**           | [Node filesystem API](https://nodejs.org/api/fs.html); [POSIX atomic rename](https://pubs.opengroup.org/onlinepubs/9799919799/functions/rename.html)                                                                                                                                                                                                                                                                                                                  | Directly applicable: derive writes the ID map and generated spec independently; emit-tests overwrites targets. No locking, atomic multi-artifact commit, rollback, collision, interruption, or symlink-containment proof exists. Stable IDs/tombstones and lexical containment are positive foundations. The migration manifest and freeze gate remain active.                                                                                                                                                                                                                                                                                                      | Crash/concurrency can leave mixed generations; overwrite can destroy user work; path tricks can escape the intended root; old state may be silently misread.                         | Version every persisted format; close or explicitly exclude the active migration; validate before mutation; stage output then rename within one filesystem; reject symlink/root escape and collisions; define concurrent-run behavior; test interruption between writes, stale IDs/tombstones, old-version input, partial migration, and rerun idempotence. If two files must move together, add a journal/transaction marker and recovery command. **`required-first-release`**.                                                                                                                               |
| **Backup and recovery**                  | [NIST contingency-planning definition](https://csrc.nist.gov/topics/security-and-privacy/security-programs-and-operations/contingency-planning)                                                                                                                                                                                                                                                                                                                       | A hosted backup system is not applicable to the candidate CLI, but mutation recovery is. Git protects committed inputs, not uncommitted authored files overwritten by the tool.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | A successful command can cause unrecoverable local data loss even when the product itself remains available.                                                                         | Document recovery scope; preserve or refuse dirty/untracked overwrite unless explicitly forced; prove restoration from staged/backup output or version control; run a destructive-failure recovery fixture. **`required-first-release`** for CLI mutation recovery. Scheduled service backups, RPO/RTO, and restore drills are **`non-applicable`** unless hosted state is selected.                                                                                                                                                                                                                            |
| **Reliability and degradation**          | [Node process/exit semantics](https://nodejs.org/api/process.html); [NIST SSDF](https://csrc.nist.gov/pubs/sp/800/218/final)                                                                                                                                                                                                                                                                                                                                          | Applicable as deterministic batch reliability, not high availability. Existing fail-open and partial-write paths violate that contract.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Automation treats incomplete results as success; callers cannot distinguish validation failure, usage error, internal failure, or partial mutation.                                  | Specify exit codes and machine-readable outcome schema; no validation target is an error; warnings cannot satisfy required gates; errors name affected artifacts and leave recoverable state; prove deterministic results across reruns and failure injection. **`required-first-release`**. HA, multi-zone, and graceful network partition handling are **`non-applicable`**.                                                                                                                                                                                                                                  |
| **Performance and capacity**             | [Node supported-release policy](https://nodejs.org/en/about/previous-releases); service-only reference: [Google SRE SLO guidance](https://sre.google/sre-book/service-level-objectives/)                                                                                                                                                                                                                                                                              | No evidence justifies service load engineering. A local validator still needs a bounded supported corpus envelope so “production” does not mean “worked on one fixture.”                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Large or cyclic corpora may hang, exhaust memory, or silently exceed operator expectations.                                                                                          | P0 names supported corpus-size/shape. Run timed CPU/memory smoke tests on smallest, representative, and declared-upper-bound corpora, including adversarial graph depth/cycles; fail with diagnostics rather than hang or corrupt output. **`required-first-release`** for a bounded envelope. Optimization, concurrency, distributed load tests, autoscaling, and SLO capacity planning are **`deferred-hardening`** or hosted-only.                                                                                                                                                                           |
| **Observability and diagnostics**        | [OpenTelemetry CLI conventions](https://opentelemetry.io/docs/specs/semconv/cli/cli-spans/); [CI/CD log conventions](https://opentelemetry.io/docs/specs/semconv/cicd/cicd-logs/)                                                                                                                                                                                                                                                                                     | The toolchain already has typed signal concepts, but the architecture map says the central observability producer is designed/not built (`projects/framework-unification/CONCEPT-MAP.md:172-180`). That absence blocks a full convergence-system claim, not a bounded CLI.                                                                                                                                                                                                                                                                                                                                                                                          | Operators cannot explain a failure, correlate a generated file with inputs/version, or distinguish skipped from passed checks.                                                       | Human-readable stderr plus stable JSON result containing tool version, command, input identities/digests, checks run/skipped, counts, verdict, durations, changed outputs, and failure reason; redact content/secrets; CI retains the release-gate result. **`required-first-release`**. Central telemetry backend, distributed traces, dashboards, and full Saturn feedback producer are **`deferred-hardening`** or **`non-applicable`** to the bounded CLI.                                                                                                                                                  |
| **Incident and vulnerability response**  | [NIST SP 800-61 Rev.3](https://csrc.nist.gov/Projects/incident-response); [OpenSSF OSPS](https://baseline.openssf.org/versions/2026-02-19.html) VM-01/03/04                                                                                                                                                                                                                                                                                                           | Even an internal release can corrupt artifacts, leak private material, or ship a vulnerable dependency. Public coordinated-disclosure machinery is proportional to distribution, not automatically required.                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Defects persist without an owner, containment route, affected-version decision, or patched release path.                                                                             | Name release/security owner, private reporting channel, severity/triage rule, containment and revoke procedure, affected-version analysis, advisory/release-note route, and evidence retention. Exercise one tabletop for leaked package content or corrupting generation. **`required-first-release`**. Public CVD policy is **`required-first-release` only for public or external distribution**; 24/7 on-call is **`non-applicable`** absent a service/SLO.                                                                                                                                                 |
| **Rollback**                             | [GitHub immutable releases](https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases); [Semantic Versioning](https://semver.org/)                                                                                                                                                                                                                                                                                                   | Required at two levels: undo generated-file mutation and revert the released tool version. Current state has neither proven mutation rollback nor immutable release identity.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | A bad version cannot be safely withdrawn or compared, and users cannot recover modified artifacts.                                                                                   | Publish from an immutable tag/commit with digest; retain previous known-good version and exact install/run command; document revert versus forward-fix; prove old-version reinstall and data/output recovery; prevent tag/asset replacement. **`required-first-release`**. Canary/blue-green rollback is hosted-only.                                                                                                                                                                                                                                                                                           |
| **Deployment and operator acceptance**   | [GitHub releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases); conditional npm source: [npm provenance](https://docs.npmjs.com/generating-provenance-statements/)                                                                                                                                                                                                                                                            | Candidate “deployment” is installation into a clean authorized checkout, not server rollout. Cartographer evidence says the packed artifact is neither self-contained nor equivalent to tested source.                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Maintainer checkout state masks missing runtime files, undeclared dependencies, or sibling-path coupling.                                                                            | From a fresh clone/environment, install only documented prerequisites, run version/help, execute representative validation and generation, inspect outputs, uninstall/rollback, and repeat by a non-author operator. Gate tag publication on this pilot and owner approval. **`required-first-release`**. Registry publish is conditional; server deployment is **`non-applicable`** to baseline.                                                                                                                                                                                                               |
| **Compatibility and support matrix**     | [Semantic Versioning](https://semver.org/); [Node release policy](https://nodejs.org/en/about/previous-releases)                                                                                                                                                                                                                                                                                                                                                      | Required because schemas, CLI flags, generated tests, IDs/tombstones, and Node behavior form the public interface even in a private release. Node recommends production use only of Active or Maintenance LTS.                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Consumers cannot know whether an upgrade changes validation meaning, invalidates state, or runs on their environment.                                                                | Declare public interface and schema versions; select supported Node LTS line(s), npm version, OS/filesystem assumptions, and corpus profile; test upgrade from the immediately prior supported format plus explicit rejection of unsupported versions; maintain a breaking-change and deprecation rule. **`required-first-release`**. Broad OS/Node coverage and stable SDK compatibility are **`deferred-hardening`** unless promised by P0.                                                                                                                                                                   |
| **Reproducibility**                      | [npm `ci`](https://docs.npmjs.com/cli/commands/npm-ci/); [SLSA v1.2](https://slsa.dev/spec/v1.2/levels); [GitHub artifact attestations](https://docs.github.com/en/actions/concepts/security/artifact-attestations)                                                                                                                                                                                                                                                   | Essential because present green results arise from a dirty maintainer snapshot and packaging omits runtime-required material. `npm ci` enforces manifest/lock agreement and frozen installation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Nobody can prove that the released artifact is the code/tests that passed.                                                                                                           | Two clean environments from the same commit and lock must install, run the same release gate, generate semantically identical deterministic outputs, and identify the same release digest. Record toolchain versions and build command. **`required-first-release`**. Byte-for-byte reproduction, hermetic builds, and SLSA L3 are **`deferred-hardening`** unless a binary/package threat model requires them.                                                                                                                                                                                                 |

## Conditional deltas by release form

### A. Private repository-local CLI — current strict baseline

All `required-first-release` controls above apply, but the following do not block: hosted authentication, TLS, tenancy, service backups, multi-zone availability, autoscaling, distributed tracing, 24/7 on-call, public disclosure infrastructure, npm provenance, full SBOM publication, SLSA L2/L3, UI, full drift engine, code generation, and L2 attestation.

This is the narrowest defensible first production release.

### B. Installable npm package

Add as blockers:

- stable `bin` and/or exports contract;
- compiled/self-contained runtime with no sibling checkout dependency;
- consumer clean-install test;
- exact `files` allowlist and private-content scrub;
- license/notice and package ownership;
- registry publishing authority, 2FA or trusted publishing;
- provenance attestation and package-integrity verification;
- SBOM/license inventory;
- SemVer compatibility suite and uninstall/upgrade proof.

Current cartographer pack evidence fails this branch.

### C. Stable SDK/library

Add API surface ownership, typed exports, import-mode compatibility, API conformance fixtures, documented side effects, deprecation policy, and version-to-schema compatibility. None is currently proven.

### D. Hosted service

This is not a small hardening delta; it introduces a different production system. Add authentication/authorization, tenant isolation, TLS/network boundaries, managed secrets, personal-data and retention assessment, database migrations, encrypted backups with tested restore and RPO/RTO, availability SLOs, capacity/load tests, runtime monitoring/alerting, on-call/incident command, staged deployment, runtime rollback, abuse controls, and dependency/service availability management. These controls remain **`non-applicable`** unless P0 selects a service.

### E. Public derivative

Add explicit promotion authority, namespacing/mapping against public Arcanum’s historical profile, private-source scrub, public license/notice, public build/install documentation, coordinated vulnerability disclosure, support expectations, SBOM/provenance, and immutable public releases. The current architecture says DomainSpec/Saturn framing is intended/private rather than shipped (`ops/development/2026-06-21-paper-saturn-explainer/SATURN-LAYER-MAP.md:120,131-147`), so this branch cannot be inferred from the private release.

### F. Full DomainSpec/Saturn discipline

Migration/UI/code-tag/drift and central observability surfaces cease to be deferrable. The absent drift engine and observability producer then block the claimed convergence loop; the bounded CLI may not advertise those properties.

## Strict release route

The technically strict but non-derailing sequence is:

1. **P0:** freeze the bounded private CLI release contract.
2. Reconcile machine authority and read models to one clean backend baseline.
3. Make runtime/package boundaries self-contained.
4. Make validation and generation fail closed.
5. Make file mutation atomic, contained, recoverable, and migration-aware.
6. Build one exhaustive v2 release gate with representative and negative fixtures.
7. Prove clean installation, deterministic operation, recovery, and bounded performance through a non-author operator pilot.
8. Release one immutable version/tag/digest with compatibility and rollback instructions.
9. Route every excluded frontier into a classified registry entry; reopen it only when release promises, evidence, or failure modes change.

The strongest disagreement I would raise against a product-operability lane is this: documentation, onboarding, and support cannot make the current tool production-ready while validation can succeed vacuously, generated tests can be all skipped, release contents are not self-contained, and mutations lack recovery proof. Those are first-release technical controls because they directly protect the product’s claimed function—not generic hardening.

## Agent 5 — operational and product-release applicability frontier

# Operational and Product Release Frontier — DomainSpec v2

## Verdict

“DomainSpec v2” is presently a discipline, authority model, research program, migration program, and implementation home—not one product with one support boundary. The first production release must therefore name a bounded product slice. Release engineering cannot make the whole intended intent→code→runtime-drift→Saturn system “production” while its product contract and several capabilities remain unresolved.

The shortest defensible production form is:

> **DomainSpec v2 Validation Toolkit 1.0.0:** a private, repository-local, backend-only Node/TypeScript CLI for authorized spec authors and maintainers. It accepts an explicitly supplied canonical feature-pack directory, validates its declared structure and relationships, deterministically derives test obligations/specifications, performs negative/self-checks, and emits bounded outputs. It does not claim semantic correctness, implementation conformance, runtime convergence, UI support, code generation, a stable JavaScript SDK, hosted service behavior, public availability, or automatic promotion.

I use `1.0.0` deliberately for the eventual production target, not for the next snapshot: Semantic Versioning says 1.0.0 defines the supported API, while 0.y.z is unstable development. A release candidate can remain `1.0.0-rc.n`; calling `0.1.0` “production” while declining a compatibility contract would make “production” ceremonial. [SemVer 2.0.0](https://semver.org/)

This form respects the repository’s own authority limit: DomainSpec may type, derive, and validate, but only an external implementation/platform owner can decide that implementation conforms and a release is made. [projects/domainspec-v2/authority/AUTHORITY-MODEL.md:19-31,40-47,54-64,133-147]

## Intended users and operating model

First-release roles should be explicit and minimal:

- **Spec author:** prepares a canonical backend feature pack and corrects reported violations.
- **Toolkit operator:** installs/checks out the approved release, runs validation/derivation, interprets exit status and artifacts, and follows recovery guidance.
- **Toolkit maintainer:** owns defects, compatibility, releases, and support triage.
- **Release authority:** the external implementation/platform owner who accepts the release and its exclusions.
- **DomainSpec owner:** owns language/governance meaning, but does not self-approve implementation conformance.

One person may hold several roles, but the responsibilities cannot disappear. The current authority model already requires the external owner; it also forbids turning a passing derived check into runtime correctness. [projects/domainspec-v2/authority/AUTHORITY-MODEL.md:40-47,54-64,154-162]

## Complete frontier matrix

Classification: **R** = `required-first-release`; **D** = `deferred-hardening`; **N** = `non-applicable`; **Q** = `research-needed`.

| Frontier                                         | Source / precedent and applicability                                                                                                                                                                                                                                                                                                                                                                                                                           | Current evidence and omission consequence                                                                                                                                                                                                                                                                           | Minimum first-release proof                                                                                                                                                                                                                                                                                                                            | Class                                                                                                              |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| **Release identity and claims**                  | SemVer requires a precise public API before versions can communicate compatibility. “Public API” means the interface exposed to consumers, even for private software. [SemVer](https://semver.org/)                                                                                                                                                                                                                                                            | Packages are `0.0.0` and private; no release contract distinguishes the discipline from the toolkit. [projects/domainspec-v2/impl/package.json:1-7; projects/domainspec-v2/impl/test-derivation-engine/package.json:1-8] Without this, every later support, compatibility, and applicability decision is arbitrary. | Owner-approved release contract naming product, version, actors, commands, inputs, outputs, environment, exclusions, and release authority.                                                                                                                                                                                                            | **R**                                                                                                              |
| **Supported capability surface**                 | A usable release must say what tasks it supports, not merely list internal modules.                                                                                                                                                                                                                                                                                                                                                                            | The engine exposes `roundtrip`, `self-check`, `derive`, `check`, `emit-tests`, and `lint`; default behavior and write paths differ. [cli.ts:430-460,179-243,254-334,353-393] Without a supported-command list, users cannot distinguish contract from implementation accident.                                      | One command matrix: purpose, required inputs, outputs, writes, exit codes, examples, and support status. Unsupported/experimental commands fail or are visibly labeled.                                                                                                                                                                                | **R**                                                                                                              |
| **Supported environment**                        | Node says production applications should use Active or Maintenance LTS. As of this research, Node 22 and 24 are LTS; Node 20 is EOL. [Node releases](https://nodejs.org/en/about/previous-releases) npm supports `engines` to declare runtime compatibility. [npm package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#engines)                                                                                                          | Packages declare no `engines`, OS, architecture, or package-manager version; dependencies still use Node 20 type definitions. [impl/package.json:8-12; engine/package.json:15-20] Without a tested floor, “works locally” becomes the support policy.                                                               | Recommended narrow contract: one pinned production runtime, Node 24 LTS + pinned npm, on one named Linux environment; clean CI and pilot there. Other Node/OS combinations explicitly unsupported until tested.                                                                                                                                        | **R**                                                                                                              |
| **Self-contained install and uninstall**         | npm describes a package as a folder/tarball identified by `package.json`; package consumers need a real entrypoint. `bin` installs a CLI and `exports` bounds a module interface. [npm packages](https://docs.npmjs.com/about-packages-and-modules/), [package fields](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#bin)                                                                                                                       | `main` points to TypeScript source; there is no `bin` or `exports`, and named feature resolution falls into a sibling `validation/poker-team` repository. [engine/package.json:1-13; cli.ts:68-80,172-176] A clean consumer cannot reproduce the checkout’s behavior.                                               | From a clean authorized clone/tag: one documented command installs locked dependencies, builds compiled JS, runs the supported CLI without `tsx` or sibling repositories, and one documented removal/cleanup path works.                                                                                                                               | **R**                                                                                                              |
| **Onboarding / quick start**                     | npm recommends a root README containing installation, configuration, and usage instructions. [npm README guidance](https://docs.npmjs.com/about-package-readme-files/)                                                                                                                                                                                                                                                                                         | Current engine README says parser/rules are stubs and instructs `pnpm`, while live metadata uses npm and built functions. [engine/README.md:23-33; impl/package.json:14-30] A new operator would begin with false instructions.                                                                                     | A clean-room quick start completes: install → `--version` → lint known-good → reject known-bad → derive → locate output, without oral assistance.                                                                                                                                                                                                      | **R**                                                                                                              |
| **Reference documentation**                      | SemVer makes the declared API load-bearing; npm README guidance covers installation/configuration/usage.                                                                                                                                                                                                                                                                                                                                                       | No authoritative operator reference was found for command syntax, input contract, output format, exit status, write behavior, or exclusions. The CLI currently encodes these only in source.                                                                                                                        | Versioned CLI reference plus feature-pack input reference, emitted-artifact schema/reference, exit-code table, and explicit non-claims.                                                                                                                                                                                                                | **R**                                                                                                              |
| **Examples and tutorials**                       | Recognizable package practice is a minimal runnable example in the distributed/readable package; npm requires reviewing package contents and testing local installation before publication. [npm publishing guidance](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/)                                                                                                                                                                  | One monorepo corpus and several inherited fixtures are not an onboarding example, and sibling paths hide environmental assumptions. Without examples, documentation can pass review while the workflow is unusable.                                                                                                 | One sanitized minimal green feature pack, one deliberate red pack, expected commands/output, and at least one independent real private corpus. A general-purpose claim requires a second independent corpus; otherwise call the release a single-domain pilot.                                                                                         | **R**                                                                                                              |
| **CLI help, diagnostics, and recovery**          | GNU’s established CLI precedent requires `--help` to explain invocation and exit successfully; it also provides conventions for useful diagnostics. [GNU Coding Standards](https://www.gnu.org/prep/standards/standards.html)                                                                                                                                                                                                                                  | Unknown or absent command returns one terse error; there is no `--help` or `--version`. Some failures offer recovery, while others silently fall back from a path to a sibling feature name. [cli.ts:430-460,172-176,183-199,278-334] Omission causes operator error and makes support depend on source reading.    | `--help`, `--version`, examples, stable/documented exit codes, explicit path-not-found errors, no silent corpus fallback, actionable diagnostics, and recovery for every mutating command. Pilot demonstrates recovery from malformed input, stale id map, and write refusal.                                                                          | **R**                                                                                                              |
| **Write safety and rollback UX**                 | This is product operability, separate from deeper security controls: an operator must know what changes and how to undo it.                                                                                                                                                                                                                                                                                                                                    | `derive --out` writes spec/id-map; `emit-tests` can write through a binding; source contains containment checks and some recovery text. [cli.ts:209-243,293-334,353-393] Without a user contract, safe code can still be used destructively.                                                                        | Default dry/read-only commands; explicit output location; side-by-side or no-clobber behavior; generated-file manifest; Git-based rollback instructions; smoke test proving a failed run leaves prior supported artifacts intact.                                                                                                                      | **R**                                                                                                              |
| **Accessibility**                                | WCAG 2.2 is the current W3C web-content standard, but it does not make a web audit applicable to a text-only CLI. [W3C WCAG overview](https://www.w3.org/WAI/standards-guidelines/wcag/)                                                                                                                                                                                                                                                                       | First-release candidate has no supported UI; UI formation is deferred. The CLI emits plain text and does not presently rely on color. A full WCAG conformance claim would be false scope, but unreadable diagnostics would still exclude operators.                                                                 | CLI and Markdown docs remain keyboard/text usable, do not encode verdict by color alone, use stable headings, and work in a non-color terminal. At least one pilot checks screen-reader/log readability if an intended operator uses assistive technology.                                                                                             | **R** basic CLI accessibility; **N** WCAG conformance audit for CLI; **Q** WCAG 2.2 AA if web/UI becomes supported |
| **Stable interface and compatibility**           | SemVer requires the public API to be declared and maps incompatible changes to major versions. npm `exports` can intentionally prevent accidental module entrypoints. [SemVer](https://semver.org/), [npm `exports`](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#exports)                                                                                                                                                                     | There is no stable API boundary; relationship IDs, feature-pack grammar, commands, exit codes, and emitted formats could all become de facto APIs. Current `main` exposes source without an export contract.                                                                                                        | First release supports **CLI only**, not a JavaScript SDK. Freeze/version command/options, exit meanings, accepted feature-pack profile, relationship identity, and emitted formats. Add contract/golden tests. Keep package internals unexported.                                                                                                     | **R** CLI/input/output compatibility; **N** stable SDK for this form                                               |
| **Upgrade, migration, and rollback**             | SemVer provides change signaling; GitHub releases bind a release to a tag and can carry notes/assets. [GitHub releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)                                                                                                                                                                                                                                                   | v1→v2 manifest remains active, with Batch 1/2 reformulations and Batch 3 pending; its own freeze gate requires reformulation plus green build proof. [IMPORT-MANIFEST.md:22-55,71-73] No consumer upgrade path exists.                                                                                              | Document supported upgrade: previous production tag → new tag, compatibility pre-check, regenerate/compare outputs, rollback to prior immutable tag. Close or owner-exclude every manifest row. If any active v1 consumer exists, provide a tested manual migration guide and sample; no automatic migrator is required absent evidence.               | **R** upgrade/rollback; **Q** v1 consumer migration until users are identified                                     |
| **Deprecation**                                  | SemVer recommends documenting deprecation, issuing a minor release, and preserving at least one transition release before major removal; npm can mark package versions deprecated if registry-distributed. [SemVer deprecation guidance](https://semver.org/), [npm deprecation](https://docs.npmjs.com/deprecating-and-undeprecating-packages-or-package-versions/)                                                                                           | No compatibility lifecycle exists. Without one, a stable first release immediately creates unmanaged obligations.                                                                                                                                                                                                   | One-page policy: supported major line, how warnings are communicated, minimum transition window expressed in releases, breaking-change approval, and emergency exception. Implement warnings when the first deprecation occurs, not preemptively.                                                                                                      | **R** policy; **D** runtime mechanism until needed                                                                 |
| **Release notes and immutable release evidence** | GitHub releases are tag-based software iterations with notes and assets; generated notes must still be checked for inclusion/exclusion. Immutable releases allow assets before publication. [GitHub release management](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository), [generated notes](https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes) | Current green behavior is not tied to a clean immutable release. No changelog/release artifact surfaced in the targeted product tree.                                                                                                                                                                               | Release candidate SHA; version; tag; CI receipt; artifact digest/manifest; human-written supported changes, breaking changes, migrations, known issues, exclusions, and rollback; external-owner approval. Generated PR lists are supplementary, not the release contract.                                                                             | **R**                                                                                                              |
| **Distribution and package contents**            | npm’s `files` allowlist determines tarball contents; omission defaults broadly. npm recommends reviewing sensitive/unnecessary content and testing local installation. [npm `files`](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#files), [npm publishing](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/)                                                                                                             | The private moat is explicitly `src/rules`, never public; current package metadata has no distribution allowlist and points at source. [domainspec-v2/README.md:14-20,76-82; IMPORT-MANIFEST.md:1-20]                                                                                                               | For repo-local release, distribute by authorized private tag/checkout plus digest; no registry required. Build an explicit artifact allowlist and inspect it in CI even if it remains internal.                                                                                                                                                        | **R** private artifact inspection; **N** npm publication for repo-local form                                       |
| **License and usage authority**                  | npm recommends a SPDX license or `UNLICENSED`; for private unpublished software, `UNLICENSED` plus `private:true` prevents an accidental grant/publication. [npm license field](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#license)                                                                                                                                                                                                          | Packages are private but declare no license/usage posture. The moat/public boundary is explicit, but “private” alone does not tell operators what redistribution is permitted.                                                                                                                                      | Owner/legal decision recorded as internal/proprietary usage; package metadata `license: "UNLICENSED"` if that is the decision; third-party notices/dependency license review; distribution instructions forbid public redistribution.                                                                                                                  | **R**                                                                                                              |
| **Support and ownership**                        | GitHub recognizes `SUPPORT.md` as a discoverable support contract and `CONTRIBUTING.md` when external contributions are accepted. [support resources](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-support-resources-to-your-project), [contribution guidance](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors)     | Repository ownership exists conceptually, but no operator-facing channel, severity model, response expectation, or support-version list surfaced. Without it, “production” means users inherit the maintainer’s availability.                                                                                       | `SUPPORT.md` or private equivalent naming maintainer, channel, supported version/environment, severity, best-effort response expectation, safe diagnostic bundle, escalation, and end-of-support authority. No 24×7 SLA is needed for this local CLI.                                                                                                  | **R** support contract; **N** public contribution guide unless contributions are invited                           |
| **Feedback and adoption validation**             | GOV.UK’s authoritative beta guidance says test end-to-end with likely users, including tools, support and offline steps, and use support evidence to find problems. This is a useful precedent, not a claim that government-service rules bind this tool. [user research in beta](https://www.gov.uk/service-manual/user-research/user-research-in-beta)                                                                                                       | No clean consumer/operator pilot or support evidence exists. Tests prove code behavior, not that an authorized user can install, interpret, recover, and decide.                                                                                                                                                    | At least one non-author operator completes the clean-room workflow unaided; if spec-author and operator tasks differ, observe both roles. Capture task completion, assistance, ambiguous diagnostics, recovery, support contact, version/environment, and redacted feedback. Correct release claims from witnessed results before approval.            | **R**                                                                                                              |
| **Localization**                                 | Applicability depends on actual users; no external rule supports inventing languages.                                                                                                                                                                                                                                                                                                                                                                          | Current docs/CLI are English and intended users are not ratified. Translation work before user identification is speculative hardening.                                                                                                                                                                             | Release contract states supported language. English-only is acceptable if every intended first-release operator can use it; reopen upon user evidence.                                                                                                                                                                                                 | **Q** until users ratified; then likely **N** for first release                                                    |
| **Release cadence and hotfixing**                | GitHub release/tag practice supports on-demand iterations; no precedent requires a release train for a small internal CLI.                                                                                                                                                                                                                                                                                                                                     | No release checklist, cadence, or emergency repair path exists.                                                                                                                                                                                                                                                     | On-demand release policy, one checklist, release approver, RC/pilot stage, patch/hotfix path, and rollback to prior tag. A fixed train and multiple channels are unnecessary.                                                                                                                                                                          | **R** minimal process; **D** automated trains/channels                                                             |
| **Persistent frontier intake**                   | DomainSpec’s own system thesis requires evidence to return into governance; observations are not automatically authority. [cyberAlchemy/agentic-system-deep-dive.md:661-747]                                                                                                                                                                                                                                                                                   | The product has ledgers/research towers but no release-facing frontier registry joining user evidence to product decisions. Without it, post-release gaps either vanish or become policy by anecdote.                                                                                                               | A frontier record with source, affected version/role/contract, reproducibility, severity, classification, owner, decision gate, roadmap dependency, and reopen condition. Triggers: support incident, new corpus, compatibility break, new OS/Node request, repeated diagnostic confusion, public/extracted distribution request, or new release form. | **R**                                                                                                              |

## Conditional deltas by release form

### A. Recommended: private repository-local CLI

Required: the full **R** set above. Support one pinned LTS/Linux environment, private tag/checkout, compiled CLI, no SDK, no hosted availability promise, manual support, and one witnessed operator pilot. This is strict because every control protects an actual consumer contract; it does not build a platform prematurely.

Explicitly non-applicable for this form:

- account creation, multi-tenancy, authentication/authorization service, billing, quotas, and commercial terms;
- service uptime SLO, paging/on-call, load/capacity planning, database backup/restore, region failover, and disaster recovery;
- browser WCAG conformance, mobile/responsive design, SEO, marketing site, and app-store distribution;
- public community governance, public npm discoverability, public package provenance badge, and open-source license;
- stable JavaScript SDK;
- automatic analytics/telemetry collection. A manual, privacy-safe pilot and support log are sufficient.

### B. Extracted private CLI/npm package

Adds blockers before release:

- private organization scope/registry, access/credential and revocation procedure;
- `bin`, `files`, compiled `dist`, supported `engines`, install/uninstall, and tarball allowlist;
- clean `npm pack` → install → run → upgrade smoke outside the monorepo;
- package ownership continuity and publication authority;
- dependency/runtime contract and registry outage/install-cache policy;
- package provenance if published through a supported CI path. npm documents private organization-scoped publication and provenance support. [private scoped packages](https://docs.npmjs.com/creating-and-publishing-an-organization-scoped-package/), [npm provenance](https://docs.npmjs.com/generating-provenance-statements/)

This is **Q**, not the default; no consumer need currently justifies the additional distribution surface.

### C. Public derivative

A separate product/promotion program, not a packaging toggle. It requires:

- approved public product name, audience, claims, license, contribution/support model, security contact, and compatibility promise;
- private-moat scrub plus artifact inspection proving no private source, paths, corpora, or authority prose crossed the boundary;
- mapping/namespacing against public Arcanum’s distinct vocabulary;
- public install documentation, broader platform matrix, public issue/feedback governance, and WCAG 2.2 AA for any web UI/docs surface where applicable.

Until those decisions and proofs exist: **non-applicable to first release** and **research-needed as a future form**.

### D. Hosted service

This is a new architecture and operations program: identity/access, tenancy, API contract, deployment, environments, secrets, data classification/retention, observability, SLOs, incident response, backups/restore, capacity, abuse controls, support/on-call, privacy/legal terms, and service accessibility. None is made applicable merely by wanting the word “production.” Hosted service must branch to a new governed design after P0; it is not first-release hardening.

### E. Full intent→code→runtime-drift/Saturn system or supported UI

These require capabilities the current bounded toolkit does not provide. The honest route is product discovery and implementation evidence, not release polish. UI triggers WCAG and user-interaction validation; the closed loop triggers runtime integration, implementation-authority witnesses, trend evidence, and correction governance. Both remain **research-needed** and excluded from first-release claims.

## Release acceptance journey

The operational release gate should be witnessed in this order:

1. External owner approves the bounded contract and exclusions.
2. A clean immutable candidate is installed on the declared LTS/Linux environment.
3. `--help` and `--version` identify the exact release.
4. Operator validates the green example and a real private corpus.
5. Red example and self-check fail for the expected reason and exit code.
6. Operator derives/emits artifacts, can identify every write, and recovers from one induced failure.
7. Compatibility/golden checks prove the declared CLI/input/output contract.
8. Upgrade rehearsal moves from the previous RC to the candidate and rolls back.
9. Support contact and redacted diagnostic bundle are exercised.
10. Release notes, digest, known limitations, CI receipt, pilot receipt, and owner approval are attached to the tag.

The key disagreement I would preserve against infrastructure-heavy interpretations is this: supply-chain, CI, security, and reliability controls can make an artifact well-controlled, but they cannot make it installable, understandable, supportable, or truthfully positioned. Conversely, polished docs cannot rescue a non-self-contained artifact. Both lanes converge only at the clean operator witness.

## Connections

- `derives` → [`./findings.md`](./findings.md)
