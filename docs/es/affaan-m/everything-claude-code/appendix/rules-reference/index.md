---
title: "Rules: Explicación Detallada de 8 Conjuntos de Reglas | everything-claude-code"
sidebarTitle: "Referencia Rápida de 8 Reglas"
subtitle: "Rules: Explicación Detallada de 8 Conjuntos de Reglas | everything-claude-code"
description: "Aprende los 8 conjuntos de reglas de everything-claude-code, incluyendo seguridad, estilo de código, pruebas, flujo de trabajo Git, optimización de rendimiento, uso de Agents, patrones de diseño y sistema de Hooks."
tags:
  - "rules"
  - "security"
  - "coding-style"
  - "testing"
  - "git-workflow"
  - "performance"
prerequisite:
  - "start-quickstart"
order: 200
---

# Referencia Completa de Rules: Explicación Detallada de 8 Conjuntos de Reglas

## Qué Aprenderás

- Buscar y comprender rápidamente los 8 conjuntos de reglas obligatorias
- Aplicar correctamente las normas de seguridad, estilo de código, pruebas, etc. durante el desarrollo
- Saber cuándo usar qué Agent para ayudar a cumplir las reglas
- Comprender las estrategias de optimización de rendimiento y el funcionamiento del sistema de Hooks

## Tu Situación Actual

Frente a los 8 conjuntos de reglas del proyecto, podrías:

- **No recordar todas las reglas**: security, coding-style, testing, git-workflow... ¿cuáles son obligatorias?
- **No saber cómo aplicarlas**: las reglas mencionan patrones inmutables, proceso TDD, ¿pero cómo operarlos específicamente?
- **No saber a quién pedir ayuda**: ¿qué Agent usar para problemas de seguridad? ¿Y para revisión de código?
- **Equilibrio entre rendimiento y seguridad**: ¿cómo optimizar la eficiencia del desarrollo mientras se garantiza la calidad del código?

Este documento de referencia te ayuda a comprender completamente el contenido, escenarios de aplicación y herramientas Agent correspondientes de cada conjunto de reglas.

---

## Visión General de Rules

Everything Claude Code contiene 8 conjuntos de reglas obligatorias, cada conjunto tiene objetivos claros y escenarios de aplicación:

| Conjunto de Reglas | Objetivo | Prioridad | Agent Correspondiente |
| --- | --- | --- | --- |
| **Security** | Prevenir vulnerabilidades de seguridad, fuga de datos sensibles | P0 | security-reviewer |
| **Coding Style** | Código legible, patrón inmutable, archivos pequeños | P0 | code-reviewer |
| **Testing** | Cobertura de pruebas 80%+, proceso TDD | P0 | tdd-guide |
| **Git Workflow** | Commits normalizados, proceso PR | P1 | code-reviewer |
| **Agents** | Uso correcto de sub-agents | P1 | N/A |
| **Performance** | Optimización de tokens, gestión de contexto | P1 | N/A |
| **Patterns** | Patrones de diseño, mejores prácticas arquitectónicas | P2 | architect |
| **Hooks** | Comprender y usar Hooks | P2 | N/A |

::: info Explicación de Prioridades de Reglas

- **P0 (Crítico)**: Debe cumplirse estrictamente, la violación causará riesgos de seguridad o grave deterioro de la calidad del código
- **P1 (Importante)**: Debe cumplirse, afecta la eficiencia del desarrollo y la colaboración del equipo
- **P2 (Recomendado)**: Se recomienda cumplir, mejora la arquitectura del código y la mantenibilidad
:::

---

## 1. Security (Reglas de Seguridad)

### Verificaciones de Seguridad Obligatorias

**Antes de cualquier commit**, debes completar las siguientes verificaciones:

- [ ] Sin claves hardcodeadas (API keys, contraseñas, tokens)
- [ ] Todas las entradas de usuario validadas
- [ ] Prevención de inyección SQL (consultas parametrizadas)
- [ ] Prevención de XSS (sanitización de HTML)
- [ ] Protección CSRF habilitada
- [ ] Autenticación/autorización verificada
- [ ] Todos los endpoints tienen límite de tasa
- [ ] Los mensajes de error no filtran datos sensibles

### Gestión de Claves

**❌ Práctica Incorrecta**: Claves hardcodeadas

```typescript
const apiKey = "sk-proj-xxxxx"
```

**✅ Práctica Correcta**: Usar variables de entorno

```typescript
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

### Protocolo de Respuesta de Seguridad

Si se descubre un problema de seguridad:

1. **Detener inmediatamente** el trabajo actual
2. Usar el agent **security-reviewer** para análisis completo
3. Corregir problemas CRITICAL antes de continuar
4. Rotar cualquier clave expuesta
5. Verificar toda la base de código en busca de problemas similares

::: tip Uso del Agent de Seguridad

Usar el comando `/code-review` activará automáticamente la verificación de security-reviewer, asegurando que el código cumpla con las normas de seguridad.
:::

---

## 2. Coding Style (Reglas de Estilo de Código)

### Inmutabilidad (CRÍTICO)

**Siempre crear nuevos objetos, nunca modificar objetos existentes**:

**❌ Práctica Incorrecta**: Modificar objeto directamente

```javascript
function updateUser(user, name) {
  user.name = name  // MUTATION!
  return user
}
```

**✅ Práctica Correcta**: Crear nuevo objeto

```javascript
function updateUser(user, name) {
  return {
    ...user,
    name
  }
}
```

### Organización de Archivos

**Muchos archivos pequeños > Pocos archivos grandes**:

- **Alta cohesión, bajo acoplamiento**
- **Típicamente 200-400 líneas, máximo 800 líneas**
- Extraer funciones utilitarias de componentes grandes
- Organizar por funcionalidad/dominio, no por tipo

### Manejo de Errores

**Siempre manejar errores completamente**:

```typescript
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  console.error('Operation failed:', error)
  throw new Error('Detailed user-friendly message')
}
```

### Validación de Entrada

**Siempre validar entrada de usuario**:

```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150)
})

const validated = schema.parse(input)
```

### Lista de Verificación de Calidad de Código

Antes de marcar el trabajo como completo, debes confirmar:

- [ ] Código legible y nombres claros
- [ ] Funciones pequeñas (< 50 líneas)
- [ ] Archivos enfocados (< 800 líneas)
- [ ] Sin anidamiento profundo (> 4 niveles)
- [ ] Manejo de errores correcto
- [ ] Sin declaraciones console.log
- [ ] Sin valores hardcodeados
- [ ] Sin modificación directa (usar patrón inmutable)

---

## 3. Testing (Reglas de Pruebas)

### Cobertura Mínima de Pruebas: 80%

**Debe incluir todos los tipos de pruebas**:

1. **Pruebas Unitarias** - Funciones independientes, funciones utilitarias, componentes
2. **Pruebas de Integración** - Endpoints API, operaciones de base de datos
3. **Pruebas E2E** - Flujos de usuario críticos (Playwright)

### Desarrollo Guiado por Pruebas (TDD)

**Flujo de trabajo obligatorio**:

1. Escribir prueba primero (RED)
2. Ejecutar prueba - debe fallar
3. Escribir implementación mínima (GREEN)
4. Ejecutar prueba - debe pasar
5. Refactorizar (IMPROVE)
6. Verificar cobertura (80%+)

### Solución de Problemas de Pruebas

1. Usar el agent **tdd-guide**
2. Verificar aislamiento de pruebas
3. Validar si los mocks son correctos
4. Corregir implementación, no pruebas (a menos que la prueba esté incorrecta)

### Soporte de Agents

- **tdd-guide** - Usar proactivamente para nuevas funcionalidades, forzar escribir pruebas primero
- **e2e-runner** - Experto en pruebas E2E con Playwright

::: tip Usar Comando TDD

Usar el comando `/tdd` llamará automáticamente al agent tdd-guide, guiándote a través del proceso TDD completo.
:::

---

## 4. Git Workflow (Reglas de Flujo de Trabajo Git)

### Formato de Mensaje de Commit

```
<type>: <description>

<optional body>
```

**Tipos**: feat, fix, refactor, docs, test, chore, perf, ci

::: info Mensajes de Commit

La atribución en mensajes de commit se ha deshabilitado globalmente a través de `~/.claude/settings.json`.
:::

### Flujo de Trabajo de Pull Request

Al crear un PR:

1. Analizar historial completo de commits (no solo el último commit)
2. Usar `git diff [base-branch]...HEAD` para ver todos los cambios
3. Redactar resumen completo del PR
4. Incluir plan de pruebas y TODOs
5. Si es una rama nueva, usar flag `-u` al hacer push

### Flujo de Trabajo de Implementación de Funcionalidades

#### 1. Planificación Primero

- Usar el agent **planner** para crear plan de implementación
- Identificar dependencias y riesgos
- Dividir en múltiples fases

#### 2. Enfoque TDD

- Usar el agent **tdd-guide**
- Escribir pruebas primero (RED)
- Implementar para pasar pruebas (GREEN)
- Refactorizar (IMPROVE)
- Verificar cobertura 80%+

#### 3. Revisión de Código

- Usar el agent **code-reviewer** inmediatamente después de escribir código
- Corregir problemas CRITICAL y HIGH
- Corregir problemas MEDIUM en la medida de lo posible

#### 4. Commit y Push

- Mensajes de commit detallados
- Seguir formato conventional commits

---

## 5. Agents (Reglas de Agents)

### Agents Disponibles

Ubicados en `~/.claude/agents/`:

| Agent | Propósito | Cuándo Usar |
| --- | --- | --- |
| planner | Planificación de implementación | Funcionalidades complejas, refactorización |
| architect | Diseño de sistema | Decisiones arquitectónicas |
| tdd-guide | Desarrollo guiado por pruebas | Nuevas funcionalidades, corrección de bugs |
| code-reviewer | Revisión de código | Después de escribir código |
| security-reviewer | Análisis de seguridad | Antes de commit |
| build-error-resolver | Corregir errores de compilación | Cuando falla la compilación |
| e2e-runner | Pruebas E2E | Flujos de usuario críticos |
| refactor-cleaner | Limpieza de código muerto | Mantenimiento de código |
| doc-updater | Actualización de documentación | Actualizar documentación |

### Usar Agents Inmediatamente

**Sin necesidad de indicación del usuario**:

1. Solicitud de funcionalidad compleja - Usar agent **planner**
2. Código recién escrito/modificado - Usar agent **code-reviewer**
3. Corrección de bug o nueva funcionalidad - Usar agent **tdd-guide**
4. Decisión arquitectónica - Usar agent **architect**

### Ejecución de Tareas en Paralelo

**Siempre usar ejecución de tareas en paralelo para operaciones independientes**:

| Método | Explicación |
| --- | --- |
| ✅ Bueno: Ejecución paralela | Iniciar 3 agents en paralelo: Agent 1 (análisis de seguridad auth.ts), Agent 2 (revisión de rendimiento sistema de caché), Agent 3 (verificación de tipos utils.ts) |
| ❌ Malo: Ejecución secuencial | Ejecutar agent 1, luego agent 2, luego agent 3 |

### Análisis Multi-Perspectiva

Para problemas complejos, usar sub-agents con roles divididos:

- Verificador de hechos
- Ingeniero senior
- Experto en seguridad
- Revisor de consistencia
- Verificador de redundancia

---

## 6. Performance (Reglas de Optimización de Rendimiento)

### Estrategia de Selección de Modelo

**Haiku 4.5** (90% de capacidad de Sonnet, 3x ahorro de costos):

- Agents ligeros, llamadas frecuentes
- Programación en pareja y generación de código
- Worker agents en sistemas multi-agent

**Sonnet 4.5** (mejor modelo de codificación):

- Trabajo de desarrollo principal
- Coordinación de flujos de trabajo multi-agent
- Tareas de codificación complejas

**Opus 4.5** (razonamiento más profundo):

- Decisiones arquitectónicas complejas
- Máxima necesidad de razonamiento
- Tareas de investigación y análisis

### Gestión de Ventana de Contexto

**Evitar usar el último 20% de la ventana de contexto**:

- Refactorización a gran escala
- Implementación de funcionalidades a través de múltiples archivos
- Depuración de interacciones complejas

**Tareas de baja sensibilidad al contexto**:

- Edición de archivo único
- Creación de herramientas independientes
- Actualización de documentación
- Corrección de bugs simples

### Ultrathink + Plan Mode

Para tareas complejas que requieren razonamiento profundo:

1. Usar `ultrathink` para pensamiento mejorado
2. Habilitar **Plan Mode** para obtener enfoque estructurado
3. "Reiniciar motor" para crítica multi-ronda
4. Usar sub-agents con roles divididos para análisis diversificado

### Solución de Problemas de Compilación

Si falla la compilación:

1. Usar el agent **build-error-resolver**
2. Analizar mensajes de error
3. Corregir paso a paso
4. Verificar después de cada corrección

---

## 7. Patterns (Reglas de Patrones Comunes)

### Formato de Respuesta API

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}
```

### Patrón de Hooks Personalizados

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```

### Patrón Repository

```typescript
interface Repository<T> {
  findAll(filters?: Filters): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(data: CreateDto): Promise<T>
  update(id: string, data: UpdateDto): Promise<T>
  delete(id: string): Promise<void>
}
```

### Proyectos Esqueleto

Al implementar nuevas funcionalidades:

1. Buscar proyectos esqueleto probados en batalla
2. Usar agents paralelos para evaluar opciones:
   - Evaluación de seguridad
   - Análisis de escalabilidad
   - Puntuación de relevancia
   - Planificación de implementación
3. Clonar la mejor coincidencia como base
4. Iterar en estructura validada

---

## 8. Hooks (Reglas del Sistema de Hooks)

### Tipos de Hooks

- **PreToolUse**: Antes de ejecución de herramienta (validación, modificación de parámetros)
- **PostToolUse**: Después de ejecución de herramienta (formateo automático, verificaciones)
- **Stop**: Al finalizar sesión (validación final)

### Hooks Actuales (en ~/.claude/settings.json)

#### PreToolUse

- **Recordatorio tmux**: Sugerir usar tmux para comandos de larga duración (npm, pnpm, yarn, cargo, etc.)
- **Revisión git push**: Abrir revisión en Zed antes de hacer push
- **Bloqueador de documentación**: Bloquear creación de archivos .md/.txt innecesarios

#### PostToolUse

- **Creación de PR**: Registrar URL del PR y estado de GitHub Actions
- **Prettier**: Formatear automáticamente archivos JS/TS después de editar
- **Verificación TypeScript**: Ejecutar tsc después de editar archivos .ts/.tsx
- **Advertencia console.log**: Advertir sobre console.log en archivos editados

#### Stop

- **Auditoría console.log**: Verificar console.log en todos los archivos modificados antes de finalizar sesión

### Aceptación Automática de Permisos

**Usar con precaución**:

- Habilitar para planes confiables y bien definidos
- Deshabilitar durante trabajo exploratorio
- Nunca usar flag dangerously-skip-permissions
- En su lugar, configurar `allowedTools` en `~/.claude.json`

### Mejores Prácticas de TodoWrite

Usar la herramienta TodoWrite para:

- Rastrear progreso de tareas multi-paso
- Validar comprensión de instrucciones
- Habilitar orientación en tiempo real
- Mostrar pasos de implementación de grano fino

La lista Todo revela:

- Pasos en orden incorrecto
- Elementos faltantes
- Elementos adicionales innecesarios
- Granularidad incorrecta
- Requisitos malinterpretados

---

## Próxima Lección

> En la próxima lección aprenderemos **[Referencia Completa de Skills](../skills-reference/)**.
>
> Aprenderás:
> - Referencia completa de 11 bibliotecas de skills
> - Skills de estándares de codificación, patrones backend/frontend, aprendizaje continuo, etc.
> - Cómo elegir el skill adecuado para diferentes tareas

---

## Resumen de la Lección

Los 8 conjuntos de reglas de Everything Claude Code proporcionan orientación completa para el proceso de desarrollo:

1. **Security** - Prevenir vulnerabilidades de seguridad y fuga de datos sensibles
2. **Coding Style** - Asegurar código legible, inmutable, archivos pequeños
3. **Testing** - Forzar cobertura 80%+ y proceso TDD
4. **Git Workflow** - Normalizar commits y proceso PR
5. **Agents** - Guiar el uso correcto de 9 sub-agents especializados
6. **Performance** - Optimizar uso de tokens y gestión de contexto
7. **Patterns** - Proporcionar patrones de diseño comunes y mejores prácticas
8. **Hooks** - Explicar el funcionamiento del sistema de hooks automatizado

Recuerda, estas reglas no son restricciones, sino orientación para ayudarte a escribir código de alta calidad, seguro y mantenible. Usar los Agents correspondientes (como code-reviewer, security-reviewer) puede ayudarte a cumplir automáticamente estas reglas.

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Actualizado: 2026-01-25

| Funcionalidad | Ruta del Archivo | Línea |
| --- | --- | --- |
| Reglas Security | [`rules/security.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/security.md) | 1-37 |
| Reglas Coding Style | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | 1-71 |
| Reglas Testing | [`rules/testing.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/testing.md) | 1-31 |
| Reglas Git Workflow | [`rules/git-workflow.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/git-workflow.md) | 1-46 |
| Reglas Agents | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50 |
| Reglas Performance | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Reglas Patterns | [`rules/patterns.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/patterns.md) | 1-56 |
| Reglas Hooks | [`rules/hooks.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/hooks.md) | 1-47 |

**Reglas Clave**:
- **Security**: Sin secretos hardcodeados, verificación OWASP Top 10
- **Coding Style**: Patrón inmutable, archivos < 800 líneas, funciones < 50 líneas
- **Testing**: Cobertura de pruebas 80%+, proceso TDD forzado
- **Performance**: Estrategia de selección de modelo, gestión de ventana de contexto

**Agents Relacionados**:
- **security-reviewer**: Detección de vulnerabilidades de seguridad
- **code-reviewer**: Revisión de calidad y estilo de código
- **tdd-guide**: Orientación del proceso TDD
- **planner**: Plan de implementación

</details>
