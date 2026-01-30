---
title: "Funciones de la Plataforma: Modelos y Cuotas | opencode-antigravity-auth"
sidebarTitle: "Desbloquear el Sistema de Doble Cuota"
subtitle: "Funciones de la Plataforma: Modelos y Cuotas"
description: "Conozca los tipos de modelos y el sistema de doble cuota de Antigravity Auth. Domine la selección de modelos, configuración de Thinking y Google Search para optimizar el uso de cuotas."
order: 2
---

# Funciones de la Plataforma

Este capítulo te ayuda a comprender profundamente los modelos compatibles con el complemento Antigravity Auth, el sistema de cuotas y las características de la plataforma. Aprenderás a seleccionar el modelo adecuado, configurar la capacidad de Thinking, habilitar Google Search y maximizar la utilización de cuotas.

## Requisitos Previos

::: warning Antes de comenzar, confirma
Antes de estudiar este capítulo, asegúrate de haber completado:
- [Instalación Rápida](../start/quick-install/): Completa la instalación del complemento y la primera autenticación
- [Primera Solicitud](../start/first-request/): Realiza con éxito la primera solicitud al modelo
:::

## Ruta de Aprendizaje

Sigue el siguiente orden para dominar progresivamente las funciones de la plataforma:

### 1. [Modelos Disponibles](./available-models/)

Conoce todos los modelos disponibles y sus configuraciones de variantes

- Familiarízate con Claude Opus 4.5, Sonnet 4.5 y Gemini 3 Pro/Flash
- Comprende la distribución de modelos entre los dos grupos de cuotas de Antigravity y Gemini CLI
- Domina el uso del parámetro `--variant`

### 2. [Sistema de Doble Cuota](./dual-quota-system/)

Comprende el funcionamiento del sistema de doble cuota de Antigravity y Gemini CLI

- Aprende cómo cada cuenta tiene dos grupos independientes de cuotas de Gemini
- Habilita la configuración de fallback automático para duplicar las cuotas
- Especifica explícitamente el uso de grupos de cuotas para modelos específicos

### 3. [Google Search Grounding](./google-search-grounding/)

Habilita Google Search para los modelos de Gemini y mejora la precisión factual

- Permite que Gemini busque información en tiempo real en la web
- Ajusta el umbral de búsqueda para controlar la frecuencia de búsquedas
- Selecciona la configuración adecuada según los requisitos de la tarea

### 4. [Modelos Thinking](./thinking-models/)

Domina la configuración y el uso de los modelos Thinking de Claude y Gemini 3

- Configura el presupuesto de thinking de Claude
- Utiliza los niveles de thinking de Gemini 3 (minimal/low/medium/high)
- Comprende las estrategias de interleaved thinking y retención de bloques de pensamiento

## Siguientes Pasos

Después de completar este capítulo, puedes continuar aprendiendo:

- [Configuración Multi-Cuenta](../advanced/multi-account-setup/): Configura múltiples cuentas de Google para lograr la agrupación de cuotas y el balanceo de carga
- [Estrategias de Selección de Cuentas](../advanced/account-selection-strategies/): Domina las mejores prácticas de las tres estrategias: sticky, round-robin y hybrid
- [Guía de Configuración](../advanced/configuration-guide/): Domina todas las opciones de configuración y personaliza el comportamiento del complemento según tus necesidades
