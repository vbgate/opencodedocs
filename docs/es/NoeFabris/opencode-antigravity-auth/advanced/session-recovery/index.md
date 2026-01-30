---
title: "Recuperación de Sesión: Auto-Reparación de Interrupciones de Herramientas | Antigravity"
sidebarTitle: "Auto-Reparación de Interrupciones de Herramientas"
subtitle: "Recuperación de Sesión: Manejo Automático de Fallos y Interrupciones de Llamadas a Herramientas"
description: "Aprende el mecanismo de recuperación de sesión para manejar interrupciones y errores de herramientas automáticamente. Cubre detección de errores, inyección de tool_result sintético y configuración de auto_resume."
tags:
  - "advanced"
  - "session-recovery"
  - "error-handling"
  - "auto-recovery"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 8
---

# Recuperación de Sesión: Manejo Automático de Fallos de Llamadas a Herramientas

## Lo que Podrás Hacer Después de Este Tutorial

- Entender cómo el mecanismo de recuperación de sesión maneja automáticamente las interrupciones de ejecución de herramientas
- Configurar las opciones session_recovery y auto_resume
- Solucionar errores tool_result_missing y thinking_block_order
- Entender cómo funciona el tool_result sintético

## Tu Situación Actual

Al usar OpenCode, puedes encontrar estos escenarios de interrupción:

- Presionar ESC durante la ejecución de una herramienta, causando que la sesión se bloquee y requiera reintento manual
- Errores de orden de bloques de pensamiento (thinking_block_order), donde la IA no puede continuar generando
- Uso incorrecto de funciones de pensamiento en modelos que no soportan pensamiento (thinking_disabled_violation)
- Necesidad de reparar manualmente estados de sesión dañados, perdiendo tiempo

## Cuándo Usar Esta Técnica

La recuperación de sesión es adecuada para los siguientes escenarios:

| Escenario | Tipo de Error | Método de Recuperación |
|---|---|---|
| Presionar ESC para interrumpir herramienta | `tool_result_missing` | Inyección automática de tool_result sintético |
| Error de orden de bloques de pensamiento | `thinking_block_order` | Pre-posicionamiento automático de bloques de pensamiento vacíos |
| Pensamiento en modelo sin soporte | `thinking_disabled_violation` | Eliminación automática de todos los bloques de pensamiento |
| Todos los errores anteriores | General | Reparación automática + continue automático (si está habilitado) |

::: warning Verificaciones Previas
Antes de comenzar este tutorial, asegúrate de haber completado:
- ✅ Instalado el plugin opencode-antigravity-auth
- ✅ Puedes hacer solicitudes usando el modelo Antigravity
- ✅ Entiendes los conceptos básicos de llamadas a herramientas

[Tutorial de Instalación Rápida](../../start/quick-install/) | [Tutorial de Primera Solicitud](../../start/first-request/)
:::

## Concepto Central

El mecanismo central de recuperación de sesión:

1. **Detección de Errores**: Identificación automática de tres tipos de errores recuperables
   - `tool_result_missing`: Falta resultado durante la ejecución de herramienta
   - `thinking_block_order`: Error en el orden de bloques de pensamiento
   - `thinking_disabled_violation`: Pensamiento prohibido en modelo sin soporte

2. **Reparación Automática**: Inyección de mensajes sintéticos según el tipo de error
   - Inyección de tool_result sintético (contenido: "Operación cancelada por usuario (ESC presionado)")
   - Pre-posicionamiento de bloques de pensamiento vacíos (los bloques de pensamiento deben estar al inicio del mensaje)
   - Eliminación de todos los bloques de pensamiento (los modelos sin soporte no permiten pensamiento)

3. **Continuación Automática**: Si está habilitado `auto_resume`, se envía automáticamente el mensaje continue para reanudar el diálogo

4. **Manejo de Duplicados**: Uso de `Set` para evitar que el mismo error sea procesado repetidamente

::: info ¿Qué es un Mensaje Sintético?
Un mensaje sintético es un mensaje "virtual" inyectado por el plugin para reparar estados de sesión dañados. Por ejemplo, cuando una herramienta es interrumpida, el plugin inyecta un tool_result sintético que dice a la IA "esta herramienta fue cancelada", permitiendo que la IA continúe generando nuevas respuestas.
:::

## Sígueme

### Paso 1: Habilitar Recuperación de Sesión (Habilitada por Defecto)

**Por qué**
La recuperación de sesión está habilitada por defecto, pero si fue deshabilitada manualmente anteriormente, necesitas volver a habilitarla.

**Operación**

Edita el archivo de configuración del plugin:

```bash
# macOS/Linux
nano ~/.config/opencode/antigravity.json

# Windows
notepad %APPDATA%\opencode\antigravity.json
```

Confirma la siguiente configuración:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "session_recovery": true,
  "auto_resume": false,
  "quiet_mode": false
}
```

**Deberías ver**:

1. `session_recovery` como `true` (valor por defecto)
2. `auto_resume` como `false` (se recomienda continue manual para evitar operaciones accidentales)
3. `quiet_mode` como `false` (muestra notificaciones toast para conocer el estado de recuperación)

::: tip Explicación de Opciones de Configuración
- `session_recovery`: Habilita/deshabilita la función de recuperación de sesión
- `auto_resume`: Envía automáticamente el mensaje "continue" (usar con precaución, puede causar ejecución accidental por la IA)
- `quiet_mode`: Oculta las notificaciones toast (puede deshabilitarse durante depuración)
:::

### Paso 2: Probar Recuperación de tool_result_missing

**Por qué**
Verificar si el mecanismo de recuperación de sesión funciona normalmente cuando la ejecución de la herramienta es interrumpida.

**Operación**

1. Abre OpenCode, selecciona un modelo que soporte llamadas a herramientas (como `google/antigravity-claude-sonnet-4-5`)
2. Ingresa una tarea que requiera llamar a una herramienta (por ejemplo: "Ayúdame a ver los archivos del directorio actual")
3. Presiona `ESC` para interrumpir durante la ejecución de la herramienta

**Deberías ver**:

1. OpenCode detiene inmediatamente la ejecución de la herramienta
2. Aparece una notificación toast: "Tool Crash Recovery - Injecting cancelled tool results..."
3. La IA continúa generando automáticamente, sin esperar el resultado de la herramienta

::: info Principio del Error tool_result_missing
Cuando presionas ESC, OpenCode interrumpe la ejecución de la herramienta, causando que en la sesión aparezca `tool_use` pero falte el `tool_result` correspondiente. La API de Antigravity detecta esta inconsistencia y devuelve el error `tool_result_missing`. El plugin captura este error, inyecta un tool_result sintético, haciendo que la sesión recupere un estado consistente.
:::

### Paso 3: Probar Recuperación de thinking_block_order

**Por qué**
Verificar si el mecanismo de recuperación de sesión puede reparar automáticamente errores de orden de bloques de pensamiento.

**Operación**

1. Abre OpenCode, selecciona un modelo que soporte pensamiento (como `google/antigravity-claude-opus-4-5-thinking`)
2. Ingresa una tarea que requiera pensamiento profundo
3. Si encuentras el error "Expected thinking but found text" o "First block must be thinking"

**Deberías ver**:

1. Aparece una notificación toast: "Thinking Block Recovery - Fixing message structure..."
2. La sesión se repara automáticamente, la IA puede continuar generando

::: tip Causas del Error thinking_block_order
Este error suele ser causado por:
- Bloques de pensamiento eliminados accidentalmente (por ejemplo, a través de otras herramientas)
- Estado de sesión dañado (por ejemplo, fallo de escritura en disco)
- Incompatibilidad de formatos al migrar entre modelos
:::

### Paso 4: Probar Recuperación de thinking_disabled_violation

**Por qué**
Verificar si la recuperación de sesión puede eliminar automáticamente bloques de pensamiento al usar incorrectamente la función de pensamiento en modelos sin soporte.

**Operación**

1. Abre OpenCode, selecciona un modelo que no soporte pensamiento (como `google/antigravity-claude-sonnet-4-5`)
2. Si los mensajes históricos contienen bloques de pensamiento

**Deberías ver**:

1. Aparece una notificación toast: "Thinking Strip Recovery - Stripping thinking blocks..."
2. Todos los bloques de pensamiento se eliminan automáticamente
3. La IA puede continuar generando

::: warning Pérdida de Bloques de Pensamiento
Eliminar bloques de pensamiento causará pérdida del contenido de pensamiento de la IA, lo que puede afectar la calidad de la respuesta. Asegúrate de usar la función de pensamiento en modelos que la soporten.
:::

### Paso 5: Configurar auto_resume (Opcional)

**Por qué**
Después de habilitar auto_resume, se enviará automáticamente "continue" después de que se complete la recuperación de sesión, sin necesidad de operación manual.

**Operación**

Configura en `antigravity.json`:

```json
{
  "auto_resume": true
}
```

Guarda el archivo y reinicia OpenCode.

**Deberías ver**:

1. Después de completar la recuperación de sesión, la IA continúa generando automáticamente
2. No es necesario ingresar manualmente "continue"

::: danger Riesgos de auto_resume
Continuar automáticamente puede causar que la IA ejecute llamadas a herramientas accidentalmente. Si tienes dudas sobre la seguridad de las llamadas a herramientas, se recomienda mantener `auto_resume: false` y controlar manualmente el momento de recuperación.
:::

## Punto de Verificación ✅

Después de completar los pasos anteriores, deberías ser capaz de:

- [ ] Ver la configuración de session_recovery en `antigravity.json`
- [ ] Ver la notificación "Tool Crash Recovery" al presionar ESC para interrumpir una herramienta
- [ ] Recuperación automática de la sesión sin reintento manual
- [ ] Entender cómo funciona el synthetic tool_result
- [ ] Saber cuándo habilitar/deshabilitar auto_resume

## Advertencias de Problemas Comunes

### Recuperación de Sesión No Se Activa

**Síntoma**: Encuentras errores pero no hay recuperación automática

**Causa**: `session_recovery` está deshabilitado o el tipo de error no coincide

**Solución**:

1. Confirma que `session_recovery: true`:

```bash
grep session_recovery ~/.config/opencode/antigravity.json
```

2. Verifica si el tipo de error es recuperable:

```bash
# Habilita logs de depuración para ver información detallada del error
export DEBUG=session-recovery:*
opencode run "test" --model=google/antigravity-claude-sonnet-4-5
```

3. Revisa si hay logs de error en la consola:

```bash
# Ubicación de logs
~/.config/opencode/antigravity-logs/session-recovery.log
```

### Synthetic tool_result No Se Inyecta

**Síntoma**: Después de la interrupción de la herramienta, la IA sigue esperando el resultado de la herramienta

**Causa**: Configuración incorrecta de la ruta de almacenamiento de OpenCode

**Solución**:

1. Confirma que la ruta de almacenamiento de OpenCode es correcta:

```bash
# Ver configuración de OpenCode
cat ~/.config/opencode/opencode.json | grep storage
```

2. Verifica si existen los directorios de almacenamiento de mensajes y partes:

```bash
ls -la ~/.local/share/opencode/storage/message/
ls -la ~/.local/share/opencode/storage/part/
```

3. Si los directorios no existen, revisa la configuración de OpenCode

### Auto Resume Se Activa Inesperadamente

**Síntoma**: La IA continúa automáticamente en momentos inapropiados

**Causa**: `auto_resume` está configurado como `true`

**Solución**:

1. Desactiva auto_resume:

```json
{
  "auto_resume": false
}
```

2. Controla manualmente el momento de recuperación

### Notificaciones Toast Demasiado Frecuentes

**Síntoma**: Notificaciones de recuperación frecuentes que afectan la experiencia de uso

**Causa**: `quiet_mode` no está habilitado

**Solución**:

1. Habilita quiet_mode:

```json
{
  "quiet_mode": true
}
```

2. Si necesitas depurar, puedes desactivarlo temporalmente

## Resumen de Esta Lección

- El mecanismo de recuperación de sesión maneja automáticamente tres tipos de errores recuperables: tool_result_missing, thinking_block_order, thinking_disabled_violation
- El synthetic tool_result es clave para reparar el estado de la sesión, con contenido inyectado "Operación cancelada por usuario (ESC presionado)"
- session_recovery está habilitado por defecto, auto_resume está deshabilitado por defecto (se recomienda control manual)
- La recuperación de bloques de pensamiento (thinking_block_order) pre-posiciona bloques de pensamiento vacíos, permitiendo que la IA regenere el contenido de pensamiento
- La eliminación de bloques de pensamiento (thinking_disabled_violation) causará pérdida del contenido de pensamiento, asegúrate de usar la función de pensamiento en modelos que la soporten

## Avance del Próximo Tutorial

> En el próximo tutorial aprenderemos sobre **[Mecanismo de Transformación de Solicitudes](../request-transformation/)**.
>
> Aprenderás:
> - Diferencias entre formatos de solicitud de Claude y Gemini
> - Reglas de limpieza y transformación de Tool Schema
> - Mecanismo de inyección de firma de bloques de pensamiento
> - Método de configuración de Google Search Grounding

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Funcionalidad | Ruta del Archivo | Línea |
|---|---|---|
| Lógica principal de recuperación de sesión | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts) | Completo |
| Detección de tipos de error | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L85-L110) | 85-110 |
| Recuperación de tool_result_missing | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L143-L183) | 143-183 |
| Recuperación de thinking_block_order | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L188-L217) | 188-217 |
| Recuperación de thinking_disabled_violation | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L222-L240) | 222-240 |
| Funciones de almacenamiento | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts) | Completo |
| Lectura de mensajes | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L53-L78) | 53-78 |
| Lectura de partes (part) | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L84-L104) | 84-104 |
| Pre-posicionamiento de bloques de pensamiento | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L233-L256) | 233-256 |
| Eliminación de bloques de pensamiento | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L258-L283) | 258-283 |
| Definiciones de tipos | [`src/plugin/recovery/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/types.ts) | Completo |

**Constantes Clave**:

| Nombre de Constante | Valor | Descripción |
|---|---|---|
| `RECOVERY_RESUME_TEXT` | `"[session recovered - continuing previous task]"` | Texto de recuperación enviado durante Auto Resume |
| `THINKING_TYPES` | `Set(["thinking", "redacted_thinking", "reasoning"])` | Conjunto de tipos de bloques de pensamiento |
| `META_TYPES` | `Set(["step-start", "step-finish"])` | Conjunto de tipos de metadatos |
| `CONTENT_TYPES` | `Set(["text", "tool", "tool_use", "tool_result"])` | Conjunto de tipos de contenido |

**Funciones Clave**:

- `detectErrorType(error: unknown): RecoveryErrorType`: Detecta el tipo de error, devuelve `"tool_result_missing"`, `"thinking_block_order"`, `"thinking_disabled_violation"` o `null`
- `isRecoverableError(error: unknown): boolean`: Determina si el error es recuperable
- `createSessionRecoveryHook(ctx, config): SessionRecoveryHook | null`: Crea el hook de recuperación de sesión
- `recoverToolResultMissing(client, sessionID, failedMsg): Promise<boolean>`: Recupera el error tool_result_missing
- `recoverThinkingBlockOrder(sessionID, failedMsg, error): Promise<boolean>`: Recupera el error thinking_block_order
- `recoverThinkingDisabledViolation(sessionID, failedMsg): Promise<boolean>`: Recupera el error thinking_disabled_violation
- `readMessages(sessionID): StoredMessageMeta[]`: Lee todos los mensajes de la sesión
- `readParts(messageID): StoredPart[]`: Lee todas las partes (parts) del mensaje
- `prependThinkingPart(sessionID, messageID): boolean`: Pre-posiciona un bloque de pensamiento vacío al inicio del mensaje
- `stripThinkingParts(messageID): boolean`: Elimina todos los bloques de pensamiento del mensaje

**Opciones de Configuración** (de schema.ts):

| Opción de Configuración | Tipo | Valor por Defecto | Descripción |
|---|---|---|---|
| `session_recovery` | boolean | `true` | Habilita la función de recuperación de sesión |
| `auto_resume` | boolean | `false` | Envía automáticamente el mensaje "continue" |
| `quiet_mode` | boolean | `false` | Oculta las notificaciones toast |

</details>