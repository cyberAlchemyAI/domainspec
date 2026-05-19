---
tags: [vault, lens-findings, close-session-redesign]
node_type: findings
is_session: false
layer: ontology
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-17
dispatch_status: historical
retrofits: true
synthesized-by: ../../research/research.md
backfilled: true
---

# Findings — Cross-Skill Continuity

## Objective

Treat close-session as a schema-stable, write-once provenance protocol and enumerate downstream readers, edge-direction contracts, schema-versioning discipline, and a cross-repo kernel/adapter pattern.

## Headline claim

A session note's value scales superlinearly with the number of downstream readers that can mechanically consume it. The design must commit to a versioned machine-parseable frontmatter contract; maintain **bidirectional discovery↔session links but unidirectional premise/constitution↔session links**; reuse one **kernel skill** with per-repo adapter shims; and define "emergence" operationally as the **Emergence Ratio** = axioms reachable by clean provenance walk / total axioms.

## Downstream readers (what each needs)

Future `promote-premise` (stable premise paths, `previous_paths:` for renames); future `retire-premise` sweep (`retires[]` parseable by prefix); human walking provenance (filename pattern + 2–4-sentence Summary); future indexing tool (typed frontmatter, `schema_version:`); folder-structure-fractal migration (`layer: instance`); discovery README authors (`artifacts:` on session side + `## Connections` row on discovery side); cross-repo synthesizer (`repo:` field + shared kernel).

## Edge-direction contracts

- **Session ↔ Discovery — bidirectional.** Discoveries mutate (lenses added, status flips). The reverse pointer makes growth auditable.
- **Session → Premise/Constitution — unidirectional.** Evidence-stage artifacts are immutable; backrefs would bloat them. *Immutable evidence-stage targets receive no inverse rows; mutable navigation targets do.*
- **Retirement exception.** Premise file gains `retired: true` + `retired_reason` + `retired_by_session` — a state change on the premise, not a backreference.

## Schema versioning

`schema_version: 1` mandatory; migration scripts under `vault/migrations/v<from>-to-v<to>-sessions.py` (precedent: `v1-to-v2-folder-restructure.py`); sessions immutable but frontmatter migratable (add fields, rename with `previous_field_name:`, normalize values — never alter Summary or decisions). Each migration writes its own session note.

## Emergence Ratio

ER(T) = `(axiom/constitution docs reachable by clean provenance walk) / (total axiom/constitution docs)`. Success after 6 months: ER → 1.0, avg body length flat, stage histogram migrating upward, discovery README backref rate > 80%. Anti-signals: sessions > 30 lines, ER stagnant, `evidence_stage: n/a` dominant, premise files bloating with backrefs.

## Kernel / adapter

Promote domainspec's `close-session/SKILL.md` to kernel; per-repo `SKILL.md` imports kernel + adds extensions (football-stats-oracle skips curator steps); `sync-close-session-kernel` skill propagates kernel bumps monthly.

## Caveats

- Designs for a fleet of repos and curator infrastructure that does not exist for football-stats-oracle.
- ER walker is out of scope; ER is `0/0` for ≥6 months until enough axioms exist.

## Open Questions

- Who runs migrations? Script vs hand-edit.
- `schema_version` in frontmatter vs inferred from filename date?
- `repo:` in kernel vs per-repo extension?
- Curator-at-close-time vs periodic sweep for discovery backrefs?
- Timing relative to `vault/{schema,instance}/` split?

## Connections

- `derives-from` → `../../discovery.md`
- `derives-from` → `../../research/research.md`
