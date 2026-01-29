---
title: "Plataforma de Habilidades y ClawdHub: Extender el Asistente IA | Tutorial de Clawdbot | Clawdbot"
sidebarTitle: "Extender Capacidades IA"
subtitle: "Plataforma de Habilidades y ClawdHub: Extender el Asistente IA | Tutorial de Clawdbot | Clawdbot"
description: "Aprende la arquitectura del sistema de habilidades de Clawdbot y domina las tres prioridades de carga de habilidades Bundled, Managed y Workspace. Usa ClawdHub para instalar y actualizar habilidades, configura reglas de gateo de habilidades y el mecanismo de inyección de variables de entorno."
tags:
  - "sistema de habilidades"
  - "ClawdHub"
  - "extensión IA"
  - "configuración de habilidades"
prerequisite:
  - "start-getting-start"
order: 280
---

# Plataforma de Habilidades y ClawdHub para Extender el Asistente IA | Tutorial de Clawdbot

## Lo que podrás hacer después de aprender

Al completar esta lección, podrás:

- Entender la arquitectura del sistema de habilidades de Clawdbot (tres tipos de habilidades: Bundled, Managed, Workspace)
- Descubrir, instalar y actualizar habilidades desde ClawdHub para extender las capacidades del asistente IA
- Configurar el estado de activación, variables de entorno y claves API de las habilidades
- Usar reglas de gateo (Gating) de habilidades para asegurar que se carguen solo cuando se cumplan las condiciones
- Gestionar el uso compartido y la prioridad de sobrescritura de habilidades en escenarios multi-agent

## Tu problema actual

Clawdbot ya proporciona una rica variedad de herramientas integradas (navegador, ejecución de comandos, búsqueda web, etc.), pero cuando necesitas:

- Llamar a herramientas CLI de terceros (como `gemini`, `peekaboo`)
- Agregar scripts de automatización específicos de un dominio
- Hacer que la IA aprenda a usar tu conjunto de herramientas personalizado

Podrías preguntarte: "¿Cómo le digo a la IA qué herramientas están disponibles? ¿Dónde deberían colocarse estas herramientas? ¿Pueden varios agentes compartir habilidades?"

El sistema de habilidades de Clawdbot está diseñado para esto: **declarar habilidades a través del archivo SKILL.md, y el agente las carga y usa automáticamente**.

## Cuándo usar este método

- **Cuando necesites extender las capacidades de la IA**: quieras agregar nuevas herramientas o procesos de automatización
- **En colaboración multi-agente**: diferentes agentes necesitan compartir o tener acceso exclusivo a habilidades
- **En la gestión de versiones de habilidades**: instalar, actualizar y sincronizar habilidades desde ClawdHub
- **En el gateo de habilidades**: asegurar que las habilidades se carguen solo en entornos específicos (OS, binarios, configuración)

## 🎒 Preparativos antes de comenzar

Antes de comenzar, confirma:

- [ ] Has completado [Inicio Rápido](../../start/getting-start/) y el Gateway se está ejecutando normalmente
- [ ] Has configurado al menos un modelo de IA (Anthropic, OpenAI, Ollama, etc.)
- [ ] Entiendes las operaciones básicas de línea de comandos (`mkdir`, `cp`, `rm`)

## Conceptos fundamentales

### ¿Qué es una habilidad?

Una habilidad es un directorio que contiene un archivo `SKILL.md` (instrucciones para el LLM y definiciones de herramientas), así como scripts o recursos opcionales. El archivo `SKILL.md` usa YAML frontmatter para definir metadatos y Markdown para describir el uso de la habilidad.

Clawdbot es compatible con la especificación [AgentSkills](https://agentskills.io), por lo que las habilidades pueden ser cargadas por otras herramientas que sigan esta especificación.

#### Tres ubicaciones de carga de habilidades

Las habilidades se cargan desde tres lugares, en orden de prioridad de mayor a menor:

1. **Habilidades de Workspace**: `<workspace>/skills` (prioridad más alta)
2. **Habilidades Managed/locales**: `~/.clawdbot/skills`
3. **Habilidades Bundled**: proporcionadas con el paquete de instalación (prioridad más baja)

::: info Regla de prioridad
Si existe una habilidad con el mismo nombre en múltiples ubicaciones, las habilidades de Workspace sobrescriben las habilidades Managed y Bundled.
:::

Además, puedes configurar directorios de habilidades adicionales a través de `skills.load.extraDirs` (prioridad más baja).

#### Compartición de habilidades en escenarios multi-agente

En una configuración multi-agente, cada agente tiene su propio workspace:

- **Habilidades Per-agente**: ubicadas en `<workspace>/skills`, visibles solo para ese agente
- **Habilidades compartidas**: ubicadas en `~/.clawdbot/skills`, visibles para todos los agentes en la misma máquina
- **Carpeta compartida**: se puede agregar a través de `skills.load.extraDirs` (prioridad más baja), utilizada para que varios agentes compartan el mismo paquete de habilidades

En caso de conflicto de nombres, la regla de prioridad también aplica: Workspace > Managed > Bundled.

#### Gateo de habilidades (Gating)

Clawdbot filtra las habilidades según el campo `metadata` al cargarlas, asegurando que se carguen solo cuando se cumplan las condiciones:

```markdown
---
name: nano-banana-pro
description: Generate or edit images via Gemini 3 Pro Image
metadata: {"clawdbot":{"requires":{"bins":["uv"],"env":["GEMINI_API_KEY"],"config":["browser.enabled"]},"primaryEnv":"GEMINI_API_KEY"}}
---
```

Campos bajo `metadata.clawdbot`:

- `always: true`: siempre cargar la habilidad (omitir otros gateos)
- `emoji`: emoji mostrado en la UI de habilidades de macOS
- `homepage`: enlace al sitio web mostrado en la UI de habilidades de macOS
- `os`: lista de plataformas (`darwin`, `linux`, `win32`), la habilidad solo está disponible en estos sistemas operativos
- `requires.bins`: lista, cada uno debe existir en `PATH`
- `requires.anyBins`: lista, al menos uno debe existir en `PATH`
- `requires.env`: lista, las variables de entorno deben existir o proporcionarse en la configuración
- `requires.config`: lista de rutas de `clawdbot.json`, deben ser verdaderas
- `primaryEnv`: nombre de la variable de entorno asociada con `skills.entries.<name>.apiKey`
- `install`: array de especificaciones de instalador opcionales (para UI de habilidades de macOS)

::: warning Verificación de binarios en entorno de sandbox
`requires.bins` se verifica en el **host** cuando se carga la habilidad. Si el agente se ejecuta en un sandbox, el binario también debe existir dentro del contenedor.
Se pueden instalar dependencias a través de `agents.defaults.sandbox.docker.setupCommand`.
:::

### Inyección de variables de entorno

Cuando comienza la ejecución del agente, Clawdbot:

1. Lee los metadatos de la habilidad
2. Aplica cualquier `skills.entries.<key>.env` o `skills.entries.<key>.apiKey` a `process.env`
3. Construye el prompt del sistema usando habilidades que cumplen las condiciones
4. Restaura el entorno original después de que finaliza la ejecución del agente

Esto está **limitado al alcance de la ejecución del agente**, no es el entorno global de Shell.

## Sigue estos pasos

### Paso 1: Ver las habilidades instaladas

Usa la CLI para listar las habilidades disponibles actualmente:

```bash
clawdbot skills list
```

O solo ver las habilidades que cumplen las condiciones:

```bash
clawdbot skills list --eligible
```

**Deberías ver**: lista de habilidades, incluyendo nombre, descripción, si cumple las condiciones (como binarios, variables de entorno)

### Paso 2: Instalar habilidades desde ClawdHub

ClawdHub es el registro público de habilidades de Clawdbot, donde puedes navegar, instalar, actualizar y publicar habilidades.

#### Instalar CLI

Elige un método para instalar ClawdHub CLI:

```bash
npm i -g clawdhub
```

o

```bash
pnpm add -g clawdhub
```

#### Buscar habilidades

```bash
clawdhub search "postgres backups"
```

#### Instalar habilidad

```bash
clawdhub install <skill-slug>
```

Por defecto, la CLI instala en el subdirectorio `./skills` del directorio de trabajo actual (o retrocede al workspace de Clawdbot configurado). Clawdbot lo cargará como `<workspace>/skills` en la siguiente sesión.

**Deberías ver**: salida de instalación, mostrando la carpeta de habilidad e información de versión.

### Paso 3: Actualizar habilidades instaladas

Actualizar todas las habilidades instaladas:

```bash
clawdhub update --all
```

O actualizar una habilidad específica:

```bash
clawdhub update <slug>
```

**Deberías ver**: estado de actualización de cada habilidad, incluyendo cambios de versión.

### Paso 4: Configurar sobrescritura de habilidades

En `~/.clawdbot/clawdbot.json` configura el estado de activación, variables de entorno, etc., de las habilidades:

```json5
{
  "skills": {
    "entries": {
      "nano-banana-pro": {
        "enabled": true,
        "apiKey": "GEMINI_KEY_HERE",
        "env": {
          "GEMINI_API_KEY": "GEMINI_KEY_HERE"
        },
        "config": {
          "endpoint": "https://example.invalid",
          "model": "nano-pro"
        }
      },
      "peekaboo": { "enabled": true },
      "sag": { "enabled": false }
    }
  }
}
```

**Reglas**:

- `enabled: false`: deshabilita la habilidad, incluso si es Bundled o instalada
- `env`: inyecta variables de entorno (solo cuando la variable no está configurada en el proceso)
- `apiKey`: campo conveniente para habilidades que declaran `metadata.clawdbot.primaryEnv`
- `config`: paquete de campos personalizados opcionales, las claves personalizadas deben colocarse aquí

**Deberías ver**: después de guardar la configuración, Clawdbot aplicará estas configuraciones en la siguiente ejecución del agente.

### Paso 5: Habilitar monitor de habilidades (opcional)

Por defecto, Clawdbot monitorea la carpeta de habilidades y actualiza la instantánea de habilidades cuando cambia el archivo `SKILL.md`. Puedes configurarlo en `skills.load`:

```json5
{
  "skills": {
    "load": {
      "watch": true,
      "watchDebounceMs": 250
    }
  }
}
```

**Deberías ver**: después de modificar el archivo de habilidad, sin necesidad de reiniciar el Gateway, Clawdbot actualizará automáticamente la lista de habilidades en el siguiente turno del agente.

### Paso 6: Depurar problemas de habilidades

Ver información detallada de la habilidad y dependencias faltantes:

```bash
clawdbot skills info <name>
```

Verificar el estado de dependencias de todas las habilidades:

```bash
clawdbot skills check
```

**Deberías ver**: información detallada de la habilidad, incluyendo binarios, variables de entorno, estado de configuración, y condiciones faltantes.

## Punto de control ✅

Después de completar los pasos anteriores, deberías ser capaz de:

- [ ] Usar `clawdbot skills list` para ver todas las habilidades disponibles
- [ ] Instalar nuevas habilidades desde ClawdHub
- [ ] Actualizar habilidades instaladas
- [ ] Configurar sobrescritura de habilidades en `clawdbot.json`
- [ ] Usar `skills check` para depurar problemas de dependencias de habilidades

## Advertencias comunes

### Error común 1: nombre de habilidad contiene guiones

**Problema**: usar el nombre de habilidad con guiones como clave en `skills.entries`

```json
// ❌ Error: sin comillas
{
  "skills": {
    "entries": {
      nano-banana-pro: { "enabled": true }  // Error de sintaxis JSON
    }
  }
}
```

**Corrección**: envolver la clave con comillas (JSON5 admite claves con comillas)

```json
// ✅ Correcto: con comillas
{
  "skills": {
    "entries": {
      "nano-banana-pro": { "enabled": true }
    }
  }
}
```

### Error común 2: variables de entorno en entorno de sandbox

**Problema**: la habilidad se ejecuta en sandbox, pero `skills.entries.<skill>.env` o `apiKey` no tienen efecto

**Causa**: el `env` global y `skills.entries.<skill>.env/apiKey` solo se aplican a **ejecución en host**, el sandbox no hereda el `process.env` del host.

**Corrección**: usar uno de los siguientes métodos:

```json5
{
  "agents": {
    "defaults": {
      "sandbox": {
        "docker": {
          "env": {
            "GEMINI_API_KEY": "your_key_here"
          }
        }
      }
    }
  }
}
```

O baked las variables de entorno en la imagen de sandbox personalizada.

### Error común 3: habilidad no aparece en la lista

**Problema**: habilidad instalada, pero `clawdbot skills list` no la muestra

**Posibles causas**:

1. La habilidad no cumple las condiciones de gateo (falta binarios, variables de entorno, configuración)
2. La habilidad está deshabilitada (`enabled: false`)
3. La habilidad no está en los directorios escaneados por Clawdbot

**Pasos de solución de problemas**:

```bash
# Verificar dependencias de habilidad
clawdbot skills check

# Verificar si el directorio de habilidades está siendo escaneado
ls -la ~/.clawdbot/skills/
ls -la <workspace>/skills/
```

### Error común 4: conflictos de habilidades y confusión de prioridad

**Problema**: existe una habilidad con el mismo nombre en múltiples ubicaciones, ¿cuál se carga?

**Recuerda la prioridad**:

`<workspace>/skills` (más alto) → `~/.clawdbot/skills` → bundled skills (más bajo)

Si quieres usar habilidades Bundled en lugar de sobrescritura de Workspace:

1. Eliminar o renombrar `<workspace>/skills/<skill-name>`
2. O deshabilitar esa habilidad en `skills.entries`

## Resumen de la lección

En esta lección aprendiste los conceptos fundamentales de la plataforma de habilidades de Clawdbot:

- **Tres tipos de habilidades**: Bundled, Managed, Workspace, cargadas por prioridad
- **Integración con ClawdHub**: registro público para buscar, instalar, actualizar y publicar habilidades
- **Gateo de habilidades**: filtrar habilidades por el campo `requires` de metadata
- **Configuración de sobrescritura**: controlar activación, variables de entorno y configuración personalizada en `clawdbot.json`
- **Monitor de habilidades**: actualiza automáticamente la lista de habilidades sin necesidad de reiniciar el Gateway

El sistema de habilidades es el mecanismo fundamental para extender las capacidades de Clawdbot. Dominarlo permite que tu asistente IA se adapte a más escenarios y herramientas.

## Próxima lección

> En la próxima lección aprenderemos **[Seguridad y Aislamiento de Sandbox](../security-sandbox/)**.
>
> Aprenderás:
> - Modelo de seguridad y control de permisos
> - Allowlist/denylist de permisos de herramientas
> - Mecanismo de aislamiento de sandbox de Docker
> - Configuración de seguridad de Gateway remoto

---

#### Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones de código fuente</strong></summary>

> Fecha de actualización: 2026-01-27

| Funcionalidad | Ruta del archivo | Número de línea |
|--- | --- | ---|
| Definición de tipo de configuración de habilidades | [`src/config/types.skills.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/types.skills.ts) | 1-32 |
| Documentación del sistema de habilidades | [`docs/tools/skills.md`](https://github.com/moltbot/moltbot/blob/main/docs/tools/skills.md) | 1-260 |
| Referencia de configuración de habilidades | [`docs/tools/skills-config.md`](https://github.com/moltbot/moltbot/blob/main/docs/tools/skills-config.md) | 1-76 |
| Documentación de ClawdHub | [`docs/tools/clawdhub.md`](https://github.com/moltbot/moltbot/blob/main/docs/tools/clawdhub.md) | 1-202 |
| Guía de creación de habilidades | [`docs/tools/creating-skills.md`](https://github.com/moltbot/moltbot/blob/main/docs/tools/creating-skills.md) | 1-42 |
| Comandos CLI | [`docs/cli/skills.md`](https://github.com/moltbot/moltbot/blob/main/docs/cli/skills.md) | 1-26 |

**Tipos clave**:

- `SkillConfig`: configuración de habilidad individual (enabled, apiKey, env, config)
- `SkillsLoadConfig`: configuración de carga de habilidades (extraDirs, watch, watchDebounceMs)
- `SkillsInstallConfig`: configuración de instalación de habilidades (preferBrew, nodeManager)
- `SkillsConfig`: configuración de habilidades de nivel superior (allowBundled, load, install, entries)

**Ejemplos de habilidades integradas**:

- `skills/gemini/SKILL.md`: habilidad de CLI de Gemini
- `skills/peekaboo/SKILL.md`: habilidad de automatización de UI de macOS Peekaboo

</details>
