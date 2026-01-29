---
title: "Referencia completa de configuración de Clawdbot: Explicación detallada de todos los elementos de configuración | Tutorial de configuración"
sidebarTitle: "Controlar toda la configuración"
subtitle: "Referencia completa de configuración"
description: "Aprende el sistema completo de configuración de Clawdbot. Este documento de referencia explica en detalle todas las secciones de configuración, tipos de campos, valores predeterminados y ejemplos prácticos para ayudarte a personalizar y optimizar el comportamiento de Clawdbot. Incluye configuración de autenticación, configuración de modelos, opciones de canales, estrategias de herramientas, aislamiento de sandbox, gestión de sesiones, procesamiento de mensajes, tareas Cron, Hooks, Gateway, Tailscale, Skills, Plugins, Node Host, Canvas, Talk, transmisión, registro, actualizaciones, UI y más de 50 secciones principales de configuración, cubriendo todas las opciones desde básicas hasta avanzadas. Adecuado para consultar rápidamente todos los elementos de configuración disponibles, ubicar las configuraciones necesarias, mejorar la eficiencia de uso y lograr una configuración personalizada. Comprende el papel y el impacto de cada elemento de configuración, encuentra rápidamente las opciones necesarias y evita errores de configuración. Tanto los principiantes como los usuarios avanzados pueden encontrar rápidamente los elementos de configuración necesarios, mejorar la eficiencia del trabajo y resolver problemas de configuración. El documento de referencia de configuración te ayuda a comprender y dominar completamente el sistema de configuración de Clawdbot para lograr una personalización personalizada. Adecuado para consultas, depuración y configuración avanzada. Se recomienda a todos los usuarios que lean esta referencia de configuración para comprender el significado y el uso de cada elemento de configuración y aprovechar al máximo las potentes funciones de Clawdbot."
tags:
  - "Configuración"
  - "Referencia"
  - "Guía completa"
order: 340
---

# Referencia completa de configuración

Clawdbot lee un archivo de configuración JSON5 opcional (soporta comentarios y comas finales): `~/.clawdbot/clawdbot.json`

Si falta el archivo de configuración, Clawdbot usa valores predeterminados seguros (agente Pi integrado + sesión por remitente + espacio de trabajo `~/clawd`). Por lo general, solo necesitas configurar para:
- Restringir quién puede activar el bot (`channels.whatsapp.allowFrom`, `channels.telegram.allowFrom`, etc.)
- Controlar lista blanca de grupos + comportamiento de mención (`channels.whatsapp.groups`, `channels.telegram.groups`, `channels.discord.guilds`)
- Personalizar prefijos de mensajes (`messages`)
- Establecer espacio de trabajo del proxy (`agents.defaults.workspace` o `agents.list[].workspace`)
- Ajustar valores predeterminados del agente integrado (`agents.defaults`) y comportamiento de sesión (`session`)
- Establecer la identidad de cada agente (`agents.list[].identity`)

::: tip ¿Eres principiante?
Si es tu primera vez configurando, te recomendamos leer primero los tutoriales de [Inicio rápido](../../start/getting-started/) y [Asistente de configuración](../../start/onboarding-wizard/).

## Mecanismo de validación de configuración

Clawdbot solo acepta configuraciones que coincidan completamente con el Schema. Claves desconocidas, tipos incorrectos o valores inválidos harán que el Gateway **rechace iniciar** para garantizar la seguridad.

Cuando falla la validación:
- El Gateway no se iniciará
- Solo se permiten comandos de diagnóstico (por ejemplo: `clawdbot doctor`, `clawdbot logs`, `clawdbot health`, `clawdbot status`, `clawdbot service`, `clawdbot help`)
- Ejecuta `clawdbot doctor` para ver el problema exacto
- Ejecuta `clawdbot doctor --fix` (o `--yes`) para aplicar migraciones/reparaciones

::: warning Advertencia
Doctor no escribirá ningún cambio a menos que selecciones explícitamente `--fix`/`--yes`.

## Estructura del archivo de configuración

El archivo de configuración de Clawdbot es un objeto jerárquico que contiene las siguientes secciones de configuración principales:

```json5
{
  // Configuración central
  meta: {},
  env: {},
  wizard: {},
  diagnostics: {},
  logging: {},
  update: {},
  
  // Configuración de funciones
  browser: {},
  ui: {},
  auth: {},
  models: {},
  nodeHost: {},
  agents: {},
  tools: {},
  bindings: {},
  broadcast: {},
  audio: {},
  media: {},
  messages: {},
  commands: {},
  approvals: {},
  session: {},
  cron: {},
  hooks: {},
  web: {},
  channels: {},
  discovery: {},
  canvasHost: {},
  talk: {},
  gateway: {},
  skills: {},
  plugins: {}
}
```

## Configuración central

### `meta`

Metadatos del archivo de configuración (escrito automáticamente por el asistente CLI).

```json5
{
  meta: {
    lastTouchedVersion: "2026.1.24",
    lastTouchedAt: "2026-01-27T00:00:00.000Z"
  }
}
```

| Campo | Tipo | Obligatorio | Predeterminado | Descripción |
|------|------|-------------|---------------|-------------|
| `lastTouchedVersion` | string | - | Versión de Clawdbot que modificó por última vez esta configuración |
| `lastTouchedAt` | string | - | Hora de la última modificación de esta configuración (ISO 8601) |

### `env`

Configuración de variables de entorno e importación de entorno de shell.

```json5
{
  env: {
    shellEnv: {
      enabled: true,
      timeoutMs: 15000
    },
    vars: {
      OPENAI_API_KEY: "sk-...",
      ANTHROPIC_API_KEY: "sk-ant-..."
    },
    // Cualquier par clave-valor
    CUSTOM_VAR: "value"
  }
}
```

| Campo | Tipo | Obligatorio | Predeterminado | Descripción |
|------|------|-------------|---------------|-------------|
| `shellEnv.enabled` | boolean | `false` | Importar variables de entorno desde el shell de inicio de sesión (solo importa claves faltantes) |
| `shellEnv.timeoutMs` | number | `15000` | Tiempo de espera de importación de entorno de shell (milisegundos) |
| `vars` | object | - | Variables de entorno en línea (pares clave-valor) |

**Nota**: `vars` solo se aplica cuando falta la clave correspondiente en las variables de entorno del proceso. Nunca sobrescribe las variables de entorno existentes.

::: info Prioridad de variables de entorno
Variables de entorno del proceso > archivo `.env` > `~/.clawdbot/.env` > `env.vars` en el archivo de configuración

### `wizard`

Metadatos escritos por el asistente CLI (`onboard`, `configure`, `doctor`).

```json5
{
  wizard: {
    lastRunAt: "2026-01-01T00:00:00.000Z",
    lastRunVersion: "2026.1.4",
    lastRunCommit: "abc1234",
    lastRunCommand: "configure",
    lastRunMode: "local"
  }
}
```

| Campo | Tipo | Obligatorio | Predeterminado | Descripción |
|------|------|-------------|---------------|-------------|
| `lastRunAt` | string | - | Hora de la última ejecución del asistente |
| `lastRunVersion` | string | - | Versión de Clawdbot cuando se ejecutó por última vez el asistente |
| `lastRunCommit` | string | - | Hash del commit Git cuando se ejecutó por última vez el asistente |
| `lastRunCommand` | string | - | Último comando del asistente ejecutado |
| `lastRunMode` | string | - | Modo de ejecución del asistente (`local` \| `remote`) |

### `diagnostics`

Configuración de telemetría de diagnóstico y OpenTelemetry.

```json5
{
  diagnostics: {
    enabled: true,
    flags: ["debug-mode", "verbose-tool-calls"],
    otel: {
      enabled: false,
      endpoint: "https://otel.example.com",
      protocol: "http/protobuf",
      headers: {
        "X-Custom-Header": "value"
      },
      serviceName: "clawdbot",
      traces: true,
      metrics: true,
      logs: false,
      sampleRate: 0.1,
      flushIntervalMs: 5000
    },
    cacheTrace: {
      enabled: false,
      filePath: "/tmp/clawdbot/trace-cache.json",
      includeMessages: true,
      includePrompt: true,
      includeSystem: false
    }
  }
}
```

| Campo | Tipo | Obligatorio | Predeterminado | Descripción |
|------|------|-------------|---------------|-------------|
| `enabled` | boolean | `false` | Habilitar funciones de diagnóstico |
| `flags` | string[] | - | Lista de indicadores de diagnóstico |
| `otel.enabled` | boolean | `false` | Habilitar telemetría OpenTelemetry |
| `otel.endpoint` | string | - | Endpoint del recopilador OTEL |
| `otel.protocol` | string | - | Protocolo OTEL (`http/protobuf` \| `grpc`) |
| `otel.headers` | object | - | Encabezados de solicitud OTEL |
| `otel.serviceName` | string | - | Nombre del servicio OTEL |
| `otel.traces` | boolean | - | Recopilar datos de seguimiento |
| `otel.metrics` | boolean | - | Recopilar datos de métricas |
| `otel.logs` | boolean | - | Recopilar datos de registro |
| `otel.sampleRate` | number | - | Tasa de muestreo (0-1) |
| `otel.flushIntervalMs` | number | - | Intervalo de vaciado (milisegundos) |
| `cacheTrace.enabled` | boolean | `false` | Habilitar caché de seguimiento |
| `cacheTrace.filePath` | string | - | Ruta del archivo de caché de seguimiento |
| `cacheTrace.includeMessages` | boolean | - | Incluir mensajes en caché |
| `cacheTrace.includePrompt` | boolean | - | Incluir solicitudes en caché |
| `cacheTrace.includeSystem` | boolean | - | Incluir solicitudes del sistema en caché |

### `logging`

Configuración de registro.

```json5
{
  logging: {
    level: "info",
    file: "/tmp/clawdbot/clawdbot.log",
    consoleLevel: "info",
    consoleStyle: "pretty",
    redactSensitive: "tools",
    redactPatterns: [
      "\\bTOKEN\\b\\s*[=:]\\s*([\"']?)([^\\s\"']+)\\1",
      "/\\bsk-[A-Za-z0-9_-]{8,}\\b/gi"
    ]
  }
}
```

| Campo | Tipo | Obligatorio | Predeterminado | Descripción |
|------|------|-------------|---------------|-------------|
| `level` | string | `info` | Nivel de registro (`silent` \| `fatal` \| `error` \| `warn` \| `info` \| `debug` \| `trace`) |
| `file` | string | - | Ruta del archivo de registro (predeterminado: `/tmp/clawdbot/clawdbot-YYYY-MM-DD.log`) |
| `consoleLevel` | string | `info` | Nivel de registro de consola (mismo que la opción `level`) |
| `consoleStyle` | string | `pretty` | Estilo de salida de consola (`pretty` \| `compact` \| `json`) |
| `redactSensitive` | string | `tools` | Modo de redacción de información confidencial (`off` \| `tools`) |
| `redactPatterns` | string[] | - | Patrones de regex de redacción personalizados (anula los predeterminados) |

::: tip Ruta del archivo de registro
Si quieres una ruta de archivo de registro estable, establece `logging.file` en `/tmp/clawdbot/clawdbot.log` (en lugar de la ruta de rotación diaria predeterminada).

### `update`

Configuración de canal de actualización y verificación automática.

```json5
{
  update: {
    channel: "stable",
    checkOnStart: true
  }
}
```

| Campo | Tipo | Obligatorio | Predeterminado | Descripción |
|------|------|-------------|---------------|-------------|
| `channel` | string | `stable` | Canal de actualización (`stable` \| `beta` \| `dev`) |
| `checkOnStart` | boolean | - | Verificar actualizaciones al iniciar |

### `browser`

Configuración de automatización del navegador (basado en Playwright).

```json5
{
  browser: {
    enabled: true,
    controlUrl: "ws://localhost:9222",
    controlToken: "secret-token",
    cdpUrl: "http://localhost:9222",
    remoteCdpTimeoutMs: 10000,
    remoteCdpHandshakeTimeoutMs: 5000,
    color: "#3b82f6",
    executablePath: "/usr/bin/google-chrome",
    headless: true,
    noSandbox: false,
    attachOnly: false,
    defaultProfile: "default",
    snapshotDefaults: {
      mode: "efficient"
    },
    profiles: {
      "profile-1": {
        cdpPort: 9222,
        cdpUrl: "http://localhost:9222",
        driver: "clawd",
        color: "#ff0000"
      }
    }
  }
}
```

| Campo | Tipo | Obligatorio | Predeterminado | Descripción |
|------|------|-------------|---------------|-------------|
| `enabled` | boolean | - | Habilitar herramienta del navegador |
| `controlUrl` | string | - | URL de WebSocket de control del navegador |
| `controlToken` | string | - | Token de autenticación de control del navegador |
| `cdpUrl` | string | - | URL de Chrome DevTools Protocol |
| `remoteCdpTimeoutMs` | number | - | Tiempo de espera de CDP remoto (milisegundos) |
| `remoteCdpHandshakeTimeoutMs` | number | - | Tiempo de espera de handshake CDP remoto (milisegundos) |
| `color` | string | - | Color hexadecimal mostrado en la UI |
| `executablePath` | string | - | Ruta del archivo ejecutable del navegador |
| `headless` | boolean | - | Modo sin cabeza |
| `noSandbox` | boolean | - | Deshabilitar sandbox (necesario en Linux) |
| `attachOnly` | boolean | - | Solo adjuntar a instancia de navegador existente |
| `defaultProfile` | string | - | ID de perfil predeterminado |
| `snapshotDefaults.mode` | string | - | Modo de instantánea (`efficient`) |
| `profiles` | object | - | Mapeo de perfiles (clave: nombre del perfil, valor: configuración) |

**Configuración de perfil**:
- `cdpPort`: Puerto CDP (1-65535)
- `cdpUrl`: URL CDP
- `driver`: Tipo de controlador (`clawd` \| `extension`)
- `color`: Color hexadecimal del perfil

::: warning Nomenclatura de perfil del navegador
Los nombres de perfil solo deben contener letras minúsculas, números y guiones: `^[a-z0-9-]+$`

### `ui`

Configuración de personalización de UI (Control UI, WebChat).

```json5
{
  ui: {
    seamColor: "#3b82f6",
    assistant: {
      name: "Clawdbot",
      avatar: "avatars/clawdbot.png"
    }
  }
}
```

| Campo | Tipo | Obligatorio | Predeterminado | Descripción |
|------|------|-------------|---------------|-------------|
| `seamColor` | string | - | Valor hexadecimal del color Seam |
| `assistant.name` | string | - | Nombre para mostrar del asistente (máximo 50 caracteres) |
| `assistant.avatar` | string | - | Ruta o URL del avatar del asistente (máximo 200 caracteres) |

**Soporte de avatar**:
- Ruta relativa al espacio de trabajo (debe estar dentro del espacio de trabajo del agente)
- URL `http(s)`
- URI `data:`

## Configuración de autenticación

### `auth`

Metadatos del perfil de autenticación (no almacena claves, solo mapea perfiles a proveedores y modos).

```json5
{
  auth: {
    profiles: {
      "anthropic:me@example.com": {
        provider: "anthropic",
        mode: "oauth",
        email: "me@example.com"
      },
      "anthropic:work": {
        provider: "anthropic",
        mode: "api_key"
      },
      "openai:default": {
        provider: "openai",
        mode: "api_key"
      }
    },
    order: {
      anthropic: ["anthropic:me@example.com", "anthropic:work"],
      openai: ["openai:default"]
    },
    cooldowns: {
      billingBackoffHours: 24,
      billingBackoffHoursByProvider: {
        anthropic: 48
      },
      billingMaxHours: 168,
      failureWindowHours: 1
    }
  }
}
```

| Campo | Tipo | Obligatorio | Predeterminado | Descripción |
|------|------|-------------|---------------|-------------|
| `profiles` | object | - | Mapeo de perfiles (clave: ID de perfil, valor: configuración) |
| `profiles.<profileId>.provider` | string | - | Nombre del proveedor |
| `profiles.<profileId>.mode` | string | - | Modo de autenticación (`api_key` \| `oauth` \| `token`) |
| `profiles.<profileId>.email` | string | - | Correo OAuth (opcional) |
| `order` | object | - | Orden de conmutación por error del proveedor |
| `cooldowns.billingBackoffHours` | number | - | Duración de retroceso de problemas de facturación (horas) |
| `cooldowns.billingBackoffHoursByProvider` | object | - | Duración de retroceso de facturación por proveedor |
| `cooldowns.billingMaxHours` | number | - | Duración máxima de retroceso de facturación (horas) |
| `cooldowns.failureWindowHours` | number | - | Duración de ventana de fallo (horas) |

::: tip Sincronización automática de Claude Code CLI
Clawdbot sincroniza automáticamente los tokens OAuth desde Claude Code CLI a `auth-profiles.json` (cuando existe en el host del Gateway):
- macOS: Elemento de llavero "Claude Code-credentials" (selecciona "Permitir siempre" para evitar avisos de launchd)
- Linux/Windows: `~/.claude/.credentials.json`

**Ubicaciones de almacenamiento de autenticación**:
- `<agentDir>/auth-profiles.json` (predeterminado: `~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`)
- Importación heredada: `~/.clawdbot/credentials/oauth.json`

**Caché de tiempo de ejecución del agente integrado**:
- `<agentDir>/auth.json` (gestionado automáticamente; no editar manualmente)

## Configuración de modelos

### `models`

Proveedores de modelos de IA y configuración.

```json5
{
  models: {
    mode: "merge",
    providers: {
      "openai": {
        baseUrl: "https://api.openai.com/v1",
        apiKey: "${OPENAI_API_KEY}",
        auth: "api_key",
        api: "openai-completions",
        headers: {
          "X-Custom-Header": "value"
        },
        models: [
          {
            id: "gpt-4",
            name: "GPT-4",
            api: "openai-completions",
            reasoning: false,
            input: ["text"],
            cost: {
              input: 0.000005,
              output: 0.000015,
              cacheRead: 0.000001,
              cacheWrite: 0.000005
            },
            contextWindow: 128000,
            maxTokens: 4096,
            compat: {
              supportsStore: true,
              supportsDeveloperRole: true,
              supportsReasoningEffort: true,
              maxTokensField: "max_tokens"
            }
          }
        ]
      },
      "anthropic": {
        apiKey: "${ANTHROPIC_API_KEY}",
        auth: "oauth",
        api: "anthropic-messages",
        models: [
          {
            id: "claude-opus-4-5",
            name: "Claude Opus 4.5",
            api: "anthropic-messages",
            reasoning: true,
            input: ["text", "image"],
            contextWindow: 200000,
            maxTokens: 8192
          }
        ]
      },
      "ollama": {
        baseUrl: "http://localhost:11434",
        apiKey: "ollama"
      },
      "vercel-gateway": {
        apiKey: "${VERCEL_GATEWAY_API_KEY}"
      }
    },
    bedrockDiscovery: {
      enabled: false,
      region: "us-east-1",
      providerFilter: ["anthropic"],
      refreshInterval: 3600000,
      defaultContextWindow: 200000,
      defaultMaxTokens: 4096
    }
  }
}
```

| Campo | Tipo | Obligatorio | Predeterminado | Descripción |
|------|------|-------------|---------------|-------------|
| `mode` | string | - | Modo de fusión de modelos (`merge` \| `replace`) |
| `providers` | object | - | Mapeo de proveedores (clave: ID de proveedor, valor: configuración del proveedor) |
| `providers.<providerId>.baseUrl` | string | - | URL base de API |
| `providers.<providerId>.apiKey` | string | - | Clave de API (soporta reemplazo de variables de entorno) |
| `providers.<providerId>.auth` | string | - | Tipo de autenticación (`api_key` \| `aws-sdk` \| `oauth` \| `token`) |
| `providers.<providerId>.api` | string | - | Tipo de API (`openai-completions` \| `openai-responses` \| `anthropic-messages` \| `google-generative-ai` \| `github-copilot` \| `bedrock-converse-stream`) |
| `providers.<providerId>.authHeader` | boolean | - | Usar encabezado de autenticación |
| `providers.<providerId>.headers` | object | - | Encabezados HTTP personalizados |
| `providers.<providerId>.models` | array | - | Lista de definiciones de modelos |
| `bedrockDiscovery.enabled` | boolean | `false` | Habilitar descubrimiento de modelos AWS Bedrock |
| `bedrockDiscovery.region` | string | - | Región AWS |
| `bedrockDiscovery.providerFilter` | string[] | - | Filtro de proveedores Bedrock |
| `bedrockDiscovery.refreshInterval` | number | - | Intervalo de actualización (milisegundos) |
| `bedrockDiscovery.defaultContextWindow` | number | - | Ventana de contexto predeterminada |
| `bedrockDiscovery.defaultMaxTokens` | number | - | Número máximo de tokens predeterminado |

**Campos de definición de modelo**:
- `id`: ID del modelo (obligatorio)
- `name`: Nombre para mostrar del modelo (obligatorio)
- `api`: Tipo de API
- `reasoning`: Si es un modelo de razonamiento
- `input`: Tipos de entrada admitidos (`text` \| `image`)
- `cost.input`: Costo de entrada
- `cost.output`: Costo de salida
- `cost.cacheRead`: Costo de lectura de caché
- `cost.cacheWrite`: Costo de escritura de caché
- `contextWindow`: Tamaño de ventana de contexto
- `maxTokens`: Número máximo de tokens
- `compat`: Marcadores de compatibilidad

## Configuración de agentes

### `agents`

Lista de agentes y configuración predeterminada.

```json5
{
  agents: {
    defaults: {
      workspace: "~/clawd",
      repoRoot: "~/Projects/clawdbot",
      skipBootstrap: false,
      bootstrapMaxChars: 20000,
      userTimezone: "America/Chicago",
      timeFormat: "auto",
      model: {
        primary: "anthropic/claude-opus-4-5",
        fallbacks: [
          "openai/gpt-4",
          "vercel-gateway/gpt-4"
        ]
      },
      identity: {
        name: "Clawdbot",
        theme: "helpful sloth",
        emoji: "🦞",
        avatar: "avatars/clawdbot.png"
      },
      groupChat: {
        mentionPatterns: ["@clawd", "clawdbot"]
      },
      sandbox: {
        mode: "off",
        scope: "session",
        workspaceAccess: "rw",
        workspaceRoot: "/tmp/clawdbot-sandbox",
        docker: {
          image: "clawdbot/agent:latest",
          network: "bridge",
          env: {
            "CUSTOM_VAR": "value"
          },
          setupCommand: "npm install",
          limits: {
            memory: "512m",
            cpu: "0.5"
          }
        },
        browser: {
          enabled: true
        },
        prune: {
          enabled: true,
          keepLastN: 3
        }
      },
      subagents: {
        allowAgents: ["*"]
      },
      tools: {
        profile: "full-access",
        allow: ["read", "write", "edit", "browser"],
        deny: ["exec"]
      },
      concurrency: {
        maxConcurrentSessions: 5,
        maxConcurrentToolCalls: 10
      },
      cli: {
        backend: {
          command: "clawdbot agent",
          args: ["--thinking", "high"],
          output: "json",
          resumeOutput: "json",
          input: "stdin",
          maxPromptArgChars: 10000,
          env: {},
          clearEnv: ["NODE_ENV"],
          modelArg: "--model",
          modelAliases: {
            "opus": "anthropic/claude-opus-4-5"
          },
          sessionArg: "--session",
          sessionArgs: ["--verbose"],
          resumeArgs: [],
          sessionMode: "existing",
          sessionIdFields: ["agent", "channel", "accountId", "peer"],
          systemPromptArg: "--system-prompt",
          systemPromptMode: "append",
          systemPromptWhen: "always",
          imageArg: "--image",
          imageMode: "repeat",
          serialize: false
        }
      }
    },
    list: [
      {
        id: "main",
        default: true,
        name: "Main Assistant",
        workspace: "~/clawd-main",
        agentDir: "~/.clawdbot/agents/main/agent",
        model: "anthropic/claude-opus-4-5",
        identity: {
          name: "Samantha",
          theme: "helpful sloth",
          emoji: "🦥",
          avatar: "avatars/samantha.png"
        },
        groupChat: {
          mentionPatterns: ["@samantha", "sam", "assistant"]
        },
        sandbox: {
          mode: "non-main"
        },
        subagents: {
          allowAgents: ["research", "writer"]
        },
        tools: {
          allow: ["read", "write", "browser"],
          deny: []
        }
      },
      {
        id: "work",
        workspace: "~/clawd-work",
        model: {
          primary: "openai/gpt-4",
          fallbacks: []
        }
      }
    ]
  }
}
```

**Configuración predeterminada** (`agents.defaults`):

| Campo | Tipo | Obligatorio | Predeterminado | Descripción |
|------|------|-------------|---------------|-------------|
| `workspace` | string | `~/clawd` | Directorio del espacio de trabajo del agente |
| `repoRoot` | string | - | Directorio raíz del repositorio Git (para solicitud del sistema) |
| `skipBootstrap` | boolean | `false` | Omitir creación de archivos de arranque del espacio de trabajo |
| `bootstrapMaxChars` | number | `20000` | Número máximo de caracteres por archivo de arranque |
| `userTimezone` | string | - | Zona horaria del usuario (contexto de solicitud del sistema) |
| `timeFormat` | string | `auto` | Formato de hora (`auto` \| `12` \| `24`) |
| `model.primary` | string | - | Modelo principal (forma de cadena: `provider/model`) |
| `model.fallbacks` | string[] | - | Lista de modelos de conmutación por error |
| `identity.name` | string | - | Nombre del agente |
| `identity.theme` | string | - | Tema del agente |
| `identity.emoji` | string | - | Emoji del agente |
| `identity.avatar` | string | - | Ruta o URL del avatar del agente |
| `groupChat.mentionPatterns` | string[] | - | Patrones de mención de grupo (regex) |
| `groupChat.historyLimit` | number | - | Límite de historial de grupo |
| `sandbox.mode` | string | - | Modo de sandbox (`off` \| `non-main` \| `all`) |
| `sandbox.scope` | string | - | Alcance de sandbox (`session` \| `agent` \| `shared`) |
| `sandbox.workspaceAccess` | string | - | Permiso de acceso al espacio de trabajo (`none` \| `ro` \| `rw`) |
| `sandbox.workspaceRoot` | string | - | Directorio raíz del espacio de trabajo de sandbox personalizado |
| `subagents.allowAgents` | string[] | - | IDs de subagentes permitidos (`["*"]` = cualquiera) |
| `tools.profile` | string | - | Perfil de herramientas (aplicado antes de allow/deny) |
| `tools.allow` | string[] | - | Lista de herramientas permitidas |
| `tools.deny` | string[] | - | Lista de herramientas denegadas (deny tiene prioridad) |
| `concurrency.maxConcurrentSessions` | number | - | Número máximo de sesiones concurrentes |
| `concurrency.maxConcurrentToolCalls` | number | - | Número máximo de llamadas de herramientas concurrentes |

**Lista de agentes** (`agents.list`):

| Campo | Tipo | Obligatorio | Predeterminado | Descripción |
|------|------|-------------|---------------|-------------|
| `id` | string | Obligatorio | ID del agente (identificador estable) |
| `default` | boolean | `false` | Si es el agente predeterminado (primero gana si hay varios) |
| `name` | string | - | Nombre para mostrar del agente |
| `workspace` | string | `~/clawd-<agentId>` | Espacio de trabajo del agente (anula predeterminado) |
| `agentDir` | string | `~/.clawdbot/agents/<agentId>/agent` | Directorio del agente |
| `model` | string/object | - | Configuración de modelo por agente |
| `identity` | object | - | Configuración de identidad por agente |
| `groupChat` | object | - | Configuración de chat de grupo por agente |
| `sandbox` | object | - | Configuración de sandbox por agente |
| `subagents` | object | - | Configuración de subagentes por agente |
| `tools` | object | - | Restricciones de herramientas por agente |

::: tip Formulario de configuración de modelo
El campo `model` de un agente puede adoptar dos formas:
- **Forma de cadena**: `"provider/model"` (solo anula `primary`)
- **Forma de objeto**: `{ primary, fallbacks }` (anula `primary` y `fallbacks`; `[]` deshabilita la conmutación por error global para este agente)

## Configuración de enlaces

### `bindings`

Enruta mensajes entrantes a agentes específicos.

```json5
{
  bindings: [
    {
      agentId: "main",
      match: {
        channel: "whatsapp",
        accountId: "personal",
        peer: {
          kind: "dm",
          id: "+15555550123"
        },
        guildId: "123456789012345678",
        teamId: "T12345"
      }
    },
    {
      agentId: "work",
      match: {
        channel: "whatsapp",
        accountId: "biz"
      }
    },
    {
      agentId: "main",
      match: {
        channel: "telegram"
      }
    }
  ]
}
```

| Campo | Tipo | Obligatorio | Predeterminado | Descripción |
|------|------|-------------|---------------|-------------|
| `agentId` | string | Obligatorio | ID del agente de destino (debe estar en `agents.list`) |
| `match.channel` | string | Obligatorio | Canal coincidente |
| `match.accountId` | string | - | ID de cuenta coincidente (`*` = cualquier cuenta; omitido = cuenta predeterminada) |
| `match.peer` | object | - | Par coincidente (par) |
| `match.peer.kind` | string | - | Tipo de par (`dm` \| `group` \| `channel`) |
| `match.peer.id` | string | - | ID del par |
| `match.guildId` | string | - | ID del servidor de Discord |
| `match.teamId` | string | - | ID del equipo de Slack/Microsoft Teams |

**Orden de coincidencia determinista**:
1. `match.peer` (más específico)
2. `match.guildId`
3. `match.teamId`
4. `match.accountId` (exacto, sin par/guild/team)
5. `match.accountId: "*"` (alcance del canal, sin par/guild/team)
6. Agente predeterminado (`agents.list[].default`, de lo contrario primer elemento de la lista, de lo contrario `"main"`)

Dentro de cada capa de coincidencia, el primer elemento coincidente en `bindings` gana.

## Configuración de herramientas

### `tools`

Ejecución de herramientas y políticas de seguridad.

```json5
{
  tools: {
    exec: {
      elevated: {
        enabled: false,
        allowFrom: {
          whatsapp: ["+15555550123"],
          telegram: ["tg:123456789"]
        }
      }
    },
    browser: {
      enabled: true
    },
    agentToAgent: {
      enabled: false,
      allow: ["main", "work"]
    }
  }
}
```

| Campo | Tipo | Obligatorio | Predeterminado | Descripción |
|------|------|-------------|---------------|-------------|
| `exec.elevated.enabled` | boolean | `false` | Habilitar bash elevado (`! <cmd>`) |
| `exec.elevated.allowFrom` | object | - | Lista de permitidos elevados por canal |
| `browser.enabled` | boolean | - | Habilitar herramienta del navegador |
| `agentToAgent.enabled` | boolean | - | Habilitar mensajería de agente a agente |
| `agentToAgent.allow` | string[] | - | Lista de IDs de agentes permitidos |

## Configuración de transmisión

### `broadcast`

Envía mensajes a múltiples canales/agentes.

```json5
{
  broadcast: {
    strategy: "parallel",
    "+15555550123": ["main", "work"],
    "120363403215116621@g.us": ["transcribe"],
    "strategy": "sequential"
  }
}
```

| Campo | Tipo | Obligatorio | Predeterminado | Descripción |
|------|------|-------------|---------------|-------------|
| `strategy` | string | - | Estrategia de transmisión (`parallel` \| `sequential`) |
| `<peerId>` | string[] | - | Enviar mensajes a estos agentes (clave dinámica) |

::: info Claves de transmisión
- Formato de clave: `<peerId>` (por ejemplo: `+15555550123` o `"120363403215116621@g.us"`)
- Valor: matriz de IDs de agentes
- Clave especial `"strategy"`: controla ejecución paralela vs secuencial

## Configuración de audio

### `audio`

Configuración de audio y transcripción.

```json5
{
  audio: {
    transcription: {
      enabled: true,
      provider: "whisper",
      model: "base"
    }
  }
}
```

::: info Detalles del campo
Para campos de configuración de transcripción completa, consulta `TranscribeAudioSchema` en `zod-schema.core.ts`.

## Configuración de mensajes

### `messages`

Prefijos de mensajes, confirmaciones y comportamiento de cola.

```json5
{
  messages: {
    responsePrefix: "🦞",
    ackReaction: "👀",
    ackReactionScope: "group-mentions",
    removeAckAfterReply: false,
    queue: {
      mode: "collect",
      debounceMs: 1000,
      cap: 20,
      drop: "summarize",
      byChannel: {
        whatsapp: "collect",
        telegram: "collect",
        discord: "collect",
        imessage: "collect",
        webchat: "collect"
      }
    },
    inbound: {
      debounceMs: 2000,
      byChannel: {
        whatsapp: 5000,
        slack: 1500,
        discord: 1500
      }
    },
    groupChat: {
      historyLimit: 50
    }
  }
}
```

| Campo | Tipo | Obligatorio | Predeterminado | Descripción |
|------|------|-------------|---------------|-------------|
| `responsePrefix` | string | - | Prefijo para todas las respuestas salientes (soporta variables de plantilla) |
| `ackReaction` | string | - | Emoji para confirmar mensajes entrantes |
| `ackReactionScope` | string | - | Cuándo enviar confirmación (`group-mentions` \| `group-all` \| `direct` \| `all`) |
| `removeAckAfterReply` | boolean | `false` | Eliminar confirmación después de enviar respuesta |
| `queue.mode` | string | - | Modo de cola (`steer` \| `followup` \| `collect` \| `steer-backlog` \| `queue` \| `interrupt`) |
| `queue.debounceMs` | number | - | Desaceleración de cola (milisegundos) |
| `queue.cap` | number | - | Límite superior de cola |
| `queue.drop` | string | - | Estrategia de descarte (`old` \| `new` \| `summarize`) |
| `queue.byChannel` | object | - | Modo de cola por canal |
| `inbound.debounceMs` | number | - | Desaceleración de mensajes entrantes (milisegundos; 0 deshabilita) |
| `inbound.byChannel` | object | - | Duración de desaceleración por canal |
| `groupChat.historyLimit` | number | - | Límite de contexto de historial de grupo (0 deshabilita) |

**Variables de plantilla** (para `responsePrefix`):

| Variable | Descripción | Ejemplo |
|----------|-------------|--------|
| `{model}` | Nombre corto del modelo | `claude-opus-4-5`, `gpt-4` |
| `{modelFull}` | Identificador completo del modelo | `anthropic/claude-opus-4-5` |
| `{provider}` | Nombre del proveedor | `anthropic`, `openai` |
| `{thinkingLevel}` | Nivel de razonamiento actual | `high`, `low`, `off` |
| `{identity.name}` | Nombre de identidad del agente | (igual que el modo `"auto"`) |

::: tip Chat personal de WhatsApp
Las respuestas de chat personal usan `[{identity.name}]` por defecto, de lo contrario `[clawdbot]`, para que las conversaciones del mismo número sigan siendo legibles.

## Configuración de comandos

### `commands`

Configuración de procesamiento de comandos de chat.

```json5
{
  commands: {
    native: "auto",
    text: true,
    bash: false,
    bashForegroundMs: 2000,
    config: false,
    debug: false,
    restart: false,
    useAccessGroups: true
  }
}
```

| Campo | Tipo | Obligatorio | Predeterminado | Descripción |
|------|------|-------------|---------------|-------------|
| `native` | string | `auto` | Comandos nativos (`auto` \| `true` \| `false`) |
| `text` | boolean | `true` | Analizar comandos de barra en mensajes de chat |
| `bash` | boolean | `false` | Permitir `!` (alias para `/bash`) |
| `bashForegroundMs` | number | `2000` | Ventana en primer plano de bash (milisegundos) |
| `config` | boolean | `false` | Permitir `/config` (escribe en disco) |
| `debug` | boolean | `false` | Permitir `/debug` (solo anulaciones de tiempo de ejecución) |
| `restart` | boolean | `false` | Permitir `/restart` + herramienta de reinicio del Gateway |
| `useAccessGroups` | boolean | `true` | Forzar lista de permitidos/políticas de grupos de acceso para comandos |

::: warning comando bash
`commands.bash: true` habilita `! <cmd>` para ejecutar comandos de shell del host (`/bash <cmd>` también funciona como alias). Requiere `tools.elevated.enabled` y remitente en la lista de permitidos.

## Configuración de sesión

### `session`

Persistencia y comportamiento de la sesión.

```json5
{
  session: {
    activation: {
      defaultMode: "auto",
      defaultDurationMs: 900000,
      keepAlive: true
    },
    compaction: {
      auto: true,
      threshold: 0.8,
      strategy: "summary"
    }
  }
}
```

| Campo | Tipo | Obligatorio | Predeterminado | Descripción |
|------|------|-------------|---------------|-------------|
| `activation.defaultMode` | string | `auto` | Modo de activación predeterminado (`auto` \| `always` \| `manual`) |
| `activation.defaultDurationMs` | number | - | Duración de activación predeterminada (milisegundos) |
| `activation.keepAlive` | boolean | - | Mantener vivo |
| `compaction.auto` | boolean | `true` | Compactación automática |
| `compaction.threshold` | number | - | Umbral de compactación (0-1) |
| `compaction.strategy` | string | - | Estrategia de compactación |

::: info Compactación de sesión
Se compacta automáticamente cuando el contexto se desborda, luego falla. Consulta `CHANGELOG.md:122`.

## Configuración de Cron

### `cron`

Programación de tareas programadas.

```json5
{
  cron: {
    enabled: true,
    store: "~/.clawdbot/cron.json",
    maxConcurrentRuns: 5
  }
}
```

| Campo | Tipo | Obligatorio | Predeterminado | Descripción |
|------|------|-------------|---------------|-------------|
| `enabled` | boolean | - | Habilitar motor Cron |
| `store` | string | - | Ruta del archivo de almacenamiento de Cron |
| `maxConcurrentRuns` | number | - | Número máximo de ejecuciones simultáneas |

## Configuración de Hooks

### `hooks`

Webhooks y reenvío de eventos.

```json5
{
  hooks: {
    enabled: true,
    path: "~/.clawdbot/hooks",
    token: "webhook-secret-token",
    maxBodyBytes: 1048576,
    presets: ["slack-alerts", "discord-notifications"],
    transformsDir: "~/.clawdbot/hook-transforms",
    mappings: [
      {
        pattern: "^agent:.*$",
        target: "https://hooks.example.com/agent-events",
        headers: {
          "Authorization": "Bearer ${WEBHOOK_AUTH}"
        }
      }
    ],
    gmail: {
      enabled: false,
      credentialsPath: "~/.clawdbot/gmail-credentials.json",
      subscriptionIds: ["subscription-1", "subscription-2"]
    },
    internal: {
      onMessage: "log-message",
      onToolCall: "log-tool-call",
      onError: "log-error"
    }
  }
}
```

| Campo | Tipo | Obligatorio | Predeterminado | Descripción |
|------|------|-------------|---------------|-------------|
| `enabled` | boolean | - | Habilitar Hooks |
| `path` | string | - | Ruta del directorio de Hooks |
| `token` | string | - | Token de autenticación de Webhook |
| `maxBodyBytes` | number | - | Tamaño máximo del cuerpo de la solicitud (bytes) |
| `presets` | string[] | - | Lista de Hooks preestablecidos |
| `transformsDir` | string | - | Directorio de scripts de transformación de Hooks |
| `mappings` | array | - | Mapeos de Hooks personalizados |
| `gmail.enabled` | boolean | - | Habilitar Gmail Pub/Sub |
| `gmail.credentialsPath` | string | - | Ruta de credenciales de Gmail |
| `gmail.subscriptionIds` | string[] | - | Lista de IDs de suscripción de Gmail |
| `internal.onMessage` | string | - | Hook interno de mensaje |
| `internal.onToolCall` | string | - | Hook interno de llamada de herramienta |
| `internal.onError` | string | - | Hook interno de error |

## Configuración de canales

### `channels`

Configuración de integración de mensajes multicanal.

```json5
{
  channels: {
    whatsapp: {
      enabled: true,
      botToken: "123456:ABC...",
      dmPolicy: "pairing",
      allowFrom: ["+15555550123"],
      groups: {
        "*": { requireMention: true },
        "-1001234567890": {
          allowFrom: ["@admin"],
          systemPrompt: "Keep answers brief.",
          topics: {
            "99": {
              requireMention: false,
              skills: ["search"],
              systemPrompt: "Stay on topic."
            }
          }
        }
      },
      sendReadReceipts: true,
      textChunkLimit: 4000,
      chunkMode: "length",
      mediaMaxMb: 50,
      historyLimit: 50,
      replyToMode: "first",
      accounts: {
        default: {},
        personal: {},
        biz: {
          authDir: "~/.clawdbot/credentials/whatsapp/biz"
        }
      }
    },
    telegram: {
      enabled: true,
      botToken: "123456:ABC...",
      dmPolicy: "pairing",
      allowFrom: ["tg:123456789"],
      groups: {
        "*": { requireMention: true }
      },
      customCommands: [
        { command: "backup", description: "Git backup" },
        { command: "generate", description: "Create an image" }
      ],
      historyLimit: 50,
      replyToMode: "first",
      linkPreview: true,
      streamMode: "partial",
      draftChunk: {
        minChars: 200,
        maxChars: 800,
        breakPreference: "paragraph"
      }
    },
    discord: {
      enabled: true,
      token: "your-bot-token",
      mediaMaxMb: 8,
      allowBots: false,
      actions: {
        reactions: true,
        messages: true,
        threads: true,
        pins: true
      },
      guilds: {
        "123456789012345678": {
          requireMention: false,
          users: ["987654321098765432"],
          channels: {
            general: { allow: true },
            help: {
              allow: true,
              requireMention: true,
              users: ["987654321098765432"]
            }
          }
        }
      },
      historyLimit: 20,
      dm: {
        enabled: true,
        policy: "pairing",
        allowFrom: ["1234567890", "username"],
        groupEnabled: false,
        groupChannels: ["clawd-dm"]
      }
    },
    slack: {
      enabled: true,
      botToken: "xoxb-...",
      appToken: "xapp-...",
      channels: {
        "#general": { allow: true, requireMention: true }
      },
      historyLimit: 50,
      allowBots: false,
      reactionNotifications: "own",
      slashCommand: {
        enabled: true,
        name: "clawd",
        sessionPrefix: "slack:slash",
        ephemeral: true
      }
    },
    signal: {
      reactionNotifications: "own",
      reactionAllowlist: ["+15551234567"],
      historyLimit: 50
    },
    imessage: {
      enabled: true,
      cliPath: "imsg",
      dbPath: "~/Library/Messages/chat.db",
      dmPolicy: "pairing",
      allowFrom: ["+15555550123"],
      historyLimit: 50,
      includeAttachments: false,
      mediaMaxMb: 16
    }
  }
}
```

::: tip Documentación específica del canal
Cada canal tiene opciones de configuración detalladas. Consulta:
- [Canal WhatsApp](../../platforms/whatsapp/)
- [Canal Telegram](../../platforms/telegram/)
- [Canal Slack](../../platforms/slack/)
- [Canal Discord](../../platforms/discord/)
- [Canal Google Chat](../../platforms/googlechat/)
- [Canal Signal](../../platforms/signal/)
- [Canal iMessage](../../platforms/imessage/)

**Campos comunes del canal**:
- `enabled`: Habilitar canal
- `dmPolicy`: Política DM (`pairing` \| `allowlist` \| `open` \| `disabled`)
- `allowFrom`: Lista de permitidos DM (remitentes desconocidos reciben código de emparejamiento en modo `pairing`)
- `groupPolicy`: Política de grupo (`open` \| `disabled` \| `allowlist`)
- `historyLimit`: Límite de contexto de historial (0 deshabilita)

## Configuración del Gateway

### `gateway`

Servidor WebSocket del Gateway y autenticación.

```json5
{
  gateway: {
    port: 18789,
    mode: "local",
    bind: "loopback",
    controlUi: {
      enabled: true,
      basePath: "/",
      allowInsecureAuth: false,
      dangerouslyDisableDeviceAuth: false
    },
    auth: {
      mode: "token",
      token: "secret-gateway-token",
      password: "gateway-password",
      allowTailscale: false
    },
    trustedProxies: ["127.0.0.1", "10.0.0.0/8"],
    tailscale: {
      mode: "off",
      resetOnExit: false
    },
    remote: {
      url: "ws://gateway.example.com:18789",
      transport: "ssh",
      token: "remote-token",
      password: "remote-password",
      tlsFingerprint: "SHA256:...",
      sshTarget: "user@gateway-host",
      sshIdentity: "~/.ssh/id_ed25519"
    },
    reload: {
      mode: "hot",
      debounceMs: 1000
    },
    tls: {
      enabled: false,
      autoGenerate: true,
      certPath: "/path/to/cert.pem",
      keyPath: "/path/to/key.pem",
      caPath: "/path/to/ca.pem"
    },
    http: {
      endpoints: {
        chatCompletions: {
          enabled: true
        },
        responses: {
          enabled: true,
          maxBodyBytes: 10485760,
          files: {
            allowUrl: true,
            allowedMimes: ["text/*", "application/pdf"],
            maxBytes: 10485760,
            maxChars: 100000,
            maxRedirects: 10,
            timeoutMs: 30000,
            pdf: {
              maxPages: 50,
              maxPixels: 67108864,
              minTextChars: 0
            }
          },
          images: {
            allowUrl: true,
            allowedMimes: ["image/*"],
            maxBytes: 10485760,
            maxRedirects: 5,
            timeoutMs: 30000
          }
        }
      }
    },
    nodes: {
      browser: {
        mode: "auto",
        node: "macos-1"
      },
      allowCommands: [],
      denyCommands: ["rm -rf", ":(){ :|:& };:"]
    }
  }
}
```

| Campo | Tipo | Obligatorio | Predeterminado | Descripción |
|------|------|-------------|---------------|-------------|
| `port` | number | `18789` | Puerto WebSocket del Gateway |
| `mode` | string | `local` | Modo del Gateway (`local` \| `remote`) |
| `bind` | string | - | Dirección de enlace (`auto` \| `lan` \| `loopback` \| `custom` \| `tailnet`) |
| `controlUi.enabled` | boolean | - | Habilitar UI de control |
| `controlUi.basePath` | string | - | Ruta base de la UI |
| `controlUi.allowInsecureAuth` | boolean | - | Permitir autenticación insegura |
| `auth.mode` | string | - | Modo de autenticación (`token` \| `password`) |
| `auth.token` | string | - | Token de autenticación |
| `auth.password` | string | - | Contraseña de autenticación |
| `auth.allowTailscale` | boolean | - | Permitir autenticación de Tailscale |
| `tailscale.mode` | string | `off` | Modo de Tailscale (`off` \| `serve` \| `funnel`) |
| `tailscale.resetOnExit` | boolean | - | Restablecer Serve/Funnel al salir |
| `remote.url` | string | - | URL del Gateway remoto |
| `remote.transport` | string | - | Transporte remoto (`ssh` \| `direct`) |
| `remote.token` | string | - | Token remoto |
| `remote.password` | string | - | Contraseña remota |
| `remote.tlsFingerprint` | string | - | Huella TLS remota |
| `remote.sshTarget` | string | - | Objetivo SSH |
| `remote.sshIdentity` | string | - | Ruta del archivo de identidad SSH |
| `reload.mode` | string | - | Modo de recarga (`off` \| `restart` \| `hot` \| `hybrid`) |
| `reload.debounceMs` | number | - | Desaceleración de recarga (milisegundos) |
| `tls.enabled` | boolean | - | Habilitar TLS |
| `tls.autoGenerate` | boolean | - | Generar certificados automáticamente |
| `nodes.browser.mode` | string | - | Modo de nodo del navegador (`auto` \| `manual` \| `off`) |
| `nodes.allowCommands` | string[] | - | Comandos de nodo permitidos |
| `nodes.denyCommands` | string[] | - | Comandos de nodo denegados |

::: warning Restricción de enlace de Tailscale
Al habilitar Serve/Funnel, `gateway.bind` debe mantenerse como `loopback` (Clawdbot aplica esta regla).

## Configuración de habilidades

### `skills`

Plataforma de habilidades e instalación.

```json5
{
  skills: {
    allowBundled: ["bird", "sherpa-onnx-tts"],
    load: {
      extraDirs: ["~/custom-skills"],
      watch: true,
      watchDebounceMs: 500
    },
    install: {
      preferBrew: false,
      nodeManager: "pnpm"
    },
    entries: {
      "search": {
        enabled: true,
        apiKey: "${SEARCH_API_KEY}",
        env: {
          "SEARCH_ENGINE": "google"
        },
        config: {
          "maxResults": 10
        }
      }
    }
  }
}
```

| Campo | Tipo | Obligatorio | Predeterminado | Descripción |
|------|------|-------------|---------------|-------------|
| `allowBundled` | string[] | - | Lista de habilidades integradas permitidas |
| `load.extraDirs` | string[] | - | Directorios de habilidades adicionales |
| `load.watch` | boolean | - | Vigilar cambios en archivos de habilidades |
| `load.watchDebounceMs` | number | - | Desaceleración de vigilancia (milisegundos) |
| `install.preferBrew` | boolean | - | Preferir instalación de Homebrew |
| `install.nodeManager` | string | - | Administrador de nodos (`npm` \| `pnpm` \| `yarn` \| `bun`) |
| `entries.<skillId>.enabled` | boolean | - | Habilitar habilidad |
| `entries.<skillId>.apiKey` | string | - | Clave API de habilidad |
| `entries.<skillId>.env` | object | - | Variables de entorno de habilidad |
| `entries.<skillId>.config` | object | - | Configuración de habilidad |

## Configuración de complementos

### `plugins`

Configuración del sistema de complementos.

```json5
{
  plugins: {
    enabled: true,
    allow: ["whatsapp", "telegram", "discord"],
    deny: [],
    load: {
      paths: ["~/.clawdbot/plugins", "./custom-plugins"]
    },
    slots: {
      memory: "custom-memory-provider"
    }
  }
}
```

| Campo | Tipo | Obligatorio | Predeterminado | Descripción |
|------|------|-------------|---------------|-------------|
| `enabled` | boolean | - | Habilitar sistema de complementos |
| `allow` | string[] | - | Lista de complementos permitidos |
| `deny` | string[] | - | Lista de complementos denegados |
| `load.paths` | string[] | - | Rutas de carga de complementos |
| `slots.memory` | string | - | Proveedor de memoria personalizado |

## Inclusiones de configuración (`$include`)

Usa la directiva `$include` para dividir la configuración en varios archivos.

```json5
// ~/.clawdbot/clawdbot.json
{
  gateway: { port: 18789 },
  
  // Incluir un solo archivo (reemplaza el valor de la clave de inclusión)
  agents: { "$include": "./agents.json5" },
  
  // Incluir múltiples archivos (fusión profunda en orden)
  broadcast: { 
    "$include": [
      "./clients/mueller.json5",
      "./clients/schmidt.json5"
    ]
  }
}
```

```json5
// ~/.clawdbot/agents.json5
{
  defaults: { sandbox: { mode: "all", scope: "session" } },
  list: [
    { id: "main", workspace: "~/clawd" }
  ]
}
```

**Comportamiento de fusión**:
- **Archivo único**: Reemplaza el objeto que contiene `$include`
- **Matriz de archivos**: Fusiona profundamente los archivos en orden (los archivos posteriores sobrescriben los anteriores)
- **Claves hermanas**: Fusiona claves hermanas después de incluir (sobrescribe valores incluidos)
- **Claves hermanas + matriz/tipo básico**: No admitido (el contenido incluido debe ser un objeto)

**Resolución de rutas**:
- **Rutas relativas**: Se resuelven relativas al archivo incluyente
- **Rutas absolutas**: Se usan tal como están
- **Directorio principal**: Las referencias `../` funcionan según lo previsto

**Inclusiones anidadas**:
Los archivos incluidos pueden contener directivas `$include` (hasta 10 niveles de profundidad).

## Reemplazo de variables de entorno

Puedes hacer referencia a variables de entorno directamente en cualquier valor de cadena de configuración usando la sintaxis `${VAR_NAME}`. Las variables se reemplazan cuando se carga la configuración, antes de la validación.

```json5
{
  models: {
    providers: {
      "vercel-gateway": {
        apiKey: "${VERCEL_GATEWAY_API_KEY}"
      }
    }
  },
  gateway: {
    auth: {
      token: "${CLAWDBOT_GATEWAY_TOKEN}"
    }
  }
}
```

**Reglas**:
- Solo coincide con nombres de variables de entorno en mayúsculas: `[A-Z_][A-Z0-9_]*`
- Las variables de entorno faltantes o vacías lanzan un error al cargar la configuración
- Usa `$${VAR}` para escapar y generar el literal `${VAR}`
- Se aplica a `$include` (los archivos incluidos también obtienen reemplazo)

::: warning Variables faltantes
Las variables de entorno faltantes o vacías lanzarán un error al cargar la configuración.

## Validación y diagnóstico de configuración

Cuando falla la validación de configuración, usa `clawdbot doctor` para ver el problema exacto.

```bash
## Diagnosticar configuración
clawdbot doctor

## Reparar problemas automáticamente (requiere confirmación manual)
clawdbot doctor --fix

## Reparar automáticamente (omitir confirmación)
clawdbot doctor --yes
```

**Funciones de diagnóstico**:
- Detectar claves de configuración desconocidas
- Validar tipos de datos
- Detectar campos obligatorios faltantes
- Aplicar migraciones de configuración
- Detectar políticas DM inseguras
- Validar configuración de canales

## Rutas de archivos de configuración

| Archivo | Ruta | Descripción |
|---------|------|-------------|
| Configuración principal | `~/.clawdbot/clawdbot.json` | Archivo de configuración principal |
| Variables de entorno | `~/.clawdbot/.env` | Variables de entorno globales |
| Entorno de espacio de trabajo | `~/clawd/.env` | Variables de entorno del espacio de trabajo |
| Perfiles de autenticación | `<agentDir>/auth-profiles.json` | Perfiles de autenticación |
| Caché de tiempo de ejecución | `<agentDir>/auth.json` | Caché de tiempo de ejecución del agente integrado |
| OAuth heredado | `~/.clawdbot/credentials/oauth.json` | Importación de OAuth heredada |
| Almacenamiento de Cron | `~/.clawdbot/cron.json` | Almacenamiento de tareas de Cron |
| Rutas de Hooks | `~/.clawdbot/hooks` | Directorio de Hooks |

---

## Resumen de esta lección

Este tutorial explica en detalle el sistema completo de configuración de Clawdbot:

- ✅ Estructura del archivo de configuración y mecanismo de validación
- ✅ Todas las secciones de configuración principales (autenticación, agentes, canales, sesiones, herramientas, Cron, Hooks, etc.)
- ✅ Reemplazo de variables de entorno y prioridad de configuración
- ✅ Ejemplos comunes de configuración y mejores prácticas
- ✅ Rutas de archivos de configuración y ubicaciones de almacenamiento

## Vista previa de la próxima lección

> En la próxima lección aprenderemos sobre el **[Protocolo de API WebSocket del Gateway](./api-protocol/)**.
>
> Aprenderás:
> - Handshake de conexión WebSocket y autenticación
> - Formato de tramas de mensaje (solicitud, respuesta, evento)
> - Referencia de métodos principales y ejemplos de llamadas
> - Sistema de permisos y gestión de roles
> - Manejo de errores y estrategias de reintento

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para ver ubicaciones de código fuente</strong></summary>

> Fecha de actualización: 2026-01-27

| Sección de configuración | Ruta del archivo | Número de línea |
|-------------------------|------------------|-----------------|
| Schema principal | [`src/config/zod-schema.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.ts) | 1-556 |
| Schema central | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | 1-300 |
| Schema de agentes | [`src/config/zod-schema.agents.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.agents.ts) | 1-54 |
| Schema de canales | [`src/config/zod-schema.channels.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.channels.ts) | 1-11 |
| Schema de sesión | [`src/config/zod-schema.session.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.session.ts) | - |
| Schema de herramientas | [`src/config/zod-schema.agent-runtime.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.agent-runtime.ts) | - |
| Schema de Hooks | [`src/config/zod-schema.hooks.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.hooks.ts) | - |
| Schema de proveedores | [`src/config/zod-schema.providers.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers.ts) | - |
| Documentación de configuración | [`docs/gateway/configuration.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/gateway/configuration.md) | - |

**Constantes clave**:
- Puerto predeterminado: `18789` (`gateway.server-startup-log.ts`)
- Espacio de trabajo predeterminado: `~/clawd`
- Enlace predeterminado del Gateway: `loopback` (127.0.0.1)

**Funciones clave**:
- `ClawdbotSchema`: Definición del Schema de configuración principal
- `normalizeAllowFrom()`: Normaliza valores de lista de permitidos
- `requireOpenAllowFrom()`: Valida lista de permitidos en modo abierto
</details>
