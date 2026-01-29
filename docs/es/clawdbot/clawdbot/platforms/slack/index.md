---
title: "Guía completa de configuración del canal de Slack: Modo Socket/HTTP, configuración de seguridad | Tutorial de Clawdbot"
sidebarTitle: "Slack también usa IA"
subtitle: "Guía completa de configuración del canal de Slack | Tutorial de Clawdbot"
description: "Aprende a configurar y usar el canal de Slack en Clawdbot. Este tutorial cubre dos métodos de conexión: Socket Mode y HTTP Mode, pasos para obtener Tokens, configuración de seguridad de DM, estrategias de gestión de grupos y uso de herramientas de Slack Actions."
tags:
  - "plataformas"
  - "slack"
  - "configuración"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 90
---

# Guía completa de configuración del canal de Slack

## Lo que aprenderás

- ✅ Interactuar con Clawdbot en Slack, usando el asistente de IA para completar tareas
- ✅ Configurar políticas de seguridad de DM para proteger la privacidad personal
- ✅ Integrar Clawdbot en grupos, respondiendo inteligentemente a menciones @ y comandos
- ✅ Usar herramientas de Slack Actions (enviar mensajes, gestionar Pins, ver información de miembros, etc.)
- ✅ Elegir entre dos métodos de conexión: Socket Mode o HTTP Mode

## Tu situación actual

Slack es una herramienta central para la colaboración en equipo, pero puedes encontrar los siguientes problemas:

- Las discusiones del equipo están dispersas en múltiples canales, perdiendo información importante
- Necesitas consultar rápidamente mensajes históricos, Pins o información de miembros, pero la interfaz de Slack no es lo suficientemente conveniente
- Deseas usar capacidades de IA directamente en Slack sin cambiar a otras aplicaciones
- Te preocupa que habilitar el asistente de IA en grupos cause un exceso de mensajes o fugas de privacidad

## Cuándo usar esto

- **Comunicación diaria del equipo**: Slack es tu principal herramienta de comunicación del equipo
- **Necesitas integración nativa de Slack**: aprovechar funciones como Reaction, Pin, Thread, etc.
- **Necesidad de múltiples cuentas**: conectar múltiples Slack Workspaces
- **Escenarios de implementación remota**: usar HTTP Mode para conectar a un Gateway remoto

## 🎒 Preparativos

::: warning Verificación previa
Antes de comenzar, confirma:
- Has completado el tutorial [Inicio rápido](../../start/getting-started/)
- Gateway se ha iniciado y está ejecutándose
- Tienes permisos de administrador del Slack Workspace (para crear App)
:::

**Recursos que necesitas**:
- [Consola de la API de Slack](https://api.slack.com/apps) - crear y gestionar Slack App
- Archivo de configuración de Clawdbot - generalmente ubicado en `~/.clawdbot/clawdbot.json`

## Concepto central

El canal de Slack de Clawdbot se implementa basándose en el framework [Bolt](https://slack.dev/bolt-js), admitiendo dos modos de conexión:

| Modo | Escenario adecuado | Ventajas | Desventajas |
|--- | --- | --- | ---|
| **Socket Mode** | Gateway local, uso personal | Configuración sencilla (solo Token) | Requiere conexión WebSocket constante |
| **HTTP Mode** | Servidor, acceso remoto | Atraviesa firewalls, admite equilibrio de carga | Requiere IP pública, configuración compleja |

**Por defecto se usa Socket Mode**, adecuado para la mayoría de usuarios.

**Mecanismo de autenticación**:
- **Bot Token** (`xoxb-...`) - obligatorio, para llamadas a la API
- **App Token** (`xapp-...`) - obligatorio para Socket Mode, para conexión WebSocket
- **User Token** (`xoxp-...`) - opcional, para operaciones de solo lectura (historial, Pins, Reactions)
- **Signing Secret** - obligatorio para HTTP Mode, para verificar solicitudes Webhook

## Sigue estos pasos

### Paso 1: Crear una Slack App

**Por qué**
Slack App es el puente entre Clawdbot y el Workspace, proporcionando autenticación y control de permisos.

1. Visita la [Consola de la API de Slack](https://api.slack.com/apps)
2. Haz clic en **Create New App** → elige **From scratch**
3. Rellena la información de la App:
   - **App Name**: `Clawdbot` (o el nombre que prefieras)
   - **Pick a workspace to develop your app in**: elige tu Workspace
4. Haz clic en **Create App**

**Deberías ver**:
App creada exitosamente, entrando en la página de configuración básica.

### Paso 2: Configurar Socket Mode (recomendado)

::: tip Sugerencia
Si usas un Gateway local, se recomienda Socket Mode, configuración más sencilla.
:::

**Por qué**
Socket Mode no requiere una IP pública, se conecta a través del servicio WebSocket de Slack.

1. En la página de configuración de la App, busca **Socket Mode**, cámbialo a **On**
2. Desplázate hasta **App-Level Tokens**, haz clic en **Generate Token and Scopes**
3. En la sección **Token**, selecciona el scope:
   - Marca `connections:write`
4. Haz clic en **Generate Token**, copia el **App Token** generado (comienza con `xapp-`)

**Deberías ver**:
El Token generado es similar a: `xapp-1-A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P`

::: danger Aviso de seguridad
El App Token es información sensible, guárdalo adecuadamente, no lo filtres en repositorios públicos.
:::

### Paso 3: Configurar Bot Token y permisos

1. Desplázate hasta **OAuth & Permissions** → **Bot Token Scopes**
2. Agrega los siguientes scopes (permisos):

**Bot Token Scopes (obligatorios)**:

```yaml
    chat:write                    # enviar/editar/eliminar mensajes
    channels:history              # leer historial de canales
    channels:read                 # obtener información de canales
    groups:history                # leer historial de grupos
    groups:read                   # obtener información de grupos
    im:history                   # leer historial de DM
    im:read                      # obtener información de DM
    im:write                     # abrir sesión DM
    mpim:history                # leer historial de DM de grupos
    mpim:read                   # obtener información de DM de grupos
    users:read                   # consultar información de usuarios
    app_mentions:read            # leer menciones @
    reactions:read               # leer Reactions
    reactions:write              # agregar/eliminar Reactions
    pins:read                    # leer lista de Pins
    pins:write                   # agregar/eliminar Pins
    emoji:read                   # leer Emojis personalizados
    commands                     # procesar comandos de barra
    files:read                   # leer información de archivos
    files:write                  # subir archivos
```

::: info Explicación
Los anteriores son permisos obligatorios del **Bot Token**, asegurando que el Bot pueda leer mensajes normalmente, enviar respuestas, gestionar Reactions y Pins.
:::

3. Desplázate hasta la parte superior de la página, haz clic en **Install to Workspace**
4. Haz clic en **Allow** para autorizar la App a acceder a tu Workspace
5. Copia el **Bot User OAuth Token** generado (comienza con `xoxb-`)

**Deberías ver**:
Token similar a: `xoxb-YOUR-BOT-TOKEN-HERE`

::: tip Sugerencia
Si necesitas un **User Token** (para operaciones de solo lectura), desplázate hasta **User Token Scopes** y agrega los siguientes permisos:
- `channels:history`, `groups:history`, `im:history`, `mpim:history`
- `channels:read`, `groups:read`, `im:read`, `mpim:read`
- `users:read`, `reactions:read`, `pins:read`, `emoji:read`
- `search:read`

Luego copia el **User OAuth Token** (comienza con `xoxp-`) en la página **Install App**.

**User Token Scopes (opcional, solo lectura)**:
- Solo se usa para leer historial, Reactions, Pins, Emojis y búsquedas
- Las operaciones de escritura aún usan Bot Token (a menos que se configure `userTokenReadOnly: false`)
:::

### Paso 4: Configurar suscripción de eventos

1. En la página de configuración de la App, busca **Event Subscriptions**, activa **Enable Events**
2. En **Subscribe to bot events** agrega los siguientes eventos:

```yaml
    app_mention                  # @ mención al Bot
    message.channels              # mensajes de canales
    message.groups               # mensajes de grupos
    message.im                   # mensajes DM
    message.mpim                # mensajes DM de grupos
    reaction_added               # agregar Reaction
    reaction_removed             # eliminar Reaction
    member_joined_channel       # miembro se une al canal
    member_left_channel          # miembro abandona el canal
    channel_rename               # renombrar canal
    pin_added                   # agregar Pin
    pin_removed                 # eliminar Pin
```

3. Haz clic en **Save Changes**

### Paso 5: Activar funcionalidad de DM

1. En la página de configuración de la App, busca **App Home**
2. Activa **Messages Tab** → activa **Enable Messages Tab**
3. Asegúrate de que muestre **Messages tab read-only disabled: No**

**Deberías ver**:
Messages Tab activado, los usuarios pueden tener conversaciones DM con el Bot.

### Paso 6: Configurar Clawdbot

**Por qué**
Configurar los Tokens de Slack en Clawdbot para establecer la conexión.

#### Método 1: Usar variables de entorno (recomendado)

```bash
    # configurar variables de entorno
    export SLACK_BOT_TOKEN="xoxb-你的BotToken"
    export SLACK_APP_TOKEN="xapp-你的AppToken"

    # reiniciar Gateway
    clawdbot gateway restart
```

**Deberías ver**:
En el registro de inicio de Gateway se muestra `Slack: connected`.

#### Método 2: Archivo de configuración

Edita `~/.clawdbot/clawdbot.json`:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-你的BotToken",
      "appToken": "xapp-你的AppToken"
    }
  }
}
```

**Si tienes User Token**:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-你的BotToken",
      "appToken": "xapp-你的AppToken",
      "userToken": "xoxp-你的UserToken",
      "userTokenReadOnly": true
    }
  }
}
```

**Deberías ver**:
Después de reiniciar Gateway, la conexión de Slack se establece correctamente.

### Paso 7: Invitar el Bot al canal

1. En Slack, abre el canal donde quieres que se una el Bot
2. Escribe `/invite @Clawdbot` (reemplaza con el nombre de tu Bot)
3. Haz clic en **Add to channel**

**Deberías ver**:
El Bot se une al canal exitosamente y muestra "Clawdbot has joined the channel".

### Paso 8: Configurar políticas de seguridad de grupos

**Por qué**
Evitar que el Bot responda automáticamente en todos los canales, protegiendo la privacidad.

Edita `~/.clawdbot/clawdbot.json`:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-你的BotToken",
      "appToken": "xapp-你的AppToken",
      "groupPolicy": "allowlist",
      "channels": {
        "C1234567890": {
          "allow": true,
          "requireMention": true
        },
        "#general": {
          "allow": true,
          "requireMention": true
        }
      }
    }
  }
}
```

**Descripción de campos**:
- `groupPolicy`: política de grupos
  - `"open"` - permitir todos los canales (no recomendado)
  - `"allowlist"` - permitir solo canales listados (recomendado)
  - `"disabled"` - prohibir todos los canales
- `channels`: configuración de canales
  - `allow`: permitir/denegar
  - `requireMention`: si se requiere mención @ al Bot para responder (predeterminado `true`)
  - `users`: lista blanca de usuarios adicional
  - `skills`: habilidades limitadas para el canal
  - `systemPrompt`: prompt del sistema adicional

**Deberías ver**:
El Bot solo responde mensajes en canales configurados y requiere mención @.

### Paso 9: Configurar políticas de seguridad de DM

**Por qué**
Evitar que desconocidos interactúen con el Bot a través de DM, protegiendo la privacidad.

Edita `~/.clawdbot/clawdbot.json`:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-你的BotToken",
      "appToken": "xapp-你的AppToken",
      "dm": {
        "enabled": true,
        "policy": "pairing",
        "allowFrom": ["U1234567890", "@alice", "user@example.com"]
      }
    }
  }
}
```

**Descripción de campos**:
- `dm.enabled`: activar/desactivar DM (predeterminado `true`)
- `dm.policy`: política de DM
  - `"pairing"` - desconocidos reciben código de emparejamiento, requieren aprobación (predeterminado)
  - `"open"` - permitir cualquier DM
  - `"allowlist"` - solo permitir usuarios en lista blanca
- `dm.allowFrom`: lista blanca
  - admite ID de usuario (`U1234567890`)
  - admite mención @ (`@alice`)
  - admite correo electrónico (`user@example.com`)

**Proceso de emparejamiento**:
1. Un desconocido envía DM al Bot
2. El Bot responde con un código de emparejamiento (válido por 1 hora)
3. El usuario proporciona el código de emparejamiento al administrador
4. El administrador ejecuta: `clawdbot pairing approve slack <código de emparejamiento>`
5. El usuario se agrega a la lista blanca y puede usar normalmente

**Deberías ver**:
Los remitentes desconocidos reciben un código de emparejamiento, el Bot no procesa sus mensajes.

### Paso 10: Probar el Bot

1. En el canal configurado, envía un mensaje: `@Clawdbot Hola`
2. O envía DM al Bot
3. Observa la respuesta del Bot

**Deberías ver**:
El Bot responde normalmente a tus mensajes.

### Punto de control ✅

- [ ] Slack App creada exitosamente
- [ ] Socket Mode activado
- [ ] Bot Token y App Token copiados
- [ ] Archivo de configuración de Clawdbot actualizado
- [ ] Gateway reiniciado
- [ ] Bot invitado al canal
- [ ] Política de seguridad de grupos configurada
- [ ] Política de seguridad de DM configurada
- [ ] Mensajes de prueba reciben respuestas


## Advertencias de problemas comunes

### Error común 1: Bot no responde

**Problema**: después de enviar un mensaje, el Bot no responde.

**Causas posibles**:
1. El Bot no se ha unido al canal → usa `/invite @Clawdbot` para invitar
2. `requireMention` está configurado como `true` → al enviar mensajes necesitas `@Clawdbot`
3. Token configurado incorrectamente → verifica si el Token en `clawdbot.json` es correcto
4. Gateway no está ejecutándose → ejecuta `clawdbot gateway status` para verificar el estado

### Error común 2: Fallo de conexión en Socket Mode

**Problema**: el registro de Gateway muestra fallo de conexión.

**Solución**:
1. Verifica si el App Token es correcto (comienza con `xapp-`)
2. Verifica si Socket Mode está activado
3. Verifica la conexión de red

### Error común 3: Permisos insuficientes de User Token

**Problema**: algunas operaciones fallan, mostrando error de permisos.

**Solución**:
1. Asegúrate de que el User Token contiene los permisos necesarios (ver Paso 3)
2. Verifica la configuración de `userTokenReadOnly` (predeterminado `true`, solo lectura)
3. Si necesitas operaciones de escritura, configura `"userTokenReadOnly": false`

### Error común 4: Fallo de resolución de ID de canal

**Problema**: el nombre del canal configurado no se puede resolver como ID.

**Solución**:
1. Usa preferiblemente el ID del canal (como `C1234567890`) en lugar del nombre
2. Asegúrate de que el nombre del canal comience con `#` (como `#general`)
3. Verifica si el Bot tiene permisos para acceder a ese canal

## Configuración avanzada

### Explicación de permisos

::: info Bot Token vs User Token
- **Bot Token**: obligatorio, para funciones principales del Bot (enviar mensajes, leer historial, gestionar Pins/Reactions, etc.)
- **User Token**: opcional, solo para operaciones de solo lectura (historial, Reactions, Pins, Emojis, búsqueda)
  - Predeterminado `userTokenReadOnly: true`, asegurando solo lectura
  - Las operaciones de escritura (enviar mensajes, agregar Reactions, etc.) aún usan Bot Token
:::

**Permisos que pueden ser necesarios en el futuro**:

Los siguientes permisos no son obligatorios en la versión actual, pero se pueden agregar soporte en el futuro:

| Permiso | Propósito |
|--- | ---|
| `groups:write` | Gestión de canales privados (crear, renombrar, invitar, archivar) |
| `mpim:write` | Gestión de sesiones DM de grupos |
| `chat:write.public` | Publicar mensajes en canales donde el Bot no se ha unido |
| `files:read` | Listar/leer metadatos de archivos |

Si necesitas habilitar estas funciones, agrega los permisos correspondientes en **Bot Token Scopes** de la Slack App.

### HTTP Mode (servidor)

Si tu Gateway está implementado en un servidor remoto, usa HTTP Mode:

1. Crea una Slack App, desactiva Socket Mode
2. Copia el **Signing Secret** (página Basic Information)
3. Configura Event Subscriptions, establece **Request URL** en `https://tu-dominio/slack/events`
4. Configura Interactivity & Shortcuts, establece el mismo **Request URL**
5. Configura Slash Commands, establece **Request URL**

**Archivo de configuración**:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "mode": "http",
      "botToken": "xoxb-你的BotToken",
      "signingSecret": "你的SigningSecret",
      "webhookPath": "/slack/events"
    }
  }
}
```

### Configuración de múltiples cuentas

Admite conectar múltiples Slack Workspaces:

```json
{
  "channels": {
    "slack": {
      "accounts": {
        "workspace1": {
          "name": "Team A",
          "enabled": true,
          "botToken": "xoxb-Workspace1Token",
          "appToken": "xapp-Workspace1Token"
        },
        "workspace2": {
          "name": "Team B",
          "enabled": true,
          "botToken": "xoxb-Workspace2Token",
          "appToken": "xapp-Workspace2Token"
        }
      }
    }
  }
}
```

### Configurar comandos de barra

Activar comando `/clawd`:

1. En la página de configuración de la App, busca **Slash Commands**
2. Crea comando:
   - **Command**: `/clawd`
   - **Request URL**: no es necesario para Socket Mode (se procesa a través de WebSocket)
   - **Description**: `Send a message to Clawdbot`

**Archivo de configuración**:

```json
{
  "channels": {
    "slack": {
      "slashCommand": {
        "enabled": true,
        "name": "clawd",
        "ephemeral": true
      }
    }
  }
}
```

### Configuración de respuesta en hilos

Controla cómo el Bot responde en canales:

```json
{
  "channels": {
    "slack": {
      "replyToMode": "off",
      "replyToModeByChatType": {
        "direct": "all",
        "group": "first"
      }
    }
  }
}
```

| Modo | Comportamiento |
|--- | ---|
| `off` | Predeterminado, responder en el canal principal |
| `first` | La primera respuesta entra en el hilo, las siguientes en el canal principal |
| `all` | Todas las respuestas en el hilo |

### Activar herramientas de Slack Actions

Permitir que el Agent llame a operaciones específicas de Slack:

```json
{
  "channels": {
    "slack": {
      "actions": {
        "reactions": true,
        "messages": true,
        "pins": true,
        "memberInfo": true,
        "emojiList": true
      }
    }
  }
}
```

**Operaciones disponibles**:
- `sendMessage` - enviar mensaje
- `editMessage` - editar mensaje
- `deleteMessage` - eliminar mensaje
- `readMessages` - leer mensajes históricos
- `react` - agregar Reaction
- `reactions` - listar Reactions
- `pinMessage` - fijar mensaje (Pin)
- `unpinMessage` - quitar Pin
- `listPins` - listar Pins
- `memberInfo` - obtener información de miembro
- `emojiList` - listar Emojis personalizados

## Resumen de esta lección

- El canal de Slack admite dos métodos de conexión: Socket Mode y HTTP Mode
- Socket Mode es fácil de configurar, recomendado para uso local
- La política de seguridad de DM predeterminada es `pairing`, los desconocidos requieren aprobación
- La política de seguridad de grupos admite lista blanca y filtrado de menciones @
- Las herramientas de Slack Actions proporcionan capacidades de operación ricas
- Soporte de múltiples cuentas para conectar múltiples Workspaces

## Vista previa de la siguiente lección

> En la siguiente lección aprenderemos **[Canal de Discord](../discord/)**.
>
> Aprenderás:
> - Cómo configurar un Bot de Discord
> - Obtener Token y configurar permisos
> - Estrategias de seguridad para grupos y DM
> - Uso de herramientas específicas de Discord

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-27

| Función            | Ruta del archivo                                                                                               | Número de línea       |
|--- | --- | ---|
| Tipo de configuración de Slack | [`src/config/types.slack.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.slack.ts) | 1-150      |
| Lógica de onboarding de Slack  | [`src/channels/plugins/onboarding/slack.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/slack.ts) | 1-539      |
| Herramientas de Slack Actions | [`src/agents/tools/slack-actions.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/slack-actions.ts) | 1-301      |
| Documentación oficial de Slack | [`docs/channels/slack.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/channels/slack.md) | 1-508      |

**Definiciones de tipos clave**:
- `SlackConfig`: tipo de configuración principal del canal de Slack
- `SlackAccountConfig`: configuración de cuenta individual (admite modos socket/http)
- `SlackChannelConfig`: configuración de canales (lista blanca, política de mención, etc.)
- `SlackDmConfig`: configuración de DM (emparejamiento, lista blanca, etc.)
- `SlackActionConfig`: control de permisos de herramientas Actions

**Funciones clave**:
- `handleSlackAction()`: procesar llamadas a herramientas de Slack Actions
- `resolveThreadTsFromContext()`: resolver ID de hilo según replyToMode
- `buildSlackManifest()`: generar Slack App Manifest

</details>
