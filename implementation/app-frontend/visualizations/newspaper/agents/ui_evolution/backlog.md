---
tags: [ui-evolution, newspaper, backlog]
node_type: backlog
is_session: false
layer: architecture
nature: procedural
status: draft
version: 1.0.0
last_updated: 2026-03-25
---

# Backlog: Ui Evolution

This is the task backlog for the Ui Evolution agent. It prioritizes the evolutionary tasks required for this domain within the Gödel Machine.

## Backlog Categories

# New Features
---
## [2026-03-25] [HIGH] — Define Initial Roadmap — ✅ DONE

**Context:**
The backlog has just been initialized per the System Operator's instructions. A formal roadmap is required.

**What was done:**
- Reviewed the agent manifesto and updated it with 6 immutable design constitutions.
- Injected voting bars into all existing templates.
- Registered all HTML variants in the Genetic Platform Matrix.

**Affected files:**
- `specs/newspaper/agents/ui_evolution/manifesto.md`
- `specs/newspaper/agents/ui_evolution/newsletter.md`
- `specs/newspaper/evolution/index.html`

---
## [2026-03-25] [HIGH] — Recover & Integrate Historic Mockups — ✅ DONE

**Context:**
Older mockups (`a_dark_sepia`, `b_swiss_minimalism`, etc.) existed only in `/tmp/` and were not indexed by the Genetic Platform.

**What was done:**
- Copied all mockup HTMLs into `specs/newspaper/mockups/`.
- Registered them in `index.html` `generationsData` under "Mockups / Fossils".
- Injected the Global Voting Bar (1-to-5 scale + `window.parent.registerAtomicVote`) into each one.

---
## [2026-03-25] [STANDING ORDER] — Mandatory Voting UI on Every New Generation — 🔄 ONGOING

**Context:**
The Darwin-Gödel Engine requires continuous, high-fidelity telemetry. If a new page is deployed without voting UI, the evolutionary loop breaks.

**What needs to be done (for every future gen_*.html):**
- Embed the Global Voting Bar (1-to-5 scale) at the bottom of the page.
- Embed Atomic Context Evaluators (All 8 Protocol Axes) inline within data blocks. *(COMPLETED FOR GEN 015 via Hotfix)*
- All votes MUST call `window.parent.registerAtomicVote()` — the UI Agent never persists data.
- The Data & Backend Engineer Agent owns `evolution_server.py` and `telemetry_db.json`.

**Affected files:**
- Every new `specs/newspaper/evolution/gen_*.html`

# User Experience (UX)
---
## [2026-03-25] [HIGH] — Full-Spectrum Evaluator Grid — ✅ DONE
**Context:**
The Operator complained they could not vote on all metrics. The Data Exchange Protocol specifies 8 canonical metrics, but templates only exposed 3.

**What was done:**
Hotfixed `gen_015_a_explore_ambient` and `gen_015_b_exploit_terminal` to include a full density grid exposing 7 atomic evaluators underneath every article block, with `global_fitness` remaining at the page level.

# Architectural Resilience & Robustness
---

# Bug Fixes & Correctness
---

# Technical Debt & Refactoring
---
## [2026-03-25] [HIGH] — Vote Standardization Migration (Emitter Side) — ❌ NOT DONE

**Context:**
6 incompatible vote schemas exist across legacy templates. An agreement was reached with the Platform Architect (logged in `info-exchange.md`) to standardize all templates to emit Protocol v1.0.0 `{ metric_name, score, comment }` on a 1-5 scale across all 8 metrics.

**What needs to be done:**
- Replace all legacy voting JS/HTML with the canonical 8-axis Atomic Evaluator grid + Global Fitness bar.
- Priority order: Gen 014 → Gen 013 → Gen 012 → Gen 010/011 → Mockups (6 files).
- Preserve each template's unique visual identity.

**Affected files:**
- All `specs/newspaper/evolution/gen_*.html` (except 015 A/B)
- All `specs/newspaper/mockups/*.html`

---

# Completed / Done
---
- [2026-03-25] Define Initial Roadmap
- [2026-03-25] Recover & Integrate Historic Mockups
- [2026-03-25] Full-Spectrum Evaluator Grid (Gen 015 Hotfix)
