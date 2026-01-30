---
title: "Comandos: Monitoreo y Poda | opencode-dynamic-context-pruning"
sidebarTitle: "Monitorear Tokens, Poda Manual"
subtitle: "Guía de Uso de Comandos DCP: Monitoreo y Poda Manual"
description: "Aprende a usar los 4 comandos de DCP para monitorear y podar manualmente. Te enseñamos /dcp context para ver sesiones, /dcp stats para ver estadísticas, /dcp sweep para activar poda manual."
tags:
  - "Comandos DCP"
  - "Monitoreo de Tokens"
  - "Poda Manual"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 3
---

# Guía de Uso de Comandos DCP: Monitoreo y Poda Manual

## Lo que Aprenderás

- Usar `/dcp context` para ver la distribución de uso de tokens en la sesión actual
- Usar `/dcp stats` para ver estadísticas acumuladas de poda
- Usar `/dcp sweep [n]` para activar poda manual
- Entender el mecanismo de protección de herramientas y archivos protegidos
- Conocer la estrategia de cálculo de tokens y el efecto de ahorro

## Tu Situación Actual

En conversaciones largas, el consumo de tokens aumenta cada vez más rápido, pero no sabes:
- ¿En qué se están gastando los tokens de la sesión actual?
- ¿Cuánto te ha ahorrado realmente DCP?
- ¿Cómo limpiar manualmente las salidas de herramientas que ya no necesitas?
- ¿Qué herramientas están protegidas y no serán podadas?

Si no aclaras estas preguntas, es posible que no puedas aprovechar completamente el efecto de optimización de DCP, e incluso podrías eliminar información importante en momentos críticos.

## Cuándo Usar Esto

Cuando:
- Quieras entender la composición de tokens de la sesión actual
- Necesites limpiar rápidamente el historial de conversación
- Quieras verificar el efecto de poda de DCP
- Te prepares para comenzar una nueva tarea y hacer una limpieza de contexto

## Concepto Central

DCP proporciona 4 comandos Slash para ayudarte a monitorear y controlar el uso de tokens:

| Comando | Propósito | Escenario de Uso |
| --- | --- | --- |
| `/dcp` | Mostrar ayuda | Ver cuando olvides comandos |
| `/dcp context` | Analizar distribución de tokens de sesión actual | Entender composición del contexto |
| `/dcp stats` | Ver estadísticas acumuladas de poda | Verificar efecto a largo plazo |
| `/dcp sweep [n]` | Podar herramientas manualmente | Reducir rápidamente tamaño del contexto |

**Mecanismo de Protección**:

Todas las operaciones de poda omiten automáticamente:
- **Herramientas protegidas**: `task`, `todowrite`, `todoread`, `discard`, `extract`, `batch`, `write`, `edit`, `plan_enter`, `plan_exit`
- **Archivos protegidos**: Rutas de archivo que coinciden con `protectedFilePatterns` en la configuración

::: info
La configuración de herramientas protegidas y archivos protegidos se puede personalizar mediante el archivo de configuración. Ver [Guía Completa de Configuración](../../start/configuration/).
:::

## Sigue los Pasos

### Paso 1: Ver Información de Ayuda

En el cuadro de diálogo de OpenCode, ingresa `/dcp`.

**Deberías ver**:

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Commands                         │
╰───────────────────────────────────────────────────────────╯

  /dcp context      Show token usage breakdown for current session
  /dcp stats        Show DCP pruning statistics
  /dcp sweep [n]    Prune tools since last user message, or last n tools
```

**Punto de verificación ✅**: Confirma que viste la descripción de los 3 subcomandos.

### Paso 2: Analizar Distribución de Tokens de la Sesión Actual

Ingresa `/dcp context` para ver el uso de tokens de la sesión actual.

**Deberías ver**:

```
╭───────────────────────────────────────────────────────────╮
│                  DCP Context Analysis                     │
╰───────────────────────────────────────────────────────────╯

Session Context Breakdown:
────────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

────────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

**Explicación de Clasificación de Tokens**:

| Clasificación | Método de Cálculo | Descripción |
| --- | --- | --- |
| **System** | `firstAssistant.input + cache.read - tokenizer(firstUserMessage)` | Prompt del sistema |
| **Tools** | `tokenizer(toolInputs + toolOutputs) - prunedTokens` | Llamadas a herramientas (descontando parte podada) |
| **User** | `tokenizer(all user messages)` | Todos los mensajes del usuario |
| **Assistant** | `total - system - user - tools` | Salida de texto de IA + tokens de razonamiento |

**Punto de verificación ✅**: Confirma que viste el porcentaje y cantidad de tokens de cada clasificación.

### Paso 3: Ver Estadísticas Acumuladas de Poda

Ingresa `/dcp stats` para ver el efecto de poda acumulado históricamente.

**Deberías ver**:

```
╭───────────────────────────────────────────────────────────╮
│                    DCP Statistics                         │
╰───────────────────────────────────────────────────────────╯

Session:
────────────────────────────────────────────────────────────
  Tokens pruned: ~15.2K
  Tools pruned:   12

All-time:
────────────────────────────────────────────────────────────
  Tokens saved:  ~284.5K
  Tools pruned:   156
  Sessions:       8
```

**Explicación de Estadísticas**:
- **Session**: Datos de poda de la sesión actual (en memoria)
- **All-time**: Datos acumulados de todas las sesiones históricas (persistidos en disco)

**Punto de verificación ✅**: Confirma que viste las estadísticas de poda de la sesión actual y acumuladas históricamente.

### Paso 4: Podar Herramientas Manualmente

Hay dos formas de usar `/dcp sweep`:

#### Forma 1: Podar Todas las Herramientas Después del Último Mensaje del Usuario

Ingresa `/dcp sweep` (sin parámetros).

**Deberías ver**:

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Sweep                            │
╰───────────────────────────────────────────────────────────╯

Swept 8 tool(s) since previous user message.
Tokens saved: ~12,345

  • Read: src/config.ts
  • Read: src/utils.ts
  • Bash: npm test
  • Read: package.json
  • Read: src/index.ts
  • Bash: git status
  • Read: README.md
  • Write: docs/tutorial.md
```

#### Forma 2: Podar las Últimas N Herramientas

Ingresa `/dcp sweep 5` para podar las últimas 5 herramientas.

**Deberías ver**:

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Sweep                            │
╰───────────────────────────────────────────────────────────╯

Swept last 5 tool(s).
Tokens saved: ~7,892

  • Read: src/index.ts
  • Bash: git status
  • Read: README.md
  • Write: docs/tutorial.md
  • Bash: npm run build
```

**Aviso de Herramientas Protegidas**:

Si se omitieron herramientas protegidas, la salida mostrará:

```
Swept 5 tool(s).
Tokens saved: ~7,892
(2 protected tool(s) skipped)
```

::: warning
Las herramientas protegidas (como `write`, `edit`) y las rutas de archivos protegidos se omiten automáticamente y no serán podadas.
:::

**Punto de verificación ✅**: Confirma que viste la lista de herramientas podadas y la cantidad de tokens ahorrados.

### Paso 5: Ver el Efecto de Poda Nuevamente

Después de podar, ingresa `/dcp context` nuevamente para ver la nueva distribución de tokens.

**Deberías ver**:
- El porcentaje de la clasificación `Tools` disminuyó
- El número de herramientas podadas en `Summary` aumentó
- El total de `Current context` disminuyó

**Punto de verificación ✅**: Confirma que el uso de tokens disminuyó significativamente.

## Errores Comunes

### ❌ Error: Eliminar Herramientas Importantes por Error

**Escenario**: Acabas de usar la herramienta `write` para escribir un archivo clave, luego ejecutas `/dcp sweep`.

**Resultado Erróneo**: La herramienta `write` es podada, la IA puede no saber que el archivo fue creado.

**Forma Correcta**:
- Herramientas como `write`, `edit` están protegidas por defecto
- No modifiques manualmente la configuración `protectedTools` para eliminar estas herramientas
- Después de completar tareas clave, espera algunas rondas antes de limpiar

### ❌ Error: Momento Inadecuado para Podar

**Escenario**: La conversación acaba de comenzar, solo hay algunas llamadas a herramientas y ejecutas `/dcp sweep`.

**Resultado Erróneo**: Los tokens ahorrados son pocos, e incluso puede afectar la coherencia del contexto.

**Forma Correcta**:
- Espera hasta que la conversación progrese hasta cierto punto (como 10+ llamadas a herramientas) antes de limpiar
- Limpia las salidas de herramientas de la ronda anterior antes de comenzar una nueva tarea
- Combina con `/dcp context` para juzgar si vale la pena limpiar

### ❌ Error: Dependencia Excesiva de la Poda Manual

**Escenario**: Ejecutas manualmente `/dcp sweep` en cada conversación.

**Resultado Erróneo**:
- Las estrategias de poda automática (deduplicación, sobrescritura, limpieza de errores) se desperdician
- Aumenta la carga operativa

**Forma Correcta**:
- Habilita las estrategias de poda automática por defecto (configuración: `strategies.*.enabled`)
- Usa la poda manual como complemento, cuando sea necesario
- Verifica el efecto de poda automática mediante `/dcp stats`

## Resumen de la Lección

Los 4 comandos de DCP te ayudan a monitorear y controlar el uso de tokens:

| Comando | Función Principal |
| --- | --- |
| `/dcp` | Mostrar información de ayuda |
| `/dcp context` | Analizar distribución de tokens de sesión actual |
| `/dcp stats` | Ver estadísticas acumuladas de poda |
| `/dcp sweep [n]` | Podar herramientas manualmente |

**Estrategia de Cálculo de Tokens**:
- System: Prompt del sistema (inferido desde la primera respuesta)
- Tools: Entrada y salida de herramientas (descontando parte podada)
- User: Todos los mensajes del usuario (estimado)
- Assistant: Salida de IA + tokens de razonamiento (residual)

**Mecanismo de Protección**:
- Herramientas protegidas: `task`, `todowrite`, `todoread`, `discard`, `extract`, `batch`, `write`, `edit`, `plan_enter`, `plan_exit`
- Archivos protegidos: Patrones glob configurados
- Todas las operaciones de poda omiten automáticamente este contenido

**Mejores Prácticas**:
- Revisa periódicamente `/dcp context` para entender la composición de tokens
- Ejecuta `/dcp sweep` antes de nuevas tareas para limpiar el historial
- Confía en la poda automática, usa la poda manual como complemento
- Verifica el efecto a largo plazo mediante `/dcp stats`

## Próxima Lección

> En la próxima lección aprenderemos sobre **[Mecanismo de Protección](../../advanced/protection/)**.
>
> Aprenderás:
> - Cómo la protección por turnos previene la poda accidental
> - Cómo personalizar la lista de herramientas protegidas
> - Método de configuración de patrones de archivos protegidos
> - Manejo especial de sesiones de subagentes

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver las ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Funcionalidad | Ruta del Archivo | Líneas |
| --- | --- | --- |
| Comando de ayuda /dcp | [`lib/commands/help.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/help.ts) | 19-32 |
| Comando /dcp context | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 238-247 |
| Estrategia de cálculo de tokens | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 5-38 |
| Comando /dcp stats | [`lib/commands/stats.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/stats.ts) | 46-67 |
| Comando /dcp sweep | [`lib/commands/sweep.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/sweep.ts) | 123-259 |
| Configuración de herramientas protegidas | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 461 |
| Lista de herramientas protegidas por defecto | [`README.md`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/README.md) | 150-151 |

**Constantes Clave**:
- `DEFAULT_PROTECTED_TOOLS`: Lista de herramientas protegidas por defecto

**Funciones Clave**:
- `handleHelpCommand()`: Maneja el comando de ayuda /dcp
- `handleContextCommand()`: Maneja el comando /dcp context
- `analyzeTokens()`: Calcula la cantidad de tokens de cada categoría
- `handleStatsCommand()`: Maneja el comando /dcp stats
- `handleSweepCommand()`: Maneja el comando /dcp sweep
- `buildToolIdList()`: Construye lista de IDs de herramientas

</details>
