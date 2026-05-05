---
tags: [vault, ontology, enforcement, tooling, readme]
node_type: readme
is_session: false
layer: ontology
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-05-02
---

# documents-metadata-enforcement — Navigation README

This folder holds the discovery layer for **documents metadata enforcement** — the gap between the rules the vault declares about its own document metadata (frontmatter completeness, edge bidirectionality, edge-name validity, deprecated-edge avoidance, node-type endpoint constraints) and the absence of any tooling that enforces those rules. Today, all of these are author discipline. The discovery in this folder names the gap, surveys the failure modes, and surveys the candidate enforcement surfaces.

This folder is a sibling of `vault/discovery/domainspec-vault-edges/` (which produced the 21-edge catalog) and `vault/discovery/domainspec-vault-foundations/` (which holds the structural classification rules). It does not propose changes to the catalog or the classification system — only to how they are enforced.

---

## The Discovery

### Documents metadata enforcement (`documents-metadata-enforcement.md`)

The vault's `ontology-conventions.md` Section 8 mandates that every edge **between vault nodes** be declared on both endpoints (with a formal carve-out for forward-only edges into `.claude/skills/**` and `.claude/agents/**`), that only catalog edges be used, and that deprecated edges be avoided. The `frontmatter.md` skill mandates required fields and conditional fields. None of these mandates is verified by tooling. This discovery names the rule-vs-discipline gap (per the user's epistemic-honesty memory: a rule that cannot be mechanically verified is a discipline, not a rule), enumerates ten concrete failure modes the gap admits (with one currently observed in the repo), surveys five enforcement-surface candidates (pre-commit hook, CI lint, standalone CLI, build-time graph load, periodic audit), and recommends a layered combination led by a `vault-lint` CLI invoked from CI for full coverage and from a pre-commit hook for fast Tier 1+2 feedback.

The discovery deliberately leaves implementation choices (language, manifest format, where the linter lives in the repo) to a follow-up implementation-plan.

---

## File Map

| File | Type | Purpose | Status |
|---|---|---|---|
| [documents-metadata-enforcement.md](documents-metadata-enforcement.md) | discovery | Names the rule-vs-discipline gap; enumerates failure modes; surveys enforcement surfaces; recommends a layered combination. | draft |

---

## Status

`documents-metadata-enforcement.md` is `status: draft`, `veracidade: medium`, `convicção: medium`. The gap is real and observable (one concrete deprecated-edge usage cited in §6 Cleanup), and the enforcement-surface taxonomy is defensible, but the implementation-level decisions (CI choice, language, manifest format) are open. The corresponding implementation-plan and (eventually) the linter itself are pending.

---

## Connections

- **[../../ontology-conventions.md](../../ontology-conventions.md)** — Section 8 (Directionality Principle) and Appendix C (21-edge catalog) are the rules whose enforcement gap this discovery documents. The discovery `derives-from` and `cites` this document.
- **[../domainspec-vault-edges/](../domainspec-vault-edges/)** — sibling discovery folder that produced the 21-edge catalog. This folder is downstream: enforcement targets the catalog that folder defined.
- **[../domainspec-vault-foundations/](../domainspec-vault-foundations/)** — sibling discovery folder for the vault's structural classification rules. Enforcement applies to those rules but does not revise them.
- **[../../../.claude/skills/custom/edges.md](../../../.claude/skills/custom/edges.md)** — operational skill restating the bidirectionality rule and its formal skills/agents carve-out. The discovery declares a forward-only `cites` edge to this file (legal-by-design per OQ-1 RESOLUTION); no inverse is required on the skill file.
- **[../../../.claude/skills/custom/frontmatter.md](../../../.claude/skills/custom/frontmatter.md)** and **[../../../.claude/skills/custom/frontmatter-semantics.md](../../../.claude/skills/custom/frontmatter-semantics.md)** — declare the frontmatter schema and conditional-field rules whose completeness is currently unenforced.
- **[../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md](../../sessions/2026-05-03-0334-cross-boundary-rule-and-edges-hygiene-dispatch.md)** — `modified-by`. The 2026-05-03 cross-boundary-rule + edges-hygiene session updated this README's prose to reflect the OQ-1 RESOLVED state. (Format note: this folder's README is in prose-bullet form pending canonicalization to the `## Connections` table per `vault/discovery/_backlog.md` F10.)

---

## How to Read This Folder

Read `documents-metadata-enforcement.md` linearly. The Failure Modes table (§3) is the load-bearing artifact; everything else justifies why it must be addressed and surveys how. The Open Questions (§7) name the implementation-level choices that an implementation-plan must lock. OQ-1 (whether skill/agent files can be edge endpoints) is **RESOLVED**: forward-only edges into `.claude/skills/**` and `.claude/agents/**` are legal-by-design and the discovery now wires itself accordingly.

Inverse-side declarations on this discovery's vault-internal targets remain a sweep item (see §7 OQ-4); inverses on `.claude/skills/**` / `.claude/agents/**` targets are NOT pending — they are by-design omitted under the resolved carve-out.
