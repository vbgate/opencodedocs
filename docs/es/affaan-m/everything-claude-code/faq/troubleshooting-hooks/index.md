---
title: "Solución de problemas: Problemas con Hooks | everything-claude-code"
sidebarTitle: "Solución de Hooks en 5 minutos"
subtitle: "Solución de problemas: Problemas con Hooks | everything-claude-code"
description: "Aprende métodos de solución de problemas para Hooks. Diagnostica sistemáticamente problemas de variables de entorno, permisos, sintaxis JSON, etc., para asegurar el funcionamiento normal de SessionStart/End y PreToolUse."
tags:
  - "hooks"
  - "troubleshooting"
  - "faq"
prerequisite:
  - "advanced-hooks-automation"
order: 150
---

# Qué hacer cuando los Hooks no funcionan

## El problema que enfrentas

¿Configuraste Hooks pero descubres que no funcionan como esperabas? Podrías encontrarte con las siguientes situaciones:

- El servidor de desarrollo no se bloquea cuando se ejecuta fuera de tmux
- No ves logs de SessionStart o SessionEnd
- El formateo automático con Prettier no funciona
- La verificación de TypeScript no se ejecuta
- Ves mensajes de error extraños

No te preocupes, estos problemas generalmente tienen soluciones claras. Esta lección te ayuda a diagnosticar y solucionar sistemáticamente problemas relacionados con Hooks.

## 🎒 Preparativos previos

::: warning Verificación previa
Asegúrate de haber:
1. ✅ Completado la [instalación](../../start/installation/) de Everything Claude Code
2. ✅ Comprendido los conceptos básicos de [Automatización con Hooks](../../advanced/hooks-automation/)
3. ✅ Leído las instrucciones de configuración de Hooks en el README del proyecto
:::

---

## Problema común 1: Los Hooks no se activan en absoluto

### Síntomas
Después de ejecutar comandos, no ves ninguna salida de log `[Hook]`, los Hooks parecen no ser invocados en absoluto.

### Posibles causas

#### Causa A: Ruta incorrecta de hooks.json

**Problema**: `hooks.json` no está en la ubicación correcta, Claude Code no puede encontrar el archivo de configuración.

**Solución**:

Verifica que la ubicación de `hooks.json` sea correcta:

```bash
# Debe estar en una de las siguientes ubicaciones:
~/.claude/hooks/hooks.json              # Configuración a nivel de usuario (global)
.claude/hooks/hooks.json                 # Configuración a nivel de proyecto
```

**Método de verificación**:

```bash
# Ver configuración a nivel de usuario
ls -la ~/.claude/hooks/hooks.json

# Ver configuración a nivel de proyecto
ls -la .claude/hooks/hooks.json
```

**Si el archivo no existe**, cópialo desde el directorio del plugin Everything Claude Code:

```bash
# Asumiendo que el plugin está instalado en ~/.claude-plugins/
cp ~/.claude-plugins/everything-claude-code/hooks/hooks.json ~/.claude/hooks/
```

#### Causa B: Error de sintaxis JSON

**Problema**: `hooks.json` tiene errores de sintaxis, lo que impide que Claude Code lo analice.

**Solución**:

Valida el formato JSON:

```bash
# Usar jq o Python para validar la sintaxis JSON
jq empty ~/.claude/hooks/hooks.json
# o
python3 -m json.tool ~/.claude/hooks/hooks.json > /dev/null
```

**Errores de sintaxis comunes**:
- Falta de comas
- Comillas sin cerrar
- Uso de comillas simples (deben ser comillas dobles)
- Formato de comentarios incorrecto (JSON no soporta comentarios `//`)

#### Causa C: Variable de entorno CLAUDE_PLUGIN_ROOT no configurada

**Problema**: Los scripts de Hook usan `${CLAUDE_PLUGIN_ROOT}` para referenciar rutas, pero la variable de entorno no está configurada.

**Solución**:

Verifica que la ruta de instalación del plugin sea correcta:

```bash
# Ver rutas de plugins instalados
ls -la ~/.claude-plugins/
```

Asegúrate de que el plugin Everything Claude Code esté correctamente instalado:

```bash
# Deberías ver un directorio similar a este
~/.claude-plugins/everything-claude-code/
├── scripts/
├── hooks/
├── agents/
└── ...
```

**Si se instaló desde el marketplace de plugins**, la variable de entorno se configurará automáticamente después de reiniciar Claude Code.

**Si se instaló manualmente**, verifica la ruta del plugin en `~/.claude/settings.json`:

```json
{
  "plugins": [
    {
      "name": "everything-claude-code",
      "path": "/path/to/everything-claude-code"
    }
  ]
}
```

---

## Problema común 2: Un Hook específico no se activa

### Síntomas
Algunos Hooks funcionan (como SessionStart), pero otros no se activan (como el formateo en PreToolUse).

### Posibles causas

#### Causa A: Expresión matcher incorrecta

**Problema**: La expresión `matcher` del Hook es incorrecta, lo que hace que la condición de coincidencia no se cumpla.

**Solución**:

Verifica la sintaxis del matcher en `hooks.json`:

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\""
}
```

**Puntos a tener en cuenta**:
- Los nombres de herramientas deben estar entre comillas dobles: `"Edit"`, `"Bash"`
- Las barras invertidas en expresiones regulares necesitan doble escape: `\\\\.` en lugar de `\\.`
- La coincidencia de rutas de archivo usa la palabra clave `matches`

**Probar el Matcher**:

Puedes probar manualmente la lógica de coincidencia:

```bash
# Probar coincidencia de ruta de archivo
node -e "console.log(/\\\\.(ts|tsx)$/.test('src/index.ts'))"
# Debería mostrar: true
```

#### Causa B: Fallo en la ejecución del comando

**Problema**: El comando del Hook en sí falla al ejecutarse, pero no hay mensajes de error.

**Solución**:

Ejecuta manualmente el comando del Hook para probarlo:

```bash
# Ir al directorio del plugin
cd ~/.claude-plugins/everything-claude-code

# Ejecutar manualmente un script de Hook
node scripts/hooks/session-start.js

# Verificar si hay salida de error
```

**Causas comunes de fallo**:
- Versión de Node.js incompatible (requiere Node.js 14+)
- Dependencias faltantes (como prettier, typescript no instalados)
- Problemas de permisos del script (ver más abajo)

---

## Problema común 3: Problemas de permisos (Linux/macOS)

### Síntomas
Ves un error similar a este:

```
Permission denied: node scripts/hooks/session-start.js
```

### Solución

Agrega permisos de ejecución a los scripts de Hook:

```bash
# Ir al directorio del plugin
cd ~/.claude-plugins/everything-claude-code

# Agregar permisos de ejecución a todos los scripts de hooks
chmod +x scripts/hooks/*.js

# Verificar permisos
ls -la scripts/hooks/
# Deberías ver algo como: -rwxr-xr-x  session-start.js
```

**Corregir todos los scripts en lote**:

```bash
# Corregir todos los archivos .js bajo scripts
find ~/.claude-plugins/everything-claude-code/scripts -name "*.js" -exec chmod +x {} \;
```

---

## Problema común 4: Problemas de compatibilidad multiplataforma

### Síntomas
Funciona normalmente en Windows, pero falla en macOS/Linux; o viceversa.

### Posibles causas

#### Causa A: Separadores de ruta

**Problema**: Windows usa barra invertida `\`, Unix usa barra diagonal `/`.

**Solución**:

Los scripts de Everything Claude Code ya manejan la compatibilidad multiplataforma (usando el módulo `path` de Node.js), pero si personalizaste un Hook, debes tener en cuenta:

**Forma incorrecta**:
```json
{
  "command": "node scripts/hooks\\session-start.js"  // Estilo Windows
}
```

**Forma correcta**:
```json
{
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""  // Usar variable de entorno y barra diagonal
}
```

#### Causa B: Diferencias en comandos de shell

**Problema**: Diferentes plataformas tienen sintaxis de comandos diferentes (como `which` vs `where`).

**Solución**:

El archivo `scripts/lib/utils.js` de Everything Claude Code ya maneja estas diferencias. Al personalizar Hooks, consulta las funciones multiplataforma en ese archivo:

```javascript
// Detección de comandos multiplataforma en utils.js
function commandExists(cmd) {
  if (isWindows) {
    spawnSync('where', [cmd], { stdio: 'pipe' });
  } else {
    spawnSync('which', [cmd], { stdio: 'pipe' });
  }
}
```

---

## Problema común 5: El formateo automático no funciona

### Síntomas
Después de editar archivos TypeScript, Prettier no formatea automáticamente el código.

### Posibles causas

#### Causa A: Prettier no instalado

**Problema**: El Hook PostToolUse llama a `npx prettier`, pero no está instalado en el proyecto.

**Solución**:

```bash
# Instalar Prettier (a nivel de proyecto)
npm install --save-dev prettier
# o
pnpm add -D prettier

# O instalar globalmente
npm install -g prettier
```

#### Causa B: Configuración de Prettier faltante

**Problema**: Prettier no puede encontrar el archivo de configuración, usa reglas de formateo predeterminadas.

**Solución**:

Crea un archivo de configuración de Prettier:

```bash
# Crear .prettierrc en el directorio raíz del proyecto
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
EOF
```

#### Causa C: Tipo de archivo no coincide

**Problema**: La extensión del archivo editado no está en las reglas de coincidencia del Hook.

**Reglas de coincidencia actuales** (`hooks.json` L92-97):

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**Si necesitas soportar otros tipos de archivo** (como `.vue`), modifica la configuración:

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx|vue)$\""
}
```

---

## Problema común 6: La verificación de TypeScript no funciona

### Síntomas
Después de editar archivos `.ts`, no ves salida de errores de verificación de tipos.

### Posibles causas

#### Causa A: tsconfig.json faltante

**Problema**: El script del Hook busca hacia arriba el archivo `tsconfig.json`, pero no lo encuentra.

**Solución**:

Asegúrate de que el directorio raíz del proyecto o el directorio padre tenga `tsconfig.json`:

```bash
# Buscar tsconfig.json
find . -name "tsconfig.json" -type f

# Si no existe, crear configuración básica
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
EOF
```

#### Causa B: TypeScript no instalado

**Problema**: El Hook llama a `npx tsc`, pero TypeScript no está instalado.

**Solución**:

```bash
npm install --save-dev typescript
# o
pnpm add -D typescript
```

---

## Problema común 7: SessionStart/SessionEnd no se activan

### Síntomas
Al iniciar o finalizar una sesión, no ves logs de `[SessionStart]` o `[SessionEnd]`.

### Posibles causas

#### Causa A: Directorio de archivos de sesión no existe

**Problema**: El directorio `~/.claude/sessions/` no existe, el script del Hook no puede crear archivos de sesión.

**Solución**:

Crea el directorio manualmente:

```bash
# macOS/Linux
mkdir -p ~/.claude/sessions

# Windows PowerShell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.claude\sessions"
```

#### Causa B: Ruta del script incorrecta

**Problema**: La ruta del script referenciada en `hooks.json` es incorrecta.

**Método de verificación**:

```bash
# Verificar que el script existe
ls -la ~/.claude-plugins/everything-claude-code/scripts/hooks/session-start.js
ls -la ~/.claude-plugins/everything-claude-code/scripts/hooks/session-end.js
```

**Si no existe**, verifica que el plugin esté completamente instalado:

```bash
# Ver estructura del directorio del plugin
ls -la ~/.claude-plugins/everything-claude-code/
```

---

## Problema común 8: El bloqueo del servidor de desarrollo no funciona

### Síntomas
Ejecutar `npm run dev` directamente no se bloquea, puedes iniciar el servidor de desarrollo.

### Posibles causas

#### Causa A: La expresión regular no coincide

**Problema**: Tu comando de servidor de desarrollo no está en las reglas de coincidencia del Hook.

**Reglas de coincidencia actuales** (`hooks.json` L6):

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\""
}
```

**Probar coincidencia**:

```bash
# Probar si tu comando coincide
node -e "console.log(/(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)/.test('npm run dev'))"
```

**Si necesitas soportar otros comandos** (como `npm start`), modifica `hooks.json`:

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm (run dev|start)|pnpm( run)? (dev|start)|yarn (dev|start)|bun run (dev|start))\""
}
```

#### Causa B: No se ejecuta en tmux pero no se bloquea

**Problema**: El Hook debería bloquear el servidor de desarrollo cuando se ejecuta fuera de tmux, pero no funciona.

**Puntos de verificación**:

1. Confirma que el comando del Hook se ejecuta correctamente:
```bash
# Simular comando del Hook
node -e "console.error('[Hook] BLOCKED: Dev server must run in tmux');process.exit(1)"
# Deberías ver salida de error y código de salida 1
```

2. Verifica que `process.exit(1)` bloquee correctamente la ejecución de comandos posteriores:
- El `process.exit(1)` en el comando del Hook debería bloquear la ejecución de comandos posteriores

3. Si aún no funciona, es posible que necesites actualizar la versión de Claude Code (el soporte de Hooks puede requerir la última versión)

---

## Herramientas y técnicas de diagnóstico

### Habilitar logs detallados

Ver los logs detallados de Claude Code para entender la ejecución de Hooks:

```bash
# macOS/Linux
tail -f ~/Library/Logs/claude-code/claude-code.log

# Windows
Get-Content "$env:APPDATA\claude-code\logs\claude-code.log" -Wait -Tail 50
```

### Probar Hook manualmente

Ejecuta manualmente scripts de Hook en la terminal para verificar su funcionalidad:

```bash
# Probar SessionStart
cd ~/.claude-plugins/everything-claude-code
node scripts/hooks/session-start.js

# Probar Suggest Compact
node scripts/hooks/suggest-compact.js

# Probar PreCompact
node scripts/hooks/pre-compact.js
```

### Verificar variables de entorno

Ver las variables de entorno de Claude Code:

```bash
# Agregar salida de depuración en el script del Hook
node -e "console.log('CLAUDE_PLUGIN_ROOT:', process.env.CLAUDE_PLUGIN_ROOT); console.log('COMPACT_THRESHOLD:', process.env.COMPACT_THRESHOLD)"
```

---

## Lista de verificación ✅

Verifica uno por uno según la siguiente lista:

- [ ] `hooks.json` está en la ubicación correcta (`~/.claude/hooks/` o `.claude/hooks/`)
- [ ] Formato JSON de `hooks.json` es correcto (validado con `jq`)
- [ ] Ruta del plugin es correcta (`${CLAUDE_PLUGIN_ROOT}` está configurado)
- [ ] Todos los scripts tienen permisos de ejecución (Linux/macOS)
- [ ] Herramientas de dependencia están instaladas (Node.js, Prettier, TypeScript)
- [ ] Directorio de sesiones existe (`~/.claude/sessions/`)
- [ ] Expresión Matcher es correcta (escape de regex, comillas)
- [ ] Compatibilidad multiplataforma (usar módulo `path`, variables de entorno)

---

## Cuándo necesitas ayuda

Si ninguno de los métodos anteriores resuelve el problema:

1. **Recopilar información de diagnóstico**:
   ```bash
   # Mostrar la siguiente información
   echo "Node version: $(node -v)"
   echo "Claude Code version: $(claude-code --version)"
   echo "Plugin path: $(ls -la ~/.claude-plugins/everything-claude-code)"
   echo "Hooks config: $(cat ~/.claude/hooks/hooks.json | jq -c .)"
   ```

2. **Ver GitHub Issues**:
   - Visita [Everything Claude Code Issues](https://github.com/affaan-m/everything-claude-code/issues)
   - Busca problemas similares

3. **Enviar un Issue**:
   - Incluye logs de error completos
   - Proporciona información del sistema operativo y versión
   - Adjunta el contenido de `hooks.json` (oculta información sensible)

---

## Resumen de la lección

Los Hooks que no funcionan generalmente tienen las siguientes categorías de causas:

| Tipo de problema | Causa común | Diagnóstico rápido |
| --- | --- | --- |
| **No se activa en absoluto** | Ruta incorrecta de hooks.json, error de sintaxis JSON | Verificar ubicación del archivo, validar formato JSON |
| **Hook específico no se activa** | Expresión Matcher incorrecta, fallo en ejecución del comando | Verificar sintaxis de regex, ejecutar script manualmente |
| **Problemas de permisos** | Scripts sin permisos de ejecución (Linux/macOS) | `chmod +x scripts/hooks/*.js` |
| **Compatibilidad multiplataforma** | Separadores de ruta, diferencias en comandos de shell | Usar módulo `path`, consultar utils.js |
| **Funcionalidad no funciona** | Herramientas de dependencia no instaladas (Prettier, TypeScript) | Instalar herramientas correspondientes, verificar archivos de configuración |

Recuerda: La mayoría de los problemas se pueden resolver verificando rutas de archivos, validando formato JSON y confirmando la instalación de dependencias.

---

## Próxima lección

> En la próxima lección aprenderemos **[Solución de fallos de conexión MCP](../troubleshooting-mcp/)**.
>
> Aprenderás:
> - Errores comunes en la configuración del servidor MCP
> - Cómo depurar problemas de conexión MCP
> - Configuración de variables de entorno y marcadores de posición MCP

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-25

| Funcionalidad | Ruta del archivo | Línea |
| --- | --- | --- |
| Configuración principal de Hooks | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| SessionStart Hook | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| SessionEnd Hook | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| PreCompact Hook | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Suggest Compact Hook | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Funciones de utilidad multiplataforma | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |

**Funciones clave**:
- `getHomeDir()` / `getClaudeDir()` / `getSessionsDir()`: Obtener rutas de directorios de configuración (utils.js 19-34)
- `ensureDir(dirPath)`: Asegurar que el directorio existe, crearlo si no existe (utils.js 54-59)
- `log(message)`: Mostrar logs en stderr (visible en Claude Code) (utils.js 182-184)
- `findFiles(dir, pattern, options)`: Búsqueda de archivos multiplataforma (utils.js 102-149)
- `commandExists(cmd)`: Verificar si el comando existe (compatible multiplataforma) (utils.js 228-246)

**Expresiones regulares clave**:
- Bloqueo de servidor de desarrollo: `npm run dev|pnpm( run)? dev|yarn dev|bun run dev` (hooks.json 6)
- Coincidencia de edición de archivos: `\\.(ts|tsx|js|jsx)$` (hooks.json 92)
- Archivos TypeScript: `\\.(ts|tsx)$` (hooks.json 102)

**Variables de entorno**:
- `${CLAUDE_PLUGIN_ROOT}`: Ruta del directorio raíz del plugin
- `CLAUD_SESSION_ID`: Identificador de sesión
- `COMPACT_THRESHOLD`: Umbral de sugerencia de compactación (predeterminado 50)

</details>
