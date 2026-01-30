---
title: "Formato de AGENTS.md: Especificación de Habilidades | openskills"
sidebarTitle: "Haz que la IA Conozca tus Habilidades"
subtitle: "Especificación del Formato AGENTS.md"
description: "Aprende la estructura de etiquetas XML y la definición de lista de habilidades del archivo AGENTS.md. Entiende el significado de los campos, el mecanismo de generación y las mejores prácticas, domina el funcionamiento del sistema de habilidades."
tags:
  - "appendix"
  - "reference"
  - "format"
prerequisite:
  - "/es/numman-ali/openskills/start/sync-to-agents/"
order: 2
---

# Especificación del Formato AGENTS.md

**AGENTS.md** es un archivo de descripción de habilidades generado por OpenSkills que informa a los agentes de IA (como Claude Code, Cursor, Windsurf, etc.) qué habilidades están disponibles y cómo invocar estas habilidades.

## Qué Podrás Hacer

- Entender la estructura XML de AGENTS.md y el significado de cada etiqueta
- Comprender la definición de campos y las restricciones de uso de la lista de habilidades
- Saber cómo editar AGENTS.md manualmente (no recomendado, pero a veces necesario)
- Entender cómo OpenSkills genera y actualiza este archivo

## Ejemplo Completo del Formato

A continuación se muestra un ejemplo completo de un archivo AGENTS.md:

```xml
# AGENTS

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>`
- For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>

<skill>
<name>open-source-maintainer</name>
<description>End-to-end GitHub repository maintenance for open-source projects. Use when asked to triage issues, review PRs, analyze contributor activity, generate maintenance reports, or maintain a repository.</description>
<location>project</location>
</skill>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms.</description>
<location>global</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

## Detalles de la Estructura de Etiquetas

### Contenedor Externo: `<skills_system>`

```xml
<skills_system priority="1">
  <!-- contenido de habilidades -->
</skills_system>
```

- **priority**: marcador de prioridad (fijo en `"1"`), le dice al agente de IA la importancia de este sistema de habilidades

::: tip Nota
El atributo `priority` se reserva para uso futuro en expansiones, todos los AGENTS.md utilizan el valor fijo `"1"`.
:::

### Instrucciones de Uso: `<usage>`

La etiqueta `<usage>` contiene instrucciones sobre cómo el agente de IA debe usar las habilidades:

```xml
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>`
  - For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>
```

**Puntos Clave**:
- **Condición de activación**: verificar si la tarea del usuario puede completarse más eficientemente con habilidades
- **Método de invocación**: usar el comando `npx openskills read <skill-name>`
- **Invocación múltiple**: soporta múltiples nombres de habilidades separados por comas
- **Directorio base**: la salida incluye el campo `base_dir`, usado para resolver archivos referenciados en la habilidad (como `references/`, `scripts/`, `assets/`)
- **Restricciones de uso**:
  - Solo usar habilidades listadas en `<available_skills>`
  - No volver a cargar habilidades que ya están en el contexto
  - Cada invocación de habilidad es sin estado

### Lista de Habilidades: `<available_skills>`

`<available_skills>` contiene la lista de todas las habilidades disponibles, cada habilidad se define con una etiqueta `<skill>`:

```xml
<available_skills>

<skill>
<name>skill-name</name>
<description>descripción de la habilidad...</description>
<location>project</location>
</skill>

<skill>
<name>another-skill</name>
<description>otra descripción de habilidad...</description>
<location>global</location>
</skill>

</available_skills>
```

#### Campos de la Etiqueta `<skill>`

Cada `<skill>` contiene los siguientes campos obligatorios:

| Campo         | Tipo   | Valores opcionales     | Descripción                                                      |
|--- | --- | --- | ---|
| `<name>`      | string | -                      | Nombre de la habilidad (debe coincidir con el nombre del archivo SKILL.md o `name` en YAML) |
| `<description>` | string | -                      | Descripción de la habilidad (proviene del YAML frontmatter de SKILL.md) |
| `<location>`  | string | `project` \| `global`  | Marcador de ubicación de instalación de la habilidad (para que el agente de IA entienda el origen de la habilidad) |

**Descripción de Campos**:

- **`<name>`**: identificador único de la habilidad, el agente de IA invoca la habilidad a través de este nombre
- **`<description>`**: explica en detalle la función y escenarios de uso de la habilidad, ayuda a la IA a determinar si necesita usar esta habilidad
- **`<location>`**:
  - `project`: instalado localmente en el proyecto (`.claude/skills/` o `.agent/skills/`)
  - `global`: instalado en el directorio global (`~/.claude/skills/`)

::: info ¿Por qué se necesita el marcador location?
El marcador `<location>` ayuda al agente de IA a entender el alcance de visibilidad de las habilidades:
- Las habilidades `project` solo están disponibles en el proyecto actual
- Las habilidades `global` están disponibles en todos los proyectos
Esto afecta la estrategia de selección de habilidades del agente de IA.
:::

## Métodos de Marcado

AGENTS.md soporta dos métodos de marcado, OpenSkills los reconoce automáticamente:

### Método 1: Marcado XML (Recomendado)

```xml
<skills_system priority="1">
  <!-- contenido de habilidades -->
</skills_system>
```

Este es el método predeterminado, usa etiquetas XML estándar para marcar el inicio y fin del sistema de habilidades.

### Método 2: Marcado de Comentarios HTML (Modo de Compatibilidad)

```xml
<!-- SKILLS_TABLE_START -->

## Available Skills

<usage>
  <!-- instrucciones de uso -->
</usage>

<available_skills>
  <!-- lista de habilidades -->
</available_skills>

<!-- SKILLS_TABLE_END -->
```

Este formato elimina el contenedor externo `<skills_system>` y solo usa comentarios HTML para marcar el inicio y fin del área de habilidades.

::: tip Lógica de Procesamiento de OpenSkills
La función `replaceSkillsSection()` (`src/utils/agents-md.ts:67-93`) buscará los marcadores en el siguiente orden de prioridad:
1. Primero busca el marcador XML `<skills_system>`
2. Si no encuentra, busca el comentario HTML `<!-- SKILLS_TABLE_START -->`
3. Si no encuentra ninguno, agrega el contenido al final del archivo
:::

## Cómo Genera AGENTS.md OpenSkills

Al ejecutar `openskills sync`, OpenSkills hará lo siguiente:

1. **Buscar todas las habilidades instaladas** (`findAllSkills()`)
2. **Selección interactiva de habilidades** (a menos que se use el flag `-y`)
3. **Generar contenido XML** (`generateSkillsXml()`)
   - Construir las instrucciones de uso `<usage>`
   - Generar etiquetas `<skill>` para cada habilidad
4. **Reemplazar la sección de habilidades en el archivo** (`replaceSkillsSection()`)
   - Buscar marcadores existentes (XML o comentarios HTML)
   - Reemplazar el contenido entre los marcadores
   - Si no hay marcadores, agregar al final del archivo

### Ubicación del Código Fuente

| Función           | Ruta del Archivo                                                                 | Líneas  |
|--- | --- | ---|
| Generar XML       | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62   |
| Reemplazar sección de habilidades | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93   |
| Analizar habilidades existentes | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18) | 6-18    |

## Notas para Edición Manual

::: warning Edición Manual No Recomendada
Aunque es posible editar AGENTS.md manualmente, se recomienda:
1. Usar el comando `openskills sync` para generar y actualizar
2. El contenido editado manualmente será sobrescrito en el siguiente `sync`
3. Si necesitas personalizar la lista de habilidades, usa la selección interactiva (sin el flag `-y`)
:::

Si realmente necesitas editar manualmente, ten en cuenta:

1. **Mantener la sintaxis XML correcta**: asegúrate de que todas las etiquetas se cierren correctamente
2. **No modificar los marcadores**: mantén `<skills_system>` o `<!-- SKILLS_TABLE_START -->` y otros marcadores
3. **Campos completos**: cada `<skill>` debe contener los tres campos `<name>`, `<description>`, `<location>`
4. **Sin habilidades duplicadas**: no agregues habilidades con el mismo nombre repetidamente

## Preguntas Frecuentes

### P1: ¿Por qué a veces AGENTS.md no tiene la etiqueta `<skills_system>`?

**R**: Este es el modo de compatibilidad. Si tu archivo usa marcadores de comentarios HTML (`<!-- SKILLS_TABLE_START -->`), OpenSkills también lo reconocerá. En el siguiente `sync`, se convertirá automáticamente al marcador XML.

### P2: ¿Cómo eliminar todas las habilidades?

**R**: Ejecuta `openskills sync` y deselecciona todas las habilidades en la interfaz interactiva, o ejecuta:

```bash
openskills sync -y --output /dev/null
```

Esto vaciará la sección de habilidades en AGENTS.md (pero mantendrá los marcadores).

### P3: ¿El campo location tiene un impacto real en los agentes de IA?

**R**: Esto depende de la implementación específica del agente de IA. En general:
- `location="project"` significa que la habilidad solo tiene sentido en el contexto del proyecto actual
- `location="global"` significa que la habilidad es una herramienta universal que se puede usar en cualquier proyecto

El agente de IA puede ajustar su estrategia de carga de habilidades según este marcador, pero la mayoría de los agentes (como Claude Code) ignorarán este campo e invocarán directamente `openskills read`.

### P4: ¿Qué longitud debe tener la descripción de la habilidad?

**R**: La descripción de la habilidad debe:
- **Ser concisa pero completa**: explicar la función principal y los principales escenarios de uso de la habilidad
- **Evitar ser demasiado corta**: una descripción de una sola línea hace difícil que la IA entienda cuándo usarla
- **Evitar ser demasiado larga**: las descripciones demasiado largas desperdician contexto y la IA no las leerá cuidadosamente

Longitud recomendada: **50-150 palabras**.

## Mejores Prácticas

1. **Usar el comando sync**: siempre usa `openskills sync` para generar AGENTS.md, en lugar de editar manualmente
2. **Actualizar regularmente**: después de instalar o actualizar habilidades, recuerda ejecutar `openskills sync`
3. **Seleccionar las habilidades apropiadas**: no todas las habilidades instaladas necesitan estar en AGENTS.md, selecciónalas según las necesidades del proyecto
4. **Verificar el formato**: si el agente de IA no puede reconocer las habilidades, verifica que las etiquetas XML en AGENTS.md sean correctas

## Avance del Próximo Tema

> En el próximo tema aprenderemos **[Estructura de Archivos](../file-structure/)**.
>
> Aprenderás:
> - La estructura de directorios y archivos generada por OpenSkills
> - La función y ubicación de cada archivo
> - Cómo entender y gestionar directorios de habilidades

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Clic para expandir y ver ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Función                 | Ruta del Archivo                                                                                     | Líneas  |
|--- | --- | ---|
| Generar XML de habilidades | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62   |
| Reemplazar sección de habilidades | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93   |
| Analizar habilidades existentes | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18)  | 6-18    |
| Definición de tipo Skill | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L6)           | 1-6     |

**Constantes Clave**:
- `priority="1"`: marcador de prioridad del sistema de habilidades (valor fijo)

**Funciones Clave**:
- `generateSkillsXml(skills: Skill[])`: genera lista de habilidades en formato XML
- `replaceSkillsSection(content: string, newSection: string)`: reemplaza o agrega sección de habilidades
- `parseCurrentSkills(content: string)`: analiza nombres de habilidades activadas desde AGENTS.md

</details>
