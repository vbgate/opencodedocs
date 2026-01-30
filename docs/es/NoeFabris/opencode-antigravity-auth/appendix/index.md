---
title: "Apéndice: Referencia técnica | Antigravity Auth"
sidebarTitle: "Entender a fondo los principios del plugin"
subtitle: "Apéndice: Referencia técnica de arquitectura, API y configuración"
description: "Conozca los materiales de referencia técnica del plugin Antigravity Auth, incluidos el diseño de arquitectura, especificaciones de API, formato de almacenamiento y opciones de configuración completas."
order: 5
---

# Apéndice

Esta sección proporciona materiales de referencia técnica del plugin Antigravity Auth, incluidos el diseño de arquitectura, especificaciones de API, formato de almacenamiento y el manual completo de configuración, para ayudarle a comprender profundamente los mecanismos internos del plugin.

## Ruta de aprendizaje

### 1. [Visión general de la arquitectura](./architecture-overview/)

Conozca la estructura de módulos del plugin y el flujo de procesamiento de solicitudes.

- Diseño de capas de módulos y división de responsabilidades
- Ruta completa desde OpenCode hasta la API de Antigravity
- Mecanismos de balanceo de carga multicuenta y recuperación de sesión

### 2. [Especificaciones de API](./api-spec/)

Profundice en los detalles técnicos de la API de Antigravity.

- Interfaz de gateway unificado y configuración de endpoints
- Formatos de solicitud/respuesta y restricciones de JSON Schema
- Configuración del modelo Thinking y reglas de llamada a funciones

### 3. [Formato de almacenamiento](./storage-schema/)

Conozca la estructura del archivo de almacenamiento de cuentas y la gestión de versiones.

- Ubicación del archivo de almacenamiento y significado de cada campo
- Evolución de versiones v1/v2/v3 y migración automática
- Métodos para migrar configuración de cuentas entre máquinas

### 4. [Todas las opciones de configuración](./all-config-options/)

Manual de referencia completo de todas las opciones de configuración.

- Valores predeterminados y escenarios de aplicación de 30+ opciones de configuración
- Métodos para sobrescribir configuración con variables de entorno
- Combinaciones óptimas de configuración para diferentes escenarios de uso

## Requisitos previos

::: warning Recomendado
El contenido de esta sección es técnicamente profundo, se recomienda completar primero el siguiente aprendizaje:

- [Instalación rápida](../start/quick-install/) - Complete la instalación del plugin y la primera autenticación
- [Guía de configuración](../advanced/configuration-guide/) - Conozca los métodos de configuración comunes
:::

## Siguiente paso

Después de completar el estudio del apéndice, usted puede:

- Consultar [Preguntas frecuentes](../faq/) para resolver problemas encontrados durante el uso
- Seguir el [Registro de cambios](../changelog/version-history/) para conocer los cambios de versión
- Participar en el desarrollo del plugin, contribuyendo con código o documentación
