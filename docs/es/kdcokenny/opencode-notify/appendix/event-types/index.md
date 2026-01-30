---
title: "Tipos de Eventos: Cuándo se Disparan las Notificaciones de OpenCode | opencode-notify"
sidebarTitle: "Cuándo se Envían las Notificaciones"
subtitle: "Tipos de Eventos: Cuándo se Disparan las Notificaciones de OpenCode"
description: "Aprende los tipos de eventos de OpenCode que escucha el complemento opencode-notify, dominando las condiciones de activación y reglas de filtrado de session.idle, session.error, permission.updated y tool.execute.before."
tags:
  - "Apéndice"
  - "Tipos de Eventos"
  - "OpenCode"
prerequisite: []
order: 130
---

# Tipos de Eventos: Cuándo se Disparan las Notificaciones de OpenCode

Esta página enumera los **tipos de eventos de OpenCode** que escucha el complemento `opencode-notify` junto con sus condiciones de activación. El complemento escucha cuatro eventos: session.idle, session.error, permission.updated y tool.execute.before. Comprender los momentos de activación y las reglas de filtrado de estos eventos ayuda a configurar mejor el comportamiento de notificación.

## Resumen de Tipos de Eventos

| Tipo de Evento | Momento de Activación | Título de Notificación | Sonido Predeterminado | Verifica Sesión Padre | Verifica Foco del Terminal |
|--- | --- | --- | --- | --- | ---|
| `session.idle` | La sesión de AI entra en estado inactivo | "Ready for review" | Glass | ✅ | ✅ |
| `session.error` | La sesión de AI ejecuta con error | "Something went wrong" | Basso | ✅ | ✅ |
| `permission.updated` | AI necesita autorización del usuario | "Waiting for you" | Submarine | ❌ | ✅ |
| `tool.execute.before` | AI pregunta (herramienta question) | "Question for you" | Submarine* | ❌ | ❌ |

> *Nota: el evento question usa el sonido de permission por defecto, se puede personalizar mediante configuración

## Explicación Detallada de Eventos

### session.idle

**Condición de activación**: La sesión de AI entra en estado inactivo después de completar la tarea

**Contenido de notificación**:
- Título: `Ready for review`
- Mensaje: Título de la sesión (máximo 50 caracteres)

**Lógica de procesamiento**:
1. Verifica si es sesión padre (cuando `notifyChildSessions=false`)
2. Verifica si está en horario silencioso
3. Verifica si el terminal tiene el foco (suprime notificación cuando está enfocado)
4. Envía notificación nativa

**Ubicación del código fuente**: `src/notify.ts:249-284`

---

### session.error

**Condición de activación**: Ocurre un error durante la ejecución de la sesión de AI

**Contenido de notificación**:
- Título: `Something went wrong`
- Mensaje: Resumen del error (máximo 100 caracteres)

**Lógica de procesamiento**:
1. Verifica si es sesión padre (cuando `notifyChildSessions=false`)
2. Verifica si está en horario silencioso
3. Verifica si el terminal tiene el foco (suprime notificación cuando está enfocado)
4. Envía notificación nativa

**Ubicación del código fuente**: `src/notify.ts:286-313`

---

### permission.updated

**Condición de activación**: AI necesita autorización del usuario para ejecutar una operación

**Contenido de notificación**:
- Título: `Waiting for you`
- Mensaje: `OpenCode needs your input`

**Lógica de procesamiento**:
1. **No verifica sesión padre** (las solicitudes de permiso siempre requieren manejo manual)
2. Verifica si está en horario silencioso
3. Verifica si el terminal tiene el foco (suprime notificación cuando está enfocado)
4. Envía notificación nativa

**Ubicación del código fuente**: `src/notify.ts:315-334`

---

### tool.execute.before

**Condición de activación**: Antes de que AI ejecute una herramienta, cuando el nombre de la herramienta es `question`

**Contenido de notificación**:
- Título: `Question for you`
- Mensaje: `OpenCode needs your input`

**Lógica de procesamiento**:
1. **No verifica sesión padre**
2. **No verifica foco del terminal** (soporta flujo de trabajo tmux)
3. Verifica si está en horario silencioso
4. Envía notificación nativa

**Nota especial**: Este evento no realiza detección de foco para permitir recibir notificaciones normalmente en el flujo de trabajo de múltiples ventanas de tmux.

**Ubicación del código fuente**: `src/notify.ts:336-351`

## Condiciones de Activación y Reglas de Filtrado

### Verificación de Sesión Padre

Por defecto, el complemento solo notifica sesiones padre (sesiones raíz), evitando que las subtareas generen muchas notificaciones.

**Lógica de verificación**:
- Obtiene información de la sesión a través de `client.session.get()`
- Si la sesión tiene `parentID`, se omite la notificación

**Opciones de configuración**:
- `notifyChildSessions: false` (predeterminado) - solo notifica sesiones padre
- `notifyChildSessions: true` - notifica todas las sesiones

**Eventos aplicables**:
- `session.idle` ✅
- `session.error` ✅
- `permission.updated` ❌ (no verifica)
- `tool.execute.before` ❌ (no verifica)

### Verificación de Horario Silencioso

Durante el horario silencioso configurado, no se envía ninguna notificación.

**Lógica de verificación**:
- Lee `quietHours.enabled`, `quietHours.start`, `quietHours.end`
- Soporta horarios que cruzan la medianoche (ej. 22:00-08:00)

**Eventos aplicables**:
- Todos los eventos ✅

### Verificación de Foco del Terminal

Cuando el usuario está viendo el terminal, se suprimen las notificaciones para evitar recordatorios repetidos.

**Lógica de verificación**:
- macOS: Obtiene el nombre de la aplicación en primer plano a través de `osascript`
- Compara `frontmostApp` con `processName` del terminal

**Eventos aplicables**:
- `session.idle` ✅
- `session.error` ✅
- `permission.updated` ✅
- `tool.execute.before` ❌ (no verifica, soporta tmux)

## Diferencias de Plataforma

| Funcionalidad | macOS | Windows | Linux |
|--- | --- | --- | ---|
| Notificación nativa | ✅ | ✅ | ✅ |
| Detección de foco del terminal | ✅ | ❌ | ❌ |
| Clic en notificación enfoca terminal | ✅ | ❌ | ❌ |
| Sonidos personalizados | ✅ | ❌ | ❌ |

## Impacto de la Configuración

El comportamiento de notificación se puede personalizar mediante el archivo de configuración:

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine",
    "question": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**Tutoriales relacionados**:
- [Referencia de configuración](../../advanced/config-reference/)
- [Explicación detallada de horario silencioso](../../advanced/quiet-hours/)

---

## Vista Previa de la Próxima Lección

> En la próxima lección aprenderemos **[Ejemplo de archivo de configuración](../config-file-example/)**.
>
> Aprenderás:
> > - Plantilla completa de archivo de configuración
> > - Comentarios detallados de todos los campos de configuración
> > - Explicación de valores predeterminados del archivo de configuración

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-27

| Tipo de Evento | Ruta del Archivo | Números de Línea | Función de Manejo |
|--- | --- | --- | ---|
| session.idle | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L249-L284) | 249-284 | `handleSessionIdle` |
| session.error | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L286-L313) | 286-313 | `handleSessionError` |
| permission.updated | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L315-L334) | 315-334 | `handlePermissionUpdated` |
| tool.execute.before | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L336-L351) | 336-351 | `handleQuestionAsked` |
| Configuración de escucha de eventos | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L367-L402) | 367-402 | `NotifyPlugin` |

**Constantes clave**:
- `DEFAULT_CONFIG` (L56-68): configuración predeterminada, incluye configuración de sonidos y horario silencioso
- `TERMINAL_PROCESS_NAMES` (L71-84): mapeo de nombres de terminal a nombres de procesos de macOS

**Funciones clave**:
- `sendNotification()` (L227-243): envía notificación nativa, maneja funcionalidad de enfoque de macOS
- `isParentSession()` (L205-214): verifica si es sesión padre
- `isQuietHours()` (L181-199): verifica si está en horario silencioso
- `isTerminalFocused()` (L166-175): verifica si el terminal tiene el foco (solo macOS)

</details>
