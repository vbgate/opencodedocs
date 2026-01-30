---
title: "Conceptos Clave: Ecosistema de Habilidades Unificado | OpenSkills"
sidebarTitle: "Haz que las herramientas de IA compartan habilidades"
subtitle: "Conceptos Clave: Ecosistema de Habilidades Unificado | OpenSkills"
description: "Aprende los conceptos clave y el funcionamiento de OpenSkills. Como cargador de habilidades unificado, admite habilidades compartidas entre múltiples agentes, permitiendo carga progresiva."
tags:
  - "Introducción a Conceptos"
  - "Conceptos Clave"
prerequisite: []
order: 2
---

# ¿Qué es OpenSkills?

## Qué podrás hacer al completar este tutorial

- Entender el valor principal y el funcionamiento de OpenSkills
- Conocer la relación entre OpenSkills y Claude Code
- Saber cuándo usar OpenSkills en lugar del sistema de habilidades integrado
- Saber cómo hacer que múltiples agentes de codificación de IA compartan un ecosistema de habilidades

::: info Conocimientos Previos
Este tutorial asume que estás familiarizado con herramientas básicas de codificación de IA (como Claude Code, Cursor, etc.), pero no se requiere experiencia previa con OpenSkills.
:::

---

## Tu Situación Actual

Puedes encontrarte en estas situaciones:

- **Las habilidades que dominas en Claude Code desaparecen al cambiar de herramienta de IA**: por ejemplo, las habilidades de procesamiento de PDF que usas en Claude Code no están disponibles en Cursor
- **Instalación de habilidades repetida en diferentes herramientas**: cada herramienta de IA requiere configuración de habilidades separada, con altos costos de gestión
- **Quieres usar habilidades privadas, pero el Marketplace oficial no lo admite**: habilidades desarrolladas internamente o por ti mismo no se pueden compartir fácilmente con el equipo

Estos problemas son esencialmente: **formatos de habilidades no unificados, imposibilidad de compartir entre herramientas**.

---

## Idea Clave: Formato de Habilidad Unificado

La idea central de OpenSkills es simple: **convertir el sistema de habilidades de Claude Code en un cargador de habilidades universal**.

### Qué es

**OpenSkills** es un cargador universal del sistema de habilidades de Anthropic, que permite que cualquier agente de codificación de IA (Claude Code, Cursor, Windsurf, Aider, etc.) utilice habilidades en formato SKILL.md estándar.

En resumen: **un instalador, para todas las herramientas de codificación de IA**.

### Qué Problemas Resuelve

| Problema | Solución |
|---|---|
| Formatos de habilidades no unificados | Usar el formato estándar SKILL.md de Claude Code |
| Habilidades no se pueden compartir entre herramientas | Generar AGENTS.md unificado que todas las herramientas pueden leer |
| Gestión de habilidades dispersa | Comandos unificados de instalación, actualización y eliminación |
| Habilidades privadas difíciles de compartir | Soporte para instalación desde rutas locales y repositorios git privados |

---

## Valor Principal

OpenSkills proporciona los siguientes valores principales:

### 1. Estándar Unificado

Todos los agentes usan el mismo formato de habilidad y descripción AGENTS.md, sin necesidad de aprender nuevos formatos.

- **Totalmente compatible con Claude Code**: mismo formato de prompts, mismo Marketplace, misma estructura de carpetas
- **SKILL.md Estandarizado**: definiciones de habilidades claras, fáciles de desarrollar y mantener

### 2. Carga Progresiva

Carga de habilidades bajo demanda, manteniendo el contexto de IA limpio y conciso.

- No es necesario cargar todas las habilidades de una vez
- Los agentes de IA cargan dinámicamente las habilidades relevantes según las necesidades de la tarea
- Evita la explosión de contexto, mejorando la calidad de respuesta

### 3. Soporte Multi-Agente

Un conjunto de habilidades sirve a múltiples agentes, sin necesidad de instalación repetida.

- Claude Code, Cursor, Windsurf, Aider comparten el mismo conjunto de habilidades
- Interfaz unificada de gestión de habilidades
- Reduce costos de configuración y mantenimiento

### 4. Amigable con Código Abierto

Soporte para rutas locales y repositorios git privados, adecuado para colaboración en equipo.

- Instalación de habilidades desde sistema de archivos local (en desarrollo)
- Instalación desde repositorios git privados (compartir internamente en la empresa)
- Las habilidades pueden gestionarse en versiones junto con el proyecto

### 5. Ejecución Local

Sin subida de datos, privacidad y seguridad.

- Todos los archivos de habilidades se almacenan localmente
- Sin dependencia de servicios en la nube, sin riesgo de filtración de datos
- Adecuado para proyectos sensibles y entornos empresariales

---

## Cómo Funciona

El flujo de trabajo de OpenSkills es simple, dividido en tres pasos:

### Paso 1: Instalar Habilidad

Instala habilidades desde GitHub, rutas locales o repositorios git privados en tu proyecto.

```bash
# Instalar desde repositorio oficial de Anthropic
openskills install anthropics/skills

# Instalar desde ruta local
openskills install ./my-skills
```

Las habilidades se instalarán en el directorio `.claude/skills/` del proyecto (predeterminado), o el directorio `.agent/skills/` (al usar `--universal`).

### Paso 2: Sincronizar a AGENTS.md

Sincroniza las habilidades instaladas al archivo AGENTS.md, generando una lista de habilidades que los agentes de IA pueden leer.

```bash
openskills sync
```

AGENTS.md contendrá algo como este XML:

```xml
<available_skills>
<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables...</description>
<location>project</location>
</skill>
</available_skills>
```

### Paso 3: Agente de IA Carga Habilidad

Cuando un agente de IA necesita usar una habilidad, carga el contenido de la habilidad a través del siguiente comando:

```bash
openskills read <skill-name>
```

El agente de IA cargará dinámicamente el contenido de la habilidad en el contexto y ejecutará la tarea.

---

## Relación con Claude Code

OpenSkills y Claude Code tienen una relación complementaria, no de reemplazo.

### Formato Totalmente Compatible

| Aspecto | Claude Code | OpenSkills |
|---|---|---|
| **Formato de prompts** | `<available_skills>` XML | Mismo XML |
| **Almacenamiento de habilidades** | `.claude/skills/` | `.claude/skills/` (predeterminado) |
| **Invocación de habilidades** | Herramienta `Skill("name")` | `npx openskills read <name>` |
| **Marketplace** | Marketplace de Anthropic | GitHub (anthropics/skills) |
| **Carga progresiva** | ✅ | ✅ |

### Comparación de Escenarios de Uso

| Escenario | Herramienta Recomendada | Razón |
|---|---|---|
| Solo usar Claude Code | Integrado en Claude Code | Sin instalación adicional, soporte oficial |
| Mezclar múltiples herramientas de IA | OpenSkills | Gestión unificada, evita duplicación |
| Necesitar habilidades privadas | OpenSkills | Soporte para repositorios locales y privados |
| Colaboración en equipo | OpenSkills | Las habilidades se pueden gestionar en versiones, fácil de compartir |

---

## Ubicación de Instalación

OpenSkills admite tres ubicaciones de instalación:

| Ubicación de Instalación | Comando | Escenario de Uso |
|---|---|---|
| **Local del proyecto** | Predeterminado | Uso en un solo proyecto, las habilidades se gestionan en versiones con el proyecto |
| **Instalación global** | `--global` | Todas las habilidades comunes se comparten entre todos los proyectos |
| **Modo Universal** | `--universal` | Entornos multi-agente, evita conflicto con Claude Code |

::: tip ¿Cuándo usar el modo Universal?
Si usas Claude Code y otros agentes de codificación de IA simultáneamente (como Cursor, Windsurf), usa `--universal` para instalar en `.agent/skills/`, permitiendo que múltiples agentes compartan el mismo conjunto de habilidades y evitando conflictos.
:::

---

## Ecosistema de Habilidades

OpenSkills usa el mismo ecosistema de habilidades que Claude Code:

### Biblioteca Oficial de Habilidades

Repositorio oficial de habilidades mantenido por Anthropic: [anthropics/skills](https://github.com/anthropics/skills)

Incluye habilidades comunes:
- Procesamiento de PDF
- Generación de imágenes
- Análisis de datos
- Y más...

### Habilidades de la Comunidad

Cualquier repositorio de GitHub puede ser fuente de habilidades, siempre que contenga el archivo SKILL.md.

### Habilidades Personalizadas

Puedes crear tus propias habilidades usando el formato estándar y compartirlas con tu equipo.

---

## Resumen de Esta Lección

La idea central de OpenSkills es:

1. **Estándar Unificado**: Usar el formato SKILL.md de Claude Code
2. **Soporte Multi-Agente**: Permitir que todas las herramientas de codificación de IA compartan el ecosistema de habilidades
3. **Carga Progresiva**: Carga bajo demanda, manteniendo el contexto conciso
4. **Ejecución Local**: Sin subida de datos, privacidad y seguridad
5. **Amigable con Código Abierto**: Soporte para repositorios locales y privados

Con OpenSkills, puedes:
- Cambiar sin problemas entre diferentes herramientas de IA
- Gestionar todas las habilidades unificadamente
- Usar y compartir habilidades privadas
- Mejorar la eficiencia de desarrollo

---

## Avance de la Siguiente Lección

> En la próxima lección aprenderemos **[Instalación de la herramienta OpenSkills](../installation/)**
>
> Aprenderás:
> - Cómo verificar el entorno de Node.js y Git
> - Usar npx o instalar OpenSkills globalmente
> - Verificar si la instalación fue exitosa
> - Resolver problemas comunes de instalación

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Función | Ruta del Archivo | Número de Línea |
|---|---|---|
| Definiciones de tipos principales | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L24) | 1-24 |
| Interfaz Skill | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L6) | 1-6 |
| Interfaz SkillLocation | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L8-L12) | 8-12 |
| Interfaz InstallOptions | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L14-L18) | 14-18 |
| Interfaz SkillMetadata | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L20-L24) | 20-24 |

**Interfaces Clave**:
- `Skill`: Información de habilidades instaladas (name, description, location, path)
- `SkillLocation`: Información de ubicación de búsqueda de habilidades (path, baseDir, source)
- `InstallOptions`: Opciones del comando de instalación (global, universal, yes)
- `SkillMetadata`: Metadatos de habilidad (name, description, context)

**Fuente de Conceptos Clave**:
- README.md:22-86 - Capítulo "What Is OpenSkills?"

</details>
