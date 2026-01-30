---
title: "OpenCode y otros asistentes de IA: 3 formas de ejecutar el pipeline | Tutoriales de Agent App Factory"
sidebarTitle: "3 formas de ejecución"
subtitle: "OpenCode y otros asistentes de IA: 3 formas de ejecutar el pipeline"
description: "Aprende a ejecutar el pipeline de Agent App Factory usando OpenCode, Cursor y otros asistentes de IA. Este tutorial explica en detalle los métodos de inicio automático y manual para diferentes asistentes de IA, las diferencias en el formato de comandos, los casos de uso y métodos para solucionar problemas comunes, ayudando a los desarrolladores a elegir el asistente de IA más adecuado según sus hábitos personales y requisitos del proyecto, completando eficientemente todo el proceso de generación de aplicaciones."
tags:
  - "Asistente de IA"
  - "OpenCode"
  - "Cursor"
  - "Ejecución de pipeline"
prerequisite:
  - "start-installation"
order: 60
---

# OpenCode y otros asistentes de IA: 3 formas de ejecutar el pipeline

## Lo que podrás hacer al finalizar

- ✅ Usar OpenCode para iniciar y ejecutar el pipeline de Factory
- ✅ Ejecutar el pipeline con Cursor
- ✅ Comprender las diferencias en el formato de comandos entre diferentes asistentes de IA
- ✅ Elegir el asistente de IA adecuado según el caso de uso

## Tu dificultad actual

Has inicializado tu proyecto Factory, pero además de Claude Code, no sabes cómo ejecutar el pipeline con otros asistentes de IA. OpenCode y Cursor son asistentes de programación de IA populares, ¿pueden ejecutar el pipeline de Factory? ¿Qué diferencias hay en los métodos de inicio y el formato de comandos?

## Cuándo usar este método

| Asistente de IA | Caso de uso recomendado | Ventajas |
| ---------- | ------------------------------------- | ------------------------ |
| **Claude Code** | Necesita la experiencia de modo Agent más estable | Soporte nativo del modo Agent, formato de comandos claro |
| **OpenCode** | Usuarios multiplataforma, necesitan herramientas de IA flexibles | Multiplataforma, soporta modo Agent |
| **Cursor** | Usuarios intensivos de VS Code, acostumbrados al ecosistema de VS Code | Alta integración, cambio sin interrupciones |

::: tip Principio fundamental
La lógica de ejecución de todos los asistentes de IA es exactamente la misma: **leer definiciones de Agent → ejecutar pipeline → generar productos**. Las diferencias radican únicamente en el método de inicio y el formato de comandos.
:::

## 🎒 Preparativos antes de comenzar

Antes de comenzar, asegúrate de:

- ✅ Haber completado [Instalación y configuración](../../start/installation/)
- ✅ Haber inicializado el proyecto con `factory init`
- ✅ Haber instalado OpenCode o Cursor (al menos uno)

## Idea central: Los asistentes de IA como motor de ejecución del pipeline

Los **asistentes de IA** son el motor de ejecución del pipeline, responsables de interpretar las definiciones de Agent y generar productos. El flujo de trabajo central incluye cinco pasos: primero leer `.factory/pipeline.yaml` para conocer el orden de las etapas, luego cargar el planificador para comprender las restricciones de ejecución y las reglas de verificación de permisos, a continuación cargar los archivos de definición de Agent correspondientes según el estado actual, luego ejecutar los comandos de Agent para generar productos y verificar las condiciones de salida, y finalmente esperar la confirmación del usuario antes de continuar con la siguiente etapa.

::: info Importante: Los asistentes de IA deben admitir el modo Agent
El pipeline de Factory depende de que los asistentes de IA puedan comprender y ejecutar comandos complejos en Markdown. Todos los asistentes de IA compatibles (Claude Code, OpenCode, Cursor) tienen capacidad de modo Agent.
:::

## Sígueme

### Paso 1: Ejecutar el pipeline con OpenCode

#### Inicio automático (recomendado)

Si has instalado globalmente la CLI de OpenCode:

```bash
# Ejecutar en el directorio raíz del proyecto
factory init
```

`factory init` detectará e iniciará automáticamente OpenCode, pasando el siguiente prompt:

```text
Please read .factory/pipeline.yaml and .factory/agents/orchestrator.checkpoint.md, start the pipeline, help me transform product idea fragments into runnable applications, I will input idea fragments next. Note: Agent references to skills/ and policies/ files need to search .factory/ directory first, then root directory.
```

**Deberías ver**:
- La terminal muestra `Starting OpenCode...`
- La ventana de OpenCode se abre automáticamente
- El prompt ya se ha pegado automáticamente en el cuadro de entrada

#### Inicio manual

Si el inicio automático falla, puedes operar manualmente:

1. Abre la aplicación OpenCode
2. Abre tu directorio del proyecto Factory
3. Copia el siguiente prompt en el cuadro de entrada de OpenCode:

```text
Please read .factory/pipeline.yaml and .factory/agents/orchestrator.checkpoint.md, start the pipeline, help me transform product idea fragments into runnable applications, I will input idea fragments next. Note: Agent references to skills/ and policies/ files need to search .factory/ directory first, then root directory.
```

4. Presiona Enter para ejecutar

#### Continuar ejecutando el pipeline

Si el pipeline ya se está ejecutando en una etapa, puedes usar el comando `factory run` para continuar:

```bash
# Ver el estado actual y generar comandos
factory run

# O comenzar desde una etapa específica
factory run prd
```

OpenCode mostrará comandos similares a Claude Code:

```
🤖 AI Assistant Instructions:
──────────────────────────────────────────

This is an Agent Factory project. Please:

1. Read .factory/pipeline.yaml
2. Read .factory/agents/orchestrator.checkpoint.md
3. Read .factory/config.yaml
4. Execute pipeline from: bootstrap

Note: Check .factory/ first for skills/policies/ references, then root directory.
```

### Paso 2: Ejecutar el pipeline con Cursor

Cursor es un asistente de programación de IA basado en VS Code, usa la función Composer para ejecutar el pipeline de Factory.

#### Detección de Cursor

La CLI de Factory detectará automáticamente el entorno de Cursor (a través de las variables de entorno `CURSOR` o `CURSOR_API_KEY`).

#### Usar Composer para ejecutar

1. Abre tu directorio del proyecto Factory en Cursor
2. Ejecuta el comando `factory run`:

```bash
factory run
```

3. La terminal mostrará comandos específicos para Cursor:

```
🤖 Cursor Instructions:
──────────────────────────────────────────

This is an Agent Factory project. Use Cursor Composer to:

1. @ReadFile .factory/pipeline.yaml
2. @ReadFile .factory/agents/orchestrator.checkpoint.md
3. @ReadFile .factory/config.yaml
   (Note: Check .factory/ first for skills/policies/ references)
4. Execute pipeline from: bootstrap
```

4. Copia estos comandos al cuadro de entrada de Cursor Composer
5. Ejecuta

#### Punto de verificación ✅

- La ventana de Cursor Composer está abierta
- El pipeline comienza a ejecutarse, mostrando la etapa actual (como `Running: bootstrap`)
- Se generan productos (como `input/idea.md`)

### Paso 3: Comprender los diferentes formatos de comandos de asistentes de IA

Aunque la lógica de ejecución es la misma, diferentes asistentes de IA tienen pequeñas diferencias en el formato de comandos:

| Operación               | Formato Claude Code         | Formato Cursor               | Otros asistentes de IA (OpenCode, etc.) |
| ------------------ | ----------------------- | ------------------------- | -------------------------- |
| Leer archivo           | `Read(filePath)`        | `@ReadFile filePath`       | `Read filePath`             |
| Leer múltiples archivos       | `Read(file1)`, `Read(file2)` | `@ReadFile file1`, `@ReadFile file2` | -                 |
| Escribir archivo           | `Write(filePath, content)` | Escritura directa                  | -                       |
| Ejecutar comando Bash     | `Bash(command)`          | Ejecución directa                  | -                       |

::: tip Procesamiento automático de Factory CLI
Cuando ejecutas `factory run`, la CLI detectará automáticamente el tipo de asistente de IA actual y generará el formato de comando correspondiente. Solo necesitas copiar y pegar, sin conversión manual.
:::

### Paso 4: Continuar ejecutando desde una etapa específica

Si el pipeline ya ha completado las primeras etapas, puedes continuar desde cualquier etapa:

```bash
# Comenzar desde la etapa UI
factory run ui

# Comenzar desde la etapa Tech
factory run tech

# Comenzar desde la etapa Code
factory run code
```

La CLI de Factory mostrará el estado actual del pipeline:

```
Pipeline Status:
────────────────────────
Project: my-app
Status: Running
Current Stage: ui
Completed: bootstrap, prd

Available stages:
  ✓ bootstrap
  ✓ prd
  → ui
  ○ tech
  ○ code
  ○ validation
  ○ preview
```

### Paso 5: Usar factory continue para ahorrar tokens (solo Claude Code)

::: warning Nota
El comando `factory continue` actualmente solo admite **Claude Code**. Si usas OpenCode o Cursor, usa directamente `factory run` para iniciar manualmente una nueva sesión.
:::

Para ahorrar tokens y evitar la acumulación de contexto, Claude Code admite la ejecución en sesiones separadas:

```bash
# Abre una nueva ventana de terminal, ejecuta
factory continue
```

**Efecto de ejecución**:
- Lee el estado actual (`.factory/state.json`)
- Inicia automáticamente una nueva ventana de Claude Code
- Continúa desde la etapa donde se pausó la última vez

**Casos de uso**:
- Ya completaste Bootstrap → PRD, quieres crear una nueva sesión para ejecutar la etapa UI
- Ya completaste UI → Tech, quieres crear una nueva sesión para ejecutar la etapa Code
- Cualquier escenario que requiera evitar historiales de conversación largos

## Problemas comunes

### Problema 1: Fallo al iniciar OpenCode

**Síntoma**: Después de ejecutar `factory init`, OpenCode no se inicia automáticamente.

**Causas**:
- La CLI de OpenCode no se ha agregado al PATH
- OpenCode no está instalado

**Soluciones**:

```bash
# Iniciar OpenCode manualmente
# Windows
%LOCALAPPDATA%\Programs\OpenCode\OpenCode.exe

# macOS
/Applications/OpenCode.app

# Linux (buscar por orden de prioridad: primero /usr/bin/opencode, luego /usr/local/bin/opencode)
/usr/bin/opencode
# Si la ruta anterior no existe, intenta:
/usr/local/bin/opencode
```

Luego copia manualmente el prompt y pégalo en OpenCode.

### Problema 2: Cursor Composer no reconoce los comandos

**Síntoma**: Copias los comandos generados por `factory run` a Cursor Composer, pero no hay respuesta.

**Causas**:
- La sintaxis `@ReadFile` de Cursor Composer necesita coincidir exactamente
- La ruta del archivo puede ser incorrecta

**Soluciones**:
1. Confirma que usas `@ReadFile` y no `Read` o `ReadFile`
2. Confirma que la ruta del archivo es relativa al directorio raíz del proyecto
3. Intenta usar rutas absolutas

**Ejemplos**:

```text
# ✅ Correcto
@ReadFile .factory/pipeline.yaml

# ❌ Incorrecto
Read(.factory/pipeline.yaml)
@readfile .factory/pipeline.yaml
```

### Problema 3: Fallo al que el Agent haga referencia a archivos de habilidades

**Síntoma**: El Agent informa un error no encontrado `skills/bootstrap/skill.md` o `policies/failure.policy.md`.

**Causas**:
- El orden de búsqueda de ruta del Agent es incorrecto
- El proyecto tiene tanto `skills/` y `policies/` en `.factory/` como en el directorio raíz

**Soluciones**:
Todos los asistentes de IA siguen el mismo orden de búsqueda:

1. **Buscar primero** `.factory/skills/` y `.factory/policies/`
2. **Recuerda al directorio raíz** `skills/` y `policies/`

Asegúrate de:
- Después de inicializar el proyecto Factory, `skills/` y `policies/` se han copiado a `.factory/`
- En la definición de Agent se indica claramente: "Buscar primero en el directorio `.factory/`, luego en el directorio raíz"

### Problema 4: Estado del pipeline no sincronizado

**Síntoma**: El asistente de IA muestra que ha completado una etapa, pero `factory run` aún muestra el estado `running`.

**Causas**:
- El asistente de IA actualizó manualmente `state.json`, pero es inconsistente con el estado de la CLI
- Puede haber múltiples ventanas modificando el archivo de estado simultáneamente

**Soluciones**:
```bash
# Restablecer el estado del proyecto
factory reset

# Volver a ejecutar el pipeline
factory run
```

::: warning Mejores prácticas
Evita ejecutar el pipeline del mismo proyecto en múltiples ventanas de asistentes de IA simultáneamente. Esto provocará conflictos de estado y sobrescritura de productos.
:::

## Resumen de esta lección

En esta lección aprendimos cómo usar OpenCode, Cursor y otros asistentes de IA para ejecutar el pipeline de Factory:

**Puntos clave**:
- ✅ Factory admite múltiples asistentes de IA (Claude Code, OpenCode, Cursor)
- ✅ `factory init` detecta e inicia automáticamente los asistentes de IA disponibles
- ✅ `factory run` genera comandos correspondientes según el asistente de IA actual
- ✅ `factory continue` (solo Claude Code) admite la ejecución en sesiones separadas, ahorrando tokens
- ✅ Todos los asistentes de IA siguen la misma lógica de ejecución, solo difiere el formato de comandos

**Archivos clave**:
- `.factory/pipeline.yaml` —— Definición del pipeline
- `.factory/agents/orchestrator.checkpoint.md` —— Reglas del planificador
- `.factory/state.json` —— Estado del pipeline

**Recomendaciones de elección**:
- Claude Code: La experiencia de modo Agent más estable (recomendado)
- OpenCode: Primera opción para usuarios multiplataforma
- Cursor: Usuarios intensivos de VS Code

## Próxima lección

> En la próxima lección aprenderemos **[Instalación de complementos necesarios](../plugins/)**.
>
> Aprenderás:
> > - Por qué es necesario instalar los complementos superpowers y ui-ux-pro-max
> > - Cómo instalar complementos automáticamente o manualmente
> > - Métodos para manejar fallas en la instalación de complementos

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-29

| Función              | Ruta de archivo                                                                                     | Número de línea    |
| ----------------- | -------------------------------------------------------------------------------------------- | ------- |
| Inicio de OpenCode     | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L152-L215) | 152-215 |
| Inicio de Claude Code   | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L119-L147) | 119-147 |
| Detección de asistente de IA     | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js#L105-L124)     | 105-124 |
| Generación de comandos         | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js#L130-L183)     | 130-183 |

**Constantes clave**:
- `CLAUDE_CODE` / `ANTHROPIC_API_KEY`: Detección de variables de entorno de Claude Code (run.js:109-110)
- `CURSOR` / `CURSOR_API_KEY`: Detección de variables de entorno de Cursor (run.js:114-115)
- `OPENCODE` / `OPENCODE_VERSION`: Detección de variables de entorno de OpenCode (run.js:119-120)

**Funciones clave**:
- `launchClaudeCode(projectDir)`: Inicia Claude Code y pasa el prompt (init.js:119-147)
- `launchOpenCode(projectDir)`: Inicia OpenCode, admite dos métodos: CLI y archivo ejecutable (init.js:152-215)
- `detectAIAssistant()`: Detecta el tipo de asistente de IA actual a través de variables de entorno (run.js:105-124)
- `getAssistantInstructions(assistant, ...)`: Genera comandos correspondientes según el tipo de asistente de IA (run.js:130-183)

</details>
