---
title: "Opções de Configuração Completas: Detalhamento de 30+ Parâmetros | Antigravity Auth"
sidebarTitle: "Personalizar 30+ Parâmetros"
subtitle: "Manual de Referência Completo das Opções de Configuração do Antigravity Auth"
description: "Aprenda as 30+ opções de configuração do plugin Antigravity Auth. Abrange configurações gerais, recuperação de sessão, estratégias de seleção de conta, limitação de taxa, atualização de tokens e valores padrão e melhores práticas."
tags:
  - "Referência de Configuração"
  - "Configuração Avançada"
  - "Manual Completo"
  - "Antigravity"
  - "OpenCode"
prerequisite:
  - "quick-install"
order: 1
---

# Manual de Referência Completo das Opções de Configuração do Antigravity Auth

## O Que Você Vai Aprender

- Encontrar e modificar todas as opções de configuração do plugin Antigravity Auth
- Entender a função e cenários de aplicação de cada item de configuração
- Escolher a melhor combinação de configurações com base no cenário de uso
- Sobrescrever configurações de arquivo através de variáveis de ambiente

## Ideia Central

O plugin Antigravity Auth controla quase todos os comportamentos através do arquivo de configuração: desde o nível de log até a estratégia de seleção de conta, desde a recuperação de sessão até o mecanismo de atualização de tokens.

::: info Localização do Arquivo de Configuração (prioridade de alta para baixa)
1. **Configuração do Projeto**: `.opencode/antigravity.json`
2. **Configuração do Usuário**:
   - Linux/Mac: `~/.config/opencode/antigravity.json`
   - Windows: `%APPDATA%\opencode\antigravity.json`
:::

::: tip Prioridade de Variáveis de Ambiente
Todos os itens de configuração podem ser sobrescritos por variáveis de ambiente, cuja prioridade é **maior** que a do arquivo de configuração.
:::

## Visão Geral da Configuração

| Categoria | Número de Itens | Cenário Principal |
| --- | --- | --- |
| Configurações Gerais | 3 | Log, modo de depuração |
| Blocos de Pensamento | 1 | Preservar processo de raciocínio |
| Recuperação de Sessão | 3 | Recuperação automática de erros |
| Cache de Assinatura | 4 | Persistência de assinatura de blocos de pensamento |
| Retry de Resposta Vazia | 2 | Lidar com respostas vazias |
| Recuperação de ID de Ferramenta | 1 | Correspondência de ferramentas |
| Prevenção de Alucinação de Ferramentas | 1 | Prevenir erros de parâmetros |
| Atualização de Token | 3 | Mecanismo de atualização proativa |
| Limitação de Taxa | 5 | Rotação e espera de contas |
| Pontuação de Saúde | 7 | Pontuação da estratégia Hybrid |
| Token Bucket | 3 | Tokens da estratégia Hybrid |
| Atualização Automática | 1 | Atualização automática do plugin |
| Busca na Web | 2 | Busca Gemini |

---

## Configurações Gerais

### `quiet_mode`

**Tipo**: `boolean`  
**Valor Padrão**: `false`  
**Variável de Ambiente**: `OPENCODE_ANTIGRAVITY_QUIET=1`

Suprime a maioria das notificações toast (limitação de taxa, troca de conta, etc.). Notificações de recuperação (recuperação de sessão bem-sucedida) são sempre exibidas.

**Cenários de Aplicação**:
- Cenários de uso frequente com múltiplas contas, evitando interrupções por notificações frequentes
- Scripts automatizados ou serviços em segundo plano

**Exemplo**:
```json
{
  "quiet_mode": true
}
```

### `debug`

**Tipo**: `boolean`  
**Valor Padrão**: `false`  
**Variável de Ambiente**: `OPENCODE_ANTIGRAVITY_DEBUG=1`

Habilita logs de depuração em arquivo. Os arquivos de log são armazenados por padrão em `~/.config/opencode/antigravity-logs/`.

**Cenários de Aplicação**:
- Habilitar ao solucionar problemas
- Fornecer logs detalhados ao enviar relatórios de bugs

::: danger Logs de depuração podem conter informações sensíveis
Os arquivos de log contêm respostas da API, índices de conta, etc. Anonimize antes de enviar.
:::

### `log_dir`

**Tipo**: `string`  
**Valor Padrão**: Diretório de configuração específico do SO + `/antigravity-logs`  
**Variável de Ambiente**: `OPENCODE_ANTIGRAVITY_LOG_DIR=/path/to/logs`

Personaliza o diretório de armazenamento dos logs de depuração.

**Cenários de Aplicação**:
- Necessidade de armazenar logs em local específico (como diretório compartilhado em rede)
- Scripts de rotação e arquivamento de logs

---

## Configurações de Blocos de Pensamento

### `keep_thinking`

**Tipo**: `boolean`  
**Valor Padrão**: `false`  
**Variável de Ambiente**: `OPENCODE_ANTIGRAVITY_KEEP_THINKING=1`

::: warning Recurso Experimental
Preserva os blocos de pensamento do modelo Claude (através de cache de assinatura).

**Descrição do Comportamento**:
- `false` (padrão): Remove blocos de pensamento, evita erros de assinatura, prioriza confiabilidade
- `true`: Preserva contexto completo (incluindo blocos de pensamento), mas pode encontrar erros de assinatura

**Cenários de Aplicação**:
- Necessidade de visualizar o processo completo de raciocínio do modelo
- Uso frequente de conteúdo de pensamento em conversas

**Cenários Não Recomendados**:
- Ambientes de produção (prioridade à confiabilidade)
- Conversas de múltiplas rodadas (fácil de acionar conflitos de assinatura)

::: tip Use com `signature_cache`
Ao habilitar `keep_thinking`, recomenda-se configurar simultaneamente `signature_cache` para melhorar a taxa de acerto de assinatura.
:::

---

## Recuperação de Sessão

### `session_recovery`

**Tipo**: `boolean`  
**Valor Padrão**: `true`

Recupera automaticamente a sessão de erros `tool_result_missing`. Quando habilitado, exibe notificação toast ao encontrar erros recuperáveis.

**Tipos de Erros Recuperados**:
- `tool_result_missing`: Resultado de ferramenta ausente (interrupção ESC, timeout, crash)
- `Expected thinking but found text`: Erro de ordem de blocos de pensamento

**Cenários de Aplicação**:
- Todos os cenários que usam ferramentas (recomendado habilitar por padrão)
- Conversas longas ou execução frequente de ferramentas

### `auto_resume`

**Tipo**: `boolean`  
**Valor Padrão**: `false`

Envia automaticamente o prompt "continue" para recuperar a sessão. Só tem efeito quando `session_recovery` está habilitado.

**Descrição do Comportamento**:
- `false`: Apenas exibe notificação toast, usuário precisa enviar "continue" manualmente
- `true`: Envia automaticamente "continue" para continuar a sessão

**Cenários de Aplicação**:
- Scripts automatizados ou cenários sem supervisão
- Desejo de automatizar completamente o fluxo de recuperação

**Cenários Não Recomendados**:
- Necessidade de confirmação manual dos resultados de recuperação
- Necessidade de verificar o estado antes de continuar após interrupção da execução de ferramenta

### `resume_text`

**Tipo**: `string`  
**Valor Padrão**: `"continue"`

Texto personalizado enviado durante recuperação automática. Usado apenas quando `auto_resume` está habilitado.

**Cenários de Aplicação**:
- Ambientes multilíngues (como mudar para "继续", "请继续")
- Cenários que requerem prompts adicionais

**Exemplo**:
```json
{
  "auto_resume": true,
  "resume_text": "Por favor, continue a tarefa anterior"
}
```

---

## Cache de Assinatura

> Só tem efeito quando `keep_thinking` está habilitado

### `signature_cache.enabled`

**Tipo**: `boolean`  
**Valor Padrão**: `true`

Habilita cache em disco de assinaturas de blocos de pensamento.

**Função**: O cache de assinaturas pode evitar erros causados por assinaturas repetidas em conversas de múltiplas rodadas.

### `signature_cache.memory_ttl_seconds`

**Tipo**: `number` (intervalo: 60-86400)  
**Valor Padrão**: `3600` (1 hora)

Tempo de expiração do cache em memória (segundos).

### `signature_cache.disk_ttl_seconds`

**Tipo**: `number` (intervalo: 3600-604800)  
**Valor Padrão**: `172800` (48 horas)

Tempo de expiração do cache em disco (segundos).

### `signature_cache.write_interval_seconds`

**Tipo**: `number` (intervalo: 10-600)  
**Valor Padrão**: `60`

Intervalo de gravação em disco em segundo plano (segundos).

**Exemplo**:
```json
{
  "keep_thinking": true,
  "signature_cache": {
    "enabled": true,
    "memory_ttl_seconds": 7200,
    "disk_ttl_seconds": 259200,
    "write_interval_seconds": 120
  }
}
```

---

## Retry de Resposta Vazia

Quando o Antigravity retorna resposta vazia (sem candidates/choices), tenta automaticamente novamente.

### `empty_response_max_attempts`

**Tipo**: `number` (intervalo: 1-10)  
**Valor Padrão**: `4`

Número máximo de tentativas.

### `empty_response_retry_delay_ms`

**Tipo**: `number` (intervalo: 500-10000)  
**Valor Padrão**: `2000` (2 segundos)

Atraso entre cada tentativa (milissegundos).

**Cenários de Aplicação**:
- Ambientes de rede instável (aumentar número de tentativas)
- Necessidade de falha rápida (reduzir número de tentativas e atraso)

---

## Recuperação de ID de Ferramenta

### `tool_id_recovery`

**Tipo**: `boolean`  
**Valor Padrão**: `true`

Habilita recuperação de ID de ferramenta órfão. Quando o ID da resposta da ferramenta não corresponde (devido à compressão de contexto), tenta correspondência por nome de função ou cria placeholder.

**Função**: Melhora a confiabilidade de chamadas de ferramentas em conversas de múltiplas rodadas.

**Cenários de Aplicação**:
- Cenários de conversas longas (recomendado habilitar)
- Cenários de uso frequente de ferramentas

---

## Prevenção de Alucinação de Ferramentas

### `claude_tool_hardening`

**Tipo**: `boolean`  
**Valor Padrão**: `true`

Habilita prevenção de alucinação de ferramentas para modelos Claude. Quando habilitado, injeta automaticamente:
- Assinatura de parâmetros na descrição da ferramenta
- Instruções de sistema de regras estritas de uso de ferramentas

**Função**: Previne que o Claude use nomes de parâmetros dos dados de treinamento em vez dos nomes reais no schema.

**Cenários de Aplicação**:
- Uso de plugins MCP ou ferramentas personalizadas (recomendado habilitar)
- Schema de ferramentas complexo

**Cenários Não Recomendados**:
- Confirmação de que chamadas de ferramentas estão completamente em conformidade com o schema (pode desabilitar para reduzir prompts extras)

---

## Atualização Proativa de Token

### `proactive_token_refresh`

**Tipo**: `boolean`  
**Valor Padrão**: `true`

Habilita atualização proativa de token em segundo plano. Quando habilitado, tokens são atualizados automaticamente antes de expirar, garantindo que requisições não sejam bloqueadas por atualização de token.

**Função**: Evita atraso de requisições esperando atualização de token.

### `proactive_refresh_buffer_seconds`

**Tipo**: `number` (intervalo: 60-7200)  
**Valor Padrão**: `1800` (30 minutos)

Quanto tempo antes da expiração do token acionar atualização proativa (segundos).

### `proactive_refresh_check_interval_seconds`

**Tipo**: `number` (intervalo: 30-1800)  
**Valor Padrão**: `300` (5 minutos)

Intervalo de verificação de atualização proativa (segundos).

**Cenários de Aplicação**:
- Cenários de requisições de alta frequência (recomendado habilitar atualização proativa)
- Desejo de reduzir risco de falha de atualização (aumentar tempo de buffer)

---

## Limitação de Taxa e Seleção de Conta

### `max_rate_limit_wait_seconds`

**Tipo**: `number` (intervalo: 0-3600)  
**Valor Padrão**: `300` (5 minutos)

Tempo máximo de espera quando todas as contas estão limitadas (segundos). Se o tempo mínimo de espera de todas as contas exceder este limite, o plugin falhará rapidamente em vez de ficar suspenso.

**Definir como 0**: Desabilita timeout, espera indefinidamente.

**Cenários de Aplicação**:
- Cenários que requerem falha rápida (reduzir tempo de espera)
- Cenários que aceitam espera longa (aumentar tempo de espera)

### `quota_fallback`

**Tipo**: `boolean`  
**Valor Padrão**: `false`

Habilita fallback de cota para modelos Gemini. Quando o pool de cota preferencial (Gemini CLI ou Antigravity) se esgota, tenta o pool de cota alternativo da mesma conta.

**Cenários de Aplicação**:
- Uso de alta frequência de modelos Gemini (recomendado habilitar)
- Desejo de maximizar a utilização de cota de cada conta

::: tip Só tem efeito quando sufixo de cota não é especificado explicitamente
Se o nome do modelo incluir explicitamente `:antigravity` ou `:gemini-cli`, sempre usará o pool de cota especificado, sem fallback.
:::

### `account_selection_strategy`

**Tipo**: `string` (enum: `sticky`, `round-robin`, `hybrid`)  
**Valor Padrão**: `"hybrid"`  
**Variável de Ambiente**: `OPENCODE_ANTIGRAVITY_ACCOUNT_SELECTION_STRATEGY`

Estratégia de seleção de conta.

| Estratégia | Descrição | Cenários de Aplicação |
| --- | --- | --- |
| `sticky` | Usa a mesma conta até limitação, preserva cache de prompt | Sessão única, cenários sensíveis a cache |
| `round-robin` | Alterna para próxima conta a cada requisição, maximiza throughput | Cenários de múltiplas contas e alto throughput |
| `hybrid` | Seleção determinística baseada em pontuação de saúde + token bucket + LRU | Recomendado geral, equilibra desempenho e confiabilidade |

::: info Descrição Detalhada
Veja o capítulo [Estratégias de Seleção de Conta](/pt/NoeFabris/opencode-antigravity-auth/advanced/account-selection-strategies/).
:::

### `pid_offset_enabled`

**Tipo**: `boolean`  
**Valor Padrão**: `false`  
**Variável de Ambiente**: `OPENCODE_ANTIGRAVITY_PID_OFFSET_ENABLED=1`

Habilita offset de conta baseado em PID. Quando habilitado, diferentes sessões (PIDs) priorizarão diferentes contas iniciais, ajudando a distribuir carga ao executar múltiplos agentes paralelos.

**Descrição do Comportamento**:
- `false` (padrão): Todas as sessões começam do mesmo índice de conta, preserva cache de prompt da Anthropic (recomendado para uso de sessão única)
- `true`: Offset de conta inicial baseado em PID, distribui carga (recomendado para uso de múltiplas sessões paralelas)

**Cenários de Aplicação**:
- Executar múltiplas sessões paralelas do OpenCode
- Usar subagentes ou tarefas paralelas

### `switch_on_first_rate_limit`

**Tipo**: `boolean`  
**Valor Padrão**: `true`

Troca imediatamente de conta na primeira limitação (após atraso de 1 segundo). Quando desabilitado, tenta novamente a mesma conta primeiro, só trocando na segunda limitação.

**Cenários de Aplicação**:
- Desejo de troca rápida de conta (recomendado habilitar)
- Desejo de maximizar cota de conta única (desabilitar)

---

## Pontuação de Saúde (Estratégia Hybrid)

> Só tem efeito quando `account_selection_strategy` é `hybrid`

### `health_score.initial`

**Tipo**: `number` (intervalo: 0-100)  
**Valor Padrão**: `70`

Pontuação de saúde inicial da conta.

### `health_score.success_reward`

**Tipo**: `number` (intervalo: 0-10)  
**Valor Padrão**: `1`

Pontuação de saúde adicionada a cada requisição bem-sucedida.

### `health_score.rate_limit_penalty`

**Tipo**: `number` (intervalo: -50-0)  
**Valor Padrão**: `-10`

Pontuação de saúde deduzida a cada limitação.

### `health_score.failure_penalty`

**Tipo**: `number` (intervalo: -100-0)  
**Valor Padrão**: `-20`

Pontuação de saúde deduzida a cada falha.

### `health_score.recovery_rate_per_hour`

**Tipo**: `number` (intervalo: 0-20)  
**Valor Padrão**: `2`

Pontuação de saúde recuperada por hora.

### `health_score.min_usable`

**Tipo**: `number` (intervalo: 0-100)  
**Valor Padrão**: `50`

Limite mínimo de pontuação de saúde para conta utilizável.

### `health_score.max_score`

**Tipo**: `number` (intervalo: 50-100)  
**Valor Padrão**: `100`

Limite superior de pontuação de saúde.

**Cenários de Aplicação**:
- Configuração padrão adequada para a maioria dos cenários
- Ambientes de limitação frequente podem reduzir `rate_limit_penalty` ou aumentar `recovery_rate_per_hour`
- Necessidade de troca mais rápida de conta pode reduzir `min_usable`

**Exemplo**:
```json
{
  "account_selection_strategy": "hybrid",
  "health_score": {
    "initial": 80,
    "success_reward": 2,
    "rate_limit_penalty": -5,
    "failure_penalty": -15,
    "recovery_rate_per_hour": 5,
    "min_usable": 40,
    "max_score": 100
  }
}
```

---

## Token Bucket (Estratégia Hybrid)

> Só tem efeito quando `account_selection_strategy` é `hybrid`

### `token_bucket.max_tokens`

**Tipo**: `number` (intervalo: 1-1000)  
**Valor Padrão**: `50`

Capacidade máxima do token bucket.

### `token_bucket.regeneration_rate_per_minute`

**Tipo**: `number` (intervalo: 0.1-60)  
**Valor Padrão**: `6`

Número de tokens gerados por minuto.

### `token_bucket.initial_tokens`

**Tipo**: `number` (intervalo: 1-1000)  
**Valor Padrão**: `50`

Número inicial de tokens da conta.

**Cenários de Aplicação**:
- Cenários de requisições de alta frequência podem aumentar `max_tokens` e `regeneration_rate_per_minute`
- Desejo de rotação mais rápida de contas pode reduzir `initial_tokens`

---

## Atualização Automática

### `auto_update`

**Tipo**: `boolean`  
**Valor Padrão**: `true`

Habilita atualização automática do plugin.

**Cenários de Aplicação**:
- Desejo de obter automaticamente recursos mais recentes (recomendado habilitar)
- Necessidade de versão fixa (desabilitar)

---

## Busca na Web (Gemini Grounding)

### `web_search.default_mode`

**Tipo**: `string` (enum: `auto`, `off`)  
**Valor Padrão**: `"off"`

Modo padrão de busca na web (quando não especificado via variant).

| Modo | Descrição |
| --- | --- |
| `auto` | Modelo decide quando buscar (recuperação dinâmica) |
| `off` | Busca desabilitada por padrão |

### `web_search.grounding_threshold`

**Tipo**: `number` (intervalo: 0-1)  
**Valor Padrão**: `0.3`

Limite de recuperação dinâmica (0.0 a 1.0). Quanto maior o valor, menor a frequência de busca do modelo (requer maior confiança para acionar busca). Só tem efeito no modo `auto`.

**Cenários de Aplicação**:
- Reduzir buscas desnecessárias (aumentar limite, como 0.5)
- Encorajar modelo a buscar mais (reduzir limite, como 0.2)

**Exemplo**:
```json
{
  "web_search": {
    "default_mode": "auto",
    "grounding_threshold": 0.4
  }
}
```

---

## Exemplos de Configuração

### Configuração Básica de Conta Única

```json
{
  "quiet_mode": false,
  "debug": false,
  "keep_thinking": false,
  "session_recovery": true,
  "auto_resume": false,
  "account_selection_strategy": "sticky"
}
```

### Configuração de Alto Desempenho Multi-Conta

```json
{
  "quiet_mode": true,
  "debug": false,
  "session_recovery": true,
  "auto_resume": true,
  "account_selection_strategy": "hybrid",
  "quota_fallback": true,
  "switch_on_first_rate_limit": true,
  "max_rate_limit_wait_seconds": 120,
  "health_score": {
    "initial": 70,
    "min_usable": 40
  },
  "token_bucket": {
    "max_tokens": 100,
    "regeneration_rate_per_minute": 10
  }
}
```

### Configuração de Depuração e Diagnóstico

```json
{
  "debug": true,
  "log_dir": "/tmp/antigravity-logs",
  "quiet_mode": false,
  "session_recovery": true,
  "auto_resume": true,
  "tool_id_recovery": true
}
```

### Configuração de Preservação de Blocos de Pensamento

```json
{
  "keep_thinking": true,
  "signature_cache": {
    "enabled": true,
    "memory_ttl_seconds": 7200,
    "disk_ttl_seconds": 259200,
    "write_interval_seconds": 120
  },
  "session_recovery": true
}
```

---

## Perguntas Frequentes

### P: Como desabilitar temporariamente uma configuração?

**R**: Use variáveis de ambiente para sobrescrever, sem modificar o arquivo de configuração.

```bash
# Habilitar temporariamente modo de depuração
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode

# Habilitar temporariamente modo silencioso
OPENCODE_ANTIGRAVITY_QUIET=1 opencode
```

### P: É necessário reiniciar o OpenCode após modificar o arquivo de configuração?

**R**: Sim, o arquivo de configuração é carregado na inicialização do OpenCode, modificações requerem reinicialização.

### P: Como verificar se a configuração está em vigor?

**R**: Habilite o modo `debug`, verifique as informações de carregamento de configuração no arquivo de log.

```json
{
  "debug": true
}
```

O log exibirá a configuração carregada:
```
[config] Loaded configuration: {...}
```

### P: Quais itens de configuração precisam ser ajustados com mais frequência?

**R**:
- `account_selection_strategy`: Escolher estratégia adequada em cenários multi-conta
- `quiet_mode`: Reduzir interrupções de notificações
- `session_recovery` / `auto_resume`: Controlar comportamento de recuperação de sessão
- `debug`: Habilitar ao solucionar problemas

### P: O arquivo de configuração tem validação de JSON Schema?

**R**: Sim, adicionar o campo `$schema` no arquivo de configuração habilita autocompletar e validação na IDE:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  ...
}
```

---

## Apêndice: Referência de Código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Última atualização: 2026-01-23

| Função | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Definição de Schema de Configuração | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 1-373 |
| JSON Schema | [`assets/antigravity.schema.json`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/assets/antigravity.schema.json) | 1-157 |
| Carregamento de Configuração | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts) | - |

**Constantes Principais**:
- `DEFAULT_CONFIG`: Objeto de configuração padrão (`schema.ts:328-372`)

**Tipos Principais**:
- `AntigravityConfig`: Tipo de configuração principal (`schema.ts:322`)
- `SignatureCacheConfig`: Tipo de configuração de cache de assinatura (`schema.ts:323`)
- `AccountSelectionStrategy`: Tipo de estratégia de seleção de conta (`schema.ts:22`)

</details>
