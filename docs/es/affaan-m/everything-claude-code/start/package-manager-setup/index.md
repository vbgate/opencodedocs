---
title: "Configuración del gestor de paquetes: detección automática | Everything Claude Code"
sidebarTitle: "Comandos unificados de proyecto"
subtitle: "Configuración del gestor de paquetes: detección automática | Everything Claude Code"
description: "Aprende a configurar la detección automática del gestor de paquetes. Domina el mecanismo de 6 niveles de prioridad, compatible con npm/pnpm/yarn/bun, para unificar comandos en múltiples proyectos."
tags:
  - "package-manager"
  - "configuration"
  - "npm"
  - "pnpm"
prerequisite:
  - "start-installation"
order: 30
---

# Configuración del gestor de paquetes: detección automática y personalización

## Lo que aprenderás

- ✅ Detectar automáticamente el gestor de paquetes del proyecto actual (npm/pnpm/yarn/bun)
- ✅ Comprender el mecanismo de prioridad de 6 niveles de detección
- ✅ Configurar el gestor de paquetes a nivel global y de proyecto
- ✅ Usar el comando `/setup-pm` para configuración rápida
- ✅ Manejar escenarios con diferentes gestores de paquetes en entornos multi-proyecto

## Tu situación actual

Tienes cada vez más proyectos: algunos usan npm, otros pnpm, y otros yarn o bun. Cada vez que escribes un comando en Claude Code, tienes que recordar:

- ¿Este proyecto usa `npm install` o `pnpm install`?
- ¿Debo usar `npx`, `pnpm dlx` o `bunx`?
- ¿Los scripts se ejecutan con `npm run dev`, `pnpm dev` o `bun run dev`?

Un error y el comando falla, perdiendo tiempo valioso.

## Cuándo usar esta técnica

- **Al iniciar un nuevo proyecto**: Configura inmediatamente después de decidir qué gestor de paquetes usar
- **Al cambiar de proyecto**: Verifica que la detección sea correcta
- **En trabajo en equipo**: Asegura que todos los miembros usen el mismo estilo de comandos
- **En entornos multi-gestor**: Configuración global + sobrescritura por proyecto para gestión flexible

::: tip ¿Por qué necesitas configurar el gestor de paquetes?
Los hooks y agents de Everything Claude Code generan automáticamente comandos relacionados con el gestor de paquetes. Si la detección es incorrecta, todos los comandos usarán la herramienta equivocada, causando fallos en las operaciones.
:::

## 🎒 Preparativos previos

::: warning Prerrequisitos
Antes de comenzar esta lección, asegúrate de haber completado la [Guía de instalación](../installation/). El plugin debe estar correctamente instalado en Claude Code.
:::

Verifica que tu sistema tenga gestores de paquetes instalados:

```bash
# Verificar gestores de paquetes instalados
which npm pnpm yarn bun

# O en Windows (PowerShell)
Get-Command npm, pnpm, yarn, bun -ErrorAction SilentlyContinue
```

Si ves una salida similar, están instalados:

```
/usr/local/bin/npm
/usr/local/bin/pnpm
```

Si algún gestor de paquetes no se encuentra, necesitas instalarlo primero (esta lección no cubre la instalación).

## Concepto clave

Everything Claude Code utiliza un **mecanismo de detección inteligente** que selecciona automáticamente el gestor de paquetes según 6 niveles de prioridad. Solo necesitas configurarlo una vez en el lugar más apropiado, y funcionará correctamente en todos los escenarios.

### Prioridad de detección (de mayor a menor)

```
1. Variable de entorno CLAUDE_PACKAGE_MANAGER  ─── Máxima prioridad, sobrescritura temporal
2. Configuración de proyecto .claude/package-manager.json  ─── Sobrescritura a nivel de proyecto
3. Campo packageManager en package.json  ─── Especificación del proyecto
4. Archivos Lock (pnpm-lock.yaml, etc.)  ─── Detección automática
5. Configuración global ~/.claude/package-manager.json  ─── Valor predeterminado global
6. Fallback: busca el primero disponible en orden  ─── Solución de respaldo
```

### ¿Por qué este orden?

- **Variable de entorno primero**: Facilita cambios temporales (como en entornos CI/CD)
- **Configuración de proyecto segundo**: Fuerza uniformidad en el mismo proyecto
- **Campo package.json**: Es la especificación estándar de Node.js
- **Archivos Lock**: Archivos que el proyecto realmente usa
- **Configuración global**: Preferencia personal predeterminada
- **Fallback**: Garantiza que siempre haya una herramienta disponible

## Instrucciones paso a paso

### Paso 1: Verificar la configuración actual

**Por qué**
Primero comprende la situación actual de detección para confirmar si necesitas configuración manual.

```bash
# Detectar el gestor de paquetes actual
node scripts/setup-package-manager.js --detect
```

**Deberías ver**:

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
  ✓ npm
  ✓ pnpm (current)
  ✗ yarn
  ✓ bun

Commands:
  Install: pnpm install
  Run script: pnpm [script-name]
  Execute binary: pnpm dlx [binary-name]
```

Si el gestor de paquetes mostrado coincide con lo esperado, la detección es correcta y no necesitas configuración manual.

### Paso 2: Configurar el gestor de paquetes predeterminado global

**Por qué**
Establece un valor predeterminado global para todos tus proyectos, reduciendo configuraciones repetitivas.

```bash
# Establecer pnpm como predeterminado global
node scripts/setup-package-manager.js --global pnpm
```

**Deberías ver**:

```
✓ Global preference set to: pnpm
  Saved to: ~/.claude/package-manager.json
```

Verifica el archivo de configuración generado:

```bash
cat ~/.claude/package-manager.json
```

**Deberías ver**:

```json
{
  "packageManager": "pnpm",
  "setAt": "2026-01-25T12:00:00.000Z"
}
```

### Paso 3: Configurar el gestor de paquetes a nivel de proyecto

**Por qué**
Algunos proyectos pueden requerir un gestor de paquetes específico (por ejemplo, por dependencia de funcionalidades específicas). La configuración a nivel de proyecto sobrescribe la configuración global.

```bash
# Establecer bun para el proyecto actual
node scripts/setup-package-manager.js --project bun
```

**Deberías ver**:

```
✓ Project preference set to: bun
  Saved to: .claude/package-manager.json
```

Verifica el archivo de configuración generado:

```bash
cat .claude/package-manager.json
```

**Deberías ver**:

```json
{
  "packageManager": "bun",
  "setAt": "2026-01-25T12:00:00.000Z"
}
```

::: tip Configuración de proyecto vs global
- **Configuración global**: ~/.claude/package-manager.json, afecta a todos los proyectos
- **Configuración de proyecto**: .claude/package-manager.json, solo afecta al proyecto actual, tiene mayor prioridad
:::

### Paso 4: Usar el comando /setup-pm (opcional)

**Por qué**
Si no quieres ejecutar scripts manualmente, puedes usar el comando de barra inclinada directamente en Claude Code.

En Claude Code, ingresa:

```
/setup-pm
```

Claude Code llamará al script y mostrará opciones interactivas.

**Deberías ver** una salida de detección similar:

```
[PackageManager] Available package managers:
  - npm
  - pnpm (current)
  - bun

To set your preferred package manager:
  - Global: Set CLAUDE_PACKAGE_MANAGER environment variable
  - Or add to ~/.claude/package-manager.json: {"packageManager": "pnpm"}
  - Or add to package.json: {"packageManager": "pnpm@8"}
```

### Paso 5: Verificar la lógica de detección

**Por qué**
Después de entender la prioridad de detección, puedes predecir los resultados en diferentes situaciones.

Probemos varios escenarios:

**Escenario 1: Detección por archivo Lock**

```bash
# Eliminar configuración de proyecto
rm .claude/package-manager.json

# Detectar
node scripts/setup-package-manager.js --detect
```

**Deberías ver** `Source: lock-file` (si existe un archivo lock)

**Escenario 2: Campo package.json**

```bash
# Agregar al package.json
cat >> package.json << 'EOF'
  "packageManager": "pnpm@8.6.0"
EOF

# Detectar
node scripts/setup-package-manager.js --detect
```

**Deberías ver** `From package.json: pnpm@8.6.0`

**Escenario 3: Sobrescritura por variable de entorno**

```bash
# Establecer variable de entorno temporalmente
export CLAUDE_PACKAGE_MANAGER=yarn

# Detectar
node scripts/setup-package-manager.js --detect
```

**Deberías ver** `Source: environment` y `Package Manager: yarn`

```bash
# Limpiar variable de entorno
unset CLAUDE_PACKAGE_MANAGER
```

## Punto de verificación ✅

Asegúrate de que los siguientes puntos de verificación pasen:

- [ ] El comando `--detect` identifica correctamente el gestor de paquetes actual
- [ ] El archivo de configuración global está creado: `~/.claude/package-manager.json`
- [ ] El archivo de configuración de proyecto está creado (si es necesario): `.claude/package-manager.json`
- [ ] Las relaciones de sobrescritura entre diferentes prioridades funcionan como se espera
- [ ] Los gestores de paquetes disponibles listados coinciden con los realmente instalados

## Solución de problemas

### ❌ Error 1: La configuración no tiene efecto

**Síntoma**: Configuraste `pnpm`, pero la detección muestra `npm`.

**Causa**:
- El archivo Lock tiene mayor prioridad que la configuración global (si existe un archivo lock)
- El campo `packageManager` en package.json también tiene mayor prioridad que la configuración global

**Solución**:
```bash
# Verificar la fuente de detección
node scripts/setup-package-manager.js --detect

# Si es lock file o package.json, verifica estos archivos
ls -la | grep -E "(package-lock|yarn.lock|pnpm-lock|bun.lockb)"
cat package.json | grep packageManager
```

### ❌ Error 2: Gestor de paquetes configurado no existe

**Síntoma**: Configuraste `bun`, pero no está instalado en el sistema.

**El resultado de detección** mostrará:

```
Available package managers:
  ✓ npm
  ✗ bun (current)  ← Nota: aunque está marcado como current, no está instalado
```

**Solución**: Instala primero el gestor de paquetes, o configura otro que esté instalado.

```bash
# Detectar gestores de paquetes disponibles
node scripts/setup-package-manager.js --list

# Cambiar a uno instalado
node scripts/setup-package-manager.js --global npm
```

### ❌ Error 3: Problemas de rutas en Windows

**Síntoma**: Al ejecutar el script en Windows, aparece error de archivo no encontrado.

**Causa**: Problema con separadores de ruta en scripts Node.js (el código fuente ya lo maneja, pero asegúrate de usar el comando correcto).

**Solución**: Usa PowerShell o Git Bash, asegurando que la ruta sea correcta:

```powershell
# PowerShell
node scripts\setup-package-manager.js --detect
```

### ❌ Error 4: La configuración de proyecto afecta a otros proyectos

**Síntoma**: El proyecto A está configurado con `bun`, pero al cambiar al proyecto B sigue usando `bun`.

**Causa**: La configuración de proyecto solo tiene efecto en el directorio del proyecto actual. Al cambiar de directorio, se vuelve a detectar.

**Solución**: Este es el comportamiento normal. La configuración de proyecto solo afecta al proyecto actual, no contamina otros proyectos.

## Resumen de la lección

El mecanismo de detección del gestor de paquetes de Everything Claude Code es muy inteligente:

- **6 niveles de prioridad**: Variable de entorno > Configuración de proyecto > package.json > Archivo lock > Configuración global > Fallback
- **Configuración flexible**: Soporta valor predeterminado global y sobrescritura por proyecto
- **Detección automática**: En la mayoría de los casos no necesitas configuración manual
- **Comandos unificados**: Una vez configurado, todos los hooks y agents usarán los comandos correctos

**Estrategia de configuración recomendada**:

1. Establece globalmente tu gestor de paquetes más usado (como `pnpm`)
2. Sobrescribe a nivel de proyecto para proyectos especiales (como los que dependen del rendimiento de `bun`)
3. Deja que la detección automática maneje el resto

## Próxima lección

> En la próxima lección aprenderemos **[Configuración de servidores MCP](../mcp-setup/)**.
>
> Aprenderás:
> - Cómo configurar más de 15 servidores MCP preconfigurados
> - Cómo los servidores MCP extienden las capacidades de Claude Code
> - Cómo gestionar el estado de habilitación y uso de tokens de los servidores MCP

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-25

| Funcionalidad | Ruta del archivo | Línea |
| --- | --- | --- |
| Lógica central de detección del gestor de paquetes | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L157-L236) | 157-236 |
| Detección de archivo Lock | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L92-L102) | 92-102 |
| Detección de package.json | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L107-L126) | 107-126 |
| Definición de gestores de paquetes (configuración) | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L13-L54) | 13-54 |
| Definición de prioridad de detección | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L57) | 57 |
| Guardado de configuración global | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L241-L252) | 241-252 |
| Guardado de configuración de proyecto | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L257-L272) | 257-272 |
| Entrada del script de línea de comandos | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js#L158-L206) | 158-206 |
| Implementación del comando de detección | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js#L62-L95) | 62-95 |

**Constantes clave**:
- `PACKAGE_MANAGERS`: Gestores de paquetes soportados y su configuración de comandos (líneas 13-54)
- `DETECTION_PRIORITY`: Orden de prioridad de detección `['pnpm', 'bun', 'yarn', 'npm']` (línea 57)

**Funciones clave**:
- `getPackageManager()`: Lógica central de detección, devuelve el gestor de paquetes según prioridad (líneas 157-236)
- `detectFromLockFile()`: Detecta el gestor de paquetes desde el archivo lock (líneas 92-102)
- `detectFromPackageJson()`: Detecta el gestor de paquetes desde package.json (líneas 107-126)
- `setPreferredPackageManager()`: Guarda la configuración global (líneas 241-252)
- `setProjectPackageManager()`: Guarda la configuración de proyecto (líneas 257-272)

**Implementación de prioridad de detección** (código fuente líneas 157-236):
```javascript
function getPackageManager(options = {}) {
  // 1. Variable de entorno (máxima prioridad)
  if (envPm && PACKAGE_MANAGERS[envPm]) { return { name: envPm, source: 'environment' }; }

  // 2. Configuración de proyecto
  if (projectConfig) { return { name: config.packageManager, source: 'project-config' }; }

  // 3. Campo package.json
  if (fromPackageJson) { return { name: fromPackageJson, source: 'package.json' }; }

  // 4. Archivo Lock
  if (fromLockFile) { return { name: fromLockFile, source: 'lock-file' }; }

  // 5. Configuración global
  if (globalConfig) { return { name: globalConfig.packageManager, source: 'global-config' }; }

  // 6. Fallback: busca el primero disponible según prioridad
  for (const pmName of fallbackOrder) {
    if (available.includes(pmName)) { return { name: pmName, source: 'fallback' }; }
  }

  // Predeterminado npm
  return { name: 'npm', source: 'default' };
}
```

</details>
