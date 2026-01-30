---
title: "Introducción: OpenCode Agent Skills | opencode-agent-skills"
sidebarTitle: "Skills que hacen que la IA te entienda"
subtitle: "Introducción: OpenCode Agent Skills"
description: "Aprende el valor central y las principales funcionalidades de OpenCode Agent Skills. Domina el descubrimiento dinámico de habilidades, la inyección de contexto, la recuperación de compresión y otras características, con compatibilidad con Claude Code y recomendación automática."
tags:
  - "Guía de inicio"
  - "Introducción del plugin"
prerequisite: []
order: 1
---

# ¿Qué es OpenCode Agent Skills?

## Lo que podrás hacer después de completar esta lección

- Conocer el valor central del plugin OpenCode Agent Skills
- Dominar las principales funcionalidades del plugin
- Entender cómo se descubren y cargan automáticamente las habilidades
- Diferenciar este plugin de otras soluciones de gestión de habilidades

## Tu situación actual

Es posible que hayas enfrentado estas situaciones:

- **Dificultad en la gestión dispersa de habilidades**: Las habilidades se encuentran dispersas en múltiples ubicaciones como proyectos, directorios de usuario y caché de plugins, lo que dificulta encontrar la habilidad adecuada
- **Las sesiones largas se vuelven problemáticas**: Después de sesiones prolongadas, las habilidades cargadas previamente pueden volverse inválidas debido a la compresión del contexto
- **Ansiedad por la compatibilidad**: Preocupación de que las habilidades y plugins existentes no se puedan usar después de migrar desde Claude Code
- **Configuración repetitiva**: Cada proyecto requiere reconfigurar las habilidades, sin un mecanismo unificado de gestión

Todos estos problemas están afectando tu eficiencia al usar asistentes de IA.

## Idea central

**OpenCode Agent Skills** es un sistema de plugins que proporciona capacidades de descubrimiento y gestión dinámica de habilidades para OpenCode.

::: info ¿Qué es una habilidad?
Una habilidad (Skill) es un módulo reutilizable que contiene guías de flujo de trabajo para la IA. Típicamente es un directorio que contiene un archivo `SKILL.md` (que describe la funcionalidad y el uso de la habilidad), junto con posibles archivos complementarios (documentos, scripts, etc.).
:::

**Valor central**: Mediante la estandarización del formato de habilidades (SKILL.md), se logra la reutilización de habilidades entre proyectos y sesiones.

### Arquitectura técnica

El plugin está desarrollado con TypeScript + Bun + Zod, proporcionando 4 herramientas centrales:

| Herramienta | Función |
| --- | --- |
| `use_skill` | Inyecta el contenido del SKILL.md de la habilidad al contexto de la sesión |
| `read_skill_file` | Lee los archivos soportados dentro del directorio de la habilidad (documentos, configuración, etc.) |
| `run_skill_script` | Ejecuta scripts ejecutables en el contexto del directorio de la habilidad |
| `get_available_skills` | Obtiene la lista de habilidades actualmente disponibles |

## Principales funcionalidades

### 1. Descubrimiento dinámico de habilidades

El plugin descubre automáticamente habilidades desde múltiples ubicaciones, ordenadas por prioridad:

```
1. .opencode/skills/              (nivel de proyecto - OpenCode)
2. .claude/skills/                (nivel de proyecto - Claude Code)
3. ~/.config/opencode/skills/     (nivel de usuario - OpenCode)
4. ~/.claude/skills/              (nivel de usuario - Claude Code)
5. ~/.claude/plugins/cache/       (caché de plugins)
6. ~/.claude/plugins/marketplaces/ (plugins instalados)
```

**Regla**: La primera habilidad coincidente tiene efecto, las habilidades posteriores con el mismo nombre son ignoradas.

> ¿Por qué está diseñado así?
>
> Las habilidades a nivel de proyecto tienen prioridad sobre las a nivel de usuario, lo que te permite personalizar comportamientos específicos en proyectos sin afectar la configuración global.

### 2. Inyección de contexto

Cuando llamas a `use_skill`, el contenido de la habilidad se inyecta en el contexto de la sesión en formato XML:

- `noReply: true` - La IA no responderá al mensaje inyectado
- `synthetic: true` - Marcado como mensaje generado por el sistema (no se muestra en la UI, no cuenta como entrada del usuario)

Esto significa que el contenido de la habilidad persistirá en el contexto de la sesión, y las habilidades seguirán estando disponibles incluso cuando la sesión crezca y ocurra compresión del contexto.

### 3. Mecanismo de recuperación de compresión

Cuando OpenCode ejecuta compresión del contexto (una operación común en sesiones largas), el plugin escucha el evento `session.compacted` y reinyecta automáticamente la lista de habilidades disponibles.

Esto asegura que la IA siempre sepa qué habilidades están disponibles durante sesiones largas, sin perder la capacidad de acceder a las habilidades debido a la compresión.

### 4. Compatibilidad con Claude Code

El plugin es completamente compatible con el sistema de habilidades y plugins de Claude Code, soportando:

- Habilidades de Claude Code (`.claude/skills/<skill-name>/SKILL.md`)
- Caché de plugins de Claude (`~/.claude/plugins/cache/...`)
- Mercado de plugins de Claude (`~/.claude/plugins/marketplaces/...`)

Esto significa que si usabas Claude Code anteriormente, puedes seguir usando tus habilidades y plugins existentes después de migrar a OpenCode.

### 5. Recomendación automática de habilidades

El plugin monitorea tus mensajes y utiliza similitud semántica para detectar si están relacionados con alguna habilidad disponible:

- Calcula el vector embedding del mensaje
- Calcula la similitud del coseno con las descripciones de todas las habilidades
- Cuando la similitud supera el umbral, inyecta un prompt de evaluación sugiriendo a la IA cargar la habilidad relacionada

Este proceso es completamente automático, no necesitas recordar nombres de habilidades ni solicitarlas explícitamente.

### 6. Integración con Superpowers (opcional)

El plugin soporta flujos de trabajo de Superpowers, habilitado mediante variables de entorno:

```bash
OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true opencode
```

Una vez habilitado, el plugin detectará automáticamente la habilidad `using-superpowers` e inyectará la guía completa del flujo de trabajo durante la inicialización de la sesión.

## Comparación con otras soluciones

| Solución | Características | Escenario de aplicación |
| --- | --- | --- |
| **opencode-agent-skills** | Descubrimiento dinámico, recuperación de compresión, recomendación automática | Escenarios que requieren gestión unificada y recomendación automática |
| **opencode-skills** | Registro automático como herramienta `skills_{{name}}` | Escenarios que requieren llamadas de herramientas independientes |
| **superpowers** | Flujo de trabajo completo de desarrollo de software | Proyectos que requieren estándares estrictos de proceso |
| **skillz** | Modo servidor MCP | Escenarios que requieren usar habilidades entre herramientas |

Razones para elegir este plugin:

- ✅ **Cero configuración**: Descubrimiento y gestión automática de habilidades
- ✅ **Recomendación inteligente**: Recomendación automática basada en coincidencia semántica
- ✅ **Recuperación de compresión**: Estable y confiable en sesiones largas
- ✅ **Compatibilidad**: Migración sin problemas de habilidades de Claude Code

## Resumen de esta lección

El plugin OpenCode Agent Skills proporciona capacidades completas de gestión de habilidades para OpenCode a través de mecanismos centrales como descubrimiento dinámico, inyección de contexto y recuperación de compresión. Su valor central radica en:

- **Automatización**: Reduce la carga de configuración manual y memorización de nombres de habilidades
- **Estabilidad**: Las habilidades siempre están disponibles durante sesiones largas
- **Compatibilidad**: Integración fluida con el ecosistema existente de Claude Code

## Avance del próxima lección

> En la próxima lección aprenderemos **[Instalar OpenCode Agent Skills](../installation/)**.
>
> Aprenderás:
> - Cómo agregar el plugin en la configuración de OpenCode
> - Cómo verificar si el plugin está instalado correctamente
> - Configuración del modo de desarrollo local

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para ver las ubicaciones del código fuente</strong></summary>

> Tiempo de actualización：2026-01-24

| Función | Ruta del archivo | Líneas |
| --- | --- | --- |
| Entrada del plugin y resumen de funcionalidades | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L1-L12) | 1-12 |
| Lista de funcionalidades principales | [`README.md`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/README.md#L5-L11) | 5-11 |
| Prioridad de descubrimiento de habilidades | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L241-L246) | 241-246 |
| Inyección de mensajes sintéticos | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162) | 147-162 |
| Mecanismo de recuperación de compresión | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L144-L151) | 144-151 |
| Módulo de coincidencia semántica | [`src/embeddings.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/embeddings.ts#L108-L135) | 108-135 |

**Constantes clave**:
- `EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2"`：Modelo de embedding utilizado
- `SIMILARITY_THRESHOLD = 0.35`：Umbral de similitud semántica
- `TOP_K = 5`：Límite superior de habilidades devueltas en recomendación automática

**Funciones clave**:
- `discoverAllSkills()`：Descubre habilidades desde múltiples ubicaciones
- `use_skill()`：Inyecta el contenido de la habilidad al contexto de la sesión
- `matchSkills()`：Coincide habilidades relacionadas basándose en similitud semántica
- `injectSyntheticContent()`：Inyecta contenido sintético a la sesión

</details>
