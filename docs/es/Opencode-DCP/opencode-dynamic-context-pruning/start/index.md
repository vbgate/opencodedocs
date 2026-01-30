---
title: "Inicio Rápido: Instalación y Configuración | opencode-dynamic-context-pruning"
sidebarTitle: "Listo en 5 Minutos"
subtitle: "Inicio Rápido: Instalación y Configuración"
description: "Aprende a instalar y configurar el plugin OpenCode DCP. Completa la instalación en 5 minutos, experimenta el ahorro de tokens y domina el sistema de configuración de tres niveles."
order: 1
---

# Inicio Rápido

Esta sección te ayuda a comenzar desde cero con el plugin DCP. Aprenderás a instalar el plugin, verificar su funcionamiento y personalizar la configuración según tus necesidades.

## Contenido de Esta Sección

<div class="vp-card-container">

<a href="./getting-started/" class="vp-card">
  <h3>Instalación e Inicio Rápido</h3>
  <p>Completa la instalación del plugin DCP en 5 minutos y observa inmediatamente el ahorro de tokens. Aprende a usar el comando /dcp para monitorear las estadísticas de poda.</p>
</a>

<a href="./configuration/" class="vp-card">
  <h3>Guía Completa de Configuración</h3>
  <p>Domina el sistema de configuración de tres niveles (global, variables de entorno, nivel de proyecto), comprende la prioridad de configuración y ajusta las estrategias de poda y mecanismos de protección según tus necesidades.</p>
</a>

</div>

## Ruta de Aprendizaje

```
Instalación e Inicio Rápido → Guía de Configuración
           ↓                         ↓
    Plugin funcionando      Sabes cómo ajustarlo
```

**Orden Recomendado**:

1. **Primero completa [Instalación e Inicio Rápido](./getting-started/)**: Asegúrate de que el plugin funcione correctamente y experimenta el efecto de poda predeterminado
2. **Luego aprende [Guía Completa de Configuración](./configuration/)**: Personaliza las estrategias de poda según las necesidades de tu proyecto

::: tip Consejo para Principiantes
Si es tu primera vez usando DCP, te recomendamos usar la configuración predeterminada durante un tiempo, observar los efectos de poda y luego ajustar la configuración.
:::

## Requisitos Previos

Antes de comenzar esta sección, asegúrate de:

- [x] Tener instalado **OpenCode** (versión con soporte para plugins)
- [x] Conocer la sintaxis básica de **JSONC** (JSON con soporte para comentarios)
- [x] Saber cómo editar los **archivos de configuración de OpenCode**

## Próximos Pasos

Después de completar esta sección, puedes continuar aprendiendo:

- **[Estrategias de Poda Automática](../platforms/auto-pruning/)**: Comprende en profundidad cómo funcionan las tres estrategias: deduplicación, sobrescritura y limpieza de errores
- **[Herramientas de Poda Impulsadas por LLM](../platforms/llm-tools/)**: Descubre cómo la IA utiliza activamente las herramientas discard y extract para optimizar el contexto
- **[Uso de Comandos Slash](../platforms/commands/)**: Domina el uso de comandos como /dcp context, /dcp stats, /dcp sweep y más

<style>
.vp-card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 16px 0;
}

.vp-card {
  display: block;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.vp-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.vp-card h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.vp-card p {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
</style>
