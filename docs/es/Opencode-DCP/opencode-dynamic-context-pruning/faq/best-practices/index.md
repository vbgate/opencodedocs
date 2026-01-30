---
title: "Mejores Prácticas: Optimización de Configuración | opencode-dynamic-context-pruning"
subtitle: "Mejores Prácticas: Optimización de Configuración"
sidebarTitle: "Ahorra 40% Tokens"
description: "Aprende las mejores prácticas de configuración de DCP. Domina la selección de estrategias, protección de turnos, protección de herramientas y configuración de notificaciones para optimizar el uso de tokens."
tags:
  - "Mejores Prácticas"
  - "Ahorro de Tokens"
  - "Configuración"
  - "Optimización"
prerequisite:
  - "start-configuration"
  - "platforms-auto-pruning"
order: 2
---

# Mejores Prácticas de DCP

## Lo que Aprenderás

- Comprender la relación entre Prompt Caching y el ahorro de tokens
- Elegir la estrategia de protección adecuada (protección de turnos, herramientas protegidas, patrones de archivos)
- Usar comandos para optimizar manualmente el uso de tokens
- Personalizar la configuración de DCP según las necesidades del proyecto

## Equilibrio con Prompt Caching

### Entendiendo el Equilibrio entre Caché y Poda

Cuando DCP poda las salidas de herramientas, modifica el contenido de los mensajes, lo que invalida el Prompt Caching basado en **coincidencia exacta de prefijos** desde ese punto en adelante.

**Comparación de Datos de Prueba**:

| Escenario | Tasa de Aciertos de Caché | Ahorro de Tokens | Beneficio Neto |
| --- | --- | --- | --- |
| Sin DCP | ~85% | 0% | Línea base |
| Con DCP | ~65% | 20-40% | ✅ Beneficio positivo |

### Cuándo Ignorar la Pérdida de Caché

**Escenarios Recomendados para Usar DCP**:

- ✅ **Conversaciones largas** (más de 20 turnos): La expansión del contexto es significativa, el ahorro de tokens supera con creces la pérdida de caché
- ✅ **Servicios con facturación por solicitud**: GitHub Copilot, Google Antigravity, etc. donde la pérdida de caché no tiene impacto negativo
- ✅ **Llamadas intensivas a herramientas**: Escenarios con lectura frecuente de archivos, ejecución de búsquedas, etc.
- ✅ **Tareas de refactorización de código**: Escenarios frecuentes de lectura repetida del mismo archivo

**Escenarios donde Podría ser Necesario Desactivar DCP**:

- ⚠️ **Conversaciones cortas** (< 10 turnos): Beneficio limitado de la poda, la pérdida de caché puede ser más notable
- ⚠️ **Tareas sensibles al caché**: Escenarios que requieren maximizar la tasa de aciertos de caché (como procesamiento por lotes)

::: tip Configuración Flexible
Puedes ajustar dinámicamente la configuración de DCP según las necesidades del proyecto, e incluso desactivar estrategias específicas en la configuración a nivel de proyecto.
:::

---

## Mejores Prácticas de Prioridad de Configuración

### Uso Correcto de la Configuración Multinivel

La configuración de DCP se fusiona según la siguiente prioridad:

```
Valores predeterminados < Configuración global < Directorio de configuración personalizado < Configuración del proyecto
```

::: info Explicación del Directorio de Configuración
El "directorio de configuración personalizado" es un directorio especificado mediante la variable de entorno `$OPENCODE_CONFIG_DIR`. Este directorio debe contener un archivo `dcp.jsonc` o `dcp.json`.
:::

### Estrategias de Configuración Recomendadas

| Escenario | Ubicación de Configuración Recomendada | Enfoque de Configuración de Ejemplo |
| --- | --- | --- |
| **Entorno de desarrollo personal** | Configuración global | Habilitar estrategias automáticas, desactivar logs de depuración |
| **Proyecto de colaboración en equipo** | Configuración del proyecto | Archivos protegidos específicos del proyecto, interruptores de estrategia |
| **Entorno CI/CD** | Directorio de configuración personalizado | Desactivar notificaciones, habilitar logs de depuración |
| **Depuración temporal** | Configuración del proyecto | Habilitar `debug`, modo de notificación detallado |

**Ejemplo: Sobrescritura de Configuración a Nivel de Proyecto**

```jsonc
// ~/.config/opencode/dcp.jsonc (configuración global)
{
    "enabled": true,
    "strategies": {
        "deduplication": {
            "enabled": true
        }
    }
}
```

```jsonc
// .opencode/dcp.jsonc (configuración del proyecto)
{
    "strategies": {
        // Sobrescritura a nivel de proyecto: desactivar deduplicación (por ejemplo, si el proyecto necesita preservar el contexto histórico)
        "deduplication": {
            "enabled": false
        }
    }
}
```

::: warning Reiniciar Después de Modificar la Configuración
Debes reiniciar OpenCode después de modificar la configuración para que los cambios surtan efecto.
:::

---

## Selección de Estrategias de Protección

### Casos de Uso de Protección de Turnos

La **Protección de Turnos** (Turn Protection) evita que las herramientas sean podadas dentro de un número especificado de turnos, dando a la IA tiempo suficiente para referenciar contenido reciente.

**Configuraciones Recomendadas**:

| Escenario | Valor Recomendado | Razón |
| --- | --- | --- |
| **Resolución de problemas complejos** | 4-6 turnos | La IA necesita múltiples iteraciones para analizar las salidas de herramientas |
| **Refactorización de código** | 2-3 turnos | Cambio de contexto rápido, un período de protección demasiado largo afecta la efectividad |
| **Desarrollo rápido de prototipos** | 2-4 turnos | Equilibrio entre protección y ahorro de tokens |
| **Configuración predeterminada** | 4 turnos | Punto de equilibrio probado |

**Cuándo Habilitar la Protección de Turnos**:

```jsonc
{
    "turnProtection": {
        "enabled": true,   // Habilitar protección de turnos
        "turns": 6        // Proteger durante 6 turnos (adecuado para tareas complejas)
    }
}
```

**Cuándo No se Recomienda Habilitarla**:

- Escenarios simples de preguntas y respuestas (la IA responde directamente, no necesita herramientas)
- Conversaciones cortas de alta frecuencia (un período de protección demasiado largo causa poda tardía)

### Configuración de Herramientas Protegidas

**Herramientas Protegidas por Defecto** (no requieren configuración adicional):
- `task`, `write`, `edit`, `batch`, `discard`, `extract`, `todowrite`, `todoread`, `plan_enter`, `plan_exit`

::: warning Nota sobre Valores Predeterminados del Schema
Si usas la función de autocompletado de tu IDE, la lista de herramientas protegidas por defecto en el archivo Schema (`dcp.schema.json`) puede aparecer incompleta. Los valores reales se basan en `DEFAULT_PROTECTED_TOOLS` definido en el código fuente, que incluye las 10 herramientas.
:::

**Cuándo Agregar Herramientas Protegidas Adicionales**:

| Escenario | Configuración de Ejemplo | Razón |
| --- | --- | --- |
| **Herramientas de negocio críticas** | `protectedTools: ["critical_tool"]` | Asegurar que las operaciones críticas siempre sean visibles |
| **Herramientas que requieren contexto histórico** | `protectedTools: ["analyze_history"]` | Preservar el historial completo para análisis |
| **Herramientas de tareas personalizadas** | `protectedTools: ["custom_task"]` | Proteger flujos de trabajo de tareas personalizadas |

```jsonc
{
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": ["custom_analyze"]  // Protección adicional para herramientas específicas
        }
    },
    "tools": {
        "settings": {
            "protectedTools": ["important_check"]  // Protección adicional para herramientas LLM
        }
    }
}
```

### Uso de Patrones de Archivos Protegidos

**Patrones de Protección Recomendados**:

| Tipo de Archivo | Patrón Recomendado | Razón de Protección |
| --- | --- | --- |
| **Archivos de configuración** | `"*.env"`, `".env*"` | Evitar que información sensible sea podada y perdida |
| **Configuración de base de datos** | `"**/config/database/*"` | Asegurar que la configuración de conexión a BD siempre esté disponible |
| **Archivos de claves** | `"**/secrets/**"` | Proteger todas las claves y certificados |
| **Lógica de negocio central** | `"src/core/*"` | Evitar pérdida de contexto de código crítico |

```jsonc
{
    "protectedFilePatterns": [
        "*.env",                // Proteger todos los archivos de variables de entorno
        ".env.*",              // Incluyendo .env.local, etc.
        "**/secrets/**",       // Proteger directorio de secrets
        "**/config/*.json",    // Proteger archivos de configuración
        "src/auth/**"          // Proteger código relacionado con autenticación
    ]
}
```

::: tip Reglas de Coincidencia de Patrones
`protectedFilePatterns` coincide con el campo `filePath` en los parámetros de herramientas (como las herramientas `read`, `write`, `edit`).
:::

---

## Selección de Estrategias Automáticas

### Estrategia de Deduplicación

**Habilitada por defecto**, adecuada para la mayoría de escenarios.

**Escenarios Aplicables**:
- Lectura repetida del mismo archivo (como revisión de código, depuración en múltiples rondas)
- Ejecución de los mismos comandos de búsqueda o análisis

**Cuándo No se Recomienda Habilitarla**:
- Necesidad de preservar la salida exacta de cada llamada (como monitoreo de rendimiento)
- Las salidas de herramientas contienen marcas de tiempo o valores aleatorios (diferentes en cada llamada)

### Estrategia de Sobrescritura de Escrituras (Supersede Writes)

**Deshabilitada por defecto**, decide si habilitarla según las necesidades del proyecto.

**Escenarios Recomendados para Habilitarla**:
- Verificación de lectura inmediata después de modificar archivos (refactorización, procesamiento por lotes)
- Las salidas de operaciones de escritura son grandes, y la lectura sobrescribiría su valor

```jsonc
{
    "strategies": {
        "supersedeWrites": {
            "enabled": true  // Habilitar estrategia de sobrescritura de escrituras
        }
    }
}
```

**Cuándo No se Recomienda Habilitarla**:
- Necesidad de rastrear el historial de modificaciones de archivos (auditoría de código)
- Las operaciones de escritura contienen metadatos importantes (como razones de cambio)

### Estrategia de Purga de Errores (Purge Errors)

**Habilitada por defecto**, se recomienda mantenerla habilitada.

**Recomendaciones de Configuración**:

| Escenario | Valor Recomendado | Razón |
| --- | --- | --- |
| **Configuración predeterminada** | 4 turnos | Punto de equilibrio probado |
| **Escenarios de fallo rápido** | 2 turnos | Limpiar entradas erróneas temprano, reducir contaminación del contexto |
| **Necesidad de historial de errores** | 6-8 turnos | Preservar más información de errores para depuración |

```jsonc
{
    "strategies": {
        "purgeErrors": {
            "enabled": true,
            "turns": 2  // Escenario de fallo rápido: limpiar entradas erróneas después de 2 turnos
        }
    }
}
```

---

## Mejores Prácticas para Herramientas Impulsadas por LLM

### Optimización de la Función de Recordatorio

DCP recuerda a la IA por defecto que use herramientas de poda después de cada 10 llamadas a herramientas.

**Configuración Recomendada**:

| Escenario | nudgeFrequency | Descripción del Efecto |
| --- | --- | --- |
| **Llamadas intensivas a herramientas** | 8-12 | Recordar a la IA que limpie oportunamente |
| **Llamadas de baja frecuencia a herramientas** | 15-20 | Reducir interrupciones de recordatorios |
| **Desactivar recordatorios** | Infinity | Depender completamente del juicio autónomo de la IA |

```jsonc
{
    "tools": {
        "settings": {
            "nudgeEnabled": true,
            "nudgeFrequency": 15  // Escenario de baja frecuencia: recordar después de 15 llamadas a herramientas
        }
    }
}
```

### Uso de la Herramienta Extract

**Cuándo Usar Extract**:
- Las salidas de herramientas contienen hallazgos o datos clave que necesitan preservar un resumen
- La salida original es grande, pero la información extraída es suficiente para soportar el razonamiento posterior

**Recomendaciones de Configuración**:

```jsonc
{
    "tools": {
        "extract": {
            "enabled": true,
            "showDistillation": false  // No mostrar contenido extraído por defecto (reducir distracciones)
        }
    }
}
```

**Cuándo Habilitar `showDistillation`**:
- Necesidad de ver qué información clave extrajo la IA
- Depuración o verificación del comportamiento de la herramienta Extract

### Uso de la Herramienta Discard

**Cuándo Usar Discard**:
- Las salidas de herramientas son solo estado temporal o ruido
- No es necesario preservar las salidas de herramientas después de completar la tarea

**Recomendaciones de Configuración**:

```jsonc
{
    "tools": {
        "discard": {
            "enabled": true
        }
    }
}
```

---

## Consejos de Uso de Comandos

### Cuándo Usar `/dcp context`

**Escenarios de Uso Recomendados**:
- Sospecha de uso anormal de tokens
- Necesidad de entender la distribución del contexto de la sesión actual
- Evaluar la efectividad de la poda de DCP

**Mejores Prácticas**:
- Verificar una vez a mitad de conversaciones largas para entender la composición del contexto
- Verificar al final de la conversación para ver el consumo total de tokens

### Cuándo Usar `/dcp stats`

**Escenarios de Uso Recomendados**:
- Necesidad de entender los efectos de ahorro de tokens a largo plazo
- Evaluar el valor general de DCP
- Comparar efectos de ahorro entre diferentes configuraciones

**Mejores Prácticas**:
- Ver estadísticas acumuladas semanalmente
- Comparar efectos antes y después de optimizar la configuración

### Cuándo Usar `/dcp sweep`

**Escenarios de Uso Recomendados**:
- El contexto demasiado grande causa respuestas lentas
- Necesidad de reducir inmediatamente el consumo de tokens
- Las estrategias automáticas no activaron la poda

**Consejos de Uso**:

| Comando | Propósito |
| --- | --- |
| `/dcp sweep` | Podar todas las herramientas después del último mensaje del usuario |
| `/dcp sweep 10` | Podar solo las últimas 10 herramientas |
| `/dcp sweep 5` | Podar solo las últimas 5 herramientas |

**Flujo de Trabajo Recomendado**:
1. Primero usar `/dcp context` para ver el estado actual
2. Decidir la cantidad de poda según la situación
3. Usar `/dcp sweep N` para ejecutar la poda
4. Usar `/dcp context` nuevamente para confirmar el efecto

---

## Selección del Modo de Notificación

### Comparación de los Tres Modos de Notificación

| Modo | Contenido Mostrado | Escenario Aplicable |
| --- | --- | --- |
| **off** | No mostrar ninguna notificación | Entorno de trabajo sin interrupciones |
| **minimal** | Solo mostrar cantidad de poda y ahorro de tokens | Necesidad de conocer efectos sin detalles |
| **detailed** | Mostrar cada herramienta podada y razón (predeterminado) | Depuración o escenarios que requieren monitoreo detallado |

### Configuración Recomendada

| Escenario | Modo Recomendado | Razón |
| --- | --- | --- |
| **Desarrollo diario** | minimal | Enfocarse en efectos, reducir distracciones |
| **Depuración de problemas** | detailed | Ver la razón de cada operación de poda |
| **Demostraciones o grabaciones** | off | Evitar que las notificaciones interrumpan el flujo de demostración |

```jsonc
{
    "pruneNotification": "minimal"  // Recomendado para desarrollo diario
}
```

---

## Manejo de Escenarios de Sub-agentes

### Entendiendo las Limitaciones de Sub-agentes

**DCP está completamente deshabilitado en sesiones de sub-agentes**.

**Razones**:
- El objetivo de los sub-agentes es devolver resúmenes concisos de hallazgos
- La poda de DCP podría interferir con el comportamiento de resumen del sub-agente
- Los sub-agentes típicamente se ejecutan por poco tiempo, con expansión de contexto limitada

### Cómo Determinar si es una Sesión de Sub-agente

1. **Habilitar logs de depuración**:
   ```jsonc
   {
       "debug": true
   }
   ```

2. **Ver logs**:
   Los logs mostrarán la marca `isSubAgent: true`

### Sugerencias de Optimización de Tokens para Sub-agentes

Aunque DCP está deshabilitado en sub-agentes, aún puedes:

- Optimizar los prompts del sub-agente para reducir la longitud de salida
- Limitar el alcance de llamadas a herramientas del sub-agente
- Usar el parámetro `max_length` de la herramienta `task` para controlar la salida

---

## Resumen de la Lección

| Área de Mejores Prácticas | Recomendación Principal |
| --- | --- |
| **Prompt Caching** | En conversaciones largas, el ahorro de tokens típicamente supera la pérdida de caché |
| **Prioridad de Configuración** | Configuración global para ajustes generales, configuración de proyecto para necesidades específicas |
| **Protección de Turnos** | 4-6 turnos para tareas complejas, 2-3 turnos para tareas rápidas |
| **Herramientas Protegidas** | La protección predeterminada es suficiente, agregar herramientas de negocio críticas según sea necesario |
| **Archivos Protegidos** | Proteger archivos de configuración, claves y lógica de negocio central |
| **Estrategias Automáticas** | Deduplicación y purga de errores habilitadas por defecto, sobrescritura de escrituras según sea necesario |
| **Herramientas LLM** | Frecuencia de recordatorio 10-15 veces, Extract muestra contenido extraído durante depuración |
| **Uso de Comandos** | Verificar contexto regularmente, podar manualmente según sea necesario |
| **Modo de Notificación** | minimal para desarrollo diario, detailed para depuración |

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver las ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Funcionalidad | Ruta del Archivo | Líneas |
| --- | --- | --- |
| Fusión de configuración | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L691-794) | 691-794 |
| Validación de configuración | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-375) | 147-375 |
| Configuración predeterminada | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-134) | 68-134 |
| Protección de turnos | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L432-437) | 432-437 |
| Herramientas protegidas | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-79) | 68-79 |
| Patrones de archivos protegidos | [`protected-file-patterns.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/protected-file-patterns.ts#L1-60) | 1-60 |
| Detección de sub-agentes | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts#L1-8) | 1-8 |
| Función de recordatorio | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L438-441) | 438-441 |

**Constantes Clave**:
- `MAX_TOOL_CACHE_SIZE = 1000`: Número máximo de entradas en la caché de herramientas
- `turnProtection.turns`: Protección predeterminada de 4 turnos

**Funciones Clave**:
- `getConfig()`: Carga y fusiona configuración multinivel
- `validateConfigTypes()`: Valida tipos de elementos de configuración
- `mergeConfig()`: Fusiona configuración por prioridad
- `isSubAgentSession()`: Detecta sesiones de sub-agentes

</details>
