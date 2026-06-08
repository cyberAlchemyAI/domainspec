# Stage Receipt — Craft Cartographer (Distill / structural map)

- Role: Craft Cartographer · agentId a4f19a8a02840a7a3 · verdict: **pass**

## Position in stack

Craft is a **meta-development governance harness** whose shipped MVP collapses to a **standalone recursive-ledger skill** sitting _beside/above_ existing Arcanum capabilities — never beneath as infrastructure, never in front as a product. `SKILL.md` tier `development-candidate`; `README.md`: "not canonical authority yet."

## Coupling (Craft REPLACES nothing — composes/sits beside)

| Component                                                                | Relationship                                                                                            | Evidence                                           |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| invoke / refine / dispatch-spec / task-session / distill / decision-gate | routes to + ingests receipts; never executes                                                            | CRAFT-INTERACTION-CONTRACT.md                      |
| CyberAlchemy promotion DAG                                               | **beside / parallel** promotion path; borrows residue vocab, defines own gate; does not consume the DAG | CRAFT-INITIAL-DEFINITION.md, CRAFT-ARCHITECTURE.md |
| observability→reflection loop                                            | references as external route; **runtime/observation-envelope deferred**                                 | CRAFT-RUNTIME-DESIGN.md                            |

Enforced everywhere: "must not silently replace existing sigils/spells/registries." Craft owns route memory + ledger state; called capability owns its verdict.

## Minimal standalone deliverable

The **recursive ledger** (`.craft/ledger.yml` source-of-truth + `CRAFT.md` view + `.craft/artifacts/`), schema `craft.recursive_ledger` v0.1.0, 18 interface methods, tools `Read/Write/Bash/Glob/Grep` only. **Zero hard dependency** on other Arcanum capabilities. Everything beyond bookkeeping (actually doing routed work) needs the rest of Arcanum.

## Lifecycle / promotion block

CRAFT-PROMOTION-READINESS.md recommendation: **`defer`** — "not ready for canonical promotion … remaining gap is repeated evidence." Active refine validation reports **`block`** (Distill incomplete). Deferred-by-design: priority scoring, generated index, role-delegation automation, runtime/observation-envelope.

## Separability

**Separable, already factored for standalone shipping** — `SKILL.md` is a portable operating contract designed to be copied into another repo with project-local `.craft/`. Coupling is by-reference (route table), not by-binding. Clean split: ship the ledger standalone now; bundle/upsell the routed-execution method (Arcanum-coupled, promotion-deferred).
