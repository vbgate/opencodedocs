---
title: "Integración con Superpowers: Configuración de Flujos de Trabajo | opencode-agent-skills"
subtitle: "Integración con Superpowers: Configuración de Flujos de Trabajo | opencode-agent-skills"
sidebarTitle: "Habilitar Superpowers"
description: "Aprende los métodos de instalación y configuración del modo Superpowers. Habilita la guía de flujos de trabajo mediante variables de entorno, y domina las reglas de mapeo de herramientas y prioridad de espacios de nombres."
tags:
  - "Configuración avanzada"
  - "Flujo de trabajo"
  - "Superpowers"
prerequisite:
  - "start-installation"
order: 2
---

# Integración con Flujos de Trabajo Superpowers

## Qué Podrás Hacer Después de Aprender

- Comprender el valor y los escenarios aplicables de los flujos de trabajo Superpowers
- Instalar y configurar correctamente el modo Superpowers
- Entender el sistema de mapeo de herramientas y espacios de nombres de skills
- Dominar el mecanismo de inyección automática de Superpowers durante la recuperación por compresión

## Tu Situación Actual

Es posible que estés considerando estos problemas:

- **Flujos de trabajo no estandarizados**: Los hábitos de desarrollo del equipo no están unificados, y la calidad del código varía
- **Falta de procesos estrictos**: Aunque tienes una biblioteca de skills, el asistente de IA no tiene una guía de procesos clara
- **Llamadas a herramientas caóticas**: Las herramientas definidas por Superpowers tienen nombres diferentes a las herramientas nativas de OpenCode, lo que causa fallos en las llamadas
- **Alto costo de migración**: Ya estás usando Superpowers y te preocupa que después de cambiar a OpenCode necesites reconfigurar todo

Estos problemas afectan la eficiencia de desarrollo y la calidad del código.

## Idea Central

::: info ¿Qué es Superpowers?
Superpowers es un marco completo de flujos de trabajo de desarrollo de software que proporciona una guía estricta de procesos mediante skills composicionales. Define pasos de desarrollo estandarizados, métodos de llamadas a herramientas y un sistema de espacios de nombres.
:::

**OpenCode Agent Skills ofrece una integración fluida con Superpowers**, que al habilitarse mediante variables de entorno, inyecta automáticamente la guía completa del flujo de trabajo, incluyendo:

1. **Contenido de la skill using-superpowers**: Instrucciones centrales del flujo de trabajo Superpowers
2. **Mapeo de herramientas**: Mapea los nombres de herramientas definidos por Superpowers a las herramientas nativas de OpenCode
3. **Espacios de nombres de skills**: Define claramente la prioridad y la forma de referencia de las skills

## 🎒 Preparativos Antes de Empezar

Antes de comenzar, asegúrate de:

::: warning Verificación previa
- ✅ Ha instalado el [plugin opencode-agent-skills](../../start/installation/)
- ✅ Está familiarizado con el mecanismo básico de descubrimiento de skills
:::

## Sígueme

### Paso 1: Instalar Superpowers

**Por qué**
Necesitas instalar el proyecto Superpowers primero para que este plugin pueda descubrir la skill `using-superpowers`.

**Cómo hacerlo**

Según tus necesidades, elige cualquiera de las siguientes formas de instalar Superpowers:

::: code-group

```bash [Como plugin de Claude Code]
// Instala siguiendo la documentación oficial de Superpowers
// https://github.com/obra/superpowers
// La skill se ubicará automáticamente en ~/.claude/plugins/...
```

```bash [Como skill de OpenCode]
// Instala manualmente como skill de OpenCode
mkdir -p ~/.config/opencode/skills
git clone https://github.com/obra/superpowers ~/.config/opencode/skills/superpowers
// La skill se ubicará en .opencode/skills/superpowers/ (nivel proyecto) o ~/.config/opencode/skills/superpowers/ (nivel usuario)
```

:::

**Lo que deberías ver**:
- Después de la instalación, el directorio de skills de Superpowers contiene el archivo `using-superpowers/SKILL.md`

### Paso 2: Habilitar el modo Superpowers

**Por qué**
Mediante una variable de entorno, le dices al plugin que habilite el modo Superpowers, y el plugin inyectará automáticamente el contenido relevante al inicializar la sesión.

**Cómo hacerlo**

Habilitar temporalmente (solo sesión de terminal actual):

```bash
export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true
opencode
```

Habilitar permanentemente (agregar al archivo de configuración de Shell):

::: code-group

```bash [Bash (~/.bashrc o ~/.bash_profile)]
echo 'export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true' >> ~/.bashrc
source ~/.bashrc
```

```zsh [Zsh (~/.zshrc)]
echo 'export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true' >> ~/.zshrc
source ~/.zshrc
```

```powershell [PowerShell (~/.config/powershell/Microsoft.PowerShell_profile.ps1)]
[System.Environment]::SetEnvironmentVariable('OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE', 'true', 'User')
```

:::

**Lo que deberías ver**:
- Al ingresar `echo $OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE` muestra `true`

### Paso 3: Verificar la inyección automática

**Por qué**
Confirmar que el plugin reconoce correctamente la skill Superpowers e inyecta automáticamente el contenido al comenzar una nueva sesión.

**Cómo hacerlo**

1. Reiniciar OpenCode
2. Crear una nueva sesión
3. En la nueva sesión, ingresa cualquier mensaje (como "hola")
4. Ver el contexto de la sesión (si OpenCode lo soporta)

**Lo que deberías ver**:
- El plugin automáticamente ha inyectado lo siguiente en segundo plano (formateado como XML):

```xml
<EXTREMELY_IMPORTANT>
You have superpowers.

**IMPORTANT: The using-superpowers skill content is included below. It is ALREADY LOADED - do not call use_skill for it again. Use use_skill only for OTHER skills.**

[using-superpowers skill content...]

**Tool Mapping for OpenCode:**
- `TodoWrite` → `todowrite`
- `Task` tool with subagents → Use `task` tool with `subagent_type`
- `Skill` tool → `use_skill`
- `Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`, `WebFetch` → Use native lowercase OpenCode tools

**Skill namespace priority:**
1. Project: `project:skill-name`
2. Claude project: `claude-project:skill-name`
3. User: `skill-name`
4. Claude user: `claude-user:skill-name`
5. Marketplace: `claude-plugins:skill-name`

The first discovered match wins.
</EXTREMELY_IMPORTANT>
```

## Punto de Control ✅

Después de completar los pasos anteriores, verifica lo siguiente:

| Elemento de verificación | Resultado esperado |
|--- | ---|
| Variable de entorno configurada correctamente | `echo $OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE` muestra `true` |
| Skill Superpowers descubrible | Al llamar a `get_available_skills()` se puede ver `using-superpowers` |
| Inyección automática en nueva sesión | Después de crear una nueva sesión, la IA sabe que tiene superpowers |

## Advertencias sobre Problemas Comunes

### ❌ Error 1: La skill no fue descubierta

**Síntoma**: Se habilitó la variable de entorno, pero el plugin no inyectó el contenido de Superpowers.

**Causa**: La ubicación de instalación de Superpowers no está en la ruta de descubrimiento de skills.

**Solución**:
- Confirma que Superpowers está instalado en cualquiera de las siguientes ubicaciones:
  - `.claude/plugins/...` (caché de plugins de Claude Code)
  - `.opencode/skills/...` (directorio de skills de OpenCode)
  - `~/.config/opencode/skills/...` (skills de usuario de OpenCode)
  - `~/.claude/skills/...` (skills de usuario de Claude)
- Ejecuta `get_available_skills()` para verificar que `using-superpowers` esté en la lista

### ❌ Error 2: Fallo en la llamada a herramientas

**Síntoma**: La IA intenta llamar a las herramientas `TodoWrite` o `Skill`, pero se indica que la herramienta no existe.

**Causa**: La IA no aplicó el mapeo de herramientas y todavía está usando los nombres definidos por Superpowers.

**Solución**:
- El plugin inyectará automáticamente el mapeo de herramientas, asegúrate de que la etiqueta `<EXTREMELY_IMPORTANT>` se haya inyectado correctamente
- Si el problema persiste, verifica si la sesión se creó después de habilitar la variable de entorno

### ❌ Error 3: Superpowers desaparece después de la compresión

**Síntoma**: Después de una sesión larga, la IA ya no sigue el flujo de trabajo Superpowers.

**Causa**: La compresión del contexto causó que el contenido inyectado anteriormente se limpiara.

**Solución**:
- El plugin volverá a inyectar automáticamente el contenido de Superpowers después del evento `session.compacted`
- Si el problema persiste, verifica que el plugin esté escuchando correctamente el evento

## Detalle del Mapeo de Herramientas

El plugin inyectará automáticamente el siguiente mapeo de herramientas para ayudar a la IA a llamar correctamente a las herramientas de OpenCode:

| Herramienta Superpowers | Herramienta OpenCode | Descripción |
|--- | --- | ---|
| `TodoWrite` | `todowrite` | Herramienta de escritura de Todo |
| `Task` (con subagents) | `task` + `subagent_type` | Llamada a subagente |
| `Skill` | `use_skill` | Cargar skill |
| `Read` / `Write` / `Edit` | Herramientas nativas en minúsculas | Operaciones de archivos |
| `Bash` / `Glob` / `Grep` / `WebFetch` | Herramientas nativas en minúsculas | Operaciones del sistema |

::: tip ¿Por qué se necesita el mapeo de herramientas?
El diseño nativo de Superpowers se basa en Claude Code, y los nombres de las herramientas no coinciden con los de OpenCode. A través del mapeo automático, la IA puede usar sin problemas las herramientas nativas de OpenCode sin necesidad de conversión manual.
:::

## Prioridad de Espacios de Nombres de Skills

Cuando existen habilidades con el mismo nombre de múltiples fuentes, el plugin elige según la siguiente prioridad:

```
1. project:skill-name         (skills de OpenCode a nivel proyecto)
2. claude-project:skill-name  (skills de Claude a nivel proyecto)
3. skill-name                (skills de OpenCode a nivel usuario)
4. claude-user:skill-name    (skills de Claude a nivel usuario)
5. claude-plugins:skill-name (skills del marketplace de plugins)
```

::: info Referencia de espacios de nombres
Puedes especificar explícitamente el espacio de nombres: `use_skill("project:my-skill")`  
O dejar que el plugin haga coincidir automáticamente: `use_skill("my-skill")`
:::

**El primer match descubierto tiene efecto**, las habilidades subsiguientes con el mismo nombre se ignoran. Esto permite que las habilidades a nivel proyecto sobrescriban las habilidades a nivel usuario.

## Mecanismo de Recuperación por Compresión

En sesiones largas, OpenCode realiza la compresión del contexto para ahorrar tokens. El plugin asegura que Superpowers siga disponible a través del siguiente mecanismo:

1. **Escuchar eventos**: El plugin escucha el evento `session.compacted`
2. **Reinyectar**: Después de completar la compresión, vuelve a inyectar automáticamente el contenido de Superpowers
3. **Cambio transparente**: La guía del flujo de trabajo de la IA siempre existe y no se interrumpirá debido a la compresión

## Resumen de Esta Lección

La integración con Superpowers proporciona una guía estricta de flujos de trabajo. Los puntos clave son:

- **Instalar Superpowers**: Elige cualquiera de las formas: plugin de Claude Code o skill de OpenCode
- **Habilitar variable de entorno**: Establecer `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true`
- **Inyección automática**: El plugin inyecta automáticamente el contenido al inicializar la sesión y después de la compresión
- **Mapeo de herramientas**: Mapea automáticamente los nombres de herramientas Superpowers a las herramientas nativas de OpenCode
- **Prioridad de espacios de nombres**: Las habilidades a nivel proyecto tienen prioridad sobre las habilidades a nivel usuario

## Próxima Lección

> En la próxima lección aprenderemos **[Espacios de Nombres y Prioridad de Skills](../namespaces-and-priority/)**.
>
> Aprenderás:
> - Entender el sistema de espacios de nombres de las habilidades y las reglas de prioridad de descubrimiento
> - Dominar cómo usar espacios de nombres para especificar explícitamente la fuente de una skill
> - Conocer los mecanismos de sobrescritura y manejo de conflictos para habilidades con el mismo nombre

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Función | Ruta del archivo | Número de línea |
|--- | --- | ---|
| Módulo de integración Superpowers | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L1-L59) | 1-59 |
| Definición de mapeo de herramientas | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L12-L16) | 12-16 |
| Definición de espacios de nombres de skills | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L18-L25) | 18-25 |
| Función de inyección de contenido Superpowers | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L31-L58) | 31-58 |
| Verificación de variable de entorno | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L37) | 37 |
| Llamada de inyección al inicializar sesión | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L101) | 101 |
| Reinyección después de compresión | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L148) | 148 |

**Constantes clave**:
- `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE`: Variable de entorno, establecer en `'true'` para habilitar el modo Superpowers

**Funciones clave**:
- `maybeInjectSuperpowersBootstrap()`: Verifica la variable de entorno y la existencia de la skill, inyecta el contenido de Superpowers
- `discoverAllSkills()`: Descubre todas las skills disponibles (usado para buscar `using-superpowers`)
- `injectSyntheticContent()`: Inyecta el contenido en la sesión en forma de mensaje sintético

</details>
