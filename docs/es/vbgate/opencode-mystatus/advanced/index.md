---
title: "Avanzado: Configuración | opencode-mystatus"
sidebarTitle: "Avanzado"
subtitle: "Avanzado: Configuración"
description: "Aprende opciones de configuración avanzada y personalización para opencode-mystatus."
order: 3
---

# Funciones avanzadas

Este capítulo presenta las opciones de configuración avanzada de opencode-mystatus, adecuado para usuarios que necesitan más personalización.

## Lista de funciones

### [Configuración de Google Cloud](./google-setup/)

Configura y gestiona múltiples cuentas de Google Cloud Antigravity:

- Agrega múltiples cuentas de Google Cloud
- Relación de mapeo de los 4 modelos (G3 Pro、G3 Image、G3 Flash、Claude)
- Diferencias entre projectId y managedProjectId
- Resuelve el problema de cuota insuficiente de modelo en una sola cuenta

### [Configuración de autenticación de Copilot](./copilot-auth/)

Resuelve los problemas de autenticación de GitHub Copilot:

- Diferencias entre OAuth Token y Fine-grained PAT
- Resuelve el problema de permisos insuficientes de OAuth Token
- Crea Fine-grained PAT y configura el tipo de suscripción
- Configura el archivo `copilot-quota-token.json`

### [Soporte multilingüe](./i18n-setup/)

Comprende el mecanismo automático de detección de idioma:

- Principio de detección automática de idioma del sistema
- Mecanismo de respaldo de la API Intl y variables de entorno
- Cómo cambiar el idioma de salida (chino/inglés)

## Escenarios de uso

| Escenario | Tutorial recomendado |
|--- | ---|
| Usar múltiples cuentas de Google | [Configuración de Google Cloud](./google-setup/) |
| Fallo en la consulta de cuota de Copilot | [Configuración de autenticación de Copilot](./copilot-auth/) |
| Quieres cambiar el idioma de salida | [Soporte multilingüe](./i18n-setup/) |

## Prerrequisitos

Antes de estudiar este capítulo, se recomienda completar:

- [Inicio rápido](../start/) - Completa la instalación del plugin
- [Funciones de plataforma](../platforms/) - Conoce el uso básico de cada plataforma

## Siguientes pasos

¿Tienes problemas? Consulta [Preguntas frecuentes](../faq/) para obtener ayuda.
