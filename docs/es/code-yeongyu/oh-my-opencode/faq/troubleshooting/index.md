---
title: "Solución de problemas: Comando Doctor | oh-my-opencode"
subtitle: "Uso del comando Doctor para diagnóstico de configuración"
sidebarTitle: "Solución de problemas"
description: "Aprende los métodos de diagnóstico del comando doctor de oh-my-opencode. Ejecuta 17+ verificaciones de salud que incluyen versión, plugins, autenticación y modelos para resolver problemas rápidamente."
tags:
  - "solución de problemas"
  - "diagnóstico"
  - "configuración"
prerequisite:
  - "/es/code-yeongyu/oh-my-opencode/start/installation"
order: 150
---

# Diagnóstico de configuración y solución de problemas: Uso del comando Doctor para resolver problemas rápidamente

## Lo que aprenderás

- Ejecutar `oh-my-opencode doctor` para diagnosticar rápidamente 17+ verificaciones de salud
- Localizar y corregir problemas como versión de OpenCode desactualizada, plugins no registrados, problemas de configuración de Provider
- Entender el mecanismo de resolución de modelos y verificar las asignaciones de modelos de agentes y Category
- Usar el modo detallado para obtener información completa para el diagnóstico de problemas

## Tu desafío actual

Después de instalar oh-my-opencode, ¿qué haces cuando encuentras:

- OpenCode reporta que el plugin no está cargado, pero el archivo de configuración parece correcto
- Algunos agentes de AI siempre muestran error con "Modelo no encontrado"
- Quieres verificar que todos los Providers (Claude, OpenAI, Gemini) estén configurados correctamente
- No estás seguro si el problema está en la instalación, configuración o autenticación

Solucionar problemas uno por uno consume mucho tiempo. Necesitas una **herramienta de diagnóstico con un clic**.

## Conceptos clave

**El comando Doctor es el sistema de verificación de salud de oh-my-opencode**, similar a la Utilidad de Discos de Mac o el escáner de diagnóstico de un automóvil. Verifica sistemáticamente tu entorno y te indica qué funciona y qué tiene problemas.

La lógica de verificación del Doctor proviene completamente de la implementación del código fuente (`src/cli/doctor/checks/`), incluyendo:
- ✅ **instalación**: versión de OpenCode, registro de plugins
- ✅ **configuración**: formato del archivo de configuración, validación de Schema
- ✅ **autenticación**: plugins de autenticación Anthropic, OpenAI, Google
- ✅ **dependencias**: dependencias Bun, Node.js, Git
- ✅ **herramientas**: estado del servidor LSP y MCP
- ✅ **actualizaciones**: verificaciones de actualización de versión

## Sigue los pasos

### Paso 1: Ejecutar diagnóstico básico

**Por qué**
Ejecuta primero una verificación completa para entender el estado general de salud.

```bash
bunx oh-my-opencode doctor
```

**Deberías ver**:

```
┌──────────────────────────────────────────────────┐
│  Oh-My-OpenCode Doctor                           │
└──────────────────────────────────────────────────┘

Installation
  ✓ OpenCode version: 1.0.155 (>= 1.0.150)
  ✓ Plugin registered in opencode.json

Configuration
  ✓ oh-my-opencode.json is valid
  ⚠ categories.visual-engineering: using default model

Authentication
  ✓ Anthropic API key configured
  ✓ OpenAI API key configured
  ✗ Google API key not found

Dependencies
  ✓ Bun 1.2.5 installed
  ✓ Node.js 22.0.0 installed
  ✓ Git 2.45.0 installed

Summary: 10 passed, 1 warning, 1 failed
```

**Punto de control ✅**:
- [ ] Ver resultados para 6 categorías
- [ ] Cada elemento tiene marcador ✓ (aprobado), ⚠ (advertencia), ✗ (fallido)
- [ ] Estadísticas de resumen al final

### Paso 2: Interpretar problemas comunes

Basándote en los resultados de diagnóstico, puedes localizar rápidamente los problemas. Aquí hay errores comunes y soluciones:

#### ✗ "OpenCode version too old"

**Problema**: La versión de OpenCode es inferior a 1.0.150 (requisito mínimo)

**Causa**: oh-my-opencode depende de nuevas características de OpenCode, que las versiones antiguas no soportan

**Solución**:

```bash
# Actualizar OpenCode
npm install -g opencode@latest
# O usar Bun
bun install -g opencode@latest
```

**Verificación**: Volver a ejecutar `bunx oh-my-opencode doctor`

#### ✗ "Plugin not registered"

**Problema**: El plugin no está registrado en el array `plugin` de `opencode.json`

**Causa**: El proceso de instalación se interrumpió, o se editó manualmente el archivo de configuración

**Solución**:

```bash
# Volver a ejecutar el instalador
bunx oh-my-opencode install
```

**Base del código fuente** (`src/cli/doctor/checks/plugin.ts:79-117`):
- Verifica si el plugin está en el array `plugin` de `opencode.json`
- Soporta formatos: `oh-my-opencode` o `oh-my-opencode@version` o ruta `file://`

#### ✗ "Configuration has validation errors"

**Problema**: El archivo de configuración no coincide con la definición de Schema

**Causa**: Errores introducidos durante la edición manual (como errores tipográficos, desajustes de tipo)

**Solución**:

1. Usa `--verbose` para ver información detallada del error:

```bash
bunx oh-my-opencode doctor --verbose
```

2. Tipos de errores comunes (de `src/config/schema.ts`):

| Mensaje de error | Causa | Solución |
|-------------------|-------|----------|
| `agents.sisyphus.mode: Invalid enum value` | `mode` solo puede ser `subagent`/`primary`/`all` | Cambiar a `primary` |
| `categories.quick.model: Expected string` | `model` debe ser una cadena | Agregar comillas: `"anthropic/claude-haiku-4-5"` |
| `background_task.defaultConcurrency: Expected number` | La concurrencia debe ser un número | Cambiar a número: `3` |

3. Consulta la [Referencia de configuración](../../appendix/configuration-reference/) para verificar las definiciones de campos

#### ⚠ "Auth plugin not installed"

**Problema**: El plugin de autenticación para Provider no está instalado

**Causa**: Se omitió ese Provider durante la instalación, o se desinstaló manualmente el plugin

**Solución**:

```bash
# Reinstalar y seleccionar el Provider faltante
bunx oh-my-opencode install
```

**Base del código fuente** (`src/cli/doctor/checks/auth.ts:11-15`):

```typescript
const AUTH_PLUGINS: Record<AuthProviderId, { plugin: string; name: string }> = {
  anthropic: { plugin: "builtin", name: "Anthropic (Claude)" },
  openai: { plugin: "opencode-openai-codex-auth", name: "OpenAI (ChatGPT)" },
  google: { plugin: "opencode-antigravity-auth", name: "Google (Gemini)" },
}
```

### Paso 3: Verificar resolución de modelos

La resolución de modelos es el mecanismo central de oh-my-opencode, verificando si las asignaciones de modelos de agentes y Category son correctas.

```bash
bunx oh-my-opencode doctor --category configuration
```

**Deberías ver**:

```
Configuration
  ✓ oh-my-opencode.json is valid
  ⚠ Model Resolution: 9 agents, 7 categories (0 overrides), 15 available

Details:
  ═══ Available Models (from cache) ═══

    Providers in cache: anthropic, openai, google
    Sample: anthropic, openai, google
    Total models: 15
    Cache: ~/.cache/opencode/models.json
    ℹ Runtime: only connected providers used
    Refresh: opencode models --refresh

  ═══ Configured Models ═══

  Agents:
    ○ sisyphus: anthropic/claude-opus-4-5
    ○ oracle: openai/gpt-5.2
    ○ librarian: opencode/big-pickle
    ...

  Categories:
    ○ visual-engineering: google/gemini-3-pro
    ○ ultrabrain: openai/gpt-5.2-codex
    ...

  ○ = provider fallback
```

**Punto de control ✅**:
- [ ] Ver asignaciones de modelos de Agentes y Categories
- [ ] `○` significa usar el mecanismo de respaldo de Provider (no anulado manualmente)
- [ ] `●` significa que el usuario ha anulado el modelo predeterminado en la configuración

**Problemas comunes**:

| Problema | Causa | Solución |
|----------|-------|----------|
| Modelo `unknown` | La cadena de respaldo de Provider está vacía | Asegúrate de que al menos un Provider esté disponible |
| Modelo no usado | Provider no conectado | Ejecuta `opencode` para conectar Provider |
| Quiero anular modelo | Usando modelo predeterminado | Establece `agents.<name>.model` en `oh-my-opencode.json` |

**Base del código fuente** (`src/cli/doctor/checks/model-resolution.ts:129-148`):
- Lee modelos disponibles de `~/.cache/opencode/models.json`
- Requisitos de modelo de agente: `AGENT_MODEL_REQUIREMENTS` (`src/shared/model-requirements.ts`)
- Requisitos de modelo de Category: `CATEGORY_MODEL_REQUIREMENTS`

### Paso 4: Usar salida JSON (automatización)

Si quieres automatizar el diagnóstico en CI/CD, usa el formato JSON:

```bash
bunx oh-my-opencode doctor --json
```

**Deberías ver**:

```json
{
  "results": [
    {
      "name": "OpenCode version",
      "status": "pass",
      "message": "1.0.155 (>= 1.0.150)",
      "duration": 5
    },
    {
      "name": "Plugin registration",
      "status": "pass",
      "message": "Registered",
      "details": ["Config: /Users/xxx/.config/opencode/opencode.json"],
      "duration": 12
    }
  ],
  "summary": {
    "total": 17,
    "passed": 15,
    "failed": 1,
    "warnings": 1,
    "skipped": 0,
    "duration": 1234
  },
  "exitCode": 1
}
```

**Casos de uso**:

```bash
# Guardar informe de diagnóstico en archivo
bunx oh-my-opencode doctor --json > doctor-report.json

# Verificar estado de salud en CI/CD
bunx oh-my-opencode doctor --json | jq -e '.summary.failed == 0'
if [ $? -eq 0 ]; then
  echo "All checks passed"
else
  echo "Some checks failed"
  exit 1
fi
```

## Errores comunes

### Error 1: Ignorar mensajes de advertencia

**Problema**: Ver marcadores `⚠` y pensar que son "opcionales", cuando en realidad podrían ser pistas importantes

**Solución**:
- Por ejemplo: la advertencia "using default model" significa que no has configurado modelos de Category, lo que podría no ser óptimo
- Usa `--verbose` para ver información detallada y decidir si se requiere acción

### Error 2: Editar manualmente opencode.json

**Problema**: Modificar directamente el `opencode.json` de OpenCode, rompiendo el registro del plugin

**Solución**:
- Usa `bunx oh-my-opencode install` para volver a registrar
- O solo modifica `oh-my-opencode.json`, no toques el archivo de configuración de OpenCode

### Error 3: Caché no actualizada

**Problema**: La resolución de modelos muestra "cache not found", pero el Provider está configurado

**Solución**:

```bash
# Iniciar OpenCode para actualizar la caché de modelos
opencode

# O actualizar manualmente (si existe el comando opencode models)
opencode models --refresh
```

## Resumen

El comando Doctor es la navaja suiza de oh-my-opencode, ayudándote a localizar problemas rápidamente:

| Comando | Propósito | Cuándo usar |
|---------|-----------|-------------|
| `bunx oh-my-opencode doctor` | Diagnóstico completo | Después de la instalación inicial, al encontrar problemas |
| `--verbose` | Información detallada | Necesitas ver detalles de errores |
| `--json` | Salida JSON | CI/CD, automatización de scripts |
| `--category <name>` | Verificación de categoría única | Solo quieres verificar un aspecto específico |

**Recuerda**: Siempre que encuentres un problema, ejecuta `doctor` primero, entiende claramente el error antes de tomar acción.

## Próximo tema

> En la siguiente lección, aprenderemos **[Preguntas frecuentes](../faq/)**.
>
> Aprenderás:
> - Diferencias entre oh-my-opencode y otras herramientas de AI
> - Cómo optimizar los costos de uso de modelos
> - Mejores prácticas para el control de concurrencia de tareas en segundo plano

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir ubicaciones del código fuente</strong></summary>

> Actualizado: 2026-01-26

| Característica | Ruta del archivo | Números de línea |
|----------------|------------------|------------------|
| Entrada del comando Doctor | [`src/cli/doctor/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/index.ts#L1-L11) | 1-11 |
| Registro de todas las verificaciones | [`src/cli/doctor/checks/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/index.ts#L24-L37) | 24-37 |
| Verificación de registro de plugin | [`src/cli/doctor/checks/plugin.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/plugin.ts#L79-L117) | 79-117 |
| Verificación de validación de configuración | [`src/cli/doctor/checks/config.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/config.ts#L82-L112) | 82-112 |
| Verificación de autenticación | [`src/cli/doctor/checks/auth.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/auth.ts#L49-L76) | 49-76 |
| Verificación de resolución de modelos | [`src/cli/doctor/checks/model-resolution.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/model-resolution.ts#L234-L254) | 234-254 |
| Schema de configuración | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L1-L50) | 1-50 |
| Definición de requisitos de modelo | [`src/shared/model-requirements.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/shared/model-requirements.ts) | Archivo completo |

**Constantes clave**:
- `MIN_OPENCODE_VERSION = "1.0.150"`: Requisito de versión mínima de OpenCode
- `AUTH_PLUGINS`: Mapeo de plugins de autenticación (Anthropic=built-in, OpenAI/GitHub=plugins)
- `AGENT_MODEL_REQUIREMENTS`: Requisitos de modelo de agente (cadena de prioridad de cada agente)
- `CATEGORY_MODEL_REQUIREMENTS`: Requisitos de modelo de Category (visual, quick, etc.)

**Funciones clave**:
- `doctor(options)`: Ejecutar comando de diagnóstico, devuelve código de salida
- `getAllCheckDefinitions()`: Obtener todas las definiciones de elementos de verificación (17+)
- `checkPluginRegistration()`: Verificar si el plugin está registrado en opencode.json
- `validateConfig(configPath)`: Validar que el archivo de configuración coincida con Schema
- `checkAuthProvider(providerId)`: Verificar el estado del plugin de autenticación de Provider
- `checkModelResolution()`: Verificar la resolución y asignación de modelos

</details>
