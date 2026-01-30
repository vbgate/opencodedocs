---
title: "Registro de Cambios: Historial de Versiones y Cambios de Funcionalidad | Agent App Factory"
sidebarTitle: "Registro de Cambios"
subtitle: "Registro de Cambios: Historial de Versiones y Cambios de Funcionalidad | Agent App Factory"
description: "Conoce el historial de actualizaciones de versiones de Agent App Factory, cambios de funcionalidad, correcciones de bugs y mejoras importantes. Esta página detalla el historial completo de cambios desde la versión 1.0.0, incluyendo sistema de canalización de 7 etapas, planificador Sisyphus, gestión de permisos, optimización de contexto y estrategias de manejo de fallos."
tags:
  - "Registro de Cambios"
  - "Historial de Versiones"
prerequisite: []
order: 250
---

# Registro de Cambios

Esta página registra el historial de actualizaciones de versiones de Agent App Factory, incluyendo nuevas funcionalidades, mejoras, correcciones de bugs y cambios disruptivos.

El formato sigue las especificaciones [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/) y los números de versión siguen [Semantic Versioning](https://semver.org/lang/zh-CN/).

## [1.0.0] - 2024-01-29

### Añadido

**Funcionalidades Principales**
- **Sistema de canalización de 7 etapas**: flujo automatizado completo desde la idea hasta la aplicación ejecutable
  - Bootstrap - estructurar ideas de producto (input/idea.md)
  - PRD - generar documento de requisitos de producto (artifacts/prd/prd.md)
  - UI - diseñar estructura de UI y prototipos previsualizables (artifacts/ui/)
  - Tech - diseñar arquitectura técnica y modelo de datos Prisma (artifacts/tech/)
  - Code - generar código de frontend y backend (artifacts/backend/, artifacts/client/)
  - Validation - validar calidad del código (artifacts/validation/report.md)
  - Preview - generar guía de despliegue (artifacts/preview/README.md)

- **Planificador Sisyphus**: componente de control central de la canalización
  - Ejecutar cada Stage definido en pipeline.yaml en secuencia
  - Verificar entrada/salida y condiciones de salida de cada etapa
  - Mantener estado de la canalización (.factory/state.json)
  - Ejecutar verificaciones de permisos para evitar lecturas/escrituras no autorizadas de Agentes
  - Manejar situaciones anómalas según la estrategia de fallos
  - Pausar en cada punto de control, esperar confirmación manual antes de continuar

**Herramientas CLI**
- `factory init` - inicializar proyecto Factory
- `factory run [stage]` - ejecutar canalización (desde etapa actual o especificada)
- `factory continue` - continuar ejecución en nueva sesión (ahorrar tokens)
- `factory status` - ver estado actual del proyecto
- `factory list` - listar todos los proyectos Factory
- `factory reset` - restablecer estado del proyecto actual

**Permisos y Seguridad**
- **Matriz de límites de capacidades** (capability.matrix.md): definir permisos de lectura/escritura estrictos para cada Agente
  - Cada Agente solo puede acceder a directorios autorizados
  - Archivos escritos sin permiso se mueven a artifacts/_untrusted/
  - Suspender automáticamente la canalización tras fallo, esperar intervención manual

**Optimización de Contexto**
- **Ejecución por sesiones**: cada etapa se ejecuta en una nueva sesión
  - Evitar acumulación de contexto, ahorrar tokens
  - Soportar recuperación tras interrupciones
  - Compatible con todos los asistentes AI (Claude Code, OpenCode, Cursor)

**Estrategias de Manejo de Fallos**
- Mecanismo de reintento automático: cada etapa permite un reintento
- Archivo de fallos: artefactos fallidos se mueven a artifacts/_failed/
- Mecanismo de reversión: revertir al punto de control exitoso más reciente
- Intervención manual: pausar tras dos fallos consecutivos

**Aseguramiento de Calidad**
- **Estándares de código** (code-standards.md)
  - Estándares de codificación TypeScript y mejores prácticas
  - Estructura de archivos y convenciones de nombres
  - Requisitos de comentarios y documentación
  - Estándar de mensajes de commit de Git (Conventional Commits)

- **Estándares de códigos de error** (error-codes.md)
  - Estructura unificada de códigos de error: [MODULE]_[ERROR_TYPE]_[SPECIFIC]
  - Tipos estándar de error: VALIDATION, NOT_FOUND, FORBIDDEN, CONFLICT, INTERNAL_ERROR
  - Mapeo de códigos de error frontend/backend y mensajes amigables para usuarios

**Gestión de Changelog**
- Seguir formato Keep a Changelog
- Integración con Conventional Commits
- Soporte de herramientas automatizadas: conventional-changelog-cli, release-it

**Plantillas de Configuración**
- Configuración CI/CD (GitHub Actions)
- Configuración de Git Hooks (Husky)

**Características de Aplicaciones Generadas**
- Código completo de frontend y backend (Express + Prisma + React Native)
- Pruebas unitarias e integración (Vitest + Jest)
- Documentación de API (Swagger/OpenAPI)
- Datos de semilla de base de datos
- Configuración de despliegue Docker
- Manejo de errores y monitoreo de logs
- Optimización de rendimiento y verificaciones de seguridad

### Mejorado

**Enfoque MVP**
- Listar explícitamente objetivos no incluidos (Non-Goals), prevenir expansión de alcance
- Limitar número de páginas a 3 como máximo
- Enfocarse en funcionalidades principales, evitar sobrediseño

**Separación de Responsabilidades**
- Cada Agente solo responsable de su dominio, no cruzar límites
- PRD no contiene detalles técnicos, Tech no involucra diseño UI
- Code Agent implementa estrictamente según esquema UI y diseño Tech

**Verificabilidad**
- Cada etapa define exit_criteria claros
- Todas las funcionalidades son probables y ejecutables localmente
- Artefactos deben estar estructurados y ser consumibles por etapas posteriores

### Stack Tecnológico

**Herramientas CLI**
- Node.js >= 16.0.0
- Commander.js - framework de línea de comandos
- Chalk - salida de terminal coloreada
- Ora - indicador de progreso
- Inquirer - línea de comandos interactiva
- fs-extra - operaciones de sistema de archivos
- YAML - análisis YAML

**Aplicaciones Generadas**
- Backend: Node.js + Express + Prisma + TypeScript + Vitest
- Frontend: React Native + Expo + TypeScript + Jest + React Testing Library
- Despliegue: Docker + GitHub Actions

### Dependencias

- `chalk@^4.1.2` - estilos de color de terminal
- `commander@^11.0.0` - análisis de argumentos de línea de comandos
- `fs-extra@^11.1.1` - extensiones de sistema de archivos
- `inquirer@^8.2.5` - línea de comandos interactiva
- `ora@^5.4.1` - cargador de terminal elegante
- `yaml@^2.3.4` - análisis y serialización YAML

## Notas de Versión

### Semantic Versioning

Este proyecto sigue el formato de número de versión [Semantic Versioning](https://semver.org/lang/zh-CN/): MAJOR.MINOR.PATCH

- **MAJOR**: cambios de API incompatibles
- **MINOR**: nuevas funcionalidades con compatibilidad hacia atrás
- **PATCH**: correcciones de bugs compatibles hacia atrás

### Tipos de Cambios

- **Añadido** (Added): nuevas funcionalidades
- **Cambiado** (Changed): cambios en funcionalidades existentes
- **Obsoleto** (Deprecated): funcionalidades que se eliminarán pronto
- **Eliminado** (Removed): funcionalidades eliminadas
- **Corregido** (Fixed): correcciones de bugs
- **Seguridad** (Security): correcciones de seguridad

## Recursos Relacionados

- [GitHub Releases](https://github.com/hyz1992/agent-app-factory/releases) - página oficial de lanzamientos
- [Repositorio del proyecto](https://github.com/hyz1992/agent-app-factory) - código fuente
- [Seguimiento de problemas](https://github.com/hyz1992/agent-app-factory/issues) - reportar problemas y sugerencias
- [Guía de contribución](https://github.com/hyz1992/agent-app-factory/blob/main/CONTRIBUTING.md) - cómo contribuir

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para expandir y ver ubicación del código fuente</strong></summary>

> Actualizado: 2024-01-29

| Funcionalidad | Ruta del archivo                                                                                                                               | Línea    |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| package.json | [`package.json`](https://github.com/hyz1992/agent-app-factory/blob/main/package.json)                                                  | 1-52    |
| Entrada CLI     | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js)                                        | 1-123   |
| Comando de inicialización   | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)                                  | 1-427   |
| Comando de ejecución     | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js)                                     | 1-294   |
| Comando de continuación     | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js)                            | 1-87    |
| Definición de canalización   | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml)                                               | 1-87    |
| Definición de planificador   | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md)          | 1-301   |
| Matriz de permisos     | [`policies/capability.matrix.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/capability.matrix.md)                  | 1-44    |
| Política de fallos     | [`policies/failure.policy.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/failure.policy.md)                        | 1-200   |
| Estándares de código     | [`policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md)                        | 1-287   |
| Estándares de códigos de error   | [`policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md)                              | 1-134   |
| Especificación de Changelog | [`policies/changelog.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/changelog.md)                                  | 1-87    |

**Información clave de versiones**:
- `version = "1.0.0"`: versión de lanzamiento inicial
- `engines.node = ">=16.0.0"`: requisito mínimo de versión Node.js

**Versiones de dependencias**:
- `chalk@^4.1.2`: estilos de color de terminal
- `commander@^11.0.0`: análisis de argumentos de línea de comandos
- `fs-extra@^11.1.1`: extensiones de sistema de archivos
- `inquirer@^8.2.5`: línea de comandos interactiva
- `ora@^5.4.1`: cargador de terminal elegante
- `yaml@^2.3.4`: análisis y serialización YAML

</details>
