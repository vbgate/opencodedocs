---
title: "Estructura de Archivos: Organización de Directorios | opencode-openskills"
sidebarTitle: "Ubicación de Skills"
subtitle: "Estructura de Archivos: Organización de Directorios | opencode-openskills"
description: "Aprende la organización de directorios y archivos de OpenSkills. Domina los directorios de instalación de skills, estructura de directorios, especificaciones del formato AGENTS.md y prioridad de búsqueda."
tags:
- "Apéndice"
- "Estructura de Archivos"
- "Organización de Directorios"
prerequisite: []
order: 3
---

# Estructura de Archivos

## Visión General

La estructura de archivos de OpenSkills se divide en tres categorías: **directorios de instalación de skills**, **estructura de directorios de skills** y **archivos de sincronización AGENTS.md**. Comprender estas estructuras te ayudará a gestionar y utilizar los skills de manera más efectiva.

## Directorios de Instalación de Skills

OpenSkills admite 4 ubicaciones de instalación de skills, ordenadas por prioridad de mayor a menor:

| Prioridad | Ubicación | Descripción | Cuándo Usar |
| --- | --- | --- | --- |
| 1 | `./.agent/skills/` | Modo Universal local del proyecto | Entornos multi-agente, evitar conflictos con Claude Code |
| 2 | `~/.agent/skills/` | Modo Universal global | Entornos multi-agente + instalación global |
| 3 | `./.claude/skills/` | Local del proyecto (predeterminado) | Instalación estándar, skills específicos del proyecto |
| 4 | `~/.claude/skills/` | Instalación global | Skills compartidos entre todos los proyectos |

**Recomendaciones de Selección**:
- Entorno de agente único: usar `.claude/skills/` predeterminado
- Entorno multi-agente: usar `.agent/skills/` (flag `--universal`)
- Skills generales entre proyectos: usar instalación global (flag `--global`)

## Estructura de Directorios de Skills

Cada skill es un directorio independiente que contiene archivos obligatorios y recursos opcionales:

```
skill-name/
├── SKILL.md              # Obligatorio: archivo principal del skill
├── .openskills.json      # Obligatorio: metadatos de instalación (generado automáticamente)
├── references/           # Opcional: documentación de referencia
│   └── api-docs.md
├── scripts/              # Opcional: scripts ejecutables
│   └── helper.py
└── assets/               # Opcional: plantillas y archivos de salida
    └── template.json
```

### Descripción de Archivos

#### SKILL.md (Obligatorio)

El archivo principal del skill, que contiene el frontmatter YAML y las instrucciones del skill:

```yaml
---
name: my-skill
description: Descripción del skill
---

## Título del Skill

Contenido de las instrucciones del skill...
```

**Puntos Clave**:
- El nombre del archivo debe ser `SKILL.md` (en mayúsculas)
- El frontmatter YAML debe contener `name` y `description`
- El contenido usa forma imperativa (imperative form)

#### .openskills.json (Obligatorio, generado automáticamente)

Archivo de metadatos creado automáticamente por OpenSkills, que registra el origen de la instalación:

```json
{
  "source": "anthropics/skills",
  "sourceType": "github",
  "repoUrl": "https://github.com/anthropics/skills.git",
  "subpath": "pdf",
  "installedAt": "2026-01-24T12:00:00.000Z"
}
```

**Propósito**:
- Soporte para actualización de skills (`openskills update`)
- Registro de marca de tiempo de instalación
- Seguimiento del origen del skill

**Ubicación del Código Fuente**:
- `src/utils/skill-metadata.ts:29-36` - escritura de metadatos
- `src/utils/skill-metadata.ts:17-27` - lectura de metadatos

#### references/ (Opcional)

Almacena documentación de referencia y especificaciones de API:

```
references/
├── skill-format.md       # Especificaciones del formato de skill
├── api-docs.md           # Documentación de API
└── best-practices.md     # Mejores prácticas
```

**Escenarios de Uso**:
- Documentación técnica detallada (mantener SKILL.md conciso)
- Manuales de referencia de API
- Código de ejemplo y plantillas

#### scripts/ (Opcional)

Almacena scripts ejecutables:

```
scripts/
├── extract_text.py       # Script de Python
├── deploy.sh             # Script de Shell
└── build.js              # Script de Node.js
```

**Escenarios de Uso**:
- Scripts de automatización necesarios durante la ejecución del skill
- Herramientas de procesamiento y transformación de datos
- Scripts de despliegue y construcción

#### assets/ (Opcional)

Almacena plantillas y archivos de salida:

```
assets/
├── template.json         # Plantilla JSON
├── config.yaml           # Archivo de configuración
└── output.md             # Ejemplo de salida
```

**Escenarios de Uso**:
- Plantillas para contenido generado por el skill
- Ejemplos de archivos de configuración
- Ejemplos de salida esperada

## Estructura de AGENTS.md

El archivo AGENTS.md generado por `openskills sync` contiene la descripción del sistema de skills y la lista de skills disponibles:

### Formato Completo

```markdown
<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively.

How to use skills:
- Invoke: `npx openskills read <skill-name>` (run in your shell)
- The skill content will load with detailed instructions
- Base directory provided in output for resolving bundled resources

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables...</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

### Descripción de Componentes

| Componente | Descripción |
| --- | --- |
| `<skills_system>` | Etiqueta XML, marca la sección del sistema de skills |
| `<usage>` | Instrucciones de uso de skills (indica a la IA cómo invocar skills) |
| `<available_skills>` | Lista de skills disponibles (cada skill tiene una etiqueta `<skill>`) |
| `<skill>` | Información de un skill individual (name, description, location) |
| `<!-- SKILLS_TABLE_START -->` | Marca de inicio (usada para localizar durante la sincronización) |
| `<!-- SKILLS_TABLE_END -->` | Marca de fin (usada para localizar durante la sincronización) |

**Campo location**:
- `project` - Skill local del proyecto (`.claude/skills/` o `.agent/skills/`)
- `global` - Skill global (`~/.claude/skills/` o `~/.agent/skills/`)

## Prioridad de Búsqueda de Directorios

OpenSkills recorre los directorios en el siguiente orden de prioridad al buscar skills:

```typescript
// Ubicación del código fuente: src/utils/dirs.ts:18-25
[
  join(process.cwd(), '.agent/skills'),    // 1. Universal del proyecto
  join(homedir(), '.agent/skills'),        // 2. Universal global
  join(process.cwd(), '.claude/skills'),   // 3. Claude del proyecto
  join(homedir(), '.claude/skills'),       // 4. Claude global
]
```

**Reglas**:
- Detener la búsqueda inmediatamente después de encontrar el primer skill coincidente
- Los skills locales del proyecto tienen prioridad sobre los globales
- El modo Universal tiene prioridad sobre el modo estándar

**Ubicación del Código Fuente**: `src/utils/skills.ts:30-64` - implementación de búsqueda de todos los skills

## Ejemplo: Estructura Completa del Proyecto

Una estructura de proyecto típica que utiliza OpenSkills:

```
my-project/
├── AGENTS.md             # Lista de skills generada por sincronización
├── .claude/              # Configuración de Claude Code
│   └── skills/           # Directorio de instalación de skills
│       ├── pdf/
│       │   ├── SKILL.md
│       │   ├── .openskills.json
│       │   ├── references/
│       │   ├── scripts/
│       │   └── assets/
│       └── git-workflow/
│           ├── SKILL.md
│           └── .openskills.json
├── .agent/               # Directorio del modo Universal (opcional)
│   └── skills/
│       └── my-custom-skill/
│           ├── SKILL.md
│           └── .openskills.json
├── src/                  # Código fuente del proyecto
├── package.json
└── README.md
```

## Mejores Prácticas

### 1. Selección de Directorio

| Escenario | Directorio Recomendado | Comando |
| --- | --- | --- |
| Skills específicos del proyecto | `.claude/skills/` | `openskills install repo` |
| Compartido entre múltiples agentes | `.agent/skills/` | `openskills install repo --universal` |
| Uso general entre proyectos | `~/.claude/skills/` | `openskills install repo --global` |

### 2. Organización de Skills

- **Repositorio de skill único**: colocar `SKILL.md` en el directorio raíz
- **Repositorio de múltiples skills**: subdirectorios que contienen `SKILL.md` respectivamente
- **Enlaces simbólicos**: usar symlink para vincular al repositorio local durante el desarrollo (ver [Soporte de Enlaces Simbólicos](../../advanced/symlink-support/))

### 3. Control de Versiones de AGENTS.md

- **Recomendación de commit**: agregar `AGENTS.md` al control de versiones
- **Sincronización CI**: ejecutar `openskills sync -y` en CI/CD (ver [Integración CI/CD](../../advanced/ci-integration/))
- **Colaboración en equipo**: los miembros del equipo ejecutan `openskills sync` sincrónicamente para mantener la consistencia

## Resumen de la Lección

La estructura de archivos de OpenSkills está diseñada de manera simple y clara:

- **4 directorios de instalación**: soporte para local del proyecto, global y modo Universal
- **Directorio de skill**: SKILL.md obligatorio + .openskills.json generado automáticamente + recursos/scripts/assets opcionales
- **AGENTS.md**: lista de skills generada por sincronización, siguiendo el formato de Claude Code

Comprender estas estructuras te ayudará a gestionar y utilizar los skills de manera más eficiente.

## Próxima Lección

> En la próxima lección aprenderemos **[Glosario](../glossary/)**.
>
> Aprenderás:
> - Términos clave de OpenSkills y el sistema de skills de IA
> - Definiciones precisas de conceptos profesionales
> - Significados de abreviaturas comunes

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-24

| Función | Ruta del Archivo | Número de Línea |
| --- | --- | --- |
| Utilidad de rutas de directorio | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 1-25 |
| Búsqueda de skills | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 30-84 |
| Gestión de metadatos | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts) | 1-36 |

**Funciones Clave**:
- `getSkillsDir(projectLocal, universal)` - obtener rutas de directorios de skills
- `getSearchDirs()` - obtener 4 directorios de búsqueda (por prioridad)
- `findAllSkills()` - buscar todos los skills instalados
- `findSkill(skillName)` - buscar un skill específico
- `readSkillMetadata(skillDir)` - leer metadatos del skill
- `writeSkillMetadata(skillDir, metadata)` - escribir metadatos del skill

</details>
