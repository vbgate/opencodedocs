---
title: "Fallo de conexión MCP: Solución de problemas de configuración | Everything Claude Code"
sidebarTitle: "Solución de problemas de conexión MCP"
subtitle: "Fallo de conexión MCP: Solución de problemas de configuración"
description: "Aprende a solucionar problemas de conexión con servidores MCP. Resuelve 6 fallos comunes, incluyendo errores de clave API, ventana de contexto demasiado pequeña, errores de configuración de tipo de servidor y más, con un proceso de reparación sistemático."
tags:
  - "solución de problemas"
  - "mcp"
  - "configuración"
prerequisite:
  - "start-mcp-setup"
order: 160
---

# Solución de problemas comunes: Fallo de conexión MCP

## Tu situación actual

Después de configurar el servidor MCP, puedes encontrar estos problemas:

- ❌ Claude Code muestra "Failed to connect to MCP server"
- ❌ Los comandos de GitHub/Supabase no funcionan
- ❌ La ventana de contexto se reduce repentinamente, las llamadas a herramientas son más lentas
- ❌ Filesystem MCP no puede acceder a archivos
- ❌ Demasiados servidores MCP habilitados, el sistema se ralentiza

No te preocupes, todos estos problemas tienen soluciones claras. Esta lección te ayuda a solucionar sistemáticamente los problemas de conexión MCP.

---

## Problema común 1: Clave API no configurada o inválida

### Síntomas

Cuando intentas usar servidores MCP como GitHub o Firecrawl, Claude Code muestra:

```
Failed to execute tool: Missing GITHUB_PERSONAL_ACCESS_TOKEN
```

O

```
Failed to connect to MCP server: Authentication failed
```

### Causa

Los marcadores de posición `YOUR_*_HERE` en el archivo de configuración MCP no han sido reemplazados por las claves API reales.

### Solución

**Paso 1: Verificar el archivo de configuración**

Abre `~/.claude.json` y encuentra la configuración del servidor MCP correspondiente:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"  // ← Verificar aquí
      },
      "description": "GitHub operations - PRs, issues, repos"
    }
  }
}
```

**Paso 2: Reemplazar el marcador de posición**

Reemplaza `YOUR_GITHUB_PAT_HERE` con tu clave API real:

```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxx"
  }
}
```

**Paso 3: Obtener claves para servidores MCP comunes**

| Servidor MCP | Nombre de variable de entorno | Ubicación de obtención |
| --- | --- | --- |
| GitHub | `GITHUB_PERSONAL_ACCESS_TOKEN` | GitHub Settings → Developer Settings → Personal access tokens |
| Firecrawl | `FIRECRAWL_API_KEY` | Firecrawl Dashboard → API Keys |
| Supabase | Referencia del proyecto | Supabase Dashboard → Settings → API |

**Deberías ver**: Después de reiniciar Claude Code, las herramientas relacionadas funcionan correctamente.

### Advertencias

::: danger Aviso de seguridad
No subas archivos de configuración con claves API reales a repositorios Git. Asegúrate de que `~/.claude.json` esté en `.gitignore`.
:::

---

## Problema común 2: Ventana de contexto demasiado pequeña

### Síntomas

- La lista de herramientas disponibles se vuelve muy corta
- Claude muestra "Context window exceeded"
- La velocidad de respuesta disminuye notablemente

### Causa

Se han habilitado demasiados servidores MCP, ocupando la ventana de contexto. Según el README del proyecto, **una ventana de contexto de 200k puede reducirse a 70k por habilitar demasiados MCP**.

### Solución

**Paso 1: Verificar el número de MCP habilitados**

Revisa la sección `mcpServers` en `~/.claude.json` y cuenta los servidores habilitados.

**Paso 2: Usar `disabledMcpServers` para deshabilitar servidores no necesarios**

En la configuración a nivel de proyecto (`~/.claude/settings.json` o `.claude/settings.json` del proyecto), añade:

```json
{
  "disabledMcpServers": [
    "railway",
    "cloudflare-docs",
    "cloudflare-workers-builds",
    "magic",
    "filesystem"
  ]
}
```

**Paso 3: Seguir las mejores prácticas**

Según las recomendaciones del README:

- Configura 20-30 servidores MCP (definidos en el archivo de configuración)
- Habilita menos de 10 servidores MCP por proyecto
- Mantén menos de 80 herramientas activas

**Deberías ver**: La lista de herramientas vuelve a su longitud normal y la velocidad de respuesta mejora.

### Advertencias

::: tip Consejo de experiencia
Se recomienda habilitar diferentes combinaciones de MCP según el tipo de proyecto. Por ejemplo:
- Proyectos Web: GitHub, Firecrawl, Memory, Context7
- Proyectos de datos: Supabase, ClickHouse, Sequential-thinking
:::

---

## Problema común 3: Error de configuración del tipo de servidor

### Síntomas

```
Failed to start MCP server: Command not found
```

O

```
Failed to connect: Invalid server type
```

### Causa

Se confundieron los dos tipos de servidores MCP: `npx` y `http`.

### Solución

**Paso 1: Confirmar el tipo de servidor**

Revisa `mcp-configs/mcp-servers.json` para distinguir los dos tipos:

**Tipo npx** (requiere `command` y `args`):
```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
    }
  }
}
```

**Tipo http** (requiere `url`):
```json
{
  "vercel": {
    "type": "http",
    "url": "https://mcp.vercel.com"
  }
}
```

**Paso 2: Corregir la configuración**

| Servidor MCP | Tipo correcto | Configuración correcta |
| --- | --- | --- |
| GitHub | npx | `command: "npx"`, `args: ["-y", "@modelcontextprotocol/server-github"]` |
| Vercel | http | `type: "http"`, `url: "https://mcp.vercel.com"` |
| Cloudflare Docs | http | `type: "http"`, `url: "https://docs.mcp.cloudflare.com/mcp"` |
| Memory | npx | `command: "npx"`, `args: ["-y", "@modelcontextprotocol/server-memory"]` |

**Deberías ver**: Los servidores MCP inician correctamente después de reiniciar.

---

## Problema común 4: Error de configuración de ruta en Filesystem MCP

### Síntomas

- La herramienta Filesystem no puede acceder a ningún archivo
- Muestra "Path not accessible" o "Permission denied"

### Causa

Los parámetros de ruta del Filesystem MCP no han sido reemplazados por la ruta real del proyecto.

### Solución

**Paso 1: Verificar la configuración**

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/your/projects"],
    "description": "Filesystem operations (set your path)"
  }
}
```

**Paso 2: Reemplazar con la ruta real**

Reemplaza la ruta según tu sistema operativo:

**macOS/Linux**:
```json
{
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/yourname/projects"]
}
```

**Windows**:
```json
{
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:\\Users\\yourname\\projects"]
}
```

**Paso 3: Verificar permisos**

Asegúrate de tener permisos de lectura y escritura en la ruta configurada.

**Deberías ver**: La herramienta Filesystem puede acceder y operar archivos en la ruta especificada.

### Advertencias

::: warning Consideraciones
- No uses el símbolo `~`, debes usar la ruta completa
- Las barras invertidas en rutas de Windows necesitan escape como `\\`
- Asegúrate de que la ruta no tenga separadores finales多余的
:::

---

## Problema común 5: Referencia de proyecto Supabase no configurada

### Síntomas

La conexión Supabase MCP falla, mostrando "Missing project reference".

### Causa

El parámetro `--project-ref` del Supabase MCP no está configurado.

### Solución

**Paso 1: Obtener la referencia del proyecto**

En el Panel de Supabase:
1. Entra en la configuración del proyecto
2. Encuentra la sección "Project Reference" o "API"
3. Copia el ID del proyecto (formato similar a `xxxxxxxxxxxxxxxx`)

**Paso 2: Actualizar la configuración**

```json
{
  "supabase": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref=your-project-ref-here"],
    "description": "Supabase database operations"
  }
}
```

**Deberías ver**: Las herramientas de Supabase pueden consultar la base de datos correctamente.

---

## Problema común 6: Comando npx no encontrado

### Síntomas

```
Failed to start MCP server: npx: command not found
```

### Causa

Node.js no está instalado o npx no está en el PATH del sistema.

### Solución

**Paso 1: Verificar la versión de Node.js**

```bash
node --version
```

**Paso 2: Instalar Node.js (si falta)**

Visita [nodejs.org](https://nodejs.org/) y descarga la última versión LTS.

**Paso 3: Verificar npx**

```bash
npx --version
```

**Deberías ver**: La versión de npx se muestra correctamente.

---

## Diagrama de solución de problemas

Cuando tengas problemas con MCP, sigue este orden de solución:

```
1. Verificar si la clave API está configurada
    ↓ (configurada)
2. Verificar si el número de MCP habilitados es < 10
    ↓ (número normal)
3. Verificar el tipo de servidor (npx vs http)
    ↓ (tipo correcto)
4. Verificar parámetros de ruta (Filesystem, Supabase)
    ↓ (ruta correcta)
5. Verificar si Node.js y npx están disponibles
    ↓ (disponible)
¡Problema resuelto!
```

---

## Resumen de esta lección

La mayoría de los problemas de conexión MCP están relacionados con la configuración, recuerda estos puntos clave:

- ✅ **Claves API**: Reemplaza todos los marcadores `YOUR_*_HERE`
- ✅ **Gestión del contexto**: Habilita < 10 MCP, usa `disabledMcpServers` para deshabilitar los no necesarios
- ✅ **Tipo de servidor**: Distingue entre tipos npx y http
- ✅ **Configuración de rutas**: Filesystem y Supabase necesitan rutas/referencias específicas
- ✅ **Dependencias del entorno**: Asegúrate de que Node.js y npx estén disponibles

Si el problema persiste, verifica si hay conflictos en `~/.claude/settings.json` y la configuración a nivel de proyecto.

---

## Vista previa de la próxima lección

> En la próxima lección aprenderemos **[Solución de problemas de invocación de Agent](../troubleshooting-agents/)**.
>
> Aprenderás:
> - Métodos de solución para Agent no cargado y errores de configuración
> - Estrategias para resolver permisos de herramientas insuficientes
> - Diagnóstico de tiempo de espera de Agent y salida inesperada

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Tiempo de actualización: 2026-01-25

| Función | Ruta del archivo | Línea |
| --- | --- | --- |
| Archivo de configuración MCP | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-91 |
| Advertencia de ventana de contexto | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 67-75 |

**Configuraciones clave**:
- `mcpServers.mcpServers.*.command`: Comando de inicio para servidores tipo npx
- `mcpServers.mcpServers.*.args`: Argumentos de inicio
- `mcpServers.mcpServers.*.env`: Variables de entorno (claves API)
- `mcpServers.mcpServers.*.type`: Tipo de servidor ("npx" o "http")
- `mcpServers.mcpServers.*.url`: URL para servidores tipo http

**Notas importantes**:
- `mcpServers._comments.env_vars`: Reemplazar marcadores `YOUR_*_HERE`
- `mcpServers._comments.disabling`: Usar `disabledMcpServers` para deshabilitar servidores
- `mcpServers._comments.context_warning`: Habilitar < 10 MCP para preservar la ventana de contexto

</details>
