---
title: "Eliminar Habilidades: Eliminación Interactiva y por Script | OpenSkills"
sidebarTitle: "Eliminación Segura de Habilidades Antiguas"
subtitle: "Eliminar Habilidades: Eliminación Interactiva y por Script"
description: "Aprende las dos formas de eliminar habilidades en OpenSkills: interactiva (manage) y por script (remove). Conoce los casos de uso, confirmación de ubicación y solución de problemas comunes para limpiar tu repositorio de habilidades de forma segura."
tags:
  - "Gestión de Habilidades"
  - "Uso de Comandos"
  - "CLI"
prerequisite:
  - "start-installation"
  - "start-first-skill"
  - "platforms-list-skills"
order: 6
---

# Eliminar Habilidades

## Lo Que Podrás Hacer Después de Aprender Esto

- Usar `openskills manage` para eliminar múltiples habilidades de forma interactiva
- Usar `openskills remove` para eliminar habilidades específicas mediante script
- Entender los escenarios de uso de ambos métodos de eliminación
- Confirmar si la eliminación es en la ubicación project o global
- Limpiar de forma segura las habilidades que ya no necesitas

## La Situación en la Que Te Encuentras

A medida que aumentan las habilidades instaladas, puedes encontrar estos problemas:

- "Algunas habilidades ya no las uso, quiero eliminar algunas, pero eliminar una por una es muy tedioso"
- "Quiero eliminar habilidades automáticamente en un script, pero el comando manage requiere selección interactiva"
- "No estoy seguro si la habilidad está instalada en project o global, quiero confirmar antes de eliminar"
- "Al eliminar en lote, tengo miedo de eliminar por error las que todavía uso"

OpenSkills proporciona dos métodos de eliminación para resolver estos problemas: **interactivo manage** (adecuado para seleccionar manualmente múltiples habilidades) y **por script remove** (adecuado para eliminar con precisión una sola habilidad).

## Cuándo Usar Este Método

| Escenario | Método Recomendado | Comando |
|---|---|---|
| Eliminar múltiples habilidades manualmente | Selección interactiva | `openskills manage` |
| Eliminar automáticamente en script o CI/CD | Especificar nombre de habilidad con precisión | `openskills remove <nombre>` |
| Solo sé el nombre de la habilidad, quiero eliminar rápidamente | Eliminación directa | `openskills remove <nombre>` |
| Quiero ver qué habilidades se pueden eliminar | Listar primero, luego eliminar | `openskills list` → `openskills manage` |

## Idea Central

Los dos métodos de eliminación de OpenSkills se aplican a diferentes escenarios:

### Eliminación Interactiva: `openskills manage`

- **Características**: Muestra todas las habilidades instaladas para que marques las que quieres eliminar
- **Aplicable para**: Gestionar manualmente el repositorio de habilidades, eliminar múltiples a la vez
- **Ventajas**: No se elimina por error, se pueden ver todas las opciones de antemano
- **Comportamiento por defecto**: **Ninguna habilidad seleccionada** (para evitar eliminación accidental)

### Eliminación por Script: `openskills remove <nombre>`

- **Características**: Elimina directamente la habilidad especificada
- **Aplicable para**: Scripts, automatización, eliminación precisa
- **Ventajas**: Rápido, sin necesidad de interacción
- **Riesgo**: Si el nombre de la habilidad está mal escrito, dará error, no eliminará otras habilidades

### Principio de Eliminación

Ambos métodos eliminan **todo el directorio de la habilidad** (incluyendo SKILL.md, references/, scripts/, assets/ y todos los demás archivos), sin dejar residuos.

::: tip La eliminación no se puede deshacer
Eliminar una habilidad eliminará todo el directorio de la habilidad y no se puede recuperar. Se recomienda confirmar antes de eliminar si la habilidad ya no se necesita, o simplemente reinstalarla.
:::

## Hazlo Conmigo

### Paso 1: Eliminar Múltiples Habilidades de Forma Interactiva

**Por qué**
Cuando tienes múltiples habilidades para eliminar, la selección interactiva es más segura e intuitiva

Ejecuta el siguiente comando:

```bash
npx openskills manage
```

**Lo que deberías ver**

Primero verás una lista de todas las habilidades instaladas (ordenadas por project/global):

```
? Select skills to remove:
❯◯ pdf                         (project)
 ◯ code-analyzer                (project)
 ◯ email-reader                 (global)
 ◯ git-tools                    (global)
```

- **Azul** `(project)`: habilidades a nivel de proyecto
- **Gris** `(global)`: habilidades a nivel global
- **Espacio**: marcar/desmarcar
- **Enter**: confirmar eliminación

Supongamos que marcas `pdf` y `git-tools`, luego presionas Enter:

**Lo que deberías ver**

```
✅ Removed: pdf (project)
✅ Removed: git-tools (global)

✅ Removed 2 skill(s)
```

::: info Ninguna seleccionada por defecto
El comando manage **no selecciona ninguna habilidad por defecto**, esto es para prevenir eliminación accidental. Necesitas usar la barra espaciadora para marcar manualmente las habilidades que quieres eliminar.
:::

### Paso 2: Eliminar Una Habilidad por Script

**Por qué**
Cuando sabes el nombre de la habilidad y quieres eliminarla rápidamente

Ejecuta el siguiente comando:

```bash
npx openskills remove pdf
```

**Lo que deberías ver**

```
✅ Removed: pdf
   From: project (/Users/yourname/project/.claude/skills/pdf)
```

Si la habilidad no existe:

```
Error: Skill 'pdf' not found
```

El programa saldrá y devolverá el código de error 1 (adecuado para la verificación en scripts).

### Paso 3: Confirmar Ubicación de Eliminación

**Por qué**
Confirmar la ubicación de la habilidad (project vs global) antes de eliminar, para evitar eliminación accidental

Al eliminar una habilidad, el comando mostrará la ubicación de eliminación:

```bash
# La eliminación por script mostrará la ubicación detallada
npx openskills remove pdf
✅ Removed: pdf
   From: project (/Users/yourname/project/.claude/skills/pdf)

# La eliminación interactiva también mostrará la ubicación de cada habilidad
npx openskills manage
# Marcar y presionar Enter
✅ Removed: pdf (project)
✅ Removed: git-tools (global)
```

**Regla de juicio**:
- Si la ruta contiene el directorio del proyecto actual → `(project)`
- Si la ruta contiene el directorio home → `(global)`

### Paso 4: Verificación Después de Eliminar

**Por qué**
Confirmar que la eliminación fue exitosa, para evitar omisiones

Después de eliminar la habilidad, usa el comando list para verificar:

```bash
npx openskills list
```

**Lo que deberías ver**

Las habilidades eliminadas ya no aparecerán en la lista.

## Puntos de Verificación ✅

Confirma el siguiente contenido:

- [ ] Ejecutar `openskills manage` muestra la lista de todas las habilidades
- [ ] Puedes marcar/desmarcar habilidades con la barra espaciadora
- [ ] Por defecto no hay ninguna habilidad seleccionada (prevenir eliminación accidental)
- [ ] Ejecutar `openskills remove <nombre>` elimina la habilidad especificada
- [ ] Al eliminar muestra si es en ubicación project o global
- [ ] Después de eliminar, usar `openskills list` para verificar que la habilidad desapareció

## Advertencias de Errores Comunes

### Problema Común 1: Eliminar por Error una Habilidad que Todavía se Usa

**Síntoma**: Después de eliminar, descubres que la habilidad todavía se usa

**Solución**:

Simplemente reinstala:

```bash
# Si se instaló desde GitHub
npx openskills install anthropics/skills

# Si se instaló desde ruta local
npx openskills install ./ruta/a/la/habilidad
```

OpenSkills registra el origen de la instalación (en el archivo `.openskills.json`), al reinstalar no perderás la información de la ruta original.

### Problema Común 2: El Comando manage Muestra "No skills installed"

**Síntoma**: Ejecutar `openskills manage` indica que no hay habilidades instaladas

**Causa**: En el directorio actual realmente no hay habilidades

**Pasos para Investigar**:

1. Verifica si estás en el directorio del proyecto correcto
2. Confirma si hay habilidades globales instaladas (`openskills list --global`)
3. Cambia al directorio donde se instalaron las habilidades e intenta de nuevo

```bash
# Cambiar al directorio del proyecto
cd /ruta/a/tu/proyecto

# Intentar de nuevo
npx openskills manage
```

### Problema Común 3: El Comando remove Reporta "Skill not found"

**Síntoma**: Ejecutar `openskills remove <nombre>` indica que la habilidad no existe

**Causa**: El nombre de la habilidad está mal escrito, o la habilidad ya fue eliminada

**Pasos para Investigar**:

1. Primero usa el comando list para ver el nombre correcto de la habilidad:

```bash
npx openskills list
```

2. Verifica la ortografía del nombre de la habilidad (atención a mayúsculas y guiones)

3. Confirma si la habilidad es project o global (busca en diferentes directorios)

```bash
# Ver habilidades de proyecto
ls -la .claude/skills/

# Ver habilidades globales
ls -la ~/.claude/skills/
```

### Problema Común 4: Después de Eliminar, la Habilidad Sigue en AGENTS.md

**Síntoma**: Después de eliminar la habilidad, AGENTS.md todavía tiene la referencia a esta habilidad

**Causa**: Eliminar la habilidad no actualiza automáticamente AGENTS.md

**Solución**:

Ejecuta de nuevo el comando sync:

```bash
npx openskills sync
```

sync volverá a escanear las habilidades instaladas y actualizará AGENTS.md, las habilidades eliminadas se eliminarán automáticamente de la lista.

## Resumen de Esta Lección

OpenSkills proporciona dos formas de eliminar habilidades:

### Eliminación Interactiva: `openskills manage`

- 🎯 **Escenarios Aplicables**: Gestionar manualmente el repositorio de habilidades, eliminar múltiples habilidades
- ✅ **Ventajas**: Intuitivo, sin eliminación accidental, previsualizable
- ⚠️ **Nota**: Por defecto no hay ninguna habilidad seleccionada, requiere marcar manualmente

### Eliminación por Script: `openskills remove <nombre>`

- 🎯 **Escenarios Aplicables**: Scripts, automatización, eliminación precisa
- ✅ **Ventajas**: Rápido, sin necesidad de interacción
- ⚠️ **Nota**: Si el nombre de la habilidad está mal escrito, dará error

**Puntos Clave**:

1. Ambas formas eliminan todo el directorio de la habilidad (no se puede deshacer)
2. Al eliminar se muestra si es en ubicación project o global
3. Después de eliminar, usa `openskills list` para verificar
4. Recuerda ejecutar `openskills sync` nuevamente para actualizar AGENTS.md

## Próxima Lección

> En la próxima lección aprenderemos **[Modo Universal: Entornos Multi-Agente](../../advanced/universal-mode/)**.
>
> Aprenderás:
> - Cómo usar el flag `--universal` para evitar conflictos con Claude Code
> - Gestión unificada de habilidades en entornos multi-agente
> - La función del directorio `.agent/skills`

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Funcionalidad | Ruta del Archivo | Líneas |
|---|---|---|
| Implementación del comando manage | [`src/commands/manage.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/manage.ts) | 10-62 |
| Implementación del comando remove | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts) | 8-21 |
| Buscar todas las habilidades | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 30-64 |
| Buscar habilidad específica | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 66-90 |

**Funciones Clave**:
- `manageSkills()`: Eliminación interactiva de habilidades, usa inquirer checkbox para permitir al usuario seleccionar
- `removeSkill(skillName)`: Eliminación por script de una habilidad especificada, sale con error si no se encuentra
- `findAllSkills()`: Recorre 4 directorios de búsqueda, recopila todas las habilidades
- `findSkill(skillName)`: Busca una habilidad especificada, devuelve objeto Skill

**Constantes Clave**:
- Ninguna (todas las rutas y configuraciones se calculan dinámicamente)

**Lógica Central**:

1. **Comando manage** (src/commands/manage.ts):
   - Llama a `findAllSkills()` para obtener todas las habilidades (línea 11)
   - Ordena por project/global (líneas 20-25)
   - Usa inquirer `checkbox` para permitir al usuario seleccionar (líneas 33-37)
   - Por defecto `checked: false`, no se selecciona ninguna habilidad (línea 30)
   - Recorre las habilidades seleccionadas, llama a `rmSync` para eliminar (líneas 45-52)

2. **Comando remove** (src/commands/remove.ts):
   - Llama a `findSkill(skillName)` para buscar la habilidad (línea 9)
   - Si no se encuentra, muestra error y `process.exit(1)` (líneas 12-14)
   - Llama a `rmSync` para eliminar todo el directorio de la habilidad (línea 16)
   - Determina si es project o global mediante `homedir()` (línea 18)

3. **Operación de Eliminación**:
   - Usa `rmSync(baseDir, { recursive: true, force: true })` para eliminar todo el directorio de la habilidad
   - `recursive: true`: elimina recursivamente todos los subarchivos y subdirectorios
   - `force: true`: ignora errores de archivos inexistentes

</details>
