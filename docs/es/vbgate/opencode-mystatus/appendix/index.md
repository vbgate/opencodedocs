---
title: "Referencia técnica: modelos y API | opencode-mystatus"
sidebarTitle: "Apéndice"
subtitle: "Referencia técnica: modelos y API"
description: "Consulta los detalles técnicos de opencode-mystatus. Incluye modelos de datos y endpoints de API para desarrolladores y usuarios avanzados."
order: 5
---

# Apéndice

Este capítulo proporciona referencias técnicas de opencode-mystatus, adecuado para desarrolladores y usuarios avanzados.

## Documentos de referencia

### [Modelos de datos](./data-models/)

Conoce la estructura de datos del plugin:

- Estructura de archivos de autenticación (`auth.json`、`antigravity-accounts.json`、`copilot-quota-token.json`）
- Formatos de respuesta de API de cada plataforma
- Definiciones de tipos de datos internos
- Cómo extender el soporte para nuevas plataformas

### [Resumen de endpoints de API](./api-endpoints/)

Ver todos los endpoints oficiales de API llamados por el plugin:

- Endpoint de consulta de cuota de OpenAI
- Endpoint de consulta de cuota de Zhipu AI / Z.ai
- Endpoint de consulta de cuota de GitHub Copilot
- Endpoint de consulta de cuota de Google Cloud Antigravity
- Métodos de autenticación y formatos de solicitud

## Escenarios de uso

| Escenario | Documento recomendado |
|--- | ---|
| Quieres comprender cómo funciona el plugin | [Modelos de datos](./data-models/) |
| Quieres llamar a la API manualmente | [Resumen de endpoints de API](./api-endpoints/) |
| Quieres extender soporte para nuevas plataformas | Necesitas ambos documentos |
| Resolver problemas de formato de datos | [Modelos de datos](./data-models/) |

## Enlaces relacionados

- [Repositorio de GitHub](https://github.com/vbgate/opencode-mystatus) - Código fuente completo
- [Paquete NPM](https://www.npmjs.com/package/opencode-mystatus) - Versión y dependencias
- [Registro de cambios](../changelog/) - Historial de versiones
