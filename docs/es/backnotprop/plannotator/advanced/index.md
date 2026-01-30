---
title: "Funcionalidades Avanzadas: Colaboración, Compartir e Integración de Notas | plannotator"
sidebarTitle: "Colaboración en Equipo + Archivo de Notas"
subtitle: "Funcionalidades Avanzadas: Colaboración, Compartir e Integración de Aplicaciones de Notas"
order: 3
description: "Domina las capacidades de colaboración en equipo e integración de notas de Plannotator. Comparte planes a través de URL, integra con Obsidian/Bear y soporta entornos de desarrollo remoto."
---

# Funcionalidades Avanzadas

Después de dominar las revisiones de planes y código básicas, este capítulo te llevará a desbloquear las capacidades avanzadas de Plannotator: compartir colaborativo en equipo, integración de aplicaciones de notas, soporte para desarrollo remoto y configuración flexible de variables de entorno.

::: warning Requisitos Previos
Antes de comenzar este capítulo, asegúrate de haber completado:
- [Inicio Rápido](../start/getting-started/): Comprender los conceptos básicos de Plannotator
- [Fundamentos de Revisión de Planes](../platforms/plan-review-basics/): Dominar las operaciones básicas de revisión de planes
:::

## Contenido del Capítulo

| Curso | Descripción | Casos de Uso Adecuados |
|--- | --- | ---|
| [Compartir por URL](./url-sharing/) | Compartir planes y comentarios a través de URL para lograr colaboración en equipo sin backend | Necesidad de compartir resultados de revisión con miembros del equipo |
| [Integración con Obsidian](./obsidian-integration/) | Guardar automáticamente los planes aprobados en el vault de Obsidian | Usar Obsidian para gestionar la base de conocimiento |
| [Integración con Bear](./bear-integration/) | Guardar planes en Bear a través de x-callback-url | Usuarios de macOS/iOS que usan Bear para notas |
| [Modo Remoto](./remote-mode/) | Usar en entornos remotos como SSH, devcontainer, WSL | Escenarios de desarrollo remoto |
| [Configuración de Variables de Entorno](./environment-variables/) | Conocer todas las variables de entorno disponibles y sus usos | Necesidad de personalizar el comportamiento de Plannotator |

## Ruta de Aprendizaje Sugerida

```
┌─────────────────────────────────────────────────────────────────┐
│  Orden de Aprendizaje Recomendado                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Compartir por URL      ← Más utilizado, esencial para     │
│       ↓                    colaboración en equipo              │
│  2. Integración de Notas   ← Elige según la aplicación de     │
│     ├─ Integración Obsidian (Usuarios de Obsidian)            │
│     └─ Integración Bear     (Usuarios de Bear)                 │
│       ↓                                                     │
│  3. Modo Remoto            ← Si desarrollas en entorno       │
│       ↓                    remoto                            │
│  4. Configuración de       ← Solo si necesitas               │
│     Variables de Entorno    personalización profunda         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

::: tip Aprendizaje Bajo Demanda
No es necesario completar todo el contenido en orden. Si solo necesitas la función de compartir, con aprender Compartir por URL es suficiente; si no usas desarrollo remoto, puedes omitir el Modo Remoto.
:::

## Próximos Pasos

Después de completar el aprendizaje de funcionalidades avanzadas, puedes:

- Ver [Problemas Comunes](../faq/common-problems/): Resolver problemas encontrados durante el uso
- Ver [Referencia de API](../appendix/api-reference/): Conocer la API completa de Plannotator
- Ver [Modelos de Datos](../appendix/data-models/): Comprender profundamente las estructuras de datos internas
