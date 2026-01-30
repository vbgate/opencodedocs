---
title: "Plataformas e Integración: Características de Terminal en macOS, Windows y Linux | opencode-notify"
sidebarTitle: "Adapta tu Plataforma"
subtitle: "Plataformas e Integración"
description: "Aprende las diferencias de funcionalidad de opencode-notify en macOS, Windows y Linux, domina el soporte de terminales (37+ emuladores), detección de enfoque, clic para enfocar y características de plataforma como sonidos personalizados. Este capítulo incluye comparación de funcionalidades, mecanismos de detección de terminal y guías de configuración para optimizar tu experiencia de notificaciones según tu sistema operativo y tipo de terminal."
tags:
- "Características de Plataforma"
- "Soporte de Terminal"
- "Compatibilidad del Sistema"
prerequisite:
- "start-quick-start"
- "start-how-it-works"
order: 2
---

# Plataformas e Integración

Este capítulo te ayuda a comprender las diferencias de funcionalidad de opencode-notify en diferentes sistemas operativos, dominar las configuraciones específicas de plataforma y cómo hacer que tu terminal funcione de manera óptima.

## Ruta de Aprendizaje

### 1. [Características de macOS](../macos/)

Conoce las funciones avanzadas en macOS, incluyendo detección inteligente de enfoque, clic en notificación para enfocar y sonidos personalizados.

- Detección de enfoque: Determina automáticamente si la terminal es la ventana activa actual
- Clic para enfocar: Cambia automáticamente a la terminal al hacer clic en la notificación
- Sonidos personalizados: Configura sonidos exclusivos para diferentes eventos
- Soporte para 37+ terminales: Incluyendo Ghostty, iTerm2, terminal integrado de VS Code, etc.

### 2. [Características de Windows](../windows/)

Domina las bases de notificaciones y métodos de configuración en la plataforma Windows.

- Notificaciones nativas: Usa el Centro de Notificaciones de Windows 10/11
- Permisos de notificación: Asegúrate de que OpenCode tenga permiso para enviar notificaciones
- Configuración básica: Ubicación del archivo de configuración en entornos Windows
- Notas de limitaciones: La detección de enfoque no está disponible temporalmente en Windows

### 3. [Características de Linux](../linux/)

Comprende el mecanismo de notificaciones y la instalación de dependencias en la plataforma Linux.

- Integración con libnotify: Usa notify-send para enviar notificaciones
- Soporte de entornos de escritorio: GNOME, KDE Plasma, XFCE y otros entornos principales
- Instalación de dependencias: Comandos de instalación para diferentes distribuciones
- Notas de limitaciones: La detección de enfoque no está disponible temporalmente en Linux

### 4. [Terminales Soportados](../terminals/)

Consulta todos los 37+ emuladores de terminal soportados y comprende el mecanismo de detección automática.

- Detección de terminal: Cómo identificar automáticamente tu tipo de terminal
- Lista de terminales: Lista completa de terminales soportados
- Configuración manual: Cómo especificar manualmente cuando la detección automática falla
- Terminales especiales: Manejo de terminales integrados de VS Code y sesiones SSH remotas

## Prerrequisitos

::: warning Antes de aprender este capítulo, asegúrate de haber completado

- ✅ **[Inicio Rápido](../../start/quick-start/)**: Instalación de opencode-notify completada
- ✅ **[Cómo Funciona](../../start/how-it-works/)**: Comprender los cuatro tipos de notificación y el mecanismo de filtrado inteligente

:::

## Recomendaciones de Selección de Plataforma

Selecciona el capítulo correspondiente según tu sistema operativo:

| Sistema Operativo | Orden de Aprendizaje Recomendado | Funciones Principales |
| --- | --- | --- |
| **macOS** | 1. Características de macOS → 4. Terminales Soportados | Detección de enfoque, clic para enfocar, sonidos personalizados |
| **Windows** | 2. Características de Windows → 4. Terminales Soportados | Notificaciones nativas, configuración básica |
| **Linux** | 3. Características de Linux → 4. Terminales Soportados | Integración con libnotify, instalación de dependencias |

::: tip Recomendación General
Independientemente de la plataforma que uses, la lección 4 "Terminales Soportados" vale la pena aprender, ya que te ayuda a comprender el mecanismo de detección de terminales y resolver problemas de configuración.
:::

## Tabla Comparativa de Funciones

| Función | macOS | Windows | Linux |
| --- | --- | --- | --- |
| Notificaciones Nativas | ✅ | ✅ | ✅ |
| Detección de Enfoque de Terminal | ✅ | ❌ | ❌ |
| Clic en Notificación para Enfocar | ✅ | ❌ | ❌ |
| Sonidos Personalizados | ✅ | ✅ | ✅ (Parcial) |
| Períodos de Silencio | ✅ | ✅ | ✅ |
| Verificación de Sesión Padre | ✅ | ✅ | ✅ |
| Soporte para 37+ Terminales | ✅ | ✅ | ✅ |
| Detección Automática de Terminal | ✅ | ✅ | ✅ |

## Siguientes Pasos

Al completar este capítulo, comprenderás las diferencias de funcionalidad y métodos de configuración en diferentes plataformas.

Se recomienda continuar aprendiendo:

### [Configuración Avanzada](../../advanced/config-reference/)

Profundiza en todas las opciones del archivo de configuración y domina técnicas de configuración avanzada.

- Referencia completa de configuración: Descripción detallada de todas las opciones
- Explicación detallada de períodos de silencio: Cómo configurar y su funcionamiento
- Principio de detección de terminal: Mecanismo interno de detección automática
- Uso avanzado: Consejos de configuración y mejores prácticas

### [Solución de Problemas](../../faq/troubleshooting/)

Consulta soluciones para problemas comunes cuando encuentres dificultades.

- Notificaciones no se muestran: Problemas de permisos y configuración del sistema
- Falla en detección de enfoque: Configuración de terminal y mecanismo de detección
- Errores de configuración: Formato del archivo de configuración y descripción de campos
- Problemas de sonido: Configuración de sonido y compatibilidad del sistema

::: info Recomendación de Ruta de Aprendizaje
Si estás comenzando a usar la herramienta, se recomienda seguir el orden **Capítulos de Plataforma → Configuración Avanzada → Solución de Problemas**. Si encuentras un problema específico, puedes ir directamente al capítulo de solución de problemas.
:::
