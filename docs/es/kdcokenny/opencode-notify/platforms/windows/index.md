---
title: "Guía de Uso en Windows: Notificaciones Nativas, Detección de Terminal y Configuración Detallada | Tutorial de opencode-notify"
sidebarTitle: "Usar Notificaciones en Windows"
subtitle: "Características de la Plataforma Windows: Notificaciones Nativas y Detección de Terminal"
description: "Aprende las funciones y limitaciones de opencode-notify en la plataforma Windows. Domina las notificaciones nativas de Windows y la capacidad de detección de terminal, comprende las diferencias de funciones con la plataforma macOS, configura la mejor estrategia de notificaciones para mejorar la eficiencia, evita interrupciones de notificaciones y mantén un estado de trabajo enfocado."
tags:
  - "Windows"
  - "Características de Plataforma"
  - "Detección de Terminal"
prerequisite:
  - "start-quick-start"
order: 40
---

# Características de la Plataforma Windows: Notificaciones Nativas y Detección de Terminal

## Qué Podrás Hacer Después de Este Tutorial

- Comprender las funciones compatibles de opencode-notify en la plataforma Windows
- Dominar el funcionamiento de la detección de terminal en Windows
- Entender las diferencias de funciones con la plataforma macOS
- Configurar una estrategia de notificaciones adecuada para Windows

## Tu Situación Actual

Estás usando OpenCode en Windows y descubres que algunas funciones no son tan inteligentes como en macOS. Las notificaciones siguen apareciendo cuando el terminal está enfocado, y hacer clic en las notificaciones no te devuelve a la ventana del terminal. ¿Es esto normal? ¿Cuáles son las limitaciones de la plataforma Windows?

## Cuándo Usar Esta Guía

**Conoce las características de la plataforma Windows en los siguientes escenarios**:
- Estás usando opencode-notify en un sistema Windows
- Descubres que algunas funciones de macOS no están disponibles en Windows
- Quieres saber cómo aprovechar al máximo las funciones disponibles en la plataforma Windows

## Concepto Central

opencode-notify proporciona **capacidades de notificación básicas** en la plataforma Windows, pero tiene algunas limitaciones de funciones en comparación con macOS. Esto está determinado por las características del sistema operativo, no es un problema del plugin.

::: info ¿Por Qué macOS Tiene Funciones Más Avanzadas?

macOS proporciona APIs de sistema más potentes:
- NSUserNotificationCenter admite enfoque al hacer clic
- AppleScript puede detectar la aplicación en primer plano
- La API de sonidos del sistema permite sonidos personalizados

Las APIs de notificaciones del sistema de Windows y Linux son relativamente básicas; opencode-notify utiliza `node-notifier` para invocar las notificaciones nativas del sistema en estas plataformas.
:::

## Resumen de Funciones de la Plataforma Windows

| Función | Windows | Descripción |
| --- | --- | --- |
| **Notificaciones Nativas** | ✅ Compatible | Envía notificaciones a través de Windows Toast |
| **Detección de Terminal** | ✅ Compatible | Identifica automáticamente 37+ emuladores de terminal |
| **Detección de Enfoque** | ❌ No Compatible | No puede detectar si el terminal es la ventana en primer plano |
| **Enfoque al Hacer Clic** | ❌ No Compatible | Hacer clic en la notificación no cambia al terminal |
| **Sonidos Personalizados** | ❌ No Compatible | Usa el sonido de notificación predeterminado del sistema |

### Mecanismo de Notificaciones de Windows

opencode-notify utiliza notificaciones **Windows Toast** en Windows, invocando la API nativa del sistema a través de la biblioteca `node-notifier`.

**Momentos de Activación de Notificaciones**:
- Cuando se completa una tarea de IA (session.idle)
- Cuando ocurre un error en la ejecución de IA (session.error)
- Cuando la IA necesita permisos (permission.updated)
- Cuando la IA hace una pregunta (tool.execute.before)

::: tip Características de las Notificaciones Windows Toast
- Las notificaciones aparecen en la esquina inferior derecha de la pantalla
- Desaparecen automáticamente (aproximadamente 5 segundos)
- Usan el sonido de notificación predeterminado del sistema
- Hacer clic en la notificación abre el centro de notificaciones (no cambia al terminal)
:::

## Detección de Terminal

### Identificación Automática de Terminal

opencode-notify utiliza la biblioteca `detect-terminal` para detectar automáticamente el emulador de terminal que estás usando.

**Terminales Compatibles con Windows**:
- Windows Terminal (recomendado)
- Git Bash
- ConEmu
- Cmder
- PowerShell
- Terminal integrado de VS Code

::: details Principio de Detección de Terminal
Cuando se inicia el plugin, `detect-terminal()` escanea los procesos del sistema para identificar el tipo de terminal actual.

Ubicación del código fuente: `src/notify.ts:145-147`

```typescript
async function detectTerminalInfo(config: NotifyConfig): Promise<TerminalInfo> {
	const terminalName = config.terminal || detectTerminal() || null
	
	if (!terminalName) {
		return { name: null, bundleId: null, processName: null }
	}
	
	return {
		name: terminalName,
		bundleId: null,  // Windows no necesita bundleId
		processName: null,  // Windows no necesita nombre de proceso
	}
}
```
:::

### Especificación Manual de Terminal

Si la detección automática falla, puedes especificar manualmente el tipo de terminal en el archivo de configuración.

**Ejemplo de Configuración**:

```json
{
  "terminal": "Windows Terminal"
}
```

**Nombres de Terminal Disponibles**: Consulta la [lista de terminales compatibles con detect-terminal](https://github.com/jonschlinkert/detect-terminal#supported-terminals).

## Comparación de Funciones entre Plataformas

| Función | macOS | Windows | Linux |
| --- | --- | --- | --- |
| **Notificaciones Nativas** | ✅ Centro de Notificaciones | ✅ Toast | ✅ notify-send |
| **Sonidos Personalizados** | ✅ Lista de sonidos del sistema | ❌ Predeterminado del sistema | ❌ Predeterminado del sistema |
| **Detección de Enfoque** | ✅ API AppleScript | ❌ No Compatible | ❌ No Compatible |
| **Enfoque al Hacer Clic** | ✅ Activar bundleId | ❌ No Compatible | ❌ No Compatible |
| **Detección de Terminal** | ✅ 37+ terminales | ✅ 37+ terminales | ✅ 37+ terminales |

### ¿Por Qué Windows No Admite Detección de Enfoque?

En el código fuente, la función `isTerminalFocused()` devuelve directamente `false` en Windows:

```typescript
// src/notify.ts:166-168
async function isTerminalFocused(terminalInfo: TerminalInfo): Promise<boolean> {
	if (!terminalInfo.processName) return false
	if (process.platform !== "darwin") return false  // ← Windows/Linux devuelven false directamente
	// ... Lógica de detección de enfoque de macOS
}
```

**Razones**:
- Windows no proporciona una API similar a AppleScript de macOS para consultar la aplicación en primer plano
- Windows PowerShell puede obtener la ventana en primer plano, pero requiere llamar a interfaces COM, lo cual es complejo de implementar
- La versión actual prioriza la estabilidad, por lo que la detección de enfoque de Windows aún no está implementada

### ¿Por Qué Windows No Admite Enfoque al Hacer Clic?

En el código fuente, la función `sendNotification()` solo establece la opción `activate` en macOS:

```typescript
// src/notify.ts:238-240
// Específico de macOS: hacer clic en la notificación para enfocar el terminal
if (process.platform === "darwin" && terminalInfo.bundleId) {
	notifyOptions.activate = terminalInfo.bundleId
}
```

**Razones**:
- Windows Toast no admite el parámetro `activate`
- Las notificaciones de Windows solo pueden asociarse a través del ID de aplicación, no pueden especificar dinámicamente la ventana de destino
- Hacer clic en la notificación abre el centro de notificaciones, en lugar de enfocar una ventana específica

## Mejores Prácticas para la Plataforma Windows

### Recomendaciones de Configuración

Dado que Windows no admite detección de enfoque, se recomienda ajustar la configuración para reducir el ruido de notificaciones.

**Configuración Recomendada**:

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

**Descripción de la Configuración**:
- `notifyChildSessions: false` - Solo notificar sesiones padre, evitar ruido de tareas secundarias
- `quietHours.enabled: true` - Habilitar período de silencio, evitar interrupciones nocturnas

### Opciones de Configuración No Compatibles

Las siguientes opciones de configuración no tienen efecto en Windows:

| Opción de Configuración | Efecto en macOS | Efecto en Windows |
| --- | --- | --- |
| `sounds.idle` | Reproduce sonido Glass | Usa sonido predeterminado del sistema |
| `sounds.error` | Reproduce sonido Basso | Usa sonido predeterminado del sistema |
| `sounds.permission` | Reproduce sonido Submarine | Usa sonido predeterminado del sistema |

### Consejos de Uso

**Consejo 1: Desactivar Notificaciones Manualmente**

Si estás revisando el terminal y no quieres ser interrumpido:

1. Haz clic en el icono del "Centro de Acciones" en la barra de tareas (Windows + A)
2. Desactiva las notificaciones de opencode-notify

**Consejo 2: Usar Período de Silencio**

Configura horarios de trabajo y descanso para evitar ser interrumpido fuera del horario laboral:

```json
{
  "quietHours": {
    "enabled": true,
    "start": "18:00",
    "end": "09:00"
  }
}
```

**Consejo 3: Desactivar el Plugin Temporalmente**

Si necesitas desactivar completamente las notificaciones, puedes eliminar el archivo de configuración o configurar el período de silencio para todo el día:

```json
{
  "quietHours": {
    "enabled": true,
    "start": "00:00",
    "end": "23:59"
  }
}
```

## Sígueme Paso a Paso

### Verificar Notificaciones de Windows

**Paso 1: Activar Notificación de Prueba**

Ingresa una tarea simple en OpenCode:

```
Por favor, calcula el resultado de 1+1.
```

**Deberías Ver**:
- Aparece una notificación Windows Toast en la esquina inferior derecha
- El título de la notificación es "Ready for review"
- Se reproduce el sonido de notificación predeterminado del sistema

**Paso 2: Probar Supresión de Enfoque (Verificar No Compatible)**

Mantén la ventana del terminal en primer plano y activa la tarea nuevamente.

**Deberías Ver**:
- La notificación sigue apareciendo (porque Windows no admite detección de enfoque)

**Paso 3: Probar Hacer Clic en la Notificación**

Haz clic en la notificación que aparece.

**Deberías Ver**:
- Se expande el centro de notificaciones, en lugar de cambiar a la ventana del terminal

### Configurar Período de Silencio

**Paso 1: Crear Archivo de Configuración**

Edita el archivo de configuración (PowerShell):

```powershell
notepad $env:USERPROFILE\.config\opencode\kdco-notify.json
```

**Paso 2: Agregar Configuración de Período de Silencio**

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**Paso 3: Guardar y Probar**

Espera a que la hora actual entre en el período de silencio, luego activa una tarea.

**Deberías Ver**:
- No aparece ninguna notificación (el período de silencio está activo)

## Puntos de Verificación ✅

Después de completar los pasos anteriores, por favor confirma:

- [ ] Las notificaciones Windows Toast se muestran correctamente
- [ ] La notificación muestra el título de tarea correcto
- [ ] La configuración del período de silencio está activa
- [ ] Comprendes las funciones no compatibles de la plataforma Windows

## Advertencias de Problemas Comunes

### Problema Común 1: Las Notificaciones No Se Muestran

**Causa**: Los permisos de notificación de Windows no han sido concedidos

**Solución**:

1. Abre "Configuración" → "Sistema" → "Notificaciones"
2. Asegúrate de que "Obtener notificaciones de aplicaciones y otros remitentes" esté activado
3. Encuentra OpenCode y asegúrate de que los permisos de notificación estén activados

### Problema Común 2: Falla en la Detección de Terminal

**Causa**: `detect-terminal` no puede identificar tu terminal

**Solución**:

Especifica manualmente el tipo de terminal en el archivo de configuración:

```json
{
  "terminal": "Windows Terminal"
}
```

### Problema Común 3: Los Sonidos Personalizados No Funcionan

**Causa**: La plataforma Windows no admite sonidos personalizados

**Explicación**: Esto es normal. Las notificaciones Windows Toast usan el sonido predeterminado del sistema y no se pueden cambiar a través del archivo de configuración.

### Problema Común 4: Hacer Clic en la Notificación No Enfoca el Terminal

**Causa**: Windows Toast no admite el parámetro `activate`

**Explicación**: Esta es una limitación de la API de Windows. Hacer clic en la notificación abre el centro de notificaciones; necesitas cambiar manualmente a la ventana del terminal.

## Resumen de Esta Lección

En esta lección hemos aprendido:

- ✅ La plataforma Windows admite notificaciones nativas y detección de terminal
- ✅ Windows no admite detección de enfoque ni enfoque al hacer clic
- ✅ Windows no admite sonidos personalizados
- ✅ Configuraciones recomendadas (período de silencio, solo notificar sesiones padre)
- ✅ Soluciones a problemas comunes

**Puntos Clave**:
1. Las funciones de la plataforma Windows son relativamente básicas, pero las capacidades de notificación principales están completas
2. La detección de enfoque y el enfoque al hacer clic son funciones exclusivas de macOS
3. A través de la configuración del período de silencio se puede reducir el ruido de notificaciones
4. La detección de terminal admite especificación manual, mejorando la compatibilidad

## Avance de la Próxima Lección

> En la próxima lección aprenderemos **[Características de la Plataforma Linux](../linux/)**.
>
> Aprenderás:
> - El mecanismo de notificaciones de la plataforma Linux (notify-send)
> - La capacidad de detección de terminal de Linux
> - Comparación de funciones con la plataforma Windows
> - Problemas de compatibilidad con distribuciones de Linux

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-27

| Función | Ruta del Archivo | Número de Línea |
| --- | --- | --- |
| Verificación de limitaciones de plataforma Windows (osascript) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L121-L133) | 121-133 |
| Verificación de limitaciones de plataforma Windows (detección de enfoque) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| Específico de macOS: enfoque al hacer clic | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| Envío de notificaciones (multiplataforma) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| Detección de terminal (multiplataforma) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| Carga de configuración (multiplataforma) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |

**Funciones Clave**:
- `runOsascript()`: Solo se ejecuta en macOS, devuelve null en Windows
- `isTerminalFocused()`: Devuelve false directamente en Windows
- `sendNotification()`: Solo establece el parámetro `activate` en macOS
- `detectTerminalInfo()`: Detección de terminal multiplataforma

**Verificación de Plataforma**:
- `process.platform === "darwin"`: macOS
- `process.platform === "win32"`: Windows
- `process.platform === "linux"`: Linux

</details>
