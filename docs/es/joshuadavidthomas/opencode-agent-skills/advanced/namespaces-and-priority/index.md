---
title: "Espacios de Nombres: Prioridad de Habilidades | opencode-agent-skills"
sidebarTitle: "Resolver Conflictos de Habilidades"
subtitle: "Espacios de Nombres: Prioridad de Habilidades | opencode-agent-skills"
description: "Aprende el sistema de espacios de nombres y las reglas de prioridad de descubrimiento de habilidades. Domina 5 etiquetas, 6 niveles de prioridad, usa espacios de nombres para distinguir habilidades con el mismo nombre y resuelve problemas de conflicto."
tags:
  - "Avanzado"
  - "Espacios de Nombres"
  - "Gestión de Habilidades"
prerequisite:
  - "start-what-is-opencode-agent-skills"
  - "platforms-skill-discovery-mechanism"
  - "platforms-listing-available-skills"
order: 3
---

# Espacios de Nombres y Prioridad de Habilidades

## Qué Aprenderás

- Comprender el sistema de espacios de nombres de habilidades y distinguir habilidades con el mismo nombre de diferentes fuentes
- Dominar las reglas de prioridad de descubrimiento de habilidades y predecir cuál habilidad se cargará
- Usar prefijos de espacio de nombres para especificar la fuente de habilidades con precisión
- Resolver problemas de conflicto de habilidades con el mismo nombre

## Tu Situación Actual

A medida que crece el número de habilidades, puedes encontrar estas confusiones:

- **Conflicto de habilidades con el mismo nombre**: Tienes habilidades `git-helper` tanto en el directorio del proyecto como en el directorio del usuario, y no sabes cuál se está cargando
- **Confusión de fuentes de habilidades**: No está claro qué habilidades provienen del nivel de proyecto, cuáles del nivel de usuario o del caché de plugins
- **Comportamiento de sobrescritura incomprensible**: Modificaste una habilidad de nivel de usuario pero no surte efecto porque la está sobrescribiendo una habilidad de nivel de proyecto
- **Control preciso difícil**: Quieres forzar el uso de una habilidad de una fuente específica, pero no sabes cómo especificarla

Estos problemas surgen de la falta de comprensión de los espacios de nombres de habilidades y las reglas de prioridad.

## Idea Central

Los **espacios de nombres** son el mecanismo que utiliza OpenCode Agent Skills para distinguir habilidades con el mismo nombre de diferentes fuentes. Cada habilidad tiene una etiqueta (label) que identifica su fuente, y estas etiquetas constituyen el espacio de nombres de la habilidad.

::: info ¿Por qué necesitamos espacios de nombres?

Imagina que tienes dos habilidades con el mismo nombre:
- Nivel de proyecto `.opencode/skills/git-helper/` (personalizada para el proyecto actual)
- Nivel de usuario `~/.config/opencode/skills/git-helper/` (versión genérica)

Sin espacios de nombres, el sistema no sabría cuál usar. Con espacios de nombres, puedes especificar claramente:
- `project:git-helper` - forzar uso de la versión de nivel de proyecto
- `user:git-helper` - forzar uso de la versión de nivel de usuario
:::

Las **reglas de prioridad** aseguran que el sistema pueda hacer una elección razonable cuando no se especifica un espacio de nombres. Las habilidades de nivel de proyecto tienen prioridad sobre las de nivel de usuario, así puedes personalizar el comportamiento en un proyecto sin afectar la configuración global.

## Fuentes de Habilidades y Etiquetas

OpenCode Agent Skills admite múltiples fuentes de habilidades, cada una con su etiqueta correspondiente:

| Fuente | Etiqueta (label) | Ruta | Descripción |
| --- | --- | --- | ---|
| **Nivel de proyecto OpenCode** | `project` | `.opencode/skills/` | Habilidades específicas del proyecto actual |
| **Nivel de proyecto Claude** | `claude-project` | `.claude/skills/` | Habilidades de proyecto compatibles con Claude Code |
| **Nivel de usuario OpenCode** | `user` | `~/.config/opencode/skills/` | Habilidades genéricas compartidas por todos los proyectos |
| **Nivel de usuario Claude** | `claude-user` | `~/.claude/skills/` | Habilidades de usuario compatibles con Claude Code |
| **Caché de plugins Claude** | `claude-plugins` | `~/.claude/plugins/cache/` | Plugins de Claude instalados |
| **Mercado de plugins Claude** | `claude-plugins` | `~/.claude/plugins/marketplaces/` | Plugins de Claude instalados desde el mercado |

::: tip Recomendación práctica
- Configuración específica de proyecto: coloca en `.opencode/skills/`
- Habilidades de herramientas genéricas: coloca en `~/.config/opencode/skills/`
- Migración desde Claude Code: no necesitas mover nada, el sistema descubrirá automáticamente
:::

## Prioridad de Descubrimiento de Habilidades

Cuando el sistema descubre habilidades, escanea las ubicaciones en este orden:

```
1. .opencode/skills/              (project)        ← Prioridad más alta
2. .claude/skills/                (claude-project)
3. ~/.config/opencode/skills/     (user)
4. ~/.claude/skills/              (claude-user)
5. ~/.claude/plugins/cache/       (claude-plugins)
6. ~/.claude/plugins/marketplaces/ (claude-plugins)  ← Prioridad más baja
```

**Reglas clave**:
- **Primera coincidencia gana**: la primera habilidad encontrada se conserva
- **Desduplicación de habilidades con mismo nombre**: las habilidades con mismo nombre encontradas después se ignoran (pero se emite una advertencia)
- **Nivel de proyecto tiene prioridad**: las habilidades de nivel de proyecto sobrescriben las de nivel de usuario

### Ejemplo de Prioridad

Supón que tienes esta distribución de habilidades:

```
Directorio del proyecto:
.opencode/skills/
  └── git-helper/              ← Versión A (personalizada para proyecto)

Directorio del usuario:
~/.config/opencode/skills/
  └── git-helper/              ← Versión B (genérica)

Caché de plugins:
~/.claude/plugins/cache/xxx/skills/
  └── git-helper/              ← Versión C (plugin de Claude)
```

Resultado: el sistema carga la **Versión A** (`project:git-helper`), y las dos habilidades con mismo nombre encontradas después se ignoran.

## Uso de Espacios de Nombres para Especificar Habilidades

Cuando invocas `use_skill` u otras herramientas, puedes usar prefijos de espacio de nombres para especificar la fuente de la habilidad con precisión.

### Formato de Sintaxis

```
namespace:skill-name
```

O

```
skill-name  # No especifica espacio de nombres, usa prioridad predeterminada
```

### Lista de Espacios de Nombres

```
project:skill-name         # Habilidad OpenCode de nivel de proyecto
claude-project:skill-name  # Habilidad Claude de nivel de proyecto
user:skill-name            # Habilidad OpenCode de nivel de usuario
claude-user:skill-name     # Habilidad Claude de nivel de usuario
claude-plugins:skill-name  # Habilidad de plugin Claude
```

### Ejemplos de Uso

**Escenario 1: Carga predeterminada (por prioridad)**

```
use_skill("git-helper")
```

- El sistema busca por prioridad y carga la primera habilidad que coincida
- Es decir, `project:git-helper` (si existe)

**Escenario 2: Forzar uso de habilidad de nivel de usuario**

```
use_skill("user:git-helper")
```

- Omite las reglas de prioridad y carga directamente la habilidad de nivel de usuario
- Incluso si la versión de nivel de usuario está siendo sobrescrita por la de nivel de proyecto, aún es accesible

**Escenario 3: Cargar habilidad de plugin Claude**

```
use_skill("claude-plugins:plugin-name")
```

- Carga explícitamente una habilidad de un plugin Claude
- Útil para escenarios que requieren funcionalidades específicas de un plugin

## Lógica de Coincidencia de Espacios de Nombres

Cuando usas el formato `namespace:skill-name`, la lógica de coincidencia del sistema es la siguiente:

1. **Analizar entrada**: Separar el espacio de nombres y el nombre de la habilidad
2. **Recorrer todas las habilidades**: Buscar habilidades que coincidan
3. **Condiciones de coincidencia**:
   - El nombre de la habilidad coincide
   - El campo `label` de la habilidad es igual al espacio de nombres especificado
   - O el campo personalizado `namespace` de la habilidad es igual al espacio de nombres especificado
4. **Devolver resultado**: La primera habilidad que cumpla las condiciones

::: details Lógica de coincidencia del código fuente

```typescript
export function resolveSkill(
  skillName: string,
  skillsByName: Map<string, Skill>
): Skill | null {
  if (skillName.includes(':')) {
    const [namespace, name] = skillName.split(':');
    for (const skill of skillsByName.values()) {
      if (skill.name === name &&
          (skill.label === namespace || skill.namespace === namespace)) {
        return skill;
      }
    }
    return null;
  }
  return skillsByName.get(skillName) || null;
}
```

:::

## Espacios de Nombres en Modo Superpowers

Cuando habilitas el modo Superpowers, el sistema inyecta la descripción de prioridad de espacios de nombres durante la inicialización de la sesión:

```markdown
**Prioridad de espacios de nombres de habilidades:**
1. Proyecto: `project:skill-name`
2. Proyecto Claude: `claude-project:skill-name`
3. Usuario: `skill-name`
4. Usuario Claude: `claude-user:skill-name`
5. Mercado: `claude-plugins:skill-name`

La primera coincidencia descubierta gana.
```

Esto asegura que la IA siga las reglas de prioridad correctas al seleccionar habilidades.

::: tip Cómo habilitar el modo Superpowers

Configura la variable de entorno:

```bash
OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true opencode
```

:::

## Escenarios de Uso Comunes

### Escenario 1: Personalización de Proyecto Sobrescribe Habilidad Genérica

**Necesidad**: Tu proyecto necesita un flujo de trabajo Git especial, pero a nivel de usuario ya existe una habilidad `git-helper` genérica.

**Solución**:
1. Crea `.opencode/skills/git-helper/` en el directorio del proyecto
2. Configura el flujo de trabajo Git específico del proyecto
3. Al llamar `use_skill("git-helper")` por defecto se usará la versión de nivel de proyecto

**Verificación**:

```bash
## Ver lista de habilidades, presta atención a las etiquetas
get_available_skills("git-helper")
```

Ejemplo de salida:
```
git-helper (project)
  Flujo de trabajo Git específico del proyecto
```

### Escenario 2: Cambio Temporal a Habilidad Genérica

**Necesidad**: Una tarea específica requiere usar la habilidad genérica de nivel de usuario, no la versión personalizada del proyecto.

**Solución**:

```
use_skill("user:git-helper")
```

Especifica explícitamente el espacio de nombres `user:`, omitiendo la sobrescritura de nivel de proyecto.

### Escenario 3: Cargar Habilidad desde Plugin Claude

**Necesidad**: Migraste desde Claude Code y quieres seguir usando alguna habilidad de plugin de Claude.

**Solución**:

1. Asegúrate de que la ruta de caché de plugins de Claude sea correcta: `~/.claude/plugins/cache/`
2. Ver la lista de habilidades:

```
get_available_skills()
```

3. Usar el espacio de nombres para cargar:

```
use_skill("claude-plugins:plugin-name")
```

## Advertencias de Errores Comunes

### ❌ Error 1: No Saber que una Habilidad del Mismo Nombre ha sido Sobrescrita

**Síntoma**: Modificaste una habilidad de nivel de usuario, pero la IA sigue usando la versión antigua.

**Causa**: La habilidad de nivel de proyecto con el mismo nombre tiene mayor prioridad y está sobrescribiendo la habilidad de nivel de usuario.

**Solución**:
1. Verifica si existe una habilidad con el mismo nombre en el directorio del proyecto
2. Usa el espacio de nombres para especificar forzosamente: `use_skill("user:skill-name")`
3. O elimina la habilidad del mismo nombre en el directorio del proyecto

### ❌ Error 2: Error de Ortografía en el Espacio de Nombres

**Síntoma**: Al usar `use_skill("project:git-helper")` devuelve 404.

**Causa**: Error de ortografía en el espacio de nombres (como escribir `projcet`) o mayúsculas/minúsculas incorrectas.

**Solución**:
1. Primero ver la lista de habilidades: `get_available_skills()`
2. Presta atención a las etiquetas entre paréntesis (como `(project)`)
3. Usa el nombre correcto del espacio de nombres

### ❌ Error 3: Confundir Etiqueta con Espacio de Nombres Personalizado

**Síntoma**: Al usar `use_skill("project:custom-skill")` no encuentra la habilidad.

**Causa**: `project` es una etiqueta (label), no un espacio de nombres personalizado. A menos que el campo `namespace` de la habilidad se establezca explícitamente como `project`, no coincidirá.

**Solución**:
- Usa directamente el nombre de la habilidad: `use_skill("custom-skill")`
- O verifica el campo `label` de la habilidad y usa el espacio de nombres correcto

## Resumen de la Lección

El sistema de espacios de nombres de OpenCode Agent Skills, mediante etiquetas y reglas de prioridad, logra una gestión unificada de habilidades de múltiples fuentes:

- **5 etiquetas de fuente**: `project`, `claude-project`, `user`, `claude-user`, `claude-plugins`
- **6 niveles de prioridad**: Proyecto > Proyecto Claude > Usuario > Usuario Claude > Caché de plugins > Mercado de plugins
- **Primera coincidencia gana**: Las habilidades con mismo nombre se cargan por prioridad, las posteriores se ignoran
- **Prefijo de espacio de nombres**: Usa el formato `namespace:skill-name` para especificar la fuente de la habilidad con precisión

Este mecanismo te permite disfrutar de la conveniencia del descubrimiento automático, pero también tener control preciso sobre la fuente de las habilidades cuando sea necesario.

## Avance de la Próxima Lección

> En la próxima lección aprenderemos sobre el **[Mecanismo de Compresión y Recuperación de Contexto](../context-compaction-resilience/)**.
>
> Aprenderás:
> - El impacto de la compresión de contexto en las habilidades
> - Cómo los plugins recuperan automáticamente la lista de habilidades
> - Técnicas para mantener las habilidades disponibles en sesiones largas

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Función | Ruta del Archivo | Número de Línea |
| --- | --- | ---|
| Definición del tipo SkillLabel | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L30) | 30 |
| Lista de prioridad de descubrimiento | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L241-L246) | 241-246 |
| Lógica de desduplicación de habilidades con mismo nombre | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L258-L259) | 258-259 |
| Procesamiento de espacio de nombres de resolveSkill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| Descripción de espacio de nombres de Superpowers | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L18-L25) | 18-25 |

**Tipos Clave**:
- `SkillLabel`: Enumeración de etiquetas de fuente de habilidades
- `Skill`: Interfaz de metadatos de habilidades (incluye campos `namespace` y `label`)

**Funciones Clave**:
- `discoverAllSkills()`: Descubre habilidades por prioridad, desduplicación automática
- `resolveSkill()`: Analiza prefijos de espacio de nombres, busca habilidades
- `maybeInjectSuperpowersBootstrap()`: Inyecta descripción de prioridad de espacios de nombres

**Lista de Rutas de Descubrimiento** (en orden de prioridad):
1. `project` - `.opencode/skills/`
2. `claude-project` - `.claude/skills/`
3. `user` - `~/.config/opencode/skills/`
4. `claude-user` - `~/.claude/skills/`
5. `claude-plugins` - `~/.claude/plugins/cache/` y `~/.claude/plugins/marketplaces/`

</details>
