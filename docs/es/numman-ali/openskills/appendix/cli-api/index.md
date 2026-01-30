---
title: "API CLI: Referencia de Comandos | OpenSkills"
subtitle: "API CLI: Referencia de Comandos | OpenSkills"
sidebarTitle: "Todo sobre comandos"
description: "Aprende la API de línea de comandos completa de OpenSkills. Consulta parámetros, opciones y ejemplos de uso de todos los comandos, y domina rápidamente el uso de comandos."
tags:
  - "API"
  - "CLI"
  - "Referencia de comandos"
  - "Descripción de opciones"
prerequisite: []
order: 1
---

# Referencia de API CLI de OpenSkills

## Qué aprenderás

- Conocer el uso completo de todos los comandos de OpenSkills
- Dominar los parámetros y opciones de cada comando
- Saber cómo combinar comandos para completar tareas

## Qué es esto

La referencia de API CLI de OpenSkills proporciona documentación completa de todos los comandos, incluyendo parámetros, opciones y ejemplos de uso. Este es el manual de referencia que consultas cuando necesitas comprender en profundidad un comando específico.

---

## Resumen

La CLI de OpenSkills proporciona los siguientes comandos:

```bash
openskills install <source>   # Instalar habilidades
openskills list                # Listar habilidades instaladas
openskills read <name>         # Leer contenido de habilidad
openskills sync                # Sincronizar con AGENTS.md
openskills update [name...]    # Actualizar habilidades
openskills manage              # Gestionar habilidades de forma interactiva
openskills remove <name>       # Eliminar habilidad
```

---

## Comando install

Instala habilidades desde GitHub, rutas locales o repositorios git privados.

### Sintaxis

```bash
openskills install <source> [options]
```

### Parámetros

| Parámetro | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `<source>` | string | Y | Fuente de la habilidad (ver formatos de origen abajo) |

### Opciones

| Opción | Abreviatura | Tipo | Por defecto | Descripción |
| --- | --- | --- | --- | --- |
| `--global` | `-g` | flag | false | Instalar globalmente en `~/.claude/skills/` |
| `--universal` | `-u` | flag | false | Instalar en `.agent/skills/` (entorno multiagente) |
| `--yes` | `-y` | flag | false | Saltar selección interactiva, instalar todas las habilidades encontradas |

### Formatos de origen

| Formato | Ejemplo | Descripción |
| --- | --- | --- |
| Abreviación de GitHub | `anthropics/skills` | Instalar desde repositorio público de GitHub |
| URL de Git | `https://github.com/owner/repo.git` | URL completa de Git |
| URL de Git SSH | `git@github.com:owner/repo.git` | Repositorio privado SSH |
| Ruta local | `./my-skill` o `~/dev/skills` | Instalar desde directorio local |

### Ejemplos

```bash
# Instalar desde GitHub (selección interactiva)
openskills install anthropics/skills

# Instalar desde GitHub (no interactiva)
openskills install anthropics/skills -y

# Instalar globalmente
openskills install anthropics/skills --global

# Instalar en entorno multiagente
openskills install anthropics/skills --universal

# Instalar desde ruta local
openskills install ./my-custom-skill

# Instalar desde repositorio privado
openskills install git@github.com:your-org/private-skills.git
```

### Salida

Después de una instalación exitosa se muestra:
- Lista de habilidades instaladas
- Ubicación de instalación (project/global)
- Sugerencia para ejecutar `openskills sync`

---

## Comando list

Lista todas las habilidades instaladas.

### Sintaxis

```bash
openskills list
```

### Parámetros

Ninguno.

### Opciones

Ninguna.

### Ejemplos

```bash
openskills list
```

### Salida

```
Habilidades instaladas:

┌────────────────────┬────────────────────────────────────┬──────────┐
│ Nombre de habilidad│ Descripción                         │ Ubicación│
├────────────────────┼────────────────────────────────────┼──────────┤
│ pdf                │ PDF manipulation toolkit             │ project  │
│ git-workflow       │ Git workflow automation              │ global   │
│ skill-creator      │ Guide for creating effective skills  │ project  │
└────────────────────┴────────────────────────────────────┴──────────┘

Total: 3 habilidades (2 de nivel de proyecto, 1 global)
```

### Descripción de ubicación de habilidades

- **project**: Instalado en `.claude/skills/` o `.agent/skills/`
- **global**: Instalado en `~/.claude/skills/` o `~/.agent/skills/`

---

## Comando read

Lee el contenido de la habilidad a la salida estándar (para uso por agentes de IA).

### Sintaxis

```bash
openskills read <skill-names...>
```

### Parámetros

| Parámetro | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `<skill-names...>` | string | Y | Nombre de habilidad (admite lista separada por comas) |

### Opciones

Ninguna.

### Ejemplos

```bash
# Leer una sola habilidad
openskills read pdf

# Leer múltiples habilidades (separadas por comas)
openskills read pdf,git-workflow

# Leer múltiples habilidades (separadas por espacios)
openskills read pdf git-workflow
```

### Salida

```
=== SKILL: pdf ===
Base Directory: /path/to/.claude/skills/pdf
---
# PDF Skill Instructions

When user asks you to work with PDFs, follow these steps:
1. Install dependencies: `pip install pypdf2`
2. Extract text using scripts/extract_text.py
3. Use references/api-docs.md for details

=== END SKILL ===
```

### Uso

Este comando se usa principalmente para que los agentes de IA carguen el contenido de habilidades. Los usuarios también pueden usarlo para ver la descripción detallada de una habilidad.

---

## Comando sync

Sincroniza las habilidades instaladas con AGENTS.md (u otros archivos).

### Sintaxis

```bash
openskills sync [options]
```

### Parámetros

Ninguno.

### Opciones

| Opción | Abreviatura | Tipo | Por defecto | Descripción |
| --- | --- | --- | --- | --- |
| `--output <path>` | `-o` | string | `AGENTS.md` | Ruta del archivo de salida |
| `--yes` | `-y` | flag | false | Saltar selección interactiva, sincronizar todas las habilidades |

### Ejemplos

```bash
# Sincronizar con AGENTS.md predeterminado (interactiva)
openskills sync

# Sincronizar con ruta personalizada
openskills sync -o .ruler/AGENTS.md

# Sincronización no interactiva (CI/CD)
openskills sync -y

# Sincronización no interactiva con ruta personalizada
openskills sync -y -o .ruler/AGENTS.md
```

### Salida

Después de completar la sincronización, se generará el siguiente contenido en el archivo especificado:

```xml
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
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

---

## Comando update

Actualiza las habilidades instaladas desde su origen.

### Sintaxis

```bash
openskills update [skill-names...]
```

### Parámetros

| Parámetro | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `[skill-names...]` | string | N | Nombres de habilidades (separados por comas), por defecto todas |

### Opciones

Ninguna.

### Ejemplos

```bash
# Actualizar todas las habilidades instaladas
openskills update

# Actualizar habilidades específicas
openskills update pdf,git-workflow

# Actualizar una sola habilidad
openskills update pdf
```

### Salida

```
Updating skills...

✓ Updated pdf (project)
✓ Updated git-workflow (project)
⚠ Skipped old-skill (no metadata)

Summary:
- Updated: 2
- Skipped: 1
```

### Reglas de actualización

- Solo se actualizan habilidades con registro de metadatos
- Habilidades de ruta local: copiar directamente desde la ruta de origen
- Habilidades de repositorio Git: clonar nuevamente y copiar
- Habilidades sin metadatos: saltar y sugerir reinstalación

---

## Comando manage

Gestión interactiva (eliminación) de habilidades instaladas.

### Sintaxis

```bash
openskills manage
```

### Parámetros

Ninguno.

### Opciones

Ninguna.

### Ejemplos

```bash
openskills manage
```

### Interfaz interactiva

```
Selecciona las habilidades a eliminar:

[ ] pdf - PDF manipulation toolkit
[ ] git-workflow - Git workflow automation
[*] skill-creator - Guide for creating effective skills

Acciones: [↑/↓] Seleccionar [Espacio] Alternar [Enter] Confirmar [Esc] Cancelar
```

### Salida

```
Eliminadas 1 habilidad:
- skill-creator (project)
```

---

## Comando remove

Elimina una habilidad instalada específica (modo con scripts).

### Sintaxis

```bash
openskills remove <skill-name>
```

### Alias

`rm`

### Parámetros

| Parámetro | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| `<skill-name>` | string | Y | Nombre de la habilidad |

### Opciones

Ninguna.

### Ejemplos

```bash
# Eliminar habilidad
openskills remove pdf

# Usar alias
openskills rm pdf
```

### Salida

```
Habilidad eliminada: pdf (project)
Ubicación: /path/to/.claude/skills/pdf
Origen: anthropics/skills
```

---

## Opciones globales

Las siguientes opciones aplican a todos los comandos:

| Opción | Abreviatura | Tipo | Por defecto | Descripción |
| --- | --- | --- | --- | --- |
| `--version` | `-V` | flag | - | Mostrar número de versión |
| `--help` | `-h` | flag | - | Mostrar información de ayuda |

### Ejemplos

```bash
# Mostrar versión
openskills --version

# Mostrar ayuda global
openskills --help

# Mostrar ayuda de comando específico
openskills install --help
```

---

## Prioridad de búsqueda de habilidades

Cuando existen múltiples ubicaciones de instalación, las habilidades se buscan con la siguiente prioridad (de mayor a menor):

1. `./.agent/skills/` - Nivel de proyecto universal
2. `~/.agent/skills/` - Nivel global universal
3. `./.claude/skills/` - Nivel de proyecto
4. `~/.claude/skills/` - Nivel global

**Importante**: Solo se devuelve la primera habilidad coincidente encontrada (la de mayor prioridad).

---

## Códigos de salida

| Código de salida | Descripción |
| --- | --- |
| 0 | Éxito |
| 1 | Error (error de parámetros, fallo de comando, etc.) |

---

## Variables de entorno

La versión actual no admite configuración de variables de entorno.

---

## Archivos de configuración

OpenSkills utiliza los siguientes archivos de configuración:

- **Metadatos de habilidad**: `.claude/skills/<skill-name>/.openskills.json`
  - Registra origen de instalación, marca de tiempo, etc.
  - Usado por el comando `update` para refrescar habilidades

### Ejemplo de metadatos

```json
{
  "name": "pdf",
  "source": "anthropics/skills",
  "sourceType": "github",
  "repoUrl": "https://github.com/anthropics/skills.git",
  "subpath": "pdf",
  "installedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Próxima clase

> En la próxima clase aprenderemos sobre **[Especificación del formato AGENTS.md](../agents-md-format/)**.
>
> Aprenderás:
> - Estructura de etiquetas XML de AGENTS.md y el significado de cada etiqueta
> - Definiciones de campos de la lista de habilidades y limitaciones de uso
> - Cómo OpenSkills genera y actualiza AGENTS.md
> - Métodos de marcado (etiquetas XML y comentarios HTML)

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Comando | Ruta del archivo | Líneas |
| --- | --- | --- |
| Entrada CLI | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts) | 13-80 |
| Comando install | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 1-562 |
| Comando list | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts) | 1-50 |
| Comando read | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts) | 1-50 |
| Comando sync | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts) | 1-101 |
| Comando update | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts) | 1-173 |
| Comando manage | [`src/commands/manage.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/manage.ts) | 1-50 |
| Comando remove | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts) | 1-30 |
| Definiciones de tipos | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts) | 1-25 |

**Constantes clave**:
- Sin constantes globales

**Tipos clave**:
- `Skill`: Interfaz de información de habilidad (name, description, location, path)
- `SkillLocation`: Interfaz de ubicación de habilidad (path, baseDir, source)
- `InstallOptions`: Interfaz de opciones de instalación (global, universal, yes)

**Funciones clave**:
- `program.command()`: Definir comandos (commander.js)
- `program.option()`: Definir opciones (commander.js)
- `program.action()`: Definir función de procesamiento de comandos (commander.js)

</details>
