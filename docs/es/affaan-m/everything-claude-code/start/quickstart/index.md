---
title: "Inicio Rápido: Instalación de Plugin | everything-claude-code"
sidebarTitle: "Inicio en 5 Minutos"
subtitle: "Inicio Rápido: Instalación del plugin everything-claude-code"
description: "Aprende a instalar everything-claude-code y sus funciones principales. Completa la instalación en 5 minutos, usa los comandos /plan, /tdd, /code-review para mejorar la eficiencia de desarrollo."
tags:
  - "quickstart"
  - "installation"
  - "getting-started"
prerequisite: []
order: 10
---

# Inicio Rápido: Everything Claude Code en 5 Minutos

## Qué Aprenderás

**Everything Claude Code** es un plugin de Claude Code que proporciona agents, commands, rules y hooks profesionales para ayudarte a mejorar la calidad del código y la eficiencia de desarrollo. Este tutorial te ayuda:

- ✅ Completar la instalación de Everything Claude Code en 5 minutos
- ✅ Usar el comando `/plan` para crear un plan de implementación
- ✅ Usar el comando `/tdd` para desarrollo guiado por pruebas
- ✅ Usar `/code-review` para revisión de código
- ✅ Comprender los componentes principales del plugin

## Tu Situación Actual

Quieres hacer Claude Code más potente, pero:
- ❌ Cada vez tienes que repetir las especificaciones de codificación y mejores prácticas
- ❌ Baja cobertura de pruebas, bugs frecuentes
- ❌ La revisión de código siempre omite problemas de seguridad
- ❌ Quieres TDD pero no sabes cómo empezar
- ❌ Deseas tener sub-agents profesionales para manejar tareas específicas

**Everything Claude Code** resuelve estos problemas:
- 9 agents especializados (planner, tdd-guide, code-reviewer, security-reviewer, etc.)
- 14 comandos de barra (/plan, /tdd, /code-review, etc.)
- 8 conjuntos de reglas obligatorias (security, coding-style, testing, etc.)
- 15+ hooks automatizados
- 11 skills de workflow

## Conceptos Fundamentales

**Everything Claude Code** es un plugin de Claude Code que proporciona:
- **Agents**: Sub-agents especializados que manejan tareas específicas de dominio (como TDD, revisión de código, auditoría de seguridad)
- **Commands**: Comandos de barra para iniciar rápidamente workflows (como `/plan`, `/tdd`)
- **Rules**: Reglas obligatorias que aseguran calidad de código y seguridad (como cobertura 80%+, prohibir console.log)
- **Skills**: Definiciones de workflow que reutilizan mejores prácticas
- **Hooks**: Ganchos automatizados que se activan en eventos específicos (como persistencia de sesión, advertencias de console.log)

::: tip ¿Qué es un plugin de Claude Code?
Los plugins de Claude Code extienden las capacidades de Claude Code, como los plugins de VS Code extienden la funcionalidad del editor. Después de instalar, puedes usar todos los agents, commands, skills y hooks proporcionados por el plugin.
:::

## 🎒 Preparativos

**Lo que necesitas**:
- Claude Code ya instalado
- Conocimiento básico de comandos de terminal
- Un directorio de proyecto (para pruebas)

**Lo que NO necesitas**:
- Conocimiento especial de lenguajes de programación
- Configuración previa

---

## Sígueme: Instalación en 5 Minutos

### Paso 1: Abrir Claude Code

Inicia Claude Code y abre un directorio de proyecto.

**Deberías ver**: La interfaz de línea de comandos de Claude Code lista.

---

### Paso 2: Agregar Marketplace

En Claude Code, ejecuta el siguiente comando para agregar el marketplace:

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

**Por qué**
Agrega Everything Claude Code como fuente de plugins de Claude Code, para que puedas instalar plugins desde allí.

**Deberías ver**:
```
✓ Successfully added marketplace: everything-claude-code
```

---

### Paso 3: Instalar el Plugin

Ejecuta el siguiente comando para instalar el plugin:

```bash
/plugin install everything-claude-code@everything-claude-code
```

**Por qué**
Instala el plugin Everything Claude Code, para que puedas usar todas sus funciones.

**Deberías ver**:
```
✓ Successfully installed plugin: everything-claude-code@everything-claude-code
```

---

### Paso 4: Verificar la Instalación

Ejecuta el siguiente comando para ver los plugins instalados:

```bash
/plugin list
```

**Deberías ver**:
```
Installed Plugins:
  everything-claude-code@everything-claude-code
```

✅ ¡Instalación exitosa!

---

## Sígueme: Experimenta las Funciones Principales

### Paso 5: Usar /plan para Crear un Plan de Implementación

Supongamos que quieres agregar una función de autenticación de usuario, ejecuta:

```bash
/plan I need to add user authentication with email and password
```

**Por qué**
Usa el agent planner para crear un plan de implementación detallado, evitando omitir pasos clave.

**Deberías ver**:
```
# Implementation Plan: User Authentication with Email and Password

## Requirements Restatement
- User registration with email and password
- User login with email and password
- Password hashing with bcrypt
- JWT token generation
- Session management

## Implementation Phases
[detailed implementation steps...]

## Risks
- HIGH: Password security (use bcrypt, salt rounds)
- MEDIUM: JWT token expiration
- LOW: Email uniqueness validation

## Estimated Complexity: MEDIUM
**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

Escribe `yes` para confirmar el plan, y el planner comenzará a implementar.

---

### Paso 6: Usar /tdd para Desarrollo Guiado por Pruebas

Al implementar una función, ejecuta:

```bash
/tdd I need to implement a function to validate email format
```

**Por qué**
Usa el agent tdd-guide para forzar el flujo TDD, asegurando primero escribir pruebas, luego implementar código, alcanzando cobertura 80%+.

**Deberías ver**:
```
# TDD Session: Email Format Validator

## Step 1: Define Interface (SCAFFOLD)
```typescript
// lib/email-validator.ts
export interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validateEmail(email: string): ValidationResult {
  // TODO: Implementation
  throw new Error('Not implemented')
}
```

## Step 2: Write Failing Test (RED)
[test code...]

## Step 3: Run Tests - Verify FAIL
[test failure...]

✅ Tests fail as expected. Ready to implement.

## Step 4: Implement Minimal Code (GREEN)
[implementation code...]

## Step 5: Run Tests - Verify PASS
[tests pass...]

## Step 6: Refactor (IMPROVE)
[refactored code...]

## Step 7: Verify Tests Still Pass
[tests still pass...]

## Step 8: Check Coverage
Coverage: 100% ✅ (Target: 80%)

✅ TDD session complete!
```

---

### Paso 7: Usar /code-review para Revisar Código

Antes de hacer commit del código, ejecuta:

```bash
/code-review
```

**Por qué**
Usa el agent code-reviewer para verificar calidad de código, seguridad y mejores prácticas.

**Deberías ver**:
```
# Code Review Report

## Overview
- Files reviewed: 3
- Total lines: 150
- Issues found: 2

## Issues Found

### 1. [CRITICAL] Hardcoded JWT Secret
**Location**: `lib/auth.ts:15`
**Issue**: JWT secret is hardcoded in source code
**Fix**: Move to environment variable
**Impact**: Security vulnerability - secret exposed in code

### 2. [MEDIUM] Missing Error Handling
**Location**: `lib/email-validator.ts:23`
**Issue**: No error handling for null/undefined input
**Fix**: Add null check at function start
**Impact**: Potential runtime errors

## Recommendations
✓ Tests are well written
✓ Code is readable
✓ Follows TypeScript best practices

**Action Required**: Fix CRITICAL issues before commit.
```

Después de corregir los problemas, ejecuta `/code-review` nuevamente para confirmar que todos los problemas han sido resueltos.

---

## Punto de Verificación ✅

Confirma que has completado exitosamente los siguientes pasos:

- [ ] Agregado exitosamente el marketplace
- [ ] Instalado exitosamente el plugin everything-claude-code
- [ ] Creado un plan de implementación con `/plan`
- [ ] Realizado desarrollo TDD con `/tdd`
- [ ] Realizado revisión de código con `/code-review`

Si tienes problemas, consulta [Solución de Problemas de Hooks](../../faq/troubleshooting-hooks/) o verifica [Fallo de Conexión MCP](../../faq/troubleshooting-mcp/).

---

## Advertencias Comunes

::: warning Fallo de Instalación
Si `/plugin marketplace add` falla, asegúrate de:
1. Usar la última versión de Claude Code
2. Tener conexión de red normal
3. Acceso a GitHub normal (puede requerir proxy)
:::

::: warning Comando No Disponible
Si los comandos `/plan` o `/tdd` no están disponibles:
1. Ejecuta `/plugin list` para confirmar que el plugin está instalado
2. Verifica que el estado del plugin sea enabled
3. Reinicia Claude Code
:::

::: tip Usuarios de Windows
Everything Claude Code es completamente compatible con Windows. Todos los hooks y scripts están reescritos en Node.js para asegurar compatibilidad multiplataforma.
:::

---

## Resumen de la Lección

✅ Ya has:
1. Instalado exitosamente el plugin Everything Claude Code
2. Entendido los conceptos clave: agents, commands, rules, skills, hooks
3. Experimentado los tres comandos principales: `/plan`, `/tdd`, `/code-review`
4. Dominado el flujo básico de desarrollo TDD

**Recuerda**:
- Los Agents son sub-agents especializados que manejan tareas específicas
- Los Commands son puntos de entrada para iniciar rápidamente workflows
- Las Rules son reglas obligatorias que aseguran calidad de código y seguridad
- Comienza con funciones que te resulten útiles, expande gradualmente
- No habilites todos los MCPs, mantén menos de 10

---

## Próxima Lección

> En la próxima lección aprenderemos **[Guía de Instalación: Marketplace vs Instalación Manual](../installation/)**.
>
> Aprenderás:
> - Pasos detallados para la instalación desde marketplace
> - Flujo completo de instalación manual
> - Cómo copiar solo los componentes que necesitas
> - Métodos de configuración del servidor MCP

Continúa aprendiendo para conocer a fondo la instalación y configuración completa de Everything Claude Code.

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Actualizado: 2026-01-25

| Funcionalidad          | Ruta del Archivo                                                                                    | Línea  |
|--- | --- | ---|
| Manifiesto del Plugin       | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28  |
| Configuración de Marketplace | [`.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | 1-45  |
| Instrucciones de Instalación       | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md)                        | 175-242 |
| Comando /plan      | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md)            | 1-114 |
| Comando /tdd      | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md)            | 1-327 |
|--- | --- | ---|

**Constantes Clave**:
- Nombre del Plugin: `everything-claude-code`
- Repositorio de Marketplace: `affaan-m/everything-claude-code`

**Archivos Clave**:
- `plugin.json`: Metadatos del plugin y rutas de componentes
- `commands/*.md`: 14 definiciones de comandos de barra
- `agents/*.md`: 9 sub-agents especializados
- `rules/*.md`: 8 conjuntos de reglas obligatorias
- `hooks/hooks.json`: Configuración de 15+ hooks automatizados

</details>
