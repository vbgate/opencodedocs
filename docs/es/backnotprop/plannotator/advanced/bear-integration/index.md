---
title: "Integración con Bear: Guardar Planes Automáticamente | Plannotator"
sidebarTitle: "Guardar Planes en Bear"
subtitle: "Integración con Bear: Guardar Planes Aprobados Automáticamente | Plannotator"
description: "Aprende a configurar la integración de Plannotator con Bear. Guarda automáticamente los planes aprobados mediante x-callback-url, genera etiquetas inteligentes y archiva tu conocimiento."
tags:
  - "Integración"
  - "Bear"
  - "Aplicación de notas"
  - "Gestión del conocimiento"
prerequisite:
  - "installation-claude-code"
  - "platforms-plan-review-basics"
order: 3
---

# Integración con Bear: Guardar Planes Aprobados Automáticamente

## Lo que aprenderás

Al habilitar la integración con Bear, cada vez que apruebes un plan, Plannotator lo guardará automáticamente en tus notas de Bear, incluyendo:
- Un título generado automáticamente (extraído del plan)
- Etiquetas inteligentes (nombre del proyecto, palabras clave, lenguajes de programación)
- El contenido completo del plan

De esta manera, podrás gestionar todos tus planes aprobados en un solo lugar, facilitando la consulta posterior y la acumulación de conocimiento.

## El problema que enfrentas

Probablemente te hayas encontrado con estas situaciones:
- El plan generado por la IA es excelente, pero quieres guardarlo para consultarlo más tarde
- Copiar y pegar planes manualmente en Bear es tedioso
- Los planes de diferentes proyectos están mezclados, sin gestión de etiquetas

Con la integración de Bear, todos estos problemas se resuelven automáticamente.

## Cuándo usar esta función

- Usas Bear como tu aplicación principal de notas
- Necesitas archivar planes aprobados como base de conocimiento
- Quieres buscar rápidamente planes históricos mediante etiquetas

::: info Acerca de Bear
Bear es una aplicación de notas Markdown para macOS que soporta etiquetas, cifrado, sincronización y más. Si aún no la tienes instalada, visita [bear.app](https://bear.app/) para más información.
:::

## 🎒 Antes de empezar

- Tener Plannotator instalado (consulta el [tutorial de instalación](../../start/installation-claude-code/))
- Tener Bear instalado y funcionando correctamente
- Conocer el flujo básico de revisión de planes (consulta [Fundamentos de revisión de planes](../../platforms/plan-review-basics/))

## Concepto clave

El núcleo de la integración con Bear es el protocolo **x-callback-url**:

1. Habilita la integración con Bear en la interfaz de Plannotator (se almacena en localStorage del navegador)
2. Al aprobar un plan, Plannotator envía una URL `bear://x-callback-url/create`
3. El sistema usa el comando `open` para abrir Bear automáticamente y crear una nota
4. El contenido del plan, título y etiquetas se rellenan automáticamente

**Características clave**:
- No requiere configurar la ruta del vault (a diferencia de Obsidian)
- Generación inteligente de etiquetas (máximo 7)
- Guardado automático al aprobar el plan

::: tip Diferencia con Obsidian
La integración con Bear es más sencilla, no necesitas configurar la ruta del vault, solo un interruptor. Sin embargo, Obsidian permite especificar la carpeta de destino y más personalización.
:::

## Paso a paso

### Paso 1: Abrir la configuración de Plannotator

Cuando el agente de IA genere un plan y abra la interfaz de Plannotator, haz clic en el botón ⚙️ **Settings** en la esquina superior derecha.

**Deberías ver**: El panel de configuración aparece con varias opciones

### Paso 2: Habilitar la integración con Bear

En el panel de configuración, busca la sección **Bear Notes** y activa el interruptor.

**Por qué**
El interruptor cambiará de gris (deshabilitado) a azul (habilitado), y se guardará en el localStorage del navegador.

**Deberías ver**:
- El interruptor de Bear Notes en azul
- El texto descriptivo: "Auto-save approved plans to Bear"

### Paso 3: Aprobar el plan

Después de completar la revisión del plan, haz clic en el botón **Approve** en la parte inferior.

**Por qué**
Plannotator leerá la configuración de Bear y, si está habilitada, llamará al x-callback-url de Bear al mismo tiempo que aprueba.

**Deberías ver**:
- La aplicación Bear se abre automáticamente
- Aparece la ventana de nueva nota
- El título y contenido ya están rellenados
- Las etiquetas se han generado automáticamente (comenzando con `#`)

### Paso 4: Verificar la nota guardada

En Bear, revisa la nota recién creada y confirma:
- ¿El título es correcto? (proviene del H1 del plan)
- ¿El contenido está completo? (incluye el texto completo del plan)
- ¿Las etiquetas son apropiadas? (nombre del proyecto, palabras clave, lenguaje de programación)

**Deberías ver**:
Una estructura de nota similar a esta:

```markdown
## User Authentication

[Contenido completo del plan...]

#plannotator #myproject #authentication #typescript #api
```

## Lista de verificación ✅

- [ ] El interruptor de Bear Notes está habilitado en Settings
- [ ] Bear se abre automáticamente después de aprobar el plan
- [ ] El título de la nota coincide con el H1 del plan
- [ ] La nota contiene el contenido completo del plan
- [ ] Las etiquetas incluyen `#plannotator` y el nombre del proyecto

## Solución de problemas

### Bear no se abre automáticamente

**Causa**: El comando `open` del sistema falló, posiblemente porque:
- Bear no está instalado o no se descargó desde la App Store
- El esquema de URL de Bear fue secuestrado por otra aplicación

**Solución**:
1. Confirma que Bear está instalado correctamente
2. Prueba manualmente en la terminal: `open "bear://x-callback-url/create?title=test"`

### Las etiquetas no son las esperadas

**Causa**: Las etiquetas se generan automáticamente según estas reglas:
- Obligatoria: `#plannotator`
- Obligatoria: nombre del proyecto (extraído del nombre del repositorio git o del directorio)
- Opcional: hasta 3 palabras clave extraídas del título H1 (excluyendo palabras vacías)
- Opcional: etiquetas de lenguaje de programación extraídas de los bloques de código (excluyendo json/yaml/markdown)
- Máximo 7 etiquetas

**Solución**:
- Si las etiquetas no son las esperadas, puedes editarlas manualmente en Bear
- Si el nombre del proyecto es incorrecto, verifica la configuración del repositorio git o el nombre del directorio

### Plan aprobado pero no guardado

**Causa**:
- El interruptor de Bear no está habilitado (verifica Settings)
- Error de red o tiempo de espera de respuesta de Bear
- El contenido del plan está vacío

**Solución**:
1. Confirma que el interruptor en Settings está azul (estado habilitado)
2. Revisa si hay mensajes de error en la terminal (`[Bear] Save failed:`)
3. Vuelve a aprobar el plan

## Mecanismo de generación de etiquetas en detalle

Plannotator genera etiquetas inteligentes para que puedas buscar planes rápidamente en Bear. Estas son las reglas de generación:

| Fuente de etiqueta | Ejemplo | Prioridad |
| --- | --- | --- |
| Etiqueta fija | `#plannotator` | Obligatoria |
| Nombre del proyecto | `#myproject`, `#plannotator` | Obligatoria |
| Palabras clave del H1 | `#authentication`, `#api` | Opcional (máx. 3) |
| Lenguaje de programación | `#typescript`, `#python` | Opcional |

**Lista de palabras vacías** (no se usarán como etiquetas):
- `the`, `and`, `for`, `with`, `this`, `that`, `from`, `into`
- `plan`, `implementation`, `overview`, `phase`, `step`, `steps`

**Lenguajes de programación excluidos** (no se usarán como etiquetas):
- `json`, `yaml`, `yml`, `text`, `txt`, `markdown`, `md`

::: details Ejemplo: Proceso de generación de etiquetas
Supongamos que el título del plan es "Implementation Plan: User Authentication System in TypeScript", y los bloques de código contienen Python y JSON:

1. **Etiqueta fija**: `#plannotator`
2. **Nombre del proyecto**: `#myproject` (asumiendo el nombre del repositorio git)
3. **Palabras clave del H1**:
   - `implementation` → excluida (palabra vacía)
   - `plan` → excluida (palabra vacía)
   - `user` → conservada → `#user`
   - `authentication` → conservada → `#authentication`
   - `system` → conservada → `#system`
   - `typescript` → conservada → `#typescript`
4. **Lenguajes de programación**:
   - `python` → conservado → `#python`
   - `json` → excluido (lista de exclusión)

Etiquetas finales: `#plannotator #myproject #user #authentication #system #typescript #python` (7, alcanzando el límite)
:::

## Comparación con la integración de Obsidian

| Característica | Integración con Bear | Integración con Obsidian |
| --- | --- | --- |
| Complejidad de configuración | Simple (solo un interruptor) | Media (requiere seleccionar vault y carpeta) |
| Almacenamiento | Dentro de la app Bear | Ruta del vault especificada |
| Nombre del archivo | Gestionado automáticamente por Bear | `Title - Mon D, YYYY H-MMam.md` |
| Frontmatter | No (Bear no lo soporta) | Sí (created, source, tags) |
| Multiplataforma | Solo macOS | macOS/Windows/Linux |
| x-callback-url | ✅ Utilizado | ❌ Escritura directa de archivos |

::: tip Cómo elegir
- Si solo usas macOS y te gusta Bear: la integración con Bear es más sencilla
- Si necesitas multiplataforma o rutas de almacenamiento personalizadas: la integración con Obsidian es más flexible
- Si quieres usar ambos: puedes habilitar ambos (al aprobar el plan se guardará en ambos lugares)
:::

## Resumen de la lección

- La integración con Bear funciona mediante el protocolo x-callback-url, con configuración sencilla
- Solo necesitas activar el interruptor en Settings, sin especificar rutas
- Se guarda automáticamente en Bear al aprobar el plan
- Las etiquetas se generan inteligentemente, incluyendo nombre del proyecto, palabras clave y lenguaje de programación (máximo 7)
- Comparada con la integración de Obsidian, Bear es más simple pero con menos funciones

## Próxima lección

> En la próxima lección aprenderemos sobre el **[Modo Remoto/Devcontainer](../remote-mode/)**.
>
> Aprenderás:
> - Cómo usar Plannotator en entornos remotos (SSH, devcontainer, WSL)
> - Configurar puertos fijos y reenvío de puertos
> - Abrir el navegador en entornos remotos para ver la página de revisión

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Funcionalidad | Ruta del archivo | Líneas |
| --- | --- | --- |
| Interfaz de configuración de Bear | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L18-L20) | 18-20 |
| Guardar en Bear | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L234-L257) | 234-257 |
| Extracción de etiquetas | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L34-L74) | 34-74 |
| Extracción de título | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L94-L105) | 94-105 |
| Interfaz de configuración de Bear (UI) | [`packages/ui/utils/bear.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/bear.ts#L15-L17) | 15-17 |
| Leer configuración de Bear | [`packages/ui/utils/bear.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/bear.ts#L22-L26) | 22-26 |
| Guardar configuración de Bear | [`packages/ui/utils/bear.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/bear.ts#L31-L33) | 31-33 |
| Componente de configuración UI | [`packages/ui/components/Settings.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Settings.tsx#L496-L518) | 496-518 |
| Llamar a Bear al aprobar | [`packages/editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/editor/App.tsx#L512-L514) | 512-514 |
| Procesamiento del servidor para Bear | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L250-L257) | 250-257 |

**Funciones clave**:
- `saveToBear(config: BearConfig)`: Guarda el plan en Bear mediante x-callback-url
- `extractTags(markdown: string)`: Extrae etiquetas inteligentemente del contenido del plan (máximo 7)
- `extractTitle(markdown: string)`: Extrae el título de la nota del encabezado H1 del plan
- `getBearSettings()`: Lee la configuración de integración con Bear desde localStorage
- `saveBearSettings(settings)`: Guarda la configuración de integración con Bear en localStorage

**Constantes clave**:
- `STORAGE_KEY_ENABLED = 'plannotator-bear-enabled'`: Nombre de la clave de configuración de Bear en localStorage

**Formato de URL de Bear**:
```typescript
bear://x-callback-url/create?title={title}&text={content}&open_note=no
```

</details>
