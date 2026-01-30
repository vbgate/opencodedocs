---
title: "Funciones de la Plataforma: Descubrimiento, Consulta y Carga de Habilidades | opencode-agent-skills"
sidebarTitle: "Domina las Seis Funciones Principales"
subtitle: "Funciones de la Plataforma: Descubrimiento, Consulta y Carga de Habilidades | opencode-agent-skills"
description: "Aprende los módulos principales de opencode-agent-skills, incluyendo descubrimiento de habilidades, consulta, carga y recomendaciones automáticas. Domina las principales funciones del complemento en 10 minutos."
order: 2
---

# Funciones de la Plataforma

Esta sección profundiza en los módulos principales de OpenCode Agent Skills, incluyendo descubrimiento de habilidades, consulta, carga, recomendaciones automáticas, ejecución de scripts y lectura de archivos. Una vez que domines estas funciones, podrás aprovechar al máximo las capacidades de gestión de habilidades del complemento, permitiendo que la IA trabaje más eficientemente en tus tareas de desarrollo.

## Requisitos Previos

::: warning Verifica antes de comenzar
Antes de estudiar esta sección, asegúrate de haber completado:

- [Instalación de OpenCode Agent Skills](../start/installation/) - El complemento está correctamente instalado y en ejecución
- [Crea tu Primera Habilidad](../start/creating-your-first-skill/) - Comprender la estructura básica de las habilidades
:::

## Contenido de Este Capítulo

| Curso | Descripción | Herramientas Principales |
| --- | --- | --- |
| [Mecanismo de Descubrimiento de Habilidades](./skill-discovery-mechanism/) | Comprender desde qué ubicaciones el complemento descubre automáticamente habilidades, dominar las reglas de prioridad | - |
| [Consultar y Listar Habilidades Disponibles](./listing-available-skills/) | Usar la herramienta `get_available_skills` para buscar y filtrar habilidades | `get_available_skills` |
| [Cargar Habilidades al Contexto de Sesión](./loading-skills-into-context/) | Usar la herramienta `use_skill` para cargar habilidades, comprender el mecanismo de inyección XML | `use_skill` |
| [Recomendación Automática de Habilidades](./automatic-skill-matching/) | Comprender el principio de coincidencia semántica, permitir que la IA descubra automáticamente habilidades relacionadas | - |
| [Ejecutar Scripts de Habilidades](./executing-skill-scripts/) | Usar la herramienta `run_skill_script` para ejecutar scripts de automatización | `run_skill_script` |
| [Leer Archivos de Habilidades](./reading-skill-files/) | Usar la herramienta `read_skill_file` para acceder a los archivos de soporte de las habilidades | `read_skill_file` |

## Ruta de Aprendizaje

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Orden de Aprendizaje Recomendado              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   1. Mecanismo de Descubrimiento  →  2. Listar Habilidades Disponibles  →  3. Cargar Habilidades
│         │                          │                    │
│         │                          │                    │
│         ▼                          ▼                    ▼
│   Comprender origen de habilidades  Aprender a buscar habilidades  Dominar método de carga
│                                                                         │
│                              ▼                                          │
│                                                                         │
│   4. Recomendación Automática  ←──  5. Ejecutar Scripts  ←──  6. Leer Archivos
│         │                    │                  │
│         ▼                    ▼                  ▼
│   Comprender coincidencia inteligente  Ejecutar automatización  Acceder archivos de soporte
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Se recomienda seguir el orden**:

1. **Primero aprende el mecanismo de descubrimiento** - Comprender desde dónde provienen las habilidades y cómo se determinan las prioridades
2. **Luego aprende a consultar habilidades** - Dominar el uso de la herramienta `get_available_skills`
3. **Después aprende a cargar habilidades** - Comprender `use_skill` y el mecanismo de inyección XML
4. **Luego aprende las recomendaciones automáticas** - Comprender cómo funciona la coincidencia semántica (opcional, más teórico)
5. **Finalmente aprende scripts y archivos** - Estas son funciones avanzadas, aprender según necesidades

::: tip Ruta de Inicio Rápido
Si solo quieres comenzar rápidamente, puedes aprender solo las primeras tres lecciones (Descubrimiento → Consulta → Carga), y completar las demás según necesidades.
:::

## Siguientes Pasos

Una vez completado este capítulo, puedes continuar aprendiendo:

- [Funciones Avanzadas](../advanced/) - Profundizar en la compatibilidad con Claude Code, integración con Superpowers, prioridad de espacios de nombres y otros temas avanzados
- [Preguntas Frecuentes](../faq/) - Consultar resolución de problemas e instrucciones de seguridad cuando encuentres dificultades
- [Apéndice](../appendix/) - Ver referencias de API y mejores prácticas
