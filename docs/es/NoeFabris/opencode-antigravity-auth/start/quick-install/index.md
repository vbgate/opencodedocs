---
title: "Instalación Rápida: Configuración del Plugin en 5 Minutos | Antigravity Auth"
sidebarTitle: "5 Minutos para Comenzar"
subtitle: "Instalación Rápida de Antigravity Auth: Configuración del Plugin en 5 Minutos"
description: "Aprende a instalar rápidamente el plugin Antigravity Auth. Te enseñamos dos métodos de instalación (asistido por IA/manual), configuración de modelos, autenticación Google OAuth y verificación del éxito."
tags:
  - "Inicio Rápido"
  - "Guía de Instalación"
  - "OAuth"
  - "Configuración de Plugin"
prerequisite:
  - "start-what-is-antigravity-auth"
order: 2
---

# Instalación Rápida de Antigravity Auth: Configuración del Plugin en 5 Minutos

La instalación rápida de Antigravity Auth te permite completar la configuración del plugin OpenCode en 5 minutos y comenzar a usar los modelos avanzados Claude y Gemini 3. Este tutorial proporciona dos métodos de instalación (asistido por IA/configuración manual), cubriendo la instalación del plugin, autenticación OAuth, definición de modelos y pasos de verificación para asegurar que puedas comenzar rápidamente.

## Qué Aprenderás

- ✅ Completar la instalación del plugin Antigravity Auth en 5 minutos
- ✅ Configurar el acceso a los modelos Claude y Gemini 3
- ✅ Ejecutar la autenticación Google OAuth y verificar la instalación exitosa

## Tu Situación Actual

Quieres probar las potentes funciones de Antigravity Auth (Claude Opus 4.5, Sonnet 4.5, Gemini 3 Pro/Flash), pero no sabes cómo instalar el plugin ni configurar los modelos, temiendo que un paso en falso te bloquee.

## Cuándo Usar Este Tutorial

- Al usar el plugin Antigravity Auth por primera vez
- Al instalar OpenCode en una nueva máquina
- Cuando necesites reconfigurar el plugin

## 🎒 Preparación Antes de Comenzar

::: warning Verificación Previa

Antes de comenzar, por favor confirma:
- [ ] OpenCode CLI está instalado (el comando `opencode` está disponible)
- [ ] Tienes una cuenta de Google disponible (para autenticación OAuth)
- [ ] Conoces los conceptos básicos de Antigravity Auth (lee [¿Qué es Antigravity Auth?](/es/NoeFabris/opencode-antigravity-auth/start/what-is-antigravity-auth/))

:::

## Idea Principal

El flujo de instalación de Antigravity Auth se divide en 4 pasos:

1. **Instalar el Plugin** → Habilitar el plugin en la configuración de OpenCode
2. **Autenticación OAuth** → Iniciar sesión con tu cuenta de Google
3. **Configurar Modelos** → Añadir definiciones de modelos Claude/Gemini
4. **Verificar Instalación** → Realizar una prueba con la primera solicitud

**Nota Importante**: La ruta del archivo de configuración en diferentes sistemas es `~/.config/opencode/opencode.json` (en Windows, `~` se resuelve automáticamente al directorio del usuario, como `C:\Users\YourName`).

## Vamos a Hacerlo

### Paso 1: Elige el Método de Instalación

Antigravity Auth proporciona dos métodos de instalación, elige el que prefieras.

::: tip Método Recomendado

Si usas un LLM Agent (como Claude Code, Cursor, OpenCode), **se recomienda la instalación asistida por IA**, es más rápida y conveniente.

:::

**Método 1: Instalación Asistida por IA (Recomendado)**

Simplemente copia el siguiente prompt y pégalo en cualquier LLM Agent:

```
Install opencode-antigravity-auth plugin and add Antigravity model definitions to ~/.config/opencode/opencode.json by following: https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/dev/README.md
```

**El IA completará automáticamente**:
- Editar `~/.config/opencode/opencode.json`
- Añadir la configuración del plugin
- Añadir las definiciones de modelos completas
- Ejecutar `opencode auth login` para la autenticación

**Deberías ver**: La IA muestra "Instalación del plugin exitosa" o un mensaje similar.

**Método 2: Instalación Manual**

Si prefieres control manual, sigue estos pasos:

**Paso 1.1: Añadir el Plugin al Archivo de Configuración**

Edita `~/.config/opencode/opencode.json` (si el archivo no existe, créalo):

```json
{
  "plugin": ["opencode-antigravity-auth@latest"]
}
```

> **Versión Beta**: Si deseas probar las últimas funciones, usa `opencode-antigravity-auth@beta` en lugar de `@latest`.

**Deberías ver**: El archivo de configuración contiene el campo `plugin` con un valor de array.

---

### Paso 2: Ejecutar la Autenticación Google OAuth

Ejecuta en la terminal:

```bash
opencode auth login
```

**El sistema automáticamente**:
1. Inicia un servidor OAuth local (escuchando en `localhost:51121`)
2. Abre el navegador y redirige a la página de autorización de Google
3. Recibe el callback de OAuth e intercambia el token
4. Obtiene automáticamente el Google Cloud Project ID

**Necesitas hacer**:
1. Haz clic en "Permitir" en el navegador para autorizar el acceso
2. Si estás en un entorno WSL o Docker, es posible que necesites copiar manualmente la URL de callback

**Deberías ver**:

```
✅ Authentication successful
✅ Account added: your-email@gmail.com
✅ Project ID resolved: cloud-project-id-xxx
```

::: tip Soporte para Múltiples Cuentas

¿Necesitas añadir más cuentas para aumentar la cuota? Simplemente ejecuta `opencode auth login` de nuevo. El plugin soporta hasta 10 cuentas y realiza balanceo de carga automático.

:::

---

### Paso 3: Configurar las Definiciones de Modelos

Copia la siguiente configuración completa y añádela a `~/.config/opencode/opencode.json` (ten cuidado de no sobrescribir el campo `plugin` existente):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-antigravity-auth@latest"],
  "provider": {
    "google": {
      "models": {
        "antigravity-gemini-3-pro": {
          "name": "Gemini 3 Pro (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingLevel": "low" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-gemini-3-flash": {
          "name": "Gemini 3 Flash (Antigravity)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "minimal": { "thinkingLevel": "minimal" },
            "low": { "thinkingLevel": "low" },
            "medium": { "thinkingLevel": "medium" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "antigravity-claude-sonnet-4-5-thinking": {
          "name": "Claude Sonnet 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "antigravity-claude-opus-4-5-thinking": {
          "name": "Claude Opus 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "gemini-2.5-flash": {
          "name": "Gemini 2.5 Flash (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-2.5-pro": {
          "name": "Gemini 2.5 Pro (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-flash-preview": {
          "name": "Gemini 3 Flash Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-pro-preview": {
          "name": "Gemini 3 Pro Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: info Clasificación de Modelos

- **Cuota Antigravity** (Claude + Gemini 3): `antigravity-gemini-*`, `antigravity-claude-*`
- **Cuota Gemini CLI** (independiente): `gemini-2.5-*`, `gemini-3-*-preview`

Para más detalles sobre la configuración de modelos, consulta la [lista completa de modelos disponibles](/es/NoeFabris/opencode-antigravity-auth/platforms/available-models/).

:::

**Deberías ver**: El archivo de configuración contiene la definición completa de `provider.google.models`, y el formato JSON es válido (sin errores de sintaxis).

---

### Paso 4: Verificar la Instalación

Ejecuta el siguiente comando para probar si el plugin funciona correctamente:

```bash
opencode run "Hello" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

**Deberías ver**:

```
正在使用: google/antigravity-claude-sonnet-4-5-thinking (max)
...

Claude: 你好！我是 Claude Sonnet 4.5 Thinking。
```

::: tip Punto de Control ✅

Si ves una respuesta normal de la IA, ¡felicidades! El plugin Antigravity Auth se ha instalado y configurado correctamente.

:::

---

## Advertencias de Errores Comunes

### Problema 1: Fallo en la Autenticación OAuth

**Síntoma**: Aparece un mensaje de error al ejecutar `opencode auth login`, como `invalid_grant` o la página de autorización no se abre.

**Causa**: Cambio de contraseña de la cuenta de Google, evento de seguridad, o URL de callback incompleta.

**Solución**:
1. Verifica si el navegador abre correctamente la página de autorización de Google
2. Si estás en un entorno WSL/Docker, copia manualmente la URL de callback mostrada en la terminal al navegador
3. Elimina `~/.config/opencode/antigravity-accounts.json` y vuelve a autenticar

### Problema 2: Modelo No Encontrado (Error 400)

**Síntoma**: Al ejecutar una solicitud, devuelve `400 Unknown name 'xxx'`.

**Causa**: Error de escritura del nombre del modelo o problema con el formato del archivo de configuración.

**Solución**:
1. Verifica si el parámetro `--model` coincide exactamente con la clave en el archivo de configuración (distingue mayúsculas y minúsculas)
2. Valida si `opencode.json` es JSON válido (usa `cat ~/.config/opencode/opencode.json | jq` para verificar)
3. Confirma que existe una definición de modelo correspondiente bajo el campo `provider.google.models`

### Problema 3: Ruta de Archivo de Configuración Incorrecta

**Síntoma**: Muestra "archivo de configuración no existe" o la modificación no tiene efecto.

**Causa**: Se usó una ruta incorrecta en diferentes sistemas.

**Solución**: Todos los sistemas usan uniformemente `~/.config/opencode/opencode.json`, incluyendo Windows (`~` se resuelve automáticamente al directorio del usuario).

| Sistema | Ruta Correcta | Ruta Incorrecta |
| --- | --- | --- |
| macOS/Linux | `~/.config/opencode/opencode.json` | `/usr/local/etc/...` |
| Windows | `C:\Users\YourName\.config\opencode\opencode.json` | `%APPDATA%\opencode\...` |

## Resumen de Esta Lección

En esta lección completamos:
1. ✅ Dos métodos de instalación (asistido por IA / configuración manual)
2. ✅ Flujo de autenticación Google OAuth
3. ✅ Configuración completa de modelos (Claude + Gemini 3)
4. ✅ Verificación de instalación y solución de problemas comunes

**Puntos Clave**:
- Ruta unificada del archivo de configuración: `~/.config/opencode/opencode.json`
- La autenticación OAuth obtiene automáticamente el Project ID, sin necesidad de configuración manual
- Soporta múltiples cuentas, aumentando el límite de cuota
- Usa el parámetro `variant` para controlar la profundidad de pensamiento de los modelos Thinking

## Avance de la Siguiente Lección

> En la siguiente lección aprenderemos **[Primera Autenticación: Comprensión Profunda del Flujo OAuth 2.0 PKCE](/es/NoeFabris/opencode-antigravity-auth/start/first-auth-login/)**.
>
> Aprenderás:
> - Cómo funciona OAuth 2.0 PKCE
> - Mecanismo de actualización de tokens
> - Proceso de resolución automática del Project ID
> - Formato de almacenamiento de cuentas

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Funcionalidad | Ruta del Archivo | Líneas |
| --- | --- | --- |
| Generación de URL de Autorización OAuth | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L91-L113) | 91-113 |
| Generación de Par de Claves PKCE | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L1-L2) | 1-2 |
| Intercambio de Tokens | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L201-L270) | 201-270 |
| Obtención Automática del Project ID | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L131-L196) | 131-196 |
| Obtención de Información del Usuario | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L231-L242) | 231-242 |

**Constantes Clave**:
- `ANTIGRAVITY_CLIENT_ID`: ID de cliente OAuth (utilizado para autenticación con Google)
- `ANTIGRAVITY_REDIRECT_URI`: Dirección de callback de OAuth (fija como `http://localhost:51121/oauth-callback`)
- `ANTIGRAVITY_SCOPES`: Lista de alcances de permisos de OAuth

**Funciones Clave**:
- `authorizeAntigravity()`: Construye la URL de autorización OAuth, incluyendo el desafío PKCE
- `exchangeAntigravity()`: Intercambia el código de autorización por un token de acceso y un token de actualización
- `fetchProjectID()`: Resuelve automáticamente el Google Cloud Project ID
- `encodeState()` / `decodeState()`: Codifica/decodifica el parámetro state de OAuth (incluye el verificador PKCE)

</details>
