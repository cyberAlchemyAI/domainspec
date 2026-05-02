---
tags: [creatives, performance-marketing, attribution, lifecycle, trama]
node_type: conceptual
is_session: false
layer: domain
nature: reference
status: draft
version: 0.3.3
last_updated: 2026-04-22
---

# Creative Operations — Domain Dictionary

> The canonical glossary of the creative-operations domain **concepts**. Every term an operator, analyst, or agent uses when talking about creatives must appear here (or in the paired [[metrics-dictionary]] for numeric metrics) with a single definition. Synonyms are not allowed — if two names point to the same concept, one is the canonical name and the other is listed as an alias.

> **Scope split.** This dictionary names **concepts**: entities, attributes, lifecycle states, sourcing flows, attribution concepts, generative-ops concepts. Numeric quantities (`spend`, `roas`, `cpa`, `spend_share`, `ad_age`, etc.) live in [[metrics-dictionary]] with formulas. When a concept here has an associated metric (e.g., Rollout Date → `ad_age`), a pointer is given.

---

## Objective

Enforces ubiquitous language for creative operations. Answers the question: *"What does this term mean in our domain?"*

If a term appears in code, docs, or conversation and is not here (or in [[metrics-dictionary]]), it does not officially exist — flag it.

---

## Index

1. [Core Entities](#core-entities) — Criativo, Campanha, Rede, Produto, Audiência, Asset, Rollout Date
2. [Creative Attributes](#creative-attributes) — Ângulo (with Mecânica as its promo-mode alias), Template, Content Block, Visual Brief, Input Reference
3. [Creative Structure](#creative-structure) — Hook, Hook Variant
4. [Sourcing](#sourcing) — Produção Interna, Briefing Especial, Post Influ, Rollout, CapoMastro, Maestro, Creatives Please, Mighty Scout
5. [Classification & Lifecycle](#classification--lifecycle) — Criativo Vencedor (Good / Success / Super Success), Criativo Ativo, Janela de Avaliação, Baseline Temporal (d0), Falso Negativo, Falso Positivo, Contrafactual, Hit Rate, Learning Loop, Feedback Loop
6. [Attribution](#attribution) — Attribution Model (Interno), Attribution Model Version, Weight
7. [Generative Operations (TRAMA)](#generative-operations-trama) — Creative Embedding, Asset Type, Is TRAMA, Parent Creative
8. [Metrics](#metrics) — pointer to [[metrics-dictionary]]

---

## Core Entities

### Criativo (Creative / Ad)
A publishable advertising unit — image or video plus copy — that occupies an ad slot in a campaign. The atomic object that Creative Operations optimizes. Has a lifecycle: produced → approved → rolled out → evaluated → removed.

Identified in data pipelines by `ad_id` (platform identifier, stable across renames) and `ad_name` (human-readable, canonical in data). `criativo` is the canonical name in docs and conversation; `ad` / `ad_name` are the canonical names in code, dashboards, and data warehouse tables. The drift is accepted for now — tooling follows the platform's vocabulary; the knowledge graph follows the team's.

### Campanha (Campaign)
A structured container of ad sets and ads on a given network. Currently segmented on Meta into three divisions: FEM, MASC, PROMO (plus TESTES). Segmentation is done by **context** (i.e., by which creative is shown), not by demographic targeting.

Identified by `campaign_id` and `campaign_name`. Naming convention on Meta encodes audience and funnel position (e.g., `ASC_ROAS-FEM_VID_RT` → ASC-ROAS objective, FEM audience, video, retargeting).

### Rede (Network / Ad Platform)
An external advertising platform where creatives are placed. Today: Meta (Instagram + Facebook), Google, TikTok, Criteo, Bing, Pinterest. Meta concentrates >70% of spend. In data, the `source` column carries the network identifier (`facebook`, `google`, etc.).

### Produto
The merchandise SKU or product family that a creative promotes (e.g., Stirrup Legging, Boné Sixx, NoHo Socks, Tube Dress). A criativo may or may not be associated with a specific produto. In data, `product_title` carries the product name when available.

### Audiência
The intent bucket a creative is aimed at, derived from context segmentation:
- `masc` — male audience
- `fem` — female audience
- `promo` — promotional, generic
- `promo2` — promotional, secondary variant

### Asset
The rendered media file that a Criativo points to (image, video, or carousel frame). Stored externally (Google Drive today) and referenced by a `link` in the CapoMastro card. One Criativo → one canonical Asset, possibly available in multiple aspect ratios (`link_1x1`, `link_9x16`, `link_5x4`). See also [`Asset Type`](#asset-type).

Distinct from the Criativo object: the Criativo is the logical advertising unit; the Asset is the bytes.

### Rollout Date
The first date on which a Criativo produced spend in any campaign. Derived from the spend record (`MIN(date) WHERE spend > 0`), not from the registration date in CapoMastro. Anchors every age-based window in the system — [`Ad Age`](#ad-age) is measured from here.

---

## Creative Attributes

### Ângulo
The communication angle or promotional mechanism a creative uses. Canonical field name across all campaign types; the attribute has two modes depending on campaign type:

- **Product creatives (FEM / MASC).** The communication angle. Examples: atributos do produto, dores do cliente, desejo. Drives the copy and narrative.
- **Promotional creatives (PROMO / PROMO2).** The promotional mechanism. Examples: compre-ganhe, leve-pague, desconto unitário, desconto kit.

Per [[constitution/creative-attribute-constitution#04-ângulo--mecânica]], `Ângulo` is the schema-level name in both modes. `Mecânica` is a conversational alias for the promo-mode value and is not a separate attribute.

### Template (Blueprint)
A reusable layout pattern that a creative instantiates. Each template declares which `Content Blocks` it uses.

### Content Block
A structural element of a creative, composed by a template. Known types: `headline`, `subheadline`, `image(s)`, `bullets`, `disclaimer`, `cta`.

### Visual Brief
A descriptive instruction for the image(s) that should appear in a creative. A single creative may carry more than one visual brief. Images can be reused from the internal bank (lookbook, segunda luz, influs) or generated from scratch.

### Input Reference
A reference used as input when producing a new creative. The attribute has two modes depending on sourcing flow:

- **Manual production mode** (`Produção Interna`, `Briefing Especial`, `Post Influ`). A single reference asset tied to a `Template`. One reference per template.
- **Generative mode** (`Is TRAMA` / agent-produced). The **set of existing creatives** that an agent uses as input to produce a new creative. Unlike the manual-production mode's single asset, this is a *constructed set* — the Input Reference is defined by a **selection strategy** applied over the creative corpus.

Canonical selection strategies (not exhaustive; new strategies proposed/ratified as TRAMA evolves):

| Strategy | What it returns |
|---|---|
| `explicit` | Hand-picked list of creative IDs specified by the operator. |
| `by_winner` | Recent `Criativo Vencedor` records, optionally filtered by tier and window. |
| `by_angle` | Creatives sharing a given `Ângulo` (optionally filtered by angle family in product mode, or by mechanism in promo mode). |
| `by_lineage` | A creative's ancestors, siblings, or descendants via `Parent Creative` links. |
| `by_similarity` | Nearest neighbors in `Creative Embedding` space to a seed creative or a prompt embedding. |
| `by_product` | Creatives tied to a given `Produto`. |
| `composite` | A union or intersection of other strategies with explicit join semantics. |

**Why this distinction matters.** In the TRAMA loop (see [[premise/creative-premises#p-crt-2--proven-angles-can-be-replicated]] and [[axiom/creative-axioms#ax-crt-3--network-trends-can-be-exploited]]), the choice of Input Reference set is the primary control surface for biasing generation toward exploit (`by_winner`, `by_angle`) vs. explore (cold seeds, novel combinations). The strategy used to constitute the set is a generation-time decision that must be logged as provenance alongside the reference IDs themselves — two runs with the same reference IDs produced by different strategies are epistemically different.

**Naming note.** Canonical name is `Input Reference` (with space). Code identifier is `inputReference` (manual mode, singular) or `inputReferences` (generative mode, plural); for IDs, use `inputReferenceId` / `inputReferenceIds`. The field `inputReferencePackId` in [[discovery/ad-creative-dna/creative-dna-definition]] §3.1 predates this consolidation and should be reconciled to this canonical name — tracked in open points.

---

## Creative Structure

### Hook
The opening segment of a video Criativo — typically the first 1–3 seconds — whose job is to capture attention before the viewer scrolls past. Distinct from the creative's body (which carries the argument) and its CTA (which drives the click). Production artifact, not a platform field: hooks are authored, edited, and swapped during `Produção Interna`.

Hooks are the most A/B-tested element of a video creative because view-through on the first seconds gates every downstream metric. Variation happens in two forms:

- **Text overlay / lettering hooks** — a bold phrase burned into the opening frames ("POV: você encontra a melhor oferta", "Tech T-Shirt vs Algodão vs Fake Tech").
- **Filmed hooks** — a distinct opening scene shot specifically to front-load the video.

Evidence of the concept in working data: hook-editing instructions are the dominant comment type in [`data/capomastro-labels/capomastro_labels.csv`](../data/capomastro-labels/capomastro_labels.csv). Not yet surfaced as a first-class attribute in [[constitution/creative-attribute-constitution]] — see open points below.

### Hook Variant
A Criativo produced as a sibling of another Criativo, sharing body and CTA but differing only in its [`Hook`](#hook). Encoded in `ad_name` by the suffix `_hookN` (where `N` ∈ {1, 2, 3, ...}), indicating that N different opening segments were shot or composed over the same base material to run as parallel tests.

Canonical example pattern: `m-aq-cap-mt_altura_techtshirt_insiders_hook1`, `..._hook2` — two aperture variants of the same "altura × techtshirt" creative. Performance can diverge dramatically across siblings (e.g., `_hook1` at ROAS 0.05 while sibling has different performance), which is exactly the signal hook-variant testing is designed to isolate.

> **Naming note.** The `_hookN` convention is implicit — enforced by convention among creative producers, not by schema. Hook variant is currently inferable only by parsing `ad_name`; there is no explicit `parent_creative_id` or `hook_variant_id` linking siblings. See open points.

> **Related but distinct.** `Re-hook` appears in the CapoMastro labels as a recurring editing instruction ("Re-hook: motivo porque não vale a pena no final"). This is **not** a new Criativo — it is an in-place edit instruction telling the editor to replace the current hook. Not formalized here; flagged for a future pass.

---

## Sourcing

### Produção Interna
Creatives ideated internally, drawing from external references, top-performing campaign creatives, or benchmark brands (Shapermint, True Classic). Registered in CapoMastro, queued, and placed into campaigns. Largest volume source: 1001 ads / R$12M spend / ROAS 1.49 (2025 YTD as of 2025-07-26).

### Briefing Especial
Non-standard creative requests directed to the Influs squad, outside the standard production contract. Higher cost, parallel flow, requires sourcing an available influencer. After approval, follows the same flow as `Produção Interna`. Noisiest flow operationally, with low visibility.

### Post Influ
Organic influencer posts consumed from Mighty Scout, approved in Creatives Please, auto-registered in CapoMastro, prioritized by organic metrics, and placed in campaigns when slots exist. Lowest-effort flow on the operator side. Backlog of 141 approved posts as of 2025-07.

### Rollout
The act of placing a registered creative into an active campaign. Executed by Maestro. The day a Criativo's spend first lands is its [`Rollout Date`](#rollout-date).

### CapoMastro (CM)
The internal platform where creatives are registered with their metadata (produto, tema, campanha, etc.) and queued for rollout.

### Maestro
The automated system that executes rollouts and removals against the campaigns in each network.

### Creatives Please
The approval tool that gates Mighty-Scout-sourced influencer posts before they enter CapoMastro.

### Mighty Scout
The external platform used to source influencer posts. Input to the `Post Influ` flow.

---

## Classification & Lifecycle

### Criativo Vencedor
A creative classified as having contributed to a business outcome, under one of three criteria: `ROAS`, `Spend`, or `Estoque` (product vazão). Each criterion has three grade levels: `Good`, `Success`, `Super Success`. A single creative may win under multiple criteria. See [[constitution/winning-creative-constitution]].

> **Naming note:** in the classifier's output data, criterion values are in English lowercase (`roas`, `spend`, `stock`). The canonical Portuguese names (`ROAS`, `Spend`, `Estoque`) are authoritative in docs. Code should normalize one way and document the mapping.

### Good / Success / Super Success
The three impact tiers within each winning criterion. Thresholds are defined in the winning-creative constitution. Super Success implies a larger step-change than Success, which implies a larger one than Good. In data, serialized as `good`, `success`, `super_success`.

### Criativo Ativo
A Criativo currently placed in at least one campaign producing spend. Inactive creatives are ineligible for both removal evaluation and winning-creative classification.

> **Measured as.** [[metrics-dictionary#ad_age]] and [[metrics-dictionary#campaign_age]] are the formal time quantities associated with lifecycle state.

### Janela de Avaliação (Evaluation Window)
A bounded time interval over which a creative's performance is assessed. The two ratified windows:

| Context | Window |
|---|---|
| Removal eligibility | 10 days post-rollout |
| Winning-creative classification | ≤ 15 days post-rollout |

Choice of window is a trade-off between signal stability (longer windows smooth noise) and decision latency (longer windows delay the feedback loop). See [[spec/creative-metrics#evaluation-windows]] and [[premise/creative-premises#p-crt-8--15-day-evaluation-window-captures-most-creative-impact]].

### Baseline Temporal (d0)
The campaign-level snapshot at the day immediately before the creative's activation (`d0` = day 0). Every relative-delta comparison in the winning-creative classifier uses `d0` as the reference state. Isolates the impact of the creative's entry from longer-term campaign drift. In data: any column suffixed `_d0` or `_yesterday` in the winners pipeline.

### Falso Negativo (False Negative)
A creative removed by the removal rule that would have performed well had it been kept. The removal rule is tuned to minimize this rate. See [[constitution/creative-removal-constitution]].

### Falso Positivo (False Positive)
A creative classified as a winner that, on deeper qualitative review or longer observation, did not actually cause the measured uplift (coincidence with a Black Friday, a bid change, a seasonal bump). Currently tolerated because the winning classifier is deliberately a **heuristic** ([[constitution/winning-creative-constitution#methodology]]) — the explicit trade-off is: "false positives are tolerable; false negatives are acceptable when they affect only marginal cases."

### Contrafactual
A creative that was eligible for removal but kept alive (random sampling, p = 0.10) to measure the removal rule's false-negative rate in production. See [[constitution/creative-removal-constitution#contrafactual-sampling]].

### Hit Rate
**Not yet formalized.** The north-star outcome TRAMA is being built to increase — the rate at which creatives we produce turn into winners ([[#criativo-vencedor]]). Treated as an abstract concept in this version of the graph: no agreed numerator, denominator, window, or threshold yet. A working sketch is "share of produced creatives that reach some tier of Criativo Vencedor within an evaluation window", but each of those fields is open.

Why it's in the dictionary despite being undefined: every bet described in [`docs/`](../docs/) ultimately claims to raise Hit Rate, and premises / discoveries that invoke it need a named term to hang off. Formalization — numerator, denominator, window, tier cutoff, whether it's measured per-cohort, per-product, or global — is itself an open point tracked below.

### Learning Loop
The cycle: produce → rollout → measure → learn what works → feed back into production. Generates qualitative insight on what makes a creative win.

### Feedback Loop
The cycle: rollout → measure → remove or keep → reallocate budget. Operational loop on live campaigns. Faster than the learning loop.

---

## Attribution

### Attribution Model (Interno)
Insider's internal model that attributes orders and revenue to a specific creative/campaign. Operates on `business.insider_revenue_attribution` — a table that maps order IDs to the ad that most plausibly caused the order, with a scalar `weight` per order reflecting the model's confidence.

The internal model is the **decision signal** for creative evaluation (removal, winning classification, CPA/CAC); platform-reported revenue is secondary and used for triangulation only. Lift tests are run occasionally to calibrate the internal model against causal ground truth.

See [[spec/creative-metrics#primary-metrics]] ("Attribution" callout).

### Attribution Model Version
A version tag on the attribution model. Model revisions change the shape of `w_rev`, `weight`, and all downstream metrics (ROAS, CPA, CAC, Conversion Rate Modelada). Metric values computed across model versions are **not strictly comparable**.

Currently untagged in the production pipeline — this is an open point tracked at [[spec/creative-metrics#open-points]]. The first concrete consequence: any longitudinal analysis that straddles a model revision must either version-annotate or recompute on a single version.

### Weight
The attribution model's per-order scalar ∈ [0, 1] expressing its confidence that a specific ad caused the order. Used to produce the weighted metrics ([[metrics-dictionary#revenue.attributed]], [[metrics-dictionary#orders.attributed]], [[metrics-dictionary#orders.first_purchase.attributed]]). A raw order split across two creatives might contribute 0.6 to one and 0.4 to the other. Exposed in data as `weight`.

> **Metric pointers.** Weighted revenue and weighted order counts are formalized in [[metrics-dictionary]] under `revenue.attributed`, `orders.attributed`, `orders.first_purchase.attributed`. The platform-reported counterpart is [[metrics-dictionary#revenue.platform_reported]].

---

## Generative Operations (TRAMA)

### Creative Embedding
A dense vector representation of a Creative Asset produced by an embedding model (currently `gemini-embedding-2-preview`). Today a **research input only** — not consumed by any ratified rule. Stored in `data/embeddings/ads_embeddings_output.csv` with one row per `(ad_name, drive_link)`.

Candidate downstream applications (similarity-based lineage, duplicate detection, cluster-based exploration budget, embedding-conditioned removal, TRAMA routing) are explored in [[discovery/creative-embedding-applications]]. When any of them is ratified, this entry expands to describe what the embedding is committed to encode.

### Asset Type
The MIME type of a Creative Asset: `image/jpeg`, `image/png`, `video/mp4`, `video/quicktime` (`.mov`). Carried in data as `asset_type` (performance table) and `type` (embeddings table). Used to route embedding generation (image vs. video) and to segment performance analyses by format.

### Is TRAMA
A boolean flag marking creatives produced by the TRAMA auto-generation pipeline. In data: `is_trama`, derived from `LOWER(campaign) LIKE '%trama%'` at the campaign level (a proxy — TRAMA creatives today are placed in TRAMA-named campaigns). Will move to a creative-level provenance field once [[premise/creative-premises#p-crt-14--every-automatically-generated-creative-must-carry-complete-lineage]] is implemented.

### Parent Creative
The creative(s) from which an auto-generated creative was derived. Ratified as a schema requirement for auto-generated creatives by [[premise/creative-premises#p-crt-14--every-automatically-generated-creative-must-carry-complete-lineage]]; not yet present in the creative-attribute constitution's enforced schema (see [[constitution/creative-attribute-constitution#open-points]]). Candidate shape: `parent_creative_ids: []` on the Criativo object, plus sibling records describing the generating agent run.

---

## Metrics

Numeric metrics live in their own dictionary with formulas, units, dependencies, and parseable entries:

**→ [[metrics-dictionary]]**

Categories covered there:

- **Primary metrics** — `spend`, `impressions`, `clicks`, `orders.raw` / `orders.attributed`, `revenue.attributed`, `revenue.platform_reported`, etc.
- **Derived metrics** — `roas`, `ctr`, `cpm`, `cpa`, `cac`, `average_ticket`, `conv_rate.raw` / `conv_rate.attributed`, `pct_novos_usuarios`
- **Campaign-relative signals** — `spend_share`, `spend_rank`
- **Windowed signals** — `cum_spend_share.Nd.*`, `cum_roas.Nd.*`, `delta_relativo`, `time_weighted_cumulative_spend`, `removal_heuristic`
- **Lifecycle metrics** — `ad_age`, `campaign_age`

Whenever a concept in this dictionary has an associated metric, the entry links to the metric ID.

---

## Open Points

- **`criativo` vs `ad`** — two canonical names for the same concept: `criativo` in docs/conversation, `ad` / `ad_name` in code and data. Accepted as drift for now; the cost is that every new contributor has to learn the mapping.
- **`Estoque` vs `stock`** — the classifier's output uses English (`criteria = 'stock'`); docs and dictionary use Portuguese (`Estoque`). Normalize in one direction.
- **Whether `Produto` should formalize the absence of a product** — `sem produto associado` is treated as a value today; an explicit `null` with a separate "brand creative" flag would be cleaner.
- **Attribution Model Version is untagged** — see [[spec/creative-metrics#open-points]]. Until tagged, any metric straddling a model revision is epistemically suspect.
- **Parent-creative lineage is defined but not schema-enforced** — see [[constitution/creative-attribute-constitution#open-points]].
- **Creative Embedding applications pending.** The entry is a research-only pointer. See [[discovery/creative-embedding-applications]] for the five candidate applications and the evidence required to ratify any of them as a premise or rule input.
- **Hit Rate is undefined.** It is the outcome TRAMA targets, but numerator, denominator, evaluation window, winner-tier cutoff, and grain (global vs. per-cohort vs. per-product) are all open. Formalizing it is a prerequisite for treating any TRAMA-related claim as falsifiable.
- **Hook is not a first-class schema attribute.** Today it is a production concept captured in editor comments (`capomastro_labels.csv`) and in `ad_name` suffixes (`_hookN`). Queued as pending schema work in [[backlog/creative-attribute-pending#b-crt-attr-9--surface-hook-sibling-key]] (cheap structural field), [[backlog/creative-attribute-pending#b-crt-attr-10--add-hook_type-enum]] (enum, requires tagging pipeline), and [[backlog/creative-attribute-pending#b-crt-attr-11--deferred-hook-sub-attributes]] (fields explicitly deferred with written rationale). `Re-hook` is tracked under the same B-CRT-ATTR-11 deferral.
- **`inputReferencePackId` naming drift.** [[discovery/ad-creative-dna/creative-dna-definition]] §3.1 uses `inputReferencePackId` as a field name predating the generative-mode definition of `Input Reference` added in dictionary v0.3.3. Since the generative-mode Input Reference is already a set (not a pack of references), the `Pack` infix is redundant. Reconcile the field name on the next revision of the Creative DNA contract.
- **Input Reference selection strategies are enumerated but not governed.** The seven strategies listed under `Input Reference` are a working catalog, not a ratified enum. Governance (who proposes new strategies, what evidence is required, which constitution anchors it) is open.

## Connections

| Document | Type | Description |
|---|---|---|
| [[metrics-dictionary]] | `pairs-with` | Names numbers; this dictionary names concepts. Every metric there references a concept here. |
| [[axiom/creative-axioms]] | `contextualizes` | Axioms reference the entities defined here |
| [[premise/creative-premises]] | `contextualizes` | Premises reference the entities defined here |
| [[constitution/winning-creative-constitution]] | `contextualizes` | Winning-creative rules use the lifecycle and classification terms defined here |
| [[constitution/creative-removal-constitution]] | `contextualizes` | Removal rule uses `Criativo Ativo`, `Contrafactual`, `Janela de Avaliação` defined here |
| [[constitution/creative-attribute-constitution]] | `contextualizes` | Attribute schema uses the creative-attribute terms |
| [[spec/creative-metrics]] | `pairs-with` | Narrative explanation of metric relationships; metrics themselves live in [[metrics-dictionary]] |
| [[conceptual/performance-marketing-context]] | `contextualizes` | Historical context that gives these terms their meaning |
| [[conceptual/creative-flows]] | `contextualizes` | Sourcing flows use the terms defined here |
| [[discovery/creative-embedding-applications]] | `questions` | Pending decision on what `Creative Embedding` is committed to encode |
| [[discovery/segmentation-dores-do-cliente]] | `contextualizes` | Outcome reshapes `Audiência` |
| [[backlog/creative-attribute-pending]] | `contextualizes` | Pending schema changes that reference concepts defined here |
