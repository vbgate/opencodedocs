---
title: "Gestión de cuotas: Quota Protection y calentamiento | Antigravity-Manager"
subtitle: "Gestión de cuotas: Quota Protection y calentamiento | Antigravity-Manager"
sidebarTitle: "Protege las cuotas de tus modelos"
description: "Aprende el mecanismo de gestión de cuotas de Antigravity-Manager. Usa Quota Protection para proteger modelos por umbral, Smart Warmup para calentamiento automático, soporta escaneo programado y control de enfriamiento."
tags:
  - "cuota"
  - "calentamiento"
  - "cuentas"
  - "proxy"
prerequisite:
  - "start-add-account"
  - "start-proxy-and-first-client"
order: 5
---

# Gestión de cuotas: la combinación de Quota Protection + Smart Warmup

Usas Antigravity Tools para ejecutar el proxy de forma estable, pero lo que más temes es esto: la cuota de tu modelo principal se "consume silenciosamente", y cuando realmente necesitas usarla, descubres que ya está demasiado baja para usar.

Este enfoque se centra en la **gestión de cuotas**: usa Quota Protection para reservar modelos clave; usa Smart Warmup para hacer un "calentamiento ligero" cuando la cuota se recupera al 100%, reduciendo fallos temporales.

## ¿Qué es la gestión de cuotas?

**Gestión de cuotas** significa usar dos mecanismos interconectados en Antigravity Tools para controlar "cómo gastar la cuota": cuando la cuota restante de un modelo cae por debajo del umbral, Quota Protection agregará ese modelo a `protected_models` de la cuenta, y las solicitudes a ese modelo se evitarán primero; cuando la cuota vuelva al 100%, Smart Warmup activará una solicitud de calentamiento con tráfico mínimo y usará el archivo de historial local para un enfriamiento de 4 horas.

## Qué puedes hacer al finalizar

- Habilitar Quota Protection para que las cuentas con cuota baja "cedan el paso" automáticamente, reservando modelos de alto valor para solicitudes críticas
- Habilitar Smart Warmup para calentamiento automático cuando la cuota se recupere (y comprender cómo el enfriamiento de 4 horas afecta la frecuencia de activación)
- Comprender dónde actúan los tres campos `quota_protection` / `scheduled_warmup` / `protected_models`
- Conocer qué nombres de modelo se normalizan en "grupos protegidos" (y cuáles no)

## Tu situación actual

- Crees que estás "rotando cuentas", pero en realidad sigues consumiendo el mismo tipo de modelo de alto valor
- Descubres que la cuota está baja solo cuando ya es demasiado tarde, o incluso Claude Code/el cliente consume la cuota en segundo plano con warmup
- Habilitaste el calentamiento, pero no sabes cuándo se activa, si hay enfriamiento, o si afectará la cuota

## Cuándo usar este enfoque

- Tienes un pool de múltiples cuentas y deseas que los modelos clave tengan "reservas" para "momentos importantes"
- No quieres monitorear manualmente cuándo la cuota se recupera al 100%, prefieres que el sistema haga automáticamente una "verificación ligera tras la recuperación"

## 🎒 Preparativos antes de comenzar

::: warning Requisitos previos
Este enfoque asume que ya puedes:

- Ver la lista de cuentas en la página **Accounts** y actualizar manualmente las cuotas
- Haber iniciado el proxy inverso local (al menos poder acceder a `/healthz`)

Si aún no funciona, primero lee **[Iniciar el proxy inverso local y conectar el primer cliente](/es/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**.
:::

Además, Smart Warmup escribirá un archivo de historial local `warmup_history.json`. Se guarda en el directorio de datos; primero puedes leer **[Primera ejecución: directorio de datos, registros, bandeja y inicio automático](/es/lbjlaq/Antigravity-Manager/start/first-run-data/)** para conocer la ubicación y la forma de respaldar el directorio de datos.

## Idea central

Detrás de esta "combinación" hay una lógica simple:

- Quota Protection es responsable de "no seguir desperdiciando": cuando un modelo está por debajo del umbral, se marca como protegido, y las solicitudes a ese modelo se evitarán primero (a nivel de modelo, no deshabilitando la cuenta por completo).
- Smart Warmup es responsable de "verificar cuando la cuota se recupere": cuando el modelo vuelve al 100%, activa una solicitud ligera para confirmar que la ruta está disponible, y usa un enfriamiento de 4 horas para evitar interrupciones repetidas.

Los campos de configuración correspondientes están en `AppConfig` del frontend:

- `quota_protection.enabled / threshold_percentage / monitored_models` (ver `src/types/config.ts`)
- `scheduled_warmup.enabled / monitored_models` (ver `src/types/config.ts`)

La lógica que realmente decide "si omitir esta cuenta al solicitar este modelo" está en TokenManager del backend:

- `protected_models` del archivo de cuenta participará en el filtrado en `get_token(..., target_model)` (ver `src-tauri/src/proxy/token_manager.rs`)
- `target_model` se normaliza primero (`normalize_to_standard_id`), por lo que variantes como `claude-sonnet-4-5-thinking` se agrupan en el mismo "grupo protegido" (ver `src-tauri/src/proxy/common/model_mapping.rs`)

## Próximo capítulo

> En el próximo capítulo aprenderemos **[Proxy Monitor: registros de solicitudes, filtrado, restauración de detalles y exportación](/es/lbjlaq/Antigravity-Manager/advanced/monitoring/)**, convirtiendo la caja negra de llamadas en una cadena de evidencia revisable.

## Sígueme

### Paso 1: primero actualiza la cuota para "tener números claros"

**Por qué**
Quota Protection se basa en `quota.models[].percentage` de la cuenta para tomar decisiones. Si no has actualizado la cuota, la lógica de protección no puede hacer nada por ti.

Ruta: abre la página **Accounts**, haz clic en el botón de actualizar en la barra de herramientas (puedes actualizar una sola cuenta o todas).

**Deberías ver**: aparece el porcentaje de cuota para cada modelo en la fila de la cuenta (por ejemplo, 0-100) y el reset time.

### Paso 2: habilita Smart Warmup en Settings (opcional, pero recomendado)

**Por qué**
El objetivo de Smart Warmup no es "ahorrar cuota", sino "auto-verificar la ruta cuando la cuota se recupere". Solo se activa cuando la cuota del modelo llega al 100%, y tiene un enfriamiento de 4 horas.

Ruta: entra en **Settings**, cambia al área de configuración relacionada con cuentas, habilita el interruptor **Smart Warmup**, y marca los modelos que deseas monitorear.

No olvides guardar la configuración.

**Deberías ver**: al expandir Smart Warmup aparece una lista de modelos; al menos 1 modelo debe permanecer marcado.

### Paso 3: habilita Quota Protection, y establece el umbral y los modelos monitoreados

**Por qué**
Quota Protection es el núcleo de "reservar": cuando el porcentaje de cuota de los modelos monitoreados es `<= threshold_percentage`, escribirá ese modelo en `protected_models` del archivo de cuenta, y las solicitudes posteriores a ese modelo evitarán primero este tipo de cuentas.

Ruta: en **Settings**, habilita **Quota Protection**.

1. Establece el umbral (`1-99`)
2. Marca los modelos que deseas monitorear (al menos 1)

::: tip Una configuración inicial muy útil
Si no quieres complicarte, empieza con `threshold_percentage=10` predeterminado (ver `src/pages/Settings.tsx`).
:::

**Deberías ver**: al menos 1 modelo debe permanecer marcado en Quota Protection (la interfaz te impedirá quitar el último).

### Paso 4: confirma que la "normalización de grupos protegidos" no te causará problemas

**Por qué**
Cuando TokenManager realiza el juicio de protección de cuota, primero normalizará `target_model` a un ID estándar (`normalize_to_standard_id`). Por ejemplo, `claude-sonnet-4-5-thinking` se normalizará a `claude-sonnet-4-5`.

Esto significa:

- Marcas `claude-sonnet-4-5` en Quota Protection
- Cuando realmente solicitas `claude-sonnet-4-5-thinking`

Aún se activará la protección (porque pertenecen al mismo grupo).

**Deberías ver**: cuando `protected_models` de una cuenta contiene `claude-sonnet-4-5`, las solicitudes a `claude-sonnet-4-5-thinking` evitarán primero esa cuenta.

### Paso 5: cuando necesites verificar de inmediato, usa "calentamiento manual" para activar un warmup

**Por qué**
El ciclo de escaneo de Smart Warmup programado es cada 10 minutos (ver `src-tauri/src/modules/scheduler.rs`). Si quieres verificar la ruta de inmediato, el calentamiento manual es más directo.

Ruta: abre la página **Accounts**, haz clic en el botón "Warmup" en la barra de herramientas:

- Sin seleccionar cuentas: activa warmup completo (llama a `warm_up_all_accounts`)
- Con cuentas seleccionadas: activa warmup para cada cuenta seleccionada (llama a `warm_up_account`)

**Deberías ver**: aparece un toast, el contenido proviene de la cadena devuelta por el backend (por ejemplo, "Warmup task triggered ...").

## Puntos de verificación ✅

- Puedes ver el porcentaje de cuota del modelo de cada cuenta en la página Accounts (demostrando que la cadena de datos de cuota está OK)
- Puedes habilitar Quota Protection / Smart Warmup en Settings y guardar la configuración con éxito
- Comprendes que `protected_models` es una restricción "a nivel de modelo": una cuenta puede evitarse solo para ciertos modelos
- Sabes que warmup tiene un enfriamiento de 4 horas: repetir clics de calentamiento en poco tiempo puede ver indicaciones relacionadas con "skipped/cooldown"

## Advertencias sobre problemas comunes

### 1) Habilitaste Quota Protection, pero nunca se activó

La causa más común es: la cuenta no tiene datos de `quota`. La lógica de protección en el backend necesita leer primero `quota.models[]` para poder juzgar el umbral (ver `src-tauri/src/proxy/token_manager.rs`).

Puedes volver al **Paso 1** y actualizar primero la cuota.

### 2) ¿Por qué solo algunos modelos se consideran "grupos protegidos"?

La normalización de `target_model` por TokenManager es de "lista blanca": solo los nombres de modelo explícitamente listados se asignarán a ID estándar (ver `src-tauri/src/proxy/common/model_mapping.rs`).

La lógica después de la normalización es: usar el nombre normalizado (ID estándar o nombre de modelo original) para hacer coincidir el campo `protected_models` de la cuenta. Si la coincidencia es exitosa, la cuenta se omitirá (ver `src-tauri/src/proxy/token_manager.rs:555-560, 716-719`). Esto significa:

- Los modelos dentro de la lista blanca (como `claude-sonnet-4-5-thinking`) se normalizarán a ID estándar (`claude-sonnet-4-5`), y luego se juzgará si están en `protected_models`
- Cuando la normalización de modelos fuera de la lista blanca falla, retrocede al nombre de modelo original, y aún intentará hacer coincidir `protected_models`

En otras palabras, el juicio de protección de cuota es efectivo para "todos los nombres de modelo", solo que los modelos dentro de la lista blanca se normalizan primero.

### 3) ¿Por qué el calentamiento manual/programado necesita que el proxy esté ejecutándose?

Las solicitudes de calentamiento finalmente llegarán al endpoint interno del proxy local: `POST /internal/warmup` (ver la ruta en `src-tauri/src/proxy/server.rs` y la implementación en `src-tauri/src/proxy/handlers/warmup.rs`). Si no has iniciado el servicio de proxy, warmup fallará.

Además, el puerto usado para calentamiento proviene de la configuración: `proxy.port` (si la lectura de configuración falla, retrocederá a `8045`, ver `src-tauri/src/modules/quota.rs`).

## Resumen de esta lección

- Quota Protection hace "recortar pérdidas": cuando está por debajo del umbral, escribe el modelo en `protected_models`, y al solicitar ese modelo se evita primero
- Smart Warmup hace "auto-verificación tras recuperación": solo se activa al 100%, escanea cada 10 minutos, con enfriamiento de 4 horas
- Ambos dependen de la cadena de "actualización de cuota": primero debe haber `quota.models[]`, la gestión tiene fundamento

## Próximo capítulo

La gestión de cuotas resuelve "cómo gastar de forma más estable". El próximo capítulo sugiere continuar con **Proxy Monitor**, convirtiendo los registros de solicitudes, la coincidencia de cuentas y el mapeo de modelos en una cadena de evidencia reproducible.

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver las ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta del archivo | Línea |
|--- | --- | ---|
| UI de Quota Protection (umbral, selección de modelos, al menos 1) | [`src/components/settings/QuotaProtection.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/settings/QuotaProtection.tsx#L13-L168) | 13-168 |
| UI de Smart Warmup (marcado predeterminado al habilitar, al menos 1) | [`src/components/settings/SmartWarmup.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/settings/SmartWarmup.tsx#L14-L120) | 14-120 |
| Campos de configuración de gestión de cuotas (`quota_protection` / `scheduled_warmup`) | [`src/types/config.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/types/config.ts#L54-L94) | 54-94 |
| Umbral predeterminado y configuración predeterminada (`threshold_percentage: 10`) | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L20-L51) | 20-51 |
| Escribir/restaurar `protected_models` (juicio de umbral y persistencia) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L254-L467) | 254-467 |
| Filtrado de protección de cuotas del lado de solicitudes (`get_token(..., target_model)`) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L470-L674) | 470-674 |
| Normalización de grupos protegidos (`normalize_to_standard_id`) | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L230-L254) | 230-254 |
| Escaneo programado de Smart Warmup (cada 10 minutos + enfriamiento de 4 horas + `warmup_history.json`) | [`src-tauri/src/modules/scheduler.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/scheduler.rs#L11-L221) | 11-221 |
| Comandos de calentamiento manual (`warm_up_all_accounts` / `warm_up_account`) | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L167-L212) | 167-212 |
| Implementación de calentamiento (llama al endpoint interno `/internal/warmup`) | [`src-tauri/src/modules/quota.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/quota.rs#L271-L512) | 271-512 |
| Implementación del endpoint interno de calentamiento (construir solicitud + llamar upstream) | [`src-tauri/src/proxy/handlers/warmup.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/warmup.rs#L3-L220) | 3-220 |

</details>
