---
title: "Alineación: Diseño de Tablas Markdown | opencode-md-table-formatter"
subtitle: "Alineación: Diseño de Tablas Markdown | opencode-md-table-formatter"
sidebarTitle: "Mejora la Alineación de Tablas"
description: "Aprende los tres tipos de alineación y la sintaxis de filas separadoras en tablas Markdown. Domina el algoritmo de alineación para que las tablas generadas por IA se vean ordenadas y estéticas en cualquier tipo de alineación."
tags:
  - "Alineación izquierda"
  - "Alineación centrada"
  - "Alineación derecha"
  - "Sintaxis de fila separadora"
prerequisite:
  - "advanced-table-spec"
order: 50
---

# Detalles de Alineación: Izquierda, Centro, Derecha

::: info Lo que lograrás al terminar
- Dominar la sintaxis y efectos de los tres tipos de alineación
- Comprender cómo la fila separadora especifica el tipo de alineación
- Entender el funcionamiento del algoritmo de relleno de celdas
- Saber por qué la fila separadora ajusta automáticamente el ancho
:::

## Tu problema actual

La IA generó una tabla, pero la alineación de las columnas no se ve estética:

```markdown
| 名称 | 类型 | 描述 |
| --- | --- | --- |
| 用户 | string | 用户名 |
| 年龄 | number | 年龄 |
| is_active | boolean | 是否激活 |
```

Quieres que algunas columnas estén centradas o alineadas a la derecha para que la tabla sea más legible, pero no sabes cómo especificarlo.

## Cuándo usar esta técnica

- Quieres que ciertas columnas de la tabla estén centradas (como estado, etiquetas)
- Quieres que las columnas numéricas estén alineadas a la derecha (para facilitar comparaciones)
- Quieres que las columnas de texto estén alineadas a la izquierda (comportamiento predeterminado)
- Quieres entender el principio de implementación de la alineación

## Idea clave: La fila separadora determina la alineación

La alineación de las tablas Markdown no se escribe en cada fila, sino que se especifica de manera uniforme a través de la **fila separadora**.

La sintaxis de la fila separadora es: `:?-+:?` (dos puntos + guion + dos puntos)

| Posición de dos puntos | Tipo de alineación | Ejemplo |
| --- | --- | --- |
| Ambos lados | Centrado | `:---:` |
| Solo el lado derecho | Alineación derecha | `---:` |
| Ninguno | Alineación izquierda | `---` o `:---` |

Cada celda de la fila separadora corresponde al tipo de alineación de una columna, y el complemento formateará toda la columna según esta regla.

## Sígueme: Tres tipos de alineación

### Paso 1: Alineación izquierda (predeterminada)

**Por qué**

La alineación izquierda es el comportamiento predeterminado de las tablas y es adecuada para datos de texto.

**Sintaxis**

```markdown
| 名称 | 描述 |
| :--- | :--- |    ← Tener dos puntos a la izquierda o no tener dos puntos es alineación izquierda
| 用户 | 用户名 |
```

**Lo que deberías ver**

```markdown
| 名称   | 描述   |
| :----- | :----- |
| 用户   | 用户名 |
```

La fila separadora se mostrará como `:---` (marcador de alineación izquierda), y el texto estará alineado a la izquierda.

**Implementación en código fuente**

```typescript
// Función getAlignment: analizar el tipo de alineación
function getAlignment(delimiterCell: string): "left" | "center" | "right" {
  const trimmed = delimiterCell.trim()
  const hasLeftColon = trimmed.startsWith(":")
  const hasRightColon = trimmed.endsWith(":")

  if (hasLeftColon && hasRightColon) return "center"
  if (hasRightColon) return "right"
  return "left"  // Por defecto devuelve left
}
```

Ubicación en código fuente: `index.ts:141-149`

**Explicación lógica**

- Dos puntos a ambos lados (`:---:`) → devuelve `"center"`
- Solo dos puntos a la derecha (`---:`) → devuelve `"right"`
- Otros casos (`---` o `:---`) → devuelve `"left"` (predeterminado)

### Paso 2: Alineación centrada

**Por qué**

El centrado es adecuado para etiquetas de estado, textos cortos, títulos y otros contenidos que necesitan centrado visual.

**Sintaxis**

```markdown
| 名称 | 状态 | 描述 |
| :--- | :---: | :--- |    ← La columna del medio usa :---: para indicar centrado
| 用户 | 激活 | 用户名 |
```

**Lo que deberías ver**

```markdown
| 名称   |  状态  | 描述   |
| :----- | :----: | :----- |
| 用户   |  激活  | 用户名 |
```

La columna del medio "激活" se mostrará centrada, y la fila separadora se mostrará como `:---:` (marcador de centrado).

**Principio de formateo de la fila separadora**

El formateo de las celdas de la fila separadora lo maneja la función `formatSeparatorCell`:

```typescript
function formatSeparatorCell(width: number, align: "left" | "center" | "right"): string {
  if (align === "center") return ":" + "-".repeat(Math.max(1, width - 2)) + ":"
  if (align === "right") return "-".repeat(Math.max(1, width - 1)) + ":"
  return "-".repeat(width)
}
```

Ubicación en código fuente: `index.ts:213-217`

**Principio matemático de la alineación centrada**

El formato de la fila separadora centrada es: `:` + guion + `:`

| Ancho objetivo | Fórmula de cálculo | Resultado |
| --- | --- | --- |
| 3 | `:` + ` `-`*1 ` + `:` | `:-:` |
| 5 | `:` + `-`*3 + `:` | `:---:` |
| 10 | `:` + `-`*8 + `:` | `:--------:` |

`Math.max(1, width - 2)` asegura que se mantenga al menos 1 guion, evitando que cuando el ancho es 2 se convierta en `::` (sin efecto de separación).

### Paso 3: Alineación derecha

**Por qué**

La alineación derecha es adecuada para números, montos, fechas y otros datos que necesitan compararse de derecha a izquierda.

**Sintaxis**

```markdown
| 名称 | 价格 | 数量 |
| :--- | ---: | ---: |    ← Tener dos puntos a la derecha indica alineación derecha
| 商品 | 99.9 | 100 |
```

**Lo que deberías ver**

```markdown
| 名称   | 价格 | 数量 |
| :----- | ----: | ---: |
| 商品   |  99.9 |  100 |
```

Los números están alineados a la derecha, lo que facilita la comparación de magnitudes.

**Principio matemático de la alineación derecha**

El formato de la fila separadora alineada a la derecha es: guion + `:`

| Ancho objetivo | Fórmula de cálculo | Resultado |
| --- | --- | --- |
| 3 | `-`*2 + `:` | `--:` |
| 5 | `-`*4 + `:` | `----:` |
| 10 | `-`*9 + `:` | `---------:` |

`Math.max(1, width - 1)` asegura que se mantenga al menos 1 guion.

## Algoritmo de relleno de celdas

¿Cómo decide el complemento cuántos espacios rellenar a ambos lados de la celda? La respuesta está en la función `padCell`.

**Implementación en código fuente**

```typescript
function padCell(text: string, width: number, align: "left" | "center" | "right"): string {
  const displayWidth = calculateDisplayWidth(text)  // Calcular el ancho de visualización
  const totalPadding = Math.max(0, width - displayWidth)

  if (align === "center") {
    const leftPad = Math.floor(totalPadding / 2)
    const rightPad = totalPadding - leftPad
    return " ".repeat(leftPad) + text + " ".repeat(rightPad)
  } else if (align === "right") {
    return " ".repeat(totalPadding) + text
  } else {
    return text + " ".repeat(totalPadding)
  }
}
```

Ubicación en código fuente: `index.ts:198-211`

**Reglas de relleno**

| Tipo de alineación | Relleno izquierdo | Relleno derecho | Ejemplo (ancho objetivo 10, texto "abc") |
| --- | --- | --- | --- |
| Alineación izquierda | 0 | totalPadding | `abc       ` |
| Centrado | floor(total/2) | total - floor(total/2) | `   abc    ` |
| Alineación derecha | totalPadding | 0 | `       abc` |

**Detalles matemáticos de la alineación centrada**

`Math.floor(totalPadding / 2)` asegura que el relleno izquierdo sea un número entero, y el espacio adicional se agrega a la derecha.

| Ancho objetivo | Ancho del texto | totalPadding | Relleno izquierdo | Relleno derecho | Resultado |
| --- | --- | --- | --- | --- | --- |
| 10 | 3 | 7 | 3 (7÷2=3.5→3) | 4 (7-3) | `   abc    ` |
| 11 | 3 | 8 | 4 (8÷2=4) | 4 (8-4) | `    abc    ` |
| 12 | 3 | 9 | 4 (9÷2=4.5→4) | 5 (9-4) | `    abc     ` |

## Ejemplo completo

**Tabla de entrada** (especificando diferentes tipos de alineación para cada columna):

```markdown
| 名称 | 状态 | 价格 | 描述 |
| :--- | :---: | ---: | :--- |
| 商品A | 激活 | 99.9 | 这是一个商品 |
| 商品B | 停用 | 199.0 | 这是另一个商品 |
```

**Resultado del formateo**:

```markdown
| 名称   |  状态  | 价格 | 描述         |
| :----- | :----: | ----: | :----------- |
| 商品A  |  激活  |  99.9 | 这是一个商品 |
| 商品B  |  停用  | 199.0 | 这是另一个商品 |
```

**Tipo de alineación de cada columna**:

| Nombre de columna | Sintaxis de fila separadora | Tipo de alineación | Descripción |
| --- | --- | --- | --- |
| 名称 | `:---` | Alineación izquierda | Texto alineado a la izquierda |
| 状态 | `:---:` | Centrado | Texto centrado |
| 价格 | `---:` | Alineación derecha | Números alineados a la derecha |
| 描述 | `:---` | Alineación izquierda | Texto alineado a la izquierda |

## Punto de control

Después de completar esta lección, deberías poder responder:

- [ ] ¿Cómo especificar alineación centrada? (Respuesta: usar `:---:` en la fila separadora)
- [ ] ¿Cómo especificar alineación derecha? (Respuesta: usar `---:` en la fila separadora)
- [ ] ¿Cuál es la sintaxis predeterminada para alineación izquierda? (Respuesta: `---` o `:---`)
- [ ] ¿Por qué la alineación centrada usa `Math.floor(totalPadding / 2)`? (Respuesta: para asegurar que el relleno izquierdo sea un número entero, el espacio adicional se agrega a la derecha)
- [ ] ¿Qué significa `:---:` en la fila separadora? (Respuesta: marcador de alineación centrada, dos puntos a ambos lados, guion en el medio)

## Advertencia de errores comunes

::: warning Malentendidos comunes
**Malentendido**: Cada fila debe especificar el tipo de alineación

**Realidad**: No es necesario. Solo la fila separadora especifica el tipo de alineación, y las filas de datos se alinearán automáticamente por columna.

La fila separadora es la "configuración", las filas de datos son el "contenido", una sola fila de configuración es suficiente.
:::

::: danger Recuerda
La posición de los dos puntos en la fila separadora **debe** corresponder a las columnas.

| Ejemplo incorrecto | Problema |
| --- | --- |
| `| :--- | --- |` | Primera columna centrada, segunda columna alineada a la izquierda (2 columnas) |
| `| :--- | ---: | :--- |` | Primera columna alineada a la izquierda, segunda columna alineada a la derecha, tercera columna alineada a la izquierda (3 columnas) |

El número de columnas en la fila separadora debe ser consistente con el número de columnas en el encabezado y las filas de datos.
:::

## Resumen de esta lección

| Tipo de alineación | Sintaxis de fila separadora | Casos de uso |
| --- | --- | --- |
| Alineación izquierda | `---` o `:---` | Texto, datos descriptivos (predeterminado) |
| Centrado | `:---:` | Etiquetas de estado, textos cortos, títulos |
| Alineación derecha | `---:` | Números, montos, fechas |

**Funciones clave**:

| Función | Propósito | Ubicación en código fuente |
| --- | --- | --- |
| `getAlignment()` | Analizar el tipo de alineación de las celdas de la fila separadora | 141-149 |
| `padCell()` | Rellenar celdas al ancho especificado | 198-211 |
| `formatSeparatorCell()` | Formatear celdas de la fila separadora | 213-217 |

**Fórmula mnemotécnica**:

> Dos puntos a ambos lados para centrar, dos puntos a la derecha para alinear a la derecha,
> Sin dos puntos por defecto a la izquierda, la fila separadora establece las reglas.

## Próxima lección

> En la próxima lección aprenderemos **[Preguntas frecuentes: ¿Qué hacer si la tabla no se formatea?](../../faq/troubleshooting/)**.
>
> Aprenderás:
> - Cómo localizar rápidamente el error `invalid structure`
> - Métodos para diagnosticar errores de configuración
> - Soluciones para problemas comunes de tablas

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-26

| Función | Ruta del archivo | Número de línea |
| --- | --- | --- |
| Análisis de alineación | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L141-L149) | 141-149 |
| Relleno de celdas | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L198-L211) | 198-211 |
| Formateo de fila separadora | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L213-L217) | 213-217 |
| Aplicación de alineación | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L107-L113) | 107-113 |

**Funciones clave**:
- `getAlignment(delimiterCell: string)`: analiza el tipo de alineación de las celdas de la fila separadora
  - Devuelve `"left"` | `"center"` | `"right"`
  - Lógica: dos puntos a ambos lados → centrado, solo dos puntos a la derecha → alineación derecha, otros → alineación izquierda

- `padCell(text, width, align)`: rellena celdas al ancho especificado
  - Calcula la diferencia entre el ancho de visualización y el ancho objetivo
  - Distribuye el relleno izquierdo y derecho según el tipo de alineación
  - Para centrado usa `Math.floor(totalPadding / 2)` para asegurar que el relleno izquierdo sea un número entero

- `formatSeparatorCell(width, align)`: formatea celdas de la fila separadora
  - Centrado: `:` + `-`*(width-2) + `:`
  - Alineación derecha: `-`*(width-1) + `:`
  - Alineación izquierda: `-`*width
  - Usa `Math.max(1, ...)` para asegurar que se mantenga al menos 1 guion

</details>
