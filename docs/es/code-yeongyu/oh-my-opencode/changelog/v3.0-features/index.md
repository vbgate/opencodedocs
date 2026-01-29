---
title: "v3.0: Categorías y Habilidades | oh-my-opencode"
sidebarTitle: "Características v3.0"
subtitle: "v3.0: Categorías y Habilidades"
description: "Aprende el nuevo sistema de Categorías y Habilidades de oh-my-opencode v3.0. Domina 7 categorías integradas, 3 paquetes de habilidades y composición dinámica de agentes."
tags:
  - "v3.0"
  - "categories"
  - "skills"
  - "changelog"
order: 200
---

# Características v3.0: Guía Completa de Categorías y Habilidades

## Resumen de la Versión

oh-my-opencode v3.0 es un lanzamiento hito importante que introduce el nuevo **sistema de Categorías y Habilidades**, revolucionando la forma en que se orquestan los agentes IA. Esta versión tiene como objetivo hacer que los agentes IA sean más especializados, flexibles y componibles.

**Mejoras Clave**:
- 🎯 **Sistema de Categorías**: 7 categorías de tareas integradas con selección automática de modelo
- 🛠️ **Sistema de Habilidades**: 3 paquetes de habilidades profesionales integradas para inyectar conocimiento de dominio
- 🔄 **Composición Dinámica**: Combina libremente Categoría y Habilidad a través de `delegate_task`
- 🚀 **Sisyphus-Junior**: Nuevo ejecutor de tareas delegadas que previene bucles infinitos
- 📝 **Configuración Flexible**: Soporte para Categorías y Habilidades personalizadas

---

## Característica Principal 1: Sistema de Categorías

### ¿Qué es una Categoría?

Una Categoría es un **preajuste de configuración de agente especializado** optimizado para un dominio específico. Responde una pregunta clave: **"¿Qué tipo de trabajo es este?"**

Cada Categoría define:
- **Modelo a usar** (model)
- **Parámetro de temperatura** (temperature)
- **Mentalidad de prompt** (prompt mindset)
- **Capacidad de razonamiento** (reasoning effort)
- **Permisos de herramientas** (tools)

### 7 Categorías Integradas

| Categoría | Modelo Predeterminado | Temperatura | Casos de Uso |
|-----------|------------------------|--------------|--------------|
| `visual-engineering` | `google/gemini-3-pro` | 0.7 | Frontend, UI/UX, diseño, estilos, animaciones |
| `ultrabrain` | `openai/gpt-5.2-codex` (xhigh) | 0.1 | Razonamiento lógico profundo, decisiones complejas de arquitectura que requieren análisis extensivo |
| `artistry` | `google/gemini-3-pro` (max) | 0.7 | Tareas de alta creatividad/artísticas, ideas novedosas |
| `quick` | `anthropic/claude-haiku-4-5` | 0.1 | Tareas simples - modificación de archivo único, corrección de errores tipográficos, cambios simples |
| `unspecified-low` | `anthropic/claude-sonnet-4-5` | 0.1 | Tareas que no encajan en otras categorías, carga de trabajo baja |
| `unspecified-high` | `anthropic/claude-opus-4-5` (max) | 0.1 | Tareas que no encajan en otras categorías, carga de trabajo alta |
| `writing` | `google/gemini-3-flash` | 0.1 | Documentación, ensayos, escritura técnica |

**Fuente**: `docs/category-skill-guide.md:22-30`

### ¿Cómo Usar las Categorías?

Al llamar a la herramienta `delegate_task`, especifica el parámetro `category`:

```typescript
// Delegar tarea de frontend a la categoría visual-engineering
delegate_task(
  category="visual-engineering",
  prompt="Add responsive chart component to dashboard page"
)
```

El sistema automáticamente:
1. Seleccionará la Categoría `visual-engineering`
2. Usará el modelo `google/gemini-3-pro`
3. Aplicará `temperature: 0.7` (alta creatividad)
4. Cargará la mentalidad de prompt de la Categoría

### Sisyphus-Junior: Ejecutor de Tareas Delegadas

Cuando usas una Categoría, un agente especial llamado **Sisyphus-Junior** ejecutará la tarea.

**Características Clave**:
- ❌ **No puede re-delegar** tareas a otros agentes
- 🎯 **Enfocado en tareas asignadas**
- 🔄 **Prevención de bucles infinitos de delegación**

**Propósito de Diseño**: Garantiza que los agentes se concentren en la tarea actual, evitando la complejidad causada por la delegación de tareas capa por capa.

---

## Característica Principal 2: Sistema de Habilidades

### ¿Qué es una Habilidad?

Una Habilidad es un mecanismo que inyecta **experiencia de dominio (Context)** y **herramientas (MCP)** en un agente. Responde otra pregunta clave: **"¿Qué herramientas y conocimientos se necesitan?"**

### 3 Habilidades Integradas

#### 1. `git-master`

**Capacidades**:
- Experto en Git
- Detectar estilo de commit
- Dividir commits atómicos
- Crear estrategias de rebase

**MCP**: Ninguno (usa comandos de Git)

**Casos de Uso**: Commits, búsqueda de historial, gestión de ramas

#### 2. `playwright`

**Capacidades**:
- Automatización de navegador
- Pruebas web
- Capturas de pantalla
- Extracción de datos

**MCP**: `@playwright/mcp` (ejecutado automáticamente)

**Casos de Uso**: Validación de UI posterior a la implementación, escritura de pruebas E2E

#### 3. `frontend-ui-ux`

**Capacidades**:
- Inyectar mentalidad de diseñador
- Guías de color, tipografía, movimiento

**Casos de Uso**: Trabajo de UI hermoso más allá de la implementación simple

**Fuente**: `docs/category-skill-guide.md:57-70`

### ¿Cómo Usar las Habilidades?

Agrega un array `load_skills` en `delegate_task`:

```typescript
// Delegar tarea rápida y cargar habilidad git-master
delegate_task(
  category="quick",
  load_skills=["git-master"],
  prompt="Commit current changes. Follow commit message style."
)
```

El sistema automáticamente:
1. Seleccionará la Categoría `quick` (Claude Haiku, bajo costo)
2. Cargará la Habilidad `git-master` (inyecta experiencia en Git)
3. Lanzará Sisyphus-Junior para ejecutar la tarea

### Habilidades Personalizadas

Puedes agregar Habilidades personalizadas directamente en `.opencode/skills/` en la raíz del proyecto o en `~/.claude/skills/` en el directorio del usuario.

**Ejemplo: `.opencode/skills/my-skill/SKILL.md`**

```markdown
---
name: my-skill
description: My professional custom skill
mcp:
  my-mcp:
    command: npx
    args: ["-y", "my-mcp-server"]
---

# My Skill Prompt

This content will be injected into the agent's system prompt.
...
```

**Fuente**: `docs/category-skill-guide.md:87-103`

---

## Característica Principal 3: Capacidad de Composición Dinámica

### Estrategia de Composición: Crear Agentes Especializados

Al combinar diferentes Categorías y Habilidades, puedes crear poderosos agentes especializados.

#### 🎨 Diseñador (Implementación de UI)

- **Categoría**: `visual-engineering`
- **load_skills**: `["frontend-ui-ux", "playwright"]`
- **Efecto**: Implementar UI hermosa y validar resultados de renderizado directamente en el navegador

#### 🏗️ Arquitecto (Revisión de Diseño)

- **Categoría**: `ultrabrain`
- **load_skills**: `[]` (razonamiento puro)
- **Efecto**: Usar la capacidad de razonamiento lógico de GPT-5.2 para análisis profundo de arquitectura de sistema

#### ⚡ Mantenedor (Correcciones Rápidas)

- **Categoría**: `quick`
- **load_skills**: `["git-master"]`
- **Efecto**: Corregir código rápidamente usando un modelo rentable y generar commits limpios

**Fuente**: `docs/category-skill-guide.md:111-124`

### Guía de Prompts de delegate_task

Al delegar tareas, los prompts **claros y específicos** son cruciales. Incluye los siguientes 7 elementos:

1. **TASK**: ¿Qué necesita hacerse? (objetivo único)
2. **EXPECTED OUTCOME**: ¿Cuál es el entregable?
3. **REQUIRED SKILLS**: ¿Qué habilidades deben cargarse vía `load_skills`?
4. **REQUIRED TOOLS**: ¿Qué herramientas deben usarse? (lista blanca)
5. **MUST DO**: ¿Qué debe hacerse? (restricciones)
6. **MUST NOT DO**: ¿Qué nunca debe hacerse?
7. **CONTEXT**: Rutas de archivos, patrones existentes, materiales de referencia

**❌ Mal Ejemplo**:
> "Fix this"

**✅ Buen Ejemplo**:
> **TASK**: Fix mobile layout issue in `LoginButton.tsx`
> **CONTEXT**: `src/components/LoginButton.tsx`, using Tailwind CSS
> **MUST DO**: Change flex-direction at `md:` breakpoint
> **MUST NOT DO**: Modify existing desktop layout
> **EXPECTED**: Button aligns vertically on mobile

**Fuente**: `docs/category-skill-guide.md:130-148`

---

## Guía de Configuración

### Esquema de Configuración de Categorías

Puedes ajustar finamente las Categorías en `oh-my-opencode.json`.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `description` | string | Descripción legible por humanos del propósito de la Categoría. Se muestra en los prompts de delegate_task. |
| `model` | string | ID del modelo IA a usar (ej., `anthropic/claude-opus-4-5`) |
| `variant` | string | Variante del modelo (ej., `max`, `xhigh`) |
| `temperature` | number | Nivel de creatividad (0.0 ~ 2.0). Más bajo es más determinista. |
| `top_p` | number | Parámetro de muestreo de núcleo (0.0 ~ 1.0) |
| `prompt_append` | string | Contenido agregado al prompt del sistema cuando se selecciona esta Categoría |
| `thinking` | object | Configuración del modelo de pensamiento (`{ type: "enabled", budgetTokens: 16000 }`) |
| `reasoningEffort` | string | Nivel de esfuerzo de razonamiento (`low`, `medium`, `high`) |
| `textVerbosity` | string | Verbosidad del texto (`low`, `medium`, `high`) |
| `tools` | object | Control de uso de herramientas (usa `{ "tool_name": false }` para deshabilitar) |
| `maxTokens` | number | Tokens de respuesta máximos |
| `is_unstable_agent` | boolean | Marcar agente como inestable - forzar modo de fondo para monitoreo |

**Fuente**: `docs/category-skill-guide.md:159-172`

### Ejemplo de Configuración

```jsonc
{
  "categories": {
    // 1. Definir nueva categoría personalizada
    "korean-writer": {
      "model": "google/gemini-3-flash",
      "temperature": 0.5,
      "prompt_append": "You are a Korean technical writer. Maintain a friendly and clear tone."
    },

    // 2. Sobrescribir categoría existente (cambiar modelo)
    "visual-engineering": {
      "model": "openai/gpt-5.2",
      "temperature": 0.8
    },

    // 3. Configurar modelo de pensamiento y limitar herramientas
    "deep-reasoning": {
      "model": "anthropic/claude-opus-4-5",
      "thinking": {
        "type": "enabled",
        "budgetTokens": 32000
      },
      "tools": {
        "websearch_web_search_exa": false // Deshabilitar búsqueda web
      }
    }
  },

  // Deshabilitar habilidades
  "disabled_skills": ["playwright"]
}
```

**Fuente**: `docs/category-skill-guide.md:175-206`

---

## Otras Mejoras Importantes

Además del sistema de Categorías y Habilidades, v3.0 incluye las siguientes mejoras importantes:

### Mejoras de Estabilidad
- ✅ Versión marcada como estable (3.0.1)
- ✅ Mecanismo de delegación de agentes optimizado
- ✅ Capacidad de recuperación de errores mejorada

### Optimizaciones de Rendimiento
- ✅ Reducida inyección de contexto innecesario
- ✅ Mecanismo de sondeo de tareas en segundo plano optimizado
- ✅ Eficiencia de orquestación multi-modelo mejorada

### Compatibilidad con Claude Code
- ✅ Totalmente compatible con el formato de configuración de Claude Code
- ✅ Soporta cargar Habilidades, Comandos, MCPs de Claude Code
- ✅ Descubrimiento y configuración automáticos

**Fuente**: `README.md:18-20`, `README.md:292-304`

---

## Próximos Pasos

El sistema de Categorías y Habilidades en v3.0 establece una base flexible para extender oh-my-opencode. Si deseas profundizar en el uso de estas nuevas características, consulta las siguientes secciones:

- [Categorías y Habilidades: Composición Dinámica de Agentes](../../advanced/categories-skills/) - Guía detallada de uso
- [Habilidades Integradas: Automatización de Navegador y Experto en Git](../../advanced/builtin-skills/) - Análisis profundo de Habilidades
- [Configuración Avanzada: Agentes y Gestión de Permisos](../../advanced/advanced-configuration/) - Guía de configuración personalizada

¡Comienza a explorar estas nuevas características y haz que tus agentes IA sean más especializados y eficientes!
