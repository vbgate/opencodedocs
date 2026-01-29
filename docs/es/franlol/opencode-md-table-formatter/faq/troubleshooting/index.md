---
title: "Solución de Problemas: Formato de Tablas | opencode-md-table-formatter"
sidebarTitle: "Qué hacer si las tablas no se formatean"
subtitle: "Solución de Problemas: Formato de Tablas"
description: "Aprende métodos de solución de problemas para el complemento opencode-md-table-formatter. Identifica rápidamente problemas comunes como tablas sin formato y estructuras inválidas, domina la verificación de configuración y soluciones."
tags:
  - "troubleshooting"
  - "preguntas frecuentes"
prerequisite:
  - "start-getting-started"
order: 60
---

# Preguntas Frecuentes: Qué hacer si las tablas no se formatean

## Lo que aprenderás

Esta lección te ayudará a diagnosticar y resolver rápidamente problemas comunes al usar el complemento:

- Identificar las razones por las que las tablas no se formatean
- Comprender el significado del error "estructura de tabla inválida"
- Conocer las limitaciones conocidas del complemento y escenarios donde no aplica
- Verificar rápidamente si la configuración es correcta

---

## Problema 1: Las tablas no se formatean automáticamente

### Síntomas

La IA generó una tabla, pero los anchos de columna no son consistentes y no están alineados.

### Causas posibles y soluciones

#### Causa 1: Complemento no configurado

**Pasos de verificación**:

1. Abre el archivo `.opencode/opencode.jsonc`
2. Confirma que el complemento esté en el array `plugin`:

```jsonc
{
  "plugin": ["@franlol/opencode-md-table-formatter@0.0.3"]
}
```

3. Si no está, agrega la configuración del complemento
4. **Reinicia OpenCode** para que la configuración surta efecto

::: tip Formato de configuración
Asegúrate de que el número de versión y el nombre del paquete sean correctos, usando el formato `@franlol/opencode-md-table-formatter` + `@` + número de versión.
:::

#### Causa 2: OpenCode no se reinició

**Solución**:

Después de agregar el complemento, debes reiniciar OpenCode por completo (no solo recargar la página) para que el complemento se cargue.

#### Causa 3: Falta la fila separadora en la tabla

**Ejemplo de síntoma**:

```markdown
| Name | Age |
| Alice | 25 |
| Bob | 30 |
```

Esta tabla no se formateará.

**Solución**:

Agrega la fila separadora (segunda fila, en formato `|---|`):

```markdown
| Name | Age |
|------|-----|
| Alice | 25 |
| Bob | 30 |
```

::: info Función de la fila separadora
La fila separadora es la sintaxis estándar de las tablas Markdown, utilizada para distinguir entre el encabezado y las filas de contenido, y también para especificar la alineación. El complemento **debe** detectar la fila separadora para formatear la tabla.
:::

#### Causa 4: Versión de OpenCode demasiado antigua

**Pasos de verificación**:

1. Abre el menú de ayuda de OpenCode
2. Verifica el número de versión actual
3. Confirma que la versión sea >= 1.0.137

**Solución**:

Actualiza a la última versión de OpenCode.

::: warning Requisito de versión
El complemento utiliza el hook `experimental.text.complete`, que está disponible en OpenCode versión 1.0.137+.
:::

---

## Problema 2: Ver el comentario "invalid structure"

### Síntomas

Aparece al final de la tabla:

```markdown
<!-- table not formatted: invalid structure -->
```

### ¿Qué es una "estructura de tabla inválida"?

El complemento valida cada tabla Markdown, y solo se formatean las tablas que pasan la validación. Si la estructura de la tabla no cumple con las especificaciones, el complemento conservará el texto original y agregará este comentario.

### Causas comunes

#### Causa 1: Número insuficiente de filas

**Ejemplo incorrecto**:

```markdown
| Name |
```

Solo tiene 1 fila, el formato está incompleto.

**Ejemplo correcto**:

```markdown
| Name |
|------|
```

Se requieren al menos 2 filas (incluida la fila separadora).

#### Causa 2: Número de columnas inconsistente

**Ejemplo incorrecto**:

```markdown
| Name | Age |
|------|-----|
| Alice |
```

La primera fila tiene 2 columnas, la segunda fila tiene 1 columna, el número de columnas es inconsistente.

**Ejemplo correcto**:

```markdown
| Name | Age |
|------|-----|
| Alice | 25 |
```

Todas las filas deben tener el mismo número de columnas.

#### Causa 3: Falta la fila separadora

**Ejemplo incorrecto**:

```markdown
| Name | Age |
| Alice | 25 |
| Bob | 30 |
```

No hay una fila separadora como `|---|---|`.

**Ejemplo correcto**:

```markdown
| Name | Age |
|------|-----|
| Alice | 25 |
| Bob | 30 |
```

### Cómo diagnosticar rápidamente

Usa la siguiente lista de verificación:

- [ ] La tabla tiene al menos 2 filas
- [ ] Todas las filas tienen el mismo número de columnas (cuenta cuántos `|` hay en cada fila)
- [ ] Existe una fila separadora (la segunda fila suele estar en formato `|---|`)

Si todo lo anterior se cumple pero aún aparece el error, verifica si hay caracteres ocultos o espacios adicionales que causen un error en el cálculo del número de columnas.

---

## Problema 3: Ver el comentario "table formatting failed"

### Síntomas

Aparece al final del texto:

```markdown
<!-- table formatting failed: {错误信息} -->
```

### Causa

El complemento lanzó una excepción no esperada internamente.

### Solución

1. **Verifica el mensaje de error**: la parte `{错误信息}` en el comentario explicará el problema específico
2. **Verifica el contenido de la tabla**: confirma si hay casos extremos especiales (como líneas muy largas, combinaciones de caracteres especiales)
3. **Conserva el texto original**: incluso si falla, el complemento no destruirá el texto original, tu contenido está seguro
4. **Reporta el problema**: si el problema ocurre repetidamente, puedes enviar un reporte en [GitHub Issues](https://github.com/franlol/opencode-md-table-formatter/issues)

::: tip Aislamiento de errores
El complemento envuelve la lógica de formateo con try-catch, por lo que incluso si hay un error, no interrumpirá el flujo de trabajo de OpenCode.
:::

---

## Problema 4: Algunos tipos de tablas no son compatibles

### Tipos de tablas no compatibles

#### Tablas HTML

**No compatible**:

```html
<table>
  <tr><th>Name</th></tr>
  <tr><td>Alice</td></tr>
</table>
```

**Solo compatible**: Tablas de canalización Markdown (Pipe Table)

#### Celdas multilínea

**No compatible**:

```markdown
| Name | Description |
|------|-------------|
| Alice | Line 1<br>Line 2 |
```

::: info Por qué no es compatible
El complemento está diseñado para tablas simples generadas por IA, las celdas multilínea requieren una lógica de diseño más compleja.
:::

#### Tablas sin fila separadora

**No compatible**:

```markdown
| Name | Age |
| Alice | 25 |
| Bob | 30 |
```

Debe tener una fila separadora (ver "Causa 3" arriba).

---

## Problema 5: Las tablas aún no están alineadas después del formateo

### Causas posibles

#### Causa 1: Modo de ocultación no habilitado

El complemento está optimizado para el modo de ocultación (Concealment Mode) de OpenCode, que oculta los símbolos Markdown (como `**`, `*`).

Si tu editor no tiene habilitado el modo de ocultación, las tablas pueden parecer "no alineadas" porque los símbolos Markdown ocupan el ancho real.

**Solución**:

Confirma que el modo de ocultación de OpenCode esté habilitado (habilitado por defecto).

#### Causa 2: Contenido de celda demasiado largo

Si el contenido de una celda es muy largo, la tabla puede estirarse mucho.

Este es un comportamiento normal, el complemento no truncará el contenido.

#### Causa 3: Símbolos en código en línea

Los símbolos Markdown en código en línea (`` `**code**` ``) se calculan **según el ancho literal** y no se eliminarán.

**Ejemplo**:

```
| 符号 | 宽度 |
|------|------|
| 普通文本 | 4 |
| `**bold**` | 8 |
```

Este es el comportamiento correcto, porque en el modo de ocultación, los símbolos dentro de los bloques de código son visibles.

---

## Resumen de la lección

En esta lección, has aprendido:

- **Diagnosticar tablas sin formato**: verificar configuración, reinicio, requisitos de versión, fila separadora
- **Comprender errores de tabla inválida**: validación de número de filas, número de columnas, fila separadora
- **Identificar limitaciones conocidas**: tablas HTML, celdas multilínea, tablas sin fila separadora no son compatibles
- **Autoverificación rápida**: usar la lista de verificación para validar la estructura de la tabla

---

## ¿Aún no resuelto?

Si has verificado todos los problemas anteriores pero el problema persiste:

1. **Verifica los registros completos**: el complemento funciona en modo silencioso por defecto, sin registros detallados
2. **Envía un Issue**: en [GitHub Issues](https://github.com/franlol/opencode-md-table-formatter/issues) proporciona tu ejemplo de tabla y el mensaje de error
3. **Consulta cursos avanzados**: lee [Especificaciones de tablas](../../advanced/table-spec/) y [Principios del modo de ocultación](../../advanced/concealment-mode/) para obtener más detalles técnicos

---

## Próxima lección

> En la próxima lección aprenderemos **[Limitaciones conocidas: ¿Dónde están los límites del complemento?](../../appendix/limitations/)**.
>
> Aprenderás:
> - Los límites de diseño y restricciones del complemento
> - Posibles mejoras futuras
> - Cómo determinar si un escenario es adecuado para usar este complemento

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-26

| Función            | Ruta del archivo                                                                                    | Línea    |
| --------------- | ------------------------------------------------------------------------------------------- | ------- |
| Lógica de validación de tabla    | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88)     | 70-88   |
| Detección de filas de tabla      | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61)     | 58-61   |
| Detección de fila separadora      | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L63-L68)     | 63-68   |
| Manejo de errores        | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L15-L20)     | 15-20   |
| Comentario de tabla inválida    | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L44-L47)     | 44-47   |

**Reglas de negocio clave**:
- `isValidTable()`: valida que la tabla tenga al menos 2 filas, todas las filas con el mismo número de columnas, y exista una fila separadora (líneas 70-88)
- `isSeparatorRow()`: usa la expresión regular `/^\s*:?-+:?\s*$/` para detectar la fila separadora (líneas 63-68)
- Ancho mínimo de columna: 3 caracteres (línea 115)

**Mecanismo de manejo de errores**:
- try-catch envuelve la función de procesamiento principal (líneas 15-20)
- Fallo de formateo: conservar texto original + agregar comentario `<!-- table formatting failed: {message} -->`
- Fallo de validación: conservar texto original + agregar comentario `<!-- table not formatted: invalid structure -->`

</details>
