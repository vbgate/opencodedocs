---
title: "Solución 429: Rotación de cuentas y manejo de errores | Antigravity-Manager"
sidebarTitle: "Error 429: Rotación automática de cuentas"
subtitle: "Solución 429: Rotación de cuentas y manejo de errores"
description: "Aprende los métodos de solución de errores 429 de Antigravity Tools. Domina la identificación y manejo de errores como QUOTA_EXHAUSTED y RATE_LIMIT_EXCEEDED. Usa Monitor y X-Account-Email para localizar rápidamente problemas."
tags:
  - "FAQ"
  - "Solución de errores"
  - "Programación de cuentas"
  - "Error 429"
prerequisite:
  - "start-getting-started"
  - "advanced-scheduling"
order: 3
---
# Error 429/Capacidad: Expectativas correctas de rotación de cuentas y malentendidos sobre agotamiento de capacidad del modelo

## Lo que podrás hacer al finalizar

- Diferenciar correctamente entre "cuota insuficiente" y "limitación del upstream", evitando juicios erróneos
- Entender el mecanismo de rotación automática y el comportamiento esperado de Antigravity Tools
- Al encontrar errores 429, saber cómo localizar rápidamente el problema y optimizar la configuración

## Tu situación actual

- Ves errores 429 y asumes incorrectamente que "el modelo no tiene capacidad"
- Configuraste varias cuentas pero sigues encontrando 429 con frecuencia, sin saber si es un problema de configuración o de cuentas
- No estás claro cuándo el sistema cambiará automáticamente de cuenta y cuándo se "atascará"

## Enfoque central

### ¿Qué es el error 429?

**429 Too Many Requests** es un código de estado HTTP. En Antigravity Tools, 429 no solo representa "demasiadas solicitudes", sino que también puede ser una señal de "no puedes usarlo temporalmente" como cuota agotada, sobrecarga temporal del modelo, etc.

::: info El proxy intentará identificar la causa del 429

El proxy intentará analizar `error.details[0].reason` o `error.message` del cuerpo de la respuesta, clasificando 429 en varias categorías (según lo que realmente se devuelva):

| Tipo identificado por el proxy | reason / pista común | Característica típica |
|--- | --- | ---|
| **Cuota agotada** | `QUOTA_EXHAUSTED` / el texto contiene `exhausted`, `quota` | Es posible que necesites esperar a que la cuota se actualice |
| **Límite de velocidad** | `RATE_LIMIT_EXCEEDED` / el texto contiene `per minute`, `rate limit`, `too many requests` | Generalmente enfriamiento de nivel de decenas de segundos |
| **Capacidad del modelo insuficiente** | `MODEL_CAPACITY_EXHAUSTED` / el texto contiene `model_capacity` | Comúnmente sobrecarga temporal, se puede recuperar más tarde |
| **Desconocido** | No se puede analizar | Sigue la estrategia de enfriamiento predeterminada |

:::

### Manejo automático de Antigravity Tools

Cuando una solicitud encuentra 429 (y algunos estados de 5xx/sobrecarga), el proxy generalmente hará dos cosas en el lado del servidor:

1. **Registrar el tiempo de enfriamiento**: escribe este error en `RateLimitTracker`, y en selecciones posteriores de cuentas se evitará activamente las cuentas "aún en enfriamiento".
2. **Rotar cuentas en el reintento**: los Handlers realizarán múltiples intentos dentro de una sola solicitud, y al reintentarán con `force_rotate=true`, lo que activa que TokenManager seleccione la siguiente cuenta disponible.

::: tip ¿Cómo sabes si cambió de cuenta?
Incluso si tu cuerpo de solicitud no cambia, la respuesta generalmente incluirá `X-Account-Email` (y `X-Mapped-Model`), puedes usarlo para verificar "qué cuenta se usó realmente en esta solicitud".
:::

## ¿Cuándo encontrarás errores 429?

### Escenario 1: Solicitudes demasiado rápidas en una sola cuenta

**Fenómeno**: incluso con una sola cuenta, enviar una gran cantidad de solicitudes en poco tiempo también activará 429.

**Causa**: cada cuenta tiene sus propios límites de velocidad (RPM/TPM), si se exceden se limitará.

**Solución**:
- Aumentar la cantidad de cuentas
- Reducir la frecuencia de solicitudes
- Usar el modo de cuenta fija para distribuir la presión (consulta "Modo de cuenta fija" para más detalles)

### Escenario 2: Todas las cuentas limitadas simultáneamente

**Fenómeno**: hay varias cuentas, pero todas las cuentas devuelven 429.

**Causas**:
- El número total de cuentas no es suficiente para soportar tu frecuencia de solicitudes
- Todas las cuentas activan la limitación/sobrecarga casi al mismo tiempo

**Solución**:
- Agregar más cuentas
- Ajustar el modo de programación a "rendimiento primero" (saltar sesión pegajosa y reutilización de ventana de 60s)
- Verificar si la protección de cuota está excluyendo incorrectamente cuentas disponibles

### Escenario 3: Cuenta incorrectamente juzgada por protección de cuota

**Fenómeno**: la cuota de una cuenta es muy suficiente, pero el sistema sigue saltándola.

**Causas**:
- La **protección de cuota** está activada, el umbral está configurado demasiado alto
- La cuota de un modelo específico de esa cuenta está por debajo del umbral
- La cuenta está marcada manualmente como `proxy_disabled`

**Solución**:
- Verificar la configuración de protección de cuota (Settings → Quota Protection), ajusta el umbral y el modelo de monitoreo según tu intensidad de uso
- En los datos de la cuenta, verifica `protected_models`, confirma si fue saltada por la estrategia de protección

## Sigue mis pasos

### Paso 1: Identificar el tipo de error 429

**Por qué**: diferentes tipos de errores 429 requieren diferentes métodos de manejo.

En Proxy Monitor, observa el cuerpo de respuesta de errores 429, enfócate en dos tipos de información:

- **Razón**: `error.details[0].reason` (por ejemplo, `RATE_LIMIT_EXCEEDED`, `QUOTA_EXHAUSTED`) o `error.message`
- **Tiempo de espera**: `RetryInfo.retryDelay` o `details[0].metadata.quotaResetDelay` (si existe)

```json
{
  "error": {
    "details": [
      {
        "reason": "RATE_LIMIT_EXCEEDED",
        "metadata": {
          "quotaResetDelay": "42s"
        }
      }
    ]
  }
}
```

**Lo que deberías ver**:
- Si se puede encontrar el tiempo de espera en el cuerpo de respuesta (por ejemplo, `RetryInfo.retryDelay` o `quotaResetDelay`), el proxy generalmente esperará un breve período de tiempo antes de reintentar.
- Si no hay tiempo de espera, el proxy agregará un "período de enfriamiento" a esta cuenta según la estrategia incorporada, y cambiará directamente a la siguiente cuenta en el reintento.

### Paso 2: Verificar la configuración de programación de cuentas

**Por qué**: la configuración de programación afecta directamente la frecuencia y prioridad de rotación de cuentas.

Entra a la página **API Proxy**, observa la estrategia de programación:

| Elemento de configuración | Descripción | Valor predeterminado/sugerencia |
|--- | --- | ---|
| **Scheduling Mode** | Modo de programación | `Balance` (predeterminado) |
| **Preferred Account** | Modo de cuenta fija | No seleccionado (predeterminado) |

**Comparación de modos de programación**:

| Modo | Estrategia de reutilización de cuenta | Manejo de limitación | Escenario aplicable |
|--- | --- | --- | ---|
| **CacheFirst** | Habilita sesión pegajosa y reutilización de ventana de 60s | **Prioriza la espera**, mejora enormemente la tasa de aciertos de Prompt Caching | Conversación / necesita alta tasa de aciertos de caché |
| **Balance** | Habilita sesión pegajosa y reutilización de ventana de 60s | **Cambia inmediatamente** a una cuenta alternativa, equilibra éxito y rendimiento | Escenario general, predeterminado |
| **PerformanceFirst** | Salta sesión pegajosa y reutilización de ventana de 60s, modo round-robin puro | Cambia inmediatamente, carga de cuentas más equilibrada | Alta concurrencia, solicitudes sin estado |

::: tip CacheFirst vs Balance
Si usas Prompt Caching y deseas mejorar la tasa de aciertos de caché, elige `CacheFirst` — cuando está limitado, priorizará esperar en lugar de cambiar inmediatamente de cuenta. Si te importa más la tasa de éxito de solicitudes que el caché, elige `Balance` — cuando está limitado, cambiará inmediatamente de cuenta.
:::

::: tip Modo rendimiento primero
Si tus solicitudes son sin estado (como generación de imágenes, consultas independientes), puedes probar `PerformanceFirst`. Saltará sesión pegajosa y reutilización de ventana de 60s, haciendo que las solicitudes consecutivas caigan más fácilmente en diferentes cuentas.
:::

### Paso 3: Verificar si la rotación de cuentas funciona correctamente

**Por qué**: confirmar que el sistema puede cambiar automáticamente de cuenta.

**Método 1: Ver encabezados de respuesta**

Usa curl o tu propio cliente para imprimir los encabezados de respuesta, observa si `X-Account-Email` cambia.

**Método 2: Ver registros**

Abre el archivo de registro (según la ubicación de tu sistema), busca `🔄 [Token Rotation]`:

```
🔄 [Token Rotation] Accounts: [
  "account1@example.com(protected=[])",
  "account2@example.com(protected=[])",
  "account3@example.com(protected=[])"
]
```

**Método 3: Usar Proxy Monitor**

En la página **Monitor**, observa los registros de solicitudes, enfócate en:
- Si el campo **Account** cambia entre diferentes cuentas
- Después de solicitudes con **Estado** 429, ¿hay solicitudes exitosas que usaron una cuenta diferente?

**Lo que deberías ver**:
- Cuando una cuenta devuelve 429, las solicitudes posteriores cambian automáticamente a otras cuentas
- Si ves múltiples solicitudes usando la misma cuenta y todas fallan, puede ser un problema de configuración de programación

### Paso 4: Optimizar la prioridad de cuentas

**Por qué**: hacer que el sistema use prioritariamente cuentas de alta cuota/alto nivel, reduciendo la probabilidad de 429.

En TokenManager, el sistema hará una ordenación del grupo de cuentas antes de seleccionar una cuenta (imprimirá `🔄 [Token Rotation] Accounts: ...`):

1. **Prioridad de nivel de suscripción**: ULTRA > PRO > FREE
2. **Prioridad de porcentaje de cuota**: dentro del mismo nivel, las cuentas con más cuota van primero
3. **Punto de entrada de ordenación**: esta ordenación ocurre en el lado del proxy, la cuenta final que se usa se basa en la ordenación + juicio de disponibilidad del lado del proxy.

::: info Principio de ordenación inteligente (lado del proxy)
La prioridad es `ULTRA > PRO > FREE`; dentro del mismo nivel de suscripción, ordena descendente por `remaining_quota` (porcentaje de cuota restante máxima de la cuenta).
:::

**Operaciones**:
- Arrastrar y soltar cuentas para ajustar el orden de visualización (opcional)
- Actualizar cuota (Accounts → actualizar todas las cuotas)
- Verificar el nivel de suscripción y la cuota de las cuentas

## Recordatorio de errores comunes

### ❌ Error 1: Tratar incorrectamente 429 como "el modelo no tiene capacidad"

**Fenómeno**: ver error 429 y asumir que el modelo no tiene capacidad.

**Comprensión correcta**:
- 429 es **limitación de velocidad**, no un problema de capacidad
- Agregar cuentas puede reducir la probabilidad de 429
- Ajustar el modo de programación puede mejorar la velocidad de cambio

### ❌ Error 2: Umbral de protección de cuota configurado demasiado alto

**Fenómeno**: cuota suficiente pero el sistema sigue saltando cuentas.

**Causa**: Quota Protection agregará modelos por debajo del umbral a `protected_models` de la cuenta, y el proxy al programar saltará "modelos protegidos". Cuando el umbral es demasiado alto, puede causar que cuentas disponibles sean excluidas excesivamente.

**Corrección**:
- Regresa a **Settings → Quota Protection**, ajusta el modelo de monitoreo y el umbral
- Si quieres entender claramente qué modelos protege, ve a los datos de la cuenta y mira `protected_models`

### ❌ Error 3: El modo de cuenta fija impide la rotación

**Fenómeno**: configuraste `Preferred Account`, pero después de que esa cuenta está limitada, el sistema se "atascó".

**Causa**: en el modo de cuenta fija, el sistema prioriza el uso de la cuenta especificada, y solo degrada a round-robin cuando la cuenta no está disponible.

**Corrección**:
- Si no necesitas una cuenta fija, vacía `Preferred Account`
- O asegúrate de que la cuenta fija tenga suficiente cuota, evitando la limitación

## Punto de verificación ✅

- [ ] Puedes diferenciar entre cuota insuficiente y limitación del upstream
- [ ] Sabes cómo ver detalles de errores 429 en Proxy Monitor
- [ ] Entiendes la diferencia y escenarios de uso de los tres modos de programación
- [ ] Sabes cómo verificar si la rotación de cuentas funciona correctamente
- [ ] Puedes optimizar la prioridad de cuentas y verificar la estrategia de protección de cuota

## Preguntas frecuentes

### P1: ¿Por qué tengo varias cuentas pero sigo encontrando 429?

R: Posibles causas:
1. Todas las cuentas activan limitación al mismo tiempo (frecuencia de solicitudes demasiado alta)
2. Las solicitudes consecutivas reutilizan la misma cuenta bajo "reutilización de ventana de 60s", es más fácil alcanzar el límite en una sola cuenta
3. La protección de cuota excluye incorrectamente cuentas disponibles
4. El número total de cuentas no es suficiente para soportar tu frecuencia de solicitudes

**Solución**:
- Agregar más cuentas
- Usar el modo `PerformanceFirst`
- Verificar si Quota Protection agregó el modelo que deseas usar a `protected_models` (ajusta el modelo de monitoreo y el umbral si es necesario)
- Reducir la frecuencia de solicitudes

### P2: ¿Los errores 429 se reintentan automáticamente?

R: Se reintentarán automáticamente dentro de una sola solicitud. **El límite de reintentos generalmente es 3 veces**, el cálculo específico es `min(3, tamaño del grupo de cuentas)`, y se intenta al menos 1 vez.

**Ejemplos de cantidad de reintentos**:
- Grupo de cuentas con 1 cuenta → intenta 1 vez (sin reintento)
- Grupo de cuentas con 2 cuentas → intenta 2 veces (reintenta 1 vez)
- Grupo de cuentas con 3 o más cuentas → intenta 3 veces (reintenta 2 veces)

**Proceso aproximado**:
1. Registrar información de limitación/sobrecarga (entrar en `RateLimitTracker`)
2. Si se puede analizar el tiempo de espera (por ejemplo, `RetryInfo.retryDelay` / `quotaResetDelay`), esperará un breve período antes de continuar
3. Al reintentar, forzar rotación de cuentas (`attempt > 0` activa `force_rotate=true`), intentando usar la siguiente cuenta disponible para发起 solicitud upstream

Si todos los intentos fallan, el proxy devolverá el error al cliente; al mismo tiempo, todavía puedes ver las cuentas realmente usadas desde los encabezados de respuesta (como `X-Account-Email`) o Proxy Monitor.

### P3: ¿Cómo ver cuánto tiempo ha estado limitada una cuenta?

R: Hay dos formas:

**Método 1**: Ver registros, buscar `rate-limited`

```
🔒 [FIX #820] Preferred account xxx@gmail.com is rate-limited, falling back to round-robin
```

**Método 2**: el registro mostrará el tiempo de espera restante

```
All accounts are currently limited. Please wait 30s.
```

### P4: ¿La protección de cuota y la limitación son lo mismo?

R: No.

| Característica | Protección de cuota | Seguimiento de limitación |
|--- | --- | ---|
| **Condición de activación** | La cuota del modelo está por debajo del umbral | Recibió error 429 |
| **Alcance** | Modelos específicos | Toda la cuenta |
| **Duración** | Hasta que la cuota se recupere | Decidido por el upstream (generalmente de segundos a minutos) |
| **Comportamiento** | Saltar ese modelo | Saltar esa cuenta |

### P5: ¿Cómo forzar un cambio inmediato de cuenta?

R: Puedes empezar desde "hacer que la siguiente solicitud cambie de cuenta más fácilmente":

1. **Nivel de programación**: cambia a `PerformanceFirst`, saltar sesión pegajosa y reutilización de ventana de 60s
2. **Cuenta fija**: si `Preferred Account` está activado, vacíalo primero, de lo contrario priorizará usar la cuenta fija (hasta que esté limitada/protegida)
3. **Grupo de cuentas**: aumentar la cantidad de cuentas, cuando una sola cuenta está limitada, es más encontrar una cuenta alternativa

Dentro de una sola solicitud, el proxy también forzará rotación al reintentar (`attempt > 0` activará `force_rotate=true`), pero la cantidad de reintentos está limitada por el límite superior.

## Resumen de la lección

- En Antigravity Tools, 429 es una señal de "upstream temporalmente no disponible", puede ser por límite de velocidad, cuota agotada, capacidad del modelo insuficiente, etc.
- El proxy registrará el tiempo de enfriamiento, e intentará rotar cuentas en el reintento de una sola solicitud (pero la cantidad de reintentos es limitada)
- El modo de programación, Quota Protection, y la cantidad de cuentas afectarán la probabilidad y velocidad de recuperación de encontrar 429
- Puedes localizar rápidamente problemas usando Proxy Monitor, encabezados de respuesta `X-Account-Email` y registros

## Vista previa de la próxima lección

> En la próxima lección veremos **[404/Ruta incompatible: Base URL, prefijo /v1 y cliente de "ruta superpuesta"](../404-base-url/)**.
>
> Aprenderás:
> - Cómo se produce el error más común de integración (404)
> - Las diferencias de empalme de base_url en diferentes clientes
> - Cómo reparar rápidamente problemas 404

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Función | Ruta de archivo | Línea |
|--- | --- | ---|
| Análisis de retraso de reintento 429 (RetryInfo / quotaResetDelay) | [`src-tauri/src/proxy/upstream/retry.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/upstream/retry.rs#L38-L67) | 38-67 |
| Herramienta de análisis de Duration | [`src-tauri/src/proxy/upstream/retry.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/upstream/retry.rs#L11-L35) | 11-35 |
| Enumeración de modos de programación (CacheFirst/Balance/PerformanceFirst) | [`src-tauri/src/proxy/sticky_config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/sticky_config.rs#L3-L12) | 3-12 |
| Análisis de causa de limitación y estrategia de enfriamiento predeterminada | [`src-tauri/src/proxy/rate_limit.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/rate_limit.rs#L5-L258) | 5-258 |
| Definición de constante MAX_RETRY_ATTEMPTS (handler OpenAI) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L14) | 14 |
| Cálculo de cantidad de reintentos (max_attempts = min(MAX_RETRY_ATTEMPTS, pool_size)) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L830) | 830 |
| Handler OpenAI: marcar limitación y reintentar/rotar al encontrar 429/5xx | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L349-L389) | 349-389 |
| Prioridad de ordenación de cuentas (ULTRA > PRO > FREE + remaining_quota) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L504-L538) | 504-538 |
| Reutilización de ventana de 60s + evitar limitación/protección de cuota | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L624-L739) | 624-739 |
| Entrada de registro de limitación (mark_rate_limited) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L1089-L1113) | 1089-1113 |
| Bloqueo preciso 429 / actualización en tiempo real de cuota / estrategia de degradación (mark_rate_limited_async) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L1258-L1417) | 1258-1417 |

**Constantes clave**:
- `MAX_RETRY_ATTEMPTS = 3`: número máximo de reintentos dentro de una sola solicitud (handlers OpenAI/Gemini)
- `60`: reutilización de ventana de 60 segundos (solo se habilita en modos que no sean `PerformanceFirst`)
- `5`: tiempo de espera de obtención de token (segundos)
- `300`: umbral de actualización anticipada de token (segundos, 5 minutos)

**Funciones clave**:
- `parse_retry_delay()`: extrae el retraso de reintento de la respuesta de error 429
- `get_token_internal()`: lógica central de selección y rotación de cuentas
- `mark_rate_limited()`: marca la cuenta como estado de limitación

</details>
