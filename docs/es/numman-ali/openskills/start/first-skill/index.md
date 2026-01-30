---
title: "Primera habilidad: Instalar habilidades oficiales | openskills"
sidebarTitle: "Instala tu primera habilidad en 5 minutos"
subtitle: "Primera habilidad: Instalar habilidades oficiales"
description: "Aprende a instalar habilidades desde el repositorio oficial de Anthropic a tu proyecto. Domina el comando openskills install y la selección interactiva, comprende la estructura de directorios de habilidades."
tags:
  - "Tutorial de introducción"
  - "Instalación de habilidades"
prerequisite:
  - "start-installation"
order: 4
---

# Instalar la primera habilidad

## Lo que lograrás después de esta lección

- Instalar habilidades desde el repositorio oficial de Anthropic en tu proyecto
- Utilizar la interfaz de selección interactiva para elegir las habilidades necesarias
- Comprender dónde se instalan las habilidades (directorio .claude/skills/)
- Verificar que la habilidad se instaló correctamente

::: info Conocimientos previos

Este tutorial asume que ya has completado la [instalación de OpenSkills](../installation/). Si aún no lo has instalado, completa primero los pasos de instalación.

:::

---

## Tu situación actual

Acabas de instalar OpenSkills, pero:

- **No sabes dónde encontrar habilidades**: Hay muchos repositorios de habilidades en GitHub, no sabes cuál es el oficial
- **No sabes cómo instalar habilidades**: Solo sabes que hay un comando `install`, pero no sabes cómo usarlo
- **Temés instalar en el lugar equivocado**: Teme que la habilidad se instale globalmente en el sistema y no la encuentres al cambiar de proyecto

Estos problemas son muy comunes. Resolvámoslos paso a paso.

---

## Cuándo usar esta técnica

**Instalar la primera habilidad** es adecuado para estos escenarios:

- Es la primera vez que usas OpenSkills y quieres experimentar rápidamente
- Necesitas usar habilidades proporcionadas oficialmente por Anthropic (como procesamiento de PDF, flujo de trabajo de Git, etc.)
- Quieres usar habilidades en tu proyecto actual, no una instalación global

::: tip Práctica recomendada

Para la primera instalación, se recomienda comenzar con el repositorio oficial de Anthropic `anthropics/skills`, estas habilidades son de alta calidad y han sido verificadas.

:::

---

## 🎒 Preparativos antes de empezar

Antes de comenzar, confirma:

- [ ] Has completado la [instalación de OpenSkills](../installation/)
- [ ] Has ingresado al directorio de tu proyecto
- [ ] Has configurado Git (usado para clonar repositorios de GitHub)

::: warning Verificación previa

Si aún no tienes un directorio de proyecto, puedes crear un directorio temporal para practicar:

```bash
mkdir my-project && cd my-project
```

:::

---

## Idea clave: Instalar habilidades desde GitHub

OpenSkills admite la instalación de habilidades desde repositorios de GitHub. El proceso de instalación es así:

```
[Especificar repositorio] → [Clonar a directorio temporal] → [Buscar SKILL.md] → [Selección interactiva] → [Copiar a .claude/skills/]
```

**Puntos clave**:
- Usa el formato `owner/repo` para especificar el repositorio de GitHub
- La herramienta clona automáticamente el repositorio a un directorio temporal
- Busca todos los subdirectorios que contengan `SKILL.md`
- Selecciona las habilidades a instalar a través de una interfaz interactiva
- Las habilidades se copian al directorio `.claude/skills/` del proyecto

---

## Sígueme paso a paso

### Paso 1: Ingresar al directorio del proyecto

Primero, ingresa al directorio del proyecto en el que estás trabajando:

```bash
cd /path/to/your/project
```

**¿Por qué**

OpenSkills instala habilidades por defecto en el directorio `.claude/skills/` del proyecto, de modo que las habilidades pueden controlarse por versiones con el proyecto y los miembros del equipo también pueden compartirlas.

**Lo que deberías ver**:

Tu directorio de proyecto debería contener uno de los siguientes elementos:

- `.git/` (repositorio Git)
- `package.json` (proyecto Node.js)
- Otros archivos del proyecto

::: tip Práctica recomendada

Incluso si es un proyecto nuevo, se recomienda inicializar primero el repositorio Git, para así gestionar mejor los archivos de habilidades.

:::

---

### Paso 2: Instalar habilidades

Usa el siguiente comando para instalar habilidades desde el repositorio oficial de habilidades de Anthropic:

```bash
npx openskills install anthropics/skills
```

**¿Por qué**

`anthropics/skills` es el repositorio de habilidades mantenido oficialmente por Anthropic, contiene ejemplos de habilidades de alta calidad, adecuado para la primera experiencia.

**Lo que deberías ver**:

El comando iniciará una interfaz de selección interactiva:

```
Installing from: anthropics/skills
Location: project (.claude/skills)
Default install is project-local (./.claude/skills). Use --global for ~/.claude/skills.

Cloning repository...
✓ Repository cloned

Found 4 skill(s)

? Select skills to install:
❯ ◉ pdf (24 KB)    Comprehensive PDF manipulation toolkit for extracting text and tables...
  ◯ git-workflow (12 KB)   Git workflow: Best practices for commits, branches, and PRs...
  ◯ check-branch-first (8 KB)    Git workflow: Always check current branch before making changes...
  ◯ skill-creator (16 KB)   Guide for creating effective skills...

<Space> seleccionar  <a> seleccionar todo  <i> invertir selección  <Enter> confirmar
```

**Guía de operación**:

```
┌─────────────────────────────────────────────────────────────┐
│  Instrucciones de operación                                 │
│                                                             │
│  Paso 1           Paso 2            Paso 3                  │
│  Mover cursor  →  Presiona Space  →  Presiona Enter         │
│  para seleccionar     para          para confirmar           │
│                                                             │
│  ○ No seleccionado       ◉ Seleccionado                     │
└─────────────────────────────────────────────────────────────┘

Lo que deberías ver:
- El cursor puede moverse hacia arriba y hacia abajo
- Presiona la barra espaciadora para alternar el estado de selección (○ ↔ ◉)
- Presiona la tecla Enter para confirmar la instalación
```

---

### Paso 3: Seleccionar habilidades

En la interfaz interactiva, selecciona las habilidades que deseas instalar.

**Ejemplo**:

Supongamos que deseas instalar la habilidad de procesamiento de PDF:

```
? Select skills to install:
❯ ◉ pdf (24 KB)    ← Seleccionar este
  ◯ git-workflow (12 KB)
  ◯ check-branch-first (8 KB)
  ◯ skill-creator (16 KB)
```

Operación:
1. **Mover el cursor**: Usa las teclas de flecha arriba y abajo para moverte a la línea `pdf`
2. **Seleccionar habilidad**: Presiona la **barra espaciadora**, asegúrate de que al frente haya `◉` en lugar de `◯`
3. **Confirmar instalación**: Presiona la **tecla Enter** para comenzar la instalación

**Lo que deberías ver**:

```
✅ Installed: pdf
   Location: /path/to/your/project/.claude/skills/pdf

Skills installed to: /path/to/your/project/.claude/skills/

Next steps:
  → Run openskills sync to generate AGENTS.md with your installed skills
  → Run openskills list to see all installed skills
```

::: tip Operación avanzada

Si deseas instalar múltiples habilidades de una vez:
- Presiona la barra espaciadora para seleccionar cada habilidad necesaria (múltiples `◉`)
- Presiona `<a>` para seleccionar todas las habilidades
- Presiona `<i>` para invertir la selección actual

:::

---

### Paso 4: Verificar la instalación

Después de completar la instalación, verifica que la habilidad se instaló correctamente en el directorio del proyecto.

**Verificar la estructura de directorios**:

```bash
ls -la .claude/skills/
```

**Lo que deberías ver**:

```
.claude/skills/
└── pdf/
    ├── SKILL.md
    ├── .openskills.json
    ├── references/
    │   ├── pdf-extraction.md
    │   └── table-extraction.md
    └── scripts/
        └── extract-pdf.js
```

**Descripción de archivos clave**:

| Archivo | Propósito |
|--- | ---|
| `SKILL.md` | Contenido principal e instrucciones de la habilidad |
| `.openskills.json` | Metadatos de instalación (registra el origen, usado para actualizaciones) |
| `references/` | Documentación de referencia y explicaciones detalladas |
| `scripts/` | Scripts ejecutables |

**Ver metadatos de la habilidad**:

```bash
cat .claude/skills/pdf/.openskills.json
```

**Lo que deberías ver**:

```json
{
  "source": "anthropics/skills",
  "sourceType": "git",
  "repoUrl": "https://github.com/anthropics/skills",
  "subpath": "pdf",
  "installedAt": "2026-01-24T10:30:00.000Z"
}
```

Este archivo de metadatos registra la información de origen de la habilidad y se usará posteriormente al usar `openskills update`.

---

## Punto de control ✅

Después de completar los pasos anteriores, confirma:

- [ ] La línea de comandos mostró la interfaz de selección interactiva
- [ ] Seleccionaste correctamente al menos una habilidad (al frente hay `◉`)
- [ ] La instalación fue exitosa, se mostró el mensaje `✅ Installed:`
- [ ] El directorio `.claude/skills/` se creó
- [ ] El directorio de habilidad contiene el archivo `SKILL.md`
- [ ] El directorio de habilidad contiene el archivo de metadatos `.openskills.json`

Si todos los elementos de verificación anteriores pasan, ¡felicidades! La primera habilidad se instaló correctamente.

---

## Advertencias de problemas comunes

### Problema 1: Fallo al clonar el repositorio

**Síntoma**:

```
✗ Failed to clone repository
fatal: repository 'https://github.com/anthropics/skills' not found
```

**Causa**:
- Problemas de conexión de red
- Dirección incorrecta del repositorio de GitHub

**Solución**:
1. Verifica la conexión de red: `ping github.com`
2. Confirma que la dirección del repositorio sea correcta (formato `owner/repo`)

---

### Problema 2: No aparece la interfaz de selección interactiva

**Síntoma**:

El comando instaló directamente todas las habilidades sin mostrar la interfaz de selección.

**Causa**:
- Solo hay un archivo `SKILL.md` en el repositorio (repositorio de habilidad única)
- Se usó el indicador `-y` o `--yes` (saltar selección)

**Solución**:
- Si es un repositorio de habilidad única, este es el comportamiento normal
- Si necesitas seleccionar, quita el indicador `-y`

---

### Problema 3: Error de permisos

**Síntoma**:

```
Error: EACCES: permission denied, mkdir '.claude/skills'
```

**Causa**:
- El directorio actual no tiene permisos de escritura

**Solución**:
1. Verifica los permisos del directorio: `ls -la`
2. Usa `sudo` o cambia a un directorio con permisos

---

### Problema 4: No se encuentra SKILL.md

**Síntoma**:

```
Error: No SKILL.md files found in repository
```

**Causa**:
- No hay archivos de habilidad en el formato correcto en el repositorio

**Solución**:
1. Confirma si el repositorio es un repositorio de habilidades
2. Verifica la estructura de directorios en el repositorio

---

## Resumen de esta lección

En esta lección, aprendiste:

- **Usar `openskills install anthropics/skills`** para instalar habilidades desde el repositorio oficial
- **Seleccionar habilidades en la interfaz interactiva**, presionar la barra espaciadora para seleccionar, Enter para confirmar
- **Las habilidades se instalan en el directorio `.claude/skills/`**, que contiene `SKILL.md` y metadatos
- **Verificar que la instalación fue exitosa**, revisar la estructura de directorios y el contenido de los archivos

**Comandos clave**:

| Comando | Función |
|--- | ---|
| `npx openskills install anthropics/skills` | Instalar habilidades desde el repositorio oficial |
| `ls .claude/skills/` | Ver habilidades instaladas |
| `cat .claude/skills/<name>/.openskills.json` | Ver metadatos de la habilidad |

---

## Próxima lección

> En la próxima lección aprenderemos **[Usar habilidades](../read-skills/)**.
>
> Aprenderás:
> - Usar el comando `openskills read` para leer el contenido de habilidades
> - Entender cómo los agentes de IA cargan habilidades al contexto
> - Dominar el orden de prioridad de 4 niveles para la búsqueda de habilidades

Instalar habilidades es solo el primer paso, a continuación necesitas entender cómo los agentes de IA usan estas habilidades.

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Función | Ruta del archivo | Línea |
|--- | --- | ---|
| Entrada del comando de instalación | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L83-L183) | 83-183 |
| Determinación de la ubicación de instalación (proyecto vs global) | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L84-L92) | 84-92 |
| Análisis de shorthand de GitHub | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L131-L143) | 131-143 |
| Clonación del repositorio | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L155-L169) | 155-169 |
| Búsqueda recursiva de habilidades | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L358-L373) | 358-373 |
| Interfaz de selección interactiva | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L427-L455) | 427-455 |
| Copia e instalación de habilidades | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L461-L486) | 461-486 |
| Lista de habilidades oficiales (advertencia de conflictos) | [`src/utils/marketplace-skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/marketplace-skills.ts) | 1-25 |

**Funciones clave**:
- `installFromRepo()` - Instalar habilidades desde un repositorio, admite selección interactiva
- `installSpecificSkill()` - Instalar una habilidad de una subruta específica
- `installFromLocal()` - Instalar habilidades desde una ruta local
- `warnIfConflict()` - Verificar y advertir sobre conflictos de habilidades

**Constantes clave**:
- `ANTHROPIC_MARKETPLACE_SKILLS` - Lista de habilidades de Anthropic Marketplace, usada para advertencias de conflictos

</details>
