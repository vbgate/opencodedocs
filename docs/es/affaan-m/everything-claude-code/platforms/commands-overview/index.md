---
title: "Commands: 15 Comandos Slash | Everything Claude Code"
sidebarTitle: "Domina el Desarrollo con 15 Comandos"
subtitle: "Commands: 15 Comandos Slash | Everything Claude Code"
description: "Aprende los 15 comandos slash de Everything Claude Code. Domina los comandos clave como /plan, /tdd, /code-review, /e2e, /verify para mejorar tu eficiencia de desarrollo."
tags:
  - "commands"
  - "slash-commands"
  - "workflow"
prerequisite:
  - "start-quickstart"
order: 50
---

# Guía Completa de Commands: Los 15 Comandos Slash

## Lo Que Aprenderás

- Iniciar rápidamente el flujo de desarrollo TDD para lograr código de alta calidad
- Crear planes de implementación sistemáticos, evitando omitir pasos clave
- Ejecutar revisiones de código completas y auditorías de seguridad
- Generar pruebas end-to-end para validar flujos de usuario críticos
- Automatizar la corrección de errores de compilación, ahorrando tiempo de depuración
- Limpiar código muerto de forma segura, manteniendo la base de código limpia
- Extraer y reutilizar patrones de problemas ya resueltos
- Gestionar el estado del trabajo y puntos de control
- Ejecutar validaciones completas para asegurar que el código está listo

## Tu Situación Actual

Durante el desarrollo, puedes enfrentar estos problemas:

- **No sabes por dónde empezar** — Ante nuevos requisitos, ¿cómo descomponer los pasos de implementación?
- **Baja cobertura de pruebas** — Escribes mucho código, pero no hay suficientes pruebas, la calidad es difícil de garantizar
- **Errores de compilación acumulados** — Después de modificar el código, los errores de tipo aparecen uno tras otro, no sabes dónde empezar a arreglarlos
- **Revisiones de código no sistemáticas** — Revisar a simple vista es fácil pasar por alto problemas de seguridad
- **Resolver los mismos problemas repetidamente** — Caes en los mismos agujeros la próxima vez

Los 15 comandos slash de Everything Claude Code están diseñados para resolver estos puntos débiles.

## Concepto Central

**Los comandos son puntos de entrada al flujo de trabajo**. Cada comando encapsula un proceso de desarrollo completo, invocando el agent o skill correspondiente para ayudarte a completar tareas específicas.

::: tip Comando vs Agent vs Skill

- **Comando**: El acceso directo que ingresas en Claude Code (como `/tdd`, `/plan`)
- **Agent**: Sub-agentes especializados que el comando invoca para la ejecución específica
- **Skill**: Definiciones de flujo de trabajo y conocimiento de dominio que los agents pueden referenciar

Un comando típicamente invoca uno o más agents, y los agents pueden referenciar skills relacionadas.

:::

## Resumen de Comandos

Los 15 comandos clasificados por función:

| Categoría | Comando | Propósito |
| --- | --- | --- |
| **Flujo de Desarrollo** | `/plan` | Crear plan de implementación |
| | `/tdd` | Ejecutar desarrollo guiado por pruebas |
| | `/orchestrate` | Ejecutar secuencia de múltiples agents |
| **Calidad de Código** | `/code-review` | Revisión de código |
| | `/build-fix` | Corregir errores de compilación |
| | `/refactor-clean` | Limpiar código muerto |
| | `/verify` | Validación completa |
| **Pruebas** | `/e2e` | Pruebas end-to-end |
| | `/test-coverage` | Analizar cobertura de pruebas |
| | `/eval` | Gestionar desarrollo guiado por evaluaciones |
| **Documentación y Arquitectura** | `/update-docs` | Sincronizar documentación |
| | `/update-codemaps` | Actualizar documentación de arquitectura |
| **Gestión de Estado** | `/checkpoint` | Guardar estado de trabajo |
| **Aprendizaje y Optimización** | `/learn` | Extraer patrones reutilizables |
| **Configuración** | `/setup-pm` | Configurar gestor de paquetes |

## Comandos de Flujo de Desarrollo

### /plan: Planificar Funciones Complejas

**Propósito**: Crear un plan de implementación detallado antes de comenzar a codificar.

**Escenarios Aplicables**:
- Comenzar desarrollo de nuevas funciones
- Realizar cambios arquitectónicos significativos
- Cuando los requisitos no son claros o son ambiguos
- Modificaciones coordinadas de múltiples archivos/componentes

**Flujo de Trabajo**:

```
1. Reformular requisitos
   ↓
2. Identificar riesgos y dependencias
   ↓
3. Descomponer en fases específicas
   ↓
4. Esperar tu confirmación
```

::: warning Característica Clave

El agent planner **no escribirá ningún código** hasta que confirmes explícitamente el plan.

:::

**Ejemplo**:

```
Tú: /plan Necesito agregar funcionalidad de notificaciones en tiempo real

Claude:
# Plan de Implementación: Notificaciones de Resolución de Mercado en Tiempo Real

## Reformulación de Requisitos
- Enviar notificaciones cuando los mercados se resuelvan
- Soportar múltiples canales (in-app, email, webhook)
- Asegurar entrega confiable
- Incluir resultado del mercado y resultado de la posición del usuario

## Fases de Implementación
### Fase 1: Esquema de Base de Datos
- Agregar tabla de notificaciones
- Agregar tabla de preferencias de notificación del usuario
- Crear índices

### Fase 2: Servicio de Notificaciones
- Crear cola de notificaciones usando BullMQ/Redis
- Implementar lógica de reintentos
- Crear plantillas de notificación

...

ESPERANDO CONFIRMACIÓN: ¿Proceder con este plan? (yes/no/modify)
```

**Mejores Prácticas**:
- ✅ Planifica primero las funciones complejas antes de implementar
- ✅ Revisa cuidadosamente los riesgos y dependencias
- ✅ Ejecuta por fases, verificando cada una
- ❌ No te saltes la planificación directamente

---

### /tdd: Desarrollo Guiado por Pruebas

**Propósito**: Forzar el flujo de TDD, asegurando cobertura de pruebas ≥ 80%.

**Escenarios Aplicables**:
- Implementar nuevas funciones
- Corregir Bugs (primero escribir pruebas que reproduzcan el bug)
- Refactorizar código existente
- Escribir lógica de negocio principal

**Ciclo de TDD**:

```
RED → GREEN → REFACTOR → REPEAT

RED:      Escribir una prueba que fallará
GREEN:    Escribir el mínimo código para que la prueba pase
REFACTOR: Mejorar el código manteniendo las pruebas pasando
REPEAT:   Siguiente función/escenario
```

::: warning Requisito Obligatorio

**Debes escribir primero la prueba, luego el código**. No puedes saltarte la fase RED.

:::

**Ejemplo**:

```
Tú: /tdd Necesito una función que calcule el puntaje de liquidez del mercado

Claude (agent tdd-guide):
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
test('debería retornar puntaje alto para mercado líquido', () => {
  const market = { ... }
  expect(calculateLiquidityScore(market)).toBeGreaterThan(80)
})
```

## Paso 3: Ejecutar Pruebas - Verificar FALLA
```bash
npm test lib/liquidity.test.ts
FAIL ✕ debería retornar puntaje alto para mercado líquido
  Error: No implementado
```

## Paso 4: Implementar Código Mínimo (GREEN)
```typescript
export function calculateLiquidityScore(market: MarketData): number {
  // código de implementación...
}
```

## Paso 5: Ejecutar Pruebas - Verificar ÉXITO
```bash
npm test lib/liquidity.test.ts
PASS ✓ debería retornar puntaje alto para mercado líquido
```

## Paso 6: Refactorizar (IMPROVE)
// Mejorar estructura del código...

## Paso 7: Verificar que las Pruebas Sigan Pasando
```bash
npm test lib/liquidity.test.ts
PASS ✓ todas las pruebas pasando
```

## Paso 8: Verificar Cobertura
Cobertura: 100% ✅ (Objetivo: 80%)
```

**Mejores Prácticas**:
- ✅ Escribe primero la definición de interfaz
- ✅ Implementa después de que la prueba falle
- ✅ Prueba inmediatamente después de escribir cada función
- ✅ Verifica que las pruebas pasen antes y después de refactorizar
- ✅ Cobertura ≥ 80% (código crítico 100%)
- ❌ No escribas mucho código antes de probar
- ❌ No te saltes la fase RED
- ❌ No pruebes detalles de implementación

---

### /orchestrate: Ejecutar Agents en Secuencia

**Propósito**: Automatizar la ejecución de flujos de trabajo de secuencia de múltiples agents.

**Escenarios Aplicables**:
- Desarrollo completo de funciones (planner → tdd-guide → code-reviewer → security-reviewer)
- Flujo de corrección de bugs (explorer → tdd-guide → code-reviewer)
- Revisión de seguridad (security-reviewer → code-reviewer → architect)

**Tipos de Flujo de Trabajo**:

| Tipo de Flujo | Secuencia de Agents |
| --- | --- |
| `feature` | planner → tdd-guide → code-reviewer → security-reviewer |
| `bugfix` | explorer → tdd-guide → code-reviewer |
| `refactor` | architect → code-reviewer → tdd-guide |
| `security` | security-reviewer → code-reviewer → architect |

**Ejemplo**:

```
Tú: /orchestrate feature "Agregar funcionalidad de autenticación de usuarios"

Claude:
### REPORTE DE ORQUESTACIÓN
Flujo de trabajo: feature
Tarea: Agregar funcionalidad de autenticación de usuarios
Agents: planner → tdd-guide → code-reviewer → security-reviewer

RESUMEN
-------
Funcionalidad de autenticación de usuarios implementada exitosamente, incluyendo registro, login, gestión de sesiones.

SALIDAS DE AGENTS
-----------------
Planner: Plan de implementación de 4 fases creado
TDD Guide: Servicio de autenticación implementado, 95% de cobertura
Code Reviewer: 3 problemas de alta prioridad encontrados, corregidos
Security Reviewer: Auditoría de seguridad pasada, sin vulnerabilidades

ARCHIVOS MODIFICADOS
--------------------
- src/services/auth.ts
- src/api/auth/route.ts
- tests/auth.test.ts
- ...

RESULTADOS DE PRUEBAS
---------------------
PASS: 24/24 pruebas (100%)

ESTADO DE SEGURIDAD
-------------------
✅ No se encontraron vulnerabilidades

RECOMENDACIÓN
-------------
✅ SHIP - Listo para producción
```

**Mejores Prácticas**:
- ✅ Usa orchestrate para funciones complejas
- ✅ Documentación clara de handoff entre cada agent
- ✅ Ejecuta verificaciones independientes en paralelo (code-reviewer y security-reviewer)
- ❌ No uses orchestrate para tareas simples

---

## Comandos de Calidad de Código

### /code-review: Revisión de Código

**Propósito**: Revisión completa de código no confirmado, verificando problemas de seguridad y calidad de código.

**Escenarios Aplicables**:
- Antes de confirmar código
- Antes de fusionar PR
- Después de completar el desarrollo de una función

**Elementos de Verificación**:

| Categoría | Contenido de Verificación | Severidad |
| --- | --- | --- |
| **Seguridad** | Claves hardcodeadas, inyección SQL, XSS, falta de validación de entrada | CRITICAL |
| **Calidad de Código** | Funciones > 50 líneas, archivos > 800 líneas, profundidad de anidamiento > 4 | HIGH |
| **Mejores Prácticas** | Patrones mutantes, console.log, falta de pruebas, TODO/FIXME | MEDIUM |

**Ejemplo**:

```
Tú: /code-review

Claude (agent code-reviewer):
# Reporte de Revisión de Código

## Problemas de Seguridad (CRITICAL)
🔴 [HIGH] Clave API hardcodeada
Archivo: src/api/github.ts:15
Problema: El token de GitHub está hardcodeado
Corrección: Mover a variable de entorno

## Calidad de Código (HIGH)
🟡 [MEDIUM] Función excede 50 líneas
Archivo: src/utils/formatter.ts:62
Líneas: 78
Problema: La función FormatLargeData es demasiado larga
Corrección: Dividir en funciones más pequeñas

## Mejores Prácticas (MEDIUM)
🟢 [LOW] Comentario TODO
Archivo: src/services/user.ts:45
Problema: TODO: Agregar rate limiting
Corrección: Implementar o eliminar comentario

RESUMEN
--------
CRITICAL: 1 (Debe corregirse antes de confirmar)
HIGH: 2 (Debería corregirse)
MEDIUM: 3 (Sería bueno tenerlo)

❌ BLOQUEADO - Problemas críticos de seguridad encontrados
```

::: danger Regla de Bloqueo de Confirmación

Si se encuentran problemas de nivel **CRITICAL** o **HIGH**, se bloqueará la confirmación.

:::

---

### /build-fix: Corregir Errores de Compilación

**Propósito**: Corregir errores de TypeScript y de compilación uno por uno.

**Escenarios Aplicables**:
- Cuando `npm run build` falla
- Errores de tipo de TypeScript
- Errores de compilación

**Flujo de Trabajo**:

```
1. Ejecutar compilación
   ↓
2. Analizar salida de errores, ordenar por severidad
   ↓
3. Corregir uno por uno:
   - Mostrar contexto del error
   - Explicar el problema
   - Proponer solución
   - Aplicar corrección
   - Re-ejecutar compilación
   ↓
4. Generar resumen de correcciones
```

**Ejemplo**:

```
Tú: /build-fix

Claude (agent build-error-resolver):
# Corrigiendo Errores de Compilación

Ejecutando compilación: npm run build
Se encontraron 5 errores

## Error 1: El tipo 'string' no es asignable al tipo 'number'
Archivo: src/calculator.ts:15
```typescript
const result = add("10", "20")  // Error
```
Problema: La función add espera números, recibió strings
Corrección: Convertir a números
```typescript
const result = add(Number("10"), Number("20"))
```
✅ Corregido. Re-ejecutando compilación...

## Error 2: No se puede encontrar el módulo './utils'
Archivo: src/index.ts:3
Problema: La ruta de importación es incorrecta
Corrección: Cambiar a './utils/helper'
```typescript
import { helper } from './utils/helper'
```
✅ Corregido. Re-ejecutando compilación...

...

RESUMEN
-------
Errores Corregidos: 5
Errores Restantes: 0
Estado de Compilación: ✅ PASS
```

::: tip Seguridad Primero

Corrige solo un error a la vez para evitar introducir nuevos problemas.

:::

---

### /refactor-clean: Limpiar Código Muerto

**Propósito**: Identificar y eliminar de forma segura el código no utilizado.

**Escenarios Aplicables**:
- La base de código tiene muchos archivos y exportaciones no utilizados
- Reducir la carga de mantenimiento
- Mejorar la legibilidad del código

**Flujo de Trabajo**:

```
1. Ejecutar herramientas de análisis de código muerto
   - knip: Encontrar exportaciones y archivos no utilizados
   - depcheck: Encontrar dependencias no utilizadas
   - ts-prune: Encontrar exportaciones TypeScript no utilizadas
   ↓
2. Generar reporte consolidado
   ↓
3. Clasificar por severidad
   - SAFE: Archivos de prueba, funciones de utilidad no utilizadas
   - CAUTION: Rutas API, componentes
   - DANGER: Archivos de configuración, archivos de entrada
   ↓
4. Eliminar uno por uno (primero probar)
   ↓
5. Generar resumen de limpieza
```

**Ejemplo**:

```
Tú: /refactor-clean

Claude (agent refactor-cleaner):
# Análisis de Código Muerto

## Herramientas Ejecutadas
- ✅ knip: Se encontraron 12 exportaciones no utilizadas
- ✅ depcheck: Se encontraron 5 dependencias no utilizadas
- ✅ ts-prune: Se encontraron 8 exportaciones TypeScript no utilizadas

## Clasificación

### SAFE (Se puede eliminar)
- `src/utils/old-helper.ts` - Función de utilidad no utilizada
- `src/components/Button.tsx` - No se usa en ningún lado
- `lodash` - Dependencia no utilizada

### CAUTION (Revisar primero)
- `src/api/users.ts` - Solo usado en pruebas
- `@types/node` - Puede usarse en scripts de compilación

### DANGER (No eliminar)
- `src/index.ts` - Punto de entrada principal
- `tsconfig.json` - Archivo de configuración

## Plan de Eliminación

Ejecutar suite de pruebas completa primero:
✅ Pruebas pasando (98% de cobertura)

Eliminando elementos SAFE...

1. Eliminando src/utils/old-helper.ts
   ✅ Las pruebas siguen pasando

2. Eliminando src/components/Button.tsx
   ✅ Las pruebas siguen pasando

3. Eliminando lodash de package.json
   ✅ Las pruebas siguen pasando

RESUMEN
-------
Archivos eliminados: 12
Dependencias removidas: 5
Las pruebas siguen pasando: ✅
```

::: warning Pruebas Primero

**Debes ejecutar pruebas antes de eliminar código** para asegurar que no se rompa la funcionalidad existente.

:::
