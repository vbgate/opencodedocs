---
title: "Bucle de Verificación: Checkpoint y Evals | Everything Claude Code"
subtitle: "Bucle de Verificación: Checkpoint y Evals"
sidebarTitle: "Verificación antes de PR"
description: "Aprende el mecanismo de bucle de verificación de Everything Claude Code. Domina la gestión de Checkpoints, definición de Evals y verificación continua para guardar estados y revertir cambios, asegurando la calidad del código."
tags:
  - "verification"
  - "checkpoint"
  - "evals"
  - "quality-gates"
prerequisite:
  - "platforms-tdd-workflow"
order: 120
---

# Bucle de Verificación: Checkpoint y Evals

## Qué Podrás Hacer Después de Este Tutorial

Después de aprender el mecanismo de bucle de verificación, podrás:

- Usar `/checkpoint` para guardar y restaurar estados de trabajo
- Usar `/verify` para ejecutar verificaciones completas de calidad de código
- Dominar la filosofía de Eval-Driven Development (EDD), definiendo y ejecutando evals
- Establecer un bucle de verificación continua para mantener la calidad del código durante el desarrollo

## Tu Situación Actual

Acabas de completar una funcionalidad, pero no te atreves a enviar el PR porque:
- No estás seguro de si has roto funcionalidades existentes
- Te preocupa que la cobertura de pruebas haya disminuido
- Olvidaste cuál era el objetivo inicial y no sabes si te has desviado
- Quieres volver a un estado estable, pero no tienes registro

Si existiera un mecanismo que pudiera "tomar una foto" en momentos clave y verificar continuamente durante el desarrollo, estos problemas se resolverían fácilmente.

## Cuándo Usar Esta Técnica

- **Antes de iniciar una nueva funcionalidad**: Crear un checkpoint para registrar el estado inicial
- **Después de completar un hito**: Guardar el progreso para facilitar reversiones y comparaciones
- **Antes de enviar un PR**: Ejecutar verificación completa para asegurar la calidad del código
- **Durante refactorizaciones**: Verificar frecuentemente para evitar romper funcionalidades existentes
- **En trabajo colaborativo**: Compartir checkpoints para sincronizar estados de trabajo

## 🎒 Preparación Antes de Empezar

::: warning Prerrequisito

Este tutorial asume que ya has:

- ✅ Completado el aprendizaje del [Flujo de Trabajo TDD](../../platforms/tdd-workflow/)
- ✅ Familiarizado con operaciones básicas de Git
- ✅ Entendido cómo usar los comandos básicos de Everything Claude Code

:::

---

## Concepto Central

El **Bucle de Verificación** es un mecanismo de aseguramiento de calidad que sistematiza el ciclo "escribir código → probar → verificar".

### Sistema de Verificación de Tres Niveles

Everything Claude Code proporciona tres niveles de verificación:

| Nivel | Mecanismo | Propósito | Cuándo Usar |
| --- | --- | --- | --- |
| **Verificación en Tiempo Real** | PostToolUse Hooks | Capturar inmediatamente errores de tipo, console.log, etc. | Después de cada llamada a herramienta |
| **Verificación Periódica** | Comando `/verify` | Verificación completa: build, tipos, pruebas, seguridad | Cada 15 minutos o después de cambios importantes |
| **Verificación de Hitos** | `/checkpoint` | Comparar diferencias de estado, rastrear tendencias de calidad | Al completar hitos, antes de enviar PR |

### Checkpoint: "Puntos de Guardado" del Código

Checkpoint "toma una foto" en momentos clave:

- Registra el SHA de Git
- Registra la tasa de pruebas aprobadas
- Registra la cobertura de código
- Registra la marca de tiempo

Durante la verificación, puedes comparar el estado actual con cualquier checkpoint anterior.

### Evals: "Pruebas Unitarias" para Desarrollo con IA

**Eval-Driven Development (EDD)** trata los evals como pruebas unitarias para desarrollo asistido por IA:

1. **Primero definir criterios de éxito** (escribir evals)
2. **Luego escribir código** (implementar funcionalidad)
3. **Ejecutar evals continuamente** (verificar corrección)
4. **Rastrear regresiones** (asegurar que no se rompen funcionalidades existentes)

Esto es consistente con la filosofía TDD (Test-Driven Development), pero orientado al desarrollo asistido por IA.

---

## Sígueme: Usando Checkpoint

### Paso 1: Crear el Checkpoint Inicial

Antes de comenzar una nueva funcionalidad, primero crea un checkpoint:

```bash
/checkpoint create "feature-start"
```

**Por qué**
Registrar el estado inicial para facilitar comparaciones posteriores.

**Lo que Deberías Ver**:

```
VERIFICATION: Running quick checks...
Build:    OK
Types:    OK

CHECKPOINT CREATED: feature-start
Time:     2026-01-25-14:30
Git SHA:  abc1234
Logged to: .claude/checkpoints.log
```

El Checkpoint:
1. Primero ejecuta `/verify quick` (solo verifica build y tipos)
2. Crea un git stash o commit (nombrado: `checkpoint-feature-start`)
3. Registra en `.claude/checkpoints.log`

### Paso 2: Implementar la Funcionalidad Principal

Comienza a escribir código y completa la lógica principal.

### Paso 3: Crear Checkpoint de Hito

Después de completar la funcionalidad principal:

```bash
/checkpoint create "core-done"
```

**Por qué**
Registrar el hito para facilitar reversiones.

**Lo que Deberías Ver**:

```
CHECKPOINT CREATED: core-done
Time:     2026-01-25-16:45
Git SHA:  def5678
Logged to: .claude/checkpoints.log
```

### Paso 4: Verificar y Comparar

Verificar si el estado actual se ha desviado del objetivo:

```bash
/checkpoint verify "feature-start"
```

**Por qué**
Comparar los cambios en métricas de calidad desde el inicio hasta ahora.

**Lo que Deberías Ver**:

```
CHECKPOINT COMPARISON: feature-start
=====================================
Files changed: 12
Tests: +25 passed / -0 failed
Coverage: +15% / -2% (from 60% to 75%)
Build: PASS
Status: ✅ Quality improved
```

### Paso 5: Ver Todos los Checkpoints

Ver el historial de checkpoints:

```bash
/checkpoint list
```

**Lo que Deberías Ver**:

```
CHECKPOINTS HISTORY
===================
Name           | Time             | Git SHA  | Status
---------------|------------------|----------|--------
feature-start  | 2026-01-25-14:30 | abc1234  | behind
core-done      | 2026-01-25-16:45 | def5678  | current
```

**Punto de Verificación ✅**: Verificar Comprensión

- ¿Checkpoint ejecuta automáticamente `/verify quick`? ✅ Sí
- ¿En qué archivo se registra el Checkpoint? ✅ `.claude/checkpoints.log`
- ¿Qué métricas compara `/checkpoint verify`? ✅ Cambios de archivos, tasa de pruebas aprobadas, cobertura

---

## Sígueme: Usando el Comando Verify

### Paso 1: Ejecutar Verificación Rápida

Durante el desarrollo, ejecuta verificaciones rápidas frecuentemente:

```bash
/verify quick
```

**Por qué**
Solo verifica build y tipos, es lo más rápido.

**Lo que Deberías Ver**:

```
VERIFICATION: PASS

Build:    OK
Types:    OK

Ready for next task: YES
```

### Paso 2: Ejecutar Verificación Completa

Antes de enviar un PR, ejecuta la verificación completa:

```bash
/verify full
```

**Por qué**
Verificación completa de todas las puertas de calidad.

**Lo que Deberías Ver**:

```
VERIFICATION: PASS

Build:    OK
Types:    OK
Lint:     OK (2 warnings)
Tests:    120/125 passed, 76% coverage
Secrets:  OK
Logs:     3 console.logs found in src/

Ready for PR: NO

Issues to Fix:
1. Remove console.log statements before PR
   Found in: src/utils/logger.ts:15, src/api/client.ts:23, src/ui/button.ts:8
2. Increase test coverage from 76% to 80% (target)
   Missing coverage in: src/components/Form.tsx
```

### Paso 3: Ejecutar Verificación Pre-PR

La verificación más estricta, incluye escaneo de seguridad:

```bash
/verify pre-pr
```

**Lo que Deberías Ver**:

```
VERIFICATION: FAIL

Build:    OK
Types:    OK (1 error)
Lint:     OK
Tests:    120/125 passed, 76% coverage
Secrets:  ❌ FOUND (2 API keys)
Logs:     3 console.logs

Security Issues Found:
1. Hardcoded API key in src/api/config.ts:10
2. Secret key in .env.example

Ready for PR: NO

Critical Issues:
1. Remove hardcoded secrets
2. Fix type error in src/components/Form.tsx:45
3. Remove console.logs
4. Increase coverage to 80%
```

### Paso 4: Verificar Nuevamente Después de Corregir

Después de corregir los problemas, ejecuta la verificación nuevamente:

```bash
/verify full
```

**Lo que Deberías Ver**:

```
VERIFICATION: PASS

Build:    OK
Types:    OK
Lint:     OK
Tests:    125/125 passed, 81% coverage
Secrets:  OK
Logs:     OK

Ready for PR: YES
```

**Punto de Verificación ✅**: Verificar Comprensión

- ¿Qué verifica `/verify quick`? ✅ Solo build y tipos
- ¿Qué elementos verifica `/verify full`? ✅ Build, tipos, Lint, pruebas, Secrets, Console.log, estado de Git
- ¿Qué modo de verificación incluye escaneo de seguridad? ✅ `pre-pr`

---

## Sígueme: Usando Evals (Eval-Driven Development)

### Paso 1: Definir Evals (Antes de Escribir Código)

**Antes de comenzar a codificar, primero define los criterios de éxito**:

```markdown
## EVAL: user-authentication

### Capability Evals
- [ ] User can register with email/password
- [ ] User can login with valid credentials
- [ ] Invalid credentials rejected with proper error
- [ ] Sessions persist across page reloads
- [ ] Logout clears session

### Regression Evals
- [ ] Public routes still accessible
- [ ] API responses unchanged
- [ ] Database schema compatible

### Success Metrics
- pass@3 > 90% for capability evals
- pass^3 = 100% for regression evals
```

**Por qué**
Definir primero los criterios de éxito te obliga a pensar "¿cuál es el estándar de completado?".

Guardar en: `.claude/evals/user-authentication.md`

### Paso 2: Implementar la Funcionalidad

Escribe código según los evals.

### Paso 3: Ejecutar Capability Evals

Probar si la nueva funcionalidad cumple con los evals:

```markdown
[CERTAIN CAPABILITY EVAL: user-authentication]

Test 1: User can register with email/password
Task: Call registration API with valid credentials
Expected: User account created, token returned
Actual: PASS

Test 2: User can login with valid credentials
Task: Call login API with registered credentials
Expected: JWT token returned
Actual: PASS

Test 3: Invalid credentials rejected
Task: Call login API with wrong password
Expected: 401 Unauthorized with error message
Actual: PASS

Overall: 3/3 passed
```

### Paso 4: Ejecutar Regression Evals

Asegurar que no se rompen funcionalidades existentes:

```bash
npm test -- --testPathPattern="existing"
```

**Lo que Deberías Ver**:

```
PASS  existing/auth.test.ts
PASS  existing/api.test.ts
PASS  existing/db.test.ts

All regression tests: 15/15 passed
```

### Paso 5: Generar Reporte de Eval

Resumir resultados:

```markdown
EVAL REPORT: user-authentication
=================================

Capability Evals:
  register-user:       PASS (pass@1)
  login-user:          PASS (pass@2)
  reject-invalid:      PASS (pass@1)
  session-persistence: PASS (pass@1)
  logout-clears:       PASS (pass@1)
  Overall:             5/5 passed

Regression Evals:
  public-routes:       PASS
  api-responses:       PASS
  db-schema:           PASS
  Overall:             3/3 passed

Metrics:
  pass@1: 80% (4/5)
  pass@3: 100% (5/5)
  pass^3: 100% (3/3)

Status: READY FOR REVIEW
```

**Punto de Verificación ✅**: Verificar Comprensión

- ¿Cuándo deben definirse los Evals? ✅ Antes de escribir código
- ¿Cuál es la diferencia entre capability evals y regression evals? ✅ Los primeros prueban nuevas funcionalidades, los segundos aseguran que no se rompen funcionalidades existentes
- ¿Qué significa pass@3? ✅ Probabilidad de éxito dentro de 3 intentos

---

## Advertencias de Errores Comunes

### Trampa 1: Olvidar Crear Checkpoint

**Problema**: Después de desarrollar un tiempo, quieres volver a un estado anterior, pero no tienes registro.

**Solución**: Crear un checkpoint antes de comenzar cada nueva funcionalidad:

```bash
# Buena práctica: antes de nueva funcionalidad
/checkpoint create "feature-name-start"

# Buena práctica: cada hito
/checkpoint create "phase-1-done"
/checkpoint create "phase-2-done"
```

### Trampa 2: Definición de Evals Demasiado Vaga

**Problema**: Los Evals están escritos de forma vaga, imposibles de verificar.

**Ejemplo Incorrecto**:
```markdown
- [ ] El usuario puede iniciar sesión
```

**Ejemplo Correcto**:
```markdown
- [ ] User can login with valid credentials
  Task: POST /api/login with email="test@example.com", password="Test123!"
  Expected: HTTP 200 with JWT token in response body
  Actual: ___________
```

### Trampa 3: Solo Ejecutar Verificación Antes de Enviar PR

**Problema**: Esperar hasta antes del PR para descubrir problemas, alto costo de corrección.

**Solución**: Establecer hábito de verificación continua:

```
Cada 15 minutos ejecutar: /verify quick
Cada funcionalidad completada: /checkpoint create "milestone"
Antes de enviar PR:          /verify pre-pr
```

### Trampa 4: No Actualizar Evals

**Problema**: Después de cambios en requisitos, los Evals siguen siendo los antiguos, causando verificación inefectiva.

**Solución**: Los Evals son "código de primera clase", actualizar sincrónicamente cuando cambian los requisitos:

```bash
# Cambio de requisitos → Actualizar Evals → Actualizar código
1. Modificar .claude/evals/feature-name.md
2. Modificar código según nuevos evals
3. Ejecutar evals nuevamente
```

---

## Resumen de Esta Lección

El bucle de verificación es un método sistemático para mantener la calidad del código:

| Mecanismo | Función | Frecuencia de Uso |
| --- | --- | --- |
| **PostToolUse Hooks** | Captura de errores en tiempo real | Cada llamada a herramienta |
| **`/verify`** | Verificación completa periódica | Cada 15 minutos |
| **`/checkpoint`** | Registro y comparación de hitos | Cada fase de funcionalidad |
| **Evals** | Verificación de funcionalidad y pruebas de regresión | Cada nueva funcionalidad |

Principios fundamentales:
1. **Primero definir, luego implementar** (Evals)
2. **Verificar frecuentemente, mejorar continuamente** (`/verify`)
3. **Registrar hitos, facilitar reversiones** (`/checkpoint`)

---

## Próxima Lección

> En la próxima lección aprenderemos **[Reglas Personalizadas: Construyendo Estándares Específicos del Proyecto](../custom-rules/)**.
>
> Aprenderás:
> - Cómo crear archivos de Reglas personalizadas
> - Formato de archivos de Reglas y redacción de listas de verificación
> - Definir reglas de seguridad específicas del proyecto
> - Integrar estándares del equipo en el flujo de revisión de código

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-25

| Funcionalidad | Ruta del Archivo | Líneas |
| --- | --- | --- |
| Definición del Comando Checkpoint | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |
| Definición del Comando Verify | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md) | 1-60 |
| Skill de Verification Loop | [`skills/verification-loop/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/verification-loop/SKILL.md) | 1-121 |
| Skill de Eval Harness | [`skills/eval-harness/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/eval-harness/SKILL.md) | 1-222 |

**Flujos Clave**:
- Flujo de creación de Checkpoint: Primero ejecutar `/verify quick` → Crear git stash/commit → Registrar en `.claude/checkpoints.log`
- Flujo de verificación Verify: Build Check → Type Check → Lint Check → Test Suite → Console.log Audit → Git Status
- Flujo de trabajo de Eval: Define (definir evals) → Implement (implementar código) → Evaluate (ejecutar evals) → Report (generar reporte)

**Parámetros Clave**:
- `/checkpoint [create\|verify\|list] [name]` - Operaciones de Checkpoint
- `/verify [quick\|full\|pre-commit\|pre-pr]` - Modos de verificación
- pass@3 - Objetivo de éxito dentro de 3 intentos (>90%)
- pass^3 - 3 éxitos consecutivos (100%, para rutas críticas)

</details>
