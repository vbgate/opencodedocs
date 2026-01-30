---
title: "Preguntas frecuentes: Modo ultrawork | oh-my-opencode"
subtitle: "Respuestas a preguntas frecuentes"
sidebarTitle: "¿Qué hacer ante problemas?"
description: "Aprende las respuestas a preguntas frecuentes sobre oh-my-opencode. Incluye modo ultrawork, colaboración multi-agente, tareas en segundo plano, Ralph Loop y solución de problemas de configuración."
tags:
  - "faq"
  - "solución de problemas"
  - "instalación"
  - "configuración"
order: 160
---

# Preguntas frecuentes

## Lo que aprenderás

Después de leer este FAQ, podrás:

- Encontrar rápidamente soluciones a problemas de instalación y configuración
- Entender cómo usar correctamente el modo ultrawork
- Dominar las mejores prácticas para invocar agentes
- Comprender los límites y restricciones de compatibilidad con Claude Code
- Evitar trampas comunes de seguridad y rendimiento

---

## Instalación y configuración

### ¿Cómo instalar oh-my-opencode?

**La forma más sencilla**: Deja que un agente de IA lo instale por ti.

Envía el siguiente prompt a tu agente LLM (Claude Code, AmpCode, Cursor, etc.):

```
Install and configure oh-my-opencode by following the instructions here:
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```

**Instalación manual**: Consulta la [Guía de instalación](../start/installation/).

::: tip ¿Por qué se recomienda que un agente de IA lo instale?
Los humanos tienden a cometer errores al configurar el formato JSONC (como olvidar comillas o colocar mal los dos puntos). Dejar que un agente de IA lo maneje evita errores de sintaxis comunes.
:::

### ¿Cómo desinstalar oh-my-opencode?

Limpieza en tres pasos:

**Paso 1**: Eliminar el plugin de la configuración de OpenCode

Edita `~/.config/opencode/opencode.json` (u `opencode.jsonc`) y elimina `"oh-my-opencode"` del array `plugin`.

```bash
# Eliminar automáticamente usando jq
jq '.plugin = [.plugin[] | select(. != "oh-my-opencode")]' \
    ~/.config/opencode/opencode.json > /tmp/oc.json && \
    mv /tmp/oc.json ~/.config/opencode/opencode.json
```

**Paso 2**: Eliminar archivos de configuración (opcional)

```bash
# Eliminar configuración de usuario
rm -f ~/.config/opencode/oh-my-opencode.json

# Eliminar configuración de proyecto (si existe)
rm -f .opencode/oh-my-opencode.json
```

**Paso 3**: Verificar la eliminación

```bash
opencode --version
# El plugin ya no debería cargarse
```

### ¿Dónde están los archivos de configuración?

Los archivos de configuración tienen dos niveles:

| Nivel | Ubicación | Propósito | Prioridad |
| --- | --- | --- | --- |
| Proyecto | `.opencode/oh-my-opencode.json` | Configuración específica del proyecto | Baja |
| Usuario | `~/.config/opencode/oh-my-opencode.json` | Configuración global predeterminada | Alta |

**Regla de fusión**: La configuración de usuario sobrescribe la configuración de proyecto.

Los archivos de configuración soportan formato JSONC (JSON con comentarios), puedes agregar comentarios y comas finales:

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/assets/oh-my-opencode.schema.json",
  // Esto es un comentario
  "disabled_agents": [], // Puede tener coma final
  "agents": {}
}
```

### ¿Cómo deshabilitar una función específica?

Usa los arrays `disabled_*` en el archivo de configuración:

```json
{
  "disabled_agents": ["oracle", "librarian"],
  "disabled_skills": ["playwright"],
  "disabled_hooks": ["comment-checker", "auto-update-checker"],
  "disabled_mcps": ["websearch"]
}
```

**Interruptores de compatibilidad con Claude Code**:

```json
{
  "claude_code": {
    "mcp": false,        // Deshabilitar MCP de Claude Code
    "commands": false,    // Deshabilitar Commands de Claude Code
    "skills": false,      // Deshabilitar Skills de Claude Code
    "hooks": false        // Deshabilitar hooks de settings.json
  }
}
```

---

## Uso

### ¿Qué es ultrawork?

**ultrawork** (o abreviado `ulw`) es la palabra mágica—inclúyela en tu prompt y todas las funciones se activarán automáticamente:

- ✅ Tareas en segundo plano paralelas
- ✅ Todos los agentes especializados (Sisyphus, Oracle, Librarian, Explore, Prometheus, etc.)
- ✅ Modo de exploración profunda
- ✅ Mecanismo de completado forzado de Todo

**Ejemplo de uso**:

```
ultrawork desarrollar una REST API con autenticación JWT y gestión de usuarios
```

O más breve:

```
ulw refactorizar este módulo
```

::: info Cómo funciona
El Hook `keyword-detector` detecta las palabras clave `ultrawork` o `ulw`, luego establece `message.variant` a un valor especial, activando todas las funciones avanzadas.
:::

### ¿Cómo invocar un agente específico?

**Método 1: Usar el símbolo @**

```
Ask @oracle to review this design and propose an architecture
Ask @librarian how this is implemented - why does behavior keep changing?
Ask @explore for policy on this feature
```

**Método 2: Usar la herramienta delegate_task**

```
delegate_task(agent="oracle", prompt="Review this architecture design")
delegate_task(agent="librarian", prompt="Find implementation examples of JWT auth")
```

**Restricciones de permisos de agentes**:

| Agente | Puede escribir código | Puede ejecutar Bash | Puede delegar tareas | Descripción |
| --- | --- | --- | --- | --- |
| Sisyphus | ✅ | ✅ | ✅ | Orquestador principal |
| Oracle | ❌ | ❌ | ❌ | Asesor de solo lectura |
| Librarian | ❌ | ❌ | ❌ | Investigación de solo lectura |
| Explore | ❌ | ❌ | ❌ | Búsqueda de solo lectura |
| Multimodal Looker | ❌ | ❌ | ❌ | Análisis de medios de solo lectura |
| Prometheus | ✅ | ✅ | ✅ | Planificador |

### ¿Cómo funcionan las tareas en segundo plano?

Las tareas en segundo plano te permiten trabajar como un equipo de desarrollo real, con múltiples agentes de IA trabajando en paralelo:

**Iniciar una tarea en segundo plano**:

```
delegate_task(agent="explore", background=true, prompt="Find auth implementations")
```

**Continúa trabajando...**

**El sistema notifica automáticamente cuando termina** (a través del Hook `background-notification`)

**Obtener resultados**:

```
background_output(task_id="bg_abc123")
```

**Control de concurrencia**:

```json
{
  "background_task": {
    "defaultConcurrency": 3,
    "providerConcurrency": {
      "anthropic": 2,
      "openai": 3
    },
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 1,
      "openai/gpt-5.2": 2
    }
  }
}
```

**Prioridad**: `modelConcurrency` > `providerConcurrency` > `defaultConcurrency`

::: tip ¿Por qué es necesario el control de concurrencia?
Para evitar limitación de tasa de API y costos descontrolados. Por ejemplo, Claude Opus 4.5 tiene alto costo, así que se limita su concurrencia; mientras que Haiku tiene bajo costo, permitiendo mayor concurrencia.
:::

### ¿Cómo usar Ralph Loop?

**Ralph Loop** es un ciclo de desarrollo auto-referencial—trabaja continuamente hasta completar la tarea.

**Iniciar**:

```
/ralph-loop "Build a REST API with authentication"
/ralph-loop "Refactor the payment module" --max-iterations=50
```

**Cómo determina la finalización**: El agente emite la marca `<promise>DONE</promise>`.

**Cancelar el ciclo**:

```
/cancel-ralph
```

**Configuración**:

```json
{
  "ralph_loop": {
    "enabled": true,
    "default_max_iterations": 100
  }
}
```

::: tip Diferencia con ultrawork
`/ralph-loop` es modo normal, `/ulw-loop` es modo ultrawork (todas las funciones avanzadas activadas).
:::

### ¿Qué son Categories y Skills?

**Categories** (nuevo en v3.0): Capa de abstracción de modelos que selecciona automáticamente el modelo óptimo según el tipo de tarea.

**Categories integradas**:

| Category | Modelo predeterminado | Temperature | Caso de uso |
| --- | --- | --- | --- |
| visual-engineering | google/gemini-3-pro | 0.7 | Frontend, UI/UX, diseño |
| ultrabrain | openai/gpt-5.2-codex | 0.1 | Tareas de razonamiento de alto nivel |
| artistry | google/gemini-3-pro | 0.7 | Tareas creativas y artísticas |
| quick | anthropic/claude-haiku-4-5 | 0.1 | Tareas rápidas y de bajo costo |
| writing | google/gemini-3-flash | 0.1 | Documentación y escritura |

**Skills**: Módulos de conocimiento especializado que inyectan mejores prácticas de dominios específicos.

**Skills integradas**:

| Skill | Condición de activación | Descripción |
| --- | --- | --- |
| playwright | Tareas relacionadas con navegador | Automatización de navegador con Playwright MCP |
| frontend-ui-ux | Tareas de UI/UX | De diseñador a desarrollador, creando interfaces atractivas |
| git-master | Operaciones Git (commit, rebase, squash) | Experto en Git, commits atómicos, búsqueda en historial |

**Ejemplo de uso**:

```
delegate_task(category="visual", skills=["frontend-ui-ux"], prompt="Diseñar la UI de esta página")
delegate_task(category="quick", skills=["git-master"], prompt="Hacer commit de estos cambios")
```

::: info Ventajas
Categories optimizan costos (usando modelos más económicos), Skills aseguran calidad (inyectando conocimiento especializado).
:::

---

## Compatibilidad con Claude Code

### ¿Puedo usar la configuración de Claude Code?

**Sí**, oh-my-opencode proporciona una **capa de compatibilidad completa**:

**Tipos de configuración soportados**:

| Tipo | Ubicación de carga | Prioridad |
| --- | --- | --- |
| Commands | `~/.claude/commands/`, `.claude/commands/` | Baja |
| Skills | `~/.claude/skills/*/SKILL.md`, `.claude/skills/*/SKILL.md` | Media |
| Agents | `~/.claude/agents/*.md`, `.claude/agents/*.md` | Alta |
| MCPs | `~/.claude/.mcp.json`, `.claude/.mcp.json` | Alta |
| Hooks | `~/.claude/settings.json`, `.claude/settings.json` | Alta |

**Prioridad de carga de configuración**:

Configuración de proyecto OpenCode > Configuración de usuario Claude Code

```json
{
  "claude_code": {
    "plugins_override": {
      "claude-mem@thedotmack": false  // Deshabilitar plugin específico
    }
  }
}
```

### ¿Puedo usar la suscripción de Claude Code?

**Técnicamente posible, pero no recomendado**.

::: warning Restricciones de acceso OAuth de Claude
A partir de enero de 2026, Anthropic ha restringido el acceso OAuth de terceros, citando violación de ToS.
:::

**Declaración oficial** (del README):

> Existen algunas herramientas comunitarias que falsifican firmas de solicitudes OAuth de Claude Code. Estas herramientas pueden ser técnicamente indetectables, pero los usuarios deben conocer las implicaciones de ToS, y personalmente no recomiendo usarlas.
>
> **Este proyecto no es responsable de ningún problema derivado del uso de herramientas no oficiales, no hemos implementado estos sistemas OAuth de forma personalizada.**

**Solución recomendada**: Usa tus suscripciones existentes de proveedores de IA (Claude, OpenAI, Gemini, etc.).

### ¿Son compatibles los datos?

**Sí**, el formato de almacenamiento de datos es compatible:

| Datos | Ubicación | Formato | Compatibilidad |
| --- | --- | --- | --- |
| Todos | `~/.claude/todos/` | JSON | ✅ Compatible con Claude Code |
| Transcripts | `~/.claude/transcripts/` | JSONL | ✅ Compatible con Claude Code |

Puedes cambiar sin problemas entre Claude Code y oh-my-opencode.

---

## Seguridad y rendimiento

### ¿Hay advertencias de seguridad?

**Sí**, hay una advertencia clara en la parte superior del README:

::: danger Advertencia: Sitios impostores
**ohmyopencode.com no está afiliado a este proyecto.** No operamos ni respaldamos ese sitio web.
>
> OhMyOpenCode es **gratuito y de código abierto**. No descargues instaladores ni ingreses información de pago en sitios de terceros que afirmen ser "oficiales".
>
> Dado que el sitio impostor está detrás de un muro de pago, **no podemos verificar lo que distribuyen**. Trata cualquier descarga de allí como **potencialmente insegura**.
>
> ✅ Descarga oficial: https://github.com/code-yeongyu/oh-my-opencode/releases
:::

### ¿Cómo optimizar el rendimiento?

**Estrategia 1: Usar el modelo adecuado**

- Tareas rápidas → Usar category `quick` (modelo Haiku)
- Diseño UI → Usar category `visual` (Gemini 3 Pro)
- Razonamiento complejo → Usar category `ultrabrain` (GPT 5.2)

**Estrategia 2: Habilitar control de concurrencia**

```json
{
  "background_task": {
    "providerConcurrency": {
      "anthropic": 2,  // Limitar concurrencia de Anthropic
      "openai": 5       // Aumentar concurrencia de OpenAI
    }
  }
}
```

**Estrategia 3: Usar tareas en segundo plano**

Deja que modelos ligeros (como Haiku) recopilen información en segundo plano, mientras el agente principal (Opus) se enfoca en la lógica central.

**Estrategia 4: Deshabilitar funciones innecesarias**

```json
{
  "disabled_hooks": ["comment-checker", "auto-update-checker"],
  "claude_code": {
    "hooks": false  // Deshabilitar hooks de Claude Code (si no los usas)
  }
}
```

### ¿Requisitos de versión de OpenCode?

**Recomendado**: OpenCode >= 1.0.132

::: warning Bug en versiones antiguas
Si usas la versión 1.0.132 o anterior, un bug de OpenCode podría corromper la configuración.
>
> La corrección se fusionó después de 1.0.132—usa una versión más reciente.
:::

Verificar versión:

```bash
opencode --version
```

---

## Solución de problemas

### ¿El agente no funciona?

**Lista de verificación**:

1. ✅ Verificar que el formato del archivo de configuración sea correcto (sintaxis JSONC)
2. ✅ Comprobar la configuración del Provider (¿es válida la API Key?)
3. ✅ Ejecutar herramienta de diagnóstico: `oh-my-opencode doctor --verbose`
4. ✅ Revisar mensajes de error en los logs de OpenCode

**Problemas comunes**:

| Problema | Causa | Solución |
| --- | --- | --- |
| El agente rechaza la tarea | Configuración de permisos incorrecta | Verificar configuración de `agents.permission` |
| Timeout en tarea en segundo plano | Límite de concurrencia muy estricto | Aumentar `providerConcurrency` |
| Error en bloque de pensamiento | El modelo no soporta thinking | Cambiar a un modelo que soporte thinking |

### ¿El archivo de configuración no tiene efecto?

**Posibles causas**:

1. Error de sintaxis JSON (olvidar comillas, comas)
2. Ubicación incorrecta del archivo de configuración
3. La configuración de usuario no sobrescribe la configuración de proyecto

**Pasos de verificación**:

```bash
# Verificar si existe el archivo de configuración
ls -la ~/.config/opencode/oh-my-opencode.json
ls -la .opencode/oh-my-opencode.json

# Validar sintaxis JSON
cat ~/.config/opencode/oh-my-opencode.json | jq .
```

**Usar validación de JSON Schema**:

Agrega el campo `$schema` al inicio del archivo de configuración, el editor mostrará errores automáticamente:

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/assets/oh-my-opencode.schema.json"
}
```

### ¿La tarea en segundo plano no se completa?

**Lista de verificación**:

1. ✅ Ver estado de la tarea: `background_output(task_id="...")`
2. ✅ Verificar límite de concurrencia: ¿hay slots de concurrencia disponibles?
3. ✅ Revisar logs: ¿hay errores de limitación de tasa de API?

**Forzar cancelación de tarea**:

```javascript
background_cancel(task_id="bg_abc123")
```

**TTL de tareas**: Las tareas en segundo plano se limpian automáticamente después de 30 minutos.

---

## Más recursos

### ¿Dónde buscar ayuda?

- **GitHub Issues**: https://github.com/code-yeongyu/oh-my-opencode/issues
- **Comunidad Discord**: https://discord.gg/PUwSMR9XNk
- **X (Twitter)**: https://x.com/justsisyphus

### Orden de lectura recomendado

Si eres principiante, se recomienda leer en el siguiente orden:

1. [Instalación y configuración rápida](../start/installation/)
2. [Conociendo a Sisyphus: El orquestador principal](../start/sisyphus-orchestrator/)
3. [Modo Ultrawork](../start/ultrawork-mode/)
4. [Diagnóstico de configuración y solución de problemas](../troubleshooting/)

### Contribuir código

¡Los Pull Requests son bienvenidos! El 99% del código del proyecto fue construido usando OpenCode.

Si quieres mejorar alguna función o corregir un bug, por favor:

1. Haz fork del repositorio
2. Crea una rama de características
3. Haz commit de los cambios
4. Haz push a la rama
5. Crea un Pull Request

---

## Resumen de la lección

Este FAQ cubre las preguntas frecuentes sobre oh-my-opencode, incluyendo:

- **Instalación y configuración**: Cómo instalar, desinstalar, ubicación de archivos de configuración, deshabilitar funciones
- **Consejos de uso**: Modo ultrawork, invocación de agentes, tareas en segundo plano, Ralph Loop, Categories y Skills
- **Compatibilidad con Claude Code**: Carga de configuración, restricciones de uso de suscripción, compatibilidad de datos
- **Seguridad y rendimiento**: Advertencias de seguridad, estrategias de optimización de rendimiento, requisitos de versión
- **Solución de problemas**: Problemas comunes y soluciones

Recuerda estos puntos clave:

- Usa las palabras clave `ultrawork` o `ulw` para activar todas las funciones
- Deja que modelos ligeros recopilen información en segundo plano, mientras el agente principal se enfoca en la lógica central
- Los archivos de configuración soportan formato JSONC, puedes agregar comentarios
- La configuración de Claude Code se puede cargar sin problemas, pero el acceso OAuth tiene restricciones
- Descarga desde el repositorio oficial de GitHub, ten cuidado con sitios impostores

## Próxima lección

> Si encuentras problemas específicos de configuración durante el uso, puedes consultar **[Diagnóstico de configuración y solución de problemas](../troubleshooting/)**.
>
> Aprenderás:
> - Cómo usar herramientas de diagnóstico para verificar la configuración
> - Significado de códigos de error comunes y métodos de solución
> - Técnicas de depuración para problemas de configuración de Provider
> - Sugerencias para localizar y optimizar problemas de rendimiento

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir ubicaciones del código fuente</strong></summary>

> Actualizado: 2026-01-26

| Característica | Ruta del archivo | Números de línea |
| --- | --- | --- |
| Keyword Detector (detección de ultrawork) | [`src/hooks/keyword-detector/`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/) | Directorio completo |
| Background Task Manager | [`src/features/background-agent/manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/manager.ts) | 1-1377 |
| Concurrency Control | [`src/features/background-agent/concurrency.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/concurrency.ts) | Archivo completo |
| Ralph Loop | [`src/hooks/ralph-loop/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/ralph-loop/index.ts) | Archivo completo |
| Delegate Task (análisis de Category y Skill) | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 1-1070 |
| Config Schema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | Archivo completo |
| Claude Code Hooks | [`src/hooks/claude-code-hooks/`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/) | Directorio completo |

**Constantes clave**:
- `DEFAULT_MAX_ITERATIONS = 100`: Número máximo de iteraciones predeterminado de Ralph Loop
- `TASK_TTL_MS = 30 * 60 * 1000`: TTL de tareas en segundo plano (30 minutos)
- `POLL_INTERVAL_MS = 2000`: Intervalo de sondeo de tareas en segundo plano (2 segundos)

**Configuraciones clave**:
- `disabled_agents`: Lista de agentes deshabilitados
- `disabled_skills`: Lista de skills deshabilitadas
- `disabled_hooks`: Lista de hooks deshabilitados
- `claude_code`: Configuración de compatibilidad con Claude Code
- `background_task`: Configuración de concurrencia de tareas en segundo plano
- `categories`: Configuración personalizada de Category
- `agents`: Configuración de sobrescritura de agentes

</details>
