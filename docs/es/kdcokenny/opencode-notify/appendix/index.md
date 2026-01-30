---
title: "Apéndice de opencode-notify: Referencia completa de tipos de eventos y configuración | Tutorial"
sidebarTitle: "Consultar configuración y eventos"
subtitle: "Apéndice: Tipos de eventos y referencia de configuración"
description: "Consulta la documentación de tipos de eventos y ejemplos de configuración del plugin opencode-notify. Este tutorial enumera los cuatro tipos de eventos de OpenCode y sus condiciones de activación, explica en detalle las reglas de filtrado y diferencias entre plataformas, y proporciona plantillas de configuración completas, comentarios detallados de cada campo, valores predeterminados, ejemplos de configuración mínima, métodos para desactivar el plugin y la lista completa de sonidos disponibles en macOS."
order: 5
---

# Apéndice: Tipos de eventos y referencia de configuración

Esta sección proporciona documentación de referencia y ejemplos de configuración para ayudarte a comprender en profundidad los tipos de eventos y opciones de configuración de opencode-notify. Este contenido está diseñado como material de consulta y no requiere un orden de lectura específico.

## Ruta de aprendizaje

### 1. [Descripción de tipos de eventos](./event-types/)

Conoce los tipos de eventos de OpenCode que el plugin monitorea y sus condiciones de activación.

- Cuatro tipos de eventos (session.idle, session.error, permission.updated, tool.execute.before)
- Momento de activación y lógica de procesamiento de cada evento
- Reglas de filtrado: verificación de sesión padre, verificación de horario silencioso, verificación de foco de terminal
- Diferencias de funcionalidad entre plataformas

### 2. [Ejemplo de archivo de configuración](./config-file-example/)

Consulta el ejemplo completo del archivo de configuración y los comentarios detallados de cada campo.

- Plantilla completa del archivo de configuración
- Descripción de campos: notifyChildSessions, sounds, quietHours, terminal, etc.
- Lista completa de sonidos disponibles en macOS
- Ejemplo de configuración mínima
- Métodos para desactivar el plugin

## Requisitos previos

::: tip Recomendación de estudio

Esta sección es documentación de referencia que puedes consultar cuando lo necesites. Se recomienda completar los siguientes tutoriales básicos antes de consultar este contenido:

- [Inicio rápido](../../start/quick-start/) - Completa la instalación y configuración inicial
- [Cómo funciona](../../start/how-it-works/) - Comprende los mecanismos principales del plugin

:::

## Próximos pasos

Después de revisar el contenido del apéndice, puedes:

- Consultar el [Registro de cambios](../changelog/release-notes/) para conocer el historial de versiones y nuevas funcionalidades
- Volver a la [Referencia de configuración](../../advanced/config-reference/) para profundizar en las opciones de configuración avanzada
- Explorar las [Preguntas frecuentes](../../faq/common-questions/) para encontrar respuestas
