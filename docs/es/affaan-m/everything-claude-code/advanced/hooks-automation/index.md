---
title: "Automatización con Hooks: Análisis de 15+ Hooks | Everything Claude Code"
sidebarTitle: "Haz que Claude trabaje automáticamente"
subtitle: "Automatización con Hooks: Análisis Profundo de 15+ Hooks"
description: "Aprende el mecanismo de automatización con 15+ hooks de Everything Claude Code. Tutorial sobre 6 tipos de Hooks, 14 funcionalidades principales e implementación con scripts Node.js."
tags:
  - "advanced"
  - "hooks"
  - "automation"
  - "nodejs"
prerequisite:
  - "start-installation"
  - "platforms-commands-overview"
order: 90
---

# Automatización con Hooks: Análisis Profundo de 15+ Hooks

## Lo que aprenderás

- Comprender los 6 tipos de Hooks de Claude Code y sus mecanismos de activación
- Dominar la funcionalidad y configuración de 14 Hooks integrados
- Aprender a personalizar Hooks usando scripts Node.js
- Guardar y cargar contexto automáticamente al inicio/fin de sesión
- Implementar funcionalidades de automatización como sugerencias de compresión inteligente y formateo automático de código

## Tu situación actual

Deseas que Claude Code ejecute automáticamente ciertas operaciones cuando ocurren eventos específicos, como:
- Cargar automáticamente el contexto anterior al iniciar una sesión
- Formatear automáticamente después de cada edición de código
- Recordarte revisar los cambios antes de hacer push
- Sugerir compresión de contexto en el momento apropiado

Pero estas funcionalidades requieren activación manual, o necesitas comprender profundamente el sistema de Hooks de Claude Code para implementarlas. Esta lección te ayudará a dominar estas capacidades de automatización.

## Cuándo usar esta técnica

- Necesitas mantener contexto y estado de trabajo entre sesiones
- Deseas ejecutar automáticamente verificaciones de calidad de código (formateo, verificación TypeScript)
- Quieres recibir recordatorios antes de operaciones específicas (como revisar cambios antes de git push)
- Necesitas optimizar el uso de tokens, comprimiendo contexto en el momento apropiado
- Deseas extraer automáticamente patrones reutilizables de las sesiones

## Concepto central

**Qué son los Hooks**

Los **Hooks** son un mecanismo de automatización proporcionado por Claude Code que puede activar scripts personalizados cuando ocurren eventos específicos. Funcionan como un "event listener" que ejecuta automáticamente operaciones predefinidas cuando se cumplen las condiciones.

::: info Cómo funcionan los Hooks

```
Acción del usuario → Evento activado → Verificación Hook → Ejecución script → Retorno resultado
     ↓                    ↓                  ↓                 ↓                ↓
  Usar herramienta    PreToolUse      Coincide condición   Script Node.js   Salida a consola
```

Por ejemplo, cuando usas la herramienta Bash para ejecutar `npm run dev`:
1. El Hook PreToolUse detecta el patrón del comando
2. Si no estás en tmux, bloquea automáticamente y muestra un aviso
3. Ves el aviso y usas la forma correcta de iniciar

:::

**6 tipos de Hooks**

Everything Claude Code utiliza 6 tipos de Hooks:

| Tipo de Hook | Momento de activación | Caso de uso |
| --- | --- | --- |
| **PreToolUse** | Antes de ejecutar cualquier herramienta | Validar comandos, bloquear operaciones, mostrar sugerencias |
| **PostToolUse** | Después de ejecutar cualquier herramienta | Formateo automático, verificación de tipos, registro de logs |
| **PreCompact** | Antes de comprimir contexto | Guardar estado, registrar evento de compresión |
| **SessionStart** | Al iniciar nueva sesión | Cargar contexto, detectar gestor de paquetes |
| **SessionEnd** | Al finalizar sesión | Guardar estado, evaluar sesión, extraer patrones |
| **Stop** | Al finalizar cada respuesta | Verificar archivos modificados, recordar limpieza |

::: tip Orden de ejecución de Hooks

En un ciclo de vida completo de sesión, los Hooks se ejecutan en el siguiente orden:

```
SessionStart → [PreToolUse → PostToolUse]×N → PreCompact → Stop → SessionEnd
```

Donde `[PreToolUse → PostToolUse]` se repite cada vez que se usa una herramienta.

:::

**Reglas de coincidencia de Hooks**

Cada Hook usa una expresión `matcher` para decidir si ejecutarse. Claude Code utiliza expresiones JavaScript que pueden verificar:

- Tipo de herramienta: `tool == "Bash"`, `tool == "Edit"`
- Contenido del comando: `tool_input.command matches "npm run dev"`
- Ruta de archivo: `tool_input.file_path matches "\\.ts$"`
- Condiciones combinadas: `tool == "Bash" && tool_input.command matches "git push"`

**Por qué usar scripts Node.js**

Todos los Hooks de Everything Claude Code están implementados con scripts Node.js, no scripts Shell. Las razones son:

| Ventaja | Scripts Shell | Scripts Node.js |
| --- | --- | --- |
| **Multiplataforma** | ❌ Requiere ramas Windows/macOS/Linux | ✅ Automáticamente multiplataforma |
| **Procesamiento JSON** | ❌ Requiere herramientas adicionales (jq) | ✅ Soporte nativo |
| **Operaciones de archivos** | ⚠️ Comandos complejos | ✅ API fs concisa |
| **Manejo de errores** | ❌ Requiere implementación manual | ✅ Soporte nativo try/catch |

## Sigue los pasos

### Paso 1: Ver la configuración actual de Hooks

**Por qué**
Comprender la configuración existente de Hooks, saber qué funcionalidades de automatización ya están habilitadas

```bash
## Ver configuración hooks.json
cat source/affaan-m/everything-claude-code/hooks/hooks.json
```

**Deberías ver**: Archivo de configuración JSON que contiene definiciones de 6 tipos de Hooks

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [...],
    "PostToolUse": [...],
    "PreCompact": [...],
    "SessionStart": [...],
    "Stop": [...],
    "SessionEnd": [...]
  }
}
```

### Paso 2: Comprender los Hooks PreToolUse

**Por qué**
PreToolUse es el tipo de Hook más utilizado, puede bloquear operaciones o proporcionar avisos

Veamos los 5 Hooks PreToolUse en Everything Claude Code:

#### 1. Tmux Dev Server Block

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"console.error('[Hook] BLOCKED: Dev server must run in tmux for log access');console.error('[Hook] Use: tmux new-session -d -s dev \\\"npm run dev\\\"');console.error('[Hook] Then: tmux attach -t dev');process.exit(1)\""
  }],
  "description": "Block dev servers outside tmux - ensures you can access logs"
}
```

**Funcionalidad**: Bloquea el inicio de dev server fuera de tmux

**Por qué es necesario**: Ejecutar el dev server en tmux permite separar la sesión, pudiendo seguir viendo los logs incluso después de cerrar Claude Code

#### 2. Git Push Reminder

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"git push\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"console.error('[Hook] Review changes before push...');console.error('[Hook] Continuing with push (remove this hook to add interactive review)')\""
  }],
  "description": "Reminder before git push to review changes"
}
```

**Funcionalidad**: Te recuerda revisar los cambios antes de `git push`

**Por qué es necesario**: Evita commits accidentales de código no revisado

#### 3. Block Random MD Files

```json
{
  "matcher": "tool == \"Write\" && tool_input.file_path matches \"\\\\.(md|txt)$\" && !(tool_input.file_path matches \"README\\\\.md|CLAUDE\\\\.md|AGENTS\\\\.md|CONTRIBUTING\\\\.md\")",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{...process.exit(1)}console.log(d)})\""
  }],
  "description": "Block creation of random .md files - keeps docs consolidated"
}
```

**Funcionalidad**: Bloquea la creación de archivos .md no documentales

**Por qué es necesario**: Evita dispersión de documentación, mantiene el proyecto ordenado

#### 4. Suggest Compact

```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
  }],
  "description": "Suggest manual compaction at logical intervals"
}
```

**Funcionalidad**: Al editar o escribir archivos, sugiere compresión de contexto

**Por qué es necesario**: Comprimir manualmente en el momento apropiado mantiene el contexto conciso

### Paso 3: Comprender los Hooks PostToolUse

**Por qué**
PostToolUse se ejecuta automáticamente después de completar operaciones, ideal para verificaciones automáticas de calidad

Everything Claude Code tiene 4 Hooks PostToolUse:

#### 1. Auto Format

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...try{execSync('npx prettier --write \"'+p+'\"',{stdio:['pipe','pipe','pipe']})}catch(e){}}console.log(d)})\""
  }],
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**Funcionalidad**: Ejecuta automáticamente formateo con Prettier después de editar archivos .js/.ts/.jsx/.tsx

**Por qué es necesario**: Mantiene consistencia en el estilo de código

#### 2. TypeScript Check

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...if(fs.existsSync(path.join(dir,'tsconfig.json'))){try{const r=execSync('npx tsc --noEmit --pretty false 2>&1',{cwd:dir,...});...}catch(e){...}}console.log(d)})\""
  }],
  "description": "TypeScript check after editing .ts/.tsx files"
}
```

**Funcionalidad**: Ejecuta automáticamente verificación de tipos TypeScript después de editar archivos .ts/.tsx

**Por qué es necesario**: Detecta errores de tipos tempranamente

#### 3. Console.log Warning

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const fs=require('fs');...const c=fs.readFileSync(p,'utf8');const lines=c.split('\\n');...if(/console\\.log/.test(l))matches.push((idx+1)+': '+l.trim())...console.log(d)})\""
  }],
  "description": "Warn about console.log statements after edits"
}
```

**Funcionalidad**: Verifica si hay declaraciones console.log después de editar archivos

**Por qué es necesario**: Evita commits de código de depuración

#### 4. Log PR URL

```json
{
  "matcher": "tool == \"Bash\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"...const cmd=i.tool_input?.command||'';if(/gh pr create/.test(cmd)){const out=i.tool_output?.output||'';...console.error('[Hook] PR created: '+m[0])...}console.log(d)})\""
  }],
  "description": "Log PR URL and provide review command after PR creation"
}
```

**Funcionalidad**: Muestra automáticamente la URL del PR y el comando de revisión después de crear un PR

**Por qué es necesario**: Facilita el acceso rápido al PR recién creado

### Paso 4: Comprender los Hooks del ciclo de vida de sesión

**Por qué**
Los Hooks SessionStart y SessionEnd se utilizan para persistir contexto entre sesiones

#### Hook SessionStart

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
  }],
  "description": "Load previous context and detect package manager on new session"
}
```

**Funcionalidad**:
- Verifica archivos de sesión de los últimos 7 días
- Verifica skills aprendidos
- Detecta gestor de paquetes
- Muestra información de contexto cargable

**Lógica del script** (`session-start.js`):

```javascript
// Verificar archivos de sesión de los últimos 7 días
const recentSessions = findFiles(sessionsDir, '*.tmp', { maxAge: 7 });

// Verificar skills aprendidos
const learnedSkills = findFiles(learnedDir, '*.md');

// Detectar gestor de paquetes
const pm = getPackageManager();

// Si usa valor predeterminado, sugerir selección
if (pm.source === 'fallback' || pm.source === 'default') {
  log('[SessionStart] No package manager preference found.');
  log(getSelectionPrompt());
}
```

#### Hook SessionEnd

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
  }],
  "description": "Persist session state on end"
}
```

**Funcionalidad**:
- Crea o actualiza archivo de sesión
- Registra hora de inicio y fin de sesión
- Genera plantilla de sesión (Completed, In Progress, Notes)

**Plantilla de archivo de sesión** (`session-end.js`):

```
# Session: 2026-01-25
**Date:** 2026-01-25
**Started:** 10:30
**Last Updated:** 14:20

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
[relevant files]
```

Los marcadores `[Session context goes here]` y `[relevant files]` en la plantilla son placeholders que debes completar manualmente con el contenido real de la sesión y los archivos relevantes.

### Paso 5: Comprender los Hooks relacionados con compresión

**Por qué**
Los Hooks PreCompact y Stop se utilizan para gestión de contexto y decisiones de compresión

#### Hook PreCompact

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
  }],
  "description": "Save state before context compaction"
}
```

**Funcionalidad**:
- Registra evento de compresión en log
- Marca el momento de compresión en el archivo de sesión activa

**Lógica del script** (`pre-compact.js`):

```javascript
// Registrar evento de compresión
appendFile(compactionLog, `[${timestamp}] Context compaction triggered\n`);

// Marcar en archivo de sesión
appendFile(activeSession, `\n---\n**[Compaction occurred at ${timeStr}]** - Context was summarized\n`);
```

#### Hook Stop

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...const files=execSync('git diff --name-only HEAD'...).split('\\n')...let hasConsole=false;for(const f of files){if(fs.readFileSync(f,'utf8').includes('console.log')){console.error('[Hook] WARNING: console.log found in '+f);hasConsole=true}}...console.log(d)})\""
  }],
  "description": "Check for console.log in modified files after each response"
}
```

**Funcionalidad**: Verifica si hay console.log en todos los archivos modificados

**Por qué es necesario**: Como última línea de defensa, evita commits de código de depuración

### Paso 6: Comprender el Hook de aprendizaje continuo

**Por qué**
El Hook Evaluate Session se utiliza para extraer patrones reutilizables de las sesiones

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/evaluate-session.js\""
  }],
  "description": "Evaluate session for extractable patterns"
}
```

**Funcionalidad**:
- Lee el registro de sesión (transcript)
- Cuenta número de mensajes del usuario
- Si la sesión es suficientemente larga (predeterminado > 10 mensajes), sugiere evaluar patrones extraíbles

**Lógica del script** (`evaluate-session.js`):

```javascript
// Leer configuración
const config = JSON.parse(readFile(configFile));
const minSessionLength = config.min_session_length || 10;

// Contar mensajes del usuario
const messageCount = countInFile(transcriptPath, /"type":"user"/g);

// Omitir sesiones cortas
if (messageCount < minSessionLength) {
  log(`[ContinuousLearning] Session too short (${messageCount} messages), skipping`);
  process.exit(0);
}

// Sugerir evaluación
log(`[ContinuousLearning] Session has ${messageCount} messages - evaluate for extractable patterns`);
log(`[ContinuousLearning] Save learned skills to: ${learnedSkillsPath}`);
```

### Paso 7: Personalizar Hooks

**Por qué**
Según las necesidades del proyecto, crea tus propias reglas de automatización

**Ejemplo: Bloquear comandos peligrosos en entorno de producción**

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"(rm -rf /|docker rm.*--force|DROP DATABASE)\"",
        "hooks": [{
          "type": "command",
          "command": "node -e \"console.error('[Hook] BLOCKED: Dangerous command detected');console.error('[Hook] Command: '+process.argv[2]);process.exit(1)\""
        }],
        "description": "Block dangerous commands"
      }
    ]
  }
}
```

**Pasos de configuración**:

1. Crear script de Hook personalizado:
   ```bash
   # Crear scripts/hooks/custom-hook.js
   vi scripts/hooks/custom-hook.js
   ```

2. Editar `~/.claude/settings.json`:
   ```json
   {
     "hooks": {
       "PreToolUse": [
         {
           "matcher": "tool == \"Bash\" && tool_input.command matches \"your pattern\"",
           "hooks": [{
             "type": "command",
             "command": "node /path/to/your/script.js"
           }],
           "description": "Your custom hook"
         }
       ]
     }
   }
   ```

3. Reiniciar Claude Code

**Deberías ver**: Información de salida cuando se activa el Hook

## Punto de verificación ✅

Confirma que comprendes los siguientes puntos:

- [ ] Los Hooks son un mecanismo de automatización basado en eventos
- [ ] Claude Code tiene 6 tipos de Hooks
- [ ] PreToolUse se activa antes de ejecutar herramientas, puede bloquear operaciones
- [ ] PostToolUse se activa después de ejecutar herramientas, ideal para verificaciones automáticas
- [ ] SessionStart/SessionEnd se utilizan para persistir contexto entre sesiones
- [ ] Everything Claude Code usa scripts Node.js para compatibilidad multiplataforma
- [ ] Puedes personalizar Hooks modificando `~/.claude/settings.json`

## Errores comunes

### ❌ Errores en scripts Hook causan bloqueo de sesión

**Problema**: El script Hook lanza una excepción sin salir correctamente, causando timeout en Claude Code

**Causa**: Los errores en el script Node.js no se capturan correctamente

**Solución**:
```javascript
// Ejemplo incorrecto
main();  // Si lanza excepción, causará problemas

// Ejemplo correcto
main().catch(err => {
  console.error('[Hook] Error:', err.message);
  process.exit(0);  // Salir normalmente incluso con error
});
```

### ❌ Usar scripts Shell causa problemas multiplataforma

**Problema**: Los scripts Shell fallan al ejecutarse en Windows

**Causa**: Los comandos Shell no son compatibles entre diferentes sistemas operativos

**Solución**: Usar scripts Node.js en lugar de scripts Shell

| Funcionalidad | Script Shell | Script Node.js |
| --- | --- | --- |
| Leer archivo | `cat file.txt` | `fs.readFileSync('file.txt')` |
| Verificar directorio | `[ -d dir ]` | `fs.existsSync(dir)` |
| Variable de entorno | `$VAR` | `process.env.VAR` |

### ❌ Salida excesiva de Hooks causa inflación de contexto

**Problema**: Cada operación genera mucha información de depuración, causando rápida inflación del contexto

**Causa**: El script Hook usa demasiados console.log

**Solución**:
- Solo mostrar información necesaria
- Usar `console.error` para avisos importantes (se resaltan en Claude Code)
- Usar salida condicional, imprimir solo cuando sea necesario

```javascript
// Ejemplo incorrecto
console.log('[Hook] Starting...');
console.log('[Hook] File:', filePath);
console.log('[Hook] Size:', size);
console.log('[Hook] Done');  // Demasiada salida

// Ejemplo correcto
if (someCondition) {
  console.error('[Hook] Warning: File is too large');
}
```

### ❌ Hook PreToolUse bloquea operaciones necesarias

**Problema**: Las reglas de coincidencia del Hook son demasiado amplias, bloqueando operaciones normales por error

**Causa**: La expresión matcher no coincide con precisión con el escenario

**Solución**:
- Probar la precisión de la expresión matcher
- Añadir más condiciones para limitar el alcance de activación
- Proporcionar mensajes de error claros y sugerencias de solución

```json
// Ejemplo incorrecto: Coincide con todos los comandos npm
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm\""
}

// Ejemplo correcto: Solo coincide con comandos dev
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm run dev\""
}
```

## Resumen de la lección

**Resumen de 6 tipos de Hooks**:

| Tipo de Hook | Momento de activación | Uso típico | Cantidad en Everything Claude Code |
| --- | --- | --- | --- |
| PreToolUse | Antes de ejecutar herramienta | Validar, bloquear, avisar | 5 |
| PostToolUse | Después de ejecutar herramienta | Formatear, verificar, registrar | 4 |
| PreCompact | Antes de comprimir contexto | Guardar estado | 1 |
| SessionStart | Al iniciar nueva sesión | Cargar contexto, detectar PM | 1 |
| SessionEnd | Al finalizar sesión | Guardar estado, evaluar sesión | 2 |
| Stop | Al finalizar respuesta | Verificar modificaciones | 1 |

**Puntos clave**:

1. **Los Hooks son basados en eventos**: Se ejecutan automáticamente en eventos específicos
2. **Matcher decide activación**: Usa expresiones JavaScript para coincidir condiciones
3. **Implementación con scripts Node.js**: Compatibilidad multiplataforma, evita scripts Shell
4. **Manejo de errores importante**: Los scripts deben salir normalmente incluso con errores
5. **Salida concisa**: Evitar demasiados logs que causen inflación de contexto
6. **Configuración en settings.json**: Añadir Hooks personalizados modificando `~/.claude/settings.json`

**Mejores prácticas**:

```
1. Usar PreToolUse para validar operaciones peligrosas
2. Usar PostToolUse para verificaciones automáticas de calidad
3. Usar SessionStart/End para persistir contexto
4. Al personalizar Hooks, probar primero la expresión matcher
5. Usar try/catch y process.exit(0) en scripts
6. Solo mostrar información necesaria, evitar inflación de contexto
```

## Próxima lección

> En la próxima lección aprenderemos **[Mecanismo de Aprendizaje Continuo](../continuous-learning/)**.
>
> Aprenderás:
> - Cómo Continuous Learning extrae automáticamente patrones reutilizables
> - Usar el comando `/learn` para extraer patrones manualmente
> - Configurar la longitud mínima de sesión para evaluación
> - Gestionar el directorio de learned skills

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-25

| Funcionalidad | Ruta del archivo | Líneas |
| --- | --- | --- |
| Configuración principal de Hooks | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Script SessionStart | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| Script SessionEnd | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| Script PreCompact | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Script Suggest Compact | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Script Evaluate Session | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |
| Biblioteca de utilidades | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-150 |
| Detección de gestor de paquetes | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js) | 1-100 |

**Constantes clave**:
- Ninguna (configuración cargada dinámicamente)

**Funciones clave**:
- `getSessionsDir()`: Obtiene ruta del directorio de sesiones
- `getLearnedSkillsDir()`: Obtiene ruta del directorio de learned skills
- `findFiles(dir, pattern, options)`: Busca archivos, soporta filtrado por tiempo
- `ensureDir(path)`: Asegura que el directorio existe, lo crea si no existe
- `getPackageManager()`: Detecta gestor de paquetes (soporta 6 niveles de prioridad)
- `log(message)`: Muestra información de log del Hook

**Configuración clave**:
- `min_session_length`: Número mínimo de mensajes para evaluación de sesión (predeterminado 10)
- `COMPACT_THRESHOLD`: Umbral de llamadas a herramientas para sugerir compresión (predeterminado 50)
- `CLAUDE_PLUGIN_ROOT`: Variable de entorno del directorio raíz del plugin

**14 Hooks principales**:
1. Tmux Dev Server Block (PreToolUse)
2. Tmux Reminder (PreToolUse)
3. Git Push Reminder (PreToolUse)
4. Block Random MD Files (PreToolUse)
5. Suggest Compact (PreToolUse)
6. Save Before Compact (PreCompact)
7. Session Start Load (SessionStart)
8. Log PR URL (PostToolUse)
9. Auto Format (PostToolUse)
10. TypeScript Check (PostToolUse)
11. Console.log Warning (PostToolUse)
12. Check Console.log (Stop)
13. Session End Save (SessionEnd)
14. Evaluate Session (SessionEnd)

</details>
