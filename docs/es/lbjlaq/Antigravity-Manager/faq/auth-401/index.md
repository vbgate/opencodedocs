---
title: "Fallo de autenticación: Solución de errores 401 | Antigravity-Manager"
sidebarTitle: "Soluciona 401 en 3 minutos"
subtitle: "401/Fallo de autenticación: Primero verifica auth_mode, luego verifica Header"
description: "Aprende el mecanismo de autenticación del proxy de Antigravity Tools, soluciona errores 401. Localiza problemas por auth_mode, api_key, Header, entiende las reglas del modo auto y la excepción /healthz, evita errores de prioridad de Header."
tags:
  - "FAQ"
  - "Autenticación"
  - "401"
  - "API Key"
prerequisite:
  - "start-proxy-and-first-client"
order: 2
---

# 401/Fallo de autenticación: Primero verifica auth_mode, luego verifica Header

## Qué podrás hacer después de aprender

- Determinar en 3 minutos si un 401 está siendo bloqueado por el middleware de autenticación de Antigravity Tools
- Entender el "valor efectivo real" de los cuatro modos de `proxy.auth_mode` (especialmente `auto`) en tu configuración actual
- Hacer que las solicitudes pasen usando el Header de API Key correcto (y evitar la trampa de prioridad de Headers)

## Tu situación actual

Al llamar al proxy inverso local, el cliente recibe un error `401 Unauthorized`:
- Python/OpenAI SDK: lanza `AuthenticationError`
- curl: devuelve `HTTP/1.1 401 Unauthorized`
- Clientes HTTP: código de estado 401 en la respuesta

## ¿Qué es 401/fallo de autenticación?

**401 Unauthorized** en Antigravity Tools comúnmente significa: el proxy habilitó la autenticación (determinado por `proxy.auth_mode`), pero la solicitud no tiene la API Key correcta, o lleva un Header con mayor prioridad que no coincide, por lo que `auth_middleware()` devuelve 401 directamente.

::: info Primero confirma si "es el proxy bloqueando"
Las plataformas upstream también pueden devolver 401, pero este FAQ solo trata "401 causado por autenticación del proxy". Puedes usar `/healthz` a continuación para diferenciar rápidamente.
:::

## Solución rápida (haz esto en este orden)

### Paso 1: Usa `/healthz` para determinar "si la autenticación te está bloqueando"

**Por qué**
`all_except_health` permitirá `/healthz`, pero bloqueará otras rutas; esto te ayuda a localizar rápidamente si el 401 proviene de la capa de autenticación del proxy.

```bash
 # Sin ningún Header de autenticación
curl -i http://127.0.0.1:8045/healthz
```

**Deberías ver**
- Con `auth_mode=all_except_health` (o `auto` con `allow_lan_access=true`): generalmente devuelve `200`
- Con `auth_mode=strict`: devuelve `401`

::: tip `/healthz` en la capa de ruta es GET
El proxy registra `GET /healthz` en la ruta (ver `src-tauri/src/proxy/server.rs`).
:::

---

### Paso 2: Confirma el "valor efectivo real" de `auth_mode` (especialmente `auto`)

**Por qué**
`auto` no es una "estrategia independiente", calcula el modo real a ejecutar basándose en `allow_lan_access`.

| `proxy.auth_mode` | Condición adicional | Valor efectivo real (effective mode) |
| --- | --- | --- |
| `off` | - | `off` |
| `strict` | - | `strict` |
| `all_except_health` | - | `all_except_health` |
| `auto` | `allow_lan_access=false` | `off` |
| `auto` | `allow_lan_access=true` | `all_except_health` |

**Puedes verificar esto en la página API Proxy del GUI**: `Allow LAN Access` y `Auth Mode`.

---

### Paso 3: Confirma que `api_key` no esté vacío y que estás usando el mismo valor

**Por qué**
Cuando la autenticación está habilitada, si `proxy.api_key` está vacío, `auth_middleware()` rechazará directamente todas las solicitudes y registrará un error en el log.

```text
Proxy auth is enabled but api_key is empty; denying request
```

**Deberías ver**
- En la página API Proxy puedes ver una key que comienza con `sk-` (el valor predeterminado se genera automáticamente en `ProxyConfig::default()`)
- Después de hacer clic en "Regenerate/Editar" y guardar, las solicitudes externas se verifican inmediatamente con la nueva key (no es necesario reiniciar)

---

### Paso 4: Prueba con el Header más simple primero (no uses SDKs complejos todavía)

**Por qué**
El middleware lee primero `Authorization`, luego `x-api-key`, y finalmente `x-goog-api-key`. Si envías múltiples Headers a la vez y el primero es incorrecto, aunque el segundo sea correcto no se usará.

```bash
 # Recomendado: Authorization + Bearer
curl -i http://127.0.0.1:8045/v1/models \
  -H "Authorization: Bearer sk-REPLACE_WITH_YOUR_PROXY_API_KEY"
```

**Deberías ver**: `HTTP/1.1 200 OK` (o al menos ya no es 401)

::: info Detalles de compatibilidad del proxy con Authorization
`auth_middleware()` extraerá el valor de `Authorization` una vez eliminando el prefijo `Bearer `; si no hay prefijo `Bearer `, también usará el valor completo como key para comparación. La documentación aún recomienda `Authorization: Bearer <key>` (más conforme a las convenciones de SDK generales).
:::

**Si debes usar `x-api-key`**:

```bash
curl -i http://127.0.0.1:8045/v1/models \
  -H "x-api-key: sk-REPLACE_WITH_YOUR_PROXY_API_KEY"
```

---

## Problemas comunes (todos ocurren realmente en el código fuente)

| Fenómeno | Causa real | Qué deberías cambiar |
| --- | --- | --- |
| `auth_mode=auto`, pero las llamadas locales siguen siendo 401 | `allow_lan_access=true` hace que `auto` se comporte como `all_except_health` | Deshabilita `allow_lan_access`, o haz que el cliente lleve la key |
| Crees "ya llevé x-api-key", pero sigue siendo 401 | Simultáneamente llevaste un `Authorization` no coincidente, el middleware lo usa primero | Elimina Headers extra, mantén solo uno que sepas que es correcto |
| `Authorization: Bearer<key>` sigue siendo 401 | Falta un espacio después de `Bearer`, no se puede eliminar el prefijo `Bearer ` | Cámbialo a `Authorization: Bearer <key>` |
| Todas las solicitudes son 401, el log muestra `api_key is empty` | `proxy.api_key` está vacío | Regenera/configura una key no vacía en el GUI |

## Resumen de esta lección

- Primero usa `/healthz` para localizar si el 401 proviene de la capa de autenticación del proxy
- Luego confirma `auth_mode` (especialmente el modo efectivo de `auto`)
- Finalmente lleva solo un Header que sepas que es correcto para verificar (evita la trampa de prioridad de Headers)

## Próxima lección

> En la próxima lección aprenderemos **[429/Error de capacidad: Expectativas correctas de rotación de cuentas y误解s de agotamiento de capacidad del modelo](../429-rotation/)**.
>
> Aprenderás:
> - Si 429 es "cuota insuficiente" o "limitación upstream"
> - Expectativas correctas de rotación de cuentas (cuándo cambia automáticamente, cuándo no)
> - Usar configuración para reducir la probabilidad de 429

---

## Apéndice: Referencias de código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones del código fuente</strong></summary>

> Actualizado: 2026-01-23

| Función        | Ruta de archivo                                                                                             | Línea    |
| ----------- | ---------------------------------------------------------------------------------------------------- | ------- |
| Enumeración ProxyAuthMode | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L5-L18) | 5-18 |
| ProxyConfig: allow_lan_access/auth_mode/api_key y valores predeterminados | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L258) | 174-258 |
| Análisis del modo auto (effective_auth_mode) | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L1-L30) | 1-30 |
| Middleware de autenticación (extracción y prioridad de Headers, excepción /healthz, permiso OPTIONS) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L77) | 14-77 |
| Registro de ruta /healthz y orden de middleware | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L170-L193) | 170-193 |
| Documentación de autenticación (modos y convenciones de cliente) | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L1-L45) | 1-45 |

**Enumeraciones clave**:
- `ProxyAuthMode::{Off, Strict, AllExceptHealth, Auto}`: modos de autenticación

**Funciones clave**:
- `ProxySecurityConfig::effective_auth_mode()`: analiza `auto` en una estrategia real
- `auth_middleware()`: ejecuta autenticación (incluye orden de extracción de Headers y excepción /healthz)

</details>
