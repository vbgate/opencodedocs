---
title: "Migración de cuentas: Copia de seguridad/Migración en caliente | Antigravity Manager"
sidebarTitle: "Migración de cuentas en 3 minutos"
subtitle: "Migración de cuentas: Copia de seguridad/Migración en caliente"
description: "Aprende la copia de seguridad y migración de cuentas en Antigravity Manager. Soporta importación/exportación JSON, migración en caliente desde Antigravity/IDE, migración desde directorio de datos V1 y sincronización automática de la cuenta actual."
tags:
  - "Gestión de cuentas"
  - "Copia de seguridad"
  - "Migración"
  - "Importación/Exportación"
  - "state.vscdb"
prerequisite:
  - "/es/lbjlaq/Antigravity-Manager/start/add-account/"
  - "/es/lbjlaq/Antigravity-Manager/start/first-run-data/"
duration: 12
order: 5
---
# Copia de seguridad y migración de cuentas: Importación/Exportación, Migración en caliente V1/DB

Lo que realmente quieres "respaldar" no son los números de cuota, sino el `refresh_token` que permite volver a iniciar sesión en las cuentas. Esta lección explica claramente los diferentes métodos de migración de Antigravity Tools: importación/exportación JSON, importación desde `state.vscdb`, importación desde directorio de datos V1, y cómo funciona la sincronización automática.

## Lo que aprenderás

- Exportar el grupo de cuentas como un archivo JSON (solo contiene email + refresh_token)
- Importar este JSON en una nueva máquina para restaurar rápidamente el grupo de cuentas
- Importar directamente desde `state.vscdb` de Antigravity/IDE la "cuenta actual" (soporta ruta predeterminada y ruta personalizada)
- Importar automáticamente cuentas antiguas desde el directorio de datos V1
- Entender qué hace exactamente la "sincronización automática de la cuenta actual" y cuándo se omite

## Tu problema actual

- Después de reinstalar el sistema o cambiar de computadora, tienes que volver a agregar todo el grupo de cuentas, lo cual es costoso
- Cambiaste la cuenta de inicio de sesión en Antigravity/IDE, pero la "cuenta actual" en Manager no cambió junto con ella
- Usaste anteriormente V1/versión script y solo tienes archivos de datos antiguos, no sabes si puedes migrar directamente

## Cuándo usar este método

- Quieres mover el grupo de cuentas a otra máquina (escritorio/servidor/contenedor)
- Usas Antigravity como "puerta de entrada de inicio de sesión autoritativa" y quieres que Manager sincronice automáticamente la cuenta actual
- Quieres migrar cuentas desde una versión anterior (directorio de datos V1)

## 🎒 Preparativos antes de comenzar

- Ya puedes abrir Antigravity Tools y tienes al menos una cuenta en el grupo de cuentas
- Sabes que los datos de las cuentas son información confidencial (especialmente `refresh_token`)

::: warning Aviso de seguridad: Trata los archivos de copia de seguridad como contraseñas
El archivo JSON exportado contiene `refresh_token`. Cualquier persona que lo obtenga podría usarlo para refrescar el access token. No subas el archivo de copia de seguridad a enlaces públicos de almacenamiento en la nube, no lo envíes a grupos, no lo envíes a Git.
:::

## Conceptos clave

La "migración" de Antigravity Tools se reduce fundamentalmente a dos cosas:

1) Encontrar un `refresh_token` válido
2) Usarlo para obtener un access token, obtener el correo electrónico real de Google, y luego escribir la cuenta en el grupo de cuentas local

Proporciona tres puntos de entrada:

- Importación/exportación JSON: Apto cuando quieres hacer una "copia de seguridad controlada"
- Importación desde DB: Apto cuando usas el estado de inicio de sesión de Antigravity/IDE como fuente autoritativa (busca `state.vscdb` por defecto, también admite selección manual de archivo)
- Importación desde V1: Apto para escanear y migrar automáticamente desde directorios de datos antiguos

Además, hay una "sincronización automática": lee periódicamente el refresh_token de la DB. Si es diferente de la cuenta actual de Manager, ejecuta automáticamente una importación desde DB. Si es el mismo, lo omite directamente (ahorra tráfico).

## Sigue los pasos

### Paso 1: Exportar el grupo de cuentas (Copia de seguridad JSON)

**Por qué**
Es el método de migración más estable y controlado. Con un archivo, puedes restaurar el grupo de cuentas en otra máquina.

Acción: Entra en la página `Accounts`, haz clic en el botón de exportar.

- Si has configurado `default_export_path` en la configuración, la exportación escribirá directamente en ese directorio y usará el nombre de archivo `antigravity_accounts_YYYY-MM-DD.json`.
- Si no has configurado un directorio predeterminado, aparecerá el diálogo de guardado del sistema para que elijas la ruta.

El contenido del archivo exportado se ve más o menos así (cada elemento del array solo mantiene los campos necesarios):

```json
[
  {
    "email": "alice@example.com",
    "refresh_token": "1//xxxxxxxxxxxxxxxxxxxxxxxx"
  },
  {
    "email": "bob@example.com",
    "refresh_token": "1//yyyyyyyyyyyyyyyyyyyyyyyy"
  }
]
```

**Lo que deberías ver**: La página muestra un mensaje de exportación exitosa y la ruta de guardado.

### Paso 2: Importar JSON en una nueva máquina (Restaurar grupo de cuentas)

**Por qué**
La importación llamará uno por uno a la lógica de "añadir cuenta", usará el `refresh_token` para obtener el correo electrónico real y escribirá la cuenta en el grupo de cuentas.

Acción: Todavía en la página `Accounts`, haz clic en "Import JSON" y selecciona el archivo que acabas de exportar.

Requisitos de formato (debe contener al menos 1 registro válido):

- Debe ser un array JSON
- El sistema solo importará entradas que contengan `refresh_token` y comiencen con `1//`

**Lo que deberías ver**: Después de que finalice la importación, las cuentas importadas aparecen en la lista de cuentas.

::: tip Si Proxy se está ejecutando al importar
Después de cada "añadir cuenta" exitoso, el backend intentará recargar el token pool del proxy inverso para que las nuevas cuentas entren en vigor inmediatamente.
:::

### Paso 3: Importar "cuenta actual" desde `state.vscdb`

**Por qué**
A veces no quieres mantener archivos de copia de seguridad, solo quieres "usar el estado de inicio de sesión de Antigravity/IDE como referencia". La importación desde DB está diseñada para este escenario.

Acción: Entra en la página `Accounts`, haz clic en **Add Account**, cambia a la pestaña `Import`:

- Haz clic en "Importar desde base de datos" (usar ruta DB predeterminada)
- O haz clic en "Custom DB (state.vscdb)" para seleccionar manualmente un archivo `*.vscdb`

La ruta DB predeterminada es multiplataforma (también reconocerá prioridad `--user-data-dir` o modo portable):

::: code-group

```text [macOS]
~/Library/Application Support/Antigravity/User/globalStorage/state.vscdb
```

```text [Windows]
%APPDATA%\Antigravity\User\globalStorage\state.vscdb
```

```text [Linux]
~/.config/Antigravity/User/globalStorage/state.vscdb
```

:::

**Lo que deberías ver**:

- Después de que la importación sea exitosa, esta cuenta se establecerá automáticamente como la "cuenta actual" de Manager
- El sistema activará automáticamente una actualización de cuota

### Paso 4: Migrar desde directorio de datos V1 (Importación de versión anterior)

**Por qué**
Si usaste anteriormente V1/versión script, Manager te permite escanear directamente el directorio de datos antiguos e intentar importar.

Acción: En la pestaña `Import`, haz clic en "Importar V1".

Buscará esta ruta en tu directorio home (y los archivos de índice dentro):

```text
~/.antigravity-agent/
  - antigravity_accounts.json
  - accounts.json
```

**Lo que deberías ver**: Después de completar la importación, las cuentas aparecen en la lista. Si no encuentra archivos de índice, el backend devolverá el error `V1 account data file not found`.

### Paso 5 (opcional): Habilitar "sincronización automática de la cuenta actual"

**Por qué**
Cuando cambias la cuenta de inicio de sesión en Antigravity/IDE, Manager puede detectar periódicamente si el refresh_token en la DB ha cambiado e importarlo automáticamente cuando cambie.

Acción: Entra en `Settings`, habilita `auto_sync` y establece `sync_interval` (unidad: segundos).

**Lo que deberías ver**: Después de habilitarlo, se ejecutará inmediatamente una sincronización. Luego se ejecutará periódicamente según el intervalo. Si el refresh_token en la DB es el mismo que la cuenta actual, se omitirá directamente y no se importará repetidamente.

## Puntos de control ✅

- Puedes ver las cuentas importadas en la lista `Accounts`
- Puedes ver que la "cuenta actual" ha cambiado a la que esperas (la importación desde DB la establecerá automáticamente como actual)
- Después de iniciar Proxy, las cuentas recién importadas se pueden usar normalmente para solicitudes (según el resultado real de la llamada)

## Advertencias de problemas comunes

| Escenario | Lo que podrías hacer (❌) | Práctica recomendada (✓) |
| --- | --- | --- |
| Seguridad del archivo de copia de seguridad | Enviar el JSON exportado como un archivo de configuración normal | Tratar el JSON como una contraseña, minimizar el alcance de difusión, evitar exposición en la red pública |
| Fallo en la importación JSON | El JSON no es un array, o el refresh_token no tiene prefijo `1//` | Usa el JSON exportado por este proyecto como plantilla, mantén los nombres de campos y la estructura consistentes |
| Importación desde DB no encuentra datos | Antigravity nunca ha iniciado sesión, o la DB falta `jetskiStateSync.agentManagerInitState` | Confirma primero que Antigravity/IDE ha iniciado sesión, luego intenta importar; si es necesario, usa Custom DB para seleccionar el archivo correcto |
| Cuentas no disponibles después de importación V1 | El refresh_token antiguo ha expirado | Elimina esa cuenta y añádela nuevamente con OAuth/nuevo refresh_token (según el mensaje de error) |
| auto_sync demasiado frecuente | `sync_interval` se establece muy pequeño, escaneando DB frecuentemente | Úsalo como "seguimiento de estado", establece el intervalo a una frecuencia que puedas aceptar |

## Resumen de esta lección

- Importación/exportación JSON es el método de migración más controlable: los archivos de copia de seguridad solo mantienen `email + refresh_token`
- La importación desde DB es adecuada para "tomar como referencia la cuenta actual de inicio de sesión de Antigravity/IDE" y establecerá automáticamente esa cuenta como actual de Manager
- La importación desde V1 escaneará `~/.antigravity-agent` y será compatible con múltiples formatos antiguos
- auto_sync comparará refresh_token; si es el mismo se omitirá, no se importará repetidamente

## Próxima lección

> En la siguiente lección, realmente usaremos el "grupo de cuentas después de la migración": **[Iniciar proxy inverso local y conectar el primer cliente (/healthz + configuración SDK)](../proxy-and-first-client/)**.
>
> Aprenderás:
> - Cómo iniciar/detener Proxy y usar `/healthz` para verificación mínima
> - Cómo configurar la URL base en el SDK/cliente

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta del archivo | Número de línea |
| --- | --- | --- |
| Accounts exportar/importar JSON (`save_text_file` / `read_text_file`) | [`src/pages/Accounts.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Accounts.tsx#L458-L578) | 458-578 |
| Dashboard exportar cuentas JSON | [`src/pages/Dashboard.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Dashboard.tsx#L113-L148) | 113-148 |
| Pestaña Import: botones Importar DB / Custom DB / Importar V1 | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L491-L539) | 491-539 |
| Añadir cuenta: ignorar email del frontend, usar refresh_token para obtener email real, actualizar cuota automáticamente, recarga en caliente de Proxy | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L19-L60) | 19-60 |
| Importación V1: escanear `~/.antigravity-agent` y compatibilidad con múltiples formatos | [`src-tauri/src/modules/migration.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/migration.rs#L9-L190) | 9-190 |
| Importación desde DB: extraer refresh_token desde `state.vscdb` (ItemTable + base64 + protobuf) | [`src-tauri/src/modules/migration.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/migration.rs#L192-L267) | 192-267 |
| Derivación de ruta DB predeterminada (`--user-data-dir` / portable / ruta estándar) | [`src-tauri/src/modules/db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/db.rs#L18-L63) | 18-63 |
| Después de importar desde DB, establecer automáticamente como "cuenta actual" y actualizar cuota | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L495-L511) | 495-511 |
| auto_sync: comparar refresh_token, omitir si es el mismo; si cambia, activar importación desde DB | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L532-L564) | 532-564 |
| Tarea en segundo plano del frontend: llamar periódicamente `syncAccountFromDb()` según `sync_interval` | [`src/components/common/BackgroundTaskRunner.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/common/BackgroundTaskRunner.tsx#L43-L72) | 43-72 |

</details>
