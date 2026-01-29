---
title: "Integración de plataformas: acceso a múltiples protocolos | Antigravity-Manager"
sidebarTitle: "Conecta tus plataformas de IA"
subtitle: "Integración de plataformas: acceso a múltiples protocolos"
description: "Aprende a integrar protocolos de plataformas en Antigravity Tools. Compatible con OpenAI, Anthropic, Gemini y otros 7 protocolos mediante API Gateway unificada."
order: 200
---

# Plataformas e integraciones

La capacidad principal de Antigravity Tools es convertir los protocolos de múltiples plataformas de IA en una API Gateway local unificada. Este capítulo detalla los métodos de integración para cada protocolo, sus límites de compatibilidad y las mejores prácticas.

## Contenido de este capítulo

| Tutorial | Descripción |
|---------|-------------|
| [API compatible con OpenAI](./openai/) | Estrategias de implementación para `/v1/chat/completions` y `/v1/responses`, permitiendo integración transparente con OpenAI SDK |
| [API compatible con Anthropic](./anthropic/) | Contratos clave de `/v1/messages` y Claude Code, soportando capacidades como chain-of-thought y system prompts |
| [API nativa de Gemini](./gemini/) | Puntos de conexión `/v1beta/models` y Google SDK, con compatibilidad `x-goog-api-key` |
| [Generación de imágenes Imagen 3](./imagen/) | Mapeo automático de parámetros `size`/`quality` de OpenAI Images, soportando cualquier relación de aspecto |
| [Transcripción de audio](./audio/) | Limitaciones de `/v1/audio/transcriptions` y manejo de payloads grandes |
| [Endpoints MCP](./mcp/) | Exponer Web Search/Reader/Vision como herramientas invocables |
| [Túnel Cloudflared](./cloudflared/) | Exponer de forma segura la API local a internet con un solo clic (no es seguro por defecto) |

## Ruta de aprendizaje recomendada

::: tip Orden recomendado
1. **Primero aprende el protocolo que uses**: Si usas Claude Code, revisa primero [API compatible con Anthropic](./anthropic/); si usas OpenAI SDK, revisa primero [API compatible con OpenAI](./openai/)
2. **Luego aprende Gemini nativo**: Conoce el método de integración directa con Google SDK
3. **Aprende funciones extendidas según necesidad**: Generación de imágenes, transcripción de audio, herramientas MCP
4. **Finalmente aprende túneles**: Consulta [Túnel Cloudflared](./cloudflared/) solo cuando necesites exposición pública
:::

**Selección rápida**:

| Tu escenario | Empieza con |
|-------------|-------------|
| Usas Claude Code CLI | [API compatible con Anthropic](./anthropic/) |
| Usas OpenAI Python SDK | [API compatible con OpenAI](./openai/) |
| Usas Google SDK oficial | [API nativa de Gemini](./gemini/) |
| Necesitas generar imágenes con IA | [Generación de imágenes Imagen 3](./imagen/) |
| Necesitas transcripción de voz a texto | [Transcripción de audio](./audio/) |
| Necesitas búsqueda en web/lectura de páginas | [Endpoints MCP](./mcp/) |
| Necesitas acceso remoto | [Túnel Cloudflared](./cloudflared/) |

## Requisitos previos

::: warning Antes de comenzar, confirma que
- Has completado [Instalación y actualización](../start/installation/)
- Has completado [Agregar cuenta](../start/add-account/)
- Has completado [Iniciar proxy inverso local](../start/proxy-and-first-client/) (puedes acceder al menos a `/healthz`)
:::

## Siguientes pasos

Después de completar este capítulo, puedes continuar con:

- [Configuración avanzada](../advanced/): funciones avanzadas como enrutamiento de modelos, gestión de cuotas y programación de alta disponibilidad
- [Preguntas frecuentes](../faq/): guía de solución de problemas para errores como 401/404/429
