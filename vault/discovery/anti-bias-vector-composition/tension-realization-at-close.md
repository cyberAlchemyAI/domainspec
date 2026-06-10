---
tags: [vault, discovery, multi-agent, anti-bias, tension, close-side, false-consensus, proposal, theorem-research]
node_type: discovery
is_session: false
layer: ontology, application
nature: explanatory
status: exploratory
version: 0.1.0
last_updated: 2026-06-10
created_by: victorboscaro@gmail.com
---

# Anti-Bias Vector Composition — Tension Realization at Close

> **What this node is.** A *proposal*, not a build. It names a gap in the current anti-bias machinery — tension is checked at dispatch but never scored at close — and sketches a 3-touchpoint fix. **Nothing here is implemented or merged.** The supporting assessment was informal raw-`Agent` repo introspection in a working session, **NOT** a `/research` dispatch — so it carries no `closure_mark`, no per-agent files, and no formal audit trail. Treat every operational claim below as OPEN. The load-bearing evidence is R11's own text plus the verbatim current-state extraction (cited file:line); the fix itself is unverified.

## Objective

Name the close-side gap in the anti-bias machinery — tensioned-pair disagreement is *declared and checked at dispatch but never scored after the run* — and propose a 3-touchpoint fix (no new agent) that types convergence as genuine vs false consensus instead of ignoring it. Proposal status; the finding is load-bearing, the fix is unverified.

## Context

The gap surfaced during an informal working-session audit of the research-dispatch system. The audit's broader read: the system is genuinely well-made and not theater — skeptics find real objections and decisions have actually reversed (e.g. a cocycle-closure verdict flipped B→A; an ownership claim demoted to Perrone 2024) — but its value comes from *bookkeeping discipline* (subset rule, per-agent files, closure-marks-bound-to-evidence), **not** from the marquee "anti-bias via tensioned agents" feature. That feature's weakest seam is the close: the validator checks a tension axis was *named*, and nothing ever checks the predicted disagreement *materialized*.

This node extends the four siblings in this folder — [`principle.md`](./principle.md) (the rule), [`validator-check.md`](./validator-check.md) (the dispatch-side operationalization), [`examples.md`](./examples.md), [`literature.md`](./literature.md) — by pushing on the half they leave implicit: the *close*. The siblings make tension declarable and checkable *before* the dispatch runs. This node asks what reads the declaration *after*.

---

## The finding (claim ≤ evidence)

**Anti-bias tension is checked at dispatch but never scored at close.**

What the current system verifies:

- The validator (`research-validate/SKILL.md:21`, `research-validator.md:14-17`) checks only that a tension axis was *named* per pair: "name a tension axis (methodology / corpus / attack vector / era priors) for each pair. If no axis nameable → reject". It verifies a *declaration exists*. It does not verify the declaration was *realized*.
- The close-side check is `research-review/SKILL.md:21` check #4 — "Layer with N≥3 and zero dissent records ⇒ false-consensus flag" — mirrored in `research-auditor.md:17`. This is the **only** gate that looks at agreement after the fact, and it is weak in three concrete ways:
  1. It only fires at **N≥3**. A predicted-to-disagree *pair* (N=2 — the canonical adversarial shape, e.g. "case FOR" vs "case AGAINST") is never checked.
  2. It only checks the `dissent` field is **non-empty**. It never compares the agents' actual positions against a *recorded prediction* of where they should have split.
  3. It treats convergence as a binary flag, not as typed information.

The consequence is the silent failure R11 already names. Two explorers tasked "strongest case FOR precedent existing" vs "strongest case AGAINST" (the worked example in `research-constitution.md:122-124` / R10) can both converge on the same conclusion and **no gate compares the predicted disagreement to the observed outcome.** The per-agent `decision` fields (schema in `research-explorer.md`, `research-skeptic.md`) record what each agent concluded, but nothing reads pair-vs-prediction.

**R11 already promises this close-side signal but no gate reads it.** R11's closing sentence (`research-constitution.md:132`):

> "R11 forces the declaration upfront so absence of disagreement at close is itself a signal."

The declaration is forced (validator checks it). The signal is promised. But **no gate consumes the signal** — `research-review` check #4 reads the `dissent` field's emptiness, never the prediction the validator recorded. The rule is half-built: the upfront half exists, the close-side half does not.

---

## The reframe (the core idea)

**Convergence is not the bug. *Unscored* convergence is.**

When a predicted-to-disagree pair agrees, that is information, and it splits two ways:

- **Genuine consensus** — the two agents reached the same conclusion *independently*, by different evidence and different reasoning along the tension axis. This **strengthens** the result: it is corroboration in the Krogh–Vedelsby sense (the diversity term was non-zero; agreement survived it).
- **False consensus** — the agents are correlated (shared weights, shared prompt, cosmetic angles) and the "agreement" carries no independent information. As corroboration it is **worthless**; treating it as N× evidence is exactly the `examples.md` Example-4 failure mode ("correlated unanimity is not multiplicative evidence").

The current system records **neither**. It cannot tell genuine from false consensus because it never compares the realized positions against the predicted split.

This is not a hypothetical risk. The repo's own dispatch [`research-ai/multiagent-shared-weight-error-independence`](../../../../domainspec-theorem/research-ai/multiagent-shared-weight-error-independence/research/findings.md) surfaced, from external literature, **same-family error agreement up to 0.97** (arXiv:2506.07962, findings.md:124) and same-model herding `r=0.902` on the approval axis (arXiv:2509.23055, findings.md:122). That dispatch did **not** independently measure these — it recorded them from fetched papers — but the figures establish that false consensus among same-lineage agents is a real, measured phenomenon, not a theoretical worry. (That same dispatch's R11 row flags *itself* — its four same-lineage agents converged, "possibly correlated bias, not independent corroboration" — which is precisely the close-side gap this proposal targets, observed in the wild.) This proposal operationalizes that finding inside the dispatch lifecycle.

---

## The proposed fix — 3 touchpoints, no new agent

The fix threads through the three roles that already exist (validator/dispatch, writer, auditor). It adds **no new agent**.

### 1. Dispatch / validator — make the declaration falsifiable

Today the `anti_bias` declaration is prose ("axis: methodology"). It asserts an axis but predicts no outcome, so nothing can be scored against it. The proposal:

- Per pair, add `tension_kind: disagreement | coverage`.
- For every `disagreement` pair, require a `question:` (the one question the pair is predicted to split on) **and** a `predicted:` split (which agent lands on which side).
- The validator **rejects** a `disagreement` pair lacking a falsifiable predicted split.
- `coverage` pairs are **EXEMPT** — e.g. two explorers over disjoint corpora are *meant* to converge on the union; demanding they disagree would be wrong. The `coverage`/`disagreement` distinction is what lets the close-side gate avoid punishing legitimate convergence.
- Standardize the YAML. There are currently **at least five incompatible `anti_bias` shapes in the wild** — bare list-of-strings (`tower-residue-open-gaps-2026-06-01/dispatch.yaml`), `pairwise_tension` list-of-dicts (`omega-transposition-colimit-spoke-lift/dispatch.yaml`), `L1:`-keyed inline-flow dicts (`rg-repo-fit-scout/dispatch.yaml`), per-agent `anti_bias_axis` strings (`repo-genesis-backbone/dispatch.yaml`), and a top-level `anti_bias_pairwise_tension` key (`project-ct-mapping-2026-05-30/dispatch.yaml`). None carries a machine-readable `predicted` field. Collapse these into one schema.

**CRITICAL anchoring guard:** the agent **never sees** `predicted`. It lives orchestrator-side and is scored at close. If an agent saw "you are predicted to land AGAINST," that prediction would anchor it — manufacturing the very disagreement the gate is trying to measure. The prediction is the orchestrator's hidden hypothesis, not a brief.

### 2. Writer — score the realization

Add a mandatory `## Tension realization` block to the writer's artifact (the writer schema already lives in `research-writer.md`; this is one more required section alongside `## Residue ledger`):

- One row per predicted-disagreement pair.
- Outcome ∈ {`materialized`, `converged→genuine`, `converged→suspect`}, citing **both** agents' `decision` fields as evidence.
- The writer is the right scorer because it is the parent/opus role that has already read every upstream per-agent file (`research-writer.md` "Read every upstream per-agent file") — it has the full-context view needed to judge *why* two agents agreed.

### 3. Auditor / research-review — upgrade check #4

Upgrade `research-review` check #4 from "N≥3, dissent non-empty" to a per-pair check:

- Every `tension_kind: disagreement` pair MUST have a realization row citing both `decision` fields. Missing row ⇒ **reject-with-notes**.
- `converged→suspect` ⇒ **escalate** (not silent accept) — surface it to the user, do not bury it.
- The auditor stays **schema-only**: it checks the row *exists* and *cites two decisions*. It does **not** re-judge whether the convergence was genuine — that content-call is the writer's. This preserves the `research-auditor.md` boundary ("Audit schema, not content") and keeps the auditor cheap (haiku per R8).

Constitution **R10/R11 get amended** to define `tension_kind` and to state that realization is scored at close — closing the half-built rule R11's own text promises.

---

## Two judgment calls (recorded)

These are design positions, not derivations. Recording them per the keystone/collapse discipline.

- **Convergence is typed, not punished.** A naive "flag all agreement" gate would pressure writers to *fake* disagreement to pass the gate, and would throw away the strongest results (genuine independent consensus). Typing convergence (`genuine` vs `suspect`) keeps the information instead of destroying it. *Collapse-test:* if in practice every `disagreement` pair always materializes (convergence never happens), the typing carries zero bits and the `coverage`/`disagreement` split plus the plain N≥3 flag would suffice — the proposal's extra machinery collapses to the existing check #4.
- **Writer scores, auditor verifies.** Content-judgment stays with the role that has full context (the writer/opus, which has read all per-agent files); the schema-cop (auditor/haiku) only checks the row exists and cites two decisions. Splitting it the other way would either make the auditor expensive (opus, re-reading everything) or make the writer unaccountable (no second pass on the row).

---

## Status and provenance (do not overclaim)

- **Status:** `exploratory` — proposal discussed, not built, not merged. No code, no schema change, no constitution amendment has landed.
- **Provenance:** informal raw-`Agent` repo introspection in a working session. **Not** a `/research` dispatch. No `closure_mark`, no `agents/*.md` decision records, no LEDGER, no auditor pass back this note. It is not a formal audit and must not be cited as one.
- **What IS load-bearing:** the current-state extraction (every file:line citation above is a verbatim read of the current artifact) and R11's own closing sentence. Those are solid. The *fix* is a sketch whose feasibility, ergonomics, and anchoring-safety are untested.

---

## Connections

| Document | Type | Description |
|----------|------|-------------|
| [principle.md](./principle.md) | `derives-from` | The principle this proposal extends to the close side. `principle.md` defines tensioned-pairwise; this node observes that the principle is enforced at dispatch but not scored at close. |
| [validator-check.md](./validator-check.md) | `refines` | Adds a falsifiable `predicted` split to the validator's tension declaration (touchpoint 1) and a close-side per-pair realization check (touchpoint 3), refining `validator-check.md` Items 10–12 from "dissent non-empty" to "predicted-vs-observed scored". |
| [examples.md](./examples.md) | `cites` | Example 4 ("false consensus") is the failure mode this proposal makes a *typed*, scored outcome rather than a manual judgment call. |
| [`../../../../domainspec-theorem/research-ai/multiagent-shared-weight-error-independence/research/findings.md`](../../../../domainspec-theorem/research-ai/multiagent-shared-weight-error-independence/research/findings.md) | `cites` | Surfaces (from external literature) same-family error agreement up to 0.97 and same-model herding r=0.902 — the measured evidence that false consensus among same-lineage agents is real. This proposal operationalizes that inside the dispatch lifecycle. |
| `../../../../domainspec-theorem/.claude/skills/research-review/SKILL.md` | `proposes-edit` | Proposes upgrading check #4 (close-side) from "N≥3, dissent non-empty" to per-pair realization scoring. Forward-only edge into a skill file (per ontology-conventions §8 carve-out). |
| `../../../../domainspec-theorem/.claude/skills/research-validate/SKILL.md` | `proposes-edit` | Proposes making the §4 tension declaration falsifiable (add `tension_kind` + `predicted`). Forward-only edge into a skill file. |
| `../../../../domainspec-theorem/theorem/agents-strategy/research-constitution.md` | `proposes-edit` | Proposes amending R10/R11 to define `tension_kind` and state realization is scored at close. Forward-only edge into a governance artifact (not a vault node). |
