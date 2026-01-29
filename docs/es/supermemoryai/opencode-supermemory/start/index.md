---
title: "Inicio Rápido: Configuración | opencode-supermemory"
sidebarTitle: "Inicio Rápido"
subtitle: "Inicio Rápido: Configuración del Plugin"
description: "Instala el plugin opencode-supermemory y configura tu API Key. Configura la memoria persistente en la nube para que el Agent recuerde tu proyecto."
order: 1
---

# Inicio Rápido

Este capítulo te ayuda a instalar y configurar el plugin opencode-supermemory desde cero, dando a tu OpenCode Agent capacidades de memoria persistente. Al completar este capítulo, el Agent podrá recordar la arquitectura del proyecto y tus configuraciones de preferencia.

## Contenido del Capítulo

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

<a href="./getting-started/" class="block p-4 border rounded-lg hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Inicio Rápido: Instalación y Configuración</h3>
  <p class="text-sm text-neutral-600 dark:text-neutral-400">Instala el plugin, configura la API Key, resuelve conflictos de plugins, permite que el Agent se conecte a la base de datos de memoria en la nube.</p>
</a>

<a href="./initialization/" class="block p-4 border rounded-lg hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Inicialización del Proyecto: Creando la Primera Impresión</h3>
  <p class="text-sm text-neutral-600 dark:text-neutral-400">Usa el comando /supermemory-init para que el Agent explore profundamente el repositorio de código, recordando automáticamente la arquitectura y normas del proyecto.</p>
</a>

</div>

## Ruta de Aprendizaje

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   1. Inicio Rápido          2. Inicialización del Proyecto        │
│   ─────────────   →   ─────────────                             │
│   Instalar plugin           Dejar que el Agent recuerde          │
│   Configurar API Key        arquitectura del proyecto            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Se recomienda estudiar en orden**:

1. **[Inicio Rápido](./getting-started/)**: Primero completa la instalación del plugin y configuración de API Key, esto es un prerequisito para usar todas las funciones.
2. **[Inicialización del Proyecto](./initialization/)**: Después de completar la instalación, ejecuta el comando de inicialización para que el Agent se familiarice con tu proyecto.

## Prerrequisitos

Antes de comenzar este capítulo, asegúrate de:

- ✅ Haber instalado [OpenCode](https://opencode.ai) y que el comando `opencode` esté disponible en la terminal
- ✅ Haber registrado una cuenta en [Supermemory](https://console.supermemory.ai) y obtenido una API Key

## Siguientes Pasos

Después de completar este capítulo, puedes continuar aprendiendo:

- **[Funciones Principales](../core/)**: Profundiza en el mecanismo de inyección de contexto, uso del conjunto de herramientas y gestión de memoria
- **[Configuración Avanzada](../advanced/)**: Personaliza umbrales de compresión, reglas de activación por palabras clave y otras configuraciones avanzadas
