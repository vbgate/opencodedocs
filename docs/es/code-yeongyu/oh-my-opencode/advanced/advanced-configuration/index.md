---
title: "Configuración Avanzada: Agentes y Permisos | oh-my-opencode"
sidebarTitle: "Controlar Comportamiento de Agentes"
subtitle: "Configuración Avanzada: Agentes y Permisos | oh-my-opencode"
description: "Aprende a configurar agentes, establecer permisos, sobrescribir modelos y modificar prompts en oh-my-opencode. Personaliza profundamente tu equipo de desarrollo AI para controlar con precisión el comportamiento y capacidades de cada agente."
tags:
  - "configuration"
  - "agents"
  - "permissions"
  - "customization"
prerequisite:
  - "start-installation"
  - "platforms-provider-setup"
order: 140
---

# Configuración Profunda: Gestión de Agentes y Permisos

## Qué Aprenderás

- Personalizar el modelo y parámetros que usa cada agente
- Controlar con precisión los permisos de los agentes (edición de archivos, ejecución de Bash, solicitudes web, etc.)
- Añadir instrucciones adicionales a los agentes mediante `prompt_append`
- Crear categorías personalizadas para lograr combinaciones dinámicas de agentes
- Habilitar/deshabilitar agentes específicos, Skills, Hooks y MCPs

## Tu Problema Actual

**La configuración predeterminada funciona bien, pero no se adapta perfectamente a tus necesidades:**
- Oracle usa GPT 5.2 que es muy costoso, quieres cambiar a un modelo más económico
- El agente Explore no debería tener permisos para escribir archivos, solo permitir búsqueda
- Quieres que Librarian priorice la búsqueda de documentación oficial en lugar de GitHub
- Un Hook siempre produce falsos positivos, quieres deshabilitarlo temporalmente

**Lo que necesitas es "personalización profunda"** — no es "funciona y ya", sino "justo lo que necesitas".

---

## 🎒 Preparativos Antes de Empezar

::: warning Requisitos previos
Este tutorial asume que has completado la [instalación y configuración](../../start/installation/) y la [configuración de Provider](../../platforms/provider-setup/).
:::

**Debes saber**:
- Ubicación del archivo de configuración: `~/.config/opencode/oh-my-opencode.json` (nivel de usuario) o `.opencode/oh-my-opencode.json` (nivel de proyecto)
- La configuración a nivel de usuario tiene prioridad sobre la configuración a nivel de proyecto

---

## Idea Central

**Prioridad de configuración**: configuración de usuario > configuración de proyecto > configuración predeterminada

```
~/.config/opencode/oh-my-opencode.json (mayor prioridad)
    ↓ sobrescribe
.opencode/oh-my-opencode.json (nivel de proyecto)
    ↓ sobrescribe
valores predeterminados integrados en oh-my-opencode (menor prioridad)
```

**El archivo de configuración soporta JSONC**:
- Puedes usar `//` para añadir comentarios
- Puedes usar `/* */` para añadir comentarios de bloque
- Puedes tener comas finales

---

## Sígueme

### Paso 1: Encontrar el archivo de configuración y habilitar el autocompletado de Schema

**Por qué**
Después de habilitar el JSON Schema, el editor sugerirá automáticamente todos los campos y tipos disponibles, evitando errores de configuración.

**Operación**:

```jsonc
{
  // Añade esta línea para habilitar el autocompletado
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  
  // Tu configuración...
}
```

**Deberías ver**:
- En VS Code / JetBrains y otros editores, al escribir `{` se sugieren automáticamente todos los campos disponibles
- Al pasar el ratón sobre un campo se muestra la descripción y el tipo

---

### Paso 2: Personalizar el modelo de los agentes

**Por qué**
Diferentes tareas requieren diferentes modelos:
- **Diseño de arquitectura**: usar el modelo más potente (Claude Opus 4.5)
- **Exploración rápida**: usar el modelo más rápido (Grok Code)
- **Diseño de UI**: usar el modelo visual (Gemini 3 Pro)
- **Control de costos**: usar modelos económicos para tareas simples

**Operación**:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "agents": {
    // Oracle: asesor estratégico, usar GPT 5.2
    "oracle": {
      "model": "openai/gpt-5.2",
      "temperature": 0.1  // Temperatura baja, más determinista
    },

    // Explore: exploración rápida, usar modelo gratuito
    "explore": {
      "model": "opencode/gpt-5-nano",  // Gratuito
      "temperature": 0.3
    },

    // Librarian: búsqueda de documentación, usar modelo con contexto grande
    "librarian": {
      "model": "anthropic/claude-sonnet-4-5"
    },

    // Multimodal Looker: análisis de medios, usar Gemini
    "multimodal-looker": {
      "model": "google/gemini-3-flash"
    }
  }
}
```

**Deberías ver**:
- Cada agente usa modelos diferentes, optimizados según las características de la tarea
- Después de guardar la configuración, la próxima vez que se invoque el agente correspondiente se usará el nuevo modelo

---

### Paso 3: Configurar permisos de los agentes

**Por qué**
Algunos agentes **no deberían** tener todos los permisos:
- Oracle (asesor estratégico): solo lectura, no necesita escribir archivos
- Librarian (experto en investigación): solo lectura, no necesita ejecutar Bash
- Explore (exploración): solo lectura, no necesita solicitudes web

**Operación**:

```jsonc
{
  "agents": {
    "explore": {
      // Prohibir escritura de archivos y ejecución de Bash, solo permitir búsqueda web
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"
      }
    },

    "librarian": {
      // Permisos de solo lectura
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"  // Necesita buscar documentación
      }
    },

    "oracle": {
      // Permisos de solo lectura
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"  // Necesita consultar recursos
      }
    },

    // Sisyphus: orquestador principal, puede ejecutar todas las operaciones
    "sisyphus": {
      "permission": {
        "edit": "allow",
        "bash": "allow",
        "webfetch": "allow"
      }
    }
  }
}
```

**Descripción de permisos**:

| Permiso | Valores | Descripción |
|--- | --- | ---|
| `edit` | `ask/allow/deny` | Permisos de edición de archivos |
| `bash` | `ask/allow/deny` u objeto | Permisos de ejecución de Bash (puede refinarse a comandos específicos) |
| `webfetch` | `ask/allow/deny` | Permisos de solicitudes web |
| `doom_loop` | `ask/allow/deny` | Permite al agente anular la detección de bucle infinito |
| `external_directory` | `ask/allow/deny` | Permisos para acceder a directorios fuera del proyecto |

**Refinar permisos de Bash**:

```jsonc
{
  "agents": {
    "explore": {
      "permission": {
        "bash": {
          "git": "allow",      // Permitir ejecutar comandos git
          "grep": "allow",     // Permitir ejecutar grep
          "rm": "deny",       // Prohibir eliminar archivos
          "mv": "deny"        // Prohibir mover archivos
        }
      }
    }
  }
}
```

**Deberías ver**:
- Después de configurar los permisos, cuando un agente intente ejecutar una operación prohibida será rechazado automáticamente
- En OpenCode verás una notificación de que el permiso fue denegado

---

### Paso 4: Usar prompt_append para añadir instrucciones adicionales

**Por qué**
El prompt del sistema predeterminado ya es muy bueno, pero podrías tener **necesidades especiales**:
- Hacer que Librarian priorice la búsqueda de documentación específica
- Hacer que Oracle siga patrones de arquitectura específicos
- Hacer que Explore use palabras clave de búsqueda específicas

**Operación**:

```jsonc
{
  "agents": {
    "librarian": {
      // Se añade al final del prompt del sistema predeterminado, no lo sobrescribe
      "prompt_append": "Always use elisp-dev-mcp for Emacs Lisp documentation lookups. " +
                      "When searching for docs, prioritize official documentation over blog posts."
    },

    "oracle": {
      "prompt_append": "Follow SOLID principles and Clean Architecture patterns. " +
                    "Always suggest TypeScript types for all function signatures."
    },

    "explore": {
      "prompt_append": "When searching code, prioritize recent commits and actively maintained files. " +
                    "Ignore test files unless explicitly asked."
    }
  }
}
```

**Deberías ver**:
- El comportamiento del agente cambia, pero mantiene sus capacidades originales
- Por ejemplo, hacer que Oracle siempre sugiera tipos de TypeScript al hacer consultas

---

### Paso 5: Personalizar configuración de Category

**Por qué**
Category es una característica nueva de v3.0, implementando **combinaciones dinámicas de agentes**:
- Presetear modelos y parámetros para tipos de tareas específicos
- Llamada rápida mediante `delegate_task(category="...")`
- Más eficiente que "seleccionar manualmente modelo + escribir prompt"

**Operación**:

```jsonc
{
  "categories": {
    // Personalizado: tareas de ciencia de datos
    "data-science": {
      "model": "anthropic/claude-sonnet-4-5",
      "temperature": 0.2,
      "prompt_append": "Focus on data analysis, ML pipelines, and statistical methods. " +
                      "Use pandas/numpy for Python and dplyr/tidyr for R."
    },

    // Sobrescribir predeterminado: tareas de UI usan prompt personalizado
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "prompt_append": "Use shadcn/ui components and Tailwind CSS. " +
                      "Ensure responsive design and accessibility."
    },

    // Sobrescribir predeterminado: tareas rápidas
    "quick": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.1,
      "prompt_append": "Be concise. Focus on simple fixes and quick searches."
    }
  }
}
```

**Campos de configuración de Category**:

| Campo | Descripción | Ejemplo |
|--- | --- | ---|
| `model` | Modelo a usar | `"anthropic/claude-sonnet-4-5"` |
| `temperature` | Temperatura (0-2) | `0.2` (determinista) / `0.8` (creativo) |
| `top_p` | Muestreo de núcleo (0-1) | `0.9` |
| `maxTokens` | Número máximo de Tokens | `4000` |
| `thinking` | Configuración de Thinking | `{"type": "enabled", "budgetTokens": 16000}` |
| `prompt_append` | Añadir prompt | `"Use X for Y"` |
| `tools` | Permisos de herramientas | `{"bash": false}` |
| `is_unstable_agent` | Marcar como inestable (forzar modo fondo) | `true` |

**Usar Category**:

```
// En OpenCode
delegate_task(category="data-science", prompt="Analizar este conjunto de datos y generar visualizaciones")
delegate_task(category="visual-engineering", prompt="Crear componente de panel responsivo")
delegate_task(category="quick", prompt="Buscar definición de esta función")
```

**Deberías ver**:
- Diferentes tipos de tareas usan automáticamente el modelo y configuración más apropiados
- No es necesario especificar manualmente el modelo y parámetros cada vez

---

### Paso 6: Deshabilitar funcionalidades específicas

**Por qué**
Algunas funcionalidades podrían no adaptarse a tu flujo de trabajo:
- `comment-checker`: tu proyecto permite comentarios detallados
- `agent-usage-reminder`: sabes qué agente usar en qué momento
- Algún MCP: no lo necesitas

**Operación**:

```jsonc
{
  // Deshabilitar Hooks específicos
  "disabled_hooks": [
    "comment-checker",           // No revisar comentarios
    "agent-usage-reminder",       // No mostrar sugerencias de uso de agentes
    "startup-toast"               // No mostrar notificación de inicio
  ],

  // Deshabilitar Skills específicos
  "disabled_skills": [
    "playwright",                // No usar Playwright
    "frontend-ui-ux"            // No usar Skill de frontend integrado
  ],

  // Deshabilitar MCPs específicos
  "disabled_mcps": [
    "websearch",                // No usar búsqueda Exa
    "context7",                // No usar Context7
    "grep_app"                 // No usar grep.app
  ],

  // Deshabilitar agentes específicos
  "disabled_agents": [
    "multimodal-looker",        // No usar Looker multimodal
    "metis"                   // No usar Metis de planificación previa
  ]
}
```

**Lista de Hooks disponibles** (parcial):

| Nombre de Hook | Función |
|--- | ---|
| `todo-continuation-enforcer` | Forzar completar lista de TODO |
| `comment-checker` | Detectar comentarios redundantes |
| `tool-output-truncator` | Truncar salida de herramientas para ahorrar contexto |
| `keyword-detector` | Detectar palabras clave como ultrawork |
| `agent-usage-reminder` | Sugerir qué agente usar |
| `session-notification` | Notificación de fin de sesión |
| `background-notification` | Notificación de finalización de tarea en segundo plano |

**Deberías ver**:
- Las funcionalidades deshabilitadas ya no se ejecutan
- Después de rehabilitar se restablece su funcionalidad

---

### Paso 7: Configurar control de concurrencia de tareas en segundo plano

**Por qué**
Las tareas paralelas en segundo plano necesitan **controlar la concurrencia**:
- Evitar limitación de API
- Controlar costos (modelos costosos no pueden tener demasiada concurrencia)
- Cumplir cuotas de Provider

**Operación**:

```jsonc
{
  "background_task": {
    // Concurrencia máxima predeterminada
    "defaultConcurrency": 5,

    // Límites de concurrencia a nivel de Provider
    "providerConcurrency": {
      "anthropic": 3,      // Anthropic API máximo 3 concurrentes
      "openai": 5,         // OpenAI API máximo 5 concurrentes
      "google": 10          // Gemini API máximo 10 concurrentes
    },

    // Límites de concurrencia a nivel de modelo (mayor prioridad)
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 2,     // Opus muy costoso, limitar a 2 concurrentes
      "google/gemini-3-flash": 10,          // Flash muy económico, permitir 10 concurrentes
      "anthropic/claude-haiku-4-5": 15      // Haiku aún más económico, permitir 15 concurrentes
    }
  }
}
```

**Orden de prioridad**:
```
modelConcurrency > providerConcurrency > defaultConcurrency
```

**Deberías ver**:
- Las tareas en segundo plano que excedan los límites de concurrencia esperarán en cola
- La concurrencia de modelos costosos está limitada, ahorrando costos

---

### Paso 8: Habilitar características experimentales

**Por qué**
Las características experimentales proporcionan **capacidades adicionales**, pero podrían ser inestables:
- `aggressive_truncation`: truncamiento de contexto más agresivo
- `auto_resume`: recuperación automática de bloqueos
- `truncate_all_tool_outputs`: truncar toda la salida de herramientas

::: danger Advertencia
Las características experimentales podrían ser eliminadas o cambiar su comportamiento en versiones futuras. Prueba a fondo antes de habilitar.
:::

**Operación**:

```jsonc
{
  "experimental": {
    // Habilitar truncamiento más agresivo de la salida de herramientas
    "aggressive_truncation": true,

    // Recuperación automática de errores de bloque thinking
    "auto_resume": true,

    // Truncar toda la salida de herramientas (no solo Grep/Glob/LSP/AST-Grep)
    "truncate_all_tool_outputs": false
  }
}
```

**Deberías ver**:
- En modo agresivo, la salida de herramientas se trunca más estrictamente para ahorrar contexto
- Después de habilitar `auto_resume`, los agentes se recuperan automáticamente y continúan trabajando al encontrar errores

---

## Punto de Control ✅

**Verificar si la configuración está en vigor**:

```bash
# Ejecutar comando de diagnóstico
bunx oh-my-opencode doctor --verbose
```

**Deberías ver**:
- Resultados de resolución de modelo de cada agente
- Si tus sobrescrituras de configuración están en vigor
- Si las funcionalidades deshabilitadas son reconocidas correctamente

---

## Trampas y Advertencias

### 1. Error de formato del archivo de configuración

**Problema**:
- Error de sintaxis JSON (falta comas, comas extra)
- Error tipográfico en nombre de campo (`temperature` escrito como `temparature`)

**Solución**:
```bash
# Verificar formato JSON
cat ~/.config/opencode/oh-my-opencode.json | jq .
```

### 2. Permisos de configuración demasiado estrictos

**Problema**:
- Algunos agentes están completamente deshabilitados (`edit: "deny"`, `bash: "deny"`)
- Impide que los agentes completen su trabajo normal

**Solución**:
- Los agentes de solo lectura (Oracle, Librarian) pueden deshabilitar `edit` y `bash`
- El orquestador principal (Sisyphus) necesita permisos completos

### 3. Configuración de Category no entra en vigor

**Problema**:
- Error tipográfico en nombre de Category (`visual-engineering` escrito como `visual-engineering`)
- `delegate_task` no especifica el parámetro `category`

**Solución**:
- Verificar que el nombre en `delegate_task(category="...")` coincida con la configuración
- Usar `doctor --verbose` para verificar resultados de resolución de Category

### 4. Límite de concurrencia demasiado bajo

**Problema**:
- `modelConcurrency` configurado muy bajo (como `1`)
- Las tareas en segundo plano se ejecutan casi en serie, perdiendo la ventaja del paralelismo

**Solución**:
- Configurar razonablemente según presupuesto y cuotas de API
- Modelos costosos (Opus) limitados a 2-3, modelos económicos (Haiku) pueden ser 10+

---

## Resumen de la Lección

**Personalización profunda de configuración = control preciso**:

| Configuración | Propósito | Escenarios comunes |
|--- | --- | ---|
| `agents.model` | Sobrescribir modelo de agente | Optimización de costos, adaptación de tareas |
| `agents.permission` | Controlar permisos de agente | Aislamiento de seguridad, modo solo lectura |
| `agents.prompt_append` | Añadir instrucciones adicionales | Seguir normas de arquitectura, optimizar estrategias de búsqueda |
| `categories` | Combinaciones dinámicas de agentes | Llamada rápida a tipos de tareas específicas |
| `background_task` | Control de concurrencia | Control de costos, cuotas de API |
| `disabled_*` | Deshabilitar funcionalidades específicas | Eliminar funcionalidades poco comunes |

**Recuerda**:
- La configuración a nivel de usuario (`~/.config/opencode/oh-my-opencode.json`) tiene prioridad sobre el nivel de proyecto
- Usar JSONC para que la configuración sea más legible
- Ejecutar `oh-my-opencode doctor --verbose` para verificar la configuración

---

## Próxima Lección

> La próxima lección aprenderemos **[Diagnóstico y Solución de Problemas de Configuración](../../faq/troubleshooting/)**.
>
> Aprenderás:
> - Usar el comando doctor para verificar el estado
> - Diagnosticar problemas de versión de OpenCode, registro de plugins, configuración de Provider, etc.
> - Entender el mecanismo de resolución de modelos y configuración de Categories
> - Usar salida JSON para diagnóstico automatizado

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Clic para expandir y ver ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-26

| Funcionalidad | Ruta de archivo | Líneas |
|--- | --- | ---|
| Definición de Schema de configuración | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 1-378 |
| AgentOverrideConfig | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 98-119 |
| CategoryConfig | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 154-172 |
| AgentPermissionSchema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 11-17 |
| OhMyOpenCodeConfigSchema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 329-350 |
| Documentación de configuración | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md) | 1-595 |

**Constantes clave**:
- `PermissionValue = z.enum(["ask", "allow", "deny"])`：enumeración de valores de permiso

**Tipos clave**:
- `AgentOverrideConfig`：configuración de sobrescritura de agente (modelo, temperatura, prompt, etc.)
- `CategoryConfig`：configuración de Category (modelo, temperatura, prompt, etc.)
- `AgentPermissionSchema`：configuración de permisos de agente (edit, bash, webfetch, etc.)
- `BackgroundTaskConfig`：configuración de concurrencia de tareas en segundo plano

**Enumeración de agentes integrados**（`BuiltinAgentNameSchema`）：
- `sisyphus`, `prometheus`, `oracle`, `librarian`, `explore`, `multimodal-looker`, `metis`, `momus`, `atlas`

**Enumeración de Skills integrados**（`BuiltinSkillNameSchema`）：
- `playwright`, `agent-browser`, `frontend-ui-ux`, `git-master`

**Enumeración de Categories integrados**（`BuiltinCategoryNameSchema`）：
- `visual-engineering`, `ultrabrain`, `artistry`, `quick`, `unspecified-low`, `unspecified-high`, `writing`

</details>
