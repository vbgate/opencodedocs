---
title: "Preguntas Frecuentes: Guía de Solución de Problemas | OpenSkills"
subtitle: "Preguntas Frecuentes: Guía de Solución de Problemas"
sidebarTitle: "¿Qué hacer si tienes problemas"
description: "Aprende a resolver problemas comunes de OpenSkills. Diagnostica rápidamente fallas de instalación, habilidades no cargadas, sincronización de AGENTS.md y mejora la eficiencia de gestión de habilidades."
tags:
  - "FAQ"
  - "Solución de problemas"
  - "Preguntas frecuentes"
prerequisite:
  - "start-quick-start"
order: 1
---

# Preguntas Frecuentes

## Lo que podrás hacer al completar esta lección

Esta lección responde a preguntas comunes durante el uso de OpenSkills, ayudándote a:

- ✅ Localizar y resolver rápidamente problemas de instalación fallida
- ✅ Comprender la relación entre OpenSkills y Claude Code
- ✅ Resolver problemas donde las habilidades no aparecen en AGENTS.md
- ✅ Manejar preguntas relacionadas con actualizaciones y eliminación de habilidades
- ✅ Configurar habilidades correctamente en entornos multi-agente

## Tu situación actual

Al usar OpenSkills, podrías encontrarte con:

- "La instalación siempre falla, no sé qué está mal"
- "No veo las habilidades recién instaladas en AGENTS.md"
- "No sé dónde se instalaron las habilidades"
- "Quiero usar OpenSkills, pero tengo miedo de que entre en conflicto con Claude Code"

Esta lección te ayuda a encontrar rápidamente la causa raíz y las soluciones de los problemas.
---

## Preguntas sobre Conceptos Principales

### ¿Cuál es la diferencia entre OpenSkills y Claude Code?

**Respuesta breve**: OpenSkills es un "instalador universal", Claude Code es el "agente oficial".

**Explicación detallada**:

| Aspecto de comparación | OpenSkills | Claude Code |
|--- | --- | ---|
| **Posicionamiento** | Cargador de habilidades universal | Agente de IA de codificación oficial de Anthropic |
| **Alcance de soporte** | Todos los agentes de IA (Cursor, Windsurf, Aider, etc.) | Solo Claude Code |
| **Formato de habilidad** | Exactamente igual que Claude Code (`SKILL.md`) | Especificación oficial |
| **Método de instalación** | Desde GitHub, ruta local, repositorio privado | Desde Marketplace integrado |
| **Almacenamiento de habilidades** | `.claude/skills/` o `.agent/skills/` | `.claude/skills/` |
| **Método de invocación** | `npx openskills read <name>` | Herramienta `Skill()` integrada |

**Valor principal**: OpenSkills permite que otros agentes también utilicen el sistema de habilidades de Anthropic, sin necesidad de esperar que cada agente implemente su propia versión.

### ¿Por qué CLI en lugar de MCP?

**Razón principal**: Las habilidades son archivos estáticos, MCP es una herramienta dinámica, ambos resuelven problemas diferentes.

| Dimensión de comparación | MCP (Model Context Protocol) | OpenSkills (CLI) |
|--- | --- | ---|
| **Escenario de uso** | Herramientas dinámicas, llamadas API en tiempo real | Instrucciones estáticas, documentación, scripts |
| **Requisitos de ejecución** | Requiere servidor MCP | No requiere servidor (solo archivos) |
| **Soporte de agentes** | Solo agentes que soportan MCP | Todos los agentes que pueden leer `AGENTS.md` |
| **Complejidad** | Requiere despliegue de servidor | Configuración cero |

**Puntos clave**:

- **Las habilidades son archivos**: SKILL.md son instrucciones estáticas + recursos (references/, scripts/, assets/), no necesitan servidor
- **Sin necesidad de soporte de agentes**: Cualquier agente que pueda ejecutar comandos shell puede usarlo
- **Diseño oficial**: El sistema de habilidades de Anthropic está diseñado como un sistema de archivos, no como diseño MCP

**Resumen**: MCP y el sistema de habilidades resuelven problemas diferentes. OpenSkills mantiene las habilidades ligeras y universales, sin necesidad de que cada agente soporte MCP.
---

## Preguntas sobre Instalación y Configuración

### ¿Qué hacer si la instalación falla?

**Errores comunes y soluciones**:

#### Error 1: Clonación fallida

```bash
Error: Git clone failed
```

**Posibles causas**:
- Problemas de red (no se puede acceder a GitHub)
- Git no instalado o versión muy antigua
- Repositorio privado sin configurar claves SSH

**Soluciones**:

1. Verificar si Git está instalado:
   ```bash
   git --version
   # Debería mostrar: git version 2.x.x
   ```

2. Verificar la conexión de red:
   ```bash
   # Probar si se puede acceder a GitHub
   ping github.com
   ```

3. Repositorios privados requieren configuración SSH:
   ```bash
   # Probar conexión SSH
   ssh -T git@github.com
   ```

#### Error 2: Ruta no existe

```bash
Error: Path does not exist: ./nonexistent-path
```

**Soluciones**:
- Confirmar que la ruta local es correcta
- Usar ruta absoluta o relativa:
  ```bash
  # Ruta absoluta
  npx openskills install /Users/dev/my-skills

  # Ruta relativa
  npx openskills install ./my-skills
  ```

#### Error 3: No se encuentra SKILL.md

```bash
Error: No valid SKILL.md found
```

**Soluciones**:

1. Verificar la estructura del directorio de habilidades:
   ```bash
   ls -la ./my-skill
   # Debe contener SKILL.md
   ```

2. Confirmar que SKILL.md tiene YAML frontmatter válido:
   ```markdown
   ---
   name: my-skill
   description: Skill description
   ---

   # Skill content
   ```

### ¿En qué directorio se instalan las habilidades?

**Ubicación de instalación predeterminada** (local del proyecto):
```bash
.claude/skills/
```

**Ubicación de instalación global** (usando `--global`):
```bash
~/.claude/skills/
```

**Modo Universal** (usando `--universal`):
```bash
.agent/skills/
```

**Prioridad de búsqueda de habilidades** (de mayor a menor):
1. `./.agent/skills/` (local del proyecto, Universal)
2. `~/.agent/skills/` (global, Universal)
3. `./.claude/skills/` (local del proyecto, predeterminado)
4. `~/.claude/skills/` (global, predeterminado)

**Verificar ubicación de habilidades instaladas**:
```bash
npx openskills list
# La salida muestra etiquetas [project] o [global]
```
### ¿Cómo coexistir con Claude Code Marketplace?

**Problema**: Quiero usar Claude Code y también OpenSkills, ¿cómo evitar conflictos?

**Solución**: Usar modo Universal

```bash
# Instalar en .agent/skills/ en lugar de .claude/skills/
npx openskills install anthropics/skills --universal
```

**Por qué funciona**:

| Directorio | Quién lo usa | Descripción |
|--- | --- | ---|
| `.claude/skills/` | Claude Code | Usado por Claude Code Marketplace |
| `.agent/skills/` | OpenSkills | Usado por otros agentes (Cursor, Windsurf) |

**Advertencia de conflicto**:

Al instalar desde el repositorio oficial, OpenSkills mostrará:
```
⚠️  Warning: These skills are also available in Claude Code Marketplace.
   Installing to .claude/skills/ may cause conflicts.
   Use --universal to install to .agent/skills/ instead.
```
---

## Preguntas sobre Uso

### ¿La habilidad no aparece en AGENTS.md?

**Síntoma**: Después de instalar una habilidad, no aparece en AGENTS.md.

**Pasos de diagnóstico**:

#### 1. Confirmar sincronización

Después de instalar una habilidad, debes ejecutar el comando `sync`:

```bash
npx openskills install anthropics/skills
# Seleccionar habilidades...

# ¡Debe ejecutar sync!
npx openskills sync
```

#### 2. Verificar la ubicación de AGENTS.md

```bash
# AGENTS.md predeterminado en la raíz del proyecto
cat AGENTS.md
```

Si usas una ruta de salida personalizada, confirma que la ruta es correcta:
```bash
npx openskills sync -o custom-path/AGENTS.md
```

#### 3. Verificar si la habilidad está seleccionada

El comando `sync` es interactivo, necesitas confirmar que seleccionaste las habilidades a sincronizar:

```bash
npx openskills sync

? Select skills to sync:
  ◉ pdf                  [seleccionado]
  ◯ check-branch-first   [no seleccionado]
```

#### 4. Verificar el contenido de AGENTS.md

Confirmar que las etiquetas XML son correctas:

```xml
<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>

</available_skills>
```

### ¿Cómo actualizar habilidades?

**Actualizar todas las habilidades**:
```bash
npx openskills update
```

**Actualizar habilidades específicas** (separadas por comas):
```bash
npx openskills update pdf,git-workflow
```

**Preguntas comunes**:

#### Habilidad no actualizada

**Síntoma**: Después de ejecutar `update`, muestra "skipped"

**Causa**: La habilidad no registró información de origen durante la instalación (comportamiento de versión antigua)

**Solución**:
```bash
# Reinstalar para registrar origen
npx openskills install anthropics/skills
```

#### Habilidades locales no se pueden actualizar

**Síntoma**: Habilidades instaladas desde una ruta local, error al actualizar

**Causa**: Las habilidades de ruta local requieren actualización manual

**Solución**:
```bash
# Reinstalar desde ruta local
npx openskills install ./my-skill
```
### ¿Cómo eliminar habilidades?

**Método 1: Eliminación interactiva**

```bash
npx openskills manage
```

Selecciona la habilidad a eliminar, presiona espacio para seleccionar, Enter para confirmar.

**Método 2: Eliminación directa**

```bash
npx openskills remove <skill-name>
```

**Después de eliminar**: Recuerda ejecutar `sync` para actualizar AGENTS.md:
```bash
npx openskills sync
```

**Preguntas comunes**:

#### Eliminación accidental de habilidad

**Método de recuperación**:
```bash
# Reinstalar desde origen
npx openskills install anthropics/skills
# Seleccionar la habilidad eliminada por error
```

#### Aún se muestra en AGENTS.md después de eliminar

**Solución**: Volver a sincronizar
```bash
npx openskills sync
```
---

## Preguntas Avanzadas

### ¿Cómo compartir habilidades entre múltiples proyectos?

**Escenario**: Múltiples proyectos necesitan usar el mismo conjunto de habilidades, no quieres instalar repetidamente.

**Solución 1: Instalación global**

```bash
# Instalar globalmente una vez
npx openskills install anthropics/skills --global

# Todos los proyectos pueden usarlo
cd project-a
npx openskills read pdf

cd project-b
npx openskills read pdf
```

**Ventajas**:
- Instalar una vez, usar en todas partes
- Reducir uso de disco

**Desventajas**:
- La habilidad no está en el proyecto, el control de versiones no la incluye

**Solución 2: Enlaces simbólicos**

```bash
# 1. Instalar habilidad globalmente
npx openskills install anthropics/skills --global

# 2. Crear enlace simbólico en el proyecto
cd project-a
ln -s ~/.claude/skills/pdf .claude/skills/pdf

# 3. sync lo reconocerá como ubicación [project]
npx openskills sync
```

**Ventajas**:
- La habilidad está en el proyecto (etiqueta `[project]`)
- El control de versiones puede incluir el enlace simbólico
- Instalar una vez, usar en múltiples lugares

**Desventajas**:
- Los enlaces simbólicos requieren permisos en algunos sistemas

**Solución 3: Git Submodule**

```bash
# Agregar repositorio de habilidades como submodule en el proyecto
cd project-a
git submodule add https://github.com/anthropics/skills.git .claude/skills-repo

# Instalar habilidades desde submodule
npx openskills install .claude/skills-repo/pdf
```

**Ventajas**:
- Control de versiones completo
- Puede especificar versión de habilidad

**Desventajas**:
- Configuración más compleja
### ¿No se puede acceder a enlaces simbólicos?

**Síntomas**:

```bash
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill
# ln: failed to create symbolic link: Operation not permitted
```

**Soluciones por sistema**:

#### macOS

1. Abrir "Preferencias del Sistema"
2. Ir a "Seguridad y Privacidad"
3. En "Acceso completo al disco", permitir tu aplicación de terminal

#### Windows

Windows no soporta enlaces simbólicos de forma nativa, se recomienda:
- **Usar Git Bash**: Viene con soporte de enlaces simbólicos
- **Usar WSL**: Subsistema Linux soporta enlaces simbólicos
- **Habilitar modo desarrollador**: Configuración → Actualización y seguridad → Modo desarrollador

```bash
# Crear enlace simbólico en Git Bash
ln -s /c/dev/my-skills/my-skill .claude/skills/my-skill
```

#### Linux

Verificar permisos del sistema de archivos:

```bash
# Verificar permisos del directorio
ls -la .claude/

# Agregar permiso de escritura
chmod +w .claude/
```

### ¿No se encuentra la habilidad?

**Síntomas**:

```bash
npx openskills read my-skill
# Error: Skill not found: my-skill
```

**Pasos de diagnóstico**:

#### 1. Confirmar que la habilidad está instalada

```bash
npx openskills list
```

#### 2. Verificar mayúsculas/minúsculas del nombre de habilidad

```bash
# ❌ Error (mayúsculas)
npx openskills read My-Skill

# ✅ Correcto (minúsculas)
npx openskills read my-skill
```

#### 3. Verificar si la habilidad está siendo sobrescrita por una habilidad de mayor prioridad

```bash
# Ver todas las ubicaciones de habilidades
ls -la .claude/skills/my-skill
ls -la ~/.claude/skills/my-skill
ls -la .agent/skills/my-skill
ls -la ~/.agent/skills/my-skill
```

**Regla de búsqueda de habilidades**: La ubicación con mayor prioridad sobrescribirá habilidades con el mismo nombre en otras ubicaciones.
---

## Resumen de la Lección

Puntos clave de las preguntas frecuentes de OpenSkills:

### Conceptos Principales

- ✅ OpenSkills es instalador universal, Claude Code es agente oficial
- ✅ CLI es más adecuado que MCP para el sistema de habilidades (archivos estáticos)

### Instalación y Configuración

- ✅ Las habilidades se instalan por defecto en `.claude/skills/`
- ✅ Usar `--universal` para evitar conflictos con Claude Code
- ✅ Las fallas de instalación suelen ser problemas de red, Git, ruta

### Consejos de Uso

- ✅ Después de instalar, debes ejecutar `sync` para que aparezca en AGENTS.md
- ✅ El comando `update` solo actualiza habilidades con información de origen
- ✅ Después de eliminar habilidades, recuerda ejecutar `sync`

### Escenarios Avanzados

- ✅ Compartir habilidades entre múltiples proyectos: instalación global, enlaces simbólicos, Git Submodule
- ✅ Problemas de enlaces simbólicos: configurar permisos por sistema
- ✅ Habilidad no encontrada: verificar nombre, revisar prioridad

## Próxima Lección

> En la próxima lección aprenderemos **[Solución de Problemas](../troubleshooting/)**.
>
> Aprenderás:
> - Diagnóstico rápido y soluciones para errores comunes
> - Manejo de problemas como errores de ruta, fallas de clonación, SKILL.md inválido
> - Técnicas de diagnóstico para problemas de permisos y fallas de enlaces simbólicos
---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-24

| Funcionalidad        | Ruta de archivo                                                                                                   | Línea    |
|--- | --- | ---|
| Comando de instalación    | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts)              | 1-424   |
| Comando de sincronización    | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts)                  | 1-99    |
| Comando de actualización    | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts)              | 1-113   |
| Comando de eliminación    | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts)              | 1-30    |
| Búsqueda de habilidades    | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts)                    | 1-50    |
| Prioridad de directorios  | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts)                      | 14-25   |
| Generación de AGENTS.md  | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts)            | 23-93   |

**Funciones clave**:
- `findAllSkills()`: Busca todas las habilidades (ordenadas por prioridad)
- `findSkill(name)`: Busca una habilidad específica
- `generateSkillsXml()`: Genera formato XML de AGENTS.md
- `updateSkillFromDir()`: Actualiza habilidades desde directorio

</details>
