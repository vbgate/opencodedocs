---
title: "Guía completa de herramientas de ejecución de comandos y aprobaciones: mecanismos de seguridad, configuración y solución de problemas | Tutorial de Clawdbot"
sidebarTitle: "Ejecutar comandos de forma segura con IA"
subtitle: "Herramientas de ejecución de comandos y aprobaciones"
description: "Aprende a configurar y usar la herramienta exec de Clawdbot para ejecutar comandos de Shell, entender los tres modos de ejecución (sandbox/gateway/node), los mecanismos de seguridad de aprobaciones, la configuración de lista de permitidos y el flujo de aprobaciones. Este tutorial incluye ejemplos prácticos de configuración, comandos CLI y solución de problemas para ayudarte a ampliar de forma segura las capacidades de tu asistente de IA."
tags:
  - "advanced"
  - "tools"
  - "exec"
  - "security"
  - "approvals"
prerequisite:
  - "start-gateway-startup"
order: 220
---

# Herramientas de ejecución de comandos y aprobaciones

## Lo que lograrás

- Configurar la herramienta exec para ejecutarse en tres modos (sandbox/gateway/node)
- Entender y configurar los mecanismos de seguridad de aprobaciones (deny/allowlist/full)
- Gestionar la lista de permitidos (Allowlist) y bins seguros
- Aprobar solicitudes exec a través de UI o canales de chat
- Solucionar problemas comunes y errores de seguridad de la herramienta exec

## Tu dilema actual

La herramienta exec permite que los asistentes de IA ejecuten comandos de Shell, lo cual es potente pero también peligroso:

- ¿La IA eliminará archivos importantes en mi sistema?
- ¿Cómo limitar la IA para que solo ejecute comandos seguros?
- ¿Cuáles son las diferencias entre los distintos modos de ejecución?
- ¿Cómo funciona el flujo de aprobaciones?
- ¿Cómo debería configurarse la lista de permitidos?

## Cuándo usar este enfoque

- Cuando necesites que la IA realice operaciones del sistema (gestión de archivos, compilación de código)
- Cuando quieras que la IA llame scripts personalizados o herramientas
- Cuando necesites un control granular de los permisos de ejecución de la IA
- Cuando necesites permitir comandos específicos de forma segura

## 🎒 Preparativos previos

::: warning Requisitos previos
Este tutorial asume que has completado [Iniciar Gateway](../../start/gateway-startup/) y que el demonio de Gateway está en ejecución.
:::

- Asegúrate de que Node ≥22 esté instalado
- El demonio de Gateway está en ejecución
- Conocimiento básico de comandos de Shell y el sistema de archivos Linux/Unix

## Conceptos clave

### Las tres capas de seguridad de la herramienta exec

La herramienta exec utiliza un mecanismo de seguridad de tres capas para controlar los permisos de ejecución de la IA, desde el nivel de grano grueso al fino:

1. **Política de herramientas (Tool Policy)**：controla si se permite la herramienta `exec` en `tools.policy`
2. **Host de ejecución (Host)**：los comandos se ejecutan en tres entornos sandbox/gateway/node
3. **Mecanismo de aprobaciones (Approvals)**：en los modos gateway/node, se pueden aplicar más restricciones a través de allowlist y prompts de aprobación

::: info ¿Por qué se necesita protección multicapa?
La protección de una sola capa es fácil de eludir o configurar incorrectamente. La protección multicapa garantiza que si una capa falla, las otras capas puedan proporcionar protección.
:::

### Comparación de tres modos de ejecución

| Modo de ejecución | Ubicación de ejecución | Nivel de seguridad | Escenarios típicos | ¿Requiere aprobación? |
|------------------|----------------------|-------------------|-------------------|----------------------|
| **sandbox** | Dentro de contenedores (ej. Docker) | Alto | Entorno aislado, pruebas | No |
| **gateway** | La máquina donde se ejecuta el demonio Gateway | Medio | Desarrollo local, integración | Sí (allowlist + aprobación) |
| **node** | Nodo del dispositivo emparejado (macOS/iOS/Android) | Medio | Operaciones locales del dispositivo | Sí (allowlist + aprobación) |

**Diferencias clave**：
- El modo sandbox por defecto **no requiere aprobación** (pero puede estar limitado por Sandbox)
- Los modos gateway y node por defecto **requieren aprobación** (a menos que se configure como `full`)

## Sígueme

### Paso 1: Entender los parámetros de la herramienta exec

**Por qué**
Entender los parámetros de la herramienta exec es la base para la configuración de seguridad.

La herramienta exec admite los siguientes parámetros：

```json
{
  "tool": "exec",
  "command": "ls -la",
  "workdir": "/path/to/dir",
  "env": { "NODE_ENV": "production" },
  "yieldMs": 10000,
  "background": false,
  "timeout": 1800,
  "pty": false,
  "host": "sandbox",
  "security": "allowlist",
  "ask": "on-miss",
  "node": "mac-1"
}
```

**Descripción de parámetros**：

| Parámetro | Tipo | Valor predeterminado | Descripción |
|-----------|------|-------------------|-------------|
| `command` | string | Requerido | Comando de Shell a ejecutar |
| `workdir` | string | Directorio de trabajo actual | Directorio de ejecución |
| `env` | object | Heredar entorno | Sobrescritura de variables de entorno |
| `yieldMs` | number | 10000 | Cambiar automáticamente a segundo plano después del tiempo de espera (milisegundos) |
| `background` | boolean | false | Ejecutar inmediatamente en segundo plano |
| `timeout` | number | 1800 | Tiempo de espera de ejecución (segundos) |
| `pty` | boolean | false | Ejecutar en una pseudo-terminal (soporte TTY) |
| `host` | string | sandbox | Host de ejecución：`sandbox` \| `gateway` \| `node` |
| `security` | string | deny/allowlist | Política de seguridad：`deny` \| `allowlist` \| `full` |
| `ask` | string | on-miss | Política de aprobación：`off` \| `on-miss` \| `always` |
| `node` | string | - | ID o nombre del nodo de destino en modo node |

**Lo que deberías ver**：La lista de parámetros explica claramente los métodos de control para cada modo de ejecución.

### Paso 2: Configurar el modo de ejecución predeterminado

**Por qué**
Establecer valores predeterminados globales a través de archivos de configuración evita especificar parámetros en cada llamada exec.

Edita `~/.clawdbot/clawdbot.json`：

```json
{
  "tools": {
    "exec": {
      "host": "sandbox",
      "security": "allowlist",
      "ask": "on-miss",
      "node": "mac-1",
      "notifyOnExit": true,
      "approvalRunningNoticeMs": 10000,
      "pathPrepend": ["~/bin", "/opt/homebrew/bin"],
      "safeBins": ["jq", "grep", "cut"]
    }
  }
}
```

**Descripción de elementos de configuración**：

| Elemento de configuración | Tipo | Valor predeterminado | Descripción |
|---------------------------|------|-------------------|-------------|
| `host` | string | sandbox | Host de ejecución predeterminado |
| `security` | string | deny (sandbox) / allowlist (gateway, node) | Política de seguridad predeterminada |
| `ask` | string | on-miss | Política de aprobación predeterminada |
| `node` | string | - | Nodo predeterminado en modo node |
| `notifyOnExit` | boolean | true | Enviar evento del sistema cuando las tareas en segundo plano terminen |
| `approvalRunningNoticeMs` | number | 10000 | Enviar notificación "en ejecución" después del tiempo de espera (0 para desactivar) |
| `pathPrepend` | string[] | - | Lista de directorios para anteponer a PATH |
| `safeBins` | string[] | [Lista predeterminada] | Lista de bins seguros (solo operaciones stdin) |

**Lo que deberías ver**：Después de guardar la configuración, la herramienta exec usará estos valores predeterminados.

### Paso 3: Usar anulación de sesión `/exec`

**Por qué**
La anulación de sesión te permite ajustar temporalmente los parámetros de ejecución sin editar el archivo de configuración.

Envía en el chat：

```
/exec host=gateway security=allowlist ask=on-miss node=mac-1
```

Ver los valores de anulación actuales：

```
/exec
```

**Lo que deberías ver**：Configuración de parámetros exec de la sesión actual.

### Paso 4: Configurar la lista de permitidos (Allowlist)

**Por qué**
allowlist es el mecanismo de seguridad central en los modos gateway/node, permitiendo solo la ejecución de comandos específicos.

#### Editar allowlist

**Editar a través de UI**：

1. Abre la UI de Control
2. Ve a la pestaña **Nodes**
3. Encuentra la tarjeta **Exec approvals**
4. Selecciona el objetivo (Gateway o Node)
5. Selecciona el Agente (ej. `main`)
6. Haz clic en **Add pattern** para agregar patrón de comando
7. Haz clic en **Save** para guardar

**Editar a través de CLI**：

```bash
clawdbot approvals
```

**Editar a través de archivo JSON**：

Edita `~/.clawdbot/exec-approvals.json`：

```json
{
  "version": 1,
  "defaults": {
    "security": "deny",
    "ask": "on-miss",
    "askFallback": "deny",
    "autoAllowSkills": false
  },
  "agents": {
    "main": {
      "security": "allowlist",
      "ask": "on-miss",
      "askFallback": "deny",
      "autoAllowSkills": true,
      "allowlist": [
        {
          "id": "B0C8C0B3-2C2D-4F8A-9A3C-5A4B3C2D1E0F",
          "pattern": "~/Projects/**/bin/*",
          "lastUsedAt": 1737150000000,
          "lastUsedCommand": "rg -n TODO",
          "lastResolvedPath": "/Users/user/Projects/bin/rg"
        },
        {
          "id": "C1D9D1C4-3D3E-5F9B-0B4D-6B5C4D3E2F1G",
          "pattern": "/opt/homebrew/bin/rg",
          "lastUsedAt": 1737150000000,
          "lastUsedCommand": "rg test",
          "lastResolvedPath": "/opt/homebrew/bin/rg"
        }
      ]
    }
  }
}
```

**Descripción del modo Allowlist**：

allowlist utiliza **coincidencia de patrones glob** (sin distinción de mayúsculas/minúsculas)：

| Patrón | Coincide | Descripción |
|--------|---------|-------------|
| `~/Projects/**/bin/*` | `/Users/user/Projects/any/bin/rg` | Coincide todos los subdirectorios |
| `~/.local/bin/*` | `/Users/user/.local/bin/jq` | Coincide bin local |
| `/opt/homebrew/bin/rg` | `/opt/homebrew/bin/rg` | Coincidencia de ruta absoluta |

::: warning Reglas importantes
- **Solo coincide la ruta del binario resuelto**, no admite coincidencia de nombre base (ej. `rg`)
- Las conexiones de Shell (`&&`, `||`, `;`) requieren que cada segmento cumpla con allowlist
- Las redirecciones (`>`, `<`) no son compatibles en modo allowlist
:::

**Lo que deberías ver**：Después de configurar allowlist, solo se pueden ejecutar comandos que coincidan.

### Paso 5: Entender bins seguros (Safe Bins)

**Por qué**
safe bins es un conjunto de binarios seguros que solo admiten operaciones stdin, los cuales pueden ejecutarse en modo allowlist sin allowlist explícito.

**Bins seguros predeterminados**：

`jq`, `grep`, `cut`, `sort`, `uniq`, `head`, `tail`, `tr`, `wc`

**Características de seguridad de bins seguros**：

- Rechaza argumentos de archivo de posición
- Rechaza banderas tipo ruta
- Solo puede operar en el flujo pasado (stdin)

**Configurar bins seguros personalizados**：

```json
{
  "tools": {
    "exec": {
      "safeBins": ["jq", "grep", "my-safe-tool"]
    }
  }
}
```

**Lo que deberías ver**：Los comandos de bins seguros pueden ejecutarse directamente en modo allowlist.

### Paso 6: Aprobar solicitudes exec a través de canales de chat

**Por qué**
Cuando la UI no está disponible, puedes aprobar solicitudes exec a través de cualquier canal de chat (WhatsApp, Telegram, Slack, etc.).

#### Habilitar reenvío de aprobaciones

Edita `~/.clawdbot/clawdbot.json`：

```json
{
  "approvals": {
    "exec": {
      "enabled": true,
      "mode": "session",
      "agentFilter": ["main"],
      "sessionFilter": ["discord"],
      "targets": [
        { "channel": "slack", "to": "U12345678" },
        { "channel": "telegram", "to": "123456789" }
      ]
    }
  }
}
```

**Descripción de elementos de configuración**：

| Elemento de configuración | Descripción |
|---------------------------|-------------|
| `enabled` | Si habilitar el reenvío de aprobaciones exec |
| `mode` | `"session"` \| `"targets"` \| `"both"` - modo de objetivos de aprobación |
| `agentFilter` | Solo procesar solicitudes de aprobación de agentes específicos |
| `sessionFilter` | Filtro de sesión (substring o regex) |
| `targets` | Lista de canales de destino (`channel` + `to`) |

#### Aprobar solicitudes

Cuando la herramienta exec necesita aprobación, recibirás un mensaje con la siguiente información：

```
Exec approval request (id: abc-123)
Command: ls -la
CWD: /home/user
Agent: main
Resolved: /usr/bin/ls
Host: gateway
Security: allowlist
```

**Opciones de aprobación**：

```
/approve abc-123 allow-once     # Permitir una vez
/approve abc-123 allow-always    # Permitir siempre (agregar a allowlist)
/approve abc-123 deny           # Denegar
```

**Lo que deberías ver**：Después de aprobar, el comando se ejecuta o es rechazado.

## Punto de control ✅

- [ ] Entiendes las diferencias entre los tres modos de ejecución (sandbox/gateway/node)
- [ ] Has configurado los parámetros predeterminados globales exec
- [ ] Puedes usar anulación de sesión del comando `/exec`
- [ ] Has configurado allowlist (al menos un patrón)
- [ ] Entiendes las características de seguridad de safe bins
- [ ] Puedes aprobar solicitudes exec a través de canales de chat

## Problemas comunes

### Errores comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `Command not allowed by exec policy` | `security=deny` o allowlist no coincide | Revisa `tools.exec.security` y configuración allowlist |
| `Approval timeout` | UI no disponible, `askFallback=deny` | Establece `askFallback=allowlist` o habilita UI |
| `Pattern does not resolve to binary` | Uso de nombre base en modo allowlist | Usa ruta completa (ej. `/opt/homebrew/bin/rg`) |
| `Unsupported shell token` | Uso de `>` o `&&` en modo allowlist | Divide comandos o usa `security=full` |
| `Node not found` | Nodo no emparejado en modo node | Primero completa el emparejamiento de nodos |

### Conexiones y redirecciones de Shell

::: danger Advertencia
En modo `security=allowlist`, las siguientes características de Shell **no son compatibles**：
- Tuberías：`|` (pero `||` es compatible)
- Redirecciones：`>`, `<`, `>>`
- Sustitución de comandos：`$()`, `` ` ` ``
- Segundo plano：`&`, `;`
:::

**Soluciones**：
- Usa `security=full` (con precaución)
- Dividir en múltiples llamadas exec
- Escribe scripts de wrapper y añade la ruta del script a allowlist

### Variables de entorno PATH

Los modos de ejecución manejan PATH de diferentes maneras：

| Modo de ejecución | Manejo de PATH | Descripción |
|------------------|---------------|-------------|
| `sandbox` | Hereda shell login, puede ser restablecido por `/etc/profile` | `pathPrepend` se aplica después de profile |
| `gateway` | Fusiona PATH del shell de login al entorno exec | El demonio mantiene PATH mínimo, pero exec hereda PATH del usuario |
| `node` | Solo usa sobrescrituras de variables de entorno pasadas | Los nodos macOS descartan sobrescrituras de `PATH`, los nodos headless admiten prepend |

**Lo que deberías ver**：La configuración correcta de PATH afecta la búsqueda de comandos.

## Resumen

La herramienta exec permite que los asistentes de IA ejecuten comandos de Shell de forma segura mediante un mecanismo de tres capas (política de herramientas, host de ejecución, aprobaciones)：

- **Modos de ejecución**：sandbox (aislamiento de contenedor), gateway (ejecución local), node (operaciones del dispositivo)
- **Políticas de seguridad**：deny (prohibición completa), allowlist (lista blanca), full (permiso completo)
- **Mecanismo de aprobaciones**：off (sin prompt), on-miss (prompt cuando no coincide), always (siempre prompt)
- **Lista de permitidos**：coincidencia de patrones glob de la ruta del binario resuelto
- **Bins seguros**：los binarios que solo hacen operaciones stdin están exentos de aprobación en modo allowlist

## Próximo lección

> En el próximo lección aprenderemos **[Herramientas de búsqueda y extracción web](../tools-web/)**
>
> Aprenderás：
> - Cómo usar la herramienta `web_search` para búsqueda en la web
> - Cómo usar la herramienta `web_fetch` para extraer contenido de páginas web
> - Cómo configurar proveedores de motores de búsqueda (Brave, Perplexity)
> - Cómo manejar resultados de búsqueda y errores de extracción web

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones del código fuente</strong></summary>

> Última actualización：2026-01-27

| Funcionalidad | Ruta de archivo | Número de línea |
|--------------|---------------|----------------|
| Definición de herramienta exec | [`src/agents/bash-tools.exec.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/bash-tools.exec.ts) | 1-500+ |
| Lógica de aprobación exec | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 1-1268 |
| Análisis de comandos de Shell | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 500-1100 |
| Coincidencia de Allowlist | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 507-521 |
| Validación de Safe bins | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 836-873 |
| Comunicación Socket de aprobaciones | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 1210-1267 |
| Ejecución de procesos | [`src/process/exec.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/process/exec.ts) | 1-125 |
| Schema de configuración de herramientas | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | - |

**Tipos clave**：
- `ExecHost`: `"sandbox" \| "gateway" \| "node"` - Tipo de host de ejecución
- `ExecSecurity`: `"deny" \| "allowlist" \| "full"` - Política de seguridad
- `ExecAsk`: `"off" \| "on-miss" \| "always"` - Política de aprobación
- `ExecAllowlistEntry`: Tipo de entrada de allowlist (contiene `pattern`, `lastUsedAt`, etc.)

**Constantes clave**：
- `DEFAULT_SECURITY = "deny"` - Política de seguridad predeterminada
- `DEFAULT_ASK = "on-miss"` - Política de aprobación predeterminada
- `DEFAULT_SAFE_BINS = ["jq", "grep", "cut", "sort", "uniq", "head", "tail", "tr", "wc"]` - Bins seguros predeterminados

**Funciones clave**：
- `resolveExecApprovals()`: Resuelve configuración exec-approvals.json
- `evaluateShellAllowlist()`: Evalúa si el comando de Shell cumple con allowlist
- `matchAllowlist()`: Verifica si la ruta del comando coincide con el patrón allowlist
- `isSafeBinUsage()`: Verifica si el comando es un uso de bin seguro
- `requestExecApprovalViaSocket()`: Solicita aprobación a través de socket Unix

</details>
