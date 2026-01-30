---
title: "API: Referencia de Herramientas | opencode-agent-skills"
sidebarTitle: "Las 4 Herramientas Disponibles"
subtitle: "API: Referencia de Herramientas | opencode-agent-skills"
description: "Aprende a usar las 4 herramientas API principales de opencode-agent-skills. Domina la configuración de parámetros, manejo de valores de retorno y técnicas de depuración de errores, comprende el soporte de namespaces y mecanismos de seguridad."
tags:
  - "API"
  - "Referencia de Herramientas"
  - "Documentación de Interfaces"
prerequisite:
  - "start-installation"
order: 2
---

# Referencia de Herramientas API

## Lo Que Aprenderás

A través de esta referencia API, podrás:

- Conocer los parámetros y valores de retorno de las 4 herramientas principales
- Dominar la forma correcta de invocar las herramientas
- Aprender a manejar situaciones de error comunes

## Resumen de Herramientas

El plugin OpenCode Agent Skills proporciona las siguientes 4 herramientas:

| Nombre de Herramienta | Descripción | Caso de Uso |
| --- | --- | --- |
| `get_available_skills` | Obtener lista de skills disponibles | Ver todos los skills disponibles, soporta filtrado por búsqueda |
| `read_skill_file` | Leer archivo de skill | Acceder a documentación, configuración y otros archivos de soporte del skill |
| `run_skill_script` | Ejecutar script de skill | Ejecutar scripts de automatización en el directorio del skill |
| `use_skill` | Cargar skill | Inyectar el contenido de SKILL.md en el contexto de la sesión |

---

## get_available_skills

Obtiene la lista de skills disponibles, soporta filtrado de búsqueda opcional.

### Parámetros

| Nombre | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `query` | string | No | Cadena de búsqueda, coincide con nombre y descripción del skill (soporta comodín `*`) |

### Valor de Retorno

Devuelve una lista formateada de skills, cada elemento incluye:

- Nombre del skill y etiqueta de origen (ej. `skill-name (project)`)
- Descripción del skill
- Lista de scripts disponibles (si los hay)

**Ejemplo de retorno**:
```
git-helper (project)
  Git operations and workflow automation tools
  [scripts: tools/commit.sh, tools/branch.sh]

code-review (user)
  Code review checklist and quality standards
```

### Manejo de Errores

- Cuando no hay resultados coincidentes, devuelve un mensaje informativo
- Si hay errores de escritura en el parámetro de búsqueda, devuelve sugerencias de skills similares

### Ejemplos de Uso

**Listar todos los skills**:
```
Entrada del usuario:
Listar todos los skills disponibles

Llamada de la IA:
get_available_skills()
```

**Buscar skills que contengan "git"**:
```
Entrada del usuario:
Buscar skills relacionados con git

Llamada de la IA:
get_available_skills({
  "query": "git"
})
```

**Búsqueda con comodines**:
```
Llamada de la IA:
get_available_skills({
  "query": "code*"
})

Retorno:
code-review (user)
  Code review checklist and quality standards
```

---

## read_skill_file

Lee archivos de soporte en el directorio del skill (documentación, configuración, ejemplos, etc.).

### Parámetros

| Nombre | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `skill` | string | Sí | Nombre del skill |
| `filename` | string | Sí | Ruta del archivo (relativa al directorio del skill, ej. `docs/guide.md`, `scripts/helper.sh`) |

### Valor de Retorno

Devuelve un mensaje de confirmación de carga exitosa del archivo.

**Ejemplo de retorno**:
```
File "docs/guide.md" from skill "code-review" loaded.
```

El contenido del archivo se inyecta en el contexto de la sesión en formato XML:

```xml
<skill-file skill="code-review" file="docs/guide.md">
  <metadata>
    <directory>/path/to/skills/code-review</directory>
  </metadata>
  
  <content>
[Contenido real del archivo]
  </content>
</skill-file>
```

### Manejo de Errores

| Tipo de Error | Mensaje de Retorno |
| --- | --- |
| Skill no existe | `Skill "xxx" not found. Use get_available_skills to list available skills.` |
| Ruta insegura | `Invalid path: cannot access files outside skill directory.` |
| Archivo no existe | `File "xxx" not found. Available files: file1, file2, ...` |

### Mecanismo de Seguridad

- Verificación de seguridad de ruta: previene ataques de directory traversal (ej. `../../../etc/passwd`)
- Solo permite acceso a archivos dentro del directorio del skill

### Ejemplos de Uso

**Leer documentación del skill**:
```
Entrada del usuario:
Ver la guía de uso del skill code-review

Llamada de la IA:
read_skill_file({
  "skill": "code-review",
  "filename": "docs/guide.md"
})
```

**Leer archivo de configuración**:
```
Llamada de la IA:
read_skill_file({
  "skill": "git-helper",
  "filename": "config.json"
})
```

---

## run_skill_script

Ejecuta scripts ejecutables en el directorio del skill.

### Parámetros

| Nombre | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `skill` | string | Sí | Nombre del skill |
| `script` | string | Sí | Ruta relativa del script (ej. `build.sh`, `tools/deploy.sh`) |
| `arguments` | string[] | No | Array de argumentos de línea de comandos para pasar al script |

### Valor de Retorno

Devuelve la salida del script.

**Ejemplo de retorno**:
```
Building project...
✓ Dependencies installed
✓ Tests passed
Build complete.
```

### Manejo de Errores

| Tipo de Error | Mensaje de Retorno |
| --- | --- |
| Skill no existe | `Skill "xxx" not found. Use get_available_skills to list available skills.` |
| Script no existe | `Script "xxx" not found in skill "yyy". Available scripts: script1, script2, ...` |
| Fallo de ejecución | `Script failed (exit 1): error message` |

### Reglas de Descubrimiento de Scripts

El plugin escanea automáticamente los archivos ejecutables en el directorio del skill:

- Profundidad máxima de recursión: 10 niveles
- Omite directorios ocultos (que comienzan con `.`)
- Omite directorios de dependencias comunes (`node_modules`, `__pycache__`, `.git`, etc.)
- Solo incluye archivos con bit de ejecución (`mode & 0o111`)

### Entorno de Ejecución

- El directorio de trabajo (CWD) cambia al directorio del skill
- El script se ejecuta en el contexto del directorio del skill
- La salida se devuelve directamente a la IA

### Ejemplos de Uso

**Ejecutar script de compilación**:
```
Entrada del usuario:
Ejecutar el script de compilación del proyecto

Llamada de la IA:
run_skill_script({
  "skill": "git-helper",
  "script": "tools/build.sh"
})
```

**Ejecutar con argumentos**:
```
Llamada de la IA:
run_skill_script({
  "skill": "deployment",
  "script": "deploy.sh",
  "arguments": ["--env", "production", "--force"]
})
```

---

## use_skill

Carga el contenido de SKILL.md del skill en el contexto de la sesión.

### Parámetros

| Nombre | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `skill` | string | Sí | Nombre del skill (soporta prefijo de namespace, ej. `project:my-skill`, `user:my-skill`) |

### Valor de Retorno

Devuelve un mensaje de confirmación de carga exitosa del skill, incluyendo la lista de scripts y archivos disponibles.

**Ejemplo de retorno**:
```
Skill "code-review" loaded.
Available scripts: tools/check.sh, tools/format.sh
Available files: docs/guide.md, examples/bad.js
```

El contenido del skill se inyecta en el contexto de la sesión en formato XML:

```xml
<skill name="code-review">
  <metadata>
    <source>user</source>
    <directory>/path/to/skills/code-review</directory>
    <scripts>
      <script>tools/check.sh</script>
      <script>tools/format.sh</script>
    </scripts>
    <files>
      <file>docs/guide.md</file>
      <file>examples/bad.js</file>
    </files>
  </metadata>

  [Mapeo de herramientas Claude Code...]
  
  <content>
[Contenido real de SKILL.md]
  </content>
</skill>
```

### Soporte de Namespaces

Usa prefijos de namespace para especificar exactamente el origen del skill:

| Namespace | Descripción | Ejemplo |
| --- | --- | --- |
| `project:` | Skill de OpenCode a nivel de proyecto | `project:my-skill` |
| `user:` | Skill de OpenCode a nivel de usuario | `user:my-skill` |
| `claude-project:` | Skill de Claude a nivel de proyecto | `claude-project:my-skill` |
| `claude-user:` | Skill de Claude a nivel de usuario | `claude-user:my-skill` |
| Sin prefijo | Usa prioridad predeterminada | `my-skill` |

### Manejo de Errores

| Tipo de Error | Mensaje de Retorno |
| --- | --- |
| Skill no existe | `Skill "xxx" not found. Use get_available_skills to list available skills.` |

### Funcionalidad de Inyección Automática

Al cargar un skill, el plugin automáticamente:

1. Lista todos los archivos en el directorio del skill (excluyendo SKILL.md)
2. Lista todos los scripts ejecutables
3. Inyecta el mapeo de herramientas Claude Code (si el skill lo requiere)

### Ejemplos de Uso

**Cargar skill**:
```
Entrada del usuario:
Ayúdame a hacer una revisión de código

Llamada de la IA:
use_skill({
  "skill": "code-review"
})
```

**Especificar origen usando namespace**:
```
Llamada de la IA:
use_skill({
  "skill": "user:git-helper"
})
```

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-24

| Herramienta | Ruta del Archivo | Líneas |
| --- | --- | --- |
| Herramienta GetAvailableSkills | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L29-L72) | 29-72 |
| Herramienta ReadSkillFile | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L74-L135) | 74-135 |
| Herramienta RunSkillScript | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L137-L198) | 137-198 |
| Herramienta UseSkill | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L200-L267) | 200-267 |
| Registro de herramientas | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L160-L167) | 160-167 |
| Definición de tipo Skill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L43-L52) | 43-52 |
| Definición de tipo Script | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L35-L38) | 35-38 |
| Definición de tipo SkillLabel | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L30) | 30 |
| Función resolveSkill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |

**Tipos clave**:
- `Skill`: Metadatos completos del skill (name, description, path, scripts, template, etc.)
- `Script`: Metadatos del script (relativePath, absolutePath)
- `SkillLabel`: Identificador de origen del skill (project, user, claude-project, etc.)

**Funciones clave**:
- `resolveSkill()`: Resuelve el nombre del skill, soporta prefijos de namespace
- `isPathSafe()`: Valida la seguridad de la ruta, previene directory traversal
- `findClosestMatch()`: Sugerencias de coincidencia difusa

</details>

---

## Próxima Lección

Este curso ha completado la documentación de referencia de herramientas API de OpenCode Agent Skills.

Para más información, consulta:
- [Mejores Prácticas de Desarrollo de Skills](../best-practices/) - Aprende técnicas y normas para escribir skills de alta calidad
- [Solución de Problemas Comunes](../../faq/troubleshooting/) - Resuelve problemas comunes al usar el plugin
