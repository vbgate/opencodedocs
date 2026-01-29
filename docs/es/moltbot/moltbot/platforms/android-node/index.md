---
title: "Nodo Android: Configuración de Operaciones Locales del Dispositivo | Tutoriales de Clawdbot"
sidebarTitle: "Deja que la IA controle tu móvil"
subtitle: "Nodo Android: Configuración de Operaciones Locales del Dispositivo | Tutoriales de Clawdbot"
description: "Aprende a configurar el nodo Android para ejecutar operaciones locales del dispositivo (Camera, Canvas, Screen). Este tutorial introduce el proceso de conexión, el mecanismo de emparejamiento y los comandos disponibles del nodo Android."
tags:
  - "Android"
  - "Nodo"
  - "Camera"
  - "Canvas"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 180
---

# Nodo Android: Configuración de Operaciones Locales del Dispositivo

## Lo que lograrás

- Conectar un dispositivo Android al Gateway como nodo para ejecutar operaciones locales del dispositivo
- Controlar la cámara del dispositivo Android a través del asistente de IA para tomar fotos y grabar videos
- Utilizar la interfaz visual Canvas para mostrar contenido en tiempo real en Android
- Gestionar la grabación de pantalla, obtención de ubicación y envío de SMS

## Tu problema actual

Quieres que el asistente de IA pueda acceder a tu dispositivo Android—tomar fotos, grabar videos, mostrar interfaces Canvas—pero no sabes cómo conectar el dispositivo al Gateway de forma segura.

La instalación directa de la aplicación Android podría no descubrir el Gateway, o después de la configuración no se logra el emparejamiento exitosamente. Necesitas un flujo de conexión claro.

## Cuándo usar esta técnica

- **Necesitas operaciones locales del dispositivo**: Quieres que el dispositivo Android ejecute operaciones locales (tomar fotos, grabar videos, grabar pantalla) a través del asistente de IA
- **Acceso entre redes**: El dispositivo Android y el Gateway están en diferentes redes y necesitan conectarse a través de Tailscale
- **Visualización Canvas**: Necesitas mostrar interfaces HTML/CSS/JS generadas por la IA en Android

## 🎒 Preparativos

::: warning Requisitos previos

Antes de comenzar, asegúrate de:

- ✅ **Gateway instalado y ejecutándose**: Gateway ejecutándose en macOS, Linux o Windows (WSL2)
- ✅ **Dispositivo Android disponible**: Dispositivo o emulador con Android 8.0+
- ✅ **Conexión de red normal**: El dispositivo Android puede acceder al puerto WebSocket del Gateway (por defecto 18789)
- ✅ **CLI disponible**: En el host del Gateway se puede usar el comando `clawdbot`

:::

## Concepto clave

El **Nodo Android** es una aplicación companion (compañera) que se conecta al Gateway a través de WebSocket y expone las capacidades de operaciones locales del dispositivo para que las use el asistente de IA.

### Descripción general de la arquitectura

```
Dispositivo Android (aplicación del nodo)
        ↓
    Conexión WebSocket
        ↓
    Gateway (plano de control)
        ↓
    Asistente de IA + llamadas a herramientas
```

**Puntos clave**:
- Android **no aloja** Gateway, solo se conecta como nodo a un Gateway que ya se está ejecutando
- Todos los comandos se enrutan al nodo Android a través del método `node.invoke` de Gateway
- El nodo necesita emparejamiento (pairing) para obtener permisos de acceso

### Funciones compatibles

El nodo Android admite las siguientes operaciones locales del dispositivo:

| Función | Comando | Descripción |
|--- | --- | ---|
| **Canvas** | `canvas.*` | Muestra interfaz visual en tiempo real (A2UI) |
| **Camera** | `camera.*` | Toma fotos (JPG) y graba videos (MP4) |
| **Screen** | `screen.*` | Grabación de pantalla |
| **Location** | `location.*` | Obtiene ubicación GPS |
| **SMS** | `sms.*` | Envía mensajes SMS |

::: tip Restricción en primer plano

Todas las operaciones locales del dispositivo (Canvas, Camera, Screen) requieren que la aplicación Android esté en **estado de ejecución en primer plano**. Las llamadas en segundo plano devolverán el error `NODE_BACKGROUND_UNAVAILABLE`.

:::

## Sigue estos pasos

### Paso 1: Iniciar Gateway

**Por qué**
El nodo Android necesita conectarse a un Gateway que se esté ejecutando para funcionar. Gateway proporciona el plano de control WebSocket y el servicio de emparejamiento.

```bash
clawdbot gateway --port 18789 --verbose
```

**Deberías ver**:
```
listening on ws://0.0.0.0:18789
bonjour: advertising _clawdbot-gw._tcp on local...
```

::: tip Modo Tailscale (recomendado)

Si Gateway y el dispositivo Android están en diferentes redes pero conectados a través de Tailscale, vincula Gateway a la IP de tailnet:

```json5
// ~/.clawdbot/clawdbot.json
{
  gateway: {
    bind: "tailnet"
  }
}
```

Después de reiniciar Gateway, el nodo Android puede ser descubierto a través de Wide-Area Bonjour.

:::

### Paso 2: Verificar descubrimiento (opcional)

**Por qué**
Confirmar que el servicio Bonjour/mDNS de Gateway funciona correctamente para facilitar el descubrimiento de la aplicación Android.

En el host de Gateway, ejecuta:

```bash
dns-sd -B _clawdbot-gw._tcp local.
```

**Deberías ver**:
```
Timestamp     A/R    IF  N/T   Target              Port
==========   ===   ===  ========               ====
12:34:56.123 Addr   10  _clawdbot-gw._tcp. 18789
```

Si ves una salida similar, significa que Gateway está anunciando el servicio de descubrimiento.

::: details Depurar problemas de Bonjour

Si el descubrimiento falla, posibles causas:

- **mDNS bloqueado**: Algunas redes Wi-Fi deshabilitan mDNS
- **Firewall**: Bloquea el puerto UDP 5353
- **Aislamiento de red**: Los dispositivos están en diferentes VLAN o subredes

Solución: usa Tailscale + Wide-Area Bonjour, o configura manualmente la dirección de Gateway.

:::

### Paso 3: Conectar desde Android

**Por qué**
La aplicación Android descubre Gateway a través de mDNS/NSD y establece una conexión WebSocket.

En la aplicación Android:

1. Abre **Configuración** (Settings)
2. En **Gateways descubiertos** selecciona tu Gateway
3. Toca **Connect**

**Si mDNS está bloqueado**:
- Ve a **Advanced → Manual Gateway**
- Ingresa el **nombre de host y puerto** de Gateway (ej. `192.168.1.100:18789`)
- Toca **Connect (Manual)**

::: tip Reconexión automática

Después del primer emparejamiento exitoso, la aplicación Android se reconectará automáticamente al inicio:
- Si está habilitado el endpoint manual, usa el endpoint manual
- De lo contrario, usa el último Gateway descubierto (best-effort)

:::

**Punto de control ✅**
- La aplicación Android muestra el estado "Connected"
- La aplicación muestra el nombre para mostrar de Gateway
- La aplicación muestra el estado de emparejamiento (Pending o Paired)

### Paso 4: Aprobar emparejamiento (CLI)

**Por qué**
Gateway necesita que apruebes la solicitud de emparejamiento del nodo para otorgar permisos de acceso.

En el host de Gateway:

```bash
# Ver solicitudes de emparejamiento pendientes
clawdbot nodes pending

# Aprobar emparejamiento
clawdbot nodes approve <requestId>
```

::: details Flujo de emparejamiento

Flujo de trabajo de emparejamiento propiedad de Gateway:

1. El nodo Android se conecta a Gateway y solicita emparejamiento
2. Gateway almacena la **solicitud pendiente** y emite el evento `node.pair.requested`
3. Apruebas o rechazas la solicitud a través de CLI
4. Después de la aprobación, Gateway emite un nuevo **auth token**
5. El nodo Android usa el token para reconectarse y cambia al estado "paired"

Las solicitudes pendientes expiran automáticamente después de **5 minutos**.

:::

**Deberías ver**:
```
✓ Node approved: android-node-abc123
Token issued: eyJhbGc...
```

La aplicación Android se reconectará automáticamente y mostrará el estado "Paired".

### Paso 5: Verificar que el nodo está conectado

**Por qué**
Confirmar que el nodo Android se ha emparejado y conectado exitosamente a Gateway.

Verifica a través de CLI:

```bash
clawdbot nodes status
```

**Deberías ver**:
```
Known: 1 · Paired: 1 · Connected: 1

┌──────────────────────────────────────────────┐
│ Name: My Samsung Tab                     │
│ Device: Android                          │
│ Model: Samsung SM-X926B                 │
│ IP: 192.168.0.99                      │
│ Status: paired, connected                 │
│ Caps: camera, canvas, screen, location, sms │
└──────────────────────────────────────────────┘
```

O a través de la API de Gateway:

```bash
clawdbot gateway call node.list --params '{}'
```

### Paso 6: Probar la función Camera

**Por qué**
Verificar que los comandos Camera del nodo Android funcionan correctamente y que los permisos están otorgados.

Prueba tomar fotos a través de CLI:

```bash
# Tomar foto (cámara frontal predeterminada)
clawdbot nodes camera snap --node "android-node"

# Especificar cámara trasera
clawdbot nodes camera snap --node "android-node" --facing back

# Grabar video (3 segundos)
clawdbot nodes camera clip --node "android-node" --duration 3000
```

**Deberías ver**:
```
MEDIA: /tmp/clawdbot-camera-snap-123456.jpg
```

::: tip Permisos de Camera

El nodo Android necesita los siguientes permisos de tiempo de ejecución:

- **CAMERA**: Para `camera.snap` y `camera.clip`
- **RECORD_AUDIO**: Para `camera.clip` (cuando `includeAudio=true`)

En la primera llamada a comandos Camera, la aplicación solicitará otorgar permisos. Si se rechazan, el comando devolverá el error `CAMERA_PERMISSION_REQUIRED` o `AUDIO_PERMISSION_REQUIRED`.

:::

### Paso 7: Probar la función Canvas

**Por qué**
Verificar que la interfaz visual Canvas se puede mostrar en el dispositivo Android.

::: info Canvas Host

Canvas necesita un servidor HTTP para proporcionar contenido HTML/CSS/JS. Gateway ejecuta Canvas Host en el puerto 18793 por defecto.

:::

Crea el archivo Canvas en el host de Gateway:

```bash
mkdir -p ~/clawd/canvas
echo '<h1>Hello from AI!</h1>' > ~/clawd/canvas/index.html
```

Navega a Canvas en la aplicación Android:

```bash
clawdbot nodes invoke --node "android-node" \
  --command canvas.navigate \
  --params '{"url":"http://<gateway-hostname>.local:18793/__clawdbot__/canvas/"}'
```

**Deberías ver**:
En la aplicación Android se muestra la página "Hello from AI!".

::: tip Entorno Tailscale

Si el dispositivo Android y Gateway están ambos en la red Tailscale, usa el nombre MagicDNS o la IP de tailnet en lugar de `.local`:

```json
{"url":"http://<gateway-magicdns>:18793/__clawdbot__/canvas/"}
```

:::

### Paso 8: Probar las funciones Screen y Location

**Por qué**
Verificar que la grabación de pantalla y la obtención de ubicación funcionan correctamente.

Grabación de pantalla:

```bash
# Grabar pantalla durante 10 segundos
clawdbot nodes screen record --node "android-node" --duration 10s --fps 15
```

**Deberías ver**:
```
MEDIA: /tmp/clawdbot-screen-record-123456.mp4
```

Obtención de ubicación:

```bash
clawdbot nodes invoke --node "android-node" --command location.get
```

**Deberías ver**:
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "accuracy": 10,
  "timestamp": 1706345678000
}
```

::: warning Requisitos de permisos

La grabación de pantalla requiere el permiso **RECORD_AUDIO** de Android (si el audio está habilitado) y acceso en primer plano. La obtención de ubicación requiere el permiso **LOCATION**.

En la primera llamada, la aplicación solicitará otorgar permisos.

:::

## Problemas comunes

### Problema 1: No se puede descubrir Gateway

**Síntoma**: No se ve Gateway en la aplicación Android

**Causas posibles**:
- Gateway no está iniciado o vinculado a loopback
- mDNS está bloqueado en la red
- El firewall bloquea el puerto UDP 5353

**Soluciones**:
1. Verifica que Gateway está ejecutándose: `clawdbot nodes status`
2. Usa la dirección manual de Gateway: ingresa la IP y puerto de Gateway en la aplicación Android
3. Configura Tailscale + Wide-Area Bonjour (recomendado)

### Problema 2: Falla la conexión después del emparejamiento

**Síntoma**: Muestra "Paired" pero no se puede conectar

**Causas posibles**:
- Token expirado (el token se rota después de cada emparejamiento)
- Gateway se reinició pero el nodo no se reconectó
- Cambios de red

**Soluciones**:
1. Toca manualmente "Reconnect" en la aplicación Android
2. Verifica los registros de Gateway: `bonjour: client disconnected ...`
3. Reempareja: elimina el nodo y aprueba de nuevo

### Problema 3: Comandos Camera devuelven error de permisos

**Síntoma**: `camera.snap` devuelve `CAMERA_PERMISSION_REQUIRED`

**Causas posibles**:
- El usuario rechazó los permisos
- Los permisos están deshabilitados por políticas del sistema

**Soluciones**:
1. Busca la aplicación "Clawdbot" en la configuración de Android
2. Ve a "Permisos"
3. Otorga permisos de Cámara y Micrófono
4. Reintenta el comando Camera

### Problema 4: Falla la llamada en segundo plano

**Síntoma**: La llamada en segundo plano devuelve `NODE_BACKGROUND_UNAVAILABLE`

**Causa**: El nodo Android solo permite llamadas en primer plano para comandos locales del dispositivo

**Soluciones**:
1. Asegúrate de que la aplicación se está ejecutando en primer plano (abre la aplicación)
2. Verifica si la aplicación está optimizada por el sistema (optimización de batería)
3. Deshabilita las restricciones de "modo de ahorro de energía" para la aplicación

## Resumen de esta lección

Esta lección introdujo cómo configurar el nodo Android para ejecutar operaciones locales del dispositivo:

- **Flujo de conexión**: Conecta el nodo Android a Gateway a través de mDNS/NSD o configuración manual
- **Mecanismo de emparejamiento**: Usa el emparejamiento propiedad de Gateway para aprobar permisos de acceso del nodo
- **Funciones disponibles**: Camera, Canvas, Screen, Location, SMS
- **Herramientas CLI**: Usa comandos `clawdbot nodes` para gestionar nodos y llamar funciones
- **Requisitos de permisos**: La aplicación Android necesita permisos de tiempo de ejecución como Camera, Audio, Location

**Puntos clave**:
- El nodo Android es una aplicación companion, no aloja Gateway
- Todas las operaciones locales del dispositivo requieren que la aplicación se ejecute en primer plano
- Las solicitudes de emparejamiento expiran automáticamente después de 5 minutos
- Admite descubrimiento Wide-Area Bonjour para redes Tailscale

## Próxima lección

> En la próxima lección aprenderemos **[Canvas Visual Interface y A2UI](../../advanced/canvas/)**.
>
> Aprenderás:
> - Mecanismo de push Canvas A2UI
> - Cómo mostrar contenido en tiempo real en Canvas
> - Lista completa de comandos Canvas

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones del código fuente</strong></summary>

> Última actualización: 2026-01-27

| Función        | Ruta del archivo                                                                                    | Línea    |
|--- | --- | ---|
| Política de comandos de nodo | [`src/gateway/node-command-policy.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/node-command-policy.ts) | 1-112   |
| Schema de protocolo de nodo | [`src/gateway/protocol/schema/nodes.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/protocol/schema/nodes.ts) | 1-103   |
| Documentación Android  | [`docs/platforms/android.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/platforms/android.md) | 1-142   |
| CLI de nodos  | [`docs/cli/nodes.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/cli/nodes.md) | 1-69    |

**Constantes clave**:
- `PLATFORM_DEFAULTS`: Define la lista de comandos compatibles por cada plataforma (`node-command-policy.ts:32-58`)
- Comandos compatibles con Android: Canvas, Camera, Screen, Location, SMS (`node-command-policy.ts:34-40`)

**Funciones clave**:
- `resolveNodeCommandAllowlist()`: Resuelve la lista de comandos permitidos según la plataforma (`node-command-policy.ts:77-91`)
- `normalizePlatformId()`: Normaliza el ID de plataforma (`node-command-policy.ts:60-75`)

**Características del nodo Android**:
- ID de cliente: `clawdbot-android` (`gateway/protocol/client-info.ts:9`)
- Detección de familia de dispositivo: Identifica Android a través del campo `deviceFamily` (`node-command-policy.ts:70`)
- Canvas y Camera habilitados por defecto (`docs/platforms/android.md`)

</details>
