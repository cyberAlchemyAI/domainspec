---
tags: [vault, ontology, infrastructure, governance, cross-repo, canonicalization]
node_type: constitution
is_session: false
layer: ontology
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-05-16
governs: [/domainspec/vault, /house_project/docs/vault, /football-stats-oracle/domain_knowledge, /maestro-trama/vault]
---

# Cross-Repo Schema Canonicalization Protocol

> **/domainspec is the canonical source for framework schema; sibling repos adopt via one of three modes (symlink, reference, peer-copy); amendments cascade by pull-on-cadence with mtime-watch as advisory.** Closes the blocker E3 named in `discovery/folder-structure-fractal/lenses/06-long-term-cross-repo.md` §E: drift becomes detectable only once canonical ownership is declared. Per S5, this protocol — being itself schema — lives in `/domainspec/vault/constitution/` and is referenced (not copied) by sibling repos.

## A. Canonical sources

- `/domainspec/vault/constitution/` is canonical for all framework constitutions.
- `/domainspec/vault/ontology-conventions.md` is canonical for the conventions document.
- `/domainspec/internal_tools/vault_common/frontmatter.py` is canonical for the Pydantic schema (per `frontmatter-ownership-constitution.md` §1).

Any sibling-repo file claiming framework status without resolving (transitively, via symlink or recorded snapshot-hash) to one of the above is, by this constitution, **not framework** — it is a local fork and must be labeled as such.

## B. Three adoption modes

1. **Symlink mode.** Sibling symlinks framework paths directly. Updates propagate atomically. Cost: depends on shared filesystem; sibling tied to /domainspec's lifecycle; symlinks usually `.gitignore`d so the dependency is invisible to a cold clone.
2. **Reference mode.** Sibling has its own `vault/constitution/framework/` folder containing stub files with `status: proposed`, `framework_ref: /domainspec/vault/constitution/<file>`, and a recorded `framework_snapshot_hash`. Updates require explicit pull. Cost: drift possible; visible because hash mismatch is mechanical.
3. **Peer-copy mode.** Sibling has full local copies marked `status: proposed` initially. Adopted by promoting `proposed` → `active` per-repo with the recording session note. Cost: drift, duplication; gain: autonomy and offline-readability.

## C. Per-repo recommendation

- **/maestro-trama: symlink mode.** Precedent already exists (`maestro-trama/domainspec → ../domainspec`, `.claude → domainspec/.claude`). The framework's `.claude/skills/custom/` are therefore already authoritative in-tree. No further symlinks required for canonical schema — `maestro-trama/domainspec/vault/constitution/` is already the canonical surface, visible at relative path from inside the repo. Extending symlinks for `vault/constitution/framework/ → ../domainspec/vault/constitution/` is optional convenience; do it only if maestro-local vault tooling needs a vault-relative path.
- **/house_project: peer-copy mode.** 519 existing vault files, its own deep history, its own `ontology-conventions.md` (61 KB, the de facto parent of the framework's vocabulary). A wholesale symlink dependency on /domainspec would invert the lineage. Copy the 7 framework constitutions into `docs/vault/constitution/framework/` with `status: proposed` and `framework_snapshot_hash:`. Promotion to `active` is per-constitution, per-session, and gated by a house_project-local migration entry.
- **/football-stats-oracle: peer-copy with reciprocal-flow clause.** Football is the seed of close-session and the evidence-stage ladder; it must not appear to be downstream of artifacts it originated. Peer-copy the 7 framework constitutions into `domain_knowledge/constitution/framework/` with `status: proposed`. Additionally, each copy whose lineage traces back to football carries a `seeded_by: /football-stats-oracle/.claude/skills/<skill>` field, and the canonical /domainspec versions of those documents carry the reciprocal `seeded_by` to football. Net: amendment cascade is bidirectional for the seeded subset (close-session, evidence-stage, folder-structure-fractal kernel).

## D. Amendment cascade

When /domainspec amends a framework constitution (per `schema-amendment-discipline-constitution.md`), the cascade is **pull, with watch as advisory, push reserved for breaking changes**:

1. **Pull (default).** Each sibling's `vault-ctl framework pull` runs on a session-open cadence. It reads `/domainspec/vault/amendments/` for entries since the sibling's recorded `framework_snapshot_hash`, lists them, and refuses to auto-apply. The session author decides per-amendment: adopt, defer, or fork. Adoption updates the local copy, bumps `framework_snapshot_hash`, and writes a sibling-local session note citing the /domainspec amendment by `amendment_id`.
2. **Watch (advisory).** A launchd/cron script monitors `mtime` on `/domainspec/vault/constitution/` and `/domainspec/vault/amendments/` and emits a desktop notification when changes occur. Non-blocking; informational only.
3. **Push (reserved).** /domainspec maintainer manually notifies siblings only for **breaking** schema_version bumps (per `frontmatter-ownership-constitution.md` §4). The notification is itself a /domainspec session note tagged `cross-repo-push:`; siblings treat it as a forced-pull trigger.

Symlink-mode siblings (maestro-trama) skip pull/push — they are atomically current by construction. Their cascade obligation is only the local session note recording that the upstream change was observed.

## E. Drift detection

Peer-copy mode siblings carry `framework_snapshot_hash` in each framework-folder file. `vault-ctl framework drift` computes the current hash of `/domainspec/vault/constitution/<file>` and compares. Mismatch without an accompanying sibling-local amendment session note is drift. Response, in order: (i) the sibling writes a session note classifying the drift as *intentional fork*, *pending adoption*, or *bug*; (ii) intentional forks rename the local file (drop `framework/` prefix) and lose framework status; (iii) pending adoption is resolved via the pull protocol (D.1); (iv) bugs are fixed by re-syncing from canonical. Drift detection runs at session-close (close-session skill invokes it advisory-only).

## F. Pydantic schema propagation

`vault_common/frontmatter.py` is code, not text — the three options have asymmetric costs:

- **pip-install from /domainspec** (creates a dependency). Recommended for *symlink-mode* siblings (maestro-trama) where the dependency is already implicit.
- **Vendor a snapshot** (drift). Recommended for *peer-copy* siblings (house_project, football); vendor under `internal_tools/vault_common_vendored/` with `__framework_snapshot_hash__` module attribute. The `vault-ctl framework drift` check above extends to vendored modules.
- **Reimplement minimally** (most robust, least DRY). Recommended only if the sibling's vault diverges enough that the framework Pydantic model would reject valid local nodes — house_project's 519-file corpus may force this for a transition window; if so, the reimplementation is a *strict subset* of the canonical model (validates fewer fields, never more), so canonical-valid nodes remain locally-valid.

## G. Self-application (S5)

This constitution is itself a schema document. Per its own §A, it lives canonically in `/domainspec/vault/constitution/cross-repo-canonicalization-protocol-constitution.md`. Sibling repos adopt it via the mode they adopt other framework constitutions (B). The maestro-trama symlink already makes it locally visible; house_project and football-stats-oracle peer-copy it in their `framework/` folder. This is the protocol applying to itself — meta-recursion intentional, and per `schema-amendment-discipline-constitution.md` §5, amendments to *this* file are recorded as plain /domainspec session notes, not amendment-log entries. Promotion `draft` → `active` follows the three sibling repos applying their low-risk changes in this session, which constitutes the validating instance.
