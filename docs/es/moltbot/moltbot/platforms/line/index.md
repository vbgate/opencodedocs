---
title: "Configuración y uso del canal de LINE | Clawdbot Tutorial"
sidebarTitle: "Usa IA en LINE"
subtitle: "Configuración y uso del canal de LINE"
description: "Aprende a configurar y usar el canal de LINE de Clawdbot. Este tutorial cubre la integración con LINE Messaging API, configuración de Webhook, control de acceso, mensajes enriquecidos (plantillas Flex, respuestas rápidas, Rich Menu) y técnicas para solucionar problemas comunes."
tags:
  - "LINE"
  - "Messaging API"
  - "configuración de canales"
prerequisite:
  - "start-gateway-startup"
order: 140
---

# Configuración y uso del canal de LINE

## Lo que aprenderás

Al completar este tutorial, podrás:

- ✅ Crear un canal de LINE Messaging API y obtener credenciales
- ✅ Configurar el plugin de LINE y el Webhook de Clawdbot
- ✅ Configurar emparejamiento DM, control de acceso de grupos y límites de medios
- ✅ Enviar mensajes enriquecidos (tarjetas Flex, respuestas rápidas, información de ubicación)
- ✅ Solucionar problemas comunes del canal de LINE

## Tu situación actual

Es posible que te estés preguntando:

- "Quiero conversar con el asistente de IA a través de LINE, ¿cómo lo integro?"
- "¿Cómo configuro el Webhook de LINE Messaging API?"
- "¿LINE soporta mensajes Flex y respuestas rápidas?"
- "¿Cómo controlo quién puede acceder a mi asistente de IA a través de LINE?"

Las buenas noticias son: **Clawdbot ofrece un plugin de LINE completo que admite todas las funciones principales de Messaging API**.

## Cuándo usar este método

Cuando necesites:

- 📱 **Conversar con el asistente de IA** en LINE
- 🎨 **Usar mensajes enriquecidos** (tarjetas Flex, respuestas rápidas, Rich Menu)
- 🔒 **Controlar permisos de acceso** (emparejamiento DM, lista blanca de grupos)
- 🌐 **Integrar LINE** en tus flujos de trabajo existentes

## Enfoque central

El canal de LINE se integra a través de **LINE Messaging API**, usando Webhook para recibir eventos y enviar mensajes.

```
Usuario de LINE
    │
    ▼ (enviar mensaje)
┌──────────────────┐
│  LINE Platform  │
│  (Messaging API)│
└────────┬─────────┘
         │ (Webhook POST)
         ▼
┌──────────────────┐
│  Clawdbot       │
│  Gateway        │
│  /line/webhook   │
└────────┬─────────┘
         │ (llamar a IA)
         ▼
    ┌────────┐
    │ Agent  │
    └───┬────┘
        │ (respuesta)
        ▼
    Usuario de LINE
```

**Conceptos clave**:

| Concepto | Función |
|--- | ---|
| **Channel Access Token** | Token de autenticación para enviar mensajes |
| **Channel Secret** | Clave para verificar la firma del Webhook |
| **Webhook URL** | Endpoint donde Clawdbot recibe eventos de LINE (debe ser HTTPS) |
| **DM Policy** | Política de control de acceso para remitentes desconocidos (pairing/allowlist/open/disabled) |
| **Rich Menu** | Menú fijo de LINE, los usuarios pueden hacer clic para activar acciones rápidamente |

## 🎒 Preparativos

### Cuentas y herramientas necesarias

| Elemento | Requisito | Cómo obtener |
|--- | --- | ---|
| **Cuenta de LINE Developers** | Registro gratuito | https://developers.line.biz/console/ |
| **LINE Provider** | Crear Provider y canal de Messaging API | LINE Console |
| **Servidor HTTPS** | El Webhook debe ser HTTPS | ngrok, Cloudflare Tunnel, Tailscale Serve/Funnel |

::: tip Métodos recomendados para exponer
Si desarrollas localmente, puedes usar:
- **ngrok**: `ngrok http 18789`
- **Tailscale Funnel**: `gateway.tailscale.mode = "funnel"`
- **Cloudflare Tunnel**: gratuito y estable
:::

## Sígueme paso a paso

### Paso 1: Instalar el plugin de LINE

**Por qué**
El canal de LINE se implementa mediante un plugin, necesitas instalarlo primero.

```bash
clawdbot plugins install @clawdbot/line
```

**Deberías ver**:
```
✓ Installed @clawdbot/line plugin
```

::: tip Desarrollo local
Si ejecutas desde el código fuente, puedes usar instalación local:
```bash
clawdbot plugins install ./extensions/line
```
:::

### Paso 2: Crear un canal de LINE Messaging API

**Por qué**
Necesitas obtener `Channel Access Token` y `Channel Secret` para configurar Clawdbot.

#### 2.1 Iniciar sesión en LINE Developers Console

Visita: https://developers.line.biz/console/

#### 2.2 Crear Provider (si aún no tienes uno)

1. Haz clic en "Create new provider"
2. Ingresa el nombre del Provider (por ejemplo, `Clawdbot`)
3. Haz clic en "Create"

#### 2.3 Añadir canal de Messaging API

1. Debajo del Provider, haz clic en "Add channel" → selecciona "Messaging API"
2. Configura la información del canal:
   - Channel name: `Clawdbot AI Assistant`
   - Channel description: `Personal AI assistant powered by Clawdbot`
   - Category: `Communication`
   - Subcategory: `Bot`
3. Marca "Agree" → haz clic en "Create"

#### 2.4 Habilitar Webhook

1. En la página de configuración del canal, busca la pestaña "Messaging API"
2. Haz clic en el interruptor "Use webhook" → configúralo en ON
3. Copia la siguiente información:

| Elemento | Ubicación | Ejemplo |
|--- | --- | ---|
| **Channel Access Token** | Basic settings → Channel access token (long-lived) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| **Channel Secret** | Basic settings → Channel secret | `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7` |

::: warning ¡Guarda bien las credenciales!
Channel Access Token y Channel Secret son información sensible, guárdalos con seguridad y no los expongas en repositorios públicos.
:::

### Paso 3: Configurar el canal de LINE de Clawdbot

**Por qué**
Configurar Gateway para usar LINE Messaging API para enviar y recibir mensajes.

#### Método A: Configurar mediante línea de comandos

```bash
clawdbot configure
```

El asistente te preguntará:
- Si deseas habilitar el canal de LINE
- Channel Access Token
- Channel Secret
- Política DM (predeterminado `pairing`)

#### Método B: Editar directamente el archivo de configuración

Edita `~/.clawdbot/clawdbot.json`:

```json5
{
  channels: {
    line: {
      enabled: true,
      channelAccessToken: "YOUR_CHANNEL_ACCESS_TOKEN",
      channelSecret: "YOUR_CHANNEL_SECRET",
      dmPolicy: "pairing",
      groupPolicy: "allowlist"
    }
  }
}
```

::: tip Usar variables de entorno
También puedes configurar mediante variables de entorno (solo válido para la cuenta predeterminada):
```bash
export LINE_CHANNEL_ACCESS_TOKEN="your_token_here"
export LINE_CHANNEL_SECRET="your_secret_here"
```
:::

#### Método C: Usar archivos para almacenar credenciales

Una forma más segura es almacenar las credenciales en archivos separados:

```json5
{
  channels: {
    line: {
      enabled: true,
      tokenFile: "/path/to/line-token.txt",
      secretFile: "/path/to/line-secret.txt",
      dmPolicy: "pairing"
    }
  }
}
```

### Paso 4: Configurar la URL del Webhook

**Por qué**
LINE necesita la URL del Webhook para enviar eventos de mensajes a Clawdbot.

#### 4.1 Asegúrate de que tu Gateway sea accesible desde Internet

Si desarrollas localmente, necesitas usar un servicio de túnel:

```bash
# Usar ngrok
ngrok http 18789

# La salida mostrará la URL HTTPS, por ejemplo:
# Forwarding: https://abc123.ngrok.io -> http://localhost:18789
```

#### 4.2 Configurar la URL del Webhook en LINE Console

1. En la página de configuración de Messaging API, busca "Webhook settings"
2. Ingresa la URL del Webhook:
   ```
   https://your-gateway-host/line/webhook
   ```
   - Ruta predeterminada: `/line/webhook`
   - Se puede personalizar mediante `channels.line.webhookPath`
3. Haz clic en "Verify" → confirma que LINE puede acceder a tu Gateway

**Deberías ver**:
```
✓ Webhook URL verification succeeded
```

#### 4.3 Habilitar tipos de eventos necesarios

En Webhook settings, marca los siguientes eventos:

| Evento | Propósito |
|--- | ---|
| **Message event** | Recibir mensajes enviados por usuarios |
| **Follow event** | El usuario añade el Bot como amigo |
| **Unfollow event** | El usuario elimina el Bot |
| **Join event** | El Bot se une a un grupo |
| **Leave event** | El Bot abandona un grupo |
| **Postback event** | Respuestas rápidas y clics en botones |

### Paso 5: Iniciar Gateway

**Por qué**
Gateway debe ejecutarse para recibir eventos de Webhook de LINE.

```bash
clawdbot gateway --verbose
```

**Deberías ver**:
```
✓ Gateway listening on ws://127.0.0.1:18789
✓ LINE webhook server started on /line/webhook
✓ LINE plugin initialized
```

### Paso 6: Probar el canal de LINE

**Por qué**
Verificar que la configuración sea correcta y que el asistente de IA responda normalmente.

#### 6.1 Añadir el Bot como amigo

1. En LINE Console → Messaging API → Channel settings
2. Copia "Basic ID" o "QR Code"
3. En la aplicación LINE, busca o escanea el QR Code, añade el Bot como amigo

#### 6.2 Enviar un mensaje de prueba

En LINE, envía un mensaje al Bot:
```
Hola, ayúdame a resumir el clima de hoy.
```

**Deberías ver**:
- El Bot muestra estado "typing" (si configuraste indicadores de escritura)
- El asistente de IA responde de forma fluida
- El mensaje se muestra correctamente en LINE

### Paso 7: Verificación de emparejamiento DM (opcional)

**Por qué**
Si usas `dmPolicy="pairing"` predeterminado, los remitentes desconocidos deben ser aprobados primero.

#### Ver solicitudes de emparejamiento pendientes

```bash
clawdbot pairing list line
```

**Deberías ver**:
```
Pending pairing requests for LINE:
  CODE: ABC123 - User ID: U1234567890abcdef1234567890ab
```

#### Aprobar solicitud de emparejamiento

```bash
clawdbot pairing approve line ABC123
```

**Deberías ver**:
```
✓ Approved pairing request for LINE user U1234567890abcdef1234567890ab
```

::: info Explicación de políticas DM
- `pairing` (predeterminado): Los remitentes desconocidos reciben un código de emparejamiento, los mensajes se ignoran hasta que se aprueban
- `allowlist`: Solo permitir que usuarios en la lista blanca envíen mensajes
- `open`: Cualquiera puede enviar mensajes (usar con precaución)
- `disabled`: Deshabilitar mensajes directos
:::

## Punto de control ✅

Verifica que tu configuración sea correcta:

| Elemento de verificación | Método de verificación | Resultado esperado |
|--- | --- | ---|
| **Plugin instalado** | `clawdbot plugins list` | Ver `@clawdbot/line` |
| **Configuración válida** | `clawdbot doctor` | Sin errores relacionados con LINE |
| **Webhook accesible** | Verificación de LINE Console | `✓ Verification succeeded` |
| **Bot accesible** | Añadir amigo en LINE y enviar mensaje | El asistente de IA responde normalmente |
| **Mecanismo de emparejamiento** | Enviar DM con un nuevo usuario | Recibir código de emparejamiento (si usas política de pairing) |

## Advertencias sobre problemas comunes

### Problema común 1: Fallo en la verificación del Webhook

**Síntoma**:
```
Webhook URL verification failed
```

**Causas**:
- La URL del Webhook no es HTTPS
- Gateway no se está ejecutando o el puerto es incorrecto
- El firewall bloquea conexiones entrantes

**Solución**:
1. Asegúrate de usar HTTPS: `https://your-gateway-host/line/webhook`
2. Verifica si Gateway se está ejecutando: `clawdbot gateway status`
3. Verifica el puerto: `netstat -an | grep 18789`
4. Usa servicio de túnel (ngrok/Tailscale/Cloudflare)

### Problema común 2: No se pueden recibir mensajes

**Síntomas**:
- La verificación del Webhook es exitosa
- Pero enviar mensajes al Bot no recibe respuesta

**Causas**:
- La ruta del Webhook está configurada incorrectamente
- Los tipos de eventos no están habilitados
- `channelSecret` en el archivo de configuración no coincide

**Solución**:
1. Verifica que `channels.line.webhookPath` coincida con LINE Console
2. Asegúrate de haber habilitado "Message event" en LINE Console
3. Verifica que `channelSecret` se haya copiado correctamente (sin espacios extra)

### Problema común 3: Fallo en la descarga de medios

**Síntoma**:
```
Error downloading LINE media: size limit exceeded
```

**Causas**:
- El archivo de medios excede el límite predeterminado (10MB)

**Solución**:
Aumenta el límite en la configuración:
```json5
{
  channels: {
    line: {
      mediaMaxMb: 25  // Límite oficial de LINE 25MB
    }
  }
}
```

### Problema común 4: Sin respuesta a mensajes de grupo

**Síntomas**:
- Los DM funcionan normalmente
- Enviar mensajes en grupos no recibe respuesta

**Causas**:
- Por defecto `groupPolicy="allowlist"`, el grupo no está en la lista blanca
- No mencionaste @Bot en el grupo

**Solución**:
1. Añade el ID del grupo a la lista blanca en la configuración:
```json5
{
  channels: {
    line: {
      groupAllowFrom: ["C1234567890abcdef1234567890ab"]
    }
  }
}
```

2. O menciona @Bot en el grupo: `@Clawdbot ayúdame a procesar esta tarea`

## Funciones avanzadas

### Mensajes enriquecidos (plantillas Flex y respuestas rápidas)

Clawdbot admite mensajes enriquecidos de LINE, incluyendo tarjetas Flex, respuestas rápidas, información de ubicación, etc.

#### Enviar respuestas rápidas

```json5
{
  text: "¿Qué puedo hacer por ti hoy?",
  channelData: {
    line: {
      quickReplies: ["consultar clima", "configurar recordatorio", "generar código"]
    }
  }
}
```

#### Enviar tarjeta Flex

```json5
{
  text: "Tarjeta de estado",
  channelData: {
    line: {
      flexMessage: {
        altText: "Estado del servidor",
        contents: {
          type: "bubble",
          body: {
            type: "box",
            contents: [
              {
                type: "text",
                text: "CPU: 45%"
              },
              {
                type: "text",
                text: "Memoria: 2.1GB"
              }
            ]
          }
        }
      }
    }
  }
}
```

#### Enviar información de ubicación

```json5
{
  text: "Esta es la ubicación de mi oficina",
  channelData: {
    line: {
      location: {
        title: "Office",
        address: "123 Main St, San Francisco",
        latitude: 37.7749,
        longitude: -122.4194
      }
    }
  }
}
```

### Rich Menu (menú fijo)

Rich Menu es el menú fijo de LINE, los usuarios pueden hacer clic para activar acciones rápidamente.

```bash
# Crear Rich Menu
clawdbot line rich-menu create

# Subir imagen del menú
clawdbot line rich-menu upload --image /path/to/menu.png

# Establecer como menú predeterminado
clawdbot line rich-menu set-default --rich-menu-id <MENU_ID>
```

::: info Limitaciones de Rich Menu
- Dimensiones de imagen: 2500x1686 o 2500x843 píxeles
- Formato de imagen: PNG o JPEG
- Máximo 10 elementos de menú
:::

### Conversión de Markdown

Clawdbot convertirá automáticamente el formato Markdown al formato compatible con LINE:

| Markdown | Resultado de conversión LINE |
|--- | ---|
| Bloques de código | Tarjeta Flex |
| Tablas | Tarjeta Flex |
| Enlaces | Detección automática y conversión a tarjeta Flex |
| Negrita/cursiva | Eliminados (LINE no lo admite) |

::: tip Conservar formato
LINE no admite formato Markdown, Clawdbot intentará convertirlo a tarjetas Flex. Si deseas texto plano, puedes deshabilitar la conversión automática en la configuración.
:::

## Resumen de esta lección

Este tutorial presentó:

1. ✅ Instalar el plugin de LINE
2. ✅ Crear un canal de LINE Messaging API
3. ✅ Configurar Webhook y credenciales
4. ✅ Configurar control de acceso (emparejamiento DM, lista blanca de grupos)
5. ✅ Enviar mensajes enriquecidos (Flex, respuestas rápidas, ubicación)
6. ✅ Usar Rich Menu
7. ✅ Solucionar problemas comunes

El canal de LINE ofrece tipos de mensajes enriquecidos y métodos de interacción,非常适合 construir experiencias personalizadas de asistente de IA en LINE.

---

## Próxima lección

> En la próxima lección, aprenderemos sobre **[Interfaz WebChat](../webchat/)**.
>
> Aprenderás:
> - Cómo acceder a la interfaz WebChat a través del navegador
> - Funciones principales de WebChat (gestión de sesiones, carga de archivos, soporte Markdown)
> - Configurar acceso remoto (túnel SSH, Tailscale)
> - Comprender las diferencias entre WebChat y otros canales

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-27

| Función | Ruta de archivo | Número de líneas |
|--- | --- | ---|
| Implementación principal de LINE Bot | [`src/line/bot.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/bot.ts) | 27-83 |
| Definición de Schema de configuración | [`src/line/config-schema.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/config-schema.ts) | 1-54 |
| Manejador de eventos de Webhook | [`src/line/bot-handlers.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/bot-handlers.ts) | 1-100 |
| Función de envío de mensajes | [`src/line/send.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/send.ts) | - |
| Generación de plantillas Flex | [`src/line/flex-templates.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/flex-templates.ts) | - |
| Operaciones de Rich Menu | [`src/line/rich-menu.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/rich-menu.ts) | - |
| Mensajes de Template | [`src/line/template-messages.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/template-messages.ts) | - |
| Conversión de Markdown a LINE | [`src/line/markdown-to-line.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/markdown-to-line.ts) | - |
| Servidor Webhook | [`src/line/webhook.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/webhook.ts) | - |

**Campos de configuración clave**:
- `channelAccessToken`: LINE Channel Access Token (`config-schema.ts:19`)
- `channelSecret`: LINE Channel Secret (`config-schema.ts:20`)
- `dmPolicy`: Política de acceso DM (`config-schema.ts:26`)
- `groupPolicy`: Política de acceso de grupos (`config-schema.ts:27`)
- `mediaMaxMb`: Límite de tamaño de medios (`config-schema.ts:28`)
- `webhookPath`: Ruta personalizada de Webhook (`config-schema.ts:29`)

**Funciones clave**:
- `createLineBot()`: Crear instancia de LINE Bot (`bot.ts:27`)
- `handleLineWebhookEvents()`: Manejar eventos de Webhook de LINE (`bot-handlers.ts:100`)
- `sendMessageLine()`: Enviar mensaje de LINE (`send.ts`)
- `createFlexMessage()`: Crear mensaje Flex (`send.ts:20`)
- `createQuickReplyItems()`: Crear respuestas rápidas (`send.ts:21`)

**Políticas DM soportadas**:
- `open`: Acceso abierto
- `allowlist`: Modo de lista blanca
- `pairing`: Modo de emparejamiento (predeterminado)
- `disabled`: Deshabilitado

**Políticas de grupos soportadas**:
- `open`: Acceso abierto
- `allowlist`: Modo de lista blanca (predeterminado)
- `disabled`: Deshabilitado

</details>
