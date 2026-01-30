---
title: "Comandos: 15 Comandos de Barra | Everything Claude Code"
subtitle: "Comandos: 15 Comandos de Barra | Everything Claude Code"
sidebarTitle: "Domina el Desarrollo con 15 Comandos"
description: "Aprende los 15 comandos de barra de Everything Claude Code. Domina el uso de comandos clave como /plan, /tdd, /code-review, /e2e, /verify para mejorar tu eficiencia de desarrollo."
tags:
  - "commands"
  - "slash-commands"
  - "workflow"
prerequisite:
  - "start-quickstart"
order: 50
---

# Comandos Principales Explicados: Guía Completa de los 15 Comandos de Barra

## Lo Que Podrás Hacer Después de Este Curso

- Iniciar rápidamente el proceso de desarrollo TDD para lograr código de alta calidad
- Crear planes de implementación sistemáticos para evitar omitir pasos clave
- Ejecutar revisiones de código completas y auditorías de seguridad
- Generar pruebas de extremo a extremo para validar flujos de usuario clave
- Corregir automáticamente errores de compilación y ahorrar tiempo de depuración
- Limpiar de forma segura código muerto y mantener el código base optimizado
- Extraer y reutilizar patrones de problemas ya resueltos
- Gestionar el estado del trabajo y puntos de control
- Ejecutar verificación completa para asegurar que el código está listo

## Tu Dificultad Actual

Durante el desarrollo, es posible que encuentres estos problemas:

- **No sabes por dónde empezar** — Ante nuevos requisitos, ¿cómo desglosar los pasos de implementación?
- **Cobertura de pruebas baja** — Escribes mucho código, pero no suficientes pruebas, lo que dificulta garantizar la calidad
- **Errores de compilación acumulados** — Después de modificar el código, los errores de tipo aparecen uno tras otro sin saber dónde corregir
- **Revisión de código poco sistemática** — Depender de la revisión visual puede hacer que se pasen por alto problemas de seguridad
- **Resolver repetidamente el mismo problema** — Vuelves a caer en los mismos pozos que ya has experimentado

Los 15 comandos de barra de Everything Claude Code están diseñados para resolver estos puntos dolorosos.

## Concepto Clave

**Los comandos son los puntos de entrada del flujo de trabajo**. Cada comando encapsula un proceso de desarrollo completo, invocando el agent o skill correspondiente para ayudarte a completar tareas específicas.

::: tip Comandos vs Agents vs Skills

- **Comandos**: Puntos de entrada directos que ingresas en Claude Code (como `/tdd`, `/plan`)
- **Agentes**: Subagentes profesionales invocados por los comandos, responsables de la ejecución específica
- **Skills**: Definiciones de flujo de trabajo y conocimiento de dominio que los agentes pueden referenciar

Un comando suele invocar uno o más agentes, y los agentes pueden referenciar skills relacionados.

:::

## Resumen de Comandos

Los 15 comandos clasificados por función:

| Categoría | Comando | Propósito |
|--- | --- | ---|
| **Flujo de Desarrollo** | `/plan` | Crear plan de implementación |
| | `/tdd` | Ejecutar desarrollo guiado por pruebas |
| | `/orchestrate` | Ejecutar secuencia de múltiples agentes |
| **Calidad de Código** | `/code-review` | Revisión de código |
| | `/build-fix` | Corregir errores de compilación |
| | `/refactor-clean` | Limpiar código muerto |
| | `/verify` | Verificación completa |
| **Pruebas** | `/e2e` | Pruebas de extremo a extremo |
| | `/test-coverage` | Analizar cobertura de pruebas |
| | `/eval` | Gestionar desarrollo dirigido por evaluaciones |
| **Documentación y Arquitectura** | `/update-docs` | Sincronizar documentación |
| | `/update-codemaps` | Actualizar documentación de arquitectura |
| **Gestión de Estado** | `/checkpoint` | Guardar estado de trabajo |
| **Aprendizaje y Optimización** | `/learn` | Extraer patrones reutilizables |
| **Configuración** | `/setup-pm` | Configurar gestor de paquetes |

## Comandos de Flujo de Desarrollo

### /plan: Planificar Funcionalidades Complejas

**Propósito**: Antes de comenzar a codificar, crear un plan de implementación detallado.

**Escenarios de Uso**:
- Iniciar el desarrollo de nuevas funcionalidades
- Realizar cambios importantes en la arquitectura
- Requisitos poco claros o ambiguos
- Modificaciones colaborativas en múltiples archivos/componentes

**Flujo de Trabajo**:

```
1. Reformular requisitos
   ↓
2. Identificar riesgos y dependencias
   ↓
3. Dividir en fases específicas
   ↓
4. Esperar tu confirmación
```

::: warning Características Clave

El agente planner **no escribirá ningún código** hasta que confirmes explícitamente el plan.

:::

**Ejemplo**:

```
Tú: /plan Necesito agregar funcionalidad de notificaciones en tiempo real

Claude:
# Plan de Implementación: Notificaciones de Resolución de Mercado en Tiempo Real

## Reformulación de Requisitos
- Enviar notificaciones cuando se resuelven los mercados
- Soportar múltiples canales (en la aplicación, correo electrónico, webhook)
- Asegurar entrega confiable
- Incluir resultado del mercado y resultado de la posición del usuario

## Fases de Implementación
### Fase 1: Esquema de Base de Datos
- Agregar tabla de notificaciones
- Agregar tabla de preferencias de notificaciones de usuario
- Crear índices

### Fase 2: Servicio de Notificaciones
- Crear cola de notificaciones usando BullMQ/Redis
- Implementar lógica de reintento
- Crear plantillas de notificaciones

...

ESPERANDO CONFIRMACIÓN: ¿Proceder con este plan? (yes/no/modify)
```

**Mejores Prácticas**:
- ✅ Planificar antes de implementar funcionalidades complejas
- ✅ Revisar cuidadosamente riesgos y dependencias
- ✅ Ejecutar por fases, validando cada fase
- ❌ No omitir la planificación

---

### /tdd: Desarrollo Guiado por Pruebas

**Propósito**: Forzar la ejecución del flujo TDD, asegurando cobertura de pruebas ≥ 80%.

**Escenarios de Uso**:
- Implementar nuevas funcionalidades
- Corregir errores (primero escribir una prueba que reproduzca el error)
- Refactorizar código existente
- Escribir lógica de negocio clave

**Ciclo TDD**:

```
RED → GREEN → REFACTOR → REPEAT

RED:      Escribir una prueba que falle
GREEN:    Escribir el mínimo código para que la prueba pase
REFACTOR: Mejorar el código manteniendo las pruebas pasando
REPEAT:   Siguiente funcionalidad/escenario
```

::: warning Requisito Obligatorio

**Debes escribir la prueba primero, luego el código**. No puedes omitir la fase RED.

:::

**Ejemplo**:

```
Tú: /tdd Necesito una función para calcular el puntaje de liquidez del mercado

Claude (agente tdd-guide):
## Paso 1: Definir Interfaz (SCAFFOLD)
```typescript
export interface MarketData {
  totalVolume: number
  bidAskSpread: number
  activeTraders: number
  lastTradeTime: Date
}
```

## Paso 2: Escribir Prueba Fallida (RED)
```typescript
test('debería devolver puntaje alto para mercado líquido', () => {
  const market = { ... }
  expect(calculateLiquidityScore(market)).toBeGreaterThan(80)
})
```

## Paso 3: Ejecutar Pruebas - Verificar FALLO
```bash
npm test lib/liquidity.test.ts
FAIL ✕ debería devolver puntaje alto para mercado líquido
  Error: No implementado
```

## Paso 4: Implementar Código Mínimo (GREEN)
```typescript
export function calculateLiquidityScore(market: MarketData): number {
  // Implementar código...
}
```

## Paso 5: Ejecutar Pruebas - Verificar PASO
```bash
npm test lib/liquidity.test.ts
PASS ✓ debería devolver puntaje alto para mercado líquido
```

## Paso 6: Refactorizar (IMPROVE)
// Mejorar estructura de código...

## Paso 7: Verificar que las Pruebas Siguen Pasando
```bash
npm test lib/liquidity.test.ts
PASS ✓ todas las pruebas pasan
```

## Paso 8: Verificar Cobertura
Cobertura: 100% ✅ (Objetivo: 80%)
```

**Mejores Prácticas**:
- ✅ Escribir primero la definición de interfaz
- ✅ Implementar después de que la prueba falle
- ✅ Probar inmediatamente después de escribir cada funcionalidad
- ✅ Verificar que las pruebas pasan antes y después de refactorizar
- ✅ Cobertura ≥ 80% (código crítico 100%)
- ❌ No escribir demasiado código antes de probar
- ❌ No omitir la fase RED
- ❌ No probar detalles de implementación

---

### /orchestrate: Ejecutar Secuencia de Agents

**Propósito**: Automatizar la ejecución de flujos de trabajo en secuencia de múltiples agents.

**Escenarios de Uso**:
- Desarrollo de funcionalidad completa (planner → tdd-guide → code-reviewer → security-reviewer)
- Flujo de corrección de errores (explorer → tdd-guide → code-reviewer)
- Revisión de seguridad (security-reviewer → code-reviewer → architect)

**Tipos de Flujo de Trabajo**:

| Tipo de Flujo de Trabajo | Secuencia de Agents |
|--- | ---|
| `feature` | planner → tdd-guide → code-reviewer → security-reviewer |
| `bugfix` | explorer → tdd-guide → code-reviewer |
| `refactor` | architect → code-reviewer → tdd-guide |
| `security` | security-reviewer → code-reviewer → architect |

**Ejemplo**:

```
Tú: /orchestrate feature "Agregar funcionalidad de autenticación de usuario"

Claude:
### REPORTE DE ORQUESTACIÓN
Flujo de Trabajo: feature
Tarea: Agregar funcionalidad de autenticación de usuario
Agents: planner → tdd-guide → code-reviewer → security-reviewer

RESUMEN
-------
Funcionalidad de autenticación de usuario implementada exitosamente, incluyendo registro, inicio de sesión y gestión de sesiones.

SALIDA DE AGENTES
-----------------
Planner: Creó plan de implementación de 4 fases
TDD Guide: Implementó servicio de autenticación con cobertura 95%
Code Reviewer: Encontró 3 problemas de alta prioridad, corregidos
Security Reviewer: Aprobó auditoría de seguridad, sin vulnerabilidades

ARCHIVOS MODIFICADOS
-----------------
- src/services/auth.ts
- src/api/auth/route.ts
- tests/auth.test.ts
- ...

RESULTADOS DE PRUEBAS
------------
PASS: 24/24 pruebas (100%)

ESTADO DE SEGURIDAD
---------------
✅ No se encontraron vulnerabilidades

RECOMENDACIÓN
--------------
✅ SHIP - Listo para producción
```

**Mejores Prácticas**:
- ✅ Usar orchestrate para funcionalidades complejas
- ✅ Documentos claros de transferencia entre cada agent
- ✅ Ejecución paralela de verificaciones independientes (code-reviewer y security-reviewer)
- ❌ No usar orchestrate en tareas simples

---

## Comandos de Calidad de Código

### /code-review: Revisión de Código

**Propósito**: Revisar completamente el código no confirmado, verificando problemas de seguridad y calidad de código.

**Escenarios de Uso**:
- Antes de confirmar código
- Antes de fusionar PR
- Después de completar el desarrollo de funcionalidades

**Elementos de Verificación**:

| Categoría | Contenido de Verificación | Severidad |
|--- | --- | ---|
| **Seguridad** | Claves codificadas, inyección SQL, XSS, falta de validación de entrada | CRITICAL |
| **Calidad de Código** | Funciones > 50 líneas, archivos > 800 líneas, profundidad de anidamiento > 4 | HIGH |
| **Mejores Prácticas** | Patrones de mutación, console.log, falta de pruebas, TODO/FIXME | MEDIUM |

**Ejemplo**:

```
Tú: /code-review

Claude (agente code-reviewer):
# Informe de Revisión de Código

## Problemas de Seguridad (CRITICAL)
🔴 [HIGH] Clave de API codificada
Archivo: src/api/github.ts:15
Problema: Token de GitHub está codificado
Solución: Mover a variable de entorno

## Calidad de Código (HIGH)
🟡 [MEDIUM] Función excede 50 líneas
Archivo: src/utils/formatter.ts:62
Líneas: 78
Problema: Función FormatLargeData es demasiado larga
Solución: Dividir en funciones más pequeñas

## Mejores Prácticas (MEDIUM)
🟢 [LOW] Comentario TODO
Archivo: src/services/user.ts:45
Problema: TODO: Agregar limitación de velocidad
Solución: Implementar o eliminar comentario

RESUMEN
--------
CRITICAL: 1 (Debe corregir antes de confirmar)
HIGH: 2 (Debería corregir)
MEDIUM: 3 (Deseable)

❌ BLOQUEADO - Se encontraron problemas de seguridad críticos
```

::: danger Regla de Bloqueo de Confirmación

Si se encuentran problemas de nivel **CRITICAL** o **HIGH**, se bloqueará la confirmación.

:::

---

### /build-fix: Corregir Errores de Compilación

**Propósito**: Corregir errores de TypeScript y compilación uno por uno.

**Escenarios de Uso**:
- Ejecutar `npm run build` falla
- Errores de tipo TypeScript
- Errores de compilación

**Flujo de Trabajo**:

```
1. Ejecutar compilación
   ↓
2. Analizar salida de errores, ordenar por severidad
   ↓
3. Corregir uno por uno:
   - Mostrar contexto del error
   - Explicar problema
   - Proponer solución
   - Aplicar corrección
   - Reejecutar compilación
   ↓
4. Generar resumen de correcciones
```

**Ejemplo**:

```
Tú: /build-fix

Claude (agente build-error-resolver):
# Corrigiendo Errores de Compilación

Ejecutando compilación: npm run build
Se encontraron 5 errores

## Error 1: Type 'string' is not assignable to type 'number'
Archivo: src/calculator.ts:15
```typescript
const result = add("10", "20")  // Error
```
Problema: función add espera números, recibió cadenas
Solución: Convertir a números
```typescript
const result = add(Number("10"), Number("20"))
```
✅ Corregido. Reejecutando compilación...

## Error 2: Cannot find module './utils'
Archivo: src/index.ts:3
Problema: Ruta de importación incorrecta
Solución: Cambiar a './utils/helper'
```typescript
import { helper } from './utils/helper'
```
✅ Corregido. Reejecutando compilación...

...

RESUMEN
-------
Errores Corregidos: 5
Errores Restantes: 0
Estado de Compilación: ✅ PASS
```

::: tip Seguridad Primero

Corregir solo un error a la vez para evitar introducir nuevos problemas.

:::

---

### /refactor-clean: Limpiar Código Muerto

**Propósito**: Identificar y eliminar de forma segura código no utilizado.

**Escenarios de Uso**:
- Código base con muchos archivos y exportaciones no utilizadas
- Reducir carga de mantenimiento
- Mejorar legibilidad del código

**Flujo de Trabajo**:

```
1. Ejecutar herramientas de análisis de código muerto
   - knip: buscar exportaciones y archivos no utilizados
   - depcheck: buscar dependencias no utilizadas
   - ts-prune: buscar exportaciones TypeScript no utilizadas
   ↓
2. Generar informe completo
   ↓
3. Clasificar por severidad
   - SAFE: archivos de prueba, funciones de utilidad no utilizadas
   - CAUTION: rutas API, componentes
   - DANGER: archivos de configuración, archivos de entrada
   ↓
4. Eliminar uno por uno (primero probar)
   ↓
5. Generar resumen de limpieza
```

**Ejemplo**:

```
Tú: /refactor-clean

Claude (agente refactor-cleaner):
# Análisis de Código Muerto

## Herramientas Ejecutadas
- ✅ knip: Se encontraron 12 exportaciones no utilizadas
- ✅ depcheck: Se encontraron 5 dependencias no utilizadas
- ✅ ts-prune: Se encontraron 8 exportaciones TypeScript no utilizadas

## Clasificación

### SAFE (Puede eliminar)
- `src/utils/old-helper.ts` - Función de utilidad no utilizada
- `src/components/Button.tsx` - No utilizado en ningún lugar
- `lodash` - Dependencia no utilizada

### CAUTION (Revisar primero)
- `src/api/users.ts` - Solo usado en pruebas
- `@types/node` - Puede ser usado en scripts de compilación

### DANGER (No eliminar)
- `src/index.ts` - Punto de entrada principal
- `tsconfig.json` - Archivo de configuración

## Plan de Eliminación

Ejecutar suite de pruebas completa primero:
✅ Pruebas pasando (cobertura 98%)

Eliminando elementos SAFE...

1. Eliminando src/utils/old-helper.ts
   ✅ Pruebas siguen pasando

2. Eliminando src/components/Button.tsx
   ✅ Pruebas siguen pasando

3. Eliminando lodash de package.json
   ✅ Pruebas siguen pasando

RESUMEN
-------
Archivos eliminados: 12
Dependencias eliminadas: 5
Pruebas siguen pasando: ✅
```

::: warning Pruebas Primero

**Debe ejecutar las pruebas antes de eliminar código** para asegurar que no rompe funcionalidad existente.

:::

---

### /verify: Verificación Completa

**Propósito**: Ejecutar verificaciones completas de código.

**Escenarios de Uso**:
- Antes de confirmar código
- Antes de fusionar PR
- Antes de preparar un lanzamiento

**Elementos de Verificación** (en orden):

1. **Verificación de Compilación** - Ejecutar comando de compilación
2. **Verificación de Tipos** - Ejecutar verificador TypeScript
3. **Verificación Lint** - Ejecutar linter
4. **Suite de Pruebas** - Ejecutar todas las pruebas, reportar cobertura
5. **Auditoría Console.log** - Buscar console.log en archivos fuente
6. **Estado Git** - Mostrar cambios no confirmados

**Ejemplo**:

```
Tú: /verify pre-pr

Claude:
# Informe de Verificación

VERIFICACIÓN: ✅ PASS

Compilación:    ✅ OK
Tipos:          ✅ OK (0 errores)
Lint:           ✅ OK (0 problemas)
Pruebas:        ✅ 142/145 pasaron, 98% cobertura
Secretos:       ✅ OK (0 encontrados)
Logs:           ⚠️ 3 console.logs encontrados

Ubicaciones de console.log:
- src/utils/logger.ts:15 (logger intencional)
- src/api/webhook.ts:42 (debug, eliminar antes de confirmar)
- src/services/auth.ts:89 (debug, eliminar antes de confirmar)

Listo para PR: ⚠️ YES (eliminar logs de debug)

Archivos modificados desde el último commit:
- src/api/webhook.ts (nuevo)
- src/services/auth.ts (modificado)
- tests/auth.test.ts (modificado)
```

**Parámetros**:
- `quick` - Solo compilación + verificación de tipos
- `full` - Todas las verificaciones (predeterminado)
- `pre-commit` - Verificaciones relacionadas con confirmación
- `pre-pr` - Verificación completa + escaneo de seguridad

---

## Comandos de Pruebas

### /e2e: Pruebas de Extremo a Extremo

**Propósito**: Generar y ejecutar pruebas de extremo a extremo usando Playwright.

**Escenarios de Uso**:
- Probar flujos de usuario clave (inicio de sesión, transacciones, pagos)
- Validar integración de extremo a extremo de flujos de múltiples pasos
- Probar interacciones UI y navegación
- Preparar despliegue a producción

**Flujo de Trabajo**:

```
1. Analizar flujo de usuario, identificar escenarios de prueba
   ↓
2. Generar pruebas Playwright (usando patrón Page Object)
   ↓
3. Ejecutar pruebas en múltiples navegadores (Chrome, Firefox, Safari)
   ↓
4. Capturar capturas de pantalla, videos, trazas al fallar
   ↓
5. Generar informe con resultados y artefactos
   ↓
6. Identificar pruebas inestables y sugerir correcciones
```

**Ejemplo**:

```
Tú: /e2e Probar flujo de búsqueda y visualización de mercado

Claude (agente e2e-runner):
# Generación de Prueba E2E: Flujo de Búsqueda y Visualización de Mercado

## Escenario de Prueba Identificado
**Recorrido del Usuario:** Búsqueda de Mercado → Ver Resultados → Hacer Clic en Mercado → Ver Detalles

## Código de Prueba Generado
```typescript
import { test, expect } from '@playwright/test'
import { MarketsPage } from '../../pages/MarketsPage'

test('el usuario puede buscar mercados y ver detalles', async ({ page }) => {
  const marketsPage = new MarketsPage(page)
  await marketsPage.goto()

  // Realizar búsqueda
  await marketsPage.searchMarkets('election')
  await page.waitForResponse(resp =>
    resp.url().includes('/api/markets/search') && resp.status() === 200
  )

  // Verificar resultados
  const marketCards = marketsPage.marketCards
  await expect(marketCards.first()).toBeVisible()

  // Hacer clic en primer resultado
  await marketCards.first().click()

  // Verificar que la página de detalles de mercado se carga
  await expect(page).toHaveURL(/\/markets\/[a-z0-9-]+/)
  await expect(page.locator('[data-testid="market-name"]')).toBeVisible()
})
```

## Ejecutando Pruebas
```bash
npx playwright test tests/e2e/markets/search-and-view.spec.ts

✓ [chromium] el usuario puede buscar mercados y ver detalles (4.2s)
✓ [chromium] búsqueda sin resultados muestra estado vacío (1.8s)

2 passed (6.0s)

Artefactos generados:
- artifacts/search-results.png
- artifacts/market-details.png
- playwright-report/index.html
```

## Informe de Prueba
╔══════════════════════════════════════════════════════╗
║ Estado:     ✅ TODAS LAS PRUEBAS PASARON              ║
║ Total:      2 pruebas                                ║
║ Pasadas:    2 (100%)                                 ║
║ Inestables: 0                                         ║
╚══════════════════════════════════════════════════════╝
```

**Comandos Rápidos**:

```bash
# Ejecutar todas las pruebas E2E
npx playwright test

# Ejecutar archivo de prueba específico
npx playwright test tests/e2e/markets/search.spec.ts

# Ejecutar en modo con interfaz (ver navegador)
npx playwright test --headed

# Depurar pruebas
npx playwright test --debug

# Ver informe
npx playwright show-report
```

**Mejores Prácticas**:
- ✅ Usar Page Object Model para mejorar mantenibilidad
- ✅ Usar atributos data-testid como selectores
- ✅ Esperar respuestas API, no tiempos arbitrarios
- ✅ Probar flujos de usuario clave
- ❌ No usar selectores frágiles (clases CSS cambian)
- ❌ No probar detalles de implementación

---

### /test-coverage: Análisis de Cobertura de Pruebas

**Propósito**: Analizar cobertura de pruebas y generar pruebas faltantes.

**Escenarios de Uso**:
- Cobertura inferior al 80%
- Necesidad de complementar pruebas

**Flujo de Trabajo**:

```
1. Ejecutar pruebas con cobertura
   ↓
2. Analizar informe de cobertura (coverage/coverage-summary.json)
   ↓
3. Identificar archivos con cobertura inferior al 80%
   ↓
4. Para cada archivo con cobertura insuficiente:
   - Analizar rutas de código no probadas
   - Generar pruebas unitarias de funciones
   - Generar pruebas de integración de API
   ↓
5. Verificar que nuevas pruebas pasan
   ↓
6. Mostrar métricas de cobertura antes y después
```

**Ejemplo**:

```
Tú: /test-coverage

Claude:
# Análisis de Cobertura de Pruebas

Ejecutando pruebas con cobertura...
npm test --coverage

## Informe de Cobertura

Archivo                      | % Stmts | % Branch | % Funcs | % Lines
----------------------------|---------|----------|---------|--------
src/services/auth.ts        |   92    |   88     |   100   |   91
src/utils/formatter.ts      |   65    |   50     |   75    |   63  ⚠️
src/api/users.ts            |   100   |   100    |   100   |   100
src/components/Button.tsx   |   45    |   30     |   50    |   44  ⚠️

General                     |   78    |   72     |   85    |   76  ⚠️

Objetivo: 80%
Actual: 76% ❌ Necesita mejorar

## Generando Pruebas Faltantes

### Archivo: src/utils/formatter.ts (65% cobertura)
Rutas no probadas:
- FormatCurrency con valores negativos
- FormatDate con configuración regional personalizada
- TruncateText con cadenas largas

Generando pruebas...
```typescript
describe('formatter', () => {
  it('debería formatear moneda negativa', () => {
    expect(formatCurrency(-100)).toBe('-$100.00')
  })

  it('debería formatear fecha con configuración regional', () => {
    expect(formatDate(new Date(), 'ja-JP')).toMatch('2024年')
  })

  it('debería truncar texto largo', () => {
    expect(truncateText('a'.repeat(100), 10)).toBe('aaaaaaaaaa...')
  })
})
```

### Archivo: src/components/Button.tsx (45% cobertura)
Rutas no probadas:
- Estado deshabilitado
- Estado de carga
- Manejador onClick

Generando pruebas...

## Después de Agregar Pruebas

Ejecutando pruebas nuevamente...

Archivo                      | % Stmts | % Branch | % Funcs | % Lines
----------------------------|---------|----------|---------|--------
src/services/auth.ts        |   92    |   88     |   100   |   91
src/utils/formatter.ts      |   100   |   95     |   100   |   99  ✅
src/api/users.ts            |   100   |   100    |   100   |   100
src/components/Button.tsx   |   95    |   90     |   100   |   94  ✅

General                     |   95    |   92     |   100   |   94  ✅

Objetivo: 80%
Actual: 94% ✅ EXCEDIDO

Resumen: +12 pruebas agregadas, Cobertura: 76% → 94%
```

---

### /eval: Desarrollo Dirigido por Evaluaciones

**Propósito**: Gestionar flujo de trabajo de desarrollo dirigido por evaluaciones.

**Escenarios de Uso**:
- Desarrollo dirigido por evaluaciones (EDD)
- Pruebas de aceptación de funcionalidad
- Pruebas de regresión

**Subcomandos**:

- `define <name>` - Crear nueva definición de evaluación
- `check <name>` - Ejecutar y verificar evaluaciones
- `report <name>` - Generar informe completo
- `list` - Mostrar todas las evaluaciones

**Ejemplo - Definir Eval**:

```
Tú: /eval define user-auth

Claude:
Creando definición de evaluación...

.claude/evals/user-auth.md:

## EVAL: user-auth
Creado: 2026-01-25

### Evaluaciones de Capacidad
- [ ] El usuario puede registrarse con correo y contraseña
- [ ] El usuario puede iniciar sesión con credenciales correctas
- [ ] El usuario no puede iniciar sesión con contraseña incorrecta
- [ ] El usuario puede restablecer contraseña por correo

### Evaluaciones de Regresión
- [ ] Los usuarios existentes aún pueden iniciar sesión
- [ ] Los tokens de sesión aún funcionan
- [ ] El inicio de sesión OAuth aún funciona

### Criterios de Éxito
- pass@3 > 90% para evaluaciones de capacidad
- pass^3 = 100% para evaluaciones de regresión

Por favor complete los criterios de evaluación específicos...
```

**Ejemplo - Verificar Eval**:

```
Tú: /eval check user-auth

Claude:
Ejecutando evaluaciones...

VERIFICACIÓN DE EVAL: user-auth
==========================
Capacidad: 2/4 pasando
Regresión: 2/3 pasando
Estado: EN PROGRESO

Resultados de Capacidad:
✅ El usuario puede registrarse con correo y contraseña
✅ El usuario puede iniciar sesión con credenciales correctas
❌ El usuario no puede iniciar sesión con contraseña incorrecta (falla intermitentemente)
❌ El usuario puede restablecer contraseña por correo (no implementado)

Resultados de Regresión:
✅ Los usuarios existentes aún pueden iniciar sesión
✅ Los tokens de sesión aún funcionan
❌ El inicio de sesión OAuth aún funciona (prueba fallando por límite de velocidad)

RECOMENDACIÓN: NECESITA TRABAJO - Corregir validación de contraseña e implementar restablecimiento de contraseña
```

**Ejemplo - Informe Eval**:

```
Tú: /eval report user-auth

Claude:
Generando informe completo...

INFORME DE EVAL: user-auth
========================
Generado: 2026-01-25

EVALUACIONES DE CAPACIDAD
----------------
[register-email-pass]: PASS (pass@1)
[login-credentials-pass]: PASS (pass@2) - reintento requerido
[login-wrong-pass-fail]: FAIL - ver notas
[password-reset-pass]: FAIL - no implementado

EVALUACIONES DE REGRESIÓN
----------------
[existing-users-login]: PASS
[session-tokens]: PASS
[oauth-login]: PASS

MÉTRICAS
-------
Capacidad pass@1: 50%
Capacidad pass@3: 100%
Regresión pass^3: 100%

NOTAS
-----
La prueba de validación de contraseña es inestable debido a problema de sincronización.
Necesita implementar flujo de restablecimiento de contraseña.

RECOMENDACIÓN
--------------
NECESITA TRABAJO - Completar implementación de restablecimiento de contraseña
```

---

## Comandos de Documentación y Arquitectura

### /update-docs: Sincronizar Documentación

**Propósito**: Sincronizar documentación desde código fuente.

**Escenarios de Uso**:
- Actualizar documentación después de cambios en código
- Mantener documentación sincronizada con código

**Flujo de Trabajo**:

```
1. Leer sección scripts de package.json
   - Generar tabla de referencia de scripts
   - Extraer descripciones de comentarios
   ↓
2. Leer .env.example
   - Extraer todas las variables de entorno
   - Registrar propósitos y formatos
   ↓
3. Generar docs/CONTRIB.md
   - Flujo de trabajo de desarrollo
   - Scripts disponibles
   - Configuración de entorno
   - Procedimientos de prueba
   ↓
4. Generar docs/RUNBOOK.md
   - Procedimientos de despliegue
   - Monitoreo y alertas
   - Problemas comunes y soluciones
   - Procedimientos de reversión
   ↓
5. Identificar documentación obsoleta
   - Encontrar documentación no modificada en 90+ días
   - Listar para revisión humana
   ↓
6. Mostrar resumen de diff
```

::: tip Fuente Única de Verdad

package.json y .env.example son la única fuente de verdad.

:::

---

### /update-codemaps: Actualizar Documentación de Arquitectura

**Propósito**: Analizar estructura de código base y actualizar documentación de arquitectura.

**Escenarios de Uso**:
- Después de cambios en estructura de código
- Necesidad de actualizar documentación de arquitectura

**Flujo de Trabajo**:

```
1. Escanear todos los archivos fuente para importaciones, exportaciones y dependencias
   ↓
2. Generar codemaps concisos:
   - codemaps/architecture.md - arquitectura general
   - codemaps/backend.md - estructura de backend
   - codemaps/frontend.md - estructura de frontend
   - codemaps/data.md - modelos de datos y esquemas
   ↓
3. Calcular porcentaje diff con versión anterior
   ↓
4. Si cambio > 30%, solicitar aprobación de usuario antes de actualizar
   ↓
5. Agregar marca de tiempo de frescura para cada codemap
   ↓
6. Guardar informe en .reports/codemap-diff.txt
```

**Ejemplo**:

```
Tú: /update-codemaps

Claude:
Analizando estructura de código base...

Escaneando 156 archivos...
Se encontraron 89 importaciones y 124 exportaciones

## Diff de Codemap

Versión anterior: 2026-01-20
Versión actual: 2026-01-25
Diff: 12% (bajo umbral del 30%)

✅ Es seguro actualizar

## Codemaps Actualizados

codemaps/architecture.md
- Actualizadas dependencias de módulos
- Agregados nuevos servicios: auth, notifications
- Eliminados módulos obsoletos: legacy-db

codemaps/backend.md
- Actualizada estructura de rutas API
- Agregada documentación de middleware

codemaps/frontend.md
- Actualizada jerarquía de componentes
- Agregadas nuevas páginas: profile, settings

codemaps/data.md
- Actualizados esquemas de base de datos
- Agregadas nuevas tablas: users, sessions

Resumen: 4 codemaps actualizados, 12% cambio
```

---

## Comandos de Gestión de Estado

### /checkpoint: Guardar Estado de Trabajo

**Propósito**: Crear o verificar puntos de control en el flujo de trabajo.

**Escenarios de Uso**:
- Guardar etapas importantes de desarrollo
- Soportar reversión y seguimiento de progreso

**Subcomandos**:

- `create <name>` - Crear punto de control con nombre
- `verify <name>` - Verificar punto de control
- `list` - Mostrar todos los puntos de control
- `clear` - Eliminar puntos de control antiguos (mantener últimos 5)

**Ejemplo**:

```
Tú: /checkpoint create feature-start

Claude:
# Creando Punto de Control: feature-start

Ejecutando /verify quick...

Compilación: ✅ OK
Tipos: ✅ OK

Creando punto de control...

✅ Punto de control "feature-start" creado
├─ Marca de tiempo: 2026-01-25-14:30
├─ Git SHA: abc1234
└─ Estado: Limpio (sin cambios no confirmados)
```

```
Tú: /checkpoint verify feature-start

Claude:
COMPARACIÓN DE PUNTO DE CONTROL: feature-start
==========================
Archivos modificados: 5
Pruebas: +3 pasadas / -0 falladas
Cobertura: +5% / -0%
Compilación: PASS

Cambios desde el punto de control:
✅ src/services/auth.ts (modificado)
✅ tests/auth.test.ts (agregado)
✅ src/components/Login.tsx (agregado)
```

**Flujo de Trabajo**:

```
[Inicio] → /checkpoint create "feature-start"
   |
[Implementar] → /checkpoint create "core-done"
   |
[Probar] → /checkpoint verify "core-done"
   |
[Refactorizar] → /checkpoint create "refactor-done"
   |
[PR] → /checkpoint verify "feature-start"
```

---

## Comandos de Aprendizaje y Optimización

### /learn: Extraer Patrones Reutilizables

**Propósito**: Analizar sesión actual y extraer patrones que pueden guardarse como skills.

**Escenarios de Uso**:
- Después de resolver problemas no triviales
- Descubrir patrones reutilizables de resolución de errores
- Documentar convenciones específicas del proyecto

**Contenido Extraído**:

1. **Patrones de Resolución de Errores**
   - ¿Qué error ocurrió?
   - ¿Cuál fue la causa raíz?
   - ¿Cómo se corrigió?
   - ¿Es reutilizable para errores similares?

2. **Técnicas de Depuración**
   - Pasos de depuración no obvios
   - Combinaciones efectivas de herramientas
   - Patrones de diagnóstico

3. **Workarounds**
   - Quirks de bibliotecas
   - Limitaciones de API
   - Correcciones específicas de versión

4. **Patrones Específicos del Proyecto**
   - Convenciones de código base descubiertas
   - Decisiones arquitectónicas tomadas
   - Patrones de integración

**Ejemplo**:

```
Tú: /learn

Claude:
# Extrayendo Patrones de la Sesión

Revisando historial de sesión...

Se encontraron 3 patrones extraíbles:

## Patrón 1: Recuperación de Sesión de Auth de Supabase
**Tipo:** Resolución de Errores
**Reutilizabilidad:** Alta (afecta todos los endpoints de autenticación)

### Problema
Después de que el usuario inicia sesión, las llamadas API posteriores fallan con 401 No Autorizado.

### Causa Raíz
La cookie de sesión de Supabase no se está enviando al API de backend debido a configuración CORS.

### Solución
```typescript
// Configurar Supabase con URL correcta
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      storageKey: 'my-app-auth',
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)
```

### Cuándo Usar
Disparador: Endpoints de autenticación devolviendo 401 inesperadamente

---

## Patrón 2: Corrección de Inestabilidad de Prueba Playwright
**Tipo:** Técnica de Depuración
**Reutilizabilidad:** Media (afecta pruebas UI asíncronas)

### Problema
La prueba "el usuario puede hacer clic en botón de enviar" falla intermitentemente con tiempo de espera.

### Causa Raíz
El botón está deshabilitado inicialmente debido a validación asíncrona, pero la prueba no espera.

### Solución
```typescript
// Usar espera explícita con predicado
await page.waitForSelector('[data-testid="submit-btn"]:not(:disabled)', {
  timeout: 10000
})

// Luego hacer clic
await page.locator('[data-testid="submit-btn"]').click()
```

### Cuándo Usar
Disparador: Problemas de sincronización en pruebas con estado UI asíncrono

---

¿Deseas guardar estos patrones? (yes/no/modify)
```

::: tip Principio de Enfoque

Extraer un patrón a la vez para mantener los skills enfocados.

:::

---

## Comandos de Configuración

### /setup-pm: Configurar Gestor de Paquetes

**Propósito**: Configurar gestor de paquetes preferido a nivel de proyecto o global.

**Escenarios de Uso**:
- Detectar gestor de paquetes actualmente en uso
- Establecer preferencias globales o de proyecto

**Prioridad de Detección**:

1. Variable de entorno: `CLAUDE_PACKAGE_MANAGER`
2. Configuración de proyecto: `.claude/package-manager.json`
3. package.json: campo `packageManager`
4. Archivos de bloqueo: package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb
5. Configuración global: `~/.claude/package-manager.json`
6. Respaldo: primer gestor de paquetes disponible

**Prioridad de Gestores de Paquetes Soportados**: pnpm > bun > yarn > npm

**Ejemplo**:

```bash
# Detectar gestor de paquetes actual
node scripts/setup-package-manager.js --detect

# Establecer preferencia global
node scripts/setup-package-manager.js --global pnpm

# Establecer preferencia de proyecto
node scripts/setup-package-manager.js --project bun

# Listar gestores de paquetes disponibles
node scripts/setup-package-manager.js --list
```

**Archivos de Configuración**:

Configuración global (`~/.claude/package-manager.json`):
```json
{
  "packageManager": "pnpm"
}
```

Configuración de proyecto (`.claude/package-manager.json`):
```json
{
  "packageManager": "bun"
}
```

Variable de entorno anula todos los métodos de detección:
```bash
# macOS/Linux
export CLAUDE_PACKAGE_MANAGER=pnpm

# Windows (PowerShell)
$env:CLAUDE_PACKAGE_MANAGER = "pnpm"
```

---

## Flujos de Trabajo de Combinación de Comandos

### Flujo Completo de Desarrollo de Funcionalidad

```
1. /plan "Agregar funcionalidad de autenticación de usuario"
   ↓ Crear plan de implementación
2. /tdd "Implementar servicio de autenticación"
   ↓ Desarrollo TDD
3. /test-coverage
   ↓ Asegurar cobertura ≥ 80%
4. /code-review
   ↓ Revisión de código
5. /verify pre-pr
   ↓ Verificación completa
6. /checkpoint create "auth-feature-done"
   ↓ Guardar punto de control
7. /update-docs
   ↓ Actualizar documentación
8. /update-codemaps
   ↓ Actualizar documentación de arquitectura
```

### Flujo de Corrección de Errores

```
1. /checkpoint create "bug-start"
   ↓ Guardar estado actual
2. /orchestrate bugfix "Corregir error de inicio de sesión"
   ↓ Flujo automatizado de corrección de errores
3. /test-coverage
   ↓ Asegurar cobertura de pruebas
4. /verify quick
   ↓ Verificar corrección
5. /checkpoint verify "bug-start"
   ↓ Comparar con punto de control
```

### Flujo de Revisión de Seguridad

```
1. /orchestrate security "Revisar flujo de pago"
   ↓ Flujo de revisión con prioridad de seguridad
2. /e2e "Probar flujo de pago"
   ↓ Pruebas de extremo a extremo
3. /code-review
   ↓ Revisión de código
4. /verify pre-pr
   ↓ Verificación completa
```

---

## Tabla de Comparación Rápida de Comandos

| Comando | Propósito Principal | Agente Disparado | Salida |
|--- | --- | --- | ---|
| `/plan` | Crear plan de implementación | planner | Plan por fases |
| `/tdd` | Desarrollo TDD | tdd-guide | Pruebas + Implementación + Cobertura |
| `/orchestrate` | Ejecutar secuencia de agents | múltiples agents | Informe integral |
| `/code-review` | Revisión de código | code-reviewer, security-reviewer | Informe de seguridad y calidad |
| `/build-fix` | Corregir errores de compilación | build-error-resolver | Resumen de correcciones |
| `/refactor-clean` | Limpiar código muerto | refactor-cleaner | Resumen de limpieza |
| `/verify` | Verificación completa | Bash | Informe de verificación |
| `/e2e` | Pruebas de extremo a extremo | e2e-runner | Pruebas Playwright + Artefactos |
| `/test-coverage` | Analizar cobertura | Bash | Informe de cobertura + pruebas faltantes |
| `/eval` | Desarrollo dirigido por evaluaciones | Bash | Informe de estado de evaluación |
| `/checkpoint` | Guardar estado | Bash + Git | Informe de punto de control |
| `/learn` | Extraer patrones | continuous-learning skill | Archivo de Skill |
| `/update-docs` | Sincronizar documentación | doc-updater agent | Actualización de documentación |
| `/update-codemaps` | Actualizar arquitectura | doc-updater agent | Actualización de Codemap |
| `/setup-pm` | Configurar gestor de paquetes | Script Node.js | Detección de gestor de paquetes |

---

## Advertencias de Trampas

### ❌ No Omitir Fase de Planificación

Para funcionalidades complejas, comenzar a codificar directamente lleva a:
- Omitir dependencias importantes
- Inconsistencia arquitectónica
- Comprensión errónea de requisitos

**✅ Enfoque Correcto**: Usar `/plan` para crear plan detallado, esperar confirmación antes de implementar.

---

### ❌ No Omitir Fase RED en TDD

Escribir código primero y luego pruebas no es TDD.

**✅ Enfoque Correcto**: Ejecutar estrictamente ciclo RED → GREEN → REFACTOR.

---

### ❌ No Ignorar Problemas CRITICAL de /code-review

Las vulnerabilidades de seguridad pueden causar filtración de datos, pérdida financiera y otras consecuencias graves.

**✅ Enfoque Correcto**: Corregir todos los problemas de nivel CRITICAL y HIGH antes de confirmar.

---

### ❌ No Eliminar Código Sin Probar

El análisis de código muerto puede tener falsos positivos, eliminar directamente puede romper funcionalidad.

**✅ Enfoque Correcto**: Ejecutar pruebas antes de cada eliminación para asegurar que no rompe funcionalidad existente.

---

### ❌ No Olvidar Usar /learn

Resolver problemas no triviales sin extraer patrones significa que la próxima vez que encuentres el mismo problema tendrás que resolverlo desde cero.

**✅ Enfoque Correcto**: Usar regularmente `/learn` para extraer patrones reutilizables y acumular conocimiento.

---

## Resumen de Esta Lección

Los 15 comandos de barra de Everything Claude Code proporcionan soporte completo para el flujo de trabajo de desarrollo:

- **Flujo de Desarrollo**: `/plan` → `/tdd` → `/orchestrate`
- **Calidad de Código**: `/code-review` → `/build-fix` → `/refactor-clean` → `/verify`
- **Pruebas**: `/e2e` → `/test-coverage` → `/eval`
- **Documentación y Arquitectura**: `/update-docs` → `/update-codemaps`
- **Gestión de Estado**: `/checkpoint`
- **Aprendizaje y Optimización**: `/learn`
- **Configuración**: `/setup-pm`

Dominando estos comandos, puedes completar el trabajo de desarrollo de manera eficiente, segura y con calidad.

---

## Próxima Lección

> En la próxima lección aprenderemos **[Resumen de Agents Principales](../agents-overview/)**.
>
> Aprenderás:
> - Responsabilidades y escenarios de uso de 9 agents especializados
> - Cuándo invocar qué agent
> - Formas de colaboración entre agents
> - Cómo personalizar configuración de agent

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones de código fuente</strong></summary>

> Última actualización: 2026-01-25

| Funcionalidad | Ruta de Archivo | Número de Línea |
|--- | --- | ---|
| Comando TDD | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | 1-327 |
| Comando Plan | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md) | 1-114 |
| Comando Code Review | [`commands/code-review.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/code-review.md) | 1-41 |
| Comando E2E | [`commands/e2e.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/e2e.md) | 1-364 |
| Comando Build Fix | [`commands/build-fix.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/build-fix.md) | 1-30 |
| Comando Refactor Clean | [`commands/refactor-clean.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/refactor-clean.md) | 1-29 |
| Comando Learn | [`commands/learn.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/learn.md) | 1-71 |
| Comando Checkpoint | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |
| Comando Verify | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md) | 1-60 |
| Comando Test Coverage | [`commands/test-coverage.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/test-coverage.md) | 1-28 |
| Comando Setup PM | [`commands/setup-pm.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/setup-pm.md) | 1-81 |
| Comando Update Docs | [`commands/update-docs.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/update-docs.md) | 1-32 |
| Comando Orchestrate | [`commands/orchestrate.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/orchestrate.md) | 1-173 |
| Comando Update Codemaps | [`commands/update-codemaps.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/update-codemaps.md) | 1-18 |
| Comando Eval | [`commands/eval.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/eval.md) | 1-121 |
| Definición de Plugin | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |

**Constantes Clave**:
- Objetivo de cobertura TDD: 80% (código crítico 100%) - `commands/tdd.md:293-300`

**Funciones Clave**:
- Ciclo TDD: RED → GREEN → REFACTOR - `commands/tdd.md:40-47`
- Mecanismo de espera de confirmación Plan - `commands/plan.md:96`
- Niveles de severidad Code Review: CRITICAL, HIGH, MEDIUM - `commands/code-review.md:33`

</details>
