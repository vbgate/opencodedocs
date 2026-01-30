---
title: "Persistencia de Estado: Conservar Historial entre Sesiones | opencode-dynamic-context-pruning"
subtitle: "Persistencia de Estado: Conservar Historial entre Sesiones"
sidebarTitle: "Sin pérdida de datos al reiniciar"
description: "Aprende el mecanismo de persistencia de estado de opencode-dynamic-context-pruning. Conserva el historial de poda entre sesiones y consulta el ahorro acumulado de tokens con /dcp stats."
tags:
  - "advanced"
  - "state-management"
  - "persistence"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 2
---

# Persistencia de Estado: Conservar el Historial de Poda entre Sesiones

## Lo que aprenderás

- Cómo DCP conserva el estado de poda entre reinicios de OpenCode
- Ubicación y formato del archivo de persistencia
- Lógica de gestión de estado al cambiar de sesión y comprimir contexto
- Consultar el ahorro acumulado de tokens en todas las sesiones con `/dcp stats`

## Tu problema actual

¿Cerraste OpenCode y al reabrirlo descubriste que los registros de poda anteriores desaparecieron? ¿O quieres saber de dónde proviene el "ahorro acumulado en todas las sesiones" en `/dcp stats`?

El mecanismo de persistencia de estado de DCP guarda automáticamente tu historial de poda y datos estadísticos en segundo plano, asegurando que permanezcan visibles después de reiniciar.

## Cuándo usar esta técnica

- Necesitas acumular estadísticas de ahorro de tokens entre sesiones
- Continuar el historial de poda después de reiniciar OpenCode
- Uso prolongado de DCP para ver el efecto general

## Concepto clave

**¿Qué es la persistencia de estado?**

La **persistencia de estado** significa que DCP guarda el historial de poda y los datos estadísticos en archivos de disco, asegurando que esta información no se pierda después de reiniciar OpenCode o cambiar de sesión.

::: info ¿Por qué es necesaria la persistencia?

Sin persistencia, cada vez que cierras OpenCode:
- Se pierde la lista de IDs de herramientas podadas
- Las estadísticas de ahorro de tokens se reinician a cero
- La IA podría podar repetidamente la misma herramienta

Con persistencia, DCP puede:
- Recordar qué herramientas ya fueron podadas
- Acumular el ahorro de tokens de todas las sesiones
- Continuar el trabajo anterior después de reiniciar
:::

**Dos partes del contenido persistido**

El estado guardado por DCP contiene dos tipos de información:

| Tipo | Contenido | Propósito |
| --- | --- | --- |
| **Estado de poda** | Lista de IDs de herramientas podadas | Evitar poda duplicada, seguimiento entre sesiones |
| **Datos estadísticos** | Cantidad de tokens ahorrados (sesión actual + acumulado histórico) | Mostrar efectividad de DCP, análisis de tendencias a largo plazo |

Estos datos se almacenan por separado según el ID de sesión de OpenCode, con un archivo JSON para cada sesión.

## Flujo de datos

```mermaid
graph TD
    subgraph "Operación de poda"
        A1[IA llama discard/extract]
        A2[Usuario ejecuta /dcp sweep]
    end

    subgraph "Estado en memoria"
        B1[SessionState.prune.toolIds]
        B2[SessionState.stats]
    end

    subgraph "Almacenamiento persistente"
        C1[~/.local/share/opencode/storage/plugin/dcp/]
        C2[{sessionId}.json]
    end

    A1 --> B1
    A2 --> B1
    B1 -->|Guardado asíncrono| C1
    B2 -->|Guardado asíncrono| C1
    C1 --> C2

    C2 -->|Carga al cambiar sesión| B1
    C2 -->|Carga al cambiar sesión| B2

    D[Mensaje summary de OpenCode] -->|Limpia caché| B1
```

## Paso a paso

### Paso 1: Conocer la ubicación del almacenamiento persistente

**Por qué**
Saber dónde están los datos te permite verificarlos o eliminarlos manualmente (si es necesario)

DCP guarda el estado en el sistema de archivos local, sin subirlo a la nube.

```bash
# Ubicación del directorio de persistencia
~/.local/share/opencode/storage/plugin/dcp/

# Un archivo JSON por sesión, formato: {sessionId}.json
```

**Deberías ver**: Varios archivos `.json` en el directorio, cada uno correspondiente a una sesión de OpenCode

::: tip Privacidad de datos

DCP solo guarda localmente el estado de poda y datos estadísticos, sin información sensible. Los archivos persistidos contienen:
- Lista de IDs de herramientas (identificadores numéricos)
- Cantidad de tokens ahorrados (datos estadísticos)
- Última actualización (marca de tiempo)

No contienen contenido de conversaciones, salidas de herramientas ni entradas del usuario.
:::

### Paso 2: Ver el formato del archivo persistido

**Por qué**
Entender la estructura del archivo te permite verificar manualmente o depurar problemas

```bash
# Listar todos los archivos persistidos
ls -la ~/.local/share/opencode/storage/plugin/dcp/

# Ver el contenido persistido de una sesión
cat ~/.local/share/opencode/storage/plugin/dcp/{sessionId}.json
```

**Deberías ver**: Una estructura JSON similar a esta

```json
{
  "sessionName": "Nombre de mi sesión",
  "prune": {
    "toolIds": ["12345", "12346", "12347"]
  },
  "stats": {
    "pruneTokenCounter": 0,
    "totalPruneTokens": 15420
  },
  "lastUpdated": "2026-01-23T10:30:45.123Z"
}
```

**Descripción de campos**:

| Campo | Tipo | Significado |
| --- | --- | --- |
| `sessionName` | string (opcional) | Nombre de la sesión, para fácil identificación |
| `prune.toolIds` | string[] | Lista de IDs de herramientas podadas |
| `stats.pruneTokenCounter` | number | Tokens ahorrados en la sesión actual (sin archivar) |
| `stats.totalPruneTokens` | number | Tokens ahorrados acumulados históricamente |
| `lastUpdated` | string | Última actualización en formato ISO 8601 |

### Paso 3: Ver estadísticas acumuladas

**Por qué**
Conocer el efecto acumulado de todas las sesiones para evaluar el valor a largo plazo de DCP

```bash
# Ejecutar en OpenCode
/dcp stats
```

**Deberías ver**: Panel de información estadística

```
╭───────────────────────────────────────────────────────────╮
│                    DCP Statistics                         │
╰───────────────────────────────────────────────────────────╯

Session:
────────────────────────────────────────────────────────────
  Tokens pruned: ~15.4K
  Tools pruned:   3

All-time:
────────────────────────────────────────────────────────────
  Tokens saved:  ~154.2K
  Tools pruned:   47
  Sessions:       12
```

**Significado de las estadísticas**:

| Estadística | Origen | Descripción |
| --- | --- | --- |
| **Session** | Estado actual en memoria | Efecto de poda de la sesión actual |
| **All-time** | Todos los archivos persistidos | Efecto acumulado de todas las sesiones históricas |

::: info Cómo se calcula All-time

DCP recorre todos los archivos JSON en el directorio `~/.local/share/opencode/storage/plugin/dcp/` y suma:
- `totalPruneTokens`: Total de tokens ahorrados en todas las sesiones
- `toolIds.length`: Total de herramientas podadas en todas las sesiones
- Cantidad de archivos: Total de sesiones

Así puedes ver el efecto general de DCP en el uso a largo plazo.
:::

### Paso 4: Entender el mecanismo de guardado automático

**Por qué**
Saber cuándo DCP guarda el estado evita operaciones erróneas que causen pérdida de datos

DCP guarda automáticamente el estado en disco en los siguientes momentos:

| Momento de activación | Contenido guardado | Ubicación en código |
| --- | --- | --- |
| Después de que la IA llame a `discard`/`extract` | Estado de poda actualizado + estadísticas | `lib/strategies/tools.ts:148-150` |
| Después de que el usuario ejecute `/dcp sweep` | Estado de poda actualizado + estadísticas | `lib/commands/sweep.ts:234-236` |
| Después de completar la operación de poda | Guardado asíncrono, no bloquea el flujo principal | `saveSessionState()` |

**Flujo de guardado**:

```typescript
// 1. Actualizar estado en memoria
state.stats.totalPruneTokens += state.stats.pruneTokenCounter
state.stats.pruneTokenCounter = 0

// 2. Guardar asincrónicamente en disco
await saveSessionState(state, logger)
```

::: tip Beneficios del guardado asíncrono

DCP usa un mecanismo de guardado asíncrono para asegurar que las operaciones de poda no se bloqueen por I/O de disco. Incluso si el guardado falla (por ejemplo, espacio en disco insuficiente), no afecta el efecto de poda de la sesión actual.

Los fallos se registran como advertencias en `~/.config/opencode/logs/dcp/`.
:::

### Paso 5: Entender el mecanismo de carga automática

**Por qué**
Saber cuándo DCP carga el estado persistido para entender el comportamiento al cambiar de sesión

DCP carga automáticamente el estado persistido en los siguientes momentos:

| Momento de activación | Contenido cargado | Ubicación en código |
| --- | --- | --- |
| Al iniciar OpenCode o cambiar de sesión | Estado de poda histórico + estadísticas de esa sesión | `lib/state/state.ts:104` (dentro de la función `ensureSessionInitialized`) |

**Flujo de carga**:

```typescript
// 1. Detectar cambio de ID de sesión
if (state.sessionId !== lastSessionId) {
    await ensureSessionInitialized(client, state, lastSessionId, logger, messages)
}

// 2. Reiniciar estado en memoria
resetSessionState(state)
state.sessionId = lastSessionId

// 3. Cargar estado persistido desde disco
const persisted = await loadSessionState(sessionId, logger)
if (persisted) {
    state.prune = { toolIds: persisted.prune.toolIds }
    state.stats = {
        pruneTokenCounter: persisted.stats.pruneTokenCounter,
        totalPruneTokens: persisted.stats.totalPruneTokens
    }
}
```

**Deberías ver**: Después de cambiar a una sesión anterior, `/dcp stats` muestra los datos estadísticos históricos sin cambios

### Paso 6: Entender la limpieza de estado durante la compresión de contexto

**Por qué**
Entender cómo DCP maneja el estado cuando OpenCode comprime automáticamente el contexto

Cuando OpenCode detecta que la conversación es demasiado larga, genera automáticamente un mensaje summary para comprimir el contexto. DCP detecta esta compresión y limpia el estado relacionado.

```typescript
// Manejo al detectar mensaje summary
if (lastCompactionTimestamp > state.lastCompaction) {
    state.lastCompaction = lastCompactionTimestamp
    state.toolParameters.clear()  // Limpiar caché de herramientas
    state.prune.toolIds = []       // Limpiar estado de poda
    logger.info("Detected compaction from messages - cleared tool cache")
}
```

::: info ¿Por qué es necesario limpiar?

El mensaje summary de OpenCode comprime todo el historial de conversación, en este momento:
- Las llamadas a herramientas antiguas ya se han fusionado en el summary
- Mantener la lista de IDs de herramientas ya no tiene sentido (las herramientas ya no existen)
- Limpiar el estado evita referencias a IDs de herramientas inválidos

Este es un compromiso de diseño: sacrificar parte del historial de poda para garantizar la consistencia del estado.
:::

## Punto de verificación ✅

Confirma que entiendes los siguientes puntos:

- [ ] Los archivos persistidos de DCP se almacenan en `~/.local/share/opencode/storage/plugin/dcp/`
- [ ] Cada sesión corresponde a un archivo `{sessionId}.json`
- [ ] El contenido persistido incluye estado de poda (toolIds) y datos estadísticos (totalPruneTokens)
- [ ] Las estadísticas "All-time" de `/dcp stats` provienen de la suma de todos los archivos persistidos
- [ ] Después de las operaciones de poda se guarda automáticamente de forma asíncrona, sin bloquear el flujo principal
- [ ] Al cambiar de sesión se carga automáticamente el estado histórico de esa sesión
- [ ] Al detectar un mensaje summary de OpenCode se limpia la caché de herramientas y el estado de poda

## Errores comunes

### ❌ Eliminar accidentalmente archivos persistidos

**Problema**: Eliminaste manualmente archivos en el directorio `~/.local/share/opencode/storage/plugin/dcp/`

**Consecuencias**:
- Se pierde el estado de poda histórico
- Las estadísticas acumuladas se reinician a cero
- Pero no afecta la función de poda de la sesión actual

**Solución**: Comienza de nuevo, DCP creará automáticamente nuevos archivos persistidos

### ❌ Estado de subagente no visible

**Problema**: Podaste herramientas en un subagente, pero al volver al agente principal no ves esos registros de poda

**Causa**: Los subagentes tienen un `sessionId` independiente, el estado de poda se persiste en un archivo separado. Pero al volver al agente principal, como el `sessionId` del agente principal es diferente, no se carga el estado persistido del subagente

**Solución**: Este es el comportamiento diseñado. El estado de la sesión del subagente es independiente y no se comparte con el agente principal. Si quieres estadísticas de todos los registros de poda (incluyendo subagentes), puedes usar las estadísticas "All-time" de `/dcp stats` (que suma los datos de todos los archivos persistidos)

### ❌ Fallo de guardado por espacio en disco insuficiente

**Problema**: Las estadísticas "All-time" de `/dcp stats` no aumentan

**Causa**: Posiblemente espacio en disco insuficiente, fallo de guardado

**Solución**: Revisa los archivos de log en `~/.config/opencode/logs/dcp/` para ver si hay errores "Failed to save session state"

## Resumen de la lección

**Valor central de la persistencia de estado**:

1. **Memoria entre sesiones**: Recordar qué herramientas ya fueron podadas, evitando trabajo duplicado
2. **Estadísticas acumuladas**: Seguimiento a largo plazo del efecto de ahorro de tokens de DCP
3. **Recuperación tras reinicio**: Continuar el trabajo anterior después de reiniciar OpenCode

**Resumen del flujo de datos**:

```
Operación de poda → Actualizar estado en memoria → Guardar asincrónicamente en disco
                ↑
Cambio de sesión → Cargar desde disco → Restaurar estado en memoria
                ↑
Compresión de contexto → Limpiar estado en memoria (sin eliminar archivos de disco)
```

**Puntos clave**:

- La persistencia es una operación de archivos locales, no afecta el rendimiento de poda
- "All-time" de `/dcp stats` proviene de la suma de todas las sesiones históricas
- Las sesiones de subagentes no se persisten, este es el comportamiento diseñado
- Al comprimir contexto se limpia la caché para garantizar consistencia de estado

## Próxima lección

> En la próxima lección aprenderemos sobre **[Impacto en Prompt Caching](/es/Opencode-DCP/opencode-dynamic-context-pruning/advanced/prompt-caching/)**.
>
> Aprenderás:
> - Cómo la poda de DCP afecta el Prompt Caching
> - Cómo equilibrar la tasa de aciertos de caché y el ahorro de tokens
> - Entender el mecanismo de facturación de caché de Anthropic

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver las ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Funcionalidad | Ruta del archivo | Líneas |
| --- | --- | --- |
| Definición de interfaz de persistencia | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 14-19 |
| Guardar estado de sesión | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 33-66 |
| Cargar estado de sesión | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 68-101 |
| Cargar estadísticas de todas las sesiones | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 109-146 |
| Constante del directorio de almacenamiento | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 21 |
| Inicialización del estado de sesión | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts) | 80-116 |
| Detección de compresión de contexto | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts) | 118-126 |
| Manejo del comando de estadísticas | [`lib/commands/stats.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/stats.ts) | 46-67 |
| Guardar estado de herramienta de poda | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts) | 144-150 |

**Constantes clave**:
- `STORAGE_DIR = ~/.local/share/opencode/storage/plugin/dcp`: Directorio raíz de almacenamiento de archivos persistidos

**Funciones clave**:
- `saveSessionState(state, logger)`: Guardar asincrónicamente el estado de sesión en disco
- `loadSessionState(sessionId, logger)`: Cargar el estado de una sesión específica desde disco
- `loadAllSessionStats(logger)`: Agregar datos estadísticos de todas las sesiones
- `ensureSessionInitialized(client, state, sessionId, logger, messages)`: Asegurar que la sesión esté inicializada, carga el estado persistido

**Interfaces clave**:
- `PersistedSessionState`: Definición de estructura del estado persistido
- `AggregatedStats`: Definición de estructura de datos estadísticos acumulados

</details>
