---
title: "Agentes de IA: Conoce a los 10 Expertos | oh-my-opencode"
sidebarTitle: "Conoce a los 10 Expertos de IA"
subtitle: "Agentes de IA: Presentación de los 10 Expertos"
description: "Aprende sobre los 10 agentes de IA de oh-my-opencode. Selecciona el agente adecuado según el tipo de tarea para lograr colaboración eficiente y ejecución paralela."
tags:
  - "ai-agents"
  - "orchestration"
prerequisite:
  - "start-sisyphus-orchestrator"
order: 60
---

# Equipo de Agentes de IA: Presentación de los 10 Expertos

## Lo que Aprenderás

- Comprender las responsabilidades y especialidades de los 10 agentes de IA integrados
- Seleccionar rápidamente el agente más adecuado según el tipo de tarea
- Entender los mecanismos de colaboración entre agentes (delegación, paralelismo, revisión)
- Dominar las restricciones de permisos y escenarios de uso de cada agente

## Concepto Central: Colaboración como un Equipo Real

La idea central de **oh-my-opencode** es: **no trates a la IA como un asistente todopoderoso, sino como un equipo profesional**.

En un equipo de desarrollo real, necesitas:
- **Orquestador Principal** (Tech Lead): Responsable de planificación, asignación de tareas y seguimiento del progreso
- **Consultor de Arquitectura** (Architect): Proporciona decisiones técnicas y recomendaciones de diseño arquitectónico
- **Revisor de Código** (Reviewer): Verifica la calidad del código e identifica problemas potenciales
- **Experto en Investigación** (Researcher): Busca documentación, implementaciones de código abierto y mejores prácticas
- **Detective de Código** (Searcher): Localiza código rápidamente, encuentra referencias y comprende implementaciones existentes
- **Diseñador Frontend** (Frontend Designer): Diseña UI y ajusta estilos
- **Experto en Git** (Git Master): Realiza commits, gestiona ramas y busca en el historial

oh-my-opencode convierte estos roles en 10 agentes de IA especializados que puedes combinar flexiblemente según el tipo de tarea.

## Los 10 Agentes en Detalle

### Orquestadores Principales (2)

#### Sisyphus - Orquestador Principal

**Rol**: Orquestador principal, tu líder técnico principal

**Capacidades**:
- Razonamiento profundo (32k thinking budget)
- Planificación y delegación de tareas complejas
- Ejecución de modificaciones y refactorizaciones de código
- Gestión de todo el flujo de desarrollo

**Modelo Recomendado**: `anthropic/claude-opus-4-5` (temperature: 0.1)

**Escenarios de Uso**:
- Tareas de desarrollo diarias (nuevas funcionalidades, corrección de bugs)
- Problemas complejos que requieren razonamiento profundo
- Descomposición y ejecución de tareas de múltiples pasos
- Escenarios que requieren delegación paralela a otros agentes

**Cómo Invocarlo**:
- Agente principal por defecto (selecciona "Sisyphus" en el selector de agentes de OpenCode)
- Ingresa la tarea directamente en el prompt, sin palabras clave especiales

**Permisos**: Permisos completos de herramientas (write, edit, bash, delegate_task, etc.)

---

#### Atlas - Gestor de TODO

**Rol**: Orquestador principal, enfocado en gestión de listas TODO y seguimiento de ejecución de tareas

**Capacidades**:
- Gestión y seguimiento de listas TODO
- Ejecución sistemática de planes
- Monitoreo del progreso de tareas

**Modelo Recomendado**: `anthropic/claude-opus-4-5` (temperature: 0.1)

**Escenarios de Uso**:
- Iniciar ejecución de proyectos con el comando `/start-work`
- Cuando necesitas completar tareas siguiendo estrictamente un plan
- Seguimiento sistemático del progreso de tareas

**Cómo Invocarlo**:
- Usa el comando slash `/start-work`
- Activación automática a través del Atlas Hook

**Permisos**: Permisos completos de herramientas

---

### Consultores y Revisores (3)

#### Oracle - Consultor Estratégico

**Rol**: Consultor técnico de solo lectura, experto en razonamiento de alto nivel

**Capacidades**:
- Recomendaciones de decisiones arquitectónicas
- Diagnóstico de problemas complejos
- Revisión de código (solo lectura)
- Análisis de compensaciones entre múltiples sistemas

**Modelo Recomendado**: `openai/gpt-5.2` (temperature: 0.1)

**Escenarios de Uso**:
- Diseño de arquitectura compleja
- Auto-revisión después de completar trabajo importante
- Depuración difícil después de 2+ intentos fallidos de corrección
- Patrones de código o arquitecturas desconocidas
- Problemas relacionados con seguridad/rendimiento

**Condiciones de Activación**:
- Incluye `@oracle` en el prompt o usa `delegate_task(agent="oracle")`
- Recomendación automática durante decisiones arquitectónicas complejas

**Restricciones**: Permisos de solo lectura (prohibido write, edit, task, delegate_task)

**Principios Fundamentales**:
- **Minimalismo**: Preferencia por las soluciones más simples
- **Aprovechar recursos existentes**: Priorizar modificación del código actual, evitar introducir nuevas dependencias
- **Experiencia del desarrollador primero**: Legibilidad y mantenibilidad > rendimiento teórico
- **Un solo camino claro**: Proporcionar una recomendación principal, solo ofrecer alternativas cuando las diferencias de compensación son significativas

---

#### Metis - Analista de Pre-planificación

**Rol**: Experto en análisis de requisitos y evaluación de riesgos antes de la planificación

**Capacidades**:
- Identificar requisitos ocultos y requerimientos no especificados
- Detectar ambigüedades que podrían causar fallos de IA
- Señalar patrones potenciales de AI-slop (sobre-ingeniería, scope creep)
- Preparar instrucciones para agentes de planificación

**Modelo Recomendado**: `anthropic/claude-sonnet-4-5` (temperature: 0.3)

**Escenarios de Uso**:
- Antes de la planificación de Prometheus
- Cuando las solicitudes del usuario son vagas o abiertas
- Prevenir patrones de sobre-ingeniería de IA

**Cómo Invocarlo**: Invocación automática por Prometheus (modo entrevista)

**Restricciones**: Permisos de solo lectura (prohibido write, edit, task, delegate_task)

**Flujo Principal**:
1. **Clasificación de Intención**: Refactorización / Construcción desde cero / Tarea mediana / Colaboración / Arquitectura / Investigación
2. **Análisis Específico por Intención**: Proporcionar recomendaciones específicas según el tipo
3. **Generación de Preguntas**: Generar preguntas claras para el usuario
4. **Preparación de Instrucciones**: Generar instrucciones claras "MUST" y "MUST NOT" para Prometheus

---

#### Momus - Revisor de Planes

**Rol**: Experto estricto en revisión de planes, encuentra todas las omisiones y ambigüedades

**Capacidades**:
- Validar claridad, verificabilidad y completitud del plan
- Verificar todas las referencias de archivos y contexto
- Simular pasos de implementación real
- Identificar omisiones críticas

**Modelo Recomendado**: `anthropic/claude-sonnet-4-5` (temperature: 0.1)

**Escenarios de Uso**:
- Después de que Prometheus crea un plan de trabajo
- Antes de ejecutar listas TODO complejas
- Validar la calidad del plan

**Cómo Invocarlo**: Invocación automática por Prometheus

**Restricciones**: Permisos de solo lectura (prohibido write, edit, task, delegate_task)

**Cuatro Criterios de Revisión**:
1. **Claridad del Contenido de Trabajo**: ¿Cada tarea especifica una fuente de referencia?
2. **Criterios de Verificación y Aceptación**: ¿Hay métodos específicos de verificación de éxito?
3. **Completitud del Contexto**: ¿Se proporciona suficiente contexto (umbral de confianza del 90%)?
4. **Comprensión General**: ¿El desarrollador entiende el POR QUÉ, QUÉ y CÓMO?

**Principio Fundamental**: **Revisor de documentación, no consultor de diseño**. Evalúa si "el plan es lo suficientemente claro para ejecutar", no si "el enfoque elegido es correcto".

---

### Investigación y Exploración (3)

#### Librarian - Experto en Investigación Multi-repositorio

**Rol**: Experto en comprensión de bases de código open source, especializado en encontrar documentación y ejemplos de implementación

**Capacidades**:
- GitHub CLI: Clonar repositorios, buscar issues/PRs, ver historial
- Context7: Consultar documentación oficial
- Web Search: Buscar información actualizada
- Generar evidencia con enlaces permanentes

**Modelo Recomendado**: `opencode/big-pickle` (temperature: 0.1)

**Escenarios de Uso**:
- "¿Cómo uso [biblioteca]?"
- "¿Cuáles son las mejores prácticas para [característica del framework]?"
- "¿Por qué [dependencia externa] se comporta así?"
- "Encontrar ejemplos de uso de [biblioteca]"

**Condiciones de Activación**:
- Activación automática al mencionar bibliotecas/fuentes externas
- Incluye `@librarian` en el prompt

**Clasificación de Tipos de Solicitud**:
- **Tipo A (Conceptual)**: "¿Cómo hacer X?", "Mejores prácticas"
- **Tipo B (Referencia de Implementación)**: "¿Cómo implementa X a Y?", "Mostrar código fuente de Z"
- **Tipo C (Contexto e Historial)**: "¿Por qué se hizo este cambio?", "¿Historial de X?"
- **Tipo D (Investigación Integral)**: Solicitudes complejas/ambiguas

**Restricciones**: Permisos de solo lectura (prohibido write, edit, task, delegate_task, call_omo_agent)

**Requisito Obligatorio**: Todas las declaraciones de código deben incluir enlaces permanentes de GitHub

---

#### Explore - Experto en Exploración Rápida de Código

**Rol**: Experto en búsqueda de código con conciencia de contexto

**Capacidades**:
- Herramientas LSP: Definiciones, referencias, navegación de símbolos
- AST-Grep: Búsqueda de patrones estructurales
- Grep: Búsqueda de patrones de texto
- Glob: Coincidencia de patrones de nombres de archivo
- Ejecución paralela (3+ herramientas simultáneamente)

**Modelo Recomendado**: `opencode/gpt-5-nano` (temperature: 0.1)

**Escenarios de Uso**:
- Búsquedas amplias que requieren 2+ ángulos de búsqueda
- Estructuras de módulos desconocidas
- Descubrimiento de patrones entre capas
- Encontrar "¿Dónde está X?", "¿Qué archivo tiene Y?"

**Condiciones de Activación**:
- Activación automática cuando involucra 2+ módulos
- Incluye `@explore` en el prompt

**Formato de Salida Obligatorio**:
```
<analysis>
**Literal Request**: [Solicitud literal del usuario]
**Actual Need**: [Lo que realmente se necesita]
**Success Looks Like**: [Cómo debería verse el éxito]
</analysis>

<results>
<files>
- /absolute/path/to/file1.ts — [Por qué este archivo es relevante]
- /absolute/path/to/file2.ts — [Por qué este archivo es relevante]
</files>

<answer>
[Respuesta directa a la necesidad real]
</answer>

<next_steps>
[Qué hacer a continuación]
</next_steps>
</results>
```

**Restricciones**: Permisos de solo lectura (prohibido write, edit, task, delegate_task, call_omo_agent)

---

#### Multimodal Looker - Experto en Análisis de Medios

**Rol**: Interpreta archivos multimedia que no pueden leerse como texto plano

**Capacidades**:
- PDF: Extraer texto, estructura, tablas, datos de secciones específicas
- Imágenes: Describir diseño, elementos UI, texto, gráficos
- Diagramas: Interpretar relaciones, flujos, arquitectura

**Modelo Recomendado**: `google/gemini-3-flash` (temperature: 0.1)

**Escenarios de Uso**:
- Cuando necesitas extraer datos estructurados de PDFs
- Describir elementos UI o gráficos en imágenes
- Analizar diagramas en documentación técnica

**Cómo Invocarlo**: Activación automática a través de la herramienta `look_at`

**Restricciones**: **Lista blanca de solo lectura** (solo se permite la herramienta read)

---

### Planificación y Ejecución (2)

#### Prometheus - Planificador Estratégico

**Rol**: Experto en recopilación de requisitos estilo entrevista y generación de planes de trabajo

**Capacidades**:
- Modo entrevista: Preguntas continuas hasta que los requisitos estén claros
- Generación de planes de trabajo: Documentos de plan Markdown estructurados
- Delegación paralela: Consultar a Oracle, Metis, Momus para validar planes

**Modelo Recomendado**: `anthropic/claude-opus-4-5` (temperature: 0.1)

**Escenarios de Uso**:
- Crear planes detallados para proyectos complejos
- Proyectos que necesitan requisitos claros
- Flujos de trabajo sistemáticos

**Cómo Invocarlo**:
- Incluye `@prometheus` o "usar Prometheus" en el prompt
- Usa el comando slash `/start-work`

**Flujo de Trabajo**:
1. **Modo Entrevista**: Preguntas continuas hasta que los requisitos estén claros
2. **Borrador del Plan**: Generar plan Markdown estructurado
3. **Delegación Paralela**:
   - `delegate_task(agent="oracle", prompt="Revisar decisiones arquitectónicas")` → Ejecuta en segundo plano
   - `delegate_task(agent="metis", prompt="Identificar riesgos potenciales")` → Ejecuta en segundo plano
   - `delegate_task(agent="momus", prompt="Verificar completitud del plan")` → Ejecuta en segundo plano
4. **Integrar Retroalimentación**: Refinar el plan
5. **Salida del Plan**: Guardar en `.sisyphus/plans/{name}.md`

**Restricciones**: Solo planificación, sin implementación de código (forzado por el Hook `prometheus-md-only`)

---

#### Sisyphus Junior - Ejecutor de Tareas

**Rol**: Ejecutor de sub-agentes generado por categorías

**Capacidades**:
- Hereda configuración de Category (modelo, temperature, prompt_append)
- Carga Skills (habilidades especializadas)
- Ejecuta subtareas delegadas

**Modelo Recomendado**: Heredado de Category (por defecto `anthropic/claude-sonnet-4-5`)

**Escenarios de Uso**:
- Generación automática al usar `delegate_task(category="...", skills=["..."])`
- Tareas que requieren combinaciones específicas de Category y Skill
- Tareas rápidas y ligeras (Category "quick" usa modelo Haiku)

**Cómo Invocarlo**: Generación automática a través de la herramienta `delegate_task`

**Restricciones**: Prohibido task, delegate_task (no puede delegar nuevamente)

---

## Referencia Rápida de Invocación de Agentes

| Agente | Método de Invocación | Condición de Activación |
| --- | --- | --- |
| **Sisyphus** | Agente principal por defecto | Tareas de desarrollo diarias |
| **Atlas** | Comando `/start-work` | Iniciar ejecución de proyecto |
| **Oracle** | `@oracle` o `delegate_task(agent="oracle")` | Decisiones arquitectónicas complejas, 2+ correcciones fallidas |
| **Librarian** | `@librarian` o `delegate_task(agent="librarian")` | Activación automática al mencionar bibliotecas/fuentes externas |
| **Explore** | `@explore` o `delegate_task(agent="explore")` | Activación automática cuando involucra 2+ módulos |
| **Multimodal Looker** | Herramienta `look_at` | Cuando se necesita analizar PDF/imágenes |
| **Prometheus** | `@prometheus` o `/start-work` | Prompt incluye "Prometheus" o se necesita planificación |
| **Metis** | Invocación automática por Prometheus | Análisis automático antes de planificación |
| **Momus** | Invocación automática por Prometheus | Revisión automática después de generar plan |
| **Sisyphus Junior** | `delegate_task(category=...)` | Generación automática al usar Category/Skill |

---

## Cuándo Usar Cada Agente

::: tip Árbol de Decisión Rápida

**Escenario 1: Desarrollo diario (escribir código, corregir bugs)**
→ **Sisyphus** (por defecto)

**Escenario 2: Decisiones arquitectónicas complejas**
→ Consultar **@oracle**

**Escenario 3: Necesitas encontrar documentación o implementación de bibliotecas externas**
→ **@librarian** o activación automática

**Escenario 4: Base de código desconocida, necesitas encontrar código relacionado**
→ **@explore** o activación automática (2+ módulos)

**Escenario 5: Proyecto complejo que necesita plan detallado**
→ **@prometheus** o usar `/start-work`

**Escenario 6: Necesitas analizar PDF o imágenes**
→ Herramienta **look_at** (activa automáticamente Multimodal Looker)

**Escenario 7: Tarea rápida y simple, quieres ahorrar costos**
→ `delegate_task(category="quick")`

**Escenario 8: Necesitas operaciones profesionales de Git**
→ `delegate_task(category="quick", skills=["git-master"])`

**Escenario 9: Necesitas diseño de UI frontend**
→ `delegate_task(category="visual-engineering")`

**Escenario 10: Necesitas tareas de razonamiento de alto nivel**
→ `delegate_task(category="ultrabrain")`

:::

---

## Ejemplos de Colaboración entre Agentes: Flujo de Trabajo Completo

### Ejemplo 1: Desarrollo de Funcionalidad Compleja

```
Usuario: Desarrollar un sistema de autenticación de usuarios

→ Sisyphus recibe la tarea
  → Analiza requisitos, descubre necesidad de biblioteca externa (JWT)
  → Delegación paralela:
    - @librarian: "Encontrar mejores prácticas de JWT en Next.js" → [segundo plano]
    - @explore: "Encontrar código existente relacionado con autenticación" → [segundo plano]
  → Espera resultados, integra información
  → Implementa funcionalidad de autenticación JWT
  → Después de completar, delega:
    - @oracle: "Revisar diseño arquitectónico" → [segundo plano]
  → Optimiza según recomendaciones
```

---

### Ejemplo 2: Planificación de Proyecto

```
Usuario: Usar Prometheus para planificar este proyecto

→ Prometheus recibe la tarea
  → Modo entrevista:
    - Pregunta 1: ¿Cuál es la funcionalidad principal?
    - [Usuario responde]
    - Pregunta 2: ¿Cuál es el público objetivo?
    - [Usuario responde]
    - ...
  → Después de clarificar requisitos, delegación paralela:
    - delegate_task(agent="oracle", prompt="Revisar decisiones arquitectónicas") → [segundo plano]
    - delegate_task(agent="metis", prompt="Identificar riesgos potenciales") → [segundo plano]
    - delegate_task(agent="momus", prompt="Verificar completitud del plan") → [segundo plano]
  → Espera que todas las tareas en segundo plano terminen
  → Integra retroalimentación, refina plan
  → Genera documento de plan Markdown
→ Usuario revisa plan, confirma
→ Usa /start-work para iniciar ejecución
```

---

## Permisos y Restricciones de Agentes

| Agente | write | edit | bash | delegate_task | webfetch | read | LSP | AST-Grep |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Sisyphus** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Atlas** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Oracle** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Librarian** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Explore** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Multimodal Looker** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Prometheus** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Metis** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Momus** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Sisyphus Junior** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |

---

## Resumen de la Lección

Los 10 agentes de IA de oh-my-opencode cubren todas las etapas del flujo de desarrollo:

- **Orquestación y Ejecución**: Sisyphus (orquestador principal), Atlas (gestión de TODO)
- **Consultoría y Revisión**: Oracle (consultor estratégico), Metis (análisis de pre-planificación), Momus (revisión de planes)
- **Investigación y Exploración**: Librarian (investigación multi-repositorio), Explore (exploración de código), Multimodal Looker (análisis de medios)
- **Planificación**: Prometheus (planificación estratégica), Sisyphus Junior (ejecución de subtareas)

**Puntos Clave**:
1. No trates a la IA como un asistente todopoderoso, trátala como un equipo profesional
2. Selecciona el agente más adecuado según el tipo de tarea
3. Aprovecha la delegación paralela para mejorar la eficiencia (Librarian, Explore, Oracle pueden ejecutarse en segundo plano)
4. Comprende las restricciones de permisos de cada agente (los agentes de solo lectura no pueden modificar código)
5. La colaboración entre agentes puede formar flujos de trabajo completos (planificación → ejecución → revisión)

---

## Próxima Lección

> En la próxima lección aprenderemos sobre **[Planificación con Prometheus: Recopilación de Requisitos Estilo Entrevista](../prometheus-planning/)**.
>
> Aprenderás:
> - Cómo usar Prometheus para recopilación de requisitos estilo entrevista
> - Cómo generar planes de trabajo estructurados
> - Cómo hacer que Metis y Momus validen planes
> - Cómo obtener y cancelar tareas en segundo plano

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-26

| Agente | Ruta del Archivo | Líneas |
| --- | --- | --- |
| Sisyphus Orquestador Principal | [`src/agents/sisyphus.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/sisyphus.ts) | - |
| Atlas Orquestador Principal | [`src/agents/atlas.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/atlas.ts) | - |
| Oracle Consultor | [`src/agents/oracle.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/oracle.ts) | 1-123 |
| Librarian Experto en Investigación | [`src/agents/librarian.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/librarian.ts) | 1-327 |
| Explore Experto en Búsqueda | [`src/agents/explore.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/explore.ts) | 1-123 |
| Multimodal Looker | [`src/agents/multimodal-looker.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/multimodal-looker.ts) | 1-57 |
| Prometheus Planificador | [`src/agents/prometheus-prompt.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/prometheus-prompt.ts) | 1-1196 |
| Metis Análisis de Pre-planificación | [`src/agents/metis.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/metis.ts) | 1-316 |
| Momus Revisor de Planes | [`src/agents/momus.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/momus.ts) | 1-445 |
| Sisyphus Junior | [`src/agents/sisyphus-junior.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/sisyphus-junior.ts) | - |
| Definición de Metadatos de Agentes | [`src/agents/types.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/types.ts) | - |
| Restricciones de Herramientas de Agentes | [`src/shared/permission-compat.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/shared/permission-compat.ts) | - |

**Configuraciones Clave**:
- `ORACLE_PROMPT_METADATA`: Metadatos del agente Oracle (condiciones de activación, escenarios de uso)
- `LIBRARIAN_PROMPT_METADATA`: Metadatos del agente Librarian
- `EXPLORE_PROMPT_METADATA`: Metadatos del agente Explore
- `MULTIMODAL_LOOKER_PROMPT_METADATA`: Metadatos del agente Multimodal Looker
- `METIS_SYSTEM_PROMPT`: Prompt del sistema del agente Metis
- `MOMUS_SYSTEM_PROMPT`: Prompt del sistema del agente Momus

**Funciones Clave**:
- `createOracleAgent(model)`: Crear configuración del agente Oracle
- `createLibrarianAgent(model)`: Crear configuración del agente Librarian
- `createExploreAgent(model)`: Crear configuración del agente Explore
- `createMultimodalLookerAgent(model)`: Crear configuración del agente Multimodal Looker
- `createMetisAgent(model)`: Crear configuración del agente Metis
- `createMomusAgent(model)`: Crear configuración del agente Momus

**Restricciones de Permisos**:
- `createAgentToolRestrictions()`: Crear restricciones de herramientas de agentes (usado por Oracle, Librarian, Explore, Metis, Momus)
- `createAgentToolAllowlist()`: Crear lista blanca de herramientas de agentes (usado por Multimodal Looker)

</details>
