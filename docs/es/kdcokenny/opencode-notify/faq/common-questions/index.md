---
title: "Preguntas frecuentes de opencode-notify: Rendimiento, privacidad y compatibilidad"
sidebarTitle: "Preguntas clave"
subtitle: "FAQ: Rendimiento, privacidad y compatibilidad"
description: "Conoce el impacto de opencode-notify en el contexto de IA y el uso de recursos del sistema. Confirma que el plugin funciona completamente en local sin subir datos. Domina las estrategias de filtrado de notificaciones y la configuración de horarios silenciosos. Aprende sobre la compatibilidad con otros plugins de OpenCode y las diferencias funcionales entre macOS, Windows y Linux."
tags:
  - "FAQ"
  - "Rendimiento"
  - "Privacidad"
prerequisite:
  - "start-quick-start"
order: 120
---

# Preguntas frecuentes: Rendimiento, privacidad y compatibilidad

## Lo que aprenderás

- Comprender el impacto del plugin en el rendimiento y el uso de recursos
- Conocer las garantías de privacidad y seguridad
- Dominar las estrategias de notificación y técnicas de configuración
- Entender las diferencias entre plataformas y la compatibilidad

---

## Rendimiento

### ¿Aumenta el contexto de la IA?

**No**. El plugin utiliza un modelo basado en eventos y no añade herramientas ni prompts a la conversación con la IA.

Desde la implementación del código fuente:

| Componente | Tipo | Implementación | Impacto en el contexto |
| --- | --- | --- | --- |
| Escucha de eventos | Evento | Escucha eventos `session.idle`, `session.error`, `permission.updated` | ✅ Sin impacto |
| Hook de herramientas | Hook | Monitorea la herramienta `question` mediante `tool.execute.before` | ✅ Sin impacto |
| Contenido de conversación | - | No lee, no modifica, no inyecta contenido de conversación | ✅ Sin impacto |

El código fuente muestra que el plugin solo se encarga de **escuchar y notificar**, sin afectar el contexto de la conversación con la IA.

### ¿Cuántos recursos del sistema consume?

**Muy pocos**. El plugin utiliza un diseño de "caché al inicio + activación por eventos":

1. **Carga de configuración**: Lee el archivo de configuración una vez al iniciar (`~/.config/opencode/kdco-notify.json`), sin lecturas posteriores
2. **Detección de terminal**: Detecta el tipo de terminal al inicio y almacena la información en caché (nombre, Bundle ID, nombre del proceso), los eventos posteriores usan directamente la caché
3. **Basado en eventos**: Solo ejecuta la lógica de notificación cuando la IA dispara eventos específicos

Características del uso de recursos:

| Tipo de recurso | Consumo | Descripción |
| --- | --- | --- |
| CPU | Casi 0 | Solo se ejecuta brevemente cuando se disparan eventos |
| Memoria | < 5 MB | Entra en modo de espera después del inicio |
| Disco | < 100 KB | Archivo de configuración y código |
| Red | 0 | No realiza solicitudes de red |

---

## Privacidad y seguridad

### ¿Se suben datos al servidor?

**No**. El plugin funciona completamente en local, sin subir ningún dato.

**Garantías de privacidad**:

| Tipo de dato | Tratamiento | ¿Se sube? |
| --- | --- | --- |
| Contenido de conversación IA | No se lee ni almacena | ❌ No |
| Información de sesión (título) | Solo para texto de notificación | ❌ No |
| Información de error | Solo para texto de notificación (máx. 100 caracteres) | ❌ No |
| Información de terminal | Detectada y almacenada localmente | ❌ No |
| Configuración | Archivo local (`~/.config/opencode/`) | ❌ No |
| Contenido de notificación | Enviado mediante API nativa del sistema | ❌ No |

**Implementación técnica**:

El plugin utiliza notificaciones nativas del sistema:
- macOS: Llama a `NSUserNotificationCenter` mediante `node-notifier`
- Windows: Llama a `SnoreToast` mediante `node-notifier`
- Linux: Llama a `notify-send` mediante `node-notifier`

Todas las notificaciones se activan localmente, sin pasar por los servicios en la nube de OpenCode.

### ¿El plugin puede robar el contenido de mis sesiones?

**No**. El plugin solo lee **metadatos necesarios**:

| Datos leídos | Uso | Limitación |
| --- | --- | --- |
| Título de sesión (title) | Texto de notificación | Solo primeros 50 caracteres |
| Información de error (error) | Texto de notificación | Solo primeros 100 caracteres |
| Información de terminal | Detección de foco y enfoque al hacer clic | No lee contenido del terminal |
| Archivo de configuración | Ajustes personalizados | Archivo local |

El código fuente no contiene ninguna lógica para leer mensajes de conversación (messages) o entrada del usuario (user input).

---

## Estrategias de notificación

### ¿Me bombardeará con notificaciones?

**No**. El plugin incluye múltiples mecanismos de filtrado inteligente para evitar el bombardeo de notificaciones.

**Estrategia de notificación predeterminada**:

| Tipo | Evento/Herramienta | ¿Notifica? | Razón |
| --- | --- | --- | --- |
| Evento | Sesión padre completada (session.idle) | ✅ Sí | Tarea principal completada |
| Evento | Sesión hija completada (session.idle) | ❌ No | La sesión padre notificará |
| Evento | Error de sesión (session.error) | ✅ Sí | Requiere atención inmediata |
| Evento | Solicitud de permiso (permission.updated) | ✅ Sí | IA bloqueada esperando |
| Hook de herramienta | Pregunta (tool.execute.before - question) | ✅ Sí | IA necesita entrada |

**Mecanismos de filtrado inteligente**:

1. **Solo notifica sesiones padre**
   - Código fuente: `notify.ts:256-259`
   - Configuración predeterminada: `notifyChildSessions: false`
   - Evita notificaciones por cada subtarea cuando la IA divide el trabajo

2. **Supresión cuando el terminal está enfocado** (macOS)
   - Código fuente: `notify.ts:265`
   - Lógica: No envía notificaciones cuando el terminal es la ventana activa (comportamiento integrado, sin configuración)
   - Evita recordatorios redundantes cuando ya estás mirando el terminal
   - **Nota**: Esta función solo está disponible en macOS (requiere información del terminal para la detección)

3. **Horario silencioso**
   - Código fuente: `notify.ts:262`, `notify.ts:181-199`
   - Configuración predeterminada: `quietHours: { enabled: false, start: "22:00", end: "08:00" }`
   - Configurable para evitar interrupciones nocturnas

4. **Las solicitudes de permiso siempre notifican**
   - Código fuente: `notify.ts:319`
   - Razón: La IA está bloqueada esperando autorización del usuario, debe notificar inmediatamente
   - No verifica si es sesión padre

### ¿Puedo recibir solo ciertos tipos de notificaciones?

**Sí**. Aunque el plugin no tiene interruptores individuales para cada tipo de notificación, puedes lograrlo mediante el horario silencioso y la detección de foco del terminal:

- **Solo notificaciones urgentes**: La detección de foco del terminal es un comportamiento integrado; no recibirás notificaciones cuando estés en el terminal (macOS)
- **Solo notificaciones nocturnas**: Activa el horario silencioso (ej. 09:00-18:00), usándolo de forma inversa

Si necesitas un control más granular, considera enviar una Feature Request.

---

## Compatibilidad del plugin

### ¿Entrará en conflicto con otros plugins de OpenCode?

**No**. El plugin se integra mediante la API estándar de plugins de OpenCode, sin modificar el comportamiento de la IA ni interferir con otros plugins.

**Método de integración**:

| Componente | Método de integración | Riesgo de conflicto |
| --- | --- | --- |
| Escucha de eventos | Hook `event` del SDK de OpenCode | ❌ Sin conflicto |
| Hook de herramientas | Hook `tool.execute.before` de la API de plugins | ❌ Sin conflicto (solo escucha herramienta `question`) |
| Consulta de sesión | `client.session.get()` del SDK de OpenCode | ❌ Sin conflicto (solo lectura) |
| Envío de notificaciones | Proceso independiente `node-notifier` | ❌ Sin conflicto |

**Plugins que pueden coexistir**:

- Plugins oficiales de OpenCode (como `opencode-coder`)
- Plugins de terceros (como `opencode-db`, `opencode-browser`)
- Plugins personalizados

Todos los plugins funcionan en paralelo mediante la API estándar de plugins, sin interferencias mutuas.

### ¿Qué plataformas soporta? ¿Hay diferencias funcionales?

**Soporta macOS, Windows y Linux, pero con diferencias funcionales**.

| Función | macOS | Windows | Linux |
| --- | --- | --- | --- |
| Notificaciones nativas | ✅ Soportado | ✅ Soportado | ✅ Soportado |
| Sonidos personalizados | ✅ Soportado | ❌ No soportado | ❌ No soportado |
| Detección de foco del terminal | ✅ Soportado | ❌ No soportado | ❌ No soportado |
| Enfocar al hacer clic en notificación | ✅ Soportado | ❌ No soportado | ❌ No soportado |
| Detección automática de terminal | ✅ Soportado | ✅ Soportado | ✅ Soportado |
| Horario silencioso | ✅ Soportado | ✅ Soportado | ✅ Soportado |

**Razones de las diferencias entre plataformas**:

| Plataforma | Explicación |
| --- | --- |
| macOS | El sistema proporciona APIs de notificación e interfaces de gestión de aplicaciones completas (como `osascript`), soportando sonidos, detección de foco y enfoque al hacer clic |
| Windows | La API de notificaciones del sistema tiene funcionalidad limitada, no soporta detección de primer plano a nivel de aplicación ni personalización de sonidos |
| Linux | Depende del estándar `notify-send`, funcionalidad similar a Windows |

**Funciones principales multiplataforma**:

Independientemente de la plataforma, las siguientes funciones principales están disponibles:
- Notificación de tarea completada (session.idle)
- Notificación de error (session.error)
- Notificación de solicitud de permiso (permission.updated)
- Notificación de pregunta (tool.execute.before)
- Configuración de horario silencioso

---

## Terminal y sistema

### ¿Qué terminales soporta? ¿Cómo los detecta?

**Soporta más de 37 emuladores de terminal**.

El plugin utiliza la biblioteca [`detect-terminal`](https://github.com/jonschlinkert/detect-terminal) para identificar automáticamente el terminal. Los terminales soportados incluyen:

**Terminales macOS**:
- Ghostty, Kitty, iTerm2, WezTerm, Alacritty
- macOS Terminal, Hyper, Warp
- Terminal integrado de VS Code (Code / Code - Insiders)

**Terminales Windows**:
- Windows Terminal, Git Bash, ConEmu, Cmder
- PowerShell, CMD (mediante detección predeterminada)

**Terminales Linux**:
- gnome-terminal, konsole, xterm, lxterminal
- terminator, tilix, alacritty, kitty

**Mecanismo de detección**:

1. **Detección automática**: El plugin llama a la biblioteca `detectTerminal()` al iniciar
2. **Anulación manual**: El usuario puede especificar el campo `terminal` en el archivo de configuración para anular la detección automática
3. **Mapeo macOS**: El nombre del terminal se mapea al nombre del proceso (ej. `ghostty` → `Ghostty`), usado para la detección de foco

**Ejemplo de configuración**:

```json
{
  "terminal": "ghostty"
}
```

### ¿Qué pasa si falla la detección del terminal?

**El plugin seguirá funcionando normalmente, solo la función de detección de foco dejará de funcionar**.

**Lógica de manejo de fallos**:

| Escenario de fallo | Comportamiento | Impacto |
| --- | --- | --- |
| `detectTerminal()` devuelve `null` | Información del terminal: `{ name: null, bundleId: null, processName: null }` | Sin detección de foco, pero las notificaciones funcionan normalmente |
| Fallo de ejecución de `osascript` en macOS | Fallo al obtener Bundle ID | La función de enfoque al hacer clic en macOS no funciona, pero las notificaciones sí |
| Valor `terminal` inválido en configuración | Usa resultado de detección automática | Si la detección automática también falla, no hay detección de foco |

Lógica relacionada en el código fuente (`notify.ts:149-150`):

```typescript
if (!terminalName) {
  return { name: null, bundleId: null, processName: null }
}
```

**Solución**:

Si falla la detección del terminal, puedes especificar manualmente el tipo de terminal:

```json
{
  "terminal": "iterm2"
}
```

---

## Configuración y solución de problemas

### ¿Dónde está el archivo de configuración? ¿Cómo lo modifico?

**Ruta del archivo de configuración**: `~/.config/opencode/kdco-notify.json`

**Ejemplo de configuración completa**:

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
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": "ghostty"
}
```

**Pasos para modificar la configuración**:

1. Abre el terminal y edita el archivo de configuración:
   ```bash
   # macOS/Linux
   nano ~/.config/opencode/kdco-notify.json
   
   # Windows
   notepad %USERPROFILE%\.config\opencode\kdco-notify.json
   ```

2. Modifica las opciones de configuración (consulta el ejemplo anterior)

3. Guarda el archivo, la configuración se aplica automáticamente (no requiere reinicio)

### ¿Qué pasa si el archivo de configuración está corrupto?

**El plugin usará la configuración predeterminada y manejará el error silenciosamente**.

**Lógica de manejo de errores** (`notify.ts:110-113`):

```typescript
} catch {
  // Config doesn't exist or is invalid, use defaults
  return DEFAULT_CONFIG
}
```

**Solución**:

Si el archivo de configuración está corrupto (error de formato JSON), el plugin volverá a la configuración predeterminada. Pasos para reparar:

1. Elimina el archivo de configuración corrupto:
   ```bash
   rm ~/.config/opencode/kdco-notify.json
   ```

2. El plugin continuará funcionando con la configuración predeterminada

3. Si necesitas configuración personalizada, crea nuevamente el archivo de configuración

---

## Resumen de la lección

Esta lección responde a las preguntas más frecuentes de los usuarios:

- **Impacto en el rendimiento**: El plugin no aumenta el contexto de la IA, uso de recursos muy bajo (CPU casi 0, memoria < 5 MB)
- **Privacidad y seguridad**: Funciona completamente en local, no sube ningún dato, solo lee metadatos necesarios
- **Estrategias de notificación**: Mecanismos de filtrado inteligente (solo sesiones padre, supresión cuando el terminal está enfocado en macOS, horario silencioso)
- **Compatibilidad del plugin**: No entra en conflicto con otros plugins, soporta las tres plataformas principales pero con diferencias funcionales
- **Soporte de terminales**: Soporta más de 37 terminales, sigue funcionando normalmente si falla la detección automática

---

## Próxima lección

> En la próxima lección aprenderemos sobre **[Tipos de eventos](../../appendix/event-types/)**.
>
> Aprenderás:
> - Los cuatro tipos de eventos de OpenCode que escucha el plugin
> - El momento de activación y contenido de notificación de cada evento
> - Las reglas de filtrado de eventos (verificación de sesión padre, horario silencioso, foco del terminal)
> - Las diferencias en el manejo de eventos entre plataformas

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para ver las ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-27

| Función | Ruta del archivo | Líneas |
| --- | --- | --- |
| Inicio del plugin y carga de configuración | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L357-L364) | 357-364 |
| Lógica de escucha de eventos | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L372-L400) | 372-400 |
| Verificación de sesión padre | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L256-L259) | 256-259 |
| Verificación de horario silencioso | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L262) | 262 |
| Detección de foco del terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L265) | 265 |
| Carga del archivo de configuración | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| Detección de información del terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L176) | 145-176 |
| Definición de configuración predeterminada | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |

**Constantes clave**:
- `DEFAULT_CONFIG`: Configuración predeterminada (solo notifica sesiones padre, sonidos Glass/Basso/Submarine, horario silencioso desactivado por defecto)

**Funciones clave**:
- `loadConfig()`: Carga la configuración del usuario y la combina con los valores predeterminados
- `detectTerminalInfo()`: Detecta la información del terminal y la almacena en caché
- `isQuietHours()`: Verifica si la hora actual está dentro del horario silencioso
- `isTerminalFocused()`: Verifica si el terminal es la ventana activa (macOS)
- `isParentSession()`: Verifica si la sesión es una sesión padre

</details>
