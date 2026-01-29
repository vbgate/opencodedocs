---
title: "Copilot: Autenticación | opencode-mystatus"
sidebarTitle: "Autenticación"
subtitle: "Copilot: Autenticación"
description: "Aprende a configurar la autenticación de GitHub Copilot usando OAuth Token y Fine-grained PAT. Resuelve problemas de permisos OAuth, crea PAT y configura suscripción."
tags:
  - "GitHub Copilot"
  - "Autenticación OAuth"
  - "Configuración de PAT"
  - "Problemas de permisos"
prerequisite:
  - "start-quick-start"
  - "platforms-copilot-usage"
order: 2
---

# Configuración de autenticación de Copilot: OAuth Token y Fine-grained PAT

## Lo que aprenderás

- Comprender los dos métodos de autenticación de Copilot: OAuth Token y Fine-grained PAT
- Resolver el problema de permisos insuficientes de OAuth Token
- Crear Fine-grained PAT y configurar el tipo de suscripción
- Consultar exitosamente la cuota de Premium Requests de Copilot

## Tu situación actual

Al ejecutar `/mystatus` para consultar la cuota de Copilot, podrías ver el siguiente mensaje de error:

```
⚠️ GitHub Copilot 配额查询暂时不可用。
OpenCode 的新 OAuth 集成不支持访问配额 API。

解决方案:
1. 创建一个 fine-grained PAT (访问 https://github.com/settings/tokens?type=beta)
2. 在 'Account permissions' 中将 'Plan' 设为 'Read-only'
3. 创建配置文件 ~/.config/opencode/copilot-quota-token.json:
   {"token": "github_pat_xxx...", "username": "你的用户名"}
```

No sabes:
- ¿Qué es OAuth Token? ¿Qué es Fine-grained PAT?
- ¿Por qué la integración OAuth no puede acceder a la API de cuota?
- ¿Cómo crear Fine-grained PAT?
- ¿Cómo elegir entre free、pro、pro+ y otros tipos de suscripción?

Estos problemas te impiden consultar la cuota de Copilot.

## Cuándo usar esta técnica

Cuando tú:
- Ves el mensaje "OpenCode 的新 OAuth 集成不支持访问配额 API"
- Quieres usar el método más estable de Fine-grained PAT para consultar la cuota
- Necesitas configurar la consulta de cuota de Copilot para equipos o empresas

## Enfoque central

mystatus soporta **dos métodos de autenticación de Copilot**:

| Método de autenticación | Descripción | Ventajas | Desventajas |
|--- | --- | --- | ---|
| **OAuth Token** (predeterminado) | Token OAuth de GitHub obtenido al iniciar sesión en OpenCode | Sin configuración adicional, listo para usar | El token OAuth de la nueva versión de OpenCode puede no tener permiso de Copilot |
| **Fine-grained PAT** (recomendado) | Fine-grained Personal Access Token creado manualmente por el usuario | Estable y confiable, no depende de permisos OAuth | Necesita crear manualmente una vez |

**Reglas de prioridad**:
1. mystatus usa preferiblemente Fine-grained PAT (si está configurado)
2. Si no hay PAT configurado, usa OAuth Token como respaldo

::: tip Práctica recomendada
Si tu OAuth Token tiene problemas de permisos, crear un Fine-grained PAT es la solución más estable.
:::

### Diferencias entre los dos métodos

**OAuth Token**:
- Ubicación de almacenamiento: `~/.local/share/opencode/auth.json`
- Método de obtención: Obtenido automáticamente al iniciar sesión en GitHub en OpenCode
- Problemas de permisos: La nueva versión de OpenCode usa un cliente OAuth diferente, que puede no otorgar permisos de Copilot

**Fine-grained PAT**:
- Ubicación de almacenamiento: `~/.config/opencode/copilot-quota-token.json`
- Método de obtención: Creado manualmente en GitHub Developer Settings
- Requisitos de permisos: Necesita marcar permiso "Plan" (información de suscripción) de lectura

## Sigue los pasos

### Paso 1: Verifica si Fine-grained PAT está configurado

Ejecuta el siguiente comando en la terminal para verificar si el archivo de configuración existe:

::: code-group

```bash [macOS/Linux]
ls -la ~/.config/opencode/copilot-quota-token.json
```

```powershell [Windows]
Test-Path "$env:APPDATA\opencode\copilot-quota-token.json"
```

:::

**Lo que deberías ver**:
- Si el archivo existe, ya has configurado Fine-grained PAT
- Si el archivo no existe o indica error, necesitas crear uno

### Paso 2: Crea Fine-grained PAT (si aún no está configurado)

Si el archivo no existe en el paso anterior, sigue estos pasos para crear:

#### 2.1 Visita la página de creación de PAT de GitHub

En el navegador, visita:
```
https://github.com/settings/tokens?type=beta
```

Esta es la página de creación de Fine-grained PAT de GitHub.

#### 2.2 Crea nuevo Fine-grained PAT

Haz clic en **Generate new token (classic)** o **Generate new token (beta)**, se recomienda usar Fine-grained (beta).

**Configuración de parámetros**:

| Campo | Valor |
|--- | ---|
| **Name** | `mystatus-copilot` (o cualquier nombre que te guste) |
| **Expiration** | Selecciona el tiempo de expiración (como 90 days o No expiration) |
| **Resource owner** | No necesitas seleccionar (por defecto) |

**Configuración de permisos** (¡importante!):

En la sección **Account permissions**, marca:
- ✅ **Plan** → Selecciona **Read** (este permiso es necesario para consultar la cuota)

::: warning Aviso importante
Solo marca el permiso "Plan" de Read, no marques otros permisos innecesarios para proteger la seguridad de tu cuenta.
:::

**Lo que deberías ver**:
- Marcado "Plan: Read"
- No marcados otros permisos (mantiene el principio de mínimo privilegio)

#### 2.3 Genera y guarda el Token

Haz clic en el botón **Generate token** en la parte inferior de la página.

**Lo que deberías ver**:
- La página muestra el Token recién generado (similar a `github_pat_xxxxxxxxxxxx`)
- ⚠️ **Copia inmediatamente este Token**, después de refrescar la página ya no se verá

### Paso 3: Obtén el nombre de usuario de GitHub

En el navegador, visita tu página principal de GitHub:
```
https://github.com/
```

**Lo que deberías ver**:
- En la esquina superior derecha o izquierda se muestra tu nombre de usuario (como `john-doe`)

Registra este nombre de usuario, se necesitará en la configuración.

### Paso 4: Determina el tipo de suscripción de Copilot

Necesitas conocer tu tipo de suscripción de Copilot, porque diferentes tipos tienen diferentes límites mensuales:

| Tipo de suscripción | Cuota mensual | Escenario de uso |
|--- | --- | ---|
| `free` | 50 | Copilot Free (usuarios gratuitos) |
| `pro` | 300 | Copilot Pro (versión personal profesional) |
| `pro+` | 1500 | Copilot Pro+ (versión personal mejorada) |
| `business` | 300 | Copilot Business (versión comercial de equipo) |
| `enterprise` | 1000 | Copilot Enterprise (versión empresarial) |

::: tip ¿Cómo determinar el tipo de suscripción?
1. Visita la [página de suscripción de GitHub Copilot](https://github.com/settings/copilot)
2. Mira el plan de suscripción mostrado actualmente
3. Selecciona el tipo correspondiente de la tabla anterior
:::

### Paso 5: Crea el archivo de configuración

Según tu sistema operativo, crea el archivo de configuración y llena la información.

::: code-group

```bash [macOS/Linux]
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/copilot-quota-token.json << 'EOF'
{
  "token": "你的_PAT_Token",
  "username": "你的_GitHub_用户名",
  "tier": "订阅类型"
}
EOF
```

```powershell [Windows]
# Crear directorio (si no existe)
New-Item -ItemType Directory -Force -Path "$env:APPDATA\opencode" | Out-Null

# Crear archivo de configuración
@"
{
  "token": "你的_PAT_Token",
  "username": "你的_GitHub_用户名",
  "tier": "订阅类型"
}
"@ | Out-File -FilePath "$env:APPDATA\opencode\copilot-quota-token.json" -Encoding utf8
```

:::

**Ejemplo de configuración**:

Suponiendo que tu PAT es `github_pat_abc123`, el nombre de usuario es `johndoe`, el tipo de suscripción es `pro`:

```json
{
  "token": "github_pat_abc123",
  "username": "johndoe",
  "tier": "pro"
}
```

::: danger Aviso de seguridad
- No envíes el Token al repositorio de Git ni lo compartas con otros
- El Token es el credencial para acceder a tu cuenta de GitHub, su filtración podría causar problemas de seguridad
:::

### Paso 6: Verifica la configuración

Ejecuta el comando `/mystatus` en OpenCode.

**Lo que deberías ver**:
- La sección de Copilot muestra normalmente la información de cuota
- Ya no aparecen mensajes de error de permisos
- Muestra contenido similar a:

```
## GitHub Copilot Account Quota

Account:        GitHub Copilot (@johndoe)

Premium requests
███████████████████░░░░░░ 70% (90/300)

Period: 2026-01
```

## Punto de control ✅

Verifica que has entendido:

| Escenario | Lo que deberías ver/hacer |
|--- | ---|
| Archivo de configuración ya existe | `ls ~/.config/opencode/copilot-quota-token.json` muestra el archivo |
| PAT creado exitosamente | El Token comienza con `github_pat_` |
| Tipo de suscripción correcto | El valor de `tier` en la configuración es free/pro/pro+/business/enterprise |
| Verificación exitosa | Después de ejecutar `/mystatus` ves la información de cuota de Copilot |

## Advertencias de errores comunes

### ❌ Error de operación: Olvidar marcar el permiso "Plan: Read"

**Síntoma de error**: Al ejecutar `/mystatus` ves un error de API (403 o 401)

**Causa**: No marcaste los permisos necesarios al crear el PAT.

**Operación correcta**:
1. Elimina el Token antiguo (en GitHub Settings)
2. Recrea, asegurándote de marcar **Plan: Read**
3. Actualiza el campo `token` en el archivo de configuración

### ❌ Error de operación: Tipo de suscripción incorrecto

**Síntoma de error**: La cuota se muestra incorrectamente (por ejemplo, usuario Free muestra 300 de cuota)

**Causa**: El campo `tier` está mal llenado (por ejemplo, se llenó `pro` pero en realidad es `free`).

**Operación correcta**:
1. Confirma el tipo de suscripción en la página de configuración de GitHub Copilot
2. Modifica el campo `tier` en el archivo de configuración

### ❌ Error de operación: Token expirado

**Síntoma de error**: Al ejecutar `/mystatus` ves un error 401

**Causa**: El Fine-grained PAT ha establecido un tiempo de expiración, ya ha caducado.

**Operación correcta**:
1. Visita GitHub Settings → página Tokens
2. Encuentra el Token caducado y elimínalo
3. Crea un nuevo Token, actualiza el archivo de configuración

### ❌ Error de operación: Error de mayúsculas/minúsculas del nombre de usuario

**Síntoma de error**: Ves un error 404 o usuario no existe

**Causa**: El nombre de usuario de GitHub distingue mayúsculas y minúsculas (por ejemplo, `Johndoe` y `johndoe` son usuarios diferentes).

**Operación correcta**:
1. Copia el nombre de usuario mostrado en la página principal de GitHub (exactamente igual)
2. No lo ingreses manualmente para evitar errores de mayúsculas/minúsculas

::: tip Pequeño truco
Si encuentras un error 404, copia directamente el nombre de usuario desde la URL de GitHub. Por ejemplo, al visitar `https://github.com/YourName`, `YourName` en la URL es tu nombre de usuario.
:::

## Resumen de esta lección

mystatus soporta dos métodos de autenticación de Copilot:

1. **OAuth Token** (predeterminado): Obtenido automáticamente, pero puede tener problemas de permisos
2. **Fine-grained PAT** (recomendado): Configurado manualmente, estable y confiable

Pasos recomendados para configurar Fine-grained PAT:
1. Crea Fine-grained PAT en GitHub Settings
2. Marca el permiso "Plan: Read"
3. Registra el nombre de usuario de GitHub y el tipo de suscripción
4. Crea el archivo de configuración `~/.config/opencode/copilot-quota-token.json`
5. Verifica que la configuración sea exitosa

Después de completar la configuración, mystatus usará preferiblemente el PAT para consultar la cuota de Copilot, evitando problemas de permisos de OAuth.

## Próxima lección

> En la siguiente lección aprenderemos **[Soporte multilingüe: cambio automático entre chino e inglés](../i18n-setup/)**。
>
> Aprenderás:
> - Mecanismo de detección de idioma (API Intl, variables de entorno)
> - Cómo cambiar manualmente el idioma
> - Tabla de correspondencia chino-inglés

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta de archivo | Línea |
|--- | --- | ---|
| Entrada de estrategia de autenticación de Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L481-L524) | 481-524 |
|--- | --- | ---|
| Llamada a API de Billing público | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L157-L177) | 157-177 |
| Intercambio de Token OAuth | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L183-L208) | 183-208 |
| Llamada a API interna (OAuth) | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L242-L304) | 242-304 |
| Formato de salida de API pública | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L410-L468) | 410-468 |
| Definición de tipo CopilotAuthData | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L46-L51) | 46-51 |
| Definición de tipo CopilotQuotaConfig | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L66-L73) | 66-73 |
| Definición de enumeración CopilotTier | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L57) | 57 |
| Límites de suscripción de Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L397-L403) | 397-403 |

**Constantes clave**:
- `COPILOT_QUOTA_CONFIG_PATH = "~/.config/opencode/copilot-quota-token.json"`：Ruta del archivo de configuración de Fine-grained PAT
- `COPILOT_PLAN_LIMITS`：Límites mensuales por cada tipo de suscripción (líneas 397-403)

**Funciones clave**:
- `queryCopilotUsage(authData)`：Función principal de consulta de cuota de Copilot, incluye dos estrategias de autenticación
- `readQuotaConfig()`：Lee el archivo de configuración de Fine-grained PAT
- `fetchPublicBillingUsage(config)`：Llama a la API pública de Billing de GitHub (usando PAT)
- `fetchCopilotUsage(authData)`：Llama a la API interna de GitHub (usando OAuth Token)
- `exchangeForCopilotToken(oauthToken)`：Intercambia OAuth Token por Token de sesión de Copilot
- `formatPublicBillingUsage(data, tier)`：Formatea la respuesta de la API pública
- `formatCopilotUsage(data)`：Formatea la respuesta de la API interna

**Comparación de procesos de autenticación**:

| Estrategia | Tipo de Token | Endpoint de API | Prioridad |
|--- | --- | --- | ---|
| Fine-grained PAT | Fine-grained PAT | `/users/{username}/settings/billing/premium_request/usage` | 1 (prioridad) |
| OAuth Token (caché) | Token de sesión de Copilot | `/copilot_internal/user` | 2 |
| OAuth Token (directo) | Token OAuth de GitHub | `/copilot_internal/user` | 3 |
| OAuth Token (intercambio) | Token de sesión de Copilot (después del intercambio) | `/copilot_internal/v2/token` | 4 |

</details>
