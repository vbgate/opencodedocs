---
title: "Avanzado: Flujos de Trabajo de IA | oh-my-opencode"
sidebarTitle: "Trabaja como un Equipo"
subtitle: "Avanzado: Flujos de Trabajo de IA"
description: "Domina la orquestación avanzada de flujos de trabajo de IA en oh-my-opencode. Aprende sobre equipos de agentes, tareas paralelas, sistema de Categorías/Habilidades, ganchos de ciclo de vida y personalización profunda para construir sistemas de desarrollo eficientes potenciados por IA."
order: 60
---

# Avanzado

Este capítulo profundiza en las características avanzadas de oh-my-opencode: equipos profesionales de agentes de IA, tareas paralelas en segundo plano, sistema de Categorías y Habilidades, ganchos de ciclo de vida y más. Dominar estas capacidades te permitirá orquestar flujos de trabajo de IA como gestionar un equipo real, logrando una experiencia de desarrollo más eficiente.

## Contenido del Capítulo

<div class="grid-cards">

### [Equipos de Agentes de IA: Descripción General de 10 Expertos](./ai-agents-overview/)

Introducción completa a la funcionalidad, casos de uso y métodos de llamada de 10 agentes integrados. Aprende a seleccionar el agente adecuado según el tipo de tarea, permitiendo una colaboración eficiente del equipo, ejecución paralela de tareas y análisis profundo de código.

### [Planificación Prometheus: Recopilación de Requisitos Basada en Entrevistas](./prometheus-planning/)

Clarifica los requisitos y genera planes de trabajo a través del modo de entrevista. Prometheus continuará haciendo preguntas hasta que los requisitos sean claros y consulta automáticamente a Oracle, Metis y Momus para verificar la calidad del plan.

### [Tareas Paralelas en Segundo Plano: Trabaja como un Equipo](./background-tasks/)

Explicación profunda del uso del sistema de gestión de agentes en segundo plano. Aprende el control de concurrencia, sondeo de tareas y recuperación de resultados, permitiendo que múltiples agentes de IA manejen diferentes tareas simultáneamente, mejorando drásticamente la eficiencia del trabajo.

### [LSP y AST-Grep: Herramientas de Refactorización de Código](./lsp-ast-tools/)

Introducción al uso de herramientas LSP y herramientas AST-Grep. Demuestra cómo implementar análisis y operaciones de código a nivel de IDE, incluyendo navegación de símbolos, búsqueda de referencias y búsqueda estructurada de código.

### [Categorías y Habilidades: Composición Dinámica de Agentes](./categories-skills/)

Aprende a usar el sistema de Categorías y Habilidades para crear sub-agentes especializados. Implementa una composición flexible de agentes, asignando dinámicamente modelos, herramientas y habilidades según los requisitos de la tarea.

### [Habilidades Integradas: Automatización del Navegador y Experto en Git](./builtin-skills/)

Introducción detallada a los casos de uso y mejores prácticas de tres Habilidades integradas (playwright, frontend-ui-ux, git-master). Accede rápidamente a capacidades profesionales como automatización del navegador, diseño de interfaz de usuario frontend y operaciones de Git.

### [Ganchos de Ciclo de Vida: Automatización de Contexto y Control de Calidad](./lifecycle-hooks/)

Introducción al uso de 32 ganchos de ciclo de vida. Entiende cómo automatizar la inyección de contexto, recuperación de errores y control de calidad, construyendo un sistema completo de automatización de flujos de trabajo de IA.

### [Comandos Slash: Flujos de Trabajo Preestablecidos](./slash-commands/)

Introducción al uso de 6 comandos slash integrados. Incluyendo /ralph-loop (bucle de corrección rápida), /refactor (refactorización de código), /start-work (inicio de ejecución del proyecto) y otros flujos de trabajo comunes.

### [Personalización Profunda de Configuración: Gestión de Agentes y Permisos](./advanced-configuration/)

Enseña a los usuarios la personalización profunda de la configuración de agentes, configuración de permisos, anulaciones de modelos y modificaciones de prompts. Domina capacidades completas de configuración, creando flujos de trabajo de IA alineados con los estándares del equipo.

</div>

## Ruta de Aprendizaje

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  Paso 1                   Paso 2                      Paso 3                           Paso 4                  │
│  Entender Agentes de IA →   Dominar Planificación →   Aprender Composición        →   Personalización        │
│  (Conceptos Básicos)          y Tareas Paralelas         Dinámica de Agentes         Profunda y Automatización │
│                                                           (Uso Avanzado)            (Nivel Experto)           │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Secuencia Recomendada**:

1. **Comienza con Equipos de Agentes de IA**: Entiende las responsabilidades y casos de uso de 10 agentes—esta es la piedra angular para entender todo el sistema.
2. **Luego Aprende Planificación y Tareas Paralelas**: Domina la planificación Prometheus y el sistema de tareas en segundo plano—este es el núcleo de la colaboración eficiente.
3. **A continuación Aprende Composición Dinámica de Agentes**: Aprende Categorías y Habilidades para lograr una especialización flexible de agentes.
4. **Finalmente Aprende Personalización Profunda**: Domina los ganchos de ciclo de vida, comandos slash y personalización de configuración para construir flujos de trabajo completos.

**Rutas Avanzadas**:
- Si tu objetivo es **inicio rápido**: Enfócate en "Equipos de Agentes de IA" y "Comandos Slash"
- Si tu objetivo es **colaboración en equipo**: Profundiza en "Planificación Prometheus" y "Tareas Paralelas en Segundo Plano"
- Si tu objetivo es **automatización de flujos de trabajo**: Aprende "Ganchos de Ciclo de Vida" y "Personalización Profunda de Configuración"

## Prerrequisitos

::: warning Antes de Comenzar
Este capítulo asume que has completado:

- ✅ [Instalación Rápida y Configuración](../start/installation/): Instalado oh-my-opencode y configurado al menos un Provider
- ✅ [Primera Mirada a Sisyphus: Orquestador Principal](../start/sisyphus-orchestrator/): Entendido los mecanismos básicos de llamada y delegación de agentes
- ✅ [Configuración de Provider: Claude, OpenAI, Gemini](../platforms/provider-setup/): Configurado al menos un AI Provider
:::

## Próximos Pasos

Después de completar este capítulo, recomendamos continuar con:

- **[Diagnóstico de Configuración y Solución de Problemas](../faq/troubleshooting/)**: Localiza y resuelve rápidamente problemas cuando surjan.
- **[Referencia de Configuración](../appendix/configuration-reference/)**: Consulta el esquema completo del archivo de configuración y entiende todas las opciones de configuración.
- **[Compatibilidad con Claude Code](../appendix/claude-code-compatibility/)**: Aprende cómo migrar flujos de trabajo existentes de Claude Code a oh-my-opencode.
