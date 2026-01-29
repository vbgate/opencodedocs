---
title: "Interrupção de Streaming: Solução de 0 Token | Antigravity-Manager"
sidebarTitle: "Autocura ou Intervenção Manual"
subtitle: "Interrupção de Streaming/0 Token/Assinatura Inválida: Mecanismo de Autocura e Caminho de Solução"
description: "Aprenda o caminho de solução para interrupção de streaming, 0 Token e assinatura inválida do Antigravity Tools. Confirme /v1/messages ou chamada de streaming nativo Gemini, entenda peek pré-leitura e backoff retry, combine com Proxy Monitor e logs para localizar rapidamente a causa e determinar se precisa rolar contas."
tags:
  - "faq"
  - "streaming"
  - "troubleshooting"
  - "retry"
prerequisite:
  - "start-getting-started"
  - "start-first-run-data"
  - "advanced-monitoring"
  - "advanced-scheduling"
order: 5
---

# Interrupção de Streaming/0 Token/Assinatura Inválida: Mecanismo de Autocura e Caminho de Solução

Ao chamar `/v1/messages` (compatível com Anthropic) ou a interface de streaming nativo do Gemini no Antigravity Tools, se você encontrar problemas como "saída de streaming interrompida", "200 OK mas 0 Token", "Invalid `signature`", este curso fornece um caminho de solução da UI aos logs.

## O Que Você Poderá Fazer Após Este Curso

- Saber que problemas de 0 Token/interrupção no proxy geralmente serão bloqueados primeiro pelo "peek pré-leitura"
- Poder confirmar a conta e modelo mapeado desta solicitação no Proxy Monitor (`X-Account-Email` / `X-Mapped-Model`)
- Poder determinar através de logs se é "fluxo upstream morreu cedo", "backoff retry", "rotação de conta" ou "retry de reparo de assinatura"
- Saber quais situações esperar a autocura do proxy, quais situações exigir intervenção manual

## Seu Problema Atual

Você pode ver esses "fenômenos", mas não sabe por onde começar:

- A saída de streaming para pela metade, o cliente parece "travado" e não continua
- 200 OK, mas `usage.output_tokens=0` ou conteúdo vazio
- Erro 400 aparece `Invalid \`signature\``, `Corrupted thought signature`, `must be \`thinking\`` etc.

Esses problemas geralmente não são "você escreveu a solicitação errada", mas streaming, limitação upstream/flutuação, ou blocos de assinatura em mensagens históricas que dispararam a verificação upstream. O Antigravity Tools fez múltiplas linhas de defesa na camada de proxy, você só precisa verificar em qual passo parou por um caminho fixo.

## O Que é 0 Token?

**0 Token** geralmente se refere a `output_tokens=0` retornado por uma solicitação, e parece "não gerou conteúdo". No Antigravity Tools, sua causa mais comum é "resposta de streaming termina/erro antes de realmente produzir saída", não o modelo realmente gerou 0 tokens. O proxy tentará usar peek pré-leitura para bloquear tais respostas vazias e disparar retry.

## Três Coisas que o Proxy Faz nos Bastidores (Primeiro Tenha um Modelo Mental)

### 1) Solicitações Não Streaming Podem Ser Automaticamente Convertidas em Streaming

No caminho `/v1/messages`, o proxy internamente converterá "solicitações não streaming do cliente" em solicitações de streaming para solicitar upstream, e após receber SSE coletará em JSON para retornar (a razão está escrita nos logs como "better quota").

Evidência do código-fonte: `src-tauri/src/proxy/handlers/claude.rs#L665-L913`.

### 2) Peek Pré-leitura: Aguarde "Primeiro Bloco de Dados Válido" Antes de Entregar o Fluxo ao Cliente

Para saída SSE de `/v1/messages`, o proxy primeiro fará `timeout + next()` pré-leitura, pulando linhas de heartbeat/comentários (começando com `:`), até pegar o primeiro bloco de dados "não vazio, não heartbeat" antes de começar o encaminhamento oficial. Se peek relatar erro/timeout/fluxo terminar, entrará diretamente na próxima tentativa (a próxima tentativa geralmente disparará rotação de conta).

Evidência do código-fonte: `src-tauri/src/proxy/handlers/claude.rs#L812-L926`; Streaming nativo Gemini também tem peek similar: `src-tauri/src/proxy/handlers/gemini.rs#L117-L149`.

### 3) Backoff Retry Unificado + Decidir "Rolar Conta ou Não" Por Código de Status

O proxy fez estratégias de backoff explícitas para códigos de status comuns, e definiu quais códigos de status dispararão rotação de conta.

Evidência do código-fonte: `src-tauri/src/proxy/handlers/claude.rs#L117-L236`.

## 🎒 Preparação Antes de Começar

- Você pode abrir o Proxy Monitor (veja [Proxy Monitor: Logs de Solicitação, Filtro, Restauração de Detalhes e Exportação](../../advanced/monitoring/))
- Você sabe que logs estão em `logs/` no diretório de dados (veja [Primeira Inicialização: Diretório de Dados, Logs, Bandeja e Inicialização Automática](../../start/first-run-data/))

## Siga-me

### Passo 1: Confirme Qual Caminho de Interface Você Está Chamando

**Por Que**
Os detalhes de autocura de `/v1/messages` (claude handler) e Gemini nativo (gemini handler) são diferentes, primeiro confirmar o caminho evita desperdiçar tempo nas palavras-chave erradas de log.

Abra o Proxy Monitor, encontre aquela solicitação falhada, primeiro anote o Path:

- `/v1/messages`: veja a lógica de `src-tauri/src/proxy/handlers/claude.rs`
- `/v1beta/models/...:streamGenerateContent`: veja a lógica de `src-tauri/src/proxy/handlers/gemini.rs`

**Você Deve Ver**: No registro de solicitação você pode ver URL/método/código de status (e tempo gasto da solicitação).

### Passo 2: Pegue "Conta + Modelo Mapeado" do Header de Resposta

**Por Que**
Para a mesma solicitação falhar/sucesso, muitas vezes depende de "qual conta foi selecionada desta vez", "para qual modelo upstream foi roteado". O proxy escreverá essas duas informações no header de resposta, primeiro anote, depois pode corresponder ao ver logs.

Naquela solicitação falhada, encontre esses headers de resposta:

- `X-Account-Email`
- `X-Mapped-Model`

Esses dois itens são definidos tanto no handler `/v1/messages` quanto no handler Gemini (por exemplo, na resposta SSE de `/v1/messages`: `src-tauri/src/proxy/handlers/claude.rs#L887-L896`; SSE Gemini: `src-tauri/src/proxy/handlers/gemini.rs#L235-L245`).

**Você Deve Ver**: `X-Account-Email` é o email, `X-Mapped-Model` é o nome do modelo realmente solicitado.

### Passo 3: Em app.log Determine se "Falhou na Fase Peek"

**Por Que**
Falha de peek geralmente significa "upstream realmente não começou a cuspir dados válidos". Tais problemas geralmente são tratados por retry/rotação de conta, você precisa confirmar se o proxy disparou.

Primeiro localize o arquivo de log (diretório de logs vem do diretório de dados `logs/`, e escreve em `app.log*` rolando por dia).

::: code-group

```bash [macOS/Linux]
ls -lt "$HOME/.antigravity_tools/logs" | head
```

```powershell [Windows]
Get-ChildItem -Force (Join-Path $HOME ".antigravity_tools\logs") | Sort-Object LastWriteTime -Descending | Select-Object -First 5
```

:::

Depois, no `app.log*` mais recente, pesquise estas palavras-chave:

- `/v1/messages` (claude handler): `Stream error during peek` / `Stream ended during peek` / `Timeout waiting for first data` (`src-tauri/src/proxy/handlers/claude.rs#L828-L864`)
- Streaming nativo Gemini: `[Gemini] Empty first chunk received, retrying...` / `Stream error during peek` / `Stream ended immediately` (`src-tauri/src/proxy/handlers/gemini.rs#L117-L144`)

**Você Deve Ver**: Se peek retry foi disparado, o log aparecerá com alertas semelhantes a "retrying...", e subsequentemente entrará na próxima tentativa (geralmente trará rotação de conta).

### Passo 4: Se for 400/Invalid `signature`, Confirme se o Proxy Fez "Retry de Reparo de Assinatura"

**Por Que**
Erros de assinatura frequentemente vêm de blocos Thinking/blocos de assinatura em mensagens históricas que não atendem aos requisitos upstream. O Antigravity Tools tentará "degradar blocos thinking históricos + injetar prompt de reparo" e depois retry, você deve primeiro deixar a autocura completar.

Você pode usar 2 sinais para determinar se entrou na lógica de reparo:

1. Log aparece `Unexpected thinking signature error ... Retrying with all thinking blocks removed.` (`src-tauri/src/proxy/handlers/claude.rs#L999-L1025`)
2. Posteriormente converterá blocos `Thinking` históricos em `Text`, e na última mensagem do usuário anexará o prompt de reparo (`src-tauri/src/proxy/handlers/claude.rs#L1027-L1102`; O handler Gemini também anexará o mesmo prompt em `contents[].parts`: `src-tauri/src/proxy/handlers/gemini.rs#L300-L325`)

**Você Deve Ver**: O proxy tentará retry automaticamente após um pequeno atraso (`FixedDelay`), e pode entrar na próxima tentativa.

## Pontos de Verificação ✅

- [ ] Você pode confirmar no Proxy Monitor o caminho da solicitação (`/v1/messages` ou Gemini nativo)
- [ ] Você pode obter o `X-Account-Email` e `X-Mapped-Model` desta solicitação
- [ ] Você pode pesquisar palavras-chave relacionadas a peek/retry em `logs/app.log*`
- [ ] Ao encontrar erro de assinatura 400, você pode confirmar se o proxy entrou na lógica de retry "prompt de reparo + limpar blocos thinking"

## Lembrete de Armadilhas

| Cenário | O Que Você Pode Fazer (❌) | Recomendado (✓) |
| --- | --- | --- |
| Ver 0 Token e imediatamente tentar manualmente muitas vezes | Continuar pressionando o botão de retry do cliente, sem olhar o log | Primeiro olhe uma vez o Proxy Monitor + app.log, confirme se é morte prematura na fase peek (retry/rotação automática) |
| Encontrar `Invalid \`signature\`` e diretamente limpar diretório de dados | Deletar todo `.antigravity_tools`, contas/estatísticas tudo vai | Primeiro deixe o proxy executar uma vez "retry de reparo de assinatura"; só quando o log explicitamente dizer irreparável, considere intervenção manual |
| Tratar "flutuação de servidor" como "conta quebrada" | Rolar conta para todos 400/503/529 | Se rotação é efetiva depende do código de status; o próprio proxy tem regras `should_rotate_account(...)` (`src-tauri/src/proxy/handlers/claude.rs#L226-L236`) |

## Resumo da Lição

- 0 Token/interrupção de streaming no proxy geralmente primeiro passa por peek pré-leitura; falha na fase peek disparará retry e entrará na próxima tentativa
- `/v1/messages` pode internamente converter solicitações não streaming em streaming e coletar de volta em JSON, isso afeta sua compreensão de "por que parece problema de streaming"
- Para erros 400 de falha de assinatura, o proxy tentará "prompt de reparo + limpar blocos thinking" e depois retry, você priorize verificar se esse caminho de autocura passou

## Próximo Passo

> Na próxima lição aprenderemos **[Tabela de Consulta Rápida de Endpoints](../../appendix/endpoints/)**.

---

## Apêndice: Referência do Código-fonte

<details>
<summary><strong>Clique para Expandir e Ver Localização do Código-fonte</strong></summary>

> Última Atualização: 2026-01-23

| Função | Caminho do Arquivo | Número da Linha |
| --- | --- | --- |
| Claude handler: estratégia de backoff retry + regras de rotação | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L117-L236) | 117-236 |
| Claude handler: internamente converter não streaming em streaming (better quota) | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L665-L776) | 665-776 |
| Claude handler: peek pré-leitura (pular heartbeat/comentário, evitar fluxo vazio) | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L812-L926) | 812-926 |
| Claude handler: retry de reparo de erro de assinatura/ordem de bloco 400 | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L999-L1102) | 999-1102 |
| Gemini handler: peek pré-leitura (evitar fluxo vazio 200 OK) | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L117-L149) | 117-149 |
| Gemini handler: injeção de prompt de reparo de erro de assinatura 400 | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L300-L325) | 300-325 |
| Cache de assinatura (três camadas: tool/family/session, com TTL/comprimento mínimo) | [`src-tauri/src/proxy/signature_cache.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/signature_cache.rs#L5-L207) | 5-207 |
| Conversão de SSE Claude: capturar assinatura e escrever no cache de assinatura | [`src-tauri/src/proxy/mappers/claude/streaming.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/streaming.rs#L639-L787) | 639-787 |

**Constantes Chave**:
- `MAX_RETRY_ATTEMPTS = 3`: número máximo de retries (`src-tauri/src/proxy/handlers/claude.rs#L27`)
- `SIGNATURE_TTL = 2 * 60 * 60` segundos: TTL do cache de assinatura (`src-tauri/src/proxy/signature_cache.rs#L6`)
- `MIN_SIGNATURE_LENGTH = 50`: comprimento mínimo de assinatura (`src-tauri/src/proxy/signature_cache.rs#L7`)

**Funções Chave**:
- `determine_retry_strategy(...)`: selecionar estratégia de backoff por código de status (`src-tauri/src/proxy/handlers/claude.rs#L117-L167`)
- `should_rotate_account(...)`: decidir se rolar conta por código de status (`src-tauri/src/proxy/handlers/claude.rs#L226-L236`)
- `SignatureCache::cache_session_signature(...)`: cachear assinatura de sessão (`src-tauri/src/proxy/signature_cache.rs#L149-L188`)

</details>
