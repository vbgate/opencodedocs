---
title: "Apéndice: Detalles Técnicos y Limitaciones | opencode-md-table-formatter"
sidebarTitle: "Entender Limitaciones y Principios"
subtitle: "Apéndice: Detalles Técnicos y Limitaciones"
description: "Aprende los límites técnicos y estrategias de optimización de rendimiento de opencode-md-table-formatter. Entiende las limitaciones conocidas, el mecanismo de caché y los detalles de diseño."
tags:
  - "Apéndice"
  - "Limitaciones Conocidas"
  - "Detalles Técnicos"
prerequisite:
  - "start-features"
order: 4
---

# Apéndice: Detalles Técnicos y Limitaciones

Este capítulo contiene la documentación de referencia y detalles técnicos del plugin, ayudándote a comprender profundamente el diseño, los límites y las estrategias de optimización de rendimiento del plugin.

::: info Lo que aprenderás
- Conocer las limitaciones conocidas del plugin y sus escenarios de uso
- Dominar el mecanismo de caché y las estrategias de optimización de rendimiento
- Entender los límites técnicos y las decisiones de diseño del plugin
:::

## Contenido de este capítulo

### 📚 [Limitaciones Conocidas: ¿Dónde están los límites del plugin?](./limitations/)

Conoce las funcionalidades no compatibles y las limitaciones técnicas del plugin para evitar su uso en escenarios no admitidos. Incluye:
- No soporta tablas HTML, celdas multilínea, tablas sin filas separadoras
- No soporta celdas combinadas y sin opciones de configuración
- Rendimiento no verificado para tablas muy grandes

**Público objetivo**: Usuarios que quieren saber qué puede y qué no puede hacer el plugin

### 🔧 [Detalles Técnicos: Mecanismo de Caché y Optimización de Rendimiento](./tech-details/)

Comprende profundamente la implementación interna del plugin, incluyendo el mecanismo de caché, estrategias de optimización de rendimiento y estructura del código. Incluye:
- Estructura de datos widthCache y flujo de búsqueda en caché
- Mecanismo de limpieza automática y umbrales de caché
- Análisis de efectos de optimización de rendimiento

**Público objetivo**: Desarrolladores interesados en los principios de implementación del plugin

## Ruta de aprendizaje recomendada

Las dos subpáginas de este capítulo son relativamente independientes y pueden leerse según necesidad:

1. **Usuarios de inicio rápido**: Se recomienda leer primero "Limitaciones Conocidas", comprender los límites del plugin y detenerse ahí
2. **Usuarios de aprendizaje profundo**: Leer en orden → "Limitaciones Conocidas" → "Detalles Técnicos"
3. **Desarrolladores**: Se recomienda la lectura completa, ayuda a comprender el diseño del plugin y futuras extensiones

## Requisitos previos

::: warning Preparación antes de comenzar

Antes de comenzar este capítulo, se recomienda que hayas completado:
- [ ] [Visión General de Funcionalidades: La magia del formato automático](../../start/features/) - Entender las funcionalidades principales del plugin

Esto te permitirá comprender mejor los detalles técnicos y las explicaciones de limitaciones en este capítulo.
:::

## Siguientes pasos

Después de completar este capítulo, puedes continuar aprendiendo:

- [Registro de Cambios: Historial de versiones y registro de cambios](../../changelog/release-notes/) - Rastrear la evolución de versiones del plugin y nuevas funcionalidades

O regresar al capítulo anterior:
- [Preguntas Frecuentes: ¿Qué hacer si la tabla no se formatea?](../../faq/troubleshooting/) - Localizar y resolver rápidamente problemas comunes
