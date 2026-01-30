---
title: "Uso Avanzado: Trucos de Configuración y Mejores Prácticas | Tutorial de opencode-notify"
sidebarTitle: "Optimiza tu experiencia de notificaciones en 5 minutos"
subtitle: "Uso Avanzado: Trucos de Configuración y Mejores Prácticas | Tutorial de opencode-notify"
description: "Aprende trucos avanzados de configuración de opencode-notify, incluyendo filtrado de sesiones padre, personalización de sonidos, configuración de terminal y silencio temporal para optimizar tu experiencia de notificaciones."
tags:
  - "Configuración"
  - "Mejores Prácticas"
  - "Sonidos"
prerequisite:
  - "start-quick-start"
  - "advanced-config-reference"
order: 100
---

# Uso Avanzado: Trucos de Configuración y Mejores Prácticas

## Qué Aprenderás

- Entender por qué solo se notifican las sesiones padre por defecto, reduciendo el ruido de notificaciones
- Personalizar los sonidos de notificación de macOS para distinguir diferentes tipos de eventos
- Especificar manualmente el tipo de terminal para resolver problemas de detección automática
- Configurar silencio temporal para evitar interrupciones durante reuniones o períodos de enfoque
- Optimizar la estrategia de notificaciones, equilibrando la prontitud y el nivel de interrupción

## Tu Situación Actual

Aunque el plugin de notificaciones es muy conveniente, la configuración por defecto puede no adaptarse a los hábitos de trabajo de todos:

- Quieres rastrear todas las subtareas de IA, pero por defecto solo se notifican las sesiones padre
- Usas un terminal poco común y la detección automática falla
- Durante reuniones deseas silenciar temporalmente, pero no quieres modificar el archivo de configuración cada vez
- Diferentes tipos de eventos usan el mismo sonido, y no puedes distinguir si es una tarea completada o un error

## Cuándo Usar Esto

Cuando ya estés familiarizado con el uso básico del plugin y quieras optimizar la experiencia de notificaciones según tu flujo de trabajo personal.

---

## Idea Central

La configuración por defecto del plugin de notificaciones está cuidadosamente diseñada, pero puedes ajustar el comportamiento mediante el archivo de configuración. El principio central es:

**Reducir el ruido, aumentar el valor**

- **Filtrado de sesiones padre**: Solo notificar tareas principales, ignorando subtareas internas de IA
- **Detección de enfoque**: No notificar cuando el terminal está activo, evitando recordatorios repetidos
- **Notificaciones agrupadas**: Combinar notificaciones cuando múltiples tareas se completan simultáneamente

::: info Nota
Todos los elementos de configuración se explican detalladamente en [Referencia de Configuración](../config-reference/). Esta lección se centra en técnicas de uso práctico y mejores prácticas.
:::

---

## 🎒 Preparativos

Asegúrate de haber completado [Inicio Rápido](../../start/quick-start/) y de haber recibido exitosamente tu primera notificación.

---

## Sígueme

### Paso 1: Entender el Filtrado de Sesiones Padre

**¿Por qué?**

Las sesiones de OpenCode tienen una estructura de árbol: una sesión padre puede tener múltiples sesiones hijas. Por defecto, el plugin solo notifica cuando se completa la sesión padre, evitando el ruido de notificaciones de subtareas.

**Ver la configuración**

Edita el archivo de configuración:

```bash
# macOS/Linux
~/.config/opencode/kdco-notify.json

# Windows
%APPDATA%\opencode\kdco-notify.json
```

```json
{
  "notifyChildSessions": false // ← false por defecto
}
```

**Deberías ver**:
- `notifyChildSessions: false` significa que solo se notifican las sesiones raíz
- Las llamadas a herramientas secundarias ejecutadas internamente por IA no activarán notificaciones

**Cuándo habilitar notificaciones de sesiones hijas**

Si necesitas rastrear cada subtarea (como al depurar flujos de trabajo de múltiples pasos), configúralo como `true`:

```json
{
  "notifyChildSessions": true // ← Al habilitar, cada subtarea generará una notificación
}
```

::: warning Atención
Habilitar notificaciones de sesiones hijas aumentará significativamente la frecuencia de notificaciones, úsalo con precaución.
:::

---

### Paso 2: Personalizar Sonidos de Notificación de macOS

**¿Por qué?**

Usar diferentes sonidos para diferentes tipos de eventos te permite saber qué está sucediendo sin mirar la notificación.

**Ver sonidos disponibles**

macOS proporciona 14 sonidos integrados:

| Nombre del Sonido | Escenario Aplicable | Estilo |
| --- | --- | --- |
| Glass | Tarea completada (por defecto) | Cristalino |
| Basso | Error (por defecto) | Grave |
| Submarine | Solicitud de permiso (por defecto) | Suave |
| Bottle | Evento especial | Ligero |
| Ping | Recordatorio general | Simple |
| Pop | Evento casual | Animado |
| Purr | Evento exitoso | Suave |
| Blow | Advertencia | Urgente |
| Funk | Marcador especial | Distintivo |
| Frog | Recordatorio | Sonoro |
| Hero | Evento importante | Grandioso |
| Morse | Notificación | Rítmico |
| Sosumi | Alerta del sistema | Clásico |
| Tink | Completado | Ligero |

**Personalizar sonidos**

Modifica la sección `sounds` en la configuración:

```json
{
  "sounds": {
    "idle": "Ping",      // Tarea completada
    "error": "Blow",     // Error (más urgente)
    "permission": "Pop", // Solicitud de permiso (más ligero)
    "question": "Tink"   // Pregunta (opcional, usa el sonido de permission por defecto)
  }
}
```

**Deberías ver**:
- Después de modificar, diferentes tipos de eventos reproducirán los sonidos correspondientes
- Si no se configura `sounds.question`, se usará el sonido de `sounds.permission`

::: tip Nota
Los sonidos solo funcionan en macOS; Windows y Linux usan los sonidos de notificación predeterminados del sistema.
:::

---

### Paso 3: Especificar Manualmente el Tipo de Terminal

**¿Por qué?**

La biblioteca `detect-terminal` soporta más de 37 terminales, pero terminales poco comunes o versiones personalizadas pueden no ser reconocidos.

**Verificar el terminal detectado actualmente**

Actualmente no es posible ver directamente el resultado de la detección, pero puedes inferirlo a través de los logs:

```bash
# La interfaz de OpenCode mostrará los logs de inicio del plugin
```

Si ves algo como "Terminal detection failed" o las notificaciones no se enfocan correctamente, es posible que necesites especificar manualmente.

**Especificar terminal manualmente**

Agrega el campo `terminal` en la configuración:

```json
{
  "terminal": "wezterm" // Usa el nombre en minúsculas del terminal
}
```

**Nombres de terminales soportados**

Nombres comunes de terminales (no distinguen mayúsculas/minúsculas):

| Terminal | Valor de Configuración |
| --- | --- |
| Ghostty | `"ghostty"` |
| Kitty | `"kitty"` |
| iTerm2 | `"iterm"` o `"iterm2"` |
| WezTerm | `"wezterm"` |
| Alacritty | `"alacritty"` |
| Terminal de macOS | `"terminal"` o `"apple_terminal"` |
| Hyper | `"hyper"` |
| Terminal de VS Code | `"code"` o `"code-insiders"` |

**Deberías ver**:
- Después de especificar manualmente, la detección de enfoque de macOS y la función de enfoque al hacer clic funcionarán correctamente
- Si la especificación no es válida, el plugin fallará silenciosamente y volverá a la detección automática

---

### Paso 4: Silenciar Notificaciones Temporalmente

**¿Por qué?**

Durante reuniones, revisiones de código o períodos de enfoque, es posible que desees no recibir notificaciones temporalmente.

**Usar horas de silencio**

Si tienes períodos fijos todos los días (como por la noche) en los que no deseas ser interrumpido, configura las horas de silencio:

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00", // 10 PM
    "end": "08:00"    // 8 AM del día siguiente
  }
}
```

**Soporte para períodos que cruzan la medianoche**

Las horas de silencio pueden cruzar la medianoche (como 22:00-08:00):

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00" // 22:00 - 08:00 del día siguiente
  }
}
```

**Deberías ver**:
- Durante las horas de silencio, ningún evento enviará notificaciones
- Fuera del período de silencio, las notificaciones vuelven a la normalidad

::: tip Nota
El formato de tiempo debe ser `HH:MM` (formato 24 horas), como `"22:30"`.
:::

---

### Paso 5: Equilibrar la Estrategia de Notificaciones

**¿Por qué?**

La configuración por defecto ya está optimizada, pero es posible que necesites ajustarla según tu flujo de trabajo.

**Resumen de la estrategia por defecto**

| Elemento de Configuración | Valor por Defecto | Efecto |
| --- | --- | --- |
| `notifyChildSessions` | `false` | Solo notificar sesiones padre |
| `quietHours.enabled` | `false` | No habilitar horas de silencio |

::: info Nota
La función de detección de enfoque (no notificar cuando el terminal está activo) está habilitada por código y no se puede desactivar mediante configuración.
:::

**Combinaciones de configuración recomendadas**

**Escenario 1: Mínima interrupción (por defecto)**

```json
{
  "notifyChildSessions": false
}
```

**Escenario 2: Rastrear todas las tareas**

```json
{
  "notifyChildSessions": true
}
```

::: warning Atención
Esto aumentará significativamente la frecuencia de notificaciones, adecuado para escenarios que requieren monitoreo detallado.
:::

**Escenario 3: Silencio nocturno**

```json
{
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**Deberías ver**:
- Según diferentes escenarios, el comportamiento de las notificaciones varía significativamente
- Ajusta gradualmente para encontrar la configuración que mejor se adapte a ti

---

## Punto de Verificación ✅

Después de completar la configuración, verifica lo siguiente:

| Elemento a Verificar | Método de Verificación |
| --- | --- |
| Filtrado de sesiones padre | Activa una tarea de IA con subtareas, deberías recibir solo una notificación "Ready for review" |
| Personalización de sonidos | Activa completado de tarea, error y solicitud de permiso por separado, deberías escuchar sonidos diferentes |
| Sobrescritura de terminal | En macOS, haz clic en la notificación, la ventana del terminal debería traerse al frente correctamente |
| Horas de silencio | Activa un evento durante las horas de silencio, no deberías recibir notificación |

---

## Advertencias de Problemas Comunes

### Los cambios de configuración no surten efecto

**Problema**: Después de modificar el archivo de configuración, el comportamiento de las notificaciones no cambia.

**Causa**: OpenCode puede necesitar reiniciar el plugin o OpenCode mismo.

**Solución**: Reinicia la CLI de OpenCode o la interfaz de OpenCode.

---

### Los sonidos no se reproducen

**Problema**: Configuraste sonidos personalizados, pero sigues escuchando los sonidos por defecto.

**Causa**:
- El nombre del sonido está mal escrito
- No estás en la plataforma macOS

**Solución**:
- Verifica que el nombre del sonido esté en la lista de soporte (distingue mayúsculas/minúsculas)
- Confirma que estás usando el sistema macOS

---

### La sobrescritura de terminal no funciona

**Problema**: Configuraste el campo `terminal`, pero al hacer clic en la notificación no se enfoca.

**Causa**:
- El nombre del terminal es incorrecto
- El nombre del proceso del terminal no coincide con el valor de configuración

**Solución**:
- Intenta con el nombre en minúsculas
- Consulta la lista de [Terminales Soportados](../../platforms/terminals/)

---

## Resumen de la Lección

En esta lección aprendiste el uso avanzado y las mejores prácticas de opencode-notify:

- **Filtrado de sesiones padre**: Por defecto solo se notifican las sesiones raíz, evitando el ruido de subtareas
- **Personalización de sonidos**: macOS permite personalizar 14 sonidos para distinguir tipos de eventos
- **Sobrescritura de terminal**: Especifica manualmente el tipo de terminal para resolver problemas de detección automática
- **Silencio temporal**: Configura horas de silencio mediante `quietHours`
- **Equilibrio de estrategias**: Ajusta la configuración según tu flujo de trabajo, equilibrando prontitud e interrupciones

**Principio central**: Reducir el ruido, aumentar el valor. La configuración por defecto ya está optimizada y en la mayoría de los casos no necesita modificarse.

---

## Próxima Lección

> En la próxima lección aprenderemos **[Solución de Problemas](../../faq/troubleshooting/)**.
>
> Aprenderás:
> - Qué hacer si las notificaciones no aparecen
> - Cómo diagnosticar fallas en la detección de enfoque
> - Interpretación de mensajes de error comunes
> - Soluciones específicas por plataforma

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-27

| Función | Ruta del Archivo | Números de Línea |
| --- | --- | --- |
| Detección de sesiones padre | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L205-L214) | 205-214 |
| Schema de configuración | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L68) | 30-68 |
| Configuración por defecto | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| Lista de sonidos de macOS | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L81) | 81 |

</details>

**Constantes clave**:
- `DEFAULT_CONFIG`: Valores de configuración por defecto
- `TERMINAL_PROCESS_NAMES`: Tabla de mapeo de nombres de terminal a nombres de proceso de macOS

**Funciones clave**:
- `isParentSession()`: Determina si una sesión es una sesión padre
- `loadConfig()`: Carga y fusiona la configuración del usuario
