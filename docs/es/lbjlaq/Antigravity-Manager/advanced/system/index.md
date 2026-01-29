---
title: "Capacidades del sistema: Idioma/Tema/API | Antigravity-Manager"
sidebarTitle: "Configuración del sistema en 5 minutos"
subtitle: "Capacidades del sistema: Idioma/Tema/API | Antigravity-Manager"
description: "Aprende sobre idiomas, temas, bandeja y API Server de Antigravity Tools. Domina fallback de i18n, inicio automático, llamadas a interfaz HTTP y reglas de reinicio."
tags:
  - "Configuración del sistema"
  - "i18n"
  - "Tema"
  - "Actualización"
  - "Bandeja"
  - "HTTP API"
prerequisite:
  - "start-first-run-data"
  - "advanced-config"
order: 9
---

# Capacidades del sistema: Multilingüe/Tema/Actualizaciones/Inicio automático/HTTP API Server

Cambias el tema a dark pero la interfaz sigue en claro; cierras la ventana pero el proceso sigue en segundo plano; quieres que herramientas externas cambien la cuenta actual pero no quieres exponer el proxy inverso a la red local.

Esta lección se centra en las "capacidades del sistema" de Antigravity Tools: idioma, tema, actualizaciones, bandeja/inicio automático, y el HTTP API Server para que lo llamen programas externos.

## ¿Qué son las capacidades del sistema?

**Capacidades del sistema** se refiere a las "capacidades de producto" de Antigravity Tools como aplicación de escritorio: cambio de idioma y tema de la interfaz, verificación y actualización de actualizaciones, permanencia en la bandeja tras cerrar la ventana e inicio automático, y proporcionar un HTTP API Server que solo se vincula a `127.0.0.1` para que lo llamen programas externos.

## Lo que podrás hacer al finalizar

- Cambiar idioma/tema y entender cuáles tienen "efecto inmediato"
- Entender la diferencia entre "cerrar ventana" y "salir del programa", y qué puede hacer el menú de la bandeja
- Saber las condiciones de activación, el intervalo y el archivo de persistencia de la verificación automática de actualizaciones
- Habilitar el HTTP API Server y usar `curl` para verificar estado y cambio de cuenta

## 🎒 Preparativos previos

- Ya sabes dónde está el directorio de datos (consulta [Primera ejecución: Directorio de datos, registros, bandeja e inicio automático](../../start/first-run-data/))
- Ya sabes que `gui_config.json` es la única fuente de verdad de la configuración persistente (consulta [Configuración completa: AppConfig/ProxyConfig, ubicación de persistencia y semántica de recarga en caliente](../config/))

## Enfoque central

Divide estas capacidades en dos categorías, será más fácil de recordar:

1. Capacidades "impulsadas por configuración": idioma y tema se escriben en `gui_config.json` (el frontend llama a `save_config`).
2. Capacidades con "persistencia independiente": configuración de actualizaciones y configuración de HTTP API cada una tiene su propio archivo JSON; la bandeja y el comportamiento de cierre son controlados por el lado de Tauri.

## Sigue mis pasos

### Paso 1: Cambiar idioma (efecto inmediato + persistencia automática)

**Por qué**
El cambio de idioma es lo que más fácilmente hace pensar que "necesita reinicio". La implementación aquí es: la UI cambia inmediatamente, y al mismo tiempo escribe `language` en la configuración.

Acción: abre `Settings` -> `General`, en el menú desplegable de idioma selecciona un idioma.

Deberías ver que dos cosas casi simultáneamente ocurren:

- La UI cambia inmediatamente al nuevo idioma (el frontend llama directamente a `i18n.changeLanguage(newLang)`).
- La configuración se persiste (el frontend llama a `updateLanguage(newLang)`, internamente activa `save_config`).

::: info ¿De dónde vienen los paquetes de idioma?
El frontend inicializó recursos multilingües con `i18next` y estableció `fallbackLng: "en"`. Es decir: cuando una key falta de traducción, volverá al inglés.
:::

### Paso 2: Cambiar tema (light/dark/system)

**Por qué**
El tema no solo afecta CSS, también afecta el color de fondo de la ventana de Tauri, el `data-theme` de DaisyUI y la clase `dark` de Tailwind.

Acción: en `Settings` -> `General`, cambia el tema a `light` / `dark` / `system`.

Deberías ver:

- El tema surte efecto inmediatamente (`ThemeManager` lee la configuración y la aplica a `document.documentElement`).
- Cuando el tema es `system`, los cambios de oscuro/claro del sistema se sincronizan en tiempo real a la aplicación (escucha `prefers-color-scheme`).

::: warning Una excepción de Linux
`ThemeManager` intentará llamar a `getCurrentWindow().setBackgroundColor(...)` para establecer el color de fondo de la ventana, pero en la plataforma Linux omitirá este paso (en el código fuente hay comentarios explicando: ventanas transparentes + softbuffer pueden causar bloqueos).
:::

### Paso 3: Inicio automático (y por qué viene con `--minimized`)

**Por qué**
El inicio automático no es un "campo de configuración", es un elemento de registro del nivel del sistema (plugin de autostart de Tauri).

Acción: en `Settings` -> `General`, configura "Inicio automático al arrancar" como habilitado/deshabilitado.

Deberías ver:

- Al cambiar, llama directamente al backend `toggle_auto_launch(enable)`.
- Al inicializar la página, llama a `is_auto_launch_enabled()`, mostrando el estado real (no depende del caché local).

Complemento: al inicializar el plugin autostart en la aplicación, se pasó el parámetro `--minimized`, por lo que "iniciar con el sistema" generalmente iniciará en forma minimizada/en segundo plano (el comportamiento específico depende de cómo el frontend maneje ese parámetro).

### Paso 4: Entender "cerrar ventana" y "salir del programa"

**Por qué**
Muchas aplicaciones de escritorio son "cerrar = salir", pero el comportamiento predeterminado de Antigravity Tools es "cerrar = ocultar en la bandeja".

Deberías saber:

- Después de hacer clic en el botón de cerrar de la ventana, Tauri interceptará el evento de cierre y llamará a `hide()`, en lugar de salir del proceso.
- El menú de la bandeja tiene `Show`/`Quit`: para salir completamente, deberías usar `Quit`.
- El texto de la bandeja sigue `config.language` (al crear la bandeja, se lee el idioma de configuración y se toma el texto traducido; después de actualizar la configuración, escuchará el evento `config://updated` para actualizar el menú de la bandeja).

### Paso 5: Verificación de actualizaciones (activación automática + verificación manual)

**Por qué**
En actualizaciones se usan simultáneamente dos cosas:

- Lógica personalizada de "verificación de versión": obtiene la última versión de GitHub Releases y juzga si hay actualización.
- Tauri Updater: es responsable de descargar e instalar, luego `relaunch()`.

Puedes usarlo así:

1. Verificación automática: después de que la aplicación inicia, llamará a `should_check_updates`, si necesita verificar mostrará `UpdateNotification`, e inmediatamente actualizará `last_check_time`.
2. Verificación manual: en la página `Settings`, haz clic en "Verificar actualizaciones" (llama a `check_for_updates`, y muestra el resultado en la UI).

::: tip ¿De dónde viene el intervalo de actualización?
El backend persiste la configuración de actualización en `update_settings.json` en el directorio de datos, por defecto `auto_check=true`, `check_interval_hours=24`.
:::

### Paso 6: Habilitar HTTP API Server (solo vincula a la máquina local)

**Por qué**
Si quieres que programas externos (como plugin de VS Code) "cambien cuenta/actualicen cuota/lean registros", el HTTP API Server es más adecuado que el puerto de proxy inverso: se vincula fijamente a `127.0.0.1`, solo abierto a la máquina local.

Acción: en `Settings` -> `Advanced`, en el área "HTTP API":

1. Activa el interruptor de habilitación.
2. Establece el puerto y haz clic en guardar.

Deberías ver: la UI mostrará "necesita reiniciar" (porque el backend solo lee `http_api_settings.json` e inicia el servicio al arrancar).

### Paso 7: Verificar HTTP API con curl (estado/cuenta/cambio/registros)

**Por qué**
Necesitas un ciclo de verificación repetible: poder pasar `health`, poder listar cuentas, poder activar cambio/actualización y entender que son tareas asíncronas.

El puerto predeterminado es `19527`. Si cambiaste el puerto, reemplaza `19527` con tu valor real abajo.

::: code-group

```bash [macOS/Linux]
 # Verificar estado
curl -sS "http://127.0.0.1:19527/health" && echo

 # Listar cuentas (incluyendo resumen de cuota)
curl -sS "http://127.0.0.1:19527/accounts" | head -n 5

 # Obtener cuenta actual
curl -sS "http://127.0.0.1:19527/accounts/current" | head -n 5

 # Activar cambio de cuenta (nota: devuelve 202, ejecución asíncrona en segundo plano)
curl -sS -i \
  -H 'Content-Type: application/json' \
  -d '{"account_id":"<account_id>"}' \
  "http://127.0.0.1:19527/accounts/switch"

 # Activar actualización de todas las cuotas (también 202, ejecución asíncrona)
curl -sS -i -X POST "http://127.0.0.1:19527/accounts/refresh"

 # Leer registros de proxy (limit/offset/filter/errors_only)
curl -sS "http://127.0.0.1:19527/logs?limit=50&offset=0&filter=&errors_only=false" | head -n 5
```

```powershell [Windows]
 # Verificar estado
Invoke-RestMethod "http://127.0.0.1:19527/health"

 # Listar cuentas
Invoke-RestMethod "http://127.0.0.1:19527/accounts" | ConvertTo-Json -Depth 5

 # Obtener cuenta actual
Invoke-RestMethod "http://127.0.0.1:19527/accounts/current" | ConvertTo-Json -Depth 5

 # Activar cambio de cuenta (devuelve 202)
$body = @{ account_id = "<account_id>" } | ConvertTo-Json
Invoke-WebRequest -Method Post -ContentType "application/json" -Body $body "http://127.0.0.1:19527/accounts/switch" | Select-Object -ExpandProperty StatusCode

 # Activar actualización de todas las cuotas (devuelve 202)
Invoke-WebRequest -Method Post "http://127.0.0.1:19527/accounts/refresh" | Select-Object -ExpandProperty StatusCode

 # Leer registros de proxy
Invoke-RestMethod "http://127.0.0.1:19527/logs?limit=50&offset=0&filter=&errors_only=false" | ConvertTo-Json -Depth 5
```

:::

**Deberías ver**:

- `/health` devuelve JSON en estilo `{"status":"ok","version":"..."}`.
- `/accounts/switch` devuelve 202 (Accepted), y indica "task started". El cambio real se ejecuta en segundo plano.

## Punto de verificación ✅

- Puedes explicar: por qué idioma/tema "surtan efecto inmediatamente al cambiar", pero el puerto de HTTP API necesita reinicio
- Puedes explicar: por qué cerrar la ventana no sale, y dónde realmente salir
- Puedes usar `curl` para pasar `/health` y `/accounts`, y entender que `/accounts/switch` es asíncrono

## Advertencias de trampas

1. El HTTP API Server se vincula fijamente a `127.0.0.1`, es diferente de `proxy.allow_lan_access`.
2. La lógica de "si verificar" de la verificación de actualizaciones se decide al inicio de la App; una vez activada, primero actualizará `last_check_time`, incluso si la verificación posterior falla, no volverá a mostrar ventana en poco tiempo.
3. "Cerrar ventana sin salir" es por diseño: para liberar recursos del proceso, usa `Quit` de la bandeja.

## Resumen de esta lección

- Idioma: UI cambia inmediatamente + escribe de vuelta a configuración (`i18n.changeLanguage` + `save_config`)
- Tema: por `ThemeManager` unifica a `data-theme`, clase `dark` y color de fondo de ventana (Linux tiene excepción)
- Actualizaciones: al inicio decide si mostrar ventana según `update_settings.json`, instalación es responsabilidad de Tauri Updater
- HTTP API: habilitado por defecto, solo accesible por máquina local, configuración persiste `http_api_settings.json`, cambiar puerto necesita reinicio

## Vista previa de la próxima lección

> La próxima lección entrará en **Despliegue de servidor: Docker noVNC vs Headless Xvfb (advanced-deployment)**, moviendo el escritorio a NAS/servidor.

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir ubicaciones de código fuente</strong></summary>

> Hora de actualización: 2026-01-23

| Tema | Ruta de archivo | Líneas |
| --- | --- | --- |
| Inicialización de i18n y fallback | [`src/i18n.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/i18n.ts#L1-L67) | 1-67 |
| Settings: idioma/tema/inicio automático/configuración de actualizaciones/configuración de HTTP API | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L16-L730) | 16-730 |
| App: sincronizar idioma + activar verificación de actualizaciones al inicio | [`src/App.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/App.tsx#L52-L124) | 52-124 |
| ThemeManager: aplicar tema, escuchar tema del sistema, escribir localStorage | [`src/components/common/ThemeManager.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/common/ThemeManager.tsx#L1-L82) | 1-82 |
| UpdateNotification: verificar actualizaciones, descargar automáticamente e instalar y relaunch | [`src/components/UpdateNotification.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/UpdateNotification.tsx#L1-L217) | 1-217 |
| Verificación de actualizaciones: GitHub Releases + check interval | [`src-tauri/src/modules/update_checker.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/update_checker.rs#L1-L187) | 1-187 |
| Bandeja: generar menú por idioma + escuchar `config://updated` para actualizar | [`src-tauri/src/modules/tray.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/tray.rs#L1-L255) | 1-255 |
| Guardar configuración: emitir `config://updated` + recarga en caliente de proxy inverso en ejecución | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L296-L334) | 296-334 |
| Comando de inicio automático: toggle/is_enabled (compatibilidad disable de Windows) | [`src-tauri/src/commands/autostart.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/autostart.rs#L1-L39) | 1-39 |
| Tauri: inicializar autostart/updater + cerrar ventana a hide + iniciar HTTP API | [`src-tauri/src/lib.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/lib.rs#L50-L160) | 50-160 |
| HTTP API: configuración persistente + rutas (health/accounts/switch/refresh/logs) + solo vincular 127.0.0.1 | [`src-tauri/src/modules/http_api.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/http_api.rs#L1-L95) | 1-95 |
| HTTP API: Server bind y registro de rutas | [`src-tauri/src/modules/http_api.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/http_api.rs#L51-L94) | 51-94 |
| Comandos de configuración de HTTP API: get/save | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L773-L789) | 773-789 |

</details>
