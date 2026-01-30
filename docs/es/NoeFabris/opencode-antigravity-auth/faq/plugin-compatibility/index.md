---
title: "Compatibilidad de Plugins: Solución de Conflictos Comunes | Antigravity Auth"
sidebarTitle: "Qué Hacer con Conflictos de Plugins"
subtitle: "Resolver problemas de compatibilidad con otros plugins"
description: "Aprende a resolver problemas de compatibilidad entre Antigravity Auth y plugins como oh-my-opencode, DCP, etc. Configura el orden correcto de carga y desactiva métodos de autenticación conflictivos."
tags:
  - "FAQ"
  - "Configuración de Plugins"
  - "oh-my-opencode"
  - "DCP"
  - "OpenCode"
  - "Antigravity"
prerequisite:
  - "start-quick-install"
order: 4
---

# Resolver Problemas de Compatibilidad con Otros Plugins

La **compatibilidad de plugins** es un problema común al usar Antigravity Auth. Diferentes plugins pueden entrar en conflicto entre sí, causando fallos de autenticación, pérdida de thinking blocks o errores en el formato de las solicitudes. Este tutorial te ayuda a resolver problemas de compatibilidad con plugins como oh-my-opencode, DCP, etc.

## Lo Que Aprenderás

- Configurar correctamente el orden de carga de los plugins para evitar problemas con DCP
- Desactivar métodos de autenticación conflictivos en oh-my-opencode
- Identificar y eliminar plugins innecesarios
- Habilitar el desplazamiento de PID para escenarios de agentes paralelos

## Problemas Comunes de Compatibilidad

### Problema 1: Conflicto con oh-my-opencode

**Síntomas**:
- Fallos de autenticación o ventanas de autorización OAuth que aparecen repetidamente
- Las solicitudes de modelos devuelven errores 400 o 401
- La configuración de modelos del Agent no tiene efecto

**Causa**: oh-my-opencode tiene habilitada por defecto la autenticación integrada de Google, que entra en conflicto con el flujo OAuth de Antigravity Auth.

::: warning Problema Central
oh-my-opencode intercepta todas las solicitudes a modelos de Google y usa su propio método de autenticación. Esto hace que el token OAuth de Antigravity Auth no pueda usarse.
:::

**Solución**:

Edita `~/.config/opencode/oh-my-opencode.json` y añade la siguiente configuración:

```json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" },
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**Explicación de la Configuración**:

| Configuración | Valor | Descripción |
| --- | --- | --- |
| `google_auth` | `false` | Desactiva la autenticación integrada de Google de oh-my-opencode |
| `agents.<agent-name>.model` | `google/antigravity-*` | Sobrescribe el modelo del Agent con un modelo de Antigravity |

**Puntos de Verificación ✅**:

- Guarda la configuración y reinicia OpenCode
- Prueba si el Agent usa el modelo de Antigravity
- Comprueba si ya no aparecen ventanas de autorización OAuth

---

### Problema 2: Conflicto con DCP (@tarquinen/opencode-dcp)

**Síntomas**:
- Los modelos Claude Thinking devuelven el error: `thinking must be first block in message`
- Falta el historial de thinking blocks en el diálogo
- El contenido del pensamiento no se muestra

**Causa**: Los mensajes sintéticos del asistente (synthetic assistant messages) creados por DCP faltan los thinking blocks, lo que entra en conflicto con los requisitos de la API de Claude.

::: info ¿Qué son los mensajes sintéticos?
Los mensajes sintéticos son mensajes generados automáticamente por plugins o el sistema, usados para reparar el historial de conversación o completar mensajes faltantes. DCP crea estos mensajes en ciertos escenarios, pero no añade thinking blocks.
:::

**Solución**:

Asegúrate de que Antigravity Auth se cargue **antes** que DCP. Edita `~/.config/opencode/config.json`:

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

**¿Por qué es necesario este orden?**:

- Antigravity Auth procesa y repara los thinking blocks
- DCP crea mensajes sintéticos (que pueden faltar los thinking blocks)
- Si DCP se carga primero, Antigravity Auth no puede reparar los mensajes creados por DCP

**Puntos de Verificación ✅**:

- Comprueba que `opencode-antigravity-auth` esté antes que `@tarquinen/opencode-dcp`
- Reinicia OpenCode
- Prueba si el modelo Thinking muestra correctamente el contenido del pensamiento

---

### Problema 3: Asignación de Cuentas en Escenarios de Agentes Paralelos

**Síntomas**:
- Múltiples agentes paralelos usan la misma cuenta
- Cuando se encuentran límites de velocidad, todos los agentes fallan simultáneamente
- Baja utilización de la cuota

**Causa**: Por defecto, múltiples agentes paralelos comparten la misma lógica de selección de cuentas, haciendo que puedan usar la misma cuenta simultáneamente.

::: tip Escenarios de Agentes Paralelos
Cuando usas la función de paralelismo de Cursor (como ejecutar múltiples Agentes simultáneamente), cada Agent inicia solicitudes de modelo de forma independiente. Sin una asignación de cuentas correcta, pueden "chocar" entre sí.
:::

**Solución**:

Edita `~/.config/opencode/antigravity.json` y habilita el desplazamiento de PID:

```json
{
  "pid_offset_enabled": true
}
```

**¿Qué es el Desplazamiento de PID?**

El desplazamiento de PID (Process ID) hace que cada agente paralelo use un índice de cuenta inicial diferente:

```
Agente 1 (PID 100) → Cuenta 0
Agente 2 (PID 101) → Cuenta 1
Agente 3 (PID 102) → Cuenta 2
```

De esta manera, incluso si las solicitudes se inician simultáneamente, no se usará la misma cuenta.

**Requisitos Previos**:
- Necesitas al menos 2 cuentas de Google
- Se recomienda habilitar `account_selection_strategy: "round-robin"` o `"hybrid"`

**Puntos de Verificación ✅**:

- Confirma que se han configurado múltiples cuentas (ejecuta `opencode auth list`)
- Habilita `pid_offset_enabled: true`
- Prueba si los agentes paralelos usan diferentes cuentas (revisa los logs de depuración)

---

### Problema 4: Plugins Innecesarios

**Síntomas**:
- Conflictos de autenticación o autenticación duplicada
- Fallos en la carga de plugins o mensajes de advertencia
- Configuración confusa, sin saber qué plugins están activos

**Causa**: Se han instalado plugins con funcionalidades superpuestas.

::: tip Revisión de Plugins Redundantes
Revisa periódicamente la lista de plugins en `config.json` y elimina los que no necesites para evitar conflictos y problemas de rendimiento.
:::

**Plugins No Necesarios**:

| Tipo de Plugin | Ejemplos | Razón |
| --- | --- | ---|
| **Plugins de autenticación gemini** | `opencode-gemini-auth`, `@username/gemini-auth` | Antigravity Auth ya gestiona todo el OAuth de Google |
| **Plugins de autenticación Claude** | `opencode-claude-auth` | Antigravity Auth no utiliza autenticación Claude |

**Solución**:

Elimina estos plugins de `~/.config/opencode/config.json`:

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest"
    // Elimina estos:
    // "opencode-gemini-auth@latest",
    // "@username/gemini-auth@latest"
  ]
}
```

**Puntos de Verificación ✅**:

- Revisa la lista de plugins en `~/.config/opencode/config.json`
- Elimina todos los plugins relacionados con gemini-auth
- Reinicia OpenCode y confirma que no hay conflictos de autenticación

---

## Solución de Errores Comunes

### Error 1: `thinking must be first block in message`

**Posibles Causas**:
- DCP se cargó antes que Antigravity Auth
- La recuperación de sesión de oh-my-opencode entra en conflicto con Antigravity Auth

**Pasos de Diagnóstico**:

1. Comprueba el orden de carga de los plugins:
   ```bash
   grep -A 10 '"plugin"' ~/.config/opencode/config.json
   ```

2. Asegúrate de que Antigravity Auth esté antes que DCP

3. Si el problema persiste, intenta desactivar la recuperación de sesión de oh-my-opencode (si existe)

### Error 2: `invalid_grant` o Fallo de Autenticación

**Posibles Causas**:
- `google_auth` de oh-my-opencode no está desactivado
- Múltiples plugins de autenticación intentan procesar la solicitud simultáneamente

**Pasos de Diagnóstico**:

1. Comprueba la configuración de oh-my-opencode:
   ```bash
   cat ~/.config/opencode/oh-my-opencode.json | grep google_auth
   ```

2. Asegúrate de que el valor sea `false`

3. Elimina otros plugins de autenticación gemini

### Error 3: Agentes Paralelos Usan la Misma Cuenta

**Posibles Causas**:
- `pid_offset_enabled` no está habilitado
- El número de cuentas es menor que el número de agentes

**Pasos de Diagnóstico**:

1. Comprueba la configuración de Antigravity:
   ```bash
   cat ~/.config/opencode/antigravity.json | grep pid_offset
   ```

2. Asegúrate de que el valor sea `true`

3. Comprueba el número de cuentas:
   ```bash
   opencode auth list
   ```

4. Si el número de cuentas es menor que el de agentes, se recomienda añadir más cuentas

---

## Ejemplos de Configuración

### Ejemplo de Configuración Completa (con oh-my-opencode)

```json
// ~/.config/opencode/config.json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest",
    "oh-my-opencode@latest"
  ]
}
```

```json
// ~/.config/opencode/antigravity.json
{
  "pid_offset_enabled": true,
  "account_selection_strategy": "hybrid"
}
```

```json
// ~/.config/opencode/oh-my-opencode.json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" },
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

---

## Resumen de Esta Lección

Los problemas de compatibilidad de plugins generalmente surgen de conflictos de autenticación, orden de carga de plugins o superposición de funcionalidades. Mediante la configuración correcta:

- ✅ Desactiva la autenticación integrada de Google de oh-my-opencode (`google_auth: false`)
- ✅ Asegúrate de que Antigravity Auth se cargue antes que DCP
- ✅ Habilita el desplazamiento de PID para agentes paralelos (`pid_offset_enabled: true`)
- ✅ Elimina plugins de autenticación gemini redundantes

Estas configuraciones pueden evitar la mayoría de los problemas de compatibilidad, permitiendo que tu entorno de OpenCode funcione de manera estable.

## Próxima Lección

> En la próxima lección aprenderemos sobre la **[Guía de Migración](../migration-guide/)**.
>
> Aprenderás:
> - Cómo migrar la configuración de cuentas entre diferentes máquinas
> - Cómo manejar cambios de configuración durante actualizaciones de versión
> - Cómo hacer copias de seguridad y restaurar datos de cuentas

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Funcionalidad | Ruta del Archivo | Líneas |
| --- | --- | --- |
| Procesamiento de thinking blocks | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts#L898-L930) | 898-930 |
| Caché de firma de thinking blocks | [`src/plugin/cache/signature-cache.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/cache/signature-cache.ts) | Archivo completo |
| Configuración de desplazamiento de PID | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L69-L72) | 69-72 |
| Recuperación de sesión (basada en oh-my-opencode) | [`src/plugin/recovery/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/index.ts) | Archivo completo |

**Configuraciones Clave**:
- `pid_offset_enabled: true`: Habilita el desplazamiento del ID de proceso, asigna diferentes cuentas a agentes paralelos
- `account_selection_strategy: "hybrid"`: Estrategia inteligente de selección de cuentas híbrida

**Funciones Clave**:
- `deepFilterThinkingBlocks()`: Elimina todos los thinking blocks (request-helpers.ts:898)
- `filterThinkingBlocksWithSignatureCache()`: Filtra thinking blocks según la caché de firmas (request-helpers.ts:1183)

</details>
