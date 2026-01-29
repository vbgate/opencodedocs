---
title: "Enviar tu primer mensaje: Conversar con la IA a través de WebChat o canales | Tutorial de Clawdbot"
sidebarTitle: "Hablando con la IA"
subtitle: "Enviar tu primer mensaje: Conversar con la IA a través de WebChat o canales"
description: "Aprende a enviar tu primer mensaje al asistente de IA Clawdbot a través de la interfaz WebChat o canales configurados (WhatsApp/Telegram/Slack/Discord). Incluye comandos CLI, acceso a WebChat y envío de mensajes a canales, con resultados esperados y solución de problemas."
tags:
  - "Primeros pasos"
  - "WebChat"
  - "Canales"
  - "Mensajes"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 40
---

# Enviar tu primer mensaje: Conversar con la IA a través de WebChat o canales

## Lo que aprenderás

Al completar este tutorial, podrás:

- ✅ Conversar con el asistente de IA a través de CLI
- ✅ Enviar mensajes usando la interfaz WebChat
- ✅ Conversar con la IA en canales configurados (WhatsApp, Telegram, Slack, etc.)
- ✅ Comprender los resultados esperados y códigos de estado del envío de mensajes

## Tu situación actual

Quizás acabes de completar la instalación de Clawdbot y el inicio de Gateway, pero no sabes cómo verificar que todo funciona correctamente.

Puedes estar preguntándote:

- "Gateway se inició, ¿cómo confirmo que puede responder a los mensajes?"
- "¿Hay alguna interfaz gráfica además de la línea de comandos?"
- "Configuré WhatsApp/Telegram, ¿cómo hablar con la IA en esas plataformas?"

La buena noticia es: **Clawdbot ofrece múltiples formas de enviar tu primer mensaje**, siempre habrá una que se adapte a ti.

## Cuándo usar esto

Cuando necesites:

- 🧪 **Verificar la instalación**: Confirmar que Gateway y el asistente de IA funcionan correctamente
- 🌐 **Probar canales**: Verificar que las conexiones de WhatsApp/Telegram/Slack, etc. funcionan bien
- 💬 **Conversación rápida**: Sin abrir la aplicación del canal, conversar directamente con la IA a través de CLI o WebChat
- 🔄 **Entregar respuestas**: Enviar las respuestas de la IA de vuelta a un canal o contacto específico

---

## 🎒 Preparativos

Antes de enviar tu primer mensaje, confirma:

### Requisitos obligatorios

| Condición | Cómo verificar |
| --- | --- |
| **Gateway iniciado** | `clawdbot gateway status` o verificar si el proceso está en ejecución |
| **Modelo de IA configurado** | `clawdbot models list` para ver si hay modelos disponibles |
| **Puerto accesible** | Confirmar que el puerto 18789 (o puerto personalizado) no esté ocupado |

::: warning Cursos previos
Este tutorial asume que ya has completado:
- [Inicio rápido](../getting-started/) - Instalación, configuración e inicio de Clawdbot
- [Iniciar Gateway](../gateway-startup/) - Conocer los diferentes modos de inicio de Gateway

Si aún no los has completado, regresa primero a estos cursos.
:::

### Opcional: Configurar canales

Si deseas enviar mensajes a través de WhatsApp/Telegram/Slack, etc., necesitas configurar los canales primero.

Verificación rápida:

```bash
## Ver canales configurados
clawdbot channels list
```

Si devuelve una lista vacía o falta el canal que deseas usar, consulta el tutorial de configuración del canal correspondiente (en la sección `platforms/`).

---

## Conceptos clave

Clawdbot admite tres formas principales de enviar mensajes:

```
┌─────────────────────────────────────────────────────────────┐
│              Formas de envío de mensajes de Clawdbot      │
├─────────────────────────────────────────────────────────────┤
│                                                         │
│  Forma 1: Conversación con CLI Agent                       │
│  ┌─────────────┐                                       │
│  │ clawdbot   │ → Gateway → IA → Devolver resultado    │
│  │ agent        │                                       │
│  │ --message    │                                       │
│  └─────────────┘                                       │
│                                                         │
│  Forma 2: CLI envía mensajes directamente al canal         │
│  ┌─────────────┐                                       │
│  │ clawdbot   │ → Gateway → Canal → Enviar mensaje      │
│  │ message send │                                       │
│  │ --target     │                                       │
│  └─────────────┘                                       │
│                                                         │
│  Forma 3: WebChat / Canales configurados                 │
│  ┌─────────────┐               ┌──────────────┐   │
│  │ WebChat     │   o           │ WhatsApp    │   │
│  │ Interfaz    │              │ Telegram    │ → Gateway → IA → Respuesta del canal │
│  │ del navegador │              │ Slack       │   │
│  └─────────────┘               │ Discord     │   │
│                                 └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Diferencias clave**:

| Forma | ¿Pasa por la IA? | Uso |
| --- | --- | --- |
| `clawdbot agent` | ✅ Sí | Conversar con la IA, obtener respuestas y proceso de pensamiento |
| `clawdbot message send` | ❌ No | Enviar mensajes directamente al canal, sin pasar por la IA |
| WebChat / Canales | ✅ Sí | Conversar con la IA a través de interfaz gráfica |

::: info Elegir la forma adecuada
- **Verificar la instalación**: Usa `clawdbot agent` o WebChat
- **Probar canales**: Usa las aplicaciones de WhatsApp/Telegram, etc.
- **Envío masivo**: Usa `clawdbot message send` (sin pasar por la IA)
:::

---

## Sigue estos pasos

### Paso 1: Conversar con la IA a través de CLI

**Por qué**
CLI es la forma más rápida de verificación, no requiere abrir navegador o aplicaciones de canales.

#### Conversación básica

```bash
## Enviar mensaje simple al asistente de IA
clawdbot agent --message "Hello, I'm testing Clawdbot!"
```

**Deberías ver**:
```
[clawdbot] Thinking...
[clawdbot] Hello! I'm your AI assistant powered by Clawdbot. How can I help you today?
```

#### Usar nivel de pensamiento

Clawdbot admite diferentes niveles de pensamiento, controlando la "transparencia" de la IA:

```bash
## Nivel de pensamiento alto (mostrar proceso de razonamiento completo)
clawdbot agent --message "Ship checklist" --thinking high

## Desactivar pensamiento (solo ver la respuesta final)
clawdbot agent --message "What's 2+2?" --thinking off
```

**Deberías ver** (nivel de pensamiento alto):
```
[clawdbot] I'll create a comprehensive ship checklist for you.

[THINKING]
Let me think about what needs to be checked for shipping:

1. Code readiness
   - All tests passing?
   - Code review completed?
   - Documentation updated?

2. Build configuration
   - Environment variables set correctly?
   - Build artifacts generated?

[THINKING END]

[clawdbot] 🚢 Ship checklist:
1. Check Node.js version (≥ 22)
2. Install Clawdbot globally
3. Run onboarding wizard
4. Start Gateway
5. Send test message
```

**Opciones de nivel de pensamiento**:

| Nivel | Descripción | Casos de uso |
| --- | --- | --- |
| `off` | No mostrar el proceso de pensamiento | Preguntas simples, respuesta rápida |
| `minimal` | Minimizar salida de pensamiento | Depuración, verificar proceso |
| `low` | Bajo detalle | Conversaciones diarias |
| `medium` | Detalle medio | Tareas complejas |
| `high` | Alto detalle (incluye proceso de razonamiento completo) | Aprendizaje, generación de código |

#### Especificar canal de respuesta

Puedes hacer que la IA envíe la respuesta a un canal específico (en lugar del canal predeterminado):

```bash
## Hacer que la IA responda y envíe a Telegram
clawdbot agent --message "Send me a weather update" --deliver --reply-channel telegram
```

::: tip Parámetros comunes
- `--to <número>`: Especificar número E.164 del destinatario (usado para crear sesión específica)
- `--agent <id>`: Usar ID de Agent específico (en lugar de main predeterminado)
- `--session-id <id>`: Continuar sesión existente en lugar de crear nueva
- `--verbose on`: Habilitar salida de registros detallados
- `--json`: Salida en formato JSON (apto para análisis de scripts)
:::

---

### Paso 2: Enviar mensajes a través de la interfaz WebChat

**Por qué**
WebChat proporciona una interfaz gráfica en el navegador, más intuitiva, admite texto enriquecido y archivos adjuntos.

#### Acceder a WebChat

WebChat usa el servicio WebSocket de Gateway, **no requiere configuración separada o puerto adicional**.

**Formas de acceso**:

1. **Abrir navegador, visitar**: `http://localhost:18789`
2. **O ejecutar en terminal**: `clawdbot dashboard` (abre el navegador automáticamente)

::: info Puerto de WebChat
WebChat usa el mismo puerto que Gateway (predeterminado 18789). Si modificaste el puerto de Gateway, WebChat también usará el mismo puerto.
:::

**Deberías ver**:
```
┌─────────────────────────────────────────────┐
│          Clawdbot WebChat              │
│  ┌───────────────────────────────────┐   │
│  │  ¡Hola! Soy tu asistente de IA.       │   │
│  │  ¿En qué puedo ayudarte?        │   │
│  └───────────────────────────────────┘   │
│  [Cuadro de entrada...                       │   │
│  [Enviar]                            │   │
└─────────────────────────────────────────────┘
```

#### Enviar mensajes

1. Ingresa tu mensaje en el cuadro de entrada
2. Haz clic en "Enviar" o presiona `Enter`
3. Espera la respuesta de la IA

**Deberías ver**:
- La respuesta de la IA se muestra en la interfaz de chat
- Si está habilitado el nivel de pensamiento, se mostrará el marcador `[THINKING]`

**Funciones de WebChat**:

| Función | Descripción |
| --- | --- |
| Texto enriquecido | Admite formato Markdown |
| Archivos adjuntos | Admite carga de imágenes, audio, video |
| Historial | Guarda automáticamente el historial de sesiones |
| Cambio de sesión | Cambiar entre diferentes sesiones en el panel izquierdo |

::: tip Aplicación de la barra de menús en macOS
Si instalaste la aplicación Clawdbot para macOS, también puedes abrir WebChat directamente desde el botón "Open WebChat" en la barra de menús.
:::

---

### Paso 3: Enviar mensajes a través de canales configurados

**Por qué**
Verificar que las conexiones de canales (WhatsApp, Telegram, Slack, etc.) funcionan correctamente y experimentar conversaciones reales multiplataforma.

#### Ejemplo de WhatsApp

Si configuraste WhatsApp durante el onboarding o en la configuración:

1. **Abrir la aplicación de WhatsApp** (teléfono o versión de escritorio)
2. **Buscar tu número de Clawdbot** (o contacto guardado)
3. **Enviar mensaje**: `Hello from WhatsApp!`

**Deberías ver**:
```
[WhatsApp]
Tú → Clawdbot: Hello from WhatsApp!

Clawdbot → Tú: Hello! I received your message via WhatsApp.
How can I help you today?
```

#### Ejemplo de Telegram

Si configuraste el Bot de Telegram:

1. **Abrir la aplicación de Telegram**
2. **Buscar tu Bot** (usar nombre de usuario)
3. **Enviar mensaje**: `/start` o `Hello from Telegram!`

**Deberías ver**:
```
[Telegram]
Tú → @your_bot: /start

@your_bot → Tú: Welcome! I'm Clawdbot's AI assistant.
You can talk to me here, and I'll respond via AI.
```

#### Ejemplo de Slack/Discord

Para Slack o Discord:

1. **Abrir la aplicación correspondiente**
2. **Encontrar el canal o servidor donde está el Bot**
3. **Enviar mensaje**: `Hello from Slack!`

**Deberías ver**:
- El Bot responde a tu mensaje
- Puede aparecer la etiqueta "AI Assistant" antes del mensaje

::: info Protección de emparejamiento DM
De forma predeterminada, Clawdbot habilita **protección de emparejamiento DM**:
- Los remitentes desconocidos recibirán un código de emparejamiento
- Los mensajes no se procesarán hasta que apruebes el emparejamiento

Si es la primera vez que envías mensajes desde un canal, es posible que necesites:
```bash
## Ver solicitudes de emparejamiento pendientes
clawdbot pairing list

## Aprobar solicitud de emparejamiento (reemplaza <channel> y <code> con valores reales)
clawdbot pairing approve <channel> <code>
```

Explicación detallada: [Emparejamiento DM y control de acceso](../pairing-approval/)
:::

---

### Paso 4 (Opcional): Enviar mensajes directamente al canal

**Por qué**
No pasar por la IA, enviar mensajes directamente al canal. Adecuado para escenarios como notificaciones por lotes, mensajes push, etc.

#### Enviar mensajes de texto

```bash
## Enviar mensaje de texto a WhatsApp
clawdbot message send --target +15555550123 --message "Hello from CLI!"
```

#### Enviar mensajes con archivos adjuntos

```bash
## Enviar imagen
clawdbot message send --target +15555550123 \
  --message "Check out this photo" \
  --media ~/Desktop/photo.jpg

## Enviar imagen URL
clawdbot message send --target +15555550123 \
  --message "Here's a link" \
  --media https://example.com/image.png
```

**Deberías ver**:
```
[clawdbot] Message sent successfully
[clawdbot] Message ID: 3EB0A1234567890
```

::: tip Parámetros comunes de message send
- `--channel`: Especificar el canal (predeterminado: whatsapp)
- `--reply-to <id>`: Responder a un mensaje específico
- `--thread-id <id>`: ID de tema de Telegram
- `--buttons <json>`: Botones en línea de Telegram (formato JSON)
- `--card <json>`: Adaptive Card (canales compatibles)
:::

---

## Punto de control ✅

Después de completar los pasos anteriores, deberías poder:

- [ ] Enviar mensajes a través de CLI y recibir respuestas de IA
- [ ] Enviar mensajes en la interfaz WebChat y ver respuestas
- [ ] (Opcional) Enviar mensajes en canales configurados y recibir respuestas de IA
- [ ] (Opcional) Usar `clawdbot message send` para enviar mensajes directamente al canal

::: tip Preguntas frecuentes

**P: ¿La IA no responde a mis mensajes?**

R: Verifica los siguientes puntos:
1. ¿Gateway está en ejecución?: `clawdbot gateway status`
2. ¿El modelo de IA está configurado?: `clawdbot models list`
3. Ver registros detallados: `clawdbot agent --message "test" --verbose on`

**P: ¿WebChat no se puede abrir?**

R: Verifica:
1. ¿Gateway está en ejecución?
2. ¿El puerto es correcto?: Predeterminado 18789
3. ¿El navegador accede a `http://127.0.0.1:18789` (no `localhost`)?

**P: ¿Falló el envío de mensajes del canal?**

R: Verifica:
1. ¿El canal ha iniciado sesión?: `clawdbot channels status`
2. ¿La conexión de red es normal?
3. Ver registros de errores específicos del canal: `clawdbot gateway --verbose`
:::

---

## Advertencias de problemas comunes

### ❌ Gateway no iniciado

**Práctica incorrecta**:
```bash
clawdbot agent --message "Hello"
## Error: Gateway connection failed
```

**Práctica correcta**:
```bash
## Primero inicia Gateway
clawdbot gateway --port 18789

## Luego envía mensaje
clawdbot agent --message "Hello"
```

::: warning Gateway debe iniciarse primero
Todas las formas de envío de mensajes (CLI, WebChat, canales) dependen del servicio WebSocket de Gateway. Asegúrate de que Gateway esté en ejecución es el primer paso.
:::

### ❌ Canal no iniciado sesión

**Práctica incorrecta**:
```bash
## WhatsApp no inició sesión y envía mensaje
clawdbot message send --target +15555550123 --message "Hi"
## Error: WhatsApp not authenticated
```

**Práctica correcta**:
```bash
## Primero inicia sesión en el canal
clawdbot channels login whatsapp

## Confirmar estado
clawdbot channels status

## Luego envía mensaje
clawdbot message send --target +15555550123 --message "Hi"
```

### ❌ Olvidar el emparejamiento DM

**Práctica incorrecta**:
```bash
## Primera vez enviando mensaje desde Telegram, pero sin aprobar emparejamiento
## Resultado: El Bot recibe el mensaje pero no lo procesa
```

**Práctica correcta**:
```bash
## 1. Ver solicitudes de emparejamiento pendientes
clawdbot pairing list

## 2. Aprobar emparejamiento
clawdbot pairing approve telegram ABC123
## 3. Enviar mensaje nuevamente

### Ahora el mensaje se procesará y recibirá respuesta de IA
```

### ❌ Confundir agent y message send

**Práctica incorrecta**:
```bash
## Quiero conversar con la IA, pero usé message send
clawdbot message send --target +15555550123 --message "Help me write code"
## Resultado: El mensaje se envía directamente al canal, la IA no lo procesará
```

**Práctica correcta**:
```bash
## Conversar con la IA: usar agent
clawdbot agent --message "Help me write code" --to +15555550123

## Enviar mensaje directamente: usar message send (sin pasar por IA)
clawdbot message send --target +15555550123 --message "Meeting at 3pm"
```

---

## Resumen de esta lección

En esta lección aprendiste:

1. ✅ **Conversación CLI Agent**: `clawdbot agent --message` para comunicarte con la IA, admite control de nivel de pensamiento
2. ✅ **Interfaz WebChat**: Visita `http://localhost:18789` para enviar mensajes usando interfaz gráfica
3. ✅ **Mensajes de canales**: Conversa con la IA en canales configurados como WhatsApp, Telegram, Slack, etc.
4. ✅ **Envío directo**: `clawdbot message send` para enviar mensajes directamente al canal sin pasar por la IA
5. ✅ **Solución de problemas**: Conocer causas comunes de fallas y soluciones

**Siguientes pasos**:

- Aprende [Emparejamiento DM y control de acceso](../pairing-approval/) para saber cómo gestionar de forma segura a remitentes desconocidos
- Explora [Descripción general del sistema multicanal](../../platforms/channels-overview/) para conocer todos los canales compatibles y su configuración
- Configura más canales (WhatsApp, Telegram, Slack, Discord, etc.) para experimentar con asistentes de IA multiplataforma

---

## Vista previa de la siguiente lección

> En la siguiente lección aprenderemos **[Emparejamiento DM y control de acceso](../pairing-approval/)**.
>
> Aprenderás:
> - Comprender el mecanismo de protección de emparejamiento DM predeterminado
> - Cómo aprobar solicitudes de emparejamiento de remitentes desconocidos
> - Configurar allowlist y políticas de seguridad

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-27

| Función | Ruta del archivo | Número de línea |
| --- | --- | --- |
| Registro del comando CLI Agent | [`src/cli/program/register.agent.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/program/register.agent.ts) | 20-82 |
| Ejecución del CLI Agent | [`src/commands/agent-via-gateway.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/commands/agent-via-gateway.ts) | 82-184 |
| Registro del CLI message send | [`src/cli/program/message/register.send.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/program/message/register.send.ts) | 1-30 |
| Método Gateway chat.send | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 296-380 |
| Procesamiento de mensajes internos de WebChat | [`src/gateway/server-chat.gateway-server-chat.e2e.test.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-chat.gateway-server-chat.e2e.test.ts) | 50-290 |
| Definición de tipo de canal de mensajes | [`src/gateway/protocol/client-info.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/protocol/client-info.ts) | 2-23 |
| Registro de canales | [`src/channels/registry.js`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/registry.js) | Archivo completo |

**Constantes clave**:
- `DEFAULT_CHAT_CHANNEL = "whatsapp"`: Canal de mensajes predeterminado (de `src/channels/registry.js`)
- `INTERNAL_MESSAGE_CHANNEL = "webchat"`: Canal de mensajes internos de WebChat (de `src/utils/message-channel.ts`)

**Funciones clave**:
- `agentViaGatewayCommand()`: Llama al método agent a través de Gateway WebSocket (`src/commands/agent-via-gateway.ts`)
- `agentCliCommand()`: Entrada del comando CLI agent, admite modos local y Gateway (`src/commands/agent-via-gateway.ts`)
- `registerMessageSendCommand()`: Registra el comando `message send` (`src/cli/program/message/register.send.ts`)
- `chat.send`: Método WebSocket de Gateway, procesa solicitudes de envío de mensajes (`src/gateway/server-methods/chat.ts`)

</details>
