---
title: "Funcionalidades Avanzadas: Análisis en Profundidad | opencode-dcp"
sidebarTitle: "Evitar Eliminación Incorrecta de Contenido Clave"
subtitle: "Funcionalidades Avanzadas: Análisis en Profundidad"
description: "Aprende las características avanzadas de DCP como el mecanismo de protección y la persistencia de estado. Domina las técnicas de uso en escenarios complejos, evita la poda incorrecta de contenido clave y optimiza el aciertos de caché."
order: 30
---

# Funcionalidades Avanzadas

Este capítulo explica en profundidad las características avanzadas de DCP, ayudándote a comprender los mecanismos internos del plugin y a utilizar DCP correctamente en escenarios complejos.

::: warning Prerrequisitos
Antes de estudiar este capítulo, asegúrate de haber completado:
- [Instalación e Inicio Rápido](../start/getting-started/) - Comprender la instalación y uso básico de DCP
- [Configuración Completa](../start/configuration/) - Familiarizarse con el sistema de configuración de DCP
- [Explicación Detallada de Estrategias de Poda Automática](../platforms/auto-pruning/) - Entender las estrategias de poda principales de DCP
:::

## Contenido del Capítulo

| Curso | Descripción | Escenario Adecuado |
| --- | --- | --- |
| [Mecanismo de Protección](./protection/) | Protección de turnos, herramientas protegidas y modo de archivos protegidos | Evitar poda incorrecta de contenido clave |
| [Persistencia de Estado](./state-persistence/) | Cómo DCP conserva el estado de poda y estadísticas entre sesiones | Entender el mecanismo de almacenamiento de datos |
| [Impacto en Caché de Prompt](./prompt-caching/) | El impacto de la poda de DCP en Prompt Caching | Optimizar la tasa de aciertos de caché |
| [Manejo de Subagentes](./subagent-handling/) | El comportamiento y limitaciones de DCP en sesiones de subagentes | Al usar la herramienta Task |

## Recomendaciones de Ruta de Aprendizaje

```
Mecanismo de Protección → Persistencia de Estado → Impacto en Caché de Prompt → Manejo de Subagentes
      ↓                    ↓                        ↓                            ↓
   Obligatorio          Aprender según          Aprender al optimizar    Aprender al usar
                       necesidades              el rendimiento           subagentes
```

**Orden recomendado**:

1. **Mecanismo de Protección** (obligatorio) - Esta es la característica avanzada más importante. Comprenderla permite que DCP evite eliminar incorrectamente contenido clave.
2. **Persistencia de Estado** (según necesidades) - Si deseas entender cómo DCP registra estadísticas o necesitas depurar problemas de estado.
3. **Impacto en Caché de Prompt** (al optimizar rendimiento) - Cuando te preocupas por la optimización de costos de API, necesitas equilibrar la relación entre poda y caché.
4. **Manejo de Subagentes** (al usar subagentes) - Si utilizas la herramienta Task de OpenCode para delegar subtareas, necesitas comprender las limitaciones de DCP.

## Siguientes Pasos

Después de completar este capítulo, puedes:

- Consultar [Preguntas Frecuentes y Solución de Problemas](../faq/troubleshooting/) para resolver problemas encontrados durante el uso
- Leer [Mejores Prácticas](../faq/best-practices/) para aprender cómo maximizar el ahorro de Tokens
- Profundizar en [Visión General de Arquitectura](../appendix/architecture/) para entender la implementación interna de DCP
