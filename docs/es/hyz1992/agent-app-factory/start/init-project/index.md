---
title: "Inicialización de Factory: Configuración del Directorio en 3 Minutos | Agent Factory"
sidebarTitle: "Inicializar Proyecto en 3 Minutos"
subtitle: "Inicializar Proyecto Factory: Configuración desde Cero en 3 Minutos"
description: "Aprende a usar el comando factory init para inicializar rápidamente un proyecto de Agent App Factory. El tutorial cubre requisitos de directorio, estructura de archivos, configuración de permisos e inicio del asistente de IA."
tags:
  - "Inicialización de proyecto"
  - "factory init"
  - "Estructura de directorio"
prerequisite:
  - "start-installation"
order: 30
---

# Inicializar Proyecto Factory: Configuración desde Cero en 3 Minutos

## Lo Que Podrás Hacer Después

- Inicializar un proyecto Factory en cualquier directorio vacío
- Entender la estructura del directorio `.factory/` generado
- Configurar parámetros del proyecto (stack tecnológico, preferencias de UI, restricciones MVP)
- Iniciar automáticamente el asistente de IA y comenzar el pipeline

## Tu Problema Actual

¿Quieres probar AI App Factory pero no sabes por dónde empezar? ¿Miras una carpeta vacía y no sabes qué archivos crear? ¿O ya tienes algo de código y no estás seguro si puedes usarlo directamente? No te preocupes, el comando `factory init` se encargará de todo por ti.

## Cuándo Usar Este Método

- Primera vez que usas AI App Factory
- Comienzo de una nueva idea de producto
- Necesitas un entorno de proyecto Factory limpio

## 🎒 Preparación Antes de Comenzar

::: warning Verificación Previa

Antes de comenzar, confirma:

- ✅ [Instalación y configuración](../installation/) completada
- ✅ Asistente de IA instalado (Claude Code u OpenCode)
- ✅ Tienes un **directorio vacío** o un directorio que solo contiene configuraciones de Git/editor

:::

## Idea Central

El núcleo del comando `factory init` es la **autocontención**:

1. Copia todos los archivos necesarios (agents, skills, policies, pipeline.yaml) al directorio `.factory/` del proyecto
2. Genera archivos de configuración del proyecto (`config.yaml` y `state.json`)
3. Configura permisos de Claude Code (`.claude/settings.local.json`)
4. Instala automáticamente los plugins requeridos (superpowers, ui-ux-pro-max)
5. Inicia el asistente de IA y comienza el pipeline

De esta forma, cada proyecto Factory contiene todo lo necesario para ejecutarse, sin depender de instalaciones globales.

::: tip ¿Por qué autocontención?

Los beneficios del diseño autocontenido:

- **Aislamiento de versiones**: diferentes proyectos pueden usar diferentes versiones de la configuración de Factory
- **Portabilidad**: puedes enviar directamente el directorio `.factory/` a Git, los miembros del equipo pueden reutilizarlo
- **Seguridad**: la configuración de permisos solo se aplica dentro del directorio del proyecto, no afecta a otros proyectos

:::

## Sígueme

### Paso 1: Ingresa al Directorio del Proyecto

**Por qué**: necesitas un directorio de trabajo limpio para almacenar la aplicación generada.

```bash
# Crear nuevo directorio
mkdir my-app && cd my-app

# O ingresar a un directorio vacío existente
cd /ruta/a/tu/proyecto
```

**Lo que deberías ver**: el directorio está vacío, o solo contiene archivos permitidos como `.git/`, `.gitignore`, `README.md`.

### Paso 2: Ejecutar el Comando de Inicialización

**Por qué**: `factory init` creará el directorio `.factory/` y copiará todos los archivos necesarios.

```bash
factory init
```

**Lo que deberías ver**:

```
Agent Factory - Project Initialization

✓ Factory project initialized!

Project structure created:
  .factory/
    agents/
    skills/
    templates/
    policies/
    pipeline.yaml
    config.yaml
    state.json

Checking and installing required Claude plugins...
Installing superpowers plugin... ✓
Installing ui-ux-pro-max-skill plugin... ✓
Plugins installed!

Starting Claude Code...
✓ Claude Code is starting...
  (Please wait for window to open)
```

### Paso 3: Personalizar con Parámetros Opcionales (Opcional)

**Por qué**: si tienes preferencias claras de stack tecnológico, puedes especificarlas durante la inicialización.

```bash
factory init --name "Mi App de Contabilidad" --description "Ayudar a los jóvenes a registrar gastos diarios"
```

Estos parámetros se escribirán en `config.yaml`, afectando el código generado posteriormente.

### Paso 4: Verificar la Estructura del Directorio Generado

**Por qué**: confirmar que todos los archivos se han generado correctamente.

```bash
ls -la
```

**Lo que deberías ver**:

```
.claude/              # Directorio de configuración de Claude Code
  └── settings.local.json   # Configuración de permisos

.factory/            # Directorio central de Factory
  ├── agents/          # Archivos de definición de agentes
  ├── skills/          # Módulos de habilidades
  ├── templates/       # Plantillas de configuración
  ├── policies/        # Políticas y normas
  ├── pipeline.yaml    # Definición del pipeline
  ├── config.yaml      # Configuración del proyecto
  └── state.json      # Estado del pipeline
```

## Punto de Control ✅

Asegúrate de que se hayan creado los siguientes archivos:

- [ ] `.factory/pipeline.yaml` existe
- [ ] `.factory/config.yaml` existe
- [ ] `.factory/state.json` existe
- [ ] `.claude/settings.local.json` existe
- [ ] El directorio `.factory/agents/` contiene 7 archivos `.agent.md`
- [ ] El directorio `.factory/skills/` contiene 6 módulos de habilidades
- [ ] El directorio `.factory/policies/` contiene 7 documentos de políticas

## Explicación Detallada de Archivos Generados

### config.yaml: Configuración del Proyecto

`config.yaml` contiene información básica del proyecto y estado del pipeline:

```yaml
project:
  name: my-app                  # Nombre del proyecto
  description: ""                # Descripción del proyecto
  created_at: "2026-01-30T00:00:00.000Z"  # Fecha de creación
  updated_at: "2026-01-30T00:00:00.000Z"  # Fecha de actualización

pipeline:
  current_stage: null           # Etapa de ejecución actual
  completed_stages: []          # Lista de etapas completadas
  last_checkpoint: null         # Último punto de control

settings:
  auto_save: true               # Guardado automático
  backup_on_error: true        # Respaldo en caso de error
```

::: tip Modificar Configuración

Puedes editar `config.yaml` directamente después de `factory init`, y los cambios se aplicarán automáticamente cuando se ejecute el pipeline. No es necesario reinicializar.

:::

### state.json: Estado del Pipeline

`state.json` registra el progreso de ejecución del pipeline:

```json
{
  "version": 1,
  "status": "idle",
  "current_stage": null,
  "completed_stages": [],
  "started_at": null,
  "last_updated": "2026-01-30T00:00:00.000Z"
}
```

- `status`: estado actual (es `idle` durante la inicialización, cambiará dinámicamente a `running`, `waiting_for_confirmation`, `paused`, `failed` durante la ejecución)
- `current_stage`: etapa que se está ejecutando
- `completed_stages`: lista de etapas completadas

::: info Explicación de Estados

El pipeline se ejecuta usando una máquina de estados, el estado inicial es `idle`. Otros valores de estado se establecen dinámicamente durante la ejecución del pipeline:
- `idle`: esperando para iniciar
- `running`: ejecutando alguna etapa
- `waiting_for_confirmation`: esperando confirmación humana para continuar, reintentar o pausar
- `paused`: pausado manualmente
- `failed`: se detectó un fallo, requiere intervención manual

:::

::: warning No Editar Manualmente

`state.json` se mantiene automáticamente por el pipeline, la edición manual puede causar inconsistencia de estado. Para restablecer, usa el comando `factory reset`.

:::

### pipeline.yaml: Definición del Pipeline

Define el orden de ejecución y dependencias de 7 etapas:

```yaml
stages:
  - id: bootstrap
    description: Inicializar idea del proyecto
    agent: agents/bootstrap.agent.md
    inputs: []
    outputs: [input/idea.md]

  - id: prd
    description: Generar documento de requisitos del producto
    agent: agents/prd.agent.md
    inputs: [input/idea.md]
    outputs: [artifacts/prd/prd.md]

  # ... otras etapas
```

::: info Orden del Pipeline

El pipeline se ejecuta estrictamente en orden, no se puede saltar etapas. Después de completar cada etapa, se pausará para esperar confirmación.

:::

### .claude/settings.local.json: Configuración de Permisos

Configuración de permisos de Claude Code generada automáticamente, incluye:

- **Permisos de operaciones de archivos**: Read/Write/Glob/Edit para el directorio del proyecto
- **Permisos de comandos Bash**: git, npm, npx, docker, etc.
- **Permisos de Skills**: superpowers, ui-ux-pro-max y otras habilidades requeridas
- **Permisos de WebFetch**: permite acceder a dominios específicos (GitHub, NPM, etc.)

::: danger Seguridad

La configuración de permisos solo se aplica al directorio del proyecto actual, no afecta a otras ubicaciones del sistema. Este es uno de los diseños de seguridad de Factory.

:::

## Advertencias de Errores Comunes

### Error de Directorio No Vacío

**Mensaje de error**:

```
Cannot initialize: directory is not empty.
Factory init requires an empty directory or one with only git/config files.
```

**Causa**: existen archivos o directorios incompatibles en el directorio (como `artifacts/`, `input/`, etc.)

**Solución**:

1. Limpiar archivos en conflicto:
   ```bash
   rm -rf artifacts/ input/
   ```

2. O usar un nuevo directorio:
   ```bash
   mkdir my-app-new && cd my-app-new
   factory init
   ```

### Ya Es un Proyecto Factory

**Mensaje de error**:

```
This directory is already a Factory project:
  Name: my-app
  Created: 2026-01-29T13:00:00.000Z

To reset project, use: factory reset
```

**Causa**: el directorio `.factory/` ya existe

**Solución**:

```bash
# Restablecer estado del proyecto (mantener artefactos)
factory reset

# O reinicializar completamente (eliminar todo)
rm -rf .factory/
factory init
```

### Claude Code No Instalado

**Mensaje de error**:

```
Claude CLI not found - skipping plugin installation
Install Claude Code to enable plugins: https://claude.ai/code
```

**Causa**: no se ha instalado Claude Code CLI

**Solución**:

1. Instalar Claude Code: https://claude.ai/code
2. O ejecutar manualmente el pipeline (ver [Inicio rápido](../getting-started/))

### Fallo en la Instalación de Plugins

**Mensaje de error**:

```
Installing superpowers plugin... (failed)
Note: superpowers plugin installation failed
The bootstrap stage may prompt you to install it manually
```

**Causa**: problemas de red o configuración de Claude Code

**Solución**:

Ignora la advertencia y continúa. La etapa de Bootstrap te pedirá que instale los plugins manualmente.

## Resumen de Esta Lección

En esta lección aprendiste:

1. ✅ Usar el comando `factory init` para inicializar un proyecto Factory
2. ✅ Entender la estructura del directorio `.factory/` generado
3. ✅ Conocer las opciones de configuración en `config.yaml`
4. ✅ Entender la gestión de estado en `state.json`
5. ✅ Saber la configuración de permisos en `.claude/settings.local.json`

Después de completar la inicialización, el proyecto está listo para ejecutar el pipeline. El siguiente paso es aprender la [visión general del pipeline](../pipeline-overview/), entendiendo el proceso completo desde idea hasta aplicación.

## Avance de la Próxima Lección

> En la próxima lección aprenderemos **[Visión General del Pipeline](../pipeline-overview/)**.
>
> Aprenderás:
> - El orden y dependencias de las 7 etapas
> - Entradas y salidas de cada etapa
> - Cómo el mecanismo de puntos de control garantiza calidad
> - Manejo de fallos y estrategias de reintento

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-29

| Función        | Ruta de archivo                                                                                    | Línea    |
| ----------- | ------------------------------------------------------------------------------------------- | ------- |
| Lógica principal de init | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)         | 220-456  |
| Verificación de seguridad de directorio | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)         | 32-53    |
| Generación de configuración    | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)         | 58-76    |
| Configuración de permisos de Claude | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 41-248   |
| Definición del pipeline  | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml)               | 7-111    |
| Plantilla de configuración del proyecto | [`config.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/config.yaml)                   | 1-102    |

**Funciones clave**:
- `isFactoryProject()`: verifica si el directorio ya es un proyecto Factory (líneas 22-26)
- `isDirectorySafeToInit()`: verifica si el directorio se puede inicializar de forma segura (líneas 32-53)
- `generateConfig()`: genera la configuración del proyecto (líneas 58-76)
- `generateClaudeSettings()`: genera la configuración de permisos de Claude Code (líneas 256-275)

</details>
