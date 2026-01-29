---
title: "Cota Zhipu AI: Limite de Token e MCP | opencode-mystatus"
sidebarTitle: "Cota Zhipu AI"
subtitle: "Consulta de cota Zhipu AI e Z.ai: limite de token de 5 horas e cota mensal de MCP"
description: "Aprenda a consultar limite de token de 5 horas e cota mensal MCP do Zhipu AI e Z.ai com opencode-mystatus. Interprete barras de progresso e tempo de redefinição."
tags:
  - "Zhipu AI"
  - "Z.ai"
  - "consulta de cota"
  - "limite de token"
  - "cota de MCP"
prerequisite:
  - "start-quick-start"
order: 2
---

# Consulta de cota Zhipu AI e Z.ai: limite de token de 5 horas e cota mensal de MCP

## O que você poderá fazer após concluir

- Visualizar o uso do limite de token de 5 horas do **Zhipu AI** e **Z.ai**
- Entender o significado e regras de redefinição da **cota mensal de MCP**
- Entender informações como barra de progresso, quantidade usada e quantidade total na saída de cota
- Saber quando será acionado o **aviso de alta taxa de uso**

## O seu problema atual

Você usa Zhipu AI ou Z.ai para desenvolver aplicações, mas frequentemente encontra esses problemas:

- Não sabe quanto **limite de token de 5 horas** ainda resta
- Após exceder o limite, as solicitações falham, afetando o progresso do desenvolvimento
- Não está claro o significado específico da **cota mensal de MCP**
- Precisa fazer login nas duas plataformas separadamente para visualizar a cota, muito trabalhoso

## Quando usar este método

Quando você:

- Usa a API do Zhipu AI / Z.ai para desenvolver aplicações
- Precisa monitorar o uso de tokens, evitando uso excessivo
- Quer entender a cota mensal da função de pesquisa MCP
- Usa simultaneamente Zhipu AI e Z.ai, quer gerenciar a cota de forma unificada

## Ideia principal

O sistema de cota do **Zhipu AI** e **Z.ai** é dividido em dois tipos:

| Tipo de cota | Significado | Ciclo de redefinição |
|--- | --- | ---|
| **Limite de token de 5 horas** | Limite de uso de token de solicitações API | Redefinição automática de 5 horas |
| **Cota mensal de MCP** | Limite mensal de contagem de pesquisas MCP (Model Context Protocol) | Redefinição mensal |

O plugin chama a API oficial em tempo real para consultar esses dados e exibe intuitivamente a cota restante usando **barras de progresso** e **porcentagem**.

::: info O que é MCP?

**MCP** (Model Context Protocol) é o protocolo de contexto de modelo fornecido pelo Zhipu AI, permitindo que modelos de IA pesquisem e citem recursos externos. A cota mensal de MCP limita o número de pesquisas que podem ser feitas por mês.

:::

## Siga-me

### Passo 1: Configurar conta Zhipu AI / Z.ai

**Por que**
O plugin precisa da API Key para consultar sua cota. O Zhipu AI e Z.ai usam o **método de autenticação API Key**.

**Operação**

1. Abra o arquivo `~/.local/share/opencode/auth.json`

2. Adicione a configuração da API Key do Zhipu AI ou Z.ai:

```json
{
  "zhipuai-coding-plan": {
    "type": "api",
    "key": "Sua API Key Zhipu AI"
  },
  "zai-coding-plan": {
    "type": "api",
    "key": "Sua API Key Z.ai"
  }
}
```

**O que você deve ver**:
- O arquivo de configuração contém campos `zhipuai-coding-plan` ou `zai-coding-plan`
- Cada campo tem `type: "api"` e campo `key`

### Passo 2: Consultar cota

**Por que**
Chamar a API oficial para obter uso de cota em tempo real.

**Operação**

No OpenCode, execute o comando de barra:

```bash
/mystatus
```

Ou pergunte em linguagem natural:

```
查看我的智谱 AI 额度
```

**O que você deve ver**:
Saída semelhante à seguinte:

```
## Zhipu AI 账号额度

Account:        9c89****AQVM (Coding Plan)

5 小时 Token 限额
███████████████████████████ 剩余 95%
已用: 0.5M / 10.0M
重置: 4小时后

MCP 月度配额
██████████████████░░░░░░░ 剩余 60%
已用: 200 / 500

## Z.ai 账号额度

Account:        9c89****AQVM (Z.ai)

5 小时 Token 限额
███████████████████████████ 剩余 95%
已用: 0.5M / 10.0M
重置: 4小时后
```

### Passo 3: Interpretar a saída

**Por que**
Entender o significado de cada linha de saída, para gerenciar efetivamente a cota.

**Operação**

Compare sua saída com as seguintes explicações:

| Campo de saída | Significado | Exemplo |
|--- | --- | ---|
| **Account** | API Key mascarada e tipo de conta | `9c89****AQVM (Coding Plan)` |
| **5 小时 Token 限额** | Uso de token no ciclo de 5 horas atual | Barra de progresso + porcentagem |
| **已用: X / Y** | Usado / Total | `0.5M / 10.0M` |
| **重置: X小时后** | Contagem regressiva até a próxima redefinição | `4小时后` |
| **MCP 月度配额** | Uso de pesquisa MCP no mês atual | Barra de progresso + porcentagem |
| **已用: X / Y** | Usado / Total | `200 / 500` |

**O que você deve ver**:
- A parte de limite de token de 5 horas tem **contagem regressiva de tempo de redefinição**
- A parte de cota mensal de MCP **não tem tempo de redefinição** (pois é redefinição mensal)
- Se a taxa de uso exceder 80%, um aviso será exibido na parte inferior

## Ponto de verificação ✅

Confirme se você entendeu o seguinte:

- [ ] O limite de token de 5 horas tem contagem regressiva de tempo de redefinição
- [ ] A cota mensal de MCP é redefinida mensalmente, não exibe contagem regressiva
- [ ] A taxa de uso exceder 80% acionará aviso
- [ ] A API Key é exibida de forma mascarada (apenas os primeiros 4 e últimos 4 caracteres)

## Avisos sobre armadilhas

### ❌ Erro comum 1: Campo `type` ausente no arquivo de configuração

**Fenômeno de erro**: Ao consultar, exibe "未找到任何已配置的账号"

**Causa**: O `auth.json` está faltando o campo `type: "api"`

**Correção**:

```json
// ❌ Erro
{
  "zhipuai-coding-plan": {
    "key": "Sua API Key"
  }
}

// ✅ Correto
{
  "zhipuai-coding-plan": {
    "type": "api",
    "key": "Sua API Key"
  }
}
```

### ❌ Erro comum 2: API Key expirada ou inválida

**Fenômeno de erro**: Exibe "API 请求失败" ou "鉴权失败"

**Causa**: A API Key expirou ou foi revogada

**Correção**:
- Faça login no console do Zhipu AI / Z.ai
- Regere a API Key
- Atualize o campo `key` em `auth.json`

### ❌ Erro comum 3: Confundir dois tipos de cota

**Fenômeno de erro**: Pensar que o limite de token e a cota MCP são a mesma coisa

**Correção**:
- **Limite de token**: Uso de token de chamadas de API, redefinição de 5 horas
- **Cota MCP**: Contagem de pesquisas MCP, redefinição mensal
- Estes são **dois limites independentes**, não se afetam mutuamente

## Resumo desta seção

Esta seção aprendeu como usar o opencode-mystatus para consultar a cota do Zhipu AI e Z.ai:

**Conceitos principais**:
- Limite de token de 5 horas: limite de chamadas de API, tem contagem regressiva de tempo de redefinição
- Cota mensal de MCP: contagem de pesquisas MCP, redefinição mensal

**Etapas de operação**:
1. Configure `zhipuai-coding-plan` ou `zai-coding-plan` em `auth.json`
2. Execute `/mystatus` para consultar a cota
3. Interprete a barra de progresso, quantidade usada e tempo de redefinição na saída

**Pontos principais**:
- A taxa de uso exceder 80% acionará aviso
- A API Key é exibida de forma mascarada automaticamente
- O limite de token e a cota MCP são dois limites independentes

## Próxima seção

> A próxima seção aprenderemos **[Consulta de cota GitHub Copilot](../copilot-usage/)**.
>
> Você aprenderá:
> - Como visualizar o uso de Premium Requests
> - Diferenças de cota mensal para diferentes tipos de assinatura
> - Método de interpretação de detalhes de uso por modelo

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-23

| Funcionalidade | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| Consulta de cota Zhipu AI | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 213-217 |
| Consulta de cota Z.ai | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 224-228 |
| Formatação de saída | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 115-177 |
| Configuração de endpoint da API | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 62-76 |
| Definição de tipo ZhipuAuthData | [`source/vbgate/opencode-mystatus/plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 38-41 |
| Limiar de aviso de alto uso | [`source/vbgate/opencode-mystatus/plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 110-111 |

**Constantes principais**:
- `HIGH_USAGE_THRESHOLD = 80`: Aviso quando a taxa de uso exceder 80% (`types.ts:111`)

**Funções principais**:
- `queryZhipuUsage(authData)`: Consulta cota de conta Zhipu AI (`zhipu.ts:213-217`)
- `queryZaiUsage(authData)`: Consulta cota de conta Z.ai (`zhipu.ts:224-228`)
- `formatZhipuUsage(data, apiKey, accountLabel)`: Formata a saída de cota (`zhipu.ts:115-177`)
- `fetchUsage(apiKey, config)`: Chama a API oficial para obter dados de cota (`zhipu.ts:81-106`)

**Endpoints da API**:
- Zhipu AI: `https://bigmodel.cn/api/monitor/usage/quota/limit` (`zhipu.ts:63`)
- Z.ai: `https://api.z.ai/api/monitor/usage/quota/limit` (`zhipu.ts:64`)

</details>
