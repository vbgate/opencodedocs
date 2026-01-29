---
title: "OpenAI API: Configuração de Integração | Antigravity-Manager"
sidebarTitle: "Conecte SDK OpenAI em 5 Minutos"
subtitle: "OpenAI API: Configuração de Integração"
description: "Aprenda configuração de integração da API compatível OpenAI. Domine conversão de rota, configuração base_url e solução 401/404/429, use rapidamente Antigravity Tools."
tags:
  - "OpenAI"
  - "API Proxy"
  - "Chat Completions"
  - "Responses"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 1
---

# API Compatível OpenAI: Estratégia de Implementação de /v1/chat/completions e /v1/responses

Você usará esta **API Compatível OpenAI** para conectar diretamente SDK/Clientes OpenAI existentes ao gateway local do Antigravity Tools, focando em rodar `/v1/chat/completions` e `/v1/responses`, e aprender a usar cabeçalhos de resposta para solução rápida de problemas.

## O que você poderá fazer após completar

- Conectar-se diretamente ao gateway local do Antigravity Tools usando OpenAI SDK (ou curl)
- Rodar `/v1/chat/completions` (incluindo `stream: true`) e `/v1/responses`
- Entender lista de modelos de `/v1/models`, e `X-Mapped-Model` nos cabeçalhos de resposta
- Ao encontrar 401/404/429, saber onde investigar primeiro

## Seu dilema atual

Muitos clientes/SDKs só reconhecem formato de interface OpenAI: URL fixa, campos JSON fixos, formato SSE de fluxo fixo.
O objetivo do Antigravity Tools não é让你 modificar o cliente, mas deixar o cliente "pensar que está chamando OpenAI", na verdade converte solicitação para chamada upstream interna, depois converte resultado de volta para formato OpenAI.

## Quando usar esta técnica

- Você já tem um monte de ferramentas que só suportam OpenAI (plugins IDE, scripts, bots, SDKs), não quer escrever nova integração para cada um
- Você quer usar uniformemente `base_url` para bater solicitações no gateway local (ou LAN), depois deixar gateway fazer agendamento de conta, retry e monitoramento

## 🎒 Preparação antes de começar

::: warning Pré-requisitos
- Você já iniciou serviço de proxy reverso na página "API Proxy" do Antigravity Tools, e anotou porta (ex: `8045`)
- Você já adicionou pelo menos uma conta disponível, caso contrário proxy não consegue obter token upstream
:::

::: info Como trazer autenticação?
Quando você habilita `proxy.auth_mode` e configura `proxy.api_key`, solicitações precisam trazer API Key.

Middleware do Antigravity Tools lerá prioridade `Authorization`, também compatível com `x-api-key`, `x-goog-api-key`. (Implementação em `src-tauri/src/proxy/middleware/auth.rs`)
:::

## O que é API Compatível OpenAI?

**API Compatível OpenAI** é um conjunto de rotas HTTP e protocolos JSON/SSE que "parecem OpenAI". Cliente envia em formato de solicitação OpenAI para gateway local, gateway converte solicitação para chamada upstream interna, depois converte resposta upstream de volta para estrutura de resposta OpenAI, permitindo que SDKs OpenAI existentes básicos funcionem sem modificação.

### Visão rápida de endpoints compatíveis (relacionados a esta lição)

| Endpoint | Finalidade | Evidência de código |
|--- | --- | ---|
| `POST /v1/chat/completions` | Chat Completions (incluindo fluxo) | Registro de rota em `src-tauri/src/proxy/server.rs`; `src-tauri/src/proxy/handlers/openai.rs` |
| `POST /v1/completions` | Legacy Completions (reusa mesmo processador) | Registro de rota em `src-tauri/src/proxy/server.rs` |
| `POST /v1/responses` | Compatibilidade Responses/Codex CLI (reusa mesmo processador) | Registro de rota em `src-tauri/src/proxy/server.rs` (comentário: compatibilidade Codex CLI) |
| `GET /v1/models` | Retorna lista de modelos (incluindo mapeamento personalizado + geração dinâmica) | `src-tauri/src/proxy/handlers/openai.rs` + `src-tauri/src/proxy/common/model_mapping.rs` |

## Siga-me

### Passo 1: Confirme serviço vivo com curl (/healthz + /v1/models)

**Por que**
Primeiro elimine problemas básicos como "serviço não iniciado/porta errada/bloqueada por firewall".

```bash
 # 1) Verificação de saúde
 curl -s http://127.0.0.1:8045/healthz

 # 2) Puxar lista de modelos
 curl -s http://127.0.0.1:8045/v1/models
```

**Você deve ver**: `/healthz` retorna algo como `{"status":"ok"}`; `/v1/models` retorna `{"object":"list","data":[...]}`.

### Passo 2: Chame /v1/chat/completions com OpenAI Python SDK

**Por que**
Este passo prova que cadeia completa "OpenAI SDK → gateway local → upstream → conversão de resposta OpenAI" está conectada.

```python
import openai

client = openai.OpenAI(
    api_key="sk-antigravity",
    base_url="http://127.0.0.1:8045/v1",
)

response = client.chat.completions.create(
    model="gemini-3-flash",
    messages=[{"role": "user", "content": "Olá, por favor se apresente"}],
)

print(response.choices[0].message.content)
```

**Você deve ver**: Terminal imprime um trecho de texto de resposta de modelo.

### Passo 3: Abra stream, confirme retorno de fluxo SSE

**Por que**
Muitos clientes dependem de protocolo SSE do OpenAI (`Content-Type: text/event-stream`). Este passo confirma que cadeia de fluxo e formato de evento estão disponíveis.

```bash
curl -N http://127.0.0.1:8045/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3-flash",
    "stream": true,
    "messages": [
      {"role": "user", "content": "Explique em 3 frases o que é gateway de proxy reverso local"}
    ]
  }'
```

**Você deve ver**: Terminal continuamente sai linhas começando com `data: { ... }`, terminando com `data: [DONE]`.

### Passo 4: Use /v1/responses (estilo Codex/Responses) rodar uma solicitação

**Por que**
Algumas ferramentas vão em `/v1/responses` ou usarão campos como `instructions`, `input` no corpo da solicitação. Este projeto "normalizará" esse tipo de solicitação para `messages` depois reusar mesma lógica de conversão. (Processador em `src-tauri/src/proxy/handlers/openai.rs`)

```bash
curl -s http://127.0.0.1:8045/v1/responses \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3-flash",
    "instructions": "Você é um revisor de código rigoroso.",
    "input": "Aponte o bug mais provável deste código:\n\nfunction add(a, b) { return a - b }"
  }'
```

**Você deve ver**: Corpo de resposta é um objeto no estilo OpenAI (este projeto converte resposta Gemini para `choices[].message.content` do OpenAI).

### Passo 5: Confirme roteamento de modelo ativo (veja cabeçalho de resposta X-Mapped-Model)

**Por que**
O `model` que você escreve no cliente não é necessariamente o "modelo físico" realmente chamado. Gateway fará primeiro mapeamento de modelo (incluindo mapeamento personalizado/curinga, veja [Roteamento de Modelos: Mapeamento Personalizado, Prioridade de Curinga e Estratégias Padrão](/pt/lbjlaq/Antigravity-Manager/advanced/model-router/)), e colocará resultado final no cabeçalho de resposta, facilitando sua solução de problemas.

```bash
curl -i http://127.0.0.1:8045/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "olá"}]
  }'
```

**Você deve ver**: Cabeçalho de resposta contém `X-Mapped-Model: ...` (ex: mapeado para `gemini-2.5-flash`), e pode também conter `X-Account-Email: ...`.

## Ponto de verificação ✅

- `GET /healthz` retorna `{"status":"ok"}` (ou JSON equivalente)
- `GET /v1/models` retorna `object=list` e `data` é array
- Solicitação `/v1/chat/completions` sem fluxo consegue obter `choices[0].message.content`
- Quando `stream: true`, consegue receber SSE, terminando com `[DONE]`
- `curl -i` consegue ver cabeçalho de resposta `X-Mapped-Model`

## Aviso sobre armadilhas

### 1) Base URL errado causando 404 (mais comum)

- Em exemplos de OpenAI SDK, `base_url` precisa terminar com `/v1` (veja exemplo Python no README do projeto).
- Alguns clientes "empilham caminhos". Por exemplo, README menciona explicitamente: Kilo Code no modo OpenAI pode concatenar caminho não padrão como `/v1/chat/completions/responses`, disparando 404.

### 2) 401: não é upstream caiu, é você não trouxe key ou modo errado

Quando "modo válido" de estratégia de autenticação não é `off`, middleware validará cabeçalhos de solicitação: `Authorization: Bearer <proxy.api_key>`, também compatível com `x-api-key`, `x-goog-api-key`. (Implementação em `src-tauri/src/proxy/middleware/auth.rs`)

::: tip Dica de modo de autenticação
Quando `auth_mode = auto`, decidirá automaticamente baseado em `allow_lan_access`:
- `allow_lan_access = true` → modo válido é `all_except_health` (todos exceto `/healthz` precisam autenticação)
- `allow_lan_access = false` → modo válido é `off` (acesso local não precisa autenticação)
:::

### 3) 429/503/529: proxy fará retry + rotação de conta, mas também pode "esgotar pool"

Processador OpenAI embutido no máximo 3 tentativas (e limitado por tamanho de pool de contas), encontrando certos erros esperará/rotacionará conta para retry. (Implementação em `src-tauri/src/proxy/handlers/openai.rs`)

## Resumo da lição

- `/v1/chat/completions` é ponto de entrada mais geral, `stream: true` vai via SSE
- `/v1/responses` e `/v1/completions` usam mesmo processador de compatibilidade, núcleo é primeiro normalizar solicitação para `messages`
- `X-Mapped-Model` ajuda confirmar resultado de mapeamento "nome de modelo cliente → modelo físico final"

## Próximo aviso de lição

> Na próxima lição continuaremos ver **API Compatível Anthropic: /v1/messages e Contratos Chave do Claude Code** (capítulo correspondente: `platforms-anthropic`).

---

## Apêndice: Referência de código-fonte

<details>
<summary><strong>Clique para expandir localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do arquivo | Linha |
|--- | --- | ---|
| Registro de rota OpenAI (incluindo /v1/responses) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Processador Chat Completions (incluindo detecção de formato Responses) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L70-L462) | 70-462 |
| Processador /v1/completions e /v1/responses (normalização Codex/Responses + retry/rotação) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L464-L1080) | 464-1080 |
| Retorno de /v1/models (lista de modelos dinâmica) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L1082-L1102) | 1082-1102 |
| Estrutura de dados de solicitação OpenAI (messages/instructions/input/size/quality) | [`src-tauri/src/proxy/mappers/openai/models.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/models.rs#L7-L38) | 7-38 |
|--- | --- | ---|
|--- | --- | ---|
| Mapeamento de modelo e prioridade de curinga (exato > curinga > padrão) | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L180-L228) | 180-228 |
|--- | --- | ---|

**Constantes principais**:
- `MAX_RETRY_ATTEMPTS = 3`: número máximo de tentativas de protocolo OpenAI (incluindo rotação) (veja `src-tauri/src/proxy/handlers/openai.rs`)

**Funções principais**:
- `transform_openai_request(...)`: converte corpo de solicitação OpenAI em solicitação upstream interna (veja `src-tauri/src/proxy/mappers/openai/request.rs`)
- `transform_openai_response(...)`: converte resposta upstream em `choices`/`usage` do OpenAI (veja `src-tauri/src/proxy/mappers/openai/response.rs`)

</details>
