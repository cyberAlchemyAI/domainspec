---
node_type: discovery            # CANONICAL enum value — do NOT drift to "engineer-view" (not an enum member)
status: exploratory             # discovery status enum (exploratory | settled | ...)
governance_status: project-local-overlay   # LOAD-BEARING. Local delta beyond the sibling house shape. Intentional, not drift. Keeps this view OUT of promotion until the owning amendment is filed.
topic: <PROJECT> — engineer-view (the mechanics and the verdicts)
last_updated: <YYYY-MM-DD>
created_by: <author-email>
---

<!--
FRONTMATTER NOTE (do not ship this comment):
This frontmatter INHERITS the hand-authored DISCOVERY shape defined in
`discovery-writing.md` + `frontmatter.md` (the OWNING conventions — inherit by reference,
do not re-derive). The ONLY local delta is `governance_status: project-local-overlay`.
This is HAND-AUTHORED DISCOVERY frontmatter; bootstrap-only fields are FORBIDDEN here:
NO surface_kind / canonical_source / generated_by / mutation_policy (those assert a
regenerate-from-canonical-source contract that does not exist for a hand-authored artifact).
NOTE: the one validated on-disk engineer-view (the GoldenQuill worked example) carries NO
governance_status field — it is a skill-introduced delta this template adds; do not expect to
see it in the worked example.
-->

# Engineer-view — <PROJECT>

> This is the **engineer-view** of a two-view pair. Its companion,
> [`system-view.md`](system-view.md), explains the *shape* one conceptual layer at a time and
> **names** the load-bearing stances without deciding them. This view **refines** that one down to
> the contracts, schemas, and the decision inventory — and it is where every named stance gets its
> **single owning verdict**. Nothing is decided twice: where a stance is relevant to both altitudes,
> system-view points here, and the verdict lives only here. Beneath both sits
> [`ontology-view.md`](ontology-view.md), the typed-schema floor — this view redefines no term and
> points there for term meaning.
>
> **What this view OWNS:** the **decision inventory** (every load-bearing stance resolved to one
> verdict with a status — RESOLVED / OPEN / CRITICAL — and a cited authority); the **schemas and
> contracts**; and the **runtime mechanics**.
>
> **What this view POINTS ACROSS for:** the **shape** (up to `system-view.md`) and **term meaning**
> (down to `ontology-view.md`). It re-narrates no shape and redefines no term.
>
> **Frontmatter note:** this view carries one field beyond the sibling house style —
> `governance_status: project-local-overlay`. It is intentional and load-bearing (it keeps the view
> out of promotion until the owning amendment is filed), not schema drift.
>
> **Provenance & mutation — derive-only.** This view is **reconciled from its source
> [`discovery.md`](discovery.md)**, the **sole sanctioned mutation trigger** for it: do not hand-edit
> this file. To change it, revise (or supersede) the discovery and re-run `/engineer-view <project>
> --mode draft` (evolve), which reconciles this view against the discovery delta while **preserving its
> authored verdicts, RESOLVED/OPEN/CRITICAL statuses, and cited authorities**. The `## Connections`
> block records the `derives-from` edge and the discovery `version` last reconciled against — if the
> discovery's current `version` is higher, this view is **STALE**. This is *reconcile-not-regenerate*,
> which is exactly why no `generated_by` / `mutation_policy` frontmatter is carried.

---

## Objective

<!-- <= 3 sentences. Name the load-bearing decisions this view owns and the discipline that keeps
them single-owned. Inherit the objective-first <=3-sentence gate from discovery-writing.md. -->

<FILL-IN: 1–3 sentences. State the central value thesis of the target, name that this view owns the
single verdict for every stance the system-view names, and state the discipline: one verdict per
stance, each with a status and an authority verified on disk; shape deferred up to system-view, term
meaning deferred to ontology-view.>

---

## What this view owns

Four things system-view defers here:

1. The **decision inventory** — every load-bearing stance with its verdict and status (RESOLVED /
   OPEN / CRITICAL), including the designed-but-not-built rows.
2. The **schemas and contracts** — `<the records, enums, verdict-bearing states, failure-code
   families for THIS project>`.
3. The **runtime mechanics** — `<exactly how the pieces join, and which gate enforces which
   verdict>`.
4. `<the project's fourth deferred mechanics area, if any — e.g. an enforcement ladder>`.

---

## 1. Decision inventory

<!-- Produced by Step 4. Every stance named in system-view resolves to EXACTLY ONE row here.
Zero rows for a named stance = orphaned-stance blocker; two rows = duplicate-verdict violation. -->

Status legend: **RESOLVED** (decided and enforced) · **OPEN** (named, not decided) ·
**CRITICAL** (OPEN *and* blocks the core thesis until built/decided).

| # | Decision / stance | Verdict | Status | Authority |
|---|---|---|---|---|
| D1 | `<stance text>` — back-ref `system-view#stance:<slug>` | `<the single owning verdict>` | **RESOLVED** | `<file / ADR / architecture-version / running gate — verified on disk>` |
| D2 | `<stance text>` — back-ref `system-view#stance:<slug>` | `<verdict, or "named, not decided">` | **OPEN** | `<evidence cite, or "no running gate in repo">` |
| D3 | `<stance text>` — back-ref `system-view#stance:<slug>` | `<verdict; thesis does not hold until this is built/decided>` | **CRITICAL** | `<evidence cite; name what blocks the thesis>` |

<!-- EXAMPLE ROWS (illustrative SHAPES only — replace; carry NO project locals):
| D1 | Should axis-A and axis-B carry any design-time link? — system-view#stance:axis-coupling | No design-time link admissible; joined only at runtime; enforced fail-closed. | RESOLVED | <guard/failure-code cite> @ <architecture vX.Y.Z>; <CLAUDE.md L###> |
| D2 | Is the accumulated corpus a defensible moat? — system-view#stance:moat | Named, not decided — business framing unresolved. | OPEN | <discovery.md §N>; no running gate in repo |
| D3 | Does each outcome auto-improve the shared knowledge with governance? — system-view#stance:learning-loop | Designed, not built; the value thesis does not hold until the governed loop ships. | CRITICAL | <system-view.md §"learning loop">; no running gate in repo |
-->

The OPEN / CRITICAL rows are the ones a stakeholder must weigh to judge soundness.
**`<DN>` is the single decision that gates the value thesis** — see §`<the verdicts section>`.

> EXAMPLE-REPLACE-ME: the worked example (GoldenQuill / Tilth) ran D1–D10 (plus a D5a) under this
> exact legend, with **one CRITICAL row** (the learning loop) gating the value thesis. Those rows are
> GoldenQuill-specific — author your OWN rows; do NOT carry the D1–D10 literals forward.

---

## 2. Schemas and contracts

<!-- Produced by Step 5. One subsection per load-bearing schema/contract; each cites its source file
and points back to the decision row whose verdict it realizes. -->

### 2.1 `<contract name>`
Source: `<path/to/source-file>` (`<LOCKED date / version, if applicable>`).

`<record fields, enums, the verdict-bearing states>`. Realizes decision row **`<DN>`**.

### 2.2 `<contract name>`
Source: `<path/to/source-file>`.

`<fields / enums / states>`. Realizes decision row **`<DN>`**.

> EXAMPLE-REPLACE-ME: replace these stubs with your project's actual schemas/contracts; do not ship
> the worked example's candidate-record / match-database / classification-register / failure-code
> families.

---

## 3. Runtime mechanics

<!-- Produced by Step 5. Trace how the pieces join and which gate enforces which verdict. Re-narrate
NO shape here (point up to system-view); define NO term (point to ontology-view). -->

`<Describe the mechanism — the join/precedence/sequence — and, for each load-bearing step, name the
gate that enforces the relevant decision row's verdict, or state plainly where enforcement is absent
(an OPEN/CRITICAL row).>`

- `<mechanic step>` — enforces / realizes **`<DN>`**: `<how, on disk>`.
- `<mechanic step>` — `<verdict not yet enforced; this is the OPEN/CRITICAL gap>`: **`<DN>`**.

> EXAMPLE-REPLACE-ME: the worked example traced a runtime match join-under-precedence and a
> coupling guard. Replace with your project's mechanics.

---

## 4. The named stances — verdicts

<!-- A prose pass over the OPEN/CRITICAL rows: state each verdict plainly, why it is OPEN/CRITICAL,
and what a stakeholder must weigh. The RESOLVED rows can be summarized in one line each. -->

- **`<stance> (DN)`** — RESOLVED: `<one-line restatement; point at the mechanic/contract that
  enforces it>`.
- **`<stance> (DN)`** — OPEN: `<what is undecided and why it matters>`.
- **`<stance> (DN)`** — CRITICAL: `<what must be built/decided before the thesis holds>`.

---

## Open questions

<!-- Produced by Step 7. The OPEN/CRITICAL decision rows ARE the questions a stakeholder must weigh.
Each OQ carries a recommendation + a NAMED owner. Blocker OQs flagged. NON-CONTIGUOUS numbering is
ACCEPTABLE — do not renumber to fill gaps. -->

- **OQ-1** — `<question, often a restatement of an OPEN row>`. Recommendation: `<rec>`. Owner: `<named owner>`.
- **OQ-2** — `<question>`. Recommendation: `<rec>`. Owner: `<named owner>`.
- **OQ-N (BLOCKER)** — `<an orphaned stance with no row / a duplicate verdict / a RESOLVED row resting
  on a struck authority / a CRITICAL row whose blocker is unowned>`. Recommendation: `<rec>`. Owner: `<named owner>`.

---

## Residue ledger

Every load-bearing verdict maps to ≥1 row. `closed` = adjudicated/fixed; `open` = a true residue
deliberately preserved (never demoted).

| # | Verdict / claim | Status (closed/open) | Surviving residue | Citation |
|---|---|---|---|---|
| R1 | `<load-bearing verdict>` | closed | `<what was fixed>` | `<citation from the per-agent files>` |
| R2 | `<load-bearing verdict>` | open | `<the preserved true residue>` | `<citation>` |

---

## Cross-reference map

Per the nothing-decided-twice discipline: **every verdict is owned HERE**; shape is owned in
system-view; term meaning is owned in ontology-view. This map records what this view points across
for (and does not restate).

| This view's row / section | Relationship | Owner | What is owned there |
|---|---|---|---|
| decision row **`<DN>`** | answers | `system-view.md` §`<n>` `stance:<slug>` | the *shape* / stakes of the stance (named, not decided) |
| `<a term used in a verdict>` | defined-by | `ontology-view.md` | the typed definition of the term |
| `<a verdict>` | enforced-by | `<authority — file / ADR / architecture-version / running gate>` | the on-disk gate that makes the verdict stick |

> Per the contract: every system-view-named stance appears as exactly one row above (zero =
> orphaned-stance blocker; two = duplicate-verdict violation); every verdict cites an authority
> verified on disk.

---

## Connections

<!-- The load-bearing provenance link. This view rides node_type:discovery, so it is a vault graph
node and this edge is bidirectional (see .claude/skills/custom/edges.md). The discovery is the SOLE
sanctioned mutation trigger — change the view by revising the discovery and re-running the skill in
evolve mode, never by hand-editing this file. -->

| Document | Type | Description |
|----------|------|-------------|
| `discovery.md` | `derives-from` | Reconciled from this discovery — its sole sanctioned mutation trigger. Last reconciled against discovery `<vX.Y.Z>`. |
| `system-view.md` | `refines` | Refines system-view's shape down to contracts, schemas, and the decision inventory. (Inverse `refined-by` on system-view.) |
| `ontology-view.md` | `cites` | Uses the terms ontology-view defines; redefines none. (Inverse `cited-by` on ontology-view.) |

> **Inverse is MANDATORY:** `discovery.md` carries the inverse `derives` row pointing back to this view (every edge between vault nodes is bidirectional). **Drift check:** the discovery `version` recorded above is the reconcile baseline — if the discovery's current `version` is higher, this view is STALE and must be re-reconciled in evolve mode (never hand-patched).

---

<!--
REUSABILITY — STRIP-LIST (deny-list; must NOT survive into a real project's artifact):
  CIC · CLC · TILTH-* · council / council-seat (Scout / Scribe / Editor / Judge / Red Team /
  Logician) · gq_kind · F-CIC-CLC-COUPLING-VIOLATION and the other F-* failure-code literals ·
  the eligibility_filter.py cite · the D1–D10 row literals from the worked example.
The worked reference instance is at
C:\Users\victo\domainspec-core\projects\goldenquill\victor\engineer-view.md (the ONLY validated
on-disk engineer-view; NOTE: it carries no governance_status field and emits no signal envelope —
those are skill-introduced deltas this template adds).
Before publishing: zero EXAMPLE-REPLACE-ME rows survive, every named system-view stance resolves to
exactly one row, every row cites an authority, and zero strip-list tokens leak.
-->
