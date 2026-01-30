---
title: "Claude Code: Instalación y Configuración | Plannotator"
sidebarTitle: "Instalación en 3 minutos"
subtitle: "Claude Code: Instalación y Configuración"
description: "Aprende a instalar el plugin de Plannotator en Claude Code. Completa la configuración en 3 minutos, compatible con sistema de plugins y Hook manual, para macOS, Linux y Windows, incluyendo configuración de entornos remotos y Devcontainer."
tags:
  - "installation"
  - "claude-code"
  - "getting-started"
prerequisite:
  - "start-getting-started"
order: 2
---

# Instalar plugin para Claude Code

## Lo que aprenderás

- Habilitar la función de revisión de planes de Plannotator en Claude Code
- Elegir el método de instalación adecuado para ti (sistema de plugins o Hook manual)
- Verificar que la instalación fue exitosa
- Configurar correctamente Plannotator en entornos remotos/Devcontainer

## Tu situación actual

Al usar Claude Code, los planes generados por IA solo se pueden leer en la terminal, lo que dificulta realizar revisiones y feedback precisos. Quieres:
- Visualizar los planes de IA en el navegador
- Realizar anotaciones precisas en los planes (eliminar, reemplazar, insertar)
- Dar instrucciones de modificación claras a la IA de una sola vez

## Cuándo usar esta técnica

Adecuado para los siguientes escenarios:
- Es tu primera vez usando Claude Code + Plannotator
- Necesitas reinstalar o actualizar Plannotator
- Quieres usarlo en entornos remotos (SSH, Devcontainer, WSL)

## Concepto central

La instalación de Plannotator se divide en dos partes:
1. **Instalar el comando CLI**: Este es el runtime principal, responsable de iniciar el servidor local y el navegador
2. **Configurar Claude Code**: A través del sistema de plugins o Hook manual, hacer que Claude Code llame automáticamente a Plannotator al completar un plan

Una vez completada la instalación, cuando Claude Code llame a `ExitPlanMode`, se activará automáticamente Plannotator, abriendo la interfaz de revisión de planes en el navegador.

## 🎒 Preparación previa

::: warning Verificación de requisitos previos

- [ ] Claude Code 2.1.7 o superior instalado (requiere soporte para Permission Request Hooks)
- [ ] Permisos para ejecutar comandos en la terminal (Linux/macOS requiere sudo o instalación en el directorio home)

:::

## Paso a paso

### Paso 1: Instalar el comando CLI de Plannotator

Primero, instala la herramienta de línea de comandos de Plannotator.

::: code-group

```bash [macOS / Linux / WSL]
curl -fsSL https://plannotator.ai/install.sh | bash
```

```powershell [Windows PowerShell]
irm https://plannotator.ai/install.ps1 | iex
```

```cmd [Windows CMD]
curl -fsSL https://plannotator.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

:::

**Deberías ver**: La terminal muestra el progreso de instalación, al completar muestra `plannotator {versión} installed to {ruta de instalación}/plannotator`

**Punto de verificación ✅**: Ejecuta el siguiente comando para verificar la instalación:

::: code-group

```bash [macOS / Linux]
which plannotator
```

```powershell [Windows PowerShell]
Get-Command plannotator
```

```cmd [Windows CMD]
where plannotator
```

:::

Deberías ver la ruta de instalación del comando Plannotator, por ejemplo `/usr/local/bin/plannotator` o `$HOME/.local/bin/plannotator`.

### Paso 2: Instalar el plugin en Claude Code

Abre Claude Code y ejecuta los siguientes comandos:

```bash
/plugin marketplace add backnotprop/plannotator
/plugin install plannotator@plannotator
```

**Deberías ver**: Mensaje de confirmación de instalación exitosa del plugin.

::: danger Importante: Debes reiniciar Claude Code

Después de instalar el plugin, **debes reiniciar Claude Code**, de lo contrario los Hooks no se activarán.

:::

### Paso 3: Verificar la instalación

Después de reiniciar, ejecuta el siguiente comando en Claude Code para probar la función de revisión de código:

```bash
/plannotator-review
```

**Deberías ver**:
- El navegador abre automáticamente la interfaz de revisión de código de Plannotator
- La terminal muestra "Opening code review..." y espera tu feedback de revisión

Si ves esta salida, ¡felicidades, la instalación fue exitosa!

::: tip Nota
La función de revisión de planes se activará automáticamente cuando Claude Code llame a `ExitPlanMode`, no necesitas ejecutar el comando de prueba manualmente. Puedes probar esta función al usar el modo de planificación en uso real.
:::

### Paso 4: (Opcional) Instalación manual de Hook

Si no quieres usar el sistema de plugins, o necesitas usarlo en un entorno CI/CD, puedes configurar el Hook manualmente.

Edita el archivo `~/.claude/settings.json` (créalo si no existe), añade el siguiente contenido:

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "ExitPlanMode",
        "hooks": [
          {
            "type": "command",
            "command": "plannotator",
            "timeout": 1800
          }
        ]
      }
    ]
  }
}
```

**Descripción de campos**:
- `matcher: "ExitPlanMode"` - Se activa cuando Claude Code llama a ExitPlanMode
- `command: "plannotator"` - Ejecuta el comando CLI de Plannotator instalado
- `timeout: 1800` - Tiempo de espera (30 minutos), te da suficiente tiempo para revisar el plan

**Punto de verificación ✅**: Después de guardar el archivo, reinicia Claude Code, luego ejecuta `/plannotator-review` para probar.

### Paso 5: (Opcional) Configuración remota/Devcontainer

Si usas Claude Code en entornos remotos como SSH, Devcontainer o WSL, necesitas configurar variables de entorno para fijar el puerto y deshabilitar la apertura automática del navegador.

Ejecuta en el entorno remoto:

```bash
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999  # Elige un puerto al que accederás mediante port forwarding
```

**Estas variables**:
- Usan un puerto fijo (en lugar de uno aleatorio), facilitando la configuración de port forwarding
- Omiten la apertura automática del navegador (porque el navegador está en tu máquina local)
- Imprimen la URL en la terminal, puedes copiarla y abrirla en el navegador local

::: tip Port Forwarding

**VS Code Devcontainer**: Los puertos generalmente se reenvían automáticamente, verifica la pestaña "Ports" de VS Code para confirmar.

**SSH Port Forwarding**: Edita `~/.ssh/config`, añade:

```bash
Host your-server
    LocalForward 9999 localhost:9999
```

:::

## Solución de problemas

### Problema 1: El comando `/plannotator-review` no responde después de la instalación

**Causa**: Olvidaste reiniciar Claude Code, los Hooks no se activaron.

**Solución**: Cierra completamente Claude Code y vuelve a abrirlo.

### Problema 2: El script de instalación falla

**Causa**: Problemas de red o permisos insuficientes.

**Solución**:
- Verifica la conexión de red, asegúrate de poder acceder a `https://plannotator.ai`
- Si encuentras problemas de permisos, intenta descargar manualmente el script de instalación y ejecutarlo

### Problema 3: El navegador no se puede abrir en entorno remoto

**Causa**: El entorno remoto no tiene interfaz gráfica, el navegador no puede iniciarse.

**Solución**: Configura la variable de entorno `PLANNOTATOR_REMOTE=1` y configura port forwarding.

### Problema 4: Puerto ocupado

**Causa**: El puerto fijo `9999` ya está siendo usado por otro programa.

**Solución**: Elige otro puerto disponible, por ejemplo `8888` o `19432`.

## Resumen de la lección

- ✅ Instalaste el comando CLI de Plannotator
- ✅ Configuraste Claude Code mediante el sistema de plugins o Hook manual
- ✅ Verificaste que la instalación fue exitosa
- ✅ (Opcional) Configuraste el entorno remoto/Devcontainer

## Próxima lección

> En la próxima lección aprenderemos sobre **[Instalar plugin para OpenCode](../installation-opencode/)**.
>
> Si usas OpenCode en lugar de Claude Code, la próxima lección te enseñará a completar una configuración similar en OpenCode.

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para ver las ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-24

| Función | Ruta del archivo | Líneas |
| --- | --- | --- |
| Punto de entrada del script de instalación | [`README.md`](https://github.com/backnotprop/plannotator/blob/main/README.md#L35-L60) | 35-60 |
| Descripción de configuración de Hook | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L30-L39) | 30-39 |
| Ejemplo de Hook manual | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L42-L62) | 42-62 |
| Configuración de variables de entorno | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L73-L79) | 73-79 |
| Configuración de modo remoto | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L81-L94) | 81-94 |

**Constantes clave**:
- `PLANNOTATOR_REMOTE = "1"`: Habilita el modo remoto, usa puerto fijo
- `PLANNOTATOR_PORT = 9999`: Puerto fijo usado en modo remoto (por defecto 19432)
- `timeout: 1800`: Tiempo de espera del Hook (30 minutos)

**Variables de entorno clave**:
- `PLANNOTATOR_REMOTE`: Indicador de modo remoto
- `PLANNOTATOR_PORT`: Número de puerto fijo
- `PLANNOTATOR_BROWSER`: Ruta personalizada del navegador

</details>
