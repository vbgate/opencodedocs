---
title: "Referencia de Configuración de opencode-notify: Guía Completa de Opciones y Diferencias de Plataforma"
sidebarTitle: "Personalizar Comportamiento de Notificaciones"
subtitle: "Referencia de Configuración: Guía Completa de Opciones"
description: "Aprende la referencia completa de opciones de configuración de opencode-notify, incluyendo notificaciones de subsesiones, sonidos personalizados, horas silenciosas y anulación de tipo de terminal. Este tutorial proporciona explicaciones detalladas de parámetros de configuración, valores predeterminados, diferencias de plataforma y ejemplos completos para ayudarte a personalizar el comportamiento de notificaciones, optimizar tu flujo de trabajo y dominar las técnicas de configuración en macOS, Windows y Linux."
tags:
  - "Referencia de Configuración"
  - "Configuración Avanzada"
prerequisite:
  - "start-quick-start"
order: 70
---

# Referencia de Configuración

## Qué Aprenderás

- ✅ Comprender todos los parámetros configurables y sus significados
- ✅ Personalizar el comportamiento de notificaciones según tus necesidades
- ✅ Configurar horas silenciosas para evitar interrupciones en momentos específicos
- ✅ Entender el impacto de las diferencias de plataforma en la configuración

## Tu Situación Actual

La configuración predeterminada es suficiente, pero tu flujo de trabajo puede ser especial:
- Necesitas recibir notificaciones importantes también durante la noche, pero no quieres ser interrumpido normalmente
- Trabajas con múltiples sesiones en paralelo y deseas recibir notificaciones de todas las sesiones
- Trabajas en tmux y descubres que la detección de enfoque no funciona como esperabas
- Quieres saber qué hace exactamente un parámetro de configuración

## Cuándo Usar Esta Guía

- **Necesitas personalizar el comportamiento de notificaciones** - La configuración predeterminada no satisface tus hábitos de trabajo
- **Quieres reducir las interrupciones de notificaciones** - Configura horas silenciosas o el interruptor de subsesiones
- **Quieres depurar el comportamiento del plugin** - Comprende el propósito de cada parámetro de configuración
- **Usas múltiples plataformas** - Entiende el impacto de las diferencias de plataforma en la configuración

## Conceptos Fundamentales

El archivo de configuración te permite ajustar el comportamiento del plugin sin modificar el código, como un "menú de configuración" para el plugin. El archivo de configuración está en formato JSON y se ubica en `~/.config/opencode/kdco-notify.json`.

**Flujo de Carga de Configuración**:

```
Inicio del Plugin
    ↓
Lectura del Archivo de Configuración del Usuario
    ↓
Fusión con Configuración Predeterminada (Configuración del Usuario Prioritaria)
    ↓
Ejecución con la Configuración Fusionada
```

::: info Ruta del Archivo de Configuración
`~/.config/opencode/kdco-notify.json`
:::

## 📋 Descripción de Parámetros de Configuración

### Estructura Completa de Configuración

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
  },
  "terminal": ""
}
```

### Descripción Detallada de Parámetros

#### notifyChildSessions

| Parámetro | Tipo | Valor Predeterminado | Descripción |
| --- | --- | --- | ---|
| `notifyChildSessions` | boolean | `false` | Si se notifican las subsesiones |

**Función**: Controla si se envían notificaciones para subsesiones (sub-session).

**¿Qué es una Subsesión?**
Cuando usas la función de múltiples sesiones de OpenCode, las sesiones pueden dividirse en sesiones padre y subsesiones. Las subsesiones generalmente son tareas auxiliares iniciadas por la sesión padre, como lectura/escritura de archivos, solicitudes de red, etc.

**Comportamiento Predeterminado** (`false`):
- Solo se notifican eventos de completado, error y solicitud de permisos de la sesión padre
- No se notifican eventos de las subsesiones
- Esto evita recibir demasiadas notificaciones cuando se ejecutan múltiples tareas en paralelo

**Después de Habilitar** (`true`):
- Todas las sesiones (padres y subsesiones) serán notificadas
- Adecuado para escenarios donde se necesita rastrear el progreso de todas las subtareas

::: tip Configuración Recomendada
Mantén el valor predeterminado `false` a menos que realmente necesites rastrear el estado de cada subtarea.
:::

#### Detección de Enfoque (macOS)

El plugin detecta automáticamente si el terminal está en primer plano. Si el terminal es la ventana activa, suprime el envío de notificaciones para evitar recordatorios repetidos.

**Principio de Funcionamiento**:
- Usa `osascript` de macOS para detectar la aplicación en primer plano actual
- Compara el nombre del proceso de la aplicación en primer plano con el nombre del proceso de tu terminal
- Si el terminal está en primer plano, no envía notificaciones
- **Excepto notificaciones de preguntas** (para soportar flujos de trabajo con tmux)

::: info Diferencias de Plataforma
La función de detección de enfoque solo funciona en macOS. Windows y Linux no soportan esta característica.
:::

#### sounds

| Parámetro | Tipo | Valor Predeterminado | Soporte de Plataforma | Descripción |
| --- | --- | --- | --- | ---|
| `sounds.idle` | string | `"Glass"` | ✅ macOS | Sonido de tarea completada |
| `sounds.error` | string | `"Basso"` | ✅ macOS | Sonido de notificación de error |
| `sounds.permission` | string | `"Submarine"` | ✅ macOS | Sonido de solicitud de permisos |
| `sounds.question` | string | No configurado | ✅ macOS | Sonido de pregunta (opcional) |

**Función**: Establece diferentes sonidos del sistema para diferentes tipos de notificaciones (solo macOS).

**Lista de Sonidos Disponibles**:

| Nombre del Sonido | Características de Sonido | Escenario Recomendado |
| --- | --- | ---|
| Glass | Alegre, nítido | Tarea completada (predeterminado) |
| Basso | Grave, advertencia | Notificación de error (predeterminado) |
| Submarine | Recordatorio, suave | Solicitud de permisos (predeterminado) |
| Blow | Potente | Eventos importantes |
| Bottle | Nítido | Subtarea completada |
| Frog | Relajado | Recordatorio informal |
| Funk | Rítmico | Múltiples tareas completadas |
| Hero | Magnífico | Hito completado |
| Morse | Código Morse | Depuración relacionada |
| Ping | Nítido | Recordatorio ligero |
| Pop | Breve | Tarea rápida |
| Purr | Suave | Recordatorio no intrusivo |
| Sosumi | Único | Eventos especiales |
| Tink | Brillante | Pequeña tarea completada |

**Nota sobre el campo question**:
`sonidos.pregunta` es un campo opcional utilizado para notificaciones de preguntas de IA. Si no está configurado, se utilizará el sonido de `permiso`.

::: tip Consejos de Configuración de Sonidos
- Usa sonidos alegres para indicar éxito (idle)
- Usa sonidos graves para indicar errores (error)
- Usa sonidos suaves para indicar que necesitan tu atención (permission, question)
- Diferentes combinaciones de sonidos te permiten entender la situación general sin mirar las notificaciones
:::

::: warning Diferencias de Plataforma
La configuración `sounds` solo es efectiva en macOS. Windows y Linux usarán los sonidos de notificación predeterminados del sistema, que no se pueden personalizar.
:::

#### quietHours

| Parámetro | Tipo | Valor Predeterminado | Descripción |
| --- | --- | --- | ---|
| `quietHours.enabled` | boolean | `false` | Si se habilitan las horas silenciosas |
| `quietHours.start` | string | `"22:00"` | Hora de inicio del silencio (formato HH:MM) |
| `quietHours.end` | string | `"08:00"` | Hora de finalización del silencio (formato HH:MM) |

**Función**: Suprime el envío de todas las notificaciones durante el período de tiempo especificado.

**Comportamiento Predeterminado** (`enabled: false`):
- No se habilitan las horas silenciosas
- Puedes recibir notificaciones en cualquier momento

**Después de Habilitar** (`enabled: true`):
- No se envían notificaciones durante el período de `start` a `end`
- Soporta períodos que cruzan la medianoche (por ejemplo, 22:00-08:00)

**Formato de Hora**:
- Usa el formato de 24 horas `HH:MM`
- Ejemplo: `"22:30"` representa las 10:30 PM

**Períodos que Cruzan la Medianoche**:
- Si `start > end` (por ejemplo, 22:00-08:00), representa cruzar la medianoche
- Desde las 22:00 de la noche hasta las 08:00 de la mañana del día siguiente está dentro del período silencioso

::: info Prioridad de las Horas Silenciosas
La prioridad de las horas silenciosas es la más alta. Incluso si se cumplen todas las demás condiciones, no se enviarán notificaciones dentro del período silencioso.
:::

#### terminal

| Parámetro | Tipo | Valor Predeterminado | Descripción |
| --- | --- | --- | ---|
| `terminal` | string | No configurado | Especificar manualmente el tipo de terminal (anula la detección automática) |

**Función**: Especificar manualmente el tipo de emulador de terminal que estás usando, anulando la detección automática del plugin.

**Comportamiento Predeterminado** (No configurado):
- El plugin usa la biblioteca `detect-terminal` para detectar automáticamente tu terminal
- Soporta 37+ emuladores de terminal

**Después de Configurar**:
- El plugin usa el tipo de terminal especificado
- Usado para funciones de detección de enfoque y enfoque al hacer clic (macOS)

**Valores de Terminal Comunes**:

| Aplicación de Terminal | Valor de Configuración |
| --- | ---|
| Ghostty | `"ghostty"` |
| Kitty | `"kitty"` |
| iTerm2 | `"iterm2"` |
| WezTerm | `"wezterm"` |
| Alacritty | `"alacritty"` |
| Terminal de macOS | `"terminal"` |
| Hyper | `"hyper"` |
| Warp | `"warp"` |
| Terminal integrado de VS Code | `"vscode"` |

::: tip Cuándo Configurar Manualmente
- La detección automática falla y la detección de enfoque no funciona
- Usas múltiples terminales y necesitas especificar un terminal particular
- El nombre de tu terminal no está en la lista de comunes
:::

## Resumen de Diferencias de Plataforma

Diferentes plataformas tienen diferentes niveles de soporte para los parámetros de configuración:

| Parámetro de Configuración | macOS | Windows | Linux |
| --- | --- | --- | ---|
| `notifyChildSessions` | ✅ | ✅ | ✅ |
| Detección de Enfoque (Codificado) | ✅ | ❌ | ❌ |
| `sounds.*` | ✅ | ❌ | ❌ |
| `quietHours.*` | ✅ | ✅ | ✅ |
| `terminal` | ✅ | ✅ | ✅ |

::: warning Nota para Usuarios de Windows/Linux
Las configuraciones `sounds` y la función de detección de enfoque no funcionan en Windows y Linux.
- Windows/Linux usarán los sonidos de notificación predeterminados del sistema
- Windows/Linux no soportan la detección de enfoque (no se puede controlar mediante configuración)
:::

## Ejemplos de Configuración

### Configuración Básica (Recomendada)

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

Esta configuración es adecuada para la mayoría de los usuarios:
- Solo notifica las sesiones padre, evitando el ruido de subtareas
- En macOS, cuando el terminal está en primer plano, las notificaciones se suprimen automáticamente (no requiere configuración)
- Usa la combinación de sonidos predeterminada
- No habilita las horas silenciosas

### Habilitar Horas Silenciosas

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

Adecuado para usuarios que desean no ser molestados durante la noche:
- No se envían notificaciones entre las 22:00 y las 08:00
- Notificaciones normales en otros momentos

### Rastrear Todas las Subtareas

```json
{
  "notifyChildSessions": true,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine",
    "question": "Ping"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

Adecuado para usuarios que necesitan rastrear el progreso de todas las tareas:
- Todas las sesiones (padres y subsesiones) serán notificadas
- Establece un sonido independiente para preguntas (Ping)

### Especificar Terminal Manualmente

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": "ghostty"
}
```

Adecuado para usuarios con fallas en la detección automática o que usan múltiples terminales:
- Especifica manualmente el uso del terminal Ghostty
- Asegura que las funciones de detección de enfoque y enfoque al hacer clic funcionen correctamente

### Configuración Mínima para Windows/Linux

```json
{
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

Adecuado para usuarios de Windows/Linux (configuración simplificada):
- Solo conserva los parámetros de configuración soportados por la plataforma
- La configuración `sounds` y la función de detección de enfoque no funcionan en Windows/Linux, no es necesario configurarlas

## Gestión del Archivo de Configuración

### Crear el Archivo de Configuración

**macOS/Linux**:

```bash
# Crear el directorio de configuración (si no existe)
mkdir -p ~/.config/opencode

# Crear el archivo de configuración
nano ~/.config/opencode/kdco-notify.json
```

**Windows (PowerShell)**:

```powershell
# Crear el directorio de configuración (si no existe)
New-Item -ItemType Directory -Path "$env:APPDATA\opencode" -Force

# Crear el archivo de configuración
notepad "$env:APPDATA\opencode\kdco-notify.json"
```

### Verificar el Archivo de Configuración

**Verificar si el archivo existe**:

```bash
# macOS/Linux
cat ~/.config/opencode/kdco-notify.json

# Windows PowerShell
Get-Content "$env:APPDATA\opencode\kdco-notify.json"
```

**Verificar si la configuración está activa**:

1. Modifica el archivo de configuración
2. Reinicia OpenCode (o activa la recarga de configuración)
3. Observa si el comportamiento de las notificaciones cumple con lo esperado

### Manejo de Errores en el Archivo de Configuración

Si el formato del archivo de configuración es incorrecto:
- El plugin ignorará el archivo de configuración erróneo
- Continuará ejecutándose con la configuración predeterminada
- Mostrará información de advertencia en los logs de OpenCode

**Errores JSON Comunes**:

| Tipo de Error | Ejemplo | Método de Corrección |
| --- | --- | ---|
| Falta coma | `"key1": "value1" "key2": "value2"` | Agregar coma: `"key1": "value1",` |
| Coma sobrante | `"key1": "value1",}` | Eliminar la última coma: `"key1": "value1"}` |
| Comillas no cerradas | `"key": value` | Agregar comillas: `"key": "value"` |
| Usar comillas simples | `'key': 'value'` | Cambiar a comillas dobles: `"key": "value"` |
| Error de sintaxis de comentarios | `{"key": "value" /* comentario */}` | JSON no soporta comentarios, eliminar comentarios |

::: tip Usar Herramienta de Validación JSON
Puedes usar herramientas de validación JSON en línea (como jsonlint.com) para verificar si el formato del archivo de configuración es correcto.
:::

## Resumen de Esta Lección

Esta lección proporciona la referencia completa de configuración de opencode-notify:

**Parámetros de Configuración Principales**:

| Parámetro de Configuración | Función | Valor Predeterminado | Soporte de Plataforma |
| --- | --- | --- | ---|
| `notifyChildSessions` | Interruptor de notificaciones de subsesiones | `false` | Todas las plataformas |
| Detección de Enfoque | Supresión de enfoque de terminal (codificado) | Sin configuración | Solo macOS |
| `sounds.*` | Sonidos personalizados | Ver campos individuales | Solo macOS |
| `quietHours.*` | Configuración de horas silenciosas | Ver campos individuales | Todas las plataformas |
| `terminal` | Especificar terminal manualmente | No configurado | Todas las plataformas |

**Principios de Configuración**:
- **Mayoría de usuarios**: Usar la configuración predeterminada es suficiente
- **Necesitas silencio**: Habilitar `quietHours`
- **Necesitas rastrear subtareas**: Habilitar `notifyChildSessions`
- **Usuarios de macOS**: Puedes personalizar `sounds` y disfrutar de la detección automática de enfoque
- **Usuarios de Windows/Linux**: Menos parámetros de configuración, presta atención a `notifyChildSessions` y `quietHours`

**Ruta del Archivo de Configuración**: `~/.config/opencode/kdco-notify.json`

## Próxima Lección

> En la próxima lección aprenderemos **[Horas Silenciosas en Detalle](../quiet-hours/)**.
>
> Aprenderás:
> - El principio de funcionamiento detallado de las horas silenciosas
> - Métodos de configuración de períodos que cruzan la medianoche
> - Prioridad de las horas silenciosas frente a otras configuraciones
> - Preguntas frecuentes y soluciones

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-27

| Función | Ruta del Archivo | Número de Línea |
| --- | --- | ---|
| Definición de la Interfaz de Configuración | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48 |
| Configuración Predeterminada | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| Carga del Archivo de Configuración | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L91-L114) | 91-114 |
| Verificación de Subsesiones | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L256-L259) | 256-259 |
| Verificación de Enfoque del Terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L265) | 265 |
| Verificación de Horas Silenciosas | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L262) | 262 |
| Uso de Configuración de Sonidos | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L236) | 227-236 |
| Ejemplo de Configuración en README | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L68-L79) | 68-79 |

**Interfaz de Configuración** (NotifyConfig):

```typescript
interface NotifyConfig {
  /** Notificar eventos de subsesiones/secundarias (predeterminado: false) */
  notifyChildSessions: boolean
  /** Configuración de sonido por tipo de evento */
  sounds: {
    idle: string
    error: string
    permission: string
    question?: string
  }
  /** Configuración de horas silenciosas */
  quietHours: {
    enabled: boolean
    start: string // formato "HH:MM"
    end: string // formato "HH:MM"
  }
  /** Anular detección de terminal (opcional) */
  terminal?: string
}
```

**Nota**: En la interfaz de configuración **no existe** el campo `suppressWhenFocused`. La detección de enfoque es un comportamiento codificado de la plataforma macOS y los usuarios no pueden controlarlo a través del archivo de configuración.

**Configuración Predeterminada** (DEFAULT_CONFIG):

```typescript
const DEFAULT_CONFIG: NotifyConfig = {
  notifyChildSessions: false,
  sounds: {
    idle: "Glass",      // Sonido de tarea completada
    error: "Basso",     // Sonido de error
    permission: "Submarine",  // Sonido de solicitud de permisos
  },
  quietHours: {
    enabled: false,     // Horas silenciosas deshabilitadas por defecto
    start: "22:00",    // 10 PM
    end: "08:00",      // 8 AM
  },
}
```

**Función de Carga de Configuración** (loadConfig):

- Ruta: `~/.config/opencode/kdco-notify.json`
- Usa `fs.readFile()` para leer el archivo de configuración
- Se fusiona con `DEFAULT_CONFIG` (la configuración del usuario tiene prioridad)
- Los objetos anidados (`sounds`, `quietHours`) también se fusionan
- Si el archivo de configuración no existe o tiene un formato incorrecto, se usa la configuración predeterminada

**Verificación de Subsesiones** (isParentSession):

- Verifica si `sessionID` contiene `/` (identificador de subsesión)
- Si `notifyChildSessions` es `false`, se omiten las notificaciones de subsesiones
- Las notificaciones de solicitud de permisos (`permission.updated`) siempre se envían, sin estar limitadas por esto

**Verificación de Enfoque del Terminal** (isTerminalFocused):

- Usa `osascript` para obtener el nombre del proceso de la aplicación en primer plano actual
- Compara con el `processName` del terminal (no distingue entre mayúsculas y minúsculas)
- Solo se habilita en la plataforma macOS, **no se puede desactivar mediante configuración**
- Las notificaciones de preguntas (`question`) no realizan verificación de enfoque (para soportar flujos de trabajo con tmux)

**Verificación de Horas Silenciosas** (isQuietHours):

- Convierte la hora actual en minutos (desde la medianoche 0:00)
- Compara con `start` y `end` configurados
- Soporta períodos que cruzan la medianoche (por ejemplo, 22:00-08:00)
- Si `start > end`, representa cruzar la medianoche

**Uso de Configuración de Sonidos** (sendNotification):

- Lee el nombre del sonido del evento correspondiente desde la configuración
- Pasa al parámetro `sound` de `node-notifier`
- Solo efectivo en la plataforma macOS
- Si el evento `question` no tiene configurado un sonido, usa el sonido de `permission`

</details>
