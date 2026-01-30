---
title: "Comando read: Leer Contenido de Skills Instaladas | openskills"
sidebarTitle: "Leer Skills Instaladas"
subtitle: "Comando read: Leer Contenido de Skills Instaladas"
description: "Aprende a usar el comando openskills read para leer el contenido de skills instaladas. Domina los 4 niveles de prioridad de búsqueda y el flujo de carga completo, admite lectura de múltiples skills, ayuda a los agentes de IA a obtener rápidamente definiciones de skills y ejecutar tareas."
tags:
  - "Tutorial de Inicio"
  - "Uso de Skills"
prerequisite:
  - "start-first-skill"
order: 6
---

# Uso de Skills

## Lo Que Aprenderás

- Usar el comando `openskills read` para leer el contenido de skills instaladas
- Entender cómo los agentes de IA cargan skills en el contexto mediante este comando
- Dominar el orden de prioridad de 4 niveles para la búsqueda de skills
- Aprender a leer múltiples skills a la vez (separados por comas)

::: info Conocimientos Previos

Este tutorial asume que ya has [instalado al menos un skill](../first-skill/). Si aún no has instalado ningún skill, completa primero los pasos de instalación.

:::

---

## Tu Situación Actual

Es posible que ya hayas instalado skills, pero:

- **No sabes cómo hacer que la IA los use**: Las skills están instaladas, pero ¿cómo las lee el agente de IA?
- **No entiendes la función del comando read**: Solo sabes que existe el comando `read`, pero no sabes qué produce como salida
- **No conoces el orden de búsqueda de skills**: Tienes skills tanto globales como de proyecto, ¿cuál usará la IA?

Estos problemas son muy comunes. Vamos a resolverlos paso a paso.

---

## Cuándo Usar Este Comando

**Usar skills (comando read)** es adecuado para estas situaciones:

- **El agente de IA necesita ejecutar tareas específicas**: como procesar PDFs, operar repositorios Git, etc.
- **Validar si el contenido del skill es correcto**: verificar si las instrucciones del SKILL.md cumplen con las expectativas
- **Entender la estructura completa del skill**: ver los recursos de references/, scripts/, etc.

::: tip Buena Práctica

Normalmente no usarás directamente el comando `read`, sino que el agente de IA lo llamará automáticamente. Sin embargo, conocer el formato de salida es útil para depuración y desarrollo de skills personalizados.

:::

---

## 🎒 Preparativos

Antes de comenzar, confirma lo siguiente:

- [ ] Has completado [Instalar tu primer skill](../first-skill/)
- [ ] Has instalado al menos un skill en el directorio del proyecto
- [ ] Puedes ver el directorio `.claude/skills/`

::: warning Comprobación Previa

Si aún no has instalado ningún skill, puedes instalar rápidamente uno de prueba:

```bash
npx openskills install anthropics/skills
# En la interfaz interactiva, selecciona cualquier skill (como pdf)
```

:::

---

## Idea Central: Búsqueda por Prioridad y Salida de Skills

El comando `read` de OpenSkills sigue este flujo:

```
[Especificar nombre del skill] → [Búsqueda por prioridad] → [Encontrar el primero] → [Leer SKILL.md] → [Mostrar en salida estándar]
```

**Puntos Clave**:

- **4 Niveles de Prioridad de Búsqueda**:
  1. `.agent/skills/` (universal de proyecto)
  2. `~/.agent/skills/` (universal global)
  3. `.claude/skills/` (claude de proyecto)
  4. `~/.claude/skills/` (claude global)

- **Devuelve el primer match**: Detiene la búsqueda al encontrar el primero, no busca en directorios posteriores
- **Directorio base de salida**: El agente de IA necesita esta ruta para resolver archivos de recursos en el skill

---

## Manos a la Obra

### Paso 1: Leer un Skill Individual

Primero, intenta leer un skill instalado.

**Comando de ejemplo**:

```bash
npx openskills read pdf
```

**Por qué**

`pdf` es el nombre del skill que instalamos en la lección anterior. Este comando buscará y mostrará el contenido completo de ese skill.

**Deberías ver**:

```
Reading: pdf
Base directory: /path/to/your/project/.claude/skills/pdf

---
name: pdf
description: Comprehensive PDF manipulation toolkit for extracting text and tables...
...

Skill read: pdf
```

**Análisis de la estructura de salida**:

| Sección | Contenido | Propósito |
|---|---|---|
| `Reading: pdf` | Nombre del skill | Identifica el skill que se está leyendo |
| `Base directory: ...` | Directorio base del skill | La IA usa esta ruta para resolver recursos como references/, scripts/, etc. |
| Contenido de SKILL.md | Definición completa del skill | Contiene instrucciones, referencias de recursos, etc. |
| `Skill read: pdf` | Marcador de finalización | Indica que la lectura ha terminado |

::: tip Nota

El **Directorio base (Base directory)** es muy importante. Las rutas relativas en el skill como `references/some-doc.md` se resuelven respecto a este directorio.

:::

---

### Paso 2: Leer Múltiples Skills

OpenSkills soporta leer múltiples skills a la vez, separados por comas.

**Comando de ejemplo**:

```bash
npx openskills read pdf,git-workflow
```

**Por qué**

Leer múltiples skills en un solo comando reduce las llamadas al comando y mejora la eficiencia.

**Deberías ver**:

```
Reading: pdf
Base directory: /path/to/your/project/.claude/skills/pdf

---
name: pdf
description: Comprehensive PDF manipulation toolkit...
...

Skill read: pdf

Reading: git-workflow
Base directory: /path/to/your/project/.claude/skills/git-workflow

---
name: git-workflow
description: Git workflow: Best practices...
...

Skill read: git-workflow
```

**Características**:
- La salida de cada skill está separada por líneas en blanco
- Cada skill tiene sus propios marcadores `Reading:` y `Skill read:`
- Los skills se leen en el orden especificado en el comando

::: tip Uso Avanzado

Los nombres de skills pueden contener espacios, el comando `read` los maneja automáticamente:

```bash
npx openskills read pdf, git-workflow  # Los espacios se ignoran
```

:::

---

### Paso 3: Verificar la Prioridad de Búsqueda de Skills

Verifiquemos el orden de los 4 niveles de búsqueda.

**Preparar el entorno**:

Primero, instala skills en el directorio del proyecto y globalmente (usando diferentes fuentes de instalación):

```bash
# Instalación local en el proyecto (en el directorio del proyecto actual)
npx openskills install anthropics/skills

# Instalación global (usa --global)
npx openskills install anthropics/skills --global
```

**Verificar prioridad**:

```bash
# Lista todos los skills
npx openskills list
```

**Deberías ver**:

```
Available skills:

pdf (project)      /path/to/your/project/.claude/skills/pdf
pdf (global)       /home/user/.claude/skills/pdf

Total: 2 skills (1 project, 1 global)
```

**Leer skill**:

```bash
npx openskills read pdf
```

**Deberías ver**:

```
Reading: pdf
Base directory: /path/to/your/project/.claude/skills/pdf  ← Prioridad al skill del proyecto
...
```

**Conclusión**: Como `.claude/skills/` (proyecto) tiene mayor prioridad que `~/.claude/skills/` (global), se lee el skill local del proyecto.

::: tip Aplicación Práctica

Este mecanismo de prioridad te permite sobrescribir skills globales en proyectos específicos sin afectar otros proyectos. Por ejemplo:
- Instala skills comunes globalmente (compartidos entre todos los proyectos)
- Instala versiones personalizadas en proyectos (sobrescriben la versión global)

:::

---

### Paso 4: Ver los Recursos Completos de un Skill

Un skill no solo contiene SKILL.md, también puede tener recursos como references/, scripts/, etc.

**Ver la estructura del directorio del skill**:

```bash
ls -la .claude/skills/pdf/
```

**Deberías ver**:

```
.claude/skills/pdf/
├── SKILL.md
├── .openskills.json
├── references/
│   ├── pdf-extraction.md
│   └── table-extraction.md
└── scripts/
    └── extract-pdf.js
```

**Leer el skill y observar la salida**:

```bash
npx openskills read pdf
```

**Deberías ver**:

El SKILL.md contiene referencias a recursos, como:

```markdown
## References

See [PDF extraction guide](references/pdf-extraction.md) for details.

## Scripts

Run `node scripts/extract-pdf.js` to extract text from PDF.
```

::: info Punto Clave

Cuando el agente de IA lee un skill:
1. Obtiene la ruta del `Directorio base`
2. Convierte las rutas relativas en SKILL.md (como `references/...`) a rutas absolutas basadas en el directorio base
3. Lee el contenido real de los archivos de recursos

Es por eso que el comando `read` debe mostrar `Base directory`.

:::

---

## Punto de Control ✅

Después de completar los pasos anteriores, confirma lo siguiente:

- [ ] La línea de comandos muestra el contenido completo de SKILL.md del skill
- [ ] La salida incluye `Reading: <name>` y `Base directory: <path>`
- [ ] Al final de la salida hay el marcador de fin `Skill read: <name>`
- [ ] Cuando se leen múltiples skills, cada una está separada por una línea en blanco
- [ ] Se leen preferentemente los skills locales del proyecto en lugar de los globales

Si todos los puntos de verificación anteriores se cumplen, ¡felicidades! Has dominado el flujo central de lectura de skills.

---

## Advertencias de Problemas Comunes

### Problema 1: Skill No Encontrada

**Síntoma**:

```
Error: Skill(s) not found: pdf

Searched:
  .agent/skills/ (project universal)
  ~/.agent/skills/ (global universal)
  .claude/skills/ (project)
  ~/.claude/skills/ (global)

Install skills: npx openskills install owner/repo
```

**Causas**:
- El skill no está instalado
- El nombre del skill está mal escrito

**Solución**:
1. Lista los skills instalados: `npx openskills list`
2. Confirma que el nombre del skill es correcto
3. Si no está instalado, usa `openskills install` para instalarlo

---

### Problema 2: Se Lee el Skill Incorrecto

**Síntoma**:

Se esperaba leer el skill del proyecto, pero se leyó el skill global.

**Causas**:
- El directorio del proyecto no es la ubicación correcta (se usó el directorio equivocado)

**Solución**:
1. Verifica el directorio de trabajo actual: `pwd`
2. Asegúrate de estar en el directorio correcto del proyecto
3. Usa `openskills list` para ver la etiqueta `location` de los skills

---

### Problema 3: El Orden de Lectura de Múltiples Skills No Es el Esperado

**Síntoma**:

```bash
npx openskills read skill-a,skill-b
```

Se esperaba leer primero skill-b, pero se leyó primero skill-a.

**Causas**:
- El comando `read` lee en el orden especificado en los parámetros, no reordena automáticamente

**Solución**:
- Si necesitas un orden específico, especifica los nombres de los skills en ese orden en el comando

---

### Problema 4: El Contenido de SKILL.md Está Truncado

**Síntoma**:

El contenido de SKILL.md mostrado está incompleto, falta la parte final.

**Causas**:
- El archivo del skill está dañado o tiene errores de formato
- Problemas de codificación del archivo

**Solución**:
1. Verifica el archivo SKILL.md: `cat .claude/skills/<nombre>/SKILL.md`
2. Confirma que el archivo está completo y tiene el formato correcto (debe tener YAML frontmatter)
3. Reinstala el skill: `openskills update <nombre>`

---

## Resumen de la Lección

En esta lección aprendiste:

- **Usar `openskills read <nombre>`** para leer el contenido de skills instaladas
- **Entender los 4 niveles de prioridad de búsqueda**: proyecto universal > universal global > claude de proyecto > claude global
- **Soportar lectura de múltiples skills**: usar comas para separar nombres de skills
- **Formato de salida**: incluye `Reading:`, `Base directory`, contenido del skill, marca `Skill read:`

**Conceptos Principales**:

| Concepto | Descripción |
|---|---|
| **Prioridad de búsqueda** | Busca en 4 directorios en orden, devuelve la primera coincidencia |
| **Directorio base** | El agente de IA usa esta ruta para resolver rutas relativas en el skill |
| **Lectura múltiple** | Separar por comas, leer en el orden especificado |

**Comandos Principales**:

| Comando | Acción |
|---|---|
| `npx openskills read <nombre>` | Leer un skill individual |
| `npx openskills read nombre1,nombre2` | Leer múltiples skills |
| `npx openskills list` | Ver skills instaladas y sus ubicaciones |

---

## Vista Previa de la Siguiente Lección

> En la siguiente lección aprenderemos **[Referencia de Comandos](../../platforms/cli-commands/)**.
>
> Aprenderás:
> - La lista completa de todos los comandos de OpenSkills y sus parámetros
> - Cómo usar las banderas de línea de comandos y su función
> - Referencia rápida de comandos comunes

Después de aprender a usar skills, el siguiente paso es conocer todos los comandos disponibles en OpenSkills y sus funciones.

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Función | Ruta del archivo | Líneas |
|---|---|---|
| Entrada del comando read | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts#L8-L48) | 8-48 |
| Búsqueda de skills (findSkill) | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L69-L84) | 69-84 |
| Normalización de nombres de skills | [`src/utils/skill-names.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-names.ts) | 1-8 |
| Obtención de directorios de búsqueda | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts#L18-L25) | 18-25 |
| Definición de comandos CLI | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L52-L55) | 52-55 |

**Funciones clave**:
- `readSkill(skillNames)` - Lee skills en la salida estándar, soporta múltiples nombres de skills
- `findSkill(skillName)` - Busca skills siguiendo 4 niveles de prioridad, devuelve la primera coincidencia
- `normalizeSkillNames(input)` - Normaliza la lista de nombres de skills, soporta separación por comas y elimina duplicados
- `getSearchDirs()` - Devuelve 4 directorios de búsqueda, ordenados por prioridad

**Tipos clave**:
- `SkillLocation` - Información de ubicación del skill, contiene path, baseDir, source

**Prioridad de directorios** (de dirs.ts:18-24):
```typescript
[
  process.cwd() + '/.agent/skills',   // 1. Proyecto universal
  homedir() + '/.agent/skills',       // 2. Global universal
  process.cwd() + '/.claude/skills',  // 3. Proyecto claude
  homedir() + '/.claude/skills',      // 4. Global claude
]
```

</details>
