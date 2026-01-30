---
title: "Modo Remoto: Guía de Configuración | plannotator"
subtitle: "Modo Remoto: Guía de Configuración | plannotator"
sidebarTitle: "Acceder a Plannotator en Entornos Remotos"
description: "Aprende a configurar el modo remoto de Plannotator. Configura puertos fijos, reenvío de puertos y accede a la interfaz de revisión desde tu navegador local en entornos SSH, Devcontainer y WSL."
tags:
  - "Desarrollo remoto"
  - "Devcontainer"
  - "Reenvío de puertos"
  - "SSH"
  - "WSL"
prerequisite:
  - "start-getting-started"
order: 4
---

# Configuración del Modo Remoto/Devcontainer

## Lo que aprenderás

- Usar Plannotator en un servidor remoto conectado por SSH
- Configurar y acceder a Plannotator en un devcontainer de VS Code
- Usar Plannotator en un entorno WSL (Windows Subsystem for Linux)
- Configurar el reenvío de puertos para acceder a Plannotator desde tu navegador local

## El problema que enfrentas

Estás usando Claude Code u OpenCode en un servidor remoto, devcontainer o entorno WSL. Cuando la IA genera un plan o necesita una revisión de código, Plannotator intenta abrir un navegador en el entorno remoto, pero no hay interfaz gráfica disponible, o prefieres ver la interfaz de revisión en tu navegador local.

## Cuándo usar esta técnica

Escenarios típicos que requieren el modo Remoto/Devcontainer:

| Escenario | Descripción |
| --- | --- |
| **Conexión SSH** | Te conectas a un servidor de desarrollo remoto vía SSH |
| **Devcontainer** | Desarrollas usando devcontainers en VS Code |
| **WSL** | Desarrollas en Linux usando WSL en Windows |
| **Entorno en la nube** | Tu código se ejecuta en un contenedor o máquina virtual en la nube |

## Concepto clave

Usar Plannotator en un entorno remoto requiere resolver dos problemas:

1. **Puerto fijo**: Los entornos remotos no pueden seleccionar automáticamente puertos aleatorios porque necesitas configurar el reenvío de puertos
2. **Acceso al navegador**: Los entornos remotos no tienen interfaz gráfica, por lo que necesitas acceder desde el navegador de tu máquina local

Plannotator entra automáticamente en "modo remoto" al detectar la variable de entorno `PLANNOTATOR_REMOTE`:
- Usa un puerto fijo (19432 por defecto) en lugar de un puerto aleatorio
- Omite la apertura automática del navegador
- Muestra la URL en la terminal para que puedas acceder manualmente desde tu navegador local

## 🎒 Antes de empezar

::: warning Requisitos previos

Antes de comenzar este tutorial, asegúrate de:
- Haber completado la [Guía de inicio rápido](../../start/getting-started/)
- Tener instalado y configurado el [plugin de Claude Code](../../start/installation-claude-code/) o el [plugin de OpenCode](../../start/installation-opencode/)
- Comprender los conceptos básicos de configuración de SSH o devcontainer

:::

---

## Paso a paso

### Paso 1: Comprender las variables de entorno del modo remoto

El modo remoto de Plannotator depende de tres variables de entorno:

| Variable de entorno | Descripción | Valor por defecto |
| --- | --- | --- |
| `PLANNOTATOR_REMOTE` | Habilita el modo remoto | No establecida (modo local) |
| `PLANNOTATOR_PORT` | Número de puerto fijo | Aleatorio (local) / 19432 (remoto) |
| `PLANNOTATOR_BROWSER` | Ruta personalizada del navegador | Navegador predeterminado del sistema |

**Por qué**

- `PLANNOTATOR_REMOTE` indica a Plannotator que está en un entorno remoto y no debe intentar abrir un navegador
- `PLANNOTATOR_PORT` establece un puerto fijo para facilitar la configuración del reenvío de puertos
- `PLANNOTATOR_BROWSER` (opcional) especifica la ruta del navegador a usar en tu máquina local

---

### Paso 2: Configuración en un servidor remoto SSH

#### Configurar el reenvío de puertos SSH

Edita tu archivo de configuración SSH `~/.ssh/config`:

```bash
Host your-server
    HostName your-server.com
    User your-username
    LocalForward 9999 localhost:9999
```

**Deberías ver**:
- Se ha añadido la línea `LocalForward 9999 localhost:9999`
- Esto reenviará el tráfico del puerto local 9999 al puerto 9999 del servidor remoto

#### Establecer variables de entorno en el servidor remoto

Después de conectarte al servidor remoto, establece las variables de entorno en la terminal:

```bash
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999
```

**Por qué**
- `PLANNOTATOR_REMOTE=1` habilita el modo remoto
- `PLANNOTATOR_PORT=9999` usa el puerto fijo 9999 (coincide con el puerto en la configuración SSH)

::: tip Configuración persistente
Si establecer las variables de entorno manualmente cada vez que te conectas es tedioso, puedes añadirlas a tu archivo de configuración del shell (`~/.bashrc` o `~/.zshrc`):

```bash
echo 'export PLANNOTATOR_REMOTE=1' >> ~/.bashrc
echo 'export PLANNOTATOR_PORT=9999' >> ~/.bashrc
source ~/.bashrc
```
:::

#### Usar Plannotator

Ahora puedes usar Claude Code u OpenCode normalmente en el servidor remoto. Cuando la IA genere un plan o necesite una revisión de código:

```bash
# En el servidor remoto, la terminal mostrará algo como:
[Plannotator] Server running at http://localhost:9999
[Plannotator] Access from your local machine: http://localhost:9999
```

**Deberías ver**:
- La terminal muestra la URL de Plannotator
- El entorno remoto no abre un navegador (comportamiento esperado)

#### Acceder desde tu navegador local

Abre en el navegador de tu máquina local:

```
http://localhost:9999
```

**Deberías ver**:
- La interfaz de revisión de Plannotator se muestra correctamente
- Puedes realizar revisiones de planes o código como si estuvieras en un entorno local

**Punto de verificación ✅**:
- [ ] Reenvío de puertos SSH configurado
- [ ] Variables de entorno establecidas
- [ ] La terminal del servidor remoto muestra la URL
- [ ] El navegador local puede acceder a la interfaz de revisión

---

### Paso 3: Configuración en VS Code Devcontainer

#### Configurar el devcontainer

Edita tu archivo `.devcontainer/devcontainer.json`:

```json
{
  "name": "Your Devcontainer",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",

  "containerEnv": {
    "PLANNOTATOR_REMOTE": "1",
    "PLANNOTATOR_PORT": "9999"
  },

  "forwardPorts": [9999]
}
```

**Por qué**
- `containerEnv` establece las variables de entorno dentro del contenedor
- `forwardPorts` indica a VS Code que reenvíe automáticamente los puertos del contenedor a tu máquina local

#### Reconstruir e iniciar el devcontainer

1. Abre la paleta de comandos de VS Code (`Ctrl+Shift+P` o `Cmd+Shift+P`)
2. Escribe `Dev Containers: Rebuild Container` y ejecútalo
3. Espera a que el contenedor termine de reconstruirse

**Deberías ver**:
- VS Code muestra el estado del reenvío de puertos en la esquina inferior derecha (generalmente un pequeño icono)
- Al hacer clic, puedes ver que "Port 9999" está reenviado

#### Usar Plannotator

Usa Claude Code u OpenCode normalmente en el devcontainer. Cuando la IA genere un plan:

```bash
# Salida de la terminal del contenedor:
[Plannotator] Server running at http://localhost:9999
```

**Deberías ver**:
- La terminal muestra la URL de Plannotator
- El contenedor no abre un navegador (comportamiento esperado)

#### Acceder desde tu navegador local

Abre en el navegador de tu máquina local:

```
http://localhost:9999
```

**Deberías ver**:
- La interfaz de revisión de Plannotator se muestra correctamente

**Punto de verificación ✅**:
- [ ] Configuración del devcontainer con variables de entorno y reenvío de puertos añadida
- [ ] Contenedor reconstruido
- [ ] VS Code muestra que el puerto está reenviado
- [ ] El navegador local puede acceder a la interfaz de revisión

---

### Paso 4: Configuración en entorno WSL

La configuración del entorno WSL es similar a la conexión SSH, pero no necesitas configurar manualmente el reenvío de puertos: WSL reenvía automáticamente el tráfico de localhost al sistema Windows.

#### Establecer variables de entorno

Establece las variables de entorno en la terminal de WSL:

```bash
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999
```

::: tip Configuración persistente
Añade estas variables de entorno a tu archivo de configuración del shell de WSL (`~/.bashrc` o `~/.zshrc`):

```bash
echo 'export PLANNOTATOR_REMOTE=1' >> ~/.bashrc
echo 'export PLANNOTATOR_PORT=9999' >> ~/.bashrc
source ~/.bashrc
```
:::

#### Usar Plannotator

Usa Claude Code u OpenCode normalmente en WSL:

```bash
# Salida de la terminal de WSL:
[Plannotator] Server running at http://localhost:9999
```

**Deberías ver**:
- La terminal muestra la URL de Plannotator
- WSL no abre un navegador (comportamiento esperado)

#### Acceder desde el navegador de Windows

Abre en el navegador de Windows:

```
http://localhost:9999
```

**Deberías ver**:
- La interfaz de revisión de Plannotator se muestra correctamente

**Punto de verificación ✅**:
- [ ] Variables de entorno establecidas
- [ ] La terminal de WSL muestra la URL
- [ ] El navegador de Windows puede acceder a la interfaz de revisión

---

## Solución de problemas

### Puerto ya en uso

Si ves un error como este:

```
Error: bind: EADDRINUSE: address already in use :::9999
```

**Solución**:
1. Cambia el número de puerto:
   ```bash
   export PLANNOTATOR_PORT=10000  # Usa un puerto que no esté en uso
   ```
2. O detén el proceso que está usando el puerto 9999:
   ```bash
   lsof -ti:9999 | xargs kill -9
   ```

### El reenvío de puertos SSH no funciona

Si tu navegador local no puede acceder a Plannotator:

**Lista de verificación**:
- [ ] El número de puerto en `LocalForward` del archivo de configuración SSH coincide con `PLANNOTATOR_PORT`
- [ ] Te has desconectado y reconectado a SSH
- [ ] El firewall no está bloqueando el reenvío de puertos

### El reenvío de puertos del Devcontainer no funciona

Si VS Code no reenvía automáticamente el puerto:

**Solución**:
1. Verifica la configuración de `forwardPorts` en `.devcontainer/devcontainer.json`
2. Reenvía el puerto manualmente:
   - Abre la paleta de comandos de VS Code
   - Ejecuta `Forward a Port`
   - Introduce el número de puerto `9999`

### No se puede acceder desde WSL

Si el navegador de Windows no puede acceder a Plannotator en WSL:

**Solución**:
1. Verifica que las variables de entorno estén configuradas correctamente
2. Intenta usar `0.0.0.0` en lugar de `localhost` (dependiendo de la versión de WSL y la configuración de red)
3. Verifica la configuración del firewall de Windows

---

## Resumen

Puntos clave del modo Remoto/Devcontainer:

| Punto clave | Descripción |
| --- | --- |
| **Variables de entorno** | `PLANNOTATOR_REMOTE=1` habilita el modo remoto |
| **Puerto fijo** | Usa `PLANNOTATOR_PORT` para establecer un puerto fijo (19432 por defecto) |
| **Reenvío de puertos** | SSH/Devcontainer requieren configuración de reenvío de puertos; WSL lo hace automáticamente |
| **Acceso manual** | El modo remoto no abre automáticamente el navegador; debes acceder manualmente desde tu navegador local |
| **Persistencia** | Añade las variables de entorno a los archivos de configuración para evitar configuraciones repetidas |

---

## Próxima lección

> En la próxima lección aprenderemos sobre la **[Guía detallada de variables de entorno](../environment-variables/)**.
>
> Aprenderás:
> - Todas las variables de entorno disponibles en Plannotator
> - El propósito y valor por defecto de cada variable de entorno
> - Cómo combinar variables de entorno para diferentes escenarios

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-24

| Funcionalidad | Ruta del archivo | Líneas |
| --- | --- | --- |
| Detección de sesión remota | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts#L16-L29) | 16-29 |
| Obtención del puerto del servidor | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts#L34-L49) | 34-49 |
| Lógica de inicio del servidor | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L97) | 91-97 |
| Lógica de apertura del navegador | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts#L45-L74) | 45-74 |
| Detección de WSL | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts#L11-L34) | 11-34 |

**Constantes clave**:
- `DEFAULT_REMOTE_PORT = 19432`: Puerto por defecto del modo remoto

**Funciones clave**:
- `isRemoteSession()`: Detecta si se está ejecutando en una sesión remota
- `getServerPort()`: Obtiene el puerto del servidor (puerto fijo para remoto, aleatorio para local)
- `openBrowser(url)`: Abre el navegador de forma multiplataforma

</details>
