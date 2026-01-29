---
title: "故障排查: 解决常见问题 | opencode-mystatus"
subtitle: "Preguntas frecuentes: no se puede consultar la cuota, token expirado, problemas de permisos"
sidebarTitle: "故障排查"
description: "学习 opencode-mystatus 的常见问题解决方案。解决认证文件读取失败、token 过期、API 请求失败、GitHub Copilot 和 Google Cloud 配置问题。"
tags:
  - "solución de problemas"
  - "preguntas frecuentes"
  - "token expirado"
  - "problemas de permisos"
prerequisite:
  - "start-quick-start"
order: 1
---

# Preguntas frecuentes: no se puede consultar la cuota, token expirado, problemas de permisos

Al usar el plugin opencode-mystatus, podrías encontrar varios errores: no poder leer archivos de autenticación, token OAuth expirado, permisos insuficientes de GitHub Copilot, fallos en solicitudes API, etc. Estas preguntas frecuentes generalmente se pueden resolver con una configuración simple o re-autenticación. Este tutorial compila los pasos de solución para todos los errores comunes, ayudándote a localizar rápidamente la raíz del problema.

## Lo que aprenderás

- Localizar rápidamente la causa del fallo en la consulta de mystatus
- Resolver el problema de token expirado de OpenAI
- Configurar el Fine-grained PAT de GitHub Copilot
- Manejar la situación de falta de project_id de Google Cloud
- Lidiar con varios fallos y tiempos de espera agotados en solicitudes API

## Tu situación actual

Ejecutas `/mystatus` para consultar la cuota, pero ves varios mensajes de error y no sabes por dónde empezar a investigar.

## Cuándo usar esta técnica

- **Cuando veas cualquier mensaje de error**: Este tutorial cubre todos los errores comunes
- **Cuando acabes de configurar una nueva cuenta**: Verifica si la configuración es correcta
- **Cuando la consulta de cuota falla repentinamente**: Podría ser que el token expiró o cambiaron los permisos

::: tip Principio de solución de problemas

Al encontrar un error, primero observa las palabras clave del mensaje de error, luego corresponde a la solución de este tutorial. La mayoría de los errores tienen mensajes de indicación claros.

:::

## Enfoque central

El mecanismo de manejo de errores de la herramienta mystatus se divide en tres capas:

1. **Capa de lectura de archivos de autenticación**: Verifica si `auth.json` existe, si el formato es correcto
2. **Capa de consulta de plataforma**: Cada plataforma consulta independientemente, el fallo de una no afecta a las demás
3. **Capa de solicitud API**: Las solicitudes de red pueden agotarse o devolver errores, pero la herramienta seguirá intentando otras plataformas

Esto significa:
- Si una plataforma falla, las demás se mostrarán normalmente
- El mensaje de error indicará claramente qué plataforma tiene el problema
- La mayoría de los errores se pueden resolver mediante configuración o re-autenticación

## Lista de verificación de problemas

### Problema 1: No se puede leer el archivo de autenticación

**Mensaje de error**:

```
❌ 无法读取认证文件: ~/.local/share/opencode/auth.json
错误: ENOENT: no such file or directory
```

**Causa**:
- El archivo de autenticación de OpenCode no existe
- Aún no has configurado ninguna cuenta de plataforma

**Solución**:

1. **Confirma que OpenCode está instalado y configurado**
   - Confirma que ya has configurado al menos una plataforma en OpenCode (OpenAI, Zhipu AI, etc.)
   - Si no, completa primero la autorización en OpenCode

2. **Verifica la ruta del archivo**
   - El archivo de autenticación de OpenCode debería estar en `~/.local/share/opencode/auth.json`
   - Si usas un directorio de configuración personalizado, confirma si la ruta del archivo es correcta

3. **Verifica el formato del archivo**
   - Confirma que `auth.json` es un archivo JSON válido
   - El contenido debería incluir al menos información de autenticación de una plataforma

**Lo que deberías ver**:
Después de volver a ejecutar `/mystatus`, puedes ver información de cuota de al menos una plataforma.

---

### Problema 2: No se encontraron cuentas configuradas

**Mensaje de error**:

```
未找到任何已配置的账号。

支持的账号类型:
- OpenAI (Plus/Team/Pro 订阅用户)
- 智谱 AI (Coding Plan)
- Z.ai (Coding Plan)
- Google Cloud (Antigravity)
```

**Causa**:
- `auth.json` existe, pero no tiene configuración válida
- La configuración existente tiene formato incorrecto (por ejemplo, faltan campos obligatorios)

**Solución**:

1. **Verifica el contenido de auth.json**
   Abre `~/.local/share/opencode/auth.json`, confirma que hay al menos una configuración de plataforma:

   ```json
   {
     "openai": {
       "type": "oauth",
       "access": "eyJ...",
       "expires": 1738000000000
     }
   }
   ```

2. **Configura al menos una plataforma**
   - Completa la autorización OAuth en OpenCode
   - O agrega manualmente la API Key de la plataforma (Zhipu AI, Z.ai)

3. **Refiere el formato de configuración**
   Requisitos de configuración de cada plataforma:
   - OpenAI: debe tener `type: "oauth"` y token `access`
   - Zhipu AI / Z.ai: debe tener `type: "api"` y `key`
   - GitHub Copilot: debe tener `type: "oauth"` y token `refresh`
   - Google Cloud: no depende de `auth.json`, necesita configuración separada (ver problema 6)

---

### Problema 3: El token OAuth de OpenAI expiró

**Mensaje de error**:

```
⚠️ OAuth 授权已过期，请在 OpenCode 中使用一次 OpenAI 模型以刷新授权。
```

**Causa**:
- El token OAuth de OpenAI tiene una vida útil limitada, después de expirar no se puede consultar la cuota
- El tiempo de expiración del token se almacena en el campo `expires` de `auth.json`

**Solución**:

1. **Usa una vez el modelo de OpenAI en OpenCode**
   - Haz una pregunta a ChatGPT o Codex
   - OpenCode actualizará automáticamente el token y actualizará `auth.json`

2. **Confirma que el token se ha actualizado**
   - Verifica el campo `expires` en `auth.json`
   - Confirma que es una marca de tiempo en el futuro

3. **Vuelve a ejecutar /mystatus**
   - Ahora deberías poder consultar normalmente la cuota de OpenAI

**Por qué es necesario volver a usar el modelo**:
El token OAuth de OpenAI tiene un mecanismo de expiración, al usar el modelo se activa la actualización del token. Esta es una característica de seguridad del flujo de autenticación OAuth oficial de OpenCode.

---

### Problema 4: Fallo en solicitud API (general)

**Mensaje de error**:

```
OpenAI API 请求失败 (401): Unauthorized
智谱 API 请求失败 (403): Forbidden
Google API 请求失败 (500): Internal Server Error
```

**Causa**:
- Token o API Key inválidos
- Problemas de conexión de red
- El servicio API está temporalmente no disponible
- Permisos insuficientes (algunas plataformas requieren permisos específicos)

**Solución**:

1. **Verifica el Token o API Key**
   - OpenAI: confirma que el token `access` no ha expirado (ver problema 3)
   - Zhipu AI / Z.ai: confirma que la `key` es correcta, sin espacios extra
   - GitHub Copilot: confirma que el token `refresh` es válido

2. **Verifica la conexión de red**
   - Confirma que la red es normal
   - Algunas plataformas pueden tener restricciones regionales (como Google Cloud)

3. **Intenta re-autenticar**
   - Re-autoriza OAuth en OpenCode
   - O actualiza manualmente la API Key

4. **Verifica el código de estado HTTP específico**
   - `401` / `403`: problemas de permisos, generalmente token o API Key inválidos
   - `500` / `503`: errores del lado del servidor, generalmente el servicio API está temporalmente no disponible, inténtalo de nuevo más tarde
   - `429`: solicitudes demasiado frecuentes, necesitas esperar un tiempo

---

### Problema 5: Tiempo de espera agotado en solicitud

**Mensaje de error**:

```
请求超时 (10秒)
```

**Causa**:
- Conexión de red lenta
- El tiempo de respuesta de la API es demasiado largo
- Firewall o proxy bloquean la solicitud

**Solución**:

1. **Verifica la conexión de red**
   - Confirma que la red es estable
   - Intenta visitar el sitio web de la plataforma, confirma que se puede acceder normalmente

2. **Verifica la configuración del proxy**
   - Si usas un proxy, confirma que la configuración es correcta
   - Algunas plataformas pueden necesitar una configuración de proxy especial

3. **Reintentar una vez**
   - A veces es solo una fluctuación temporal de la red
   - Reintentar generalmente puede resolver el problema

---

### Problema 6: La consulta de cuota de GitHub Copilot no está disponible

**Mensaje de error**:

```
⚠️ GitHub Copilot 配额查询暂时不可用。
OpenCode 的新 OAuth 集成不支持访问配额 API。

解决方案:
1. 创建一个 fine-grained PAT (访问 https://github.com/settings/tokens?type=beta)
2. 在 'Account permissions' 中将 'Plan' 设为 'Read-only'
3. 创建配置文件并填写以下内容（包含必需的 `tier` 字段）：
   ```json
   {
     "token": "github_pat_xxx...",
     "username": "你的用户名",
     "tier": "pro"
   }
   ```

其他方法:
• 在 VS Code 中点击状态栏的 Copilot 图标查看配额
• 访问 https://github.com/settings/billing 查看使用情况
```

**Causa**:
- La integración OAuth oficial de OpenCode usa un nuevo flujo de autenticación
- El nuevo token OAuth no tiene permiso `copilot`, no puede llamar a la API interna de cuota
- Esta es una restricción de seguridad oficial de OpenCode

**Solución** (recomendada):

1. **Crea un Fine-grained PAT**
   - Visita https://github.com/settings/tokens?type=beta
   - Haz clic en "Generate new token" → "Fine-grained token"
   - Llena el nombre del Token (como "OpenCode Copilot Quota"）

2. **Configura los permisos**
   - En "Account permissions", encuentra el permiso "Plan"
   - Establece como "Read-only"
   - Haz clic en "Generate token"

3. **Crea el archivo de configuración**
   Crea `~/.config/opencode/copilot-quota-token.json`:

   ```json
   {
     "token": "github_pat_xxx...",
     "username": "你的 GitHub 用户名",
     "tier": "pro"
   }
   ```

   **Explicación del campo tier**:
   - `free`: Copilot Free (50 veces/mes)
   - `pro`: Copilot Pro (300 veces/mes)
   - `pro+`: Copilot Pro+ (1500 veces/mes)
   - `business`: Copilot Business (300 veces/mes)
   - `enterprise`: Copilot Enterprise (1000 veces/mes)

4. **Vuelve a ejecutar /mystatus**
   - Ahora deberías poder consultar normalmente la cuota de GitHub Copilot

**Soluciones alternativas**:

Si no quieres configurar PAT, puedes:
- Hacer clic en el icono de Copilot en la barra de estado de VS Code para ver la cuota
- Visitar https://github.com/settings/billing para ver el uso

---

### Problema 7: Falta project_id de Google Cloud

**Mensaje de error**:

```
⚠️ 缺少 project_id，无法查询额度。
```

**Causa**:
- La configuración de la cuenta de Google Cloud carece de `projectId` o `managedProjectId`
- mystatus necesita el ID del proyecto para llamar a la API de Google Cloud

**Solución**:

1. **Verifica antigravity-accounts.json**
   Abre el archivo de configuración, confirma que la configuración de la cuenta incluye `projectId` o `managedProjectId`:

   ::: code-group

   ```bash [macOS/Linux]
   ~/.config/opencode/antigravity-accounts.json
   ```

   ```powershell [Windows]
   %APPDATA%\opencode\antigravity-accounts.json
   ```

   :::

   ```json
   {
     "accounts": [
       {
         "email": "your-email@gmail.com",
         "refreshToken": "1//xxx",
         "projectId": "your-project-id",
         "addedAt": 1738000000000,
         "lastUsed": 1738000000000,
         "rateLimitResetTimes": {}
       }
     ]
   }
   ```

2. **Cómo obtener el project_id**
   - Visita https://console.cloud.google.com/
   - Selecciona tu proyecto
   - En la información del proyecto, busca "项目 ID" (Project ID)
   - Cópialo y pégalo en el archivo de configuración

3. **Si no hay project_id**
   - Si usas un proyecto administrado, es posible que necesites usar `managedProjectId`
   - Contacta al administrador de Google Cloud para confirmar el ID del proyecto

---

### Problema 8: La API de Zhipu AI / Z.ai devuelve datos inválidos

**Mensaje de error**:

```
智谱 API 请求失败 (200): {"code": 401, "msg": "Invalid API key"}
Z.ai API 请求失败 (200): {"code": 400, "msg": "Bad request"}
```

**Causa**:
- API Key inválida o formato incorrecto
- API Key ha expirado o ha sido revocada
- La cuenta no tiene permiso para el servicio correspondiente

**Solución**:

1. **Confirma que la API Key es correcta**
   - Inicia sesión en la consola de Zhipu AI o Z.ai
   - Verifica si tu API Key es válida
   - Confirma que no hay espacios extra ni saltos de línea

2. **Verifica los permisos de la API Key**
   - Zhipu AI: confirma que tienes permiso de "Coding Plan"
   - Z.ai: confirma que tienes permiso de "Coding Plan"

3. **Regenera la API Key**
   - Si la API Key tiene problemas, puedes regenerarla en la consola
   - Actualiza el campo `key` en `auth.json`

---

## Punto de control ✅

Confirma que puedes resolver independientemente los problemas comunes:

| Habilidad | Método de verificación | Resultado esperado |
|--- | --- | ---|
| Solucionar problemas de archivo de autenticación | Verifica si auth.json existe y el formato es correcto | El archivo existe, el formato JSON es correcto |
| Actualizar el token de OpenAI | Usa una vez el modelo de OpenAI en OpenCode | El token se ha actualizado, se puede consultar normalmente la cuota |
| Configurar el PAT de Copilot | Crear copilot-quota-token.json | Se puede consultar normalmente la cuota de Copilot |
| Manejar errores de API | Verifica el código de estado HTTP y toma medidas correspondientes | Conoce el significado de los códigos de error 401/403/500 |
| Configurar el project_id de Google | Agrega projectId a antigravity-accounts.json | Se puede consultar normalmente la cuota de Google Cloud |

## Resumen de esta lección

El manejo de errores de mystatus se divide en tres capas: lectura de archivos de autenticación, consulta de plataforma, solicitud API. Al encontrar un error, primero observa las palabras clave del mensaje de error, luego corresponde a la solución. Los problemas más comunes incluyen:

1. **Problemas de archivo de autenticación**: Verifica si `auth.json` existe, si el formato es correcto
2. **Token expirado**: Usa una vez el modelo correspondiente en OpenCode para actualizar el token
3. **Error de API**: Juzga si es problema de permisos o problema del servidor según el código de estado HTTP
4. **Permisos especiales de Copilot**: La nueva integración OAuth necesita configurar Fine-grained PAT
5. **Configuración de Google**: Necesita project_id para poder consultar la cuota

La mayoría de los errores se pueden resolver mediante configuración o re-autenticación, el fallo de una plataforma no afecta la consulta de las demás plataformas.

## Próxima lección

> En la siguiente lección aprenderemos **[Seguridad y privacidad: acceso de solo lectura a archivos locales, enmascaramiento de API, interfaces oficiales](/es/vbgate/opencode-mystatus/faq/security/)**。
>
> Aprenderás:
> - Cómo mystatus protege tus datos sensibles
> - Principio de enmascaramiento automático de API Key
> - Por qué el plugin es una herramienta local segura
> - Garantía de que los datos no se almacenan ni se suben

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta de archivo | Línea |
|--- | --- | ---|
| Lógica principal de manejo de errores | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 41-87 |
| Lectura de archivo de autenticación | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 38-46 |
| Indicación de cuenta no encontrada | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 78-80 |
| Recopilación y resumen de resultados | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 58-89 |
| Verificación de expiración de token de OpenAI | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts) | 216-221 |
| Manejo de errores de API | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts) | 149-152 |
| Lectura de PAT de Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 122-151 |
| Indicación de fallo de OAuth de Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 298-303 |
| Verificación de project_id de Google | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 232-234 |
| Manejo de errores de API de Zhipu | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 94-103 |
| Definición de mensajes de error | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts) | 66-123 (chino), 144-201 (inglés) |

**Constantes clave**:

- `HIGH_USAGE_THRESHOLD = 80`: Umbral de advertencia de alta tasa de uso (`plugin/lib/types.ts:111`)

**Funciones clave**:

- `collectResult()`: Recopila los resultados de consulta en los arrays results y errors (`plugin/mystatus.ts:100-116`)
- `queryOpenAIUsage()`: Consulta la cuota de OpenAI, incluye verificación de expiración de token (`plugin/lib/openai.ts:207-236`)
- `readQuotaConfig()`: Lee la configuración de PAT de Copilot (`plugin/lib/copilot.ts:122-151`)
- `fetchAccountQuota()`: Consulta la cuota de una sola cuenta de Google Cloud (`plugin/lib/google.ts:218-256`)
- `fetchUsage()`: Consulta el uso de Zhipu/Z.ai (`plugin/lib/zhipu.ts:81-106`)

</details>
