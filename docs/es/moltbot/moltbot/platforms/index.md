---
title: "Múltiples Canales y Plataformas | Tutorial de Clawdbot"
sidebarTitle: "Integrar Herramientas de Chat Comunes"
subtitle: "Múltiples Canales y Plataformas"
description: "Aprende a configurar y usar el sistema multicanal de Clawdbot, incluyendo plataformas como WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, LINE, WebChat, macOS, iOS y Android."
tags:
  - "channels"
  - "platforms"
  - "integration"
order: 60
---

# Múltiples Canales y Plataformas

Clawdbot admite múltiples canales de comunicación y plataformas a través de un plano de control Gateway unificado, permitiéndote interactuar con el asistente de IA en interfaces que ya conoces.

## Visión General del Capítulo

Este capítulo presenta todos los canales de comunicación y plataformas compatibles con Clawdbot, incluyendo aplicaciones de mensajería instantánea (WhatsApp, Telegram, Slack, Discord, etc.), nodos móviles (iOS, Android) y aplicaciones de escritorio (macOS). Aprende a configurar estos canales para que el asistente de IA se integre perfectamente en tu flujo de trabajo diario.

## Navegación de Subpáginas

### Visión General de Canales

- **[Visión General del Sistema Multicanal](channels-overview/)** - Conoce todos los canales de comunicación compatibles con Clawdbot y sus características, domina los conceptos básicos de configuración de canales.

### Canales de Mensajería Instantánea

- **[WhatsApp](whatsapp/)** - Configurar y usar el canal de WhatsApp (basado en Baileys), soporta vinculación de dispositivos y gestión de grupos.
- **[Telegram](telegram/)** - Configurar y usar el canal de Telegram (basado en grammY Bot API), configurar Bot Token y Webhook.
- **[Slack](slack/)** - Configurar y usar el canal de Slack (basado en Bolt), integrar en tu espacio de trabajo.
- **[Discord](discord/)** - Configurar y usar el canal de Discord (basado en discord.js), soporta servidores y canales.
- **[Google Chat](googlechat/)** - Configurar y usar el canal de Google Chat, integrar con Google Workspace.
- **[Signal](signal/)** - Configurar y usar el canal de Signal (basado en signal-cli), comunicación con privacidad protegida.
- **[iMessage](imessage/)** - Configurar y usar el canal de iMessage (exclusivo de macOS), integrar con la aplicación Mensajes de macOS.
- **[LINE](line/)** - Configurar y usar el canal de LINE (Messaging API), interactuar con usuarios de LINE.

### Web y Aplicaciones Nativas

- **[Interfaz WebChat](webchat/)** - Usar la interfaz WebChat incorporada para interactuar con el asistente de IA, sin necesidad de configurar canales externos.
- **[Aplicación macOS](macos-app/)** - Conocer las funciones de la aplicación de barra de menús de macOS, incluyendo Voice Wake, Talk Mode y control remoto.
- **[Nodo iOS](ios-node/)** - Configurar el nodo iOS para ejecutar operaciones locales en el dispositivo (Camera, Canvas, Voice Wake).
- **[Nodo Android](android-node/)** - Configurar el nodo Android para ejecutar operaciones locales en el dispositivo (Camera, Canvas).

## Ruta de Aprendizaje Recomendada

Según tu escenario de uso, se recomienda el siguiente orden de aprendizaje:

### Inicio Rápido para Principiantes

Si es la primera vez que usas Clawdbot, se recomienda seguir este orden:

1. **[Visión General del Sistema Multicanal](channels-overview/)** - Primero entiende la arquitectura general y los conceptos de canales
2. **[Interfaz WebChat](webchat/)** - La forma más simple, sin necesidad de configuración para comenzar a usar
3. **[Elige un canal común](whatsapp/)** - Según tus hábitos diarios elige:
    - Chat diario → [WhatsApp](whatsapp/) o [Telegram](telegram/)
    - Colaboración en equipo → [Slack](slack/) o [Discord](discord/)
    - Usuario de macOS → [iMessage](imessage/)

### Integración Móvil

Si quieres usar Clawdbot en tu teléfono:

1. **[Nodo iOS](ios-node/)** - Configurar funciones locales en iPhone/iPad
2. **[Nodo Android](android-node/)** - Configurar funciones locales en dispositivos Android
3. **[Aplicación macOS](macos-app/)** - Usar la aplicación macOS como centro de control

### Despliegue Empresarial

Si necesitas desplegar en un entorno de equipo:

1. **[Slack](slack/)** - Integrar con el espacio de trabajo del equipo
2. **[Discord](discord/)** - Establecer un servidor comunitario
3. **[Google Chat](googlechat/)** - Integrar con Google Workspace

## Requisitos Previos

Antes de comenzar este capítulo, se recomienda completar primero:

- **[Inicio Rápido](../start/getting-started/)** - Completar la instalación y configuración básica de Clawdbot
- **[Configuración Asistida](../start/onboarding-wizard/)** - Completar la configuración básica de Gateway y canales a través del asistente

::: tip Sugerencia
Si ya has completado la configuración asistida, algunos canales pueden estar ya configurados automáticamente. Puedes omitir los pasos de configuración repetidos y consultar directamente las funciones avanzadas de canales específicos.
:::

## Siguientes Pasos

Después de completar este capítulo, puedes continuar explorando:

- **[Configuración de Modelos de IA y Autenticación](../advanced/models-auth/)** - Configurar diferentes proveedores de modelos de IA
- **[Gestión de Sesiones y Multi-Agent](../advanced/session-management/)** - Aprender sobre aislamiento de sesiones y colaboración de sub-agentes
- **[Sistema de Herramientas](../advanced/tools-browser/)** - Usar herramientas como automatización de navegador, ejecución de comandos, etc.

## Preguntas Frecuentes

::: details ¿Puedo usar múltiples canales simultáneamente?
¡Sí! Clawdbot admite habilitar múltiples canales simultáneamente. Puedes recibir y enviar mensajes en diferentes canales, todos los mensajes se procesan a través del Gateway unificado.
:::

::: details ¿Qué canal se recomienda más?
Depende de tu escenario de uso:
- **WebChat** - Lo más simple, sin necesidad de configuración
- **WhatsApp** - Adecuado para chatear con amigos y familiares
- **Telegram** - Bot API estable, adecuado para respuestas automáticas
- **Slack/Discord** - Adecuado para colaboración en equipo
:::

::: details ¿Configurar canales requiere pago?
La mayoría de los canales son gratuitos, pero algunos pueden tener costos:
- WhatsApp Business API - Puede generar costos
- Google Chat - Requiere cuenta de Google Workspace
- Otros canales - Generalmente gratuitos, solo necesitan solicitar Bot Token
:::
