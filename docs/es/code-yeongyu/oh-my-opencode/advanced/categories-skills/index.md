### Categories: El tipo de tarea determina el modelo

oh-my-opencode proporciona 7 Categories integradas, cada una preconfigurada con el modelo óptimo y modo de pensamiento:

| Category | Modelo predeterminado | Temperature | Uso |
|--- | --- | --- | ---|
| `visual-engineering` | `google/gemini-3-pro` | 0.7 | Tareas de frontend, UI/UX, diseño |
| `ultrabrain` | `openai/gpt-5.2-codex` (xhigh) | 0.1 | Tareas de razonamiento de alto CI (decisiones complejas de arquitectura) |
| `artistry` | `google/gemini-3-pro` (max) | 0.7 | Tareas creativas y artísticas (ideas novedosas) |
| `quick` | `anthropic/claude-haiku-4-5` | 0.1 | Tareas rápidas, de bajo costo (modificaciones de un solo archivo) |
| `unspecified-low` | `anthropic/claude-sonnet-4-5` | 0.1 | Tareas medias que no coinciden con otras categorías |
| `unspecified-high` | `anthropic/claude-opus-4-5` (max) | 0.1 | Tareas de alta calidad que no coinciden con otras categorías |
| `writing` | `google/gemini-3-flash` | 0.1 | Tareas de documentación y escritura |

**¿Por qué se necesitan Categories?**

Diferentes tareas requieren modelos con diferentes capacidades:
- Diseño de UI → necesita **creatividad visual** (Gemini 3 Pro)
- Decisiones de arquitectura → necesita **razonamiento profundo** (GPT-5.2 Codex xhigh)
- Modificaciones simples → necesita **respuesta rápida** (Claude Haiku)

Seleccionar manualmente el modelo para cada tarea es tedioso, Categories te permite simplemente declarar el tipo de tarea y el sistema selecciona automáticamente el modelo óptimo.

### Skills: Inyectar conocimientos especializados

Skill es un experto en dominios definido a través de archivos SKILL.md, puede inyectar:
- **Conocimientos especializados** (extensión de prompts)
- **Servidores MCP** (carga automática)
- **Guías de flujo de trabajo** (pasos de operación específicos)

4 Skills integrados:

| Skill | Función | MCP | Uso |
|--- | --- | --- | ---|
| `playwright` | Automatización de navegador | `@playwright/mcp` | Verificación de UI, capturas de pantalla, web scraping |
| `agent-browser` | Automatización de navegador (Vercel) | Instalación manual | Lo mismo, alternativa |
| `frontend-ui-ux` | Mentalidad de diseñador | Ninguno | Crear interfaces exquisitas |
| `git-master` | Experto en Git | Ninguno | Commits automáticos, búsqueda de historial, rebase |

**Cómo funciona un Skill**:

Cuando cargas un Skill, el sistema:
1. Lee el contenido del prompt del archivo SKILL.md
2. Si se define MCP, inicia automáticamente el servidor correspondiente
3. Agrega el prompt del Skill al prompt del sistema del agente

Por ejemplo, el Skill `git-master` incluye:
- Detección de estilo de commit (identifica automáticamente el formato de commit del proyecto)
- Reglas de commits atómicos (3 archivos → mínimo 2 commits)
- Flujo de trabajo Rebase (squash, fixup, manejo de conflictos)
- Búsqueda de historial (blame, bisect, log -S)

### Sisyphus Junior: Ejecutor de tareas

Cuando usas Category, se genera un subagente especial—**Sisyphus Junior**.

**Características clave**:
- ✅ Hereda la configuración del modelo de Category
- ✅ Hereda los prompts de Skills cargados
- ❌ **No puede delegar nuevamente** (prohibido usar herramientas `task` y `delegate_task`)

**¿Por qué se prohíbe la delegación nuevamente?**

Para prevenir bucles infinitos y divergencia de tareas:
```
Sisyphus (agente principal)
  ↓ delegate_task(category="quick")
Sisyphus Junior
  ↓ Intenta delegate_task (si se permite)
Sisyphus Junior 2
  ↓ delegate_task
...bucle infinito...
```

Al prohibir la delegación nuevamente, Sisyphus Junior se enfoca en completar la tarea asignada, asegurando que el objetivo sea claro y la ejecución eficiente.

## Sígueme

### Paso 1: Correcciones rápidas (Quick + Git Master)

Usemos un escenario real: has modificado algunos archivos y necesitas hacer commits automáticamente siguiendo el estilo del proyecto.

**Por qué**
Usar el modelo Haiku de Category `quick` es de bajo costo, combinado con el Skill `git-master` que detecta automáticamente el estilo de commit, logrando commits perfectos.

En OpenCode ingresa:

```
Usa delegate_task para hacer commit de los cambios actuales
- category: quick
- load_skills: ["git-master"]
- prompt: "Haz commit de todos los cambios actuales. Sigue el estilo de commit del proyecto (detectado a través de git log). Asegura commits atómicos, máximo 3 archivos por commit."
- run_in_background: false
```

**Deberías ver**:

1. Sisyphus Junior inicia, usando el modelo `claude-haiku-4-5`
2. El Skill `git-master` se carga, el prompt contiene conocimientos de experto en Git
3. El agente ejecuta las siguientes operaciones:
   ```bash
   # Recopilar contexto en paralelo
   git status
   git diff --stat
   git log -30 --oneline
   ```
4. Detecta el estilo de commit (como Semantic vs Plain vs Short)
5. Planifica commits atómicos (3 archivos → mínimo 2 commits)
6. Ejecuta commits, siguiendo el estilo detectado

**Punto de control ✅**:

Verifica si el commit fue exitoso:
```bash
git log --oneline -5
```

Deberías ver múltiples commits atómicos, cada uno con un estilo de mensaje claro.

### Paso 2: Implementación y verificación de UI (Visual + Playwright + UI/UX)

Escenario: necesitas agregar un componente de gráfico responsivo para una página y verificarlo en navegador.

**Por qué**
- La Category `visual-engineering` selecciona Gemini 3 Pro (experto en diseño visual)
- El Skill `playwright` proporciona herramientas MCP para pruebas en navegador
- El Skill `frontend-ui-ux` inyecta mentalidad de diseñador (paleta de colores, tipografía, animaciones)

En OpenCode ingresa:

```
Usa delegate_task para implementar el componente de gráfico
- category: visual-engineering
- load_skills: ["frontend-ui-ux", "playwright"]
- prompt: "Agrega un componente de gráfico responsivo en la página dashboard. Requisitos:
  - Usar Tailwind CSS
  - Soportar móviles y escritorio
  - Usar esquema de colores vibrante (evitar gradientes púrpura)
  - Agregar efectos de animación escalonados
  - Al completar, verifica con playwright capturando una captura de pantalla"
- run_in_background: false
```

**Deberías ver**:

1. Sisyphus Junior inicia, usando el modelo `google/gemini-3-pro`
2. Carga los prompts de dos Skills:
   - `frontend-ui-ux`: guía de mentalidad de diseñador
   - `playwright`: instrucciones de automatización de navegador
3. El servidor `@playwright/mcp` se inicia automáticamente
4. El agente ejecuta:
   - Diseña el componente de gráfico (aplicando mentalidad de diseñador)
   - Implementa el diseño responsivo
   - Agrega efectos de animación
   - Usa herramientas Playwright:
     ```
     playwright_navigate: http://localhost:3000/dashboard
     playwright_take_screenshot: output=dashboard-chart.png
     ```

**Punto de control ✅**:

Verifica si el componente se renderiza correctamente:
```bash
# Verificar archivos nuevos
git diff --name-only
git diff --stat

# Ver capturas de pantalla
ls screenshots/
```

Deberías ver:
- Nuevos archivos del componente de gráfico
- Código de estilos responsivos
- Archivos de captura de pantalla (verificación exitosa)

### Paso 3: Análisis profundo de arquitectura (Ultrabrain razonamiento puro)

Escenario: necesitas diseñar un patrón de comunicación complejo para una arquitectura de microservicios.

**Por qué**
- La Category `ultrabrain` selecciona GPT-5.2 Codex (xhigh), proporcionando la mayor capacidad de razonamiento
- No cargar Skills → razonamiento puro, evitando interferencia de conocimientos especializados

En OpenCode ingresa:

```
Usa delegate_task para analizar la arquitectura
- category: ultrabrain
- load_skills: []
- prompt: "Diseña un patrón de comunicación eficiente para nuestra arquitectura de microservicios. Requisitos:
  - Soporte descubrimiento de servicios
  - Maneje particiones de red
  - Minimice latencia
  - Proporcione estrategias de degradación

  Arquitectura actual: [resumen breve]
  Stack tecnológico: gRPC, Kubernetes, Consul"
- run_in_background: false
```

**Deberías ver**:

1. Sisyphus Junior inicia, usando el modelo `openai/gpt-5.2-codex` (variante xhigh)
2. No carga ningún Skill
3. El agente realiza razonamiento profundo:
   - Analiza la arquitectura existente
   - Compara patrones de comunicación (como CQRS, Event Sourcing, Saga)
   - Sopesa pros y contras
   - Proporciona recomendaciones por capas (Bottom Line → Action Plan → Risks)

**Estructura de salida**:

```
Bottom Line: Recomiendo usar un patrón híbrido (gRPC + Event Bus)

Action Plan:
1. Usar gRPC para comunicación síncrona entre servicios
2. Publicar eventos críticos a través de Event Bus de forma asíncrona
3. Implementar idempotencia para manejar mensajes duplicados

Risks and Mitigations:
- Risk: Particiones de red causan pérdida de mensajes
  Mitigation: Implementar reintentos de mensajes y cola de mensajes muertos
```

**Punto de control ✅**:

Verifica si la solución es integral:
- ¿Se consideró el descubrimiento de servicios?
- ¿Se manejaron las particiones de red?
- ¿Se proporcionaron estrategias de degradación?

### Paso 4: Category personalizada (opcional)

Si las Categories integradas no satisfacen tus necesidades, puedes personalizarlas en `oh-my-opencode.json`.

**Por qué**
Algunos proyectos necesitan configuraciones de modelo específicas (como Korean Writer, Deep Reasoning).

Edita `~/.config/opencode/oh-my-opencode.json`:

```jsonc
{
  "categories": {
    "korean-writer": {
      "model": "google/gemini-3-flash",
      "temperature": 0.5,
      "prompt_append": "You are a Korean technical writer. Maintain a friendly and clear tone."
    },
    
    "deep-reasoning": {
      "model": "anthropic/claude-opus-4-5",
      "thinking": {
        "type": "enabled",
        "budgetTokens": 32000
      },
      "tools": {
        "websearch_web_search_exa": false
      }
    }
  }
}
```

**Descripción de campos**:

| Campo | Tipo | Descripción |
|--- | --- | ---|
| `model` | string | Sobrescribe el modelo usado por Category |
| `temperature` | number | Nivel de creatividad (0-2) |
| `prompt_append` | string | Contenido para agregar al prompt del sistema |
| `thinking` | object | Configuración de Thinking (`{ type, budgetTokens }`) |
| `tools` | object | Deshabilitar permisos de herramientas (`{ toolName: false }`) |

**Punto de control ✅**:

Verifica si la Category personalizada entra en vigor:
```bash
# Usar Category personalizada
delegate_task(category="korean-writer", load_skills=[], prompt="...")
```

Deberías ver que el sistema usa el modelo y prompt que configuraste.

## Advertencias sobre errores comunes

### Error 1: Prompts de Category Quick no son lo suficientemente claros

**Problema**: Category `quick` usa el modelo Haiku, con capacidad de razonamiento limitada. Si el prompt es demasiado vago, los resultados serán deficientes.

**Ejemplo incorrecto**:
```
delegate_task(category="quick", load_skills=["git-master"], prompt="Haz commit de cambios")
```

**Forma correcta**:
```
TASK: Haz commit de todos los cambios de código actuales

MUST DO:
1. Detectar el estilo de commit del proyecto (a través de git log -30)
2. Dividir 8 archivos en 3+ commits atómicos por directorio
3. Máximo 3 archivos por commit
4. Seguir el estilo detectado (Semantic/Plain/Short)

MUST NOT DO:
- Combinar archivos de diferentes directorios en el mismo commit
- Saltar la planificación de commits y ejecutar directamente

EXPECTED OUTPUT:
- Múltiples commits atómicos
- Cada mensaje de commit coincide con el estilo del proyecto
- Sigue el orden de dependencia (definiciones de tipo → implementación → pruebas)
```

### Error 2: Olvidar especificar `load_skills`

**Problema**: `load_skills` es un **parámetro obligatorio**, si no se especifica generará error.

**Error**:
```
delegate_task(category="quick", prompt="...")
```

**Salida de error**:
```
Error: Invalid arguments: 'load_skills' parameter is REQUIRED.
Pass [] if no skills needed, but IT IS HIGHLY RECOMMENDED to pass proper skills.
```

**Forma correcta**:
```
# No se necesita Skill, pasar explícitamente un array vacío
delegate_task(category="unspecified-low", load_skills=[], prompt="...")
```

### Error 3: Especificar Category y subagent_type simultáneamente

**Problema**: Estos dos parámetros son mutuamente excluyentes, no se pueden especificar al mismo tiempo.

**Error**:
```
delegate_task(
  category="quick",
  subagent_type="oracle",  # ❌ Conflicto
  ...
)
```

**Forma correcta**:
```
# Usar Category (recomendado)
delegate_task(category="quick", load_skills=[], prompt="...")

# O especificar el agente directamente
delegate_task(subagent_type="oracle", load_skills=[], prompt="...")
```

### Error 4: Reglas de múltiples commits de Git Master

**Problema**: El Skill `git-master` exige **múltiples commits**, 1 commit con 3+ archivos fallará.

**Error**:
```
# Intentar 1 commit con 8 archivos
git commit -m "Update landing page"  # ❌ git-master rechazará
```

**Forma correcta**:
```
# Dividir en múltiples commits por directorio
git add app/page.tsx app/layout.tsx
git commit -m "Add app layer"  # ✅ Commit 1

git add components/demo/*
git commit -m "Add demo components"  # ✅ Commit 2

git add e2e/*
git commit -m "Add tests"  # ✅ Commit 3
```

### Error 5: Playwright Skill MCP no instalado

**Problema**: Antes de usar el Skill `playwright`, asegúrate de que el servidor MCP esté disponible.

**Error**:
```
delegate_task(category="visual-engineering", load_skills=["playwright"], prompt="Captura de pantalla...")
```

**Forma correcta**:

Verifica la configuración de MCP (`~/.config/opencode/mcp.json` o `.claude/.mcp.json`):

```jsonc
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

Si Playwright MCP no está configurado, el Skill `playwright` lo iniciará automáticamente.

## Resumen de esta lección

El sistema de Categories y Skills te permite combinar agentes de forma flexible:

| Componente | Función | Forma de configuración |
|--- | --- | ---|
| **Category** | Determina modelo y modo de pensamiento | `delegate_task(category="...")` o archivo de configuración |
| **Skill** | Inyecta conocimientos especializados y MCP | `delegate_task(load_skills=["..."])` o archivo SKILL.md |
| **Sisyphus Junior** | Ejecuta tareas, no puede delegar nuevamente | Generado automáticamente, no requiere especificación manual |

**Estrategias de combinación**:
1. **Tareas de UI**: `visual-engineering` + `frontend-ui-ux` + `playwright`
2. **Correcciones rápidas**: `quick` + `git-master`
3. **Razonamiento profundo**: `ultrabrain` (sin Skills)
4. **Escritura de documentación**: `writing` (sin Skills)

**Mejores prácticas**:
- ✅ Siempre especificar `load_skills` (incluso si es un array vacío)
- ✅ Los prompts de Category `quick` deben ser claros (capacidad de razonamiento de Haiku es limitada)
- ✅ Tareas de Git siempre usar el Skill `git-master` (detecta automáticamente el estilo)
- ✅ Tareas de UI siempre usar el Skill `playwright` (verificación en navegador)
- ✅ Seleccionar la Category apropiada según el tipo de tarea (en lugar de usar por defecto el agente principal)

## Próxima lección

> En la próxima lección aprenderemos **[Skills integrados: Automatización de navegador, Experto en Git y Diseñador de UI](../builtin-skills/)**.
>
> Aprenderás:
> - El flujo de trabajo detallado del Skill `playwright`
> - Los 3 modos del Skill `git-master` (Commit/Rebase/History Search)
> - La filosofía de diseño del Skill `frontend-ui-ux`
> - Cómo crear Skills personalizados

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-26

| Función | Ruta del archivo | Línea |
|--- | --- | ---|
| Implementación de la herramienta delegate_task | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | Todo el archivo (1070 líneas) |
| Función resolveCategoryConfig | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 113-152 |
| Función buildSystemContent | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 176-188 |
| Configuración predeterminada de Categories | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 158-166 |
| Anexos de prompts de Categories | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 168-176 |
| Descripciones de Categories | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 178-186 |
| Schema de configuración de Category | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 154-172 |
| Definición de Skills integrados | [`src/features/builtin-skills/`](https://github.com/code-yeongyu/oh-my-opencode/tree/main/src/features/builtin-skills) | Estructura de directorios |
| Prompt del Skill git-master | [`src/features/builtin-skills/git-master/SKILL.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/git-master/SKILL.md) | Todo el archivo (1106 líneas) |

**Constantes clave**:
- `SISYPHUS_JUNIOR_AGENT = "sisyphus-junior"`: agente de ejecución para delegación de Category
- `DEFAULT_CATEGORIES`: configuración de modelo de las 7 Categories integradas
- `CATEGORY_PROMPT_APPENDS`: contenido de anexo de prompt para cada Category
- `CATEGORY_DESCRIPTIONS`: descripción de cada Category (mostrada en el prompt de delegate_task)

**Funciones clave**:
- `resolveCategoryConfig()`: resuelve la configuración de Category, fusionando anulaciones de usuario y valores predeterminados
- `buildSystemContent()`: fusiona contenido de prompts de Skill y Category
- `createDelegateTask()`: crea definición de la herramienta delegate_task

**Archivos de Skills integrados**:
- `src/features/builtin-skills/frontend-ui-ux/SKILL.md`: prompt de mentalidad de diseñador
- `src/features/builtin-skills/git-master/SKILL.md`: flujo de trabajo completo de experto en Git
- `src/features/builtin-skills/agent-browser/SKILL.md`: configuración de agent-browser de Vercel
- `src/features/builtin-skills/dev-browser/SKILL.md`: documentación de referencia de automatización de navegador

</details>
