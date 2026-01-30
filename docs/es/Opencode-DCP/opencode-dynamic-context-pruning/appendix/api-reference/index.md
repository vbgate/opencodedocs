---
title: "Referencia de API: Documentación de Interfaces del Plugin | opencode-dynamic-context-pruning"
sidebarTitle: "Referencia de API del Plugin"
subtitle: "Referencia de API de DCP"
description: "Documentación completa de la API del plugin OpenCode DCP, incluyendo funciones de entrada del plugin, interfaces de configuración, definiciones de herramientas, manejadores de hooks y gestión del estado de sesión."
tags:
  - "API"
  - "Desarrollo de Plugins"
  - "Referencia de Interfaces"
prerequisite:
  - "start-configuration"
order: 3
---

# Referencia de API de DCP

## Lo que aprenderás

Esta sección proporciona una referencia completa de la API de DCP para desarrolladores de plugins, permitiéndote:

- Comprender el punto de entrada del plugin y el mecanismo de hooks de DCP
- Dominar las interfaces de configuración y el propósito de cada opción
- Conocer las especificaciones de las herramientas discard y extract
- Utilizar la API de gestión de estado para operaciones de estado de sesión

## Conceptos Fundamentales

El plugin DCP se basa en el SDK de Plugins de OpenCode, implementando la funcionalidad de poda de contexto mediante el registro de hooks, herramientas y comandos.

**Ciclo de vida del plugin**:

```
1. OpenCode carga el plugin
    ↓
2. Se ejecuta la función Plugin
    ↓
3. Se registran hooks, herramientas y comandos
    ↓
4. OpenCode invoca los hooks para procesar mensajes
    ↓
5. El plugin ejecuta la lógica de poda
    ↓
6. Se devuelven los mensajes modificados
```

---

## API de Entrada del Plugin

### Función Plugin

La función de entrada principal de DCP que devuelve el objeto de configuración del plugin.

**Firma**:

```typescript
import type { Plugin } from "@opencode-ai/plugin"

const plugin: Plugin = (async (ctx) => {
    // Lógica de inicialización del plugin
    return {
        // Hooks, herramientas y comandos registrados
    }) satisfies Plugin

export default plugin
```

**Parámetros**:

| Parámetro | Tipo | Descripción |
| --- | --- | --- |
| ctx | `PluginInput` | Contexto del plugin de OpenCode, contiene información como client y directory |

**Valor de retorno**:

Objeto de configuración del plugin con los siguientes campos:

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `experimental.chat.system.transform` | `Handler` | Hook de inyección de prompt del sistema |
| `experimental.chat.messages.transform` | `Handler` | Hook de transformación de mensajes |
| `chat.message` | `Handler` | Hook de captura de mensajes |
| `command.execute.before` | `Handler` | Hook de ejecución de comandos |
| `tool` | `Record<string, Tool>` | Mapa de herramientas registradas |
| `config` | `ConfigHandler` | Hook de mutación de configuración |

**Ubicación en el código fuente**: [`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts#L12-L102)

---

## API de Configuración

### Interfaz PluginConfig

Definición completa del tipo de configuración de DCP.

```typescript
export interface PluginConfig {
    enabled: boolean
    debug: boolean
    pruneNotification: "off" | "minimal" | "detailed"
    commands: Commands
    turnProtection: TurnProtection
    protectedFilePatterns: string[]
    tools: Tools
    strategies: {
        deduplication: Deduplication
        supersedeWrites: SupersedeWrites
        purgeErrors: PurgeErrors
    }
}
```

**Ubicación en el código fuente**: [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L53-L66)

### Detalles de las Opciones de Configuración

#### Configuración de Nivel Superior

| Opción | Tipo | Valor por defecto | Descripción |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Habilitar o deshabilitar el plugin |
| `debug` | `boolean` | `false` | Habilitar logs de depuración, escritos en `~/.config/opencode/logs/dcp/` |
| `pruneNotification` | `"off" \| "minimal" \| "detailed"` | `"detailed"` | Modo de visualización de notificaciones |
| `protectedFilePatterns` | `string[]` | `[]` | Lista de patrones glob para protección de archivos, los archivos coincidentes no serán podados |

#### Configuración de Commands

```typescript
export interface Commands {
    enabled: boolean
    protectedTools: string[]
}
```

| Campo | Tipo | Valor por defecto | Descripción |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Habilitar el comando `/dcp` |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Lista de herramientas protegidas por comandos, estas herramientas no serán podadas por `/dcp sweep` |

#### Configuración de TurnProtection

```typescript
export interface TurnProtection {
    enabled: boolean
    turns: number
}
```

| Campo | Tipo | Valor por defecto | Descripción |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | Habilitar protección por turnos |
| `turns` | `number` | `4` | Número de turnos protegidos, las herramientas de los últimos N turnos no serán podadas |

#### Configuración de Tools

```typescript
export interface Tools {
    settings: ToolSettings
    discard: DiscardTool
    extract: ExtractTool
}
```

**ToolSettings**:

```typescript
export interface ToolSettings {
    nudgeEnabled: boolean
    nudgeFrequency: number
    protectedTools: string[]
}
```

| Campo | Tipo | Valor por defecto | Descripción |
| --- | --- | --- | --- |
| `nudgeEnabled` | `boolean` | `true` | Habilitar recordatorios para la IA |
| `nudgeFrequency` | `number` | `10` | Frecuencia de recordatorios, recordar a la IA usar herramientas de poda cada N resultados de herramientas |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Lista de herramientas protegidas |

**DiscardTool**:

```typescript
export interface DiscardTool {
    enabled: boolean
}
```

| Campo | Tipo | Valor por defecto | Descripción |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Habilitar la herramienta discard |

**ExtractTool**:

```typescript
export interface ExtractTool {
    enabled: boolean
    showDistillation: boolean
}
```

| Campo | Tipo | Valor por defecto | Descripción |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Habilitar la herramienta extract |
| `showDistillation` | `boolean` | `false` | Mostrar contenido extraído en las notificaciones |

#### Configuración de Strategies

**Deduplication**:

```typescript
export interface Deduplication {
    enabled: boolean
    protectedTools: string[]
}
```

| Campo | Tipo | Valor por defecto | Descripción |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Habilitar estrategia de deduplicación |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Lista de herramientas excluidas de la deduplicación |

**SupersedeWrites**:

```typescript
export interface SupersedeWrites {
    enabled: boolean
}
```

| Campo | Tipo | Valor por defecto | Descripción |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | Habilitar estrategia de sobrescritura |

**PurgeErrors**:

```typescript
export interface PurgeErrors {
    enabled: boolean
    turns: number
    protectedTools: string[]
}
```

| Campo | Tipo | Valor por defecto | Descripción |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Habilitar estrategia de limpieza de errores |
| `turns` | `number` | `4` | Umbral de limpieza de errores (número de turnos) |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Lista de herramientas excluidas de la limpieza |

### Función getConfig

Carga y fusiona configuraciones de múltiples niveles.

```typescript
export function getConfig(ctx: PluginInput): PluginConfig
```

**Parámetros**:

| Parámetro | Tipo | Descripción |
| --- | --- | --- |
| ctx | `PluginInput` | Contexto del plugin de OpenCode |

**Valor de retorno**:

Objeto de configuración fusionado, con prioridad de mayor a menor:

1. Configuración del proyecto (`.opencode/dcp.jsonc`)
2. Configuración de variable de entorno (`$OPENCODE_CONFIG_DIR/dcp.jsonc`)
3. Configuración global (`~/.config/opencode/dcp.jsonc`)
4. Configuración por defecto (definida en el código)

**Ubicación en el código fuente**: [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797)

---

## API de Herramientas

### createDiscardTool

Crea la herramienta discard, utilizada para eliminar tareas completadas o salidas de herramientas ruidosas.

```typescript
export function createDiscardTool(ctx: PruneToolContext): ReturnType<typeof tool>
```

**Parámetros**:

| Parámetro | Tipo | Descripción |
| --- | --- | --- |
| ctx | `PruneToolContext` | Contexto de la herramienta, contiene client, state, logger, config, workingDirectory |

**Especificación de la herramienta**:

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `ids` | `string[]` | El primer elemento es la razón (`'completion'` o `'noise'`), seguido de IDs numéricos |

**Ubicación en el código fuente**: [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L181)

### createExtractTool

Crea la herramienta extract, utilizada para extraer hallazgos clave y eliminar la salida original de la herramienta.

```typescript
export function createExtractTool(ctx: PruneToolContext): ReturnType<typeof tool>
```

**Parámetros**:

| Parámetro | Tipo | Descripción |
| --- | --- | --- |
| ctx | `PruneToolContext` | Contexto de la herramienta, contiene client, state, logger, config, workingDirectory |

**Especificación de la herramienta**:

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `ids` | `string[]` | Array de IDs numéricos |
| `distillation` | `string[]` | Array de contenido extraído, con la misma longitud que ids |

**Ubicación en el código fuente**: [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220)

---

## API de Estado

### Interfaz SessionState

Objeto de estado de sesión que gestiona el estado en tiempo de ejecución de una sesión individual.

```typescript
export interface SessionState {
    sessionId: string | null
    isSubAgent: boolean
    prune: Prune
    stats: SessionStats
    toolParameters: Map<string, ToolParameterEntry>
    nudgeCounter: number
    lastToolPrune: boolean
    lastCompaction: number
    currentTurn: number
    variant: string | undefined
}
```

**Descripción de campos**:

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `sessionId` | `string \| null` | ID de sesión de OpenCode |
| `isSubAgent` | `boolean` | Si es una sesión de sub-agente |
| `prune` | `Prune` | Estado de poda |
| `stats` | `SessionStats` | Datos estadísticos |
| `toolParameters` | `Map<string, ToolParameterEntry>` | Caché de llamadas a herramientas (callID → metadatos) |
| `nudgeCounter` | `number` | Contador acumulado de llamadas a herramientas (para activar recordatorios) |
| `lastToolPrune` | `boolean` | Si la última operación fue una herramienta de poda |
| `lastCompaction` | `number` | Marca de tiempo de la última compactación de contexto |
| `currentTurn` | `number` | Número de turno actual |
| `variant` | `string \| undefined` | Variante del modelo (ej. claude-3.5-sonnet) |

**Ubicación en el código fuente**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L27-L38)

### Interfaz SessionStats

Estadísticas de poda de tokens a nivel de sesión.

```typescript
export interface SessionStats {
    pruneTokenCounter: number
    totalPruneTokens: number
}
```

**Descripción de campos**:

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `pruneTokenCounter` | `number` | Tokens podados en la sesión actual (acumulado) |
| `totalPruneTokens` | `number` | Total histórico de tokens podados |

**Ubicación en el código fuente**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L18-L21)

### Interfaz Prune

Objeto de estado de poda.

```typescript
export interface Prune {
    toolIds: string[]
}
```

**Descripción de campos**:

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `toolIds` | `string[]` | Lista de IDs de llamadas a herramientas marcadas para poda |

**Ubicación en el código fuente**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L23-L25)

### Interfaz ToolParameterEntry

Caché de metadatos para una llamada individual a herramienta.

```typescript
export interface ToolParameterEntry {
    tool: string
    parameters: any
    status?: ToolStatus
    error?: string
    turn: number
}
```

**Descripción de campos**:

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `tool` | `string` | Nombre de la herramienta |
| `parameters` | `any` | Parámetros de la herramienta |
| `status` | `ToolStatus \| undefined` | Estado de ejecución de la herramienta |
| `error` | `string \| undefined` | Mensaje de error (si existe) |
| `turn` | `number` | Número de turno en que se creó la llamada |

**Enumeración ToolStatus**:

```typescript
export type ToolStatus = "pending" | "running" | "completed" | "error"
```

**Ubicación en el código fuente**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L10-L16)

### createSessionState

Crea un nuevo objeto de estado de sesión.

```typescript
export function createSessionState(): SessionState
```

**Valor de retorno**: Objeto SessionState inicializado

---

## API de Hooks

### createSystemPromptHandler

Crea el manejador del hook de inyección de prompt del sistema.

```typescript
export function createSystemPromptHandler(
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
): Handler
```

**Parámetros**:

| Parámetro | Tipo | Descripción |
| --- | --- | --- |
| state | `SessionState` | Objeto de estado de sesión |
| logger | `Logger` | Instancia del sistema de logging |
| config | `PluginConfig` | Objeto de configuración |

**Comportamiento**:

- Verifica si es una sesión de sub-agente, si es así la omite
- Verifica si es un agente interno (como generador de resúmenes), si es así lo omite
- Carga la plantilla de prompt correspondiente según la configuración (both/discard/extract)
- Inyecta las instrucciones de herramientas de poda en el prompt del sistema

**Ubicación en el código fuente**: [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L20-L53)

### createChatMessageTransformHandler

Crea el manejador del hook de transformación de mensajes, ejecutando la lógica de poda automática.

```typescript
export function createChatMessageTransformHandler(
    client: any,
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
): Handler
```

**Parámetros**:

| Parámetro | Tipo | Descripción |
| --- | --- | --- |
| client | `any` | Instancia del cliente de OpenCode |
| state | `SessionState` | Objeto de estado de sesión |
| logger | `Logger` | Instancia del sistema de logging |
| config | `PluginConfig` | Objeto de configuración |

**Flujo de procesamiento**:

1. Verificar estado de sesión (si es sub-agente)
2. Sincronizar caché de herramientas
3. Ejecutar estrategias automáticas (deduplicación, sobrescritura, limpieza de errores)
4. Podar contenido de herramientas marcadas
5. Inyectar lista `<prunable-tools>`
6. Guardar snapshot del contexto (si está configurado)

**Ubicación en el código fuente**: [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L55-L82)

### createCommandExecuteHandler

Crea el manejador del hook de ejecución de comandos, procesando la serie de comandos `/dcp`.

```typescript
export function createCommandExecuteHandler(
    client: any,
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
    workingDirectory: string,
): Handler
```

**Parámetros**:

| Parámetro | Tipo | Descripción |
| --- | --- | --- |
| client | `any` | Instancia del cliente de OpenCode |
| state | `SessionState` | Objeto de estado de sesión |
| logger | `Logger` | Instancia del sistema de logging |
| config | `PluginConfig` | Objeto de configuración |
| workingDirectory | `string` | Ruta del directorio de trabajo |

**Comandos soportados**:

- `/dcp` - Mostrar información de ayuda
- `/dcp context` - Mostrar análisis de uso de tokens de la sesión actual
- `/dcp stats` - Mostrar estadísticas acumuladas de poda
- `/dcp sweep [n]` - Poda manual de herramientas (opcionalmente especificar cantidad)

**Ubicación en el código fuente**: [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L84-L156)

---

## Resumen de la Lección

Esta sección proporciona la referencia completa de la API del plugin DCP, cubriendo:

- Función de entrada del plugin y mecanismo de registro de hooks
- Interfaces de configuración y descripción detallada de todas las opciones
- Especificaciones y métodos de creación de las herramientas discard y extract
- Definiciones de tipos para estado de sesión, datos estadísticos y caché de herramientas
- Manejadores de hooks para prompt del sistema, transformación de mensajes y ejecución de comandos

Si necesitas profundizar en los detalles de implementación interna de DCP, te recomendamos leer la [Visión General de la Arquitectura](/es/Opencode-DCP/opencode-dynamic-context-pruning/appendix/architecture/) y los [Principios de Cálculo de Tokens](/es/Opencode-DCP/opencode-dynamic-context-pruning/appendix/token-calculation/).

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir las ubicaciones del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Funcionalidad | Ruta del archivo | Líneas |
| --- | --- | --- |
| Función de entrada del plugin | [`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts#L12-L102) | 12-102 |
| Definición de interfaz de configuración | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L7-L66) | 7-66 |
| Función getConfig | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797) | 669-797 |
| Creación de herramienta discard | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L181) | 155-181 |
| Creación de herramienta extract | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220) | 183-220 |
| Definición de tipos de estado | [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L1-L39) | 1-39 |
| Hook de prompt del sistema | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L20-L53) | 20-53 |
| Hook de transformación de mensajes | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L55-L82) | 55-82 |
| Hook de ejecución de comandos | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L84-L156) | 84-156 |

**Tipos clave**:
- `Plugin`: Firma de la función del plugin de OpenCode
- `PluginConfig`: Interfaz de configuración de DCP
- `SessionState`: Interfaz de estado de sesión
- `ToolStatus`: Enumeración de estado de herramienta (pending | running | completed | error)

**Funciones clave**:
- `plugin()`: Función de entrada del plugin
- `getConfig()`: Cargar y fusionar configuración
- `createDiscardTool()`: Crear herramienta discard
- `createExtractTool()`: Crear herramienta extract
- `createSessionState()`: Crear estado de sesión

</details>
