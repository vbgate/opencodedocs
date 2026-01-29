---
title: "Especificación de Tabla: Condiciones de Formato | opencode-md-table-formatter"
sidebarTitle: "Resolver el error invalid structure"
subtitle: "Especificación de Tabla: Qué tablas pueden ser formateadas"
description: "Aprende las 4 condiciones válidas para tablas Markdown. Domina los caracteres de tubería al inicio y final de líneas, sintaxis de filas separadoras, consistencia de columnas y resuelve el error invalid structure."
tags:
  - "validación de tablas"
  - "fila separadora"
  - "consistencia de columnas"
  - "sintaxis de alineación"
prerequisite:
  - "start-features"
order: 40
---

# Especificación de Tabla: Qué tablas pueden ser formateadas

::: info Lo que podrás hacer al completar esta lección
- Saber qué tablas pueden ser formateadas por el plugin
- Comprender la causa del error `invalid structure`
- Escribir tablas Markdown que cumplan con las especificaciones
:::

## Tu problema actual

La IA generó una tabla, pero el plugin no la formateó y añadió un comentario al final:

```markdown
<!-- table not formatted: invalid structure -->
```

¿Qué es una "estructura inválida"? ¿Por qué mi tabla no funciona?

## Cuándo usar este método

- Cuando encuentres el error `invalid structure` y quieras saber qué está mal
- Cuando quieras asegurar que las tablas generadas por IA puedan ser formateadas correctamente
- Cuando quieras escribir manualmente una tabla Markdown que cumpla con las especificaciones

## Idea central

El plugin realiza tres capas de validación antes de formatear:

```
Capa 1: ¿Es una fila de tabla? → isTableRow()
Capa 2: ¿Tiene fila separadora? → isSeparatorRow()
Capa 3: ¿Es la estructura válida? → isValidTable()
```

Solo cuando las tres capas pasan, se formatea. Si alguna capa falla, se mantiene el contenido original y se añade un comentario de error.

## Las 4 condiciones para una tabla válida

### Condición 1: Cada fila debe comenzar y terminar con `|`

Este es el requisito más básico. Cada fila de una tabla de tubería Markdown (Pipe Table) debe estar envuelta con `|`.

```markdown
✅ Correcto
| Nombre | Descripción |

❌ Incorrecto
Nombre | Descripción      ← Falta | al inicio
| Nombre | Descripción     ← Falta | al final
```

::: details Implementación en código fuente
```typescript
function isTableRow(line: string): boolean {
  const trimmed = line.trim()
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.split("|").length > 2
}
```
Ubicación en código fuente: `index.ts:58-61`
:::

### Condición 2: Cada fila debe tener al menos 2 separadores

`split("|").length > 2` significa que debe haber al menos 2 `|` separando el contenido.

```markdown
✅ Correcto (3 |, 2 separadores)
| Nombre | Descripción |

❌ Incorrecto (solo 2 |, 1 separador)
| Nombre |
```

En otras palabras, **las tablas de una sola columna son válidas**, pero deben escribirse en la forma `| contenido |`.

### Condición 3: Debe tener una fila separadora

La fila separadora es la línea entre el encabezado y las filas de datos, utilizada para definir la alineación.

```markdown
| Nombre | Descripción |
| --- | --- |      ← Esta es la fila separadora
| Valor1 | Valor2 |
```

**Reglas de sintaxis para la fila separadora**:

Cada celda debe coincidir con la expresión regular `/^\s*:?-+:?\s*$/`, traducido al lenguaje humano significa:

| Componente | Significado | Ejemplo |
| --- | --- | --- |
| `\s*` | Espacio opcional | Permite `| --- |` o `|---|` |
| `:?` | Dos puntos opcionales | Para especificar la alineación |
| `-+` | Al menos un guion | `-`, `---`, `------` funcionan |

**Ejemplos de filas separadoras válidas**:

```markdown
| --- | --- |           ← Forma más simple
| :--- | ---: |         ← Con marcadores de alineación
| :---: | :---: |       ← Alineación central
|---|---|               ← Sin espacios también funciona
| -------- | -------- | ← Guiones largos también funcionan
```

**Ejemplos de filas separadoras inválidas**:

```markdown
| === | === |           ← Usó signos de igual, no guiones
| - - | - - |           ← Espacios entre guiones
| ::: | ::: |           ← Solo dos puntos, sin guiones
```

::: details Implementación en código fuente
```typescript
function isSeparatorRow(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return false
  const cells = trimmed.split("|").slice(1, -1)
  return cells.length > 0 && cells.every((cell) => /^\s*:?-+:?\s*$/.test(cell))
}
```
Ubicación en código fuente: `index.ts:63-68`
:::

### Condición 4: Todas las filas deben tener el mismo número de columnas

Si la primera fila tiene 3 columnas, cada fila posterior debe tener 3 columnas.

```markdown
✅ Correcto (cada fila tiene 3 columnas)
| A | B | C |
| --- | --- | --- |
| 1 | 2 | 3 |

❌ Incorrecto (la tercera fila solo tiene 2 columnas)
| A | B | C |
| --- | --- | --- |
| 1 | 2 |
```

::: details Implementación en código fuente
```typescript
function isValidTable(lines: string[]): boolean {
  if (lines.length < 2) return false

  const rows = lines.map((line) =>
    line.split("|").slice(1, -1).map((cell) => cell.trim()),
  )

  if (rows.length === 0 || rows[0].length === 0) return false

  const firstRowCellCount = rows[0].length
  const allSameColumnCount = rows.every((row) => row.length === firstRowCellCount)
  if (!allSameColumnCount) return false

  const hasSeparator = lines.some((line) => isSeparatorRow(line))
  return hasSeparator
}
```
Ubicación en código fuente: `index.ts:70-88`
:::

## Referencia rápida de sintaxis de alineación

La fila separadora no solo sirve para separar, sino también para especificar el método de alineación:

| Sintaxis | Alineación | Efecto |
| --- | --- | --- |
| `---` o `:---` | Alineación izquierda | Texto a la izquierda (predeterminado) |
| `:---:` | Centrado | Texto centrado |
| `---:` | Alineación derecha | Texto a la derecha |

**Ejemplo**:

```markdown
| Alineación izquierda | Centrado | Alineación derecha |
| :--- | :---: | ---: |
| Texto | Texto | Texto |
```

Después de formatear:

```markdown
| Alineación izquierda | Centrado | Alineación derecha |
| :------------------- | :------: | ----------------: |
| Texto                |  Texto   |            Texto |
```

::: details Implementación en código fuente
```typescript
function getAlignment(delimiterCell: string): "left" | "center" | "right" {
  const trimmed = delimiterCell.trim()
  const hasLeftColon = trimmed.startsWith(":")
  const hasRightColon = trimmed.endsWith(":")

  if (hasLeftColon && hasRightColon) return "center"
  if (hasRightColon) return "right"
  return "left"
}
```
Ubicación en código fuente: `index.ts:141-149`
:::

## Solución de errores comunes

| Síntoma de error | Causa posible | Solución |
| --- | --- | --- |
| `invalid structure` | Falta fila separadora | Agrega `\| --- \| --- \|` después del encabezado |
| `invalid structure` | Número de columnas inconsistente | Verifica que cada fila tenga el mismo número de `\|` |
| `invalid structure` | Falta `\|` al inicio/final de fila | Agrega los `\|` faltantes |
| La tabla no se detecta | Solo tiene 1 columna | Asegúrate de tener al menos 2 separadores `\|` |
| La alineación no funciona | Error de sintaxis en fila separadora | Verifica que uses `-` y no otros caracteres |

## Puntos de verificación

Al completar esta lección, deberías poder responder:

- [ ] ¿Qué condiciones debe cumplir una fila de tabla? (Respuesta: comenzar y terminar con `|`, al menos 2 separadores)
- [ ] ¿Qué significa la expresión regular de la fila separadora? (Respuesta: dos puntos opcionales + al menos un guion + dos puntos opcionales)
- [ ] ¿Por qué aparece `invalid structure`? (Respuesta: falta fila separadora, número de columnas inconsistente, o falta `|` al inicio/final de fila)
- [ ] ¿Qué alineación representa `:---:`? (Respuesta: alineación centrada)

## Resumen de esta lección

| Condición | Requisito |
| --- | --- |
| Inicio y final de fila | Debe comenzar y terminar con `\|` |
| Cantidad de separadores | Al menos 2 `\|` |
| Fila separadora | Debe existir, formato `:?-+:?` |
| Consistencia de columnas | Todas las filas deben tener el mismo número de columnas |

**Fórmula mnemotécnica**:

> Tuberías en ambos extremos, guiones en la fila separadora, columnas consistentes son esenciales, cuatro reglas para recordar.

## Próxima lección

> En la próxima lección aprenderemos **[Detalles de Alineación](../alignment/)**.
>
> Aprenderás:
> - Uso detallado de los tres métodos de alineación
> - Principio de implementación del formateo de filas separadoras
> - Algoritmo de relleno de celdas

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-26

| Función | Ruta del archivo | Número de línea |
| --- | --- | --- |
| Determinación de fila de tabla | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61) | 58-61 |
| Determinación de fila separadora | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L63-L68) | 63-68 |
| Validación de tabla | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88) | 70-88 |
| Análisis de alineación | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L141-L149) | 141-149 |
| Manejo de tablas inválidas | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L44-L47) | 44-47 |

**Expresiones regulares clave**:
- `/^\s*:?-+:?\s*$/`: Regla de coincidencia para celdas de fila separadora

**Funciones clave**:
- `isTableRow()`: Determina si es una fila de tabla
- `isSeparatorRow()`: Determina si es una fila separadora
- `isValidTable()`: Valida si la estructura de la tabla es válida
- `getAlignment()`: Analiza el método de alineación

</details>
