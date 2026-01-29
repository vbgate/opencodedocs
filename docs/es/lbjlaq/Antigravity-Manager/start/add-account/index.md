---
title: "Agregar cuenta: OAuth y Refresh Token | Antigravity Tools"
sidebarTitle: "Agregar tu cuenta de Google"
subtitle: "Agregar cuenta: dos vías OAuth/Refresh Token y mejores prácticas"
description: "Aprende las dos formas de agregar cuentas en Antigravity Tools. Mediante OAuth autoriza con un clic o manualmente con Refresh Token, admite importación por lotes, maneja fallos de callback y valida el pool de cuentas."
tags:
  - "Gestión de cuentas"
  - "OAuth"
  - "refresh_token"
  - "Google"
  - "Mejores prácticas"
prerequisite:
  - "start-getting-started"
duration: 15
order: 4
---

# Agregar cuenta: dos vías OAuth/Refresh Token y mejores prácticas

En Antigravity Tools, "agregar cuenta" significa escribir el `refresh_token` de la cuenta de Google en el pool de cuentas local, para que las solicitudes de proxy inverso posteriores puedan usarlas de forma rotativa. Puedes seguir OAuth para autorizar con un clic, o copiar y pegar el `refresh_token` para agregar manualmente.

## Qué puedes hacer al finalizar

- Agregar cuentas de Google al pool de cuentas de Antigravity Tools mediante OAuth o Refresh Token
- Copiar/abrir manualmente el enlace de autorización, y completar automáticamente la adición después de que el callback sea exitoso
- Saber cómo manejar problemas como no obtener `refresh_token`, incapacidad de conectar a `localhost` en el callback

## Tu situación actual

- Haces clic en "Autorizar OAuth" pero sigue girando, o el navegador muestra `localhost refused to connect`
- La autorización fue exitosa, pero muestra "No se pudo obtener Refresh Token"
- Solo tienes `refresh_token` a mano y no sabes cómo importarlos por lotes de una vez

## Cuándo usar este enfoque

- Quieres agregar cuentas de la forma más estable (priorizar OAuth)
- Te importa más la portabilidad/respaldo (Refresh Token es más adecuado como "activo del pool de cuentas")
- Necesitas agregar muchas cuentas y quieres importar `refresh_token` por lotes (admite extracción desde texto/JSON)

## 🎒 Preparativos antes de comenzar

- Ya has instalado y puedes abrir la aplicación de escritorio de Antigravity Tools
- Sabes dónde está la entrada: entra en la página `Accounts` desde la navegación izquierda (ruta en `source/lbjlaq/Antigravity-Manager/src/App.tsx`)

::: info Dos palabras clave en esta lección
**OAuth**: un proceso de "ir al navegador para iniciar sesión y autorizar". Antigravity Tools iniciará temporalmente una dirección de callback local (`http://localhost/127.0.0.1/[::1]:<port>/oauth-callback`, seleccionando automáticamente según la situación de escucha IPv4/IPv6 del sistema), esperará a que el navegador regrese con `code` y luego intercambiará por token. (implementación en `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/oauth_server.rs`)

**refresh_token**: una credencial que "puede usarse a largo plazo para actualizar access_token". Al agregar una cuenta en este proyecto, se usará primero para obtener access_token, luego obtener el correo real de Google e ignorar el email que ingreses en el frontend. (implementación en `source/lbjlaq/Antigravity-Manager/src-tauri/src/commands/mod.rs`)
:::

## Idea central

"Agregar cuenta" en Antigravity Tools, en última instancia, se trata de obtener un `refresh_token` disponible y escribir la información de la cuenta en el pool de cuentas local.

- **Vía OAuth**: la aplicación te ayuda a generar el enlace de autorización y escuchar el callback local; después de que la autorización se complete, intercambia automáticamente el token y guarda la cuenta (ver `prepare_oauth_url`, `start_oauth_login`, `complete_oauth_login`)
- **Vía Refresh Token**: pegas directamente el `refresh_token`, la aplicación lo usará para actualizar el access_token y obtener el correo real de Google para guardarlo en disco (ver `add_account`)

## Sígueme

### Paso 1: abrir el diálogo "Agregar cuenta"

**Por qué**
Todas las entradas de adición están centralizadas en la página `Accounts`.

Operación: entra en la página `Accounts` y haz clic en el botón **Add Account** a la derecha (componente: `AddAccountDialog`).

**Deberías ver**: aparece un diálogo con 3 pestañas: `OAuth` / `Refresh Token` / `Import` (ver `source/lbjlaq/Antigravity-Manager/src/components/accounts/AddAccountDialog.tsx`).

### Paso 2: prioriza OAuth para autorizar con un clic (recomendado)

**Por qué**
Esta es la ruta predeterminada recomendada por el producto: deja que la aplicación genere el enlace de autorización, abra automáticamente el navegador y complete el guardado automáticamente cuando regrese el callback.

1. Cambia a la pestaña `OAuth`.
2. Primero copia el enlace de autorización: al abrir el diálogo, llamará automáticamente a `prepare_oauth_url` para pregenerar la URL (llamada del frontend en `AddAccountDialog.tsx:111-125`; generación y escucha del backend en `oauth_server.rs`).
3. Haz clic en **Start OAuth** (correspondiente al frontend `startOAuthLogin()` / backend `start_oauth_login`), para que la aplicación abra el navegador predeterminado y comience a esperar el callback.

**Deberías ver**:
- Aparece un enlace de autorización copiable en el diálogo (nombre del evento: `oauth-url-generated`)
- El navegador abre la página de autorización de Google; después de autorizar, redirigirá a una dirección local y mostrará "Authorization Successful!" (`oauth_success_html()`)

### Paso 3: cuando OAuth no se completa automáticamente, usa "Finish OAuth" para completar manualmente

**Por qué**
El proceso de OAuth tiene dos partes: el navegador obtiene `code` mediante autorización, luego la aplicación usa `code` para intercambiar token. Incluso si no hiciste clic en "Start OAuth", mientras abras manualmente el enlace de autorización y completes el callback, el diálogo intentará completar automáticamente; si no se completa con éxito, puedes hacerlo manualmente una vez.

1. Si "copiaste el enlace y lo abriste en tu propio navegador" (en lugar del navegador predeterminado), después de que el callback de autorización regrese, la aplicación recibirá el evento `oauth-callback-received` y llamará automáticamente a `completeOAuthLogin()` (ver `source/lbjlaq/Antigravity-Manager/src/components/accounts/AddAccountDialog.tsx:67-109`).
2. Si no ves que se complete automáticamente, haz clic en **Finish OAuth** en el diálogo (correspondiente al backend `complete_oauth_login`).

**Deberías ver**: el diálogo muestra éxito y se cierra automáticamente; aparece una nueva cuenta en la lista `Accounts`.

::: tip Truco: cuando el callback no puede conectar, prioriza copiar el enlace
El backend intentará escuchar tanto IPv6 `::1` como IPv4 `127.0.0.1` al mismo tiempo, y seleccionará `localhost/127.0.0.1/[::1]` como dirección de callback según la situación de escucha, principalmente para evitar fallos de conexión causados por "el navegador resuelve localhost a IPv6". (ver `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/oauth_server.rs:53-113`)
:::

### Paso 4: agregar manualmente con Refresh Token (admite por lotes)

**Por qué**
Cuando no puedes obtener `refresh_token` (o prefieres "activo portable"), agregar directamente con Refresh Token es más controlable.

1. Cambia a la pestaña `Refresh Token`.
2. Pega el `refresh_token` en el cuadro de texto.

Formas de entrada admitidas (el frontend analizará y agregará por lotes):

| Tipo de entrada | Ejemplo | Lógica de análisis |
| --- | --- | --- |
| Texto de token puro | `1//abc...` | Extracción por expresión regular: `/1\/\/[a-zA-Z0-9_\-]+/g` (ver `AddAccountDialog.tsx:213-220`) |
| Insertado en un texto grande | texto de registro/exportación contiene múltiples `1//...` | Extracción por lotes por regex y desduplicación (ver `AddAccountDialog.tsx:213-224`) |
| Array JSON | `[{"refresh_token":"1//..."}]` | Analizar el array y tomar `item.refresh_token` (ver `AddAccountDialog.tsx:198-207`) |

Después de hacer clic en **Confirm**, el diálogo llamará a `onAdd("", token)` uno por uno según la cantidad de tokens (ver `AddAccountDialog.tsx:231-248`), que finalmente llegara al backend `add_account`.

**Deberías ver**:
- El diálogo muestra el progreso por lotes (por ejemplo `1/5`)
- Después del éxito, aparece una nueva cuenta en la lista `Accounts`

### Paso 5: confirmar "el pool de cuentas está disponible"

**Por qué**
Agregado exitosamente no significa "puedes usarlo de forma estable inmediatamente". El backend activará automáticamente un "refresh de cuota" después de agregar, y cuando Proxy se esté ejecutando, intentará recargar el token pool para que los cambios surtan efecto de inmediato.

Puedes confirmar con estas 2 señales:

1. La cuenta aparece en la lista y muestra el correo (el correo proviene del backend `get_user_info`, no del email que ingresaste).
2. La información de cuota/suscripción de la cuenta comienza a actualizarse (el backend llamará automáticamente a `internal_refresh_account_quota`).

**Deberías ver**: después de agregar, no necesitas hacer clic manualmente en actualizar, la cuenta comenzará a mostrar información de cuota (el éxito se basa en la visualización real de la interfaz).

## Puntos de verificación ✅

- Puedes ver el correo de la cuenta recién agregada en la lista de cuentas
- No se queda en estado "loading" más tiempo del que puedas aceptar (después de que se complete el callback de OAuth, debería completarse rápidamente)
- Si estás ejecutando Proxy, las cuentas recién agregadas pueden participar en la programación rápidamente (el backend intentará recargar)

## Advertencias sobre problemas comunes

### 1) OAuth muestra "No se pudo obtener Refresh Token"

El backend en `start_oauth_login/complete_oauth_login` verificará explícitamente si existe `refresh_token`; si no existe, devolverá un mensaje de error con solución (ver `source/lbjlaq/Antigravity-Manager/src-tauri/src/commands/mod.rs:45-56`).

Sigue el método de manejo sugerido por el código fuente:

1. Abre `https://myaccount.google.com/permissions`
2. Revoca el acceso de **Antigravity Tools**
3. Vuelve a la aplicación y sigue OAuth nuevamente

> También puedes cambiar directamente a la vía Refresh Token de esta lección.

### 2) El navegador muestra `localhost refused to connect`

El callback de OAuth necesita que el navegador solicite la dirección de callback local. Para reducir la tasa de fallos, el backend:

- Intentará escuchar `127.0.0.1` y `::1` al mismo tiempo
- Solo usará `localhost` cuando ambos estén disponibles, de lo contrario forzará `127.0.0.1` o `[::1]`

La implementación correspondiente está en `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/oauth_server.rs:53-113`.

### 3) Cambiar a otra pestaña cancelará la preparación de OAuth

Cuando el diálogo cambia de `OAuth` a otra pestaña, el frontend llamará a `cancelOAuthLogin()` y vaciará la URL (ver `AddAccountDialog.tsx:127-136`).

Si estás en medio de la autorización, no te apresures a cambiar de pestaña.

### 4) Ejemplos correctos/incorrectos de Refresh Token

| Ejemplo | ¿Se reconoce? | Razón |
| --- | --- | --- |
| `1//0gAbC...` | ✓ | Cumple la regla de prefijo `1//` (ver `AddAccountDialog.tsx:215-219`) |
| `ya29.a0...` | ✗ | No cumple la regla de extracción del frontend, se considerará entrada no válida |

## Resumen de esta lección

- OAuth: adecuado para "rápido", también admite copiar el enlace a tu navegador habitual y completar automáticamente/manualmente
- Refresh Token: adecuado para "estable" y "portable", admite extracción por lotes de `1//...` desde texto/JSON
- Cuando no puedas obtener `refresh_token`, revoca la autorización según el mensaje de error y repite, o cambia directamente a Refresh Token

## Próximo capítulo

En el próximo capítulo haremos algo más práctico: convertir el pool de cuentas en "activo portable".

> Ve a aprender **[Respaldo y migración de cuentas: importación/exportación, migración en caliente V1/DB](/es/lbjlaq/Antigravity-Manager/start/backup-migrate/)**.

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver las ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta del archivo | Línea |
| --- | --- | --- |
| Página Accounts monta el diálogo de adición | [`src/pages/Accounts.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Accounts.tsx#L267-L731) | 267-731 |
| Pregeneración de URL OAuth + finalización automática de eventos de callback | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L49-L125) | 49-125 |
| Evento de callback OAuth activa `completeOAuthLogin()` | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L67-L109) | 67-109 |
| Análisis por lotes y desduplicación de Refresh Token | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L185-L268) | 185-268 |
| Frontend llama a comandos Tauri (add/OAuth/cancel) | [`src/services/accountService.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/services/accountService.ts#L5-L91) | 5-91 |
| Backend add_account: ignora email, usa refresh_token para obtener correo real y guardar | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L19-L60) | 19-60 |
| Backend OAuth: verifica ausencia de refresh_token y proporciona solución de revocación | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L38-L79) | 38-79 |
| Server de callback OAuth: escucha IPv4/IPv6 simultáneamente y selecciona redirect_uri | [`src-tauri/src/modules/oauth_server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/oauth_server.rs#L43-L113) | 43-113 |
| Callback OAuth analiza `code` y emite `oauth-callback-received` | [`src-tauri/src/modules/oauth_server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/oauth_server.rs#L140-L180) | 140-180 |

**Nombres de eventos clave**:
- `oauth-url-generated`: backend envía la URL OAuth al frontend después de generarla (ver `oauth_server.rs:250-252`)
- `oauth-callback-received`: backend notifica al frontend después de recibir el callback y analizar el code (ver `oauth_server.rs:177-180` / `oauth_server.rs:232-235`)

**Comandos clave**:
- `prepare_oauth_url`: pregenera enlace de autorización e inicia escucha de callback (ver `src-tauri/src/commands/mod.rs:469-473`)
- `start_oauth_login`: abre el navegador predeterminado y espera el callback (ver `src-tauri/src/commands/mod.rs:339-401`)
- `complete_oauth_login`: no abre el navegador, solo espera el callback y completa el intercambio de token (ver `src-tauri/src/commands/mod.rs:405-467`)
- `add_account`: guarda la cuenta usando refresh_token (ver `src-tauri/src/commands/mod.rs:19-60`)

</details>
