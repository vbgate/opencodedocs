---
title: "Crear Habilidades: Escribir SKILL.md | openskills"
sidebarTitle: "Escribir una Habilidad"
subtitle: "Crear Habilidades: Escribir SKILL.md"
description: "Aprenda a crear habilidades personalizadas desde cero, domine el formato SKILL.md y las especificaciones YAML frontmatter. A través de ejemplos completos y flujos de trabajo de desarrollo con enlaces simbólicos, comience rápidamente con la creación de habilidades y asegúrese de cumplir con los estándares de Anthropic."
tags:
  - "advanced"
  - "skills"
  - "authoring"
  - "SKILL.md"
prerequisite:
  - "start-quick-start"
  - "start-first-skill"
order: 4
---

# Crear Habilidades Personalizadas

## Lo Que Aprenderás

- Crear un archivo de habilidad SKILL.md completo desde cero
- Escribir YAML frontmatter que cumpla con los estándares de Anthropic
- Diseñar una estructura de directorios de habilidades razonable (references/, scripts/, assets/)
- Usar enlaces simbólicos para el desarrollo e iteración local
- Instalar y verificar habilidades personalizadas mediante el comando `openskills`

## Tu Situación Actual

Quieres que el agente de IA te ayude a resolver problemas específicos, pero no hay una solución adecuada en la biblioteca de habilidades existente. Has intentado describir repetidamente los requisitos en la conversación, pero la IA siempre olvida o no ejecuta completamente. Necesitas una forma de **encapsular conocimiento profesional** para que el agente de IA pueda reutilizarlo de manera estable y confiable.

## Cuándo Usar Esta Técnica

- **Encapsular flujos de trabajo**: Escribir pasos operativos repetitivos como habilidades para que la IA los ejecute de una vez
- **Depositar conocimiento del equipo**: Empaquetar especificaciones internas del equipo, documentación de API, scripts como habilidades para compartir con todos los miembros
- **Integración de herramientas**: Crear habilidades especializadas para herramientas específicas (como procesamiento de PDF, limpieza de datos, flujos de despliegue)
- **Desarrollo local**: Modificar y probar habilidades en tiempo real durante el desarrollo sin necesidad de reinstalar repetidamente

## 🎒 Preparación Antes de Empezar

::: warning Verificación Prerrequisitos

Antes de comenzar, asegúrate de:

- ✅ Haber instalado [OpenSkills](/es/start/installation/)
- ✅ Haber instalado y sincronizado al menos una habilidad (entender el flujo básico)
- ✅ Estar familiarizado con la sintaxis básica de Markdown

:::

## Conceptos Clave

### ¿Qué es SKILL.md?

**SKILL.md** es el formato estándar del sistema de habilidades de Anthropic. Utiliza YAML frontmatter para describir los metadatos de la habilidad y el cuerpo Markdown para proporcionar instrucciones de ejecución. Tiene tres ventajas principales:

1. **Formato unificado**: Todos los agentes (Claude Code, Cursor, Windsurf, etc.) utilizan el mismo descriptor de habilidades
2. **Carga progresiva**: Solo carga el contenido completo cuando es necesario, manteniendo el contexto de IA conciso
3. **Recursos empaquetables**: Soporta tres tipos de recursos adicionales: references/, scripts/, assets/

### Estructura Mínima vs Completa

**Estructura mínima** (adecuada para habilidades simples):
```
my-skill/
└── SKILL.md          # Solo un archivo
```

**Estructura completa** (adecuada para habilidades complejas):
```
my-skill/
├── SKILL.md          # Instrucciones principales (< 5000 palabras)
├── references/       # Documentación detallada (carga bajo demanda)
│   └── api-docs.md
├── scripts/          # Scripts ejecutables
│   └── helper.py
└── assets/           # Plantillas y archivos de salida
    └── template.json
```

::: info ¿Cuándo usar la estructura completa?

- **references/**: Cuando la documentación de API, esquema de base de datos, guías detalladas exceden 5000 palabras
- **scripts/**: Cuando se necesita ejecutar tareas determinísticas y repetibles (como transformación de datos, formateo)
- **assets/**: Cuando se necesitan plantillas de salida, imágenes, código de plantilla

:::

## Sígueme

### Paso 1: Crear el Directorio de la Habilidad

**Por qué**: Crear un directorio independiente para organizar los archivos de la habilidad

```bash
mkdir my-skill
cd my-skill
```

**Lo que deberías ver**: El directorio actual está vacío

---

### Paso 2: Escribir la Estructura Principal de SKILL.md

**Por qué**: SKILL.md debe comenzar con YAML frontmatter, definiendo los metadatos de la habilidad

Crea el archivo `SKILL.md`:

```markdown
---
name: my-skill                    # Requerido: identificador en formato kebab
description: When to use this skill.  # Requerido: 1-2 oraciones, tercera persona
---

# Título de la Habilidad

Descripción detallada de la habilidad.
```

**Puntos de verificación**:

- ✅ La primera línea es `---`
- ✅ Contiene el campo `name` (formato kebab, como `pdf-editor`, `api-client`)
- ✅ Contiene el campo `description` (1-2 oraciones, usa tercera persona)
- ✅ Después de cerrar YAML usa `---` nuevamente

::: danger Errores Comunes

| Ejemplo de Error | Corrección |
|--- | ---|
| `name: My Skill` (espacio) | Cambiar a `name: my-skill` (guion) |
| `description: You should use this for...` (segunda persona) | Cambiar a `description: Use this skill for...` (tercera persona) |
| `description` demasiado largo (más de 100 palabras) | Resumir en 1-2 oraciones |

:::

---

### Paso 3: Escribir el Contenido de Instrucciones

**Por qué**: Las instrucciones le dicen al agente de IA cómo ejecutar la tarea, deben usar forma imperativa/infinitiva

Continúa editando `SKILL.md`:

```markdown
---
name: my-skill
description: Use this skill to demonstrate how to write proper instructions.
---

# My Skill

## Cuándo Usar

Cargar esta habilidad cuando:
- Demostrar patrones de escritura de instrucciones
- Entender la forma imperativa/infinitiva
- Aprender el formato SKILL.md

## Instrucciones

Para ejecutar esta habilidad:

1. Leer la entrada del usuario
2. Procesar los datos
3. Devolver el resultado

Para información detallada, consulta references/guide.md
```

**Convenciones de Escritura**:

| ✅ Forma Correcta (imperativa/infinitiva) | ❌ Forma Incorrecta (segunda persona) |
|--- | ---|
| "Para lograr X, ejecuta Y" | "Deberías hacer X" |
| "Cargar esta habilidad cuando Z" | "Si necesitas Y" |
| "Consulta references/guide.md" | "Cuando quieras Z" |

::: tip Mantra

**Tres Principios para Escribir Instrucciones**:
1. **Comenzar con verbo**: "Crear" → "Usar" → "Devolver"
2. **Omitir "You"**: No decir "Deberías"
3. **Rutas claras**: Referenciar recursos con prefijo `references/`

:::

---

### Paso 4: Agregar Recursos Agrupados (Opcional)

**Por qué**: Cuando la habilidad requiere mucha documentación detallada o scripts ejecutables, usa recursos agrupados para mantener SKILL.md limpio

#### 4.1 Agregar references/

```bash
mkdir references
```

Crea `references/api-docs.md`:

```markdown
# Documentación de API

## Descripción General

Esta sección proporciona información detallada de la API...

## Endpoints

### GET /api/data

Devuelve datos procesados.

Respuesta:
```json
{
  "status": "success",
  "data": [...]
}
```
```

En `SKILL.md`, referencia:

```markdown
## Instrucciones

Para obtener datos:

1. Llamar al endpoint de API
2. Consultar `references/api-docs.md` para el formato detallado de respuesta
3. Procesar el resultado
```

#### 4.2 Agregar scripts/

```bash
mkdir scripts
```

Crea `scripts/process.py`:

```python
#!/usr/bin/env python3
import sys

def main():
    # Lógica de procesamiento
    print("Procesamiento completado")

if __name__ == "__main__":
    main()
```

En `SKILL.md`, referencia:

```markdown
## Instrucciones

Para procesar datos:

1. Ejecutar el script:
   ```bash
   python scripts/process.py
   ```
2. Revisar la salida
```

::: info Ventajas de scripts/

- **No cargar en contexto**: Ahorra tokens, adecuado para archivos grandes
- **Ejecutable independientemente**: El agente de IA puede llamar directamente sin cargar contenido primero
- **Adecuado para tareas determinísticas**: Transformación de datos, formateo, generación, etc.

:::

#### 4.3 Agregar assets/

```bash
mkdir assets
```

Agrega archivo de plantilla `assets/template.json`:

```json
{
  "title": "{{ title }}",
  "content": "{{ content }}"
}
```

En `SKILL.md`, referencia:

```markdown
## Instrucciones

Para generar salida:

1. Cargar la plantilla: `assets/template.json`
2. Reemplazar marcadores de posición con datos reales
3. Escribir en archivo de salida
```

---

### Paso 5: Verificar el Formato de SKILL.md

**Por qué**: Verificar el formato antes de la instalación para evitar errores durante la instalación

```bash
npx openskills install ./my-skill
```

**Lo que deberías ver**:

```
✔ Found skill: my-skill
  Description: Use this skill to demonstrate how to write proper instructions.
  Size: 1.2 KB

? Select skills to install: (Use arrow keys)
❯ ☑ my-skill
```

Selecciona la habilidad y presiona Enter, deberías ver:

```
✔ Installing my-skill...
✔ Skill installed successfully to .claude/skills/my-skill

Next steps:
  Run: npx openskills sync
  Then: Ask your AI agent to use the skill
```

::: tip Lista de Verificación

Antes de la instalación, verifica los siguientes elementos:

- [ ] SKILL.md comienza con `---`
- [ ] Contiene campos `name` y `description`
- [ ] `name` usa formato kebab (`my-skill` no `my_skill`)
- [ ] `description` es un resumen de 1-2 oraciones
- [ ] Las instrucciones usan forma imperativa/infinitiva
- [ ] Todas las referencias a `references/`, `scripts/`, `assets/` tienen rutas correctas

:::

---

### Paso 6: Sincronizar a AGENTS.md

**Por qué**: Hacer que el agente de IA sepa que esta habilidad está disponible

```bash
npx openskills sync
```

**Lo que deberías ver**:

```
✔ Found 1 skill:
  ☑ my-skill

✔ Syncing to AGENTS.md...
✔ Updated AGENTS.md successfully
```

Verifica el `AGENTS.md` generado:

```markdown
<!-- SKILLS_SYSTEM_START -->
...
<available_skills>
  <skill name="my-skill">Use this skill to demonstrate how to write proper instructions.</skill>
</available_skills>
...
<!-- SKILLS_SYSTEM_END -->
```

---

### Paso 7: Probar la Carga de la Habilidad

**Por qué**: Verificar que la habilidad puede cargarse correctamente en el contexto de IA

```bash
npx openskills read my-skill
```

**Lo que deberías ver**:

```
Loading skill: my-skill
Base directory: /path/to/project/.claude/skills/my-skill

---
name: my-skill
description: Use this skill to demonstrate how to write proper instructions.
---

# My Skill
... (contenido completo de SKILL.md)
```

## Puntos de Verificación ✅

Después de completar los pasos anteriores, deberías:

- ✅ Haber creado un directorio de habilidad que contenga SKILL.md
- ✅ SKILL.md contenga el YAML frontmatter correcto y contenido Markdown
- ✅ La habilidad se haya instalado exitosamente en `.claude/skills/`
- ✅ La habilidad se haya sincronizado a AGENTS.md
- ✅ Usar `openskills read` pueda cargar el contenido de la habilidad

## Advertencias de Errores Comunes

### Problema 1: Error de Instalación "Invalid SKILL.md (missing YAML frontmatter)"

**Causa**: SKILL.md no comienza con `---`

**Solución**: Verifica si la primera línea del archivo es `---`, no `# My Skill` u otro contenido

---

### Problema 2: El Agente de IA No Puede Reconocer la Habilidad

**Causa**: No se ejecutó `openskills sync` o AGENTS.md no se actualizó

**Solución**: Ejecuta `npx openskills sync` y verifica si AGENTS.md contiene la entrada de la habilidad

---

### Problema 3: Error de Resolución de Rutas de Recursos

**Causa**: Se usaron rutas absolutas o rutas relativas incorrectas en SKILL.md

**Solución**:
- ✅ Correcto: `references/api-docs.md` (ruta relativa)
- ❌ Incorrecto: `/path/to/skill/references/api-docs.md` (ruta absoluta)
- ❌ Incorrecto: `../other-skill/references/api-docs.md` (referencia cruzada)

---

### Problema 4: SKILL.md Demasiado Largo Causa Exceso de Tokens

**Causa**: SKILL.md excede 5000 palabras o contiene mucha documentación detallada

**Solución**: Mover el contenido detallado al directorio `references/`, referenciar en SKILL.md

## Resumen de la Lección

Los pasos principales para crear habilidades personalizadas:

1. **Crear estructura de directorios**: Estructura mínima (solo SKILL.md) o estructura completa (contiene references/, scripts/, assets/)
2. **Escribir YAML frontmatter**: Campos requeridos `name` (formato kebab) y `description` (1-2 oraciones)
3. **Escribir contenido de instrucciones**: Usar forma imperativa/infinitiva, evitar segunda persona
4. **Agregar recursos** (opcional): references/, scripts/, assets/
5. **Verificar formato**: Usar `openskills install ./my-skill` para verificar
6. **Sincronizar a AGENTS.md**: Ejecutar `openskills sync` para que el agente de IA lo sepa
7. **Probar carga**: Usar `openskills read my-skill` para verificar la carga

## Avance de la Próxima Lección

> En la próxima lección aprenderemos **[Estructura Detallada de Habilidades](../skill-structure/)**.
>
> Aprenderás:
> - Descripción completa de campos de SKILL.md
> - Mejores prácticas para references/, scripts/, assets/
> - Cómo optimizar la legibilidad y mantenibilidad de las habilidades

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Funcionalidad | Ruta del Archivo | Línea |
|--- | --- | ---|
| Validación de YAML frontmatter | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 12-14 |
| Extracción de campos YAML | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 4-7 |
| Validación de formato durante instalación | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 242, 291, 340 |
| Extracción de nombre de habilidad | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 344-345 |

**Archivos de ejemplo de habilidades**:
- [`examples/my-first-skill/SKILL.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/SKILL.md) - Ejemplo de estructura mínima
- [`examples/my-first-skill/references/skill-format.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/references/skill-format.md) - Referencia de especificaciones de formato

**Funciones clave**:
- `hasValidFrontmatter(content: string): boolean` - Verifica si SKILL.md comienza con `---`
- `extractYamlField(content: string, field: string): string` - Extrae valores de campos YAML (coincidencia no greedy)

</details>
