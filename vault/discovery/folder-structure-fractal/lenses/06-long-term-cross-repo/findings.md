---
tags: [vault, lens-findings, folder-structure-fractal]
node_type: findings
is_session: false
layer: ontology
nature: explanatory
status: consolidated
version: 0.1.0
last_updated: 2026-05-18
dispatch_status: backfilled-no-prompt-recoverable
---

# Findings — Long-Term Scale + Cross-Repo Applicability

## Provenance (pre-migration lens header)

- **Lens slug.** `06-long-term-cross-repo`
- **Original dispatch date.** 2026-05-16
- **Dispatched by.** subagent — long-term scaling + cross-repo applicability evaluation
- **Original `addresses` line.** Whether the fractal-folder proposal survives growth and works across the five vaults
- **Verification.** [local-files-read]
- **Sources (pre-migration list).**
  - /Users/victorboscaro/domainspec/vault/discovery/folder-structure-fractal/README.md
  - /Users/victorboscaro/domainspec/vault/discovery/folder-structure-fractal/lenses/02-fractal-folder-theory.md
  - /Users/victorboscaro/domainspec/vault/discovery/folder-structure-fractal/lenses/01-prior-research-catalog.md
  - /Users/victorboscaro/domainspec/vault/ (ls)
  - /Users/victorboscaro/house_project/docs/vault/ (ls + discovery/)
  - /Users/victorboscaro/maestro-trama/vault/ (ls + discovery/)
  - /Users/victorboscaro/financas_pessoais/ (no vault; agents/<role>/{manifesto,backlog,newsletter,constitution}.md instead)
  - /Users/victorboscaro/football-stats-oracle/domain_knowledge/ (discovery/<date-slug>/raw/)


The proposal (lens 02) defines `Unit ::= README.md schema/ instance/ lenses/`, top-level `vault/{schema,instance}/`, and `layer:` frontmatter as a redundant validator. The fractal claim is normative: the host shape should witness the residue-attractor theorem. The question this lens asks is empirical: does the shape survive five very different repos and three orders of magnitude of growth?

## A. Cross-repo applicability

The five vaults are not five instances of the same thing. They are five different shapes.

**1. domainspec** (`/Users/victorboscaro/domainspec/vault/`). The framework's home. ~15 top-level folders, 6 root `.md` files. Has both schema (constitution/, ontology-*, conventions, migrations/) and instance (discovery/, premise/, axiom/, sessions/, bets/, snapshots/). The schema/instance distinction is conceptually present and currently carried by **a mix of folder (constitution/) and root-flat-files (ontology-conventions.md)**. Proposal fits cleanly — this is what it was designed against. Cost: ~6 root files move, every existing `vault/discovery/*` gets one extra path segment, the `amendments/` and `backlog/` residues acknowledged in lens 02 §F remain residues.

**2. house_project** (`/Users/victorboscaro/house_project/docs/vault/`). Older sibling, denser. Adds `audits/`, `conventions/`, `diagrams/`, `domain/`, `victor/`, plus six root dictionary files (`dictionary-business.md`, `dictionary-events.md`, `dictionary-sys.md`, `graph-edges.md`, `graph-session-index.md`, `meta-layers-diagram.md`). Two discoveries, both **flat `.md` files** at `discovery/`, not Unit-shaped folders. The schema/instance distinction is carried mostly **by prose** (dictionaries are content-of-content but live as root peers of conceptual/, premise/). Proposal applies but with friction: `victor/` and `domain/` are neither schema nor instance in the framework's sense — `victor/` is a person-namespace (proto-Vladimir slot), `domain/` is product-context. They'd land in `instance/` reluctantly. The flat-file discoveries do not need the Unit shape and forcing it is gratuitous. **Obstacle:** the dictionary files are *schema for content extracted from the product*, not schema for the vault. The schema/instance binary collapses two distinct schema layers (vault-schema vs product-schema).

**3. maestro-trama** (`/Users/victorboscaro/maestro-trama/vault/`). Newer sibling, sparse. Has both `sessions/` and `conversations/` (already a drift, flagged in lens 01 §D). One discovery (`edges-and-types/`) plus one orphan flat discovery file (`2026-05-15-trama-and-maestro-ontology-extensions.md`). Proposal applies cleanly because the vault is small enough that any restructure is cheap. **No obstacle** — but no benefit either, because the schema/instance population is too sparse for the split to disambiguate anything.

**4. financas_pessoais** (`/Users/victorboscaro/financas_pessoais/`). **There is no vault.** The repo's knowledge layout is `agents/<role>/{manifesto.md, backlog.md, newsletter.md, system-prompt.md, constitution.md, principles.md, AGENT_CONTRACT.md, decisoes/}` and `domains/<area>/`. It is **agent-organized, not graph-organized**. The schema/instance distinction is conceptually present (constitution.md, AGENT_CONTRACT.md, principles.md are schema; backlog.md, decisoes/* are instance) but the carrier is **per-agent folder**, not a vault. The proposal *cannot apply as written* — it presupposes a vault. To apply it, financas would need a vault first, which is a separate decision. **Obstacle: the vault is the unit of standardization the proposal extends; financas opted out of that unit.**

**5. football-stats-oracle** (`/Users/victorboscaro/football-stats-oracle/domain_knowledge/`). Top-level mirrors a vault (conceptual/, constitution/, discovery/, premise/, sessions/) but is named `domain_knowledge/`. The discovery shape is **different**: `discovery/2026-05-15-foundations-bootstrap/raw/` — date-prefixed slugs, a `raw/` subfolder instead of `lenses/`. This is `discovery/<bundle>/raw/d*.md`, not `discovery/<slug>/lenses/NN-*.md`. **Obstacle: the discovery shape diverges from the constitution domainspec ships.** If the proposal's `Unit` grammar lands here, it overrides football's `raw/` convention, which itself was a local choice that worked. The proposal does not address whether `raw/` is a misnamed `lenses/` or a genuinely different slot.

**Summary of A.** Schema/instance presence: domainspec yes, house_project yes (with a third "product-schema" layer the proposal doesn't name), maestro-trama yes (sparse), financas no-vault, football yes-but-renamed. Strictly-content vaults: none of the five. Strictly-schema vaults: none of the five. **Lens-shape divergence is real**: domainspec's `lenses/NN-<slug>.md` is not football's `raw/d*.md`, and house_project has no lens convention at all. The proposal must either override these (force convergence) or accommodate them (weaken the grammar). Lens 02 implicitly forces convergence by stating one grammar.

## B. Long-term scale

**100 files (current).** domainspec is at this scale. Proposal cost is mostly link-rewrite and one extra path segment. No depth problem.

**1,000 files (12 months).** The recursive Unit shape starts mattering. If 50 discoveries each grow 3 lenses and 10 of those grow sub-lenses, paths reach 6–7 segments: `vault/instance/discovery/<slug>/lenses/05-<sub>/lenses/01-<leaf>.md`. Tooling stays performant (1k files is trivial). The **schema/instance split holds at this scale** because the schema side grows slowly (a constitution per major decision, maybe 20–30 documents total) while the instance side absorbs most growth. The split actually pays off here: a `vault/schema/` of ~30 files is browsable; a flat `vault/` of ~1000 is not.

**10,000 files (24+ months, optimistic).** Strain points:
- **Depth.** The Unit-on-Unit recursion at 4+ levels produces paths like `vault/instance/discovery/A/lenses/03-B/lenses/02-C/lenses/01-D.md`. This is legal but unreadable. Lens 02 §E acknowledges the +1/+2 segment cost but does not bound depth. At 10k files, some chains will be 5–6 deep. The ≤7-lenses-per-Unit cap controls *breadth* but says nothing about *depth*.
- **Schema bifurcates.** At 10k files there will be schema-of-schema (rules for writing constitutions) and possibly schema-of-schema-of-schema (frontmatter for amendment frontmatter). The two-layer split was never going to hold against this; the framework's own §2.3 admits arbitrary $\mathcal{L}_n$. The folder proposal hardcodes a binary that the theory says is unbounded. **At 10k, a `vault/schema/schema/` subfolder will appear and the binary will leak.**
- **Tooling.** `vault_ctl walk` over 10k files with recursive Unit grammar is still fast. `git mv` operations during the inevitable next restructure are the slow path — a deep folder tree makes those costlier (each rename touches more refs).
- **Sessions** (already 34 files in domainspec) hit 1k+ at this scale. The proposal's "leaf in `instance/sessions/`" escape hatch (lens 02 §G) becomes the place where 80% of file count lives, and it doesn't fit the Unit shape. The fractal claim is mostly aspirational by 10k.

## C. Reflection-tower interaction

The framework claims uniqueness migrates upward across reflection levels. The folder proposal hardcodes two levels (schema, instance). Should there be `vault/instance/level-0/`, `vault/instance/level-1/`?

**No — and the proposal is right to avoid it.** The tower is *not a discrete enumeration of named levels*; it is a generative relation (each level is the meta of the one below). Encoding levels as folder names would require knowing how many levels exist, which is exactly what the framework refuses to commit to. The level is **already implicit in the discovery + amendment + supersedes-chain structure**: a discovery about constitutions is one level up from a discovery about premises, by virtue of what it cites, not by virtue of where it sits.

But this creates a tension with the proposal: `vault/schema/` is *level-1* relative to `vault/instance/` (level-0). A schema-of-schema constitution is level-2 — where does it live? Lens 02 §G hints that `vault/schema/` is itself a Unit with its own lenses for schema evolution; that nests level-2 *inside* level-1, which works but is not honest about the recursion. **The clean answer is: the folder split is a two-level approximation that is right for now and will need a level-3 escape valve later.**

## D. Vladimir-onboarding cost

Vladimir is the convergence-test partner: two agents producing the same hom-presheaves independently. The folder structure is part of what he must learn.

**Recursive Unit shape vs flat-per-node-type.** Vladimir today learns "axiom/ holds axioms, premise/ holds premises, discovery/ holds discoveries — and inside discovery, the new constitution says README + lenses/." That's two rules. The proposal replaces this with one rule (Unit) applied at every depth. **For a long-term collaborator, one rule beats N rules.** But the cost is the *first-encounter* tax: a Vladimir who sees `vault/instance/discovery/<slug>/lenses/05-<sub>/README.md` must already know the Unit grammar to read the path. With the current layout he can read `vault/discovery/<slug>/lenses/05-<sub>.md` and infer everything.

**Schema/instance split clarification.** For a newcomer, `vault/schema/` vs `vault/instance/` *clarifies*: "rules live left, content lives right." This is the proposal's strongest onboarding win.

**Convergence test.** Two agents producing the same hom-presheaves benefits from the proposal because **the shape itself is a hom**: if both agents agree the vault is a `Vault ::= schema/ + instance/` object, the structural identity of their outputs is mechanically checkable. With the current flat layout, agreement is prose-level. **The proposal helps the convergence test.**

## E. Drift detection

Lens 01 §D documented uncaught drift across three vaults (sessions/ vs conversations/, audits/ only in one, etc.) despite byte-identical constitution files. The proposal makes drift mechanically detectable:

- With explicit `vault/schema/` siblings across repos, a literal `diff -r domainspec/vault/schema/ house_project/docs/vault/schema/` enumerates divergence in seconds. Today this comparison requires manual enumeration because schema is scattered (root .md files + constitution/ + conventions/ + dictionary-*.md depending on the repo).
- The `layer:` frontmatter invariant + path coherence check means a CI job can verify the cross-cut on each repo independently. Today there is no cross-cut to check.
- **However**: the proposal does not specify a cross-repo schema-canonicalization protocol. It only enables detection. Resolution (who owns the canonical `vault/schema/constitution/discovery-structure-constitution.md`?) is unspecified. **Drift becomes visible but not resolvable** without a separate decision about cross-repo schema ownership.

## F. Future-proofing

**Second framework / Vladimir's domain sharing the vault.** `vault/instance/vladimir/` as sibling of `vault/instance/discovery/` is consistent with the grammar but **mixes person-namespace with node-type-namespace**. House_project already has `victor/`, so the precedent exists. The proposal accommodates it by treating Vladimir's content as another `Unit` subtree; the cost is that `instance/` becomes a mixed bag of (node_type folders + person folders). **Accommodates, but blurs.**

**Multimedia assets.** Lens 02 doesn't name them; they're a residue (it punts on `vault/assets/`). The natural placement under the grammar is `vault/instance/<topic>/assets/`, but `assets/` is not a Unit slot. Either add it (`Unit ::= README schema/ instance/ lenses/ assets/`) and lose the four-slot minimalism, or shove assets into `instance/` as a non-Unit leaf and live with the irregularity. **Cleanly accommodates only by widening the grammar.**

**Cross-references between repos.** Today these are implicit (file paths in prose). The proposal does not address cross-repo edges. With explicit schema layers, a `vault/schema/` document in repo A could be cited by name from repo B's frontmatter (e.g., `derives-from: domainspec://schema/constitution/discovery-structure-constitution`). This is *more* tractable under the proposal because schema has a stable namespace. **Helps, mildly.**

**Generated content.** `vault/instance/<topic>/generated/` is not a Unit slot either. Same problem as assets. The proposal would need either an explicit `generated/` slot or a frontmatter `nature: generated` marker + gitignore convention. Lens 02 is silent. **Punts.**

## G. Strongest case FOR at 12 months

At 1k files, the **two killer wins** are: (1) `diff` between `vault/schema/` directories across the three sibling vaults catches drift mechanically — closing the residue lens 01 §D named — and (2) onboarding (Vladimir, future contributors, future Victor-after-six-months) drops to two rules ("schema lives left, instance lives right; every folder is a Unit"). The current state — one formal folder rule (discovery shape), one misnamed constitution, six root .md files by convention only — is not survivable at 1k files. **The proposal buys a navigable schema layer and a mechanical drift check. Both are unavailable today and will be unavailable in 12 months without this or an equivalent move.**

## H. Strongest case AGAINST at 12 months

The proposal **locks in a two-level split** (`schema/` vs `instance/`) that the framework's own theory says is the first two levels of an unbounded tower. By 12 months there will be schema-of-schema artifacts (amendments to the frontmatter constitution, governance of the governance constitution) and the binary will leak into `vault/schema/schema/` or `vault/instance/about-schema/` ad-hoc. The same lens-01-style drift the proposal closes at level-0↔1 will reopen at level-1↔2. **We will wish we had used a `level:` frontmatter integer + flat folder, not a binary folder split.** Additionally, the recursive Unit grammar is right *as theory* but **sessions, assets, generated content, and person-namespaces all break it as practice**. By 12 months the four-slot grammar will have grown to six or seven slots or will be honored mostly in the breach. The Unit shape will be **aspirational at 10k**.

A secondary concern: financas_pessoais demonstrates that a working knowledge-system can exist without a vault. The proposal's universalism assumes all five repos *should* converge on the vault shape. That assumption is not separately defended.

## I. Recommendation

**Partial adoption.** Specifically:

1. **Adopt the top-level `vault/{schema,instance}/` split (lens 02 §B reading 1).** This is the load-bearing win for drift detection (E) and onboarding (D). Migration cost is bounded (one move per existing folder, ~15 ops on domainspec). Do this first on domainspec; record migration entry per R2; replicate on house_project and maestro-trama in separate per-repo work as lens 02 anticipates.

2. **Adopt the `layer:` frontmatter invariant + path coherence validator.** Cheap; closes the path/content drift before it starts.

3. **Defer the recursive mirror split (lens 02 §B reading 2) — `schema/` and `instance/` inside every Unit.** Make it *optional and on-demand*: a Unit gains a local `schema/` only when it has local rules; otherwise the slot does not exist. This is what lens 02 §C already proposes (optional slots), but elevate it from "optional" to "default-absent." Forcing the recursion at every level is the part most likely to be honored in the breach by 12 months (B, H).

4. **Adopt the `Unit ::= README + lenses/` shape for discoveries and grown lenses only.** This matches what discovery-structure-constitution already mandates. Do not extend `Unit` to sessions, bets, snapshots, assets, generated content, or person-namespaces. Acknowledge these as **non-Unit residues** explicitly in the new constitution rather than calling them exceptions.

5. **Decline to encode reflection-tower levels as folders** (C). Keep level implicit in citation structure. Reserve `vault/schema/` as level-1 with the understanding that level-2 will need a separate decision when it arrives — do not pre-commit.

6. **Decline to apply to financas_pessoais.** It is not a vault. If financas later grows a vault, apply then.

7. **Apply to football-stats-oracle with a renaming carve-out**: `raw/` is football's `lenses/`-analogue for an evidence-bundle discovery shape. Either rename to `lenses/` (cheap) or recognize a second Unit variant `EvidenceUnit ::= README + raw/`. Do not silently override.

8. **Before any of (1)–(7), draft the cross-repo schema-canonicalization protocol** that (E) identifies as missing. Drift detection without a resolution rule is half a feature. Without this, the proposal makes drift *visible* and *unactionable*, which is worse than invisible drift because it generates open tickets without closing them.

The proposal's core move — making schema/instance separation visible at the folder level — is right and should ship. The proposal's maximal move — recursive Unit at every depth, mirror schema/instance inside every Unit, one grammar across all five repos — overreaches what the next 12 months will actually use. Ship the floor; defer the ceiling; revisit at 1k files.

## Connections

- `synthesized-by` → `../../research/research.md`
- `cited-by` → `../../discovery.md`
