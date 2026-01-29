---
title: "Modelos de almacenamiento: Estructura de datos | Antigravity Tools"
sidebarTitle: "¿Dónde están los datos?"
subtitle: "Datos y modelos: archivos de cuenta, base de datos SQLite y definición de campos clave"
description: "Aprende la estructura de almacenamiento de datos de Antigravity Tools. Domina la ubicación y el significado de los campos de accounts.json, archivos de cuenta, token_stats.db y proxy_logs.db."
tags:
  - "Apéndice"
  - "Modelo de datos"
  - "Estructura de almacenamiento"
  - "Copia de seguridad"
prerequisite:
  - "start-backup-migrate"
order: 2
---

# Datos y modelos: archivos de cuenta, base de datos SQLite y definición de campos clave

## Lo que aprenderás

- Localizar rápidamente la ubicación de almacenamiento de datos de cuenta, bases de datos estadísticas, archivos de configuración y directorios de registro
- Comprender la estructura JSON de los archivos de cuenta y el significado de los campos clave
- Consultar directamente los registros de solicitudes de proxy y las estadísticas de consumo de tokens a través de SQLite
- Saber qué archivos revisar durante la copia de seguridad, migración o solución de problemas

## Tu situación actual

Cuando necesitas:
- **Migrar cuentas a una nueva máquina**: No sabes qué archivos copiar
- **Investigar anomalías en cuentas**: No sabes qué campos en el archivo de cuenta pueden indicar el estado de la cuenta
- **Exportar el consumo de tokens**: Quieres consultar directamente desde la base de datos pero no conoces la estructura de las tablas
- **Limpiar datos históricos**: Te preocupa eliminar los archivos incorrectos y perder datos

Este apéndice te ayudará a establecer una comprensión completa del modelo de datos.

---

## Estructura del directorio de datos

Los datos principales de Antigravity Tools se almacenan por defecto en el directorio `.antigravity_tools` en el "directorio principal del usuario" (fuente: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:16-33`).

::: warning Primero, aclaremos los límites de seguridad
Este directorio contendrá información sensible como `refresh_token`/`access_token` (fuente: `source/lbjlaq/Antigravity-Manager/src/types/account.ts:20-27`). Antes de hacer copias de seguridad/copiar/compartir, confirma que tu entorno de destino sea confiable.
:::

### ¿Dónde debería buscar este directorio?

::: code-group

```bash [macOS/Linux]
## Ingresar al directorio de datos
cd ~/.antigravity_tools

## O abrir en Finder (macOS)
open ~/.antigravity_tools
```

```powershell [Windows]
## Ingresar al directorio de datos
Set-Location "$env:USERPROFILE\.antigravity_tools"

## O abrir en Explorador de archivos
explorer "$env:USERPROFILE\.antigravity_tools"
```

:::

### Vista general del árbol de directorios

```
~/.antigravity_tools/
├── accounts.json          # Índice de cuentas (versión 2.0)
├── accounts/              # Directorio de cuentas
│   └── <account_id>.json  # Un archivo por cuenta
├── gui_config.json        # Configuración de la aplicación (escrita por GUI)
├── token_stats.db         # Base de datos de estadísticas de tokens (SQLite)
├── proxy_logs.db          # Base de datos de registros de monitoreo de proxy (SQLite)
├── logs/                  # Directorio de registros de la aplicación
│   └── app.log*           # Rotación diaria (el nombre del archivo cambia con la fecha)
├── bin/                   # Herramientas externas (como cloudflared)
│   └── cloudflared(.exe)
└── device_original.json   # Línea base de huella digital del dispositivo (opcional)
```

**Regla de ruta del directorio de datos**: Se obtiene `dirs::home_dir()` y se concatena con `.antigravity_tools` (fuente: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:16-33`).

::: tip Sugerencia de copia de seguridad
Realiza copias de seguridad periódicas del directorio `accounts/`, `accounts.json`, `token_stats.db` y `proxy_logs.db` para preservar todos los datos principales.
:::

---

## Modelo de datos de cuenta

### accounts.json (índice de cuentas)

El archivo de índice de cuentas registra la información resumida de todas las cuentas y la cuenta actualmente seleccionada.

**Ubicación**: `~/.antigravity_tools/accounts.json`

**Esquema** (fuente: `source/lbjlaq/Antigravity-Manager/src-tauri/src/models/account.rs:76-92`):

```json
{
  "version": "2.0",                  // Versión del índice
  "accounts": [                       // Lista de resumen de cuentas
    {
      "id": "uuid-v4",              // ID único de la cuenta
      "email": "user@gmail.com",     // Correo electrónico de la cuenta
      "name": "Display Name",        // Nombre para mostrar (opcional)
      "created_at": 1704067200,      // Fecha de creación (marca de tiempo Unix)
      "last_used": 1704067200       // Última fecha de uso (marca de tiempo Unix)
    }
  ],
  "current_account_id": "uuid-v4"    // ID de la cuenta actualmente seleccionada
}
```

### Archivo de cuenta ({account_id}.json)

Los datos completos de cada cuenta se almacenan individualmente en formato JSON en el directorio `accounts/`.

**Ubicación**: `~/.antigravity_tools/accounts/{account_id}.json`

**Esquema** (fuente: `source/lbjlaq/Antigravity-Manager/src-tauri/src/models/account.rs:6-42`; tipo de frontend: `source/lbjlaq/Antigravity-Manager/src/types/account.ts:1-55`):

```json
{
  "id": "uuid-v4",
  "email": "user@gmail.com",
  "name": "Display Name",

  "token": {                        // Datos del token OAuth
    "access_token": "ya29...",      // Token de acceso actual
    "refresh_token": "1//...",      // Token de actualización (el más importante)
    "expires_in": 3600,            // Tiempo de expiración (segundos)
    "expiry_timestamp": 1704070800, // Marca de tiempo de expiración
    "token_type": "Bearer",
    "email": "user@gmail.com",
    "project_id": "my-gcp-project", // Opcional: ID de proyecto de Google Cloud
    "session_id": "..."            // Opcional: sessionId de Antigravity
  },

  "device_profile": {               // Huella digital del dispositivo (opcional)
    "machine_id": "...",
    "mac_machine_id": "...",
    "dev_device_id": "...",
    "sqm_id": "..."
  },

  "device_history": [               // Versiones históricas de huella digital del dispositivo
    {
      "id": "version-id",
      "created_at": 1704067200,
      "label": "Guardado desde dispositivo X",
      "profile": { ... },
      "is_current": false
    }
  ],

  "quota": {                        // Datos de cuota (opcional)
    "models": [
      {
        "name": "gemini-2.0-flash-exp",
        "percentage": 85,           // Porcentaje de cuota restante
        "reset_time": "2024-01-02T00:00:00Z"
      }
    ],
    "last_updated": 1704067200,
    "is_forbidden": false,
    "subscription_tier": "PRO"      // Tipo de suscripción: FREE/PRO/ULTRA
  },

  "disabled": false,                // Si la cuenta está completamente deshabilitada
  "disabled_reason": null,          // Motivo de deshabilitación (como invalid_grant)
  "disabled_at": null,             // Marca de tiempo de deshabilitación

  "proxy_disabled": false,         // Si la función de proxy está deshabilitada
  "proxy_disabled_reason": null,   // Motivo de deshabilitación del proxy
  "proxy_disabled_at": null,       // Marca de tiempo de deshabilitación del proxy

  "protected_models": [             // Lista de modelos protegidos por cuota
    "gemini-2.5-pro-exp"
  ],

  "created_at": 1704067200,
  "last_used": 1704067200
}
```

### Explicación de campos clave

| Campo | Tipo | Significado del negocio | Condición de activación |
|--- | --- | --- | ---|
| `disabled` | bool | La cuenta está completamente deshabilitada (como cuando el refresh_token es inválido) | Se establece automáticamente en `true` cuando ocurre `invalid_grant` |
| `proxy_disabled` | bool | Solo deshabilita la función de proxy, no afecta el uso de GUI | Deshabilitación manual o activación por protección de cuota |
| `protected_models` | string[] | Lista de "modelos restringidos" para la protección de cuota a nivel de modelo | Actualizada por la lógica de protección de cuota |
| `quota.models[].percentage` | number | Porcentaje de cuota restante (0-100) | Actualizado al actualizar la cuota |
| `token.refresh_token` | string | Credencial para obtener access_token | Obtenido durante la autorización OAuth, válido a largo plazo |

**Regla importante 1: invalid_grant activa la deshabilitación** (fuente: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:869-889`; escritura en disco: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:942-969`):

- Cuando falla la actualización del token y el error contiene `invalid_grant`, TokenManager escribirá `disabled=true` / `disabled_at` / `disabled_reason` en el archivo de cuenta y eliminará la cuenta del grupo de tokens.

**Regla importante 2: Semántica de protected_models** (fuente: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:227-250`; escritura de protección de cuota: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:607-666`):

- `protected_models` almacena "ID de modelo estandarizado", utilizado para la protección de cuota a nivel de modelo y para saltar el programador.

---

## Base de datos de estadísticas de tokens

La base de datos de estadísticas de tokens registra el consumo de tokens de cada solicitud de proxy, utilizada para el monitoreo de costos y el análisis de tendencias.

**Ubicación**: `~/.antigravity_tools/token_stats.db`

**Motor de base de datos**: SQLite + modo WAL (fuente: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:63-76`)

### Estructura de tablas

#### token_usage (registros de uso originales)

| Campo | Tipo | Descripción |
|--- | --- | ---|
| id | INTEGER PRIMARY KEY AUTOINCREMENT | Clave primaria autoincremental |
| timestamp | INTEGER | Marca de tiempo de la solicitud |
| account_email | TEXT | Correo electrónico de la cuenta |
| model | TEXT | Nombre del modelo |
| input_tokens | INTEGER | Número de tokens de entrada |
| output_tokens | INTEGER | Número de tokens de salida |
| total_tokens | INTEGER | Número total de tokens |

**Sentencia de creación de tabla** (fuente: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:83-94`):

```sql
CREATE TABLE IF NOT EXISTS token_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp INTEGER NOT NULL,
    account_email TEXT NOT NULL,
    model TEXT NOT NULL,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0
);
```

#### token_stats_hourly (tabla de agregación por hora)

Agrega el uso de tokens cada hora para consultar rápidamente datos de tendencias.

**Sentencia de creación de tabla** (fuente: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:111-123`):

```sql
CREATE TABLE IF NOT EXISTS token_stats_hourly (
    hour_bucket TEXT NOT NULL,           -- Depósito de tiempo (formato: YYYY-MM-DD HH:00)
    account_email TEXT NOT NULL,
    total_input_tokens INTEGER NOT NULL DEFAULT 0,
    total_output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    request_count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (hour_bucket, account_email)
);
```

### Índices

Para mejorar el rendimiento de consultas, la base de datos establece los siguientes índices (fuente: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:97-108`):

```sql
-- Índice por tiempo descendente
CREATE INDEX IF NOT EXISTS idx_token_timestamp
ON token_usage (timestamp DESC);

-- Índice por cuenta
CREATE INDEX IF NOT EXISTS idx_token_account
ON token_usage (account_email);
```

### Ejemplos de consultas comunes

#### Consultar el consumo de tokens de las últimas 24 horas

```bash
sqlite3 ~/.antigravity_tools/token_stats.db \
  "SELECT account_email, SUM(total_tokens) as tokens
   FROM token_stats_hourly
   WHERE hour_bucket >= strftime('%Y-%m-%d %H:00', 'now', '-24 hours')
   GROUP BY account_email
   ORDER BY tokens DESC;"
```

#### Estadísticas de consumo por modelo

```bash
sqlite3 ~/.antigravity_tools/token_stats.db \
  "SELECT model,
          SUM(input_tokens) as input_tokens,
          SUM(output_tokens) as output_tokens,
          SUM(total_tokens) as total_tokens,
          COUNT(*) as request_count
   FROM token_usage
   WHERE timestamp >= strftime('%s', 'now', '-7 days')
   GROUP BY model
   ORDER BY total_tokens DESC;"
```

::: info Alcance de los campos de tiempo
`token_usage.timestamp` es una marca de tiempo Unix (en segundos) escrita por `chrono::Utc::now().timestamp()`, y `token_stats_hourly.hour_bucket` también es una cadena generada según UTC (fuente: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:136-156`).
:::

---

## Base de datos de registros de monitoreo de proxy

La base de datos de registros de proxy registra información detallada de cada solicitud de proxy, utilizada para la solución de problemas y la auditoría de solicitudes.

**Ubicación**: `~/.antigravity_tools/proxy_logs.db`

**Motor de base de datos**: SQLite + modo WAL (fuente: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:10-24`)

### Estructura de tabla: request_logs

| Campo | Tipo | Descripción |
|--- | --- | ---|
| id | TEXT PRIMARY KEY | ID único de solicitud (UUID) |
| timestamp | INTEGER | Marca de tiempo de solicitud |
| method | TEXT | Método HTTP (GET/POST) |
| url | TEXT | URL de solicitud |
| status | INTEGER | Código de estado HTTP |
| duration | INTEGER | Duración de solicitud (milisegundos) |
| model | TEXT | Nombre del modelo solicitado por el cliente |
| mapped_model | TEXT | Nombre del modelo realmente utilizado después del enrutamiento |
| account_email | TEXT | Correo electrónico de la cuenta utilizada |
| error | TEXT | Información de error (si corresponde) |
| request_body | TEXT | Cuerpo de solicitud (opcional, ocupa mucho espacio) |
| response_body | TEXT | Cuerpo de respuesta (opcional, ocupa mucho espacio) |
| input_tokens | INTEGER | Número de tokens de entrada |
| output_tokens | INTEGER | Número de tokens de salida |
| protocol | TEXT | Tipo de protocolo (openai/anthropic/gemini) |

**Sentencia de creación de tabla** (fuente: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:30-51`):

```sql
CREATE TABLE IF NOT EXISTS request_logs (
    id TEXT PRIMARY KEY,
    timestamp INTEGER,
    method TEXT,
    url TEXT,
    status INTEGER,
    duration INTEGER,
    model TEXT,
    error TEXT
);

-- Compatibilidad: agregar nuevos campos gradualmente mediante ALTER TABLE
ALTER TABLE request_logs ADD COLUMN request_body TEXT;
ALTER TABLE request_logs ADD COLUMN response_body TEXT;
ALTER TABLE request_logs ADD COLUMN input_tokens INTEGER;
ALTER TABLE request_logs ADD COLUMN output_tokens INTEGER;
ALTER TABLE request_logs ADD COLUMN account_email TEXT;
ALTER TABLE request_logs ADD COLUMN mapped_model TEXT;
ALTER TABLE request_logs ADD COLUMN protocol TEXT;
```

### Índices

```sql
-- Índice por tiempo descendente
CREATE INDEX IF NOT EXISTS idx_timestamp
ON request_logs (timestamp DESC);

-- Índice por código de estado
CREATE INDEX IF NOT EXISTS idx_status
ON request_logs (status);
```

### Limpieza automática

Cuando el sistema inicia ProxyMonitor, limpia automáticamente los registros de hace 30 días y realiza `VACUUM` en la base de datos (fuente: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/monitor.rs:41-60`; implementación: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:194-209`).

### Ejemplos de consultas comunes

#### Consultar solicitudes fallidas recientes

```bash
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT timestamp, method, url, status, error
   FROM request_logs
   WHERE status >= 400 OR status < 200
   ORDER BY timestamp DESC
   LIMIT 10;"
```

#### Estadísticas de tasa de éxito por cuenta

```bash
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT account_email,
          COUNT(*) as total,
          SUM(CASE WHEN status >= 200 AND status < 400 THEN 1 ELSE 0 END) as success,
          ROUND(100.0 * SUM(CASE WHEN status >= 200 AND status < 400 THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
   FROM request_logs
   WHERE timestamp >= strftime('%s', 'now', '-7 days')
   GROUP BY account_email
   ORDER BY total DESC;"
```

---

## Archivos de configuración

### gui_config.json

Almacena la información de configuración de la aplicación, incluyendo la configuración de proxy, el mapeo de modelos, el modo de autenticación, etc.

**Ubicación**: `~/.antigravity_tools/gui_config.json` (fuente: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/config.rs:7-13`)

La estructura de este archivo se basa en `AppConfig` (fuente: `source/lbjlaq/Antigravity-Manager/src/types/config.ts:76-95`).

::: tip Cuando solo necesitas "copia de seguridad/migración"
La forma más segura es: cierra la aplicación y luego comprime todo `~/.antigravity_tools/`. La semántica de actualización en caliente/reinicio de la configuración pertenece al "comportamiento en tiempo de ejecución", se recomienda ver el curso avanzado **[Explicación completa de configuración](../../advanced/config/)**.
:::

---

## Archivos de registro

### Registros de la aplicación

**Ubicación**: `~/.antigravity_tools/logs/` (fuente: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/logger.rs:17-25`)

Los registros utilizan rotación de archivos diaria, el nombre base del archivo es `app.log` (fuente: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/logger.rs:41-45`).

**Nivel de registro**: INFO/WARN/ERROR

**Propósito**: Registra eventos clave, información de errores y información de depuración durante la ejecución de la aplicación, utilizado para la solución de problemas.

---

## Migración y copia de seguridad de datos

### Copia de seguridad de datos principales

::: code-group

```bash [macOS/Linux]
## Copia de seguridad de todo el directorio de datos (lo más seguro)
tar -czf antigravity-backup-$(date +%Y%m%d).tar.gz ~/.antigravity_tools
```

```powershell [Windows]
## Copia de seguridad de todo el directorio de datos (lo más seguro)
$backupDate = Get-Date -Format "yyyyMMdd"
$dataDir = "$env:USERPROFILE\.antigravity_tools"
Compress-Archive -Path $dataDir -DestinationPath "antigravity-backup-$backupDate.zip"
```

:::

### Migrar a una nueva máquina

1. Cierra Antigravity Tools (para evitar que los archivos en escritura se copien a mitad)
2. Copia `.antigravity_tools` de la máquina de origen al directorio principal del usuario de la máquina de destino
3. Inicia Antigravity Tools

::: tip Migración entre plataformas
Si migras desde Windows a macOS/Linux (o viceversa), simplemente copia todo el directorio `.antigravity_tools`, el formato de datos es compatible entre plataformas.
:::

### Limpieza de datos históricos

::: info Primero, la conclusión
- `proxy_logs.db`: Limpieza automática de 30 días (fuente: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/monitor.rs:41-60`).
- `token_stats.db`: Inicializa la estructura de tablas al inicio (fuente: `source/lbjlaq/Antigravity-Manager/src-tauri/src/lib.rs:53-56`), pero el código fuente no muestra lógica de "limpieza automática de registros históricos por día".
:::

::: danger Solo haz esto cuando confirmes que no necesitas datos históricos
Limpiar estadísticas/registros te hará perder datos históricos de solución de problemas y análisis de costos. Antes de proceder, haz una copia de seguridad de todo `.antigravity_tools`.
:::

Si solo quieres "limpiar el historial y comenzar de nuevo", la forma más segura es cerrar la aplicación y eliminar directamente los archivos de base de datos (al próximo inicio se reconstruirá la estructura de tablas).

::: code-group

```bash [macOS/Linux]
## Limpiar estadísticas de tokens (perderás el historial)
rm -f ~/.antigravity_tools/token_stats.db

## Limpiar registros de monitoreo de proxy (perderás el historial)
rm -f ~/.antigravity_tools/proxy_logs.db
```

```powershell [Windows]
## Limpiar estadísticas de tokens (perderás el historial)
Remove-Item -Force "$env:USERPROFILE\.antigravity_tools\token_stats.db" -ErrorAction SilentlyContinue

## Limpiar registros de monitoreo de proxy (perderás el historial)
Remove-Item -Force "$env:USERPROFILE\.antigravity_tools\proxy_logs.db" -ErrorAction SilentlyContinue
```

:::

---

## Explicación de campos comunes

### Marca de tiempo Unix

Todos los campos relacionados con tiempo (como `created_at`, `last_used`, `timestamp`) utilizan marcas de tiempo Unix (precisión de segundos).

**Convertir a tiempo legible**:

```bash
## macOS/Linux
date -r 1704067200
date -d @1704067200  # GNU date

## Consulta SQLite (ejemplo: convertir request_logs.timestamp a tiempo legible)
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT datetime(timestamp, 'unixepoch', 'localtime') FROM request_logs LIMIT 1;"
```

### Porcentaje de cuota

`quota.models[].percentage` representa el porcentaje de cuota restante (0-100) (fuente: `source/lbjlaq/Antigravity-Manager/src/types/account.ts:36-40`; modelo de backend: `source/lbjlaq/Antigravity-Manager/src-tauri/src/models/quota.rs:3-9`).

Si se activa la "protección de cuota" está determinado por `quota_protection.enabled/threshold_percentage/monitored_models` (fuente: `source/lbjlaq/Antigravity-Manager/src/types/config.ts:59-63`; escritura en `protected_models`: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:607-666`).

---

## Resumen de la lección

- El directorio de datos de Antigravity Tools está en `.antigravity_tools` en el directorio principal del usuario
- Datos de cuenta: `accounts.json` (índice) + `accounts/<account_id>.json` (datos completos de una sola cuenta)
- Datos estadísticos: `token_stats.db` (estadísticas de tokens) + `proxy_logs.db` (registros de monitoreo de proxy)
- Configuración y operación: `gui_config.json`, `logs/`, `bin/cloudflared*`, `device_original.json`
- La forma más segura de copia de seguridad/migración es "cerrar la aplicación y luego comprimir todo `.antigravity_tools`"

---

## Próxima lección

> En la próxima lección aprenderemos **[Límites de integración de z.ai](../zai-boundaries/)**.
>
> Aprenderás:
> - Lista de funciones implementadas de la integración de z.ai
> - Funciones no implementadas y limitaciones de uso
> - Explicación de la implementación experimental de Vision MCP

---

## Apéndice: Referencias de código fuente

<details>
<summary><strong>Haz clic para expandir y ver las ubicaciones del código fuente</strong></summary>

> Fecha de actualización: 2026-01-23

| Función | Ruta del archivo | Línea |
|--- | --- | ---|
| Directorio de datos (.antigravity_tools) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| Directorio de cuentas (accounts/) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L35-L46) | 35-46 |
| Estructura de accounts.json | [`src-tauri/src/models/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/account.rs#L76-L92) | 76-92 |
| Estructura de Account (backend) | [`src-tauri/src/models/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/account.rs#L6-L42) | 6-42 |
| Estructura de Account (frontend) | [`src/types/account.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/types/account.ts#L1-L55) | 1-55 |
| Estructura de TokenData/QuotaData | [`src-tauri/src/models/token.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/token.rs#L3-L16) | 3-16 |
| Estructura de TokenData/QuotaData | [`src-tauri/src/models/quota.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/quota.rs#L3-L21) | 3-21 |
| Inicialización de base de datos de estadísticas de tokens (esquema) | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L58-L159) | 58-159 |
| Inicialización de base de datos de registros de proxy (esquema) | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L5-L65) | 5-65 |
| Limpieza automática de registros de proxy (30 días) | [`src-tauri/src/proxy/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/monitor.rs#L41-L60) | 41-60 |
| Implementación de limpieza automática de registros de proxy | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L194-L209) | 194-209 |
| Lectura/escritura de gui_config.json | [`src-tauri/src/modules/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/config.rs#L7-L88) | 7-88 |
| Directorio logs/ y app.log | [`src-tauri/src/modules/logger.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/logger.rs#L17-L45) | 17-45 |
| Ruta de bin/cloudflared | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L92-L101) | 92-101 |
| device_original.json | [`src-tauri/src/modules/device.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/device.rs#L11-L13) | 11-13 |
|--- | --- | ---|

**Constantes clave**:
- `DATA_DIR = ".antigravity_tools"`: Nombre del directorio de datos (`src-tauri/src/modules/account.rs:16-18`)
- `ACCOUNTS_INDEX = "accounts.json"`: Nombre del archivo de índice de cuentas (`src-tauri/src/modules/account.rs:16-18`)
- `CONFIG_FILE = "gui_config.json"`: Nombre del archivo de configuración (`src-tauri/src/modules/config.rs:7`)

**Funciones clave**:
- `get_data_dir()`: Obtener la ruta del directorio de datos (`src-tauri/src/modules/account.rs`)
- `record_usage()`: Escribir en `token_usage`/`token_stats_hourly` (`src-tauri/src/modules/token_stats.rs`)
- `save_log()`: Escribir en `request_logs` (`src-tauri/src/modules/proxy_db.rs`)
- `cleanup_old_logs(days)`: Eliminar registros `request_logs` antiguos y `VACUUM` (`src-tauri/src/modules/proxy_db.rs`)

</details>
