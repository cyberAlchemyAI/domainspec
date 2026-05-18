---
tags: [vault, ontology, discovery]
node_type: constitution
is_session: false
layer: ontology
nature: reference
status: exploratory
version: 0.1.1
last_updated: 2026-05-16
---

# Discovery Structure

> Rules for how a discovery is recorded in `vault/discovery/`. A discovery is the durable record of a finding that emerged from investigation — its claim, the lenses that triangulate it, its open questions. Not raw notes (that is `sessions/`), not a testable hypothesis (that is `premise/`), not an adopted principle (that is `constitution/`).

---

## Objective

Discoveries are the vault's evidence-rich entry points. Each one captures *how a finding was reached* — independently visible angles (lenses) plus a synthesis README — so the finding can be examined, contested, or promoted later without re-running the investigation. This constitution defines the folder shape, the artifact contents, and the discipline that keeps discoveries from drifting into research dumps.

The structure is deliberately small. A discovery that grows past its caps is no longer a discovery — it is a research program and should fork.

---

## 1. Folder shape

Every discovery lives at:

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

## 7. Discipline

- **One artifact per investigation.** Do not split a single coherent finding across multiple discoveries.
- **No revision in place.** Refinements happen in new discoveries that `supersedes:` the original.
- **Lens independence is a discipline, not a guarantee.** If two lenses end up trivially restating one another, one of them was not actually an independent angle — merge or replace.
- **Open Questions are not TODO lists.** They are the discovery's honest accounting of what it did not resolve. They earn their place by being interesting, not by being action items.

## 8. Boundary

This constitution governs the *shape* of a discovery — its folder, its README, its lenses. It does not govern:

- The intellectual quality of the finding (that is the reviewer's judgment).
- The choice of which lenses to dispatch (that is the investigator's judgment).
- The promotion decision (that is governed by the relevant target stage's discipline).

If the shape rules conflict with the substance of an investigation, the substance wins and this constitution updates. Discoveries are first-class; the rules describing them are second-class.

---

## Appendix — first instance

The discovery `vault/discovery/graph-as-residue-attractor/` is the first artifact written under this constitution. If its shape violates these rules, the rules are wrong, not the discovery.
