---
title: "Tabela Rápida de Endpoints: Visão Geral de Rotas HTTP | Antigravity-Manager"
sidebarTitle: "Verifique todas as rotas em segundos"
subtitle: "Tabela Rápida de Endpoints: Visão Geral de Rotas HTTP Externas"
description: "Aprenda a distribuição de endpoints HTTP do gateway Antigravity. Através de tabela对照 OpenAI/Anthropic/Gemini/MCP rotas, domine modo de autenticação e método de uso do Header de API Key."
tags:
  - "tabela rápida de endpoints"
  - "referência de API"
  - "OpenAI"
  - "Anthropic"
  - "Gemini"
prerequisite:
  - "start-getting-started"
order: 1
---
# Tabela Rápida de Endpoints: Visão Geral de Rotas HTTP Externas

## O que você poderá fazer após concluir

- Localizar rapidamente o caminho do endpoint que precisa chamar
- Entender a distribuição de endpoints de diferentes protocolos
- Entender modo de autenticação e regras especiais de verificação de saúde

## Visão geral de endpoints

O serviço de proxy reverso local das Antigravity Tools fornece as seguintes classes de endpoints:

| Classificação de protocolo | Uso | Cliente típico |
|--- | --- | ---|
| **Protocolo OpenAI** | Compatibilidade de aplicativo AI geral | OpenAI SDK / clientes compatíveis |
| **Protocolo Anthropic** | Chamadas série Claude | Claude Code / Anthropic SDK |
| **Protocolo Gemini** | SDK oficial Google | Google Gemini SDK |
| **Endpoints MCP** | Aprimoramento de chamada de ferramenta | Cliente MCP |
| **Interno/Auxiliar** | Verificação de saúde, interceptação/capacidade interna | Scripts de automação / monitoramento de vivacidade |

---

## Endpoints do Protocolo OpenAI

Estes endpoints são compatíveis com formato de API OpenAI, adequados para a maioria dos clientes que suportam OpenAI SDK.

| Método | Caminho | Entrada de rota (handler Rust) | Nota |
|--- | --- | --- | ---|
| GET | `/v1/models` | `handlers::openai::handle_list_models` | OpenAI compatível: lista de modelos |
| POST | `/v1/chat/completions` | `handlers::openai::handle_chat_completions` | OpenAI compatível: Chat Completions |
| POST | `/v1/completions` | `handlers::openai::handle_completions` | OpenAI compatível: Completions legado |
| POST | `/v1/responses` | `handlers::openai::handle_completions` | OpenAI compatível: solicitações CLI Codex (mesmo handler que `/v1/completions`) |
| POST | `/v1/images/generations` | `handlers::openai::handle_images_generations` | OpenAI compatível: Images Generations |
| POST | `/v1/images/edits` | `handlers::openai::handle_images_edits` | OpenAI compatível: Images Edits |
| POST | `/v1/audio/transcriptions` | `handlers::audio::handle_audio_transcription` | OpenAI compatível: Audio Transcriptions |

::: tip Dica de compatibilidade
Endpoint `/v1/responses` é desenhado especificamente para CLI Codex, usa a mesma lógica de processamento que `/v1/completions`.
:::

---

## Endpoints do Protocolo Anthropic

Estes endpoints são organizados por caminho e formato de solicitação da API Anthropic, usados por Claude Code / Anthropic SDK.

| Método | Caminho | Entrada de rota (handler Rust) | Nota |
|--- | --- | --- | ---|
| POST | `/v1/messages` | `handlers::claude::handle_messages` | Anthropic compatível: Messages |
| POST | `/v1/messages/count_tokens` | `handlers::claude::handle_count_tokens` | Anthropic compatível: count_tokens |
| GET | `/v1/models/claude` | `handlers::claude::handle_list_models` | Anthropic compatível: lista de modelos |

---

## Endpoints do Protocolo Gemini

Estes endpoints são compatíveis com formato de API do Google Gemini, podem usar SDK oficial do Google diretamente.

| Método | Caminho | Entrada de rota (handler Rust) | Nota |
|--- | --- | --- | ---|
| GET | `/v1beta/models` | `handlers::gemini::handle_list_models` | Gemini nativo: lista de modelos |
| GET | `/v1beta/models/:model` | `handlers::gemini::handle_get_model` | Gemini nativo: GetModel |
| POST | `/v1beta/models/:model` | `handlers::gemini::handle_generate` | Gemini nativo: generateContent / streamGenerateContent |
| POST | `/v1beta/models/:model/countTokens` | `handlers::gemini::handle_count_tokens` | Gemini nativo: countTokens |

::: warning Descrição de caminho
`/v1beta/models/:model` registra simultaneamente GET e POST no mesmo caminho (ver definição de rota).
:::

---

## Endpoints MCP

Endpoints MCP (Model Context Protocol) são usados para expor interfaces de "chamada de ferramenta" externamente (processados por `handlers::mcp::*`). Se habilitado e comportamento específico depende da configuração; detalhes veja [Endpoints MCP](../../platforms/mcp/).

| Método | Caminho | Entrada de rota (handler Rust) | Nota |
|--- | --- | --- | ---|
| ANY | `/mcp/web_search_prime/mcp` | `handlers::mcp::handle_web_search_prime` | MCP: Web Search Prime |
| ANY | `/mcp/web_reader/mcp` | `handlers::mcp::handle_web_reader` | MCP: Web Reader |
| ANY | `/mcp/zai-mcp-server/mcp` | `handlers::mcp::handle_zai_mcp_server` | MCP: z.ai MCP Server |

::: details Descrição relacionada a MCP
Escopo e limite da disponibilidade do MCP, consulte [Limites de capacidade de integração z.ai (implementado vs não implementado explicitamente)](../zai-boundaries/).
:::

---

## Endpoints Internos e Auxiliares

Estes endpoints são usados para funções internas do sistema e monitoramento externo.

| Método | Caminho | Entrada de rota (handler Rust) | Nota |
|--- | --- | --- | ---|
| POST | `/internal/warmup` | `handlers::warmup::handle_warmup` | Endpoint de preaquecimento interno |
| POST | `/v1/api/event_logging` | `silent_ok_handler` | Interceptação de log de telemetria: retorna diretamente 200 |
| POST | `/v1/api/event_logging/batch` | `silent_ok_handler` | Interceptação de log de telemetria: retorna diretamente 200 |
| GET | `/healthz` | `health_check_handler` | Verificação de saúde: retorna `{"status":"ok"}` |
| POST | `/v1/models/detect` | `handlers::common::handle_detect_model` | Detecção automática de modelo |

::: tip Processamento silencioso
Endpoints de log de eventos retornam diretamente `200 OK`, sem processamento real, usado para interceptar relatórios de telemetria do cliente.
:::

::: warning Estes endpoints precisam de API Key?
Exceto `GET /healthz` que pode ser isento, se outras rotas precisam carregar chave depende do "modo válido" de `proxy.auth_mode` (veja abaixo "Modo de autenticação" e `auth_middleware` no código-fonte).
:::

---

## Modo de autenticação

Permissões de acesso de todos os endpoints são controladas por `proxy.auth_mode`:

| Modo | Descrição | `/healthz` requer autenticação? | Outros endpoints requerem autenticação? |
|--- | --- | --- | ---|
| `off` | Completamente aberto | ❌ Não | ❌ Não |
| `strict` | Todos requerem autenticação | ✅ Sim | ✅ Sim |
| `all_except_health` | Apenas verificação de saúde aberta | ❌ Não | ✅ Sim |
| `auto` | Julgamento automático (padrão) | ❌ Não | Depende de `allow_lan_access` |

::: info Lógica de modo auto
`auto` não é uma estratégia independente, mas derivada da configuração: quando `proxy.allow_lan_access=true` é equivalente a `all_except_health`, caso contrário equivalente a `off` (ver `docs/proxy/auth.md`).
:::

**Formato de solicitação autenticada**:

::: code-group

```bash [macOS/Linux]
 # Authorization: Bearer
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1/messages"

 # x-api-key (estilo OpenAI)
curl -H "x-api-key: YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1/chat/completions"

 # x-goog-api-key (estilo Gemini)
curl -H "x-goog-api-key: YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1beta/models/gemini-2-pro"
```

```powershell [Windows]
 # Authorization: Bearer
curl.exe -H "Authorization: Bearer YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1/messages"

 # x-api-key (estilo OpenAI)
curl.exe -H "x-api-key: YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1/chat/completions"

 # x-goog-api-key (estilo Gemini)
curl.exe -H "x-goog-api-key: YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1beta/models/gemini-2-pro"
```

:::

---

## Resumo desta seção

As Antigravity Tools fornecem um conjunto completo de endpoints compatíveis com múltiplos protocolos, suportando três formatos principais de API OpenAI, Anthropic, Gemini, além de extensões de chamada de ferramenta MCP.

- **Acesso rápido**: use prioritariamente endpoints de protocolo OpenAI, compatibilidade mais forte
- **Função nativa**: ao precisar de funcionalidade completa do Claude Code use endpoints de protocolo Anthropic
- **Ecossistema Google**: use endpoints de protocolo Gemini ao usar SDK oficial do Google
- **Configuração de segurança**: escolha modo de autenticação adequado conforme cenário (local/LAN/pública)

---

## Próxima seção

> Na próxima seção, aprenderemos **[Dados e Modelos](../storage-models/)**.
>
> Você aprenderá:
> - Estrutura de armazenamento de arquivos de conta
> - Estrutura de tabela de biblioteca de estatística SQLite
> - Métricas de campo-chave e estratégia de backup

---

## Apêndice: Referências de código-fonte

<details>
<summary><strong>Clique para expandir e ver localizações do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| Registro de rota (todos os endpoints) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Middleware de autenticação (compatibilidade de Header + isenção `/healthz` + liberar OPTIONS) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| Modo auth_mode e regra derivada de auto | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L9-L24) | 9-24 |
| Retorno de `/healthz` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| Interceptação de log de telemetria (silencioso 200) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L274-L277) | 274-277 |

**Funções-chave**:
- `AxumServer::start()`: iniciar servidor Axum e registrar rotas (linhas 79-254)
- `health_check_handler()`: processamento de verificação de saúde (linhas 266-272)
- `silent_ok_handler()`: processamento de sucesso silencioso (linhas 274-277)

</details>
