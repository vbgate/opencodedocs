---
title: "Vista General de Funciones: 8 Funciones Principales | opencode-md-table-formatter"
sidebarTitle: "8 Funciones Principales"
subtitle: "Vista General de Funciones: 8 Funciones Principales"
description: "Aprende las 8 funciones principales del complemento opencode-md-table-formatter. Domina el formateo automático de tablas, compatibilidad con modo oculto y soporte de alineación, procesa rápidamente Emoji y Unicode."
tags:
  - "formateo automático"
  - "modo oculto"
  - "soporte de alineación"
  - "protección de bloques de código"
prerequisite:
  - "start-getting-started"
order: 20
---

# Vista General de Funciones: La Magia del Formateo Automático

::: info Lo que lograrás al terminar
- Conocer las 8 funciones principales del complemento
- Saber qué escenarios son adecuados para usar este complemento
- Entender los límites del complemento (qué no puede hacer)
:::

## Tu problema actual

::: info Información del complemento
El nombre completo de este complemento es **@franlol/opencode-md-table-formatter**, en adelante llamado "complemento de formateo de tablas".
:::

Las tablas Markdown generadas por IA suelen ser así:

```markdown
| 名称 | 描述 | 状态 |
|---|---|---|
| **用户管理** | 管理系统用户 | ✅ 完成 |
| API | 接口文档 | 🚧 进行中 |
```

Los anchos de columna son irregulares, lo cual es incómodo de ver. ¿Ajustar manualmente? Cada vez que la IA genera una nueva tabla, tienes que ajustarla de nuevo, demasiado cansado.

## Cuándo usar este método

- La IA generó una tabla Markdown y quieres que esté más ordenada
- Habilitaste el modo oculto (Concealment Mode) de OpenCode y la alineación de tablas siempre tiene problemas
- No quieres ajustar manualmente el ancho de las columnas de la tabla

## Idea principal

El principio de funcionamiento de este complemento es muy simple:

```
IA genera texto → Complemento detecta tablas → Valida estructura → Formatea → Devuelve texto mejorado
```

Se monta en el hook `experimental.text.complete` de OpenCode. Cada vez que la IA termina de generar texto, el complemento lo procesa automáticamente. No necesitas activarlo manualmente, todo el proceso es imperceptible.

## 8 Funciones Principales

### 1. Formateo Automático de Tablas

El complemento detectará automáticamente las tablas Markdown en el texto generado por la IA, unificará el ancho de las columnas y hará que las tablas estén ordenadas y estéticas.

**Antes del formateo**:

```markdown
| 名称 | 描述 | 状态 |
|---|---|---|
| **用户管理** | 管理系统用户 | ✅ 完成 |
| API | 接口文档 | 🚧 进行中 |
```

**Después del formateo**:

```markdown
| 名称         | 描述         | 状态       |
| ------------ | ------------ | ---------- |
| **用户管理** | 管理系统用户 | ✅ 完成    |
| API          | 接口文档     | 🚧 进行中  |
```

::: tip Condición de activación
El complemento se monta en el hook `experimental.text.complete`, se activa automáticamente cuando la IA termina de generar texto, sin necesidad de operación manual.
:::

### 2. Compatibilidad con Modo Oculto

OpenCode habilita el modo oculto (Concealment Mode) por defecto, que oculta los símbolos de Markdown (como `**`, `*`, `~~`).

Las herramientas de formateo de tablas ordinarias no consideran esto, al calcular el ancho también cuentan `**`, lo que provoca desalineación.

Este complemento está optimizado específicamente para el modo oculto:

- Al calcular el ancho, elimina símbolos como `**negrita**`, `*cursiva*`, `~~tachado~~`
- Al generar, conserva la sintaxis Markdown original
- Efecto final: las tablas se alinean perfectamente en modo oculto

::: details Detalles técnicos: lógica de cálculo de ancho
```typescript
// Eliminar símbolos Markdown (para cálculo de ancho)
visualText = visualText
  .replace(/\*\*\*(.+?)\*\*\*/g, "$1") // ***negrita cursiva*** → texto
  .replace(/\*\*(.+?)\*\*/g, "$1")     // **negrita** → negrita
  .replace(/\*(.+?)\*/g, "$1")         // *cursiva* → cursiva
  .replace(/~~(.+?)~~/g, "$1")         // ~~tachado~~ → tachado
```
Ubicación del código fuente: `index.ts:181-185`
:::

### 3. Soporte de Alineación

Soporta los tres métodos de alineación de tablas Markdown:

| Sintaxis | Método de alineación | Efecto |
| --- | --- | --- |
| `---` o `:---` | Alineación izquierda | Texto a la izquierda (ambas sintaxis tienen el mismo efecto) |
| `:---:` | Centrado | Texto centrado |
| `---:` | Alineación derecha | Texto a la derecha |

**Ejemplo**:

```markdown
| Alineación izquierda | Centrado | Alineación derecha |
| :--- | :---: | ---: |
| Texto | Texto | Texto |
```

Después del formateo, cada columna se alineará según el método especificado, y la fila separadora se regenerará según el método de alineación.

### 4. Procesamiento de Markdown Anidado

Las celdas de la tabla pueden tener sintaxis Markdown anidada, como `***negrita cursiva***`.

El complemento utiliza un algoritmo de expresiones regulares de múltiples rondas, eliminando capa por capa de afuera hacia adentro:

```
***negrita cursiva*** → **negrita cursiva** → *negrita cursiva* → negrita cursiva
```

De esta manera, incluso si hay múltiples capas anidadas, el cálculo del ancho es preciso.

### 5. Protección de Bloques de Código

Los símbolos Markdown en el código en línea (envueltos con comillas invertidas) deben mantenerse tal como están, sin ser eliminados.

Por ejemplo, `` `**bold**` ``, lo que el usuario ve son los 8 caracteres `**bold**`, no los 4 caracteres `bold`.

El complemento primero extrae el contenido de los bloques de código, elimina los símbolos Markdown de otras partes, y luego devuelve el contenido de los bloques de código.

::: details Detalles técnicos: lógica de protección de bloques de código
```typescript
// Paso 1: Extraer y proteger código en línea
const codeBlocks: string[] = []
let textWithPlaceholders = text.replace(/`(.+?)`/g, (match, content) => {
  codeBlocks.push(content)
  return `\x00CODE${codeBlocks.length - 1}\x00`
})

// Paso 2: Eliminar símbolos Markdown de partes que no son código
// ...

// Paso 3: Restaurar contenido de código en línea
visualText = visualText.replace(/\x00CODE(\d+)\x00/g, (match, index) => {
  return codeBlocks[parseInt(index)]
})
```
Ubicación del código fuente: `index.ts:168-193`
:::

### 6. Manejo de Casos Límite

El complemento puede manejar correctamente varios casos límite:

| Escenario | Método de manejo |
| --- | --- |
| Emoji表情 | Usa `Bun.stringWidth` para calcular correctamente el ancho de visualización |
| Caracteres Unicode | Caracteres de ancho completo como chino, japonés se alinean correctamente |
| Celdas vacías | Rellenar con espacios hasta el ancho mínimo (3 caracteres) |
| Contenido demasiado largo | Procesar normalmente, sin truncar |

### 7. Operación Silenciosa

El complemento se ejecuta silenciosamente en segundo plano:

- **Sin salida de registro**: No imprimirá ninguna información en la consola
- **Los errores no interrumpen**: Incluso si el formateo falla, no afectará la salida normal de la IA

Si ocurre un error durante el formateo, el complemento conservará el texto original y agregará un comentario HTML al final:

```markdown
<!-- table formatting failed: [información de error] -->
```

### 8. Validación y Retroalimentación

El complemento validará si la estructura de la tabla es válida. Las tablas inválidas no se formatearán, sino que se conservarán tal como están y se agregará un mensaje:

```markdown
<!-- table not formatted: invalid structure -->
```

**Requisitos para tablas válidas**:

- Al menos 2 filas (incluyendo la fila separadora)
- Todas las filas tienen el mismo número de columnas
- Debe tener una fila separadora (formato: `|---|---|`)

## Límites del Complemento

::: warning Escenarios no compatibles
- **Tablas HTML**: Solo procesa tablas de tuberías Markdown (`| ... |`)
- **Celdas de varias líneas**: Las celdas que contienen etiquetas `<br>` no son compatibles
- **Tablas sin fila separadora**: Debe tener una fila separadora `|---|---|`
- **Tablas sin encabezado**: Debe tener una fila de encabezado
:::

## Puntos de Verificación

Después de completar esta lección, deberías poder responder:

- [ ] ¿Cómo se activa automáticamente el complemento? (Respuesta: hook `experimental.text.complete`)
- [ ] ¿Por qué se necesita "compatibilidad con modo oculto"? (Respuesta: el modo oculto oculta los símbolos Markdown, lo que afecta el cálculo del ancho)
- [ ] ¿Se eliminarán los símbolos Markdown en el código en línea? (Respuesta: No, los símbolos Markdown dentro del código se conservarán completamente)
- [ ] ¿Cómo se manejan las tablas inválidas? (Respuesta: Se conservan tal como están, se agrega un comentario de error)

## Resumen de esta Lección

| Función | Descripción |
| --- | --- |
| Formateo automático | Se activa automáticamente cuando la IA termina de generar texto, sin necesidad de operación manual |
| Compatibilidad con modo oculto | Calcula correctamente el ancho de visualización después de ocultar los símbolos Markdown |
| Soporte de alineación | Alineación izquierda, centrado, alineación derecha |
| Markdown anidado | Eliminación de expresiones regulares de múltiples rondas, soporta sintaxis anidada |
| Protección de bloques de código | Los símbolos en el código en línea se mantienen tal como están |
| Casos límite | Emoji, Unicode, celdas vacías, contenido demasiado largo |
| Operación silenciosa | Sin registros, los errores no interrumpen |
| Validación y retroalimentación | Agrega comentarios de error para tablas inválidas |

## Próxima Lección

> En la próxima lección profundizaremos en **[Principio del Modo Oculto](../../advanced/concealment-mode/)**.
>
> Aprenderás:
> - El principio de funcionamiento del modo oculto de OpenCode
> - Cómo el complemento calcula correctamente el ancho de visualización
> - El papel de `Bun.stringWidth`

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-26

| Función | Ruta del archivo | Líneas |
| --- | --- | --- |
| Entrada del complemento | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L9-L23) | 9-23 |
| Detección de tablas | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61) | 58-61 |
| Validación de tablas | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88) | 70-88 |
| Cálculo de ancho (modo oculto) | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L161-L196) | 161-196 |
| Análisis de métodos de alineación | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L141-L149) | 141-149 |
| Protección de bloques de código | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L168-L173) | 168-173 |

**Constantes clave**:
- `colWidths[col] = 3`: El ancho mínimo de columna es de 3 caracteres (`index.ts:115`)

**Funciones clave**:
- `formatMarkdownTables()`: Función principal de procesamiento, formatea todas las tablas en el texto
- `getStringWidth()`: Calcula el ancho de visualización de la cadena, elimina símbolos Markdown
- `isValidTable()`: Valida si la estructura de la tabla es válida

</details>
