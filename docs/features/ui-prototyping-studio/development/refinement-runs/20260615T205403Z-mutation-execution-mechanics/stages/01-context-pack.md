---
stage: s1-context-pack
owner: context-builder
status: pass
refine_target: mutation-execution-mechanics
project: ui-prototyping-studio
---

# Context Pack: Mutation Execution Mechanics

Grounded evidence baseline for designing the execution model. Every claim below is
sourced from real code at the paths cited. Where a fact comes from the refine prompt's
governance context (decision/invariant IDs not committed as docs in this module), it is
labeled `[governance context]`.

## 0. The Open Question (stated crisply)

> **When an approved MutationBatch is applied, _how_ does the prototype HTML actually
> change?** Today apply is pure bookkeeping — it appends one RevisionManifestEntry and
> flips state, but **nothing edits the prototype HTML**. We must choose an execution model
> (A deterministic patch / B agentic regeneration / C hybrid propose-then-validate) that
> turns a `MutationTask` description into a new prototype HTML artifact, in a Claude
> Code-native runtime, without violating determinism/audit governance or losing the
> `data-od-id` anchor.

## 1. What `ApplyApprovedBatch` Does Today (grounded)

Source: `backend/src/modules/ui-prototyping-studio/application/apply-approved-batch.ts`

`applyApprovedBatch(input)` performs, in order:

1. **AUTO_APPLY_FORBIDDEN** — rejects if `applyRequestedBy` (trimmed, lowercased) ==
   `"system:auto"`. A human-ish actor is required (lines 32–41).
2. **SESSION_NOT_FOUND** — session must exist (43–52).
3. **BASELINE_GATE_UNSATISFIED** — `session.selectionGate === "satisfied"` AND
   `session.baseline` set, else reject (54–64).
4. **BATCH_NOT_FOUND** — batch must exist (66–76).
5. **BATCH_APPROVAL_REQUIRED** — `batch.status === "approved"`, else reject (78–87).
6. **BATCH_STALE_FOR_HEAD** — if `session.revisionHeadId !== null`, the batch's
   `sourceRevisionId` must equal the current head; staleness is rejected (89–102).
7. **Allocates a new revision id** off `parentRevisionId = session.revisionHeadId ?? "rev-0000"`
   via `store.allocateRevisionId` (104–106).
8. **Marks batch applied** (`{...batch, status: "applied"}`) (108–111).
9. **Computes `unresolvedCommentIds`** = comments on `batch.sourceRevisionId` not in
   `batch.generatedFromCommentIds` (113–118).
10. **Builds the RevisionManifestEntry** including `diffSummary` from `buildDiffSummary(batch)`
    (120–131).
11. **Persists**: `saveBatch`, `appendRevision`, `saveSession` (state →
    `"RevisionRecorded"`, `applyGate → "pending"`) (133–142).
12. **VARIANT_GENERATION_COUNT_MISMATCH** — post-check that the manifest grew by **exactly
    one** entry, else throw (144–155). This is the runtime enforcement of the append-only,
    one-entry-per-apply invariant.

**Critical fact:** there is **no HTML mutation engine**. No prototype HTML is read,
transformed, generated, or written anywhere in apply. `htmlArtifactRef` is never touched.
The `MutationTask` `target`, `intent`, `changeType`, `acceptanceText` are used **only** to
count diffs (`buildDiffSummary`, 165–187: `add`→added, `remove`→removed, else→changed) and
to populate `appliedTaskIds`. So "execution" today = **bookkeeping**; the actual prototype
HTML edit is **unspecified** and is exactly what this refine must design.

### `buildDiffSummary` (the only consumer of task semantics)

`DiffSummary` is **counts-only**: it tallies `changeType` across tasks into
`{added, changed, removed}`. It does not reflect any real textual diff of HTML, because no
HTML is produced.

## 2. Exact Schemas (grounded)

Source: `backend/src/modules/ui-prototyping-studio/domain/models.ts`

### `MutationTask` — a DESCRIPTION, not a patch

```ts
interface MutationTask {
  taskId: string; // sha1-derived, deterministic (see §3)
  target: string; // a CSS selector string (from comment.target.selector)
  intent: string; // free-text intent, copied verbatim from the comment
  changeType: string; // "add" | "remove" | "change" (inferred, but typed as string)
  acceptanceText: string; // templated: "Apply <intent> at <selector>: <note>"
  priority: string; // "p0".."p3" (from severity)
}
```

Note what is **absent**: no machine-applicable change params (no new attribute values, no
text content, no structural ops), and **no `odId`** field. `changeType` is typed as bare
`string`, not a union — so it is not statically constrained even though synthesis only ever
emits `add`/`remove`/`change`.

### `DiffSummary` — counts only

```ts
interface DiffSummary {
  added: number;
  changed: number;
  removed: number;
}
```

### `MutationBatch`

```ts
interface MutationBatch {
  batchId: string;
  sessionId: string;
  sourceRevisionId: string;
  status: "draft" | "approved" | "applied" | "rejected";
  generatedFromCommentIds: string[];
  tasks: MutationTask[];
  approval: {
    required: true;
    approvedBy: string | null;
    approvedAt: string | null;
  };
  checksum: string; // sha256 over {sourceRevisionId, generatedFromCommentIds, tasks}
}
```

### `RevisionManifestEntry` — the append-only audit record

```ts
interface RevisionManifestEntry {
  revisionId: string;
  parentRevisionId: string;
  sessionId: string;
  variantCount: VariantCount; // 1 | 2 | 3
  baseline: BaselineProvenance; // { mode: "selected"|"committed"; label: "A"|"B"|"C" }
  appliedBatchId: string;
  appliedTaskIds: string[];
  unresolvedCommentIds: string[];
  diffSummary: DiffSummary; // counts-only today
  createdAt: string; // ISO timestamp
}
```

There is **no field referencing the mutated HTML artifact** on the manifest entry. A
revision is recorded with no pointer to "the HTML this revision produced." Whatever
execution model is chosen will likely need such a pointer (a new `htmlArtifactRef`/hash on
the manifest entry) to make a revision actually replayable/auditable.

### `StudioSessionState` (the lifecycle the model lives in)

```
SessionInitialized → PromptCaptured → VariantsReady → BaselineReady →
CommentsCaptured → MutationDrafted → MutationApproved → RevisionApplied →
RevisionRecorded → SessionCompleted
```

Apply moves the session to `RevisionRecorded` with `applyGate: "pending"`. (Note: the enum
has both `RevisionApplied` and `RevisionRecorded`; apply sets `RevisionRecorded`.)

## 3. Determinism Facts (grounded — "intent is sacred")

Source: `backend/src/modules/ui-prototyping-studio/application/synthesize-mutation-batch.ts`

- **Task ID is deterministic, no timestamps.** `taskId = "task-" + sha1(seed)[:10]` where
  `seed = "${sourceRevisionId}:${comment.commentId}:${comment.target.selector}:${index}"`
  (`deterministicId`, lines 131–134, 168–170). Same comments in same order ⇒ same task IDs.
- **`changeType` is inferred deterministically** from `intent` substrings: contains
  `add`/`create`→`"add"`; contains `remove`/`delete`→`"remove"`; else `"change"`
  (`inferChangeType`, 143–152).
- **`priority` is a deterministic map** from `comment.severity`: blocker→p0, high→p1,
  medium→p2, low/default→p3 (`inferPriority`, 154–166).
- **`acceptanceText` is a deterministic template**: `` `Apply ${intent} at ${selector}: ${note}` ``
  (line 138).
- **Batch checksum is content-addressed**: `sha256(JSON.stringify({sourceRevisionId,
 generatedFromCommentIds, tasks}))` (`buildChecksum`, 172–186). The checksum binds the
  task set; any execution model that mutates task content invalidates the audit chain.
- **`intent` is copied verbatim** from the comment into the task (line 133). [governance
  context] Intent is sacred — the execution engine must **not reinterpret** it; it may only
  realize it.

**Implication for the refine:** synthesis is fully reproducible from (ordered comments +
source revision). The downstream execution step is the _only_ place non-determinism could
enter. That is the crux of the A/B/C trade-off.

## 4. Runtime & CLI Seam (grounded + governance context)

- **Generation engine = Claude Code-native.** [governance context:
  DEC-RUNTIME-CLAUDE-CODE-011, DEC-CLI-NOT-MCP-012] Claude Code is the
  generation/mutation engine; the `studio` CLI is the **only** seam; the orchestration core
  (this module) owns gates + determinism. These IDs are **not** committed as docs in this
  module (`grep` across the module and `docs/` found no occurrences) — they are supplied as
  refine governance context, so the design must treat them as constraints to honor, not as
  citable artifacts.
- **The orchestration core is pure/deterministic today.** `apply-approved-batch.ts` and
  `synthesize-mutation-batch.ts` are framework-free TS functions over a
  `StudioSessionStorePort` (`application/ports.ts`). They never call out to an LLM. Any
  agentic step (B or C) must therefore live **outside** these core functions, behind the
  CLI seam, with the deterministic core consuming/validating its output.
- **Prototype HTML is a file artifact, not inline.** `generate-variants.ts:56` sets
  `htmlArtifactRef = "/artifacts/ui-prototyping-studio/${sessionId}/${label}.html"`. So the
  HTML the engine must edit lives as a file referenced by path. Apply currently never reads
  or writes it.

## 5. `data-od-id` (grounded + governance context)

- **The anchor exists on annotations.** `AnnotationTarget` carries
  `odId: string | null` (`domain/models.ts:33–37`), and `capture-comment-event.ts`
  (lines 105–113) normalizes and persists `odId` onto the `CommentEvent`'s target (trimmed;
  empty → derived/null).
- **The anchor is LOST at synthesis.** `toMutationTask` (synthesize, 122–141) reads
  `comment.target.selector` into `task.target` but **does not copy `comment.target.odId`**.
  `MutationTask` has no `odId` field. So the stable atomic id [governance context:
  DEC-ATOMIC-IDS-014] is available at comment time but is **not propagated to the task** the
  execution engine receives.
- **Implication:** any execution model that must "preserve/track `data-od-id`" needs the
  od-id threaded into `MutationTask` (and likely the manifest), because today the engine
  would only get a CSS selector — which is exactly the fragile anchor `data-od-id` was meant
  to replace.

## 6. Governance Invariants the Execution Model Must Honor

[governance context] These are supplied as refine constraints (`INV-3/4/5/6/8` are not
committed in this module's docs), corroborated by the real gate code where noted:

- **Auto-apply forbidden** — enforced in code (AUTO_APPLY_FORBIDDEN). The execution engine
  must never apply without a human-attributed actor.
- **Approval-before-apply** — enforced in code (BATCH_APPROVAL_REQUIRED). Execution may only
  run on an `approved` batch.
- **Baseline gate before apply** — enforced in code (BASELINE_GATE_UNSATISFIED).
- **Staleness guard** — enforced in code (BATCH_STALE_FOR_HEAD); execution must operate on
  the HTML of the current head's source revision.
- **Append-only manifest, exactly one entry per apply** — enforced in code
  (VARIANT_GENERATION_COUNT_MISMATCH post-check). Whatever HTML the engine produces, apply
  still records exactly one revision.
- **Determinism / reproducibility** — synthesis is deterministic and content-checksummed
  (§3); the execution model must preserve auditability of the chain.
- **Intent is sacred** — engine realizes, never reinterprets, `intent`.
- **Ergonomics-first** — including the apply-gate "saw-the-diff" requirement (OQ-2): the
  human approving/applying must be able to actually _see what changed_. Today this is
  impossible to satisfy meaningfully because `DiffSummary` is counts-only and no real
  before/after HTML diff exists.

## 7. The Three Approaches — Grounded Framing

- **A — Deterministic patch.** `MutationTask` gains machine-applicable typed change params;
  a deterministic transformer edits HTML at `target` (selector / od-id). _Fit to baseline:_
  maximal audit/reproducibility, but pushes the entire burden onto synthesis to fully
  specify the edit — and synthesis today only infers `add/remove/change` from intent
  substrings, which is far from a complete edit spec. Expressiveness limited.
- **B — Agentic regeneration.** Claude Code reads tasks (`intent`, `acceptanceText`) +
  current HTML and emits new HTML. _Fit:_ directly Claude Code-native, handles fuzzy intent;
  but non-deterministic, breaks the checksum-grade audit chain, drift risk, and the
  deterministic core can't vouch for the output.
- **C — Hybrid (agentic-propose + deterministic-validate).** Claude Code proposes mutated
  HTML; deterministic validators (in the core, post-seam) check it honors the `MutationTask`
  contract: target actually changed, `acceptanceText` satisfied, `data-od-id` preserved, no
  out-of-scope edits, text escaped — before it becomes a revision. _Fit:_ keeps generation
  in the native runtime while restoring deterministic gating; matches the existing
  "core owns gates + determinism, CLI is the seam" topology.

## 8. Five Pareto Criteria (for stage-2 decision)

1. **Auditability / determinism** — can the revision chain be reproduced/verified?
2. **Change expressiveness** — can it realize fuzzy/structural intent, not just typed ops?
3. **Claude Code-native fit** — does it use the runtime where it is strong (generation) and
   the core where it is strong (gating)?
4. **`data-od-id` stability** — is the atomic anchor preserved/tracked across the mutation?
   (Requires threading od-id into `MutationTask` regardless of approach — see §5.)
5. **Apply-gate "saw-the-diff" ergonomics (OQ-2)** — can the human see a real before/after
   diff at approve/apply, not just counts? (Requires producing real HTML — see §1/§6.)

## 9. Central Tension

Determinism / auditability / reproducibility **vs** change expressiveness **vs**
"generation is free" in a Claude Code-native runtime **vs** od-id stability **vs**
apply-gate ergonomics. A pulls toward 1/4 at the cost of 2/3; B pulls toward 2/3/5 at the
cost of 1; C attempts the Pareto frontier by separating "propose" (native, expressive) from
"validate/record" (deterministic core), at the cost of needing a real validator suite and
od-id propagation.

## 10. Evidence Index (paths are absolute)

- `/home/vrondelli/projects/domainspec-core/implementation/domainspec/backend/src/modules/ui-prototyping-studio/application/apply-approved-batch.ts` — current apply = bookkeeping; gates; one-entry post-check; counts-only `buildDiffSummary`.
- `/home/vrondelli/projects/domainspec-core/implementation/domainspec/backend/src/modules/ui-prototyping-studio/application/synthesize-mutation-batch.ts` — deterministic sha1 task ids, no timestamps; verbatim intent; sha256 checksum; od-id dropped in `toMutationTask`.
- `/home/vrondelli/projects/domainspec-core/implementation/domainspec/backend/src/modules/ui-prototyping-studio/domain/models.ts` — exact `MutationTask` (no params, no odId; `changeType: string`), `DiffSummary` (counts-only), `MutationBatch`, `RevisionManifestEntry` (no html ref), `StudioSessionState`, `AnnotationTarget.odId`.
- `/home/vrondelli/projects/domainspec-core/implementation/domainspec/backend/src/modules/ui-prototyping-studio/application/ports.ts` — `StudioSessionStorePort`; no HTML read/write port surface.
- `/home/vrondelli/projects/domainspec-core/implementation/domainspec/backend/src/modules/ui-prototyping-studio/application/generate-variants.ts` (line 56) — HTML lives at `htmlArtifactRef` file path.
- `/home/vrondelli/projects/domainspec-core/implementation/domainspec/backend/src/modules/ui-prototyping-studio/application/capture-comment-event.ts` (105–113) — od-id captured/normalized at comment time.

## Residue / Open for downstream stages

- DEC-RUNTIME-CLAUDE-CODE-011, DEC-CLI-NOT-MCP-012, DEC-ATOMIC-IDS-014, INV-3/4/5/6/8,
  OQ-2 are **not** committed as docs in this module (grep-negative). They are honored as
  governance context but have no citable in-repo source; downstream may want to land them as
  real decision/invariant artifacts.
- `MutationTask` needs od-id propagation for any approach to satisfy criterion 4 — this is a
  schema change regardless of A/B/C choice.
- `RevisionManifestEntry` has no pointer to produced HTML; "saw-the-diff" + replay likely
  require adding one.
- `changeType: string` is unconstrained; if A is chosen, this must become a typed,
  param-bearing union.
