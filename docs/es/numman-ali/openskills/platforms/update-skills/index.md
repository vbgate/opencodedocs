---
title: "Actualizar Skills: Mantener Skills Actualizados | opencode-openskills"
sidebarTitle: "Actualización en un Click"
subtitle: "Actualizar Skills: Mantener Skills Actualizados"
description: "Aprende el comando OpenSkills update para actualizar skills instalados. Soporta actualización masiva de todos los skills o skills específicos, comprende las diferencias entre actualización de rutas locales y repositorios git, mantén skills en la versión más reciente."
tags:
  - "skills"
  - "actualización"
  - "git"
prerequisite:
  - "start-installation"
  - "start-first-skill"
order: 5
---

# Actualizar Skills: Mantener Skills Sincronizados con el Repositorio Fuente

## Lo Que Podrás Hacer

Esta lección te enseña cómo mantener los skills de OpenSkills siempre en la versión más reciente. Con el comando OpenSkills update, podrás:

- Actualizar todos los skills instalados con un solo clic
- Actualizar solo algunos skills específicos
- Comprender las diferencias de actualización para diferentes fuentes de instalación
- Diagnosticar las causas de fallas en las actualizaciones

## Tu Dilema Actual

Los repositorios de skills se actualizan constantemente—los autores pueden corregir bugs, agregar nuevas funciones, mejorar la documentación. Pero los skills que instalaste siguen siendo versiones antiguas.

Es posible que ya te hayas encontrado con estas situaciones:
- La documentación del skill dice "soporta cierta función", pero tu agente de IA dice que no la conoce
- El skill ha actualizado mejores mensajes de error, pero sigues viendo los antiguos
- Un bug de instalación ya fue corregido, pero sigues afectado por él

**Eliminar y reinstalar cada vez es demasiado molesto**—necesitas una forma eficiente de actualización.

## Cuándo Usar Este Truco

Escenarios típicos para usar el comando `update`:

| Escenario | Acción |
|--- | ---|
| Descubrir que un skill tiene actualizaciones | Ejecutar `openskills update` |
| Solo actualizar unos pocos skills | `openskills update skill1,skill2` |
| Prueba de skills desarrollados localmente | Actualizar desde ruta local |
| Actualizar desde repositorios GitHub | Clonar automáticamente el código más reciente |

::: tip Recomendaciones de frecuencia de actualización
- **Skills de la comunidad**: Actualizar mensualmente para obtener mejoras recientes
- **Skills que desarrollas tú**: Actualizar manualmente después de cada modificación
- **Skills de ruta local**: Actualizar después de cada cambio de código
:::

## 🎒 Preparativos Antes de Empezar

Antes de empezar, confirma que has completado:

- [x] Instalado OpenSkills (ver [Instalar OpenSkills](../../start/installation/))
- [x] Instalado al menos un skill (ver [Instalar el primer skill](../../start/first-skill/))
- [x] Si fue instalado desde GitHub, confirmar conexión a red

## Idea Principal

El mecanismo de actualización de OpenSkills es simple:

**Cada vez que se instala se registra la información de origen → Al actualizar se vuelve a copiar desde el origen original**

::: info ¿Por qué se necesita reinstalar?
Los skills de versiones antiguas (instalados sin registrar el origen) no se pueden actualizar. En este caso, necesitas reinstalar una vez, OpenSkills recordará el origen y luego podrás actualizar automáticamente.
:::

**Formas de actualización para tres tipos de orígenes de instalación**:

| Tipo de origen | Forma de actualización | Escenario aplicable |
|--- | --- | ---|
| **Ruta local** | Copiar directamente desde ruta local | Desarrollar tus propios skills |
| **Repositorio git** | Clonar código más reciente a directorio temporal | Instalar desde GitHub/GitLab |
| **Shorthand de GitHub** | Convertir a URL completa luego clonar | Instalar desde repositorio oficial de GitHub |

Al actualizar se omitirán los skills sin metadatos de origen y se listarán los nombres de los skills que necesitan reinstalación.


## Sígueme

### Paso 1: Ver Skills Instalados

Primero confirma qué skills se pueden actualizar:

```bash
npx openskills list
```

**Deberías ver**: lista de skills instalados, incluyendo nombre, descripción y etiqueta de ubicación de instalación (project/global)

### Paso 2: Actualizar Todos los Skills

La forma más simple es actualizar todos los skills instalados:

```bash
npx openskills update
```

**Deberías ver**: actualiza skills uno por uno, cada skill muestra el resultado de actualización

```
✅ Updated: git-workflow
✅ Updated: check-branch-first
Skipped: my-old-skill (no source metadata; re-install once to enable updates)
Summary: 2 updated, 1 skipped (3 total)
```

::: details Significado de skills omitidos
Si ves `Skipped: xxx (no source metadata)`, significa que este skill fue instalado antes de que se añadiera la función de actualización. Necesitas reinstalar una vez para habilitar la actualización automática.
:::

### Paso 3: Actualizar Skills Específicos

Si solo quieres actualizar algunos skills específicos, pasa los nombres de los skills (separados por comas):

```bash
npx openskills update git-workflow,check-branch-first
```

**Deberías ver**: solo se actualizaron los dos skills especificados

```
✅ Updated: git-workflow
✅ Updated: check-branch-first
Summary: 2 updated, 0 skipped (2 total)
```

### Paso 4: Actualizar Skills Desarrollados Localmente

Si estás desarrollando un skill localmente, puedes actualizar desde la ruta local:

```bash
npx openskills update my-skill
```

**Deberías ver**: el skill se vuelve a copiar desde la ruta local donde lo instalaste

```
✅ Updated: my-skill
Summary: 1 updated, 0 skipped (1 total)
```


::: tip Flujo de trabajo de desarrollo local
Proceso de desarrollo:
1. Instalar skill: `openskills install ./my-skill`
2. Modificar código
3. Actualizar skill: `openskills update my-skill`
4. Sincronizar a AGENTS.md: `openskills sync`
:::

### Paso 5: Manejar Actualizaciones Fallidas

Si algunos skills fallan al actualizar, OpenSkills mostrará la causa detallada:

```bash
npx openskills update
```

**Situaciones que podrías ver**:

```
Skipped: git-workflow (git clone failed)
Skipped: my-skill (local source missing)
Missing source metadata (1): old-skill
Clone failed (1): git-workflow
```

**Métodos de solución correspondientes**:

| Mensaje de error | Causa | Método de solución |
|--- | --- | ---|
| `no source metadata` | Instalación de versión antigua | Reinstalar: `openskills install <source>` |
| `local source missing` | Ruta local eliminada | Restaurar ruta local o reinstalar |
| `SKILL.md missing at local source` | Archivo local eliminado | Restaurar archivo SKILL.md |
| `git clone failed` | Problema de red o repositorio no existe | Verificar red o dirección del repositorio |
| `SKILL.md not found in repo` | Cambio de estructura de repositorio | Contactar autor del skill o actualizar subpath |

## Punto de Control ✅

Confirma que has aprendido:

- [ ] Puedes usar `openskills update` para actualizar todos los skills
- [ ] Puedes usar comas para separar y actualizar skills específicos
- [ ] Comprendes el significado y solución de "omitir" skills
- [ ] Conoces el proceso de actualización de skills desarrollados localmente


## Advertencias

### ❌ Errores Comunes

| Error | Práctica Correcta |
|--- | ---|
| Ver que fue omitido y no hacer nada | Reinstalar o solucionar el problema según el mensaje |
| Eliminar y reinstalar cada vez | Usar el comando `update` es más eficiente |
| No saber de dónde se instaló el skill | Usar `openskills list` para ver el origen |

### ⚠️ Precauciones

**La actualización sobrescribirá modificaciones locales**

Si modificaste directamente los archivos del skill en el directorio de instalación, estas modificaciones serán sobrescritas al actualizar. La práctica correcta es:
1. Modificar **archivos fuente** (ruta local o repositorio)
2. Luego ejecutar `openskills update`

**Los skills de enlace simbólico necesitan manejo especial**

Si el skill fue instalado a través de un enlace simbólico (ver [Soporte de enlaces simbólicos](../../advanced/symlink-support/)), la actualización volverá a crear el enlace, sin destruir la relación de enlace simbólico.

**Skills globales y de proyecto necesitan actualización separada**

```bash
# Solo actualizar skills de proyecto (por defecto)
openskills update

# Actualizar skills globales necesita manejo separado
# O usar el modo --universal para gestión unificada
```

## Resumen de Esta Lección

Esta lección aprendimos la función de actualización de OpenSkills:

- **Actualización masiva**: `openskills update` actualiza todos los skills con un clic
- **Actualización específica**: `openskills update skill1,skill2` actualiza skills específicos
- **Consciencia del origen**: Reconoce automáticamente rutas locales y repositorios git
- **Avisos de error**: Explica detalladamente las razones de omisión y métodos de solución

La función de actualización mantiene los skills en la versión más reciente, asegurando que los skills que uses siempre contengan las últimas mejoras y correcciones.


## Avance de la Próxima Lección

> En la próxima lección aprenderemos **[Eliminar skills](../remove-skills/)**.
>
> Aprenderás:
> - Cómo usar el comando interactivo `manage` para eliminar skills
> - Cómo usar el comando `remove` para eliminación programática
> - Precauciones después de eliminar skills

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicación del código fuente</strong></summary>

> Actualizado: 2026-01-24

| Función | Ruta de Archivo | Número de Línea |
|--- | --- | ---|
| Lógica principal de actualización de skills | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L14-L150) | 14-150 |
| Actualización desde ruta local | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L64-L82) | 64-82 |
| Actualización desde repositorio Git | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L85-L125) | 85-125 |
| Copiar skill desde directorio | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L152-L163) | 152-163 |
| Verificación de seguridad de ruta | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L165-L172) | 165-172 |
| Definición de estructura de metadatos | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts#L8-L15) | 8-15 |
| Leer metadatos de skill | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts#L17-L27) | 17-27 |
| Escribir metadatos de skill | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts#L29-L36) | 29-36 |
| Definición de comando CLI | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L58-L62) | 58-62 |

**Constantes clave**:
- `SKILL_METADATA_FILE = '.openskills.json'`: nombre del archivo de metadatos, registra el origen de instalación del skill

**Funciones clave**:
- `updateSkills(skillNames)`: función principal para actualizar skills especificados o todos los skills
- `updateSkillFromDir(targetPath, sourceDir)`: copia skill desde directorio fuente al directorio objetivo
- `isPathInside(targetPath, targetDir)`: verifica seguridad de ruta de instalación (previene recorrido de ruta)
- `readSkillMetadata(skillDir)`: lee metadatos del skill
- `writeSkillMetadata(skillDir, metadata)`: escribe/actualiza metadatos del skill

**Reglas de negocio**:
- **BR-5-1**: por defecto actualiza todos los skills instalados (update.ts:37-38)
- **BR-5-2**: soporta lista de nombres de skills separados por comas (update.ts:15)
- **BR-5-3**: omite skills sin metadatos de origen (update.ts:56-62)
- **BR-5-4**: soporta actualización desde ruta local (update.ts:64-82)
- **BR-5-5**: soporta actualización desde repositorio git (update.ts:85-125)
- **BR-5-6**: verifica seguridad de ruta (update.ts:156-162)

</details>

