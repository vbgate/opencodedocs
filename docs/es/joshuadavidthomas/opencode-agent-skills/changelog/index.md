---
title: "Historial de versiones: Evolución de funcionalidades | opencode-agent-skills"
sidebarTitle: "Novedades de la versión"
subtitle: "Historial de versiones"
description: "Aprende sobre el historial de evolución del plugin OpenCode Agent Skills. Este tutorial resume todas las actualizaciones principales, correcciones de errores, mejoras arquitectónicas y cambios importantes desde v0.1.0 hasta v0.6.4."
tags:
  - "Actualización de versión"
  - "changelog"
  - "Historial de lanzamientos"
order: 3
---

# Historial de versiones

Este documento registra todas las actualizaciones de versiones del plugin OpenCode Agent Skills. A través del historial de versiones, puedes comprender la ruta de evolución de las funcionalidades, los problemas solucionados y las mejoras arquitectónicas.

::: tip Versión actual
La última versión estable es **v0.6.4** (2026-01-20)
:::

## Línea de tiempo de versiones

| Versión | Fecha de lanzamiento | Tipo | Contenido principal |
|---|---|---|---|
| 0.6.4 | 2026-01-20 | Corrección | Análisis YAML, soporte Claude v2 |
| 0.6.3 | 2025-12-16 | Mejora | Optimizar sugerencias de habilidades |
| 0.6.2 | 2025-12-15 | Corrección | Separar nombre de habilidad y nombre de directorio |
| 0.6.1 | 2025-12-13 | Mejora | Evitar recomendaciones repetidas de habilidades cargadas |
| 0.6.0 | 2025-12-12 | Nueva funcionalidad | Coincidencia semántica, precomputación de embedding |
| 0.5.0 | 2025-12-11 | Mejora | Sugerencias de coincidencia aproximada, refactorización |
| 0.4.1 | 2025-12-08 | Mejora | Simplificar método de instalación |
| 0.4.0 | 2025-12-05 | Mejora | Búsqueda recursiva de scripts |
| 0.3.3 | 2025-12-02 | Corrección | Manejo de enlaces simbólicos |
| 0.3.2 | 2025-11-30 | Corrección | Preservar modo de agente |
| 0.3.1 | 2025-11-28 | Corrección | Problema de cambio de modelo |
| 0.3.0 | 2025-11-27 | Nueva funcionalidad | Funcionalidad de lista de archivos |
| 0.2.0 | 2025-11-26 | Nueva funcionalidad | Modo Superpowers |
| 0.1.0 | 2025-11-26 | Inicial | 4 herramientas, descubrimiento en múltiples ubicaciones |

## Registro detallado de cambios

### v0.6.4 (2026-01-20)

**Correcciones**:
- Se corrigió el análisis del frontmatter YAML para descripciones multilínea de habilidades (soporta sintaxis de bloques `|` y `>`), reemplazando el analizador personalizado con la biblioteca `yaml`
- Se agregó soporte para el formato v2 del plugin de Claude, `installed_plugins.json` ahora usa un array de instalación de plugins en lugar de un solo objeto

**Mejoras**:
- El descubrimiento de caché del plugin Claude Code ahora admite la nueva estructura de directorios anidada (`cache/<marketplace>/<plugin>/<version>/skills/`)

### v0.6.3 (2025-12-16)

**Mejoras**:
- Se optimizaron las indicaciones de evaluación de habilidades para evitar que el modelo envíe mensajes del tipo "no se necesita habilidad" al usuario (el usuario no ve las indicaciones de evaluación ocultas)

### v0.6.2 (2025-12-15)

**Correcciones**:
- La validación de habilidades ahora permite que el nombre del directorio sea diferente del `name` en el frontmatter de SKILL.md. El `name` en el frontmatter es el identificador estándar, el nombre del directorio se usa solo para organización. Esto cumple con la especificación Anthropic Agent Skills.

### v0.6.1 (2025-12-13)

**Mejoras**:
- La recomendación dinámica de habilidades ahora rastrea las habilidades ya cargadas en cada sesión, evitando recomendar habilidades ya cargadas, reduciendo así indicaciones redundantes y el uso de contexto

### v0.6.0 (2025-12-12)

**Nuevas funcionalidades**:
- **Coincidencia semántica de habilidades**: Después de la inyección inicial de la lista de habilidades, los mensajes posteriores usan embeddings locales para coincidir con las descripciones de habilidades
- Se agregó la dependencia `@huggingface/transformers` para la generación local de embeddings (versión cuantificada all-MiniLM-L6-v2)
- Cuando un mensaje coincide con habilidades disponibles, se inyecta una indicación de evaluación de 3 pasos (EVALUATE → DECIDE → ACTIVATE), alentando a cargar habilidades (inspirado en el [artículo de blog](https://scottspence.com/posts/how-to-make-claude-code-skills-activate-reliably) de [@spences10](https://github.com/spences10))
- Caché de embeddings en disco para coincidencias de baja latencia (~/.cache/opencode-agent-skills/)
- Limpieza de sesiones en el evento `session.deleted`

### v0.5.0 (2025-12-11)

**Nuevas funcionalidades**:
- Se agregaron sugerencias de coincidencia aproximada "¿Te refieres a..." en todas las herramientas (`use_skill`, `read_skill_file`, `run_skill_script`, `get_available_skills`)

**Mejoras**:
- **Cambio importante**: Se renombró la herramienta `find_skills` a `get_available_skills` para mayor claridad en el propósito
- **Interno**: Se reorganizó el código base en módulos independientes (`claude.ts`, `skills.ts`, `tools.ts`, `utils.ts`, `superpowers.ts`) para mejorar la mantenibilidad
- **Interno**: Se mejoró la calidad del código eliminando comentarios generados por IA y código innecesario

### v0.4.1 (2025-12-08)

**Mejoras**:
- El método de instalación ahora usa el paquete npm a través de OpenCode config, en lugar de git clone + enlace simbólico

**Eliminaciones**:
- Se eliminó `INSTALL.md` (ya no es necesario después de simplificar la instalación)

### v0.4.0 (2025-12-05)

**Mejoras**:
- El descubrimiento de scripts ahora busca recursivamente en todo el directorio de habilidades (profundidad máxima 10), en lugar de solo en el directorio raíz y el subdirectorio `scripts/`
- Los scripts ahora se identifican por ruta relativa (como `tools/build.sh`) en lugar de por nombre base
- Se renombró el parámetro `skill_name` a `skill` en las herramientas `read_skill_file`, `run_skill_script` y `use_skill`
- Se renombró el parámetro `script_name` a `script` en la herramienta `run_skill_script`

### v0.3.3 (2025-12-02)

**Correcciones**:
- Se corrigió la detección de archivos y directorios para manejar correctamente enlaces simbólicos usando `fs.stat`

### v0.3.2 (2025-11-30)

**Correcciones**:
- Se preservó el modo de agente al inyectar mensajes sintéticos al inicio de la sesión

### v0.3.1 (2025-11-28)

**Correcciones**:
- Se corrigió el cambio inesperado de modelo al usar herramientas de habilidades (solución temporal para el issue de opencode #4475) pasando explícitamente el modelo actual en la operación `noReply`

### v0.3.0 (2025-11-27)

**Nuevas funcionalidades**:
- Se agregó una lista de archivos en la salida de `use_skill`

### v0.2.0 (2025-11-26)

**Nuevas funcionalidades**:
- Se agregó soporte para el modo Superpowers
- Se agregó comprobante de lanzamiento

### v0.1.0 (2025-11-26)

**Nuevas funcionalidades**:
- Se agregó la herramienta `use_skill` para cargar el contenido de habilidades en el contexto
- Se agregó la herramienta `read_skill_file` para leer archivos de soporte en el directorio de habilidades
- Se agregó la herramienta `run_skill_script` para ejecutar scripts desde el directorio de habilidades
- Se agregó la herramienta `find_skills` para buscar y listar habilidades disponibles
- Se agregó descubrimiento de habilidades en múltiples ubicaciones (nivel de proyecto, nivel de usuario y ubicaciones compatibles con Claude)
- Se agregó validación de frontmatter conforme a la especificación Anthropic Agent Skills Spec v1.0
- Se agregó inyección automática de lista de habilidades al inicio de la sesión y después de la compresión de contexto

**Nuevos colaboradores**:
- Josh Thomas <josh@joshthomas.dev> (mantenedor)

## Resumen de evolución de funcionalidades

| Funcionalidad | Versión de introducción | Ruta de evolución |
|---|---|---|
| 4 herramientas básicas | v0.1.0 | v0.5.0 agregó coincidencia aproximada |
| Descubrimiento de habilidades en múltiples ubicaciones | v0.1.0 | v0.4.1 simplificó instalación, v0.6.4 soporta Claude v2 |
| Inyección automática de contexto | v0.1.0 | v0.3.0 agregó lista de archivos, v0.6.1 evita recomendaciones repetidas |
| Modo Superpowers | v0.2.0 | Estable continuamente |
| Búsqueda recursiva de scripts | v0.4.0 | v0.3.3 corrigió enlaces simbólicos |
| Coincidencia semántica y recomendaciones | v0.6.0 | v0.6.1 evita repetición, v0.6.3 optimizó indicaciones |
| Sugerencias de coincidencia aproximada | v0.5.0 | Estable continuamente |

## Descripción de cambios importantes

### v0.6.0: Funcionalidad de coincidencia semántica

Se introdujo la capacidad de coincidencia semántica basada en embeddings locales, permitiendo que la IA recomiende automáticamente habilidades relacionadas según el contenido del mensaje del usuario, sin necesidad de que el usuario recuerde los nombres de las habilidades manualmente.

- **Detalles técnicos**: Uso del modelo `all-MiniLM-L6-v2` de HuggingFace (cuantificación q8)
- **Mecanismo de caché**: Los resultados de los embeddings se almacenan en caché en `~/.cache/opencode-agent-skills/` para mejorar la velocidad de coincidencias posteriores
- **Proceso de coincidencia**: Mensaje del usuario → embedding → calcular similitud coseno con descripciones de habilidades → Top 5 recomendaciones (umbral 0.35)

### v0.5.0: Refactorización y cambio de nombre de herramientas

La arquitectura del código se refactorizó a un diseño modular, con nombres de herramientas más claros:

- `find_skills` → `get_available_skills`
- `skill_name` → `skill`
- `script_name` → `script`

### v0.4.0: Actualización del mecanismo de descubrimiento de scripts

El descubrimiento de scripts evolucionó de "solo directorio raíz + scripts/" a "búsqueda recursiva en todo el directorio de habilidades" (profundidad máxima 10), soportando una organización de scripts más flexible.

### v0.2.0: Integración con Superpowers

Se agregó soporte para el modo de flujo de trabajo Superpowers, que requiere instalar la habilidad `using-superpowers` y establecer la variable de entorno `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true`.

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Funcionalidad | Ruta de archivo | Línea |
|---|---|---|
| Número de versión actual | [`package.json`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L3-L3) | 3 |
| Historial de versiones | [`CHANGELOG.md`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/CHANGELOG.md#L19-L152) | 19-152 |

**Información clave de versiones**:
- `v0.6.4`: Versión actual (2026-01-20)
- `v0.6.0`: Introducción de coincidencia semántica (2025-12-12)
- `v0.5.0`: Versión refactorizada (2025-12-11)
- `v0.1.0`: Versión inicial (2025-11-26)

</details>
