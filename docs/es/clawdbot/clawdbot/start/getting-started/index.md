---
title: "Inicio rápido: Instalar y ejecutar Clawdbot | Tutorial"
sidebarTitle: "Listo en 5 minutos"
subtitle: "Inicio rápido: Instalar, configurar y ejecutar Clawdbot"
description: "Aprende a instalar Clawdbot, configurar modelos de IA, iniciar Gateway y enviar tu primer mensaje a través de WhatsApp/Telegram/Slack y otros canales."
tags:
  - "Primeros pasos"
  - "Instalación"
  - "Configuración"
  - "Gateway"
prerequisite: []
order: 10
---

# Inicio rápido: Instalar, configurar y ejecutar Clawdbot

## Lo que aprenderás

Al completar este tutorial, podrás:

- ✅ Instalar Clawdbot en tu dispositivo
- ✅ Configurar la autenticación del modelo de IA (Anthropic / OpenAI / otros proveedores)
- ✅ Iniciar el demonio Gateway
- ✅ Enviar tu primer mensaje a través de WebChat o los canales configurados

## Tu situación actual

Quizás estés pensando:

- "Un asistente de IA local suena complicado, ¿por dónde empiezo?"
- "Tengo muchos dispositivos (teléfono, ordenador), ¿cómo los gestiono de forma unificada?"
- "Conozco WhatsApp/Telegram/Slack, ¿puedo usar estos para hablar con la IA?"

La buena noticia es: **Clawdbot está diseñado precisamente para resolver estos problemas**.

## Cuándo usar esto

Cuando necesites:

- 🚀 **Configuración inicial** de tu asistente de IA personal
- 🔧 **Configurar múltiples canales** (WhatsApp, Telegram, Slack, Discord, etc.)
- 🤖 **Conectar modelos de IA** (Anthropic Claude, OpenAI GPT, etc.)
- 📱 **Coordinación entre dispositivos** (nodos macOS, iOS, Android)

::: tip ¿Por qué recomendamos el modo Gateway?
Gateway es el plano de control de Clawdbot, que:
- Gestiona de forma unificada todas las sesiones, canales, herramientas y eventos
- Soporta conexiones concurrentes de múltiples clientes
- Permite que los nodos de dispositivos ejecuten operaciones locales
:::

## 🎒 Preparativos

### Requisitos del sistema

| Componente | Requisito |
| ----------- | ----------- |
| **Node.js** | ≥ 22.12.0 |
| **Sistema operativo** | macOS / Linux / Windows (WSL2) |
| **Gestor de paquetes** | npm / pnpm / bun |

::: warning Atención usuarios de Windows
En Windows se recomienda encarecidamente usar **WSL2**, porque:
- Muchos canales dependen de binarios locales
- Los demonios (launchd/systemd) no están disponibles en Windows
:::

### Modelos de IA recomendados

Aunque se admite cualquier modelo, recomendamos encarecidamente:

| Proveedor | Modelo recomendado | Razón |
| ---------- | ---------------- | -------- |
| Anthropic | Claude Opus 4.5 | Ventaja de contexto largo, mayor resistencia a inyección de prompts |
| OpenAI | GPT-5.2 + Codex | Fuerte capacidad de programación, soporte multimodal |

---

## Conceptos clave

La arquitectura de Clawdbot es simple: **un Gateway, múltiples canales, un asistente de IA**.

```
WhatsApp / Telegram / Slack / Discord / Signal / iMessage / WebChat
                │
                ▼
        ┌──────────────────┐
        │   Gateway       │  ← Plano de control (demonio)
        │   127.0.0.1:18789 │
        └────────┬─────────┘
                 │
                 ├→ AI Agent (pi-mono RPC)
                 ├→ CLI (clawdbot ...)
                 ├→ WebChat UI
                 └→ Nodos macOS / iOS / Android
```

**Conceptos clave**:

| Concepto | Función |
| -------- | -------- |
| **Gateway** | Demonio responsable de la gestión de sesiones, conexiones de canales e invocación de herramientas |
| **Channel** | Canal de mensajería (WhatsApp, Telegram, Slack, etc.) |
| **Agent** | Entorno de ejecución de IA (modo RPC basado en pi-mono) |
| **Node** | Nodo de dispositivo (macOS/iOS/Android), ejecuta operaciones locales del dispositivo |

---

## Sigue estos pasos

### Paso 1: Instalar Clawdbot

**Por qué**
Después de la instalación global, el comando `clawdbot` estará disponible en cualquier lugar.

#### Método A: Usar npm (recomendado)

```bash
npm install -g clawdbot@latest
```

#### Método B: Usar pnpm

```bash
pnpm add -g clawdbot@latest
```

#### Método C: Usar bun

```bash
bun install -g clawdbot@latest
```

**Deberías ver**:
```
added 1 package, and audited 1 package in 3s
```

::: tip Opción para desarrolladores
Si planeas desarrollar o contribuir desde el código fuente, ve al [Apéndice: Construir desde el código fuente](#construir-desde-el-código-fuente).
:::

---

### Paso 2: Ejecutar el asistente de onboarding

**Por qué**
El asistente te guiará a través de todas las configuraciones necesarias: Gateway, canales y habilidades.

#### Iniciar el asistente (recomendado)

```bash
clawdbot onboard --install-daemon
```

**Lo que te preguntará el asistente**:

| Paso | Pregunta | Descripción |
| --------- | --------------------------------- | ------------------ |
| 1 | Seleccionar método de autenticación del modelo de IA | OAuth / API Key |
| 2 | Configurar Gateway (puerto, autenticación) | Por defecto: 127.0.0.1:18789 |
| 3 | Configurar canales (WhatsApp, Telegram, etc.) | Se puede omitir, configurar más tarde |
| 4 | Configurar habilidades (opcional) | Se puede omitir |

**Deberías ver**:
```
✓ Gateway configured
✓ Workspace initialized: ~/clawd
✓ Channels configured
✓ Skills installed

To start the gateway, run:
  clawdbot gateway
```

::: info ¿Qué es el Daemon?
`--install-daemon` instalará el demonio Gateway:
- **macOS**: Servicio launchd (nivel de usuario)
- **Linux**: Servicio de usuario systemd

De esta forma, Gateway se ejecutará automáticamente en segundo plano sin necesidad de iniciarlo manualmente.
:::

---

### Paso 3: Iniciar Gateway

**Por qué**
Gateway es el plano de control de Clawdbot, debe iniciarse primero.

#### Inicio en primer plano (para depuración)

```bash
clawdbot gateway --port 18789 --verbose
```

**Deberías ver**:
```
[clawdbot] Gateway started
[clawdbot] Listening on ws://127.0.0.1:18789
[clawdbot] Ready to accept connections
```

#### Inicio en segundo plano (recomendado)

Si usaste `--install-daemon` en el asistente, Gateway se iniciará automáticamente.

Verificar estado:

```bash
clawdbot gateway status
```

**Deberías ver**:
```
Gateway is running
PID: 12345
Port: 18789
```

::: tip Opciones comunes
- `--port 18789`: Especifica el puerto de Gateway (por defecto 18789)
- `--verbose`: Habilita registros detallados (útil para depuración)
- `--reset`: Reinicia Gateway (limpia las sesiones)
:::

---

### Paso 4: Enviar tu primer mensaje

**Por qué**
Verificar que la instalación fue exitosa y experimentar la respuesta del asistente de IA.

#### Método A: Usar CLI para conversar directamente

```bash
clawdbot agent --message "Ship checklist" --thinking high
```

**Deberías ver**:
```
[clawdbot] Agent is thinking...
[clawdbot] 🚢 Ship checklist:
1. Check Node.js version (≥ 22)
2. Install Clawdbot globally
3. Run onboarding wizard
4. Start Gateway
5. Send test message
```

#### Método B: Enviar mensaje a través de canales

Si configuraste canales en el asistente (como WhatsApp, Telegram), puedes enviar mensajes directamente a tu asistente de IA en la aplicación correspondiente.

**Ejemplo de WhatsApp**:

1. Abre WhatsApp
2. Busca tu número de Clawdbot
3. Envía el mensaje: `Hello, I'm testing Clawdbot!`

**Deberías ver**:
- El asistente de IA responde a tu mensaje

::: info Protección de emparejamiento DM
Por defecto, Clawdbot habilita la **protección de emparejamiento DM**:
- Los remitentes desconocidos recibirán un código de emparejamiento
- Los mensajes no se procesarán hasta que apruebes el emparejamiento

Más detalles: [Emparejamiento DM y control de acceso](../pairing-approval/)
:::

---

## Punto de control ✅

Después de completar los pasos anteriores, deberías poder:

- [ ] Ejecutar `clawdbot --version` y ver el número de versión
- [ ] Ejecutar `clawdbot gateway status` y ver que Gateway está en ejecución
- [ ] Enviar mensajes a través de CLI y recibir respuestas de IA
- [ ] (Opcional) Enviar mensajes en los canales configurados y recibir respuestas de IA

::: tip Preguntas frecuentes
**P: ¿Gateway falla al iniciar?**
R: Verifica si el puerto está ocupado:
```bash
lsof -i :18789  # macOS/Linux
netstat -ano | findstr :18789  # Windows
```

**P: ¿La IA no responde?**
R: Verifica si la API Key está configurada correctamente:
```bash
clawdbot models list
```

**P: ¿Cómo ver registros detallados?**
R: Añade `--verbose` al iniciar:
```bash
clawdbot gateway --verbose
```
:::

---

## Advertencias de problemas comunes

### ❌ Olvidar instalar el Daemon

**Práctica incorrecta**:
```bash
clawdbot onboard  # Olvidó --install-daemon
```

**Práctica correcta**:
```bash
clawdbot onboard --install-daemon
```

::: warning Primer plano vs Segundo plano
- Primer plano: Adecuado para depuración, se detendrá al cerrar la terminal
- Segundo plano: Adecuado para entornos de producción, se reiniciará automáticamente
:::

### ❌ Versión de Node.js demasiado antigua

**Práctica incorrecta**:
```bash
node --version
# v20.x.x  # Demasiado antigua
```

**Práctica correcta**:
```bash
node --version
# v22.12.0 o superior
```

### ❌ Ruta de archivo de configuración incorrecta

Ubicación predeterminada del archivo de configuración de Clawdbot:

| Sistema operativo | Ruta de configuración |
| -------- | --------------------------- |
| macOS/Linux | `~/.clawdbot/clawdbot.json` |
| Windows (WSL2) | `~/.clawdbot/clawdbot.json` |

Si editas manualmente el archivo de configuración, asegúrate de que la ruta sea correcta.

---

## Resumen de esta lección

En esta lección aprendiste:

1. ✅ **Instalar Clawdbot**: Usar npm/pnpm/bun para instalación global
2. ✅ **Ejecutar el asistente**: `clawdbot onboard --install-daemon` para completar la configuración
3. ✅ **Iniciar Gateway**: `clawdbot gateway` o inicio automático del demonio
4. ✅ **Enviar mensajes**: Conversar con IA a través de CLI o canales configurados

**Siguientes pasos**:

- Aprende [Configuración guiada](../onboarding-wizard/) para conocer más opciones del asistente
- Conoce [Iniciar Gateway](../gateway-startup/) para aprender diferentes modos de inicio (desarrollo/producción)
- Aprende [Enviar tu primer mensaje](../first-message/) para explorar más formatos de mensajes y métodos de interacción

---

## Vista previa de la siguiente lección

> En la siguiente lección aprenderemos **[Configuración guiada](../onboarding-wizard/)**.
>
> Aprenderás:
> - Cómo usar el asistente interactivo para configurar Gateway
> - Cómo configurar múltiples canales (WhatsApp, Telegram, Slack, etc.)
> - Cómo gestionar habilidades y autenticación de modelos de IA

---

## Apéndice: Construir desde el código fuente

Si planeas desarrollar o contribuir desde el código fuente, puedes:

### 1. Clonar el repositorio

```bash
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Construir la UI (primera ejecución)

```bash
pnpm ui:build  # Instala automáticamente las dependencias de UI
```

### 4. Construir TypeScript

```bash
pnpm build
```

### 5. Ejecutar onboarding

```bash
pnpm clawdbot onboard --install-daemon
```

### 6. Ciclo de desarrollo (recarga automática)

```bash
pnpm gateway:watch  # Recarga automática al modificar archivos TS
```

::: info Modo desarrollo vs Modo producción
- `pnpm clawdbot ...`: Ejecuta TypeScript directamente (modo desarrollo)
- Después de `pnpm build`: Genera el directorio `dist/` (modo producción)
:::

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-27

| Función | Ruta del archivo | Número de línea |
| --------------- | -------------------------------------------------------------------------------------------- | ------- |
| Entrada CLI | [`src/cli/run-main.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/run-main.ts) | 26-60 |
| Comando Onboarding | [`src/cli/program/register.onboard.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/program/register.onboard.ts) | 34-100 |
| Instalación Daemon | [`src/cli/daemon-cli/install.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/daemon-cli/install.ts) | 15-100 |
| Servicio Gateway | [`src/daemon/service.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/daemon/service.ts) | Archivo completo |
| Comprobación de tiempo de ejecución | [`src/infra/runtime-guard.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/runtime-guard.ts) | Archivo completo |

**Constantes clave**:
- `DEFAULT_GATEWAY_DAEMON_RUNTIME = "node"`: Entorno de ejecución del demonio por defecto (de `src/commands/daemon-runtime.ts`)
- `DEFAULT_GATEWAY_PORT = 18789`: Puerto de Gateway por defecto (de la configuración)

**Funciones clave**:
- `runCli()`: Entrada principal de CLI, maneja análisis de argumentos y enrutamiento de comandos (`src/cli/run-main.ts`)
- `runDaemonInstall()`: Instala el demonio Gateway (`src/cli/daemon-cli/install.ts`)
- `onboardCommand()`: Comando del asistente interactivo (`src/commands/onboard.ts`)

</details>
