---
title: "Compresión de Contexto: Sesiones Largas Estables | Antigravity-Manager"
sidebarTitle: "Sesiones Largas Estables"
subtitle: "Compresión de Contexto: Sesiones Largas Estables"
description: "Aprende el mecanismo de compresión de contexto de tres capas de Antigravity. Reduce errores 400 y fallos por prompts demasiado largos mediante recorte de rondas de herramientas, compresión de Thinking y caché de firmas."
tags:
  - "compresión de contexto"
  - "caché de firmas"
  - "Thinking"
  - "Tool Result"
  - "estabilidad"
prerequisite:
  - "start-proxy-and-first-client"
  - "advanced-monitoring"
order: 8
---

# Estabilidad de Sesiones Largas: Compresión de Contexto, Caché de Firmas y Compresión de Resultados de Herramientas

Al usar clientes como Claude Code o Cherry Studio para sesiones largas, lo más molesto no es que el modelo no sea suficientemente inteligente, sino que la conversación de repente comienza a mostrar errores: `Prompt is too long`, errores de firma 400, cadenas de llamadas a herramientas rotas, o bucles de herramientas que se vuelven cada vez más lentos.

Esta lección explica claramente tres cosas que Antigravity Tools ha hecho para resolver estos problemas: compresión de contexto (intervención progresiva en tres capas), caché de firmas (para mantener la cadena de firmas de Thinking) y compresión de resultados de herramientas (para evitar que la salida de herramientas sature el contexto).

## Lo Que Podrás Hacer Después de Esta Lección

- Explicar claramente qué hace cada una de las tres capas de compresión progresiva de contexto y sus respectivos costos
- Saber qué cosas se almacenan en el caché de firmas (tres capas: Tool/Family/Session) y el impacto del TTL de 2 horas
- Entender las reglas de compresión de resultados de herramientas: cuándo se eliminan imágenes base64 y cuándo las instantáneas del navegador se convierten en resúmenes de encabezado+cuerpo
- Ajustar los puntos de disparo de compresión mediante los interruptores de umbral en `proxy.experimental` cuando sea necesario

## Tu Situación Actual

- Después de conversaciones largas, comienzan a aparecer errores 400: parece una firma caducada, pero no sabes de dónde viene ni dónde se perdió
- Las llamadas a herramientas aumentan, el historial de tool_result se acumula y el upstream lo rechaza directamente (o se vuelve extremadamente lento)
- Quieres usar compresión como solución de emergencia, pero te preocupas por romper Prompt Cache, afectar la consistencia o hacer que el modelo pierda información

## Cuándo Usar Este Enfoque

- Estás ejecutando tareas con cadenas largas de herramientas (búsqueda/lectura de archivos/instantáneas del navegador/bucles de múltiples rondas de herramientas)
- Estás usando modelos Thinking para razonamiento complejo y las sesiones a menudo exceden varias docenas de rondas
- Estás investigando problemas de estabilidad que se reproducen en el cliente pero no puedes explicar por qué

## Qué Es la Compresión de Contexto

**Compresión de contexto** es la reducción de ruido y adelgazamiento automático que el agente realiza en mensajes históricos cuando detecta que la presión del contexto es demasiado alta: primero elimina rondas antiguas de herramientas, luego comprime el texto Thinking antiguo en marcadores de posición pero preserva las firmas, y finalmente en casos extremos genera resúmenes XML y Fork de una nueva sesión para continuar la conversación, reduciendo así fallos causados por `Prompt is too long` y roturas de cadenas de firmas.

::: info ¿Cómo se calcula la presión del contexto?
El procesador de Claude usa `ContextManager::estimate_token_usage()` para hacer una estimación ligera, la calibra con `estimation_calibrator`, y luego obtiene el porcentaje de presión con `usage_ratio = estimated_usage / context_limit` (el registro imprimirá los valores raw/calibrated).
:::

## 🎒 Preparativos Antes de Empezar

- Ya has ejecutado el agente local y el cliente definitivamente está usando la ruta `/v1/messages` (ver "Iniciar el proxy inverso local y conectar el primer cliente")
- Puedes ver los registros del agente (depuración del desarrollador o archivos de registro locales). El plan de pruebas en el repositorio proporciona una ruta de registro de ejemplo y un método grep (ver `docs/testing/context_compression_test_plan.md`)

::: tip Mejor localización con Proxy Monitor
Si quieres correlacionar el disparo de compresión con qué tipo de solicitud/qué cuenta/qué ronda de llamada a herramienta, se recomienda tener Proxy Monitor abierto simultáneamente.
:::

## Idea Central

Este diseño de estabilidad no elimina todo el historial directamente, sino que interviene capa por capa de menor a mayor costo:

| Capa | Punto de disparo (configurable) | Qué hace | Costo/efectos secundarios |
| --- | --- | --- | --- |
| Layer 1 | `proxy.experimental.context_compression_threshold_l1` (por defecto 0.4) | Identifica rondas de herramientas, solo conserva las N rondas más recientes (en el código es 5), elimina pares tool_use/tool_result anteriores | No modifica el contenido de los mensajes restantes, más amigable con Prompt Cache |
| Layer 2 | `proxy.experimental.context_compression_threshold_l2` (por defecto 0.55) | Comprime el texto Thinking antiguo en `"..."`, pero preserva `signature`, y protege los últimos 4 mensajes sin modificar | Modifica el contenido histórico, los comentarios indican explícitamente que romperá el caché, pero puede mantener la cadena de firmas |
| Layer 3 | `proxy.experimental.context_compression_threshold_l3` (por defecto 0.7) | Llama al modelo en segundo plano para generar resúmenes XML, luego Fork una nueva secuencia de mensajes para continuar la conversación | Depende de llamadas al modelo en segundo plano; si falla, devolverá 400 (con indicación amigable) |

A continuación, desglosaré las tres capas y explicaré el caché de firmas y la compresión de resultados de herramientas junto con ellas.

### Layer 1: Recorte de Rondas de Herramientas (Trim Tool Messages)

El punto clave de Layer 1 es solo eliminar rondas completas de interacción con herramientas, evitando la eliminación parcial que cause inconsistencias en el contexto.

- La regla para identificar una ronda de interacción con herramientas está en `identify_tool_rounds()`: cuando aparece `tool_use` en `assistant` comienza una ronda, las apariciones subsiguientes de `tool_result` en `user` todavía cuentan como parte de esta ronda, hasta encontrar texto user normal para terminar la ronda.
- La ejecución real del recorte está en `ContextManager::trim_tool_messages(&mut messages, 5)`: cuando las rondas históricas de herramientas exceden 5 rondas, elimina los mensajes involucrados en rondas anteriores.

### Layer 2: Compresión de Thinking Pero Preservación de Firmas

Muchos problemas 400 no son porque Thinking sea demasiado largo, sino porque la cadena de firmas de Thinking está rota. La estrategia de Layer 2 es:

- Solo procesa `ContentBlock::Thinking { thinking, signature, .. }` en mensajes `assistant`
- Solo comprime cuando `signature.is_some()` y `thinking.len() > 10`, cambiando `thinking` directamente a `"..."`
- Los últimos `protected_last_n = 4` mensajes no se comprimen (aproximadamente las últimas 2 rondas de user/assistant)

Esto ahorra muchos tokens, pero mantiene `signature` en el historial, evitando que la cadena de herramientas no tenga forma de recuperarse cuando necesite retroalimentar firmas.

### Layer 3: Fork + Resumen XML (Último Recurso)

Cuando la presión continúa aumentando, el procesador de Claude intentará reiniciar la sesión sin perder información clave:

1. Extrae la última firma válida de Thinking de los mensajes originales (`ContextManager::extract_last_valid_signature()`)
2. Concatena todo el historial + `CONTEXT_SUMMARY_PROMPT` en una solicitud para generar un resumen XML, el modelo se fija como `BACKGROUND_MODEL_LITE` (en el código actual es `gemini-2.5-flash`)
3. El resumen debe incluir `<latest_thinking_signature>`, usado para la continuación posterior de la cadena de firmas
4. Fork de una nueva secuencia de mensajes:
   - `User: Context has been compressed... + XML summary`
   - `Assistant: I have reviewed...`
   - Y adjunta el último mensaje user de la solicitud original (si no es la instrucción de resumen recién creada)

Si Fork + resumen falla, devolverá directamente `StatusCode::BAD_REQUEST`, y te sugerirá usar `/compact` o `/clear` para procesar manualmente (ver el error JSON devuelto por el procesador).

### Derivación 1: Caché de Firmas de Tres Capas (Tool / Family / Session)

El caché de firmas es el fusible de la compresión de contexto, especialmente cuando el cliente recorta/descarta campos de firma.

- TTL: `SIGNATURE_TTL = 2 * 60 * 60` (2 horas)
- Layer 1: `tool_use_id -> signature` (recuperación de cadena de herramientas)
- Layer 2: `signature -> model family` (verificación de compatibilidad entre modelos, evitando que las firmas de Claude se lleven a modelos de la familia Gemini)
- Layer 3: `session_id -> latest signature` (aislamiento a nivel de sesión, evitando contaminación entre diferentes conversaciones)

Estas tres capas de caché se escriben/leen durante el análisis de flujo SSE de Claude y la conversión de solicitudes:

- Al analizar el flujo hacia `signature` en thinking, se escribe en Session Cache (y caché de family)
- Al analizar el flujo hacia `signature` en tool_use, se escribe en Tool Cache + Session Cache
- Al convertir llamadas a herramientas de Claude a `functionCall` de Gemini, se prioriza recuperar la firma de Session Cache o Tool Cache

### Derivación 2: Compresor de Resultados de Herramientas (Tool Result Compressor)

Los resultados de herramientas tienden a saturar el contexto más fácilmente que el texto de chat, por lo que en la fase de conversión de solicitudes se hace una reducción predecible de tool_result.

Reglas principales (todas en `tool_result_compressor.rs`):

- Límite total de caracteres: `MAX_TOOL_RESULT_CHARS = 200_000`
- Bloques de imágenes base64 se eliminan directamente (se agrega un texto de aviso)
- Si se detecta una indicación de que la salida se guardó en un archivo, se extrae información clave y se usa un marcador `[tool_result omitted ...]`
- Si se detecta una instantánea del navegador (contiene características como `page snapshot` / `ref=`), se convierte en resumen de encabezado+cuerpo, marcando cuántos caracteres se omitieron
- Si la entrada parece HTML, primero se eliminan fragmentos `<style>`/`<script>`/base64 antes de truncar

## Sígueme

### Paso 1: Confirmar Umbrales de Compresión (y Valores por Defecto)

**Por qué**
Los puntos de disparo de compresión no están escritos de forma fija, provienen de `proxy.experimental.*`. Primero necesitas conocer los umbrales actuales para poder juzgar por qué interviene tan temprano/tarde.

Valores por defecto (lado Rust `ExperimentalConfig::default()`):

```json
{
  "proxy": {
    "experimental": {
      "enable_signature_cache": true,
      "enable_tool_loop_recovery": true,
      "enable_cross_model_checks": true,
      "enable_usage_scaling": true,
      "context_compression_threshold_l1": 0.4,
      "context_compression_threshold_l2": 0.55,
      "context_compression_threshold_l3": 0.7
    }
  }
}
```

**Lo que deberías ver**: Tu configuración contiene `proxy.experimental` (los nombres de campo son consistentes con lo anterior), y los umbrales son valores de proporción como `0.x`.

::: warning La ubicación del archivo de configuración no se repite en esta lección
La ubicación del archivo de configuración en disco y si es necesario reiniciar después de modificar, pertenece al ámbito de gestión de configuración. Según este sistema de tutoriales, da prioridad a "Configuración Completa: AppConfig/ProxyConfig, Ubicación en Disco y Semántica de Actualización en Caliente".
:::

### Paso 2: Confirmar con Registros Si Se Disparan Layer 1/2/3

**Por qué**
Estas tres capas son comportamientos internos del agente, la forma más confiable de verificar es ver si aparecen `[Layer-1]` / `[Layer-2]` / `[Layer-3]` en los registros.

El plan de pruebas del repositorio proporciona un comando de ejemplo (ajusta según la ruta real de registro en tu máquina):

```bash
tail -f ~/Library/Application\ Support/com.antigravity.tools/logs/antigravity.log | grep -E "Layer-[123]"
```

**Lo que deberías ver**: Cuando la presión aumenta, el registro muestra registros similares a `Tool trimming triggered`, `Thinking compression triggered`, `Fork successful` (los campos específicos están sujetos al texto original del registro).

### Paso 3: Entender la Diferencia Entre Purificación y Compresión (No Mezclar Expectativas)

**Por qué**
Algunos problemas (como degradación forzada a modelos que no soportan Thinking) requieren purificación en lugar de compresión. La purificación elimina directamente el bloque Thinking; la compresión preserva la cadena de firmas.

En el procesador de Claude, la degradación de tareas en segundo plano pasará por `ContextManager::purify_history(..., PurificationStrategy::Aggressive)`, que eliminará directamente los bloques Thinking históricos.

**Lo que deberías ver**: Puedes distinguir dos tipos de comportamientos:

- La purificación elimina bloques Thinking
- La compresión de Layer 2 reemplaza el texto Thinking antiguo con `"..."`, pero las firmas aún están presentes

### Paso 4: Cuando Encuentras un Error 400 de Firma, Primero Revisa Si Hay Hit en Session Cache

**Por qué**
Muchas 400 no son porque no hay firma, sino porque la firma no sigue al mensaje. Durante la conversión de solicitudes, se prioriza recuperar la firma de Session Cache.

Pistas (los registros en la fase de conversión de solicitudes indicarán recuperación de firmas de SESSION/TOOL cache):

- `[Claude-Request] Recovered signature from SESSION cache ...`
- `[Claude-Request] Recovered signature from TOOL cache ...`

**Lo que deberías ver**: Cuando el cliente pierde firmas pero el caché del agente aún está, el registro mostrará registros de Recovered signature from ... cache.

### Paso 5: Entender Qué Perderá la Compresión de Resultados de Herramientas

**Por qué**
Si haces que las herramientas devuelvan grandes fragmentos de HTML/instantáneas del navegador/imágenes base64 a la conversación, el agente las eliminará activamente. Necesitas saber de antemano qué contenidos se reemplazarán con marcadores de posición, evitando pensar erróneamente que el modelo no los vio.

Recuerda tres puntos clave:

1. Las imágenes base64 se eliminarán (se cambian a texto de aviso)
2. Las instantáneas del navegador se convertirán en resúmenes de head/tail (con indicación de caracteres omitidos)
3. Si excede 200,000 caracteres, se truncará y se agregará una indicación `...[truncated ...]`

**Lo que deberías ver**: En `tool_result_compressor.rs`, estas reglas tienen constantes y ramas explícitas, no se eliminan por experiencia.

## Puntos de Control

- Puedes explicar claramente que los puntos de disparo de L1/L2/L3 provienen de `proxy.experimental.context_compression_threshold_*`, por defecto son `0.4/0.55/0.7`
- Puedes explicar por qué Layer 2 romperá el caché: porque modifica el contenido del texto thinking histórico
- Puedes explicar por qué Layer 3 se llama Fork: convierte la conversación en una nueva secuencia de resumen XML + confirmación + mensaje user más reciente
- Puedes explicar que la compresión de resultados de herramientas eliminará imágenes base64 y convertirá instantáneas del navegador en resúmenes de head/tail

## Advertencias Sobre Problemas Comunes

| Fenómeno | Causa Posible | Qué Puedes Hacer |
| --- | --- | --- |
| Después de disparar Layer 2 sientes que el contexto no es tan estable | Layer 2 modifica el contenido histórico, los comentarios indican explícitamente que romperá el caché | Si dependes de la consistencia de Prompt Cache, deja que L1 resuelva el problema primero, o aumenta el umbral L2 |
| Después de disparar Layer 3 se devuelve directamente 400 | Fork + resumen falló la llamada al modelo en segundo plano (red/cuenta/error upstream, etc.) | Primero usa `/compact` o `/clear` según la sugerencia en el error JSON; al mismo tiempo verifica la ruta de llamada del modelo en segundo plano |
| Imágenes/contenido grande desaparecen en la salida de herramientas | tool_result eliminará imágenes base64, truncará salidas excesivamente largas | Guarda el contenido importante en archivos locales/enlaces y luego reférencia; no esperes meter 100,000 líneas de texto directamente en la conversación |
| Explícitamente estás usando el modelo Gemini pero llevas firmas de Claude causando errores | Las firmas no son compatibles entre modelos (en el código hay verificación de family) | Confirma el origen de la firma; si es necesario, deja que el agente elimine firmas históricas en escenarios de retry (ver lógica de conversión de solicitudes) |

## Resumen de Esta Lección

- El núcleo de la compresión de tres capas es clasificar por costo: primero eliminar rondas antiguas de herramientas, luego comprimir Thinking antiguo, y finalmente Fork + resumen XML
- El caché de firmas es clave para que la cadena de herramientas no se rompa: tres capas Session/Tool/Family cada una maneja un tipo de problema, TTL es 2 horas
- La compresión de resultados de herramientas es el límite duro para evitar que la salida de herramientas sature el contexto: límite superior de 200,000 caracteres + especialización para instantáneas/archivos grandes

## Próxima Lección

> En la próxima lección hablaremos de capacidades del sistema: multilingüismo/temas/actualizaciones/inicio automático/Servidor HTTP API.

---

## Apéndice: Referencias de Código Fuente

<details>
<summary><strong>Haz clic para expandir ubicaciones de código fuente</strong></summary>

> Última actualización: 2026-01-23

| Función | Ruta del Archivo | Líneas |
| --- | --- | --- |
| Configuración experimental: umbrales de compresión y valores por defecto de interruptores | `src-tauri/src/proxy/config.rs` | 119-168 |
| Estimación de contexto: estimación de caracteres multilingüe + 15% de margen | `src-tauri/src/proxy/mappers/context_manager.rs` | 9-37 |
| Estimación de uso de tokens: iterar sobre system/messages/tools/thinking | `src-tauri/src/proxy/mappers/context_manager.rs` | 103-198 |
| Layer 1: identificar rondas de herramientas + recortar rondas antiguas | `src-tauri/src/proxy/mappers/context_manager.rs` | 311-439 |
| Layer 2: compresión de Thinking pero preservación de firmas (proteger los últimos N mensajes) | `src-tauri/src/proxy/mappers/context_manager.rs` | 200-271 |
| Auxiliar de Layer 3: extraer la última firma válida | `src-tauri/src/proxy/mappers/context_manager.rs` | 73-109 |
| Degradación de tareas en segundo plano: purificación agresiva de bloques Thinking | `src-tauri/src/proxy/handlers/claude.rs` | 540-583 |
| Flujo principal de compresión de tres capas: estimación, calibración, disparo L1/L2/L3 por umbral | `src-tauri/src/proxy/handlers/claude.rs` | 379-731 |
| Layer 3: implementación de resumen XML + Fork de sesión | `src-tauri/src/proxy/handlers/claude.rs` | 1560-1687 |
| Caché de firmas: TTL/estructura de caché de tres capas (Tool/Family/Session) | `src-tauri/src/proxy/signature_cache.rs` | 5-88 |
| Caché de firmas: escritura/lectura de firma Session | `src-tauri/src/proxy/signature_cache.rs` | 141-223 |
| Análisis de flujo SSE: cachear signature de thinking/tool en Session/Tool cache | `src-tauri/src/proxy/mappers/claude/streaming.rs` | 766-776 |
| Análisis de flujo SSE: tool_use cachea tool_use_id -> signature | `src-tauri/src/proxy/mappers/claude/streaming.rs` | 958-975 |
| Conversión de solicitudes: tool_use recupera firma de Session/Tool cache | `src-tauri/src/proxy/mappers/claude/request.rs` | 1045-1142 |
| Conversión de solicitudes: tool_result dispara compresión de resultados de herramientas | `src-tauri/src/proxy/mappers/claude/request.rs` | 1159-1225 |
| Compresión de resultados de herramientas: entrada `compact_tool_result_text()` | `src-tauri/src/proxy/mappers/tool_result_compressor.rs` | 28-69 |
| Compresión de resultados de herramientas: resumen head/tail de instantáneas del navegador | `src-tauri/src/proxy/mappers/tool_result_compressor.rs` | 123-178 |
| Compresión de resultados de herramientas: eliminar imágenes base64 + límite total de caracteres | `src-tauri/src/proxy/mappers/tool_result_compressor.rs` | 247-320 |
| Plan de pruebas: disparo de compresión de tres capas y verificación de registros | `docs/testing/context_compression_test_plan.md` | 1-116 |

</details>
