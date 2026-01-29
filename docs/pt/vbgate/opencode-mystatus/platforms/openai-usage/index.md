---
title: "Cota OpenAI: Limites de 3h e 24h | opencode-mystatus"
sidebarTitle: "Cota OpenAI"
subtitle: "Consulta de cota OpenAI: limites de 3 horas e 24 horas"
description: "Aprenda a consultar cotas de 3h e 24h do OpenAI. Interprete janelas principal e secundária, barras de progresso e tempos de redefinição para Plus, Team e Pro."
tags:
  - "OpenAI"
  - "consulta de cota"
  - "cota de API"
prerequisite:
  - "start-quick-start"
  - "start-understanding-output"
order: 1
---

# Consulta de cota OpenAI: limites de 3 horas e 24 horas

## O que você poderá fazer após concluir

- Usar `/mystatus` para consultar a cota de assinatura OpenAI Plus/Team/Pro
- Entender as informações de limite de 3 horas e 24 horas na saída
- Entender a diferença entre janela principal e janela secundária
- Entender como lidar com a expiração de token

## O seu problema atual

As chamadas de API do OpenAI têm limites, após exceder serão temporariamente restritas o acesso. Mas você não sabe:
- Quanta cota ainda resta?
- Qual janela de 3 horas e 24 horas está sendo usada?
- Quando será redefinida?
- Por que às vezes vê dados de duas janelas?

Se essas informações não forem dominadas a tempo, podem afetar seu progresso em usar ChatGPT para escrever código ou fazer projetos.

## Quando usar este método

Quando você:
- Precisa usar frequentemente a API OpenAI para desenvolvimento
- Nota que as respostas ficaram lentas ou está sendo limitado
- Quer entender a situação de uso de contas de equipe
- Quer saber quando a cota será atualizada

## Ideia principal

O OpenAI tem dois tipos de janelas de limitação de taxa para chamadas de API:

| Tipo de janela | Duração | Função |
| -------------- | ------- | ------ |
| **Janela principal** (primary) | Retornado pelo servidor OpenAI | Evitar um grande número de chamadas em curto período |
| **Janela secundária** (secondary) | Retornado pelo servidor OpenAI (pode não existir) | Evitar uso excessivo a longo prazo |

O mystatus consultará paralelamente essas duas janelas, exibindo各自的:
- Porcentagem usada
- Barra de progresso de cota restante
- Tempo até a redefinição

::: info
A duração da janela é retornada pelo servidor OpenAI, diferentes tipos de assinatura (Plus, Team, Pro) podem ser diferentes.
:::

## Siga-me

### Passo 1: Executar comando de consulta

No OpenCode, digite `/mystatus`, o sistema consultará automaticamente a cota de todas as plataformas configuradas.

**O que você deve ver**:
Contém informações de cota de OpenAI, Zhipu AI, Z.ai, Copilot, Google Cloud e outras plataformas (dependendo de quais plataformas você configurou).

### Passo 2: Encontrar a seção OpenAI

Na saída, encontre a seção `## OpenAI Account Quota`.

**O que você deve ver**:
Conteúdo semelhante ao seguinte:

```
## OpenAI Account Quota

Account:        user@example.com (plus)

3-hour limit
███████████████░░░░░░░░░ 60% remaining
Resets in: 2h 30m
```

### Passo 3: Interpretar informações da janela principal

**Janela principal** (primary_window) geralmente exibe:
- **Nome da janela**: Como `3-hour limit` ou `24-hour limit`
- **Barra de progresso**: Exibe visualmente a proporção de cota restante
- **Porcentagem restante**: Como `60% remaining`
- **Tempo de redefinição**: Como `Resets in: 2h 30m`

**O que você deve ver**:
- O nome da janela exibe a duração (3 horas / 24 horas)
- Quanto mais cheia a barra de progresso, mais restante, mais vazia significa quase esgotada
- O tempo de redefinição é contagem regressiva, quando chega a zero a cota será atualizada

::: warning
Se você ver a mensagem `Limit reached!`, isso indica que a cota da janela atual foi usada, precisa esperar a redefinição.
:::

### Passo 4: Ver janela secundária (se houver)

Se o OpenAI retornar dados da janela secundária, você verá:

```
24-hour limit
████████████████████████████ 90% remaining
Resets in: 20h 45m
```

**O que você deve ver**:
- Janela secundária exibe outra dimensão de tempo da cota (geralmente 24 horas)
- Pode ter porcentagem restante diferente da janela principal

::: tip
A janela secundária é um pool de cota independente, a janela principal usada não afeta a janela secundária e vice-versa.
:::

### Passo 5: Ver tipo de assinatura

Na linha `Account` você pode ver o tipo de assinatura:

```
Account:        user@example.com (plus)
                                   ^^^^^
                                   Tipo de assinatura
```

**Tipos de assinatura comuns**:
- `plus`: Assinatura pessoal Plus
- `team`: Assinatura de equipe/organização
- `pro`: Assinatura Pro

**O que você deve ver**:
- O tipo de sua conta é exibido entre parênteses após o e-mail
- Diferentes tipos podem ter diferentes limites

## Ponto de verificação ✅

Verifique se você entendeu:

| Cenário | O que você deve ver |
| ------- | ------------------ |
| Janela principal 60% restante | Barra de progresso aproximadamente 60% cheia, exibe `60% remaining` |
| Redefinir após 2.5 horas | Exibe `Resets in: 2h 30m` |
| Limite atingido | Exibe `Limit reached!` |
| Tem janela secundária | Janela principal e secundária cada uma tem uma linha de dados |

## Avisos sobre armadilhas

### ❌ Operação errada: Não atualizar token após expiração

**Fenômeno de erro**: Ver a mensagem `⚠️ OAuth 授权已过期` (chinês) ou `⚠️ OAuth token expired` (inglês)

**Causa**: O OAuth Token expirou (duração específica controlada pelo servidor), após expirar não é possível consultar a cota.

**Operação correta**:
1. Faça login novamente no OpenAI no OpenCode
2. O token será atualizado automaticamente
3. Execute `/mystatus` novamente para consultar

### ❌ Operação errada: Confundir janela principal e secundária

**Fenômeno de erro**: Pensar que há apenas uma janela de cota, resultando que a janela principal esgotada mas a secundária ainda em uso

**Causa**: As duas janelas são pools de cota independentes.

**Operação correta**:
- Preste atenção ao tempo de redefinição de cada janela
- Janela principal redefinição rápida, secundária redefinição lenta
- Aloque uso razoavelmente, evitando que uma janela fique excessiva por muito tempo

### ❌ Operação errada: Ignorar ID da conta de equipe

**Fenômeno de erro**: Assinatura Team exibe a situação de uso de outra pessoa

**Causa**: Assinatura Team precisa passar o ID da conta de equipe, caso contrário pode estar consultando a conta padrão.

**Operação correta**:
- Certifique-se de fazer login na conta de equipe correta no OpenCode
- O token incluirá automaticamente `chatgpt_account_id`

## Resumo desta seção

O mystatus consulta a cota chamando a API oficial OpenAI:
- Suporta autenticação OAuth (Plus/Team/Pro)
- Exibe janela principal e janela secundária (se existirem)
- Barra de progresso visualiza a cota restante
- Contagem regressiva exibe tempo de redefinição
- Detecta automaticamente expiração de token

## Próxima seção

> A próxima seção aprenderemos **[Consulta de cota Zhipu AI e Z.ai](../zhipu-usage/)**.
>
> Você aprenderá:
> - O que é limite de token de 5 horas
> - Como visualizar cota mensal de MCP
> - Aviso quando a taxa de uso exceder 80%

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-23

| Funcionalidade | Caminho do arquivo | Número da linha |
| ------------- | ----------------- | --------------- |
| Entrada de consulta de cota OpenAI | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L207-L236) | 207-236 |
| Chamada de API OpenAI | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L132-L155) | 132-155 |
| Formatação de saída | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L164-L194) | 164-194 |
| Análise de token JWT | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L64-L73) | 64-73 |
| Extração de e-mail do usuário | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L78-L81) | 78-81 |
| Verificação de expiração de token | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L216-L221) | 216-221 |
| Definição de tipo OpenAIAuthData | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L28-L33) | 28-33 |

**Constantes**:
- `OPENAI_USAGE_URL = "https://chatgpt.com/backend-api/wham/usage"`: API oficial de consulta de cota OpenAI

**Funções principais**:
- `queryOpenAIUsage(authData)`: Função principal para consultar cota OpenAI
- `fetchOpenAIUsage(accessToken)`: Chama a API OpenAI
- `formatOpenAIUsage(data, email)`: Formata a saída
- `parseJwt(token)`: Analisa o token JWT (implementação não padrão da biblioteca)
- `getEmailFromJwt(token)`: Extrai o e-mail do usuário do token
- `getAccountIdFromJwt(token)`: Extrai o ID da conta de equipe do token

</details>
