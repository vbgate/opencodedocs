---
title: "Configuración de Nodo iOS: Conectar Gateway con Cámara, Canvas y Voice Wake | Tutorial de Clawdbot"
sidebarTitle: "Hacer que la IA use iPhone"
subtitle: "Guía de Configuración de Nodo iOS"
description: "Aprende a configurar nodos iOS para conectar a Gateway, usar cámara para fotos, interfaz visual Canvas, Voice Wake para activación por voz, Talk Mode para conversación continua, obtención de ubicación y otras operaciones locales del dispositivo, con descubrimiento automático a través de Bonjour y Tailscale, emparejamiento y autenticación con control de seguridad para lograr colaboración de IA en múltiples dispositivos, soporte para primer plano, fondo y gestión de permisos."
tags:
  - "Nodo iOS"
  - "Nodo de dispositivo"
  - "Canvas"
  - "Voice Wake"
prerequisite:
  - "start-gateway-startup"
order: 170
---

# Guía de Configuración de Nodo iOS

## Lo que podrás hacer después de aprender

Después de configurar un nodo iOS, podrás:

- ✅ Permitir que el asistente de IA use la cámara del dispositivo iOS para tomar fotos o grabar videos
- ✅ Renderizar interfaces visuales Canvas en el dispositivo iOS
- ✅ Usar Voice Wake y Talk Mode para interacción por voz
- ✅ Obtener información de ubicación del dispositivo iOS
- ✅ Gestionar múltiples nodos de dispositivos a través de Gateway de manera unificada

## Tu situación actual

Deseas ampliar las capacidades del asistente de IA en tu dispositivo iOS, permitiéndole:

- **Usar la cámara para tomar fotos o grabar videos**: cuando digas "toma una foto", la IA pueda usar automáticamente el iPhone para tomarla
- **Mostrar interfaces visuales**: mostrar gráficos, formularios o paneles de control generados por la IA en el iPhone
- **Activación por voz y conversación continua**: sin necesidad de usar las manos, simplemente decir "Clawd" para activar el asistente y comenzar a conversar
- **Obtener información del dispositivo**: permitir que la IA sepa tu ubicación, estado de la pantalla y otra información

## Cuándo usar esta técnica

- **Escenarios móviles**: deseas que la IA pueda usar capacidades como cámara, pantalla del iPhone
- **Colaboración de múltiples dispositivos**: Gateway se ejecuta en un servidor, pero necesita llamar funciones de dispositivos locales
- **Interacción por voz**: quieres usar el iPhone como terminal de asistente de voz portátil

::: info ¿Qué es un nodo iOS?
Un nodo iOS es una aplicación Companion que se ejecuta en iPhone/iPad y se conecta a Clawdbot Gateway a través de WebSocket. No es Gateway en sí, sino que actúa como un "periférico" que proporciona capacidades de operación local del dispositivo.

**Diferencia con Gateway**:
- **Gateway**: se ejecuta en servidor/macOS, responsable del enrutamiento de mensajes, llamadas al modelo de IA, distribución de herramientas
- **Nodo iOS**: se ejecuta en iPhone, responsable de ejecutar operaciones locales del dispositivo (cámara, Canvas, ubicación, etc.)
:::

---

## 🎒 Preparativos antes de comenzar

::: warning Requisitos previos

Antes de comenzar, confirma:

1. **Gateway está iniciado y ejecutándose**
   - Asegúrate de que Gateway se esté ejecutando en otro dispositivo (macOS, Linux o Windows via WSL2)
   - Gateway está vinculado a una dirección de red accesible (LAN o Tailscale)

2. **Conectividad de red**
   - El dispositivo iOS y Gateway están en la misma LAN (recomendado) o conectados a través de Tailscale
   - El dispositivo iOS puede acceder a la dirección IP y puerto de Gateway (por defecto 18789)

3. **Obtener la aplicación iOS**
   - La aplicación iOS es actualmente una **versión preliminar interna**, no distribuida públicamente
   - Necesita construir desde el código fuente u obtener la versión de prueba de TestFlight
:::

## Concepto central

Flujo de trabajo del nodo iOS:

```
[Gateway] ←→ [Nodo iOS]
     ↓            ↓
  [Modelo IA]   [Capacidades dispositivo]
     ↓            ↓
  [Ejecución decisión]   [Cámara/Canvas/Voz]
```

**Puntos clave técnicos**:

1. **Descubrimiento automático**: descubrir automáticamente Gateway a través de Bonjour (LAN) o Tailscale (entre redes)
2. **Emparejamiento y autenticación**: la primera conexión requiere aprobación manual en el lado de Gateway para establecer una relación de confianza
3. **Comunicación de protocolo**: usar protocolo WebSocket (`node.invoke`) para enviar comandos
4. **Control de permisos**: los comandos locales del dispositivo requieren autorización del usuario (cámara, ubicación, etc.)

**Características de arquitectura**:

- **Seguridad**: todas las operaciones del dispositivo requieren autorización explícita del usuario en el lado de iOS
- **Aislamiento**: el nodo no ejecuta Gateway, solo ejecuta operaciones locales
- **Flexibilidad**: soporta múltiples escenarios de uso como primer plano, fondo, remoto, etc.

---

## Sigue estos pasos

### Paso 1: Iniciar Gateway

Inicia el servicio en el host de Gateway:

```bash
clawdbot gateway --port 18789
```

**Lo que deberías ver**:

```
✅ Gateway running on ws://0.0.0.0:18789
✅ Bonjour advertisement active: _clawdbot._tcp
```

::: tip Acceso entre redes
Si Gateway y el dispositivo iOS no están en la misma LAN, usa **Tailscale Serve/Funnel**:

```bash
clawdbot gateway --port 18789 --tailscale funnel
```

El dispositivo iOS descubrirá automáticamente Gateway a través de Tailscale.
:::

### Paso 2: Conexión de la aplicación iOS

En la aplicación iOS:

1. Abre **Settings** (Configuración)
2. Encuentra la sección **Gateway**
3. Selecciona un Gateway descubierto automáticamente (o habilita **Manual Host** abajo para ingresar manualmente host y puerto)

**Lo que deberías ver**:

- La aplicación intenta conectarse a Gateway
- El estado muestra "Connected" o "Pairing pending"

::: details Configurar host manualmente

Si el descubrimiento automático falla, ingresa la dirección de Gateway manualmente:

1. Habilita **Manual Host**
2. Ingresa el host de Gateway (por ejemplo, `192.168.1.100`)
3. Ingresa el puerto (por defecto `18789`)
4. Haz clic en "Connect"

:::

### Paso 3: Aprobar solicitud de emparejamiento

**En el host de Gateway**, aprueba la solicitud de emparejamiento del nodo iOS:

```bash
# Ver nodos pendientes de aprobación
clawdbot nodes pending

# Aprobar nodo específico (reemplaza <requestId>)
clawdbot nodes approve <requestId>
```

**Lo que deberías ver**:

```
✅ Node paired successfully
Node: iPhone (iOS)
ID: node-abc123
```

::: tip Rechazar emparejamiento
Si deseas rechazar la solicitud de conexión de un nodo:

```bash
clawdbot nodes reject <requestId>
```

:::

**Punto de verificación ✅**: verificar el estado del nodo en Gateway

```bash
clawdbot nodes status
```

Deberías ver que tu nodo iOS muestra el estado `paired`.

### Paso 4: Probar conexión del nodo

**Probar comunicación del nodo desde Gateway**:

```bash
# Llamar comando de nodo a través de Gateway
clawdbot gateway call node.list --params "{}"
```

**Lo que deberías ver**:

```json
{
  "result": [
    {
      "id": "node-abc123",
      "displayName": "iPhone (iOS)",
      "platform": "ios",
      "capabilities": ["camera", "canvas", "location", "screen", "voicewake"]
    }
  ]
}
```

---

## Usar funciones del nodo

### Tomar foto con cámara

El nodo iOS soporta tomar fotos y grabar videos con la cámara:

```bash
# Tomar foto (cámara frontal por defecto)
clawdbot nodes camera snap --node "iPhone (iOS)"

# Tomar foto (cámara trasera, resolución personalizada)
clawdbot nodes camera snap --node "iPhone (iOS)" --facing back --max-width 1920

# Grabar video (5 segundos)
clawdbot nodes camera clip --node "iPhone (iOS)" --duration 5000
```

**Lo que deberías ver**:

```
MEDIA:/tmp/clawdbot-camera-snap-abc123.jpg
```

::: warning Requisito de primer plano
Los comandos de cámara requieren que la aplicación iOS esté en **primer plano**. Si la aplicación está en segundo plano, devolverá el error `NODE_BACKGROUND_UNAVAILABLE`.

:::

**Parámetros de cámara iOS**:

| Parámetro | Tipo | Predeterminado | Descripción |
| --- | --- | --- | --- |
| `facing` | `front\|back` | `front` | Orientación de la cámara |
| `maxWidth` | número | `1600` | Ancho máximo (píxeles) |
| `quality` | `0..1` | `0.9` | Calidad JPEG (0-1) |
| `durationMs` | número | `3000` | Duración del video (milisegundos) |
| `includeAudio` | booleano | `true` | Incluir audio |

### Interfaz visual Canvas

El nodo iOS puede mostrar interfaces visuales Canvas:

```bash
# Navegar a URL
clawdbot nodes canvas navigate --node "iPhone (iOS)" --target "https://example.com"

# Ejecutar JavaScript
clawdbot nodes canvas eval --node "iPhone (iOS)" --js "document.title"

# Capturar pantalla (guardar como JPEG)
clawdbot nodes canvas snapshot --node "iPhone (iOS)" --format jpeg --max-width 900
```

**Lo que deberías ver**:

```
MEDIA:/tmp/clawdbot-canvas-snap-abc123.jpg
```

::: tip Auto-envío A2UI
Si Gateway está configurado con `canvasHost`, el nodo iOS navegará automáticamente a la interfaz A2UI al conectarse.
:::

### Voice Wake activación por voz

Habilita Voice Wake en **Settings** de la aplicación iOS:

1. Activa el interruptor **Voice Wake**
2. Establece la palabra de activación (por defecto: "clawd", "claude", "computer")
3. Asegúrate de que iOS haya autorizado el permiso del micrófono

::: info Palabra de activación global
La palabra de activación de Clawdbot es una **configuración global**, gestionada por Gateway. Todos los nodos (iOS, Android, macOS) usan la misma lista de palabras de activación.

Modificar las palabras de activación se sincronizará automáticamente con todos los dispositivos.
:::

### Talk Mode conversación continua

Después de habilitar Talk Mode, la IA leerá las respuestas continuamente a través de TTS y escuchará continuamente la entrada de voz:

1. Habilita **Talk Mode** en **Settings** de la aplicación iOS
2. La IA leerá automáticamente sus respuestas
3. Puedes conversar continuamente por voz sin necesidad de hacer clic manualmente

::: warning Limitaciones de segundo plano
iOS puede suspender el audio de segundo plano. Cuando la aplicación no está en primer plano, la función de voz es **mejor esfuerzo** (best-effort).
:::

---

## Preguntas frecuentes

### El indicador de emparejamiento nunca aparece

**Problema**: la aplicación iOS muestra "Connected", pero Gateway no muestra el indicador de emparejamiento.

**Solución**:

```bash
# 1. Ver manualmente nodos pendientes de aprobación
clawdbot nodes pending

# 2. Aprobar nodo
clawdbot nodes approve <requestId>

# 3. Verificar conexión
clawdbot nodes status
```

### Fallo de conexión (después de reinstalar)

**Problema**: no se puede conectar a Gateway después de reinstalar la aplicación iOS.

**Causa**: el token de emparejamiento en Keychain ha sido borrado.

**Solución**: vuelve a ejecutar el proceso de emparejamiento (Paso 3).

### A2UI_HOST_NOT_CONFIGURED

**Problema**: los comandos de Canvas fallan, mostrando `A2UI_HOST_NOT_CONFIGURED`.

**Causa**: Gateway no tiene configurada la URL `canvasHost`.

**Solución**:

Establece el host de Canvas en la configuración de Gateway:

```bash
clawdbot config set canvasHost "http://<gateway-host>:18793/__clawdbot__/canvas/"
```

### NODE_BACKGROUND_UNAVAILABLE

**Problema**: los comandos de cámara/Canvas fallan, devolviendo `NODE_BACKGROUND_UNAVAILABLE`.

**Causa**: la aplicación iOS no está en primer plano.

**Solución**: cambia la aplicación iOS a primer plano, luego reintentar el comando.

---

## Resumen de la lección

En esta lección aprendiste:

✅ Concepto y arquitectura del nodo iOS
✅ Cómo descubrir y conectar automáticamente a Gateway
✅ Proceso de emparejamiento y autenticación
✅ Usar funciones como cámara, Canvas, Voice Wake, etc.
✅ Métodos de solución de problemas comunes

**Puntos clave**:

- El nodo iOS es un proveedor de capacidades de operación local del dispositivo, no Gateway
- Todas las operaciones del dispositivo requieren autorización del usuario y estado de primer plano
- El emparejamiento es un paso necesario para la seguridad, solo se confían nodos aprobados
- Voice Wake y Talk Mode requieren permiso de micrófono

## Próxima lección

> En la próxima lección aprenderemos **[Configuración de nodo Android](../android-node/)**.
>
> Aprenderás:
> - Cómo configurar nodos Android para conectar a Gateway
> - Usar la cámara, grabación de pantalla, Canvas de dispositivos Android
> - Manejar problemas de permisos y compatibilidad específicos de Android

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-27

| Función | Ruta del archivo | Línea |
| --- | --- | --- |
| Punto de entrada de la aplicación iOS | [`apps/ios/Sources/ClawdbotApp.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/ios/Sources/ClawdbotApp.swift) | 1-30 |
| Renderizado Canvas | [`apps/ios/Sources/RootCanvas.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/ios/Sources/RootCanvas.swift) | 1-250 |
| Conexión Gateway | [`apps/ios/Sources/Gateway/`](https://github.com/clawdbot/clawdbot/blob/main/apps/ios/Sources/Gateway/) | - |
| Runner de protocolo de nodo | [`src/node-host/runner.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/node-host/runner.ts) | 1-1100 |
| Configuración de nodo | [`src/node-host/config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/node-host/config.ts) | 1-50 |
| Documentación de plataforma iOS | [`docs/platforms/ios.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/platforms/ios.md) | 1-105 |
| Documentación del sistema de nodos | [`docs/nodes/index.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/nodes/index.md) | 1-306 |

**Constantes clave**:
- `GATEWAY_DEFAULT_PORT = 18789`: puerto predeterminado de Gateway
- `NODE_ROLE = "node"`: identificador de rol de conexión de nodo

**Comandos clave**:
- `clawdbot nodes pending`: listar nodos pendientes de aprobación
- `clawdbot nodes approve <requestId>`: aprobar emparejamiento de nodo
- `clawdbot nodes invoke --node <id> --command <cmd>`: llamar comando de nodo
- `clawdbot nodes camera snap --node <id>`: tomar foto
- `clawdbot nodes canvas navigate --node <id> --target <url>`: navegar Canvas

**Métodos de protocolo**:
- `node.invoke.request`: solicitud de invocación de comando de nodo
- `node.invoke.result`: resultado de ejecución de comando de nodo
- `voicewake.get`: obtener lista de palabras de activación
- `voicewake.set`: establecer lista de palabras de activación
- `voicewake.changed`: evento de cambio de palabra de activación

</details>
