---
title: "Agendamento de Contas: Estratégia de Alta Disponibilidade | Antigravity-Manager"
sidebarTitle: "Faça Solicitações Mais Estáveis"
subtitle: "Agendamento de Alta Disponibilidade"
description: "Aprenda agendamento de contas e estratégias de alta disponibilidade do Antigravity Manager. Domine sessões pegajosas, conta fixa, mecanismo de retry de falha, melhore a disponibilidade do sistema."
tags:
  - "avançado"
  - "agendamento"
  - "sessão pegajosa"
  - "rotação de contas"
  - "retry de falha"
prerequisite:
  - "start-add-account"
  - "start-proxy-and-first-client"
  - "advanced-config"
order: 3
---

# Agendamento de Alta Disponibilidade: Rotação, Conta Fixa, Sessão Pegajosa e Retry de Falha

Após usar Antigravity Tools como gateway AI local por um tempo, você geralmente encontrará o mesmo problema: quanto menos contas, mais fácil 429/401/invalid_grant, quanto mais contas, menos claro "qual conta está trabalhando", taxa de acerto de cache também cai.

Esta aula explica claramente o agendamento: como ele finalmente seleciona contas, o que é "sessão pegajosa", quando forçará rotação, e como usar "modo de conta fixa" para tornar o agendamento controlável.

## O Que Você Poderá Fazer Após Este Curso

- Entender o que os 3 modos de agendamento do Antigravity Tools fazem em solicitações reais
- Saber como `session_id` de impressão digital de sessão é gerado, e como ele afeta o agendamento pegajoso
- Na UI ativar/desativar "modo de conta fixa", e entender que lógicas de agendamento ele sobrescreverá
- Ao encontrar 429/5xx/invalid_grant, saber como o sistema marcará limitação, como fará retry, quando rolará

## Seu Problema Atual

- Claude Code ou OpenAI SDK correndo de repente 429, ao retry muda conta, taxa de acerto de cache cai
- Múltiplos clientes concorrentes correndo tarefas, frequentemente "pisam" o estado da conta do outro
- Você quer solucionar problemas, mas não sabe qual conta está servindo a solicitação atual
- Você só quer usar certa "conta mais estável", mas sistema sempre roda

## Quando Usar Esta Técnica

- Você precisa fazer troca entre "estabilidade (menos erros)" e "acerto de cache (mesma conta)"
- Você quer que a mesma conversa reutilize a mesma conta tanto quanto possível (reduzir flutuação de Prompt Caching)
- Você está fazendo canário/solução de problemas, quer fixar todas as solicitações para uma conta

## 🎒 Preparação Antes de Começar

1) Prepare pelo menos 2 contas disponíveis (quanto menor o pool de contas, menor espaço de rotação)
2) Serviço de proxy reverso já iniciado (na página "API Proxy" você pode ver estado Running)
3) Você sabe onde está o arquivo de configuração (se você precisa mudar configuração manualmente)

::: tip Primeiro Complete Esta Aula de Sistema de Configuração
Se você ainda não está familiarizado com `gui_config.json` e quais configurações podem atualizar a quente, primeiro veja **[Configuração Completa: AppConfig/ProxyConfig, Local de Persistência e Semântica de Atualização a Quente](/zh/lbjlaq/Antigravity-Manager/advanced/config/)**.
:::

## Ideia Central: Uma Solicitação Passa por Quais Camadas de "Agendamento"

Agendamento não é um "interruptor separado", mas várias camadas de mecanismo empilhadas:

1) **SessionManager primeiro dá à solicitação uma impressão digital de sessão (session_id)**
2) **Handlers cada retry exigirão que TokenManager force rotação** (`attempt > 0`)
3) **TokenManager então seleciona conta baseado em: conta fixa → sessão pegajosa → janela de 60s → polling**
4) **Ao encontrar 429/5xx registrará informações de limitação**, seleção subsequente de conta ativamente pulará conta limitada

### O Que é "Impressão Digital de Sessão (session_id)"?

**Impressão digital de sessão** é apenas uma "Session Key tão estável quanto possível", usada para amarrar múltiplas solicitações da mesma conversa na mesma conta.

Na solicitação Claude, prioridade é:

 1) `metadata.user_id` (cliente explicitamente passa, e não vazio e não contém prefixo `"session-"`)
 2) Primeira mensagem user "suficientemente longa" faz hash SHA256, então trunca em `sid-xxxxxxxxxxxxxxxx`

Implementação correspondente: `src-tauri/src/proxy/session_manager.rs` (Claude/OpenAI/Gemini têm suas lógicas de extração).

::: info Pequeno Detalhe: Por Que Olhar Apenas Primeira Mensagem User?
No código-fonte está escrito claramente "apenas hash conteúdo da primeira mensagem de usuário, não misturar nome do modelo ou timestamp", o objetivo é fazer múltiplas solicitações da mesma conversa gerarem o mesmo session_id tanto quanto possível, assim aumentando taxa de acerto de cache.
:::

### Prioridade de Seleção de Conta de TokenManager

O ponto de entrada principal do TokenManager é:

- `TokenManager::get_token(quota_group, force_rotate, session_id, target_model)`

 O que ele faz pode ser entendido por prioridade:

 1) **Modo de Conta Fixa (Fixed Account)**: se na GUI você ativou "modo de conta fixa" (configuração de runtime), e essa conta não foi limitada, nem está protegida por cota, use-a diretamente.
2) **Sessão Pegajosa (Session Binding)**: se há `session_id` e modo de agendamento não é `PerformanceFirst`, prioriza reutilizar conta ligada a essa sessão.
3) **Reutilização de Janela Global 60s**: se não passou `session_id` (ou ainda não ligou com sucesso), em não `PerformanceFirst` tentará reutilizar "conta usada anteriormente" dentro de 60 segundos.
4) **Polling (Round-robin)**: quando acima não se aplicam, seleciona conta por polling de um índice auto-incremental global.

 Além disso há duas "regras invisíveis", muito afetando a experiência:

  - **Contas primeiro ordenam**: ULTRA > PRO > FREE, dentro do mesmo tier prioriza contas com cota restante maior.
 - **Falha ou limitação será pulada**: contas já tentadas e falhadas entrarão no conjunto `attempted`; contas marcadas limitadas serão puladas.

### Quais São as Diferenças dos 3 Modos de Agendamento

 Na configuração você verá: `CacheFirst` / `Balance` / `PerformanceFirst`.

 Tomando "branch real do backend TokenManager" como padrão, a diferença chave é apenas uma: **se habilitar sessão pegajosa + reutilização de janela 60s**.

  - `PerformanceFirst`: pula sessão pegajosa e reutilização de janela 60s, vai diretamente para polling (e continua pulando contas limitadas/protegidas por cota).
 - `CacheFirst` / `Balance`: ambos habilitarão sessão pegajosa e reutilização de janela 60s.

 ::: warning Sobre max_wait_seconds
 No frontend/estrutura de configuração há `max_wait_seconds`, e a UI só permite ajustar em `CacheFirst`. Mas atualmente lógica de agendamento backend apenas branch baseado em `mode`, não lê `max_wait_seconds`.
 :::

### Retry de Falha e "Forçar Rotação" Como Ligam

 Nos handlers de OpenAI/Gemini/Claude, todos usarão padrão semelhante abaixo para processar retry:

 - Primeira tentativa: `force_rotate = false`
 - Segunda e depois: `force_rotate = true` (`attempt > 0`), TokenManager pulará reutilização pegajosa, busca diretamente próxima conta disponível

 Ao encontrar erros 429/529/503/500 etc:

  - handler chamará `token_manager.mark_rate_limited(...)` para registrar esta conta como "limitada/sobrecarga", agendamento subsequente ativamente a pulará.
 - Caminho compatível OpenAI também tentará de erro JSON analisar `RetryInfo.retryDelay` ou `quotaResetDelay`, esperar um pequeno tempo antes de continuar retry.

## Siga-me: Ajuste Agendamento para "Controlável"

### Passo 1: Primeiro Confirme que Você Realmente Tem "Pool de Contas"

**Por Que**
Agendamento por mais avançado, se no pool só tem 1 conta não há opção. Muitas "rotação não entra em vigor/pegajoso não sentido" causa raiz são contas poucas.

**Operação**
Abra a página "Accounts", confirme que pelo menos 2 contas estão em estado disponível (não disabled / proxy disabled).

**Você Deve Ver**: Pelo menos 2 contas podem atualizar cota normalmente, e após iniciar o proxy reverso `active_accounts` não é 0.

### Passo 2: Na UI Escolha Modo de Agendamento

**Por Que**
Modo de agendamento decide "mesma conversa" tenta reutilizar a mesma conta, ou sempre faz polling.

**Operação**
Entre na página "API Proxy", encontre o cartão "Account Scheduling & Rotation", escolha um dos modos:

- `Balance`: valor padrão recomendado. Na maioria dos casos mais estável (sessão pegajosa + rotação ao falhar).
- `PerformanceFirst`: alta concorrência, tarefa curta, você se importa mais com throughput do que cache, escolha este.
- `CacheFirst`: se você quer "conversa o máximo possível fixar conta", pode escolher este (atualmente diferença de comportamento de backend com `Balance` é pequena).

 Se você quer mudar configuração manualmente, o segmento correspondente é:

```json
{
  "proxy": {
    "scheduling": {
      "mode": "Balance",
      "max_wait_seconds": 60
    }
  }
}
```

  **Você Deve Ver**: Após mudar modo imediatamente escreve em `gui_config.json`, serviço de proxy reverso runtime entra em vigor diretamente (sem necessidade de reiniciar).

### Passo 3: Ative "Modo de Conta Fixa" (Desligue Rotação)

**Por Que**
Solução de problemas, canário, ou você quer "pregar" certa conta para certo cliente usar, modo de conta fixa é o meio mais direto.

**Operação**
No mesmo cartão abra "Fixed Account Mode", então na caixa suspensa escolha conta.

 Não esqueça: este interruptor só está disponível quando serviço de proxy reverso Running.

  **Você Deve Ver**: Solicitações subsequentes prioritariamente usarão esta conta; se ela for limitada ou protegida por cota, recuará para polling.

  ::: info Conta Fixa é Configuração de Runtime
  Modo de conta fixa é **estado de runtime** (via GUI ou API definido dinamicamente), não persiste em `gui_config.json`. Após reiniciar serviço de proxy reverso, conta fixa retornará vazio (volta ao modo de polling).
  :::

### Passo 4: Quando Necessário Limpe "Ligação de Sessão"

**Por Que**
Sessão pegajosa gravará `session_id -> account_id` na memória. Se você na mesma máquina faz diferentes experimentos (por exemplo trocar pool de contas, trocar modo), ligações antigas podem interferir sua observação.

**Operação**
 No cartão "Account Scheduling & Rotation" canto superior direito clique "Clear bindings".

  **Você Deve Ver**: Sessões antigas realocarão conta (próxima solicitação realocará).

### Passo 5: Use Header de Resposta para Confirmar "Qual Conta Estava Servindo"

**Por Que**
Você quer verificar se agendamento atende expectativa, o meio mais confiável é pegar "identificador de conta atual" retornado pelo servidor.

**Operação**
 Faça uma solicitação não streaming para endpoint compatível OpenAI, então observe `X-Account-Email` nos headers de resposta.

```bash
  # Exemplo: solicitação OpenAI Chat Completions mínima
  # Nota: model deve ser nome de modelo disponível/roteável em sua configuração atual
curl -i "http://127.0.0.1:8045/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-REPLACE_ME" \
  -d '{
    "model": "gemini-3-pro-high",
    "stream": false,
    "messages": [{"role": "user", "content": "hello"}]
  }'
```

  **Você Deve Ver**: Nos headers de resposta aparece conteúdo semelhante (exemplo):

  ```text
  X-Account-Email: example@gmail.com
  X-Mapped-Model: gemini-3-pro-high
  ```

## Pontos de Verificação ✅

  - Você pode explicar claramente "conta fixa", "sessão pegajosa", "round-robin" três mecanismos quem sobrescreve quem
  - Você sabe de onde `session_id` vem (prioridade `metadata.user_id`, senão hash primeira mensagem user)
  - Ao encontrar 429/5xx você pode prever: sistema primeiro registrará limitação, depois mudará conta para retry
  - Você pode usar `X-Account-Email` para verificar qual conta está servindo a solicitação atual

## Lembrete de Armadilhas

 1) **Quando Pool de Contas Só Tem 1, Não Espere "Rotação Vai Te Salvar"**
Rotação é apenas "trocar para outra conta", quando no pool não há segunda conta, 429/invalid_grant apenas se exporá mais frequentemente.

 2) **`CacheFirst` Não É "Esperar Para Sempre Disponível"**
Lógica de agendamento backend atual ao encontrar limitação tende a desligar e mudar conta, não bloquear e esperar longamente.

 3) **Conta Fixa Não É Absolutamente Forçada**
Se conta fixa for marcada como limitada, ou acertar proteção de cota, sistema recuará para polling.

## Resumo da Lição

  - Caminho de agendamento: handler extrai `session_id` → `TokenManager::get_token` seleciona conta → ao erro `attempt > 0` força rotação
  - Dois interruptores que você mais usa: modo de agendamento (se habilitar pegajoso/reutilização 60s) + modo de conta fixa (especificar conta diretamente)
  - 429/5xx serão registrados como "estado de limitação", agendamento subsequente pulará esta conta, até tempo de bloqueio expirar

## Próximo Passo

> Na próxima lição veremos **Roteamento de Modelo**: quando você quer expor "conjunto de modelo estável" para fora, e quer fazer curinga/estratégia preset, como configurar e solucionar problemas.

---

## Apêndice: Referência do Código-fonte

<details>
<summary><strong>Clique para Expandir e Ver Localização do Código-fonte</strong></summary>

> Última Atualização: 2026-01-23

| Função | Caminho do Arquivo | Número da Linha |
| --- | --- | --- |
| Modo de Agendamento e Estrutura de Configuração (StickySessionConfig) | [`src-tauri/src/proxy/sticky_config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/sticky_config.rs#L1-L36) | 1-36 |
| Geração de Impressão Digital de Sessão (Claude/OpenAI/Gemini) | [`src-tauri/src/proxy/session_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/session_manager.rs#L1-L159) | 1-159 |
| TokenManager: campo de modo de conta fixa e inicialização | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L27-L50) | 27-50 |
| TokenManager: lógica principal de seleção de conta (conta fixa/sessão pegajosa/janela 60s/polling/proteção de cota) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L470-L940) | 470-940 |
| TokenManager: desativação automática invalid_grant e remover do pool | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L868-L878) | 868-878 |
| TokenManager: registro de limitação e API de limpeza de sucesso | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L1087-L1147) | 1087-1147 |
| TokenManager: atualizar configuração de agendamento / limpar ligações de sessão / setter de modo de conta fixa | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L1419-L1461) | 1419-1461 |
| ProxyConfig: definição de campo scheduling e valor padrão | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L257) | 174-257 |
| Ao iniciar proxy reverso sincronizar configuração scheduling | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L70-L100) | 70-100 |
| Comandos Tauri relacionados a agendamento (get/update/clear bindings/fixed account) | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L478-L551) | 478-551 |
| Handler OpenAI: session_id + força rotação ao retry | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L160-L182) | 160-182 |
| Handler OpenAI: 429/5xx registrar limitação + analisar retry delay | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L349-L367) | 349-367 |
| Handler Gemini: session_id + força rotação ao retry | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L62-L88) | 62-88 |
| Handler Gemini: 429/5xx registrar limitação e rolar | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L279-L299) | 279-299 |
| Handler Claude: extrair session_id e passar para TokenManager | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L517-L524) | 517-524 |
| Análise de delay de retry 429 (RetryInfo.retryDelay / quotaResetDelay) | [`src-tauri/src/proxy/upstream/retry.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/upstream/retry.rs#L37-L66) | 37-66 |
| Identificação de causa de limitação e backoff exponencial (RateLimitTracker) | [`src-tauri/src/proxy/rate_limit.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/rate_limit.rs#L154-L279) | 154-279 |

**Estruturas Chave**:
- `StickySessionConfig`: estrutura de configuração de modo de agendamento (`mode`, `max_wait_seconds`)
- `TokenManager`: pool de contas, ligações de sessão, modo de conta fixa, rastreador de limitação
- `SessionManager`: extrai `session_id` da solicitação

</details>
