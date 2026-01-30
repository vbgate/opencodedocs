---
title: "Revisión de código: Revisión visual de Git Diff | plannotator"
sidebarTitle: "Revisar código modificado por Agent"
subtitle: "Revisión de código: Revisión visual de Git Diff"
description: "Aprende la función de revisión de código de Plannotator. Usa la interfaz visual para revisar Git Diff, alterna entre vistas side-by-side y unified, añade comentarios a nivel de línea y envía retroalimentación al AI Agent."
tags:
  - "Revisión de código"
  - "Git Diff"
  - "Comentarios a nivel de línea"
  - "Side-by-side"
  - "Unified"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 4
---

# Fundamentos de revisión de código: Revisar Git Diff con /plannotator-review

## Lo que aprenderás

- ✅ Usar el comando `/plannotator-review` para revisar Git Diff
- ✅ Alternar entre vistas side-by-side y unified
- ✅ Hacer clic en números de línea para seleccionar rangos de código y añadir comentarios a nivel de línea
- ✅ Añadir diferentes tipos de comentarios (comment/suggestion/concern)
- ✅ Alternar entre diferentes tipos de diff (uncommitted/staged/last commit/branch)
- ✅ Enviar retroalimentación de revisión al AI Agent

## Tu situación actual

**Problema 1**: Al ver cambios de código con `git diff`, la salida se desplaza en la terminal, dificultando la comprensión completa de las modificaciones.

**Problema 2**: Al dar retroalimentación al Agent sobre problemas de código, solo puedes describir con texto "hay un problema en la línea 10", "modifica esta función", lo que genera ambigüedad.

**Problema 3**: No sabes qué archivos modificó exactamente el Agent, es difícil enfocarse en las partes clave entre muchos cambios.

**Problema 4**: Después de revisar el código, quieres enviar retroalimentación estructurada al Agent para que lo modifique según las sugerencias.

**Plannotator te ayuda**:
- Visualiza Git Diff, soporta vistas side-by-side y unified
- Haz clic en números de línea para seleccionar rangos de código y marcar problemas con precisión
- Añade comentarios a nivel de línea (comment/suggestion/concern) con código sugerido
- Alterna con un clic entre tipos de diff (uncommitted, staged, last commit, branch)
- Los comentarios se convierten automáticamente en Markdown, el Agent entiende tu retroalimentación con precisión

## Cuándo usar esto

**Casos de uso**:
- El Agent completa modificaciones de código y necesitas revisar los cambios
- Antes de hacer commit, quieres revisar completamente tus cambios
- Al colaborar con el equipo, necesitas dar retroalimentación estructurada sobre problemas de código
- Quieres alternar entre múltiples tipos de diff (uncommitted vs staged vs last commit)

**Casos no aplicables**:
- Revisar planes de implementación generados por IA (usa la función de revisión de planes)
- Usar `git diff` directamente en la terminal (no necesitas interfaz visual)

## 🎒 Antes de empezar

**Requisitos previos**:
- ✅ Tener instalado Plannotator CLI (ver [Inicio rápido](../../start/getting-started/))
- ✅ Tener configurado el plugin de Claude Code u OpenCode (ver la guía de instalación correspondiente)
- ✅ El directorio actual está en un repositorio Git

**Cómo activarlo**:
- Ejecuta el comando `/plannotator-review` en Claude Code u OpenCode

## Concepto principal

### Qué es la revisión de código

**La revisión de código** es la herramienta de revisión visual de Git Diff que proporciona Plannotator, permitiéndote ver cambios de código en el navegador y añadir comentarios a nivel de línea.

::: info ¿Por qué necesitas revisión de código?
Después de que el AI Agent completa modificaciones de código, normalmente muestra el contenido de git diff en la terminal. Esta forma de texto plano dificulta la comprensión completa de los cambios y no es conveniente para marcar con precisión las ubicaciones de problemas. Plannotator proporciona una interfaz visual (side-by-side o unified), soporta hacer clic en números de línea para añadir comentarios, y envía retroalimentación estructurada al Agent para que modifique el código según las sugerencias.
:::

### Flujo de trabajo

```
┌─────────────────┐
│  Usuario       │
│  (ejecuta      │
│  comando)      │
└────────┬────────┘
         │
         │ /plannotator-review
         ▼
┌─────────────────┐
│  CLI           │
│  (ejecuta git) │
│  git diff HEAD │
└────────┬────────┘
         │
         │ rawPatch + gitRef
         ▼
┌─────────────────┐
│ Review Server  │  ← Servidor local inicia
│  /api/diff     │
└────────┬────────┘
         │
         │ Navegador abre UI
         ▼
┌─────────────────┐
│ Review UI      │
│                │
│ ┌───────────┐ │
│ │ File Tree  │ │
│ │ (lista de  │ │
│ │ archivos)  │ │
│ └───────────┘ │
│       │        │
│       ▼        │
│ ┌───────────┐ │
│ │ DiffViewer │ │
│ │ (comparar  │ │
│ │ código)    │ │
│ │ split/     │ │
│ │ unified    │ │
│ └───────────┘ │
│       │        │
│       │ Clic en número de línea
│       ▼        │
│ ┌───────────┐ │
│ │ Añadir     │ │
│ │ comentario │ │
│ │ comment/   │ │
│ │ suggestion/│ │
│ │ concern    │ │
│ └───────────┘ │
│       │        │
│       ▼        │
│ ┌───────────┐ │
│ │ Enviar     │ │
│ │ retro-     │ │
│ │ alimenta-  │ │
│ │ ción       │ │
│ │ Send       │ │
│ │ Feedback   │ │
│ │ o LGTM     │ │
│ └───────────┘ │
└────────┬────────┘
         │
         │ Retroalimentación en formato Markdown
         ▼
┌─────────────────┐
│  AI Agent      │
│  (modifica     │
│  según         │
│  sugerencias)  │
└─────────────────┘
```

### Modos de vista

| Modo de vista | Descripción | Caso de uso |
| --- | --- | --- |
| **Split (Side-by-side)** | Pantalla dividida, código antiguo a la izquierda, código nuevo a la derecha | Comparar grandes cambios, ver claramente antes y después |
| **Unified** | Fusionado verticalmente, eliminaciones y adiciones en la misma columna | Ver pequeños cambios, ahorrar espacio vertical |

### Tipos de comentarios

Plannotator soporta tres tipos de comentarios de código:

| Tipo de comentario | Propósito | Representación en UI |
| --- | --- | --- |
| **Comment** | Comentar una línea de código, plantear preguntas o explicaciones | Marcado con borde morado/azul |
| **Suggestion** | Proporcionar sugerencias específicas de modificación de código | Marcado con borde verde, con bloque de código sugerido |
| **Concern** | Marcar problemas potenciales que necesitan atención | Marcado con borde amarillo/naranja |

::: tip Diferencias entre tipos de comentarios
- **Comment**: Para preguntas, explicaciones, retroalimentación general
- **Suggestion**: Para proporcionar soluciones específicas de modificación de código (con código sugerido)
- **Concern**: Para marcar problemas que necesitan corrección o riesgos potenciales
:::

### Tipos de Diff

| Tipo de Diff | Comando Git | Descripción |
| --- | --- | --- |
| **Uncommitted** | `git diff HEAD` | Cambios no confirmados (predeterminado) |
| **Staged** | `git diff --staged` | Cambios en staging |
| **Unstaged** | `git diff` | Cambios no en staging |
| **Last commit** | `git diff HEAD~1..HEAD` | Contenido del último commit |
| **Branch** | `git diff main..HEAD` | Comparación entre rama actual y rama predeterminada |

## Paso a paso

### Paso 1: Activar la revisión de código

Ejecuta el comando `/plannotator-review` en Claude Code u OpenCode:

```
Usuario: /plannotator-review

CLI: Ejecutando git diff...
     Navegador abierto
```

**Deberías ver**:
1. El navegador abre automáticamente la interfaz de revisión de código de Plannotator
2. El lado izquierdo muestra la lista de archivos (File Tree)
3. El lado derecho muestra el Diff Viewer (vista split predeterminada)
4. En la parte superior hay botones para cambiar de vista (Split/Unified)
5. En la parte inferior hay botones "Send Feedback" y "LGTM"

### Paso 2: Explorar la lista de archivos

En el File Tree del lado izquierdo, ve los archivos modificados:

- Los archivos se muestran agrupados por ruta
- Cada archivo muestra estadísticas de cambios (additions/deletions)
- Haz clic en un archivo para cambiar al contenido diff correspondiente

**Deberías ver**:
```
src/
  auth/
    login.ts          (+12, -5)  ← Clic para ver el diff de este archivo
    user.ts          (+8, -2)
  api/
    routes.ts        (+25, -10)
```

### Paso 3: Cambiar modo de vista

En la parte superior de la página, haz clic en los botones "Split" o "Unified" para cambiar de vista:

**Vista Split** (Side-by-side):
- Código antiguo a la izquierda (fondo gris, líneas rojas de eliminación)
- Código nuevo a la derecha (fondo blanco, líneas verdes de adición)
- Adecuado para comparar grandes cambios

**Vista Unified** (Fusionada):
- Código antiguo y nuevo en la misma columna
- Líneas eliminadas con fondo rojo, líneas añadidas con fondo verde
- Adecuado para ver pequeños cambios

**Deberías ver**:
- Vista Split: Pantalla dividida, comparación clara antes y después de modificaciones
- Vista Unified: Fusionada verticalmente, ahorra espacio vertical

### Paso 4: Seleccionar líneas de código y añadir comentarios

**Añadir comentario Comment**:

1. Pasa el ratón sobre una línea de código, aparecerá un botón `+` junto al número de línea
2. Haz clic en el botón `+`, o directamente en el número de línea para seleccionar esa línea
3. Seleccionar múltiples líneas: Haz clic en el número de línea inicial, mantén presionado Shift y haz clic en el número de línea final
4. En la barra de herramientas emergente, ingresa el contenido del comentario
5. Haz clic en el botón "Add Comment"

**Añadir comentario Suggestion (con código sugerido)**:

1. Sigue los pasos anteriores para añadir un comentario
2. En la barra de herramientas, haz clic en el botón "Add suggested code"
3. En el cuadro de código emergente, ingresa el código sugerido
4. Haz clic en el botón "Add Comment"

**Deberías ver**:
- El comentario se muestra debajo de la línea de código
- Comentario Comment: Marcado con borde morado/azul, muestra el contenido del comentario
- Comentario Suggestion: Marcado con borde verde, muestra el contenido del comentario y el bloque de código sugerido
- La barra lateral derecha muestra la lista de todos los comentarios

### Paso 5: Cambiar tipo de Diff

En la parte superior de la página, selecciona diferentes tipos de diff:

- **Uncommitted changes** (predeterminado): Cambios no confirmados
- **Staged changes**: Cambios en staging
- **Last commit**: Contenido del último commit
- **vs main** (si no estás en la rama predeterminada): Comparación con la rama predeterminada

**Deberías ver**:
- El Diff Viewer se actualiza con el nuevo contenido diff seleccionado
- La lista de archivos se actualiza mostrando las nuevas estadísticas de cambios

### Paso 6: Enviar retroalimentación al Agent

**Send Feedback (Enviar retroalimentación)**:

1. Añade los comentarios necesarios (Comment/Suggestion/Concern)
2. Haz clic en el botón "Send Feedback" en la parte inferior de la página
3. Si no hay comentarios, aparecerá un diálogo de confirmación preguntando si deseas continuar

**LGTM (Looks Good To Me)**:

Si el código no tiene problemas, haz clic en el botón "LGTM".

**Deberías ver**:
- El navegador se cierra automáticamente (retraso de 1.5 segundos)
- La terminal muestra el contenido de la retroalimentación o "LGTM - no changes requested."
- El Agent recibe la retroalimentación y comienza a modificar el código

### Paso 7: Ver el contenido de la retroalimentación (opcional)

Si quieres ver el contenido de la retroalimentación que Plannotator envía al Agent, puedes verlo en la terminal:

```
# Code Review Feedback

## src/auth/login.ts

### Line 15 (new)
Aquí necesitas añadir lógica de manejo de errores.

### Line 20-25 (old)
**Suggested code:**
```typescript
try {
  await authenticate(req);
} catch (error) {
  return res.status(401).json({ error: 'Authentication failed' });
}
```

## src/api/routes.ts

### Line 10 (new)
Esta función carece de validación de entrada.
```

**Deberías ver**:
- La retroalimentación agrupada por archivo
- Cada comentario muestra la ruta del archivo, número de línea, tipo
- Los comentarios Suggestion incluyen bloques de código sugerido

## Punto de verificación ✅

Después de completar los pasos anteriores, deberías poder:

- [ ] Ejecutar el comando `/plannotator-review`, el navegador abre automáticamente la interfaz de revisión de código
- [ ] Ver la lista de archivos modificados en el File Tree
- [ ] Alternar entre vistas Split y Unified
- [ ] Hacer clic en números de línea o botón `+` para seleccionar líneas de código
- [ ] Añadir comentarios Comment, Suggestion, Concern
- [ ] Añadir código sugerido en los comentarios
- [ ] Alternar entre diferentes tipos de diff (uncommitted/staged/last commit/branch)
- [ ] Hacer clic en Send Feedback, el navegador se cierra, la terminal muestra el contenido de la retroalimentación
- [ ] Hacer clic en LGTM, el navegador se cierra, la terminal muestra "LGTM - no changes requested."

**Si algún paso falla**, consulta:
- [Preguntas frecuentes](../../faq/common-problems/)
- [Guía de instalación de Claude Code](../../start/installation-claude-code/)
- [Guía de instalación de OpenCode](../../start/installation-opencode/)

## Errores comunes

**Error común 1**: Después de ejecutar `/plannotator-review`, el navegador no se abre

**Causa**: Puede ser ocupación de puerto o fallo al iniciar el servidor.

**Solución**:
- Verifica si hay mensajes de error en la terminal
- Intenta abrir manualmente la URL mostrada en el navegador
- Si el problema persiste, consulta [Solución de problemas](../../faq/troubleshooting/)

**Error común 2**: Después de hacer clic en el número de línea, no aparece la barra de herramientas

**Causa**: Puede ser porque seleccionaste una línea vacía, o la ventana del navegador es demasiado pequeña.

**Solución**:
- Intenta seleccionar líneas que contengan código
- Amplía la ventana del navegador
- Asegúrate de no haber deshabilitado JavaScript

**Error común 3**: Después de añadir un comentario, el comentario no se muestra debajo del código

**Causa**: Puede ser porque seleccionaste una línea vacía, o la ventana del navegador es demasiado pequeña.

**Solución**:
- Intenta seleccionar líneas que contengan código
- Amplía la ventana del navegador
- Asegúrate de no haber deshabilitado JavaScript
- Verifica si la barra lateral derecha muestra la lista de comentarios

**Error común 4**: Después de hacer clic en Send Feedback, la terminal no muestra el contenido de la retroalimentación

**Causa**: Puede ser un problema de red o error del servidor.

**Solución**:
- Verifica si hay mensajes de error en la terminal
- Intenta reenviar la retroalimentación
- Si el problema persiste, consulta [Solución de problemas](../../faq/troubleshooting/)

**Error común 5**: El Agent recibe la retroalimentación pero no modifica el código según las sugerencias

**Causa**: El Agent puede no haber entendido correctamente la intención de los comentarios.

**Solución**:
- Intenta usar comentarios más explícitos (Suggestion es más explícito que Comment)
- Usa Comment para añadir explicaciones detalladas
- En Suggestion proporciona código sugerido completo
- Si el problema persiste, puedes ejecutar `/plannotator-review` nuevamente para revisar los nuevos cambios

**Error común 6**: Después de cambiar el tipo de diff, la lista de archivos está vacía

**Causa**: Puede ser porque el tipo de diff seleccionado no tiene contenido de cambios.

**Solución**:
- Intenta cambiar de vuelta a "Uncommitted changes"
- Verifica el estado de git, confirma si hay cambios
- Usa `git status` para ver el estado actual

## Resumen de la lección

La revisión de código es la herramienta de revisión visual de Git Diff que proporciona Plannotator:

**Operaciones principales**:
1. **Activar**: Ejecuta `/plannotator-review`, el navegador abre automáticamente la UI
2. **Explorar**: Ve la lista de archivos modificados en el File Tree
3. **Vista**: Alterna entre vistas Split (side-by-side) y Unified
4. **Comentar**: Haz clic en números de línea para seleccionar líneas de código, añade comentarios Comment/Suggestion/Concern
5. **Alternar**: Selecciona diferentes tipos de diff (uncommitted/staged/last commit/branch)
6. **Retroalimentación**: Haz clic en Send Feedback o LGTM, la retroalimentación se envía al Agent

**Modos de vista**:
- **Split (Side-by-side)**: Pantalla dividida, código antiguo a la izquierda, código nuevo a la derecha
- **Unified**: Fusionado verticalmente, eliminaciones y adiciones en la misma columna

**Tipos de comentarios**:
- **Comment**: Comentar una línea de código, plantear preguntas o explicaciones
- **Suggestion**: Proporcionar sugerencias específicas de modificación de código (con código sugerido)
- **Concern**: Marcar problemas potenciales que necesitan atención

**Tipos de Diff**:
- **Uncommitted**: Cambios no confirmados (predeterminado)
- **Staged**: Cambios en staging
- **Unstaged**: Cambios no en staging
- **Last commit**: Contenido del último commit
- **Branch**: Comparación entre rama actual y rama predeterminada

## Próxima lección

> En la próxima lección aprenderemos **[Añadir comentarios de código](../code-review-annotations/)**.
>
> Aprenderás:
> - Cómo usar con precisión los comentarios Comment, Suggestion, Concern
> - Cómo añadir código sugerido y formatearlo para mostrar
> - Cómo editar y eliminar comentarios
> - Mejores prácticas y escenarios comunes de comentarios
> - Cómo seleccionar el lado old/new en la vista side-by-side

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-24

| Funcionalidad | Ruta del archivo | Líneas |
| --- | --- | --- |
| Servidor de revisión de código | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L1-L302) | 1-302 |
| UI de revisión de código | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L1-L150) | 1-150 |
| Componente DiffViewer | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L1-L349) | 1-349 |
| Herramientas Git | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L1-L148) | 1-148 |
| Punto de entrada Hook (review) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L46-L84) | 46-84 |
| Definición de tipos de comentarios de código | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L53-L83) | 53-83 |

**Tipos clave**:
- `CodeAnnotationType`: Enumeración de tipos de comentarios de código (comment, suggestion, concern) (`packages/ui/types.ts:53`)
- `CodeAnnotation`: Interfaz de comentarios de código (`packages/ui/types.ts:55-66`)
- `DiffType`: Enumeración de tipos de Diff (uncommitted, staged, unstaged, last-commit, branch) (`packages/server/git.ts:10-15`)
- `GitContext`: Interfaz de contexto Git (`packages/server/git.ts:22-26`)

**Funciones clave**:
- `startReviewServer()`: Inicia el servidor de revisión de código (`packages/server/review.ts:79`)
- `runGitDiff()`: Ejecuta el comando git diff (`packages/server/git.ts:101`)
- `getGitContext()`: Obtiene el contexto Git (información de rama y opciones de diff) (`packages/server/git.ts:79`)
- `parseDiffToFiles()`: Parsea diff a lista de archivos (`packages/review-editor/App.tsx:48`)
- `exportReviewFeedback()`: Exporta comentarios como retroalimentación en Markdown (`packages/review-editor/App.tsx:86`)

**Rutas de API**:
- `GET /api/diff`: Obtener contenido diff (`packages/server/review.ts:118`)
- `POST /api/diff/switch`: Cambiar tipo de diff (`packages/server/review.ts:130`)
- `POST /api/feedback`: Enviar retroalimentación de revisión (`packages/server/review.ts:222`)
- `GET /api/image`: Obtener imagen (`packages/server/review.ts:164`)
- `POST /api/upload`: Subir imagen (`packages/server/review.ts:181`)
- `GET /api/agents`: Obtener agents disponibles (OpenCode) (`packages/server/review.ts:204`)

**Reglas de negocio**:
- Por defecto ver diff no confirmado (`apps/hook/server/index.ts:55`)
- Soporta cambiar a diff vs main (`packages/server/git.ts:131`)
- Retroalimentación formateada como Markdown (`packages/review-editor/App.tsx:86`)
- Al aprobar envía texto "LGTM" (`packages/review-editor/App.tsx:430`)

</details>
