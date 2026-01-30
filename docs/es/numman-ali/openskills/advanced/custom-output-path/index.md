---
title: "Ruta de Salida Personalizada: Gestión Flexible de Ubicaciones de Skills | openskills"
sidebarTitle: "Colocar Skills en Cualquier Ubicación"
subtitle: "Ruta de Salida Personalizada: Gestión Flexible de Ubicaciones de Skills | openskills"
description: "Aprende a utilizar openskills sync -o para sincronizar skills de manera flexible en cualquier ubicación. Compatible con la creación automática de directorios en entornos multi-herramienta, satisfaciendo necesidades de integración flexibles."
tags:
  - "Funciones Avanzadas"
  - "Salida Personalizada"
  - "Sincronización de Skills"
  - "Flag -o"
prerequisite:
  - "start-sync-to-agents"
order: 2
---

# Ruta de Salida Personalizada

## Lo Que Aprenderás

- Utilizar la flag `-o` o `--output` para sincronizar skills a archivos `.md` en cualquier ubicación
- Comprender cómo las herramientas crean automáticamente archivos y directorios inexistentes
- Configurar diferentes archivos AGENTS.md para distintas herramientas (Windsurf, Cursor, etc.)
- Gestionar listas de skills en entornos de múltiples archivos
- Omitir el `AGENTS.md` predeterminado e integrarse con sistemas de documentación existentes

::: info Conocimientos Previos

Este tutorial asume que ya dominas el uso básico de [Sincronización de Skills a AGENTS.md](../../start/sync-to-agents/). Si aún no has instalado ningún skill o sincronizado un AGENTS.md, completa primero el curso de requisitos previos.

:::

---

## Tu Situación Actual

Quizás ya te acostumbraste a que `openskills sync` genere `AGENTS.md` por defecto, pero podrías encontrar:

- **Herramientas requieren rutas específicas**: Algunas herramientas de IA (como Windsurf) esperan que AGENTS.md esté en un directorio específico (como `.ruler/`), no en la raíz del proyecto
- **Conflictos entre múltiples herramientas**: Usando varias herramientas de codificación simultáneamente, que podrían esperar AGENTS.md en diferentes ubicaciones
- **Integración con documentación existente**: Ya tienes un documento de lista de skills y quieres integrar los skills de OpenSkills en él, en lugar de crear un nuevo archivo
- **Directorio inexistente**: Quieres generar la salida en un directorio anidado (como `docs/ai-skills.md`), pero el directorio aún no existe

La raíz de estos problemas es: **la ruta de salida predeterminada no puede satisfacer todos los escenarios**. Necesitas un control de salida más flexible.

---

## Cuándo Usar Esta Función

**La ruta de salida personalizada** es adecuada para estos escenarios:

- **Entornos multi-herramienta**: Configurar archivos AGENTS.md independientes para diferentes herramientas de IA (como `.ruler/AGENTS.md` vs `AGENTS.md`)
- **Requisitos de estructura de directorios**: La herramienta espera que AGENTS.md esté en un directorio específico (como el `.ruler/` de Windsurf)
- **Integración con documentación existente**: Integrar la lista de skills en el sistema de documentación existente, en lugar de crear un nuevo AGENTS.md
- **Gestión organizativa**: Almacenar listas de skills clasificadas por proyecto o función (como `docs/ai-skills.md`)
- **Entornos CI/CD**: Usar rutas de salida fijas en flujos de trabajo automatizados

::: tip Práctica Recomendada

Si tu proyecto solo usa una herramienta de IA y la herramienta soporta AGENTS.md en la raíz del proyecto, usa la ruta predeterminada. Solo utiliza la ruta de salida personalizada cuando necesites gestión de múltiples archivos o requisitos de rutas específicas de la herramienta.

:::

---

## 🎒 Preparativos Previos

Antes de comenzar, por favor confirma:

- [ ] Has completado [Instalar al Menos un Skill](../../start/first-skill/)
- [ ] Has entrado al directorio de tu proyecto
- [ ] Conoces el uso básico de `openskills sync`

::: warning Verificación de Requisitos Previos

Confirma que tienes skills instalados:

```bash
npx openskills list
```

Si la lista está vacía, instala un skill primero:

```bash
npx openskills install anthropics/skills
```

:::

---

## Concepto Principal: Control de Salida Flexible

La función de sincronización de OpenSkills genera `AGENTS.md` por defecto, pero puedes usar la flag `-o` o `--output` para personalizar la ruta de salida.

```
[Comportamiento Predeterminado]        [Salida Personalizada]
openskills sync            →      AGENTS.md (raíz del proyecto)
openskills sync -o custom.md →  custom.md (raíz del proyecto)
openskills sync -o .ruler/AGENTS.md →  .ruler/AGENTS.md (directorio anidado)
```

**Características Clave**:

1. **Ruta Arbitraria**: Puede especificar cualquier ruta de archivo `.md` (relativa o absoluta)
2. **Creación Automática de Archivos**: Si el archivo no existe, la herramienta lo crea automáticamente
3. **Creación Automática de Directorios**: Si el directorio del archivo no existe, la herramienta lo crea recursivamente
4. **Título Inteligente**: Al crear un archivo, agrega automáticamente un título basado en el nombre del archivo (por ejemplo, `# AGENTS`)
5. **Validación de Formato**: Debe terminar en `.md`, de lo contrario se mostrará un error

**¿Por Qué Se Necesita Esta Función?**

Diferentes herramientas de IA pueden tener diferentes rutas esperadas:

| Herramienta | Ruta Esperada           | ¿Ruta Predeterminada Disponible? |
|-------------|-------------------------|----------------------------------|
| Claude Code | `AGENTS.md`             | ✅ Disponible                    |
| Cursor      | `AGENTS.md`             | ✅ Disponible                    |
| Windsurf    | `.ruler/AGENTS.md`      | ❌ No Disponible                 |
| Aider       | `.aider/agents.md`      | ❌ No Disponible                 |

Usando la flag `-o`, puedes configurar la ruta correcta para cada herramienta.

---

## Práctica Guiada

### Paso 1: Uso Básico - Salida al Directorio Actual

Primero, intenta sincronizar skills a un archivo personalizado en el directorio actual:

```bash
npx openskills sync -o my-skills.md
```

**Por Qué**

Usar `-o my-skills.md` le dice a la herramienta que genere la salida en `my-skills.md` en lugar del `AGENTS.md` predeterminado.

**Lo Que Deberías Ver**:

Si `my-skills.md` no existe, la herramienta lo creará:

```
Created my-skills.md
```

Luego iniciará la interfaz de selección interactiva:

```
Found 2 skill(s)

? Select skills to sync to my-skills.md:
❯ ◉ pdf                        (project)  Comprehensive PDF manipulation toolkit...
  ◉ git-workflow                (project)  Git workflow: Best practices for commits...

<Space> Select  <a> Select All  <i> Invert  <Enter> Confirm
```

Después de seleccionar los skills, verás:

```
✅ Synced 2 skill(s) to my-skills.md
```

::: tip Verificar el Archivo Generado

Ver el archivo generado:

```bash
cat my-skills.md
```

Verás:

```markdown
<!-- Título del archivo: # my-skills -->

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of available skills below can help...
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

Nota que la primera línea es `# my-skills`, este es el título que la herramienta genera automáticamente basándose en el nombre del archivo.

:::

---

### Paso 2: Salida a un Directorio Anidado

Ahora, intenta sincronizar skills a un directorio anidado que no existe:

```bash
npx openskills sync -o .ruler/AGENTS.md
```

**Por Qué**

Algunas herramientas (como Windsurf) esperan que AGENTS.md esté en el directorio `.ruler/`. Si el directorio no existe, la herramienta lo creará automáticamente.

**Lo Que Deberías Ver**:

Si el directorio `.ruler/` no existe, la herramienta creará el directorio y el archivo:

```
Created .ruler/AGENTS.md
```

Luego iniciará la interfaz de selección interactiva (igual que en el paso anterior).

**Guía de Operación**:

```
┌─────────────────────────────────────────────────────────────┐
│  Instrucciones de Creación Automática de Directorios         │
│                                                             │
│  Comando de entrada: openskills sync -o .ruler/AGENTS.md   │
│                                                             │
│  Ejecución de la herramienta:                                │
│  1. Verificar si el directorio .ruler existe  →  No existe │
│  2. Crear recursivamente el directorio .ruler →  mkdir .ruler│
│  3. Crear .ruler/AGENTS.md  →  Escribir el título # AGENTS │
│  4. Sincronizar contenido de skills →  Escribir lista XML  │
│                                                             │
│  Resultado: Archivo .ruler/AGENTS.md generado, skills        │
│  sincronizados                                              │
└─────────────────────────────────────────────────────────────┘
```

::: tip Creación Recursiva

La herramienta crea recursivamente todos los directorios padres inexistentes. Por ejemplo:

- `docs/ai/skills.md` - Si `docs` y `docs/ai` no existen, ambos se crearán
- `.config/agents.md` - Se creará el directorio oculto `.config`

:::

---

### Paso 3: Gestión Multi-Archivo - Configuración para Diferentes Herramientas

Supongamos que usas Windsurf y Cursor simultáneamente y necesitas configurar diferentes archivos AGENTS.md para cada uno:

```bash
<!-- Configurar para Windsurf (espera .ruler/AGENTS.md) -->
npx openskills sync -o .ruler/AGENTS.md

<!-- Configurar para Cursor (usa AGENTS.md en raíz del proyecto) -->
npx openskills sync
```

**Por Qué**

Diferentes herramientas pueden esperar AGENTS.md en diferentes ubicaciones. Usando la flag `-o`, puedes configurar la ruta correcta para cada herramienta, evitando conflictos.

**Lo Que Deberías Ver**:

Se generarán dos archivos independientes:

```bash
<!-- Ver AGENTS.md de Windsurf -->
cat .ruler/AGENTS.md

<!-- Ver AGENTS.md de Cursor -->
cat AGENTS.md
```

::: tip Independencia de Archivos

Cada archivo `.md` es independiente y contiene su propia lista de skills. Puedes seleccionar diferentes skills en diferentes archivos:

- `.ruler/AGENTS.md` - Skills seleccionados para Windsurf
- `AGENTS.md` - Skills seleccionados para Cursor
- `docs/ai-skills.md` - Lista de skills en documentación

:::

---

### Paso 4: Sincronización No-Interactiva a Archivo Personalizado

En entornos CI/CD, es posible que necesites omitir la selección interactiva y sincronizar todos los skills directamente a un archivo personalizado:

```bash
npx openskills sync -o .ruler/AGENTS.md -y
```

**Por Qué**

La flag `-y` omite la selección interactiva y sincroniza todos los skills instalados. Combinado con la flag `-o`, puede generar salida a una ruta personalizada en flujos de trabajo automatizados.

**Lo Que Deberías Ver**:

```
Created .ruler/AGENTS.md
✅ Synced 2 skill(s) to .ruler/AGENTS.md
```

::: info Escenarios de Uso CI/CD

Usar en scripts CI/CD:

```bash
#!/bin/bash
<!-- Instalar skills -->
npx openskills install anthropics/skills -y

<!-- Sincronizar a archivo personalizado (no interactivo) -->
npx openskills sync -o .ruler/AGENTS.md -y
```

:::

---

### Paso 5: Verificar el Archivo de Salida

Finalmente, verifica que el archivo de salida se generó correctamente:

```bash
<!-- Ver contenido del archivo -->
cat .ruler/AGENTS.md

<!-- Verificar si el archivo existe -->
ls -l .ruler/AGENTS.md

<!-- Confirmar cantidad de skills -->
grep -c "<name>" .ruler/AGENTS.md
```

**Lo Que Deberías Ver**:

1. El archivo contiene el título correcto (por ejemplo, `# AGENTS`)
2. El archivo contiene la etiqueta XML `<skills_system>`
3. El archivo contiene la lista de skills `<available_skills>`
4. Cada `<skill>` contiene `<name>`, `<description>`, `<location>`

::: tip Verificar Ruta de Salida

Si no estás seguro del directorio de trabajo actual, puedes usar:

```bash
<!-- Ver directorio actual -->
pwd

<!-- Ver a dónde se resuelve la ruta relativa -->
realpath .ruler/AGENTS.md
```

:::

---

## Punto de Verificación ✅

Después de completar los pasos anteriores, confirma:

- [ ] Usaste exitosamente la flag `-o` para generar salida a un archivo personalizado
- [ ] La herramienta creó automáticamente archivos inexistentes
- [ ] La herramienta creó automáticamente directorios anidados inexistentes
- [ ] El archivo generado contiene el título correcto (basado en el nombre del archivo)
- [ ] El archivo generado contiene la etiqueta XML `<skills_system>`
- [ ] El archivo generado contiene la lista completa de skills
- [ ] Puedes configurar diferentes rutas de salida para diferentes herramientas
- [ ] Puedes usar la combinación `-y` y `-o` en entornos CI/CD

Si todos los puntos de verificación anteriores pasan, ¡felicidades! Ya dominas el uso de rutas de salida personalizadas y puedes sincronizar skills de manera flexible a cualquier ubicación.

---

## Recordatorio de Problemas Comunes

### Problema 1: El Archivo de Salida No Es Markdown

**Síntoma**:

```
Error: Output file must be a markdown file (.md)
```

**Causa**:

Al usar la flag `-o`, la extensión del archivo especificado no es `.md`. La herramienta requiere forzosamente generar salida a un archivo markdown para asegurar que la herramienta de IA pueda analizarlo correctamente.

**Solución**:

Asegúrate de que el archivo de salida termine en `.md`:

```bash
<!-- ❌ Incorrecto -->
npx openskills sync -o skills.txt

<!-- ✅ Correcto -->
npx openskills sync -o skills.md
```

---

### Problema 2: Error de Permisos al Crear Directorio

**Síntoma**:

```
Error: EACCES: permission denied, mkdir '.ruler'
```

**Causa**:

Al intentar crear el directorio, el usuario actual no tiene permisos de escritura en el directorio padre.

**Solución**:

1. Verifica los permisos del directorio padre:

```bash
ls -ld .
```

2. Si los permisos son insuficientes, contacta al administrador o usa un directorio con permisos:

```bash
<!-- Usar directorio del proyecto -->
cd ~/projects/my-project
npx openskills sync -o .ruler/AGENTS.md
```

---

### Problema 3: Ruta de Salida Demasiado Larga

**Síntoma**:

La ruta del archivo es muy larga, dificultando la lectura y el mantenimiento del comando:

```bash
npx openskills sync -o docs/ai/skills/v2/internal/agents.md
```

**Causa**:

Los directorios anidados son demasiado profundos, dificultando la gestión de la ruta.

**Solución**:

1. Usar rutas relativas (desde la raíz del proyecto)
2. Simplificar la estructura de directorios
3. Considerar usar enlaces simbólicos (ver [Soporte de Enlaces Simbólicos](../symlink-support/))

```bash
<!-- Práctica recomendada: Estructura de directorios plana -->
npx openskills sync -o docs/agents.md
```

---

### Problema 4: Olvidar Usar la Flag -o

**Síntoma**:

Esperabas generar salida a un archivo personalizado, pero la herramienta sigue generando salida al `AGENTS.md` predeterminado.

**Causa**:

Olvidaste usar la flag `-o`, o la escribiste incorrectamente.

**Solución**:

1. Verifica que el comando incluya `-o` o `--output`:

```bash
<!-- ❌ Incorrecto: Olvidar la flag -o -->
npx openskills sync

<!-- ✅ Correcto: Usar la flag -o -->
npx openskills sync -o .ruler/AGENTS.md
```

2. Usar la forma completa `--output` (más clara):

```bash
npx openskills sync --output .ruler/AGENTS.md
```

---

### Problema 5: Nombre de Archivo Contiene Caracteres Especiales

**Síntoma**:

El nombre de archivo contiene espacios o caracteres especiales, causando errores de análisis de ruta:

```bash
npx openskills sync -o "my skills.md"
```

**Causa**:

Algunos shells manejan los caracteres especiales de manera diferente, lo que podría causar errores de ruta.

**Solución**:

1. Evitar usar espacios y caracteres especiales
2. Si debes usarlos, envolver entre comillas:

```bash
<!-- No recomendado -->
npx openskills sync -o "my skills.md"

<!-- Recomendado -->
npx openskills sync -o my-skills.md
```

---

## Resumen de la Lección

A través de esta lección, has aprendido:

- **Usar las flags `-o` o `--output`** para sincronizar skills a archivos `.md` personalizados
- El mecanismo de **creación automática de archivos y directorios**, sin necesidad de preparar manualmente la estructura de directorios
- **Configurar diferentes archivos AGENTS.md para diferentes herramientas**, evitando conflictos multi-herramienta
- **Técnicas de gestión multi-archivo**, clasificando y almacenando listas de skills por herramienta o función
- **Uso en entornos CI/CD** combinando `-y` y `-o` para lograr sincronización automatizada

**Comandos Clave**:

| Comando | Función |
|---------|---------|
| `npx openskills sync -o custom.md` | Sincronizar a `custom.md` en la raíz del proyecto |
| `npx openskills sync -o .ruler/AGENTS.md` | Sincronizar a `.ruler/AGENTS.md` (creación automática de directorios) |
| `npx openskills sync -o path/to/file.md` | Sincronizar a cualquier ruta (creación automática de directorios anidados) |
| `npx openskills sync -o custom.md -y` | Sincronización no-interactiva a archivo personalizado |

**Puntos Clave**:

- El archivo de salida debe terminar en `.md`
- La herramienta crea automáticamente archivos y directorios inexistentes
- Al crear un archivo, se agrega automáticamente un título basado en el nombre del archivo
- Cada archivo `.md` es independiente y contiene su propia lista de skills
- Aplicable a escenarios de entornos multi-herramienta, requisitos de estructura de directorios, integración con documentación existente, etc.

---

## Próxima Lección

> En la próxima lección aprenderemos **[Soporte de Enlaces Simbólicos](../symlink-support/)**.
>
> Aprenderás:
> - Cómo usar enlaces simbólicos para lograr actualizaciones de skills basadas en git
> - Ventajas y escenarios de uso de enlaces simbólicos
> - Cómo gestionar skills en desarrollo local
> - Mecanismos de detección y procesamiento de enlaces simbólicos

La ruta de salida personalizada te permite controlar flexiblemente la ubicación de la lista de skills, mientras que los enlaces simbólicos proporcionan una forma más avanzada de gestionar skills, especialmente adecuada para escenarios de desarrollo local.

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Función | Ruta del Archivo | Número de Línea |
|---------|------------------|-----------------|
| Entrada del comando sync | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L18-L109) | 18-109 |
| Definición de opciones CLI | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L66) | 66 |
| Obtención de ruta de salida | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L19) | 19 |
| Validación de archivo de salida | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L22-L26) | 22-26 |
| Creación de archivos inexistentes | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L28-L36) | 28-36 |
| Creación recursiva de directorios | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L31-L32) | 31-32 |
| Generación automática de título | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L34) | 34 |
| Uso del nombre del archivo de salida en prompts interactivos | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L70) | 70 |

**Funciones Clave**:
- `syncAgentsMd(options: SyncOptions)` - Sincroniza skills al archivo de salida especificado
- `options.output` - Ruta de salida personalizada (opcional, predeterminado 'AGENTS.md')

**Constantes Clave**:
- `'AGENTS.md'` - Nombre de archivo de salida predeterminado
- `'.md'` - Extensión de archivo requerida forzosamente

**Lógica Importante**:
- El archivo de salida debe terminar en `.md`, de lo contrario muestra un error y sale (sync.ts:23-26)
- Si el archivo no existe, crea automáticamente el directorio padre (recursivo) y el archivo (sync.ts:28-36)
- Al crear el archivo, escribe el título basado en el nombre del archivo: `# ${outputName.replace('.md', '')}` (sync.ts:34)
- Muestra el nombre del archivo de salida en el prompt interactivo (sync.ts:70)
- Muestra el nombre del archivo de salida en el mensaje de éxito de sincronización (sync.ts:105, 107)

</details>
