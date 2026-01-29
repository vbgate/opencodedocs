---
title: "OpenAI: Consulta de cuota | opencode-mystatus"
sidebarTitle: "OpenAI"
subtitle: "Consulta de cuota de OpenAI: límites de 3 horas y 24 horas"
description: "Aprende a usar /mystatus para consultar cuotas OpenAI de Plus/Team/Pro. Entiende límites de 3 horas y 24 horas, ventanas primarias y secundarias, y evita restricciones de desarrollo."
tags:
  - "OpenAI"
  - "consulta de cuota"
  - "cuota de API"
prerequisite:
  - "start-quick-start"
  - "start-understanding-output"
order: 1
---

# Consulta de cuota de OpenAI: límites de 3 horas y 24 horas

## Lo que aprenderás

- Usar `/mystatus` para consultar la cuota de suscripciones OpenAI Plus/Team/Pro
- Comprender la información de límites de 3 horas y 24 horas en la salida
- Entender la diferencia entre ventana principal y ventana secundaria
- Conocer cómo manejar el token expirado

## Tu situación actual

Las llamadas a la API de OpenAI tienen límites, después de excederlos se restringirá temporalmente el acceso. Pero no sabes:

- ¿Cuánta cuota te queda actualmente?
- ¿Cuál de los límites de 3 horas o 24 horas se está usando?
- ¿Cuándo se restablecerá?
- ¿Por qué a veces ves datos de dos ventanas?

Si no capturas esta información a tiempo, puede afectar tu progreso al usar ChatGPT para escribir código o hacer proyectos.

## Cuándo usar esta técnica

Cuando tú:
- Necesitas usar frecuentemente la API de OpenAI para desarrollar
- Notas que las respuestas son más lentas o estás siendo limitado
- Quieres conocer el uso de la cuenta de equipo
- Quieres saber cuándo se renovará la cuota

## Enfoque central

OpenAI tiene dos ventanas de limitación para las llamadas a la API:

| Tipo de ventana | Duración | Función |
|--- | --- | ---|
| **Ventana principal** (primary) | Devuelta por el servidor OpenAI | Evitar llamadas masivas en poco tiempo |
| **Ventana secundaria** (secondary) | Devuelta por el servidor OpenAI (puede no existir) | Evitar uso excesivo a largo plazo |

mystatus consulta paralelamente estas dos ventanas y muestra各自的:
- Porcentaje usado
- Barra de progreso de cuota restante
- Tiempo hasta el restablecimiento

::: info
La duración de la ventana es devuelta por el servidor OpenAI, puede variar según diferentes tipos de suscripción (Plus, Team, Pro).
:::

## Sigue los pasos

### Paso 1: Ejecuta el comando de consulta

En OpenCode, ingresa `/mystatus`, el sistema consultará automáticamente las cuotas de todas las plataformas configuradas.

**Lo que deberías ver**:
Incluye información de cuota de plataformas como OpenAI, Zhipu AI, Z.ai, Copilot, Google Cloud (dependiendo de qué plataformas hayas configurado).

### Paso 2: Encuentra la sección de OpenAI

En la salida, busca la sección `## OpenAI Account Quota`.

**Lo que deberías ver**:
Contenido similar a este:

```
## OpenAI Account Quota

Account:        user@example.com (plus)

3-hour limit
███████████████░░░░░░░░░░ 60% remaining
Resets in: 2h 30m
```

### Paso 3: Interpreta la información de la ventana principal

**Ventana principal** (primary_window) generalmente muestra:
- **Nombre de ventana**: Como `3-hour limit` o `24-hour limit`
- **Barra de progreso**: Visualiza intuitivamente la proporción de cuota restante
- **Porcentaje restante**: Como `60% remaining`
- **Tiempo de restablecimiento**: Como `Resets in: 2h 30m`

**Lo que deberías ver**:
- El nombre de la ventana muestra la duración (3 horas / 24 horas)
- Cuanto más llena la barra de progreso, más restante hay, cuanto más vacía, más rápido se agotará
- El tiempo de restablecimiento es una cuenta regresiva, cuando llegue a cero se renovará la cuota

::: warning
Si ves el mensaje `Limit reached!`, significa que la cuota de la ventana actual se ha agotado, necesitas esperar el restablecimiento.
:::

### Paso 4: Revisa la ventana secundaria (si existe)

Si OpenAI devuelve datos de ventana secundaria, verás:

```
24-hour limit
████████████████████████████ 90% remaining
Resets in: 20h 45m
```

**Lo que deberías ver**:
- La ventana secundaria muestra otra dimensión temporal de la cuota (generalmente 24 horas)
- Puede tener un porcentaje restante diferente al de la ventana principal

::: tip
La ventana secundaria es un pool de cuota independiente, agotar la ventana principal no afecta a la secundaria, y viceversa.
:::

### Paso 5: Revisa el tipo de suscripción

En la línea `Account` puedes ver el tipo de suscripción:

```
Account:        user@example.com (plus)
                                   ^^^^^
                                   Tipo de suscripción
```

**Tipos de suscripción comunes**:
- `plus`: Suscripción personal Plus
- `team`: Suscripción de equipo/organización
- `pro`: Suscripción Pro

**Lo que deberías ver**:
- Tu tipo de cuenta se muestra entre paréntesis después del correo
- Diferentes tipos pueden tener diferentes límites

## Punto de control ✅

Verifica que has entendido:

| Escenario | Lo que deberías ver |
|--- | ---|
| Ventana principal con 60% restante | Barra de progreso aproximadamente 60% llena, muestra `60% remaining` |
| Se restablecerá en 2.5 horas | Muestra `Resets in: 2h 30m` |
| Límite alcanzado | Muestra `Limit reached!` |
| Hay ventana secundaria | La ventana principal y la secundaria cada una tienen una línea de datos |

## Advertencias de errores comunes

### ❌ Error de operación: No refrescar cuando el token expira

**Síntoma de error**: Ves el mensaje `⚠️ OAuth 授权已过期` (chino) o `⚠️ OAuth token expired` (inglés)

**Causa**: El token OAuth ha expirado (duración específica controlada por el servidor), después de expirar no se puede consultar la cuota.

**Operación correcta**:
1. Vuelve a iniciar sesión en OpenAI en OpenCode
2. El token se refrescará automáticamente
3. Ejecuta `/mystatus` nuevamente para consultar

### ❌ Error de operación: Confundir ventana principal y ventana secundaria

**Síntoma de error**: Piensas que solo hay un límite de cuota, pero la ventana principal se agota y la secundaria sigue en uso

**Causa**: Las dos ventanas son pools de cuota independientes.

**Operación correcta**:
- Presta atención al tiempo de restablecimiento de cada ventana
- La ventana principal se restablece rápido, la secundaria se restablece lento
- Distribuye el uso razonablemente, evita que alguna ventana se mantenga en exceso

### ❌ Error de operación: Ignorar el ID de cuenta de equipo

**Síntoma de error**: La suscripción Team muestra el uso de otra cuenta

**Causa**: Las suscripciones Team necesitan pasar el ID de cuenta de equipo, de lo contrario se podría estar consultando la cuenta predeterminada.

**Operación correcta**:
- Asegúrate de haber iniciado sesión con la cuenta correcta del equipo en OpenCode
- El token incluirá automáticamente `chatgpt_account_id`

## Resumen de esta lección

mystatus consulta la cuota llamando a la API oficial de OpenAI:
- Soporta autenticación OAuth (Plus/Team/Pro)
- Muestra ventana principal y ventana secundaria (si existe)
- Barra de progreso visualiza la cuota restante
- Cuenta regresiva muestra el tiempo de restablecimiento
- Detecta automáticamente el token expirado

## Próxima lección

> En la siguiente lección aprenderemos **[Consulta de cuota de Zhipu AI y Z.ai](../zhipu-usage/)**.
>
> Aprenderás:
> - Qué es el límite de token de 5 horas
> - Cómo ver la cuota mensual de MCP
> - Advertencias cuando el uso supera el 80%

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta de archivo | Línea |
|--- | --- | ---|
| Entrada de consulta de cuota de OpenAI | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L207-L236) | 207-236 |
| Llamada a API de OpenAI | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L132-L155) | 132-155 |
| Formato de salida | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L164-L194) | 164-194 |
| Análisis de token JWT | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L64-L73) | 64-73 |
| Extraer correo de usuario | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L78-L81) | 78-81 |
| Verificar expiración de token | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L216-L221) | 216-221 |
| Definición de tipo OpenAIAuthData | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L28-L33) | 28-33 |

**Constantes**:
- `OPENAI_USAGE_URL = "https://chatgpt.com/backend-api/wham/usage"`: API oficial de consulta de cuota de OpenAI

**Funciones clave**:
- `queryOpenAIUsage(authData)`: Función principal de consulta de cuota de OpenAI
- `fetchOpenAIUsage(accessToken)`: Llama a la API de OpenAI
- `formatOpenAIUsage(data, email)`: Formatea la salida
- `parseJwt(token)`: Analiza el token JWT (implementación no estándar de biblioteca)
- `getEmailFromJwt(token)`: Extrae el correo del usuario del token
- `getAccountIdFromJwt(token)`: Extrae el ID de cuenta de equipo del token

</details>
