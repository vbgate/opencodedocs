---
title: "Guía de uso en Linux: Notificaciones notify-send y detección de terminal | Tutorial de opencode-notify"
sidebarTitle: "Notificaciones en Linux"
subtitle: "Características de la plataforma Linux: Notificaciones notify-send y detección de terminal"
description: "Aprende las funcionalidades y limitaciones de opencode-notify en Linux. Domina las notificaciones nativas de Linux y la detección de terminal, comprende las diferencias funcionales con macOS/Windows, configura estrategias de notificación adecuadas para Linux para mejorar la eficiencia, evita interrupciones y mantén el enfoque en el trabajo, resuelve problemas comunes de instalación de notify-send, visualización de notificaciones y configuración."
tags:
  - "Linux"
  - "Características de plataforma"
  - "Detección de terminal"
prerequisite:
  - "start-quick-start"
order: 50
---

# Características de la plataforma Linux: Notificaciones notify-send y detección de terminal

## Lo que podrás hacer tras completar esta lección

- Comprender las funcionalidades que opencode-notify soporta en la plataforma Linux
- Dominar cómo funcionan las notificaciones nativas de Linux y la detección de terminal
- Entender las diferencias funcionales con las plataformas macOS/Windows
- Configurar estrategias de notificación adecuadas para Linux

## Tu situación actual

Usas OpenCode en Linux y notas que algunas funcionalidades no son tan inteligentes como en macOS. Las notificaciones siguen apareciendo cuando la terminal está enfocada, y hacer clic en las notificaciones no te lleva de vuelta a la ventana de la terminal. ¿Es esto normal? ¿Qué limitaciones tiene la plataforma Linux?

## Cuándo usar esta técnica

**Comprende las características de la plataforma Linux en los siguientes escenarios**:
- Usas opencode-notify en un sistema Linux
- Descubres que algunas funcionalidades de macOS no están disponibles en Linux
- Quieres saber cómo maximizar el uso de las funcionalidades disponibles en la plataforma Linux

## Idea central

opencode-notify proporciona **capacidades básicas de notificación** en la plataforma Linux, pero tiene algunas limitaciones funcionales en comparación con macOS. Esto está determinado por las características del sistema operativo, no es un problema del complemento.

::: info ¿Por qué macOS tiene más funcionalidades?

macOS proporciona APIs del sistema más potentes:
- NSUserNotificationCenter soporta enfoque al hacer clic
- AppleScript puede detectar la aplicación en primer plano
- La API de efectos de sonido del sistema permite sonidos personalizados

Las APIs de notificación del sistema de Linux y Windows son relativamente básicas, opencode-notify en estas plataformas llama a las notificaciones nativas del sistema a través de `node-notifier`.
:::

## Resumen de funcionalidades de la plataforma Linux

| Funcionalidad | Linux | Descripción |
| --- | --- | --- |
| **Notificaciones nativas** | ✅ Soportado | Envía notificaciones a través de notify-send |
| **Detección de terminal** | ✅ Soportado | Reconoce automáticamente más de 37 emuladores de terminal |
| **Detección de enfoque** | ❌ No soportado | No puede detectar si la terminal es la ventana en primer plano |
| **Enfoque al hacer clic** | ❌ No soportado | Hacer clic en la notificación no cambia a la terminal |
| **Efectos de sonido personalizados** | ❌ No soportado | Usa el sonido de notificación predeterminado del sistema |

### Mecanismo de notificación en Linux

opencode-notify en Linux usa el comando **notify-send** para enviar notificaciones del sistema, llamando a la API nativa del sistema a través de la biblioteca `node-notifier`.

**Momentos de activación de notificaciones**:
- Cuando se completa una tarea de IA (session.idle)
- Cuando ocurre un error en la ejecución de IA (session.error)
- Cuando la IA necesita permisos (permission.updated)
- Cuando la IA hace una pregunta (tool.execute.before)

::: tip Características de las notificaciones notify-send
- Las notificaciones aparecen en la esquina superior derecha de la pantalla (GNOME/Ubuntu)
- Desaparecen automáticamente (aproximadamente 5 segundos)
- Usan el sonido de notificación predeterminado del sistema
- Hacer clic en la notificación abre el centro de notificaciones (no cambia a la terminal)
:::

## Detección de terminal

### Reconocimiento automático de terminal

opencode-notify usa la biblioteca `detect-terminal` para detectar automáticamente el emulador de terminal que estás usando.

**Terminales soportadas en Linux**:
- gnome-terminal (predeterminado en escritorio GNOME)
- konsole (escritorio KDE)
- xterm
- lxterminal (escritorio LXDE)
- alacritty
- kitty
- terminator
- guake
- tilix
- hyper
- Terminal integrada de VS Code
- Y más de 37 emuladores de terminal adicionales

::: details Principio de detección de terminal

Al iniciar el complemento, `detect-terminal()` escanea los procesos del sistema e identifica el tipo de terminal actual.

Ubicación del código fuente: `src/notify.ts:145-164`

La función `detectTerminalInfo()`:
1. Lee el campo `terminal` en la configuración (si se especificó manualmente)
2. Llama a `detectTerminal()` para detectar automáticamente el tipo de terminal
3. Obtiene el nombre del proceso (usado para detección de enfoque en macOS)
4. En macOS obtiene el bundle ID (usado para enfoque al hacer clic)

En la plataforma Linux, `bundleId` y `processName` serán `null`, ya que Linux no necesita esta información.
:::

### Especificar terminal manualmente

Si la detección automática falla, puedes especificar manualmente el tipo de terminal en el archivo de configuración.

**Ejemplo de configuración**:

```json
{
  "terminal": "gnome-terminal"
}
```

**Nombres de terminal disponibles**: Consulta la [lista de terminales soportadas por `detect-terminal`](https://github.com/jonschlinkert/detect-terminal#supported-terminals).

## Comparación de funcionalidades entre plataformas

| Funcionalidad | macOS | Windows | Linux |
| --- | --- | --- | --- |
| **Notificaciones nativas** | ✅ Notification Center | ✅ Toast | ✅ notify-send |
| **Efectos de sonido personalizados** | ✅ Lista de sonidos del sistema | ❌ Predeterminado del sistema | ❌ Predeterminado del sistema |
| **Detección de enfoque** | ✅ API de AppleScript | ❌ No soportado | ❌ No soportado |
| **Enfoque al hacer clic** | ✅ activate bundleId | ❌ No soportado | ❌ No soportado |
| **Detección de terminal** | ✅ Más de 37 terminales | ✅ Más de 37 terminales | ✅ Más de 37 terminales |

### ¿Por qué Linux no soporta detección de enfoque?

En el código fuente, la función `isTerminalFocused()` en Linux devuelve directamente `false`:

```typescript
// src/notify.ts:166-168
async function isTerminalFocused(terminalInfo: TerminalInfo): Promise<boolean> {
	if (!terminalInfo.processName) return false
	if (process.platform !== "darwin") return false  // ← Windows/Linux devuelven false directamente
	// ... lógica de detección de enfoque para macOS
}
```

**Razones**:
- Los entornos de escritorio de Linux son diversos (GNOME, KDE, XFCE, etc.), no hay una API unificada para consultar la aplicación en primer plano
- DBus de Linux puede obtener la ventana activa, pero la implementación es compleja y depende del entorno de escritorio
- La versión actual prioriza la estabilidad, la detección de enfoque en Linux aún no está implementada

### ¿Por qué Linux no soporta enfoque al hacer clic?

En el código fuente, la función `sendNotification()` solo establece la opción `activate` en macOS:

```typescript
// src/notify.ts:238-240
// macOS-specific: click notification to focus terminal
if (process.platform === "darwin" && terminalInfo.bundleId) {
	notifyOptions.activate = terminalInfo.bundleId
}
```

**Razones**:
- notify-send no soporta el parámetro `activate`
- Las notificaciones de Linux solo pueden asociarse mediante ID de aplicación, no pueden especificar dinámicamente la ventana objetivo
- Hacer clic en la notificación abre el centro de notificaciones, no enfoca una ventana específica

### ¿Por qué Linux no soporta efectos de sonido personalizados?

::: details Principio de configuración de efectos de sonido

En macOS, `sendNotification()` pasa el parámetro `sound` a la notificación del sistema:

```typescript
// src/notify.ts:227-243
function sendNotification(options: NotificationOptions): void {
	const { title, message, sound, terminalInfo } = options
	
	const notifyOptions: Record<string, unknown> = {
		title,
		message,
		sound,  // ← macOS acepta este parámetro
	}
	
	// macOS-specific: click notification to focus terminal
	if (process.platform === "darwin" && terminalInfo.bundleId) {
		notifyOptions.activate = terminalInfo.bundleId
	}
	
	notifier.notify(notifyOptions)
}
```

notify-send de Linux no soporta parámetros de sonido personalizados, por lo que la configuración `sounds` no tiene efecto en Linux.
:::

## Mejores prácticas para la plataforma Linux

### Recomendaciones de configuración

Dado que Linux no soporta detección de enfoque, se recomienda ajustar la configuración para reducir el ruido de las notificaciones.

**Configuración recomendada**:

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

**Explicación de la configuración**:
- `notifyChildSessions: false` - Solo notifica sesiones padre, evita ruido de subtareas
- `quietHours.enabled: true` - Activa horario silencioso, evita interrupciones nocturnas

### Opciones de configuración no soportadas

Las siguientes opciones de configuración no tienen efecto en Linux:

| Opción de configuración | Efecto en macOS | Efecto en Linux |
| --- | --- | --- |
| `sounds.idle` | Reproduce efecto de sonido Glass | Usa sonido predeterminado del sistema |
| `sounds.error` | Reproduce efecto de sonido Basso | Usa sonido predeterminado del sistema |
| `sounds.permission` | Reproduce efecto de sonido Submarine | Usa sonido predeterminado del sistema |

### Consejos de uso

**Consejo 1: Cerrar notificaciones manualmente**

Si estás viendo la terminal y no quieres ser interrumpido:

1. Haz clic en el ícono de notificación en la esquina superior derecha de la pantalla
2. Cierra las notificaciones de opencode-notify

**Consejo 2: Usar horario silencioso**

Configura horarios de trabajo y descanso, evita interrupciones fuera del horario laboral:

```json
{
  "quietHours": {
    "enabled": true,
    "start": "18:00",
    "end": "09:00"
  }
}
```

**Consejo 3: Deshabilitar temporalmente el complemento**

Si necesitas deshabilitar completamente las notificaciones, se recomienda usar la configuración `quietHours` para establecer silencio todo el día, o eliminar/renombrar el archivo de configuración para deshabilitar el complemento.

**Consejo 4: Configurar el sonido de notificación del sistema**

Aunque opencode-notify no soporta efectos de sonido personalizados, puedes cambiar el sonido de notificación predeterminado en la configuración del sistema:

- **GNOME**: Configuración → Sonido → Sonido de alerta
- **KDE**: Configuración del sistema → Notificaciones → Sonido predeterminado
- **XFCE**: Configuración → Apariencia → Notificaciones → Sonido

## Manos a la obra

### Verificar notificaciones en Linux

**Paso 1: Activar notificación de prueba**

En OpenCode, ingresa una tarea simple:

```
Por favor calcula el resultado de 1+1.
```

**Deberías ver**:
- Una notificación notify-send aparece en la esquina superior derecha de la pantalla (GNOME/Ubuntu)
- El título de la notificación es "Ready for review"
- Se reproduce el sonido de notificación predeterminado del sistema

**Paso 2: Probar supresión de enfoque (verificar que no está soportado)**

Mantén la ventana de la terminal en primer plano y activa otra tarea.

**Deberías ver**:
- La notificación sigue apareciendo (porque Linux no soporta detección de enfoque)

**Paso 3: Probar clic en notificación**

Haz clic en la notificación que aparece.

**Deberías ver**:
- El centro de notificaciones se expande, en lugar de cambiar a la ventana de la terminal

### Configurar horario silencioso

**Paso 1: Crear archivo de configuración**

Edita el archivo de configuración (bash):

```bash
nano ~/.config/opencode/kdco-notify.json
```

**Paso 2: Agregar configuración de horario silencioso**

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**Paso 3: Guardar y probar**

Espera a que la hora actual entre en el horario silencioso, luego activa una tarea.

**Deberías ver**:
- No aparece notificación (horario silencioso en efecto)

## Punto de verificación ✅

Después de completar los pasos anteriores, confirma:

- [ ] Las notificaciones notify-send se muestran correctamente
- [ ] La notificación muestra el título correcto de la tarea
- [ ] La configuración de horario silencioso está en efecto
- [ ] Comprendes las funcionalidades no soportadas en la plataforma Linux

## Errores comunes

### Problema común 1: Las notificaciones no se muestran

**Causa 1**: notify-send no está instalado

**Solución**:

```bash
# Ubuntu/Debian
sudo apt install libnotify-bin

# Fedora/RHEL
sudo dnf install libnotify

# Arch Linux
sudo pacman -S libnotify
```

**Causa 2**: No se han otorgado permisos de notificación en Linux

**Solución**:

1. Abre la configuración del sistema
2. Encuentra "Notificaciones" o "Privacidad" → "Notificaciones"
3. Asegúrate de que "Permitir que las aplicaciones envíen notificaciones" esté habilitado
4. Encuentra OpenCode y asegúrate de que los permisos de notificación estén activados

### Problema común 2: Falla la detección de terminal

**Causa**: `detect-terminal` no puede reconocer tu terminal

**Solución**:

Especifica manualmente el tipo de terminal en el archivo de configuración:

```json
{
  "terminal": "gnome-terminal"
}
```

### Problema común 3: Los efectos de sonido personalizados no funcionan

**Causa**: La plataforma Linux no soporta efectos de sonido personalizados

**Explicación**: Esto es normal. notify-send usa el sonido predeterminado del sistema, no se puede cambiar a través del archivo de configuración.

**Solución**: Cambia el sonido de notificación predeterminado en la configuración del sistema.

### Problema común 4: Hacer clic en la notificación no enfoca la terminal

**Causa**: notify-send no soporta el parámetro `activate`

**Explicación**: Esta es una limitación de la API de Linux. Hacer clic en la notificación abre el centro de notificaciones, necesitas cambiar manualmente a la ventana de la terminal.

### Problema común 5: Diferencias en el comportamiento de notificaciones entre entornos de escritorio

**Fenómeno**: En diferentes entornos de escritorio (GNOME, KDE, XFCE), la posición de visualización y el comportamiento de las notificaciones pueden ser diferentes.

**Explicación**: Esto es normal, cada entorno de escritorio tiene su propia implementación del sistema de notificaciones.

**Solución**: Según el entorno de escritorio que uses, ajusta el comportamiento de las notificaciones en la configuración del sistema.

## Resumen de esta lección

En esta lección aprendimos:

- ✅ La plataforma Linux soporta notificaciones nativas y detección de terminal
- ✅ Linux no soporta detección de enfoque ni enfoque al hacer clic
- ✅ Linux no soporta efectos de sonido personalizados
- ✅ Configuración recomendada (horario silencioso, solo notificar sesiones padre)
- ✅ Soluciones a problemas comunes

**Puntos clave**:
1. Las funcionalidades de la plataforma Linux son relativamente básicas, pero las capacidades de notificación principales están completas
2. La detección de enfoque y el enfoque al hacer clic son funcionalidades exclusivas de macOS
3. La configuración de horario silencioso puede reducir el ruido de las notificaciones
4. La detección de terminal soporta especificación manual, mejorando la compatibilidad
5. notify-send necesita ser instalado previamente (algunas distribuciones lo incluyen por defecto)

## Avance de la próxima lección

> En la próxima lección aprenderemos **[Terminales soportadas](../terminals/)**.
>
> Aprenderás:
> - Lista de más de 37 terminales soportadas por opencode-notify
> - Mecanismos de detección para diferentes terminales
> - Métodos de configuración para sobrescribir el tipo de terminal
> - Consejos de uso de la terminal integrada de VS Code

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-27

| Funcionalidad | Ruta del archivo | Número de línea |
| --- | --- | --- |
| Verificación de limitaciones de plataforma Linux (osascript) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L121-L133) | 121-133 |
| Verificación de limitaciones de plataforma Linux (detección de enfoque) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| Específico de macOS: enfoque al hacer clic | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| Envío de notificación (multiplataforma) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| Detección de terminal (multiplataforma) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| Carga de configuración (multiplataforma) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |

**Funciones clave**:
- `runOsascript()`: Solo se ejecuta en macOS, Linux devuelve null
- `isTerminalFocused()`: Linux devuelve false directamente
- `sendNotification()`: Solo establece el parámetro `activate` en macOS
- `detectTerminalInfo()`: Detección de terminal multiplataforma

**Determinación de plataforma**:
- `process.platform === "darwin"`: macOS
- `process.platform === "win32"`: Windows
- `process.platform === "linux"`: Linux

**Dependencias de notificación en Linux**:
- Dependencia externa: `node-notifier` → comando `notify-send`
- Requisitos del sistema: libnotify-bin o paquete equivalente

</details>
