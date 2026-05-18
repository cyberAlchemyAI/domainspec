---
tags: [vault, ontology, infrastructure, governance, amendments]
node_type: constitution
is_session: false
layer: ontology
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-16
---

# Schema Amendment Discipline

> **Every change to a schema document must be recorded in an amendment log entry that cites its trigger, lists its dependents, and bumps the document's version.** This constitution governs the meta-layer — the schema documents that live outside the graph (per S5 of `discovery/graph-as-residue-attractor/lenses/01-invariants-and-layer-alignment.md`). It closes residue R2: schema-meta evolution has no instance discipline.

---

## Why this is a constitution

S5 forces schema documents to live outside the graph to avoid Russell-style self-reference. That structural choice creates a governance gap: the constitutions, ontology specs, and convention files that bind the graph have no recorded discipline for their own evolution. Edits drift silently; downstream validators and extractors can break without a paper trail. The R2 residue names this exactly: "schema documents have no instance discipline for their own evolution."

This discipline is the Tarski-stratification move one level above S5. It does not put schema documents back into the graph — it gives them a parallel ledger (`vault/amendments/`) that is itself append-only and event-sourced, mirroring the S9 discipline for session nodes.

## 1. What counts as a schema document

A file is a **schema document** if a change to it affects what validators or extractors do. Concretely:

- Every file under `vault/constitution/`.
- `vault/ontology-conventions.md`, `vault/confidence-levels.md`, `vault/foundational-knowledges.md`, and any sibling reference document the validators read.
- Any file whose change would invalidate previously-valid frontmatter, change edge-type catalog membership, or change the controlled vocabulary of any label.
- The Pydantic models under `internal_tools/vault_common/` are **not** schema documents in this sense — they are the executable form. They are governed by the source schema document (`frontmatter-ownership-constitution.md`).

## 2. When an amendment is required

An amendment log entry is required for **any change to a schema document beyond pure typo or whitespace correction**. Specifically:

- **`schema_version` bump** — required when the change alters validator behavior (new required field, new controlled-vocabulary value, changed edge-type semantics, removed field). Migration script under `vault/migrations/` must accompany.
- **`document_version` (frontmatter `version:`) bump** — required when the change is editorial (clarification, restructure, new section) but does not change validator behavior.
- Pure typo, formatting, or link fixes — no amendment required; bump `last_updated` only.

## 3. Amendment log file convention

Path: `vault/amendments/YYYY-MM-DD-<slug>.md`. One file per amendment. Append-only — if an amendment is wrong, write a follow-up amendment that supersedes it; do not edit in place.

## 4. Amendment log frontmatter spec

```yaml
---
amendment_id: YYYY-MM-DD-<slug>
date: YYYY-MM-DD
schema_document: <vault-relative path to the amended file>
change_type: schema_version_bump | document_version_bump
old_version: <pre-amendment version>
new_version: <post-amendment version>
trigger:
  session: <path to session note or null>
  discovery: <path to discovery or null>
  falsified_premise: <path to premise or null>
dependents: [<list of subsystem names or file paths that read the amended schema>]
review:
  validator_passed: true | false | pending
  snapshot_tag: <vault-ctl snapshot tag taken after the amendment, or null>
author: <handle>
---
```

The body explains *why* the amendment was made, *what* changed, and *what the dependents must do* to re-validate.

## 5. Self-exemption (Russell-dodge) — §X

This constitution **does not govern its own amendment** through the discipline it defines for other schema documents. If it did, every amendment to this constitution would require an amendment-log entry whose schema for "valid amendment log entry" might itself be in flux — Russell-bites.

Instead: **amendments to this constitution are recorded as plain session notes under `vault/sessions/`** that cite this file by path and explain the change. The session note is the log entry. No `vault/amendments/` file is written for changes to this constitution. The `last_updated` and `version` fields are bumped in place. This is the Tarski-stratification move: the meta-discipline is one explicit level above the disciplines it governs, and it is amended by the level-below mechanism (sessions, which are already append-only by S9). The stratification stops here — there is no meta-meta-discipline.

The exemption is **scoped exactly to this file**. Every other schema document — including future meta-governance documents — is governed by §§1–4.

## 6. Mechanical enforcement

`vault-ctl amendments check` walks every schema document and flags any whose `last_updated` post-dates the most recent amendment-log entry referencing it. The check is advisory at introduction (many existing schema docs have no amendment history) and becomes strict after the corpus is back-filled or one schema_version has elapsed.

## 7. Boundary

This constitution governs the *recording* of schema changes. It does not govern:

- Whether a proposed schema change is wise (that's review judgment).
- The contents of the schema documents themselves (each schema document is its own constitution).
- The migration mechanics (those live under `vault/migrations/` per `frontmatter-ownership-constitution.md` §4).

---

## Appendix — first instance

`vault/amendments/2026-05-16-add-verification-field.md` is the first amendment recorded under this discipline. It retroactively documents the v0.1.0 → v0.1.1 bump on `discovery-structure-constitution.md` that added the `verification:` field to lens frontmatter. If its shape violates these rules, the rules are wrong, not the amendment.
