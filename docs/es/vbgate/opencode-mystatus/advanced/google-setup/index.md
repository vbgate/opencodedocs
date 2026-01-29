---
title: "Google Cloud: configuración | opencode-mystatus"
sidebarTitle: "Google Cloud"
subtitle: "Configuración avanzada de Google Cloud: múltiples cuentas y gestión de modelos"
description: "Aprende a configurar Google Cloud Antigravity en opencode-mystatus. Gestiona múltiples cuentas, consulta cuotas de 4 modelos y entiende el mapeo projectId."
tags:
  - "Google Cloud"
  - "gestión de múltiples cuentas"
  - "Antigravity"
  - "mapeo de modelos"
prerequisite:
  - "start-quick-start"
order: 1
---

# Configuración avanzada de Google Cloud: múltiples cuentas y gestión de modelos

## Lo que aprenderás

Configurar múltiples cuentas de Google Cloud, ver con un clic el uso de cuotas de todas las cuentas, comprender la relación de mapeo de los 4 modelos (G3 Pro、G3 Image、G3 Flash、Claude), resolver el problema de cuota insuficiente de modelo en una sola cuenta.

## Enfoque central

### Soporte de múltiples cuentas

opencode-mystatus soporta consultar simultáneamente múltiples cuentas de Google Cloud Antigravity. Cada cuenta muestra independientemente las cuotas de sus 4 modelos, facilitando la gestión de la distribución de cuotas entre múltiples proyectos.

Las cuentas se almacenan en `~/.config/opencode/antigravity-accounts.json`, administradas por el plugin `opencode-antigravity-auth`. Necesitas instalar este plugin primero para poder agregar cuentas de Google Cloud.

### Relación de mapeo de modelos

Google Cloud Antigravity proporciona múltiples modelos, el plugin mostrará los 4 más usados:

| Nombre de visualización | Modelo Key (principal) | Modelo Key (alternativo) |
|--- | --- | ---|
| G3 Pro | `gemini-3-pro-high` | `gemini-3-pro-low` |
| G3 Image | `gemini-3-pro-image` | - |
| G3 Flash | `gemini-3-flash` | - |
| Claude | `claude-opus-4-5-thinking` | `claude-opus-4-5` |

**¿Por qué hay Key alternativo?**

Algunos modelos tienen dos versiones (high/low), el plugin mostrará preferiblemente los datos del key principal, si el key principal no tiene información de cuota, usará automáticamente los datos del key alternativo.

### Uso de Project ID

Para consultar la cuota se necesita proporcionar un Project ID, el plugin usará preferiblemente `projectId`, si no existe usará `managedProjectId`. Ambos IDs pueden configurarse al agregar la cuenta.

## 🎒 Preparativos

::: warning Prerrequisitos

Asegúrate de que ya has:
- [x] Completado el tutorial de inicio rápido ([Quick Start](/es/vbgate/opencode-mystatus/start/quick-start/))
- [x] Instalado el plugin opencode-mystatus
- [x] Instalado el plugin [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth)
:::

## Sigue los pasos

### Paso 1: Agrega la primera cuenta de Google Cloud

**Por qué**
La primera cuenta es la base, solo después de agregarla exitosamente puedes probar la consulta de múltiples cuentas.

Usa el plugin `opencode-antigravity-auth` para agregar la cuenta. Suponiendo que ya has instalado el plugin:

```bash
# Dejar que la IA te ayude (recomendado)
# En Claude/OpenCode, ingresa:
Install opencode-antigravity-auth plugin from: https://github.com/NoeFabris/opencode-antigravity-auth
```

Después de completar la instalación, sigue las instrucciones de la documentación del plugin para completar la autenticación OAuth de Google.

**Lo que deberías ver**:
- La información de la cuenta se ha guardado en `~/.config/opencode/antigravity-accounts.json`
- El contenido del archivo es similar a:
  ```json
  {
    "version": 1,
    "accounts": [
      {
        "email": "user1@gmail.com",
        "refreshToken": "1//...",
        "projectId": "my-project-123",
        "managedProjectId": "managed-project-456",
        "addedAt": 1737600000000,
        "lastUsed": 1737600000000
      }
    ]
  }
  ```

### Paso 2: Consulta la cuota de Google Cloud

**Por qué**
Verificar que la configuración de la primera cuenta es correcta, ver la situación de cuotas de los 4 modelos.

```bash
/mystatus
```

**Lo que deberías ver**:

```
## Google Cloud Account Quota

### user1@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%
```

### Paso 3: Agrega la segunda cuenta de Google Cloud

**Por qué**
Cuando tienes múltiples cuentas de Google Cloud, puedes gestionar simultáneamente la distribución de cuotas entre múltiples proyectos.

Repite el proceso del paso 1, inicia sesión con otra cuenta de Google.

Después de completar la adición, el archivo `antigravity-accounts.json` se convertirá en:

```json
{
  "version": 1,
  "accounts": [
    {
      "email": "user1@gmail.com",
      "refreshToken": "1//...",
      "projectId": "my-project-123",
      "addedAt": 1737600000000,
      "lastUsed": 1737600000000
    },
    {
      "email": "user2@gmail.com",
      "refreshToken": "2//...",
      "projectId": "another-project-456",
      "addedAt": 1737700000000,
      "lastUsed": 1737700000000
    }
  ]
}
```

### Paso 4: Ver la cuota de múltiples cuentas

**Por qué**
Confirmar que las cuotas de ambas cuentas se muestran correctamente, facilitando la planificación del uso de cada cuenta.

```bash
/mystatus
```

**Lo que deberías ver**:

```
## Google Cloud Account Quota

### user1@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%

### user2@gmail.com

G3 Pro     2h 30m     ████████████░░░░░░░░ 65%
G3 Image   2h 30m     ██████████░░░░░░░░░ 50%
G3 Flash   2h 30m     ██████████████░░░░░ 80%
Claude     1d 5h      ████████░░░░░░░░░░░ 35%
```

## Advertencias de errores comunes

### La cuenta no se muestra

**Problema**: Has agregado la cuenta, pero `mystatus` no la muestra.

**Causa**: La cuenta no tiene el campo email. El plugin filtrará las cuentas que no tengan el campo `email` (ver código fuente `google.ts:318`).

**Solución**: Asegúrate de que cada cuenta en `antigravity-accounts.json` tenga el campo `email`.

### Falta Project ID

**Problema**: Muestra el error "No project ID found".

**Causa**: La configuración de la cuenta no tiene ni `projectId` ni `managedProjectId`.

**Solución**: Al agregar la cuenta nuevamente, asegúrate de llenar el Project ID.

### Datos del modelo están vacíos

**Problema**: Un modelo muestra 0% o no tiene datos.

**Causa**:
1. La cuenta realmente no ha usado ese modelo
2. La información de cuota de ese modelo no se ha devuelto (algunos modelos pueden necesitar permisos especiales)

**Solución**:
- Esto es normal, mientras la cuenta tenga datos de cuota está bien
- Si todos los modelos están al 0%, verifica si los permisos de la cuenta son correctos

## Resumen de esta lección

- Instalar el plugin `opencode-antigravity-auth` es un requisito previo para usar la consulta de cuota de Google Cloud
- Soporta consulta simultánea de múltiples cuentas, cada cuenta muestra independientemente las cuotas de 4 modelos
- Relación de mapeo de modelos: G3 Pro (soporta high/low)、G3 Image、G3 Flash、Claude (soporta thinking/normal)
- El plugin usa preferiblemente `projectId`, si no existe usa `managedProjectId`
- La cuenta debe tener el campo `email` para ser consultada

## Próxima lección

> En la siguiente lección aprenderemos **[Configuración de autenticación de Copilot](/es/vbgate/opencode-mystatus/advanced/copilot-auth/)**。
>
> Aprenderás:
> - Dos métodos de autenticación de Copilot: OAuth Token y Fine-grained PAT
> - Cómo resolver los problemas de permisos de Copilot
> - Diferencias de cuota por diferentes tipos de suscripción

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta de archivo | Línea |
|--- | --- | ---|
| Configuración de mapeo de modelos | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 69-78 |
| Consulta paralela de múltiples cuentas | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 327-334 |
| Filtro de cuentas (debe tener correo) | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 318 |
| Prioridad de Project ID | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 231 |
| Extracción de cuota de modelo | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 132-157 |
| Definición de tipo AntigravityAccount | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 78-86 |

**Constantes clave**:
- `MODELS_TO_DISPLAY`：Configuración de los 4 modelos (key、altKey、display)
- `GOOGLE_QUOTA_API_URL`：Dirección de API de cuota de Google Cloud
- `USER_AGENT`：User-Agent de solicitudes (antigravity/1.11.9)

**Funciones clave**:
- `queryGoogleUsage()`：Consulta la cuota de todas las cuentas de Google Cloud
- `fetchAccountQuota()`：Consulta la cuota de una sola cuenta (incluye refresco de token)
- `extractModelQuotas()`：Extrae la información de cuota de los 4 modelos desde la respuesta de la API
- `formatAccountQuota()`：Formatea la visualización de la cuota de una sola cuenta

</details>
