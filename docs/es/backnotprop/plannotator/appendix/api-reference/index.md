---
title: "Referencia de API: Documentación de interfaz local | plannotator"
sidebarTitle: "Consulta de API"
subtitle: "Referencia de API: Documentación de interfaz local | plannotator"
description: "Conozca todos los endpoints de API y los formatos de solicitud/respuesta proporcionados por Plannotator. Presenta en detalle las especificaciones completas de las interfaces de revisión de planes, revisión de código, carga de imágenes, etc., facilitando el desarrollo de integración."
tags:
  - "API"
  - "Apéndice"
prerequisite:
  - "start-getting-started"
order: 1
---

# Referencia de API de Plannotator

## Lo que lograrás

- Conocer todos los endpoints de API proporcionados por el servidor local de Plannotator
- Ver los formatos de solicitud y respuesta de cada API
- Comprender las diferencias entre las interfaces de revisión de planes y revisión de código
- Proporcionar referencia para el desarrollo de integración o extensión

## Descripción general

Plannotator ejecuta un servidor HTTP local (usando Bun.serve), proporcionando una API RESTful para la revisión de planes y la revisión de código. Todas las respuestas de la API tienen formato JSON y no requieren autenticación (entorno de aislamiento local).

**Métodos de inicio del servidor**:
- Puerto aleatorio (modo local)
- Puerto fijo 19432 (modo remoto/Devcontainer, se puede sobrescribir con `PLANNOTATOR_PORT`)

**URL base de la API**: `http://localhost:<PORT>/api/`

::: tip Consejo
Las siguientes API se clasifican por módulos funcionales. Las mismas rutas pueden comportarse de manera diferente en los servidores de revisión de planes y revisión de código.
:::

## API de revisión de planes

### GET /api/plan

Obtiene el contenido del plan actual y metadatos relacionados.

**Solicitud**: Ninguna

**Ejemplo de respuesta**:

```json
{
  "plan": "# Implementation Plan: User Authentication\n...",
  "origin": "claude-code",
  "permissionMode": "read-write",
  "sharingEnabled": true
}
```

| Campo | Tipo | Descripción |
|--- | --- | ---|
| `plan` | string | Contenido en Markdown del plan |
| `origin` | string | Identificador de origen (`"claude-code"` u `"opencode"`) |
| `permissionMode` | string | Modo de permiso actual (específico de Claude Code) |
| `sharingEnabled` | boolean | Si el uso compartido por URL está habilitado |

---

### POST /api/approve

Aprueba el plan actual, opcionalmente guardándolo en una aplicación de notas.

**Cuerpo de la solicitud**:

```json
{
  "obsidian": {
    "vaultPath": "/Users/xxx/Documents/Obsidian",
    "folder": "Plans",
    "tags": ["plannotator"],
    "plan": "Plan content..."
  },
  "bear": {
    "plan": "Plan content..."
  },
  "feedback": "Notas al aprobar (solo OpenCode)",
  "agentSwitch": "gpt-4",
  "permissionMode": "read-write",
  "planSave": {
    "enabled": true,
    "customPath": "/path/to/custom/folder"
  }
}
```

**Ejemplo de respuesta**:

```json
{
  "ok": true,
  "savedPath": "/Users/xxx/.plannotator/plans/approved-plan-20260124.md"
}
```

**Descripción de campos**:

| Campo | Tipo | Requerido | Descripción |
|--- | --- | --- | ---|
| `obsidian` | object | No | Configuración de guardado de Obsidian |
| `bear` | object | No | Configuración de guardado de Bear |
| `feedback` | string | No | Notas adjuntas al aprobar (solo OpenCode) |
| `agentSwitch` | string | No | Nombre del agente al que cambiar (solo OpenCode) |
| `permissionMode` | string | No | Modo de permiso solicitado (solo Claude Code) |
| `planSave` | object | No | Configuración de guardado del plan |

**Campos de configuración de Obsidian**:

| Campo | Tipo | Requerido | Descripción |
|--- | --- | --- | ---|
| `vaultPath` | string | Sí | Ruta del archivo del vault |
| `folder` | string | No | Carpeta de destino (directorio raíz por defecto) |
| `tags` | string[] | No | Etiquetas generadas automáticamente |
| `plan` | string | Sí | Contenido del plan |

---

### POST /api/deny

Rechaza el plan actual y proporciona retroalimentación.

**Cuerpo de la solicitud**:

```json
{
  "feedback": "Es necesario agregar cobertura de pruebas unitarias",
  "planSave": {
    "enabled": true,
    "customPath": "/path/to/custom/folder"
  }
}
```

**Ejemplo de respuesta**:

```json
{
  "ok": true,
  "savedPath": "/Users/xxx/.plannotator/plans/denied-plan-20260124.md"
}
```

**Descripción de campos**:

| Campo | Tipo | Requerido | Descripción |
|--- | --- | --- | ---|
| `feedback` | string | No | Razón del rechazo (por defecto "Plan rejected by user") |
| `planSave` | object | No | Configuración de guardado del plan |

---

### GET /api/obsidian/vaults

Detecta los vaults de Obsidian configurados localmente.

**Solicitud**: Ninguna

**Ejemplo de respuesta**:

```json
{
  "vaults": [
    "/Users/xxx/Documents/Obsidian",
    "/Users/xxx/Documents/OtherVault"
  ]
}
```

**Rutas de archivo de configuración**:
- macOS: `~/Library/Application Support/obsidian/obsidian.json`
- Windows: `%APPDATA%\obsidian\obsidian.json`
- Linux: `~/.config/obsidian/obsidian.json`

---

## API de revisión de código

### GET /api/diff

Obtiene el contenido actual de git diff.

**Solicitud**: Ninguna

**Ejemplo de respuesta**:

```json
{
  "rawPatch": "diff --git a/src/index.ts b/src/index.ts\n...",
  "gitRef": "HEAD",
  "origin": "opencode",
  "diffType": "uncommitted",
  "gitContext": {
    "currentBranch": "feature/auth",
    "defaultBranch": "main",
    "diffOptions": [
      { "id": "uncommitted", "label": "Uncommitted changes" },
      { "id": "last-commit", "label": "Last commit" },
      { "id": "branch", "label": "vs main" }
    ]
  },
  "sharingEnabled": true
}
```

| Campo | Tipo | Descripción |
|--- | --- | ---|
| `rawPatch` | string | Patch en formato unificado de Git diff |
| `gitRef` | string | Referencia de Git utilizada |
| `origin` | string | Identificador de origen |
| `diffType` | string | Tipo de diff actual |
| `gitContext` | object | Información de contexto de Git |
| `sharingEnabled` | boolean | Si el uso compartido por URL está habilitado |

**Descripción de campos de gitContext**:

| Campo | Tipo | Descripción |
|--- | --- | ---|
| `currentBranch` | string | Nombre de la rama actual |
| `defaultBranch` | string | Nombre de la rama por defecto (main o master) |
| `diffOptions` | object[] | Opciones de tipos de diff disponibles (contiene id y label) |

---

### POST /api/diff/switch

Cambia a diferentes tipos de git diff.

**Cuerpo de la solicitud**:

```json
{
  "diffType": "staged"
}
```

**Tipos de diff admitidos**:

| Tipo | Comando Git | Descripción |
|--- | --- | ---|
| `uncommitted` | `git diff HEAD` | Cambios no confirmados (por defecto) |
| `staged` | `git diff --staged` | Cambios ya preparados |
| `last-commit` | `git diff HEAD~1..HEAD` | Último commit |
| `vs main` | `git diff main..HEAD` | Rama actual vs main |

**Ejemplo de respuesta**:

```json
{
  "rawPatch": "diff --git a/src/index.ts b/src/index.ts\n...",
  "gitRef": "--staged",
  "diffType": "staged"
}
```

---

### POST /api/feedback

Envía retroalimentación de revisión de código al agente de IA.

**Cuerpo de la solicitud**:

```json
{
  "feedback": "Se sugiere agregar lógica de manejo de errores",
  "annotations": [
    {
      "id": "1",
      "type": "suggestion",
      "filePath": "src/index.ts",
      "lineStart": 42,
      "lineEnd": 45,
      "side": "new",
      "text": "Aquí debería usar try-catch",
      "suggestedCode": "try {\n  // ...\n} catch (err) {\n  console.error(err);\n}"
    }
  ],
  "agentSwitch": "gpt-4"
}
```

**Descripción de campos**:

| Campo | Tipo | Requerido | Descripción |
|--- | --- | --- | ---|
| `feedback` | string | No | Retroalimentación de texto (LGTM u otro) |
| `annotations` | array | No | Matriz de comentarios estructurados |
| `agentSwitch` | string | No | Nombre del agente al que cambiar (solo OpenCode) |

**Campos del objeto annotation**:

| Campo | Tipo | Requerido | Descripción |
|--- | --- | --- | ---|
| `id` | string | Sí | Identificador único |
| `type` | string | Sí | Tipo: `comment`, `suggestion`, `concern` |
| `filePath` | string | Sí | Ruta del archivo |
| `lineStart` | number | Sí | Número de línea de inicio |
| `lineEnd` | number | Sí | Número de línea final |
| `side` | string | Sí | Lado: `"old"` o `"new"` |
| `text` | string | No | Contenido del comentario |
| `suggestedCode` | string | No | Código sugerido (tipo suggestion) |

**Ejemplo de respuesta**:

```json
{
  "ok": true
}
```

---

## API compartida

### GET /api/image

Obtiene una imagen (ruta de archivo local o archivo temporal cargado).

**Parámetros de solicitud**:

| Parámetro | Tipo | Requerido | Descripción |
|--- | --- | --- | ---|
| `path` | string | Sí | Ruta del archivo de imagen |

**Ejemplo de solicitud**: `GET /api/image?path=/tmp/plannotator/abc-123.png`

**Respuesta**: Archivo de imagen (PNG/JPEG/WebP)

**Respuestas de error**:
- `400` - Falta el parámetro path
- `404` - El archivo no existe
- `500` - Error al leer el archivo

---

### POST /api/upload

Carga una imagen al directorio temporal y devuelve una ruta accesible.

**Solicitud**: `multipart/form-data`

| Campo | Tipo | Requerido | Descripción |
|--- | --- | --- | ---|
| `file` | File | Sí | Archivo de imagen |

**Formatos admitidos**: PNG, JPEG, WebP

**Ejemplo de respuesta**:

```json
{
  "path": "/tmp/plannotator/abc-123-def456.png"
}
```

**Respuestas de error**:
- `400` - No se proporcionó archivo
- `500` - Error al cargar

::: info Nota
Las imágenes cargadas se guardan en el directorio `/tmp/plannotator` y no se limpian automáticamente después de cerrar el servidor.
:::

---

### GET /api/agents

Obtiene la lista de agentes de OpenCode disponibles (solo OpenCode).

**Solicitud**: Ninguna

**Ejemplo de respuesta**:

```json
{
  "agents": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "description": "Most capable model for complex tasks"
    },
    {
      "id": "gpt-4o",
      "name": "GPT-4o",
      "description": "Fast and efficient multimodal model"
    }
  ]
}
```

**Reglas de filtrado**:
- Solo devuelve agentes con `mode === "primary"`
- Excluye agentes con `hidden === true`

**Respuestas de error**:

```json
{
  "agents": [],
  "error": "Failed to fetch agents"
}
```

---

## Manejo de errores

### Códigos de estado HTTP

| Código de estado | Descripción |
|--- | ---|
| `200` | Solicitud exitosa |
| `400` | Error de validación de parámetros |
| `404` | Recurso no encontrado |
| `500` | Error interno del servidor |

### Formato de respuesta de error

```json
{
  "error": "Descripción del error"
}
```

### Errores comunes

| Error | Condición de activación |
|--- | ---|
| `Missing path parameter` | `/api/image` falta el parámetro `path` |
| `File not found` | El archivo especificado en `/api/image` no existe |
| `No file provided` | `/api/upload` no cargó archivo |
| `Missing diffType` | `/api/diff/switch` falta el campo `diffType` |
| `Port ${PORT} in use` | Puerto ya ocupado (fallo al iniciar el servidor) |

---

## Comportamiento del servidor

### Mecanismo de reintento de puerto

- Máximo de reintentos: 5 veces
- Retraso entre reintentos: 500 milisegundos
- Error de tiempo de espera: `Port ${PORT} in use after 5 retries`

::: warning Consejo de modo remoto
En modo remoto/Devcontainer, si el puerto está ocupado, puede usar otro puerto estableciendo la variable de entorno `PLANNOTATOR_PORT`.
:::

### Espera de decisión

Después de iniciar, el servidor entra en estado de espera de la decisión del usuario:

**Servidor de revisión de planes**:
- Espera llamadas a `/api/approve` o `/api/deny`
- Devuelve la decisión y cierra el servidor después de la llamada

**Servidor de revisión de código**:
- Espera llamadas a `/api/feedback`
- Devuelve la retroalimentación y cierra el servidor después de la llamada

### Respaldo SPA

Todas las rutas no coincidentes devuelven HTML incrustado (aplicación de página única):

```http
HTTP/1.1 200 OK
Content-Type: text/html

<!DOCTYPE html>
<html>
...
</html>
```

Esto asegura que el enrutamiento del frontend funcione correctamente.

---

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|--- | --- | ---|
| `PLANNOTATOR_REMOTE` | Habilitar modo remoto | No establecido |
| `PLANNOTATOR_PORT` | Número de puerto fijo | Aleatorio (local) / 19432 (remoto) |
| `PLANNOTATOR_ORIGIN` | Identificador de origen | `"claude-code"` u `"opencode"` |
| `PLANNOTATOR_SHARE` | Deshabilitar uso compartido por URL | No establecido (habilitado) |

::: tip Consejo
Para más configuración de variables de entorno, consulte el capítulo [Configuración de variables de entorno](../../advanced/environment-variables/).
:::

---

## Resumen de la lección

Plannotator proporciona una API HTTP local completa que admite dos funciones principales: revisión de planes y revisión de código:

- **API de revisión de planes**: Obtener plan, decisiones de aprobación/rechazo, integración con Obsidian/Bear
- **API de revisión de código**: Obtener diff, cambiar tipo de diff, enviar retroalimentación estructurada
- **API compartida**: Carga y descarga de imágenes, consulta de lista de agentes
- **Manejo de errores**: Códigos de estado HTTP y formatos de error unificados

Todas las API se ejecutan localmente, sin carga de datos, seguras y confiables.

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haga clic para expandir y ver ubicaciones del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Función | Ruta del archivo | Número de línea |
|--- | --- | ---|
| Entrada del servidor de revisión de planes | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L355) | 91-355 |
| GET /api/plan | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L132-L134) | 132-134 |
| POST /api/approve | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L200-L277) | 200-277 |
| POST /api/deny | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L279-L309) | 279-309 |
| GET /api/image | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L136-L151) | 136-151 |
| POST /api/upload | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L153-L174) | 153-174 |
| GET /api/obsidian/vaults | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L176-L180) | 176-180 |
| GET /api/agents (revisión de planes) | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L182-L198) | 182-198 |
| Entrada del servidor de revisión de código | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L79-L288) | 79-288 |
| GET /api/diff | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L117-L127) | 117-127 |
| POST /api/diff/switch | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L129-L161) | 129-161 |
| POST /api/feedback | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L221-L242) | 221-242 |
| GET /api/agents (revisión de código) | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L203-L219) | 203-219 |

**Constantes clave**:
- `MAX_RETRIES = 5` - Número máximo de reintentos al iniciar el servidor (`packages/server/index.ts:79`, `packages/server/review.ts:68`)
- `RETRY_DELAY_MS = 500` - Retraso de reintento de puerto (`packages/server/index.ts:80`, `packages/server/review.ts:69`)

**Funciones clave**:
- `startPlannotatorServer(options)` - Inicia el servidor de revisión de planes (`packages/server/index.ts:91`)
- `startReviewServer(options)` - Inicia el servidor de revisión de código (`packages/server/review.ts:79`)

</details>
