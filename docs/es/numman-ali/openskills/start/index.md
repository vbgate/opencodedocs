---
title: "Guía Rápida: Comienza con OpenSkills | OpenSkills"
sidebarTitle: "Primeros pasos en 15 min"
subtitle: "Guía Rápida: Comienza con OpenSkills | OpenSkills"
description: "Aprende los fundamentos de OpenSkills en minutos. Completa la instalación de herramientas y habilidades en 15 minutos, permitiendo que tus agentes de IA utilicen nuevas capacidades y comprendan su funcionamiento."
order: 1
---

# Guía Rápida

Esta sección te ayuda a comenzar con OpenSkills, desde la instalación de herramientas hasta que tu agente de IA utilice habilidades, todo en solo 10-15 minutos.

## Ruta de aprendizaje

Te recomendamos seguir este orden:

### 1. [Guía Rápida](./quick-start/)

Completa la instalación de herramientas, instalación de habilidades y sincronización en 5 minutos, experimentando el valor principal de OpenSkills.

- Instala la herramienta OpenSkills
- Instala habilidades desde el repositorio oficial de Anthropic
- Sincroniza habilidades a AGENTS.md
- Verifica que el agente de IA puede utilizar las habilidades

### 2. [¿Qué es OpenSkills?](./what-is-openskills/)

Comprende los conceptos fundamentales y el funcionamiento de OpenSkills.

- La relación entre OpenSkills y Claude Code
- Formato de habilidades unificado, carga progresiva, soporte multi-agente
- Cuándo usar OpenSkills en lugar del sistema de habilidades integrado

### 3. [Guía de instalación](./installation/)

Pasos detallados de instalación y configuración del entorno.

- Verificación de entorno Node.js y Git
- Uso temporal con npx vs instalación global
- Resolución de problemas comunes de instalación

### 4. [Instala tu primera habilidad](./first-skill/)

Instala habilidades desde el repositorio oficial de Anthropic y experimenta la selección interactiva.

- Usa el comando `openskills install`
- Selección interactiva de habilidades necesarias
- Comprende la estructura del directorio de habilidades (.claude/skills/)

### 5. [Sincroniza habilidades a AGENTS.md](./sync-to-agents/)

Genera el archivo AGENTS.md para que tu agente de IA sepa qué habilidades están disponibles.

- Usa el comando `openskills sync`
- Comprende el formato XML de AGENTS.md
- Selecciona qué habilidades sincronizar, controlando el tamaño del contexto

### 6. [Usa habilidades](./read-skills/)

Entiende cómo los agentes de IA cargan el contenido de las habilidades.

- Usa el comando `openskills read`
- Orden de prioridad de búsqueda de habilidades (4 niveles)
- Leer múltiples habilidades a la vez

## Prerrequisitos

Antes de comenzar, asegúrate de tener:

- [Node.js](https://nodejs.org/) 20.6.0 o superior instalado
- [Git](https://git-scm.com/) instalado (para instalar habilidades desde GitHub)
- Al menos un agente de codificación con IA instalado (Claude Code, Cursor, Windsurf, Aider, etc.)

::: tip Verificación rápida del entorno
```bash
node -v  # Debería mostrar v20.6.0 o superior
git -v   # Debería mostrar git version x.x.x
```
:::

## Siguientes pasos

Una vez completada esta sección, puedes continuar aprendiendo:

- [Comandos en detalle](../platforms/cli-commands/): Profundiza en todos los comandos y parámetros
- [Fuentes de instalación en detalle](../platforms/install-sources/): Aprende a instalar habilidades desde GitHub, rutas locales, repositorios privados
- [Crea habilidades personalizadas](../advanced/create-skills/): Crea tus propias habilidades personalizadas
