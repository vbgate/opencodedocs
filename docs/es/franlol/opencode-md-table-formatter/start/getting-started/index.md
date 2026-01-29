---
title: "Inicio Rápido: Instalación y Configuración | opencode-md-table-formatter"
sidebarTitle: "Alinea tablas en 1 minuto"
subtitle: "Comienza en un minuto: instalación y configuración"
description: "Aprende los métodos de instalación y configuración de opencode-md-table-formatter. Completa la instalación del complemento en 1 minuto y haz que las tablas generadas por IA se alineen automáticamente mediante el archivo de configuración."
tags:
  - "installation"
  - "configuration"
  - "opencode-plugin"
prerequisite: []
order: 10
---

# Comienza en un minuto: Instalación y Configuración

::: info Lo que lograrás al terminar
- Instalar el complemento de formateo de tablas en OpenCode
- Hacer que las tablas Markdown generadas por IA se alineen automáticamente
- Verificar que el complemento funcione correctamente
:::

## Tu problema actual

Las tablas Markdown generadas por IA suelen ser así:

```markdown
| 名称 | 描述 | 状态 |
|--- | --- | ---|
| 功能A | 这是一个很长的描述文本 | 已完成 |
| B | 短 | 进行中 |
```

Los anchos de columna son irregulares, lo cual es incómodo de ver. ¿Ajustar manualmente? Demasiado tiempo.

## Cuándo usar este método

- Haces que la IA genere tablas con frecuencia (comparaciones, listas, descripciones de configuración)
- Quieres que las tablas se muestren ordenadas en OpenCode
- No quieres ajustar el ancho de columna manualmente cada vez

## 🎒 Preparativos antes de comenzar

::: warning Requisitos previos
- OpenCode instalado (versión >= 1.0.137)
- Sabes dónde está el archivo de configuración `.opencode/opencode.jsonc`
:::

## Sígueme

### Paso 1: Abrir el archivo de configuración

**Por qué**: Los complementos se declaran a través del archivo de configuración y OpenCode los carga automáticamente al iniciarse.

Encuentra tu archivo de configuración de OpenCode:

::: code-group

```bash [macOS/Linux]
# El archivo de configuración suele estar en el directorio raíz del proyecto
ls -la .opencode/opencode.jsonc

# O en el directorio del usuario
ls -la ~/.config/opencode/opencode.jsonc
```

```powershell [Windows]
# El archivo de configuración suele estar en el directorio raíz del proyecto
Get-ChildItem .opencode\opencode.jsonc

# O en el directorio del usuario
Get-ChildItem "$env:APPDATA\opencode\opencode.jsonc"
```

:::

Abre este archivo con tu editor favorito.

### Paso 2: Agregar configuración del complemento

**Por qué**: Indicar a OpenCode que cargue el complemento de formateo de tablas.

Agrega el campo `plugin` en el archivo de configuración:

```jsonc
{
  // ... otras configuraciones ...
  "plugin": ["@franlol/opencode-md-table-formatter@0.0.3"]
}
```

::: tip ¿Ya tienes otros complementos?
Si ya tienes un array `plugin`, agrega el nuevo complemento al array:

```jsonc
{
  "plugin": [
    "existing-plugin",
    "@franlol/opencode-md-table-formatter@0.0.3"  // Agrégalo aquí
  ]
}
```
:::

**Deberías ver**: El archivo de configuración se guardó correctamente, sin mensajes de error de sintaxis.

### Paso 3: Reiniciar OpenCode

**Por qué**: Los complementos se cargan al iniciar OpenCode, por lo que debes reiniciar después de modificar la configuración para que surta efecto.

Cierra la sesión actual de OpenCode y reiníciala.

**Deberías ver**: OpenCode se inicia normalmente, sin errores.

### Paso 4: Verificar que el complemento funcione

**Por qué**: Confirmar que el complemento se ha cargado correctamente y está funcionando.

Pide a la IA que genere una tabla, por ejemplo ingresa:

```
帮我生成一个表格，对比 React、Vue、Angular 三个框架的特点
```

**Deberías ver**: Las tablas generadas por la IA tienen anchos de columna uniformes, así:

```markdown
| 框架    | 特点                     | 学习曲线 |
|--- | --- | ---|
| React   | 组件化、虚拟 DOM         | 中等     |
| Vue     | 渐进式、双向绑定         | 较低     |
| Angular | 全功能框架、TypeScript   | 较高     |
```

## Puntos de verificación ✅

Después de completar los pasos anteriores, verifica los siguientes puntos:

| Elemento de verificación | Resultado esperado |
|--- | ---|
| Sintaxis del archivo de configuración | Sin errores |
| Inicio de OpenCode | Inicio normal, sin errores de carga de complementos |
| Tablas generadas por IA | Anchos de columna alineados automáticamente, formato de fila separador unificado |

## Advertencias sobre problemas comunes

### ¿La tabla no se formateó?

1. **Verifica la ruta del archivo de configuración**: Asegúrate de modificar el archivo de configuración que OpenCode realmente lee
2. **Verifica el nombre del complemento**: Debe ser `@franlol/opencode-md-table-formatter@0.0.3`, nota el símbolo `@`
3. **Reinicia OpenCode**: Debes reiniciar después de modificar la configuración

### ¿Ves el comentario "invalid structure"?

Esto indica que la estructura de la tabla no cumple con las especificaciones de Markdown. Causas comunes:

- Falta la fila separadora (`|---|---|`)
- El número de columnas en cada fila es inconsistente

Consulta el capítulo [Preguntas frecuentes](../../faq/troubleshooting/) para más detalles.

## Resumen de esta lección

- Los complementos se configuran mediante el campo `plugin` en `.opencode/opencode.jsonc`
- El número de versión `@0.0.3` garantiza el uso de una versión estable
- Debes reiniciar OpenCode después de modificar la configuración
- El complemento formateará automáticamente todas las tablas Markdown generadas por IA

## Próxima lección

> En la próxima lección aprenderemos **[Vista general de funciones](../features/)**.
>
> Aprenderás:
> - Las 8 funciones principales del complemento
> - El principio de cálculo de ancho en modo oculto
> - Qué tablas se pueden formatear y cuáles no

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-26

| Función | Ruta del archivo | Líneas |
|--- | --- | ---|
| Entrada del complemento | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L9-L23) | 9-23    |
| Registro de hooks | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L11-L13) | 11-13   |
| Configuración del paquete | [`package.json`](https://github.com/franlol/opencode-md-table-formatter/blob/main/package.json#L1-L41) | 1-41    |

**Constantes clave**:
- `@franlol/opencode-md-table-formatter@0.0.3`: nombre del paquete npm y versión
- `experimental.text.complete`: nombre del hook que escucha el complemento

**Requisitos de dependencia**:
- OpenCode >= 1.0.137
- `@opencode-ai/plugin` >= 0.13.7

</details>
