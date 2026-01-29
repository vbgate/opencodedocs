---
title: "Gemini API: Integração de Gateway Local | Antigravity-Manager"
subtitle: "Integração de API Gemini: Faça SDK Google Conectar Diretamente ao Gateway Local"
sidebarTitle: "Conecte Diretamente Gemini Local"
description: "Aprenda integração de gateway local Gemini do Antigravity-Manager. Através de endpoint /v1beta/models, domine chamadas generateContent e streamGenerateContent, e valide com cURL e Python."
tags:
  - "Gemini"
  - "Google SDK"
  - "API Proxy"
  - "v1beta"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 3
---

# Integração de API Gemini: Faça SDK Google Conectar Diretamente ao Gateway Local

## O que você poderá fazer após completar

- Integrar seu cliente usando endpoints nativos Gemini expostos pelo Antigravity Tools (`/v1beta/models/*`)
- Chamar gateway local com caminhos de estilo Google `:generateContent` / `:streamGenerateContent`
- Ao habilitar autenticação de Proxy, entender por que `x-goog-api-key` pode ser usado diretamente

## Seu dilema atual

Você já pode ter rodado proxy reverso local, mas chega em Gemini e começa a travar:

- Google SDK por padrão bate em `generativelanguage.googleapis.com`, como mudar para seu próprio `http://127.0.0.1:<port>`?
- Caminho de Gemini tem dois pontos (`models/<model>:generateContent`), muitos clientes uma vez concatenam se tornam 404
- Você habilitou autenticação de proxy, mas cliente Google não envia `x-api-key`, então sempre 401

## Quando usar esta técnica

- Você quer usar "protocolo nativo Gemini" em vez de camada de compatibilidade OpenAI/Anthropic
- Você já tem cliente de estilo Google/terceiro Gemini, quer migrar para gateway local com menor custo

## 🎒 Preparação antes de começar

::: warning Pré-requisitos
- Você já adicionou pelo menos 1 conta no App (caso contrário backend não consegue obter token upstream)
- Você já iniciou serviço de proxy reverso local, e sabe porta de escuta (padrão usará `8045`)
:::

## Ideia principal

Antigravity Tools expõe caminhos nativos Gemini no servidor Axum local:

- Lista: `GET /v1beta/models`
- Chamada: `POST /v1beta/models/<model>:generateContent`
- Fluxo: `POST /v1beta/models/<model>:streamGenerateContent`

Backend envolverá corpo de solicitação Gemini nativo com estrutura v1internal (injeta `project`, `requestId`, `requestType`, etc.), depois encaminha para endpoint upstream v1internal do Google (e traz token de acesso da conta). (Código-fonte: `src-tauri/src/proxy/mappers/gemini/wrapper.rs`, `src-tauri/src/proxy/upstream/client.rs`)

::: info Por que tutorial recomenda usar 127.0.0.1 para base URL?
Exemplo de integração rápida do App escreve fixo recomendando `127.0.0.1`, razão é "evitar problema de atraso de resolução IPv6 em alguns ambientes". (Código-fonte: `src/pages/ApiProxy.tsx`)
:::

## Siga-me

### Passo 1: Confirme gateway online (/healthz)

**Por que**
Primeiro confirme serviço online, depois investiga problemas de protocolo/autenticação economizará muito tempo.

::: code-group

```bash [macOS/Linux]
curl -s "http://127.0.0.1:8045/healthz"
```

```powershell [Windows]
Invoke-RestMethod "http://127.0.0.1:8045/healthz"
```

:::

**Você deve ver**: Retorna JSON, contendo `{"status":"ok"}` (código-fonte: `src-tauri/src/proxy/server.rs`).

### Passo 2: Liste modelos Gemini (/v1beta/models)

**Por que**
Você precisa primeiro confirmar "ID de modelo exposto externamente" é o que, todos os `<model>` atrás serão baseados nisso.

```bash
curl -s "http://127.0.0.1:8045/v1beta/models" | head
```

**Você deve ver**: Resposta tem array `models`, cada elemento `name` algo como `models/<id>` (código-fonte: `src-tauri/src/proxy/handlers/gemini.rs`).

::: tip Importante
Qual campo usar para ID de modelo?
- ✅ Use campo `displayName` (ex: `gemini-2.0-flash`)
- ✅ Ou de campo `name` remova prefixo `models/`
- ❌ Não copie diretamente valor completo de campo `name` (causará erro de caminho)

Se você copiou campo `name` (ex: `models/gemini-2.0-flash`) como ID de modelo, caminho de solicitação se tornará `/v1beta/models/models/gemini-2.0-flash:generateContent`, isto está errado. (Código-fonte: `src-tauri/src/proxy/common/model_mapping.rs`)
:::

::: warning Importante
Atual `/v1beta/models` é retorno "fingindo lista de modelos dinâmica local como lista de modelos Gemini", não puxa de upstream em tempo real. (Código-fonte: `src-tauri/src/proxy/handlers/gemini.rs`)
:::

### Passo 3: Chame generateContent (caminho com dois pontos)

**Por que**
API REST nativa do Gemini chave é `:generateContent` este tipo de "ação com dois pontos". Backend analisará `model:method` na mesma rota. (Código-fonte: `src-tauri/src/proxy/handlers/gemini.rs`)

```bash
curl -s \
  -H "Content-Type: application/json" \
  -X POST "http://127.0.0.1:8045/v1beta/models/<modelId>:generateContent" \
  -d '{
    "contents": [
      {"role": "user", "parts": [{"text": "Hello"}]}
    ]
  }'
```

**Você deve ver**: Resposta JSON tem `candidates` (ou camada externa tem `response.candidates`, proxy desempacotará).

### Passo 4: Chame streamGenerateContent (SSE)

**Por que**
Fluxo é mais estável para "saída longa/modelo grande"; proxy encaminhará SSE upstream de volta para seu cliente, e definirá `Content-Type: text/event-stream`. (Código-fonte: `src-tauri/src/proxy/handlers/gemini.rs`)

```bash
curl -N \
  -H "Content-Type: application/json" \
  -X POST "http://127.0.0.1:8045/v1beta/models/<modelId>:streamGenerateContent" \
  -d '{
    "contents": [
      {"role": "user", "parts": [{"text": "Tell me a short story"}]}
    ]
  }'
```

**Você deve ver**: Terminal continuamente sai linhas em forma `data: {...}`, normalmente finalmente aparece `data: [DONE]` (indicando fim de fluxo).

::: tip Atenção
`data: [DONE]` é marca padrão de fim SSE, mas **não necessariamente aparece**:
- Se upstream termina normalmente e envia `[DONE]`, proxy encaminhará
- Se upstream anormalmente desconecta, expira ou envia outro sinal de fim, proxy não complementará `[DONE]`

Código de cliente deve tratar por padrão SSE: encontrar `data: [DONE]` ou desconexão devem ser considerados fim de fluxo. (Código-fonte: `src-tauri/src/proxy/handlers/gemini.rs`)
:::

### Passo 5: Use Python Google SDK conectar diretamente ao gateway local

**Por que**
Este é caminho de exemplo "integração rápida" que UI do projeto dá: use pacote Python Google Generative AI apontar `api_endpoint` para seu endereço de proxy reverso local. (Código-fonte: `src/pages/ApiProxy.tsx`)

```python
#Precisa instalar: pip install google-generativeai
import google.generativeai as genai

genai.configure(
    api_key="YOUR_PROXY_API_KEY",
    transport='rest',
    client_options={'api_endpoint': 'http://127.0.0.1:8045'}
)

model = genai.GenerativeModel('<modelId>')
response = model.generate_content("Hello")
print(response.text)
```

**Você deve ver**: Programa sai um trecho de texto de resposta de modelo.

## Ponto de verificação ✅

- `/healthz` consegue retornar `{"status":"ok"}`
- `/v1beta/models` consegue listar modelos (pelo menos 1)
- `:generateContent` consegue retornar `candidates`
- `:streamGenerateContent` retorna `Content-Type: text/event-stream` e consegue sair fluxo continuamente

## Aviso sobre armadilhas

- **401 sempre não passa**: se você habilitou autenticação, mas `proxy.api_key` vazio, backend rejeitará diretamente solicitação. (Código-fonte: `src-tauri/src/proxy/middleware/auth.rs`)
- **O que trazer no Header**: proxy reconhecerá simultaneamente `Authorization`, `x-api-key`, `x-goog-api-key`. Então "cliente de estilo Google só envia `x-goog-api-key`" também pode passar. (Código-fonte: `src-tauri/src/proxy/middleware/auth.rs`)
- **countTokens sempre é 0**: atual `POST /v1beta/models/<model>/countTokens` retorna fixo `{"totalTokens":0}`, é implementação placeholder. (Código-fonte: `src-tauri/src/proxy/handlers/gemini.rs`)

## Resumo da lição

- Você está conectando `/v1beta/models/*`, não `/v1/*`
- Escrita de caminho chave é `models/<modelId>:generateContent` / `:streamGenerateContent`
- Ao habilitar autenticação, `x-goog-api-key` é header de solicitação suportado explicitamente pelo proxy

## Próximo aviso de lição

> Na próxima lição aprendemos **[Geração de Imagens Imagen 3: Mapeamento Automático de Parâmetros size/quality de OpenAI Images](../imagen/)**.

---

## Apêndice: Referência de código-fonte

<details>
<summary><strong>Clique para expandir localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do arquivo | Linha |
|--- | --- | ---|
| Registro de rota Gemini (/v1beta/models/*) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L170-L181) | 170-181 |
| Análise de ID de modelo e rota (por que prefixo `models/` causa erro de rota) | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L58-L77) | 58-77 |
| Analisar `model:method` + lógica principal generate/stream | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L14-L337) | 14-337 |
| Lógica de saída de fluxo SSE (encaminha `[DONE]` em vez de complementar automaticamente) | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L161-L183) | 161-183 |
| Estrutura de retorno `/v1beta/models` (fingimento de lista de modelos dinâmica) | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L39-L71) | 39-71 |
| Implementação placeholder `countTokens` (fixo 0) | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L73-L79) | 73-79 |
|--- | --- | ---|
| Exemplo Python SDK Google (`api_endpoint` aponta para gateway local) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L692-L734) | 692-734 |
| Impressão digital de sessão Gemini (session_id para cola/cache) | [`src-tauri/src/proxy/session_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/session_manager.rs#L121-L158) | 121-158 |
| Empacotamento v1internal de solicitação Gemini (injeta project/requestId/requestType etc) | [`src-tauri/src/proxy/mappers/gemini/wrapper.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/gemini/wrapper.rs#L5-L160) | 5-160 |
| Endpoint upstream v1internal e fallback | [`src-tauri/src/proxy/upstream/client.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/upstream/client.rs#L8-L182) | 8-182 |

**Constantes principais**:
- `MAX_RETRY_ATTEMPTS = 3`: limite máximo de número de rotação de solicitação Gemini (código-fonte: `src-tauri/src/proxy/handlers/gemini.rs`)

</details>
