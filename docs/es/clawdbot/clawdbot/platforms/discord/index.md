---
title: "Discord: configuración y uso | Clawdbot Tutorial"
sidebarTitle: "Conecta tu Bot de Discord"
subtitle: "Configuración y uso del canal de Discord"
description: "Aprende a crear un Bot de Discord y configurarlo en Clawdbot. Este tutorial cubre la creación de Bot en Discord Developer Portal, configuración de permisos de Gateway Intents, configuración de Bot Token, generación de URL de invitación OAuth2, mecanismo de protección de emparejamiento DM, configuración de lista blanca de canales de servidor, gestión de permisos de llamadas a herramientas de AI de Discord y pasos de solución de problemas comunes."
tags:
  - "configuración de canales"
  - "Discord"
  - "Bot"
prerequisite:
  - "start-getting-started"
order: 100
---

# Configuración y uso del canal de Discord

## Lo que aprenderás

- Crear un Bot de Discord y obtener el Bot Token
- Configurar la integración de Clawdbot con el Bot de Discord
- Usar el asistente de IA en mensajes directos (DM) y canales de servidor de Discord
- Configurar el control de acceso (emparejamiento DM, lista blanca de canales)
- Permitir que la IA llame a herramientas de Discord (enviar mensajes, crear canales, gestionar roles, etc.)

## Tu situación actual

Ya estás usando Discord para comunicarte con amigos o tu equipo, y deseas conversar con el asistente de IA directamente en Discord sin cambiar de aplicación. Es posible que te encuentres con los siguientes problemas:

- No sabes cómo crear un Bot de Discord
- No estás claro sobre qué permisos se necesitan para que el Bot funcione correctamente
- Quieres controlar quién puede interactuar con el Bot (evitar que extraños lo usen)
- Deseas configurar diferentes comportamientos en diferentes canales del servidor

Este tutorial te enseñará paso a paso cómo resolver estos problemas.

## Cuándo usar este método

El canal de Discord es adecuado para estos escenarios:

- ✅ Eres un usuario intensivo de Discord y la mayoría de tus comunicaciones ocurren en Discord
- ✅ Quieres añadir funciones de IA a tu servidor de Discord (por ejemplo, asistente inteligente en el canal `#help`)
- ✅ Deseas interactuar con la IA mediante mensajes directos de Discord (más conveniente que abrir WebChat)
- ✅ Necesitas que la IA realice operaciones de administración en Discord (crear canales, enviar mensajes, etc.)

::: info El canal de Discord se basa en discord.js y soporta funciones completas de la API de Bot.
:::

## 🎒 Preparativos

**Requisitos previos**:
- Completado[Inicio rápido](../../start/getting-started/), Gateway puede ejecutarse
- Node.js ≥ 22
- Cuenta de Discord (puede crear aplicaciones)

**Información necesaria**:
- Bot Token de Discord (te enseñaré cómo obtenerlo)
- ID del servidor (opcional, para configurar canales específicos)
- ID del canal (opcional, para control granular)

## Enfoque central

### Cómo funciona el canal de Discord

El canal de Discord se comunica con Discord mediante la **API oficial de Bot**:

```
Usuario de Discord
     ↓
  Servidor de Discord
     ↓
   Gateway de Bot de Discord
     ↓ (WebSocket)
   Gateway de Clawdbot
     ↓
   Agente de IA (Claude/GPT, etc.)
     ↓
   API de Bot de Discord (enviar respuesta)
     ↓
 Servidor de Discord
     ↓
Usuario de Discord (ve la respuesta)
```

**Puntos clave**:
- El Bot recibe mensajes a través de WebSocket (Gateway → Bot)
- Clawdbot reenvía los mensajes al Agente de IA para su procesamiento
- La IA puede llamar a la herramienta `discord` para realizar operaciones específicas de Discord
- Todas las respuestas se envían de vuelta a Discord a través de la API de Bot

### Diferencia entre DM y canales de servidor

| Tipo | Aislamiento de sesión | Comportamiento predeterminado | Escenarios aplicables |
|--- | --- | --- | ---|
| **Mensaje directo (DM)** | Todos los DM comparten la sesión `agent:main:main` | Requiere emparejamiento (pairing) para protección | Conversaciones personales, contexto continuo |
| **Canal de servidor** | Cada canal tiene una sesión independiente `agent:<agentId>:discord:channel:<channelId>` | Responde solo con @mención | Asistente inteligente del servidor, múltiples canales en paralelo |

::: tip
Las sesiones de los canales de servidor están completamente aisladas y no interfieren entre sí. Las conversaciones en el canal `#help` no aparecerán en `#general`.
:::

### Mecanismo de seguridad predeterminado

El canal de Discord habilita de forma predeterminada la **protección de emparejamiento DM**:

```
Usuario desconocido → Enviar DM → Clawdbot
                               ↓
                       Rechazar procesamiento, devolver código de emparejamiento
                               ↓
                 Usuario necesita ejecutar `clawdbot pairing approve discord <código>`
                               ↓
                             Emparejamiento exitoso, puede conversar
```

Esto evita que usuarios desconocidos interactúen directamente con tu asistente de IA.

---

## Sígueme paso a paso

### Paso 1: Crear aplicación y Bot de Discord

**Por qué**
El Bot de Discord necesita una "identidad" para conectarse al servidor de Discord. Esta identidad es el Bot Token.

#### 1.1 Crear aplicación de Discord

1. Abre [Discord Developer Portal](https://discord.com/developers/applications)
2. Haz clic en **New Application** (Nueva aplicación)
3. Ingresa el nombre de la aplicación (por ejemplo, `Clawdbot AI`)
4. Haz clic en **Create** (Crear)

#### 1.2 Añadir usuario Bot

1. En la barra de navegación izquierda, haz clic en **Bot** (Bot)
2. Haz clic en **Add Bot** → **Reset Token** → **Reset Token** (Restablecer token)
3. **Importante**: Copia el Bot Token inmediatamente (¡solo se muestra una vez!)

```
Formato de Bot Token: MTAwOTk1MDk5NjQ5NTExNjUy.Gm9...
(¡Cambia cada vez que se restablece, guárdalo con cuidado!)
```

#### 1.3 Habilitar Gateway Intents necesarios

De forma predeterminada, Discord no permite que el Bot lea el contenido de los mensajes; debes habilitarlo manualmente.

En **Bot → Privileged Gateway Intents** (Intents de Gateway privilegiados), habilita:

| Intent | ¿Necesario? | Descripción |
|--- | --- | ---|
| **Message Content Intent** | ✅ **Necesario** | Leer contenido de texto de mensajes (sin esto, el Bot no puede ver mensajes) |
| **Server Members Intent** | ⚠️ **Recomendado** | Para búsqueda de miembros y resolución de nombres de usuario |

::: danger Prohibido
No habilites **Presence Intent** (Intent de presencia) a menos que realmente necesites el estado en línea de los usuarios.
:::

**Deberías ver**: Ambos interruptores cambian a estado verde (ON).

---

### Paso 2: Generar URL de invitación y añadir al servidor

**Por qué**
El Bot necesita permisos para leer y enviar mensajes en el servidor.

1. En la barra de navegación izquierda, haz clic en **OAuth2 → URL Generator**
2. En **Scopes** (Ámbitos), selecciona:
   - ✅ **bot**
   - ✅ **applications.commands** (para comandos nativos)

3. En **Bot Permissions** (Permisos del Bot), selecciona al menos:

| Permiso | Descripción |
|--- | ---|
| **View Channels** | Ver canales |
| **Send Messages** | Enviar mensajes |
| **Read Message History** | Leer historial de mensajes |
| **Embed Links** | Incrustar enlaces |
| **Attach Files** | Subir archivos |

Permisos opcionales (añadir según sea necesario):
- **Add Reactions** (Añadir reacciones de emoji)
- **Use External Emojis** (Usar emojis personalizados)

::: warning Consejo de seguridad
Evita conceder el permiso **Administrator** (Administrador), a menos que estés depurando y confíes completamente en el Bot.
:::

4. Copia la URL generada
5. Abre la URL en el navegador
6. Selecciona tu servidor, haz clic en **Authorize** (Autorizar)

**Deberías ver**: El Bot se une exitosamente al servidor, mostrando un estado verde en línea.

---

### Paso 3: Obtener IDs necesarios (servidor, canal, usuario)

**Por qué**
La configuración de Clawdbot prefiere usar ID (números) porque los ID no cambian.

#### 3.1 Habilitar modo de desarrollador de Discord

1. Discord escritorio/web → **User Settings** (Configuración de usuario)
2. **Advanced** (Avanzado) → Habilitar **Developer Mode** (Modo de desarrollador)

#### 3.2 Copiar ID

| Tipo | Acción |
|--- | ---|
| **ID del servidor** | Clic derecho en el nombre del servidor → **Copy Server ID** |
| **ID del canal** | Clic derecho en el canal (por ejemplo, `#general`) → **Copy Channel ID** |
| **ID del usuario** | Clic derecho en el avatar del usuario → **Copy User ID** |

::: tip ID vs Nombre
Al configurar, usa preferiblemente ID. Los nombres pueden cambiar, pero los ID nunca cambian.
:::

**Deberías ver**: ID copiado al portapapeles (formato: `123456789012345678`).

---

### Paso 4: Configurar la conexión de Clawdbot con Discord

**Por qué**
Decirle a Clawdbot cómo conectarse a tu Bot de Discord.

#### Método 1: A través de variables de entorno (recomendado, para servidores)

```bash
export DISCORD_BOT_TOKEN="YOUR_BOT_TOKEN"

clawdbot gateway --port 18789
```

#### Método 2: A través de archivo de configuración

Edita `~/.clawdbot/clawdbot.json`:

```json5
{
  channels: {
    discord: {
      enabled: true,
      token: "YOUR_BOT_TOKEN"  // Token copiado en el Paso 1
    }
  }
}
```

::: tip Prioridad de variables de entorno
Si se configuran variables de entorno y archivo de configuración al mismo tiempo, **el archivo de configuración tiene prioridad**.
:::

**Deberías ver**: Después de iniciar Gateway, el Bot de Discord muestra un estado en línea.

---

### Paso 5: Verificar conexión y probar

**Por qué**
Asegurarse de que la configuración es correcta y que el Bot puede recibir y enviar mensajes normalmente.

1. Inicia Gateway (si aún no se ha iniciado):

```bash
clawdbot gateway --port 18789 --verbose
```

2. Verifica el estado del Bot de Discord:
   - El Bot debería aparecer como **verde en línea** en la lista de miembros del servidor
   - Si está gris fuera de línea, verifica que el Token sea correcto

3. Enviar mensaje de prueba:

En Discord:
- **Mensaje directo (DM)**: Envía un mensaje directamente al Bot (recibirás un código de emparejamiento, ver la siguiente sección)
- **Canal de servidor**: @menciona el Bot, por ejemplo, `@ClawdbotAI hello`

**Deberías ver**: El Bot responde con un mensaje (el contenido depende de tu modelo de IA).

::: tip ¿La prueba falló?
Si el Bot no responde, consulta la sección [Solución de problemas](#solución-de-problemas).
:::

---

## Punto de control ✅

Antes de continuar, confirma lo siguiente:

- [ ] Bot Token configurado correctamente
- [ ] Bot se ha unido exitosamente al servidor
- [ ] Message Content Intent habilitado
- [ ] Gateway está ejecutándose
- [ ] Bot muestra estado en línea en Discord
- [ ] @mencionar el Bot recibe respuesta

---

## Configuración avanzada

### Control de acceso DM

La política predeterminada es `pairing` (modo de emparejamiento), adecuada para uso personal. Puedes ajustar según sea necesario:

| Política | Descripción | Ejemplo de configuración |
|--- | --- | ---|
| **pairing** (predeterminado) | Desconocidos reciben código de emparejamiento, requieren aprobación manual | `"dm": { "policy": "pairing" }` |
| **allowlist** | Solo permitir usuarios en la lista | `"dm": { "policy": "allowlist", "allowFrom": ["123456", "alice"] }` |
| **open** | Permitir a todos (requiere `allowFrom` contenga `"*"`) | `"dm": { "policy": "open", "allowFrom": ["*"] }` |
| **disabled** | Deshabilitar todos los DM | `"dm": { "enabled": false }` |

#### Ejemplo de configuración: permitir usuarios específicos

```json5
{
  channels: {
    discord: {
      dm: {
        enabled: true,
        policy: "allowlist",
        allowFrom: [
          "123456789012345678",  // ID de usuario
          "@alice",                   // Nombre de usuario (se resolverá a ID)
          "alice#1234"              // Nombre de usuario completo
        ]
      }
    }
  }
}
```

#### Aprobar solicitud de emparejamiento

Cuando un usuario desconocido envía DM por primera vez, recibirá un código de emparejamiento. Método de aprobación:

```bash
clawdbot pairing approve discord <código de emparejamiento>
```

### Configuración de canales de servidor

#### Configuración básica: solo permitir canales específicos

```json5
{
  channels: {
    discord: {
      groupPolicy: "allowlist",  // Modo de lista blanca (predeterminado)
      guilds: {
        "123456789012345678": {
          requireMention: true,  // Requiere @mención para responder
          channels: {
            help: { allow: true },    // Permitir #help
            general: { allow: true } // Permitir #general
          }
        }
      }
    }
  }
}
```

::: tip
`requireMention: true` es la configuración recomendada, evita que el Bot "se haga el listo" en canales públicos.
:::

#### Configuración avanzada: comportamiento exclusivo por canal

```json5
{
  channels: {
    discord: {
      guilds: {
        "123456789012345678": {
          slug: "my-server",              // Nombre para mostrar (opcional)
          reactionNotifications: "own",      // Solo las reacciones a mensajes propios del Bot activan eventos
          channels: {
            help: {
              allow: true,
              requireMention: true,
              users: ["987654321098765432"], // Solo usuarios específicos pueden activar
              skills: ["search", "docs"],    // Limitar habilidades disponibles
              systemPrompt: "Keep answers under 50 words."  // Prompt de sistema adicional
            }
          }
        }
      }
    }
  }
}
```

### Operaciones de herramientas de Discord

El Agente de IA puede llamar a la herramienta `discord` para realizar operaciones específicas de Discord. Controla los permisos mediante `channels.discord.actions`:

| Categoría de operación | Estado predeterminado | Descripción |
|--- | --- | ---|
| **reactions** | ✅ Habilitado | Añadir/leer reacciones de emoji |
| **messages** | ✅ Habilitado | Leer/enviar/editar/eliminar mensajes |
| **threads** | ✅ Habilitado | Crear/responder hilos |
| **channels** | ✅ Habilitado | Crear/editar/eliminar canales |
| **pins** | ✅ Habilitado | Fijar/desfijar mensajes |
| **search** | ✅ Habilitado | Buscar mensajes |
| **memberInfo** | ✅ Habilitado | Consultar información de miembros |
| **roleInfo** | ✅ Habilitado | Consultar lista de roles |
| **roles** | ❌ **Deshabilitado** | Añadir/eliminar roles |
| **moderation** | ❌ **Deshabilitado** | Bloquear/expulsar/tiempo de espera |

#### Deshabilitar operaciones específicas

```json5
{
  channels: {
    discord: {
      actions: {
        channels: false,      // Deshabilitar gestión de canales
        moderation: false,   // Deshabilitar operaciones de moderación
        roles: false         // Deshabilitar gestión de roles
      }
    }
  }
}
```

::: danger Advertencia de seguridad
Al habilitar las operaciones `moderation` y `roles`, asegúrate de que la IA tenga prompts estrictos y control de acceso para evitar prohibir usuarios por error.
:::

### Otras opciones de configuración

| Opción de configuración | Descripción | Valor predeterminado |
|--- | --- | ---|
| `historyLimit` | Número de mensajes históricos en el contexto del canal de servidor | 20 |
| `dmHistoryLimit` | Número de mensajes históricos en sesiones DM | Sin límite |
| `textChunkLimit` | Número máximo de caracteres por mensaje | 2000 |
| `maxLinesPerMessage` | Número máximo de líneas por mensaje | 17 |
| `mediaMaxMb` | Tamaño máximo de archivos de medios subidos (MB) | 8 |
| `chunkMode` | Modo de fragmentación de mensajes (`length`/`newline`) | `length` |

---

## Advertencias sobre problemas comunes

### ❌ Error "Used disallowed intents"

**Causa**: No se ha habilitado **Message Content Intent**.

**Solución**:
1. Regresa a Discord Developer Portal
2. Bot → Privileged Gateway Intents
3. Habilita **Message Content Intent**
4. Reinicia Gateway

### ❌ Bot conectado pero no responde

**Posibles causas**:
1. Falta **Message Content Intent**
2. El Bot no tiene permisos de canal
3. La configuración requiere @mención pero no mencionaste
4. El canal no está en la lista blanca

**Pasos de solución**:
```bash
# Ejecutar herramienta de diagnóstico
clawdbot doctor

# Verificar estado del canal y permisos
clawdbot channels status --probe
```

### ❌ Código de emparejamiento DM expirado

**Causa**: El código de emparejamiento es válido por **1 hora**.

**Solución**: Haz que el usuario vuelva a enviar el DM, obtenga un nuevo código de emparejamiento, luego apruébalo.

### ❌ DM de grupo ignorado

**Causa**: De forma predeterminada, `dm.groupEnabled: false`.

**Solución**:

```json5
{
  channels: {
    discord: {
      dm: {
        groupEnabled: true,
        groupChannels: ["clawd-dm"]  // Opcional: solo permitir DM de grupos específicos
      }
    }
  }
}
```

---

## Solución de problemas

### Diagnóstico de problemas comunes

```bash
# 1. Verificar si Gateway está ejecutándose
clawdbot gateway status

# 2. Verificar estado de conexión de canales
clawdbot channels status

# 3. Ejecutar diagnóstico completo (¡recomendado!)
clawdbot doctor
```

### Depuración con registros

Inicia Gateway con `--verbose` para ver registros detallados:

```bash
clawdbot gateway --port 18789 --verbose
```

**Mantén un ojo en estos registros**:
- `Discord channel connected: ...` → Conexión exitosa
- `Message received from ...` → Mensaje recibido
- `ERROR: ...` → Información de error

---

## Resumen de esta lección

- El canal de Discord se conecta mediante **discord.js** y soporta DM y canales de servidor
- Crear un Bot requiere **cuatro pasos**: aplicación, usuario Bot, Gateway Intents, URL de invitación
- **Message Content Intent** es necesario; sin él, el Bot no puede leer mensajes
- De forma predeterminada, se habilita **protección de emparejamiento DM**; los desconocidos deben emparejarse para conversar
- Los canales de servidor se pueden configurar con lista blanca y comportamiento mediante `guilds.<id>.channels`
- La IA puede llamar a herramientas de Discord para realizar operaciones de administración (se puede controlar mediante `actions`)

---

## Próxima lección

> En la próxima lección, aprenderemos sobre **[Canal de Google Chat](../googlechat/)**.
>
> Aprenderás:
> - Cómo configurar la autenticación OAuth de Google Chat
> - Enrutamiento de mensajes en espacios de Google Chat
> - Cómo usar las limitaciones de la API de Google Chat

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-27

| Función | Ruta de archivo | Número de líneas |
|--- | --- | ---|
| Schema de configuración de Bot de Discord | [`src/config/zod-schema.providers-core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers-core.ts#L320-L427) | 320-427 |
| Asistente de integración de Discord | [`src/channels/plugins/onboarding/discord.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/discord.ts) | 1-485 |
| Operaciones de herramientas de Discord | [`src/agents/tools/discord-actions.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/discord-actions.ts) | 1-72 |
| Operaciones de mensajes de Discord | [`src/agents/tools/discord-actions-messaging.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/discord-actions-messaging.ts) | - |
| Operaciones de servidor de Discord | [`src/agents/tools/discord-actions-guild.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/discord-actions-guild.ts) | - |
| Documentación oficial de Discord | [`docs/channels/discord.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/channels/discord.md) | 1-400 |

**Campos clave del Schema**:
- `DiscordAccountSchema`: Configuración de cuenta de Discord (token, guilds, dm, actions, etc.)
- `DiscordDmSchema`: Configuración de DM (enabled, policy, allowFrom, groupEnabled)
- `DiscordGuildSchema`: Configuración de servidor (slug, requireMention, reactionNotifications, channels)
- `DiscordGuildChannelSchema`: Configuración de canal (allow, requireMention, skills, systemPrompt)

**Funciones clave**:
- `handleDiscordAction()`: Punto de entrada para procesar operaciones de herramientas de Discord
- `discordOnboardingAdapter.configure()`: Flujo de configuración con asistente

</details>
