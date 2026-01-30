---
title: "Instalación: Despliegue Rápido | oh-my-opencode"
sidebarTitle: "Listo en 5 minutos"
subtitle: "Instalación y configuración rápida: Configuración y verificación de proveedores"
description: "Aprende a instalar y configurar oh-my-opencode. Configura AI Provider en 5 minutos con soporte para Claude, OpenAI, Gemini y GitHub Copilot."
tags:
  - "instalación"
  - "configuración"
  - "configuración-de-proveedores"
prerequisite: []
order: 10
---

# Instalación y configuración rápida: Configuración y verificación de proveedores

## Lo que podrás hacer después de completar este tutorial

- ✅ Usar el método recomendado de agente AI para instalar y configurar oh-my-opencode automáticamente
- ✅ Usar el instalador interactivo CLI manualmente para completar la configuración
- ✅ Configurar múltiples proveedores de IA como Claude, OpenAI, Gemini y GitHub Copilot
- ✅ Verificar que la instalación sea exitosa y diagnosticar problemas de configuración
- ✅ Comprender la prioridad de proveedores y los mecanismos de degradación

## Tu situación actual

- Acabas de instalar OpenCode, pero no sabes por dónde empezar con la interfaz de configuración en blanco
- Tienes múltiples suscripciones de servicios de IA (Claude, ChatGPT, Gemini) pero no sabes cómo configurarlos de forma unificada
- Quieres que la IA te ayude con la instalación, pero no sabes cómo dar instrucciones precisas al agente de IA
- Te preocupa que una configuración incorrecta haga que el plugin no funcione correctamente

## Cuándo usar esta guía

- **Al instalar oh-my-opencode por primera vez**: Este es el primer paso obligatorio
- **Después de adquirir una nueva suscripción de IA**: Por ejemplo, al comprar Claude Max o ChatGPT Plus
- **Al cambiar de entorno de desarrollo**: Al reconfigurar en una nueva máquina
- **Al encontrar problemas de conexión con proveedores**: Usar comandos de diagnóstico para solucionar problemas de configuración

## 🎒 Preparación antes de comenzar

::: warning Requisitos previos
Este tutorial asume que ya has:
1. Instalado **OpenCode >= 1.0.150**
2. Tienes al menos una suscripción de proveedor de IA (Claude, OpenAI, Gemini, GitHub Copilot, etc.)

Si OpenCode no está instalado, consulta primero la [documentación oficial de OpenCode](https://opencode.ai/docs) para completar la instalación.
:::

::: tip Verificar la versión de OpenCode
```bash
opencode --version
# Debería mostrar 1.0.150 o superior
```
:::

## Conceptos fundamentales

El diseño de instalación de oh-my-opencode se basa en dos principios fundamentales:

**1. Prioridad al agente de IA (recomendado)**

Deja que el agente de IA instale y configure por ti, en lugar de hacerlo manualmente. ¿Por qué?
- La IA no omite pasos (tiene la guía de instalación completa)
- La IA selecciona automáticamente la mejor configuración según tus suscripciones
- La IA puede diagnosticar y reparar errores automáticamente

**2. Modo interactivo vs no interactivo**

- **Instalación interactiva**: Ejecuta `bunx oh-my-opencode install` y configura mediante preguntas
- **Instalación no interactiva**: Usa parámetros de línea de comandos (ideal para automatización o agentes de IA)

**3. Prioridad de proveedores**

oh-my-opencode utiliza un mecanismo de resolución de modelos en tres pasos:
1. **Sobrescritura de usuario**: Si el archivo de configuración especifica explícitamente un modelo, se usa ese
2. **Degradación de proveedores**: Intenta en cadena según prioridad: `Nativo (anthropic/openai/google) > GitHub Copilot > OpenCode Zen > Z.ai Coding Plan`
3. **Predeterminado del sistema**: Si ningún proveedor está disponible, usa el modelo predeterminado de OpenCode

::: info ¿Qué es un proveedor (Provider)?
Un proveedor es un servicio que ofrece modelos de IA, por ejemplo:
- **Anthropic**: Proporciona modelos Claude (Opus, Sonnet, Haiku)
- **OpenAI**: Proporciona modelos GPT (GPT-5.2, GPT-5-nano)
- **Google**: Proporciona modelos Gemini (Gemini 3 Pro, Flash)
- **GitHub Copilot**: Proporcione múltiples modelos alojados por GitHub como respaldo

oh-my-opencode puede configurar múltiples proveedores simultáneamente y seleccionar automáticamente el modelo óptimo según la tarea y la prioridad.
:::

## Guía paso a paso

### Paso 1: Método recomendado — Deja que el agente de IA instale (amigable para humanos)

**Por qué**
Esta es la forma oficial recomendada de instalación. Deja que el agente de IA complete la configuración automáticamente para evitar omisiones de pasos.

**Operación**

Abre tu interfaz de diálogo de IA (Claude Code, AmpCode, Cursor, etc.) e ingresa el siguiente prompt:

```bash
Por favor, instala y configura oh-my-opencode siguiendo esta guía:
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```

**Lo que deberías ver**
El agente de IA:
1. Preguntará sobre tus suscripciones (Claude, OpenAI, Gemini, GitHub Copilot, etc.)
2. Ejecutará automáticamente los comandos de instalación
3. Configurará la autenticación del proveedor
4. Verificará el resultado de la instalación
5. Te informará que la instalación se ha completado

::: tip Frase de prueba del agente de IA
Después de completar la instalación, el agente de IA usará "oMoMoMoMo..." como frase de prueba para confirmar contigo.
:::

### Paso 2: Instalación manual — Usar el instalador interactivo CLI

**Por qué**
Cuando quieres controlar completamente el proceso de instalación, o cuando la instalación del agente de IA falla.

::: code-group

```bash [Usando Bun (recomendado)]
bunx oh-my-opencode install
```

```bash [Usando npm]
npx oh-my-opencode install
```

:::

> **Nota**: El CLI descargará automáticamente el binario independiente adecuado para tu plataforma. No se requiere Bun/Node.js en tiempo de ejecución después de la instalación.
> > **Plataformas soportadas**: macOS (ARM64, x64), Linux (x64, ARM64, Alpine/musl), Windows (x64)

**Lo que deberías ver**
El instalador hará las siguientes preguntas:

```
oMoMoMoMo... Install

[?] ¿Tienes una suscripción Claude Pro/Max? (Y/n)
[?] ¿Estás en max20 (modo 20x)? (Y/n)
[?] ¿Tienes una suscripción OpenAI/ChatGPT Plus? (Y/n)
[?] ¿Vas a integrar modelos Gemini? (Y/n)
[?] ¿Tienes una suscripción GitHub Copilot? (Y/n)
[?] ¿Tienes acceso a OpenCode Zen (modelos opencode/)? (Y/n)
[?] ¿Tienes una suscripción Z.ai Coding Plan? (Y/n)

Configuration Summary
────────────────────────────────────────────────

  [OK] Claude (max20)
  [OK] OpenAI/ChatGPT (GPT-5.2 for Oracle)
  [OK] Gemini
  [OK] GitHub Copilot (fallback)
  ○ OpenCode Zen (modelos opencode/)
  ○ Z.ai Coding Plan (Librarian/Multimodal)

────────────────────────────────────────────────

Model Assignment

  [i] Models auto-configured based on provider priority
  * Priority: Native > Copilot > OpenCode Zen > Z.ai

✓ Plugin registered in opencode.json
✓ Configuration written to ~/.config/opencode/oh-my-opencode.json
✓ Auth setup hints displayed

[!] Please configure authentication for your providers:

1. Anthropic (Claude): Run 'opencode auth login' → Select Anthropic
2. Google (Gemini): Run 'opencode auth login' → Select Google → Choose OAuth with Google (Antigravity)
3. GitHub (Copilot): Run 'opencode auth login' → Select GitHub

Done! 🎉
```

### Paso 3: Configurar autenticación de proveedores

#### 3.1 Autenticación Claude (Anthropic)

**Por qué**
El agente Sisyphus recomienda fuertemente usar el modelo Opus 4.5, que requiere autenticación previa.

**Operación**

```bash
opencode auth login
```

Luego sigue las instrucciones:
1. **Selecciona proveedor**: Elige `Anthropic`
2. **Selecciona método de inicio de sesión**: Elige `Claude Pro/Max`
3. **Completa el flujo OAuth**: Inicia sesión y autoriza en el navegador
4. **Espera**: La terminal mostrará que la autenticación fue exitosa

**Lo que deberías ver**
```
✓ Authentication successful
✓ Anthropic provider configured
```

::: warning Restricciones de acceso OAuth de Claude
> A partir de enero de 2026, Anthropic ha restringido el acceso OAuth de terceros, citando violaciones de los Términos de Servicio.
>
> [**Anthropic citó este proyecto oh-my-opencode como razón para bloquear OpenCode**](https://x.com/thdxr/status/2010149530486911014)
>
> De hecho, existen algunos plugins en la comunidad que falsifican firmas de solicitudes OAuth de Claude Code. Estas herramientas pueden funcionar técnicamente, pero los usuarios deben entender las implicaciones de los Términos de Servicio, y personalmente no las recomiendo.
>
> Este proyecto no se hace responsable de ningún problema causado por el uso de herramientas no oficiales, y **no tenemos ninguna implementación personalizada de sistema OAuth**.
:::

#### 3.2 Autenticación de Google Gemini (OAuth Antigravity)

**Por qué**
Los modelos Gemini se utilizan para Multimodal Looker (análisis de medios) y algunas tareas especializadas.

**Pasos**

**Paso 1**: Agregar el plugin opencode-antigravity-auth

Edita `~/.config/opencode/opencode.json` y agrega `opencode-antigravity-auth@latest` al array `plugin`:

```json
{
  "plugin": [
    "oh-my-opencode",
    "opencode-antigravity-auth@latest"
  ]
}
```

**Paso 2**: Configurar modelos Antigravity (obligatorio)

Copia la configuración completa de modelos de la [documentación de opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) y combínala cuidadosamente en `~/.config/opencode/oh-my-opencode.json`, evitando dañar la configuración existente.

Este plugin usa un **sistema de variantes**: modelos como `antigravity-gemini-3-pro` soportan variantes `low`/`high`, en lugar de entradas de modelos separadas `-low`/`-high`.

**Paso 3**: Sobrescribir modelos de agentes de oh-my-opencode

En `oh-my-opencode.json` (o `.opencode/oh-my-opencode.json`), sobrescribe los modelos de agentes:

```json
{
  "agents": {
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**Modelos disponibles (cuota Antigravity)**:
- `google/antigravity-gemini-3-pro` — variantes: `low`, `high`
- `google/antigravity-gemini-3-flash` — variantes: `minimal`, `low`, `medium`, `high`
- `google/antigravity-claude-sonnet-4-5` — sin variantes
- `google/antigravity-claude-sonnet-4-5-thinking` — variantes: `low`, `max`
- `google/antigravity-claude-opus-4-5-thinking` — variantes: `low`, `max`

**Modelos disponibles (cuota Gemini CLI)**:
- `google/gemini-2.5-flash`, `google/gemini-2.5-pro`
- `google/gemini-3-flash-preview`, `google/gemini-3-pro-preview`

> **Nota**: Los nombres tradicionales con sufijos como `google/antigravity-gemini-3-pro-high` aún funcionan, pero se recomienda usar variantes. Usa `--variant=high` y el nombre base del modelo en su lugar.

**Paso 4**: Ejecutar autenticación

```bash
opencode auth login
```

Luego sigue las instrucciones:
1. **Selecciona proveedor**: Elige `Google`
2. **Selecciona método de inicio de sesión**: Elige `OAuth with Google (Antigravity)`
3. **Completa inicio de sesión en el navegador**: (Detección automática) completa el inicio de sesión
4. **Opcional**: Agrega más cuentas de Google para balanceo de carga entre múltiples cuentas
5. **Verifica éxito**: Confirma con el usuario

**Lo que deberías ver**
```
✓ Authentication successful
✓ Google provider configured (Antigravity)
✓ Multiple accounts available for load balancing
```

::: tip Balanceo de carga multi-cuenta
Este plugin soporta hasta 10 cuentas de Google. Cuando una cuenta alcanza el límite de velocidad, cambia automáticamente a la siguiente cuenta disponible.
:::

#### 3.3 Autenticación de GitHub Copilot (proveedor de respaldo)

**Por qué**
GitHub Copilot actúa como **proveedor de respaldo**, usado cuando los proveedores nativos no están disponibles.

**Prioridad**: `Nativo (anthropic/, openai/, google/) > GitHub Copilot > OpenCode Zen > Z.ai Coding Plan`

**Operación**

```bash
opencode auth login
```

Luego sigue las instrucciones:
1. **Selecciona proveedor**: Elige `GitHub`
2. **Selecciona método de autenticación**: Elige `Authenticate via OAuth`
3. **Completa inicio de sesión en el navegador**: Flujo OAuth de GitHub

**Lo que deberías ver**
```
✓ Authentication successful
✓ GitHub Copilot configured as fallback
```

::: info Mapeo de modelos de GitHub Copilot
Cuando GitHub Copilot es el mejor proveedor disponible, oh-my-opencode usa las siguientes asignaciones de modelos:

| Agente          | Modelo                            |
| --------------- | --------------------------------- |
| **Sisyphus**    | `github-copilot/claude-opus-4.5`  |
| **Oracle**      | `github-copilot/gpt-5.2`          |
| **Explore**     | `opencode/gpt-5-nano`             |
| **Librarian**   | `zai-coding-plan/glm-4.7` (si Z.ai está disponible) o fallback |

GitHub Copilot actúa como proveedor de agentes, enrutando solicitudes al modelo subyacente según tu suscripción.
:::

### Paso 4: Instalación no interactiva (adecuada para agentes de IA)

**Por qué**
Los agentes de IA necesitan usar el modo no interactivo para completar toda la configuración de una vez a través de parámetros de línea de comandos.

**Operación**

```bash
bunx oh-my-opencode install --no-tui \
  --claude=<yes|no|max20> \
  --openai=<yes|no> \
  --gemini=<yes|no> \
  --copilot=<yes|no> \
  [--opencode-zen=<yes|no>] \
  [--zai-coding-plan=<yes|no>]
```

**Descripción de parámetros**:

| Parámetro         | Valor          | Descripción                               |
| ----------------- | -------------- | ----------------------------------------- |
| `--no-tui`        | -              | Deshabilita interfaz interactiva (requiere otros parámetros) |
| `--claude`        | `yes/no/max20` | Estado de suscripción Claude              |
| `--openai`        | `yes/no`       | Suscripción OpenAI/ChatGPT (GPT-5.2 para Oracle) |
| `--gemini`        | `yes/no`       | Integración Gemini                        |
| `--copilot`       | `yes/no`       | Suscripción GitHub Copilot                |
| `--opencode-zen`  | `yes/no`       | Acceso OpenCode Zen (predeterminado no)   |
| `--zai-coding-plan` | `yes/no`     | Suscripción Z.ai Coding Plan (predeterminado no) |

**Ejemplos**:

```bash
# Usuario con todas las suscripciones nativas
bunx oh-my-opencode install --no-tui \
  --claude=max20 \
  --openai=yes \
  --gemini=yes \
  --copilot=no

# Usuario solo con Claude
bunx oh-my-opencode install --no-tui \
  --claude=yes \
  --openai=no \
  --gemini=no \
  --copilot=no

# Usuario solo con GitHub Copilot
bunx oh-my-opencode install --no-tui \
  --claude=no \
  --openai=no \
  --gemini=no \
  --copilot=yes

# Usuario sin suscripciones
bunx oh-my-opencode install --no-tui \
  --claude=no \
  --openai=no \
  --gemini=no \
  --copilot=no
```

**Lo que deberías ver**
La misma salida que la instalación no interactiva, pero sin necesidad de responder preguntas manualmente.

## Punto de control ✅

### Verificar que la instalación fue exitosa

**Verificación 1**: Confirmar versión de OpenCode

```bash
opencode --version
```

**Resultado esperado**: Muestra `1.0.150` o superior.

::: warning Requisito de versión de OpenCode
Si tienes la versión 1.0.132 o anterior, los errores de OpenCode pueden dañar la configuración.
>
> La corrección se fusionó después de la 1.0.132 — usa una versión más reciente.
> Dato curioso: Este PR fue descubierto y corregido debido a las configuraciones de Librarian, Explore y Oracle de OhMyOpenCode.
:::

**Verificación 2**: Confirmar que el plugin está registrado

```bash
cat ~/.config/opencode/opencode.json
```

**Resultado esperado**: Ver `"oh-my-opencode"` en el array `plugin`.

```json
{
  "plugin": [
    "oh-my-opencode",
    "opencode-antigravity-auth@latest"
  ]
}
```

**Verificación 3**: Confirmar que el archivo de configuración se generó

```bash
cat ~/.config/opencode/oh-my-opencode.json
```

**Resultado esperado**: Muestra la estructura de configuración completa, incluyendo campos como `agents`, `categories`, `disabled_agents`, etc.

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  "agents": {
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5"
    },
    "oracle": {
      "model": "openai/gpt-5.2"
    }
  },
  "categories": {
    "quick": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.1
    }
  },
  "disabled_agents": [],
  "disabled_skills": [],
  "disabled_hooks": [],
  "disabled_mcps": []
}
```

### Ejecutar comando de diagnóstico

```bash
oh-my-opencode doctor --verbose
```

**Lo que deberías ver**:
- Verificación de resolución de modelos
- Validación de configuración de agentes
- Estado de conexión MCP
- Estado de autenticación de proveedores

```bash
✓ OpenCode version: 1.0.150 (required: >=1.0.150)
✓ Plugin registered: oh-my-opencode
✓ Config file found: ~/.config/opencode/oh-my-opencode.json
✓ Anthropic provider: authenticated
✓ OpenAI provider: authenticated
✓ Google provider: authenticated (Antigravity)
✓ GitHub Copilot: authenticated (fallback)
✓ MCP servers: 3 connected (websearch, context7, grep_app)
✓ Agents: 10 enabled
✓ Hooks: 32 enabled
```

::: danger Si el diagnóstico falla
Si el diagnóstico muestra algún error, resuélvelo primero:
1. **Fallo de autenticación del proveedor**: Vuelve a ejecutar `opencode auth login`
2. **Error de archivo de configuración**: Verifica la sintaxis de `oh-my-opencode.json` (JSONC soporta comentarios y comas finales)
3. **Incompatibilidad de versiones**: Actualiza OpenCode a la última versión
4. **Plugin no registrado**: Vuelve a ejecutar `bunx oh-my-opencode install`
:::

## Advertencias de errores comunes

### ❌ Error 1: Olvidar configurar la autenticación del proveedor

**Problema**: Instalación seguida de uso inmediato, pero los modelos de IA no funcionan.

**Causa**: El plugin está instalado, pero el proveedor no ha sido autenticado a través de OpenCode.

**Solución**:
```bash
opencode auth login
# Selecciona el proveedor correspondiente y completa la autenticación
```

### ❌ Error 2: Versión de OpenCode demasiado antigua

**Problema**: Archivo de configuración dañado o que no se puede cargar.

**Causa**: OpenCode 1.0.132 o versiones anteriores tienen errores que dañan la configuración.

**Solución**:
```bash
# Actualizar OpenCode
npm install -g @opencode/cli@latest

# O usando el gestor de paquetes (Bun, Homebrew, etc.)
bun install -g @opencode/cli@latest
```

### ❌ Error 3: Parámetros de comando CLI incorrectos

**Problema**: Al ejecutar instalación no interactiva, se muestra error de parámetros.

**Causa**: `--claude` es un parámetro obligatorio, debe proporcionar `yes`, `no` o `max20`.

**Solución**:
```bash
# ❌ Incorrecto: falta parámetro --claude
bunx oh-my-opencode install --no-tui --gemini=yes

# ✅ Correcto: proporciona todos los parámetros obligatorios
bunx oh-my-opencode install --no-tui --claude=yes --gemini=yes
```

### ❌ Error 4: Cuota Antigravity agotada

**Problema**: Los modelos Gemini dejan de funcionar repentinamente.

**Causa**: La cuota Antigravity es limitada, una sola cuenta puede alcanzar el límite de velocidad.

**Solución**: Agrega múltiples cuentas de Google para balanceo de carga
```bash
opencode auth login
# Selecciona Google
# Agrega más cuentas
```

El plugin cambiará automáticamente entre cuentas, evitando el agotamiento de una sola cuenta.

### ❌ Error 5: Ubicación incorrecta del archivo de configuración

**Problema**: Después de modificar la configuración, no surte efecto.

**Causa**: Se modificó el archivo de configuración incorrecto (configuración de proyecto vs configuración de usuario).

**Solución**: Confirmar la ubicación del archivo de configuración

| Tipo de configuración | Ruta del archivo | Prioridad |
| --------------------- | ---------------- | --------- |
| **Configuración de usuario** | `~/.config/opencode/oh-my-opencode.json` | Alta |
| **Configuración de proyecto** | `.opencode/oh-my-opencode.json` | Baja |

::: tip Reglas de fusión de configuración
Si existen tanto la configuración de usuario como la de proyecto, **la configuración de usuario sobrescribirá la de proyecto**.
:::

## Resumen de esta lección

- **Recomendamos instalar usando agente de IA**: Deja que la IA complete la configuración automáticamente para evitar omisiones humanas
- **CLI soporta modos interactivo y no interactivo**: Interactivo para humanos, no interactivo para IA
- **Prioridad de proveedores**: Nativo > Copilot > OpenCode Zen > Z.ai
- **La autenticación es obligatoria**: Después de la instalación, debes configurar la autenticación del proveedor para poder usarlo
- **Los comandos de diagnóstico son importantes**: `oh-my-opencode doctor --verbose` puede diagnosticar problemas rápidamente
- **Soporte para formato JSONC**: Los archivos de configuración soportan comentarios y comas finales

## Avance de la próxima lección

> En la próxima lección aprenderemos **[Conociendo Sisyphus: Orquestador Principal](../sisyphus-orchestrator/)**.
>
> Aprenderás:
> - Funcionalidades principales y filosofía de diseño del agente Sisyphus
> - Cómo usar Sisyphus para planificar y delegar tareas
> - Mecanismos de operación de tareas en segundo plano paralelo
> - Principios del forzador de completado de Todo

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para ver ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-26

| Funcionalidad | Ruta del archivo | Líneas |
| ------------- | ---------------- | ------ |
| Entrada CLI de instalación | [`src/cli/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/index.ts) | 22-60 |
| Instalador interactivo | [`src/cli/install.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/install.ts) | 1-400+ |
| Gestor de configuración | [`src/cli/config-manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/config-manager.ts) | 1-200+ |
| Schema de configuración | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/config/schema.ts) | 1-400+ |
| Comando de diagnóstico | [`src/cli/doctor.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/doctor.ts) | 1-200+ |

**Constantes clave**:
- `VERSION = packageJson.version`: Número de versión actual del CLI
- `SYMBOLS`: Símbolos de UI (check, cross, arrow, bullet, info, warn, star)

**Funciones clave**:
- `install(args: InstallArgs)`: Función principal de instalación, maneja instalación interactiva y no interactiva
- `validateNonTuiArgs(args: InstallArgs)`: Valida parámetros para modo no interactivo
- `argsToConfig(args: InstallArgs)`: Convierte parámetros CLI a objeto de configuración
- `addPluginToOpenCodeConfig()`: Registra plugin en opencode.json
- `writeOmoConfig(config)`: Escribe archivo de configuración oh-my-opencode.json
- `isOpenCodeInstalled()`: Verifica si OpenCode está instalado
- `getOpenCodeVersion()`: Obtiene número de versión de OpenCode

**Campos del Schema de configuración**:
- `AgentOverrideConfigSchema`: Configuración de sobrescritura de agentes (model, variant, skills, temperature, prompt, etc.)
- `CategoryConfigSchema`: Configuración de Categoría (description, model, temperature, thinking, etc.)
- `ClaudeCodeConfigSchema`: Configuración de compatibilidad Claude Code (mcp, commands, skills, agents, hooks, plugins)
- `BuiltinAgentNameSchema`: Enumeración de agentes integrados (sisyphus, prometheus, oracle, librarian, explore, multimodal-looker, metis, momus, atlas)
- `PermissionValue`: Enumeración de valores de permiso (ask, allow, deny)

**Plataformas soportadas para instalación** (de README):
- macOS (ARM64, x64)
- Linux (x64, ARM64, Alpine/musl)
- Windows (x64)

**Cadena de prioridad de proveedores** (de docs/guide/installation.md):
1. Nativo (anthropic/, openai/, google/)
2. GitHub Copilot
3. OpenCode Zen
4. Z.ai Coding Plan

</details>
