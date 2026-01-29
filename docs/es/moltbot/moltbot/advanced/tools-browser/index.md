---
title: "Herramientas de Automatización del Navegador: Control Web y Automatización de UI | Tutorial de Clawdbot"
sidebarTitle: "Control del Navegador en 5 Minutos"
subtitle: "Herramientas de Automatización del Navegador: Control Web y Automatización de UI | Tutorial de Clawdbot"
description: "Aprende a usar las herramientas del navegador de Clawdbot para automatización web, capturas de pantalla, manipulación de formularios y control de UI. Este tutorial cubre el inicio del navegador, instantáneas de página, interacción UI (click/type/drag, etc.), carga de archivos, manejo de diálogos y control remoto del navegador. Domina el flujo de trabajo completo, incluyendo el modo de retransmisión de extensiones de Chrome y configuración de navegador independiente, así como la ejecución de operaciones del navegador en nodos iOS/Android."
tags:
  - "browser"
  - "automation"
  - "ui"
prerequisite:
  - "start-gateway-startup"
  - "advanced-models-auth"
order: 210
---

# Herramientas de Automatización del Navegador: Control Web y Automatización de UI

## Lo que podrás hacer al terminar

- Iniciar y controlar navegadores gestionados por Clawdbot
- Usar la retransmisión de extensiones de Chrome para tomar control de tus pestañas de Chrome existentes
- Capturar instantáneas de página (formato AI/ARIA) y capturas de pantalla (PNG/JPEG)
- Ejecutar operaciones de automatización de UI: clic, escribir texto, arrastrar, seleccionar, completar formularios
- Manejar carga de archivos y diálogos (alert/confirm/prompt)
- Operar navegadores distribuidos a través del servidor de control remoto del navegador
- Ejecutar operaciones del navegador en dispositivos iOS/Android usando el proxy del nodo

## Tu situación actual

Ya has ejecutado Gateway y configurado los modelos de IA, pero todavía tienes dudas sobre el uso de las herramientas del navegador:

- ¿La IA no puede acceder al contenido de la página web y debes describir la estructura de la página?
- ¿Quieres que la IA complete automáticamente formularios y haga clic en botones, pero no sabes cómo hacerlo?
- ¿Quieres tomar capturas de pantalla o guardar páginas web, pero necesitas hacerlo manualmente cada vez?
- ¿Quieres usar tus propias pestañas de Chrome (con sesión iniciada) en lugar de iniciar un navegador nuevo?
- ¿Quieres ejecutar operaciones del navegador en dispositivos remotos como nodos iOS/Android?

## Cuándo usar esto

**Escenarios de uso de herramientas del navegador**:

| Escenario | Action | Ejemplo |
|--- | --- | ---|
| Automatización de formularios | `act` + `fill` | Completar formularios de registro, enviar pedidos |
| Web scraping | `snapshot` | Extraer estructura de página, recolectar datos |
| Guardar capturas de pantalla | `screenshot` | Guardar capturas de pantalla de páginas, guardar evidencia |
| Carga de archivos | `upload` | Subir currículum, subir archivos adjuntos |
| Manejo de diálogos | `dialog` | Aceptar/rechazar alert/confirm |
| Usar sesión existente | `profile="chrome"` | Operar en pestañas de Chrome con sesión iniciada |
| Control remoto | `target="node"` | Ejecutar en nodos iOS/Android |

## 🎒 Preparativos antes de empezar

::: warning Verificación previa

Antes de usar las herramientas del navegador, asegúrate de:

1. ✅ Gateway está iniciado (`clawdbot gateway start`)
2. ✅ Los modelos de IA están configurados (Anthropic / OpenAI / OpenRouter, etc.)
3. ✅ Las herramientas del navegador están habilitadas (`browser.enabled=true`)
4. ✅ Entiendes el target que vas a usar (sandbox/host/custom/node)
5. ✅ Si usas la retransmisión de extensiones de Chrome, has instalado y habilitado la extensión

:::

## Concepto central

**¿Qué son las herramientas del navegador?**

Las herramientas del navegador son herramientas de automatización integradas en Clawdbot que permiten a la IA controlar navegadores a través de CDP (Chrome DevTools Protocol):

- **Servidor de control**: `http://127.0.0.1:18791` (predeterminado)
- **Automatización de UI**: Localización y manipulación de elementos basada en Playwright
- **Mecanismo de instantáneas**: Formato AI o ARIA, devuelve la estructura de la página y referencias de elementos
- **Soporte multi-target**: sandbox (predeterminado), host (retransmisión de Chrome), custom (remoto), node (nodo de dispositivo)

**Dos modos de navegador**:

| Modo | Profile | Controlador | Descripción |
|--- | --- | --- | ---|
| **Navegador independiente** | `clawd` (predeterminado) | clawd | Clawdbot inicia una instancia independiente de Chrome/Chromium |
| **Retransmisión de Chrome** | `chrome` | extension | Toma el control de tus pestañas de Chrome existentes (requiere instalar extensión) |

**Flujo de trabajo**:

```
1. Iniciar navegador (start)
   ↓
2. Abrir pestaña (open)
   ↓
3. Obtener instantánea de página (snapshot) → obtener referencias de elementos (ref)
   ↓
4. Ejecutar operaciones UI (act: click/type/fill/drag)
   ↓
5. Verificar resultados (screenshot/snapshot)
```

## Sigue los pasos

### Paso 1: Iniciar el navegador

**Por qué**

La primera vez que uses las herramientas del navegador, necesitas iniciar el servidor de control del navegador.

```bash
# En el chat, dile a la IA que inicie el navegador
Por favor, inicia el navegador

# O usa la herramienta del navegador
action: start
profile: clawd  # o chrome (retransmisión de extensiones de Chrome)
target: sandbox
```

**Deberías ver**:

```
✓ Browser control server: http://127.0.0.1:18791
✓ Profile: clawd
✓ CDP endpoint: http://127.0.0.1:18792
✓ Headless: false
✓ Color: #FF4500
```

::: tip Punto de verificación

- Ver `Browser control server` indica que se inició correctamente
- Por defecto usa el profile `clawd` (navegador independiente)
- Si necesitas usar la retransmisión de extensiones de Chrome, usa `profile="chrome"`
- La ventana del navegador se abrirá automáticamente (modo no headless)

:::

### Paso 2: Abrir página web

**Por qué**

Abre la página web objetivo para preparar la automatización.

```bash
# En el chat
Por favor, abre https://example.com

# O usa la herramienta del navegador
action: open
targetUrl: https://example.com
profile: clawd
target: sandbox
```

**Deberías ver**:

```
✓ Tab opened: https://example.com
targetId: tab_abc123
url: https://example.com
```

::: tip Referencia de elemento (targetId)

Cada vez que abras o enfoques una pestaña, se devolverá un `targetId`, este ID se usa para operaciones posteriores (snapshot/act/screenshot).

:::

### Paso 3: Obtener instantánea de página

**Por qué**

La instantánea permite a la IA entender la estructura de la página y devuelve referencias de elementos operables (ref).

```bash
# Obtener instantánea en formato AI (predeterminado)
action: snapshot
profile: clawd
targetId: tab_abc123
snapshotFormat: ai
refs: aria  # Usa Playwright aria-ref ids (estable entre llamadas)

# O obtener instantánea en formato ARIA (salida estructurada)
action: snapshot
profile: clawd
targetId: tab_abc123
snapshotFormat: aria
```

**Deberías ver** (formato AI):

```
Page snapshot:

[header]
  Logo [aria-label="Example Logo"]
  Navigation [role="navigation"]
    Home [href="/"] [ref="e1"]
    About [href="/about"] [ref="e2"]
    Contact [href="/contact"] [ref="e3"]

[main]
  Hero section
    Title: "Welcome to Example" [ref="e4"]
    Button: "Get Started" [ref="e5"] [type="primary"]

[form section]
  Login form
    Input: Email [type="email"] [ref="e6"]
    Input: Password [type="password"] [ref="e7"]
    Button: "Sign In" [ref="e8"]
```

::: tip Elección de formato de instantánea

| Formato | Uso | Características |
|--- | --- | ---|
| `ai` | Predeterminado, para IA | Buena legibilidad, adecuado para análisis de IA |
| `aria` | Salida estructurada | Adecuado para escenarios que requieren estructura precisa |
| `refs="aria"` | Estable entre llamadas | Recomendado para operaciones multipaso (snapshot → act) |

:::

### Paso 4: Ejecutar operaciones UI (act)

**Por qué**

Usa las referencias de elementos (ref) devueltas en la instantánea para ejecutar operaciones de automatización.

```bash
# Hacer clic en botón
action: act
request: {
  kind: "click",
  ref: "e5",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# Escribir texto
action: act
request: {
  kind: "type",
  ref: "e6",
  text: "user@example.com",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# Completar formulario (múltiples campos)
action: act
request: {
  kind: "fill",
  fields: [
    { ref: "e6", value: "user@example.com" },
    { ref: "e7", value: "password123" }
  ],
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# Hacer clic en botón de envío
action: act
request: {
  kind: "click",
  ref: "e8",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox
```

**Deberías ver**:

```
✓ Clicked ref=e5
✓ Typed "user@example.com" into ref=e6
✓ Typed "password123" into ref=e7
✓ Clicked ref=e8
✓ Form submitted successfully
```

::: tip Operaciones UI comunes

| Operación | Kind | Parámetros |
|--- | --- | ---|
| Clic | `click` | `ref`, `doubleClick`, `button`, `modifiers` |
| Escribir texto | `type` | `ref`, `text`, `submit`, `slowly` |
| Presionar tecla | `press` | `key`, `targetId` |
| Pasar el ratón | `hover` | `ref`, `targetId` |
| Arrastrar | `drag` | `startRef`, `endRef`, `targetId` |
| Seleccionar | `select` | `ref`, `values` |
| Completar formulario | `fill` | `fields` (array) |
| Esperar | `wait` | `timeMs`, `text`, `textGone`, `selector` |
| Ejecutar JS | `evaluate` | `fn`, `ref`, `targetId` |

:::

### Paso 5: Capturar captura de pantalla de página web

**Por qué**

Verificar resultados de operaciones o guardar capturas de pantalla de páginas web.

```bash
# Capturar pestaña actual
action: screenshot
profile: clawd
targetId: tab_abc123
type: png

# Capturar página completa
action: screenshot
profile: clawd
targetId: tab_abc123
fullPage: true
type: png

# Capturar elemento específico
action: screenshot
profile: clawd
targetId: tab_abc123
ref: "e4"  # Usa ref de la instantánea
type: jpeg
```

**Deberías ver**:

```
📸 Screenshot saved: ~/.clawdbot/media/browser-screenshot-12345.png
```

::: tip Formatos de captura de pantalla

| Formato | Uso |
|--- | ---|
| `png` | Predeterminado, compresión sin pérdida, adecuado para documentos |
| `jpeg` | Compresión con pérdida, archivos más pequeños, adecuado para almacenamiento |

:::

### Paso 6: Manejar carga de archivos

**Por qué**

Automatizar operaciones de carga de archivos en formularios.

```bash
# Primero activa el selector de archivos (clic en botón de carga)
action: act
request: {
  kind: "click",
  ref: "upload_button"
}
profile: clawd
targetId: tab_abc123

# Luego carga archivos
action: upload
paths:
  - "/Users/you/Documents/resume.pdf"
  - "/Users/you/Documents/photo.jpg"
ref: "upload_button"  # Opcional: especificar ref del selector de archivos
targetId: tab_abc123
profile: clawd
```

**Deberías ver**:

```
✓ Files uploaded: 2
  - /Users/you/Documents/resume.pdf
  - /Users/you/Documents/photo.jpg
```

::: warning Nota sobre rutas de archivos

- Usa rutas absolutas, no se soportan rutas relativas
- Asegúrate de que los archivos existan y tengan permisos de lectura
- Múltiples archivos se cargan en el orden del array

:::

### Paso 7: Manejar diálogos

**Por qué**

Manejar automáticamente diálogos alert, confirm, prompt en páginas web.

```bash
# Aceptar diálogo (alert/confirm)
action: dialog
accept: true
targetId: tab_abc123
profile: clawd

# Rechazar diálogo (confirm)
action: dialog
accept: false
targetId: tab_abc123
profile: clawd

# Responder diálogo prompt
action: dialog
accept: true
promptText: "Respuesta del usuario"
targetId: tab_abc123
profile: clawd
```

**Deberías ver**:

```
✓ Dialog handled: accepted (prompt: "Respuesta del usuario")
```

## Problemas comunes

### ❌ Error: Retransmisión de extensiones de Chrome no conectada

**Mensaje de error**:
```
No Chrome tabs are attached via Clawdbot Browser Relay extension. Click toolbar icon on tab you want to control (badge ON), then retry.
```

**Causa**: Usaste `profile="chrome"` pero no hay pestañas adjuntas

**Solución**:

1. Instala la extensión Clawdbot Browser Relay (Chrome Web Store)
2. Haz clic en el icono de la extensión en la pestaña que quieres controlar (insignia ON)
3. Vuelve a ejecutar `action: snapshot profile="chrome"`

### ❌ Error: Referencia de elemento caducada (stale targetId)

**Mensaje de error**:
```
Chrome tab not found (stale targetId?). Run action=tabs profile="chrome" and use one of the returned targetIds.
```

**Causa**: La pestaña se cerró o el targetId caducó

**Solución**:

```bash
# Volver a obtener lista de pestañas
action: tabs
profile: chrome

# Usar nuevo targetId
action: snapshot
targetId: "nuevo_targetId"
profile: chrome
```

### ❌ Error: Servidor de control del navegador no iniciado

**Mensaje de error**:
```
Browser control server not available. Run action=start first.
```

**Causa**: El servidor de control del navegador no está iniciado

**Solución**:

```bash
# Iniciar navegador
action: start
profile: clawd
target: sandbox
```

### ❌ Error: Tiempo de espera de conexión de navegador remoto

**Mensaje de error**:
```
Remote CDP handshake timeout. Check remoteCdpTimeoutMs/remoteCdpHandshakeTimeoutMs.
```

**Causa**: Tiempo de espera de conexión de navegador remoto

**Solución**:

```bash
# Aumentar tiempo de espera en archivo de configuración
# ~/.clawdbot/clawdbot.json
{
  "browser": {
    "remoteCdpTimeoutMs": 3000,
    "remoteCdpHandshakeTimeoutMs": 5000
  }
}
```

### ❌ Error: Proxy del navegador del nodo no disponible

**Mensaje de error**:
```
Node browser proxy is disabled (gateway.nodes.browser.mode=off).
```

**Causa**: El proxy del navegador del nodo está deshabilitado

**Solución**:

```bash
# Habilitar navegador del nodo en archivo de configuración
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "nodes": {
      "browser": {
        "mode": "auto"  # o "manual"
      }
    }
  }
}
```

## Resumen de la lección

En esta lección aprendiste:

✅ **Control del navegador**: Iniciar/detener/verificar estado
✅ **Gestión de pestañas**: Abrir/enfocar/cerrar pestañas
✅ **Instantáneas de página**: Formato AI/ARIA, obtener referencias de elementos
✅ **Automatización UI**: click/type/drag/fill/wait/evaluate
✅ **Capturas de pantalla**: Formato PNG/JPEG, capturas de página completa o de elemento
✅ **Carga de archivos**: Manejar selectores de archivos, soporte para múltiples archivos
✅ **Manejo de diálogos**: accept/reject/alert/confirm/prompt
✅ **Retransmisión de Chrome**: Usa `profile="chrome"` para controlar pestañas existentes
✅ **Proxy del nodo**: Ejecuta en dispositivos a través de `target="node"`

**Referencia rápida de operaciones clave**:

| Operación | Action | Parámetros clave |
|--- | --- | ---|
| Iniciar navegador | `start` | `profile` (clawd/chrome) |
| Abrir página web | `open` | `targetUrl` |
| Obtener instantánea | `snapshot` | `targetId`, `snapshotFormat`, `refs` |
| Operación UI | `act` | `request.kind`, `request.ref` |
| Captura de pantalla | `screenshot` | `targetId`, `fullPage`, `ref` |
| Cargar archivos | `upload` | `paths`, `ref` |
| Diálogo | `dialog` | `accept`, `promptText` |

## Próxima lección

> En la próxima lección aprenderemos **[Herramientas de Ejecución de Comandos y Aprobación](../tools-exec/)**.
>
> Aprenderás:
> - Configurar y usar la herramienta exec
> - Entender el mecanismo de aprobación de seguridad
> - Configurar allowlist para controlar comandos ejecutables
> - Usar sandbox para aislar operaciones de riesgo

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-27

| Función | Ruta del archivo | Número de línea |
|--- | --- | ---|
| Definición de herramienta Browser | [`src/agents/tools/browser-tool.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/browser-tool.ts) | 269-791 |
| Browser Schema | [`src/agents/tools/browser-tool.schema.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/browser-tool.schema.ts) | 1-115 |
| Definición de tipos Action | [`src/browser/client-actions-core.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/client-actions-core.ts) | 18-86 |
| Análisis de configuración del navegador | [`src/browser/config.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/config.ts) | 140-231 |
| Constantes del navegador | [`src/browser/constants.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/constants.ts) | 1-9 |
| Cliente CDP | [`src/browser/cdp.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/cdp.ts) | 1-500 |
| Detección de ejecutables Chrome | [`src/browser/chrome.executables.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/chrome.executables.ts) | 1-500 |

**Constantes clave**:
- `DEFAULT_CLAWD_BROWSER_CONTROL_URL = "http://127.0.0.1:18791"`: Dirección del servidor de control predeterminado (fuente: `src/browser/constants.ts:2`)
- `DEFAULT_AI_SNAPSHOT_MAX_CHARS = 80000`: Número máximo de caracteres predeterminado para instantáneas AI (fuente: `src/browser/constants.ts:6`)
- `DEFAULT_AI_SNAPSHOT_EFFICIENT_MAX_CHARS = 10000`: Número máximo de caracteres en modo efficient (fuente: `src/browser/constants.ts:7`)
- `DEFAULT_AI_SNAPSHOT_EFFICIENT_DEPTH = 6`: Profundidad en modo efficient (fuente: `src/browser/constants.ts:8`)

**Funciones clave**:
- `createBrowserTool()`: Crea herramienta del navegador, define todas las acciones y procesamiento de parámetros
- `browserSnapshot()`: Obtiene instantánea de página, soporta formato AI/ARIA
- `browserScreenshotAction()`: Ejecuta operación de captura de pantalla, soporta capturas de página completa y de elementos
- `browserAct()`: Ejecuta operaciones de automatización UI (click/type/drag/fill/wait/evaluate, etc.)
- `browserArmFileChooser()`: Maneja carga de archivos, activa selector de archivos
- `browserArmDialog()`: Maneja diálogos (alert/confirm/prompt)
- `resolveBrowserConfig()`: Analiza configuración del navegador, devuelve dirección y puerto del servidor de control
- `resolveProfile()`: Analiza configuración de profile (clawd/chrome)

**Browser Actions Kind** (fuente: `src/agents/tools/browser-tool.schema.ts:5-17`):
- `click`: Hacer clic en elemento
- `type`: Escribir texto
- `press`: Presionar tecla
- `hover`: Pasar el ratón
- `drag`: Arrastrar
- `select`: Seleccionar opción desplegable
- `fill`: Completar formulario (múltiples campos)
- `resize`: Ajustar tamaño de ventana
- `wait`: Esperar
- `evaluate`: Ejecutar JavaScript
- `close`: Cerrar pestaña

**Browser Tool Actions** (fuente: `src/agents/tools/browser-tool.schema.ts:19-36`):
- `status`: Obtener estado del navegador
- `start`: Iniciar navegador
- `stop`: Detener navegador
- `profiles`: Listar todos los profiles
- `tabs`: Listar todas las pestañas
- `open`: Abrir nueva pestaña
- `focus`: Enfocar pestaña
- `close`: Cerrar pestaña
- `snapshot`: Obtener instantánea de página
- `screenshot`: Capturar captura de pantalla
- `navigate`: Navegar a URL especificada
- `console`: Obtener mensajes de consola
- `pdf`: Guardar página como PDF
- `upload`: Cargar archivos
- `dialog`: Manejar diálogos
- `act`: Ejecutar operaciones UI

</details>
