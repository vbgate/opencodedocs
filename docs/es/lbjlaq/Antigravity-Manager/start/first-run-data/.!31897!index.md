---
title: "Primer Inicio: Dominar el Directorio de Datos | Antigravity Tools"
sidebarTitle: "Encontrar el Directorio de Datos"
subtitle: "Lo esencial del primer inicio: directorio de datos, registros, bandeja y autoinicio"
description: "Aprende la ubicación del directorio de datos de Antigravity Tools y la gestión de registros. Domina cómo abrir el directorio de datos desde Configuración, limpiar registros, ejecutar en la bandeja y habilitar el autoinicio al encender, distinguiendo los dos tipos de inicio automático."
tags:
  - "primer inicio"
  - "directorio de datos"
  - "registros"
  - "bandeja"
  - "autoinicio"
prerequisite:
  - "start-getting-started"
  - "start-installation"
order: 3
---

# Lo esencial del primer inicio: Directorio de Datos, Registros, Bandeja y Autoinicio

Muchas de las capacidades de Antigravity Tools que parecen "mágicas" (grupo de cuentas, cuotas, monitoreo, estadísticas, ejecución en segundo plano), al final se reducen a dos cosas: **directorio de datos** y **registros**. Si entiendes bien estos dos elementos desde el principio, ahorrarás mucho tiempo cuando necesites solucionar problemas más adelante.

## ¿Qué es el Directorio de Datos?

El **directorio de datos** es la carpeta donde Antigravity Tools guarda su estado en tu máquina local: el JSON de cuentas, los archivos relacionados con cuotas, los archivos de registro y las bases de datos SQLite de Token Stats/Proxy Monitor se encuentran aquí. Cuando hagas copias de seguridad/migraciones/soluciones de problemas, solo necesitas ubicar este directorio para encontrar la fuente de datos autoritativa.

## Lo que podrás hacer después de esta lección

- Saber dónde está el directorio de datos de Antigravity Tools (y poder abrirlo con un clic)
- Entender qué archivos vale la pena respaldar y cuáles son registros/caché
- Solucionar problemas rápidamente localizando los registros y la base de datos de monitoreo
- Entender la diferencia entre "cerrar ventana" y "salir del programa" (bandeja residente)
- Distinguir dos tipos de autoinicio: al encender vs. inicio automático del proxy

## Tu situación actual

- Quieres respaldar/migrar cuentas, pero no sabes dónde se guardan exactamente
- La UI muestra errores o las llamadas al proxy fallan, pero no encuentras los registros
- Cerraste la ventana pensando que el programa salió, pero sigue ejecutándose en segundo plano

## Cuándo usar esta técnica

- Acabas de instalar Antigravity Tools y quieres confirmar "dónde se guardan los datos"
- Te estás preparando para cambiar de computadora/reinstalar el sistema y quieres respaldar las cuentas y estadísticas primero
- Necesitas solucionar problemas: fallos de OAuth, errores al refrescar cuotas, fallos al iniciar el proxy, respuestas 401/429

## 🎒 Preparativos antes de empezar

- Antigravity Tools instalado y puedes abrirlo
- Puedes acceder a la página Settings (entrada en la esquina superior derecha/barra lateral)
- Tu cuenta de sistema tiene permisos para acceder a tu directorio Home

::: warning Aviso
Esta lección te dirá qué archivos son "datos reales", pero no se recomienda editar manualmente estos archivos. Para cambiar configuraciones, modifica primero en la UI.
:::

## Idea central

Primero recuerda una frase:

"**El directorio de datos es la única fuente de verdad del estado local; los registros son el primer punto de entrada para solucionar problemas.**"

Antigravity Tools creará el directorio de datos `.antigravity_tools` en tu directorio Home y colocará allí las cuentas, registros, bibliotecas de estadísticas, etc. (si el directorio no existe, se creará automáticamente).

Al mismo tiempo, habilita la bandeja por defecto: cuando cierras la ventana, el programa no sale inmediatamente, sino que se oculta en la bandeja y continúa ejecutándose en segundo plano.

## Sigue conmigo

### Paso 1: Abrir el directorio de datos desde Configuración

**Por qué**
Primero ubica con precisión el directorio de datos. Ya sea para respaldo o solución de problemas, tendrás un "punto de anclaje".

En Antigravity Tools, abre Settings y cambia a Advanced.

Verás una casilla de solo lectura "Data Directory" (muestra la ruta real) con un botón de abrir al lado.

Haz clic en el botón de abrir.

**Deberías ver**: el administrador de archivos del sistema abre un directorio con una ruta similar a `~/.antigravity_tools/`.

### Paso 2: Confirmar la ruta de tu directorio de datos (multiplataforma)

**Por qué**
Cuando escribas scripts para respaldo o soluciones de problemas desde la línea de comandos más adelante, necesitas saber la ruta real de este directorio en tu sistema.

::: code-group

```bash [macOS/Linux]
echo "$HOME/.antigravity_tools"
ls -la "$HOME/.antigravity_tools"
```

```powershell [Windows]
$dataDir = Join-Path $HOME ".antigravity_tools"
$dataDir
Get-ChildItem -Force $dataDir
```

:::

**Deberías ver**: el directorio existe (si es la primera vez que abres la página de configuración, el directorio se creará automáticamente).

### Paso 3: Reconocer los "archivos clave" en el directorio de datos

**Por qué**
No todos los archivos vale la pena respaldar. Primero distingue "cuáles son datos de cuentas" y "cuáles son bibliotecas de estadísticas/registros".

Los siguientes nombres de archivo provienen del código fuente del proyecto y son fijos:

| Lo que verás | Propósito | Lo que te interesa |
|--- | --- | ---|
| `accounts.json` | Índice de cuentas (contiene lista de cuentas/cuenta actual) | Se recomienda respaldar junto al migrar cuentas |
| `accounts/` | Un archivo `*.json` por cada cuenta | Este es el cuerpo principal de datos de cuentas |
| `logs/` | Directorio de registros de la aplicación | Prioridad al solucionar problemas |
| `token_stats.db` | Base de datos SQLite de Token Stats | Los datos que ves en la página Token Stats provienen de aquí |
| `proxy_logs.db` | Base de datos SQLite de Proxy Monitor | Los registros de solicitudes que ves en la página Monitor provienen de aquí |
| `warmup_history.json` | Historial local de Smart Warmup | Principalmente usado para evitar warmup duplicados |
| `update_settings.json` | Configuración de verificación de actualizaciones (autoverificación/intervalo, etc.) | Generalmente no necesitas modificarlo manualmente |

**Deberías ver**: al menos existe el directorio `logs/`; si aún no has agregado cuentas, `accounts.json`/`accounts/` pueden no aparecer.

### Paso 4: Memorizar la ubicación de los registros (necesario para solucionar problemas)

**Por qué**
Los mensajes de error de la UI generalmente solo muestran "el fenómeno", la causa real del fallo (por ejemplo, fallo de solicitud, fallo de lectura/escritura de archivo) a menudo está en los registros.

Antigravity Tools escribe los registros en `logs/` dentro del directorio de datos.

::: code-group

```bash [macOS/Linux]
ls -la "$HOME/.antigravity_tools/logs"
```

```powershell [Windows]
Get-ChildItem -Force (Join-Path $HOME ".antigravity_tools\logs")
```

:::

**Deberías ver**: existen archivos de registro rotados por día en el directorio (los nombres de archivo comienzan con `app.log`).

### Paso 5: Cuando necesites "limpiar registros", usa la limpieza con un clic desde Configuración

**Por qué**
Algunos problemas solo quieres reproducir una vez y luego mantener solo el registro de esa ocasión; en ese caso es mejor limpiar los registros primero para facilitar la comparación.

En Settings -> Advanced, encuentra el área de registros y haz clic en "Clear Logs".

**Deberías ver**: aparece un cuadro de confirmación; después de confirmar muestra limpieza exitosa.

::: tip Dos cosas de las que te preocuparás
- Los registros realizan automáticamente "rotación diaria" y al iniciar intentan limpiar registros antiguos de más de 7 días.
- "Clear Logs" truncará los archivos de registro a 0 bytes, lo que facilita que el proceso en ejecución continúe escribiendo en el mismo descriptor de archivo.
:::

### Paso 6: Entender la diferencia entre "cerrar ventana" y "salir del programa" (bandeja)

**Por qué**
Antigravity Tools habilita la bandeja por defecto; cuando haces clic en cerrar en la esquina superior derecha de la ventana, el programa se ocultará en la bandeja y continuará ejecutándose. Si crees que salió, fácilmente aparecerá la ilusión de "el puerto sigue ocupado/sigue ejecutándose en segundo plano".

Puedes confirmar con este pequeño flujo:

```
Operación: cerrar ventana (no salir)

┌─────────────────────────────────────────────────────────────┐
│  Paso 1                Paso 2                               │
│  Cerrar ventana    →   Buscar el icono en la bandeja/barra de menú del sistema  │
└─────────────────────────────────────────────────────────────┘

Deberías ver: el icono de la bandeja todavía existe, haz clic para volver a mostrar la ventana.
```

El menú de la bandeja también tiene dos acciones comunes (muy convenientes cuando no usas la UI):

- Cambiar cuenta: cambiar a la siguiente cuenta
- Refrescar cuota: refrescar la cuota de la cuenta actual (al mismo tiempo notificará al frontend para actualizar la visualización)

### Paso 7: Configurar el autoinicio al encender (para que se inicie minimizado automáticamente)

**Por qué**
Si esperas que funcione como un "servicio residente" (bandeja residente + refresco en segundo plano), el autoinicio al encender te ahorrará tener que abrirlo manualmente cada vez.

En Settings -> General encuentra "Auto-start on boot", selecciona habilitar.

**Deberías ver**: muestra habilitado exitosamente después de cambiar; la próxima vez que inicies al encender se ejecutará con el parámetro `--minimized`.

::: info Dos tipos de "autoinicio", no los confundas
| Nombre | A qué se refiere | Evidencia |
|--- | --- | ---|
| Autoinicio al encender | Iniciar automáticamente Antigravity Tools después de que la computadora se inicia (la aplicación de escritorio en sí) | El parámetro de inicio incluye `--minimized`, y se proporciona el comando `toggle_auto_launch` |
| Autoinicio del proxy | Después de que Antigravity Tools se inicia, si está configurado `proxy.auto_start=true`, intentará iniciar automáticamente el servicio local de proxy | Al iniciar la aplicación lee la configuración y ejecuta `start_proxy_service(...)` |
:::

## Puntos de verificación ✅

- [ ] Puedes ver la ruta real del directorio de datos en Settings -> Advanced
- [ ] Puedes abrir el directorio de datos y reconocer aproximadamente `accounts.json`, `accounts/`, `logs/`, `token_stats.db`, `proxy_logs.db`
- [ ] Sabes que los registros están en `logs/` y puedes verlos rápidamente desde la línea de comandos
- [ ] Sabes que después de cerrar la ventana el programa todavía está en la bandeja, para salir usa Quit del menú de la bandeja
- [ ] Puedes distinguir entre "autoinicio al encender" y "autoinicio del proxy"

## Recordatorios de trampas

| Escenario | Lo que podrías hacer (❌) | Práctica recomendada (✓) |
|--- | --- | ---|
| No encuentras el directorio de datos | Buscar desordenadamente el directorio de instalación de la App en el sistema | Ve directamente a Settings -> Advanced para ver "Data Directory" y abrir con un clic |
| Cerraste la ventana pensando que salió | Después de hacer clic en cerrar la ventana ir a cambiar configuración/cambiar puerto | Primero verifica si el icono de la bandeja todavía existe; para salir usa Quit de la bandeja |
| Demasiados registros difíciles de diagnosticar | Mientras reproduces el problema buscar en registros antiguos | Primero "limpiar registros", luego reproducir una vez, finalmente solo ver el archivo de registro de esta vez |
| Quieres modificar datos de cuentas | Editar manualmente `accounts/*.json` | Usa el flujo de importación/exportación/migración de la UI (la siguiente sección relacionada explicará)

## Resumen de esta lección

- El directorio de datos está fijo en `.antigravity_tools` bajo Home (en macOS/Linux generalmente aparece como directorio oculto), cuentas/registros/bibliotecas de estadísticas están aquí
- El directorio de registros es `logs/`, prioridad al solucionar problemas; cuando sea necesario puedes limpiar con un clic desde la página de configuración
- Cerrar la ventana ocultará en la bandeja y continuará ejecutándose; para salir completamente usa Quit de la bandeja
- Hay dos tipos de autoinicio: autoinicio al encender (aplicación) y autoinicio del proxy (Proxy)

---

## Próxima lección

> En la próxima lección aprenderemos **[Agregar cuenta: dos canales OAuth/Refresh Token y mejores prácticas](../add-account/)**.

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicaciones del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Función | Ruta del archivo | Línea |
|--- | --- | ---|
| Ubicación del directorio de datos (`~/.antigravity_tools`) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| Índice de cuentas y directorio de archivos de cuentas (`accounts.json` / `accounts/`) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L46) | 16-46 |
| Directorio de registros y rotación diaria (`logs/` + `app.log`) | [`src-tauri/src/modules/logger.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/logger.rs#L17-L83) | 17-83 |
| Limpiar registros (truncar archivo) | [`src-tauri/src/modules/logger.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/logger.rs#L149-L169) | 149-169 |
| Página de configuración muestra directorio de datos + abrir con un clic | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L525-L576) | 525-576 |
| Página de configuración limpiar registros con un clic (botón + lógica de diálogo) | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L127-L135) | 127-135 |
| Página de configuración limpiar registros con un clic (botón de pestaña Advanced) | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L732-L747) | 732-747 |
| Menú de bandeja y eventos de clic (cambiar cuenta/refrescar/mostrar/salir) | [`src-tauri/src/modules/tray.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/tray.rs#L9-L158) | 9-158 |
|--- | --- | ---|
|--- | --- | ---|
| Interruptor de autoinicio al encender (`toggle_auto_launch` / `is_auto_launch_enabled`) | [`src-tauri/src/commands/autostart.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/autostart.rs#L4-L39) | 4-39 |
| Comandos: abrir directorio de datos con un clic / obtener ruta / limpiar registros | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L578-L621) | 578-621 |
| Nombre de archivo de base de datos Token Stats (`token_stats.db`) | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L58-L61) | 58-61 |
| Nombre de archivo de base de datos Proxy Monitor (`proxy_logs.db`) | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L5-L8) | 5-8 |
| Nombre de archivo de historial Warmup (`warmup_history.json`) | [`src-tauri/src/modules/scheduler.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/scheduler.rs#L14-L17) | 14-17 |
| Nombre de archivo de configuración de actualizaciones (`update_settings.json`) | [`src-tauri/src/modules/update_checker.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/update_checker.rs#L150-L177) | 150-177 |
| Autoinicio del proxy (iniciar servicio cuando `proxy.auto_start=true`) | [`src-tauri/src/lib.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/lib.rs#L107-L126) | 107-126 |

</details>

## Próxima lección

> En la próxima lección aprenderemos **[Agregar cuenta: dos canales OAuth/Refresh Token y mejores prácticas](../add-account/)**.
>
> Aprenderás:
> - Cuándo usar OAuth y cuándo usar directamente refresh_token
> - Cómo manejar cuando falla el callback o no se puede obtener refresh_token
> - Cómo importar refresh_token en lote para construir rápidamente un grupo de cuentas
