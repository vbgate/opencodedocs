---
title: "Funciones Avanzadas: Principios de Formato | opencode-md-table-formatter"
subtitle: "Funciones Avanzadas: Principios de Formato"
sidebarTitle: "Entender Cómo Funciona"
order: 2
description: "Profundiza en los principios de formato de opencode-md-table-formatter. Domina el modo oculto, especificaciones de tablas y métodos de alineación para comprender completamente el funcionamiento del complemento."
prerequisite:
  - "start-getting-started"
  - "start-features"
tags:
  - "avanzado"
  - "principios"
  - "especificaciones"
---

# Funciones Avanzadas: Detalles Técnicos del Formato de Tablas Markdown

## Resumen del Capítulo

Este capítulo explora en profundidad los detalles técnicos del formato de tablas Markdown, incluyendo el funcionamiento del modo oculto de OpenCode, las especificaciones estructurales de tablas válidas y explicaciones detalladas de los métodos de alineación. Al estudiar estos contenidos, comprenderás completamente cómo el complemento procesa el formato de tablas y cómo evitar errores comunes.

## Ruta de Aprendizaje

Se recomienda estudiar el contenido de este capítulo en el siguiente orden:

::: info Ruta de Aprendizaje
1. **Principios del Modo Oculto** → Entiende por qué se necesita un tratamiento especial para el modo oculto de OpenCode
2. **Especificaciones de Tablas** → Domina qué tipo de tablas pueden formatearse correctamente
3. **Detalles de Alineación** → Aprende cómo controlar la alineación y estética de las tablas
:::

## Requisitos Previos

Antes de comenzar este capítulo, asegúrate de haber:

- [x] Completado [Inicio Rápido](../start/getting-started/), instalado y configurado correctamente el complemento
- [x] Leído [Vista General de Funciones](../start/features/), entendido las funciones básicas del complemento

::: warning Advertencia Importante
Si aún no has completado el aprendizaje básico, se recomienda volver a [Guía de Inicio](../start/getting-started/) primero.
:::

## Navegación del Capítulo

### [Principios del Modo Oculto](./concealment-mode/)

Entiende el funcionamiento del modo oculto de OpenCode y cómo el complemento calcula correctamente el ancho de visualización. Aprenderás:
- Qué es el modo oculto y por qué necesita tratamiento especial
- Cómo funciona el algoritmo de eliminación de símbolos Markdown
- El papel de `Bun.stringWidth()` en el cálculo de ancho

**Tiempo Estimado**: 8 minutos | **Dificultad**: Media | **Prerrequisito**: Vista General de Funciones

---

### [Especificaciones de Tablas](./table-spec/)

Domina los requisitos estructurales de tablas Markdown válidas para evitar errores de "tabla inválida". Aprenderás:
- Qué estructura de tabla es válida
- El papel y requisitos de formato de la fila separadora
- El principio de verificación de consistencia del número de columnas
- Cómo identificar rápidamente problemas en la estructura de la tabla

**Tiempo Estimado**: 6 minutos | **Dificultad**: Principiante | **Prerrequisito**: Principios del Modo Oculto

---

### [Detalles de Alineación](./alignment/)

Domina la sintaxis y efectos de los tres métodos de alineación para hacer las tablas más estéticas. Aprenderás:
- Sintaxis de alineación izquierda, centro y derecha
- Cómo especificar el método de alineación en la fila separadora
- Algoritmo de relleno de contenido de celdas
- Relación entre alineación y ancho de visualización

**Tiempo Estimado**: 10 minutos | **Dificultad**: Media | **Prerrequisito**: Especificaciones de Tablas

---

## Resumen del Capítulo

Al completar este capítulo, podrás:

- ✅ Entender el funcionamiento del modo oculto de OpenCode
- ✅ Dominar los requisitos estructurales de tablas válidas
- ✅ Identificar y reparar tablas inválidas
- ✅ Utilizar proficientemente los tres métodos de alineación
- ✅ Entender los detalles de implementación técnica interna del complemento

## Siguientes Pasos

Después de completar este capítulo, puedes:

1. **Resolver Problemas Reales** → Aprender [Preguntas Frecuentes](../../faq/troubleshooting/), localizar y resolver problemas rápidamente
2. **Entender Límites Técnicos** → Leer [Limitaciones Conocidas](../../appendix/limitations/), entender los escenarios aplicables del complemento
3. **Profundizar en la Implementación** → Ver [Detalles Técnicos](../../appendix/tech-details/), entender el mecanismo de caché y optimización de rendimiento

---

::: tip Sugerencia Práctica
Si quieres resolver rápidamente problemas de formato de tablas, puedes leer primero [Especificaciones de Tablas](./table-spec/) de este capítulo, que contiene los casos más comunes de tablas inválidas.
:::
