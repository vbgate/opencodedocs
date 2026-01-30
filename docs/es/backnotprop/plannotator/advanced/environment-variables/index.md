---
title: "Variables de Entorno: Modo Remoto y Configuración de Puertos | plannotator"
sidebarTitle: "Configuración Remota en 5 Minutos"
subtitle: "Variables de Entorno: Modo Remoto y Configuración de Puertos"
description: "Aprende a configurar las variables de entorno de plannotator. Configura el modo remoto, puertos fijos, navegadores personalizados y opciones de compartir URL para entornos SSH, Devcontainer y WSL."
tags:
  - "Variables de entorno"
  - "Modo remoto"
  - "Configuración de puertos"
  - "Configuración del navegador"
  - "Compartir URL"
  - "Devcontainer"
  - "WSL"
prerequisite:
  - "start-getting-started"
  - "start-installation-claude-code"
  - "start-installation-opencode"
order: 5
---

# Configuración de Variables de Entorno

## Lo que Aprenderás

- ✅ Configurar correctamente Plannotator en entornos remotos como SSH, Devcontainer y WSL
- ✅ Usar puertos fijos para evitar conflictos y configuraciones frecuentes de reenvío de puertos
- ✅ Especificar un navegador personalizado para abrir la interfaz de revisión de planes
- ✅ Habilitar o deshabilitar la función de compartir URL
- ✅ Comprender los valores predeterminados y comportamientos de cada variable de entorno

## Tu Situación Actual

**Problema 1**: Al usar Plannotator en SSH o Devcontainer, el navegador no se abre automáticamente o no puedes acceder al servidor local.

**Problema 2**: Cada vez que reinicias Plannotator usa un puerto aleatorio, lo que requiere actualizar constantemente la configuración de reenvío de puertos.

**Problema 3**: El navegador predeterminado del sistema no se ajusta a tus preferencias y deseas ver los planes en un navegador específico.

**Problema 4**: Por razones de seguridad, quieres deshabilitar la función de compartir URL para evitar que los planes se compartan accidentalmente.

**Plannotator te ayuda**:
- Detecta automáticamente entornos remotos mediante variables de entorno y deshabilita la apertura automática del navegador
- Fija puertos para facilitar la configuración de reenvío
- Soporta navegadores personalizados
- Proporciona variables de entorno para controlar la función de compartir URL

## Cuándo Usar Esta Técnica

**Casos de uso**:
- Usar Claude Code u OpenCode en un servidor remoto vía SSH
- Desarrollar en un contenedor Devcontainer
- Trabajar en un entorno WSL (Windows Subsystem for Linux)
- Necesitar puertos fijos para simplificar la configuración de reenvío
- Preferir usar un navegador específico (como Chrome o Firefox)
- Políticas de seguridad empresarial que requieren deshabilitar la función de compartir URL

**Casos no aplicables**:
- Desarrollo local con el navegador predeterminado (no se necesitan variables de entorno)
- Sin necesidad de reenvío de puertos (desarrollo completamente local)

## Concepto Principal

### ¿Qué son las Variables de Entorno?

Las **variables de entorno** son un mecanismo de configuración clave-valor proporcionado por el sistema operativo. Plannotator lee las variables de entorno para adaptarse a diferentes entornos de ejecución (local o remoto).

::: info ¿Por qué necesitamos variables de entorno?

Plannotator asume por defecto que estás en un entorno de desarrollo local:
- Modo local: Puerto aleatorio (evita conflictos de puertos)
- Modo local: Abre automáticamente el navegador predeterminado del sistema
- Modo local: Función de compartir URL habilitada

Sin embargo, en entornos remotos (SSH, Devcontainer, WSL), estos comportamientos predeterminados necesitan ajustes:
- Modo remoto: Usa un puerto fijo (facilita el reenvío de puertos)
- Modo remoto: No abre el navegador automáticamente (debe abrirse en la máquina host)
- Modo remoto: Puede ser necesario deshabilitar compartir URL (por seguridad)

Las variables de entorno te permiten ajustar el comportamiento de Plannotator en diferentes entornos sin modificar el código.
:::

### Prioridad de Variables de Entorno

Prioridad de lectura de variables de entorno en Plannotator:

```
Variable de entorno explícita > Comportamiento predeterminado

Por ejemplo:
PLANNOTATOR_PORT=3000 > Puerto predeterminado modo remoto 19432 > Puerto aleatorio modo local
```

Esto significa:
- Si se establece `PLANNOTATOR_PORT`, se usa ese puerto independientemente del modo remoto
- Si no se establece `PLANNOTATOR_PORT`, el modo remoto usa 19432, el modo local usa un puerto aleatorio

## 🎒 Antes de Empezar

Antes de configurar las variables de entorno, confirma:

- [ ] Has completado la instalación de Plannotator ([Instalación en Claude Code](../installation-claude-code/) o [Instalación en OpenCode](../installation-opencode/))
- [ ] Conoces tu entorno de ejecución actual (local, SSH, Devcontainer, WSL)
- [ ] (Entorno remoto) Has configurado el reenvío de puertos (como el parámetro `-L` de SSH o `forwardPorts` de Devcontainer)

## Paso a Paso

### Paso 1: Configurar el Modo Remoto (SSH, Devcontainer, WSL)

**Por qué**
El modo remoto usa automáticamente un puerto fijo y deshabilita la apertura automática del navegador, ideal para entornos SSH, Devcontainer y WSL.

**Cómo hacerlo**

::: code-group

```bash [macOS/Linux/WSL (Bash)]
export PLANNOTATOR_REMOTE=1
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_REMOTE="1"
```

```cmd [Windows CMD]
set PLANNOTATOR_REMOTE=1
```

:::

**Lo que deberías ver**: Sin retroalimentación visual, la variable de entorno está configurada.

**Hacer permanente** (recomendado):

::: code-group

```bash [~/.bashrc o ~/.zshrc]
echo 'export PLANNOTATOR_REMOTE=1' >> ~/.bashrc
source ~/.bashrc
```

```powershell [PowerShell Profile]
[Environment]::SetEnvironmentVariable('PLANNOTATOR_REMOTE', '1', 'User')
```

```cmd [Variables de entorno del sistema]
# Agregar a través de "Propiedades del sistema > Variables de entorno"
```

:::

### Paso 2: Configurar Puerto Fijo (Requerido para Entornos Remotos)

**Por qué**
Los entornos remotos necesitan un puerto fijo para configurar el reenvío de puertos. También puedes configurarlo en entornos locales si necesitas un puerto fijo.

**Reglas de puerto predeterminado**:
- Modo local (sin `PLANNOTATOR_REMOTE`): Puerto aleatorio (`0`)
- Modo remoto (`PLANNOTATOR_REMOTE=1`): Predeterminado `19432`
- `PLANNOTATOR_PORT` establecido explícitamente: Usa el puerto especificado

**Cómo hacerlo**

::: code-group

```bash [macOS/Linux/WSL (Bash)]
# Establecer a 19432 (predeterminado modo remoto)
export PLANNOTATOR_PORT=19432

# O puerto personalizado
export PLANNOTATOR_PORT=3000
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_PORT="19432"
```

```cmd [Windows CMD]
set PLANNOTATOR_PORT=19432
```

:::

**Lo que deberías ver**: Sin retroalimentación visual, la variable de entorno está configurada.

**Punto de verificación ✅**: Verificar que el puerto esté activo

Después de reiniciar Claude Code u OpenCode, activa una revisión de plan y observa la URL en la salida del terminal:

```bash
# Salida modo local (puerto aleatorio)
http://localhost:54321

# Salida modo remoto (puerto fijo 19432)
http://localhost:19432
```

**Ejemplos de configuración de reenvío de puertos**:

Desarrollo remoto SSH:
```bash
ssh -L 19432:localhost:19432 user@remote-server
```

Devcontainer (`.devcontainer/devcontainer.json`):
```json
{
  "forwardPorts": [19432]
}
```

### Paso 3: Configurar Navegador Personalizado

**Por qué**
El navegador predeterminado del sistema puede no ser el que prefieres (por ejemplo, trabajas en Chrome pero el predeterminado es Safari).

**Cómo hacerlo**

::: code-group

```bash [macOS (Bash)]
# Usar nombre de aplicación (soportado en macOS)
export PLANNOTATOR_BROWSER="Google Chrome"

# O usar ruta completa
export PLANNOTATOR_BROWSER="/Applications/Google Chrome.app"
```

```bash [Linux (Bash)]
# Usar ruta del ejecutable
export PLANNOTATOR_BROWSER="/usr/bin/firefox"

# O usar ruta relativa (si está en PATH)
export PLANNOTATOR_BROWSER="firefox"
```

```powershell [Windows PowerShell]
# Usar ruta del ejecutable
$env:PLANNOTATOR_BROWSER="C:\Program Files\Google\Chrome\Application\chrome.exe"
```

```cmd [Windows CMD]
set PLANNOTATOR_BROWSER=C:\Program Files\Google\Chrome\Application\chrome.exe
```

:::

**Lo que deberías ver**: La próxima vez que actives una revisión de plan, Plannotator abrirá el navegador especificado.

**Punto de verificación ✅**: Verificar que el navegador esté activo

Después de reiniciar, activa una revisión de plan y observa:
- macOS: Se abre la aplicación especificada
- Windows: Se inicia el proceso del navegador especificado
- Linux: Se ejecuta el comando del navegador especificado

**Rutas comunes de navegadores**:

| Sistema Operativo | Navegador | Ruta/Comando |
| --- | --- | --- |
| macOS | Chrome | `Google Chrome` o `/Applications/Google Chrome.app` |
| macOS | Firefox | `Firefox` o `/Applications/Firefox.app` |
| macOS | Safari | `Safari` |
| Linux | Chrome | `google-chrome` o `/usr/bin/google-chrome` |
| Linux | Firefox | `firefox` o `/usr/bin/firefox` |
| Windows | Chrome | `C:\Program Files\Google\Chrome\Application\chrome.exe` |
| Windows | Firefox | `C:\Program Files\Mozilla Firefox\firefox.exe` |

### Paso 4: Configurar la Opción de Compartir URL

**Por qué**
La función de compartir URL está habilitada por defecto, pero por razones de seguridad (como en entornos empresariales), puede que necesites deshabilitarla.

**Comportamiento predeterminado**:
- Sin `PLANNOTATOR_SHARE`: Compartir URL habilitado
- Establecido a `disabled`: Compartir URL deshabilitado

**Cómo hacerlo**

::: code-group

```bash [macOS/Linux/WSL (Bash)]
# Deshabilitar compartir URL
export PLANNOTATOR_SHARE="disabled"
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_SHARE="disabled"
```

```cmd [Windows CMD]
set PLANNOTATOR_SHARE=disabled
```

:::

**Lo que deberías ver**: Al hacer clic en el botón Export, la opción "Share as URL" desaparece o no está disponible.

**Punto de verificación ✅**: Verificar que compartir URL esté deshabilitado

1. Reinicia Claude Code u OpenCode
2. Abre cualquier revisión de plan
3. Haz clic en el botón "Export" en la esquina superior derecha
4. Observa la lista de opciones

**Estado habilitado** (predeterminado):
- ✅ Muestra las pestañas "Share" y "Raw Diff"
- ✅ La pestaña "Share" muestra la URL compartible y el botón de copiar

**Estado deshabilitado** (`PLANNOTATOR_SHARE="disabled"`):
- ✅ Muestra directamente el contenido "Raw Diff"
- ✅ Muestra los botones "Copy" y "Download .diff"
- ❌ Sin pestaña "Share" ni función de URL compartible

### Paso 5: Verificar Todas las Variables de Entorno

**Por qué**
Asegurarte de que todas las variables de entorno estén correctamente configuradas y funcionen como se espera.

**Método de verificación**

```bash
# macOS/Linux/WSL
echo "PLANNOTATOR_REMOTE=$PLANNOTATOR_REMOTE"
echo "PLANNOTATOR_PORT=$PLANNOTATOR_PORT"
echo "PLANNOTATOR_BROWSER=$PLANNOTATOR_BROWSER"
echo "PLANNOTATOR_SHARE=$PLANNOTATOR_SHARE"
```

```powershell
# Windows PowerShell
Write-Host "PLANNOTATOR_REMOTE=$env:PLANNOTATOR_REMOTE"
Write-Host "PLANNOTATOR_PORT=$env:PLANNOTATOR_PORT"
Write-Host "PLANNOTATOR_BROWSER=$env:PLANNOTATOR_BROWSER"
Write-Host "PLANNOTATOR_SHARE=$env:PLANNOTATOR_SHARE"
```

**Lo que deberías ver**: Todas las variables de entorno configuradas y sus valores.

**Ejemplo de salida esperada** (configuración de entorno remoto):
```bash
PLANNOTATOR_REMOTE=1
PLANNOTATOR_PORT=19432
PLANNOTATOR_BROWSER=
PLANNOTATOR_SHARE=
```

**Ejemplo de salida esperada** (configuración de entorno local):
```bash
PLANNOTATOR_REMOTE=
PLANNOTATOR_PORT=
PLANNOTATOR_BROWSER=Google Chrome
PLANNOTATOR_SHARE=disabled
```

## Errores Comunes

### Error 1: Las Variables de Entorno No Surten Efecto

**Síntoma**: Después de configurar las variables de entorno, el comportamiento de Plannotator no cambia.

**Causa**: Las variables de entorno solo surten efecto en nuevas sesiones de terminal, o la aplicación necesita reiniciarse.

**Solución**:
- Confirma que las variables de entorno estén escritas permanentemente en el archivo de configuración (como `~/.bashrc`)
- Reinicia el terminal o ejecuta `source ~/.bashrc`
- Reinicia Claude Code u OpenCode

### Error 2: Puerto Ocupado

**Síntoma**: Después de configurar `PLANNOTATOR_PORT`, el inicio falla.

**Causa**: El puerto especificado ya está siendo usado por otro proceso.

**Solución**:
```bash
# Verificar ocupación del puerto (macOS/Linux)
lsof -i :19432

# Cambiar a otro puerto
export PLANNOTATOR_PORT=19433
```

### Error 3: Ruta del Navegador Incorrecta

**Síntoma**: Después de configurar `PLANNOTATOR_BROWSER`, el navegador no se abre.

**Causa**: La ruta es incorrecta o el archivo no existe.

**Solución**:
- macOS: Usa el nombre de la aplicación en lugar de la ruta completa (como `Google Chrome`)
- Linux/Windows: Usa los comandos `which` o `where` para confirmar la ruta del ejecutable
  ```bash
  which firefox  # Linux
  where chrome   # Windows
  ```

### Error 4: El Navegador Se Abre Inesperadamente en Modo Remoto

**Síntoma**: Después de configurar `PLANNOTATOR_REMOTE=1`, el navegador aún se abre en el servidor remoto.

**Causa**: El valor de `PLANNOTATOR_REMOTE` no es `"1"` o `"true"`.

**Solución**:
```bash
# Valores correctos
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_REMOTE=true

# Valores incorrectos (no funcionarán)
export PLANNOTATOR_REMOTE=yes
export PLANNOTATOR_REMOTE=enabled
```

### Error 5: La Opción de Compartir URL Sigue Visible Después de Deshabilitarla

**Síntoma**: Después de configurar `PLANNOTATOR_SHARE=disabled`, "Share as URL" sigue visible.

**Causa**: La aplicación necesita reiniciarse para que surta efecto.

**Solución**: Reinicia Claude Code u OpenCode.

## Resumen de la Lección

Esta lección cubrió las 4 variables de entorno principales de Plannotator:

| Variable de Entorno | Propósito | Valor Predeterminado | Caso de Uso |
| --- | --- | --- | --- |
| `PLANNOTATOR_REMOTE` | Interruptor de modo remoto | No establecido (modo local) | SSH, Devcontainer, WSL |
| `PLANNOTATOR_PORT` | Puerto fijo | Modo remoto 19432, modo local aleatorio | Reenvío de puertos o evitar conflictos |
| `PLANNOTATOR_BROWSER` | Navegador personalizado | Navegador predeterminado del sistema | Usar un navegador específico |
| `PLANNOTATOR_SHARE` | Interruptor de compartir URL | No establecido (habilitado) | Deshabilitar función de compartir |

**Puntos clave**:
- El modo remoto usa automáticamente un puerto fijo y deshabilita la apertura automática del navegador
- Las variables de entorno establecidas explícitamente tienen prioridad sobre el comportamiento predeterminado
- Los cambios en las variables de entorno requieren reiniciar la aplicación para surtir efecto
- Los entornos empresariales pueden necesitar deshabilitar la función de compartir URL

## Próxima Lección

> En la próxima lección aprenderemos **[Solución de Problemas Comunes](../../faq/common-problems/)**.
>
> Aprenderás:
> - Cómo resolver problemas de puertos ocupados
> - Manejar situaciones donde el navegador no se abre
> - Corregir errores cuando los planes no se muestran
> - Técnicas de depuración y cómo ver los logs

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Función | Ruta del Archivo | Líneas |
| --- | --- | --- |
| Detección de modo remoto | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | 16-29 |
| Lógica de obtención de puerto | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | 34-49 |
| Lógica de apertura del navegador | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts) | 45-74 |
| Interruptor de compartir URL (Hook) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts) | 44 |
| Interruptor de compartir URL (OpenCode) | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 37-51 |

**Constantes clave**:
- `DEFAULT_REMOTE_PORT = 19432`: Puerto predeterminado del modo remoto

**Funciones clave**:
- `isRemoteSession()`: Detecta si se está ejecutando en un entorno remoto (SSH, Devcontainer, WSL)
- `getServerPort()`: Obtiene el puerto del servidor (prioridad: variable de entorno, luego predeterminado remoto, luego aleatorio)
- `openBrowser(url)`: Abre la URL en el navegador especificado o en el navegador predeterminado del sistema

</details>
