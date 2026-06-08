---
name: experiment-proposal
description: "Use in the knowledge-taxonomy repo to propose, freeze, or resolve a falsifiable experiment (E-series). Drives experiments/PROTOCOL.md, experiments/_TEMPLATE/, and experiments/tools/validate_proposal.py. Examples: \"propose experiment E13\", \"write a proposal for X\", \"is this hypothesis falsifiable?\", \"freeze E11\", \"resolve E11's verdict\". Only applies where experiments/PROTOCOL.md exists."
---

# Experiment Proposal

You drive the lifecycle of a knowledge-taxonomy experiment: a pre-registered,
falsifiable test with numeric gates. You are an **interactive driver**, not a
rule book — the rules live in `experiments/PROTOCOL.md` and the machine checks
live in `experiments/tools/validate_proposal.py`. Never re-encode the gate
rules here; read PROTOCOL and run the validator.

Your job is the part neither the template nor the validator can do:
1. Force a **single, falsifiable** hypothesis (compound hypotheses are the #1 failure).
2. Enforce the **review-gated** must-fix items the validator can't see (it reads frontmatter only).
3. Write a real **`## Why this matters`** (narrative) without letting it leak into the contract.
4. Wire vault edges and compute the verdict mechanically.

## Mandatory first step

Before any tool call:

1. Locate the experiments folder (`experiments/` at the repo root). If
   `experiments/PROTOCOL.md` does not exist, this skill does not apply — say so and stop.
2. **Read `experiments/PROTOCOL.md`** (source of truth: lifecycle, must-fix, the verdict rule) and **`experiments/_TEMPLATE/README.md`** (what each file is).
3. Skim `experiments/README.md` for the next free E-number and execution order.

Pick the mode from the user's intent: New / Freeze / Resolve / Promote.

---

## Mode 1 — New  ·  triggers: "propose…", "write E<N>…", "new experiment"

1. **Scaffold:** `cp -r experiments/_TEMPLATE experiments/E<N>-<slug>`. Delete `RUN-01.md`/`VERDICT.md` placeholder text only when filled; keep the files.
2. **Interview the two registers — keep them separate:**
   - *Narrative (`## Why this matters`):* the stake (what changes if PASS vs BLOCK), why now (what it unblocks / which prior E-result it builds on), and why **both** outcomes teach something. If only one outcome is interesting, push back — the experiment is weak.
   - *Contract:* exactly **one** `hypothesis`, the `corpus` (named + counted), `gates` (each with `metric/op/threshold/verdict_on_fail`), `falsifiers` (each with `condition/verdict`), and `freezes`.
3. **Delegate a falsifiability skeptic** (Agent, model: sonnet, synthesis-only — write its critique to a temp file, surface only the verdict). Brief it to attack:
   - Is this **one** claim, or several stapled with "and"?
   - Name the observation that makes it **false**. If none → not a hypothesis.
   - Is every gate **measurable** from the run outputs? Does each `verdict_on_fail` match the intent (BLOCK = experiment invalid / refuted; FLAG = degraded)?
   - Do PASS and BLOCK both produce a learning?
   Rewrite the hypothesis/gates until it survives. This mirrors the repo's "system-tagging, not human-tagging" ethos: a weak proposal should fail here, not pass quietly.
4. **Wire vault edges:** set `sister_artifacts`, `moves` (the premise/axiom/OQ this experiment moves), and a `## Connections` block. Use the vault conventions in `domainspec/vault/ontology-conventions.md` for edge names; do not invent predicates.
5. **Validate:** run `python3 experiments/tools/validate_proposal.py experiments/E<N>-*/PROPOSAL.md` until green. `lifecycle` stays `proposed`. Do **not** set `frozen_at` yet.
6. Report the path and what still needs human review before freeze.

---

## Mode 2 — Freeze  ·  triggers: "freeze E<N>", "pre-register E<N>"

Freeze is the pre-registration boundary. Before flipping it, run the **review-gated must-fix** items from PROTOCOL that the validator cannot check (it sees frontmatter only):

1. **Single claim** — the hypothesis is one falsifiable statement.
2. **Mechanical verdict** — §7 is the standard function of §6, no judgment words.
3. **Freeze coverage** — every `freezes:` entry appears as a **[FREEZE]** step in §4 of the body. Grep the body and diff against the field.
4. **Pre-registered names** — any concept names/buckets the run will emit are written in §5 *now*, not after seeing data.

If all pass:
5. Set `lifecycle: frozen`, `frozen_at: <current commit SHA>` (`git rev-parse HEAD`), bump `version`, update `last_updated`.
6. Run `python3 experiments/tools/validate_proposal.py experiments/E<N>-*/PROPOSAL.md` (structural) and then commit. The commit is the freeze record.
7. Confirm with `--frozen`: `python3 experiments/tools/validate_proposal.py --frozen experiments/E<N>-*/PROPOSAL.md`.

After freeze, the immutable block (hypothesis, predicts, corpus, gates, falsifiers, freezes) must not change. A real change is a **new proposal** that sets `superseded_by` on the old one — never an in-place edit.

---

## Mode 3 — Resolve  ·  triggers: "resolve E<N>", "verdict for E<N>"

1. Confirm the proposal is untouched since freeze: `--frozen` must be clean. If it drifted, stop — the verdict is invalid until the drift is explained or the proposal superseded.
2. Read `RUN-NN.md` + `outputs/`. Fill `VERDICT.md` **gate by gate**: observed value, pass/fail.
3. **Compute the verdict mechanically** from the frozen gates (PROTOCOL §7):
   - **BLOCK** if any `verdict_on_fail: BLOCK` gate fails or any `verdict: BLOCK` falsifier fires.
   - **FLAG** if not BLOCK but any FLAG-gate fails or FLAG-falsifier fires.
   - **PASS** iff every gate passes and no falsifier fires.
   Do not reinterpret a gate to reach a nicer verdict — a wrong gate is a finding.
4. Update the proposal: `lifecycle: resolved`, `veracidade` (`high` if PASS-confirmed, `refuted` if BLOCK-refuted), `status` toward `consolidated`.
5. Note what residue this run hands to the next experiment (E12 inherits E11's Type A list, etc.).

---

## Mode 4 — Promote  ·  triggers: "promote candidate", "turn this idea into an experiment"

A row in `domainspec/templates/experiment-candidates.md` (the backlog) becomes a full proposal only when it's worth pre-registering. Map the row's fields onto the template, then run **Mode 1** from step 2. Don't leave a runnable experiment as a table row; don't write a PROPOSAL for an idea that hasn't earned a verdict.

---

## Guardrails

- The narrative never carries a falsifiable commitment; the contract never carries motivation. If a sentence could be wrong, it belongs in §1/§6.
- Never edit the `domainspec/` submodule (cf. E11's submodule-edit ban). `node_type: experiment` is a KT-local extension recorded in PROTOCOL, not a submodule change.
- Surface, don't hide, contradictions: if a gate can't be measured or a hypothesis can't be refuted, say so and fix it — that is the point of the skill.