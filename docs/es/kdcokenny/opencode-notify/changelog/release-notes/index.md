---
title: "Registro de cambios de opencode-notify: Historial de versiones y cambios funcionales"
sidebarTitle: "Conoce las novedades"
subtitle: "Registro de cambios"
description: "Consulta el historial de versiones y los cambios importantes del complemento opencode-notify. Conoce las actualizaciones de funciones, correcciones de errores y mejoras de configuración de cada versión."
tags:
  - "Registro de cambios"
  - "Historial de versiones"
order: 150
---

# Registro de cambios

## Notas sobre las versiones

Este complemento se distribuye a través de OCX y no utiliza números de versión tradicionales. A continuación se registran los cambios importantes en orden cronológico inverso.

---

## 2026-01-23

**Tipo de cambio**: Actualización sincronizada

- Sincronización con el repositorio principal kdcokenny/ocx

---

## 2026-01-22

**Tipo de cambio**: Actualización sincronizada

- Sincronización con el repositorio principal kdcokenny/ocx

---

## 2026-01-13

**Tipo de cambio**: Actualización sincronizada

- Sincronización con el repositorio principal kdcokenny/ocx

---

## 2026-01-12

**Tipo de cambio**: Actualización sincronizada

- Sincronización con el repositorio principal kdcokenny/ocx

---

## 2026-01-08

**Tipo de cambio**: Actualización sincronizada

- Sincronización con el repositorio principal kdcokenny/ocx

---

## 2026-01-07

**Tipo de cambio**: Actualización sincronizada

- Actualización desde ocx@30a9af5
- Omisión de compilación CI

---

## 2026-01-01

### Corrección: Sintaxis de namespace estilo Cargo

**Cambios realizados**:
- Actualización de sintaxis de namespace: `ocx add kdco-notify` → `ocx add kdco/notify`
- Actualización de sintaxis de namespace: `ocx add kdco-workspace` → `ocx add kdco/workspace`
- Renombrado de archivo fuente: `kdco-notify.ts` → `notify.ts`

**Impacto**:
- El comando de instalación cambia de `ocx add kdco-notify` a `ocx add kdco/notify`
- Estructura de archivos fuente más clara, siguiendo el estilo de nomenclatura de Cargo

---

### Optimización: Documentación README

**Cambios realizados**:
- Optimización del README con descripción de la propuesta de valor
- Nueva sección de preguntas frecuentes
- Mejora del texto relacionado con "notificaciones inteligentes"
- Simplificación de las instrucciones de instalación

**Contenido añadido**:
- Tabla de propuesta de valor (evento, notificación, sonido, motivo)
- Preguntas frecuentes: ¿Añade contexto adicional?, ¿Recibiré notificaciones spam?, ¿Cómo desactivar temporalmente?

---

## 2025-12-31

### Documentación: Simplificación del README

**Cambios realizados**:
- Eliminación de referencias inválidas a iconos y modo oscuro
- Simplificación del README, enfocándose en la descripción de funciones principales

### Eliminado: Soporte de iconos

**Cambios realizados**:
- Eliminación del soporte de iconos de OpenCode (detección de modo oscuro multiplataforma)
- Simplificación del flujo de notificaciones, eliminando funcionalidad de iconos inestable
- Limpieza del directorio `src/plugin/assets/`

**Archivos eliminados**:
- `src/plugin/assets/opencode-icon-dark.png`
- `src/plugin/assets/opencode-icon-light.png`

**Impacto**:
- Las notificaciones ya no muestran iconos personalizados
- Flujo de notificaciones más estable, reduciendo problemas de compatibilidad entre plataformas

### Añadido: Iconos de OpenCode (Eliminado posteriormente)

**Cambios realizados**:
- Soporte de iconos de OpenCode añadido
- Implementación de detección de modo oscuro multiplataforma

::: info
Esta función fue eliminada en versiones posteriores, ver "Eliminado: Soporte de iconos" del 2025-12-31.
:::

### Añadido: Detección de terminal y percepción de enfoque

**Cambios realizados**:
- Nueva función de detección automática de terminal (compatible con más de 37 terminales)
- Nueva función de detección de enfoque (solo macOS)
- Nueva función de enfoque al hacer clic (solo macOS)

**Nuevas funcionalidades**:
- Identificación automática del emulador de terminal
- Supresión de notificaciones cuando la terminal está enfocada
- Enfocar ventana de terminal al hacer clic en la notificación (macOS)

**Detalles técnicos**:
- Uso de la biblioteca `detect-terminal` para detectar el tipo de terminal
- Obtención de la aplicación en primer plano mediante osascript de macOS
- Uso de la opción activate de node-notifier para implementar el enfoque al hacer clic

### Añadido: Versión inicial

**Cambios realizados**:
- Commit inicial: complemento kdco-notify
- Funcionalidad básica de notificaciones nativas
- Sistema de configuración básico

**Funciones principales**:
- Notificación de evento session.idle (tarea completada)
- Notificación de evento session.error (error)
- Notificación de evento permission.updated (solicitud de permisos)
- Integración con node-notifier (notificaciones nativas multiplataforma)

**Archivos iniciales**:
- `LICENSE` - Licencia MIT
- `README.md` - Documentación del proyecto
- `registry.json` - Configuración de registro OCX
- `src/plugin/kdco-notify.ts` - Código principal del complemento

---

## Recursos relacionados

- **Repositorio GitHub**: https://github.com/kdcokenny/ocx/tree/main/registry/src/kdco/notify
- **Historial de commits**: https://github.com/kdcokenny/ocx/commits/main/registry/src/kdco/notify
- **Documentación OCX**: https://github.com/kdcokenny/ocx

---

## Estrategia de versiones

Este complemento, como parte del ecosistema OCX, adopta la siguiente estrategia de versiones:

- **Sin números de versión**: Los cambios se rastrean mediante el historial de commits de Git
- **Entrega continua**: Actualizaciones sincronizadas con el repositorio principal de OCX
- **Compatibilidad hacia atrás**: Se mantiene la compatibilidad del formato de configuración y la API

Los cambios que rompan la compatibilidad se indicarán claramente en el registro de cambios.

---

**Última actualización**: 2026-01-27
