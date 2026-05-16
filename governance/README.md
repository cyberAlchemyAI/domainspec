---
tags: [governance, tags, policy, control, framework]
node_type: readme
is_session: false
layer: ontology, application
nature: reference
status: active
version: 0.2.0
last_updated: 2026-05-16
---

# Governance Folder

## What is this?

`governance/` is the root-level home for framework-wide governance artifacts: code-tagging schemas, waivers, drift reports, tooling, and examples that are not feature-local. Implementation plans for governance work continue to live under `plan/governance/`; this folder holds the operating assets those plans produce.

## Business Context

DomainSpec enforces traceability between specs and code through governance mechanisms — most visibly the code-tag system (`@domainspec:...` source annotations) that links implementation back to typed concepts. These mechanisms need a single discoverable home so auditors, taggers, and verifiers all reach the same schema and waiver list across every feature.

## Why it matters

Without a stable governance root, tag schemas fork per feature, waivers become invisible, and drift reports get scattered across plan directories. Centralizing them here keeps the governance surface auditable, makes drift comparable across features, and gives the tagging agent (`domainspec-code-tagger`) a deterministic place to read from and write to.

## 📁 Navigation

- **`tags/`** — Code-tagging schema (`CODE-TAG-SCHEMA.md` / `.json`), composability patterns, waivers (`CODE-TAG-WAIVERS.md`, `code-tag-waivers.yaml`), per-feature drift reports, code-tag inventories per feature, tooling, examples, and aggregate reports.

## Related Sources

- Governance implementation plan tasks live in `plan/governance/`.
- Tagging governance plan: `plan/governance/GOV-06-code-relationship-tags-governance.md`.
