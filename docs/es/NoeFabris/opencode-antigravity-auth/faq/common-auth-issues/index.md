---
title: "Solución de Problemas de Autenticación OAuth: Guía de Errores Comunes | Antigravity Auth"
sidebarTitle: "Qué hacer si falla la autenticación OAuth"
subtitle: "Solución de Problemas de Autenticación OAuth: Guía de Errores Comunes"
description: "Aprenda a solucionar problemas de autenticación OAuth con el plugin Antigravity Auth. Cubre fallos de callback en Safari, errores 403, limitación de tasas, configuración en entornos WSL2/Docker y más soluciones comunes."
tags:
  - FAQ
  - Solución de problemas
  - OAuth
  - Autenticación
prerequisite:
  - start-first-auth-login
  - start-quick-install
order: 1
---

# Solución de Problemas de Autenticación Comunes

Al completar esta lección, podrás resolver por ti mismo problemas comunes como fallos en la autenticación OAuth, errores de actualización de tokens y denegaciones de permisos, restaurando rápidamente el funcionamiento normal del plugin.

## Tu Situación Actual

Acabas de instalar el plugin Antigravity Auth y estás listo para trabajar con los modelos Claude o Gemini 3, pero:

- Después de ejecutar `opencode auth login`, la autorización del navegador tiene éxito, pero el terminal muestra "autorización fallida"
- Después de usarlo por un tiempo, de repente aparece el error "Permission Denied" o "invalid_grant"
- Todas las cuentas muestran "rate limit", aunque la cuota parece suficiente
- No se puede completar la autenticación OAuth en entornos WSL2 o Docker
- El callback OAuth siempre falla en el navegador Safari

Estos problemas son muy comunes. En la mayoría de los casos, no necesitas reinstalar ni contactar soporte; siguiendo este artículo paso a paso podrás resolverlos.

## Cuándo Usar Esta Guía

Consulta este tutorial cuando encuentres las siguientes situaciones:
- **Fallo de autenticación OAuth**: `opencode auth login` no puede completarse
- **Token inválido**: errores invalid_grant, Permission Denied
- **Limitación de tasas**: error 429, "todas las cuentas con rate limit"
- **Problemas de entorno**: WSL2, Docker, entornos de desarrollo remoto
- **Conflictos de plugins**: incompatibilidad con oh-my-opencode u otros plugins

::: tip Restablecimiento Rápido
Ante problemas de autenticación, **el 90% de los casos** se pueden resolver eliminando el archivo de cuentas y re-autenticando:
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```
:::

---

## Flujo de Diagnóstico Rápido

Cuando encuentres un problema, localízalo rápidamente siguiendo este orden:

1. **Verificar ruta de configuración** → Confirmar que la ubicación del archivo es correcta
2. **Eliminar archivo de cuentas y re-autenticar** → Resuelve la mayoría de problemas de autenticación
3. **Ver mensaje de error** → Buscar soluciones según el tipo de error específico
4. **Verificar entorno de red** → WSL2/Docker requieren configuración adicional

---

## Conceptos Clave: Autenticación OAuth y Gestión de Tokens

Antes de resolver problemas, comprende estos conceptos clave.

::: info ¿Qué es la Autenticación OAuth 2.0 PKCE?

Antigravity Auth utiliza el mecanismo de autenticación **OAuth 2.0 with PKCE** (Proof Key for Code Exchange):

1. **Código de autorización**: Después de autorizar, Google devuelve un código de autorización temporal
2. **Intercambio de tokens**: El plugin intercambia el código por un `access_token` (para llamadas API) y un `refresh_token` (para refrescar)
3. **Refresco automático**: 30 minutos antes de que expire el `access_token`, el plugin lo actualiza automáticamente con el `refresh_token`
4. **Almacenamiento de tokens**: Todos los tokens se almacenan localmente en `~/.config/opencode/antigravity-accounts.json`, no se suben a ningún servidor

**Seguridad**: El mecanismo PKCE evita que el código de autorización sea interceptado; incluso si el token se filtra, el atacante no puede volver a autorizar.

:::

::: info ¿Qué es el Rate Limit (Limitación de Tasas)?

Google tiene límites de frecuencia para las llamadas API de cada cuenta de Google. Cuando se alcanza el límite:

- **429 Too Many Requests**: Demasiadas solicitudes, necesitas esperar
- **403 Permission Denied**: Posible soft-ban o detección de abuso
- **Solicitud colgada**: 200 OK pero sin respuesta, usualmente indica throttling silencioso

**Ventaja de múltiples cuentas**: Al rotar entre varias cuentas, puedes evitar los límites de una sola cuenta, maximizando la cuota total.

:::

---

## Explicación de Rutas de Configuración

Todas las plataformas (incluido Windows) usan `~/.config/opencode/` como directorio de configuración:

| Archivo | Ruta | Descripción |
| --- | --- | ---|
| Configuración principal | `~/.config/opencode/opencode.json` | Archivo de configuración principal de OpenCode |
| Archivo de cuentas | `~/.config/opencode/antigravity-accounts.json` | Tokens OAuth e información de cuentas |
| Configuración del plugin | `~/.config/opencode/antigravity.json` | Configuración específica del plugin |
| Logs de depuración | `~/.config/opencode/antigravity-logs/` | Archivos de log de depuración |

> **Nota para usuarios de Windows**: `~` se resuelve automáticamente a tu directorio de usuario (ej. `C:\Users\YourName`). No uses `%APPDATA%`.

---

## Problemas de Autenticación OAuth

### Fallo de Callback OAuth en Safari (macOS)

**Síntomas**:
- Después de autorizar exitosamente en el navegador, el terminal muestra "fail to authorize"
- Safari muestra "Safari no puede abrir la página" o "conexión rechazada"

**Causa**: El modo "HTTPS-Only" de Safari bloquea la dirección de callback `http://localhost`.

**Soluciones**:

**Opción 1: Usar otro navegador (más simple)**

1. Ejecuta `opencode auth login`
2. Copia la URL OAuth mostrada en el terminal
3. Pégala en Chrome o Firefox
4. Completa la autorización

**Opción 2: Deshabilitar temporalmente el modo HTTPS-Only**

1. Safari → Preferencias (⌘,) → Privacidad
2. Desmarca "Activar modo Solo HTTPS"
3. Ejecuta `opencode auth login`
4. Vuelve a activar el modo HTTPS-Only después de la autenticación

**Opción 3: Extraer manualmente el callback (avanzado)**

Cuando Safari muestra el error, la barra de direcciones contiene `?code=...&scope=...`, puedes extraer manualmente los parámetros del callback. Consulta [issue #119](https://github.com/NoeFabris/opencode-antigravity-auth/issues/119) para más detalles.

### Puerto ya en uso

**Mensaje de error**: `Address already in use`

**Causa**: El servidor de callback OAuth usa por defecto `localhost:51121`. Si el puerto está ocupado, no puede iniciarse.

**Soluciones**:

**macOS / Linux:**
```bash
# Buscar el proceso que usa el puerto
lsof -i :51121

# Matar el proceso (reemplaza <PID> con el ID real del proceso)
kill -9 <PID>

# Reautenticar
opencode auth login
```

**Windows:**
```powershell
# Buscar el proceso que usa el puerto
netstat -ano | findstr :51121

# Matar el proceso (reemplaza <PID> con el ID real del proceso)
taskkill /PID <PID> /F

# Reautenticar
opencode auth login
```

### WSL2 / Docker / Entornos de desarrollo remoto

**Problema**: El callback OAuth requiere que el navegador pueda acceder al `localhost` donde se ejecuta OpenCode, pero en contenedores o entornos remotos esto no es accesible directamente.

**Soluciones para WSL2**:
- Usar el reenvío de puertos de VS Code
- O configurar reenvío de puertos de Windows → WSL

**Soluciones para SSH / Desarrollo remoto:**
```bash
# Establecer túnel SSH, reenviando el puerto 51121 remoto al local
ssh -L 51121:localhost:51121 user@remote-host
```

**Soluciones para Docker / Contenedores:**
- El callback localhost no funciona dentro de contenedores
- Esperar 30 segundos y usar el flujo manual con URL
- O usar reenvío de puertos SSH

### Problemas de autenticación con múltiples cuentas

**Síntomas**: Falla la autenticación de múltiples cuentas o se confunden.

**Soluciones**:
1. Eliminar el archivo de cuentas: `rm ~/.config/opencode/antigravity-accounts.json`
2. Reautenticar: `opencode auth login`
3. Asegurar que cada cuenta use un correo de Google diferente

---

## Problemas de actualización de tokens

### Error invalid_grant

**Mensaje de error**:
```
Error: invalid_grant
Token has been revoked or expired.
```

**Causas**:
- Cambio de contraseña de la cuenta de Google
- Evento de seguridad en la cuenta (ej. inicio de sesión sospechoso)
- El `refresh_token` ha expirado

**Solución**:
```bash
# Eliminar archivo de cuentas
rm ~/.config/opencode/antigravity-accounts.json

# Reautenticar
opencode auth login
```

### Token expirado

**Síntomas**: Después de un período sin usar, la próxima llamada al modelo genera un error.

**Causas**: El `access_token` tiene una validez de aproximadamente 1 hora; el `refresh_token` tiene una validez mayor pero también expira.

**Soluciones**:
- El plugin actualiza automáticamente el token 30 minutos antes de la expiración, sin intervención manual
- Si el refresco automático falla, reautenticar: `opencode auth login`

---

## Errores de permisos

### 403 Permission Denied (rising-fact-p41fc)

**Mensaje de error**:
```
Permission 'cloudaicompanion.companions.generateChat' denied on resource
'//cloudaicompanion.googleapis.com/projects/rising-fact-p41fc/locations/global'
```

**Causa**: Cuando el plugin no encuentra un proyecto válido, recurre al Project ID por defecto (ej. `rising-fact-p41fc`). Esto funciona para modelos Antigravity, pero falla para modelos Gemini CLI porque Gemini CLI requiere un proyecto GCP en tu propia cuenta.

**Soluciones**:

**Paso 1: Crear o seleccionar un proyecto GCP**

1. Visita [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el ID del proyecto (ej. `my-gemini-project`)

**Paso 2: Habilitar la API de Gemini for Google Cloud**

1. En Google Cloud Console, ve a "APIs y servicios" → "Biblioteca"
2. Busca "Gemini for Google Cloud API" (`cloudaicompanion.googleapis.com`)
3. Haz clic en "Habilitar"

**Paso 3: Añadir projectId al archivo de cuentas**

Edita `~/.config/opencode/antigravity-accounts.json`:

```json
{
  "version": 3,
  "accounts": [
    {
      "email": "your@gmail.com",
      "refreshToken": "...",
      "projectId": "my-gemini-project"
    }
  ]
}
```

::: warning Configuración de múltiples cuentas
Si tienes configuradas múltiples cuentas de Google, cada una necesita su propio `projectId`.
:::

---

## Problemas de límite de tasa

### Todas las cuentas con rate limit (pero cuota disponible)

**Síntomas**:
- Mensaje "All accounts rate-limited"
- La cuota parece suficiente, pero no se pueden hacer nuevas solicitudes
- Las cuentas recién añadidas son inmediatamente limitadas

**Causa**: Este es un bug en cascada en modo híbrido del plugin (`clearExpiredRateLimits()`), que ha sido corregido en versiones beta recientes.

**Soluciones**:

**Opción 1: Actualizar a la última versión beta**
```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**Opción 2: Eliminar archivo de cuentas y reautenticar**
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

**Opción 3: Cambiar estrategia de selección de cuentas**
Edita `~/.config/opencode/antigravity.json`, cambia la estrategia a `sticky`:
```json
{
  "account_selection_strategy": "sticky"
}
```

### 429 Too Many Requests

**Síntomas**:
- Las solicitudes frecuentes devuelven error 429
- Mensaje "Rate limit exceeded"

**Causa**: Google ha endurecido significativamente el enforcement de cuotas y límites de tasa. Todos los usuarios se ven afectados, no solo este plugin. Factores clave:

1. **Enforcement más estricto**: Incluso si la cuota "parece disponible", Google puede limitar o soft-banear cuentas que activan detección de abuso
2. **Patrón de solicitudes de OpenCode**: OpenCode hace más llamadas API que las apps nativas (llamadas de herramientas, reintentos, streaming, cadenas de conversación multi-turno), lo que activa límites más rápido que el uso "normal"
3. **Shadow bans**: Algunas cuentas, una vez marcadas, no pueden usarse por períodos prolongados, mientras que otras continúan funcionando normalmente

::: danger Riesgo de uso
El uso de este plugin puede aumentar las posibilidades de activar protecciones automáticas de abuso/límites de tasa. El proveedor upstream puede restringir, suspender o terminar el acceso a su discreción. **Úsalo bajo tu propio riesgo**.
:::

**Soluciones**:

**Opción 1: Esperar reinicio (más confiable)**

Los límites de tasa generalmente se reinician después de algunas horas. Si el problema persiste:
- Deja de usar la cuenta afectada durante 24-48 horas
- Durante este tiempo, usa otras cuentas
- Verifica `rateLimitResetTimes` en el archivo de cuentas para ver cuándo expiran los límites

**Opción 2: "Calentar" la cuenta en Antigravity IDE (experiencia de la comunidad)**

Los usuarios reportan que este método funciona:
1. Abre [Antigravity IDE](https://idx.google.com/) directamente en tu navegador
2. Inicia sesión con la cuenta de Google afectada
3. Ejecuta algunos prompts simples (ej. "hola", "¿cuánto es 2+2?")
4. Después de 5-10 prompts exitosos, intenta usar la cuenta con el plugin nuevamente

**Principio**: Usar la cuenta a través de la interfaz "oficial" puede restablecer algunas banderas internas, o hacer que la cuenta parezca menos sospechosa.

**Opción 3: Reducir volumen y ráfagas de solicitudes**

- Usa sesiones más cortas
- Evita flujos de trabajo paralelos/intensivos en reintentos (ej. generar múltiples sub-agentes simultáneamente)
- Si usas oh-my-opencode, considera reducir el número de agentes concurrentes generados
- Establece `max_rate_limit_wait_seconds: 0` para fallar rápidamente en lugar de reintentar

**Opción 4: Usar Antigravity IDE directamente (usuarios de cuenta única)**

Si solo tienes una cuenta, usar [Antigravity IDE](https://idx.google.com/) directamente puede dar una mejor experiencia, ya que el patrón de solicitudes de OpenCode activa límites más rápido.

**Opción 5: Configuración de nueva cuenta**

Si agregas una nueva cuenta:
1. Elimina el archivo de cuentas: `rm ~/.config/opencode/antigravity-accounts.json`
2. Reautentica: `opencode auth login`
3. Actualiza a la última beta: `"plugin": ["opencode-antigravity-auth@beta"]`
4. Considera "calentar" primero la cuenta en Antigravity IDE

**Información a reportar**:

Si experimentas comportamientos anormales de limitación de tasas, por favor comparte en un [issue de GitHub](https://github.com/NoeFabris/opencode-antigravity-auth/issues):
- Códigos de estado en logs de depuración (403, 429, etc.)
- Duración del estado de rate limit
- Número de cuentas y estrategia de selección utilizada

### Solicitud colgada (sin respuesta)

**Síntomas**:
- El prompt permanece colgado sin retornar
- Los logs muestran 200 OK pero sin contenido de respuesta

**Causa**: Generalmente es throttling silencioso o soft-ban de Google.

**Soluciones**:
1. Detén la solicitud actual (Ctrl+C o ESC)
2. Espera 24-48 horas antes de usar esa cuenta nuevamente
3. Durante este tiempo, usa otras cuentas

---

## Problemas de recuperación de sesión

### Error después de interrumpir ejecución de herramienta

**Síntomas**: Al presionar ESC para interrumpir la ejecución de una herramienta, las conversaciones posteriores generan el error `tool_result_missing`.

**Soluciones**:
1. Escribe `continue` en la conversación para activar la recuperación automática
2. Si está bloqueado, usa `/undo` para retroceder al estado antes del error
3. Reintenta la operación

::: tip Recuperación Automática
La función de recuperación de sesión del plugin está habilitada por defecto. Si la ejecución de una herramienta se interrumpe, inyectará automáticamente un `tool_result` sintético e intentará recuperarse.
:::

---

## Problemas de compatibilidad de plugins

### Conflicto con oh-my-opencode

**Problema**: oh-my-opencode tiene autenticación de Google incorporada, que entra en conflicto con este plugin.

**Solución**: Deshabilita la autenticación incorporada en `~/.config/opencode/oh-my-opencode.json`:
```json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**Problema de agentes paralelos**: Al generar sub-agentes en paralelo, múltiples procesos pueden golpear la misma cuenta. **Soluciones**:
- Habilitar `pid_offset_enabled: true` (configurar en `antigravity.json`)
- O agregar más cuentas

### Conflicto con @tarquinen/opencode-dcp

**Problema**: DCP crea mensajes de asistente sintéticos faltantes de bloques de pensamiento, entrando en conflicto con este plugin.

**Solución**: **Coloca este plugin antes que DCP**:
```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

### Otros plugins gemini-auth

**Problema**: Has instalado otros plugins de autenticación de Google Gemini, causando conflictos.

**Solución**: No los necesitas. Este plugin ya maneja toda la autenticación OAuth de Google. Desinstala otros plugins gemini-auth.

---

## Problemas de configuración

### Errores de ortografía en claves de configuración

**Mensaje de error**: `Unrecognized key: "plugins"`

**Causa**: Se usó un nombre de clave incorrecto.

**Solución**: La clave correcta es `plugin` (singular):
```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**NO** uses `"plugins"` (plural), esto causará el error "Unrecognized key".

### Modelo no encontrado

**Síntomas**: Al usar un modelo, aparece el error "Model not found" o error 400.

**Solución**: Añade en la configuración del proveedor `google`:
```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google",
      "models": { ... }
    }
  }
}
```

---

## Problemas de migración

### Migrar cuentas entre máquinas

**Problema**: Después de copiar `antigravity-accounts.json` a una nueva máquina, aparece el mensaje "API key missing".

**Soluciones**:
1. Asegúrate de que el plugin esté instalado: `"plugin": ["opencode-antigravity-auth@beta"]`
2. Copia `~/.config/opencode/antigravity-accounts.json` a la misma ruta en la nueva máquina
3. Si sigue mostrando error, el `refresh_token` puede haber expirado → reautentica: `opencode auth login`

---

## Técnicas de depuración

### Habilitar logs de depuración

**Logs básicos**:
```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode
```

**Logs detallados** (solicitudes/respuestas completas):
```bash
OPENCODE_ANTIGRAVITY_DEBUG=2 opencode
```

Ubicación de archivos de log: `~/.config/opencode/antigravity-logs/`

### Ver estado de límites de tasa

Verifica el campo `rateLimitResetTimes` en el archivo de cuentas:
```bash
cat ~/.config/opencode/antigravity-accounts.json | grep rateLimitResetTimes
```

---

## Puntos de control ✅

Después de completar la solución de problemas, deberías poder:
- [ ] Comprender correctamente las rutas de archivos de configuración (`~/.config/opencode/`)
- [ ] Resolver problemas de callback OAuth fallido en Safari
- [ ] Manejar errores invalid_grant y 403
- [ ] Entender las causas y estrategias de respuesta ante límites de tasa
- [ ] Resolver conflictos con oh-my-opencode
- [ ] Habilitar logs de depuración para localizar problemas

---

## Advertencias

### No subas el archivo de cuentas al control de versiones

`antigravity-accounts.json` contiene tokens de refresco OAuth, equivalente a un archivo de contraseñas. El plugin creará automáticamente `.gitignore`, pero asegúrate de que tu `.gitignore` incluya:
```
~/.config/opencode/antigravity-accounts.json
```

### Evita reintentos frecuentes

Después de activar el límite 429, no reintentes repetidamente. Espera un tiempo antes de intentar de nuevo; de lo contrario, puedes ser marcado como abuso.

### Asegúrate de configurar projectId al usar múltiples cuentas

Si usas modelos Gemini CLI, **cada cuenta** necesita configurar su propio `projectId`. No uses el mismo project ID para múltiples cuentas.

---

## Resumen de la lección

Esta lección cubrió los problemas más comunes de autenticación y cuentas del plugin Antigravity Auth:

1. **Problemas de autenticación OAuth**: Fallo de callback en Safari, puerto en uso, entornos WSL2/Docker
2. **Problemas de actualización de tokens**: invalid_grant, expiración de tokens
3. **Errores de permisos**: 403 Permission Denied, projectId faltante
4. **Problemas de límite de tasa**: Error 429, Shadow bans, rate limit en todas las cuentas
5. **Compatibilidad de plugins**: Conflictos con oh-my-opencode, DCP
6. **Problemas de configuración**: Errores de ortografía, modelo no encontrado

Al encontrar problemas, primero intenta el **restablecimiento rápido** (eliminar archivo de cuentas y reautenticar), que resuelve el problema en el 90% de los casos. Si el problema persiste, habilita los logs de depuración para ver información detallada.

---

## Avance de la próxima lección

> En la próxima lección aprenderemos **[Solución de errores de modelo no encontrado](../model-not-found/)**.
>
> Aprenderás:
> - Error 400 de modelos Gemini 3 (Unknown name 'parameters')
> - Problemas de incompatibilidad de Tool Schema
> - Métodos de diagnóstico de errores causados por servidores MCP
> - Cómo localizar la fuente del problema mediante depuración

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Función | Ruta del archivo | Línea |
| --- | --- | ---|
| Autenticación OAuth (PKCE) | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts) | 91-270 |
| Validación y refresco de tokens | [`src/plugin/auth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/auth.ts) | 1-53 |
| Almacenamiento y gestión de cuentas | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts) | 1-715 |
| Detección de límites de tasa | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts) | 9-75 |
| Recuperación de sesión | [`src/plugin/recovery/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/index.ts) | 1-150 |
| Sistema de logs de depuración | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | 1-300 |

**Constantes clave**:
- `OAUTH_PORT = 51121`: Puerto del servidor de callback OAuth (`constants.ts:25`)
- `CLIENT_ID`: ID de cliente OAuth (`constants.ts:4`)
- `TOKEN_EXPIRY_BUFFER = 30 * 60 * 1000`: Refrescar token 30 minutos antes de expirar (`auth.ts:33`)

**Funciones clave**:
- `authorizeAntigravity()`: Iniciar flujo de autenticación OAuth (`oauth.ts:91`)
- `exchangeAntigravity()`: Intercambiar código por tokens (`oauth.ts:209`)
- `refreshAccessToken()`: Refrescar token de acceso expirado (`oauth.ts:263`)
- `isOAuthAuth()`: Verificar si es tipo de autenticación OAuth (`auth.ts:5`)
- `accessTokenExpired()`: Verificar si el token está a punto de expirar (`auth.ts:33`)
- `markRateLimitedWithReason()`: Marcar cuenta como limitada (`accounts.ts:9`)
- `detectErrorType()`: Detectar tipos de error recuperables (`recovery/index.ts`)

</details>
