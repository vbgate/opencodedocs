---
title: "Resolución de Problemas: Solución de Problemas Comunes | opencode-agent-skills"
subtitle: "Resolución de Problemas: Solución de Problemas Comunes"
sidebarTitle: "¿Qué hacer si encuentras problemas?"
description: "Aprende los métodos de resolución de problemas para opencode-agent-skills. Cubre 9 categorías de problemas comunes, incluyendo fallas en carga de skills, errores de ejecución de scripts y problemas de seguridad de rutas."
tags:
  - "troubleshooting"
  - "faq"
  - "resolución de problemas"
prerequisite: []
order: 1
---

# Solución de Problemas Comunes

::: info
Esta lección es adecuada para todos los usuarios que encuentran problemas de uso, ya sea que estés familiarizado o no con las funciones básicas del plugin. Si has encontrado problemas como fallas en la carga de skills, errores de ejecución de scripts o deseas aprender métodos de resolución de problemas, esta lección te ayudará a localizar y resolver rápidamente estos problemas comunes.
:::

## Lo que podrás hacer después de esta lección

- Localizar rápidamente las causas de fallas en la carga de skills
- Resolver errores de ejecución de scripts y problemas de permisos
- Comprender el principio de restricciones de seguridad de rutas
- Solucionar problemas de coincidencia semántica y carga de modelos

## Skill no encontrado en la consulta

### Síntomas
Al llamar `get_available_skills`, se retorna `No skills found matching your query`.

### Posibles causas
1. El skill no está instalado en la ruta de descubrimiento
2. El nombre del skill tiene errores ortográficos
3. El formato de SKILL.md no cumple con la especificación

### Soluciones

**Verificar si el skill está en la ruta de descubrimiento**:

El plugin busca skills en las siguientes prioridades (la primera coincidencia tiene efecto):

| Prioridad | Ruta | Tipo |
|--- | --- | ---|
| 1 | `.opencode/skills/` | Nivel de proyecto (OpenCode) |
| 2 | `.claude/skills/` | Nivel de proyecto (Claude) |
| 3 | `~/.config/opencode/skills/` | Nivel de usuario (OpenCode) |
| 4 | `~/.claude/skills/` | Nivel de usuario (Claude) |
| 5 | `~/.claude/plugins/cache/` | Caché del plugin |
| 6 | `~/.claude/plugins/marketplaces/` | Plugins instalados |

Comandos de verificación:
```bash
# Verificar skills a nivel de proyecto
ls -la .opencode/skills/
ls -la .claude/skills/

# Verificar skills a nivel de usuario
ls -la ~/.config/opencode/skills/
ls -la ~/.claude/skills/
```

**Verificar el formato de SKILL.md**:

El directorio del skill debe contener un archivo `SKILL.md`, y el formato debe cumplir con la Anthropic Skills Spec:

```yaml
---
name: skill-name
description: Descripción breve del skill
license: MIT
allowed-tools:
  - read
  - write
metadata:
  author: your-name
---

Contenido del skill...
```

Lista de verificación:
- ✅ `name` debe ser letras minúsculas, números y guiones (ej. `git-helper`)
- ✅ `description` no puede estar vacío
- ✅ El frontmatter YAML debe estar rodeado por `---`
- ✅ El contenido del skill debe seguir después del segundo `---`

**Usar coincidencia difusa**:

El plugin proporcionará sugerencias de ortografía. Por ejemplo:
```
No skills found matching "git-helper". Did you mean "git-helper-tool"?
```

Si ves una sugerencia similar, usa el nombre sugerido para volver a intentarlo.

---

## Error de skill no existe

### Síntomas
Al llamar `use_skill("skill-name")`, se retorna `Skill "skill-name" not found`.

### Posibles causas
1. El nombre del skill tiene errores ortográficos
2. El skill ha sido sobrescrito por un skill con el mismo nombre (conflicto de prioridad)
3. El directorio del skill carece de SKILL.md o tiene errores de formato

### Soluciones

**Ver todos los skills disponibles**:

```bash
Usa la herramienta get_available_skills para listar todos los skills
```

**Comprender las reglas de sobrescritura de prioridad**:

Si existen skills con el mismo nombre en múltiples rutas, solo el de **mayor prioridad** será efectivo. Por ejemplo:
- Nivel de proyecto `.opencode/skills/git-helper/` → ✅ Efectivo
- Nivel de usuario `~/.config/opencode/skills/git-helper/` → ❌ Sobrescrito

Verificar conflictos de mismo nombre:
```bash
# Buscar todos los skills con el mismo nombre
find .opencode/skills .claude/skills ~/.config/opencode/skills ~/.claude/skills \
  -name "git-helper" -type d
```

**Verificar si SKILL.md existe**:

```bash
# Entrar al directorio del skill
cd .opencode/skills/git-helper/

# Verificar SKILL.md
ls -la SKILL.md

# Verificar si el formato YAML es correcto
head -10 SKILL.md
```

---

## Falla en ejecución de script

### Síntomas
Al llamar `run_skill_script`, se retorna un error del script o código de salida no cero.

### Posibles causas
1. La ruta del script es incorrecta
2. El script no tiene permisos de ejecución
3. El script en sí tiene errores de lógica

### Soluciones

**Verificar si el script está en la lista de scripts del skill**:

Al cargar el skill, se listarán los scripts disponibles:
```
Skill loaded. Available scripts:
- tools/build.sh
- scripts/setup.js
```

Si se especifica un script inexistente al llamar:
```
Script "build.sh" not found in skill "my-skill". Available scripts: tools/build.sh, scripts/setup.js
```

**Usar la ruta relativa correcta**:

La ruta del script es relativa al directorio del skill, no incluya `/` inicial:
- ✅ Correcto: `tools/build.sh`
- ❌ Incorrecto: `/tools/build.sh`

**Otorgar permisos de ejecución al script**:

El plugin solo ejecuta archivos con bit de ejecución (`mode & 0o111`).

::: code-group

```bash [macOS/Linux]
# Otorgar permiso de ejecución
chmod +x .opencode/skills/my-skill/tools/build.sh

# Verificar permisos
ls -la .opencode/skills/my-skill/tools/build.sh
# La salida debe contener: -rwxr-xr-x
```

```powershell [Windows]
# Windows no usa bits de permisos Unix, asegúrate de que la extensión del script esté correctamente asociada
# Scripts PowerShell: .ps1
# Scripts Bash (a través de Git Bash): .sh
```

:::

**Depurar errores de ejecución del script**:

Si el script retorna un error, el plugin mostrará el código de salida y salida:
```
Script failed (exit 1): Error: Build failed at /path/to/script.js:42
```

Depuración manual:
```bash
# Entrar al directorio del skill
cd .opencode/skills/my-skill/

# Ejecutar el script directamente para ver el error detallado
./tools/build.sh
```

---

## Error de ruta insegura

### Síntomas
Al llamar `read_skill_file` o `run_skill_script`, se retorna un error de ruta insegura.

### Posibles causas
1. La ruta contiene `..` (traversal de directorio)
2. La ruta es una ruta absoluta
3. La ruta contiene caracteres no estandarizados

### Soluciones

**Comprender las reglas de seguridad de rutas**:

El plugin prohíbe acceder a archivos fuera del directorio del skill, previniendo ataques de traversal de directorio.

Ejemplos de rutas permitidas (relativas al directorio del skill):
- ✅ `docs/guide.md`
- ✅ `config/settings.json`
- ✅ `tools/setup.sh`

Ejemplos de rutas prohibidas:
- ❌ `../../../etc/passwd` (traversal de directorio)
- ❌ `/tmp/file.txt` (ruta absoluta)
- ❌ `./../other-skill/file.md` (traversal a otro directorio)

**Usar rutas relativas**:

Siempre usa rutas relativas al directorio del skill, no comiences con `/` o `../`:
```bash
# Leer documentación del skill
read_skill_file("my-skill", "docs/guide.md")

# Ejecutar script del skill
run_skill_script("my-skill", "tools/build.sh")
```

**Listar archivos disponibles**:

Si no estás seguro del nombre del archivo, primero consulta la lista de archivos del skill:
```
Después de llamar use_skill se retornará:
Available files:
- docs/guide.md
- config/settings.json
- README.md
```

---

## Falla en carga del modelo Embedding

### Síntomas
La función de coincidencia semántica no funciona, los logs muestran `Model failed to load`.

### Posibles causas
1. Problemas de conexión de red (primera descarga del modelo)
2. Archivos del modelo dañados
3. Problemas de permisos del directorio de caché

### Soluciones

**Verificar la conexión de red**:

En el primer uso, el plugin necesita descargar el modelo `all-MiniLM-L6-v2` (aproximadamente 238MB) desde Hugging Face. Asegúrate de que la red pueda acceder a Hugging Face.

**Limpiar y volver a descargar el modelo**:

El modelo se almacena en caché en `~/.cache/opencode-agent-skills/`:

```bash
# Eliminar directorio de caché
rm -rf ~/.cache/opencode-agent-skills/

# Reiniciar OpenCode, el plugin descargará automáticamente el modelo
```

**Verificar permisos del directorio de caché**:

```bash
# Ver directorio de caché
ls -la ~/.cache/opencode-agent-skills/

# Asegurar permisos de lectura/escritura
chmod -R 755 ~/.cache/opencode-agent-skills/
```

**Verificar carga del modelo manualmente**:

Si el problema persiste, puedes ver el error detallado en los logs del plugin:
```
Ver logs de OpenCode, busca "embedding" o "model"
```

---

## Falla en análisis de SKILL.md

### Síntomas
El directorio del skill existe pero no es descubierto por el plugin, o retorna error de formato al cargar.

### Posibles causas
1. Error en el formato del frontmatter YAML
2. Campos obligatorios faltantes
3. Valores de campo que no cumplen reglas de validación

### Soluciones

**Verificar formato YAML**:

La estructura de SKILL.md debe ser la siguiente:

```markdown
---
name: my-skill
description: Descripción del skill
---

Contenido del skill...
```

Errores comunes:
- ❌ Falta el separador `---`
- ❌ Sangría YAML incorrecta (YAML usa 2 espacios de sangría)
- ❌ Falta espacio después de los dos puntos

**Validar campos obligatorios**:

| Campo | Tipo | Obligatorio | Restricciones |
|--- | --- | --- | ---|
| name | string | ✅ | Letras minúsculas, números y guiones, no vacío |
| description | string | ✅ | No vacío |

**Probar validez de YAML**:

Usa herramientas en línea para validar el formato YAML:
- [YAML Lint](https://www.yamllint.com/)

O usa herramientas de línea de comandos:
```bash
# Instalar yamllint
pip install yamllint

# Validar archivo
yamllint SKILL.md
```

**Verificar área de contenido del skill**:

El contenido del skill debe seguir después del segundo `---`:

```markdown
---
name: my-skill
description: Descripción del skill
---

Aquí comienza el contenido del skill, se inyectará en el contexto del AI...
```

Si el contenido del skill está vacío, el plugin ignorará ese skill.

---

## Recomendación automática no funciona

### Síntomas
Después de enviar un mensaje relacionado, el AI no recibe la sugerencia de recomendación de skill.

### Posibles causas
1. Similitud por debajo del umbral (predeterminado 0.35)
2. La descripción del skill no es lo suficientemente detallada
3. El modelo no está cargado

### Soluciones

**Mejorar la calidad de la descripción del skill**:

Cuanto más específica sea la descripción del skill, más precisa será la coincidencia semántica.

| ❌ Mala descripción | ✅ Buena descripción |
|--- | ---|
| "Herramienta Git" | "Ayuda a ejecutar operaciones Git: crear ramas, confirmar código, fusionar PR, resolver conflictos" |
| "Asistente de pruebas" | "Genera pruebas unitarias, ejecuta suites de pruebas, analiza cobertura de pruebas, repara pruebas fallidas" |

**Invocar skill manualmente**:

Si la recomendación automática no funciona, puedes cargar manualmente:

```
Usa la herramienta use_skill("skill-name")
```

**Ajustar umbral de similitud** (avanzado):

El umbral predeterminado es 0.35, si sientes que hay pocas recomendaciones, puedes ajustarlo en el código fuente (`src/embeddings.ts:10`):

```typescript
export const SIMILARITY_THRESHOLD = 0.35; // Disminuir este valor aumentará las recomendaciones
```

::: warning
Modificar el código fuente requiere recompilar el plugin, no se recomienda para usuarios comunes.
:::

---

## Skill inválido después de compresión de contexto

### Síntomas
Después de una conversación larga, el AI parece "olvidar" el skill que ya fue cargado.

### Posibles causas
1. Versión del plugin inferior a v0.1.0
2. Inicialización de sesión no completada

### Soluciones

**Verificar versión del plugin**:

La función de recuperación de compresión es compatible con v0.1.0+. Si el plugin se instaló a través de npm, verifica la versión:

```bash
# Ver package.json en el directorio de plugins de OpenCode
cat ~/.config/opencode/plugins/opencode-agent-skills/package.json | grep version
```

**Confirmar que la inicialización de la sesión está completa**:

El plugin inyecta la lista de skills en el primer mensaje. Si la inicialización de la sesión no se completa, la recuperación de compresión puede fallar.

Síntomas:
- No se ve la lista de skills después del primer mensaje
- El AI no conoce los skills disponibles

**Reiniciar la sesión**:

Si el problema persiste, elimina la sesión actual y crea una nueva:
```
En OpenCode, elimina la sesión y comienza una nueva conversación
```

---

## Falla en búsqueda recursiva de scripts

### Síntomas
El skill contiene scripts anidados profundamente, pero no son descubiertos por el plugin.

### Posibles causas
1. Profundidad de recursión excede 10 niveles
2. El script está en un directorio oculto (comienza con `.`)
3. El script está en un directorio de dependencias (como `node_modules`)

### Soluciones

**Comprender las reglas de búsqueda recursiva**:

Cuando el plugin busca scripts recursivamente:
- Profundidad máxima: 10 niveles
- Omite directorios ocultos (nombre comienza con `.`): `.git`, `.vscode`, etc.
- Omite directorios de dependencias: `node_modules`, `__pycache__`, `vendor`, `.venv`, `venv`, `.tox`, `.nox`

**Ajustar ubicación del script**:

Si el script está en un directorio profundo, puedes:
- Promoverlo a un directorio más superficial (ej. `tools/` en lugar de `src/lib/utils/tools/`)
- Usar un enlace simbólico a la ubicación del script (sistemas Unix)

```bash
# Crear enlace simbólico
ln -s ../../../scripts/build.sh tools/build.sh
```

**Listar scripts descubiertos**:

Después de cargar el skill, el plugin retornará una lista de scripts. Si el script no está en la lista, verifica:
1. Si el archivo tiene permisos de ejecución
2. Si el directorio coincide con las reglas de omisión

---

## Resumen de esta lección

Esta lección cubre 9 categorías de problemas comunes al usar el plugin OpenCode Agent Skills:

| Tipo de problema | Puntos clave de verificación |
|--- | ---|
| Skill no encontrado en consulta | Ruta de descubrimiento, formato de SKILL.md, ortografía |
| Skill no existe | Corrección del nombre, sobrescritura de prioridad, existencia del archivo |
| Falla en ejecución de script | Ruta del script, permisos de ejecución, lógica del script |
| Ruta insegura | Rutas relativas, sin `..`, sin rutas absolutas |
| Falla en carga del modelo | Conexión de red, limpieza de caché, permisos de directorio |
| Falla en análisis | Formato YAML, campos obligatorios, contenido del skill |
| Recomendación automática no funciona | Calidad de la descripción, umbral de similitud, invocación manual |
| Inválido después de compresión de contexto | Versión del plugin, inicialización de la sesión |
| Falla en búsqueda recursiva de scripts | Límite de profundidad, reglas de omisión de directorios, permisos de ejecución |

---

## Vista previa de la próxima lección

> La próxima lección aprenderemos **[Consideraciones de Seguridad](../security-considerations/)**.
>
> Aprenderás:
> - Diseño de mecanismos de seguridad del plugin
> - Cómo escribir skills seguros
> - Principios de validación de rutas y control de permisos
> - Mejores prácticas de seguridad

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Función | Ruta del archivo | Número de línea |
|--- | --- | ---|
| Sugerencia de coincidencia difusa en consulta de skills | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L49-L59) | 49-59 |
| Manejo de error de skill no existe | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L89-L97) | 89-97 |
| Manejo de error de script no existe | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L167-L177) | 167-177 |
| Manejo de error de falla en ejecución de script | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L184-L195) | 184-195 |
| Verificación de seguridad de rutas | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133) | 130-133 |
| Manejo de error de análisis de SKILL.md | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L127-L152) | 127-152 |
| Error de falla en carga del modelo | [`src/embeddings.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/embeddings.ts#L38-L40) | 38-40 |
| Algoritmo de coincidencia difusa | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L88-L125) | 88-125 |

**Constantes clave**:
- `SIMILARITY_THRESHOLD = 0.35` (umbral de similitud): `src/embeddings.ts:10`
- `TOP_K = 5` (número de skills más similares a retornar): `src/embeddings.ts:11`

**Otros valores importantes**:
- `maxDepth = 10` (profundidad máxima de recursión, parámetro por defecto de la función findScripts): `src/skills.ts:59`
- `0.4` (umbral de coincidencia difusa, condición de retorno de la función findClosestMatch): `src/utils.ts:124`

**Funciones clave**:
- `findClosestMatch()`: Algoritmo de coincidencia difusa, usado para generar sugerencias de ortografía
- `isPathSafe()`: Verificación de seguridad de rutas, prevención de traversal de directorio
- `ensureModel()`: Asegurar que el modelo de embedding esté cargado
- `parseSkillFile()`: Analizar SKILL.md y validar el formato

</details>
