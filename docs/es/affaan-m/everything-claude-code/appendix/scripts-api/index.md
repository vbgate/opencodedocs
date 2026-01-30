---
title: "Scripts API: Scripts de Node.js | Everything Claude Code"
sidebarTitle: "Escribir tus Scripts de Hook"
subtitle: "Scripts API: Scripts de Node.js"
description: "Aprende la API de Scripts de Everything Claude Code. Domina la detección de plataformas, operaciones de archivos, API del gestor de paquetes y el uso de scripts de Hook."
tags:
  - "scripts-api"
  - "api"
  - "nodejs"
  - "utils"
  - "package-manager"
  - "hooks"
prerequisite:
  - "start-package-manager-setup"
order: 215
---

# Referencia de Scripts API: Interfaz de Scripts Node.js

## Lo que aprenderás

- Comprender completamente la API de scripts de Everything Claude Code
- Usar funciones de detección de plataforma y utilidades multiplataforma
- Configurar y usar el mecanismo de detección automática del gestor de paquetes
- Escribir scripts de Hook personalizados para extender las capacidades de automatización
- Depurar y modificar implementaciones de scripts existentes

## Tu situación actual

Ya sabes que Everything Claude Code tiene muchos scripts de automatización, pero te encuentras con estos problemas:

- "¿Qué APIs proporcionan exactamente estos scripts de Node.js?"
- "¿Cómo personalizo los scripts de Hook?"
- "¿Cuál es la prioridad de detección del gestor de paquetes?"
- "¿Cómo implemento compatibilidad multiplataforma en los scripts?"

Este tutorial te dará una referencia completa de la API de Scripts.

## Concepto central

El sistema de scripts de Everything Claude Code se divide en dos categorías:

1. **Biblioteca de utilidades compartidas** (`scripts/lib/`) - Proporciona funciones multiplataforma y APIs
2. **Scripts de Hook** (`scripts/hooks/`) - Lógica de automatización activada en eventos específicos

Todos los scripts soportan **Windows, macOS y Linux**, implementados usando módulos nativos de Node.js.

### Estructura de scripts

```
scripts/
├── lib/
│   ├── utils.js              # Funciones de utilidad general
│   └── package-manager.js    # Detección del gestor de paquetes
├── hooks/
│   ├── session-start.js       # Hook SessionStart
│   ├── session-end.js         # Hook SessionEnd
│   ├── pre-compact.js        # Hook PreCompact
│   ├── suggest-compact.js     # Hook PreToolUse
│   └── evaluate-session.js   # Hook Stop
└── setup-package-manager.js   # Script de configuración del gestor de paquetes
```

## lib/utils.js - Funciones de utilidad general

Este módulo proporciona funciones de utilidad multiplataforma, incluyendo detección de plataforma, operaciones de archivos, comandos del sistema, etc.

### Detección de plataforma

```javascript
const {
  isWindows,
  isMacOS,
  isLinux
} = require('./lib/utils');
```

| Función | Tipo | Valor de retorno | Descripción |
| --- | --- | --- | --- |
| `isWindows` | boolean | `true/false` | Si la plataforma actual es Windows |
| `isMacOS` | boolean | `true/false` | Si la plataforma actual es macOS |
| `isLinux` | boolean | `true/false` | Si la plataforma actual es Linux |

**Principio de implementación**: Basado en la evaluación de `process.platform`

```javascript
const isWindows = process.platform === 'win32';
const isMacOS = process.platform === 'darwin';
const isLinux = process.platform === 'linux';
```

### Utilidades de directorios

```javascript
const {
  getHomeDir,
  getClaudeDir,
  getSessionsDir,
  getLearnedSkillsDir,
  getTempDir,
  ensureDir
} = require('./lib/utils');
```

#### getHomeDir()

Obtiene el directorio home del usuario (compatible multiplataforma)

**Valor de retorno**: `string` - Ruta del directorio home del usuario

**Ejemplo**:
```javascript
const homeDir = getHomeDir();
// Windows: C:\Users\username
// macOS: /Users/username
// Linux: /home/username
```

#### getClaudeDir()

Obtiene el directorio de configuración de Claude Code

**Valor de retorno**: `string` - Ruta del directorio `~/.claude`

**Ejemplo**:
```javascript
const claudeDir = getClaudeDir();
// /Users/username/.claude
```

#### getSessionsDir()

Obtiene el directorio de archivos de sesión

**Valor de retorno**: `string` - Ruta del directorio `~/.claude/sessions`

**Ejemplo**:
```javascript
const sessionsDir = getSessionsDir();
// /Users/username/.claude/sessions
```

#### getLearnedSkillsDir()

Obtiene el directorio de habilidades aprendidas

**Valor de retorno**: `string` - Ruta del directorio `~/.claude/skills/learned`

**Ejemplo**:
```javascript
const learnedDir = getLearnedSkillsDir();
// /Users/username/.claude/skills/learned
```

#### getTempDir()

Obtiene el directorio temporal del sistema (multiplataforma)

**Valor de retorno**: `string` - Ruta del directorio temporal

**Ejemplo**:
```javascript
const tempDir = getTempDir();
// macOS: /var/folders/...
// Linux: /tmp
// Windows: C:\Users\username\AppData\Local\Temp
```

#### ensureDir(dirPath)

Asegura que el directorio existe, lo crea si no existe

**Parámetros**:
- `dirPath` (string) - Ruta del directorio

**Valor de retorno**: `string` - Ruta del directorio

**Ejemplo**:
```javascript
const dir = ensureDir('/path/to/new/dir');
// Si el directorio no existe, se crea recursivamente
```

### Utilidades de fecha y hora

```javascript
const {
  getDateString,
  getTimeString,
  getDateTimeString
} = require('./lib/utils');
```

#### getDateString()

Obtiene la fecha actual (formato: YYYY-MM-DD)

**Valor de retorno**: `string` - Cadena de fecha

**Ejemplo**:
```javascript
const date = getDateString();
// '2026-01-25'
```

#### getTimeString()

Obtiene la hora actual (formato: HH:MM)

**Valor de retorno**: `string` - Cadena de hora

**Ejemplo**:
```javascript
const time = getTimeString();
// '14:30'
```

#### getDateTimeString()

Obtiene la fecha y hora actual (formato: YYYY-MM-DD HH:MM:SS)

**Valor de retorno**: `string` - Cadena de fecha y hora

**Ejemplo**:
```javascript
const datetime = getDateTimeString();
// '2026-01-25 14:30:45'
```

### Operaciones de archivos

```javascript
const {
  findFiles,
  readFile,
  writeFile,
  appendFile,
  replaceInFile,
  countInFile,
  grepFile
} = require('./lib/utils');
```

#### findFiles(dir, pattern, options)

Busca archivos que coincidan con un patrón en un directorio (alternativa multiplataforma a `find`)

**Parámetros**:
- `dir` (string) - Directorio a buscar
- `pattern` (string) - Patrón de archivo (ej. `"*.tmp"`, `"*.md"`)
- `options` (object, opcional) - Opciones
  - `maxAge` (number) - Antigüedad máxima del archivo en días
  - `recursive` (boolean) - Si buscar recursivamente

**Valor de retorno**: `Array<{path: string, mtime: number}>` - Lista de archivos coincidentes, ordenados por fecha de modificación descendente

**Ejemplo**:
```javascript
// Buscar archivos .tmp de los últimos 7 días
const recentFiles = findFiles('/tmp', '*.tmp', { maxAge: 7 });
// [{ path: '/tmp/session.tmp', mtime: 1737804000000 }]

// Buscar recursivamente todos los archivos .md
const allMdFiles = findFiles('./docs', '*.md', { recursive: true });
```

::: tip Compatibilidad multiplataforma
Esta función proporciona búsqueda de archivos multiplataforma, no depende del comando Unix `find`, por lo que funciona correctamente en Windows.
:::

#### readFile(filePath)

Lee un archivo de texto de forma segura

**Parámetros**:
- `filePath` (string) - Ruta del archivo

**Valor de retorno**: `string | null` - Contenido del archivo, devuelve `null` si falla la lectura

**Ejemplo**:
```javascript
const content = readFile('/path/to/file.txt');
if (content !== null) {
  console.log(content);
}
```

#### writeFile(filePath, content)

Escribe un archivo de texto

**Parámetros**:
- `filePath` (string) - Ruta del archivo
- `content` (string) - Contenido del archivo

**Valor de retorno**: ninguno

**Ejemplo**:
```javascript
writeFile('/path/to/file.txt', 'Hello, World!');
// Si el directorio no existe, se crea automáticamente
```

#### appendFile(filePath, content)

Añade contenido a un archivo de texto

**Parámetros**:
- `filePath` (string) - Ruta del archivo
- `content` (string) - Contenido a añadir

**Valor de retorno**: ninguno

**Ejemplo**:
```javascript
appendFile('/path/to/log.txt', 'New log entry\n');
```

#### replaceInFile(filePath, search, replace)

Reemplaza texto en un archivo (alternativa multiplataforma a `sed`)

**Parámetros**:
- `filePath` (string) - Ruta del archivo
- `search` (string | RegExp) - Contenido a buscar
- `replace` (string) - Contenido de reemplazo

**Valor de retorno**: `boolean` - Si el reemplazo fue exitoso

**Ejemplo**:
```javascript
const success = replaceInFile('/path/to/file.txt', 'old text', 'new text');
// true: reemplazo exitoso
// false: archivo no existe o fallo de lectura
```

#### countInFile(filePath, pattern)

Cuenta las ocurrencias de un patrón en un archivo

**Parámetros**:
- `filePath` (string) - Ruta del archivo
- `pattern` (string | RegExp) - Patrón a contar

**Valor de retorno**: `number` - Número de coincidencias

**Ejemplo**:
```javascript
const count = countInFile('/path/to/file.txt', /error/g);
// 5
```

#### grepFile(filePath, pattern)

Busca un patrón en un archivo y devuelve las líneas coincidentes con números de línea

**Parámetros**:
- `filePath` (string) - Ruta del archivo
- `pattern` (string | RegExp) - Patrón a buscar

**Valor de retorno**: `Array<{lineNumber: number, content: string}>` - Lista de líneas coincidentes

**Ejemplo**:
```javascript
const matches = grepFile('/path/to/file.txt', /function\s+\w+/);
// [{ lineNumber: 10, content: 'function test() {...}' }]
```

### Hook I/O

```javascript
const {
  readStdinJson,
  log,
  output
} = require('./lib/utils');
```

#### readStdinJson()

Lee datos JSON desde la entrada estándar (para entrada de Hook)

**Valor de retorno**: `Promise<object>` - Objeto JSON parseado

**Ejemplo**:
```javascript
async function main() {
  const hookInput = await readStdinJson();
  console.log(hookInput.tool);
  console.log(hookInput.tool_input);
}
```

::: tip Formato de entrada del Hook
El formato de entrada que Claude Code pasa al Hook es:
```json
{
  "tool": "Bash",
  "tool_input": { "command": "npm run dev" },
  "tool_output": { "output": "..." }
}
```
:::

#### log(message)

Registra un mensaje en stderr (visible para el usuario)

**Parámetros**:
- `message` (string) - Mensaje de log

**Valor de retorno**: ninguno

**Ejemplo**:
```javascript
log('[SessionStart] Loading context...');
// Se muestra en stderr, visible para el usuario en Claude Code
```

#### output(data)

Envía datos a stdout (devuelve a Claude Code)

**Parámetros**:
- `data` (object | string) - Datos a enviar

**Valor de retorno**: ninguno

**Ejemplo**:
```javascript
// Enviar objeto (serialización JSON automática)
output({ success: true, message: 'Completed' });

// Enviar cadena
output('Hello, Claude');
```

### Comandos del sistema

```javascript
const {
  commandExists,
  runCommand,
  isGitRepo,
  getGitModifiedFiles
} = require('./lib/utils');
```

#### commandExists(cmd)

Verifica si un comando existe en el PATH

**Parámetros**:
- `cmd` (string) - Nombre del comando

**Valor de retorno**: `boolean` - Si el comando existe

**Ejemplo**:
```javascript
if (commandExists('pnpm')) {
  console.log('pnpm is available');
}
```

::: warning Validación de seguridad
Esta función valida el nombre del comando con regex, solo permite letras, números, guiones bajos, puntos y guiones, previniendo inyección de comandos.
:::

#### runCommand(cmd, options)

Ejecuta un comando y devuelve la salida

**Parámetros**:
- `cmd` (string) - Comando a ejecutar (debe ser un comando confiable y hardcodeado)
- `options` (object, opcional) - Opciones de `execSync`

**Valor de retorno**: `{success: boolean, output: string}` - Resultado de la ejecución

**Ejemplo**:
```javascript
const result = runCommand('git status');
if (result.success) {
  console.log(result.output);
} else {
  console.error(result.output);
}
```

::: danger Advertencia de seguridad
**Usa esta función solo para comandos confiables y hardcodeados**. No pases entrada controlada por el usuario directamente a esta función. Para entrada de usuario, usa `spawnSync` con array de argumentos.
:::

#### isGitRepo()

Verifica si el directorio actual es un repositorio Git

**Valor de retorno**: `boolean` - Si es un repositorio Git

**Ejemplo**:
```javascript
if (isGitRepo()) {
  console.log('This is a Git repository');
}
```

#### getGitModifiedFiles(patterns = [])

Obtiene la lista de archivos modificados en Git

**Parámetros**:
- `patterns` (string[], opcional) - Array de patrones de filtro

**Valor de retorno**: `string[]` - Lista de rutas de archivos modificados

**Ejemplo**:
```javascript
// Obtener todos los archivos modificados
const allModified = getGitModifiedFiles();

// Obtener solo archivos TypeScript
const tsModified = getGitModifiedFiles([/\.ts$/, /\.tsx$/]);
```

## lib/package-manager.js - API del gestor de paquetes

Este módulo proporciona la API de detección automática y configuración del gestor de paquetes.

### Gestores de paquetes soportados

```javascript
const { PACKAGE_MANAGERS } = require('./lib/package-manager');
```

| Gestor de paquetes | Archivo lock | Comando install | Comando run | Comando exec |
| --- | --- | --- | --- | --- |
| `npm` | package-lock.json | `npm install` | `npm run` | `npx` |
| `pnpm` | pnpm-lock.yaml | `pnpm install` | `pnpm` | `pnpm dlx` |
| `yarn` | yarn.lock | `yarn` | `yarn` | `yarn dlx` |
| `bun` | bun.lockb | `bun install` | `bun run` | `bunx` |

### Prioridad de detección

```javascript
const { DETECTION_PRIORITY } = require('./lib/package-manager');

// ['pnpm', 'bun', 'yarn', 'npm']
```

La detección del gestor de paquetes sigue esta prioridad (de mayor a menor):

1. Variable de entorno `CLAUDE_PACKAGE_MANAGER`
2. Configuración a nivel de proyecto `.claude/package-manager.json`
3. Campo `packageManager` en `package.json`
4. Detección de archivo lock
5. Preferencia global del usuario `~/.claude/package-manager.json`
6. Devuelve el primer gestor de paquetes disponible según prioridad

### Funciones principales

```javascript
const {
  getPackageManager,
  setPreferredPackageManager,
  setProjectPackageManager,
  getAvailablePackageManagers,
  getRunCommand,
  getExecCommand,
  getCommandPattern
} = require('./lib/package-manager');
```

#### getPackageManager(options = {})

Obtiene el gestor de paquetes que debe usar el proyecto actual

**Parámetros**:
- `options` (object, opcional)
  - `projectDir` (string) - Ruta del directorio del proyecto, por defecto `process.cwd()`
  - `fallbackOrder` (string[]) - Orden de respaldo, por defecto `['pnpm', 'bun', 'yarn', 'npm']`

**Valor de retorno**: `{name: string, config: object, source: string}`

- `name`: Nombre del gestor de paquetes
- `config`: Objeto de configuración del gestor de paquetes
- `source`: Fuente de detección (`'environment' | 'project-config' | 'package.json' | 'lock-file' | 'global-config' | 'fallback' | 'default'`)

**Ejemplo**:
```javascript
const pm = getPackageManager();
console.log(pm.name);        // 'pnpm'
console.log(pm.source);      // 'lock-file'
console.log(pm.config);      // { name: 'pnpm', lockFile: 'pnpm-lock.yaml', ... }
```

#### setPreferredPackageManager(pmName)

Establece la preferencia global del gestor de paquetes

**Parámetros**:
- `pmName` (string) - Nombre del gestor de paquetes (`npm | pnpm | yarn | bun`)

**Valor de retorno**: `object` - Objeto de configuración

**Ejemplo**:
```javascript
const config = setPreferredPackageManager('pnpm');
// Guarda en ~/.claude/package-manager.json
// { packageManager: 'pnpm', setAt: '2026-01-25T...' }
```

#### setProjectPackageManager(pmName, projectDir)

Establece la preferencia del gestor de paquetes a nivel de proyecto

**Parámetros**:
- `pmName` (string) - Nombre del gestor de paquetes
- `projectDir` (string) - Ruta del directorio del proyecto, por defecto `process.cwd()`

**Valor de retorno**: `object` - Objeto de configuración

**Ejemplo**:
```javascript
const config = setProjectPackageManager('bun', '/path/to/project');
// Guarda en /path/to/project/.claude/package-manager.json
// { packageManager: 'bun', setAt: '2026-01-25T...' }
```

#### getAvailablePackageManagers()

Obtiene la lista de gestores de paquetes instalados en el sistema

**Valor de retorno**: `string[]` - Array de nombres de gestores de paquetes disponibles

**Ejemplo**:
```javascript
const available = getAvailablePackageManagers();
// ['pnpm', 'npm']  // Si solo están instalados pnpm y npm
```

#### getRunCommand(script, options = {})

Obtiene el comando para ejecutar un script

**Parámetros**:
- `script` (string) - Nombre del script (ej. `"dev"`, `"build"`, `"test"`)
- `options` (object, opcional) - Opciones del directorio del proyecto

**Valor de retorno**: `string` - Comando de ejecución completo

**Ejemplo**:
```javascript
const devCmd = getRunCommand('dev');
// 'npm run dev'  o  'pnpm dev'  o  'bun run dev'

const buildCmd = getRunCommand('build');
// 'npm run build'  o  'pnpm build'
```

**Atajos de scripts integrados**:
- `install` → Devuelve `installCmd`
- `test` → Devuelve `testCmd`
- `build` → Devuelve `buildCmd`
- `dev` → Devuelve `devCmd`
- Otros → Devuelve `${runCmd} ${script}`

#### getExecCommand(binary, args = '', options = {})

Obtiene el comando para ejecutar un binario de paquete

**Parámetros**:
- `binary` (string) - Nombre del binario (ej. `"prettier"`, `"eslint"`)
- `args` (string, opcional) - Cadena de argumentos
- `options` (object, opcional) - Opciones del directorio del proyecto

**Valor de retorno**: `string` - Comando de ejecución completo

**Ejemplo**:
```javascript
const cmd = getExecCommand('prettier', '--write file.js');
// 'npx prettier --write file.js'  o  'pnpm dlx prettier --write file.js'

const eslintCmd = getExecCommand('eslint');
// 'npx eslint'  o  'bunx eslint'
```

#### getCommandPattern(action)

Genera un patrón de expresión regular que coincide con comandos de todos los gestores de paquetes

**Parámetros**:
- `action` (string) - Tipo de acción (`'dev' | 'install' | 'test' | 'build'` o nombre de script personalizado)

**Valor de retorno**: `string` - Patrón de expresión regular

**Ejemplo**:
```javascript
const devPattern = getCommandPattern('dev');
// (npm run dev|pnpm( run)? dev|yarn dev|bun run dev)

const installPattern = getCommandPattern('install');
// (npm install|pnpm install|yarn( install)?|bun install)
```

## setup-package-manager.js - Script de configuración del gestor de paquetes

Este es un script CLI ejecutable para configurar interactivamente las preferencias del gestor de paquetes.

### Uso

```bash
# Detectar y mostrar el gestor de paquetes actual
node scripts/setup-package-manager.js --detect

# Establecer preferencia global
node scripts/setup-package-manager.js --global pnpm

# Establecer preferencia del proyecto
node scripts/setup-package-manager.js --project bun

# Listar gestores de paquetes disponibles
node scripts/setup-package-manager.js --list

# Mostrar ayuda
node scripts/setup-package-manager.js --help
```

### Argumentos de línea de comandos

| Argumento | Descripción |
| --- | --- |
| `--detect` | Detectar y mostrar el gestor de paquetes actual |
| `--global <pm>` | Establecer preferencia global del gestor de paquetes |
| `--project <pm>` | Establecer preferencia del gestor de paquetes del proyecto |
| `--list` | Listar todos los gestores de paquetes disponibles |
| `--help` | Mostrar información de ayuda |

### Ejemplo de salida

**Salida de --detect**:
```
=== Package Manager Detection ===

Current selection:
  Package Manager: pnpm
  Source: lock-file

Detection results:
  From package.json: not specified
  From lock file: pnpm
  Environment var: not set

Available package managers:
  ✓ pnpm (current)
  ✓ npm
  ✗ yarn
  ✗ bun

Commands:
  Install: pnpm install
  Run script: pnpm [script-name]
  Execute binary: pnpm dlx [binary-name]
```

## Detalles de los scripts de Hook

### session-start.js - Hook de inicio de sesión

**Tipo de Hook**: `SessionStart`

**Momento de activación**: Al iniciar una sesión de Claude Code

**Funcionalidad**:
- Verificar archivos de sesión recientes (últimos 7 días)
- Verificar archivos de habilidades aprendidas
- Detectar e informar el gestor de paquetes
- Si el gestor de paquetes se detecta por fallback, mostrar mensaje de selección

**Ejemplo de salida**:
```
[SessionStart] Found 3 recent session(s)
[SessionStart] Latest: /Users/username/.claude/sessions/2026-01-25-session.tmp
[SessionStart] 5 learned skill(s) available in /Users/username/.claude/skills/learned
[SessionStart] Package manager: pnpm (lock-file)
```

### session-end.js - Hook de fin de sesión

**Tipo de Hook**: `SessionEnd`

**Momento de activación**: Al finalizar una sesión de Claude Code

**Funcionalidad**:
- Crear o actualizar el archivo de sesión del día
- Registrar hora de inicio y fin de sesión
- Proporcionar plantilla de estado de sesión (completado, en progreso, notas)

**Plantilla de archivo de sesión**:
```markdown
# Session: 2026-01-25
**Date:** 2026-01-25
**Started:** 14:30
**Last Updated:** 15:45

---

## Current State

[Session context goes here]

### Completed
- [ ]

### In Progress
- [ ]

### Notes for Next Session
-

### Context to Load
```
[relevant files]
```
```

### pre-compact.js - Hook de pre-compactación

**Tipo de Hook**: `PreCompact`

**Momento de activación**: Antes de que Claude Code compacte el contexto

**Funcionalidad**:
- Registrar evento de compactación en archivo de log
- Marcar el momento de compactación en el archivo de sesión activo

**Ejemplo de salida**:
```
[PreCompact] State saved before compaction
```

**Archivo de log**: `~/.claude/sessions/compaction-log.txt`

### suggest-compact.js - Hook de sugerencia de compactación

**Tipo de Hook**: `PreToolUse`

**Momento de activación**: Después de cada llamada a herramienta (generalmente Edit o Write)

**Funcionalidad**:
- Rastrear el número de llamadas a herramientas
- Sugerir compactación manual al alcanzar el umbral
- Recordar periódicamente el momento de compactación

**Variables de entorno**:
- `COMPACT_THRESHOLD` - Umbral de compactación (por defecto: 50)
- `CLAUDE_SESSION_ID` - ID de sesión

**Ejemplo de salida**:
```
[StrategicCompact] 50 tool calls reached - consider /compact if transitioning phases
[StrategicCompact] 75 tool calls - good checkpoint for /compact if context is stale
```

::: tip Compactación manual vs automática
¿Por qué se recomienda la compactación manual?
- La compactación automática generalmente se activa a mitad de tarea, causando pérdida de contexto
- La compactación manual puede preservar información importante durante cambios de fase lógica
- Momentos de compactación: fin de fase de exploración, inicio de fase de ejecución, hitos completados
:::

### evaluate-session.js - Hook de evaluación de sesión

**Tipo de Hook**: `Stop`

**Momento de activación**: Al final de cada respuesta de IA

**Funcionalidad**:
- Verificar la longitud de la sesión (basada en número de mensajes del usuario)
- Evaluar si la sesión contiene patrones extraíbles
- Sugerir guardar habilidades aprendidas

**Archivo de configuración**: `skills/continuous-learning/config.json`

**Variables de entorno**:
- `CLAUDE_TRANSCRIPT_PATH` - Ruta del archivo de transcripción de sesión

**Ejemplo de salida**:
```
[ContinuousLearning] Session has 25 messages - evaluate for extractable patterns
[ContinuousLearning] Save learned skills to: /Users/username/.claude/skills/learned
```

::: tip ¿Por qué usar Stop en lugar de UserPromptSubmit?
- Stop se activa solo una vez por respuesta (ligero)
- UserPromptSubmit se activa con cada mensaje (alta latencia)
:::

## Scripts de Hook personalizados

### Crear un Hook personalizado

1. **Crear script en el directorio `scripts/hooks/`**

```javascript
#!/usr/bin/env node
/**
 * Custom Hook - Tu descripción
 *
 * Multiplataforma (Windows, macOS, Linux)
 */

const { log, output } = require('../lib/utils');

async function main() {
  // Tu lógica
  log('[CustomHook] Processing...');
  
  // Enviar resultado
  output({ success: true });
  
  process.exit(0);
}

main().catch(err => {
  console.error('[CustomHook] Error:', err.message);
  process.exit(0); // No bloquear la sesión
});
```

2. **Configurar Hook en `hooks/hooks.json`**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"your_pattern\"",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/your-hook.js\""
    }
  ],
  "description": "Descripción de tu hook personalizado"
}
```

3. **Probar el Hook**

```bash
# Activar la condición en Claude Code, verificar la salida
```

### Mejores prácticas

#### 1. Manejo de errores

```javascript
main().catch(err => {
  console.error('[HookName] Error:', err.message);
  process.exit(0); // No bloquear la sesión
});
```

#### 2. Usar la biblioteca de utilidades

```javascript
const {
  log,
  readFile,
  writeFile,
  ensureDir
} = require('../lib/utils');
```

#### 3. Rutas multiplataforma

```javascript
const path = require('path');
const filePath = path.join(getHomeDir(), '.claude', 'config.json');
```

#### 4. Variables de entorno

```javascript
const sessionId = process.env.CLAUDE_SESSION_ID || 'default';
const transcriptPath = process.env.CLAUDE_TRANSCRIPT_PATH;
```

## Probar scripts

### Probar funciones de utilidad

```javascript
const { findFiles, readFile, writeFile } = require('./lib/utils');

// Probar búsqueda de archivos
const files = findFiles('/tmp', '*.tmp', { maxAge: 7 });
console.log('Found files:', files);

// Probar lectura/escritura de archivos
writeFile('/tmp/test.txt', 'Hello, World!');
const content = readFile('/tmp/test.txt');
console.log('Content:', content);
```

### Probar detección del gestor de paquetes

```javascript
const { getPackageManager, getRunCommand } = require('./lib/package-manager');

const pm = getPackageManager();
console.log('Package manager:', pm.name);
console.log('Source:', pm.source);
console.log('Dev command:', getRunCommand('dev'));
```

### Probar scripts de Hook

```bash
# Ejecutar script de Hook directamente (requiere variables de entorno)
CLAUDE_SESSION_ID=test CLAUDE_TRANSCRIPT_PATH=/tmp/transcript.json \
  node scripts/hooks/session-start.js
```

## Consejos de depuración

### 1. Usar salida de log

```javascript
const { log } = require('../lib/utils');

log('[Debug] Current value:', value);
```

### 2. Capturar errores

```javascript
try {
  // Código que puede fallar
} catch (err) {
  console.error('[Error]', err.message);
  console.error('[Stack]', err.stack);
}
```

### 3. Verificar rutas de archivos

```javascript
const path = require('path');
const { existsSync } = require('fs');

const filePath = path.join(getHomeDir(), '.claude', 'config.json');
console.log('Config path:', filePath);
console.log('Exists:', existsSync(filePath));
```

### 4. Ver logs de ejecución de Hook

```bash
# En Claude Code, la salida stderr del Hook se muestra en la respuesta
# Buscar logs con prefijo [HookName]
```

## Preguntas frecuentes

### P1: ¿El script de Hook no se ejecuta?

**Posibles causas**:
1. Configuración incorrecta del matcher en `hooks/hooks.json`
2. Ruta del script incorrecta
3. El script no tiene permisos de ejecución

**Pasos de diagnóstico**:
```bash
# Verificar ruta del script
ls -la scripts/hooks/

# Ejecutar script manualmente para probar
node scripts/hooks/session-start.js

# Verificar sintaxis de hooks.json
cat hooks/hooks.json | jq '.'
```

### P2: ¿Error de ruta en Windows?

**Causa**: Windows usa barras invertidas, mientras que Unix usa barras normales

**Solución**:
```javascript
// ❌ Incorrecto: separador de ruta hardcodeado
const path = 'C:\\Users\\username\\.claude';

// ✅ Correcto: usar path.join()
const path = require('path');
const claudePath = path.join(getHomeDir(), '.claude');
```

### P3: ¿Cómo depurar la entrada del Hook?

**Método**: Escribir la entrada del Hook en un archivo temporal

```javascript
const { writeFileSync } = require('fs');
const path = require('path');

async function main() {
  const hookInput = await readStdinJson();
  
  // Escribir archivo de depuración
  const debugPath = path.join(getTempDir(), 'hook-debug.json');
  writeFileSync(debugPath, JSON.stringify(hookInput, null, 2));
  
  console.error('[Debug] Input saved to:', debugPath);
}
```

## Resumen de la lección

Esta lección explicó sistemáticamente la API de Scripts de Everything Claude Code:

**Módulos principales**:
- `lib/utils.js`: Funciones de utilidad multiplataforma (detección de plataforma, operaciones de archivos, comandos del sistema)
- `lib/package-manager.js`: API de detección y configuración del gestor de paquetes
- `setup-package-manager.js`: Herramienta de configuración CLI

**Scripts de Hook**:
- `session-start.js`: Cargar contexto al inicio de sesión
- `session-end.js`: Guardar estado al fin de sesión
- `pre-compact.js`: Guardar estado antes de compactación
- `suggest-compact.js`: Sugerir momento de compactación manual
- `evaluate-session.js`: Evaluar sesión para extraer patrones

**Mejores prácticas**:
- Usar funciones de la biblioteca de utilidades para garantizar compatibilidad multiplataforma
- Los scripts de Hook no deben bloquear la sesión (código de salida 0 en caso de error)
- Usar `log()` para salida de depuración
- Usar `process.env` para leer variables de entorno

**Consejos de depuración**:
- Ejecutar scripts directamente para probar
- Usar archivos temporales para guardar datos de depuración
- Verificar configuración del matcher y rutas de scripts

## Próxima lección

> En la próxima lección aprenderemos **[Suite de pruebas: Ejecución y personalización](../test-suite/)**.
>
> Aprenderás:
> - Cómo ejecutar la suite de pruebas
> - Cómo escribir pruebas unitarias para funciones de utilidad
> - Cómo escribir pruebas de integración para scripts de Hook
> - Cómo agregar casos de prueba personalizados

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver las ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-25

| Módulo funcional | Ruta del archivo | Líneas |
| --- | --- | --- |
| Funciones de utilidad general | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |
| API del gestor de paquetes | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js) | 1-391 |
| Script de configuración del gestor de paquetes | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js) | 1-207 |
| Hook SessionStart | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| Hook SessionEnd | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| Hook PreCompact | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Hook Suggest Compact | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Hook Evaluate Session | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |

**Constantes clave**:
- `DETECTION_PRIORITY = ['pnpm', 'bun', 'yarn', 'npm']`: Prioridad de detección del gestor de paquetes (`scripts/lib/package-manager.js:57`)
- `COMPACT_THRESHOLD`: Umbral de sugerencia de compactación (por defecto 50, configurable mediante variable de entorno)

**Funciones clave**:
- `getPackageManager()`: Detectar y seleccionar gestor de paquetes (`scripts/lib/package-manager.js:157`)
- `findFiles()`: Búsqueda de archivos multiplataforma (`scripts/lib/utils.js:102`)
- `readStdinJson()`: Leer entrada del Hook (`scripts/lib/utils.js:154`)
- `commandExists()`: Verificar si existe un comando (`scripts/lib/utils.js:228`)

**Variables de entorno**:
- `CLAUDE_PACKAGE_MANAGER`: Forzar gestor de paquetes específico
- `CLAUDE_SESSION_ID`: ID de sesión
- `CLAUDE_TRANSCRIPT_PATH`: Ruta del archivo de transcripción de sesión
- `COMPACT_THRESHOLD`: Umbral de sugerencia de compactación

**Detección de plataforma**:
- `process.platform === 'win32'`: Windows
- `process.platform === 'darwin'`: macOS
- `process.platform === 'linux'`: Linux

</details>
