---
title: "Modelos Disponibles: Guía de Configuración Claude y Gemini | Antigravity Auth"
sidebarTitle: "Elegir el Modelo Correcto"
subtitle: "Conoce todos los modelos disponibles y sus configuraciones de variantes"
description: "Aprende la configuración de modelos de Antigravity Auth. Domina el uso de Claude Opus 4.5, Sonnet 4.5 y las variantes Thinking de Gemini 3 Pro/Flash."
tags:
  - "Plataforma"
  - "Modelo"
  - "Claude"
  - "Gemini"
  - "Thinking"
prerequisite:
  - "start-what-is-antigravity-auth"
  - "start-quick-install"
order: 1
---

# Conoce todos los modelos disponibles y sus configuraciones de variantes

## Qué aprenderás

- Seleccionar el modelo Claude o Gemini más adecuado para tus necesidades
- Comprender los diferentes niveles de modo Thinking (low/max o minimal/low/medium/high)
- Entender los dos grupos de cuota independientes: Antigravity y Gemini CLI
- Usar el parámetro `--variant` para ajustar dinámicamente el presupuesto de razonamiento

## Tu situación actual

Acabas de instalar el plugin y te enfrentas a una larga lista de nombres de modelos sin saber cuál elegir:
- ¿Cuál es la diferencia entre `antigravity-gemini-3-pro` y `gemini-3-pro-preview`?
- ¿Qué significa `--variant=max`? ¿Qué pasa si no lo especifico?
- ¿El modo thinking de Claude es igual que el de Gemini?

## Concepto clave

Antigravity Auth admite dos categorías principales de modelos, cada una con su propio grupo de cuota:

1. **Cuota Antigravity**: Acceso a través de Google Antigravity API, incluye Claude y Gemini 3
2. **Cuota Gemini CLI**: Acceso a través de Gemini CLI API, incluye Gemini 2.5 y Gemini 3 Preview

::: info Sistema Variant
El sistema variant de OpenCode te permite especificar la configuración en tiempo de ejecución mediante el parámetro `--variant`, en lugar de definir un modelo independiente para cada nivel de thinking. Esto hace que el selector de modelos sea más limpio y la configuración más flexible.
:::

## Modelos de cuota Antigravity

Estos modelos se acceden con el prefijo `antigravity-` y utilizan el grupo de cuota de Antigravity API.

### Serie Gemini 3

#### Gemini 3 Pro
| Nombre del modelo | Variants | Nivel de Thinking | Descripción |
|--- | --- | --- | ---|
| `antigravity-gemini-3-pro` | low, high | low, high | Equilibrio entre calidad y velocidad |

**Ejemplo de configuración Variant**:
```bash
# Nivel de thinking bajo (más rápido)
opencode run "respuesta rápida" --model=google/antigravity-gemini-3-pro --variant=low

# Nivel de thinking alto (más profundo)
opencode run "razonamiento complejo" --model=google/antigravity-gemini-3-pro --variant=high
```

#### Gemini 3 Flash
| Nombre del modelo | Variants | Nivel de Thinking | Descripción |
|--- | --- | --- | ---|
| `antigravity-gemini-3-flash` | minimal, low, medium, high | minimal, low, medium, high | Respuesta ultra-rápida, soporta 4 niveles de thinking |

**Ejemplo de configuración Variant**:
```bash
# Thinking mínimo (más rápido)
opencode run "tarea simple" --model=google/antigravity-gemini-3-flash --variant=minimal

# Thinking medio (predeterminado)
opencode run "tarea normal" --model=google/antigravity-gemini-3-flash --variant=medium

# Thinking máximo (más profundo)
opencode run "análisis complejo" --model=google/antigravity-gemini-3-flash --variant=high
```

::: warning Gemini 3 Pro no soporta minimal/medium
`gemini-3-pro` solo soporta los niveles `low` y `high`. Si intentas usar `--variant=minimal` o `--variant=medium`, la API devolverá un error.
:::

### Serie Claude

#### Claude Sonnet 4.5 (Sin Thinking)
| Nombre del modelo | Variants | Presupuesto de Thinking | Descripción |
|--- | --- | --- | ---|
| `antigravity-claude-sonnet-4-5` | — | — | Modo estándar, sin thinking extendido |

**Ejemplo de uso**:
```bash
# Modo estándar
opencode run "conversación diaria" --model=google/antigravity-claude-sonnet-4-5
```

#### Claude Sonnet 4.5 Thinking
| Nombre del modelo | Variants | Presupuesto de Thinking (tokens) | Descripción |
|--- | --- | --- | ---|
| `antigravity-claude-sonnet-4-5-thinking` | low, max | 8192 (low) / 32768 (max) | Modo equilibrado |

**Ejemplo de configuración Variant**:
```bash
# Thinking ligero (más rápido)
opencode run "razonamiento rápido" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=low

# Thinking máximo (más profundo)
opencode run "análisis profundo" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

#### Claude Opus 4.5 Thinking
| Nombre del modelo | Variants | Presupuesto de Thinking (tokens) | Descripción |
|--- | --- | --- | ---|
| `antigravity-claude-opus-4-5-thinking` | low, max | 8192 (low) / 32768 (max) | Capacidad de razonamiento más fuerte |

**Ejemplo de configuración Variant**:
```bash
# Thinking ligero
opencode run "respuesta de alta calidad" --model=google/antigravity-claude-opus-4-5-thinking --variant=low

# Thinking máximo (para tareas más complejas)
opencode run "análisis a nivel experto" --model=google/antigravity-claude-opus-4-5-thinking --variant=max
```

::: tip Diferencias entre modos thinking de Claude y Gemini
- **Claude** usa thinking budget en formato numérico (tokens), como 8192, 32768
- **Gemini 3** usa thinking level en formato string (minimal/low/medium/high)
- Ambos muestran el proceso de razonamiento antes de la respuesta, pero la forma de configuración es diferente
:::

## Modelos de cuota Gemini CLI

Estos modelos no tienen el prefijo `antigravity-` y utilizan el grupo de cuota independiente de Gemini CLI API. No soportan modo thinking.

| Nombre del modelo | Descripción |
|--- | ---|
| `gemini-2.5-flash` | Gemini 2.5 Flash (respuesta rápida) |
| `gemini-2.5-pro` | Gemini 2.5 Pro (equilibrio calidad-velocidad) |
| `gemini-3-flash-preview` | Gemini 3 Flash Preview (versión preview) |
| `gemini-3-pro-preview` | Gemini 3 Pro Preview (versión preview) |

**Ejemplo de uso**:
```bash
# Gemini 2.5 Pro (sin thinking)
opencode run "tarea rápida" --model=google/gemini-2.5-pro

# Gemini 3 Pro Preview (sin thinking)
opencode run "prueba de modelo preview" --model=google/gemini-3-pro-preview
```

::: info Modelos Preview
Los modelos `gemini-3-*-preview` son versiones preview oficiales de Google, pueden ser inestables o cambiar en cualquier momento. Si necesitas funcionalidad Thinking, utiliza los modelos `antigravity-gemini-3-*`.
:::

## Resumen comparativo de modelos

| Característica | Claude 4.5 | Gemini 3 | Gemini 2.5 |
|--- | --- | --- | ---|
| **Soporte Thinking** | ✅ (thinkingBudget) | ✅ (thinkingLevel) | ❌ |
| **Google Search** | ❌ | ✅ | ✅ |
| **Grupo de cuota** | Antigravity | Antigravity + Gemini CLI | Gemini CLI |
| **Escenario aplicable** | Razonamiento complejo, programación | Tareas generales + búsqueda | Respuesta rápida, tareas simples |

## 🎯 Cómo elegir el modelo

### ¿Claude o Gemini?

- **Elige Claude**: Necesitas mayor capacidad de razonamiento lógico, generación de código más estable
- **Elige Gemini 3**: Necesitas Google Search, velocidad de respuesta más rápida

### ¿Thinking o modo estándar?

- **Usa Thinking**: Razonamiento complejo, tareas de múltiples pasos, necesitas ver el proceso de razonamiento
- **Usa modo estándar**: Preguntas simples, respuesta rápida, no necesitas mostrar razonamiento

### ¿Qué nivel de Thinking?

| Nivel | Claude (tokens) | Gemini 3 | Escenario aplicable |
|--- | --- | --- | ---|
| **minimal** | — | Solo Flash | Tareas ultra-rápidas, como traducción, resumen |
| **low** | 8192 | Pro/Flash | Equilibrio calidad-velocidad, adecuado para la mayoría de tareas |
| **medium** | — | Solo Flash | Tareas de complejidad media |
| **high/max** | 32768 | Pro/Flash | Tareas más complejas, como diseño de sistemas, análisis profundo |

::: tip Configuración recomendada
- **Desarrollo diario**: `antigravity-claude-sonnet-4-5-thinking --variant=low`
- **Razonamiento complejo**: `antigravity-claude-opus-4-5-thinking --variant=max`
- **Respuesta rápida + búsqueda**: `antigravity-gemini-3-flash --variant=low` + Google Search habilitado
:::

## Configuración completa de ejemplo

Agrega la siguiente configuración a `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-antigravity-auth@latest"],
  "provider": {
    "google": {
      "models": {
        "antigravity-gemini-3-pro": {
          "name": "Gemini 3 Pro (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingLevel": "low" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-gemini-3-flash": {
          "name": "Gemini 3 Flash (Antigravity)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "minimal": { "thinkingLevel": "minimal" },
            "low": { "thinkingLevel": "low" },
            "medium": { "thinkingLevel": "medium" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "antigravity-claude-sonnet-4-5-thinking": {
          "name": "Claude Sonnet 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "antigravity-claude-opus-4-5-thinking": {
          "name": "Claude Opus 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "gemini-2.5-flash": {
          "name": "Gemini 2.5 Flash (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-2.5-pro": {
          "name": "Gemini 2.5 Pro (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-flash-preview": {
          "name": "Gemini 3 Flash Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-pro-preview": {
          "name": "Gemini 3 Pro Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: details Copiar configuración
Haz clic en el botón de copiar en la esquina superior derecha del bloque de código, luego pégalo en tu archivo `~/.config/opencode/opencode.json`.
:::

## Punto de control ✅

Completa los siguientes pasos para confirmar que has dominado la selección de modelos:

- [ ] Entiendes los dos grupos de cuota independientes: Antigravity y Gemini CLI
- [ ] Sabes que Claude usa thinkingBudget (tokens) y Gemini 3 usa thinkingLevel (cadena)
- [ ] Puedes elegir la variante apropiada según la complejidad de la tarea
- [ ] Has agregado la configuración completa a `opencode.json`

## Resumen de esta lección

Antigravity Auth ofrece una amplia selección de modelos y configuraciones de variantes flexibles:

- **Cuota Antigravity**: Admite Claude 4.5 y Gemini 3, con capacidad Thinking
- **Cuota Gemini CLI**: Admite Gemini 2.5 y Gemini 3 Preview, sin capacidad Thinking
- **Sistema Variant**: Ajusta dinámicamente el nivel de thinking mediante el parámetro `--variant`, sin necesidad de definir múltiples modelos

Al elegir un modelo, considera el tipo de tarea (razonamiento vs búsqueda), complejidad (simple vs compleja) y requisitos de velocidad de respuesta.

## Avance de la próxima lección

> En la próxima lección aprenderemos **[Modelos Thinking en detalle](../thinking-models/)**.
>
> Aprenderás:
> - El principio de los modos Thinking de Claude y Gemini
> - Cómo configurar presupuestos de thinking personalizados
> - Técnicas para conservar bloques de thinking (signature caching)

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Función | Ruta del archivo | Número de línea |
|--- | --- | ---|
| Análisis de modelo y extracción de tier | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 177-282 |
| Definición de presupuesto de thinking tier | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 14-19 |
| Definición de nivel de thinking de Gemini 3 | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 26 |
| Mapeo de alias de modelo | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 36-57 |
| Análisis de configuración Variant | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 374-422 |
| Definición de tipos | [`src/plugin/transform/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/types.ts) | 1-115 |

**Constantes clave**:
- `THINKING_TIER_BUDGETS`: Mapeo de presupuestos de thinking para Claude y Gemini 2.5 (low/medium/high → tokens)
- `GEMINI_3_THINKING_LEVELS`: Niveles de thinking soportados por Gemini 3 (minimal/low/medium/high)

**Funciones clave**:
- `resolveModelWithTier(requestedModel)`: Analiza nombre de modelo y configuración de thinking
- `resolveModelWithVariant(requestedModel, variantConfig)`: Analiza modelo desde configuración variant
- `budgetToGemini3Level(budget)`: Mapea presupuesto de tokens a nivel de Gemini 3

</details>
