---
title: "Estrategias de Selección de Cuentas: Configuración de Rotación Multi-Cuenta | Antigravity Auth"
sidebarTitle: "Elige la Estrategia Correcta para No Desperdiciar Cuota"
subtitle: "Estrategias de Selección de Cuentas: Mejores Prácticas para sticky, round-robin y hybrid"
description: "Aprende las tres estrategias de selección de cuentas: sticky, round-robin y hybrid. Elige la mejor configuración según la cantidad de cuentas, optimiza la utilización de cuotas y la distribución de solicitudes, evita ser limitado por velocidad."
tags:
  - "Multi-Cuenta"
  - "Balanceo de Carga"
  - "Configuración"
  - "Avanzado"
prerequisite:
  - "advanced-multi-account-setup"
order: 1
---

# Estrategias de Selección de Cuentas: Mejores Prácticas para sticky, round-robin y hybrid

## Lo Que Aprenderás Después de Este Tutorial

Elige y configura la estrategia de selección de cuentas adecuada según tu cantidad de cuentas de Google y escenario de uso:
- 1 cuenta → Usa estrategia `sticky` para preservar el caché de prompts
- 2-3 cuentas → Usa estrategia `hybrid` para distribución inteligente de solicitudes
- 4+ cuentas → Usa estrategia `round-robin` para maximizar el throughput

Evita la situación incómoda de "todas las cuentas están limitadas por velocidad, pero la cuota real no se ha agotado".

## Tu Situación Actual

Has configurado múltiples cuentas de Google, pero:
- No estás seguro de qué estrategia usar para maximizar la utilización de cuotas
- Frecuentemente encuentras que todas las cuentas están limitadas por velocidad, pero la cuota de alguna cuenta aún no se ha agotado
- En escenarios de agentes paralelos, múltiples procesos secundarios siempre usan la misma cuenta, causando limitación por velocidad

## Conceptos Principales

### Qué es la Estrategia de Selección de Cuentas

El plugin Antigravity Auth soporta tres estrategias de selección de cuentas, que determinan cómo distribuir las solicitudes de modelo entre múltiples cuentas de Google:

| Estrategia | Comportamiento | Escenario Aplicable |
| --- | --- | --- |
| `sticky` | A menos que la cuenta actual esté limitada por velocidad, sigue usando la misma cuenta | Cuenta única, necesita caché de prompts |
| `round-robin` | Cada solicitud rota a la siguiente cuenta disponible | Múltiples cuentas, maximizar throughput |
| `hybrid` (por defecto) | Selección inteligente combinando puntaje de salud + Token bucket + LRU | 2-3 cuentas, balance entre rendimiento y estabilidad |

::: info ¿Por qué se necesita una estrategia?
Google tiene límites de velocidad para cada cuenta. Si solo tienes una cuenta, las solicitudes frecuentes fácilmente serán limitadas por velocidad. Las cuentas múltiples pueden distribuir las solicitudes mediante rotación o selección inteligente, evitando que una sola cuenta consuma excesivamente la cuota.
:::

### Cómo Funcionan las Tres Estrategias

#### 1. Estrategia Sticky (Pegajosa)

**Lógica Central**: Mantener la cuenta actual hasta que sea limitada por velocidad antes de cambiar.

**Ventajas**:
- Preserva el caché de prompts, respuestas más rápidas con el mismo contexto
- El patrón de uso de cuentas es estable, menos propenso a activar controles de riesgo

**Desventajas**:
- La utilización de cuotas múltiples no es equilibrada
- No se pueden usar otras cuentas hasta que se recupere del límite de velocidad

**Escenarios Aplicables**:
- Solo tienes una cuenta
- Valoras el caché de prompts (como conversaciones prolongadas)

#### 2. Estrategia Round-Robin (Rotación)

**Lógica Central**: Cada solicitud rota a la siguiente cuenta disponible, usándolas en ciclo.

**Ventajas**:
- La utilización de cuotas es más equilibrada
- Maximiza el throughput concurrente
- Adecuado para escenarios de alta concurrencia

**Desventajas**:
- No considera el estado de salud de las cuentas, puede seleccionar cuentas que acaban de recuperarse del límite
- No puede aprovechar el caché de prompts

**Escenarios Aplicables**:
- 4 cuentas o más
- Tareas por lotes que requieren máximo throughput
- Escenarios de agentes paralelos (con `pid_offset_enabled`)

#### 3. Estrategia Hybrid (Híbrida, por defecto)

**Lógica Central**: Considera tres factores para seleccionar la cuenta óptima:

**Fórmula de Puntuación**:
```
Puntaje Total = Puntaje de Salud × 2 + Puntaje de Token × 5 + Puntaje de Frescura × 0.1
```

- **Puntaje de Salud** (0-200): Basado en el historial de éxito/fracaso de la cuenta
  - Solicitud exitosa: +1 punto
  - Límite de velocidad: -10 puntos
  - Otros fallos (autenticación, red): -20 puntos
  - Valor inicial: 70 puntos, mínimo 0, máximo 100 puntos
  - Recuperación de 2 puntos por hora (incluso sin uso)

- **Puntaje de Token** (0-500): Basado en el algoritmo Token bucket
  - Máximo de 50 tokens por cuenta, inicial 50 tokens
  - Regeneración de 6 tokens por minuto
  - Consumo de 1 token por solicitud
  - Puntaje de Token = (token actual / 50) × 100 × 5

- **Puntaje de Frescura** (0-360): Basado en el tiempo desde el último uso
  - Mientras más tiempo desde el último uso, mayor el puntaje
  - Máximo alcanzado después de 3600 segundos (1 hora)

**Ventajas**:
- Evita inteligentemente cuentas con baja salud
- El Token bucket evita límites de velocidad causados por solicitudes densas
- LRU (prioriza el menos usado recientemente) permite que las cuentas tengan tiempo de descanso suficiente
- Considera tanto el rendimiento como la estabilidad

**Desventajas**:
- El algoritmo es más complejo, menos intuitivo que round-robin
- No es obvio con 2 cuentas

**Escenarios Aplicables**:
- 2-3 cuentas (estrategia por defecto)
- Necesitas equilibrar la utilización de cuotas y estabilidad

### Tabla Rápida de Selección de Estrategias

Según las recomendaciones de README y CONFIGURATION.md:

| Tu Configuración | Estrategia Recomendada | Razón |
| --- | --- | --- |
| **1 cuenta** | `sticky` | No se necesita rotación, preserva el caché de prompts |
| **2-3 cuentas** | `hybrid` (por defecto) | Rotación inteligente, evita límites de velocidad excesivos |
| **4+ cuentas** | `round-robin` | Maximiza el throughput, la utilización de cuotas es más equilibrada |
| **Agentes paralelos** | `round-robin` + `pid_offset_enabled: true` | Diferentes procesos usan diferentes cuentas |

## 🎒 Preparativos Antes de Comenzar

::: warning Verificación Prerequisito
Asegúrate de haber completado:
- [x] Configuración multi-cuenta (al menos 2 cuentas de Google)
- [x] Entendimiento del [Sistema de Cuotas Dual](/es/NoeFabris/opencode-antigravity-auth/platforms/dual-quota-system/)
:::

## Sígueme Paso a Paso

### Paso 1: Verificar la Configuración Actual

**Por qué**
Primero entiende el estado actual de la configuración para evitar modificaciones repetidas.

**Operación**

Verifica tu archivo de configuración del plugin:

```bash
cat ~/.config/opencode/antigravity.json
```

**Deberías ver**:
```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
```

Si el archivo no existe, el plugin usa la configuración por defecto (`account_selection_strategy` = `"hybrid"`).

### Paso 2: Configurar la Estrategia Según la Cantidad de Cuentas

**Por qué**
Diferentes cantidades de cuentas se adaptan a diferentes estrategias, elegir la estrategia incorrecta puede causar desperdicio de cuotas o límites de velocidad frecuentes.

::: code-group

```bash [1 cuenta - Estrategia Sticky]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky"
}
EOF
```

```bash [2-3 cuentas - Estrategia Hybrid (por defecto)]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid"
}
EOF
```

```bash [4+ cuentas - Estrategia Round-Robin]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin"
}
EOF
```

:::

**Deberías ver**: El archivo de configuración se ha actualizado con la estrategia correspondiente.

### Paso 3: Habilitar Desplazamiento PID (Escenarios de Agentes Paralelos)

**Por qué**
Si usas plugins como oh-my-opencode para generar agentes paralelos, múltiples subprocesos pueden iniciar solicitudes simultáneamente. Por defecto, comenzarán seleccionando desde la misma cuenta inicial, causando competencia entre cuentas y límites de velocidad.

**Operación**

Modifica la configuración para agregar desplazamiento PID:

```bash
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": true
}
EOF
```

**Deberías ver**: `pid_offset_enabled` establecido en `true`.

**Cómo funciona**:
- Cada proceso calcula un desplazamiento basado en su PID (ID de proceso)
- Desplazamiento = `PID % número de cuentas`
- Diferentes procesos usarán prioritariamente diferentes cuentas iniciales
- Ejemplo: 3 cuentas, procesos con PID 100, 101, 102 usarán cuentas 1, 2, 0 respectivamente

### Paso 4: Verificar que la Estrategia Esté Activa

**Por qué**
Confirma que la configuración es correcta y la estrategia funciona según lo esperado.

**Operación**

Inicia múltiples solicitudes concurrentes y observa el cambio de cuentas:

```bash
# Habilitar logs de depuración
export OPENCODE_ANTIGRAVITY_DEBUG=1

# Iniciar 5 solicitudes
for i in {1..5}; do
  opencode run "Test $i" --model=google/antigravity-gemini-3-pro &
done
wait
```

**Deberías ver**:
- Diferentes solicitudes en los logs usan diferentes cuentas
- El evento `account-switch` registra el cambio de cuenta

Ejemplo de log (estrategia round-robin):
```
[DEBUG] Selected account: user1@gmail.com (index: 0) - reason: rotation
[DEBUG] Selected account: user2@gmail.com (index: 1) - reason: rotation
[DEBUG] Selected account: user3@gmail.com (index: 2) - reason: rotation
[DEBUG] Selected account: user1@gmail.com (index: 0) - reason: rotation
[DEBUG] Selected account: user2@gmail.com (index: 1) - reason: rotation
```

### Paso 5: Monitorear el Estado de Salud de las Cuentas (Estrategia Hybrid)

**Por qué**
La estrategia Hybrid selecciona cuentas basándose en puntajes de salud, entender el estado de salud ayuda a determinar si la configuración es razonable.

**Operación**

Verifica los puntajes de salud en los logs de depuración:

```bash
export OPENCODE_ANTIGRAVITY_DEBUG=2 opencode run "Hello" --model=google/antigravity-gemini-3-pro
```

**Deberías ver**:
```
[VERBOSE] Health scores: {
  "0": { "score": 85, "consecutiveFailures": 0 },
  "1": { "score": 60, "consecutiveFailures": 2 },
  "2": { "score": 70, "consecutiveFailures": 0 }
}
[DEBUG] Selected account: user1@gmail.com (index: 0) - hybrid score: 270.2
```

**Interpretación**:
- Cuenta 0: Puntaje de salud 85 (excelente)
- Cuenta 1: Puntaje de salud 60 (usable, pero con 2 fallos consecutivos)
- Cuenta 2: Puntaje de salud 70 (bueno)
- Selección final: Cuenta 0, puntaje compuesto 270.2

## Punto de Control ✅

::: tip ¿Cómo verificar que la configuración está activa?
1. Verifica el archivo de configuración para confirmar el valor de `account_selection_strategy`
2. Inicia múltiples solicitudes y observa el comportamiento de cambio de cuentas en los logs
3. Estrategia Hybrid: Las cuentas con puntajes de salud bajos deberían ser seleccionadas con menor frecuencia
4. Estrategia Round-robin: Las cuentas deberían usarse en ciclo, sin preferencias obvias
:::

## Advertencias de Errores Comunes

### ❌ Cantidad de Cuentas No Coincide con la Estrategia

**Comportamiento Incorrecto**:
- Solo 2 cuentas pero usa round-robin, causando cambios frecuentes
- 5 cuentas pero usa sticky, la utilización de cuotas no es equilibrada

**Práctica Correcta**: Selecciona la estrategia según la tabla de referencia rápida.

### ❌ Agentes Paralelos Sin Desplazamiento PID Habilitado

**Comportamiento Incorrecto**:
- Múltiples agentes paralelos usan la misma cuenta simultáneamente
- Causa que la cuenta sea limitada por velocidad rápidamente

**Práctica Correcta**: Establece `pid_offset_enabled: true`.

### ❌ Ignorar el Puntaje de Salud (Estrategia Hybrid)

**Comportamiento Incorrecto**:
- Una cuenta es frecuentemente limitada por velocidad, pero aún se usa con alta frecuencia
- No aprovechar el puntaje de salud para evitar cuentas problemáticas

**Práctica Correcta**: Revisa regularmente los puntajes de salud en los logs de depuración, si hay anomalías (como una cuenta con fallos consecutivos > 5), considera eliminar esa cuenta o cambiar de estrategia.

### ❌ Mezclar Sistemas de Cuotas Duales y Estrategias de Cuota Única

**Comportamiento Incorrecto**:
- El modelo Gemini usa el sufijo `:antigravity` para forzar el uso del pool de cuotas Antigravity
- Al mismo tiempo se configura `quota_fallback: false`
- Cuando un pool de cuotas se agota, no se puede hacer fallback al otro pool

**Práctica Correcta**: Entiende el [Sistema de Cuotas Dual](/es/NoeFabris/opencode-antigravity-auth/platforms/dual-quota-system/) y configura `quota_fallback` según tus necesidades.

## Resumen de Esta Lección

| Estrategia | Característica Principal | Escenario Aplicable |
| --- | --- | --- |
| `sticky` | Mantener cuenta hasta el límite de velocidad | 1 cuenta, necesita caché de prompts |
| `round-robin` | Rotación cíclica de cuentas | 4+ cuentas, maximizar throughput |
| `hybrid` | Selección inteligente Salud + Token + LRU | 2-3 cuentas, balance entre rendimiento y estabilidad |

**Configuraciones Clave**:
- `account_selection_strategy`: Establecer estrategia (`sticky` / `round-robin` / `hybrid`)
- `pid_offset_enabled`: Habilitar en escenarios de agentes paralelos (`true`)
- `quota_fallback`: Fallback de pool dual de cuotas Gemini (`true` / `false`)

**Métodos de Verificación**:
- Habilitar logs de depuración: `OPENCODE_ANTIGRAVITY_DEBUG=1`
- Ver logs de cambio de cuentas y puntajes de salud
- Observar los índices de cuentas usados por diferentes solicitudes

## Vista Previa de la Siguiente Lección

> En la próxima lección aprenderemos sobre **[Manejo de Límites de Velocidad](/es/NoeFabris/opencode-antigravity-auth/advanced/rate-limit-handling/)**.
>
> Aprenderás:
> - Cómo entender diferentes tipos de errores 429 (cuota agotada, límite de velocidad, capacidad agotada)
> - Cómo funcionan los reintentos automáticos y algoritmos de backoff
> - Cuándo cambiar de cuenta, cuándo esperar el reinicio

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Función | Ruta del Archivo | Número de Línea |
| --- | --- | --- |
| Entrada de Estrategia de Selección de Cuentas | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L340-L412) | 340-412 |
| Implementación de Estrategia Sticky | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L395-L411) | 395-411 |
| Implementación de Estrategia Hybrid | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L358-L383) | 358-383 |
| Sistema de Puntaje de Salud | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L14-L163) | 14-163 |
| Sistema de Token Bucket | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L290-L402) | 290-402 |
| Algoritmo de Selección LRU | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L215-L288) | 215-288 |
| Lógica de Desplazamiento PID | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L387-L393) | 387-393 |
| Esquema de Configuración | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | ver archivo |

**Constantes Clave**:
- `DEFAULT_HEALTH_SCORE_CONFIG.initial = 70`: Puntaje de salud inicial para nuevas cuentas
- `DEFAULT_HEALTH_SCORE_CONFIG.minUsable = 50`: Puntaje de salud mínimo usable para cuentas
- `DEFAULT_TOKEN_BUCKET_CONFIG.maxTokens = 50`: Número máximo de tokens por cuenta
- `DEFAULT_TOKEN_BUCKET_CONFIG.regenerationRatePerMinute = 6`: Número de tokens regenerados por minuto

**Funciones Clave**:
- `getCurrentOrNextForFamily()`: Selecciona cuentas según la estrategia
- `selectHybridAccount()`: Algoritmo de selección por puntaje de estrategia Hybrid
- `getScore()`: Obtiene el puntaje de salud de la cuenta (incluye recuperación por tiempo)
- `hasTokens()` / `consume()`: Verificación y consumo del Token bucket
- `sortByLruWithHealth()`: Ordenación LRU + puntaje de salud

</details>
