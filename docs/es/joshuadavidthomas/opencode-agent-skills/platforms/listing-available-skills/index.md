---
title: "Gestión de habilidades: Consultar habilidades disponibles | opencode-agent-skills"
sidebarTitle: "Buscar habilidades rápidamente"
subtitle: "Gestión de habilidades: Consultar habilidades disponibles"
description: "Aprende el uso de la herramienta get_available_skills. Localiza habilidades rápidamente mediante búsqueda, espacios de nombres y filtrado, dominando las funciones principales de descubrimiento y gestión de habilidades."
tags:
  - "gestión de habilidades"
  - "uso de herramientas"
  - "espacios de nombres"
prerequisite:
  - "start-installation"
order: 2
---

# Consultar y listar habilidades disponibles

## Lo que podrás hacer después de completar esta lección

- Utilizar la herramienta `get_available_skills` para listar todas las habilidades disponibles
- Filtrar habilidades específicas mediante consultas de búsqueda
- Usar espacios de nombres (como `project:skill-name`) para localizar habilidades con precisión
- Identificar el origen de habilidades y la lista de scripts ejecutables

## Tu situación actual

Deseas usar una habilidad, pero no recuerdas su nombre exacto. Quizás sabes que es una habilidad del proyecto, pero no sabes en qué ruta de descubrimiento se encuentra. O simplemente quieres explorar rápidamente qué habilidades tiene disponible el proyecto actual.

## Cuándo usar esta técnica

- **Explorar nuevos proyectos**: Al unirte a un nuevo proyecto, conocer rápidamente qué habilidades están disponibles
- **Nombre de habilidad incierto**: Solo recuerdas parte del nombre o descripción de la habilidad, necesitando coincidencia aproximada
- **Conflictos de múltiples espacios de nombres**: Existen habilidades con el mismo nombre a nivel de proyecto y de usuario, necesitas especificar explícitamente cuál usar
- **Buscar scripts**: Quieres saber qué scripts de automatización hay disponibles en el directorio de habilidades

## Idea central

La herramienta `get_available_skills` te ayuda a ver todas las habilidades disponibles en la sesión actual. El complemento escanea automáticamente habilidades desde 6 rutas de descubrimiento:

::: info Prioridad de descubrimiento de habilidades
1. `.opencode/skills/` (OpenCode a nivel de proyecto)
2. `.claude/skills/` (Claude a nivel de proyecto)
3. `~/.config/opencode/skills/` (OpenCode a nivel de usuario)
4. `~/.claude/skills/` (Claude a nivel de usuario)
5. `~/.claude/plugins/cache/` (caché de complementos)
6. `~/.claude/plugins/marketplaces/` (complementos instalados)
:::

Las habilidades con el mismo nombre solo conservan la primera según la prioridad, las posteriores son ignoradas.

La información devuelta por la herramienta incluye:
- **Nombre de habilidad**
- **Etiqueta de origen** (project, user, claude-project, etc.)
- **Descripción**
- **Lista de scripts ejecutables** (si los hay)

::: tip Sintaxis de espacios de nombres
Puedes especificar explícitamente el origen usando el formato `namespace:skill-name`:
- `project:my-skill` - Usar habilidad de OpenCode a nivel de proyecto (`.opencode/skills/`)
- `claude-project:my-skill` - Usar habilidad de Claude a nivel de proyecto (`.claude/skills/`)
- `user:my-skill` - Usar habilidad de OpenCode a nivel de usuario (`~/.config/opencode/skills/`)
- `claude-user:my-skill` - Usar habilidad de Claude a nivel de usuario (`~/.claude/skills/`)
- `claude-plugins:my-skill` - Usar habilidad de complementos de Claude
:::

## Sígueme

### Paso 1: Listar todas las habilidades disponibles

En OpenCode, pide directamente a la IA que liste las habilidades:

```
Entrada del usuario:
Listar todas las habilidades disponibles

Respuesta del sistema:
skill-helper (project)
  Asistente de operaciones Git y gestión de ramas [scripts: tools/branch.sh, tools/commit.sh]

test-helper (user)
  Herramienta de pruebas unitarias y análisis de cobertura

docker-helper (project)
  Guía de contenedorización y despliegue con Docker [scripts: build.sh, deploy.sh]

claude-code-superpowers (claude-plugins)
  Flujo de trabajo completo de desarrollo de software
```

**Lo que deberías ver**: Una lista de habilidades, mostrando para cada una el nombre, etiqueta de origen, descripción y lista de scripts.

### Paso 2: Usar consultas de búsqueda para filtrar

Si solo recuerdas parte del nombre de la habilidad:

```
Entrada del usuario:
Buscar habilidades que contengan "docker"

Respuesta del sistema:
docker-helper (project)
  Guía de contenedorización y despliegue con Docker [scripts: build.sh, deploy.sh]
```

La búsqueda coincide con palabras clave en el nombre y descripción de la habilidad, soporta el comodín `*`:

```
Entrada del usuario:
Buscar habilidades que comiencen con "test"

Respuesta del sistema:
test-helper (user)
  Herramienta de pruebas unitarias y análisis de cobertura
```

**Lo que deberías ver**: Solo se muestran las habilidades que coinciden con la consulta.

### Paso 3: Experimentar con sugerencias de coincidencia aproximada

Si ingresas un nombre de habilidad incorrecto:

```
Entrada del usuario:
Quiero usar docker-asistant

Respuesta del sistema:
No se encontraron habilidades que coincidan con "docker-asistant". ¿Quisiste decir "docker-helper"?
```

El complemento calcula la similitud basándose en la distancia de Levenshtein y sugiere automáticamente el nombre de habilidad más cercano.

**Lo que deberías ver**: Mensaje de error y sugerencia de la habilidad correcta.

### Paso 4: Usar espacios de nombres para localizar con precisión

Supongamos que tanto a nivel de proyecto como de usuario existe una habilidad llamada `build-helper`:

```
Entrada del usuario:
Listar información detallada de build-helper

Respuesta del sistema:
build-helper (project)
  Configuración de construcción específica del proyecto y optimización de compilación [scripts: build.sh, optimize.sh]
```

Si el usuario quiere la habilidad a nivel de usuario:

```
Entrada del usuario:
Usar user:build-helper

Respuesta del sistema:
build-helper (user)
  Cadena de herramientas de construcción general y configuración de integración continua [scripts: ci.sh, test.sh]
```

**Lo que deberías ver**: Mediante el prefijo de espacio de nombres puedes acceder a habilidades con el mismo nombre de diferentes orígenes.

### Paso 5: Verificar scripts ejecutables

Ver qué scripts hay en el directorio de habilidades:

```
Entrada del usuario:
¿Qué scripts tiene docker-helper?

Respuesta del sistema:
docker-helper (project)
  Guía de contenedorización y despliegue con Docker [scripts: build.sh, deploy.sh]
```

Los scripts se muestran entre corchetes en la información de habilidad, separados por comas. Puedes ejecutar estos scripts usando la herramienta `run_skill_script`.

**Lo que deberías ver**: Después del nombre de habilidad aparece una lista en formato `[scripts: ruta-de-script1, ruta-de-script2, ...]`.

## Punto de control ✅

- [ ] ¿Puedes listar todas las habilidades disponibles?
- [ ] ¿Puedes filtrar habilidades específicas mediante consultas de búsqueda?
- [ ] ¿Puedes comprender el significado de las etiquetas de origen de habilidades (project, user, claude-project, etc.)?
- [ ] ¿Puedes explicar la función y la sintaxis de los espacios de nombres de habilidades?
- [ ] ¿Puedes identificar la lista de scripts ejecutables desde la información de habilidad?

## Advertencias sobre trampas

### Trampa 1: Sobrescritura de habilidades con el mismo nombre

Si a nivel de proyecto y de usuario existen habilidades con el mismo nombre, podrías confundirte sobre por qué no se carga la habilidad que esperabas.

**Causa**: Las habilidades se descubren por prioridad, el nivel de proyecto tiene prioridad sobre el nivel de usuario, con el mismo nombre solo se conserva la primera.

**Solución**: Especifica explícitamente usando espacios de nombres, como `user:my-skill` en lugar de `my-skill`.

### Trampa 2: Búsqueda sensible a mayúsculas y minúsculas

Las consultas de búsqueda usan expresiones regulares, pero están configuradas con el flag `i`, por lo que no distinguen mayúsculas y minúsculas.

```bash
# Estas búsquedas son equivalentes
get_available_skills(query="docker")
get_available_skills(query="DOCKER")
get_available_skills(query="Docker")
```

### Trampa 3: Escapar comodines

El `*` en la búsqueda se convierte automáticamente a la expresión regular `.*`, no necesitas escaparlo manualmente:

```bash
# Buscar habilidades que comiencen con "test"
get_available_skills(query="test*")

# Equivalente a la expresión regular /test.*/i
```

## Resumen de esta lección

`get_available_skills` es una herramienta para explorar el ecosistema de habilidades, soporta:

- **Listar todas las habilidades**: Llamar sin parámetros
- **Filtrado de búsqueda**: Coincidir nombres y descripciones mediante el parámetro `query`
- **Espacios de nombres**: Localizar con precisión usando `namespace:skill-name`
- **Sugerencias de coincidencia aproximada**: Sugerir automáticamente el nombre correcto al cometer errores de escritura
- **Lista de scripts**: Mostrar scripts de automatización ejecutables

El complemento inyecta automáticamente la lista de habilidades al inicio de la sesión, por lo que generalmente no necesitas llamar manualmente a esta herramienta. Pero es útil en los siguientes escenarios:
- Quieres explorar rápidamente las habilidades disponibles
- No recuerdas el nombre exacto de la habilidad
- Necesitas distinguir diferentes orígenes de habilidades con el mismo nombre
- Quieres ver la lista de scripts de una habilidad específica

## Próxima lección

> En la próxima lección aprenderemos **[Cargar habilidades en el contexto de la sesión](../loading-skills-into-context/)**.
>
> Aprenderás:
> - Usar la herramienta use_skill para cargar habilidades a la sesión actual
> - Comprender cómo el contenido de las habilidades se inyecta en el contexto en formato XML
> - Dominar el mecanismo de Synthetic Message Injection (inyección de mensajes sintéticos)
> - Entender cómo las habilidades permanecen disponibles después de la compresión de la sesión

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-24

| Funcionalidad | Ruta del archivo                                                                                    | Línea    |
|--- | --- | ---|
| Definición de la herramienta GetAvailableSkills | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L29-L72)         | 29-72   |
| Función discoverAllSkills | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L240-L263) | 240-263 |
| Función resolveSkill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| Función findClosestMatch | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L88-L125)    | 88-125  |

**Tipos clave**:
- `SkillLabel = "project" | "user" | "claude-project" | "claude-user" | "claude-plugins"`: Enumeración de etiquetas de origen de habilidades

**Constantes clave**:
- Umbral de coincidencia aproximada: `0.4` (`utils.ts:124`) - Similaridad inferior a este valor no devuelve sugerencias

**Funciones clave**:
- `GetAvailableSkills()`: Devuelve la lista de habilidades formateada, soporta filtrado por consulta y sugerencias de coincidencia aproximada
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>)`: Soporta análisis de habilidades en formato `namespace:skill-name`
- `findClosestMatch(input: string, candidates: string[])`: Calcula la mejor coincidencia basándose en múltiples estrategias de coincidencia (prefijo, contiene, distancia de edición)

**Reglas de negocio**:
- Las habilidades con el mismo nombre se deduplican según el orden de descubrimiento, solo se conserva la primera (`skills.ts:258`)
- Las consultas de búsqueda soportan el comodín `*`, convertido automáticamente a expresión regular (`tools.ts:43`)
- Las sugerencias de coincidencia aproximada solo se activan cuando hay un parámetro de consulta y no hay resultados (`tools.ts:49-57`)

</details>
