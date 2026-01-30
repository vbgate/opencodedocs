---
title: "Solución de problemas: Notificaciones no visibles, detección de foco fallida y otros problemas comunes | Tutorial de opencode-notify"
sidebarTitle: "Las notificaciones no se muestran"
subtitle: "Solución de problemas: Notificaciones no visibles, detección de foco fallida y otros problemas comunes"
description: "Resuelve problemas comunes al usar opencode-notify, incluyendo notificaciones que no se muestran, detección de foco fallida, errores de configuración, sonidos que no se reproducen y más. Aprende a verificar los permisos de notificaciones de macOS, configuración de horas de silencio, detección de terminal y otros problemas para restaurar rápidamente el funcionamiento normal del complemento."
tags:
  - "Solución de problemas"
  - "FAQ"
prerequisite:
  - "start-quick-start"
order: 110
---

# Solución de problemas: Notificaciones no visibles, detección de foco fallida y otros problemas comunes

## Lo que podrás hacer después de aprender

- Localizar rápidamente la causa de las notificaciones que no se muestran
- Resolver problemas de permisos de notificaciones de macOS
- Solucionar problemas de detección de foco fallida
- Corregir errores de formato en archivos de configuración
- Comprender las diferencias de funcionalidades entre plataformas

## Tu situación actual

La IA completó la tarea pero no recibiste ninguna notificación; o al hacer clic en la notificación, el terminal no se mostró en primer plano. No sabes dónde está el problema ni por dónde empezar a verificar.

## Cuándo usar esta guía

- Primera vez usando el complemento después de instalación, no recibes ninguna notificación
- Después de actualizar el complemento o el sistema, las notificaciones dejaron de funcionar
- Quieres desactivar ciertos comportamientos de notificación pero la configuración parece no aplicarse
- Cambiaste de macOS a Windows/Linux y descubriste que algunas funciones no están disponibles

## Idea principal

El flujo de trabajo de opencode-notify es relativamente simple, pero involucra muchos componentes: OpenCode SDK → escucha de eventos → lógica de filtrado → notificación del sistema operativo. Si cualquiera de estos componentes falla, puede causar que las notificaciones no se muestren.

La clave para la solución de problemas es **verificar cada componente en orden**, comenzando por las causas más probables. El 80% de los problemas se pueden resolver con las siguientes 5 categorías:

1. **Notificaciones no visibles** - El problema más común
2. **Detección de foco fallida** (solo macOS)
3. **Configuración no aplicada** - Error de formato JSON o ruta incorrecta
4. **Sonidos no se reproducen** (solo macOS)
5. **Diferencias entre plataformas** - Algunas funciones no son compatibles

---

## Problema 1: Notificaciones no visibles

Este es el problema más común, puede haber hasta 6 causas. Verificar en orden:

### 1.1 Verificar si el complemento está instalado correctamente

**Síntoma**: OpenCode funciona normalmente, pero nunca recibes ninguna notificación.

**Pasos de verificación**:

```bash
# Verificar si el complemento está instalado
ls ~/.opencode/plugin/kdco-notify

# Si no existe, reinstallar
ocx add kdco/notify
```

**Deberías ver**: Que el directorio `~/.opencode/plugin/kdco-notify` existe y contiene archivos como `package.json` y `src/notify.ts`.

::: tip Verificación de instalación manual
Si usas instalación manual, asegúrate de:
1. Las dependencias están instaladas: `npm install node-notifier detect-terminal`
2. El archivo del complemento está en la ubicación correcta: `~/.opencode/plugin/`
3. OpenCode ha sido reiniciado (los cambios de complementos requieren reinicio)
:::

### 1.2 Verificar permisos de notificaciones de macOS

**Síntoma**: Solo para usuarios de macOS, el complemento está instalado pero nunca recibes notificaciones.

**Causa**: macOS requiere autorización explícita para que las aplicaciones de terminal envíen notificaciones.

**Pasos de verificación**:

```bash
# 1. Abrir configuración del sistema
# macOS Ventura y superior: Configuración del sistema → Notificaciones y modo de concentración
# Versiones anteriores de macOS: Preferencias del sistema → Notificaciones

# 2. Encontrar tu aplicación de terminal (Ghostty, iTerm2, Terminal.app, etc.)
# 3. Asegurarse de que "Permitir notificaciones" esté activado
# 4. Asegurarse de que "En pantalla de bloqueo" y "Mostrar banners en pantalla de bloqueo" estén activados
```

**Deberías ver**: Tu aplicación de terminal en la configuración de notificaciones, con el interruptor "Permitir notificaciones" en verde.

::: warning Error común
OpenCode mismo no aparecerá en la configuración de notificaciones, necesitas autorizar la **aplicación de terminal** (Ghostty, iTerm2, Terminal.app, etc.), no OpenCode.
:::

### 1.3 Verificar configuración de horas de silencio

**Síntoma**: No hay notificaciones en ciertos momentos del día, pero sí en otros.

**Causa**: Las horas de silencio están activadas en el archivo de configuración.

**Pasos de verificación**:

```bash
# Verificar archivo de configuración
cat ~/.config/opencode/kdco-notify.json
```

**Solución**:

```json
{
  "quietHours": {
    "enabled": false,  // Cambiar a false para desactivar horas de silencio
    "start": "22:00",
    "end": "08:00"
  }
}
```

**Deberías ver**: Que `quietHours.enabled` sea `false`, o que la hora actual no esté dentro del período de silencio.

::: tip Período de silencio que cruza medianoche
Las horas de silencio soportan cruzar medianoche (por ejemplo, 22:00-08:00), este es el comportamiento correcto. Si la hora actual está entre las 10 PM y las 8 AM del día siguiente, las notificaciones serán suprimidas.
:::

### 1.4 Verificar foco de la ventana del terminal

**Síntoma**: Cuando estás viendo el terminal, no recibes notificaciones.

**Causa**: Este es el **comportamiento esperado**, no un error. El mecanismo de detección de foco suprimirá las notificaciones cuando estés viendo el terminal para evitar recordatorios repetitivos.

**Pasos de verificación**:

**Verificar si el terminal está enfocado**:
1. Cambiar a otra aplicación (navegador, VS Code, etc.)
2. Dejar que la IA ejecute una tarea
3. Esperar a que la tarea se complete

**Deberías ver**: Que las notificaciones se muestren normalmente cuando estás en otras aplicaciones.

::: tip Acerca de la detección de foco
La detección de foco es un comportamiento incorporado que no se puede desactivar mediante configuración. El complemento suprimirá las notificaciones cuando el terminal esté enfocado para evitar recordatorios repetidos. Este es el comportamiento esperado por diseño.
:::

### 1.5 Verificar filtrado de sesiones secundarias

**Síntoma**: La IA ejecutó múltiples subtareas pero no recibiste notificaciones de cada una.

**Causa**: Este es el **comportamiento esperado**. El complemento solo notifica la sesión principal por defecto, no las sesiones secundarias, para evitar inundación de notificaciones.

**Pasos de verificación**:

**Entender sesión principal y sesiones secundarias**:
- Sesión principal: La tarea que le pediste directamente a la IA (por ejemplo, "optimizar la base de código")
- Sesiones secundarias: Subtasks divididas por la IA (por ejemplo, "optimizar src/components", "optimizar src/utils")

**Si realmente necesitas notificaciones de sesiones secundarias**:

```json
{
  "notifyChildSessions": true
}
```

**Deberías ver**: Que recibes una notificación cuando cada sesión secundaria se completa.

::: tip Práctica recomendada
A menos que estés monitoreando múltiples tareas concurrentes, mantén `notifyChildSessions: false` y solo recibe notificaciones de sesiones principales.
:::

### 1.6 Verificar si el archivo de configuración fue eliminado o renombrado

**Síntoma**: Antes había notificaciones, de repente ya no se muestran.

**Pasos de verificación**:

```bash
# Verificar si el archivo de configuración existe
ls -la ~/.config/opencode/kdco-notify.json
```

**Solución**:

Si el archivo de configuración fue eliminado o la ruta es incorrecta, el complemento usará la configuración predeterminada:

**Eliminar archivo de configuración para restaurar valores predeterminados**:

```bash
# Eliminar archivo de configuración para usar valores predeterminados
rm ~/.config/opencode/kdco-notify.json
```

**Deberías ver**: Que el complemento comience a enviar notificaciones nuevamente (usando la configuración predeterminada).

---

## Problema 2: Detección de foco fallida (solo macOS)

**Síntoma**: Estás viendo el terminal pero aún recibes notificaciones, parece que la detección de foco no está funcionando.

### 2.1 Verificar si el terminal se detecta correctamente

**Causa**: El complemento usa la biblioteca `detect-terminal` para identificar automáticamente el terminal, si la detección falla, la detección de foco no podrá funcionar.

**Pasos de verificación**:

```bash
# Verificar si la detección del terminal funciona normalmente
node -e "console.log(require('detect-terminal')())"
```

**Deberías ver**: Que se muestre el nombre de tu terminal (por ejemplo, `ghostty`, `iterm2`, etc.).

Si el resultado está vacío,说明检测失败。

### 2.2 Especificar manualmente el tipo de terminal

**Si la detección automática falla, puedes especificar manualmente**:

```json
{
  "terminal": "ghostty"  // Reemplazar con el nombre de tu terminal
}
```

**Nombres de terminal soportados** (minúsculas):

| Terminal | Nombre | Terminal | Nombre |
| --- | --- | --- | --- |
| Ghostty | `ghostty` | Kitty | `kitty` |
| iTerm2 | `iterm2` o `iterm` | WezTerm | `wezterm` |
| Alacritty | `alacritty` | Terminal de macOS | `terminal` o `apple_terminal` |
| Hyper | `hyper` | Warp | `warp` |
| Terminal de VS Code | `vscode` | VS Code Insiders | `vscode-insiders` |

::: tip Asignación de nombres de procesos
El complemento tiene una tabla de asignación de nombres de terminal a nombres de procesos de macOS. Si especificas `terminal` manualmente, asegúrate de usar un nombre de la tabla de asignación (líneas 71-84).
:::

---

## Problema 3: Configuración no aplicada

**Síntoma**: Modificaste el archivo de configuración pero el comportamiento del complemento no cambió.

### 3.1 Verificar si el formato JSON es correcto

**Errores comunes**:

```json
// ❌ Error: faltan comillas
{
  notifyChildSessions: true
}

// ❌ Error: coma al final
{
  "notifyChildSessions": true,
}

// ❌ Error: comentarios no soportados
{
  "notifyChildSessions": true  // Esto causará que el análisis JSON falle
}
```

**Formato correcto**:

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**Validar formato JSON**:

```bash
# Usar jq para validar formato JSON
cat ~/.config/opencode/kdco-notify.json | jq '.'

# Si muestra JSON formateado,说明格式正确
# Si da error,说明JSON有问题
```

### 3.2 Verificar la ruta del archivo de configuración

**Síntoma**: Creaste el archivo de configuración pero el complemento parece no leerlo.

**Ruta correcta**:

```
~/.config/opencode/kdco-notify.json
```

**Pasos de verificación**:

```bash
# Verificar si el archivo de configuración existe
ls -la ~/.config/opencode/kdco-notify.json

# Si no existe, crear directorio y archivo
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/kdco-notify.json << 'EOF'
{
  "notifyChildSessions": false
}
EOF
```

### 3.3 Reiniciar OpenCode

**Causa**: El complemento carga la configuración una vez al inicio, se necesita reinicio después de modificar.

**Pasos de verificación**:

```bash
# Reiniciar OpenCode completamente
# 1. Cerrar OpenCode
# 2. Reiniciar OpenCode
```

---

## Problema 4: Sonidos no se reproducen (solo macOS)

**Síntoma**: Las notificaciones se muestran normalmente pero no se reproduce ningún sonido.

### 4.1 Verificar si el nombre del sonido es correcto

**Sonidos de macOS soportados**:

| Nombre del sonido | Descripción | Nombre del sonido | Descripción |
| --- | --- | --- | --- |
| Basso | Bajo | Blow | Sonido de soplido |
| Bottle | Sonido de botella | Frog | Sonido de rana |
| Funk | Funk | Glass | Sonido de vidrio (predeterminado para tarea completada) |
| Hero | Héroe | Morse | Código Morse |
| Ping | Sonido de ping | Pop | Sonido de burbuja |
| Purr | Sonido de ronroneo | Sosumi | Sosumi |
| Submarine | Submarino (predeterminado para solicitud de permisos) | Tink | Sonido de campana |

**Ejemplo de configuración**:

```json
{
  "sounds": {
    "idle": "Glass",      // Sonido de tarea completada
    "error": "Basso",     // Sonido de error
    "permission": "Submarine",  // Sonido de solicitud de permisos
    "question": "Ping"    // Sonido de pregunta (opcional)
  }
}
```

### 4.2 Verificar configuración de volumen del sistema

**Pasos de verificación**:

```bash
# Abrir configuración del sistema → Sonido → Volumen de salida
# Asegurarse de que el volumen no esté silenciado y sea el adecuado
```

### 4.3 Otras plataformas no soportan sonidos personalizados

**Síntoma**: Usuarios de Windows o Linux, configuraste sonidos pero no hay audio.

**Causa**: Los sonidos personalizados son una función exclusiva de macOS, Windows y Linux no lo soportan.

**Solución**: Usuarios de Windows y Linux recibirán notificaciones pero los sonidos están controlados por la configuración predeterminada del sistema, no se pueden configurar mediante el complemento.

::: tip Sonidos en Windows/Linux
Los sonidos de notificación en Windows y Linux están controlados por la configuración del sistema:
- Windows: Configuración → Sistema → Notificaciones → Seleccionar sonido de notificación
- Linux: Configuración del entorno de escritorio → Notificaciones → Sonidos
:::

---

## Problema 5: Al hacer clic en la notificación no se enfoca (solo macOS)

**Síntoma**: Al hacer clic en la notificación, la ventana del terminal no se muestra en primer plano.

### 5.1 Verificar si el Bundle ID se obtuvo correctamente

**Causa**: La función de enfocar al hacer clic en la notificación requiere obtener el Bundle ID del terminal (como `com.ghostty.Ghostty`), si falla la obtención, no se puede enfocar.

**Pasos de verificación**:

El complemento detectará automáticamente el terminal y obtendrá el Bundle ID al inicio. Si falla, la función de enfocar al hacer clic no estará disponible.

**Causas comunes**:
1. El terminal no está en la tabla de asignación (terminal personalizado)
2. Ejecución de `osascript` falló (problema de permisos de macOS)

**Solución**: Especificar manualmente el tipo de terminal (ver sección 2.2).

### 5.2 Verificar permisos de accesibilidad del sistema

**Causa**: macOS requiere permisos de "Accesibilidad" para controlar ventanas de otras aplicaciones.

**Pasos de verificación**:

```bash
# Abrir configuración del sistema → Privacidad y seguridad → Accesibilidad
# Asegurarse de que la aplicación de terminal tenga permisos de accesibilidad
```

**Deberías ver**: Tu aplicación de terminal (Ghostty, iTerm2, etc.) en la lista de accesibilidad, con el interruptor activado.

---

## Problema 6: Diferencias de funcionalidades entre plataformas

**Síntoma**: Cambiaste de macOS a Windows/Linux y descubriste que algunas funciones no están disponibles.

### 6.1 Tabla de comparación de funcionalidades

| Funcionalidad | macOS | Windows | Linux |
| --- | --- | --- | --- |
| Notificaciones nativas | ✅ | ✅ | ✅ |
| Sonidos personalizados | ✅ | ❌ | ❌ |
| Detección de foco | ✅ | ❌ | ❌ |
| Enfocar al hacer clic en notificación | ✅ | ❌ | ❌ |
| Detección de terminal | ✅ | ✅ | ✅ |
| Horas de silencio | ✅ | ✅ | ✅ |
| Notificaciones de sesiones secundarias | ✅ | ✅ | ✅ |

**Explicación**:
- **Windows/Linux**: Solo soportan funciones básicas de notificación, funciones avanzadas (detección de foco, enfocar al hacer clic, sonidos personalizados) no están disponibles
- **macOS**: Soporta todas las funciones

### 6.2 Compatibilidad multiplataforma del archivo de configuración

**Problema**: Configuraste `sounds` en macOS, al cambiar a Windows los sonidos no funcionan.

**Causa**: La configuración de `sounds` solo es válida en macOS.

**Solución**: El archivo de configuración se puede usar en múltiples plataformas, el complemento ignorará automáticamente los elementos de configuración no soportados. No es necesario eliminar el campo `sounds`, Windows/Linux lo ignorará silenciosamente.

::: tip Mejores prácticas
Usa el mismo archivo de configuración para cambiar entre múltiples plataformas, el complemento manejará automáticamente las diferencias de plataforma. No es necesario crear archivos de configuración separados para cada plataforma.
:::

---

## Resumen de esta lección

La solución de problemas de opencode-notify se puede resumir en las siguientes 6 categorías de problemas:

1. **Notificaciones no visibles**: Verificar instalación del complemento, permisos de notificaciones de macOS, horas de silencio, foco del terminal, filtrado de sesiones secundarias, si el complemento está desactivado
2. **Detección de foco fallida** (macOS): Verificar si el terminal se detecta correctamente, o especificar manualmente el tipo de terminal
3. **Configuración no aplicada**: Verificar formato JSON, ruta del archivo de configuración, reiniciar OpenCode
4. **Sonidos no se reproducen** (macOS): Verificar si el nombre del sonido es correcto, confirmar que los sonidos solo son compatibles con macOS
5. **Al hacer clic en la notificación no se enfoca** (macOS): Verificar obtención de Bundle ID y permisos de accesibilidad
6. **Diferencias de funcionalidades entre plataformas**: Windows/Linux solo soportan notificaciones básicas, funciones avanzadas solo disponibles en macOS

**Lista de verificación rápida**:

```
□ ¿El complemento está instalado correctamente?
□ ¿Los permisos de notificaciones de macOS están autorizados?
□ ¿Las horas de silencio están activadas?
□ ¿El terminal está enfocado?
□ ¿El filtrado de sesiones secundarias está activado?
□ ¿El formato JSON del archivo de configuración es correcto?
□ ¿La ruta del archivo de configuración es correcta?
□ ¿Se reinició OpenCode?
□ ¿El nombre del sonido está en la lista de soportados (solo macOS)?
□ ¿El Bundle ID se obtuvo correctamente (solo macOS)?
□ ¿El volumen del sistema es normal?
```

---

##预告：下一课

> En la próxima lección aprenderemos **[Preguntas frecuentes](../common-questions/)**.
>
> Aprenderás:
> - Si opencode-notify aumentará la sobrecarga del contexto de la conversación
> - Si recibirás una inundación de notificaciones
> - Cómo desactivar notificaciones temporalmente
> - Problemas de impacto en el rendimiento y seguridad de privacidad

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Hacer clic para ver la ubicación del código fuente</strong></summary>

> Tiempo de actualización: 2026-01-27

| Funcionalidad | Ruta del archivo | Número de línea |
| --- | --- | --- |
| Carga de configuración y manejo de errores | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| Detección de terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| Ejecución de osascript de macOS | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L120-L133) | 120-133 |
| Detección de foco del terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| Verificación de horas de silencio | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| Detección de sesión principal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L205-L214) | 205-214 |
| Envío de notificaciones | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| Configuración predeterminada | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| Asignación de nombres de procesos de terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| Manejo de tarea completada | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L249-L284) | 249-284 |
| Manejo de notificaciones de error | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L286-L313) | 286-313 |
| Manejo de solicitud de permisos | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L315-L334) | 315-334 |
| Manejo de preguntas | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L336-L351) | 336-351 |

**Constantes clave**:

- `DEFAULT_CONFIG`: Configuración predeterminada (líneas 56-68)
  - `notifyChildSessions: false`: No notificar sesiones secundarias por defecto
  - `sounds.idle: "Glass"`: Sonido de tarea completada
  - `sounds.error: "Basso"`: Sonido de error
  - `sounds.permission: "Submarine"`: Sonido de solicitud de permisos
  - `quietHours.start: "22:00"`, `quietHours.end: "08:00"`: Período de silencio predeterminado

- `TERMINAL_PROCESS_NAMES`: Asignación de nombres de terminal a nombres de procesos de macOS (líneas 71-84)

**Funciones clave**:

- `loadConfig()`: Carga y fusiona el archivo de configuración con la configuración predeterminada, usa valores predeterminados cuando el archivo de configuración no existe o es inválido
- `detectTerminalInfo()`: Detecta información del terminal (nombre, Bundle ID, nombre de proceso)
- `isTerminalFocused()`: Verifica si el terminal es la aplicación en primer plano (macOS)
- `isQuietHours()`: Verifica si la hora actual está dentro del período de silencio
- `isParentSession()`: Verifica si la sesión es una sesión principal
- `sendNotification()`: Envía notificación nativa, soporta enfocar terminal al hacer clic en macOS
- `runOsascript()`: Ejecuta AppleScript (macOS), devuelve null si falla
- `getBundleID()`: Obtiene el Bundle ID de la aplicación (macOS)

**Reglas de negocio**:

- BR-1-1: Solo notificar sesiones principales por defecto, no notificar sesiones secundarias (`notify.ts:256-259`)
- BR-1-2: Suprimir notificaciones cuando el terminal está enfocado (`notify.ts:265`)
- BR-1-3: No enviar notificaciones durante el período de silencio (`notify.ts:262`)
- BR-1-4: Las solicitudes de permisos siempre se notifican, sin necesidad de verificación de sesión principal (`notify.ts:319`)
- BR-1-5: Las preguntas no hacen verificación de foco, soportan flujo de trabajo tmux (`notify.ts:340`)
- BR-1-6: macOS soporta enfocar el terminal al hacer clic en la notificación (`notify.ts:238-240`)

**Manejo de excepciones**:

- `loadConfig()`: Cuando el archivo de configuración no existe o el análisis JSON falla, usar configuración predeterminada (`notify.ts:110-113`)
- `isParentSession()`: Cuando la consulta de sesión falla, asumir que es una sesión principal (notificar en lugar de omitir) (`notify.ts:210-212`)
- `runOsascript()`: Devolver null cuando la ejecución de osascript falla (`notify.ts:120-132`)
- `handleSessionIdle()`: Cuando falla la obtención de información de sesión, usar título predeterminado (`notify.ts:274-276`)

</details>
