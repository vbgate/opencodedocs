---
title: "Poda Automática: Tres Estrategias | opencode-dcp"
sidebarTitle: "Ahorra Tokens con Estrategias"
subtitle: "Poda Automática: Tres Estrategias | opencode-dcp"
description: "Aprende las tres estrategias de poda automática de DCP: deduplicación, sobrescritura y limpieza de errores. Explicación detallada del funcionamiento, casos de uso y configuración para reducir costos de tokens y mejorar la calidad del diálogo. Sin costo de LLM."
tags:
  - "poda automática"
  - "estrategias"
  - "deduplicación"
  - "sobrescritura"
  - "limpieza de errores"
prerequisite:
  - "start-getting-started"
  - "start-configuration"
order: 1
---

# Guía Detallada de Estrategias de Poda Automática

## Lo que Aprenderás

- Comprender el funcionamiento de las tres estrategias de poda automática
- Saber cuándo habilitar o deshabilitar cada estrategia
- Optimizar el rendimiento mediante configuración

## El Problema Actual

A medida que las conversaciones se alargan, las llamadas a herramientas se acumulan en el contexto:
- La IA lee repetidamente el mismo archivo, insertando el contenido completo cada vez
- Después de escribir un archivo y leerlo, el contenido escrito anterior sigue ocupando espacio
- Cuando una llamada a herramienta falla, los parámetros de entrada voluminosos permanecen en el contexto

Estos problemas inflan la factura de tokens y pueden "contaminar" el contexto, afectando el juicio de la IA.

## Concepto Central

DCP ofrece tres **estrategias de poda automática** que se ejecutan silenciosamente antes de cada solicitud, **sin costo de LLM**:

| Estrategia | Estado por Defecto | Función |
| --- | --- | --- |
| Deduplicación | ✅ Habilitada | Detecta llamadas duplicadas, conserva solo la más reciente |
| Sobrescritura | ❌ Deshabilitada | Limpia entradas de escritura sobrescritas por lecturas |
| Limpieza de Errores | ✅ Habilitada | Limpia entradas de herramientas con error después de N turnos |

Todas las estrategias siguen estas reglas:
- **Omitir herramientas protegidas**: task, write, edit y otras herramientas críticas no se podan
- **Omitir archivos protegidos**: rutas de archivo protegidas mediante patrones glob configurados
- **Conservar mensajes de error**: la estrategia de limpieza de errores solo elimina parámetros de entrada, los mensajes de error se conservan

---

## Estrategia de Deduplicación

### Funcionamiento

La estrategia de deduplicación detecta llamadas repetidas con **el mismo nombre de herramienta y parámetros**, conservando solo la más reciente.

::: info Mecanismo de Coincidencia de Firmas

DCP determina duplicados mediante "firmas":
- Mismo nombre de herramienta
- Mismos valores de parámetros (ignorando null/undefined, el orden de claves no afecta)

Por ejemplo:
```json
// Primera llamada
{ "tool": "read", "path": "src/config.ts" }

// Segunda llamada (misma firma)
{ "tool": "read", "path": "src/config.ts" }

// Tercera llamada (firma diferente)
{ "tool": "read", "path": "src/utils.ts" }
```
:::

### Casos de Uso

**Recomendado habilitar** (habilitado por defecto):
- La IA lee frecuentemente el mismo archivo para análisis de código
- Consultas repetidas a la misma configuración en conversaciones de múltiples turnos
- Escenarios donde se necesita el estado más reciente y las salidas históricas pueden descartarse

**Posibles razones para deshabilitar**:
- Necesidad de conservar el contexto de cada llamada a herramienta (por ejemplo, para depurar salidas de herramientas)

### Configuración

```json
// ~/.config/opencode/dcp.jsonc
{
  "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/main/dcp.schema.json",
  "strategies": {
    "deduplication": {
      "enabled": true  // true para habilitar, false para deshabilitar
    }
  }
}
```

**Herramientas protegidas** (no se podan por defecto):
- task, write, edit, batch, plan_enter, plan_exit
- todowrite, todoread (herramientas de lista de tareas)
- discard, extract (herramientas propias de DCP)

Estas herramientas no pueden ser podadas por deduplicación incluso si se configuran (protección codificada).

---

## Estrategia de Sobrescritura

### Funcionamiento

La estrategia de sobrescritura limpia **entradas de operaciones de escritura que han sido sobrescritas por lecturas posteriores**.

::: details Ejemplo: Escritura seguida de Lectura

```text
Paso 1: Escribir archivo
La IA llama a write("config.json", {...})
↓
Paso 2: Leer archivo para confirmar
La IA llama a read("config.json") → devuelve el contenido actual
↓
La estrategia de sobrescritura identifica
La entrada de write (potencialmente grande) se vuelve redundante
porque read ya capturó el estado actual del archivo
↓
Poda
Solo se conserva la salida de read, se elimina la entrada de write
```

:::

### Casos de Uso

**Recomendado habilitar**:
- Escenarios de desarrollo iterativo con frecuentes ciclos "escribir→verificar→modificar"
- Operaciones de escritura que contienen plantillas extensas o contenido de archivo completo

**Razones por las que está deshabilitado por defecto**:
- Algunos flujos de trabajo dependen del "historial de escrituras" como contexto
- Puede afectar algunas llamadas a herramientas relacionadas con control de versiones

**Cuándo habilitar manualmente**:
```json
{
  "strategies": {
    "supersedeWrites": {
      "enabled": true
    }
  }
}
```

### Consideraciones

Esta estrategia **solo poda la entrada de la herramienta write**, no la salida. Porque:
- La salida de write suele ser un mensaje de confirmación (muy pequeño)
- La entrada de write puede contener el contenido completo del archivo (muy grande)

---

## Estrategia de Limpieza de Errores

### Funcionamiento

La estrategia de limpieza de errores espera N turnos después de que una llamada a herramienta falla, luego elimina los **parámetros de entrada** (conservando el mensaje de error).

::: info ¿Qué es un turno?
En una conversación de OpenCode:
- El usuario envía un mensaje → La IA responde = 1 turno
- Las llamadas a herramientas no cuentan como turnos separados

El umbral por defecto es 4 turnos, lo que significa que las entradas de herramientas con error se limpian automáticamente después de 4 turnos.
:::

### Casos de Uso

**Recomendado habilitar** (habilitado por defecto):
- Llamadas a herramientas que fallan con entradas grandes (por ejemplo, fallo al leer un archivo muy grande)
- El mensaje de error debe conservarse, pero los parámetros de entrada ya no tienen valor

**Posibles razones para deshabilitar**:
- Necesidad de conservar la entrada completa de herramientas fallidas para depuración
- Errores "intermitentes" frecuentes donde se desea conservar el historial

### Configuración

```json
{
  "strategies": {
    "purgeErrors": {
      "enabled": true,   // Interruptor de habilitación
      "turns": 4        // Umbral de limpieza (número de turnos)
    }
  }
}
```

**Herramientas protegidas** (no se podan por defecto):
- La misma lista de herramientas protegidas que la estrategia de deduplicación

---

## Orden de Ejecución de Estrategias

Las tres estrategias se ejecutan en un **orden fijo**:

```mermaid
graph LR
    A["Lista de mensajes"] --> B["Sincronizar caché de herramientas"]
    B --> C["Estrategia de deduplicación"]
    C --> D["Estrategia de sobrescritura"]
    D --> E["Estrategia de limpieza de errores"]
    E --> F["Reemplazo de contenido podado"]
```

Esto significa:
1. Primero deduplicación (reducir redundancia)
2. Luego sobrescritura (limpiar escrituras obsoletas)
3. Finalmente limpieza de errores (limpiar entradas de error expiradas)

Cada estrategia se basa en el resultado de la anterior, sin podar la misma herramienta dos veces.

---

## Errores Comunes

### ❌ Error 1: Pensar que todas las herramientas se podan automáticamente

**Problema**: ¿Por qué task, write y otras herramientas no se podan?

**Causa**: Estas herramientas están en la **lista de herramientas protegidas**, con protección codificada.

**Solución**:
- Si realmente necesitas podar write, considera habilitar la estrategia de sobrescritura
- Si necesitas podar task, puedes controlar indirectamente configurando rutas de archivos protegidos

### ❌ Error 2: La estrategia de sobrescritura causa contexto incompleto

**Problema**: Después de habilitar sobrescritura, la IA no encuentra el contenido escrito anteriormente.

**Causa**: La estrategia solo limpia operaciones de escritura "sobrescritas por lecturas", pero si nunca se leyó después de escribir, no se poda.

**Solución**:
- Verifica si el archivo realmente fue leído (`/dcp context` para verificar)
- Si realmente necesitas conservar el registro de escrituras, deshabilita esta estrategia

### ❌ Error 3: La estrategia de limpieza de errores limpia demasiado rápido

**Problema**: Las entradas de error se podan y la IA inmediatamente encuentra el mismo error.

**Causa**: El umbral `turns` está configurado muy bajo.

**Solución**:
```json
{
  "strategies": {
    "purgeErrors": {
      "turns": 8  // Aumentar de 4 (por defecto) a 8
    }
  }
}
```

---

## Cuándo Usar Cada Estrategia

| Escenario | Combinación Recomendada |
| --- | --- |
| Desarrollo diario (más lecturas que escrituras) | Deduplicación + Limpieza de errores (configuración por defecto) |
| Verificación frecuente de escrituras | Todas habilitadas (habilitar sobrescritura manualmente) |
| Depuración de fallos de herramientas | Solo deduplicación (deshabilitar limpieza de errores) |
| Necesidad de historial de contexto completo | Todas deshabilitadas |

---

## Resumen de la Lección

- **Estrategia de deduplicación**: Detecta llamadas duplicadas, conserva la más reciente (habilitada por defecto)
- **Estrategia de sobrescritura**: Limpia entradas de escritura sobrescritas por lecturas (deshabilitada por defecto)
- **Estrategia de limpieza de errores**: Limpia entradas de herramientas con error después de N turnos (habilitada por defecto, umbral 4)
- Todas las estrategias omiten herramientas protegidas y rutas de archivos protegidos
- Las estrategias se ejecutan en orden fijo: Deduplicación → Sobrescritura → Limpieza de errores

---

## Próxima Lección

> En la próxima lección aprenderemos sobre **[Herramientas de Poda Impulsadas por LLM](../llm-tools/)**.
>
> Aprenderás:
> - Cómo la IA invoca autónomamente las herramientas discard y extract
> - Implementación de optimización de contexto a nivel semántico
> - Mejores prácticas para extraer hallazgos clave

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para ver las ubicaciones del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Funcionalidad | Ruta del Archivo | Líneas |
| --- | --- | --- |
| Implementación de deduplicación | [`lib/strategies/deduplication.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/deduplication.ts) | 13-83 |
| Implementación de sobrescritura | [`lib/strategies/supersede-writes.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/supersede-writes.ts) | 16-105 |
| Implementación de limpieza de errores | [`lib/strategies/purge-errors.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/purge-errors.ts) | 16-80 |
| Exportación de estrategias | [`lib/strategies/index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/index.ts) | 1-5 |
| Configuración por defecto | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 423-464 |
| Lista de herramientas protegidas | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 68-79 |

**Funciones clave**:
- `deduplicate()` - Función principal de la estrategia de deduplicación
- `supersedeWrites()` - Función principal de la estrategia de sobrescritura
- `purgeErrors()` - Función principal de la estrategia de limpieza de errores
- `createToolSignature()` - Crea firma de herramienta para coincidencia de deduplicación
- `normalizeParameters()` - Normalización de parámetros (elimina null/undefined)
- `sortObjectKeys()` - Ordenación de claves de parámetros (asegura consistencia de firma)

**Valores de configuración por defecto**:
- `strategies.deduplication.enabled = true`
- `strategies.supersedeWrites.enabled = false`
- `strategies.purgeErrors.enabled = true`
- `strategies.purgeErrors.turns = 4`

**Herramientas protegidas (no se podan por defecto)**:
- task, todowrite, todoread, discard, extract, batch, write, edit, plan_enter, plan_exit

</details>
