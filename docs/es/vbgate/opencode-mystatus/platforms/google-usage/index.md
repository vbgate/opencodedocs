---
title: "Google Cloud: Consulta de cuota | opencode-mystatus"
sidebarTitle: "Cuota Google"
subtitle: "Google Cloud: Consulta de cuota"
description: "Aprende a consultar la cuota de Google Cloud para G3 Pro, G3 Image, G3 Flash y Claude. Ver cuotas restantes y tiempos de restablecimiento."
tags:
  - "Google Cloud"
  - "Antigravity"
  - "consulta de cuota"
prerequisite:
  - "start-quick-start"
  - "start-using-mystatus"
order: 4
---

# Consulta de cuota de Google Cloud: G3 Pro/Image/Flash y Claude

## Lo que aprenderás

- Ver la cuota de los 4 modelos de la cuenta de Google Cloud Antigravity
- Comprender el tiempo de restablecimiento y el porcentaje restante de cada modelo
- Gestionar el uso de cuotas de múltiples cuentas de Google Cloud

## Tu situación actual

Google Cloud Antigravity proporciona múltiples modelos (G3 Pro、G3 Image、G3 Flash、Claude), cada modelo tiene una cuota independiente y tiempo de restablecimiento. Necesitas:

- Iniciar sesión individualmente en la consola de Google Cloud para ver el estado de cada modelo
- Calcular manualmente la cuota restante y el tiempo de restablecimiento
- Gestionar múltiples cuentas, lo cual es aún más confuso

## Cuándo usar esta técnica

Cuando tú:
- Quieres conocer rápidamente todas las cuotas restantes de los modelos de Google Cloud
- Necesitas planificar la distribución de uso entre diferentes modelos
- Tienes múltiples cuentas de Google Cloud que necesitan gestión unificada

## 🎒 Preparativos

::: warning Verificación previa

1. **Instalado el plugin mystatus**: Consulta [Inicio rápido](/es/vbgate/opencode-mystatus/start/quick-start/)
2. **Configurada la autenticación de Google Cloud**: Necesitas instalar primero el plugin [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) para completar la autenticación OAuth
3. **Archivo de autenticación existe**: `~/.config/opencode/antigravity-accounts.json` contiene al menos una cuenta

:::

## Enfoque central

Google Cloud Antigravity se autentica mediante el mecanismo OAuth, cada cuenta tiene un Refresh Token independiente. El plugin mystatus:
1. Lee `antigravity-accounts.json` para obtener todas las cuentas configuradas
2. Usa Refresh Token para refrescar Access Token
3. Llama a la API de Google Cloud para obtener la cuota de todos los modelos
4. Muestra la cuota y tiempo de restablecimiento de los 4 modelos agrupados por cuenta

## Modelos soportados por Google Cloud

mystatus muestra la cuota de los siguientes 4 modelos:

| Nombre de visualización | Modelo Key (principal/respaldo) | Descripción |
| --------- | ----------------- | ---- |
| G3 Pro | `gemini-3-pro-high` / `gemini-3-pro-low` | Gemini 3 Pro versión de alto rendimiento |
| G3 Image | `gemini-3-pro-image` | Gemini 3 Pro generación de imágenes |
| G3 Flash | `gemini-3-flash` | Gemini 3 Flash versión rápida |
| Claude | `claude-opus-4-5-thinking` / `claude-opus-4-5` | Modelo Claude Opus 4.5 |

**Mecanismo de key principal y de respaldo**:
- La respuesta de la API puede devolver datos solo del key principal o del key de respaldo
- mystatus intentará automáticamente obtener la cuota de cualquier key
- Por ejemplo: si `gemini-3-pro-high` no tiene datos, intentará con `gemini-3-pro-low`

## Sigue los pasos

### Paso 1: Ejecuta el comando de consulta

**Por qué**
Obtener rápidamente información de cuota de todas las cuentas de Google Cloud

```
/mystatus
```

**Lo que deberías ver**
Incluye información de cuota de todas las plataformas configuradas, donde la sección de Google Cloud mostrará contenido similar a:

```
## Google Cloud Account Quota

### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%
```

### Paso 2: Comprende el formato de salida

**Por qué**
Localizar rápidamente información clave: cuota restante y tiempo de restablecimiento

Formato de cada línea:
```
[Nombre del modelo] [Tiempo de restablecimiento] [Barra de progreso] [Porcentaje restante]
```

**Explicación de campos**:
- **Nombre del modelo**: G3 Pro, G3 Image, G3 Flash, Claude
- **Tiempo de restablecimiento**: Tiempo restante hasta la siguiente renovación de cuota (como `4h 59m`、`2d 9h`)
- **Barra de progreso**: Visualiza intuitivamente el porcentaje restante
- **Porcentaje restante**: Valor de 0-100

**Lo que deberías ver**
Cada modelo en una línea, mostrando claramente la cuota y el tiempo de restablecimiento

### Paso 3: Revisa la situación de múltiples cuentas

**Por qué**
Si tienes múltiples cuentas de Google Cloud, se mostrarán por separado

```
### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%

### another@gmail.com

G3 Pro     2h 30m     ████████████░░░░░░░░ 75%
G3 Image   2h 30m     ██████████░░░░░░░░░ 50%
```

**Lo que deberías ver**
Cada cuenta en un bloque separado, conteniendo las cuotas de los 4 modelos de esa cuenta

### Paso 4: Verifica advertencias de cuota

**Por qué**
Evitar que el uso excesivo cause interrupciones del servicio

Si la tasa de uso de cualquier modelo supera el 80%, se mostrará una advertencia:

```
### user@gmail.com

G3 Pro     1h 30m     ████░░░░░░░░░░░░░░ 20%
G3 Image   1h 30m     ████░░░░░░░░░░░░░ 20%

⚠️ 使用率已达到或超过 80%
```

**Lo que deberías ver**
La advertencia aparece debajo de la lista de modelos de la cuenta correspondiente

## Punto de control ✅

Completa las siguientes verificaciones para asegurar que lo hiciste correctamente:

- [ ] Después de ejecutar `/mystatus` puedes ver la información de cuota de Google Cloud
- [ ] Comprendes los nombres y tiempos de restablecimiento de los 4 modelos
- [ ] Puedes identificar la barra de progreso y el porcentaje restante
- [ ] Si hay múltiples cuentas, puedes ver la cuota de todas las cuentas

## Advertencias de errores comunes

### Problema 1: No se ve la cuota de Google Cloud

**Posibles causas**:
- No se ha instalado el plugin opencode-antigravity-auth
- No se ha completado la autenticación OAuth de Google
- El archivo `antigravity-accounts.json` no existe o está vacío

**Solución**:
1. Instala el plugin opencode-antigravity-auth
2. Completa la autenticación según las instrucciones del repositorio de GitHub
3. Ejecuta `/mystatus` nuevamente

### Problema 2: Una cuenta muestra error

**Posibles causas**:
- El Refresh Token ha expirado
- Falta el projectId

**Ejemplo de error**:
```
user@gmail.com: No project ID found
```

**Solución**:
1. Autentica nuevamente la cuenta usando el plugin opencode-antigravity-auth
2. Asegúrate de configurar correctamente el ID del proyecto durante el proceso de autenticación

### Problema 3: El modelo muestra "-" o tiempo de restablecimiento anormal

**Posibles causas**:
- El campo resetTime devuelto por la API está ausente o tiene formato anormal
- El modelo aún no tiene información de cuota

**Solución**:
- Esto es normal, mystatus mostrará "-" para indicar que los datos no están disponibles
- Si todos los modelos muestran "-", verifica la conexión de red o el estado de la API de Google Cloud

## Resumen de esta lección

- Google Cloud Antigravity soporta 4 modelos: G3 Pro, G3 Image, G3 Flash, Claude
- Cada modelo tiene una cuota independiente y tiempo de restablecimiento
- Soporta gestión de múltiples cuentas, cada cuenta se muestra por separado
- Se muestra advertencia cuando la tasa de uso supera el 80%

## Próxima lección

> En la siguiente lección aprenderemos **[Configuración avanzada de Google Cloud: múltiples cuentas y gestión de modelos](../../advanced/google-setup/)**。
>
> Aprenderás:
> - Cómo agregar y gestionar múltiples cuentas de Google Cloud
> - Comprender la relación de mapeo de los 4 modelos
> - Diferencias entre projectId y managedProjectId

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta de archivo | Línea |
| ------------- | ------------------------------------------------------------------------------------------------------------------------- | ------- |
| Configuración de modelos | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L69-L78) | 69-78 |
| Lógica de consulta de cuentas | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L304-L370) | 304-370 |
| Refresco de token | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L162-L184) | 162-184 |
| Extracción de cuota | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L132-L157) | 132-157 |
| Formato de salida | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L265-L294) | 265-294 |
| Definición de tipo | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L78-L94) | 78-94 |

**Constantes clave**:
- `GOOGLE_QUOTA_API_URL = "https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels"`：API de consulta de cuota de Google Cloud
- `GOOGLE_TOKEN_REFRESH_URL = "https://oauth2.googleapis.com/token"`：API de refresco de token OAuth
- `USER_AGENT = "antigravity/1.11.9 windows/amd64"`：User-Agent de solicitudes API

**Funciones clave**:
- `queryGoogleUsage()`：Consulta la cuota de todas las cuentas de Antigravity
- `fetchAccountQuota()`：Consulta la cuota de una sola cuenta
- `extractModelQuotas()`：Extrae la cuota de los 4 modelos desde la respuesta de la API
- `formatAccountQuota()`：Formatea la visualización de la cuota de una sola cuenta

**Reglas de mapeo de modelos**:
- G3 Pro soporta `gemini-3-pro-high` y `gemini-3-pro-low`, usa la key principal con prioridad
- Claude soporta `claude-opus-4-5-thinking` y `claude-opus-4-5`, usa la key principal con prioridad
- G3 Image y G3 Flash solo tienen una key

</details>
