---
title: "Configuración Guiada: Configuración Integral de Clawdbot | Tutorial de Clawdbot"
sidebarTitle: "Configuración en un Clic"
subtitle: "Configuración Guiada: Configuración Integral de Clawdbot"
description: "Aprende a completar la configuración integral de Clawdbot usando un asistente interactivo, incluyendo configuración de red Gateway, autenticación de modelos AI (soporta setup-token y API Key), canales de comunicación (WhatsApp, Telegram, Slack, etc.) e inicialización del sistema de habilidades."
tags:
  - "Introducción"
  - "Configuración"
  - "Asistente"
  - "Gateway"
prerequisite:
  - "getting-started"
order: 20
---

# Configuración Guiada: Configuración Integral de Clawdbot

## Lo Que Aprenderás

Con este tutorial podrás:

- ✅ Usar el asistente interactivo para completar la configuración integral de Clawdbot
- ✅ Comprender la diferencia entre los modos QuickStart y Manual
- ✅ Configurar la red Gateway y las opciones de autenticación
- ✅ Configurar los proveedores de modelos AI (setup-token y API Key)
- ✅ Habilitar canales de comunicación (WhatsApp, Telegram, etc.)
- ✅ Instalar y gestionar paquetes de habilidades

Al completar el asistente, Clawdbot Gateway se ejecutará en segundo plano y podrás conversar con el asistente de IA a través de los canales configurados.

## Tu Situación Actual

Editar manualmente los archivos de configuración es complicado:

- No se sabe el significado de las opciones de configuración ni sus valores predeterminados
- Es fácil omitir configuraciones clave que impiden el inicio
- Los métodos de autenticación de modelos AI son variados (OAuth, API Key) y no se sabe cuál elegir
- La configuración de canales es compleja y cada plataforma tiene diferentes métodos de autenticación
- No se sabe qué habilidades instalar en el sistema de habilidades

La configuración guiada resuelve estos problemas, guiándote a través de todas las configuraciones mediante preguntas interactivas y proporcionando valores predeterminados razonables.

## Cuándo Usar Este Método

- **Primera instalación**: Nuevos usuarios usando Clawdbot por primera vez
- **Reconfiguración**: Necesitas modificar la configuración de Gateway, cambiar el modelo de IA o agregar nuevos canales
- **Validación rápida**: Quieres experimentar las funciones básicas rápidamente sin profundizar en los archivos de configuración
- **Solución de problemas**: Después de errores de configuración, usar el asistente para reinicializar

::: tip Consejo
El asistente detectará las configuraciones existentes y podrás elegir entre conservar, modificar o restablecer la configuración.
:::

## Conceptos Fundamentales

### Dos Modos

El asistente proporciona dos modos de configuración:

**Modo QuickStart** (recomendado para principiantes)
- Usa valores predeterminados seguros: Gateway vinculado a loopback (127.0.0.1), puerto 18789, autenticación token
- Omite la mayoría de las opciones de configuración detalladas
- Ideal para uso en una sola máquina, puesta en marcha rápida

**Modo Manual** (para usuarios avanzados)
- Configura manualmente todas las opciones
- Soporta vinculación LAN, acceso remoto Tailscale, métodos de autenticación personalizados
- Ideal para implementaciones multi-máquina, acceso remoto o entornos de red especiales

### Flujo de Configuración

```
1. Confirmación de advertencia de seguridad
2. Selección de modo (QuickStart / Manual)
3. Configuración de Gateway (puerto, vinculación, autenticación, Tailscale)
4. Autenticación de modelo AI (setup-token / API Key)
5. Configuración de espacio de trabajo (predeterminado ~/clawd)
6. Configuración de canales (WhatsApp / Telegram / Slack, etc.)
7. Instalación de habilidades (opcional)
8. Finalización (inicio de Gateway)
```

### Recordatorio de Seguridad

Al inicio, el asistente mostrará una advertencia de seguridad y deberás confirmar lo siguiente:

- Clawdbot es un proyecto amateur, aún en fase beta
- Una vez habilitadas las herramientas, la IA puede leer archivos y ejecutar operaciones
- Prompts maliciosos pueden inducir a la IA a realizar operaciones inseguras
- Se recomienda usar emparejamiento/lista blanca + herramientas de mínimos privilegios
- Realizar auditorías de seguridad periódicamente

::: danger Importante
Si no comprendes los mecanismos básicos de seguridad y control de acceso, no habilites herramientas ni expongas Gateway a Internet. Se recomienda pedir ayuda a alguien con experiencia para configurar antes de usar.
:::

---

## 🎒 Preparación Antes de Comenzar

Antes de ejecutar el asistente, confirma:

- **Clawdbot instalado**: Consulta [Inicio Rápido](../getting-started/) para completar la instalación
- **Versión de Node.js**: Asegúrate de que Node.js sea ≥ 22 (usa `node -v` para verificar)
- **Cuenta de modelo AI** (recomendado):
  - Cuenta de Anthropic Claude (suscripción Pro/Max), soporta flujo OAuth
  - O tener preparada la API Key de proveedores como OpenAI/DeepSeek
- **Cuenta de canal** (opcional): Si necesitas usar WhatsApp, Telegram, etc., registra las cuentas correspondientes primero
- **Permisos de red**: Si necesitas usar Tailscale, asegúrate de tener instalado el cliente de Tailscale

---

## Sígueme

### Paso 1: Iniciar el Asistente

Abre la terminal y ejecuta el siguiente comando:

```bash
clawdbot onboard
```

**Por qué**
Inicia el asistente de configuración interactivo, guiándote a través de todas las configuraciones necesarias.

**Deberías ver**:
```
  ┌─────────────────────────────────────────────────────┐
  │                                                   │
  │   Clawdbot onboarding                              │
  │                                                   │
  └─────────────────────────────────────────────────────┘
```

### Paso 2: Confirmar Advertencia de Seguridad

El asistente primero muestra la advertencia de seguridad (como se describe en la sección "Conceptos Fundamentales").

**Por qué**
Asegura que el usuario comprenda los riesgos potenciales y evite el uso incorrecto que cause problemas de seguridad.

**Acción**:
- Lee el contenido de la advertencia de seguridad
- Escribe `y` o selecciona `Yes` para confirmar que comprendes los riesgos
- Si no aceptas los riesgos, el asistente se cerrará

**Deberías ver**:
```
Security warning — please read.

Clawdbot is a hobby project and still in beta. Expect sharp edges.
...

I understand this is powerful and inherently risky. Continue? (y/N)
```

### Paso 3: Seleccionar Modo de Configuración

::: code-group

```bash [Modo QuickStart]
Recomendado para principiantes, usa valores predeterminados seguros:
- Puerto de Gateway: 18789
- Dirección de vinculación: Loopback (127.0.0.1)
- Método de autenticación: Token (generado automáticamente)
- Tailscale: Desactivado
```

```bash [Modo Manual]
Para usuarios avanzados, configura manualmente todas las opciones:
- Puerto de Gateway personalizado y vinculación
- Seleccionar autenticación Token o Password
- Configurar acceso remoto Tailscale Serve/Funnel
- Configurar detalladamente cada paso
```

:::

**Por qué**
El modo QuickStart permite a los principiantes ponerse en marcha rápidamente, mientras que el modo Manual permite a los usuarios avanzados un control preciso.

**Acción**:
- Usa las teclas de dirección para seleccionar `QuickStart` o `Manual`
- Presiona Enter para confirmar

**Deberías ver**:
```
? Onboarding mode
  QuickStart         Configure details later via clawdbot configure.
  Manual            Configure port, network, Tailscale, and auth options.
```

### Paso 4: Seleccionar Modo de Implementación (solo modo Manual)

Si seleccionas el modo Manual, el asistente preguntará dónde se implementará Gateway:

::: code-group

```bash [Gateway local (esta máquina)]
Gateway se ejecuta en la máquina actual:
- Puede ejecutar el flujo OAuth y escribir credenciales locales
- El asistente completará toda la configuración
- Ideal para desarrollo local o implementación en una sola máquina
```

```bash [Gateway remoto (solo información)]
Gateway se ejecuta en otra máquina:
- El asistente solo configura la URL remota y autenticación
- No ejecuta el flujo OAuth, las credenciales deben configurarse manualmente en el host remoto
- Ideal para escenarios de implementación multi-máquina
```

:::

**Por qué**
El modo Local soporta el flujo de configuración completo, mientras que el modo Remote solo configura la información de acceso.

**Acción**:
- Selecciona el modo de implementación
- Si es modo Remote, introduce la URL y token del Gateway remoto

### Paso 5: Configurar Gateway (solo modo Manual)

Si seleccionas el modo Manual, el asistente preguntará sobre la configuración de Gateway paso a paso:

#### Puerto de Gateway

```bash
? Gateway port (18789)
```

**Explicación**:
- Valor predeterminado 18789
- Si el puerto está ocupado, introduce otro puerto
- Asegúrate de que el puerto no esté bloqueado por el firewall

#### Dirección de Vinculación de Gateway

```bash
? Gateway bind
  Loopback (127.0.0.1)
  LAN (0.0.0.0)
  Tailnet (Tailscale IP)
  Auto (Loopback → LAN)
  Custom IP
```

**Descripción de opciones**:
- **Loopback**: Solo accesible desde esta máquina, más seguro
- **LAN**: Dispositivos en la red local pueden acceder
- **Tailnet**: Acceso a través de la red virtual Tailscale
- **Auto**: Primero intenta loopback, si falla cambia a LAN
- **Custom IP**: Especifica manualmente la dirección IP

::: tip Consejo
Se recomienda usar Loopback o Tailnet, evitando exponer directamente a la red local.
:::

#### Método de Autenticación de Gateway

```bash
? Gateway auth
  Token              Recommended default (local + remote)
  Password
```

**Descripción de opciones**:
- **Token**: Opción recomendada, genera automáticamente un token aleatorio, soporta acceso remoto
- **Password**: Usa una contraseña personalizada, obligatorio para el modo Tailscale Funnel

#### Acceso Remoto Tailscale (opcional)

```bash
? Tailscale exposure
  Off               No Tailscale exposure
  Serve             Private HTTPS for your tailnet (devices on Tailscale)
  Funnel            Public HTTPS via Tailscale Funnel (internet)
```

::: warning Advertencia Tailscale
- Modo Serve: Solo dispositivos en la red Tailscale pueden acceder
- Modo Funnel: Expuesto a través de HTTPS público mediante Tailscale Funnel (requiere autenticación por contraseña)
- Asegúrate de que el cliente Tailscale esté instalado: https://tailscale.com/download/mac
:::

### Paso 6: Configurar Espacio de Trabajo

El asistente preguntará por el directorio del espacio de trabajo:

```bash
? Workspace directory (~/clawd)
```

**Explicación**:
- Valor predeterminado `~/clawd` (es decir, `/Users/tu-nombre-de-usuario/clawd`)
- El espacio de trabajo almacena historial de sesiones, configuraciones de agentes, datos de habilidades, etc.
- Puedes usar rutas absolutas o relativas

::: info Soporte Multi-Perfil (Profile)
Mediante la configuración de la variable de entorno `CLAWDBOT_PROFILE`, puedes usar configuraciones independientes para diferentes entornos de trabajo:

| Valor de Profile | Ruta del Espacio de Trabajo | Archivo de Configuración |
|--- | --- | ---|
| `default` o no configurado | `~/clawd` | `~/.clawdbot/clawdbot.json` |
| `work` | `~/clawd-work` | `~/.clawdbot/clawdbot.json` (work profile) |
| `dev` | `~/clawd-dev` | `~/.clawdbot/clawdbot.json` (dev profile) |

Ejemplo:
```bash
# Usar profile work
export CLAWDBOT_PROFILE=work
clawdbot onboard
```
:::

**Deberías ver**:
```
Ensuring workspace directory: /Users/tu-nombre-de-usuario/clawd
Creating sessions.json...
Creating agents directory...
```

### Paso 7: Configurar Autenticación de Modelo AI

El asistente listará los proveedores de modelos AI soportados:

```bash
? Choose AI model provider
  Anthropic                    Claude Code CLI + API key
  OpenAI                       Codex OAuth + API key
  MiniMax                      M2.1 (recommended)
  Qwen                         OAuth
  Venice AI                     Privacy-focused (uncensored models)
  Google                       Gemini API key + OAuth
  Copilot                      GitHub + local proxy
  Vercel AI Gateway            API key
  Moonshot AI                  Kimi K2 + Kimi Code
  Z.AI (GLM 4.7)            API key
  OpenCode Zen                 API key
  OpenRouter                   API key
  Custom API Endpoint
  Skip for now
```

Después de seleccionar un proveedor, el asistente mostrará los métodos de autenticación específicos según el tipo de proveedor. A continuación se muestran las opciones de autenticación de los principales proveedores:

**Métodos de autenticación Anthropic**:
- `claude-cli`: Usa la autenticación OAuth existente de Claude Code CLI (requiere acceso a Keychain)
- `token`: Pega el setup-token generado mediante `claude setup-token`
- `apiKey`: Introduce manualmente la Anthropic API Key

::: info Método setup-token de Anthropic (recomendado)
Se recomienda usar el método setup-token, razones:
- No necesitas gestionar manualmente la API Key
- Genera un token de larga duración
- Ideal para usuarios con suscripción Pro/Max personal

Flujo:
1. Primero ejecuta en otra terminal: `claude setup-token`
2. Este comando abrirá el navegador para autorización OAuth
3. Copia el setup-token generado
4. En el asistente selecciona `Anthropic` → `token`
5. Pega el setup-token en el asistente
6. Las credenciales se guardan automáticamente en el directorio `~/.clawdbot/credentials/`
:::

::: info Método API Key
Si seleccionas API Key:
- El asistente pedirá que introduzcas la API Key
- Las credenciales se guardan en el directorio `~/.clawdbot/credentials/`
- Soporta múltiples proveedores, puedes cambiar en cualquier momento

Ejemplo:
```bash
? Enter API Key
sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
:::

### Paso 8: Seleccionar Modelo Predeterminado

Después de la autenticación exitosa, el asistente mostrará la lista de modelos disponibles:

```bash
? Select default model
  anthropic/claude-sonnet-4-5      Anthropic Sonnet 4.5 (200k ctx)
  anthropic/claude-opus-4-5          Anthropic Opus 4.5 (200k ctx)
  openai/gpt-4-turbo                OpenAI GPT-4 Turbo
  deepseek/DeepSeek-V3                DeepSeek V3
  (Keep current selection)
```

**Recomendaciones**:
- Se recomienda usar **Claude Sonnet 4.5** u **Opus 4.5** (200k contexto, mayor seguridad)
- Si el presupuesto es limitado, puedes seleccionar la versión Mini
- Haz clic en `Keep current selection` para conservar la configuración existente

### Paso 9: Configurar Canales de Comunicación

El asistente listará todos los plugins de canales de comunicación disponibles:

```bash
? Select channels to enable
  ✓ whatsapp       WhatsApp (Baileys Web Client)
  ✓ telegram       Telegram (Bot Token)
  ✓ slack          Slack (Bot Token + App Token)
  ✓ discord        Discord (Bot Token)
  ✓ googlechat     Google Chat (OAuth)
  (Press Space to select, Enter to confirm)
```

**Acción**:
- Usa las teclas de dirección para navegar
- Presiona **Barra espaciadora** para alternar la selección
- Presiona **Enter** para confirmar la selección

::: tip Optimización Modo QuickStart
En modo QuickStart, el asistente seleccionará automáticamente canales que soportan activación rápida (como WebChat), y omitirá la configuración de política DM, usando valores predeterminados seguros (modo pairing).
:::

Después de seleccionar los canales, el asistente preguntará sobre la configuración de cada canal individualmente:

#### Configuración de WhatsApp

```bash
? Configure WhatsApp
  Link new account     Open QR code in browser
  Skip
```

**Acción**:
- Selecciona `Link new account`
- El asistente mostrará un código QR
- Usa WhatsApp para escanear el código QR e iniciar sesión
- Después de iniciar sesión exitosamente, los datos de sesión se guardan en `~/.clawdbot/credentials/`

#### Configuración de Telegram

```bash
? Configure Telegram
  Bot Token
  Skip
```

**Acción**:
- Selecciona `Bot Token`
- Introduce el Bot Token obtenido de @BotFather
- El asistente probará si la conexión es exitosa

::: tip Obtención de Bot Token
1. Busca @BotFather en Telegram
2. Envía `/newbot` para crear un nuevo bot
3. Sigue las instrucciones para configurar el nombre y nombre de usuario del bot
4. Copia el Bot Token generado
:::

#### Configuración de Slack

```bash
? Configure Slack
  App Token         xapp-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  Bot Token         xoxb-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  Signing Secret   a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
  Skip
```

**Explicación**:
Slack requiere tres credenciales, obtenidas de la configuración de Slack App:
- **App Token**: Token a nivel de Workspace
- **Bot Token**: Bot user OAuth token
- **Signing Secret**: Usado para verificar la firma de las solicitudes

::: tip Creación de Slack App
1. Visita https://api.slack.com/apps
2. Crea una nueva App
3. En la página Basic Information obtén el Signing Secret
4. En la página OAuth & Permissions instala la App en el Workspace
5. Obtén el Bot Token y App Token
:::

### Paso 10: Configurar Habilidades (opcional)

El asistente preguntará si deseas instalar habilidades:

```bash
? Install skills? (Y/n)
```

**Recomendación**:
- Selecciona `Y` para instalar habilidades recomendadas (como el gestor de paquetes bird, TTS local sherpa-onnx-tts)
- Selecciona `n` para omitir, posteriormente puedes gestionar mediante el comando `clawdbot skills`

Si seleccionas instalar, el asistente listará las habilidades disponibles:

```bash
? Select skills to install
  ✓ bird           Instalación de paquetes macOS Homebrew
  ✓ sherpa-onnx-tts  Motor TTS local (privacidad primero)
  (Press Space to select, Enter to confirm)
```

### Paso 11: Completar Configuración

El asistente resumirá todas las configuraciones y escribirá el archivo de configuración:

```bash
✓ Writing config to ~/.clawdbot/clawdbot.json
✓ Workspace initialized at ~/clawd
✓ Channels configured: whatsapp, telegram, slack
✓ Skills installed: bird, sherpa-onnx-tts

────────────────────────────────────────────────────

Configuration complete!

Next steps:
  1. Start Gateway:
     clawdbot gateway --daemon

  2. Test connection:
     clawdbot message send --to +1234567890 --message "Hello!"

  3. Manage configuration:
     clawdbot configure

Docs: https://docs.clawd.bot/start/onboarding
────────────────────────────────────────────────────
```

## Punto de Control ✅

Después de completar el asistente, confirma lo siguiente:

- [ ] Archivo de configuración creado: `~/.clawdbot/clawdbot.json`
- [ ] Espacio de trabajo inicializado: existe el directorio `~/clawd/`
- [ ] Credenciales de modelo AI guardadas: verifica `~/.clawdbot/credentials/`
- [ ] Canales configurados: revisa el nodo `channels` en `clawdbot.json`
- [ ] Habilidades instaladas (si se seleccionaron): revisa el nodo `skills` en `clawdbot.json`

**Comandos de Verificación**:

```bash
## Ver resumen de configuración
clawdbot doctor

## Ver estado de Gateway
clawdbot gateway status

## Ver canales disponibles
clawdbot channels list
```

## Advertencias de Problemas Comunes

### Error Común 1: Puerto Ocupado

**Mensaje de Error**:
```
Error: Port 18789 is already in use
```

**Solución**:
1. Busca el proceso que ocupa el puerto: `lsof -i :18789` (macOS/Linux) o `netstat -ano | findstr 18789` (Windows)
2. Detén el proceso en conflicto o usa otro puerto

### Error Común 2: Fallo en Flujo OAuth

**Mensaje de Error**:
```
Error: OAuth exchange failed
```

**Posibles Causas**:
- Problemas de red que impiden acceder a los servidores de Anthropic
- Código OAuth expirado o con formato incorrecto
- Navegador bloqueado que impide abrir

**Solución**:
1. Verifica la conexión de red
2. Vuelve a ejecutar `clawdbot onboard` para reintentar OAuth
3. O cambia al método API Key

### Error Común 3: Fallo en Configuración de Canal

**Mensaje de Error**:
```
Error: WhatsApp authentication failed
```

**Posibles Causas**:
- Código QR expirado
- Cuenta restringida por WhatsApp
- Dependencias no instaladas (como signal-cli)

**Solución**:
1. WhatsApp: vuelve a escanear el código QR
2. Signal: asegúrate de que signal-cli esté instalado (consulta la documentación específica del canal)
3. Bot Token: confirma que el formato del token sea correcto y no haya expirado

### Error Común 4: Fallo en Configuración de Tailscale

**Mensaje de Error**:
```
Error: Tailscale binary not found in PATH or /Applications.
```

**Solución**:
1. Instala Tailscale: https://tailscale.com/download/mac
2. Asegúrate de agregarlo al PATH o instalarlo en `/Applications`
3. O omite la configuración de Tailscale, configúralo manualmente más tarde

### Error Común 5: Error de Formato en Archivo de Configuración

**Mensaje de Error**:
```
Error: Invalid config at ~/.clawdbot/clawdbot.json
```

**Solución**:
```bash
# Reparar configuración
clawdbot doctor

# O restablecer configuración
clawdbot onboard --mode reset
```

---

## Resumen de Esta Lección

La configuración guiada es la forma recomendada de configurar Clawdbot, guiándote a través de todas las configuraciones necesarias mediante preguntas interactivas:

**Puntos Clave**:
- ✅ Soporta dos modos: **QuickStart** y **Manual**
- ✅ Advertencia de seguridad para recordar riesgos potenciales
- ✅ Detecta automáticamente configuraciones existentes, puedes conservar/modificar/restablecer
- ✅ Soporta flujo **Anthropic setup-token** (recomendado) y método API Key
- ✅ Soporta entorno multi-perfil **CLAWDBOT_PROFILE**
- ✅ Configura automáticamente canales y habilidades
- ✅ Genera valores predeterminados seguros (vinculación loopback, autenticación token)

**Flujo de Trabajo Recomendado**:
1. Primer uso: `clawdbot onboard --install-daemon`
2. Modificar configuración: `clawdbot configure`
3. Solución de problemas: `clawdbot doctor`
4. Acceso remoto: configurar Tailscale Serve/Funnel

**Siguientes Pasos**:
- [Iniciar Gateway](../gateway-startup/): Hacer que Gateway se ejecute en segundo plano
- [Enviar Primer Mensaje](../first-message/): Comenzar conversación con el asistente de IA
- [Conocer Emparejamiento DM](../pairing-approval/): Control de seguridad para remitentes desconocidos

---

## Vista Previa de la Siguiente Lección

> En la siguiente lección aprenderemos **[Iniciar Gateway](../gateway-startup/)**.
>
> Aprenderás:
> - Cómo iniciar el proceso daemon de Gateway
> - La diferencia entre modo de desarrollo y modo de producción
> - Cómo monitorear el estado de Gateway
> - Uso de launchd/systemd para inicio automático

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-27

| Función           | Ruta del Archivo                                                                                                  | Número de Línea      |
|--- | --- | ---|
| Flujo principal del asistente     | [`src/wizard/onboarding.ts`](https://github.com/moltbot/moltbot/blob/main/src/wizard/onboarding.ts) | 87-452    |
| Confirmación de advertencia de seguridad   | [`src/wizard/onboarding.ts`](https://github.com/moltbot/moltbot/blob/main/src/wizard/onboarding.ts) | 46-85     |
| Configuración de Gateway   | [`src/wizard/onboarding.gateway-config.ts`](https://github.com/moltbot/moltbot/blob/main/src/wizard/onboarding.gateway-config.ts) | 28-249    |
| Definición de interfaz del asistente   | [`src/wizard/prompts.ts`](https://github.com/moltbot/moltbot/blob/main/src/wizard/prompts.ts) | 36-52     |
| Configuración de canales     | [`src/commands/onboard-channels.ts`](https://github.com/moltbot/moltbot/blob/main/src/commands/onboard-channels.ts) | -         |
| Configuración de habilidades     | [`src/commands/onboard-skills.ts`](https://github.com/moltbot/moltbot/blob/main/src/commands/onboard-skills.ts) | -         |
| Definición de tipos del asistente   | [`src/wizard/onboarding.types.ts`](https://github.com/moltbot/moltbot/blob/main/src/wizard/onboarding.types.ts) | 1-26      |
| Schema de configuración | [`src/config/zod-schema.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.ts) | -         |

**Tipos Clave**:
- `WizardFlow`: `"quickstart" | "advanced"` - Tipo de modo del asistente
- `QuickstartGatewayDefaults`: Configuración predeterminada de Gateway en modo QuickStart
- `GatewayWizardSettings`: Configuración de ajustes de Gateway
- `WizardPrompter`: Interfaz de interacción del asistente

**Funciones Clave**:
- `runOnboardingWizard()`: Flujo principal del asistente
- `configureGatewayForOnboarding()`: Configurar red y autenticación de Gateway
- `requireRiskAcknowledgement()`: Mostrar y confirmar advertencia de seguridad

**Valores de Configuración Predeterminados** (Modo QuickStart):
- Puerto de Gateway: 18789
- Dirección de vinculación: loopback (127.0.0.1)
- Método de autenticación: token (genera automáticamente token aleatorio)
- Tailscale: off
- Espacio de trabajo: `~/clawd`

**Ubicación de Archivos de Configuración**:
- Configuración principal: `~/.clawdbot/clawdbot.json`
- Credenciales OAuth: `~/.clawdbot/credentials/oauth.json`
- Credenciales API Key: `~/.clawdbot/credentials/`
- Datos de sesión: `~/clawd/sessions.json`

</details>
