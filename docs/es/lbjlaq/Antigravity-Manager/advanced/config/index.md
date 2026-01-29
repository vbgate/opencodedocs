---
title: "Configuración: Recarga en caliente y migración | Antigravity-Manager"
subtitle: "Configuración: Recarga en caliente y migración | Antigravity-Manager"
sidebarTitle: "¿Qué hacer cuando la configuración no surte efecto"
description: "Aprende el mecanismo de persistencia, recarga en caliente y migración del sistema de configuración. Dominar los valores predeterminados y métodos de validación de autenticación para evitar errores comunes."
tags:
  - "Configuración"
  - "gui_config.json"
  - "AppConfig"
  - "ProxyConfig"
  - "Recarga en caliente"
prerequisite:
  - "start-first-run-data"
  - "start-proxy-and-first-client"
order: 1
---
# Guía completa de configuración: AppConfig/ProxyConfig, ubicación de persistencia y semántica de recarga en caliente

Cambiaste `auth_mode` pero el cliente sigue devolviendo 401; activaste `allow_lan_access` pero los dispositivos de la misma red no pueden conectarse; quieres migrar la configuración a una nueva máquina pero no sabes qué archivos copiar.

Esta lección explica exhaustivamente el sistema de configuración de Antigravity Tools: dónde se almacena la configuración, cuáles son los valores predeterminados, qué configuraciones admiten recarga en caliente y cuáles requieren reiniciar el proxy inverso.

## ¿Qué son AppConfig/ProxyConfig?

**AppConfig/ProxyConfig** son los modelos de datos de configuración de Antigravity Tools: AppConfig administra la configuración general del escritorio (idioma, tema, calentamiento previo, protección de cuotas, etc.), mientras que ProxyConfig administra los parámetros de ejecución del servicio de proxy inverso local (puerto, autenticación, mapeo de modelos, proxy ascendente, etc.). Ambos finalmente se serializan en el mismo archivo `gui_config.json`, y el proxy inverso lee el ProxyConfig al iniciar.

## Lo que podrás hacer al finalizar

- Encontrar la ubicación real del archivo de configuración `gui_config.json` y poder hacer copias de seguridad/migraciones
- Comprender los campos principales y los valores predeterminados de AppConfig/ProxyConfig (basado en el código fuente)
- Identificar qué configuraciones admiten recarga en caliente después de guardar y cuáles requieren reiniciar el proxy inverso para surtir efecto
- Entender las condiciones en las que ocurre una "migración de configuración" (los campos antiguos se combinan/eliminan automáticamente)

## Tu situación actual

- Cambiaste la configuración pero "no surte efecto", sin saber si no se guardó, no se recargó en caliente o es necesario reiniciar
- Solo quieres llevar la "configuración del proxy inverso" a una nueva máquina, pero te preocupa llevar también los datos de la cuenta
- Después de actualizar, aparecen campos antiguos, y te preocupa que el formato del archivo de configuración esté "dañado"

## Cuándo utilizar este método

- Estás a punto de cambiar el proxy inverso de "solo máquina local" a "accesible desde LAN"
- Necesitas cambiar la política de autenticación (`auth_mode`/`api_key`) y quieres verificar inmediatamente que surta efecto
- Necesitas mantener por lotes el mapeo de modelos/proxy ascendente/configuración de z.ai

## 🎒 Preparativos previos

- Ya sabes qué es el directorio de datos (consulta [Primera ejecución: Directorio de datos, registros, bandeja y inicio automático](../../start/first-run-data/))
- Puedes iniciar el servicio de proxy inverso una vez (consulta [Iniciar proxy inverso local y conectar el primer cliente](../../start/proxy-and-first-client/))

::: warning Primero una nota sobre los límites
Esta lección te enseñará a leer/hacer copias de seguridad/migrar `gui_config.json`, pero no se recomienda usarlo como "archivo de configuración mantenido manualmente a largo plazo". Porque cuando el backend guarda la configuración, la re-serializa según la estructura `AppConfig` de Rust, y los campos desconocidos insertados manualmente probablemente se descarten automáticamente en la siguiente guardada.
:::

## Enfoque central

Para la configuración, recuerda tres frases:

1. AppConfig es el objeto raíz de configuración persistente, almacenado en `gui_config.json`.
2. ProxyConfig es un objeto secundario de `AppConfig.proxy`, y el inicio/recarga en caliente del proxy inverso gira en torno a él.
3. La recarga en caliente es "solo actualizar el estado en memoria": lo que se puede recargar en caliente no significa que se pueda cambiar el puerto de escucha/dirección de escucha.

## Sigue mis pasos

### Paso 1: Localizar `gui_config.json` (única fuente de verdad de la configuración)

**Por qué**
Todos tus "respaldos/migraciones/resolución de problemas" posteriores deben basarse en este archivo.

El directorio de datos del backend es `.antigravity_tools` bajo tu directorio Home (se creará automáticamente si no existe), y el nombre del archivo de configuración es fijo como `gui_config.json`.

::: code-group

```bash [macOS/Linux]
CONFIG_FILE="$HOME/.antigravity_tools/gui_config.json"
echo "$CONFIG_FILE"
ls -la "$CONFIG_FILE" || true
```

```powershell [Windows]
$configFile = Join-Path $HOME ".antigravity_tools\gui_config.json"
$configFile
Get-ChildItem -Force $configFile -ErrorAction SilentlyContinue
```

:::

**Lo que deberías ver**:
- Si aún no has iniciado el proxy inverso, este archivo podría no existir (el backend usará directamente la configuración predeterminada).
- Al iniciar el servicio de proxy inverso o guardar la configuración, se creará automáticamente y se escribirá el JSON.

### Paso 2: Primero haz una copia de seguridad (para evitar errores manuales + facilitar reversión)

**Por qué**
La configuración puede contener campos sensibles como `proxy.api_key`, `api_key` de z.ai, etc. Cuando quieras migrar/comparar, la copia de seguridad es más confiable que la "memoria".

::: code-group

```bash [macOS/Linux]
mkdir -p "$HOME/antigravity-config-backup"
cp "$HOME/.antigravity_tools/gui_config.json" "$HOME/antigravity-config-backup/gui_config.$(date +%Y%m%d%H%M%S).json"
```

```powershell [Windows]
$backupDir = Join-Path $HOME "antigravity-config-backup"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
$ts = Get-Date -Format "yyyyMMddHHmmss"
Copy-Item (Join-Path $HOME ".antigravity_tools\gui_config.json") (Join-Path $backupDir "gui_config.$ts.json")
```

:::

**Lo que deberías ver**: aparece un archivo JSON con marca de tiempo en el directorio de copia de seguridad.

### Paso 3: Comprender los valores predeterminados (no adivines por intuición)

**Por qué**
Muchos problemas de "no puedo configurarlo correctamente" se deben a expectativas incorrectas sobre los valores predeterminados.

Los siguientes valores predeterminados provienen del backend `AppConfig::new()` y `ProxyConfig::default()`:

| Bloque de configuración | Campo | Valor predeterminado (código fuente) | Puntos que debes recordar |
| --- | --- | --- | --- |
| AppConfig | `language` | `"zh"` | Chino predeterminado |
| AppConfig | `theme` | `"system"` | Seguir el sistema |
| AppConfig | `auto_refresh` | `true` | Por defecto se actualiza automáticamente la cuota |
| AppConfig | `refresh_interval` | `15` | Unidad: minutos |
| ProxyConfig | `enabled` | `false` | No inicia el proxy inverso por defecto |
| ProxyConfig | `allow_lan_access` | `false` | Por defecto solo enlaza a la máquina local (privacidad primero) |
| ProxyConfig | `auth_mode` | `"off"` | Sin autenticación por defecto (escenario solo máquina local) |
| ProxyConfig | `port` | `8045` | Este es el campo que modificas más a menudo |
| ProxyConfig | `api_key` | `"sk-<uuid>"` | Por defecto genera una key aleatoria |
| ProxyConfig | `request_timeout` | `120` | Unidad: segundos (nota: el proxy inverso internamente puede que no la use actualmente) |
| ProxyConfig | `enable_logging` | `true` | Por defecto habilita la recolección de registros para monitoreo/estadísticas |
| StickySessionConfig | `mode` | `Balance` | Estrategia de programación predeterminada equilibrada |
| StickySessionConfig | `max_wait_seconds` | `60` | Solo tiene sentido en modo CacheFirst |

::: tip ¿Cómo ver todos los campos?
Puedes abrir `gui_config.json` y comparar con el código fuente: `src-tauri/src/models/config.rs` (AppConfig) y `src-tauri/src/proxy/config.rs` (ProxyConfig). Al final de esta lección, "Referencia del código fuente" proporciona enlaces clicables a números de línea.
:::

### Paso 4: Cambiar una configuración "que definitivamente se recargará en caliente" y verificar inmediatamente (ejemplo de autenticación)

**Por qué**
Necesitas un ciclo cerrado "cambiar y verificar inmediatamente" para evitar cambios ciegos en la UI.

Cuando el proxy inverso está en ejecución, `save_config` del backend recargará en caliente en memoria estos contenidos:

- `proxy.custom_mapping`
- `proxy.upstream_proxy`
- `proxy.auth_mode` / `proxy.api_key` (política de seguridad)
- `proxy.zai`
- `proxy.experimental`

Aquí usamos `auth_mode` como ejemplo:

1. Abre la página `API Proxy` y asegúrate de que el servicio de proxy inverso esté en estado Running.
2. Establece `auth_mode` en `all_except_health` y confirma que conoces el `api_key` actual.
3. Usa la siguiente solicitud para verificar "exención de verificación de salud, otras interfaces interceptadas".

::: code-group

```bash [macOS/Linux]
# Solicitar /healthz sin key: debería tener éxito
curl -sS "http://127.0.0.1:8045/healthz" && echo

# Solicitar /v1/models sin key: debería devolver 401
curl -sS -i "http://127.0.0.1:8045/v1/models"

# Solicitar /v1/models con key: debería tener éxito
curl -sS -H "Authorization: Bearer <proxy.api_key>" "http://127.0.0.1:8045/v1/models"
```

```powershell [Windows]
# Solicitar /healthz sin key: debería tener éxito
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/healthz" | Select-Object -ExpandProperty StatusCode

# Solicitar /v1/models sin key: debería devolver 401
try { Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/v1/models" } catch { $_.Exception.Response.StatusCode.value__ }

# Solicitar /v1/models con key: debería tener éxito
$headers = @{ Authorization = "Bearer <proxy.api_key>" }
(Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/v1/models" -Headers $headers).StatusCode
```

:::

**Lo que deberías ver**: `/healthz` devuelve 200; `/v1/models` devuelve 401 sin key, y tiene éxito con key.

### Paso 5: Cambiar una configuración "que requiere reiniciar el proxy inverso" (puerto / dirección de escucha)

**Por qué**
Muchas configuraciones "se guardan pero no surten efecto", la causa raíz no es un bug, sino que determina cómo se vincula el TCP Listener.

Al iniciar el proxy inverso, el backend usará `allow_lan_access` para calcular la dirección de escucha (`127.0.0.1` o `0.0.0.0`), y usará `port` para vincular el puerto; este paso solo ocurre en `start_proxy_service`.

Sugerencia de operación:

1. En la página `API Proxy`, cambia `port` a un nuevo valor (por ejemplo `8050`), guarda.
2. Detén el servicio de proxy inverso y luego reinícialo.
3. Verifica `/healthz` con el nuevo puerto.

::: code-group

```bash [macOS/Linux]
curl -sS "http://127.0.0.1:8050/healthz" && echo
```

```powershell [Windows]
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8050/healthz" | Select-Object -ExpandProperty StatusCode
```

:::

**Lo que deberías ver**: el nuevo puerto es accesible; el puerto antiguo falla la conexión o devuelve vacío.

::: warning Sobre `allow_lan_access`
En el código fuente, `allow_lan_access` afecta dos cosas al mismo tiempo:

1. **Dirección de escucha**: decide vincular `127.0.0.1` o `0.0.0.0` (requiere reiniciar el proxy inverso para volver a vincular).
2. **Política de autenticación auto**: cuando `auth_mode=auto`, en escenarios de LAN se convertirá automáticamente en `all_except_health` (esta parte se puede recargar en caliente).
:::

### Paso 6: Entender una "migración de configuración" (los campos antiguos se limpiarán automáticamente)

**Por qué**
Después de actualizar, podrías ver campos antiguos en `gui_config.json`, preocupándote de que esté "dañado". En realidad, al cargar la configuración, el backend realizará una migración: combinará `anthropic_mapping/openai_mapping` en `custom_mapping`, eliminará los campos antiguos y luego guardará automáticamente una vez.

Puedes usar esta regla para auto-verificarte:

- Si ves `proxy.anthropic_mapping` o `proxy.openai_mapping` en el archivo, la próxima vez que inicies/cargues la configuración, se eliminarán.
- Al combinar, se omitirán las keys que terminan con `-series` (ahora estos son manejados por la lógica preset/builtin).

**Lo que deberías ver**: después de la migración, solo queda `proxy.custom_mapping` en `gui_config.json`.

## Punto de verificación ✅

- Puedes encontrar `$HOME/.antigravity_tools/gui_config.json` en tu máquina local
- Puedes explicar claramente: por qué las configuraciones como `auth_mode/api_key/custom_mapping` se pueden recargar en caliente
- Puedes explicar claramente: por qué las configuraciones como `port/allow_lan_access` requieren reiniciar el proxy inverso

## Recordatorio de errores comunes

1. La recarga en caliente de `save_config` solo cubre pocos campos: no te ayudará a reiniciar el listener, ni enviará configuraciones como `scheduling` al TokenManager.
2. `request_timeout` en la implementación actual del proxy inverso no realmente surte efecto: el parámetro `start` de AxumServer tiene `_request_timeout`, y el estado establece el tiempo de espera en `300` segundos de forma fija.
3. Insertar manualmente "campos personalizados" en `gui_config.json` no es confiable: cuando el backend guarda, lo re-serializará en `AppConfig`, y los campos desconocidos se descartarán.

## Resumen de la lección

- La persistencia de configuración tiene solo una entrada: `$HOME/.antigravity_tools/gui_config.json`
- Que ProxyConfig "puede recargarse en caliente" no es igual a "puede cambiar puerto/cambiar dirección de escucha"; todo lo que involucre bind requiere reiniciar el proxy inverso
- No te asustes al ver campos de mapeo antiguos: al cargar la configuración se migrarán automáticamente a `custom_mapping` y se limpiarán los campos antiguos

## Vista previa de la próxima lección

> En la próxima lección aprenderemos **[Seguridad y privacidad: auth_mode, allow_lan_access, y el diseño de "no filtrar información de cuenta"](../security/)**.
>
> Aprenderás:
> - Cuándo es obligatorio habilitar la autenticación (y por qué `auto` es más estricto en escenarios de LAN)
> - Estrategia de exposición mínima al exponer el proxy inverso local a LAN/red pública
> - Qué datos se envían al upstream y cuáles solo se guardan localmente

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Tema | Ruta de archivo | Línea |
| --- | --- | --- |
| Valores predeterminados de AppConfig (`AppConfig::new()`) | [`src-tauri/src/models/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/config.rs#L4-L158) | 4-158 |
| Valores predeterminados de ProxyConfig (puerto/autenticación/dirección de escucha) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L74-L292) | 74-292 |
| Valores predeterminados de StickySessionConfig (programación) | [`src-tauri/src/proxy/sticky_config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/sticky_config.rs#L3-L36) | 3-36 |
| Nombre de archivo de persistencia de configuración + lógica de migración (`gui_config.json`) | [`src-tauri/src/modules/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/config.rs#L7-L88) | 7-88 |
| Directorio de datos (`$HOME/.antigravity_tools`) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| `save_config`: guardar configuración + qué campos recargar en caliente | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L296-L334) | 296-334 |
| AxumServer: `update_mapping/update_proxy/update_security/...` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L45-L117) | 45-117 |
| Selección de dirección de escucha de `allow_lan_access` | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L81-L92) | 81-92 |
| Dirección de enlace y puerto al iniciar Proxy (solo cambia al reiniciar) | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L42-L134) | 42-134 |
| Regla real de `auth_mode=auto` | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L3-L31) | 3-31 |
| Guardar configuración de programación desde frontend (solo guarda, no envía al backend en tiempo de ejecución) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L476-L501) | 476-501 |
| Página Monitor habilitar/deshabilitar dinámicamente recolección de registros | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L174-L263) | 174-263 |

</details>
