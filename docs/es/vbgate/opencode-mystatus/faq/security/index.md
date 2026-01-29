---
title: "Seguridad y privacidad: protección de datos | opencode-mystatus"
sidebarTitle: "Seguridad"
subtitle: "Seguridad y privacidad: acceso de solo lectura a archivos locales, enmascaramiento de API, interfaces oficiales"
description: "Aprende el mecanismo de seguridad del plugin opencode-mystatus: acceso de solo lectura a archivos locales, enmascaramiento automático de API Key, solo llama a interfaces oficiales, sin almacenamiento ni subida de datos y protección de privacidad."
tags:
  - "seguridad"
  - "privacidad"
  - "FAQ"
prerequisite: []
order: 2
---

# Seguridad y privacidad: acceso de solo lectura a archivos locales, enmascaramiento de API, interfaces oficiales

## Tu situación actual

Al usar herramientas de terceros, ¿qué es lo que más te preocupa?

- "¿Leerá mi API Key?"
- "¿Se subirá mi información de autenticación a un servidor?"
- "¿Hay riesgo de filtración de datos?"
- "¿Qué sucede si modifica mis archivos de configuración?"

Estas preguntas son muy razonables, especialmente al manejar información de autenticación sensible de plataformas de IA. Este tutorial explicará en detalle cómo opencode-mystatus protege tus datos y privacidad a través del diseño.

::: info Principio de prioridad local
opencode-mystatus sigue el principio "solo lectura de archivos locales + consulta directa de API oficial", todas las operaciones sensibles se completan en tu máquina, sin pasar por ningún servidor de terceros.
:::

## Enfoque central

El diseño de seguridad del plugin se basa en tres principios clave:

1. **Principio de solo lectura**: Solo lee archivos de autenticación locales, no escribe ni modifica ningún contenido
2. **Interfaces oficiales**: Solo llama a las API oficiales de cada plataforma, no usa servicios de terceros
3. **Enmascaramiento de datos**: Oculta automáticamente información sensible (como API Key) al mostrar la salida

Estos tres principios se superponen en capas, asegurando que tus datos sean seguros desde la lectura hasta la visualización.

---

## Acceso de solo lectura a archivos locales

### Qué archivos lee el plugin

El plugin solo lee dos archivos de configuración locales, todos en **modo de solo lectura**:

| Ruta de archivo | Uso | Ubicación en código fuente |
| -------- | ---- | -------- |
| `~/.local/share/opencode/auth.json` | Almacenamiento oficial de autenticación de OpenCode | `mystatus.ts:35` |
| `~/.config/opencode/antigravity-accounts.json` | Almacenamiento de cuentas del plugin Antigravity | `google.ts` (lógica de lectura) |

::: tip No modificar archivos
En el código fuente solo se usa la función `readFile` para leer archivos, no hay ninguna operación `writeFile` u otra modificación. Esto significa que el plugin no sobrescribirá accidentalmente tu configuración.
:::

### Evidencia del código fuente

```typescript
// Líneas 38-40 de mystatus.ts
const content = await readFile(authPath, "utf-8");
authData = JSON.parse(content);
```

Aquí se usa `fs/promises.readFile` de Node.js, que es una operación **de solo lectura**. Si el archivo no existe o el formato es incorrecto, el plugin devolverá un mensaje de error amigable, en lugar de crear o modificar archivos.

---

## Enmascaramiento automático de API Key

### Qué es el enmascaramiento

El enmascaramiento (Masking) consiste en mostrar solo parte de los caracteres al visualizar información sensible, ocultando las partes clave.

Por ejemplo, tu API Key de Zhipu AI podría ser:
```
sk-9c89abc1234567890abcdefAQVM
```

Después del enmascaramiento se muestra como:
```
sk-9c8****fAQVM
```

### Reglas de enmascaramiento

El plugin usa la función `maskString` para procesar toda la información sensible:

```typescript
// Líneas 130-135 de utils.ts
export function maskString(str: string, showChars: number = 4): string {
  if (str.length <= showChars * 2) {
    return str;
  }
  return `${str.slice(0, showChars)}****${str.slice(-showChars)}`;
}
```

**Explicación de reglas**:
- Por defecto muestra los primeros 4 y últimos 4 caracteres
- La parte del medio se reemplaza por `****`
- Si la cadena es demasiado corta (≤ 8 caracteres), se devuelve tal cual

### Ejemplo de uso real

En la consulta de cuota de Zhipu AI, la API Key enmascarada aparecerá en la salida:

```typescript
// Línea 124 de zhipu.ts
const maskedKey = maskString(apiKey);
lines.push(`${t.account}        ${maskedKey} (${accountLabel})`);
```

Efecto de salida:
```
Account:        9c89****AQVM (Coding Plan)
```

::: tip Función del enmascaramiento
Incluso si compartes una captura de pantalla de los resultados de la consulta con otros, no filtrará tu API Key real. Solo son visibles los "4 caracteres delanteros y 4 traseros", la parte central ya está oculta.
:::

---

## Llamada a interfaces oficiales

### Qué API llama el plugin

El plugin solo llama a las **API oficiales** de cada plataforma, sin pasar por ningún servidor de terceros:

| Plataforma | Endpoint de API | Uso |
| ---- | -------- | ---- |
| OpenAI | `https://chatgpt.com/backend-api/wham/usage` | Consulta de cuota |
| Zhipu AI | `https://bigmodel.cn/api/monitor/usage/quota/limit` | Consulta de límite de token |
| Z.ai | `https://api.z.ai/api/monitor/usage/quota/limit` | Consulta de límite de token |
| GitHub Copilot | `https://api.github.com/copilot_internal/user` | Consulta de cuota |
| GitHub Copilot | `https://api.github.com/users/{username}/settings/billing/premium_request/usage` | Consulta de API pública |
| Google Cloud | `https://oauth2.googleapis.com/token` | Refresco de token OAuth |
| Google Cloud | `https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels` | Consulta de cuota de modelos |

::: info Seguridad de las API oficiales
Estos endpoints de API son las interfaces oficiales de cada plataforma, usan transmisión encriptada HTTPS. El plugin actúa solo como "cliente" enviando solicitudes, no almacena ni reenvía ningún dato.
:::

### Protección de tiempo de espera

Para evitar que las solicitudes de red se atasquen, el plugin establece un tiempo de espera de 10 segundos:

```typescript
// Línea 114 de types.ts
export const REQUEST_TIMEOUT_MS = 10000;

// Líneas 84-106 de utils.ts
export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = REQUEST_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(t.timeoutError(Math.round(timeoutMs / 1000)));
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
```

**Función del mecanismo de tiempo de espera**:
- Evita que los fallos de red causen esperas infinitas del plugin
- Protege tus recursos del sistema de no ser ocupados
- Después de 10 segundos de tiempo de espera, se cancela automáticamente la solicitud y se devuelve un mensaje de error

---

## Resumen de protección de privacidad

### Lo que NO hace el plugin

| Operación | Comportamiento del plugin |
| ---- | -------- |
| Almacenar datos | ❌ No almacena ningún dato de usuario |
| Subir datos | ❌ No sube ningún dato a servidores de terceros |
| Cachear resultados | ❌ No almacena en caché los resultados de consultas |
| Modificar archivos | ❌ No modifica ningún archivo de configuración local |
| Registrar registros | ❌ No registra ningún registro de uso |

### Lo que SÍ hace el plugin

| Operación | Comportamiento del plugin |
| ---- | -------- |
| Leer archivos | ✅ Solo lee archivos de autenticación locales |
| Llamar a API | ✅ Solo llama a endpoints de API oficiales |
| Mostrar enmascarado | ✅ Oculta automáticamente información sensible como API Key |
| Código abierto | ✅ El código fuente es completamente de código abierto, se puede auditar |

### Código fuente auditable

Todo el código del plugin es de código abierto, puedes:
- Consultar el repositorio de GitHub
- Verificar cada endpoint de API llamado
- Confirmar si hay lógica de almacenamiento de datos
- Confirmar la implementación del método de enmascaramiento

---

## Respuestas a preguntas frecuentes

::: details ¿El plugin robará mi API Key?
No. El plugin solo usa la API Key para enviar solicitudes a la API oficial, no almacena ni reenvía a ningún servidor de terceros. Todo el código es de código abierto, puedes auditarlo.
:::

::: details ¿Por qué se muestra la API Key enmascarada?
Esto es para proteger tu privacidad. Incluso si compartes una captura de pantalla de los resultados de la consulta, no filtrará la API Key completa. Después del enmascaramiento solo se muestran los primeros 4 y últimos 4 caracteres, la parte central ya está oculta.
:::

::: details ¿El plugin modificará mis archivos de configuración?
No. El plugin solo usa `readFile` para leer archivos, no ejecuta ninguna operación de escritura. Si el formato de tu archivo de configuración es incorrecto, el plugin devolverá un mensaje de error, en lugar de intentar reparar o sobrescribir.
:::

::: details ¿Los resultados de la consulta se almacenan en caché en el plugin?
No. El plugin lee archivos y consulta la API en tiempo real cada vez que se llama, no almacena en caché ningún resultado. Los datos se descartan inmediatamente después de completar la consulta.
:::

::: details ¿El plugin recopila datos de uso?
No. El plugin no tiene funcionalidad de rastreo ni recopilación de datos, no rastrea tu comportamiento de uso.
:::

---

## Resumen de esta lección

- **Principio de solo lectura**: El plugin solo lee archivos de autenticación locales, no modifica ningún contenido
- **Enmascaramiento de API**: Oculta automáticamente las partes clave de la API Key al mostrar
- **Interfaces oficiales**: Solo llama a las API oficiales de cada plataforma, no usa servicios de terceros
- **Código abierto y transparente**: Todo el código es de código abierto, puedes auditar el mecanismo de seguridad

## Próxima lección

> En la siguiente lección aprenderemos **[Modelos de datos: estructura de archivos de autenticación y formato de respuesta de API](/es/vbgate/opencode-mystatus/appendix/data-models/)**
>
> Aprenderás:
> - Estructura completa de AuthData
> - Significado de los campos de datos de autenticación de cada plataforma
> - Formato de datos de respuesta de API

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta de archivo | Línea |
| --- | --- | --- |
| Lectura de archivo de autenticación | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts#L38-L40) | 38-40 |
| Función de enmascaramiento de API | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L130-L135) | 130-135 |
| Configuración de tiempo de espera de solicitud | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L114) | 114 |
| Implementación de tiempo de espera | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L84-L106) | 84-106 |
| Ejemplo de enmascaramiento de Zhipu AI | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L124) | 124 |

**Funciones clave**:
- `maskString(str, showChars = 4)`：Enmascara la visualización de cadenas sensibles, muestra `showChars` caracteres al principio y al final, la parte del medio se reemplaza por `****`

**Constantes clave**:
- `REQUEST_TIMEOUT_MS = 10000`：Tiempo de espera de solicitud de API (10 segundos)

</details>
