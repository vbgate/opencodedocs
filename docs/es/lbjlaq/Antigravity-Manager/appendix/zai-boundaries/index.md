---
title: "Integración z.ai: Límites de Capacidad Explicados | Antigravity-Manager"
sidebarTitle: "Límites de z.ai"
subtitle: "Integración z.ai: Límites de Capacidad Explicados"
description: "Domina los límites de la integración z.ai de Antigravity Tools. Entiende el enrutamiento de solicitudes, el modo de distribución dispatch_mode, mapeo de modelos, políticas de seguridad de Header, así como el proxy inverso MCP y restricciones, para evitar juicios erróneos."
tags:
  - "z.ai"
  - "MCP"
  - "Claude"
  - "límites de capacidad"
prerequisite:
  - "start-getting-started"
  - "platforms-mcp"
order: 3
---
# Límites de Capacidad de la Integración z.ai (Implementado vs. No Implementado Explícitamente)

Este documento solo cubre los "límites" de z.ai en Antigravity Tools, no "cómo conectar". Si descubres que alguna capacidad no funciona, primero verifica aquí: ¿es que no está activada, no configurada, o simplemente no está implementada?

## Lo Que Podrás Hacer Después de Esta Lección

- Determinar si algo se puede esperar de z.ai: qué es "implementado" y qué es "documentado explícitamente como no hecho"
- Entender qué endpoints afecta z.ai (y cuáles endpoints no se ven afectados en absoluto)
- Ver la evidencia del código fuente/documentación para cada conclusión (con enlaces a números de línea de GitHub), para que puedas verificarlo por ti mismo

## Tu Situación Actual

Posiblemente ya hayas activado z.ai en Antigravity Tools, pero al usarlo te encuentras con estas dudas:

- ¿Por qué algunas solicitudes pasan por z.ai y otras no pasan en absoluto?
- ¿Pueden los endpoints MCP considerarse como "Servidor MCP completo"?
- ¿Los interruptores visibles en la interfaz realmente corresponden a una implementación real?

## Qué Es la Integración z.ai (en Este Proyecto)

**Integración z.ai** en Antigravity Tools es una "extensión provider upstream + MCP" opcional. Solo toma el control de solicitudes del protocolo Claude bajo condiciones específicas, proporciona proxy inverso MCP Search/Reader y un servidor MCP Vision integrado mínimo; no es una solución de reemplazo de protocolo completo y capacidades completas.

::: info Recuerda en una frase
Puedes considerar z.ai como "un upstream opcional para solicitudes Claude + un conjunto de endpoints MCP activables", no como "traer todas las capacidades de z.ai completamente".
:::

## Implementado: Estable y Disponible (Basado en Código Fuente)

### 1) Solo el Protocolo Claude Pasa por z.ai (/v1/messages + /v1/messages/count_tokens)

El reenvío upstream Anthropic de z.ai solo ocurre en la rama z.ai del handler Claude:

- `POST /v1/messages`: cuando `use_zai=true`, llama a `forward_anthropic_json(...)` para reenviar la solicitud JSON al endpoint compatible con Anthropic de z.ai
- `POST /v1/messages/count_tokens`: también se reenvía cuando z.ai está activado; de lo contrario, devuelve un marcador de posición `{input_tokens:0, output_tokens:0}`

Evidencia:

- Selección de rama z.ai y entrada de reenvío: [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L256-L374)
- Rama z.ai y retorno de marcador de count_tokens: [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1209)
- Implementación de reenvío Anthropic z.ai: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L133-L219)

::: tip ¿Cómo entender "flujo de respuesta"?
`forward_anthropic_json` transmite el cuerpo de respuesta upstream al cliente como un flujo `bytes_stream()`, sin analizar SSE (ver la construcción del Response body en `providers/zai_anthropic.rs`).
:::

### 2) El "Significado Real" del Modo de Distribución (dispatch_mode)

`dispatch_mode` determina si `/v1/messages` pasa por z.ai:

| dispatch_mode | Qué Ocurre | Evidencia |
|--- | --- | ---|
| `off` | Nunca usa z.ai | `src-tauri/src/proxy/config.rs#L20-L37` + `src-tauri/src/proxy/handlers/claude.rs#L282-L314` |
| `exclusive` | Todas las solicitudes Claude pasan por z.ai | `src-tauri/src/proxy/handlers/claude.rs#L285-L314` |
| `fallback` | Solo pasa por z.ai cuando el grupo Google no está disponible (0 cuentas o "no hay cuentas disponibles") | `src-tauri/src/proxy/handlers/claude.rs#L288-L305` |
| `pooled` | Trata z.ai como "1 ranura adicional" para participar en el round-robin (no garantiza que siempre se elija) | `src-tauri/src/proxy/handlers/claude.rs#L306-L312` |

::: warning Malentendido común de pooled
`pooled` no es "usar tanto z.ai como el grupo de cuentas Google, y distribuir de manera estable según peso". El código escribe explícitamente "no strict guarantees", esencialmente es una ranura de round-robin (solo pasa por z.ai cuando `slot == 0`).
:::

### 3) Mapeo de Modelos: ¿Cómo los Nombres de Modelos Claude se Convierten en glm-* de z.ai?

Antes de reenviar a z.ai, si el cuerpo de solicitud contiene un campo `model`, se reescribe:

1. Coincidencia exacta en `proxy.zai.model_mapping` (soporta tanto la cadena original como clave en minúsculas)
2. Prefijo `zai:<model>`: elimina `zai:` y usa directamente
3. `glm-*`: se mantiene sin cambios
4. No `claude-*`: se mantiene sin cambios
5. `claude-*` y contiene `opus/haiku`: se mapea a `proxy.zai.models.opus/haiku`; de lo contrario, por defecto `sonnet`

Evidencia: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L13-L37), [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L149-L152)

### 4) Política de Seguridad de Header al Reenviar (Evitar Filtrar la Clave Local del Proxy)

El reenvío upstream de z.ai no "trae todos los Headers tal cual", sino que implementa dos capas de defensa:

- Solo permite pasar una pequeña parte de los Headers (por ejemplo, `content-type`, `accept`, `anthropic-version`, `user-agent`)
- Inyecta la API Key de z.ai al upstream (prioriza mantener el método de autenticación utilizado por el cliente: `x-api-key` o `Authorization: Bearer ...`)

Evidencia:

- Lista blanca de Headers: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L89)
- Inyección de autenticación z.ai: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L91-L110)

## Implementado: MCP (Proxy Inverso Search/Reader + Vision Integrado)

### 1) MCP Search/Reader: Proxy Inverso a los Endpoints MCP de z.ai

Los endpoints locales y las direcciones upstream están codificados:

| Endpoint Local | Dirección Upstream | Interruptor | Evidencia |
|--- | --- | --- | ---|
| `/mcp/web_search_prime/mcp` | `https://api.z.ai/api/mcp/web_search_prime/mcp` | `proxy.zai.mcp.web_search_enabled` | `src-tauri/src/proxy/handlers/mcp.rs#L115-L135` |
| `/mcp/web_reader/mcp` | `https://api.z.ai/api/mcp/web_reader/mcp` | `proxy.zai.mcp.web_reader_enabled` | `src-tauri/src/proxy/handlers/mcp.rs#L137-L157` |

::: info 404 no es "un problema de red"
Siempre que `proxy.zai.mcp.enabled=false`, o el correspondiente `web_search_enabled/web_reader_enabled=false`, estos endpoints devolverán directamente 404.
:::

Evidencia:

- Interruptor general MCP y verificación de clave z.ai: [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L52-L59)
- Registro de rutas: [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L157-L169)

### 2) Vision MCP: Un Servidor Integrado "Mínimo Streamable HTTP MCP"

Vision MCP no es un proxy inverso, es una implementación integrada local:

- Endpoint: `/mcp/zai-mcp-server/mcp`
- `POST` admite: `initialize`, `tools/list`, `tools/call`
- `GET` devuelve SSE keepalive (requiere sesión ya inicializada)
- `DELETE` termina la sesión

Evidencia:

- Entrada principal del handler y distribución de métodos: [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L376-L397)
- Implementación de `initialize`, `tools/list`, `tools/call`: [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L229-L374)
- Posicionamiento de "implementación mínima" de Vision MCP: [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L17-L37)

### 3) Conjunto de Herramientas Vision MCP (8) y Límite de Tamaño de Archivo

La lista de herramientas proviene de `tool_specs()`:

- `ui_to_artifact`
- `extract_text_from_screenshot`
- `diagnose_error_screenshot`
- `understand_technical_diagram`
- `analyze_data_visualization`
- `ui_diff_check`
- `analyze_image`
- `analyze_video`

Evidencia: [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L166-L270), [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L45-L53)

Los archivos locales se leen y codifican como `data:<mime>;base64,...`, y tienen un límite estricto:

- Límite de imágenes 5 MB (`image_source_to_content(..., 5)`)
- Límite de videos 8 MB (`video_source_to_content(..., 8)`)

Evidencia: [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L57-L111)

## No Implementado Explícitamente / No Espere (Basado en Declaraciones de Documentación y Detalles de Implementación)

### 1) Monitoreo de Uso/Presupuesto de z.ai (usage/budget) No Implementado

`docs/zai/implementation.md` escribe explícitamente "not implemented yet". Esto significa:

- No puedes esperar que Antigravity Tools proporcione consultas o alertas de uso/presupuesto de z.ai
- La gobernanza de cuotas (Quota Protection) tampoco leerá automáticamente los datos de presupuesto/uso de z.ai

Evidencia: [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198)

### 2) Vision MCP No Es un Servidor MCP Completo

Vision MCP actualmente está posicionado como una implementación mínima "solo suficiente para llamadas a herramientas": prompts/resources, reanudabilidad, salida de herramientas en streaming, etc., aún no están implementados.

Evidencia: [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L34-L36), [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198)

### 3) `/v1/models/claude` No Refleja la Lista de Modelos Real de z.ai

La lista de modelos devuelta por este endpoint proviene del mapeo integrado local y mapeo personalizado (`get_all_dynamic_models`), no solicitará `/v1/models` al upstream de z.ai.

Evidencia:

- handler: [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1162-L1183)
- Lógica de generación de lista: [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L84-L132)

## Referencia Rápida de Campos de Configuración (Relacionados con z.ai)

La configuración z.ai está bajo `ProxyConfig.zai` e incluye estos campos:

- `enabled` / `base_url` / `api_key`
- `dispatch_mode` (`off/exclusive/pooled/fallback`)
- `model_mapping` (anulación de coincidencia exacta)
- `models.{opus,sonnet,haiku}` (mapeo predeterminado de la familia Claude)
- `mcp.{enabled,web_search_enabled,web_reader_enabled,vision_enabled}`

Los valores predeterminados (base_url / modelo predeterminado) también están en el mismo archivo:

- `base_url = "https://api.z.ai/api/anthropic"`
- `opus/sonnet = "glm-4.7"`
- `haiku = "glm-4.5-air"`

Evidencia: [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L20-L116), [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L265-L279)

---

## Resumen de Esta Lección

- z.ai actualmente solo toma el control del protocolo Claude (`/v1/messages` + `count_tokens`), otros endpoints de protocolo no "pasan automáticamente por z.ai"
- MCP Search/Reader es proxy inverso; Vision MCP es implementación mínima local, no un Servidor MCP completo
- La lista de modelos de `/v1/models/claude` proviene del mapeo local, no representa los modelos reales del upstream de z.ai

---

## Próxima Lección

> En la próxima lección aprenderemos **[Evolución de Versiones](../../changelog/release-notes/)**.

---

## Apéndice: Referencias de Código Fuente

<details>
<summary><strong>Haz clic para expandir ubicaciones de código fuente</strong></summary>

> Última actualización: 2026-01-23

| Función | Ruta del Archivo | Líneas |
|--- | --- | ---|
| Alcance de integración z.ai (Protocolo Claude + MCP + Vision MCP) | [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L12-L17) | 12-17 |
| Modos de distribución z.ai y valores predeterminados de modelos | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L20-L116) | 20-116 |
| Base_url predeterminada z.ai / modelo predeterminado | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L265-L279) | 265-279 |
| Lógica de selección si `/v1/messages` pasa por z.ai | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L256-L374) | 256-374 |
| Reenvío z.ai de `/v1/messages/count_tokens` y retorno de marcador | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1209) | 1186-1209 |
| Reenvío upstream Anthropic de z.ai (reenvío JSON + transmisión de respuesta) | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L133-L219) | 133-219 |
| Reglas de mapeo de modelos z.ai (map_model_for_zai) | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L13-L37) | 13-37 |
| Lista blanca de Headers + inyección de autenticación z.ai | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L110) | 70-110 |
| Proxy inverso MCP Search/Reader e interruptores | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L45-L157) | 45-157 |
|--- | --- | ---|
| Posicionamiento de implementación mínima Vision MCP (no Servidor MCP completo) | [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L17-L37) | 17-37 |
| Lista de herramientas Vision y límites (tool_specs + tamaño de archivo + stream=false) | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L57-L270) | 57-270 |
| Fuente de lista de modelos `/v1/models/claude` (mapeo local, no consulta upstream) | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L84-L132) | 84-132 |
| Monitoreo de uso/presupuesto no implementado (declaración de documentación) | [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198) | 194-198 |

</details>
