---
title: "Registro de Cambios: Historial de Versiones | opencode-md-table-formatter"
sidebarTitle: "Resumen de Cambios de Versión"
subtitle: "Registro de Cambios: Historial de Versiones y Registro de Cambios"
description: "Conoce la evolución de versiones y las nuevas características de opencode-md-table-formatter. Consulta las características de v0.1.0, incluyendo formato automático y caché de ancho."
tags:
  - "changelog"
  - "version-history"
  - "release-notes"
prerequisite: []
order: 90
---

# Registro de Cambios: Historial de Versiones y Registro de Cambios

::: info Lo Que Aprenderás
- Seguir la evolución de versiones del plugin
- Conocer las nuevas características y correcciones de cada versión
- Dominar las limitaciones conocidas y detalles técnicos
- Conocer las posibles mejoras futuras
:::

---

## [0.1.0] - 2025-01-07

### Nuevas Características

Esta es la **versión inicial** de opencode-md-table-formatter, que incluye las siguientes características principales:

- **Formato automático de tablas**: Formatea automáticamente las tablas Markdown generadas por IA a través del hook `experimental.text.complete`
- **Soporte de modo oculto**: Maneja correctamente los símbolos Markdown ocultos (como `**`, `*`) al calcular el ancho
- **Procesamiento de Markdown anidado**: Admite sintaxis Markdown anidada de profundidad arbitraria, utilizando un algoritmo de eliminación de múltiples pasadas
- **Protección de bloques de código**: Los símbolos Markdown dentro del código en línea (`` `code` ``) se mantienen en forma literal y no participan en el cálculo del ancho
- **Soporte de alineación**: Admite alineación a la izquierda (`---` o `:---`), alineación centrada (`:---:`), alineación a la derecha (`---:`)
- **Optimización de caché de ancho**: Almacena en caché los resultados de cálculo del ancho de visualización de cadenas, mejorando el rendimiento
- **Validación de tablas inválidas**: Valida automáticamente la estructura de la tabla, las tablas inválidas agregarán comentarios de error
- **Soporte de múltiples caracteres**: Admite Emoji, caracteres Unicode, celdas vacías, contenido muy largo
- **Manejo silencioso de errores**: El fallo de formato no interrumpirá el flujo de trabajo de OpenCode

### Detalles Técnicos

Esta versión contiene aproximadamente **230 líneas de código TypeScript listo para producción**:

- **12 funciones**: Responsabilidades claras, buena separación
- **Seguridad de tipos**: Uso correcto de la interfaz `Hooks`
- **Limpieza inteligente de caché**: Se activa cuando las operaciones superan 100 o las entradas de caché superan 1000
- **Procesamiento de expresiones regulares de múltiples pasadas**: Admite la eliminación de símbolos Markdown de profundidad de anidamiento arbitraria

::: tip Mecanismo de Caché
El caché está diseñado para optimizar el cálculo del ancho de contenido repetido. Por ejemplo, cuando el mismo texto de celda aparece varias veces en la tabla, el ancho se calcula solo una vez y las siguientes veces se lee directamente del caché.
:::

### Limitaciones Conocidas

Esta versión no admite los siguientes escenarios:

- **Tablas HTML**: Solo admite tablas de tubería Markdown (Pipe Table)
- **Celdas multilínea**: No admite celdas que contengan etiquetas `<br>`
- **Tablas sin fila separadora**: Las tablas deben contener una fila separadora (`|---|`) para ser formateadas
- **Requisitos de dependencia**: Requiere `@opencode-ai/plugin` >= 0.13.7 (utiliza el hook no documentado `experimental.text.complete`)

::: info Requisitos de Versión
El plugin depende de OpenCode >= 1.0.137 y `@opencode-ai/plugin` >= 0.13.7 para funcionar correctamente.
:::

---

## Planes Futuros

Las siguientes características están planificadas para implementarse en versiones futuras:

- **Opciones de configuración**: Admite personalización de ancho mínimo/máximo de columnas, deshabilitar características específicas
- **Soporte de tablas sin encabezado**: Formatear tablas sin filas de encabezado
- **Optimización de rendimiento**: Análisis y optimización del rendimiento para tablas muy grandes (100+ filas)
- **Más opciones de alineación**: Ampliar la sintaxis y funcionalidad de alineación

::: tip Contribuir
Si tienes sugerencias de características o quieres contribuir código, bienvenido a plantear tus ideas en [GitHub Issues](https://github.com/franlol/opencode-md-table-formatter/issues).
:::

---

## Formato del Registro de Cambios

El registro de cambios de este proyecto sigue el formato [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), y los números de versión siguen la especificación [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**Formato del número de versión**: `MAJOR.MINOR.PATCH`

- **MAJOR**: Cambios incompatibles en la API
- **MINOR**: Nuevas características compatibles con versiones anteriores
- **PATCH**: Correcciones de problemas compatibles con versiones anteriores

**Tipos de cambios**:

- **Added**: Nuevas características
- **Changed**: Cambios en características existentes
- **Deprecated**: Características que se eliminarán pronto
- **Removed**: Características eliminadas
- **Fixed**: Correcciones de problemas
- **Security**: Correcciones relacionadas con seguridad

---

## Orden Sugerido de Lectura

Si eres un nuevo usuario, se recomienda aprender en el siguiente orden:

1. [Comenzar en un Minuto: Instalación y Configuración](../../start/getting-started/) — Comenzar rápidamente
2. [Visión General de Características: La Magia del Formato Automático](../../start/features/) — Conocer las características principales
3. [Preguntas Frecuentes: ¿Qué hacer si la tabla no se formatea?](../../faq/troubleshooting/) — Solución de problemas
4. [Limitaciones Conocidas: ¿Dónde están los límites del plugin?](../../appendix/limitations/) — Conocer las limitaciones
