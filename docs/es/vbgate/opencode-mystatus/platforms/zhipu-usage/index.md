---
title: "Zhipu AI: Uso y límites | opencode-mystatus"
sidebarTitle: "Zhipu AI"
subtitle: "Zhipu AI: Uso y límites"
description: "Aprende a consultar la cuota de Zhipu AI y Z.ai con opencode-mystatus. Domina el límite de token de 5 horas y la cuota mensual de MCP, interpreta barras de progreso y el tiempo de restablecimiento."
tags:
  - "Zhipu AI"
  - "Z.ai"
  - "consulta de cuota"
  - "límite de token"
  - "cuota de MCP"
prerequisite:
  - "start-quick-start"
order: 2
---

# Consulta de cuota de Zhipu AI y Z.ai: límite de token de 5 horas y cuota mensual de MCP

## Lo que aprenderás

- Ver el uso del límite de token de 5 horas de **Zhipu AI** y **Z.ai**
- Comprender el significado y las reglas de restablecimiento de la **cuota mensual de MCP**
- Interpretar información como barras de progreso, uso, total, etc. en la salida de cuota
- Saber cuándo se activarán las **advertencias de tasa de uso**

## Tu situación actual

Usas Zhipu AI o Z.ai para desarrollar aplicaciones, pero a menudo encuentras estos problemas:

- No sabes cuánta cuota **restante del límite de token de 5 horas** queda
- Después de exceder el límite, las solicitudes fallan, afectando el progreso del desarrollo
- No comprendes el significado específico de la **cuota mensual de MCP**
- Necesitas iniciar sesión en dos plataformas separadas para ver la cuota, lo cual es muy problemático

## Cuándo usar esta técnica

Cuando tú:

- Usas la API de Zhipu AI / Z.ai para desarrollar aplicaciones
- Necesitas monitorear el uso de tokens, evitar exceder el límite
- Quieres conocer la cuota mensual de la función de búsqueda de MCP
- Usas simultáneamente Zhipu AI y Z.ai, quieres gestionar las cuotas de manera unificada

## Enfoque central

El sistema de cuota de **Zhipu AI** y **Z.ai** se divide en dos tipos:

| Tipo de cuota | Significado | Ciclo de restablecimiento |
| -------- | ---- | -------- |
| **Límite de token de 5 horas** | Límite de uso de tokens para solicitudes API | Se restablece automáticamente cada 5 horas |
| **Cuota mensual de MCP** | Límite mensual de veces de búsqueda de MCP (Model Context Protocol) | Se restablece cada mes |

El plugin llama a la API oficial para consultar estos datos en tiempo real y muestra intuitivamente la cuota restante mediante **barras de progreso** y **porcentajes**.

::: info ¿Qué es MCP?

**MCP** (Model Context Protocol) es el protocolo de contexto de modelo proporcionado por Zhipu AI, permite que los modelos de IA busquen y citen recursos externos. La cuota mensual de MCP limita el número de búsquedas que se pueden realizar cada mes.

:::

## Sigue los pasos

### Paso 1: Configura la cuenta de Zhipu AI / Z.ai

**Por qué**
El plugin necesita la API Key para consultar tu cuota. Zhipu AI y Z.ai usan el método de autenticación de **API Key**.

**Operación**

1. Abre el archivo `~/.local/share/opencode/auth.json`

2. Agrega la configuración de API Key de Zhipu AI o Z.ai:

```json
{
  "zhipuai-coding-plan": {
    "type": "api",
    "key": "你的智谱 AI API Key"
  },
  "zai-coding-plan": {
    "type": "api",
    "key": "你的 Z.ai API Key"
  }
}
```

**Lo que deberías ver**:
- El archivo de configuración contiene los campos `zhipuai-coding-plan` o `zai-coding-plan`
- Cada campo tiene `type: "api"` y el campo `key`

### Paso 2: Consulta la cuota

**Por qué**
Llamar a la API oficial para obtener el estado de uso de la cuota en tiempo real.

**Operación**

En OpenCode, ejecuta el comando de barra diagonal:

```bash
/mystatus
```

O pregunta en lenguaje natural:

```
查看我的智谱 AI 额度
```

**Lo que deberías ver** (类似这样的输出):

```
## Zhipu AI 账号额度

Account:        9c89****AQVM (Coding Plan)

5 小时 Token 限额
███████████████████████████ 剩余 95%
已用: 0.5M / 10.0M
重置: 4小时后

MCP 月度配额
██████████████████░░░░░░ 剩余 60%
已用: 200 / 500

## Z.ai 账号额度

Account:        9c89****AQVM (Z.ai)

5 小时 Token 限额
███████████████████████████ 剩余 95%
已用: 0.5M / 10.0M
重置: 4小时后
```

### Paso 3: Interpreta la salida

**Por qué**
Solo comprendiendo el significado de cada línea de salida, puedes gestionar eficazmente la cuota.

**Operación**

Compara con la siguiente explicación para ver tu salida:

| Campo de salida | Significado | Ejemplo |
| -------- | ---- | ---- |
| **Account** | API Key enmascarada y tipo de cuenta | `9c89****AQVM (Coding Plan)` |
| **5 小时 Token 限额** | Uso de tokens en el ciclo actual de 5 horas | Barra de progreso + porcentaje |
| **已用: X / Y** | Token usado / cuota total | `0.5M / 10.0M` |
| **重置: X小时后** | Cuenta regresiva hasta el próximo restablecimiento | `4小时后` |
| **MCP 月度配额** | Uso de veces de búsqueda de MCP en el mes actual | Barra de progreso + porcentaje |
| **已用: X / Y** | Veces usadas / cuota total | `200 / 500` |

**Lo que deberías ver**:
- La sección de límite de token de 5 horas tiene una **cuenta regresiva de tiempo de restablecimiento**
- La sección de cuota mensual de MCP **no tiene cuenta regresiva de tiempo** (porque se restablece mensualmente)
- Si la tasa de uso supera el 80%, aparecerá un **mensaje de advertencia** en la parte inferior

## Punto de control ✅

Confirma que has comprendido lo siguiente:

- [ ] El límite de token de 5 horas tiene una cuenta regresiva de tiempo de restablecimiento
- [ ] La cuota mensual de MCP se restablece cada mes, sin mostrar cuenta regresiva
- [ ] Se activará advertencia cuando la tasa de uso supere el 80%
- [ ] La API Key se muestra enmascarada (solo se muestran los primeros 4 y últimos 4 caracteres)

## Advertencias de errores comunes

### ❌ Error común 1: Falta el campo `type` en el archivo de configuración

**Síntoma de error**: Al consultar, indica "未找到任何已配置的账号"

**Causa**: Falta el campo `type: "api"` en `auth.json`

**Corrección**:

```json
// ❌ Error
{
  "zhipuai-coding-plan": {
    "key": "你的 API Key"
  }
}

// ✅ Correcto
{
  "zhipuai-coding-plan": {
    "type": "api",
    "key": "你的 API Key"
  }
}
```

### ❌ Error común 2: API Key expirada o inválida

**Síntoma de error**: Muestra "API 请求失败" o "鉴权失败"

**Causa**: La API Key ha expirado o ha sido revocada

**Corrección**:
- Inicia sesión en la consola de Zhipu AI / Z.ai
- Regenera la API Key
- Actualiza el campo `key` en `auth.json`

### ❌ Error común 3: Confundir los dos tipos de cuota

**Síntoma de error**: Piensas que el límite de token y la cuota de MCP son lo mismo

**Corrección**:
- **Límite de token**: Uso de tokens para llamadas API, se restablece cada 5 horas
- **Cuota de MCP**: Veces de búsqueda MCP, se restablece cada mes
- Son **dos límites independientes**, no se afectan entre sí

## Resumen de esta lección

En esta lección aprendimos a usar opencode-mystatus para consultar las cuotas de Zhipu AI y Z.ai:

**Conceptos clave**:
- Límite de token de 5 horas: Límite de llamadas API, con cuenta regresiva de restablecimiento
- Cuota mensual de MCP: Veces de búsqueda MCP, se restablece cada mes

**Pasos de operación**:
1. Configura `zhipuai-coding-plan` o `zai-coding-plan` en `auth.json`
2. Ejecuta `/mystatus` para consultar la cuota
3. Interpreta la salida: barras de progreso, uso, tiempo de restablecimiento

**Puntos clave**:
- Se activará advertencia cuando la tasa de uso supere el 80%
- La API Key se muestra enmascarada automáticamente
- El límite de token y la cuota de MCP son dos límites independientes

## Próxima lección

> En la siguiente lección aprenderemos **[Consulta de cuota de GitHub Copilot](../copilot-usage/)**.
>
> Aprenderás:
> - Cómo ver el uso de Premium Requests
> - Diferencias de cuota mensual por diferentes tipos de suscripción
> - Método de interpretación de detalles de uso por modelo

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta de archivo | Línea |
| --- | --- | --- |
| Consulta de cuota de Zhipu AI | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 213-217 |
| Consulta de cuota de Z.ai | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 224-228 |
| Formato de salida | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 115-177 |
| Configuración de endpoint de API | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 62-76 |
| Definición de tipo ZhipuAuthData | [`source/vbgate/opencode-mystatus/plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 38-41 |
| Umbral de advertencia de alta tasa de uso | [`source/vbgate/opencode-mystatus/plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 110-111 |

**Constantes clave**:
- `HIGH_USAGE_THRESHOLD = 80`：Se muestra advertencia cuando la tasa de uso supera el 80% (`types.ts:111`)

**Funciones clave**:
- `queryZhipuUsage(authData)`: Consulta la cuota de cuenta de Zhipu AI (`zhipu.ts:213-217`)
- `queryZaiUsage(authData)`: Consulta la cuota de cuenta de Z.ai (`zhipu.ts:224-228`)
- `formatZhipuUsage(data, apiKey, accountLabel)`: Formatea la salida de cuota (`zhipu.ts:115-177`)
- `fetchUsage(apiKey, config)`: Llama a la API oficial para obtener datos de cuota (`zhipu.ts:81-106`)

**Endpoints de API**:
- Zhipu AI: `https://bigmodel.cn/api/monitor/usage/quota/limit` (`zhipu.ts:63`)
- Z.ai: `https://api.z.ai/api/monitor/usage/quota/limit` (`zhipu.ts:64`)

</details>
