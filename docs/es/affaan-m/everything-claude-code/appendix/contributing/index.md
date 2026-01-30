---
title: "Guía de Contribución: Enviar Configuración | Everything Claude Code"
sidebarTitle: "Envía tu primera configuración"
subtitle: "Guía de Contribución: Enviar Configuración"
description: "Aprende el proceso estándar para enviar configuraciones a Everything Claude Code. Domina los pasos de Fork, crear rama, seguir formatos, pruebas locales y enviar PR."
tags:
  - "contributing"
  - "agents"
  - "skills"
  - "commands"
  - "hooks"
  - "rules"
  - "mcp"
  - "github"
prerequisite:
  - "start-installation"
  - "start-quickstart"
order: 230
---

# Guía de Contribución: Cómo contribuir con configuraciones, agentes y habilidades al proyecto

## Lo que lograrás al terminar

- Entender el flujo de trabajo y las normas de contribución del proyecto
- Enviar correctamente Agents, Skills, Commands, Hooks, Rules y configuraciones MCP
- Seguir el estilo de código y las convenciones de nomenclatura
- Evitar errores comunes en las contribuciones
- Colaborar eficientemente con la comunidad a través de Pull Requests

## Tu situación actual

Quieres contribuir a Everything Claude Code, pero te encuentras con estos problemas:
- "No sé qué contenido contribuir que tenga valor"
- "No sé cómo comenzar mi primer PR"
- "No tengo claro los formatos de archivo y las convenciones de nomenclatura"
- "Me preocupa que el contenido enviado no cumpla los requisitos"

Este tutorial te proporcionará una guía completa de contribución, desde la filosofía hasta la práctica.

## Idea central

Everything Claude Code es un **recurso comunitario**, no un proyecto de una sola persona. El valor de este repositorio radica en:

1. **Validación en producción** - Todas las configuraciones han sido probadas durante más de 10 meses en entornos de producción
2. **Diseño modular** - Cada Agent, Skill y Command es un componente independiente y reutilizable
3. **Calidad primero** - La revisión de código y las auditorías de seguridad aseguran la calidad de las contribuciones
4. **Colaboración abierta** - Licencia MIT, fomentando contribuciones y personalizaciones

::: tip Por qué contribuir tiene valor
- **Compartir conocimiento**: Tu experiencia puede ayudar a otros desarrolladores
- **Impacto**: Configuraciones utilizadas por cientos/miles de personas
- **Mejora de habilidades**: Aprender la estructura del proyecto y la colaboración comunitaria
- **Construcción de red**: Conexión con Anthropic y la comunidad de Claude Code
:::

## Qué estamos buscando

### Agents

Sub-agentes especializados que manejan tareas complejas en dominios específicos:

| Tipo | Ejemplo |
|--- | ---|
| Experto en lenguaje | Revisión de código Python, Go, Rust |
| Experto en framework | Django, Rails, Laravel, Spring |
| Experto en DevOps | Kubernetes, Terraform, CI/CD |
| Experto en dominio | Pipelines ML, ingeniería de datos, móvil |

### Skills

Definiciones de flujos de trabajo y bases de conocimiento de dominio:

| Tipo | Ejemplo |
|--- | ---|
| Mejores prácticas de lenguaje | Normas de codificación Python, Go, Rust |
| Patrones de framework | Patrones de arquitectura Django, Rails, Laravel |
| Estrategias de prueba | Pruebas unitarias, pruebas de integración, pruebas E2E |
| Guías de arquitectura | Microservicios, eventos, CQRS |
| Conocimiento de dominio | ML, análisis de datos, desarrollo móvil |

### Commands

Comandos de barra diagonal que proporcionan puntos de entrada rápidos a flujos de trabajo:

| Tipo | Ejemplo |
|--- | ---|
| Comandos de despliegue | Desplegar a Vercel, Railway, AWS |
| Comandos de prueba | Ejecutar pruebas unitarias, pruebas E2E, análisis de cobertura |
| Comandos de documentación | Generar documentación API, actualizar README |
| Comandos de generación de código | Generar tipos, generar plantillas CRUD |

### Hooks

Ganchos de automatización que se activan en eventos específicos:

| Tipo | Ejemplo |
|--- | ---|
| Linting/formatting | Formateo de código, verificación de lint |
| Verificaciones de seguridad | Detección de datos sensibles, escaneo de vulnerabilidades |
| Ganchos de validación | Validación de commit de Git, verificación de PR |
| Ganchos de notificación | Notificaciones Slack/Email |

### Rules

Reglas obligatorias que aseguran estándares de calidad y seguridad del código:

| Tipo | Ejemplo |
|--- | ---|
| Reglas de seguridad | Prohibir claves codificadas, verificaciones OWASP |
| Estilo de código | Patrones inmutables, límites de tamaño de archivo |
| Requisitos de prueba | Cobertura 80%+, flujo TDD |
| Convenciones de nomenclatura | Nomenclatura de variables, nomenclatura de archivos |

### MCP Configurations

Configuraciones de servidores MCP que extienden la integración de servicios externos:

| Tipo | Ejemplo |
|--- | ---|
| Integración de base de datos | PostgreSQL, MongoDB, ClickHouse |
| Proveedores de nube | AWS, GCP, Azure |
| Herramientas de monitoreo | Datadog, New Relic, Sentry |
| Herramientas de comunicación | Slack, Discord, Email |

## Cómo contribuir

### Paso 1: Fork del proyecto

**Por qué**: Necesitas tu propia copia para hacer modificaciones sin afectar el repositorio original.

```bash
# 1. Visita https://github.com/affaan-m/everything-claude-code
# 2. Haz clic en el botón "Fork" en la esquina superior derecha
# 3. Clona tu fork
git clone https://github.com/YOUR_USERNAME/e/everything-claude-code.git
cd everything-claude-code

# 4. Agrega el repositorio upstream (para facilitar la sincronización posterior)
git remote add upstream https://github.com/affaan-m/everything-claude-code.git
```

**Deberías ver**: Directorio local `everything-claude-code` que contiene todos los archivos del proyecto.

### Paso 2: Crear rama de función

**Por qué**: Las ramas aíslan tus modificaciones para facilitar la gestión y fusión.

```bash
# Crea un nombre de rama descriptivo
git checkout -b add-python-reviewer

# O usa una nomenclatura más específica
git checkout -b feature/django-pattern-skill
git checkout -b fix/hook-tmux-reminder
```

**Convenciones de nomenclatura de ramas**:
- `feature/` - Nueva funcionalidad
- `fix/` - Corrección de bug
- `docs/` - Actualización de documentación
- `refactor/` - Refactorización de código

### Paso 3: Agregar tu contribución

****Por qué**: Colocar los archivos en el directorio correcto asegura que Claude Code los cargue correctamente.

```bash
# Selecciona el directorio según el tipo de contribución
agents/           # Nuevo Agent
skills/           # Nuevo Skill (puede ser un solo .md o un directorio)
commands/         # Nuevo comando de barra diagonal
rules/            # Nuevo archivo de reglas
hooks/            # Configuración de Hook (modifica hooks/hooks.json)
mcp-configs/      # Configuración de servidor MCP (modifica mcp-configs/mcp-servers.json)
```

::: tip Estructura de directorios
- **Archivo único**: Colócalo directamente en el directorio, como `agents/python-reviewer.md`
- **Componente complejo**: Crea un subdirectorio, como `skills/coding-standards/` (contiene múltiples archivos)
:::

### Paso 4: Seguir las convenciones de formato

#### Formato de Agent

**Por qué**: El Front Matter define los metadatos del Agent, y Claude Code depende de esta información para cargar el Agent.

```markdown
---
name: python-reviewer
description: Reviews Python code for PEP 8 compliance, type hints, and best practices
tools: Read, Grep, Glob, Bash, Write, Edit
model: sonnet
---

You are a senior Python code reviewer...

Your review should cover:
- PEP 8 style compliance
- Type hints usage
- Docstring completeness
- Security best practices
- Performance optimizations
```

**Campos obligatorios**:
- `name`: Identificador del Agent (minúsculas con guiones)
- `description`: Descripción de funcionalidad
- `tools`: Lista de herramientas permitidas (separadas por comas)
- `model`: Modelo preferido (`opus` o `sonnet`)

#### Formato de Skill

**Por qué**: Una definición clara de Skill facilita su reutilización y comprensión.

```markdown
# Python Best Practices

## When to Use

Use this skill when:
- Writing new Python code
- Reviewing Python code
- Refactoring Python modules

## How It Works

Follow these principles:

1. **Type Hints**: Always include type hints for function parameters and return values
2. **Docstrings**: Use Google style docstrings for all public functions
3. **PEP 8**: Follow PEP 8 style guide
4. **Immutability**: Prefer immutable data structures

## Examples

### Good
```python
def process_user_data(user_id: str) -> dict:
    """Process user data and return result.

    Args:
        user_id: The user ID to process

    Returns:
        A dictionary with processed data
    """
    user_data = fetch_user(user_id)
    return transform_data(user_data)
```

### Bad
```python
def process_user_data(user_id):
    user_data = fetch_user(user_id)
    return transform_data(user_data)
```
```

**Secciones recomendadas**:
- `When to Use`: Escenarios de uso
- `How It Works`: Cómo funciona
- `Examples`: Ejemplos (Good vs Bad)
- `References`: Recursos relacionados (opcional)

#### Formato de Command

**Por qué**: Una descripción clara del comando ayuda a los usuarios a entender la funcionalidad.

Front Matter (obligatorio):

```markdown
---
description: Run Python tests with coverage report
---
```

Contenido del cuerpo (opcional):

```markdown
# Test

Run tests for the current project:

Coverage requirements:
- Minimum 80% line coverage
- 100% coverage for critical paths
```

Ejemplos de comando (opcional):

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_user.py
```

**Campos obligatorios**:
- `description`: Descripción breve de funcionalidad

#### Formato de Hook

**Por qué**: Los Hooks necesitan reglas de coincidencia claras y acciones de ejecución.

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(py)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.log('Python file edited')\""
    }
  ],
  "description": "Triggered when Python files are edited"
}
```

**Campos obligatorios**:
- `matcher`: Expresión de condición de activación
- `hooks`: Array de acciones a ejecutar
- `description`: Descripción de funcionalidad del Hook

### Paso 5: Probar tu contribución

**Por qué**: Asegurar que la configuración funcione correctamente en uso real.

::: warning Importante
Antes de enviar un PR, **debes** probar la configuración en tu entorno local.
:::

**Pasos de prueba**:

```bash
# 1. Copia a tu configuración de Claude Code
cp agents/python-reviewer.md ~/.claude/agents/
cp skills/python-patterns/* ~/.claude/skills/

# 2. Prueba en Claude Code
# Inicia Claude Code y usa la nueva configuración

# 3. Verifica la funcionalidad
# - ¿El Agent puede invocarse correctamente?
# - ¿El Command puede ejecutarse correctamente?
# - ¿El Hook se activa en el momento correcto?
```

**Deberías ver**: La configuración funciona correctamente en Claude Code, sin errores o excepciones.

### Paso 6: Enviar PR

**Por qué**: Pull Request es la forma estándar de colaboración comunitaria.

```bash
# Agrega todos los cambios
git add .

# Commit (usa un mensaje de commit claro)
git commit -m "Add Python code reviewer agent

- Implements PEP 8 compliance checks
- Adds type hints validation
- Includes security best practices
- Tested on real Python projects"

# Push a tu fork
git push origin add-python-reviewer
```

**Luego crea un PR en GitHub**:

1. Visita tu repositorio fork
2. Haz clic en "Compare & pull request"
3. Completa la plantilla de PR:

```markdown
## What you added
- [ ] Description of what you added

## Why it's useful
- [ ] Why this contribution is valuable

## How you tested it
- [ ] Testing steps you performed

## Related issues
- [ ] Link to any related issues
```

**Deberías ver**: PR creado exitosamente, esperando revisión por los mantenedores.

## Principios guía

### Do (Lo que debes hacer)

✅ **Mantén las configuraciones enfocadas y modulares**
- Cada Agent/Skill debe hacer una sola cosa
- Evita mezclar funcionalidades

✅ **Incluye descripciones claras**
- Descripción precisa en Front Matter
- Comentarios de código útiles

✅ **Prueba antes de enviar**
- Verifica la configuración localmente
- Asegura que no haya errores

✅ **Sigue los patrones existentes**
- Consulta el formato de archivos existentes
- Mantén un estilo de código consistente

✅ **Documenta las dependencias**
- Lista las dependencias externas
- Explica los requisitos de instalación

### Don't (Lo que no debes hacer)

❌ **Incluir datos sensibles**
- API keys, tokens
- Rutas codificadas
- Credenciales personales

❌ **Agregar configuraciones demasiado complejas o de nicho**
- Prioriza la generalidad
- Evita el sobre-diseño

❌ **Enviar configuraciones sin probar**
- Las pruebas son obligatorias
- Proporciona pasos de prueba

❌ **Crear funcionalidades duplicadas**
- Busca configuraciones existentes
- Evita reinventar la rueda

❌ **Agregar configuraciones que dependan de servicios de pago**
- Proporciona alternativas gratuitas
- O usa herramientas de código abierto

## Convenciones de nomenclatura de archivos

**Por qué**: Una nomenclatura unificada hace el proyecto más fácil de mantener.

### Reglas de nomenclatura

| Regla | Ejemplo |
|--- | ---|
| Usa minúsculas | `python-reviewer.md` |
| Usa guiones para separar | `tdd-workflow.md` |
| Nombres descriptivos | `django-pattern-skill.md` |
| Evita nombres ambiguos | ❌ `workflow.md` → ✅ `tdd-workflow.md` |

### Principios de coincidencia

El nombre del archivo debe coincidir con el nombre del Agent/Skill/Command:

```bash
# Agent
agents/python-reviewer.md          # name: python-reviewer

# Skill
skills/django-patterns/SKILL.md    # # Django Patterns

# Command
commands/test.md                   # # Test
```

::: tip Consejos de nomenclatura
- Usa terminología de la industria (como "PEP 8", "TDD", "REST")
- Evita abreviaturas (a menos que sean abreviaturas estándar)
- Mantén conciso pero descriptivo
:::

## Lista de verificación del flujo de contribución

Antes de enviar un PR, asegúrate de cumplir las siguientes condiciones:

### Calidad de código
- [ ] Sigue el estilo de código existente
- [ ] Incluye el Front Matter necesario
- [ ] Tiene descripciones y documentación claras
- [ ] Pasa pruebas locales

### Normas de archivo
- [ ] El nombre del archivo cumple las convenciones de nomenclatura
- [ ] El archivo está en el directorio correcto
- [ ] El formato JSON es correcto (si aplica)
- [ ] Sin datos sensibles

### Calidad de PR
- [ ] El título del PR describe claramente los cambios
- [ ] La descripción del PR incluye "What", "Why", "How"
- [ ] Enlaza issues relacionados (si los hay)
- [ ] Proporciona pasos de prueba

### Normas comunitarias
- [ ] Asegura que no haya funcionalidades duplicadas
- [ ] Proporciona alternativas (si involucra servicios de pago)
- [ ] Responde a comentarios de revisión
- [ ] Mantén discusiones amigables y constructivas

## Preguntas frecuentes

### P: ¿Cómo sé qué contribuir que tenga valor?

**R**: Comienza con tus propias necesidades:
- ¿Qué problemas has encontrado recientemente?
- ¿Qué soluciones has utilizado?
- ¿Esta solución puede reutilizarse?

También puedes consultar los Issues del proyecto:
- Solicitudes de características no resueltas
- Sugerencias de mejora
- Reportes de bugs

### P: ¿Puede rechazarse una contribución?

**R**: Es posible, pero es normal. Razones comunes:
- La funcionalidad ya existe
- La configuración no cumple las normas
- Faltan pruebas
- Problemas de seguridad o privacidad

Los mantenedores proporcionarán retroalimentación detallada, puedes modificar según la retroalimentación y volver a enviar.

### P: ¿Cómo seguir el estado del PR?

**R**:
1. Consulta el estado en la página del PR de GitHub
2. Sigue los comentarios de revisión
3. Responde a la retroalimentación de los mantenedores
4. Actualiza el PR según sea necesario

### P: ¿Puedo contribuir con correcciones de bugs?

**R**: ¡Por supuesto! Las correcciones de bugs son una de las contribuciones más valiosas:
1. Busca o crea un nuevo issue en Issues
2. Fork del proyecto y corrige el bug
3. Agrega pruebas (si es necesario)
4. Envía un PR, referencia el issue en la descripción

### P: ¿Cómo mantener el fork sincronizado con upstream?

**R**:

```bash
# 1. Agrega el repositorio upstream (si aún no lo has hecho)
git remote add upstream https://github.com/affaan-m/everything-claude-code.git

# 2. Obtén actualizaciones de upstream
git fetch upstream

# 3. Fusiona actualizaciones de upstream a tu rama main
git checkout main
git merge upstream/main

# 4. Push las actualizaciones a tu fork
git push origin main

# 5. Rebase tu rama de función en la base más reciente
git checkout your-feature-branch
git rebase main
```

## Contacto

Si tienes alguna pregunta o necesitas ayuda:

- **Open an Issue**: [GitHub Issues](https://github.com/affaan-m/everything-claude-code/issues)
- **Twitter**: [@affaanmustafa](https://x.com/affaanmustafa)
- **Email**: Contacta a través de GitHub

::: tip Sugerencias para hacer preguntas
- Busca primero en Issues y Discussions existentes
- Proporciona contexto claro y pasos de reproducción
- Mantén una actitud cortés y constructiva
:::

## Resumen de esta lección

Esta lección explicó sistemáticamente el flujo de trabajo y las normas de contribución de Everything Claude Code:

**Ideas centrales**:
- Recurso comunitario, construcción conjunta
- Validación en producción, calidad primero
- Diseño modular, fácil de reutilizar
- Colaboración abierta, compartir conocimiento

**Tipos de contribución**:
- **Agents**: Sub-agentes especializados (lenguaje, framework, DevOps, expertos en dominio)
- **Skills**: Definiciones de flujos de trabajo y bases de conocimiento de dominio
- **Commands**: Comandos de barra diagonal (despliegue, pruebas, documentación, generación de código)
- **Hooks**: Ganchos de automatización (linting, verificaciones de seguridad, validación, notificaciones)
- **Rules**: Reglas obligatorias (seguridad, estilo de código, pruebas, nomenclatura)
- **MCP Configurations**: Configuraciones de servidor MCP (bases de datos, nube, monitoreo, comunicación)

**Flujo de contribución**:
1. Fork del proyecto
2. Crear rama de función
3. Agregar contenido de contribución
4. Seguir convenciones de formato
5. Pruebas locales
6. Enviar PR

**Convenciones de formato**:
- Agent: Front Matter + descripción + instrucciones
- Skill: When to Use + How It Works + Examples
- Command: Description + ejemplos de uso
- Hook: Matcher + Hooks + Description

**Principios guía**:
- **Do**: Enfocado, claro, probado, seguir patrones, documentado
- **Don't**: Datos sensibles, complejo/nicho, sin probar, duplicado, dependencias de pago

**Nomenclatura de archivos**:
- Minúsculas + guiones
- Nombres descriptivos
- Coherente con el nombre del Agent/Skill/Command

**Lista de verificación**:
- Calidad de código, normas de archivo, calidad de PR, normas comunitarias

## Próxima lección

> En la próxima lección aprenderemos **[Configuraciones de ejemplo: Configuraciones a nivel de proyecto y de usuario](../examples/)**.
>
> Aprenderás:
> - Mejores prácticas de configuración a nivel de proyecto
> - Personalización de configuración a nivel de usuario
> - Cómo personalizar configuraciones para proyectos específicos
> - Ejemplos de configuración de proyectos reales

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones del código fuente</strong></summary>

> Última actualización: 2026-01-25

| Funcionalidad | Ruta del archivo | Línea |
|--- | --- | ---|
| Guía de contribución | [`CONTRIBUTING.md`](https://github.com/affaan-m/everything-claude-code/blob/main/CONTRIBUTING.md) | 1-192 |
| Ejemplo de Agent | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | - |
| Ejemplo de Skill | [`skills/coding-standards/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/coding-standards/SKILL.md) | - |
| Ejemplo de Command | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | - |
| Configuración de Hook | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Ejemplo de Rule | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | - |
| Ejemplo de configuración MCP | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92 |
| Configuraciones de ejemplo | [`examples/CLAUDE.md`](https://github.com/affaan-m/everything-claude-code/blob/main/examples/CLAUDE.md) | - |

**Campos clave de Front Matter**:
- `name`: Identificador de Agent/Skill/Command
- `description`: Descripción de funcionalidad
- `tools`: Herramientas permitidas (Agent)
- `model`: Modelo preferido (Agent, opcional)

**Estructura de directorios clave**:
- `agents/`: 9 sub-agentes especializados
- `skills/`: 11 definiciones de flujos de trabajo
- `commands/`: 14 comandos de barra diagonal
- `rules/`: 8 conjuntos de reglas
- `hooks/`: Configuraciones de ganchos de automatización
- `mcp-configs/`: Configuraciones de servidor MCP
- `examples/`: Archivos de configuración de ejemplo

**Enlaces relacionados con contribuciones**:
- GitHub Issues: https://github.com/affaan-m/everything-claude-code/issues
- Twitter: https://x.com/affaanmustafa

</details>
