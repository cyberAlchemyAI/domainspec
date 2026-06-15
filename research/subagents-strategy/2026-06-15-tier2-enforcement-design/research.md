---
tags: [subagents-strategy, research, enforcement, anti-bias, tier2, meta-dispatch]
node_type: research
is_session: false
layer: architecture
nature: reference
status: active
version: 0.1.0
last_updated: 2026-06-15
created_by: victorboscaro@gmail.com
---

# research.md — Tier 2 enforcement design (retornos coletados)

Dispatch `2026-06-15-tier2-enforcement-design` (`research`, `meta: true`).
Objetivo: tornar a garantia de qualidade (anti-bias / desacordo genuíno) **executável** para research/experiment/review.
Shape: 3 explorers (paralelo) → sintetizador → 2 reviewers (zig-zag). final_approver: parent.
Síntese citada e adjudicada em [findings.md](findings.md).

---

## Explorer — Spivak (return-contract design)

- **Reusar** o claim-ID da discovery `agents-input-output`: `<label>#<n>`, namespace-por-agente, contínuo, nunca reusado (discovery §4.2/§6.3). Não redesenhar.
- **Já existe:** research (SKILL:109) e review (SKILL:67) exigem linha `Dissent:` — mas é prosa livre, máquina nenhuma resolve a um claim do irmão. **experiment NÃO tem linha Dissent** (maior delta).
- **Peça nova única load-bearing:** gramática `Dissent: contra <sibling-claim-ID> — <negação+base>` + token vazio sancionado `Dissent: none — <razão>`. Per-dispatch a unicidade resolve o ponteiro a 1 irmão.
- **NÃO** adicionar severity/confidence/type por claim — vacuum-field trap (a discovery bane como KILL).
- **Dependência declarada, não pré-resolvida:** unicidade de `<label>` é OPEN (D4); o guard nasce PLANNED na ontology-view, não LIVE.
- Dissent: nega que o contrato precise de mais que (a) claim-ID resolvível + (b) ponteiro `contra <ID>`.

## Explorer — Shannon (detection-algorithm design)

- Checker lê 3 entradas: dispatch row; **`<working_folder>/anti-bias-preregistration.md`** (frases Item 7 congeladas — hoje sem coluna no schema; espelhar o padrão off-registry do experiment); retornos.
- Algoritmo por par: (A) parse Dissent; (B) claim-ID match (set membership; cite inexistente → dangling-cite); (C) axis tag (token do eixo na linha — string-match no enum de 4); (D) contagem (N≥3 zero-Dissent-não-`none` → FALSE-CONSENSUS).
- **Degradação graciosa:** B+D incondicionalmente mecânicos (núcleo); C soft/aditivo.
- Forma: **script Node** `check-tension-realization.cjs`, irmão do appender, exit code 0/nonzero.
- Dissent: a recomendação "script>checklist" depende de a linha carregar axis tag — que pode não existir na prática; sem ele, REALIZED/UNREALIZED colapsa em spot-check e só o false-consensus-count sobrevive como mecânico.

## Explorer — Simon (enforcement-surface design)

- **Restrição dura:** o appender só recebe um JSON record (nunca lê working_folder/retornos). Hooks PreToolUse veem a chamada, não o resultado. **O harness não tem evento "dispatch terminou".** PostToolUse(Agent) dispara por agente isolado, sem fronteira de dispatch.
- Novo post-dispatch hook = inventar infra inexistente → **recusado por realizabilidade**.
- **Close-gate é o único choke point viável** (1× por dispatch, depois dos retornos, com working_folder à mão): rodar o checker antes do append da close row; INVALID bloqueia o close.
- Dente em 2 camadas: FORMA (dura) = appender exige campo `tension_verdict` na close row de LIVE types; SUBSTÂNCIA (mole) = SKILL manda rodar o checker.
- **Dissent (load-bearing):** mesmo a close-gate é teatro contra um estrategista determinado — o campo é auto-declarado (P8). Há um caso real de que tension-realization **não é mecanicamente enforçável neste harness** e que um campo carimbado dá **falsa garantia** — pior que admitir disciplina pura.

## Synthesizer — Mac Lane

Adotou: contrato mínimo de Spivak; degradação graciosa de Shannon (B+D duros, C soft); close-gate de Simon. **Descoberta M1:** adicionar a coluna `tension_verdict` na close row **é mudança de row-schema → bump do wire `schema_version` 0.5.2→0.5.3** (≠ promoções review/experiment, que não mudaram row-schema) → promoção atômica obrigatória (§10). Roteou a tensão central (campo auto-declarado vale a pena?) aos reviewers, shippando o campo como **forma-grade only** e nomeando o limite.

## Reviewer — Quine (gate non-vacuity)

**O design SOBREVIVE só como checker de *conformidade*, não de *realização* de tensão.** 5 plantios, todos FURADO:
1. **Displaced dissent:** a_i disserta contra a_k (off-axis) → count≥1 → o par prometido (a_i,a_j) concordando em silêncio **escapa**.
2. **Pro-forma:** `Dissent: contra X#1 — discordo` + axis token, sem substância → **REALIZED vacuamente**, exit 0 já saiu antes do spot-check.
3. **Prosa genuína sem a gramática** → marcado UNREALIZED erroneamente (falso-positivo) / FALSE-CONSENSUS espúrio.
4. **N=2:** D só vale N≥3 → par de 2 que prometeu divergir e concordou **passa VALID**.
- **Causa-raiz:** o checker itera sobre *cites e contagens de grupo*, **nunca sobre a pré-registração como índice de obrigação**. A frase Item 7 entra como input mas nunca como espinha do loop.
- **Aperto:** fazer a pré-registração o índice de iteração (D′: par pré-registrado com zero cross-dissent conformante → UNREALIZED-PROMISED → INVALID, independente de N); demover C (axis-token só não alcança REALIZED — exigir negação não-vazia e referencial); renomear UNREALIZED → NO-CONFORMING-DISSENT.
- Dissent: contra Mac-Lane#design — B+C+D medem "alguém citou / ninguém concordou demais", não "a tensão pré-registrada se realizou".

## Reviewer — Popper (gate definitional-soundness)

- **"Desacordo genuíno" COLAPSA em sintaxe** (Goodhart: D incentiva farmar Dissent ritual). O menor agente que satisfaz: copia um claim-ID real e escreve `Dissent: contra C-0007 — concordo no mérito mas registro pro-forma; eixo:...`. Membership válida, REALIZED dispara, desacordo zero.
- **Aperto máximo honesto:** renomear o medido para `cross_reference_realized` (B+D) e **parar de chamar de "genuine disagreement"** — nenhum checker mecânico decide contradição-de-mérito. A falsidade está no nome.
- **Adjudicação de Simon: Simon VENCE.** Campo `tension_verdict` auto-declarado é **estritamente pior que campo ausente** — importa confiança não-ganha, não-falsificável no ponto de leitura. Entre "campo que mente" e "sem campo", sem campo vence.
- **O bump 0.5.3 NÃO vale** para um campo forma-grade: paga o preço máximo de coordenação (wire-break + atomicidade) por garantia grau-zero. Um schema bump deve comprar uma invariante checável.
- **Correção que salva o campo (ponto 4):** o campo só pode existir se seu conteúdo for um **ponteiro/hash para o output do checker** anexado no working_folder, não um literal digitável. Aí forjar o VALID custa ≈ rodar honestamente → fecha (a maior parte d)o gap do P8.
- Dissent: contra "forma-grade-only é meio-termo seguro" — é o **pior quadrante**, não compromisso prudente.
