---
title: "Guia de Configuração: Opções Completas Explicadas | Antigravity Auth"
sidebarTitle: "Configuração Completa"
subtitle: "Guia Completo de Opções de Configuração"
description: "Domine todas as opções de configuração do plugin Antigravity Auth. Explique detalhadamente a localização dos arquivos de configuração, comportamento do modelo, estratégias de rotação de contas e configurações de comportamento da aplicação, fornecendo esquemas de configuração recomendados para cenários de conta única, múltiplas contas e agentes paralelos."
tags:
  - "Configuração"
  - "Configuração Avançada"
  - "Múltiplas Contas"
  - "Rotação de Contas"
prerequisite:
  - "start-quick-install"
  - "advanced-multi-account-setup"
order: 2
---

# Guia Completo de Opções de Configuração

## O que Você Poderá Fazer Após Este Tutorial

- ✅ Criar arquivos de configuração na localização correta
- ✅ Escolher esquemas de configuração apropriados com base no cenário de uso
- ✅ Compreender a função e os valores padrão de todas as opções de configuração
- ✅ Usar variáveis de ambiente para substituir temporariamente a configuração
- ✅ Ajustar comportamento do modelo, rotação de contas e comportamento do plugin

## O Desafio Atual

Há muitas opções de configuração e você não sabe por onde começar? A configuração padrão funciona, mas você quer otimizá-la ainda mais? Em cenários de múltiplas contas, não tem certeza de qual estratégia de rotação usar?

## Ideia Central

O arquivo de configuração é como escrever um "manual de instruções" para o plugin — você diz a ele como trabalhar, e ele executa do seu jeito. O plugin Antigravity Auth oferece opções de configuração ricas, mas a maioria dos usuários só precisa configurar algumas opções principais.

### Prioridade de Arquivos de Configuração

A prioridade das opções de configuração, da mais alta para a mais baixa:

1. **Variáveis de Ambiente** (substituição temporária)
2. **Configuração em Nível de Projeto** `.opencode/antigravity.json` (projeto atual)
3. **Configuração em Nível de Usuário** `~/.config/opencode/antigravity.json` (global)

::: info
Variáveis de ambiente têm a prioridade mais alta e são adequadas para testes temporários. Arquivos de configuração são adequados para configurações persistentes.
:::

### Localização dos Arquivos de Configuração

Dependendo do sistema operacional, a localização do arquivo de configuração em nível de usuário varia:

| Sistema | Caminho |
|---|---|
| Linux/macOS | `~/.config/opencode/antigravity.json` |
| Windows | `%APPDATA%\opencode\antigravity.json` |

O arquivo de configuração em nível de projeto está sempre em `.opencode/antigravity.json` no diretório raiz do projeto.

### Categorias de Opções de Configuração

As opções de configuração são divididas em quatro categorias principais:

1. **Comportamento do Modelo**: Blocos de pensamento, recuperação de sessão, Google Search
2. **Rotação de Contas**: Gerenciamento de múltiplas contas, estratégia de seleção, deslocamento de PID
3. **Comportamento da Aplicação**: Logs de depuração, atualização automática, silenciamento de notificações
4. **Configurações Avançadas**: Recuperação de erros, gerenciamento de tokens, pontuação de saúde

---

## 🎒 Preparação Antes de Começar

- [x] Instalação do plugin concluída (consulte [Instalação Rápida](../../start/quick-install/))
- [x] Pelo menos uma conta Google configurada
- [x] Compreensão básica da sintaxe JSON

---

## Siga-me

### Etapa 1: Criar Arquivo de Configuração

**Por quê**: O arquivo de configuração faz o plugin trabalhar de acordo com suas necessidades

Escolha o caminho correspondente com base no seu sistema operacional para criar o arquivo de configuração:

::: code-group

```bash [macOS/Linux]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
EOF
```

```powershell [Windows]
## Usando PowerShell
$env:APPDATA\opencode\antigravity.json = @{
  '$schema' = "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
} | ConvertTo-Json -Depth 10

Set-Content -Path "$env:APPDATA\opencode\antigravity.json" -Value $json
```

:::

**Você deve ver**: Arquivo criado com sucesso, contendo apenas o campo `$schema`.

::: tip
Após adicionar o campo `$schema`, o VS Code fornecerá automaticamente dicas inteligentes e verificação de tipos.
:::

### Etapa 2: Configurar Opções Básicas

**Por quê**: Otimize o comportamento do plugin com base no seu cenário de uso

Escolha uma das opções abaixo com base na sua configuração:

**Cenário A: Conta Única + Necessita Google Search**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Cenário B: 2-3 Contas + Rotação Inteligente**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Cenário C: Múltiplas Contas + Agentes Paralelos**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "switch_on_first_rate_limit": true,
  "pid_offset_enabled": true,
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Você deve ver**: Arquivo de configuração salvo com sucesso, OpenCode recarrega automaticamente a configuração do plugin.

### Etapa 3: Verificar Configuração

**Por quê**: Confirme se a configuração está em vigor

Inicie uma solicitação de modelo no OpenCode e observe:

1. Uso de conta única com estratégia `sticky`: Todas as solicitações usam a mesma conta
2. Múltiplas contas com estratégia `hybrid`: Solicitações são distribuídas inteligentemente entre diferentes contas
3. Modelo Gemini com `web_search` habilitado: O modelo pesquisará na web quando necessário

**Você deve ver**: O comportamento do plugin está de acordo com as suas expectativas de configuração.

---

## Detalhes das Opções de Configuração

### Comportamento do Modelo

Essas opções afetam a forma como o modelo pensa e responde.

#### keep_thinking

| Valor | Padrão | Descrição |
|---|---|---|
| `true` | - | Preserva blocos de pensamento do Claude, mantendo coerência entre turnos |
| `false` | ✓ | Remove blocos de pensamento, mais estável, contexto menor |

::: warning Atenção
Habilitar `keep_thinking` pode levar à degradação da estabilidade do modelo e erros de assinatura. Recomenda-se manter `false`.
:::

#### session_recovery

| Valor | Padrão | Descrição |
|---|---|---|
| `true` | ✓ | Recupera automaticamente sessões interrompidas por chamadas de ferramenta |
| `false` | - | Não recupera automaticamente quando encontra erros |

#### auto_resume

| Valor | Padrão | Descrição |
|---|---|---|
| `true` | - | Envia "continue" automaticamente após recuperação |
| `false` | ✓ | Apenas exibe prompt após recuperação, continuação manual |

#### resume_text

Texto personalizado enviado durante a recuperação. O padrão é `"continue"`, você pode alterá-lo para qualquer texto.

#### web_search

| Opção | Padrão | Descrição |
|---|---|---|
| `default_mode` | `"off"` | `"auto"` ou `"off"` |
| `grounding_threshold` | `0.3` | Limiar de pesquisa (0=sempre pesquisar, 1=nunca pesquisar) |

::: info
`grounding_threshold` só entra em vigor quando `default_mode: "auto"`. Quanto maior o valor, mais conservadora a pesquisa do modelo.
:::

---

### Rotação de Contas

Essas opções gerenciam a alocação de solicitações para múltiplas contas.

#### account_selection_strategy

| Estratégia | Padrão | Cenário de Aplicação |
|---|---|---|
| `sticky` | - | Conta única, preserva cache de prompt Anthropic |
| `round-robin` | - | 4+ contas, maximiza throughput |
| `hybrid` | ✓ | 2-3 contas, rotação inteligente |

::: tip
Estratégias recomendadas para diferentes números de contas:
- 1 conta → `sticky`
- 2-3 contas → `hybrid`
- 4+ contas → `round-robin`
- Agentes paralelos → `round-robin` + `pid_offset_enabled: true`
:::

#### switch_on_first_rate_limit

| Valor | Padrão | Descrição |
|---|---|---|
| `true` | ✓ | Troca imediatamente de conta ao primeiro 429 |
| `false` | - | Tenta primeiro a conta atual, troca no segundo 429 |

#### pid_offset_enabled

| Valor | Padrão | Descrição |
|---|---|---|
| `true` | - | Sessões diferentes (PID) usam contas iniciais diferentes |
| `false` | ✓ | Todas as sessões começam com a mesma conta |

::: tip
Para uso de sessão única, mantenha `false` para preservar o cache de prompt Anthropic. Para execução paralela de múltiplas sessões, recomenda-se habilitar `true`.
:::

#### quota_fallback

| Valor | Padrão | Descrição |
|---|---|---|
| `true` | - | Fallback do pool de quotas Gemini |
| `false` | ✓ | Não habilita fallback |

::: info
Aplica-se apenas a modelos Gemini. Quando o pool de quota principal é esgotado, tenta o pool de quota de backup da mesma conta.
:::

---

### Comportamento da Aplicação

Essas opções controlam o próprio comportamento do plugin.

#### quiet_mode

| Valor | Padrão | Descrição |
|---|---|---|
| `true` | - | Silencia a maioria das notificações toast (exceto notificações de recuperação) |
| `false` | ✓ | Exibe todas as notificações |

#### debug

| Valor | Padrão | Descrição |
|---|---|---|
| `true` | - | Habilita logs de depuração |
| `false` | ✓ | Não registra logs de depuração |

::: tip
Para habilitar temporariamente logs de depuração sem modificar o arquivo de configuração, use variáveis de ambiente:
```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode   # logs básicos
OPENCODE_ANTIGRAVITY_DEBUG=2 opencode   # logs detalhados
```
:::

#### log_dir

Diretório personalizado para logs de depuração. O padrão é `~/.config/opencode/antigravity-logs/`.

#### auto_update

| Valor | Padrão | Descrição |
|---|---|---|
| `true` | ✓ | Verifica e atualiza o plugin automaticamente |
| `false` | - | Não atualiza automaticamente |

---

### Configurações Avançadas

Essas opções são para cenários de borda; a maioria dos usuários não precisa modificá-las.

<details>
<summary><strong>Clique para expandir configurações avançadas</strong></summary>

#### Recuperação de Erros

| Opção | Padrão | Descrição |
|---|---|---|
| `empty_response_max_attempts` | `4` | Número de tentativas para resposta vazia |
| `empty_response_retry_delay_ms` | `2000` | Intervalo de nova tentativa (milisegundos) |
| `tool_id_recovery` | `true` | Corrige incompatibilidade de ID de ferramenta |
| `claude_tool_hardening` | `true` | Previne alucinação de parâmetros de ferramenta |
| `max_rate_limit_wait_seconds` | `300` | Tempo máximo de espera de limite de taxa (0=infinito) |

#### Gerenciamento de Tokens

| Opção | Padrão | Descrição |
|---|---|---|
| `proactive_token_refresh` | `true` | Atualiza tokens proativamente antes da expiração |
| `proactive_refresh_buffer_seconds` | `1800` | Atualiza 30 minutos antes |
| `proactive_refresh_check_interval_seconds` | `300` | Intervalo de verificação de atualização (segundos) |

#### Cache de Assinaturas (válido quando `keep_thinking: true`)

| Opção | Padrão | Descrição |
|---|---|---|
| `signature_cache.enabled` | `true` | Habilita cache em disco |
| `signature_cache.memory_ttl_seconds` | `3600` | TTL de cache em memória (1 hora) |
| `signature_cache.disk_ttl_seconds` | `172800` | TTL de cache em disco (48 horas) |
| `signature_cache.write_interval_seconds` | `60` | Intervalo de gravação em segundo plano (segundos) |

#### Pontuação de Saúde (usada pela estratégia `hybrid`)

| Opção | Padrão | Descrição |
|---|---|---|
| `health_score.initial` | `70` | Pontuação de saúde inicial |
| `health_score.success_reward` | `1` | Pontuação de recompensa por sucesso |
| `health_score.rate_limit_penalty` | `-10` | Pontuação de penalidade de limite de taxa |
| `health_score.failure_penalty` | `-20` | Pontuação de penalidade por falha |
| `health_score.recovery_rate_per_hour` | `2` | Pontuação de recuperação por hora |
| `health_score.min_usable` | `50` | Pontuação mínima para conta utilizável |
| `health_score.max_score` | `100` | Limite máximo de pontuação de saúde |

#### Token Bucket (usado pela estratégia `hybrid`)

| Opção | Padrão | Descrição |
|---|---|---|
| `token_bucket.max_tokens` | `50` | Capacidade máxima do bucket |
| `token_bucket.regeneration_rate_per_minute` | `6` | Velocidade de recuperação por minuto |
| `token_bucket.initial_tokens` | `50` | Número inicial de tokens |

</details>

---

## Esquemas de Configuração Recomendados

### Configuração de Conta Única

Adequado para: Usuários com apenas uma conta Google

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Explicação da Configuração**:
- `sticky`: Sem rotação, preserva cache de prompt Anthropic
- `web_search: auto`: Gemini pode pesquisar conforme necessário

### Configuração de 2-3 Contas

Adequado para: Pequenas equipes ou usuários que precisam de certa elasticidade

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Explicação da Configuração**:
- `hybrid`: Rotação inteligente, pontuação de saúde seleciona a melhor conta
- `web_search: auto`: Gemini pode pesquisar conforme necessário

### Configuração de Múltiplas Contas + Agentes Paralelos

Adequado para: Usuários que executam múltiplos agentes simultâneos

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "switch_on_first_rate_limit": true,
  "pid_offset_enabled": true,
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Explicação da Configuração**:
- `round-robin`: Alterna contas a cada solicitação
- `switch_on_first_rate_limit: true`: Troca imediatamente no primeiro 429
- `pid_offset_enabled: true`: Sessões diferentes usam contas iniciais diferentes
- `web_search: auto`: Gemini pode pesquisar conforme necessário

---

## Alertas de Armadilhas

### ❌ Erro: Configuração Não Entra em Vigor Após Modificação

**Causa**: OpenCode pode não ter recarregado o arquivo de configuração.

**Solução**: Reinicie o OpenCode ou verifique se a sintaxe JSON está correta.

### ❌ Erro: Formato JSON do Arquivo de Configuração Incorreto

**Causa**: Erro de sintaxe JSON (vírgula faltando, vírgula extra, comentários, etc.).

**Solução**: Use ferramentas de validação JSON para verificar ou adicione o campo `$schema` para habilitar dicas inteligentes da IDE.

### ❌ Erro: Variável de Ambiente Não Entra em Vigor

**Causa**: Nome da variável de ambiente digitado incorretamente ou OpenCode não foi reiniciado.

**Solução**: Confirme que o nome da variável é `OPENCODE_ANTIGRAVITY_*` (todos maiúsculos, prefixo correto) e reinicie o OpenCode.

### ❌ Erro: Erros Frequentes Após Habilitar `keep_thinking: true`

**Causa**: Assinatura do bloco de pensamento não corresponde.

**Solução**: Mantenha `keep_thinking: false` (padrão) ou ajuste a configuração `signature_cache`.

---

## Resumo da Aula

Prioridade da localização dos arquivos de configuração: Variáveis de ambiente > Nível de projeto > Nível de usuário.

Opções de configuração principais:
- Comportamento do modelo: `keep_thinking`, `session_recovery`, `web_search`
- Rotação de contas: `account_selection_strategy`, `pid_offset_enabled`
- Comportamento da aplicação: `debug`, `quiet_mode`, `auto_update`

Configurações recomendadas para diferentes cenários:
- Conta única: `sticky`
- 2-3 contas: `hybrid`
- 4+ contas: `round-robin`
- Agentes paralelos: `round-robin` + `pid_offset_enabled: true`

---

## Prévia da Próxima Aula

> Na próxima aula aprenderemos sobre **[Logs de Depuração](../debug-logging/)**.
>
> Você aprenderá:
> - Como habilitar logs de depuração
> - Como interpretar o conteúdo dos logs
> - Como solucionar problemas comuns

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linha |
|---|---|---|
| Definição do Schema de Configuração | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 12-323 |
| Valores Padrão da Configuração | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 325-373 |
| Lógica de Carregamento da Configuração | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts) | 1-100 |

**Constantes Chave**:
- `DEFAULT_CONFIG`: Valores padrão para todas as opções de configuração

**Tipos Chave**:
- `AntigravityConfig`: Tipo do objeto de configuração
- `AccountSelectionStrategy`: Tipo da estratégia de seleção de conta
- `SignatureCacheConfig`: Tipo da configuração de cache de assinatura

</details>
