---
title: "Global vs Proyecto: Ubicación de Instalación | OpenSkills"
sidebarTitle: "Instalación Global: Compartir Habilidades entre Proyectos"
subtitle: "Instalación Global vs Instalación Local del Proyecto"
description: "Aprende las diferencias entre la instalación global de habilidades y la instalación local del proyecto de OpenSkills. Domina el uso del flag --global, entiende las reglas de prioridad de búsqueda y elige la ubicación de instalación adecuada según el escenario."
tags:
  - "Integración de Plataforma"
  - "Gestión de Habilidades"
  - "Consejos de Configuración"
prerequisite:
  - "start-first-skill"
  - "platforms-install-sources"
order: 3
---

# Instalación Global vs Instalación Local del Proyecto

## Lo Que Podrás Hacer Después

- Entender las diferencias entre las dos ubicaciones de instalación de OpenSkills (global vs local del proyecto)
- Elegir la ubicación de instalación adecuada según el escenario
- Dominar el uso del flag `--global`
- Entender las reglas de prioridad de búsqueda de habilidades
- Evitar errores comunes de configuración de ubicación de instalación

::: info Conocimientos Previos

Este tutorial asume que ya has completado [Instalar la Primera Habilidad](../../start/first-skill/) y [Fuentes de Instalación Detalladas](../install-sources/), entendiendo el flujo básico de instalación de habilidades.

:::

---

## Tu Dilema Actual

Es posible que ya hayas aprendido cómo instalar habilidades, pero:

- **¿Dónde se instalaron las habilidades?**: Después de ejecutar `openskills install`, no sabes en qué directorio se copiaron los archivos de las habilidades
- **¿Tengo que reinstalar para el nuevo proyecto?**: Al cambiar a otro proyecto, las habilidades instaladas anteriormente desaparecen
- **¿Qué pasa con las habilidades que solo quiero usar una vez a nivel global?**: Algunas habilidades son necesarias en todos los proyectos, no quiero instalarlas en cada proyecto
- **¿Compartir habilidades entre múltiples proyectos?**: Algunas habilidades son comunes para el equipo, quiero gestionarlas de manera unificada

De hecho, OpenSkills proporciona dos ubicaciones de instalación, permitiéndote gestionar las habilidades de manera flexible.

---

## Cuándo Usar Esta Técnica

**Escenarios aplicables para las dos ubicaciones de instalación**:

| Ubicación de Instalación | Escenarios Aplicables | Ejemplo |
|--- | --- | ---|
| **Local del Proyecto** (predeterminado) | Habilidades específicas del proyecto, requieren control de versiones | Reglas de negocio del equipo, herramientas específicas del proyecto |
| **Instalación Global** (`--global`) | Habilidades comunes para todos los proyectos, sin control de versiones | Herramientas de generación de código genéricas, conversión de formatos de archivo |

::: tip Recomendación

- **Usar instalación local del proyecto de forma predeterminada**: Deja que las habilidades sigan al proyecto, facilitando la colaboración en equipo y el control de versiones
- **Usar instalación global solo para herramientas genéricas**: Por ejemplo, `git-helper`, `docker-generator`, etc., herramientas entre proyectos
- **Evitar globalización excesiva**: Las habilidades instaladas globalmente se comparten entre todos los proyectos, lo que puede causar conflictos o inconsistencias de versiones

:::

---

## Idea Central: Dos Ubicaciones, Elección Flexible

La ubicación de instalación de habilidades de OpenSkills está controlada por el flag `--global`:

**Predeterminado (instalación local del proyecto)**:
- Ubicación de instalación: `./.claude/skills/` (directorio raíz del proyecto)
- Aplicable: Habilidades específicas de un solo proyecto
- Ventaja: Las habilidades siguen al proyecto, se pueden enviar a Git, facilitando la colaboración en equipo

**Instalación Global**:
- Ubicación de instalación: `~/.claude/skills/` (directorio principal del usuario)
- Aplicable: Habilidades comunes para todos los proyectos
- Ventaja: Compartido por todos los proyectos, sin necesidad de reinstalación

::: info Concepto Importante

**Local del Proyecto**: Las habilidades se instalan en el directorio `.claude/skills/` del proyecto actual y solo son visibles para el proyecto actual.

**Instalación Global**: Las habilidades se instalan en `.claude/skills/` del directorio principal del usuario y son visibles para todos los proyectos.

:::

---

## Sigue conmigo

### Paso 1: Ver el comportamiento de instalación predeterminado

**Por qué**
Primero entiende el método de instalación predeterminado, comprendiendo la idea de diseño de OpenSkills.

Abre la terminal y ejecuta en cualquier proyecto:

```bash
# Instalar una habilidad de prueba (predeterminado: local del proyecto)
npx openskills install anthropics/skills -y

# Ver la lista de habilidades
npx openskills list
```

**Lo que deberías ver**: Cada habilidad en la lista tiene una etiqueta `(project)`

```
  codebase-reviewer         (project)
    Review code changes for issues...

Summary: 3 project, 0 global (3 total)
```

**Explicación**:
- Por defecto, las habilidades se instalan en el directorio `./.claude/skills/`
- El comando `list` muestra etiquetas `(project)` o `(global)`
- Cuando no se usa el flag `--global` por defecto, las habilidades solo son visibles para el proyecto actual

---

### Paso 2: Ver la ubicación de instalación de habilidades

**Por qué**
Confirmar la ubicación real de almacenamiento de los archivos de habilidades, facilitando la gestión posterior.

Ejecuta en el directorio raíz del proyecto:

```bash
# Ver el directorio de habilidades local del proyecto
ls -la .claude/skills/

# Ver el contenido del directorio de habilidades
ls -la .claude/skills/codebase-reviewer/
```

**Lo que deberías ver**:

```
.claude/skills/
├── codebase-reviewer/
│   ├── SKILL.md
│   └── .openskills.json    # Metadatos de instalación
├── file-writer/
│   ├── SKILL.md
│   └── .openskills.json
└── ...
```

**Explicación**:
- Cada habilidad tiene su propio directorio
- `SKILL.md` es el contenido central de la habilidad
- `.openskills.json` registra la fuente de instalación y metadatos (usado para actualizaciones)

---

### Paso 3: Instalar habilidades globalmente

**Por qué**
Entender el comando y el efecto de la instalación global.

Ejecuta:

```bash
# Instalar una habilidad globalmente
npx openskills install anthropics/skills --global -y

# Ver la lista de habilidades nuevamente
npx openskills list
```

**Lo que deberías ver**:

```
  codebase-reviewer         (project)
    Review code changes for issues...
  file-writer              (global)
    Write files with format...

Summary: 1 project, 2 global (3 total)
```

**Explicación**:
- Después de usar el flag `--global`, las habilidades se instalan en `~/.claude/skills/`
- El comando `list` muestra la etiqueta `(global)`
- Las habilidades con el mismo nombre usarán preferentemente la versión local del proyecto (prioridad de búsqueda)

---

### Paso 4: Comparar las dos ubicaciones de instalación

**Por qué**
A través de una comparación real, entender las diferencias entre las dos ubicaciones de instalación.

Ejecuta los siguientes comandos:

```bash
# Ver el directorio de habilidades instaladas globalmente
ls -la ~/.claude/skills/

# Comparar habilidades instaladas localmente en el proyecto y globalmente
echo "=== Project Skills ==="
ls .claude/skills/

echo "=== Global Skills ==="
ls ~/.claude/skills/
```

**Lo que deberías ver**:

```
=== Project Skills ===
codebase-reviewer
file-writer

=== Global Skills ===
codebase-reviewer
file-writer
test-generator
```

**Explicación**:
- Habilidades locales del proyecto: `./.claude/skills/`
- Habilidades globales: `~/.claude/skills/`
- Los dos directorios pueden contener habilidades con el mismo nombre, pero la versión local del proyecto tiene mayor prioridad

---

### Paso 5: Verificar la prioridad de búsqueda

**Por qué**
Entender cómo OpenSkills busca habilidades en múltiples ubicaciones.

Ejecuta:

```bash
# Instalar habilidades con el mismo nombre en ambas ubicaciones
npx openskills install anthropics/skills -y  # Local del proyecto
npx openskills install anthropics/skills --global -y  # Global

# Leer la habilidad (usará preferentemente la versión local del proyecto)
npx openskills read codebase-reviewer | head -5
```

**Lo que deberías ver**: La salida es el contenido de la versión local del proyecto de la habilidad.

**Reglas de prioridad de búsqueda** (código fuente `dirs.ts:18-24`):

```typescript
export function getSearchDirs(): string[] {
  return [
    join(process.cwd(), '.claude/skills'),   // 1. Local del proyecto (máxima prioridad)
    join(homedir(), '.claude/skills'),       // 2. Global
  ];
}
```

**Explicación**:
- Las habilidades locales del proyecto tienen mayor prioridad que las globales
- Cuando existen habilidades con el mismo nombre al mismo tiempo, se usa preferentemente la versión local del proyecto
- Esto permite una configuración flexible de "proyecto anula global"

---

## Punto de Control ✅

Completa las siguientes verificaciones para confirmar que has dominado el contenido de esta lección:

- [ ] Puedes distinguir entre instalación local del proyecto y instalación global
- [ ] Conoces el propósito del flag `--global`
- [ ] Entiendes las reglas de prioridad de búsqueda de habilidades
- [ ] Puedes elegir la ubicación de instalación adecuada según el escenario
- [ ] Sabes cómo ver las etiquetas de ubicación de las habilidades instaladas

---

## Evita Errores Comunes

### Error Común 1: Uso indebido de la instalación global

**Escenario de error**: Instalar globalmente habilidades específicas del proyecto

```bash
# ❌ Error: las reglas de negocio del equipo no deberían instalarse globalmente
npx openskills install my-company/rules --global
```

**Problema**:
- Otros miembros del equipo no pueden obtener la habilidad
- La habilidad no está bajo control de versiones
- Puede causar conflictos con habilidades de otros proyectos

**Enfoque correcto**:

```bash
# ✅ Correcto: habilidades específicas del proyecto usan instalación predeterminada (local del proyecto)
npx openskills install my-company/rules
```

---

### Error Común 2: Olvidar el flag `--global`

**Escenario de error**: Quieres compartir habilidades entre todos los proyectos, pero olvidaste agregar `--global`

```bash
# ❌ Error: instalación predeterminada en el local del proyecto, otros proyectos no pueden usarla
npx openskills install universal-tool
```

**Problema**:
- La habilidad solo se instala en `./.claude/skills/` del proyecto actual
- Al cambiar a otros proyectos, necesitas reinstalar

**Enfoque correcto**:

```bash
# ✅ Correcto: herramientas genéricas usan instalación global
npx openskills install universal-tool --global
```

---

### Error Común 3: Conflicto de habilidades con el mismo nombre

**Escenario de error**: Se instalaron habilidades con el mismo nombre tanto en el local del proyecto como en global, pero se espera usar la versión global

```bash
# codebase-reviewer existe tanto en local del proyecto como en global
# pero quieres usar la versión global (nueva)
npx openskills install codebase-reviewer --global  # Instalar nueva versión
npx openskills read codebase-reviewer  # ❌ Todavía lee la versión antigua
```

**Problema**:
- La versión local del proyecto tiene mayor prioridad
- Incluso si se instala una nueva versión globalmente, aún se lee la versión local del proyecto antigua

**Enfoque correcto**:

```bash
# Solución 1: Eliminar la versión local del proyecto
npx openskills remove codebase-reviewer  # Eliminar local del proyecto
npx openskills read codebase-reviewer  # ✅ Ahora lee la versión global

# Solución 2: Actualizar en local del proyecto
npx openskills update codebase-reviewer  # Actualizar la versión local del proyecto
```

---

## Resumen de Esta Lección

**Puntos Clave**:

1. **Instalación predeterminada en local del proyecto**: Las habilidades se instalan en `./.claude/skills/`, solo visibles para el proyecto actual
2. **Instalación global usa `--global`**: Las habilidades se instalan en `~/.claude/skills/`, compartidas por todos los proyectos
3. **Prioridad de búsqueda**: Local del proyecto > Global
4. **Principio recomendado**: Habilidades específicas del proyecto usan local, herramientas genéricas usan global

**Flujo de Decisión**:

```
[Necesitas instalar habilidades] → [¿Es específica del proyecto?]
                      ↓ Sí
              [Instalación local del proyecto (predeterminado)]
                      ↓ No
              [¿Necesita control de versiones?]
                      ↓ Sí
              [Instalación local del proyecto (puede enviar a Git)]
                      ↓ No
              [Instalación global (--global)]
```

**Mnemotecnia**:

- **Local del Proyecto**: Las habilidades siguen al proyecto, colaboración en equipo sin preocupaciones
- **Instalación Global**: Herramientas genéricas en global, todos los proyectos pueden usarlas

---

## Próxima Lección

> En la próxima lección aprenderemos **[Listar Habilidades Instaladas](../list-skills/)**.
>
> Aprenderás:
> - Cómo ver todas las habilidades instaladas
> - Entender el significado de las etiquetas de ubicación de habilidades
> - Cómo contar la cantidad de habilidades del proyecto y globales
> - Cómo filtrar habilidades por ubicación

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-24

| Funcionalidad | Ruta del Archivo | Línea |
|--- | --- | ---|
| Determinación de ubicación de instalación | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L84-L92) | 84-92 |
| Utilidades de rutas de directorio | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts#L7-L25) | 7-25 |
| Visualización de lista de habilidades | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts#L20-L43) | 20-43 |

**Constantes clave**:
- `.claude/skills`: Directorio predeterminado de habilidades (compatible con Claude Code)
- `.agent/skills`: Directorio de habilidades genéricas (entorno multiagente)

**Funciones clave**:
- `getSkillsDir(projectLocal, universal)`: Devuelve la ruta del directorio de habilidades según el flag
- `getSearchDirs()`: Devuelve la lista de directorios de búsqueda de habilidades (ordenados por prioridad)
- `listSkills()`: Lista todas las habilidades instaladas, mostrando etiquetas de ubicación

**Reglas de negocio**:
- Instalación predeterminada en local del proyecto (`!options.global`)
- Prioridad de búsqueda de habilidades: local del proyecto > global
- El comando `list` muestra etiquetas `(project)` y `(global)`

</details>
