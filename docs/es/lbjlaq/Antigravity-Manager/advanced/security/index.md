---
title: "Seguridad: configuración de privacidad y autenticación | Antigravity-Manager"
sidebarTitle: "No dejes tu LAN expuesta"
subtitle: 'Seguridad y privacidad: auth_mode, allow_lan_access, y el diseño "no filtres información de la cuenta"'
description: "Aprende los métodos de configuración de seguridad de Antigravity Tools. Domina los 4 modos de auth_mode, las diferencias de dirección de allow_lan_access, la configuración de api_key y la verificación con /healthz, evitando filtrar información de la cuenta."
tags:
  - "seguridad"
  - "privacidad"
  - "auth_mode"
  - "allow_lan_access"
  - "api_key"
prerequisite:
  - "start-getting-started"
  - "start-proxy-and-first-client"
duration: 16
order: 2
---

# Seguridad y privacidad: auth_mode, allow_lan_access, y el diseño "no filtres información de la cuenta"

Cuando usas Antigravity Tools como "puerta de enlace de IA local", los problemas de seguridad suelen girar en torno a 2 cosas: a quién expones el servicio (solo la máquina local, o toda la red de área local/Internet pública), y si las solicitudes externas necesitan API Key. Esta lección explica claramente las reglas en el código fuente y te da un conjunto de línea base de seguridad mínimo que puedes seguir directamente.

## Qué puedes hacer al finalizar

- Elegir correctamente `allow_lan_access`: saber que afecta la dirección de escucha (`127.0.0.1` vs `0.0.0.0`)
- Elegir correctamente `auth_mode`: comprender el comportamiento real de `off/strict/all_except_health/auto`
- Configurar y verificar `api_key`: poder usar `curl` para ver claramente "si realmente está activada la autenticación"
- Conocer los límites de la protección de privacidad: la clave local de proxy no se reenvía al upstream; para los mensajes de error del cliente API, evitar filtrar el correo electrónico de la cuenta

## Tu situación actual

- Quieres que el teléfono/u otra computadora acceda, pero te preocupas de que al habilitar el acceso a la LAN quedes "expuesto"
- Quieres activar la autenticación, pero no estás seguro si `/healthz` debería estar exento, por miedo a romper la verificación de estado
- Te preocupa filtrar la clave local, cookies o correo electrónico de la cuenta a clientes externos o plataformas upstream

## Cuándo usar este enfoque

- Vas a habilitar `allow_lan_access` (NAS, red doméstica, red de equipo)
- Vas a usar cloudflared/proxy inverso para exponer el servicio local a Internet (primero mira **[Túnel con Cloudflared de un solo clic](/es/lbjlaq/Antigravity-Manager/platforms/cloudflared/)**)
- Te encuentras con `401`, y necesitas confirmar si es "no llevas key" o "los modos no coinciden"

## 🎒 Preparativos antes de comenzar

::: warning Requisitos previos
- Ya puedes iniciar API Proxy en la GUI (si aún no funciona, primero mira **[Iniciar proxy inverso local y conectar el primer cliente](/es/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**).
- Sabes qué problema quieres resolver: solo acceso local, o acceso a la red de área local/Internet.
:::

::: info Los 3 campos que aparecerán repetidamente en esta lección
- `allow_lan_access`: si permite el acceso a la red de área local.
- `auth_mode`: política de autenticación (decide qué rutas deben llevar key).
- `api_key`: API Key del proxy local (solo para autenticación del proxy local, no se reenvía al upstream).
:::

## ¿Qué es auth_mode?

**auth_mode** es el "interruptor de autenticación de proxy + política de exenciones" de Antigravity Tools. Decide qué solicitudes deben llevar `proxy.api_key` cuando los clientes externos acceden a los puntos finales del proxy local, y si la ruta de verificación de estado como `/healthz` permite acceso sin autenticación.

## Idea central

1. Primero determina la "superficie de exposición": cuando `allow_lan_access=false` solo escucha en `127.0.0.1`; cuando es `true`, escucha en `0.0.0.0`.
2. Luego determina la "llave de entrada": `auth_mode` decide si debes llevar key, y si `/healthz` está exento.
3. Finalmente, haz el "cierre de privacidad": no reenvíes la clave de proxy local/cookies al upstream; en los mensajes de error externos, intenta no incluir el correo electrónico de la cuenta.

## Sígueme

### Paso 1: primero decide si quieres habilitar el acceso a la red de área local (allow_lan_access)

**Por qué**
Solo deberías habilitar el acceso a la LAN cuando "necesitas que otros dispositivos accedan", de lo contrario, el valor predeterminado de solo acceso local es la estrategia de seguridad más sencilla.

En `ProxyConfig`, la dirección de escucha está determinada por `allow_lan_access`:

```rust
pub fn get_bind_address(&self) -> &str {
    if self.allow_lan_access {
        "0.0.0.0"
    } else {
        "127.0.0.1"
    }
}
```

En la página `API Proxy` de la GUI, simplemente establece el interruptor "Permitir acceso a la red de área local" según tus necesidades.

**Deberías ver**
- Cuando está cerrado: el mensaje tiene el significado de "solo acceso local" (el texto específico depende del paquete de idiomas)
- Cuando está abierto: la interfaz mostrará una advertencia de riesgo prominente (recordando que esto es una "expansión de la superficie de exposición")

### Paso 2: elige un auth_mode (se recomienda usar auto primero)

**Por qué**
`auth_mode` no es solo "activar/desactivar autenticación", también decide si las rutas de verificación de estado como `/healthz` están exentas.

El proyecto soporta 4 modos (del archivo `docs/proxy/auth.md`):

- `off`: ninguna ruta necesita autenticación
- `strict`: todas las rutas necesitan autenticación
- `all_except_health`: excepto `/healthz`, todas las demás rutas necesitan autenticación
- `auto`: modo automático, derivará la política real según `allow_lan_access`

La lógica de derivación de `auto` está en `ProxySecurityConfig::effective_auth_mode()`:

```rust
match self.auth_mode {
    ProxyAuthMode::Auto => {
        if self.allow_lan_access {
            ProxyAuthMode::AllExceptHealth
        } else {
            ProxyAuthMode::Off
        }
    }
    ref other => other.clone(),
}
```

**Enfoque recomendado**
- Solo acceso local: `allow_lan_access=false` + `auth_mode=auto` (finalmente equivalente a `off`)
- Acceso a la LAN: `allow_lan_access=true` + `auth_mode=auto` (finalmente equivalente a `all_except_health`)

**Deberías ver**
- En la página `API Proxy`, el menú desplegable "Auth Mode" tiene 4 opciones: `off/strict/all_except_health/auto`

### Paso 3: confirma tu api_key (regénéralo si es necesario)

**Por qué**
Siempre que tu proxy necesite acceso externo (LAN/Internet), `api_key` debe tratarse como una contraseña.

De forma predeterminada, `ProxyConfig::default()` generará una clave con el formato `sk-...`:

```rust
api_key: format!("sk-{}", uuid::Uuid::new_v4().simple()),
```

En la página `API Proxy`, puedes editar, regenerar y copiar el `api_key` actual.

**Deberías ver**
- En la página hay un campo de entrada `api_key`, y botones de editar/regenerar/copiar

### Paso 4: usa /healthz para verificar si la "política de exención" cumple tus expectativas

**Por qué**
`/healthz` es el ciclo cerrado más corto: no necesitas llamar realmente al modelo, puedes confirmar "el servicio es accesible + la política de autenticación es correcta".

Reemplaza `<PORT>` con tu propio puerto (predeterminado `8045`):

::: code-group

```bash [macOS/Linux]
curl -sS "http://127.0.0.1:<PORT>/healthz"
```

```powershell [Windows]
curl.exe -sS "http://127.0.0.1:<PORT>/healthz"
```

:::

**Deberías ver**

```json
{"status":"ok"}
```

::: details Si configuras auth_mode como strict
`strict` no exime `/healthz`. Necesitas llevar la key:

```bash
curl -sS "http://127.0.0.1:<PORT>/healthz" \
  -H "Authorization: Bearer <API_KEY>"
```
:::

### Paso 5: usa un "punto final que no sea health" para verificar 401 (y con key ya no es 401)

**Por qué**
Quieres confirmar que el middleware de autenticación realmente está funcionando, no que hayas seleccionado el modo en la UI pero realmente no surte efecto.

El siguiente cuerpo de solicitud está deliberadamente incompleto; su propósito no es "llamada exitosa", sino verificar si está interceptado por autenticación:

```bash
#Sin key: cuando auth_mode != off, debería ser directamente 401
curl -i "http://127.0.0.1:<PORT>/v1/messages" \
  -H "Content-Type: application/json" \
  -d "{}"

#Con key: ya no debería ser 401 (puede devolver 400/422, porque el cuerpo de la solicitud está incompleto)
curl -i "http://127.0.0.1:<PORT>/v1/messages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <API_KEY>" \
  -d "{}"
```

**Deberías ver**
- Sin key: `HTTP/1.1 401 Unauthorized`
- Con key: el código de estado ya no es 401

## Punto de control ✅

- Puedes explicar claramente tu superficie de exposición actual: solo máquina local (127.0.0.1) o red de área local (0.0.0.0)
- Cuando `auth_mode=auto`, puedes predecir el modo real que entra en vigor (LAN -> `all_except_health`, máquina local -> `off`)
- Puedes reproducir "401 sin key" con 2 comandos `curl`

## Advertencias sobre problemas comunes

::: warning Enfoque incorrecto vs enfoque recomendado

| Escenario | ❌ Error común | ✓ Enfoque recomendado |
| --- | --- | --- |
| Necesitas acceso a la red de área local | Solo abrir `allow_lan_access=true`, pero `auth_mode=off` | Usa `auth_mode=auto`, y configura una `api_key` fuerte |
| Activaste autenticación pero sigues obteniendo 401 | El cliente lleva key, pero el nombre del header no es compatible | El proxy es compatible con tres tipos de header: `Authorization`/`x-api-key`/`x-goog-api-key` |
| Activaste autenticación pero no configuraste key | `api_key` está vacío y también abriste la autenticación | El backend rechazará directamente (el registro indicará que key está vacío) |
:::

::: warning La exención de /healthz solo entra en vigor con all_except_health
El middleware permitirá cuando el "modo efectivo" es `all_except_health` y la ruta es `/healthz`; debes tratarlo como "puerto de verificación de estado", no lo uses como API de negocio.
:::

## Privacidad y el diseño "no filtres información de la cuenta"

### 1) La clave local de proxy no se reenvía al upstream

La autenticación solo ocurre en la entrada del proxy local; el archivo `docs/proxy/auth.md` lo explica claramente: la clave de API de proxy no se reenvía al upstream.

### 2) Al reenviar a z.ai, se reducirán deliberadamente los headers que se pueden reenviar

Cuando la solicitud se reenvía a z.ai (compatible con Anthropic), el código solo permitirá pasar un pequeño conjunto de headers, para evitar llevar la clave de proxy local o cookies:

```rust
// Solo reenvía un conjunto conservador de headers para evitar filtrar la clave de proxy local o cookies.
```

### 3) El mensaje de error de fallo de actualización de token evita incluir el correo electrónico de la cuenta

Cuando falla la actualización del token, el registro registrará la cuenta específica, pero el error devuelto al cliente API se reescribirá en una forma que no incluye el correo electrónico:

```rust
// Evita filtrar correos electrónicos de cuentas a los clientes API; los detalles aún están en los registros.
last_error = Some(format!("Token refresh failed: {}", e));
```

## Resumen de esta lección

- Primero determina la superficie de exposición (`allow_lan_access`), luego la llave de entrada (`auth_mode` + `api_key`)
- La regla de `auth_mode=auto` es simple: LAN es al menos `all_except_health`, solo máquina local es `off`
- La línea base de privacidad es "la clave local no se lleva externamente, el correo electrónico de la cuenta no se filtra en mensajes de error externos", los detalles están en el middleware y el código de reenvío upstream

## Próximo capítulo

> En el siguiente capítulo veremos **[Programación de alta disponibilidad: rotación, cuenta fija, sesión pegajosa y reintento tras fallo](/es/lbjlaq/Antigravity-Manager/advanced/scheduling/)**, completando la "salida estable" después de la "entrada segura".

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver las ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta del archivo | Línea |
| --- | --- | --- |
| Los cuatro modos de auth_mode y explicación de la semántica de auto | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L10-L24) | 10-24 |
| Enumeración ProxyAuthMode y valor predeterminado (predeterminado off) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L5-L18) | 5-18 |
| Campos clave y valores predeterminados de ProxyConfig (allow_lan_access, api_key) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L259) | 174-259 |
| Derivación de dirección de escucha (127.0.0.1 vs 0.0.0.0) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L281-L292) | 281-292 |
| Lógica de derivación de auto -> effective_auth_mode | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L10-L30) | 10-30 |
| Middleware de autenticación (OPTIONS permitidos, /healthz exento, compatibilidad con tres tipos de header) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| UI: interruptores/menús desplegables de allow_lan_access y auth_mode | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L943-L1046) | 943-1046 |
| UI: edición/restablecimiento/copia de api_key | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1048-L1120) | 1048-1120 |
| Deshabilitación automática de invalid_grant y reescritura de errores "evita filtrar correos electrónicos" | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L841-L940) | 841-940 |
| disable_account: escribe disabled/disabled_at/disabled_reason y elimina del pool de memoria | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L942-L969) | 942-969 |
| Reducción de headers que se pueden reenviar al reenviar a z.ai (evita filtrar claves/cookies locales) | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L89) | 70-89 |
| Explicación del comportamiento de deshabilitación del pool de cuentas y visualización en la UI (documentación) | [`docs/proxy/accounts.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/accounts.md#L9-L44) | 9-44 |

</details>
