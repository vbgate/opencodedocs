---
title: "Preguntas Frecuentes: Solución de Problemas | oh-my-opencode"
sidebarTitle: "Preguntas Frecuentes"
subtitle: "Preguntas Frecuentes: Solución de Problemas | oh-my-opencode"
description: "Aprende a diagnosticar y resolver problemas comunes de oh-my-opencode. Domina el diagnóstico de configuración, la solución de problemas de instalación, consejos de uso y recomendaciones de seguridad."
order: 150
---

# Preguntas Frecuentes y Solución de Problemas

Este capítulo te ayuda a resolver problemas comunes encontrados al usar oh-my-opencode, desde el diagnóstico de configuración hasta consejos de uso y recomendaciones de seguridad, permitiéndote localizar rápidamente problemas y encontrar soluciones.

## Ruta de Aprendizaje

Sigue esta secuencia para dominar progresivamente la solución de problemas y las mejores prácticas:

### 1. [Diagnóstico y Solución de Problemas de Configuración](./troubleshooting/)

Aprende a usar el comando Doctor para diagnosticar y resolver rápidamente problemas de configuración.
- Ejecuta el comando Doctor para un chequeo de salud completo
- Interpreta 17+ resultados de verificación (instalación, configuración, autenticación, dependencias, herramientas, actualizaciones)
- Localiza y corrige problemas comunes de configuración
- Usa el modo detallado y la salida JSON para diagnósticos avanzados

### 2. [Preguntas Frecuentes](./faq/)

Encuentra y resuelve problemas comunes durante el uso.
- Respuestas rápidas para problemas de instalación y configuración
- Consejos de uso y mejores prácticas (ultrawork, llamadas proxy, tareas en segundo plano)
- Notas de compatibilidad con Claude Code
- Advertencias de seguridad y recomendaciones de optimización de rendimiento
- Recursos de contribución y ayuda

## Requisitos Previos

Antes de comenzar este capítulo, asegúrate de:
- Haber completado [Instalación y Configuración Rápidas](../../start/installation/)
- Estar familiarizado con la estructura básica del archivo de configuración de oh-my-opencode
- Haber encontrado un problema específico o querer entender las mejores prácticas

::: tip Tiempo de Lectura Recomendado
Después de completar la instalación básica, recomendamos leer primero las preguntas frecuentes para entender los errores comunes y las mejores prácticas. Cuando encuentres problemas específicos, usa las herramientas de solución de problemas para el diagnóstico.
:::

## Guía Rápida de Solución de Problemas

Si encuentras un problema urgente, sigue estos pasos para una solución rápida:

```bash
# Paso 1: Ejecuta un diagnóstico completo
bunx oh-my-opencode doctor

# Paso 2: Ver información detallada del error
bunx oh-my-opencode doctor --verbose

# Paso 3: Verifica una categoría específica (por ejemplo, autenticación)
bunx oh-my-opencode doctor --category authentication

# Paso 4: Si no se resuelve, verifica las preguntas frecuentes
# o busca ayuda en GitHub Issues
```

## Próximos Pasos

Después de completar este capítulo, puedes continuar aprendiendo:
- **[Compatibilidad con Claude Code](../../appendix/claude-code-compatibility/)** - Aprende sobre el soporte completo de compatibilidad con Claude Code
- **[Referencia de Configuración](../../appendix/configuration-reference/)** - Ver el esquema completo del archivo de configuración y descripciones de campos
- **[Servidores MCP Integrados](../../appendix/builtin-mcps/)** - Aprende a usar los servidores MCP integrados
