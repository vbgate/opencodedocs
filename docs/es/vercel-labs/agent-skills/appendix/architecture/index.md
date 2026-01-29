---
title: "Arquitectura: Principios técnicos | Agent Skills"
sidebarTitle: "Arquitectura"
subtitle: "Arquitectura y detalles de implementación"
description: "Aprende la arquitectura técnica y el flujo de compilación de Agent Skills. Domina el analizador de reglas, el sistema de tipos y el algoritmo de detección de marcos."
tags:
  - "Arquitectura"
  - "Flujo de compilación"
  - "Análisis de reglas"
  - "Sistema de tipos"
prerequisite:
  - "start-getting-started"
---

# Arquitectura y detalles de implementación

## Lo que podrás hacer al terminar

- Entender cómo funciona la cadena de herramientas de compilación de Agent Skills
- Dominar la lógica central del análisis de archivos de reglas
- Entender el diseño del sistema de tipos y el flujo de datos
- Aprender los detalles de implementación del algoritmo de detección de marcos

## Visión general de la arquitectura principal

Agent Skills se compone de tres partes principales:

**1. Cadena de herramientas de compilación** (`packages/react-best-practices-build/`)
- Analizar archivos de reglas
- Generar AGENTS.md
- Extraer casos de prueba

**2. Archivos de reglas** (`skills/react-best-practices/rules/`)
- 57 reglas de optimización de rendimiento de React
- Formato Markdown, siguiendo especificaciones de plantilla

**3. Scripts de implementación** (`skills/claude.ai/vercel-deploy-claimable/`)
- Implementación con un clic en Vercel
- Detección automática de marcos

::: info ¿Por qué entender la arquitectura?
Si solo usas Agent Skills, quizás no necesites深入了解 estos detalles. Pero si necesitas:
- Desarrollar habilidades personalizadas
- Escribir nuevas reglas de optimización de rendimiento
- Solucionar problemas de compilación o implementación

Entender la arquitectura será muy útil.
:::
