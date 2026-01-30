---
title: "Guía Completa de Despliegue de Clawdbot: Local, Docker, Nix, Fly.io, Hetzner VPS y exe.dev | Tutorial Clawdbot"
sidebarTitle: "Hacer que Gateway Funcione 24/7"
subtitle: "Opciones de Despliegue"
description: "Aprende a desplegar Clawdbot en diferentes plataformas: instalación local, Docker containerizado, configuración declarativa con Nix, despliegue en la nube con Fly.io, hosting en Hetzner VPS y hosting compartido en exe.dev. Conoce las características, escenarios de uso, pasos de configuración y mejores prácticas de seguridad de cada método de despliegue."
tags:
  - "Despliegue"
  - "Instalación"
  - "Docker"
  - "Nix"
  - "Despliegue en la Nube"
prerequisite:
  - "start-getting-started"
order: 360
---

# Opciones de Despliegue

## Lo que Aprenderás

Al completar esta lección, serás capaz de:

- Seleccionar el método de despliegue más adecuado según tus necesidades (local, Docker, Nix, servicios en la nube)
- Instalar y ejecutar Clawdbot en tu entorno local
- Desplegar Gateway usando contenedores Docker
- Gestionar Clawdbot de forma declarativa con Nix
- Desplegar Gateway en Fly.io, Hetzner VPS o exe.dev
- Configurar acceso remoto y mejores prácticas de seguridad

## Tu Situación Actual

Quieres usar Clawdbot pero no estás seguro de qué método de despliegue elegir:

- La instalación local es la más simple, pero deja de funcionar cuando apagas tu máquina
- Quieres ejecutarlo 24/7 en la nube, pero no sabes qué proveedor de servicios en la nube es el adecuado
- Temes cometer errores de configuración y buscas el esquema de despliegue más seguro
- Necesitas acceder al mismo Gateway desde múltiples dispositivos pero no sabes cómo lograrlo

## Cuándo Usar Cada Método

| Método de Despliegue | Escenario de Uso |
| --- | --- |
| **Instalación Local** | Computadora personal, pruebas de desarrollo, puesta en marcha rápida |
| **Docker** | Entornos aislados, despliegue en servidores, reconstrucción rápida |
| **Nix** | Despliegues reproducibles, usuarios de NixOS/Home Manager, necesidad de rollback de versiones |
| **Fly.io** | Ejecución 24/7 en la nube, HTTPS automático, operaciones simplificadas |
| **Hetzner VPS** | VPS propio, control total, 24/7 de bajo costo |
| **exe.dev** | Hosting Linux económico, sin necesidad de configurar tu propio VPS |

## 🎒 Preparativos Previos

Antes de comenzar, asegúrate de:

::: warning Requisitos del Entorno
- Node.js ≥ 22 (requerido para instalación local)
- Docker Desktop + Docker Compose v2 (requerido para despliegue Docker)
- Nix flakes + Home Manager (requerido para despliegue Nix)
- Cliente SSH (requerido para acceso a despliegues en la nube)
- Conocimientos básicos de operaciones de terminal (copiar, pegar, ejecutar comandos)
:::

::: tip Herramientas Recomendadas
- Si es tu primera vez con Clawdbot, se recomienda comenzar con el [Inicio Rápido](../../start/getting-started/)
- El uso de asistentes de IA (como Claude, Cursor) puede acelerar el proceso de configuración
- Guarda tus API Keys (Anthropic, OpenAI, etc.) y credenciales de canales
:::

## Comparación de Métodos de Despliegue

### Instalación Local

**Apto para**: Computadora personal, pruebas de desarrollo, puesta en marcha rápida

**Ventajas**:
- ✅ El método más simple y directo, sin infraestructura adicional requerida
- ✅ Inicio rápido, conveniente para depuración
- ✅ Los cambios de configuración surten efecto inmediatamente

**Desventajas**:
- ❌ Deja de funcionar cuando la máquina se apaga
- ❌ No adecuado para servicios 24/7
- ❌ La sincronización entre múltiples dispositivos requiere configuración adicional

### Despliegue Docker

**Apto para**: Despliegue en servidores, entornos aislados, CI/CD

**Ventajas**:
- ✅ Entorno aislado, fácil de limpiar y reconstruir
- ✅ Despliegue uniforme multiplataforma
- ✅ Soporte para ejecución de herramientas en sandbox aislado
- ✅ Configuración controlable por versiones

**Desventajas**:
- ❌ Requiere conocimiento de Docker
- ❌ Configuración inicial ligeramente más compleja

### Despliegue Nix

**Apto para**: Usuarios de NixOS, usuarios de Home Manager, necesidad de despliegues reproducibles

**Ventajas**:
- ✅ Configuración declarativa, reproducible
- ✅ Rollback rápido (`home-manager switch --rollback`)
- ✅ Todas las versiones de componentes fijadas
- ✅ Gestión completa de Gateway + aplicación macOS + herramientas

**Desventajas**:
- ❌ Curva de aprendizaje pronunciada
- ❌ Requiere familiaridad con el ecosistema Nix

### Despliegue en la Nube (Fly.io / Hetzner / exe.dev)

**Apto para**: Disponibilidad 24/7, acceso remoto, trabajo en equipo

**Ventajas**:
- ✅ Disponible 24/7, independiente de tu máquina local
- ✅ HTTPS automático, sin necesidad de certificados manuales
- ✅ Escalabilidad rápida
- ✅ Soporte para acceso remoto desde múltiples dispositivos

**Desventajas**:
- ❌ Requiere pago por servicios en la nube
- ❌ Requiere conocimientos básicos de operaciones
- ❌ Datos almacenados en terceros

---

## Instalación Local

### Instalación Global con npm/pnpm/bun (Recomendado)

Instalar desde el repositorio npm oficial es el método más simple:

::: code-group

```bash [npm]
# Instalar usando npm
npm install -g clawdbot@latest
```

```bash [pnpm]
# Instalar usando pnpm (recomendado)
pnpm add -g clawdbot@latest
```

```bash [bun]
# Instalar usando bun (el más rápido)
bun add -g clawdbot@latest
```

:::

Después de la instalación, ejecuta el asistente:

```bash
clawdbot onboard --install-daemon
```

Este comando hará lo siguiente:
- Te guiará a través de la configuración de Gateway, canales y modelos
- Instalará el demonio de Gateway (macOS launchd / Linux systemd)
- Configurará el archivo de configuración predeterminado `~/.clawdbot/clawdbot.json`

### Compilación desde el Código Fuente

Si necesitas compilar desde el código fuente (desarrollo, personalización):

::: code-group

```bash [macOS/Linux]
# Clonar el repositorio
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot

# Instalar dependencias y compilar
pnpm install
pnpm ui:build
pnpm build

# Instalar y ejecutar
pnpm clawdbot onboard --install-daemon
```

```bash [Windows (WSL2)]
# Compilar en WSL2 (recomendado)
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot

wsl.exe -d Ubuntu bash -c "pnpm install && pnpm ui:build && pnpm build"
```

:::

::: info Ciclo de Desarrollo
Ejecutar `pnpm gateway:watch` permite recargar automáticamente Gateway cuando se modifican los archivos de código.
:::

---

## Despliegue Docker

### Inicio Rápido (Recomendado)

Usa el script proporcionado para desplegar con un solo comando:

```bash
./docker-setup.sh
```

Este script hará lo siguiente:
- Construir la imagen de Gateway
- Ejecutar el asistente de configuración inicial
- Mostrar sugerencias de configuración de proveedores
- Iniciar Gateway mediante Docker Compose
- Generar el token de Gateway y escribirlo en `.env`

Después de completar:
1. Abre `http://127.0.0.1:18789/` en tu navegador
2. Pega el token en la configuración de la UI de Control

El script creará en el host:
- `~/.clawdbot/` (directorio de configuración)
- `~/clawd/` (directorio de espacio de trabajo)

### Proceso Manual

Si necesitas personalizar la configuración de Docker Compose:

```bash
# Construir la imagen
docker build -t clawdbot:local -f Dockerfile .

# Ejecutar el contenedor CLI para completar la configuración
docker compose run --rm clawdbot-cli onboard

# Iniciar Gateway
docker compose up -d clawdbot-gateway
```

### Volúmenes Adicionales (Opcional)

Si deseas montar directorios adicionales del host en el contenedor, puedes configurar variables de entorno antes de ejecutar `docker-setup.sh`:

```bash
export CLAWDBOT_EXTRA_MOUNTS="$HOME/.codex:/home/node/.codex:ro,$HOME/github:/home/node/github:rw"
./docker-setup.sh
```

**Notas importantes**:
- Las rutas deben estar compartidas con Docker Desktop (macOS/Windows)
- Si modificas `CLAWDBOT_EXTRA_MOUNTS`, necesitas volver a ejecutar `docker-setup.sh` para regenerar el archivo compose

### Persistencia del Directorio Home del Contenedor (Opcional)

Si deseas que `/home/node` persista durante la reconstrucción del contenedor:

```bash
export CLAWDBOT_HOME_VOLUME="clawdbot_home"
./docker-setup.sh
```

**Notas importantes**:
- Los volúmenes con nombre persisten hasta que se eliminen con `docker volume rm`
- Pueden combinarse con `CLAWDBOT_EXTRA_MOUNTS`

### Instalación de Paquetes del Sistema Adicionales (Opcional)

Si necesitas instalar paquetes del sistema adicionales en la imagen (como herramientas de compilación, bibliotecas multimedia):

```bash
export CLAWDBOT_DOCKER_APT_PACKAGES="ffmpeg build-essential"
./docker-setup.sh
```

### Configuración de Canales (Opcional)

Usa el contenedor CLI para configurar canales:

::: code-group

```bash [WhatsApp]
# Iniciar sesión en WhatsApp (mostrará un código QR)
docker compose run --rm clawdbot-cli channels login
```

```bash [Telegram]
# Agregar bot de Telegram
docker compose run --rm clawdbot-cli channels add --channel telegram --token "<token>"
```

```bash [Discord]
# Agregar bot de Discord
docker compose run --rm clawdbot-cli channels add --channel discord --token "<token>"
```

:::

### Verificación de Salud

```bash
docker compose exec clawdbot-gateway node dist/index.js health --token "$CLAWDBOT_GATEWAY_TOKEN"
```

### Sandbox de Agentes (Gateway en Host + Herramientas Docker)

Docker también se puede usar para aislar la ejecución de herramientas en sesiones no principales mediante sandboxing. Ver detalles en: [Sandboxing](https://docs.clawd.bot/gateway/sandboxing)

---

## Instalación Nix

**Método recomendado**: Usar el módulo de Home Manager [nix-clawdbot](https://github.com/clawdbot/nix-clawdbot)

### Inicio Rápido

Pega este texto en tu asistente de IA (Claude, Cursor, etc.):

```text
Quiero configurar nix-clawdbot en mi Mac.
Repositorio: github:clawdbot/nix-clawdbot

Lo que necesito que hagas:
1. Verificar si Determinate Nix está instalado (si no, instalarlo)
2. Crear un flake local en ~/code/clawdbot-local usando templates/agent-first/flake.nix
3. Ayudarme a crear un bot de Telegram (@BotFather) y obtener mi ID de chat (@userinfobot)
4. Configurar secretos (token del bot, clave Anthropic) - archivos planos en ~/.secrets/ está bien
5. Completar los marcadores de posición de la plantilla y ejecutar home-manager switch
6. Verificar: launchd ejecutándose, bot responde a mensajes

Consultar el README de nix-clawdbot para las opciones del módulo.
```

> **📦 Guía Completa**: [github.com/clawdbot/nix-clawdbot](https://github.com/clawdbot/nix-clawdbot)

### Comportamiento en Tiempo de Ejecución del Modo Nix

Cuando se establece `CLAWDBOT_NIX_MODE=1` (nix-clawdbot lo configura automáticamente):

- La configuración se vuelve determinista, deshabilitando el flujo de instalación automática
- Si faltan dependencias, muestra información de corrección específica de Nix
- La interfaz de usuario muestra una bandera de modo Nix de solo lectura

En macOS, las aplicaciones GUI no heredan automáticamente las variables de entorno del shell. También puedes habilitar el modo Nix mediante defaults:

```bash
defaults write com.clawdbot.mac clawdbot.nixMode -bool true
```

### Rutas de Configuración y Estado

En modo Nix, configura explícitamente estas variables de entorno:

- `CLAWDBOT_STATE_DIR` (predeterminado: `~/.clawdbot`)
- `CLAWDBOT_CONFIG_PATH` (predeterminado: `$CLAWDBOT_STATE_DIR/clawdbot.json`)

De esta manera, el estado en tiempo de ejecución y la configuración permanecerán fuera del almacenamiento inmutable gestionado por Nix.

---

## Despliegue en Fly.io

**Apto para**: Necesidad de ejecución 24/7 en la nube, operaciones simplificadas, HTTPS automático

### Requisitos Previos

- [flyctl CLI](https://fly.io/docs/hands-on/install-flyctl/)
- Cuenta de Fly.io (nivel gratuito disponible)
- Autenticación del modelo: Anthropic API Key (u otra clave de proveedor)
- Credenciales de canales: token de bot de Discord, token de Telegram, etc.

### Paso 1: Crear Aplicación Fly

```bash
# Clonar el repositorio
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot

# Crear nueva aplicación Fly (elige tu propio nombre)
fly apps create my-clawdbot

# Crear volumen persistente (1GB generalmente es suficiente)
fly volumes create clawdbot_data --size 1 --region iad
```

::: tip Selección de Región
Elige la región más cercana a ti. Opciones comunes:
- `lhr` (Londres)
- `iad` (Virginia)
- `sjc` (San José)
:::

### Paso 2: Configurar fly.toml

Edita `fly.toml` para que coincida con tu nombre de aplicación y requisitos.

::: warning Nota de Seguridad
La configuración predeterminada expondrá una URL pública. Para despliegues reforzados sin IP pública, consulta [Despliegue Privado](#despliegue-privado-reforzado), o usa `fly.private.toml`.
:::

```toml
app = "my-clawdbot"  # Tu nombre de aplicación
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  CLAWDBOT_PREFER_PNPM = "1"
  CLAWDBOT_STATE_DIR = "/data"
  NODE_OPTIONS = "--max-old-space-size=1536"

[processes]
  app = "node dist/index.js gateway --allow-unconfigured --port 3000 --bind lan"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1
  processes = ["app"]

[[vm]]
  size = "shared-cpu-2x"
  memory = "2048mb"

[mounts]
  source = "clawdbot_data"
  destination = "/data"
```

**Explicación de Configuraciones Clave**:

| Configuración | Razón |
| --- | --- |
| `--bind lan` | Vincula a `0.0.0.0`, permitiendo que el proxy de Fly acceda a Gateway |
| `--allow-unconfigured` | Inicia sin archivo de configuración (lo crearás después) |
| `internal_port = 3000` | Debe coincidir con `--port 3000` (o `CLAWDBOT_GATEWAY_PORT`) para las verificaciones de salud de Fly |
| `memory = "2048mb"` | 512MB es muy poco; se recomiendan 2GB |
| `CLAWDBOT_STATE_DIR = "/data"` | Persiste el estado en el volumen |

### Paso 3: Configurar Secrets

```bash
# Requerido: token de Gateway (para vinculación no loopback)
fly secrets set CLAWDBOT_GATEWAY_TOKEN=$(openssl rand -hex 32)

# API Keys de proveedores de modelos
fly secrets set ANTHROPIC_API_KEY=sk-ant-...
fly secrets set OPENAI_API_KEY=sk-...
fly secrets set GOOGLE_API_KEY=...

# Tokens de canales
fly secrets set DISCORD_BOT_TOKEN=MTQ...
```

::: tip Recomendación de Seguridad
La vinculación no loopback (`--bind lan`) requiere `CLAWDBOT_GATEWAY_TOKEN` para seguridad. Trata estos tokens como contraseñas. Para todas las API keys y tokens, prioriza el uso de variables de entorno sobre archivos de configuración para evitar exponer credenciales en `clawdbot.json`.
:::

### Paso 4: Desplegar

```bash
fly deploy
```

El primer despliegue construirá la imagen Docker (aproximadamente 2-3 minutos). Los despliegues posteriores serán más rápidos.

Después del despliegue, verifica:

```bash
fly status
fly logs
```

Deberías ver:

```
[gateway] listening on ws://0.0.0.0:3000 (PID xxx)
[discord] logged in to discord as xxx
```

### Paso 5: Crear Archivo de Configuración

Accede mediante SSH a la máquina para crear el archivo de configuración:

```bash
fly ssh console
```

Crea el directorio de configuración y el archivo:

```bash
mkdir -p /data
cat > /data/clawdbot.json << 'EOF'
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-opus-4-5",
        "fallbacks": ["anthropic/claude-sonnet-4-5", "openai/gpt-4o"]
      },
      "maxConcurrent": 4
    },
    "list": [
      {
        "id": "main",
        "default": true
      }
    ]
  },
  "auth": {
    "profiles": {
      "anthropic:default": { "mode": "token", "provider": "anthropic" },
      "openai:default": { "mode": "token", "provider": "openai" }
    }
  },
  "bindings": [
    {
      "agentId": "main",
      "match": { "channel": "discord" }
    }
  ],
  "channels": {
    "discord": {
      "enabled": true,
      "groupPolicy": "allowlist",
      "guilds": {
        "YOUR_GUILD_ID": {
          "channels": { "general": { "allow": true } },
          "requireMention": false
        }
      }
    }
  },
  "gateway": {
    "mode": "local",
    "bind": "auto"
  },
  "meta": {
    "lastTouchedVersion": "2026.1.25"
  }
}
EOF
```

Reinicia para aplicar la configuración:

```bash
exit
fly machine restart <machine-id>
```

### Paso 6: Acceder a Gateway

**Control UI**:

```bash
fly open
```

O visita: `https://my-clawdbot.fly.dev/`

Pega tu token de Gateway (de `CLAWDBOT_GATEWAY_TOKEN`) para autenticarte.

**Registros**:

```bash
fly logs              # Registros en tiempo real
fly logs --no-tail    # Registros recientes
```

**Consola SSH**:

```bash
fly ssh console
```

### Solución de Problemas

**"App is not listening on expected address"**:

Gateway se está vinculando a `127.0.0.1` en lugar de `0.0.0.0`.

**Solución**: Agrega `--bind lan` al comando del proceso en `fly.toml`.

**Verificaciones de salud fallidas / Conexión rechazada**:

Fly no puede acceder a Gateway en el puerto configurado.

**Solución**: Asegúrate de que `internal_port` coincida con el puerto de Gateway (configura `--port 3000` o `CLAWDBOT_GATEWAY_PORT=3000`).

**OOM / Problemas de memoria**:

El contenedor se reinicia continuamente o es terminado. Indicadores: `SIGABRT`, `v8::internal::Runtime_AllocateInYoungGeneration` o reinicios silenciosos.

**Solución**: Aumenta la memoria en `fly.toml`:

```toml
[[vm]]
  memory = "2048mb"
```

O actualiza la máquina existente:

```bash
fly machine update <machine-id> --vm-memory 2048 -y
```

**Nota**: 512MB es muy poco. 1GB puede funcionar pero podría causar OOM bajo carga o con registros detallados. **Se recomiendan 2GB**.

**Problemas de Bloqueo de Gateway**:

Gateway se niega a iniciar con error "already running".

Esto ocurre cuando el contenedor se reinicia pero el archivo de bloqueo PID persiste en el volumen.

**Solución**: Elimina el archivo de bloqueo:

```bash
fly ssh console --command "rm -f /data/gateway.*.lock"
fly machine restart <machine-id>
```

Los archivos de bloqueo se encuentran en `/data/gateway.*.lock` (no en subdirectorios).

### Despliegue Privado (Reforzado)

De forma predeterminada, Fly.io asigna una IP pública, haciendo que tu Gateway sea accesible en `https://your-app.fly.dev`. Esto es conveniente, pero también significa que tu despliegue puede ser descubierto por escáneres de Internet (Shodan, Censys, etc.).

**Usa la plantilla privada** para lograr un despliegue reforzado sin exposición pública:

::: info Escenarios de Despliegue Privado
- Solo realizas llamadas/mensajes **salientes** (sin webhooks entrantes)
- Usas túneles **ngrok o Tailscale** para cualquier callback de webhook
- Accedes a Gateway mediante **SSH, proxy o WireGuard** en lugar de un navegador
- Deseas que el despliegue esté **oculto de los escáneres de Internet**
:::

**Configuración**:

Usa `fly.private.toml` en lugar de la configuración estándar:

```bash
# Desplegar usando configuración privada
fly deploy -c fly.private.toml
```

O convierte un despliegue existente:

```bash
# Listar IPs actuales
fly ips list -a my-clawdbot

# Liberar IP pública
fly ips release <public-ipv4> -a my-clawdbot
fly ips release <public-ipv6> -a my-clawdbot

# Cambiar a configuración privada para que los despliegues futuros no reasignen IP pública
fly deploy -c fly.private.toml

# Solo asignar IPv6 privada
fly ips allocate-v6 --private -a my-clawdbot
```

**Acceder al Despliegue Privado**:

Como no hay URL pública, usa uno de estos métodos:

**Opción 1: Proxy Local (Más Simple)**

```bash
# Reenviar puerto local 3000 a la aplicación
fly proxy 3000:3000 -a my-clawdbot

# Luego abrir http://localhost:3000 en el navegador
```

**Opción 2: VPN WireGuard**

```bash
# Crear configuración WireGuard (una sola vez)
fly wireguard create

# Importar al cliente WireGuard, luego acceder mediante IPv6 interna
# Ejemplo: http://[fdaa:x:x:x:x::x]:3000
```

**Opción 3: Solo SSH**

```bash
fly ssh console -a my-clawdbot
```

### Costos

Con la configuración recomendada (`shared-cpu-2x`, 2GB RAM):
- Aproximadamente $10-15/mes según el uso
- El nivel gratuito incluye algunas cuotas

Ver detalles en: [Precios de Fly.io](https://fly.io/docs/about/pricing/)

---

## Despliegue en Hetzner VPS

**Apto para**: VPS propio, control total, ejecución 24/7 de bajo costo

### Objetivo

Ejecutar un Gateway de Clawdbot persistente en un VPS de Hetzner usando Docker, con estado persistente, binarios integrados y comportamiento seguro de reinicio.

Si buscas "Clawdbot 24/7 por unos $5/mes", esta es la configuración más simple y confiable.

### Requisitos Previos

- VPS de Hetzner con acceso root
- Acceso SSH desde tu computadora portátil
- Conocimientos básicos de SSH + copiar/pegar
- Aproximadamente 20 minutos
- Docker y Docker Compose
- Credenciales de autenticación del modelo
- Credenciales de proveedor opcionales (QR de WhatsApp, token de bot de Telegram, OAuth de Gmail)

### Paso 1: Configurar el VPS

Crea un VPS Ubuntu o Debian en Hetzner.

Conéctate como root:

```bash
ssh root@YOUR_VPS_IP
```

Esta guía asume que el VPS es stateful. No lo trates como infraestructura desechable.

### Paso 2: Instalar Docker en el VPS

```bash
apt-get update
apt-get install -y git curl ca-certificates
curl -fsSL https://get.docker.com | sh
```

Verificar:

```bash
docker --version
docker compose version
```

### Paso 3: Clonar el Repositorio de Clawdbot

```bash
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot
```

Esta guía asume que construirás una imagen personalizada para garantizar la persistencia de los binarios.

### Paso 4: Crear Directorios Persistentes en el Host

Los contenedores Docker son temporales. Todo el estado de larga duración debe existir en el host.

```bash
mkdir -p /root/.clawdbot
mkdir -p /root/clawd

# Establecer propietario al usuario del contenedor (uid 1000):
chown -R 1000:1000 /root/.clawdbot
chown -R 1000:1000 /root/clawd
```

### Paso 5: Configurar Variables de Entorno

Crea `.env` en la raíz del repositorio.

```bash
CLAWDBOT_IMAGE=clawdbot:latest
CLAWDBOT_GATEWAY_TOKEN=change-me-now
CLAWDBOT_GATEWAY_BIND=lan
CLAWDBOT_GATEWAY_PORT=18789
CLAWDBOT_CONFIG_DIR=/root/.clawdbot
CLAWDBOT_WORKSPACE_DIR=/root/clawd
GOG_KEYRING_PASSWORD=change-me-now
XDG_CONFIG_HOME=/home/node/.clawdbot
```

Generar secrets seguros:

```bash
openssl rand -hex 32
```

::: warning No hagas commit de este archivo
Agrega `.env` a `.gitignore`.
:::

### Paso 6: Configuración de Docker Compose

Crea o actualiza `docker-compose.yml`.

```yaml
services:
  clawdbot-gateway:
    image: ${CLAWDBOT_IMAGE}
    build: .
    restart: unless-stopped
    env_file:
      - .env
    environment:
      - HOME=/home/node
      - NODE_ENV=production
      - TERM=xterm-256color
      - CLAWDBOT_GATEWAY_BIND=${CLAWDBOT_GATEWAY_BIND}
      - CLAWDBOT_GATEWAY_PORT=${CLAWDBOT_GATEWAY_PORT}
      - CLAWDBOT_GATEWAY_TOKEN=${CLAWDBOT_GATEWAY_TOKEN}
      - GOG_KEYRING_PASSWORD=${GOG_KEYRING_PASSWORD}
      - XDG_CONFIG_HOME=${XDG_CONFIG_HOME}
      - PATH=/home/linuxbrew/.linuxbrew/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
    volumes:
      - ${CLAWDBOT_CONFIG_DIR}:/home/node/.clawdbot
      - ${CLAWDBOT_WORKSPACE_DIR}:/home/node/clawd
    ports:
      # Recomendado: mantener Gateway solo en loopback en el VPS; acceder mediante túnel SSH.
      # Para exposición pública, elimina el prefijo `127.0.0.1:` y configura el firewall apropiadamente.
      - "127.0.0.1:${CLAWDBOT_GATEWAY_PORT}:18789"
      # Opcional: solo si ejecutas nodos iOS/Android en este VPS y necesitas un host Canvas.
      # Si expones este puerto, lee /gateway/security y configura el firewall apropiadamente.
      # - "18793:18793"
    command:
      [
        "node",
        "dist/index.js",
        "gateway",
        "--bind",
        "${CLAWDBOT_GATEWAY_BIND}",
        "--port",
        "${CLAWDBOT_GATEWAY_PORT}"
      ]
```

### Paso 7: Integrar los Binarios Requeridos en la Imagen (Crítico)

Instalar binarios en un contenedor en ejecución es una trampa. Todo lo instalado en tiempo de ejecución se perderá al reiniciar.

Todos los binarios externos necesarios para las habilidades deben instalarse durante la construcción de la imagen.

El siguiente ejemplo muestra solo tres binarios comunes:
- `gog` para acceso a Gmail
- `goplaces` para Google Places
- `wacli` para WhatsApp

Estos son ejemplos, no una lista completa. Puedes instalar tantos binarios como necesites usando el mismo patrón.

Si más tarde agregas nuevas habilidades que dependen de binarios adicionales, debes:

1. Actualizar el Dockerfile
2. Reconstruir la imagen
3. Reiniciar el contenedor

**Dockerfile de Ejemplo**:

```dockerfile
FROM node:22-bookworm

RUN apt-get update && apt-get install -y socat && rm -rf /var/lib/apt/lists/*

# Ejemplo Binario 1: Gmail CLI
RUN curl -L https://github.com/steipete/gog/releases/latest/download/gog_Linux_x86_64.tar.gz \
| tar -xz -C /usr/local/bin/

# Ejemplo Binario 2: Google Places CLI
RUN curl -L https://github.com/steipete/goplaces/releases/latest/download/goplaces_Linux_x86_64.tar.gz \
| tar -xz -C /usr/local/bin/

# Ejemplo Binario 3: WhatsApp CLI
RUN curl -L https://github.com/steipete/wacli/releases/latest/download/wacli_Linux_x86_64.tar.gz \
| tar -xz -C /usr/local/bin/

# Agrega más binarios usando el mismo patrón a continuación

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY ui/package.json ./ui/package.json
COPY scripts ./scripts

RUN corepack enable
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
RUN pnpm ui:install
RUN pnpm ui:build

ENV NODE_ENV=production

CMD ["node","dist/index.js"]
```

### Paso 8: Construir e Iniciar

```bash
docker compose build
docker compose up -d clawdbot-gateway
```

Verificar los binarios:

```bash
docker compose exec clawdbot-gateway which gog
docker compose exec clawdbot-gateway which goplaces
docker compose exec clawdbot-gateway which wacli
```

Salida esperada:

```
/usr/local/bin/gog
/usr/local/bin/goplaces
/usr/local/bin/wacli
```

### Paso 9: Verificar Gateway

```bash
docker compose logs -f clawdbot-gateway
```

Éxito:

```
[gateway] listening on ws://0.0.0.0:18789
```

Desde tu computadora portátil:

```bash
ssh -N -L 18789:127.0.0.1:18789 root@YOUR_VPS_IP
```

Abrir:

`http://127.0.0.1:18789/`

Pega tu token de Gateway.

### Ubicación de Persistencia del Estado (Fuente de Verdad)

Clawdbot se ejecuta en Docker, pero Docker no es la fuente de verdad.

Todo el estado de larga duración debe sobrevivir a reinicios, reconstrucciones y nuevos inicios.

| Componente | Ubicación | Mecanismo de Persistencia | Notas |
| --- | --- | --- | --- |
| Configuración de Gateway | `/home/node/.clawdbot/` | Volumen montado del host | Incluye `clawdbot.json`, tokens |
| Perfiles de autenticación del modelo | `/home/node/.clawdbot/` | Volumen montado del host | Tokens OAuth, API keys |
| Configuraciones de habilidades | `/home/node/.clawdbot/skills/` | Volumen montado del host | Estado a nivel de habilidad |
| Espacio de trabajo del agente | `/home/node/clawd/` | Volumen montado del host | Código y artefactos del agente |
| Sesión de WhatsApp | `/home/node/.clawdbot/` | Volumen montado del host | Conserva el inicio de sesión QR |
| Llavero de Gmail | `/home/node/.clawdbot/` | Volumen del host + contraseña | Requiere `GOG_KEYRING_PASSWORD` |
| Binarios externos | `/usr/local/bin/` | Imagen Docker | Debe integrarse en tiempo de compilación |
| Runtime de Node | Sistema de archivos del contenedor | Imagen Docker | Reconstruido con cada compilación de imagen |
| Paquetes del SO | Sistema de archivos del contenedor | Imagen Docker | No instalar en tiempo de ejecución |
| Contenedor Docker | Temporal | Reiniciable | Puede destruirse de forma segura |

---

## Despliegue en exe.dev

**Apto para**: Hosting Linux económico, acceso remoto, sin necesidad de configurar tu propio VPS

### Objetivo

Ejecutar Gateway de Clawdbot en una VM de exe.dev, accesible desde tu computadora portátil mediante:
- **Proxy HTTPS de exe.dev** (simple, sin gestión de túneles)
- **Túnel SSH** (más seguro; Gateway solo loopback)

Esta guía asume **Ubuntu/Debian**. Si elegiste una distribución diferente, mapea los paquetes correspondientemente. Si estás en cualquier otro VPS Linux, se aplican los mismos pasos—simplemente no usarás los comandos de proxy de exe.dev.

### Requisitos Previos

- Cuenta de exe.dev + `ssh exe.dev` funcionando en tu computadora portátil
- SSH keys configurados (tu computadora portátil → exe.dev)
- Autenticación del modelo que vas a usar (OAuth o API key)
- Credenciales de proveedor opcionales (escaneo QR de WhatsApp, token de bot de Telegram, token de bot de Discord, etc.)

### Paso 1: Crear VM

Desde tu computadora portátil:

```bash
ssh exe.dev new --name=clawdbot
```

Luego conecta:

```bash
ssh clawdbot.exe.xyz
```

::: tip Mantén la VM Stateful
Mantén esta VM **stateful**. Clawdbot almacena estado en `~/.clawdbot/` y `~/clawd/`.
:::

### Paso 2: Instalar Prerrequisitos en la VM

```bash
sudo apt-get update
sudo apt-get install -y git curl jq ca-certificates openssl
```

### Node 22

Instala Node **≥ 22.12** (cualquier método funciona). Verificación rápida:

```bash
node -v
```

Si Node 22 aún no está en la VM, usa tu gestor de Node preferido o los repositorios de paquetes de la distribución que proporcionen Node 22+.

### Paso 3: Instalar Clawdbot

La instalación global con npm se recomienda en servidores:

```bash
npm i -g clawdbot@latest
clawdbot --version
```

Si la instalación de dependencias nativas falla (raro; usualmente `sharp`), agrega herramientas de compilación:

```bash
sudo apt-get install -y build-essential python3
```

### Paso 4: Configuración Inicial (Asistente)

Ejecuta el asistente de configuración inicial en la VM:

```bash
clawdbot onboard --install-daemon
```

Puede configurar:
- Inicialización del espacio de trabajo `~/clawd`
- Configuración `~/.clawdbot/clawdbot.json`
- Perfiles de autenticación del modelo
- Configuración/inicio de sesión del proveedor de modelos
- Servicio de usuario **user** de Linux systemd

Si realizas OAuth en una VM sin cabeza, primero haz OAuth en una máquina normal, luego copia el perfil de autenticación a la VM (consulta [Ayuda](https://docs.clawd.bot/help/)).

### Paso 5: Opciones de Acceso Remoto

#### Opción A (Recomendada): Túnel SSH (Solo Loopback)

Mantén Gateway en loopback (predeterminado) y enrútalo mediante túnel SSH desde tu computadora portátil:

```bash
ssh -N -L 18789:127.0.0.1:18789 clawdbot.exe.xyz
```

Abre localmente:

- `http://127.0.0.1:18789/` (Control UI)

Ver detalles en: [Acceso Remoto](https://docs.clawd.bot/gateway/remote)

#### Opción B: Proxy HTTPS de exe.dev (Sin Gestión de Túneles)

Para que exe.dev haga proxy del tráfico a la VM, vincula Gateway a la interfaz LAN y configura un token:

```bash
export CLAWDBOT_GATEWAY_TOKEN="$(openssl rand -hex 32)"
clawdbot gateway --bind lan --port 8080 --token "$CLAWDBOT_GATEWAY_TOKEN"
```

Para ejecución como servicio, persístelo en `~/.clawdbot/clawdbot.json`:

```json5
{
  "gateway": {
    "mode": "local",
    "port": 8080,
    "bind": "lan",
    "auth": { "mode": "token", "token": "YOUR_TOKEN" }
  }
}
```

::: info Nota Importante
La vinculación no loopback requiere `gateway.auth.token` (o `CLAWDBOT_GATEWAY_TOKEN`). `gateway.remote.token` es solo para llamadas CLI remotas; no habilita la autenticación local.
:::

Luego apunta el proxy de exe.dev al puerto que elijas (ejemplo usa `8080`, o cualquier puerto que prefieras) y abre la URL HTTPS de tu VM:

```bash
ssh exe.dev share port clawdbot 8080
```

Abrir:

`https://clawdbot.exe.xyz/`

En Control UI, pega el token (UI → Configuración → token). La UI lo envía como `connect.params.auth.token`.

::: tip Puerto del Proxy
Si el proxy espera el puerto de la aplicación, prioriza un puerto **no predeterminado** (como `8080`). Trata el token como una contraseña.
:::

### Paso 6: Mantener en Ejecución (Servicio)

En Linux, Clawdbot usa un servicio systemd **user**. Después de `--install-daemon`, verifica:

```bash
systemctl --user status clawdbot-gateway[-<profile>].service
```

Si el servicio muere después de cerrar sesión, habilita lingering:

```bash
sudo loginctl enable-linger "$USER"
```

### Paso 7: Actualizar

```bash
npm i -g clawdbot@latest
clawdbot doctor
clawdbot gateway restart
clawdbot health
```

Ver detalles en: [Actualización](https://docs.clawd.bot/install/updating)

---

## Recomendaciones de Selección

### Elegir Según el Escenario de Uso

| Escenario | Despliegue Recomendado | Razón |
| --- | --- | --- |
| **Uso personal, puesta en marcha rápida** | Instalación Local | El más simple, sin infraestructura requerida |
| **Acceso multi-dispositivo, apagado ocasional** | Fly.io | 24/7 online, accesible desde cualquier lugar |
| **Control total, infraestructura propia** | Hetzner VPS | Control total, estado persistente, bajo costo |
| **Bajo costo, sin gestión de VPS** | exe.dev | Hosting económico, configuración rápida |
| **Reproducibilidad, rollback rápido** | Nix | Configuración declarativa, versiones fijadas |
| **Pruebas, entornos aislados** | Docker | Fácil de reconstruir, aislamiento de pruebas |

### Mejores Prácticas de Seguridad

Independientemente del método de despliegue elegido, debes seguir estos principios de seguridad:

::: warning Autenticación y Control de Acceso
- Siempre configura autenticación con token o contraseña para Gateway (cuando uses vinculación no loopback)
- Usa variables de entorno para almacenar credenciales sensibles (API keys, tokens)
- Para despliegues en la nube, evita la exposición pública o usa redes privadas
:::

::: tip Persistencia del Estado
- Para despliegues containerizados, asegúrate de que la configuración y el espacio de trabajo estén correctamente montados en volúmenes del host
- Para despliegues en VPS, realiza copias de seguridad periódicas de los directorios `~/.clawdbot/` y `~/clawd/`
:::

### Monitoreo y Registros

- Verifica periódicamente el estado de Gateway: `clawdbot doctor`
- Configura rotación de registros para evitar el agotamiento del espacio en disco
- Usa el endpoint de verificación de salud para validar la disponibilidad del servicio

---

## Punto de Verificación ✅

**Verificación de Instalación Local**:

```bash
clawdbot --version
clawdbot health
```

Deberías ver un mensaje indicando que Gateway está escuchando.

**Verificación Docker**:

```bash
docker compose ps
docker compose logs clawdbot-gateway
```

El estado del contenedor debería ser `Up`, y los registros deberían mostrar `[gateway] listening on ws://...`.

**Verificación Nix**:

```bash
# Verificar estado del servicio
systemctl --user status clawdbot-gateway

# Verificar modo Nix
defaults read com.clawdbot.mac clawdbot.nixMode
```

**Verificación Despliegue en la Nube**:

```bash
# Fly.io
fly status
fly logs

# Hetzner / exe.dev
ssh root@YOUR_VPS_IP "docker compose logs -f clawdbot-gateway"
```

Deberías poder acceder a Control UI mediante el navegador o túnel SSH.

---

## Advertencias de Problemas Comunes

::: warning Problemas Comunes de Docker
- **Rutas de montaje incorrectas**: Asegúrate de que las rutas del host estén compartidas con Docker Desktop
- **Conflictos de puerto**: Verifica que el puerto 18789 no esté ocupado
- **Problemas de permisos**: El usuario del contenedor (uid 1000) necesita permisos de lectura/escritura en los volúmenes montados
:::

::: warning Problemas de Despliegue en la Nube
- **Errores OOM**: Aumenta la asignación de memoria (al menos 2GB)
- **Bloqueo de Gateway**: Elimina el archivo `/data/gateway.*.lock` y reinicia el contenedor
- **Fallos de verificación de salud**: Asegúrate de que `internal_port` coincida con el puerto de Gateway
:::

::: tip Persistencia de Binarios (Hetzner)
¡No instales dependencias en tiempo de ejecución! Todos los binarios necesarios para las habilidades deben integrarse en la imagen Docker; de lo contrario, se perderán después del reinicio del contenedor.
:::

---

## Resumen de la Lección

Esta lección presentó los diversos métodos de despliegue de Clawdbot:

1. **Instalación Local**: La más simple y rápida, adecuada para uso personal y desarrollo
2. **Despliegue Docker**: Entorno aislado, fácil de reconstruir, soporte para sandbox
3. **Despliegue Nix**: Configuración declarativa, reproducible, rollback rápido
4. **Fly.io**: Plataforma en la nube, HTTPS automático, 24/7 online
5. **Hetzner VPS**: VPS propio, control total, estado persistente
6. **exe.dev**: Hosting económico, configuración rápida, operaciones simplificadas

Al elegir un método de despliegue, considera tu escenario de uso, capacidades técnicas y requisitos operativos. Asegurar la persistencia del estado y la configuración de seguridad son clave para un despliegue exitoso.

---

## Apéndice: Referencia del Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-27

| Funcionalidad/Capítulo | Ruta del Archivo | Número de Línea |
| --- | --- | --- |
| Script de despliegue Docker | [`docker-setup.sh`](https://github.com/moltbot/moltbot/blob/main/docker-setup.sh) | Completo |
| Definición de imagen Docker | [`Dockerfile`](https://github.com/moltbot/moltbot/blob/main/Dockerfile) | Completo |
| Configuración de Docker Compose | [`docker-compose.yml`](https://github.com/moltbot/moltbot/blob/main/docker-compose.yml) | Completo |
| Configuración de Fly.io | [`fly.toml`](https://github.com/moltbot/moltbot/blob/main/fly.toml) | Completo |
| Configuración privada de Fly | [`fly.private.toml`](https://github.com/moltbot/moltbot/blob/main/fly.private.toml) | Completo |
| Imagen Docker de sandbox | [`Dockerfile.sandbox`](https://github.com/moltbot/moltbot/blob/main/Dockerfile.sandbox) | Completo |
| Integración Nix | [`nix-clawdbot`](https://github.com/clawdbot/nix-clawdbot) | README |
| Script de instalación | [`scripts/package-mac-app.sh`](https://github.com/moltbot/moltbot/blob/main/scripts/package-mac-app.sh) | Completo |

**Archivos de Configuración Clave**:
- `~/.clawdbot/clawdbot.json`: Archivo de configuración principal
- `~/.clawdbot/`: Directorio de estado (sesiones, tokens, perfiles de autenticación)
- `~/clawd/`: Directorio de espacio de trabajo

**Variables de Entorno Clave**:
- `CLAWDBOT_GATEWAY_TOKEN`: Token de autenticación de Gateway
- `CLAWDBOT_STATE_DIR`: Ruta del directorio de estado
- `CLAWDBOT_CONFIG_PATH`: Ruta del archivo de configuración
- `CLAWDBOT_NIX_MODE`: Habilitar modo Nix

**Scripts Clave**:
- `scripts/sandbox-setup.sh`: Construir imagen de sandbox predeterminada
- `scripts/sandbox-common-setup.sh`: Construir imagen de sandbox común
- `scripts/sandbox-browser-setup.sh`: Construir imagen de sandbox de navegador

**Variables de Entorno Docker** (.env):
- `CLAWDBOT_IMAGE`: Nombre de la imagen a usar
- `CLAWDBOT_GATEWAY_BIND`: Modo de vinculación (lan/auto)
- `CLAWDBOT_GATEWAY_PORT`: Puerto de Gateway
- `CLAWDBOT_CONFIG_DIR`: Montaje del directorio de configuración
- `CLAWDBOT_WORKSPACE_DIR`: Montaje del espacio de trabajo
- `GOG_KEYRING_PASSWORD`: Contraseña del llavero de Gmail
- `XDG_CONFIG_HOME`: Directorio de configuración XDG

**Variables de Entorno de Fly.io**:
- `NODE_ENV`: Entorno de ejecución (production)
- `CLAWDBOT_PREFER_PNPM`: Usar pnpm
- `CLAWDBOT_STATE_DIR`: Directorio de estado persistente
- `NODE_OPTIONS`: Opciones de tiempo de ejecución de Node.js

</details>
