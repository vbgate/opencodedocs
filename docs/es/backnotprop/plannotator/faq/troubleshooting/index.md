---
title: "Solución de Problemas: Diagnóstico de Errores Comunes | Plannotator"
sidebarTitle: "Diagnóstico Rápido"
subtitle: "Solución de Problemas: Diagnóstico de Errores Comunes"
description: "Aprende métodos de solución de problemas de Plannotator, incluyendo visualización de logs, conflictos de puertos, depuración de Hook events, problemas del navegador, estado del repositorio Git y manejo de errores de integración."
tags:
  - "solución de problemas"
  - "depuración"
  - "errores comunes"
  - "visualización de logs"
prerequisite:
  - "start-getting-started"
order: 2
---

# Solución de Problemas de Plannotator

## Lo que aprenderás

Cuando encuentres problemas, podrás:

- Localizar rápidamente la fuente del problema (puerto ocupado, análisis de Hook event, configuración de Git, etc.)
- Diagnosticar errores mediante la salida de logs
- Aplicar la solución correcta según el tipo de error
- Depurar problemas de conexión en modo remoto/Devcontainer

## Tu situación actual

Plannotator dejó de funcionar repentinamente, el navegador no se abre, o el Hook muestra mensajes de error. No sabes cómo ver los logs ni estás seguro de qué parte falló. Puede que hayas intentado reiniciar, pero el problema persiste.

## Cuándo usar esta técnica

Necesitas solucionar problemas en las siguientes situaciones:

- El navegador no se abre automáticamente
- El Hook muestra mensajes de error
- El puerto ocupado impide el inicio
- La página de plan o revisión de código muestra anomalías
- La integración con Obsidian/Bear falla
- Git diff muestra vacío

---

## Concepto central

Los problemas de Plannotator generalmente se dividen en tres categorías:

1. **Problemas de entorno**: Puerto ocupado, configuración incorrecta de variables de entorno, ruta del navegador incorrecta
2. **Problemas de datos**: Fallo en el análisis de Hook event, contenido del plan vacío, estado anormal del repositorio Git
3. **Problemas de integración**: Fallo al guardar en Obsidian/Bear, problemas de conexión en modo remoto

El núcleo de la depuración es **revisar la salida de logs**. Plannotator usa `console.error` para enviar errores a stderr, y `console.log` para información normal a stdout. Distinguir entre ambos te ayuda a identificar rápidamente el tipo de problema.

---

## 🎒 Preparación previa

- ✅ Plannotator instalado (plugin de Claude Code u OpenCode)
- ✅ Conocimiento básico de operaciones de línea de comandos
- ✅ Familiaridad con el directorio de tu proyecto y el estado del repositorio Git

---

## Paso a paso

### Paso 1: Revisar la salida de logs

**Por qué**

Todos los errores de Plannotator se envían a stderr. Revisar los logs es el primer paso para diagnosticar problemas.

**Cómo hacerlo**

#### En Claude Code

Cuando el Hook activa Plannotator, los mensajes de error se muestran en la salida del terminal de Claude Code:

```bash
# Ejemplo de error que podrías ver
Error: Port 54321 in use after 5 retries (set PLANNOTATOR_PORT to use different port)
```

#### En OpenCode

OpenCode captura el stderr del CLI y lo muestra en la interfaz:

```
[stderr] Failed to parse hook event from stdin
[stderr] No plan content in hook event
```

**Deberías ver**:

- Si no hay errores, stderr debería estar vacío o solo contener mensajes informativos esperados
- Si hay errores, incluirá el tipo de error (como EADDRINUSE), mensaje de error e información de stack (si está disponible)

---

### Paso 2: Resolver problemas de puerto ocupado

**Por qué**

Plannotator inicia el servidor en un puerto aleatorio por defecto. Si un puerto fijo está ocupado, el servidor intentará reintentar 5 veces (con un retraso de 500ms cada vez), y fallará después.

**Mensaje de error**:

```
Error: Port 54321 in use after 5 retries (set PLANNOTATOR_PORT to use different port)
```

**Solución**

#### Opción A: Dejar que Plannotator seleccione el puerto automáticamente (recomendado)

No configures la variable de entorno `PLANNOTATOR_PORT`, Plannotator seleccionará automáticamente un puerto disponible.

#### Opción B: Usar un puerto fijo y resolver la ocupación

Si debes usar un puerto fijo (como en modo remoto), necesitas resolver la ocupación del puerto:

```bash
# macOS/Linux
lsof -ti:54321 | xargs kill -9

# Windows PowerShell
Get-NetTCPConnection -LocalPort 54321 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

Luego reconfigura el puerto:

```bash
# macOS/Linux/WSL
export PLANNOTATOR_PORT=54322

# Windows PowerShell
$env:PLANNOTATOR_PORT = "54322"
```

**Punto de verificación ✅**:

- Activa Plannotator nuevamente, el navegador debería abrirse normalmente
- Si sigue fallando, intenta cambiar a otro número de puerto

---

### Paso 3: Depurar fallo en el análisis de Hook event

**Por qué**

El Hook event son datos JSON leídos desde stdin. Si el análisis falla, Plannotator no puede continuar.

**Mensaje de error**:

```
Failed to parse hook event from stdin
No plan content in hook event
```

**Posibles causas**:

1. El Hook event no es JSON válido
2. El Hook event carece del campo `tool_input.plan`
3. Versión del Hook incompatible

**Método de depuración**

#### Ver el contenido del Hook event

Antes de iniciar el servidor Hook, imprime el contenido de stdin:

```bash
# Modifica temporalmente hook/server/index.ts
# Añade después de la línea 91:
console.error("[DEBUG] Hook event:", eventJson);
```

**Deberías ver**:

```json
{
  "tool_input": {
    "plan": "# Implementation Plan\n\n## Task 1\n..."
  },
  "permission_mode": "default"
}
```

**Solución**:

- Si `tool_input.plan` está vacío o falta, verifica si el AI Agent generó correctamente el plan
- Si el formato JSON es incorrecto, verifica si la configuración del Hook es correcta
- Si la versión del Hook es incompatible, actualiza Plannotator a la última versión

---

### Paso 4: Resolver problema de navegador que no se abre

**Por qué**

Plannotator usa la función `openBrowser` para abrir automáticamente el navegador. Si falla, puede ser un problema de compatibilidad multiplataforma o una ruta de navegador incorrecta.

**Posibles causas**:

1. El navegador predeterminado del sistema no está configurado
2. La ruta del navegador personalizado es inválida
3. Problema de manejo especial en entorno WSL
4. En modo remoto no se abre automáticamente el navegador (esto es normal)

**Método de depuración**

#### Verificar si estás en modo remoto

```bash
# Ver variable de entorno
echo $PLANNOTATOR_REMOTE

# Windows PowerShell
echo $env:PLANNOTATOR_REMOTE
```

Si la salida es `1` o `true`, significa que estás en modo remoto, el navegador no se abrirá automáticamente, esto es el comportamiento esperado.

#### Probar apertura manual del navegador

```bash
# macOS
open "http://localhost:54321"

# Linux
xdg-open "http://localhost:54321"

# Windows
start http://localhost:54321
```

**Deberías ver**:

- Si la apertura manual funciona, significa que el servidor de Plannotator está funcionando normalmente, el problema está en la lógica de apertura automática
- Si la apertura manual falla, verifica si la URL es correcta (el puerto puede ser diferente)

**Solución**:

#### Opción A: Configurar navegador personalizado (macOS)

```bash
export PLANNOTATOR_BROWSER="Google Chrome"

# O usar ruta completa
export PLANNOTATOR_BROWSER="/Applications/Google Chrome.app"
```

#### Opción B: Configurar navegador personalizado (Linux)

```bash
export PLANNOTATOR_BROWSER="/usr/bin/firefox"
```

#### Opción C: Apertura manual en modo remoto (Devcontainer/SSH)

```bash
# Plannotator mostrará información de URL y puerto
# Copia la URL, ábrela en el navegador local
# O usa reenvío de puertos:
ssh -L 19432:localhost:19432 user@remote
```

---

### Paso 5: Verificar estado del repositorio Git (revisión de código)

**Por qué**

La función de revisión de código depende de comandos Git. Si el estado del repositorio Git es anormal (como sin commits, Detached HEAD), causará que el diff se muestre vacío o con error.

**Mensaje de error**:

```
Git diff error for uncommitted: Error: Command failed: git diff HEAD
```

**Método de depuración**

#### Verificar repositorio Git

```bash
# Verificar si estás en un repositorio Git
git status

# Verificar rama actual
git branch

# Verificar si hay commits
git log --oneline -1
```

**Deberías ver**:

- Si muestra `fatal: not a git repository`, significa que el directorio actual no es un repositorio Git
- Si muestra `HEAD detached at <commit>`, significa que estás en estado Detached HEAD
- Si muestra `fatal: your current branch 'main' has no commits yet`, significa que aún no hay commits

**Solución**:

#### Problema A: No estás en un repositorio Git

```bash
# Inicializar repositorio Git
git init
git add .
git commit -m "Initial commit"
```

#### Problema B: Estado Detached HEAD

```bash
# Cambiar a una rama
git checkout main
# O crear nueva rama
git checkout -b feature-branch
```

#### Problema C: Sin commits

```bash
# Se necesita al menos un commit para ver el diff
git add .
git commit -m "Initial commit"
```

#### Problema D: Diff vacío (sin cambios)

```bash
# Crear algunos cambios
echo "test" >> test.txt
git add test.txt

# Ejecutar /plannotator-review nuevamente
```

**Punto de verificación ✅**:

- Ejecuta `/plannotator-review` nuevamente, el diff debería mostrarse normalmente
- Si sigue vacío, verifica si hay cambios sin preparar o sin confirmar

---

### Paso 6: Depurar fallo en integración con Obsidian/Bear

**Por qué**

El fallo en la integración con Obsidian/Bear no bloqueará la aprobación del plan, pero causará que el guardado falle. Los errores se envían a stderr.

**Mensaje de error**:

```
[Obsidian] Save failed: Vault not found
[Bear] Save failed: Failed to open Bear
```

**Método de depuración**

#### Verificar configuración de Obsidian

**macOS**:
```bash
cat ~/Library/Application\ Support/obsidian/obsidian.json
```

**Windows**:
```powershell
cat $env:APPDATA\obsidian\obsidian.json
```

**Deberías ver**:

```json
{
  "vaults": {
    "/path/to/vault": {
      "path": "/path/to/vault",
      "ts": 1234567890
    }
  }
}
```

#### Verificar disponibilidad de Bear (macOS)

```bash
# Probar URL scheme de Bear
open "bear://x-callback-url/create?title=Test&text=Hello"
```

**Deberías ver**:

- La aplicación Bear se abre y crea una nueva nota
- Si no pasa nada, significa que Bear no está instalado correctamente

**Solución**:

#### Fallo al guardar en Obsidian

- Asegúrate de que Obsidian esté en ejecución
- Verifica que la ruta del vault sea correcta
- Intenta crear manualmente una nota en Obsidian para verificar permisos

#### Fallo al guardar en Bear

- Asegúrate de que Bear esté instalado correctamente
- Prueba si `bear://x-callback-url` está disponible
- Verifica si x-callback-url está habilitado en la configuración de Bear

---

### Paso 7: Ver logs de error detallados (modo de depuración)

**Por qué**

A veces los mensajes de error no son lo suficientemente detallados, necesitas ver el stack trace completo y el contexto.

**Cómo hacerlo**

#### Habilitar modo de depuración de Bun

```bash
export DEBUG="*"
plannotator review

# Windows PowerShell
$env:DEBUG = "*"
plannotator review
```

#### Ver logs del servidor de Plannotator

Los errores internos del servidor se envían mediante `console.error`. Ubicaciones clave de logs:

- `packages/server/index.ts:260` - Logs de errores de integración
- `packages/server/git.ts:141` - Logs de errores de Git diff
- `apps/hook/server/index.ts:100-106` - Errores de análisis de Hook event

**Deberías ver**:

```bash
# Guardado exitoso en Obsidian
[Obsidian] Saved plan to: /path/to/vault/Plan - 2026-01-24.md

# Fallo al guardar
[Obsidian] Save failed: Cannot write to directory
[Bear] Save failed: Failed to open Bear

# Error de Git diff
Git diff error for uncommitted: Error: Command failed: git diff HEAD
```

**Punto de verificación ✅**:

- Los logs de error contienen suficiente información para localizar el problema
- Aplica la solución correspondiente según el tipo de error

---

## Advertencias sobre problemas comunes

### ❌ Ignorar salida de stderr

**Forma incorrecta**:

```bash
# Solo prestar atención a stdout, ignorar stderr
plannotator review 2>/dev/null
```

**Forma correcta**:

```bash
# Ver stdout y stderr al mismo tiempo
plannotator review
# O separar logs
plannotator review 2>error.log
```

### ❌ Reiniciar el servidor ciegamente

**Forma incorrecta**:

- Reiniciar cuando encuentres problemas, sin ver la causa del error

**Forma correcta**:

- Primero ver los logs de error, determinar el tipo de problema
- Aplicar la solución correspondiente según el tipo de error
- Reiniciar es solo el último recurso

### ❌ Esperar que el navegador se abra automáticamente en modo remoto

**Forma incorrecta**:

```bash
export PLANNOTATOR_REMOTE=1
plannotator review
# Esperar que el navegador se abra automáticamente (no sucederá)
```

**Forma correcta**:

```bash
export PLANNOTATOR_REMOTE=1
plannotator review
# Anotar la URL de salida, abrirla manualmente en el navegador
# O usar reenvío de puertos
```

---

## Resumen de la lección

- Plannotator usa `console.error` para enviar errores a stderr, `console.log` para información normal a stdout
- Los problemas comunes incluyen: puerto ocupado, fallo en análisis de Hook event, navegador que no se abre, estado anormal del repositorio Git, fallo en integración
- El núcleo de la depuración es: ver logs → localizar tipo de problema → aplicar solución correspondiente
- En modo remoto no se abre automáticamente el navegador, necesitas abrir manualmente la URL o configurar reenvío de puertos

---

## Próxima lección

> En la próxima lección aprenderemos sobre **[Problemas Comunes](../common-problems/)**.
>
> Aprenderás:
> - Cómo resolver problemas de instalación y configuración
> - Errores comunes de uso y precauciones
> - Sugerencias de optimización de rendimiento

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para ver las ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-24

| Función | Ruta del archivo | Líneas |
|---|---|---|
| Mecanismo de reintento de puerto | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L79-L80) | 79-80 |
| Manejo de error EADDRINUSE | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L320-L334) | 320-334 |
| Análisis de Hook event | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L91-L107) | 91-107 |
| Apertura de navegador | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts#L45-L74) | 45-74 |
| Manejo de errores de Git diff | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L139-L144) | 139-144 |
| Logs de guardado en Obsidian | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L242-L246) | 242-246 |
| Logs de guardado en Bear | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L252-L256) | 252-256 |

**Constantes clave**:
- `MAX_RETRIES = 5`: Número máximo de reintentos de puerto
- `RETRY_DELAY_MS = 500`: Retraso de reintento de puerto (milisegundos)

**Funciones clave**:
- `startPlannotatorServer()`: Inicia el servidor de revisión de plan
- `startReviewServer()`: Inicia el servidor de revisión de código
- `openBrowser()`: Apertura de navegador multiplataforma
- `runGitDiff()`: Ejecuta comando Git diff
- `saveToObsidian()`: Guarda plan en Obsidian
- `saveToBear()`: Guarda plan en Bear

</details>
