---
title: "Iniciar Gateway: Demonio y Modos de Ejecución | Tutorial de Clawdbot"
sidebarTitle: "Gateway Siempre en Línea"
subtitle: "Iniciar Gateway: Demonio y Modos de Ejecución"
description: "Aprende a iniciar el demonio Clawdbot Gateway, comprende la diferencia entre modo desarrollo y producción, y domina los comandos de inicio comunes y configuración de parámetros."
tags:
  - "gateway"
  - "daemon"
  - "startup"
prerequisite:
  - "start-onboarding-wizard"
order: 30
---

# Iniciar Gateway: Demonio y Modos de Ejecución

## Lo que aprenderás

- Iniciar Gateway en modo primer plano desde la línea de comandos
- Configurar Gateway como demonio en segundo plano (macOS LaunchAgent / Linux systemd / Windows Scheduled Task)
- Comprender diferentes modos de enlace (loopback / LAN / Tailnet) y métodos de autenticación
- Alternar entre modo desarrollo y modo producción
- Usar `--force` para liberar puertos ocupados

## Tu situación actual

Has completado la configuración del asistente y la configuración básica de Gateway está lista. Pero:

- ¿Tienes que ejecutar manualmente el comando en la terminal cada vez que quieres usar Gateway?
- ¿Gateway deja de funcionar cuando cierras la ventana de la terminal y el asistente de IA también se "desconecta"?
- ¿Quieres acceder a Gateway desde la red local o la red Tailscale, pero no sabes cómo configurarlo?
- ¿El inicio de Gateway falla, pero no sabes si es un problema de configuración o el puerto está ocupado?

## Cuándo usar esta técnica

**Métodos de inicio recomendados**:

| Escenario                  | Comando                               | Descripción                                   |
|--- | --- | ---|
| Uso diario                | `clawdbot gateway install` + `clawdbot gateway start` | Iniciar automáticamente como servicio en segundo plano                  |
| Desarrollo y depuración                | `clawdbot gateway --dev`                     | Crear configuración de desarrollo, recarga automática                  |
| Prueba temporal                | `clawdbot gateway`                           | Ejecución en primer plano, registros直接输出到终端            |
| Conflicto de puerto                | `clawdbot gateway --force`                   | Forzar liberación de puerto antes de iniciar                    |
| Acceso desde LAN              | `clawdbot gateway --bind lan`                 | Permitir conexiones desde dispositivos de LAN                   |
| Acceso remoto por Tailscale         | `clawdbot gateway --tailscale serve`          | Exponer Gateway a través de la red Tailscale          |

## 🎒 Preparativos

::: warning Verificación previa

Antes de iniciar Gateway, asegúrate de:

1. ✅ Haber completado la configuración del asistente (`clawdbot onboard`) o haber establecido manualmente `gateway.mode=local`
2. ✅ El modelo de IA configurado (Anthropic / OpenAI / OpenRouter, etc.)
3. ✅ Si necesitas acceso a red externa (LAN / Tailnet), haber configurado el método de autenticación
4. ✅ Conocer tu escenario de uso (desarrollo local vs. ejecución en producción)

:::

## Conceptos clave

**¿Qué es Gateway?**

Gateway es el plano de control WebSocket de Clawdbot, responsable de:

- **Gestión de sesiones**: mantener el estado de todas las sesiones de conversación con IA
- **Conexión de canales**: conectar con WhatsApp, Telegram, Slack y otros 12+ canales de mensajería
- **Llamadas a herramientas**: coordinar la ejecución de herramientas como automatización del navegador, operaciones de archivos, tareas programadas, etc.
- **Gestión de nodos**: administrar nodos de dispositivos macOS / iOS / Android
- **Distribución de eventos**:推送 eventos en tiempo real como progreso de pensamiento de IA, resultados de llamadas a herramientas, etc.

**¿Por qué necesitas un demonio?**

Gateway ejecutándose como servicio en segundo plano ofrece estas ventajas:

- **Disponibilidad constante**: incluso cuando cierras la terminal, el asistente de IA sigue disponible
- **Inicio automático**: el servicio se recupera automáticamente después de reiniciar el sistema (macOS LaunchAgent / Linux systemd)
- **Gestión unificada**: controlar el ciclo de vida mediante comandos `start` / `stop` / `restart`
- **Registros centralizados**: recopilación de registros a nivel de sistema, facilitando la solución de problemas

## Sigue estos pasos

### Paso 1: Iniciar Gateway (modo primer plano)

**Por qué**

El modo primer plano es adecuado para pruebas de desarrollo, los registros se muestran directamente en la terminal, facilitando la visualización en tiempo real del estado de Gateway.

```bash
# Iniciar con configuración predeterminada (escuchar en 127.0.0.1:18789)
clawdbot gateway

# Iniciar especificando puerto
clawdbot gateway --port 19001

# Habilitar registros detallados
clawdbot gateway --verbose
```

**Lo que deberías ver**:

```bash
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
✓ log file: /Users/you/.clawdbot/logs/gateway.log
```

::: tip Punto de verificación

- Ver `listening on ws://...` indica que el inicio fue exitoso
- Anota el PID (ID de proceso) mostrado, para depuración posterior
- El puerto predeterminado es 18789, se puede modificar con `--port`

:::

### Paso 2: Configurar modo de enlace

**Por qué**

Por defecto, Gateway solo escucha en la dirección de loopback local (`127.0.0.1`), lo que significa que solo la máquina local puede conectarse. Si deseas acceder desde la red local o la red Tailscale, necesitas ajustar el modo de enlace.

```bash
# Solo loopback local (predeterminado, más seguro)
clawdbot gateway --bind loopback

# Acceso desde LAN (requiere autenticación)
clawdbot gateway --bind lan --token "your-token"

# Acceso desde red Tailscale
clawdbot gateway --bind tailnet --token "your-token"

# Detección automática (local + LAN)
clawdbot gateway --bind auto
```

**Lo que deberías ver**:

```bash
# modo loopback
✓ listening on ws://127.0.0.1:18789 (PID 12345)

# modo lan
✓ listening on ws://192.168.1.100:18789 (PID 12345)
✓ listening on ws://10.0.0.5:18789
```

::: warning Nota de seguridad

⚠️ **Al enlazar a una dirección que no sea loopback, ¡debes configurar autenticación!**

- Al usar `--bind lan` / `--bind tailnet`, debes proporcionar `--token` o `--password`
- De lo contrario, Gateway se negará a iniciar, con error: `Refusing to bind gateway to lan without auth`
- El token de autenticación se puede pasar mediante configuración `gateway.auth.token` o parámetro `--token`

:::

### Paso 3: Instalar como demonio (macOS / Linux / Windows)

**Por qué**

El demonio permite que Gateway se ejecute en segundo plano, sin ser afectado incluso si cierras la ventana de la terminal. Se inicia automáticamente después de reiniciar el sistema, manteniendo el asistente de IA siempre en línea.

```bash
# Instalar como servicio del sistema (macOS LaunchAgent / Linux systemd / Windows Scheduled Task)
clawdbot gateway install

# Iniciar servicio
clawdbot gateway start

# Ver estado del servicio
clawdbot gateway status

# Reiniciar servicio
clawdbot gateway restart

# Detener servicio
clawdbot gateway stop
```

**Lo que deberías ver**:

```bash
# macOS
✓ LaunchAgent loaded
✓ service runtime: active

# Linux
✓ systemd service enabled
✓ service runtime: active

# Windows
✓ Scheduled Task registered
✓ service runtime: running
```

::: tip Punto de verificación

- Ejecuta `clawdbot gateway status` para confirmar que el estado del servicio es `active` / `running`
- Si el servicio muestra `loaded` pero `runtime: inactive`, ejecuta `clawdbot gateway start`
- Los registros del demonio se escriben en `~/.clawdbot/logs/gateway.log`

:::

### Paso 4: Manejar conflictos de puerto (--force)

**Por qué**

El puerto predeterminado 18789 puede estar ocupado por otro proceso (como una instancia anterior de Gateway). Usar `--force` puede liberar automáticamente el puerto.

```bash
# Forzar liberación del puerto e iniciar Gateway
clawdbot gateway --force
```

**Lo que deberías ver**:

```bash
✓ force: killed pid 9876 (node) on port 18789
✓ force: waited 1200ms for port 18789 to free
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: info Cómo funciona

`--force` ejecuta las siguientes operaciones en secuencia:

1. Intenta terminar el proceso con SIGTERM (espera 700ms)
2. Si no termina, usa SIGKILL para forzar la terminación
3. Espera a que el puerto se libere (máximo 2 segundos)
4. Inicia el nuevo proceso de Gateway

:::

### Paso 5: Modo desarrollo (--dev)

**Por qué**

El modo desarrollo usa un archivo de configuración y directorio independientes, evitando contaminar el entorno de producción. Soporta recarga en caliente de TypeScript, reiniciando automáticamente Gateway después de modificar el código.

```bash
# Iniciar modo desarrollo (crear dev profile + workspace)
clawdbot gateway --dev

# Restablecer configuración de desarrollo (borrar credenciales + sesiones + workspace)
clawdbot gateway --dev --reset
```

**Lo que deberías ver**:

```bash
✓ dev config created at ~/.clawdbot-dev/clawdbot.json
✓ dev workspace initialized at ~/clawd-dev
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: tip Características del modo desarrollo

- Archivo de configuración: `~/.clawdbot-dev/clawdbot.json` (independiente de la configuración de producción)
- Directorio de workspace: `~/clawd-dev`
- Omite la ejecución del script `BOOT.md`
- Por defecto se enlaza a loopback, no requiere autenticación

:::

### Paso 6: Integración con Tailscale

**Por qué**

Tailscale te permite acceder a un Gateway remoto a través de una red privada segura, sin necesidad de IP pública o reenvío de puertos.

```bash
# Modo Tailscale Serve (recomendado)
clawdbot gateway --tailscale serve

# Modo Tailscale Funnel (requiere autenticación adicional)
clawdbot gateway --tailscale funnel --auth password
```

**Lo que deberías ver**:

```bash
# modo serve
✓ Tailscale identity detected
✓ advertising gateway via Tailscale Serve
✓ MagicDNS: https://your-tailnet.ts.net
✓ listening on ws://127.0.0.1:18789 (PID 12345)

# modo funnel
✓ Tailscale Funnel enabled
✓ Funnel URL: https://your-tailnet.ts.net:18789
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: tip Configurar autenticación

La integración con Tailscale admite dos métodos de autenticación:

1. **Identity Headers** (recomendado): establece `gateway.auth.allowTailscale=true`, la identidad de Tailscale satisface automáticamente la autenticación
2. **Token / Password**: método de autenticación tradicional, requiere pasar manualmente `--token` o `--password`

:::

### Paso 7: Verificar estado de Gateway

**Por qué**

Confirmar que Gateway se está ejecutando normalmente y que el protocolo RPC es accesible.

```bash
# Ver estado completo (servicio + sondeo RPC)
clawdbot gateway status

# Omitir sondeo RPC (solo estado del servicio)
clawdbot gateway status --no-probe

# Verificación de salud
clawdbot gateway health

# Detectar todos los Gateway accesibles
clawdbot gateway probe
```

**Lo que deberías ver**:

```bash
# salida del comando status
Gateway service status
┌──────────────────────────────────────┐
│ Service: LaunchAgent (loaded)      │
│ Runtime: running (PID 12345)       │
│ Port: 18789                       │
│ Last gateway error: none            │
└──────────────────────────────────────┘

RPC probe
┌──────────────────────────────────────┐
│ Target: ws://127.0.0.1:18789 │
│ Status: ✓ connected                │
│ Latency: 12ms                    │
└──────────────────────────────────────┘

# salida del comando health
✓ Gateway is healthy
✓ WebSocket connection: OK
✓ RPC methods: available
```

::: tip Solución de problemas

Si `status` muestra `Runtime: running` pero `RPC probe: failed`:

1. Verifica si el puerto es correcto: `clawdbot gateway status`
2. Verifica la configuración de autenticación: ¿estás enlazado a LAN / Tailnet pero sin proporcionar autenticación?
3. Verifica los registros: `cat ~/.clawdbot/logs/gateway.log`
4. Ejecuta `clawdbot doctor` para obtener diagnóstico detallado

:::

## Problemas comunes

### ❌ Error: Gateway se niega a iniciar

**Mensaje de error**:
```
Gateway start blocked: set gateway.mode=local (current: unset) or pass --allow-unconfigured.
```

**Causa**: `gateway.mode` no está establecido en `local`

**Solución**:

```bash
# Método 1: ejecutar configuración del asistente
clawdbot onboard

# Método 2: modificar manualmente el archivo de configuración
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "mode": "local"
  }
}

# Método 3: omitir verificación temporalmente (no recomendado)
clawdbot gateway --allow-unconfigured
```

### ❌ Error: Enlace a LAN sin autenticación

**Mensaje de error**:
```
Refusing to bind gateway to lan without auth.
Set gateway.auth.token/password (or CLAWDBOT_GATEWAY_TOKEN/CLAWDBOT_GATEWAY_PASSWORD) or pass --token/--password.
```

**Causa**: El enlace que no sea loopback requiere configurar autenticación (restricción de seguridad)

**Solución**:

```bash
# Establecer autenticación mediante archivo de configuración
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "your-secure-token"
    }
  }
}

# O pasar por línea de comandos
clawdbot gateway --bind lan --token "your-secure-token"
```

### ❌ Error: Puerto ya está ocupado

**Mensaje de error**:
```
Error: listen EADDRINUSE: address already in use :::18789
```

**Causa**: Otra instancia de Gateway u otro programa está usando el puerto

**Solución**:

```bash
# Método 1: forzar liberación del puerto
clawdbot gateway --force

# Método 2: usar un puerto diferente
clawdbot gateway --port 19001

# Método 3: buscar y terminar manualmente el proceso
lsof -ti:18789 | xargs kill -9  # macOS / Linux
netstat -ano | findstr :18789               # Windows
```

### ❌ Error: dev mode reset requiere --dev

**Mensaje de error**:
```
Use --reset with --dev.
```

**Causa**: `--reset` solo se puede usar en modo desarrollo, para evitar borrar datos de producción por error

**Solución**:

```bash
# Comando correcto para restablecer el entorno de desarrollo
clawdbot gateway --dev --reset
```

### ❌ Error: Servicio instalado pero aún se usa modo primer plano

**Síntoma**: Al ejecutar `clawdbot gateway` aparece "Gateway already running locally"

**Causa**: El demonio ya se está ejecutando en segundo plano

**Solución**:

```bash
# Detener el servicio en segundo plano
clawdbot gateway stop

# O reiniciar el servicio
clawdbot gateway restart

# Luego iniciar en primer plano (si necesitas depuración)
clawdbot gateway --port 19001  # usar un puerto diferente
```

## Resumen de la lección

En esta lección aprendiste:

✅ **Métodos de inicio**: modo primer plano vs. demonio
✅ **Modos de enlace**: loopback / LAN / Tailnet / Auto
✅ **Métodos de autenticación**: Token / Password / Tailscale Identity
✅ **Modo desarrollo**: configuración independiente, recarga en caliente, restablecer con --reset
✅ **Solución de problemas**: comandos `status` / `health` / `probe`
✅ **Gestión de servicios**: `install` / `start` / `stop` / `restart` / `uninstall`

**Referencia rápida de comandos clave**:

| Escenario                   | Comando                                        |
|--- | ---|
| Uso diario (servicio)       | `clawdbot gateway install && clawdbot gateway start` |
| Desarrollo y depuración              | `clawdbot gateway --dev`                     |
| Prueba temporal              | `clawdbot gateway`                           |
| Forzar liberación de puerto          | `clawdbot gateway --force`                   |
| Acceso desde LAN           | `clawdbot gateway --bind lan --token "xxx"`   |
| Acceso remoto por Tailscale       | `clawdbot gateway --tailscale serve`          |
| Ver estado              | `clawdbot gateway status`                     |
| Verificación de salud              | `clawdbot gateway health`                     |

## Próxima lección

> En la próxima lección aprenderemos **[Enviar el primer mensaje](../first-message/)**.
>
> Aprenderás:
> - Enviar el primer mensaje a través de WebChat
> - Conversar con el asistente de IA a través de canales configurados (WhatsApp/Telegram, etc.)
> - Comprender el enrutamiento de mensajes y el flujo de respuesta

---

## Apéndice: Referencia de código fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-27

| Función                        | Ruta del archivo                                                                                   | Línea     |
|--- | --- | ---|
| Punto de entrada de inicio de Gateway            | [`src/cli/gateway-cli/run.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/gateway-cli/run.ts) | 55-310   |
| Abstracción de servicio de demonio         | [`src/daemon/service.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/daemon/service.ts) | 66-155    |
| Iniciar servicio de barra lateral           | [`src/gateway/server-startup.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-startup.ts) | 26-160    |
| Implementación del servidor Gateway         | [`src/gateway/server.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server.ts) | 1-500     |
| Análisis de argumentos de programa             | [`src/daemon/program-args.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/daemon/program-args.ts) | 1-250     |
| Salida de registros de inicio              | [`src/gateway/server-startup-log.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-startup-log.ts) | 7-40      |
| Configuración de modo desarrollo             | [`src/cli/gateway-cli/dev.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/gateway-cli/dev.ts) | 1-100     |
| Lógica de liberación de puerto             | [`src/cli/ports.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/ports.ts) | 1-80      |

**Constantes clave**:
- Puerto predeterminado: `18789` (fuente: `src/gateway/server.ts`)
- Enlace predeterminado: `loopback` (fuente: `src/cli/gateway-cli/run.ts:175`)
- Ruta de configuración de modo desarrollo: `~/.clawdbot-dev/` (fuente: `src/cli/gateway-cli/dev.ts`)

**Funciones clave**:
- `runGatewayCommand()`: punto de entrada principal de CLI de Gateway, maneja argumentos de línea de comandos y lógica de inicio
- `startGatewayServer()`: inicia el servidor WebSocket, escucha en el puerto especificado
- `forceFreePortAndWait()`: fuerza la liberación del puerto y espera
- `resolveGatewayService()`: devuelve la implementación de demonio correspondiente según la plataforma (macOS LaunchAgent / Linux systemd / Windows Scheduled Task)
- `logGatewayStartup()`: muestra información de inicio de Gateway (modelo, dirección de escucha, archivo de registro)

</details>
