---
title: "Modo de Ocultación: Principios de Cálculo de Ancho | opencode-md-table-formatter"
sidebarTitle: "Tres Pasos para Calcular el Ancho"
subtitle: "Principios del Modo de Ocultación: Por Qué el Cálculo de Ancho es Tan Importante"
description: "Aprende cómo funciona el modo de ocultación de OpenCode. Domina el método de cálculo de ancho de visualización del plugin, entiende la eliminación de símbolos Markdown, protección de bloques de código y uso de Bun.stringWidth."
tags:
  - "concealment-mode"
  - "cálculo-de-ancho-de-visualización"
  - "eliminación-de-símbolos-markdown"
  - "Bun.stringWidth"
prerequisite:
  - "start-features"
order: 30
---

# Principios del Modo de Ocultación: Por Qué el Cálculo de Ancho es Tan Importante

::: info Lo Que Aprenderás
- Entender cómo funciona el modo de ocultación de OpenCode
- Saber por qué las herramientas de formateo normales desalinean las tablas en modo de ocultación
- Dominar el algoritmo de cálculo de ancho del plugin (tres pasos)
- Entender el papel de `Bun.stringWidth`
:::

## Tu Dilema Actual

Escribes código con OpenCode y la IA genera una tabla hermosa:

```markdown
| Campo | Tipo | Descripción |
|--- | --- | ---|
| **name** | string | Nombre de usuario |
| age | number | Edad |
```

En la vista de código fuente se ve bastante ordenada. Pero al cambiar al modo de vista previa, la tabla está desalineada:

```
| Campo     | Tipo   | Descripción   |
|--- | --- | ---|
| name | string | Nombre de usuario |    ← ¿Por qué se acortó?
| age      | number | Edad   |
```

¿Dónde está el problema? **Modo de ocultación**.

## Qué es el Modo de Ocultación

OpenCode habilita por defecto el **Modo de Ocultación (Concealment Mode)**, que oculta los símbolos de sintaxis Markdown al renderizar:

| Código Fuente | Visualización en Modo de Ocultación |
|--- | ---|
| `**negrita**` | negrita（4 caracteres） |
| `*cursiva*` | cursiva（4 caracteres） |
| `~~tachado~~` | tachado（6 caracteres） |
| `` `código` `` | `código`（4 caracteres + color de fondo） |

::: tip Beneficios del Modo de Ocultación
Te permite concentrarte en el contenido en sí, en lugar de ser distraído por un montón de símbolos `**` y `*`.
:::

## Por Qué las Herramientas de Formateo Normales Tienen Problemas

Las herramientas normales de formateo de tablas calculan el ancho considerando `**name**` como 8 caracteres:

```
** n a m e ** = 8 caracteres
```

Pero en modo de ocultación, el usuario ve `name`, que solo tiene 4 caracteres.

El resultado es: la herramienta de formateo alinea según 8 caracteres, pero el usuario ve 4 caracteres, por lo que la tabla naturalmente se desalinea.

## Idea Central: Calcular "Ancho de Visualización" en Lugar de "Longitud de Caracteres"

La idea central de este plugin es: **calcular el ancho que el usuario realmente ve, no el número de caracteres en el código fuente**.

El algoritmo se divide en tres pasos:

```
Paso 1: Proteger bloques de código（los símbolos dentro de bloques de código no se eliminan）
Paso 2: Eliminar símbolos Markdown（**、*、~~, etc.）
Paso 3: Usar Bun.stringWidth para calcular el ancho final
```

## Sígueme: Entender el Algoritmo de Tres Pasos

### Paso 1: Proteger Bloques de Código

**Por Qué**

Los símbolos Markdown dentro del código en línea (envuelto en comillas invertidas) son "literales", el usuario verá los 8 caracteres `**bold**`, no los 4 caracteres `bold`.

Por lo tanto, antes de eliminar los símbolos Markdown, primero hay que "esconder" el contenido de los bloques de código.

**Implementación en Código Fuente**

```typescript
// Paso 1: Extraer y proteger código en línea
const codeBlocks: string[] = []
let textWithPlaceholders = text.replace(/`(.+?)`/g, (match, content) => {
  codeBlocks.push(content)
  return `\x00CODE${codeBlocks.length - 1}\x00`
})
```

**Cómo Funciona**

| Entrada | Después del Procesamiento | Array codeBlocks |
|--- | --- | ---|
| `` `**bold**` `` | `\x00CODE0\x00` | `["**bold**"]` |
| `` `a` and `b` `` | `\x00CODE0\x00 and \x00CODE1\x00` | `["a", "b"]` |

Reemplaza los bloques de código con marcadores de posición especiales como `\x00CODE0\x00`, de modo que al eliminar los símbolos Markdown más tarde no se dañen accidentalmente.

### Paso 2: Eliminar Símbolos Markdown

**Por Qué**

En modo de ocultación, `**negrita**` se muestra como `negrita`, `*cursiva*` se muestra como `cursiva`. Al calcular el ancho, hay que eliminar estos símbolos.

**Implementación en Código Fuente**

```typescript
// Paso 2: Eliminar símbolos Markdown de partes que no son código
let visualText = textWithPlaceholders
let previousText = ""

while (visualText !== previousText) {
  previousText = visualText
  visualText = visualText
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1") // ***negrita cursiva*** → texto
    .replace(/\*\*(.+?)\*\*/g, "$1")     // **negrita** → negrita
    .replace(/\*(.+?)\*/g, "$1")         // *cursiva* → cursiva
    .replace(/~~(.+?)~~/g, "$1")         // ~~tachado~~ → tachado
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1")     // ![alt](url) → alt
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)") // [texto](url) → texto (url)
}
```

**¿Por Qué Usar un Bucle While?**

Para manejar sintaxis anidada. Por ejemplo `***negrita cursiva***`:

```
Ronda 1: ***negrita cursiva*** → **negrita cursiva**（eliminar la capa más externa ***）
Ronda 2: **negrita cursiva** → *negrita cursiva*（eliminar **）
Ronda 3: *negrita cursiva* → negrita cursiva（eliminar *）
Ronda 4: negrita cursiva = negrita cursiva（sin cambios, salir del bucle）
```

::: details Procesamiento de Imágenes y Enlaces
- **Imagen** `![alt](url)`: OpenCode solo muestra el texto alt, por lo que se reemplaza con `alt`
- **Enlace** `[texto](url)`: Se muestra como `texto (url)`, conservando la información de la URL
:::

### Paso 3: Restaurar Bloques de Código + Calcular Ancho

**Por Qué**

El contenido de los bloques de código debe devolverse, y luego usar `Bun.stringWidth` para calcular el ancho de visualización final.

**Implementación en Código Fuente**

```typescript
// Paso 3: Restaurar contenido de bloques de código
visualText = visualText.replace(/\x00CODE(\d+)\x00/g, (match, index) => {
  return codeBlocks[parseInt(index)]
})

return Bun.stringWidth(visualText)
```

**¿Por Qué Usar Bun.stringWidth?**

`Bun.stringWidth` puede calcular correctamente:

| Tipo de Carácter | Ejemplo | Número de Caracteres | Ancho de Visualización |
|--- | --- | --- | ---|
| ASCII | `abc` | 3 | 3 |
| Chino | `你好` | 2 | 4（cada uno ocupa 2 espacios） |
| Emoji | `😀` | 1 | 2（ocupa 2 espacios） |
| Carácter de Ancho Cero | `a\u200Bb` | 3 | 2（los caracteres de ancho cero no ocupan espacio） |

El `text.length` normal solo puede contar el número de caracteres, no puede manejar estos casos especiales.

## Ejemplo Completo

Supongamos que el contenido de la celda es: `` **`code`** and *text* ``

**Paso 1: Proteger Bloques de Código**

```
Entrada：**`code`** and *text*
Salida：**\x00CODE0\x00** and *text*
codeBlocks = ["code"]
```

**Paso 2: Eliminar Símbolos Markdown**

```
Ronda 1: **\x00CODE0\x00** and *text* → \x00CODE0\x00 and text
Ronda 2: Sin cambios, salir
```

**Paso 3: Restaurar Bloques de Código + Calcular Ancho**

```
Después de restaurar：code and text
Ancho：Bun.stringWidth("code and text") = 13
```

Finalmente, el plugin alinea esta celda según un ancho de 13 caracteres, en lugar de los 22 caracteres del código fuente.

## Punto de Control

Después de completar esta lección, deberías poder responder:

- [ ] ¿Qué símbolos oculta el modo de ocultación?（Respuesta: Símbolos de sintaxis Markdown como `**`, `*`, `~~`, etc.）
- [ ] ¿Por qué proteger primero los bloques de código?（Respuesta: Los símbolos dentro de los bloques de código son literales y no deben eliminarse）
- [ ] ¿Por qué usar un bucle while para eliminar símbolos?（Respuesta: Para manejar sintaxis anidada, como `***negrita cursiva***`）
- [ ] ¿En qué es mejor `Bun.stringWidth` que `text.length`?（Respuesta: Puede calcular correctamente el ancho de visualización de chino, emoji, caracteres de ancho cero, etc.）

## Advertencia de Trampas

::: warning Malentendidos Comunes
**Malentendido**: Los `**` dentro de los bloques de código también se eliminarán

**Realidad**: No. El plugin primero protege el contenido de los bloques de código con marcadores de posición, elimina los símbolos de otras partes y luego los restaura.

Por lo tanto, el ancho de `` `**bold**` `` es 8（`**bold**`），no 4（`bold`）。
:::

## Resumen de Esta Lección

| Paso | Función | Código Clave |
|--- | --- | ---|
| Proteger bloques de código | Evitar que los símbolos dentro de los bloques de código se eliminen por error | `text.replace(/\`(.+?)\`/g, ...)` |
| Eliminar Markdown | Calcular el contenido de visualización real en modo de ocultación | Múltiples reemplazos con regex |
| Calcular ancho | Manejar caracteres especiales como chino, emoji, etc. | `Bun.stringWidth()` |

## Próxima Lección

> En la próxima lección aprenderemos **[Especificaciones de Tablas](../table-spec/)**.
>
> Aprenderás:
> - Qué tipo de tablas pueden ser formateadas
> - Las 4 reglas de validación de tablas
> - Cómo evitar errores de "tabla inválida"

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-26

| Función | Ruta del Archivo | Número de Línea |
|--- | --- | ---|
| Entrada de cálculo de ancho de visualización | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L151-L159) | 151-159 |
| Protección de bloques de código | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L168-L173) | 168-173 |
| Eliminación de símbolos Markdown | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L175-L188) | 175-188 |
| Restauración de bloques de código | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L190-L193) | 190-193 |
| Llamada a Bun.stringWidth | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L195) | 195 |

**Funciones Clave**:
- `calculateDisplayWidth()`: Entrada de cálculo de ancho con caché
- `getStringWidth()`: Algoritmo central, elimina símbolos Markdown y calcula el ancho de visualización

**Constantes Clave**:
- `\x00CODE{n}\x00`: Formato de marcador de posición para bloques de código

</details>
