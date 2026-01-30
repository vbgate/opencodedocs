---
title: "Avanzado: Pipeline y Mecanismos Internos | Tutorial de AI App Factory"
sidebarTitle: "Avanzado: Pipeline"
subtitle: "Avanzado: Pipeline y Mecanismos Internos"
description: "Profundiza en el pipeline de 7 etapas de AI App Factory, el planificador Sisyphus, los mecanismos de seguridad y permisos, y las estrategias de manejo de errores. Domina la optimización del contexto y técnicas de configuración avanzada."
tags:
  - "Pipeline"
  - "Planificador"
  - "Seguridad y permisos"
  - "Manejo de errores"
prerequisite:
  - "start-pipeline-overview"
order: 80
---

# Avanzado: Pipeline y Mecanismos Internos

Este capítulo explica en profundidad los mecanismos centrales y funcionalidades avanzadas de AI App Factory, incluyendo el funcionamiento detallado del pipeline de 7 etapas, las estrategias de planificación del planificador Sisyphus, los mecanismos de permisos y seguridad, las estrategias de manejo de errores, y cómo optimizar el contexto para ahorrar costos de Token.

::: warning Requisitos previos
Antes de estudiar este capítulo, asegúrate de haber completado:
- [Inicio Rápido](../../start/getting-started/) y [Instalación y Configuración](../../start/installation/)
- [Visión General del Pipeline de 7 Etapas](../../start/pipeline-overview/)
- [Integración de Plataforma](../../platforms/claude-code/) configuración
:::

## Contenido del Capítulo

Este capítulo incluye los siguientes temas:

### Explicación Detallada del Pipeline de 7 Etapas

- **[Etapa 1: Bootstrap - Estructuración de Ideas de Producto](stage-bootstrap/)**
  - Aprende cómo convertir ideas de producto vagas en documentos estructurados
  - Comprende el formato de entrada y salida del Bootstrap Agent

- **[Etapa 2: PRD - Generación de Documento de Requisitos del Producto](stage-prd/)**
  - Genera PRDs de nivel MVP, incluyendo historias de usuario, lista de funcionalidades y objetivos no incluidos
  - Domina las técnicas de descomposición de requisitos y ordenamiento de prioridades

- **[Etapa 3: UI - Diseño de Interfaz y Prototipos](stage-ui/)**
  - Utiliza la habilidad ui-ux-pro-max para diseñar estructuras UI y prototipos previsualizables
  - Comprende el flujo de diseño de interfaz y las mejores prácticas

- **[Etapa 4: Tech - Diseño de Arquitectura Técnica](stage-tech/)**
  - Diseña una arquitectura técnica mínima viable y modelos de datos Prisma
  - Domina los principios de selección técnica y diseño arquitectónico

- **[Etapa 5: Code - Generación de Código Ejecutable](stage-code/)**
  - Genera código frontend y backend, pruebas y configuraciones basado en el Schema UI y el diseño Tech
  - Comprende el flujo de generación de código y el sistema de plantillas

- **[Etapa 6: Validation - Validación de Calidad del Código](stage-validation/)**
  - Valida la instalación de dependencias, verificación de tipos, schema de Prisma y calidad del código
  - Domina el proceso de verificación de calidad automatizada

- **[Etapa 7: Preview - Generación de Guía de Despliegue](stage-preview/)**
  - Genera documentación completa de instrucciones de ejecución y configuración de despliegue
  - Aprende la integración CI/CD y configuración de Git Hooks

### Mecanismos Internos

- **[Explicación Detallada del Planificador Sisyphus](orchestrator/)**
  - Comprende cómo el planificador coordina el pipeline, gestiona el estado y ejecuta verificaciones de permisos
  - Domina las estrategias de planificación y principios de la máquina de estados

- **[Optimización del Contexto: Ejecución Multi-Sesión](context-optimization/)**
  - Aprende cómo usar el comando `factory continue` para ahorrar Tokens
  - Domina las mejores prácticas para crear nuevas sesiones en cada etapa

- **[Mecanismos de Permisos y Seguridad](security-permissions/)**
  - Comprende la matriz de límites de capacidad, manejo de excesos y mecanismos de verificación de seguridad
  - Domina la configuración de seguridad y gestión de permisos

- **[Manejo de Errores y Reversión](failure-handling/)**
  - Aprende la identificación de errores, mecanismos de reintentos, estrategias de reversión y flujos de intervención manual
  - Domina las técnicas de diagnóstico de fallas y recuperación

## Recomendaciones de Ruta de Aprendizaje

### Orden Recomendado de Estudio

1. **Primero completa el Pipeline de 7 Etapas** (en orden)
   - Bootstrap → PRD → UI → Tech → Code → Validation → Preview
   - Cada etapa tiene entradas y salidas claras, estudiar en orden establece una comprensión completa

2. **Luego estudia el planificador y la optimización del contexto**
   - Comprende cómo Sisyphus coordina estas 7 etapas
   - Aprende cómo optimizar el contexto para ahorrar costos de Token

3. **Finalmente estudia seguridad y manejo de errores**
   - Domina los límites de permisos y mecanismos de seguridad
   - Conoce los escenarios de error y estrategias de respuesta

### Puntos Clave para Diferentes Roles

| Rol | Capítulos de Enfoque |
| ---- | ------------ |
| **Desarrollador** | Code, Validation, Tech, Orchestrator |
| **Product Manager** | Bootstrap, PRD, UI, Preview |
| **Tech Lead** | Tech, Code, Security, Failure Handling |
| **DevOps Engineer** | Validation, Preview, Context Optimization |

## Siguientes Pasos

Después de completar este capítulo, puedes continuar aprendiendo:

- **[Preguntas Frecuentes y Solución de Problemas](../../faq/troubleshooting/)** - Resuelve problemas en el uso real
- **[Mejores Prácticas](../../faq/best-practices/)** - Domina técnicas para usar Factory eficientemente
- **[Referencia de Comandos CLI](../../appendix/cli-commands/)** - Ve la lista completa de comandos
- **[Estándares de Código](../../appendix/code-standards/)** - Conoce las normas que debe seguir el código generado

---

💡 **Consejo**: Si encuentras problemas durante el uso, consulta primero el capítulo de [Preguntas Frecuentes y Solución de Problemas](../../faq/troubleshooting/).
