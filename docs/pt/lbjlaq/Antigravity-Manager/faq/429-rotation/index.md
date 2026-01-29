---
title: "Solução 429: Rotação de Conta e Tratamento de Erro | Antigravity-Manager"
sidebarTitle: "Erro 429: Rotação Automática de Conta"
subtitle: "Solução 429: Rotação de Conta e Tratamento de Erro"
description: "Aprenda método de solução de erro 429 do Antigravity Tools. Domine identificação e tratamento de erros QUOTA_EXHAUSTED, RATE_LIMIT_EXCEEDED, etc, use Monitor e X-Account-Email para localizar rapidamente problemas."
tags:
  - "FAQ"
  - "Solução de Erro"
  - "Agendamento de Conta"
  - "Erro 429"
prerequisite:
  - "start-getting-started"
  - "advanced-scheduling"
order: 3
---

# 429/Erro de Capacidade: Previsão Correta de Rotação de Conta e Equívoco de Exaustão de Capacidade de Modelo

## O que você poderá fazer após completar

- Distinguir corretamente 「Cota insuficiente」 e 「Limitação de taxa upstream」, evitar julgamento errado
- Entender mecanismo automático de rotação e comportamento esperado do Antigravity Tools
- Ao encontrar erro 429, saber como localizar rapidamente problema e otimizar configuração

## Seu dilema atual

- Ao ver erro 429, erroneamente pensar que "modelo não tem capacidade"
- Configurou múltiplas contas, mas ainda encontra frequentemente 429, não sabe se é problema de configuração ou de conta
- Não sabe quando sistema automaticamente troca de conta, quando "trava"

## Ideia principal

### O que é erro 429?

**429 Too Many Requests** é código de status HTTP. No Antigravity Tools, 429 não só representa "solicitações muito frequentes", mas também pode ser cota esgotada, modelo temporariamente sobrecarregado, etc., um tipo de sinal "você temporariamente não consegue usar".

::: info Proxy tentará identificar causa de 429

Proxy tentará analisar `error.details[0].reason` ou `error.message` do corpo de resposta, classificar 429 em algumas categorias (efetivamente baseado no retorno):

| Tipo identificado pelo proxy | Razão comum / Busca | Característica típica |
| :--- | :--- | :--- |
| **Cota esgotada** | `QUOTA_EXHAUSTED` / texto contém `exhausted`, `quota` | Pode precisar esperar cota atualizar |
| **Limitação de taxa** | `RATE_LIMIT_EXCEEDED` / texto contém `per minute`, `rate limit`, `too many requests` | Geralmente resfriamento de nível de dezenas de segundos |
| **Capacidade de modelo insuficiente** | `MODEL_CAPACITY_EXHAUSTED` / texto contém `model_capacity` | Geralmente sobrecarga breve, pode recuperar depois |
| **Desconhecido** | Não consegue analisar | Usa estratégia de resfriamento padrão |

:::

### Tratamento automático do Antigravity Tools

Quando uma solicitação encontra 429 (e alguns estados de sobrecarga 5xx), proxy geralmente fará duas coisas no lado do servidor:

1. **Registrar tempo de resfriamento**: escrever este erro em `RateLimitTracker`, ao selecionar conta subsequentemente evitará ativamente "ainda em resfriamento" contas.
2. **Rotacionar contas em retries**: Handlers realizarão múltiplas tentativas dentro de uma única solicitação, ao retry `force_rotate=true`, disparando TokenManager para selecionar próxima conta disponível.

::: tip Como você sabe se ele trocou de conta?
Mesmo se seu corpo de solicitação não mudar, resposta geralmente virá com `X-Account-Email` (e `X-Mapped-Model`), você pode usá-lo para verificar "esta solicitação exatamente usou qual conta".
:::

## Quando encontrará erro 429?

### Cenário 1: Solicitações individuais muito rápidas

**Fenômeno**: mesmo com apenas uma conta, enviar muitas solicitações em pouco tempo também disparará 429.

**Causa**: cada conta tem sua própria limitação de taxa (RPM/TPM), excederá limitação.

**Solução**:
- Aumentar número de contas
- Reduzir frequência de solicitação
- Usar modo de conta fixa dispersar pressão (veja 「Modo de Conta Fixa」)

### Cenário 2: Todas contas simultaneamente limitadas

**Fenômeno**: tem múltiplas contas, mas todas as contas retornam 429.

**Causa**:
- Número total de contas insuficiente para suportar sua frequência de solicitações
- Todas contas quase simultaneamente dispararam limitação/sobrecarga

**Solução**:
- Adicionar mais contas
- Ajustar modo de agendamento para 「Prioridade de Desempenho」 (pular sessão aderente e reuso de 60s de janela)
- Verificar se proteção de cota erroneamente excluiu contas disponíveis

### Cenário 3: Conta erroneamente julgada por proteção de cota

**Fenômeno**: cota de certa conta é muito suficiente, mas sistema sempre a pula.

**Causa**:
- Habilitou **Proteção de Cota**, limite definido muito alto
- Cota de modelo específico desta conta é abaixo do limite
- Conta foi marcada manualmente como `proxy_disabled`

**Solução**:
- Verificar configuração de proteção de cota (Settings → Quota Protection), ajustar limite e modelos monitorados conforme sua intensidade de uso
- Nos dados de conta verificar `protected_models`, confirmar se foi pulada por estratégia de proteção

## Siga-me

### Passo 1: Identificar tipo de erro 429

**Por que**: Diferentes tipos de erro 429 precisam de diferentes maneiras de tratamento.

No Proxy Monitor veja corpo de resposta de erro 429, foque em duas categorias de informação:

- **Causa**: `error.details[0].reason` (ex: `RATE_LIMIT_EXCEEDED`, `QUOTA_EXHAUSTED`) ou `error.message`
- **Tempo de espera**: `RetryInfo.retryDelay` ou `details[0].metadata.quotaResetDelay` (se existir)

```json
{
  "error": {
    "details": [
      {
        "reason": "RATE_LIMIT_EXCEEDED",
        "metadata": {
          "quotaResetDelay": "42s"
        }
      }
    ]
  }
}
```

**Você deve ver**:
- Se no corpo de resposta consegue encontrar tempo de espera (ex: `RetryInfo.retryDelay` ou `quotaResetDelay`), proxy geralmente primeiro espera um curto período depois retry.
- Se não tem tempo de espera, proxy dará a esta conta um "período de resfriamento" segundo estratégia interna, e no retry diretamente trocar próxima conta.

### Passo 2: Verificar configuração de agendamento de conta

**Por que**: Configuração de agendamento afeta diretamente frequência e prioridade de rotação de conta.

Entre na página **API Proxy**, verifique estratégia de agendamento:

| Item de configuração | Descrição | Padrão/Sugestão |
| :--- | :--- | :--- |
| **Scheduling Mode** | Modo de agendamento | `Balance` (padrão) |
| **Preferred Account** | Modo de conta fixa | Não selecionado (padrão) |

**Comparação de modos de agendamento**:

| Modo | Estratégia de reuso de conta | Tratamento de limitação | Cenário aplicável |
| :--- | :--- | :--- | :--- |
| **CacheFirst** | Habilitar sessão aderente e reuso de 60s de janela | **Priorizar espera**, melhora muito taxa de acerto de Prompt Caching | Conversacional/necessita alta taxa de acerto de cache |
| **Balance** | Habilitar sessão aderente e reuso de 60s de janela | **Trocar imediatamente** para conta alternativa, equilibra sucesso e desempenho | Cenário geral, padrão |
| **PerformanceFirst** | Pular sessão aderente e reuso de 60s de janela, modo puro de polling | Trocar imediatamente, carga de conta mais equilibrada | Alta concorrência, solicitações sem estado |

::: tip Cache priorizado vs modo balance
Se você usa Prompt Caching e quer melhorar taxa de acerto de cache, escolha `CacheFirst` — ao limitar, ele priorizará esperar em vez de trocar imediatamente. Se você se importa mais com taxa de sucesso de solicitação do que cache, escolha `Balance` — ao limitar, ele trocará imediatamente.
:::

::: tip Modo prioridade de desempenho
Se suas solicitações são sem estado (ex: geração de imagem, consulta independente), pode tentar `PerformanceFirst`. Ele pulará sessão aderente e reuso de 60s de janela, facilitando solicitações consecutivas caírem em contas diferentes.
:::

### Passo 3: Verificar se rotação de conta funciona normalmente

**Por que**: Confirmar sistema consegue alternar automaticamente contas.

**Método 1: Ver cabeçalho de resposta**

Use curl ou seu próprio cliente para imprimir cabeçalhos de resposta, observe se `X-Account-Email` muda.

**Método 2: Ver logs**

Abra arquivo de log (conforme localização do seu sistema), pesquise `🔄 [Token Rotation]`:

```
🔄 [Token Rotation] Accounts: [
  "account1@example.com(protected=[])",
  "account2@example.com(protected=[])",
  "account3@example.com(protected=[])"
]
```

**Método 3: Usar Proxy Monitor**

Na página **Monitor** veja logs de solicitação, foque em:
- Campo **Account** muda entre diferentes contas
- Após solicitação com **Status** 429, se há solicitação bem-sucedida usando conta diferente

**Você deve ver**:
- Após certa conta retornar 429, solicitações subsequentes automaticamente trocam para outras contas
- Se vê múltiplas solicitações usando mesma conta e todas falhando, pode ser problema de configuração de agendamento

### Passo 4: Otimizar prioridade de conta

**Por que**: Fazer sistema priorizar usar conta de cota alta/nível alto, reduzir probabilidade de 429.

No TokenManager, sistema fará uma ordenação no pool de contas antes de selecionar conta (imprimirá `🔄 [Token Rotation] Accounts: ...`):

1. **Prioridade de nível de assinatura**: UTRA > PRO > FREE
2. **Prioridade de porcentagem de cota**: dentro do mesmo nível, cota alta na frente
3. **Entrada de ordenação**: esta ordenação acontece no lado do proxy, qual conta finalmente usar baseia na ordenação do lado do proxy + julgamento de disponibilidade.

::: info Princípio de ordenação inteligente (lado do proxy)
Prioridade é `ULTRA > PRO > FREE`; dentro do mesmo nível de assinatura por `remaining_quota` (porcentagem de cota restante máxima da conta) decrescente.
:::

**Operação**:
- Arraste conta para ajustar ordem de exibição (opcional)
- Atualizar cota (Accounts → Atualizar todas as cotas)
- Ver nível de assinatura e cota da conta

## Aviso sobre armadilhas

### ❌ Erro 1: Erroneamente tratar 429 como "modelo sem capacidade"

**Fenômeno**: Ao ver erro 429, acha que modelo sem capacidade.

**Compreensão correta**:
- 429 é **limitação**, não problema de capacidade
- Aumentar contas pode reduzir probabilidade de 429
- Ajustar modo de agendamento pode melhorar velocidade de troca

### ❌ Erro 2: Limite de proteção de cota definido muito alto

**Fenômeno**: Cota suficiente mas sistema sempre pula conta.

**Causa**: Quota Protection adiciona modelos abaixo do limite ao `protected_models` da conta, proxy no agendamento pulará "modelos protegidos". Limite muito alto pode causar contas disponíveis serem excessivamente excluídas.

**Correção**:
- Volte para **Settings → Quota Protection**, ajuste modelos monitorados e limite
- Se você quer entender quais modelos exatamente são protegidos, vá nos dados de conta ver `protected_models`

### ❌ Erro 3: Modo de conta fixa leva a impossibilidade de rotação

**Fenômeno**: Configurou `Preferred Account`, mas sistema "trava" quando essa conta limita.

**Causa**: No modo de conta fixa, sistema prioriza usar conta especificada, só degrada para polling quando conta não disponível.

**Correção**:
- Se não precisa de conta fixa, esvazie `Preferred Account`
- Ou garanta cota suficiente de conta fixa, evitar limitação

## Ponto de verificação ✅

- [ ] Consegue distinguir cota insuficiente e limitação de taxa upstream
- [ ] Sabe como ver detalhes de erro 429 no Proxy Monitor
- [ ] Entende diferença entre três modos de agendamento e cenários de uso
- [ ] Sabe como verificar se rotação de conta funciona normalmente
- [ ] Consegue otimizar prioridade de conta e verificar estratégia de proteção de cota

## Perguntas comuns

### Q1: Por que tenho múltiplas contas, ainda encontro 429?

A: Causas possíveis:
1. Todas contas simultaneamente dispararam limitação (frequência de solicitações muito alta)
2. Solicitações consecutivas em "reuso de 60s de janela" repetidamente reusam mesma conta, mais fácil jogar conta única para limitação
3. Proteção de cota erroneamente excluiu contas disponíveis
4. Número total de contas insuficiente para suportar sua frequência de solicitações

**Solução**:
- Adicionar mais contas
- Usar modo `PerformanceFirst`
- Verificar se Quota Protection adicionou modelos que você usa ao `protected_models` (se necessário ajustar modelos monitorados e limite)
- Reduzir frequência de solicitações

### Q2: Erro 429 será automaticamente retry?

A: Retryará automaticamente dentro de uma única solicitação. **Limite superior de número de retry geralmente é 3 vezes**, método de cálculo específico é `min(3, tamanho do pool de contas)`, e pelo menos tentar 1 vez.

**Exemplo de número de retries**:
- Pool de contas 1 conta → tentar 1 vez (sem retry)
- Pool de contas 2 contas → tentar 2 vezes (retry 1 vez)
- Pool de contas 3 ou mais contas → tentar 3 vezes (retry 2 vezes)

**Fluxo aproximado**:
1. Registrar informação de limitação/sobrecarga (entrar em `RateLimitTracker`)
2. Se consegue analisar tempo de espera (ex: `RetryInfo.retryDelay` / `quotaResetDelay`), primeiro espera um curto período depois continua
3. Ao retry força rotação de conta (`attempt > 0` `force_rotate=true`), tentar usar próxima conta disponível iniciar solicitação upstream

Se todas as tentativas falharem, proxy retornará erro ao cliente; ao mesmo tempo você ainda pode nos cabeçalhos de resposta (como `X-Account-Email`) ou Proxy Monitor ver contas realmente usadas.

### Q3: Como ver por quanto tempo certa conta foi limitada?

A: Há duas maneiras:

**Método 1**: Ver logs, pesquisar `rate-limited`

```
🔧 [FIX #820] Preferred account xxx@gmail.com is rate-limited, falling back to round-robin
```

**Método 2**: Logs mostrarão tempo de espera restante

```
All accounts are currently limited. Please wait 30s.
```

### Q4: Proteção de cota e limitação são a mesma coisa?

A: Não são.

| Característica | Proteção de cota | Rastreamento de limitação |
| :--- | :--- | :--- |
| **Condição de disparo** | Cota de modelo abaixo do limite | Recebeu erro 429 |
| **Escopo de ação** | Modelo específico | Conta inteira |
| **Duração** | Até cota recuperar | Decidido por upstream (geralmente poucos segundos a minutos) |
| **Comportamento** | Pular este modelo | Pular esta conta |

### Q5: Como forçar troca imediata de conta?

A: Pode começar do ângulo "facilitar próxima solicitação trocar de conta":

1. **Nível de agendamento**: mude para `PerformanceFirst`, pular sessão aderente e reuso de 60s de janela
2. **Conta fixa**: se habilitou `Preferred Account`, primeiro esvazie, caso contrário priorizará usar conta fixa (até ela limitar/ser protegida)
3. **Pool de contas**: aumentar número de contas, quando conta única for limitada mais fácil encontrar conta alternativa

Dentro de uma única solicitação, proxy também forçará rotação ao retry (`attempt > 0` disparará `force_rotate=true`), mas número de retries é limitado por limite superior.

## Resumo da lição

- 429 no Antigravity Tools é um tipo de sinal "upstream temporariamente não disponível", pode ser limitação de taxa, cota esgotada, capacidade de modelo insuficiente etc.
- Proxy registrará tempo de resfriamento, e tentará rotacionar contas nos retries de uma única solicitação (mas número de retries é limitado)
- Modo de agendamento, Quota Protection, número de contas todos afetam probabilidade e velocidade de recuperação de encontrar 429
- Use Proxy Monitor, cabeçalho de resposta `X-Account-Email` e logs podem localizar rapidamente problemas

## Próximo aviso de lição

> Na próxima lição aprendemos **[404/Rota Incompatível: Base URL, Prefixo /v1 e Cliente "Caminho Sobreposto"](../404-base-url/)**.
>
> Você aprenderá:
> - Como erro de integração mais comum (404) é produzido
> - Diferença de concatenação de base_url de diferentes clientes
> - Como corrigir rapidamente problemas de 404

---

## Apêndice: Referência de código-fonte

<details>
<summary><strong>Clique para expandir localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do arquivo | Linha |
| :--- | :--- | :--- |
| Análise de delay de retry 429 (RetryInfo / quotaResetDelay) | [`src-tauri/src/proxy/upstream/retry.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/upstream/retry.rs#L38-L67) | 38-67 |
| Ferramenta de análise de Duration | [`src-tauri/src/proxy/upstream/retry.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/upstream/retry.rs#L11-L35) | 11-35 |
| Enumeração de modo de agendamento (CacheFirst/Balance/PerformanceFirst) | [`src-tauri/src/proxy/sticky_config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/sticky_config.rs#L3-L12) | 3-12 |
| Análise de razão de limitação e estratégia de resfriamento padrão | [`src-tauri/src/proxy/rate_limit.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/rate_limit.rs#L5-L258) | 5-258 |
| Definição de constante MAX_RETRY_ATTEMPTS (handler OpenAI) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L14) | 14 |
| Cálculo de número de retries (max_attempts = min(MAX_RETRY_ATTEMPTS, pool_size)) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L830) | 830 |
| Handler OpenAI: marca limitação e retry/rotação ao 429/5xx | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L349-L389) | 349-389 |
| Prioridade de ordenação de conta (ULTRA > PRO > FREE + remaining_quota) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L504-L538) | 504-538 |
| Reuso de janela de 60s + evitar limitação/proteção de cota | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L624-L739) | 624-739 |
| Entrada de registro de limitação (mark_rate_limited) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L1089-L1113) | 1089-1113 |
| Bloqueio preciso de 429/atualização de cota em tempo real/estratégia de downgrade (mark_rate_limited_async) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L1258-L1417) | 1258-1417 |

**Constantes principais**:
- `MAX_RETRY_ATTEMPTS = 3`: número máximo de retries dentro de uma única solicitação (handler OpenAI/Gemini)
- `60`: reuso de janela de 60 segundos (só habilitado em modos fora `PerformanceFirst`)
- `5`: tempo limite de obtenção de token (segundos)
- `300`: limite de pré-atualização de token (segundos, 5 minutos)

**Funções principais**:
- `parse_retry_delay()`: extrair delay de retry de resposta de erro 429
- `get_token_internal()`: lógica principal de seleção e rotação de conta
- `mark_rate_limited()`: marcar conta como estado limitado

</details>
