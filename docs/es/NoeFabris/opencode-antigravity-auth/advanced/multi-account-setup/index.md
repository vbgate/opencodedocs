---
title: "Configuración Multi-Cuenta: Agrupación de Cuota y Balanceo de Carga | opencode-antigravity-auth"
sidebarTitle: "Prueba Multi-Cuenta"
subtitle: "Configuración Multi-Cuenta: Agrupación de Cuota y Balanceo de Carga"
description: "Aprenda a configurar múltiples cuentas de Google para lograr agrupación de cuota y balanceo de carga. Domine el sistema de doble cuota, estrategias de selección de cuentas y configuración de desplazamiento de PID para maximizar la utilización de la cuota de API."
tags:
  - "advanced"
  - "multi-account"
  - "load-balancing"
  - "quota-management"
prerequisite:
  - "start-quick-install"
  - "start-first-auth-login"
order: 4
---

# Configuración Multi-Cuenta: Agrupación de Cuota y Balanceo de Carga

## Qué Podrás Hacer Después de Este Tutorial

- Agregar múltiples cuentas de Google para aumentar el límite de cuota total
- Comprender el sistema de doble cuota y utilizar eficazmente los pools de cuota de Antigravity y Gemini CLI
- Seleccionar la estrategia de balanceo de carga adecuada según la cantidad de cuentas y escenarios de uso
- Solucionar problemas comunes en la configuración multi-cuenta

## Tu Situación Actual

Al usar una sola cuenta, puedes encontrar estos puntos de dolor:

- Encontrar frecuentemente errores 429 de límite de tasa, teniendo que esperar a que se recupere la cuota
- Demasiadas solicitudes concurrentes en escenarios de desarrollo/pruebas que una sola cuenta no puede manejar
- Después de agotar la cuota de modelos Gemini 3 Pro o Claude Opus, solo puedes esperar hasta el día siguiente
- Al ejecutar múltiples instancias de OpenCode o sub-agentes de oh-my-opencode en paralelo, la competencia entre cuentas es intensa

## Cuándo Usar Esta Técnica

La configuración multi-cuenta es adecuada para los siguientes escenarios:

| Escenario | Cuentas Recomendadas | Razón |
|---|---|---|
| Desarrollo personal | 2-3 | Cuentas de respaldo, evitar interrupciones |
| Colaboración en equipo | 3-5 | Distribuir solicitudes, reducir competencia |
| Llamadas API de alta frecuencia | 5+ | Balanceo de carga, maximizar throughput |
| Agentes paralelos | 3+ con desplazamiento PID | Cada Agente con cuenta independiente |

::: warning Verificación Prerrequisito
Antes de comenzar este tutorial, asegúrate de haber completado:
- ✅ Instalado el plugin opencode-antigravity-auth
- ✅ Agregado exitosamente la primera cuenta mediante autenticación OAuth
- ✅ Puedes enviar solicitudes usando el modelo Antigravity

[Tutorial de Instalación Rápida](../../start/quick-install/) | [Tutorial de Primer Inicio de Sesión](../../start/first-auth-login/)
:::

## Concepto Principal

Los mecanismos principales de la configuración multi-cuenta:

1. **Agrupación de Cuota**: Cada cuenta de Google tiene cuotas independientes, las cuotas de múltiples cuentas se superponen para formar un pool más grande
2. **Balanceo de Carga**: El plugin selecciona automáticamente la cuenta disponible, cambiando a la siguiente cuenta cuando se encuentra con el límite de tasa
3. **Sistema de Doble Cuota** (solo Gemini): Cada cuenta puede acceder a dos pools de cuota independientes: Antigravity y Gemini CLI
4. **Recuperación Inteligente**: Eliminación de duplicados de límite de tasa (ventana de 2 segundos) + retroceso exponencial, evitando reintentos inválidos

**Ejemplo de Cálculo de Cuota**:

Suponiendo que la cuota Claude de cada cuenta es de 1000 solicitudes/minuto:

| Número de Cuentas | Cuota Total Teórica | Cuota Real Disponible (considerando caché) |
|---|---|---|
| 1 | 1000/min | 1000/min |
| 3 | 3000/min | ~2500/min (estrategia sticky) |
| 5 | 5000/min | ~4000/min (round-robin) |

> 💡 **¿Por qué la estrategia sticky tiene menos cuota disponible?**
>
> La estrategia sticky mantendrá usando la misma cuenta hasta que se alcance el límite de tasa, haciendo que las cuotas de otras cuentas permanezcan inactivas. Pero la ventaja es que preserva el caché de prompts de Anthropic, mejorando la velocidad de respuesta.

## Sígueme

### Paso 1: Agregar una Segunda Cuenta

**Por qué**
Después de agregar una segunda cuenta, cuando la cuenta principal encuentra el límite de tasa, el plugin cambiará automáticamente a la cuenta de respaldo, evitando el fallo de la solicitud.

**Operación**

Ejecuta el comando de inicio de sesión OAuth:

```bash
opencode auth login
```

Si ya tienes una cuenta, verás este mensaje:

```
1 account(s) saved:
  1. user1@gmail.com

(a)dd new account(s) or (f)resh start? [a/f]:
```

Ingresa `a` y presiona Enter, el navegador abrirá automáticamente la página de autorización de Google.

**Lo que deberías ver**:

1. El navegador abre la página de autorización OAuth de Google
2. Selecciona o inicia sesión con tu segunda cuenta de Google
3. Después de aceptar la autorización, el terminal muestra:

```
Account added successfully!

2 account(s) saved:
  1. user1@gmail.com
  2. user2@gmail.com
```

::: tip
Si el navegador no se abre automáticamente, copia la URL de OAuth mostrada en el terminal y pégala manualmente en el navegador.
:::

### Paso 2: Verificar Estado de Multi-Cuenta

**Por qué**
Confirmar que las cuentas se han agregado correctamente y están disponibles.

**Operación**

Ver el archivo de almacenamiento de cuentas:

```bash
cat ~/.config/opencode/antigravity-accounts.json
```

**Lo que deberías ver**:

```json
{
  "version": 3,
  "accounts": [
    {
      "email": "user1@gmail.com",
      "refreshToken": "1//0abc...",
      "projectId": "project-id-123",
      "addedAt": 1737609600000,
      "lastUsed": 1737609600000
    },
    {
      "email": "user2@gmail.com",
      "refreshToken": "1//0xyz...",
      "addedAt": 1737609700000,
      "lastUsed": 1737609700000
    }
  ],
  "activeIndex": 0,
  "activeIndexByFamily": {
    "claude": 0,
    "gemini": 0
  }
}
```

::: warning Recordatorio de Seguridad
`antigravity-accounts.json` contiene tokens de actualización OAuth, equivalentes a archivos de contraseña. No los envíes a sistemas de control de versiones.
:::

### Paso 3: Probar Cambio de Cuenta

**Por qué**
Verificar si el balanceo de carga multi-cuenta funciona normalmente.

**Operación**

Enviar múltiples solicitudes concurrentes para activar el límite de tasa:

```bash
# macOS/Linux
for i in {1..10}; do
  opencode run "Test $i" --model=google/antigravity-claude-sonnet-4-5 &
done
wait

# Windows PowerShell
1..10 | ForEach-Object {
  Start-Process -FilePath "opencode" -ArgumentList "run","Test $_","--model=google/antigravity-claude-sonnet-4-5"
}
```

**Lo que deberías ver**:

1. Las primeras N solicitudes usan la cuenta 1 (user1@gmail.com)
2. Después de encontrar 429, cambia automáticamente a la cuenta 2 (user2@gmail.com)
3. Si las notificaciones están habilitadas, verás un mensaje toast "Switched to account 2"

::: info Notificación de Cambio de Cuenta
Si `quiet_mode: false` está habilitado (predeterminado), el plugin mostrará notificaciones de cambio de cuenta. El primer cambio mostrará la dirección de correo electrónico, los cambios posteriores solo mostrarán el índice de la cuenta.
:::

### Paso 4: Configurar Sistema de Doble Cuota (Solo Gemini)

**Por qué**
Después de habilitar el fallback de doble cuota, cuando se agota la cuota de Antigravity, el plugin intentará automáticamente la cuota de Gemini CLI sin necesidad de cambiar de cuenta.

**Operación**

Edita el archivo de configuración del plugin:

```bash
# macOS/Linux
nano ~/.config/opencode/antigravity.json

# Windows
notepad %APPDATA%\opencode\antigravity.json
```

Agrega la siguiente configuración:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "quota_fallback": true
}
```

Guarda el archivo y reinicia OpenCode.

**Lo que deberías ver**:

1. Cuando usas modelos Gemini, el plugin prioriza la cuota de Antigravity
2. Cuando Antigravity devuelve 429, cambia automáticamente a la cuota de Gemini CLI de la misma cuenta
3. Si ambas cuotas están limitadas, cambia a la siguiente cuenta

::: tip Doble Cuota vs Multi-Cuenta
- **Doble Cuota**: Dos pools de cuota independientes para la misma cuenta (Antigravity + Gemini CLI)
- **Multi-Cuenta**: Superposición de pools de cuota de múltiples cuentas
- Mejor práctica: Habilitar primero doble cuota, luego agregar multi-cuenta
:::

### Paso 5: Seleccionar Estrategia de Selección de Cuentas

**Por qué**
Diferentes cantidades de cuentas y escenarios de uso requieren diferentes estrategias para lograr un rendimiento óptimo.

**Operación**

Configura la estrategia en `antigravity.json`:

```json
{
  "account_selection_strategy": "hybrid"
}
```

Selecciona según tu número de cuentas:

| Número de Cuentas | Estrategia Recomendada | Valor de Configuración | Razón |
|---|---|---|---|
| 1 | sticky | `"sticky"` | Mantener caché de prompt |
| 2-5 | hybrid | `"hybrid"` | Balancear rendimiento y caché |
| 5+ | round-robin | `"round-robin"` | Maximizar rendimiento |

**Detalles de Estrategia**:

- **sticky** (predeterminado para una sola cuenta): Mantiene el uso de la misma cuenta hasta el límite de tasa, adecuado para sesiones de desarrollo individuales
- **round-robin**: Rota cada solicitud a la siguiente cuenta, maximizando el rendimiento pero sacrificando el caché
- **hybrid** (predeterminado para múltiples cuentas): Decisión integrada basada en puntaje de salud + Token bucket + LRU

**Lo que deberías ver**:

1. Cuando usas la estrategia `hybrid`, el plugin selecciona automáticamente la cuenta óptima actual
2. Cuando usas la estrategia `round-robin`, las solicitudes se distribuyen uniformemente a todas las cuentas
3. Cuando usas la estrategia `sticky`, la misma sesión siempre usa la misma cuenta

### Paso 6: Habilitar Desplazamiento de PID (Escenarios de Agentes Paralelos)

**Por qué**
Al ejecutar múltiples instancias de OpenCode o agentes paralelos de oh-my-opencode, diferentes procesos pueden seleccionar la misma cuenta, causando competencia.

**Operación**

Agrega a `antigravity.json`:

```json
{
  "pid_offset_enabled": true
}
```

Guarda y reinicia OpenCode.

**Lo que deberías ver**:

1. Diferentes procesos (diferentes PID) comienzan desde diferentes índices de cuenta
2. La competencia de cuentas entre agentes paralelos se reduce
3. El rendimiento general mejora

::: tip Cómo Funciona el Desplazamiento de PID
El desplazamiento de PID mapea el ID de proceso al desplazamiento de cuenta, por ejemplo:
- PID 100 → desplazamiento 0 → comenzar desde cuenta 0
- PID 101 → desplazamiento 1 → comenzar desde cuenta 1
- PID 102 → desplazamiento 2 → comenzar desde cuenta 2
:::

## Punto de Verificación ✅

Después de completar los pasos anteriores, deberías poder:

- [ ] Agregar múltiples cuentas de Google mediante `opencode auth login`
- [ ] Ver registros de múltiples cuentas en `antigravity-accounts.json`
- [ ] Cuando encuentras límite de tasa, el plugin cambia automáticamente a la siguiente cuenta
- [ ] Los modelos Gemini tienen habilitado el fallback de doble cuota
- [ ] Seleccionar la estrategia de selección de cuentas adecuada según la cantidad de cuentas
- [ ] Habilitar desplazamiento de PID en escenarios de agentes paralelos

## Advertencias de Problemas Comunes

### Todas las Cuentas Limitadas por Tasa

**Síntoma**: Todas las cuentas muestran error 429, no se pueden continuar las solicitudes

**Causa**: Cuota agotada o demasiadas solicitudes concurrentes

**Soluciones**:

1. Esperar a que el límite de tasa se restablezca automáticamente (generalmente 1-5 minutos)
2. Si el problema persiste, agregar más cuentas
3. Verificar `max_rate_limit_wait_seconds` en la configuración, establecer un límite de espera razonable

### Cambio de Cuenta Demasiado Frecuente

**Síntoma**: Cada solicitud cambia de cuenta, sin usar la misma cuenta

**Causa**: Selección de estrategia inadecuada o puntaje de salud anormal

**Soluciones**:

1. Cambiar la estrategia a `sticky`
2. Verificar la configuración de `health_score`, ajustar `min_usable` y `rate_limit_penalty`
3. Confirmar que no haya errores 429 frecuentes que marquen cuentas como no saludables

### Error de Permiso de Gemini CLI (403)

**Síntoma**: Al usar el modelo Gemini CLI, devuelve error `Permission denied`

**Causa**: La cuenta carece de Project ID válido

**Soluciones**:

1. Agregar manualmente `projectId` para cada cuenta:

```json
{
  "accounts": [
    {
      "email": "your@email.com",
      "refreshToken": "...",
      "projectId": "your-project-id"
    }
  ]
}
```

2. Asegurar de habilitar Gemini for Google Cloud API en [Google Cloud Console](https://console.cloud.google.com/)

### Token Inválido (invalid_grant)

**Síntoma**: La cuenta se elimina automáticamente, muestra error `invalid_grant`

**Causa**: Cambio de contraseña de cuenta de Google, evento de seguridad o expiración del token

**Soluciones**:

1. Eliminar la cuenta inválida y reautenticar:

```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

2. Si ocurre frecuentemente, considerar usar una cuenta de Google más estable

## Resumen de Esta Lección

- La configuración multi-cuenta puede aumentar el límite de cuota total y la estabilidad del sistema
- Agregar cuentas es muy simple, simplemente ejecuta `opencode auth login` repetidamente
- El sistema de doble cuota duplica la cuota disponible para cada cuenta Gemini
- La estrategia de selección de cuentas debe ajustarse según la cantidad de cuentas y escenarios de uso
- El desplazamiento de PID es crucial para escenarios de agentes paralelos

## Avance de la Próxima Lección

> En la próxima lección aprenderemos **[Estrategias de Selección de Cuentas](../account-selection-strategies/)**.
>
> Aprenderás:
> - Los principios de funcionamiento detallados de las tres estrategias: sticky, round-robin, hybrid
> - Cómo seleccionar la estrategia óptima según el escenario
> - Métodos de ajuste de puntaje de salud y Token bucket

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Función | Ruta del Archivo | Número de Línea |
|---|---|---|
| Clase AccountManager | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L174-L250) | 174-250 |
| Estrategia de balanceo de carga | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts) | Completo |
| Esquema de configuración | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | Completo |
| Almacenamiento de cuentas | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts) | Completo |

**Constantes Clave**:

| Nombre de Constante | Valor | Descripción |
|---|---|---|
| `QUOTA_EXHAUSTED_BACKOFFS` | `[60000, 300000, 1800000, 7200000]` | Tiempos de retroceso por agotamiento de cuota (1min→5min→30min→2h) |
| `RATE_LIMIT_EXCEEDED_BACKOFF` | `30000` | Tiempo de retroceso por límite de tasa (30s) |
| `MIN_BACKOFF_MS` | `2000` | Tiempo de retroceso mínimo (2s) |

**Funciones Clave**:

- `calculateBackoffMs(reason, consecutiveFailures, retryAfterMs)`: Calcula el retraso de retroceso
- `getQuotaKey(family, headerStyle, model)`: Genera clave de cuota (soporta limitación por nivel de modelo)
- `isRateLimitedForQuotaKey(account, key)`: Verifica si la clave de cuota específica está limitada por tasa
- `selectHybridAccount(accounts, family)`: Lógica de selección de cuentas para estrategia hybrid

**Elementos de Configuración** (de schema.ts):

| Elemento de Configuración | Tipo | Valor Predeterminado | Descripción |
|---|---|---|---|
| `account_selection_strategy` | enum | `"hybrid"` | Estrategia de selección de cuentas |
| `quota_fallback` | boolean | `false` | Habilitar fallback de doble cuota de Gemini |
| `pid_offset_enabled` | boolean | `false` | Habilitar desplazamiento de PID |
| `switch_on_first_rate_limit` | boolean | `true` | Cambiar inmediatamente al primer límite de tasa |

</details>
