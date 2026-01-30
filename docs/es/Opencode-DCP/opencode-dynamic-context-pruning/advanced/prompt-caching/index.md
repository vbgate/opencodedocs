---
title: "Impacto del Cache: Balance de Hit Rate y Ahorro | opencode-dcp"
subtitle: "Prompt Caching: Cómo DCP Balancea el Hit Rate del Cache y el Ahorro de Tokens"
sidebarTitle: "¿Bajó el cache? ¿Estás perdiendo?"
description: "Comprende cómo DCP afecta el hit rate del cache y el ahorro de tokens en Prompt Caching. Domina las mejores prácticas de Anthropic, OpenAI y otros proveedores, ajustando estrategias dinámicamente según el modelo de facturación."
tags:
  - "advanced"
  - "prompt-caching"
  - "token-optimization"
  - "cost-optimization"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
  - "platforms-llm-tools"
order: "3"
---

# Impacto del Cache de Prompt: Balance entre Hit Rate y Ahorro de Tokens

## Lo que aprenderás

- Comprender cómo funciona el mecanismo de Prompt Caching de los proveedores de LLM
- Saber por qué el修剪de DCP afecta el hit rate del cache
- Aprender a balancear la pérdida de cache con el ahorro de tokens
- Desarrollar estrategias óptimas según el proveedor y modelo de facturación utilizado

## Tu dilema actual

Después de habilitar DCP, notaste que el hit rate del cache disminuyó del 85% al 65%, y te preocupa si esto podría aumentar los costos. O quizás quieres saber si usar DCP tendría diferentes impactos según el proveedor de LLM (Anthropic, OpenAI, GitHub Copilot).

El修剪de DCP modifica el contenido de los mensajes, lo cual afecta el Prompt Caching. ¿Pero vale la pena este balance? Analicémoslo en profundidad.

## Cuándo usar esta técnica

- En sesiones largas donde la expansión del contexto se vuelve significativa
- Con proveedores que facturan por solicitud (como GitHub Copilot, Google Antigravity)
- Cuando deseas reducir la contaminación del contexto y mejorar la calidad de las respuestas del modelo
- Cuando el valor del ahorro de tokens supera la pérdida del hit rate del cache

## Idea central

**Qué es Prompt Caching**

**Prompt Caching** es una tecnología ofrecida por proveedores de LLM (como Anthropic, OpenAI) para optimizar el rendimiento y los costos. Se basa en **coincidencia de prefijo exacta** para cachear prompts ya procesados, donde el mismo prefijo de prompt no recalcula tokens.

::: info Ejemplo del mecanismo de cache

Supongamos que tienes el siguiente historial de conversación:

```
[Prompt del sistema]
[Mensaje del usuario 1]
[Respuesta de IA 1 + Llamada a herramienta A]
[Mensaje del usuario 2]
[Respuesta de IA 2 + Llamada a herramienta A]  ← Misma llamada a herramienta
[Mensaje del usuario 3]
```

Sin cache, cada envío al LLM requiere recalcular todos los tokens. Con cache, en el segundo envío, el proveedor puede reutilizar resultados previos, solo necesita calcular la nueva parte de "mensaje del usuario 3".

:::

**Cómo DCP afecta el cache**

Cuando DCP修剪la salida de una herramienta, reemplaza el contenido original de la salida con un texto de marcador de posición: `"[Output removed to save context - information superseded or no longer needed]"`

Esta operación cambia el contenido exacto del mensaje (antes era la salida completa de la herramienta, ahora es un marcador de posición), causando **invalidez del cache** — el prefijo del cache desde ese punto ya no puede ser reutilizado.

**Análisis de balance**

| Indicador | Sin DCP | Con DCP habilitado | Impacto |
| --- | --- | --- | --- |
| **Hit rate del cache** | ~85% | ~65% | ⬇️ Disminuye 20% |
| **Tamaño del contexto** | Crece constantemente | Podado controlado | ⬇️ Disminuye significativamente |
| **Ahorro de tokens** | 0 | 10-40% | ⬆️ Aumenta significativamente |
| **Calidad de respuesta** | Puede empeorar | Más estable | ⬆️ Mejora (menos contaminación del contexto) |

::: tip ¿Por qué el hit rate del cache baja pero el costo podría ser menor?

La disminución del hit rate del cache no equivale a un aumento de costos. Reason:

1. **El ahorro de tokens suele superar la pérdida de cache**: En sesiones largas, la cantidad de tokens ahorrados por el修剪de DCP (10-40%) suele exceder el cálculo adicional de tokens por la invalidez del cache
2. **Menos contaminación del contexto**: Al eliminar contenido redundante, el modelo puede enfocarse mejor en la tarea actual, con respuestas de mayor calidad
3. **El hit rate absoluto sigue siendo alto**: Incluso al 65%, casi 2/3 del contenido puede ser cacheado

Los datos de pruebas muestran que en la mayoría de casos el efecto de ahorro de tokens de DCP es más pronunciado.

:::

## Impacto en diferentes modelos de facturación

### Facturación por solicitud (GitHub Copilot, Google Antigravity)

**Caso de uso óptimo**, sin efectos negativos.

Estos proveedores facturan por número de solicitudes, no por cantidad de tokens. Por lo tanto:

- ✅ Los tokens ahorrados por el修剪de DCP no afectan directamente el costo
- ✅ Reducir el tamaño del contexto mejora la velocidad de respuesta
- ✅ La invalidez del cache no añade costos adicionales

::: info GitHub Copilot y Google Antigravity

Estas dos plataformas facturan por solicitud, DCP es una **optimización de costo cero** — incluso si el hit rate del cache disminuye, no increase costos, sino que mejora el rendimiento.

:::

### Facturación por tokens (Anthropic, OpenAI)

Requiere balancear la pérdida de cache con el ahorro de tokens.

**Ejemplo de cálculo**:

Supongamos una sesión larga con 100 mensajes y un total de 100K tokens:

| Escenario | Hit rate del cache | Tokens ahorrados por cache | Tokens ahorrados por修剪de DCP | Ahorro total |
| --- | --- | --- | --- | --- |
| Sin DCP | 85% | 85K × (1-0.85) = 12.75K | 0 | 12.75K |
| Con DCP habilitado | 65% | 100K × (1-0.65) = 35K | 20K (estimado) | 35K + 20K - 12.75K = **42.25K** |

Después del修剪de DCP, aunque el hit rate del cache disminuye, el contexto se redujo en 20K tokens, por lo que el ahorro total real es mayor.

::: warning Mayor ventaja en sesiones largas

En sesiones largas, las ventajas de DCP son más pronunciadas:

- **Sesiones cortas** (< 10 mensajes): La invalidez del cache puede predominar, beneficio limitado
- **Sesiones largas** (> 30 mensajes): La expansión del contexto es severa, los tokens ahorrados por el修剪de DCP superan ampliamente la pérdida del cache

Sugerencia: Priorizar habilitar DCP en sesiones largas, puede desactivarse en sesiones cortas.

:::

## Observación y verificación

### Paso 1: Observar el uso de tokens del cache

**Por qué**
Conocer la proporción de tokens del cache en el total de tokens, evaluando la importancia del cache

```bash
# En OpenCode
/dcp context
```

**Deberías ver**: Un análisis de tokens similar a esto

```
╭───────────────────────────────────────────────────────────╮
│                  DCP Context Analysis                     │
╰───────────────────────────────────────────────────────────╯

Session Context Breakdown:
──────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

──────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

**Interpretación de indicadores clave**:

| Indicador | Significado | Cómo evaluar |
| --- | --- | --- |
| **Pruned** | Número de herramientas podadas y cantidad de tokens | Mientras mayor, más ahorro de DCP |
| **Current context** | Total de tokens del contexto de la sesión actual | Debe ser significativamente menor que Without DCP |
| **Without DCP** | Qué tan grande sería el contexto sin habilitar DCP | Para comparar el efecto de ahorro |

### Paso 2: Comparar habilitar/deshabilitar DCP

**Por qué**
A través de la comparación, percibir intuitivamente las diferencias de cache y ahorro de tokens

```bash
# 1. Deshabilitar DCP (establecer enabled: false en la configuración)
# O temporalmente cerrar:
/dcp sweep 999  # Podar todas las herramientas, observar efecto de cache

# 2. Tener algunas conversaciones

# 3. Ver estadísticas
/dcp stats

# 4. Rehabilitar DCP
# (modificar configuración o restaurar valores por defecto)

# 5. Continuar conversación, comparar estadísticas
/dcp stats
```

**Deberías ver**:

Usando `/dcp context` para observar cambios en indicadores clave:

| Indicador | DCP deshabilitado | DCP habilitado | Explicación |
| --- | --- | --- | --- |
| **Pruned** | 0 tools | 5-20 tools | Número de herramientas podadas por DCP |
| **Current context** | Grande | Pequeño | Contexto significativamente reducido después de DCP |
| **Without DCP** | Igual a Current | Mayor que Current | Muestra el potencial de ahorro de DCP |

::: tip Sugerencias de pruebas reales

Probar en diferentes tipos de sesiones:

1. **Sesiones cortas** (5-10 mensajes): Observar si el cache es más importante
2. **Sesiones largas** (30+ mensajes): Observar si el ahorro de DCP es más pronunciado
3. **Lecturas repetidas**: Escenarios de lectura frecuente de archivos idénticos

Esto te ayudará a tomar la mejor decisión según tus hábitos de uso reales.

:::

### Paso 3: Comprender el impacto de la contaminación del contexto

**Por qué**
El修剪de DCP no solo ahorra tokens, sino que también reduce la contaminación del contexto, mejorando la calidad de las respuestas

::: info ¿Qué es la contaminación del contexto?

**Contaminación del contexto** es cuando información redundante, irrelevante o desactualizada satura el historial de conversación, causando:

- Atención dispersa del modelo, difícil enfocarse en la tarea actual
- Posible引用de datos antiguos (como contenido de archivos ya modificados)
- Calidad de respuesta disminuida, requiriendo más tokens para "entender" el contexto

DCP reduce esta contaminación al eliminar salidas de herramientas completadas, operaciones de lectura repetidas, etc.

:::

**Comparación de efectos reales**:

| Escenario | Sin DCP | Con DCP habilitado |
| --- | --- | --- |
| Leer el mismo archivo 3 veces | Conserva 3 salidas completas (redundante) | Solo conserva la más reciente |
| Escribir archivo y volver a leer | Operación antigua de escritura + nueva lectura | Solo conserva la nueva lectura |
| Salida de error de herramienta | Conserva la entrada completa de error | Solo conserva el mensaje de error |

Después de reducir la contaminación del contexto, el modelo puede entender el estado actual con mayor precisión, reduciendo situaciones de "alucinaciones" o引用de datos desactualizados.

## Sugerencias de mejores prácticas

### Elegir estrategia según el proveedor

| Proveedor | Modelo de facturación | Sugerencia | Reason |
| --- | --- | --- | --- |
| **GitHub Copilot** | Por solicitud | ✅ Siempre habilitar | Optimización de costo cero, solo mejora rendimiento |
| **Google Antigravity** | Por solicitud | ✅ Siempre habilitar | Igual que arriba |
| **Anthropic** | Por tokens | ✅ Habilitar en sesiones largas<br>⚠️ Opcional en sesiones cortas | Balancear cache y ahorro |
| **OpenAI** | Por tokens | ✅ Habilitar en sesiones largas<br>⚠️ Opcional en sesiones cortas | Igual que arriba |

### Ajustar configuración según tipo de sesión

```jsonc
// ~/.config/opencode/dcp.jsonc o configuración del proyecto

{
  // Sesiones largas (> 30 mensajes): habilitar todas las estrategias
  "strategies": {
    "deduplication": { "enabled": true },
    "supersedeWrites": { "enabled": true },  // Recomendado habilitar
    "purgeErrors": { "enabled": true }
  },

  // Sesiones cortas (< 10 mensajes): solo habilitar deduplicación
  "strategies": {
    "deduplication": { "enabled": true },
    "supersedeWrites": { "enabled": false },
    "purgeErrors": { "enabled": false }
  }
}
```

**Explicación de estrategias**:

- **deduplication（deduplicación）**: Poco impacto, recomendado siempre habilitar
- **supersedeWrites（sobrescritura）**: Impacto moderado, recomendado para sesiones largas
- **purgeErrors（limpiar errores）**: Poco impacto, recomendado habilitar

### Ajustar estrategias dinámicamente

Usar `/dcp context` para observar la composición de tokens y efecto de podado:

```bash
# Si el valor de Pruned es alto, significa que DCP está ahorrando tokens activamente
# Puedes comparar Current context y Without DCP para evaluar el efecto de ahorro

/dcp context
```

## Punto de verificación ✅

Confirma que comprendiste los siguientes puntos:

- [ ] Prompt Caching se basa en coincidencia de prefijo exacta, cambios en el contenido del mensaje invalidan el cache
- [ ] El修剪de DCP cambia el contenido del mensaje, causando disminución del hit rate del cache (~20%)
- [ ] En sesiones largas, el ahorro de tokens suele superar la pérdida del cache
- [ ] GitHub Copilot y Google Antigravity facturan por solicitud, DCP es optimización de costo cero
- [ ] Anthropic y OpenAI facturan por tokens, requieren balancear cache y ahorro
- [ ] Usar `/dcp context` para observar composición de tokens y efecto de podado
- [ ] Ajustar dinámicamente la configuración de estrategias según la longitud de la sesión

## Avisos de errores comunes

### ❌ Pensar que la disminución del hit rate del cache equivale a aumento de costos

**Problema**: Ver el hit rate del cache disminuir del 85% al 65% y pensar que los costos aumentarán

**Reason**: Solo se enfocó en el hit rate del cache, ignorando el efecto de ahorro de tokens y reducción del contexto

**Solución**: Usar `/dcp context` para ver datos reales, enfocándose en:
1. Tokens ahorrados por el修剪de DCP (`Pruned`)
2. Tamaño actual del contexto (`Current context`)
3. Tamaño teórico sin podado (`Without DCP`)

Comparando `Without DCP` y `Current context`, puedes ver la cantidad real de tokens ahorrados por DCP.

### ❌ Usar修剪excesivamente agresivo en sesiones cortas

**Problema**: En sesiones cortas de 5-10 mensajes, habilitando todas las estrategias, invalidez de cache pronunciada

**Reason**: En sesiones cortas la expansión del contexto no es severa, el beneficio del修剪agresivo es pequeño

**Solución**:
- En sesiones cortas solo habilitar `deduplication` y `purgeErrors`
- Deshabilitar la estrategia `supersedeWrites`
- O deshabilitar completamente DCP (`enabled: false`)

### ❌ Ignorar las diferencias de facturación entre proveedores

**Problema**: En GitHub Copilot preocuparse de que la invalidez del cache aumente costos

**Reason**: No darse cuenta de que Copilot factura por solicitud, la invalidez del cache no incrementa costos

**Solución**:
- Copilot y Antigravity: Siempre habilitar DCP
- Anthropic y OpenAI: Ajustar estrategias según longitud de sesión

### ❌ Tomar decisiones sin observar datos reales

**Problema**: Juzgar por sensación si se debe habilitar DCP

**Reason**: No usar `/dcp context` y `/dcp stats` para observar efectos reales

**Solución**:
- Recopilar datos en diferentes sesiones
- Comparar diferencias entre habilitar/deshabilitar DCP
- Tomar decisiones según tus hábitos de uso

## Resumen de esta lección

**Mecanismo central de Prompt Caching**:

- Los proveedores de LLM cachean prompts basándose en **coincidencia de prefijo exacta**
- El修剪de DCP cambia el contenido del mensaje, causando invalidez del cache
- El hit rate del cache disminuye (~20%), pero el ahorro de tokens es más pronunciado

**Matriz de decisiones de balance**:

| Escenario | Configuración recomendada | Reason |
| --- | --- | --- |
| GitHub Copilot/Google Antigravity | ✅ Siempre habilitar | Facturación por solicitud, optimización de costo cero |
| Sesiones largas de Anthropic/OpenAI | ✅ Habilitar todas las estrategias | Ahorro de tokens > Pérdida del cache |
| Sesiones cortas de Anthropic/OpenAI | ⚠️ Solo habilitar deduplicación+limpieza de errores | El cache es más importante |

**Puntos clave**:

1. **La disminución del hit rate del cache no equivale a aumento de costos**: Hay que ver el ahorro total de tokens
2. **El modelo de facturación de diferentes proveedores afecta las estrategias**: Por solicitud vs por tokens
3. **Ajustar dinámicamente según la longitud de la sesión**: Las sesiones largas se benefician más
4. **Usar herramientas para observar datos**: `/dcp context` y `/dcp stats`

**Resumen de mejores prácticas**:

```
1. Confirmar el proveedor y modelo de facturación que usas
2. Ajustar la configuración de estrategias según la longitud de la sesión
3. Usar periódicamente /dcp context para observar efectos
4. En sesiones largas, priorizar el ahorro de tokens
5. En sesiones cortas, priorizar el hit rate del cache
```

##预告de la próxima lección

> En la próxima lección aprenderemos **[Manejo de Subagentes](/es/Opencode-DCP/opencode-dynamic-context-pruning/advanced/subagent-handling/)**.
>
> Aprenderás:
> - Cómo DCP detecta sesiones de subagentes
> - Por qué los subagentes no participan en el修剪
> - Cómo los resultados del修剪en subagentes se传递al agente principal

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para ver las ubicaciones del código fuente</strong></summary>

> Tiempo de actualización：2026-01-23

| Función | Ruta del archivo | Número de línea |
| --- | --- | --- |
| Explicación de Prompt Caching | [`README.md`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/README.md) | 46-52 |
| Cálculo de tokens (con cache) | [`lib/messages/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/utils.ts) | 66-78 |
| Comando de análisis de contexto | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 68-174 |
| Cálculo de tokens del cache | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 106-107 |
| Registro de tokens del cache | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts) | 141 |
| Definición de marcador de posición de podado | [`lib/messages/prune.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/prune.ts) | 6-7 |
| Podado de salida de herramientas | [`lib/messages/prune.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/prune.ts) | 22-46 |

**Constantes clave**:
- Ninguna

**Funciones clave**:
- `calculateTokens(messages, tokenizer)`: Calcula número de tokens de mensajes, incluyendo cache.read y cache.write
- `buildSessionContext(messages)`: Construye análisis de contexto de sesión, diferenciando System/User/Assistant/Tools
- `formatContextAnalysis(analysis)`: Formatea la salida del análisis de contexto

**Tipos clave**:
- `TokenCounts`: Estructura de conteo de tokens, incluyendo input/output/reasoning/cache

**Explicación del mecanismo de cache** (de README):
- Anthropic y OpenAI cachean prompts basándose en coincidencia de prefijo exacta
- El修剪de DCP cambia el contenido del mensaje, causando invalidez del cache
- Con DCP habilitado, el hit rate del cache es ~65%, sin habilitar ~85%
- Caso de uso óptimo: Proveedores de facturación por solicitud (GitHub Copilot, Google Antigravity) sin efectos negativos

</details>
