---
tags: [agents, dispatch, research, legibility, meta-layers, two-layer]
node_type: research
is_session: false
layer: meta
nature: explanatory
status: complete
version: 1.0.0
last_updated: 2026-06-12
created_by: victorboscaro@gmail.com
---

# research.md — returns verbatim do dispatch 2026-06-12-meio-termo-meta-layers-two-layer

Dispatch: `2026-06-12-meio-termo-meta-layers-two-layer` (ledger: `telemetry/agents/subagents-dispatch.yaml`).
Fontes lidas: `../domainspec-lean-formalization/docs/meta-layers-reference.md` e `../domainspec-lean-formalization/docs/domainspec-two-layer-framework.md` (+ versões distilled).
Eixo anti-bias: cada leitor é campeão do próprio doc como template da camada executiva.
Montagem determinística pelo parent; conteúdo dos filhos congelado.

---

## RETURN — Shannon, Claude | explorer | campeão do meta-layers-reference

Nota de fonte: as duas cópias (docs/ e distilled/) são idênticas em conteúdo (v0.9.0, 2026-06-10); diferem só na tabela Connections (artefato de navegação).

### 1. O modelo em linguagem comum

O framework Meta-Layers descreve um sistema de software como duas trilhas paralelas operando sobre o mesmo domínio.

A **trilha de objeto** (L0 a L2.5) é onde o domínio é representado e construído: L0 é a realidade (clientes, pedidos, regras pré-software); L1 é o entendimento formal, em duas resoluções (conhecimento tácito do praticante = L1-operational; spec abstrata do arquiteto = L1-architectural); L2 é o código/schemas/APIs. Três meias-camadas candidatas (L0.5, L1.5, L2.5) ficam nas transições: elicitação, superfície de compilação, operação em runtime.

A **trilha meta** (L3 a L6) governa a trilha de objeto de fora: L3 carrega as regras (constituições em prosa com racional + skills operacionais); L4 é a fundação epistêmica (premissas; premissa mudou → cascata regra → código); L5 torna o conhecimento navegável (orientação, não enforcement); L6 é enforcement (transforma convenção L3 em invariante checável; bloquear vs medir é específico da instância). A separação de trilhas é estrutural: regras que vivem dentro do sistema que governam ficam invisíveis.

L7 não é camada que alguém constrói — é a propriedade emergente quando as trilhas estão alinhadas: o sistema vira auto-descritivo. O modelo também especifica dinâmica: quatro loops de reforço (entropia R1, composição de conhecimento R2, sobrecarga burocrática R3, colapso de enforcement R4) e três de balanceamento (B1–B3); a disputa R2-vs-R1 determina a saúde de longo prazo.

### 2. Regras de estilo/comunicação que o doc incorpora

- **Precisão sobre condicionalidade:** claims escopadas ("where wired", "instance-specific"); recusa de afirmar loop fechado que está aberto.
- **Polaridade antes da prosa:** claims dinâmicas formalizadas em tabelas de polaridade antes da narrativa.
- **Collapse tests:** o modelo nomeia as condições sob as quais suas claims centrais quebram — falsificabilidade como qualidade de comunicação.
- **Camadas nomeadas, não referências implícitas:** nunca "a arquitetura"; sempre L3, L6, a variável específica.
- **Status headers em claims prospectivas:** "Status — model, not measurement".
- **Separação diagrama/prosa:** diagramas servem navegação, não completude.

### 3. Como moldaria a camada executiva

Elementos, nesta ordem: **Layer Attribution Block** (2–4 frases situando em quais camadas o design opera); **Track Separation Statement** (1 frase por trilha: o que constrói / que governança muda); **The Compilation Arrow** (o que é traduzido e onde o resíduo é esperado, em linguagem comum); **Open Loop Inventory** (3–5 bullets escaneáveis: quais loops estão abertos/fechados/vivos); **Collapse Tests** (2–3 condições que falsificariam as claims centrais); **Open Questions numeradas** (tensões estruturais com dois chifres nomeados, não tarefas adiadas).

### 4. Forças e limites para esse uso

Forças: a L1 de dupla resolução nomeia exatamente a divergência runtime-vs-spec dos sistemas multi-agente; o modelo de loops captura o modo de falha estrutural da governança de agentes (R3 roda mais cedo; R4 é mais perigoso); enforcement específico-da-instância é o mental model certo; o collapse-test torna defeito estrutural o que costuma ser preferência de estilo.

Limites: a profundidade é o atrito — "L1.5 compilation surface" é opaco sem legenda fixa de duas frases no topo; as tabelas de polaridade são densas demais para entrada (a entrada lista o inventário de loops sem reimprimir a cadeia causal); as três camadas em probation são ruído para a entrada (commit ou drop; o hedge de admissão fica no doc de arquitetura).

Dissent: O campeão do two-layer dirá que dez camadas nomeadas (três em probation) é scaffolding demais para a audiência de entrada e que o split operational/architectural adiciona overhead que o binário objeto/meta elimina — que a entrada deve suprimir numeração e falar em dois vocabulários (o que constrói vs o que governa). A resposta meta-layers: a supressão troca legibilidade por precisão exatamente onde a precisão mais importa — a seta de compilação e o ponto de origem do drift. Um resumo de duas camadas não consegue nomear onde o drift entra; um mapa de dez consegue. Para quem precisa AGIR sobre o doc, a localização do gap é o deliverable central.

---

## RETURN — Simon, Herbert | explorer | campeão do two-layer-framework

Nota de fonte: as duas cópias diferem — a distilled (2026-04-29) é snapshot anterior (4 registros, sem a seção da escada categórica); a principal (2026-06-07) é a autoritativa. Análise sobre a principal.

### 1. O modelo em linguagem comum

Duas camadas que todo ato de compilação atravessa, permanentemente independentes — auditar uma nunca cobre a outra.

**Camada 1 — Schema (contrato):** o nível dos tipos; fidelidade de vocabulário — o sistema de tipos do alvo tem slot para cada conceito do domínio? Instrumento: um funtor Delta de L1 (ontologia) para L2 (schema); a unit map por conceito detecta o que não tem sombra no alvo.

**Camada 2 — Instance (dados):** o nível da população; fidelidade de round-trip — empurro o estado populado pelo compilador, leio de volta, recupero o que tinha? Instrumento: o triplo adjunto (incondicional, de graça via Kan extension); a unit map diz exatamente quais células foram perdidas ou alucinadas.

**A regra de fronteira:** fidelidade de schema NÃO compra fidelidade de dados — provado, não asserido (contra-exemplo de quatro objetos em Lean): L2 pode conter morfismos sem preimagem em L1, e quando dados cruzam esses morfismos, o sistema inventa testemunha sem instrução. A fronteira é teorema, não escolha de design; as duas auditorias são separadas e nenhuma é dispensável.

### 2. Regras de estilo/comunicação que o doc incorpora

- **Intuição antes da matemática, sempre:** cada construto entra primeiro em linguagem comum com exemplo concreto, depois formaliza. Padrão estrito por seção.
- **Status explícito e tipado:** quatro categorias epistêmicas (formalizado em Lean / caracterizado / refutado / conjectura aberta); claim nunca fica em estado não-marcado.
- **Concessões nomeadas:** ledger de custos em tabela, com o que cada custo compra.
- **A parede é honesta:** §6 nomeia onde o raciocínio formal termina e a prática empírica começa.
- **Registros load-bearing, não decorativos:** a mesma claim aterrissada em cinco vocabulários; os ilustrativos flagged sem formalização.
- **Analogia motivada e imediatamente disclaimed** (Noether: invocada para intuição, declarada analogia, citada a prova de que o mecanismo não se aplica).

### 3. Como moldaria a camada executiva

Sob esse modelo, a entrada NÃO é um resumo — é uma **declaração tipada de status**: o que foi decidido, em qual camada, com qual status epistêmico. Estrutura: **A** — as duas perguntas que o doc responde (1 frase cada; sem preâmbulo); **B** — o que está assentado, em tabela (claim, camada, status epistêmico, consequência de 1 linha para o praticante; só claims load-bearing); **C** — a regra de fronteira, declarada uma vez, em linguagem comum; **D** — as perguntas abertas com a condição que fecharia cada uma; **E** — onde fica a parede formal (o que exige juízo humano que nenhum teorema cobre). O que a entrada NÃO contém: motivação, literatura, derivações, notas de implementação.

### 4. Forças e limites para esse uso

Forças: o split duas-camadas é exatamente o que um doc multi-agente precisa na entrada (problema de schema: as interfaces dos agentes carregam os conceitos? problema de dados: as mensagens carregam o que as interfaces prometem?); o status-typing força separar decidido de assumido — honesto por construção; o ledger de custos pega dependências escondidas; a parede honesta impede overpromising.

Limites: o modelo é para um único funtor de compilação — sistemas multi-agente têm cadeias compostas (agente A compila domínio→mensagens, B compila mensagens→ações, orquestrador compila ambos→estado), e o framework não resolve nativamente se trata o pipeline como um Delta só (perde visibilidade por salto) ou aplica por salto (multiplica a superfície de auditoria); o backing em Lean é do caso single-Delta; e o doc tolera densidade que nem todo contexto compartilha (400 palavras antes da matemática).

Caso pelo modelo: a entrada certa não "explica o sistema" — **localiza onde as decisões vivem e qual o status epistêmico de cada uma**; vocabulário sem status epistêmico é exatamente o que produz docs que parecem assentados quando não estão.

Dissent: O campeão do meta-layers dirá que a prescrição é estreita — só dois eixos ortogonais de auditoria e uma tabela de status, quando um doc multi-agente com N agentes e K níveis de orquestração precisa de um mapa de camadas, não de um split binário; que sem o mapa vertical a tabela de status fica desancorada; e que o contra-exemplo de quatro objetos é resultado sobre UM salto, não sobre a composição de saltos que define comportamento multi-agente.
