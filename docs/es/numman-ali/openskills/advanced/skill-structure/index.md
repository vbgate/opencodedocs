---
title: "Estructura de SKILL.md: Especificaciones y Recursos | OpenSkills"
sidebarTitle: "Entender la Estructura de Skills"
subtitle: "Estructura de SKILL.md: Especificaciones y Recursos"
description: "Domina las especificaciones completas de campos de SKILL.md, los requisitos de YAML frontmatter y el diseño de Bundled Resources. Aprende los casos de uso de references/, scripts/, assets/, guías de tamaño de archivos y mecanismos de resolución de recursos."
tags:
  - "advanced"
  - "skills"
  - "authoring"
  - "SKILL.md"
prerequisite:
  - "advanced-create-skills"
order: 5
---

# Guía Detallada de la Estructura de Skills

## Qué Aprenderás

- Comprender con precisión todos los requisitos de campos y especificaciones de formato de SKILL.md
- Dominar los principios de diseño y casos de uso de references/, scripts/, assets/
- Optimizar el uso de tokens y el rendimiento de carga de skills
- Evitar errores comunes de formato y problemas de resolución de rutas
- Utilizar la carga progresiva para mejorar la eficiencia del contexto de IA

## Tu Situación Actual

Ya has aprendido a crear skills básicos, pero aún no comprendes completamente las especificaciones completas de SKILL.md. Tus skills pueden estar enfrentando los siguientes problemas:

- SKILL.md es demasiado largo, lo que genera un consumo excesivo de tokens
- No estás seguro de qué contenido debe ir en references/ en lugar de SKILL.md
- Los agentes de IA no pueden cargar correctamente los recursos en scripts/ o assets/
- Errores de formato en YAML frontmatter causan fallas de instalación

## Cuándo Usar Esta Guía

- **Revisión de Skills**: Verificar si los skills existentes cumplen con las especificaciones de Anthropic
- **Optimización de Rendimiento**: Resolver problemas de carga lenta de skills o exceso de tokens
- **Refactorización de Recursos**: Dividir skills grandes en SKILL.md + bundled resources
- **Desarrollo de Skills Complejos**: Escribir skills completos que incluyan documentación de API y scripts ejecutables

## 🎒 Preparación Antes de Comenzar

::: warning Verificación Prerrequisito

Antes de comenzar, asegúrate de:

- ✅ Haber leído [Crear Skills Personalizados](../create-skills/)
- ✅ Haber instalado al menos un skill (conocer el flujo básico)
- ✅ Estar familiarizado con la sintaxis básica de YAML y Markdown

:::

## Conceptos Fundamentales

### Filosofía de Diseño de SKILL.md

**SKILL.md** es el núcleo del sistema de skills de Anthropic, adoptando un diseño de **carga progresiva**:

```mermaid
graph LR
    A[Metadata<br/>name + description] -->|Siempre cargado| B[Contexto]
    B -->|IA determina necesidad| C[SKILL.md<br/>Instrucciones Core]
    C -->|Referencia bajo demanda| D[Recursos<br/>references/scripts/assets]
```

**Ventajas de la Carga en Tres Capas**:

1. **Capa de Metadata**: El `name` y `description` de todos los skills siempre están en el contexto, permitiendo que la IA comprenda rápidamente los skills disponibles
2. **Capa de SKILL.md**: Solo se carga cuando es relevante, contiene instrucciones core (< 5000 palabras)
3. **Capa de Recursos**: Documentación detallada y archivos ejecutables se cargan bajo demanda, evitando desperdicio de tokens

### Clasificación de Bundled Resources

| Directorio | ¿Cargado al Contexto? | Casos de Uso | Tipos de Ejemplo |
|---|---|---|---|
| `references/` | ✅ Bajo demanda | Documentación detallada, especificaciones de API | API docs, esquema de base de datos |
| `scripts/` | ❌ No cargado | Código ejecutable | Scripts Python/Bash |
| `assets/` | ❌ No cargado | Plantillas, archivos de salida, imágenes | Plantillas JSON, código boilerplate |

## Guía Paso a Paso

### Paso 1: Comprender las Especificaciones Completas de YAML Frontmatter

**Por qué**: YAML frontmatter es el metadata del skill y debe cumplir con especificaciones estrictas

SKILL.md debe comenzar y terminar con `---`:

```yaml
---
name: my-skill
description: Use this skill when you need to demonstrate proper format.
---
```

**Campos Requeridos**:

| Campo | Tipo | Requisitos de Formato | Ejemplo |
|---|---|---|---|
| `name` | string | Formato kebab-case, sin espacios | `pdf-editor`, `api-client` |
| `description` | string | 1-2 oraciones, tercera persona | `Use this skill to edit PDF files` |

::: danger Errores Comunes

| Ejemplo de Error | Problema | Corrección |
|---|---|---|
| `name: My Skill` | Contiene espacios | Cambiar a `name: my-skill` |
| `name: my_skill` | Formato con guiones bajos | Cambiar a `name: my-skill` |
| `description: You should use this when...` | Segunda persona | Cambiar a `description: Use this skill when...` |
| `description:` demasiado larga | Más de 100 palabras | Resumir en 1-2 oraciones |
| Falta `---` final | YAML no cerrado correctamente | Agregar separador final |

:::

**Verificación del Código Fuente**: OpenSkills usa regex no greedy para validar el formato

```typescript
// src/utils/yaml.ts
export function hasValidFrontmatter(content: string): boolean {
  return content.trim().startsWith('---');
}

export function extractYamlField(content: string, field: string): string {
  const match = content.match(new RegExp(`^${field}:\\s*(.+?)$`, 'm'));
  return match ? match[1].trim() : '';
}
```

---

### Paso 2: Escribir el Cuerpo de SKILL.md (Forma Imperativa)

**Por qué**: Los agentes de IA esperan instrucciones imperativas, no descripciones conversacionales

**Formato Correcto**:

```markdown
## Instructions

To execute this task:

1. Read the input file
2. Process data using the algorithm
3. Generate output in specified format
```

**Formato Incorrecto** (evitar):

```markdown
## Instructions

You should execute this task by:

1. Reading the input file
2. Processing data using the algorithm
3. Generating output in specified format
```

**Tabla Comparativa**:

| ✅ Correcto (Imperativo/Infinitivo) | ❌ Incorrecto (Segunda Persona) |
|---|---|
| "Load this skill when X" | "If you need Y" |
| "To accomplish Z, execute A" | "You should do Z" |
| "See references/guide.md" | "When you want to Z" |

**Reglas de Escritura**:

1. **Verbo al inicio**: `Create` → `Use` → `Return`
2. **Omitir "You"**: No decir "You should"
3. **Rutas explícitas**: Usar prefijos `references/`, `scripts/`, `assets/` al referenciar recursos

---

### Paso 3: Usar references/ para Gestionar Documentación Detallada

**Por qué**: Mantener SKILL.md conciso, documentación detallada cargada bajo demanda

**Casos de Uso Aplicables**:

- Documentación de API (especificaciones de endpoint de más de 500 palabras)
- Esquema de base de datos (estructura de tablas, definiciones de campos)
- Guías detalladas (explicaciones de opciones de configuración, preguntas frecuentes)
- Ejemplos de código (fragmentos de código grandes)

**Estructura de Directorios**:

```
my-skill/
├── SKILL.md (~2,000 palabras, instrucciones core)
└── references/
    ├── api-docs.md (documentación detallada de API)
    ├── database-schema.md (estructura de base de datos)
    └── troubleshooting.md (guía de resolución de problemas)
```

**Forma de Referencia en SKILL.md**:

```markdown
## Instructions

To interact with the API:

1. Read the request parameters
2. Call the API endpoint
3. For detailed response format, see `references/api-docs.md`
4. Parse the response
5. Handle errors (see `references/troubleshooting.md`)
```

**Ejemplo de references/api-docs.md**:

```markdown
# API Documentation

## Overview

This API provides endpoints for data processing.

## Endpoints

### POST /api/process

**Request:**
```json
{
  "input": "data to process",
  "options": {
    "format": "json"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "result": {
    "output": "processed data"
  }
}
```

**Error Codes:**
- `400`: Invalid input format
- `500`: Server error
```

::: tip Mejores Prácticas

**Recomendaciones de tamaño de archivos en references/**:
- Archivo individual: recomendado < 10,000 palabras
- Tamaño total: recomendado < 50,000 palabras (dividir en múltiples archivos)
- Nombrado: usar formato kebab-case (`api-docs.md` en lugar de `API_Docs.md`)

:::

---

### Paso 4: Usar scripts/ para Ejecutar Tareas Determinísticas

**Por qué**: Los scripts ejecutables no necesitan cargarse al contexto, adecuados para tareas repetitivas

**Casos de Uso Aplicables**:

- Transformación de datos (JSON → CSV, conversión de formatos)
- Procesamiento de archivos (compresión, descompresión, renombrado)
- Generación de código (generar código desde plantillas)
- Ejecución de pruebas (pruebas unitarias, pruebas de integración)

**Estructura de Directorios**:

```
my-skill/
├── SKILL.md
└── scripts/
    ├── process.py (script Python)
    ├── transform.sh (script Bash)
    └── validate.js (script Node.js)
```

**Forma de Referencia en SKILL.md**:

```markdown
## Instructions

To process the input data:

1. Validate the input file format
2. Execute the processing script:
```bash
python scripts/process.py --input data.json --output result.json
```
3. Verify the output file
4. If validation fails, see `scripts/validate.py` for error messages
```

**Ejemplo de scripts/process.py**:

```python
#!/usr/bin/env python3
import json
import sys

def main():
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    with open(input_file, 'r') as f:
        data = json.load(f)
    
    # Processing logic
    result = transform_data(data)
    
    with open(output_file, 'w') as f:
        json.dump(result, f, indent=2)
    
    print(f"✅ Processed {input_file} → {output_file}")

if __name__ == "__main__":
    main()
```

::: info Ventajas de scripts/

Comparado con código inline en SKILL.md:

| Característica | Código Inline | scripts/ |
|---|---|---|
| Consumo de Token | ✅ Alto | ❌ Bajo |
| Reusabilidad | ❌ Pobre | ✅ Buena |
| Testeabilidad | ❌ Difícil | ✅ Fácil |
| Límite de Complejidad | ❌ Limitado por tokens | ✅ Sin límite |

:::

---

### Paso 5: Usar assets/ para Almacenar Plantillas y Archivos de Salida

**Por qué**: Las plantillas y archivos de salida no necesitan cargarse al contexto, ahorrando tokens

**Casos de Uso Aplicables**:

- Plantillas de salida (plantillas JSON, XML, Markdown)
- Código boilerplate (scaffolding de proyectos, archivos de configuración)
- Imágenes y diagramas (diagramas de flujo, diagramas de arquitectura)
- Datos de prueba (entradas de muestra, salidas esperadas)

**Estructura de Directorios**:

```
my-skill/
├── SKILL.md
└── assets/
    ├── template.json (plantilla JSON)
    ├── boilerplate.js (código boilerplate)
    └── diagram.png (diagrama de flujo)
```

**Forma de Referencia en SKILL.md**:

```markdown
## Instructions

To generate the output file:

1. Load the template: `assets/template.json`
2. Replace placeholders with actual data
3. Write to output file
4. For boilerplate code, see `assets/boilerplate.js`
```

**Ejemplo de assets/template.json**:

```json
{
  "title": "{{ title }}",
  "description": "{{ description }}",
  "version": "{{ version }}",
  "author": "{{ author }}",
  "created_at": "{{ timestamp }}"
}
```

**Usar Plantillas en Scripts**:

```python
import json
from string import Template

def generate_output(data, template_path):
    with open(template_path, 'r') as f:
        template_str = f.read()
    
    template = Template(template_str)
    output = template.safe_substitute(data)
    
    return output
```

::: warning Notas sobre assets/

- **No cargado al contexto**: Los agentes de IA no pueden leer el contenido directamente, deben cargarse mediante scripts
- **Resolución de rutas**: Usar rutas relativas, como `assets/template.json`
- **Tamaño de archivo**: Se recomienda archivo individual < 10MB (evitar retrasos de transmisión)

:::

---

### Paso 6: Optimizar Tamaño de Archivo y Rendimiento

**Por qué**: El tamaño del archivo afecta directamente el consumo de tokens del contexto de IA y la velocidad de carga

**Guía de Tamaño de Archivos** (recomendación oficial):

| Directorio | Límite de Tamaño | Comportamiento de Carga |
|---|---|---|
| SKILL.md | < 5,000 palabras | Siempre cargado (cuando es necesario) |
| references/ | Sin límite estricto | Cargado bajo demanda |
| scripts/ | No cuenta para tokens | No cargado, solo ejecutado |
| assets/ | No cargado al contexto | No cargado, solo copiado |

**Técnicas de Optimización de Rendimiento**:

1. **Dividir references/**:
```bash
# ❌ Un solo archivo grande (20,000 palabras)
references/all-docs.md

# ✅ Dividir en múltiples archivos pequeños (< 5,000 palabras cada uno)
references/
├── api-docs.md
├── database-schema.md
└── troubleshooting.md
```

2. **Usar scripts/ para procesar datos**:
```markdown
# ❌ Código grande inline en SKILL.md (consume tokens)
## Instructions
Execute this code:
```python
# 500 líneas de código...
```

# ✅ Referenciar scripts/ (no consume tokens)
## Instructions
Execute: `python scripts/processor.py`
```

3. **Simplificar SKILL.md**:
   - Solo mantener instrucciones core y pasos
   - Mover explicaciones detalladas a `references/`
   - Usar lenguaje imperativo conciso

**Verificar Tamaño de Archivos**:

```bash
# Contar palabras en SKILL.md
wc -w my-skill/SKILL.md

# Contar palabras totales en references/
find my-skill/references -name "*.md" -exec wc -w {} + | tail -1

# Verificar tamaño de scripts/
du -sh my-skill/scripts/
```

---

### Paso 7: Comprender el Mecanismo de Resolución de Recursos

**Por qué**: Comprender las reglas de resolución de rutas para evitar errores de referencia

**Concepto de Directorio Base**:

Cuando un agente de IA carga un skill, `openskills read` muestra el directorio base:

```
Reading: my-skill
Base directory: /path/to/project/.claude/skills/my-skill
```

**Reglas de Resolución de Rutas Relativas**:

| Ruta de Referencia | Resultado de Resolución |
|---|---|
| `references/api.md` | `/base/directory/references/api.md` |
| `scripts/process.py` | `/base/directory/scripts/process.py` |
| `assets/template.json` | `/base/directory/assets/template.json` |

**Verificación del Código Fuente**:

```typescript
// src/commands/read.ts
export function readSkill(skillNames: string[] | string): void {
  const skill = findSkill(name);
  const content = readFileSync(skill.path, 'utf-8');
  
  // Mostrar directorio base para que la IA resuelva rutas relativas
  console.log(`Base directory: ${skill.baseDir}`);
  console.log(content);
}
```

::: danger Ejemplos de Errores de Ruta

| ❌ Escritura Incorrecta | Problema | ✅ Escritura Correcta |
|---|---|---|
| `/absolute/path/to/api.md` | Usa ruta absoluta | `references/api.md` |
| `../other-skill/references/api.md` | Referencia cruzada entre skills | `references/api.md` |
| `~/references/api.md` | Usa expansión de tilde | `references/api.md` |

:::

---

### Paso 8: Validar Formato del Skill

**Por qué**: Validar el formato antes de la instalación para evitar errores en tiempo de ejecución

**Usar openskills para validar**:

```bash
npx openskills install ./my-skill
```

**Deberías ver**:

```
✔ Found skill: my-skill
Description: Use this skill when you need to demonstrate proper format.
Size: 2.1 KB

? Select skills to install: (Use arrow keys)
❯ ☑ my-skill
```

**Lista de Verificación**:

- [ ] SKILL.md comienza con `---`
- [ ] Contiene campo `name` (formato kebab-case)
- [ ] Contiene campo `description` (1-2 oraciones)
- [ ] YAML termina con `---`
- [ ] Cuerpo usa forma imperativa/infinitiva
- [ ] Todas las referencias a `references/`, `scripts/`, `assets/` usan rutas relativas
- [ ] SKILL.md tiene < 5,000 palabras
- [ ] Archivos en references/ usan formato kebab-case

**Validación Manual de YAML Frontmatter**:

```bash
# Verificar si comienza con ---
head -1 my-skill/SKILL.md

# Validar campos YAML (usar yq u otras herramientas)
yq eval '.name' my-skill/SKILL.md
```

---

### Paso 9: Probar Carga del Skill

**Por qué**: Asegurar que el skill pueda cargarse correctamente en el contexto de IA

**Usar openskills read para probar**:

```bash
npx openskills read my-skill
```

**Deberías ver**:

```
Reading: my-skill
Base directory: /path/to/project/.claude/skills/my-skill

---
name: my-skill
description: Use this skill when you need to demonstrate proper format.
---

# My Skill

## Instructions

To execute this task...

## Bundled Resources

For detailed information: see `references/skill-format.md`

Skill read: my-skill
```

**Puntos de Verificación**:

- ✅ La salida contiene `Base directory` (usado para resolución de rutas)
- ✅ El contenido de SKILL.md está completo (incluyendo YAML y cuerpo)
- ✅ No hay error "Invalid SKILL.md"
- ✅ Todas las rutas de referencia se muestran correctamente

## Puntos de Verificación ✅

Después de completar los pasos anteriores, deberías:

- ✅ Comprender las especificaciones completas de campos de SKILL.md
- ✅ Dominar los casos de uso de references/, scripts/, assets/
- ✅ Ser capaz de optimizar el tamaño de archivo y rendimiento de carga de skills
- ✅ Saber cómo validar el formato del skill y probar la carga
- ✅ Comprender el mecanismo de resolución de recursos y el directorio base

## Advertencias de Problemas Comunes

### Problema 1: SKILL.md Excede 5000 Palabras Causando Exceso de Tokens

**Causa**: SKILL.md contiene demasiada documentación detallada

**Solución**:
1. Mover contenido detallado al directorio `references/`
2. Referenciar en SKILL.md: `See references/guide.md for details`
3. Usar `wc -w SKILL.md` para verificar el conteo de palabras

---

### Problema 2: Scripts en scripts/ No Se Pueden Ejecutar

**Causa**:
- El script carece de permisos de ejecución
- Se usó ruta absoluta en lugar de relativa

**Solución**:
```bash
# Agregar permisos de ejecución
chmod +x my-skill/scripts/*.sh

# Usar rutas relativas en SKILL.md
## Instructions
Execute: `python scripts/process.py` # ✅ Correcto
Execute: `/path/to/my-skill/scripts/process.py` # ❌ Incorrecto
```

---

### Problema 3: Archivos en references/ Cargados Bajo Demanda Pero IA No Puede Leerlos

**Causa**: El agente de IA no pudo resolver correctamente la ruta `references/`

**Solución**:
1. Confirmar que `openskills read` muestra `Base directory`
2. Al referenciar, especificar claramente: `See references/api-docs.md in base directory`
3. Evitar usar rutas absolutas o referencias cruzadas entre skills

---

### Problema 4: Archivos en assets/ Demasiado Grandes Causan Retrasos de Transmisión

**Causa**: assets/ almacena archivos binarios grandes (> 10MB)

**Solución**:
- Comprimir imágenes: usar PNG en lugar de BMP, optimizar calidad JPEG
- Dividir datos: dividir datasets grandes en múltiples archivos pequeños
- Usar almacenamiento externo: para archivos muy grandes, proporcionar enlaces de descarga en lugar de incluirlos directamente

---

### Problema 5: Errores de Formato en YAML Frontmatter

**Causa**:
- Falta `---` final
- Valores de campo contienen caracteres especiales (dos puntos, numeral) sin comillas

**Solución**:
```yaml
# ❌ Incorrecto: falta --- final
---
name: my-skill
description: Use this skill: for testing
# falta ---

# ✅ Correcto: cierre completo
---
name: my-skill
description: "Use this skill: for testing"
---
```

---

### Problema 6: Instrucciones Usan Segunda Persona (Second Person)

**Causa**: Uso habitual de "You should", "When you want"

**Solución**:
- Usar lenguaje imperativo comenzando con verbos
- Usar "To do X, execute Y" en lugar de "You should do Y"
- Usar "Load this skill when Z" en lugar de "If you need Z"

**Tabla de Referencia**:

| Segunda Persona (❌ Evitar) | Imperativo (✅ Recomendado) |
|---|---|
| "You should execute..." | "To execute X, run..." |
| "When you want to..." | "Load this skill when..." |
| "If you need..." | "Use X to accomplish Y" |

## Resumen de la Lección

Puntos clave sobre la estructura de skills:

1. **YAML frontmatter**: Campos requeridos `name` (formato kebab-case) y `description` (1-2 oraciones)
2. **Formato del cuerpo**: Usar forma imperativa/infinitiva, evitar segunda persona
3. **references/**: Almacenar documentación detallada, cargada bajo demanda al contexto (< 10,000 palabras/archivo)
4. **scripts/**: Almacenar scripts ejecutables, no cargados al contexto, adecuados para tareas determinísticas
5. **assets/**: Almacenar plantillas y archivos de salida, no cargados al contexto
6. **Tamaño de archivo**: SKILL.md < 5,000 palabras, references/ puede dividirse, scripts/ sin límite
7. **Resolución de rutas**: Usar rutas relativas (`references/`, `scripts/`, `assets/`), resueltas basándose en el directorio base
8. **Métodos de validación**: Usar `openskills install` para validar formato, `openskills read` para probar carga

## Próxima Lección

> La próxima lección aprenderemos **[Integración CI/CD](../ci-integration/)**.
>
> Aprenderás:
> - Cómo usar la flag `-y/--yes` en entornos CI/CD
> - Automatizar el flujo de instalación y sincronización de skills
> - Integrar OpenSkills en GitHub Actions, GitLab CI

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Función | Ruta del Archivo | Línea |
|---|---|---|
| Validación de YAML frontmatter | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 12-14 |
| Extracción de campo YAML | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 4-7 |
| Comando de lectura de skill | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts) | 1-49 |
| Salida de directorio base | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts) | 42 |
| Validación de formato al instalar | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 242, 291, 340 |

**Archivos de Ejemplo de Skills**:
- [`examples/my-first-skill/SKILL.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/SKILL.md) - Ejemplo de estructura completa
- [`examples/my-first-skill/references/skill-format.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/references/skill-format.md) - Referencia de especificaciones de formato

**Funciones Clave**:
- `hasValidFrontmatter(content: string): boolean` - Validar si SKILL.md comienza con `---`
- `extractYamlField(content: string, field: string): string` - Extraer valor de campo YAML (coincidencia no greedy)
- `readSkill(skillNames: string[] | string): void` - Leer skill a stdout (para uso de IA)

</details>
