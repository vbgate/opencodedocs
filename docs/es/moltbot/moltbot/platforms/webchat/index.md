---
title: "Interfaz WebChat: asistente de IA en el navegador | Tutorial de Clawdbot"
sidebarTitle: "Prueba la IA web"
subtitle: "Interfaz WebChat: asistente de IA en el navegador"
description: "Aprende a usar la interfaz WebChat integrada de Clawdbot para chatear con el asistente de IA. Este tutorial explica cómo acceder a WebChat, sus funciones principales (gestión de sesiones, carga de archivos, soporte Markdown) y la configuración de acceso remoto (túnel SSH, Tailscale), sin necesidad de puertos adicionales ni configuración separada."
tags:
  - "WebChat"
  - "Interfaz del navegador"
  - "Chat"
prerequisite:
  - "start-gateway-startup"
order: 150
---

# Interfaz WebChat: asistente de IA en el navegador

## Lo que aprenderás

Al completar este tutorial, podrás:

- ✅ Acceder a la interfaz WebChat desde el navegador
- ✅ Enviar mensajes en WebChat y recibir respuestas de la IA
- ✅ Gestionar el historial de sesiones y cambiar entre sesiones
- ✅ Cargar archivos adjuntos (imágenes, audio, video)
- ✅ Configurar acceso remoto (Tailscale/túnel SSH)
- ✅ Entender las diferencias entre WebChat y otros canales

## Tu situación actual

Quizás ya hayas iniciado Gateway, pero desees una interfaz gráfica más intuitiva para conversar con el asistente de IA, en lugar de usar solo la línea de comandos.

Te podrías preguntar:

- "¿Existe una interfaz web similar a ChatGPT?"
- "¿Qué diferencias hay entre WebChat y los canales WhatsApp/Telegram?"
- "¿WebChat requiere configuración separada?"
- "¿Cómo usar WebChat en un servidor remoto?"

La buena noticia es: **WebChat es la interfaz de chat integrada de Clawdbot**, no requiere instalación ni configuración separada, está disponible después de iniciar Gateway.

## Cuándo usar esto

Cuando necesites:

- 🖥️ **Chat con interfaz gráfica**: prefieres la experiencia de chat en el navegador en lugar de la línea de comandos
- 📊 **Gestión de sesiones**: ver historial, cambiar entre diferentes sesiones
- 🌐 **Acceso local**: conversar con la IA en el mismo dispositivo
- 🔄 **Acceso remoto**: acceder a un Gateway remoto a través de túneles SSH/Tailscale
- 💬 **Interacción con texto enriquecido**: soporte para formato Markdown y archivos adjuntos

---

## 🎒 Preparativos

Antes de usar WebChat, confirma:

### Requisitos obligatorios

| Condición                     | Cómo verificar                                        |
|--- | ---|
| **Gateway iniciado**   | `clawdbot gateway status` o verificar si el proceso está en ejecución |
| **Puerto accesible**       | Confirmar que el puerto 18789 (o puerto personalizado) no está ocupado |
| **Modelo de IA configurado** | `clawdbot models list` para ver si hay modelos disponibles      |

::: warning Curso previo
Este tutorial asume que ya has completado:
- [Inicio rápido](../../start/getting-started/) - Instalación, configuración e inicio de Clawdbot
- [Iniciar Gateway](../../start/gateway-startup/) - Comprender los diferentes modos de inicio de Gateway

Si aún no los has completado, vuelve primero a estos cursos.
:::

### Opcional: configurar autenticación

WebChat requiere autenticación de forma predeterminada (incluso para acceso local) para proteger tu asistente de IA.

Verificación rápida:

```bash
## Ver configuración de autenticación actual
clawdbot config get gateway.auth.mode
clawdbot config get gateway.auth.token
```

Si no está configurado, se recomienda configurar primero:

```bash
## Establecer autenticación por token (recomendado)
clawdbot config set gateway.auth.mode token
clawdbot config set gateway.auth.token your-secure-token-here
```

Explicación detallada: [Configuración de autenticación de Gateway](../../advanced/security-sandbox/).

---

## Conceptos clave

### ¿Qué es WebChat?

**WebChat** es la interfaz de chat integrada de Clawdbot, que interactúa directamente con el asistente de IA a través de WebSocket de Gateway.

**Características clave**:

```
┌─────────────────────────────────────────────────────┐
│              Arquitectura de WebChat                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Navegador/Cliente                                     │
│      │                                              │
│      ▼                                              │
│  Gateway WebSocket (ws://127.0.0.1:18789)          │
│      │                                              │
│      ├─ chat.send → Agent → procesar mensaje              │
│      ├─ chat.history → devolver historial de sesión               │
│      ├─ chat.inject → agregar nota del sistema              │
│      └─ flujo de eventos → actualización en tiempo real                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Diferencias con otros canales**:

| Característica         | WebChat                          | WhatsApp/Telegram, etc.                |
|--- | --- | ---|
| **Método de acceso** | Acceso directo a Gateway desde el navegador           | Requiere APP de terceros e inicio de sesión         |
| **Requisitos de configuración** | Sin configuración separada, reutiliza el puerto de Gateway   | Requiere API Key/Token específico del canal  |
| **Enrutamiento de respuestas** | Enrutamiento determinista de vuelta a WebChat          | Enrutado al canal correspondiente              |
| **Acceso remoto** | A través de túneles SSH/Tailscale       | Proporcionado por la plataforma del canal         |
| **Modelo de sesión** | Usa la gestión de sesiones de Gateway        | Usa la gestión de sesiones de Gateway        |

### Cómo funciona WebChat

WebChat no requiere servidor HTTP separado ni configuración de puerto, usa directamente el servicio WebSocket de Gateway.

**Puntos clave**:
- **Puerto compartido**: WebChat usa el mismo puerto que Gateway (por defecto 18789)
- **Sin configuración adicional**: no hay bloque de configuración dedicado `webchat.*`
- **Sincronización en tiempo real**: el historial se obtiene de Gateway en tiempo real, sin caché local
- **Modo solo lectura**: si Gateway no es accesible, WebChat pasa a modo solo lectura

::: info WebChat vs Interfaz de control
WebChat se enfoca en la experiencia de chat, mientras que la **Interfaz de Control (Control UI)** proporciona el panel de control completo de Gateway (configuración, gestión de sesiones, gestión de habilidades, etc.).

- WebChat: `http://localhost:18789/chat` o vista de chat en la app de macOS
- Interfaz de Control: `http://localhost:18789/` panel de control completo
:::

---

## Sigue los pasos

### Paso 1: Acceder a WebChat

**Por qué**
WebChat es la interfaz de chat integrada de Gateway, no requiere instalación de software adicional.

#### Método 1: Acceso desde el navegador

Abre el navegador y visita:

```bash
## Dirección predeterminada (usa el puerto predeterminado 18789)
http://localhost:18789

## O usa la dirección de loopback (más confiable)
http://127.0.0.1:18789
```

**Deberías ver**:
```
┌─────────────────────────────────────────────┐
│          WebChat de Clawdbot              │
│                                             │
│  ┌───────────────────────────────────┐   │
│  │  [Lista de sesiones]  [Configuración]      │   │
│  └───────────────────────────────────┘   │
│                                             │
│  ┌───────────────────────────────────┐   │
│  │  ¡Hola! Soy tu asistente de IA.       │   │
│  │  ¿En qué puedo ayudarte?        │   │
│  └───────────────────────────────────┘   │
│                                             │
│  [Escribe mensaje...]                  [Enviar]   │
└─────────────────────────────────────────────┘
```

#### Método 2: Aplicación macOS

Si has instalado la aplicación de barra de menús de Clawdbot para macOS:

1. Haz clic en el icono de la barra de menús
2. Selecciona "Abrir WebChat" o haz clic en el icono de chat
3. WebChat se abrirá en una ventana independiente

**Ventajas**:
- Experiencia nativa de macOS
- Soporte de atajos de teclado
- Integración con Voice Wake y Talk Mode

#### Método 3: Acceso rápido desde la línea de comandos

```bash
## Abre automáticamente el navegador en WebChat
clawdbot web
```

**Deberías ver**: el navegador predeterminado se abre automáticamente y navega a `http://localhost:18789`

---

### Paso 2: Enviar el primer mensaje

**Por qué**
Verificar que la conexión entre WebChat y Gateway es normal, y que el asistente de IA puede responder correctamente.

1. Escribe tu primer mensaje en el campo de entrada
2. Haz clic en el botón "Enviar" o presiona `Enter`
3. Observa la respuesta de la interfaz de chat

**Mensaje de ejemplo**:
```
Hello! I'm testing WebChat. Can you introduce yourself?
```

**Deberías ver**:
```
┌─────────────────────────────────────────────┐
│  Tú → IA: Hello! I'm testing...      │
│                                             │
│  IA → Tú: ¡Hola! Soy el asistente de IA de Clawdbot    │
│  Puedo ayudarte a responder preguntas,          │
│  escribir código, gestionar tareas, etc.              │
│  ¿En qué puedo ayudarte?            │
│                                             │
│  [Escribe mensaje...]                  [Enviar]   │
└─────────────────────────────────────────────┘
```

::: tip Sugerencia de autenticación
Si Gateway está configurado con autenticación, al acceder a WebChat se te pedirá que introduzcas un token o contraseña:

```
┌─────────────────────────────────────────────┐
│          Autenticación de Gateway                    │
│                                             │
│  Introduce Token:                             │
│  [•••••••••••••]              │
│                                             │
│              [Cancelar]  [Iniciar sesión]               │
└─────────────────────────────────────────────┘
```

Introduce el `gateway.auth.token` o `gateway.auth.password` que hayas configurado.
:::

---

### Paso 3: Usar las funciones de WebChat

**Por qué**
WebChat proporciona funciones de interacción ricas, familiarizarte con ellas mejorará la experiencia de uso.

#### Gestión de sesiones

WebChat admite gestión de múltiples sesiones, lo que te permite conversar con la IA en diferentes contextos.

**Pasos**:

1. Haz clic en la lista de sesiones a la izquierda (o en el botón "Nueva sesión")
2. Selecciona o crea una nueva sesión
3. Continúa la conversación en la nueva sesión

**Características de las sesiones**:
- ✅ Contexto independiente: el historial de mensajes de cada sesión está aislado
- ✅ Guardado automático: todas las sesiones son gestionadas por Gateway, almacenamiento persistente
- ✅ Sincronización multiplataforma: comparte los mismos datos de sesión con CLI, app de macOS, nodos iOS/Android

::: info Sesión principal
WebChat usa de forma predeterminada la **clave de sesión principal** de Gateway (`main`), lo que significa que todos los clientes (CLI, WebChat, app de macOS, nodos iOS/Android) comparten el mismo historial de sesión principal.

Si necesitas contexto aislado, puedes configurar diferentes claves de sesión en la configuración.
:::

#### Carga de archivos adjuntos

WebChat admite cargar imágenes, audio, video y otros archivos adjuntos.

**Pasos**:

1. Haz clic en el icono "Adjunto" junto al campo de entrada (generalmente 📎 o 📎️)
2. Selecciona el archivo que deseas cargar (o arrastra el archivo al área de chat)
3. Escribe una descripción de texto relacionada
4. Haz clic en "Enviar"

**Formatos admitidos**:
- 📷 **Imágenes**: JPEG, PNG, GIF
- 🎵 **Audio**: MP3, WAV, M4A
- 🎬 **Video**: MP4, MOV
- 📄 **Documentos**: PDF, TXT, etc. (depende de la configuración de Gateway)

**Deberías ver**:
```
┌─────────────────────────────────────────────┐
│  Tú → IA: Por favor analiza esta imagen         │
│  [📎 photo.jpg]                         │
│                                             │
│  IA → Tú: Veo que esto es una...        │
│  [Resultado del análisis...]                              │
└─────────────────────────────────────────────┘
```

::: warning Límite de tamaño de archivo
WebChat y Gateway tienen límites de tamaño para los archivos cargados (generalmente unos pocos MB). Si la carga falla, verifica el tamaño del archivo o la configuración de medios de Gateway.
:::

#### Soporte Markdown

WebChat admite formato Markdown, lo que te permite formatear mensajes.

**Ejemplo**:

```markdown
# Título
## Subtítulo de nivel 2
- Elemento de lista 1
- Elemento de lista 2

**Negrita** y *cursiva*
`código`
```

**Vista previa del efecto**:
```
# Título
## Subtítulo de nivel 2
- Elemento de lista 1
- Elemento de lista 2

**Negrita** y *cursiva*
`código`
```

#### Atajos de comandos

WebChat admite comandos de barra diagonal para ejecutar acciones específicas rápidamente.

**Comandos comunes**:

| Comando             | Función                         |
|--- | ---|
| `/new`          | Crear nueva sesión                   |
| `/reset`        | Restablecer el historial de la sesión actual           |
| `/clear`        | Limpiar todos los mensajes de la sesión actual       |
| `/status`       | Mostrar estado de Gateway y canales       |
| `/models`       | Listar modelos de IA disponibles         |
| `/help`         | Mostrar información de ayuda                 |

**Ejemplo de uso**:

```
/new
## Crear nueva sesión

/reset
## Restablecer sesión actual
```

---

### Paso 4 (opcional): Configurar acceso remoto

**Por qué**
Si ejecutas Gateway en un servidor remoto, o deseas acceder a WebChat desde otros dispositivos, necesitas configurar el acceso remoto.

#### Acceso a través de túnel SSH

**Escenario aplicable**: Gateway está en un servidor remoto, deseas acceder a WebChat desde tu máquina local.

**Pasos**:

1. Establece un túnel SSH, mapea el puerto de Gateway remoto al puerto local:

```bash
## Mapea el puerto 18789 remoto al puerto 18789 local
ssh -L 18789:localhost:18789 user@your-remote-server.com
```

2. Mantén la conexión SSH abierta (o usa el parámetro `-N` para no ejecutar comandos remotos)

3. Accede desde el navegador local: `http://localhost:18789`

**Deberías ver**: la misma interfaz WebChat que el acceso local

::: tip Mantenimiento del túnel SSH
El túnel SSH deja de funcionar cuando se desconecta la conexión. Si necesitas acceso persistente:

- Usa `autossh` para reconexión automática
- Configura `LocalForward` en SSH Config
- Usa systemd/launchd para iniciar el túnel automáticamente
:::

#### Acceso a través de Tailscale

**Escenario aplicable**: usa Tailscale para construir una red privada, Gateway y el cliente están en el mismo tailnet.

**Pasos de configuración**:

1. Habilita Tailscale Serve o Funnel en la máquina Gateway:

```bash
## Editar archivo de configuración
clawdbot config set gateway.tailscale.mode serve
## O
clawdbot config set gateway.tailscale.mode funnel
```

2. Reinicia Gateway

```bash
## Reiniciar Gateway para aplicar la configuración
clawdbot gateway restart
```

3. Obtén la dirección Tailscale de Gateway

```bash
## Ver estado (mostrará la URL de Tailscale)
clawdbot gateway status
```

4. Accede desde el dispositivo cliente (mismo tailnet):

```
http://<gateway-tailscale-name>.tailnet-<tailnet-id>.ts.net:18789
```

::: info Tailscale Serve vs Funnel
- **Serve**: accesible solo dentro del tailnet, más seguro
- **Funnel**: acceso público a Internet, requiere protección `gateway.auth`

Se recomienda usar el modo Serve, a menos que necesites acceso desde la red pública.
:::

#### Autenticación de acceso remoto

Ya sea usando túnel SSH o Tailscale, si Gateway está configurado con autenticación, aún necesitas proporcionar token o contraseña.

**Verificar configuración de autenticación**:

```bash
## Ver modo de autenticación
clawdbot config get gateway.auth.mode

## Si es modo token, confirmar que el token está establecido
clawdbot config get gateway.auth.token
```

---

## Punto de control ✅

Después de completar los pasos anteriores, deberías poder:

- [ ] Acceder a WebChat desde el navegador (`http://localhost:18789`)
- [ ] Enviar mensajes y recibir respuestas de la IA
- [ ] Usar funciones de gestión de sesiones (crear nueva, cambiar, restablecer sesión)
- [ ] Cargar archivos adjuntos y hacer que la IA los analice
- [ ] (Opcional) Acceder a WebChat de forma remota a través de túnel SSH
- [ ] (Opcional) Acceder a WebChat a través de Tailscale

::: tip Verificar conexión
Si WebChat no es accesible o el envío de mensajes falla, verifica:

1. Gateway está en ejecución: `clawdbot gateway status`
2. El puerto es correcto: confirma que accedes a `http://127.0.0.1:18789` (en lugar de `localhost:18789`)
3. La autenticación está configurada: `clawdbot config get gateway.auth.*`
4. Ver registros detallados: `clawdbot gateway --verbose`
:::

---

## Evita errores comunes

### ❌ Gateway no iniciado

**Enfoque incorrecto**:
```
Acceder directamente a http://localhost:18789
## Resultado: conexión fallida o no se puede cargar
```

**Enfoque correcto**:
```bash
## Primero iniciar Gateway
clawdbot gateway --port 18789

## Luego acceder a WebChat
open http://localhost:18789
```

::: warning Gateway debe iniciarse primero
WebChat depende del servicio WebSocket de Gateway. Sin un Gateway en ejecución, WebChat no puede funcionar normalmente.
:::

### ❌ Configuración de puerto incorrecta

**Enfoque incorrecto**:
```
Acceder a http://localhost:8888
## Gateway realmente se ejecuta en el puerto 18789
## Resultado: conexión rechazada
```

**Enfoque correcto**:
```bash
## 1. Ver el puerto real de Gateway
clawdbot config get gateway.port

## 2. Acceder con el puerto correcto
open http://localhost:<gateway.port>
```

### ❌ Falta configuración de autenticación

**Enfoque incorrecto**:
```
No configurar gateway.auth.mode o token
## Resultado: WebChat muestra fallo de autenticación
```

**Enfoque correcto**:
```bash
## Establecer autenticación por token (recomendado)
clawdbot config set gateway.auth.mode token
clawdbot config set gateway.auth.token your-secure-token-here

## Reiniciar Gateway
clawdbot gateway restart

## Introducir token al acceder a WebChat
```

### ❌ Acceso remoto no configurado

**Enfoque incorrecto**:
```
Acceder directamente desde local a la IP del servidor remoto
http://remote-server-ip:18789
## Resultado: tiempo de espera de conexión (firewall bloquea)
```

**Enfoque correcto**:
```bash
## Usar túnel SSH
ssh -L 18789:localhost:18789 user@remote-server.com

## O usar Tailscale Serve
clawdbot config set gateway.tailscale.mode serve
clawdbot gateway restart

## Acceder desde el navegador local
http://localhost:18789
```

---

## Resumen de esta lección

En esta lección has aprendido:

1. ✅ **Introducción a WebChat**: interfaz de chat integrada basada en WebSocket de Gateway, sin configuración separada
2. ✅ **Métodos de acceso**: acceso desde navegador, aplicación macOS, acceso rápido desde línea de comandos
3. ✅ **Funciones principales**: gestión de sesiones, carga de archivos, soporte Markdown, comandos de barra diagonal
4. ✅ **Acceso remoto**: acceder a Gateway remoto a través de túnel SSH o Tailscale
5. ✅ **Configuración de autenticación**: comprender los modos de autenticación de Gateway (token/password/Tailscale)
6. ✅ **Solución de problemas**: problemas comunes y soluciones

**Revisión de conceptos clave**:

- WebChat usa el mismo puerto que Gateway, no requiere servidor HTTP separado
- El historial es gestionado por Gateway, sincronización en tiempo real, sin caché local
- Si Gateway no es accesible, WebChat pasa a modo solo lectura
- Las respuestas se enrutan de forma determinista de vuelta a WebChat, diferente de otros canales

**Siguientes pasos**:

- Explora la [aplicación macOS](../macos-app/), conoce el control de la barra de menús y la función Voice Wake
- Aprende sobre el [nodo iOS](../ios-node/), configura dispositivos móviles para ejecutar operaciones locales
- Conoce la [interfaz visual Canvas](../../advanced/canvas/), experimenta el espacio de trabajo visual impulsado por IA

---

## Próxima lección

> En la próxima lección aprenderemos sobre la **[aplicación macOS](../macos-app/)**.
>
> Aprenderás:
> - Funciones y diseño de la aplicación de barra de menús de macOS
> - Uso de Voice Wake y Talk Mode
> - Integración entre WebChat y la aplicación macOS
> - Herramientas de depuración y control remoto de Gateway

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-27

| Función                  | Ruta de archivo                                                                                    | Número de línea    |
|--- | --- | ---|
| Explicación del principio de WebChat     | [`docs/web/webchat.md`](https://github.com/moltbot/moltbot/blob/main/docs/web/webchat.md) | Archivo completo   |
| API WebSocket de Gateway | [`src/gateway/protocol/`](https://github.com/moltbot/moltbot/blob/main/src/gateway/protocol/) | Directorio completo   |
| Método chat.send        | [`src/gateway/server-methods/chat.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/server-methods/chat.ts) | 296-380  |
| Método chat.history     | [`src/gateway/server-methods/chat.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/server-methods/chat.ts) | 1-295    |
| Método chat.inject      | [`src/gateway/server-methods/chat.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/server-methods/chat.ts) | 381-450  |
| Entrada de Web UI         | [`ui/index.html`](https://github.com/moltbot/moltbot/blob/main/ui/index.html) | 1-15     |
| Configuración de autenticación de Gateway     | [`src/config/zod-schema.core.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.core.ts) | 1-100    |
| Integración de Tailscale       | [`src/gateway/server-startup-log.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/server-startup-log.ts) | Archivo completo   |
| Integración de WebChat de macOS  | [`apps/macos/`](https://github.com/moltbot/moltbot/blob/main/apps/macos/) | Directorio completo   |

**Constantes clave**:
- `INTERNAL_MESSAGE_CHANNEL = "webchat"`: identificador del canal de mensajes interno de WebChat (de `src/utils/message-channel.ts:17`)

**Opciones de configuración clave**:
- `gateway.port`: puerto WebSocket (por defecto 18789)
- `gateway.auth.mode`: modo de autenticación (token/password/tailscale)
- `gateway.auth.token`: valor del token para autenticación por token
- `gateway.auth.password`: valor de contraseña para autenticación por contraseña
- `gateway.tailscale.mode`: modo Tailscale (serve/funnel/disabled)
- `gateway.remote.url`: dirección WebSocket de Gateway remoto
- `gateway.remote.token`: token de autenticación de Gateway remoto
- `gateway.remote.password`: contraseña de autenticación de Gateway remoto

**Métodos WebSocket clave**:
- `chat.send(message)`: enviar mensaje al Agent (de `src/gateway/server-methods/chat.ts`)
- `chat.history(sessionId)`: obtener historial de sesión (de `src/gateway/server-methods/chat.ts`)
- `chat.inject(message)`: inyectar directamente nota del sistema en la sesión, sin pasar por Agent (de `src/gateway/server-methods/chat.ts`)

**Características arquitectónicas**:
- WebChat no requiere servidor HTTP separado ni configuración de puerto
- Usa el mismo puerto que Gateway (por defecto 18789)
- El historial se obtiene de Gateway en tiempo real, sin caché local
- Las respuestas se enrutan de forma determinista de vuelta a WebChat (diferente de otros canales)

</details>
