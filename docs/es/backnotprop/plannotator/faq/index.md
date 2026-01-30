---
title: "Preguntas Frecuentes: Resolución de Problemas de Uso | opencode-plannotator"
sidebarTitle: "Qué hacer si tienes problemas"
subtitle: "Preguntas Frecuentes: Resolución de Problemas de Uso"
description: "Aprende a resolver problemas comunes de Plannotator. Domina técnicas de diagnóstico rápido para problemas de puerto ocupado, navegador no abierto, fallos de integración y más."
order: 4
---

# Preguntas Frecuentes

Este capítulo te ayuda a resolver diversos problemas que puedas encontrar al usar Plannotator. Ya sea puerto ocupado, navegador no abierto o fallos de integración, aquí encontrarás las soluciones correspondientes y técnicas de depuración.

## Contenido de este capítulo

<div class="grid-cards">

<a href="./common-problems/" class="card">
  <h3>🔧 Problemas comunes</h3>
  <p>Resuelve problemas comunes durante el uso, incluyendo puerto ocupado, navegador no abierto, planes no mostrados, errores de Git, fallos al subir imágenes, problemas de integración con Obsidian/Bear, etc.</p>
</a>

<a href="./troubleshooting/" class="card">
  <h3>🔍 Solución de problemas</h3>
  <p>Domina los métodos básicos de solución de problemas, incluyendo visualización de registros, manejo de errores y técnicas de depuración. Aprende a localizar rápidamente la fuente del problema a través de la salida de registros.</p>
</a>

</div>

## Ruta de aprendizaje

```
Problemas comunes → Solución de problemas
      ↓                   ↓
   Solución rápida    Depuración profunda
```

**Orden recomendado**:

1. **Primero revisa problemas comunes**: La mayoría de los problemas se pueden encontrar aquí con soluciones listas
2. **Luego aprende solución de problemas**: Si los problemas comunes no cubren tu caso, aprende cómo diagnosticar por tu cuenta a través de registros y técnicas de depuración

::: tip Recomendación al encontrar problemas
Primero busca palabras clave en "Problemas comunes" (como "puerto", "navegador", "Obsidian") para encontrar la solución correspondiente. Si el problema es complejo o no está en la lista, consulta "Solución de problemas" para aprender métodos de depuración.
:::

## Requisitos previos

Antes de estudiar este capítulo, se recomienda que hayas completado:

- ✅ [Inicio rápido](../start/getting-started/) - Entiende los conceptos básicos de Plannotator
- ✅ Instalado el complemento Claude Code u OpenCode (elige uno):
  - [Instalar complemento Claude Code](../start/installation-claude-code/)
  - [Instalar complemento OpenCode](../start/installation-opencode/)

## Siguientes pasos

Después de completar este capítulo, puedes continuar aprendiendo:

- [Referencia de API](../appendix/api-reference/) - Conoce todos los endpoints de API y formatos de solicitud/respuesta
- [Modelos de datos](../appendix/data-models/) - Conoce las estructuras de datos que utiliza Plannotator
- [Configuración de variables de entorno](../advanced/environment-variables/) - Profundiza en todas las variables de entorno disponibles

<style>
.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.grid-cards .card {
  display: block;
  padding: 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.25s;
}

.grid-cards .card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.grid-cards .card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.grid-cards .card p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.dark .grid-cards .card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}
</style>
