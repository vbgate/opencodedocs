---
title: "Introducción al Plugin: Funciones y Riesgos | Antigravity Auth"
sidebarTitle: "¿Es Este Plugin Para Ti?"
subtitle: "Conoce el Valor Central del Plugin Antigravity Auth"
description: "Aprende el valor central y las advertencias de riesgo del plugin Antigravity Auth. Accede a modelos Claude y Gemini 3 mediante Google OAuth, con soporte para balanceo de carga multi-cuenta."
tags:
  - "Inicio"
  - "Introducción al Plugin"
  - "OpenCode"
  - "Antigravity"
order: 1
---

# Conoce el Valor Central del Plugin Antigravity Auth

**Antigravity Auth** es un plugin de OpenCode que accede a la API de Antigravity mediante autenticación Google OAuth. Te permite usar tu cuenta de Google familiar para llamar a modelos avanzados como Claude Opus 4.5, Sonnet 4.5 y Gemini 3 Pro/Flash, sin necesidad de gestionar claves API. El plugin también ofrece balanceo de carga multi-cuenta, sistema de doble cuota y recuperación automática de sesiones, ideal para usuarios que necesitan modelos avanzados y gestión automatizada.

## Qué Aprenderás

- Determinar si este plugin es adecuado para tu caso de uso
- Conocer qué modelos de IA y funciones principales soporta el plugin
- Entender los riesgos y precauciones al usar este plugin
- Decidir si continuar con la instalación y configuración

## Tu Situación Actual

Quieres usar los modelos de IA más avanzados (como Claude Opus 4.5, Gemini 3 Pro), pero el acceso oficial está restringido. Buscas una forma confiable de acceder a estos modelos, y además deseas:

- No tener que gestionar manualmente múltiples claves API
- Cambio automático de cuenta cuando encuentres límites de velocidad
- Recuperación automática de conversaciones interrumpidas sin perder el contexto

## Idea Principal

**Antigravity Auth** es un plugin de OpenCode que accede a la API de Google Antigravity mediante **autenticación Google OAuth**, permitiéndote llamar a modelos de IA avanzados usando tu cuenta de Google familiar.

No actúa como proxy de todas las solicitudes, sino que **intercepta y transforma** tus solicitudes de llamada a modelos, las reenvía a la API de Antigravity, y luego convierte las respuestas de vuelta a un formato que OpenCode puede reconocer.

## Funciones Principales

### Modelos Soportados

| Serie de Modelos | Modelos Disponibles | Características |
| --- | --- | --- |
| **Claude** | Opus 4.5, Sonnet 4.5 | Soporta modo de pensamiento extendido |
| **Gemini 3** | Pro, Flash | Integración con Google Search, pensamiento extendido |

::: info Modo de Pensamiento (Thinking)
Los modelos Thinking realizan un "pensamiento profundo" antes de generar respuestas, mostrando el proceso de razonamiento. Puedes configurar el presupuesto de pensamiento para equilibrar calidad y velocidad de respuesta.
:::

### Balanceo de Carga Multi-Cuenta

- **Soporta hasta 10 cuentas de Google**
- Cambio automático a la siguiente cuenta cuando encuentres límites de velocidad (error 429)
- Tres estrategias de selección de cuenta: sticky (fija), round-robin (rotación), hybrid (híbrida inteligente)

### Sistema de Doble Cuota

El plugin accede simultáneamente a **dos pools de cuota independientes**:

1. **Cuota Antigravity**: De la API de Google Antigravity
2. **Cuota Gemini CLI**: De Google Gemini CLI

Cuando un pool está limitado, el plugin intenta automáticamente el otro pool, maximizando la utilización de cuota.

### Recuperación Automática de Sesiones

- Detecta fallos en llamadas de herramientas (como interrupciones con ESC)
- Inyecta automáticamente tool_result sintético para evitar que la conversación se rompa
- Soporta envío automático de "continue" para continuar la conversación

### Integración con Google Search

Habilita búsqueda web para modelos Gemini, mejorando la precisión factual:

- **Modo Auto**: El modelo decide si buscar según sea necesario
- **Modo Always-on**: Busca en cada solicitud

## Cuándo Usar Este Plugin

::: tip Adecuado para estos escenarios
- Tienes múltiples cuentas de Google y quieres aumentar la cuota total
- Necesitas usar modelos Thinking de Claude o Gemini 3
- Quieres habilitar Google Search para modelos Gemini
- No quieres gestionar claves API manualmente, prefieres autenticación OAuth
- Encuentras límites de velocidad frecuentemente y quieres cambio automático de cuenta
:::

::: warning No adecuado para estos escenarios
- Necesitas usar modelos no públicos de Google
- Eres muy sensible a los riesgos de ToS de Google (ver advertencia de riesgos abajo)
- Solo necesitas modelos básicos Gemini 1.5 o Claude 3 (las interfaces oficiales son más estables)
- Tienes dificultades para abrir navegadores en entornos WSL, Docker, etc.
:::

## ⚠️ Advertencia de Riesgos Importante

Usar este plugin **puede violar los Términos de Servicio de Google**. Un pequeño número de usuarios ha reportado que sus cuentas de Google fueron **suspendidas** o **shadow banned** (acceso restringido sin notificación explícita).

### Escenarios de Alto Riesgo

- 🚨 **Cuentas de Google nuevas**: Probabilidad extremadamente alta de suspensión
- 🚨 **Cuentas con suscripción Pro/Ultra recién activada**: Fácilmente marcadas y suspendidas

### Confirma Antes de Usar

- Esta es una **herramienta no oficial**, no respaldada por Google
- Tu cuenta puede ser suspendida temporal o permanentemente
- Asumes todos los riesgos de usar este plugin

### Recomendaciones

- Usa **cuentas de Google maduras**, no crees cuentas nuevas para este plugin
- Evita usar cuentas importantes vinculadas a servicios críticos
- Si tu cuenta es suspendida, no puedes apelar a través de este plugin

::: danger Seguridad de la Cuenta
Todos los tokens OAuth se almacenan localmente en `~/.config/opencode/antigravity-accounts.json`, no se suben a ningún servidor. Pero asegúrate de que tu computadora esté segura para prevenir fugas de tokens.
:::

## Resumen de Esta Lección

Antigravity Auth es un potente plugin de OpenCode que te permite acceder a modelos avanzados Claude y Gemini 3 mediante Google OAuth. Ofrece balanceo de carga multi-cuenta, sistema de doble cuota, recuperación automática de sesiones y más, ideal para usuarios que necesitan modelos avanzados y gestión automatizada.

Pero ten en cuenta: **usar este plugin conlleva riesgo de suspensión de cuenta**. Por favor usa cuentas de Google no críticas y comprende los riesgos relacionados antes de continuar con la instalación.

## Avance de la Siguiente Lección

> En la siguiente lección aprenderemos **[Instalación Rápida](/es/NoeFabris/opencode-antigravity-auth/start/quick-install/)**.
>
> Aprenderás:
> - Completar la instalación del plugin en 5 minutos
> - Añadir tu primera cuenta de Google
> - Verificar la instalación exitosa
