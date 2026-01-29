---
title: "Interfaz visual Canvas y A2UI | Tutorial de Clawdbot"
sidebarTitle: "Crear interfaces visuales para IA"
subtitle: "Interfaz visual Canvas y A2UI"
description: "Aprenda a usar la interfaz visual Canvas de Clawdbot, comprenda el mecanismo de envío A2UI, la configuración de Canvas Host y las operaciones de Canvas en nodos, y cree interfaces interactivas para asistentes de IA. Este tutorial cubre dos métodos: HTML estático y A2UI dinámico, incluyendo la referencia completa de comandos de la herramienta canvas, mecanismos de seguridad, opciones de configuración y consejos para solución de problemas."
tags:
  - "Canvas"
  - "A2UI"
  - "Interfaz visual"
  - "Nodos"
prerequisite:
  - "start-getting-started"
  - "platforms-ios-node"
  - "platforms-android-node"
order: 240
---

# Interfaz visual Canvas y A2UI

## Qué podrás hacer al completar esta lección

Al completar esta lección, podrás:

- Configurar Canvas Host e implementar interfaces personalizadas de HTML/CSS/JS
- Usar la herramienta `canvas` para controlar Canvas en nodos (mostrar, ocultar, navegar, ejecutar JS)
- Dominar el protocolo A2UI para que la IA envíe actualizaciones de UI dinámicamente
- Capturar capturas de pantalla de Canvas para el contexto de la IA
- Entender los mecanismos de seguridad y control de acceso de Canvas

## Tu situación actual

Tienes un asistente de IA, pero solo puede interactuar contigo a través de texto. Quieres:

- Que la IA muestre interfaces visuales, como tablas, gráficos, formularios
- Ver interfaces dinámicas generadas por Agentes en dispositivos móviles
- Crear una experiencia interactiva tipo "aplicación" sin desarrollar independientemente

## Cuándo usar esta técnica

**Canvas + A2UI es adecuado para estos escenarios**:

| Escenario | Ejemplo |
| ------ | ------ |
| **Visualización de datos** | Mostrar gráficos estadísticos, barras de progreso, líneas de tiempo |
| **Formularios interactivos** | Pedir al usuario que confirme acciones, seleccione opciones |
| **Paneles de estado** | Mostrar el progreso de tareas en tiempo real, estado del sistema |
| **Juegos y entretenimiento** | Mini juegos simples, demostraciones interactivas |

::: tip A2UI vs. HTML estático
- **A2UI**(Agent-to-UI): La IA genera y actualiza la UI dinámicamente, adecuado para datos en tiempo real
- **HTML estático**: Interfaces predefinidas, adecuado para diseños fijos e interacciones complejas
:::

## 🎒 Preparativos

Antes de comenzar, asegúrate de haber completado:

- [ ] **Gateway iniciado**: Canvas Host se inicia automáticamente con Gateway por defecto (puerto 18793)
- [ ] **Nodos emparejados**: Nodos macOS/iOS/Android conectados a Gateway
- [ ] **Nodos compatibles con Canvas**: Confirma que el nodo tiene capacidad `canvas` (`clawdbot nodes list`)

::: warning Conocimientos previos
Este tutorial asume que ya conoces:
- [Emparejamiento básico de nodos](../../platforms/android-node/)
- [Mecanismo de llamadas a herramientas de IA](../tools-browser/)
:::

## Conceptos clave

El sistema Canvas incluye tres componentes principales:

```
┌─────────────────┐
│   Canvas Host  │ ────▶ Servidor HTTP (puerto 18793)
│   (Gateway)   │        └── Sirve archivos ~/clawd/canvas/
└─────────────────┘
        │
        │ Comunicación WebSocket
        │
┌─────────────────┐
│    Node App   │ ────▶ WKWebView renderiza Canvas
│ (iOS/Android) │        └── Recibe envíos vía A2UI
└─────────────────┘
        │
        │ Eventos userAction
        │
┌─────────────────┐
│   AI Agent    │ ────▶ Llamadas a herramienta canvas
│  (pi-mono)   │        └── Envía actualizaciones A2UI
└─────────────────┘
```

**Conceptos clave**:

1. **Canvas Host**(lado Gateway)
   - Proporciona servicio de archivos estáticos: `http://<gateway-host>:18793/__clawdbot__/canvas/`
   - Aloja host A2UI: `http://<gateway-host>:18793/__clawdbot__/a2ui/`
   - Soporta recarga en caliente: actualización automática después de modificar archivos

2. **Canvas Panel**(lado nodo)
   - Nodos macOS/iOS/Android incrustan WKWebView
   - Conectan a Gateway vía WebSocket (recarga en tiempo real, comunicación A2UI)
   - Soportan `eval` para ejecutar JS, `snapshot` para capturar pantalla

3. **Protocolo A2UI**(v0.8)
   - El Agente envía actualizaciones de UI vía WebSocket
   - Soporta: `beginRendering`, `surfaceUpdate`, `dataModelUpdate`, `deleteSurface`

## Sigue los pasos

### Paso 1: Verificar el estado de Canvas Host

**Por qué**
Asegura que Canvas Host esté ejecutándose para que los nodos puedan cargar contenido Canvas.

```bash
# Verificar si el puerto 18793 está en escucha
lsof -i :18793
```

**Deberías ver**:

```text
COMMAND   PID   USER   FD   TYPE   DEVICE SIZE/OFF NODE NAME
node     12345  user   16u  IPv6  0x1234      0t0  TCP *:18793 (LISTEN)
```

::: info Rutas de configuración
- **Directorio raíz Canvas**: `~/clawd/canvas/`(modificable por `canvasHost.root`)
- **Puerto**: `18793` = `gateway.port + 4`(modificable por `canvasHost.port`)
- **Recarga en caliente**: Habilitado por defecto(deshabilitable por `canvasHost.liveReload: false`)
:::

### Paso 2: Crear la primera página Canvas

**Por qué**
Crear una interfaz HTML personalizada para mostrar tu contenido en el nodo.

```bash
# Crear directorio raíz Canvas (si no existe)
mkdir -p ~/clawd/canvas

# Crear archivo HTML simple
cat > ~/clawd/canvas/hello.html <<'EOF'
<!doctype html>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Hello Canvas</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    padding: 20px;
    background: #000;
    color: #fff;
    text-align: center;
  }
  h1 { color: #24e08a; }
</style>
<h1>🎉 Hello from Canvas!</h1>
<p>Esta es tu primera página Canvas.</p>
<button onclick="alert('¡Botón clickeado!')">Haz clic aquí</button>
EOF
```

**Deberías ver**:

```text
Archivo creado: ~/clawd/canvas/hello.html
```

### Paso 3: Mostrar Canvas en el nodo

**Por qué**
Hacer que el nodo cargue y muestre la página que acabas de crear.

Primero encuentra tu ID de nodo:

```bash
clawdbot nodes list
```

**Deberías ver**:

```text
ID                                  Name          Type       Capabilities
──────────────────────────────────────────────────────────────────────────
abc123-def456-ghi789               iOS Phone     canvas, camera, screen
jkl012-mno345-pqr678               Android Tab   canvas, camera
```

Luego muestra el Canvas (usando el nodo iOS como ejemplo):

```bash
# Método 1: Vía comando CLI
clawdbot nodes canvas present --node abc123-def456-ghi789 --target http://127.0.0.1:18793/__clawdbot__/canvas/hello.html
```

**Deberías ver**:

- Un panel sin bordes emerge en el dispositivo iOS mostrando tu contenido HTML
- El panel aparece cerca de la barra de menús o posición del mouse
- El contenido está centrado con un título verde y un botón

**Ejemplo de llamada de IA**:

```
IA: He abierto un panel Canvas en tu dispositivo iOS mostrando la página de bienvenida.
```

::: tip Formato de URL Canvas
- **Archivo local**: `http://<gateway-host>:18793/__clawdbot__/canvas/hello.html`
- **URL externa**: `https://example.com`(requiere permisos de red del nodo)
- **Volver a predeterminado**: `/` o cadena vacía, muestra la página de andamiaje integrada
:::

### Paso 4: Usar A2UI para enviar UI dinámica

**Por qué**
La IA puede enviar actualizaciones de UI directamente a Canvas sin modificar archivos, adecuado para datos en tiempo real e interacción.

**Método A: Envío rápido de texto**

```bash
clawdbot nodes canvas a2ui push --node abc123-def456-ghi789 --text "Hello from A2UI"
```

**Deberías ver**:

- Canvas muestra interfaz A2UI azul
- Texto centrado mostrando: `Hello from A2UI`

**Método B: Envío completo JSONL**

Crea archivo de definición A2UI:

```bash
cat > /tmp/a2ui-demo.jsonl <<'EOF'
{"surfaceUpdate":{"surfaceId":"main","components":[{"id":"root","component":{"Column":{"children":{"explicitList":["title","status","button"]}}}},{"id":"title","component":{"Text":{"text":{"literalString":"Demo A2UI"},"usageHint":"h1"}}},{"id":"status","component":{"Text":{"text":{"literalString":"Estado del sistema: Ejecutando"},"usageHint":"body"}}},{"id":"button","component":{"Button":{"label":{"literalString":"Botón de prueba"},"onClick":{"action":{"name":"testAction","sourceComponentId":"demo.test"}}}}}]}
{"beginRendering":{"surfaceId":"main","root":"root"}}
EOF
```

Envía A2UI:

```bash
clawdbot nodes canvas a2ui push --node abc123-def456-ghi789 --jsonl /tmp/a2ui-demo.jsonl
```

**Deberías ver**:

```
┌────────────────────────────┐
│     Demo A2UI         │
│                        │
│  Estado del sistema: Ejecutando  │
│                        │
│   [ Botón de prueba ]          │
└────────────────────────────┘
```

::: details Explicación del formato JSONL A2UI
JSONL (JSON Lines) contiene un objeto JSON por línea, adecuado para actualizaciones en streaming:

```jsonl
{"surfaceUpdate":{...}}   // Actualizar componentes de superficie
{"beginRendering":{...}}   // Iniciar renderizado
{"dataModelUpdate":{...}} // Actualizar modelo de datos
{"deleteSurface":{...}}   // Eliminar superficie
```
:::

### Paso 5: Ejecutar JavaScript de Canvas

**Por qué**
Ejecutar JS personalizado en Canvas, como modificar DOM, leer estado.

```bash
clawdbot nodes canvas eval --node abc123-def456-ghi789 --js "document.title"
```

**Deberías ver**:

```text
"Hello from Canvas"
```

::: tip Ejemplos de ejecución JS
- Leer elemento: `document.querySelector('h1').textContent`
- Modificar estilo: `document.body.style.background = '#333'`
- Calcular valor: `innerWidth + 'x' + innerHeight`
- Ejecutar cierre: `(() => { ... })()`
:::

### Paso 6: Capturar captura de pantalla de Canvas

**Por qué**
Permitir que la IA vea el estado actual de Canvas para comprensión de contexto.

```bash
# Formato por defecto (JPEG)
clawdbot nodes canvas snapshot --node abc123-def456-ghi789

# Formato PNG + límite de ancho máximo
clawdbot nodes canvas snapshot --node abc123-def456-ghi789 --format png --max-width 1200

# JPEG de alta calidad
clawdbot nodes canvas snapshot --node abc123-def456-ghi789 --format jpg --quality 0.9
```

**Deberías ver**:

```text
Canvas snapshot saved to: /var/folders/.../canvas-snapshot.jpg
```

La ruta del archivo se genera automáticamente por el sistema, usualmente en el directorio temporal.

### Paso 7: Ocultar Canvas

**Por qué**
Cerrar el panel Canvas para liberar espacio en pantalla.

```bash
clawdbot nodes canvas hide --node abc123-def456-ghi789
```

**Deberías ver**:

- El panel Canvas en el dispositivo iOS desaparece
- El estado del nodo se recupera (si estaba ocupado anteriormente)

## Punto de control ✅

**Verificar que las funciones de Canvas funcionen correctamente**:

| Elemento de verificación | Método de verificación |
| ------- | -------- |
| Canvas Host ejecutándose | `lsof -i :18793` tiene salida |
| Capacidad de nodo Canvas | `clawdbot nodes list` muestra `canvas` |
| Página cargada con éxito | El nodo muestra contenido HTML |
| Envío A2UI exitoso | Canvas muestra interfaz A2UI azul |
| Ejecución JS devuelve resultado | El comando `eval` devuelve valor |
| Captura de pantalla generada | El directorio temporal tiene archivo `.jpg` o `.png` |

## Advertencias

::: warning Limitaciones primer plano/fondo
- **Nodos iOS/Android**: Los comandos `canvas.*` y `camera.*` **deben ejecutarse en primer plano**
- Las llamadas en segundo plano devolverán: `NODE_BACKGROUND_UNAVAILABLE`
- Solución: Despertar el dispositivo al primer plano
:::

::: danger Precauciones de seguridad
- **Protección contra recorrido de directorio**: Las URL de Canvas prohíben `..` para acceder a directorios superiores
- **Scheme personalizado**: `clawdbot-canvas://` limitado solo a uso interno del nodo
- **Restricciones HTTPS**: Las URL HTTPS externas requieren permisos de red del nodo
- **Acceso a archivos**: Canvas Host solo permite acceder a archivos bajo `canvasHost.root`
:::

::: tip Consejos de depuración
- **Ver registros de Gateway**: `clawdbot gateway logs`
- **Ver registros de nodo**: iOS Configuración → Debug Logs, Registros dentro de la aplicación Android
- **Probar URL**: Acceda directamente en el navegador a `http://<gateway-host>:18793/__clawdbot__/canvas/`
:::

## Resumen de la lección

En esta lección aprendiste:

1. **Arquitectura Canvas**: Entender la relación entre Canvas Host, Node App y protocolo A2UI
2. **Configurar Canvas Host**: Ajustar directorio raíz, puerto y configuración de recarga en caliente
3. **Crear páginas personalizadas**: Escribir HTML/CSS/JS e implementar en nodos
4. **Usar A2UI**: Enviar actualizaciones de UI dinámica vía JSONL
5. **Ejecutar JavaScript**: Ejecutar código en Canvas, leer y modificar estado
6. **Capturar capturas de pantalla**: Permitir que la IA vea el estado actual de Canvas

**Puntos clave**:

- Canvas Host se inicia automáticamente con Gateway, no requiere configuración adicional
- A2UI es adecuado para datos en tiempo real, HTML estático para interacciones complejas
- Los nodos deben estar en primer plano para ejecutar operaciones Canvas
- Usar `canvas snapshot` para pasar el estado de UI a la IA

## Próxima lección

> En la próxima lección aprenderemos **[Despertar por voz y texto a voz](../voice-tts/)**.
>
> Aprenderás:
> - Configurar palabras clave de despertar Voice Wake
> - Usar Talk Mode para conversaciones de voz continuas
> - Integrar múltiples proveedores TTS (Edge, Deepgram, ElevenLabs)

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-27

| Función | Ruta de archivo | Número de línea |
| ----- | --------- | ---- |
| Servidor Canvas Host | [`src/canvas-host/server.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/canvas-host/server.ts) | 372-441 |
| Procesamiento de protocolo A2UI | [`src/canvas-host/a2ui.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/canvas-host/a2ui.ts) | 150-203 |
| Definición de herramienta Canvas | [`src/agents/tools/canvas-tool.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/canvas-tool.ts) | 52-179 |
| Constantes de ruta Canvas | [`src/canvas-host/a2ui.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/canvas-host/a2ui.ts) | 8-10 |

**Constantes clave**:
- `A2UI_PATH = "/__clawdbot__/a2ui"`: Ruta del host A2UI
- `CANVAS_HOST_PATH = "/__clawdbot__/canvas"`: Ruta de archivos Canvas
- `CANVAS_WS_PATH = "/__clawdbot__/ws"`: Ruta de recarga en caliente WebSocket

**Funciones clave**:
- `createCanvasHost()`: Iniciar servidor HTTP Canvas (puerto 18793)
- `injectCanvasLiveReload()`: Inyectar script de recarga en caliente WebSocket en HTML
- `handleA2uiHttpRequest()`: Manejar solicitudes de recursos A2UI
- `createCanvasTool()`: Registrar herramienta `canvas` (present/hide/navigate/eval/snapshot/a2ui_push/a2ui_reset)

**Acciones Canvas compatibles**:
- `present`: Mostrar Canvas (URL, posición, tamaño opcionales)
- `hide`: Ocultar Canvas
- `navigate`: Navegar a URL (ruta local/HTTP/file://)
- `eval`: Ejecutar JavaScript
- `snapshot`: Capturar captura de pantalla (PNG/JPEG, maxWidth/quality opcionales)
- `a2ui_push`: Enviar actualizaciones A2UI (JSONL o texto)
- `a2ui_reset`: Restablecer estado A2UI

**Schema de configuración**:
- `canvasHost.root`: Directorio raíz Canvas (predeterminado `~/clawd/canvas`)
- `canvasHost.port`: Puerto HTTP (predeterminado 18793)
- `canvasHost.liveReload`: Habilitar recarga en caliente (predeterminado true)
- `canvasHost.enabled`: Habilitar Canvas Host (predeterminado true)

**Mensajes compatibles con A2UI v0.8**:
- `beginRendering`: Iniciar renderizado de superficie específica
- `surfaceUpdate`: Actualizar componentes de superficie (Column, Text, Button, etc.)
- `dataModelUpdate`: Actualizar modelo de datos
- `deleteSurface`: Eliminar superficie específica

</details>
