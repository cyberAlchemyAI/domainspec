---
name: experiment
description: Govern a two-phase falsifiable experiment. Propose freezes a criterion before results exist; run binds that exact criterion, gathers isolated observations, and uses a predeclared parent-mechanical rule to render SURVIVED, FALSIFIED, or INVALID. Routed from domainspec-subagents-strategy for LIVE `dispatch_type: experiment` rows.
---

# experiment — propose, freeze, run, adjudicate

The LIVE type owner for `dispatch_type: experiment`.

Universal dispatch law, human confirmation, approver admission, registration, and closeout remain
owned by `domainspec-subagents-strategy`, `register-dispatch`, and the canonical constitution. This
skill owns only experiment meaning: the two phases, roles, criterion quality, verdict semantics,
and the deterministic-parent adjudication boundary.

## Why experiment is a peer type

An experiment is selected by its grader, not by renamed roles:

| type       | grader                                                            |
| ---------- | ----------------------------------------------------------------- |
| research   | coverage and claim no stronger than proof                         |
| review     | severity and verified attack against an existing artifact         |
| experiment | falsification against a criterion frozen before the result exists |

The load-bearing difference is pre-registration. Research can decide what evidence covers a claim
after investigation. Experiment must freeze the hypothesis, observations, categories, and verdict
rule before any run result exists.

## Monotonic lifecycle

```text
experiment/propose
  -> CRITERION.json validated and its generated CRITERION.md view bound exactly
  -> experiment/run binds that exact proposal closeout
  -> runners produce raw observations
  -> parent applies the frozen mechanical rule
  -> experiment.md + findings.md
  -> SURVIVED | FALSIFIED | INVALID
```

An edit to the frozen criterion is a new proposal. It never inherits an older run confirmation.
An operational failure never fabricates an experimental verdict.

## Required row contract

Every experiment row carries `experiment_contract`. New v0.10.0 proposal rows
bind a machine-first criterion package, execution dispatch/briefings, and
independent pre-freeze obligations. The contract is material strategy: a
phase, proposal identity, criterion digest, output path, adjudication mode, or rule-locator change
requires a new material confirmation.

### Propose

```json
{
  "experiment_contract": {
    "phase": "propose",
    "criterion_output_path": "CRITERION.json",
    "criterion_package": {
      "source_ref": {
        "path": ".../CRITERION.json",
        "sha256": "...",
        "size": 1
      },
      "schema_ref": {
        "path": ".../criterion.schema.json",
        "sha256": "...",
        "size": 1
      },
      "renderer_ref": {
        "path": ".../render_criterion.py",
        "sha256": "...",
        "size": 1
      },
      "generated_view_ref": {
        "path": ".../CRITERION.md",
        "sha256": "...",
        "size": 1
      },
      "protocol_ref": {
        "path": ".../TOURNAMENT-SPEC.md",
        "sha256": "...",
        "size": 1
      },
      "guide_manifest_ref": {
        "path": ".../GUIDE-MANIFEST.json",
        "sha256": "...",
        "size": 1
      },
      "criterion_validator_ref": {
        "path": ".../validate_criterion.py",
        "sha256": "...",
        "size": 1
      },
      "guide_equivalence_validator_ref": {
        "path": ".../verify_guide_equivalence.py",
        "sha256": "...",
        "size": 1
      }
    },
    "execution_dispatch_ref": { "path": "...", "sha256": "...", "size": 1 },
    "execution_briefings_ref": { "path": "...", "sha256": "...", "size": 1 },
    "pre_freeze_obligations": [
      "typed obligation objects owned by singleton independent roles"
    ]
  }
}
```

`criterion_output_path` is relative to `working_folder`. For new proposals it
names the canonical JSON source. The Markdown file is a deterministic view,
never a second authority. The criterion and guide validators are read-only;
their exact refs and results are part of preconfirmation closure.

### Run — accepted D2-A adjudication

```json
{
  "experiment_contract": {
    "phase": "run",
    "proposal_dispatch_id": "2026-08-27-example-propose",
    "criterion_ref": {
      "path": "experiments/example/CRITERION.md",
      "sha256": "<64 lowercase hex characters>",
      "size": 1234
    },
    "experiment_output_path": "experiment.md",
    "findings_output_path": "findings.md",
    "adjudication": {
      "mode": "parent_mechanical",
      "rule_locator": "experiments/example/CRITERION.md#mechanical-verdict-rule"
    }
  }
}
```

Run readiness must prove all of the following before tension or human confirmation:

- `proposal_dispatch_id` names a closed v0.9.0 `experiment/propose` row;
- that proposal closed `resolved` with status `frozen`;
- the run's `criterion_ref` exactly equals the proposal closeout reference;
- current criterion bytes still match the declared SHA-256 and size;
- the criterion and declared run outputs are distinct, repository-contained paths beneath
  `working_folder`;
- `rule_locator` points into that exact criterion and names the already-frozen mechanical rule;
- `final_approver` is `parent` for this parent-mechanical route.

The readiness validator may read the exact referenced ledger rows to prove this lineage. It never
mutates the ledger before confirmation.

## Roles

The existing role enum is sufficient; no experiment-only agent role is added.

| conceptual role        | `agents[].role`                 | phase   | responsibility                                                                  |
| ---------------------- | ------------------------------- | ------- | ------------------------------------------------------------------------------- |
| designer               | `writer`                        | propose | authors the criterion before results exist                                      |
| validity skeptic       | `skeptic`                       | propose | attacks confounds, discrimination, and reproducibility before freeze            |
| runner                 | `explorer`                      | run     | produces one isolated raw observation without adjudicating it                   |
| mechanical adjudicator | parent-owned deterministic step | run     | applies the frozen rule; it is not an agent role and not discretionary approval |

A proposal may use one designer, although a separate skeptic is strongly preferred. Replicated
runs should use singleton explorer groups when trials must receive identical conditions. Do not
invent pairwise disagreement angles between controlled replicates; the experiment compares their
outputs through the frozen scorer.

The deterministic parent step and `final_approver` are separate functions. The first evaluates the
frozen rule without discretion. The latter checks evidence and closeout integrity. Approval cannot
rewrite the criterion or verdict rule.

## Criterion requirements

The criterion is an artifact, not a replacement `success_metric` ledger column. It must pin:

- exactly one falsifiable hypothesis;
- non-goals and the boundary of what is not tested;
- predeclared labels, categories, fixtures, prompts, and isolation rules;
- observable measurements and their exact collection method;
- a mechanical verdict rule mapping observations to `SURVIVED`, `FALSIFIED`, or `INVALID`;
- what each possible verdict would teach;
- confound controls and a reproducibility procedure;
- the exact grader or scorer identity when software performs the mechanical step.

The skeptic rejects a proposal as `invalid` when the criterion is unfalsifiable, non-discriminating,
confounded, or cannot be re-adjudicated from frozen inputs and preserved observations.

## Verdicts and operational status

| value       | phase         | meaning                                                                            |
| ----------- | ------------- | ---------------------------------------------------------------------------------- |
| `frozen`    | propose close | criterion is validity-checked and exactly bound for a later run                    |
| `invalid`   | propose close | design-time validity failed; no run is admitted                                    |
| `SURVIVED`  | run close     | the preserved observations did not meet the frozen falsification condition         |
| `FALSIFIED` | run close     | the preserved observations met the frozen falsification condition                  |
| `INVALID`   | run close     | the run evidence cannot truthfully adjudicate the hypothesis under the frozen rule |

These values never replace execution status. A `SURVIVED` experiment may still have no authority to
publish or promote anything. A command failure closes through `exit_reason` and a non-outcome
experiment status, not through a convenient scientific verdict.

## Closeout contract

A resolved proposal closes with `status: frozen` plus the exact `criterion_ref`, or with
`status: invalid` and no frozen ref. A non-resolved proposal closes `not_frozen`.

A resolved run closes `adjudicated` with the verdict and exact references to the criterion,
`experiment.md`, and `findings.md`. A non-resolved run closes `not_adjudicated` and carries no
verdict or result references.

```json
{
  "experiment_closeout": {
    "phase": "run",
    "status": "adjudicated",
    "verdict": "SURVIVED",
    "criterion_ref": { "path": "...", "sha256": "...", "size": 1234 },
    "experiment_ref": { "path": "...", "sha256": "...", "size": 2345 },
    "findings_ref": { "path": "...", "sha256": "...", "size": 3456 }
  }
}
```

`experiment.md` preserves raw observations and scorer inputs. `findings.md` cites the frozen rule
and those observations, records the mechanical derivation, and ends with one verdict.

## Boundaries

- Runner agents do not execute arbitrary product code. A parent-owned deterministic validator or
  scorer may run only when the criterion froze its identity, inputs, and verdict rule.
- The RESERVED `code` dispatch type remains RESERVED; this contract does not promote it.
- No result grants acceptance, publication, promotion, deployment, or external-effect authority.
- Public experiment artifacts may not disclose DomainSpec-private paths, prose, or evidence.
- The ledger records exact handles and digests, never full subagent transcripts.

## Names

When named agents are used, resolve them from `telemetry/agents/agent-pool.yaml`; never invent or
reuse an identity within a dispatch. A validity skeptic must not be the designer whose criterion it
attacks. Controlled replicate runners may be unnamed (`agent_name: null`) when runtime isolation is
the experimental variable.
