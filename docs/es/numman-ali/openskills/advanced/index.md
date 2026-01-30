---
title: "Funcionalidades Avanzadas: Múltiples Agentes y Desarrollo de Habilidades | OpenSkills"
sidebarTitle: "Múltiples Cuentas y Habilidades Personalizadas"
subtitle: "Funcionalidades Avanzadas: Múltiples Agentes y Desarrollo de Habilidades"
description: "Aprende las características avanzadas de OpenSkills, incluyendo configuración de entornos multi-agente, desarrollo de habilidades personalizadas, integración CI/CD y mecanismos de seguridad, gestionando eficientemente escenarios complejos."
order: 3
---

# Funcionalidades Avanzadas

Este capítulo cubre el uso avanzado de OpenSkills, incluyendo la configuración de entornos multi-agente, salidas personalizadas, desarrollo con enlaces simbólicos, creación de habilidades, integración CI/CD y mecanismos de seguridad. Después de dominar estos contenidos, podrás gestionar habilidades eficientemente en escenarios complejos y crear tu propia biblioteca de habilidades personalizada.

::: warning Prerrequisitos
Antes de estudiar este capítulo, asegúrate de haber completado:
- [Guía Rápida](../start/quick-start/): Comprender el proceso básico de instalación y uso
- [Instala tu primera habilidad](../start/first-skill/): Dominar los métodos de instalación de habilidades
- [Sincroniza habilidades a AGENTS.md](../start/sync-to-agents/): Comprender el mecanismo de sincronización de habilidades
:::

## Contenido de Este Capítulo

### Múltiples Agentes y Configuración de Salida

| Tutorial | Descripción |
|--- | ---|
|--- | ---|
|--- | ---|

### Desarrollo de Habilidades

| Tutorial | Descripción |
|--- | ---|
| [Soporte de enlaces simbólicos](./symlink-support/) | Implementa actualizaciones de habilidades basadas en git y flujos de trabajo de desarrollo local a través de enlaces simbólicos, compartiendo habilidades entre múltiples proyectos |
| [Crear habilidades personalizadas](./create-skills/) | Crea archivos de habilidades SKILL.md desde cero, dominando las especificaciones de YAML frontmatter y la estructura de directorios |
| [Explicación detallada de la estructura de habilidades](./skill-structure/) | Comprende profundamente las especificaciones completas de campos de SKILL.md, el diseño de recursos references/scripts/assets/ y la optimización del rendimiento |

### Automatización y Seguridad

| Tutorial | Descripción |
|--- | ---|
|--- | ---|
| [Notas de seguridad](./security/) | Conoce los mecanismos de protección de tres capas, incluyendo protección contra recorrido de caminos, manejo seguro de enlaces simbólicos y seguridad de análisis YAML |

### Guías Integrales

| Tutorial | Descripción |
|--- | ---|
| [Mejores prácticas](./best-practices/) | Resumen de experiencias en configuración de proyectos, gestión de habilidades y colaboración en equipo, ayudándote a usar OpenSkills de manera eficiente |

## Recomendaciones de Ruta de Aprendizaje

Elige la ruta de aprendizaje adecuada según tu escenario de uso:

### Ruta A: Usuario de Múltiples Agentes

Si usas simultáneamente múltiples herramientas de codificación con IA (Claude Code + Cursor + Windsurf, etc.):

```
Modo Universal → Ruta de salida personalizada → Mejores prácticas
```

### Ruta B: Creador de Habilidades

Si quieres crear tus propias habilidades y compartirlas con tu equipo:

```
Crear habilidades personalizadas → Explicación detallada de la estructura de habilidades → Soporte de enlaces simbólicos → Mejores prácticas
```

### Ruta C: DevOps/Automatización

Si necesitas integrar OpenSkills en procesos CI/CD:

```
Integración CI/CD → Notas de seguridad → Mejores prácticas
```

### Ruta D: Aprendizaje Completo

Si quieres dominar completamente todas las funcionalidades avanzadas, aprende en el siguiente orden:

1. [Modo Universal](./universal-mode/) - Fundamentos de entornos multi-agente
2. [Ruta de salida personalizada](./custom-output-path/) - Configuración de salida flexible
3. [Soporte de enlaces simbólicos](./symlink-support/) - Flujo de trabajo de desarrollo eficiente
4. [Crear habilidades personalizadas](./create-skills/) - Introducción a la creación de habilidades
5. [Explicación detallada de la estructura de habilidades](./skill-structure/) - Comprensión profunda del formato de habilidades
6. [Integración CI/CD](./ci-integration/) - Despliegue automatizado
7. [Notas de seguridad](./security/) - Explicación detallada de mecanismos de seguridad
8. [Mejores prácticas](./best-practices/) - Resumen de experiencias

## Siguientes Pasos

Una vez completado este capítulo, puedes:

- Consultar [Preguntas frecuentes](../faq/faq/) para resolver problemas encontrados durante el uso
- Referir [API de línea de comandos](../appendix/cli-api/) para conocer la interfaz completa de línea de comandos
- Leer [Especificaciones de formato AGENTS.md](../appendix/agents-md-format/) para comprender profundamente el formato de archivos generados
- Ver [Registro de cambios](../changelog/changelog/) para conocer las últimas funcionalidades y cambios
