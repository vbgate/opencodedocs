---
title: "API: Referencia de comandos | Agent Skills"
sidebarTitle: "API Referencia"
subtitle: "API y referencia de comandos"
description: "Conoce la API de Agent Skills. Comandos de construcción, tipos TypeScript y niveles de impacto."
tags:
  - "Referencia"
  - "API"
  - "Línea de comandos"
  - "Definiciones de tipos"
prerequisite: []
---

# API y referencia de comandos

Esta página proporciona referencia completa de API y comandos de Agent Skills, incluyendo comandos de la cadena de herramientas de compilación, definiciones de tipos TypeScript, formatos de plantillas SKILL.md y valores de enumeración de niveles de impacto.

## Definiciones de tipos TypeScript

### ImpactLevel（Nivel de impacto）

El nivel de impacto se usa para identificar el grado de impacto en rendimiento de la regla, hay 6 niveles:

| Valor | Descripción | Escenario de aplicación |
|--- | --- | ---|
| `CRITICAL` | Cuello de botella clave | Debe repararse, de lo contrario afecta seriamente la experiencia del usuario (como cascadas de solicitudes, tamaño de paquete no optimizado) |
| `HIGH` | Mejora importante | Mejora significativa del rendimiento (como caché del servidor, eliminación de props duplicados) |
| `MEDIUM-HIGH` | Prioridad media-alta | Mejora obvia del rendimiento (como optimización de obtención de datos) |
| `MEDIUM` | Mejora media | Mejora medible del rendimiento (como optimización de Memo, reducción de re-render) |
| `LOW-MEDIUM` | Prioridad media-baja | Mejora ligera del rendimiento (como optimización de renderizado) |
| `LOW` | Mejora incremental | Micro-optimización (como estilo de código, patrones avanzados) |

**Ubicación del código fuente**: `types.ts:5`
