---
title: "Terminales compatibles: Guía completa de más de 37 emuladores y detección automática | Tutorial de opencode-notify"
sidebarTitle: "¿Tu terminal es compatible?"
subtitle: "Lista de terminales compatibles: Más de 37 emuladores incluidos"
description: "Descubre los más de 37 emuladores de terminal compatibles con opencode-notify en macOS, Windows y Linux. Este tutorial explica el funcionamiento de la detección automática, cómo especificar manualmente el terminal, resolver problemas de identificación, optimizar las notificaciones, activar el filtrado inteligente, evitar el ruido de notificaciones, reducir cambios de ventana y mantener la concentración para mejorar tu productividad."
tags:
  - "Terminal"
  - "Detección de terminal"
  - "Compatibilidad de plataformas"
prerequisite:
  - "start-quick-start"
order: 60
---

# Lista de terminales compatibles: Más de 37 emuladores incluidos

## Lo que podrás hacer tras completar esta lección

- Conocer todos los emuladores de terminal compatibles con opencode-notify
- Verificar si tu terminal está en la lista de compatibilidad
- Comprender cómo funciona la detección automática de terminales
- Aprender a especificar manualmente el tipo de terminal

## Tu situación actual

Has instalado opencode-notify, pero las notificaciones no funcionan correctamente. Quizás el terminal no se detecta o la detección de foco falla. Usas Alacritty, Windows Terminal o tmux, y no estás seguro de si son compatibles. Si la identificación del terminal falla, el filtrado inteligente dejará de funcionar, afectando tu experiencia de uso.

## Cuándo usar esta técnica

**Consulta la lista de terminales compatibles en estos escenarios**:
- Quieres saber si tu terminal es compatible
- La detección automática falla y necesitas configurarlo manualmente
- Cambias entre varios terminales y quieres conocer la compatibilidad
- Quieres entender los principios técnicos de la detección de terminales

## Idea central

opencode-notify utiliza la biblioteca `detect-terminal` para identificar automáticamente tu emulador de terminal, **compatible con más de 37 terminales**. Una vez detectado correctamente, el complemento puede:
- **Activar la detección de foco** (solo macOS): Suprimir notificaciones cuando el terminal está en primer plano
- **Habilitar el enfoque al hacer clic** (solo macOS): Cambiar a la ventana del terminal al hacer clic en la notificación

::: info ¿Por qué es importante la detección de terminal?

La detección de terminal es la base del filtrado inteligente:
- **Detección de foco**: Evita que aparezcan notificaciones mientras estás viendo el terminal
- **Enfoque al hacer clic**: Los usuarios de macOS pueden volver al terminal haciendo clic en la notificación
- **Optimización de rendimiento**: Diferentes terminales pueden requerir un tratamiento especial

Si la detección falla, las notificaciones seguirán funcionando, pero el filtrado inteligente se desactivará.
:::

## Lista de terminales compatibles

### Terminales de macOS

| Nombre del terminal | Nombre del proceso | Características |
| --- | --- | --- |
| **Ghostty** | Ghostty | ✅ Detección de foco + ✅ Enfoque al hacer clic |
| **iTerm2** | iTerm2 | ✅ Detección de foco + ✅ Enfoque al hacer clic |
| **Kitty** | kitty | ✅ Detección de foco + ✅ Enfoque al hacer clic |
| **WezTerm** | WezTerm | ✅ Detección de foco + ✅ Enfoque al hacer clic |
| **Alacritty** | Alacritty | ✅ Detección de foco + ✅ Enfoque al hacer clic |
| **Terminal.app** | Terminal | ✅ Detección de foco + ✅ Enfoque al hacer clic |
| **Hyper** | Hyper | ✅ Detección de foco + ✅ Enfoque al hacer clic |
| **Warp** | Warp | ✅ Detección de foco + ✅ Enfoque al hacer clic |
| **Terminal integrado de VS Code** | Code / Code - Insiders | ✅ Detección de foco + ✅ Enfoque al hacer clic |

::: tip Características de los terminales de macOS
Los terminales de macOS ofrecen funcionalidad completa:
- Notificaciones nativas (Centro de notificaciones)
- Detección de foco (mediante AppleScript)
- Enfoque automático del terminal al hacer clic en la notificación
- Sonidos del sistema personalizables

Todos los terminales utilizan el Centro de notificaciones de macOS para enviar notificaciones.
:::

### Terminales de Windows

| Nombre del terminal | Características |
| --- | --- |
| **Windows Terminal** | ✅ Notificaciones nativas (Toast) |
| **Git Bash** | ✅ Notificaciones nativas (Toast) |
| **ConEmu** | ✅ Notificaciones nativas (Toast) |
| **Cmder** | ✅ Notificaciones nativas (Toast) |
| **PowerShell** | ✅ Notificaciones nativas (Toast) |
| **Terminal integrado de VS Code** | ✅ Notificaciones nativas (Toast) |
| **Otros terminales de Windows** | ✅ Notificaciones nativas (Toast) |

::: details Limitaciones de los terminales de Windows
La plataforma Windows tiene funcionalidad más básica:
- ✅ Notificaciones nativas (Windows Toast)
- ✅ Detección de terminal
- ❌ Detección de foco (limitación del sistema)
- ❌ Enfoque al hacer clic (limitación del sistema)

Todos los terminales de Windows envían notificaciones mediante Windows Toast, utilizando el sonido predeterminado del sistema.
:::

### Terminales de Linux

| Nombre del terminal | Características |
| --- | --- |
| **konsole** | ✅ Notificaciones nativas (notify-send) |
| **xterm** | ✅ Notificaciones nativas (notify-send) |
| **lxterminal** | ✅ Notificaciones nativas (notify-send) |
| **alacritty** | ✅ Notificaciones nativas (notify-send) |
| **kitty** | ✅ Notificaciones nativas (notify-send) |
| **wezterm** | ✅ Notificaciones nativas (notify-send) |
| **Terminal integrado de VS Code** | ✅ Notificaciones nativas (notify-send) |
| **Otros terminales de Linux** | ✅ Notificaciones nativas (notify-send) |

::: details Limitaciones de los terminales de Linux
La plataforma Linux tiene funcionalidad más básica:
- ✅ Notificaciones nativas (notify-send)
- ✅ Detección de terminal
- ❌ Detección de foco (limitación del sistema)
- ❌ Enfoque al hacer clic (limitación del sistema)

Todos los terminales de Linux envían notificaciones mediante notify-send, utilizando el sonido predeterminado del entorno de escritorio.
:::

### Otros terminales compatibles

La biblioteca `detect-terminal` también es compatible con los siguientes terminales (lista posiblemente incompleta):

**Windows / WSL**:
- Terminal WSL
- Símbolo del sistema de Windows (cmd)
- PowerShell (pwsh)
- PowerShell Core (pwsh-preview)
- Cygwin Mintty
- MSYS2 MinTTY

**macOS / Linux**:
- tmux (detectado mediante variables de entorno)
- screen
- rxvt-unicode (urxvt)
- rxvt
- Eterm
- eterm
- aterm
- wterm
- sakura
- roxterm
- xfce4-terminal
- pantheon-terminal
- lxterminal
- mate-terminal
- terminator
- tilix
- guake
- yakuake
- qterminal
- terminology
- deepin-terminal
- gnome-terminal
- konsole
- xterm
- uxterm
- eterm

::: tip Estadísticas de terminales
opencode-notify es compatible con **más de 37 emuladores de terminal** a través de la biblioteca `detect-terminal`.
Si tu terminal no está en la lista, puedes consultar la [lista completa de detect-terminal](https://github.com/jonschlinkert/detect-terminal#supported-terminals).
:::

## Principios de detección de terminal

### Flujo de detección automática

El complemento detecta automáticamente el tipo de terminal al iniciarse:

```
1. Llamar a la biblioteca detect-terminal()
    ↓
2. Escanear procesos del sistema e identificar el terminal actual
    ↓
3. Devolver el nombre del terminal (ej. "ghostty", "kitty")
    ↓
4. Buscar en la tabla de mapeo para obtener el nombre del proceso de macOS
    ↓
5. macOS: Obtener dinámicamente el Bundle ID
    ↓
6. Guardar la información del terminal para notificaciones posteriores
```

### Tabla de mapeo de terminales de macOS

El código fuente incluye un mapeo predefinido de nombres de proceso para terminales comunes:

```typescript
// src/notify.ts:71-84
const TERMINAL_PROCESS_NAMES: Record<string, string> = {
    ghostty: "Ghostty",
    kitty: "kitty",
    iterm: "iTerm2",
    iterm2: "iTerm2",
    wezterm: "WezTerm",
    alacritty: "Alacritty",
    terminal: "Terminal",
    apple_terminal: "Terminal",
    hyper: "Hyper",
    warp: "Warp",
    vscode: "Code",
    "vscode-insiders": "Code - Insiders",
}
```

::: details Código fuente de detección
Lógica completa de detección de terminal:

```typescript
// src/notify.ts:145-164
async function detectTerminalInfo(config: NotifyConfig): Promise<TerminalInfo> {
    // Use config override if provided
    const terminalName = config.terminal || detectTerminal() || null
    
    if (!terminalName) {
        return { name: null, bundleId: null, processName: null }
    }
    
    // Get process name for focus detection
    const processName = TERMINAL_PROCESS_NAMES[terminalName.toLowerCase()] || terminalName
    
    // Dynamically get bundle ID from macOS (no hardcoding!)
    const bundleId = await getBundleId(processName)
    
    return {
        name: terminalName,
        bundleId,
        processName,
    }
}
```

:::

### Procesamiento especial en macOS

La plataforma macOS tiene pasos de detección adicionales:

1. **Obtención del Bundle ID**: Consulta dinámica del Bundle ID de la aplicación mediante `osascript` (ej. `com.mitchellh.ghostty`)
2. **Detección de foco**: Consulta del nombre del proceso de la aplicación en primer plano mediante `osascript`
3. **Enfoque al hacer clic**: La notificación establece el parámetro `activate`, que cambia al terminal mediante el Bundle ID al hacer clic

::: info Ventajas del Bundle ID dinámico
El código fuente no codifica el Bundle ID de forma fija, sino que lo consulta dinámicamente mediante `osascript`. Esto significa:
- ✅ Compatible con actualizaciones del terminal (siempre que el Bundle ID no cambie)
- ✅ Menor costo de mantenimiento (no es necesario actualizar la lista manualmente)
- ✅ Mejor compatibilidad (teóricamente compatible con cualquier terminal de macOS)
:::

### Compatibilidad con tmux

tmux es un multiplexor de terminal. El complemento detecta las sesiones de tmux mediante variables de entorno:

```bash
# Dentro de una sesión tmux
echo $TMUX
# Salida: /tmp/tmux-1000/default,1234,0

# Fuera de tmux
echo $TMUX
# Salida: (vacío)
```

::: tip Compatibilidad con flujos de trabajo de tmux
Los usuarios de tmux pueden usar las notificaciones normalmente:
- Detección automática de sesiones tmux
- Las notificaciones se envían a la ventana del terminal actual
- **Sin detección de foco** (compatible con flujos de trabajo de múltiples ventanas en tmux)
:::

## Especificar terminal manualmente

Si la detección automática falla, puedes especificar manualmente el tipo de terminal en el archivo de configuración.

### Cuándo es necesario especificarlo manualmente

Se requiere configuración manual en estos casos:
- Tu terminal no está en la lista de compatibilidad de `detect-terminal`
- Usas un terminal anidado dentro de otro (ej. tmux + Alacritty)
- La detecci��n automática es incorrecta (identifica erróneamente otro terminal)

### Método de configuración

**Paso 1: Abrir el archivo de configuración**

::: code-group

```bash [macOS/Linux]
nano ~/.config/opencode/kdco-notify.json
```

```powershell [Windows]
notepad $env:USERPROFILE\.config\opencode\kdco-notify.json
```

:::

**Paso 2: Agregar la configuración del terminal**

```json
{
  "terminal": "ghostty"
}
```

**Paso 3: Guardar y reiniciar OpenCode**

### Nombres de terminal disponibles

El nombre del terminal debe ser uno reconocido por la biblioteca `detect-terminal`. Nombres comunes:

| Terminal | Valor de configuración |
| --- | --- |
| Ghostty | `"ghostty"` |
| iTerm2 | `"iterm2"` o `"iterm"` |
| Kitty | `"kitty"` |
| WezTerm | `"wezterm"` |
| Alacritty | `"alacritty"` |
| macOS Terminal | `"terminal"` o `"apple_terminal"` |
| Hyper | `"hyper"` |
| Warp | `"warp"` |
| VS Code | `"vscode"` |
| VS Code Insiders | `"vscode-insiders"` |
| Windows Terminal | `"windows-terminal"` o `"Windows Terminal"` |

::: details Lista completa de nombres disponibles
Consulta el [código fuente de detect-terminal](https://github.com/jonschlinkert/detect-terminal) para obtener la lista completa.
:::

### Ejemplo de configuración completa para macOS

```json
{
  "terminal": "ghostty",
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  }
}
```

### Ejemplo para Windows/Linux

```json
{
  "terminal": "Windows Terminal",
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

::: warning Limitaciones de configuración en Windows/Linux
Windows y Linux no admiten la opción de configuración `sounds` (usan el sonido predeterminado del sistema), ni la detección de foco (limitación del sistema).
:::

## Punto de verificación ✅

Tras completar la lectura, confirma que:

- [ ] Sabes si tu terminal es compatible
- [ ] Comprendes los principios de la detección automática de terminales
- [ ] Sabes cómo especificar manualmente el tipo de terminal
- [ ] Entiendes las diferencias de funcionalidad entre plataformas

## Errores comunes y soluciones

### Problema 1: Fallo en la detección del terminal

**Síntoma**: Las notificaciones no aparecen o la detección de foco no funciona.

**Causa**: `detect-terminal` no puede identificar tu terminal.

**Solución**:

1. Verifica que el nombre de tu terminal sea correcto (distingue mayúsculas y minúsculas)
2. Especifícalo manualmente en el archivo de configuración:

```json
{
  "terminal": "nombre-de-tu-terminal"
}
```

3. Consulta la [lista de compatibilidad de detect-terminal](https://github.com/jonschlinkert/detect-terminal#supported-terminals)

### Problema 2: El enfoque al hacer clic no funciona en macOS

**Síntoma**: Al hacer clic en la notificación no se cambia a la ventana del terminal.

**Causa**: Fallo al obtener el Bundle ID o el terminal no está en la tabla de mapeo.

**Solución**:

1. Verifica si el terminal está en la tabla de mapeo `TERMINAL_PROCESS_NAMES`
2. Si no está, puedes especificar manualmente el nombre del terminal

**Método de verificación**:

```typescript
// Depuración temporal (agregar console.log en notify.ts)
console.log("Terminal info:", terminalInfo)
// Deberías ver { name: "ghostty", bundleId: "com.mitchellh.ghostty", processName: "Ghostty" }
```

### Problema 3: La detección de foco no funciona en tmux

**Síntoma**: En una sesión tmux, las notificaciones aparecen aunque el terminal esté en primer plano.

**Causa**: tmux tiene su propia gestión de sesiones, lo que puede afectar la precisión de la detección de foco.

**Explicación**: Este es un comportamiento esperado. En flujos de trabajo con tmux, la detección de foco tiene limitaciones, pero las notificaciones seguirán funcionando normalmente.

### Problema 4: El terminal integrado de VS Code se identifica como Code

**Síntoma**: Tanto `"vscode"` como `"vscode-insiders"` funcionan en la configuración, pero no sabes cuál usar.

**Explicación**:
- Si usas **VS Code Stable** → configura `"vscode"`
- Si usas **VS Code Insiders** → configura `"vscode-insiders"`

La detección automática seleccionará el nombre de proceso correcto según la versión instalada.

### Problema 5: Fallo en la identificación de Windows Terminal

**Síntoma**: Windows Terminal usa el nombre "windows-terminal", pero no se detecta.

**Causa**: El nombre del proceso de Windows Terminal puede ser `WindowsTerminal.exe` o `Windows Terminal`.

**Solución**: Prueba diferentes valores de configuración:

```json
{
  "terminal": "windows-terminal"  // o "Windows Terminal"
}
```

## Resumen de la lección

En esta lección aprendimos:

- ✅ opencode-notify es compatible con más de 37 emuladores de terminal
- ✅ Los terminales de macOS ofrecen funcionalidad completa (detección de foco + enfoque al hacer clic)
- ✅ Los terminales de Windows/Linux admiten notificaciones básicas
- ✅ Los principios de la detección automática de terminales y su implementación en el código fuente
- ✅ Cómo especificar manualmente el tipo de terminal
- ✅ Soluciones para problemas comunes de identificación de terminales

**Puntos clave**:
1. La detección de terminal es la base del filtrado inteligente, compatible con más de 37 terminales
2. Los terminales de macOS tienen la funcionalidad más completa; Windows/Linux tienen funcionalidad más básica
3. Si la detección automática falla, puedes configurar manualmente el nombre del terminal
4. Los usuarios de tmux pueden usar las notificaciones normalmente, pero la detección de foco tiene limitaciones
5. El Bundle ID de macOS se obtiene dinámicamente, lo que mejora la compatibilidad

## Próxima lección

> En la próxima lección aprenderemos sobre la **[Referencia de configuración](../../advanced/config-reference/)**.
>
> Aprenderás:
> - Descripción completa de las opciones de configuración y valores predeterminados
> - Personalización de sonidos (macOS)
> - Configuración de horas de silencio
> - Interruptor de notificaciones para sesiones secundarias
> - Sobrescritura del tipo de terminal
> - Técnicas de configuración avanzada

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-27

| Funcionalidad | Ruta del archivo | Líneas |
| --- | --- | --- |
| Tabla de mapeo de terminales | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| Función de detección de terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| Obtención del Bundle ID en macOS | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L135-L137) | 135-137 |
| Detección de aplicación en primer plano en macOS | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L139-L143) | 139-143 |
| Detección de foco en macOS | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |

**Constantes clave**:
- `TERMINAL_PROCESS_NAMES`: Tabla de mapeo de nombres de terminal a nombres de proceso de macOS

**Funciones clave**:
- `detectTerminalInfo()`: Detecta información del terminal (nombre, Bundle ID, nombre del proceso)
- `detectTerminal()`: Llama a la biblioteca detect-terminal para identificar el terminal
- `getBundleId()`: Obtiene dinámicamente el Bundle ID de aplicaciones macOS mediante osascript
- `getFrontmostApp()`: Consulta el nombre de la aplicación en primer plano
- `isTerminalFocused()`: Detecta si el terminal está en primer plano (solo macOS)

**Dependencias externas**:
- [detect-terminal](https://github.com/jonschlinkert/detect-terminal): Biblioteca de detección de terminales, compatible con más de 37 terminales

</details>
