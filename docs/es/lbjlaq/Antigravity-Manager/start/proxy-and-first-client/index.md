---
title: "Iniciar proxy: Reverse Proxy y conexión del primer cliente | Antigravity-Manager"
sidebarTitle: "Reverse proxy en 5 minutos"
subtitle: "Inicia el reverse proxy local y conecta el primer cliente (/healthz + configuración de SDK)"
description: "Aprende el inicio del reverse proxy de Antigravity y conexión del cliente: configura puerto y autenticación, verifica con /healthz, completa la primera llamada al SDK."
tags:
  - "API Proxy"
  - "healthz"
  - "OpenAI SDK"
  - "Anthropic SDK"
  - "Gemini SDK"
  - "Base URL"
prerequisite:
  - "start-installation"
  - "start-add-account"
duration: 18
order: 6
---

# Iniciar el reverse proxy local y conectar el primer cliente (/healthz + configuración de SDK)

En esta lección usaremos Antigravity Tools para poner en funcionamiento el reverse proxy local (API Proxy): iniciar el servicio, realizar una comprobación de salud con `/healthz`, y luego conectar un SDK para completar la primera solicitud.

## Lo que podrás hacer después de esta lección

- Iniciar/detener el servicio de reverse proxy local en la página API Proxy de Antigravity Tools
- Usar `GET /healthz` para hacer una comprobación de salud y confirmar que "el puerto es correcto y el servicio realmente está ejecutándose"
- Entender la relación entre `auth_mode` y API Key: qué rutas necesitan autenticación y qué Header debes incluir
- Conectar cualquier cliente (OpenAI / Anthropic / Gemini SDK) y completar la primera solicitud real

## Tu situación actual

- Ya has instalado Antigravity Tools y has agregado una cuenta, pero no sabes si "el reverse proxy se ha iniciado correctamente"
- Al conectar un cliente, es fácil encontrarse con `401` (no incluiste la key) o `404` (Base URL mal escrita/rutas duplicadas)
- No quieres adivinar, quieres el ciclo más corto posible: iniciar → comprobación de salud → primera solicitud exitosa

## Cuándo usar este enfoque

- Acabas de terminar la instalación y quieres confirmar que el gateway local puede funcionar externamente
- Has cambiado el puerto, habilitado el acceso a la red local, o modificado el modo de autenticación, y quieres verificar rápidamente que la configuración no falló
- Vas a conectar un nuevo cliente/nuevo SDK y quieres usar el ejemplo más simple para que funcione primero

## 🎒 Preparativos antes de comenzar

::: warning Requisitos previos
- Ya has completado la instalación y puedes abrir Antigravity Tools normalmente.
- Tienes al menos una cuenta disponible; de lo contrario, al iniciar el reverse proxy se devolverá el error `"没有可用账号，请先添加账号"` (solo cuando la distribución de z.ai no está habilitada).
:::

::: info Algunos términos que aparecerán repetidamente en esta lección
- **Base URL**: La "dirección raíz del servicio" que el cliente solicita. Los diferentes SDK tienen diferentes formas de concatenar, algunos necesitan `/v1`, otros no.
- **Comprobación de salud (Health Check)**: Usar la solicitud más pequeña para confirmar que el servicio es alcanzable. El endpoint de comprobación de salud de este proyecto es `GET /healthz`, que devuelve `{"status":"ok"}`.
:::

## Idea central

1. Cuando Antigravity Tools inicia el reverse proxy, vincula la dirección de escucha y el puerto según la configuración:
   - Cuando `allow_lan_access=false`, vincula `127.0.0.1`
   - Cuando `allow_lan_access=true`, vincula `0.0.0.0`
2. No necesitas escribir ningún código primero. Usa `GET /healthz` para hacer la comprobación de salud y confirmar que "el servicio está ejecutándose".
3. Si habilitas la autenticación:
   - `auth_mode=all_except_health` eximirá `/healthz`
   - `auth_mode=strict` requiere API Key para todas las rutas

## Sígueme paso a paso

### Paso 1: Confirmar puerto, acceso a la red local y modo de autenticación

**Por qué**
Debes determinar primero "a dónde debería conectarse el cliente (host/port)" y "si necesitas incluir la key", de lo contrario será difícil solucionar errores 401/404 más adelante.

En Antigravity Tools abre la página `API Proxy` y enfócate en estos 4 campos:

- `port`: el valor predeterminado es `8045`
- `allow_lan_access`: deshabilitado por defecto (solo acceso local)
- `auth_mode`: opcional `off/strict/all_except_health/auto`
- `api_key`: por defecto se generará `sk-...`, y la UI verificará que debe comenzar con `sk-` y tener una longitud mínima de 10

**Lo que deberías ver**
- En la esquina superior derecha de la página hay un botón Start/Stop (iniciar/detener el reverse proxy), el cuadro de entrada del puerto se deshabilitará mientras el servicio está ejecutándose

::: tip Configuración recomendada para principiantes (primero que funcione, luego agrega seguridad)
- Primera vez que funcione: `allow_lan_access=false` + `auth_mode=off`
- Cuando necesites acceso a la red local: primero habilita `allow_lan_access=true`, luego cambia `auth_mode` a `all_except_health` (al menos no expongas toda la LAN como una "API desnuda")
:::

### Paso 2: Iniciar el servicio de reverse proxy

**Por qué**
El botón Start de la GUI llamará al comando del backend para iniciar el Axum Server y cargar el grupo de cuentas; este es el requisito previo para "proporcionar API externamente".

Haz clic en el botón Start en la esquina superior derecha de la página.

**Lo que deberías ver**
- El estado cambia de stopped a running
- A un lado se mostrará la cantidad de cuentas cargadas actualmente (active accounts)

::: warning Si el inicio falla, los dos tipos de errores más comunes
- `"没有可用账号，请先添加账号"`: Indica que el grupo de cuentas está vacío y la distribución de z.ai no está habilitada.
- `"启动 Axum 服务器失败: 地址 <host:port> 绑定失败: ..."`: El puerto está ocupado o no tienes permisos (cambia el puerto y vuelve a intentarlo).
:::

### Paso 3: Usar /healthz para hacer la comprobación de salud (el ciclo más corto)

**Por qué**
`/healthz` es la "confirmación de conectividad" más estable. No depende del modelo, la cuenta o la conversión de protocolos, solo verifica si el servicio es alcanzable.

Reemplaza `<PORT>` con el puerto que ves en la UI (por defecto `8045`):

::: code-group

```bash [macOS/Linux]
curl -sS "http://127.0.0.1:<PORT>/healthz"
```

```powershell [Windows]
curl.exe -sS "http://127.0.0.1:<PORT>/healthz"
```

:::

**Lo que deberías ver**

```json
{"status":"ok"}
```

::: details ¿Cómo probar cuando necesitas autenticación?
Cuando cambias `auth_mode` a `strict`, todas las rutas deben incluir la key (incluyendo `/healthz`).

```bash
curl -sS "http://127.0.0.1:<PORT>/healthz" \
  -H "Authorization: Bearer <API_KEY>"
```

Formas recomendadas del Header de autenticación (compatible con más formatos):
- `Authorization: Bearer <proxy.api_key>` o `Authorization: <proxy.api_key>`
- `x-api-key: <proxy.api_key>`
- `x-goog-api-key: <proxy.api_key>`
:::

### Paso 4: Conectar tu primer cliente (elige uno entre OpenAI / Anthropic / Gemini)

**Por qué**
`/healthz` solo puede indicar que "el servicio es alcanzable"; la conexión real exitosa se basa en que el SDK inicie una solicitud real.

::: code-group

```python [OpenAI SDK (Python)]
import openai

client = openai.OpenAI(
    api_key="<API_KEY>",
    base_url="http://127.0.0.1:8045/v1",
)

resp = client.chat.completions.create(
    model="gemini-3-flash",
    messages=[{"role": "user", "content": "Hola, por favor preséntate"}],
)

print(resp.choices[0].message.content)
```

```bash [Claude Code / Anthropic CLI]
export ANTHROPIC_API_KEY="<API_KEY>"
export ANTHROPIC_BASE_URL="http://127.0.0.1:8045"
claude
```

```python [Gemini SDK (Python)]
import google.generativeai as genai

genai.configure(
    api_key="<API_KEY>",
    transport="rest",
    client_options={"api_endpoint": "http://127.0.0.1:8045"},
)

model = genai.GenerativeModel("gemini-3-flash")
resp = model.generate_content("Hello")
print(resp.text)
```

:::

**Lo que deberías ver**
- El cliente puede obtener una respuesta de texto no vacía
- Si habilitaste Proxy Monitor, también verás este registro de solicitud en el monitoreo

## Puntos de control ✅

- `GET /healthz` devuelve `{"status":"ok"}`
- La página API Proxy muestra running
- Un ejemplo de SDK que hayas elegido puede devolver contenido (no es 401/404, ni una respuesta vacía)

## Alertas de problemas comunes

::: warning 401: La mayoría de las veces es por autenticación no alineada
- Habilitaste `auth_mode`, pero el cliente no incluyó la key.
- Incluiste la key, pero el nombre del Header no es correcto: este proyecto es compatible simultáneamente con `Authorization` / `x-api-key` / `x-goog-api-key`.
:::

::: warning 404: La mayoría de las veces es por Base URL mal escrita o "rutas duplicadas"
- OpenAI SDK generalmente necesita `base_url=.../v1`; mientras que los ejemplos de Anthropic/Gemini no incluyen `/v1`.
- Algunos clientes concatenarán las rutas duplicando algo como `/v1/chat/completions/responses`, lo que resultará en 404 (el README del proyecto mencionó específicamente el problema de rutas duplicadas del modo OpenAI de Kilo Code).
:::

::: warning El acceso a la red local no es "solo abrirlo y listo"
Cuando habilitas `allow_lan_access=true`, el servicio se vinculará a `0.0.0.0`. Esto significa que otros dispositivos en la misma red local pueden acceder a través de la IP de tu máquina + puerto.

Si vas a usarlo así, al menos habilita `auth_mode` y configura una `api_key` fuerte.
:::

## Resumen de esta lección

- Después de iniciar el reverse proxy, primero usa `/healthz` para hacer la comprobación de salud, luego configura el SDK
- `auth_mode` decide qué rutas necesitan key; `all_except_health` eximirá `/healthz`
- Al conectar el SDK, el error más común es si la Base URL necesita incluir `/v1`

## Próxima lección

> En la siguiente lección explicaremos los detalles de la API compatible con OpenAI: incluyendo los límites de compatibilidad de `/v1/chat/completions` y `/v1/responses`.
>
> Ve a **[API Compatible con OpenAI: Estrategia de `/v1/chat/completions` y `/v1/responses`](/es/lbjlaq/Antigravity-Manager/platforms/openai/)**.

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Tema | Ruta del archivo | Líneas |
|--- | --- | ---|
| Inicio/parada/estado del servicio de reverse proxy | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L42-L178) | 42-178 |
| Verificación del grupo de cuentas antes del inicio (condiciones de error sin cuentas) | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L81-L91) | 81-91 |
| Registro de rutas (incluyendo `/healthz`) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Valor de retorno de `/healthz` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| Middleware de autenticación de proxy (compatibilidad de Header y exención de `/healthz`) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| Lógica de análisis real de `auth_mode=auto` | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L19-L30) | 19-30 |
| Valores predeterminados de ProxyConfig (puerto 8045, solo local por defecto) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L257) | 174-257 |
| Derivación de dirección de vinculación (127.0.0.1 vs 0.0.0.0) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L281-L291) | 281-291 |
| UI botón inicio/parada llama `start_proxy_service/stop_proxy_service` | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L624-L639) | 624-639 |
| UI configuración puerto/LAN/autenticación/API key | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L868-L1121) | 868-1121 |
| Ejemplos de conexión Claude Code / Python del README | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L197-L227) | 197-227 |

</details>
