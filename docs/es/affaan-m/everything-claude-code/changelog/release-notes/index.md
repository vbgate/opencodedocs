---
title: "Registro de cambios: Historial de versiones | everything-claude-code"
sidebarTitle: "Novedades recientes"
subtitle: "Registro de cambios: Historial de versiones"
description: "Conoce el historial de versiones y los cambios importantes de everything-claude-code. Rastrea nuevas funcionalidades, correcciones de seguridad y actualizaciones de documentación para decidir si necesitas actualizar."
tags:
  - "changelog"
  - "updates"
prerequisite: []
order: 250
---

# Registro de cambios: Historial de versiones y modificaciones

## Lo que aprenderás

- Conocer los cambios importantes de cada versión
- Rastrear nuevas funcionalidades y correcciones
- Decidir si necesitas actualizar

## Historial de versiones

### 2026-01-24 - Correcciones de seguridad y documentación

**Correcciones**:
- 🔒 **Corrección de seguridad**: Prevención de vulnerabilidad de inyección de comandos en `commandExists()`
  - Uso de `spawnSync` en lugar de `execSync`
  - Validación de entrada permitiendo solo caracteres alfanuméricos, guiones, guiones bajos y puntos
- 📝 **Corrección de documentación**: Añadida advertencia de seguridad para `runCommand()`
- 🐛 **Corrección de falsos positivos del escáner XSS**: Reemplazo de `<script>` y `<binary>` por `[script-name]` y `[binary-name]`
- 📚 **Corrección de documentación**: Corregido `npx ts-morph` a `npx tsx scripts/codemaps/generate.ts` en `doc-updater.md`

**Impacto**: #42, #43, #51

---

### 2026-01-22 - Soporte multiplataforma y sistema de plugins

**Nuevas funcionalidades**:
- 🌐 **Soporte multiplataforma**: Todos los hooks y scripts reescritos en Node.js, compatible con Windows, macOS y Linux
- 📦 **Empaquetado como plugin**: Distribución como plugin de Claude Code, instalable desde el marketplace
- 🎯 **Detección automática del gestor de paquetes**: Soporte para 6 niveles de prioridad de detección
  - Variable de entorno `CLAUDE_PACKAGE_MANAGER`
  - Configuración del proyecto `.claude/package-manager.json`
  - Campo `packageManager` en `package.json`
  - Detección de archivos lock (package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb)
  - Configuración global `~/.claude/package-manager.json`
  - Fallback al primer gestor de paquetes disponible

**Correcciones**:
- 🔄 **Carga de hooks**: Carga automática por convención, eliminada la declaración de hooks en `plugin.json`
- 📌 **Rutas de hooks**: Uso de `${CLAUDE_PLUGIN_ROOT}` y rutas relativas
- 🎨 **Mejoras de UI**: Añadido gráfico de historial de estrellas y barra de badges
- 📖 **Organización de hooks**: Movidos los hooks de session-end de Stop a SessionEnd

---

### 2026-01-20 - Mejoras de funcionalidad

**Nuevas funcionalidades**:
- 💾 **Memory Persistence Hooks**: Guardado y carga automática de contexto entre sesiones
- 🧠 **Strategic Compact Hook**: Sugerencias inteligentes de compresión de contexto
- 📚 **Continuous Learning Skill**: Extracción automática de patrones reutilizables de las sesiones
- 🎯 **Strategic Compact Skill**: Estrategias de optimización de tokens

---

### 2026-01-17 - Lanzamiento inicial

**Funcionalidades iniciales**:
- ✨ Colección completa de configuraciones de Claude Code
- 🤖 9 agentes especializados
- ⚡ 14 comandos slash
- 📋 8 conjuntos de reglas
- 🔄 Hooks automatizados
- 🎨 11 bibliotecas de skills
- 🌐 15+ servidores MCP preconfigurados
- 📖 Documentación README completa

---

## Convención de nomenclatura de versiones

Este proyecto no utiliza versionado semántico tradicional, sino el formato de **versión por fecha** (`YYYY-MM-DD`).

### Tipos de versión

| Tipo | Descripción | Ejemplo |
| --- | --- | --- |
| **Nueva funcionalidad** | Añade nueva funcionalidad o mejora importante | `feat: add new agent` |
| **Corrección** | Corrige bugs o problemas | `fix: resolve hook loading issue` |
| **Documentación** | Actualización de documentación | `docs: update README` |
| **Estilo** | Formato o estilo de código | `style: fix indentation` |
| **Refactorización** | Refactorización de código | `refactor: simplify hook logic` |
| **Rendimiento** | Optimización de rendimiento | `perf: improve context loading` |
| **Pruebas** | Relacionado con pruebas | `test: add unit tests` |
| **Build** | Sistema de build o dependencias | `build: update package.json` |
| **Revertir** | Revierte un commit anterior | `revert: remove version field` |

---

## Cómo obtener actualizaciones

### Actualización desde el marketplace de plugins

Si instalaste Everything Claude Code desde el marketplace de plugins:

1. Abre Claude Code
2. Ejecuta `/plugin update everything-claude-code`
3. Espera a que se complete la actualización

### Actualización manual

Si clonaste el repositorio manualmente:

```bash
cd ~/.claude/plugins/everything-claude-code
git pull origin main
```

### Instalación desde el marketplace

Primera instalación:

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

---

## Análisis de impacto de cambios

### Correcciones de seguridad (actualización obligatoria)

- **2026-01-24**: Corrección de vulnerabilidad de inyección de comandos, se recomienda encarecidamente actualizar

### Mejoras de funcionalidad (actualización opcional)

- **2026-01-22**: Soporte multiplataforma, usuarios de Windows deben actualizar
- **2026-01-20**: Nuevas mejoras de funcionalidad, actualizar según necesidad

### Actualizaciones de documentación (no requiere actualización)

- Las actualizaciones de documentación no afectan la funcionalidad, puedes consultar el README manualmente

---

## Problemas conocidos

### Versión actual (2026-01-24)

- Sin problemas graves conocidos

### Versiones anteriores

- Antes de 2026-01-22: La carga de hooks requería configuración manual (corregido en 2026-01-22)
- Antes de 2026-01-20: Sin soporte para Windows (corregido en 2026-01-22)

---

## Contribuciones y feedback

### Reportar problemas

Si encuentras un bug o tienes sugerencias de funcionalidad:

1. Busca en [GitHub Issues](https://github.com/affaan-m/everything-claude-code/issues) si ya existe un problema similar
2. Si no existe, crea un nuevo Issue proporcionando:
   - Información de versión
   - Sistema operativo
   - Pasos para reproducir
   - Comportamiento esperado vs comportamiento real

### Enviar PR

¡Las contribuciones son bienvenidas! Consulta [CONTRIBUTING.md](https://github.com/affaan-m/everything-claude-code/blob/main/CONTRIBUTING.md) para más detalles.

---

## Resumen de la lección

- Everything Claude Code utiliza números de versión por fecha (`YYYY-MM-DD`)
- Las correcciones de seguridad (como 2026-01-24) requieren actualización obligatoria
- Las mejoras de funcionalidad se pueden actualizar según necesidad
- Los usuarios del marketplace de plugins usan `/plugin update` para actualizar
- Los usuarios con instalación manual usan `git pull` para actualizar
- Para reportar problemas y enviar PRs, sigue las guías del proyecto

## Próxima lección

> En la próxima lección aprenderemos sobre **[Referencia de archivos de configuración](../../appendix/config-reference/)**.
>
> Aprenderás:
> - Descripción completa de los campos de `settings.json`
> - Opciones avanzadas de configuración de hooks
> - Detalles de configuración de servidores MCP
> - Mejores prácticas para configuraciones personalizadas
