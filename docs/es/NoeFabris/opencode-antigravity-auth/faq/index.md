---
title: "Preguntas Frecuentes: Autenticación OAuth y Solución de Problemas de Modelos | Antigravity Auth"
sidebarTitle: "Qué hacer si falla la autenticación"
subtitle: "Preguntas Frecuentes: Autenticación OAuth y Solución de Problemas de Modelos"
description: "Descubre las preguntas frecuentes y soluciones del plugin Antigravity Auth. Cubre la resolución de fallos de autenticación OAuth, el manejo de errores de modelo no encontrado, la configuración de compatibilidad de plugins y guías prácticas para ayudarte a localizar y resolver rápidamente varios problemas encontrados durante el uso."
order: 4
---

# Preguntas Frecuentes

Este capítulo recopila los problemas más comunes y sus soluciones al usar el plugin Antigravity Auth. Ya sea por fallos de autenticación OAuth, errores en solicitudes de modelo, o problemas de compatibilidad de plugins, aquí encontrarás las guías correspondientes para la resolución de problemas.

## Requisitos Previos

::: warning Antes de comenzar, asegúrate de
- ✅ Haber completado la [instalación rápida](../start/quick-install/) y agregado exitosamente tu cuenta
- ✅ Haber completado la [primera autenticación](../start/first-auth-login/) y comprendido el flujo OAuth
:::

## Ruta de Aprendizaje

Según el tipo de problema que encuentres, selecciona la guía de resolución correspondiente:

### 1. [Resolución de fallos de autenticación OAuth](./common-auth-issues/)

Resuelve problemas comunes relacionados con la autenticación OAuth, la actualización de tokens y las cuentas.

- La autorización del navegador tiene éxito pero el terminal indica "autorización fallida"
- De repente aparece el error "Permission Denied" o "invalid_grant"
- Fallo del callback OAuth en el navegador Safari
- No se puede completar la autenticación en entornos WSL2/Docker

### 2. [Migración de cuentas](./migration-guide/)

Migra cuentas entre diferentes máquinas y maneja las actualizaciones de versión.

- Migrar cuenta de la computadora vieja a la nueva
- Comprender los cambios en el formato de almacenamiento (v1/v2/v3)
- Resolver errores de invalid_grant después de la migración

### 3. [Resolución de modelo no encontrado](./model-not-found/)

Resuelve problemas relacionados con modelos, como modelo no encontrado y errores 400.

- Resolución de error "Model not found"
- Error 400 "Invalid JSON payload received. Unknown name \"parameters\""
- Error en la llamada del servidor MCP

### 4. [Compatibilidad de plugins](./plugin-compatibility/)

Resuelve problemas de compatibilidad con plugins como oh-my-opencode, DCP, etc.

- Configurar correctamente el orden de carga de plugins
- Desactivar métodos de autenticación conflictivos en oh-my-opencode
- Habilitar desplazamiento PID para escenarios de agentes paralelos

### 5. [Advertencia ToS](./tos-warning/)

Comprende los riesgos de uso y evita que la cuenta sea bloqueada.

- Conocer las restricciones de los términos de servicio de Google
- Identificar escenarios de alto riesgo (nuevas cuentas, solicitudes intensivas)
- Dominar las mejores prácticas para evitar el bloqueo de cuentas

## Localización Rápida de Problemas

| Fenómeno de error | Lectura recomendada |
|--- | ---|
| Fallo de autenticación, tiempo de espera de autorización | [Resolución de fallos de autenticación OAuth](./common-auth-issues/) |
| invalid_grant, Permission Denied | [Resolución de fallos de autenticación OAuth](./common-auth-issues/) |
| Model not found, error 400 | [Resolución de modelo no encontrado](./model-not-found/) |
| Conflicto con otros plugins | [Compatibilidad de plugins](./plugin-compatibility/) |
| Cambio de computadora, actualización de versión | [Migración de cuentas](./migration-guide/) |
| Preocupado por la seguridad de la cuenta | [Advertencia ToS](./tos-warning/) |

## Siguiente Paso

Después de resolver el problema, puedes:

- 📖 Leer [Funciones avanzadas](../advanced/) para dominar a fondo múltiples cuentas, recuperación de sesiones y otras características
- 📚 Consultar [Apéndice](../appendix/) para conocer el diseño de arquitectura y referencia completa de configuración
- 🔄 Seguir el [registro de cambios](../changelog/) para obtener las últimas funciones y actualizaciones
