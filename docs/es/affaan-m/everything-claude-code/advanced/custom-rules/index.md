---
title: "Reglas Personalizadas: Define Estándares de Proyecto | Everything Claude Code"
subtitle: "Reglas Personalizadas: Define Estándares de Proyecto"
sidebarTitle: "Haz que Claude siga tus reglas"
description: "Aprende a crear archivos de Reglas personalizadas. Domina el formato de reglas, listas de verificación, reglas de seguridad y flujos de trabajo Git para que Claude siga automáticamente los estándares de tu equipo."
tags:
  - "custom-rules"
  - "project-standards"
  - "code-quality"
prerequisite:
  - "start-quick-start"
order: 130
---

# Reglas Personalizadas: Define Estándares Específicos del Proyecto

## Qué aprenderás

- Crear archivos de Reglas personalizadas para definir estándares de codificación específicos del proyecto
- Usar listas de verificación para garantizar la consistencia en la calidad del código
- Integrar estándares del equipo en el flujo de trabajo de Claude Code
- Personalizar diferentes tipos de reglas según las necesidades del proyecto

## Tu situación actual

¿Te has encontrado con estos problemas?

- Estilos de código inconsistentes entre miembros del equipo, señalando los mismos problemas repetidamente en las revisiones
- El proyecto tiene requisitos de seguridad especiales que Claude desconoce
- Verificar manualmente el cumplimiento de los estándares del equipo cada vez que escribes código
- Desear que Claude recuerde automáticamente las mejores prácticas específicas del proyecto

## Cuándo usar esta técnica

- **Al inicializar un nuevo proyecto** - Define estándares de codificación y seguridad específicos del proyecto
- **Durante la colaboración en equipo** - Unifica estilos de código y estándares de calidad
- **Después de encontrar problemas frecuentes en revisiones de código** - Convierte problemas comunes en reglas
- **Cuando el proyecto tiene necesidades especiales** - Integra estándares de la industria o reglas específicas del stack tecnológico

## Concepto central

Las Reglas son la capa de aplicación de los estándares del proyecto, haciendo que Claude siga automáticamente los estándares que defines.

### Cómo funcionan las Reglas

Los archivos de Reglas se encuentran en el directorio `rules/`. Claude Code carga automáticamente todas las reglas al inicio de la sesión. Cada vez que genera código o realiza una revisión, Claude verifica según estas reglas.

::: info Diferencia entre Rules y Skills

- **Rules**: Listas de verificación obligatorias, aplicables a todas las operaciones (como verificaciones de seguridad, estilo de código)
- **Skills**: Definiciones de flujo de trabajo y conocimiento del dominio, aplicables a tareas específicas (como flujo TDD, diseño de arquitectura)

Las Rules son restricciones de "debe cumplir", los Skills son guías de "cómo hacer".
:::

### Estructura de archivos de Rules

Cada archivo de Rule sigue un formato estándar:

```markdown
# Título de la Regla

## Categoría de la Regla
Texto de descripción de la regla...

### Lista de verificación
- [ ] Elemento de verificación 1
- [ ] Elemento de verificación 2

### Ejemplo de código
Comparación de código correcto/incorrecto...
```

## Sigue los pasos

### Paso 1: Conoce los tipos de reglas integradas

Everything Claude Code proporciona 8 conjuntos de reglas integradas. Primero, comprende sus funciones.

**Por qué**

Conocer las reglas integradas te ayuda a determinar qué necesitas personalizar, evitando reinventar la rueda.

**Ver reglas integradas**

Revisa el directorio `rules/` en el código fuente:

```bash
ls rules/
```

Verás los siguientes 8 archivos de reglas:

| Archivo de regla | Propósito | Escenario de uso |
| --- | --- | --- |
| `security.md` | Verificaciones de seguridad | Claves API, entrada de usuario, operaciones de base de datos |
| `coding-style.md` | Estilo de código | Tamaño de funciones, organización de archivos, patrones inmutables |
| `testing.md` | Requisitos de pruebas | Cobertura de pruebas, flujo TDD, tipos de pruebas |
| `performance.md` | Optimización de rendimiento | Selección de modelo, gestión de contexto, estrategias de compresión |
| `agents.md` | Uso de Agents | Cuándo usar qué agent, ejecución paralela |
| `git-workflow.md` | Flujo de trabajo Git | Formato de commits, proceso de PR, gestión de ramas |
| `patterns.md` | Patrones de diseño | Patrón Repository, formato de respuesta API, proyectos esqueleto |
| `hooks.md` | Sistema de Hooks | Tipos de hooks, permisos de auto-aceptación, TodoWrite |

**Deberías ver**:
- Cada archivo de regla tiene un título y categorización claros
- Las reglas incluyen listas de verificación y ejemplos de código
- Las reglas se aplican a escenarios específicos y necesidades técnicas

### Paso 2: Crea un archivo de regla personalizada

Crea un nuevo archivo de regla en el directorio `rules/` del proyecto.

**Por qué**

Las reglas personalizadas pueden resolver problemas específicos del proyecto, haciendo que Claude siga los estándares del equipo.

**Crear archivo de regla**

Supongamos que tu proyecto usa Next.js y Tailwind CSS, y necesitas definir estándares de componentes frontend:

```bash
# Crear archivo de regla
touch rules/frontend-conventions.md
```

**Editar archivo de regla**

Abre `rules/frontend-conventions.md` y añade el siguiente contenido:

```markdown
# Frontend Conventions

## Component Design
ALL components must follow these conventions:

### Component Structure
- Export default function component
- Use TypeScript interfaces for props
- Keep components focused (<300 lines)
- Use Tailwind utility classes, not custom CSS

### Naming Conventions
- Component files: PascalCase (UserProfile.tsx)
- Component names: PascalCase
- Props interface: `<ComponentName>Props`
- Utility functions: camelCase

### Code Example

\`\`\`typescript
// CORRECT: Following conventions
interface UserProfileProps {
  name: string
  email: string
  avatar?: string
}

export default function UserProfile({ name, email, avatar }: UserProfileProps) {
  return (
    <div className="flex items-center gap-4 p-4">
      {avatar && <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />}
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-gray-600">{email}</p>
      </div>
    </div>
  )
}
\`\`\`

\`\`\`typescript
// WRONG: Violating conventions
export const UserProfile = (props: any) => {
  return <div>...</div>  // Missing TypeScript, wrong export
}
\`\`\`

### Checklist
Before marking frontend work complete:
- [ ] Components follow PascalCase naming
- [ ] Props interfaces properly typed with TypeScript
- [ ] Components <300 lines
- [ ] Tailwind utility classes used (no custom CSS)
- [ ] Default export used
- [ ] Component file name matches component name
```

**Deberías ver**:
- El archivo de regla usa formato Markdown estándar
- Títulos y categorización claros (##)
- Comparación de ejemplos de código (CORRECT vs WRONG)
- Lista de verificación (checkbox)
- Descripción de reglas concisa y clara

### Paso 3: Define reglas personalizadas de seguridad

Si tu proyecto tiene requisitos de seguridad especiales, crea reglas de seguridad dedicadas.

**Por qué**

El `security.md` integrado contiene verificaciones de seguridad generales, pero el proyecto puede tener necesidades de seguridad específicas.

**Crear reglas de seguridad del proyecto**

Crea `rules/project-security.md`:

```markdown
# Project Security Requirements

## API Authentication
ALL API calls must include authentication:

### JWT Token Management
- Store JWT in httpOnly cookies (not localStorage)
- Validate token expiration on each request
- Refresh tokens automatically before expiration
- Include CSRF protection headers

// CORRECT: JWT in httpOnly cookie
const response = await fetch('/api/users', {
  credentials: 'include',
  headers: {
    'X-CSRF-Token': getCsrfToken()
  }
})

// WRONG: JWT in localStorage (vulnerable to XSS)
const token = localStorage.getItem('jwt')
const response = await fetch('/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

## Data Validation
ALL user inputs must be validated server-side:

import { z } from 'zod'
const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  age: z.number().int().min(18, 'Must be 18 or older')
})
const validatedData = CreateUserSchema.parse(req.body)

## Checklist
Before marking security work complete:
- [ ] API calls use httpOnly cookies for JWT
- [ ] CSRF protection enabled
- [ ] All user inputs validated server-side
- [ ] Sensitive data never logged
- [ ] Rate limiting configured on all endpoints
- [ ] Error messages don't leak sensitive information
```

**Deberías ver**:
- Las reglas están dirigidas al stack tecnológico específico del proyecto (JWT, Zod)
- Los ejemplos de código muestran implementaciones correctas e incorrectas
- La lista de verificación cubre todos los elementos de verificación de seguridad

### Paso 4: Define reglas de flujo de trabajo Git específicas del proyecto

Si el equipo tiene estándares especiales de commits Git, puedes extender `git-workflow.md` o crear reglas personalizadas.

**Por qué**

El `git-workflow.md` integrado contiene formatos básicos de commit, pero el equipo puede tener requisitos adicionales.

**Crear reglas Git**

Crea `rules/team-git-workflow.md`:

```markdown
# Team Git Workflow

## Commit Message Format
Follow Conventional Commits with team-specific conventions:

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring (no behavior change)
- `perf`: Performance improvement
- `docs`: Documentation changes
- `test`: Test updates
- `chore`: Maintenance tasks
- `team` (custom): Team-specific changes (onboarding, meetings)

### Commit Scope (REQUIRED)
Must include scope in brackets after type:

Format: 

Examples:
- feat(auth): add OAuth2 login
- fix(api): handle 404 errors
- docs(readme): update installation guide
- team(onboarding): add Claude Code setup guide

### Commit Body (Required for breaking changes)

feat(api): add rate limiting

BREAKING CHANGE: API now requires authentication for all endpoints

- Rate limit: 100 requests per minute per IP
- Retry-After header included in 429 responses

## Pull Request Requirements

### PR Checklist
Before requesting review:
- [ ] Title follows conventional commits format
- [ ] Description includes test plan
- [ ] All tests passing
- [ ] Code coverage maintained or improved
- [ ] Breaking changes documented
- [ ] Related issues linked

### PR Review Checklist
Before approving:
- [ ] Code follows project coding standards
- [ ] Security checks passed
- [ ] Test coverage >= 80%
- [ ] No TODOs or FIXMEs in production code
- [ ] Documentation updated
```


Examples:
feat(auth): add OAuth2 login
fix(api): handle 404 errors
docs(readme): update installation guide
team(onboarding): add Claude Code setup guide
```

### Commit Body (Required for breaking changes)

```
feat(api): add rate limiting

BREAKING CHANGE: API now requires authentication for all endpoints

- Rate limit: 100 requests per minute per IP
- Retry-After header included in 429 responses
```

## Pull Request Requirements

### PR Checklist

Before requesting review:
- [ ] Title follows conventional commits format
- [ ] Description includes test plan
- [ ] All tests passing
- [ ] Code coverage maintained or improved
- [ ] Breaking changes documented
- [ ] Related issues linked

### PR Review Checklist

Before approving:
- [ ] Code follows project coding standards
- [ ] Security checks passed
- [ ] Test coverage >= 80%
- [ ] No TODOs or FIXMEs in production code
- [ ] Documentation updated

## Checklist

Before marking Git work complete:
- [ ] Commit message includes type and scope
- [ ] Breaking changes documented in commit body
- [ ] PR title follows conventional commits format
- [ ] Test plan included in PR description
- [ ] Related issues linked to PR
```

**Deberías ver**:
- El formato de commit Git incluye tipos personalizados del equipo (`team`)
- Scope de commit obligatorio
- PR con lista de verificación clara
- Reglas aplicables al flujo de colaboración del equipo

### Paso 5: Verifica la carga de Rules

Después de crear las reglas, verifica que Claude Code las cargue correctamente.

**Por qué**

Asegura que el formato del archivo de reglas sea correcto y que Claude pueda leer y aplicar las reglas.

**Método de verificación**

1. Inicia una nueva sesión de Claude Code
2. Pide a Claude que verifique las reglas cargadas:
   ```
   ¿Qué archivos de Rules están cargados?
   ```

3. Prueba si las reglas están activas:
   ```
   Crea un componente React siguiendo las reglas de frontend-conventions
   ```

**Deberías ver**:
- Claude lista todas las rules cargadas (incluyendo las personalizadas)
- El código generado sigue los estándares que definiste
- Si se viola una regla, Claude sugiere correcciones

### Paso 6: Integra en el flujo de Code Review

Haz que las reglas personalizadas se verifiquen automáticamente durante las revisiones de código.

**Por qué**

Aplicar reglas automáticamente durante las revisiones de código asegura que todo el código cumpla con los estándares.

**Configura code-reviewer para referenciar reglas**

Asegúrate de que `agents/code-reviewer.md` referencie las reglas relevantes:

```markdown
---
name: code-reviewer
description: Review code for quality, security, and adherence to standards
---

When reviewing code, check these rules:

1. **Security checks** (rules/security.md)
   - No hardcoded secrets
   - All inputs validated
   - SQL injection prevention
   - XSS prevention

2. **Coding style** (rules/coding-style.md)
   - Immutability
   - File organization
   - Error handling
   - Input validation

3. **Project-specific rules**
   - Frontend conventions (rules/frontend-conventions.md)
   - Project security (rules/project-security.md)
   - Team Git workflow (rules/team-git-workflow.md)

Report findings in this format:
- CRITICAL: Must fix before merge
- HIGH: Should fix before merge
- MEDIUM: Consider fixing
- LOW: Nice to have
```

**Deberías ver**:
- El agent code-reviewer verifica todas las reglas relevantes durante la revisión
- Los informes se categorizan por severidad
- Los estándares específicos del proyecto se incluyen en el flujo de revisión

## Punto de verificación ✅

- [ ] Has creado al menos un archivo de regla personalizada
- [ ] El archivo de regla sigue el formato estándar (título, categorización, ejemplos de código, lista de verificación)
- [ ] Las reglas incluyen comparación de ejemplos de código correcto/incorrecto
- [ ] El archivo de regla está en el directorio `rules/`
- [ ] Verificaste que Claude Code carga las reglas correctamente
- [ ] El agent code-reviewer referencia las reglas personalizadas

## Errores comunes a evitar

### ❌ Error común 1: Nombres de archivo de regla no estándar

**Problema**: Los nombres de archivo de regla contienen espacios o caracteres especiales, impidiendo que Claude los cargue.

**Corrección**:
- ✅ Correcto: `frontend-conventions.md`, `project-security.md`
- ❌ Incorrecto: `Frontend Conventions.md`, `project-security(v2).md`

Usa letras minúsculas y guiones, evita espacios y paréntesis.

### ❌ Error común 2: Reglas demasiado vagas

**Problema**: Descripciones de reglas ambiguas que no permiten determinar claramente el cumplimiento.

**Corrección**: Proporciona listas de verificación específicas y ejemplos de código:

```markdown
❌ Regla vaga: Los componentes deben ser concisos y legibles

✅ Regla específica:
- Los componentes deben tener <300 líneas
- Las funciones deben tener <50 líneas
- Prohibido más de 4 niveles de anidamiento
```

### ❌ Error común 3: Falta de ejemplos de código

**Problema**: Solo descripciones de texto, sin mostrar implementaciones correctas e incorrectas.

**Corrección**: Siempre incluye comparación de ejemplos de código:

```markdown
CORRECT: Siguiendo el estándar
function example() { ... }

WRONG: Violando el estándar
function example() { ... }
```

### ❌ Error común 4: Lista de verificación incompleta

**Problema**: La lista de verificación omite elementos clave, impidiendo la ejecución completa de las reglas.

**Corrección**: Cubre todos los aspectos descritos en las reglas:

```markdown
Lista de verificación:
- [ ] Elemento de verificación 1
- [ ] Elemento de verificación 2
- [ ] ... (cubre todos los puntos de la regla)
```

## Resumen de la lección

Las Reglas personalizadas son clave para la estandarización del proyecto:

1. **Conoce las reglas integradas** - 8 conjuntos de reglas estándar cubren escenarios comunes
2. **Crea archivos de reglas** - Usa formato Markdown estándar
3. **Define estándares del proyecto** - Personaliza según el stack tecnológico y las necesidades del equipo
4. **Verifica la carga** - Asegura que Claude lea las reglas correctamente
5. **Integra en el flujo de revisión** - Haz que code-reviewer verifique las reglas automáticamente

Con las Reglas personalizadas, puedes hacer que Claude siga automáticamente los estándares del proyecto, reduciendo el trabajo de revisión de código y mejorando la consistencia de la calidad del código.

## Próxima lección

> En la próxima lección aprenderemos **[Inyección Dinámica de Contexto: Uso de Contexts](../dynamic-contexts/)**.
>
> Aprenderás:
> - Definición y propósito de Contexts
> - Cómo crear Contexts personalizados
> - Cambiar entre Contexts en diferentes modos de trabajo
> - Diferencia entre Contexts y Rules

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-25

| Funcionalidad | Ruta del archivo | Líneas |
| --- | --- | --- |
| Reglas de seguridad | [`rules/security.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/security.md) | 1-37 |
| Reglas de estilo de código | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | 1-71 |
| Reglas de pruebas | [`rules/testing.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/testing.md) | 1-31 |
| Reglas de optimización de rendimiento | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Reglas de uso de Agent | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50 |
| Reglas de flujo de trabajo Git | [`rules/git-workflow.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/git-workflow.md) | 1-46 |
| Reglas de patrones de diseño | [`rules/patterns.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/patterns.md) | 1-56 |
| Reglas del sistema de Hooks | [`rules/hooks.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/hooks.md) | 1-47 |
| Code Reviewer | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-200 |

**Constantes clave**:
- `MIN_TEST_COVERAGE = 80`: Requisito mínimo de cobertura de pruebas
- `MAX_FILE_SIZE = 800`: Límite máximo de líneas por archivo
- `MAX_FUNCTION_SIZE = 50`: Límite máximo de líneas por función
- `MAX_NESTING_LEVEL = 4`: Nivel máximo de anidamiento

**Reglas clave**:
- **Immutability (CRITICAL)**: Prohibido modificar objetos directamente, usar operador spread
- **Secret Management**: Prohibido hardcodear claves, usar variables de entorno
- **TDD Workflow**: Requiere escribir pruebas primero, implementar, luego refactorizar
- **Model Selection**: Seleccionar Haiku/Sonnet/Opus según la complejidad de la tarea

</details>
