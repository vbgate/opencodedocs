---
title: "Funciones avanzadas"
sidebarTitle: "Desbloquea los superpoderes de la IA"
subtitle: "Funciones avanzadas"
description: "Aprende la configuración avanzada de Clawdbot, incluyendo configuración de modelos de IA, colaboración de múltiples agentes, automatización del navegador, herramientas de ejecución de comandos, herramientas de búsqueda web, interfaz visual Canvas, activación por voz y TTS, sistema de memoria, tareas programadas Cron, plataforma de habilidades, sandbox de seguridad y Gateway remoto."
prerequisite:
  - "start/getting-started"
  - "start/gateway-startup"
order: 185
---

# Funciones avanzadas

## Resumen del capítulo

Este capítulo presenta en profundidad las funciones avanzadas de Clawdbot, ayudándote a aprovechar al máximo las potentes capacidades del asistente de IA. Desde la configuración de modelos de IA y la colaboración de múltiples agentes, hasta la automatización del navegador, el sistema de memoria y las funciones de voz, puedes elegir aprender según tus necesidades.

::: info Prerrequisitos
Antes de estudiar este capítulo, completa lo siguiente:
- [Inicio rápido](../../start/getting-started/)
- [Iniciar Gateway](../../start/gateway-startup/)
:::

## Rutas de aprendizaje

Según tus necesidades, puedes elegir diferentes rutas de aprendizaje:

### 🚀 Ruta rápida (recomendada para principiantes)
1. [Configuración de modelos de IA y autenticación](./models-auth/) - Configura tus modelos de IA favoritos
2. [Herramientas de ejecución de comandos y aprobación](./tools-exec/) - Permite que la IA ejecute comandos de forma segura
3. [Herramientas de búsqueda y scraping web](./tools-web/) - Expande la capacidad de adquisición de conocimientos de la IA

### 🤖 Ruta de expansión de capacidades de IA
1. [Gestión de sesiones y múltiples agentes](./session-management/) - Comprende el mecanismo de colaboración de IA
2. [Sistema de memoria y búsqueda vectorial](./memory-system/) - Permite que la IA recuerde información importante
3. [Plataforma de habilidades y ClawdHub](./skills-platform/) - Usa y comparte paquetes de habilidades

### 🔧 Ruta de herramientas de automatización
1. [Herramientas de automatización del navegador](./tools-browser/) - Automatización de operaciones web
2. [Tareas programadas Cron y Webhook](./cron-automation/) - Tareas programadas y activación de eventos
3. [Gateway remoto y Tailscale](./remote-gateway/) - Acceso remoto a tu asistente de IA

### 🎨 Ruta de experiencia interactiva
1. [Interfaz visual Canvas y A2UI](./canvas/) - Interfaz interactiva visual
2. [Activación por voz y texto a voz](./voice-tts/) - Funciones de interacción por voz

### 🔒 Ruta de seguridad y despliegue
1. [Seguridad y aislamiento en sandbox](./security-sandbox/) - Comprende en profundidad los mecanismos de seguridad
2. [Gateway remoto y Tailscale](./remote-gateway/) - Acceso remoto seguro

## Navegación de subpáginas

### Configuración central

| Tema | Descripción | Tiempo estimado |
|------|------|----------|
| [Configuración de modelos de IA y autenticación](./models-auth/) | Configura múltiples proveedores de modelos de IA como Anthropic, OpenAI, OpenRouter, Ollama y métodos de autenticación | 15 minutos |
| [Gestión de sesiones y múltiples agentes](./session-management/) | Aprende el modelo de sesión, aislamiento de sesión, colaboración de sub-agentes, compresión de contexto y otros conceptos centrales | 20 minutos |

### Sistema de herramientas

| Tema | Descripción | Tiempo estimado |
|------|------|----------|
| [Herramientas de automatización del navegador](./tools-browser/) | Usa herramientas de navegador para automatización web, capturas de pantalla, operaciones de formularios, etc. | 25 minutos |
| [Herramientas de ejecución de comandos y aprobación](./tools-exec/) | Configura y usa la herramienta exec, comprende el mecanismo de aprobación de seguridad y control de permisos | 15 minutos |
| [Herramientas de búsqueda y scraping web](./tools-web/) | Usa las herramientas web_search y web_fetch para búsqueda web y scraping de contenido | 20 minutos |

### Experiencia interactiva

| Tema | Descripción | Tiempo estimado |
|------|------|----------|
| [Interfaz visual Canvas y A2UI](./canvas/) | Comprende el mecanismo de empuje Canvas A2UI, operaciones de interfaz visual e interfaz personalizada | 20 minutos |
| [Activación por voz y texto a voz](./voice-tts/) | Configura Voice Wake, Talk Mode y proveedores TTS, implementa interacción por voz | 15 minutos |

### Extensiones inteligentes

| Tema | Descripción | Tiempo estimado |
|------|------|----------|
| [Sistema de memoria y búsqueda vectorial](./memory-system/) | Configura y usa el sistema de memoria (SQLite-vec, FTS5, búsqueda híbrida) | 25 minutos |
| [Plataforma de habilidades y ClawdHub](./skills-platform/) | Comprende el sistema de habilidades, habilidades Bundled/Managed/Workspace, integración ClawdHub | 20 minutos |

### Automatización y despliegue

| Tema | Descripción | Tiempo estimado |
|------|------|----------|
| [Tareas programadas Cron y Webhook](./cron-automation/) | Configura tareas programadas, activación Webhook, Gmail Pub/Sub y otras funciones de automatización | 20 minutos |
| [Gateway remoto y Tailscale](./remote-gateway/) | Acceso remoto a Gateway a través de Tailscale Serve/Funnel o túnel SSH | 15 minutos |

### Mecanismos de seguridad

| Tema | Descripción | Tiempo estimado |
|------|------|----------|
| [Seguridad y aislamiento en sandbox](./security-sandbox/) | Comprende el modelo de seguridad, control de permisos de herramientas, aislamiento Sandbox, despliegue con Docker | 20 minutos |

## Siguientes pasos

Después de completar el estudio de este capítulo, puedes:

1. **Estudio en profundidad** - Consulta [Solución de problemas](../../faq/troubleshooting/) para resolver los problemas que encuentres
2. **Entender el despliegue** - Consulta [Opciones de despliegue](../../appendix/deployment/) para desplegar Clawdbot en entornos de producción
3. **Desarrollar extensiones** - Consulta [Guía de desarrollo](../../appendix/development/) para aprender a desarrollar complementos y contribuir código
4. **Ver configuración** - Consulta [Referencia completa de configuración](../../appendix/config-reference/) para conocer todas las opciones de configuración

::: tip Sugerencia de aprendizaje
Se recomienda que elijas una ruta de aprendizaje según tus necesidades reales. Si no estás seguro por dónde comenzar, puedes seguir gradualmente la "ruta rápida" y explorar en profundidad otros temas cuando sea necesario.
:::
