---
title: "Limitaciones Conocidas: Tablas HTML no compatibles | opencode-md-table-formatter"
sidebarTitle: "Qué hacer si falla el formato de tablas"
subtitle: "Limitaciones Conocidas: Tablas HTML no compatibles"
description: "Conoce los límites técnicos de opencode-md-table-formatter, incluyendo la falta de soporte para tablas HTML y celdas multilínea. Evita usar el complemento en escenarios no compatibles para mejorar tu eficiencia."
tags:
  - "Limitaciones conocidas"
  - "Tablas HTML"
  - "Celdas multilínea"
  - "Tablas sin fila separadora"
prerequisite:
  - "start-features"
order: 70
---

# Limitaciones Conocidas: ¿Dónde están los límites del complemento?

::: info Lo que aprenderás
- Saber qué tipos de tablas no son compatibles con el complemento
- Evitar usar el complemento en escenarios no compatibles
- Entender los límites técnicos y las decisiones de diseño del complemento
:::

## Enfoque Central

Este complemento se enfoca en un objetivo: **optimizar el formato de tablas Markdown con tuberías para el modo oculto de OpenCode**.

Para lograr esto, hemos limitado deliberadamente algunas funciones para garantizar la confiabilidad y el rendimiento en los escenarios principales.

## Resumen de Limitaciones Conocidas

| Limitación | Descripción | ¿Plan de soporte? |
|--- | --- | ---|
| **Tablas HTML** | Solo admite tablas Markdown con tuberías (`\| ... \|`) | ❌ No compatible |
| **Celdas multilínea** | Las celdas no pueden contener etiquetas de salto de línea como `<br>` | ❌ No compatible |
| **Tablas sin fila separadora** | Debe tener una fila separadora `|---|` | ❌ No compatible |
| **Celdas combinadas** | No admite combinación de filas o columnas | ❌ No compatible |
| **Tablas sin encabezado** | La fila separadora se considera el encabezado, no se pueden crear tablas sin encabezado | ❌ No compatible |
| **Opciones de configuración** | No se puede personalizar el ancho de columnas, deshabilitar funciones, etc. | 🤔 Posiblemente en el futuro |
| **Tablas muy grandes** | El rendimiento de tablas de 100+ filas no está verificado | 🤔 Optimización futura |

---

## Detalles de las Limitaciones

### 1. No admite tablas HTML

**Fenómeno**

```html
<!-- Este tipo de tabla no se formateará -->
<table>
  <tr>
    <th>Columna 1</th>
    <th>Columna 2</th>
  </tr>
  <tr>
    <td>Dato 1</td>
    <td>Dato 2</td>
  </tr>
</table>
```

**Causa**

El complemento solo procesa tablas Markdown con tuberías (Pipe Table), es decir, el formato separado por `|`:

```markdown
| Columna 1 | Columna 2 |
|--- | ---|
| Dato 1 | Dato 2 |
```

**Base en el código fuente**

```typescript
// index.ts:58-61
function isTableRow(line: string): boolean {
  const trimmed = line.trim()
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.split("|").length > 2
}
```

La lógica de detección solo coincide con líneas que comienzan y terminan con `|`, las tablas HTML se omitirán directamente.

**Alternativa**

Si necesitas formatear tablas HTML, se recomienda:
- Usar otras herramientas especializadas de formato HTML
- Convertir tablas HTML a tablas Markdown con tuberías

---

### 2. No admite celdas multilínea

**Fenómeno**

```markdown
| Columna 1 | Columna 2 |
|--- | ---|
| Línea 1<br>Línea 2 | Una sola línea |
```

Al generar la salida, verás el comentario `<!-- table not formatted: invalid structure -->`.

**Causa**

El complemento procesa las tablas línea por línea, no admite saltos de línea dentro de las celdas.

**Base en el código fuente**

```typescript
// index.ts:25-56
function formatMarkdownTables(text: string): string {
  const lines = text.split("\n")
  // ... escaneo línea por línea, sin lógica para combinar múltiples líneas
}
```

**Alternativa**

- Dividir el contenido multilínea en múltiples filas de datos
- O aceptar que la tabla se vuelva más ancha, mostrando el contenido en una sola línea

---

### 3. No admite tablas sin fila separadora

**Fenómeno**

```markdown
<!-- Falta la fila separadora -->
| Columna 1 | Columna 2 |
| Dato 1 | Dato 2 |
| Dato 3 | Dato 4 |
```

Verás el comentario `<!-- table not formatted: invalid structure -->`.

**Causa**

Las tablas Markdown con tuberías deben incluir una fila separadora (Separator Row), que se usa para definir el número de columnas y el alineamiento.

**Base en el código fuente**

```typescript
// index.ts:86-87
const hasSeparator = lines.some((line) => isSeparatorRow(line))
return hasSeparator  // Retorna false si no hay fila separadora
```

**Forma correcta**

```markdown
| Columna 1 | Columna 2 |
| --- | --- |  ← Fila separadora
| Dato 1 | Dato 2 |
| Dato 3 | Dato 4 |
```

---

### 4. No admite celdas combinadas

**Fenómeno**

```markdown
| Columna 1 | Columna 2 |
|--- | ---|
| Combinar dos columnas |  ← Se espera que abarque la columna 1 y la columna 2
| Dato 1 | Dato 2 |
```

**Causa**

El estándar Markdown no admite sintaxis de celdas combinadas, y el complemento tampoco implementa ninguna lógica de combinación.

**Alternativa**

- Usar celdas vacías como marcadores de posición: `| Combinar dos columnas | |`
- O aceptar las limitaciones de Markdown y usar tablas HTML en su lugar

---

### 5. La fila separadora se considera el encabezado

**Fenómeno**

```markdown
|--- | --- | ---|
| Alineado a la izquierda | Centrado | Alineado a la derecha |
| Dato 1 | Dato 2 | Dato 3 |
```

La fila separadora se considerará como la fila del encabezado, no se pueden crear tablas de datos puros "sin encabezado".

**Causa**

La especificación Markdown considera la primera línea después de la fila separadora como el encabezado de la tabla (Table Header).

**Alternativa**

- Esta es una limitación de Markdown en sí, no exclusiva del complemento
- Si necesitas tablas sin encabezado, considera otros formatos (como CSV)

---

### 6. Sin opciones de configuración

**Fenómeno**

No se puede ajustar mediante archivo de configuración:
- Ancho mínimo/máximo de columnas
- Deshabilitar funciones específicas
- Personalizar la estrategia de caché

**Causa**

La versión actual (v0.0.3) no proporciona una interfaz de configuración, todos los parámetros están codificados en el código fuente.

::: tip Nota de versión
La versión actual del complemento es v0.0.3 (declarado en package.json). La v0.1.0 registrada en CHANGELOG.md es una planificación de versión futura, aún no publicada.
:::

**Base en el código fuente**

```typescript
// index.ts:115 - Ancho mínimo de columna codificado como 3
const colWidths: number[] = Array(colCount).fill(3)

// index.ts:222 - Umbral de caché codificado
if (cacheOperationCount > 100 || widthCache.size > 1000) {
  cleanupCache()
}
```

**Planificación futura**

El CHANGELOG menciona posible soporte futuro:
> Configuration options (min/max column width, disable features)

---

### 7. Rendimiento de tablas muy grandes no verificado

**Fenómeno**

Para tablas de 100+ filas, el formateo puede ser lento o consumir mucha memoria.

**Causa**

El complemento usa un mecanismo de escaneo línea por línea y caché, teóricamente puede procesar tablas grandes, pero no se ha realizado una optimización de rendimiento específica.

**Base en el código fuente**

```typescript
// index.ts:5-7
const widthCache = new Map<string, number>()
let cacheOperationCount = 0

// La caché se vacía después de 100 operaciones o 1000 entradas
if (cacheOperationCount > 100 || widthCache.size > 1000) {
  cleanupCache()
}
```

**Sugerencia**

- Para tablas muy grandes, se recomienda dividirlas en varias tablas más pequeñas
- O esperar versiones futuras con optimización de rendimiento

---

## Puntos de Verificación

Después de completar esta lección, deberías poder responder:

- [ ] ¿Qué formatos de tabla admite el complemento? (Respuesta: Solo admite tablas Markdown con tuberías)
- [ ] ¿Por qué no se pueden formatear celdas multilínea? (Respuesta: El complemento procesa línea por línea, sin lógica de combinación)
- [ ] ¿Cuál es el propósito de la fila separadora? (Respuesta: Define el número de columnas y el alineamiento, es obligatoria)
- [ ] ¿Se puede personalizar el ancho de columnas? (Respuesta: La versión actual no lo admite)

---

## Advertencia de Errores Comunes

::: warning Errores Comunes

**Error 1**: Esperar que las tablas HTML se formateen

El complemento solo procesa tablas Markdown con tuberías, las tablas HTML deben formatearse manualmente o usar otras herramientas.

**Error 2**: La tabla no tiene fila separadora

La fila separadora es una parte obligatoria de las tablas Markdown, su ausencia causará un error de "estructura inválida".

**Error 3**: El contenido de la celda es demasiado largo, haciendo que la tabla sea muy ancha

El complemento no tiene límite de ancho máximo de columna, si el contenido de la celda es demasiado largo, toda la tabla se volverá muy ancha. Se recomienda hacer saltos de línea manualmente o simplificar el contenido.

:::

---

## Resumen de la Lección

| Limitación | Causa | Alternativa |
|--- | --- | ---|
| Tablas HTML no compatibles | El complemento se enfoca en tablas Markdown con tuberías | Usar herramientas de formato HTML |
| Celdas multilínea no compatibles | Lógica de procesamiento línea por línea | Dividir en múltiples líneas o aceptar que se vuelva más ancha |
| Tablas sin fila separadora no compatibles | Requisito de la especificación Markdown | Agregar fila separadora `|---|` |
| Sin opciones de configuración | La versión actual no lo implementa | Esperar actualizaciones de versiones futuras

## Próxima Lección

> En la próxima lección aprenderemos **[Detalles Técnicos](../tech-details/)**.
>
> Aprenderás:
> - Cómo funciona el mecanismo de caché del complemento
> - Estrategias de optimización de rendimiento
> - Por qué la caché se vacía después de 100 operaciones

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver las ubicaciones del código fuente</strong></summary>

> Última actualización: 2026-01-26

| Limitación | Ruta del archivo | Número de línea |
|--- | --- | ---|
| Detección de tablas HTML | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61) | 58-61 |
| Detección de fila separadora | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L63-L68) | 63-68 |
| Validación de tabla (debe incluir fila separadora) | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88) | 70-88 |
| Ancho mínimo de columna codificado | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L115) | 115 |
| Umbral de caché codificado | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L222-L224) | 222-224 |

**Funciones clave**:
- `isTableRow()`: Detecta si es una fila de tabla Markdown con tuberías
- `isSeparatorRow()`: Detecta la fila separadora
- `isValidTable()`: Valida la validez de la estructura de la tabla

**Constantes clave**:
- `colWidths ancho mínimo = 3`: Ancho de visualización mínimo de las columnas
- `Umbral de caché = 100 operaciones o 1000 entradas`: Condición para activar la limpieza de caché

**Referencia del CHANGELOG**:
- Capítulo de limitaciones conocidas: [`CHANGELOG.md`](https://github.com/franlol/opencode-md-table-formatter/blob/main/CHANGELOG.md#L31-L36) líneas 31-36

</details>
