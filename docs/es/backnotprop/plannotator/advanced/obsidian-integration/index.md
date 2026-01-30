---
title: "Integración con Obsidian: Guardado automático de planes | plannotator"
sidebarTitle: "Guardar automáticamente en Obsidian"
subtitle: "Integración con Obsidian: Guardado automático de planes | plannotator"
description: "Aprende a configurar la integración de Obsidian en plannotator. Guarda automáticamente los planes aprobados en el vault, incluye generación de frontmatter y etiquetas, admite rutas de guardado personalizadas."
tags:
  - "plannotator"
  - "integration"
  - "obsidian"
  - "advanced"
prerequisite:
  - "start-getting-started"
order: 2
---

# Integración con Obsidian: Guardar automáticamente planes en el vault

## Lo que lograrás

- Guardar automáticamente los planes aprobados o rechazados en el vault de Obsidian
- Comprender el mecanismo de generación de frontmatter y etiquetas
- Personalizar la ruta de guardado y las carpetas
- Utilizar backlinks para construir un gráfico de conocimiento

## Tu problema actual

Estás revisando los planes generados por IA en Plannotator, pero después de aprobarlos estos planes "desaparecen". Deseas guardar estos planes valiosos en Obsidian para facilitar su revisión y búsqueda posterior, pero copiar y pegar manualmente es demasiado tedioso y el formato se desordena.

## Cuándo usar esta técnica

- Utilizas Obsidian como herramienta de gestión del conocimiento
- Deseas guardar y revisar a largo plazo los planes de implementación generados por IA
- Quieres organizar los planes utilizando la vista de gráfico y el sistema de etiquetas de Obsidian

## Idea central

La función de integración con Obsidian de Plannotator guarda automáticamente el contenido del plan en tu vault de Obsidian cuando apruebas o rechazas un plan. El sistema:

1. **Detecta vaults**: Lee automáticamente todos los vaults del archivo de configuración de Obsidian
2. **Genera frontmatter**: Incluye fecha de creación, origen y etiquetas
3. **Extrae etiquetas**: Extrae automáticamente etiquetas del título del plan y los lenguajes de los bloques de código
4. **Agrega backlink**: Inserta el enlace `[[Plannotator Plans]]` para facilitar la construcción del gráfico de conocimiento

::: info ¿Qué es Obsidian?
Obsidian es una aplicación de notas de enlace bidireccional con prioridad local que admite formato Markdown y puede visualizar las relaciones entre notas mediante una vista de gráfico.
:::

## 🎒 Preparativos

Asegúrate de haber instalado y configurado Obsidian. Plannotator detectará automáticamente los vaults en tu sistema, pero necesitas al menos un vault para utilizar esta función.

## Sigue los pasos

### Paso 1: Abrir el panel de configuración

En la interfaz de Plannotator, haz clic en el icono de engranaje en la esquina superior derecha para abrir el panel de configuración.

Deberías ver el diálogo de configuración que contiene múltiples opciones de configuración.

### Paso 2: Habilitar la integración con Obsidian

En el panel de configuración, encuentra la sección "Obsidian Integration" y haz clic en el interruptor para habilitar esta función.

Una vez habilitado, Plannotator detectará automáticamente los vaults de Obsidian en tu sistema.

Deberías ver una lista de vaults detectados en el menú desplegable (por ejemplo, `My Vault`, `Work Notes`).

### Paso 3: Seleccionar vault y carpeta

Selecciona el vault donde deseas guardar los planes en el menú desplegable. Si no se detecta ningún vault, puedes:

1. Seleccionar la opción "Custom path..."
2. Ingresar la ruta completa del vault en el campo de texto

Luego, establece el nombre de la carpeta de guardado en el campo "Folder" (por defecto es `plannotator`).

Deberías ver la ruta de vista previa en la parte inferior que muestra dónde se guardará el plan.

### Paso 4: Aprobar o rechazar el plan

Una vez completada la configuración, revisa normalmente los planes generados por IA. Cuando hagas clic en "Approve" o "Send Feedback", el plan se guardará automáticamente en el vault configurado.

Deberías ver el archivo recién creado en Obsidian, con el formato de nombre de archivo `Title - Jan 2, 2026 2-30pm.md`.

### Paso 5: Ver el archivo guardado

Abre el archivo guardado en Obsidian, verás el siguiente contenido:

```markdown
---
created: 2026-01-24T14:30:00.000Z
source: plannotator
tags: [plan, authentication, typescript, sql]
---

[[Plannotator Plans]]

## Implementation Plan: User Authentication

...
```

Deberías notar que hay un frontmatter YAML en la parte superior del archivo que incluye la fecha de creación, el origen y las etiquetas.

## Punto de verificación ✅

- [ ] Obsidian Integration está habilitado en el panel de configuración
- [ ] Se ha seleccionado un vault (o se ha ingresado una ruta personalizada)
- [ ] Se ha establecido el nombre de la carpeta
- [ ] Después de aprobar o rechazar un plan, aparece un nuevo archivo en Obsidian
- [ ] El archivo contiene frontmatter y el backlink `[[Plannotator Plans]]`

## Explicación detallada de Frontmatter y etiquetas

### Estructura del Frontmatter

Cada plan guardado contiene los siguientes campos de frontmatter:

| Campo   | Ejemplo de valor                           | Descripción                         |
|--- | --- | ---|
| `created` | `2026-01-24T14:30:00.000Z`    | Marca de tiempo de creación en formato ISO 8601     |
| `source` | `plannotator`                   | Valor fijo que identifica el origen             |
| `tags` | `[plan, authentication, typescript]` | Matriz de etiquetas extraídas automáticamente |

### Reglas de generación de etiquetas

Plannotator utiliza las siguientes reglas para extraer automáticamente etiquetas:

1. **Etiqueta predeterminada**: Siempre incluye la etiqueta `plannotator`
2. **Etiqueta de nombre del proyecto**: Se extrae automáticamente del nombre del repositorio git o del nombre del directorio
3. **Palabras clave del título**: Se extraen palabras significativas del primer encabezado H1 (excluyendo palabras de parada comunes)
4. **Etiquetas de lenguaje de código**: Se extraen del identificador de lenguaje de los bloques de código (por ejemplo, `typescript`, `sql`). Los lenguajes de configuración comunes (como `json`, `yaml`, `markdown`) se filtran automáticamente.

Lista de palabras de parada (no se usarán como etiquetas):
- `the`, `and`, `for`, `with`, `this`, `that`, `from`, `into`
- `plan`, `implementation`, `overview`, `phase`, `step`, `steps`

Límite de cantidad de etiquetas: máximo 7 etiquetas, ordenadas por orden de extracción.

### Formato de nombre de archivo

El nombre de archivo utiliza un formato altamente legible: `Title - Jan 2, 2026 2-30pm.md`

| Parte       | Ejemplo         | Descripción                  |
|--- | --- | ---|
| Título       | `User Authentication` | Extraído de H1, limitado a 50 caracteres |
| Fecha       | `Jan 2, 2026` | Fecha actual               |
| Hora       | `2-30pm`     | Hora actual (formato de 12 horas)   |

### Mecanismo de Backlink

Cada archivo de plan tendrá el enlace `[[Plannotator Plans]]` insertado en la parte inferior. El propósito de este backlink:

- **Conexión de gráfico de conocimiento**: En la vista de gráfico de Obsidian, todos los planes están conectados al mismo nodo
- **Navegación rápida**: Hacer clic en `[[Plannotator Plans]]` puede crear una página de índice que resume todos los planes guardados
- **Enlace bidireccional**: Utiliza enlaces inversos en la página de índice para ver todos los planes

## Soporte multiplataforma

Plannotator detecta automáticamente las ubicaciones de los archivos de configuración de Obsidian en diferentes sistemas operativos:

| Sistema operativo | Ruta del archivo de configuración                                    |
|--- | ---|
| macOS     | `~/Library/Application Support/obsidian/obsidian.json` |
| Windows   | `%APPDATA%\obsidian/obsidian.json`                 |
| Linux     | `~/.config/obsidian/obsidian.json`                 |

Si la detección automática falla, puedes ingresar manualmente la ruta del vault.

## Advertencias sobre problemas comunes

### Problema 1: No se detectan vaults

**Síntoma**: El menú desplegable muestra "Detecting..." pero no hay resultados

**Causa**: El archivo de configuración de Obsidian no existe o tiene un formato incorrecto

**Solución**:
1. Confirma que Obsidian está instalado y se ha abierto al menos una vez
2. Verifica que el archivo de configuración existe (consulta las rutas en la tabla anterior)
3. Utiliza "Custom path..." para ingresar manualmente la ruta del vault

### Problema 2: No se encuentra el archivo después de guardar

**Síntoma**: Después de aprobar el plan, no hay un nuevo archivo en Obsidian

**Causa**: La ruta del vault es incorrecta u Obsidian no se ha actualizado

**Solución**:
1. Verifica que la ruta de vista previa en el panel de configuración sea correcta
2. Haz clic en "Reload vault" en Obsidian o presiona `Cmd+R` (macOS) / `Ctrl+R` (Windows/Linux)
3. Verifica que hayas seleccionado el vault correcto

### Problema 3: El nombre del archivo contiene caracteres especiales

**Síntoma**: Aparecen `_` u otros caracteres de reemplazo en el nombre del archivo

**Causa**: El título contiene caracteres no compatibles con el sistema de archivos (`< > : " / \ | ? *`)

**Solución**: Este es el comportamiento esperado, Plannotator reemplazará automáticamente estos caracteres para evitar errores del sistema de archivos.

## Resumen de esta lección

La función de integración con Obsidian conecta perfectamente tu flujo de revisión de planes con la gestión del conocimiento:

- ✅ Guardar automáticamente planes aprobados o rechazados
- ✅ Extraer inteligentemente etiquetas para facilitar la recuperación posterior
- ✅ Generar frontmatter con formato de metadatos unificado
- ✅ Agregar backlinks para construir un gráfico de conocimiento

Después de configurar una vez, cada revisión se archivará automáticamente, sin necesidad de copiar y pegar manualmente.

## Próxima lección

> En la próxima lección aprenderemos **[Integración con Bear](../bear-integration/)**.
>
> Aprenderás:
> - Cómo guardar planes en la aplicación de notas Bear
> - Las diferencias entre la integración con Bear y la integración con Obsidian
> - Utilizar x-callback-url para crear notas automáticamente

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver las ubicaciones del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Función                | Ruta del archivo                                                                                     | Líneas    |
|--- | --- | ---|
| Detectar vaults de Obsidian | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L135-L175) | 135-175 |
| Guardar plan en Obsidian | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L180-L227) | 180-227 |
| Extraer etiquetas             | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L34-L74) | 34-74   |
| Generar frontmatter     | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L81-L89) | 81-89   |
| Generar nombre de archivo           | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L111-L127) | 111-127 |
| Almacenamiento de configuración de Obsidian     | [`packages/ui/utils/obsidian.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/obsidian.ts#L36-L43) | 36-43   |
| Componente UI de Settings      | [`packages/ui/components/Settings.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Settings.tsx#L387-L491) | 387-491 |

**Funciones clave**:
- `detectObsidianVaults()`: Lee el archivo de configuración de Obsidian y devuelve una lista de rutas de vault disponibles
- `saveToObsidian(config)`: Guarda el plan en el vault especificado, incluye frontmatter y backlink
- `extractTags(markdown)`: Extrae etiquetas del contenido del plan (palabras clave del título, lenguajes de código, nombre del proyecto)
- `generateFrontmatter(tags)`: Genera una cadena de frontmatter YAML
- `generateFilename(markdown)`: Genera un nombre de archivo legible

**Reglas de negocio**:
- Máximo 7 etiquetas (L73)
- Nombre de archivo limitado a 50 caracteres (L102)
- Admite detección de ruta de archivo de configuración multiplataforma (L141-149)
- Crea automáticamente carpetas que no existen (L208)

</details>
