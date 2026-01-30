---
title: "Funcionalidades Principales: Tres Capacidades | opencode-dcp"
sidebarTitle: "Desbloquear Tres Capacidades"
subtitle: "Funcionalidades Principales: Tres Capacidades"
description: "Aprende las tres funcionalidades principales de opencode-dcp: estrategias de poda automática, herramientas impulsadas por LLM y comandos Slash. Domina estas funciones para maximizar el potencial de optimización de tokens."
order: 20
---

# Funcionalidades Principales

Este capítulo explora en profundidad las tres capacidades principales de DCP: estrategias de poda automática, herramientas impulsadas por LLM y comandos Slash. Al dominar estas funcionalidades, podrás aprovechar al máximo el potencial de optimización de tokens de DCP.

## Contenido del Capítulo

<div class="grid-cards">

### [Estrategias de Poda Automática](./auto-pruning/)

Explora en profundidad cómo funcionan las tres estrategias automáticas de DCP: estrategia de deduplicación, estrategia de sobrescritura y estrategia de limpieza de errores. Conoce las condiciones de activación y escenarios de uso de cada estrategia.

### [Herramientas de Poda Impulsadas por LLM](./llm-tools/)

Entiende cómo la IA llama autónomamente a las herramientas `discard` y `extract` para optimizar el contexto. Esta es la funcionalidad más inteligente de DCP, permitiendo que la IA participe activamente en la gestión del contexto.

### [Uso de Comandos Slash](./commands/)

Domina el uso de todos los comandos DCP: `/dcp context` para ver el estado del contexto, `/dcp stats` para ver estadísticas, `/dcp sweep` para activar manualmente la poda.

</div>

## Ruta de Aprendizaje

Recomendamos estudiar el contenido de este capítulo en el siguiente orden:

```
Estrategias de Poda Automática → Herramientas Impulsadas por LLM → Comandos Slash
           ↓                               ↓                              ↓
   Entender los Principios      Dominar la Poda Inteligente   Aprender Monitoreo y Depuración
```

1. **Primero aprende estrategias de poda automática**: Esta es la base de DCP, entiende los principios de funcionamiento de las tres estrategias
2. **Luego aprende herramientas impulsadas por LLM**: Después de comprender las estrategias automáticas, aprende capacidades más avanzadas de poda activa por parte de la IA
3. **Por último aprende comandos Slash**: Domina los métodos de monitoreo y control manual para facilitar la depuración y optimización

::: tip Requisitos Previos
Antes de estudiar este capítulo, asegúrate de haber completado:
- [Instalación y Inicio Rápido](../start/getting-started/) - Completa la instalación del plugin DCP
- [Guía de Configuración](../start/configuration/) - Entiende los conceptos básicos del sistema de configuración
:::

## Siguientes Pasos

Después de completar este capítulo, puedes continuar explorando:

- **[Mecanismos de Protección](../advanced/protection/)** - Aprende cómo proteger el contenido crítico para que no sea podado por error
- **[Persistencia de Estado](../advanced/state-persistence/)** - Entiende cómo DCP preserva el estado entre sesiones
- **[Impacto en el Cache de Prompt](../advanced/prompt-caching/)** - Entiende los compromisos entre DCP y el Prompt Caching
