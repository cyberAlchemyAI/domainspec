---
tags: [vault, ontology, enforcement, tooling, readme]
node_type: readme
is_session: false
layer: ontology
nature: reference
status: draft
version: 0.1.1
last_updated: 2026-05-16
---

# documents-metadata-enforcement

## What is this?

Discovery folder for **documents metadata enforcement** — the gap between the rules the vault declares about its own document metadata (frontmatter completeness, edge bidirectionality, edge-name validity, deprecated-edge avoidance, node-type endpoint constraints) and the absence of any tooling that enforces those rules. Holds the discovery, a backlog of failure modes, and the load-bearing source document.

## Business Context

Sibling of `vault/discovery/domainspec-vault-edges/` (which produced the 21-edge catalog) and `vault/discovery/domainspec-vault-foundations/` (which holds the structural classification rules). Does not propose changes to the catalog or classification system — only to how they are enforced. Today, all enforcement is author discipline; per the user's epistemic-honesty memory, a rule that cannot be mechanically verified is a discipline, not a rule.

## Why it matters

`ontology-conventions.md` Section 8 mandates bidirectional edges between vault nodes (with a formal carve-out for forward-only edges into `.claude/skills/**` and `.claude/agents/**`), only-catalog edges, and avoidance of deprecated edges. `frontmatter.md` skill mandates required fields. **None of these mandates is verified by tooling** — one concrete deprecated-edge usage is currently in the repo. Without enforcement, the rules silently decay and the graph cannot be trusted at scale.

## 📁 Navigation

- [documents-metadata-enforcement.md](documents-metadata-enforcement.md) — Discovery: names the rule-vs-discipline gap; enumerates ten failure modes; surveys five enforcement-surface candidates (pre-commit hook, CI lint, standalone CLI, build-time graph load, periodic audit); recommends a layered combination led by a `vault-lint` CLI invoked from CI for full coverage and from a pre-commit hook for fast Tier 1+2 feedback. Status: draft.
- [backlog.md](backlog.md) — Backlog of follow-up items, deferred decisions, and known gaps tied to this discovery.

## Status

`documents-metadata-enforcement.md` is `status: draft`, `veracidade: medium`, `convicção: medium`. The gap is real and observable (one concrete deprecated-edge usage cited in §6 Cleanup), and the enforcement-surface taxonomy is defensible, but implementation-level decisions (CI choice, language, manifest format) are open. The corresponding implementation-plan and the linter itself are pending.

## How to Read This Folder

Read `documents-metadata-enforcement.md` linearly. The Failure Modes table (§3) is the load-bearing artifact; everything else justifies why it must be addressed and surveys how. The Open Questions (§7) name implementation-level choices that an implementation-plan must lock. OQ-1 (whether skill/agent files can be edge endpoints) is **RESOLVED**: forward-only edges into `.claude/skills/**` and `.claude/agents/**` are legal-by-design and the discovery now wires itself accordingly. Inverse-side declarations on vault-internal targets remain a sweep item (§7 OQ-4); inverses on `.claude/skills/**` / `.claude/agents/**` targets are NOT pending — they are by-design omitted under the resolved carve-out.

The discovery deliberately leaves implementation choices (language, manifest format, where the linter lives in the repo) to a follow-up implementation-plan.

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [../../ontology-conventions.md](../../ontology-conventions.md) | `derives-from` | Section 8 (Directionality Principle) and Appendix C (21-edge catalog) — the rules whose enforcement gap this discovery documents. |
| [../domainspec-vault-edges/](../domainspec-vault-edges/) | `sibling-of` | Discovery folder that produced the 21-edge catalog. This folder is downstream: enforcement targets that catalog. |
| [../domainspec-vault-foundations/](../domainspec-vault-foundations/) | `sibling-of` | Vault's structural classification rules. Enforcement applies to those rules but does not revise them. |
| [../../../.claude/skills/custom/edges.md](../../../.claude/skills/custom/edges.md) | `cites` (forward-only) | Operational skill restating the bidirectionality rule. Legal-by-design per OQ-1 RESOLUTION; no inverse required. |
| [../../../.claude/skills/custom/frontmatter.md](../../../.claude/skills/custom/frontmatter.md) | `cites` (forward-only) | Declares frontmatter schema whose completeness is currently unenforced. |
| [../../../.claude/skills/custom/frontmatter-semantics.md](../../../.claude/skills/custom/frontmatter-semantics.md) | `cites` (forward-only) | Declares conditional-field rules currently unenforced. |
| [../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md](../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md) | `modified-by` | The 2026-05-03 session updated this README's prose to reflect the OQ-1 RESOLVED state. |
