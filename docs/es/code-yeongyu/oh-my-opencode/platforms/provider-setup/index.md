---
title: "Configuración de Provider: Estrategia Multi-Modelo de IA | oh-my-opencode"
sidebarTitle: "Conectar Múltiples Servicios de IA"
subtitle: "Configuración de Provider: Estrategia Multi-Modelo de IA"
description: "Aprende a configurar varios Providers de IA para oh-my-opencode, incluyendo Anthropic, OpenAI, Google y GitHub Copilot, y cómo funciona el mecanismo de degradación automática entre modelos."
tags:
  - "configuration"
  - "providers"
  - "models"
prerequisite:
  - "start-installation"
order: 40
---

# Configuración de Provider: Claude, OpenAI, Gemini y Estrategia Multi-Modelo

## Qué Aprenderás

- Configurar múltiples Providers de IA como Anthropic Claude, OpenAI, Google Gemini y GitHub Copilot
- Comprender el mecanismo de prioridad y degradación entre modelos para que el sistema seleccione automáticamente el mejor modelo disponible
- Especificar el modelo más adecuado para diferentes agentes de IA y tipos de tareas
- Configurar servicios de terceros como Z.ai Coding Plan y OpenCode Zen
- Utilizar el comando doctor para diagnosticar la configuración de resolución de modelos

## Tu Situación Actual

Has instalado oh-my-opencode, pero no estás muy seguro de:
- Cómo agregar múltiples Providers de IA (Claude, OpenAI, Gemini, etc.)
- Por qué a veces los agentes usan modelos diferentes a los esperados
- Cómo configurar diferentes modelos para distintas tareas (por ejemplo, tareas de investigación con modelos económicos, tareas de programación con modelos potentes)
- Cómo el sistema cambia automáticamente a un modelo de respaldo cuando un Provider no está disponible
- Cómo funcionan juntas las configuraciones de modelos en `opencode.json` y `oh-my-opencode.json`

## Cuándo Usar Esto

- **Configuración Inicial**: Acabas de instalar oh-my-opencode y necesitas agregar o ajustar Providers de IA
- **Agregar Nueva Suscripción**: Has comprado una nueva suscripción de servicio de IA (como Gemini Pro) y quieres integrarla
- **Optimizar Costos**: Quieres que agentes específicos usen modelos más baratos o más rápidos
- **Resolución de Problemas**: Descubres que un agente no está usando el modelo esperado y necesitas diagnosticar el problema
- **Orquestación Multi-Modelo**: Deseas aprovechar al máximo las ventajas de diferentes modelos para construir flujos de trabajo de desarrollo inteligentes

## 🎒 Preparativos Antes de Empezar

::: warning Verificación Prerrequisito
Este tutorial asume que ya has:
- ✅ Completado la [Instalación y Configuración Inicial](../installation/)
- ✅ Instalado OpenCode (versión >= 1.0.150)
- ✅ Comprendido el formato básico de archivos de configuración JSON/JSONC
:::

## Concepto Central

oh-my-opencode utiliza un **sistema de orquestación multi-modelo** que selecciona el modelo más adecuado para diferentes agentes de IA y tipos de tareas según tus suscripciones y configuraciones.

**¿Por qué necesitamos múltiples modelos?**

Diferentes modelos tienen diferentes fortalezas:
- **Claude Opus 4.5**: Excelente en razonamiento complejo y diseño de arquitectura (costoso, pero alta calidad)
- **GPT-5.2**: Excelente en depuración de código y consultoría estratégica
- **Gemini 3 Pro**: Excelente en tareas de frontend y UI/UX (fuertes capacidades visuales)
- **GPT-5 Nano**: Rápido y gratuito, adecuado para búsqueda de código y exploración simple
- **GLM-4.7**: Excelente relación calidad-precio, adecuado para investigación y búsqueda de documentación

La inteligencia de oh-my-opencode radica en: **usar el modelo más adecuado para cada tarea, en lugar de usar el mismo modelo para todas las tareas**.

## Ubicación de Archivos de Configuración

oh-my-opencode admite dos niveles de configuración:

| Ubicación | Ruta | Prioridad | Escenario de Uso |
|---|---|---|---|
| **Configuración de Proyecto** | `.opencode/oh-my-opencode.json` | Baja | Configuración específica del proyecto (se envía con el repositorio de código) |
| **Configuración de Usuario** | `~/.config/opencode/oh-my-opencode.json` | Alta | Configuración global (compartida entre todos los proyectos) |

**Reglas de Fusión de Configuración**: La configuración de usuario anula la configuración de proyecto.

**Estructura Recomendada de Archivo de Configuración**:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  // Habilitar autocompletado de JSON Schema

  "agents": {
    // Anulaciones de modelos de agentes
  },
  "categories": {
    // Anulaciones de modelos de categorías
  }
}
```

::: tip Autocompletado de Schema
En editores como VS Code, después de agregar el campo `$schema`, obtendrás autocompletado completo y verificación de tipos al ingresar la configuración.
:::

## Métodos de Configuración de Provider

oh-my-opencode admite 6 Providers principales. Los métodos de configuración varían según el Provider.

### Anthropic Claude (Recomendado)

**Escenarios de Uso**: Orquestador Principal Sisyphus y la mayoría de los agentes principales

**Pasos de Configuración**:

1. **Ejecutar Autenticación de OpenCode**:
   ```bash
   opencode auth login
   ```

2. **Seleccionar Provider**:
   - `Provider`: Selecciona `Anthropic`
   - `Login method`: Selecciona `Claude Pro/Max`

3. **Completar Flujo OAuth**:
   - El sistema abrirá automáticamente el navegador
   - Inicia sesión en tu cuenta de Claude
   - Espera a que se complete la autenticación

4. **Verificar Éxito**:
   ```bash
   opencode models | grep anthropic
   ```

   Deberías ver:
   - `anthropic/claude-opus-4-5`
   - `anthropic/claude-sonnet-4-5`
   - `anthropic/claude-haiku-4-5`

**Mapeo de Modelos** (Configuración Predeterminada de Sisyphus):

| Agente | Modelo Predeterminado | Uso |
|---|---|---|
| Sisyphus | `anthropic/claude-opus-4-5` | Orquestador Principal, Razonamiento Complejo |
| Prometheus | `anthropic/claude-opus-4-5` | Planificación de Proyecto |
| Metis | `anthropic/claude-sonnet-4-5` | Análisis Pre-Planificación |
| Momus | `anthropic/claude-opus-4-5` | Revisión de Plan |

### OpenAI (ChatGPT Plus)

**Escenarios de Uso**: Agente Oracle (Revisión de Arquitectura, Depuración)

**Pasos de Configuración**:

1. **Ejecutar Autenticación de OpenCode**:
   ```bash
   opencode auth login
   ```

2. **Seleccionar Provider**:
   - `Provider`: Selecciona `OpenAI`
   - `Login method`: Selecciona OAuth o API Key

3. **Completar Flujo de Autenticación** (según el método seleccionado)

4. **Verificar Éxito**:
   ```bash
   opencode models | grep openai
   ```

**Mapeo de Modelos** (Configuración Predeterminada de Oracle):

| Agente | Modelo Predeterminado | Uso |
|---|---|---|
| Oracle | `openai/gpt-5.2` | Revisión de Arquitectura, Depuración |

**Ejemplo de Anulación Manual**:

```jsonc
{
  "agents": {
    "oracle": {
      "model": "openai/gpt-5.2",  // Usar GPT para razonamiento estratégico
      "temperature": 0.1
    }
  }
}
```

### Google Gemini (Recomendado)

**Escenarios de Uso**: Multimodal Looker (Análisis de Medios), Tareas de Frontend UI/UX

::: tip Altamente Recomendado
Para la autenticación de Gemini, se recomienda encarecidamente instalar el plugin [`opencode-antigravity-auth`](https://github.com/NoeFabris/opencode-antigravity-auth). Proporciona:
- Balanceo de carga de múltiples cuentas (hasta 10 cuentas)
- Soporte para sistema Variant (`low`/`high` variants)
- Sistema dual de cuotas (Antigravity + Gemini CLI)
:::

**Pasos de Configuración**:

1. **Agregar Plugin de Autenticación Antigravity**:
   
   Edita `~/.config/opencode/opencode.json`:
   ```json
   {
     "plugin": [
       "oh-my-opencode",
       "opencode-antigravity-auth@latest"
     ]
   }
   ```

2. **Configurar Modelos Gemini** (Importante):
   
   El plugin Antigravity usa diferentes nombres de modelos. Necesitas copiar la configuración completa del modelo a `opencode.json`, fusionando cuidadosamente para evitar romper la configuración existente.

   Modelos disponibles (Cuota Antigravity):
   - `google/antigravity-gemini-3-pro` — variants: `low`, `high`
   - `google/antigravity-gemini-3-flash` — variants: `minimal`, `low`, `medium`, `high`
   - `google/antigravity-claude-sonnet-4-5` — sin variants
   - `google/antigravity-claude-sonnet-4-5-thinking` — variants: `low`, `max`
   - `google/antigravity-claude-opus-4-5-thinking` — variants: `low`, `max`

   Modelos disponibles (Cuota Gemini CLI):
   - `google/gemini-2.5-flash`, `google/gemini-2.5-pro`, `google/gemini-3-flash-preview`, `google/gemini-3-pro-preview`

3. **Anular Modelo de Agente** (en `oh-my-opencode.json`):
   
   ```jsonc
   {
     "agents": {
       "multimodal-looker": {
         "model": "google/antigravity-gemini-3-flash"
       }
     }
   }
   ```

4. **Ejecutar Autenticación**:
   ```bash
   opencode auth login
   ```

5. **Seleccionar Provider**:
   - `Provider`: Selecciona `Google`
   - `Login method`: Selecciona `OAuth with Google (Antigravity)`

6. **Completar Flujo de Autenticación**:
   - El sistema abrirá automáticamente el navegador
   - Completa el inicio de sesión de Google
   - Opcional: Agrega más cuentas de Google para balanceo de carga

**Mapeo de Modelos** (Configuración Predeterminada):

| Agente | Modelo Predeterminado | Uso |
|---|---|---|
| Multimodal Looker | `google/antigravity-gemini-3-flash` | Análisis de PDF, Imágenes |

### GitHub Copilot (Provider de Respaldo)

**Escenarios de Uso**: Opción de respaldo cuando los Providers nativos no están disponibles

::: info Provider de Respaldo
GitHub Copilot actúa como un Provider proxy, enrutando solicitudes al modelo subyacente al que estás suscrito.
:::

**Pasos de Configuración**:

1. **Ejecutar Autenticación de OpenCode**:
   ```bash
   opencode auth login
   ```

2. **Seleccionar Provider**:
   - `Provider`: Selecciona `GitHub`
   - `Login method`: Selecciona `Authenticate via OAuth`

3. **Completar Flujo OAuth de GitHub**

4. **Verificar Éxito**:
   ```bash
   opencode models | grep github-copilot
   ```

**Mapeo de Modelos** (Cuando GitHub Copilot es el mejor Provider disponible):

| Agente | Modelo | Uso |
|---|---|---|
| Sisyphus | `github-copilot/claude-opus-4.5` | Orquestador Principal |
| Oracle | `github-copilot/gpt-5.2` | Revisión de Arquitectura |
| Explore | `opencode/gpt-5-nano` | Exploración Rápida |
| Librarian | `zai-coding-plan/glm-4.7` (si Z.ai está disponible) | Búsqueda de Documentación |

### Z.ai Coding Plan (Opcional)

**Escenarios de Uso**: Agente Librarian (Investigación Multi-Repositorio, Búsqueda de Documentación)

**Características**:
- Provee modelos GLM-4.7
- Excelente relación calidad-precio
- Cuando está habilitado, el **agente Librarian siempre usa** `zai-coding-plan/glm-4.7`, independientemente de otros Providers disponibles

**Pasos de Configuración**:

Usar el instalador interactivo:

```bash
bunx oh-my-opencode install
# Cuando se pregunte: "¿Tienes una suscripción Z.ai Coding Plan?" → Selecciona "Yes"
```

**Mapeo de Modelos** (Cuando Z.ai es el único Provider disponible):

| Agente | Modelo | Uso |
|---|---|---|
| Sisyphus | `zai-coding-plan/glm-4.7` | Orquestador Principal |
| Oracle | `zai-coding-plan/glm-4.7` | Revisión de Arquitectura |
| Explore | `zai-coding-plan/glm-4.7-flash` | Exploración Rápida |
| Librarian | `zai-coding-plan/glm-4.7` | Búsqueda de Documentación |

### OpenCode Zen (Opcional)

**Escenarios de Uso**: Provee modelos con prefijo `opencode/` (Claude Opus 4.5, GPT-5.2, GPT-5 Nano, Big Pickle)

**Pasos de Configuración**:

```bash
bunx oh-my-opencode install
# Cuando se pregunte: "¿Tienes acceso a OpenCode Zen (modelos opencode/)?" → Selecciona "Yes"
```

**Mapeo de Modelos** (Cuando OpenCode Zen es el mejor Provider disponible):

| Agente | Modelo | Uso |
|---|---|---|
| Sisyphus | `opencode/claude-opus-4-5` | Orquestador Principal |
| Oracle | `opencode/gpt-5.2` | Revisión de Arquitectura |
| Explore | `opencode/gpt-5-nano` | Exploración Rápida |
| Librarian | `opencode/big-pickle` | Búsqueda de Documentación |

## Sistema de Resolución de Modelos (Prioridad en 3 Pasos)

oh-my-opencode utiliza un **mecanismo de prioridad en 3 pasos** para decidir qué modelo usar para cada agente y categoría. Este mecanismo asegura que el sistema siempre pueda encontrar un modelo disponible.

### Paso 1: Anulación por Usuario

Si el usuario especifica explícitamente un modelo en `oh-my-opencode.json`, se usa ese modelo.

**Ejemplo**:
```jsonc
{
  "agents": {
    "oracle": {
      "model": "openai/gpt-5.2"  // Especificado explícitamente por el usuario
    }
  }
}
```

En este caso:
- ✅ Usa directamente `openai/gpt-5.2`
- ❌ Omite el paso de degradación de Provider

### Paso 2: Degradación de Provider

Si el usuario no especifica explícitamente un modelo, el sistema intentará uno por uno según la cadena de prioridad de Provider definida por el agente hasta encontrar un modelo disponible.

**Cadena de Prioridad de Provider para Sisyphus**:

```
anthropic → github-copilot → opencode → antigravity → google
```

**Flujo de Resolución**:
1. Intenta `anthropic/claude-opus-4-5`
   - ¿Disponible? → Devuelve este modelo
   - ¿No disponible? → Continúa al siguiente paso
2. Intenta `github-copilot/claude-opus-4-5`
   - ¿Disponible? → Devuelve este modelo
   - ¿No disponible? → Continúa al siguiente paso
3. Intenta `opencode/claude-opus-4-5`
   - ...
4. Intenta `google/antigravity-claude-opus-4-5-thinking` (si está configurado)
   - ...
5. Devuelve el modelo predeterminado del sistema

**Cadenas de Prioridad de Provider para Todos los Agentes**:

| Agente | Modelo (sin prefijo) | Cadena de Prioridad de Provider |
|---|---|---|
| **Sisyphus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Oracle** | `gpt-5.2` | openai → anthropic → google → github-copilot → opencode |
| **Librarian** | `big-pickle` | opencode → github-copilot → anthropic |
| **Explore** | `gpt-5-nano` | anthropic → opencode |
| **Multimodal Looker** | `gemini-3-flash` | google → openai → zai-coding-plan → anthropic → opencode |
| **Prometheus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Metis** | `claude-sonnet-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Momus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Atlas** | `claude-sonnet-4-5` | anthropic → github-copilot → opencode → antigravity → google |

**Cadenas de Prioridad de Provider para Categorías**:

| Categoría | Modelo (sin prefijo) | Cadena de Prioridad de Provider |
|---|---|---|
| **ultrabrain** | `gpt-5.2-codex` | openai → anthropic → google → github-copilot → opencode |
| **artistry** | `gemini-3-pro` | google → openai → anthropic → github-copilot → opencode |
| **quick** | `claude-haiku-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **writing** | `gemini-3-flash` | google → openai → anthropic → github-copilot → opencode |

### Paso 3: Predeterminado del Sistema

Si todos los Providers no están disponibles, usa el modelo predeterminado de OpenCode (lee de `opencode.json`).

**Orden de Prioridad Global**:

```
Anulación por Usuario > Degradación de Provider > Predeterminado del Sistema
```

## Sígueme: Configurar Múltiples Providers

### Paso 1: Planificar tus Suscripciones

Antes de comenzar la configuración, organiza primero el estado de tus suscripciones:

```markdown
- [ ] Anthropic Claude (Pro/Max)
- [ ] OpenAI ChatGPT Plus
- [ ] Google Gemini
- [ ] GitHub Copilot
- [ ] Z.ai Coding Plan
- [ ] OpenCode Zen
```

### Paso 2: Usar el Instalador Interactivo (Recomendado)

oh-my-opencode proporciona un instalador interactivo que maneja automáticamente la mayor parte de la configuración:

```bash
bunx oh-my-opencode install
```

El instalador preguntará:
1. **Do you have a Claude Pro/Max Subscription?**
   - `yes, max20` → `--claude=max20`
   - `yes, regular` → `--claude=yes`
   - `no` → `--claude=no`

2. **Do you have an OpenAI/ChatGPT Plus Subscription?**
   - `yes` → `--openai=yes`
   - `no` → `--openai=no`

3. **Will you integrate Gemini models?**
   - `yes` → `--gemini=yes`
   - `no` → `--gemini=no`

4. **Do you have a GitHub Copilot Subscription?**
   - `yes` → `--copilot=yes`
   - `no` → `--copilot=no`

5. **Do you have access to OpenCode Zen (opencode/ models)?**
   - `yes` → `--opencode-zen=yes`
   - `no` → `--opencode-zen=no`

6. **Do you have a Z.ai Coding Plan subscription?**
   - `yes` → `--zai-coding-plan=yes`
   - `no` → `--zai-coding-plan=no`

**Modo No Interactivo** (adecuado para instalación script):

```bash
bunx oh-my-opencode install --no-tui \
  --claude=max20 \
  --openai=yes \
  --gemini=yes \
  --copilot=no
```

### Paso 3: Autenticar Cada Provider

Después de que el instalador configure, autentica uno por uno:

```bash
# Autenticar Anthropic
opencode auth login
# Provider: Anthropic
# Login method: Claude Pro/Max
# Completar flujo OAuth

# Autenticar OpenAI
opencode auth login
# Provider: OpenAI
# Completar flujo OAuth

# Autenticar Google Gemini (necesita instalar plugin antigravity primero)
opencode auth login
# Provider: Google
# Login method: OAuth with Google (Antigravity)
# Completar flujo OAuth

# Autenticar GitHub Copilot
opencode auth login
# Provider: GitHub
# Login method: Authenticate via OAuth
# Completar GitHub OAuth
```

### Paso 4: Verificar Configuración

```bash
# Verificar versión de OpenCode
opencode --version
# Debería ser >= 1.0.150

# Ver todos los modelos disponibles
opencode models

# Ejecutar diagnóstico doctor
bunx oh-my-opencode doctor --verbose
```

**Deberías ver** (ejemplo de salida doctor):

```
✅ OpenCode version: 1.0.150
✅ Plugin loaded: oh-my-opencode

📊 Model Resolution:
┌─────────────────────────────────────────────────────┐
│ Agent           │ Requirement            │ Resolved         │
├─────────────────────────────────────────────────────┤
│ Sisyphus        │ anthropic/claude-opus-4-5  │ anthropic/claude-opus-4-5 │
│ Oracle           │ openai/gpt-5.2              │ openai/gpt-5.2              │
│ Librarian        │ opencode/big-pickle           │ opencode/big-pickle           │
│ Explore          │ anthropic/gpt-5-nano          │ anthropic/gpt-5-nano          │
│ Multimodal Looker│ google/gemini-3-flash          │ google/gemini-3-flash          │
└─────────────────────────────────────────────────────┘

✅ All models resolved successfully
```

### Paso 5: Personalizar Modelo de Agente (Opcional)

Si deseas especificar un modelo diferente para un agente específico:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "agents": {
    // Oracle usa GPT para revisión de arquitectura
    "oracle": {
      "model": "openai/gpt-5.2",
      "temperature": 0.1
    },

    // Librarian usa un modelo más barato para investigación
    "librarian": {
      "model": "opencode/gpt-5-nano",
      "temperature": 0.1
    },

    // Multimodal Looker usa Antigravity Gemini
    "multimodal-looker": {
      "model": "google/antigravity-gemini-3-flash",
      "variant": "high"
    }
  }
}
```

### Paso 6: Personalizar Modelo de Categoría (Opcional)

Especificar modelos para diferentes tipos de tareas:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "categories": {
    // Tareas rápidas usan modelos baratos
    "quick": {
      "model": "opencode/gpt-5-nano",
      "temperature": 0.1
    },

    // Tareas frontend usan Gemini
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "temperature": 0.7,
      "prompt_append": "Use shadcn/ui components and Tailwind CSS."
    },

    // Tareas de razonamiento de alta inteligencia usan GPT Codex
    "ultrabrain": {
      "model": "openai/gpt-5.2-codex",
      "temperature": 0.1
    }
  }
}
```

**Usar Categoría**:

```markdown
// Usar delegate_task en conversación
delegate_task(category="visual", prompt="Create a responsive dashboard component")
delegate_task(category="quick", skills=["git-master"], prompt="Commit these changes")
```

## Punto de Verificación ✅

- [ ] `opencode --version` muestra versión >= 1.0.150
- [ ] `opencode models` lista los modelos de todos los Providers que configuraste
- [ ] `bunx oh-my-opencode doctor --verbose` muestra que todos los modelos de agentes se resolvieron correctamente
- [ ] Puedes ver `"oh-my-opencode"` en el array `plugin` en `opencode.json`
- [ ] Intenta usar un agente (como Sisyphus), confirma que el modelo funciona correctamente

## Advertencias de Trampas

### ❌ Trampa 1: Olvidar Autenticar Provider

**Síntoma**: Configuraste el Provider, pero la resolución del modelo falla.

**Causa**: El instalador configuró el modelo, pero no completaste la autenticación.

**Solución**:
```bash
opencode auth login
# Selecciona el Provider correspondiente y completa la autenticación
```

### ❌ Trampa 2: Nombre de Modelo Antigravity Incorrecto

**Síntoma**: Configuraste Gemini, pero el agente no lo usa.

**Causa**: El plugin Antigravity usa diferentes nombres de modelos (`google/antigravity-gemini-3-pro` en lugar de `google/gemini-3-pro`).

**Solución**:
```jsonc
{
  "agents": {
    "multimodal-looker": {
      "model": "google/antigravity-gemini-3-flash"  // Correcto
      // model: "google/gemini-3-flash"  // ❌ Incorrecto
    }
  }
}
```

### ❌ Trampa 3: Ubicación de Archivo de Configuración Incorrecta

**Síntoma**: Modificaste la configuración, pero el sistema no la aplicó.

**Causa**: Modificaste el archivo de configuración incorrecto (configuración de usuario vs configuración de proyecto).

**Solución**:
```bash
# Configuración de Usuario (global, prioridad alta)
~/.config/opencode/oh-my-opencode.json

# Configuración de Proyecto (local, prioridad baja)
.opencode/oh-my-opencode.json

# Verificar qué archivo se está usando
bunx oh-my-opencode doctor --verbose
```

### ❌ Trampa 4: Cadena de Prioridad de Provider Interrumpida

**Síntoma**: Un agente siempre usa el modelo incorrecto.

**Causa**: La anulación por usuario (Paso 1) omite completamente la degradación de Provider (Paso 2).

**Solución**: Si deseas aprovechar la degradación automática, no codifiques el modelo en `oh-my-opencode.json`, sino deja que el sistema seleccione automáticamente según la cadena de prioridad.

**Ejemplo**:
```jsonc
{
  "agents": {
    "oracle": {
      // ❌ Codificado: siempre usa GPT, incluso si Anthropic está disponible
      "model": "openai/gpt-5.2"
    }
  }
}
```

Si deseas aprovechar la degradación, elimina el campo `model` y deja que el sistema seleccione automáticamente:
```jsonc
{
  "agents": {
    "oracle": {
      // ✅ Automático: anthropic → google → github-copilot → opencode
      "temperature": 0.1
    }
  }
}
```

### ❌ Trampa 5: Z.ai Siempre Ocupa Librarian

**Síntoma**: Incluso cuando configuras otros Providers, Librarian sigue usando GLM-4.7.

**Causa**: Cuando Z.ai está habilitado, Librarian está codificado para usar `zai-coding-plan/glm-4.7`.

**Solución**: Si no necesitas este comportamiento, deshabilita Z.ai:
```bash
bunx oh-my-opencode install --no-tui --zai-coding-plan=no
```

O anula manualmente:
```jsonc
{
  "agents": {
    "librarian": {
      "model": "opencode/big-pickle"  // Anular codificación de Z.ai
    }
  }
}
```

## Resumen de la Lección

- oh-my-opencode admite 6 Providers principales: Anthropic, OpenAI, Google, GitHub Copilot, Z.ai, OpenCode Zen
- Usa el instalador interactivo `bunx oh-my-opencode install` para configurar rápidamente múltiples Providers
- El sistema de resolución de modelos selecciona dinámicamente modelos mediante prioridad en 3 pasos (anulación por usuario → degradación de Provider → predeterminado del sistema)
- Cada agente y Categoría tiene su propia cadena de prioridad de Provider, asegurando que siempre se pueda encontrar un modelo disponible
- Usa el comando `doctor --verbose` para diagnosticar la configuración de resolución de modelos
- Al personalizar modelos de agentes y categorías, debes tener cuidado de no romper el mecanismo de degradación automática

## Vista Previa de la Siguiente Lección

> En la siguiente lección aprenderemos **[Estrategia Multi-Modelo: Degradación Automática y Prioridades](../model-resolution/)**.>
> Aprenderás:
> - El flujo de trabajo completo del sistema de resolución de modelos
> - Cómo diseñar combinaciones óptimas de modelos para diferentes tareas
> - Estrategias de control de concurrencia en tareas en segundo plano
> - Cómo diagnosticar problemas de resolución de modelos

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-26

| Función | Ruta del Archivo | Número de Línea |
|---|---|---|
| Definición del Schema de Configuración | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 1-378 |
| Guía de Instalación (Configuración de Provider) | [`docs/guide/installation.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/guide/installation.md) | 1-299 |
| Referencia de Configuración (Resolución de Modelos) | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md) | 391-512 |
| Schema de Configuración de Anulación de Agente | [`src/config/schema.ts:AgentOverrideConfigSchema`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L98-L119) | 98-119 |
| Schema de Configuración de Categoría | [`src/config/schema.ts:CategoryConfigSchema`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L154-L172) | 154-172 |
| Documentación de Cadena de Prioridad de Provider | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md#L445-L473) | 445-473 |

**Constantes Clave**:
- Ninguna: La cadena de prioridad de Provider está codificada en la documentación de configuración, no es una constante de código

**Funciones Clave**:
- Ninguna: La lógica de resolución de modelos es manejada por el núcleo de OpenCode, oh-my-opencode proporciona definiciones de configuración y prioridades

</details>
