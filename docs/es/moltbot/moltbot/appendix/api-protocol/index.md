---
title: "Guía Completa del Protocolo API WebSocket Gateway | Clawdbot"
sidebarTitle: "Desarrollar Cliente Personalizado"
subtitle: "Guía Completa del Protocolo API WebSocket Gateway"
description: "Aprende la especificación completa del protocolo WebSocket de Clawdbot Gateway, incluyendo handshake de conexión, formato de marcos de mensajes, modelos de solicitud/respuesta, eventos push, sistemas de permisos y todos los métodos disponibles. Este tutorial proporciona una referencia completa de API y ejemplos de integración de cliente."
tags:
  - "API"
  - "WebSocket"
  - "Protocolo"
  - "Desarrollador"
prerequisite:
  - "start-gateway-startup"
  - "advanced-session-management"
order: 350
---

# Guía Completa del Protocolo API WebSocket Gateway

## Qué Aprenderás

- 📡 Conectar exitosamente al servidor WebSocket Gateway
- 🔄 Enviar solicitudes y procesar respuestas
- 📡 Recibir eventos push del servidor
- 🔐 Comprender el sistema de permisos y autenticación
- 🛠️ Llamar todos los métodos Gateway disponibles
- 📖 Entender el formato de marcos de mensajes y el manejo de errores

## Tu Situación Actual

Probablemente estás desarrollando un cliente personalizado (como una aplicación móvil, aplicación web o herramienta de línea de comandos) que necesita comunicarse con Clawdbot Gateway. El protocolo WebSocket de Gateway parece complejo, necesitas:

- Saber cómo establecer una conexión y autenticar
- Entender el formato de mensajes de solicitud/respuesta
- Conocer los métodos disponibles y sus parámetros
- Manejar eventos push del servidor
- Entender el sistema de permisos

**Buenas noticias**: El Protocolo API WebSocket Gateway está diseñado de manera clara, y este tutorial te proporcionará una guía de referencia completa.

## Cuándo Usar Esto

::: info Escenarios Aplicables
Usa este protocolo cuando necesites:
- Desarrollar clientes personalizados para conectar a Gateway
- Implementar WebChat o aplicaciones móviles
- Crear herramientas de monitoreo o gestión
- Integrar Gateway en sistemas existentes
- Depurar y probar funcionalidades de Gateway
:::

## Conceptos Fundamentales

Clawdbot Gateway usa el protocolo WebSocket para proporcionar comunicación bidireccional en tiempo real. El protocolo se basa en marcos de mensajes en formato JSON, divididos en tres tipos:

1. **Marco de Solicitud (Request Frame)**: El cliente envía la solicitud
2. **Marco de Respuesta (Response Frame)**: El servidor devuelve la respuesta
3. **Marco de Evento (Event Frame)**: El servidor envía eventos de forma proactiva

::: tip Filosofía de Diseño
El protocolo adopta el modelo "solicitud-respuesta" + modo "push de eventos":
- El cliente inicia solicitudes de forma proactiva, el servidor devuelve respuestas
- El servidor puede enviar eventos de forma proactiva sin solicitud del cliente
- Todas las operaciones se realizan a través de una conexión WebSocket unificada
:::

## Handshake de Conexión

### Paso 1: Establecer Conexión WebSocket

Gateway escucha por defecto en `ws://127.0.0.1:18789` (se puede modificar mediante configuración).

::: code-group

```javascript [JavaScript]
// Establecer conexión WebSocket
const ws = new WebSocket('ws://127.0.0.1:18789/v1/connect');

ws.onopen = () => {
  console.log('WebSocket conectado');
};
```

```python [Python]
import asyncio
import websockets

async def connect():
    uri = "ws://127.0.0.1:18789/v1/connect"
    async with websockets.connect(uri) as websocket:
        print("WebSocket conectado")
```

```bash [Bash]
# Usar herramienta wscat para probar la conexión
wscat -c ws://127.0.0.1:18789/v1/connect
```

:::

### Paso 2: Enviar Mensaje de Handshake

Después de establecer la conexión, el cliente necesita enviar un mensaje de handshake para completar la autenticación y negociación de versión.

```json
{
  "minProtocol": 1,
  "maxProtocol": 3,
  "client": {
    "id": "my-app-v1",
    "displayName": "My Custom Client",
    "version": "1.0.0",
    "platform": "web",
    "mode": "operator",
    "instanceId": "unique-instance-id"
  },
  "caps": [],
  "commands": [],
  "auth": {
    "token": "your-token-here"
  }
}
```

**Por qué**: El mensaje de handshake le dice al servidor:
- El rango de versiones de protocolo que soporta el cliente
- La información básica del cliente
- Las credenciales de autenticación (token o password)

**Lo que deberías ver**: El servidor devuelve el mensaje `hello-ok`

```json
{
  "type": "hello-ok",
  "protocol": 3,
  "server": {
    "version": "v2026.1.24",
    "commit": "abc123",
    "host": "my-mac",
    "connId": "conn-123456"
  },
  "features": {
    "methods": ["agent", "send", "chat.send", ...],
    "events": ["agent.event", "chat.event", ...]
  },
  "snapshot": {
    "presence": [...],
    "health": {...},
    "stateVersion": {...},
    "uptimeMs": 12345678
  },
  "auth": {
    "deviceToken": "device-token-here",
    "role": "operator",
    "scopes": ["operator.read", "operator.write"]
  },
  "policy": {
    "maxPayload": 1048576,
    "maxBufferedBytes": 10485760,
    "tickIntervalMs": 30000
  }
}
```

::: info Descripción de Campos Hello-Ok
- `protocol`: La versión del protocolo que usa el servidor
- `server.version`: El número de versión de Gateway
- `features.methods`: La lista de todos los métodos disponibles
- `features.events`: La lista de todos los eventos a los que se puede suscribir
- `snapshot`: La instantánea del estado actual
- `auth.scopes`: Los alcances de permiso otorgados al cliente
- `policy.maxPayload`: El tamaño máximo de un solo mensaje
- `policy.tickIntervalMs`: El intervalo de latido del corazón
:::

### Paso 3: Verificar Estado de Conexión

Después de un handshake exitoso, puedes enviar una solicitud de verificación de salud para validar la conexión:

```json
{
  "type": "req",
  "id": "req-1",
  "method": "health",
  "params": {}
}
```

**Lo que deberías ver**:

```json
{
  "type": "res",
  "id": "req-1",
  "ok": true,
  "payload": {
    "status": "ok",
    "uptimeMs": 12345678
  }
}
```

## Formato de Marcos de Mensajes

### Marco de Solicitud (Request Frame)

Todas las solicitudes enviadas por el cliente siguen el formato de marco de solicitud:

```json
{
  "type": "req",
  "id": "unique-request-id",
  "method": "method.name",
  "params": {
    // Parámetros del método
  }
}
```

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `type` | string | Sí | Valor fijo `"req"` |
| `id` | string | Sí | Identificador único de la solicitud, usado para emparejar respuestas |
| `method` | string | Sí | Nombre del método, ej. `"agent"`, `"send"` |
| `params` | object | No | Parámetros del método, el formato específico depende del método |

::: warning Importancia del ID de Solicitud
Cada solicitud debe tener un `id` único. El servidor usa `id` para asociar respuestas con solicitudes. Si múltiples solicitudes usan el mismo `id`, las respuestas no se podrán emparejar correctamente.
:::

### Marco de Respuesta (Response Frame)

El servidor devuelve un marco de respuesta para cada solicitud:

```json
{
  "type": "res",
  "id": "unique-request-id",
  "ok": true,
  "payload": {
    // Datos de respuesta
  },
  "error": {
    // Información de error (solo cuando ok=false)
  }
}
```

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `type` | string | Sí | Valor fijo `"res"` |
| `id` | string | Sí | ID de solicitud correspondiente |
| `ok` | boolean | Sí | Si la solicitud fue exitosa |
| `payload` | any | No | Datos de respuesta cuando es exitoso |
| `error` | object | No | Información de error cuando falla |

**Ejemplo de Respuesta Exitosa**:

```json
{
  "type": "res",
  "id": "req-1",
  "ok": true,
  "payload": {
    "agents": [
      { "id": "agent-1", "name": "Default Agent" }
    ]
  }
}
```

**Ejemplo de Respuesta Fallida**:

```json
{
  "type": "res",
  "id": "req-1",
  "ok": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required parameter: message",
    "retryable": false
  }
}
```

### Marco de Evento (Event Frame)

El servidor puede enviar eventos de forma proactiva sin solicitud del cliente:

```json
{
  "type": "event",
  "event": "event.name",
  "payload": {
    // Datos del evento
  },
  "seq": 123,
  "stateVersion": {
    "presence": 456,
    "health": 789
  }
}
```

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `type` | string | Sí | Valor fijo `"event"` |
| `event` | string | Sí | Nombre del evento |
| `payload` | any | No | Datos del evento |
| `seq` | number | No | Número de secuencia del evento |
| `stateVersion` | object | No | Número de versión de estado |

**Ejemplos Comunes de Eventos**:

```json
// Evento de latido del corazón
{
  "type": "event",
  "event": "tick",
  "payload": {
    "ts": 1706707200000
  }
}

// Evento de Agente
{
  "type": "event",
  "event": "agent.event",
  "payload": {
    "runId": "run-123",
    "seq": 0,
    "stream": "thinking",
    "ts": 1706707200000,
    "data": {
      "content": "Pensando..."
    }
  }
}

// Evento de chat
{
  "type": "event",
  "event": "chat.event",
  "payload": {
    "runId": "run-123",
    "sessionKey": "main",
    "seq": 1,
    "state": "delta",
    "message": {
      "role": "assistant",
      "content": "¡Hola!"
    }
  }
}

// Evento de apagado
{
  "type": "event",
  "event": "shutdown",
  "payload": {
    "reason": "Reinicio del sistema",
    "restartExpectedMs": 5000
  }
}
```

## Autenticación y Permisos

### Métodos de Autenticación

Gateway soporta tres métodos de autenticación:

#### 1. Autenticación por Token (Recomendado)

Proporciona el token en el mensaje de handshake:

```json
{
  "auth": {
    "token": "your-security-token"
  }
}
```

El Token se define en el archivo de configuración:

```json
{
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "your-secret-token-here"
    }
  }
}
```

#### 2. Autenticación por Contraseña

```json
{
  "auth": {
    "password": "your-password"
  }
}
```

La Contraseña se define en el archivo de configuración:

```json
{
  "gateway": {
    "auth": {
      "mode": "password",
      "password": "your-password-here"
    }
  }
}
```

#### 3. Tailscale Identity (Autenticación de Red)

Cuando se usa Tailscale Serve/Funnel, se puede autenticar mediante Tailscale Identity:

```json
{
  "client": {
    "mode": "operator"
  },
  "device": {
    "id": "device-id",
    "publicKey": "public-key",
    "signature": "signature",
    "signedAt": 1706707200000
  }
}
```

### Alcances de Permisos (Scopes)

El cliente obtendrá un conjunto de alcances de permisos después del handshake, que determinan qué métodos puede llamar:

| Alcance | Permiso | Métodos Disponibles |
| --- | --- | --- |
| `operator.admin` | Administrador | Todos los métodos, incluyendo modificación de configuración, Wizard, actualizaciones, etc. |
| `operator.write` | Escritura | Enviar mensajes, llamar Agentes, modificar sesiones, etc. |
| `operator.read` | Solo Lectura | Consultar estado, registros, configuración, etc. |
| `operator.approvals` | Aprobación | Métodos relacionados con aprobación de Exec |
| `operator.pairing` | Emparejamiento | Métodos relacionados con emparejamiento de nodos y dispositivos |

::: info Verificación de Permisos
El servidor verifica los permisos en cada solicitud. Si el cliente carece de los permisos necesarios, la solicitud será rechazada:

```json
{
  "type": "res",
  "id": "req-1",
  "ok": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "missing scope: operator.admin"
  }
}
```
:::

### Sistema de Roles

Además de los alcances, el protocolo también soporta un sistema de roles:

| Rol | Descripción | Permisos Especiales |
| --- | --- | --- |
| `operator` | Operador | Puede llamar todos los métodos de Operador |
| `node` | Nodo de Dispositivo | Solo puede llamar métodos exclusivos de Nodo |
| `device` | Dispositivo | Puede llamar métodos relacionados con dispositivos |

El rol de nodo se asigna automáticamente durante el emparejamiento del dispositivo, utilizado para la comunicación entre el nodo del dispositivo y Gateway.

## Referencia de Métodos Principales

### Métodos de Agente

#### `agent` - Enviar Mensaje al Agente

Enviar mensaje al Agente AI y obtener respuesta en streaming.

```json
{
  "type": "req",
  "id": "req-1",
  "method": "agent",
  "params": {
    "message": "Hola, por favor escríbeme un Hello World",
    "agentId": "default",
    "sessionId": "main",
    "idempotencyKey": "msg-123"
  }
}
```

**Descripción de Parámetros**:

| Parámetro | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `message` | string | Sí | Contenido del mensaje del usuario |
| `agentId` | string | No | ID del Agente, usa el Agente predeterminado configurado por defecto |
| `sessionId` | string | No | ID de la sesión |
| `sessionKey` | string | No | Clave de la sesión |
| `to` | string | No | Destino de envío (canal) |
| `channel` | string | No | Nombre del canal |
| `accountId` | string | No | ID de la cuenta |
| `thinking` | string | No | Contenido del pensamiento |
| `deliver` | boolean | No | Si enviar al canal |
| `attachments` | array | No | Lista de archivos adjuntos |
| `timeout` | number | No | Tiempo de espera (milisegundos) |
| `lane` | string | No | Canal de programación |
| `extraSystemPrompt` | string | No | Indicación de sistema adicional |
| `idempotencyKey` | string | Sí | Clave de idempotencia, previene duplicados |

**Respuesta**:

La respuesta del Agente se envía en streaming a través de marcos de eventos:

```json
// Evento de pensamiento
{
  "type": "event",
  "event": "agent.event",
  "payload": {
    "runId": "run-123",
    "seq": 0,
    "stream": "thinking",
    "ts": 1706707200000,
    "data": {
      "content": "Pensando..."
    }
  }
}

// Evento de mensaje
{
  "type": "event",
  "event": "agent.event",
  "payload": {
    "runId": "run-123",
    "seq": 1,
    "stream": "message",
    "ts": 1706707200000,
    "data": {
      "role": "assistant",
      "content": "¡Hola! Este es un Hello World..."
    }
  }
}
```

#### `agent.wait` - Esperar a que el Agente Termine

Esperar a que termine la tarea del Agente.

```json
{
  "type": "req",
  "id": "req-2",
  "method": "agent.wait",
  "params": {
    "runId": "run-123",
    "timeoutMs": 30000
  }
}
```

### Métodos de Envío

#### `send` - Enviar Mensaje al Canal

Enviar mensaje al canal especificado.

```json
{
  "type": "req",
  "id": "req-3",
  "method": "send",
  "params": {
    "to": "+1234567890",
    "message": "¡Hola desde Clawdbot!",
    "channel": "whatsapp",
    "idempotencyKey": "send-123"
  }
}
```

**Descripción de Parámetros**:

| Parámetro | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `to` | string | Sí | Identificador del destinatario (número de teléfono, ID de usuario, etc.) |
| `message` | string | Sí | Contenido del mensaje |
| `mediaUrl` | string | No | URL del medio |
| `mediaUrls` | array | No | Lista de URLs de medios |
| `channel` | string | No | Nombre del canal |
| `accountId` | string | No | ID de la cuenta |
| `sessionKey` | string | No | Clave de sesión (usada para salida espejo) |
| `idempotencyKey` | string | Sí | Clave de idempotencia |

### Métodos de Encuesta

#### `poll` - Crear Encuesta

Crear encuesta y enviar al canal.

```json
{
  "type": "req",
  "id": "req-4",
  "method": "poll",
  "params": {
    "to": "+1234567890",
    "question": "¿Cuál es tu lenguaje de programación favorito?",
    "options": ["Python", "JavaScript", "Go", "Rust"],
    "maxSelections": 1,
    "durationHours": 24,
    "channel": "telegram",
    "idempotencyKey": "poll-123"
  }
}
```

### Métodos de Sesiones

#### `sessions.list` - Listar Sesiones

Listar todas las sesiones activas.

```json
{
  "type": "req",
  "id": "req-5",
  "method": "sessions.list",
  "params": {
    "limit": 50,
    "activeMinutes": 60,
    "includeDerivedTitles": true,
    "includeLastMessage": true
  }
}
```

**Descripción de Parámetros**:

| Parámetro | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `limit` | number | No | Cantidad máxima a retornar |
| `activeMinutes` | number | No | Filtrar sesiones activas recientemente (minutos) |
| `includeGlobal` | boolean | No | Incluir sesiones globales |
| `includeUnknown` | boolean | No | Incluir sesiones desconocidas |
| `includeDerivedTitles` | boolean | No | Derivar títulos de la primera línea del mensaje |
| `includeLastMessage` | boolean | No | Incluir vista previa del último mensaje |
| `label` | string | No | Filtrar por etiqueta |
| `agentId` | string | No | Filtrar por ID de Agente |
| `search` | string | No | Palabras clave de búsqueda |

#### `sessions.patch` - Modificar Configuración de Sesión

Modificar los parámetros de configuración de la sesión.

```json
{
  "type": "req",
  "id": "req-6",
  "method": "sessions.patch",
  "params": {
    "key": "main",
    "label": "Sesión Principal",
    "thinkingLevel": "minimal",
    "responseUsage": "tokens",
    "model": "claude-sonnet-4-20250514"
  }
}
```

#### `sessions.reset` - Restablecer Sesión

Vaciar el historial de la sesión.

```json
{
  "type": "req",
  "id": "req-7",
  "method": "sessions.reset",
  "params": {
    "key": "main"
  }
}
```

#### `sessions.delete` - Eliminar Sesión

Eliminar la sesión y su historial.

```json
{
  "type": "req",
  "id": "req-8",
  "method": "sessions.delete",
  "params": {
    "key": "session-123",
    "deleteTranscript": true
  }
}
```

#### `sessions.compact` - Comprimir Historial de Sesión

Comprimir el historial de la sesión para reducir el tamaño del contexto.

```json
{
  "type": "req",
  "id": "req-9",
  "method": "sessions.compact",
  "params": {
    "key": "main",
    "maxLines": 100
  }
}
```

### Métodos de Configuración

#### `config.get` - Obtener Configuración

Obtener la configuración actual.

```json
{
  "type": "req",
  "id": "req-10",
  "method": "config.get",
  "params": {}
}
```

#### `config.set` - Establecer Configuración

Establecer nueva configuración.

```json
{
  "type": "req",
  "id": "req-11",
  "method": "config.set",
  "params": {
    "raw": "{\"agent\":{\"model\":\"claude-sonnet-4-20250514\"}}",
    "baseHash": "previous-config-hash"
  }
}
```

#### `config.apply` - Aplicar Configuración y Reiniciar

Aplicar configuración y reiniciar Gateway.

```json
{
  "type": "req",
  "id": "req-12",
  "method": "config.apply",
  "params": {
    "raw": "{\"agent\":{\"model\":\"claude-sonnet-4-20250514\"}}",
    "baseHash": "previous-config-hash",
    "restartDelayMs": 1000
  }
}
```

#### `config.schema` - Obtener Schema de Configuración

Obtener la definición del Schema de configuración.

```json
{
  "type": "req",
  "id": "req-13",
  "method": "config.schema",
  "params": {}
}
```

### Métodos de Canales

#### `channels.status` - Obtener Estado de Canales

Obtener el estado de todos los canales.

```json
{
  "type": "req",
  "id": "req-14",
  "method": "channels.status",
  "params": {
    "probe": true,
    "timeoutMs": 5000
  }
}
```

**Ejemplo de Respuesta**:

```json
{
  "type": "res",
  "id": "req-14",
  "ok": true,
  "payload": {
    "ts": 1706707200000,
    "channelOrder": ["whatsapp", "telegram", "slack"],
    "channelLabels": {
      "whatsapp": "WhatsApp",
      "telegram": "Telegram",
      "slack": "Slack"
    },
    "channelAccounts": {
      "whatsapp": [
        {
          "accountId": "wa-123",
          "enabled": true,
          "linked": true,
          "connected": true,
          "lastConnectedAt": 1706707200000
        }
      ]
    }
  }
}
```

#### `channels.logout` - Cerrar Sesión de Canal

Cerrar sesión del canal especificado.

```json
{
  "type": "req",
  "id": "req-15",
  "method": "channels.logout",
  "params": {
    "channel": "whatsapp",
    "accountId": "wa-123"
  }
}
```

### Métodos de Modelos

#### `models.list` - Listar Modelos Disponibles

Listar todos los modelos de IA disponibles.

```json
{
  "type": "req",
  "id": "req-16",
  "method": "models.list",
  "params": {}
}
```

**Ejemplo de Respuesta**:

```json
{
  "type": "res",
  "id": "req-16",
  "ok": true,
  "payload": {
    "models": [
      {
        "id": "claude-sonnet-4-20250514",
        "name": "Claude Sonnet 4",
        "provider": "anthropic",
        "contextWindow": 200000,
        "reasoning": true
      },
      {
        "id": "gpt-4o",
        "name": "GPT-4o",
        "provider": "openai",
        "contextWindow": 128000,
        "reasoning": false
      }
    ]
  }
}
```

### Métodos de Agentes

#### `agents.list` - Listar Todos los Agentes

Listar todos los Agentes disponibles.

```json
{
  "type": "req",
  "id": "req-17",
  "method": "agents.list",
  "params": {}
}
```

**Ejemplo de Respuesta**:

```json
{
  "type": "res",
  "id": "req-17",
  "ok": true,
  "payload": {
    "defaultId": "default",
    "mainKey": "main",
    "scope": "per-sender",
    "agents": [
      {
        "id": "default",
        "name": "Default Agent",
        "identity": {
          "name": "Clawdbot",
          "theme": "default",
          "emoji": "🤖"
        }
      }
    ]
  }
}
```

### Métodos de Cron

#### `cron.list` - Listar Tareas Programadas

Listar todas las tareas programadas.

```json
{
  "type": "req",
  "id": "req-18",
  "method": "cron.list",
  "params": {
    "includeDisabled": true
  }
}
```

#### `cron.add` - Agregar Tarea Programada

Agregar una nueva tarea programada.

```json
{
  "type": "req",
  "id": "req-19",
  "method": "cron.add",
  "params": {
    "name": "Reporte Diario",
    "description": "Generar informe diario a las 8 AM",
    "enabled": true,
    "schedule": {
      "kind": "cron",
      "expr": "0 8 * * *",
      "tz": "Asia/Shanghai"
    },
    "sessionTarget": "main",
    "wakeMode": "now",
    "payload": {
      "kind": "agentTurn",
      "message": "Por favor genera el informe de trabajo de hoy",
      "channel": "last"
    }
  }
}
```

#### `cron.run` - Ejecutar Tarea Programada Manualmente

Ejecutar manualmente la tarea programada especificada.

```json
{
  "type": "req",
  "id": "req-20",
  "method": "cron.run",
  "params": {
    "id": "cron-123",
    "mode": "force"
  }
}
```

### Métodos de Nodos

#### `nodes.list` - Listar Todos los Nodos

Listar todos los nodos de dispositivos emparejados.

```json
{
  "type": "req",
  "id": "req-21",
  "method": "nodes.list",
  "params": {}
}
```

#### `nodes.describe` - Obtener Detalles del Nodo

Obtener información detallada del nodo especificado.

```json
{
  "type": "req",
  "id": "req-22",
  "method": "nodes.describe",
  "params": {
    "nodeId": "ios-node-123"
  }
}
```

#### `nodes.invoke` - Invocar Comando de Nodo

Ejecutar comando en el nodo.

```json
{
  "type": "req",
  "id": "req-23",
  "method": "nodes.invoke",
  "params": {
    "nodeId": "ios-node-123",
    "command": "camera.snap",
    "params": {
      "quality": "high"
    },
    "timeoutMs": 10000,
    "idempotencyKey": "invoke-123"
  }
}
```

#### `nodes.pair.list` - Listar Nodos en Espera de Emparejamiento

Listar todas las solicitudes de nodos esperando emparejamiento.

```json
{
  "type": "req",
  "id": "req-24",
  "method": "nodes.pair.list",
  "params": {}
}
```

#### `nodes.pair.approve` - Aprobar Emparejamiento de Nodo

Aprobar la solicitud de emparejamiento de nodo.

```json
{
  "type": "req",
  "id": "req-25",
  "method": "nodes.pair.approve",
  "params": {
    "requestId": "pair-req-123"
  }
}
```

#### `nodes.pair.reject` - Rechazar Emparejamiento de Nodo

Rechazar la solicitud de emparejamiento de nodo.

```json
{
  "type": "req",
  "id": "req-26",
  "method": "nodes.pair.reject",
  "params": {
    "requestId": "pair-req-123"
  }
}
```

#### `nodes.rename` - Renombrar Nodo

Renombrar el nodo.

```json
{
  "type": "req",
  "id": "req-27",
  "method": "nodes.rename",
  "params": {
    "nodeId": "ios-node-123",
    "displayName": "Mi iPhone"
  }
}
```

### Métodos de Registros

#### `logs.tail` - Obtener Registros

Obtener los registros de Gateway.

```json
{
  "type": "req",
  "id": "req-28",
  "method": "logs.tail",
  "params": {
    "cursor": 0,
    "limit": 100,
    "maxBytes": 100000
  }
}
```

**Ejemplo de Respuesta**:

```json
{
  "type": "res",
  "id": "req-28",
  "ok": true,
  "payload": {
    "file": "/path/to/gateway.log",
    "cursor": 123456,
    "size": 4567890,
    "lines": [
      "[2025-01-27 10:00:00] INFO: Iniciando Gateway...",
      "[2025-01-27 10:00:01] INFO: Conectado a WhatsApp"
    ],
    "truncated": false
  }
}
```

### Métodos de Habilidades

#### `skills.status` - Obtener Estado de Habilidades

Obtener el estado de todas las habilidades.

```json
{
  "type": "req",
  "id": "req-29",
  "method": "skills.status",
  "params": {}
}
```

#### `skills.bins` - Listar Bibliotecas de Habilidades

Listar las bibliotecas de habilidades disponibles.

```json
{
  "type": "req",
  "id": "req-30",
  "method": "skills.bins",
  "params": {}
}
```

#### `skills.install` - Instalar Habilidad

Instalar la habilidad especificada.

```json
{
  "type": "req",
  "id": "req-31",
  "method": "skills.install",
  "params": {
    "name": "my-custom-skill",
    "installId": "install-123",
    "timeoutMs": 60000
  }
}
```

### Métodos de WebChat

#### `chat.send` - Enviar Mensaje de Chat (WebChat)

Método de chat dedicado para WebChat.

```json
{
  "type": "req",
  "id": "req-32",
  "method": "chat.send",
  "params": {
    "sessionKey": "main",
    "message": "¡Hola desde WebChat!",
    "thinking": "Respondiendo...",
    "deliver": true,
    "idempotencyKey": "chat-123"
  }
}
```

#### `chat.history` - Obtener Historial de Chat

Obtener los mensajes históricos de la sesión especificada.

```json
{
  "type": "req",
  "id": "req-33",
  "method": "chat.history",
  "params": {
    "sessionKey": "main",
    "limit": 50
  }
}
```

#### `chat.abort` - Abortar Chat

Abortar el chat en curso.

```json
{
  "type": "req",
  "id": "req-34",
  "method": "chat.abort",
  "params": {
    "sessionKey": "main",
    "runId": "run-123"
  }
}
```

### Métodos de Wizard

#### `wizard.start` - Iniciar Wizard

Iniciar el wizard de configuración.

```json
{
  "type": "req",
  "id": "req-35",
  "method": "wizard.start",
  "params": {}
}
```

#### `wizard.next` - Siguiente Paso del Wizard

Ejecutar el siguiente paso del wizard.

```json
{
  "type": "req",
  "id": "req-36",
  "method": "wizard.next",
  "params": {
    "stepId": "step-1",
    "response": {
      "selectedOption": "option-1"
    }
  }
}
```

#### `wizard.cancel` - Cancelar Wizard

Cancelar el wizard en curso.

```json
{
  "type": "req",
  "id": "req-37",
  "method": "wizard.cancel",
  "params": {}
}
```

### Métodos del Sistema

#### `status` - Obtener Estado del Sistema

Obtener el estado del sistema Gateway.

```json
{
  "type": "req",
  "id": "req-38",
  "method": "status",
  "params": {}
}
```

#### `last-heartbeat` - Obtener Última Hora de Latido

Obtener la última hora de latido del corazón de Gateway.

```json
{
  "type": "req",
  "id": "req-39",
  "method": "last-heartbeat",
  "params": {}
}
```

### Métodos de Uso

#### `usage.status` - Obtener Estadísticas de Uso

Obtener estadísticas de uso de Tokens.

```json
{
  "type": "req",
  "id": "req-40",
  "method": "usage.status",
  "params": {}
}
```

#### `usage.cost` - Obtener Estadísticas de Costos

Obtener estadísticas de costos de llamadas API.

```json
{
  "type": "req",
  "id": "req-41",
  "method": "usage.cost",
  "params": {}
}
```

## Manejo de Errores

### Códigos de Error

Todas las respuestas de error contienen código de error y descripción:

| Código de Error | Descripción | Reintentable |
| --- | --- | --- |
| `NOT_LINKED` | Nodo no vinculado | Sí |
| `NOT_PAIRED` | Nodo no emparejado | No |
| `AGENT_TIMEOUT` | Tiempo de espera del Agente | Sí |
| `INVALID_REQUEST` | Solicitud inválida | No |
| `UNAVAILABLE` | Servicio no disponible | Sí |

### Formato de Respuesta de Error

```json
{
  "type": "res",
  "id": "req-1",
  "ok": false,
  "error": {
    "code": "AGENT_TIMEOUT",
    "message": "Agent response timeout",
    "retryable": true,
    "retryAfterMs": 5000
  }
}
```

### Recomendaciones para Manejo de Errores

1. **Verificar el campo `retryable`**: Si es `true`, se puede reintentar después del retraso especificado en `retryAfterMs`
2. **Registrar detalles del error**: Registrar `code` y `message` para depuración
3. **Validar parámetros**: `INVALID_REQUEST` generalmente indica falla en validación de parámetros
4. **Verificar estado de conexión**: `NOT_LINKED` indica que la conexión se ha perdido, se necesita reconectar

## Mecanismo de Latido del Corazón

Gateway enviará eventos de latido del corazón periódicamente:

```json
{
  "type": "event",
  "event": "tick",
  "payload": {
    "ts": 1706707200000
  }
}
```

::: tip Manejo de Latido
El cliente debe:
1. Escuchar el evento `tick`
2. Actualizar la hora del último latido
3. Si no se recibe latido por más de `3 * tickIntervalMs`, considerar reconectar
:::

## Ejemplo Completo

### Ejemplo de Cliente JavaScript

```javascript
const WebSocket = require('ws');

class GatewayClient {
  constructor(url, token) {
    this.url = url;
    this.token = token;
    this.ws = null;
    this.requestId = 0;
    this.pendingRequests = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);

      this.ws.on('open', () => {
        // Enviar mensaje de handshake
        this.sendHandshake();
        resolve();
      });

      this.ws.on('message', (data) => {
        this.handleMessage(JSON.parse(data));
      });

      this.ws.on('error', (error) => {
        reject(error);
      });

      this.ws.on('close', () => {
        console.log('WebSocket desconectado');
      });
    });
  }

  sendHandshake() {
    this.ws.send(JSON.stringify({
      minProtocol: 1,
      maxProtocol: 3,
      client: {
        id: 'my-client',
        displayName: 'Mi Cliente Gateway',
        version: '1.0.0',
        platform: 'node',
        mode: 'operator'
      },
      auth: {
        token: this.token
      }
    }));
  }

  async request(method, params = {}) {
    const id = `req-${++this.requestId}`;
    
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      
      this.ws.send(JSON.stringify({
        type: 'req',
        id,
        method,
        params
      }));

      // Establecer tiempo de espera
      setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error('Tiempo de espera de solicitud'));
      }, 30000);
    });
  }

  handleMessage(message) {
    if (message.type === 'res') {
      const { id, ok, payload, error } = message;
      const pending = this.pendingRequests.get(id);
      
      if (pending) {
        this.pendingRequests.delete(id);
        if (ok) {
          pending.resolve(payload);
        } else {
          pending.reject(new Error(`${error.code}: ${error.message}`));
        }
      }
    } else if (message.type === 'event') {
      this.handleEvent(message);
    }
  }

  handleEvent(event) {
    console.log('Evento recibido:', event.event, event.payload);
  }

  async sendAgentMessage(message) {
    return this.request('agent', {
      message,
      idempotencyKey: `msg-${Date.now()}`
    });
  }

  async listSessions() {
    return this.request('sessions.list', {
      limit: 50,
      includeLastMessage: true
    });
  }

  async getChannelsStatus() {
    return this.request('channels.status', {
      probe: true
    });
  }
}

// Ejemplo de uso
(async () => {
  const client = new GatewayClient('ws://127.0.0.1:18789/v1/connect', 'your-token');
  await client.connect();

  // Enviar mensaje al Agente
  const response = await client.sendAgentMessage('¡Hola!');
  console.log('Respuesta del Agente:', response);

  // Listar sesiones
  const sessions = await client.listSessions();
  console.log('Lista de sesiones:', sessions);

  // Obtener estado de canales
  const channels = await client.getChannelsStatus();
  console.log('Estado de canales:', channels);
})();
```

## Resumen de la Lección

Este tutorial ha introducido en detalle el Protocolo API WebSocket de Clawdbot Gateway, incluyendo:

- ✅ Flujo de handshake de conexión y mecanismo de autenticación
- ✅ Tres tipos de marcos de mensajes (solicitud, respuesta, evento)
- ✅ Referencia de métodos principales (Agente, Enviar, Sesiones, Configuración, etc.)
- ✅ Sistema de permisos y gestión de roles
- ✅ Manejo de errores y estrategias de reintento
- ✅ Mecanismo de latido del corazón y gestión de conexiones
- ✅ Ejemplo completo de cliente JavaScript

## Próxima Lección

> La próxima lección aprenderemos sobre **[Referencia Completa de Configuración](../config-reference/)**.
>
> Aprenderás:
> - Descripción detallada de todos los elementos de configuración
> - Schema de configuración y valores predeterminados
> - Mecanismo de reemplazo de variables de entorno
> - Validación de configuración y manejo de errores

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-27

| Función | Ruta del Archivo | Número de Línea |
|---|---|---|
| Entrada del protocolo y validador | `src/gateway/protocol/index.ts` | 1-521 |
| Definición de tipos de marco básicos | `src/gateway/protocol/schema/frames.ts` | 1-165 |
| Definición de versión del protocolo | `src/gateway/protocol/schema/protocol-schemas.ts` | 231 |
| Definición de códigos de error | `src/gateway/protocol/schema/error-codes.ts` | 3-24 |
| Schema relacionado con Agente | `src/gateway/protocol/schema/agent.ts` | 1-107 |
| Schema de Chat/Registros | `src/gateway/protocol/schema/logs-chat.ts` | 1-83 |
| Schema de Sesiones | `src/gateway/protocol/schema/sessions.ts` | 1-105 |
| Schema de Configuración | `src/gateway/protocol/schema/config.ts` | 1-72 |
| Schema de Nodos | `src/gateway/protocol/schema/nodes.ts` | 1-103 |
| Schema de Cron | `src/gateway/protocol/schema/cron.ts` | 1-246 |
| Schema de Canales | `src/gateway/protocol/schema/channels.ts` | 1-108 |
| Schema de Modelos/Agentes/Habilidades | `src/gateway/protocol/schema/agents-models-skills.ts` | 1-86 |
| Procesador de solicitudes | `src/gateway/server-methods.ts` | 1-200 |
| Lógica de verificación de permisos | `src/gateway/server-methods.ts` | 91-144 |
| Definición de instantánea de estado | `src/gateway/protocol/schema/snapshot.ts` | 1-58 |

**Constantes Clave**:
- `PROTOCOL_VERSION = 3`: Versión actual del protocolo
- `ErrorCodes`: Enumeración de códigos de error (NOT_LINKED, NOT_PAIRED, AGENT_TIMEOUT, INVALID_REQUEST, UNAVAILABLE)

**Tipos Clave**:
- `GatewayFrame`: Tipo de unión de marco de gateway (RequestFrame | ResponseFrame | EventFrame)
- `RequestFrame`: Tipo de marco de solicitud
- `ResponseFrame`: Tipo de marco de respuesta
- `EventFrame`: Tipo de marco de evento
- `HelloOk`: Tipo de respuesta exitosa de handshake
- `ErrorShape`: Tipo de forma de error

</details>
