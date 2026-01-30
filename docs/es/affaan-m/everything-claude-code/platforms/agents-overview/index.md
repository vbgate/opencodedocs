---
title: "Agents: 9 Agentes Especializados | Everything Claude Code"
sidebarTitle: "Usa el Agente Correcto, Duplica tu Eficiencia"
subtitle: "Agents: 9 Agentes Especializados | Everything Claude Code"
description: "Aprende sobre los 9 agentes especializados de Everything Claude Code, domina cómo invocarlos en diferentes escenarios y mejora la eficiencia y calidad del desarrollo asistido por IA."
tags:
  - "agents"
  - "ai-assistant"
  - "workflow"
prerequisite:
  - "start-quick-start"
order: 60
---

# Descripción Detallada de los Agents Principales: 9 Sub-agentes Especializados

## Lo Que Podrás Hacer Después de Aprender

- Comprender las responsabilidades y escenarios de uso de los 9 agentes especializados
- Saber qué agente invocar para diferentes tareas de desarrollo
- Dominar cómo los agentes colaboran entre sí para construir flujos de trabajo eficientes
- Evitar las limitaciones de la "IA general" y aprovechar los agentes especializados para mejorar la eficiencia

## Tu Situación Actual

- A menudo le pides a Claude que haga ciertas tareas, pero las respuestas no son lo suficientemente profesionales o profundas
- No estás seguro de cuándo usar los comandos `/plan`, `/tdd`, `/code-review`, etc.
- Sientes que los consejos de la IA son demasiado genéricos y carecen de especificidad
- Quieres un flujo de trabajo de desarrollo sistemático, pero no sabes cómo organizarlo

## Cuándo Usar Esta Técnica

Esta guía te ayudará cuando necesites completar las siguientes tareas:
- Planificación antes del desarrollo de funciones complejas
- Escribir nuevas funcionalidades o corregir errores
- Revisión de código y auditoría de seguridad
- Corrección de errores de compilación
- Pruebas de extremo a extremo
- Refactorización y limpieza de código
- Actualización de documentación

## Concepto Central

Everything Claude Code proporciona 9 agentes especializados, cada uno enfocado en un dominio específico. Al igual que buscarías expertos con diferentes roles en un equipo real, diferentes tareas de desarrollo deberían invocar diferentes agentes.

::: info Agente vs Comando
- **Agente**: Un asistente de IA profesional con conocimientos y herramientas específicas de un dominio
- **Comando**: Un atajo para invocar rápidamente un agente o ejecutar una operación específica

Por ejemplo: El comando `/tdd` invoca el agente `tdd-guide` para ejecutar el flujo de trabajo de desarrollo dirigido por pruebas.
:::

### Resumen de los 9 Agentes

| Agente | Rol | Escenarios Típicos | Capacidades Clave |
| --- | --- | --- | --- |
| **planner** | Experto en Planificación | Planificación antes del desarrollo de funciones complejas | Análisis de requisitos, revisión de arquitectura, desglose de pasos |
| **architect** | Arquitecto | Diseño de sistemas y decisiones técnicas | Evaluación de arquitectura, recomendación de patrones, análisis de compensaciones |
| **tdd-guide** | Mentor TDD | Escribir pruebas e implementar funcionalidades | Flujo Red-Green-Refactor, garantía de cobertura |
| **code-reviewer** | Revisor de Código | Revisar calidad del código | Verificación de calidad, seguridad, mantenibilidad |
| **security-reviewer** | Auditor de Seguridad | Detección de vulnerabilidades de seguridad | OWASP Top 10, filtración de claves, protección contra inyección |
| **build-error-resolver** | Solucionador de Errores de Compilación | Corregir errores de TypeScript/compilación | Corrección mínima, inferencia de tipos |
| **e2e-runner** | Experto en Pruebas E2E | Gestión de pruebas de extremo a extremo | Pruebas Playwright, gestión de flaky, artifact |
| **refactor-cleaner** | Limpiador de Refactorización | Eliminar código muerto y duplicado | Análisis de dependencias, eliminación segura, documentación |
| **doc-updater** | Actualizador de Documentación | Generar y actualizar documentación | Generación de codemap, análisis AST |

## Introducción Detallada

### 1. Planner - Experto en Planificación

**Cuándo usar**: Cuando necesitas implementar funciones complejas, cambios de arquitectura o refactorizaciones grandes.

::: tip Mejores Prácticas
Antes de empezar a escribir código, usa primero `/plan` para crear un plan de implementación. Esto puede evitar omitir dependencias, descubrir riesgos potenciales y establecer un orden de implementación razonable.
:::

**Capacidades Principales**:
- Análisis y aclaración de requisitos
- Revisión de arquitectura e identificación de dependencias
- Desglose detallado de pasos de implementación
- Identificación de riesgos y planes de mitigación
- Planificación de estrategias de prueba

**Formato de Salida**:
```markdown
# Implementation Plan: [Feature Name]

## Overview
[Resumen de 2-3 oraciones]

## Requirements
- [Requirement 1]
- [Requirement 2]

## Architecture Changes
- [Change 1: ruta del archivo y descripción]
- [Change 2: ruta del archivo y descripción]

## Implementation Steps

### Phase 1: [Phase Name]
1. **[Step Name]** (File: path/to/file.ts)
   - Action: operación específica
   - Why: razón
   - Dependencies: None / Requires step X
   - Risk: Low/Medium/High

## Testing Strategy
- Unit tests: [archivos a probar]
- Integration tests: [flujos a probar]
- E2E tests: [viajes de usuario a probar]

## Risks & Mitigations
- **Risk**: [descripción]
  - Mitigation: [cómo resolver]

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

**Escenarios de Ejemplo**:
- Agregar un nuevo endpoint de API (requiere migración de base de datos, actualización de caché, documentación)
- Refactorizar módulos principales (afecta múltiples dependencias)
- Agregar nuevas funcionalidades (involucra frontend, backend, base de datos)

### 2. Architect - Arquitecto

**Cuándo usar**: Cuando necesitas diseñar arquitectura de sistemas, evaluar soluciones técnicas o tomar decisiones de arquitectura.

**Capacidades Principales**:
- Diseño de arquitectura de sistemas
- Análisis de compensaciones técnicas
- Recomendación de patrones de diseño
- Planificación de escalabilidad
- Consideraciones de seguridad

**Principios de Arquitectura**:
- **Modularidad**: Responsabilidad única, alta cohesión y bajo acoplamiento
- **Escalabilidad**: Escalado horizontal, diseño sin estado
- **Mantenibilidad**: Estructura clara, patrones consistentes
- **Seguridad**: Defensa en profundidad, privilegio mínimo
- **Rendimiento**: Algoritmos eficientes, solicitudes de red mínimas

**Patrones Comunes**:

**Patrones Frontend**:
- Composición de componentes, patrón Container/Presenter, Hooks personalizados, Context para estado global, división de código

**Patrones Backend**:
- Patrón Repository, capa de Service, patrón de Middleware, arquitectura orientada a eventos, CQRS

**Patrones de Datos**:
- Base de datos normalizada, desnormalización para rendimiento de lectura, event sourcing, capa de caché, consistencia eventual

**Formato de Registro de Decisiones de Arquitectura (ADR)**:
```markdown
# ADR-001: Usar Redis para Almacenar Vectores de Búsqueda Semántica

## Context
Necesitamos almacenar y consultar vectores de embedding de 1536 dimensiones para la búsqueda semántica de mercado.

## Decision
Usar la funcionalidad de búsqueda de vectores de Redis Stack.

## Consequences

### Positive
- Búsqueda rápida de similitud vectorial (<10ms)
- Algoritmo KNN integrado
- Despliegue simple
- Buen rendimiento (hasta 10K vectores)

### Negative
- Almacenamiento en memoria (costoso para grandes conjuntos de datos)
- Punto único de fallo (sin clúster)
- Solo soporta similitud coseno

### Alternatives Considered
- **PostgreSQL pgvector**: Más lento pero almacenamiento persistente
- **Pinecone**: Servicio administrado, mayor costo
- **Weaviate**: Más características, configuración más compleja

## Status
Accepted

## Date
2025-01-15
```

### 3. TDD Guide - Mentor TDD

**Cuándo usar**: Al escribir nuevas funcionalidades, corregir errores o refactorizar código.

::: warning Principio Central
TDD Guide requiere que todo el código **primero escriba pruebas**, luego implemente la funcionalidad, asegurando una cobertura de pruebas del 80%+.
:::

**Flujo de Trabajo TDD**:

**Paso 1: Escribir Pruebas Primero (RED)**
```typescript
describe('searchMarkets', () => {
  it('returns semantically similar markets', async () => {
    const results = await searchMarkets('election')

    expect(results).toHaveLength(5)
    expect(results[0].name).toContain('Trump')
    expect(results[1].name).toContain('Biden')
  })
})
```

**Paso 2: Ejecutar Pruebas (Verificar Fallo)**
```bash
npm test
# La prueba debería fallar - aún no hemos implementado
```

**Paso 3: Escribir Implementación Mínima (GREEN)**
```typescript
export async function searchMarkets(query: string) {
  const embedding = await generateEmbedding(query)
  const results = await vectorSearch(embedding)
  return results
}
```

**Paso 4: Ejecutar Pruebas (Verificar Aprobación)**
```bash
npm test
# La prueba ahora debería pasar
```

**Paso 5: Refactorizar (IMPROVE)**
- Eliminar código duplicado
- Mejorar nomenclatura
- Optimizar rendimiento
- Mejorar legibilidad

**Paso 6: Verificar Cobertura**
```bash
npm run test:coverage
# Verificar cobertura del 80%+
```

**Tipos de Pruebas Requeridas**:

1. **Pruebas Unitarias** (Requerido): Probar funciones independientes
2. **Pruebas de Integración** (Requerido): Probar endpoints de API y operaciones de base de datos
3. **Pruebas E2E** (Flujos críticos): Probar viajes completos de usuario

**Casos Límite Requeridos**:
- Null/Undefined: ¿Qué pasa si la entrada es null?
- Vacío: ¿Qué pasa si el array/string está vacío?
- Tipos inválidos: ¿Qué pasa si se pasa el tipo incorrecto?
- Límites: Valores mínimos/máximos
- Errores: Fallos de red, errores de base de datos
- Condiciones de carrera: Operaciones concurrentes
- Datos grandes: Rendimiento con 10k+ elementos
- Caracteres especiales: Unicode, emoji, caracteres SQL

### 4. Code Reviewer - Revisor de Código

**Cuándo usar**: Después de escribir o modificar código, revisa inmediatamente.

::: tip Uso Obligatorio
Code Reviewer es un agente **que debe usarse**, todos los cambios de código deben ser revisados por él.
:::

**Lista de Verificación de Revisión**:

**Verificación de Seguridad (CRÍTICO)**:
- Credenciales codificadas (API keys, contraseñas, tokens)
- Riesgos de inyección SQL (concatenación de strings en consultas)
- Vulnerabilidades XSS (entrada de usuario sin escape)
- Falta de validación de entrada
- Dependencias inseguras (obsoletas, vulnerables)
- Riesgos de path traversal (rutas de archivos controladas por usuario)
- Vulnerabilidades CSRF
- Bypass de autenticación

**Calidad de Código (ALTO)**:
- Funciones grandes (>50 líneas)
- Archivos grandes (>800 líneas)
- Anidación profunda (>4 niveles)
- Falta de manejo de errores (try/catch)
- Sentencias console.log
- Patrones de cambio
- Nuevo código sin pruebas

**Rendimiento (MEDIO)**:
- Algoritmos ineficientes (O(n²) cuando O(n log n) es posible)
- Re-renderizados innecesarios en React
- Falta de memoización
- Tamaño grande de bundle
- Imágenes no optimizadas
- Falta de caché
- Consultas N+1

**Mejores Prácticas (MEDIO)**:
- Uso de emoji en código/comentarios
- TODO/FIXME sin ticket asociado
- API pública sin JSDoc
- Problemas de accesibilidad (faltan etiquetas ARIA, bajo contraste)
- Nombres de variables deficientes (x, tmp, data)
- Números mágicos sin explicar
- Formato inconsistente

**Formato de Salida de Revisión**:
```markdown
[CRITICAL] Hardcoded API key
File: src/api/client.ts:42
Issue: API key exposed in source code
Fix: Move to environment variable

const apiKey = "sk-abc123";  // ❌ Bad
const apiKey = process.env.API_KEY;  // ✓ Good
```

**Criterios de Aprobación**:
- ✅ Aprobado: Sin problemas CRÍTICOS o ALTOS
- ⚠️ Advertencia: Solo problemas MEDIOS (puede fusionarse con precaución)
- ❌ Bloqueado: Se encontraron problemas CRÍTICOS o ALTOS

### 5. Security Reviewer - Auditor de Seguridad

**Cuándo usar**: Después de escribir código que maneja entrada de usuario, autenticación, endpoints de API o datos sensibles.

::: danger Crítico
Security Reviewer marca filtraciones de claves, SSRF, inyección, cifrado inseguro y vulnerabilidades OWASP Top 10. ¡Los problemas CRÍTICOS deben corregirse inmediatamente!
:::

**Responsabilidades Principales**:
1. **Detección de Vulnerabilidades**: Identificar OWASP Top 10 y problemas de seguridad comunes
2. **Detección de Claves**: Encontrar API keys, contraseñas, tokens codificados
3. **Validación de Entrada**: Asegurar que toda entrada de usuario esté debidamente sanitizada
4. **Autenticación/Autorización**: Verificar controles de acceso apropiados
5. **Seguridad de Dependencias**: Verificar paquetes npm vulnerables
6. **Mejores Prácticas de Seguridad**: Aplicar patrones de codificación segura

**Verificaciones OWASP Top 10**:

1. **Inyección** (SQL, NoSQL, Command)
   - ¿Las consultas están parametrizadas?
   - ¿La entrada de usuario está sanitizada?
   - ¿El ORM se usa de forma segura?

2. **Autenticación Rota**
   - ¿Las contraseñas están hasheadas (bcrypt, argon2)?
   - ¿Los JWT se validan correctamente?
   - ¿Las sesiones son seguras?
   - ¿Hay MFA?

3. **Exposición de Datos Sensibles**
   - ¿Se fuerza HTTPS?
   - ¿Las claves están en variables de entorno?
   - ¿Los PII están cifrados en reposo?
   - ¿Los logs están sanitizados?

4. **Entidades Externas XML (XXE)**
   - ¿El parser XML está configurado de forma segura?
   - ¿El procesamiento de entidades externas está deshabilitado?

5. **Control de Acceso Roto**
   - ¿Cada ruta verifica autorización?
   - ¿Las referencias a objetos son indirectas?
   - ¿CORS está configurado correctamente?

6. **Configuración de Seguridad Incorrecta**
   - ¿Se cambiaron las credenciales por defecto?
   - ¿El manejo de errores es seguro?
   - ¿Los headers de seguridad están configurados?
   - ¿El modo debug está deshabilitado en producción?

7. **Cross-Site Scripting (XSS)**
   - ¿La salida está escapada/sanitizada?
   - ¿Content-Security-Policy está configurado?
   - ¿El framework escapa por defecto?

8. **Deserialización Insegura**
   - ¿La entrada de usuario se deserializa de forma segura?
   - ¿Las bibliotecas de deserialización están actualizadas?

9. **Uso de Componentes con Vulnerabilidades Conocidas**
   - ¿Todas las dependencias están actualizadas?
   - ¿npm audit está limpio?
   - ¿Se monitorean los CVE?

10. **Logging y Monitoreo Insuficiente**
    - ¿Se registran los eventos de seguridad?
    - ¿Se monitorean los logs?
    - ¿Las alertas están configuradas?

**Patrones de Vulnerabilidad Comunes**:

**1. Claves Codificadas (CRÍTICO)**
```javascript
// ❌ CRITICAL: Hardcoded secrets
const apiKey = "sk-proj-xxxxx"

// ✅ CORRECT: Environment variables
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

**2. Inyección SQL (CRÍTICO)**
```javascript
// ❌ CRITICAL: SQL injection vulnerability
const query = `SELECT * FROM users WHERE id = ${userId}`

// ✅ CORRECT: Parameterized queries
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
```

**3. XSS (ALTO)**
```javascript
// ❌ HIGH: XSS vulnerability
element.innerHTML = userInput

// ✅ CORRECT: Use textContent or sanitize
element.textContent = userInput
```

**Formato de Informe de Revisión de Seguridad**:
```markdown
# Security Review Report

**File/Component:** [path/to/file.ts]
**Reviewed:** YYYY-MM-DD
**Reviewer:** security-reviewer agent

## Summary
- **Critical Issues:** X
- **High Issues:** Y
- **Medium Issues:** Z
- **Low Issues:** W
- **Risk Level:** 🔴 HIGH / 🟡 MEDIUM / 🟢 LOW

## Critical Issues (Fix Immediately)

### 1. [Issue Title]
**Severity:** CRITICAL
**Category:** SQL Injection / XSS / Authentication / etc.
**Location:** `file.ts:123`

**Issue:**
[Descripción de la vulnerabilidad]

**Impact:**
[Qué sucede si se explota]

**Proof of Concept:**
```javascript
// Ejemplo de explotación
```

**Remediation:**
```javascript
// ✅ Implementación segura
```

**References:**
- OWASP: [link]
- CWE: [number]
```

### 6. Build Error Resolver - Solucionador de Errores de Compilación

**Cuándo usar**: Cuando la compilación falla o hay errores de tipo.

::: tip Corrección Mínima
El principio central de Build Error Resolver es **corrección mínima**, solo corrige el error, sin modificar la arquitectura o refactorizar.
:::

**Responsabilidades Principales**:
1. **Corrección de Errores TypeScript**: Corregir errores de tipo, problemas de inferencia, restricciones de genéricos
2. **Corrección de Errores de Compilación**: Resolver fallos de compilación, resolución de módulos
3. **Problemas de Dependencias**: Corregir errores de importación, paquetes faltantes, conflictos de versiones
4. **Errores de Configuración**: Resolver problemas de tsconfig.json, webpack, configuración de Next.js
5. **Diferencias Mínimas**: Hacer los cambios más pequeños posibles para corregir el error
6. **Sin Cambios de Arquitectura**: Solo corregir errores, sin refactorizar o rediseñar

**Comandos de Diagnóstico**:
```bash
# Verificación de tipos TypeScript (sin salida)
npx tsc --noEmit

# TypeScript con salida bonita
npx tsc --noEmit --pretty

# Mostrar todos los errores (no detenerse en el primero)
npx tsc --noEmit --pretty --incremental false

# Verificar archivo específico
npx tsc --noEmit path/to/file.ts

# Verificación ESLint
npx eslint . --ext .ts,.tsx,.js,.jsx

# Compilación Next.js (producción)
npm run build
```

**Flujo de Corrección de Errores**:

**1. Recopilar Todos los Errores**
```
a) Ejecutar verificación de tipos completa
   - npx tsc --noEmit --pretty
   - Capturar TODOS los errores, no solo el primero

b) Categorizar errores por tipo
   - Fallo de inferencia de tipos
   - Definiciones de tipos faltantes
   - Errores de importación/exportación
   - Errores de configuración
   - Problemas de dependencias

c) Ordenar por impacto
   - Bloquea compilación: corregir primero
   - Errores de tipo: corregir en orden
   - Advertencias: corregir si hay tiempo
```

**2. Estrategia de Corrección (Cambio Mínimo)**
```
Para cada error:

1. Entender el error
   - Leer el mensaje de error cuidadosamente
   - Verificar archivo y número de línea
   - Entender tipo esperado vs tipo real

2. Encontrar la corrección mínima
   - Agregar anotaciones de tipo faltantes
   - Corregir declaraciones de importación
   - Agregar verificaciones de null
   - Usar aserciones de tipo (último recurso)

3. Verificar que la corrección no rompe otro código
   - Ejecutar tsc después de cada corrección
   - Verificar archivos relacionados
   - Asegurar que no se introduzcan nuevos errores

4. Iterar hasta que la compilación pase
   - Corregir un error a la vez
   - Recompilar después de cada corrección
   - Hacer seguimiento del progreso (X/Y errores corregidos)
```

**Patrones Comunes de Errores y Correcciones**:

**Patrón 1: Fallo de Inferencia de Tipos**
```typescript
// ❌ ERROR: Parameter 'x' implicitly has an 'any' type
function add(x, y) {
  return x + y
}

// ✅ FIX: Add type annotations
function add(x: number, y: number): number {
  return x + y
}
```

**Patrón 2: Errores de Null/Undefined**
```typescript
// ❌ ERROR: Object is possibly 'undefined'
const name = user.name.toUpperCase()

// ✅ FIX: Optional chaining
const name = user?.name?.toUpperCase()

// ✅ OR: Null check
const name = user && user.name ? user.name.toUpperCase() : ''
```

**Patrón 3: Errores de Importación**
```typescript
// ❌ ERROR: Cannot find module '@/lib/utils'
import { formatDate } from '@/lib/utils'

// ✅ FIX 1: Verificar si los paths de tsconfig son correctos
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

// ✅ FIX 2: Usar importación relativa
import { formatDate } from '../lib/utils'
```

**Estrategia de Diferencias Mínimas**:

**CRÍTICO: Hacer los cambios más pequeños posibles**

**HACER:**
✅ Agregar anotaciones de tipo faltantes
✅ Agregar verificaciones de null necesarias
✅ Corregir importaciones/exportaciones
✅ Agregar dependencias faltantes
✅ Actualizar definiciones de tipo
✅ Corregir archivos de configuración

**NO HACER:**
❌ Refactorizar código no relacionado
❌ Cambiar arquitectura
❌ Renombrar variables/funciones (a menos que causen errores)
❌ Agregar nuevas funcionalidades
❌ Cambiar flujo lógico (a menos que corrija errores)
❌ Optimizar rendimiento
❌ Mejorar estilo de código

### 7. E2E Runner - Experto en Pruebas E2E

**Cuándo usar**: Cuando necesitas generar, mantener y ejecutar pruebas E2E.

::: tip Valor de las Pruebas de Extremo a Extremo
Las pruebas E2E son la última línea de defensa antes de producción, capturan problemas de integración que las pruebas unitarias pasan por alto.
:::

**Responsabilidades Principales**:
1. **Creación de Viajes de Prueba**: Escribir pruebas Playwright para flujos de usuario
2. **Mantenimiento de Pruebas**: Mantener las pruebas sincronizadas con cambios de UI
3. **Gestión de Pruebas Flaky**: Identificar y aislar pruebas inestables
4. **Gestión de Artifacts**: Capturar screenshots, videos, traces
5. **Integración CI/CD**: Asegurar que las pruebas se ejecuten de forma confiable en el pipeline
6. **Informes de Pruebas**: Generar informes HTML y JUnit XML

**Comandos de Prueba**:
```bash
# Ejecutar todas las pruebas E2E
npx playwright test

# Ejecutar archivo de prueba específico
npx playwright test tests/markets.spec.ts

# Ejecutar pruebas en modo headed (ver el navegador)
npx playwright test --headed

# Depurar pruebas con inspector
npx playwright test --debug

# Generar código de prueba desde acciones del navegador
npx playwright codegen http://localhost:3000

# Ejecutar pruebas con trace
npx playwright test --trace on

# Mostrar informe HTML
npx playwright show-report

# Actualizar snapshots
npx playwright test --update-snapshots

# Ejecutar pruebas en navegador específico
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

**Flujo de Trabajo de Pruebas E2E**:

**1. Fase de Planificación de Pruebas**
```
a) Identificar viajes de usuario críticos
   - Flujos de autenticación (login, logout, registro)
   - Funcionalidad principal (creación de mercado, trading, búsqueda)
   - Flujos de pago (depósito, retiro)
   - Integridad de datos (operaciones CRUD)

b) Definir escenarios de prueba
   - Happy path (todo funciona correctamente)
   - Casos límite (estados vacíos, límites)
   - Casos de error (fallos de red, validación)

c) Priorizar por riesgo
   - ALTO: Transacciones financieras, autenticación
   - MEDIO: Búsqueda, filtrado, navegación
   - BAJO: Pulido de UI, animaciones, estilos
```

**2. Fase de Creación de Pruebas**
```
Para cada viaje de usuario:

1. Escribir prueba en Playwright
   - Usar patrón Page Object Model (POM)
   - Agregar descripciones de prueba significativas
   - Agregar aserciones en pasos clave
   - Agregar screenshots en puntos críticos

2. Hacer las pruebas resilientes
   - Usar localizadores apropiados (data-testid preferido)
   - Agregar esperas para contenido dinámico
   - Manejar condiciones de carrera
   - Implementar lógica de reintentos

3. Agregar captura de artifacts
   - Screenshots en fallos
   - Grabación de video
   - Traces para depuración
   - Logs de red cuando sea necesario
```

**Estructura de Pruebas Playwright**:

**Organización de Archivos de Prueba**:
```
tests/
├── e2e/                       # Viajes de usuario de extremo a extremo
│   ├── auth/                  # Flujos de autenticación
│   │   ├── login.spec.ts
│   │   ├── logout.spec.ts
│   │   └── register.spec.ts
│   ├── markets/               # Funcionalidad de mercados
│   │   ├── browse.spec.ts
│   │   ├── search.spec.ts
│   │   ├── create.spec.ts
│   │   └── trade.spec.ts
│   ├── wallet/                # Operaciones de wallet
│   │   ├── connect.spec.ts
│   │   └── transactions.spec.ts
│   └── api/                   # Pruebas de endpoints API
│       ├── markets-api.spec.ts
│       └── search-api.spec.ts
├── fixtures/                  # Datos de prueba y utilidades
│   ├── auth.ts                # Fixtures de autenticación
│   ├── markets.ts             # Datos de prueba de mercados
│   └── wallets.ts             # Fixtures de wallet
└── playwright.config.ts       # Configuración de Playwright
```

**Patrón Page Object Model**:
```typescript
// pages/MarketsPage.ts
import { Page, Locator } from '@playwright/test'

export class MarketsPage {
  readonly page: Page
  readonly searchInput: Locator
  readonly marketCards: Locator
  readonly createMarketButton: Locator
  readonly filterDropdown: Locator

  constructor(page: Page) {
    this.page = page
    this.searchInput = page.locator('[data-testid="search-input"]')
    this.marketCards = page.locator('[data-testid="market-card"]')
    this.createMarketButton = page.locator('[data-testid="create-market-btn"]')
    this.filterDropdown = page.locator('[data-testid="filter-dropdown"]')
  }

  async goto() {
    await this.page.goto('/markets')
    await this.page.waitForLoadState('networkidle')
  }

  async searchMarkets(query: string) {
    await this.searchInput.fill(query)
    await this.page.waitForResponse(resp => resp.url().includes('/api/markets/search'))
    await this.page.waitForLoadState('networkidle')
  }

  async getMarketCount() {
    return await this.marketCards.count()
  }

  async clickMarket(index: number) {
    await this.marketCards.nth(index).click()
  }

  async filterByStatus(status: string) {
    await this.filterDropdown.selectOption(status)
    await this.page.waitForLoadState('networkidle')
  }
}
```

**Ejemplo de Prueba con Mejores Prácticas**:
```typescript
// tests/e2e/markets/search.spec.ts
import { test, expect } from '@playwright/test'
import { MarketsPage } from '../../pages/MarketsPage'

test.describe('Market Search', () => {
  let marketsPage: MarketsPage

  test.beforeEach(async ({ page }) => {
    marketsPage = new MarketsPage(page)
    await marketsPage.goto()
  })

  test('should search markets by keyword', async ({ page }) => {
    // Arrange
    await expect(page).toHaveTitle(/Markets/)

    // Act
    await marketsPage.searchMarkets('trump')

    // Assert
    const marketCount = await marketsPage.getMarketCount()
    expect(marketCount).toBeGreaterThan(0)

    // Verify first result contains search term
    const firstMarket = marketsPage.marketCards.first()
    await expect(firstMarket).toContainText(/trump/i)

    // Take screenshot for verification
    await page.screenshot({ path: 'artifacts/search-results.png' })
  })

  test('should handle no results gracefully', async ({ page }) => {
    // Act
    await marketsPage.searchMarkets('xyznonexistentmarket123')

    // Assert
    await expect(page.locator('[data-testid="no-results"]')).toBeVisible()
    const marketCount = await marketsPage.getMarketCount()
    expect(marketCount).toBe(0)
  })
})
```

**Gestión de Pruebas Flaky**:

**Identificar Pruebas Flaky**:
```bash
# Ejecutar pruebas múltiples veces para verificar estabilidad
npx playwright test tests/markets/search.spec.ts --repeat-each=10

# Ejecutar prueba específica con reintentos
npx playwright test tests/markets/search.spec.ts --retries=3
```

**Patrón de Aislamiento**:
```typescript
// Marcar prueba flaky para aislamiento
test('flaky: market search with complex query', async ({ page }) => {
  test.fixme(true, 'Test is flaky - Issue #123')

  // Código de prueba aquí...
})

// O usar skip condicional
test('market search with complex query', async ({ page }) => {
  test.skip(process.env.CI, 'Test is flaky in CI - Issue #123')

  // Código de prueba aquí...
})
```

**Causas Comunes de Flakiness y Correcciones**:

**1. Condiciones de Carrera**
```typescript
// ❌ FLAKY: Don't assume element is ready
await page.click('[data-testid="button"]')

// ✅ STABLE: Wait for element to be ready
await page.locator('[data-testid="button"]').click() // Built-in auto-wait
```

**2. Timing de Red**
```typescript
// ❌ FLAKY: Arbitrary timeout
await page.waitForTimeout(5000)

// ✅ STABLE: Wait for specific condition
await page.waitForResponse(resp => resp.url().includes('/api/markets'))
```

**3. Timing de Animaciones**
```typescript
// ❌ FLAKY: Click during animation
await page.click('[data-testid="menu-item"]')

// ✅ STABLE: Wait for animation to complete
await page.locator('[data-testid="menu-item"]').waitFor({ state: 'visible' })
await page.waitForLoadState('networkidle')
await page.click('[data-testid="menu-item"]')
```

### 8. Refactor Cleaner - Limpiador de Refactorización

**Cuándo usar**: Cuando necesitas eliminar código no utilizado, código duplicado y realizar refactorizaciones.

::: warning Operar con Precaución
Refactor Cleaner ejecuta herramientas de análisis (knip, depcheck, ts-prune) para identificar código muerto y eliminarlo de forma segura. ¡Siempre verifica completamente antes de eliminar!
:::

**Responsabilidades Principales**:
1. **Detección de Código Muerto**: Encontrar código, exportaciones, dependencias no utilizadas
2. **Eliminación de Duplicados**: Identificar y consolidar código duplicado
3. **Limpieza de Dependencias**: Eliminar paquetes e importaciones no utilizadas
4. **Refactorización Segura**: Asegurar que los cambios no rompan la funcionalidad
5. **Documentación**: Rastrear todas las eliminaciones en `DELETION_LOG.md`

**Herramientas de Detección**:
- **knip**: Encontrar archivos, exportaciones, dependencias, tipos no utilizados
- **depcheck**: Identificar dependencias npm no utilizadas
- **ts-prune**: Encontrar exportaciones TypeScript no utilizadas
- **eslint**: Verificar disable-directives y variables no utilizadas

**Comandos de Análisis**:
```bash
# Ejecutar knip para encontrar exportaciones/archivos/dependencias no utilizadas
npx knip

# Verificar dependencias no utilizadas
npx depcheck

# Encontrar exportaciones TypeScript no utilizadas
npx ts-prune

# Verificar disable-directives no utilizadas
npx eslint . --report-unused-disable-directives
```

**Flujo de Trabajo de Refactorización**:

**1. Fase de Análisis**
```
a) Ejecutar herramientas de detección en paralelo
b) Recopilar todos los hallazgos
c) Categorizar por nivel de riesgo:
   - SAFE: Exportaciones no utilizadas, dependencias no utilizadas
   - CAREFUL: Posiblemente usado vía importaciones dinámicas
   - RISKY: API pública, utilidades compartidas
```

**2. Evaluación de Riesgo**
```
Para cada elemento a eliminar:
- Verificar si está importado en algún lugar (búsqueda grep)
- Verificar que no hay importaciones dinámicas (grep patrones de string)
- Verificar si es parte de API pública
- Revisar historial para contexto
- Probar impacto en build/tests
```

**3. Proceso de Eliminación Segura**
```
a) Comenzar solo con elementos SAFE
b) Eliminar una categoría a la vez:
   1. Dependencias npm no utilizadas
   2. Exportaciones internas no utilizadas
   3. Archivos no utilizados
   4. Código duplicado
c) Ejecutar pruebas después de cada lote
d) Crear git commit para cada lote
```

**4. Consolidación de Duplicados**
```
a) Encontrar componentes/utilidades duplicadas
b) Elegir la mejor implementación:
   - Más completa en funcionalidad
   - Mejor probada
   - Usada más recientemente
c) Actualizar todas las importaciones para usar la versión seleccionada
d) Eliminar duplicados
e) Verificar que las pruebas aún pasan
```

**Formato del Log de Eliminación**:

Crear/actualizar `docs/DELETION_LOG.md` con la siguiente estructura:
```markdown
# Code Deletion Log

## [YYYY-MM-DD] Refactor Session

### Unused Dependencies Removed
- package-name@version - Last used: never, Size: XX KB
- another-package@version - Replaced by: better-package

### Unused Files Deleted
- src/old-component.tsx - Replaced by: src/new-component.tsx
- lib/deprecated-util.ts - Functionality moved to: lib/utils.ts

### Duplicate Code Consolidated
- src/components/Button1.tsx + Button2.tsx → Button.tsx
- Reason: Both implementations were identical

### Unused Exports Removed
- src/utils/helpers.ts - Functions: foo(), bar()
- Reason: No references found in codebase

### Impact
- Files deleted: 15
- Dependencies removed: 5
- Lines of code removed: 2,300
- Bundle size reduction: ~45 KB

### Testing
- All unit tests passing: ✓
- All integration tests passing: ✓
- Manual testing completed: ✓
```

**Lista de Verificación de Seguridad**:

**Antes de eliminar cualquier cosa:**
- [ ] Ejecutar herramientas de detección
- [ ] Grep todas las referencias
- [ ] Verificar importaciones dinámicas
- [ ] Revisar historial
- [ ] Verificar si es API pública
- [ ] Ejecutar todas las pruebas
- [ ] Crear rama de respaldo
- [ ] Documentar en DELETION_LOG.md

**Después de cada eliminación:**
- [ ] Build exitoso
- [ ] Pruebas pasan
- [ ] Sin errores de consola
- [ ] Commit de cambios
- [ ] Actualizar DELETION_LOG.md

**Patrones Comunes a Eliminar**:

**1. Importaciones No Utilizadas**
```typescript
// ❌ Remove unused imports
import { useState, useEffect, useMemo } from 'react' // Only useState used

// ✅ Keep only what's used
import { useState } from 'react'
```

**2. Ramas de Código Muerto**
```typescript
// ❌ Remove unreachable code
if (false) {
  // This never executes
  doSomething()
}

// ❌ Remove unused functions
export function unusedHelper() {
  // No references in codebase
}
```

**3. Componentes Duplicados**
```typescript
// ❌ Multiple similar components
components/Button.tsx
components/PrimaryButton.tsx
components/NewButton.tsx

// ✅ Consolidate to one
components/Button.tsx (with variant prop)
```

### 9. Doc Updater - Actualizador de Documentación

**Cuándo usar**: Cuando necesitas actualizar codemaps y documentación.

::: tip Sincronización de Documentación con Código
Doc Updater ejecuta `/update-codemaps` y `/update-docs`, genera `docs/CODEMAPS/*`, actualiza READMEs y guías.
:::

**Responsabilidades Principales**:
1. **Generación de Codemap**: Crear mapas de arquitectura desde la estructura del código
2. **Actualización de Documentación**: Refrescar READMEs y guías desde el código
3. **Análisis AST**: Usar TypeScript Compiler API para entender la estructura
4. **Mapeo de Dependencias**: Rastrear importaciones/exportaciones entre módulos
5. **Calidad de Documentación**: Asegurar que la documentación coincida con el código real

**Herramientas de Análisis**:
- **ts-morph**: Análisis y manipulación de AST TypeScript
- **TypeScript Compiler API**: Análisis profundo de estructura de código
- **madge**: Visualización de grafos de dependencias
- **jsdoc-to-markdown**: Generar documentación desde comentarios JSDoc

**Comandos de Análisis**:
```bash
# Analizar estructura del proyecto TypeScript (ejecutar script personalizado usando biblioteca ts-morph)
npx tsx scripts/codemaps/generate.ts

# Generar grafo de dependencias
npx madge --image graph.svg src/

# Extraer comentarios JSDoc
npx jsdoc2md src/**/*.ts
```

**Flujo de Trabajo de Generación de Codemap**:

**1. Análisis de Estructura del Repositorio**
```
a) Identificar todos los workspaces/packages
b) Mapear estructura de directorios
c) Encontrar puntos de entrada (apps/*, packages/*, services/*)
d) Detectar patrones de framework (Next.js, Node.js, etc.)
```

**2. Análisis de Módulos**
```
Para cada módulo:
- Extraer exportaciones (API pública)
- Mapear importaciones (dependencias)
- Identificar rutas (API routes, páginas)
- Encontrar modelos de base de datos (Supabase, Prisma)
- Localizar módulos de queue/worker
```

**3. Generar Codemaps**
```
Estructura:
docs/CODEMAPS/
├── INDEX.md              # Visión general de todas las áreas
├── frontend.md           # Estructura frontend
├── backend.md            # Estructura Backend/API
├── database.md           # Schema de base de datos
├── integrations.md       # Servicios externos
└── workers.md            # Tareas en segundo plano
```

**Formato de Codemap**:
```markdown
# [Area] Codemap

**Last Updated:** YYYY-MM-DD
**Entry Points:** Lista de archivos principales

## Architecture

[Diagrama ASCII de relaciones de componentes]

## Key Modules

| Module | Purpose | Exports | Dependencies |
| --- | --- | --- | --- |
| ... | ... | ... | ... |

## Data Flow

[Descripción de cómo fluyen los datos en esta área]

## External Dependencies

- package-name - Propósito, Versión
- ...

## Related Areas

Enlaces a otros codemaps que interactúan con esta área
```

**Flujo de Trabajo de Actualización de Documentación**:

**1. Extraer Documentación del Código**
```
- Leer comentarios JSDoc/TSDoc
- Extraer secciones README de package.json
- Parsear variables de entorno de .env.example
- Recopilar definiciones de endpoints API
```

**2. Actualizar Archivos de Documentación**
```
Archivos a actualizar:
- README.md - Visión general del proyecto, instrucciones de configuración
- docs/GUIDES/*.md - Guías de funcionalidades, tutoriales
- package.json - Descripción, documentación de scripts
- API documentation - Especificaciones de endpoints
```

**3. Validación de Documentación**
```
- Verificar que todos los archivos mencionados existen
- Verificar que todos los enlaces son válidos
- Asegurar que los ejemplos son ejecutables
- Verificar que los fragmentos de código compilan
```

**Ejemplo de Codemaps Específicos del Proyecto**:

**Codemap Frontend (docs/CODEMAPS/frontend.md)**:
```markdown
# Frontend Architecture

**Last Updated:** YYYY-MM-DD
**Framework:** Next.js 15.1.4 (App Router)
**Entry Point:** website/src/app/layout.tsx

## Structure

website/src/
├── app/                # Next.js App Router
│   ├── api/           # API routes
│   ├── markets/       # Páginas de mercados
│   ├── bot/           # Interacción con bot
│   └── creator-dashboard/
├── components/        # Componentes React
├── hooks/             # Hooks personalizados
└── lib/               # Utilidades

## Key Components

| Component | Purpose | Location |
| --- | --- | --- |
| HeaderWallet | Wallet connection | components/HeaderWallet.tsx |
| MarketsClient | Markets listing | app/markets/MarketsClient.js |
| SemanticSearchBar | Search UI | components/SemanticSearchBar.js |

## Data Flow

User → Markets Page → API Route → Supabase → Redis (optional) → Response

## External Dependencies

- Next.js 15.1.4 - Framework
- React 19.0.0 - UI library
- Privy - Authentication
- Tailwind CSS 3.4.1 - Styling
```

**Codemap Backend (docs/CODEMAPS/backend.md)**:
```markdown
# Backend Architecture

**Last Updated:** YYYY-MM-DD
**Runtime:** Next.js API Routes
**Entry Point:** website/src/app/api/

## API Routes

| Route | Method | Purpose |
| --- | --- | --- |
| /api/markets | GET | List all markets |
| /api/markets/search | GET | Semantic search |
| /api/market/[slug] | GET | Single market |
| /api/market-price | GET | Real-time pricing |

## Data Flow

API Route → Supabase Query → Redis (cache) → Response

## External Services

- Supabase - PostgreSQL database
- Redis Stack - Vector search
- OpenAI - Embeddings
```

**Plantilla de Actualización de README**:

Al actualizar README.md:
```markdown
# Project Name

Breve descripción

## Setup
\`\`\`bash
# Installation
npm install

# Environment variables
cp .env.example .env.local
# Fill in: OPENAI_API_KEY, REDIS_URL, etc.

# Development
npm run dev

# Build
npm run build
\`\`\`

## Architecture

See [docs/CODEMAPS/INDEX.md](docs/CODEMAPS/INDEX.md) for detailed architecture.

### Key Directories

- `src/app` - Next.js App Router páginas y API routes
- `src/components` - Componentes React reutilizables
- `src/lib` - Bibliotecas de utilidades y clientes

## Features

- [Feature 1] - Descripción
- [Feature 2] - Descripción

## Documentation

- [Setup Guide](docs/GUIDES/setup.md)
- [API Reference](docs/GUIDES/api.md)
- [Architecture](docs/CODEMAPS/INDEX.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
```

## Cuándo Invocar Qué Agente

Basándote en tu tipo de tarea, elige el agente apropiado:

| Tipo de Tarea | Invocación Recomendada | Alternativa |
| --- | --- | --- |
| **Planificar nueva funcionalidad** | `/plan` → planner agent | Invocar manualmente planner agent |
| **Diseño de arquitectura de sistema** | Invocar manualmente architect agent | `/orchestrate` → invocar agents en secuencia |
| **Escribir nueva funcionalidad** | `/tdd` → tdd-guide agent | planner → tdd-guide |
| **Corregir bug** | `/tdd` → tdd-guide agent | build-error-resolver (si es error de tipo) |
| **Revisión de código** | `/code-review` → code-reviewer agent | Invocar manualmente code-reviewer agent |
| **Auditoría de seguridad** | Invocar manualmente security-reviewer agent | code-reviewer (cobertura parcial) |
| **Fallo de compilación** | `/build-fix` → build-error-resolver agent | Corrección manual |
| **Pruebas E2E** | `/e2e` → e2e-runner agent | Escribir pruebas Playwright manualmente |
| **Limpiar código muerto** | `/refactor-clean` → refactor-cleaner agent | Eliminación manual |
| **Actualizar documentación** | `/update-docs` → doc-updater agent | `/update-codemaps` → doc-updater agent |

## Ejemplos de Colaboración de Agentes

### Escenario 1: Desarrollar Nueva Funcionalidad desde Cero

```
1. /plan (planner agent)
   - Crear plan de implementación
   - Identificar dependencias y riesgos

2. /tdd (tdd-guide agent)
   - Escribir pruebas siguiendo el plan
   - Implementar funcionalidad
   - Asegurar cobertura

3. /code-review (code-reviewer agent)
   - Revisar calidad del código
   - Verificar vulnerabilidades de seguridad

4. /verify (comando)
   - Ejecutar build, verificación de tipos, pruebas
   - Verificar console.log, estado de git
```

### Escenario 2: Corregir Errores de Compilación

```
1. /build-fix (build-error-resolver agent)
   - Corregir errores de TypeScript
   - Asegurar que el build pase

2. /test-coverage (comando)
   - Verificar si la cobertura cumple el estándar

3. /code-review (code-reviewer agent)
   - Revisar el código corregido
```

### Escenario 3: Limpieza de Código

```
1. /refactor-clean (refactor-cleaner agent)
   - Ejecutar herramientas de detección
   - Eliminar código muerto
   - Consolidar código duplicado

2. /update-docs (doc-updater agent)
   - Actualizar codemaps
   - Refrescar documentación

3. /verify (comando)
   - Ejecutar todas las verificaciones
```

## Resumen de la Lección

Everything Claude Code proporciona 9 agentes especializados, cada uno enfocado en un dominio específico:

1. **planner** - Planificación de funcionalidades complejas
2. **architect** - Diseño de arquitectura de sistemas
3. **tdd-guide** - Ejecución del flujo TDD
4. **code-reviewer** - Revisión de calidad de código
5. **security-reviewer** - Detección de vulnerabilidades de seguridad
6. **build-error-resolver** - Corrección de errores de compilación
7. **e2e-runner** - Gestión de pruebas de extremo a extremo
8. **refactor-cleaner** - Limpieza de código muerto
9. **doc-updater** - Actualización de documentación y codemap

**Principios Fundamentales**:
- Elegir el agente apropiado según el tipo de tarea
- Aprovechar la colaboración entre agentes para construir flujos de trabajo eficientes
- Las tareas complejas pueden invocar múltiples agentes en secuencia
- Siempre realizar code review después de cambios de código

## Próxima Lección

> En la próxima lección aprenderemos el **[Flujo de Desarrollo TDD](../tdd-workflow/)**.
>
> Aprenderás:
> - Cómo usar `/plan` para crear planes de implementación
> - Cómo usar `/tdd` para ejecutar el ciclo Red-Green-Refactor
> - Cómo asegurar una cobertura de pruebas del 80%+
> - Cómo usar `/verify` para ejecutar verificación completa

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver las ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-25

| Funcionalidad | Ruta del Archivo | Líneas |
| --- | --- | --- |
| Planner Agent | [agents/planner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/planner.md) | 1-120 |
| Architect Agent | [agents/architect.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/architect.md) | 1-212 |
| TDD Guide Agent | [agents/tdd-guide.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/tdd-guide.md) | 1-281 |
| Code Reviewer Agent | [agents/code-reviewer.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-105 |
| Security Reviewer Agent | [agents/security-reviewer.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/security-reviewer.md) | 1-546 |
| Build Error Resolver Agent | [agents/build-error-resolver.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/build-error-resolver.md) | 1-533 |
| E2E Runner Agent | [agents/e2e-runner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/e2e-runner.md) | 1-709 |
| Refactor Cleaner Agent | [agents/refactor-cleaner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/refactor-cleaner.md) | 1-307 |
| Doc Updater Agent | [agents/doc-updater.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/doc-updater.md) | 1-453 |

**Constantes Clave**:
- Ninguna

**Funciones Clave**:
- Ninguna

</details>
