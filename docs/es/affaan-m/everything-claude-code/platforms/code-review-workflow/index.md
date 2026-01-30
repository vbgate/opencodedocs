---
title: "Revisión de Código: Flujo de /code-review | Everything Claude Code"
subtitle: "Revisión de Código: Flujo de /code-review"
sidebarTitle: "Revisa Antes de Hacer Commit"
description: "Aprende a usar el comando /code-review. Domina las verificaciones de calidad de código y seguridad con los agents code-reviewer y security-reviewer, detecta vulnerabilidades y problemas de código antes de hacer commit."
tags:
  - "code-review"
  - "security"
  - "code-quality"
  - "owasp"
prerequisite:
  - "start-quickstart"
order: 80
---

# Flujo de Revisión de Código: /code-review y Auditoría de Seguridad

## Qué Aprenderás

**La revisión de código** es un paso crítico para asegurar la calidad y seguridad del código. Este tutorial te ayuda a:

- ✅ Usar el comando `/code-review` para verificar automáticamente cambios de código
- ✅ Entender la diferencia entre code-reviewer agent y security-reviewer agent
- ✅ Dominar la lista de verificación de seguridad (OWASP Top 10)
- ✅ Detectar y corregir vulnerabilidades comunes (inyección SQL, XSS, claves hardcodeadas, etc.)
- ✅ Aplicar estándares de calidad de código (tamaño de funciones, longitud de archivos, cobertura de pruebas, etc.)
- ✅ Entender los criterios de aprobación (CRITICAL, HIGH, MEDIUM, LOW)

## Tu Situación Actual

Has escrito código y estás listo para hacer commit, pero:

- ❌ No sabes si hay vulnerabilidades de seguridad en el código
- ❌ Te preocupa haber pasado por alto problemas de calidad de código
- ❌ No estás seguro de haber seguido las mejores prácticas
- ❌ La verificación manual consume tiempo y es propensa a omisiones
- ❌ Quieres detectar problemas automáticamente antes de hacer commit

**El flujo de revisión de código de Everything Claude Code** resuelve estos problemas:

- **Verificación automatizada**: El comando `/code-review` analiza automáticamente todos los cambios
- **Revisión especializada**: code-reviewer agent se enfoca en calidad de código, security-reviewer agent en seguridad
- **Clasificación estándar**: Los problemas se clasifican por severidad (CRITICAL, HIGH, MEDIUM, LOW)
- **Recomendaciones detalladas**: Cada problema incluye sugerencias específicas de corrección

## Cuándo Usar Esta Técnica

**Deberías ejecutar revisión de código antes de cada commit**:

- ✅ Después de completar código de nuevas funcionalidades
- ✅ Después de corregir bugs
- ✅ Después de refactorizar código
- ✅ Al agregar endpoints de API (debe ejecutar security-reviewer)
- ✅ Código que maneja entrada de usuario (debe ejecutar security-reviewer)
- ✅ Código relacionado con autenticación/autorización (debe ejecutar security-reviewer)

::: tip Mejores Prácticas
Desarrolla el hábito: antes de cada `git commit`, ejecuta primero `/code-review`. Si hay problemas CRITICAL o HIGH, corrígelos antes de hacer commit.
:::

## 🎒 Preparativos

**Lo que necesitas**:
- Everything Claude Code ya instalado (si aún no lo has instalado, consulta [Inicio Rápido](../../start/quickstart/))
- Algunos cambios de código (puedes escribir código primero con `/tdd`)
- Conocimiento básico de operaciones Git

**Lo que NO necesitas**:
- No necesitas ser experto en seguridad (el agent te ayudará a detectar)
- No necesitas recordar todas las mejores prácticas de seguridad (el agent te recordará)

---

## Idea Central

Everything Claude Code proporciona dos agents de revisión especializados:

### code-reviewer agent

**Se enfoca en calidad de código y mejores prácticas**, verifica:

- **Calidad de código**: Tamaño de funciones (>50 líneas), longitud de archivos (>800 líneas), profundidad de anidación (>4 niveles)
- **Manejo de errores**: Falta de try/catch, declaraciones console.log
- **Estándares de código**: Convenciones de nomenclatura, código duplicado, patrones inmutables
- **Mejores prácticas**: Uso de emojis, TODO/FIXME sin ticket, falta de JSDoc
- **Cobertura de pruebas**: Código nuevo sin pruebas

**Caso de uso**: Todos los cambios de código deben pasar por code-reviewer.

### security-reviewer agent

**Se enfoca en vulnerabilidades y amenazas de seguridad**, verifica:

- **OWASP Top 10**: Inyección SQL, XSS, CSRF, bypass de autenticación, etc.
- **Fuga de claves**: API keys hardcodeadas, contraseñas, tokens
- **Validación de entrada**: Validación de entrada de usuario faltante o inadecuada
- **Autenticación y autorización**: Verificación inadecuada de identidad y permisos
- **Seguridad de dependencias**: Paquetes obsoletos o con vulnerabilidades conocidas

**Caso de uso**: Código sensible a seguridad (API, autenticación, pagos, entrada de usuario) debe pasar por security-reviewer.

### Clasificación de Severidad de Problemas

| Nivel | Significado | ¿Bloquea Commit? | Ejemplo |
| --- | --- | --- | --- |
| **CRITICAL** | Vulnerabilidad de seguridad grave o problema de calidad mayor | ❌ Debe bloquear | API key hardcodeada, inyección SQL |
| **HIGH** | Problema importante de seguridad o calidad de código | ❌ Debe bloquear | Falta de manejo de errores, vulnerabilidad XSS |
| **MEDIUM** | Problema de prioridad media | ⚠️ Puede hacer commit con precaución | Uso de emojis, falta de JSDoc |
| **LOW** | Problema menor | ✓ Puede corregirse después | Formato inconsistente, números mágicos |

---

## Sígueme: Primera Revisión de Código

### Paso 1: Crear Algunos Cambios de Código

Primero usa `/tdd` para escribir un endpoint de API simple (con algunas vulnerabilidades de seguridad):

```bash
/tdd
```

Pide a Claude Code que cree una API de inicio de sesión de usuario, el código se verá así:

```typescript
// src/api/login.ts
export async function loginUser(email: string, password: string) {
  const query = `SELECT * FROM users WHERE email = '${email}'`  // ❌ Riesgo de inyección SQL
  const user = await db.query(query)
  
  if (user.password === password) {  // ❌ Comparación de contraseña en texto plano
    const token = generateToken(user.id)
    console.log('User logged in:', { email, password })  // ❌ Fuga de contraseña en logs
    return { token }
  }
}
```

**Por qué**
Este código contiene múltiples vulnerabilidades de seguridad y problemas de calidad, ideal para demostrar la funcionalidad de revisión de código.

**Deberías ver**: Archivo de código creado.

---

### Paso 2: Ejecutar Revisión de Código

Ahora ejecuta el comando `/code-review`:

```bash
/code-review
```

**Por qué**
`/code-review` llamará automáticamente al code-reviewer agent para verificar todos los cambios sin commit.

**Deberías ver**: El agent comienza a analizar el código y luego genera un informe de revisión.

---

### Paso 3: Ver Informe de Revisión

code-reviewer generará un informe similar a este:

```markdown
# Code Review Report

## Critical Issues (Fix Immediately)

### 1. [CRITICAL] Hardcoded credentials
**File:** src/api/login.ts:3
**Issue:** Password logging in console
**Fix:** Remove password from logs, only log user ID

```typescript
// ❌ Bad
console.log('User logged in:', { email, password })

// ✓ Good
console.log('User logged in:', { email, userId: user.id })
```

---

### 2. [CRITICAL] SQL injection vulnerability
**File:** src/api/login.ts:2
**Issue:** String concatenation in SQL query
**Fix:** Use parameterized queries

```typescript
// ❌ Bad
const query = `SELECT * FROM users WHERE email = '${email}'`

// ✓ Good
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', email)
```

---

## High Issues (Fix Before Production)

### 3. [HIGH] Plaintext password comparison
**File:** src/api/login.ts:4
**Issue:** Password stored in plaintext
**Fix:** Use bcrypt to hash passwords

```typescript
// ❌ Bad
if (user.password === password) {

// ✓ Good
import bcrypt from 'bcrypt'
const isValid = await bcrypt.compare(password, user.password)
```

---

## Recommendations

1. Add input validation for email format
2. Add rate limiting to prevent brute force attacks
3. Use JWT tokens instead of generating custom tokens

## Approval Status

❌ BLOCKED - 2 CRITICAL issues found

Please fix all CRITICAL and HIGH issues before committing.
```

**Por qué**
El informe clasifica por severidad, cada problema incluye ubicación, descripción, sugerencias de corrección y ejemplos de código.

**Deberías ver**: Informe de revisión claro que señala todos los problemas y sugerencias de corrección.

---

### Paso 4: Corregir Problemas

Corrige el código según el informe:

```typescript
// src/api/login.ts
import bcrypt from 'bcrypt'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export async function loginUser(input: unknown) {
  // Validación de entrada
  const validated = LoginSchema.parse(input)
  
  // Consulta parametrizada (previene inyección SQL)
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', validated.email)
    .single()
  
  if (!user) {
    throw new Error('Invalid credentials')
  }
  
  // Comparación de contraseña hasheada
  const isValid = await bcrypt.compare(validated.password, user.password_hash)
  
  if (isValid) {
    const token = generateToken(user.id)
    console.log('User logged in:', { email: validated.email, userId: user.id })
    return { token }
  }
  
  throw new Error('Invalid credentials')
}
```

**Por qué**
Corrige todos los problemas CRITICAL y HIGH, agrega validación de entrada y comparación de contraseña hasheada.

**Deberías ver**: Código actualizado, vulnerabilidades de seguridad eliminadas.

---

### Paso 5: Revisar Nuevamente

Ejecuta `/code-review` nuevamente:

```bash
/code-review
```

**Por qué**
Verifica que todos los problemas estén corregidos, asegura que el código pueda hacerse commit.

**Deberías ver**: Informe de aprobación similar a este:

```markdown
# Code Review Report

## Summary

- **Critical Issues:** 0 ✓
- **High Issues:** 0 ✓
- **Medium Issues:** 1 ⚠️
- **Low Issues:** 1 💡

## Medium Issues (Fix When Possible)

### 1. [MEDIUM] Missing JSDoc for public API
**File:** src/api/login.ts:9
**Issue:** loginUser function missing documentation
**Fix:** Add JSDoc comments

```typescript
/**
 * Authenticates a user with email and password
 * @param input - Login credentials (email, password)
 * @returns Object with JWT token
 * @throws Error if credentials invalid
 */
export async function loginUser(input: unknown) {
```

---

## Low Issues (Consider Fixing)

### 2. [LOW] Add rate limiting
**File:** src/api/login.ts:9
**Issue:** Login endpoint lacks rate limiting
**Fix:** Add express-rate-limit middleware

```typescript
import rateLimit from 'express-rate-limit'

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 attempts per window
})

app.post('/api/login', loginLimiter, loginUser)
```

---

## Approval Status

✅ APPROVED - No CRITICAL or HIGH issues

**Note:** Medium and Low issues can be fixed in follow-up commits.
```

**Deberías ver**: Revisión aprobada, código listo para commit.

---

### Paso 6: Revisión de Seguridad Especializada (Opcional)

Si tu código involucra endpoints de API, autenticación, pagos u otras funcionalidades sensibles a seguridad, puedes llamar específicamente a security-reviewer:

```bash
/security-reviewer
```

**Por qué**
security-reviewer realizará un análisis más profundo de OWASP Top 10, verificando más patrones de vulnerabilidades de seguridad.

**Deberías ver**: Informe detallado de revisión de seguridad, incluyendo análisis OWASP, verificación de vulnerabilidades de dependencias, recomendaciones de herramientas de seguridad, etc.

---

## Punto de Verificación ✅

Después de completar los pasos anteriores, deberías:

- ✅ Poder ejecutar el comando `/code-review`
- ✅ Entender la estructura y contenido del informe de revisión
- ✅ Poder corregir problemas de código según el informe
- ✅ Saber que los problemas CRITICAL y HIGH deben corregirse
- ✅ Entender la diferencia entre code-reviewer y security-reviewer
- ✅ Desarrollar el hábito de revisar antes de hacer commit

---

## Advertencias Comunes

### Error Común 1: Omitir Revisión de Código

**Problema**: Pensar que el código es simple y hacer commit directamente sin ejecutar revisión.

**Consecuencia**: Posibles vulnerabilidades de seguridad pasadas por alto, rechazadas por CI/CD o causando incidentes en producción.

**Práctica correcta**: Desarrolla el hábito de ejecutar `/code-review` antes de cada commit.

---

### Error Común 2: Ignorar Problemas MEDIUM

**Problema**: Ver problemas MEDIUM y no atenderlos, acumulándolos.

**Consecuencia**: Calidad de código disminuye, deuda técnica se acumula, difícil de mantener posteriormente.

**Práctica correcta**: Aunque los problemas MEDIUM no bloquean commits, deben corregirse en un tiempo razonable.

---

### Error Común 3: Corregir Inyección SQL Manualmente

**Problema**: Escribir escape de cadenas manualmente en lugar de usar consultas parametrizadas.

**Consecuencia**: Escape incompleto, aún hay riesgo de inyección SQL.

**Práctica correcta**: Siempre usa ORM o consultas parametrizadas, no concatenes SQL manualmente.

---

### Error Común 4: Confundir los Dos Reviewers

**Problema**: Ejecutar solo code-reviewer para todo el código, ignorando security-reviewer.

**Consecuencia**: Vulnerabilidades de seguridad pueden pasarse por alto, especialmente en código relacionado con API, autenticación, pagos.

**Práctica correcta**:
- Código normal: code-reviewer es suficiente
- Código sensible a seguridad: debe ejecutar también security-reviewer

---

## Resumen de la Lección

**El flujo de revisión de código** es una de las funcionalidades principales de Everything Claude Code:

| Funcionalidad | agent | Contenido de Verificación | Severidad |
| --- | --- | --- | --- |
| **Revisión de Calidad de Código** | code-reviewer | Tamaño de funciones, manejo de errores, mejores prácticas | HIGH/MEDIUM/LOW |
| **Revisión de Seguridad** | security-reviewer | OWASP Top 10, fuga de claves, vulnerabilidades de inyección | CRITICAL/HIGH/MEDIUM |

**Puntos Clave**:

1. **Antes de cada commit** ejecuta `/code-review`
2. **Problemas CRITICAL/HIGH** deben corregirse antes de hacer commit
3. **Código sensible a seguridad** debe pasar por security-reviewer
4. **Informe de revisión** incluye ubicación detallada y sugerencias de corrección
5. **Desarrolla el hábito**: Revisar → Corregir → Revisar nuevamente → Commit

---

## Próxima Lección

> En la próxima lección aprenderemos **[Automatización con Hooks](../../advanced/hooks-automation/)**.
>
> Aprenderás:
> - Qué son los Hooks y cómo automatizar el flujo de desarrollo
> - Cómo usar más de 15 hooks de automatización
> - Cómo personalizar Hooks para adaptarse a las necesidades del proyecto
> - Escenarios de aplicación de hooks como SessionStart, SessionEnd, PreToolUse, etc.

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Actualizado: 2026-01-25

| Funcionalidad | Ruta del Archivo | Línea |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |

**Constantes Clave**:
- Límite de tamaño de función: 50 líneas (code-reviewer.md:47)
- Límite de tamaño de archivo: 800 líneas (code-reviewer.md:48)
- Límite de profundidad de anidación: 4 niveles (code-reviewer.md:49)

**Funciones Clave**:
- `/code-review`: Llama al code-reviewer agent para revisión de calidad de código
- `/security-reviewer`: Llama al security-reviewer agent para auditoría de seguridad
- `git diff --name-only HEAD`: Obtiene archivos cambiados sin commit (code-review.md:5)

**Criterios de Aprobación** (code-reviewer.md:90-92):
- ✅ Approve: No CRITICAL or HIGH issues
- ⚠️ Warning: MEDIUM issues only (can merge with caution)
- ❌ Block: CRITICAL or HIGH issues found

</details>
