---
title: "Plataformas: Funciones | opencode-mystatus"
sidebarTitle: "Plataformas"
subtitle: "Plataformas: Funciones de consulta de cuota"
order: 2
description: "Aprende las funciones de consulta de cuota de 4 plataformas de IA soportadas por opencode-mystatus. Domina OpenAI, Zhipu AI, GitHub Copilot y Google Cloud."
---

# Funciones de plataforma

Este capítulo presenta en detalle las funciones de consulta de cuota de cada plataforma de IA soportada por opencode-mystatus.

## Plataformas soportadas

opencode-mystatus soporta las siguientes 4 plataformas de IA principales:

| Plataforma | Tipo de límite | Características |
|--- | --- | ---|
| OpenAI | Ventana deslizante de 3 horas / 24 horas | Soporta suscripciones Plus, Team, Pro |
| Zhipu AI | Token de 5 horas / cuota mensual de MCP | Soporta Coding Plan |
| GitHub Copilot | Cuota mensual | Muestra uso de Premium Requests |
| Google Cloud | Cálculo independiente por modelo | Soporta múltiples cuentas, 4 modelos |

## Detalles de plataformas

### [Cuota de OpenAI](./openai-usage/)

Comprende en profundidad el mecanismo de consulta de cuota de OpenAI:

- Diferencias entre ventanas deslizantes de 3 horas y 24 horas
- Mecanismo de compartir cuota en cuentas de equipo
- Análisis de token JWT para obtener información de cuenta

### [Cuota de Zhipu AI](./zhipu-usage/)

Conoce la consulta de cuota de Zhipu AI y Z.ai:

- Método de cálculo del límite de token de 5 horas
- Uso de cuota mensual de MCP
- Visualización enmascarada de API Key

### [Cuota de GitHub Copilot](./copilot-usage/)

Domina la gestión de cuota de GitHub Copilot:

- Significado de Premium Requests
- Diferencias de cuota por diferentes tipos de suscripción
- Cálculo de tiempo de restablecimiento mensual

### [Cuota de Google Cloud](./google-usage/)

Aprende la consulta de cuota de múltiples cuentas de Google Cloud:

- Diferencias entre los 4 modelos (G3 Pro, G3 Image, G3 Flash, Claude)
- Gestión y cambio de múltiples cuentas
- Mecanismo de lectura de archivos de autenticación

## Guía de selección

Según las plataformas que uses, selecciona el tutorial correspondiente:

- **Solo usas OpenAI**: Mira directamente [Cuota de OpenAI](./openai-usage/)
- **Solo usas Zhipu AI**: Mira directamente [Cuota de Zhipu AI](./zhipu-usage/)
- **Usuario de múltiples plataformas**: Se recomienda leer todos los tutoriales de plataformas en orden
- **Usuario de Google Cloud**: Necesitas instalar primero el plugin [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth)

## Siguientes pasos

Después de completar este capítulo, puedes continuar con [Funciones avanzadas](../advanced/) para conocer más opciones de configuración.
