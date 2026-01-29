---
title: "Integração z.ai: Explicação de Limites de Capacidade | Antigravity-Manager"
sidebarTitle: "Verificação rápida de limites z.ai"
subtitle: "Integração z.ai: Explicação de Limites de Capacidade"
description: "Domine os limites de integração z.ai das Antigravity Tools. Entenda roteamento de solicitação, distribuição dispatch_mode, mapeamento de modelo, estratégia de segurança de Header, e MCP proxy e limitações, evitando julgamentos errados."
tags:
  - "z.ai"
  - "MCP"
  - "Claude"
  - "limites de capacidade"
prerequisite:
  - "start-getting-started"
  - "platforms-mcp"
order: 3
---
# Limites de Capacidade de Integração z.ai (Implementado vs Não Implementado Explicitamente)

Este documento só fala dos "limites" do z.ai nas Antigravity Tools, não "como conectar". Se você descobrir que certo recurso não entrou em vigor, primeiro compare aqui: é porque não foi ativado, não configurado, ou simplesmente não foi implementado.

## O que você poderá fazer após concluir

- Julgar se deve esperar z.ai: quais são "implementados", quais são "documentados explicitamente como não feitos"
- Entender claramente quais endpoints z.ai afeta (e quais endpoints não são afetados absolutamente)
- Ver evidência de código-fonte/documento para cada conclusão (com links de número de linha do GitHub), conveniente para você próprio revisar

## Seu dilema atual

Você pode ter aberto o z.ai nas Antigravity Tools, mas ao usar encontrou esses confusões:

- Por que algumas solicitações vão para z.ai, outras não vão absolutamente?
- O endpoint MCP pode ser tratado como "Servidor MCP completo"?
- Interruptores que você vê na UI, realmente correspondem a implementação real?

## O que é integração z.ai (neste projeto)?

**Integração z.ai** nas Antigravity Tools é um "provedor upstream + extensão MCP" opcional. Só em condições específicas intercepta solicitações de protocolo Claude, e fornece proxy de MCP Search/Reader e um servidor Vision MCP integrado mínimo; não é uma solução de substituição completa de todos os protocolos/capacidades.

::: info Lembre-se de uma frase
Você pode tratar z.ai como "provedor upstream opcional para solicitações Claude + um conjunto de endpoints MCP com interruptores", não trate como "trazer todas as capacidades do z.ai completamente".
:::

## Implementado: estável e disponível (baseado em código-fonte)

### 1) Apenas protocolo Claude vai para z.ai (/v1/messages + /v1/messages/count_tokens)

Encaminhamento upstream Anthropic do z.ai só acontece no ramo z.ai do handler Claude:

- `POST /v1/messages`: quando `use_zai=true` chama `forward_anthropic_json(...)` para encaminhar solicitação JSON para endpoint compatível Anthropic do z.ai
- `POST /v1/messages/count_tokens`: quando z.ai ativado também encaminha; caso contrário retorna placeholder `{input_tokens:0, output_tokens:0}`

Evidência:

- Seleção de ramo z.ai e entrada de encaminhamento: [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L256-L374)
- Ramo z.ai de count_tokens e retorno de placeholder: [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1209)
- Implementação de encaminhamento Anthropic upstream do z.ai: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L133-L219)

::: tip Como entender "resposta em streaming"?
`forward_anthropic_json` transmitirá corpo de resposta do upstream de volta ao cliente via `bytes_stream()`, não analisa SSE (ver construção de corpo de Response em `providers/zai_anthropic.rs`).
:::

### 2) "Significado real" do modo de escalonamento (dispatch_mode)

`dispatch_mode` decide se `/v1/messages` vai para z.ai:

| dispatch_mode | O que acontece | Evidência |
|--- | --- | ---|
| `off` | Nunca usar z.ai | `src-tauri/src/proxy/config.rs#L20-L37` + `src-tauri/src/proxy/handlers/claude.rs#L282-L314` |
| `exclusive` | Todas as solicitações Claude vão para z.ai | `src-tauri/src/proxy/handlers/claude.rs#L285-L314` |
| `fallback` | Só vai para z.ai quando pool Google indisponível (0 contas ou "nenhuma conta disponível") | `src-tauri/src/proxy/handlers/claude.rs#L288-L305` |
| `pooled` | Trata z.ai como "1 slot extra" participando de polling (não garante necessariamente acerto) | `src-tauri/src/proxy/handlers/claude.rs#L306-L312` |

::: warning Mal-entendido comum de pooled
`pooled` não é "z.ai + pool de contas Google ambos usados, e distribuição estável por peso". No código escreveu explicitamente "no strict guarantees", essencialmente é um slot de polling (só vai para z.ai quando `slot == 0`).
:::

### 3) Mapeamento de modelo: como nomes de modelo Claude se tornam glm-* do z.ai?

Antes de encaminhar para z.ai, se o corpo da solicitação tiver campo `model`, será reescrito:

1. Correspondência exata de `proxy.zai.model_mapping` (simultaneamente suporta string original e chave lower-case)
2. Prefixo `zai:<model>`: remove `zai:` diretamente e usa
3. `glm-*`: mantém inalterado
4. Não `claude-*`: mantém inalterado
5. `claude-*` e contém `opus/haiku`: mapeia para `proxy.zai.models.opus/haiku`; caso contrário padrão `sonnet`

Evidência: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L13-L37), [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L149-L152)

### 4) Estratégia de segurança de Header ao encaminhar (evitando vazar chave de proxy local)

Encaminhamento upstream z.ai não "traz todos os Headers como estão", mas fez duas camadas de defesa:

- Só libera pequena parte de Headers (por exemplo `content-type`, `accept`, `anthropic-version`, `user-agent`)
- Injeta chave de API do z.ai no upstream (prioriza manter método de autenticação usado pelo cliente: `x-api-key` ou `Authorization: Bearer ...`)

Evidência:

- Lista branca de Header: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L89)
- Injetar auth z.ai: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L91-L110)

## Implementado: MCP (proxy Search/Reader + Vision integrado)

### 1) MCP Search/Reader: proxy reverso para endpoint MCP do z.ai

Endpoint local e endereço upstream são codificados:

| Endpoint local | Endereço upstream | Interruptor | Evidência |
|--- | --- | --- | ---|
| `/mcp/web_search_prime/mcp` | `https://api.z.ai/api/mcp/web_search_prime/mcp` | `proxy.zai.mcp.web_search_enabled` | `src-tauri/src/proxy/handlers/mcp.rs#L115-L135` |
| `/mcp/web_reader/mcp` | `https://api.z.ai/api/mcp/web_reader/mcp` | `proxy.zai.mcp.web_reader_enabled` | `src-tauri/src/proxy/handlers/mcp.rs#L137-L157` |

::: info 404 não é "problema de rede"
Enquanto `proxy.zai.mcp.enabled=false`, ou correspondente `web_search_enabled/web_reader_enabled=false`, estes endpoints retornarão diretamente 404.
:::

Evidência:

- Interruptor total de MCP e verificação de chave z.ai: [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L52-L59)
- Registro de rota: [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L157-L169)

### 2) Vision MCP: servidor integrado mínimo "Streamable HTTP MCP"

Vision MCP não é proxy, é implementação integrada local:

- Endpoint: `/mcp/zai-mcp-server/mcp`
- `POST` suporta: `initialize`, `tools/list`, `tools/call`
- `GET` retorna SSE keepalive (requer sessão já inicializada)
- `DELETE` termina sessão

Evidência:

- Entrada principal de handler e despacho de método: [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L376-L397)
- Implementação de `initialize`, `tools/list`, `tools/call`: [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L229-L374)
- Posicionamento de "implementação mínima" do Vision MCP: [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L17-L37)

### 3) Conjunto de ferramentas do Vision MCP (8) e limites de tamanho de arquivo

Lista de ferramentas vem de `tool_specs()`:

- `ui_to_artifact`
- `extract_text_from_screenshot`
- `diagnose_error_screenshot`
- `understand_technical_diagram`
- `analyze_data_visualization`
- `ui_diff_check`
- `analyze_image`
- `analyze_video`

Evidência: [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L166-L270), [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L45-L53)

Arquivos locais serão lidos e codificados em `data:<mime>;base64,...`, com limites rígidos simultaneamente:

- Limite de imagem 5 MB (`image_source_to_content(..., 5)`)
- Limite de vídeo 8 MB (`video_source_to_content(..., 8)`)

Evidência: [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L57-L111)

## Explicitamente não implementado / não espere (baseado em declaração de documento e detalhes de implementação)

### 1) Monitoramento de uso/orçamento z.ai (usage/budget) não implementado

`docs/zai/implementation.md` escreveu explicitamente "not implemented yet". Isso significa:

- Você não pode esperar que as Antigravity Tools forneçam consulta/alerta de uso/orçamento do z.ai
- Governança de cota (Quota Protection) também não lerá automaticamente dados de orçamento/uso do z.ai

Evidência: [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198)

### 2) Vision MCP não é Servidor MCP completo

O Vision MCP atualmente é posicionado como "implementação mínima suficiente para chamada de ferramenta": prompts/resources, resumibilidade, saída de ferramenta em streaming etc. ainda não feitos.

Evidência: [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L34-L36), [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198)

### 3) `/v1/models/claude` não refletirá lista real de modelos do z.ai

Este endpoint retorna lista de modelos do mapeamento integrado e mapeamento personalizado (`get_all_dynamic_models`), não vai solicitar `/v1/models` do upstream z.ai.

Evidência:

- Handler: [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1162-L1183)
- Lógica de geração de lista: [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L84-L132)

## Consulta rápida de campos de configuração (relacionados a z.ai)

Configuração z.ai está em `ProxyConfig.zai`, contendo estes campos:

- `enabled` / `base_url` / `api_key`
- `dispatch_mode` (`off/exclusive/pooled/fallback`)
- `model_mapping` (correspondência exata de substituição)
- `models.{opus,sonnet,haiku}` (mapeamento padrão de família Claude)
- `mcp.{enabled,web_search_enabled,web_reader_enabled,vision_enabled}`

Valores padrão (base_url / modelos padrão) também estão no mesmo arquivo:

- `base_url = "https://api.z.ai/api/anthropic"`
- `opus/sonnet = "glm-4.7"`
- `haiku = "glm-4.5-air"`

Evidência: [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L20-L116), [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L265-L279)

---

## Resumo desta seção

- z.ai atualmente só intercepta protocolo Claude (`/v1/messages` + `count_tokens`), outros endpoints de protocolo não são "automaticamente ir para z.ai"
- MCP Search/Reader é proxy; Vision MCP é implementação mínima integrada, não Servidor MCP completo
- Lista de modelos de `/v1/models/claude` vem de mapeamento local, não representa modelos reais do upstream

---

## Próxima seção

> Na próxima seção, aprenderemos **[Versões](../../changelog/release-notes/)**.

---

## Apêndice: Referências de código-fonte

<details>
<summary><strong>Clique para expandir e ver localizações do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| Escopo de integração z.ai (protocolo Claude + MCP + Vision MCP) | [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L12-L17) | 12-17 |
| Modo de escalonamento z.ai e valores padrão de modelo | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L20-L116) | 20-116 |
| base_url z.ai padrão / modelo padrão | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L265-L279) | 265-279 |
| Lógica de seleção se `/v1/messages` vai para z.ai | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L256-L374) | 256-374 |
| Encaminhamento z.ai de `/v1/messages/count_tokens` e retorno de placeholder | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1209) | 1186-1209 |
| Encaminhamento upstream Anthropic do z.ai (encaminhamento JSON + retorno em streaming de resposta) | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L133-L219) | 133-219 |
| Regras de mapeamento de modelo z.ai (map_model_for_zai) | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L13-L37) | 13-37 |
| Lista branca de Header + injetar auth z.ai | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L110) | 70-110 |
| Proxy MCP Search/Reader e interruptores | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L45-L157) | 45-157 |
|--- | --- | ---|
| Posicionamento de implementação mínima do Vision MCP (não Servidor MCP completo) | [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L17-L37) | 17-37 |
| Lista de ferramentas Vision e limites (tool_specs + tamanho de arquivo + stream=false) | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L57-L270) | 57-270 |
| Origem de lista de modelos `/v1/models/claude` (mapeamento local, não consulta upstream) | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L84-L132) | 84-132 |
| Monitoramento de uso/orçamento não implementado (declaração de documento) | [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198) | 194-198 |

</details>
