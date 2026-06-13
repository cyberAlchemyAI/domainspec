---
tags: [agents, dispatch, review, io-contracts, design-space, p9]
node_type: audit
is_session: false
layer: architecture
nature: technical
status: active
veracidade: high
convicção: high
version: 0.1.0
last_updated: 2026-06-12
created_by: l2a-designspace (skeptic, dispatch 2026-06-12-agent-io-discovery)
---

# Review L2a — completude e justiça do design space (discovery.md §2 vs research/research.md)

Gate único: para cada alternativa que um explorer DEFENDEU de verdade nos returns E1/E2/E3, ela aparece na discovery na sua forma mais forte ou como espantalho? Método: leitura integral de `research/research.md` (os três returns são o teste) contra `discovery.md` v0.2 §2, §3.7, §4, §5. Espantalho = enfraquecer para vencer; cada item cita o texto original vs o texto da discovery.

## Resultado por teste do briefing

- **(a) E2 pró-precedente** — FALHA PARCIAL (S1): a posição real de E2 (candidato composto em 5 peças, família artifact-as-contract) nunca é apresentada como candidato; §2(a) reduz E2 à família message-schema.
- **(b) Minimalismo de E3** — ÍNTEGRO no essencial: o critério checagem-nomeada está citado verbatim ("o único campo de corpo estruturado que as regras exigem, e exigem PORQUE uma checagem nomeada o consome"), o experimento natural §7 está, e o dissenso de E3 R1 permanece vivo em §3.2 e §5.3. Defeito menor S5 (Tam et al. sem a contestação que o próprio E3 carregava).
- **(c) Dissenso de E1 contra validação mecânica** — REPRESENTADO com fidelidade: §2(c) cita "seriam pegas por um checklist de 5 itens no close, não por um schema executável" verbatim, e a inconsistência interna de E1 (três quebras em ev. 2 vs "duas" no Dissent) é registrada em vez de harmonizada. PASS.
- **(d) Três posições de mecanização** — cada uma carrega um argumento próprio de uma linha em §2(d), não só o nome. PASS em substância, com caveat S6: as posições l3a/l3b/l3c moram no findings §6.1, fora da fonte que me foi dada (research.md) — fidelidade não verificável por este review; e uma quarta opção real de E2 não aparece como alternativa perdedora.
- **(e) Alternativas faltantes** — TRÊS perdas reais: severidades fora da lista de invariantes de condensação (S2), lista de fontes com URL do envelope de E2 sumida sem veredito (S3), tensão ev. 6 × append-only não endereçada (S4). Re-ask vs degradar-direto existe na discovery (§3.4, §4 item 4) mas fora do design space §2 (S7).

## Itens

### S1 — MAJOR — §2(a) apresenta E2 como defensor da família message-schema; o candidato real de E2 (composto de 5 peças, família artifact-as-contract) nunca aparece como candidato

- **Texto original (research.md §E2):** "**Não existe contrato adotável de prateleira** ... Mas existe um **contrato composto por precedentes**, em que cada peça é adotada, não inventada" — 5 peças numeradas; e "**Duas famílias de contrato, não uma:** *message-schema* ... e *artifact-as-contract* ... Sistemas de research de longa duração convergem para a segunda família."
- **Texto da discovery (§2(a)):** título "Schemas tipados de mensagem — a posição dos frameworks (E2)"; forma mais forte = AutoGen Pydantic/`CantHandleException` + LangGraph TypedDict; "O argumento: contrato por role = tipos aceitos + falha explícita ... (research.md §E2, Candidato #5)."
- **Por que é espantalho por misatribuição:** §2(a) seleciona como representante de E2 exatamente a única peça que depois é declinada provisoriamente (§4 item 7) e a família que E2 diz NÃO ser a convergência para o nosso caso. As peças load-bearing do candidato de E2 — #1 (artefato persistente + referência leve, "o synthesizer nunca recebe transcript de explorer"), #2 (âncoras estáveis), #3 (reducer append-only puro), #4 (checagem de citação como passo dedicado pós-síntese) — são absorvidas em "A convergência" sem nunca serem apresentadas como o candidato de E2. O leitor vê E2 "defendendo" tipagem e a convergência "vencendo"; na fonte, a convergência É majoritariamente o candidato de E2.
- **Agravante (§4 item 1):** "Tipar o corpo epistêmico (JSON de claims/evidência) — **a forma mais forte da família message-schema (a)**". Falso pela própria fonte: E2 afirma "nenhum framework tenta schematizar o conteúdo epistêmico (claims, evidência)" e seu Dissent chama isso de "inventar sem precedente exatamente onde o ângulo E2 manda adotar". Tipar o corpo não é a forma mais forte da família dos frameworks — é uma forma sem precedente algum, que E2 matou. A retórica de §4(1) contamina §2(a) retroativamente: a posição atribuída a E2 em (a) é morta em §4(1) usando o dissent do próprio E2 contra ela.
- **Correção mínima:** retitular (a) para a posição real ("contrato composto por precedentes — artifact-as-contract com envelope tipado e passo dedicado de checagem"), apresentar as 5 peças e as duas famílias, e em §4(1) remover "a forma mais forte da família message-schema (a)" (é forma sem precedente, não a mais forte de (a)).
- **Atenuante declarado:** nenhuma peça de E2 foi perdida em substância — todas aterrissam em algum GO/declínio; o defeito é de atribuição e de narrativa do confronto, não de cobertura.

### S2 — MAJOR — severidades sumiram da lista fixa de invariantes de condensação que E1 defendeu explicitamente

- **Texto original (research.md §E1, "Regra de condensação (o buraco central)"):** "se 'verbatim' for relaxado, o contrato deve listar o que é invariante sob condensação: **IDs, severidades, âncoras de evidência, linhas Dissent, posições inicial/final** sob robot-talks." E ev. 3 testemunha: o que sobreviveu à condensação real foi "IDs, **severidades**, âncoras de evidência".
- **Texto da discovery (§3.7, row verbatim/condensação):** "rota de condensação só pelo emissor, carimbada, **lista fixa de invariantes (IDs, âncoras, Dissent, posições)**".
- **Por que viola o gate:** um elemento que a fonte defendeu explicitamente desapareceu em silêncio — sem GO, sem KILL, sem OPEN — na exata decisão cujo propósito é impedir perda silenciosa sob condensação. A lista "fixa" da discovery é mais curta que a lista da fonte e nada registra o corte.
- **Caveat de fonte:** não posso verificar pelo research.md se o corte foi feito deliberadamente pelo findings §2 #11 (fora do meu escopo dado). Se foi, o drift nasce upstream — mas a discovery, que se declara codificação, deve ou restaurar "severidades" ou registrar o corte como decisão citada.
- **Correção mínima:** acrescentar "severidades" à lista fixa, ou anotar na row a decisão (com citação) que as excluiu.

### S3 — MODERATE — "lista de fontes com URL" da peça #1 de E2 sumiu sem veredito

- **Texto original (research.md §E2, Candidato #1):** "frontmatter com agent id/role/modelo, **e lista de fontes com URL**, e seções padronizadas por role."
- **Texto da discovery:** o contrato de header (§3.7 row 1) fecha em "identidade + ângulo iff n≥2; modelo opcional/informativo" — lista de fontes não aparece em nenhum GO, KILL, declínio ou OPEN do documento.
- **Por que viola o gate:** elemento de um candidato defendido que não foi adotado nem rejeitado — apenas evaporou. O design space deve ou bancá-lo (provavelmente KILL pelo critério de E3: nenhuma checagem nomeada consome lista de fontes — as âncoras por claim já cobrem) ou registrá-lo como declínio com razão.
- **Correção mínima:** uma linha em §4 matando-o pelo critério E3 R5 (campo sem checagem que o consuma), ou adoção explícita.

### S4 — MODERATE — a tensão entre E1 ev. 6 (verificação do parent interfoliada NO return) e o conteúdo-do-filho-congelado não é endereçada

- **Texto original (research.md §E1 ev. 6):** "Verificação do parent **interfoliada no research.md** com marcador explícito — **prática boa não codificada**. ... claims checados pelo parent carregam '*(Parent verified: ...)*' **inline no return do explorer**".
- **Texto da discovery:** ev. 6 é citado como base de âncoras e do #9 (§3.7), mas a prática em si — parent escrevendo DENTRO do return do explorer — colide frontalmente com o que foi adotado: E2 peça #3 ("reducer puro ... **conteúdo do filho congelado**", citado em §3.7 append-only) e §4 item 6 ("conserto silencioso pelo parent ... é o canal exato que E1 ev. 3 mostra degradar").
- **Por que viola o gate:** duas práticas defendidas pelas fontes são mutuamente incompatíveis na forma e o design space não registra a colisão nem decide o destino da metade de ev. 6 (a anotação inline) — só a metade taxonômica (parent-verified como tier) sobreviveu, dentro do OPEN §5.2. Um implementador da spec pode reproduzir a interfoliação achando-a sancionada por ev. 6.
- **Correção mínima:** registrar em §4 ou §5 o destino da anotação inline (ex.: anotação do parent vira seção própria append-only assinada, nunca edição do return), citando a colisão ev. 6 × peça #3.

### S5 — MINOR — Tam et al. apresentado como assentado; E3 carregava a contestação e a leitura convergente, a discovery descarta ambas

- **Texto original (research.md §E3, evidência (a)):** Tam et al. + "**Réplica/contestação — dottxt** ... ataca a metodologia (prompts desiguais entre condições)" + "Convergência da literatura posterior: a degradação concentra-se quando a restrição se aplica **durante** o raciocínio".
- **Texto da discovery (§2(b)):** "restrição de formato durante o raciocínio degrada qualidade (Tam et al. 2024)".
- **Por que importa:** comprime a leitura convergente para dentro do Tam et al. e omite a contestação que o próprio E3 declarou. É distorção lisonjeira (fortalece E3, não o enfraquece), mas o design space perde a honestidade da fonte sobre a qualidade da evidência — um leitor da spec tratará como incontestado o que E3 apresentou como contestado-e-convergido.
- **Correção mínima:** "(Tam et al. 2024, contestado por dottxt; leitura convergente da literatura posterior)".

### S6 — MINOR — §2(d) PASS em substância, com duas ressalvas: fidelidade não verificável pela fonte dada; a quarta opção de E2 (verificador dedicado) não figura como alternativa

- As três posições carregam argumentos próprios de uma linha (l3a "único default constitucionalmente seguro"; l3b "mecânica confinada à row até existir testemunha"; l3c "item (i) inferramentável por construção") — não são só nomeadas. Porém vivem em findings §6.1, fora do research.md que me foi dado como teste: fidelidade dos três enunciados fica para o reviewer com escopo no findings.
- **Texto original (research.md §E2, Candidato #4):** "**um verificador mecânico/agente** que percorre cada claim de findings.md e confirma que a âncora citada existe ... **É aqui que a verificabilidade mora**" — um passo/agente dedicado pós-síntese. A discovery o demove a checklist do approver em "A convergência" ("aqui demovida a checklist de close") sem que a forma original (agente/passo dedicado, possivelmente mecânico) apareça como alternativa perdedora em §2(d) ou §5.1. Se "script" de l3b a subsume, dizer isso; hoje a demoção acontece em aposto, sem confronto.
- **Correção mínima:** uma linha em §2(d) ou §5.1 registrando "passo/agente dedicado de citação (E2 #4)" como quarta forma dentro do OPEN de mecanização.

### S7 — MINOR — o design space anuncia "quatro posições reais entraram em colisão", mas a colisão re-ask vs degradar-direto só existe downstream

- A colisão real l3a K3 × l3b T3 (re-ask sem teto vs P4 literal) está bem tratada em §3.4 e §4 item 4 — não falta conteúdo. Falta enquadramento: §2 se apresenta como O design space e escopa silenciosamente só o confronto de contrato-de-corpo. Um leitor que use §2 como inventário de alternativas não encontra a alternativa "remoção total do re-ask" que §4(4) rejeita.
- **Correção mínima:** uma frase de escopo no preâmbulo de §2 ("posições sobre o contrato de corpo; colisões de arbitragem em §3/§4") ou uma quinta entrada compacta.

## Veredito do gate

O design space é COMPLETO em cobertura (nenhum argumento substantivo dos três returns está fora do documento) mas INJUSTO em uma atribuição estruturante: S1 faz E2 defender a posição que E2 matou e entrega o candidato real de E2 à "convergência" anônima. S2 é a única perda de substância encontrada (severidades). Os demais itens são lacunas de registro, não enfraquecimento para vencer. Com S1+S2 corrigidos, §2 passa o gate.

Dissent: discordo da minha própria severidade em potência — se o findings §2 #11 cortou "severidades" deliberadamente e a discovery apenas o seguiu, S2 cai de MAJOR para nota de proveniência upstream e o veredito do gate vira "injusto em atribuição (S1), completo em substância"; não pude decidir isso porque o findings está fora da fonte que o briefing me deu como teste, e registro que um co-reviewer com escopo no findings pode legitimamente rebaixar S2.
