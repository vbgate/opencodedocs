---
title: "Tareas en Segundo Plano: Ejecución Paralela de Múltiples Agentes | oh-my-opencode"
sidebarTitle: "Múltiples IA Trabajando Juntas"
subtitle: "Tareas en Segundo Plano: Ejecución Paralela de Múltiples Agentes | oh-my-opencode"
description: "Aprende las capacidades de ejecución paralela del sistema de tareas en segundo plano de oh-my-opencode. Domina el control de concurrencia de tres niveles, gestión del ciclo de vida de tareas, uso de herramientas delegate_task y background_output."
tags:
  - "background-tasks"
  - "parallel-execution"
  - "concurrency"
prerequisite:
  - "start-sisyphus-orchestrator"
order: 80
---

# Tareas Paralelas en Segundo Plano: Trabajar como un Equipo

## Lo Que Podrás Hacer Después

- ✅ Iniciar múltiples tareas en segundo plano en paralelo, permitiendo que diferentes agentes de IA trabajen simultáneamente
- ✅ Configurar límites de concurrencia para evitar límites de API y costos descontrolados
- ✅ Obtener resultados de tareas en segundo plano sin esperar a que se completen
- ✅ Cancelar tareas para liberar recursos

## Tu Problema Actual

**¿Solo una persona trabajando?**

Imagina este escenario:
- Necesitas que el agente **Explore** busque la implementación de autenticación en el código
- Simultáneamente, que el agente **Librarian** investigue las mejores prácticas
- Y que el agente **Oracle** revise el diseño de la arquitectura

Si se ejecutan secuencialmente, tiempo total = 10 minutos + 15 minutos + 8 minutos = **33 minutos**

Pero, ¿y si se ejecutan en paralelo? 3 agentes trabajando simultáneamente, tiempo total = **max(10, 15, 8) = 15 minutos**, ahorrando **54%** del tiempo.

**Problema**: Por defecto, OpenCode solo puede procesar una sesión a la vez. Para lograr paralelismo, necesitas gestionar manualmente múltiples ventanas o esperar a que se completen las tareas.

**Solución**: El sistema de tareas en segundo plano de oh-my-opencode puede ejecutar múltiples agentes de IA simultáneamente y rastrear su progreso en segundo plano, permitiéndote continuar con otro trabajo.

## Cuándo Usar Esta Estrategia

Escenarios donde el sistema de tareas en segundo plano puede mejorar la eficiencia:

| Escenario | Ejemplo | Valor |
|-----------|---------|-------|
| **Investigación Paralela** | Explore busca implementación + Librarian consulta documentación | Completar investigación 3 veces más rápido |
| **Revisión Multi-experto** | Oracle revisa arquitectura + Momus valida plan | Obtener retroalimentación de múltiples perspectivas rápidamente |
| **Tareas Asíncronas** | Realizar revisión de código mientras se hace commit de Git | No bloquear el flujo principal |
| **Recursos Limitados** | Limitar concurrencia para evitar límites de API | Controlar costos y estabilidad |

::: tip Modo Ultrawork
Al agregar `ultrawork` o `ulw` al prompt, se activa automáticamente el modo de máximo rendimiento, incluyendo todos los agentes profesionales y tareas en segundo plano paralelas. No se requiere configuración manual.
:::

## 🎒 Preparativos Antes de Empezar

::: warning Prerrequisitos

Antes de comenzar este tutorial, asegúrate de:
1. Haber instalado oh-my-opencode (ver [Tutorial de Instalación](../../start/installation/))
2. Haber completado la configuración básica, con al menos un AI Provider disponible
3. Entender el uso básico del orquestador Sisyphus (ver [Tutorial de Sisyphus](../sisyphus-orchestrator/))

:::

## Conceptos Fundamentales

El funcionamiento del sistema de tareas en segundo plano se puede resumir en tres conceptos clave:

### 1. Ejecución Paralela

El sistema de tareas en segundo plano te permite iniciar múltiples tareas de agentes de IA simultáneamente, cada una ejecutándose en una sesión independiente. Esto significa:

- **Explore** busca código
- **Librarian** consulta documentación
- **Oracle** revisa diseño

Las tres tareas se ejecutan en paralelo, el tiempo total es igual a la tarea más lenta.

### 2. Control de Concurrencia

Para evitar iniciar demasiadas tareas simultáneamente causando límites de API o costos descontrolados, el sistema proporciona tres niveles de límites de concurrencia:

```
Prioridad: Model > Provider > Default

Configuración de ejemplo:
modelConcurrency:     claude-opus-4-5 → 2
providerConcurrency:  anthropic → 3
defaultConcurrency:   Todos → 5
```

**Reglas**:
- Si se especifica un límite de nivel model, se usa ese límite
- De lo contrario, si se especifica un límite de nivel provider, se usa ese límite
- De lo contrario, se usa el límite predeterminado (valor predeterminado 5)

### 3. Mecanismo de Sondeo

El sistema verifica el estado de las tareas cada 2 segundos, determinando si las tareas están completas. Condiciones de finalización:

- **Sesión idle** (evento session.idle)
- **Detección de estabilidad**: 3 sondeos consecutivos sin cambios en el número de mensajes
- **Lista TODO vacía**: todas las tareas están completas

## Sigue los Pasos

### Paso 1: Iniciar Tareas en Segundo Plano

Usa la herramienta `delegate_task` para iniciar tareas en segundo plano:

```markdown
Iniciar tareas en segundo plano en paralelo:

1. Explore busca implementación de autenticación
2. Librarian investiga mejores prácticas
3. Oracle revisa diseño de arquitectura

Ejecución paralela:
```

**Por Qué**
Este es el escenario de uso más clásico para demostrar tareas en segundo plano. Las 3 tareas pueden proceder simultáneamente, ahorrando tiempo significativamente.

**Lo Que Deberías Ver**
El sistema devolverá 3 IDs de tareas:

```
Background task launched successfully.

Task ID: bg_abc123
Session ID: sess_xyz789
Description: Explore: 查找认证实现
Agent: explore
Status: pending
...

Background task launched successfully.

Task ID: bg_def456
Session ID: sess_uvwx012
Description: Librarian: 研究最佳实践
Agent: librarian
Status: pending
...
```

::: info Explicación de Estados de Tarea
- **pending**: en cola esperando un slot de concurrencia
- **running**: en ejecución
- **completed**: completada
- **error**: con error
- **cancelled**: cancelada
:::

### Paso 2: Verificar Estado de Tarea

Usa la herramienta `background_output` para ver el estado de la tarea:

```markdown
Ver estado de bg_abc123:
```

**Por Qué**
Saber si la tarea está completa o aún en ejecución. Por defecto no espera, devuelve el estado inmediatamente.

**Lo Que Deberías Ver**
Si la tarea aún está en ejecución:

```
## Task Status

| Field | Value |
|-------|-------|
| Task ID | `bg_abc123` |
| Description | Explore: 查找认证实现 |
| Agent | explore |
| Status | **running** |
| Duration | 2m 15s |
| Session ID | `sess_xyz789` |

> **Note**: No need to wait explicitly - system will notify you when this task completes.

## Original Prompt

查找 src/auth 目录下的认证实现，包括登录、注册、Token 管理等
```

Si la tarea está completada:

```
Task Result

Task ID: bg_abc123
Description: Explore: 查找认证实现
Duration: 5m 32s
Session ID: sess_xyz789

---

找到了 3 个认证实现：
1. `src/auth/login.ts` - JWT 认证
2. `src/auth/register.ts` - 用户注册
3. `src/auth/token.ts` - Token 刷新
...
```

### Paso 3: Configurar Control de Concurrencia

Edita `~/.config/opencode/oh-my-opencode.json`:

```jsonc
{
  "$schema": "https://code-yeongyu.github.io/oh-my-opencode/schema.json",

  "background_task": {
    // Límite de concurrencia a nivel Provider (configuración recomendada)
    "providerConcurrency": {
      "anthropic": 3,     // Máximo 3 modelos Anthropic simultáneos
      "openai": 2,         // Máximo 2 modelos OpenAI simultáneos
      "google": 2          // Máximo 2 modelos Google simultáneos
    },

    // Límite de concurrencia a nivel Model (prioridad más alta)
    "modelConcurrency": {
      "claude-opus-4-5": 2,    // Máximo 2 Opus 4.5 simultáneos
      "gpt-5.2": 2              // Máximo 2 GPT 5.2 simultáneos
    },

    // Límite de concurrencia predeterminado (usado cuando no se configura lo anterior)
    "defaultConcurrency": 3
  }
}
```

**Por Qué**
El control de concurrencia es clave para evitar costos descontrolados. Si no estableces límites, iniciar 10 tareas de Opus 4.5 simultáneamente podría consumir instantáneamente una gran cantidad de cuota de API.

::: tip Configuración Recomendada
Para la mayoría de escenarios, se recomienda:
- `providerConcurrency.anthropic: 3`
- `providerConcurrency.openai: 2`
- `defaultConcurrency: 5`
:::

**Lo Que Deberías Ver**
Después de que la configuración surta efecto, al iniciar tareas en segundo plano:
- Si se alcanza el límite de concurrencia, las tareas entrarán en estado **pending** en cola
- Una vez que se completa una tarea, las tareas en cola se iniciarán automáticamente

### Paso 4: Cancelar Tareas

Usa la herramienta `background_cancel` para cancelar tareas:

```markdown
Cancelar todas las tareas en segundo plano:
```

**Por Qué**
A veces las tareas se bloquean o ya no son necesarias, puedes cancelarlas activamente para liberar recursos.

**Lo Que Deberías Ver**

```
Cancelled 3 background task(s):

| Task ID | Description | Status | Session ID |
|---------|-------------|--------|------------|
| `bg_abc123` | Explore: 查找认证实现 | running | `sess_xyz789` |
| `bg_def456` | Librarian: 研究最佳实践 | running | `sess_uvwx012` |
| `bg_ghi789` | Oracle: 审查架构设计 | pending | (not started) |

## Continue Instructions

To continue a cancelled task, use:

    delegate_task(session_id="<session_id>", prompt="Continue: <your follow-up>")

Continuable sessions:
- `sess_xyz789` (Explore: 查找认证实现)
- `sess_uvwx012` (Librarian: 研究最佳实践)
```

## Punto de Control ✅

Confirma que entiendes los siguientes puntos:

- [ ] Puedes iniciar múltiples tareas en segundo plano en paralelo
- [ ] Entiendes los estados de tarea (pending, running, completed)
- [ ] Has configurado límites de concurrencia razonables
- [ ] Puedes ver y obtener resultados de tareas
- [ ] Puedes cancelar tareas innecesarias

## Advertencias Comunes

### Problema 1: Olvidar Configurar Límites de Concurrencia

**Síntoma**: Se inician demasiadas tareas, la cuota de API se agota instantáneamente o se alcanza el Rate Limit.

**Solución**: Configura `providerConcurrency` o `defaultConcurrency` en `oh-my-opencode.json`.

### Problema 2: Verificar Resultados con Demasiada Frecuencia

**Síntoma**: Llamar a `background_output` cada pocos segundos para verificar el estado de la tarea, aumentando gastos innecesarios.

**Solución**: El sistema te notificará automáticamente cuando se complete la tarea. Solo verifica manualmente cuando realmente necesites resultados intermedios.

### Problema 3: Tiempo de Espera de Tarea

**Síntoma**: La tarea se cancela automáticamente después de ejecutarse por más de 30 minutos.

**Causa**: Las tareas en segundo plano tienen un TTL (tiempo de espera) de 30 minutos.

**Solución**: Si necesitas tareas de larga duración, considera dividirlas en múltiples subtareas, o usa `delegate_task(background=false)` para ejecutar en primer plano.

### Problema 4: Tareas Pending Nunca Se Inician

**Síntoma**: El estado de la tarea siempre es `pending`, nunca entra en `running`.

**Causa**: El límite de concurrencia está lleno, no hay slots disponibles.

**Solución**:
- Esperar a que se completen las tareas existentes
- Aumentar la configuración de límite de concurrencia
- Cancelar tareas innecesarias para liberar slots

## Resumen de la Lección

El sistema de tareas en segundo plano te permite trabajar como un equipo real, con múltiples agentes de IA ejecutando tareas en paralelo:

1. **Iniciar tareas paralelas**: usar herramienta `delegate_task`
2. **Controlar concurrencia**: configurar `providerConcurrency`, `modelConcurrency`, `defaultConcurrency`
3. **Obtener resultados**: usar herramienta `background_output` (el sistema notificará automáticamente)
4. **Cancelar tareas**: usar herramienta `background_cancel`

**Reglas Clave**:
- Sondeo del estado de tarea cada 2 segundos
- Tarea completada después de 3 estabilizaciones consecutivas o idle
- Las tareas se agotan automáticamente después de 30 minutos
- Prioridad: modelConcurrency > providerConcurrency > defaultConcurrency

## Próxima Lección

> En la próxima lección aprenderemos **[LSP y AST-Grep: Herramientas de Refactorización de Código](../lsp-ast-tools/)**.
>
> Aprenderás:
> - Cómo usar herramientas LSP para navegación y refactorización de código
> - Cómo usar AST-Grep para búsqueda y reemplazo de patrones precisos
> - Mejores prácticas para el uso combinado de LSP y AST-Grep

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones del código fuente</strong></summary>

> Última actualización: 2026-01-26

| Función | Ruta del Archivo | Líneas |
|----------|------------------|--------|
| Gestor de tareas en segundo plano | [`src/features/background-agent/manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/manager.ts) | 1-1378 |
| Control de concurrencia | [`src/features/background-agent/concurrency.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/concurrency.ts) | 1-138 |
| Herramienta delegate_task | [`src/tools/background-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/background-task/tools.ts) | 51-119 |
| Herramienta background_output | [`src/tools/background-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/blob/main/src/tools/background-task/tools.ts) | 320-384 |
| Herramienta background_cancel | [`src/tools/background-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/background-task/tools.ts) | 386-514 |

**Constantes Clave**:
- `TASK_TTL_MS = 30 * 60 * 1000`: tiempo de espera de tarea (30 minutos)
- `MIN_STABILITY_TIME_MS = 10 * 1000`: tiempo de inicio de detección de estabilidad (10 segundos)
- `DEFAULT_STALE_TIMEOUT_MS = 180_000`: tiempo de espera predeterminado (3 minutos)
- `MIN_IDLE_TIME_MS = 5000`: tiempo mínimo para ignorar idle temprano (5 segundos)

**Clases Clave**:
- `BackgroundManager`: gestor de tareas en segundo plano, responsable de iniciar, rastrear, sondear, completar tareas
- `ConcurrencyManager`: gestor de control de concurrencia, implementa tres niveles de prioridad (model > provider > default)

**Funciones Clave**:
- `BackgroundManager.launch()`: iniciar tarea en segundo plano
- `BackgroundManager.pollRunningTasks()`: sondear estado de tareas cada 2 segundos (línea 1182)
- `BackgroundManager.tryCompleteTask()`: completar tarea de forma segura, prevenir condiciones de carrera (línea 909)
- `ConcurrencyManager.getConcurrencyLimit()`: obtener límite de concurrencia (línea 24)
- `ConcurrencyManager.acquire()` / `ConcurrencyManager.release()`: obtener/liberar slot de concurrencia (líneas 41, 71)

</details>
