---
title: "Especificação de API: Referência Técnica de Interface de Gateway Antigravity | antigravity-auth"
sidebarTitle: "Depuração de Chamadas API"
subtitle: "Especificação de API Antigravity"
description: "Aprenda a especificação da API Antigravity, domine a configuração de endpoints de interface de gateway unificada, autenticação OAuth 2.0, formatos de requisição e resposta, regras de chamada de função e mecanismos de tratamento de erros."
tags:
  - "API"
  - "Especificação"
  - "Antigravity"
  - "Referência Técnica"
prerequisite:
  - "start-what-is-antigravity-auth"
order: 2
---

# Especificação de API Antigravity

> **⚠️ Aviso Importante**: Esta é a **especificação interna de API** do Antigravity, não um documento público. Este tutorial é baseado em testes diretos de API e é destinado a desenvolvedores que precisam entender os detalhes da API em profundidade.

Se você apenas deseja usar o plugin, consulte o [Início Rápido](/pt/NoeFabris/opencode-antigravity-auth/start/quick-install/) e o [Guia de Configuração](/pt/NoeFabris/opencode-antigravity-auth/advanced/configuration-guide/).

---

## O Que Você Aprenderá

- Entender como funciona a API de gateway unificada do Antigravity
- Dominar os formatos de requisição/resposta e limitações do JSON Schema
- Saber como configurar modelos Thinking e chamadas de função
- Entender os mecanismos de limitação de taxa e tratamento de erros
- Ser capaz de depurar problemas de chamadas de API

---

## Visão Geral da API Antigravity

**Antigravity** é a API de gateway unificada do Google que acessa vários modelos de IA como Claude e Gemini através de uma interface no estilo Gemini, fornecendo um formato único e estrutura de resposta unificada.

::: info Diferença do Vertex AI
Antigravity **não** é uma API de modelo direta do Vertex AI. É um gateway interno que fornece:
- Formato de API único (todos os modelos são no estilo Gemini)
- Acesso em nível de projeto (via autenticação Google Cloud)
- Roteamento interno para backends de modelo (Vertex AI para Claude, Gemini API para Gemini)
- Formato de resposta unificado (estrutura `candidates[]`)
:::

**Características Principais**:

| Característica | Descrição |
| --- | --- |
| **Formato de API Único** | Todos os modelos usam o array `contents` no estilo Gemini |
| **Acesso em Nível de Projeto** | Requer um Project ID válido do Google Cloud |
| **Roteamento Interno** | Roteamento automático para o backend correto (Vertex AI ou Gemini API) |
| **Resposta Unificada** | Todos os modelos retornam a estrutura `candidates[]` |
| **Suporte a Thinking** | Claude e Gemini 3 suportam raciocínio estendido |

---

## Endpoints e Caminhos

### Ambiente da API

| Ambiente | URL | Status | Uso |
| --- | --- | --- | --- |
| **Daily (Sandbox)** | `https://daily-cloudcode-pa.sandbox.googleapis.com` | ✅ Ativo | Endpoint principal (consistente com CLIProxy) |
| **Production** | `https://cloudcode-pa.googleapis.com` | ✅ Ativo | Modelos Gemini CLI, loadCodeAssist |
| **Autopush (Sandbox)** | `https://autopush-cloudcode-pa.sandbox.googleapis.com` | ❌ Indisponível | Descontinuado |

**Localização do Código Fonte**: [`src/constants.ts:32-43`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L32-L43)

### Caminhos da API

| Ação | Caminho | Descrição |
| --- | --- | --- |
| Gerar Conteúdo | `/v1internal:generateContent` | Requisição não streaming |
| Gerar Streaming | `/v1internal:streamGenerateContent?alt=sse` | Requisição streaming (SSE) |
| Carregar Code Assist | `/v1internal:loadCodeAssist` | Descoberta de projeto (obtém Project ID automaticamente) |
| Integrar Usuário | `/v1internal:onboardUser` | Integração de usuário (geralmente não usado) |

---

## Métodos de Autenticação

### Fluxo OAuth 2.0

```
URL de Autorização: https://accounts.google.com/o/oauth2/auth
URL de Token: https://oauth2.googleapis.com/token
```

### Scopes Obrigatórios

```http
https://www.googleapis.com/auth/cloud-platform
https://www.googleapis.com/auth/userinfo.email
https://www.googleapis.com/auth/userinfo.profile
https://www.googleapis.com/auth/cclog
https://www.googleapis.com/auth/experimentsandconfigs
```

**Localização do Código Fonte**: [`src/constants.ts:14-20`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L14-L20)

### Headers Obrigatórios

#### Endpoint Antigravity (Padrão)

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: antigravity/1.11.5 windows/amd64
X-Goog-Api-Client: google-cloud-sdk vscode_cloudshelleditor/0.1
Client-Metadata: {"ideType":"IDE_UNSPECIFIED","platform":"PLATFORM_UNSPECIFIED","pluginType":"GEMINI"}
```

#### Endpoint Gemini CLI (Modelos sem sufixo `:antigravity`)

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: google-api-nodejs-client/9.15.1
X-Goog-Api-Client: gl-node/22.17.0
Client-Metadata: ideType=IDE_UNSPECIFIED,platform=PLATFORM_UNSPECIFIED,pluginType=GEMINI
```

#### Header Adicional para Requisições Streaming

```http
Accept: text/event-stream
```

**Localização do Código Fonte**: [`src/constants.ts:73-83`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L73-L83)

---

## Formato de Requisição

### Estrutura Básica

```json
{
  "project": "{project_id}",
  "model": "{model_id}",
  "request": {
    "contents": [...],
    "generationConfig": {...},
    "systemInstruction": {...},
    "tools": [...]
  },
  "userAgent": "antigravity",
  "requestId": "{unique_id}"
}
```

### Array Contents (Obrigatório)

::: warning Restrição Importante
Deve usar o **formato no estilo Gemini**. Arrays no estilo Anthropic `messages` **não são suportados**.
:::

**Formato Correto**:

```json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        { "text": "Sua mensagem aqui" }
      ]
    },
    {
      "role": "model",
      "parts": [
        { "text": "Resposta do assistente" }
      ]
    }
  ]
}
```

**Valores de Role**:
- `user` - Mensagem do usuário/humano
- `model` - Resposta do modelo (**não** `assistant`)

### Generation Config

```json
{
  "generationConfig": {
    "maxOutputTokens": 1000,
    "temperature": 0.7,
    "topP": 0.95,
    "topK": 40,
    "stopSequences": ["STOP"],
    "thinkingConfig": {
      "thinkingBudget": 8000,
      "includeThoughts": true
    }
  }
}
```

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `maxOutputTokens` | number | Número máximo de tokens na resposta |
| `temperature` | number | Aleatoriedade (0.0 - 2.0) |
| `topP` | number | Limiar de nucleus sampling |
| `topK` | number | Top-K sampling |
| `stopSequences` | string[] | Palavras-gatilho para parar a geração |
| `thinkingConfig` | object | Configuração de raciocínio estendido (modelos Thinking) |

### System Instructions

::: warning Restrição de Formato
A Instrução do Sistema **deve ser um objeto contendo `parts`**, **não** pode ser uma string pura.
:::

```json
// ✅ Correto
{
  "systemInstruction": {
    "parts": [
      { "text": "Você é um assistente útil." }
    ]
  }
}

// ❌ Errado - retornará erro 400
{
  "systemInstruction": "Você é um assistente útil."
}
```

### Tools / Function Calling

```json
{
  "tools": [
    {
      "functionDeclarations": [
        {
          "name": "get_weather",
          "description": "Obter clima para uma localização",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "Nome da cidade"
              }
            },
            "required": ["location"]
          }
        }
      ]
    }
  ]
}
```

#### Regras de Nomenclatura de Funções

| Regra | Descrição |
| --- | --- |
| Primeiro caractere | Deve ser letra (a-z, A-Z) ou sublinhado (_) |
| Caracteres permitidos | `a-zA-Z0-9`、sublinhado (_)、ponto (.)、dois-pontos (:)、hífen (-) |
| Comprimento máximo | 64 caracteres |
| Não permitido | Barra (/)、espaços、outros caracteres especiais |

**Exemplos**:
- ✅ `get_weather` - Válido
- ✅ `mcp:mongodb.query` - Válido (permite dois-pontos e ponto)
- ✅ `read-file` - Válido (permite hífen)
- ❌ `mcp/query` - Inválido (não permite barra)
- ❌ `123_tool` - Inválido (deve começar com letra ou sublinhado)

---

## Suporte JSON Schema

### Funcionalidades Suportadas

| Funcionalidade | Status | Descrição |
| --- | --- | --- |
| `type` | ✅ Suportado | `object`、`string`、`number`、`integer`、`boolean`、`array` |
| `properties` | ✅ Suportado | Propriedades de objeto |
| `required` | ✅ Suportado | Array de campos obrigatórios |
| `description` | ✅ Suportado | Descrição de campo |
| `enum` | ✅ Suportado | Valores enumerados |
| `items` | ✅ Suportado | Schema de elementos de array |
| `anyOf` | ✅ Suportado | Convertido internamente para `any_of` |
| `allOf` | ✅ Suportado | Convertido internamente para `all_of` |
| `oneOf` | ✅ Suportado | Convertido internamente para `one_of` |
| `additionalProperties` | ✅ Suportado | Schema de propriedades adicionais |

### Funcionalidades Não Suportadas (causam erro 400)

::: danger Os seguintes campos causarão erro 400
- `const` - Use `enum: [value]` em vez disso
- `$ref` - Definição de schema inline
- `$defs` / `definitions` - Definição inline
- `$schema` - Remova estes campos de metadados
- `$id` - Remova estes campos de metadados
- `default` - Remova estes campos de documentação
- `examples` - Remova estes campos de documentação
- `title` (aninhado) - ⚠️ Pode causar problemas em objetos aninhados
:::

```json
// ❌ Errado - retornará erro 400
{ "type": { "const": "email" } }

// ✅ Correto - use enum em vez disso
{ "type": { "enum": ["email"] } }
```

**Processamento Automático do Plugin**: O plugin processa automaticamente estas conversões através da função `cleanJSONSchemaForAntigravity()` em `request-helpers.ts`.

---

## Formato de Resposta

### Resposta Não Streaming

```json
{
  "response": {
    "candidates": [
      {
        "content": {
          "role": "model",
          "parts": [
            { "text": "Texto da resposta aqui" }
          ]
        },
        "finishReason": "STOP"
      }
    ],
    "usageMetadata": {
      "promptTokenCount": 16,
      "candidatesTokenCount": 4,
      "totalTokenCount": 20
    },
    "modelVersion": "claude-sonnet-4-5",
    "responseId": "msg_vrtx_..."
  },
  "traceId": "abc123..."
}
```

### Resposta Streaming (SSE)

**Content-Type**: `text/event-stream`

```
data: {"response": {"candidates": [{"content": {"role": "model", "parts": [{"text": "Olá"}]}}], "usageMetadata": {...}, "modelVersion": "...", "responseId": "..."}, "traceId": "..."}

data: {"response": {"candidates": [{"content": {"role": "model", "parts": [{"text": " mundo"]}, "finishReason": "STOP"}], "usageMetadata": {...}}, "traceId": "..."}
```

### Descrição dos Campos de Resposta

| Campo | Descrição |
| --- | --- |
| `response.candidates` | Array de candidatos de resposta |
| `response.candidates[].content.role` | Sempre `"model"` |
| `response.candidates[].content.parts` | Array de partes de conteúdo |
| `response.candidates[].finishReason` | `STOP`、`MAX_TOKENS`、`OTHER` |
| `response.usageMetadata.promptTokenCount` | Número de tokens de entrada |
| `response.usageMetadata.candidatesTokenCount` | Número de tokens de saída |
| `response.usageMetadata.totalTokenCount` | Número total de tokens |
| `response.usageMetadata.thoughtsTokenCount` | Número de tokens de Thinking (Gemini) |
| `response.modelVersion` | Modelo real usado |
| `response.responseId` | ID da requisição (formato varia por modelo) |
| `traceId` | ID de rastreamento para depuração |

### Formato do Response ID

| Tipo de Modelo | Formato | Exemplo |
| --- | --- | --- |
| Claude | `msg_vrtx_...` | `msg_vrtx_01UDKZG8PWPj9mjajje8d7u7` |
| Gemini | Estilo Base64 | `ypM9abPqFKWl0-kPvamgqQw` |
| GPT-OSS | Estilo Base64 | `y5M9aZaSKq6z2roPoJ7pEA` |

---

## Resposta de Function Call

Quando o modelo deseja chamar uma função:

```json
{
  "response": {
    "candidates": [
      {
        "content": {
          "role": "model",
          "parts": [
            {
              "functionCall": {
                "name": "get_weather",
                "args": {
                  "location": "Paris"
                },
                "id": "toolu_vrtx_01PDbPTJgBJ3AJ8BCnSXvUqk"
              }
            }
          ]
        },
        "finishReason": "OTHER"
      }
    ]
  }
}
```

### Fornecer Resultado da Função

```json
{
  "contents": [
    { "role": "user", "parts": [{ "text": "Qual o clima?" }] },
    { "role": "model", "parts": [{ "functionCall": { "name": "get_weather", "args": {...}, "id": "..." } }] },
    { "role": "user", "parts": [{ "functionResponse": { "name": "get_weather", "id": "...", "response": { "temperature": "22C" } } }] }
  ]
}
```

---

## Thinking / Raciocínio Estendido

### Configuração de Thinking

Para modelos que suportam Thinking (`*-thinking`):

```json
{
  "generationConfig": {
    "maxOutputTokens": 10000,
    "thinkingConfig": {
      "thinkingBudget": 8000,
      "includeThoughts": true
    }
  }
}
```

::: warning Restrição Importante
`maxOutputTokens` deve ser **maior** que `thinkingBudget`
:::

### Resposta de Thinking (Gemini)

Modelos Gemini retornam thinking com assinatura:

```json
{
  "parts": [
    {
      "thoughtSignature": "ErADCq0DAXLI2nx...",
      "text": "Deixe-me pensar sobre isso..."
    },
    {
      "text": "A resposta é..."
    }
  ]
}
```

### Resposta de Thinking (Claude)

Modelos Claude thinking podem conter partes `thought: true`:

```json
{
  "parts": [
    {
      "thought": true,
      "text": "Processo de raciocínio...",
      "thoughtSignature": "..."
    },
    {
      "text": "Resposta final..."
    }
  ]
}
```

**Processamento do Plugin**: O plugin armazena automaticamente em cache assinaturas de thinking para evitar erros de assinatura em conversas de múltiplas rodadas. Consulte [advanced/session-recovery/](/pt/NoeFabris/opencode-antigravity-auth/advanced/session-recovery/) para mais detalhes.

---

## Respostas de Erro

### Estrutura de Erro

```json
{
  "error": {
    "code": 400,
    "message": "Descrição do erro",
    "status": "INVALID_ARGUMENT",
    "details": [...]
  }
}
```

### Códigos de Erro Comuns

| Código | Status | Descrição |
| --- | --- | --- |
| 400 | `INVALID_ARGUMENT` | Formato de requisição inválido |
| 401 | `UNAUTHENTICATED` | Token inválido ou expirado |
| 403 | `PERMISSION_DENIED` | Sem permissão para acessar recurso |
| 404 | `NOT_FOUND` | Modelo não encontrado |
| 429 | `RESOURCE_EXHAUSTED` | Limite de taxa excedido |

### Resposta de Limite de Taxa

```json
{
  "error": {
    "code": 429,
    "message": "Você esgotou sua capacidade neste modelo. Sua cota será redefinida após 3s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "3.957525076s"
      }
    ]
  }
}
```

**Processamento do Plugin**: O plugin detecta automaticamente erros 429, alterna contas ou aguarda o tempo de redefinição. Consulte [advanced/rate-limit-handling/](/pt/NoeFabris/opencode-antigravity-auth/advanced/rate-limit-handling/) para mais detalhes.

---

## Funcionalidades Não Suportadas

As seguintes funcionalidades Anthropic/Vertex AI **não são suportadas**:

| Funcionalidade | Erro |
| --- | --- |
| `anthropic_version` | Campo desconhecido |
| Array `messages` | Campo desconhecido (deve usar `contents`) |
| `max_tokens` | Campo desconhecido (deve usar `maxOutputTokens`) |
| `systemInstruction` string pura | Valor inválido (deve usar formato de objeto) |
| `system_instruction` (snake_case raiz) | Campo desconhecido |
| `const` do JSON Schema | Campo desconhecido (use `enum: [value]` em vez disso) |
| `$ref` do JSON Schema | Não suportado (definição inline) |
| `$defs` do JSON Schema | Não suportado (definição inline) |
| Nome de Tool contendo `/` | Inválido (use `_` ou `:` em vez disso) |
| Nome de Tool começando com número | Inválido (deve começar com letra ou sublinhado) |

---

## Exemplo Completo de Requisição

```json
{
  "project": "my-project-id",
  "model": "claude-sonnet-4-5",
  "request": {
    "contents": [
      {
        "role": "user",
        "parts": [
          { "text": "Olá, como você está?" }
        ]
      }
    ],
    "systemInstruction": {
      "parts": [
        { "text": "Você é um assistente útil." }
      ]
    },
    "generationConfig": {
      "maxOutputTokens": 1000,
      "temperature": 0.7
    }
  },
  "userAgent": "antigravity",
  "requestId": "agent-abc123"
}
```

---

## Headers de Resposta

| Header | Descrição |
| --- | --- |
| `x-cloudaicompanion-trace-id` | ID de rastreamento para depuração |
| `server-timing` | Duração da requisição |

---

## Antigravity vs Vertex AI Anthropic

| Característica | Antigravity | Vertex AI Anthropic |
| --- | --- | --- |
| Endpoint | `cloudcode-pa.googleapis.com` | `aiplatform.googleapis.com` |
| Formato de Requisição | `contents` no estilo Gemini | `messages` no estilo Anthropic |
| `anthropic_version` | Não usado | Obrigatório |
| Nome do Modelo | Simples (`claude-sonnet-4-5`) | Versionado (`claude-4-5@date`) |
| Formato de Resposta | `candidates[]` | `content[]` no estilo Anthropic |
| Suporte a Múltiplos Modelos | Sim (Claude, Gemini, etc.) | Apenas Anthropic |

---

## Resumo da Aula

Este tutorial apresentou detalhadamente a especificação interna da API de gateway unificada Antigravity:

- **Endpoints**: Três ambientes (Daily, Production, Autopush), Daily Sandbox é o endpoint principal
- **Autenticação**: OAuth 2.0 + Bearer Token, scopes e headers obrigatórios
- **Formato de Requisição**: Array `contents` no estilo Gemini, suporta System Instruction e Tools
- **JSON Schema**: Suporta funcionalidades comuns, mas não suporta `const`, `$ref`, `$defs`
- **Formato de Resposta**: Estrutura `candidates[]`, suporta streaming SSE
- **Thinking**: Claude e Gemini 3 suportam raciocínio estendido, requer `thinkingConfig`
- **Tratamento de Erros**: Formato de erro padrão, 429 inclui atraso de retry

Se você está depurando problemas de chamadas de API, pode usar o modo de depuração do plugin:

```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode
```

---

## Prévia da Próxima Aula

> Esta é a última aula do capítulo de apêndice. Se você quiser saber mais detalhes técnicos, pode consultar:
> - [Visão Geral da Arquitetura](/pt/NoeFabris/opencode-antigravity-auth/appendix/architecture-overview/) - Conheça a arquitetura de módulos e cadeia de chamadas do plugin
> - [Formato de Armazenamento](/pt/NoeFabris/opencode-antigravity-auth/appendix/storage-schema/) - Conheça o formato do arquivo de armazenamento de contas
> - [Opções de Configuração](/pt/NoeFabris/opencode-antigravity-auth/appendix/all-config-options/) - Manual de referência completo de todas as opções de configuração

Se você precisar voltar à fase de introdução, pode começar novamente em [O Que É Antigravity Auth](/pt/NoeFabris/opencode-antigravity-auth/start/what-is-antigravity-auth/).

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Constantes de Endpoint da API | [`src/constants.ts:32-43`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L32-L43) | 32-43 |
| Headers Antigravity | [`src/constants.ts:73-77`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L73-L77) | 73-77 |
| Headers Gemini CLI | [`src/constants.ts:79-83`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L79-L83) | 79-83 |
| Scopes OAuth | [`src/constants.ts:14-20`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L14-L20) | 14-20 |
| Lógica Principal de Conversão de Requisição | [`src/plugin/request.ts:1`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request.ts#L1) | 1-2000+ |
| Limpeza de JSON Schema | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | Arquivo completo |
| Cache de Assinatura de Thinking | [`src/plugin/cache.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/cache.ts) | Arquivo completo |

**Constantes Principais**:
- `ANTIGRAVITY_ENDPOINT_DAILY = "https://daily-cloudcode-pa.sandbox.googleapis.com"` - Endpoint Daily Sandbox
- `ANTIGRAVITY_ENDPOINT_PROD = "https://cloudcode-pa.googleapis.com"` - Endpoint Production
- `ANTIGRAVITY_DEFAULT_PROJECT_ID = "rising-fact-p41fc"` - Project ID padrão
- `SKIP_THOUGHT_SIGNATURE = "skip_thought_signature_validator"` - Valor sentinela para pular validação de assinatura de thinking

**Funções Principais**:
- `cleanJSONSchemaForAntigravity(schema)` - Limpa JSON Schema para atender aos requisitos da API Antigravity
- `prepareAntigravityRequest(request)` - Prepara e envia requisição da API Antigravity
- `createStreamingTransformer()` - Cria transformador de resposta streaming

</details>
