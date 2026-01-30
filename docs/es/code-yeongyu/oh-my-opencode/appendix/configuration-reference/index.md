---
title: "Referencia de Configuración: Opciones Completas | oh-my-opencode"
sidebarTitle: "Guía Completa de Configuración"
subtitle: "Referencia de Configuración: Opciones Completas"
description: "Aprende todas las opciones de configuración de oh-my-opencode. Cubre agentes, Categories, Hooks, tareas en segundo plano y más para personalizar tu entorno OpenCode y optimizar tu flujo de trabajo con IA."
tags:
  - "configuration"
  - "reference"
  - "schema"
prerequisite: []
order: 180
---

# Referencia de Configuración: Schema Completo del Archivo de Configuración

Esta página proporciona la definición completa de campos y descripciones del archivo de configuración de oh-my-opencode.

::: info Ubicación del Archivo de Configuración
- Nivel de proyecto: `.opencode/oh-my-opencode.json`
- Nivel de usuario (macOS/Linux): `~/.config/opencode/oh-my-opencode.json`
- Nivel de usuario (Windows): `%APPDATA%\opencode\oh-my-opencode.json`

La configuración a nivel de proyecto tiene prioridad sobre la configuración a nivel de usuario.
:::

::: tip Habilitar Autocompletado
Añade el campo `$schema` al inicio del archivo de configuración para obtener autocompletado en tu IDE:

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json"
}
```
:::

## Campos de Nivel Raíz

| Campo | Tipo | Requerido | Valor por Defecto | Descripción |
| --- | --- | --- | --- | --- |
| `$schema` | string | No | - | Enlace al JSON Schema para autocompletado |
| `disabled_mcps` | string[] | No | [] | Lista de MCPs deshabilitados |
| `disabled_agents` | string[] | No | [] | Lista de agentes deshabilitados |
| `disabled_skills` | string[] | No | [] | Lista de skills deshabilitados |
| `disabled_hooks` | string[] | No | [] | Lista de hooks deshabilitados |
| `disabled_commands` | string[] | No | [] | Lista de comandos deshabilitados |
| `agents` | object | No | - | Configuración de sobrescritura de agentes |
| `categories` | object | No | - | Configuración personalizada de Categories |
| `claude_code` | object | No | - | Configuración de compatibilidad con Claude Code |
| `sisyphus_agent` | object | No | - | Configuración del agente Sisyphus |
| `comment_checker` | object | No | - | Configuración del verificador de comentarios |
| `experimental` | object | No | - | Configuración de funciones experimentales |
| `auto_update` | boolean | No | true | Verificación automática de actualizaciones |
| `skills` | object\|array | No | - | Configuración de Skills |
| `ralph_loop` | object | No | - | Configuración de Ralph Loop |
| `background_task` | object | No | - | Configuración de concurrencia de tareas en segundo plano |
| `notification` | object | No | - | Configuración de notificaciones |
| `git_master` | object | No | - | Configuración del skill Git Master |
| `browser_automation_engine` | object | No | - | Configuración del motor de automatización del navegador |
| `tmux` | object | No | - | Configuración de gestión de sesiones Tmux |

## agents - Configuración de Agentes

Sobrescribe la configuración de los agentes integrados. Cada agente soporta los siguientes campos:

### Campos Comunes de Agentes

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `model` | string | No | Sobrescribe el modelo usado por el agente (obsoleto, se recomienda usar category) |
| `variant` | string | No | Variante del modelo |
| `category` | string | No | Hereda modelo y configuración de un Category |
| `skills` | string[] | No | Lista de skills inyectados en el prompt del agente |
| `temperature` | number | No | 0-2, controla la aleatoriedad |
| `top_p` | number | No | 0-1, parámetro de muestreo nuclear |
| `prompt` | string | No | Sobrescribe completamente el prompt del sistema por defecto |
| `prompt_append` | string | No | Añade texto al final del prompt por defecto |
| `tools` | object | No | Sobrescritura de permisos de herramientas (`{toolName: boolean}`) |
| `disable` | boolean | No | Deshabilita este agente |
| `description` | string | No | Descripción del agente |
| `mode` | enum | No | `subagent` / `primary` / `all` |
| `color` | string | No | Color hexadecimal (ej. `#FF0000`) |
| `permission` | object | No | Restricciones de permisos del agente |

### permission - Permisos del Agente

| Campo | Tipo | Requerido | Valor | Descripción |
| --- | --- | --- | --- | --- |
| `edit` | string | No | `ask`/`allow`/`deny` | Permiso de edición de archivos |
| `bash` | string/object | No | `ask`/`allow`/`deny` o por comando | Permiso de ejecución Bash |
| `webfetch` | string | No | `ask`/`allow`/`deny` | Permiso de solicitudes web |
| `doom_loop` | string | No | `ask`/`allow`/`deny` | Permiso de sobrescritura de detección de bucle infinito |
| `external_directory` | string | No | `ask`/`allow`/`deny` | Permiso de acceso a directorios externos |

### Lista de Agentes Configurables

| Nombre del Agente | Descripción |
| --- | --- |
| `sisyphus` | Agente orquestador principal |
| `prometheus` | Agente planificador estratégico |
| `oracle` | Agente asesor estratégico |
| `librarian` | Agente experto en investigación multi-repositorio |
| `explore` | Agente experto en exploración rápida de código |
| `multimodal-looker` | Agente experto en análisis multimedia |
| `metis` | Agente de análisis pre-planificación |
| `momus` | Agente revisor de planificación |
| `atlas` | Agente orquestador principal |
| `sisyphus-junior` | Agente ejecutor de tareas generado por categoría |

### Ejemplo de Configuración

```jsonc
{
  "agents": {
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.1,
      "skills": ["git-master"]
    },
    "oracle": {
      "model": "openai/gpt-5.2",
      "permission": {
        "edit": "deny",
        "bash": "ask"
      }
    },
    "multimodal-looker": {
      "disable": true
    }
  }
}
```

## categories - Configuración de Categories

Define Categories (abstracciones de modelos) para composición dinámica de agentes.

### Campos de Category

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `description` | string | No | Descripción del propósito del Category (se muestra en el prompt de delegate_task) |
| `model` | string | No | Sobrescribe el modelo usado por el Category |
| `variant` | string | No | Variante del modelo |
| `temperature` | number | No | 0-2, temperatura |
| `top_p` | number | No | 0-1, muestreo nuclear |
| `maxTokens` | number | No | Número máximo de tokens |
| `thinking` | object | No | Configuración de Thinking `{type, budgetTokens}` |
| `reasoningEffort` | enum | No | `low` / `medium` / `high` / `xhigh` |
| `textVerbosity` | enum | No | `low` / `medium` / `high` |
| `tools` | object | No | Permisos de herramientas |
| `prompt_append` | string | No | Prompt adicional |
| `is_unstable_agent` | boolean | No | Marca como agente inestable (fuerza modo en segundo plano) |

### Configuración de thinking

| Campo | Tipo | Requerido | Valor | Descripción |
| --- | --- | --- | --- | --- |
| `type` | string | Sí | `enabled`/`disabled` | Si habilitar Thinking |
| `budgetTokens` | number | No | - | Número de tokens de presupuesto para Thinking |

### Categories Integrados

| Category | Modelo por Defecto | Temperature | Descripción |
| --- | --- | --- | --- |
| `visual-engineering` | `google/gemini-3-pro` | 0.7 | Tareas de frontend, UI/UX, diseño |
| `ultrabrain` | `openai/gpt-5.2-codex` | 0.1 | Tareas de razonamiento de alto nivel |
| `artistry` | `google/gemini-3-pro` | 0.7 | Tareas creativas y artísticas |
| `quick` | `anthropic/claude-haiku-4-5` | 0.1 | Tareas rápidas y de bajo costo |
| `unspecified-low` | `anthropic/claude-sonnet-4-5` | 0.1 | Tareas de nivel medio sin especificar |
| `unspecified-high` | `anthropic/claude-opus-4-5` | 0.1 | Tareas de alta calidad sin especificar |
| `writing` | `google/gemini-3-flash` | 0.1 | Tareas de documentación y escritura |

### Ejemplo de Configuración

```jsonc
{
  "categories": {
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "temperature": 0.7,
      "prompt_append": "Use shadcn/ui components and Tailwind CSS."
    },
    "data-science": {
      "model": "anthropic/claude-sonnet-4-5",
      "temperature": 0.2,
      "description": "Data analysis and ML tasks"
    }
  }
}
```

## claude_code - Configuración de Compatibilidad con Claude Code

Controla las diversas funciones de la capa de compatibilidad con Claude Code.

### Campos

| Campo | Tipo | Requerido | Valor por Defecto | Descripción |
| --- | --- | --- | --- | --- |
| `mcp` | boolean | No | - | Si cargar archivos `.mcp.json` |
| `commands` | boolean | No | - | Si cargar Commands |
| `skills` | boolean | No | - | Si cargar Skills |
| `agents` | boolean | No | - | Si cargar Agents (reservado) |
| `hooks` | boolean | No | - | Si cargar hooks de settings.json |
| `plugins` | boolean | No | - | Si cargar plugins del Marketplace |
| `plugins_override` | object | No | - | Deshabilitar plugins específicos (`{pluginName: boolean}`) |

### Ejemplo de Configuración

```jsonc
{
  "claude_code": {
    "mcp": true,
    "commands": true,
    "skills": true,
    "hooks": false,
    "plugins": true,
    "plugins_override": {
      "some-plugin": false
    }
  }
}
```

## sisyphus_agent - Configuración del Agente Sisyphus

Controla el comportamiento del sistema de orquestación Sisyphus.

### Campos

| Campo | Tipo | Requerido | Valor por Defecto | Descripción |
| --- | --- | --- | --- | --- |
| `disabled` | boolean | No | false | Deshabilita el sistema de orquestación Sisyphus |
| `default_builder_enabled` | boolean | No | false | Habilita el agente OpenCode-Builder |
| `planner_enabled` | boolean | No | true | Habilita el agente Prometheus (Planner) |
| `replace_plan` | boolean | No | true | Degrada el agente plan por defecto a subagent |

### Ejemplo de Configuración

```jsonc
{
  "sisyphus_agent": {
    "disabled": false,
    "default_builder_enabled": false,
    "planner_enabled": true,
    "replace_plan": true
  }
}
```

## background_task - Configuración de Tareas en Segundo Plano

Controla el comportamiento de concurrencia del sistema de gestión de agentes en segundo plano.

### Campos

| Campo | Tipo | Requerido | Valor por Defecto | Descripción |
| --- | --- | --- | --- | --- |
| `defaultConcurrency` | number | No | - | Concurrencia máxima por defecto |
| `providerConcurrency` | object | No | - | Límite de concurrencia por proveedor (`{providerName: number}`) |
| `modelConcurrency` | object | No | - | Límite de concurrencia por modelo (`{modelName: number}`) |
| `staleTimeoutMs` | number | No | 180000 | Tiempo de espera (milisegundos), mínimo 60000 |

### Orden de Prioridad

`modelConcurrency` > `providerConcurrency` > `defaultConcurrency`

### Ejemplo de Configuración

```jsonc
{
  "background_task": {
    "defaultConcurrency": 5,
    "providerConcurrency": {
      "anthropic": 3,
      "openai": 5,
      "google": 10
    },
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 2,
      "google/gemini-3-flash": 10
    },
    "staleTimeoutMs": 180000
  }
}
```

## git_master - Configuración del Skill Git Master

Controla el comportamiento del skill Git Master.

### Campos

| Campo | Tipo | Requerido | Valor por Defecto | Descripción |
| --- | --- | --- | --- | --- |
| `commit_footer` | boolean | No | true | Añade el footer "Ultraworked with Sisyphus" en los mensajes de commit |
| `include_co_authored_by` | boolean | No | true | Añade el trailer "Co-authored-by: Sisyphus" en los mensajes de commit |

### Ejemplo de Configuración

```jsonc
{
  "git_master": {
    "commit_footer": true,
    "include_co_authored_by": true
  }
}
```

## browser_automation_engine - Configuración de Automatización del Navegador

Selecciona el proveedor de automatización del navegador.

### Campos

| Campo | Tipo | Requerido | Valor por Defecto | Descripción |
| --- | --- | --- | --- | --- |
| `provider` | enum | No | `playwright` | Proveedor de automatización del navegador |

### Valores de provider

| Valor | Descripción | Requisitos de Instalación |
| --- | --- | --- |
| `playwright` | Usa el servidor MCP de Playwright | Instalación automática |

### Ejemplo de Configuración

```jsonc
{
  "browser_automation_engine": {
    "provider": "playwright"
  }
}
```

## tmux - Configuración de Sesiones Tmux

Controla el comportamiento de gestión de sesiones Tmux.

### Campos

| Campo | Tipo | Requerido | Valor por Defecto | Descripción |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | No | false | Si habilitar la gestión de sesiones Tmux |
| `layout` | enum | No | `main-vertical` | Diseño de Tmux |
| `main_pane_size` | number | No | 60 | Tamaño del panel principal (20-80) |
| `main_pane_min_width` | number | No | 120 | Ancho mínimo del panel principal |
| `agent_pane_min_width` | number | No | 40 | Ancho mínimo del panel de agentes |

### Valores de layout

| Valor | Descripción |
| --- | --- |
| `main-horizontal` | Panel principal arriba, paneles de agentes apilados abajo |
| `main-vertical` | Panel principal a la izquierda, paneles de agentes apilados a la derecha (por defecto) |
| `tiled` | Cuadrícula con todos los paneles del mismo tamaño |
| `even-horizontal` | Todos los paneles dispuestos horizontalmente |
| `even-vertical` | Todos los paneles apilados verticalmente |

### Ejemplo de Configuración

```jsonc
{
  "tmux": {
    "enabled": false,
    "layout": "main-vertical",
    "main_pane_size": 60,
    "main_pane_min_width": 120,
    "agent_pane_min_width": 40
  }
}
```

## ralph_loop - Configuración de Ralph Loop

Controla el comportamiento del flujo de trabajo cíclico Ralph Loop.

### Campos

| Campo | Tipo | Requerido | Valor por Defecto | Descripción |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | No | false | Si habilitar la función Ralph Loop |
| `default_max_iterations` | number | No | 100 | Número máximo de iteraciones por defecto (1-1000) |
| `state_dir` | string | No | - | Directorio personalizado para archivos de estado (relativo a la raíz del proyecto) |

### Ejemplo de Configuración

```jsonc
{
  "ralph_loop": {
    "enabled": false,
    "default_max_iterations": 100,
    "state_dir": ".opencode/"
  }
}
```

## notification - Configuración de Notificaciones

Controla el comportamiento de las notificaciones del sistema.

### Campos

| Campo | Tipo | Requerido | Valor por Defecto | Descripción |
| --- | --- | --- | --- | --- |
| `force_enable` | boolean | No | false | Fuerza la habilitación de session-notification incluso si se detecta un plugin de notificación externo |

### Ejemplo de Configuración

```jsonc
{
  "notification": {
    "force_enable": false
  }
}
```

## comment_checker - Configuración del Verificador de Comentarios

Controla el comportamiento del verificador de comentarios.

### Campos

| Campo | Tipo | Requerido | Valor por Defecto | Descripción |
| --- | --- | --- | --- | --- |
| `custom_prompt` | string | No | - | Prompt personalizado que reemplaza el mensaje de advertencia por defecto. Usa el marcador `{{comments}}` para representar el XML de comentarios detectados |

### Ejemplo de Configuración

```jsonc
{
  "comment_checker": {
    "custom_prompt": "Please review these redundant comments: {{comments}}"
  }
}
```

## experimental - Configuración de Funciones Experimentales

Controla la habilitación de funciones experimentales.

### Campos

| Campo | Tipo | Requerido | Valor por Defecto | Descripción |
| --- | --- | --- | --- | --- |
| `aggressive_truncation` | boolean | No | - | Habilita un comportamiento de truncamiento más agresivo |
| `auto_resume` | boolean | No | - | Habilita la recuperación automática (de errores de bloque de pensamiento o violaciones de deshabilitación de pensamiento) |
| `truncate_all_tool_outputs` | boolean | No | false | Trunca todas las salidas de herramientas, no solo las de la lista blanca |
| `dynamic_context_pruning` | object | No | - | Configuración de poda dinámica de contexto |

### Configuración de dynamic_context_pruning

| Campo | Tipo | Requerido | Valor por Defecto | Descripción |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | No | false | Habilita la poda dinámica de contexto |
| `notification` | enum | No | `detailed` | Nivel de notificación: `off` / `minimal` / `detailed` |
| `turn_protection` | object | No | - | Configuración de protección de turnos |
| `protected_tools` | string[] | No | - | Lista de herramientas que nunca se podan |
| `strategies` | object | No | - | Configuración de estrategias de poda |

### Configuración de turn_protection

| Campo | Tipo | Requerido | Valor por Defecto | Descripción |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | No | true | Habilita la protección de turnos |
| `turns` | number | No | 3 | Protege las salidas de herramientas de los últimos N turnos (1-10) |

### Configuración de strategies

| Campo | Tipo | Requerido | Valor por Defecto | Descripción |
| --- | --- | --- | --- | --- |
| `deduplication` | object | No | - | Configuración de estrategia de deduplicación |
| `supersede_writes` | object | No | - | Configuración de estrategia de sobrescritura de escrituras |
| `purge_errors` | object | No | - | Configuración de estrategia de limpieza de errores |

### Configuración de deduplication

| Campo | Tipo | Requerido | Valor por Defecto | Descripción |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | No | true | Elimina llamadas de herramientas duplicadas (misma herramienta + mismos parámetros) |

### Configuración de supersede_writes

| Campo | Tipo | Requerido | Valor por Defecto | Descripción |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | No | true | Poda las entradas de escritura en lecturas posteriores |
| `aggressive` | boolean | No | false | Modo agresivo: poda CUALQUIER escritura si hay CUALQUIER lectura posterior |

### Configuración de purge_errors

| Campo | Tipo | Requerido | Valor por Defecto | Descripción |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | No | true | Poda las entradas de herramientas con error después de N turnos |
| `turns` | number | No | 5 | Número de turnos para podar entradas de herramientas con error (1-20) |

### Ejemplo de Configuración

```jsonc
{
  "experimental": {
    "aggressive_truncation": true,
    "auto_resume": true,
    "truncate_all_tool_outputs": false,
    "dynamic_context_pruning": {
      "enabled": false,
      "notification": "detailed",
      "turn_protection": {
        "enabled": true,
        "turns": 3
      },
      "protected_tools": [
        "task",
        "todowrite",
        "todoread",
        "lsp_rename",
        "session_read",
        "session_write",
        "session_search"
      ],
      "strategies": {
        "deduplication": {
          "enabled": true
        },
        "supersede_writes": {
          "enabled": true,
          "aggressive": false
        },
        "purge_errors": {
          "enabled": true,
          "turns": 5
        }
      }
    }
  }
}
```

## skills - Configuración de Skills

Configura la carga y comportamiento de Skills (habilidades especializadas).

### Formato de Configuración

Skills soporta dos formatos:

**Formato 1: Array Simple**

```jsonc
{
  "skills": ["skill1", "skill2", "skill3"]
}
```

**Formato 2: Configuración de Objeto**

```jsonc
{
  "skills": {
    "sources": [
      "path/to/skills",
      {
        "path": "another/path",
        "recursive": true,
        "glob": "*.md"
      }
    ],
    "enable": ["skill1", "skill2"],
    "disable": ["skill3"]
  }
}
```

### Campos de Definición de Skill

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `description` | string | No | Descripción del Skill |
| `template` | string | No | Plantilla del Skill |
| `from` | string | No | Origen |
| `model` | string | No | Modelo a usar |
| `agent` | string | No | Agente a usar |
| `subtask` | boolean | No | Si es una subtarea |
| `argument-hint` | string | No | Sugerencia de argumentos |
| `license` | string | No | Licencia |
| `compatibility` | string | No | Compatibilidad |
| `metadata` | object | No | Metadatos |
| `allowed-tools` | string[] | No | Lista de herramientas permitidas |
| `disable` | boolean | No | Deshabilita este Skill |

### Skills Integrados

| Skill | Descripción |
| --- | --- |
| `playwright` | Automatización del navegador (por defecto) |
| `agent-browser` | Automatización del navegador (Vercel CLI) |
| `frontend-ui-ux` | Diseño de UI/UX frontend |
| `git-master` | Experto en Git |

## Listas de Deshabilitación

Los siguientes campos se usan para deshabilitar módulos de funciones específicos.

### disabled_mcps - Lista de MCPs Deshabilitados

```jsonc
{
  "disabled_mcps": ["websearch", "context7", "grep_app"]
}
```

### disabled_agents - Lista de Agentes Deshabilitados

```jsonc
{
  "disabled_agents": ["oracle", "multimodal-looker"]
}
```

### disabled_skills - Lista de Skills Deshabilitados

```jsonc
{
  "disabled_skills": ["playwright"]
}
```

### disabled_hooks - Lista de Hooks Deshabilitados

```jsonc
{
  "disabled_hooks": ["comment-checker", "agent-usage-reminder"]
}
```

### disabled_commands - Lista de Comandos Deshabilitados

```jsonc
{
  "disabled_commands": ["init-deep", "start-work"]
}
```

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver las ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-26

| Función | Ruta del Archivo | Líneas |
| --- | --- | --- |
| Definición del Schema de Configuración | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/config/schema.ts) | 1-378 |
| JSON Schema | [`assets/oh-my-opencode.schema.json`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/assets/oh-my-opencode.schema.json) | 1-51200 |
| Documentación de Configuración | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/docs/configurations.md) | 1-595 |

**Tipos Clave**:
- `OhMyOpenCodeConfig`: Tipo de configuración principal
- `AgentOverrideConfig`: Tipo de configuración de sobrescritura de agentes
- `CategoryConfig`: Tipo de configuración de Category
- `BackgroundTaskConfig`: Tipo de configuración de tareas en segundo plano
- `PermissionValue`: Tipo de valor de permiso (`ask`/`allow`/`deny`)

**Enumeraciones Clave**:
- `BuiltinAgentNameSchema`: Enumeración de nombres de agentes integrados
- `BuiltinSkillNameSchema`: Enumeración de nombres de skills integrados
- `BuiltinCategoryNameSchema`: Enumeración de nombres de Categories integrados
- `HookNameSchema`: Enumeración de nombres de hooks
- `BrowserAutomationProviderSchema`: Enumeración de proveedores de automatización del navegador

---

## Próxima Lección

> En la próxima lección aprenderemos sobre **[Servidores MCP Integrados](../builtin-mcps/)**.
>
> Aprenderás:
> - Las funciones y métodos de uso de los 3 servidores MCP integrados
> - Configuración y mejores prácticas de Exa Websearch, Context7 y grep.app
> - Cómo usar MCP para buscar documentación y código

</details>
