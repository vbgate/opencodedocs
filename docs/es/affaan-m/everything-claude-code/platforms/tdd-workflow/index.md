---
title: "Flujo de Desarrollo TDD: Red-Green-Refactor | everything-claude-code"
sidebarTitle: "Pruebas antes de Código"
subtitle: "Flujo de Desarrollo TDD: Red-Green-Refactor"
description: "Aprende el flujo de desarrollo TDD de Everything Claude Code. Domina los comandos /plan, /tdd, /code-review, /verify y alcanza 80%+ de cobertura de pruebas."
tags:
  - "tdd"
  - "test-driven-development"
  - "workflow"
prerequisite:
  - "start-quick-start"
order: 70
---

# Flujo de Desarrollo TDD: Ciclo Completo Red-Green-Refactor desde /plan hasta /verify

## Qué Podrás Hacer Después de Este Tutorial

- Usar el comando `/plan` para crear planes de implementación sistemáticos y evitar omisiones
- Utilizar el comando `/tdd` para ejecutar desarrollo dirigido por pruebas, siguiendo el ciclo RED-GREEN-REFACTOR
- Asegurar la seguridad y calidad del código mediante `/code-review`
- Verificar que el código puede enviarse de forma segura con `/verify`
- Alcanzar 80%+ de cobertura de pruebas y establecer una suite de pruebas confiable

## Tu Situación Actual

Al desarrollar nuevas funcionalidades, ¿te has encontrado con estas situaciones?

- Descubrir que entendiste mal los requisitos después de escribir el código, teniendo que rehacerlo
- Baja cobertura de pruebas, encontrando bugs después del despliegue
- Descubrir problemas de seguridad durante la revisión de código, siendo rechazado para modificaciones
- Encontrar errores de tipo o fallos de compilación después de enviar
- No estar seguro de cuándo escribir pruebas, dejando las pruebas incompletas

Estos problemas conducen a baja eficiencia de desarrollo y dificultan garantizar la calidad del código.

## Cuándo Usar Esta Técnica

Escenarios para usar el flujo de desarrollo TDD:

- **Desarrollo de nuevas funcionalidades**: desde los requisitos hasta la implementación, garantizando funcionalidad completa y pruebas adecuadas
- **Corrección de bugs**: primero escribir pruebas para reproducir el bug, luego corregirlo, asegurando que no se introduzcan nuevos problemas
- **Refactorización de código**: con protección de pruebas, optimizar la estructura del código con confianza
- **Implementación de endpoints API**: escribir pruebas de integración para verificar la corrección de las interfaces
- **Desarrollo de lógica de negocio central**: cálculos financieros, autenticación y otro código crítico requieren 100% de cobertura de pruebas

::: tip Principio Fundamental
El desarrollo dirigido por pruebas no es simplemente un proceso de escribir pruebas primero, sino un método sistemático para asegurar la calidad del código y mejorar la eficiencia de desarrollo. Todo nuevo código debe implementarse a través del flujo TDD.
:::

## Concepto Central

El flujo de desarrollo TDD consta de 4 comandos principales que forman un ciclo de desarrollo completo:

```
1. /plan        → Planificación: clarificar requisitos, identificar riesgos, implementación por fases
2. /tdd         → Implementación: pruebas primero, código mínimo, refactorización continua
3. /code-review → Revisión: verificación de seguridad, evaluación de calidad, mejores prácticas
4. /verify      → Verificación: compilación, tipos, pruebas, auditoría de código
```

**Por qué este flujo funciona**:

- **Planificación primero**: `/plan` asegura la comprensión correcta y evita errores de dirección
- **Impulsado por pruebas**: `/tdd` fuerza pruebas primero, garantizando que cada funcionalidad tenga protección de pruebas
- **Revisión de calidad**: `/code-review` descubre vulnerabilidades de seguridad y problemas de calidad de código
- **Verificación final**: `/verify` asegura que el código puede enviarse de forma segura

## 🎒 Preparación Antes de Empezar

Antes de comenzar el flujo de desarrollo TDD, por favor confirma:

- ✅ El plugin Everything Claude Code está instalado
- ✅ El proyecto tiene configurado un framework de pruebas (Jest, Vitest, etc.)
- ✅ El proyecto tiene un proceso de compilación básico (`npm run build`)
- ✅ Entiendes el uso básico de comandos en [Inicio Rápido](../../start/quickstart/)

::: warning Prerrequisito
Este tutorial asume que ya estás familiarizado con las operaciones básicas en [Inicio Rápido](../../start/quickstart/). Si aún no has completado la instalación, por favor lee primero la [Guía de Instalación](../../start/installation/).
:::

## Sígueme: Flujo Completo de Desarrollo TDD

Aprendamos todo el flujo a través de un ejemplo práctico. Supongamos que necesitas implementar una funcionalidad de "calculadora de puntuación de liquidez de mercado".

### Paso 1: Usar /plan para Crear un Plan de Implementación

**Por qué**
La fase de planificación asegura que entiendes los requisitos, identificas riesgos potenciales y evitas retrabajo posterior.

**Operación**
En Claude Code, escribe:

```
/plan Necesito implementar una calculadora de puntuación de liquidez de mercado que calcule una puntuación (0-100) basada en volumen de transacciones, spread bid-ask, número de traders activos y tiempo de la última transacción
```

**Lo que Deberías Ver**
El agente planner generará un plan de implementación detallado:

```markdown
## Plan de Implementación: Calculadora de Puntuación de Liquidez de Mercado

## Reafirmación de Requisitos
- Calcular puntuación de liquidez de mercado (0-100) basada en múltiples indicadores
- Mayor puntuación indica mejor liquidez de mercado
- Considerar volumen de transacciones, spread bid-ask, traders activos, tiempo de última transacción

## Fases de Implementación

### Fase 1: Definir Interfaz
- Crear interfaz `MarketData` para definir datos de entrada
- Definir firma de función `calculateLiquidityScore`

### Fase 2: Escribir Pruebas
- Escribir pruebas unitarias cubriendo varios escenarios
- Condiciones de borde: volumen cero, valores extremos
- Manejo de errores: campos faltantes, tipos inválidos

### Fase 3: Implementar Cálculo
- Implementar algoritmo de puntuación
- Calcular ponderado de cada indicador
- Normalizar a rango 0-100

### Fase 4: Integración
- Integrar en API existente
- Agregar endpoint para exponer funcionalidad de cálculo
- Documentar método de uso

## Dependencias
- Sin dependencias externas

## Riesgos
- MEDIO: El algoritmo de puntuación puede necesitar ajuste de ponderaciones
- BAJO: Manejo de condiciones de borde

**ESPERANDO CONFIRMACIÓN**: ¿Proceder con este plan? (yes/no/modify)
```

**Punto de Verificación ✅**
- Confirmar que la comprensión de requisitos es correcta
- Confirmar que los pasos de implementación son razonables
- Verificar si hay riesgos omitidos

**Siguiente Paso**
Si el plan está bien, responde `yes` o `proceed`. Si necesitas modificarlo, explica los cambios específicos.

---

### Paso 2: Usar /tdd para Ejecutar Desarrollo Dirigido por Pruebas

**Por qué**
El comando `/tdd` fuerza pruebas primero, asegurando que cada funcionalidad tenga protección de pruebas, evitando el dolor de agregar pruebas posteriormente.

**Operación**
Después de confirmar el plan, escribe:

```
/tdd Implementar calculadora de puntuación de liquidez de mercado según el plan
```

**Lo que Deberías Ver**
El agente tdd-guide te guiará a través del flujo TDD:

#### Fase RED: Escribir Pruebas Primero

```typescript
// lib/liquidity.ts
export interface MarketData {
  totalVolume: number
  bidAskSpread: number
  activeTraders: number
  lastTradeTime: Date
}

export function calculateLiquidityScore(market: MarketData): number {
  // TODO: Implementation
  throw new Error('Not implemented')
}
```

```typescript
// lib/liquidity.test.ts
import { calculateLiquidityScore } from './liquidity'

describe('calculateLiquidityScore', () => {
  it('should return high score for liquid market', () => {
    const market = {
      totalVolume: 100000,
      bidAskSpread: 0.01,
      activeTraders: 500,
      lastTradeTime: new Date()
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBeGreaterThan(80)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('should return low score for illiquid market', () => {
    const market = {
      totalVolume: 100,
      bidAskSpread: 0.5,
      activeTraders: 2,
      lastTradeTime: new Date(Date.now() - 86400000) // 1 day ago
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBeLessThan(30)
    expect(score).toBeGreaterThanOrEqual(0)
  })

  it('should handle edge case: zero volume', () => {
    const market = {
      totalVolume: 0,
      bidAskSpread: 0,
      activeTraders: 0,
      lastTradeTime: new Date()
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBe(0)
  })
})
```

```bash
npm test lib/liquidity.test.ts

## Deberías ver que las pruebas fallan
FAIL lib/liquidity.test.ts
  ✕ should return high score for liquid market
    Error: Not implemented
```

✅ **Las pruebas fallan, como se esperaba**

#### Fase GREEN: Implementar Código Mínimo

```typescript
export function calculateLiquidityScore(market: MarketData): number {
  // Manejar caso de borde de volumen cero
  if (market.totalVolume === 0) {
    return 0
  }

  // Calcular puntuaciones de componentes (escala 0-100)
  const volumeScore = Math.min(market.totalVolume / 1000, 100)
  const spreadScore = Math.max(100 - (market.bidAskSpread * 1000), 0)
  const traderScore = Math.min(market.activeTraders / 10, 100)

  // Bono por actividad reciente
  const hoursSinceLastTrade = (Date.now() - market.lastTradeTime.getTime()) / (1000 * 60 * 60)
  const recencyScore = Math.max(100 - (hoursSinceLastTrade * 10), 0)

  // Promedio ponderado
  const score = (
    volumeScore * 0.4 +
    spreadScore * 0.3 +
    traderScore * 0.2 +
    recencyScore * 0.1
  )

  return Math.min(Math.max(score, 0), 100) // Limitar a 0-100
}
```

```bash
npm test lib/liquidity.test.ts

## Deberías ver que las pruebas pasan
PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ **Todas las pruebas pasan**

#### Fase REFACTOR: Mejorar el Código

```typescript
// lib/liquidity.ts - Después de refactorizar
const WEIGHTS = {
  VOLUME: 0.4,
  SPREAD: 0.3,
  TRADERS: 0.2,
  RECENCY: 0.1,
} as const

const SCALE_FACTORS = {
  VOLUME: 1000,
  SPREAD: 1000,
  TRADERS: 10,
  RECENCY_PENALTY: 10,
} as const

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function calculateLiquidityScore(market: MarketData): number {
  if (market.totalVolume === 0) return 0

  const volumeScore = Math.min(market.totalVolume / SCALE_FACTORS.VOLUME, 100)
  const spreadScore = clamp(100 - (market.bidAskSpread * SCALE_FACTORS.SPREAD), 0, 100)
  const traderScore = Math.min(market.activeTraders / SCALE_FACTORS.TRADERS, 100)

  const hoursSinceLastTrade = (Date.now() - market.lastTradeTime.getTime()) / (1000 * 60 * 60)
  const recencyScore = clamp(100 - (hoursSinceLastTrade * SCALE_FACTORS.RECENCY_PENALTY), 0, 100)

  const weightedScore =
    volumeScore * WEIGHTS.VOLUME +
    spreadScore * WEIGHTS.SPREAD +
    traderScore * WEIGHTS.TRADERS +
    recencyScore * WEIGHTS.RECENCY

  return clamp(weightedScore, 0, 100)
}
```

```bash
npm test lib/liquidity.test.ts

## Deberías ver que las pruebas siguen pasando
PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ **Refactorización completada, las pruebas siguen pasando**

#### Verificar Cobertura

```bash
npm test -- --coverage lib/liquidity.test.ts

File           | % Stmts | % Branch | % Funcs | % Lines
---------------|---------|----------|---------|--------
liquidity.ts   |   100   |   100    |   100   |   100

Coverage: 100% ✅ (Target: 80%)
```

✅ **Flujo TDD completado, cobertura alcanza el requerimiento**

**Punto de Verificación ✅**
- Las pruebas se escriben antes que el código (RED)
- Las pruebas fallan antes de implementar (GREEN)
- El código se refactoriza después de pasar las pruebas (REFACTOR)
- La cobertura alcanza 80% o más

---

### Paso 3: Usar /code-review para Revisar el Código

**Por qué**
La revisión de código puede descubrir problemas de seguridad, calidad de código y mejores prácticas, asegurando que el código pueda fusionarse de forma segura.

**Operación**
Escribe:

```
/code-review
```

**Lo que Deberías Ver**
El agente code-reviewer verificará:

```markdown
## Reporte de Revisión de Código

## Problemas de Seguridad (CRÍTICO)
- ✅ No se encontraron credenciales codificadas
- ✅ No hay vulnerabilidades de inyección SQL
- ✅ No hay vulnerabilidades XSS

## Calidad de Código (ALTO)
- ✅ Funciones bajo 50 líneas (actual: máximo 8 líneas)
- ✅ Archivos bajo 800 líneas (actual: 25 líneas)
- ✅ Sin manejo de errores faltante
- ⚠️ Se encontró 1 declaración console.log en lib/liquidity.ts:15
  - **Sugerencia**: Eliminar o reemplazar con logging apropiado

## Mejores Prácticas (MEDIO)
- ✅ Usando patrones inmutables
- ✅ Sin comentarios TODO/FIXME
- ✅ Todo código nuevo tiene pruebas
- ✅ JSDoc para API pública presente

## Resumen
- Crítico: 0 problemas
- Alto: 1 problema (console.log)
- Medio: 0 problemas

**Recomendación**: Corregir problema de console.log, luego listo para commit.
```

**Siguiente Paso**
Corregir problemas según los resultados de la revisión:

```typescript
// Eliminar console.log
// console.log(`Calculated score: ${score}`)  // Eliminado
return clamp(weightedScore, 0, 100)
```

**Punto de Verificación ✅**
- Corregir todos los problemas de nivel CRÍTICO
- Corregir o explicar problemas de nivel ALTO
- Verificar que la calidad del código cumple con los estándares

---

### Paso 4: Usar /verify para Verificar el Código

**Por qué**
El comando de verificación asegura que el código puede enviarse de forma segura, pasando compilación, tipos y pruebas, sin problemas pendientes.

**Operación**
Escribe:

```
/verify
```

**Lo que Deberías Ver**
Reporte de verificación completo:

```markdown
VERIFICATION: PASS

Build:    OK
Types:    OK (0 errores)
Lint:     OK (0 problemas)
Tests:    3/3 pasaron, 100% cobertura
Secrets:  OK (0 encontrados)
Logs:      OK (0 console.logs)

Ready for PR: YES ✅
```

Si hay problemas, se listarán en detalle:

```markdown
VERIFICATION: FAIL

Build:    OK
Types:    ❌ 2 errores
  - lib/liquidity.ts:15:25 - Type 'string' is not assignable to type 'number'
  - lib/utils.ts:8:10 - Property 'toFixed' does not exist on type 'unknown'
Lint:     ⚠️ 2 advertencias
  - lib/liquidity.ts:10:1 - Missing JSDoc for WEIGHTS constant
Tests:    ✅ 3/3 pasaron, 100% cobertura
Secrets:  OK
Logs:      OK

Ready for PR: NO ❌

Corregir estos problemas antes de hacer commit.
```

**Punto de Verificación ✅**
- Compilación exitosa
- Verificación de tipos exitosa
- Lint exitoso (o solo advertencias)
- Todas las pruebas pasan
- Cobertura alcanza 80%+
- Sin console.log
- Sin claves codificadas

---

### Paso 5: Enviar el Código

**Por qué**
Después de pasar la verificación, el código está listo para enviarse, pudiendo enviarse al repositorio remoto con confianza.

**Operación**
```bash
git add lib/liquidity.ts lib/liquidity.test.ts
git commit -m "feat: add market liquidity score calculator

- Calculate 0-100 score based on volume, spread, traders, recency
- 100% test coverage with unit tests
- Edge cases handled (zero volume, illiquid markets)
- Refactored with constants and helper functions

Closes #123"
```

```bash
git push origin feature/liquidity-score
```

## Advertencias de Errores Comunes

### Trampa 1: Saltarse la Fase RED y Escribir Código Directamente

**Práctica Incorrecta**:
```
Primero implementar la función calculateLiquidityScore
Luego escribir pruebas
```

**Consecuencias**:
- Las pruebas pueden ser solo "verificación de implementación existente", sin validar realmente el comportamiento
- Fácil omitir casos de borde y manejo de errores
- Falta de seguridad al refactorizar

**Práctica Correcta**:
```
1. Escribir pruebas primero (deberían fallar)
2. Ejecutar pruebas confirmando el fallo (RED)
3. Implementar código para que las pruebas pasen (GREEN)
4. Refactorizar manteniendo las pruebas pasando (REFACTOR)
```

---

### Trampa 2: Cobertura de Pruebas Insuficiente

**Práctica Incorrecta**:
```
Solo escribir una prueba, cobertura de solo 40%
```

**Consecuencias**:
- Gran cantidad de código sin protección de pruebas
- Fácil introducir bugs al refactorizar
- Rechazo en revisión de código

**Práctica Correcta**:
```
Asegurar 80%+ de cobertura:
- Pruebas unitarias: cubrir todas las funciones y ramas
- Pruebas de integración: cubrir endpoints API
- Pruebas E2E: cubrir flujos críticos de usuario
```

---

### Trampa 3: Ignorar las Sugerencias de code-review

**Práctica Incorrecta**:
```
Ver problemas CRÍTICOS y continuar enviando de todos modos
```

**Consecuencias**:
- Vulnerabilidades de seguridad llegan al entorno de producción
- Baja calidad de código, difícil de mantener
- Rechazo por parte de revisores de PR

**Práctica Correcta**:
```
- Los problemas CRÍTICOS deben corregirse
- Los problemas ALTOS deben corregirse o explicarse
- Los problemas MEDIO/BAJOS pueden optimizarse posteriormente
```

---

### Trampa 4: No Ejecutar /verify Antes de Enviar

**Práctica Incorrecta**:
```
Escribir código directamente y hacer git commit, saltarse la verificación
```

**Consecuencias**:
- Fallos de compilación, desperdiciando recursos de CI
- Errores de tipo causando errores en tiempo de ejecución
- Pruebas no pasando, estado anormal de la rama principal

**Práctica Correcta**:
```
Siempre ejecutar /verify antes de enviar:
/verify
# Ver "Ready for PR: YES" antes de hacer commit
```

---

### Trampa 5: Probar Detalles de Implementación en Lugar de Comportamiento

**Práctica Incorrecta**:
```typescript
// Probar estado interno
expect(component.state.count).toBe(5)
```

**Consecuencias**:
- Pruebas frágiles, muchos fallos al refactorizar
- Las pruebas no reflejan lo que el usuario realmente ve

**Práctica Correcta**:
```typescript
// Probar comportamiento visible para el usuario
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```

## Resumen de Esta Lección

Puntos clave del flujo de desarrollo TDD:

1. **Planificación Primero**: Usar `/plan` para asegurar comprensión correcta y evitar errores de dirección
2. **Impulsado por Pruebas**: Usar `/tdd` para forzar pruebas primero, siguiendo RED-GREEN-REFACTOR
3. **Revisión de Código**: Usar `/code-review` para descubrir problemas de seguridad y calidad
4. **Verificación Completa**: Usar `/verify` para asegurar que el código puede enviarse de forma segura
5. **Requerimiento de Cobertura**: Asegurar 80%+ de cobertura de pruebas, código crítico 100%

Estos cuatro comandos forman un ciclo de desarrollo completo, asegurando calidad de código y eficiencia de desarrollo.

::: tip Recuerda Este Flujo
```
Requisito → /plan → /tdd → /code-review → /verify → Commit
```

Cada nueva funcionalidad debe seguir este flujo.
:::

## Próxima Lección

> En la próxima lección aprenderemos **[Flujo de Revisión de Código: /code-review y Auditoría de Seguridad](../code-review-workflow/)**.
>
> Aprenderás:
> - Comprender en profundidad la lógica de verificación del agente code-reviewer
> - Dominar la lista de verificación de auditoría de seguridad
> - Aprender a corregir vulnerabilidades de seguridad comunes
> - Entender cómo configurar reglas de revisión personalizadas

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-25

| Funcionalidad     | Ruta del Archivo                                                                                     | Líneas      |
| --- | --- | ---|
| Comando /plan     | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md)            | 1-114     |
| Comando /tdd      | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md)              | 1-327     |
| Comando /verify   | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md)          | 1-60      |

**Funciones Clave**:
- `plan` invoca al agente planner, crea plan de implementación
- `tdd` invoca al agente tdd-guide, ejecuta flujo RED-GREEN-REFACTOR
- `verify` ejecuta verificación completa (compilación, tipos, lint, pruebas)
- `code-review` verifica vulnerabilidades de seguridad, calidad de código, mejores prácticas

**Requerimientos de Cobertura**:
- Mínimo 80% de cobertura de código (branches, functions, lines, statements)
- Cálculos financieros, lógica de autenticación, código crítico de seguridad requieren 100% de cobertura

</details>
