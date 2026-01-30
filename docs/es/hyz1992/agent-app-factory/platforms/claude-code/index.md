---
title: "Integración con Claude Code: Configurar permisos para ejecutar pipelines | Tutorial de AI App Factory"
sidebarTitle: "Configurar Claude Code en 5 minutos"
subtitle: "Integración con Claude Code: Configurar permisos para ejecutar pipelines | Tutorial de AI App Factory"
description: "Aprende a configurar los permisos de Claude Code para ejecutar de forma segura los pipelines de AI App Factory. Entiende cómo generar automáticamente settings.local.json, el mecanismo de lista blanca y las mejores prácticas de configuración de permisos multiplataforma, evitando el uso del parámetro peligroso --dangerously-skip-permissions. Este tutorial cubre el manejo de rutas en Windows/macOS/Linux y la solución de problemas comunes de permisos."
tags:
  - "Claude Code"
  - "Configuración de permisos"
  - "Asistente de IA"
prerequisite:
  - "start-installation"
  - "start-init-project"
order: 50
---

# Integración con Claude Code: Configurar permisos para ejecutar pipelines | Tutorial de AI App Factory

## Lo que podrás hacer después de completar este curso

- Configurar permisos seguros para Claude Code sin necesidad de usar `--dangerously-skip-permissions`
- Entender la lista blanca de permisos generada automáticamente por Factory
- Ejecutar el pipeline completo de 7 etapas en Claude Code
- Dominar la configuración de permisos multiplataforma (Windows/macOS/Linux)

## Tu situación actual

Al usar Factory por primera vez, es posible que te encuentres con los siguientes desafíos:

- **Permisos bloqueados**: Claude Code indica "no tienes permiso para leer el archivo"
- **Uso de parámetros peligrosos**: Obligado a añadir `--dangerously-skip-permissions` para evitar los controles de seguridad
- **Configuración manual tediosa**: Incierto sobre qué operaciones se deben permitir
- **Problemas multiplataforma**: Inconsistencias entre los permisos de rutas de Windows y Unix

En realidad, Factory **genera automáticamente** una configuración completa de permisos, solo necesitas usarla correctamente.

## Cuándo usar este enfoque

Cuando necesites ejecutar el pipeline de Factory en Claude Code:

- Después de usar `factory init` para inicializar el proyecto (se inicia automáticamente)
- Al usar `factory run` para continuar el pipeline
- Al iniciar Claude Code manualmente

::: info ¿Por qué recomendamos Claude Code?
Claude Code es el asistente de programación con IA oficial de Anthropic, profundamente integrado con el sistema de permisos de Factory. En comparación con otros asistentes de IA, la gestión de permisos de Claude Code es más granular y segura.
:::

## Concepto clave

La configuración de permisos de Factory utiliza un **mecanismo de lista blanca**: solo se permiten las operaciones explícitamente definidas, todo lo demás está prohibido.

### Categorías de la lista blanca de permisos

| Categoría | Operaciones permitidas | Uso |
| --- | --- | --- |
| **Operaciones de archivo** | Read/Write/Edit/Glob | Leer y modificar archivos del proyecto |
| **Operaciones de Git** | git add/commit/push, etc. | Control de versiones |
| **Operaciones de directorio** | ls/cd/tree/pwd | Navegar por la estructura de directorios |
| **Herramientas de construcción** | npm/yarn/pnpm | Instalar dependencias, ejecutar scripts |
| **TypeScript** | tsc/npx tsc | Verificación de tipos |
| **Base de datos** | npx prisma | Migraciones y gestión de base de datos |
| **Python** | python/pip | Sistema de diseño de UI |
| **Pruebas** | vitest/jest/test | Ejecutar pruebas |
| **Factory CLI** | factory init/run/continue | Comandos del pipeline |
| **Docker** | docker compose | Despliegue con contenedores |
| **Operaciones Web** | WebFetch(domain:...) | Obtener documentación de API |
| **Skills** | superpowers/ui-ux-pro-max | Complementos de habilidades |

### ¿Por qué no usar `--dangerously-skip-permissions`?

| Método | Seguridad | Recomendado |
| --- | --- | --- |
| `--dangerously-skip-permissions` | ❌ Permite que Claude realice cualquier operación (incluida la eliminación de archivos) | No recomendado |
| Lista blanca de permisos | ✅ Solo permite operaciones explícitas, las acciones no autorizadas generan errores | Recomendado |

La configuración de lista blanca, aunque requiere una configuración inicial compleja, se reutiliza automáticamente después de generarse una vez y es más segura.

## 🎒 Preparativos antes de comenzar

Antes de empezar, confirma lo siguiente:

- [x] Has completado la **instalación y configuración** ([start/installation/](../../start/installation/))
- [x] Has completado la **inicialización del proyecto Factory** ([start/init-project/](../../start/init-project/))
- [x] Has instalado Claude Code: https://claude.ai/code
- [x] El directorio del proyecto ha sido inicializado (existe el directorio `.factory/`)

::: warning Verificar la instalación de Claude Code
Ejecuta el siguiente comando en la terminal para confirmar:

```bash
claude --version
```

Si se indica "command not found", instala Claude Code primero.
:::

## Sigue los pasos

### Paso 1: Inicializar el proyecto (generar permisos automáticamente)

**Por qué**: `factory init` generará automáticamente `.claude/settings.local.json`, que contiene la lista blanca completa de permisos.

Ejecuta en el directorio del proyecto:

```bash
# Crear nuevo directorio y entrar
mkdir my-factory-project && cd my-factory-project

# Inicializar proyecto Factory
factory init
```

**Deberías ver**:

```
✓ Factory project initialized!
✓ Claude Code is starting...
  (Please wait for window to open)
```

La ventana de Claude Code se abrirá automáticamente y mostrará el siguiente mensaje:

```
Por favor, lee .factory/pipeline.yaml y .factory/agents/orchestrator.checkpoint.md,
inicia el pipeline y ayúdame a transformar fragmentos de ideas de productos en una aplicación ejecutable.
A continuación, ingresaré los fragmentos de ideas. Nota: Los archivos skills/ y policies/
referenciados por los Agentes deben buscarse primero en el directorio .factory/, luego en el directorio raíz.
```

**Lo que sucedió**:

1. Se creó el directorio `.factory/` que contiene la configuración del pipeline
2. Se generó `.claude/settings.local.json` (lista blanca de permisos)
3. Se inició automáticamente Claude Code y se pasó el mensaje de inicio

### Paso 2: Verificar la configuración de permisos

**Por qué**: Confirmar que el archivo de permisos se generó correctamente para evitar problemas de permisos durante la ejecución.

Verifica el archivo de permisos generado:

```bash
# Ver el contenido del archivo de permisos
cat .claude/settings.local.json
```

**Deberías ver** (contenido parcial):

```json
{
  "permissions": {
    "allow": [
      "Read(/path/to/project/**)",
      "Write(/path/to/project/**)",
      "Glob(/path/to/project/**)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(npm install:*)",
      "Bash(npx prisma generate:*)",
      "Skill(superpowers:brainstorming)",
      "Skill(ui-ux-pro-max)",
      "WebFetch(domain:github.com)",
      "WebFetch(domain:npmjs.org)"
    ]
  },
  "features": {
    "autoSave": true,
    "telemetry": false
  }
}
```

::: tip Explicación de las rutas
Las rutas en los permisos se ajustan automáticamente según tu sistema operativo:

- **Windows**: `Read(//c/Users/...)` (se admiten letras de unidad tanto en minúsculas como mayúsculas)
- **macOS/Linux**: `Read(/Users/...)` (rutas absolutas)
:::

### Paso 3: Iniciar el pipeline en Claude Code

**Por qué**: Claude Code ya tiene configurados los permisos y puede leer directamente las definiciones de Agent y archivos de Skills.

En la ventana de Claude Code ya abierta, ingresa tu idea de producto:

```
Quiero crear una aplicación de contabilidad para dispositivos móviles que ayude a los jóvenes a registrar rápidamente sus gastos diarios,
evitando superar el presupuesto al final del mes. Las funciones principales son registrar el monto, seleccionar categorías (alimentación, transporte, entretenimiento, otros),
ver el total de gastos del mes.
```

**Deberías ver**:

Claude Code ejecutará los siguientes pasos (se completan automáticamente):

1. Lee `.factory/pipeline.yaml`
2. Lee `.factory/agents/orchestrator.checkpoint.md`
3. Inicia la **etapa Bootstrap**, estructurando tu idea como `input/idea.md`
4. Se detiene al completar, esperando tu confirmación

**Punto de verificación ✅**: Confirma que la etapa Bootstrap ha finalizado

```bash
# Ver la idea estructurada generada
cat input/idea.md
```

### Paso 4: Continuar el pipeline

**Por qué**: Cada vez que se completa una etapa, necesitas confirmar manualmente para evitar la acumulación de errores.

En Claude Code, responde:

```
Continuar
```

Claude Code avanzará automáticamente a la siguiente etapa (PRD) y repetirá el flujo "ejecutar → detener → confirmar" hasta completar las 7 etapas.

::: tip Usar `factory run` para reiniciar
Si la ventana de Claude Code se ha cerrado, puedes ejecutar en la terminal:

```bash
factory run
```

Esto mostrará nuevamente las instrucciones de ejecución de Claude Code.
:::

### Paso 5: Manejo de permisos multiplataforma (usuarios de Windows)

**Por qué**: Los permisos de rutas en Windows requieren un tratamiento especial para asegurar que Claude Code pueda acceder correctamente a los archivos del proyecto.

Si usas Windows, `factory init` generará automáticamente permisos que admiten letras de unidad:

```json
{
  "permissions": {
    "allow": [
      "Read(//c/Users/yourname/project/**)",
      "Read(//C/Users/yourname/project/**)",
      "Write(//c/Users/yourname/project/**)",
      "Write(//C/Users/yourname/project/**)"
    ]
  }
}
```

**Punto de verificación ✅**: Usuarios de Windows, verifican los permisos

```powershell
# PowerShell
Get-Content .claude\settings.local.json | Select-String -Pattern "Read|Write"
```

Si ves ambos formatos de ruta `//c/` y `//C/`, significa que está configurado correctamente.

## Punto de verificación ✅

Después de completar los pasos anteriores, deberías ser capaz de:

- [x] Encontrar el archivo `.claude/settings.local.json`
- [x] Ver la lista blanca completa de permisos (incluye Read/Write/Bash/Skill/WebFetch)
- [x] Iniciar exitosamente la etapa Bootstrap en Claude Code
- [x] Ver `input/idea.md` para confirmar que la idea ha sido estructurada
- [x] Continuar ejecutando el pipeline a la siguiente etapa

Si encuentras errores de permisos, consulta la sección "Advertencias sobre problemas comunes" a continuación.

## Advertencias sobre problemas comunes

### Problema 1: Permisos bloqueados

**Mensaje de error**:
```
Permission denied: Read(path/to/file)
```

**Causa**:
- Fallo en la generación del archivo de permisos o ruta incorrecta
- Claude Code está usando caché de permisos antigua

**Solución**:

1. Verificar que el archivo de permisos existe:

```bash
ls -la .claude/settings.local.json
```

2. Regenerar permisos:

```bash
# Eliminar archivo de permisos antiguo
rm .claude/settings.local.json

# Reinicializar (se regenerará)
factory init --force
```

3. Reiniciar Claude Code, limpiar caché.

### Problema 2: Advertencia `--dangerously-skip-permissions`

**Mensaje de error**:
```
Using --dangerously-skip-permissions is not recommended.
```

**Causa**:
- No se encontró `.claude/settings.local.json`
- Formato de archivo de permisos incorrecto

**Solución**:

Verificar el formato del archivo de permisos (sintaxis JSON):

```bash
# Validar formato JSON
python -m json.tool .claude/settings.local.json
```

Si se indica un error de sintaxis, elimina el archivo y vuelve a ejecutar `factory init`.

### Problema 3: Permisos de rutas de Windows no funcionan

**Mensaje de error**:
```
Permission denied: Read(C:\Users\yourname\project\file.js)
```

**Causa**:
- Falta la ruta de la letra de unidad en la configuración de permisos
- Formato de ruta incorrecto (Windows necesita usar formato `//c/`)

**Solución**:

Edita manualmente `.claude\settings.local.json`, añadiendo rutas con letras de unidad:

```json
{
  "permissions": {
    "allow": [
      "Read(//c/Users/yourname/project/**)",
      "Write(//c/Users/yourname/project/**)"
    ]
  }
}
```

Nota que se debe admitir tanto mayúsculas como minúsculas para la letra de unidad (`//c/` y `//C/`).

### Problema 4: Permisos de Skills bloqueados

**Mensaje de error**:
```
Permission denied: Skill(superpowers:brainstorming)
```

**Causa**:
- No están instalados los complementos necesarios de Claude Code (superpowers, ui-ux-pro-max)
- Versión de complementos incompatible

**Solución**:

1. Añadir marketplace de complementos:

```bash
# Añadir marketplace de complementos superpowers
claude plugin marketplace add obra/superpowers-marketplace
```

2. Instalar complemento superpowers:

```bash
claude plugin install superpowers@superpowers-marketplace
```

3. Añadir marketplace de complementos ui-ux-pro-max:

```bash
claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
```

4. Instalar complemento ui-ux-pro-max:

```bash
claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

5. Volver a ejecutar el pipeline.

::: info Factory intentará instalar complementos automáticamente
El comando `factory init` intentará instalar estos complementos automáticamente. Si falla, instálalos manualmente.
:::

## Resumen de esta lección

- **Lista blanca de permisos** es más segura que `--dangerously-skip-permissions`
- **`factory init`** genera automáticamente `.claude/settings.local.json`
- La configuración de permisos incluye categorías como **operaciones de archivos, Git, herramientas de construcción, base de datos, operaciones Web**
- **Soporte multiplataforma**: Windows usa rutas `//c/`, Unix usa rutas absolutas
- **Instalación manual de complementos**: Si la instalación automática falla, debes instalar superpowers y ui-ux-pro-max manualmente en Claude Code

## Próxima lección

> En la próxima lección aprenderemos **[OpenCode y otros asistentes de IA](../other-ai-assistants/)**.
>
> Aprenderás:
> - Cómo ejecutar el pipeline de Factory en OpenCode
> - Métodos de integración con otros asistentes de IA como Cursor, GitHub Copilot
> - Diferencias en la configuración de permisos entre diferentes asistentes

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-29

| Función | Ruta del archivo | Líneas |
| --- | --- | --- |
| Generación de configuración de permisos | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 1-292 |
| Inicio automático de Claude Code | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 119-147 |
| Detección de asistente de IA | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 105-124 |
| Generación de instrucciones de Claude Code | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 138-156 |
| Manejo de rutas multiplataforma | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 14-67 |

**Funciones clave**:
- `generatePermissions(projectDir)`: Genera la lista blanca completa de permisos, incluyendo operaciones como Read/Write/Bash/Skill/WebFetch
- `generateClaudeSettings(projectDir)`: Genera y escribe el archivo `.claude/settings.local.json`
- `launchClaudeCode(projectDir)`: Inicia la ventana de Claude Code y pasa el mensaje de inicio
- `detectAIAssistant()`: Detecta el tipo de asistente de IA en ejecución (Claude Code/Cursor/OpenCode)

**Constantes clave**:
- Patrón de ruta de Windows: `Read(//c/**)`, `Write(//c/**)` (admite mayúsculas y minúsculas para la letra de unidad)
- Patrón de ruta de Unix: `Read(/path/to/project/**)`, `Write(/path/to/project/**)`
- Permisos de Skills: `'Skill(superpowers:brainstorming)'`, `'Skill(ui-ux-pro-max)'`

**Categorías de lista blanca de permisos**:
- **Operaciones de archivo**: Read/Write/Glob (admite comodines)
- **Operaciones de Git**: git add/commit/push/pull, etc. (conjunto completo de comandos Git)
- **Herramientas de construcción**: npm/yarn/pnpm install/build/test/dev
- **TypeScript**: tsc/npx tsc/npx type-check
- **Base de datos**: npx prisma validate/generate/migrate/push
- **Python**: python/pip install (para ui-ux-pro-max)
- **Pruebas**: vitest/jest/test
- **Factory CLI**: factory init/run/continue/status/reset
- **Docker**: docker compose/ps/build/run
- **Operaciones Web**: WebFetch(domain:github.com), etc. (lista blanca de dominios específicos)

</details>
