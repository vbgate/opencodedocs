---
title: "Interrupción en Streaming: Solución de 0 Token | Antigravity-Manager"
sidebarTitle: "Auto-recuperación o intervención manual"
subtitle: "Interrupción en streaming/0 Token/Firma inválida: Mecanismo de auto-recuperación y ruta de diagnóstico"
description: "Aprende la ruta de diagnóstico de Antigravity Tools para interrupciones en streaming, 0 Token y firmas inválidas. Confirma llamadas a /v1/messages o streaming de Gemini, entiende el pre-lectura peek y reintentos con retroceso, y combina Proxy Monitor y registros para localizar rápidamente la causa y determinar si necesitas rotar cuentas."
tags:
  - "faq"
  - "streaming"
  - "troubleshooting"
  - "retry"
prerequisite:
  - "start-getting-started"
  - "start-first-run-data"
  - "advanced-monitoring"
  - "advanced-scheduling"
order: 5
---

# Interrupción en streaming/0 Token/Firma inválida: Mecanismo de auto-recuperación y ruta de diagnóstico

En Antigravity Tools, al llamar a `/v1/messages` (compatible con Anthropic) o a la interfaz de streaming nativa de Gemini, si encuentras problemas como "interrupción de la salida en streaming", "200 OK pero 0 Token" o "Invalid `signature`", esta lección te proporciona una ruta de diagnóstico desde la interfaz de usuario hasta los registros.

## Lo que podrás hacer al finalizar

- Saber que los problemas de 0 Token/interrupción generalmente se bloquean primero por el "pre-lectura peek" en el proxy
- Poder confirmar la cuenta y el modelo mapeado (`X-Account-Email` / `X-Mapped-Model`) de esta solicitud en Proxy Monitor
- Poder determinar a través de los registros si es "fallecimiento temprano del flujo ascendente", "reintento con retroceso", "rotación de cuentas" o "reintento de corrección de firma"
- Saber en qué situaciones esperar a que el proxy se auto-recupere y en cuáles intervención manual es necesaria

## Tu situación actual

Podrías estar viendo estos "fenómenos", pero no saber por dónde empezar:

- La salida en streaming se interrumpe a la mitad, el cliente parece "congelado" y ya no continúa
- 200 OK, pero `usage.output_tokens=0` o el contenido está vacío
- En errores 400 aparece `Invalid \`signature\``, `Corrupted thought signature`, `must be \`thinking\``, etc.

Estos problemas mayormente no son "escribiste mal tu solicitud", sino que son causados por transmisión en streaming, limitación/fluctuación del flujo ascendente, o bloques de firma en el historial de mensajes que activaron la validación del flujo ascendente. Antigravity Tools ha implementado múltiples líneas de defensa en la capa del proxy, solo necesitas verificar a qué paso se atascó siguiendo una ruta fija.

## ¿Qué es 0 Token?

**0 Token** generalmente se refiere a que una solicitud finalmente devuelve `output_tokens=0` y parece que "no generó contenido". En Antigravity Tools, la causa más común es "la respuesta en streaming terminó/produjo un error antes de emitir realmente la salida", en lugar de que el modelo realmente generara 0 tokens. El proxy intentará usar el pre-lectura peek para bloquear este tipo de respuestas vacías y activar un reintento.

## Las tres cosas que hace el proxy en segundo plano (primero construye un modelo mental)

### 1) Las solicitudes no en streaming pueden convertirse automáticamente en streaming

En la ruta `/v1/messages`, el proxy convertirá internamente "solicitudes no en streaming del cliente" en solicitudes en streaming para pedir al flujo ascendente, y después de recibir SSE recopilará y devolverá como JSON (la razón se indica en los registros como "better quota").

Evidencia del código fuente: `src-tauri/src/proxy/handlers/claude.rs#L665-L913`.

### 2) Peek pre-lectura: espera a obtener el "primer bloque de datos válido" antes de entregar el flujo al cliente

Para la salida SSE de `/v1/messages`, el proxy primero hará `timeout + next()` para pre-leer, saltando líneas de comentarios/latidos (que empiezan con `:`), hasta obtener el primer bloque de datos que "no esté vacío, no sea un latido" antes de comenzar el reenvío formal. Si en la fase peek ocurre un error/tiempo de espera/finalización del flujo, entrará directamente al siguiente intento (el siguiente intento generalmente activará la rotación de cuentas).

Evidencia del código fuente: `src-tauri/src/proxy/handlers/claude.rs#L812-L926`; El streaming nativo de Gemini también tiene un peek similar: `src-tauri/src/proxy/handlers/gemini.rs#L117-L149`.

### 3) Reintento unificado con retroceso + decidir "si rotar cuentas" basado en códigos de estado

El proxy ha definido estrategias de retroceso claras para códigos de estado comunes, y define qué códigos de estado activarán la rotación de cuentas.

Evidencia del código fuente: `src-tauri/src/proxy/handlers/claude.rs#L117-L236`.

## 🎒 Preparativos previos

- Puedes abrir Proxy Monitor (ver [Proxy Monitor: Registros de solicitudes, filtros, restauración de detalles y exportación](../../advanced/monitoring/))
- Sabes que los registros están en el directorio de datos en `logs/` (ver [Primera ejecución: Directorio de datos, registros, bandeja y inicio automático](../../start/first-run-data/))

## Sigue mis pasos

### Paso 1: Confirma qué ruta de interfaz estás llamando

**Por qué**
Los detalles de auto-recuperación de `/v1/messages` (claude handler) y Gemini nativo (gemini handler) son diferentes, confirmar primero la ruta evita que pierdas tiempo en palabras clave de registro incorrectas.

Abre Proxy Monitor, encuentra esa solicitud fallida, primero anota la Ruta:

- `/v1/messages`: mira la lógica de `src-tauri/src/proxy/handlers/claude.rs`
- `/v1beta/models/...:streamGenerateContent`: mira la lógica de `src-tauri/src/proxy/handlers/gemini.rs`

**Lo que deberías ver**: en el registro de solicitudes puedes ver URL/método/código de estado (y tiempo de solicitud).

### Paso 2: Captura "cuenta + modelo mapeado" desde el encabezado de respuesta

**Por qué**
Para la misma solicitud fallida/exitosa, muchas veces depende de "qué cuenta se eligió esta vez", "a qué modelo de flujo ascendente se enrutó". El proxy escribirá esta información en los encabezados de respuesta, primero anótala, luego al ver los registros podrás identificarla.

En esa solicitud fallida, busca estos encabezados de respuesta:

- `X-Account-Email`
- `X-Mapped-Model`

Estos dos elementos se configuran tanto en `/v1/messages` como en el handler de Gemini (por ejemplo, en la respuesta SSE de `/v1/messages`: `src-tauri/src/proxy/handlers/claude.rs#L887-L896`; Gemini SSE: `src-tauri/src/proxy/handlers/gemini.rs#L235-L245`).

**Lo que deberías ver**: `X-Account-Email` es el correo electrónico, `X-Mapped-Model` es el nombre del modelo solicitado realmente.

### Paso 3: En app.log determina si "falló en la fase peek"

**Por qué**
El fallo peek generalmente significa que "el flujo ascendente nunca comenzó a emitir datos válidos". Este tipo de problema la forma más común de manejar es reintento/rotación de cuentas, necesitas confirmar si el proxy lo activó.

Primero ubica el archivo de registro (el directorio de registros proviene de `logs/` del directorio de datos, y escribe en `app.log*` rotando por día).

::: code-group

```bash [macOS/Linux]
ls -lt "$HOME/.antigravity_tools/logs" | head
```

```powershell [Windows]
Get-ChildItem -Force (Join-Path $HOME ".antigravity_tools\logs") | Sort-Object LastWriteTime -Descending | Select-Object -First 5
```

:::

Luego en el `app.log*` más reciente busca estas palabras clave:

- `/v1/messages` (claude handler): `Stream error during peek` / `Stream ended during peek` / `Timeout waiting for first data` (`src-tauri/src/proxy/handlers/claude.rs#L828-L864`)
- Streaming nativo de Gemini: `[Gemini] Empty first chunk received, retrying...` / `Stream error during peek` / `Stream ended immediately` (`src-tauri/src/proxy/handlers/gemini.rs#L117-L144`)

**Lo que deberías ver**: si se activó el reintento peek, en los registros aparecerán advertencias similares a "retrying...", y posteriormente entrará al siguiente intento (generalmente traerá rotación de cuentas).

### Paso 4: Si es 400/Invalid `signature`, confirma si el proxy hizo "reintento de corrección de firma"

**Por qué**
Los errores de tipo firma frecuentemente provienen de bloques de Thinking/bloques de firma en el historial de mensajes que no cumplen con los requisitos del flujo ascendente. Antigravity Tools intentará "degradar bloques thinking históricos + inyectar prompt de corrección" y luego reintentar, primero deberías dejar que termine su auto-recuperación.

Puedes juzgar si entró en la lógica de corrección con 2 señales:

1. En los registros aparece `Unexpected thinking signature error ... Retrying with all thinking blocks removed.` (`src-tauri/src/proxy/handlers/claude.rs#L999-L1025`)
2. Posteriormente convertirá los bloques `Thinking` históricos en `Text`, y agregará el prompt de corrección al último mensaje de usuario (`src-tauri/src/proxy/handlers/claude.rs#L1027-L1102`; El handler de Gemini también agregará el mismo prompt a `contents[].parts`: `src-tauri/src/proxy/handlers/gemini.rs#L300-L325`)

**Lo que deberías ver**: el proxy reintentará automáticamente después de una breve demora (`FixedDelay`), y puede entrar al siguiente intento.

## Puntos de verificación ✅

- [ ] Puedes confirmar la ruta de solicitud en Proxy Monitor (`/v1/messages` o Gemini nativo)
- [ ] Puedes obtener el `X-Account-Email` y `X-Mapped-Model` de esta solicitud
- [ ] Puedes buscar palabras clave relacionadas con peek/reintentos en `logs/app.log*`
- [ ] Cuando encuentras un error de firma 400, puedes confirmar si el proxy entró en la lógica de reintento de "prompt de corrección + limpieza de bloques thinking"

## Advertencias sobre trampas comunes

| Escenario | Lo que podrías hacer (❌) | Comportamiento recomendado (✓) |
| --- | --- | --- |
| Al ver 0 Token inmediatamente reintentar manualmente muchas veces | Presionar continuamente el botón de reintento del cliente, sin ver los registros | Primero mirar una vez Proxy Monitor + app.log, confirmar si es fallecimiento temprano en la fase peek (se reintentará/rotará automáticamente) |
| Al encontrar `Invalid \`signature\`` directamente vaciar el directorio de datos | Borrar todo `.antigravity_tools`, cuentas/estadísticas todas perdidas | Primero dejar que el proxy ejecute una vez "reintento de corrección de firma"; solo cuando los registros indiquen explícitamente que no es recuperable, considerar intervención manual |
| Tratar "fluctuación del servidor" como "cuenta dañada" | Rotar cuentas incondicionalmente para 400/503/529 | La efectividad de la rotación depende del código de estado; el proxy en sí tiene reglas `should_rotate_account(...)` (`src-tauri/src/proxy/handlers/claude.rs#L226-L236`) |

## Resumen de esta lección

- Los problemas de 0 Token/interrupción en streaming generalmente primero pasan por el pre-lectura peek en el proxy; el fallo en la fase peek activará reintentos y entrará al siguiente intento
- `/v1/messages` puede convertir internamente solicitudes no en streaming a streaming y luego recopilar de vuelta a JSON, esto afecta tu comprensión de "por qué parece un problema de streaming"
- Para errores 400 de tipo firma inválida, el proxy intentará "prompt de corrección + limpieza de bloques thinking" y luego reintentar, primero debes verificar si esta ruta de auto-recuperación funciona

## Próxima lección

> En la próxima lección aprenderemos **[Hoja de referencia de endpoints](../../appendix/endpoints/)**.

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta del archivo | Número de línea |
| --- | --- | --- |
| Claude handler: estrategia de reintentos con retroceso + reglas de rotación | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L117-L236) | 117-236 |
| Claude handler: convertir internamente no streaming a streaming (better quota) | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L665-L776) | 665-776 |
| Claude handler: peek pre-lectura (saltar latidos/comentarios, evitar flujo vacío) | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L812-L926) | 812-926 |
| Claude handler: reintentos de corrección para errores 400 de firma/orden de bloque | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L999-L1102) | 999-1102 |
| Gemini handler: peek pre-lectura (evitar flujo vacío 200 OK) | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L117-L149) | 117-149 |
| Gemini handler: inyección de prompt de corrección para errores de firma 400 | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L300-L325) | 300-325 |
| Caché de firmas (tres niveles: tool/family/session, incluye TTL/longitud mínima) | [`src-tauri/src/proxy/signature_cache.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/signature_cache.rs#L5-L207) | 5-207 |
| Conversión Claude SSE: capturar firma y escribir en caché de firmas | [`src-tauri/src/proxy/mappers/claude/streaming.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/streaming.rs#L639-L787) | 639-787 |

**Constantes clave**:
- `MAX_RETRY_ATTEMPTS = 3`: número máximo de reintentos (`src-tauri/src/proxy/handlers/claude.rs#L27`)
- `SIGNATURE_TTL = 2 * 60 * 60` segundos: TTL de caché de firmas (`src-tauri/src/proxy/signature_cache.rs#L6`)
- `MIN_SIGNATURE_LENGTH = 50`: longitud mínima de firma (`src-tauri/src/proxy/signature_cache.rs#L7`)

**Funciones clave**:
- `determine_retry_strategy(...)`: seleccionar estrategia de retroceso según código de estado (`src-tauri/src/proxy/handlers/claude.rs#L117-L167`)
- `should_rotate_account(...)`: decidir si rotar cuenta según código de estado (`src-tauri/src/proxy/handlers/claude.rs#L226-L236`)
- `SignatureCache::cache_session_signature(...)`: cachear firma de sesión (`src-tauri/src/proxy/signature_cache.rs#L149-L188`)

</details>
