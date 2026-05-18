# Lens 04 — Cross-Skill Continuity

## Claim

`close-session` is a **schema-stable, write-once provenance protocol** whose value scales superlinearly with the number of downstream readers that can mechanically consume it. The design must therefore (a) commit to a versioned, machine-parseable frontmatter contract with explicit migration discipline (`schema_version:` + `vault/migrations/`); (b) maintain **bidirectional discovery↔session links but unidirectional premise/constitution↔session links**, because discoveries are mutable navigation hubs while premises are evidence artifacts; (c) reuse one **kernel skill** with per-repo *adapter shims* rather than diverging copies; and (d) define "emergence" operationally as **the ratio of axioms/constitutions reachable by a clean provenance walk back to a session, measured monthly**. If after 6 months that ratio is rising while the average session-note length stays flat, the compression pipeline is working. If session notes are growing or provenance walks dead-end, the skill has become a parallel knowledge channel and must be redesigned.

## Downstream readers

| Reader | What they need from a session note | Schema fields that encode it | Hard requirement |
|---|---|---|---|
| **Future `promote-premise` skill** | All sessions that touched a given premise, with verdicts, evidence paths, and ordering. | `premise_tests_run[].premise`, `premise_tests_run[].verdict`, `premise_tests_run[].evidence`, `timestamp`, `promotion_candidate[]` | Premise path strings MUST be stable, repo-relative, and survive renames via a `previous_paths:` migration log. |
| **Future `retire-premise` sweep** | All sessions where a premise was marked `retires:`, sorted by date, with one-line reason. | `retires[]`, body line referencing each entry. | One reason-line per retired path, parseable by `^- <path>:` prefix. |
| **Human asking "why do we believe X?"** | A walk from axiom → constitution → premise → session(s) → experiments/discovery. README hubs help navigation; sessions provide the timestamped step. | `evidence_stage`, `experiments_run[]`, `artifacts[]`, body Summary. | Summary MUST be 2–4 sentences answering *intent, decision, on-disk change* — non-negotiable for human-readable traversal. |
| **Future indexing/retrieval tool (cf. lens 01 of `two-layer-platform-architecture`)** | Frontmatter that round-trips through one Pydantic model. No free-form keys, no inline prose smuggled into list values. | All fields typed; lists are lists of strings or typed objects only. | `schema_version:` mandatory so the index can refuse or migrate unknown shapes. |
| **The author, 30+ days later** | A scannable timeline. The slug + date + Summary must be enough to recall the session without re-reading. | Filename pattern `YYYY-MM-DD-HHMM-<slug>.md`, Summary, `decisions_made`. | Filename is itself a schema commitment; downstream tools sort/group by it. |
| **`folder-structure-fractal` migration tooling** | The session note must declare its layer correctly (`layer: instance`) so a future top-level `vault/{schema,instance}/` split moves it cleanly. | `layer:` (per the draft `vault-folder-structure-constitution.md`) | Sessions are *always* `layer: instance` — no exceptions. |
| **Discovery README authors** | Reverse pointer: "which session(s) spawned/updated this discovery?" | `artifacts: [vault/discovery/<slug>/]` on the session side; `## Connections` row on the discovery side. | The connecting edge must be in the catalog and legal per the edge legality matrix. |
| **Cross-repo synthesizer (hypothetical)** | A stable kernel schema so that `domainspec`, `football-stats-oracle`, `house_project` sessions are co-queryable. | `schema_version`, `repo:` field (new), kernel fields. | All repos commit to the kernel; per-repo extensions live under `extensions:` namespace. |

The non-negotiable kernel fields (every reader above needs at least one of these): `schema_version`, `created`, `timestamp`, `evidence_stage`, `files_touched`, `artifacts`, `premise_tests_run`, `retires`, `promotion_candidate`, plus the body Summary.

## Interfaces

### Session ↔ Discovery — bidirectional

Discoveries are **navigation hubs** with mutable READMEs (see `domainspec-vault-foundations/README.md` which explicitly lists the session that renamed the folder; see also the existing `## Connections` block convention in `domainspec`'s close-session Step 4). The README's `## Connections` row pointing back at the spawning session is what lets a human walking the vault answer "where did this come from?" without grepping. Since READMEs are already mutable (status, version, lenses list all change), adding a session backreference is cheap and load-bearing.

- **Session-side:** `artifacts: [vault/discovery/<slug>/]` (folder, not file — already canonical per `close-session` Step 4).
- **Discovery-side:** A `| <session-path> | spawned-by \| modified-by \| validates | <reason> |` row in the README's `## Connections` table. Written by `domainspec-vault-metadata-curator` in `bootstrap` mode, not by the author — keeps the linker honest and the catalog the source of truth.
- **Reasoning:** Discoveries are the only stage in the compression pipeline that *invites mutation* (lenses get added, status flips exploratory → settled). The bidirectional link is what lets the discovery's growth be auditable.

### Session ↔ Premise / Constitution — unidirectional (session → premise only)

Premises and constitutions are **evidence artifacts** subject to the stage-promotion discipline (see `folder-structure/SKILL.md` evidence stages, and the existing `close-session/SKILL.md` Step 3 refusal to promote). Their content is the claim plus its evidence; back-references to sessions would (a) bloat the premise file, (b) require rewriting historic premises every time a new session touches them, (c) blur the immutability of evidence-stage artifacts.

- **Session-side:** `premise_tests_run[]`, `promotion_candidate[]`, `retires[]`, `premises_created[]`.
- **Premise-side:** Nothing. Discoverability is achieved by `grep -l <premise-path> vault/sessions/` or by the future index reading frontmatter.
- **Reasoning:** This matches `domainspec`'s **forward-only session edge rule** (`vault/ontology-conventions.md` §8, quoted in domainspec's `close-session/SKILL.md` Step 4: *"Edges originating from a session node are forward-only by source… no inverse row is written on the target document."*). Generalize this rule to: **immutable evidence-stage targets receive no inverse rows; mutable navigation targets do.**

### Retirements — file kept, status flipped

When a premise is refuted, the premise file gets a `status: retired` frontmatter flip and a one-line `retired_reason:` plus `retired_by_session:` field. This is the *one* exception to the unidirectional rule — and only because retirement is a state change on the premise itself, not a session backreference. The session lists it under `retires:`; the premise gains two fields. The file is never deleted (provenance must be walkable backward).

### Schema versioning & migration

- **`schema_version: 1` frontmatter field**, mandatory, added by every `close-session` invocation. Sessions written before this field is introduced are implicitly v0 and a one-time backfill migration adds `schema_version: 0`.
- **Migration scripts live under `vault/migrations/v<from>-to-v<to>-sessions.py`** mirroring the `folder-structure-fractal` precedent (`v1-to-v2-folder-restructure.py`, 430 lines, dry-run-aborts-on-dirty-tree). Pattern proven.
- **Sessions are immutable, but their frontmatter is migratable.** The body never changes. A migration may *only* add fields, rename fields with `previous_field_name:` recorded, or normalize values (e.g. tz suffix). It may never alter Summary or decision content.
- **Each migration records itself** by writing a session note describing what it changed (the closure exercises the closure, as the fractal discovery puts it).

## Emergence — operational definition

"Emergence" is not metaphorical if we commit to a counted observable:

> **The Emergence Ratio (ER) at time T = (count of `axiom` + `constitution` documents reachable by a clean provenance walk from a session-graph traversal) / (total count of `axiom` + `constitution` documents).**

A "clean provenance walk" means: starting from an axiom, you can produce an unbroken chain `axiom ← constitution ← premise ← session(s) ← experiments/discovery` using only frontmatter fields and edge tables, with no missing links.

**What we want to see after 6 months:**
1. **ER rising** toward 1.0 — every high-stage claim has provenance.
2. **Average session-note body length flat** (~10–20 lines, well under the 25-line hard cap) — the skill stays a signpost, not a document.
3. **Stage histogram migrating upward** — month 1 dominated by `premise` and `n/a`; month 6 has a visible `constitution` and `axiom` shoulder. This is the compression actually compressing.
4. **Session-note count growing sub-linearly with code changes** — Q&A-only sessions correctly self-exclude; not every conversation produces a note.
5. **Discovery README `## Connections` blocks list sessions** — bidirectional link rate > 80%.

**Anti-signals (the design failed):**
- Sessions averaging > 30 lines → skill became a journal.
- ER stagnant or falling → notes are written but unread.
- `evidence_stage: n/a` dominates indefinitely → no claims are maturing; the pipeline is dry.
- Premise files acquire long lists of session backreferences → the unidirectional rule was violated and evidence artifacts are bloating.
- Cross-repo session schemas drift (different field names for the same concept) → kernel/adapter discipline broke down.

**How close-session's current design supports ER:** the `evidence_stage` field, the `premise_tests_run[]` structure with explicit verdicts, the `artifacts:` folder-link discipline, and the 25-line body cap all push toward sessions as compressed, machine-walkable signposts. **What it currently lacks:** `schema_version:`, an explicit `layer:` field for the future folder split, and a stated bidirectional-vs-unidirectional rule (the domainspec version states it for edges; the football-stats-oracle version doesn't).

## Evidence / Reasoning

- `/Users/victorboscaro/football-stats-oracle/.claude/skills/close-session/SKILL.md` — current baseline; already enforces the 25-line cap, refuses auto-promotion, links folders not files. These are already-correct continuity decisions. Missing: `schema_version`, `layer`, explicit reader contracts.
- `/Users/victorboscaro/domainspec/.claude/skills/close-session/SKILL.md` — sister skill that **explicitly codifies the forward-only session edge rule** (Step 4, citing `vault/ontology-conventions.md` §8). This is the canonical precedent for the unidirectional-by-default link contract; it should be ported to football-stats-oracle's variant or factored into a shared kernel.
- `/Users/victorboscaro/domainspec/vault/sessions/` — 34 existing session files spanning 2026-05-02 to 2026-05-16, demonstrating that frontmatter has *already* evolved (newer files have `parent_session`, `specs_updated`, `corpus_hash` references that earlier ones lack). Migration discipline is not hypothetical; it is already overdue.
- `/Users/victorboscaro/domainspec/vault/discovery/domainspec-vault-foundations/README.md` — last block is `## Connections` with a session row (`modified-by`). This is the **proof of concept for bidirectional discovery↔session links**, and shows the table format already in use.
- `/Users/victorboscaro/domainspec/vault/discovery/folder-structure-fractal/README.md` — lists no session in its `## Connections` (the README has none). Inconsistency confirms link discipline isn't uniformly applied; the skill must mechanize it (via the curator agent, not the author).
- `/Users/victorboscaro/domainspec/vault/discovery/two-layer-platform-architecture/README.md` Open Questions §2 explicitly raises `schema_version:` as the migration discipline question and points at `vault/migrations/`. This lens answers that open question for sessions specifically.
- `/Users/victorboscaro/domainspec/.claude/skills/nested-subagents-strategy/SKILL.md` Step 5 *"Preserve the artifact"* — explicitly tells callers to record wave sizes (N, M) and angle list in the Status line. The pattern of *making the investigation reproducible* by writing structured metadata into stable locations is the same pattern close-session must enforce.
- `/Users/victorboscaro/domainspec/vault/sessions/2026-05-16-0700-folder-structure-fractal-discovery.md` — already carries a `parent_session:` field, evidence that **session-to-session linking** is also a real need (not just session↔discovery and session↔premise). Add `parent_session:` to the kernel schema.

**Cross-repo concerns.** A repo inventory shows:
- `football-stats-oracle/.claude/skills/` has only `close-session` and `folder-structure` — minimal, solo-dev scale, no curator agent.
- `domainspec/.claude/skills/` has 100+ skills including a metadata-curator, edge catalogs, edge legality matrix.
- `house_project`, `app-launch` (referenced but not inspected) presumably sit between these extremes.

The skills have **diverged for valid reasons** (football-stats-oracle deliberately says "no curator agent exists in this repo… no Sonnet delegation — solo-dev scale, single classification axis"). But they share an identical *kernel*: triage gate, scratchpad consumption, evidence-stage classification, candidate-premise capture, artifact folder-linking, 25-line body cap, the YYYY-MM-DD-HHMM filename pattern.

**Recommendation: shared kernel + per-repo adapter shim.**

- **Source of truth:** `/domainspec/.claude/skills/close-session/SKILL.md` is the most mature; promote it. Extract the kernel into `/domainspec/.claude/skills/close-session/KERNEL.md` (frontmatter schema, file path, triage gates, body cap, hard rules).
- **Per-repo `SKILL.md`** imports the kernel by reference and adds local extensions: football-stats-oracle adds the `evidence_stage` axis and skips Steps 2 + 4 (no Sonnet, no curator); domainspec keeps Steps 2 + 4; house_project adds whatever it needs.
- **Sync discipline:** kernel changes propagate via a `sync-close-session-kernel` skill (one per repo), running monthly or on kernel version bump. Each propagation writes its own session note. Drift becomes visible and fixable.
- **Why not full unification:** the skills correctly encode local capacity (single dev vs curated, single axis vs multi-axis). Forcing one skill imposes domainspec's overhead on football-stats-oracle. The kernel is the invariant; the rest is content-domain-specific — exactly the two-layer pattern the platform discovery prescribes.

## Open Questions

1. **Who runs the migrations?** A new skill (`migrate-sessions`), a one-shot script, or hand-edit + verify? The fractal discovery's `v1-to-v2-folder-restructure.py` precedent suggests a script with dry-run-on-dirty-tree safety, but session-only migrations are smaller and might not deserve their own tool.
2. **Should `schema_version:` live on the session frontmatter or be inferred from filename date?** Date-inference is cheaper but assumes monotonic schema evolution; an explicit field is robust but requires writing it everywhere. Probably explicit, but worth a lens to confirm.
3. **Cross-repo `repo:` field — does it belong in the kernel or in the per-repo extension?** If sessions are ever queried across repos by a single tool, kernel. If not, extension. Depends on whether cross-repo retrieval is on the roadmap (the platform discovery suggests yes, eventually).
4. **The bidirectional rule for discoveries: does the curator write the backreference at session-close time, or does a separate `index-discovery-backreferences` sweep run periodically?** Curator-at-close-time is atomic and fail-loud; a sweep is decoupled but can lag. Both work; pick by latency tolerance.
5. **How does close-session interact with the proposed `vault/{schema,instance}/` top-level split (folder-structure-fractal)?** Sessions are clearly `instance`. But if the split happens, sessions move from `vault/sessions/` to `vault/instance/sessions/`, and every existing session's `artifacts:` paths to discoveries need migration. This lens does not resolve the timing — it just records that close-session is downstream of the folder fractal decision.
6. **Emergence Ratio measurement tooling — out of scope here.** Someone has to write the walker that computes ER from frontmatter + edges. It's the natural first consumer of the platform discovery's `vault_telemetry` subsystem, but this lens cannot specify it without overstepping the angle.
7. **What about Q&A-only sessions that *should* have produced a note but didn't?** The current triage gate is author-judged. Over six months, are we missing provenance because the gate is too lax? No way to know from inside the skill — needs an external audit, possibly the same ER walker reporting "claims with no spawning session."
