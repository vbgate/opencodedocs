---
title: "Historial de Versiones: Evolución de DCP | opencode-dynamic-context-pruning"
sidebarTitle: "Ver novedades"
subtitle: "Historial de Versiones: Evolución de DCP"
description: "Conoce todas las actualizaciones del plugin OpenCode DCP desde v1.0.1 hasta v1.2.7. Descubre nuevas funciones, correcciones y optimizaciones para maximizar el ahorro de tokens."
tags:
  - "Historial de versiones"
  - "Registro de cambios"
  - "DCP"
prerequisite: []
order: 1
---

# Historial de Versiones de DCP

Este documento registra el historial completo de actualizaciones del plugin OpenCode Dynamic Context Pruning (DCP).

---

## [v1.2.7] - 2026-01-22

**Nuevas funciones**
- ✨ Muestra el conteo de tokens del contenido extraído (en la notificación de poda)
- 🛡️ Mejora del mecanismo de defensa en la inyección de contexto (añadida verificación de arrays)
- 📝 Optimización: cuando el último mensaje es del usuario, el contexto se inyecta como mensaje de usuario
- ⚙️ Configuración predeterminada simplificada (solo incluye URL del schema)

---

## [v1.2.6] - 2026-01-21

**Nuevas funciones**
- ✨ Añadido comando `/dcp sweep` para poda manual del contexto

**Detalles del comando**
- `/dcp sweep` - Poda todas las herramientas después del último mensaje del usuario
- `/dcp sweep N` - Poda las últimas N herramientas

---

## [v1.2.5] - 2026-01-20

**Nuevas funciones**
- ✨ Muestra el conteo de herramientas en el comando `/dcp context`
- ✨ Mejoras en la interfaz del comando `/dcp context`:
  - Muestra el conteo de herramientas podadas
  - Mejora la precisión de la barra de progreso

**Optimización de rendimiento**
- 🚀 Optimizado el cálculo de tokens en el comando de contexto

---

## [v1.2.4] - 2026-01-20

**Nuevas funciones**
- ✨ Unificación de comandos DCP en un único comando `/dcp` (estructura de subcomandos):
  - `/dcp` - Muestra la ayuda
  - `/dcp context` - Análisis de contexto
  - `/dcp stats` - Información estadística
- ✨ Añadida sección de configuración `commands`:
  - Permite habilitar/deshabilitar comandos slash
  - Soporta configuración de lista de herramientas protegidas

**Mejoras**
- 📝 Interfaz del comando de contexto simplificada
- 📝 Documentación actualizada: clarificación del mecanismo de inyección de la herramienta context_info

**Correcciones**
- 🐛 Corregido el manejo de errores en la poda de herramientas (ahora lanza error en lugar de devolver string en caso de fallo)

**Documentación**
- 📚 Añadidas estadísticas de tasa de aciertos de caché al README

---

## [v1.2.3] - 2026-01-16

**Nuevas funciones**
- ✨ Carga de prompts simplificada (prompts movidos a archivos TS)

**Mejoras**
- 🔧 Compatibilidad con Gemini: uso de `thoughtSignature` para eludir la validación de inyección en la sección de herramientas

---

## [v1.2.2] - 2026-01-15

**Correcciones**
- 🐛 Simplificado el momento de inyección (espera al turno del asistente)
- 🐛 Corrección de compatibilidad con Gemini: uso de inyección de texto para evitar errores de thought signature

---

## [v1.2.1] - 2026-01-14

**Correcciones**
- 🐛 Modelos Anthropic: se requiere bloque de razonamiento antes de inyectar contexto
- 🐛 GitHub Copilot: se omite la inyección de mensajes sintéticos con rol de usuario

---

## [v1.2.0] - 2026-01-13

**Nuevas funciones**
- ✨ Añadidos `plan_enter` y `plan_exit` a la lista predeterminada de herramientas protegidas
- ✨ Soporte para herramienta de preguntas (question tool) en la poda

**Mejoras**
- 🔧 Mecanismo de inyección unificado (con verificación isAnthropic)
- 🔧 Estructura de directorio de prompts aplanada
- 🔧 Simplificación y unificación del orden de verificaciones en prune.ts
- 🔧 Extracción del manejador de prompts del sistema a hooks.ts

**Correcciones**
- 🐛 Se omite la inyección de prompts del sistema en sesiones de subagentes
- 🐛 GitHub Copilot: se omite la inyección cuando el último mensaje tiene rol de usuario

---

## [v1.1.6] - 2026-01-12

**Correcciones**
- 🐛 **Corrección crítica para usuarios de GitHub Copilot**: uso de mensaje de asistente completado y tool part para inyectar la lista de herramientas podables

**Alcance del impacto**
- Esta corrección resuelve un problema crítico para usuarios de GitHub Copilot al usar DCP

---

## [v1.1.5] - 2026-01-10

**Nuevas funciones**
- ✨ Añadido soporte de JSON Schema para autocompletado en archivos de configuración
- ✨ Añadida configuración de patrones de archivos protegidos (protectedFilePatterns)
- ✨ Soporte para proteger operaciones de archivos (read/write/edit) mediante patrones glob

**Mejoras**
- 📝 Documentación: documentadas las limitaciones de subagentes

**Correcciones**
- 🐛 Corregida la URL del schema para usar la rama master
- 🐛 Añadido `$schema` a la lista de claves de configuración válidas

---

## [v1.1.4] - 2026-01-06

**Correcciones**
- 🐛 Eliminado el flag `isInternalAgent` (debido a condición de carrera en el orden de hooks)

**Mejoras**
- 🔧 Optimizada la lógica de detección de agentes internos

---

## [v1.1.3] - 2026-01-05

**Correcciones**
- 🐛 Se omite la inyección de DCP para agentes internos (title, summary, compaction)
- 🐛 Deshabilitada la poda para herramientas write/edit

**Mejoras**
- 🔧 Mejorada la detección de limitaciones de subagentes

---

## [v1.1.2] - 2025-12-26

**Mejoras**
- 🔧 Destilación consolidada en notificación unificada
- 🔧 Interfaz de destilación simplificada

---

## [v1.1.1] - 2025-12-25

**Nuevas funciones**
- ✨ Añadida estrategia de purga de errores: poda la entrada después de llamadas a herramientas fallidas
- ✨ Añadido soporte de herramienta skill a `extractParameterKey`

**Mejoras**
- 📝 Mejorado el texto de reemplazo para la poda de errores
- 📝 Documentación: actualizadas las indicaciones sobre context poisoning y OAuth

---

## [v1.1.0] - 2025-12-24

**Nuevas funciones**
- ✨ Actualización de versión con funcionalidades principales
- ✨ Añadidas estrategias de poda automática:
  - Estrategia de deduplicación
  - Estrategia de sobrescritura
  - Estrategia de purga de errores

**Nuevas herramientas**
- ✨ Herramientas de poda impulsadas por LLM:
  - `discard` - Elimina el contenido de la herramienta
  - `extract` - Extrae hallazgos clave

**Sistema de configuración**
- ✨ Soporte de configuración multinivel (global/variables de entorno/proyecto)
- ✨ Funcionalidad de protección de turnos
- ✨ Configuración de herramientas protegidas

---

## [v1.0.4] - 2025-12-18

**Correcciones**
- 🐛 No se podan entradas de herramientas en estado pending o running

**Mejoras**
- 🔧 Optimizada la lógica de detección de estado de herramientas

---

## [v1.0.3] - 2025-12-18

**Nuevas funciones**
- ✅ Detección de compactación basada en mensajes

**Mejoras**
- 🔧 Verificación de marca de tiempo de compactación al inicializar la sesión

---

## [v1.0.2] - 2025-12-17

**Nuevas funciones**
- ✅ Detección de compactación basada en mensajes

**Mejoras**
- 🔧 Limpieza de la estructura del código

---

## [v1.0.1] - 2025-12-16

**Versión inicial**

- ✅ Implementación de funcionalidad principal
- ✅ Integración con plugin de OpenCode
- ✅ Capacidad básica de poda de contexto

---

## Convención de nomenclatura de versiones

- **Versión mayor** (ej. 1.x) - Actualizaciones importantes con cambios incompatibles
- **Versión menor** (ej. 1.2.x) - Nuevas funcionalidades compatibles con versiones anteriores
- **Parche** (ej. 1.2.7) - Correcciones de errores compatibles con versiones anteriores

---

## Obtener la última versión

Se recomienda usar la etiqueta `@latest` en la configuración de OpenCode para obtener automáticamente la última versión:

```jsonc
// opencode.jsonc
{
    "plugin": ["@tarquinen/opencode-dcp@latest"],
}
```

Consulta la última versión publicada: [paquete npm](https://www.npmjs.com/package/@tarquinen/opencode-dcp)
