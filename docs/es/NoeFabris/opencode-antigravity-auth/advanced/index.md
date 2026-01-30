---
title: "Funciones Avanzadas: Gestión de Múltiples Cuentas | Antigravity Auth"
sidebarTitle: "Gestión de Múltiples Cuentas"
subtitle: "Funciones Avanzadas: Gestión de Múltiples Cuentas"
description: "Domina las características avanzadas del plugin Antigravity Auth. Aprende en profundidad los mecanismos principales como balanceo de carga entre cuentas, selección inteligente de cuentas, manejo de límites de velocidad, recuperación de sesiones y transformación de solicitudes."
order: 3
---

# Funciones Avanzadas

Esta sección te ayuda a dominar las características avanzadas del plugin Antigravity Auth, incluyendo balanceo de carga entre múltiples cuentas, selección inteligente de cuentas, manejo de límites de velocidad, recuperación de sesiones, transformación de solicitudes y otros mecanismos principales. Ya sea para optimizar el uso de cuotas o para resolver problemas complejos, aquí encontrarás las respuestas que necesitas.

## Prerrequisitos

::: warning Antes de comenzar asegúrate de
- ✅ Haber completado la [Instalación Rápida](../../start/quick-install/) y haber añadido la primera cuenta correctamente
- ✅ Haber completado la [Primera Autenticación](../../start/first-auth-login/) y comprender el flujo OAuth
- ✅ Haber completado la [Primera Solicitud](../../start/first-request/) y verificar que el plugin funciona correctamente
:::

## Ruta de Aprendizaje

### 1. [Configuración de Múltiples Cuentas](./multi-account-setup/)

Configura múltiples cuentas de Google para implementar agrupación de cuotas y balanceo de carga.

- Añade múltiples cuentas para aumentar el límite total de cuotas
- Comprende el sistema de cuotas dual (Antigravity + Gemini CLI)
- Selecciona la cantidad adecuada de cuentas según el escenario

### 2. [Estrategias de Selección de Cuentas](./account-selection-strategies/)

Domina las mejores prácticas de las tres estrategias de selección de cuentas: sticky, round-robin e híbrida.

- 1 cuenta → Estrategia sticky para retener el caché de prompts
- 2-3 cuentas → Estrategia híbrida para distribución inteligente de solicitudes
- 4+ cuentas → Estrategia round-robin para maximizar el rendimiento

### 3. [Manejo de Límites de Velocidad](./rate-limit-handling/)

Comprende la detección de límites de velocidad, reintentos automáticos y mecanismos de cambio de cuenta.

- Distingue entre 5 tipos diferentes de errores 429
- Comprende el algoritmo de retroceso exponencial para reintentos automáticos
- Domina la lógica de cambio automático de cuentas en escenarios de múltiples cuentas

### 4. [Recuperación de Sesiones](./session-recovery/)

Conoce el mecanismo de recuperación de sesiones que maneja automáticamente fallos en llamadas a herramientas e interrupciones.

- Maneja automáticamente el error tool_result_missing
- Corrige problemas de thinking_block_order
- Configura las opciones auto_resume y session_recovery

### 5. [Mecanismo de Transformación de Solicitudes](./request-transformation/)

Comprende en profundidad el mecanismo de transformación de solicitudes y cómo maneja las diferencias de protocolo entre diferentes modelos de IA.

- Comprende las diferencias de protocolo entre los modelos Claude y Gemini
- Investiga errores 429 causados por incompatibilidad de esquemas
- Optimiza la configuración de Thinking para obtener el mejor rendimiento

### 6. [Guía de Configuración](./configuration-guide/)

Domina todas las opciones de configuración para personalizar el comportamiento del plugin según tus necesidades.

- Ubicación y prioridad de los archivos de configuración
- Configuraciones de comportamiento de modelos, rotación de cuentas y comportamiento de aplicaciones
- Configuraciones recomendadas para escenarios de una cuenta, múltiples cuentas y agentes paralelos

### 7. [Optimización de Agentes Paralelos](./parallel-agents/)

Optimiza la asignación de cuentas para escenarios de agentes paralelos, habilitando el desplazamiento PID.

- Comprende los problemas de conflicto de cuentas en escenarios de agentes paralelos
- Habilita el desplazamiento PID para que diferentes procesos prefieran cuentas diferentes
- Coordina con la estrategia round-robin para maximizar la utilización de múltiples cuentas

### 8. [Registros de Depuración](./debug-logging/)

Habilita los registros de depuración para investigar problemas y monitorear el estado de operación.

- Habilita registros de depuración para registrar información detallada
- Comprende los diferentes niveles de registro y sus escenarios de aplicación
- Interpreta el contenido de los registros para ubicar problemas rápidamente

## Siguientes Pasos

Después de completar el aprendizaje de funciones avanzadas, puedes:

- 📖 Consultar las [Preguntas Frecuentes](../faq/) para resolver problemas encontrados durante el uso
- 📚 Leer el [Apéndice](../appendix/) para conocer el diseño de arquitectura y referencia completa de configuración
- 🔄 Seguir el [Registro de Cambios](../changelog/) para obtener las últimas funciones y cambios
