---
title: "Estratégias de Seleção de Contas: Configuração de Rotação Multi-Conta | Antigravity Auth"
sidebarTitle: "Escolha a Estratégia Certa e Não Desperdice Quota"
subtitle: "Estratégias de Seleção de Contas: Melhores Práticas para sticky, round-robin e hybrid"
description: "Aprenda sobre as três estratégias de seleção de contas: sticky, round-robin e hybrid. Escolha a melhor configuração com base na quantidade de contas, otimize a utilização de quota e a distribuição de requisições, evitando rate limiting."
tags:
  - "Multi-Conta"
  - "Balanceamento de Carga"
  - "Configuração"
  - "Avançado"
prerequisite:
  - "advanced-multi-account-setup"
order: 1
---

# Estratégias de Seleção de Contas: Melhores Práticas para sticky, round-robin e hybrid

## O Que Você Vai Aprender

Com base na quantidade de contas do Google e no cenário de uso, escolha e configure a estratégia de seleção de contas adequada:
- 1 conta → Use a estratégia `sticky` para manter o cache de prompt
- 2-3 contas → Use a estratégia `hybrid` para distribuir requisições de forma inteligente
- 4+ contas → Use a estratégia `round-robin` para maximizar o throughput

Evite o embaraço de "todas as contas estão sendo rate limited, mas a quota real não foi usada".

## O Seu Dilema Atual

Configurou várias contas do Google, mas:
- Não tem certeza de qual estratégia usar para maximizar a utilização da quota
- Frequentemente encontra todas as contas sendo rate limited, mas a quota de uma conta específica ainda não foi usada
- Em cenários de agentes paralelos, vários subprocessos sempre usam a mesma conta, levando a rate limiting

## O Conceito Central

### O Que É Estratégia de Seleção de Contas

O plugin Antigravity Auth suporta três estratégias de seleção de contas que determinam como distribuir requisições de modelo entre várias contas do Google:

| Estratégia | Comportamento | Cenário de Uso |
|---|---|---|
| `sticky` | A menos que a conta atual seja rate limited, continue usando a mesma conta | Conta única, necessita de cache de prompt |
| `round-robin` | A cada requisição, alterna para a próxima conta disponível | Múltiplas contas, maximiza throughput |
| `hybrid` (padrão) | Combina health score + Token bucket + LRU para seleção inteligente | 2-3 contas, equilíbrio entre performance e estabilidade |

::: info Por Que Precisa de Estratégia?
O Google tem limites de taxa para cada conta. Se houver apenas uma conta, requisições frequentes serão facilmente rate limited. Múltiplas contas podem distribuir requisições através de rotação ou seleção inteligente, evitando o consumo excessivo de quota de uma única conta.
:::

### Como Funcionam as Três Estratégias

#### 1. Estratégia Sticky (Adesiva)

**Lógica Central**: Mantém a conta atual até que ela seja rate limited para trocar.

**Vantagens**:
- Mantém o cache de prompt, respostas com o mesmo contexto são mais rápidas
- O padrão de uso da conta é estável, menos propenso a ativar verificações de segurança

**Desvantagens**:
- A utilização da quota de múltiplas contas é desequilibrada
- Não pode usar outras contas antes da recuperação do rate limiting

**Cenários de Uso**:
- Apenas uma conta
- Valorização do cache de prompt (como conversas de longo prazo)

#### 2. Estratégia Round-Robin (Rotação)

**Lógica Central**: A cada requisição, alterna para a próxima conta disponível, usando em ciclo.

**Vantagens**:
- A utilização de quota é mais equilibrada
- Maximiza o throughput de concorrência
- Adequado para cenários de alta concorrência

**Desvantagens**:
- Não considera a saúde da conta, pode escolher contas que acabaram de se recuperar do rate limiting
- Não pode aproveitar o cache de prompt

**Cenários de Uso**:
- 4 ou mais contas
- Tarefas em lote que requerem throughput máximo
- Cenários de agentes paralelos (com `pid_offset_enabled`)

#### 3. Estratégia Hybrid (Híbrida, Padrão)

**Lógica Central**: Seleciona a conta ideal considerando três fatores:

**Fórmula de Pontuação**:
```
Pontuação Total = Health Score × 2 + Token Score × 5 + Freshness Score × 0.1
```

- **Health Score** (0-200): Baseado no histórico de sucesso/falha da conta
  - Requisição bem-sucedida: +1 ponto
  - Rate limit: -10 pontos
  - Outras falhas (autenticação, rede): -20 pontos
  - Valor inicial: 70 pontos, mínimo 0, máximo 100 pontos
  - Recupera 2 pontos por hora (mesmo sem uso)

- **Token Score** (0-500): Baseado no algoritmo Token Bucket
  - Cada conta tem máximo de 50 tokens, inicial 50 tokens
  - Recupera 6 tokens por minuto
  - Cada requisição consome 1 token
  - Token Score = (token atual / 50) × 100 × 5

- **Freshness Score** (0-360): Baseado no tempo desde o último uso
  - Quanto mais tempo desde o último uso, maior a pontuação
  - Atinge o valor máximo após 3600 segundos (1 hora)

**Vantagens**:
- Evita inteligentemente contas com baixa saúde
- Token bucket evita rate limiting causado por requisições densas
- LRU (prioriza menos usado recentemente) dá às contas tempo suficiente para descansar
- Considera performance e estabilidade de forma abrangente

**Desvantagens**:
- Algoritmo relativamente complexo, menos intuitivo que round-robin
- Efeito não óbvio com apenas 2 contas

**Cenários de Uso**:
- 2-3 contas (estrategia padrão)
- Necessidade de equilibrar utilização de quota e estabilidade

### Tabela de Consulta Rápida para Seleção de Estratégia

De acordo com as recomendações do README e CONFIGURATION.md:

| Sua Configuração | Estratégia Recomendada | Motivo |
|---|---|---|
| **1 conta** | `sticky` | Não há necessidade de rotação, mantém cache de prompt |
| **2-3 contas** | `hybrid` (padrão) | Rotação inteligente, evita rate limiting excessivo |
| **4+ contas** | `round-robin` | Maximiza throughput, utilização de quota mais equilibrada |
| **Agentes paralelos** | `round-robin` + `pid_offset_enabled: true` | Processos diferentes usam contas diferentes |

## 🎒 Preparação Antes de Começar

::: warning Verificação Prévia
Certifique-se de ter concluído:
- [x] Configuração de múltiplas contas (pelo menos 2 contas Google)
- [x] Entendimento do [Sistema de Quotas Duplas](/pt/NoeFabris/opencode-antigravity-auth/platforms/dual-quota-system/)
:::

## Siga Comigo

### Passo 1: Verificar Configuração Atual

**Por que**
Conheça primeiro o estado da configuração atual para evitar modificações repetidas.

**Ação**

Verifique seu arquivo de configuração do plugin:

```bash
cat ~/.config/opencode/antigravity.json
```

**Você deve ver**:
```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
```

Se o arquivo não existir, o plugin usa a configuração padrão (`account_selection_strategy` = `"hybrid"`).

### Passo 2: Configurar Estratégia Baseada na Quantidade de Contas

**Por que**
Diferentes quantidades de contas são adequadas para diferentes estratégias; escolher a estratégia errada pode levar a desperdício de quota ou rate limiting frequente.

::: code-group

```bash [1 conta - Estratégia Sticky]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky"
}
EOF
```

```bash [2-3 contas - Estratégia Hybrid (padrão)]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid"
}
EOF
```

```bash [4+ contas - Estratégia Round-Robin]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin"
}
EOF
```

:::

**Você deve ver**: O arquivo de configuração foi atualizado para a estratégia correspondente.

### Passo 3: Habilitar Deslocamento de PID (Cenário de Agentes Paralelos)

**Por que**
Se você usa plugins como oh-my-opencode para gerar agentes paralelos, múltiplos subprocessos podem iniciar requisições simultaneamente. Por padrão, eles começam a seleção de contas a partir da mesma conta inicial, levando a competição por contas e rate limiting.

**Ação**

Modifique a configuração, adicionando o deslocamento de PID:

```bash
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": true
}
EOF
```

**Você deve ver**: `pid_offset_enabled` definido como `true`.

**Como funciona**:
- Cada processo calcula o deslocamento baseado em seu PID (ID do processo)
- Deslocamento = `PID % número_de_contas`
- Processos diferentes priorizarão contas iniciais diferentes
- Exemplo: Com 3 contas, processos com PID 100, 101, 102 usarão respectivamente as contas 1, 2, 0

### Passo 4: Verificar se a Estratégia Está Funcionando

**Por que**
Confirme que a configuração está correta e a estratégia está funcionando conforme esperado.

**Ação**

Inicie múltiplas requisições concorrentes e observe a troca de contas:

```bash
# Habilitar logs de debug
export OPENCODE_ANTIGRAVITY_DEBUG=1

# Iniciar 5 requisições
for i in {1..5}; do
  opencode run "Test $i" --model=google/antigravity-gemini-3-pro &
done
wait
```

**Você deve ver**:
- Logs mostrando diferentes contas sendo usadas para requisições diferentes
- Registro de eventos `account-switch` para troca de contas

Exemplo de log (estratégia round-robin):
```
[DEBUG] Selected account: user1@gmail.com (index: 0) - reason: rotation
[DEBUG] Selected account: user2@gmail.com (index: 1) - reason: rotation
[DEBUG] Selected account: user3@gmail.com (index: 2) - reason: rotation
[DEBUG] Selected account: user1@gmail.com (index: 0) - reason: rotation
[DEBUG] Selected account: user2@gmail.com (index: 1) - reason: rotation
```

### Passo 5: Monitorar o Estado de Saúde das Contas (Estratégia Hybrid)

**Por que**
A estratégia Hybrid seleciona contas baseada em health scores; entender o estado de saúde ajuda a determinar se a configuração é razoável.

**Ação**

Verifique os health scores nos logs de debug:

```bash
export OPENCODE_ANTIGRAVITY_DEBUG=2 opencode run "Hello" --model=google/antigravity-gemini-3-pro
```

**Você deve ver**:
```
[VERBOSE] Health scores: {
  "0": { "score": 85, "consecutiveFailures": 0 },
  "1": { "score": 60, "consecutiveFailures": 2 },
  "2": { "score": 70, "consecutiveFailures": 0 }
}
[DEBUG] Selected account: user1@gmail.com (index: 0) - hybrid score: 270.2
```

**Interpretação**:
- Conta 0: Health score 85 (excelente)
- Conta 1: Health score 60 (utilizável, mas com 2 falhas consecutivas)
- Conta 2: Health score 70 (bom)
- Selecionou conta 0 finalmente, pontuação combinada 270.2

## Checkpoint ✅

::: tip Como verificar se a configuração está funcionando?
1. Verifique o arquivo de configuração para confirmar o valor de `account_selection_strategy`
2. Inicie múltiplas requisições e observe o comportamento de troca de contas nos logs
3. Estratégia Hybrid: Contas com health score baixo devem ser selecionadas com menor frequência
4. Estratégia Round-robin: Contas devem ser usadas em ciclo, sem preferência óbvia
:::

## Dicas de Problemas

### ❌ Quantidade de Contas Não Corresponde à Estratégia

**Comportamento Errado**:
- Apenas 2 contas mas usa round-robin, levando a troca frequente
- Tem 5 contas mas usa sticky, utilização de quota desequilibrada

**Ação Correta**: Escolha a estratégia de acordo com a tabela de consulta rápida.

### ❌ Agentes Paralelos Não Habilitam Deslocamento de PID

**Comportamento Errado**:
- Múltiplos agentes paralelos usam a mesma conta ao mesmo tempo
- Levando a rápido rate limiting da conta

**Ação Correta**: Defina `pid_offset_enabled: true`.

### ❌ Ignorar Health Score (Estratégia Hybrid)

**Comportamento Errado**:
- Certa conta frequentemente sofre rate limiting, mas ainda é usada com alta frequência
- Não aproveita o health score para evitar contas problemáticas

**Ação Correta**: Verifique regularmente os health scores nos logs de debug; se houver anormalidades (como falhas consecutivas > 5 em uma conta), considere remover essa conta ou trocar de estratégia.

### ❌ Misturar Sistema de Quotas Duplas e Estratégia de Quota Única

**Comportamento Errado**:
- Modelos Gemini usam o sufixo `:antigravity` para forçar o uso do pool de quota Antigravity
- Ao mesmo tempo, configura `quota_fallback: false`
- Levando a, após esgotar uma quota de pool, não poder fazer fallback para o outro pool

**Ação Correta**: Entenda o [Sistema de Quotas Duplas](/pt/NoeFabris/opencode-antigravity-auth/platforms/dual-quota-system/) e configure `quota_fallback` de acordo com as necessidades.

## Resumo da Aula

| Estratégia | Característica Principal | Cenário de Uso |
|---|---|---|
| `sticky` | Mantém conta até ser rate limited | 1 conta, necessita cache de prompt |
| `round-robin` | Alterna contas em ciclo | 4+ contas, maximiza throughput |
| `hybrid` | Seleção inteligente com health + Token + LRU | 2-3 contas, equilibra performance e estabilidade |

**Configurações Principais**:
- `account_selection_strategy`: Define a estratégia (`sticky` / `round-robin` / `hybrid`)
- `pid_offset_enabled`: Habilita para cenários de agentes paralelos (`true`)
- `quota_fallback`: Fallback de pool de quotas duplas Gemini (`true` / `false`)

**Métodos de Verificação**:
- Habilitar logs de debug: `OPENCODE_ANTIGRAVITY_DEBUG=1`
- Verificar logs de troca de contas e health scores
- Observar o índice de contas usado por diferentes requisições

## Prévia da Próxima Aula

> Na próxima aula, vamos aprender sobre **[Tratamento de Rate Limiting](/pt/NoeFabris/opencode-antigravity-auth/advanced/rate-limit-handling/)**.
>
> Você vai aprender:
> - Como entender diferentes tipos de erros 429 (quota esgotada, rate limiting, capacidade esgotada)
> - Como funcionam os algoritmos de retry automático e backoff
> - Quando trocar de conta, quando esperar o reset

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Número da Linha |
|---|---|---|
| Entrada da estratégia de seleção de contas | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L340-L412) | 340-412 |
| Implementação da estratégia Sticky | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L395-L411) | 395-411 |
| Implementação da estratégia Hybrid | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L358-L383) | 358-383 |
| Sistema de health score | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L14-L163) | 14-163 |
| Sistema de token bucket | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L290-L402) | 290-402 |
| Algoritmo de seleção LRU | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L215-L288) | 215-288 |
| Lógica de deslocamento de PID | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L387-L393) | 387-393 |
| Schema de configuração | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | Ver arquivo |

**Constantes Principais**:
- `DEFAULT_HEALTH_SCORE_CONFIG.initial = 70`: Health score inicial para novas contas
- `DEFAULT_HEALTH_SCORE_CONFIG.minUsable = 50`: Health score mínimo utilizável
- `DEFAULT_TOKEN_BUCKET_CONFIG.maxTokens = 50`: Número máximo de tokens por conta
- `DEFAULT_TOKEN_BUCKET_CONFIG.regenerationRatePerMinute = 6`: Número de tokens recuperados por minuto

**Funções Principais**:
- `getCurrentOrNextForFamily()`: Seleciona conta baseada na estratégia
- `selectHybridAccount()`: Algoritmo de pontuação de seleção da estratégia Hybrid
- `getScore()`: Obtém health score da conta (inclui recuperação temporal)
- `hasTokens()` / `consume()`: Verificação e consumo do token bucket
- `sortByLruWithHealth()`: Ordenação LRU + health score

</details>
