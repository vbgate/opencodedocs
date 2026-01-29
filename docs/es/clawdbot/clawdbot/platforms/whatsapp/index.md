---
title: "Guía Completa de Configuración del Canal de WhatsApp | Tutoriales de Clawdbot"
sidebarTitle: "Conecta WhatsApp en 5 Minutos"
subtitle: "Guía Completa de Configuración del Canal de WhatsApp"
description: "Aprende a configurar y usar el canal de WhatsApp en Clawdbot (basado en Baileys), incluyendo inicio de sesión con QR, gestión de múltiples cuentas, control de acceso DM y soporte para grupos."
tags:
  - "whatsapp"
  - "configuración de canales"
  - "baileys"
  - "inicio de sesión con qr"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 70
---

# Guía Completa de Configuración del Canal de WhatsApp

## Qué Podrás Hacer Después de Este Tutorial

- Vincular cuentas de WhatsApp a Clawdbot mediante código QR
- Configurar soporte para múltiples cuentas de WhatsApp
- Configurar el control de acceso DM (emparejamiento/lista blanca/público)
- Habilitar y gestionar el soporte de grupos de WhatsApp
- Configurar confirmación automática de mensajes y recibos de lectura

## Tu Dilema Actual

WhatsApp es tu plataforma de mensajería más utilizada, pero tu asistente de IA aún no puede recibir mensajes de WhatsApp. Quieres:
- Chatear directamente con la IA en WhatsApp, sin cambiar de aplicación
- Controlar quién puede enviar mensajes a tu IA
- Soportar múltiples cuentas de WhatsApp (separación trabajo/personal)

## Cuándo Usar Esta Solución

- Necesitas integrar un asistente de IA en WhatsApp
- Necesitas separar las cuentas de WhatsApp de trabajo/personal
- Quieres controlar con precisión quién puede enviar mensajes a la IA

::: info ¿Qué es Baileys?

Baileys es una biblioteca de WhatsApp Web que permite a los programas enviar y recibir mensajes a través del protocolo de WhatsApp Web. Clawdbot usa Baileys para conectarse a WhatsApp, sin necesidad de usar la API de WhatsApp Business, siendo más privado y flexible.

:::

## 🎒 Preparativos Antes de Empezar

Antes de configurar el canal de WhatsApp, confirma:

- [ ] Has instalado e iniciado Clawdbot Gateway
- [ ] Has completado el [Inicio Rápido](../../start/getting-started/)
- [ ] Tienes un número de teléfono disponible (se recomienda un número de respaldo)
- [ ] El teléfono con WhatsApp puede acceder a Internet (para escanear el código QR)

::: warning Advertencias

- **Se recomienda usar un número independiente**: una tarjeta SIM separada o un teléfono antiguo para evitar interferencias con el uso personal
- **Evita números virtuales**: TextNow, Google Voice y otros números virtuales serán bloqueados por WhatsApp
- **Tiempo de ejecución de Node**: WhatsApp y Telegram son inestables en Bun, usa Node ≥22

:::

## Idea Central

La arquitectura central del canal de WhatsApp:

```
Tu teléfono WhatsApp ←--(Código QR)--> Baileys ←--→ Clawdbot Gateway
                                                       ↓
                                                  AI Agent
                                                       ↓
                                                  Respuesta
```

**Conceptos Clave**:

1. **Sesión de Baileys**: conexión establecida a través de WhatsApp Linked Devices
2. **Política DM**: controla quién puede enviar mensajes privados a la IA
3. **Soporte multicuenta**: un Gateway gestiona múltiples cuentas de WhatsApp
4. **Confirmación de mensajes**: envía automáticamente emojis/recibos de lectura para mejorar la experiencia del usuario

## Sígueme

### Paso 1: Configurar Ajustes Básicos

**Por qué**
Configura la política de control de acceso de WhatsApp para proteger tu asistente de IA de abusos.

Edita `~/.clawdbot/clawdbot.json`, agrega la configuración de WhatsApp:

```json
{
  "channels": {
    "whatsapp": {
      "dmPolicy": "pairing",
      "allowFrom": ["+15551234567"]
    }
  }
}
```

**Descripción de Campos**:

| Campo | Tipo | Valor por Defecto | Descripción |
|-------|------|-------------------|-------------|
| `dmPolicy` | string | `"pairing"` | Política de acceso DM: `pairing` (emparejamiento), `allowlist` (lista blanca), `open` (público), `disabled` (deshabilitado) |
| `allowFrom` | string[] | `[]` | Lista de números de teléfono de remitentes permitidos (formato E.164, por ejemplo `+15551234567`) |

**Comparación de Políticas DM**:

| Política | Comportamiento | Caso de Uso |
|----------|----------------|-------------|
| `pairing` | Remitentes desconocidos reciben código de emparejamiento, requieren aprobación manual | **Recomendado**, equilibra seguridad y conveniencia |
| `allowlist` | Solo permite números de la lista `allowFrom` | Control estricto, usuarios conocidos |
| `open` | Cualquiera puede enviar (requiere que `allowFrom` contenga `"*"`) | Pruebas públicas o servicios comunitarios |
| `disabled` | Ignora todos los mensajes de WhatsApp | Deshabilitar temporalmente el canal |

**Deberías ver**: el archivo de configuración se guarda correctamente, sin errores de formato JSON.

### Paso 2: Iniciar Sesión en WhatsApp

**Por qué**
Vincula la cuenta de WhatsApp a Clawdbot mediante código QR, Baileys mantendrá el estado de la sesión.

En la terminal ejecuta:

```bash
clawdbot channels login whatsapp
```

**Inicio de Sesión Multicuenta**:

Iniciar sesión en una cuenta específica:

```bash
clawdbot channels login whatsapp --account work
```

Iniciar sesión en la cuenta predeterminada:

```bash
clawdbot channels login whatsapp
```

**Pasos de Operación**:

1. La terminal mostrará el código QR (o se mostrará en la interfaz CLI)
2. Abre la aplicación de WhatsApp en tu teléfono
3. Ve a **Configuración → Dispositivos Vinculados**
4. Toca **Vincular un Dispositivo**
5. Escanea el código QR mostrado en la terminal

**Deberías ver**:

```
✓ WhatsApp vinculado exitosamente!
Credenciales almacenadas: ~/.clawdbot/credentials/whatsapp/default/creds.json
```

::: tip Almacenamiento de Credenciales

Las credenciales de inicio de sesión de WhatsApp se guardan en `~/.clawdbot/credentials/whatsapp/<accountId>/creds.json`. Después del primer inicio de sesión, los inicios posteriores restaurarán automáticamente la sesión sin necesidad de volver a escanear el código QR.

:::

### Paso 3: Iniciar Gateway

**Por qué**
Inicia Gateway para que el canal de WhatsApp comience a recibir y enviar mensajes.

```bash
clawdbot gateway
```

O usa el modo demonio:

```bash
clawdbot gateway start
```

**Deberías ver**:

```
[WhatsApp] Conectado a WhatsApp Web
[WhatsApp] Cuenta predeterminada vinculada: +15551234567
Gateway escuchando en ws://127.0.0.1:18789
```

### Paso 4: Enviar Mensaje de Prueba

**Por qué**
Verifica que la configuración del canal de WhatsApp es correcta y puede enviar y recibir mensajes normalmente.

Desde tu teléfono WhatsApp, envía un mensaje al número vinculado:

```
Hola
```

**Deberías ver**:
- La terminal muestra los registros de mensajes recibidos
- WhatsApp recibe la respuesta de la IA

**Punto de Control ✅**

- [ ] El registro de Gateway muestra `[WhatsApp] Mensaje recibido de +15551234567`
- [ ] WhatsApp recibe la respuesta de la IA
- [ ] El contenido de la respuesta es relevante para tu entrada

### Paso 5: Configurar Opciones Avanzadas (Opcional)

#### Habilitar Confirmación Automática de Mensajes

En `clawdbot.json`, agrega:

```json
{
  "channels": {
    "whatsapp": {
      "ackReaction": {
        "emoji": "👀",
        "direct": true,
        "group": "mentions"
      }
    }
  }
}
```

**Descripción de Campos**:

| Campo | Tipo | Valor por Defecto | Descripción |
|-------|------|-------------------|-------------|
| `emoji` | string | - | Emoji de confirmación (por ejemplo `"👀"`, `"✅"`), cadena vacía para deshabilitar |
| `direct` | boolean | `true` | Si se envía confirmación en chats privados |
| `group` | string | `"mentions"` | Comportamiento en grupos: `"always"` (todos los mensajes), `"mentions"` (solo @ menciones), `"never"` (nunca) |

#### Configurar Recibos de Lectura

Por defecto, Clawdbot marcará automáticamente los mensajes como leídos (doble check azul). Para deshabilitar:

```json
{
  "channels": {
    "whatsapp": {
      "sendReadReceipts": false
    }
  }
}
```

#### Ajustar Límites de Mensajes

```json
{
  "channels": {
    "whatsapp": {
      "textChunkLimit": 4000,
      "mediaMaxMb": 50,
      "chunkMode": "length"
    }
  }
}
```

| Campo | Valor por Defecto | Descripción |
|-------|-------------------|-------------|
| `textChunkLimit` | 4000 | Número máximo de caracteres por mensaje de texto |
| `mediaMaxMb` | 50 | Tamaño máximo de archivos multimedia recibidos (MB) |
| `chunkMode` | `"length"` | Modo de división: `"length"` (por longitud), `"newline"` (por párrafos) |

**Deberías ver**: después de que la configuración surta efecto, los mensajes largos se dividen automáticamente y el tamaño de los archivos multimedia se controla.

## Advertencias de Problemas Comunes

### Problema 1: Fallo al Escanear el Código QR

**Síntomas**: después de escanear el código QR, la terminal muestra error de conexión o tiempo de espera.

**Causa**: problemas de conexión de red o inestabilidad del servicio de WhatsApp.

**Solución**:

1. Verifica la conexión de red del teléfono
2. Asegúrate de que el servidor Gateway pueda acceder a Internet
3. Cierra sesión e inicia sesión nuevamente:
   ```bash
   clawdbot channels logout whatsapp
   clawdbot channels login whatsapp
   ```

### Problema 2: Mensajes No Entregados o Retrasados

**Síntomas**: después de enviar un mensaje, se tarda mucho en recibir una respuesta.

**Causa**: Gateway no está ejecutándose o la conexión de WhatsApp se ha desconectado.

**Solución**:

1. Verifica el estado de Gateway: `clawdbot gateway status`
2. Reinicia Gateway: `clawdbot gateway restart`
3. Verifica los registros: `clawdbot logs --follow`

### Problema 3: Código de Emparejamiento No Recibido

**Síntomas**: después de que un extraño envía un mensaje, no se recibe el código de emparejamiento.

**Causa**: `dmPolicy` no está configurado como `pairing`.

**Solución**:

Verifica la configuración de `dmPolicy` en `clawdbot.json`:

```json
{
  "channels": {
    "whatsapp": {
      "dmPolicy": "pairing"  // ← Asegúrate de que sea "pairing"
    }
  }
}
```

### Problema 4: Problemas con el Tiempo de Ejecución de Bun

**Síntomas**: WhatsApp y Telegram se desconectan con frecuencia o falla el inicio de sesión.

**Causa**: Baileys y el SDK de Telegram son inestables en Bun.

**Solución**:

Usa Node ≥22 para ejecutar Gateway:

Verifica el tiempo de ejecución actual:

```bash
node --version
```

Si necesitas cambiar, usa Node para ejecutar Gateway:

```bash
clawdbot gateway --runtime node
```

::: tip Tiempo de Ejecución Recomendado

Para los canales de WhatsApp y Telegram, se recomienda encarecidamente usar el tiempo de ejecución de Node, ya que Bun puede causar inestabilidad en la conexión.

:::

## Resumen de Esta Lección

Puntos clave de la configuración del canal de WhatsApp:

1. **Configuración básica**: `dmPolicy` + `allowFrom` controlan el acceso
2. **Flujo de inicio de sesión**: `clawdbot channels login whatsapp` escanea el código QR
3. **Multicuenta**: usa el parámetro `--account` para gestionar múltiples cuentas de WhatsApp
4. **Opciones avanzadas**: confirmación automática de mensajes, recibos de lectura, límites de mensajes
5. **Solución de problemas**: verifica el estado de Gateway, registros y tiempo de ejecución

## Avance de la Próxima Lección

> En la siguiente lección aprenderemos la configuración del **[Canal de Telegram](../telegram/)**.
>
> Aprenderás:
> - Configurar un Bot de Telegram usando Bot Token
> - Configurar comandos y consultas en línea
> - Gestionar políticas de seguridad específicas de Telegram

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-27

| Función | Ruta del Archivo | Líneas |
|----------|-----------------|--------|
| Definición de tipos de configuración de WhatsApp | [`src/config/types.whatsapp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.whatsapp.ts) | 1-160 |
| Esquema de configuración de WhatsApp | [`src/config/zod-schema.providers-whatsapp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers-whatsapp.ts) | 13-100 |
| Configuración de incorporación de WhatsApp | [`src/channels/plugins/onboarding/whatsapp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/whatsapp.ts) | 1-341 |
| Documentación de WhatsApp | [`docs/channels/whatsapp.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/channels/whatsapp.md) | 1-363 |
| Herramienta de inicio de sesión de WhatsApp | [`src/channels/plugins/agent-tools/whatsapp-login.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/agent-tools/whatsapp-login.ts) | 1-72 |
| Herramienta de Actions de WhatsApp | [`src/agents/tools/whatsapp-actions.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/whatsapp-actions.ts) | 1-42 |

**Elementos de Configuración Clave**:
- `dmPolicy`: política de acceso DM (`pairing`/`allowlist`/`open`/`disabled`)
- `allowFrom`: lista de remitentes permitidos (números de teléfono en formato E.164)
- `ackReaction`: configuración de confirmación automática de mensajes (`{emoji, direct, group}`)
- `sendReadReceipts`: si enviar recibos de lectura (predeterminado `true`)
- `textChunkLimit`: límite de división de texto (predeterminado 4000 caracteres)
- `mediaMaxMb`: límite de tamaño de archivos multimedia (predeterminado 50 MB)

**Funciones Clave**:
- `loginWeb()`: ejecuta el inicio de sesión de WhatsApp con código QR
- `startWebLoginWithQr()`: inicia el proceso de generación de código QR
- `sendReactionWhatsApp()`: envía reacción de emoji de WhatsApp
- `handleWhatsAppAction()`: maneja acciones específicas de WhatsApp (como reacciones)

**Constantes Clave**:
- `DEFAULT_ACCOUNT_ID`: ID de cuenta predeterminado (`"default"`)
- `creds.json`: ruta de almacenamiento de credenciales de autenticación de WhatsApp

</details>
