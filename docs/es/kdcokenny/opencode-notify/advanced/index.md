---
title: "Uso Avanzado: Configuración Profunda y Optimización | Tutorial de opencode-notify"
sidebarTitle: "Personaliza tu Experiencia de Notificaciones"
subtitle: "Uso Avanzado: Configuración Profunda y Optimización"
description: "Aprende la configuración avanzada de opencode-notify: referencia de configuración, horas de silencio, detección de terminal y mejores prácticas. Optimiza tu experiencia de notificaciones según tus necesidades personales y mejora tu productividad."
tags:
  - "Avanzado"
  - "Configuración"
  - "Optimización"
prerequisite:
  - "start-quick-start"
  - "start-how-it-works"
order: 3
---

# Uso Avanzado: Configuración Profunda y Optimización

Este capítulo te ayudará a dominar las funciones avanzadas de opencode-notify, profundizar en las opciones de configuración, optimizar la experiencia de notificaciones y personalizar el comportamiento de notificaciones según tus necesidades personales.

## Ruta de Aprendizaje

Se recomienda aprender el contenido de este capítulo en el siguiente orden:

### 1. [Referencia de Configuración](./config-reference/)

Obtén una comprensión completa de todas las opciones de configuración disponibles y sus funciones.

- Domina la estructura y sintaxis del archivo de configuración
- Aprende métodos de personalización de sonidos de notificación
- Comprende los escenarios de uso para el interruptor de notificaciones de subshells
- Conoce el método de configuración de sobrescritura de tipos de terminal

### 2. [Guía Detallada de Horas de Silencio](./quiet-hours/)

Aprende cómo configurar horas de silencio para evitar interrupciones en momentos específicos.

- Configura las horas de inicio y fin del período de silencio
- Maneja horas de silencio nocturnas (por ejemplo, 22:00 - 08:00)
- Desactiva temporalmente la función de silencio cuando sea necesario
- Comprende la prioridad de las horas de silencio sobre otras reglas de filtrado

### 3. [Principios de Detección de Terminal](./terminal-detection/)

Profundiza en el mecanismo de trabajo de la detección automática de terminales.

- Aprende cómo el plugin identifica más de 37 emuladores de terminal
- Conoce la implementación de detección de foco en la plataforma macOS
- Domina el método de especificación manual del tipo de terminal
- Comprende el comportamiento predeterminado cuando la detección falla

### 4. [Uso Avanzado](./advanced-usage/)

Domina técnicas de configuración y mejores prácticas.

- Estrategias de configuración para evitar spam de notificaciones
- Ajusta el comportamiento de notificaciones según tu flujo de trabajo
- Recomendaciones de configuración en entornos de múltiples ventanas y terminales
- Consejos de optimización de rendimiento y resolución de problemas

## Prerrequisitos

Antes de comenzar con este capítulo, se recomienda completar primero el siguiente contenido básico:

- ✅ **Inicio Rápido**: Completa la instalación del plugin y la configuración básica
- ✅ **Cómo Funciona**: Comprende las funciones principales del plugin y el mecanismo de escucha de eventos
- ✅ **Características de la Plataforma** (opcional): Conoce las funciones específicas de la plataforma que utilizas

::: tip Consejo de Aprendizaje
Si solo quieres personalizar los sonidos de notificación o configurar horas de silencio, puedes saltar directamente a las subpáginas correspondientes. Si encuentras problemas, puedes consultar el capítulo de referencia de configuración en cualquier momento.
:::

## Siguientes Pasos

Después de completar el aprendizaje de este capítulo, puedes continuar explorando:

- **[Solución de Problemas](../../faq/troubleshooting/)**: Resuelve problemas comunes y problemas difíciles
- **[Preguntas Frecuentes](../../faq/common-questions/)**: Conoce las preguntas candentes que preocupan a los usuarios
- **[Descripción de Tipos de Eventos](../../appendix/event-types/)**: Profundiza en todos los tipos de eventos que escucha el plugin
- **[Ejemplo de Archivo de Configuración](../../appendix/config-file-example/)**: Consulta ejemplos completos de configuración y comentarios

---

<details>
<summary><strong>Haz clic para ver la ubicación del código fuente</strong></summary>

> Última actualización: 2026-01-27

| Función | Ruta del Archivo | Línea |
|---------|------------------|-------|
| Definición de Interfaz de Configuración | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48 |
| Configuración Predeterminada | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| Carga de Configuración | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| Verificación de Horas de Silencio | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| Detección de Terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L176) | 145-176 |
| Mapeo de Nombre de Proceso de Terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |

**Interfaces Clave**:
- `NotifyConfig`: Interfaz de configuración que contiene todos los elementos configurables
- `quietHours`: Configuración de horas de silencio (enabled/start/end)
- `sounds`: Configuración de sonidos (idle/error/permission)
- `terminal`: Sobrescritura de tipo de terminal (opcional)

**Constantes Clave**:
- `DEFAULT_CONFIG`: Valores predeterminados para todos los elementos de configuración
- `TERMINAL_PROCESS_NAMES`: Tabla de mapeo de nombres de terminal a nombres de proceso macOS

</details>
