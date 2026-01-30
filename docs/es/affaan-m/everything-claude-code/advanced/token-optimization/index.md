---
title: "Optimización de Tokens: Ventana de Contexto | Everything Claude Code"
sidebarTitle: "¿Qué hacer cuando se satura la ventana de contexto"
subtitle: "Optimización de Tokens: Ventana de Contexto"
description: "Aprende estrategias de optimización de Tokens de Claude Code. Domina la selección de modelos, compresión estratégica y configuración de MCP para maximizar la eficiencia de la ventana de contexto y mejorar la calidad de respuesta."
tags:
  - "token-optimization"
  - "context-management"
  - "performance"
prerequisite:
  - "start-quick-start"
order: 110
---

# Estrategias de Optimización de Tokens: Gestión de Ventana de Contexto

## Qué Aprenderás

- Seleccionar el modelo adecuado según el tipo de tarea, equilibrando costo y rendimiento
- Usar compresión estratégica para conservar el contexto clave en límites lógicos
- Configurar servidores MCP de manera razonable, evitando el consumo excesivo de la ventana de contexto
- Evitar la saturación de la ventana de contexto, manteniendo la calidad de respuesta

## Tu Situación Actual

¿Te has encontrado con estos problemas?

- A mitad de la conversación, el contexto se comprime repentinamente y se pierde información clave
- Habilitaste demasiados servidores MCP y la ventana de contexto bajó de 200k a 70k
- Durante una refactorización grande, el modelo "olvida" discusiones previas
- No sabes cuándo comprimir y cuándo no

## Cuándo Usar Esta Estrategia

- **Al manejar tareas complejas** - Seleccionar el modelo y estrategia de gestión de contexto adecuados
- **Cuando la ventana de contexto se aproxima a la saturación** - Usar compresión estratégica para conservar información clave
- **Al configurar servidores MCP** - Equilibrar la cantidad de herramientas y la capacidad de contexto
- **En sesiones prolongadas** - Comprimir en límites lógicos para evitar que la compresión automática pierda información

## Idea Central

El núcleo de la optimización de tokens no es "reducir el uso", sino **conservar información valiosa en momentos clave**.

### Tres Pilares de Optimización

1. **Estrategia de Selección de Modelos** - Usar diferentes modelos para diferentes tareas, evitando "usar una cañonera para matar un mosquito"
2. **Compresión Estratégica** - Comprimir en límites lógicos, no en momentos arbitrarios
3. **Gestión de Configuración de MCP** - Controlar la cantidad de herramientas habilitadas, protegiendo la ventana de contexto

### Conceptos Clave

::: info ¿Qué es la ventana de contexto?

La ventana de contexto es la longitud del historial de conversación que Claude Code puede "recordar". Los modelos actuales soportan aproximadamente 200k tokens, pero se ven afectados por los siguientes factores:

- **Servidores MCP habilitados** - Cada MCP consume espacio en el sistema de prompts
- **Skills cargados** - Las definiciones de habilidades ocupan contexto
- **Historial de conversaciones** - El registro de tu conversación con Claude

Cuando el contexto se aproxima a la saturación, Claude comprime automáticamente el historial, posiblemente perdiendo información clave.
:::

::: tip ¿Por qué la compresión manual es mejor?

La compresión automática de Claude se activa en momentos arbitrarios, a menudo interrumpiendo el flujo en medio de una tarea. La compresión estratégica te permite comprimir activamente en **límites lógicos** (como después de completar la planificación, antes de cambiar de tarea), conservando el contexto importante.
:::

## Sígueme

### Paso 1: Seleccionar el Modelo Adecuado

Selecciona el modelo según la complejidad de la tarea para evitar desperdiciar costo y contexto.

**Por qué**

Los modelos diferentes tienen grandes diferencias en capacidad de razonamiento y costo, y una selección razonable puede ahorrar muchos Tokens.

**Guía de Selección de Modelos**

| Modelo | Escenarios de Uso | Costo | Capacidad de Razonamiento |
|--- | --- | --- | ---|
| **Haiku 4.5** | Agents ligeros, llamadas frecuentes, generación de código | Bajo (1/3 de Sonnet) | 90% de la capacidad de Sonnet |
| **Sonnet 4.5** | Trabajo de desarrollo principal, tareas de codificación complejas, orquestación | Medio | Mejor modelo para codificación |
| **Opus 4.5** | Decisiones de arquitectura, razonamiento profundo, investigación y análisis | Alto | Mayor capacidad de razonamiento |

**Método de Configuración**

En el archivo del agente en el directorio `agents/`:

```markdown
---
name: planner
description: Planifica los pasos de implementación para funciones complejas
model: opus
---

Eres un planificador avanzado...
```

**Deberías ver**:
- Tareas de razonamiento alto (como diseño de arquitectura) usan Opus para mayor calidad
- Tareas de codificación usan Sonnet para la mejor relación calidad-precio
- Agents worker llamados frecuentemente usan Haiku para ahorrar costos

### Paso 2: Habilitar Hook de Compresión Estratégica

Configura el Hook para recordarte comprimir el contexto en límites lógicos.

**Por qué**

La compresión automática se activa en momentos arbitrarios, posiblemente perdiendo información clave. La compresión estratégica te permite decidir el momento de compresión.

**Pasos de Configuración**

Asegúrate de que `hooks/hooks.json` tenga configuraciones PreToolUse y PreCompact:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Edit\" || tool == \"Write\"",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
          }
        ],
        "description": "Suggest manual compaction at logical intervals"
      }
    ],
    "PreCompact": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
          }
        ],
        "description": "Save state before context compaction"
      }
    ]
  }
}
```

**Personalizar Umbral**

Establece la variable de entorno `COMPACT_THRESHOLD` para controlar la frecuencia de sugerencias (por defecto 50 llamadas a herramientas):

```json
// Agregar en ~/.claude/settings.json
{
  "env": {
    "COMPACT_THRESHOLD": "50"  // Primera sugerencia después de 50 llamadas a herramientas
  }
}
```

**Deberías ver**:
- Después de cada edición o escritura de archivo, el Hook cuenta las llamadas a herramientas
- Al alcanzar el umbral (por defecto 50), verás un aviso:
  ```
  [StrategicCompact] 50 tool calls reached - consider /compact if transitioning phases
  ```
- Después, cada 25 llamadas a herramientas, verás un aviso:
  ```
  [StrategicCompact] 75 tool calls - good checkpoint for /compact if context is stale
  ```

### Paso 3: Comprimir en Límites Lógicos

Basándote en los avisos del Hook, comprime manualmente en el momento adecuado.

**Por qué**

Comprimir después de cambiar de tarea o completar un hito puede conservar el contexto clave y limpiar información redundante.

**Guía de Momentos de Compresión**

✅ **Momentos recomendados para comprimir**:
- Después de completar la planificación, antes de comenzar la implementación
- Después de completar un hito de función, antes de comenzar el siguiente
- Después de completar la depuración, antes de continuar el desarrollo
- Al cambiar a un tipo de tarea diferente

❌ **Momentos para evitar la compresión**:
- Durante la implementación de una función
- En medio de depuración de problemas
- Durante modificaciones de múltiples archivos relacionados

**Pasos de Operación**

Cuando veas un aviso del Hook:

1. Evalúa la fase actual de la tarea
2. Si es adecuado para comprimir, ejecuta:
    ```bash
    /compact
    ```
3. Espera a que Claude resuma el contexto
4. Verifica que la información clave se haya conservado

**Deberías ver**:
- Después de la compresión, la ventana de contexto libera mucho espacio
- La información clave (como el plan de implementación, funciones completadas) se conserva
- Las nuevas interacciones comienzan desde un contexto simplificado

### Paso 4: Optimizar la Configuración de MCP

Controla la cantidad de servidores MCP habilitados para proteger la ventana de contexto.

**Por qué**

Cada servidor MCP consume espacio en el sistema de prompts. Habilitar demasiados comprime significativamente la ventana de contexto.

**Principios de Configuración**

Basado en la experiencia del README:

```json
{
  "mcpServers": {
    // Puedes configurar 20-30 MCP...
    "github": { ... },
    "supabase": { ... },
    // ...más configuraciones
  },
  "disabledMcpServers": [
    "firecrawl",       // Deshabilitar MCP no usados frecuentemente
    "clickhouse",
    // ...deshabilitar según las necesidades del proyecto
  ]
}
```

**Mejores Prácticas**:

- **Configurar todos los MCP** (20-30), cambiar flexiblemente en proyectos
- **Habilitar < 10 MCP**, mantener herramientas activas < 80
- **Seleccionar según el proyecto**: al desarrollar el backend habilitar relacionados con bases de datos, al desarrollar el frontend habilitar relacionados con compilación

**Método de Verificación**

Verificar la cantidad de herramientas:

```bash
// Claude Code mostrará las herramientas habilitadas actualmente
/tool list
```

**Deberías ver**:
- Total de herramientas < 80
- La ventana de contexto se mantiene en 180k+ (evitar caer por debajo de 70k)
- Ajustar dinámicamente la lista habilitada según las necesidades del proyecto

### Paso 5: Usar con Memory Persistence

Usa Hooks para que el estado clave se conserve después de la compresión.

**Por qué**

La compresión estratégica pierde contexto, pero el estado clave (como el plan de implementación, checkpoint) necesita conservarse.

**Configurar Hooks**

Asegúrate de que los siguientes Hooks estén habilitados:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
          }
        ],
        "description": "Load previous context and detect package manager on new session"
      }
    ],
    "SessionEnd": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
          }
        ],
        "description": "Persist session state on end"
      }
    ]
  }
}
```

**Flujo de Trabajo**:

1. Después de completar una tarea, usa `/checkpoint` para guardar el estado
2. Antes de comprimir el contexto, el Hook PreCompact guarda automáticamente
3. Al comenzar una nueva sesión, el Hook SessionStart carga automáticamente
4. La información clave (plan, estado) se mantiene, no afectada por la compresión

**Deberías ver**:
- Después de la compresión, el estado importante sigue disponible
- Nuevas sesiones restauran automáticamente el contexto previo
- Las decisiones clave y los planes de implementación no se pierden

## Punto de Verificación ✅

- [ ] Hook `strategic-compact` configurado
- [ ] Modelo adecuado seleccionado según la tarea (Haiku/Sonnet/Opus)
- [ ] MCP habilitados < 10, total de herramientas < 80
- [ ] Comprimir en límites lógicos (plan completado/hitos)
- [ ] Hooks de Memory Persistence habilitados, estado clave conservado

## Advertencias Comunes

### ❌ Error Común 1: Usar Opus para Todo

**Problema**: Aunque Opus es el más potente, su costo es 10 veces mayor que Sonnet y 30 veces mayor que Haiku.

**Corrección**: Seleccionar el modelo según el tipo de tarea:
- Agents llamados frecuentemente (como revisión de código, formateo) usar Haiku
- Trabajo de desarrollo principal usar Sonnet
- Decisiones de arquitectura, razonamiento profundo usar Opus

### ❌ Error Común 2: Ignorar Avisos de Compresión del Hook

**Problema**: Continuar trabajando después de ver el aviso `[StrategicCompact]`, el contexto finalmente se comprime automáticamente perdiendo información clave.

**Corrección**: Evaluar la fase de la tarea y responder al aviso ejecutando `/compact` en el momento adecuado.

### ❌ Error Común 3: Habilitar Todos los Servidores MCP

**Problema**: Configurado 20+ MCP y todos habilitados, la ventana de contexto bajó de 200k a 70k.

**Corrección**: Usar `disabledMcpServers` para deshabilitar MCP no usados frecuentemente, mantener < 10 MCP activos.

### ❌ Error Común 4: Comprimir Durante la Implementación

**Problema**: Comprimir el contexto mientras se implementa una función, el modelo "olvida" discusiones previas.

**Corrección**: Solo comprimir en límites lógicos (plan completado, cambio de tarea, hito completado).

## Resumen de la Lección

El núcleo de la optimización de tokens es **conservar información valiosa en momentos clave**:

1. **Selección de Modelos** - Haiku/Sonnet/Opus cada uno tiene escenarios aplicables, la selección razonable ahorra costos
2. **Compresión Estratégica** - Comprimir manualmente en límites lógicos, evitar que la compresión automática pierda información
3. **Gestión de MCP** - Controlar la cantidad habilitada, proteger la ventana de contexto
4. **Memory Persistence** - Hacer que el estado clave siga disponible después de la compresión

Siguiendo estas estrategias, puedes maximizar la eficiencia del contexto de Claude Code y evitar la disminución de calidad causada por la saturación del contexto.

## Próxima Lección

> En la próxima lección aprenderemos **[Bucle de Verificación: Checkpoint y Evals](../verification-loop/)**.
>
> Aprenderás:
> - Cómo usar Checkpoint para guardar y restaurar el estado de trabajo
> - Método Eval Harness para verificación continua
> - Tipos de Grader y métricas Pass@K
> - Aplicación del bucle de verificación en TDD

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Actualizado: 2026-01-25

| Funcionalidad              | Ruta del Archivo                                                                                      | Línea  |
|--- | --- | ---|
| Skill de Compresión Estratégica  | [`skills/strategic-compact/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/strategic-compact/SKILL.md) | 1-64    |
| Hook de Sugerencia de Compresión     | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61    |
| Hook de Guardado Pre-Compresión   | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49    |
| Reglas de Optimización de Rendimiento      | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48    |
| Configuración de Hooks        | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158   |
| Descripción de Ventana de Contexto    | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 349-359 |

**Constantes Clave**:
- `COMPACT_THRESHOLD = 50`: Umbral de llamadas a herramientas (valor por defecto)
- `MCP_LIMIT = 10`: Límite superior recomendado de MCP habilitados
- `TOOL_LIMIT = 80`: Límite superior recomendado de total de herramientas

**Funciones Clave**:
- `suggest-compact.js:main()`: Cuenta las llamadas a herramientas y sugiere compresión
- `pre-compact.js:main()`: Guarda el estado de la sesión antes de la compresión

</details>
