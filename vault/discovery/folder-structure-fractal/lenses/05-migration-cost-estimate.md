---
lens: migration-cost-estimate
date: 2026-05-16
dispatched_by: subagent — engineering estimate of migration cost for the fractal-folder proposal
addresses: Precise migration cost for adopting the proposal in /domainspec; cheaper alternatives; recommendation
sources:
  - /Users/victorboscaro/domainspec/vault/discovery/folder-structure-fractal/README.md
  - /Users/victorboscaro/domainspec/vault/discovery/folder-structure-fractal/lenses/02-fractal-folder-theory.md
  - /Users/victorboscaro/domainspec/vault/discovery/folder-structure-fractal/lenses/01-prior-research-catalog.md
  - /Users/victorboscaro/domainspec/vault/snapshots/2026-05-16-v0.1.json
  - /Users/victorboscaro/domainspec/internal_tools/vault_common/edges.py
  - /Users/victorboscaro/domainspec/internal_tools/vault_common/walker.py
  - /Users/victorboscaro/domainspec/internal_tools/vault_common/config.py
  - /Users/victorboscaro/domainspec/internal_tools/vault_ctl/cli.py
  - /Users/victorboscaro/domainspec/internal_tools/vault_ctl/amendments.py
  - /Users/victorboscaro/domainspec/internal_tools/vault_ctl/bets.py
  - /Users/victorboscaro/domainspec/internal_tools/vault_ctl/governance.py
  - /Users/victorboscaro/domainspec/internal_tools/vault_ctl/cycles.py
  - /Users/victorboscaro/domainspec/internal_tools/vault_common/amendments.py
  - /Users/victorboscaro/domainspec/internal_tools/vault_common/bets.py
  - /Users/victorboscaro/domainspec/internal_tools/vault_common/governance.py
  - /Users/victorboscaro/domainspec/internal_tools/vault_telemetry/residue.py
  - /Users/victorboscaro/domainspec/vault/migrations/v0-to-v1.py
verification: [local-files-read]
---

# Lens 05 — Migration Cost Estimate

## A. File-move count

From `vault/snapshots/2026-05-16-v0.1.json` (111 files), grouped by current top-level and mapped per Lens 02 §C.

| Source (current)                                              | Destination (proposed)                              | Count |
|---|---|---|
| `vault/constitution/*.md` (15 files)                           | `vault/schema/constitution/*.md`                    | 15    |
| `vault/ontology-conventions.md`                                | `vault/schema/conventions/ontology-conventions.md`  | 1     |
| `vault/confidence-levels.md`                                   | `vault/schema/conventions/confidence-levels.md`     | 1     |
| `vault/ontology-architecture-draft.md`                         | `vault/schema/ontology/architecture-draft.md`       | 1     |
| `vault/foundational-knowledges.md`                             | `vault/schema/ontology/foundational-knowledges.md`  | 1     |
| `vault/agent-navigation.md`, `vault/human-navigation.md`       | merged → `vault/README.md` + `schema/conventions/navigation.md` | 2 |
| `vault/migrations/v0-to-v1.py` (not a `.md` but listed in repo)| `vault/schema/migrations/v0-to-v1.py`               | 1     |
| `vault/amendments/*.md` (1 file)                               | `vault/schema/amendments/*.md`                      | 1     |
| `vault/axiom/*.md` (4)                                         | `vault/instance/axiom/*.md`                         | 4     |
| `vault/premise/*.md` (6)                                       | `vault/instance/premise/*.md`                       | 6     |
| `vault/conceptual/*.md` (2)                                    | `vault/instance/conceptual/*.md`                    | 2     |
| `vault/bets/*.md` (1)                                          | `vault/instance/bets/*.md`                          | 1     |
| `vault/discovery/**` (38, incl. `_backlog.md` + 8 subtrees)    | `vault/instance/discovery/**` (path-only mv)        | 38    |
| `vault/sessions/*.md` (38)                                     | `vault/instance/sessions/*.md`                      | 38    |
| `vault/snapshots/*.json` (1)                                   | `vault/instance/snapshots/*.json` (or `schema/`)    | 1     |
| **Total moved**                                                |                                                     | **112** (111 .md + 1 .py) |

Net: **every file moves**. Zero stay at their current path. The discovery subtree is path-only (`git mv vault/discovery vault/instance/discovery`) — internal structure preserved.

## B. Internal-link update count

Two distinct populations of links.

**B.1 Frontmatter edge fields** (`derives-from:`, `cites:`, `governs:`, `supersedes:`, `lenses:`, `for_claim:`, plus the other 10 verbs in `EDGE_FIELDS`). Grep across `vault/**/*.md` for lines starting with any edge verb: **~8 distinct frontmatter edge declarations across ~8 source files**, but each declaration commonly carries 2–5 list entries. The vault's edge density is *low* today — most frontmatter declares `tags` and `node_type` only; explicit `derives-from`/`governs` lists exist mostly in newer artifacts (the four R1–R4 closure constitutions, the `graph-as-residue-attractor` lenses, the `folder-structure-fractal` lenses). Conservative estimate of edge *targets* needing rewrite: **~40–60 path strings**.

**B.2 Prose path references inside markdown bodies.** `grep -rE "vault/(constitution|discovery|premise|axiom|conceptual|sessions|bets|snapshots|amendments|migrations|backlog|assets|ontology-conventions|...)"` against `vault/**/*.md` returns **871 lines**. This is the dominant cost. Constitutions cite each other in prose (e.g. `schema-amendment-discipline-constitution.md` carries 8 such refs; `domainspec-subagents-strategy-constitution.md` 8). Discoveries cite constitutions and sibling lenses by full path.

**Aggregate**: ~**900 internal path references** across ~**60 source files** require rewriting. A regex pass (`s|vault/constitution/|vault/schema/constitution/|g`, repeated per moved root) handles ~95% mechanically; the remaining ~5% need human review (re-named files like `agent-navigation.md` → merged into `README.md`).

## C. Tool-surface changes

| File | Change | Est. LoC |
|---|---|---|
| `vault_common/config.py` | `DOMAINSPEC_VAULT` unchanged (root stays `/Users/victorboscaro/domainspec/vault`). `exclude_dirs` currently excludes `snapshots`, `migrations` — both moved under `schema/`, so the exclusion still works by *folder name* (not by path), but should be reviewed: add `schema/snapshots`-equivalent? Probably **no change** if exclusion remains by folder-basename; 0 LoC. | 0–3 |
| `vault_common/walker.py` | `walk_vault` already does `rglob("*.md")` with basename-level exclusion. New folders `schema/` and `instance/` walk normally. | 0 |
| `vault_common/edges.py` | Edge extractor is path-agnostic. | 0 |
| `vault_common/frontmatter.py` | Add `layer: schema | instance` field per Lens 02 §C.F; add validator that path under `schema/` ⇒ `layer == schema` (and vice versa). | ~20 |
| `vault_common/bets.py` | `BETS_DIR_NAME = "bets"` — basename check `parts[-2] == "bets"` survives because `instance/bets/B-NNN.md` still has `bets` as the parent. | 0–2 |
| `vault_common/amendments.py` | Docstring references `vault/amendments/`; if it has a similar basename check, survives. Update docstring. | ~3 |
| `vault_common/governance.py` | Docstring path reference only. | ~2 |
| `vault_ctl/cli.py` | No hardcoded sub-paths beyond `DEFAULT_CONFIG.vault_roots[0] / "snapshots"` in the `snapshot` command (line 113) — needs to become `… / "instance" / "snapshots"` (or wherever snapshots land). | ~2 |
| `vault_ctl/amendments.py` | `_AMEND_DIR = _VAULT / "amendments"` (line 22) → `_VAULT / "schema" / "amendments"`. User-facing strings at lines 73, 118 echo `vault/amendments/` → update. | ~5 |
| `vault_ctl/bets.py` | `vault_root = DEFAULT_CONFIG.vault_roots[0]` followed by path under `bets/` (line 62) → prefix `instance/`. | ~3 |
| `vault_ctl/governance.py` | Walks vault via `walk_vault`; references `vault/constitution/` in prose only. Constitution coverage probably scans for `node_type: constitution`, which is path-agnostic. Verify, update docstrings. | ~5 |
| `vault_ctl/cycles.py` | Uses `extract_edges` over `walk_vault`; path-agnostic. Docstring update. | ~2 |
| `vault_telemetry/residue.py` | Folder-agnostic: uses `fm.get("node_type")` and `"/lenses/"` substring check (line 85). The substring `/lenses/` still appears under `instance/discovery/<slug>/lenses/`, so works. No change. | 0 |
| `vault_telemetry/cli.py` | Likely path-agnostic. | 0 |
| `vault/migrations/v0-to-v1.py` | `VAULT_ROOT = Path(__file__).resolve().parent.parent` (line 19) — assumes script lives in `vault/migrations/`. After move to `vault/schema/migrations/`, becomes `…parent.parent.parent` — **must change** or break. Docstring refs to `vault/constitution/...` need update. | ~5 |
| **Five existing constitutions** prose path-refs (35 total `vault/` strings across `constitution/*.md`) | Update prose refs (largest: `schema-amendment-discipline` 8, `domainspec-subagents-strategy` 8, `domain-tagging` 6, `discovery-structure` 4). These are content edits, not tool edits. | (counted in §B) |
| `vault_common/sqlite.py`, `embedder.py`, `events.py` | Did not read; assume path-agnostic given the kernel pattern. Spot-verify. | 0–10 |

**Tool LoC total**: ~**50–70 lines** across ~10 files. The kernel-with-thin-shells architecture pays off here: only `config.py` is a candidate root-of-truth and it doesn't need to change.

## D. Cross-repo link breakage

`grep` across `vault/**/*.md` for absolute paths into sibling repos returns **24 lines**, ~14 unique targets:

- `/Users/victorboscaro/house_project/docs/vault/{ontology-conventions,ontology-architecture-draft,conceptual/event-system-foundations}.md`
- `/Users/victorboscaro/house_project/specs/ontology/backlog.md`
- `/Users/victorboscaro/maestro-trama/{vault/, domainspec/}`
- `/Users/victorboscaro/domainspec-theorem/docs/{categorical-extraction-schema, domainspec-two-layer-framework, lean-formalization-guide, meta-layers-reference}.md`
- `/Users/victorboscaro/domainspec-theorem/lean-formalization/DomainSpec.lean`

**Outbound breakage**: zero if those repos remain at their current shape (domainspec restructures, others stay flat). The outbound references in /domainspec point to *file basenames* in sibling repos that aren't moving.

**Inbound breakage**: every external reference to `/Users/victorboscaro/domainspec/vault/constitution/...` from `house_project`, `maestro-trama`, `financas_pessoais`, `domainspec-theorem` would break. *Not measured here* — requires reading those repos. Lens 01 §D confirms `house_project` and `maestro-trama` ship byte-identical copies of `folder-structure-constitution.md`; they may reference back into /domainspec less often than the reverse. **Estimate: 5–30 inbound refs across sibling repos**, requiring per-repo `sed` passes.

## E. Git history continuity

A `git mv` of an entire directory is a single op; git's rename detection (no `--follow` needed) preserves history when content is unchanged in the same commit.

**Recommended workflow** (3 commits, in this order):

1. **`git mv` commit only** — `git mv vault/constitution vault/schema/constitution`, `git mv vault/discovery vault/instance/discovery`, etc. ~12 `git mv` invocations (one per top-level destination folder). No content edits. History is preserved via rename detection.
2. **Link-rewrite commit** — single mechanical pass (~900 substitutions across ~60 files) plus tool LoC changes. Diff is large but content-only.
3. **Schema/amendment commit** — add `layer:` field to frontmatter, write `vault-folder-structure-constitution.md`, write amendment record.

Splitting steps 1 and 2 is the critical discipline: combining them defeats `git log --follow` on any moved file. **12 `git mv` operations; history preserved if step 1 is content-free**.

## F. Snapshot bookkeeping

R2 (schema-amendment discipline) requires an amendment-log entry. Work:

- One amendment file: `vault/schema/amendments/2026-05-17-fractal-folder-restructure.md`, ~80 lines (trigger: this lens family; dependents: every moved file; review: Wave 2 verdict; migration script ref). **~30 min**.
- One new constitution: `vault/schema/constitution/vault-folder-structure-constitution.md`, ~200 lines (grammar, layer field, migration discipline, supersedes the misnamed code-only `folder-structure-constitution.md`). **~2 h**.
- Two snapshots: `vault-corpus-v0.1` already exists. Run `vault-ctl snapshot vault-corpus-v2-folder-restructure` after migration (one CLI invocation, ~5 min).
- Update `vault-ctl snapshot` to write under the new snapshots path (covered in §C).

**Snapshot+amendment work: ~3 h.**

## G. Dry-run script complexity

`vault/schema/migrations/v1-to-v2-folder-restructure.py --dry-run` needs to:

1. Walk every file (use `walk_vault`).
2. Compute destination path from a per-source-root map (~15 rules; same as §A table).
3. For each file's text, run a list of regex substitutions to update internal links (the same regex set used to rewrite link refs).
4. For each file's frontmatter, add `layer:` field derived from new path.
5. Emit a JSON plan: `[{from, to, edits: [{line, old, new}]}]`.
6. `--apply` mode: shell out to `git mv` and write rewritten files.
7. Verify post-migration: `vault-ctl validate --strict` and `vault-ctl edges-check --strict` pass.

Reusing `walk_vault` + `parse_doc` + the edge extractor, the script is **short (100–300 LoC)**. Closer to 200. Pattern follows `v0-to-v1.py` (~80 LoC for a simpler in-place fm-only mutation).

## H. Total estimate

| Phase | Optimistic | Expected | Pessimistic |
|---|---:|---:|---:|
| Design + new constitution drafting | 2 h | 4 h | 8 h |
| Migration script (incl. tests) | 4 h | 8 h | 16 h |
| Dry-run + manual verification | 2 h | 4 h | 8 h |
| Execute `git mv` + link rewrite | 1 h | 2 h | 4 h |
| Tool LoC updates (~50–70 lines, ~10 files) | 2 h | 4 h | 8 h |
| Snapshot + amendment bookkeeping | 2 h | 3 h | 6 h |
| Re-validation + fixing dangling edges | 1 h | 3 h | 8 h |
| **Subtotal (/domainspec only)** | **14 h** | **28 h** | **58 h** |
| Cross-repo follow-on (per-repo, 3 repos) | 4 h | 9 h | 24 h |
| **Total** | **18 h** | **37 h** | **82 h** |

Expected: **~1 focused engineering week** for /domainspec alone; **~1.5 weeks** including cross-repo.

## I. Cheaper alternatives

**(I.1) Symlinks (`vault/schema -> vault/constitution`-style).** Adds top-level semantic surface (a directory called `schema/`) without breaking any path. Cost: **<1 h**, zero link rewrites. But: directories with multiple sources (e.g. `schema/` needs to aggregate `constitution/`, `ontology-conventions.md`, `confidence-levels.md`, `ontology-architecture-draft.md`, `foundational-knowledges.md`) can't be a single symlink. Would need symlinked individual files; degenerates into a parallel naming system. **Verdict: cosmetic, not structurally honoring S5.**

**(I.2) Frontmatter-only (`layer:` field, no moves).** Add the validating invariant without touching paths. Cost: **~3 h** (extend `NodeFrontmatter`, write validator, backfill 111 files with `layer:` via a one-shot script). Tooling: residue/walker/cycles unchanged. Loses navigational stratification (a human grep'ing `vault/constitution/` still sees a mixed folder), but enforces the semantic check. **Most cost-effective option that closes the type-marker (B.3) reading.**

**(I.3) Partial: move only the truly meta artifacts.** `mkdir vault/schema && git mv vault/constitution vault/ontology-conventions.md vault/ontology-architecture-draft.md vault/confidence-levels.md vault/foundational-knowledges.md vault/amendments vault/migrations vault/schema/`. Leave `discovery/`, `premise/`, `axiom/`, `conceptual/`, `sessions/`, `bets/`, `snapshots/`, `backlog/` at root (implicitly the `instance/` layer). Cost: **~12 h** (half of expected full migration). Captures S5 at the top level (schema is visibly outside the rest), keeps `instance/`-side paths unchanged (zero rewrites for the 80% of references that point into `discovery/`). Forgoes the *fractal* claim but honors the *two-layer* claim. **Best cost-benefit if the two-layer guarantee is the load-bearing benefit (it is, per Lens 02 §B).**

## J. Recommendation

**Adopt (I.3) — partial top-level move — combined with (I.2) — `layer:` frontmatter — and defer full fractal restructure until empirical pressure justifies it.**

Argument:

1. **Cost asymmetry.** Full migration (37 h expected) costs ~3× the partial (12 h). The marginal benefit — `instance/` as an explicit folder prefix, the fractal Unit shape recursively applied — is **not measured** by any current consumer. Lens 02 §G honestly flags: "the cost-benefit of recursive mirroring is not empirically established." A vault of 111 files cannot generate the load that would discriminate the two designs.

2. **S5 closure is achieved cheaply.** The Russell-dodge concern (schema documents inside the instance graph) closes once `vault/schema/` exists as a sibling, irrespective of whether `vault/instance/` is named explicitly. The partial move achieves the *visible* stratification the proposal's central argument requires.

3. **The `layer:` field is the falsification hook.** Without it, *neither* the full nor partial folder structure can mechanically prevent drift. With it, a constitution-level invariant (`path under schema/ ⇔ layer == schema`) becomes auditable. Adding `layer:` is the highest-leverage 3-hour investment in the entire proposal.

4. **The fractal shape can be opted into per-Unit, post-hoc.** Lens 02's grammar permits `Unit ::= README + [schema/] + [instance/] + [lenses/]` with optional slots. Discoveries that grow local schema can add `schema/` then; no top-down forcing required. The fractal becomes a *capability*, not a *requirement*.

5. **Cross-repo cost is the hidden multiplier.** Doing the full migration in /domainspec creates pressure to migrate /house_project (~30 entries) and /maestro-trama (~5 entries) for consistency. The partial move generates less of that pressure because `vault/schema/` can be adopted per-repo independently without cascading instance-side rewrites.

6. **Reversibility.** Partial move is recoverable in one `git revert`. Full move's link rewrites (~900 substitutions) are mechanically reversible only by re-running the inverse migration script, which is a non-trivial new artifact to maintain.

**Concrete next moves**:

1. Draft `vault/constitution/vault-folder-structure-constitution.md` declaring the partial top-level (`schema/` + flat instance siblings) and the `layer:` invariant. (~3 h)
2. Extend `NodeFrontmatter` with `layer:` field + path-coherence validator. (~3 h)
3. Single migration commit: `git mv` the 8 schema artifacts under `vault/schema/`; sed-rewrite the ~50 prose references to those paths in constitutions and discoveries; update `_AMEND_DIR` and `v0-to-v1.py`'s `VAULT_ROOT`. (~6 h)
4. Run `vault-ctl validate --strict && edges-check --strict && snapshot vault-corpus-v0.2-schema-stratified`. (~1 h)
5. Amendment log entry. (~1 h)
6. Re-evaluate the fractal shape after the next 90 days of vault growth. If `vault_ctl` traversal genuinely becomes case-split-by-folder, adopt the full Unit grammar at that point. If not, the partial+layer-marker combination is the resting state.

**Total committed cost: ~14 h (partial+layer-marker), vs ~37 h (full fractal). Saves ~23 h with ~80% of the claimed benefit.**

The full fractal proposal is **not rejected** — it is **deferred until measured load justifies it**. This is exactly the discovery-side `graph-as-residue-attractor` discipline applied to its own folder-shape mirror: act when the residue is large enough to be a signal, not when the theorem is elegant.
