---
title: "Referência da API: Documentação de Endpoints Locais | plannotator"
sidebarTitle: "Referência Rápida da API"
subtitle: "Referência da API: Documentação de Endpoints Locais | plannotator"
description: "Conheça todos os endpoints da API do Plannotator e os formatos de requisição/resposta. Especificações completas para revisão de planos, revisão de código, upload de imagens e outras interfaces para facilitar a integração."
tags:
  - "API"
  - "Apêndice"
prerequisite:
  - "start-getting-started"
order: 1
---

# Referência da API do Plannotator

## O Que Você Vai Aprender

- Conhecer todos os endpoints da API fornecidos pelo servidor local do Plannotator
- Visualizar os formatos de requisição e resposta de cada API
- Entender as diferenças entre as interfaces de revisão de planos e revisão de código
- Obter referências para integração ou desenvolvimento de extensões

## Visão Geral

O Plannotator executa um servidor HTTP local (usando Bun.serve), fornecendo APIs RESTful para revisão de planos e revisão de código. Todas as respostas da API são em formato JSON, sem necessidade de autenticação (ambiente isolado local).

**Métodos de inicialização do servidor**:
- Porta aleatória (modo local)
- Porta fixa 19432 (modo remoto/Devcontainer, pode ser substituída via `PLANNOTATOR_PORT`)

**URL base da API**: `http://localhost:<PORT>/api/`

::: tip Dica
As APIs abaixo estão categorizadas por módulo funcional. O comportamento do mesmo caminho pode diferir entre os servidores de revisão de planos e revisão de código.
:::

## API de Revisão de Planos

### GET /api/plan

Obtém o conteúdo do plano atual e metadados relacionados.

**Requisição**: Nenhuma

**Exemplo de resposta**:

```json
{
  "plan": "# Implementation Plan: User Authentication\n...",
  "origin": "claude-code",
  "permissionMode": "read-write",
  "sharingEnabled": true
}
```

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `plan` | string | Conteúdo do plano em Markdown |
| `origin` | string | Identificador de origem (`"claude-code"` ou `"opencode"`) |
| `permissionMode` | string | Modo de permissão atual (exclusivo do Claude Code) |
| `sharingEnabled` | boolean | Se o compartilhamento por URL está habilitado |

---

### POST /api/approve

Aprova o plano atual, com opção de salvar em um aplicativo de notas.

**Corpo da requisição**:

```json
{
  "obsidian": {
    "vaultPath": "/Users/xxx/Documents/Obsidian",
    "folder": "Plans",
    "tags": ["plannotator"],
    "plan": "Plan content..."
  },
  "bear": {
    "plan": "Plan content..."
  },
  "feedback": "Observação ao aprovar (apenas OpenCode)",
  "agentSwitch": "gpt-4",
  "permissionMode": "read-write",
  "planSave": {
    "enabled": true,
    "customPath": "/path/to/custom/folder"
  }
}
```

**Exemplo de resposta**:

```json
{
  "ok": true,
  "savedPath": "/Users/xxx/.plannotator/plans/approved-plan-20260124.md"
}
```

**Descrição dos campos**:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `obsidian` | object | Não | Configuração de salvamento no Obsidian |
| `bear` | object | Não | Configuração de salvamento no Bear |
| `feedback` | string | Não | Observação anexada à aprovação (apenas OpenCode) |
| `agentSwitch` | string | Não | Nome do Agent para alternar (apenas OpenCode) |
| `permissionMode` | string | Não | Modo de permissão solicitado (apenas Claude Code) |
| `planSave` | object | Não | Configuração de salvamento do plano |

**Campos de configuração do Obsidian**:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `vaultPath` | string | Sim | Caminho do arquivo do Vault |
| `folder` | string | Não | Pasta de destino (raiz por padrão) |
| `tags` | string[] | Não | Tags geradas automaticamente |
| `plan` | string | Sim | Conteúdo do plano |

---

### POST /api/deny

Rejeita o plano atual e fornece feedback.

**Corpo da requisição**:

```json
{
  "feedback": "Necessário adicionar cobertura de testes unitários",
  "planSave": {
    "enabled": true,
    "customPath": "/path/to/custom/folder"
  }
}
```

**Exemplo de resposta**:

```json
{
  "ok": true,
  "savedPath": "/Users/xxx/.plannotator/plans/denied-plan-20260124.md"
}
```

**Descrição dos campos**:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `feedback` | string | Não | Motivo da rejeição (padrão: "Plan rejected by user") |
| `planSave` | object | Não | Configuração de salvamento do plano |

---

### GET /api/obsidian/vaults

Detecta os vaults do Obsidian configurados localmente.

**Requisição**: Nenhuma

**Exemplo de resposta**:

```json
{
  "vaults": [
    "/Users/xxx/Documents/Obsidian",
    "/Users/xxx/Documents/OtherVault"
  ]
}
```

**Caminhos do arquivo de configuração**:
- macOS: `~/Library/Application Support/obsidian/obsidian.json`
- Windows: `%APPDATA%\obsidian\obsidian.json`
- Linux: `~/.config/obsidian/obsidian.json`

---

## API de Revisão de Código

### GET /api/diff

Obtém o conteúdo atual do git diff.

**Requisição**: Nenhuma

**Exemplo de resposta**:

```json
{
  "rawPatch": "diff --git a/src/index.ts b/src/index.ts\n...",
  "gitRef": "HEAD",
  "origin": "opencode",
  "diffType": "uncommitted",
  "gitContext": {
    "currentBranch": "feature/auth",
    "defaultBranch": "main",
    "diffOptions": [
      { "id": "uncommitted", "label": "Uncommitted changes" },
      { "id": "last-commit", "label": "Last commit" },
      { "id": "branch", "label": "vs main" }
    ]
  },
  "sharingEnabled": true
}
```

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `rawPatch` | string | Patch em formato unificado do Git diff |
| `gitRef` | string | Referência Git utilizada |
| `origin` | string | Identificador de origem |
| `diffType` | string | Tipo de diff atual |
| `gitContext` | object | Informações de contexto do Git |
| `sharingEnabled` | boolean | Se o compartilhamento por URL está habilitado |

**Descrição dos campos de gitContext**:

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `currentBranch` | string | Nome da branch atual |
| `defaultBranch` | string | Nome da branch padrão (main ou master) |
| `diffOptions` | object[] | Opções de tipos de diff disponíveis (contém id e label) |

---

### POST /api/diff/switch

Alterna para um tipo diferente de git diff.

**Corpo da requisição**:

```json
{
  "diffType": "staged"
}
```

**Tipos de diff suportados**:

| Tipo | Comando Git | Descrição |
| --- | --- | --- |
| `uncommitted` | `git diff HEAD` | Alterações não commitadas (padrão) |
| `staged` | `git diff --staged` | Alterações em staging |
| `last-commit` | `git diff HEAD~1..HEAD` | Último commit |
| `vs main` | `git diff main..HEAD` | Branch atual vs main |

**Exemplo de resposta**:

```json
{
  "rawPatch": "diff --git a/src/index.ts b/src/index.ts\n...",
  "gitRef": "--staged",
  "diffType": "staged"
}
```

---

### POST /api/feedback

Envia feedback de revisão de código para o AI Agent.

**Corpo da requisição**:

```json
{
  "feedback": "Sugestão: adicionar lógica de tratamento de erros",
  "annotations": [
    {
      "id": "1",
      "type": "suggestion",
      "filePath": "src/index.ts",
      "lineStart": 42,
      "lineEnd": 45,
      "side": "new",
      "text": "Deveria usar try-catch aqui",
      "suggestedCode": "try {\n  // ...\n} catch (err) {\n  console.error(err);\n}"
    }
  ],
  "agentSwitch": "gpt-4"
}
```

**Descrição dos campos**:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `feedback` | string | Não | Feedback em texto (LGTM ou outro) |
| `annotations` | array | Não | Array de anotações estruturadas |
| `agentSwitch` | string | Não | Nome do Agent para alternar (apenas OpenCode) |

**Campos do objeto annotation**:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | string | Sim | Identificador único |
| `type` | string | Sim | Tipo: `comment`, `suggestion`, `concern` |
| `filePath` | string | Sim | Caminho do arquivo |
| `lineStart` | number | Sim | Número da linha inicial |
| `lineEnd` | number | Sim | Número da linha final |
| `side` | string | Sim | Lado: `"old"` ou `"new"` |
| `text` | string | Não | Conteúdo do comentário |
| `suggestedCode` | string | Não | Código sugerido (tipo suggestion) |

**Exemplo de resposta**:

```json
{
  "ok": true
}
```

---

## APIs Compartilhadas

### GET /api/image

Obtém uma imagem (caminho de arquivo local ou arquivo temporário enviado).

**Parâmetros da requisição**:

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `path` | string | Sim | Caminho do arquivo de imagem |

**Exemplo de requisição**: `GET /api/image?path=/tmp/plannotator/abc-123.png`

**Resposta**: Arquivo de imagem (PNG/JPEG/WebP)

**Respostas de erro**:
- `400` - Parâmetro path ausente
- `404` - Arquivo não encontrado
- `500` - Falha ao ler o arquivo

---

### POST /api/upload

Envia uma imagem para o diretório temporário e retorna o caminho acessível.

**Requisição**: `multipart/form-data`

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `file` | File | Sim | Arquivo de imagem |

**Formatos suportados**: PNG, JPEG, WebP

**Exemplo de resposta**:

```json
{
  "path": "/tmp/plannotator/abc-123-def456.png"
}
```

**Respostas de erro**:
- `400` - Nenhum arquivo fornecido
- `500` - Falha no upload

::: info Observação
As imagens enviadas são salvas no diretório `/tmp/plannotator` e não são limpas automaticamente quando o servidor é encerrado.
:::

---

### GET /api/agents

Obtém a lista de Agents disponíveis do OpenCode (apenas OpenCode).

**Requisição**: Nenhuma

**Exemplo de resposta**:

```json
{
  "agents": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "description": "Most capable model for complex tasks"
    },
    {
      "id": "gpt-4o",
      "name": "GPT-4o",
      "description": "Fast and efficient multimodal model"
    }
  ]
}
```

**Regras de filtragem**:
- Retorna apenas agents com `mode === "primary"`
- Exclui agents com `hidden === true`

**Resposta de erro**:

```json
{
  "agents": [],
  "error": "Failed to fetch agents"
}
```

---

## Tratamento de Erros

### Códigos de Status HTTP

| Código | Descrição |
| --- | --- |
| `200` | Requisição bem-sucedida |
| `400` | Falha na validação de parâmetros |
| `404` | Recurso não encontrado |
| `500` | Erro interno do servidor |

### Formato de Resposta de Erro

```json
{
  "error": "Mensagem de descrição do erro"
}
```

### Erros Comuns

| Erro | Condição de Disparo |
| --- | --- |
| `Missing path parameter` | `/api/image` sem parâmetro `path` |
| `File not found` | Arquivo especificado em `/api/image` não existe |
| `No file provided` | `/api/upload` sem arquivo enviado |
| `Missing diffType` | `/api/diff/switch` sem campo `diffType` |
| `Port ${PORT} in use` | Porta já em uso (falha na inicialização do servidor) |

---

## Comportamento do Servidor

### Mecanismo de Retry de Porta

- Número máximo de tentativas: 5
- Atraso entre tentativas: 500 milissegundos
- Erro de timeout: `Port ${PORT} in use after 5 retries`

::: warning Aviso para Modo Remoto
No modo remoto/Devcontainer, se a porta estiver ocupada, você pode usar outra porta definindo a variável de ambiente `PLANNOTATOR_PORT`.
:::

### Aguardando Decisão

Após a inicialização, o servidor entra em estado de espera pela decisão do usuário:

**Servidor de Revisão de Planos**:
- Aguarda chamada de `/api/approve` ou `/api/deny`
- Após a chamada, retorna a decisão e encerra o servidor

**Servidor de Revisão de Código**:
- Aguarda chamada de `/api/feedback`
- Após a chamada, retorna o feedback e encerra o servidor

### Fallback SPA

Todos os caminhos não correspondidos retornam HTML incorporado (Single Page Application):

```http
HTTP/1.1 200 OK
Content-Type: text/html

<!DOCTYPE html>
<html>
...
</html>
```

Isso garante que o roteamento do frontend funcione corretamente.

---

## Variáveis de Ambiente

| Variável | Descrição | Valor Padrão |
| --- | --- | --- |
| `PLANNOTATOR_REMOTE` | Habilita modo remoto | Não definido |
| `PLANNOTATOR_PORT` | Número de porta fixa | Aleatório (local) / 19432 (remoto) |
| `PLANNOTATOR_ORIGIN` | Identificador de origem | `"claude-code"` ou `"opencode"` |
| `PLANNOTATOR_SHARE` | Desabilita compartilhamento por URL | Não definido (habilitado) |

::: tip Dica
Para mais configurações de variáveis de ambiente, consulte a seção [Configuração de Variáveis de Ambiente](../../advanced/environment-variables/).
:::

---

## Resumo da Lição

O Plannotator fornece uma API HTTP local completa, suportando duas funcionalidades principais: revisão de planos e revisão de código:

- **API de Revisão de Planos**: Obter plano, decisões de aprovar/rejeitar, integração com Obsidian/Bear
- **API de Revisão de Código**: Obter diff, alternar tipo de diff, enviar feedback estruturado
- **APIs Compartilhadas**: Upload e download de imagens, consulta de lista de Agents
- **Tratamento de Erros**: Códigos de status HTTP e formato de erro unificados

Todas as APIs são executadas localmente, sem upload de dados, garantindo segurança e confiabilidade.

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Entrada do servidor de revisão de planos | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L355) | 91-355 |
| GET /api/plan | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L132-L134) | 132-134 |
| POST /api/approve | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L200-L277) | 200-277 |
| POST /api/deny | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L279-L309) | 279-309 |
| GET /api/image | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L136-L151) | 136-151 |
| POST /api/upload | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L153-L174) | 153-174 |
| GET /api/obsidian/vaults | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L176-L180) | 176-180 |
| GET /api/agents (revisão de planos) | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L182-L198) | 182-198 |
| Entrada do servidor de revisão de código | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L79-L288) | 79-288 |
| GET /api/diff | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L117-L127) | 117-127 |
| POST /api/diff/switch | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L129-L161) | 129-161 |
| POST /api/feedback | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L221-L242) | 221-242 |
| GET /api/agents (revisão de código) | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L203-L219) | 203-219 |

**Constantes principais**:
- `MAX_RETRIES = 5`: Número máximo de tentativas de inicialização do servidor (`packages/server/index.ts:79`, `packages/server/review.ts:68`)
- `RETRY_DELAY_MS = 500`: Atraso de retry de porta (`packages/server/index.ts:80`, `packages/server/review.ts:69`)

**Funções principais**:
- `startPlannotatorServer(options)`: Inicia o servidor de revisão de planos (`packages/server/index.ts:91`)
- `startReviewServer(options)`: Inicia o servidor de revisão de código (`packages/server/review.ts:79`)

</details>
