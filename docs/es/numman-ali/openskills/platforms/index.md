---
title: "Funciones de la Plataforma: Comandos Principales y Gestión de Habilidades | OpenSkills"
sidebarTitle: "Dominar las Operaciones Principales"
subtitle: "Funciones de la Plataforma: Comandos Principales y Gestión de Habilidades | OpenSkills"
description: "Aprende las funcionalidades de la plataforma OpenSkills, domina comandos y operaciones principales como instalar, listar, actualizar y eliminar habilidades, entiende las diferencias entre gestión global y de proyecto."
order: 2
---

# Funciones de la Plataforma

Este capítulo profundiza en los comandos principales de OpenSkills CLI y las funcionalidades de gestión de habilidades, ayudándote a pasar de "saber usar" a "dominar".

## Requisitos Previos

::: warning Antes de Empezar
Antes de estudiar este capítulo, asegúrate de haber completado el capítulo de [Inicio Rápido](../start/), especialmente:
- [Instalar OpenSkills](../start/installation/): Habrás instalado con éxito OpenSkills CLI
- [Instalar la Primera Habilidad](../start/first-skill/): Entiendes el flujo básico de instalación de habilidades
:::

## Contenido del Capítulo

Este capítulo contiene 6 temas, cubriendo todas las funcionalidades principales de OpenSkills:

### [Explicación de Comandos](./cli-commands/)

Presentación completa de los 7 comandos, parámetros y flags, proporcionando una tabla de referencia rápida de comandos. Adecuado para usuarios que necesitan buscar rápidamente el uso de comandos.

### [Fuentes de Instalación Detalladas](./install-sources/)

Explicación detallada de tres fuentes de instalación: repositorios de GitHub, rutas locales y repositorios Git privados. Escenarios de aplicación, formatos de comandos y consideraciones para cada método.

### [Instalación Global vs Instalación Local del Proyecto](./global-vs-project/)

Explica las diferencias entre la instalación `--global` y la predeterminada (local del proyecto), ayudándote a elegir la ubicación de instalación adecuada y a entender las reglas de prioridad de búsqueda de habilidades.

### [Listar Habilidades Instaladas](./list-skills/)

Te enseña a usar el comando `list` para ver las habilidades instaladas, entendiendo el significado de las etiquetas de ubicación `(project)` y `(global)`.

### [Actualizar Habilidades](./update-skills/)

Te guía para usar el comando `update` para actualizar las habilidades instaladas, soportando actualización completa y actualización de habilidades específicas, manteniendo las habilidades sincronizadas con el repositorio fuente.

### [Eliminar Habilidades](./remove-skills/)

Presenta dos métodos de eliminación: comando interactivo `manage` y comando de automatización `remove`, ayudándote a gestionar tu biblioteca de habilidades de manera eficiente.

## Ruta de Aprendizaje

Según tus necesidades, elige la ruta de aprendizaje adecuada:

### Ruta A: Aprendizaje Sistemático (Recomendado para Principiantes)

Estudia todo el contenido en orden, construyendo un sistema de conocimiento completo:

```
Explicación de Comandos → Fuentes de Instalación → Global vs Proyecto → Listar Habilidades → Actualizar Habilidades → Eliminar Habilidades
```

### Ruta B: Consulta Bajo Demanda

Salta directamente según la tarea actual:

| Qué Quieres Hacer | Lee Este Artículo |
|--- | ---|
| Buscar el uso de un comando específico | [Explicación de Comandos](./cli-commands/) |
| Instalar habilidades desde repositorios privados | [Fuentes de Instalación Detalladas](./install-sources/) |
| Decidir entre instalación global o del proyecto | [Global vs Proyecto](./global-vs-project/) |
| Ver qué habilidades están instaladas | [Listar Habilidades Instaladas](./list-skills/) |
| Actualizar habilidades a la última versión | [Actualizar Habilidades](./update-skills/) |
| Limpiar habilidades no utilizadas | [Eliminar Habilidades](./remove-skills/) |

## Siguientes Pasos

Al completar este capítulo, ya has dominado las habilidades de uso diario de OpenSkills. Luego puedes:

- **[Funciones Avanzadas](../advanced/)**: Aprende funciones avanzadas como el modo Universal, rutas de salida personalizadas, enlaces simbólicos, creación de habilidades personalizadas, etc.
- **[Preguntas Frecuentes](../faq/)**: Consulta las FAQ y la guía de solución de problemas cuando encuentres problemas
