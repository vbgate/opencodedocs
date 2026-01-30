---
title: "Resolución de errores 400 y MCP: solución de problemas de modelos | opencode-antigravity-auth"
sidebarTitle: "¿Qué hacer si no se encuentra el modelo?"
subtitle: "Resolución de errores de modelo no encontrado y error 400"
description: "Aprende a diagnosticar y solucionar errores de modelos de Antigravity. Incluye flujos de diagnóstico y resolución para errores Model not found, 400 Unknown name parameters y problemas de compatibilidad con servidores MCP."
tags:
  - "troubleshooting"
  - "model-errors"
  - "400-error"
  - "MCP"
prerequisite:
  - "start-quick-install"
order: 3
---

# Resolución de errores de modelo no encontrado y error 400

## Problemas que puedes encontrar

Al usar modelos de Antigravity, puedes encontrar los siguientes errores:

| Mensaje de error | Síntomas típicos |
| --- | --- |
| `Model not found` | El modelo no existe, no se puede iniciar la solicitud |
| `Invalid JSON payload received. Unknown name "parameters"` | Error 400, falla la llamada de herramienta |
| Error de llamada al servidor MCP | Herramientas específicas de MCP no funcionan |

Estos problemas generalmente están relacionados con la configuración, la compatibilidad del servidor MCP o la versión del plugin.

## Diagnóstico rápido

Antes de profundizar en la solución de problemas, confirma:

**macOS/Linux**:

```bash
# Verificar versión del plugin
grep "opencode-antigravity-auth" ~/.config/opencode/opencode.json

# Verificar archivo de configuración
cat ~/.config/opencode/antigravity.json | grep -E "(google|npm)"
```

**Windows**:

```powershell
# Verificar versión del plugin
Get-Content "$env:USERPROFILE\.config\opencode\opencode.json" | Select-String "opencode-antigravity-auth"

# Verificar archivo de configuración
Get-Content "$env:USERPROFILE\.config\opencode\antigravity.json" | Select-String "google|npm"
```

---

## Problema 1: Model not found

**Síntoma del error**:

```
Model not found: antigravity-claude-sonnet-4-5
```

**Causa**: La configuración del proveedor Google de OpenCode carece del campo `npm`.

**Solución**:

En tu `~/.config/opencode/opencode.json`, añade el campo `npm` al proveedor `google`:

```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google",
      "models": { ... }
    }
  }
}
```

**Pasos de verificación**:

1. Edita `~/.config/opencode/opencode.json`
2. Guarda el archivo
3. Vuelve a intentar llamar al modelo en OpenCode
4. Comprueba si el error "Model not found" persiste

::: tip Sugerencia
Si no estás seguro de la ubicación del archivo de configuración, ejecuta:

```bash
opencode config path
```

:::

---

## Problema 2: Error 400 - Unknown name 'parameters'

**Síntoma del error**:

```
Invalid JSON payload received. Unknown name "parameters" at 'request.tools[0]'
```

**¿Qué es este problema?**

Los modelos Gemini 3 utilizan una **validación protobuf estricta**, y la API de Antigravity requiere que las definiciones de herramientas usen un formato específico:

```json
// ❌ Formato incorrecto (será rechazado)
{
  "tools": [
    {
      "name": "my_tool",
      "parameters": { ... }  // ← Este campo no es aceptado
    }
  ]
}

// ✅ Formato correcto
{
  "tools": [
    {
      "functionDeclarations": [
        {
          "name": "my_tool",
          "description": "...",
          "parameters": { ... }  // ← Dentro de functionDeclarations
        }
      ]
    }
  ]
}
```

El plugin convierte automáticamente el formato, pero ciertos **Schemas devueltos por servidores MCP contienen campos incompatibles** (como `const`, `$ref`, `$defs`), lo que causa que la limpieza falle.

### Solución 1: Actualizar a la última versión beta

La última versión beta incluye correcciones de limpieza de Schema:

```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**macOS/Linux**:

```bash
npm install -g opencode-antigravity-auth@beta
```

**Windows**:

```powershell
npm install -g opencode-antigravity-auth@beta
```

### Solución 2: Deshabilitar servidores MCP para investigar uno por uno

Algunos servidores MCP devuelven formatos de Schema que no cumplen con los requisitos de Antigravity.

**Pasos**:

1. Abre `~/.config/opencode/opencode.json`
2. Encuentra la configuración de `mcpServers`
3. **Deshabilita todos los servidores MCP** (comenta o elimina)
4. Vuelve a intentar llamar al modelo
5. Si funciona, **habilita los servidores MCP uno por uno**, probando después de cada habilitación
6. Una vez que identifiques el servidor MCP problemático, desactívalo o informa del problema a los mantenedores de ese proyecto

**Ejemplo de configuración**:

```json
{
  "mcpServers": {
    // "filesystem": { ... },  ← Deshabilitado temporalmente
    // "github": { ... },       ← Deshabilitado temporalmente
    "brave-search": { ... }     ← Probar este primero
  }
}
```

### Solución 3: Añadir npm override

Si los métodos anteriores no funcionan, fuerza el uso de `@ai-sdk/google` en la configuración del proveedor `google`:

```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google"
    }
  }
}
```

---

## Problema 3: Falla de llamada de herramienta causada por servidor MCP

**Síntoma del error**:

- Herramientas específicas no funcionan (como WebFetch, operaciones de archivos, etc.)
- Mensaje de error relacionado con Schema
- Otras herramientas funcionan normalmente

**Causa**: Los Schemas JSON devueltos por servidores MCP contienen campos no soportados por la API de Antigravity.

### Características de Schema incompatibles

El plugin limpia automáticamente las siguientes características incompatibles (código fuente `src/plugin/request-helpers.ts:24-37`):

| Característica | Método de conversión | Ejemplo |
| --- | --- | --- |
| `const` | Convertir a `enum` | `{ const: "text" }` → `{ enum: ["text"] }` |
| `$ref` | Convertir a hint de description | `{ $ref: "#/$defs/Foo" }` → `{ type: "object", description: "Ver: Foo" }` |
| `$defs` / `definitions` | Expandir dentro del schema | Ya no se usan referencias |
| `minLength` / `maxLength` / `pattern` | Mover a description | Añadido a la señal de `description` |
| `additionalProperties` | Mover a description | Añadido a la señal de `description` |

Pero si la estructura del Schema es demasiado compleja (como `anyOf`/`oneOf` anidados en múltiples capas), la limpieza puede fallar.

### Flujo de diagnóstico

```bash
# Habilitar logs de depuración
export OPENCODE_ANTIGRAVITY_DEBUG=1  # macOS/Linux
$env:OPENCODE_ANTIGRAVITY_DEBUG=1     # Windows PowerShell

# Reiniciar OpenCode

# Ver errores de conversión de Schema en los logs
tail -f ~/.config/opencode/antigravity-logs/*.log
```

**Palabras clave a buscar en los logs**:

- `cleanJSONSchemaForAntigravity`
- `Failed to clean schema`
- `Unsupported keyword`
- `anyOf/oneOf flattening failed`

### Reportar problemas

Si determinas que un servidor MCP específico causa el problema, por favor envía un [issue de GitHub](https://github.com/NoeFabris/opencode-antigravity-auth/issues) que incluya:

1. **Nombre y versión del servidor MCP**
2. **Logs de error completos** (de `~/.config/opencode/antigravity-logs/`)
3. **Ejemplo de herramienta que desencadena el problema**
4. **Versión del plugin** (ejecuta `opencode --version`)

---

## Advertencias

::: warning Orden de deshabilitación de plugins

Si usas simultáneamente `opencode-antigravity-auth` y `@tarquinen/opencode-dcp`, **coloca el plugin Antigravity Auth antes**:

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",  ← Debe estar antes que DCP
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

DCP creará mensajes de asistente sintéticos que carecen de bloques de pensamiento, lo que puede causar errores de verificación de firma.
:::

::: warning Error en el nombre de la clave de configuración

Asegúrate de usar `plugin` (singular), no `plugins` (plural):

```json
// ❌ Incorrecto
{
  "plugins": ["opencode-antigravity-auth@beta"]
}

// ✅ Correcto
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

:::

---

## Cuándo buscar ayuda

Si el problema persiste después de probar todos los métodos anteriores:

**Verificar archivos de log**:

```bash
cat ~/.config/opencode/antigravity-logs/latest.log
```

**Restablecer cuenta** (elimina todos los estados):

```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

**Enviar un issue de GitHub**, que incluya:

- Información completa del error
- Versión del plugin (`opencode --version`)
- Configuración de `~/.config/opencode/antigravity.json` (**elimina información sensible como refreshToken**)
- Logs de depuración (`~/.config/opencode/antigravity-logs/latest.log`)

---

## Cursos relacionados

- [Guía de instalación rápida](/es/NoeFabris/opencode-antigravity-auth/start/quick-install/) - Configuración básica
- [Compatibilidad de plugins](/es/NoeFabris/opencode-antigravity-auth/faq/plugin-compatibility/) - Resolución de conflictos con otros plugins
- [Logs de depuración](/es/NoeFabris/opencode-antigravity-auth/advanced/debug-logging/) - Habilitar logs detallados

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Función | Ruta del archivo | Número de línea |
| --- | --- | --- |
| Función principal de limpieza de JSON Schema | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 658-685 |
| Convertir const a enum | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 86-104 |
| Convertir $ref a hints | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 55-80 |
| Aplanar anyOf/oneOf | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 368-453 |
| Conversión de formato de herramientas Gemini | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 425-517 |

**Constantes clave**:

- `UNSUPPORTED_KEYWORDS`: Palabras clave de Schema eliminadas (`request-helpers.ts:33-37`)
- `UNSUPPORTED_CONSTRAINTS`: Restricciones movidas a description (`request-helpers.ts:24-28`)

**Funciones clave**:

- `cleanJSONSchemaForAntigravity(schema)`: Limpia JSON Schema incompatibles
- `convertConstToEnum(schema)`: Convierte `const` a `enum`
- `convertRefsToHints(schema)`: Convierte `$ref` a hints de description
- `flattenAnyOfOneOf(schema)`: Aplana estructuras `anyOf`/`oneOf`

</details>
