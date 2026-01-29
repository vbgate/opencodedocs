---
title: "Cadena de herramientas: Verificación, compilación e integración CI | agent-skills"
sidebarTitle: "Cadena de herramientas"
subtitle: "Cadena de herramientas: Verificación, compilación e integración CI"
description: "Aprende a usar la cadena de herramientas de Agent Skills. Valida reglas, genera AGENTS.md, configura CI de GitHub Actions y extrae casos de prueba."
tags:
  - "Herramientas de compilación"
  - "CI/CD"
  - "Automatización"
  - "Verificación de código"
prerequisite:
  - "start-getting-started"
  - "start-installation"
  - "advanced-rule-authoring"
---

# Uso de la cadena de herramientas de compilación

## Lo que podrás hacer al terminar

Al terminar esta lección, podrás:

- ✅ Usar `pnpm validate` para verificar el formato y la integridad de los archivos de reglas
- ✅ Usar `pnpm build` para generar AGENTS.md y test-cases.json
- ✅ Entender el flujo de compilación: parse → validate → group → sort → generate
- ✅ Configurar CI de GitHub Actions para verificación y compilación automática
- ✅ Extraer casos de prueba para evaluación automática de LLM
- ✅ Usar `pnpm dev` para el flujo de desarrollo rápido (build + validate)

## Tu situación actual

Si estás manteniendo o ampliando la biblioteca de reglas de React, puedes haber encontrado estos problemas:

- ✗ Después de modificar reglas, olvidas verificar el formato, lo que provoca errores en AGENTS.md generado
- ✗ Hay cada vez más archivos de reglas, verificar manualmente la integridad de cada archivo es demasiado lento
- ✗ Solo después de enviar el código descubres que alguna regla carece de ejemplos de código, afectando la eficiencia de revisión de PR
- ✗ Quieres verificar automáticamente las reglas en CI, pero no sabes cómo configurar GitHub Actions
- ✗ No entiendes claramente el flujo de compilación de `build.ts`, no sabes por dónde empezar a solucionar errores

## Cuándo usar esta técnica

Cuando necesitas:

- 🔍 **Verificar reglas**: Asegurar antes de enviar código que todos los archivos de reglas cumplen con especificaciones
- 🏗️ **Generar documentación**: Generar AGENTS.md estructurado desde archivos de reglas Markdown
- 🤖 **Extraer casos de prueba**: Preparar datos de prueba para evaluación automática de LLM
- 🔄 **Integrar CI**: Automatizar verificación y compilación en GitHub Actions
- 🚀 **Desarrollo rápido**: Usar `pnpm dev` para iterar y verificar reglas rápidamente
