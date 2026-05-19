---
tags: [vault, lens, maestro-trama, evidence, asymmetry, broken-links, promotion-failure]
node_type: lens
is_session: false
layer: ontology
nature: research-synthesis
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
---

# Lens 03 — maestro-trama Evidence Inventory

## Mission

Produce an exhaustive empirical inventory of L₁↔L₂ asymmetries in `/Users/victorboscaro/maestro-trama/`: orphans, collisions, broken links, classification of every meaningful folder, feature inventory, naming evidence, empirical promotion events and failures, and current promotion-policy evidence. Goal: an evidence base the discovery cites without re-doing inventory work.

## §1. Asymmetry Inventory

| **Type** | **Name** | **L₁ Path** | **L₂ Path** | **Status** |
|---|---|---|---|---|
| Proposal orphan | `ad-creative-dna` | `docs/proposals/ad-creative-dna/` | — (features in `apps/labeling-platform/`) | No same-named app |
| Proposal orphan | `creative-catalog-management` | `docs/proposals/creative-catalog-management/` | — | No app or code |
| Proposal orphan | `mutation-strategy` | `docs/proposals/mutation-strategy/` | — | No app or code |
| Proposal orphan | `trama` | `docs/proposals/trama/` | — | No app (producer not built) |
| App orphan | `labeling-platform` | — | `apps/labeling-platform/` | No proposal with this name |
| App orphan | `creative-analysis-harnessing` | — | `apps/creative-analysis-harnessing/` | Legacy, no proposal |
| App orphan | `creatives-harnessing` | — | `apps/creatives-harnessing/` | Legacy, no proposal |
| App orphan | `spend-predictor` | — | `apps/spend-predictor/` | Recent scaffold, no proposal |
| **Name collision** | `extraction` | `docs/proposals/ad-creative-dna/features/extraction/` | `apps/labeling-platform/features/extraction/` | Two separate SPEC.md files, drifting content |

## §2. Broken Cross-Links

**Pattern:** `../../../../docs/features/...` should be `../../../../docs/proposals/...`

| File | Line Range | Broken Pattern | Evidence |
|---|---|---|---|
| `docs/proposals/ad-creative-dna/features/extraction/audit/agent-b2-extraction-spec-investigation.md` | 3, 5, 7 (multiple) | `../../../../docs/features/ad-creative-dna/discovery/creative-dna-definition.md` | All references to "parent §" sections using old `/docs/features/` path |
| `apps/labeling-platform/features/label-curation/discovery.md` | Multiple | `../../../../docs/features/ad-creative-dna/` | Cross-reference to proposal feature |
| `apps/labeling-platform/features/dashboard/SPEC.md` | Multiple (20+) | `../../../../docs/features/ad-creative-dna/discovery/creative-dna-definition.md` | Every reference to parent Card schema |
| `apps/labeling-platform/features/extraction/SPEC.md` | Multiple (10+) | `../../../../docs/features/ad-creative-dna/discovery/creative-dna-definition.md` | References to schema invariants, protocols, catalogs |
| `docs/UI-ARCHITECTURE.md` | 1 | `docs/features/labeling-platform/extraction/` | Old path reference |
| `docs/vault/conversations/2026-05-12-0310-apps-folder-admission-convention.md` | Multiple | `docs/features/` (all 34 occurrences reference old tree) | Session notes on the migration itself |

**Total:** 34+ in vault conversations alone; ~50+ across SPEC files in `apps/labeling-platform/features/`.

## §3. Empirical Classification

| **Folder** | **Type** | **Classification** | **Notes** |
|---|---|---|---|
| `/docs/proposals/` | L₁ | Knowledge-shaped | Four proposals; specs, discovery, domain models |
| `/docs/` (root files) | L₀/Residue | Mixed | High-level governance, glossary, vault conversations |
| `/apps/` | L₂ | Code-shaped | Four apps; code + features + ops. SPEC.md inside features/ |
| `/domain_knowledge/` | L₁ | Knowledge-shaped | Axioms, premises, constitution, specs, backlog, discovery |
| `/business-philosopher/` | Residue | In-between | Essays, persona, discovery; not mapped to (app, feature) |
| `/vault/` | Residue | Tooling/archive | Conversation notes, ontology, confidence rubrics |
| `/data/` | L₂ | Code/artifact-shaped | Performance, embeddings, winners; CSVs + READMEs |
| **Under `/docs/proposals/X/`:** | | | |
| `features/` | L₁-feature | Knowledge-shaped | SPEC.md, discovery, domain, operations, queries |
| **Under `/apps/X/`:** | | | |
| `features/` | L₂-feature | Code-shaped | Implementations; SPEC.md sits alongside code |
| **Under `/domain_knowledge/`:** | | | |
| `backlog/` | Residue | In-between | 3 files, all `node_type: backlog`, never graduated |
| `discovery/` | Residue | In-between | 3 files, foundational but not yet structured as features |
| `constitution/` | L₁ | Knowledge-shaped | Rules, binding constraints |
| `axiom/` | L₁ | Knowledge-shaped | First principles |
| `premise/` | L₁ | Knowledge-shaped | Assumptions |
| `spec/` | L₁ | Knowledge-shaped | Formal requirements |
| `conceptual/` | L₁ | Knowledge-shaped | Models without identity |

**Where residue lives today:** Scattered across `/vault/`, `/domain_knowledge/backlog/`, `/domain_knowledge/discovery/`, `/business-philosopher/discovery/`, and root-level singletons in `/docs/`.

## §4. Feature Inventory

| **Proposal** | **L₁ Features** | **App** | **L₂ Features** | **Orphan Status** |
|---|---|---|---|---|
| `ad-creative-dna` | `extraction`, (others in SPEC.md) | `labeling-platform` | `extraction`, `dashboard`, `label-curation`, `platform-skeleton` | **extraction**: collision (two SPEC.md, drifting). Others: proposal features not mapped to app features. |
| `creative-catalog-management` | (features/ folder empty) | — | — | Both orphaned. |
| `mutation-strategy` | `discovery`, `domain`, `interfaces`, `operations`, `queries`, `states`, `workflows` | — | — | Proposal orphaned; no implementing app. |
| `trama` | `backlog.md` only | — | — | Proposal orphaned; no implementing app. |
| — | — | `creative-analysis-harnessing` | `analysis-interviewer`, `core`, `orchestrator`, `validator` | App orphaned; no proposal ancestor. |
| — | — | `creatives-harnessing` | `retrieval` | App orphaned; no proposal ancestor. |
| — | — | `spend-predictor` | `spend-prediction` | App orphaned; scaffold only (2026-05-16). |

## §5. Naming Evidence

| **Tier** | **Current Name** | **Location** | **Evidence** |
|---|---|---|---|
| **L₁** (forward-looking specs) | `docs/proposals/` | `/docs/proposals/{app-name}/features/{feature}/SPEC.md` | 4 proposals; explicit routing in `/docs/README.md` |
| **L₁** (domain axioms/rules) | `domain_knowledge/` | `/domain_knowledge/{axiom,premise,constitution,spec,discovery}/` | 21 files; explicit classification in frontmatter |
| **L₂** (deployed code) | `apps/` | `/apps/{app-name}/features/{feature}/` | 4 apps; explicit routing in `CLAUDE.md` |
| **Residue** (unstructured) | `vault/`, `backlog`, `business-philosopher/` | `/vault/conversations/`, `/domain_knowledge/backlog/`, `/business-philosopher/discovery/` | No formal promotion policy; accumulated via conversation sessions |

**Naming collisions:** None at folder level, but `extraction` is a feature name that collides across proposal and app, creating spec-content drift.

## §6. Empirical Promotion Events

Git history shows **one major promotion event** (2026-05-12, commit `1260582`):

**Migration from `docs/features/` → `docs/proposals/`:**

- **Before:** `/docs/features/{app-name}/features/{feature}/SPEC.md` (flat namespace)
- **After:** `/docs/proposals/{proposal-name}/features/{feature}/SPEC.md` + specs moved into `/apps/{app-name}/features/{feature}/`
- **Commit message:** `docs(workspace): update README, CLAUDE.md, and domain-dictionary to reflect current structure; add apps, data folders, proposals, vault conversations`

**Secondary promotion-like events:**

- **2026-05-16, `ba48ca2`:** `feat(labeling-platform): scope extraction split + add labeling experiment v1` — extraction feature gets a `labeling-experiment-v1.md` in the proposal.
- **2026-05-16, `5491867`:** `feat: decompose TRAMA into producer + surrounding components` — creates pending work items in `/domain_knowledge/backlog/trama-decomposition-pending.md`. Conceptual work promoted to backlog but never graduated to feature spec.

**No other graduation evidence found.** The three backlog files in `/domain_knowledge/backlog/` (dated 2026-04-22, never touched again) show residue that has never graduated.

## §7. Empirical Promotion Failures

**Extraction duplication — worst-case failure:**

- **Files:** `/docs/proposals/ad-creative-dna/features/extraction/SPEC.md` AND `/apps/labeling-platform/features/extraction/SPEC.md`
- **Content drift:** Proposal SPEC references §3.4 labeling protocol; app SPEC references parent schema (via broken `../../../../docs/features/...` link).
- **Git evidence:** Both files appear on the same commit (2026-05-16, `ba48ca2`). They were created in parallel without arbitration.
- **Problem:** No manifest or `IMPLEMENTED-BY.md` pointer; no indication which is authoritative.

**Backlog items sitting unstructured:**

- `/domain_knowledge/backlog/creative-attribute-pending.md` (created 2026-04-22, last modified 2026-04-22) — never promoted.
- `/domain_knowledge/backlog/maestro-pending.md` (last modified 2026-05-15) — Active but still marked `status: draft`.
- `/domain_knowledge/backlog/trama-decomposition-pending.md` (last modified 2026-05-15) — Directly cited in proposal SPEC as pending; no evidence of promotion.

**Legacy apps without proposals:** `creative-analysis-harnessing`, `creatives-harnessing` predate the proposals discipline (commit `c449ff6`, 2026-04-22). Granted legacy status informally.

## §8. Current Promotion-Policy Evidence

**NO formal promotion policy found.**

| **Artifact** | **Location** | **Constraints Found** |
|---|---|---|
| `CLAUDE.md` | Lines 70–77 (Route 5: Writing Discoveries) | **Implied rule:** discoveries live in `/docs/` (proposals); must follow YAML frontmatter; must lead to SPEC or backlog. No graduation criteria stated. |
| `CLAUDE.md` | Lines 75–80 (Route 6: Code) | **Implied rule:** new features confirm Route 5 first; code refactoring is consequence of discovery. No explicit promotion gate. |
| Session notes | `docs/vault/conversations/2026-05-12-0310-apps-folder-admission-convention.md` | **Decision recorded but not codified:** "Plan: `/apps/<name>/` is reserved for products with a binding ARCHITECTURE.md or running code." No enforcement mechanism. |
| Session notes | `docs/vault/conversations/2026-04-30-1505-v030-ship-pivot-plan-as-atom.md` | **Promotion pattern observed:** `docs/features/analysis-interviewer/discovery.md` promoted to its own feature; `SPEC.md` created in same session. Pattern: session work → discovery → SPEC. No gate between stages. |
| No constitution, no script | — | No `promotion.md`, no CI gate, no manifest schema. Promotion is **purely operator-driven.** |

## Hand-off

The repo has **named vocabulary** (proposals, apps, domain_knowledge) but **no explicit policy** governing when content moves between them. Decisions are captured in session notes and applied inconsistently. The discovery should argue: L₁↔L₂ mirroring is enforceable via (a) a naming scheme that makes the (app, feature) identity mandatory at creation time, and (b) a structural requirement that every L₂ feature declares its L₁ ancestor (or is marked legacy), enforced via a schema and a light CI check.
