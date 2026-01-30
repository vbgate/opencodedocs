---
title: "Ganchos de Ciclo de Vida: Contexto Automatizado y Control de Calidad | oh-my-opencode"
sidebarTitle: "Haz los Agentes Más Inteligentes"
subtitle: "Ganchos de Ciclo de Vida: Contexto Automatizado y Control de Calidad"
description: "Aprende el sistema de ganchos de ciclo de vida de oh-my-opencode. Domina las funcionalidades principales como inyección automática de AGENTS.md, cumplimiento forzoso de TODO, truncamiento de salida y detección de palabras clave."
tags:
  - "lifecycle-hooks"
  - "context-injection"
  - "quality-control"
prerequisite:
  - "start-sisyphus-orchestrator"
order: 120
---

# Ganchos de Ciclo de Vida: Contexto Automatizado y Control de Calidad

## Lo Que Aprenderás en Esta Lección

- Inyectar automáticamente contexto de proyecto a los agentes de IA (AGENTS.md, README.md)
- Prevenir que los agentes dejen tareas a medio terminar, forzando la finalización de listas TODO
- Truncar automáticamente salidas de herramientas demasiado grandes, evitando el desbordamiento de la ventana de contexto
- Habilitar el modo Ultrawork para activar todos los agentes especializados con un solo clic
- Personalizar configuraciones de ganchos para deshabilitar funciones que no necesitas

## La Situación en la que Te Encuentras

¿Has experimentado alguno de estos problemas?

- ¿Los agentes de IA siempre olvidan las especificaciones del proyecto y repiten errores?
- ¿El agente se detiene a mitad de camino sin terminar la lista TODO?
- ¿La búsqueda en la base de código produce salidas tan grandes que hacen estallar la ventana de contexto?
- ¿Tienes que decirle manualmente al agente qué modo de trabajo usar cada vez?

## Cuándo Usar Esta Técnica

Los ganchos de ciclo de vida son adecuados para los siguientes escenarios:

::: tip Escenarios Típicos
- **Gestión de contexto de proyecto**: Inyección automática de AGENTS.md y README.md
- **Control de calidad**: Verificación de comentarios de código, validación de bloques de pensamiento
- **Continuidad de tareas**: Forzar a los agentes a completar todas las tareas TODO
- **Optimización de rendimiento**: Truncamiento dinámico de salidas, gestión de ventana de contexto
- **Automatización de flujos de trabajo**: Palabras clave para activar modos, ejecución automática de comandos
:::

## La Idea Central

### ¿Qué Son los Ganchos de Ciclo de Vida?

**Los ganchos de ciclo de vida** son un mecanismo impulsado por eventos que te permite insertar lógica personalizada en puntos clave del trabajo del agente. Por ejemplo, inyectar automáticamente documentación de proyecto, forzar la finalización de tareas TODO, o truncar salidas excesivamente grandes. Estos ganchos escuchan 4 tipos de eventos: antes de ejecutar una herramienta, después de ejecutar una herramienta, cuando el usuario envía un mensaje, y cuando la sesión está inactiva. Al configurar ganchos razonablemente, puedes hacer que los agentes de IA sean más inteligentes y se ajusten mejor a tus hábitos de trabajo.

::: info Ganchos vs Middleware
Los ganchos son muy similares al middleware de frameworks web, ambos son mecanismos de "hacer cosas específicas en momentos específicos". La diferencia está en:
- **Middleware**: Ejecución lineal, puede interrumpir la petición
- **Ganchos**: Impulsado por eventos, no puede interrumpir, solo puede modificar datos
:::

### 32 Ganchos, 7 Categorías Principales

oh-my-opencode proporciona 32 ganchos integrados, divididos en 7 categorías principales:

| Categoría | Número de Ganchos | Función Principal |
|--- | --- | ---|
| **Inyección de Contexto** | 4 | Inyección automática de documentación de proyecto, reglas |
| **Productividad y Control** | 6 | Detección de palabras clave, cambio de modo, gestión de bucles |
| **Calidad y Seguridad** | 4 | Verificación de comentarios de código, validación de bloques de pensamiento |
| **Recuperación y Estabilidad** | 3 | Recuperación de sesión, manejo de errores |
| **Truncamiento y Gestión de Contexto** | 2 | Truncamiento de salida, monitoreo de ventana |
| **Notificaciones y UX** | 3 | Actualizaciones de versión, notificaciones de tareas en segundo plano, recordatorios de inactividad |
| **Gestión de Tareas** | 2 | Recuperación de tareas, reintento de delegación |

## Tipos de Eventos de Ganchos

Los ganchos escuchan los siguientes 4 tipos de eventos:

### 1. PreToolUse (Antes de Ejecutar Herramienta)

**Momento de Activación**: Antes de que el agente llame a una herramienta

**Qué Puede Hacer**:
- Prevenir la ejecución de la herramienta
- Modificar parámetros de la herramienta
- Inyectar contexto

**Ganchos de Ejemplo**: `comment-checker`, `directory-agents-injector`

### 2. PostToolUse (Después de Ejecutar Herramienta)

**Momento de Activación**: Después de que la herramienta se ejecuta

**Qué Puede Hacer**:
- Modificar la salida de la herramienta
- Agregar mensajes de advertencia
- Inyectar instrucciones posteriores

**Ganchos de Ejemplo**: `tool-output-truncator`, `directory-readme-injector`

### 3. UserPromptSubmit (Cuando el Usuario Envía Mensaje)

**Momento de Activación**: Cuando el usuario envía un mensaje a la sesión

**Qué Puede Hacer**:
- Prevenir el envío (raro)
- Modificar el contenido del mensaje
- Inyectar mensajes del sistema
- Activar modos de trabajo

**Ganchos de Ejemplo**: `keyword-detector`, `auto-slash-command`

### 4. Stop (Cuando la Sesión Está Inactiva)

**Momento de Activación**: Cuando el agente deja de trabajar y la sesión entra en estado inactivo

**Qué Puede Hacer**:
- Inyectar mensajes posteriores
- Enviar notificaciones
- Verificar el estado de las tareas

**Ganchos de Ejemplo**: `todo-continuation-enforcer`, `session-notification`

