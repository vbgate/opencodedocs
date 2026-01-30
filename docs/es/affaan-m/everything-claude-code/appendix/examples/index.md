---
title: "Configuración de Ejemplo: Nivel de Proyecto y Usuario | Everything Claude Code"
sidebarTitle: "Configuración Rápida del Proyecto"
subtitle: "Configuración de Ejemplo: Nivel de Proyecto y Usuario"
description: "Aprenda a usar los archivos de configuración de Everything Claude Code. Domine la configuración de CLAUDE.md a nivel de proyecto y configuración de usuario, jerarquía de configuración, campos clave y configuración personalizada de la barra de estado. Ajuste la configuración según proyectos frontend, backend y full-stack, y comience rápidamente con configuraciones personalizadas."
tags:
  - "examples"
  - "CLAUDE.md"
  - "statusline"
  - "configuration"
prerequisite:
  - "start-quickstart"
order: 240
---

# Configuración de Ejemplo: Nivel de Proyecto y Usuario

## Lo que podrás hacer después de esta lección

- Configurar rápidamente el archivo CLAUDE.md para tu proyecto
- Establecer configuración de usuario global para mejorar la eficiencia de desarrollo
- Personalizar la barra de estado para mostrar información clave
- Ajustar las plantillas de configuración según las necesidades del proyecto

## Tu situación actual

Al enfrentarte a los archivos de configuración de Everything Claude Code, podrías:

- **No saber por dónde empezar**: ¿Cuál es la diferencia entre la configuración de nivel de proyecto y de usuario? ¿Dónde se coloca cada una?
- **Archivos de configuración demasiado largos**: ¿Qué contenido debo escribir en CLAUDE.md? ¿Qué es obligatorio?
- **Barra de estado insuficiente**: ¿Cómo personalizar la barra de estado para mostrar más información útil?
- **No saber cómo personalizar**: ¿Cómo ajustar las configuraciones de ejemplo según las necesidades del proyecto?

Este documento proporciona ejemplos de configuración completos para ayudarte a comenzar rápidamente con Everything Claude Code.

---

## Resumen de Jerarquía de Configuración

Everything Claude Code admite dos niveles de configuración:

| Tipo de Configuración | Ubicación | Alcance | Uso Típico |
|--- | --- | --- | ---|
| **Configuración de Nivel de Proyecto** | Directorio raíz del proyecto `CLAUDE.md` | Solo el proyecto actual | Reglas específicas del proyecto, stack tecnológico, estructura de archivos |
| **Configuración de Nivel de Usuario** | `~/.claude/CLAUDE.md` | Todos los proyectos | Preferencias de codificación personal, reglas universales, configuración del editor |

::: tip Prioridad de Configuración

Cuando existen configuraciones de nivel de proyecto y de usuario simultáneamente:
- **Reglas combinadas**: Ambos conjuntos de reglas se aplicarán
- **Manejo de conflictos**: La configuración de nivel de proyecto tiene prioridad sobre la configuración de nivel de usuario
- **Práctica recomendada**: Coloca reglas generales en la configuración de usuario y reglas específicas del proyecto en la configuración de nivel de proyecto
:::

---

## 1. Ejemplo de Configuración de Nivel de Proyecto

### 1.1 Ubicación del Archivo de Configuración

Guarda el siguiente contenido en el archivo `CLAUDE.md` en el directorio raíz del proyecto:

```markdown
# Nombre del Proyecto CLAUDE.md

## Resumen del Proyecto

[Breve descripción del proyecto: qué hace, qué stack tecnológico usa]

## Reglas Críticas

### 1. Organización del Código

- Muchos archivos pequeños en lugar de pocos archivos grandes
- Alta cohesión, bajo acoplamiento
- 200-400 líneas típicas, máximo 800 por archivo
- Organizar por características/dominio, no por tipo

### 2. Estilo de Código

- Sin emojis en código, comentarios o documentación
- Inmutabilidad siempre - nunca mutar objetos o arrays
- Sin console.log en código de producción
- Manejo de errores apropiado con try/catch
- Validación de entrada con Zod o similar

### 3. Pruebas

- TDD: Escribir pruebas primero
- 80% mínimo de cobertura
- Pruebas unitarias para utilidades
- Pruebas de integración para APIs
- Pruebas E2E para flujos críticos

### 4. Seguridad

- Sin secretos en código duro
- Variables de entorno para datos sensibles
- Validar todas las entradas de usuario
- Solo consultas parametrizadas
- Protección CSRF habilitada

## Estructura de Archivos

```
src/
|---|
|---|
|---|
|---|
|---|
```

## Patrones Clave

### Formato de Respuesta de API

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

### Manejo de Errores

```typescript
try {
  const result = await operation()
  return { success: true, data: result }
} catch (error) {
  console.error('Operation failed:', error)
  return { success: false, error: 'User-friendly message' }
}
```

## Variables de Entorno

```bash
# Requeridas
DATABASE_URL=
API_KEY=

# Opcionales
DEBUG=false
```

## Comandos Disponibles

- `/tdd` - Flujo de trabajo de desarrollo guiado por pruebas
- `/plan` - Crear plan de implementación
- `/code-review` - Revisar calidad del código
- `/build-fix` - Corregir errores de compilación

## Flujo de Trabajo de Git

- Commits convencionales: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Nunca hacer commit directamente a main
- Los PRs requieren revisión
- Todas las pruebas deben pasar antes de fusionar
```

### 1.2 Explicación de Campos Clave

#### Resumen del Proyecto

Describe brevemente el proyecto para ayudar a Claude Code a entender el contexto:

```markdown
## Resumen del Proyecto

Plataforma de Mercados de Elecciones - Una plataforma de mercado de predicción para eventos políticos usando Next.js, Supabase y embeddings de OpenAI para búsqueda semántica.
```

#### Reglas Críticas

Esta es la parte más importante, define las reglas que el proyecto debe cumplir:

| Categoría de Reglas | Descripción | Obligatorio |
|--- | --- | ---|
| Organización del Código | Principios de organización de archivos | Sí |
| Estilo de Código | Estilo de codificación | Sí |
| Pruebas | Requisitos de pruebas | Sí |
| Seguridad | Normas de seguridad | Sí |

#### Patrones Clave

Define patrones comúnmente usados en el proyecto, Claude Code los aplicará automáticamente:

```markdown
## Patrones Clave

### Formato de Respuesta de API

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

### Patrón de Manejo de Errores

[código de ejemplo]
```

---

## 2. Ejemplo de Configuración de Nivel de Usuario

### 2.1 Ubicación del Archivo de Configuración

Guarda el siguiente contenido en `~/.claude/CLAUDE.md`:

```markdown
# Ejemplo de CLAUDE.md a Nivel de Usuario

Las configuraciones a nivel de usuario se aplican globalmente en todos los proyectos. Úsalo para:
- Preferencias de codificación personales
- Reglas universales que siempre quieres que se cumplan
- Enlaces a tus reglas modulares

---

## Filosofía Central

Eres Claude Code. Utilizo agentes y habilidades especializados para tareas complejas.

**Principios Clave:**
1. **Agentes Primero**: Delegar a agentes especializados para trabajo complejo
2. **Ejecución Paralela**: Usar herramienta Task con múltiples agentes cuando sea posible
3. **Planificar Antes de Ejecutar**: Usar Modo Plan para operaciones complejas
4. **Guiado por Pruebas**: Escribir pruebas antes de implementar
5. **Seguridad Primero**: Nunca comprometer la seguridad

---

## Reglas Modulares

Las pautas detalladas están en `~/.claude/rules/`:

| Archivo de Reglas | Contenido |
|--- | ---|
| security.md | Verificaciones de seguridad, gestión de secretos |
| coding-style.md | Inmutabilidad, organización de archivos, manejo de errores |
| testing.md | Flujo de trabajo TDD, requisito de 80% de cobertura |
| git-workflow.md | Formato de commit, flujo de trabajo de PR |
| agents.md | Orquestación de agentes, cuándo usar qué agente |
| patterns.md | Respuesta de API, patrones de repositorio |
| performance.md | Selección de modelos, gestión de contexto |

---

## Agentes Disponibles

Ubicados en `~/.claude/agents/`:

| Agente | Propósito |
|--- | ---|
| planner | Planificación de implementación de características |
| architect | Diseño de sistema y arquitectura |
|--- | ---|
| code-reviewer | Revisión de código para calidad/seguridad |
| security-reviewer | Análisis de vulnerabilidades de seguridad |
| build-error-resolver | Resolución de errores de compilación |
| e2e-runner | Pruebas E2E con Playwright |
| refactor-cleaner | Limpieza de código muerto |
| doc-updater | Actualizaciones de documentación |

---

## Preferencias Personales

### Estilo de Código
- Sin emojis en código, comentarios o documentación
- Preferir inmutabilidad - nunca mutar objetos o arrays
- Muchos archivos pequeños en lugar de pocos archivos grandes
- 200-400 líneas típicas, máximo 800 por archivo

### Git
- Commits convencionales: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Siempre probar localmente antes de hacer commit
- Commits pequeños y enfocados

### Pruebas
- TDD: Escribir pruebas primero
- 80% mínimo de cobertura
- Unitarias + integración + E2E para flujos críticos

---

## Integración del Editor

Uso Zed como mi editor principal:
- Panel de Agentes para seguimiento de archivos
- CMD+Shift+R para paleta de comandos
- Modo Vim habilitado

---

## Métricas de Éxito

Tienes éxito cuando:
- Todas las pruebas pasan (cobertura 80%+)
- Sin vulnerabilidades de seguridad
- El código es legible y mantenible
- Se cumplen los requisitos del usuario

---

**Filosofía**: Diseño con agentes primero, ejecución paralela, planificar antes de actuar, probar antes de codificar, seguridad siempre.
```

### 2.2 Módulos de Configuración Central

#### Filosofía Central

Define tu filosofía de colaboración con Claude Code:

```markdown
## Filosofía Central

Eres Claude Code. Utilizo agentes y habilidades especializados para tareas complejas.

**Principios Clave:**
1. **Agentes Primero**: Delegar a agentes especializados para trabajo complejo
2. **Ejecución Paralela**: Usar herramienta Task con múltiples agentes cuando sea posible
3. **Planificar Antes de Ejecutar**: Usar Modo Plan para operaciones complejas
4. **Guiado por Pruebas**: Escribir pruebas antes de implementar
5. **Seguridad Primero**: Nunca comprometer la seguridad
```

#### Reglas Modulares

Enlaza a archivos de reglas modulares para mantener la configuración limpia:

```markdown
## Reglas Modulares

Las pautas detalladas están en `~/.claude/rules/`:

| Archivo de Reglas | Contenido |
|--- | ---|
| security.md | Verificaciones de seguridad, gestión de secretos |
| coding-style.md | Inmutabilidad, organización de archivos, manejo de errores |
| testing.md | Flujo de trabajo TDD, requisito de 80% de cobertura |
| git-workflow.md | Formato de commit, flujo de trabajo de PR |
| agents.md | Orquestación de agentes, cuándo usar qué agente |
| patterns.md | Respuesta de API, patrones de repositorio |
| performance.md | Selección de modelos, gestión de contexto |
```

#### Integración del Editor

Informa a Claude Code qué editor y atajos de teclado usas:

```markdown
## Integración del Editor

Uso Zed como mi editor principal:
- Panel de Agentes para seguimiento de archivos
- CMD+Shift+R para paleta de comandos
- Modo Vim habilitado
```

---

## 3. Configuración Personalizada de la Barra de Estado

### 3.1 Ubicación del Archivo de Configuración

Agrega el siguiente contenido a `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); time=$(date +%H:%M); remaining=$(echo \"$input\" | jq -r '.context_window.remaining_percentage // empty'); transcript=$(echo \"$input\" | jq -r '.transcript_path'); todo_count=$([ -f \"$transcript\" ] && grep -c '\"type\":\"todo\"' \"$transcript\" 2>/dev/null || echo 0); cd \"$(echo \"$input\" | jq -r '.workspace.current_dir')\" 2>/dev/null; branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo ''); status=''; [ -n \"$branch\" ] && { [ -n \"$(git status --porcelain 2>/dev/null)\" ] && status='*'; }; B='\\033[38;2;30;102;245m'; G='\\033[38;2;64;160;43m'; Y='\\033[38;2;223;142;29m'; M='\\033[38;2;136;57;239m'; C='\\033[38;2;23;146;153m'; R='\\033[0m'; T='\\033[38;2;76;79;105m'; printf \"${C}${user}${R}:${B}${cwd}${R}\"; [ -n \"$branch\" ] && printf \" ${G}${branch}${Y}${status}${R}\"; [ -n \"$remaining\" ] && printf \" ${M}ctx:${remaining}%%${R}\"; printf \" ${T}${model}${R} ${Y}${time}${R}\"; [ \"$todo_count\" -gt 0 ] && printf \" ${C}todos:${todo_count}${R}\"; echo",
    "description": "Custom status line showing: user:path branch* ctx:% model time todos:N"
  }
}
```

### 3.2 Contenido de la Barra de Estado

Después de la configuración, la barra de estado mostrará:

```
affoon:~/projects/myapp main* ctx:73% sonnet-4.5 14:30 todos:3
```

| Componente | Significado | Ejemplo |
|--- | --- | ---|
| `user` | Nombre de usuario actual | `affoon` |
| `path` | Directorio actual (abreviado con ~) | `~/projects/myapp` |
| `branch*` | Rama de Git (* indica cambios no confirmados) | `main*` |
| `ctx:%` | Porcentaje restante de ventana de contexto | `ctx:73%` |
| `model` | Modelo actualmente en uso | `sonnet-4.5` |
| `time` | Hora actual | `14:30` |
| `todos:N` | Cantidad de tareas pendientes | `todos:3` |

### 3.3 Personalización de Colores

La barra de estado usa códigos de color ANSI, puedes personalizar:

| Código de Color | Variable | Uso | RGB |
|--- | --- | --- | ---|
| Azul | `B` | Ruta del directorio | 30,102,245 |
| Verde | `G` | Rama de Git | 64,160,43 |
| Amarillo | `Y` | Estado sucio, hora | 223,142,29 |
| Magenta | `M` | Contexto restante | 136,57,239 |
| Cian | `C` | Nombre de usuario, tareas | 23,146,153 |
| Gris | `T` | Nombre del modelo | 76,79,105 |

**Método para modificar colores**:

```bash
# Encontrar definición de variable de color
B='\\033[38;2;30;102;245m'  # Azul formato RGB
#                    ↓  ↓   ↓
#                   Rojo Verde Azul

# Modificar a tu color favorito
B='\\033[38;2;255;100;100m'  # Rojo
```

### 3.4 Simplificar la Barra de Estado

Si la barra de estado es demasiado larga, puedes simplificar:

```json
{
  "statusLine": {
    "type": "command",
    "command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); time=$(date +%H:%M); cd \"$(echo \"$input\" | jq -r '.workspace.current_dir')\" 2>/dev/null; branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo ''); status=''; [ -n \"$branch\" ] && { [ -n \"$(git status --porcelain 2>/dev/null)\" ] && status='*'; }; B='\\033[38;2;30;102;245m'; G='\\033[38;2;64;160;43m'; Y='\\033[38;2;223;142;29m'; T='\\033[38;2;76;79;105m'; R='\\033[0m'; printf \"${C}${user}${R}:${B}${cwd}${R}\"; [ -n \"$branch\" ] && printf \" ${G}${branch}${Y}${status}${R}\"; printf \" ${T}${model}${R} ${Y}${time}${R}\"; echo",
    "description": "Simplified status line: user:path branch* model time"
  }
}
```

Barra de estado simplificada:

```
affoon:~/projects/myapp main* sonnet-4.5 14:30
```

---

## 4. Guía de Personalización de Configuración

### 4.1 Personalización de Configuración de Nivel de Proyecto

Ajusta `CLAUDE.md` según el tipo de proyecto:

#### Proyecto Frontend

```markdown
## Resumen del Proyecto

Aplicación E-commerce de Next.js con React, Tailwind CSS y API de Shopify.

## Stack Tecnológico

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Estilos**: Tailwind CSS, shadcn/ui
- **Estado**: Zustand, React Query
- **API**: API Storefront de Shopify, GraphQL
- **Despliegue**: Vercel

## Reglas Críticas

### 1. Arquitectura de Componentes

- Usar componentes funcionales con hooks
- Archivos de componentes bajo 300 líneas
- Componentes reutilizables en `/components/ui/`
- Componentes de características en `/components/features/`

### 2. Estilos

- Usar clases de utilidad de Tailwind
- Evitar estilos en línea
- Tokens de diseño consistentes
- Diseño responsivo primero

### 3. Rendimiento

- División de código con imports dinámicos
- Optimización de imágenes con next/image
- Carga diferida de componentes pesados
- Optimización SEO con API de metadatos
```

#### Proyecto Backend

```markdown
## Resumen del Proyecto

API REST de Node.js con Express, MongoDB y Redis.

## Stack Tecnológico

- **Backend**: Node.js, Express, TypeScript
- **Base de Datos**: MongoDB con Mongoose
- **Caché**: Redis
- **Autenticación**: JWT, bcrypt
- **Pruebas**: Jest, Supertest
- **Despliegue**: Docker, Railway

## Reglas Críticas

### 1. Diseño de API

- Endpoints RESTful
- Formato de respuesta consistente
- Códigos de estado HTTP apropiados
- Versionamiento de API (`/api/v1/`)

### 2. Base de Datos

- Usar modelos de Mongoose
- Indexar campos importantes
- Transacciones para operaciones de múltiples pasos
- Pool de conexiones

### 3. Seguridad

- Limitación de velocidad con express-rate-limit
- Helmet para encabezados de seguridad
- Configuración CORS
- Validación de entrada con Joi/Zod
```

#### Proyecto Full-Stack

```markdown
## Resumen del Proyecto

Aplicación SaaS full-stack con Next.js, Supabase y OpenAI.

## Stack Tecnológico

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Rutas de API de Next.js, Edge Functions
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **IA**: API de OpenAI
- **Pruebas**: Playwright, Jest, Vitest

## Reglas Críticas

### 1. Estructura de Monorepo

```
/
├── apps/
│   ├── web/              # Frontend Next.js
│   └── api/              # Rutas de API Next.js
├── packages/
│   ├── ui/               # Componentes UI compartidos
│   ├── db/               # Utilidades de base de datos
│   └── types/            # Tipos TypeScript
└── docs/
```

### 2. Integración de API y Frontend

- Tipos compartidos en `/packages/types`
- Cliente de API en `/packages/db`
- Manejo de errores consistente
- Estados de carga y límites de error

### 3. Pruebas Full-Stack

- Frontend: Vitest + Testing Library
- API: Supertest
- E2E: Playwright
- Pruebas de integración para flujos críticos
```

### 4.2 Personalización de Configuración de Nivel de Usuario

Ajusta `~/.claude/CLAUDE.md` según tus preferencias personales:

#### Ajustar Requisitos de Cobertura de Pruebas

```markdown
## Preferencias Personales

### Pruebas
- TDD: Escribir pruebas primero
- 90% mínimo de cobertura  # Ajustado a 90%
- Unitarias + integración + E2E para flujos críticos
- Preferir pruebas de integración sobre pruebas unitarias para lógica de negocio
```

#### Agregar Preferencias de Estilo de Código Personal

```markdown
## Preferencias Personales

### Estilo de Código
- Sin emojis en código, comentarios o documentación
- Preferir inmutabilidad - nunca mutar objetos o arrays
- Muchos archivos pequeños en lugar de pocos archivos grandes
- 200-400 líneas típicas, máximo 800 por archivo
- Preferir declaraciones de retorno explícitas sobre retornos implícitos
- Usar nombres de variables significativos, no abreviaturas
- Agregar comentarios JSDoc para funciones complejas
```

#### Ajustar Normas de Commits de Git

```markdown
## Git

### Formato de Mensaje de Commit

Commits convencionales con convenciones específicas del equipo:

- `feat(scope): description` - Nuevas características
- `fix(scope): description` - Correcciones de errores
- `perf(scope): description` - Mejoras de rendimiento
- `refactor(scope): description` - Refactorización de código
- `docs(scope): description` - Cambios de documentación
- `test(scope): description` - Adiciones/cambios de pruebas
- `chore(scope): description` - Tareas de mantenimiento
- `ci(scope): description` - Cambios CI/CD

### Lista de Verificación de Commit

- [ ] Pruebas pasan localmente
- [ ] El código sigue la guía de estilo
- [ ] Sin console.log en código de producción
- [ ] Documentación actualizada
- [ ] La descripción del PR incluye cambios

### Flujo de Trabajo de PR

- PRs pequeños y enfocados (menos de 300 líneas de diferencia)
- Incluir informe de cobertura de pruebas
- Enlazar a problemas relacionados
- Solicitar revisión de al menos un compañero de equipo
```

### 4.3 Personalización de la Barra de Estado

#### Agregar Más Información

```bash
# Agregar versión de Node.js
node_version=$(node --version 2>/dev/null || echo '')

# Agregar fecha actual
date=$(date +%Y-%m-%d)

# Mostrar en la barra de estado
[ -n "$node_version" ] && printf " ${G}node:${node_version}${R}"
printf " ${T}${date}${R}"
```

Efecto de visualización:

```
affoon:~/projects/myapp main* ctx:73% node:v20.10.0 2025-01-25 sonnet-4.5 14:30 todos:3
```

#### Mostrar Solo Información Clave

```bash
# Barra de estado minimalista
command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); remaining=$(echo \"$input\" | jq -r '.context_window.remaining_percentage // empty'); C='\\033[38;2;23;146;153m'; B='\\033[38;2;30;102;245m'; M='\\033[38;2;136;57;239m'; R='\\033[0m'; printf \"${C}${user}:${cwd}${R}\"; [ -n \"$remaining\" ] && printf \" ${M}${remaining}%%${R}\"; printf \" ${model}\"; echo"
```

Efecto de visualización:

```
affoon:~/projects/myapp 73% sonnet-4.5
```

---

## 5. Escenarios Comunes de Configuración

### 5.1 Inicio Rápido para Nuevo Proyecto

::: code-group

```bash [1. Copiar Plantilla de Nivel de Proyecto]
# Crear CLAUDE.md de nivel de proyecto
cp source/affaan-m/everything-claude-code/examples/CLAUDE.md \
   your-project/CLAUDE.md
```

```bash [2. Personalizar Información del Proyecto]
# Editar información clave
vim your-project/CLAUDE.md

# Modificar:
# - Project Overview (descripción del proyecto)
# - Tech Stack (stack tecnológico)
# - File Structure (estructura de archivos)
# - Key Patterns (patrones comunes)
```

```bash [3. Configurar Configuración de Usuario]
# Copiar plantilla de nivel de usuario
mkdir -p ~/.claude
cp source/affaan-m/everything-claude-code/examples/user-CLAUDE.md \
   ~/.claude/CLAUDE.md

# Personalizar preferencias personales
vim ~/.claude/CLAUDE.md
```

```bash [4. Configurar Barra de Estado]
# Agregar configuración de barra de estado
# Editar ~/.claude/settings.json
# Agregar configuración statusLine
```

:::

### 5.2 Múltiples Proyectos con Configuración Compartida

Si usas Everything Claude Code en múltiples proyectos, se recomienda la siguiente estrategia de configuración:

#### Opción 1: Reglas Base de Nivel de Usuario + Reglas Específicas del Proyecto

```bash
~/.claude/CLAUDE.md           # Reglas generales (estilo de código, pruebas)
~/.claude/rules/security.md    # Reglas de seguridad (todos los proyectos)
~/.claude/rules/testing.md    # Reglas de pruebas (todos los proyectos)

project-a/CLAUDE.md          # Configuración específica del Proyecto A
project-b/CLAUDE.md          # Configuración específica del Proyecto B
```

#### Opción 2: Enlaces Simbólicos para Reglas Compartidas

```bash
# Crear directorio de reglas compartidas
mkdir -p ~/claude-configs/rules

# Enlaces simbólicos en cada proyecto
ln -s ~/claude-configs/rules/security.md project-a/.claude/rules/
ln -s ~/claude-configs/rules/security.md project-b/.claude/rules/
```

### 5.3 Configuración de Equipo

#### Compartir Configuración del Proyecto

Envía el `CLAUDE.md` del proyecto a Git para que los miembros del equipo compartan:

```bash
# 1. Crear configuración del proyecto
vim CLAUDE.md

# 2. Enviar a Git
git add CLAUDE.md
git commit -m "docs: add Claude Code project configuration"
git push
```

#### Normas de Codificación del Equipo

Define normas de equipo en el `CLAUDE.md` del proyecto:

```markdown
## Normas de Codificación del Equipo

### Convenciones
- Usar modo estricto de TypeScript
- Seguir configuración de Prettier
- Usar reglas ESLint de `package.json`
- Sin PRs sin cobertura de pruebas

### Nomenclatura de Archivos
- Componentes: PascalCase (`UserProfile.tsx`)
- Utilidades: camelCase (`formatDate.ts`)
- Hooks: camelCase con prefijo `use` (`useAuth.ts`)
- Tipos: PascalCase con prefijo `I` (`IUser.ts`)

### Mensajes de Commit
- Seguir Commits Convencionales
- Incluir número de ticket: `feat(TICKET-123): add feature`
- Máximo 72 caracteres para el título
- Descripción detallada en el cuerpo
```

---

## 6. Validación de Configuración

### 6.1 Verificar si la Configuración es Efectiva

```bash
# 1. Abrir Claude Code
claude

# 2. Ver configuración del proyecto
# Claude Code debería leer CLAUDE.md del directorio raíz del proyecto

# 3. Ver configuración de nivel de usuario
# Claude Code debería fusionar ~/.claude/CLAUDE.md
```

### 6.2 Validar Ejecución de Reglas

Pide a Claude Code que realice una tarea simple para verificar que las reglas están activas:

```
Usuario:
Por favor crea un componente de perfil de usuario

Claude Code debería:
1. Usar patrones inmutables (crear nuevos objetos al modificar objetos)
2. No usar console.log
3. Seguir límites de tamaño de archivo (<800 líneas)
4. Agregar definiciones de tipo apropiadas
```

### 6.3 Validar la Barra de Estado

Verifica que la barra de estado se muestre correctamente:

```
Esperado:
affoon:~/projects/myapp main* ctx:73% sonnet-4.5 14:30 todos:3

Puntos de verificación:
✓ Nombre de usuario mostrado
✓ Directorio actual mostrado (abreviado con ~)
✓ Rama de Git mostrada (con * cuando hay cambios)
✓ Porcentaje de contexto mostrado
✓ Nombre del modelo mostrado
✓ Hora mostrada
✓ Cantidad de tareas mostrada (si hay)
```

---

## 7. Solución de Problemas

### 7.1 La Configuración no es Efectiva

**Problema**: Configuraste `CLAUDE.md` pero Claude Code no aplica las reglas

**Pasos de solución**:

```bash
# 1. Verificar ubicación del archivo
ls -la CLAUDE.md                          # Debería estar en el directorio raíz del proyecto
ls -la ~/.claude/CLAUDE.md                # Configuración de nivel de usuario

# 2. Verificar formato del archivo
file CLAUDE.md                            # Debería ser texto ASCII
head -20 CLAUDE.md                        # Debería ser formato Markdown

# 3. Verificar permisos del archivo
chmod 644 CLAUDE.md                       # Asegurar que sea legible

# 4. Reiniciar Claude Code
# Los cambios de configuración requieren reinicio para tener efecto
```

### 7.2 La Barra de Estado no se Muestra

**Problema**: Configuraste `statusLine` pero la barra de estado no se muestra

**Pasos de solución**:

```bash
# 1. Verificar formato de settings.json
cat ~/.claude/settings.json | jq '.'

# 2. Validar sintaxis JSON
jq '.' ~/.claude/settings.json
# Si hay errores, mostrará parse error

# 3. Probar comando
# Ejecutar manualmente el comando statusLine
input=$(cat ...)  # Copiar comando completo
echo "$input" | jq -r '.workspace.current_dir'
```

### 7.3 Conflicto entre Configuración de Nivel de Proyecto y Usuario

**Problema**: Hay conflicto entre configuración de nivel de proyecto y usuario, no sé cuál se aplica

**Solución**:

- **Reglas combinadas**: Ambos conjuntos de reglas se aplicarán
- **Manejo de conflictos**: La configuración de nivel de proyecto tiene prioridad sobre la configuración de nivel de usuario
- **Práctica recomendada**:
  - Configuración de nivel de usuario: reglas generales (estilo de código, pruebas)
  - Configuración de nivel de proyecto: reglas específicas del proyecto (arquitectura, diseño de API)

---

## 8. Mejores Prácticas

### 8.1 Mantenimiento de Archivos de Configuración

#### Mantener Limpio

```markdown
❌ Malas prácticas:
CLAUDE.md contiene todos los detalles, ejemplos, enlaces a tutoriales

✅ Buenas prácticas:
CLAUDE.md contiene solo reglas clave y patrones
Detalles en otros archivos y enlaces de referencia
```

#### Control de Versiones

```bash
# Configuración de nivel de proyecto: enviar a Git
git add CLAUDE.md
git commit -m "docs: update Claude Code configuration"

# Configuración de nivel de usuario: no enviar a Git
echo ".claude/" >> .gitignore  # Prevenir que la configuración de usuario se envíe
```

#### Revisión Periódica

```markdown
## Última Actualización: 2025-01-25

## Próxima Revisión: 2025-04-25

## Registro de Cambios

- 2025-01-25: Agregada sección de flujo de trabajo TDD
- 2025-01-10: Stack tecnológico actualizado para Next.js 14
- 2024-12-20: Agregada lista de verificación de revisión de seguridad
```

### 8.2 Colaboración en Equipo

#### Documentar Cambios de Configuración

Explica el motivo de los cambios de configuración en Pull Requests:

```markdown
## Cambios

Actualizar CLAUDE.md con nuevas pautas de pruebas

## Motivo

- El equipo decidió aumentar la cobertura de pruebas del 80% al 90%
- Se agregó requisito de pruebas E2E para flujos críticos
- Stack de pruebas actualizado de Jest a Vitest

## Impacto

- Todo el código nuevo debe cumplir con 90% de cobertura
- El código existente se actualizará incrementalmente
- Los miembros del equipo necesitan instalar Vitest
```

#### Revisión de Configuración

Los cambios de configuración de equipo requieren revisión de código:

```markdown
## Cambios de CLAUDE.md

- [ ] Actualizado con nueva regla
- [ ] Probado en proyecto de ejemplo
- [ ] Documentado en wiki del equipo
- [ ] Miembros del equipo notificados
```

---

## Resumen de la Lección

Esta lección introdujo tres configuraciones centrales de Everything Claude Code:

1. **Configuración de Nivel de Proyecto**: `CLAUDE.md` - Reglas y patrones específicos del proyecto
2. **Configuración de Nivel de Usuario**: `~/.claude/CLAUDE.md` - Preferencias de codificación personal y reglas generales
3. **Barra de Estado Personalizada**: `settings.json` - Mostrar información clave en tiempo real

**Puntos Clave**:

- Los archivos de configuración usan formato Markdown, fácil de editar y mantener
- La configuración de nivel de proyecto tiene prioridad sobre la configuración de nivel de usuario
- La barra de estado usa códigos de color ANSI, completamente personalizable
- Los proyectos de equipo deben enviar `CLAUDE.md` a Git

**Siguientes Pasos**:

- Personaliza `CLAUDE.md` según tu tipo de proyecto
- Configura configuración de nivel de usuario y preferencias personales
- Personaliza la barra de estado para mostrar la información que necesitas
- Envía la configuración a control de versiones (configuración de nivel de proyecto)

---

## Próxima Lección

> En la próxima lección aprenderemos **[Registro de Cambios: Historial de Versiones y Cambios](../release-notes/)**.
>
> Aprenderás:
> - Cómo ver el historial de versiones de Everything Claude Code
> - Conocer cambios importantes y nuevas características
> - Cómo realizar actualizaciones de versiones y migraciones
