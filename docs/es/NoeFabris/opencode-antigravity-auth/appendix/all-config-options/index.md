---
title: "Opciones de Configuración Completas: Más de 30 Parámetros Explicados | Antigravity Auth"
sidebarTitle: "Personalizar más de 30 parámetros"
subtitle: "Manual de referencia completo de las opciones de configuración de Antigravity Auth"
description: "Aprende las más de 30 opciones de configuración del plugin Antigravity Auth. Incluye configuraciones generales, recuperación de sesiones, estrategias de selección de cuentas, límites de velocidad, actualización de tokens y mejores prácticas."
tags:
  - "Referencia de configuración"
  - "Configuración avanzada"
  - "Manual completo"
  - "Antigravity"
  - "OpenCode"
prerequisite:
  - "quick-install"
order: 1
---

# Manual de referencia completo de las opciones de configuración de Antigravity Auth

## Lo que puedes hacer después de aprender

- Encontrar y modificar todas las opciones de configuración del plugin Antigravity Auth
- Comprender la función y los casos de uso de cada opción de configuración
- Seleccionar la mejor combinación de configuraciones según el escenario de uso
- Sobrescribir la configuración de archivos mediante variables de entorno

## Ideas centrales

El plugin Antigravity Auth controla casi todos los comportamientos mediante archivos de configuración: desde el nivel de registro hasta las estrategias de selección de cuentas, desde la recuperación de sesiones hasta el mecanismo de actualización de tokens.

::: info Ubicación del archivo de configuración (prioridad de alta a baja)
1. **Configuración del proyecto**: `.opencode/antigravity.json`
2. **Configuración del usuario**:
   - Linux/Mac: `~/.config/opencode/antigravity.json`
   - Windows: `%APPDATA%\opencode\antigravity.json`
:::

::: tip Prioridad de las variables de entorno
Todas las opciones de configuración pueden ser sobrescritas mediante variables de entorno, y la prioridad de las variables de entorno es **mayor** que la del archivo de configuración.
:::

## Resumen de configuración

| Categoría | Número de opciones | Escenarios principales |
| --- | --- | ---|
| Configuración general | 3 | Registro, modo de depuración |
| Bloque de pensamiento | 1 | Conservar proceso de pensamiento |
| Recuperación de sesión | 3 | Recuperación automática de errores |
| Caché de firma | 4 | Persistencia de firma de bloques de pensamiento |
| Reintento de respuesta vacía | 2 | Manejar respuestas vacías |
| Recuperación de ID de herramienta | 1 | Coincidencia de herramientas |
| Prevención de alucinación de herramienta | 1 | Prevenir errores de parámetros |
| Actualización de token | 3 | Mecanismo de actualización proactiva |
| Límite de velocidad | 5 | Rotación y espera de cuentas |
| Puntuación de salud | 7 | Puntuación de estrategia Hybrid |
| Cubo de tokens | 3 | Tokens de estrategia Hybrid |
| Actualización automática | 1 | Actualización automática del plugin |
| Búsqueda web | 2 | Búsqueda Gemini |

---

## Configuración general

### `quiet_mode`

**Tipo**: `boolean`  
**Valor predeterminado**: `false`  
**Variable de entorno**: `OPENCODE_ANTIGRAVITY_QUIET=1`

Suprime la mayoría de las notificaciones toast (límites de velocidad, cambios de cuenta, etc.). Las notificaciones de recuperación (recuperación de sesión exitosa) siempre se muestran.

**Escenarios de aplicación**:
- Escenarios de uso de alta frecuencia con múltiples cuentas, evitando interferencias de notificaciones frecuentes
- Uso en scripts automatizados o servicios en segundo plano

**Ejemplo**:
```json
{
  "quiet_mode": true
}
```

### `debug`

**Tipo**: `boolean`  
**Valor predeterminado**: `false`  
**Variable de entorno**: `OPENCODE_ANTIGRAVITY_DEBUG=1`

Habilita el registro de depuración en archivos. Los archivos de registro se almacenan de forma predeterminada en `~/.config/opencode/antigravity-logs/`.

**Escenarios de aplicación**:
- Habilitar para solucionar problemas
- Proporcionar registros detallados al enviar informes de errores

::: danger Los registros de depuración pueden contener información confidencial
Los archivos de registro contienen respuestas de API, índices de cuentas y otra información, desensibilice antes de enviar.
:::

### `log_dir`

**Tipo**: `string`  
**Valor predeterminado**: Directorio de configuración específico del SO + `/antigravity-logs`  
**Variable de entorno**: `OPENCODE_ANTIGRAVITY_LOG_DIR=/path/to/logs`

Directorio de almacenamiento personalizado para los registros de depuración.

**Escenarios de aplicación**:
- Necesidad de almacenar registros en ubicaciones específicas (como directorios compartidos en red)
- Scripts de rotación y archivado de registros

---

## Configuración de bloque de pensamiento

### `keep_thinking`

**Tipo**: `boolean`  
**Valor predeterminado**: `false`  
**Variable de entorno**: `OPENCODE_ANTIGRAVITY_KEEP_THINKING=1`

::: warning Función experimental
Conserva el bloque de pensamiento del modelo Claude (mediante caché de firma).

**Descripción del comportamiento**:
- `false` (predeterminado): Elimina el bloque de pensamiento, evita errores de firma, prioriza la confiabilidad
- `true`: Conserva el contexto completo (incluyendo bloque de pensamiento), pero puede encontrar errores de firma

**Escenarios de aplicación**:
- Necesidad de ver el proceso de razonamiento completo del modelo
- Uso frecuente de contenido de pensamiento en conversaciones

**Escenarios no recomendados**:
- Entornos de producción (prioriza la confiabilidad)
- Conversaciones de múltiples turnos (fácil de activar conflictos de firma)

::: tip Uso recomendado con `signature_cache`
Al habilitar `keep_thinking`, se recomienda configurar simultáneamente `signature_cache` para mejorar la tasa de aciertos de firma.
:::

---

## Recuperación de sesión

### `session_recovery`

**Tipo**: `boolean`  
**Valor predeterminado**: `true`

Recupera automáticamente la sesión desde errores de tipo `tool_result_missing`. Cuando está habilitado, muestra notificaciones toast al encontrar errores recuperables.

**Tipos de errores recuperados**:
- `tool_result_missing`: Falta resultado de herramienta (interrupción por ESC, tiempo de espera, bloqueo)
- `Expected thinking but found text`: Error de orden de bloques de pensamiento

**Escenarios de aplicación**:
- Todas las escenas que usan herramientas (se recomienda habilitar de forma predeterminada)
- Conversaciones largas o uso frecuente de herramientas

### `auto_resume`

**Tipo**: `boolean`  
**Valor predeterminado**: `false`

Envía automáticamente un mensaje "continue" para recuperar la sesión. Solo tiene efecto cuando `session_recovery` está habilitado.

**Descripción del comportamiento**:
- `false`: Solo muestra la notificación toast, el usuario debe enviar manualmente "continue"
- `true`: Envía automáticamente "continue" para continuar la sesión

**Escenarios de aplicación**:
- Escenarios de scripts automatizados o sin supervisión
- Deseo de un proceso de recuperación completamente automatizado

**Escenarios no recomendados**:
- Necesidad de confirmar manualmente el resultado de la recuperación
- Después de una interrupción de ejecución de herramienta, se debe verificar el estado antes de continuar

### `resume_text`

**Tipo**: `string`  
**Valor predeterminado**: `"continue"`

Texto personalizado enviado al recuperar automáticamente. Solo se usa cuando `auto_resume` está habilitado.

**Escenarios de aplicación**:
- Entornos multilingües (como cambiar a "continue" o "please continue")
- Escenarios que requieren mensajes de indicación adicionales

**Ejemplo**:
```json
{
  "auto_resume": true,
  "resume_text": "Por favor continúa con la tarea anterior"
}
```

---

## Caché de firma

> Solo tiene efecto cuando `keep_thinking` está habilitado

### `signature_cache.enabled`

**Tipo**: `boolean`  
**Valor predeterminado**: `true`

Habilita el caché de firma de bloques de pensamiento en disco.

**Función**: Almacenar el caché de firmas puede evitar errores de firma repetidos en conversaciones de múltiples turnos.

### `signature_cache.memory_ttl_seconds`

**Tipo**: `number` (rango: 60-86400)  
**Valor predeterminado**: `3600` (1 hora)

Tiempo de expiración del caché en memoria (segundos).

### `signature_cache.disk_ttl_seconds`

**Tipo**: `number` (rango: 3600-604800)  
**Valor predeterminado**: `172800` (48 horas)

Tiempo de expiración del caché en disco (segundos).

### `signature_cache.write_interval_seconds`

**Tipo**: `number` (rango: 10-600)  
**Valor predeterminado**: `60`

Intervalo de escritura en disco en segundo plano (segundos).

**Ejemplo**:
```json
{
  "keep_thinking": true,
  "signature_cache": {
    "enabled": true,
    "memory_ttl_seconds": 7200,
    "disk_ttl_seconds": 259200,
    "write_interval_seconds": 120
  }
}
```

---

## Reintento de respuesta vacía

Cuando Antigravity devuelve una respuesta vacía (sin candidatos/choices), se reintenta automáticamente.

### `empty_response_max_attempts`

**Tipo**: `number` (rango: 1-10)  
**Valor predeterminado**: `4`

Número máximo de reintentos.

### `empty_response_retry_delay_ms`

**Tipo**: `number` (rango: 500-10000)  
**Valor predeterminado**: `2000` (2 segundos)

Retardo entre reintentos (milisegundos).

**Escenarios de aplicación**:
- Entornos de red inestables (aumentar el número de reintentos)
- Necesidad de falla rápida (reducir el número de reintentos y el retraso)

---

## Recuperación de ID de herramienta

### `tool_id_recovery`

**Tipo**: `boolean`  
**Valor predeterminado**: `true`

Habilita la recuperación de aislamiento de ID de herramienta. Cuando el ID de respuesta de la herramienta no coincide (debido a la compresión de contexto), intenta hacer coincidir por nombre de función o crear un marcador de posición.

**Función**: Mejora la confiabilidad de las llamadas a herramientas en conversaciones de múltiples turnos.

**Escenarios de aplicación**:
- Escenarios de conversaciones largas (se recomienda habilitar)
- Escenarios de uso frecuente de herramientas

---

## Prevención de alucinación de herramienta

### `claude_tool_hardening`

**Tipo**: `boolean`  
**Valor predeterminado**: `true`

Habilita la prevención de alucinación de herramienta para modelos Claude. Cuando está habilitado, se inyecta automáticamente:
- Firma de parámetros en la descripción de la herramienta
- Instrucciones del sistema de reglas estrictas de uso de herramientas

**Función**: Evita que Claude use nombres de parámetros de datos de entrenamiento en lugar de los nombres de parámetros reales en el schema.

**Escenarios de aplicación**:
- Uso de plugins MCP o herramientas personalizadas (se recomienda habilitar)
- Schema de herramientas complejo

**Escenarios no recomendados**:
- Confirmación de que las llamadas a herramientas coinciden completamente con el schema (se puede desactivar para reducir indicaciones adicionales)

---

## Actualización proactiva de token

### `proactive_token_refresh`

**Tipo**: `boolean`  
**Valor predeterminado**: `true`

Habilita la actualización de token en segundo plano proactiva. Cuando está habilitado, los tokens se actualizan automáticamente antes de que expiren, asegurando que las solicitudes no se bloqueen por la actualización del token de actualización.

**Función**: Evita el retraso de las solicitudes esperando la actualización del token.

### `proactive_refresh_buffer_seconds`

**Tipo**: `number` (rango: 60-7200)  
**Valor predeterminado**: `1800` (30 minutos)

Tiempo antes de la expiración del token para activar la actualización proactiva (segundos).

### `proactive_refresh_check_interval_seconds`

**Tipo**: `number` (rango: 30-1800)  
**Valor predeterminado**: `300` (5 minutos)

Intervalo de verificación de actualización proactiva (segundos).

**Escenarios de aplicación**:
- Escenarios de solicitudes de alta frecuencia (se recomienda habilitar actualización proactiva)
- Deseo de reducir el riesgo de falla de actualización (aumentar el tiempo de buffer)

---

## Límites de velocidad y selección de cuentas

### `max_rate_limit_wait_seconds`

**Tipo**: `number` (rango: 0-3600)  
**Valor predeterminado**: `300` (5 minutos)

Tiempo máximo de espera cuando todas las cuentas están limitadas (segundos). Si el tiempo mínimo de espera de todas las cuentas excede este umbral, el plugin fallará rápidamente en lugar de suspenderse.

**Establecer en 0**: Desactiva el tiempo de espera, espera indefinidamente.

**Escenarios de aplicación**:
- Escenarios que requieren falla rápida (reducir el tiempo de espera)
- Escenarios que aceptan esperas prolongadas (aumentar el tiempo de espera)

### `quota_fallback`

**Tipo**: `boolean`  
**Valor predeterminado**: `false`

Habilita el respaldo de cuota para modelos Gemini. Cuando el grupo de cuota preferido (Gemini CLI o Antigravity) se agota, intenta el grupo de cuota de respaldo de la misma cuenta.

**Escenarios de aplicación**:
- Uso frecuente de modelos Gemini (se recomienda habilitar)
- Deseo de maximizar la utilización de la cuota de cada cuenta

::: tip Solo efectivo cuando no se especifica explícitamente el sufijo de cuota
Si el nombre del modelo contiene explícitamente `:antigravity` o `:gemini-cli`, siempre usará el grupo de cuota especificado, no se retrocederá.
:::

### `account_selection_strategy`

**Tipo**: `string` (enumeración: `sticky`, `round-robin`, `hybrid`)  
**Valor predeterminado**: `"hybrid"`  
**Variable de entorno**: `OPENCODE_ANTIGRAVITY_ACCOUNT_SELECTION_STRATEGY`

Estrategia de selección de cuentas.

| Estrategia | Descripción | Escenario de aplicación |
| --- | --- | --- |
| `sticky` | Usa la misma cuenta hasta que se alcance el límite, conserva el caché de indicaciones | Sesión única, escenarios sensibles al caché |
| `round-robin` | Cambia a la siguiente cuenta en cada solicitud, maximiza el rendimiento | Escenarios de alto rendimiento con múltiples cuentas |
| `hybrid` | Selección determinista basada en puntuación de salud + cubo de tokens + LRU | Recomendación general, equilibra rendimiento y confiabilidad |

::: info Descripción detallada
Consulte el capítulo [Estrategias de selección de cuentas](/es/NoeFabris/opencode-antigravity-auth/advanced/account-selection-strategies/).
:::

### `pid_offset_enabled`

**Tipo**: `boolean`  
**Valor predeterminado**: `false`  
**Variable de entorno**: `OPENCODE_ANTIGRAVITY_PID_OFFSET_ENABLED=1`

Habilita el desplazamiento de cuentas basado en PID. Cuando está habilitado, diferentes sesiones (PIDs) priorizarán la selección de diferentes cuentas iniciales, lo que ayuda a distribuir la carga al ejecutar múltiples agentes en paralelo.

**Descripción del comportamiento**:
- `false` (predeterminado): Todas las sesiones comienzan desde el mismo índice de cuenta, conserva el caché de indicaciones de Anthropic (recomendado para uso de sesión única)
- `true`: Desplaza la cuenta inicial según el PID, distribuye la carga (recomendado para uso de sesiones múltiples en paralelo)

**Escenarios de aplicación**:
- Ejecución de múltiples sesiones de OpenCode en paralelo
- Uso de subagentes o tareas paralelas

### `switch_on_first_rate_limit`

**Tipo**: `boolean`  
**Valor predeterminado**: `true`

Cambia de cuenta inmediatamente en el primer límite de velocidad (después de un retraso de 1 segundo). Cuando está deshabilitado, primero reintenta con la misma cuenta y solo cambia en el segundo límite de velocidad.

**Escenarios de aplicación**:
- Deseo de cambiar de cuenta rápidamente (se recomienda habilitar)
- Deseo de maximizar la cuota de una sola cuenta (deshabilitar)

---

## Puntuación de salud (estrategia Hybrid)

> Solo efectivo cuando `account_selection_strategy` es `hybrid`

### `health_score.initial`

**Tipo**: `number` (rango: 0-100)  
**Valor predeterminado**: `70`

Puntuación de salud inicial de la cuenta.

### `health_score.success_reward`

**Tipo**: `number` (rango: 0-10)  
**Valor predeterminado**: `1`

Puntuación de salud aumentada en cada solicitud exitosa.

### `health_score.rate_limit_penalty`

**Tipo**: `number` (rango: -50-0)  
**Valor predeterminado**: `-10`

Puntuación de salud deducida en cada límite de velocidad.

### `health_score.failure_penalty`

**Tipo**: `number` (rango: -100-0)  
**Valor predeterminado**: `-20`

Puntuación de salud deducida en cada falla.

### `health_score.recovery_rate_per_hour`

**Tipo**: `number` (rango: 0-20)  
**Valor predeterminado**: `2`

Puntuación de salud recuperada por hora.

### `health_score.min_usable`

**Tipo**: `number` (rango: 0-100)  
**Valor predeterminado**: `50`

Umbral mínimo de puntuación de salud para que una cuenta sea utilizable.

### `health_score.max_score`

**Tipo**: `number` (rango: 50-100)  
**Valor predeterminado**: `100`

Límite superior de la puntuación de salud.

**Escenarios de aplicación**:
- La configuración predeterminada es adecuada para la mayoría de los escenarios
- En entornos de límites de velocidad frecuentes, puede reducir `rate_limit_penalty` o aumentar `recovery_rate_per_hour`
- Para cambiar de cuenta más rápidamente, puede reducir `min_usable`

**Ejemplo**:
```json
{
  "account_selection_strategy": "hybrid",
  "health_score": {
    "initial": 80,
    "success_reward": 2,
    "rate_limit_penalty": -5,
    "failure_penalty": -15,
    "recovery_rate_per_hour": 5,
    "min_usable": 40,
    "max_score": 100
  }
}
```

---

## Cubo de tokens (estrategia Hybrid)

> Solo efectivo cuando `account_selection_strategy` es `hybrid`

### `token_bucket.max_tokens`

**Tipo**: `number` (rango: 1-1000)  
**Valor predeterminado**: `50`

Capacidad máxima del cubo de tokens.

### `token_bucket.regeneration_rate_per_minute`

**Tipo**: `number` (rango: 0.1-60)  
**Valor predeterminado**: `6`

Número de tokens generados por minuto.

### `token_bucket.initial_tokens`

**Tipo**: `number` (rango: 1-1000)  
**Valor predeterminado**: `50`

Número inicial de tokens de la cuenta.

**Escenarios de aplicación**:
- En escenarios de solicitudes de alta frecuencia, pueden aumentarse `max_tokens` y `regeneration_rate_per_minute`
- Para rotar cuentas más rápidamente, puede reducirse `initial_tokens`

---

## Actualización automática

### `auto_update`

**Tipo**: `boolean`  
**Valor predeterminado**: `true`

Habilita la actualización automática del plugin.

**Escenarios de aplicación**:
- Deseo de obtener automáticamente las últimas funciones (se recomienda habilitar)
- Necesidad de una versión fija (deshabilitar)

---

## Búsqueda web (Gemini Grounding)

### `web_search.default_mode`

**Tipo**: `string` (enumeración: `auto`, `off`)  
**Valor predeterminado**: `"off"`

Modo predeterminado de búsqueda web (cuando no se especifica mediante variant).

| Modo | Descripción |
| --- | --- |
| `auto` | El modelo decide cuándo buscar (recuperación dinámica) |
| `off` | Búsqueda deshabilitada de forma predeterminada |

### `web_search.grounding_threshold`

**Tipo**: `number` (rango: 0-1)  
**Valor predeterminado**: `0.3`

Umbral de recuperación dinámica (0.0 a 1.0). Cuanto mayor sea el valor, menor será la frecuencia de búsqueda del modelo (requerirá mayor confianza para activar la búsqueda). Solo tiene efecto en modo `auto`.

**Escenarios de aplicación**:
- Reducir búsquedas innecesarias (aumentar el umbral, como 0.5)
- Animar al modelo a buscar más (reducir el umbral, como 0.2)

**Ejemplo**:
```json
{
  "web_search": {
    "default_mode": "auto",
    "grounding_threshold": 0.4
  }
}
```

---

## Ejemplos de configuración

### Configuración básica de cuenta única

```json
{
  "quiet_mode": false,
  "debug": false,
  "keep_thinking": false,
  "session_recovery": true,
  "auto_resume": false,
  "account_selection_strategy": "sticky"
}
```

### Configuración de alto rendimiento de múltiples cuentas

```json
{
  "quiet_mode": true,
  "debug": false,
  "session_recovery": true,
  "auto_resume": true,
  "account_selection_strategy": "hybrid",
  "quota_fallback": true,
  "switch_on_first_rate_limit": true,
  "max_rate_limit_wait_seconds": 120,
  "health_score": {
    "initial": 70,
    "min_usable": 40
  },
  "token_bucket": {
    "max_tokens": 100,
    "regeneration_rate_per_minute": 10
  }
}
```

### Configuración de depuración y diagnóstico

```json
{
  "debug": true,
  "log_dir": "/tmp/antigravity-logs",
  "quiet_mode": false,
  "session_recovery": true,
  "auto_resume": true,
  "tool_id_recovery": true
}
```

### Configuración de retención de bloque de pensamiento

```json
{
  "keep_thinking": true,
  "signature_cache": {
    "enabled": true,
    "memory_ttl_seconds": 7200,
    "disk_ttl_seconds": 259200,
    "write_interval_seconds": 120
  },
  "session_recovery": true
}
```

---

## Preguntas frecuentes

### P: ¿Cómo desactivar temporalmente una configuración?

**R**: Use variables de entorno para sobrescribir, sin necesidad de modificar el archivo de configuración.

```bash
# Habilitar temporalmente el modo de depuración
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode

# Habilitar temporalmente el modo silencioso
OPENCODE_ANTIGRAVITY_QUIET=1 opencode
```

### P: ¿Necesito reiniciar OpenCode después de modificar el archivo de configuración?

**R**: Sí, el archivo de configuración se carga cuando OpenCode se inicia, por lo que es necesario reiniciar después de la modificación.

### P: ¿Cómo verificar si la configuración ha surtido efecto?

**R**: Habilite el modo `debug` y verifique la información de carga de configuración en el archivo de registro.

```json
{
  "debug": true
}
```

El registro mostrará la configuración cargada:
```
[config] Loaded configuration: {...}
```

### P: ¿Qué opciones de configuración se necesitan ajustar con más frecuencia?

**R**:
- `account_selection_strategy`: Seleccionar la estrategia adecuada para escenarios de múltiples cuentas
- `quiet_mode`: Reducir la interferencia de notificaciones
- `session_recovery` / `auto_resume`: Controlar el comportamiento de recuperación de sesiones
- `debug`: Habilitar para solucionar problemas

### P: ¿El archivo de configuración tiene validación de JSON Schema?

**R**: Sí, agregar el campo `$schema` en el archivo de configuración puede habilitar el autocompletado y la validación del IDE:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  ...
}
```

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haga clic para ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta del archivo | Número de línea |
| --- | --- | --- |
| Definición de Schema de configuración | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 1-373 |
| JSON Schema | [`assets/antigravity.schema.json`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/assets/antigravity.schema.json) | 1-157 |
| Carga de configuración | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts) | - |

**Constantes clave**:
- `DEFAULT_CONFIG`: Objeto de configuración predeterminada (`schema.ts:328-372`)

**Tipos clave**:
- `AntigravityConfig`: Tipo de configuración principal (`schema.ts:322`)
- `SignatureCacheConfig`: Tipo de configuración de caché de firma (`schema.ts:323`)
- `AccountSelectionStrategy`: Tipo de estrategia de selección de cuentas (`schema.ts:22`)

</details>
