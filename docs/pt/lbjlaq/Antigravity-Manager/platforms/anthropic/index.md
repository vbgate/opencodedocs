---
title: "Anthropic: API Compatível | Antigravity-Manager"
sidebarTitle: "Faça Claude Code Via Gateway Local"
subtitle: "Anthropic: API Compatível"
description: "Aprenda API compatível Anthropic do Antigravity-Manager. Configure Base URL do Claude Code, rode conversação com /v1/messages, entenda autenticação e interceptação de warmup."
tags:
  - "anthropic"
  - "claude"
  - "claude-code"
  - "proxy"
prerequisite:
  - "start-proxy-and-first-client"
order: 2
---

# API Compatível Anthropic: /v1/messages e Contratos Chave do Claude Code

Quer fazer Claude Code via gateway local, mas não quer modificar seu uso de protocolo Anthropic, basta apontar Base URL para Antigravity Tools, depois rodar uma solicitação com `/v1/messages`.

## O que é API Compatível Anthropic?

**API Compatível Anthropic** refere-se a endpoint de protocolo Anthropic Messages que Antigravity Tools expõe externamente. Ele recebe solicitação `/v1/messages`, localmente faz limpeza de payload, encapsulamento de fluxo e retry com rotação, depois encaminha solicitação para upstream fornecendo capacidade real de modelo.

## O que você poderá fazer após completar

- Rodar Claude Code (ou qualquer cliente Anthropic Messages) com interface `/v1/messages` do Antigravity Tools
- Esclarecer como configurar Base URL e cabeçalho de autenticação, evitar tentativa cega de 401/404
- Se precisar de fluxo, consegue SSE padrão; se não precisar de fluxo, também consegue JSON
- Saber quais "reparos de protocolo" o proxy faz em segundo plano (interceptação de warmup, limpeza de mensagem, garantia de assinatura)

## Seu dilema atual

Você quer usar Claude Code/Anthropic SDK, mas problemas de rede, conta, cota, limitação tornam conversa muito instável; você já rodou Antigravity Tools como gateway local, mas frequentemente fica preso nestes tipos de problemas:

- Base URL escrito como `.../v1` ou sendo "empilhado" pelo cliente, resultando diretamente em 404
- Abriu autenticação de proxy mas não sabe qual header o cliente usa para passar key, resultando em 401
- Tarefas de warmup/resumo de background do Claude Code comem cota silenciosamente

## Quando usar esta técnica

- Você precisa integrar **Claude Code CLI**, e quer ele "conectar diretamente ao gateway local segundo protocolo Anthropic"
- Seu cliente à mão só suporta Anthropic Messages API (`/v1/messages`), não quer modificar código

## 🎒 Preparação antes de começar

::: warning Pré-requisitos
Esta lição assume você já rodou ciclo básico de proxy reverso local (consegue acessar `/healthz`, sabe porta de proxy e se habilitou autenticação). Se ainda não rodou, primeiro veja **[Iniciar Proxy Reverso Local e Conectar Primeiro Cliente](/pt/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**.
:::

Você precisa preparar três coisas:

1. Endereço de proxy (ex: `http://127.0.0.1:8045`)
2. Se habilitou autenticação de proxy (e `proxy.api_key` correspondente)
3. Um cliente capaz de enviar solicitação Anthropic Messages (Claude Code / curl funciona)

## Ideia principal

**API Compatível Anthropic** no Antigravity Tools corresponde a um conjunto fixo de rotas: `POST /v1/messages`, `POST /v1/messages/count_tokens`, `GET /v1/models/claude` (veja definição Router em `src-tauri/src/proxy/server.rs`).

Entre eles `/v1/messages` é "entrada principal", proxy fará uma série de tratamentos de compatibilidade antes de enviar realmente solicitação upstream:

- Limpar campos não aceitos pelo protocolo em mensagens históricas (ex: `cache_control`)
- Mesclar mensagens consecutivas do mesmo papel, evitar falha de validação de "alternância de papel"
- Detectar payload de warmup do Claude Code e retornar diretamente resposta simulada, reduzindo desperdício de cota
- Fazer retry e rotação de conta baseado em tipo de erro (máximo 3 tentativas), melhorando estabilidade de sessão longa

## Siga-me

### Passo 1: Confirme Base URL só escreve até porta

**Por que**
`/v1/messages` é rota fixa no lado proxy, Base URL escrito como `.../v1` facilmente é concatenado novamente `/v1/messages` pelo cliente, finalmente se tornando `.../v1/v1/messages`.

Você pode primeiro usar curl para verificar diretamente:

```bash
#Você deve ver: {"status":"ok"}
curl -sS "http://127.0.0.1:8045/healthz"
```

### Passo 2: Se você habilitou autenticação, lembre primeiro estes 3 tipos de header

**Por que**
Middleware de autenticação de proxy tirará key de `Authorization`, `x-api-key`, `x-goog-api-key`; habilitou autenticação mas header não bate, então estavelmente 401.

::: info Quais headers de autenticação o proxy aceita?
`Authorization: Bearer <key>`, `x-api-key: <key>`, `x-goog-api-key: <key>` todos funcionam (veja `src-tauri/src/proxy/middleware/auth.rs`).
:::

### Passo 3: Use Claude Code CLI conectar diretamente ao gateway local

**Por que**
Claude Code usa protocolo Anthropic Messages; aponte Base URL dele para gateway local, consegue reusar este contrato `/v1/messages`.

Configure variáveis de ambiente conforme exemplo README:

```bash
export ANTHROPIC_API_KEY="sk-antigravity"
export ANTHROPIC_BASE_URL="http://127.0.0.1:8045"
claude
```

**Você deve ver**: Claude Code pode iniciar normalmente, e receber resposta após você enviar mensagem.

### Passo 4: Liste modelos disponíveis primeiro (para curl/SDK usar)

**Por que**
Diferentes clientes passam `model` como está; primeiro traga lista de modelos para mão, solução de problemas será muito mais rápida.

```bash
curl -sS "http://127.0.0.1:8045/v1/models/claude" | jq
```

**Você deve ver**: Retorna um JSON de `object: "list"`, onde `data[].id` é ID de modelo disponível.

### Passo 5: Use curl para chamar `/v1/messages` (sem fluxo)

**Por que**
Este é ciclo mínimo reproduzível: sem Claude Code, também consegue confirmar "rota + autenticação + corpo de solicitação" onde exatamente deu erro.

```bash
curl -i "http://127.0.0.1:8045/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk-antigravity" \
  -d '{
    "model": "<escolha um de /v1/models/claude>",
    "max_tokens": 128,
    "messages": [
      {"role": "user", "content": "Olá, apresente-se brevemente"}
    ]
  }'
```

**Você deve ver**:

- HTTP 200
- Cabeçalho de resposta pode conter `X-Account-Email` e `X-Mapped-Model` (para solução de problemas)
- Corpo de resposta é JSON no estilo Anthropic Messages (`type: "message"`)

### Passo 6: Quando precisa de fluxo, abra `stream: true`

**Por que**
Claude Code usará SSE; você mesmo também consegue rodar SSE com curl, confirando que não há problema de proxy/buffer no meio.

```bash
curl -N "http://127.0.0.1:8045/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk-antigravity" \
  -d '{
    "model": "<escolha um de /v1/models/claude>",
    "max_tokens": 128,
    "stream": true,
    "messages": [
      {"role": "user", "content": "Explique em 3 frases o que é proxy reverso local"}
    ]
  }'
```

**Você deve ver**: Linhas de eventos SSE (`event: message_start`, `event: content_block_delta`, etc).

## Ponto de verificação ✅

- `GET /healthz` retorna `{"status":"ok"}`
- `GET /v1/models/claude` consegue obter `data[].id`
- `POST /v1/messages` consegue retornar 200 (JSON sem fluxo ou SSE com fluxo um dos dois)

## Aviso sobre armadilhas

### 1) Base URL não escreva como `.../v1`

Exemplo do Claude Code é `ANTHROPIC_BASE_URL="http://127.0.0.1:8045"`, porque rota do lado proxy já carrega `/v1/messages`.

### 2) Habilitou autenticação mas `proxy.api_key` vazio, rejeitará diretamente

Quando autenticação de proxy habilitada mas `api_key` vazio, middleware retornará diretamente 401 (veja lógica de proteção em `src-tauri/src/proxy/middleware/auth.rs`).

### 3) `/v1/messages/count_tokens` em caminho padrão é implementação placeholder

Quando encaminhamento z.ai não habilitado, este endpoint retornará diretamente `input_tokens: 0, output_tokens: 0` (veja `handle_count_tokens`). Não use para julgar token real.

### 4) Você claramente não abriu fluxo, mas vê servidor "internamente via SSE"

Proxy tem estratégia de compatibilidade para `/v1/messages`: quando cliente não exige fluxo, servidor pode **forçar internamente via SSE** depois coletar resultado como JSON retornar (veja lógica `force_stream_internally` em `handle_messages`).

## Resumo da lição

- Claude Code/cliente Anthropic para rodar, essencialmente 3 coisas: Base URL, header de autenticação, corpo de solicitação `/v1/messages`
- Para "protocolo roda + sessão longa estável", proxy fará limpeza de mensagens históricas, interceptação de warmup, e ao falhar retry/rotação de conta
- `count_tokens` atualmente não pode ser usado como padrão real (a menos que você habilite caminho de encaminhamento correspondente)

## Próximo aviso de lição

> Na próxima lição aprendemos **[API Nativa Gemini: /v1beta/models e Endpoint de Integração do Google SDK](/pt/lbjlaq/Antigravity-Manager/platforms/gemini/)**.

---

## Apêndice: Referência de código-fonte

<details>
<summary><strong>Clique para expandir localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do arquivo | Linha |
|--- | --- | ---|
| Rota de proxy: `/v1/messages` / `count_tokens` / `models/claude` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L193) | 120-193 |
| Entrada principal Anthropic: `handle_messages` (incluindo interceptação de warmup e loop de retry) | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L240-L1140) | 240-1140 |
| Lista de modelos: `GET /v1/models/claude` | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1163-L1183) | 1163-1183 |
| `count_tokens` (retorna 0 quando z.ai não habilitado) | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1210) | 1186-1210 |
| Detecção de warmup e resposta simulada | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1375-L1493) | 1375-1493 |
|--- | --- | ---|
| Limpeza de solicitação: remover `cache_control` | [`src-tauri/src/proxy/mappers/claude/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/request.rs#L68-L148) | 68-148 |
| Limpeza de solicitação: mesclar mensagens consecutivas do mesmo papel | [`src-tauri/src/proxy/mappers/claude/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/request.rs#L253-L296) | 253-296 |
|--- | --- | ---|

**Constantes principais**:
- `MAX_RETRY_ATTEMPTS = 3`: número máximo de retry de `/v1/messages`

</details>
