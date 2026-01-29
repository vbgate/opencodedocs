---
title: "Canal de Signal: Integración de asistente de IA segura basada en signal-cli | Tutorial de Clawdbot"
sidebarTitle: "Conecta tu IA privada de Signal"
subtitle: "Canal de Signal: Integración de asistente de IA segura basada en signal-cli | Tutorial de Clawdbot"
description: "Aprende a configurar el canal de Signal en Clawdbot, incluyendo la instalación de signal-cli, vinculación de cuentas, soporte multicuenta, mecanismo de emparejamiento DM, mensajes de grupo y control de acceso. Este tutorial explica en detalle el proceso completo desde la instalación hasta el uso, ayudándote a configurar rápidamente un asistente de IA personal basado en Signal."
tags:
  - "Signal"
  - "signal-cli"
  - "configuración de canal"
  - "plataforma de mensajes"
prerequisite:
  - "start-getting-started"
order: 120
---

# Canal de Signal: Conecta tu asistente de IA personal usando signal-cli | Tutorial de Clawdbot

## Lo que aprenderás

Al completar esta lección, serás capaz de:

- ✅ Instalar y configurar signal-cli
- ✅ Configurar el canal de Signal en Clawdbot
- ✅ Interactuar con el asistente de IA a través de mensajes privados y grupos
- ✅ Usar el mecanismo de emparejamiento DM para proteger tu cuenta
- ✅ Configurar soporte multicuenta de Signal
- ✅ Usar los indicadores de escritura, confirmaciones de lectura y reacciones de Signal

## Tu situación actual

Quieres usar un asistente de IA en Signal, pero te encuentras con estos problemas:

- ❌ No sabes cómo conectar Signal y Clawdbot
- ❌ Te preocupa la privacidad y no quieres subir datos a la nube
- ❌ No estás seguro de cómo controlar quién puede enviar mensajes al asistente de IA
- ❌ Necesitas cambiar entre múltiples cuentas de Signal

::: info ¿Por qué elegir Signal?
Signal es una aplicación de mensajería instantánea con cifrado de extremo a extremo. Todas las comunicaciones están cifradas y solo el remitente y el destinatario pueden leer los mensajes. Clawdbot se integra a través de signal-cli, permitiéndote disfrutar de las funciones del asistente de IA mientras mantienes tu privacidad.
:::

## Cuándo usar este método

**Escenarios adecuados para usar el canal de Signal**:

- Necesitas un canal de comunicación con prioridad de privacidad
- Tu equipo o grupo de amigos usa Signal
- Necesitas ejecutar el asistente de IA en tu dispositivo personal (prioridad local)
- Necesitas controlar el acceso a través de un mecanismo de emparejamiento DM protegido

::: tip Cuenta de Signal independiente
Se recomienda usar un **número de Signal independiente** como cuenta de bot, en lugar de tu número personal. Esto evita bucles de mensajes (el bot ignora sus propios mensajes) y mantiene separadas las comunicaciones de trabajo y personales.
:::

## 🎒 Preparativos

Antes de comenzar, confirma que has completado los siguientes pasos:

::: warning Requisitos previos
- ✅ Has completado el tutorial de [Inicio rápido](../../start/getting-started/)
- ✅ Clawdbot está instalado y puede ejecutarse normalmente
- ✅ Has configurado al menos un proveedor de modelos de IA (Anthropic, OpenAI, OpenRouter, etc.)
- ✅ Has instalado Java (requerido por signal-cli)
:::

## Conceptos clave

La integración de Signal de Clawdbot se basa en **signal-cli** y funciona de la siguiente manera:

1. **Modo demonio**: signal-cli se ejecuta como un proceso en segundo plano, proporcionando una interfaz HTTP JSON-RPC
2. **Flujo de eventos (SSE)**: Clawdbot recibe eventos de Signal a través de Server-Sent Events (SSE)
3. **Mensajes estandarizados**: Los mensajes de Signal se convierten a un formato interno unificado y luego se enrutan al Agente de IA
4. **Enrutamiento determinista**: Todas las respuestas se envían de vuelta al remitente o grupo original del mensaje

**Principios de diseño clave**:

- **Prioridad local**: signal-cli se ejecuta en tu dispositivo, todas las comunicaciones están cifradas
- **Soporte multicuenta**: Puedes configurar múltiples cuentas de Signal
- **Control de acceso**: El mecanismo de emparejamiento DM está habilitado por defecto, los extraños necesitan aprobación para enviar mensajes
- **Aislamiento de contexto**: Los mensajes de grupo tienen contextos de conversación independientes y no se mezclan con los mensajes privados

## Sigue los pasos

### Paso 1: Instalar signal-cli

**Por qué**
signal-cli es la interfaz de línea de comandos de Signal. Clawdbot se comunica con la red de Signal a través de ella.

**Métodos de instalación**

::: code-group

```bash [macOS (Homebrew)]
brew install signal-cli
```

```bash [Linux (Ubuntu/Debian)]
# Visita https://github.com/AsamK/signal-cli/releases para ver la última versión
# Descarga el último paquete de lanzamiento de signal-cli (reemplaza VERSION con el número de versión real)
wget https://github.com/AsamK/signal-cli/releases/download/vVERSION/signal-cli-VERSION.tar.gz

# Extrae en el directorio /opt
sudo tar -xvf signal-cli-VERSION.tar.gz -C /opt/

# Crea un enlace simbólico (opcional)
sudo ln -s /opt/signal-cli-VERSION/bin/signal-cli /usr/local/bin/signal-cli
```

```bash [Windows (WSL2)]
# En WSL2, usa el método de instalación de Linux
# Nota: Windows usa WSL2, la instalación de signal-cli sigue el flujo de Linux
```

:::

**Verificar instalación**

```bash
signal-cli --version
# Deberías ver: número de versión de signal-cli (como 0.13.x o superior)
```

**Lo que deberías ver**: salida del número de versión de signal-cli.

::: danger Requisito de Java
signal-cli requiere un tiempo de ejecución de Java (generalmente Java 11 o superior). Asegúrate de que Java esté instalado y configurado:

```bash
java -version
# Deberías ver: openjdk version "11.x.x" o superior
```

**Nota**: Consulta los [requisitos de versión de Java específicos en la documentación oficial de signal-cli](https://github.com/AsamK/signal-cli#readme).
:::

### Paso 2: Vincular cuenta de Signal

**Por qué**
Después de vincular la cuenta, signal-cli puede enviar y recibir mensajes en nombre de tu número de Signal.

**Práctica recomendada**: Usa un número de Signal independiente como cuenta de bot.

**Pasos de vinculación**

1. **Generar comando de vinculación**:

```bash
signal-cli link -n "Clawdbot"
```

`-n "Clawdbot"` especifica el nombre del dispositivo como "Clawdbot" (puedes personalizarlo).

2. **Escanear código QR**:

Después de ejecutar el comando, la terminal mostrará un código QR:

```
tsconfig: 2369:35 - warning - *! is deprecated: Use .nonNull().
  (deprecated-non-null)

To link your device, navigate to
  Signal Settings > Linked Devices > (+) Link New Device
  on your phone and scan the QR code displayed below.

████████████████████████████████████████████████
████████████████████████████████████████████████
████████████████████████████████████████████████
████████████████████████████████████████████████
████████████████████████████████████████████████
...
```

3. **En la aplicación móvil de Signal**:

   - Abre la configuración de Signal
   - Selecciona "Dispositivos vinculados" (Linked Devices)
   - Toca "(+) Vincular nuevo dispositivo" (Link New Device)
   - Escanea el código QR que se muestra en la terminal

**Lo que deberías ver**: Después de una vinculación exitosa, la terminal mostrará un resultado similar al siguiente:

```
INFO  Account restored (Number: +15551234567)
INFO  Configuration created at: ~/.local/share/signal-cli/data
```

::: tip Soporte de múltiples dispositivos
Signal permite vincular hasta 4 dispositivos. Clawdbot se ejecutará como uno de estos dispositivos. Puedes ver y administrar estos dispositivos en "Dispositivos vinculados" de la aplicación móvil de Signal.
:::

### Paso 3: Configurar el canal de Signal de Clawdbot

**Por qué**
El archivo de configuración le dice a Clawdbot cómo conectarse a signal-cli y cómo procesar los mensajes de Signal.

**Métodos de configuración**

Hay tres métodos de configuración, elige el que mejor se adapte a tus necesidades:

#### Método 1: Configuración rápida (cuenta única)

Este es el método más simple, adecuado para escenarios de cuenta única.

Edita `~/.clawdbot/clawdbot.json`:

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "account": "+15551234567",
      "cliPath": "signal-cli",
      "dmPolicy": "pairing",
      "allowFrom": ["+15557654321"]
    }
  }
}
```

**Explicación de configuración**:

| Campo | Valor | Descripción |
|--- | --- | ---|
| `enabled` | `true` | Habilitar canal de Signal |
| `account` | `"+15551234567"` | Tu cuenta de Signal (formato E.164) |
| `cliPath` | `"signal-cli"` | Ruta del comando signal-cli |
| `dmPolicy` | `"pairing"` | Política de acceso DM (modo de emparejamiento predeterminado) |
| `allowFrom` | `["+15557654321"]` | Lista blanca de números permitidos para enviar DM |

#### Método 2: Configuración multicuenta

Si necesitas administrar múltiples cuentas de Signal, usa el objeto `accounts`:

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "accounts": {
        "work": {
          "account": "+15551234567",
          "name": "Work Bot",
          "httpPort": 8080,
          "dmPolicy": "pairing",
          "allowFrom": ["+15557654321"]
        },
        "personal": {
          "account": "+15559876543",
          "name": "Personal Bot",
          "httpPort": 8081,
          "dmPolicy": "allowlist",
          "allowFrom": ["*"]
        }
      }
    }
  }
}
```

**Explicación de configuración**:

- Cada cuenta tiene un ID único (como `work`, `personal`)
- Cada cuenta puede tener diferentes puertos, políticas y permisos
- `name` es un nombre para mostrar opcional, usado para listas de CLI/interfaz de usuario

#### Método 3: Modo de demonio externo

Si deseas administrar signal-cli tú mismo (por ejemplo, en un contenedor o CPU compartida), deshabilita el inicio automático:

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "httpUrl": "http://127.0.0.1:8080",
      "autoStart": false
    }
  }
}
```

**Explicación de configuración**:

- `httpUrl`: URL completa del demonio (sobrescribe `httpHost` y `httpPort`)
- `autoStart`: Establecer en `false` para deshabilitar el inicio automático de signal-cli
- Clawdbot se conectará al demonio signal-cli ya en ejecución

**Lo que deberías ver**: Después de guardar el archivo de configuración, no hay errores de sintaxis.

::: tip Validación de configuración
Clawdbot valida la configuración al iniciarse. Si hay errores en la configuración, se mostrará información detallada de error en el registro.
:::

### Paso 4: Iniciar Gateway

**Por qué**
Después de iniciar Gateway, Clawdbot iniciará automáticamente el demonio signal-cli (a menos que hayas deshabilitado `autoStart`) y comenzará a escuchar mensajes de Signal.

**Comando de inicio**

```bash
clawdbot gateway start
```

**Lo que deberías ver**: Un resultado similar al siguiente:

```
[INFO] Starting Clawdbot Gateway...
[INFO] Starting signal-cli daemon...
[INFO] signal-cli: INFO  Starting daemon...
[INFO] signal-cli: INFO  Daemon started on http://127.0.0.1:8080
[INFO] Signal channel ready (account: +15551234567)
[INFO] Gateway listening on ws://127.0.0.1:18789
[INFO] Clawdbot Gateway started successfully
```

**Verificar estado del Canal**

```bash
clawdbot channels status
```

**Lo que deberías ver**: Un resultado similar al siguiente:

```
Signal Channels:
  ├─ +15551234567 (Work Bot)
  │   ├─ Status: Connected
  │   ├─ Daemon: http://127.0.0.1:8080
  │   └─ Mode: Auto-start
```

### Paso 5: Enviar el primer mensaje

**Por qué**
Verificar que la configuración es correcta y asegurarse de que Clawdbot pueda recibir y procesar mensajes de Signal.

**Enviar mensaje**

1. **Desde tu aplicación móvil de Signal**, envía un mensaje a tu número de bot:

```
Hola, Clawdbot!
```

2. **Procesamiento del primer mensaje**:

   Si `dmPolicy="pairing"` (predeterminado), los extraños recibirán un código de emparejamiento:

   ```
   ❌ Remitente no autorizado

   Para continuar, aprueba este emparejamiento usando el siguiente código:

   📝 Código de emparejamiento: ABC123

   El código caducará en 1 hora.

   Para aprobar, ejecuta:
   clawdbot pairing approve signal ABC123
   ```

3. **Aprobar emparejamiento**:

   ```bash
   clawdbot pairing list signal
   ```

   Lista las solicitudes de emparejamiento pendientes:

   ```
   Pending Pairings (Signal):
     ├─ ABC123
     │   ├─ Sender: +15557654321
     │   ├─ UUID: uuid:123e4567-e89b-12d3-a456-426614174000
     │   └─ Expires: 2026-01-27 12:00:00
   ```

   Aprobar emparejamiento:

   ```bash
   clawdbot pairing approve signal ABC123
   ```

4. **Enviar segundo mensaje**:

   Después de un emparejamiento exitoso, envía el mensaje nuevamente:

   ```
   Hola, Clawdbot!
   ```

**Lo que deberías ver**:

- La aplicación móvil de Signal recibe la respuesta de la IA:
  ```
  ¡Hola! Soy Clawdbot, tu asistente de IA personal. ¿En qué puedo ayudarte?
  ```

- El registro de Gateway muestra:
  ```
  [INFO] Received Signal message from +15557654321
  [INFO] Processing message through Agent...
  [INFO] Sending Signal response to +15557654321
  ```

**Punto de control ✅**:

- [ ] El demonio signal-cli se está ejecutando
- [ ] El estado del Canal muestra "Connected"
- [ ] Recibes una respuesta de la IA después de enviar un mensaje
- [ ] No hay mensajes de error en el registro de Gateway

::: danger Tus propios mensajes serán ignorados
Si ejecutas el bot en tu número personal de Signal, el bot ignorará los mensajes que envíes tú mismo (protección contra bucles). Se recomienda usar un número de bot independiente.
:::

## Advertencias de problemas comunes

### Problema 1: Fallo al iniciar signal-cli

**Problema**: El demonio signal-cli no puede iniciarse

**Posibles causas**:

1. Java no está instalado o la versión es demasiado baja
2. El puerto ya está en uso
3. La ruta de signal-cli es incorrecta

**Soluciones**:

```bash
# Verificar versión de Java
java -version

# Verificar uso del puerto
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows (PowerShell)

# Verificar ruta de signal-cli
which signal-cli
```

### Problema 2: Código de emparejamiento caducado

**Problema**: El código de emparejamiento caduca después de 1 hora

**Solución**:

Vuelve a enviar el mensaje para obtener un nuevo código de emparejamiento y apruébalo dentro de 1 hora.

### Problema 3: Sin respuesta a mensajes de grupo

**Problema**: Mencionas al bot con @ en un grupo de Signal, pero no hay respuesta

**Posibles causas**:

- `groupPolicy` está configurado en `allowlist`, pero tú no estás en `groupAllowFrom`
- Signal no admite menciones @ nativas (a diferencia de Discord/Slack)

**Soluciones**:

Configurar política de grupo:

```json
{
  "channels": {
    "signal": {
      "groupPolicy": "allowlist",
      "groupAllowFrom": ["+15557654321"]
    }
  }
}
```

O usa el disparador de comandos (si `commands.config: true` está configurado):

```
@clawdbot help
```

### Problema 4: Fallo al descargar archivos multimedia

**Problema**: Las imágenes o adjuntos en mensajes de Signal no se pueden procesar

**Posibles causas**:

- El tamaño del archivo excede el límite de `mediaMaxMb` (predeterminado 8MB)
- `ignoreAttachments` está configurado en `true`

**Soluciones**:

```json
{
  "channels": {
    "signal": {
      "mediaMaxMb": 20,
      "ignoreAttachments": false
    }
  }
}
```

### Problema 5: Mensajes largos truncados

**Problema**: Los mensajes enviados se dividen en múltiples partes

**Causa**: Signal tiene un límite de longitud de mensaje (predeterminado 4000 caracteres), Clawdbot fragmentará automáticamente

**Soluciones**:

Ajusta la configuración de fragmentación:

```json
{
  "channels": {
    "signal": {
      "textChunkLimit": 2000,
      "chunkMode": "newline"
    }
  }
}
```

Opciones de `chunkMode`:
- `length` (predeterminado): fragmentar por longitud
- `newline`: dividir primero por líneas vacías (límites de párrafo), luego por longitud

## Resumen de esta lección

En esta lección completamos la configuración y uso del canal de Signal:

**Conceptos clave**:
- El canal de Signal se basa en signal-cli, comunicándose a través de HTTP JSON-RPC + SSE
- Se recomienda usar un número de bot independiente para evitar bucles de mensajes
- El mecanismo de emparejamiento DM está habilitado por defecto, protegiendo la seguridad de tu cuenta

**Configuración clave**:
- `account`: Cuenta de Signal (formato E.164)
- `cliPath`: Ruta de signal-cli
- `dmPolicy`: Política de acceso DM (predeterminado `pairing`)
- `allowFrom`: Lista blanca de DM
- `groupPolicy` / `groupAllowFrom`: Política de grupo

**Funciones útiles**:
- Soporte multicuenta
- Mensajes de grupo (contexto independiente)
- Indicadores de escritura
- Confirmaciones de lectura
- Reacciones (respuestas con emojis)

**Solución de problemas**:
- Usa `clawdbot channels status` para verificar el estado del Canal
- Usa `clawdbot pairing list signal` para ver las solicitudes de emparejamiento pendientes
- Revisa el registro de Gateway para obtener información detallada de error

## Próxima lección

> En la próxima lección aprenderemos sobre el **[Canal de iMessage](../imessage/)**.
>
> Aprenderás:
> - Cómo configurar el canal de iMessage en macOS
> - Usar la extensión BlueBubbles
> - Funciones especiales de iMessage (confirmaciones de lectura, indicadores de escritura, etc.)
> - Integración de nodos iOS (Camera, Canvas, Voice Wake)

¡Continúa explorando las potentes funciones de Clawdbot! 🚀

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-27

| Función        | Ruta de archivo                                                                                    | Línea    |
|--- | --- | ---|
| Cliente RPC de Signal | [`src/signal/client.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/client.ts)         | 1-186   |
| Gestión de demonio de Signal | [`src/signal/daemon.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/daemon.ts)         | 1-85    |
| Soporte multicuenta | [`src/signal/accounts.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/accounts.ts)       | 1-84    |
| Monitoreo y manejo de eventos de Signal | [`src/signal/monitor.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/monitor.ts)       | -       |
| Envío de mensajes | [`src/signal/send.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/send.ts)             | -       |
| Envío de Reacciones | [`src/signal/send-reactions.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/send-reactions.ts) | -       |
| Configuración de nivel de Reaction | [`src/signal/reaction-level.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/reaction-level.ts) | -       |

**Definiciones de tipos de configuración**:
- `SignalAccountConfig`: [`src/config/types.signal.ts:13-87`](https://github.com/clawd/clawdbot/blob/main/src/config/types.signal.ts#L13-L87)
- `SignalConfig`: [`src/config/types.signal.ts:89-93`](https://github.com/clawd/clawdbot/blob/main/src/config/types.signal.ts#L89-L93)

**Constantes clave**:
- `DEFAULT_TIMEOUT_MS = 10_000`: Tiempo de espera predeterminado para solicitudes RPC de Signal (10 segundos) Fuente: `src/signal/client.ts:29`
- Puerto HTTP predeterminado: `8080` Fuente: `src/signal/accounts.ts:59`
- Tamaño predeterminado de fragmentación de texto: `4000` caracteres Fuente: `docs/channels/signal.md:113`

**Funciones clave**:
- `signalRpcRequest<T>()`: Envía solicitud JSON-RPC a signal-cli Fuente: `src/signal/client.ts:54-90`
- `streamSignalEvents()`: Suscribe a eventos de Signal a través de SSE Fuente: `src/signal/client.ts:112-185`
- `spawnSignalDaemon()`: Inicia el demonio signal-cli Fuente: `src/signal/daemon.ts:50-84`
- `resolveSignalAccount()`: Resuelve configuración de cuenta de Signal Fuente: `src/signal/accounts.ts:49-77`
- `listEnabledSignalAccounts()`: Lista cuentas de Signal habilitadas Fuente: `src/signal/accounts.ts:79-83`

</details>
