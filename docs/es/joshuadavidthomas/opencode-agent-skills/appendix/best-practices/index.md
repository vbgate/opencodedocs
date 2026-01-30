---
title: "Mejores Prácticas: Desarrollo de Skills | opencode-agent-skills"
sidebarTitle: "Escribir Skills de Calidad"
subtitle: "Mejores Prácticas: Desarrollo de Skills"
description: "Domina las normas de desarrollo de OpenCode Agent Skills. Aprende las mejores prácticas de nomenclatura, descripciones, estructura de directorios, scripts y Frontmatter para mejorar la calidad y eficiencia de uso por IA."
tags:
  - "Mejores Prácticas"
  - "Desarrollo de Skills"
  - "Normas"
  - "Anthropic Skills"
prerequisite:
  - "creating-your-first-skill"
order: 1
---

# Mejores Prácticas para el Desarrollo de Skills

## Qué Aprenderás

Al completar este tutorial, serás capaz de:
- Escribir nombres de skills que cumplan con las convenciones de nomenclatura
- Redactar descripciones fáciles de identificar por el sistema de recomendación automática
- Organizar una estructura de directorios clara para tus skills
- Usar correctamente la funcionalidad de scripts
- Evitar errores comunes en el Frontmatter
- Mejorar la visibilidad y usabilidad de tus skills

## Por qué Necesitas Mejores Prácticas

El plugin OpenCode Agent Skills no solo almacena skills, también:
- **Descubrimiento automático**: Escanea directorios de skills desde múltiples ubicaciones
- **Coincidencia semántica**: Recomienda skills basándose en la similitud entre la descripción y el mensaje del usuario
- **Gestión de namespaces**: Soporta la coexistencia de skills de múltiples fuentes
- **Ejecución de scripts**: Escanea y ejecuta automáticamente scripts ejecutables

Seguir las mejores prácticas permite que tus skills:
- ✅ Sean correctamente identificados y cargados por el plugin
- ✅ Obtengan mayor prioridad en las recomendaciones por coincidencia semántica
- ✅ Eviten conflictos con otros skills
- ✅ Sean más fáciles de entender y usar por los miembros del equipo

---

## Convenciones de Nomenclatura

### Reglas para Nombres de Skills

Los nombres de skills deben cumplir con las siguientes normas:

::: tip Reglas de Nomenclatura
- ✅ Usar letras minúsculas, números y guiones
- ✅ Comenzar con una letra
- ✅ Usar guiones para separar palabras
- ❌ No usar letras mayúsculas ni guiones bajos
- ❌ No usar espacios ni caracteres especiales
:::

**Ejemplos**:

| ✅ Correcto | ❌ Incorrecto | Razón |
| --- | --- | --- |
| `git-helper` | `GitHelper` | Contiene letras mayúsculas |
| `docker-build` | `docker_build` | Usa guiones bajos |
| `code-review` | `code review` | Contiene espacios |
| `test-utils` | `1-test` | Comienza con un número |

**Referencia del código fuente**: `src/skills.ts:106-108`

```typescript
name: z.string()
  .regex(/^[\p{Ll}\p{N}-]+$/u, { message: "Name must be lowercase alphanumeric with hyphens" })
  .min(1, { message: "Name cannot be empty" }),
```

### Relación entre el Nombre del Directorio y el Frontmatter

El nombre del directorio del skill y el campo `name` en el frontmatter pueden ser diferentes:

```yaml
---
# El directorio es my-git-tools, pero el name en frontmatter es git-helper
name: git-helper
description: Asistente para operaciones comunes de Git
---
```

**Práctica recomendada**:
- Mantener el nombre del directorio y el campo `name` consistentes para facilitar el mantenimiento
- Usar identificadores cortos y memorables para el nombre del directorio
- El campo `name` puede describir más específicamente el propósito del skill

**Referencia del código fuente**: `src/skills.ts:155-158`

---

## Técnicas para Escribir Descripciones

### El Propósito de las Descripciones

La descripción del skill no es solo una explicación para el usuario, también se usa para:

1. **Coincidencia semántica**: El plugin calcula la similitud entre la descripción y el mensaje del usuario
2. **Recomendación de skills**: Recomienda automáticamente skills relevantes basándose en la similitud
3. **Coincidencia difusa**: Cuando el nombre del skill tiene errores ortográficos, se usa para recomendar skills similares

### Buenas vs Malas Descripciones

| ✅ Buena Descripción | ❌ Mala Descripción | Razón |
| --- | --- | --- |
| "Automatiza la gestión de ramas Git y el flujo de commits, con soporte para generación automática de mensajes de commit" | "Herramienta Git" | Demasiado vago, carece de funcionalidades específicas |
| "Genera código de cliente API con tipado seguro para proyectos Node.js" | "Una herramienta útil" | No indica el escenario de uso |
| "Traduce PDFs al chino preservando el formato original" | "Herramienta de traducción" | No menciona capacidades especiales |

### Principios para Escribir Descripciones

::: tip Principios para Escribir Descripciones
1. **Sé específico**: Indica el uso concreto y los escenarios de aplicación del skill
2. **Incluye palabras clave**: Incluye palabras clave que los usuarios podrían buscar (como "Git", "Docker", "traducción")
3. **Destaca el valor único**: Explica las ventajas de este skill sobre otros similares
4. **Evita redundancias**: No repitas el nombre del skill
:::

**Ejemplo**:

```markdown
---
name: pdf-translator
description: Traduce documentos PDF del inglés al chino, preservando el formato original, posición de imágenes y estructura de tablas. Soporta traducción por lotes y glosarios personalizados.
---
```

Esta descripción incluye:
- ✅ Funcionalidad específica (traducir PDF, preservar formato)
- ✅ Escenario de uso (documentos en inglés)
- ✅ Valor único (preservar formato, lotes, glosario)

**Referencia del código fuente**: `src/skills.ts:109`

```typescript
description: z.string()
  .min(1, { message: "Description cannot be empty" }),
```

---

## Organización de Directorios

### Estructura Básica

Un directorio de skill estándar contiene:

```
my-skill/
├── SKILL.md              # Archivo principal del skill (requerido)
├── README.md             # Documentación detallada (opcional)
├── tools/                # Scripts ejecutables (opcional)
│   ├── setup.sh
│   └── run.sh
└── docs/                 # Documentación de soporte (opcional)
    ├── guide.md
    └── examples.md
```

### Directorios Omitidos

El plugin omite automáticamente los siguientes directorios (no escanea scripts):

::: warning Directorios Omitidos Automáticamente
- `node_modules` - Dependencias de Node.js
- `__pycache__` - Caché de bytecode de Python
- `.git` - Control de versiones Git
- `.venv`, `venv` - Entornos virtuales de Python
- `.tox`, `.nox` - Entornos de prueba de Python
- Cualquier directorio oculto que comience con `.`
:::

**Referencia del código fuente**: `src/skills.ts:61`

```typescript
const skipDirs = new Set(['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']);
```

### Nombres de Directorio Recomendados

| Propósito | Nombre Recomendado | Descripción |
| --- | --- | --- |
| Archivos de scripts | `tools/` o `scripts/` | Almacena scripts ejecutables |
| Documentación | `docs/` o `examples/` | Almacena documentación auxiliar |
| Configuración | `config/` | Almacena archivos de configuración |
| Plantillas | `templates/` | Almacena archivos de plantilla |

---

## Uso de Scripts

### Reglas de Descubrimiento de Scripts

El plugin escanea automáticamente archivos ejecutables en el directorio del skill:

::: tip Reglas de Descubrimiento de Scripts
- ✅ Los scripts deben tener permisos de ejecución (`chmod +x script.sh`)
- ✅ Profundidad máxima de recursión de 10 niveles
- ✅ Omite directorios ocultos y de dependencias
- ❌ Los archivos no ejecutables no serán reconocidos como scripts
:::

**Referencia del código fuente**: `src/skills.ts:86`

```typescript
if (stats.mode & 0o111) {
  scripts.push({
    relativePath: newRelPath,
    absolutePath: fullPath
  });
}
```

### Configurar Permisos de Scripts

**Scripts Bash**:
```bash
chmod +x tools/setup.sh
chmod +x tools/run.sh
```

**Scripts Python**:
```bash
chmod +x tools/scan.py
```

Y añade el shebang al inicio del archivo:
```python
#!/usr/bin/env python3
import sys
# ...
```

### Ejemplo de Llamada a Scripts

Cuando se carga un skill, la IA verá la lista de scripts disponibles:

```
Available scripts:
- tools/setup.sh: Inicializar entorno de desarrollo
- tools/build.sh: Compilar proyecto
- tools/deploy.sh: Desplegar a producción
```

La IA puede llamar a estos scripts mediante la herramienta `run_skill_script`:

```javascript
run_skill_script({
  skill: "project-builder",
  script: "tools/build.sh",
  arguments: ["--release", "--verbose"]
})
```

---

## Mejores Prácticas de Frontmatter

### Campos Requeridos

**name**: Identificador único del skill
- Letras minúsculas, números y guiones
- Corto pero descriptivo
- Evitar nombres genéricos (como `helper`, `tool`)

**description**: Descripción del skill
- Explicar específicamente la funcionalidad
- Incluir escenarios de uso
- Longitud moderada (1-2 oraciones)

### Campos Opcionales

**license**: Información de licencia
```yaml
license: MIT
```

**allowed-tools**: Restringir las herramientas que el skill puede usar
```yaml
allowed-tools:
  - read
  - write
  - bash
```

**metadata**: Metadatos personalizados
```yaml
metadata:
  author: "Tu Nombre"
  version: "1.0.0"
  category: "development"
```

**Referencia del código fuente**: `src/skills.ts:105-114`

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

### Ejemplo Completo

```markdown
---
name: docker-deploy
description: Automatiza el proceso de construcción y despliegue de imágenes Docker, con soporte para configuración multi-entorno, health checks y rollback
license: MIT
allowed-tools:
  - read
  - write
  - bash
metadata:
  version: "2.1.0"
  author: "DevOps Team"
  category: "deployment"
---

# Despliegue Automático con Docker

Este skill te ayuda a automatizar el proceso de construcción, push y despliegue de imágenes Docker.

## Cómo Usar

...
```

---

## Evitar Errores Comunes

### Error 1: Nombre No Cumple con las Normas

**Ejemplo incorrecto**:
```yaml
name: MyAwesomeSkill  # ❌ Letras mayúsculas
```

**Corrección**:
```yaml
name: my-awesome-skill  # ✅ Letras minúsculas + guiones
```

### Error 2: Descripción Demasiado Vaga

**Ejemplo incorrecto**:
```yaml
description: "Una herramienta útil"  # ❌ Demasiado vago
```

**Corrección**:
```yaml
description: "Automatiza el flujo de commits de Git, generando automáticamente mensajes de commit que cumplen con las convenciones"  # ✅ Específico y claro
```

### Error 3: Script Sin Permisos de Ejecución

**Problema**: El script no es reconocido como ejecutable

**Solución**:
```bash
chmod +x tools/setup.sh
```

**Verificación**:
```bash
ls -l tools/setup.sh
# Debería mostrar: -rwxr-xr-x (con permiso x)
```

### Error 4: Conflicto de Nombres de Directorio

**Problema**: Múltiples skills usan el mismo nombre

**Solución**:
- Usar namespaces (mediante configuración del plugin o estructura de directorios)
- O usar nombres más descriptivos

**Referencia del código fuente**: `src/skills.ts:258-259`

```typescript
// Los skills con el mismo nombre solo conservan el primero, los siguientes se ignoran
if (skillsByName.has(skill.name)) {
  continue;
}
```

---

## Mejorar la Visibilidad

### 1. Optimizar Palabras Clave en la Descripción

Incluye en la descripción palabras clave que los usuarios podrían buscar:

```yaml
---
name: code-reviewer
description: Herramienta automatizada de revisión de código que verifica calidad del código, bugs potenciales, vulnerabilidades de seguridad y problemas de rendimiento. Soporta múltiples lenguajes incluyendo JavaScript, TypeScript y Python.
---
```

Palabras clave: revisión de código, calidad del código, bugs, vulnerabilidades de seguridad, problemas de rendimiento, JavaScript, TypeScript, Python

### 2. Usar Ubicaciones Estándar para Skills

El plugin descubre skills en el siguiente orden de prioridad:

1. `.opencode/skills/` - Nivel de proyecto (máxima prioridad)
2. `.claude/skills/` - Nivel de proyecto Claude
3. `~/.config/opencode/skills/` - Nivel de usuario
4. `~/.claude/skills/` - Nivel de usuario Claude

**Práctica recomendada**:
- Skills específicos del proyecto → colocar a nivel de proyecto
- Skills de uso general → colocar a nivel de usuario

### 3. Proporcionar Documentación Detallada

Además de SKILL.md, también puedes proporcionar:
- `README.md` - Explicación detallada y ejemplos de uso
- `docs/guide.md` - Guía completa de uso
- `docs/examples.md` - Ejemplos prácticos

---

## Resumen de la Lección

Este tutorial presentó las mejores prácticas para el desarrollo de skills:

- **Convenciones de nomenclatura**: Usar letras minúsculas, números y guiones
- **Escritura de descripciones**: Ser específico, incluir palabras clave, destacar el valor único
- **Organización de directorios**: Estructura clara, omitir directorios innecesarios
- **Uso de scripts**: Configurar permisos de ejecución, tener en cuenta el límite de profundidad
- **Normas de Frontmatter**: Completar correctamente los campos requeridos y opcionales
- **Evitar errores**: Problemas comunes y sus soluciones

Seguir estas mejores prácticas permite que tus skills:
- ✅ Sean correctamente identificados y cargados por el plugin
- ✅ Obtengan mayor prioridad en las recomendaciones por coincidencia semántica
- ✅ Eviten conflictos con otros skills
- ✅ Sean más fáciles de entender y usar por los miembros del equipo

## Próxima Lección

> En la próxima lección aprenderemos la **[Referencia de API de Herramientas](../api-reference/)**.
>
> Verás:
> - Descripción detallada de parámetros de todas las herramientas disponibles
> - Ejemplos de llamadas a herramientas y formatos de valores de retorno
> - Uso avanzado y consideraciones importantes

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para ver las ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-24

| Funcionalidad | Ruta del Archivo | Líneas |
| --- | --- | --- |
| Validación del nombre del skill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L106-L108) | 106-108 |
| Validación de la descripción del skill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L109-L110) | 109-110 |
| Definición del Schema de Frontmatter | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L105-L114) | 105-114 |
| Lista de directorios omitidos | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L61) | 61 |
| Verificación de permisos de ejecución de scripts | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L86) | 86 |
| Lógica de deduplicación de skills con mismo nombre | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L258-L259) | 258-259 |

**Constantes clave**:
- Directorios omitidos: `['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']`

**Funciones clave**:
- `findScripts(skillPath: string, maxDepth: number = 10)`: Busca recursivamente scripts ejecutables en el directorio del skill
- `parseSkillFile(skillPath: string)`: Analiza SKILL.md y valida el frontmatter

</details>
