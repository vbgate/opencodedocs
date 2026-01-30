---
title: "Comando list: Listar habilidades | OpenSkills"
sidebarTitle: "Inventario de habilidades instaladas"
subtitle: "Comando list: Listar habilidades"
description: "Aprende a usar el comando OpenSkills list. Consulta todas las habilidades instaladas, comprende la diferencia entre las etiquetas project y global y sus reglas de prioridad, localiza rápidamente las habilidades disponibles."
tags:
  - "Gestión de habilidades"
  - "Uso de comandos"
  - "CLI"
prerequisite:
  - "start-installation"
  - "start-first-skill"
order: 4
---

# Listar habilidades instaladas

## Lo que lograrás después de esta lección

- Usar `openskills list` para ver todas las habilidades instaladas
- Comprender la diferencia entre las etiquetas de ubicación `(project)` y `(global)`
- Calcular rápidamente la cantidad de habilidades de proyecto y globales
- Determinar si una habilidad se instaló correctamente

## Tu situación actual

Después de instalar varias habilidades, puedes encontrarte con estos problemas:

- "¿Qué habilidades acabé de instalar? Olvidé"
- "¿Esta habilidad se instaló en el proyecto o globalmente?"
- "¿Por qué ciertas habilidades se pueden ver en el proyecto A pero no en el proyecto B?"
- "Quiero eliminar algunas habilidades que no uso, pero no recuerdo sus nombres exactos"

El comando `openskills list` está diseñado para resolver estas dudas: funciona como un "directorio" de habilidades, permitiéndote ver de un vistazo todas las habilidades instaladas y sus ubicaciones.

## Cuándo usar esta técnica

| Escenario | Acción |
|--- | ---|
| Verificar la instalación después de instalar habilidades | Ejecutar `openskills list` para ver si la habilidad aparece |
| Cambiar a un nuevo proyecto y comprobar habilidades disponibles | Ejecutar `openskills list` para ver qué habilidades de proyecto hay |
| Inventario antes de limpiar habilidades | Ejecutar `openskills list` para listar todas las habilidades, luego eliminar las innecesarias |
| Depurar problemas de carga de habilidades | Confirmar si el nombre de la habilidad y la ubicación de instalación son correctos |

## Idea clave

OpenSkills admite la instalación de habilidades en **4 ubicaciones** (según prioridad de búsqueda):

1. **project .agent/skills** - Directorio de habilidades generales a nivel de proyecto (entorno de múltiples agentes)
2. **global .agent/skills** - Directorio de habilidades generales global (entorno de múltiples agentes)
3. **project .claude/skills** - Directorio de habilidades de Claude Code a nivel de proyecto
4. **global .claude/skills** - Directorio de habilidades de Claude Code global

`openskills list` realizará:

1. Recorrer estos 4 directorios para buscar todas las habilidades
2. **Deduplicar**: mostrar habilidades con el mismo nombre solo una vez (prioridad para las de proyecto)
3. **Ordenar**: habilidades de proyecto primero, globales después; dentro de la misma ubicación en orden alfabético
4. **Marcar ubicación**: distinguir con etiquetas `(project)` y `(global)`
5. **Resumen estadístico**: mostrar cantidad de habilidades de proyecto, globales y total

::: info ¿Por qué es necesaria la deduplicación?
Si instalas la misma habilidad tanto en el proyecto como globalmente (por ejemplo, `pdf`), OpenSkills usará preferentemente la versión del proyecto. El comando list solo la muestra una vez para evitar confusiones.
:::

## Sígueme paso a paso

### Paso 1: Listar todas las habilidades instaladas

**¿Por qué**

Ver rápidamente qué habilidades están disponibles en el entorno actual

Ejecuta el siguiente comando:

```bash
npx openskills list
```

**Lo que deberías ver**

Si no se ha instalado ninguna habilidad, se mostrará:

```
Available Skills:

No skills installed.

Install skills:
  npx openskills install anthropics/skills         # Project (default)
  npx openskills install owner/skill --global     # Global (advanced)
```

Si ya hay habilidades instaladas, verás algo como:

```
Available Skills:

  pdf                         (project)
    Comprehensive PDF manipulation toolkit for extracting text and tables...

  code-analyzer                (project)
    Static code analysis tool for identifying security vulnerabilities...

  email-reader                 (global)
    Read email content and attachments via IMAP protocol...

Summary: 2 project, 1 global (3 total)
```

### Paso 2: Entender el formato de salida

**¿Por qué**

Saber qué significa cada línea te permite localizar rápidamente la información que necesitas

Explicación del formato de salida:

| Parte | Descripción |
|--- | ---|
| `pdf` | Nombre de la habilidad (extraído del campo name en SKILL.md) |
| `(project)` | Etiqueta de ubicación: azul indica habilidad de nivel de proyecto, gris indica habilidad global |
| `Comprehensive PDF...` | Descripción de la habilidad (extraída del campo description en SKILL.md) |
| `Summary: 2 project, 1 global (3 total)` | Resumen estadístico: cantidad de habilidades de proyecto, globales y total |

### Paso 3: Verificar las etiquetas de ubicación

**¿Por qué**

Confirmar que la habilidad se instaló en la ubicación esperada, evitando dudas del tipo "¿por qué no se ve esta habilidad en este proyecto?"

Prueba las siguientes operaciones para entender las etiquetas de ubicación:

```bash
# 1. Instalar una habilidad de nivel de proyecto
npx openskills install anthropics/skills -y

# 2. Ver la lista (debería mostrar la etiqueta project)
npx openskills list

# 3. Instalar una habilidad global
npx openskills install anthropics/skills --global -y

# 4. Ver la lista de nuevo (dos habilidades pdf, solo se muestra una vez, etiqueta project)
npx openskills list
```

**Lo que deberías ver**

```
Available Skills:

  pdf                         (project)
    Comprehensive PDF manipulation toolkit for extracting text...

Summary: 1 project, 0 global (1 total)
```

Incluso si la misma habilidad está instalada tanto globalmente como en el proyecto, el comando list solo la mostrará una vez, porque la versión del proyecto tiene mayor prioridad.

## Punto de control ✅

Confirma lo siguiente:

- [ ] Al ejecutar `openskills list` puedes ver la lista de habilidades instaladas
- [ ] Puedes distinguir las etiquetas `(project)` y `(global)` (colores diferentes: azul vs gris)
- [ ] Los números de resumen son correctos (cantidad de habilidades de proyecto + cantidad de habilidades globales = total)
- [ ] Comprendes la regla de que habilidades con el mismo nombre solo se muestran una vez

## Advertencias de problemas comunes

### Problema común 1: No se encuentra la habilidad recién instalada

**Síntoma**: el comando `install` se ejecutó correctamente, pero `list` no la muestra

**Pasos de solución de problemas**:

1. Verifica si estás en el directorio del proyecto correcto (las habilidades de proyecto solo son visibles para el proyecto actual)
2. Confirma si se instaló globalmente (con el indicador `--global`)
3. Verifica la ubicación de instalación:

```bash
# Comprobar directorio del proyecto
ls -la .claude/skills/

# Comprobar directorio global
ls -la ~/.claude/skills/
```

### Problema común 2: Se ve un nombre de habilidad extraño

**Síntoma**: el nombre de la habilidad no es el que esperabas (por ejemplo, nombre de carpeta vs name en SKILL.md)

**Causa**: OpenSkills usa el campo `name` en SKILL.md como nombre de la habilidad, no el nombre de la carpeta

**Solución**: verifica el frontmatter de SKILL.md:

```yaml
---
name: pdf  # Este es el nombre que muestra el comando list
description: Comprehensive PDF manipulation toolkit...
---
```

### Problema común 3: La descripción no se muestra completa

**Síntoma**: la descripción de la habilidad está truncada

**Causa**: es una limitación del ancho de la terminal, no afecta el contenido de la habilidad

**Solución**: ve directamente el archivo SKILL.md para obtener la descripción completa

## Resumen de esta lección

`openskills list` es el comando "directorio" de gestión de habilidades, que te ayuda a:

- 📋 **Ver todas las habilidades**: ver las habilidades instaladas de un vistazo
- 🏷️ **Distinguir etiquetas de ubicación**: `(project)` indica nivel de proyecto, `(global)` indica nivel global
- 📊 **Resumen estadístico**: conocer rápidamente la cantidad de habilidades de proyecto y globales
- 🔍 **Solucionar problemas**: verificar si la habilidad se instaló correctamente y localizar la ubicación de la habilidad

Reglas principales:

1. Habilidades con el mismo nombre solo se muestran una vez (prioridad para las de proyecto)
2. Habilidades de proyecto primero, globales después
3. Dentro de la misma ubicación, en orden alfabético

## Próxima lección

> En la próxima lección aprenderemos **[Actualizar habilidades](../update-skills/)**.
>
> Aprenderás:
> - Cómo actualizar habilidades instaladas desde el repositorio de origen
> - Actualizar todas las habilidades por lotes
> - Manejar habilidades antiguas sin metadatos

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Función | Ruta del archivo | Línea |
|--- | --- | ---|
| Implementación del comando list | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts) | 7-43 |
| Buscar todas las habilidades | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 30-64 |
| Configuración de directorios de búsqueda | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 18-25 |
| Definición de tipo Skill | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts) | 1-6 |

**Funciones clave**:
- `listSkills()`: listar todas las habilidades instaladas, formato de salida
- `findAllSkills()`: recorrer los 4 directorios de búsqueda, recopilar todas las habilidades
- `getSearchDirs()`: devolver las rutas de los 4 directorios de búsqueda (por prioridad)

**Constantes clave**:
- Ninguna (las rutas de los directorios de búsqueda se calculan dinámicamente)

**Lógica principal**:
1. **Mecanismo de deduplicación**: usar `Set` para registrar nombres de habilidades ya procesadas (skills.ts:32-33, 43, 57)
2. **Determinación de ubicación**: juzgar si es directorio de proyecto mediante `dir.includes(process.cwd())` (skills.ts:48)
3. **Reglas de ordenación**: prioridad para las de proyecto, en orden alfabético dentro de la misma ubicación (list.ts:21-26)

</details>
