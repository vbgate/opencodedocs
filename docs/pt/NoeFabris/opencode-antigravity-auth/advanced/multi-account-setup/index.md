---
title: "Configuração Multi-Conta: Pool de Cota e Balanceamento de Carga"
sidebarTitle: "Experimente Múltiplas Contas"
subtitle: "Configuração Multi-Conta: Pool de Cota e Balanceamento de Carga"
description: "Aprenda a configurar múltiplas contas Google para realizar pool de cota e balanceamento de carga. Domine o sistema de cotas duplas, estratégias de seleção de contas e configuração de offset PID para maximizar a utilização da API."
tags:
  - "advanced"
  - "multi-account"
  - "load-balancing"
  - "quota-management"
prerequisite:
  - "start-quick-install"
  - "start-first-auth-login"
order: 4
---

# Configuração Multi-Conta: Pool de Cota e Balanceamento de Carga

## O Que Você Aprenderá

- Adicionar múltiplas contas Google para aumentar o limite total de cota
- Entender o sistema de cotas duplas e utilizar efetivamente os pools de cota Antigravity e Gemini CLI
- Escolher a estratégia de balanceamento de carga adequada com base no número de contas e cenário de uso
- Diagnosticar problemas comuns na configuração multi-conta

## Sua Situação Atual

Ao usar uma única conta, você pode enfrentar estes pontos problemáticos:

- Encontrar frequentemente erros de limite de taxa 429, sendo forçado a aguardar a recuperação da cota
- Cenários de desenvolvimento/teste com muitas requisições concorrentes, onde uma conta não consegue suportar
- Após esgotar a cota de modelos Gemini 3 Pro ou Claude Opus, ser forçado a aguardar até o dia seguinte
- Ao executar múltiplas instâncias paralelas do OpenCode ou subagentes oh-my-opencode, competição intensa entre contas

## Quando Usar Esta Técnica

A configuração multi-conta é adequada para os seguintes cenários:

| Cenário | Contas Recomendadas | Razão |
|---------|---------------------|-------|
| Desenvolvimento Individual | 2-3 | Contas de reserva, evita interrupções |
| Colaboração em Equipe | 3-5 | Distribui requisições, reduz competição |
| Chamadas de API de Alta Frequência | 5+ | Balanceamento de carga, maximiza throughput |
| Agentes Paralelos | 3+ + Offset PID | Cada Agent com conta independente |

::: warning Verificação Prévia
Antes de iniciar este tutorial, certifique-se de que completou:
- ✅ Instalado o plugin opencode-antigravity-auth
- ✅ Autenticado com sucesso via OAuth e adicionado a primeira conta
- ✅ Pode iniciar requisições usando o modelo Antigravity

[Tutorial de Instalação Rápida](../../start/quick-install/) | [Tutorial de Primeiro Login](../../start/first-auth-login/)
:::

## Ideia Central

Mecanismo central da configuração multi-conta:

1. **Pool de Cota**: Cada conta Google tem uma cota independente, múltiplas contas se sobrepõem formando um pool maior
2. **Balanceamento de Carga**: O plugin seleciona automaticamente contas disponíveis, alternando para a próxima conta ao encontrar limitação de taxa
3. **Sistema de Cotas Duplas** (apenas Gemini): Cada conta pode acessar dois pools de cota independentes, Antigravity e Gemini CLI
4. **Recuperação Inteligente**: Deduplicação de limite de taxa (janela de 2 segundos) + backoff exponencial, evita tentativas inválidas

**Exemplo de Cálculo de Cota**:

Supondo que cada conta tem uma cota Claude de 1000 requisições/minuto:

| Contas | Cota Total Teórica | Cota Real Disponível |
|--------|-------------------|---------------------|
| 1 | 1000/min | 1000/min |
| 3 | 3000/min | ~2500/min (estratégia sticky) |
| 5 | 5000/min | ~4000/min (round-robin) |

> 💡 **Por que a estratégia sticky tem menor cota disponível?**
>
> A estratégia sticky mantém o uso da mesma conta até atingir o limite de taxa, fazendo com que outras contas fiquem ociosas. Porém, isso preserva o cache de prompt da Anthropic, melhorando a velocidade de resposta.

## Siga o Tutorial

### Passo 1: Adicionar Segunda Conta

**Por quê**
Após adicionar a segunda conta, quando a conta principal encontrar limitação de taxa, o plugin alternará automaticamente para a conta de reserva, evitando falhas de requisição.

**Operação**

Execute o comando de login OAuth:

```bash
opencode auth login
```

Se você já tiver uma conta, verá a seguinte mensagem:

```
1 account(s) saved:
  1. user1@gmail.com

(a)dd new account(s) or (f)resh start? [a/f]:
```

Digite `a` e pressione Enter, o navegador abrirá automaticamente a página de autorização do Google.

**Você Deverá Ver**:

1. O navegador abre a página de autorização OAuth do Google
2. Selecione ou faça login na sua segunda conta Google
3. Após autorizar, o terminal exibe:

```
Account added successfully!

2 account(s) saved:
  1. user1@gmail.com
  2. user2@gmail.com
```

::: tip
Se o navegador não abrir automaticamente, copie a URL OAuth exibida no terminal e cole manualmente no navegador.
:::

### Passo 2: Verificar Status Multi-Conta

**Por quê**
Confirmar que a conta foi adicionada corretamente e está disponível.

**Operação**

Visualize o arquivo de armazenamento de contas:

```bash
cat ~/.config/opencode/antigravity-accounts.json
```

**Você Deverá Ver**:

```json
{
  "version": 3,
  "accounts": [
    {
      "email": "user1@gmail.com",
      "refreshToken": "1//0abc...",
      "projectId": "project-id-123",
      "addedAt": 1737609600000,
      "lastUsed": 1737609600000
    },
    {
      "email": "user2@gmail.com",
      "refreshToken": "1//0xyz...",
      "addedAt": 1737609700000,
      "lastUsed": 1737609700000
    }
  ],
  "activeIndex": 0,
  "activeIndexByFamily": {
    "claude": 0,
    "gemini": 0
  }
}
```

::: warning Lembrete de Segurança
`antigravity-accounts.json` contém tokens de atualização OAuth, equivalente a um arquivo de senha. Não o envie para sistemas de controle de versão.
:::

### Passo 3: Testar Troca de Contas

**Por quê**
Verificar se o balanceamento de carga multi-conta está funcionando corretamente.

**Operação**

Envie múltiplas requisições simultâneas para ativar limitação de taxa:

```bash
# macOS/Linux
for i in {1..10}; do
  opencode run "Test $i" --model=google/antigravity-claude-sonnet-4-5 &
done
wait

# Windows PowerShell
1..10 | ForEach-Object {
  Start-Process -FilePath "opencode" -ArgumentList "run","Test $_","--model=google/antigravity-claude-sonnet-4-5"
}
```

**Você Deverá Ver**:

1. As primeiras N requisições usam a conta 1 (user1@gmail.com)
2. Após encontrar 429, alterna automaticamente para a conta 2 (user2@gmail.com)
3. Se notificações estiverem ativadas, verá uma mensagem toast "Switched to account 2"

::: info Notificação de Troca de Conta
Se `quiet_mode: false` (padrão) estiver ativado, o plugin exibirá notificações de troca de conta. A primeira troca mostra o endereço de email, as subsequentes mostram apenas o índice da conta.
:::

### Passo 4: Configurar Sistema de Cotas Duplas (Exclusivo para Gemini)

**Por quê**
Após ativar o fallback de cotas duplas, quando a cota Antigravity for esgotada, o plugin tentará automaticamente a cota Gemini CLI, sem necessidade de troca de conta.

**Operação**

Edite o arquivo de configuração do plugin:

```bash
# macOS/Linux
nano ~/.config/opencode/antigravity.json

# Windows
notepad %APPDATA%\opencode\antigravity.json
```

Adicione a seguinte configuração:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "quota_fallback": true
}
```

Salve o arquivo e reinicie o OpenCode.

**Você Deverá Ver**:

1. Ao usar modelos Gemini, o plugin prioriza a cota Antigravity
2. Quando Antigravity retornar 429, alterna automaticamente para a cota Gemini CLI da mesma conta
3. Se ambas as cotas duplas forem limitadas, então alterna para a próxima conta

::: tip Cotas Duplas vs Multi-Conta
- **Cotas Duplas**: Duas pools de cota independentes da mesma conta (Antigravity + Gemini CLI)
- **Multi-Conta**: Superposição de pools de cota de múltiplas contas
- Melhor prática: primeiro ative cotas duplas, depois adicione multi-conta
:::

### Passo 5: Selecionar Estratégia de Seleção de Contas

**Por quê**
Diferentes quantidades de contas e cenários de uso requerem estratégias diferentes para alcançar o melhor desempenho.

**Operação**

Configure a estratégia em `antigravity.json`:

```json
{
  "account_selection_strategy": "hybrid"
}
```

Selecione de acordo com o número de contas:

| Contas | Estratégia Recomendada | Valor de Configuração | Razão |
|--------|------------------------|----------------------|-------|
| 1 | sticky | `"sticky"` | Manter cache de prompt |
| 2-5 | hybrid | `"hybrid"` | Equilibrar throughput e cache |
| 5+ | round-robin | `"round-robin"` | Maximizar throughput |

**Detalhes das Estratégias**:

- **sticky** (padrão conta única): Mantém o uso da mesma conta até atingir o limite de taxa, adequado para sessões individuais de desenvolvimento
- **round-robin**: Alterna para a próxima conta a cada requisição, maximiza throughput mas sacrifica cache
- **hybrid** (padrão multi-conta): Decisão combinada baseada em health score + Token bucket + LRU

**Você Deverá Ver**:

1. Ao usar a estratégia `hybrid`, o plugin selecionará automaticamente a conta atualmente ótima
2. Ao usar a estratégia `round-robin`, as requisições serão distribuídas uniformemente entre todas as contas
3. Ao usar a estratégia `sticky`, a mesma conta será sempre usada na mesma sessão

### Passo 6: Ativar Offset PID (Cenário de Agentes Paralelos)

**Por quê**
Ao executar múltiplas instâncias do OpenCode ou agentes paralelos oh-my-opencode, diferentes processos podem selecionar a mesma conta, resultando em competição.

**Operação**

Adicione em `antigravity.json`:

```json
{
  "pid_offset_enabled": true
}
```

Salve e reinicie o OpenCode.

**Você Deverá Ver**:

1. Processos diferentes (PIDs diferentes) começam de índices de conta diferentes
2. Competição de contas entre agentes paralelos é reduzida
3. Throughput geral é melhorado

::: tip Como Funciona o Offset PID
O offset PID mapeia o ID do processo para o offset da conta, por exemplo:
- PID 100 → offset 0 → começa da conta 0
- PID 101 → offset 1 → começa da conta 1
- PID 102 → offset 2 → começa da conta 2
:::

## Ponto de Verificação ✅

Após completar as etapas acima, você deve ser capaz de:

- [ ] Adicionar múltiplas contas Google via `opencode auth login`
- [ ] Ver múltiplos registros de conta em `antigravity-accounts.json`
- [ ] O plugin alternar automaticamente para a próxima conta ao encontrar limitação de taxa
- [ ] Ter ativado o fallback de cotas duplas para modelos Gemini
- [ ] Ter selecionado a estratégia de seleção de contas apropriada baseada no número de contas
- [ ] Ter ativado o offset PID para cenários de agentes paralelos

## Alertas de Armadilhas

### Todas as Contas Foram Limitadas

**Sintoma**: Todas as contas exibem erro 429, não é possível continuar as requisições

**Causa**: Cota esgotada ou muitas requisições concorrentes

**Solução**:

1. Aguarde o limite de taxa ser redefinido automaticamente (geralmente 1-5 minutos)
2. Se o problema persistir, adicione mais contas
3. Verifique `max_rate_limit_wait_seconds` na configuração, defina um limite de espera razoável

### Troca de Conta Muito Frequente

**Sintoma**: Cada requisição alterna a conta, não usa a mesma conta

**Causa**: Seleção de estratégia inapropriada ou health score anormal

**Solução**:

1. Altere a estratégia para `sticky`
2. Verifique a configuração `health_score`, ajuste `min_usable` e `rate_limit_penalty`
3. Confirme que não há erros 429 frequentes causando a conta ser marcada como não saudável

### Erro de Permissão do Gemini CLI (403)

**Sintoma**: Ao usar o modelo Gemini CLI, retorna erro `Permission denied`

**Causa**: A conta não possui um Project ID válido

**Solução**:

1. Adicione `projectId` manualmente para cada conta:

```json
{
  "accounts": [
    {
      "email": "your@email.com",
      "refreshToken": "...",
      "projectId": "your-project-id"
    }
  ]
}
```

2. Certifique-se de que a API Gemini for Google Cloud está habilitada no [Google Cloud Console](https://console.cloud.google.com/)

### Token Inválido (invalid_grant)

**Sintoma**: A conta é removida automaticamente, mostrando erro `invalid_grant`

**Causa**: Alteração de senha da conta Google, evento de segurança ou token expirado

**Solução**:

1. Delete a conta inválida e reautentique:

```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

2. Se ocorrer frequentemente, considere usar uma conta Google mais estável

## Resumo da Lição

- A configuração multi-conta pode aumentar o limite superior total de cota e a estabilidade do sistema
- Adicionar contas é muito simples, basta executar `opencode auth login` repetidamente
- O sistema de cotas duplas dobra a cota disponível para cada conta Gemini
- A estratégia de seleção de contas deve ser ajustada com base no número de contas e cenário de uso
- O offset PID é crucial para cenários de agentes paralelos

## Prévia da Próxima Lição

> Na próxima lição aprenderemos **[Estratégias de Seleção de Contas](../account-selection-strategies/)**.
>
> Você aprenderá:
> - Os princípios de funcionamento detalhados das três estratégias: sticky, round-robin e hybrid
> - Como escolher a estratégia ótima com base no cenário
> - Métodos de ajuste de health score e Token bucket

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-23

| Função | Caminho do Arquivo | Linhas |
|--------|-------------------|--------|
| Classe AccountManager | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L174-L250) | 174-250 |
| Estratégias de Balanceamento de Carga | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts) | Todo |
| Schema de Configuração | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | Todo |
| Armazenamento de Contas | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts) | Todo |

**Constantes Chave**:

| Nome da Constante | Valor | Descrição |
|------------------|-------|-----------|
| `QUOTA_EXHAUSTED_BACKOFFS` | `[60000, 300000, 1800000, 7200000]` | Tempos de backoff quando cota é esgotada (1min→5min→30min→2h) |
| `RATE_LIMIT_EXCEEDED_BACKOFF` | `30000` | Tempo de backoff quando limite de taxa é excedido (30s) |
| `MIN_BACKOFF_MS` | `2000` | Tempo mínimo de backoff (2s) |

**Funções Chave**:

- `calculateBackoffMs(reason, consecutiveFailures, retryAfterMs)`: Calcula o atraso de backoff
- `getQuotaKey(family, headerStyle, model)`: Gera chave de cota (suporta limitação de taxa em nível de modelo)
- `isRateLimitedForQuotaKey(account, key)`: Verifica se uma chave de cota específica está limitada
- `selectHybridAccount(accounts, family)`: Lógica de seleção de conta da estratégia hybrid

**Itens de Configuração** (de schema.ts):

| Item de Configuração | Tipo | Padrão | Descrição |
|---------------------|------|--------|-----------|
| `account_selection_strategy` | enum | `"hybrid"` | Estratégia de seleção de conta |
| `quota_fallback` | boolean | `false` | Ativar fallback de cotas duplas Gemini |
| `pid_offset_enabled` | boolean | `false` | Ativar offset PID |
| `switch_on_first_rate_limit` | boolean | `true` | Alternar imediatamente na primeira limitação |

</details>
