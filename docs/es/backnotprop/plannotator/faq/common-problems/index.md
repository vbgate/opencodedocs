---
title: "Preguntas Frecuentes: Guía de Solución de Problemas | Plannotator"
sidebarTitle: "Solución de Problemas"
subtitle: "Preguntas Frecuentes: Guía de Solución de Problemas"
description: "Aprende a diagnosticar y resolver problemas comunes de Plannotator. Soluciona rápidamente conflictos de puertos, navegador no abierto, errores de Git, carga de imágenes y problemas de integración."
tags:
  - "Preguntas frecuentes"
  - "Solución de problemas"
  - "Conflicto de puertos"
  - "Navegador"
  - "Git"
  - "Entorno remoto"
  - "Problemas de integración"
prerequisite:
  - "start-getting-started"
  - "start-installation-claude-code"
  - "start-installation-opencode"
order: 1
---

# Preguntas Frecuentes

## Lo que aprenderás

- ✅ Diagnosticar y resolver rápidamente problemas de conflicto de puertos
- ✅ Entender por qué el navegador no se abre automáticamente y cómo acceder
- ✅ Solucionar problemas cuando el plan o la revisión de código no se muestra
- ✅ Manejar fallos en la ejecución de comandos Git
- ✅ Resolver errores relacionados con la carga de imágenes
- ✅ Diagnosticar fallos en la integración con Obsidian/Bear
- ✅ Acceder correctamente a Plannotator en entornos remotos

## Tu situación actual

Al usar Plannotator, podrías encontrar estos problemas:

- **Problema 1**: Al iniciar, aparece un error de puerto ocupado y el servidor no puede arrancar
- **Problema 2**: El navegador no se abre automáticamente y no sabes cómo acceder a la interfaz de revisión
- **Problema 3**: La página de revisión de plan o código aparece en blanco, el contenido no carga
- **Problema 4**: Al ejecutar `/plannotator-review` aparece un error de Git
- **Problema 5**: La carga de imágenes falla o las imágenes no se muestran
- **Problema 6**: Configuraste la integración con Obsidian/Bear, pero el plan no se guarda automáticamente
- **Problema 7**: No puedes acceder al servidor local en un entorno remoto

Estos problemas interrumpen tu flujo de trabajo y afectan la experiencia de uso.

## Concepto clave

::: info Mecanismo de manejo de errores

El servidor de Plannotator implementa un **mecanismo de reintento automático**:

- **Máximo de reintentos**: 5 veces
- **Retraso entre reintentos**: 500 milisegundos
- **Escenario aplicable**: Puerto ocupado (error EADDRINUSE)

Si hay un conflicto de puerto, el sistema intentará automáticamente otros puertos. Solo reportará un error si falla después de 5 reintentos.

:::

El manejo de errores de Plannotator sigue estos principios:

1. **Prioridad local**: Todos los mensajes de error se muestran en la terminal o consola
2. **Degradación elegante**: Los fallos de integración (como guardar en Obsidian) no bloquean el flujo principal
3. **Mensajes claros**: Proporciona información específica del error y soluciones sugeridas

## Problemas comunes y soluciones

### Problema 1: Puerto ocupado

**Mensaje de error**:

```
Port 19432 in use after 5 retries
```

**Análisis de la causa**:

- El puerto ya está ocupado por otro proceso
- En modo remoto, se configuró un puerto fijo pero hay conflicto
- El proceso anterior de Plannotator no terminó correctamente

**Soluciones**:

#### Método 1: Esperar el reintento automático (solo modo local)

En modo local, Plannotator intentará automáticamente puertos aleatorios. Si ves un error de puerto ocupado, generalmente significa:

- Los 5 puertos aleatorios están ocupados (muy raro)
- Se configuró un puerto fijo (`PLANNOTATOR_PORT`) pero hay conflicto

**Deberías ver**: La terminal muestra "Port X in use after 5 retries"

#### Método 2: Usar un puerto fijo (modo remoto)

En entornos remotos, necesitas configurar `PLANNOTATOR_PORT`:

::: code-group

```bash [macOS/Linux]
export PLANNOTATOR_PORT=9999
plannotator start
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_PORT = "9999"
plannotator start
```

:::

::: tip Recomendaciones para elegir puerto

- Elige un puerto en el rango 1024-49151 (puertos de usuario)
- Evita puertos de servicios comunes (80, 443, 3000, 5000, etc.)
- Asegúrate de que el puerto no esté bloqueado por el firewall

:::

#### Método 3: Liberar el proceso que ocupa el puerto

```bash
# Encontrar el proceso que ocupa el puerto (reemplaza 19432 con tu puerto)
lsof -i :19432  # macOS/Linux
netstat -ano | findstr :19432  # Windows

# Terminar el proceso (reemplaza PID con el ID real del proceso)
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

::: warning Precaución

Antes de terminar un proceso, confirma que no sea otra aplicación importante. Plannotator cierra automáticamente el servidor después de recibir una decisión, normalmente no necesitas terminarlo manualmente.

:::

---

### Problema 2: El navegador no se abre automáticamente

**Síntoma**: La terminal muestra que el servidor está iniciado, pero el navegador no se abre.

**Análisis de la causa**:

| Escenario | Causa |
| --- | --- |
| Entorno remoto | Plannotator detectó modo remoto y omite la apertura automática del navegador |
| Configuración incorrecta de `PLANNOTATOR_BROWSER` | La ruta o nombre del navegador es incorrecto |
| Navegador no instalado | El navegador predeterminado del sistema no existe |

**Soluciones**:

#### Escenario 1: Entorno remoto (SSH, Devcontainer, WSL)

**Verificar si es un entorno remoto**:

```bash
echo $PLANNOTATOR_REMOTE
# Si muestra "1" o "true", estás en modo remoto
```

**En un entorno remoto**:

1. **La terminal mostrará la URL de acceso**:

```
Plannotator running at: http://localhost:9999
Press Ctrl+C to stop
```

2. **Abre manualmente el navegador** y accede a la URL mostrada

3. **Configura el reenvío de puertos** (si necesitas acceder desde local)

**Deberías ver**: La terminal muestra algo como "Plannotator running at: http://localhost:19432"

#### Escenario 2: Modo local pero el navegador no se abre

**Verificar la configuración de `PLANNOTATOR_BROWSER`**:

::: code-group

```bash [macOS/Linux]
echo $PLANNOTATOR_BROWSER
# Debería mostrar el nombre o ruta del navegador
```

```powershell [Windows PowerShell]
echo $env:PLANNOTATOR_BROWSER
```

:::

**Limpiar la configuración personalizada del navegador**:

::: code-group

```bash [macOS/Linux]
unset PLANNOTATOR_BROWSER
plannotator start
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_BROWSER = ""
plannotator start
```

:::

**Configurar el navegador correcto** (si necesitas personalizar):

```bash
# macOS: usar el nombre de la aplicación
export PLANNOTATOR_BROWSER="Google Chrome"

# Linux: usar la ruta del ejecutable
export PLANNOTATOR_BROWSER="/usr/bin/google-chrome"

# Windows: usar la ruta del ejecutable
set PLANNOTATOR_BROWSER="C:\Program Files\Google\Chrome\Application\chrome.exe"
```

---

### Problema 3: El plan o la revisión de código no se muestra

**Síntoma**: El navegador se abre, pero la página aparece en blanco o no carga.

**Posibles causas**:

| Causa | Revisión de plan | Revisión de código |
| --- | --- | --- |
| Parámetro Plan vacío | ✅ Común | ❌ No aplica |
| Problema con el repositorio Git | ❌ No aplica | ✅ Común |
| Sin diff para mostrar | ❌ No aplica | ✅ Común |
| Fallo al iniciar el servidor | ✅ Posible | ✅ Posible |

**Soluciones**:

#### Caso 1: La revisión de plan no se muestra

**Verificar la salida de la terminal**:

```bash
# Buscar mensajes de error
plannotator start 2>&1 | grep -i error
```

**Error común 1**: Parámetro Plan vacío

**Mensaje de error**:

```
400 Bad Request - Missing plan or plan is empty
```

**Causa**: Claude Code u OpenCode pasó un plan vacío.

**Solución**:

- Confirma que el AI Agent generó contenido de plan válido
- Verifica que la configuración del Hook o Plugin sea correcta
- Revisa los logs de Claude Code/OpenCode para más información

**Error común 2**: El servidor no inició correctamente

**Solución**:

- Verifica si la terminal muestra el mensaje "Plannotator running at"
- Si no, consulta "Problema 1: Puerto ocupado"
- Revisa [Configuración de variables de entorno](../../advanced/environment-variables/) para confirmar la configuración correcta

#### Caso 2: La revisión de código no se muestra

**Verificar la salida de la terminal**:

```bash
/plannotator-review 2>&1 | grep -i error
```

**Error común 1**: Sin repositorio Git

**Mensaje de error**:

```
fatal: not a git repository
```

**Solución**:

```bash
# Inicializar repositorio Git
git init

# Agregar archivos y hacer commit (si hay cambios sin confirmar)
git add .
git commit -m "Initial commit"

# Ejecutar de nuevo
/plannotator-review
```

**Deberías ver**: El navegador muestra el visor de diff

**Error común 2**: Sin diff para mostrar

**Síntoma**: La página muestra "No changes" o un mensaje similar.

**Solución**:

```bash
# Verificar si hay cambios sin confirmar
git status

# Verificar si hay cambios en staging
git diff --staged

# Verificar si hay commits
git log --oneline

# Cambiar el tipo de diff para ver diferentes rangos
# En la interfaz de revisión de código, haz clic en el menú desplegable:
# - Uncommitted changes
# - Staged changes
# - Last commit
# - vs main (si estás en una rama)
```

**Deberías ver**: El visor de diff muestra los cambios de código o indica "No changes"

**Error común 3**: Fallo en la ejecución del comando Git

**Mensaje de error**:

```
Git diff error for uncommitted: [mensaje de error específico]
```

**Posibles causas**:

- Git no está instalado
- Versión de Git muy antigua
- Problema de configuración de Git

**Solución**:

```bash
# Verificar la versión de Git
git --version

# Probar el comando git diff
git diff HEAD

# Si Git funciona correctamente, el problema podría ser interno de Plannotator
# Revisa el mensaje de error completo y reporta el bug
```

---

### Problema 4: Fallo en la carga de imágenes

**Mensaje de error**:

```
400 Bad Request - No file provided
500 Internal Server Error - Upload failed
```

**Posibles causas**:

| Causa | Solución |
| --- | --- |
| No se seleccionó archivo | Haz clic en el botón de carga y selecciona una imagen |
| Formato de archivo no soportado | Usa formato png/jpeg/webp |
| Archivo muy grande | Comprime la imagen antes de cargar |
| Problema de permisos en directorio temporal | Verifica los permisos del directorio /tmp/plannotator |

**Soluciones**:

#### Verificar el archivo a cargar

**Formatos soportados**:

- ✅ PNG (`.png`)
- ✅ JPEG (`.jpg`, `.jpeg`)
- ✅ WebP (`.webp`)

**Formatos no soportados**:

- ❌ BMP (`.bmp`)
- ❌ GIF (`.gif`)
- ❌ SVG (`.svg`)

**Deberías ver**: Después de una carga exitosa, la imagen se muestra en la interfaz de revisión

#### Verificar permisos del directorio temporal

Plannotator crea automáticamente el directorio `/tmp/plannotator`. Si la carga sigue fallando, verifica los permisos del directorio temporal del sistema.

**Si necesitas verificar manualmente**:

```bash
# Verificar permisos del directorio
ls -la /tmp/plannotator

# Verificación en Windows
dir %TEMP%\plannotator
```

**Deberías ver**: `drwxr-xr-x` (o permisos similares) indica que el directorio es escribible

#### Revisar las herramientas de desarrollador del navegador

1. Presiona F12 para abrir las herramientas de desarrollador
2. Cambia a la pestaña "Network"
3. Haz clic en el botón de carga
4. Busca la solicitud `/api/upload`
5. Verifica el estado y la respuesta de la solicitud

**Deberías ver**:
- Código de estado: 200 OK (éxito)
- Respuesta: `{"path": "/tmp/plannotator/xxx.png"}`

---

### Problema 5: Fallo en la integración con Obsidian/Bear

**Síntoma**: Después de aprobar el plan, no hay plan guardado en la aplicación de notas.

**Posibles causas**:

| Causa | Obsidian | Bear |
| --- | --- | --- |
| Integración no habilitada | ✅ | ✅ |
| Vault/App no detectado | ✅ | N/A |
| Ruta configurada incorrectamente | ✅ | ✅ |
| Conflicto de nombre de archivo | ✅ | ✅ |
| Fallo de x-callback-url | N/A | ✅ |

**Soluciones**:

#### Problemas de integración con Obsidian

**Paso 1: Verificar si la integración está habilitada**

1. En la UI de Plannotator, haz clic en configuración (icono de engranaje)
2. Busca la sección "Obsidian Integration"
3. Asegúrate de que el interruptor esté activado

**Deberías ver**: El interruptor aparece en azul (estado habilitado)

**Paso 2: Verificar la detección del Vault**

**Detección automática**:

- Plannotator lee automáticamente el archivo de configuración de Obsidian
- Ubicación del archivo de configuración:
  - macOS: `~/Library/Application Support/obsidian/obsidian.json`
  - Windows: `%APPDATA%\obsidian\obsidian.json`
  - Linux: `~/.config/obsidian/obsidian.json`

**Verificación manual**:

::: code-group

```bash [macOS]
cat ~/Library/Application\ Support/obsidian/obsidian.json
```

```powershell [Windows PowerShell]
cat $env:APPDATA\obsidian\obsidian.json
```

```bash [Linux]
cat ~/.config/obsidian/obsidian.json
```

:::

**Deberías ver**: Un archivo JSON que contiene el campo `vaults`

**Paso 3: Configurar manualmente la ruta del Vault**

Si la detección automática falla:

1. En la configuración de Plannotator
2. Haz clic en "Manually enter vault path"
3. Ingresa la ruta completa del Vault

**Rutas de ejemplo**:

- macOS: `/Users/tunombre/Documents/ObsidianVault`
- Windows: `C:\Users\tunombre\Documents\ObsidianVault`
- Linux: `/home/tunombre/Documents/ObsidianVault`

**Deberías ver**: El menú desplegable muestra el nombre del Vault que ingresaste

**Paso 4: Verificar la salida de la terminal**

El resultado de guardar en Obsidian se muestra en la terminal:

```bash
[Obsidian] Saved plan to: /path/to/vault/plannotator/Title - Jan 24, 2026 2-30pm.md
```

**Mensaje de error**:

```
[Obsidian] Save failed: [mensaje de error específico]
```

**Errores comunes**:

- Permisos insuficientes → Verifica los permisos del directorio del Vault
- Espacio en disco insuficiente → Libera espacio
- Ruta inválida → Confirma que la ruta esté escrita correctamente

#### Problemas de integración con Bear

**Verificar la aplicación Bear**

- Asegúrate de que Bear esté instalado en macOS
- Asegúrate de que la aplicación Bear esté ejecutándose

**Probar x-callback-url**:

```bash
# Probar en la terminal
open "bear://x-callback-url/create?title=Test&text=Hello"
```

**Deberías ver**: Bear se abre y crea una nueva nota

**Verificar la salida de la terminal**:

```bash
[Bear] Saved plan to Bear
```

**Mensaje de error**:

```
[Bear] Save failed: [mensaje de error específico]
```

**Solución**:

- Reinicia la aplicación Bear
- Confirma que Bear esté actualizado a la última versión
- Verifica la configuración de permisos de macOS (permitir que Bear acceda a archivos)

---

### Problema 6: Problemas de acceso en entorno remoto

**Síntoma**: En SSH, Devcontainer o WSL, no puedes acceder al servidor desde el navegador local.

**Concepto clave**:

::: info Qué es un entorno remoto

Un entorno remoto es un entorno de computación al que accedes a través de SSH, Devcontainer o WSL. En este entorno, necesitas usar **reenvío de puertos** para mapear el puerto remoto al local, para poder acceder al servidor remoto desde tu navegador local.

:::

**Soluciones**:

#### Paso 1: Configurar el modo remoto

Configura las variables de entorno en el entorno remoto:

::: code-group

```bash [macOS/Linux/WSL]
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999
```

```powershell [Windows]
$env:PLANNOTATOR_REMOTE = "1"
$env:PLANNOTATOR_PORT = "9999"
```

:::

**Deberías ver**: La terminal muestra "Using remote mode with fixed port: 9999"

#### Paso 2: Configurar el reenvío de puertos

**Escenario 1: Servidor remoto SSH**

Edita `~/.ssh/config`:

```
Host your-server
    HostName server.example.com
    User tunombre
    LocalForward 9999 localhost:9999
```

**Conectar al servidor**:

```bash
ssh your-server
```

**Deberías ver**: Después de establecer la conexión SSH, el puerto local 9999 se reenvía al puerto remoto 9999

**Escenario 2: VS Code Devcontainer**

VS Code Devcontainer generalmente reenvía puertos automáticamente.

**Cómo verificar**:

1. En VS Code, abre la pestaña "Ports"
2. Busca el puerto 9999
3. Asegúrate de que el estado del puerto sea "Forwarded"

**Deberías ver**: La pestaña Ports muestra "Local Address: localhost:9999"

**Escenario 3: WSL (Windows Subsystem for Linux)**

WSL usa `localhost` para el reenvío por defecto.

**Método de acceso**:

En el navegador de Windows, accede directamente a:

```
http://localhost:9999
```

**Deberías ver**: La UI de Plannotator se muestra correctamente

#### Paso 3: Verificar el acceso

1. Inicia Plannotator en el entorno remoto
2. En el navegador local, accede a `http://localhost:9999`
3. Confirma que la página se muestra correctamente

**Deberías ver**: La interfaz de revisión de plan o código carga correctamente

---

### Problema 7: Plan/anotaciones no se guardan correctamente

**Síntoma**: Después de aprobar o rechazar el plan, las anotaciones no se guardan, o se guardan en la ubicación incorrecta.

**Posibles causas**:

| Causa | Solución |
| --- | --- |
| Guardado de plan deshabilitado | Verifica la opción "Plan Save" en configuración |
| Ruta personalizada inválida | Verifica que la ruta sea escribible |
| Contenido de anotación vacío | Este es el comportamiento normal (solo guarda cuando hay anotaciones) |
| Problema de permisos del servidor | Verifica los permisos del directorio de guardado |

**Soluciones**:

#### Verificar la configuración de guardado de plan

1. En la UI de Plannotator, haz clic en configuración (icono de engranaje)
2. Revisa la sección "Plan Save"
3. Confirma que el interruptor esté habilitado

**Deberías ver**: El interruptor "Save plans and annotations" está en azul (estado habilitado)

#### Verificar la ruta de guardado

**Ubicación de guardado por defecto**:

```bash
~/.plannotator/plans/  # Los planes y anotaciones se guardan en este directorio
```

**Ruta personalizada**:

Puedes configurar una ruta de guardado personalizada en la configuración.

**Verificar que la ruta sea escribible**:

::: code-group

```bash [macOS/Linux]
ls -la ~/.plannotator
mkdir -p ~/.plannotator/plans
touch ~/.plannotator/plans/test.txt
rm ~/.plannotator/plans/test.txt
```

```powershell [Windows PowerShell]
dir $env:USERPROFILE\.plannotator
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.plannotator\plans"
```

:::

**Deberías ver**: Los comandos se ejecutan exitosamente, sin errores de permisos

#### Revisar la salida de la terminal

El resultado del guardado se muestra en la terminal:

```bash
[Plan] Saved annotations to: ~/.plannotator/annotations/slug.json
[Plan] Saved snapshot to: ~/.plannotator/plans/slug-approved.md
```

**Deberías ver**: Mensajes de éxito similares

---

## Resumen de la lección

En esta lección, aprendiste:

- **Diagnosticar problemas de puerto ocupado**: Usar un puerto fijo o liberar el proceso que lo ocupa
- **Manejar navegador no abierto**: Identificar el modo remoto, acceder manualmente o configurar el navegador
- **Solucionar contenido no mostrado**: Verificar el parámetro Plan, repositorio Git, estado del diff
- **Resolver fallos de carga de imágenes**: Verificar formato de archivo, permisos de directorio, herramientas de desarrollador
- **Arreglar fallos de integración**: Verificar configuración, rutas, permisos y salida de terminal
- **Configurar acceso remoto**: Usar PLANNOTATOR_REMOTE y reenvío de puertos
- **Guardar planes y anotaciones**: Habilitar guardado de plan y verificar permisos de ruta

**Recuerda**:

1. La salida de la terminal es la mejor fuente de información para depuración
2. Los entornos remotos requieren reenvío de puertos
3. Los fallos de integración no bloquean el flujo principal
4. Usa las herramientas de desarrollador para ver detalles de las solicitudes de red

## Próximos pasos

Si el problema que encontraste no está cubierto en esta lección, puedes consultar:

- [Solución de problemas](../troubleshooting/) - Técnicas avanzadas de depuración y análisis de logs
- [Referencia de API](../../appendix/api-reference/) - Conoce todos los endpoints de API y códigos de error
- [Modelos de datos](../../appendix/data-models/) - Conoce la estructura de datos de Plannotator

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver las ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-24

| Funcionalidad | Ruta del archivo | Líneas |
| --- | --- | --- |
| Lógica de inicio y reintento del servidor | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L79-L335) | 79-335 |
| Manejo de error de puerto ocupado (revisión de plan) | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L319-L334) | 319-334 |
| Manejo de error de puerto ocupado (revisión de código) | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L252-L267) | 252-267 |
| Detección de modo remoto | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | Completo |
| Lógica de apertura del navegador | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts) | Completo |
| Ejecución de comandos Git y manejo de errores | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L36-L147) | 36-147 |
| Manejo de carga de imágenes (revisión de plan) | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L153-L174) | 153-174 |
| Manejo de carga de imágenes (revisión de código) | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L181-L201) | 181-201 |
| Integración con Obsidian | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts) | Completo |
| Guardado de plan | [`packages/server/storage.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/storage.ts) | Completo |

**Constantes clave**:

| Constante | Valor | Descripción |
| --- | --- | --- |
| `MAX_RETRIES` | 5 | Máximo de reintentos de inicio del servidor |
| `RETRY_DELAY_MS` | 500 | Retraso entre reintentos (milisegundos) |

**Funciones clave**:

- `startPlannotatorServer()` - Inicia el servidor de revisión de plan
- `startReviewServer()` - Inicia el servidor de revisión de código
- `isRemoteSession()` - Detecta si es un entorno remoto
- `getServerPort()` - Obtiene el puerto del servidor
- `openBrowser()` - Abre el navegador
- `runGitDiff()` - Ejecuta el comando Git diff
- `detectObsidianVaults()` - Detecta los vaults de Obsidian
- `saveToObsidian()` - Guarda el plan en Obsidian
- `saveToBear()` - Guarda el plan en Bear

</details>
