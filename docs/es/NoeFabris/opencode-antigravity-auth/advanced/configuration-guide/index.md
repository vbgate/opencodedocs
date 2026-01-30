---
title: "Guía de Configuración: Opciones Completas Explicadas | Antigravity Auth"
sidebarTitle: "Configuración Completa"
subtitle: "Guía Completa de Opciones de Configuración"
description: "Domina las opciones de configuración completas del plugin Antigravity Auth. Explicación detallada de ubicaciones de archivos de configuración, comportamiento del modelo, estrategias de rotación de cuentas y configuración de comportamiento de la aplicación, con esquemas de configuración recomendados para escenarios de cuenta única, múltiples cuentas y agentes paralelos."
tags:
  - "Configuración"
  - "Configuración Avanzada"
  - "Múltiples Cuentas"
  - "Rotación de Cuentas"
prerequisite:
  - "start-quick-install"
  - "advanced-multi-account-setup"
order: 2
---

# Guía Completa de Opciones de Configuración

## Qué Aprenderás

- ✅ Crear archivos de configuración en la ubicación correcta
- ✅ Elegir el esquema de configuración apropiado según el escenario de uso
- ✅ Comprender el propósito y los valores predeterminados de todas las opciones de configuración
- ✅ Usar variables de entorno para sobrescribir temporalmente la configuración
- ✅ Ajustar el comportamiento del modelo, la rotación de cuentas y el comportamiento del plugin

## Tu Desafío Actual

¿Demasiadas opciones de configuración y no sabes por dónde empezar? ¿La configuración predeterminada funciona, pero quieres optimizarla aún más? ¿No estás seguro de qué estrategia de rotación usar en escenarios de múltiples cuentas?

## Idea Principal

El archivo de configuración es como escribir un "manual de instrucciones" para el plugin: le dices cómo trabajar y ejecutará según tu manera. El plugin Antigravity Auth proporciona opciones de configuración ricas, pero la mayoría de los usuarios solo necesitan configurar algunas opciones principales.

### Prioridad del Archivo de Configuración

La prioridad de los elementos de configuración de mayor a menor:

1. **Variables de Entorno** (sobrescritura temporal)
2. **Configuración a Nivel de Proyecto** `.opencode/antigravity.json` (proyecto actual)
3. **Configuración a Nivel de Usuario** `~/.config/opencode/antigravity.json` (global)

::: info
Las variables de entorno tienen la prioridad más alta, adecuadas para pruebas temporales. Los archivos de configuración son adecuados para configuraciones persistentes.
:::

### Ubicación del Archivo de Configuración

Según el sistema operativo, la ubicación del archivo de configuración a nivel de usuario varía:

| Sistema | Ruta |
| --- | --- |
| Linux/macOS | `~/.config/opencode/antigravity.json` |
| Windows | `%APPDATA%\opencode\antigravity.json` |

El archivo de configuración a nivel de proyecto siempre está en `.opencode/antigravity.json` en el directorio raíz del proyecto.

### Clasificación de Opciones de Configuración

Las opciones de configuración se dividen en cuatro categorías principales:

1. **Comportamiento del Modelo**: bloques de pensamiento, recuperación de sesión, Google Search
2. **Rotación de Cuentas**: gestión de múltiples cuentas, estrategia de selección, desplazamiento PID
3. **Comportamiento de la Aplicación**: registros de depuración, actualización automática, silencio de notificaciones
4. **Configuración Avanzada**: recuperación de errores, gestión de tokens, puntuación de salud

---

## 🎒 Preparación Antes de Comenzar

- [x] Plugin instalado (consulta [Instalación Rápida](../../start/quick-install/))
- [x] Al menos una cuenta de Google configurada
- [x] Conocimiento básico de sintaxis JSON

---

## Paso a Paso

### Paso 1: Crear Archivo de Configuración

**Por qué**: El archivo de configuración permite que el plugin funcione según tus necesidades

Selecciona la ruta correspondiente según tu sistema operativo para crear el archivo de configuración:

::: code-group

```bash [macOS/Linux]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
EOF
```

```powershell [Windows]
## Usando PowerShell
$env:APPDATA\opencode\antigravity.json = @{
  '$schema' = "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
} | ConvertTo-Json -Depth 10

Set-Content -Path "$env:APPDATA\opencode\antigravity.json" -Value $json
```

:::

**Deberías ver**: Archivo creado exitosamente, el contenido solo tiene el campo `$schema`.

::: tip
Después de agregar el campo `$schema`, VS Code proporcionará automáticamente sugerencias inteligentes y verificación de tipos.
:::

### Paso 2: Configurar Opciones Básicas

**Por qué**: Optimizar el comportamiento del plugin según tu escenario de uso

Elige uno de los siguientes esquemas según tu configuración:

**Escenario A: Cuenta Única + Necesita Google Search**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Escenario B: 2-3 Cuentas + Rotación Inteligente**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Escenario C: Múltiples Cuentas + Agentes Paralelos**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "switch_on_first_rate_limit": true,
  "pid_offset_enabled": true,
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Deberías ver**: Archivo de configuración guardado exitosamente, OpenCode recarga automáticamente la configuración del plugin.

### Paso 3: Verificar Configuración

**Por qué**: Confirmar que la configuración está en efecto

Inicia una solicitud de modelo en OpenCode y observa:

1. Cuenta única usando estrategia `sticky`: todas las solicitudes usan la misma cuenta
2. Múltiples cuentas usando estrategia `hybrid`: las solicitudes se asignan inteligentemente a diferentes cuentas
3. Modelo Gemini con `web_search` habilitado: el modelo buscará en la web cuando sea necesario

**Deberías ver**: El comportamiento del plugin coincide con tus expectativas de configuración.

---

## Explicación Detallada de Opciones de Configuración

### Comportamiento del Modelo

Estas opciones afectan la forma de pensar y responder del modelo.

#### keep_thinking

| Valor | Predeterminado | Descripción |
| --- | --- | --- |
| `true` | - | Conservar bloques de pensamiento de Claude, mantener coherencia entre turnos |
| `false` | ✓ | Eliminar bloques de pensamiento, más estable, contexto más pequeño |

::: warning Atención
Habilitar `keep_thinking` puede causar inestabilidad del modelo y errores de firma. Se recomienda mantener `false`.
:::

#### session_recovery

| Valor | Predeterminado | Descripción |
| --- | --- | --- |
| `true` | ✓ | Recuperar automáticamente sesiones interrumpidas en llamadas de herramientas |
| `false` | - | No recuperar automáticamente cuando se encuentran errores |

#### auto_resume

| Valor | Predeterminado | Descripción |
| --- | --- | --- |
| `true` | - | Enviar automáticamente "continue" después de la recuperación |
| `false` | ✓ | Solo mostrar aviso después de la recuperación, continuar manualmente |

#### resume_text

Personaliza el texto enviado durante la recuperación. El valor predeterminado es `"continue"`, puedes cambiarlo a cualquier texto.

#### web_search

| Opción | Predeterminado | Descripción |
| --- | --- | --- |
| `default_mode` | `"off"` | `"auto"` o `"off"` |
| `grounding_threshold` | `0.3` | Umbral de búsqueda (0=siempre buscar, 1=nunca buscar) |

::: info
`grounding_threshold` solo tiene efecto cuando `default_mode: "auto"`. Cuanto mayor sea el valor, más conservadora será la búsqueda del modelo.
:::

---

### Rotación de Cuentas

Estas opciones gestionan la asignación de solicitudes de múltiples cuentas.

#### account_selection_strategy

| Estrategia | Predeterminado | Escenario Aplicable |
| --- | --- | --- |
| `sticky` | - | Cuenta única, conservar prompt cache |
| `round-robin` | - | 4+ cuentas, maximizar rendimiento |
| `hybrid` | ✓ | 2-3 cuentas, rotación inteligente |

::: tip
Estrategia recomendada para diferentes números de cuentas:
- 1 cuenta → `sticky`
- 2-3 cuentas → `hybrid`
- 4+ cuentas → `round-robin`
- Agentes paralelos → `round-robin` + `pid_offset_enabled: true`
:::

#### switch_on_first_rate_limit

| Valor | Predeterminado | Descripción |
| --- | --- | --- |
| `true` | ✓ | Cambiar cuenta inmediatamente al primer 429 |
| `false` | - | Reintentar cuenta actual primero, cambiar en el segundo 429 |

#### pid_offset_enabled

| Valor | Predeterminado | Descripción |
| --- | --- | --- |
| `true` | - | Diferentes sesiones (PID) usan diferentes cuentas iniciales |
| `false` | ✓ | Todas las sesiones comienzan desde la misma cuenta |

::: tip
Para uso de sesión única mantener `false`, conservar Anthropic prompt cache. Para múltiples sesiones paralelas se recomienda habilitar `true`.
:::

#### quota_fallback

| Valor | Predeterminado | Descripción |
| --- | --- | --- |
| `true` | - | Fallback de pool de cuota del modelo Gemini |
| `false` | ✓ | No habilitar fallback |

::: info
Solo aplicable a modelos Gemini. Cuando el pool de cuota principal se agota, intenta el pool de cuota de respaldo de la misma cuenta.
:::

---

### Comportamiento de la Aplicación

Estas opciones controlan el comportamiento del plugin en sí.

#### quiet_mode

| Valor | Predeterminado | Descripción |
| --- | --- | --- |
| `true` | - | Silenciar la mayoría de las notificaciones toast (excepto notificaciones de recuperación) |
| `false` | ✓ | Mostrar todas las notificaciones |

#### debug

| Valor | Predeterminado | Descripción |
| --- | --- | --- |
| `true` | - | Habilitar registros de depuración |
| `false` | ✓ | No registrar logs de depuración |

::: tip
Para habilitar temporalmente los registros de depuración sin modificar el archivo de configuración, usa variables de entorno:
```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode   # Registros básicos
OPENCODE_ANTIGRAVITY_DEBUG=2 opencode   # Registros detallados
```
:::

#### log_dir

Personaliza el directorio de registros de depuración. El valor predeterminado es `~/.config/opencode/antigravity-logs/`.

#### auto_update

| Valor | Predeterminado | Descripción |
| --- | --- | --- |
| `true` | ✓ | Verificar y actualizar automáticamente el plugin |
| `false` | - | No actualizar automáticamente |

---

### Configuración Avanzada

Estas opciones son para casos extremos, la mayoría de los usuarios no necesitan modificarlas.

<details>
<summary><strong>Expandir para ver configuración avanzada</strong></summary>

#### Recuperación de Errores

| Opción | Predeterminado | Descripción |
| --- | --- | --- |
| `empty_response_max_attempts` | `4` | Número de reintentos para respuestas vacías |
| `empty_response_retry_delay_ms` | `2000` | Intervalo de reintento (milisegundos) |
| `tool_id_recovery` | `true` | Corregir desajuste de ID de herramienta |
| `claude_tool_hardening` | `true` | Prevenir alucinaciones de parámetros de herramienta |
| `max_rate_limit_wait_seconds` | `300` | Tiempo máximo de espera por límite de tasa (0=infinito) |

#### Gestión de Tokens

| Opción | Predeterminado | Descripción |
| --- | --- | --- |
| `proactive_token_refresh` | `true` | Actualizar tokens proactivamente antes de la expiración |
| `proactive_refresh_buffer_seconds` | `1800` | Actualizar 30 minutos antes |
| `proactive_refresh_check_interval_seconds` | `300` | Intervalo de verificación de actualización (segundos) |

#### Caché de Firma (efectivo cuando `keep_thinking: true`)

| Opción | Predeterminado | Descripción |
| --- | --- | --- |
| `signature_cache.enabled` | `true` | Habilitar caché en disco |
| `signature_cache.memory_ttl_seconds` | `3600` | TTL de caché en memoria (1 hora) |
| `signature_cache.disk_ttl_seconds` | `172800` | TTL de caché en disco (48 horas) |
| `signature_cache.write_interval_seconds` | `60` | Intervalo de escritura en segundo plano (segundos) |

#### Puntuación de Salud (usado por estrategia `hybrid`)

| Opción | Predeterminado | Descripción |
| --- | --- | --- |
| `health_score.initial` | `70` | Puntuación de salud inicial |
| `health_score.success_reward` | `1` | Puntos de recompensa por éxito |
| `health_score.rate_limit_penalty` | `-10` | Penalización por límite de tasa |
| `health_score.failure_penalty` | `-20` | Penalización por fallo |
| `health_score.recovery_rate_per_hour` | `2` | Puntos de recuperación por hora |
| `health_score.min_usable` | `50` | Puntuación mínima para cuenta utilizable |
| `health_score.max_score` | `100` | Límite de puntuación de salud |

#### Token Bucket (usado por estrategia `hybrid`)

| Opción | Predeterminado | Descripción |
| --- | --- | --- |
| `token_bucket.max_tokens` | `50` | Capacidad máxima del bucket |
| `token_bucket.regeneration_rate_per_minute` | `6` | Velocidad de recuperación por minuto |
| `token_bucket.initial_tokens` | `50` | Número inicial de tokens |

</details>

---

## Esquemas de Configuración Recomendados

### Configuración de Cuenta Única

Adecuado para: usuarios con solo una cuenta de Google

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Explicación de la configuración**:
- `sticky`: Sin rotación, conservar Anthropic prompt cache
- `web_search: auto`: Gemini puede buscar según sea necesario

### Configuración de 2-3 Cuentas

Adecuado para: equipos pequeños o usuarios que necesitan cierta flexibilidad

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Explicación de la configuración**:
- `hybrid`: Rotación inteligente, selecciona la mejor cuenta por puntuación de salud
- `web_search: auto`: Gemini puede buscar según sea necesario

### Configuración de Múltiples Cuentas + Agentes Paralelos

Adecuado para: usuarios que ejecutan múltiples agentes concurrentes

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "switch_on_first_rate_limit": true,
  "pid_offset_enabled": true,
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Explicación de la configuración**:
- `round-robin`: Rotar cuenta en cada solicitud
- `switch_on_first_rate_limit: true`: Cambiar inmediatamente en el primer 429
- `pid_offset_enabled: true`: Diferentes sesiones usan diferentes cuentas iniciales
- `web_search: auto`: Gemini puede buscar según sea necesario

---

## Advertencias de Errores Comunes

### ❌ Error: La configuración no tiene efecto después de modificarla

**Causa**: OpenCode puede no haber recargado el archivo de configuración.

**Solución**: Reinicia OpenCode o verifica si la sintaxis JSON es correcta.

### ❌ Error: Error de formato JSON en el archivo de configuración

**Causa**: Error de sintaxis JSON (coma faltante, coma extra, comentarios, etc.).

**Solución**: Usa una herramienta de validación JSON para verificar, o agrega el campo `$schema` para habilitar sugerencias inteligentes del IDE.

### ❌ Error: La variable de entorno no tiene efecto

**Causa**: Nombre de variable de entorno mal escrito o OpenCode no reiniciado.

**Solución**: Confirma que el nombre de la variable es `OPENCODE_ANTIGRAVITY_*` (todo en mayúsculas, prefijo correcto), reinicia OpenCode.

### ❌ Error: Errores frecuentes después de habilitar `keep_thinking: true`

**Causa**: Desajuste de firma de bloque de pensamiento.

**Solución**: Mantener `keep_thinking: false` (valor predeterminado), o ajustar la configuración de `signature_cache`.

---

## Resumen de Esta Lección

Prioridad de ubicación del archivo de configuración: variables de entorno > nivel de proyecto > nivel de usuario.

Elementos de configuración principales:
- Comportamiento del modelo: `keep_thinking`, `session_recovery`, `web_search`
- Rotación de cuentas: `account_selection_strategy`, `pid_offset_enabled`
- Comportamiento de la aplicación: `debug`, `quiet_mode`, `auto_update`

Configuración recomendada para diferentes escenarios:
- Cuenta única: `sticky`
- 2-3 cuentas: `hybrid`
- 4+ cuentas: `round-robin`
- Agentes paralelos: `round-robin` + `pid_offset_enabled: true`

---

## Avance de la Siguiente Lección

> En la siguiente lección aprenderemos **[Registros de Depuración](../debug-logging/)**.
>
> Aprenderás:
> - Cómo habilitar registros de depuración
> - Cómo interpretar el contenido de los registros
> - Cómo solucionar problemas comunes

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Funcionalidad | Ruta del Archivo | Líneas |
| --- | --- | --- |
| Definición del Schema de Configuración | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 12-323 |
| Valores de Configuración Predeterminados | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 325-373 |
| Lógica de Carga de Configuración | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts) | 1-100 |

**Constantes Clave**:
- `DEFAULT_CONFIG`: Valores predeterminados de todos los elementos de configuración

**Tipos Clave**:
- `AntigravityConfig`: Tipo de objeto de configuración
- `AccountSelectionStrategy`: Tipo de estrategia de selección de cuenta
- `SignatureCacheConfig`: Tipo de configuración de caché de firma

</details>
