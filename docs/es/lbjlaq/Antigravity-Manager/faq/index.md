---
title: "FAQ: Solución de problemas | Antigravity-Manager"
sidebarTitle: "¿Qué hacer cuando hay errores"
subtitle: "FAQ: Solución de problemas"
description: "Domina los métodos de solución de problemas comunes de Antigravity Tools. Incluye escenarios como desactivación de cuentas, fallas de autenticación y errores de limitación."
order: 4
---

# Preguntas frecuentes

Este capítulo recopila los códigos de error y escenarios de excepción más comunes al usar Antigravity Tools, ayudándote a localizar rápidamente la causa raíz del problema y encontrar soluciones.

## Contenido de este capítulo

| Tipo de problema | Página | Descripción |
|--- | --- | ---|
| Cuenta desactivada | [invalid_grant y desactivación automática de cuentas](./invalid-grant/) | ¿La cuenta de repente no está disponible? Entiende las causas de la invalidación del token OAuth y el proceso de recuperación |
| Falla de autenticación | [401/falla de autenticación](./auth-401/) | ¿Solicitud rechazada? Verifica la configuración de auth_mode y el formato de Header |
| Error de limitación | [429/error de capacidad](./429-rotation/) | ¿429 frecuente? Distingue entre cuota insuficiente y limitación upstream, usa estrategias de rotación para reducir el impacto |
| Error de ruta | [404/ruta incompatible](./404-base-url/) | ¿API 404? Resuelve el problema de concatenación de Base URL y prefijo /v1 |
| Excepción de streaming | [interrupción de streaming/0 Token/firma inválida](./streaming-0token/) | ¿Respuesta interrumpida o vacía? Entiende el mecanismo de autorecuperación del proxy y la ruta de investigación |

## Ruta de aprendizaje recomendada

**Investigación por código de error**: Cuando encuentres un error específico, ve directamente a la página correspondiente.

**Aprendizaje sistemático**: Si deseas comprender completamente los posibles problemas, se recomienda leer en el siguiente orden:

1. **[404/ruta incompatible](./404-base-url/)** — El problema más común de integración, generalmente el primer obstáculo
2. **[401/falla de autenticación](./auth-401/)** — La ruta es correcta pero la solicitud es rechazada, verifica la configuración de autenticación
3. **[invalid_grant y desactivación automática de cuentas](./invalid-grant/)** — Problemas a nivel de cuenta
4. **[429/error de capacidad](./429-rotation/)** — La solicitud tiene éxito pero está limitada
5. **[interrupción de streaming/0 Token/firma inválida](./streaming-0token/)** — Problemas avanzados, involucran respuestas de streaming y mecanismos de firma

## Requisitos previos

::: warning Recomendación
- [Iniciar proxy local e integrar el primer cliente](../start/proxy-and-first-client/) — Asegúrate de que el entorno básico funcione
- [Agregar cuentas](../start/add-account/) — Conoce la forma correcta de agregar cuentas
:::

## Siguientes pasos

Después de resolver los problemas, puedes continuar con un aprendizaje profundo:

- **[Programación de alta disponibilidad](../advanced/scheduling/)** — Usa estrategias de rotación y reintento para reducir la ocurrencia de errores
- **[Proxy Monitor](../advanced/monitoring/)** — Usa el sistema de registros para rastrear detalles de solicitudes
- **[Guía completa de configuración](../advanced/config/)** — Conoce el propósito de todos los elementos de configuración
