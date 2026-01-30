---
title: "Modelos de Datos: Definiciones Completas de Tipos Principales | Plannotator"
subtitle: "Modelos de Datos: Definiciones Completas de Tipos Principales | Plannotator"
sidebarTitle: "Domina los Modelos de Datos Principales"
description: "Aprende los modelos de datos de Plannotator, domina las definiciones completas y descripciones de campos de los tipos principales como Annotation, Block, CodeAnnotation, y profundiza en la arquitectura del sistema."
tags:
  - "Modelos de datos"
  - "Definiciones de tipos"
  - "Referencia de API"
prerequisite: []
order: 2
---

# Modelos de Datos de Plannotator

Este apéndice presenta todos los modelos de datos utilizados por Plannotator, incluyendo las estructuras de datos principales para revisiones de planes, revisiones de código y compartición de URLs.

## Resumen de los Modelos de Datos Principales

Plannotator define los siguientes modelos de datos principales utilizando TypeScript:

| Modelo | Uso | Ubicación de definición |
| --- | --- | ---|
| `Annotation` | Anotaciones en revisiones de planes | [`packages/ui/types.ts:11-33`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) |
| `Block` | Bloques de contenido después del análisis de Markdown | [`packages/ui/types.ts:35-44`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L35-L44) |
| `CodeAnnotation` | Anotaciones en revisiones de código | [`packages/ui/types.ts:55-66`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) |
| `ShareableAnnotation` | Formato reducido de anotaciones para compartir por URL | [`packages/ui/utils/sharing.ts:14-19`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L14-L19) |

## Annotation (Anotación de Plan)

`Annotation` representa una anotación en revisiones de planes, utilizada para marcar eliminaciones, inserciones, reemplazos o comentarios en el plan.

### Definición Completa

```typescript
export interface Annotation {
  id: string;              // Identificador único
  blockId: string;         // ID del Block asociado (obsoleto, mantenido por compatibilidad)
  startOffset: number;     // Desplazamiento inicial (obsoleto, mantenido por compatibilidad)
  endOffset: number;       // Desplazamiento final (obsoleto, mantenido por compatibilidad)
  type: AnnotationType;     // Tipo de anotación
  text?: string;           // Contenido del comentario (para INSERTION/REPLACEMENT/COMMENT)
  originalText: string;    // Texto original anotado
  createdA: number;        // Marca de tiempo de creación
  author?: string;         // Identidad del colaborador (para compartir por URL)
  imagePaths?: string[];    // Rutas de imágenes adjuntas
  startMeta?: {            // Metadatos de selección entre elementos de web-highlighter
    parentTagName: string;
    parentIndex: number;
    textOffset: number;
  };
  endMeta?: {              // Metadatos de selección final entre elementos de web-highlighter
    parentTagName: string;
    parentIndex: number;
    textOffset: number;
  };
}
```

### Enumeración AnnotationType

```typescript
export enum AnnotationType {
  DELETION = 'DELETION',           // Eliminar este contenido
  INSERTION = 'INSERTION',         // Insertar este contenido
  REPLACEMENT = 'REPLACEMENT',     // Reemplazar este contenido
  COMMENT = 'COMMENT',             // Comentar este contenido
  GLOBAL_COMMENT = 'GLOBAL_COMMENT', // Comentario global (sin asociación a texto específico)
}
```

### Descripción de Campos

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | ---|
| `id` | string | ✅ | Identificador único, generalmente un UUID generado automáticamente |
| `blockId` | string | ✅ | ID del `Block` asociado (obsoleto, mantenido por compatibilidad) |
| `startOffset` | number | ✅ | Desplazamiento inicial del carácter (obsoleto, mantenido por compatibilidad) |
| `endOffset` | number | ✅ | Desplazamiento final del carácter (obsoleto, mantenido por compatibilidad) |
| `type` | AnnotationType | ✅ | Tipo de anotación (DELETION/INSERTION/REPLACEMENT/COMMENT/GLOBAL_COMMENT) |
| `text` | string | ❌ | Contenido del comentario (completar para INSERTION/REPLACEMENT/COMMENT) |
| `originalText` | string | ✅ | Texto original anotado |
| `createdA` | number | ✅ | Marca de tiempo de creación (milisegundos) |
| `author` | string | ❌ | Identificador de identidad del colaborador (para distinguir autores al compartir por URL) |
| `imagePaths` | string[] | ❌ | Arreglo de rutas de imágenes adjuntas |
| `startMeta` | object | ❌ | Metadatos iniciales de selección entre elementos de web-highlighter |
| `endMeta` | object | ❌ | Metadatos finales de selección entre elementos de web-highlighter |

### Ejemplos

#### Anotación de Eliminación

```typescript
{
  id: "anno-001",
  blockId: "block-0",
  startOffset: 0,
  endOffset: 50,
  type: AnnotationType.DELETION,
  originalText: "Esta parte no es necesaria",
  createdA: Date.now(),
}
```

#### Anotación de Reemplazo

```typescript
{
  id: "anno-002",
  blockId: "block-0",
  startOffset: 0,
  endOffset: 50,
  type: AnnotationType.REPLACEMENT,
  text: "Nuevo contenido",
  originalText: "Contenido original",
  createdA: Date.now(),
  imagePaths: ["/tmp/plannotator/screenshot-001.png"],
}
```

#### Comentario Global

```typescript
{
  id: "anno-003",
  blockId: "",
  startOffset: 0,
  endOffset: 0,
  type: AnnotationType.GLOBAL_COMMENT,
  text: "En general, el plan es muy claro",
  originalText: "",
  createdA: Date.now(),
}
```

::: info Descripción de Campos Obsoletos
Los campos `blockId`, `startOffset` y `endOffset` se utilizaban en versiones anteriores para resaltado de texto basado en desplazamiento de caracteres. La versión actual utiliza la biblioteca [web-highlighter](https://github.com/alvarotrigo/web-highlighter), que implementa selección entre elementos mediante `startMeta` y `endMeta`. Estos campos se mantienen únicamente por compatibilidad.
:::

## Block (Bloque de Plan)

`Block` representa un bloque de contenido después del análisis de texto Markdown, utilizado para mostrar el contenido del plan de forma estructurada.

### Definición Completa

```typescript
export interface Block {
  id: string;              // Identificador único
  type: BlockType;         // Tipo de bloque
  content: string;        // Contenido en texto plano
  level?: number;         // Nivel (para títulos o listas)
  language?: string;      // Lenguaje del código (para bloques de código)
  checked?: boolean;      // Estado de la casilla de verificación (para elementos de lista)
  order: number;          // Orden de clasificación
  startLine: number;      // Número de línea inicial (1-based)
}
```

### Tipo BlockType

```typescript
type BlockType =
  | 'paragraph'     // Párrafo
  | 'heading'       // Título
  | 'blockquote'    // Bloque de cita
  | 'code'          // Bloque de código
  | 'hr'            // Línea divisoria
  | 'table';        // Tabla
```

### Descripción de Campos

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | ---|
| `id` | string | ✅ | Identificador único, formato `block-{número}` |
| `type` | BlockType | ✅ | Tipo de bloque (paragraph/heading/blockquote/list-item/code/hr/table) |
| `content` | string | ✅ | Contenido en texto plano del bloque |
| `level` | number | ❌ | Nivel: títulos son 1-6, elementos de lista son nivel de sangría |
| `language` | string | ❌ | Lenguaje del bloque de código (como 'typescript', 'rust') |
| `checked` | boolean | ❌ | Estado de la casilla de verificación del elemento de lista (true = marcado, false = sin marcar) |
| `order` | number | ✅ | Número de orden, utilizado para mantener la secuencia de bloques |
| `startLine` | number | ✅ | Número de línea inicial en el Markdown fuente (comenzando desde 1) |

### Ejemplos

#### Bloque de Título

```typescript
{
  id: "block-0",
  type: "heading",
  content: "Plan de Implementación",
  level: 1,
  order: 1,
  startLine: 1,
}
```

#### Bloque de Párrafo

```typescript
{
  id: "block-1",
  type: "paragraph",
  content: "Este es un párrafo con algo de texto.",
  order: 2,
  startLine: 3,
}
```

#### Bloque de Código

```typescript
{
  id: "block-2",
  type: "code",
  content: "function hello() {\n  return 'world';\n}",
  language: "typescript",
  order: 3,
  startLine: 5,
}
```

#### Elemento de Lista (con Casilla de Verificación)

```typescript
{
  id: "block-3",
  type: "list-item",
  content: "Completar módulo de autenticación",
  level: 0,
  checked: true,
  order: 4,
  startLine: 10,
}
```

::: tip Análisis de Markdown
Plannotator utiliza un analizador de Markdown simplificado personalizado (`parseMarkdownToBlocks`) para convertir el Markdown fuente en un arreglo `Block[]`. El analizador soporta sintaxis común como títulos, listas, bloques de código, tablas y bloques de cita.
:::

## CodeAnnotation (Anotación de Código)

`CodeAnnotation` representa una anotación a nivel de línea en revisiones de código, utilizada para agregar retroalimentación a líneas o rangos específicos del diff de Git.

### Definición Completa

```typescript
export interface CodeAnnotation {
  id: string;              // Identificador único
  type: CodeAnnotationType;  // Tipo de anotación
  filePath: string;         // Ruta del archivo
  lineStart: number;        // Número de línea inicial
  lineEnd: number;          // Número de línea final
  side: 'old' | 'new';     // Lado ('old' = línea eliminada, 'new' = línea nueva)
  text?: string;           // Contenido del comentario
  suggestedCode?: string;    // Código sugerido (para tipo suggestion)
  createdAt: number;        // Marca de tiempo de creación
  author?: string;         // Identidad del colaborador
}
```

### Tipo CodeAnnotationType

```typescript
export type CodeAnnotationType =
  | 'comment'      // Comentario normal
  | 'suggestion'  // Sugerencia de modificación (requiere suggestedCode)
  | 'concern';     // Punto de atención (recordatorio de tema importante)
```

### Descripción de Campos

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | ---|
| `id` | string | ✅ | Identificador único |
| `type` | CodeAnnotationType | ✅ | Tipo de anotación (comment/suggestion/concern) |
| `filePath` | string | ✅ | Ruta relativa del archivo anotado (como `src/auth.ts`) |
| `lineStart` | number | ✅ | Número de línea inicial (comenzando desde 1) |
| `lineEnd` | number | ✅ | Número de línea final (comenzando desde 1) |
| `side` | 'old' \| 'new' | ✅ | Lado: `'old'` = línea eliminada (versión antigua), `'new'` = línea nueva (versión nueva) |
| `text` | string | ❌ | Contenido del comentario |
| `suggestedCode` | string | ❌ | Código sugerido (requerido cuando type es 'suggestion') |
| `createdAt` | number | ✅ | Marca de tiempo de creación (milisegundos) |
| `author` | string | ❌ | Identificador de identidad del colaborador |

### Descripción del Campo side

El campo `side` corresponde a la vista de diff de la biblioteca [@pierre/diffs](https://www.npmjs.com/package/@pierre/diffs):

| Valor side | Correspondencia @pierre/diffs | Descripción |
| --- | --- | ---|
| `'old'` | `deletions` | Líneas eliminadas (contenido en versión antigua) |
| `'new'` | `additions` | Líneas añadidas (contenido en versión nueva) |

### Ejemplos

#### Comentario Normal (Línea Nueva)

```typescript
{
  id: "code-anno-001",
  type: "comment",
  filePath: "src/auth.ts",
  lineStart: 15,
  lineEnd: 15,
  side: "new",
  text: "Aquí es necesario manejar errores",
  createdAt: Date.now(),
}
```

#### Sugerencia de Modificación (Línea Eliminada)

```typescript
{
  id: "code-anno-002",
  type: "suggestion",
  filePath: "src/auth.ts",
  lineStart: 10,
  lineEnd: 12,
  side: "old",
  text: "Sugiero usar async/await",
  suggestedCode: "async function authenticate() {\n  const user = await fetchUser();\n  return user;\n}",
  createdAt: Date.now(),
}
```

## ShareableAnnotation (Anotación Compartible)

`ShareableAnnotation` es un formato reducido de anotaciones para compartir por URL, representado mediante tuplas de arreglo para reducir el tamaño del payload.

### Definición Completa

```typescript
export type ShareableAnnotation =
  | ['D', string, string | null, string[]?]           // Deletion: [type, original, author, images]
  | ['R', string, string, string | null, string[]?]   // Replacement: [type, original, replacement, author, images]
  | ['C', string, string, string | null, string[]?]   // Comment: [type, original, comment, author, images]
  | ['I', string, string, string | null, string[]?]   // Insertion: [type, context, new text, author, images]
  | ['G', string, string | null, string[]?];          // Global Comment: [type, comment, author, images]
```

### Descripción de Tipos

| Tipo | Primer carácter | Estructura de tupla | Descripción |
| --- | --- | --- | ---|
| DELETION | `'D'` | `['D', original, author?, images?]` | Contenido eliminado |
| REPLACEMENT | `'R'` | `['R', original, replacement, author?, images?]` | Contenido reemplazado |
| COMMENT | `'C'` | `['C', original, comment, author?, images?]` | Contenido del comentario |
| INSERTION | `'I'` | `['I', context, newText, author?, images?]` | Contenido insertado |
| GLOBAL_COMMENT | `'G'` | `['G', comment, author?, images?]` | Comentario global |

### Ejemplos

```typescript
// Eliminación
['D', 'Contenido a eliminar', null, []]

// Reemplazo
['R', 'Texto original', 'Reemplazo por', null, ['/tmp/img.png']]

// Comentario
['C', 'Este código', 'Sugiero optimizar', null, []]

// Inserción
['I', 'Contexto', 'Nuevo contenido a insertar', null, []]

// Comentario global
['G', 'Muy bien en general', null, []]
```

::: tip ¿Por qué usar formato reducido?
Usar tuplas de arreglo en lugar de objetos puede reducir el tamaño del payload, haciendo las URLs más cortas después de compresión. Por ejemplo:
- Formato de objeto：`{"type":"DELETION","originalText":"text"}` → 38 bytes
- Formato reducido：`["D","text",null,[]]` → 18 bytes
:::

## SharePayload (Payload de Compartición)

`SharePayload` es la estructura de datos completa para compartir por URL, incluyendo contenido del plan y anotaciones.

### Definición Completa

```typescript
export interface SharePayload {
  p: string;                  // Texto Markdown del plan
  a: ShareableAnnotation[];    // Arreglo de anotaciones (formato reducido)
  g?: string[];              // Rutas de archivos adjuntos globales (imágenes)
}
```

### Descripción de Campos

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | ---|
| `p` | string | ✅ | Contenido Markdown del plan original |
| `a` | ShareableAnnotation[] | ✅ | Arreglo de anotaciones (usando formato reducido `ShareableAnnotation`) |
| `g` | string[] | ❌ | Rutas de archivos adjuntos globales (imágenes no asociadas a anotaciones específicas) |

### Ejemplo

```typescript
{
  p: "# Plan de Implementación\n\n1. Añadir autenticación\n2. Añadir UI",
  a: [
    ['C', 'Añadir autenticación', 'Necesario soportar OAuth', null, []],
    ['G', 'Plan general claro', null, []],
  ],
  g: ['/tmp/plannotator/diagram.png'],
}
```

## Frontmatter (Metadatos Frontmatter)

`Frontmatter` representa los metadatos YAML en la parte superior del archivo Markdown, utilizados para almacenar información adicional.

### Definición Completa

```typescript
export interface Frontmatter {
  [key: string]: string | string[];
}
```

### Ejemplo

```markdown
---
created: 2026-01-24T14:30:00.000Z
source: plannotator
tags: [authentication, typescript]
author: John Doe
---

### Plan de Implementación (ejemplo)
...
```

Después del análisis:

```typescript
{
  created: "2026-01-24T14:30:00.000Z",
  source: "plannotator",
  tags: ["authentication", "typescript"],
  author: "John Doe",
}
```

::: tip Usos del Frontmatter
Plannotator genera automáticamente frontmatter al guardar planes en Obsidian, incluyendo información como marca de tiempo de creación y etiquetas de origen, facilitando la gestión y búsqueda de notas.
:::

## Tipos Auxiliares Relacionados

### EditorMode (Modo de Editor)

```typescript
export type EditorMode = 'selection' | 'comment' | 'redline';
```

- `'selection'`：Modo de selección de texto
- `'comment'`：Modo de comentario
- `'redline'`：Modo de anotación de línea roja

### DiffResult (Resultado de Diff)

```typescript
export interface DiffResult {
  original: string;    // Contenido original
  modified: string;    // Contenido modificado
  diffText: string;    // Texto de diff unificado
}
```

### DiffAnnotationMetadata (Metadatos de Anotación de Diff)

```typescript
export interface DiffAnnotationMetadata {
  annotationId: string;      // ID de la anotación asociada
  type: CodeAnnotationType;  // Tipo de anotación
  text?: string;            // Contenido del comentario
  suggestedCode?: string;   // Código sugerido
  author?: string;          // Autor
}
```

### SelectedLineRange (Rango de Líneas Seleccionadas)

```typescript
export interface SelectedLineRange {
  start: number;                      // Número de línea inicial
  end: number;                        // Número de línea final
  side: 'deletions' | 'additions';   // Lado (corresponde a la vista de diff de @pierre/diffs)
  endSide?: 'deletions' | 'additions'; // Lado final (para selección entre lados)
}
```

## Relaciones de Conversión de Datos

### Annotation ↔ ShareableAnnotation

```typescript
// Completo → Reducido
function toShareable(annotations: Annotation[]): ShareableAnnotation[]

// Reducido → Completo
function fromShareable(data: ShareableAnnotation[]): Annotation[]
```

::: info Pérdida de Coordenadas
Los campos `blockId`, `startOffset` y `endOffset` en el `Annotation` generado por `fromShareable` están vacíos o son 0. Es necesario recuperar la posición exacta mediante coincidencia de texto o web-highlighter.
:::

### Markdown ↔ Block[]

```typescript
// Markdown → Block[]
function parseMarkdownToBlocks(markdown: string): Block[]

// Block[] + Annotation[] → Markdown
function exportDiff(blocks: Block[], annotations: Annotation[]): string
```

## Resumen de esta Lección

Este apéndice presentó todos los modelos de datos principales de Plannotator:

- **Annotation**：Anotaciones en revisiones de planes, soportando tipos como eliminación, inserción, reemplazo y comentario
- **Block**：Bloques de contenido después del análisis de Markdown, utilizados para mostrar planes de forma estructurada
- **CodeAnnotation**：Anotaciones a nivel de línea en revisiones de código, soportando comentarios y sugerencias
- **ShareableAnnotation**：Formato reducido para compartir por URL, reduciendo el tamaño del payload
- **SharePayload**：Estructura de datos completa para compartir por URL

Estos modelos de datos se utilizan ampliamente en funciones como revisiones de planes, revisiones de código y compartición por URL. Comprenderlos ayuda a personalizar y extender Plannotator en profundidad.

## Avance del Próximo Tema

> En el próximo tema aprenderemos **[Explicación de Licencia de Plannotator](../license/)**.
>
> Verás:
> - Cláusulas principales de Business Source License 1.1 (BSL)
> - Usos permitidos y restricciones comerciales
> - Cronograma de conversión a Apache 2.0 en 2030
> - Cómo obtener una licencia comercial

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Tiempo de actualización：2026-01-24

| Función | Ruta del archivo | Número de línea |
| --- | --- | ---|
| Interfaz Annotation | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) | 11-33 |
| Enumeración AnnotationType | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L7) | 1-7 |
| Interfaz Block | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L35-L44) | 35-44 |
| Interfaz CodeAnnotation | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) | 55-66 |
| Tipo CodeAnnotationType | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L53) | 53 |
| Tipo ShareableAnnotation | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L14-L19) | 14-19 |
| Interfaz SharePayload | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L21-L25) | 21-25 |
| toShareable() | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L76-L95) | 76-95 |
| fromShareable() | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L102-L155) | 102-155 |
| parseMarkdownToBlocks() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L70-L244) | 70-244 |
| exportDiff() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L246-L323) | 246-323 |
| extractFrontmatter() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L14-L63) | 14-63 |

**Constantes clave**：
- Ninguna

**Funciones clave**：
- `toShareable(annotations: Annotation[]): ShareableAnnotation[]`：Convierte anotaciones completas a formato reducido
- `fromShareable(data: ShareableAnnotation[]): Annotation[]`：Recupera formato reducido a anotaciones completas
- `parseMarkdownToBlocks(markdown: string): Block[]`：Analiza Markdown a arreglo Block
- `exportDiff(blocks: Block[], annotations: Annotation[]): string`：Exporta anotaciones a formato Markdown

</details>
