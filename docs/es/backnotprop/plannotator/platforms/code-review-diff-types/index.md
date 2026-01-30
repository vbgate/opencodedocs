---
title: "Vista Diff: Revisar cambios desde múltiples perspectivas | Plannotator"
sidebarTitle: "Alternar entre 5 vistas diff"
subtitle: "Vista Diff: Revisar cambios desde múltiples perspectivas"
description: "Aprende a alternar entre tipos de diff en la revisión de código de Plannotator. Selecciona vistas uncommitted, staged, last commit o branch desde el menú desplegable para revisar cambios de código desde múltiples perspectivas."
tags:
  - "code-review"
  - "git"
  - "diff"
  - "tutorial"
prerequisite:
  - "code-review-basics"
order: 6
---

# Alternar vista Diff

## Lo que aprenderás

Al revisar código, podrás:
- Usar el menú desplegable para alternar rápidamente entre 5 vistas diff
- Entender el alcance de cambios de código que muestra cada vista
- Seleccionar el tipo de diff apropiado según las necesidades de revisión
- Evitar perder cambios importantes por seleccionar la vista incorrecta

## Tu situación actual

**Al revisar solo ves el área de trabajo, perdiendo archivos en staging**:

Ejecutas el comando `/plannotator-review`, ves algunos cambios de código y añades algunos comentarios. Pero después del commit descubres que la revisión omitió esos archivos que ya habías agregado con `git add` al área de staging—estos archivos simplemente no aparecieron en el diff.

**Quieres conocer la diferencia total entre la rama actual y main**:

Has estado desarrollando en una rama feature durante semanas, quieres ver todos los cambios realizados, pero la vista predeterminada de "cambios no confirmados" solo muestra las modificaciones de los últimos días.

**Quieres comparar diferencias entre dos commits específicos**:

Quieres confirmar si una corrección de bug es correcta, necesitas comparar el código antes y después de la corrección, pero no sabes cómo hacer que Plannotator muestre el diff de commits históricos.

## Cuándo usar esto

- **Revisión completa**: Ver cambios tanto del área de trabajo como del área de staging simultáneamente
- **Antes de fusionar ramas**: Verificar todos los cambios de la rama actual respecto a main/master
- **Revisión de rollback**: Confirmar qué archivos cambió el último commit
- **Colaboración en equipo**: Verificar código que colegas han puesto en staging pero no han confirmado

## Concepto principal

Los comandos git diff tienen muchas variantes, cada variante muestra un rango diferente de código. Plannotator concentra estas variantes en un menú desplegable, para que no necesites recordar comandos git complejos.

::: info Referencia rápida de tipos Git Diff

| Tipo de diff | Alcance mostrado | Escenario de uso típico |
| --- | --- | --- |
| Uncommitted changes | Área de trabajo + staging | Revisar todas las modificaciones del desarrollo actual |
| Staged changes | Solo área de staging | Revisar contenido preparado para commit antes de confirmar |
| Unstaged changes | Solo área de trabajo | Revisar modificaciones que aún no han sido agregadas con `git add` |
| Last commit | Último commit | Rollback o revisar el commit reciente |
| vs main | Rama actual vs rama predeterminada | Verificación completa antes de fusionar rama |

:::

Las opciones del menú desplegable cambian dinámicamente según tu estado Git:
- Si no estás en la rama predeterminada, se mostrará la opción "vs main"
- Si no hay archivos en staging, la vista Staged mostrará "No staged changes"

## Paso a paso

### Paso 1: Iniciar revisión de código

**Por qué**

Necesitas abrir primero la interfaz de revisión de código de Plannotator.

**Operación**

Ejecuta en la terminal:

```bash
/plannotator-review
```

**Deberías ver**

El navegador abre la página de revisión de código, en la parte superior del árbol de archivos del lado izquierdo hay un menú desplegable que muestra el tipo de diff actual (generalmente "Uncommitted changes").

### Paso 2: Cambiar a vista Staged

**Por qué**

Ver archivos que ya han sido agregados con `git add` pero aún no confirmados.

**Operación**

1. Haz clic en el menú desplegable en la parte superior del árbol de archivos del lado izquierdo
2. Selecciona "Staged changes"

**Deberías ver**

- Si hay archivos en staging, el árbol de archivos muestra estos archivos
- Si no hay archivos en staging, el área principal muestra: "No staged changes. Stage some files with git add."

### Paso 3: Cambiar a vista Last Commit

**Por qué**

Revisar el código recién confirmado para asegurar que no hay problemas.

**Operación**

1. Abre nuevamente el menú desplegable
2. Selecciona "Last commit"

**Deberías ver**

- Muestra todos los archivos modificados en el último commit
- El contenido del diff es la diferencia `HEAD~1..HEAD`

### Paso 4: Cambiar a vista vs main (si está disponible)

**Por qué**

Ver todos los cambios de la rama actual respecto a la rama predeterminada.

**Operación**

1. Verifica si hay una opción "vs main" o "vs master" en el menú desplegable
2. Si la hay, selecciónala

**Deberías ver**

- El árbol de archivos muestra todos los archivos con diferencias entre la rama actual y la rama predeterminada
- El contenido del diff son los cambios completos de `main..HEAD`

::: tip Verificar rama actual

Si no ves la opción "vs main", significa que estás en la rama predeterminada. Puedes usar el siguiente comando para ver la rama actual:

```bash
git rev-parse --abbrev-ref HEAD
```

Intenta nuevamente después de cambiar a una rama feature:

```bash
git checkout feature-branch
```

:::

## Punto de verificación ✅

Confirma que has dominado:

- [ ] Puedes encontrar y abrir el menú desplegable de tipos de diff
- [ ] Entiendes la diferencia entre "Uncommitted", "Staged" y "Last commit"
- [ ] Puedes identificar cuándo aparece la opción "vs main"
- [ ] Sabes qué tipo de diff usar en cada escenario

## Errores comunes

### Error 1: Al revisar solo ves Uncommitted, perdiendo archivos Staged

**Síntoma**

Después del commit descubres que la revisión omitió algunos archivos que ya estaban en staging.

**Causa**

La vista Uncommitted muestra todos los cambios del área de trabajo y staging (`git diff HEAD`), los archivos en staging también están incluidos.

**Solución**

Antes de revisar, cambia primero a la vista Staged para verificar, o usa la vista Uncommitted (incluye staging).

### Error 2: No comparar con main antes de fusionar rama

**Síntoma**

Después de fusionar a main descubres que se introdujeron modificaciones no relacionadas.

**Causa**

Solo viste los commits de los últimos días, no comparaste la diferencia de toda la rama respecto a main.

**Solución**

Antes de fusionar usa la vista "vs main" para verificar completamente.

### Error 3: Pensar que cambiar de vista perderá comentarios

**Síntoma**

No te atreves a cambiar el tipo de diff, temiendo que los comentarios añadidos previamente desaparezcan.

**Causa**

Malentendido del mecanismo de cambio.

**Situación real**

Al cambiar el tipo de diff, Plannotator conserva los comentarios anteriores—pueden seguir siendo aplicables, o puedes eliminar manualmente los comentarios no relacionados.

## Resumen de la lección

Los 5 tipos de diff que soporta Plannotator:

| Tipo | Comando Git | Escenario |
| --- | --- | --- |
| Uncommitted | `git diff HEAD` | Revisar todas las modificaciones del desarrollo actual |
| Staged | `git diff --staged` | Revisar área de staging antes de commit |
| Unstaged | `git diff` | Revisar modificaciones del área de trabajo |
| Last commit | `git diff HEAD~1..HEAD` | Rollback o revisar commit reciente |
| vs main | `git diff main..HEAD` | Verificación completa antes de fusionar rama |

Cambiar de vista no perderá comentarios, puedes ver el mismo lote o nuevos comentarios desde diferentes perspectivas.

## Próxima lección

> En la próxima lección aprenderemos **[Compartir URL](../../advanced/url-sharing/)**.
>
> Aprenderás:
> - Cómo comprimir el contenido de revisión en una URL para compartir con colegas
> - Cómo el receptor abre el enlace de revisión compartido
> - Limitaciones y precauciones en modo compartido

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-24

| Funcionalidad | Ruta del archivo | Líneas |
| --- | --- | --- |
| Definición de tipos Diff | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L10-L15) | 10-15 |
| Obtención de contexto Git | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L79-L96) | 79-96 |
| Ejecución de Git Diff | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L101-L147) | 101-147 |
| Manejo de cambio de Diff | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L300-L331) | 300-331 |
| Renderizado de opciones Diff en árbol de archivos | [`packages/review-editor/components/FileTree.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/FileTree.tsx) | - |

**Tipos clave**:

- `DiffType`: `'uncommitted' | 'staged' | 'unstaged' | 'last-commit' | 'branch'`

**Funciones clave**:

- `getGitContext()`: Obtiene la rama actual, rama predeterminada y opciones de diff disponibles
- `runGitDiff(diffType, defaultBranch)`: Ejecuta el comando git correspondiente según el tipo de diff

**API clave**:

- `POST /api/diff/switch`: Cambia el tipo de diff, devuelve nuevos datos de diff

</details>
