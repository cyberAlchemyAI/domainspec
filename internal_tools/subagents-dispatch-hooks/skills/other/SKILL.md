---
name: other
description: Execute a bounded repository-work dispatch that is not owned by research, review, or experiment. Every mutating lane must have an independent downstream reviewer. Use only after the human confirms the exact targets, allowed mutations, validation, topology, and working folder.
---

# other — bounded execution type

`other` is the LIVE fallback owner for a concrete, executable repository task that does not
fit `research`, `review`, or `experiment`. It is not an alias for the RESERVED `code`, `plan`,
or `suggestion` types and must not bypass a more specific LIVE owner.

Universal dispatch law — trigger, tension, confirmation, registration, scheduling, closeout,
agent-pool admission, and the append-only ledger — remains owned by
`domainspec-subagents-strategy` and `register-dispatch`. This skill owns only the execution
contract below.

## Admission contract

Before the sheet can reach confirmation, its `context` must name:

- the exact repository-relative target files or directories;
- the allowed mutations and explicit exclusions;
- the source-of-truth evidence each implementer must follow;
- the validation commands or deterministic checks;
- the expected durable result and stop conditions.

The sheet must also encode those obligations in `other_contract` so admission
does not depend on prose interpretation:

- `owner_capability` is exactly
  `implementation/domainspec/internal_tools/subagents-dispatch-hooks/skills/other/SKILL.md`;
- `targets` is a non-empty unique list of portable repository-relative paths;
- `allowed_mutations`, `forbidden_mutations`, `validation_commands`, and
  `stop_conditions` are non-empty unique string lists;
- `source_refs` is a non-empty list of current exact `{path, sha256, size}`
  references;
- `expected_result` is one non-empty durable-outcome statement;
- `lanes` is a non-empty list of `{lane_id, writer_group_id,
reviewer_group_id, target_paths, connection_type}` objects, where
  `connection_type` is `sequential` or `zig-zag`.

Every declared target belongs to exactly one lane. Target paths may not overlap
across lanes. Each lane names one singleton pooled `writer` and one distinct
singleton pooled `skeptic`, and its declared writer-to-reviewer edge must exist
in `connections`. A current `other` sheet without this complete machine
contract is not confirmation-ready and cannot be registered.

`working_folder` is required. It stores the dispatch sheet and validation/review receipts; it
does not broaden write authority. A target outside `working_folder` is writable only when it is
named explicitly in the confirmed context.

Use another LIVE type when that owner applies. Use `review` when agents only inspect an existing
artifact and report change requests. Use `other` when the confirmed outcome includes applying a
bounded change.

## Required roles and topology

Each mutating lane has two distinct pooled identities:

1. An implementer with agent role `writer` applies only that lane's confirmed change and reports
   the exact files changed plus validation evidence.
2. A downstream independent reviewer with agent role `skeptic` inspects the resulting diff,
   governing sources, and validation evidence. The reviewer must not review its own work and must
   not silently edit the target.

Connect each implementer to its reviewer with `sequential`, or with `zig-zag` when one bounded
repair turn is explicitly confirmed. Separate lanes that touch the same file run sequentially;
parallel lanes must have disjoint write sets. The final approver is normally `parent`.

The reviewer returns one of:

- `ACCEPT` — the diff stays inside scope, matches its sources, and validation passes;
- `REPAIR` — a concrete in-scope defect can return through an eligible confirmed zig-zag edge
  with remaining capacity;
- `BLOCK` — the defect needs new authority, wider scope, unavailable evidence, or exhausted loop
  capacity.

## Handoff and closure

An implementer-to-reviewer handoff is `ready` only when it includes the exact changed paths, a
diff summary, and the declared validation results. Missing evidence is `needs_feedback` only when
the confirmed edge can return it; otherwise it is `blocked`.

Close `resolved` only when every confirmed change is present, every declared check has a result,
every mutating lane has an independent `ACCEPT`, and the final approver accepts the combined
result. Use `loop_ceiling_reached`, `user_abort`, or `error` when applicable; preserve unresolved
authority or evidence gaps explicitly rather than widening scope.

## Nonexamples

- broad “improve the codebase” work without exact targets or checks;
- using `other` to skip the research, review, or experiment owner;
- one agent implementing and approving the same change;
- two parallel writers editing the same file;
- treating `working_folder` as permission to edit unrelated repository files.
