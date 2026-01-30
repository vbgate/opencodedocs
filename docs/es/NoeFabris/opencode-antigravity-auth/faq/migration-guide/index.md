---
title: "Migración de Cuenta: Configuración entre Dispositivos | Antigravity Auth"
sidebarTitle: "Cambiar de Ordenador"
subtitle: "Migración de Cuenta: Configuración entre Máquinas y Actualización de Versión"
description: "Aprende a migrar archivos de cuenta de Antigravity Auth entre macOS/Linux/Windows, comprende el mecanismo de actualización automática del formato de almacenamiento y resuelve problemas de autenticación post-migración."
tags:
  - "migración"
  - "entre máquinas"
  - "actualización de versión"
  - "gestión de cuentas"
prerequisite:
  - "quick-install"
order: 2
---

# Migración de Cuenta: Configuración entre Máquinas y Actualización de Versión

## Lo que Aprenderás

- ✅ Migrar una cuenta de una máquina a otra
- ✅ Comprender los cambios de versión del formato de almacenamiento (v1/v2/v3)
- ✅ Resolver problemas de autenticación post-migración (error invalid_grant)
- ✅ Compartir la misma cuenta en múltiples dispositivos

## Tu Situación Actual

Compraste un ordenador nuevo y necesitas seguir usando Antigravity Auth para acceder a Claude y Gemini 3, pero no quieres repetir todo el proceso de autenticación OAuth. O después de actualizar el plugin, descubres que los datos de cuenta anteriores ya no funcionan.

## Cuándo Usar Esta Guía

- 📦 **Nuevo dispositivo**: Migrar de un ordenador antiguo a uno nuevo
- 🔄 **Sincronización multi-dispositivo**: Compartir cuenta entre ordenador de escritorio y portátil
- 🆙 **Actualización de versión**: Cambios en el formato de almacenamiento tras actualizar el plugin
- 💾 **Respaldo y restauración**: Hacer copias de seguridad periódicas de los datos de cuenta

## Concepto Principal

La **migración de cuenta** es el proceso de copiar el archivo de cuenta (antigravity-accounts.json) de una máquina a otra. El plugin gestiona automáticamente las actualizaciones del formato de almacenamiento.

### Visión General del Mecanismo de Migración

El formato de almacenamiento tiene control de versiones (actualmente v3), y el plugin **gestiona automáticamente la migración de versiones**:

| Versión | Cambios Principales | Estado Actual |
|---|---|---|
| v1 → v2 | Estructuración del estado de límite de tasa | ✅ Migración automática |
| v2 → v3 | Soporte para pools de cuota duales (gemini-antigravity/gemini-cli) | ✅ Migración automática |

Ubicación del archivo de almacenamiento (multiplataforma):

| Plataforma | Ruta |
|---|---|
| macOS/Linux | `~/.config/opencode/antigravity-accounts.json` |
| Windows | `%APPDATA%\opencode\antigravity-accounts.json` |

::: tip Recordatorio de Seguridad
El archivo de cuenta contiene el refresh token de OAuth, **equivalente a una contraseña**. Usa métodos cifrados para la transferencia (como SFTP, ZIP cifrado).
:::

## 🎒 Antes de Empezar

- [ ] OpenCode instalado en la máquina de destino
- [ ] Plugin Antigravity Auth instalado en la máquina de destino: `opencode plugin add opencode-antigravity-auth@beta`
- [ ] Asegurar transferencia segura de archivos entre ambas máquinas (SSH, USB, etc.)

## Paso a Paso

### Paso 1: Localizar el Archivo de Cuenta en la Máquina de Origen

**Por qué**
Necesitas encontrar el archivo JSON que contiene la información de la cuenta.

```bash
# macOS/Linux
ls -la ~/.config/opencode/antigravity-accounts.json

# Windows PowerShell
Get-ChildItem "$env:APPDATA\opencode\antigravity-accounts.json"
```

**Deberías ver**: El archivo existe con contenido similar a:

```json
{
  "version": 3,
  "accounts": [...],
  "activeIndex": 0
}
```

Si el archivo no existe, significa que aún no has añadido una cuenta. Ejecuta primero `opencode auth login`.

### Paso 2: Copiar el Archivo de Cuenta a la Máquina de Destino

**Por qué**
Transferir la información de la cuenta (refresh token y Project ID) al nuevo dispositivo.

::: code-group

```bash [macOS/Linux]
# Método 1: Usar scp (vía SSH)
scp ~/.config/opencode/antigravity-accounts.json user@new-machine:/tmp/

# Método 2: Usar USB
cp ~/.config/opencode/antigravity-accounts.json /Volumes/USB/
```

```powershell [Windows]
# Método 1: Usar PowerShell Copy-Item (vía SMB)
Copy-Item "$env:APPDATA\opencode\antigravity-accounts.json" "\\new-machine\c$\Users\user\Downloads\"

# Método 2: Usar USB
Copy-Item "$env:APPDATA\opencode\antigravity-accounts.json" "E:\"
```

:::

**Deberías ver**: El archivo copiado exitosamente al directorio temporal de la máquina de destino (como `/tmp/` o `Downloads/`).

### Paso 3: Instalar el Plugin en la Máquina de Destino

**Por qué**
Asegurar que la versión del plugin en la máquina de destino sea compatible.

```bash
opencode plugin add opencode-antigravity-auth@beta
```

**Deberías ver**: Mensaje de instalación exitosa del plugin.

### Paso 4: Colocar el Archivo en la Ubicación Correcta

**Por qué**
El plugin solo busca el archivo de cuenta en una ruta específica.

::: code-group

```bash [macOS/Linux]
# Crear directorio (si no existe)
mkdir -p ~/.config/opencode

# Copiar archivo
cp /tmp/antigravity-accounts.json ~/.config/opencode/

# Verificar permisos
chmod 600 ~/.config/opencode/antigravity-accounts.json
```

```powershell [Windows]
# Copiar archivo (el directorio se crea automáticamente)
Copy-Item "$env:Downloads\antigravity-accounts.json" "$env:APPDATA\opencode\"

# Verificar
Test-Path "$env:APPDATA\opencode\antigravity-accounts.json"
```

:::

**Deberías ver**: El archivo existe en el directorio de configuración.

### Paso 5: Verificar el Resultado de la Migración

**Por qué**
Confirmar que la cuenta se ha cargado correctamente.

```bash
# Listar cuentas (esto activa la carga del archivo de cuenta por el plugin)
opencode auth login

# Si ya hay cuentas, verás:
# 2 account(s) saved:
#   1. user1@gmail.com
#   2. user2@gmail.com
# (a)dd new account(s) or (f)resh start? [a/f]:
```

Presiona `Ctrl+C` para salir (no necesitas añadir una nueva cuenta).

**Deberías ver**: El plugin reconoce exitosamente la lista de cuentas, incluyendo los correos de las cuentas migradas.

### Paso 6: Probar la Primera Solicitud

**Por qué**
Verificar que el refresh token sigue siendo válido.

```bash
# Hacer una solicitud de prueba en OpenCode
# Selecciona: google/antigravity-gemini-3-flash
```

**Deberías ver**: El modelo responde normalmente.

## Punto de Control ✅

- [ ] La máquina de destino puede listar las cuentas migradas
- [ ] La solicitud de prueba es exitosa (sin errores de autenticación)
- [ ] Los logs del plugin no muestran errores

## Solución de Problemas

### Problema 1: Error "API key missing"

**Síntoma**: Después de la migración, las solicitudes fallan con `API key missing`.

**Causa**: El refresh token puede haber expirado o sido revocado por Google (por ejemplo, cambio de contraseña, evento de seguridad).

**Solución**:

```bash
# Eliminar archivo de cuenta y re-autenticar
rm ~/.config/opencode/antigravity-accounts.json  # macOS/Linux
del "%APPDATA%\opencode\antigravity-accounts.json"  # Windows

opencode auth login
```

### Problema 2: Versión del Plugin Incompatible

**Síntoma**: Después de la migración, el archivo de cuenta no se puede cargar, los logs muestran `Unknown storage version`.

**Causa**: La versión del plugin en la máquina de destino es demasiado antigua y no soporta el formato de almacenamiento actual.

**Solución**:

```bash
# Actualizar a la última versión
opencode plugin add opencode-antigravity-auth@latest

# Probar de nuevo
opencode auth login
```

### Problema 3: Pérdida de Datos del Pool de Cuota Dual

**Síntoma**: Después de la migración, el modelo Gemini solo usa un pool de cuota, sin fallback automático.

**Causa**: Durante la migración solo se copió `antigravity-accounts.json`, pero el archivo de configuración `antigravity.json` no se migró.

**Solución**:

Copiar también el archivo de configuración (si `quota_fallback` está habilitado):

::: code-group

```bash [macOS/Linux]
# Copiar archivo de configuración
cp ~/.config/opencode/antigravity.json ~/.config/opencode/
```

```powershell [Windows]
# Copiar archivo de configuración
Copy-Item "$env:APPDATA\opencode\antigravity.json" "$env:APPDATA\opencode\"
```

:::

### Problema 4: Error de Permisos de Archivo

**Síntoma**: En macOS/Linux aparece `Permission denied`.

**Causa**: Los permisos del archivo son incorrectos, el plugin no puede leerlo.

**Solución**:

```bash
# Corregir permisos
chmod 600 ~/.config/opencode/antigravity-accounts.json
chown $USER ~/.config/opencode/antigravity-accounts.json
```

## Detalles de la Migración Automática del Formato de Almacenamiento

Cuando el plugin carga cuentas, detecta automáticamente la versión de almacenamiento y migra:

```
v1 (versión antigua)
  ↓ migrateV1ToV2()
v2
  ↓ migrateV2ToV3()
v3 (versión actual)
```

**Reglas de migración**:
- v1 → v2: Divide `rateLimitResetTime` en dos campos: `claude` y `gemini`
- v2 → v3: Divide `gemini` en `gemini-antigravity` y `gemini-cli` (soporte para pool de cuota dual)
- Limpieza automática: Los tiempos de límite de tasa expirados se filtran (`> Date.now()`)

::: info Deduplicación Automática
Al cargar cuentas, el plugin deduplica automáticamente por correo electrónico, manteniendo la cuenta más reciente (ordenada por `lastUsed` y `addedAt`).
:::

## Resumen de la Lección

Pasos principales para migrar una cuenta:

1. **Localizar archivo**: Encontrar `antigravity-accounts.json` en la máquina de origen
2. **Copiar y transferir**: Transferir de forma segura a la máquina de destino
3. **Colocar correctamente**: Poner en el directorio de configuración (`~/.config/opencode/` o `%APPDATA%\opencode\`)
4. **Verificar y probar**: Ejecutar `opencode auth login` para confirmar el reconocimiento

El plugin **gestiona automáticamente la migración de versiones**, no es necesario modificar manualmente el formato del archivo de almacenamiento. Sin embargo, si encuentras un error `invalid_grant`, la única opción es re-autenticar.

## Próxima Lección

> En la próxima lección aprenderemos sobre **[Advertencia de ToS](../tos-warning/)**.
>
> Aprenderás:
> - Los riesgos potenciales de usar Antigravity Auth
> - Cómo evitar que tu cuenta sea suspendida
> - Las restricciones de los Términos de Servicio de Google

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-23

| Funcionalidad | Ruta del Archivo | Líneas |
|---|---|---|
| Definición del formato de almacenamiento | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L128-L198) | 128-198 |
| Migración v1→v2 | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L366-L395) | 366-395 |
| Migración v2→v3 | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L397-L431) | 397-431 |
| Carga de cuenta (con migración automática) | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L433-L518) | 433-518 |
| Ruta del directorio de configuración | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L202-L213) | 202-213 |
| Lógica de deduplicación de archivos | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L301-L364) | 301-364 |

**Interfaces clave**:

- `AccountStorageV3` (formato de almacenamiento v3):
  ```typescript
  interface AccountStorageV3 {
    version: 3;
    accounts: AccountMetadataV3[];
    activeIndex: number;
    activeIndexByFamily?: { claude?: number; gemini?: number; };
  }
  ```

- `AccountMetadataV3` (metadatos de cuenta):
  ```typescript
  interface AccountMetadataV3 {
    email?: string;                    // Correo de cuenta Google
    refreshToken: string;              // OAuth refresh token (núcleo)
    projectId?: string;                // ID de proyecto GCP
    managedProjectId?: string;         // ID de proyecto gestionado
    addedAt: number;                   // Marca de tiempo de adición
    lastUsed: number;                  // Último uso
    lastSwitchReason?: "rate-limit" | "initial" | "rotation";
    rateLimitResetTimes?: RateLimitStateV3;  // Tiempo de reset de límite de tasa (v3 soporta pool dual)
    coolingDownUntil?: number;          // Tiempo de fin de enfriamiento
    cooldownReason?: CooldownReason;   // Razón del enfriamiento
  }
  ```

- `RateLimitStateV3` (estado de límite de tasa v3):
  ```typescript
  interface RateLimitStateV3 {
    claude?: number;                  // Tiempo de reset de cuota Claude
    "gemini-antigravity"?: number;    // Tiempo de reset de cuota Gemini Antigravity
    "gemini-cli"?: number;            // Tiempo de reset de cuota Gemini CLI
  }
  ```

**Funciones clave**:
- `loadAccounts()`: Carga archivo de cuenta, detecta versión automáticamente y migra (storage.ts:433)
- `migrateV1ToV2()`: Migra formato v1 a v2 (storage.ts:366)
- `migrateV2ToV3()`: Migra formato v2 a v3 (storage.ts:397)
- `deduplicateAccountsByEmail()`: Deduplica por correo, mantiene cuenta más reciente (storage.ts:301)
- `getStoragePath()`: Obtiene ruta del archivo de almacenamiento, compatible multiplataforma (storage.ts:215)

**Lógica de migración**:
- Detecta campo `data.version` (storage.ts:446)
- v1: Primero migra a v2, luego a v3 (storage.ts:447-457)
- v2: Migra directamente a v3 (storage.ts:458-468)
- v3: Sin migración necesaria, carga directamente (storage.ts:469-470)
- Limpieza automática de tiempos de límite de tasa expirados (storage.ts:404-410)

</details>
