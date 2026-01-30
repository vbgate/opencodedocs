---
title: "Sincronización de habilidades: Generar AGENTS.md | openskills"
sidebarTitle: "Hacer que la IA conozca las habilidades"
subtitle: "Sincronización de habilidades: Generar AGENTS.md"
description: "Aprende a usar el comando openskills sync para generar el archivo AGENTS.md, permitiendo que los agentes de IA (Claude Code, Cursor) conozcan las habilidades instaladas. Domina la selección de habilidades y técnicas de sincronización para optimizar el uso del contexto de IA."
tags:
  - "Tutorial de introducción"
  - "Sincronización de habilidades"
  - "AGENTS.md"
prerequisite:
  - "start-first-skill"
order: 5
---

# Sincronizar habilidades a AGENTS.md

## Lo que lograrás después de esta lección

- Usar `openskills sync` para generar el archivo AGENTS.md
- Comprender cómo los agentes de IA conocen las habilidades disponibles a través de AGENTS.md
- Seleccionar qué habilidades sincronizar para controlar el tamaño del contexto de IA
- Usar rutas de salida personalizadas para integrar con documentación existente
- Comprender el formato XML de AGENTS.md y cómo usarlo

::: info Conocimientos previos

Este tutorial asume que ya has completado la [instalación de tu primera habilidad](../first-skill/). Si aún no has instalado ninguna habilidad, completa primero los pasos de instalación.

:::

---

## Tu situación actual

Es posible que ya hayas instalado algunas habilidades, pero:

- **El agente de IA no sabe que hay habilidades disponibles**: Las habilidades están instaladas, pero el agente de IA (como Claude Code) no sabe que existen
- **No sabes cómo hacer que la IA conozca las habilidades**: Has oído hablar de `AGENTS.md`, pero no sabes qué es ni cómo generarlo
- **Te preocupa que demasiadas habilidades ocupen el contexto**: Has instalado muchas habilidades y quieres sincronizar selectivamente, sin decirle todo a la IA de una vez

La raíz de estos problemas es: **instalar habilidades y que estén disponibles son dos cosas diferentes**. La instalación solo coloca los archivos; para que la IA lo sepa, necesitas sincronizar a AGENTS.md.

---

## Cuándo usar esta técnica

**Sincronizar habilidades a AGENTS.md** es adecuado para estos escenarios:

- Acabas de instalar habilidades y necesitas que el agente de IA sepa que existen
- Después de agregar nuevas habilidades, actualizar la lista de habilidades disponibles de la IA
- Después de eliminar habilidades, removerlas de AGENTS.md
- Quieres sincronizar habilidades selectivamente para controlar el tamaño del contexto de IA
- Entorno multi-agente que necesita una lista de habilidades unificada

::: tip Práctica recomendada

Cada vez que instales, actualices o elimines habilidades, ejecuta `openskills sync` para mantener AGENTS.md consistente con las habilidades reales.

:::

---

## 🎒 Preparativos antes de empezar

Antes de comenzar, confirma:

- [ ] Has completado la [instalación de al menos una habilidad](../first-skill/)
- [ ] Has ingresado al directorio de tu proyecto
- [ ] Conoces la ubicación de instalación de las habilidades (project o global)

::: warning Verificación previa

Si aún no has instalado ninguna habilidad, primero ejecuta:

```bash
npx openskills install anthropics/skills
```

:::

---

## Idea clave: Instalar habilidades ≠ IA puede usarlas

La gestión de habilidades de OpenSkills se divide en dos fases:

```
[Fase de instalación]        [Fase de sincronización]
Habilidad → .claude/skills/  →  AGENTS.md
    ↓                              ↓
Archivo existe              El agente de IA lee
    ↓                              ↓
Disponible localmente       La IA conoce y puede invocar
```

**Puntos clave**:

1. **Fase de instalación**: Usando `openskills install`, las habilidades se copian al directorio `.claude/skills/`
2. **Fase de sincronización**: Usando `openskills sync`, la información de habilidades se escribe en `AGENTS.md`
3. **Lectura de IA**: El agente de IA lee `AGENTS.md` y conoce qué habilidades están disponibles
4. **Carga bajo demanda**: La IA usa `openskills read <skill>` para cargar habilidades específicas según sea necesario

**¿Por qué se necesita AGENTS.md?**

Los agentes de IA (como Claude Code, Cursor) no escanean activamente el sistema de archivos. Necesitan una "lista de habilidades" explícita que les diga qué herramientas pueden usar. Esta lista es `AGENTS.md`.

---

## Sígueme paso a paso

### Paso 1: Ingresar al directorio del proyecto

Primero, ingresa al directorio del proyecto donde instalaste las habilidades:

```bash
cd /path/to/your/project
```

**¿Por qué**

`openskills sync` busca por defecto las habilidades instaladas en el directorio actual y genera o actualiza `AGENTS.md` en el directorio actual.

**Lo que deberías ver**:

Tu directorio de proyecto debería contener el directorio `.claude/skills/` (si instalaste habilidades):

```bash
ls -la
# Ejemplo de salida:
drwxr-xr-x  5 user  staff  .claude
drwxr-xr-x  5 user  staff  .claude/skills/
-rw-r--r--  1 user  staff  package.json
```

---

### Paso 2: Sincronizar habilidades

Usa el siguiente comando para sincronizar las habilidades instaladas a AGENTS.md:

```bash
npx openskills sync
```

**¿Por qué**

El comando `sync` busca todas las habilidades instaladas, genera una lista de habilidades en formato XML y la escribe en el archivo `AGENTS.md`.

**Lo que deberías ver**:

El comando iniciará una interfaz de selección interactiva:

```
Found 2 skill(s)

? Select skills to sync to AGENTS.md:
❯ ◉ pdf                        (project)  Comprehensive PDF manipulation toolkit...
  ◉ git-workflow                (project)  Git workflow: Best practices for commits...
  ◉ check-branch-first          (global)   Git workflow: Always check current branch...

<Space> seleccionar  <a> seleccionar todo  <i> invertir selección  <Enter> confirmar
```

**Guía de operación**:

```
┌─────────────────────────────────────────────────────────────┐
│  Instrucciones de operación                                 │
│                                                             │
│  Paso 1           Paso 2            Paso 3                  │
│  Mover cursor  →  Presiona Space  →  Presiona Enter         │
│  para seleccionar     para          para confirmar           │
│                                                             │
│  ○ No seleccionado       ◉ Seleccionado                     │
│                                                             │
│  (project)         Habilidad de proyecto, resaltado azul    │
│  (global)          Habilidad global, mostrado en gris       │
└─────────────────────────────────────────────────────────────┘

Lo que deberías ver:
- El cursor puede moverse hacia arriba y hacia abajo
- Presiona la barra espaciadora para alternar el estado de selección (○ ↔ ◉)
- Las habilidades de proyecto se muestran en azul, las globales en gris
- Presiona Enter para confirmar la sincronización
```

::: tip Preselección inteligente

Si es la primera sincronización, la herramienta selecciona por defecto todas las **habilidades de proyecto**. Si estás actualizando un AGENTS.md existente, la herramienta preselecciona las **habilidades ya habilitadas en el archivo**.

:::

---

### Paso 3: Seleccionar habilidades

En la interfaz interactiva, selecciona las habilidades que quieres que el agente de IA conozca.

**Ejemplo**:

Supongamos que quieres sincronizar todas las habilidades instaladas:

```
? Select skills to sync to AGENTS.md:
❯ ◉ pdf                        (project)
  ◉ git-workflow                (project)
  ◯ check-branch-first          (global)   ← No seleccionar esta habilidad global
```

Operación:
1. **Mover el cursor**: Usa las teclas de flecha arriba y abajo para moverte
2. **Seleccionar/Deseleccionar**: Presiona la **barra espaciadora** para alternar el estado de selección (`○` ↔ `◉`)
3. **Confirmar sincronización**: Presiona la **tecla Enter** para comenzar la sincronización

**Lo que deberías ver**:

```
✅ Synced 2 skill(s) to AGENTS.md
```

::: tip Estrategia de selección

- **Habilidades de proyecto**: Habilidades específicas del proyecto actual, se recomienda sincronizar
- **Habilidades globales**: Habilidades de uso general (como estándares de codificación), sincronizar según necesidad
- **Evitar exceso**: Demasiadas habilidades ocupan el contexto de IA, se recomienda sincronizar solo las de uso frecuente

:::

---

### Paso 4: Ver AGENTS.md

Después de completar la sincronización, revisa el archivo AGENTS.md generado:

```bash
cat AGENTS.md
```

**Lo que deberías ver**:

```markdown
# AGENTS.md

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of available skills below can help complete the task more effectively.

How to use skills:
- Invoke: `npx openskills read <skill-name>` (run in your shell)
- The skill content will load with detailed instructions
- Base directory provided in output for resolving bundled resources

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms...</description>
<location>project</location>
</skill>

<skill>
<name>git-workflow</name>
<description>Git workflow: Best practices for commits, branches, and PRs, ensuring clean history and effective collaboration.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

**Descripción de elementos clave**:

| Elemento | Función |
| --- | --- |
| `<skills_system>` | Etiqueta XML que indica a la IA que esta es una definición del sistema de habilidades |
| `<usage>` | Instrucciones de uso que indican a la IA cómo invocar habilidades |
| `<available_skills>` | Lista de habilidades disponibles |
| `<skill>` | Definición de una habilidad individual |
| `<name>` | Nombre de la habilidad |
| `<description>` | Descripción de la habilidad |
| `<location>` | Ubicación de la habilidad |

::: info ¿Por qué formato XML?

El formato XML es el formato estándar para agentes de IA (especialmente Claude Code), fácil de analizar y comprender. La herramienta también admite el formato de comentarios HTML como alternativa.

:::

---

### Paso 5: Verificar la lectura de IA

Ahora, deja que el agente de IA lea AGENTS.md para ver si sabe qué habilidades están disponibles.

**Ejemplo de diálogo**:

```
Usuario:
Quiero extraer datos de tablas de un archivo PDF

Agente de IA:
Puedo usar la habilidad `pdf` para ayudarte a extraer datos de tablas. Déjame leer primero el contenido detallado de esta habilidad.

IA ejecuta:
npx openskills read pdf

Salida:
Skill: pdf
Base Directory: /path/to/project/.claude/skills/pdf

[Contenido detallado de la habilidad PDF...]

IA:
Bien, he cargado la habilidad PDF. Ahora puedo ayudarte a extraer los datos de la tabla...
```

**Lo que deberías ver**:

- El agente de IA reconoce que puede usar la habilidad `pdf`
- La IA ejecuta automáticamente `npx openskills read pdf` para cargar el contenido de la habilidad
- La IA ejecuta la tarea según las instrucciones de la habilidad

---

### Paso 6 (Opcional): Ruta de salida personalizada

Si quieres sincronizar las habilidades a otro archivo (como `.ruler/AGENTS.md`), usa la opción `-o` o `--output`:

```bash
npx openskills sync -o .ruler/AGENTS.md
```

**¿Por qué**

Algunas herramientas (como Windsurf) pueden esperar que AGENTS.md esté en un directorio específico. Usar `-o` te permite personalizar flexiblemente la ruta de salida.

**Lo que deberías ver**:

```
Created .ruler/AGENTS.md
✅ Synced 2 skill(s) to .ruler/AGENTS.md
```

::: tip Sincronización no interactiva

En entornos CI/CD, puedes usar el indicador `-y` o `--yes` para omitir la selección interactiva y sincronizar todas las habilidades:

```bash
npx openskills sync -y
```

:::

---

## Punto de control ✅

Después de completar los pasos anteriores, confirma:

- [ ] La línea de comandos mostró la interfaz de selección interactiva
- [ ] Seleccionaste correctamente al menos una habilidad (al frente hay `◉`)
- [ ] La sincronización fue exitosa, se mostró el mensaje `✅ Synced X skill(s) to AGENTS.md`
- [ ] El archivo `AGENTS.md` se creó o actualizó
- [ ] El archivo contiene la etiqueta XML `<skills_system>`
- [ ] El archivo contiene la lista `<available_skills>`
- [ ] Cada `<skill>` contiene `<name>`, `<description>`, `<location>`

Si todos los elementos de verificación anteriores pasan, ¡felicidades! Las habilidades se han sincronizado correctamente a AGENTS.md, y el agente de IA ahora puede conocer y usar estas habilidades.

---

## Advertencias de problemas comunes

### Problema 1: No se encontraron habilidades

**Síntoma**:

```
No skills installed. Install skills first:
  npx openskills install anthropics/skills --project
```

**Causa**:

- No hay habilidades instaladas ni en el directorio actual ni en el directorio global

**Solución**:

1. Verifica si hay habilidades instaladas:

```bash
npx openskills list
```

2. Si no hay, primero instala habilidades:

```bash
npx openskills install anthropics/skills
```

---

### Problema 2: AGENTS.md no se actualizó

**Síntoma**:

Después de ejecutar `openskills sync`, el contenido de AGENTS.md no cambió.

**Causa**:

- Se usó el indicador `-y`, pero la lista de habilidades es la misma que antes
- AGENTS.md ya existe, pero se sincronizaron las mismas habilidades

**Solución**:

1. Verifica si usaste el indicador `-y`

```bash
# Quita -y para entrar en modo interactivo y reseleccionar
npx openskills sync
```

2. Verifica si el directorio actual es correcto

```bash
# Confirma que estás en el directorio del proyecto donde instalaste las habilidades
pwd
ls .claude/skills/
```

---

### Problema 3: El agente de IA no conoce las habilidades

**Síntoma**:

AGENTS.md se generó, pero el agente de IA aún no sabe que hay habilidades disponibles.

**Causa**:

- El agente de IA no leyó AGENTS.md
- El formato de AGENTS.md es incorrecto
- El agente de IA no admite el sistema de habilidades

**Solución**:

1. Confirma que AGENTS.md está en el directorio raíz del proyecto
2. Verifica que el formato de AGENTS.md sea correcto (contiene la etiqueta `<skills_system>`)
3. Verifica si el agente de IA admite AGENTS.md (Claude Code lo admite, otras herramientas pueden requerir configuración)

---

### Problema 4: El archivo de salida no es markdown

**Síntoma**:

```
Error: Output file must be a markdown file (.md)
```

**Causa**:

- Se usó la opción `-o`, pero el archivo especificado no tiene extensión `.md`

**Solución**:

1. Asegúrate de que el archivo de salida termine en `.md`

```bash
# ❌ Incorrecto
npx openskills sync -o skills.txt

# ✅ Correcto
npx openskills sync -o skills.md
```

---

### Problema 5: Cancelar todas las selecciones

**Síntoma**:

En la interfaz interactiva, después de deseleccionar todas las habilidades, la sección de habilidades en AGENTS.md se eliminó.

**Causa**:

Este es el comportamiento normal. Si cancelas todas las habilidades, la herramienta elimina la sección de habilidades de AGENTS.md.

**Solución**:

Si fue un error, vuelve a ejecutar `openskills sync` y selecciona las habilidades a sincronizar.

---

## Resumen de esta lección

En esta lección, aprendiste:

- **Usar `openskills sync`** para generar el archivo AGENTS.md
- **Comprender el flujo de sincronización de habilidades**: Instalación → Sincronización → Lectura de IA → Carga bajo demanda
- **Selección interactiva de habilidades** para controlar el tamaño del contexto de IA
- **Personalizar la ruta de salida** para integrar con sistemas de documentación existentes
- **Comprender el formato de AGENTS.md**, incluyendo la etiqueta XML `<skills_system>` y la lista de habilidades

**Comandos clave**:

| Comando | Función |
| --- | --- |
| `npx openskills sync` | Sincronización interactiva de habilidades a AGENTS.md |
| `npx openskills sync -y` | Sincronización no interactiva de todas las habilidades |
| `npx openskills sync -o custom.md` | Sincronizar a archivo personalizado |
| `cat AGENTS.md` | Ver el contenido de AGENTS.md generado |

**Puntos clave del formato AGENTS.md**:

- Envuelto con la etiqueta XML `<skills_system>`
- Contiene instrucciones de uso `<usage>`
- Contiene la lista de habilidades `<available_skills>`
- Cada `<skill>` contiene `<name>`, `<description>`, `<location>`

---

## Próxima lección

> En la próxima lección aprenderemos **[Usar habilidades](../read-skills/)**.
>
> Aprenderás:
> - Cómo los agentes de IA usan el comando `openskills read` para cargar habilidades
> - El flujo completo de carga de habilidades
> - Cómo leer múltiples habilidades
> - La estructura y composición del contenido de habilidades

Sincronizar habilidades solo hace que la IA sepa qué herramientas están disponibles; cuando realmente las usa, la IA carga el contenido específico de la habilidad a través del comando `openskills read`.

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Función | Ruta del archivo | Línea |
| --- | --- | --- |
| Entrada del comando sync | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L18-L109) | 18-109 |
| Validación del archivo de salida | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L19-L26) | 19-26 |
| Crear archivo si no existe | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L28-L36) | 28-36 |
| Interfaz de selección interactiva | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L46-L93) | 46-93 |
| Analizar AGENTS.md existente | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18) | 6-18 |
| Generar XML de habilidades | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62 |
| Reemplazar sección de habilidades | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93 |
| Eliminar sección de habilidades | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L98-L122) | 98-122 |

**Funciones clave**:
- `syncAgentsMd()` - Sincronizar habilidades al archivo AGENTS.md
- `parseCurrentSkills()` - Analizar nombres de habilidades en AGENTS.md existente
- `generateSkillsXml()` - Generar lista de habilidades en formato XML
- `replaceSkillsSection()` - Reemplazar o agregar sección de habilidades al archivo
- `removeSkillsSection()` - Eliminar sección de habilidades del archivo

**Constantes clave**:
- `AGENTS.md` - Nombre de archivo de salida predeterminado
- `<skills_system>` - Etiqueta XML para marcar la definición del sistema de habilidades
- `<available_skills>` - Etiqueta XML para marcar la lista de habilidades disponibles

**Lógica importante**:
- Por defecto preselecciona las habilidades existentes en el archivo (actualización incremental)
- La primera sincronización selecciona por defecto todas las habilidades de proyecto
- Admite dos formatos de marcado: etiquetas XML y comentarios HTML
- Al cancelar todas las selecciones, elimina la sección de habilidades en lugar de mantener una lista vacía

</details>
