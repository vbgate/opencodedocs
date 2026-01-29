---
title: "Visión General del Sistema Multicanal: 13+ Canales de Comunicación Completos | Clawdbot Tutorial"
sidebarTitle: "Elige el Canal Adecuado"
subtitle: "Visión General del Sistema Multicanal: Todos los Canales de Comunicación Soportados por Clawdbot"
description: "Aprende sobre los 13+ canales de comunicación soportados por Clawdbot (WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, LINE, etc.). Domina los métodos de autenticación, características y casos de uso de cada canal para elegir el más adecuado. El tutorial cubre protección de emparejamiento DM, procesamiento de mensajes de grupo y métodos de configuración."
tags:
  - "canales"
  - "plataformas"
  - "multicanal"
  - "introducción"
prerequisite:
  - "../start/getting-started"
order: 60
---

# Visión General del Sistema Multicanal: Todos los Canales de Comunicación Soportados por Clawdbot

## Lo Que Podrás Hacer

Al completar este tutorial, podrás:

- ✅ Comprender los 13+ canales de comunicación soportados por Clawdbot
- ✅ Dominar los métodos de autenticación y puntos clave de configuración de cada canal
- ✅ Elegir el canal más adecuado según tus casos de uso
- ✅ Entender el valor de seguridad del mecanismo de protección de emparejamiento DM

## Tu Situación Actual

Es posible que estés pensando:

- "¿Qué plataformas soporta Clawdbot?"
- "¿Qué diferencias hay entre WhatsApp, Telegram y Slack?"
- "¿Qué canal es el más simple y rápido?"
- "¿Necesito registrar un bot en cada plataforma?"

La buena noticia es: **Clawdbot ofrece una amplia selección de canales, puedes combinarlos libremente según tus hábitos y necesidades**.

## Cuándo Usar Este Enfoque

Cuando necesitas:

- 🌐 **Gestión Unificada Multicanal** — Un asistente de IA disponible simultáneamente en múltiples canales
- 🤝 **Colaboración en Equipo** — Integración con lugares de trabajo como Slack, Discord, Google Chat
- 💬 **Chat Personal** — Herramientas de comunicación diaria como WhatsApp, Telegram, iMessage
- 🔧 **Expansión Flexible** — Soporte para plataformas regionales como LINE, Zalo

::: tip Valor del Multicanal
Los beneficios de usar múltiples canales:
- **Cambio sin interrupciones**: Usa WhatsApp en casa, Slack en la empresa, Telegram cuando estás fuera
- **Sincronización multi-dispositivo**: Los mensajes y conversaciones se mantienen consistentes en todos los canales
- **Cobertura de escenarios**: Diferentes plataformas tienen diferentes ventajas, la combinación óptima funciona mejor
:::

---

## Conceptos Fundamentales

El sistema de canales de Clawdbot utiliza una **arquitectura basada en plugins**:

```
┌─────────────────────────────────────────────────┐
│              Gateway (Plano de Control)          │
│         ws://127.0.0.1:18789                  │
└───────────────┬─────────────────────────────────┘
                │
        ┌───────┼───────┬─────────┬───────┐
        │       │       │         │       │
    WhatsApp  Telegram  Slack  Discord  ... etc. 13+ canales
        │       │       │         │       │
    Baileys  grammY   Bolt  discord.js ...
```

**Conceptos Clave**:

| Concepto         | Función                         |
|--- | ---|
| **Plugin de Canal** | Cada canal es un plugin independiente |
| **Interfaz Unificada** | Todos los canales usan la misma API |
| **Protección DM** | Emparejamiento activado por defecto, rechaza remitentes desconocidos |
| **Soporte de Grupos** | Soporta `@mención` y activación por comandos |

---

## Visión General de Canales Soportados

Clawdbot soporta **13+ canales de comunicación**, divididos en dos categorías:

### Canales Principales (Integrados)

| Canal           | Método de Autenticación             | Dificultad | Características                              |
|--- | --- | --- | ---|
| **Telegram**    | Bot Token                          | ⭐         | El más simple y rápido, recomendado para principiantes |
| **WhatsApp**    | QR Code / Phone Link               | ⭐⭐        | Usa número real, recomendado teléfono separado + eSIM |
| **Slack**       | Bot Token + App Token              | ⭐⭐        | Primera opción para empresas, Socket Mode |
| **Discord**     | Bot Token                          | ⭐⭐        | Escenario de comunidad y juegos, funciones ricas |
| **Google Chat** | OAuth / Service Account            | ⭐⭐⭐       | Integración empresarial Google Workspace |
| **Signal**      | signal-cli                         | ⭐⭐⭐       | Altamente seguro, configuración compleja |
| **iMessage**    | imsg (macOS)                       | ⭐⭐⭐       | Exclusivo de macOS, aún en desarrollo |

### Canales Extendidos (Plugins Externos)

| Canal               | Método de Autenticación             | Tipo       | Características                              |
|--- | --- | --- | ---|
| **WebChat**         | Gateway WebSocket                   | Integrado  | Sin autenticación de terceros, el más simple |
| **LINE**            | Messaging API                       | Plugin externo | Popular entre usuarios asiáticos           |
| **BlueBubbles**     | Private API                         | Plugin extendido | Extensión de iMessage, soporta dispositivos remotos |
| **Microsoft Teams** | Bot Framework                       | Plugin extendido | Colaboración empresarial                    |
| **Matrix**          | Matrix Bot SDK                      | Plugin extendido | Comunicación descentralizada                |
| **Zalo**            | Zalo OA                             | Plugin extendido | Popular entre usuarios de Vietnam          |
| **Zalo Personal**   | Personal Account                    | Plugin extendido | Cuenta personal Zalo                        |

::: info ¿Cómo elegir un canal?
- **Principiantes**: Comienza con Telegram o WebChat
- **Uso personal**: WhatsApp (si ya tienes número), Telegram
- **Colaboración en equipo**: Slack, Google Chat, Discord
- **Privacidad primero**: Signal
- **Ecosistema Apple**: iMessage, BlueBubbles
:::

---

## Detalles de Canales Principales

### 1. Telegram (Recomendado para Principiantes)

**Por qué se recomienda**:
- ⚡ El proceso de configuración más simple (solo requiere Bot Token)
- 📱 Soporte nativo de Markdown, medios enriquecidos
- 🌍 Disponible globalmente, sin necesidad de entorno de red especial

**Método de autenticación**:
1. Encuentra `@BotFather` en Telegram
2. Envía el comando `/newbot`
3. Configura el nombre del bot siguiendo las indicaciones
4. Obtén el Bot Token (formato: `123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ`)

**Ejemplo de configuración**:
```yaml
channels:
  telegram:
    botToken: "123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ"
    dmPolicy: "pairing"  # Protección de emparejamiento DM por defecto
    allowFrom: ["*"]     # Permite todos los usuarios (después del emparejamiento)
```

**Características**:
- ✅ Soporta Thread/Topic
- ✅ Soporta Reacciones con emojis
- ✅ Soporta archivos, imágenes, videos

---

### 2. WhatsApp (Recomendado para Usuarios Personales)

**Por qué se recomienda**:
- 📱 Usa número de teléfono real, los amigos no necesitan agregar un nuevo contacto
- 🌍 La herramienta de mensajería instantánea más popular del mundo
- 📞 Soporta mensajes de voz, llamadas

**Método de autenticación**:
1. Ejecuta `clawdbot channels login whatsapp`
2. Escanea el código QR (similar a WhatsApp Web)
3. O usa el enlace del teléfono (nueva función)

**Ejemplo de configuración**:
```yaml
channels:
  whatsapp:
    accounts:
      my-phone:
        dmPolicy: "pairing"  # Protección de emparejamiento DM por defecto
        allowFrom: ["*"]     # Permite todos los usuarios (después del emparejamiento)
```

**Características**:
- ✅ Soporta medios enriquecidos (imágenes, videos, documentos)
- ✅ Soporta mensajes de voz
- ✅ Soporta Reacciones con emojis
- ⚠️ **Requiere teléfono separado** (recomendado eSIM + teléfono de reserva)

::: warning Limitaciones de WhatsApp
- No inicies sesión con el mismo número en múltiples lugares simultáneamente
- Evita reconexiones frecuentes (podría provocar suspensión temporal)
- Recomendado usar un número de prueba separado
:::

---

### 3. Slack (Recomendado para Colaboración en Equipo)

**Por qué se recomienda**:
- 🏢 Ampliamente utilizado en empresas y equipos
- 🔧 Soporta Actions y Slash Commands ricos
- 📋 Integración perfecta con flujos de trabajo

**Método de autenticación**:
1. Crea una aplicación en [Slack API](https://api.slack.com/apps)
2. Habilita Bot Token Scopes
3. Habilita App-Level Token
4. Habilita Socket Mode
5. Obtén el Bot Token y App Token

**Ejemplo de configuración**:
```yaml
channels:
  slack:
    botToken: "xoxb-YOUR-BOT-TOKEN-HERE"
    appToken: "xapp-YOUR-APP-TOKEN-HERE"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

**Características**:
- ✅ Soporta canales, mensajes privados, grupos
- ✅ Soporta Slack Actions (crear canales, invitar usuarios, etc.)
- ✅ Soporta carga de archivos, emojis
- ⚠️ Requiere habilitar Socket Mode (para evitar exponer puertos)

---

### 4. Discord (Recomendado para Escenarios de Comunidad)

**Por qué se recomienda**:
- 🎮 Primera opción para escenarios de juegos y comunidad
- 🤖 Soporta funciones exclusivas de Discord (roles, gestión de canales)
- 👥 Potentes funciones de grupos y comunidad

**Método de autenticación**:
1. Crea una aplicación en [Discord Developer Portal](https://discord.com/developers/applications)
2. Crea un usuario Bot
3. Habilita Message Content Intent
4. Obtén el Bot Token

**Ejemplo de configuración**:
```yaml
channels:
  discord:
    botToken: "MTIzNDU2Nzg5MDEyMzQ1Njgw.GhIJKlmNoPQRsTUVwxyZABCDefGhIJKlmNoPQRsTUVwxyZ"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

**Características**:
- ✅ Soporta gestión de roles y permisos
- ✅ Soporta canales, hilos, emojis
- ✅ Soporta Actions específicos (crear canales, gestionar roles, etc.)
- ⚠️ Requiere configurar correctamente los Intents

---

### 5. Otros Canales Principales

#### Google Chat
- **Casos de uso**: Usuarios empresariales de Google Workspace
- **Método de autenticación**: OAuth o Service Account
- **Características**: Integración con Gmail, Calendar

#### Signal
- **Casos de uso**: Usuarios que priorizan la privacidad
- **Método de autenticación**: signal-cli
- **Características**: Cifrado de extremo a extremo, altamente seguro

#### iMessage
- **Casos de uso**: Usuarios de macOS
- **Método de autenticación**: imsg (exclusivo de macOS)
- **Características**: Integración con el ecosistema Apple, aún en desarrollo

---

## Introducción a Canales Extendidos

### WebChat (El Más Simple)

**Por qué se recomienda**:
- 🚀 No requiere cuenta de terceros o token
- 🌐 Soporte integrado de Gateway WebSocket
- 🔧 Desarrollo y depuración rápidos

**Cómo usarlo**:

Después de iniciar el Gateway, accede directamente de las siguientes maneras:
- **app macOS/iOS**: Interfaz nativa SwiftUI
- **Control UI**: Accede a la pestaña de chat de la consola desde el navegador

**Características**:
- ✅ Sin configuración, listo para usar
- ✅ Soporta pruebas y depuración
- ✅ Comparte sesiones y reglas de enrutamiento con otros canales
- ⚠️ Solo acceso local (se puede exponer a través de Tailscale)

---

### LINE (Usuarios Asiáticos)

**Casos de uso**: Usuarios de LINE en Japón, Taiwán, Tailandia, etc.

**Método de autenticación**: Messaging API (LINE Developers Console)

**Características**:
- ✅ Soporta botones, respuestas rápidas
- ✅ Ampliamente utilizado en mercados asiáticos
- ⚠️ Requiere revisión y cuenta comercial

---

### BlueBubbles (Extensión de iMessage)

**Casos de uso**: Necesidad de acceso remoto a iMessage

**Método de autenticación**: Private API

**Características**:
- ✅ Control remoto de iMessage
- ✅ Soporta múltiples dispositivos
- ⚠️ Requiere un servidor BlueBubbles separado

---

### Microsoft Teams (Colaboración Empresarial)

**Casos de uso**: Empresas que usan Office 365

**Método de autenticación**: Bot Framework

**Características**:
- ✅ Integración profunda con Teams
- ✅ Soporta Adaptive Cards
- ⚠️ Configuración compleja

---

### Matrix (Descentralizado)

**Casos de uso**: Entusiastas de la comunicación descentralizada

**Método de autenticación**: Matrix Bot SDK

**Características**:
- ✅ Red federada
- ✅ Cifrado de extremo a extremo
- ⚠️ Requiere configurar un Homeserver

---

### Zalo / Zalo Personal (Usuarios de Vietnam)

**Casos de uso**: Mercado de Vietnam

**Método de autenticación**: Zalo OA / Personal Account

**Características**:
- ✅ Soporta cuentas personales y empresariales
- ⚠️ Restricción regional (Vietnam)

---

## Mecanismo de Protección de Emparejamiento DM

### ¿Qué es la Protección de Emparejamiento DM?

Clawdbot activa por defecto la **Protección de Emparejamiento DM** (`dmPolicy="pairing"`), que es una característica de seguridad:

1. Los **remitentes desconocidos** recibirán un código de emparejamiento
2. Los mensajes no se procesarán hasta que apruebes el emparejamiento
3. Después de aprobar, el remitente se agrega a la lista blanca local

::: warning ¿Por qué se necesita la protección de emparejamiento?
Clawdbot se conecta a plataformas de mensajería reales, **debe tratar los DM entrantes como entradas no confiables**. La protección de emparejamiento puede:
- Prevenir spam y abuso
- Evitar procesar comandos maliciosos
- Proteger tu cuota de IA y privacidad
:::

### ¿Cómo aprobar un emparejamiento?

```bash
# Ver solicitudes de emparejamiento pendientes
clawdbot pairing list

# Aprobar emparejamiento
clawdbot pairing approve <channel> <code>

# Ejemplo: aprobar remitente de Telegram
clawdbot pairing approve telegram 123456
```

### Ejemplo del Proceso de Emparejamiento

```
Remitente desconocido: ¡Hola AI!
Clawdbot: 🔒 Por favor, empárate primero. Código de emparejamiento: ABC123
Tu operación: clawdbot pairing approve telegram ABC123
Clawdbot: ✅ ¡Emparejamiento exitoso! Ahora puedes enviar mensajes.
```

::: tip Desactivar la Protección de Emparejamiento DM (No Recomendado)
Si deseas acceso público, puedes configurar:
```yaml
channels:
  telegram:
    dmPolicy: "open"
    allowFrom: ["*"]  # Permite todos los usuarios
```

⚠️ ¡Esto reducirá la seguridad, úsalo con precaución!
:::

---

## Procesamiento de Mensajes de Grupo

### Activación por @mención

Por defecto, los mensajes de grupo requieren **@mención** del bot para responder:

```yaml
channels:
  slack:
    allowUnmentionedGroups: false  # Por defecto: requiere @mención
```

### Activación por Comandos

También puedes usar prefijos de comandos para activar:

```bash
# Enviar en grupo
/ask Explica el entrelazamiento cuántico
/help Lista comandos disponibles
/new Iniciar nueva conversación
```

### Ejemplo de Configuración

```yaml
channels:
  discord:
    allowUnmentionedGroups: false  # Requiere @mención
    # o
    allowUnmentionedGroups: true   # Responde a todos los mensajes (no recomendado)
```

---

## Configurar Canales: Asistente vs Manual

### Método A: Usar el Asistente de Onboarding (Recomendado)

```bash
clawdbot onboard
```

El asistente te guiará a través de:
1. Seleccionar un canal
2. Configurar autenticación (Token, API Key, etc.)
3. Establecer política DM
4. Probar conexión

### Método B: Configuración Manual

Edita el archivo de configuración `~/.clawdbot/clawdbot.json`:

```yaml
channels:
  telegram:
    botToken: "your-bot-token"
    dmPolicy: "pairing"
    allowFrom: ["*"]
  whatsapp:
    accountId: "my-phone"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

Reinicia el Gateway para aplicar la configuración:

```bash
clawdbot gateway restart
```

---

## Punto de Control ✅

Al completar este tutorial, deberías poder:

- [ ] Listar todos los canales soportados por Clawdbot
- [ ] Entender el mecanismo de protección de emparejamiento DM
- [ ] Elegir el canal más adecuado para ti
- [ ] Saber cómo configurar un canal (asistente o manual)
- [ ] Entender los métodos de activación de mensajes de grupo

::: tip Siguiente Paso
Elige un canal y comienza la configuración:
- [Configuración del Canal WhatsApp](../whatsapp/) - Usa número real
- [Configuración del Canal Telegram](../telegram/) - El más simple y rápido
- [Configuración del Canal Slack](../slack/) - Primera opción para colaboración en equipo
- [Configuración del Canal Discord](../discord/) - Escenarios de comunidad
:::

---

## Advertencias de Errores Comunes

### ❌ Olvidar Habilitar la Protección de Emparejamiento DM

**Enfoque incorrecto**:
```yaml
channels:
  telegram:
    dmPolicy: "open"  # ¡Muy abierto!
```

**Enfoque correcto**:
```yaml
channels:
  telegram:
    dmPolicy: "pairing"  # Por defecto seguro
```

::: danger Riesgo de DM Abierto
Abrir DM significa que cualquiera puede enviar mensajes a tu asistente de IA, lo que podría causar:
- Abuso de cuota
- Filtración de privacidad
- Ejecución de comandos maliciosos
:::

### ❌ WhatsApp Iniciado Sesión en Múltiples Lugares

**Enfoque incorrecto**:
- Iniciar sesión con el mismo número simultáneamente en el teléfono y Clawdbot
- Reconexiones frecuentes de WhatsApp

**Enfoque correcto**:
- Usa un número de prueba separado
- Evita reconexiones frecuentes
- Monitorea el estado de conexión

### ❌ Slack sin Socket Mode Habilitado

**Enfoque incorrecto**:
```yaml
channels:
  slack:
    botToken: "xoxb-..."
    # Falta appToken
```

**Enfoque correcto**:
```yaml
channels:
  slack:
    botToken: "xoxb-..."
    appToken: "xapp-..."  # Requerido
```

### ❌ Intents de Discord Configurados Incorrectamente

**Enfoque incorrecto**:
- Solo habilitar Intents básicos
- Olvidar habilitar Message Content Intent

**Enfoque correcto**:
- Habilitar todos los Intents necesarios en Discord Developer Portal
- Especialmente Message Content Intent

---

## Resumen de Esta Lección

En esta lección aprendiste:

1. ✅ **Visión General de Canales**: Clawdbot soporta 13+ canales de comunicación
2. ✅ **Canales Principales**: Características y configuración de Telegram, WhatsApp, Slack, Discord
3. ✅ **Canales Extendidos**: Canales especiales como LINE, BlueBubbles, Teams, Matrix
4. ✅ **Protección DM**: Valor de seguridad y métodos de uso del mecanismo de emparejamiento
5. ✅ **Procesamiento de Grupos**: Mecanismos de activación por @mención y comandos
6. ✅ **Métodos de Configuración**: Dos métodos: asistente y configuración manual

**Próximos Pasos**:

- Aprende la [Configuración del Canal WhatsApp](../whatsapp/), configura un número real
- Aprende la [Configuración del Canal Telegram](../telegram/), la forma más rápida de empezar
- Conoce la [Configuración del Canal Slack](../slack/), integración de colaboración en equipo
- Domina la [Configuración del Canal Discord](../discord/), escenarios de comunidad

---

## Próxima Lección

> En la próxima lección aprenderemos **[Configuración del Canal WhatsApp](../whatsapp/)**.
>
> Aprenderás:
> - Cómo iniciar sesión en WhatsApp usando QR Code o enlace del teléfono
> - Cómo configurar políticas DM y reglas de grupo
> - Cómo gestionar múltiples cuentas de WhatsApp
> - Cómo solucionar problemas de conexión de WhatsApp

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Click para expandir y ver ubicaciones del código fuente</strong></summary>

> Última actualización: 2026-01-27

| Función            | Ruta del Archivo                                                                                               | Líneas |
|--- | --- | ---|
| Registro de Canales     | [`src/channels/registry.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/registry.ts)       | 7-100  |
| Directorio de Plugins de Canal | [`src/channels/plugins/`](https://github.com/moltbot/moltbot/tree/main/src/channels/plugins/) | Todo   |
| Tipos de Metadatos de Canal   | [`src/channels/plugins/types.core.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/types.core.ts) | 74-93  |
| Mecanismo de Emparejamiento DM     | [`src/channels/plugins/pairing.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/pairing.ts) | Todo   |
| @mención en Grupos | [`src/channels/plugins/group-mentions.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/group-mentions.ts) | Todo   |
| Coincidencia de Lista Blanca     | [`src/channels/plugins/allowlist-match.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/allowlist-match.ts) | Todo   |
| Configuración de Directorio de Canal   | [`src/channels/plugins/directory-config.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/directory-config.ts) | Todo   |
| Plugin WhatsApp | [`src/channels/plugins/onboarding/whatsapp.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/onboarding/whatsapp.ts) | Todo   |
| Plugin Telegram | [`src/channels/plugins/onboarding/telegram.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/onboarding/telegram.ts) | Todo   |
| Plugin Slack     | [`src/channels/plugins/onboarding/slack.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/onboarding/slack.ts) | Todo   |
| Plugin Discord   | [`src/channels/plugins/onboarding/discord.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/onboarding/discord.ts) | Todo   |

**Constantes Clave**:
- `CHAT_CHANNEL_ORDER`: Array de orden de canales principales (de `src/channels/registry.ts:7-15`)
- `DEFAULT_CHAT_CHANNEL = "whatsapp"`: Canal por defecto (de `src/channels/registry.ts:21`)
- `dmPolicy="pairing"`: Política de emparejamiento DM por defecto (de `README.md:110`)

**Tipos Clave**:
- `ChannelMeta`: Interfaz de metadatos de canal (de `src/channels/plugins/types.core.ts:74-93`)
- `ChannelAccountSnapshot`: Instantánea de estado de cuenta de canal (de `src/channels/plugins/types.core.ts:95-142`)
- `ChannelSetupInput`: Interfaz de entrada de configuración de canal (de `src/channels/plugins/types.core.ts:19-51`)

**Funciones Clave**:
- `listChatChannels()`: Lista todos los canales principales (`src/channels/registry.ts:114-116`)
- `normalizeChatChannelId()`: Normaliza ID de canal (`src/channels/registry.ts:126-133`)
- `buildChannelUiCatalog()`: Construye catálogo UI (`src/channels/plugins/catalog.ts:213-239`)

</details>
