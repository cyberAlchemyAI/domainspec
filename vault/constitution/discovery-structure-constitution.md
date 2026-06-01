---
tags: [vault, ontology, discovery, placement, governance]
node_type: constitution
is_session: false
layer: ontology
nature: reference
status: exploratory
version: 0.2.0
last_updated: 2026-05-26
---

# Discovery Structure & Placement

> Rules for how a discovery is recorded **and where it lives**. A discovery is the durable record of a finding that emerged from investigation — its claim, the lenses that triangulate it, its open questions. Not raw notes (that is `sessions/`), not a testable hypothesis (that is `premise/`), not an adopted principle (that is `constitution/`).

---

## Objective

Discoveries are the vault's evidence-rich entry points. Each one captures *how a finding was reached* — independently visible angles (lenses) plus a synthesis README — so the finding can be examined, contested, or promoted later without re-running the investigation.

This constitution covers two related scopes:

1. **Shape (§1–§8)** — the folder layout, README, lenses, and discipline that govern any discovery placed in `vault/discovery/`.
2. **Placement (§9–§14)** — the rules for *where* a discovery or research artifact lives across the repository (vault vs apps vs proposals vs domain knowledge), how artifacts migrate when their trajectory clarifies, and which top-level directories are reserved for which trajectories.

The shape rules are deliberately small: a discovery that grows past its caps is no longer a discovery — it is a research program and should fork. The placement rules are deliberately strict: an artifact's home is decided by *trajectory*, not by who happens to read it today.

---

## 1. Folder shape

> **Scope.** The shape rules in §1–§8 apply when a discovery is **placed in `vault/discovery/`**. For placement choice across the repository (vault vs apps vs proposals vs domain knowledge), see §9–§14. A discovery that lives elsewhere (e.g. inside an app's `features/<feature>/discovery/` or inside a pre-app proposal) inherits the spirit of §1–§8 but is governed primarily by §9–§14.

Every discovery placed in the vault lives at:

```
vault/discovery/<slug>/
├── README.md
└── lenses/
    ├── 01-<lens-slug>.md
    ├── 02-<lens-slug>.md
    └── ...
```

- `<slug>` is the topic-slug pattern already used in `vault/discovery/` (no date prefix, kebab-case, 3–5 words, names the central claim).
- `lenses/` is required even if only one lens exists. The folder itself signals "this discovery is triangulated, not asserted."
- No other subfolders. Provenance beyond lenses (data files, full transcripts, large artifacts) lives outside the vault and is linked from the README.

## 2. What a discovery is

> **Scope.** A discovery may also live at `apps/<app>/features/<feature>/discovery/` or `docs/proposals/<topic>/docs/discovery/` per §9. §1–§8 govern only the `vault/discovery/` form; the epistemic definition below applies everywhere.

A discovery is:

- A **finding that survived contact with multiple angles** — not a single conclusion from a single source.
- **Read-only after first save.** Refinements happen in *new discoveries* that cite and supersede the original. The original is provenance.
- **Promotable.** A discovery may give rise to premises (testable claims extracted from it), constitutions (working principles adopted from it), or axioms (load-bearing claims it hardened). The discovery folder is preserved as the provenance trail of any downstream promotion.

A discovery is *not*:

- A session note (one conversation's working record → `sessions/`).
- A premise (an untested claim → `premise/`).
- A constitution (an adopted working principle → `constitution/`).
- A conceptual entry (a vocabulary item → `conceptual/`).

## 3. README.md — required sections

Frontmatter follows `ontology-conventions.md`. Required fields: `node_type: discovery`, `layer`, `nature`, `status`, `version`, `last_updated`, plus `veracidade` and `convicção` per the confidence dimensions.

Body sections, in order:

1. **Claim.** One sentence. The finding, stated as a proposition. If it cannot be stated in one sentence, the discovery is not yet a discovery.
2. **Status.** One line: what evidence stage the claim currently sits at, and what would move it.
3. **Summary.** 2–4 paragraphs. Intent of the investigation, the finding, what changed about the prior understanding, what remains open.
4. **Lenses.** A bulleted list linking each lens file with a one-line note on what it adds. Order matches the `NN-` prefix.
5. **Open Questions.** Bulleted. Questions the discovery surfaced but did not answer. These are candidates for future discoveries or premises.
6. **Next Moves.** Bulleted. Concrete actions the discovery authorizes — experiments to run, premises to write, constitutions to draft, lenses to add.

**Hard cap:** body ≤ 60 lines (excluding frontmatter and lens list). The README is a signpost into the lenses, not a substitute for them.

## 4. Lenses — what they are and when to add one

A **lens** is an independent investigation of one aspect of the discovery. Each lens:

- **Stands alone.** Readable without the other lenses. Cites its own sources.
- **Has a single dispatched origin.** Produced by one subagent, one literature search, one expert consultation, or one focused analytical pass. Multi-origin lenses are split.
- **Carries a one-line claim** in its frontmatter — what the lens contributes to the discovery's central claim (corroboration, falsification candidate, boundary statement, mechanism, instrumentation, etc.).

**When to add a new lens:**

- A new angle would either **strengthen confidence** in the central claim (corroboration from an independent field, formalism, or method), or
- **Sharpen the boundary** (identify a regime where the claim breaks, or where a related result imposes constraints).

**Not for:** every passing question (those go in Open Questions), small clarifications (those edit the README), or rebuttals to one specific lens (those go in a new discovery that supersedes).

**Hard cap:** ≤ 7 lenses per discovery. Past 7, the discovery has become a research program and should fork into multiple discoveries with cross-citations.

## 5. Lens file structure

Path: `lenses/NN-<lens-slug>.md`, where `NN` is the dispatch order (01, 02, …), zero-padded.

Frontmatter (minimal):

```yaml
---
lens: <lens-slug>
date: YYYY-MM-DD
dispatched_by: <agent name | literature search | expert | self>
addresses: <one-line claim about what this lens contributes>
sources: [<bibliographic refs, file paths, URLs>]
verification: [local-files-read | web-fetched | model-recall]  # one or more
---
```

The `verification` field records *how the lens was actually produced* — not what it claims, but what evidence was actually retrieved. Values:

- `local-files-read` — the lens was constructed by reading files inside this or a sibling repository.
- `web-fetched` — external sources were actually retrieved during production (web search results consulted, papers fetched, URLs read).
- `model-recall` — the lens was produced from the producing agent's training-time knowledge with no tool calls. Articulate but not investigated; should be corroborated before being treated as load-bearing.

A lens may carry multiple values if its production was mixed. A lens with only `model-recall` is second-class evidence until corroborated by a re-dispatch under stricter conditions.

Body: verbatim or lightly edited output of the investigation. No body cap, but a soft target of ≤ 1500 words. Longer artifacts should be linked, not inlined.

The dispatch order matters: later lenses may reference earlier ones. Renumbering after the fact is forbidden — if a lens is retracted, mark its frontmatter `status: retracted` and leave the file in place.

## 6. Promotion path

A discovery does not promote itself. It surfaces *candidates*:

- **Premise candidates** — testable claims extracted from the discovery. Recorded under `Next Moves` with proposed path under `premise/`.
- **Constitution candidates** — working principles the discovery argues for. Same treatment.
- **Conceptual candidates** — vocabulary items the discovery introduced or defined. Same treatment.

Actually creating those files is a separate, deliberate act. The discovery folder is preserved as provenance and cited from the promoted artifact's frontmatter (`derives-from:`).

> See §11 for graduation of state-3 discoveries into existing or new apps — a related but distinct promotion path.

## 7. Discipline

- **One artifact per investigation.** Do not split a single coherent finding across multiple discoveries.
- **No revision in place.** Refinements happen in new discoveries that `supersedes:` the original.
- **Lens independence is a discipline, not a guarantee.** If two lenses end up trivially restating one another, one of them was not actually an independent angle — merge or replace.
- **Open Questions are not TODO lists.** They are the discovery's honest accounting of what it did not resolve. They earn their place by being interesting, not by being action items.

## 8. Boundary

This constitution governs the *shape* of a discovery — its folder, its README, its lenses — and (in §9–§14) the *placement* of discovery and research artifacts across the repository. It does not govern:

- The intellectual quality of the finding (that is the reviewer's judgment).
- The choice of which lenses to dispatch (that is the investigator's judgment).
- The promotion decision into premise/constitution/conceptual (that is governed by the relevant target stage's discipline).

If the shape rules conflict with the substance of an investigation, the substance wins and this constitution updates. Discoveries are first-class; the rules describing them are second-class.

---

## 9. Placement: Three Trajectory States

Every discovery or research document classifies into exactly one of three states determined by **trajectory** — where the artifact is ultimately going, not who happens to read it today.

| State | Definition | Home | Typical examples |
|---|---|---|---|
| **(1) Domain knowledge** | About a problem, concept, schema, or pattern. May or may not ever become software. Trajectory is permanent residence as knowledge. | `domain_knowledge/<area>/` for business concepts. `system_design_knowledge/discovery/<area>/` is **reserved** for genuinely cross-app architectural patterns demonstrably reused by 2+ unrelated apps. `system_design_knowledge/` is **NOT** a home for feature-specific work even if the feature spans sub-features inside one app. | Glossary of `<topic>`; metric definitions for `<area>`; envelope shape reused by 2+ unrelated apps. |
| **(2) Discovery of an existing app** | An `apps/<app>/` already exists; this discovery feeds a feature inside that app. | `apps/<app>/features/<feature>/discovery/` (multi-file) or `apps/<app>/features/<feature>/<topic>.md` (single-file). | Discovery of `<feature>` inside `<app>`; research notes on an alternative implementation of `<feature>`. |
| **(3) Pre-app discovery** | The work will become an app, but the `apps/<app>/` is not yet created. Parking lot. | `docs/proposals/<topic>/docs/discovery/` | Discovery materials for a proposed `<topic>` whose home app has not yet been built. |

State boundaries are tested by asking: *what is this artifact's destination?* — not *who reads it today?*. Readership-based placement was considered and rejected because it conflates current consumers with eventual home: a discovery read today by two teams may still belong in one app's `features/` if that is where it will permanently live.

## 10. Discovery vs Research as Epistemic Types

Within any placement state, both `discovery/` and `research/` subfolders may exist. They are **epistemic types**, distinguished by `node_type` frontmatter — not by location:

- **`research/`** — exploration of evidence. Lenses, experiments, notes, audits. May be wrong, may be superseded. `node_type: research`.
- **`discovery/`** — consolidated conclusion citing research. Load-bearing for downstream decisions. `node_type: discovery`.

The two subfolders **never nest into each other**. `discovery/research/` and `research/discovery/` are both prohibited (see §13). The relationship "this research fed this discovery" is encoded in the frontmatter `## Connections` block via edges (`cites`, `derives-from`, `synthesized-by`) — never via file path.

Discovery and research can coexist in any of the three placement states. State determines *where* an artifact lives; epistemic type determines *what kind of artifact* it is.

## 11. Promotion Mechanics (How State 3 Graduates)

State (3) → State (2) graduation — a pre-app discovery becoming an in-app discovery once the app is created — is mechanically enforced via three layers.

### Layer 1 — Mandatory frontmatter on state (3) artifacts

Every discovery or research document in `docs/proposals/` must carry these fields:

```yaml
graduation_status: pending | graduated | abandoned
graduation_target: apps/<app>/ | domain_knowledge/<area>/ | indeterminate
graduation_trigger: "<condition that must be true to graduate>"
graduation_target_date: YYYY-MM-DD   # optional
graduated_to: <path>                  # filled only when graduation_status: graduated
graduated_on: YYYY-MM-DD              # filled only when graduation_status: graduated
```

A discovery without `graduation_status` declared cannot legally reside in `docs/proposals/`. A pre-commit hook may enforce this; absent the hook, this is reviewer-enforced.

### Layer 2 — ARCHITECTURE.md §1.0 Origin (required in every app)

Every `apps/<app>/ARCHITECTURE.md` carries a `## 1.0 Origin` section declaring one of:

```markdown
## 1.0 Origin
- Originating proposal: `docs/proposals/<topic>/` (graduated YYYY-MM-DD)
```

or:

```markdown
## 1.0 Origin
- Origin: greenfield (no preceding proposal)
```

An app without §1.0 Origin is incomplete. An app citing a still-pending proposal is a contradiction the audit will flag.

### Layer 3 — Periodic audit script

A periodic audit (e.g. `scripts/audit_proposal_graduation.py`, documented here as the enforcement endpoint; implementation deferred) reports:

- Proposals pending longer than N months without movement.
- Apps missing §1.0 Origin.
- `graduation_target` apps that exist without a backreference in the target app's §1.0.
- Contradictions between a proposal's `graduation_status` and downstream citations.

## 12. Decomposed Migration (1:1 vs 1:N)

A proposal does not necessarily migrate as a single block when it graduates:

- **1:1 graduation** — Proposal originates a single app. Discovery files migrate from `docs/proposals/<topic>/` into `apps/<app>/features/<feature>/discovery/` as a block. Git tracks the move; `graduated_to` is set on each moved file.
- **1:N graduation** — Proposal originates multiple apps, or its content fans out across types. The proposal **decomposes** per content type: each piece migrates to its correct home per §9:
  - App-bound parts move into the relevant `apps/<app>/features/<feature>/`.
  - Business knowledge moves into `domain_knowledge/<area>/`.
  - Genuinely cross-app architectural patterns move into `system_design_knowledge/discovery/<area>/`.
  - Pieces destined for future apps **stay in `docs/proposals/<topic>/`** until each graduates separately.

Each decomposed migration is a separate commit, each with its own `graduation_status: graduated` and `graduated_to` annotation. A single proposal can thus graduate in multiple waves over time.

## 13. Subfolder Convention

- Subfolder names are always plural: `discovery/`, `research/`. Never singular (`discovery_doc/`, `the_research/`).
- Discovery and research **never nest into each other**. `discovery/research/` and `research/discovery/` are both prohibited. The relationship is encoded via edges, not paths (see §10).
- A discovery topic that needs sub-grouping uses **topic subfolders**, not type subfolders. For example, `discovery/<topic>/` may contain a topic-specific `discovery.md` and supporting files; it does NOT contain `discovery/research/`.

## 14. Reserved Homes

| Path | What lives here | What does NOT live here |
|---|---|---|
| `vault/` | Constitutions, axioms, premises, ontology, sessions, conversations — governance and meta-knowledge. Vault discoveries follow §1–§8. | Feature specs, code-level discovery, app-bound artifacts. |
| `domain_knowledge/` | Business-concept knowledge: dictionaries, registries, schema explanations that exist independent of any single app's implementation. | Implementation-bound vocabulary; app-specific contracts. |
| `system_design_knowledge/discovery/` | **Reserved.** Cross-app architectural patterns demonstrably reused by 2+ unrelated apps (DI conventions, observability patterns, event-bus shapes). **Empty by default.** | Anything bound to a single app, anything feature-specific, anything where the second consumer is speculative. |
| `docs/proposals/<topic>/` | State (3) parking lot. Discoveries and research for apps that don't exist yet. Every artifact carries `graduation_status` per §11. | Anything without `graduation_status` declared in frontmatter; anything for an app that already exists. |
| `apps/<app>/features/<feature>/discovery/` | State (2) multi-file feature discovery. | Code (lives in `apps/<app>/src/`); cross-app shared knowledge; governance docs. |
| `apps/<app>/features/<feature>/research/` | State (2) feature research notes. | Same as above. |

---

## Appendix — first instance

The discovery `vault/discovery/graph-as-residue-attractor/` is the first artifact written under this constitution. If its shape violates these rules, the rules are wrong, not the discovery.

---

## Version History

| Version | Date | Change |
|---|---|---|
| 0.1.0 | 2026-05-15 | Initial. Defined discovery shape (§1–§8): folder layout, README, lenses, promotion path, discipline, boundary. |
| 0.1.1 | 2026-05-16 | Minor refinements to shape rules. |
| 0.2.0 | 2026-05-26 | Added Placement portion (§9–§14): three trajectory states, promotion mechanics, decomposed migration, reserved homes. Title broadened to "Discovery Structure & Placement". Scope clarification added to §1 and §2. |

---

## Connections

| Document | Type | Description |
|---|---|---|
| [[folder-structure-constitution]] | `references` | Placement (§9–§14) complements code folder rules; this constitution governs where discovery/research lives before and after entering an app. |
| [[vault-folder-structure-constitution]] | `references` | Placement integrates with the vault's internal layout; §1–§8 are the discovery-shaped form of the broader vault folder discipline. |
| [[domainspec-implementation-axioms]] (`.claude/skills/domainspec-implementation-axioms/SKILL.md`) | `derives-from` | AX-DS-2 (one vocabulary) and AX-DS-4 (decision space preserved) ground §9's trajectory-based placement and §14's reserved-home semantics. |
