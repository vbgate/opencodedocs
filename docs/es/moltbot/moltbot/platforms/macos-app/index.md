---
title: "Guía completa de la app macOS: barra de menús, Voice Wake, Talk Mode y modo de nodo | Tutoriales de Clawdbot"
sidebarTitle: "Mac se convierte en asistente de IA"
subtitle: "Guía completa de la app macOS: barra de menús, Voice Wake, Talk Mode y modo de nodo"
description: "Aprende las funciones completas de la app macOS de Clawdbot, incluyendo gestión de estado de barra de menús, ventana integrada WebChat, Voice Wake de activación por voz, Talk Mode de conversación continua, modo de nodo, control de seguridad Exec Approvals y configuración de acceso remoto SSH/Tailscale. Domina el cambio entre modo local vs remoto y mejores prácticas de gestión de permisos."
tags:
  - "macOS"
  - "aplicación de barra de menús"
  - "Voice Wake"
  - "Talk Mode"
  - "modo de nodo"
prerequisite:
  - "start-getting-started"
order: 160
---

# App macOS: control de barra de menús e interacción por voz

## Lo que podrás hacer después de completar este tutorial

Después de completar este tutorial, podrás:

- ✅ Entender las funciones centrales de la app macOS de Clawdbot como plano de control de barra de menús
- ✅ Dominar el uso de Voice Wake (activación por voz) y Talk Mode (conversación continua)
- ✅ Entender las capacidades como `system.run`, Canvas, Camera en modo de nodo
- ✅ Configurar modo local vs remoto para diferentes escenarios de despliegue
- ✅ Gestionar el mecanismo de aprobación Exec Approvals para controlar permisos de ejecución de comandos
- ✅ Usar enlaces profundos (deep links) para activar rápidamente el asistente de IA
- ✅ Acceder y controlar Gateway remotamente a través de SSH/Tailscale

## Tu situación actual

Podrías estar pensando:

- "¿Qué hace exactamente la app macOS? ¿Es el Gateway en sí?"
- "¿Cómo se usan Voice Wake y Talk Mode? ¿Necesitan hardware adicional?"
- "¿Cuál es la diferencia entre modo de nodo y modo normal? ¿Cuándo usar cada uno?"
- "¿Cómo gestiono los permisos y configuraciones de seguridad en macOS?"
- "¿Puedo ejecutar Gateway en otra máquina?"

Las buenas noticias son: **la app macOS de Clawdbot es el plano de control gráfico de Gateway**, no ejecuta el servicio Gateway, sino que se conecta, gestiona y supervisa. Además, también actúa como nodo exponiendo funciones específicas de macOS (como `system.run`, Canvas, Camera) al Gateway remoto.

## Cuándo usar este enfoque

Cuando necesites:

- 🖥️ **Gestión gráfica en macOS** —— Estado y control de la barra de menús, más intuitivo que la línea de comandos
- 🎙️ **Interacción por voz** —— Voice Wake (activación) + Talk Mode (conversación continua)
- 💻 **Ejecución de comandos locales** —— Ejecutar comandos como `system.run` en el nodo macOS
- 🎨 **Visualización Canvas** —— Renderizar interfaces visuales impulsadas por IA en macOS
- 📷 **Funciones del dispositivo** —— Captura de fotos, grabación de videos y grabación de pantalla con Camera
- 🌐 **Acceso remoto** —— Controlar Gateway remoto a través de SSH/Tailscale

::: info Diferencia entre nodo y Gateway
- **Gateway**: ejecuta modelos de IA, gestiona sesiones, procesa mensajes (puede ejecutarse en cualquier máquina)
- **Nodo (Node)**: expone funciones locales del dispositivo (Canvas, Camera, system.run) al Gateway
- **App macOS**: puede ser tanto cliente de Gateway como actuar como nodo
:::

---

## Concepto central

La app macOS de Clawdbot es un sistema de **doble rol**:

```
┌──────────────────────────────────────────┐
│     Clawdbot.app (app macOS)         │
│                                      │
│   ┌────────────────────────────┐      │
│   │  Plano de control de      │      │
│   │  barra de menús          │      │
│   │  • Gestión de conexión    │◄────► Gateway WebSocket
│   │    a Gateway              │      │
│   │  • Ventana integrada      │      │
│   │    WebChat                │      │
│   │  • Configuración y ajustes│      │
│   │  • Voice Wake/Talk Mode   │      │
│   └────────────────────────────┘      │
│                                      │
│   ┌────────────────────────────┐      │
│   │  Servicio de nodo       │      │
│   │  • system.run              │◄────► Gateway protocolo de nodo
│   │  • Canvas                 │      │
│   │  • Camera/Pantalla         │      │
│   └────────────────────────────┘      │
└──────────────────────────────────────────┘
```

**Dos modos de ejecución**:

| Modo | Ubicación de Gateway | Servicio de nodo | Escenario aplicable |
|--- | --- | --- | ---|
| **Modo local** (predeterminado) | Máquina local (daemon launchd) | No iniciado | Gateway se ejecuta en este Mac |
| **Modo remoto** | Máquina remota (a través de SSH/Tailscale) | Iniciado | Gateway se ejecuta en otra máquina |

**Módulos de funcionalidad central**:

1. **Control de barra de menús** —— Estado de conexión a Gateway, WebChat, configuración, gestión de sesiones
2. **Voice Wake** —— Escucha global de palabras de activación por voz
3. **Talk Mode** —— Ciclo de conversación por voz continua (entrada de voz → respuesta IA → reproducción TTS)
4. **Modo de nodo** —— Exponer comandos específicos de macOS (`system.run`, `canvas.*`, `camera.*`)
5. **Exec Approvals** —— Aprobación de ejecución de comandos `system.run` y control de seguridad
6. **Enlaces profundos (Deep Links)** —— Protocolo `clawdbot://` para activación rápida de funciones

---

## Sígueme paso a paso

### Paso 1: Instalar e iniciar la app macOS

**Por qué**
Necesitas instalar la app macOS de Clawdbot para obtener control de la barra de menús y funciones de voz.

**Métodos de instalación**:

::: code-group

```bash [Instalar usando Homebrew]
brew install --cask clawdbot
```

```bash [Descarga manual .dmg]
# Descargar Clawdbot.app.dmg más reciente desde https://github.com/moltbot/moltbot/releases
# Arrastrar a la carpeta Aplicaciones
```

:::

**Primer inicio**:

```bash
open /Applications/Clawdbot.app
```

**Lo que deberías ver**:
- El icono 🦞 aparece en la barra de menús superior de macOS
- Haz clic en el icono para desplegar el menú
- El sistema muestra un diálogo de solicitud de permisos TCC

::: tip Solicitud de permisos al primer inicio
La app macOS necesita los siguientes permisos (el sistema mostrará automáticamente las solicitudes):
- **Permiso de notificaciones** —— Mostrar notificaciones del sistema
- **Permiso de accesibilidad** —— Para Voice Wake y operaciones del sistema
- **Permiso de micrófono** —— Necesario para Voice Wake y Talk Mode
- **Permiso de grabación de pantalla** —— Funciones de Canvas y grabación de pantalla
- **Permiso de reconocimiento de voz** —— Entrada de voz para Voice Wake
- **Permiso de automatización** —— Control AppleScript (si es necesario)

Todos estos permisos se usan **completamente de forma local**, no se suben a ningún servidor.
:::

---

### Paso 2: Configurar el modo de conexión (local vs remoto)

**Por qué**
Elige el modo local o remoto según tus necesidades de despliegue.

#### Modo A: Modo local (predeterminado)

Escenario aplicable: Gateway y la app macOS se ejecutan en la misma máquina.

**Pasos de configuración**:

1. Asegúrate de que la app de barra de menús muestre el modo **Local**
2. Si Gateway no se está ejecutando, la app iniciará automáticamente el servicio launchd `com.clawdbot.gateway`
3. La app se conectará a `ws://127.0.0.1:18789`

**Lo que deberías ver**:
- El icono de la barra de menús muestra verde (estado conectado)
- La tarjeta de estado de Gateway muestra "Local"
- El servicio de nodo **no iniciado** (el modo de nodo solo se necesita en modo remoto)

#### Modo B: Modo remoto

Escenario aplicable: Gateway se ejecuta en otra máquina (como un servidor o VPS Linux) y quieres controlarlo desde tu Mac.

**Pasos de configuración**:

1. En la app de barra de menús, cambia al modo **Remote**
2. Ingresa la dirección WebSocket del Gateway remoto (por ejemplo, `ws://tu-servidor:18789`)
3. Selecciona el método de autenticación (Token o Password)
4. La app establecerá automáticamente un túnel SSH para conectar con el Gateway remoto

**Lo que deberías ver**:
- El icono de la barra de menús muestra el estado de conexión (amarillo/verde/rojo)
- La tarjeta de estado de Gateway muestra la dirección del servidor remoto
- El servicio de nodo **se inicia automáticamente** (para que el Gateway remoto pueda invocar funciones locales)

**Mecanismo de túnel en modo remoto**:

```
app macOS                     Gateway remoto
    │                                  │
    ├── Túnel SSH ───────────────────► ws://remoto:18789
    │                                  │
    └── Servicio de nodo ◄───────────────────── node.invoke
```

::: tip Ventajas del modo remoto
- **Gestión centralizada**: ejecutar Gateway en una máquina potente, múltiples clientes acceden
- **Optimización de recursos**: el Mac puede permanecer ligero, Gateway se ejecuta en un servidor de alto rendimiento
- **Localización del dispositivo**: funciones como Canvas y Camera aún se ejecutan localmente en el Mac
:::

---

### Paso 3: Usar el plano de control de barra de menús

**Por qué**
La app de barra de menús proporciona una interfaz para acceder rápidamente a todas las funciones centrales.

**Elementos principales del menú**:

Al hacer clic en el icono de la barra de menús, verás:

1. **Tarjeta de estado**
   - Estado de conexión a Gateway (conectado/desconectado/conectando)
   - Modo actual (Local/Remote)
   - Lista de canales en ejecución (WhatsApp, Telegram, etc.)

2. **Acciones rápidas**
   - **Agent** —— Abre la ventana de diálogo IA (invoca Gateway)
   - **WebChat** —— Abre la interfaz WebChat integrada
   - **Canvas** —— Abre la ventana de visualización Canvas
   - **Settings** —— Abre la interfaz de configuración

3. **Interruptores de funciones**
   - **Talk** —— Habilitar/deshabilitar Talk Mode
   - **Voice Wake** —— Habilitar/deshabilitar Voice Wake

4. **Menú de información**
   - **Usage** —— Ver estadísticas de uso y costos
   - **Sessions** —— Gestionar lista de sesiones
   - **Channels** —— Ver estado de los canales
   - **Skills** —— Gestionar paquetes de habilidades

**Lo que deberías ver**:
- Indicadores de estado que se actualizan en tiempo real (verde = normal, rojo = desconectado)
- Información detallada de conexión al pasar el mouse
- Al hacer clic en cualquier elemento del menú, se abre rápidamente la función correspondiente

---

### Paso 4: Configurar y usar Voice Wake

**Por qué**
Voice Wake te permite activar el asistente de IA mediante una palabra de activación por voz, sin necesidad de hacer clic o escribir.

**Cómo funciona Voice Wake**:

```
┌──────────────────────────────────┐
│   Runtime de Voice Wake      │
│                              │
│   Escuchar micrófono ──► Detectar palabra de activación  │
│                              │
│   ¿Coincide la palabra de activación?                   │
│       │                       │
│       ├─ Sí ──► Activar Agent  │
│       │                       │
│       └─ No ──► Seguir escuchando  │
└──────────────────────────────────┘
```

**Configurar Voice Wake**:

1. Abre **Settings** → **Voice Wake**
2. Ingresa la palabra de activación (predeterminado: `clawd`, `claude`, `computer`)
3. Puedes agregar múltiples palabras de activación (separadas por comas)
4. Habilita el interruptor **Enable Voice Wake**

**Reglas de palabras de activación**:
- Las palabras de activación se almacenan en Gateway: `~/.clawdbot/settings/voicewake.json`
- Todos los nodos comparten **la misma lista global de palabras de activación**
- Los cambios se transmiten a todos los dispositivos conectados (macOS, iOS, Android)

**Flujo de uso**:

1. Asegúrate de que se hayan otorgado los permisos del micrófono
2. Habilita Voice Wake en la barra de menús
3. Di la palabra de activación hacia el micrófono (por ejemplo, "Hey clawd")
4. Espera escuchar el sonido de "ding" (indica activación exitosa)
5. Di tu comando o pregunta

**Lo que deberías ver**:
- Aparece una superposición de Voice Wake en el centro de la pantalla
- Muestra la forma de onda del volumen del micrófono
- Muestra el texto de estado "Listening"
- La IA comienza a procesar tu entrada de voz

::: tip Característica global de Voice Wake
Las palabras de activación son una **configuración global a nivel de Gateway**, no limitadas a un solo dispositivo. Esto significa:
- Al modificar las palabras de activación en macOS, los dispositivos iOS y Android también se sincronizan
- Todos los dispositivos usan el mismo conjunto de palabras de activación
- Pero cada dispositivo puede habilitar/deshabilitar Voice Wake individualmente (según permisos y preferencias del usuario)
:::

---

### Paso 5: Usar Talk Mode para conversación continua

**Por qué**
Talk Mode proporciona una experiencia de conversación por voz continua similar a Siri/Alexa, sin necesidad de activar cada vez.

**Ciclo de trabajo de Talk Mode**:

```
Escuchar ──► IA procesa ──► TTS reproduce ──► Escuchar
  │                                              │
  └────────────────────────────────────────┘
```

**Habilitar Talk Mode**:

1. Haz clic en el botón **Talk** en la barra de menús
2. O usa un atajo de teclado (predeterminado: ninguno, se puede configurar en Settings)
3. Aparece la superposición de Talk Mode

**Estados de interfaz de Talk Mode**:

| Estado | Visualización | Descripción |
|--- | --- | ---|
| **Listening** | Animación de pulso de nube + volumen del micrófono | Esperando que hables |
| **Thinking** | Animación de hundimiento | La IA está pensando |
| **Speaking** | Animación de anillo radiante + ondas | La IA está respondiendo (reproducción TTS en curso) |

**Controles de interacción**:

- **Detener habla**: haz clic en el icono de nube para detener la reproducción TTS
- **Salir de Talk Mode**: haz clic en el botón X en la esquina superior derecha
- **Interrupción por voz**: cuando la IA habla y tú empiezas a hablar, la reproducción se detiene automáticamente

**Configurar TTS**:

Talk Mode usa ElevenLabs para conversión de texto a voz. Ubicación de configuración: `~/.clawdbot/clawdbot.json`

```yaml
talk:
  voiceId: "elevenlabs_voice_id"  # ID de voz de ElevenLabs
  modelId: "eleven_v3"            # Versión del modelo
  apiKey: "elevenlabs_api_key"     # Clave de API (o usar variable de entorno)
  interruptOnSpeech: true           # Interrumpir al hablar
  outputFormat: "mp3_44100_128"   # Formato de salida
```

::: tip Configuración de ElevenLabs
Si no se ha configurado una clave de API, Talk Mode intentará usar:
1. La variable de entorno `ELEVENLABS_API_KEY`
2. La clave en el perfil de shell de Gateway
3. La primera voz de ElevenLabs disponible como predeterminada
:::

---

### Paso 6: Usar modo de nodo

**Por qué**
El modo de nodo permite que la app macOS exponga capacidades locales al Gateway remoto, logrando verdadera colaboración entre dispositivos.

**Comandos disponibles en modo de nodo**:

| Categoría de comando | Ejemplo de comando | Descripción de función |
|--- | --- | ---|
| **Canvas** | `canvas.present`, `canvas.navigate`, `canvas.eval` | Renderizar interfaz visual en macOS |
| **Camera** | `camera.snap`, `camera.clip` | Tomar foto o grabar video |
| **Screen** | `screen.record` | Grabar pantalla |
| **System** | `system.run`, `system.notify` | Ejecutar comandos Shell o enviar notificaciones |

**Habilitar modo de nodo**:

El modo de nodo **se inicia automáticamente en modo remoto**, ya que el Gateway remoto necesita invocar funciones locales.

También puedes iniciar manualmente el servicio de nodo:

```bash
clawdbot node run --display-name "Mi Mac"
```

**Gestión de permisos del nodo**:

La app macOS informa qué funciones están disponibles a través del sistema de permisos:

```json
{
  "canvas": true,
  "camera": true,
  "screen": true,
  "system": {
    "run": true,
    "notify": true
  }
}
```

La IA seleccionará automáticamente las herramientas disponibles según los permisos.

---

### Paso 7: Configurar Exec Approvals (control de seguridad de `system.run`)

**Por qué**
`system.run` puede ejecutar comandos Shell arbitrarios, por lo que se necesita un mecanismo de aprobación para evitar operaciones erróneas o abuso.

**Modelo de seguridad de tres capas de Exec Approvals**:

```json
{
  "version": 1,
  "defaults": {
    "security": "deny",          // Política predeterminada: denegar
    "ask": "on-miss"           // Preguntar cuando el comando no está en la lista blanca
  },
  "agents": {
    "main": {
      "security": "allowlist",    // Sesión principal: solo permitir lista blanca
      "ask": "on-miss",
      "allowlist": [
        { "pattern": "/usr/bin/git" },
        { "pattern": "/opt/homebrew/*/rg" }
      ]
    }
  }
}
```

**Tipos de políticas de seguridad**:

| Política | Comportamiento | Escenario aplicable |
|--- | --- | ---|
| `deny` | Deniega todas las invocaciones `system.run` | Alta seguridad, deshabilita todos los comandos |
| `allowlist` | Solo permite comandos en la lista blanca | Equilibra seguridad y conveniencia |
| `ask` | Pide aprobación del usuario cuando no está en la lista blanca | Flexible pero requiere confirmación |

**Flujo de aprobación**:

Cuando la IA intenta ejecutar un comando no autorizado:

1. La app macOS muestra un diálogo de aprobación
2. Muestra la ruta completa del comando y los argumentos
3. Proporciona tres opciones:
   - **Allow Once** —— Permitir solo esta vez
   - **Always Allow** —— Agregar a la lista blanca
   - **Deny** —— Denegar ejecución

**Lo que deberías ver**:
- El diálogo de aprobación muestra detalles del comando (por ejemplo, `/usr/bin/ls -la ~`)
- Al seleccionar "Always Allow", no volverá a preguntar la próxima vez
- Al seleccionar "Deny", la ejecución del comando falla y devuelve un error a la IA

**Ubicación de configuración**:

Los Exec Approvals se almacenan localmente en macOS:
- Archivo: `~/.clawdbot/exec-approvals.json`
- Historial de aprobaciones: ver todos los comandos aprobados/denegados en la aplicación

---

### Paso 8: Usar enlaces profundos (deep links)

**Por qué**
Los enlaces profundos proporcionan la capacidad de activar rápidamente funciones de Clawdbot desde otras aplicaciones.

**Protocolo de enlaces profundos soportado**: `clawdbot://`

#### `clawdbot://agent`

Activa una solicitud `agent` de Gateway, equivalente a ejecutar `clawdbot agent` en la terminal.

**Parámetros**:

| Parámetro | Descripción | Ejemplo |
|--- | --- | ---|
| `message` (requerido) | Mensaje para enviar a la IA | `message=Hola%20desde%20deep%20link` |
| `sessionKey` (opcional) | Clave de sesión de destino, predeterminado `main` | `sessionKey=main` |
| `thinking` (opcional) | Nivel de pensamiento: off\|minimal\|low\|medium\|high\|xhigh | `thinking=high` |
| `deliver`/`to`/`channel` (opcional) | Canal de entrega | `channel=telegram` |
| `timeoutSeconds` (opcional) | Tiempo de espera | `timeoutSeconds=30` |
| `key` (opcional) | Clave de omisión de confirmación, para automatización | `key=your-secret-key` |

**Ejemplos**:

```bash
# Básico: enviar mensaje
open 'clawdbot://agent?message=Hola%20desde%20deep%20link'

# Avanzado: enviar a Telegram, nivel de pensamiento alto, 30 segundos de tiempo de espera
open 'clawdbot://agent?message=Resumir%20mi%20día&to=telegram&thinking=high&timeoutSeconds=30'

# Automatización: usar clave para omitir confirmación (usar solo de forma segura en tus scripts)
open 'clawdbot://agent?message=Tarea%20automatizada&key=cadena-aleatoria-segura'
```

**Lo que deberías ver**:
- La app macOS de Clawdbot se abre automáticamente (si no se está ejecutando)
- Aparece la ventana Agent y muestra el mensaje
- La IA comienza a procesar y devuelve la respuesta

::: warning Seguridad de los enlaces profundos
- Sin el parámetro `key`, la aplicación mostrará un diálogo de confirmación
- Con una `key` válida, la solicitud se ejecuta en silencio (para scripts de automatización)
- Nunca uses enlaces profundos de fuentes no confiables
:::

---

## Puntos de control ✅

Después de completar los pasos anteriores, verifica lo siguiente:

### Instalación y conexión

- [ ] La app macOS se instaló correctamente y aparece en la carpeta Aplicaciones
- [ ] Todos los permisos necesarios se han otorgado al primer inicio
- [ ] El icono de la barra de menús se muestra normalmente
- [ ] Se puede conectar a Gateway en modo local (Local)
- [ ] Se puede conectar a Gateway en modo remoto (Remote)

### Voice Wake y Talk Mode

- [ ] La configuración de palabras de activación de Voice Wake tuvo éxito (por ejemplo, "clawd", "claude")
- [ ] Al decir la palabra de activación, se activa el asistente de IA
- [ ] La superposición de Talk Mode se puede abrir y cerrar normalmente
- [ ] La reproducción TTS es clara (se necesita clave de API de ElevenLabs)
- [ ] La función de interrupción por voz funciona correctamente (detener reproducción al hablar)

### Modo de nodo y Exec Approvals

- [ ] El servicio de nodo se inicia automáticamente en modo remoto
- [ ] Los comandos `system.run` se pueden ejecutar y devolver resultados
- [ ] El diálogo de Exec Approvals aparece normalmente
- [ ] "Always Allow" se puede agregar correctamente a la lista blanca
- [ ] "Deny" puede denegar correctamente la ejecución del comando

### Funciones avanzadas

- [ ] Los enlaces profundos se pueden activar desde la terminal u otras aplicaciones
- [ ] La interfaz de configuración puede guardar la configuración correctamente
- [ ] La ventana integrada WebChat se puede abrir normalmente
- [ ] La ventana Canvas puede mostrar contenido visual generado por IA

---

## Advertencias sobre problemas comunes

### ❌ Permisos denegados o no otorgados

**Problema**:
- Voice Wake no puede escuchar el micrófono
- Canvas no puede mostrar contenido
- La ejecución de comandos `system.run` falla

**Solución**:
1. Abre **Configuración del sistema** → **Privacidad y seguridad**
2. Busca **Clawdbot** o **Clawdbot.app**
3. Asegúrate de que los permisos de **Micrófono**, **Accesibilidad**, **Grabación de pantalla**, **Automatización** estén habilitados
4. Reinicia la aplicación Clawdbot

::: tip Solución de problemas de permisos TCC
Si el interruptor de permisos no se puede habilitar o se cierra inmediatamente:
- Verifica si hay herramientas de seguridad habilitadas (como Little Snitch)
- Intenta desinstalar completamente la aplicación y volver a instalar
- Revisa los registros de denegación de TCC en Console.app
:::

### ❌ Fallo de conexión a Gateway

**Problema**:
- El icono de la barra de menús muestra rojo (estado desconectado)
- La tarjeta de estado muestra "Connection Failed"
- WebChat no se puede abrir

**Causas posibles y soluciones**:

| Causa | Método de verificación | Solución |
|--- | --- | ---|
| Gateway no iniciado | Ejecutar `clawdbot gateway status` | Iniciar el servicio Gateway |
| Dirección incorrecta | Verificar la URL de WebSocket | Confirmar que `ws://127.0.0.1:18789` o la dirección remota es correcta |
| Puerto ocupado | Ejecutar `lsof -i :18789` | Cerrar el proceso que ocupa el puerto |
| Falla de autenticación | Verificar Token/Password | Confirmar que las credenciales de autenticación son correctas |

### ❌ Talk Mode no funciona

**Problema**:
- No hay respuesta al habilitar Talk Mode
- TTS no se puede reproducir
- El micrófono no puede recibir entrada

**Solución**:

1. **Verificar configuración de ElevenLabs**:
   - Confirmar que la clave de API está configurada
   - Probar si la clave es válida: visita la consola de ElevenLabs

2. **Verificar conexión de red**:
   - TTS requiere conexión a Internet
   - Verificar si el firewall bloquea las solicitudes de API

3. **Verificar salida de audio**:
   - Confirmar que el volumen del sistema está encendido
   - Verificar que el dispositivo de salida predeterminado sea correcto

### ❌ El nodo no se puede conectar en modo remoto

**Problema**:
- El Gateway remoto no puede invocar comandos como `system.run` en macOS
- Los registros de error muestran "Node not found" o "Node offline"

**Solución**:

1. **Confirmar que el servicio de nodo se está ejecutando**:
   ```bash
   clawdbot nodes list
   # Deberías ver el nodo macOS mostrado como "paired"
   ```

2. **Verificar el túnel SSH**:
   - Ver el estado de conexión SSH en la configuración de la app macOS
   - Confirmar que puedes hacer SSH manualmente al Gateway remoto

3. **Reiniciar el servicio de nodo**:
   ```bash
   # En macOS
   clawdbot node restart
   ```

---

## Resumen de esta lección

En esta lección aprendiste:

1. ✅ **Arquitectura de la app macOS** —— Doble rol como plano de control de Gateway y nodo
2. ✅ **Modo local vs remoto** —— Cómo configurar para diferentes escenarios de despliegue
3. ✅ **Funciones de barra de menús** —— Gestión de estado, WebChat, Canvas, configuración, acceso rápido
4. ✅ **Voice Wake** —— Activar el asistente de IA mediante palabras de activación
5. ✅ **Talk Mode** —— Experiencia de conversación por voz continua
6. ✅ **Modo de nodo** —— Exponer capacidades específicas de macOS (`system.run`, Canvas, Camera)
7. ✅ **Exec Approvals** —— Mecanismo de control de seguridad de tres capas para `system.run`
8. ✅ **Enlaces profundos (Deep Links)** —— Protocolo `clawdbot://` para activación rápida de funciones

**Mejores prácticas**:
- 🚀 Despliegue local: usar el modo Local predeterminado
- 🌐 Despliegue remoto: configurar SSH/Tailscale para gestión centralizada
- 🔐 Seguridad primero: configurar políticas de lista blanca razonables para `system.run`
- 🎙️ Interacción por voz: combinar con ElevenLabs para obtener la mejor experiencia TTS

---

## Próximo curso

> En el próximo curso aprenderemos **[nodo iOS](../ios-node/)**.
>
> Aprenderás:
> - Cómo configurar el nodo iOS para conectarse a Gateway
> - Funciones del nodo iOS (Canvas, Camera, Location, Voice Wake)
> - Cómo emparejar dispositivos iOS a través de Gateway
> - Gestión de permisos y control de seguridad del nodo iOS
> - Descubrimiento Bonjour y conexión remota Tailscale

---

## Apéndice: referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-27

| Función        | Ruta del archivo                                                                                    | Número de líneas    |
|--- | --- | ---|
| Punto de entrada de la aplicación     | [`apps/macos/Sources/Clawdbot/ClawdbotApp.swift`](https://github.com/moltbot/moltbot/blob/main/apps/macos/Sources/Clawdbot/ClawdbotApp.swift) | Archivo completo   |
| Conexión a Gateway | [`apps/macos/Sources/Clawdbot/GatewayConnection.swift`](https://github.com/moltbot/moltbot/blob/main/apps/macos/Sources/Clawdbot/GatewayConnection.swift) | 1-500   |
| Runtime de Voice Wake | [`apps/macos/Sources/Clawdbot/VoiceWakeRuntime.swift`](https://github.com/moltbot/moltbot/blob/main/apps/macos/Sources/Clawdbot/VoiceWakeRuntime.swift) | Archivo completo   |
| Tipos de Talk Mode | [`apps/macos/Sources/Clawdbot/TalkModeTypes.swift`](https://github.com/moltbot/moltbot/blob/main/apps/macos/Sources/Clawdbot/TalkModeTypes.swift) | Archivo completo   |
| Superposición de Voice Wake | [`apps/macos/Sources/Clawdbot/VoiceWakeOverlayView.swift`](https://github.com/moltbot/moltbot/blob/main/apps/macos/Sources/Clawdbot/VoiceWakeOverlayView.swift) | Archivo completo   |
| Coordinador de modo de nodo | [`apps/macos/Sources/Clawdbot/NodeMode/MacNodeModeCoordinator.swift`](https://github.com/moltbot/moltbot/blob/main/apps/macos/Sources/Clawdbot/NodeMode/MacNodeModeCoordinator.swift) | Archivo completo   |
| Runtime de nodo | [`apps/macos/Sources/Clawdbot/NodeMode/MacNodeRuntime.swift`](https://github.com/moltbot/moltbot/blob/main/apps/macos/Sources/Clawdbot/NodeMode/MacNodeRuntime.swift) | Archivo completo   |
| Gestor de permisos | [`apps/macos/Sources/Clawdbot/PermissionManager.swift`](https://github.com/moltbot/moltbot/blob/main/apps/macos/Sources/Clawdbot/PermissionManager.swift) | Archivo completo   |
| Exec Approvals | [`apps/macos/Sources/Clawdbot/ExecApprovalsGatewayPrompter.swift`](https://github.com/moltbot/moltbot/blob/main/apps/macos/Sources/Clawdbot/ExecApprovalsGatewayPrompter.swift) | Archivo completo   |
| Barra de menús | [`apps/macos/Sources/Clawdbot/MenuBar.swift`](https://github.com/moltbot/moltbot/blob/main/apps/macos/Sources/Clawdbot/MenuBar.swift) | Archivo completo   |
| Inyector de menú | [`apps/macos/Sources/Clawdbot/MenuSessionsInjector.swift`](https://github.com/moltbot/moltbot/blob/main/apps/macos/Sources/Clawdbot/MenuSessionsInjector.swift) | Archivo completo   |

**Constantes clave**:
- `GatewayConnection.shared`: gestor de conexión a Gateway singleton (`GatewayConnection.swift:48`)
- `VoiceWakeRuntime`: runtime central de Voice Wake (singleton)
- `MacNodeModeCoordinator`: coordinador de modo de nodo, gestiona el inicio de servicios locales

**Tipos clave**:
- `GatewayAgentChannel`: enumeración de canales de agente de Gateway (`GatewayConnection.swift:9-30`)
- `GatewayAgentInvocation`: estructura de invocación de agente de Gateway (`GatewayConnection.swift:32-41`)
- `ExecApprovalsConfig`: estructura de configuración de Exec Approvals (JSON Schema)
- `VoiceWakeSettings`: estructura de configuración de Voice Wake

**Funciones clave**:
- `GatewayConnection.sendAgent()`: enviar solicitud de agente a Gateway
- `GatewayConnection.setVoiceWakeTriggers()`: actualizar la lista global de palabras de activación
- `PermissionManager.checkPermission()`: verificar el estado de permisos TCC
- `ExecApprovalsGatewayPrompter.prompt()`: mostrar diálogo de aprobación

**Ubicación de documentos**:
- [Documentación de la app macOS](https://github.com/moltbot/moltbot/blob/main/docs/platforms/macos.md)
- [Documentación de Voice Wake](https://github.com/moltbot/moltbot/blob/main/docs/nodes/voicewake.md)
- [Documentación de Talk Mode](https://github.com/moltbot/moltbot/blob/main/docs/nodes/talk.md)
- [Documentación de nodos](https://github.com/moltbot/moltbot/blob/main/docs/nodes/index.md)

</details>
