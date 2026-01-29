---
title: "Endpoint MCP: Exponer herramientas | Antigravity-Manager"
sidebarTitle: "Permite a Claude usar capacidades de z.ai"
subtitle: "Endpoint MCP: Exponer Web Search/Reader/Vision como herramientas invocables"
description: "Aprende la configuración de endpoints MCP de Antigravity Manager. Habilitar Web Search/Reader/Vision, verificar invocaciones de herramientas, integrar con clientes externos y dominar métodos de solución de problemas comunes."
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
# Endpoint MCP: Exponer Web Search/Reader/Vision como herramientas invocables

Usarás este **endpoint MCP** para exponer las capacidades de búsqueda, lectura y visión de z.ai a clientes MCP externos, enfocándote en comprender la diferencia entre "proxy inverso remoto" y "servidor integrado", y cómo habilitar e invocar estos endpoints.

## Qué puedes hacer al finalizar

- Comprender los principios de funcionamiento de tres tipos de endpoints MCP (proxy inverso remoto vs servidor integrado)
- Habilitar endpoints MCP de Web Search/Web Reader/Vision en Antigravity Tools
- Permitir que clientes MCP externos (como Claude Desktop, Cursor) invoquen estas capacidades a través de la puerta de enlace local
- Dominar la gestión de sesiones (Vision MCP) y el modelo de autenticación

## Tu situación actual

Muchas herramientas de IA están empezando a admitir MCP (Model Context Protocol), pero requieren configurar la API Key y la URL del upstream. El servidor MCP de z.ai también proporciona potentes capacidades (búsqueda, lectura, análisis visual), pero configurarlo directamente significa exponer la clave z.ai en cada cliente.

La solución de Antigravity Tools es: gestionar de manera unificada la clave z.ai a nivel de puerta de enlace local, exponer los endpoints MCP, y los clientes solo necesitan conectarse a la puerta de enlace local sin necesidad de conocer la clave z.ai.

## Cuándo usar este enfoque

- Tienes múltiples clientes MCP (Claude Desktop, Cursor, herramientas personalizadas) y quieres usar de manera unificada una sola clave z.ai
- Deseas exponer las capacidades Web Search/Web Reader/Vision de z.ai como herramientas para uso de la IA
- No quieres configurar y rotar la clave z.ai en múltiples lugares

## 🎒 Preparativos

::: warning Requisitos previos
- Ya has iniciado el servicio de proxy inverso en la página "API Proxy" de Antigravity Tools
- Ya has obtenido la API Key de z.ai (desde la consola de z.ai)
- Conoces el puerto del proxy inverso (por defecto `8045`)
:::

::: info ¿Qué es MCP?
MCP (Model Context Protocol) es un protocolo abierto que permite a los clientes de IA invocar herramientas o fuentes de datos externas.

El flujo típico de interacción MCP:
1. El cliente (por ejemplo, Claude Desktop) envía una solicitud `tools/list` al servidor MCP para obtener la lista de herramientas disponibles
2. El cliente selecciona herramientas según el contexto y envía una solicitud `tools/call`
3. El servidor MCP ejecuta la herramienta y devuelve resultados (texto, imágenes, datos, etc.)

Antigravity Tools proporciona tres tipos de endpoints MCP:
- **Proxy inverso remoto**: reenvía directamente al servidor MCP de z.ai (Web Search/Web Reader)
- **Servidor integrado**: implementa localmente el protocolo JSON-RPC 2.0 y maneja invocaciones de herramientas (Vision)
:::

## ¿Qué es un endpoint MCP?

Un **endpoint MCP** es un conjunto de rutas HTTP expuestas por Antigravity Tools que permiten a clientes MCP externos invocar las capacidades de z.ai, mientras Antigravity Tools gestiona de manera unificada la autenticación y la configuración.

### Clasificación de endpoints

| Tipo de endpoint | Método de implementación | Ruta local | Objetivo upstream |
| --- | --- | --- | --- |
| **Web Search** | Proxy inverso remoto | `/mcp/web_search_prime/mcp` | `https://api.z.ai/api/mcp/web_search_prime/mcp` |
| **Web Reader** | Proxy inverso remoto | `/mcp/web_reader/mcp` | `https://api.z.ai/api/mcp/web_reader/mcp` |
| **Vision MCP** | Servidor integrado (JSON-RPC 2.0) | `/mcp/zai-mcp-server/mcp` | Invocación interna a la API PaaS de z.ai |

### Diferencias clave

::: info Proxy inverso remoto vs Servidor integrado
**Proxy inverso remoto** (Web Search/Web Reader):
- El proxy conserva algunos encabezados de solicitud (`content-type`, `accept`, `user-agent`) e inyecta el encabezado `Authorization`
- El proxy reenvía el cuerpo de respuesta y el código de estado del upstream, pero solo conserva el encabezado de respuesta `CONTENT_TYPE`
- Sin estado, no requiere gestión de sesiones

**Servidor integrado** (Vision MCP):
- Implementación completa del protocolo JSON-RPC 2.0 (`initialize`, `tools/list`, `tools/call`)
- Con estado: crea sesión (`mcp-session-id`), el endpoint GET devuelve keepalive SSE
- La lógica de herramientas se implementa localmente e invoca la API PaaS de z.ai para realizar análisis visual
:::

## Idea central

Los endpoints MCP de Antigravity Tools siguen los siguientes principios de diseño:

1. **Autenticación unificada**: Antigravity gestiona la clave z.ai, los clientes no necesitan configurarla
2. **Conmutable**: los tres endpoints pueden habilitarse/deshabilitarse de manera independiente
3. **Aislamiento de sesiones**: Vision MCP usa `mcp-session-id` para aislar diferentes clientes
4. **Transparencia de errores**: el cuerpo de respuesta y el código de estado del upstream se reenvían sin modificaciones (los encabezados de respuesta se filtran)

### Modelo de autenticación

```
Cliente MCP → Proxy local de Antigravity → Upstream z.ai
                ↓
            [Opcional] proxy.auth_mode
                ↓
            [Automático] Inyectar clave z.ai
```

El middleware de proxy de Antigravity Tools (`src-tauri/src/proxy/middleware/auth.rs`) verificará `proxy.auth_mode`. Si la autenticación está habilitada, el cliente debe llevar una API Key.

**Importante**: independientemente de `proxy.auth_mode`, la clave z.ai se inyecta automáticamente en el proxy, y los clientes no necesitan configurarla.

## Sígueme

### Paso 1: Configurar z.ai y habilitar la funcionalidad MCP

**Por qué**
Asegúrate primero de que la configuración básica de z.ai sea correcta, luego habilita los endpoints MCP uno por uno.

1. Abre Antigravity Tools y ve a la página **API Proxy**
2. Encuentra la tarjeta **z.ai 配置**, haz clic para expandirla
3. Configura los siguientes campos:

```yaml
  # Configuración de z.ai
base_url: "https://api.z.ai/api/anthropic"  # Endpoint de z.ai compatible con Anthropic
api_key: "tu-clave-api-z.ai"               # Obtener desde la consola de z.ai
enabled: true                              # Habilitar z.ai
```

4. Encuentra la subtarjeta **MCP 配置**, configura:

```yaml
  # Configuración MCP
enabled: true                              # Habilitar interruptor principal MCP
web_search_enabled: true                    # Habilitar Web Search
web_reader_enabled: true                    # Habilitar Web Reader
vision_enabled: true                        # Habilitar Vision MCP
```

**Deberías ver**: después de guardar la configuración, aparecerá una lista de "endpoints MCP locales" en la parte inferior de la página, mostrando las URLs completas de los tres endpoints.

### Paso 2: Verificar el endpoint de Web Search

**Por qué**
Web Search es un proxy inverso remoto, el más simple, adecuado para verificar primero la configuración básica.

```bash
  # 1) Primero listar las herramientas proporcionadas por el endpoint Web Search (los nombres de herramientas están sujetos a lo que realmente se devuelva)
curl -X POST http://127.0.0.1:8045/mcp/web_search_prime/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 1
  }'
```

**Deberías ver**: se devuelve una respuesta JSON que contiene una lista `tools`.

::: tip Continuar verificando tools/call (opcional)
Una vez que tengas `tools[].name` y `tools[].inputSchema`, puedes componer la solicitud `tools/call` según el schema (los parámetros se basan en el schema, no adivines los campos).
:::

::: tip ¿Endpoint no encontrado?
Si recibes `404 Not Found`, verifica:
1. Si `proxy.zai.mcp.enabled` es `true`
2. Si `proxy.zai.mcp.web_search_enabled` es `true`
3. Si el servicio de proxy inverso se está ejecutando
:::

### Paso 3: Verificar el endpoint de Web Reader

**Por qué**
Web Reader también es un proxy inverso remoto, pero sus parámetros y formato de retorno son diferentes, verifica que el proxy pueda manejar correctamente diferentes endpoints.

```bash
  # 2) Listar las herramientas proporcionadas por el endpoint Web Reader
curl -X POST http://127.0.0.1:8045/mcp/web_reader/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 2
  }'
```

**Deberías ver**: se devuelve una respuesta JSON que contiene una lista `tools`.

### Paso 4: Verificar el endpoint de Vision MCP (gestión de sesiones)

**Por qué**
Vision MCP es un servidor integrado con estado de sesión, primero necesitas `initialize`, luego invocar herramientas.

#### 4.1 Inicializar sesión

```bash
  # 1) Enviar solicitud initialize
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

**Deberías ver**: la respuesta contiene el encabezado `mcp-session-id`, guarda este ID.

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

::: info Recordatorio
`serverInfo.version` proviene de `env!("CARGO_PKG_VERSION")` de Rust, sujeta a la versión real instalada en tu máquina.
:::

Encabezados de respuesta:
```
mcp-session-id: uuid-v4-string
```

#### 4.2 Obtener lista de herramientas

```bash
  # 2) Enviar solicitud tools/list (con ID de sesión)
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: tu-id-de-sesión" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 2
  }'
```

**Deberías ver**: se devuelven las definiciones de 8 herramientas (`ui_to_artifact`, `extract_text_from_screenshot`, `diagnose_error_screenshot`, etc.).

#### 4.3 Invocar herramienta

```bash
  # 3) Invocar herramienta analyze_image
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: tu-id-de-sesión" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "analyze_image",
      "arguments": {
        "image_source": "https://example.com/image.jpg",
        "prompt": "Describe el contenido de esta imagen"
      }
    },
    "id": 3
  }'
```

**Deberías ver**: se devuelve la descripción textual del resultado del análisis de imagen.

::: danger Importancia del ID de sesión
Todas las solicitudes de Vision MCP (excepto `initialize`) deben llevar el encabezado `mcp-session-id`.

El ID de sesión se devuelve en la respuesta `initialize`, las solicitudes posteriores deben usar el mismo ID. Si se pierde la sesión, necesitas `initialize` nuevamente.
:::

### Paso 5: Probar keepalive SSE (opcional)

**Por qué**
El endpoint GET de Vision MCP devuelve un flujo SSE (Server-Sent Events) para mantener la conexión activa.

```bash
  # 4) Invocar endpoint GET (obtener flujo SSE)
curl -N http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "mcp-session-id: tu-id-de-sesión"
```

**Deberías ver**: recibir un mensaje `event: ping` cada 15 segundos, con el siguiente formato:

```
event: ping
data: keepalive

event: ping
data: keepalive
...
```

## Punto de control ✅

### Verificación de configuración

- [ ] `proxy.zai.enabled` es `true`
- [ ] `proxy.zai.api_key` está configurado (no vacío)
- [ ] `proxy.zai.mcp.enabled` es `true`
- [ ] Al menos un endpoint MCP está habilitado (`web_search_enabled` / `web_reader_enabled` / `vision_enabled`)
- [ ] El servicio de proxy inverso se está ejecutando

### Verificación de funcionalidad

- [ ] El endpoint Web Search devuelve resultados de búsqueda
- [ ] El endpoint Web Reader devuelve contenido web
- [ ] El endpoint Vision MCP inicializa con éxito y obtiene `mcp-session-id`
- [ ] El endpoint Vision MCP devuelve lista de herramientas (8 herramientas)
- [ ] El endpoint Vision MCP invoca con éxito herramientas y devuelve resultados

## Referencia rápida de herramientas Vision MCP

| Nombre de herramienta | Función | Parámetros requeridos | Escenario de ejemplo |
| --- | --- | --- | --- |
| `ui_to_artifact` | Convertir captura de UI a código/prompt/especificación/descripción | `image_source`, `output_type`, `prompt` | Generar código frontend desde diseño |
| `extract_text_from_screenshot` | Extraer texto/código de captura (similar a OCR) | `image_source`, `prompt` | Leer captura de registro de errores |
| `diagnose_error_screenshot` | Diagnosticar captura de error (stack trace, logs) | `image_source`, `prompt` | Analizar error en tiempo de ejecución |
| `understand_technical_diagram` | Analizar diagramas de arquitectura/flujo/UML/ER | `image_source`, `prompt` | Comprender diagrama de arquitectura del sistema |
| `analyze_data_visualization` | Analizar gráficos/tableros | `image_source`, `prompt` | Extraer tendencias desde tablero |
| `ui_diff_check` | Comparar dos capturas de UI y reportar diferencias | `expected_image_source`, `actual_image_source`, `prompt` | Pruebas de regresión visual |
| `analyze_image` | Análisis de imagen general | `image_source`, `prompt` | Describir contenido de imagen |
| `analyze_video` | Análisis de contenido de video | `video_source`, `prompt` | Analizar escenas de video |

::: info Descripción de parámetros
- `image_source`: ruta de archivo local (ej. `/tmp/screenshot.png`) o URL remota (ej. `https://example.com/image.jpg`)
- `video_source`: ruta de archivo local o URL remota (soporta MP4, MOV, M4V)
- `output_type` (para `ui_to_artifact`): `code` / `prompt` / `spec` / `description`
:::

## Advertencias sobre problemas comunes

### 404 Not Found

**Síntoma**: invocar endpoint MCP devuelve `404 Not Found`.

**Causas**:
1. El endpoint no está habilitado (`*_enabled` correspondiente es `false`)
2. El servicio de proxy inverso no se ha iniciado
3. Ruta URL incorrecta (nota el prefijo `/mcp/`)

**Soluciones**:
1. Verificar configuración `proxy.zai.mcp.enabled` y `*_enabled` correspondiente
2. Verificar estado del servicio de proxy inverso
3. Confirmar formato de ruta URL (ej. `/mcp/web_search_prime/mcp`)

### 400 Bad Request: Missing Mcp-Session-Id

**Síntoma**: invocar Vision MCP (excepto `initialize`) devuelve `400 Bad Request`.

- Endpoint GET: devuelve texto plano `Missing Mcp-Session-Id`
- Endpoint POST: devuelve error JSON-RPC `{"error":{"code":-32000,"message":"Bad Request: missing Mcp-Session-Id"}}`

**Causa**: la solicitud falta el encabezado `mcp-session-id` o el ID no es válido.

**Soluciones**:
1. Asegurarse de que la solicitud `initialize` tenga éxito y obtener `mcp-session-id` del encabezado de respuesta
2. Las solicitudes posteriores (`tools/list`, `tools/call`, y keepalive SSE) deben llevar este encabezado
3. Si se pierde la sesión (ej. reinicio del servicio), necesitas `initialize` nuevamente

### z.ai is not configured

**Síntoma**: devuelve `400 Bad Request`, indicando `z.ai is not configured`.

**Causa**: `proxy.zai.enabled` es `false` o `api_key` está vacío.

**Soluciones**:
1. Asegurarse de que `proxy.zai.enabled` sea `true`
2. Asegurarse de que `proxy.zai.api_key` esté configurado (no vacío)

### Fallo de solicitud upstream

**Síntoma**: devuelve `502 Bad Gateway` o error interno.

**Causas**:
1. La API Key de z.ai no es válida o ha expirado
2. Problemas de conexión de red (se necesita proxy upstream)
3. Error del servidor z.ai

**Soluciones**:
1. Verificar que la API Key de z.ai sea correcta
2. Verificar configuración `proxy.upstream_proxy` (si necesitas proxy para acceder a z.ai)
3. Verificar logs para obtener información detallada del error

## Integración con clientes MCP externos

### Ejemplo de configuración para Claude Desktop

Archivo de configuración del cliente MCP de Claude Desktop (`~/.config/claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "antigravity-vision": {
      "command": "node",
      "args": [
        "/path/to/mcp-client-wrapper.js",
        "--endpoint",
        "http://127.0.0.1:8045/mcp/zai-mcp-server/mcp"
      ]
    },
    "antigravity-web-search": {
      "command": "node",
      "args": [
        "/path/to/mcp-client-wrapper.js",
        "--endpoint",
        "http://127.0.0.1:8045/mcp/web_search_prime/mcp"
      ]
    }
  }
}
```

::: tip Limitaciones de Claude Desktop
El cliente MCP de Claude Desktop necesita comunicarse a través de `stdio`. Si usas directamente el endpoint HTTP, necesitas escribir un script wrapper que convierta `stdio` en solicitudes HTTP.

O usa un cliente que admita HTTP MCP (como Cursor).
:::

### Cliente HTTP MCP (como Cursor)

Si el cliente admite HTTP MCP, simplemente configura la URL del endpoint:

```yaml
  # Configuración MCP de Cursor
mcpServers:
  - name: antigravity-vision
    url: http://127.0.0.1:8045/mcp/zai-mcp-server/mcp
  - name: antigravity-web-search
    url: http://127.0.0.1:8045/mcp/web_search_prime/mcp
```

## Resumen de esta lección

Los endpoints MCP de Antigravity Tools exponen las capacidades de z.ai como herramientas invocables, divididas en dos categorías:
- **Proxy inverso remoto** (Web Search/Web Reader): reenvío simple, sin estado
- **Servidor integrado** (Vision MCP): implementación completa de JSON-RPC 2.0, con gestión de sesiones

Puntos clave:
1. Autenticación unificada: la clave z.ai es gestionada por Antigravity, los clientes no necesitan configurarla
2. Conmutable: los tres endpoints pueden habilitarse/deshabilitarse de manera independiente
3. Aislamiento de sesiones: Vision MCP usa `mcp-session-id` para aislar clientes
4. Integración flexible: admite cualquier cliente compatible con el protocolo MCP

## Próxima lección

> En la próxima lección aprenderemos **[Túnel Cloudflared con un clic](/es/lbjlaq/Antigravity-Manager/platforms/cloudflared/)**.
>
> Aprenderás:
> - Cómo instalar e iniciar túnel Cloudflared con un clic
> - Diferencias entre modo quick y modo auth
> - Cómo exponer de manera segura la API local a la red pública

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver las ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta del archivo | Línea |
| --- | --- | --- |
| Endpoint Web Search | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L115-L135) | 115-135 |
| Endpoint Web Reader | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L137-L157) | 137-157 |
| Endpoint Vision MCP (entrada principal) | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L376-L397) | 376-397 |
| Manejo de initialize de Vision MCP | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L271-L293) | 271-293 |
| Manejo de tools/list de Vision MCP | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L311-L314) | 311-314 |
| Manejo de tools/call de Vision MCP | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L315-L363) | 315-363 |
| Gestión de estado de sesión Vision MCP | [`src-tauri/src/proxy/zai_vision_mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_mcp.rs#L1-L42) | 1-42 |
| Definiciones de herramientas Vision MCP | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L166-L271) | 166-271 |
| Implementación de invocación de herramientas Vision MCP | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L273-L400) | 273-400 |
| Registro de rutas | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L157-L169) | 157-169 |
| Middleware de autenticación | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L1-L78) | 1-78 |
| UI de configuración MCP | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1304-L1357) | 1304-1357 |
| Documentación dentro del repositorio | [`docs/zai/mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/mcp.md#L1-L57) | 1-57 |

**Constantes clave**:
- `ZAI_PAAZ_CHAT_COMPLETIONS_URL = "https://api.z.ai/api/paas/v4/chat/completions"`: endpoint de la API PaaS de z.ai (usado para invocaciones de herramientas Vision)

**Funciones clave**:
- `handle_web_search_prime()`: maneja el proxy inverso remoto del endpoint Web Search
- `handle_web_reader()`: maneja el proxy inverso remoto del endpoint Web Reader
- `handle_zai_mcp_server()`: maneja todos los métodos del endpoint Vision MCP (GET/POST/DELETE)
- `mcp_session_id()`: extrae `mcp-session-id` del encabezado de solicitud
- `forward_mcp()`: función de reenvío MCP genérica (inyecta autenticación y reenvía al upstream)
- `tool_specs()`: devuelve lista de definiciones de herramientas Vision MCP
- `call_tool()`: ejecuta la herramienta Vision MCP especificada

</details>
