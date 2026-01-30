---
title: "Poda LLM: Optimización Inteligente | opencode-dynamic-context-pruning"
sidebarTitle: "Poda Automática por IA"
subtitle: "Poda LLM: Optimización Inteligente del Contexto"
description: "Aprende las herramientas discard/extract de DCP, comprende las diferencias, mecanismos de inyección y protección, configura opciones de activación, valida efectos de poda en práctica, optimiza tokens y reduce costos."
tags:
  - "DCP"
  - "Poda de Contexto"
  - "Herramientas IA"
  - "Optimización de Tokens"
prerequisite:
  - "start-configuration"
order: 2
---

# Herramientas de Poda Impulsadas por LLM: Optimización Inteligente del Contexto por IA

## Lo Que Aprenderás

- Comprender las diferencias y casos de uso entre las herramientas discard y extract
- Conocer cómo la IA selecciona contenido para podar mediante la lista `<prunable-tools>`
- Configurar opciones de activación, frecuencia de recordatorios y visualización de herramientas de poda
- Entender cómo los mecanismos de protección previenen la poda accidental de archivos críticos

## Tu Situación Actual

A medida que las conversaciones se profundizan y las llamadas a herramientas se acumulan, el contexto crece cada vez más. Podrías enfrentar:
- Aumento drástico en el uso de tokens, elevando los costos
- La IA necesita procesar grandes cantidades de salidas de herramientas antiguas e irrelevantes
- No sabes cómo hacer que la IA limpie proactivamente el contexto

La solución tradicional es la limpieza manual, pero esto interrumpe el flujo de conversación. DCP ofrece una mejor manera: permitir que la IA decida autónomamente cuándo limpiar el contexto.

## Cuándo Usar Esta Técnica

Cuando:
- Frecuentemente tienes conversaciones largas con muchas llamadas a herramientas acumuladas
- Descubres que la IA necesita procesar grandes cantidades de salidas históricas de herramientas
- Quieres optimizar los costos de uso de tokens sin interrumpir la conversación
- Deseas elegir entre retener o eliminar contenido según escenarios específicos

## Concepto Fundamental

DCP proporciona dos herramientas que permiten a la IA optimizar proactivamente el contexto durante la conversación:

| Herramienta | Propósito | ¿Retiene Contenido? |
| --- | --- | --- |
| **discard** | Eliminar tareas completadas o ruido | ❌ No retiene |
| **extract** | Extraer hallazgos clave y eliminar contenido original | ✅ Retiene información resumida |

### Mecanismo de Funcionamiento

Antes de que la IA envíe cada mensaje, DCP:

```
1. Escanea las llamadas a herramientas en la sesión actual
   ↓
2. Filtra herramientas ya podadas y protegidas
   ↓
3. Genera la lista <prunable-tools>
   Formato: ID: tool, parameter
   ↓
4. Inyecta la lista en el contexto
   ↓
5. La IA selecciona herramientas según la lista y llama a discard/extract
   ↓
6. DCP reemplaza el contenido podado con marcadores de posición
```

### Lógica de Decisión para Seleccionar Herramientas

La IA sigue este proceso de selección:

```
"¿Necesita esta salida de herramienta retener información?"
  │
  ├─ No → discard (método de limpieza predeterminado)
  │   - Tarea completada, contenido sin valor
  │   - Ruido, información irrelevante
  │
  ├─ Sí → extract (retener conocimiento)
  │   - Información clave necesaria para referencia posterior
  │   - Firmas de funciones, valores de configuración, etc.
  │
  └─ No estoy seguro → extract (más seguro)
```

::: info
La IA poda en lotes, no salidas individuales de herramientas pequeñas. Esto es más eficiente.
:::

### Mecanismos de Protección

DCP tiene múltiples capas de protección para prevenir que la IA pode accidentalmente contenido crítico:

| Capa de Protección | Descripción | Opción de Configuración |
| --- | --- | --- |
| **Herramientas Protegidas** | Herramientas centrales como task, write, edit no pueden podarse | `tools.settings.protectedTools` |
| **Archivos Protegidos** | Rutas de archivos que coinciden con patrones glob no pueden podarse | `protectedFilePatterns` |
| **Protección de Turnos** | Nuevas herramientas no se incluyen en la lista de poda durante N turnos | `turnProtection.turns` |

::: tip
Las herramientas protegidas por defecto incluyen: task, todowrite, todoread, discard, extract, batch, write, edit, plan_enter, plan_exit
:::

## Práctica Guiada

### Paso 1: Comprender la Lista `<prunable-tools>`

Durante la conversación, DCP inyecta automáticamente la lista `<prunable-tools>`. La IA ve contenido como este:

```xml
<prunable-tools>
The following tools have been invoked and are available for pruning.
This list does not mandate immediate action.
Consider your current goals and resources you need before discarding valuable tool inputs or outputs.
Consolidate your prunes for efficiency; it is rarely worth pruning a single tiny tool output.
Keep your context free of noise.

5: read, /path/to/auth.ts
12: bash, npm test
18: grep, "function login"
</prunable-tools>
```

**Deberías ver**:
- Una herramienta por línea, formato `ID: tool, parameter`
- ID es un índice numérico (comenzando desde 0)
- Solo muestra herramientas podables (ya podadas, protegidas, archivos protegidos no se muestran)

### Paso 2: Ver Escenarios de Uso de discard por la IA

Cuando la IA completa una tarea y determina que no necesita retener información:

```
Entrada del usuario: Probar funcionalidad de autenticación

Salida de la IA:
Pruebas pasadas. La lógica de autenticación funciona correctamente, no es necesario retener los registros de prueba.
[Llama a discard(ids: ["completion", "5", "12"])]
```

**Deberías ver**:
- La IA usó la herramienta `discard`
- Formato de parámetros: `["razón", "ID1", "ID2", ...]`
- Solo dos razones: `"completion"` (tarea completada) o `"noise"` (ruido)

### Paso 3: Ver Escenarios de Uso de extract por la IA

Cuando la IA necesita retener información clave después de completar una tarea:

```
Entrada del usuario: Analizar implementación del servicio de autenticación

Salida de la IA:
Encontré algunos detalles clave, extraídos a continuación:
[Llama a extract(ids: ["5", "12"], distillation: [
  "auth.ts: validateToken verifica caché (5min TTL) luego llama a OIDC",
  "bash: npm test resultado - todas las pruebas pasaron"
])]
```

**Deberías ver**:
- La IA usó la herramienta `extract`
- El array `distillation` coincide en longitud con el array `ids`
- Cada contenido extraído corresponde a información resumida de una salida de herramienta

### Paso 4: Configurar Opciones de Herramientas de Poda

Edita el archivo de configuración de DCP (`~/.config/opencode/dcp.jsonc` o `.opencode/dcp.jsonc` a nivel de proyecto):

```jsonc
{
  "tools": {
    "discard": {
      "enabled": true
    },
    "extract": {
      "enabled": true,
      "showDistillation": false
    },
    "settings": {
      "nudgeEnabled": true,
      "nudgeFrequency": 10,
      "protectedTools": [
        "task",
        "todowrite",
        "todoread",
        "discard",
        "extract",
        "batch",
        "write",
        "edit",
        "plan_enter",
        "plan_exit"
      ]
    }
  }
}
```

**Deberías ver**:
- `discard.enabled`: Habilitar herramienta discard (predeterminado true)
- `extract.enabled`: Habilitar herramienta extract (predeterminado true)
- `extract.showDistillation`: Si mostrar contenido extraído (predeterminado false)
- `nudgeEnabled`: Si habilitar recordatorios de poda (predeterminado true)
- `nudgeFrequency`: Frecuencia de recordatorios (predeterminado 10, es decir, cada 10 llamadas a herramientas)

**Deberías ver**:
- Si `showDistillation` es false, el contenido extraído no se muestra en la conversación
- Si `showDistillation` es true, el contenido extraído se muestra como mensaje ignorado

### Paso 5: Probar Funcionalidad de Poda

1. Realiza una conversación más larga, activando múltiples llamadas a herramientas
2. Observa si la IA llama a discard o extract en el momento apropiado
3. Usa `/dcp stats` para ver estadísticas de poda

**Deberías ver**:
- Después de que las llamadas a herramientas se acumulan hasta cierta cantidad, la IA comienza a podar proactivamente
- `/dcp stats` muestra la cantidad de tokens ahorrados
- El contexto de conversación está más enfocado en la tarea actual

## Punto de Verificación ✅

::: details Haz clic para expandir y verificar tu configuración

**Verificar si la configuración está activa**

```bash
# Ver configuración de DCP
cat ~/.config/opencode/dcp.jsonc

# O configuración a nivel de proyecto
cat .opencode/dcp.jsonc
```

Deberías ver:
- `tools.discard.enabled` es true (habilitar discard)
- `tools.extract.enabled` es true (habilitar extract)
- `tools.settings.nudgeEnabled` es true (habilitar recordatorios)

**Verificar si la poda funciona**

En la conversación, después de activar múltiples llamadas a herramientas:

Deberías ver:
- La IA llama a discard o extract en el momento apropiado
- Recibir notificación de poda (mostrando herramientas podadas y tokens ahorrados)
- `/dcp stats` muestra tokens ahorrados acumulados

:::

## Advertencias Comunes

### Error Común 1: La IA No Poda Herramientas

**Posibles causas**:
- Herramientas de poda no habilitadas
- Configuración de protección demasiado estricta, no hay herramientas podables

**Solución**:
```jsonc
{
  "tools": {
    "discard": {
      "enabled": true  // Asegurar habilitación
    },
    "extract": {
      "enabled": true  // Asegurar habilitación
    }
  }
}
```

### Error Común 2: Poda Accidental de Contenido Crítico

**Posibles causas**:
- Archivos críticos no agregados al modo de protección
- Lista de herramientas protegidas incompleta

**Solución**:
```jsonc
{
  "protectedFilePatterns": [
    "src/auth/*",  // Proteger archivos relacionados con autenticación
    "config/*"     // Proteger archivos de configuración
  ],
  "tools": {
    "settings": {
      "protectedTools": [
        "read",  // Agregar read a la lista de protección
        "write"
      ]
    }
  }
}
```

### Error Común 3: No Se Puede Ver Contenido Extraído

**Posibles causas**:
- `showDistillation` configurado como false

**Solución**:
```jsonc
{
  "tools": {
    "extract": {
      "showDistillation": true  // Habilitar visualización
    }
  }
}
```

::: warning
El contenido extraído se muestra como mensaje ignorado, no afecta el contexto de conversación.
:::

## Resumen de la Lección

DCP proporciona dos herramientas para que la IA optimice autónomamente el contexto:

- **discard**: Eliminar tareas completadas o ruido, sin necesidad de retener información
- **extract**: Extraer hallazgos clave y eliminar contenido original, reteniendo información resumida

La IA comprende las herramientas podables mediante la lista `<prunable-tools>` y selecciona la herramienta apropiada según el escenario. Los mecanismos de protección aseguran que el contenido crítico no se pode accidentalmente.

Puntos clave de configuración:
- Habilitar herramientas: `tools.discard.enabled` y `tools.extract.enabled`
- Mostrar contenido extraído: `tools.extract.showDistillation`
- Ajustar frecuencia de recordatorios: `tools.settings.nudgeFrequency`
- Proteger herramientas y archivos críticos: `protectedTools` y `protectedFilePatterns`

## Próxima Lección

> En la próxima lección aprenderemos **[Uso de Comandos Slash](../commands/)**
>
> Aprenderás:
> - Usar `/dcp context` para ver la distribución de tokens de la sesión actual
> - Usar `/dcp stats` para ver estadísticas de poda acumuladas
> - Usar `/dcp sweep` para activar manualmente la poda

---

## Apéndice: Referencias del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Funcionalidad | Ruta del Archivo | Líneas |
| --- | --- | --- |
| Definición de herramienta discard | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L180) | 155-180 |
| Definición de herramienta extract | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220) | 183-220 |
| Ejecución de operación de poda | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L26-L153) | 26-153 |
| --- | --- | --- |
| Inyección de contexto de poda | [`lib/messages/inject.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/inject.ts#L102-L156) | 102-156 |
| Especificación de herramienta discard | [`lib/prompts/discard-tool-spec.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/discard-tool-spec.ts#L1-L41) | 1-41 |
| Especificación de herramienta extract | [`lib/prompts/extract-tool-spec.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/extract-tool-spec.ts#L1-L48) | 1-48 |
| Prompt del sistema (ambos) | [`lib/prompts/system/both.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/system/both.ts#L1-L60) | 1-60 |
| Prompt de recordatorio | [`lib/prompts/nudge/both.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/nudge/both.ts#L1-L10) | 1-10 |
| Definición de configuración | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L436-L449) | 436-449 |
| Herramientas protegidas por defecto | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L438-L441) | 438-441 |

**Constantes clave**:
- `DISCARD_TOOL_DESCRIPTION`: Descripción del prompt de la herramienta discard
- `EXTRACT_TOOL_DESCRIPTION`: Descripción del prompt de la herramienta extract
- `DEFAULT_PROTECTED_TOOLS`: Lista de herramientas protegidas por defecto

**Funciones clave**:
- `createDiscardTool(ctx)`: Crear herramienta discard
- `createExtractTool(ctx)`: Crear herramienta extract
- `executePruneOperation(ctx, toolCtx, ids, reason, toolName, distillation)`: Ejecutar operación de poda
- `buildPrunableToolsList(state, config, logger, messages)`: Generar lista de herramientas podables
- `insertPruneToolContext(state, config, logger, messages)`: Inyectar contexto de poda

**Opciones de configuración**:
- `tools.discard.enabled`: Si habilitar herramienta discard (predeterminado true)
- `tools.extract.enabled`: Si habilitar herramienta extract (predeterminado true)
- `tools.extract.showDistillation`: Si mostrar contenido extraído (predeterminado false)
- `tools.settings.nudgeEnabled`: Si habilitar recordatorios (predeterminado true)
- `tools.settings.nudgeFrequency`: Frecuencia de recordatorios (predeterminado 10)
- `tools.settings.protectedTools`: Lista de herramientas protegidas
- `protectedFilePatterns`: Patrones glob de archivos protegidos

</details>
