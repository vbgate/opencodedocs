---
title: "Optimización de Rendimiento: Modelos y Contexto | Everything Claude Code"
sidebarTitle: "Secretos para 10x Más Rápido"
subtitle: "Optimización de Rendimiento: Mejora la Velocidad de Respuesta"
description: "Aprende estrategias de optimización de rendimiento en Everything Claude Code. Domina la selección de modelos, gestión de ventana de contexto, configuración MCP y compresión estratégica para mejorar velocidad y eficiencia de desarrollo."
tags:
  - "performance"
  - "optimization"
  - "token-usage"
prerequisite:
  - "../../start/quickstart/"
order: 180
---

# Optimización de Rendimiento: Mejora la Velocidad de Respuesta

## Qué Aprenderás

- Seleccionar el modelo adecuado según la complejidad de la tarea, equilibrando costo y rendimiento
- Gestionar eficazmente la ventana de contexto, evitando alcanzar límites
- Configurar servidores MCP razonablemente, maximizando el contexto disponible
- Usar compresión estratégica para mantener la coherencia lógica de las conversaciones

## Tu Situación Actual

¿Claude Code responde lento? ¿La ventana de contexto se llena rápidamente? ¿No sabes cuándo usar Haiku, Sonnet u Opus? Estos problemas afectan seriamente la eficiencia de desarrollo.

## Idea Central

El núcleo de la optimización de rendimiento es **usar la herramienta adecuada en el momento adecuado**. Seleccionar modelos, gestionar contexto, configurar MCP, todo implica un equilibrio: velocidad vs inteligencia, costo vs calidad.

::: info Concepto Clave

**La ventana de contexto** es la longitud del historial de conversación que Claude puede "recordar". Los modelos actuales soportan aproximadamente 200k tokens, pero se ven afectados por el número de servidores MCP, llamadas a herramientas, etc.

:::

## Problemas Comunes de Rendimiento

### Problema 1: Velocidad de Respuesta Lenta

**Síntomas**: Incluso tareas simples tardan mucho tiempo

**Posibles Causas**:
- Usar Opus para tareas simples
- Contexto demasiado largo, necesita procesar mucha información histórica
- Demasiados servidores MCP habilitados

**Soluciones**:
- Usar Haiku para tareas ligeras
- Comprimir contexto regularmente
- Reducir el número de MCPs habilitados

### Problema 2: La Ventana de Contexto se Llena Rápidamente

**Síntomas**: Después de desarrollar un rato, necesitas comprimir o reiniciar la sesión

**Posibles Causas**:
- Demasiados servidores MCP habilitados (cada MCP ocupa contexto)
- No comprimir el historial de conversación a tiempo
- Uso de cadenas complejas de llamadas a herramientas

**Soluciones**:
- Habilitar MCPs según necesidad, usar `disabledMcpServers` para deshabilitar los no usados
- Usar compresión estratégica, comprimir manualmente en límites de tareas
- Evitar lecturas y búsquedas de archivos innecesarias

### Problema 3: Consumo Rápido de Tokens

**Síntomas**: La cuota se consume rápidamente, costos altos

**Posibles Causas**:
- Siempre usar Opus para procesar tareas
- Leer repetidamente grandes cantidades de archivos
- No usar compresión razonablemente

**Soluciones**:
- Seleccionar modelo según complejidad de la tarea
- Usar `/compact` para comprimir proactivamente
- Usar hooks strategic-compact para recordatorios inteligentes

## Estrategia de Selección de Modelos

Seleccionar el modelo adecuado según la complejidad de la tarea puede mejorar significativamente el rendimiento y reducir costos.

### Haiku 4.5 (90% capacidad de Sonnet, 3x ahorro de costos)

**Escenarios de Uso**:
- Agents ligeros, llamadas frecuentes
- Programación en pareja y generación de código
- Worker agents en sistemas multi-agent

**Ejemplo**:
```markdown
Modificaciones simples de código, formateo, generación de comentarios
Usar Haiku
```

### Sonnet 4.5 (Mejor modelo de codificación)

**Escenarios de Uso**:
- Trabajo de desarrollo principal
- Coordinación de workflows multi-agent
- Tareas de codificación complejas

**Ejemplo**:
```markdown
Implementar nuevas funciones, refactorización, corregir bugs complejos
Usar Sonnet
```

### Opus 4.5 (Máxima capacidad de razonamiento)

**Escenarios de Uso**:
- Decisiones arquitectónicas complejas
- Tareas que requieren máxima profundidad de razonamiento
- Tareas de investigación y análisis

**Ejemplo**:
```markdown
Diseño de sistemas, auditoría de seguridad, resolución de problemas complejos
Usar Opus
```

::: tip Consejo de Selección de Modelo

En la configuración del agent, especifica mediante el campo `model`:
```markdown
---
name: my-agent
model: haiku  # o sonnet, opus
---
```

:::

## Gestión de Ventana de Contexto

Evitar usar demasiado la ventana de contexto afecta el rendimiento e incluso puede causar fallos en tareas.

### Evitar Tareas en el Último 20% de la Ventana de Contexto

Para estas tareas, se recomienda comprimir el contexto primero:
- Refactorización a gran escala
- Implementación de funciones en múltiples archivos
- Depuración de interacciones complejas

### Tareas con Baja Sensibilidad al Contexto

Estas tareas tienen bajos requisitos de contexto, pueden continuar cerca del límite:
- Edición de archivo único
- Creación de herramientas independientes
- Actualización de documentación
- Corrección de bugs simples

::: warning Recordatorio Importante

La ventana de contexto se ve afectada por los siguientes factores:
- Número de servidores MCP habilitados
- Número de llamadas a herramientas
- Longitud del historial de conversación
- Operaciones de archivos en la sesión actual

:::

## Optimización de Configuración MCP

Los servidores MCP son una forma importante de extender las capacidades de Claude Code, pero cada MCP ocupa contexto.

### Principios Básicos

Según las recomendaciones del README:

```json
{
  "mcpServers": {
    "mcp-server-1": { ... },
    "mcp-server-2": { ... }
    // ... más configuración
  },
  "disabledMcpServers": [
    "mcp-server-3",
    "mcp-server-4"
    // Deshabilitar MCPs no usados
  ]
}
```

**Mejores Prácticas**:
- Puedes configurar 20-30 servidores MCP
- Habilitar no más de 10 por proyecto
- Mantener el número de herramientas activas por debajo de 80

### Habilitar MCPs Según Necesidad

Seleccionar MCPs relevantes según el tipo de proyecto:

| Tipo de Proyecto | Recomendado Habilitar | Opcional |
| --- | --- | --- |
| Proyecto Frontend | Vercel, Magic | Filesystem, GitHub |
| Proyecto Backend | Supabase, ClickHouse | GitHub, Railway |
| Proyecto Full-Stack | Todos | - |
| Biblioteca de Herramientas | GitHub | Filesystem |

::: tip Cómo Cambiar MCPs

En la configuración del proyecto (`~/.claude/settings.json`) usa `disabledMcpServers`:
```json
{
  "disabledMcpServers": ["cloudflare-observability", "clickhouse-io"]
}
```

:::

## Compresión Estratégica

La compresión automática puede activarse en cualquier momento, posiblemente interrumpiendo la lógica de la tarea. La compresión estratégica se ejecuta manualmente en límites de tareas, manteniendo la coherencia lógica.

### Por Qué Necesitas Compresión Estratégica

**Problemas de la Compresión Automática**:
- A menudo se activa en medio de tareas, perdiendo contexto importante
- No entiende los límites lógicos de las tareas
- Puede interrumpir operaciones complejas de múltiples pasos

**Ventajas de la Compresión Estratégica**:
- Comprimir en límites de tareas, preservando información clave
- Lógica más clara
- Evitar interrumpir flujos importantes

### Mejores Momentos para Comprimir

1. **Después de Exploración, Antes de Ejecución** - Comprimir contexto de investigación, preservar plan de implementación
2. **Después de Completar un Hito** - Reiniciar para la siguiente fase
3. **Antes de Cambiar de Tarea** - Limpiar contexto de exploración, preparar nueva tarea

### Hook Strategic Compact

Este plugin incluye el skill `strategic-compact`, que te recuerda automáticamente cuándo debes comprimir.

**Cómo Funciona el Hook**:
- Rastrea el número de llamadas a herramientas
- Recuerda al alcanzar el umbral (por defecto 50 llamadas)
- Después recuerda cada 25 llamadas

**Configurar Umbral**:
```bash
# Establecer variable de entorno
export COMPACT_THRESHOLD=40
```

**Configuración del Hook** (ya incluida en `hooks/hooks.json`):
```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
  }]
}
```

### Consejos de Uso

1. **Comprimir Después de Planificar** - Una vez determinado el plan, comprimir y reiniciar
2. **Comprimir Después de Depurar** - Limpiar contexto de resolución de errores, continuar con el siguiente paso
3. **No Comprimir Durante Implementación** - Preservar contexto de cambios relevantes
4. **Prestar Atención a Recordatorios** - El hook te dice "cuándo", tú decides "si comprimir"

::: tip Ver Estado Actual

Usa el comando `/checkpoint` para guardar el estado actual, luego comprimir la sesión.

:::

## Lista de Verificación de Rendimiento

En el uso diario, verifica regularmente los siguientes elementos:

### Uso de Modelos
- [ ] Usar Haiku en lugar de Sonnet/Opus para tareas simples
- [ ] Usar Opus en lugar de Sonnet para razonamiento complejo
- [ ] Especificar modelo adecuado en configuración del agent

### Gestión de Contexto
- [ ] No más de 10 MCPs habilitados
- [ ] Usar `/compact` regularmente para comprimir
- [ ] Comprimir en límites de tareas, no en medio de tareas

### Configuración MCP
- [ ] Proyecto solo habilita MCPs necesarios
- [ ] Usar `disabledMcpServers` para gestionar MCPs no usados
- [ ] Verificar regularmente el número de herramientas activas (recomendado < 80)

## Preguntas Frecuentes

### P: ¿Cuándo usar Haiku, Sonnet u Opus?

**R**: Según la complejidad de la tarea:
- **Haiku**: Tareas ligeras, llamadas frecuentes (como formateo de código, generación de comentarios)
- **Sonnet**: Trabajo de desarrollo principal, coordinación de agents (como implementación de funciones, refactorización)
- **Opus**: Razonamiento complejo, decisiones arquitectónicas (como diseño de sistemas, auditoría de seguridad)

### P: ¿Qué hacer cuando la ventana de contexto está llena?

**R**: Usa inmediatamente `/compact` para comprimir la sesión. Si has habilitado el hook strategic-compact, te recordará en el momento adecuado. Antes de comprimir puedes usar `/checkpoint` para guardar el estado importante.

### P: ¿Cómo saber cuántos MCPs están habilitados?

**R**: Verifica la configuración de `mcpServers` y `disabledMcpServers` en `~/.claude/settings.json`. Número de MCPs activos = total - número en `disabledMcpServers`.

### P: ¿Por qué mis respuestas son especialmente lentas?

**R**: Verifica los siguientes puntos:
1. ¿Estás usando Opus para tareas simples?
2. ¿La ventana de contexto está casi llena?
3. ¿Demasiados servidores MCP habilitados?
4. ¿Estás ejecutando operaciones de archivos a gran escala?

## Resumen de la Lección

El núcleo de la optimización de rendimiento es "usar la herramienta adecuada en el momento adecuado":

- **Selección de Modelo**: Elegir Haiku/Sonnet/Opus según complejidad de la tarea
- **Gestión de Contexto**: Evitar el último 20% de la ventana, comprimir a tiempo
- **Configuración MCP**: Habilitar según necesidad, no más de 10
- **Compresión Estratégica**: Comprimir manualmente en límites de tareas, mantener coherencia lógica

## Cursos Relacionados

- [Estrategias de Optimización de Tokens](../../advanced/token-optimization/) - Aprende en profundidad la gestión de ventana de contexto
- [Automatización con Hooks](../../advanced/hooks-automation/) - Conoce la configuración del hook strategic-compact
- [Configuración de Servidores MCP](../../start/mcp-setup/) - Aprende a configurar servidores MCP

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Actualizado: 2026-01-25

| Funcionalidad | Ruta del Archivo | Línea |
| --- | --- | --- |
| Reglas de Optimización de Rendimiento | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Skill de Compresión Estratégica | [`skills/strategic-compact/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/strategic-compact/SKILL.md) | 1-64 |
| Configuración de Hooks | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Hook Strategic Compact | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json#L46-L54) | 46-54 |
| Script Suggest Compact | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | - |
| Ejemplo de Configuración MCP | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | - |

**Reglas Clave**:
- **Selección de Modelo**: Haiku (tareas ligeras), Sonnet (desarrollo principal), Opus (razonamiento complejo)
- **Ventana de Contexto**: Evitar usar el último 20%, comprimir a tiempo
- **Configuración MCP**: Habilitar no más de 10 por proyecto, herramientas activas < 80
- **Compresión Estratégica**: Comprimir manualmente en límites de tareas, evitar interrupciones de compresión automática

**Variables de Entorno Clave**:
- `COMPACT_THRESHOLD`: Umbral de número de llamadas a herramientas (por defecto: 50)

</details>
