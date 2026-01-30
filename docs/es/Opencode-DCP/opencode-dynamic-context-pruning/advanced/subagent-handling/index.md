---
title: "Manejo de Subagentes: Mecanismo de Desactivación Automática | opencode-dynamic-context-pruning"
subtitle: "Manejo de Subagentes: Mecanismo de Desactivación Automática"
sidebarTitle: "¿Los subagentes no se recortan? Así es como funciona"
description: "Aprende sobre el comportamiento y las limitaciones de DCP en sesiones de subagentes. Comprende por qué DCP desactiva automáticamente el recorte de subagentes y las diferentes estrategias de uso de tokens entre subagentes y agentes principales."
tags:
  - "Subagente"
  - "Gestión de sesiones"
  - "Límites de uso"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 4
---

# Manejo de Subagentes

## Lo que podrás hacer después de este curso

- Comprender por qué DCP se desactiva automáticamente en sesiones de subagentes
- Conocer las diferentes estrategias de uso de tokens entre subagentes y agentes principales
- Evitar problemas causados por el uso de funciones DCP en subagentes

## Tu situación actual

Quizás has notado que en algunas conversaciones de OpenCode, la función de recorte de DCP parece "no funcionar": las llamadas a herramientas no se limpian, y las estadísticas de ahorro de tokens no cambian. Esto puede ocurrir cuando usas ciertas funciones específicas de OpenCode, como revisión de código, análisis profundo, etc.

No es que DCP tenga problemas, sino que estas funciones utilizan el mecanismo de **subagente (Subagent)**, y DCP tiene un manejo especial para los subagentes.

## Qué es un subagente

::: info ¿Qué es un subagente (Subagent)?

Un **subagente** es un mecanismo interno de IA de OpenCode. El agente principal delega tareas complejas a un subagente para su procesamiento, y el subagente devuelve los resultados en forma de resumen.

**Escenarios de uso típicos**:
- Revisión de código: el agente principal inicia un subagente, que lee cuidadosamente múltiples archivos, analiza problemas y luego devuelve una lista concisa de problemas
- Análisis profundo: el agente principal inicia un subagente, que realiza numerosas llamadas a herramientas y razonamientos, y finalmente devuelve los hallazgos principales

Desde una perspectiva técnica, una sesión de subagente tiene una propiedad `parentID` que apunta a su sesión principal.
:::

## Comportamiento de DCP con subagentes

DCP **deshabilita automáticamente todas las funciones de recorte** en sesiones de subagentes.

### ¿Por qué DCP no recorta subagentes?

Hay un principio de diseño importante detrás de esto:

| Rol | Estrategia de uso de tokens | Objetivo principal |
| --- | --- | --- |
| **Agente principal** | Uso eficiente de tokens necesario | Mantener contexto en conversaciones largas, reducir costos |
| **Subagente** | Uso libre de tokens permitido | Generar información rica, facilitar resumen del agente principal |

**El valor del subagente** radica en su capacidad para "gastar tokens por calidad de información": mediante numerosas llamadas a herramientas y análisis detallados, proporciona al agente padre un resumen de alta calidad. Si DCP recortara las llamadas a herramientas en el subagente, podría ocurrir:

1. **Pérdida de información**: el proceso de análisis detallado del subagente se elimina, impidiendo la generación de un resumen completo
2. **Calidad de resumen reducida**: el agente principal recibe un resumen incompleto, afectando la calidad de la decisión final
3. **Violación del objetivo de diseño**: el subagente está diseñado específicamente para "no escatimar tokens por calidad"

**Conclusión**: los subagentes no necesitan recorte porque finalmente solo devuelven un resumen conciso al agente principal.

### Cómo detecta DCP los subagentes

DCP detecta si la sesión actual es un subagente mediante los siguientes pasos:

```typescript
// lib/state/utils.ts:1-8
export async function isSubAgentSession(client: any, sessionID: string): Promise<boolean> {
    try {
        const result = await client.session.get({ path: { id: sessionID } })
        return !!result.data?.parentID  // Si tiene parentID, es subagente
    } catch (error: any) {
        return false
    }
}
```

**Momento de detección**:
- Cuando se inicializa la sesión (`ensureSessionInitialized()`)
- Antes de cada transformación de mensaje (`createChatMessageTransformHandler()`)

### Comportamiento de DCP en sesiones de subagentes

Una vez que DCP detecta un subagente, omite las siguientes funciones:

| Función | Sesión normal | Sesión subagente | Ubicación de omisión |
| --- | --- | --- | --- |
| Inyección de prompt del sistema | ✅ Ejecuta | ❌ Omite | `hooks.ts:26-28` |
| Estrategia de recorte automático | ✅ Ejecuta | ❌ Omite | `hooks.ts:64-66` |
| Inyección de lista de herramientas | ✅ Ejecuta | ❌ Omite | `hooks.ts:64-66` |

**Implementación de código** (`lib/hooks.ts`):

```typescript
// Procesador de prompts del sistema
export function createSystemPromptHandler(state: SessionState, ...) {
    return async (_input: unknown, output: { system: string[] }) => {
        if (state.isSubAgent) {  // ← Detección de subagente
            return               // ← Retorno directo, no inyecta descripción de herramienta de recorte
        }
        // ... Lógica normal
    }
}

// Procesador de transformación de mensajes
export function createChatMessageTransformHandler(...) {
    return async (input: {}, output: { messages: WithParts[] }) => {
        await checkSession(client, state, logger, output.messages)

        if (state.isSubAgent) {  // ← Detección de subagente
            return               // ← Retorno directo, no ejecuta ningún recorte
        }

        // ... Lógica normal: deduplicación, sobrescritura, limpieza de errores, inyección de lista de herramientas, etc.
    }
}
```

## Comparación de casos prácticos

### Caso 1: Sesión del agente principal

**Escenario**: Estás conversando con el agente principal, solicitándole que analice código

**Comportamiento de DCP**:
```
Entrada del usuario: "Analiza las funciones de utilidad en src/utils.ts"
    ↓
[Agente principal] Lee src/utils.ts
    ↓
[Agente principal] Analiza el código
    ↓
Entrada del usuario: "Revisa también src/helpers.ts"
    ↓
DCP detecta un patrón de lectura repetida
    ↓
DCP marca la primera lectura de src/utils.ts como recortable ✅
    ↓
Cuando se envía el contexto al LLM, el contenido de la primera lectura se reemplaza por un marcador de posición
    ↓
✅ Ahorro de tokens
```

### Caso 2: Sesión del subagente

**Escenario**: El agente principal inicia un subagente para realizar una revisión profunda del código

**Comportamiento de DCP**:
```
Entrada del usuario: "Revisa en profundidad todos los archivos en src/"
    ↓
[Agente principal] Detecta una tarea compleja, inicia un subagente
    ↓
[Subagente] Lee src/utils.ts
    ↓
[Subagente] Lee src/helpers.ts
    ↓
[Subagente] Lee src/config.ts
    ↓
[Subagente] Lee más archivos...
    ↓
DCP detecta una sesión de subagente
    ↓
DCP omite todas las operaciones de recorte ❌
    ↓
[Subagente] Genera resultados de revisión detallados
    ↓
[Subagente] Devuelve un resumen conciso al agente principal
    ↓
[Agente principal] Genera la respuesta final basada en el resumen
```

## Preguntas frecuentes

### P: ¿Cómo confirmar que la sesión actual es un subagente?

**R**: Puedes confirmarlo de las siguientes maneras:

1. **Revisar los logs de DCP** (si el modo debug está activado):
   ```
   2026-01-23T10:30:45.123Z INFO state: session ID = abc-123
   2026-01-23T10:30:45.124Z INFO state: isSubAgent = true
   ```

2. **Observar las características de la conversación**:
   - Los subagentes generalmente se inician al procesar tareas complejas (como análisis profundo, revisión de código)
   - El agente principal mostrará mensajes como "Iniciando subagente" o similares

3. **Usar el comando /dcp stats**:
   - En sesiones de subagente, las llamadas a herramientas no se recortan
   - Las estadísticas de tokens mostrarán 0 en "recortado"

### P: Si los subagentes no se recortan en absoluto, ¿no es un desperdicio de tokens?

**R**: No. Las razones son las siguientes:

1. **Los subagentes son de corta duración**: El subagente termina después de completar su tarea, a diferencia del agente principal que mantiene conversaciones largas
2. **Los subagentes devuelven resúmenes**: Lo que finalmente se transmite al agente principal es un resumen conciso, que no aumenta la carga del contexto del agente principal
3. **Los objetivos de diseño son diferentes**: El propósito del subagente es "usar tokens para obtener calidad", no "ahorrar tokens"

### P: ¿Se puede forzar a DCP a recortar subagentes?

**R**: **No, y no debería**. DCP está diseñado para permitir que los subagentes conserven completamente el contexto y generen resúmenes de alta calidad. Si se forzara el recorte, podría ocurrir:

- La información del resumen estaría incompleta
- Se vería afectada la calidad de las decisiones del agente principal
- Se violaría la filosofía de diseño de subagentes de OpenCode

### P: ¿El uso de tokens en sesiones de subagentes se cuenta en las estadísticas?

**R**: Las sesiones de subagentes en sí no son rastreadas por DCP. Las estadísticas de DCP solo rastrean el ahorro de tokens en sesiones del agente principal.

## Resumen de esta lección

- **Detección de subagentes**: DCP identifica sesiones de subagentes verificando `session.parentID`
- **Deshabilitación automática**: En sesiones de subagentes, DCP automáticamente omite todas las funciones de recorte
- **Razón de diseño**: Los subagentes necesitan contexto completo para generar resúmenes de alta calidad; el recorte interferiría con este proceso
- **Límites de uso**: Los subagentes no buscan eficiencia de tokens, sino calidad de información, lo cual difiere del objetivo del agente principal

## Próxima lección

> En la próxima lección aprenderemos **[Preguntas Frecuentes y Solución de Problemas](/es/Opencode-DCP/opencode-dynamic-context-pruning/faq/troubleshooting/)**.
>
> Aprenderás:
> - Cómo corregir errores de configuración
> - Cómo habilitar los logs de depuración
> - Causas comunes por las que los tokens no se reducen
> - Limitaciones de las sesiones de subagentes

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Función | Ruta del archivo | Líneas |
| --- | --- | --- |
| Función de detección de subagentes | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts) | 1-8 |
| Inicialización del estado de sesión | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts) | 80-116 |
| Procesador de prompts del sistema (omite subagentes) | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts) | 26-28 |
| Procesador de transformación de mensajes (omite subagentes) | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts) | 64-66 |
| Definición del tipo SessionState | [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts) | 27-38 |

**Funciones clave**:
- `isSubAgentSession()`: Detecta subagentes mediante `session.parentID`
- `ensureSessionInitialized()`: Detecta subagentes al inicializar el estado de la sesión
- `createSystemPromptHandler()`: Las sesiones de subagentes omiten la inyección de prompts del sistema
- `createChatMessageTransformHandler()`: Las sesiones de subagentes omiten todas las operaciones de recorte

**Constantes clave**:
- `state.isSubAgent`: Indicador de subagente en el estado de la sesión

</details>
