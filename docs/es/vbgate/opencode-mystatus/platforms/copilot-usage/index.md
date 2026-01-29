---
title: "Copilot: Cuota de GitHub Copilot | opencode-mystatus"
sidebarTitle: "Cuota Copilot"
subtitle: "Copilot: Cuota de GitHub Copilot"
description: "Aprende a consultar cuotas de GitHub Copilot y límites de suscripción."
tags:
  - "github-copilot"
  - "cuota"
  - "premium-requests"
  - "autenticación pat"
prerequisite:
  - "start-quick-start"
order: 3
---

# Consulta de cuota de GitHub Copilot: Premium Requests y detalles de modelos

## Lo que aprenderás

- Ver rápidamente el uso mensual de Premium Requests de GitHub Copilot
- Conocer las diferencias de límite mensual por diferentes tipos de suscripción (Free/Pro/Pro+/Business/Enterprise)
- Ver detalles de uso por modelo (como número de usos de GPT-4, Claude, etc.)
- Identificar el número de excesos, estimar costos adicionales
- Resolver problemas de permisos de la nueva integración de OpenCode (OAuth Token no puede consultar cuota)

## Tu situación actual

::: info Problema de permisos de la nueva integración de OpenCode

La última integración OAuth de OpenCode ya no otorga permiso para acceder a la API `/copilot_internal/*`, lo que hace que el método original de OAuth Token no pueda consultar la cuota.

Podrías encontrarte con este error:
```
⚠️ GitHub Copilot 配额查询暂时不可用。
OpenCode 的新 OAuth 集成不支持访问配额 API。

解决方案:
1. 创建一个 fine-grained PAT (访问 https://github.com/settings/tokens?type=beta)
2. 在 'Account permissions' 中将 'Plan' 设为 'Read-only'
...
```

Esto es normal, este tutorial te enseñará cómo resolverlo.

:::

## Enfoque central

La cuota de GitHub Copilot se divide en los siguientes conceptos clave:

### Premium Requests（cuota principal）

Premium Requests es el indicador principal de cuota de Copilot, incluye:
- Interacciones Chat (conversación con asistente de IA)
- Code Completion (completado de código)
- Funciones de Copilot Workspace (colaboración en espacio de trabajo)

::: tip ¿Qué son Premium Requests?

Entendido simplemente: cada vez que Copilot te "ayuda" (genera código, responde preguntas, analiza código) cuenta como un Premium Request. Es la unidad principal de facturación de Copilot.

:::

### Tipos de suscripción y límites

Diferentes tipos de suscripción tienen diferentes límites mensuales:

| Tipo de suscripción | Límite mensual | Público objetivo |
| ----------- | -------- | ---------------------- |
| Free | 50 | Desarrollador personal en prueba |
| Pro | 300 | Desarrollador personal oficial |
| Pro+ | 1,500 | Desarrollador personal intenso |
| Business | 300 | Suscripción de equipo (300 por cuenta) |
| Enterprise | 1,000 | Suscripción empresarial (1000 por cuenta) |

### Uso excesivo

Si excedes el límite mensual, Copilot aún puede usarse, pero generará costos adicionales. El número de usos excesivos se mostrará por separado en la salida.

## 🎒 Preparativos

### Prerrequisitos

::: warning Verificación de configuración

Este tutorial asume que ya has:

1. ✅ **Instalado el plugin opencode-mystatus**
   - Consulta [Inicio rápido](../../start/quick-start/)

2. ✅ **Configurado al menos uno de lo siguiente**:
   - Iniciado sesión en GitHub Copilot en OpenCode (OAuth Token)
   - Creado manualmente el archivo de configuración de Fine-grained PAT (recomendado)

:::

### Métodos de configuración (elige uno)

#### Método 1: Usar Fine-grained PAT (recomendado)

Este es el método más confiable, no afectado por cambios en la integración OAuth de OpenCode.

1. Visita https://github.com/settings/tokens?type=beta
2. Haz clic en "Generate new token (classic)" o "Generate new token (beta)"
3. En "Account permissions", establece **Plan** como **Read-only**
4. Genera el token, formato similar a `github_pat_11A...`
5. Crea el archivo de configuración `~/.config/opencode/copilot-quota-token.json`:

```json
{
  "token": "github_pat_11A...",
  "username": "your-username",
  "tier": "pro"
}
```

**Explicación de campos del archivo de configuración**:
- `token`: Tu Fine-grained PAT
- `username`: Nombre de usuario de GitHub (necesario para la llamada a la API)
- `tier`: Tipo de suscripción, valores opcionales: `free` / `pro` / `pro+` / `business` / `enterprise`

#### Método 2: Usar OAuth Token de OpenCode

Si ya has iniciado sesión en GitHub Copilot en OpenCode, mystatus intentará usar tu OAuth Token.

::: warning Explicación de compatibilidad

Este método puede fallar debido a restricciones de permisos de la integración OAuth de OpenCode. Si falla, usa el método 1 (Fine-grained PAT).

:::

## Sigue los pasos

### Paso 1: Ejecuta el comando de consulta

En OpenCode, ejecuta el comando de barra diagonal:

```bash
/mystatus
```

**Lo que deberías ver**:

Si has configurado la cuenta de Copilot (usando Fine-grained PAT u OAuth Token), la salida incluirá contenido similar a:

```
## GitHub Copilot 账号额度

Account:        GitHub Copilot (pro)

Premium Requests [████████░░░░░░░░░] 40% (180/300)

模型使用明细:
  gpt-4: 120 requests
  claude-3-5-sonnet: 60 requests

Period: 2026-01
```

### Paso 2: Interpreta el resultado de salida

La salida incluye la siguiente información clave:

#### 1. Información de cuenta

```
Account:        GitHub Copilot (pro)
```

Muestra tu tipo de suscripción de Copilot (pro / free / business, etc.).

#### 2. Cuota de Premium Requests

```
Premium Requests [████████░░░░░░░░░] 40% (180/300)
```

- **Barra de progreso**: Visualiza intuitivamente la proporción restante
- **Porcentaje**: 40% restante
- **Usado / total**: Usado 180 veces, total 300 veces

::: tip Explicación de barra de progreso

El relleno verde/amarillo indica el uso, el hueco indica la cantidad restante. Cuanto más relleno, mayor es el uso.

:::

#### 3. Detalles de uso por modelo (solo API pública)

```
模型使用明细:
  gpt-4: 120 requests
  claude-3-5-sonnet: 60 requests
```

Muestra el número de usos de cada modelo, ordenado por uso descendente (máximo 5).

::: info ¿Por qué mi salida no tiene detalles de modelo?

Los detalles de modelo solo se muestran bajo el método de API pública (Fine-grained PAT). Si usas OAuth Token (API interna), no se mostrarán detalles de modelo.

:::

#### 4. Uso excesivo (si lo hay)

Si excedes el límite mensual, se mostrará:

```
超额使用: 25 次请求
```

El uso excesivo generará costos adicionales, consulta las tarifas de precios de GitHub Copilot para detalles.

#### 5. Tiempo de restablecimiento (solo API interna)

```
配额重置: 12d 5h (2026-02-01)
```

Muestra la cuenta regresiva hasta el restablecimiento de la cuota.

### Paso 3: Verifica situaciones comunes

#### Situación 1: Ves "⚠️ 配额查询暂时不可用"

Esto es normal, significa que el OAuth Token de OpenCode no tiene permiso para acceder a la API de cuota.

**Solución**: Configura PAT según "Método 1: Usar Fine-grained PAT".

#### Situación 2: Barra de progreso completamente vacía o casi llena

- **Completamente vacía** `░░░░░░░░░░░░░░░`: Cuota agotada, mostrará número de usos excesivos
- **Casi llena** `███████████████████`: A punto de agotarse, presta atención a controlar la frecuencia de uso

#### Situación 3: Muestra "Unlimited"

Algunas suscripciones Enterprise pueden mostrar "Unlimited", lo que significa sin límite.

### Paso 4: Maneja errores (si la consulta falla)

Si ves el siguiente error:

```
GitHub Copilot API 请求失败 (403): Resource not accessible by integration
```

**Causa**: El OAuth Token no tiene suficientes permisos para acceder a la API de Copilot.

**Solución**: Usa el método de Fine-grained PAT (ver método 1).

---

## Punto de control ✅

Después de completar los pasos anteriores, deberías poder:

- [ ] Ver información de cuota de GitHub Copilot en la salida de `/mystatus`
- [ ] Comprender la barra de progreso y el porcentaje de Premium Requests
- [ ] Conocer tu tipo de suscripción y límite mensual
- [ ] Saber cómo ver detalles de uso por modelo (si usas Fine-grained PAT)
- [ ] Entender qué significa el uso excesivo

## Advertencias de errores comunes

### Error 1: OAuth Token no puede consultar cuota (más común)

::: danger Error común

```
⚠️ GitHub Copilot 配额查询暂时不可用。
OpenCode 的新 OAuth 集成不支持访问配额 API。
```

**Causa**: La integración OAuth de OpenCode no ha otorgado permiso para acceder a la API `/copilot_internal/*`.

**Solución**: Usa el método de Fine-grained PAT, ver "Método 1: Usar Fine-grained PAT".

:::

### Error 2: Formato incorrecto del archivo de configuración

Si el formato del archivo `~/.config/opencode/copilot-quota-token.json` es incorrecto, la consulta fallará.

**Ejemplo de error**:

```json
// ❌ Error: falta el campo username
{
  "token": "github_pat_11A...",
  "tier": "pro"
}
```

**Ejemplo correcto**:

```json
// ✅ Correcto: incluye todos los campos necesarios
{
  "token": "github_pat_11A...",
  "username": "your-username",
  "tier": "pro"
}
```

### Error 3: Tipo de suscripción incorrecto

Si el `tier` que llenas no coincide con la suscripción real, el cálculo del límite será incorrecto.

| Tu suscripción real | El campo tier debería llenar | Ejemplo de llenado incorrecto |
| ------------ | ----------------------- | ------------ |
| Free | `free` | `pro` ❌ |
| Pro | `pro` | `free` ❌ |
| Pro+ | `pro+` | `pro` ❌ |
| Business | `business` | `enterprise` ❌ |
| Enterprise | `enterprise` | `business` ❌ |

**Cómo ver tu tipo de suscripción real**:
- Visita https://github.com/settings/billing
- Mira la sección "GitHub Copilot"

### Error 4: Permisos de token insuficientes

Si usas Classic Token (no Fine-grained), sin permiso "Plan" de lectura, devolverá error 403.

**Solución**:
1. Asegúrate de usar Fine-grained Token (generado en la página de versión beta)
2. Asegúrate de otorgar permiso "Account permissions → Plan → Read-only"

### Error 5: Detalles de modelo no se muestran

::: tip Fenómeno normal

Si usas el método de OAuth Token (API interna), no se mostrarán detalles de uso por modelo.

Esto se debe a que la API interna no devuelve estadísticas de uso a nivel de modelo. Si necesitas detalles de modelo, usa el método de Fine-grained PAT.

:::

## Resumen de esta lección

Este curso explica cómo usar opencode-mystatus para consultar la cuota de GitHub Copilot:

**Puntos clave**:

1. **Premium Requests** es el indicador principal de cuota de Copilot, incluye Chat, Completion, Workspace y otras funciones
2. **Tipo de suscripción** determina el límite mensual: Free 50, Pro 300, Pro+ 1,500, Business 300, Enterprise 1,000
3. **Uso excesivo** generará costos adicionales, se mostrará por separado en la salida
4. **Fine-grained PAT** es el método de autenticación recomendado, no afectado por cambios en la integración OAuth de OpenCode
5. **OAuth Token** puede fallar debido a restricciones de permisos, necesita usar PAT como alternativa

**Interpretación de salida**:
- Barra de progreso: visualiza intuitivamente la proporción restante
- Porcentaje: cantidad restante específica
- Usado / total: detalles de uso
- Detalles de modelo (opcional): número de usos de cada modelo
- Tiempo de restablecimiento (opcional): cuenta regresiva hasta el próximo restablecimiento

## Próxima lección

> En la siguiente lección aprenderemos **[Configuración de autenticación de Copilot](../../advanced/copilot-auth/)**.
>
> Aprenderás:
> - Comparación detallada entre OAuth Token y Fine-grained PAT
> - Cómo generar Fine-grained PAS (pasos completos)
> - Múltiples soluciones para problemas de permisos
> - Mejores prácticas en diferentes escenarios

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta de archivo | Línea |
| ---------------- | --------------------------------------------------------------------------------------------- | ------- |
| Consulta de cuota de Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 481-524 |
| Lectura de Fine-grained PAT | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 122-151 |
| Consulta a API pública de Billing | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 157-177 |
| Consulta a API interna | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 242-304 |
| Lógica de intercambio de token | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 183-208 |
| Formato de API interna | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 354-393 |
| Formato de API pública | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 410-468 |
| Definición de tipo de suscripción de Copilot | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 57-58 |
| Definición de tipo CopilotQuotaConfig | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 66-73 |
| Definición de tipo CopilotAuthData | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 46-51 |
| Límites de suscripción de Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 397-403 |

**Constantes clave**:

- `COPILOT_PLAN_LIMITS`：Límites mensuales por tipo de suscripción (líneas 397-403)
  - `free: 50`
  - `pro: 300`
  - `pro+: 1500`
  - `business: 300`
  - `enterprise: 1000`

- `COPILOT_QUOTA_CONFIG_PATH`：Ruta del archivo de configuración de Fine-grained PAT (líneas 93-98)
  - `~/.config/opencode/copilot-quota-token.json`

**Funciones clave**:

- `queryCopilotUsage()`：Función principal de consulta de cuota de Copilot, incluye dos estrategias de autenticación (líneas 481-524)
- `fetchPublicBillingUsage()`：Usa Fine-grained PAT para consultar API pública de Billing (líneas 157-177)
- `fetchCopilotUsage()`：Usa OAuth Token para consultar API interna (líneas 242-304)
- `exchangeForCopilotToken()`：Lógica de intercambio de OAuth Token (líneas 183-208)
- `formatPublicBillingUsage()`：Formatea respuesta de API pública, incluye detalles de modelo (líneas 410-468)
- `formatCopilotUsage()`：Formatea respuesta de API interna (líneas 354-393)

**Estrategia de autenticación**:

1. **Estrategia 1 (prioridad)**：Usa Fine-grained PAT + API pública de Billing
   - Ventaja: estable, no afectado por cambios en la integración OAuth de OpenCode
   - Desventaja: necesita que el usuario configure PAT manualmente

2. **Estrategia 2 (respaldo)**：Usa OAuth Token + API interna
   - Ventaja: sin necesidad de configuración adicional
   - Desventaja: puede fallar debido a restricciones de permisos (la integración actual de OpenCode no lo soporta)

**Endpoints de API**:

- API pública de Billing：`https://api.github.com/users/{username}/settings/billing/premium_request/usage`
- API interna de cuota：`https://api.github.com/copilot_internal/user`
- API de intercambio de token：`https://api.github.com/copilot_internal/v2/token`

</details>
