---
title: "Mejores Prácticas: Configuración del Proyecto y Colaboración en Equipo | OpenSkills"
sidebarTitle: "Configurar habilidades del equipo en 5 minutos"
subtitle: "Mejores Prácticas: Configuración del Proyecto y Colaboración en Equipo"
description: "Aprende las mejores prácticas de OpenSkills. Domina la instalación local vs global del proyecto, configuración del modo Universal, estándares de escritura de SKILL.md e integración CI/CD para mejorar la eficiencia de colaboración del equipo."
tags:
  - "advanced"
  - "best-practices"
  - "skills"
  - "team"
prerequisite:
  - "start-quick-start"
  - "start-installation"
  - "start-first-skill"
order: 8
---

# Mejores Prácticas

## Lo que podrás hacer después de esta lección

- Elegir el método de instalación de habilidades adecuado según las necesidades del proyecto (local vs global vs Universal)
- Escribir archivos SKILL.md que cumplan con los estándares (nomenclatura, descripción, instrucciones)
- Utilizar enlaces simbólicos para un desarrollo local eficiente
- Gestionar versiones y actualizaciones de habilidades
- Colaborar con habilidades en un entorno de equipo
- Integrar OpenSkills en flujos de CI/CD

## Tu situación actual

Ya has aprendido a instalar y usar habilidades, pero en proyectos reales te encuentras con estos problemas:

- ¿Debo instalar las habilidades en el directorio del proyecto o globalmente?
- ¿Cómo compartir habilidades entre múltiples agentes de IA?
- Escribes habilidades muchas veces, pero la IA no las recuerda
- Los miembros del equipo instalan habilidades por su cuenta con versiones inconsistentes
- Después de modificar habilidades localmente, reinstalarlas cada vez es tedioso

En esta lección recopilamos las mejores prácticas de OpenSkills para ayudarte a resolver estos problemas.

## Cuándo usar esta técnica

- **Optimización de configuración del proyecto**: Elegir la ubicación de instalación de habilidades adecuada según el tipo de proyecto
- **Entorno multi-agente**: Usar simultáneamente herramientas como Claude Code, Cursor, Windsurf, etc.
- **Estandarización de habilidades**: Formato y estándares de escritura de habilidades unificados en el equipo
- **Desarrollo local**: Iterar y probar habilidades rápidamente
- **Colaboración en equipo**: Compartir habilidades, control de versiones, integración CI/CD

## 🎒 Preparativos antes de comenzar

::: warning Verificación previa

Antes de comenzar, asegúrate de:

- ✅ Haber completado [Inicio Rápido](../../start/quick-start/)
- ✅ Haber instalado al menos una habilidad y sincronizado con AGENTS.md
- ✅ Entender el [formato básico de SKILL.md](../../start/what-is-openskills/)

:::

## Mejores Prácticas de Configuración del Proyecto

### 1. Instalación Local vs Global vs Universal del Proyecto

Elegir la ubicación de instalación adecuada es el primer paso de la configuración del proyecto.

#### Instalación Local del Proyecto (predeterminada)

**Escenario de uso**: Habilidades exclusivas para un proyecto específico

```bash
# Instalar en .claude/skills/
npx openskills install anthropics/skills
```

**Ventajas**:

- ✅ Las habilidades están bajo control de versiones del proyecto
- ✅ Diferentes proyectos pueden usar diferentes versiones de habilidades
- ✅ No necesita instalación global, reduce dependencias

**Recomendaciones**:

- Habilidades especializadas del proyecto (como procesos de compilación para frameworks específicos)
- Habilidades de negocio desarrolladas internamente por el equipo
- Habilidades que dependen de la configuración del proyecto

#### Instalación Global

**Escenario de uso**: Habilidades comunes para todos los proyectos

```bash
# Instalar en ~/.claude/skills/
npx openskills install anthropics/skills --global
```

**Ventajas**:

- ✅ Todos los proyectos comparten el mismo conjunto de habilidades
- ✅ No necesita instalar repetidamente en cada proyecto
- ✅ Gestión centralizada de actualizaciones

**Recomendaciones**:

- Biblioteca oficial de habilidades de Anthropic (anthropics/skills)
- Habilidades de herramientas generales (como procesamiento de PDF, operaciones Git)
- Habilidades personales de uso frecuente

#### Modo Universal (entorno multi-agente)

**Escenario de uso**: Usar múltiples agentes de IA simultáneamente

```bash
# Instalar en .agent/skills/
npx openskills install anthropics/skills --universal
```

**Orden de prioridad** (de mayor a menor):

1. `./.agent/skills/` (Universal local del proyecto)
2. `~/.agent/skills/` (Universal global)
3. `./.claude/skills/` (Claude Code local del proyecto)
4. `~/.claude/skills/` (Claude Code global)

**Recomendaciones**:

- ✅ Usar cuando se usan múltiples agentes (Claude Code + Cursor + Windsurf)
- ✅ Evitar conflictos con el Marketplace de Claude Code
- ✅ Gestionar de manera unificada las habilidades de todos los agentes

::: tip ¿Cuándo usar el modo Universal?

Si tu `AGENTS.md` es compartido por Claude Code y otros agentes, usa `--universal` para evitar conflictos de habilidades. El modo Universal usa el directorio `.agent/skills/`, aislado de `.claude/skills/` de Claude Code.

:::

### 2. Priorizar el uso de npx en lugar de instalación global

OpenSkills está diseñado para ser usado y listo, se recomienda usar siempre `npx`:

```bash
# ✅ Recomendado: usar npx
npx openskills install anthropics/skills
npx openskills sync
npx openskills list

# ❌ Evitar: llamar directamente después de instalación global
openskills install anthropics/skills
```

**Ventajas**:

- ✅ No necesita instalación global, evita conflictos de versión
- ✅ Siempre usa la última versión (npx se actualiza automáticamente)
- ✅ Reduce dependencias del sistema

**Cuándo se necesita instalación global**:

- En entornos CI/CD (para rendimiento)
- Llamadas frecuentes en scripts (reduce tiempo de inicio de npx)

```bash
# Instalación global en CI/CD o scripts
npm install -g openskills
openskills install anthropics/skills -y
openskills sync -y
```

## Mejores Prácticas de Gestión de Habilidades

### 1. Estándares de Escritura de SKILL.md

#### Nomenclatura: usar formato con guiones

**Reglas**:

- ✅ Correcto: `pdf-editor`, `api-client`, `git-workflow`
- ❌ Incorrecto: `PDF Editor` (espacios), `pdf_editor` (guiones bajos), `PdfEditor` (camelCase)

**Motivo**: El formato con guiones son identificadores amigables para URL, cumplen con los estándares de nomenclatura de repositorios GitHub y sistemas de archivos.

#### Redacción de descripción: tercera persona, 1-2 oraciones

**Reglas**:

- ✅ Correcto: `Use this skill for comprehensive PDF manipulation.`
- ❌ Incorrecto: `You should use this skill to manipulate PDFs.` (segunda persona)

**Comparación de ejemplos**:

| Escenario | ❌ Incorrecto (segunda persona) | ✅ Correcto (tercera persona) |
|--- | --- | ---|
| Habilidad PDF | You can use this to extract text from PDFs. | Extract text from PDFs with this skill. |
| Habilidad Git | When you need to manage branches, use this. | Manage Git branches with this skill. |
| Habilidad API | If you want to call the API, load this skill. | Call external APIs with this skill. |

#### Redacción de instrucciones: forma imperativa/infinitivo

**Reglas**:

- ✅ Correcto: `"To accomplish X, execute Y"`
- ✅ Correcto: `"Load this skill when Z"`
- ❌ Incorrecto: `"You should do X"`
- ❌ Incorrecto: `"If you need Y"`

**Mnémonica de redacción**:

1. **Empezar con verbo**: "Create" → "Use" → "Return"
2. **Omitir "You"**: No decir "You should"
3. **Ruta clara**: Referenciar recursos con `references/` al inicio

**Comparación de ejemplos**:

| ❌ Redacción incorrecta | ✅ Redacción correcta |
|--- | ---|
| "You should create a file" | "Create a file" |
| "When you want to load this skill" | "Load this skill when" |
| "If you need to see the docs" | "See references/guide.md" |

::: tip ¿Por qué usar imperativo/infinitivo?

Este estilo de redacción hace que sea más fácil para los agentes de IA analizar y ejecutar instrucciones. Las formas imperativas e infinitivas eliminan el sujeto "tú", haciendo las instrucciones más directas y claras.

:::

### 2. Control del tamaño de archivo

**Tamaño del archivo SKILL.md**:

- ✅ **Recomendado**: menos de 5000 palabras
- ⚠️ **Advertencia**: más de 8000 palabras puede causar límite de contexto
- ❌ **Prohibido**: más de 10000 palabras

**Métodos de control**:

Mover documentación detallada al directorio `references/`:

```markdown
# SKILL.md (instrucciones principales)

## Instructions

To process data:

1. Call the API endpoint
2. See `references/api-docs.md` for detailed response format  # documentación detallada
3. Process the result

## Bundled Resources

For detailed API documentation, see:
- `references/api-docs.md`  # no se carga en el contexto, ahorra tokens
- `references/examples.md`
```

**Comparación de tamaño de archivo**:

| Archivo | Límite de tamaño | ¿Se carga en contexto? |
|--- | --- | ---|
| `SKILL.md` | < 5000 palabras | ✅ Sí |
| `references/` | Sin límite | ❌ No (carga bajo demanda) |
| `scripts/` | Sin límite | ❌ No (ejecutable) |
| `assets/` | Sin límite | ❌ No (archivos de plantilla) |

### 3. Prioridad de búsqueda de habilidades

OpenSkills busca habilidades en el siguiente orden de prioridad (de mayor a menor):

```
1. ./.agent/skills/        # Universal local del proyecto
2. ~/.agent/skills/        # Universal global
3. ./.claude/skills/      # Claude Code local del proyecto
4. ~/.claude/skills/      # Claude Code global
```

**Mecanismo de deduplicación**:

- Solo devuelve la primera habilidad encontrada con el mismo nombre
- Las habilidades locales del proyecto tienen prioridad sobre las habilidades globales

**Escenario de ejemplo**:

```
Proyecto A:
- .claude/skills/pdf        # versión local del proyecto v1.0
- ~/.claude/skills/pdf     # versión global v2.0

# openskills read pdf cargará .claude/skills/pdf (v1.0)
```

**Recomendaciones**:

- Las habilidades con necesidades especiales del proyecto se colocan localmente
- Las habilidades generales se colocan globalmente
- Usar modo Universal en entornos multi-agente

## Mejores Prácticas de Desarrollo Local

### 1. Usar enlaces simbólicos para desarrollo iterativo

**Problema**: Después de cada modificación de habilidad, necesitas reinstalarla, lo que reduce la eficiencia de desarrollo.

**Solución**: Usar enlaces simbólicos (symlink)

```bash
# 1. Clonar el repositorio de habilidades al directorio de desarrollo
git clone git@github.com:your-org/my-skills.git ~/dev/my-skills

# 2. Crear directorio de habilidades
mkdir -p .claude/skills

# 3. Crear enlace simbólico
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill

# 4. Sincronizar con AGENTS.md
npx openskills sync
```

**Ventajas**:

- ✅ Las modificaciones del archivo fuente surten efecto inmediatamente (no necesita reinstalación)
- ✅ Soporta actualizaciones basadas en Git (solo haz pull)
- ✅ Múltiples proyectos pueden compartir la misma versión de desarrollo de habilidad

**Verificar enlaces simbólicos**:

```bash
# Ver enlaces simbólicos
ls -la .claude/skills/

# Ejemplo de salida:
# my-skill -> /Users/yourname/dev/my-skills/my-skill
```

**Consideraciones importantes**:

- ✅ Los enlaces simbólicos son reconocidos por `openskills list`
- ✅ Los enlaces rotos se saltan automáticamente (no causan fallos)
- ⚠️ Los usuarios de Windows necesitan usar Git Bash o WSL (Windows no admite enlaces simbólicos de forma nativa)

### 2. Compartir habilidades entre múltiples proyectos

**Escenario**: Varios proyectos necesitan usar el mismo conjunto de habilidades de equipo.

**Método 1: Instalación global**

```bash
# Instalar el repositorio de habilidades del equipo globalmente
npx openskills install your-org/team-skills --global
```

**Método 2: Enlace simbólico al directorio de desarrollo**

```bash
# Crear enlace simbólico en cada proyecto
ln -s ~/dev/team-skills/my-skill .claude/skills/my-skill
```

**Método 3: Git Submodule**

```bash
# Agregar el repositorio de habilidades como submódulo
git submodule add git@github.com:your-org/team-skills.git .claude/skills

# Actualizar submódulo
git submodule update --init --recursive
```

**Elección recomendada**:

| Método | Escenario de uso | Ventajas | Desventajas |
|--- | --- | --- | ---|
| Instalación global | Todos los proyectos comparten habilidades unificadas | Gestión centralizada, actualizaciones convenientes | No puede personalizar por proyecto |
| Enlace simbólico | Desarrollo y pruebas locales | Las modificaciones surten efecto inmediatamente | Necesita crear enlaces manualmente |
| Git Submodule | Colaboración en equipo, control de versiones | Bajo control de versiones del proyecto | Gestión compleja de submódulos |

## Mejores Prácticas de Colaboración en Equipo

### 1. Control de versiones de habilidades

**Mejor práctica**: Control de versiones independiente del repositorio de habilidades

```bash
# Estructura del repositorio de habilidades del equipo
team-skills/
├── .git/
├── pdf-editor/
│   └── SKILL.md
├── api-client/
│   └── SKILL.md
└── git-workflow/
    └── SKILL.md
```

**Método de instalación**:

```bash
# Instalar habilidades desde el repositorio del equipo
npx openskills install git@github.com:your-org/team-skills.git
```

**Proceso de actualización**:

```bash
# Actualizar todas las habilidades
npx openskills update

# Actualizar habilidades específicas
npx openskills update pdf-editor,api-client
```

**Recomendaciones de gestión de versiones**:

- Usar Git Tag para marcar versiones estables: `v1.0.0`, `v1.1.0`
- Registrar versión de habilidad en AGENTS.md: `<skill name="pdf-editor" version="1.0.0">`
- Usar versiones estables fijadas en CI/CD

### 2. Nomenclatura de habilidades

**Nomenclatura unificada del equipo**:

| Tipo de habilidad | Patrón de nomenclatura | Ejemplo |
|--- | --- | ---|
| Herramienta general | `<tool-name>` | `pdf`, `git`, `docker` |
| Relacionado con framework | `<framework>-<purpose>` | `react-component`, `django-model` |
| Flujo de trabajo | `<workflow>` | `ci-cd`, `code-review` |
| Exclusivo del equipo | `<team>-<purpose>` | `team-api`, `company-deploy` |

**Ejemplos**:

```bash
# ✅ Nomenclatura unificada
team-skills/
├── pdf/                     # procesamiento de PDF
├── git-workflow/           # flujo de trabajo Git
├── react-component/        # generación de componentes React
└── team-api/             # cliente API del equipo
```

### 3. Estándares de documentación de habilidades

**Estructura de documentación unificada del equipo**:

```markdown
---
name: <skill-name>
description: <1-2 oraciones, tercera persona>
author: <equipo/autor>
version: <número de versión>
---

# <título de habilidad>

## When to Use

Load this skill when:
- Escenario 1
- Escenario 2

## Instructions

To accomplish task:

1. Paso 1
2. Paso 2

## Bundled Resources

For detailed information:
- `references/api-docs.md`
- `scripts/helper.py`
```

**Lista de verificación obligatoria**:

- [ ] `name` usa formato con guiones
- [ ] `description` es 1-2 oraciones, tercera persona
- [ ] Las instrucciones usan forma imperativa/infinitivo
- [ ] Incluye campos `author` y `version` (estándar del equipo)
- [ ] Descripción detallada `When to Use`

## Mejores Prácticas de Integración CI/CD

### 1. Instalación y sincronización no interactiva

**Escenario**: Automatizar la gestión de habilidades en entornos CI/CD

**Usar flag `-y` para omitir indicaciones interactivas**:

```bash
# Ejemplo de script CI/CD
#!/bin/bash

# Instalar habilidades (no interactivo)
npx openskills install anthropics/skills -y
npx openskills install git@github.com:your-org/team-skills.git -y

# Sincronizar con AGENTS.md (no interactivo)
npx openskills sync -y
```

**Ejemplo de GitHub Actions**:

```yaml
name: Setup Skills

on: [push]

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install OpenSkills
        run: npx openskills install anthropics/skills -y

      - name: Sync to AGENTS.md
        run: npx openskills sync -y

      - name: Verify Skills
        run: npx openskills list
```

### 2. Automatización de actualización de habilidades

**Actualizaciones programadas de habilidades**:

```yaml
# .github/workflows/update-skills.yml
name: Update Skills

on:
  schedule:
    - cron: '0 0 * * 0'  # actualizar cada domingo
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Update Skills
        run: npx openskills update -y

      - name: Sync to AGENTS.md
        run: npx openskills sync -y

      - name: Commit Changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add AGENTS.md
          git diff --staged --quiet || git commit -m "Update skills"
          git push
```

### 3. Ruta de salida personalizada

**Escenario**: Sincronizar habilidades a un archivo personalizado (como `.ruler/AGENTS.md`)

```bash
# Sincronizar a archivo personalizado
npx openskills sync -o .ruler/AGENTS.md -y
```

**Ejemplo de CI/CD**:

```yaml
# Generar diferentes AGENTS.md para diferentes agentes de IA
- name: Sync for Claude Code
  run: npx openskills sync -o AGENTS.md -y

- name: Sync for Cursor
  run: npx openskills sync -o .cursor/AGENTS.md -y

- name: Sync for Windsurf
  run: npx openskills sync -o .windsurf/AGENTS.md -y
```

## Preguntas Frecuentes y Soluciones

### Problema 1: Habilidad no encontrada

**Síntomas**:

```bash
npx openskills read my-skill
# Error: Skill not found: my-skill
```

**Pasos de diagnóstico**:

1. Verificar si la habilidad está instalada:
   ```bash
   npx openskills list
   ```

2. Verificar si el nombre de habilidad es correcto (distingue mayúsculas/minúsculas):
   ```bash
   # ❌ Incorrecto
   npx openskills read My-Skill

   # ✅ Correcto
   npx openskills read my-skill
   ```

3. Verificar si la habilidad está siendo sobrescrita en un directorio con mayor prioridad:
   ```bash
   # Ver ubicación de habilidad
   ls -la .claude/skills/my-skill
   ls -la ~/.claude/skills/my-skill
   ```

### Problema 2: Enlace simbólico no accesible

**Síntomas**:

```bash
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill
# ln: failed to create symbolic link: Operation not permitted
```

**Solución**:

- **macOS**: Permitir enlaces simbólicos en Preferencias del Sistema
- **Windows**: Usar Git Bash o WSL (Windows no admite enlaces simbólicos de forma nativa)
- **Linux**: Verificar permisos del sistema de archivos

### Problema 3: Actualización de habilidad no surte efecto

**Síntomas**:

```bash
npx openskills update
# ✅ Skills updated successfully

npx openskills read my-skill
# el contenido sigue siendo la versión anterior
```

**Causa**: El agente de IA ha almacenado en caché el contenido anterior de la habilidad.

**Solución**:

1. Volver a sincronizar AGENTS.md:
   ```bash
   npx openskills sync
   ```

2. Verificar la marca de tiempo del archivo de habilidad:
   ```bash
   ls -la .claude/skills/my-skill/SKILL.md
   ```

3. Si usas enlaces simbólicos, volver a cargar la habilidad:
   ```bash
   npx openskills read my-skill
   ```

## Resumen de la Lección

Puntos clave de las mejores prácticas de OpenSkills:

### Configuración del Proyecto

- ✅ Instalación local del proyecto: habilidades exclusivas para proyectos específicos
- ✅ Instalación global: habilidades comunes para todos los proyectos
- ✅ Modo Universal: compartir habilidades en entornos multi-agente
- ✅ Priorizar el uso de `npx` en lugar de instalación global

### Gestión de Habilidades

- ✅ Estándares de escritura de SKILL.md: nomenclatura con guiones, descripción en tercera persona, instrucciones imperativas
- ✅ Control del tamaño de archivo: SKILL.md < 5000 palabras, documentación detallada en `references/`
- ✅ Prioridad de búsqueda de habilidades: entender los 4 directorios de prioridad y el mecanismo de deduplicación

### Desarrollo Local

- ✅ Usar enlaces simbólicos para desarrollo iterativo
- ✅ Compartir habilidades entre múltiples proyectos: instalación global, enlaces simbólicos, Git Submodule

### Colaboración en Equipo

- ✅ Control de versiones de habilidades: repositorio independiente, Git Tag
- ✅ Nomenclatura unificada: herramientas, frameworks, flujos de trabajo
- ✅ Estándares de documentación unificados: author, version, When to Use

### Integración CI/CD

- ✅ Instalación y sincronización no interactiva: flag `-y`
- ✅ Actualización automática: tareas programadas, workflow_dispatch
- ✅ Ruta de salida personalizada: flag `-o`

## Próxima Lección

> En la próxima lección aprenderemos **[Preguntas Frecuentes](../faq/faq/)**.
>
> Aprenderás:
> - Respuestas rápidas a preguntas comunes sobre OpenSkills
> - Métodos de diagnóstico para fallos de instalación, habilidades no cargadas, etc.
> - Técnicas de configuración para coexistir con Claude Code

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haga clic para expandir y ver ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-24

| Función | Ruta de archivo | Línea |
|--- | --- | ---|
| Prioridad de búsqueda de habilidades | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 14-25 |
| Mecanismo de deduplicación de habilidades | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 42-43, 57 |
| Procesamiento de enlaces simbólicos | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 10-25 |
| Extracción de campos YAML | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 4-7 |
| Protección contra recorrido de ruta | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 71-78 |
| Instalación no interactiva | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 424 |
| Ruta de salida personalizada | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts) | 19-36 |

**Constantes clave**:
- 4 directorios de búsqueda de habilidades: `./.agent/skills/`, `~/.agent/skills/`, `./.claude/skills/`, `~/.claude/skills/`

**Funciones clave**:
- `getSearchDirs(): string[]` - devuelve directorios de búsqueda de habilidades ordenados por prioridad
- `isDirectoryOrSymlinkToDirectory(entry: Dirent, parentDir: string): boolean` - verifica si es directorio o enlace simbólico apuntando a directorio
- `extractYamlField(content: string, field: string): string` - extrae valor de campo YAML (coincidencia no codiciosa)
- `isPathInside(path: string, targetDir: string): boolean` - verifica si la ruta está dentro del directorio objetivo (previene recorrido de ruta)

**Archivos de habilidad de ejemplo**:
- [`examples/my-first-skill/SKILL.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/SKILL.md) - ejemplo de estructura mínima
- [`examples/my-first-skill/references/skill-format.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/references/skill-format.md) - referencia de especificaciones de formato

</details>
