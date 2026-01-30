---
title: "Anotaciones de Código: Comentarios a Nivel de Línea | Plannotator"
subtitle: "Anotaciones de Código: Comentarios a Nivel de Línea"
sidebarTitle: "Anotaciones en 5 min"
description: "Aprende la función de anotaciones de código de Plannotator. Agrega comentarios precisos a nivel de línea en diffs (comment/suggestion/concern), adjunta código sugerido, marca puntos de riesgo, gestiona todas las anotaciones y exporta feedback."
tags:
  - "revisión de código"
  - "anotaciones"
  - "diff"
  - "comment"
  - "suggestion"
  - "concern"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
  - "platforms-code-review-basics"
order: 5
---

# Agregar Anotaciones de Código: Comentarios, Sugerencias y Preocupaciones a Nivel de Línea

## Lo Que Aprenderás

- ✅ Agregar anotaciones a nivel de línea en diffs de código (comment/suggestion/concern)
- ✅ Proporcionar código sugerido (suggestedCode) para modificaciones
- ✅ Marcar segmentos de código que requieren atención (concern)
- ✅ Ver y gestionar todas las anotaciones (barra lateral)
- ✅ Entender los casos de uso de los tres tipos de anotaciones
- ✅ Exportar feedback en formato Markdown

## Tu Situación Actual

**Problema 1**: Al revisar cambios de código, solo puedes ver el diff en la terminal y escribir "hay un problema en la línea 3" o "sugiero cambiar a XXX", sin precisión en la ubicación.

**Problema 2**: Algunos códigos solo quieres comentarlos (comment), otros quieres sugerir modificaciones (suggestion), y otros son problemas serios que necesitan atención (concern), pero no tienes herramientas para distinguirlos.

**Problema 3**: Quieres dar sugerencias de modificación para una función, pero no sabes cómo pasar el fragmento de código a la IA.

**Problema 4**: Después de agregar múltiples anotaciones, olvidas qué partes has revisado, sin una vista general.

**Plannotator te ayuda**:
- Haz clic en el número de línea para seleccionar el rango de código, preciso hasta la línea
- Tres tipos de anotaciones (comment/suggestion/concern) corresponden a diferentes escenarios
- Puedes adjuntar código sugerido, la IA ve directamente la propuesta de modificación
- La barra lateral lista todas las anotaciones, salta con un clic

## Cuándo Usar Esta Técnica

**Casos de uso**:
- Después de ejecutar el comando `/plannotator-review` para ver cambios de código
- Cuando necesitas dar feedback sobre líneas de código específicas
- Cuando quieres proporcionar sugerencias de modificación de código a la IA
- Cuando necesitas marcar problemas potenciales o puntos de riesgo

**Casos no aplicables**:
- Revisar planes de implementación generados por IA (usa la función de revisión de planes)
- Solo necesitas navegar rápidamente por el diff (usa las funciones básicas de revisión de código)

## 🎒 Preparación Antes de Comenzar

**Prerrequisitos**:
- ✅ Plannotator CLI instalado (ver [Inicio Rápido](../../start/getting-started/))
- ✅ Conocimientos básicos de revisión de código (ver [Fundamentos de Revisión de Código](../code-review-basics/))
- ✅ Repositorio Git local con cambios sin confirmar

**Método de activación**:
- Ejecuta el comando `/plannotator-review` en OpenCode o Claude Code

## Concepto Principal

### Qué Son las Anotaciones de Código

Las **anotaciones de código** son la función principal de revisión de código de Plannotator, usadas para agregar feedback a nivel de línea en diffs de Git. Al hacer clic en los números de línea para seleccionar rangos de código, puedes agregar comentarios, sugerencias o preocupaciones precisamente a líneas de código específicas. Las anotaciones se muestran debajo del diff, facilitando que la IA entienda con precisión tu intención de feedback.

::: info ¿Por qué necesitas anotaciones de código?
En la revisión de código, necesitas dar feedback sobre líneas de código específicas. Si solo describes con texto "hay un problema en la línea 5" o "sugiero cambiar a XXX", la IA necesita localizar el código por sí misma, lo cual es propenso a errores. Plannotator te permite hacer clic en los números de línea para seleccionar rangos de código, agregar anotaciones directamente en esa ubicación. Las anotaciones se muestran debajo del diff (estilo GitHub), para que la IA pueda ver exactamente a qué código te refieres con tus sugerencias.
:::

### Flujo de Trabajo

```
┌─────────────────┐
│  /plannotator-   │  Comando de activación
│  review          │
└────────┬────────┘
         │
         │ Ejecutar git diff
         ▼
┌─────────────────┐
│  Diff Viewer    │  ← Mostrar diff de código
│  (split/unified) │
└────────┬────────┘
         │
         │ Clic en número de línea / Hover +
         ▼
┌─────────────────┐
│  Seleccionar    │
│  rango de código│
│  (lineStart-    │
│   lineEnd)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Agregar        │  ← Aparece barra de herramientas
│  anotación      │     Completar contenido del comentario
│  - Comment     │     Opcional: proporcionar código sugerido
│  - Suggestion  │
│  - Concern     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Mostrar        │  Debajo del diff
│  anotación      │  Barra lateral lista todas las anotaciones
│  (estilo GitHub)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Exportar       │  Send Feedback
│  feedback       │  IA recibe feedback estructurado
│  (Markdown)     │
└─────────────────┘
```

### Tipos de Anotaciones

Plannotator soporta tres tipos de anotaciones de código, cada uno con diferentes propósitos:

| Tipo de Anotación | Propósito | Escenario Típico | Código Sugerido |
| --- | --- | --- | --- |
| **Comment** | Comentar un segmento de código, proporcionar feedback general | "Esta lógica se puede simplificar", "El nombre de la variable no es muy claro" | Opcional |
| **Suggestion** | Proporcionar sugerencias específicas de modificación de código | "Sugiero usar map en lugar de for loop", "Usar await en lugar de Promise.then" | Recomendado |
| **Concern** | Marcar problemas potenciales o puntos de riesgo | "Esta consulta SQL puede tener problemas de rendimiento", "Falta manejo de errores" | Opcional |

::: tip Consejos para elegir el tipo de anotación
- **Comment**: Usa para "sugerir pero no obligar", como estilo de código, dirección de optimización
- **Suggestion**: Usa para "recomendar fuertemente modificar", y tienes una propuesta de modificación clara
- **Concern**: Usa para "problemas que deben notarse", como bugs, riesgos de rendimiento, vulnerabilidades de seguridad
:::

### Comment vs Suggestion vs Concern

| Escenario | Tipo a Elegir | Texto de Ejemplo |
| --- | --- | --- |
| El código funciona, pero hay espacio para optimización | Comment | "Esto se puede simplificar con async/await" |
| El código tiene una propuesta de mejora clara | Suggestion | "Sugiero usar `Array.from()` en lugar del operador spread" (con código) |
| Se encontró un bug o problema serio | Concern | "Falta verificación de null aquí, puede causar error en tiempo de ejecución" |

## Sigue los Pasos

### Paso 1: Activar la Revisión de Código

Ejecuta en la terminal:

```bash
/plannotator-review
```

**Deberías ver**:
1. El navegador abre automáticamente la interfaz de revisión de código
2. Muestra el contenido del git diff (por defecto es `git diff HEAD`)
3. A la izquierda está el árbol de archivos, en el centro el diff viewer, a la derecha la barra lateral de anotaciones

### Paso 2: Navegar por el Contenido del Diff

Revisa los cambios de código en el navegador:

- Por defecto usa **vista split** (comparación lado a lado)
- Puedes cambiar a **vista unified** (comparación arriba-abajo)
- Haz clic en los nombres de archivo en el árbol de archivos para cambiar el archivo que estás viendo

### Paso 3: Seleccionar Líneas de Código, Agregar Anotación

**Método uno: Hover y clic en el botón "+"**

1. Pasa el mouse sobre la línea de código donde quieres agregar una anotación
2. Aparecerá un botón **+** a la derecha (solo se muestra en líneas de diff)
3. Haz clic en el botón **+**
4. Aparece la barra de herramientas de anotación

**Método dos: Clic directo en el número de línea**

1. Haz clic en un número de línea (por ejemplo `L10`), selecciona una sola línea
2. Haz clic en otro número de línea (por ejemplo `L15`), selecciona un rango de múltiples líneas
3. Después de seleccionar el rango, la barra de herramientas aparece automáticamente

**Deberías ver**:
- La barra de herramientas muestra el número de línea seleccionado (por ejemplo `Line 10` o `Lines 10-15`)
- La barra de herramientas contiene un campo de texto (`Leave feedback...`)
- Botón opcional "Add suggested code"

### Paso 4: Agregar Anotación Comment

**Escenario**: Proporcionar sugerencias sobre el código, pero no requerir modificación obligatoria

1. Ingresa el contenido del comentario en el campo de texto de la barra de herramientas
2. Opcional: Haz clic en **Add suggested code**, ingresa el código sugerido
3. Haz clic en el botón **Add Comment**

**Ejemplo**:

```
Contenido del comentario: El nombre del parámetro de esta función no es muy claro, sugiero renombrarlo a fetchUserData
```

**Deberías ver**:
- La barra de herramientas desaparece
- La anotación se muestra debajo del diff (caja azul)
- Se agrega un nuevo registro de anotación en la barra lateral
- Si proporcionaste código sugerido, se muestra debajo de la anotación (formato de bloque de código)

### Paso 5: Agregar Anotación Suggestion

**Escenario**: Proporcionar una propuesta clara de modificación de código, esperando que la IA la adopte directamente

1. Ingresa la descripción de la sugerencia en el campo de texto de la barra de herramientas (opcional)
2. Haz clic en **Add suggested code**
3. Ingresa el código sugerido en el campo de código que aparece
4. Haz clic en el botón **Add Comment**

**Ejemplo**:

```
Descripción de la sugerencia: Usar async/await para simplificar la cadena de Promise

Código sugerido:
async function fetchData() {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
```

**Deberías ver**:
- La anotación se muestra debajo del diff (caja azul)
- El código sugerido se muestra en formato de bloque de código, con etiqueta "Suggested:"
- La barra lateral muestra la primera línea del código sugerido (con puntos suspensivos)

### Paso 6: Agregar Anotación Concern

**Escenario**: Marcar problemas potenciales o puntos de riesgo, alertar a la IA

**Nota**: En la versión actual de la UI de Plannotator, el tipo de anotación por defecto es **Comment**. Si necesitas marcar **Concern**, puedes indicarlo explícitamente en el texto de la anotación.

1. Ingresa la descripción de la preocupación en el campo de texto de la barra de herramientas
2. Puedes usar marcadores como `Concern:` o `⚠️` para indicar claramente que es una preocupación
3. Haz clic en el botón **Add Comment**

**Ejemplo**:

```
Concern: Falta verificación de null aquí, si user es null causará error en tiempo de ejecución

Sugerencia de agregar:
if (!user) return null;
```

**Deberías ver**:
- La anotación se muestra debajo del diff
- La barra lateral muestra el contenido de la anotación

### Paso 7: Ver y Gestionar Anotaciones

**Ver todas las anotaciones en la barra lateral**:

1. La barra lateral derecha muestra la lista de todas las anotaciones
2. Cada anotación muestra:
   - Nombre del archivo (último componente de la ruta)
   - Rango de líneas (por ejemplo `L10` o `L10-L15`)
   - Autor (si es revisión colaborativa)
   - Marca de tiempo (por ejemplo `5m`, `2h`, `1d`)
   - Contenido de la anotación (máximo 2 líneas)
   - Vista previa del código sugerido (primera línea)

**Clic en anotación para saltar**:

1. Haz clic en una anotación en la barra lateral
2. El Diff viewer se desplaza automáticamente a la posición correspondiente
3. Esa anotación se resalta

**Eliminar anotación**:

1. Pasa el mouse sobre una anotación en la barra lateral
2. Haz clic en el botón **×** en la esquina superior derecha
3. La anotación se elimina, el resaltado en el diff desaparece

**Deberías ver**:
- La barra lateral muestra el conteo de anotaciones (por ejemplo `Annotations: 3`)
- Después de hacer clic en una anotación, el diff viewer se desplaza suavemente a la línea correspondiente
- Después de eliminar una anotación, el conteo se actualiza

### Paso 8: Exportar Feedback

Después de completar todas las anotaciones, haz clic en el botón **Send Feedback** en la parte inferior de la página.

**Deberías ver**:
- El navegador se cierra automáticamente
- La terminal muestra el contenido del feedback en formato Markdown
- La IA recibe feedback estructurado, puede responder automáticamente

**Formato Markdown exportado**:

```markdown
# Code Review Feedback

## src/app/api/users.ts

### Line 10 (new)
Esta lógica se puede simplificar, sugiero usar async/await

### Lines 15-20 (new)
**Suggested code:**
```typescript
async function fetchUserData() {
  const response = await fetch(url);
  return await response.json();
}
```

### Line 25 (old)
Concern: Falta verificación de null aquí, si user es null causará error en tiempo de ejecución
```

::: tip Copiar feedback
Si necesitas copiar manualmente el contenido del feedback, puedes hacer clic en el botón **Copy Feedback** en la parte inferior de la barra lateral para copiar el feedback en formato Markdown al portapapeles.
:::

## Punto de Verificación ✅

Después de completar los pasos anteriores, deberías poder:

- [ ] Hacer clic en números de línea o el botón "+" en hover para seleccionar líneas de código en el diff
- [ ] Agregar anotaciones Comment (comentarios generales)
- [ ] Agregar anotaciones Suggestion (con código sugerido)
- [ ] Agregar anotaciones Concern (marcar problemas potenciales)
- [ ] Ver todas las anotaciones en la barra lateral, clic para saltar a la posición correspondiente
- [ ] Eliminar anotaciones innecesarias
- [ ] Exportar feedback en formato Markdown
- [ ] Copiar contenido del feedback al portapapeles

**Si algún paso falla**, consulta:
- [Problemas Comunes](../../faq/common-problems/)
- [Fundamentos de Revisión de Código](../code-review-basics/)
- [Solución de Problemas](../../faq/troubleshooting/)

## Errores Comunes

**Error común 1**: Después de hacer clic en el número de línea, la barra de herramientas no aparece

**Causa**: Puede que hayas hecho clic en el nombre del archivo o el número de línea no está en el rango del diff.

**Solución**:
- Asegúrate de hacer clic en el número de línea de una línea de diff (línea verde o roja)
- Para líneas eliminadas (rojas), haz clic en el número de línea izquierdo
- Para líneas agregadas (verdes), haz clic en el número de línea derecho

**Error común 2**: Después de seleccionar múltiples líneas, la anotación se muestra en la posición incorrecta

**Causa**: El lado (old/new) es incorrecto.

**Solución**:
- Verifica si seleccionaste código antiguo (deletions) o código nuevo (additions)
- La anotación se muestra debajo de la última línea del rango
- Si la posición es incorrecta, elimina la anotación y agrégala de nuevo

**Error común 3**: Después de agregar código sugerido, el formato del código está desordenado

**Causa**: El código sugerido puede contener caracteres especiales o problemas de indentación.

**Solución**:
- En el campo de código sugerido, asegúrate de que la indentación sea correcta
- Usa fuente monoespaciada para editar el código sugerido
- Si hay saltos de línea, usa `Shift + Enter` en lugar de Enter directamente

**Error común 4**: No puedo ver la nueva anotación en la barra lateral

**Causa**: La barra lateral puede no haberse actualizado, o la anotación se agregó a otro archivo.

**Solución**:
- Cambia de archivo y vuelve
- Verifica si la anotación se agregó al archivo que estás viendo actualmente
- Actualiza la página del navegador (puede perder anotaciones no enviadas)

**Error común 5**: Después de exportar feedback, la IA no modificó según las sugerencias

**Causa**: La IA puede no haber entendido correctamente la intención de la anotación, o la sugerencia no es factible.

**Solución**:
- Usa anotaciones más claras (Suggestion es más claro que Comment)
- Agrega comentarios en el código sugerido explicando la razón
- Si el problema persiste, puedes enviar feedback de nuevo, ajustando el contenido de la anotación

## Resumen de Esta Lección

Las anotaciones de código son la función principal de revisión de código de Plannotator, permitiéndote dar feedback preciso sobre problemas de código:

**Operaciones principales**:
1. **Activar**: Ejecuta `/plannotator-review`, el navegador abre automáticamente el diff viewer
2. **Navegar**: Ver cambios de código (cambiar entre vista split/unified)
3. **Seleccionar**: Clic en número de línea o botón "+" en hover para seleccionar rango de código
4. **Anotar**: Agregar anotaciones Comment/Suggestion/Concern
5. **Gestionar**: Ver, saltar, eliminar anotaciones en la barra lateral
6. **Exportar**: Send Feedback, la IA recibe feedback estructurado

**Tipos de anotaciones**:
- **Comment**: Comentarios generales, proporcionar sugerencias pero no obligar
- **Suggestion**: Recomendar claramente modificación, adjuntar código sugerido
- **Concern**: Marcar problemas potenciales o puntos de riesgo

**Mejores prácticas**:
- Al usar Suggestion, intenta proporcionar código completo y ejecutable
- Para problemas de rendimiento o seguridad, usa Concern para marcar
- El contenido de la anotación debe ser específico, evita descripciones vagas (como "esto no está bien")
- Puedes adjuntar imágenes para ayudar a explicar (usando la función de marcado de imágenes)

## Próxima Lección

> En la próxima lección aprenderemos **[Cambiar Vistas de Diff](../code-review-diff-types/)**.
>
> Aprenderás:
> - Cómo cambiar entre diferentes tipos de diff (uncommitted/staged/last commit/branch)
> - Casos de uso de diferentes tipos de diff
> - Cómo cambiar rápidamente entre múltiples tipos de diff

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-24

| Función | Ruta del Archivo | Líneas |
| --- | --- | --- |
| Definición de tipo CodeAnnotation | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L53-L56) | 53-56 |
| Interfaz CodeAnnotation | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) | 55-66 |
| Componente DiffViewer | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L1-L349) | 1-349 |
| Componente ReviewPanel | [`packages/review-editor/components/ReviewPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/ReviewPanel.tsx#L1-L211) | 1-211 |
| Exportar feedback Markdown | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L86-L126) | 86-126 |
| Botón "+" en Hover | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L180-L199) | 180-199 |
| Barra de herramientas de anotación | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L267-L344) | 267-344 |
| Renderizado de anotación | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L140-L177) | 140-177 |

**Tipos clave**:
- `CodeAnnotationType`: Tipo de anotación de código ('comment' | 'suggestion' | 'concern') (`packages/ui/types.ts:53`)
- `CodeAnnotation`: Interfaz de anotación de código (`packages/ui/types.ts:55-66`)
- `SelectedLineRange`: Rango de código seleccionado (`packages/ui/types.ts:77-82`)

**Funciones clave**:
- `exportReviewFeedback()`: Convierte anotaciones a formato Markdown (`packages/review-editor/App.tsx:86`)
- `renderAnnotation()`: Renderiza anotación en el diff (`packages/review-editor/components/DiffViewer.tsx:140`)
- `renderHoverUtility()`: Renderiza botón "+" en Hover (`packages/review-editor/components/DiffViewer.tsx:180`)

**Rutas de API**:
- `POST /api/feedback`: Enviar feedback de revisión (`packages/server/review.ts`)
- `GET /api/diff`: Obtener git diff (`packages/server/review.ts:111`)
- `POST /api/diff/switch`: Cambiar tipo de diff (`packages/server/review.ts`)

**Reglas de negocio**:
- Por defecto ver diff sin confirmar (`git diff HEAD`) (`packages/server/review.ts:111`)
- La anotación se muestra debajo de la última línea del rango (estilo GitHub) (`packages/review-editor/components/DiffViewer.tsx:81`)
- Soporta adjuntar código sugerido en anotaciones (campo `suggestedCode`) (`packages/ui/types.ts:63`)

</details>
