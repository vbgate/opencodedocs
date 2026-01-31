---
title: "Anotaciones de plan: Cuatro tipos de anotación | Plannotator"
sidebarTitle: "Añadir cuatro tipos de anotación"
subtitle: "Anotaciones de plan: Cuatro tipos de anotación"
description: "Domina los cuatro tipos de anotación de Plannotator. Aprende a añadir eliminación, reemplazo, inserción y comentarios, con atajos type-to-comment y adjuntos de imagen para mejorar la eficiencia de revisión de planes."
tags:
  - "Anotaciones de plan"
  - "Tipos de anotación"
  - "Eliminación"
  - "Reemplazo"
  - "Inserción"
  - "Comentario"
  - "type-to-comment"
  - "Adjuntos de imagen"
prerequisite:
  - "platforms-plan-review-basics"
order: 2
---

# Añadir anotaciones al plan: Domina los cuatro tipos de anotación

## Lo que aprenderás

- ✅ Seleccionar texto del plan y añadir cuatro tipos diferentes de anotación (eliminación, reemplazo, inserción, comentario)
- ✅ Usar el atajo type-to-comment para escribir comentarios directamente
- ✅ Adjuntar imágenes a las anotaciones (imágenes de referencia, capturas de pantalla, etc.)
- ✅ Comprender el significado y casos de uso de cada tipo de anotación
- ✅ Ver el formato Markdown exportado de las anotaciones

## Tu situación actual

**Problema 1**: Sabes que necesitas eliminar cierto contenido, pero después de seleccionar el texto no sabes qué botón presionar.

**Problema 2**: Quieres reemplazar un fragmento de código, pero la barra de herramientas solo tiene "Eliminar" y "Comentar", no hay opción de "Reemplazar".

**Problema 3**: Seleccionas varias líneas de texto y quieres escribir un comentario directamente, pero cada vez tienes que hacer clic primero en el botón "Comment", lo cual es ineficiente.

**Problema 4**: Quieres adjuntar una imagen de referencia a cierto código, pero no sabes cómo subir imágenes.

**Plannotator te ayuda**:
- Iconos de botones claros, distingue fácilmente entre eliminar, reemplazar, insertar y comentar
- Atajo type-to-comment, escribe directamente sin hacer clic en botones
- Las anotaciones soportan adjuntos de imagen, conveniente para añadir referencias visuales
- Las anotaciones se convierten automáticamente en Markdown estructurado, la IA entiende con precisión

## Cuándo usar esto

**Casos de uso**:
- Revisar planes de implementación generados por IA, necesitas dar retroalimentación precisa sobre modificaciones
- Cierto contenido no es necesario (eliminar)
- Cierto contenido necesita escribirse de otra manera (reemplazar)
- Cierto contenido necesita explicación adicional después (insertar)
- Tienes preguntas o sugerencias sobre cierto contenido (comentar)

**Casos no aplicables**:
- Solo aprobar o rechazar el plan en general (no necesitas anotaciones, decide directamente)
- Ya estás revisando cambios de código (usa la función de revisión de código)

## 🎒 Antes de empezar

**Requisitos previos**:
- ✅ Completado el tutorial [Fundamentos de revisión de planes](../plan-review-basics/)
- ✅ Sabes cómo activar la interfaz de revisión de planes de Plannotator

**Suposiciones de esta lección**:
- Ya tienes abierta la página de revisión de planes de Plannotator
- La página muestra un plan Markdown generado por IA

## Concepto principal

### Tipos de anotación en detalle

Plannotator soporta cuatro tipos de anotación de plan (más un comentario global):

| Tipo de anotación | Icono | Propósito | ¿Requiere entrada? |
| --- | --- | --- | --- |
| **Eliminación (DELETION)** | 🗑️ | Marcar contenido para eliminar del plan | ❌ No |
| **Comentario (COMMENT)** | 💬 | Hacer preguntas o sugerencias sobre el contenido seleccionado | ✅ Requiere comentario |
| **Reemplazo (REPLACEMENT)** | Mediante comentario | Reemplazar contenido seleccionado con nuevo contenido | ✅ Requiere nuevo contenido |
| **Inserción (INSERTION)** | Mediante comentario | Insertar nuevo contenido después del seleccionado | ✅ Requiere nuevo contenido |
| **Comentario global (GLOBAL_COMMENT)** | Campo de entrada inferior | Dar retroalimentación sobre todo el plan | ✅ Requiere comentario |

**¿Por qué reemplazo e inserción no tienen botones independientes?**

Porque según la implementación del código fuente, reemplazo e inserción son esencialmente tipos especiales de comentario (`packages/ui/utils/parser.ts:287-296`):
- **Reemplazo**: El contenido del comentario sirve como nuevo texto de reemplazo
- **Inserción**: El contenido del comentario sirve como nuevo texto a insertar

Ambos se crean usando el botón **Comentario (COMMENT)**, la diferencia está en cómo describes tu intención.

### Flujo de trabajo de la barra de herramientas

```
Seleccionar texto → Aparece barra de herramientas (paso de menú)
                         │
                         ├── Clic en Delete → Crea anotación de eliminación inmediatamente
                         ├── Clic en Comment → Entra al paso de entrada → Escribe contenido → Guardar
                         └── Escribir directamente → type-to-comment → Entra automáticamente al paso de entrada
```

**Diferencia entre los dos pasos**:
- **Paso de menú**: Seleccionar tipo de operación (eliminar, comentar, cancelar)
- **Paso de entrada**: Escribir contenido del comentario o adjuntar imagen (desde comentar/reemplazar/insertar)

### Atajo type-to-comment

Esta es la función clave para mejorar la eficiencia. Después de seleccionar texto, **empieza a escribir directamente** (sin hacer clic en ningún botón), y la barra de herramientas automáticamente:
1. Cambia al modo "comentario"
2. Coloca el primer carácter que escribiste en el campo de entrada
3. Posiciona el cursor al final del campo de entrada

Ubicación en el código fuente: `packages/ui/components/AnnotationToolbar.tsx:127-147`

## Paso a paso

### Paso 1: Iniciar la revisión de plan

**Por qué**
Necesitas un plan real para practicar añadir anotaciones.

**Operación**

Activa la revisión de plan en Claude Code u OpenCode:

```bash
# Ejemplo con Claude Code: Después de que la IA genera el plan, llama a ExitPlanMode
"Por favor genera un plan de implementación para autenticación de usuarios"

# Espera a que la IA complete el plan, Plannotator se abrirá automáticamente en el navegador
```

**Deberías ver**:
- El navegador abre la página de revisión de plan
- La página muestra un plan de implementación en formato Markdown

### Paso 2: Añadir anotación de eliminación

**Por qué**
Las anotaciones de eliminación marcan contenido que no quieres en el plan final.

**Operación**

1. Encuentra un párrafo que no necesitas en el plan (por ejemplo, una descripción de función irrelevante)
2. Selecciona el texto con el ratón
3. La barra de herramientas aparece automáticamente, haz clic en el **botón Eliminar (🗑️)**

**Deberías ver**:
- El texto seleccionado muestra estilo de eliminación (normalmente tachado o fondo rojo)
- La barra de herramientas se cierra automáticamente

::: tip Característica de las anotaciones de eliminación
Las anotaciones de eliminación **no requieren entrada de contenido**. Después de hacer clic en el botón eliminar, la anotación se crea inmediatamente.
:::

### Paso 3: Usar type-to-comment para añadir comentarios

**Por qué**
Los comentarios son el tipo de anotación más común, type-to-comment te ahorra un clic.

**Operación**

1. Selecciona texto en el plan (por ejemplo, un nombre de función o descripción)
2. **No hagas clic en ningún botón, empieza a escribir directamente**
3. Escribe tu comentario (por ejemplo: "Este nombre de función no es suficientemente claro")
4. Presiona `Enter` para guardar, o haz clic en el botón **Save**

**Deberías ver**:
- La barra de herramientas cambia automáticamente al modo de campo de entrada
- El primer carácter que escribiste ya está en el campo de entrada
- El cursor se posiciona automáticamente al final del campo de entrada
- Después de presionar `Enter`, el texto seleccionado muestra estilo de comentario (normalmente fondo amarillo)

::: tip Atajos de type-to-comment
- `Enter`: Guardar anotación (si el campo de entrada tiene contenido)
- `Shift + Enter`: Nueva línea (para comentarios multilínea)
- `Escape`: Cancelar entrada, volver al paso de menú
:::

### Paso 4: Añadir anotación de reemplazo

**Por qué**
Las anotaciones de reemplazo sustituyen contenido seleccionado con nuevo contenido, la IA modificará el plan según tu anotación.

**Operación**

1. Selecciona texto en el plan (por ejemplo "Usar JWT token para autenticación")
2. Usa type-to-comment o haz clic en el botón comentar
3. Escribe el nuevo contenido en el campo de entrada (por ejemplo: "Usar session cookie para autenticación")
4. Presiona `Enter` para guardar

**Deberías ver**:
- El texto seleccionado muestra estilo de comentario
- La barra lateral de anotaciones muestra tu comentario

**Formato exportado** (`packages/ui/utils/parser.ts:292-296`):

```markdown
## 1. Change this

**From:**
```
Usar JWT token para autenticación
```

**To:**
```
Usar session cookie para autenticación
```
```

::: info Diferencia entre reemplazo y eliminación
- **Eliminación**: Elimina contenido directamente, no necesita explicación
- **Reemplazo**: Sustituye contenido antiguo con nuevo, necesita especificar el nuevo contenido
:::

### Paso 5: Añadir anotación de inserción

**Por qué**
Las anotaciones de inserción añaden explicaciones o fragmentos de código después del contenido seleccionado.

**Operación**

1. Selecciona texto en el plan (por ejemplo, el final de una firma de función)
2. Usa type-to-comment o haz clic en el botón comentar
3. Escribe el contenido a insertar en el campo de entrada (por ejemplo: ", necesita manejar el caso de fallo de autenticación")
4. Presiona `Enter` para guardar

**Deberías ver**:
- El texto seleccionado muestra estilo de comentario
- La barra lateral de anotaciones muestra tu comentario

**Formato exportado** (`packages/ui/utils/parser.ts:287-290`):

```markdown
## 1. Add this

```
, necesita manejar el caso de fallo de autenticación
```
```

### Paso 6: Adjuntar imagen a una anotación

**Por qué**
A veces las descripciones de texto no son suficientemente intuitivas, necesitas adjuntar imágenes de referencia o capturas de pantalla.

**Operación**

1. Selecciona cualquier texto, entra al paso de entrada (haz clic en el botón comentar o usa type-to-comment)
2. Junto al campo de entrada de la barra de herramientas, haz clic en el **botón de adjunto (📎)**
3. Selecciona la imagen a subir (soporta formatos PNG, JPEG, WebP)
4. Puedes continuar escribiendo contenido del comentario
5. Presiona `Enter` para guardar

**Deberías ver**:
- La miniatura de la imagen aparece en el campo de entrada
- Después de guardar, la imagen aparece en la barra lateral de anotaciones

::: warning Ubicación de almacenamiento de imágenes
Las imágenes subidas se guardan en el directorio local `/tmp/plannotator` (ubicación en código fuente: `packages/server/index.ts:163`). Si limpias los archivos temporales, las imágenes se perderán.
:::

### Paso 7: Añadir comentario global

**Por qué**
Cuando tienes retroalimentación sobre todo el plan (no sobre un texto específico), usa comentario global.

**Operación**

1. Encuentra el campo de entrada en la parte inferior de la página (la etiqueta puede ser "Add a general comment about the plan...")
2. Escribe tu comentario
3. Presiona `Enter` para guardar o haz clic en el botón enviar

**Deberías ver**:
- El comentario aparece en el área de comentarios globales en la parte inferior de la página
- El comentario se muestra como una tarjeta independiente, no asociada a ningún bloque de texto

::: tip Comentario global vs comentario de texto
- **Comentario global**: Retroalimentación sobre todo el plan, no asociada a texto específico (por ejemplo "Todo el plan carece de consideraciones de rendimiento")
- **Comentario de texto**: Retroalimentación sobre un texto específico, resalta el texto correspondiente
:::

## Punto de verificación ✅

Después de completar los pasos anteriores, deberías:

- [ ] Haber añadido exitosamente al menos una anotación de eliminación
- [ ] Haber usado type-to-comment para añadir comentarios
- [ ] Haber añadido anotaciones de reemplazo e inserción
- [ ] Haber adjuntado una imagen a una anotación
- [ ] Haber añadido un comentario global
- [ ] Ver todas las anotaciones listadas en la barra lateral derecha

## Errores comunes

### Error 1: No encuentro el botón "Reemplazar"

**Operación incorrecta**:
- Después de seleccionar texto, la barra de herramientas solo tiene Delete y Comment, no hay botón Replace o Insert

**Solución correcta**:
- Reemplazo e inserción se implementan mediante el botón **Comentario (COMMENT)**
- Describe tu intención en el contenido del comentario (reemplazar o insertar)
- La IA entenderá tu intención según el contenido del comentario

### Error 2: type-to-comment no funciona

**Posibles causas**:
1. No seleccionaste texto
2. Hiciste clic en algún botón primero, la barra de herramientas ya entró al paso de entrada
3. Presionaste teclas especiales (`Ctrl`, `Alt`, `Escape`, etc.)

**Solución correcta**:
1. Primero selecciona texto, asegúrate de que la barra de herramientas muestra el paso de menú (con botones Delete, Comment)
2. Escribe directamente caracteres normales (letras, números, puntuación)
3. No presiones teclas de función

### Error 3: No encuentro la imagen después de subirla

**Posibles causas**:
- Las imágenes se guardan en el directorio `/tmp/plannotator`
- El sistema limpió los archivos temporales

**Solución correcta**:
- Si necesitas guardar imágenes a largo plazo, cópialas al directorio del proyecto
- Al exportar anotaciones, las rutas de imagen son absolutas, asegúrate de que otras herramientas puedan acceder a ellas

### Error 4: Presioné `Enter` para nueva línea pero guardó la anotación

**Operación incorrecta**:
- En el campo de entrada querías nueva línea, presionaste `Enter` directamente, y la anotación se guardó

**Solución correcta**:
- Usa `Shift + Enter` para nueva línea
- La tecla `Enter` es exclusivamente para guardar anotaciones

## Resumen de la lección

**Cuatro tipos de anotación**:
- **Eliminación (DELETION)**: Marca contenido que no quieres en el plan
- **Reemplazo (REPLACEMENT)**: Sustituye contenido seleccionado con nuevo contenido (mediante comentario)
- **Inserción (INSERTION)**: Añade contenido después del seleccionado (mediante comentario)
- **Comentario (COMMENT)**: Hace preguntas o sugerencias sobre contenido seleccionado
- **Comentario global (GLOBAL_COMMENT)**: Retroalimentación sobre todo el plan

**Operaciones clave**:
- Seleccionar → Aparece barra de herramientas → Elegir tipo de operación
- type-to-comment: Escribe directamente, entra automáticamente al modo comentario
- `Shift + Enter`: Nueva línea; `Enter`: Guardar
- Botón de adjunto: Sube imagen a la anotación

**Formato de exportación de anotaciones**:
- Eliminación: `## Remove this` + texto original
- Inserción: `## Add this` + nuevo texto
- Reemplazo: `## Change this` + comparación From/To
- Comentario: `## Feedback on: "..."` + contenido del comentario

## Próxima lección

> En la próxima lección aprenderemos **[Añadir anotaciones de imagen](../plan-review-images/)**.
>
> Aprenderás:
> - Cómo adjuntar imágenes en la revisión de planes
> - Usar herramientas de pincel, flecha y círculo para anotar
> - Usar imágenes anotadas como retroalimentación de referencia

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-24

| Funcionalidad | Ruta del archivo | Líneas |
| --- | --- | --- |
| Definición de enum de tipos de anotación | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L7) | 1-7 |
| Interfaz Annotation | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) | 11-33 |
| Componente de barra de herramientas de anotación | [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L29-L272) | 29-272 |
| Formateo de exportación de anotaciones | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L246-L323) | 246-323 |
| Parseo de Markdown a Blocks | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L70-L244) | 70-244 |
| Componente Viewer (manejo de selección de texto) | [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L66-L350) | 66-350 |

**Constantes clave**:
- `AnnotationType.DELETION = 'DELETION'`: Tipo de anotación de eliminación
- `AnnotationType.INSERTION = 'INSERTION'`: Tipo de anotación de inserción
- `AnnotationType.REPLACEMENT = 'REPLACEMENT'`: Tipo de anotación de reemplazo
- `AnnotationType.COMMENT = 'COMMENT'`: Tipo de anotación de comentario
- `AnnotationType.GLOBAL_COMMENT = 'GLOBAL_COMMENT'`: Tipo de comentario global

**Funciones clave**:
- `exportDiff(blocks, annotations)`: Exporta anotaciones a formato Markdown, incluye comparación From/To
- `parseMarkdownToBlocks(markdown)`: Parsea Markdown a array lineal de Blocks
- `createAnnotationFromSource()`: Crea objeto Annotation desde selección de texto

</details>
