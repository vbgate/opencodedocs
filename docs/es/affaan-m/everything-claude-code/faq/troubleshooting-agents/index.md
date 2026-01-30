---
title: "Solución de Problemas de Agentes: Diagnóstico y Reparación | Everything Claude Code"
sidebarTitle: "Qué hacer si el Agent falla"
subtitle: "Solución de Problemas de Agentes: Diagnóstico y Reparación"
description: "Aprende a solucionar fallos en la invocación de agentes de Everything Claude Code. Cubre diagnósticos y soluciones para problemas comunes como agentes no cargados, errores de configuración, permisos de herramientas insuficientes, tiempos de espera de invocación, y más, ayudándote a dominar técnicas de depuración sistemáticas."
tags:
  - "agents"
  - "troubleshooting"
  - "faq"
prerequisite:
  - "platforms-agents-overview"
order: 170
---

# Solución de Fallos en Invocación de Agentes

## El Problema que Enfrentas

¿Tienes dificultades al usar Agentes? Es posible que te encuentres con las siguientes situaciones:

- Ingresas `/plan` u otros comandos, pero el Agent no se invoca
- Ves un mensaje de error: "Agent not found"
- El Agent se ejecuta con tiempo de espera o se bloquea
- La salida del Agent no cumple con las expectativas
- El Agent no funciona según las reglas

No te preocupes, estos problemas generalmente tienen soluciones claras. Esta lección te ayuda a diagnosticar y reparar sistemáticamente problemas relacionados con Agentes.

## 🎒 Preparativos Antes de Empezar

::: warning Verificación Previa
Asegúrate de haber:
1. ✅ Completado la [instalación](../../start/installation/) de Everything Claude Code
2. ✅ Entendido el [concepto de Agents](../../platforms/agents-overview/) y los 9 sub-agentes especializados
3. ✅ Intentado invocar un Agent (como `/plan`, `/tdd`, `/code-review`)
:::

---

## Problema Común 1: El Agent No se Invoca en Absoluto

### Síntoma
Ingresas `/plan` u otros comandos, pero el Agent no se activa, solo es un chat normal.

### Posibles Causas

#### Causa A: Ruta del Archivo del Agent Incorrecta

**Problema**: El archivo del Agent no está en la ubicación correcta, Claude Code no lo puede encontrar.

**Solución**:

Verifica que la ubicación del archivo del Agent sea correcta:

```bash
# Debería estar en una de las siguientes ubicaciones:
~/.claude/agents/              # Configuración a nivel de usuario (global)
.claude/agents/                 # Configuración a nivel de proyecto
```

**Método de verificación**:

```bash
# Ver configuración a nivel de usuario
ls -la ~/.claude/agents/

# Ver configuración a nivel de proyecto
ls -la .claude/agents/
```

**Deberías ver 9 archivos de Agent**:
- `planner.md`
- `architect.md`
- `tdd-guide.md`
- `code-reviewer.md`
- `security-reviewer.md`
- `build-error-resolver.md`
- `e2e-runner.md`
- `refactor-cleaner.md`
- `doc-updater.md`

**Si los archivos no existen**, cópialos desde el directorio del plugin Everything Claude Code:

```bash
# Asumiendo que el plugin está instalado en ~/.claude-plugins/
cp ~/.claude-plugins/everything-claude-code/agents/*.md ~/.claude/agents/

# O copiar desde el repositorio clonado
cp everything-claude-code/agents/*.md ~/.claude/agents/
```

#### Causa B: Archivo Command Faltante o Ruta Incorrecta

**Problema**: El archivo Command (como `plan.md` correspondiente a `/plan`) no existe o la ruta es incorrecta.

**Solución**:

Verifica la ubicación del archivo Command:

```bash
# Los Commands deberían estar en una de las siguientes ubicaciones:
~/.claude/commands/             # Configuración a nivel de usuario (global)
.claude/commands/                # Configuración a nivel de proyecto
```

**Método de verificación**:

```bash
# Ver configuración a nivel de usuario
ls -la ~/.claude/commands/

# Ver configuración a nivel de proyecto
ls -la .claude/commands/
```

**Deberías ver 14 archivos de Command**:
- `plan.md` → invoca el agent `planner`
- `tdd.md` → invoca el agent `tdd-guide`
- `code-review.md` → invoca el agent `code-reviewer`
- `build-fix.md` → invoca el agent `build-error-resolver`
- `e2e.md` → invoca el agent `e2e-runner`
- Etc...

**Si los archivos no existen**, copia los archivos Command:

```bash
cp ~/.claude-plugins/everything-claude-code/commands/*.md ~/.claude/commands/
```

#### Causa C: Plugin No Cargado Correctamente

**Problema**: Instalado a través del marketplace de plugins, pero el plugin no se cargó correctamente.

**Solución**:

Verifica la configuración del plugin en `~/.claude/settings.json`:

```bash
# Ver configuración del plugin
cat ~/.claude/settings.json | jq '.enabledPlugins'
```

**Deberías ver**:

```json
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**Si no está habilitado**, agrégalo manualmente:

```bash
# Editar settings.json
nano ~/.claude/settings.json

# Agregar o modificar el campo enabledPlugins
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**Reinicia Claude Code para que la configuración surta efecto**.

---

## Problema Común 2: Error de Invocación del Agent "Agent not found"

### Síntoma
Después de ingresar un comando, ves un mensaje de error: "Agent not found" o "Could not find agent: xxx".

### Posibles Causas

#### Causa A: Nombre del Agent en el Archivo Command No Coincide

**Problema**: El campo `invokes` en el archivo Command no coincide con el nombre del archivo del Agent.

**Solución**:

Verifica el campo `invokes` en el archivo Command:

```bash
# Ver un archivo Command
cat ~/.claude/commands/plan.md | grep -A 5 "invokes"
```

**Estructura del archivo Command** (ejemplo con `plan.md`):

```markdown
---
description: Restate requirements, assess risks, and create step-by-step implementation plan. WAIT for user CONFIRM before touching any code.
---

# Plan Command

This command invokes **planner** agent...
```

**Verificar que el archivo del Agent existe**:

El nombre del agent mencionado en el archivo Command (como `planner`) debe corresponder a un archivo: `planner.md`

```bash
# Verificar que el archivo del Agent existe
ls -la ~/.claude/agents/planner.md

# Si no existe, verificar si hay archivos con nombres similares
ls -la ~/.claude/agents/ | grep -i plan
```

**Ejemplos comunes de no coincidencia**:

| Command invokes | Nombre real del archivo Agent | Problema |
|--- | --- | ---|
| `planner` | `planner.md` | ✅ Correcto |
| `planner` | `Planner.md` | ❌ Diferencia de mayúsculas/minúsculas (sistemas Unix distinguen mayúsculas) |
| `planner` | `planner.md.backup` | ❌ Extensión de archivo incorrecta |
| `tdd-guide` | `tdd_guide.md` | ❌ Guion vs guion bajo |

#### Causa B: Nombre del Archivo del Agent Incorrecto

**Problema**: El nombre del archivo del Agent no coincide con lo esperado.

**Solución**:

Verifica todos los nombres de archivos de Agent:

```bash
# Listar todos los archivos de Agent
ls -la ~/.claude/agents/

# Los 9 archivos de Agent esperados
# planner.md
# architect.md
# tdd-guide.md
# code-reviewer.md
# security-reviewer.md
# build-error-resolver.md
# e2e-runner.md
# refactor-cleaner.md
# doc-updater.md
```

**Si el nombre del archivo es incorrecto**, renombra el archivo:

```bash
# Ejemplo: corregir nombre de archivo
cd ~/.claude/agents/
mv Planner.md planner.md
mv tdd_guide.md tdd-guide.md
```

---

## Problema Común 3: Formato Incorrecto del Front Matter del Agent

### Síntoma
El Agent se invoca, pero ves un mensaje de error: "Invalid agent metadata" o un error de formato similar.

### Posibles Causas

#### Causa A: Faltan Campos Requeridos

**Problema**: El Front Matter del Agent falta de campos requeridos (`name`, `description`, `tools`).

**Solución**:

Verifica el formato del Front Matter del Agent:

```bash
# Ver el encabezado de un archivo Agent
head -20 ~/.claude/agents/planner.md
```

**Formato correcto del Front Matter**:

```markdown
---
name: planner
description: Expert planning specialist for complex features and refactoring. Use PROACTIVELY when users request feature implementation, architectural changes, or complex refactoring. Automatically activated for planning tasks.
tools: Read, Grep, Glob
model: opus
---
```

**Campos requeridos**:
- `name`: Nombre del Agent (debe coincidir con el nombre del archivo, sin extensión)
- `description`: Descripción del Agent (usado para entender las responsabilidades del Agent)
- `tools`: Lista de herramientas permitidas (separadas por comas)

**Campos opcionales**:
- `model`: Modelo preferido (`opus` o `sonnet`)

#### Causa B: Campo Tools Incorrecto

**Problema**: El campo `tools` usa nombres de herramientas incorrectos o formato incorrecto.

**Solución**:

Verifica el campo `tools`:

```bash
# Extraer campo tools
grep "^tools:" ~/.claude/agents/*.md
```

**Nombres de herramientas permitidos** (distingue mayúsculas/minúsculas):
- `Read`
- `Write`
- `Edit`
- `Bash`
- `Grep`
- `Glob`

**Errores comunes**:

| Escritura incorrecta | Escritura correcta | Problema |
|--- | --- | ---|
| `tools: read, grep, glob` | `tools: Read, Grep, Glob` | ❌ Error de mayúsculas/minúsculas |
| `tools: Read, Grep, Glob,` | `tools: Read, Grep, Glob` | ❌ Coma al final (error de sintaxis YAML) |
| `tools: "Read, Grep, Glob"` | `tools: Read, Grep, Glob` | ❌ No necesita comillas |
| `tools: Read Grep Glob` | `tools: Read, Grep, Glob` | ❌ Faltan comas de separación |

#### Causa C: Error de Sintaxis YAML

**Problema**: Formato YAML incorrecto en el Front Matter (como sangría, comillas, caracteres especiales).

**Solución**:

Verificar formato YAML:

```bash
# Usar Python para validar YAML
python3 -c "import yaml; yaml.safe_load(open('~/.claude/agents/planner.md'))"

# O usar yamllint (requiere instalación)
pip install yamllint
yamllint ~/.claude/agents/*.md
```

**Errores comunes de YAML**:
- Sangría inconsistente (YAML es sensible a la sangría)
- Falta espacio después de dos puntos: `name:planner` → `name: planner`
- Cadenas que contienen caracteres especiales sin escapar (como dos puntos, numeral)
- Uso de tabuladores para sangría (YAML solo acepta espacios)

---

## Problema Común 4: Ejecución del Agent con Tiempo de Espera o Bloqueo

### Síntoma
El Agent comienza a ejecutarse, pero no responde durante mucho tiempo o se bloquea.

### Posibles Causas

#### Causa A: Complejidad de Tarea Demasiado Alta

**Problema**: La tarea solicitada es demasiado compleja, excediendo la capacidad de procesamiento del Agent.

**Solución**:

**Dividir la tarea en pasos más pequeños**:

```
❌ Incorrecto: pedirle al Agent que procese todo el proyecto de una vez
"Ayúdame a refactorizar todo el sistema de autenticación de usuarios, incluyendo todas las pruebas y documentación"

✅ Correcto: ejecutar paso a paso
Paso 1: /plan refactorizar sistema de autenticación de usuarios
Paso 2: /tdd implementar el primer paso (API de inicio de sesión)
Paso 3: /tdd implementar el segundo paso (API de registro)
...
```

**Usar el comando `/plan` para planificar primero**:

```
Usuario: /plan necesito refactorizar el sistema de autenticación de usuarios

Agent (planner):
# Implementation Plan: Refactor User Authentication System

## Phase 1: Audit Current Implementation
- Review existing auth code
- Identify security issues
- List dependencies

## Phase 2: Design New System
- Define authentication flow
- Choose auth method (JWT, OAuth, etc.)
- Design API endpoints

## Phase 3: Implement Core Features
[Detalles...]

**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

#### Causa B: Selección de Modelo Inapropiada

**Problema**: La tarea tiene alta complejidad, pero se usa un modelo más débil (como `sonnet` en lugar de `opus`).

**Solución**:

Verifica el campo `model` del Agent:

```bash
# Ver todos los modelos usados por los Agentes
grep "^model:" ~/.claude/agents/*.md
```

**Configuración recomendada**:
- **Tareas intensivas en razonamiento** (como `planner`, `architect`): usar `opus`
- **Generación/modificación de código** (como `tdd-guide`, `code-reviewer`): usar `opus`
- **Tareas simples** (como `refactor-cleaner`): se puede usar `sonnet`

**Modificar configuración del modelo**:

Edita el archivo del Agent:

```markdown
---
name: my-custom-agent
description: Custom agent for...
tools: Read, Write, Edit, Bash, Grep
model: opus  # Usar opus para mejorar rendimiento en tareas complejas
---
```

#### Causa C: Lectura Excesiva de Archivos

**Problema**: El Agent lee una gran cantidad de archivos, excediendo el límite de Token.

**Solución**:

**Limitar el alcance de archivos leídos por el Agent**:

```
❌ Incorrecto: dejar que el Agent lea todo el proyecto
"Lee todos los archivos en el proyecto, luego analiza la arquitectura"

✅ Correcto: especificar archivos relevantes
"Lee los archivos en el directorio src/auth/, analiza la arquitectura del sistema de autenticación"
```

**Usar patrones Glob para coincidir con precisión**:

```
Usuario: por favor ayúdame a optimizar el rendimiento

El Agent debería:
# Usar Glob para encontrar archivos clave de rendimiento
Glob pattern="**/*.{ts,tsx}" path="src/api"

# En lugar de
Glob pattern="**/*" path="."  # Leer todos los archivos
```

---

## Problema Común 5: Salida del Agent No Cumple con las Expectativas

### Síntoma
El Agent se invoca y ejecuta, pero la salida no cumple con las expectativas o la calidad no es alta.

### Posibles Causas

#### Causa A: Descripción de Tarea No Clara

**Problema**: La solicitud del usuario es vaga, el Agent no puede entender con precisión los requisitos.

**Solución**:

**Proporcionar una descripción de tarea clara y específica**:

```
❌ Incorrecto: solicitud vaga
"Ayúdame a optimizar el código"

✅ Correcto: solicitud específica
"Ayúdame a optimizar la función searchMarkets en src/api/markets.ts,
mejorar el rendimiento de consultas, el objetivo es reducir el tiempo de respuesta de 500ms a menos de 100ms"
```

**Incluir la siguiente información**:
- Archivo o nombre de función específico
- Objetivo claro (rendimiento, seguridad, legibilidad, etc.)
- Restricciones (no puede romper funcionalidad existente, debe mantener compatibilidad, etc.)

#### Causa B: Falta de Contexto

**Problema**: Al Agent le falta información de contexto necesaria, no puede tomar decisiones correctas.

**Solución**:

**Proporcionar activamente información de fondo**:

```
Usuario: por favor ayúdame a corregir el fallo de prueba

❌ Incorrecto: sin contexto
"npm test reportó un error, ayúdame a corregirlo"

✅ Correcto: proporcionar contexto completo
"Al ejecutar npm test, la prueba searchMarkets falló.
El mensaje de error es: Expected 5 but received 0.
Acabo de modificar la función vectorSearch, puede estar relacionado.
Por favor ayúdame a localizar el problema y corregirlo."
```

**Usar Skills para proporcionar conocimiento del dominio**:

Si el proyecto tiene una biblioteca de habilidades específica (`~/.claude/skills/`), el Agent cargará automáticamente el conocimiento relevante.

#### Causa C: Especialización del Agent No Adecuada

**Problema**: Se usó un Agent inadecuado para procesar la tarea.

**Solución**:

**Seleccionar el Agent correcto según el tipo de tarea**:

| Tipo de tarea | Recomendado | Command |
|--- | --- | ---|
| Implementar nueva funcionalidad | `tdd-guide` | `/tdd` |
| Planificación de funcionalidad compleja | `planner` | `/plan` |
| Revisión de código | `code-reviewer` | `/code-review` |
| Auditoría de seguridad | `security-reviewer` | Llamada manual |
| Corregir error de compilación | `build-error-resolver` | `/build-fix` |
| Prueba E2E | `e2e-runner` | `/e2e` |
| Limpieza de código muerto | `refactor-cleaner` | `/refactor-clean` |
| Actualizar documentación | `doc-updater` | `/update-docs` |
| Diseño de arquitectura del sistema | `architect` | Llamada manual |

**Ver [Resumen de Agents](../../platforms/agents-overview/) para entender las responsabilidades de cada Agent**.

---

## Problema Común 6: Permisos de Herramientas del Agent Insuficientes

### Síntoma
El Agent intenta usar una herramienta pero es rechazado, ve un error: "Tool not available: xxx".

### Posibles Causas

#### Causa A: Campo Tools Falta la Herramienta

**Problema**: El campo `tools` en el Front Matter del Agent no incluye la herramienta necesaria.

**Solución**:

Verifica el campo `tools` del Agent:

```bash
# Ver las herramientas que el Agent puede usar
grep -A 1 "^tools:" ~/.claude/agents/planner.md
```

**Si falta una herramienta**, agrégala al campo `tools`:

```markdown
---
name: my-custom-agent
description: Agent that needs to write code
tools: Read, Write, Edit, Grep, Glob  # Asegurar que incluye Write y Edit
model: opus
---
```

**Casos de uso de herramientas**:
- `Read`: Leer contenido de archivos (casi todos los Agentes lo necesitan)
- `Write`: Crear nuevos archivos
- `Edit`: Editar archivos existentes
- `Bash`: Ejecutar comandos (como ejecutar pruebas, compilar)
- `Grep`: Buscar contenido de archivos
- `Glob`: Buscar rutas de archivos

#### Causa B: Error de Ortografía del Nombre de Herramienta

**Problema**: El campo `tools` usa nombres de herramientas incorrectos.

**Solución**:

**Verificar ortografía de nombres de herramientas** (distingue mayúsculas/minúsculas):

| ✅ Correcto | ❌ Incorrecto |
|--- | ---|
| `Read` | `read`, `READ` |
| `Write` | `write`, `WRITE` |
| `Edit` | `edit`, `EDIT` |
| `Bash` | `bash`, `BASH` |
| `Grep` | `grep`, `GREP` |
| `Glob` | `glob`, `GLOB` |

---

## Problema Común 7: Agent Proactivo No se Activa Automáticamente

### Síntoma
Algunos Agentes deberían activarse automáticamente (como invocar `code-reviewer` automáticamente después de modificar código), pero no lo hacen.

### Posibles Causas

#### Causa A: Condición de Activación No Cumplida

**Problema**: La descripción del Agent marca `Use PROACTIVELY`, pero la condición de activación no se cumple.

**Solución**:

Verifica el campo `description` del Agent:

```bash
# Ver descripción del Agent
grep "^description:" ~/.claude/agents/code-reviewer.md
```

**Ejemplo (code-reviewer)**:

```markdown
description: Reviews code for quality, security, and maintainability. Use PROACTIVELY when users write or modify code.
```

**Condiciones de activación Proactiva**:
- Usuario solicita explícitamente revisión de código
- Acaba de completar escritura/modificación de código
- Antes de preparar para enviar código

**Activación manual**:

Si la activación automática no funciona, se puede invocar manualmente:

```
Usuario: por favor ayúdame a revisar el código anterior

O usar Command:
Usuario: /code-review
```

---

## Herramientas y Técnicas de Diagnóstico

### Verificar Estado de Carga de Agentes

Verifica si Claude Code cargó correctamente todos los Agentes:

```bash
# Ver registros de Claude Code (si están disponibles)
# macOS/Linux
tail -f ~/Library/Logs/claude-code/claude-code.log | grep -i agent

# Windows
Get-Content "$env:APPDATA\claude-code\logs\claude-code.log" -Wait | Select-String "agent"
```

### Probar Manualmente el Agent

Prueba manualmente la invocación del Agent en Claude Code:

```
Usuario: por favor invoca el agent planner para ayudarme a planificar una nueva funcionalidad

# Observa si el Agent se invoca correctamente
# Verifica si la salida cumple con las expectativas
```

### Verificar Formato del Front Matter

Usa Python para verificar el Front Matter de todos los Agentes:

```bash
#!/bin/bash

for file in ~/.claude/agents/*.md; do
    echo "Validating $file..."
    python3 << EOF
import yaml
import sys

try:
    with open('$file', 'r') as f:
        content = f.read()
        # Extraer front matter (entre ---)
        start = content.find('---')
        end = content.find('---', start + 3)
        if start == -1 or end == -1:
            print("Error: No front matter found")
            sys.exit(1)
        
        front_matter = content[start + 3:end].strip()
        metadata = yaml.safe_load(front_matter)
        
        # Verificar campos requeridos
        required = ['name', 'description', 'tools']
        for field in required:
            if field not in metadata:
                print(f"Error: Missing required field '{field}'")
                sys.exit(1)
        
        print("✅ Valid")
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
EOF
done
```

Guardar como `validate-agents.sh`, ejecutar:

```bash
chmod +x validate-agents.sh
./validate-agents.sh
```

---

## Punto de Control ✅

Verifica uno por uno según la siguiente lista:

- [ ] Archivos del Agent en ubicación correcta (`~/.claude/agents/` o `.claude/agents/`)
- [ ] Archivos de Command en ubicación correcta (`~/.claude/commands/` o `.claude/commands/`)
- [ ] Formato correcto del Front Matter del Agent (incluye name, description, tools)
- [ ] Campo Tools usa nombres de herramientas correctos (distingue mayúsculas/minúsculas)
- [ ] Campo `invokes` de Command coincide con nombre de archivo del Agent
- [ ] Plugin habilitado correctamente en `~/.claude/settings.json`
- [ ] Descripción de tarea clara y específica
- [ ] Seleccionado el Agent adecuado para procesar la tarea

---

## Cuándo Necesitar Ayuda

Si los métodos anteriores no pueden resolver el problema:

1. **Recopilar información de diagnóstico**:
   ```bash
   # Imprimir la siguiente información
   echo "Claude Code version: $(claude-code --version 2>/dev/null || echo 'N/A')"
   echo "Agent files:"
   ls -la ~/.claude/agents/
   echo "Command files:"
   ls -la ~/.claude/commands/
   echo "Plugin config:"
   cat ~/.claude/settings.json | jq '.enabledPlugins'
   ```

2. **Ver GitHub Issues**:
   - Visita [Everything Claude Code Issues](https://github.com/affaan-m/everything-claude-code/issues)
   - Buscar problemas similares

3. **Enviar Issue**:
   - Incluir mensaje de error completo
   - Proporcionar información de sistema operativo y versión
   - Adjuntar contenido relevante de Agent y archivos Command

---

## Resumen de esta Lección

Los fallos en invocación de Agentes generalmente tienen las siguientes causas:

| Tipo de problema | Causas comunes | Diagnóstico rápido |
|--- | --- | ---|
| **No se invoca en absoluto** | Ruta de archivo Agent/Command incorrecta, plugin no cargado | Verificar ubicación de archivos, verificar configuración del plugin |
| **Agent not found** | No coincidencia de nombres (Command invokes vs nombre de archivo) | Verificar nombre de archivo y campo invokes |
| **Error de formato** | Front Matter falta campos, error de sintaxis YAML | Verificar campos requeridos, validar formato YAML |
| **Tiempo de espera de ejecución** | Alta complejidad de tarea, selección de modelo inapropiada | Dividir tarea, usar modelo opus |
| **Salida no cumple expectativas** | Descripción de tarea no clara, falta de contexto, Agent no adecuado | Proporcionar tarea específica, seleccionar Agent correcto |
| **Permisos de herramientas insuficientes** | Campo Tools falta herramienta, error de ortografía de nombre | Verificar campo tools, validar nombres de herramientas |

Recuerda: la mayoría de los problemas pueden resolverse verificando rutas de archivos, validando formato de Front Matter, y seleccionando el Agent correcto.

---

## Próxima Lección

> En la siguiente lección aprenderemos **[Consejos de Optimización de Rendimiento](../performance-tips/)**.
>
> Aprenderás:
> - Cómo optimizar el uso de Token
> - Mejorar la velocidad de respuesta de Claude Code
> - Estrategias de gestión de ventana de contexto

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-25

| Función | Ruta del archivo | Número de línea |
|--- | --- | ---|
| Configuración del manifiesto del plugin | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |
| Planner Agent | [`agents/planner.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/planner.md) | 1-120 |
| TDD Guide Agent | [`agents/tdd-guide.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/tdd-guide.md) | 1-281 |
| Code Reviewer Agent | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-281 |
| Plan Command | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md) | 1-114 |
| TDD Command | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | 1-281 |
| Reglas de uso de Agent | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50 |

**Campos requeridos del Front Matter** (todos los archivos Agent):
- `name`: Identificador del Agent (debe coincidir con el nombre del archivo, sin extensión `.md`)
- `description`: Descripción de funcionalidad del Agent (incluye descripción de condiciones de activación)
- `tools`: Lista de herramientas permitidas (separadas por comas: `Read, Grep, Glob`)
- `model`: Modelo preferido (`opus` o `sonnet`, opcional)

**Nombres de herramientas permitidos** (distingue mayúsculas/minúsculas):
- `Read`: Leer contenido de archivos
- `Write`: Crear nuevos archivos
- `Edit`: Editar archivos existentes
- `Bash`: Ejecutar comandos
- `Grep`: Buscar contenido de archivos
- `Glob`: Buscar rutas de archivos

**Rutas de configuración clave**:
- Agents a nivel de usuario: `~/.claude/agents/`
- Commands a nivel de usuario: `~/.claude/commands/`
- Settings a nivel de usuario: `~/.claude/settings.json`
- Agents a nivel de proyecto: `.claude/agents/`
- Commands a nivel de proyecto: `.claude/commands/`

**Configuración de carga de plugins** (`~/.claude/settings.json`):
```json
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

</details>
