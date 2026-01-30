---
title: "Compatibilidad: Integración con Claude Code | oh-my-opencode"
sidebarTitle: "Reutilizar Configuración de Claude Code"
subtitle: "Compatibilidad con Claude Code: Soporte Completo para Commands, Skills, Agents, MCPs y Hooks"
description: "Aprende la capa de compatibilidad de Claude Code en oh-my-opencode. Domina la carga de configuración, reglas de prioridad y switches de desactivación para migrar sin problemas a OpenCode."
tags:
  - "claude-code"
  - "compatibility"
  - "integration"
prerequisite:
  - "start-installation"
order: 170
---

# Compatibilidad con Claude Code: Soporte Completo para Commands, Skills, Agents, MCPs y Hooks

## Lo Que Aprenderás

- Usar la configuración y plugins existentes de Claude Code en OpenCode
- Comprender las reglas de prioridad de diferentes fuentes de configuración
- Controlar la carga de funciones de compatibilidad con Claude Code mediante switches de configuración
- Migrar sin problemas de Claude Code a OpenCode

## Tu Situación Actual

Si eres un usuario que migra de Claude Code a OpenCode, es posible que ya hayas configurado muchos Commands personalizados, Skills y servidores MCP en el directorio `~/.claude/`. Reconfigurar todo esto es tedioso, y deseas poder reutilizar directamente estas configuraciones en OpenCode.

Oh My OpenCode proporciona una capa de compatibilidad completa con Claude Code, permitiéndote usar tu configuración y plugins existentes de Claude Code sin ninguna modificación.

## Conceptos Fundamentales

Oh My OpenCode es compatible con el formato de configuración de Claude Code a través de un **mecanismo de carga automática**. El sistema escanea automáticamente los directorios de configuración estándar de Claude Code al inicio, convierte estos recursos a un formato reconocible por OpenCode y los registra en el sistema.

La compatibilidad cubre las siguientes funciones:

| Función | Estado de Compatibilidad | Descripción |
| --- | --- | --- |
| **Commands** | ✅ Soporte completo | Carga comandos slash desde `~/.claude/commands/` y `.claude/commands/` |
| **Skills** | ✅ Soporte completo | Carga skills profesionales desde `~/.claude/skills/` y `.claude/skills/` |
| **Agents** | ⚠️ Reservado | Interfaz reservada, actualmente solo soporta Agents incorporados |
| **MCPs** | ✅ Soporte completo | Carga configuración de servidores MCP desde `.mcp.json` y `~/.claude/.mcp.json` |
| **Hooks** | ✅ Soporte completo | Carga hooks de ciclo de vida personalizados desde `settings.json` |
| **Plugins** | ✅ Soporte completo | Carga plugins del Marketplace desde `installed_plugins.json` |

---

## Prioridad de Carga de Configuración

Oh My OpenCode soporta la carga de configuración desde múltiples ubicaciones, fusionándolas según un orden de prioridad fijo. **La configuración de mayor prioridad sobrescribe la de menor prioridad**.

### Prioridad de Carga de Commands

Los Commands se cargan en el siguiente orden (de mayor a menor):

1. `.opencode/command/` (nivel de proyecto, máxima prioridad)
2. `~/.config/opencode/command/` (nivel de usuario)
3. `.claude/commands/` (nivel de proyecto, compatibilidad con Claude Code)
4. `~/.claude/commands/` (nivel de usuario, compatibilidad con Claude Code)

**Ubicación del código fuente**: `src/features/claude-code-command-loader/loader.ts:136-144`

```typescript
// Carga Commands desde 4 directorios, fusionándolos por prioridad
return {
  ...projectOpencode,   // 1. .opencode/command/
  ...global,             // 2. ~/.config/opencode/command/
  ...project,            // 3. .claude/commands/
  ...user                // 4. ~/.claude/commands/
}
```

**Ejemplo**: Si hay un comando con el mismo nombre en `.opencode/command/refactor.md` y `~/.claude/commands/refactor.md`, el comando en `.opencode/` tendrá efecto.

### Prioridad de Carga de Skills

Los Skills se cargan en el siguiente orden (de mayor a menor):

1. `.opencode/skills/*/SKILL.md` (nivel de proyecto, máxima prioridad)
2. `~/.config/opencode/skills/*/SKILL.md` (nivel de usuario)
3. `.claude/skills/*/SKILL.md` (nivel de proyecto, compatibilidad con Claude Code)
4. `~/.claude/skills/*/SKILL.md` (nivel de usuario, compatibilidad con Claude Code)

**Ubicación del código fuente**: `src/features/opencode-skill-loader/loader.ts:206-215`

**Ejemplo**: Los Skills a nivel de proyecto sobrescriben los Skills a nivel de usuario, asegurando que las necesidades específicas de cada proyecto tengan prioridad.

### Prioridad de Carga de MCPs

La configuración de MCP se carga en el siguiente orden (de mayor a menor):

1. `.claude/.mcp.json` (nivel de proyecto, máxima prioridad)
2. `.mcp.json` (nivel de proyecto)
3. `~/.claude/.mcp.json` (nivel de usuario)

**Ubicación del código fuente**: `src/features/claude-code-mcp-loader/loader.ts:18-27`

**Característica**: La configuración de MCP soporta expansión de variables de entorno (como `${OPENAI_API_KEY}`), analizadas automáticamente a través de `env-expander.ts`.

**Ubicación del código fuente**: `src/features/claude-code-mcp-loader/env-expander.ts`

### Prioridad de Carga de Hooks

Los Hooks se cargan desde el campo `hooks` de `settings.json`, soportando las siguientes rutas (por prioridad):

1. `.claude/settings.local.json` (configuración local, máxima prioridad)
2. `.claude/settings.json` (nivel de proyecto)
3. `~/.claude/settings.json` (nivel de usuario)

**Ubicación del código fuente**: `src/hooks/claude-code-hooks/config.ts:46-59`

**Característica**: Los Hooks de múltiples archivos de configuración se fusionan automáticamente, en lugar de sobrescribirse mutuamente.

---

## Switches de Desactivación de Configuración

Si no deseas cargar ciertas configuraciones de Claude Code, puedes realizar un control granular a través del campo `claude_code` en `oh-my-opencode.json`.

### Desactivar Completamente la Compatibilidad

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "claude_code": {
    "mcp": false,
    "commands": false,
    "skills": false,
    "agents": false,
    "hooks": false,
    "plugins": false
  }
}
```

### Desactivación Parcial

También puedes desactivar solo funciones específicas:

```jsonc
{
  "claude_code": {
    "mcp": false,         // Desactiva archivos .mcp.json (pero mantiene MCPs incorporados)
    "commands": false,     // Desactiva ~/.claude/commands/ y .claude/commands/
    "skills": false,       // Desactiva ~/.claude/skills/ y .claude/skills/
    "agents": false,       // Desactiva ~/.claude/agents/ (mantiene Agents incorporados)
    "hooks": false,        // Desactiva hooks de settings.json
    "plugins": false       // Desactiva plugins del Marketplace de Claude Code
  }
}
```

**Descripción de switches**:

| Switch | Contenido Desactivado | Contenido Conservado |
| --- | --- | --- |
| `mcp` | Archivos `.mcp.json` | MCPs incorporados (websearch, context7, grep_app) |
| `commands` | `~/.claude/commands/`, `.claude/commands/` | Commands nativos de OpenCode |
| `skills` | `~/.claude/skills/`, `.claude/skills/` | Skills nativos de OpenCode |
| `agents` | `~/.claude/agents/` | Agents incorporados (Sisyphus, Oracle, Librarian, etc.) |
| `hooks` | Hooks de `settings.json` | Hooks incorporados de Oh My OpenCode |
| `plugins` | Plugins del Marketplace de Claude Code | Funcionalidad de plugins incorporados |

### Desactivar Plugins Específicos

Usa `plugins_override` para desactivar plugins específicos del Marketplace de Claude Code:

```jsonc
{
  "claude_code": {
    "plugins_override": {
      "claude-mem@thedotmack": false  // Desactiva el plugin claude-mem
    }
  }
}
```

**Ubicación del código fuente**: `src/config/schema.ts:143`

---

## Compatibilidad de Almacenamiento de Datos

Oh My OpenCode es compatible con el formato de almacenamiento de datos de Claude Code, asegurando la persistencia y migración de datos de sesiones y tareas.

### Almacenamiento de Todos

- **Ubicación**: `~/.claude/todos/`
- **Formato**: Formato JSON compatible con Claude Code
- **Uso**: Almacena listas de tareas y pendientes

**Ubicación del código fuente**: `src/features/claude-code-session-state/index.ts`

### Almacenamiento de Transcripts

- **Ubicación**: `~/.claude/transcripts/`
- **Formato**: JSONL (un objeto JSON por línea)
- **Uso**: Almacena historial de sesiones y registros de mensajes

**Ubicación del código fuente**: `src/features/claude-code-session-state/index.ts`

**Ventaja**: Comparte el mismo directorio de datos con Claude Code, permitiendo la migración directa del historial de sesiones.

---

## Integración de Hooks de Claude Code

El campo `hooks` en el `settings.json` de Claude Code define scripts personalizados que se ejecutan en puntos de eventos específicos. Oh My OpenCode soporta completamente estos Hooks.

### Tipos de Eventos de Hook

| Evento | Momento de Activación | Operaciones Ejecutables |
| --- | --- | --- |
| **PreToolUse** | Antes de la ejecución de herramientas | Bloquear llamadas a herramientas, modificar parámetros de entrada, inyectar contexto |
| **PostToolUse** | Después de la ejecución de herramientas | Agregar advertencias, modificar salida, inyectar mensajes |
| **UserPromptSubmit** | Al enviar prompt del usuario | Bloquear prompt, inyectar mensajes, transformar prompt |
| **Stop** | Cuando la sesión entra en estado inactivo | Inyectar prompts subsiguientes, ejecutar tareas automatizadas |

**Ubicación del código fuente**: `src/hooks/claude-code-hooks/index.ts`

### Ejemplo de Configuración de Hook

A continuación se muestra una configuración típica de Hooks de Claude Code:

```jsonc
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "eslint --fix $FILE"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "inject",
            "content": "Remember to follow the project's coding standards."
          }
        ]
      }
    ]
  }
}
```

**Descripción de campos**:

- **matcher**: Patrón de coincidencia de nombre de herramienta (soporta comodín `*`)
- **type**: Tipo de Hook (`command`, `inject`, etc.)
- **command**: Comando shell a ejecutar (soporta variables como `$FILE`)
- **content**: Contenido del mensaje a inyectar

### Mecanismo de Ejecución de Hook

Oh My OpenCode ejecuta automáticamente estos Hooks personalizados a través del Hook `claude-code-hooks`. Este Hook verifica y carga la configuración de Claude Code en todos los puntos de eventos.

**Ubicación del código fuente**: `src/hooks/claude-code-hooks/index.ts:36-401`

**Flujo de ejecución**:

1. Carga el `settings.json` de Claude Code
2. Analiza el campo `hooks` y coincide con el evento actual
3. Ejecuta los Hooks coincidentes en orden
4. Modifica el comportamiento del agente según el resultado devuelto (bloquear, inyectar, advertir, etc.)

**Ejemplo**: Si un Hook PreToolUse devuelve `deny`, la llamada a la herramienta será bloqueada y el agente recibirá un mensaje de error.

---

## Escenarios de Uso Comunes

### Escenario 1: Migrar Configuración de Claude Code

Si ya has configurado Commands y Skills en Claude Code, puedes usarlos directamente en OpenCode:

**Pasos**:

1. Asegúrate de que el directorio `~/.claude/` existe y contiene tu configuración
2. Inicia OpenCode, Oh My OpenCode cargará automáticamente estas configuraciones
3. En el chat, escribe `/` para ver los Commands cargados
4. Usa Commands o invoca Skills

**Verificación**: Revisa los logs de inicio de Oh My OpenCode para ver la cantidad de configuraciones cargadas.

### Escenario 2: Sobrescritura de Configuración a Nivel de Proyecto

Deseas usar Skills diferentes para un proyecto específico sin afectar otros proyectos:

**Pasos**:

1. Crea el directorio `.claude/skills/` en la raíz del proyecto
2. Agrega un Skill específico del proyecto (como `./.claude/skills/my-skill/SKILL.md`)
3. Reinicia OpenCode
4. El Skill a nivel de proyecto sobrescribirá automáticamente el Skill a nivel de usuario

**Ventaja**: Cada proyecto puede tener configuración independiente sin interferencias mutuas.

### Escenario 3: Desactivar Compatibilidad con Claude Code

Solo deseas usar la configuración nativa de OpenCode, sin cargar la configuración antigua de Claude Code:

**Pasos**:

1. Edita `oh-my-opencode.json`
2. Agrega la siguiente configuración:

```jsonc
{
  "claude_code": {
    "mcp": false,
    "commands": false,
    "skills": false,
    "hooks": false,
    "plugins": false
  }
}
```

3. Reinicia OpenCode

**Resultado**: El sistema ignorará toda la configuración de Claude Code, usando solo la configuración nativa de OpenCode.

---

## Advertencias de Errores Comunes

### ⚠️ Conflictos de Configuración

**Problema**: Si hay configuraciones con el mismo nombre en múltiples ubicaciones (como el mismo nombre de Command apareciendo en `.opencode/command/` y `~/.claude/commands/`), puede causar comportamiento indeterminado.

**Solución**: Comprende la prioridad de carga, coloca la configuración de mayor prioridad en el directorio de mayor prioridad.

### ⚠️ Diferencias de Formato de Configuración de MCP

**Problema**: El formato de configuración de MCP de Claude Code es ligeramente diferente al de OpenCode, copiar directamente puede no funcionar.

**Solución**: Oh My OpenCode convertirá automáticamente el formato, pero se recomienda consultar la documentación oficial para asegurar que la configuración sea correcta.

**Ubicación del código fuente**: `src/features/claude-code-mcp-loader/transformer.ts`

### ⚠️ Impacto en el Rendimiento de Hooks

**Problema**: Demasiados Hooks o scripts de Hook complejos pueden causar degradación del rendimiento.

**Solución**: Limita la cantidad de Hooks, mantén solo los Hooks necesarios. Puedes desactivar Hooks específicos a través de `disabled_hooks`.

---

## Resumen de la Lección

Oh My OpenCode proporciona una capa de compatibilidad completa con Claude Code, permitiéndote migrar y reutilizar sin problemas la configuración existente:

- **Prioridad de carga de configuración**: Carga configuración en el orden nivel de proyecto > nivel de usuario > compatibilidad con Claude Code
- **Switches de compatibilidad**: Controla con precisión qué funciones cargar a través del campo `claude_code`
- **Compatibilidad de almacenamiento de datos**: Comparte el directorio `~/.claude/`, soporta migración de datos de sesiones y tareas
- **Integración de Hooks**: Soporte completo para el sistema de hooks de ciclo de vida de Claude Code

Si eres un usuario que migra de Claude Code, esta capa de compatibilidad te permite comenzar a usar OpenCode con configuración cero.

---

## Avance de la Próxima Lección

> En la próxima lección aprenderemos **[Referencia de Configuración](../configuration-reference/)**.
>
> Aprenderás:
> - Descripción completa de los campos de configuración de `oh-my-opencode.json`
> - Tipo, valor predeterminado y condiciones de restricción de cada campo
> - Patrones de configuración comunes y mejores prácticas

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Tiempo de actualización: 2026-01-26

| Función | Ruta del Archivo | Número de Línea |
| --- | --- | --- |
| Entrada principal de Hooks de Claude Code | [`src/hooks/claude-code-hooks/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/index.ts) | 1-402 |
| Carga de configuración de Hooks | [`src/hooks/claude-code-hooks/config.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/config.ts) | 1-104 |
| Cargador de configuración de MCP | [`src/features/claude-code-mcp-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/loader.ts) | 1-120 |
| Cargador de Commands | [`src/features/claude-code-command-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-command-loader/loader.ts) | 1-145 |
| Cargador de Skills | [`src/features/opencode-skill-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/opencode-skill-loader/loader.ts) | 1-262 |
| Cargador de Plugins | [`src/features/claude-code-plugin-loader/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-plugin-loader/index.ts) | Texto completo |
| Compatibilidad de almacenamiento de datos | [`src/features/claude-code-session-state/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-session-state/index.ts) | Texto completo |
| Transformador de configuración de MCP | [`src/features/claude-code-mcp-loader/transformer.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/transformer.ts) | Texto completo |
| Expansión de variables de entorno | [`src/features/claude-code-mcp-loader/env-expander.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/env-expander.ts) | Texto completo |

**Funciones Clave**:

- `createClaudeCodeHooksHook()`: Crea el Hook de integración de Hooks de Claude Code, maneja todos los eventos (PreToolUse, PostToolUse, UserPromptSubmit, Stop)
- `loadClaudeHooksConfig()`: Carga la configuración de `settings.json` de Claude Code
- `loadMcpConfigs()`: Carga la configuración de servidores MCP, soporta expansión de variables de entorno
- `loadAllCommands()`: Carga Commands desde 4 directorios, fusionándolos por prioridad
- `discoverSkills()`: Carga Skills desde 4 directorios, soporta rutas compatibles con Claude Code
- `getClaudeConfigDir()`: Obtiene la ruta del directorio de configuración de Claude Code (dependiente de la plataforma)

**Constantes Clave**:

- Prioridad de carga de configuración: `.opencode/` > `~/.config/opencode/` > `.claude/` > `~/.claude/`
- Tipos de eventos de Hook: `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, `PreCompact`

</details>
