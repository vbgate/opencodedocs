---
title: "Endpoints MCP: Expor Ferramentas | Antigravity-Manager"
sidebarTitle: "Deixe Claude usar capacidades do z.ai"
subtitle: "Endpoints MCP: Expor Web Search/Reader/Vision como ferramentas chamáveis"
description: "Aprenda configuração de endpoints MCP do Antigravity Manager. Ative Web Search/Reader/Vision, verifique chamadas de ferramenta, conecte clientes externos, domine métodos comuns de solução de problemas."
tags:
  - "MCP"
  - "Web Search"
  - "Web Reader"
  - "Vision"
  - "z.ai"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 6
---
# Endpoints MCP: Expor Web Search/Reader/Vision como Ferramentas Chamáveis

Você usará estes **Endpoints MCP** para expor capacidades de busca, leitura e visual do z.ai para clientes MCP externos, focando em entender diferença entre "proxy remoto reverso" e "servidor integrado", e como ativar e chamar esses endpoints.

## O que você poderá fazer após concluir

- Entender princípios de funcionamento de três tipos de endpoints MCP (proxy remoto reverso vs servidor integrado)
- Ativar endpoints Web Search/Web Reader/Vision MCP nas Antigravity Tools
- Deixar clientes MCP externos (como Claude Desktop, Cursor) chamar essas capacidades através do gateway local
- Dominar gerenciamento de sessão (Vision MCP) e modelo de autenticação

## Seu dilema atual

Muitas ferramentas de AI começam a suportar MCP (Model Context Protocol), mas precisam configurar API Key e URL de upstream. O servidor MCP do z.ai também fornece capacidades poderosas (busca, leitura, análise visual), mas configurar diretamente significa expor chave do z.ai em cada cliente.

A solução das Antigravity Tools é: no nível de gateway local gerenciar uniformemente chave do z.ai, expor endpoints MCP, clientes só precisam conectar gateway local, não precisam saber chave do z.ai.

## Quando usar esta estratégia

- Você tem múltiplos clientes MCP (Claude Desktop, Cursor, ferramentas próprias), quer usar um conjunto de chaves do z.ai uniformemente
- Você quer expor capacidades Web Search/Web Reader/Vision do z.ai como ferramentas para AI usar
- Você não quer configurar e rotacionar chave do z.ai em múltiplos lugares

## 🎒 Preparação antes de começar

::: warning Pré-requisitos
- Você já iniciou serviço de proxy reverso na página "API Proxy" das Antigravity Tools
- Você já obteve chave de API do z.ai (do console do z.ai)
- Você sabe a porta do proxy (padrão `8045`)
:::

::: info O que é MCP?
MCP (Model Context Protocol) é um protocolo aberto, permitindo que clientes AI chamem ferramentas/fontes de dados externas.

Fluxo de interação MCP típico:
1. Cliente (como Claude Desktop) envia solicitação `tools/list` para servidor MCP, obtém lista de ferramentas disponíveis
2. Cliente seleciona ferramenta com base no contexto, envia solicitação `tools/call`
3. Servidor MCP executa ferramenta e retorna resultado (texto, imagem, dados etc.)

As Antigravity Tools fornecem três tipos de endpoints MCP:
- **Proxy remoto reverso**: encaminha diretamente para servidor MCP do z.ai (Web Search/Web Reader)
- **Servidor integrado**: implementa protocolo JSON-RPC 2.0 internamente, processa chamadas de ferramenta (Vision)
:::

## O que são endpoints MCP?

**Endpoints MCP** são um conjunto de rotas HTTP expostas pelas Antigravity Tools, permitindo que clientes MCP externos chamem capacidades do z.ai, enquanto o Antigravity Tools gerencia uniformemente autenticação e configuração.

### Classificação de endpoints

| Tipo de endpoint | Método de implementação | Caminho local | Alvo upstream |
|--- | --- | --- | ---|
| **Web Search** | Proxy remoto reverso | `/mcp/web_search_prime/mcp` | `https://api.z.ai/api/mcp/web_search_prime/mcp` |
| **Web Reader** | Proxy remoto reverso | `/mcp/web_reader/mcp` | `https://api.z.ai/api/mcp/web_reader/mcp` |
| **Vision MCP** | Servidor integrado (JSON-RPC 2.0) | `/mcp/zai-mcp-server/mcp` | Chamada interna de API PaaS do z.ai |

### Diferenças-chave

::: info Proxy remoto reverso vs Servidor integrado
**Proxy remoto reverso** (Web Search/Web Reader):
- Proxy manterá parte de cabeçalhos de solicitação (`content-type`, `accept`, `user-agent`) e injetará cabeçalho `Authorization`
- Proxy encaminhará corpo de resposta e código de status do upstream, mas só manterá cabeçalho de resposta `CONTENT_TYPE`
- Sem estado, não precisa gerenciamento de sessão

**Servidor integrado** (Vision MCP):
- Implementa completamente protocolo JSON-RPC 2.0 (`initialize`, `tools/list`, `tools/call`)
- Com estado: cria sessão (`mcp-session-id`), endpoint GET retorna SSE keepalive
- Lógica de ferramenta implementada localmente, chama API PaaS do z.ai para executar análise visual
:::

## Ideia central

Endpoints MCP das Antigravity Tools seguem os seguintes princípios de design:

1. **Autenticação unificada**: gerenciada pelo Antigravity, chave do z.ai, clientes não precisam configurar
2. **Com interruptor**: três endpoints podem ser ativados/desativados independentemente
3. **Isolamento de sessão**: Vision MCP usa `mcp-session-id` para isolar clientes diferentes
4. **Erro transparente**: corpo de resposta e código de status do upstream serão encaminhados como estão (cabeçalhos serão filtrados)

### Modelo de autenticação

```
Cliente MCP → Proxy local do Antigravity → Upstream do z.ai
               ↓
           [Opcional] proxy.auth_mode
               ↓
           [Auto] Injeta chave do z.ai
```

Middleware de proxy das Antigravity Tools (`src-tauri/src/proxy/middleware/auth.rs`) verificará `proxy.auth_mode`, se autenticação ativada, cliente precisa trazer API Key.

**Importante**: não importa `proxy.auth_mode`, chave do z.ai é injetada automaticamente pelo proxy, clientes não precisam configurar.

## Siga-me

### Passo 1: Configurar z.ai e ativar funcionalidade MCP

**Por que**
Primeiro confirme que configuração básica do z.ai está correta, depois ative endpoints MCP um por um.

1. Abra Antigravity Tools, entre na página **API Proxy**
2. Encontre cartão **Configuração z.ai**, clique para expandir
3. Configure os seguintes campos:

```yaml
 # Configuração z.ai
base_url: "https://api.z.ai/api/anthropic"  # Endpoint compatível Anthropic do z.ai
api_key: "seu-z.ai-api-key"               # Obtido do console do z.ai
enabled: true                              # Ativar z.ai
```

4. Encontre sub-cartão **Configuração MCP**, configure:

```yaml
 # Configuração MCP
enabled: true                              # Ativar interruptor total MCP
web_search_enabled: true                    # Ativar Web Search
web_reader_enabled: true                    # Ativar Web Reader
vision_enabled: true                        # Ativar Vision MCP
```

**Você deve ver**: Após salvar configuração, aparecerá lista de "endpoints MCP locais" na parte inferior da página, mostrando URLs completas de três endpoints.

### Passo 2: Verificar endpoint Web Search

**Por que**
Web Search é proxy remoto reverso, mais simples, adequado para verificar configuração básica primeiro.

```bash
 # 1) Primeiro listar ferramentas fornecidas pelo endpoint Web Search (nome de ferramenta conforme retorno real)
curl -X POST http://127.0.0.1:8045/mcp/web_search_prime/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 1
  }'
```

**Você deve ver**: Retornar uma resposta JSON contendo lista `tools`.

::: tip Continue verificando tools/call (opcional)
Após obter `tools[].name` e `tools[].inputSchema`, você pode costurar solicitação `tools/call` conforme schema (parâmetros conforme schema, não adivinhar campos).
:::

::: tip Endpoint não encontrado?
Se receber `404 Not Found`, verifique:
1. `proxy.zai.mcp.enabled` é `true`
2. `proxy.zai.mcp.web_search_enabled` é `true`
3. Serviço de proxy está rodando
:::

### Passo 3: Verificar endpoint Web Reader

**Por que**
Web Reader também é proxy remoto reverso, mas parâmetros e formato de retorno diferentes, verificar se proxy pode processar diferentes endpoints corretamente.

```bash
 # 2) Listar ferramentas fornecidas pelo endpoint Web Reader
curl -X POST http://127.0.0.1:8045/mcp/web_reader/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 2
  }'
```

**Você deve ver**: Retornar uma resposta JSON contendo lista `tools`.

### Passo 4: Verificar endpoint Vision MCP (gerenciamento de sessão)

**Por que**
Vision MCP é servidor integrado, tem estado de sessão, precisa primeiro `initialize`, depois chamar ferramenta.

#### 4.1 Inicializar sessão

```bash
 # 1) Enviar solicitação initialize
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05"
    },
    "id": 1
  }'
```

**Você deve ver**: Resposta contém cabeçalho `mcp-session-id`, salve este ID.

```json
{
  "jsonrpc": "2.0",
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": { "tools": {} },
    "serverInfo": {
      "name": "zai-mcp-server",
      "version": "<app-version>"
    }
  },
  "id": 1
}
```

::: info Lembrete
`serverInfo.version` vem de Rust `env!("CARGO_PKG_VERSION")`, conforme versão instalada na sua máquina.
:::

Cabeçalhos de resposta:
```
mcp-session-id: uuid-v4-string
```

#### 4.2 Obter lista de ferramentas

```bash
 # 2) Enviar solicitação tools/list (trazendo ID da sessão)
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: seu-id-de-sessão" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 2
  }'
```

**Você deve ver**: Retornar definições de 8 ferramentas (`ui_to_artifact`, `extract_text_from_screenshot`, `diagnose_error_screenshot` etc.).

#### 4.3 Chamar ferramenta

```bash
 # 3) Chamar ferramenta analyze_image
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: seu-id-de-sessão" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "analyze_image",
      "arguments": {
        "image_source": "https://example.com/image.jpg",
        "prompt": "Descreva o conteúdo desta imagem"
      }
    },
    "id": 3
  }'
```

**Você deve ver**: Retornar descrição textual do resultado de análise de imagem.

::: danger ID de sessão é importante
Todas as solicitações do Vision MCP (exceto `initialize`) devem trazer cabeçalho `mcp-session-id`.

ID de sessão é retornado na resposta de `initialize`, solicitações subsequentes devem usar o mesmo ID. Após perder sessão precisa reinicializar.
:::

### Passo 5: Testar SSE keepalive (opcional)

**Por que**
Endpoint GET do Vision MCP retorna stream SSE (Server-Sent Events), usado para manter conexão ativa.

```bash
 # 4) Chamar endpoint GET (obter stream SSE)
curl -N http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "mcp-session-id: seu-id-de-sessão"
```

**Você deve ver**: A cada 15 segundos receber mensagem `event: ping`, formato:

```
event: ping
data: keepalive

event: ping
data: keepalive
...
```

## Ponto de verificação ✅

### Verificação de configuração

- [ ] `proxy.zai.enabled` é `true`
- [ ] `proxy.zai.api_key` configurado (não vazio)
- [ ] `proxy.zai.mcp.enabled` é `true`
- [ ] Pelo menos um endpoint MCP ativado (`web_search_enabled` / `web_reader_enabled` / `vision_enabled`)
- [ ] Serviço de proxy está rodando

### Verificação de funcionalidade

- [ ] Endpoint Web Search retorna resultados de busca
- [ ] Endpoint Web Reader retorna conteúdo de página
- [ ] Endpoint Vision MCP `initialize` com sucesso e obtém `mcp-session-id`
- [ ] Endpoint Vision MCP retorna lista de ferramentas (8 ferramentas)
- [ ] Endpoint Vision MCP chama ferramenta com sucesso e retorna resultado

## Consulta rápida de ferramentas Vision MCP

| Nome da ferramenta | Função | Parâmetros obrigatórios | Cenário de exemplo |
|--- | --- | --- | ---|
| `ui_to_artifact` | Converter screenshot UI em código/prompt/especificação/descrição | `image_source`, `output_type`, `prompt` | Gerar código front-end a partir de design |
| `extract_text_from_screenshot` | Extrair texto/código de screenshot (semelhante OCR) | `image_source`, `prompt` | Ler logs de erro em screenshot |
| `diagnose_error_screenshot` | Diagnosticar screenshot de erro (stack trace, logs) | `image_source`, `prompt` | Analisar erro de tempo de execução |
| `understand_technical_diagram` | Analisar diagrama/arquitetura/fluxo/UML/ER | `image_source`, `prompt` | Entender diagrama de arquitetura do sistema |
| `analyze_data_visualization` | Analisar gráfico/painel | `image_source`, `prompt` | Extrair tendência de painel |
| `ui_diff_check` | Comparar dois screenshots UI e reportar diferenças | `expected_image_source`, `actual_image_source`, `prompt` | Teste de regressão visual |
| `analyze_image` | Análise de imagem genérica | `image_source`, `prompt` | Descrever conteúdo de imagem |
| `analyze_video` | Análise de conteúdo de vídeo | `video_source`, `prompt` | Analisar cena de vídeo |

::: info Descrição de parâmetros
- `image_source`: caminho de arquivo local (como `/tmp/screenshot.png`) ou URL remota (como `https://example.com/image.jpg`)
- `video_source`: caminho de arquivo local ou URL remota (suporta MP4, MOV, M4V)
- `output_type` (`ui_to_artifact`): `code` / `prompt` / `spec` / `description`
:::

## Avisos sobre armadilhas

### 404 Not Found

**Fenômeno**: Chamar endpoint MCP retorna `404 Not Found`.

**Causa**:
1. Endpoint não ativado (`*_enabled` correspondente é `false`)
2. Serviço de proxy não iniciado
3. Caminho URL errado (note prefixo `/mcp/`)

**Solução**:
1. Verifique `proxy.zai.mcp.enabled` e `*_enabled` correspondente
2. Verifique status do serviço de proxy
3. Confirme formato de caminho URL (como `/mcp/web_search_prime/mcp`)

### 400 Bad Request: Missing Mcp-Session-Id

**Fenômeno**: Chamar Vision MCP (exceto `initialize`) retorna `400 Bad Request`.

- Endpoint GET: retorna texto puro `Missing Mcp-Session-Id`
- Endpoint POST: retorna erro JSON-RPC `{"error":{"code":-32000,"message":"Bad Request: missing Mcp-Session-Id"}}`

**Causa**: Cabeçalho de solicitação falta `mcp-session-id` ou ID inválido.

**Solução**:
1. Garanta que solicitação `initialize` foi bem-sucedida, e obteve `mcp-session-id` do cabeçalho de resposta
2. Solicitações subsequentes (`tools/list`, `tools/call`, e keepalive SSE) devem trazer este cabeçalho
3. Se sessão perdida (como reinício de serviço), precisa reinicializar

### z.ai is not configured

**Fenômeno**: Retornar `400 Bad Request`, indicando `z.ai is not configured`.

**Causa**: `proxy.zai.enabled` é `false` ou `api_key` está vazio.

**Solução**:
1. Garanta que `proxy.zai.enabled` é `true`
2. Garanta que `proxy.zai.api_key` foi configurado (não vazio)

### Falha na solicitação upstream

**Fenômeno**: Retornar `502 Bad Gateway` ou erro interno.

**Causa**:
1. Chave de API do z.ai inválida ou expirada
2. Problema de conexão de rede (precisa de proxy upstream)
3. Erro no servidor do z.ai

**Solução**:
1. Verifique se chave de API do z.ai está correta
2. Verifique configuração `proxy.upstream_proxy` (se precisa de proxy para acessar z.ai)
3. Verifique logs para obter informações detalhadas de erro

## Integração com clientes MCP externos

### Exemplo de configuração do Claude Desktop

Arquivo de configuração de cliente MCP do Claude Desktop (`~/.config/claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "antigravity-vision": {
      "command": "node",
      "args": [
        "/caminho/para/mcp-client-wrapper.js",
        "--endpoint",
        "http://127.0.0.1:8045/mcp/zai-mcp-server/mcp"
      ]
    },
    "antigravity-web-search": {
      "command": "node",
      "args": [
        "/caminho/para/mcp-client-wrapper.js",
        "--endpoint",
        "http://127.0.0.1:8045/mcp/web_search_prime/mcp"
      ]
    }
  }
}
```

::: tip Limitações do Claude Desktop
Cliente MCP do Claude Desktop precisa comunicar via `stdio`, se você usar endpoint HTTP diretamente, precisa escrever um script wrapper para converter `stdio` em solicitação HTTP.

Ou use cliente que suporta HTTP MCP (como Cursor).
:::

### Cliente HTTP MCP (como Cursor)

Se cliente suporta HTTP MCP, configure diretamente URL do endpoint:

```yaml
 # Configuração MCP do Cursor
mcpServers:
  - name: antigravity-vision
    url: http://127.0.0.1:8045/mcp/zai-mcp-server/mcp
  - name: antigravity-web-search
    url: http://127.0.0.1:8045/mcp/web_search_prime/mcp
```

## Resumo desta aula

Endpoints MCP das Antigravity Tools expõem capacidades do z.ai como ferramentas chamáveis, divididas em duas categorias:
- **Proxy remoto reverso** (Web Search/Web Reader): encaminhamento simples, sem estado
- **Servidor integrado** (Vision MCP): implementação completa de JSON-RPC 2.0, com gerenciamento de sessão

Pontos-chave:
1. Autenticação unificada: chave do z.ai gerenciada pelo Antigravity, clientes não precisam configurar
2. Com interruptor: três endpoints podem ser ativados/desativados independentemente
3. Isolamento de sessão: Vision MCP usa `mcp-session-id` para isolar clientes
4. Integração flexível: suporta qualquer cliente compatível com protocolo MCP

## Próxima seção

> Na próxima seção, aprenderemos **[Túnel Cloudflared com um clique](/pt/lbjlaq/Antigravity-Manager/platforms/cloudflared/)**.
>
> Você aprenderá:
> - Como instalar e iniciar túnel Cloudflared com um clique
> - Diferença entre modo quick e modo auth
> - Como expor com segurança API local para pública

---

## Apêndice: Referências de código-fonte

<details>
<summary><strong>Clique para expandir e ver localizações do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| Endpoint Web Search | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L115-L135) | 115-135 |
| Endpoint Web Reader | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L137-L157) | 137-157 |
| Endpoint Vision MCP (entrada principal) | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L376-L397) | 376-397 |
| Vision MCP processar initialize | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L271-L293) | 271-293 |
| Vision MCP processar tools/list | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L311-L314) | 311-314 |
| Vision MCP processar tools/call | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L315-L363) | 315-363 |
| Gerenciamento de estado de sessão Vision MCP | [`src-tauri/src/proxy/zai_vision_mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_mcp.rs#L1-L42) | 1-42 |
| Definição de ferramentas Vision MCP | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L166-L271) | 166-271 |
| Implementação de chamada de ferramenta Vision MCP | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L273-L400) | 273-400 |
| Registro de rota | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L157-L169) | 157-169 |
| Middleware de autenticação | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L1-L78) | 1-78 |
| UI de configuração MCP | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1304-L1357) | 1304-1357 |
| Documentação explicativa no repositório | [`docs/zai/mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/mcp.md#L1-L57) | 1-57 |

**Constantes-chave**:
- `ZAI_PAAZ_CHAT_COMPLETIONS_URL = "https://api.z.ai/api/paas/v4/chat/completions"`: endpoint de API PaaS do z.ai (usado para chamada de ferramenta Vision)

**Funções-chave**:
- `handle_web_search_prime()`: processar proxy reverso de endpoint Web Search
- `handle_web_reader()`: processar proxy reverso de endpoint Web Reader
- `handle_zai_mcp_server()`: processar todos os métodos do endpoint Vision MCP (GET/POST/DELETE)
- `mcp_session_id()`: extrair `mcp-session-id` do cabeçalho de solicitação
- `forward_mcp()`: função de encaminhamento MCP genérica (injeta autenticação e encaminha para upstream)
- `tool_specs()`: retorna lista de definições de ferramenta do Vision MCP
- `call_tool()`: executa ferramenta Vision MCP especificada

</details>
