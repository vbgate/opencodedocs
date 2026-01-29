---
title: "Solución de Invalid Grant: Recuperación de Cuenta Deshabilitada | Antigravity-Manager"
sidebarTitle: "Cómo recuperar una cuenta deshabilitada"
subtitle: "invalid_grant y deshabilitación automática de cuenta: por qué ocurre y cómo recuperarla"
description: "Aprende el significado del error invalid_grant y la lógica de procesamiento automático. Después de confirmar que refresh_token ha expirado, activa la reactivación automática volviendo a agregar la cuenta mediante OAuth, y verifica que la recuperación surta efecto en Proxy."
tags:
  - "FAQ"
  - "solución de problemas"
  - "OAuth"
  - "gestión de cuentas"
  - "invalid_grant"
prerequisite:
  - "start-add-account"
  - "start-first-run-data"
  - "advanced-scheduling"
order: 1
---
# invalid_grant y Deshabilitación Automática de Cuenta: Por Qué Ocurre y Cómo Recuperarla

## Lo Que Podrás Hacer Después de Esta Lección

- Cuando veas `invalid_grant`, sabrás qué tipo de problema de refresh_token corresponde
- Entender claramente "por qué la cuenta de repente no está disponible": en qué situaciones se deshabilita automáticamente y cómo maneja esto el sistema
- Recuperar la cuenta por el camino más corto y confirmar que la recuperación ya está surtiendo efecto en el Proxy que se está ejecutando

## Tu Situación Actual

- Al llamar al Proxy local, falla repentinamente y aparece `invalid_grant` en el mensaje de error
- La cuenta todavía está en la lista Accounts, pero el Proxy siempre la omite (o sientes que "ya nunca se usa")
- Cuando tienes pocas cuentas, después de encontrar `invalid_grant` una vez, la disponibilidad general disminuye claramente

## Qué Es invalid_grant

**invalid_grant** es un tipo de error que Google OAuth devuelve al actualizar `access_token`. Para Antigravity Tools, significa que el `refresh_token` de alguna cuenta probablemente ha sido revocado o expirado, y continuar reintentando solo causará fallas repetidas, por lo que el sistema marcará esa cuenta como no disponible y la eliminará del pool de proxies.

## Idea Central: El Sistema No Omite Temporalmente, Sino Que Deshabilita Permanentemente

Cuando el Proxy detecta que la cadena de error de actualización de token contiene `invalid_grant`, hace dos cosas:

1. **Escribe la cuenta como disabled** (persiste en el JSON de la cuenta)
2. **Elimina la cuenta del token pool en memoria** (evita seleccionar repetidamente la misma cuenta defectuosa)

Esta es la razón por la que ves "la cuenta sigue ahí, pero el Proxy ya no la usa".

::: info disabled vs proxy_disabled

- `disabled=true`: La cuenta está "completamente deshabilitada" (la razón típica es `invalid_grant`). Se omite directamente al cargar el pool de cuentas.
- `proxy_disabled=true`: La cuenta simplemente "no está disponible para Proxy" (deshabilitación manual/operación por lotes/lógica relacionada con protección de cuota), con una semántica diferente.

Estos dos estados se juzgan por separado al cargar el pool de cuentas: primero se juzga `disabled`, luego se hace el juicio de protección de cuota y `proxy_disabled`.

:::

## Sígueme

### Paso 1: Confirmar Si El invalid_grant Fue Disparado Por Actualización de refresh_token

**Por qué**: `invalid_grant` puede aparecer en múltiples cadenas de llamadas, pero la "deshabilitación automática" de este proyecto solo se dispara cuando **falla la actualización de access_token**.

En los registros del Proxy, verás registros de error similares (las palabras clave son `Token 刷新失败` + `invalid_grant`):

```text
Token 刷新失败 (<email>): <...invalid_grant...>，尝试下一个账号
Disabling account due to invalid_grant (<email>): refresh_token likely revoked/expired
```

**Lo que deberías ver**: Después de que una misma cuenta aparezca `invalid_grant`, muy pronto ya no será seleccionada (porque fue eliminada del token pool).

### Paso 2: Verificar El Campo disabled En El Archivo de Cuenta (Opcional, Pero Más Preciso)

**Por qué**: La deshabilitación automática es "persistente en disco", y después de confirmar el contenido del archivo, puedes descartar el juicio erróneo de "solo es rotación temporal".

El archivo de cuenta se encuentra en el directorio `accounts/` del directorio de datos de la aplicación (la ubicación del directorio de datos se encuentra en **[Primera Inicio: Directorio de Datos, Registros, Bandeja y Inicio Automático](../../start/first-run-data/)**). Cuando la cuenta está deshabilitada, el archivo mostrará estos tres campos:

```json
{
  "disabled": true,
  "disabled_at": 1700000000,
  "disabled_reason": "invalid_grant: ..."
}
```

**Lo que deberías ver**: `disabled` es `true`, y `disabled_reason` contiene el prefijo `invalid_grant:`.

### Paso 3: Recuperar La Cuenta (Método Recomendado: Volver a Agregar La Misma Cuenta)

**Por qué**: La "recuperación" de este proyecto no es hacer clic en un interruptor manualmente en el Proxy, sino activar la reactivación automática mediante "actualización explícita de token".

Ve a la página **Accounts**, vuelve a agregar la cuenta con tus nuevas credenciales (elige cualquiera de las dos formas):

1. Vuelve a realizar el proceso de autorización OAuth (ver **[Agregar Cuenta: Canales Doble OAuth/Refresh Token y Mejores Prácticas](../../start/add-account/)**)
2. Vuelve a agregar con un nuevo `refresh_token` (el sistema usará el correo devuelto por Google como estándar para hacer upsert)

Cuando el sistema detecta que el `refresh_token` o `access_token` que upsertaste esta vez es diferente del valor anterior, y la cuenta estaba previamente en `disabled=true`, automáticamente borrará:

- `disabled`
- `disabled_reason`
- `disabled_at`

**Lo que deberías ver**: La cuenta ya no está en estado disabled, y (si el Proxy se está ejecutando) el pool de cuentas se recargará automáticamente, haciendo que la recuperación surta efecto inmediatamente.

### Paso 4: Verificar Si La Recuperación Ya Está Surtiendo Efecto En El Proxy

**Por qué**: Si solo tienes una cuenta, u otras cuentas tampoco están disponibles, después de la recuperación deberías ver inmediatamente "la disponibilidad ha vuelto".

Método de verificación:

1. Inicia una solicitud que active la actualización de token (por ejemplo, espera a que el token esté cerca de expirar y luego solicita)
2. Observa que los registros ya no muestran el mensaje de "omitir cuenta disabled"

**Lo que deberías ver**: La solicitud pasa normalmente, y los registros ya no muestran el flujo de deshabilitación `invalid_grant` para esa cuenta.

## Advertencias Sobre Problemas Comunes

### ❌ Tratar disabled Como "Rotación Temporal"

Si solo miras "la cuenta todavía está ahí" en la UI, es fácil juzgar erróneamente que "el sistema simplemente no la está usando temporalmente". Pero `disabled=true` se escribe en el disco, y continuará surtiendo efecto incluso después de reiniciar.

### ❌ Solo Complementar access_token, No Actualizar refresh_token

El punto de disparo de `invalid_grant` es el `refresh_token` utilizado al actualizar `access_token`. Si solo obtienes temporalmente un `access_token` que todavía funciona, pero `refresh_token` sigue inválido, luego se disparará nuevamente la deshabilitación.

## Puntos de Control ✅

- [ ] Puedes confirmar en los registros que `invalid_grant` proviene de la falla de actualización de refresh_token
- [ ] Conoces la diferencia semántica entre `disabled` y `proxy_disabled`
- [ ] Puedes recuperar la cuenta volviendo a agregarla (OAuth o refresh_token)
- [ ] Puedes verificar que la recuperación ya está surtiendo efecto en el Proxy que se está ejecutando

## Resumen de Esta Lección

- Cuando se dispara `invalid_grant`, el Proxy **persistirá la cuenta como disabled** y la eliminará del token pool, evitando fallas repetidas
- La clave para la recuperación es "actualización explícita de token" (volver a OAuth o volver a agregar con un nuevo refresh_token), el sistema borrará automáticamente los campos `disabled_*`
- El JSON de cuenta en el directorio de datos es la fuente de estado más autorizada (deshabilitación/razón/tiempo están todos ahí)

## Próxima Lección

> En la próxima lección aprenderemos **[401/Fallo de Autenticación: auth_mode, Compatibilidad de Header y Lista de Verificación de Configuración del Cliente](../auth-401/)**.
>
> Aprenderás:
> - 401 generalmente es qué capa no coincide entre "modo/Key/Header"
> - Qué header de autenticación deben llevar diferentes clientes
> - Cómo hacer autoverificación y reparación por el camino más corto

---

## Apéndice: Referencias de Código Fuente

<details>
<summary><strong>Haz clic para expandir ubicaciones de código fuente</strong></summary>

> Última actualización: 2026-01-23

| Función | Ruta del Archivo | Líneas |
|--- | --- | ---|
| Explicación de diseño: problema de invalid_grant y comportamiento de cambios | [`docs/proxy-invalid-grant.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy-invalid-grant.md#L1-L52) | 1-52 |
| Omitir `disabled=true` al cargar el pool de cuentas | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L70-L158) | 70-158 |
| Identificar `invalid_grant` al fallar la actualización de token y deshabilitar la cuenta | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L840-L890) | 840-890 |
| Persistir escritura de `disabled/disabled_at/disabled_reason` y eliminar de memoria | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L942-L969) | 942-969 |
| Truncamiento de `disabled_reason` (evitar inflación del archivo de cuenta) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L1464-L1471) | 1464-1471 |
| Limpiar automáticamente `disabled_*` en upsert (cambio de token se considera que el usuario ya reparó las credenciales) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L178-L206) | 178-206 |
| Recargar automáticamente las cuentas del proxy después de volver a agregar la cuenta (surte efecto inmediatamente mientras se ejecuta) | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L21-L59) | 21-59 |

</details>
