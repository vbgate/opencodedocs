---
title: "Guía completa de configuración de modelos de IA y autenticación: múltiples proveedores, métodos de autenticación y solución de problemas"
sidebarTitle: "Configura tu cuenta de IA"
subtitle: "Configuración de modelos de IA y autenticación"
description: "Aprende a configurar proveedores de modelos de IA para Clawdbot (Anthropic, OpenAI, OpenRouter, Ollama, etc.) y tres métodos de autenticación (API Key, OAuth, Token). Este tutorial cubre la gestión de archivos de autenticación, rotación de múltiples cuentas, actualización automática de tokens OAuth, configuración de alias de modelos, cambio por fallo y solución de errores comunes, con ejemplos de configuración prácticos y comandos CLI para ayudarte a comenzar rápidamente."
tags:
  - "advanced"
  - "configuration"
  - "authentication"
  - "models"
prerequisite:
  - "start-getting-started"
order: 190
---

# Configuración de modelos de IA y autenticación

## Lo que podrás hacer después de este tutorial

- Configurar múltiples proveedores de modelos de IA (Anthropic, OpenAI, OpenRouter, etc.)
- Usar tres métodos de autenticación (API Key, OAuth, Token)
- Gestionar múltiples cuentas y rotación de autenticación
- Configurar la selección de modelos y modelos alternativos
- Solucionar problemas comunes de autenticación

## Tu situación actual

Clawdbot admite docenas de proveedores de modelos, pero la configuración puede ser confusa:

- ¿Debería usar API Key u OAuth?
- ¿Cuál es la diferencia entre los métodos de autenticación de diferentes proveedores?
- ¿Cómo configurar múltiples cuentas?
- ¿Cómo se actualizan automáticamente los tokens OAuth?

## Cuándo usar esto

- Después de la instalación inicial, necesitas configurar modelos de IA
- Agregar nuevos proveedores de modelos o cuentas alternativas
- Encuentras errores de autenticación o límites de cuota
- Necesitas configurar el cambio de modelos y el mecanismo de respaldo

## 🎒 Preparativos previos

::: warning Prerrequisitos
Este tutorial asume que has completado [Inicio rápido](../../start/getting-started/), has instalado e iniciado el Gateway.
:::

- Asegúrate de que Node ≥22 esté instalado
- El proceso daemon de Gateway está en ejecución
- Prepara las credenciales de al menos un proveedor de modelos de IA (API Key o cuenta suscrita)

## Conceptos clave

### La configuración de modelos y la autenticación están separadas

En Clawdbot, la **selección de modelos** y las **credenciales de autenticación** son dos conceptos independientes:

- **Configuración de modelos**: Indica a Clawdbot qué modelo usar (como `anthropic/claude-opus-4-5`), almacenado en `~/.clawdbot/models.json`
- **Configuración de autenticación**: Proporciona las credenciales para acceder al modelo (como API Key o token OAuth), almacenado en `~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`

::: info ¿Por qué separarlos?
Este diseño te permite cambiar flexiblemente entre múltiples proveedores y cuentas sin tener que volver a configurar los parámetros del modelo.
:::

### Tres métodos de autenticación

Clawdbot admite tres métodos de autenticación, aplicables a diferentes escenarios:

| Método de autenticación | Formato de almacenamiento | Escenario típico | Proveedores admitidos |
|--- | --- | --- | ---|
| **API Key** | `{ type: "api_key", key: "sk-..." }` | Inicio rápido, pruebas | Anthropic, OpenAI, OpenRouter, DeepSeek, etc. |
| **OAuth** | `{ type: "oauth", access: "...", refresh: "..." }` | Larga duración, actualización automática | Anthropic (Claude Code CLI), OpenAI (Codex), Qwen Portal |
| **Token** | `{ type: "token", token: "..." }` | Token Bearer estático | GitHub Copilot, algunos proxies personalizados |

### Proveedores de modelos admitidos

Clawdbot admite de forma nativa los siguientes proveedores de modelos:

::: details Lista de proveedores integrados
| Proveedor | Método de autenticación | Modelo recomendado | Notas |
|--- | --- | --- | ---|
| **Anthropic** | API Key / OAuth (Claude Code CLI) | `anthropic/claude-opus-4-5` | Se recomienda Claude Pro/Max + Opus 4.5 |
| **OpenAI** | API Key / OAuth (Codex) | `openai/gpt-5.2` | Compatible con OpenAI estándar y versiones Codex |
| **OpenRouter** | API Key | `openrouter/anthropic/claude-sonnet-4-5` | Agrega cientos de modelos |
| **Ollama** | HTTP Endpoint | `ollama/<model>` | Modelos locales, sin API Key |
| **DeepSeek** | API Key | `deepseek/deepseek-r1` | Amigable con China |
| **Qwen Portal** | OAuth | `qwen-portal/<model>` | OAuth de Tongyi Qianwen |
| **Venice** | API Key | `venice/<model>` | Privacidad primero |
| **Bedrock** | AWS SDK | `amazon-bedrock/<model>` | Modelos alojados en AWS |
| **Antigravity** | API Key | `google-antigravity/<model>` | Servicio de proxy de modelos |
:::

::: tip Combinación recomendada
Para la mayoría de los usuarios, se recomienda configurar **Anthropic Opus 4.5** como modelo principal y **OpenAI GPT-5.2** como respaldo. Opus tiene un mejor rendimiento en contextos largos y seguridad.
:::

## Sígueme

### Paso 1: Configurar Anthropic (recomendado)

**Por qué**
Anthropic Claude es el modelo recomendado para Clawdbot, especialmente Opus 4.5, que tiene un excelente rendimiento en el procesamiento de contextos largos y seguridad.

**Opción A: Usar API Key de Anthropic (lo más rápido)**

```bash
clawdbot onboard --anthropic-api-key "$ANTHROPIC_API_KEY"
```

**Lo que deberías ver**:
- Gateway recarga la configuración
- El modelo predeterminado se establece en `anthropic/claude-opus-4-5`
- Se crea el archivo de autenticación `~/.clawdbot/agents/default/agent/auth-profiles.json`

**Opción B: Usar OAuth (recomendado para larga duración)**

OAuth es adecuado para Gateway de larga ejecución, los tokens se actualizan automáticamente.

1. Generar setup-token (necesita ejecutar Claude Code CLI en cualquier máquina):
```bash
claude setup-token
```

2. Copiar el token de salida

3. Ejecutar en el host de Gateway:
```bash
clawdbot models auth paste-token --provider anthropic
# Pegar el token
```

**Lo que deberías ver**:
- Mensaje "Auth profile added: anthropic:claude-cli"
- El tipo de autenticación es `oauth` (no `api_key`)

::: tip Ventaja de OAuth
Los tokens OAuth se actualizan automáticamente, sin necesidad de actualización manual. Adecuado para procesos daemon de Gateway que se ejecutan continuamente.
:::

### Paso 2: Configurar OpenAI como respaldo

**Por qué**
Configurar un modelo de respaldo permite cambiar automáticamente cuando el modelo principal (como Anthropic) encuentra límites de cuota o errores.

```bash
clawdbot onboard --openai-api-key "$OPENAI_API_KEY"
```

O usar OAuth de OpenAI Codex:

```bash
clawdbot onboard --openai-codex
```

**Lo que deberías ver**:
- Se agrega configuración del proveedor OpenAI en `~/.clawdbot/clawdbot.json`
- Se agrega configuración `openai:default` o `openai-codex:codex-cli` en el archivo de autenticación

### Paso 3: Configurar la selección de modelos y respaldo

**Por qué**
Configurar la estrategia de selección de modelos, definir modelo principal, modelos alternativos y alias.

Editar `~/.clawdbot/clawdbot.json`:

```yaml
agents:
  defaults:
    model:
      primary: "anthropic/claude-opus-4-5"
      fallbacks:
        - "openai/gpt-5.2"
        - "openai/gpt-5-mini"
    models:
      "anthropic/claude-opus-4-5":
        alias: "opus"
      "anthropic/claude-sonnet-4-5":
        alias: "sonnet"
      "openai/gpt-5.2":
        alias: "gpt"
      "openai/gpt-5-mini":
        alias: "gpt-mini"
```

**Explicación de campos**:
- `primary`: Modelo usado por defecto
- `fallbacks`: Modelos alternativos para intentar en orden (cambio automático al fallar)
- `alias`: Alias del modelo (como `/model opus` es equivalente a `/model anthropic/claude-opus-4-5`)

**Lo que deberías ver**:
- Después de reiniciar Gateway, el modelo principal se convierte en Opus 4.5
- La configuración del modelo alternativo entra en vigor

### Paso 4: Agregar OpenRouter (opcional)

**Por qué**
OpenRouter agrega cientos de modelos, adecuado para acceder a modelos especiales o modelos gratuitos.

```bash
clawdbot onboard --auth-choice openrouter-api-key --token "$OPENROUTER_API_KEY"
```

Luego configurar el modelo:

```yaml
agents:
  defaults:
    model:
      primary: "openrouter/anthropic/claude-sonnet-4-5"
```

**Lo que deberías ver**:
- El formato de referencia del modelo es `openrouter/<provider>/<model>`
- Puedes usar `clawdbot models scan` para ver los modelos disponibles

### Paso 5: Configurar Ollama (modelos locales)

**Por qué**
Ollama te permite ejecutar modelos localmente, sin API Key, adecuado para escenarios sensibles a la privacidad.

Editar `~/.clawdbot/clawdbot.json`:

```yaml
models:
  providers:
    ollama:
      baseUrl: "http://localhost:11434"
      api: "openai-completions"
      models:
        - id: "ollama/llama3.2"
          name: "Llama 3.2"
          api: "openai-completions"
          reasoning: false
          input: ["text"]
          cost:
            input: 0
            output: 0
            cacheRead: 0
            cacheWrite: 0
          contextWindow: 128000
          maxTokens: 4096

agents:
  defaults:
    model:
      primary: "ollama/llama3.2"
```

**Lo que deberías ver**:
- Los modelos Ollama no requieren API Key
- Necesitas asegurarte de que el servicio Ollama se esté ejecutando en `http://localhost:11434`

### Paso 6: Verificar la configuración

**Por qué**
Asegurar que la autenticación y la configuración del modelo sean correctas, Gateway pueda invocar AI normalmente.

```bash
clawdbot doctor
```

**Lo que deberías ver**:
- Sin errores de autenticación
- La lista de modelos incluye los proveedores que configuraste
- El estado muestra "OK"

O enviar un mensaje de prueba:

```bash
clawdbot message send --to +1234567890 --message "Hello from Clawdbot"
```

**Lo que deberías ver**:
- La respuesta de AI es normal
- Sin errores "No credentials found"

## Punto de control ✅

- [ ] Configurado al menos un proveedor de modelos (Anthropic u OpenAI)
- [ ] Archivo de autenticación `auth-profiles.json` creado
- [ ] Archivo de configuración de modelos `models.json` generado
- [ ] Puedes cambiar de modelo con `/model <alias>`
- [ ] Sin errores de autenticación en los registros de Gateway
- [ ] Mensaje de prueba exitoso recibiendo respuesta de AI

## Evita estos errores

### Mismatch de modo de autenticación

**Problema**: La configuración de OAuth no coincide con el modo de autenticación

```yaml
# ❌ Error: credenciales OAuth pero el modo es token
anthropic:claude-cli:
  provider: "anthropic"
  mode: "token"  # debería ser "oauth"
```

**Solución**:

```yaml
# ✅ Correcto
anthropic:claude-cli:
  provider: "anthropic"
  mode: "oauth"
```

::: tip
Clawdbot establecerá automáticamente la configuración importada desde Claude Code CLI como `mode: "oauth"`, sin necesidad de modificación manual.
:::

### Fallo en la actualización de token OAuth

**Problema**: Ver el error "OAuth token refresh failed for anthropic"

**Causas**:
- Las credenciales de Claude Code CLI han caducado en otra máquina
- El token OAuth ha caducado

**Solución**:
```bash
# Regenerar setup-token
claude setup-token

# Pegar nuevamente
clawdbot models auth paste-token --provider anthropic
```

::: warning token vs oauth
`type: "token"` es un token Bearer estático, no se actualiza automáticamente. `type: "oauth"` admite actualización automática.
:::

### Límites de cuota y cambio por fallo

**Problema**: El modelo principal encuentra límites de cuota (error 429)

**Síntomas**:
```
HTTP 429: rate_limit_error
```

**Manejo automático**:
- Clawdbot intentará automáticamente el siguiente modelo en `fallbacks`
- Si todos los modelos fallan, devuelve un error

**Configurar período de enfriamiento** (opcional):

```yaml
auth:
  cooldowns:
    billingBackoffHours: 24  # Deshabilitar el proveedor durante 24 horas después de error de cuota
    failureWindowHours: 1      # Los fallos dentro de 1 hora se cuentan para el enfriamiento
```

### Sobrescritura de variables de entorno

**Problema**: Se usa una variable de entorno en el archivo de configuración, pero no está configurada

```yaml
models:
  providers:
    openai:
      apiKey: "${OPENAI_KEY}"  # Error si no está configurada
```

**Solución**:
```bash
# Configurar variable de entorno
export OPENAI_KEY="sk-..."

# O agregar en .zshrc/.bashrc
echo 'export OPENAI_KEY="sk-..."' >> ~/.zshrc
```

## Configuración avanzada

### Múltiples cuentas y rotación de autenticación

**Por qué**
Configurar múltiples cuentas para el mismo proveedor, logrando balanceo de carga y gestión de cuotas.

**Configurar archivo de autenticación** (`~/.clawdbot/agents/default/agent/auth-profiles.json`):

```json
{
  "version": 1,
  "profiles": {
    "anthropic:me@example.com": {
      "type": "oauth",
      "provider": "anthropic",
      "email": "me@example.com"
    },
    "anthropic:work": {
      "type": "api_key",
      "provider": "anthropic",
      "key": "sk-ant-work..."
    },
    "openai:personal": {
      "type": "api_key",
      "provider": "openai",
      "key": "sk-openai-1..."
    },
    "openai:work": {
      "type": "api_key",
      "provider": "openai",
      "key": "sk-openai-2..."
    }
  },
  "order": {
    "anthropic": ["anthropic:me@example.com", "anthropic:work"],
    "openai": ["openai:personal", "openai:work"]
  }
}
```

**Campo `order`**:
- Define el orden de rotación de autenticación
- Clawdbot intentará cada cuenta en orden
- Las cuentas fallidas se saltarán automáticamente

**Comandos CLI para gestionar el orden**:

```bash
# Ver el orden actual
clawdbot models auth order get --provider anthropic

# Establecer el orden
clawdbot models auth order set --provider anthropic anthropic:me@example.com anthropic:work

# Limpiar el orden (usar rotación predeterminada)
clawdbot models auth order clear --provider anthropic
```

### Autenticación para sesión específica

**Por qué**
Bloquear la configuración de autenticación para una sesión específica o sub-Agents.

**Usar sintaxis `/model <alias>@<profileId>`**:

```bash
# Bloquear el uso de una cuenta específica para la sesión actual
/model opus@anthropic:work

# Especificificar autenticación al crear sub-Agent
clawdbot sessions spawn --model "opus@anthropic:work" --workspace "~/clawd-work"
```

**Bloqueo en archivo de configuración** (`~/.clawdbot/clawdbot.json`):

```yaml
auth:
  order:
    # Bloquear orden anthropic para el Agent principal
    main: ["anthropic:me@example.com", "anthropic:work"]
```

### Actualización automática de token OAuth

Clawdbot admite la actualización automática para los siguientes proveedores OAuth:

| Proveedor | Flujo OAuth | Mecanismo de actualización |
|--- | --- | ---|
| **Anthropic** (Claude Code CLI) | Código de autorización estándar | Actualización RPC pi-mono |
| **OpenAI** (Codex) | Código de autorización estándar | Actualización RPC pi-mono |
| **Qwen Portal** | OAuth personalizado | `refreshQwenPortalCredentials` |
| **Chutes** | OAuth personalizado | `refreshChutesTokens` |

**Lógica de actualización automática**:

1. Verificar el tiempo de caducidad del token (campo `expires`)
2. Si no ha caducado, usar directamente
3. Si ha caducado, usar el token `refresh` para solicitar un nuevo token `access`
4. Actualizar las credenciales almacenadas

::: tip Sincronización de Claude Code CLI
Si usas OAuth de Anthropic (`anthropic:claude-cli`), Clawdbot sincronizará de vuelta al almacenamiento de Claude Code CLI al actualizar el token, asegurando consistencia en ambos lados.
:::

### Alias de modelos y accesos directos

**Por qué**
Los alias de modelos te permiten cambiar rápidamente de modelo sin tener que recordar el ID completo.

**Alias predefinidos** (configuración recomendada):

```yaml
agents:
  defaults:
    models:
      "anthropic/claude-opus-4-5":
        alias: "opus"
      "anthropic/claude-sonnet-4-5":
        alias: "sonnet"
      "anthropic/claude-haiku-4-5":
        alias: "haiku"
      "openai/gpt-5.2":
        alias: "gpt"
      "openai/gpt-5-mini":
        alias: "gpt-mini"
```

**Uso**:

```bash
# Cambiar rápidamente a Opus
/model opus

# Equivalente a
/model anthropic/claude-opus-4-5

# Usar autenticación específica
/model opus@anthropic:work
```

::: tip Alias y autenticación separados
Los alias son solo atajos para el ID del modelo, no afectan la selección de autenticación. Para especificar autenticación, usa la sintaxis `@<profileId>`.
:::

### Proveedores implícitos

Algunos proveedores no requieren configuración explícita, Clawdbot los detectará automáticamente:

| Proveedor | Método de detección | Archivo de configuración |
|--- | --- | ---|
| **GitHub Copilot** | `~/.copilot/credentials.json` | Sin configuración |
| **AWS Bedrock** | Variables de entorno o credenciales AWS SDK | `~/.aws/credentials` |
| **Codex CLI** | `~/.codex/auth.json` | Sin configuración |

::: tip Prioridad de configuración implícita
La configuración implícita se fusionará automáticamente en `models.json`, pero la configuración explícita puede sobrescribirlas.
:::

## Preguntas frecuentes

### OAuth vs API Key: ¿cuál es la diferencia?

**OAuth**:
- Adecuado para Gateway de larga ejecución
- Los tokens se actualizan automáticamente
- Requiere cuenta suscrita (Claude Pro/Max, OpenAI Codex)

**API Key**:
- Adecuado para inicio rápido y pruebas
- No se actualiza automáticamente
- Puede usarse para cuentas de nivel gratuito

::: info Selección recomendada
- Larga ejecución → Usa OAuth (Anthropic, OpenAI)
- Pruebas rápidas → Usa API Key
- Sensibilidad a la privacidad → Usa modelos locales (Ollama)
:::

### ¿Cómo ver la configuración de autenticación actual?

```bash
# Ver archivo de autenticación
cat ~/.clawdbot/agents/default/agent/auth-profiles.json

# Ver configuración de modelos
cat ~/.clawdbot/models.json

# Ver archivo de configuración principal
cat ~/.clawdbot/clawdbot.json
```

O usar CLI:

```bash
# Listar modelos
clawdbot models list

# Ver orden de autenticación
clawdbot models auth order get --provider anthropic
```

### ¿Cómo eliminar una autenticación?

```bash
# Editar archivo de autenticación, eliminar el perfil correspondiente
nano ~/.clawdbot/agents/default/agent/auth-profiles.json

# O usar CLI (operación manual)
clawdbot doctor  # Ver configuración problemática
```

::: warning Confirmar antes de eliminar
Eliminar la configuración de autenticación hará que los modelos que usan ese proveedor dejen de funcionar. Asegúrate de tener una configuración alternativa.
:::

### ¿Cómo recuperarse después de límites de cuota?

**Recuperación automática**:
- Clawdbot reintentará automáticamente después del período de enfriamiento
- Consulta los registros para conocer el tiempo de reintento

**Recuperación manual**:
```bash
# Limpiar estado de enfriamiento
clawdbot models auth clear-cooldown --provider anthropic --profile-id anthropic:me@example.com

# O reiniciar Gateway
clawdbot gateway restart
```

## Resumen de esta lección

- Clawdbot admite tres métodos de autenticación: API Key, OAuth, Token
- La configuración de modelos y la autenticación están separadas, almacenadas en diferentes archivos
- Se recomienda configurar Anthropic Opus 4.5 como modelo principal, OpenAI GPT-5.2 como respaldo
- OAuth admite actualización automática, adecuado para larga ejecución
- Puedes configurar múltiples cuentas y rotación de autenticación, logrando balanceo de carga
- Usa alias de modelos para cambiar rápidamente de modelo

## Próxima lección

> En la próxima lección aprenderemos **[Gestión de sesiones y múltiples agentes](../session-management/)**.
>
> Aprenderás:
> - Modelos de sesión y aislamiento de sesiones
> - Colaboración de sub-agentes
> - Compresión de contexto
> - Configuración de enrutamiento de múltiples agentes

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones de código fuente</strong></summary>

> Última actualización: 2026-01-27

| Función | Ruta de archivo | Número de línea |
|--- | --- | ---|
| Definición de tipos de credenciales de autenticación | [`src/agents/auth-profiles/types.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/auth-profiles/types.ts) | 1-74 |
| Análisis y actualización de token OAuth | [`src/agents/auth-profiles/oauth.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/auth-profiles/oauth.ts) | 1-220 |
| Gestión de archivo de configuración de autenticación | [`src/agents/auth-profiles/profiles.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/auth-profiles/profiles.ts) | 1-85 |
| Tipos de configuración de modelos | [`src/config/types.models.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/types.models.ts) | 1-60 |
| Generación de configuración de modelos | [`src/agents/models-config.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/models-config.ts) | 1-139 |
| Configuración de esquema Zod | [`src/config/zod-schema.core.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.core.ts) | 1-300+ |

**Tipos clave**:
- `AuthProfileCredential`: Tipo unión de credenciales de autenticación (`ApiKeyCredential | TokenCredential | OAuthCredential`)
- `ModelProviderConfig`: Estructura de configuración del proveedor de modelos
- `ModelDefinitionConfig`: Estructura de definición de modelo

**Funciones clave**:
- `resolveApiKeyForProfile()`: Resuelve credenciales de autenticación y devuelve API Key
- `refreshOAuthTokenWithLock()`: Actualización de token OAuth con bloqueo
- `ensureClawdbotModelsJson()`: Generar y fusionar configuración de modelos

**Ubicaciones de archivos de configuración**:
- `~/.clawdbot/clawdbot.json`: Archivo de configuración principal
- `~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`: Credenciales de autenticación
- `~/.clawdbot/models.json`: Configuración de modelos generada

</details>
