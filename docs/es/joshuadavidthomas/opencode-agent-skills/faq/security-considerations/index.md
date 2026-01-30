---
title: "Mecanismos de Seguridad: Protección de Rutas y Validación | opencode-agent-skills"
sidebarTitle: "Mecanismos de Seguridad"
subtitle: "Mecanismos de Seguridad: Protección de Rutas y Validación"
description: "Comprenda los mecanismos de seguridad del plugin OpenCode Agent Skills. Domine características de seguridad como protección de rutas, análisis YAML, validación de entrada y protección de ejecución de scripts para usar skills de forma segura."
tags:
  - Seguridad
  - Mejores Prácticas
  - FAQ
prerequisite: []
order: 2
---

# Consideraciones de Seguridad

## Lo que aprenderás en esta lección

- Cómo el plugin protege tu sistema contra amenazas de seguridad
- Qué normas de seguridad deben seguir los archivos de skills
- Las mejores prácticas de seguridad al usar el plugin

## Conceptos Fundamentales

El plugin OpenCode Agent Skills se ejecuta en tu entorno local, ejecuta scripts, lee archivos y analiza configuraciones. Aunque es potente, si los archivos de skills provienen de fuentes no confiables, pueden representar riesgos de seguridad.

El plugin incluye mecanismos de seguridad multicapa en su diseño, como puertas de seguridad que, desde el acceso a rutas, el análisis de archivos hasta la ejecución de scripts, verifican en cada nivel. Comprender estos mecanismos te ayudará a usar el plugin de forma más segura.

## Análisis Detallado de los Mecanismos de Seguridad

### 1. Verificación de Seguridad de Rutas: Prevención de Directory Traversal

**Problema**: Si los archivos de skills contienen rutas maliciosas (como `../../etc/passwd`), podrían acceder a archivos sensibles del sistema.

**Medidas de Protección**:

El plugin usa la función `isPathSafe()` (`src/utils.ts:130-133`) para garantizar que todo acceso a archivos esté limitado dentro del directorio de skills:

```typescript
export function isPathSafe(basePath: string, requestedPath: string): boolean {
  const resolved = path.resolve(basePath, requestedPath);
  return resolved.startsWith(basePath + path.sep) || resolved === basePath;
}
```

**Principio de Funcionamiento**:
1. Resuelve la ruta solicitada en una ruta absoluta
2. Verifica si la ruta resuelta comienza con el directorio de skills
3. Si la ruta intenta salir del directorio de skills (contiene `..`), se rechaza directamente

**Caso Real**:

Cuando la herramienta `read_skill_file` lee un archivo (`src/tools.ts:101-103`), primero llama a `isPathSafe`:

```typescript
// Seguridad: asegurar que la ruta no escape del directorio de skills
if (!isPathSafe(skill.path, args.filename)) {
  return `Ruta inválida: no se puede acceder a archivos fuera del directorio de skills.`;
}
```

Esto significa que:
- ✅ `docs/guide.md` → Permitido (dentro del directorio de skills)
- ❌ `../../../etc/passwd` → Rechazado (intentando acceder a archivos del sistema)
- ❌ `/etc/passwd` → Rechazado (ruta absoluta)

::: info Por qué esto es importante
Los ataques de directory traversal son una vulnerabilidad común en aplicaciones web. Aunque el plugin se ejecuta localmente, los skills de fuentes no confiables podrían intentar acceder a tus claves SSH, configuraciones de proyectos y otros archivos sensibles.
:::

### 2. Análisis Seguro de YAML: Prevención de Ejecución de Código

**Problema**: YAML admite etiquetas personalizadas y objetos complejos; un YAML malicioso podría ejecutar código a través de etiquetas (como `!!js/function`).

**Medidas de Protección**:

El plugin usa la función `parseYamlFrontmatter()` (`src/utils.ts:41-49`), adoptando una estrategia de análisis YAML estricta:

```typescript
export function parseYamlFrontmatter(text: string): Record<string, unknown> {
  try {
    const result = YAML.parse(text, {
      // Usar core schema que solo soporta tipos básicos compatibles con JSON
      // Esto previene etiquetas personalizadas que podrían ejecutar código
      schema: "core",
      // Limitar profundidad de recursión para prevenir ataques DoS
      maxAliasCount: 100,
    });
    return typeof result === "object" && result !== null
      ? (result as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}
```

**Configuraciones Clave de Seguridad**:

| Configuración          | Función                                                                 |
| ---------------------- | ----------------------------------------------------------------------- |
| `schema: "core"`       | Solo soporta tipos JSON básicos (string, number, boolean, array, object), deshabilita etiquetas personalizadas |
| `maxAliasCount: 100`   | Limita la profundidad de recursión de alias YAML, previene ataques DoS  |

**Caso Real**:

```yaml
# Ejemplo de YAML malicioso (será rechazado por core schema)
---
!!js/function >
function () { return "código malicioso" }
---

# Formato seguro correcto
---
name: my-skill
description: Una descripción segura de skill
---
```

Si el análisis YAML falla, el plugin ignora silenciosamente ese skill y continúa descubriendo otros skills (`src/skills.ts:142-145`):

```typescript
let frontmatterObj: unknown;
try {
  frontmatterObj = parseYamlFrontmatter(frontmatterText);
} catch {
  return null;  // Análisis fallido, saltar este skill
}
```

### 3. Validación de Entrada: Verificación Estricta con Zod Schema

**Problema**: Los campos de frontmatter de skills pueden no cumplir con las especificaciones, causando comportamiento anormal del plugin.

**Medidas de Protección**:

El plugin usa Zod Schema (`src/skills.ts:105-114`) para verificar estrictamente el frontmatter:

```typescript
const SkillFrontmatterSchema = z.object({
  name: z.string()
    .regex(/^[\p{Ll}\p{N}-]+$/u, { message: "Name must be lowercase alphanumeric with hyphens" })
    .min(1, { message: "Name cannot be empty" }),
  description: z.string()
    .min(1, { message: "Description cannot be empty" }),
  license: z.string().optional(),
  "allowed-tools": z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.string()).optional()
});
```

**Reglas de Validación**:

| Campo           | Regla                                                                                                        | Ejemplo Rechazado                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| `name`          | Letras minúsculas, números, guiones, no puede estar vacío                                                  | `MySkill` (mayúscula), `my skill` (espacio)           |
| `description`   | No puede estar vacío                                                                                         | `""` (string vacío)                                    |
| `license`       | String opcional                                                                                              | -                                                      |
| `allowed-tools` | Array de strings opcional                                                                                    | `[123]` (no es string)                                 |
| `metadata`      | Objeto key-value opcional (valores deben ser strings)                                                        | `{key: 123}` (valor no es string)                      |

**Caso Real**:

```yaml
# ❌ Error: name contiene mayúsculas
---
name: GitHelper
description: Git operations helper
---

# ✅ Correcto: cumple con las especificaciones
---
name: git-helper
description: Git operations helper
---
```

Si la validación falla, el plugin salta ese skill (`src/skills.ts:147-152`):

```typescript
let frontmatter: SkillFrontmatter;
try {
  frontmatter = SkillFrontmatterSchema.parse(frontmatterObj);
} catch (error) {
  return null;  // Validación fallida, saltar este skill
}
```

### 4. Seguridad de Ejecución de Scripts: Solo Ejecutar Archivos Ejecutables

**Problema**: Si el plugin ejecuta archivos arbitrarios (como archivos de configuración, documentación), podría causar consecuencias inesperadas.

**Medidas de Protección**:

Al descubrir scripts (`src/skills.ts:59-99`), el plugin solo recopila archivos con permisos de ejecución:

```typescript
async function findScripts(skillPath: string, maxDepth: number = 10): Promise<Script[]> {
  const scripts: Script[] = [];
  const skipDirs = new Set(['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']);

  // ... lógica de recorrido recursivo ...

  if (stats.isFile()) {
    // Clave: solo recopilar archivos con bits de ejecución
    if (stats.mode & 0o111) {
      scripts.push({
        relativePath: newRelPath,
        absolutePath: fullPath
      });
    }
  }
  // ...
}
```

**Características de Seguridad**:

| Mecanismo de Verificación | Función                                                                 |
| ------------------------- | ----------------------------------------------------------------------- |
| **Verificación de bit ejecutable** (`stats.mode & 0o111`) | Solo ejecuta archivos marcados explícitamente por el usuario como ejecutables, evitando ejecutar documentos o configuraciones accidentalmente |
| **Omitir directorios ocultos** (`entry.name.startsWith('.')`) | No escanea directorios ocultos como `.git`, `.vscode`, evitando escanear demasiados archivos |
| **Omitir directorios de dependencias** (`skipDirs.has(entry.name)`) | Omite `node_modules`, `__pycache__`, etc., evitando escanear dependencias de terceros |
| **Límite de profundidad de recursión** (`maxDepth: 10`) | Limita la profundidad de recursión a 10 niveles, evitando problemas de rendimiento causados por directorios profundos en skills maliciosos |

**Caso Real**:

En el directorio de skills:

```bash
my-skill/
├── SKILL.md
├── deploy.sh          # ✓ Ejecutable (reconocido como script)
├── build.sh           # ✓ Ejecutable (reconocido como script)
├── README.md          # ✗ No ejecutable (no se reconoce como script)
├── config.json        # ✗ No ejecutable (no se reconoce como script)
└── node_modules/      # ✗ Omitir (directorio de dependencias)
    └── ...           # ✗ Omitir
```

Si se llama `run_skill_script("my-skill", "README.md")`, README.md no se reconocerá como script porque no tiene permisos de ejecución (`src/skills.ts:86`), devolviendo un error de "no encontrado" (`src/tools.ts:165-177`).

## Mejores Prácticas de Seguridad

### 1. Obtener Skills de Fuentes Confiables

- ✓ Usar repositorios de skills oficiales o desarrolladores confiables
- ✓ Verificar el número de GitHub Stars y la actividad de contribuidores del skill
- ✗ No descargues ni ejecutes skills de fuentes desconocidas

### 2. Revisar el Contenido del Skill

Antes de cargar un nuevo skill, revisa rápidamente el archivo SKILL.md y los archivos de script:

```bash
# Ver la descripción y metadatos del skill
cat .opencode/skills/skill-name/SKILL.md

# Revisar el contenido de los scripts
cat .opencode/skills/skill-name/scripts/*.sh
```

Presta especial atención a:
- Si los scripts acceden a rutas sensibles del sistema (`/etc`, `~/.ssh`)
- Si los scripts instalan dependencias externas
- Si los scripts modifican la configuración del sistema

### 3. Establecer Permisos de Scripts Correctamente

Solo los archivos que necesiten ejecución explícita deben tener permisos de ejecución:

```bash
# Correcto: Agregar permiso de ejecución al script
chmod +x .opencode/skills/my-skill/tools/deploy.sh

# Correcto: Los documentos mantienen permisos por defecto (no ejecutables)
# README.md, config.json, etc. no necesitan ejecución
```

### 4. Ocultar Archivos Sensibles

No incluyas información sensible en el directorio del skill:

- ✗ Archivos `.env` (claves API)
- ✗ Archivos `.pem` (claves privadas)
- ✗ Archivos `credentials.json` (credenciales)
- ✓ Usa variables de entorno o configuración externa para gestionar datos sensibles

### 5. Los Skills a Nivel de Proyecto Anulan los de Usuario

Prioridad de descubrimiento de skills (`src/skills.ts:241-246`):

1. `.opencode/skills/` (nivel de proyecto)
2. `.claude/skills/` (nivel de proyecto, Claude)
3. `~/.config/opencode/skills/` (nivel de usuario)
4. `~/.claude/skills/` (nivel de usuario, Claude)
5. `~/.claude/plugins/cache/` (caché de plugins)
6. `~/.claude/plugins/marketplaces/` (mercado de plugins)

**Mejores Prácticas**:

- Los skills específicos del proyecto van en `.opencode/skills/`, anulando automáticamente skills de usuario con el mismo nombre
- Los skills generales van en `~/.config/opencode/skills/`, disponibles para todos los proyectos
- No se recomienda instalar globalmente skills de fuentes no confiables

## Resumen de la Lección

El plugin OpenCode Agent Skills incluye protección de seguridad multicapa:

| Mecanismo de Seguridad | Objetivo de Protección                     | Ubicación del Código |
| ---------------------- | -------------------------------------------- | -------------------- |
| Verificación de Seguridad de Rutas | Prevenir directory traversal, limitar el alcance del acceso a archivos | `utils.ts:130-133`   |
| Análisis Seguro de YAML | Prevenir que YAML malicioso ejecute código | `utils.ts:41-49`   |
| Validación con Zod Schema | Asegurar que el frontmatter de skills cumpla con las especificaciones | `skills.ts:105-114`  |
| Verificación de Ejecutabilidad de Scripts | Solo ejecutar archivos marcados explícitamente por el usuario como ejecutables | `skills.ts:86`       |
| Lógica de Omisión de Directorios | Evitar escanear directorios ocultos y de dependencias | `skills.ts:61, 70`   |

Recuerda: La seguridad es una responsabilidad compartida. El plugin proporciona mecanismos de protección, pero la decisión final está en tus manos: solo usa skills de fuentes confiables y desarrolla el hábito de revisar el código.

## Próxima Lección

> En la próxima lección aprenderemos sobre **[Mejores Prácticas para el Desarrollo de Skills](../../appendix/best-practices/)**.
>
> Verás:
> - Convenciones de nomenclatura y técnicas para escribir descripciones
> - Organización de directorios y uso de scripts
> - Mejores prácticas para Frontmatter
> - Cómo evitar errores comunes

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Mecanismo de Seguridad | Ruta del Archivo                                                                 | Número de Línea |
| ---------------------- | -------------------------------------------------------------------------------- | --------------- |
| Verificación de Seguridad de Rutas | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133) | 130-133         |
| Análisis Seguro de YAML | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L41-L56) | 41-56           |
| Validación con Zod Schema | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L105-L114) | 105-114         |
| Verificación de Ejecutabilidad de Scripts | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L86) | 86              |
| Lógica de Omisión de Directorios | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L61-L70) | 61, 70          |
| Seguridad de Rutas en Herramientas | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L101-L103) | 101-103         |

**Funciones Clave**:
- `isPathSafe(basePath, requestedPath)`: Verifica si la ruta es segura, previene directory traversal
- `parseYamlFrontmatter(text)`: Análisis seguro de YAML, usa core schema y limita recursión
- `SkillFrontmatterSchema`: Zod schema, verifica campos de frontmatter de skills
- `findScripts(skillPath, maxDepth)`: Búsqueda recursiva de scripts ejecutables, omite directorios ocultos y de dependencias

**Constantes Clave**:
- `maxAliasCount: 100`: Número máximo de alias para análisis YAML, previene ataques DoS
- `maxDepth: 10`: Profundidad máxima de recursión para descubrimiento de scripts
- `0o111`: Máscara de bits ejecutables (verifica si el archivo es ejecutable)

</details>
