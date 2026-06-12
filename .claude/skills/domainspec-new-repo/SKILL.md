---
name: domainspec-new-repo
description: "Start a NEW DomainSpec consumer repo (a sibling, not the current repo — distinct from domainspec-start, which initializes DomainSpec inside an existing repo). Scaffolds the system-modeling partition-architecture tree — the subject-primary shape validated by the hand-built goldenquill instance (knowledge/{domain_knowledge, system_design_knowledge, vault} + implementation/ + research/ + sessions/ + schema/ + optional experiments/ and internal_tools/ mirror) — attaches the shared framework half across a clone-safe boundary, seeds the knowledge partitions, and writes a provenance session node. Decides only the THREE scaffold-time branch points (top-axis, system_design split, attach-mode); never coins edges or re-litigates the discovery's research OQs. Gate-first: --dry-run is the default; it proposes a plan and confirms once before any write, and verifies the knowledge/vault canon resolves to a real doc rather than a broken symlink."
argument-hint: "<target-repo-path> [--top-axis subject|ownership] [--system-design-split single|method-vs-design] [--attach submodule|copy|symlink] [--source <framework-repo-path>] [--with-internal-tools] [--mode plan|apply]"
allowed-tools: Read, Write, Glob, Grep, Bash, AskUserQuestion, Task
---

<!--
FRONTMATTER NOTES (load-bearing only):
- agent: omitted — the parent session orchestrates directly (no agent dispatch).
- allowed-tools declares Task (used only for the optional internal_tools sub-scaffold), not Agent.
- Generated artifacts: README stubs are node_type: readme; the provenance session is
  is_session: true + node_type: discovery (forward-only edges) per custom/frontmatter.md.
- Default --top-axis is subject (the validated goldenquill R-1 shape), NOT the discovery's
  retracted ownership-primary D-1. ownership stays reachable, recorded as a bet.
-->

# Skill: DomainSpec New Repo

<objective>
Stand up a brand-new DomainSpec **consumer repo** as the system-modeling partition-architecture tree — the subject-primary shape the hand-built `goldenquill` instance validated — as a deterministic, idempotent, gate-first procedure: materialize the partition tree, attach the shared framework half across a **clone-safe** boundary, seed the knowledge partitions, and write a provenance session node. The skill decides only the **three** branch points that actually change the tree (top-axis, `system_design_knowledge` split, attach-mode); it coins no edges, enforces nothing, and re-litigates none of the discovery's research-only Open Questions. Default mode is `--dry-run`: it proposes the full plan and confirms once before any write.
</objective>

<context>
AUTHORITY: `vault/discovery/system-modeling-partition-architecture/discovery.md` (`status: draft`, "exploratory design, not proof, and nothing here is enforced", inheriting schema-of-schemas' "gate-first is the standing precondition"). Read it before planning — this skill operationalizes it; it is not a new design.

This skill codifies what was applied **by hand** to create `goldenquill` (the only on-disk instance). The skill was conceived in that discovery under the lineage name `partition-scaffold`; it is named `domainspec-new-repo` for the family, and the goldenquill instance (scaffolded 2026-06-09, before the rename) is the same lineage. That run recorded a `Revision 2026-06-09` set this skill reproduces as the as-built shape — in places **superseding** the discovery's tentative D-rows:
- **R-1** — top path axis is **subject** (`knowledge/` at top), ownership lives in frontmatter, **superseding the discovery's ownership-primary D-1** (which self-labels "tentative, low conviction"). This skill defaults to subject and treats `--top-axis ownership` as a reachable, recorded bet.
- **R-2** — `internal_tools/` is a **scoped** recursion: the per-project tree MINUS the shared framework layer (no `arcanum/`, no `domainspec/`, no `system_design_knowledge/`, no further `internal_tools/`).
- **R-5** — `implementation/` interior is governed by `folder-structure-constitution.md` (a slot here, not populated by this skill).
- **R-6** — `schema/` is a **project-local** schema-extension layer (plus `code-ontology/`), distinct from the base schema that ships with the framework.
- **D-2/D-3** (un-retracted) — one global schema, no per-depth recursion; `sessions/` is a modality (`is_session: true`, forward-only, never promoted).

THE TWO DEFECTS goldenquill shipped, which this skill must NOT reproduce (both disk-confirmed):
1. The framework was attached via gitignored **absolute/local symlink shims** (`domainspec`, `.claude`, `.github`, `.codex`, `arcanum`) that **broke on clone**: on the cloned repo, `knowledge/vault/ontology-conventions.md` is a one-line path string `../../domainspec/vault/ontology-conventions.md`, not a real doc, and the shim targets are absent. → This skill defaults `--attach submodule`, demotes symlink to a warned opt-in, and **verifies the canon resolves to a real non-empty doc** after attach (Step 7).
2. **Two** `sessions/` dirs coexist (`sessions/` and `knowledge/domain_knowledge/sessions/`) with no canonical pick (goldenquill's own Open Question). → This skill canonicalizes to **one** (`sessions/` top-level) and refuses to emit the second.

The body family is domainspec-* (`<objective>/<context>/<process>/<output-contract>`). The seeded framework inventory is RESOLVED from `--source` at run time — not hardcoded to goldenquill's literal file list — so the skill scaffolds ANY consumer repo, not only the one it was reverse-engineered from.
</context>

<inputs>
- **`<target-repo-path>`** (required) — directory for the new repo. Created behind the master gate. If it already contains a populated `knowledge/` or `implementation/` partition tree, WARN + confirm (this skill scaffolds; it does not migrate an existing tree).
- **`--source <framework-repo-path>`** — the framework repo supplying the canon (`vault/**`), the dev constitutions (`vault/constitution/*-constitution.md`), the carve-out (`.claude/`, `.github`, `.codex`, `arcanum`), and the `schema/code-ontology/` + `experiments/` machinery. DEFAULT: the repo this skill ships in (nearest-ancestor `.git`).
- **`--top-axis`** — `subject` (DEFAULT — goldenquill R-1, the validated shape) | `ownership` (discovery D-1; reachable, recorded as a bet, pre-pays the OQ-2 externalization seam).
- **`--system-design-split`** — `single` (DEFAULT — the discovery's one-partition table) | `method-vs-design` (OQ-4 opt-in: `system_design_knowledge/{reusable_method, this_system_design}/`; recorded as a project-local bet, never a settled fact).
- **`--attach`** — `submodule` (DEFAULT, clone-safe, forward-compatible with the OQ-2 externalization) | `copy` (real files, drift-records source commit) | `symlink` (OPT-IN ONLY: relative-only, warned that it breaks on clone/move — goldenquill's exact defect).
- **`--with-internal-tools`** — also lay the R-2 scoped `internal_tools/` mirror. ASK if unset (goldenquill carries it).
- **`--mode`** — `plan`/`dry-run` (DEFAULT — emit the plan, write nothing) | `apply` (mutate, after the master gate).

INVARIANTS (not parameters — never optional): idempotent + non-clobbering (re-run fills gaps, never overwrites without the gate); always-on provenance session; always-on SEED-GAP reporting; sessions canonicalized to one; nothing enforced (no CI, no binding validator, no migration hook).
</inputs>

<resolved-source-map>
Resolved from `--source` (`<FW>`) at run time. A partition with no resolvable source is a **SEED GAP** — reported, never fabricated. The goldenquill-witnessed inventory is the reference; resolve the actual set from `<FW>` by Glob.

| Destination (under `<target>`) | Source | Mechanism |
|---|---|---|
| `knowledge/vault/**` (ontology canon: `ontology-conventions.md`, `agent-navigation.md`, `confidence-levels.md`, `human-navigation.md`, `foundational-knowledges.md`, `axiom/ conceptual/ constitution/ discovery/ premise/`) | `<FW>/vault/**` | **attach** (submodule mount / copy / relative symlink) — canon, read-only-by-intent |
| `knowledge/system_design_knowledge/*-constitution.md` | `<FW>/vault/constitution/*-constitution.md` | **copy (editable seed)** — see split below |
| `schema/code-ontology/**` (`code-ontology.json`, `TAXONOMY.md`, `RELATIONSHIPS.md`, validator, `tests/`) | `<FW>` code-ontology bundle | **copy** (runnable in-repo — never symlink) |
| `experiments/**` (`PROTOCOL.md`, `README.md`, `_TEMPLATE/`, `tools/validate_proposal.py`, `tools/hooks/pre-commit`) | `<FW>` experiments machinery | **copy** (runnable, stdlib-only) — opt-in |
| Framework carve-out (`domainspec`, `.claude`, `.github`, `.codex`, `arcanum`) | `<FW>` itself | **attach** (the shared half) |

**Dev-constitution split (disk-true — NOT "6 byte-parity copies").** goldenquill seeds the **process** constitutions as real editable copies and **stubs** the architecture-specific ones:
- COPY (real, editable): `commit-message-`, `development-practices-`, `folder-structure-`, `frontend-constitution.md`.
- STUB (`[scaffold, stub]`, "intentionally NOT seeded — fill per the project's chosen architecture"): `event-system-`, `robot-talks-constitution.md`.
Resolve the actual process-vs-architecture split from `<FW>`; do not blindly byte-copy every constitution.
</resolved-source-map>

<target-tree>
Subject-primary (default). `[stub]`=generated README · `[attach]`=framework-attach · `[copy]`=editable copy · `[seed-stub]`=intentionally-empty seed · `[gen]`=generated.

```
<target>/
├── README.md                              [gen — root; project identity + "Nothing here is enforced yet (gate-first)"]
├── .gitignore                             [gen — OS/editor noise; symlink mounts only if --attach symlink]
├── knowledge/
│   ├── README.md                          [stub — "subject-grouped; ownership in frontmatter (R-1)"]
│   ├── domain_knowledge/
│   │   ├── README.md  axiom/  conceptual/  discovery/  premise/   [stub — node-type folder mirrors; user fills]
│   │   └── (NO sessions/ — canonicalized away; see sessions/ below)
│   ├── system_design_knowledge/
│   │   ├── README.md                      [stub]
│   │   ├── {commit-message,development-practices,folder-structure,frontend}-constitution.md  [copy]
│   │   └── {event-system,robot-talks}-constitution.md            [seed-stub]
│   │   # IF --system-design-split method-vs-design: split into reusable_method/ + this_system_design/
│   └── vault/
│       ├── README.md                      [stub — read-only-by-intent canon]
│       └── (ontology canon)               [attach]
├── implementation/  README.md             [stub — interior governed by folder-structure-constitution.md (R-5); not populated here]
├── research/        README.md             [stub — the birthplace (R-4); derives-from routing, no decisions/ findings/ subfolders]
├── sessions/                              [THE one canonical sessions dir — modality (D-3)]
│   ├── README.md                          [stub]
│   └── <YYYY-MM-DD-HHMM>-scaffolded-by-domainspec-new-repo.md    [gen — provenance, is_session: true]
├── schema/          README.md  code-ontology/   [stub + copy — project-local extension layer (R-6)]
├── experiments/                           [--with-experiments — copy machinery]
└── internal_tools/                        [--with-internal-tools — R-2 scoped mirror]
    # per-project tree MINUS the shared layer: own schema/ knowledge/{domain_knowledge,vault} implementation/
    # research/ sessions/ experiments/ — but NO arcanum/, NO domainspec/, NO system_design_knowledge/, NO nested internal_tools/
```

IF `--top-axis ownership`: re-project the top level into shared-framework vs per-project halves per the discovery's "Today vs Future" diagram (the shared half = the attached dependency; per-project = `domain_knowledge/ implementation/ research/ sessions/`). Record the choice as a bet in the provenance session.
</target-tree>

<modes>
- `plan` / `dry-run` — **DEFAULT.** Steps 1–4: resolve inputs + source map, render the target-tree diff and the ordered action list (each tagged reversible vs irreversible), write NOTHING. The plan is the deliverable; mutation is an explicit opt-in.
- `apply` — Steps 1–8: runs the plan after the Step-5 master confirmation gate, then writes the provenance session. Never auto-selected. Abort at the gate ⇒ nothing persists; a partial run still writes a session node recording where it stopped.
</modes>

<process>
Gate-first. Steps 1–4 read and plan only. Step 5 is the single master gate. Steps 6–8 mutate only under `apply`, idempotently (every create checks existence; never clobber without the gate's authorization).

**Step 1 — Resolve inputs, the framework source, and the three decisions; detect target state.**
Resolve `<target>`, `--source` (default = this skill's repo root), `--attach` (default `submodule`; if the target won't be a git repo, fall back to `copy`), `--top-axis` (default `subject`), `--system-design-split` (default `single`). Read the source discovery fresh (re-derive the live D-rows / OQs from disk; don't trust this skill's literals blind). Confirm `<FW>` carries the expected pieces (`vault/ontology-conventions.md`, `vault/constitution/*-constitution.md`, the code-ontology bundle, the experiments machinery, the `.claude/` carve-out) — Glob each; a missing piece becomes a SEED GAP, never an invention. If `<target>` already holds a populated partition tree, WARN ("this is a re-scaffold/migration, separate concern") and require confirm before continuing.

**Step 2 — Build the resolved-source-map from `<FW>` (not from goldenquill's literal list).**
Per `<resolved-source-map>`, resolve each source path by Glob. Split the dev constitutions into process-copies vs architecture-stubs from what `<FW>` actually carries. Mark each destination CREATE / SKIP-EXISTS / CONFLICT / SEED-GAP.

**Step 3 — Compose the target tree from `<target-tree>` + the resolved decisions.**
Branch the layout on `--top-axis` (subject default vs ownership re-projection) and `--system-design-split` (single vs method-vs-design). Emit exactly ONE sessions dir (`sessions/` top-level). Every directory gets a README stub with `node_type: readme` frontmatter and the goldenquill stub body (R-1/R-2/R-4/R-5/R-6 framing). Do not inflate thin nodes into folders (D-2).

**Step 4 — Render the dry-run plan + ordered action list.**
Emit: the resolved decision summary; the target-tree diff (per-node CREATE/SKIP/CONFLICT); the source map (dest → source → copy|attach|stub|SEED-GAP); the attach plan with the exact submodule/copy/symlink command that will run; the two defect handlings (clone-safe attach + sessions canonicalization); any CONFLICTs; the OQ-6 not-enforced warning line. Under `plan`/`dry-run` (the DEFAULT), STOP here — disk untouched.

**Step 5 — MASTER GATE (only past here under `apply`).**
One `AskUserQuestion`: present the plan and confirm **proceed | revise | abandon**, surfacing the three decisions (top-axis, sd-split, attach-mode) with their defaults and — if `--attach symlink` was chosen — the inline "breaks on clone/move" warning, and how to handle any CONFLICTs (skip / overwrite-with-backup / abort). `revise` ⇒ back to Step 1 with the named change. `abandon` ⇒ nothing persists. Only `proceed` unlocks mutation.

**Step 6 — Materialize the tree + stamp README stubs (idempotent).**
Create every directory; write each README stub (`node_type: readme`, `is_session: false`, `layer: ontology`, `nature: reference`, `status: active`, `version: 0.1.0`, `last_updated: <revision>`; no `veracidade`/`convicção` — except the `experiments/README.md`, which carries them, matching source). SKIP-EXISTS unless the gate authorized overwrite.
**Step 6b (optional) — internal_tools mirror.** If `--with-internal-tools`, lay the R-2 scoped mirror (per-project MINUS the shared layer). May dispatch one `Task` worker to isolate it; else inline.

**Step 7 — Attach the framework + seed partitions + VERIFY canon resolves.**
Per `--attach`: `submodule` (`git submodule add <FW>` at `domainspec/`; point `knowledge/vault/**` into it via relative, in-repo paths) | `copy` (copy the canon + carve-out as real files; record `<FW>` commit for future sync) | `symlink` (relative-only; re-warn; record the breakage risk + the "convert to submodule" debt as a Next Step). Seed `system_design_knowledge/` with the process-constitution **copies** + architecture **stubs**; copy `schema/code-ontology/` and the experiments machinery as **real runnable files** (never symlink these). **VERIFY (Bash, non-negotiable):** `knowledge/vault/ontology-conventions.md` must resolve to a real, non-empty doc — NOT a one-line path string (the broken-symlink signature). If it fails, the attach failed: report and stop; do not leave a broken shim. Confirm `python3 schema/code-ontology/validate_ontology.py` self-checks.

**Step 8 — Write the provenance session + report.**
Write `sessions/<YYYY-MM-DD-HHMM>-scaffolded-by-domainspec-new-repo.md` modeled on goldenquill's session: frontmatter `node_type: discovery`, `is_session: true`, `layer: ontology, architecture`, `nature: procedural, technical`, `status: active`, `conversation_id`, `timestamp`, `expires` (~+60d), `decisions_made: true`, `expected_importance`, `importance_rationale`; forward-only edges (`derives-from` the source discovery, `cites` `ontology-conventions.md`). Body: **Summary** (skill + `<FW>` revision + attach mechanism actually used + source commit if copy); **Decisions** (the three resolved branch points, each noting the discovery OQ/R-revision it relates to, and any `ownership`/`method-vs-design`/`symlink` choice flagged a RECORDED BET, not a settled fact); **Open Questions** (anything deferred + the SEED-GAPs); **Next Steps** (`git init`/first commit if deferred, convert shims to submodule if symlink, fill `domain_knowledge/` with the project's own concepts); **Files touched**. Write the root `README.md` (`node_type: readme`; objective + the `domainspec-new-repo` / `Revision <label>` provenance line + "Nothing here is enforced yet (gate-first)"). Emit the `<output-contract>` report. NOTE in the session: this is the first **skill-driven** run — state which choices were witnessed vs transferred from the goldenquill hand-build.
</process>

<output-contract>
Return:

```markdown
## DomainSpec New Repo Result

- Mode: plan/dry-run | applied
- Target: <path>  (greenfield: yes | re-scaffold confirmed)
- Framework source: <path> @ <commit/revision>
- Top axis: subject (default, validated) | ownership (RECORDED BET)
- system_design_knowledge: single | method-vs-design (RECORDED BET)
- Attach: submodule | copy | symlink(opt-in)  — canon resolves to real doc: PASS | FAIL
- Sessions: one canonical (sessions/); second dir refused: yes
- Partitions seeded: <list>   stubbed: <list>   SEED-GAPs: <list or none>
- Constitutions: <N copied real> + <M seed-stubs>
- internal_tools mirror: laid (R-2 scoped) | skipped
- experiments machinery: copied | skipped
- README stubs: <count>   Files written: <n>   Skipped (existed): <n>   Clobbered: 0
- Provenance session: sessions/<...>-scaffolded-by-domainspec-new-repo.md
- Enforcement: none (gate-first) — wire the node_type validator into CI before any partition rule binds
- exit_reason: success | not_greenfield_confirmed | user_abort | attach_verify_failed | seed_gap_halt
- Next action: <e.g. git init + first commit; convert symlink shims to submodule; fill domain_knowledge>
```
</output-contract>

<quality-bar>
A successful run must:
- reproduce the **subject-primary R-1 shape** by default (ownership only as an explicit, recorded bet) — never silently ship the discovery's retracted ownership-primary D-1;
- create every directory + README stub with the correct `node_type: readme` frontmatter and faithful R-1/R-2/R-4/R-5/R-6 body framing;
- attach the framework by a **clone-safe** mechanism by default (submodule/copy) and **VERIFY** `knowledge/vault/ontology-conventions.md` resolves to a real non-empty doc — never leave a one-line broken-symlink shim;
- seed `system_design_knowledge/` as the disk-true split (process constitutions **copied editable**; architecture constitutions as `[scaffold, stub]`) resolved from `--source`, not a blind 6-file byte-copy;
- copy `code-ontology/` + experiments machinery as **real runnable files** (never symlinked);
- emit exactly **one** sessions dir; keep the canon read-only-by-intent and the consumer repo standalone;
- gather the **three** scaffold-time decisions and confirm **once** (master gate); coin no edges (OQ-3) and decide no content-placement (OQ-5) and no enforcement (OQ-6 → a warning line);
- be **idempotent + non-clobbering**; default to `dry-run`; mutate nothing before the master gate;
- write a provenance session (`is_session: true`, `node_type: discovery`, forward-only edges) recording the decisions, the attach mechanism used, SEED-GAPs, and which choices are witnessed vs transferred.
</quality-bar>

<anti-patterns>
Avoid:
- defaulting to `--top-axis ownership` (the discovery's **retracted** D-1) or presenting either axis as settled authority — subject is the validated default; ownership is a recorded bet;
- reproducing the **broken symlink shims** as the default (absolute or local) — symlink is relative-only, opt-in, warned; the broken-shim signature is a `knowledge/vault/*.md` whose entire content is a path string like `../../domainspec/vault/ontology-conventions.md`;
- claiming/performing a "6 byte-parity constitution" copy — it is process-copies + architecture-stubs, resolved from `--source`;
- symlinking the dev constitutions, `code-ontology/`, or the experiments tooling (those are editable/runnable real copies); editing the attached canon in-project (read-only);
- emitting **two** sessions dirs; promoting a session; writing the session with `is_session: false` or a back-edge;
- turning OQ-3 (routing edge), OQ-5 (epistemic-discipline placement), or OQ-6 (enforcement) into scaffold gates — they don't change the tree; OQ-3 must go through the schema-amendment gate, never coined inline; OQ-6 is a warning line;
- per-action sub-gating or HALT-on-non-greenfield as a hard stop — one master confirm + non-clobber invariant is the right altitude; non-greenfield is warn+confirm;
- giving `internal_tools/` a nested `arcanum/`, `domainspec/`, `system_design_knowledge/`, or further `internal_tools/` (R-2 is scoped — framework-MINUS);
- inflating thin nodes into folders beyond `<target-tree>` (no per-depth recursion, D-2);
- fabricating a source the framework repo lacks instead of reporting a SEED-GAP; marking the consumer repo as tracked by the framework (it is standalone);
- mutating under `dry-run`; treating `apply` as the default; scaffolding any CI / binding validator / migration hook (migration stays manual);
- declaring `Agent` instead of `Task`; adding tier/domain/version/surface_kind sigil frontmatter.
</anti-patterns>
