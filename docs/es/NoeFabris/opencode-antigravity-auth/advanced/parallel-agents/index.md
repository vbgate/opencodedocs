---
title: "Desplazamiento PID: Optimización de Asignación de Cuentas para Agentes Paralelos | Antigravity Auth"
sidebarTitle: "Múltiples Agentes Sin Competencia"
subtitle: "Optimización de Agentes Paralelos: Desplazamiento PID y Asignación de Cuentas"
description: "Aprende cómo el desplazamiento PID optimiza la asignación de cuentas en agentes paralelos de oh-my-opencode. Cubre métodos de configuración, combinación de estrategias, verificación de efectos y solución de problemas."
tags:
  - "advanced"
  - "parallel-agents"
  - "pid-offset"
  - "oh-my-opencode"
  - "load-balancing"
prerequisite:
  - "start-quick-install"
  - "start-first-auth-login"
  - "advanced-multi-account-setup"
order: 5
---

# Optimización de Agentes Paralelos: Desplazamiento PID y Asignación de Cuentas

**El desplazamiento PID** es un mecanismo de optimización de asignación de cuentas basado en el ID de proceso. A través del cálculo `process.pid % accounts.length`, permite que múltiples procesos de OpenCode o agentes paralelos de oh-my-opencode prioricen diferentes cuentas de Google. Cuando múltiples procesos se ejecutan simultáneamente, cada proceso selecciona automáticamente una cuenta inicial diferente según el resto de su PID, evitando efectivamente que múltiples procesos compitan por la misma cuenta y causen errores 429 de límite de velocidad. Esto mejora significativamente la tasa de éxito de solicitudes y la utilización de cuotas en escenarios paralelos, siendo especialmente adecuado para desarrolladores que necesitan ejecutar múltiples Agentes o tareas paralelas simultáneamente.

## Lo Que Aprenderás Después de Este Tutorial

- Comprender el problema de conflicto de cuentas en escenarios de agentes paralelos
- Habilitar la función de desplazamiento PID para que diferentes procesos prioricen diferentes cuentas
- Combinar con la estrategia round-robin para maximizar la utilización de múltiples cuentas
- Solucionar problemas de límite de velocidad y selección de cuentas en agentes paralelos

## Tu Situación Actual

Al usar oh-my-opencode o ejecutar múltiples instancias de OpenCode simultáneamente, puedes encontrar:

- Múltiples sub-agentes usando la misma cuenta simultáneamente, encontrando frecuentemente límites de velocidad 429
- Incluso con múltiples cuentas configuradas, las solicitudes concurrentes siguen compitiendo por la misma cuenta
- Diferentes procesos comienzan desde la primera cuenta al iniciar, causando asignación desigual de cuentas
- Después de fallos de solicitud, se necesita esperar mucho tiempo antes de reintentar

## Cuándo Usar Esta Técnica

La función de desplazamiento PID es adecuada para los siguientes escenarios:

| Escenario | ¿Necesita Desplazamiento PID? | Razón |
| --- | --- | --- |
| Instancia única de OpenCode | ❌ No necesario | Proceso único, sin conflicto de cuentas |
| Cambio manual entre múltiples cuentas | ❌ No necesario | No concurrente, estrategia sticky suficiente |
| Múltiples Agentes de oh-my-opencode | ✅ Recomendado | Múltiples procesos concurrentes, necesita dispersar cuentas |
| Ejecutar múltiples OpenCode simultáneamente | ✅ Recomendado | Diferentes procesos con PID independiente, dispersión automática |
| Tareas paralelas CI/CD | ✅ Recomendado | Cada tarea con proceso independiente, evita competencia |

::: warning Verificación Prerrequisito
Antes de comenzar este tutorial, asegúrate de haber completado:
- ✅ Configurado al menos 2 cuentas de Google
- ✅ Comprendido cómo funcionan las estrategias de selección de cuentas
- ✅ Usando oh-my-opencode o necesitas ejecutar múltiples instancias de OpenCode en paralelo

[Tutorial de Configuración Multi-Cuenta](../multi-account-setup/) | [Tutorial de Estrategias de Selección de Cuentas](../account-selection-strategies/)
:::

## Concepto Principal

### ¿Qué es el Desplazamiento PID?

**PID (Process ID)** es el identificador único que el sistema operativo asigna a cada proceso. Cuando múltiples procesos de OpenCode se ejecutan simultáneamente, cada proceso tiene un PID diferente.

**El desplazamiento PID** es una optimización de asignación de cuentas basada en el ID de proceso:

```
Supongamos que hay 3 cuentas (índice: 0, 1, 2):

Proceso A (PID=123):
  123 % 3 = 0 → prioriza usar cuenta 0

Proceso B (PID=456):
  456 % 3 = 1 → prioriza usar cuenta 1

Proceso C (PID=789):
  789 % 3 = 2 → prioriza usar cuenta 2
```

Cada proceso prioriza una cuenta diferente según el resto de su PID, evitando competir por la misma cuenta desde el inicio.

### ¿Por Qué Se Necesita el Desplazamiento PID?

Sin desplazamiento PID, todos los procesos comienzan desde la cuenta 0 al iniciar:

```
Línea de tiempo:
T1: Proceso A inicia → usa cuenta 0
T2: Proceso B inicia → usa cuenta 0  ← ¡Conflicto!
T3: Proceso C inicia → usa cuenta 0  ← ¡Conflicto!
```

Con desplazamiento PID habilitado:

```
Línea de tiempo:
T1: Proceso A inicia → Desplazamiento PID → usa cuenta 0
T2: Proceso B inicia → Desplazamiento PID → usa cuenta 1  ← ¡Dispersión!
T3: Proceso C inicia → Desplazamiento PID → usa cuenta 2  ← ¡Dispersión!
```

### Combinación con Estrategias de Selección de Cuentas

El desplazamiento PID solo tiene efecto en la fase de fallback de la estrategia sticky (las estrategias round-robin y hybrid tienen su propia lógica de asignación):

| Estrategia | ¿Desplazamiento PID Efectivo? | Escenario Recomendado |
| --- | --- | --- |
| `sticky` | ✅ Efectivo | Proceso único + prioridad de caché de prompt |
| `round-robin` | ❌ No efectivo | Múltiples procesos/agentes paralelos, máximo throughput |
| `hybrid` | ❌ No efectivo | Asignación inteligente, prioridad de puntaje de salud |

**¿Por Qué round-robin No Necesita Desplazamiento PID?**

La estrategia round-robin ya rota cuentas por sí misma:

```typescript
// Cada solicitud cambia a la siguiente cuenta
this.cursor++;
const account = available[this.cursor % available.length];
```

Múltiples procesos se dispersarán naturalmente entre diferentes cuentas, sin necesidad de desplazamiento PID adicional.

::: tip Mejor Práctica
Para escenarios de agentes paralelos, configuración recomendada:

```json
{
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": false  // round-robin no lo necesita
}
```

Si debes usar estrategia sticky o hybrid, entonces habilita el desplazamiento PID.
:::

## Sígueme Paso a Paso

### Paso 1: Confirmar Configuración Multi-Cuenta

**Por qué**
El desplazamiento PID necesita al menos 2 cuentas para funcionar. Si solo hay 1 cuenta, sin importar el resto del PID, solo se puede usar esa cuenta.

**Operación**

Verifica la cantidad actual de cuentas:

```bash
opencode auth list
```

Deberías ver al menos 2 cuentas:

```
2 account(s) saved:
  1. user1@gmail.com
  2. user2@gmail.com
```

Si solo hay 1 cuenta, agrega más cuentas primero:

```bash
opencode auth login
```

Sigue las instrucciones para seleccionar `(a)dd new account(s)`.

**Lo que deberías ver**: La lista de cuentas muestra 2 o más cuentas.

### Paso 2: Configurar Desplazamiento PID

**Por qué**
Habilitar la función de desplazamiento PID a través del archivo de configuración permite que el plugin considere el ID de proceso al seleccionar cuentas.

**Operación**

Abre el archivo de configuración de OpenCode:

- **macOS/Linux**: `~/.config/opencode/antigravity.json`
- **Windows**: `%APPDATA%\opencode\antigravity.json`

Agrega o modifica la siguiente configuración:

```json
{
  "pid_offset_enabled": true
}
```

Ejemplo de configuración completa (combinado con estrategia sticky):

```json
{
  "pid_offset_enabled": true,
  "account_selection_strategy": "sticky"
}
```

**Método de variable de entorno** (opcional):

```bash
export OPENCODE_ANTIGRAVITY_PID_OFFSET_ENABLED=1
```

**Lo que deberías ver**: En el archivo de configuración, `pid_offset_enabled` está establecido en `true`.

### Paso 3: Verificar Efecto del Desplazamiento PID

**Por qué**
Verificar si el desplazamiento PID está funcionando ejecutando múltiples procesos realmente, y si diferentes procesos priorizan diferentes cuentas.

**Operación**

Abre dos ventanas de terminal y ejecuta OpenCode por separado:

**Terminal 1**:
```bash
opencode chat
# Envía una solicitud, registra la cuenta usada (verifica logs o toast)
```

**Terminal 2**:
```bash
opencode chat
# Envía una solicitud, registra la cuenta usada
```

Observa el comportamiento de selección de cuentas:

- ✅ **Esperado**: Las dos terminales priorizan diferentes cuentas
- ❌ **Problema**: Ambas terminales usan la misma cuenta

Si el problema persiste, verifica:

1. Si la configuración se cargó correctamente
2. Si la estrategia de selección de cuentas es `sticky` (round-robin no necesita desplazamiento PID)
3. Si solo hay 1 cuenta

Habilita logs de depuración para ver el proceso detallado de selección de cuentas:

```bash
export OPENCODE_ANTIGRAVITY_DEBUG=1
opencode chat
```

Los logs mostrarán:

```
[accounts] Applying PID offset: 1 (process.pid % accounts.length)
[accounts] Starting account index for 'claude': 1
```

**Lo que deberías ver**: Diferentes terminales priorizan diferentes cuentas, o los logs muestran que el desplazamiento PID se ha aplicado.

### Paso 4: (Opcional) Combinar con Estrategia Round-Robin

**Por qué**
La estrategia round-robin ya rota cuentas por sí misma, no necesita desplazamiento PID. Pero para agentes paralelos de alta frecuencia, round-robin es una mejor opción.

**Operación**

Modifica el archivo de configuración:

```json
{
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": false
}
```

Inicia múltiples Agentes de oh-my-opencode, observa la distribución de solicitudes:

```
Agent 1 → cuenta 0 → cuenta 1 → cuenta 2 → cuenta 0 ...
Agent 2 → cuenta 1 → cuenta 2 → cuenta 0 → cuenta 1 ...
```

Cada Agent rota independientemente, utilizando completamente las cuotas de todas las cuentas.

**Lo que deberías ver**: Las solicitudes se distribuyen uniformemente entre todas las cuentas, cada Agent rota independientemente.

## Punto de Verificación ✅

Después de completar los pasos anteriores, deberías poder:

- [ ] Configurar exitosamente al menos 2 cuentas de Google
- [ ] Habilitar `pid_offset_enabled` en `antigravity.json`
- [ ] Al ejecutar múltiples instancias de OpenCode, diferentes procesos priorizan diferentes cuentas
- [ ] Comprender por qué round-robin no necesita desplazamiento PID
- [ ] Usar logs de depuración para ver el proceso de selección de cuentas

## Advertencias de Errores Comunes

### Problema 1: Sin Efecto Después de Habilitar

**Síntoma**: Configurado `pid_offset_enabled: true`, pero múltiples procesos siguen usando la misma cuenta.

**Causa**: Posiblemente la estrategia de selección de cuentas es `round-robin` o `hybrid`, estas dos estrategias no usan desplazamiento PID.

**Solución**: Cambia a estrategia `sticky`, o comprende que la estrategia actual no necesita desplazamiento PID.

```json
{
  "account_selection_strategy": "sticky",  // Cambiar a sticky
  "pid_offset_enabled": true
}
```

### Problema 2: Solo 1 Cuenta

**Síntoma**: Después de habilitar desplazamiento PID, todos los procesos siguen usando la cuenta 0.

**Causa**: El desplazamiento PID calcula mediante `process.pid % accounts.length`, con solo 1 cuenta, el resto siempre es 0.

**Solución**: Agrega más cuentas:

```bash
opencode auth login
# Selecciona (a)dd new account(s)
```

### Problema 3: Caché de Prompt Inválido

**Síntoma**: Después de habilitar desplazamiento PID, descubres que el caché de prompt de Anthropic ya no funciona.

**Causa**: El desplazamiento PID puede causar que diferentes procesos o sesiones usen diferentes cuentas, y el caché de prompt se comparte por cuenta. Después de cambiar de cuenta, se necesita reenviar los prompts.

**Solución**: Este es el comportamiento esperado. Si la prioridad del caché de prompt es mayor, deshabilita el desplazamiento PID y usa estrategia sticky:

```json
{
  "pid_offset_enabled": false,
  "account_selection_strategy": "sticky"
}
```

### Problema 4: Conflicto de Múltiples Agentes de oh-my-opencode

**Síntoma**: Incluso con múltiples cuentas configuradas, múltiples Agentes de oh-my-opencode encuentran frecuentemente errores 429.

**Causa**: oh-my-opencode puede iniciar Agentes secuencialmente, múltiples Agentes solicitan la misma cuenta simultáneamente en poco tiempo.

**Solución**:

1. Usa estrategia `round-robin` (recomendado):

```json
{
  "account_selection_strategy": "round-robin"
}
```

2. O aumenta la cantidad de cuentas, asegurando que cada Agent tenga una cuenta independiente:

```bash
# Si hay 3 Agents, se recomienda al menos 5 cuentas
opencode auth login
```

## Resumen de Esta Lección

La función de desplazamiento PID optimiza la asignación de cuentas en escenarios de múltiples procesos a través del ID de proceso (PID):

- **Principio**: Calcula el desplazamiento mediante `process.pid % accounts.length`
- **Función**: Permite que diferentes procesos prioricen diferentes cuentas, evitando conflictos
- **Limitación**: Solo efectivo bajo estrategia sticky, round-robin y hybrid no lo necesitan
- **Mejor Práctica**: Para escenarios de agentes paralelos, se recomienda estrategia round-robin, sin necesidad de desplazamiento PID

Después de configurar múltiples cuentas, selecciona la estrategia adecuada según tu escenario de uso:

| Escenario | Estrategia Recomendada | Desplazamiento PID |
| --- | --- | --- |
| Proceso único, prioridad de caché de prompt | sticky | No |
| Múltiples procesos/agentes paralelos | round-robin | No |
| Estrategia hybrid + inicio disperso | hybrid | Opcional |

## Vista Previa de la Próxima Lección

> En la próxima lección aprenderemos sobre **[Guía Completa de Opciones de Configuración](../configuration-guide/)**.
>
> Aprenderás:
> - Ubicación y prioridad del archivo de configuración
> - Opciones de configuración para comportamiento del modelo, rotación de cuentas y comportamiento de la aplicación
> - Esquemas de configuración recomendados para diferentes escenarios
> - Métodos de ajuste de configuración avanzada

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Función | Ruta del Archivo | Número de Línea |
| --- | --- | --- |
| Implementación de Desplazamiento PID | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L388-L393) | 388-393 |
| Definición de Schema de Configuración | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L244-L255) | 244-255 |
| Soporte de Variables de Entorno | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts#L163-L168) | 163-168 |
| Ubicación de Paso de Configuración | [`src/plugin.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin.ts#L902) | 902 |
| Documentación de Uso | [`docs/MULTI-ACCOUNT.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/MULTI-ACCOUNT.md#L111-L125) | 111-125 |
| Guía de Configuración | [`docs/CONFIGURATION.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/CONFIGURATION.md#L69) | 69 |

**Funciones Clave**:
- `getCurrentOrNextForFamily()`: Función principal de selección de cuentas, maneja internamente la lógica de desplazamiento PID
- `process.pid % this.accounts.length`: Fórmula central para calcular el desplazamiento

**Constantes Clave**:
- `sessionOffsetApplied[family]`: Marca de aplicación de desplazamiento para cada familia de modelos (se aplica solo una vez por sesión)

</details>
