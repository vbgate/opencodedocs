---
title: "Referencia de Comandos CLI: Lista Completa de Comandos y Parámetros | Tutorial de Agent App Factory"
sidebarTitle: "Guía Completa de Comandos CLI"
subtitle: "Referencia de Comandos CLI: Lista Completa de Comandos y Parámetros"
description: "Referencia completa de comandos CLI de Agent App Factory, incluyendo descripciones de parámetros y ejemplos de uso para los seis comandos init, run, continue, status, list y reset, ayudándote a dominar rápidamente la herramienta de línea de comandos."
tags:
  - "CLI"
  - "Línea de comandos"
  - "Referencia"
order: 210
---

# Referencia de Comandos CLI: Lista Completa de Comandos y Parámetros

Esta sección proporciona una referencia completa de comandos para la herramienta CLI de Agent App Factory.

## Resumen de Comandos

| Comando | Función | Escenario de Uso |
| --- | --- | --- |
| `factory init` | Inicializar proyecto Factory | Comenzar un nuevo proyecto |
| `factory run [stage]` | Ejecutar pipeline | Ejecutar o continuar el pipeline |
| `factory continue` | Continuar en nueva sesión | Ahorrar Tokens, ejecución por sesiones |
| `factory status` | Ver estado del proyecto | Conocer el progreso actual |
| `factory list` | Listar todos los proyectos | Gestionar múltiples proyectos |
| `factory reset` | Restablecer estado del proyecto | Reiniciar el pipeline |

---

## factory init

Inicializa el directorio actual como un proyecto Factory.

### Sintaxis

```bash
factory init [options]
```

### Parámetros

| Parámetro | Abreviatura | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `--name` | `-n` | string | No | Nombre del proyecto |
| `--description` | `-d` | string | No | Descripción del proyecto |

### Descripción de Funcionalidad

Al ejecutar el comando `factory init`, se realizarán las siguientes acciones:

1. Verificar la seguridad del directorio (solo se permiten archivos de configuración como `.git`, `.gitignore`, `README.md`)
2. Crear el directorio `.factory/`
3. Copiar los siguientes archivos a `.factory/`:
   - `agents/` - Archivos de definición de Agentes
   - `skills/` - Módulos de habilidades
   - `policies/` - Documentos de políticas
   - `templates/` - Plantillas de configuración
   - `pipeline.yaml` - Definición del pipeline
4. Generar `config.yaml` y `state.json`
5. Generar `.claude/settings.local.json` (configuración de permisos de Claude Code)
6. Intentar instalar plugins requeridos:
   - superpowers (necesario para la etapa Bootstrap)
   - ui-ux-pro-max-skill (necesario para la etapa UI)
7. Iniciar automáticamente el asistente de IA (Claude Code u OpenCode)

### Ejemplos

**Inicializar proyecto con nombre y descripción específicos**:

```bash
factory init --name "Todo App" --description "Una aplicación simple de lista de tareas"
```

**Inicializar proyecto en el directorio actual**:

```bash
factory init
```

### Notas Importantes

- El directorio debe estar vacío o contener solo archivos de configuración (`.git`, `.gitignore`, `README.md`)
- Si ya existe el directorio `.factory/`, se sugerirá usar `factory reset` para reiniciar

---

## factory run

Ejecuta el pipeline, comenzando desde la etapa actual o una etapa especificada.

### Sintaxis

```bash
factory run [stage] [options]
```

### Parámetros

| Parámetro | Abreviatura | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `stage` | - | string | No | Nombre de la etapa del pipeline (bootstrap/prd/ui/tech/code/validation/preview) |

### Opciones

| Opción | Abreviatura | Tipo | Descripción |
| --- | --- | --- | --- |
| `--force` | `-f` | flag | Omitir confirmaciones |

### Descripción de Funcionalidad

Al ejecutar el comando `factory run`, se realizarán las siguientes acciones:

1. Verificar si es un proyecto Factory
2. Leer `config.yaml` y `state.json`
3. Mostrar el estado actual del pipeline
4. Determinar la etapa objetivo (especificada por parámetro o etapa actual)
5. Detectar el tipo de asistente de IA (Claude Code / Cursor / OpenCode)
6. Generar instrucciones de ejecución para el asistente correspondiente
7. Mostrar la lista de etapas disponibles y el progreso

### Ejemplos

**Ejecutar pipeline desde la etapa bootstrap**:

```bash
factory run bootstrap
```

**Continuar ejecución desde la etapa actual**:

```bash
factory run
```

**Ejecutar directamente sin confirmación**:

```bash
factory run bootstrap --force
```

### Ejemplo de Salida

```
Agent Factory - Pipeline Runner

Pipeline Status:
────────────────────────────────────────
Project: Todo App
Status: Running
Current Stage: bootstrap
Completed:

🤖 Claude Code Instructions:
──────────────────────────
This is an Agent Factory project. To execute the pipeline:

1. Read pipeline definition:
Read(/path/to/.factory/pipeline.yaml)

2. Read orchestrator agent:
Read(/path/to/.factory/agents/orchestrator.checkpoint.md)

3. Read project config:
Read(/path/to/.factory/config.yaml)

Then execute the pipeline starting from: bootstrap

────────────────────────────────────────
Available stages:
○ bootstrap
○ prd
○ ui
○ tech
○ code
○ validation
○ preview

────────────────────────────────────────
Ready! Follow instructions above to continue.
```

---

## factory continue

Crea una nueva sesión para continuar la ejecución del pipeline, ahorrando Tokens.

### Sintaxis

```bash
factory continue
```

### Descripción de Funcionalidad

Al ejecutar el comando `factory continue`, se realizarán las siguientes acciones:

1. Verificar si es un proyecto Factory
2. Leer `state.json` para obtener el estado actual
3. Regenerar la configuración de permisos de Claude Code
4. Iniciar una nueva ventana de Claude Code
5. Continuar la ejecución desde la etapa actual

### Escenarios de Uso

- Después de completar cada etapa, evitar la acumulación de Tokens
- Cada etapa tiene su propio contexto limpio
- Soporte para recuperación tras interrupción

### Ejemplos

**Continuar ejecución del pipeline**:

```bash
factory continue
```

### Notas Importantes

- Requiere tener instalado Claude Code
- Se iniciará automáticamente una nueva ventana de Claude Code

---

## factory status

Muestra el estado detallado del proyecto Factory actual.

### Sintaxis

```bash
factory status
```

### Descripción de Funcionalidad

Al ejecutar el comando `factory status`, se mostrará:

- Nombre del proyecto, descripción, ruta, fecha de creación
- Estado del pipeline (idle/running/waiting_for_confirmation/paused/failed/completed)
- Etapa actual
- Lista de etapas completadas
- Progreso de cada etapa
- Estado de archivos de entrada (input/idea.md)
- Estado del directorio de artefactos (artifacts/)
- Cantidad y tamaño de archivos de artefactos

### Ejemplos

```bash
factory status
```

### Ejemplo de Salida

```
Agent Factory - Project Status

Project:
Name: Todo App
Description: Una aplicación simple de lista de tareas
Path: /Users/user/Projects/todo-app
Created: 2026-01-29T10:00:00.000Z

Pipeline:
Status: Running
Current Stage: prd
Completed: bootstrap

Progress:
✓ bootstrap
→ prd
○ ui
○ tech
○ code
○ validation
○ preview

Input:
File: input/idea.md
Lines: 25
Preview:
# Todo App

Una aplicación simple de lista de tareas...

Artifacts:
✓ prd (3 files, 12.5 KB)

────────────────────────────────────────
Commands:
factory run - Run pipeline
factory run <stage> - Run from stage
factory reset - Reset pipeline state
```

---

## factory list

Lista todos los proyectos Factory.

### Sintaxis

```bash
factory list
```

### Descripción de Funcionalidad

Al ejecutar el comando `factory list`, se realizarán las siguientes acciones:

1. Buscar en directorios de proyectos comunes (`~/Projects`, `~/Desktop`, `~/Documents`, `~`)
2. Buscar en el directorio actual y directorios superiores (hasta 3 niveles)
3. Listar todos los proyectos que contienen el directorio `.factory/`
4. Mostrar el estado del proyecto (ordenado por: en ejecución, en espera, fallido, completado)

### Ejemplos

```bash
factory list
```

### Ejemplo de Salida

```
Agent Factory - Projects

Found 2 project(s):

◉ Todo App
Una aplicación simple de lista de tareas
Path: /Users/user/Projects/todo-app
Stage: prd

○ Blog System
Sistema de blog
Path: /Users/user/Projects/blog
Completed: bootstrap

────────────────────────────────────────
Work on a project: cd <path> && factory run
```

---

## factory reset

Restablece el estado del pipeline del proyecto actual, preservando los artefactos.

### Sintaxis

```bash
factory reset [options]
```

### Opciones

| Opción | Abreviatura | Tipo | Descripción |
| --- | --- | --- | --- |
| `--force` | `-f` | flag | Omitir confirmación |

### Descripción de Funcionalidad

Al ejecutar el comando `factory reset`, se realizarán las siguientes acciones:

1. Verificar si es un proyecto Factory
2. Mostrar el estado actual
3. Confirmar el restablecimiento (a menos que se use `--force`)
4. Restablecer `state.json` al estado inicial
5. Actualizar la sección pipeline de `config.yaml`
6. Preservar todos los artefactos en `artifacts/`

### Escenarios de Uso

- Reiniciar desde la etapa bootstrap
- Limpiar errores de estado
- Reconfigurar el pipeline

### Ejemplos

**Restablecer estado del proyecto**:

```bash
factory reset
```

**Restablecer directamente sin confirmación**:

```bash
factory reset --force
```

### Notas Importantes

- Solo restablece el estado del pipeline, los artefactos no se eliminan
- Para eliminar completamente el proyecto, es necesario eliminar manualmente los directorios `.factory/` y `artifacts/`

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-29

| Comando | Ruta del Archivo | Línea |
| --- | --- | --- |
| Entrada CLI | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js) | 17-122 |
| Comando init | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 1-457 |
| Comando run | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 1-335 |
| Comando continue | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | 1-144 |
| Comando status | [`cli/commands/status.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/status.js) | 1-203 |
| Comando list | [`cli/commands/list.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/list.js) | 1-160 |
| Comando reset | [`cli/commands/reset.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/reset.js) | 1-100 |

**Funciones Clave**:
- `getFactoryRoot()` - Obtener directorio raíz de Factory (factory.js:22-52)
- `isFactoryProject()` - Verificar si es un proyecto Factory (init.js:22-26)
- `generateConfig()` - Generar configuración del proyecto (init.js:58-76)
- `launchClaudeCode()` - Iniciar Claude Code (init.js:119-147)
- `launchOpenCode()` - Iniciar OpenCode (init.js:152-215)
- `detectAIAssistant()` - Detectar tipo de asistente de IA (run.js:105-124)
- `updateState()` - Actualizar estado del pipeline (run.js:94-100)

**Bibliotecas de Dependencias**:
- `commander` - Análisis de parámetros CLI
- `chalk` - Salida de color en terminal
- `ora` - Animaciones de carga
- `inquirer` - Prompts interactivos
- `yaml` - Análisis de archivos YAML
- `fs-extra` - Operaciones del sistema de archivos

</details>
