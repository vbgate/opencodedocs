---
title: "Configuración MCP: Integración de servicios externos | Everything Claude Code"
sidebarTitle: "Conectar servicios externos"
subtitle: "Configuración de servidores MCP: Amplía las capacidades de integración de Claude Code"
description: "Aprende a configurar servidores MCP. Selecciona entre 15 servidores preconfigurados, configura API Keys y variables de entorno, y optimiza el uso de la ventana de contexto."
tags:
  - "mcp"
  - "configuración"
  - "integración"
prerequisite:
  - "start-installation"
order: 40
---
# Configuración de servidores MCP: Amplía las capacidades de integración de Claude Code

## Lo que aprenderás

- Entender qué es MCP y cómo amplía las capacidades de Claude Code
- Seleccionar los servidores MCP adecuados para tu proyecto entre los 15 preconfigurados
- Configurar correctamente API Keys y variables de entorno
- Optimizar el uso de MCP para evitar que la ventana de contexto se sature

## Tu situación actual

Claude Code por defecto solo tiene capacidades de operación de archivos y ejecución de comandos, pero podrías necesitar:

- Consultar PRs e Issues de GitHub
- Extraer contenido de páginas web
- Operar bases de datos de Supabase
- Consultar documentación en tiempo real
- Persistir memoria entre sesiones

Si manejas estas tareas manualmente, necesitas cambiar constantemente entre herramientas, copiar y pegar, lo cual es muy ineficiente. Los servidores MCP (Model Context Protocol) pueden ayudarte a automatizar estas integraciones con servicios externos.

## Cuándo usar esta técnica

**Situaciones adecuadas para usar servidores MCP**:
- Tu proyecto involucra servicios de terceros como GitHub, Vercel, Supabase
- Necesitas consultar documentación en tiempo real (como Cloudflare, ClickHouse)
- Necesitas mantener estado o memoria entre sesiones
- Necesitas extracción de páginas web o generación de componentes UI

**Situaciones donde no necesitas MCP**:
- Solo trabajas con operaciones de archivos locales
- Desarrollo frontend puro, sin integración de servicios externos
- Aplicaciones CRUD simples con pocas operaciones de base de datos

## 🎒 Preparativos previos

Antes de comenzar la configuración, asegúrate de:

::: warning Verificación previa

- ✅ Haber completado la [instalación del plugin](../installation/)
- ✅ Estar familiarizado con la sintaxis básica de configuración JSON
- ✅ Tener las API Keys de los servicios que necesitas integrar (GitHub PAT, Firecrawl API Key, etc.)
- ✅ Conocer la ubicación del archivo de configuración `~/.claude.json`

:::

## Conceptos clave

### ¿Qué es MCP?

**MCP (Model Context Protocol)** es el protocolo que Claude Code usa para conectarse con servicios externos. Permite que la IA acceda a recursos externos como GitHub, bases de datos, consultas de documentación, funcionando como una extensión de capacidades.

**Cómo funciona**:

```
Claude Code ←→ MCP Server ←→ External Service
   (local)      (middleware)     (GitHub/Supabase/...)
```

### Estructura de configuración MCP

Cada configuración de servidor MCP contiene:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",          // Comando de inicio
      "args": ["-y", "package"],  // Argumentos del comando
      "env": {                   // Variables de entorno
        "API_KEY": "YOUR_KEY"
      },
      "description": "Descripción de la funcionalidad"   // Descripción
    }
  }
}
```

**Tipos**:
- **Tipo npx**: Ejecuta usando paquetes npm (como GitHub, Firecrawl)
- **Tipo http**: Conecta a endpoints HTTP (como Vercel, Cloudflare)

### Gestión de la ventana de contexto (¡Importante!)

::: warning Advertencia sobre el contexto

Cada servidor MCP habilitado consume espacio de la ventana de contexto. Habilitar demasiados puede reducir el contexto de 200K a 70K.

**Regla de oro**:
- Configura 20-30 servidores MCP (todos disponibles)
- Habilita < 10 por proyecto
- Mantén el total de herramientas activas < 80

Usa `disabledMcpServers` en la configuración del proyecto para deshabilitar los MCP que no necesites.

:::

## Instrucciones paso a paso

### Paso 1: Ver los servidores MCP disponibles

Everything Claude Code proporciona **15 servidores MCP preconfigurados**:

| Servidor MCP | Tipo | Requiere clave | Uso |
| --- | --- | --- | --- |
| **github** | npx | ✅ GitHub PAT | Operaciones de PRs, Issues, Repos |
| **firecrawl** | npx | ✅ API Key | Extracción y rastreo web |
| **supabase** | npx | ✅ Project Ref | Operaciones de base de datos |
| **memory** | npx | ❌ | Memoria persistente entre sesiones |
| **sequential-thinking** | npx | ❌ | Mejora de razonamiento en cadena |
| **vercel** | http | ❌ | Despliegue y gestión de proyectos |
| **railway** | npx | ❌ | Despliegue en Railway |
| **cloudflare-docs** | http | ❌ | Búsqueda de documentación |
| **cloudflare-workers-builds** | http | ❌ | Builds de Workers |
| **cloudflare-workers-bindings** | http | ❌ | Bindings de Workers |
| **cloudflare-observability** | http | ❌ | Logs y monitoreo |
| **clickhouse** | http | ❌ | Consultas analíticas |
| **context7** | npx | ❌ | Búsqueda de documentación en tiempo real |
| **magic** | npx | ❌ | Generación de componentes UI |
| **filesystem** | npx | ❌ (requiere ruta) | Operaciones del sistema de archivos |

**Deberías ver**: La lista completa de 15 servidores MCP, cubriendo escenarios comunes como GitHub, despliegue, bases de datos, consulta de documentación.

---

### Paso 2: Copiar la configuración MCP a Claude Code

Copia la configuración desde el directorio fuente:

```bash
# Copiar plantilla de configuración MCP
cp source/affaan-m/everything-claude-code/mcp-configs/mcp-servers.json ~/.claude/mcp-servers-backup.json
```

**Por qué**: Respalda la configuración original para referencia y comparación posterior.

---

### Paso 3: Seleccionar los servidores MCP necesarios

Según las necesidades de tu proyecto, selecciona los servidores MCP que necesitas.

**Escenarios de ejemplo**:

| Tipo de proyecto | MCP recomendados |
| --- | --- |
| **Aplicación full-stack** (GitHub + Supabase + Vercel) | github, supabase, vercel, memory, context7 |
| **Proyecto frontend** (Vercel + consulta de docs) | vercel, cloudflare-docs, context7, magic |
| **Proyecto de datos** (ClickHouse + análisis) | clickhouse, sequential-thinking, memory |
| **Desarrollo general** | github, filesystem, memory, context7 |

**Deberías ver**: Una relación clara entre tipos de proyecto y servidores MCP correspondientes.

---

### Paso 4: Editar el archivo de configuración `~/.claude.json`

Abre tu archivo de configuración de Claude Code:

::: code-group

```bash [macOS/Linux]
vim ~/.claude.json
```

```powershell [Windows]
notepad $env:USERPROFILE\.claude.json
```

:::

Agrega la sección `mcpServers` en `~/.claude.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
      },
      "description": "GitHub operations - PRs, issues, repos"
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "description": "Persistent memory across sessions"
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"],
      "description": "Live documentation lookup"
    }
  }
}
```

**Por qué**: Esta es la configuración principal que indica a Claude Code qué servidores MCP iniciar.

**Deberías ver**: El objeto `mcpServers` conteniendo la configuración de los servidores MCP que seleccionaste.

---

### Paso 5: Reemplazar los marcadores de API Keys

Para los servidores MCP que requieren API Keys, reemplaza los marcadores `YOUR_*_HERE`:

**Ejemplo con GitHub MCP**:

1. Genera un GitHub Personal Access Token:
   - Visita https://github.com/settings/tokens
   - Crea un nuevo Token, marca el permiso `repo`

2. Reemplaza el marcador en la configuración:

```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  // Reemplaza con tu Token real
  }
}
```

**Otros MCP que requieren claves**:

| MCP | Nombre de la clave | Dónde obtenerla |
| --- | --- | --- |
| **firecrawl** | FIRECRAWL_API_KEY | https://www.firecrawl.dev/ |
| **supabase** | --project-ref | https://supabase.com/dashboard |

**Por qué**: Sin las claves reales, los servidores MCP no pueden conectarse a los servicios externos.

**Deberías ver**: Todos los marcadores `YOUR_*_HERE` reemplazados por claves reales.

---

### Paso 6: Configurar deshabilitación de MCP a nivel de proyecto (recomendado)

Para evitar que todos los proyectos habiliten todos los MCP, crea `.claude/config.json` en el directorio raíz del proyecto:

```json
{
  "disabledMcpServers": [
    "supabase",      // Deshabilitar MCP no necesarios
    "railway",
    "firecrawl"
  ]
}
```

**Por qué**: Esto permite controlar de forma flexible qué MCP están activos a nivel de proyecto, evitando que la ventana de contexto se sature.

**Deberías ver**: El archivo `.claude/config.json` conteniendo el array `disabledMcpServers`.

---

### Paso 7: Reiniciar Claude Code

Reinicia Claude Code para que la configuración surta efecto:

```bash
# Detener Claude Code (si está ejecutándose)
# Luego reiniciar
claude
```

**Por qué**: La configuración MCP se carga al inicio, necesita reiniciarse para aplicar los cambios.

**Deberías ver**: Al iniciar Claude Code, los servidores MCP se cargan automáticamente.

## Punto de verificación ✅

Verifica que la configuración MCP sea exitosa:

1. **Verificar estado de carga de MCP**:

En Claude Code, ingresa:

```bash
/tool list
```

**Resultado esperado**: Ver la lista de servidores MCP y herramientas cargadas.

2. **Probar funcionalidad MCP**:

Si habilitaste GitHub MCP, prueba una consulta:

```bash
# Consultar GitHub Issues
@mcp list issues
```

**Resultado esperado**: Devuelve la lista de Issues de tu repositorio.

3. **Verificar ventana de contexto**:

Revisa la cantidad de herramientas en `~/.claude.json`:

```bash
jq '.mcpServers | length' ~/.claude.json
```

**Resultado esperado**: Número de servidores MCP habilitados < 10.

::: tip Consejos de depuración

Si MCP no se carga correctamente, revisa los archivos de log de Claude Code:
- macOS/Linux: `~/.claude/logs/`
- Windows: `%USERPROFILE%\.claude\logs\`

:::

## Solución de problemas

### Problema 1: Demasiados MCP habilitados causan contexto insuficiente

**Síntoma**: Al iniciar la conversación, la ventana de contexto es solo 70K en lugar de 200K.

**Causa**: Cada herramienta habilitada por MCP consume espacio de la ventana de contexto.

**Solución**:
1. Verifica la cantidad de MCP habilitados (`~/.claude.json`)
2. Usa `disabledMcpServers` a nivel de proyecto para deshabilitar MCP innecesarios
3. Mantén el total de herramientas activas < 80

---

### Problema 2: API Key no configurada correctamente

**Síntoma**: Al llamar funcionalidades MCP, aparece error de permisos o fallo de conexión.

**Causa**: Los marcadores `YOUR_*_HERE` no fueron reemplazados.

**Solución**:
1. Verifica el campo `env` en `~/.claude.json`
2. Confirma que todos los marcadores fueron reemplazados por claves reales
3. Verifica que las claves tengan permisos suficientes (por ejemplo, GitHub Token necesita permiso `repo`)

---

### Problema 3: Error de ruta en Filesystem MCP

**Síntoma**: Filesystem MCP no puede acceder al directorio especificado.

**Causa**: La ruta en `args` no fue reemplazada por la ruta real.

**Solución**:
```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/tunombre/projects"],  // Reemplaza con tu ruta de proyectos
    "description": "Filesystem operations"
  }
}
```

---

### Problema 4: Configuración a nivel de proyecto no surte efecto

**Síntoma**: El `disabledMcpServers` en el directorio raíz del proyecto no deshabilita los MCP.

**Causa**: Ruta o formato incorrecto de `.claude/config.json`.

**Solución**:
1. Confirma que el archivo está en el directorio raíz del proyecto: `.claude/config.json`
2. Verifica que el formato JSON sea correcto (usa `jq .` para validar)
3. Confirma que `disabledMcpServers` es un array de strings

## Resumen de la lección

En esta lección aprendimos cómo configurar servidores MCP:

**Puntos clave**:
- MCP amplía las capacidades de integración de servicios externos de Claude Code
- Selecciona los adecuados entre los 15 MCP preconfigurados (recomendado < 10)
- Reemplaza los marcadores `YOUR_*_HERE` por API Keys reales
- Usa `disabledMcpServers` a nivel de proyecto para controlar la cantidad habilitada
- Mantén el total de herramientas activas < 80 para evitar saturar la ventana de contexto

**Siguiente paso**: Ya tienes los servidores MCP configurados, en la próxima lección aprenderás a usar los Commands principales.

## Próxima lección

> En la próxima lección aprenderemos **[Guía completa de Commands](../../platforms/commands-overview/)**.
>
> Aprenderás:
> - Las funciones y casos de uso de los 14 comandos de barra
> - Cómo el comando `/plan` crea planes de implementación
> - Cómo el comando `/tdd` ejecuta desarrollo guiado por pruebas
> - Cómo activar flujos de trabajo complejos rápidamente mediante comandos

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-25

| Funcionalidad | Ruta del archivo | Línea |
| --- | --- | --- |
| Plantilla de configuración MCP | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92 |
| Notas importantes del README | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 348-369 |

**Configuración clave**:
- 15 servidores MCP (GitHub, Firecrawl, Supabase, Memory, Sequential-thinking, Vercel, Railway, serie Cloudflare, ClickHouse, Context7, Magic, Filesystem)
- Soporta dos tipos: npx (línea de comandos) y http (conexión a endpoints)
- Usa configuración `disabledMcpServers` a nivel de proyecto para controlar la cantidad habilitada

**Reglas clave**:
- Configura 20-30 servidores MCP
- Habilita < 10 por proyecto
- Total de herramientas activas < 80
- Riesgo de reducción de ventana de contexto de 200K a 70K

</details>
