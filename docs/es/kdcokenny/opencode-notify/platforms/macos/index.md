---
title: "Características de macOS: Detección de Foco, Clic para Enfocar y Sonidos Personalizados | opencode-notify"
sidebarTitle: "Clic en Notificación para Volver al Terminal"
subtitle: "Características de la Plataforma macOS"
description: "Aprende las funciones exclusivas de opencode-notify en macOS: detección inteligente de foco para evitar notificaciones duplicadas, clic en notificación para enfocar automáticamente el terminal y 12 sonidos integrados personalizables. Este tutorial explica en detalle la configuración, la lista de sonidos disponibles y consejos prácticos para ayudarte a aprovechar al máximo las capacidades de notificaciones nativas de macOS, mejorar tu productividad y reducir cambios de ventana innecesarios."
tags:
  - "Características de Plataforma"
  - "macOS"
  - "Detección de Foco"
prerequisite:
  - "start-quick-start"
order: 30
---

# Características de la Plataforma macOS

## Lo Que Aprenderás

- ✅ Configurar detección inteligente de foco, para que el plugin sepa cuándo estás viendo el terminal
- ✅ Clic en notificación para enfocar automáticamente la ventana del terminal
- ✅ Personalizar sonidos de notificación para diferentes eventos
- ✅ Comprender las ventajas y limitaciones exclusivas de la plataforma macOS

## Tu Situación Actual

Cuando usas OpenCode, a menudo cambias de ventana: la IA ejecuta tareas en segundo plano, cambias al navegador para buscar información, y cada pocos segundos tienes que volver a verificar: ¿la tarea ha terminado? ¿Ha ocurrido un error? ¿Está esperando tu entrada?

Si hubiera una notificación de escritorio nativa sería perfecto, como cuando recibes un mensaje de WeChat, que te avise cuando la IA complete una tarea o te necesite.

## Cuándo Usar Esta Función

- **Usas OpenCode en macOS** - El contenido de esta lección solo aplica a macOS
- **Quieres optimizar tu flujo de trabajo** - Evitar cambiar frecuentemente de ventana para verificar el estado de la IA
- **Deseas una mejor experiencia de notificación** - Aprovechar las ventajas de las notificaciones nativas de macOS

::: info ¿Por qué macOS es más potente?
La plataforma macOS ofrece capacidades completas de notificación: detección de foco, clic para enfocar y sonidos personalizados. Windows y Linux actualmente solo admiten funciones básicas de notificación nativa.
:::

## 🎒 Preparación Antes de Comenzar

Antes de comenzar, asegúrate de haber completado:

::: warning Verificación Prerrequisitos
- [ ] Has completado el tutorial de [Inicio Rápido](../../start/quick-start/)
- [ ] El plugin está instalado y funcionando correctamente
- [ ] Estás usando el sistema macOS
:::

## Idea Central

La experiencia completa de notificación en macOS se basa en tres capacidades clave:

### 1. Detección Inteligente de Foco

El plugin sabe si actualmente estás viendo la ventana del terminal. Si estás revisando la salida de la IA, no enviará notificaciones para no molestarte. Solo cuando cambias a otra aplicación se enviarán las notificaciones.

**Principio de implementación**: A través del servicio del sistema `osascript` de macOS, consulta el nombre del proceso de la aplicación en primer plano y lo compara con el nombre del proceso de tu terminal.

### 2. Clic en Notificación para Enfocar Terminal

Después de recibir una notificación, haz clic directamente en la tarjeta de notificación y la ventana del terminal se pondrá automáticamente en primer plano. Puedes volver al estado de trabajo inmediatamente.

**Principio de implementación**: macOS Notification Center admite la opción `activate`, pasando el Bundle ID de la aplicación se puede lograr el clic para enfocar.

### 3. Sonidos Personalizados

Configura diferentes sonidos para diferentes tipos de eventos: sonidos claros para tareas completadas, sonidos graves para errores, para que puedas tener una idea general de la situación sin mirar la notificación.

**Principio de implementación**: Utiliza los 14 sonidos estándar integrados en el sistema macOS (como Glass, Basso, Submarine), especificando en el campo `sounds` del archivo de configuración.

::: tip Colaboración de las Tres Capacidades
Detección de foco evita molestias → Clic en notificación para regreso rápido → Sonidos para distinguir rápidamente tipos de eventos
:::

## Sígueme

### Paso 1: Verificar la Detección Automática del Terminal

El plugin detectará automáticamente el emulador de terminal que estás usando al iniciarse. Verifiquemos si se ha identificado correctamente.

**Por qué**

El plugin necesita saber cuál es tu terminal para implementar las funciones de detección de foco y clic para enfocar.

**Operación**

1. Abre tu directorio de configuración de OpenCode:
   ```bash
   ls ~/.config/opencode/
   ```

2. Si ya has creado el archivo de configuración `kdco-notify.json`, verifica si tiene el campo `terminal`:
   ```bash
   cat ~/.config/opencode/kdco-notify.json
   ```

3. Si el archivo de configuración no tiene el campo `terminal`, significa que el plugin está usando detección automática.

**Lo Que Deberías Ver**

Si el archivo de configuración no tiene el campo `terminal`, el plugin detectará automáticamente. Los terminales soportados incluyen:
- **Terminales comunes**: Ghostty, Kitty, iTerm2, WezTerm, Alacritty
- **Terminal del sistema**: Terminal.app incluido con macOS
- **Otros terminales**: Hyper, Warp, Terminal integrado de VS Code, etc.

::: info Soporte para 37+ Terminales
El plugin usa la biblioteca `detect-terminal`, que soporta 37+ emuladores de terminal. Si tu terminal no está en la lista común, también intentará identificarlo automáticamente.
:::

### Paso 2: Configurar Sonidos Personalizados

macOS proporciona 14 sonidos integrados, puedes asignar diferentes sonidos para diferentes eventos.

**Por qué**

Diferentes sonidos te permiten tener una idea general de lo que sucede sin mirar la notificación: ¿tarea completada o error?, ¿la IA está esperando o simplemente completó la tarea?

**Operación**

1. Abre o crea el archivo de configuración:
   ```bash
   nano ~/.config/opencode/kdco-notify.json
   ```

2. Agrega o modifica la configuración `sounds`:

```json
{
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  }
}
```

3. Guarda y sal (Ctrl+O, Enter, Ctrl+X)

**Lo Que Deberías Ver**

El campo `sounds` en el archivo de configuración tiene cuatro opciones:

| Campo | Función | Valor por Defecto | Configuración Recomendada |
| --- | --- | --- | --- |
| `idle` | Sonido de tarea completada | Glass | Glass (claro) |
| `error` | Sonido de notificación de error | Basso | Basso (grave) |
| `permission` | Sonido de solicitud de permiso | Submarine | Submarine (recordatorio) |
| `question` | Sonido de pregunta de IA (opcional) | permission | Purr (suave) |

::: tip Combinación Recomendada
Esta combinación predeterminada es intuitiva: sonidos alegres para completar, sonidos de advertencia para errores, sonidos de recordatorio para solicitudes de permiso.
:::

### Paso 3: Conocer la Lista de Sonidos Disponibles

macOS tiene 14 sonidos integrados, puedes combinarlos libremente.

**Por qué**

Conocer todos los sonidos disponibles te ayuda a encontrar la combinación más adecuada para tus hábitos de trabajo.

**Sonidos Disponibles**

| Nombre del Sonido | Características Auditivas | Escenario Aplicable |
| --- | --- | --- |
| Glass | Alegre, claro | Tarea completada |
| Basso | Grave, advertencia | Notificación de error |
| Submarine | Recordatorio, suave | Solicitud de permiso |
| Blow | Potente | Evento importante |
| Bottle | Claro | Subtarea completada |
| Frog | Relajado | Recordatorio informal |
| Funk | Rítmico | Múltiples tareas completadas |
| Hero | Majestuoso | Hito completado |
| Morse | Código Morse | Relacionado con depuración |
| Ping | Claro | Recordatorio ligero |
| Pop | Corto | Tarea rápida |
| Purr | Suave | Recordatorio no intrusivo |
| Sosumi | Distintivo | Evento especial |
| Tink | Claro | Pequeña tarea completada |

::: tip Identificación por Sonido
Después de configurar, prueba diferentes combinaciones de sonidos para encontrar la configuración más adecuada para tu flujo de trabajo.
:::

### Paso 4: Probar la Función de Clic para Enfocar

Después de hacer clic en la notificación, la ventana del terminal se pondrá automáticamente en primer plano. Esta es una función exclusiva de macOS.

**Por qué**

Cuando recibes una notificación, no necesitas cambiar manualmente al terminal y buscar la ventana, haz clic en la notificación para volver directamente al estado de trabajo.

**Operación**

1. Asegúrate de que OpenCode esté ejecutándose e inicia una tarea de IA
2. Cambia a otra aplicación (como el navegador)
3. Espera a que la tarea de IA se complete, recibirás una notificación "Ready for review"
4. Haz clic en la tarjeta de notificación

**Lo Que Deberías Ver**

- La notificación desaparece
- La ventana del terminal se pone automáticamente en primer plano y obtiene el foco
- Puedes revisar inmediatamente la salida de la IA

::: info Principio de Enfoque
El plugin obtiene dinámicamente el Bundle ID de la aplicación del terminal a través de osascript, luego pasa la opción `activate` al enviar la notificación. macOS Notification Center recibe esta opción y activará automáticamente la aplicación correspondiente al hacer clic en la notificación.
:::

### Paso 5: Verificar la Función de Detección de Foco

Cuando estás viendo el terminal, no recibirás notificaciones. Esto evita recordatorios duplicados.

**Por qué**

Si ya estás viendo el terminal, la notificación es redundante. Solo cuando cambias a otra aplicación tiene sentido la notificación.

**Operación**

1. Abre OpenCode, inicia una tarea de IA
2. Mantén la ventana del terminal en primer plano (no cambies)
3. Espera a que la tarea se complete

**Lo Que Deberías Ver**

- No recibes la notificación "Ready for review"
- El terminal muestra que la tarea se ha completado

**Luego Prueba**:

1. Inicia otra tarea de IA
2. Cambia al navegador u otra aplicación
3. Espera a que la tarea se complete

**Lo Que Deberías Ver**

- Recibiste la notificación "Ready for review"
- Se reproduce el sonido configurado (Glass por defecto)

::: tip Lo Inteligente de la Detección de Foco
El plugin sabe cuándo estás viendo el terminal y cuándo no. Esto evita perder recordatorios importantes y también evita ser molestado por notificaciones duplicadas.
:::

## Punto de Control ✅

### Verificación de Configuración

- [ ] El archivo de configuración `~/.config/opencode/kdco-notify.json` existe
- [ ] El campo `sounds` está configurado (contiene al menos idle, error, permission)
- [ ] No hay campo `terminal` configurado (usa detección automática)

### Verificación de Funciones

- [ ] Puedes recibir notificaciones después de que la tarea de IA se complete
- [ ] La ventana del terminal se pone en primer plano después de hacer clic en la notificación
- [ ] No recibes notificaciones duplicadas cuando la ventana del terminal está en primer plano
- [ ] Diferentes tipos de eventos reproducen diferentes sonidos

::: danger ¿La Detección de Foco No Funciona?
Si después de hacer clic en la notificación el terminal no se pone en primer plano, podría ser:
1. La aplicación del terminal no se reconoció correctamente - verifica el campo `terminal` en el archivo de configuración
2. Falló la obtención del Bundle ID - revisa la información de error en los logs de OpenCode
:::

## Advertencias de Problemas Comunes

### El Sonido No Se Reproduce

**Problema**: Configuraste el sonido, pero no hay sonido al recibir notificaciones

**Posibles Causas**:
1. El volumen del sistema está muy bajo o silenciado
2. Los sonidos de notificación están deshabilitados en las preferencias del sistema de macOS

**Solución**:
1. Verifica el volumen del sistema y la configuración de notificaciones
2. Abre "Configuración del Sistema → Notificaciones → OpenCode", asegúrate de que el sonido esté habilitado

### Clic en Notificación No Enfoca

**Problema**: Después de hacer clic en la notificación, la ventana del terminal no se pone en primer plano

**Posibles Causas**:
1. La aplicación del terminal no se detectó automáticamente
2. Falló la obtención del Bundle ID

**Solución**:
1. Especifica manualmente el tipo de terminal:
   ```json
   {
     "terminal": "ghostty"  // u otro nombre de terminal
   }
   ```

2. Asegúrate de que el nombre de la aplicación del terminal sea correcto (sensible a mayúsculas y minúsculas)

### La Detección de Foco No Funciona

**Problema**: Incluso cuando el terminal está en primer plano, sigues recibiendo notificaciones

**Posibles Causas**:
1. Falló la detección del nombre del proceso del terminal
2. La aplicación del terminal no está en la lista de detección automática

**Solución**:
1. Especifica manualmente el tipo de terminal:
   ```json
   {
     "terminal": "ghostty"  // u otro nombre de terminal
   }
   ```

2. Asegúrate de que el nombre de la aplicación del terminal sea correcto (sensible a mayúsculas y minúsculas)
3. Revisa los logs para confirmar si el terminal se reconoció correctamente

## Resumen de Esta Lección

La plataforma macOS proporciona una experiencia completa de notificación:

| Función | Función | Soporte de Plataforma |
| --- | --- | --- |
| Notificación Nativa | Mostrar notificaciones a nivel de sistema | ✅ macOS<br>✅ Windows<br>✅ Linux |
| Sonidos Personalizados | Diferentes sonidos para diferentes eventos | ✅ macOS |
| Detección de Foco | Evitar notificaciones duplicadas | ✅ macOS |
| Clic para Enfocar | Regreso rápido al trabajo | ✅ macOS |

**Configuración Principal**:
```json
{
  "sounds": {
    "idle": "Glass",       // Tarea completada
    "error": "Basso",      // Error
    "permission": "Submarine"  // Solicitud de permiso
  }
}
```

**Flujo de Trabajo**:
1. La IA completa la tarea → Envía notificación → Reproduce sonido Glass
2. Estás trabajando en el navegador → Recibes notificación → Haces clic
3. El terminal se pone automáticamente en primer plano → Revisas la salida de la IA

## Próxima Lección

> En la próxima lección aprenderemos **[Características de la Plataforma Windows](../windows/)**.
>
> Aprenderás:
> - Qué funciones admite la plataforma Windows
> - Qué diferencias hay en comparación con macOS
> - Cómo configurar notificaciones en Windows

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de Actualización: 2026-01-27

| Función | Ruta del Archivo | Número de Línea |
| --- | --- | --- |
| Detección de Foco | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| Clic para Enfocar | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| Obtención de Bundle ID | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L135-L137) | 135-137 |
| Detección de Aplicación en Primer Plano | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L139-L143) | 139-143 |
| Mapeo de Nombres de Terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| Configuración de Sonidos por Defecto | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L59-L61) | 59-61 |
| Lista de Sonidos de macOS | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L81) | 81 |
| Tabla Comparativa de Funciones de Plataforma | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L54-L62) | 54-62 |

**Constantes Clave**:

- `TERMINAL_PROCESS_NAMES` (línea 71-84): Tabla de mapeo de nombres de terminal a nombres de proceso de macOS
  - `ghostty` → `"Ghostty"`
  - `kitty` → `"kitty"`
  - `iterm` / `iterm2` → `"iTerm2"`
  - `wezterm` → `"WezTerm"`
  - `alacritty` → `"Alacritty"`
  - `terminal` / `apple_terminal` → `"Terminal"`
  - `hyper` → `"Hyper"`
  - `warp` → `"Warp"`
  - `vscode` → `"Code"`
  - `vscode-insiders` → `"Code - Insiders"`

**Configuración por Defecto**:

- `sounds.idle = "Glass"`: Sonido de tarea completada
- `sounds.error = "Basso"`: Sonido de notificación de error
- `sounds.permission = "Submarine"`: Sonido de solicitud de permiso

**Funciones Clave**:

- `isTerminalFocused(terminalInfo)` (línea 166-175): Detecta si el terminal es la aplicación en primer plano
  - Usa `osascript` para obtener el nombre del proceso de la aplicación en primer plano
  - Compara con el `processName` del terminal (no distingue entre mayúsculas y minúsculas)
  - Solo habilitado en la plataforma macOS

- `getBundleId(appName)` (línea 135-137): Obtiene dinámicamente el Bundle ID de la aplicación
  - Usa `osascript` para consultar
  - El Bundle ID se usa para la función de clic en notificación para enfocar

- `getFrontmostApp()` (línea 139-143): Obtiene la aplicación actualmente en primer plano
  - Usa `osascript` para consultar System Events
  - Retorna el nombre del proceso de la aplicación en primer plano

- `sendNotification(options)` (línea 227-243): Envía notificación
  - Característica de macOS: Si detecta la plataforma darwin y tiene `terminalInfo.bundleId`, configura la opción `activate` para lograr el clic para enfocar

</details>
