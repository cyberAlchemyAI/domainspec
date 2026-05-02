---
tags: [creatives, trama, taxonomy, ad-creative-dna]
node_type: constitution
is_session: false
scope: domain
representation_layer: L3
nature: reference
status: draft
version: 0.1.0
last_updated: 2026-04-22
---

# Creative Gene Orthogonality Constitution (TRAMA)

> Governing rule for how creative classification genes must be structured in CapoMastro and the TRAMA Creative DNA contract. Every registered creative must satisfy this constitution. Violations are schema violations.

---

## Objective

Establish the three canonical orthogonal gene dimensions for Ad Creative DNA: `angulo`, `contexto`, and `formato`. Define valid values, nullability rules, and the orthogonality invariant each gene must satisfy. This constitution replaces the legacy flat `tema` field and extends `formato` to cover image assets in addition to video.

---

## The Orthogonality Invariant

> **A gene is only valid if knowing its value gives zero information about the value of any other gene.**

In practice: no gene may encode information that belongs to another. Violations are detectable when:
- A gene value implies a value in another gene (e.g., a `formato` value that forces an `angulo`)
- A gene value is systematically empty because it is already captured elsewhere
- Two genes have overlapping value sets with the same semantic meaning

The three-gene model is the minimum viable set that satisfies orthogonality for creative classification at TRAMA's current operational scale.

---

## Gene Catalog

### Gene 1 — `angulo` (required, non-nullable)

**What it captures:** The persuasion argument — *why the customer should buy*. The core message, stripped of how it is delivered.

**Admission test:** Remove all information about who is speaking, how the creative is structured, and where the product is being used. What remains is the `angulo`.

**Invariant:** `angulo` must not encode a use-case context or a creative execution mechanic. If the value implies a scene (e.g., "treino") or a structure (e.g., "entrevista"), it belongs to `contexto` or `formato`, not here.

| Value | Meaning |
|---|---|
| `dor` | Endereça um problema real do cliente antes de apresentar o produto |
| `custo-beneficio` | Argumento de valor: o que o cliente ganha pelo preço que paga |
| `qualidade` | Construção, durabilidade, materiais — o produto é feito para durar |
| `atributos` | Features técnicas específicas do produto como argumento central |
| `branding` | Posicionamento de marca, identidade, atmosfera — o produto é secundário |
| `comparacao` | Contraste com alternativas: produto genérico, concorrente, situação anterior |
| `social-proof` | Prova de terceiros: reviews, avaliações, comentários de clientes |
| `novidade` | Lançamento: novo produto, nova cor, nova versão |
| `desconto` | Desconto direto no preço como argumento de compra |
| `urgencia` | Escassez temporal ou de estoque: últimas unidades, oferta por tempo limitado |
| `levepague` | Promoção "leve X pague Y" |
| `compreganhe` | Promoção "compre X ganhe Y" |
| `progressivo` | Desconto progressivo por quantidade |
| `presente` | Contexto de gifting: sugestão de presente, datas comemorativas |
| `colecao` | Apresentação de coleção ou linha completa de produtos |

---

### Gene 2 — `contexto` (nullable)

**What it captures:** The use-case context — *where or when the product is being used in the creative*. Only populated when a specific life moment or activity is depicted.

**Nullability rule:** `contexto` is null when the creative does not position the product within a specific use scenario. A branding piece, a discount overlay, or a copy-driven image with no depicted scene are all `contexto: null`.

**Invariant:** `contexto` must not encode the persuasion argument or the creative structure. If the value implies a message (e.g., "urgencia") or a mechanic (e.g., "gimmick"), it belongs to `angulo` or `formato`.

| Value | Meaning |
|---|---|
| `treino` | Academia, atividade física, esporte |
| `trabalho` | Escritório, home office, reunião |
| `viagem` | Mobilidade, praticidade em trânsito |
| `calor` | Clima quente, verão |
| `casual` | Dia a dia, sem contexto específico de atividade |
| `estilo` | Inspiração de look, montagem de outfit, styling |
| null | Nenhum contexto de uso específico é retratado |

---

### Gene 3 — `formato` (required, non-nullable)

**What it captures:** The creative execution structure — *how the story is told or how the creative is built*. Applies to both video and image assets.

**Invariant:** `formato` must not encode the persuasion argument or the use-case. If the value implies a message or a scene, it belongs to `angulo` or `contexto`. The same `formato` must be possible across multiple `angulo` values — that independence is the test.

Values marked **[V]** apply primarily to video. Values marked **[I]** apply primarily to image. Unmarked values apply to both.

| Value | Asset | Meaning |
|---|---|---|
| `entrevista` | [V] | Formato de entrevista, Q&A ou conversa sobre o produto |
| `dica-amigo` | [V] | Recomendação informal como se um amigo estivesse indicando. Tom conversacional, baixa produção proposital |
| `autoridade` | [V] | Um especialista, médico, esportista ou figura de autoridade valida o produto |
| `ugc` | [V] | User-generated content — estética de vídeo de usuário real, baixa produção |
| `demo-prova` | | Demonstração do produto em uso com evidência visual do benefício. "Ver para crer" |
| `testemunhal` | | Depoimento ou prova social de cliente real integrada ao visual |
| `deepdive` | | Exploração detalhada de um atributo, história ou prova do produto. Alta densidade de informação |
| `countdown` | | Contagem regressiva visual — cria urgência temporal |
| `gimmick` | | Truque criativo: transição inesperada, elemento surpresa, mecânica incomum |
| `nonsense` | | Criativo absurdo ou sem lógica aparente. Objetivo: surpresa e clique por estranhamento |
| `overlay` | [I] | Texto ou arte sobre imagem de produto. Sem cena, sem personagem, sem narrativa |
| `copy-driven` | [I] | O copy ocupa posição visual dominante; a imagem é subordinada ao texto |
| `product-only` | [I] | Foto limpa do produto sem copy dominante nem narrativa — o produto como herói visual |

---

## Validity Rules

1. Every creative registered in CapoMastro must declare `angulo` and `formato`. Both are required.
2. `contexto` is optional. When no use-case is depicted, it must be explicitly set to null — not omitted.
3. No value from `angulo` may appear in the `formato` catalog and vice versa.
4. `gimmick` and `nonsense` in `formato` describe how the creative is built, not what it says. A `gimmick` creative may have any `angulo`.
5. The legacy `tema` compound field is **deprecated** for new production. Existing creatives labeled with `tema` are grandfathered for historical analysis but must not be used as training signal in gene-level optimization without decomposition.

---

## Migration Note

The legacy `tema` field compresses `angulo` + `contexto` into a single label. The decomposition mapping is:

| Legacy `tema` | `angulo` | `contexto` |
|---|---|---|
| `dor` | `dor` | null |
| `branding` | `branding` | null |
| `qualidade` | `qualidade` | null |
| `atributos` | `atributos` | null |
| `custo-beneficio` | `custo-beneficio` | null |
| `comparacao` | `comparacao` | null |
| `social proof` | `social-proof` | null |
| `styling` | `branding` | `estilo` |
| `roupa-treino` | *(best-effort from briefing)* | `treino` |
| `roupa-trabalho` | *(best-effort from briefing)* | `trabalho` |
| `roupa-viagem` | *(best-effort from briefing)* | `viagem` |
| `roupa-calor` | *(best-effort from briefing)* | `calor` |
| `promo-desconto` | `desconto` | null |
| `promo-urgencia` | `urgencia` | null |
| `promo-levepague` | `levepague` | null |
| `promo-compreganhe` | `compreganhe` | null |
| `promo-progressivo` | `progressivo` | null |
| `presente` | `presente` | null |

Legacy `tema` values that were actually `formato` (image):

| Legacy `tema` | `formato` |
|---|---|
| `overlay` | `overlay` |
| `gimmick` | `gimmick` |
| `gimmick-ui` | `gimmick` |
| `nonsense` | `nonsense` |
| `copy-*` (todos) | `copy-driven` |
| `marca-testemunhal` | `testemunhal` |
| `marca-deepdive` | `deepdive` |

---

## Open Questions

### OQ-1 — `roupa-*` decomposition requires briefing read
For legacy `roupa-*` labels, `angulo` cannot be recovered from the label alone — it requires reading the briefing. Decision: accept partial backfill for historical analysis; flag these creatives as `angulo: unknown` until manually resolved.

### OQ-2 — `formato: ugc` vs `dica-amigo`
`ugc` and `dica-amigo` overlap in aesthetic. `ugc` is about production style (looks like a user recorded it); `dica-amigo` is about narrative tone (structured as a personal recommendation). A video can be both. Resolution pending: define as one field or split into `formato` (ugc) and `tom` (dica-amigo)?

### OQ-3 — `estilo` as `contexto` value vs standalone gene
`estilo` (look inspiration, outfit styling) is arguably its own dimension — it's more about the *intent* of the creative (aspiration) than the use case. Consider splitting into a separate gene in v0.2.

---

## Connections

| Document | Type | Description |
|---|---|---|
| [creative-attribute-constitution.md](creative-attribute-constitution.md) | `refines` | Refine section 04 (Ângulo / Mecânica) da constituição de atributos |
| [creative-dna-definition.md](../../docs/features/ad-creative-dna/discovery/creative-dna-definition.md) | `refines` | Substitui `angleFamily` + `angle` pelo modelo de três genes ortogonais |
| [tema.md](../../docs/features/ad-creative-dna/metrics/tema.md) | `supersedes` | O gene `tema` é substituído por `angulo` + `contexto` nesta constituição |
| [formato.md](../../docs/features/ad-creative-dna/metrics/formato.md) | `updates` | Atualiza `formato` para cobrir imagem além de vídeo |
