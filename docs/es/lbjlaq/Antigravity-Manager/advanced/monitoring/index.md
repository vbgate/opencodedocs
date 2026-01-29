---
title: "Monitorización y resolución de problemas: Análisis de registros de solicitudes | Antigravity-Manager"
sidebarTitle: "Depuración de registros de solicitudes"
subtitle: "Monitorización y resolución de problemas: Análisis de registros de solicitudes"
description: "Aprende la monitorización y resolución de problemas del Proxy Monitor de Antigravity Tools. A través de los registros de solicitudes, filtros y funciones de restauración de detalles, localiza errores 401/429/5xx y problemas de interrupción en streaming."
tags:
  - "Avanzado"
  - "Monitorización"
  - "Resolución de problemas"
  - "Proxy"
  - "Registros"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-first-run-data"
  - "advanced-config"
order: 6
---

# Proxy Monitor: Registros de solicitudes, filtros, restauración de detalles y exportación

Ya tienes el proxy inverso local en funcionamiento, pero una vez que aparecen errores 401/429/500, interrupciones en streaming o "¿por qué cambió de cuenta/cambió de modelo de repente?", la resolución de problemas puede convertirse fácilmente en adivinanzas a ciegas.

Esta lección solo habla de una cosa: usar **Proxy Monitor** para restaurar cada llamada en "evidencia reproducible", permitiéndote saber de dónde vino la solicitud, a qué endpoint llegó, qué cuenta se usó, si el modelo fue mapeado y aproximadamente cuánto Token se consumió.

## Lo que podrás hacer al finalizar

- Abrir/pausar la grabación en la página `/monitor` y comprender si afecta o no a Token Stats
- Usar el cuadro de búsqueda, filtros rápidos y filtros de cuenta para localizar rápidamente un registro de solicitud
- Ver y copiar los mensajes de Request/Response en la ventana emergente de detalles, para revisar las causas del fallo
- Conocer la ubicación de persistencia de datos de Proxy Monitor (`proxy_logs.db`) y su comportamiento de vaciado
- Comprender los límites reales de la función actual "exportar registros" (GUI vs comandos de backend)

## Tu situación actual

- Solo ves "fallo de solicitud/timeout", pero no sabes exactamente dónde falló: en el upstream, en el proxy o en la configuración del cliente
- Sospechas que se activó el mapeo de modelos o la rotación de cuentas, pero no tienes cadena de evidencia
- Quieres revisar el payload completo de una solicitud (especialmente streaming/Thinking), pero no se ve en los registros

## Cuándo utilizar este método

- Necesitas investigar: fallos de autenticación 401, límites de velocidad 429, errores de upstream 5xx, interrupciones en streaming
- Quieres confirmar: qué cuenta se usó exactamente en una solicitud (`X-Account-Email`)
- Estás trabajando en estrategias de enrutamiento de modelos y quieres verificar "nombre de modelo del cliente -> nombre de modelo mapeado real"

## 🎒 Preparativos previos

::: warning Requisitos previos
Proxy Monitor registra las "solicitudes recibidas por el servicio de proxy inverso". Por lo tanto, al menos debes haberlo hecho funcionar:

- El servicio de proxy inverso ya está iniciado y puedes acceder a `/healthz`
- Conoces la URL base y el puerto del proxy inverso actual

Si aún no funciona, primero consulta **[Iniciar proxy inverso local y conectar el primer cliente](/es/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**.
:::

## ¿Qué es Proxy Monitor?

**Proxy Monitor** es el "tablero de registros de solicitudes" integrado en Antigravity Tools. Cada vez que entra una solicitud al proxy inverso local, registra la hora, la ruta, el código de estado, el tiempo de respuesta, el modelo y el protocolo, e intenta extraer el uso de Token desde la respuesta; también puedes hacer clic en un registro individual para ver los mensajes de solicitud y respuesta, usándolo para revisar las causas del fallo y los resultados de selección de enrutamiento/cuenta.

::: info Ubicación de persistencia de datos
Los registros de Proxy Monitor se escriben en SQLite bajo el directorio de datos: `proxy_logs.db`. Para encontrar el directorio de datos y cómo hacer copias de seguridad, se recomienda repasar primero **[Primera ejecución: Directorio de datos, registros, bandeja y inicio automático](/es/lbjlaq/Antigravity-Manager/start/first-run-data/)**.
:::

## Enfoque central: los 6 campos que debes supervisar

En un registro de Proxy Monitor (estructura de backend `ProxyRequestLog`), los campos más prácticos son:

| Campo | Lo que usas para responder |
| --- | --- |
| `status` | ¿Esta solicitud tuvo éxito o falló? (200-399 vs otros) |
| `url` / `method` | ¿A qué endpoint realmente llegaste? (por ejemplo, `/v1/messages`, `/v1/chat/completions`) |
| `protocol` | ¿Qué protocolo: OpenAI / Claude(Anthropic) / Gemini? |
| `account_email` | ¿Qué cuenta se usó finalmente en esta solicitud? (del encabezado de respuesta `X-Account-Email`) |
| `model` / `mapped_model` | ¿El nombre de modelo solicitado por el cliente fue "enrutado/mapeado" a otro modelo? |
| `input_tokens` / `output_tokens` | ¿Cuál fue el consumo de Token de esta solicitud? (solo si se pudo extraer) |

::: tip Primero usa el "resumen", haz clic en "detalles" solo cuando sea necesario
La página de lista solo muestra el resumen (sin request/response body), solo al hacer clic en un registro se cargan los detalles completos desde el backend, evitando que la lista cargue demasiados campos grandes a la vez.
:::

## Sigue mis pasos: ejecuta un "bucle de monitorización" con una sola llamada

### Paso 1: Primero crea una solicitud que "seguramente aparecerá"

**Por qué**
Proxy Monitor solo registra las solicitudes recibidas por el servicio de proxy inverso. Primero usa una solicitud simple para verificar si "hay registro", y luego podremos hablar de filtros y detalles.

::: code-group

```bash [macOS/Linux]
## 1) Verificación de estado (endpoint que siempre existe)
curl "http://127.0.0.1:PORT/healthz"

## 2) Solicita models una vez más (si habilitaste la autenticación, recuerda agregar el header)
curl "http://127.0.0.1:PORT/v1/models"
```

```powershell [Windows]
## 1) Verificación de estado (endpoint que siempre existe)
curl "http://127.0.0.1:PORT/healthz"

## 2) Solicita models una vez más (si habilitaste la autenticación, recuerda agregar el header)
curl "http://127.0.0.1:PORT/v1/models"
```

:::

**Lo que deberías ver**: el terminal devuelve `{"status":"ok"}` (o JSON similar), así como la respuesta de `/v1/models` (éxito o 401, ambos están bien).

### Paso 2: Abre la página Monitor y confirma el "estado de grabación"

**Por qué**
Proxy Monitor tiene un interruptor de "grabar/pausar". Primero debes confirmar el estado actual; de lo contrario, podrías estar haciendo solicitudes todo el tiempo, pero la lista siempre estará vacía.

En Antigravity Tools, abre el **Tablero de monitorización de API** en la barra lateral (ruta `/monitor`).

En la parte superior de la página habrá un botón con un punto:

```
┌───────────────────────────────────────────┐
│  ● Grabando   [Cuadro de búsqueda]  [Actualizar] [Limpiar]      │
└───────────────────────────────────────────┘
```

Si ves "Pausado", haz clic para cambiar a "Grabando".

**Lo que deberías ver**: el estado del botón cambia a "Grabando"; los registros de solicitud de hace un momento comienzan a aparecer en la lista.

### Paso 3: Usa "búsqueda + filtro rápido" para localizar un registro

**Por qué**
Al resolver problemas en la práctica, generalmente solo recuerdas un fragmento: la ruta contiene `messages`, o el código de estado es `401`, o el nombre del modelo contiene `gemini`. El cuadro de búsqueda está diseñado precisamente para este tipo de recuerdos.

La búsqueda de Proxy Monitor trata tu entrada como una "palabra clave difusa" y usa SQL `LIKE` en el backend para hacer coincidir estos campos:

- `url`
- `method`
- `model`
- `status`
- `account_email`

Puedes probar algunas palabras clave típicas:

- `healthz`
- `models`
- `401` (si acabas de crear un 401)

También puedes hacer clic en los botones de "filtro rápido": **Solo errores / Chat / Gemini / Claude / Dibujar**.

**Lo que deberías ver**: la lista solo muestra el tipo de solicitud que esperas.

### Paso 4: Haz clic en los detalles para restaurar "mensaje de solicitud + mensaje de respuesta"

**Por qué**
La lista solo es suficiente para responder "qué pasó". Para responder "por qué", generalmente necesitas ver el payload completo de solicitud/respuesta.

Haz clic en cualquier registro, aparecerá una ventana emergente de detalles. Puedes verificar principalmente:

- `Protocolo` (OpenAI/Claude/Gemini)
- `Modelo usado` y `Modelo mapeado`
- `Cuenta usada`
- `Consumo de Token (entrada/salida)`

Luego usa los botones para copiar:

- `Mensaje de solicitud (Request)`
- `Mensaje de respuesta (Response)`

**Lo que deberías ver**: en los detalles hay dos bloques de JSON (o texto) de vista previa; después de copiar puedes pegarlos en tickets/notas para su revisión.

### Paso 5: Cuando necesites "reproducir desde cero", vacía los registros

**Por qué**
Al resolver problemas, lo peor es "los datos antiguos interfieren con el juicio". Vacia los registros y reproduce una vez, el éxito/fallo será muy claro.

Haz clic en el botón "Limpiar" en la parte superior, aparecerá un cuadro de confirmación.

::: danger Esta es una operación irreversible
Limpiar eliminará todos los registros en `proxy_logs.db`.
:::

**Lo que deberías ver**: después de confirmar, la lista se vacía y las estadísticas vuelven a 0.

## Puntos de verificación ✅

- [ ] Puedes ver el registro de `/healthz` o `/v1/models` que acabas de enviar en `/monitor`
- [ ] Puedes filtrar un registro usando el cuadro de búsqueda (por ejemplo, ingresa `healthz`)
- [ ] Puedes hacer clic en un registro para ver los mensajes de solicitud/respuesta y copiarlos
- [ ] Sabes que vaciar los registros elimina directamente todos los registros históricos

## Advertencias sobre trampas comunes

| Escenario | Lo que podrías entender (❌) | Comportamiento real (✓) |
| --- | --- | --- |
| "Pausado" = sin gastos de monitoreo en absoluto | Crees que al pausar, las solicitudes no se analizarán | Pausar solo afecta "si se escribe en los registros de Proxy Monitor". Pero el análisis de solicitud/respuesta (incluyendo el análisis de SSE de datos en streaming) seguirá ocurriendo, solo que los datos analizados no se guardarán. Token Stats seguirá registrándose (independientemente de si la monitorización está habilitada). |
| Registros binarios/de cuerpos grandes están vacíos | Piensas que la monitorización está rota | Las solicitudes/respuestas binarias se mostrarán como `[Binary Request Data]` / `[Binary Response Data]`. Los cuerpos de respuesta que excedan 100MB se marcarán como `[Response too large (>100MB)]`; los cuerpos de solicitud que excedan el límite no se registrarán. |
| Quieres usar Monitor para encontrar "quién inició la solicitud" | Piensas que puedes rastrear hasta el proceso del cliente | Monitor registra información a nivel HTTP (método/ruta/modelo/cuenta), no incluye "nombre del proceso de llamada". Necesitas combinar los registros del propio cliente o capturar paquetes de red del sistema para localizar el origen. |
| Datos anormales de Token Stats cuando la monitorización está habilitada | Piensas que es un error de estadísticas | Cuando la monitorización está habilitada, Token Stats puede registrarse dos veces (una al inicio de la función de monitorización, otra al escribir en la base de datos de forma asíncrona). Este es el comportamiento del código fuente de la versión actual. |

## Exportación y retención a largo plazo: primero aclaremos los límites de capacidad

### 1) Qué se puede hacer actualmente en la GUI

En la UI de Monitor de la versión actual (`ProxyMonitor.tsx`), puedes:

- Buscar/filtrar/navegar por páginas
- Hacer clic en detalles para ver y copiar payload
- Vaciar todos los registros

Pero **no hay un "botón de exportar"** (no se encontró UI relacionada en el código fuente).

### 2) Qué capacidades de exportación tiene el backend (adecuado para desarrollo secundario)

Los comandos Tauri del backend proporcionan dos métodos de exportación:

- `export_proxy_logs(file_path)`: exporta "todos los registros" de la base de datos a un archivo JSON
- `export_proxy_logs_json(file_path, json_data)`: escribe el array JSON que pasas en un archivo formateado (requiere que la entrada sea un formato de array)

Si vas a desarrollar una GUI secundaria, o escribir tu propio script de invocación, puedes reutilizar directamente estos comandos.

### 3) La "exportación" más simple: respalda directamente `proxy_logs.db`

Dado que Proxy Monitor esencialmente es SQLite, también puedes tratar `proxy_logs.db` como un "paquete de evidencia de resolución de problemas" y respaldarlo junto con él (por ejemplo, junto con `token_stats.db`). Para la ubicación del directorio de datos, consulta **[Primera ejecución](/es/lbjlaq/Antigravity-Manager/start/first-run-data/)**.

## Lecturas recomendadas

- Para entender el mapeo de modelos: **[Enrutamiento de modelos: Mapeo personalizado, prioridad de comodines y estrategias predefinidas](/es/lbjlaq/Antigravity-Manager/advanced/model-router/)**
- Para investigar problemas de autenticación: **[401/Fallo de autenticación: auth_mode, compatibilidad de Header y lista de verificación de configuración del cliente](/es/lbjlaq/Antigravity-Manager/faq/auth-401/)**
- Para combinar Monitor con estadísticas de costos: la siguiente lección cubrirá Token Stats (`token_stats.db`)

## Resumen de esta lección

- El valor de Proxy Monitor es "reproducible": registra código de estado/ruta/protocolo/cuenta/mapeo de modelos/consumo de Token, y proporciona detalles de solicitud
- La búsqueda y filtros rápidos son el punto de entrada para la resolución de problemas: primero reduce el alcance, luego haz clic en detalles para ver el payload
- Vaciar los registros es una operación irreversible; la exportación actualmente se inclina más hacia "capacidad de desarrollo secundario" y "respaldo de archivo de base de datos"

## Próxima lección

> En la próxima lección aprenderemos **[Token Stats: Métricas estadísticas desde la perspectiva de costos e interpretación de gráficos](/es/lbjlaq/Antigravity-Manager/advanced/token-stats/)**, convirtiendo "parece caro" en optimización cuantificable.

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta del archivo | Número de línea |
| --- | --- | --- |
| Entrada a la página Monitor (monta ProxyMonitor) | [`src/pages/Monitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Monitor.tsx#L1-L12) | 1-12 |
| UI de Monitor: tabla/filtros/ventana emergente de detalles | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L13-L713) | 13-713 |
| UI: leer configuración y sincronizar enable_logging | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L174-L243) | 174-243 |
| UI: cambiar grabación (escribir config + set_proxy_monitor_enabled) | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L254-L267) | 254-267 |
| UI: escucha de eventos en tiempo real (proxy://request) y deduplicación | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L273-L355) | 273-355 |
| UI: vaciar registros (clear_proxy_logs) | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L389-L403) | 389-403 |
| UI: cargar detalles individuales (get_proxy_log_detail) | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L505-L519) | 505-519 |
| Middleware de monitorización: capturar solicitud/respuesta, analizar token, escribir en monitor | [`src-tauri/src/proxy/middleware/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/monitor.rs#L13-L337) | 13-337 |
| ProxyMonitor: interruptor enabled, escribir DB, enviar eventos | [`src-tauri/src/proxy/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/monitor.rs#L33-L194) | 33-194 |
| Montaje del middleware de monitorización en servidor (layer) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L183-L194) | 183-194 |
| Comandos Tauri: get/count/filter/detail/clear/export | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L180-L314) | 180-314 |
| SQLite: ruta proxy_logs.db, estructura de tabla y SQL de filtros | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L1-L416) | 1-416 |
| Descripción del diseño de monitorización (puede diferir de la implementación, prevalece el código fuente) | [`docs/proxy-monitor-technical.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy-monitor-technical.md#L1-L53) | 1-53 |

**Constantes clave**:
- `MAX_REQUEST_LOG_SIZE = 100 * 1024 * 1024`: tamaño máximo del cuerpo de solicitud que el middleware de monitorización puede leer (si excede, la lectura fallará)
- `MAX_RESPONSE_LOG_SIZE = 100 * 1024 * 1024`: tamaño máximo del cuerpo de respuesta que el middleware de monitorización puede leer (para respuestas grandes como imágenes)

**Funciones/comandos clave**:
- `monitor_middleware(...)`: captura solicitudes y respuestas a nivel HTTP y llama a `monitor.log_request(...)`
- `ProxyMonitor::log_request(...)`: escribe en memoria + SQLite y envía resumen a través del evento `proxy://request`
- `get_proxy_logs_count_filtered(filter, errors_only)` / `get_proxy_logs_filtered(...)`: filtros y paginación de la página de lista
- `get_proxy_log_detail(log_id)`: carga el request/response body completo de un registro individual
- `export_proxy_logs(file_path)`: exporta todos los registros a un archivo JSON (la UI actual no expone botón)

</details>
