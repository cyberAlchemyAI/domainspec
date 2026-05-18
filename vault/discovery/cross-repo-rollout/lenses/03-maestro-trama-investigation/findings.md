---
lens: maestro-trama-investigation
date: 2026-05-16
dispatched_by: subagent — read-only investigation of /maestro-trama for cross-repo rollout
addresses: Current state + the duplicate-domainspec question + the existing-internal_tools question + low-risk/high-risk separation
sources:
  - /Users/victorboscaro/maestro-trama/ (top-level)
  - /Users/victorboscaro/maestro-trama/vault/ (incl. constitution/, discovery/, sessions/, axiom/, premise/, conceptual/, backlog/)
  - /Users/victorboscaro/maestro-trama/domainspec (symlink → ../domainspec)
  - /Users/victorboscaro/maestro-trama/.claude (symlink → domainspec/.claude → ../domainspec/.claude)
  - /Users/victorboscaro/maestro-trama/business-philosopher/ (manifesto.md, write-style.md, discovery/persona.md)
  - /Users/victorboscaro/maestro-trama/internal_tools/ (vault_routing, semantic_index, creative_harnessing, creative_analysis_harnessing)
  - /Users/victorboscaro/domainspec/ (for comparison)
verification: [local-files-read]
---

# Maestro-Trama Investigation — Cross-Repo Rollout Lens

## Headline finding (resolves a premise of the task)

**`/Users/victorboscaro/maestro-trama/domainspec` is a symlink to `../domainspec`.** So is `.claude` (→ `domainspec/.claude` → `../domainspec/.claude`). There is **no duplicate /domainspec** — maestro-trama already mounts the canonical `/Users/victorboscaro/domainspec` directly at its root. Section D below revisits this in detail; it reshapes the whole rollout question.

---

## A. Current state inventory

### Top-level (notable entries only)

| Path | Kind | Notes |
|---|---|---|
| `.claude` | symlink → `domainspec/.claude` | inherits all /domainspec skills |
| `domainspec` | symlink → `../domainspec` | the framework repo itself, mounted in-tree |
| `vault/` | dir | maestro-trama's own vault (peer to /domainspec/vault) |
| `business-philosopher/` | dir | Victor's voice corpus (peer vault candidate) |
| `internal_tools/` | dir | pre-existing tooling (see E) |
| `domain_knowledge/` | untracked dir | new, not yet inspected in depth |
| `docs/` | untracked dir | likewise |
| `apps/`, `data/`, `claude/` | dirs | runtime/code, out of scope |
| `AGENTS.md`, `CLAUDE.md`, `README.md` | files | governance docs at repo root |

### vault/

| Subfolder | Contents | Has frontmatter? |
|---|---|---|
| `constitution/` | 7 constitutions: commit-message, development-practices, domain-tagging, event-system, folder-structure, frontend, robot-talks | yes (tags, node_type, layer, nature, status, veracidade, convicção, version, last_updated) |
| `axiom/` | business, frontend, ontology, system axioms | yes |
| `premise/` | frontend, ontology, robot-talks, system premises | yes |
| `conceptual/` | epistemic-principles, event-system-foundations, fidc-and-credit-rights, mission | yes |
| `discovery/` | only `edges-and-types/2026-05-15-trama-and-maestro-ontology-extensions.md` | yes; lens-adjacent shape |
| `sessions/` | 2 session notes (2026-05-14, 2026-05-15) | yes; rich (expected_importance, importance_rationale, expires, decisions_made, contradictions_found, promoted_candidates) |
| `backlog/` | backlog.md, backlog-extraction-tier3.md, framework-rigor-gaps.md | yes |
| `conversations/`, `assets/` | misc | n/a |
| `ontology-constitution.md`, `ontology-conventions.md`, `confidence-levels.md`, `agent-navigation.md`, `human-navigation.md` | top-of-vault governance | yes |
| `.smart-env/`, `.obsidian/` | Obsidian + Smart Connections plugin state | — |

### internal_tools/

| Tool | Notable contents | Role |
|---|---|---|
| `vault_routing/` | indexer, embedder, scorer, search, walker, store, cli, mcp_server, vault_index.db, tests | semantic walker + MCP routing layer over the vault |
| `semantic_index/` | README, application/, docs/, backlog.md | a second index (likely the next-gen replacement / sibling of vault_routing) |
| `creative_harnessing/` | cli, store, search, mcp_server, ui_server, creative_embeddings.db, creative_harnessing.db, docs, tests | domain-specific creative DB + MCP + UI |
| `creative_analysis_harnessing/` | api, axes, brief, causality, classifier, compare, config, coverage, describe, diagnose, examples, gates, narrator, orchestrator, planner/, interviewer/, primitives, queries, rank, research/, telemetry/, tests | the heavy creative-analysis pipeline |

### Existing close-session

`.claude/skills/close-session/SKILL.md` exists (via the symlink, this is the same close-session that lives in /domainspec). It already implements the Sonnet-delegation classification step, scratchpad sweep from `claude/current_conversations/`, and references `.claude/skills/custom/frontmatter.md`, `frontmatter-semantics.md`, `edges.md`, `edge-catalog.md`. Custom skill catalog in `.claude/skills/custom/` includes: backlog-pattern, code, debugging, discovery-writing, domain-dictionary, domain-tagging-code, domainspec-findings-writing, domainspec-research-writing, edge-catalog, edges, event-system, folder-structure, frontend, frontmatter-semantics, frontmatter, infrastructure-guide, newspaper-orchestration, readme-pattern, semantic-index, testing.

---

## B. Compatibility assessment

| Dimension | maestro-trama | /domainspec framework | Compatibility |
|---|---|---|---|
| Frontmatter keys | `tags`, `node_type`, `is_session`, `layer`, `nature`, `status`, `veracidade`, `convicção`, `version`, `last_updated`, and for sessions: `expected_importance`, `importance_rationale`, `expires`, `decisions_made`, `contradictions_found`, `promoted_candidates`, `specs_updated`, `conversation_id`, `timestamp` | identical core; framework also uses `lens`, `dispatched_by`, `addresses`, `sources`, `verification` for lens-shaped discoveries | **High.** The custom skills used by both are the *same files* (via symlink). No frontmatter divergence possible. |
| Constitution shape | one-file-per-concern under `vault/constitution/`, `node_type: constitution`, version + status fields | same convention | **Identical.** |
| Discovery shape | one specimen (`edges-and-types/2026-05-15-...`) with `node_type: discovery`, scope, representation_layer, veracidade, convicção — but **no `lens:` field, no `dispatched_by`, no `verification`** | lens-shaped discoveries are the new pattern | **Partial.** Discovery folder exists and is correctly named, but the **lens-shaped variant + verification field is not yet adopted.** |
| Edge declarations | uses an explicit "Connections" + "Edge types — proposed additions" prose model, anchored on `ontology-conventions.md` Appendix C (14-edge catalog) | uses `edge-catalog.md` and `edges.md` under `.claude/skills/custom/` (which the maestro-trama symlink already exposes) | **Reconcilable** but currently two catalogs of record coexist: maestro's `vault/ontology-conventions.md` Appendix C and the framework's `edge-catalog.md`. See G. |
| Snapshot zero pattern | not present | present | **Gap** — easy to add. |

---

## C. The 7 framework constitutions — applicability

| Framework constitution | maestro-trama state | Recommendation |
|---|---|---|
| 1. Frontmatter ownership | implicit; rules live in `.claude/skills/custom/frontmatter.md` (already shared) | **Adopt as-is** — no friction, just declare the constitution in `vault/constitution/`. |
| 2. Edge acyclicity | not declared; edge catalog exists in two places | **Adopt**, but resolve catalog-of-record question first (G). |
| 3. Discovery structure (lens shape) | discovery folder exists with one non-lens entry | **Adopt** — start writing new discoveries as lenses; backfill optional. |
| 4. Vault folder structure | maestro has its own folder-structure-constitution.md (about *code*, not vault) | **Add the framework's vault-folder-structure-constitution** as a peer; do not overwrite. |
| 5. Schema amendment discipline | not declared | **Adopt** — low-risk pure-text addition. |
| 6. Governs/runtime-witness | not declared; not obviously needed for maestro's current scope | **Defer** — adopt only if/when runtime emission is wired. |
| 7. Convicção bet-ledger | not present; maestro already uses `convicção` + `veracidade` as inline fields | **Adopt** — the ledger formalizes what they're already doing informally. |

All 7 are technically applicable; 5 are low-risk additions, 1 (edge acyclicity) is gated by the catalog reconciliation, 1 (governs/runtime-witness) is gated by maestro's lack of runtime emission surface today.

---

## D. The "duplicate /domainspec" problem — RESOLVED to "it's a symlink"

**`ls -l` output:**
```
domainspec -> ../domainspec
.claude    -> domainspec/.claude
```

There is **one** /domainspec on disk, and maestro-trama mounts it at its root. Implications:

1. **There is no convergence or divergence to manage.** Any change to `/Users/victorboscaro/domainspec/...` is *immediately and atomically* visible inside maestro-trama. The 16 constitutions you already wrote in `/domainspec/vault/constitution/` are visible from inside maestro-trama as `domainspec/vault/constitution/`.
2. **maestro-trama has, in effect, two vaults right now**: its own `vault/` (the 7-constitution, business-domain vault) and the framework vault at `domainspec/vault/` (the 16-constitution meta-framework vault). They sit side-by-side in the file tree.
3. **The framework's `.claude/skills/` are already in force** inside maestro-trama via the symlink. The close-session, frontmatter custom skill, edges/edge-catalog skills are already authoritative *in this repo*.
4. **`.gitignore` likely excludes the symlinks** — worth confirming before treating this as a deploy mechanism vs. a working-tree convenience. (Not verified in this read-only pass; the `.gitignore` was 627 bytes, not opened.)

So the "rollout" question for maestro-trama is **not** "how do we copy /domainspec's discipline in" — the framework is already on the working filesystem. The question is **"which of maestro's own vault/ artifacts should adopt the framework's patterns, and where do the two ontology catalogs reconcile."**

**[FLAG FOR USER]** Is the symlink intentional and stable, or is it a transitional convenience? The rollout strategy depends on this. If it's stable, the work is purely *inside* `maestro-trama/vault/` to align with the framework that's already mounted next door. If it's transitional, we need a different plan.

---

## E. The existing internal_tools/ — DEFERRED, high-stakes

maestro-trama's `internal_tools/` has four tools — **none of which exist in `/domainspec/internal_tools/`**, and vice versa:

| maestro-trama tool | /domainspec equivalent |
|---|---|
| `vault_routing/` (semantic walker, MCP, sqlite index) | nothing of the same shape; /domainspec has `graph_retrieval/`, `vault_ctl/`, `vault_common/`, `vault_telemetry/` |
| `semantic_index/` | no peer; /domainspec custom skill `semantic-index.md` references the concept but no implementation seen |
| `creative_harnessing/`, `creative_analysis_harnessing/` | none; these are maestro-domain-specific |

The two `internal_tools/` trees are **disjoint, not overlapping**. There is no naming collision, no duplicated function. They serve different audiences (maestro: ad-creative pipeline + vault routing for *this* vault; /domainspec: vault tooling for the framework vault).

**[FLAG FOR USER — DO NOT AUTO-RESOLVE]** Three live options, all defensible:

1. **Keep disjoint.** Each repo's internal_tools serves its own vault. maestro keeps `vault_routing`; /domainspec keeps `vault_ctl`. Lowest disruption, highest duplication risk over time.
2. **Promote `vault_routing`/`semantic_index` into /domainspec/internal_tools/** as the canonical retrieval layer for *any* vault, and have /domainspec's `vault_ctl`/`graph_retrieval` either absorb or be absorbed by it. Highest payoff, real refactor cost — `vault_routing` already has a working MCP server and sqlite index, which /domainspec doesn't appear to.
3. **Make /domainspec/internal_tools/ the canonical surface** and re-port maestro's vault_routing/semantic_index there, leaving creative_harnessing in maestro as legitimately domain-specific.

The right answer turns on whether you want maestro's vault_routing to govern *all* future vaults or whether /domainspec's nascent vault_ctl is the intended canonical line. Read-only investigation cannot tell — defer to user.

---

## F. business-philosopher/ as a peer vault

This folder already has its own discipline:

- Top-level `manifesto.md`, `write-style.md`, `CLAUDE.md`, `README.md`, plus its own `.obsidian/` (Obsidian vault).
- Frontmatter on `manifesto.md` and `write-style.md` and `discovery/persona.md` follows the **same key set** as maestro's main vault (`tags`, `node_type`, `is_session`, `layer`, `nature`, `status`, `veracidade`, `convicção`, `version`, `last_updated`). `node_type` values seen: `discovery`, `constitution`, `conceptual`.
- Subfolders: `assuntos/` (9 topic folders: abstraction-as-art, adaptive-formalization, agents-optimization, domain-driven-design, emergence, knowledge-topology, meta-representations, orquestracao-multi-agente, theorem), `discovery/` (essay-topics, game, interview-log, persona, phd-viability, phrasing-backlog, recommendations), `essays/` (2), `agents/`, `animations/`, `sessions/`.
- No `constitution/` folder of its own, no edge declarations seen on the sampled files.

**It already *is* a peer vault in shape.** Adopting the framework discipline here is mostly additive: declare which constitutions apply (write-style.md is functionally a style constitution; persona.md is a foundational conceptual node), add a `vault/constitution/` index if desired, and start writing future discoveries in lens shape. The voice-extraction provenance is preserved.

---

## G. Recommendation — low-risk vs higher-risk

### Low-risk (additive, can be done tonight)

1. Add lens-shape `discovery/` entries going forward in `maestro-trama/vault/discovery/` and `business-philosopher/discovery/` (the folders already exist).
2. Declare snapshot-zero pattern in `maestro-trama/vault/` (single new file).
3. Add 4 framework constitutions as peers in `maestro-trama/vault/constitution/`: frontmatter-ownership, schema-amendment-discipline, discovery-structure, vault-folder-structure. None collide with existing constitution names.
4. Add `convicção-bet-ledger-constitution.md` (formalizes what's already inline).
5. Add `verification:` field to the one existing discovery file in `vault/discovery/edges-and-types/...` as a backfill.
6. Symlink or copy `.claude/skills/close-session/` into business-philosopher if its sessions should be classified the same way (the maestro root already inherits it via the symlink chain).

### Higher-risk (must defer)

- **[DEFERRED TO USER]** Symlink stability question (D). Is `maestro-trama/domainspec → ../domainspec` permanent? The rollout shape changes if not.
- **[DEFERRED TO USER]** `internal_tools/` canonicalization (E). Three live options; no read-only signal is decisive.
- **[DEFERRED TO USER]** Edge catalog reconciliation: maestro's `vault/ontology-conventions.md` Appendix C (14 edges) vs. framework's `.claude/skills/custom/edge-catalog.md`. Need to confirm they are the same 14, mostly the same, or divergent — and pick one source of truth.
- **[DEFERRED TO USER]** Edge-acyclicity constitution adoption is gated on the above.
- Governs/runtime-witness adoption — wait for runtime surface.

### Not recommended

- Backfilling all existing maestro `vault/` nodes into lens shape. The existing shape is internally consistent and works; only new discoveries should adopt the lens convention.
- Touching `business-philosopher/` content. Add structure around it; don't rewrite voice artifacts.

---

## H. Migration cost estimate (future session, full adoption)

| Workstream | Effort | Risk |
|---|---|---|
| Low-risk additive items (G.1–G.6) | 1 short session | low |
| Edge catalog reconciliation + edge-acyclicity constitution | 1 session of focused triage; requires reading both catalogs in full and producing a merge decision doc | medium — touches both repos |
| business-philosopher peer-vault declaration (constitution index, snapshot zero, close-session wiring) | 1 short session | low |
| `internal_tools/` canonicalization | **2–4 sessions** if option 2 or 3 in (E) is chosen: API contract review, port `vault_routing` MCP/cli/store/embedder/scorer (~10 modules) into /domainspec, deprecate or merge `vault_ctl`/`graph_retrieval`, repoint maestro to consume from /domainspec, dual-write or migrate `vault_index.db` | **high** — live MCP server, sqlite store, agent flows depend on this |
| Snapshot-zero pattern across maestro vault + business-philosopher | 1 short session | low |
| Backfill lens-shape + verification on existing discoveries (optional) | 1 short session if scoped to discovery/ only; 2–3 if extended to conceptual/ and premise/ | low |
| Symlink question resolution (if "transitional" — physical separation of repos) | **wildcard** — could be a few minutes (it's permanent, do nothing) or a multi-session refactor (de-symlink, vendor framework into maestro, set up sync) | conditional |

**Bottom line.** With the symlink intact, the low-risk additive layer (G) is a single session of mostly file authoring. The two real costs are the edge-catalog reconciliation (mid-size, contained) and the `internal_tools/` canonicalization (high, with a working MCP server in the middle of it). The latter is the only item that could justify deferring further until /domainspec's own `vault_ctl`/`graph_retrieval` line stabilizes enough to make a clean comparison possible.
