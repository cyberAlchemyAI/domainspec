---
amendment_id: 2026-06-09-add-experiment-node-type
date: 2026-06-09
schema_document: vault/ontology-conventions.md
change_type: schema_version_bump
old_version: 2.3.0
new_version: 2.4.0
trigger:
  session: null
  discovery: vault/discovery/system-modeling-partition-architecture/discovery.md
  falsified_premise: null
dependents:
  - vault_common.frontmatter.NodeType (Literal)
  - vault_common.frontmatter.ExperimentFrontmatter (new subclass)
  - vault_common.frontmatter._FRONTMATTER_BY_TYPE / KNOWN_NODE_TYPES
  - internal_tools/tests/test_frontmatter.py (count + dispatch + parametrized tests)
  - .claude/skills/partition-scaffold/assets/experiments/ (PROTOCOL.md, _TEMPLATE/PROPOSAL.md, validate_proposal.py)
review:
  validator_passed: pending
  snapshot_tag: null
author: victorboscaro
---

# Amendment: add `experiment` to the `node_type` controlled vocabulary

## Why

The `system-modeling-partition-architecture` discovery (Revision 2026-06-09) adopts
an `experiments/` partition — a recording modality, like `sessions/` — that holds
pre-registered, falsifiable experiments ported from the knowledge-taxonomy repo. Those
proposals carry `node_type: experiment`, which the KT port treated as a *project-local*
extension because the canonical vocabulary did not list it (KT's `experiments/PROTOCOL.md`
records exactly this gap and the submodule-edit ban). This amendment **ratifies the
extension upstream** in the framework's own controlled vocabulary so the value is
first-class everywhere, and so the kernel validator stops hard-rejecting it.

`experiment` is epistemically a `premise` (a falsifiable claim evidence updates) but with
an immutable-once-frozen pre-registration contract — a distinct enough challenge response
("run it against the frozen gates; don't edit the gate after the fact") to warrant its own
role rather than reusing `premise`.

## What changed

- `ontology-conventions.md`: `experiment` added to the frontmatter enum (§Required
  Frontmatter), the prose enumeration (sixteen → seventeen), the Appendix B Label Value
  Catalog (new row), and the Appendix D quick reference (16 → 17 values). `version:` bumped
  2.3.0 → 2.4.0; `last_updated:` set to 2026-06-09.
- `vault_common/frontmatter.py` (executable form, governed by
  `frontmatter-ownership-constitution.md`): `experiment` added to the `NodeType` Literal,
  a new `ExperimentFrontmatter` subclass, and registration in `_FRONTMATTER_BY_TYPE`
  (so `KNOWN_NODE_TYPES` becomes the 17-value set).
- `internal_tools/tests/test_frontmatter.py`: `EXPECTED_NODE_TYPES` gains `experiment`;
  the count assertions move 16 → 17; the two count-test names dropped their hard-coded
  "sixteen".

## Migration

**No migration required.** This change is purely additive — a new *optional* enum value.
No previously-valid frontmatter becomes invalid (nothing was using `experiment` and being
rejected; nothing is now forced to adopt it). Per the precedent in
`2026-05-16-add-verification-field.md`, a migration script is authorized but unnecessary
here because there are no existing files to back-fill.

## Dependents — required action

1. `vault_common` validator and tests updated in this same change (see above).
2. The `partition-scaffold` skill's `experiments/` assets already assume
   `node_type: experiment`; they are now consistent with the kernel — no further action.
3. Any cached schema snapshot should be regenerated:
   `vault-ctl validate --strict` after the next snapshot.
